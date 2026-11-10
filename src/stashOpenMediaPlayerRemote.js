(function () {
    'use strict';

    const stash = window.PluginApi;

    function getElementByXpath(xpath) {
        return document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    function waitForElementClass(className, callback) {
        const existing = document.querySelector(`.${className}`);

        if (existing) {
            callback(existing);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(`.${className}`);

            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function safeDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
            return value;
        }
    }

    function isLikelyWindowsPlayer(mediaPlayerPath) {
        const p = (mediaPlayerPath || '').trim();
        return /^[A-Za-z]:\\/.test(p) || p.includes('\\');
    }

    function toCanonicalPaths(rawValue, preferWindowsNative) {
        const raw = (rawValue || '').trim();

        if (!raw) {
            return {
                nativePath: raw,
                fileUrl: raw
            };
        }

        const decodedRaw = safeDecodeURIComponent(raw);

        if (/^file:\/\//i.test(decodedRaw)) {
            try {
                const url = new URL(decodedRaw);
                const host = url.hostname;
                const pathname = safeDecodeURIComponent(
                    url.pathname || ''
                );

                if (host) {
                    const uncSlash =
                        `//${host}${pathname}`;

                    return {
                        nativePath: preferWindowsNative
                            ? uncSlash.replace(/\//g, '\\')
                            : uncSlash,
                        fileUrl:
                            `file:${encodeURI(uncSlash)}`
                    };
                }

                let localPath = pathname;

                if (/^\/[A-Za-z]:\//.test(localPath)) {
                    localPath = localPath.substring(1);

                    return {
                        nativePath: preferWindowsNative
                            ? localPath.replace(/\//g, '\\')
                            : localPath,
                        fileUrl:
                            `file:///${encodeURI(
                                localPath.replace(/\\/g, '/')
                            )}`
                    };
                }

                return {
                    nativePath: localPath,
                    fileUrl:
                        `file://${encodeURI(localPath)}`
                };
            } catch (e) {
                // ignore
            }
        }

        if (/^smb:\/\//i.test(decodedRaw)) {
            try {
                const url = new URL(decodedRaw);

                const uncSlash =
                    `//${url.hostname}${safeDecodeURIComponent(url.pathname || '')}`;

                return {
                    nativePath: preferWindowsNative
                        ? uncSlash.replace(/\//g, '\\')
                        : uncSlash,
                    fileUrl:
                        `file:${encodeURI(uncSlash)}`
                };
            } catch (e) {
                // ignore
            }
        }

        if (/^(\\\\|\/\/)/.test(decodedRaw)) {
            const uncSlash =
                decodedRaw
                    .replace(/^\\\\/, '//')
                    .replace(/\\/g, '/');

            return {
                nativePath: preferWindowsNative
                    ? uncSlash.replace(/\//g, '\\')
                    : uncSlash,
                fileUrl:
                    `file:${encodeURI(uncSlash)}`
            };
        }

        if (/^[A-Za-z]:[\\/]/.test(decodedRaw)) {
            const slashPath =
                decodedRaw.replace(/\\/g, '/');

            return {
                nativePath: decodedRaw,
                fileUrl:
                    `file:///${encodeURI(slashPath)}`
            };
        }

        if (decodedRaw.startsWith('/')) {
            return {
                nativePath: decodedRaw,
                fileUrl:
                    `file://${encodeURI(decodedRaw)}`
            };
        }

        return {
            nativePath: decodedRaw,
            fileUrl: decodedRaw
        };
    }

    async function openMediaPlayerTask(path) {
        let configResult = null;

        // 配置查询失败不能让整个点击静默失败（原来没有 try/catch，
        // await 抛错会让 async handler 变成 unhandled rejection）。
        try {
            configResult =
                await PluginApi.utils.StashService
                    .getClient()
                    .query({
                        query:
                            PluginApi.GQL.ConfigurationDocument,
                        fetchPolicy: "network-only"
                    });
        } catch (err) {
            console.warn(
                '[ExternalPlayer] configuration query failed:',
                err
            );
        }

        const plugins =
            configResult?.data?.configuration?.plugins || {};

        const settings = {
            ...(plugins.stashOpenMediaPlayer || {}),
            ...(plugins.stashOpenMediaPlayerRemote || {})
        };

        const prefixMode =
            settings.fileUrlPrefixMode || "auto";

        const mediaPlayerPath =
            (settings.mediaPlayerPath || '').trim();

        const useRemoteProtocol =
            settings.useRemoteProtocol === true;

        const pathMapFrom =
            (settings.pathMapFrom || '').trim();

        const pathMapTo =
            (settings.pathMapTo || '').trim();

        const canonical =
            toCanonicalPaths(
                path,
                isLikelyWindowsPlayer(mediaPlayerPath)
            );

        let filePath = canonical.nativePath;
        let useFileUrl = false;

        if (useRemoteProtocol) {
            useFileUrl = false;
        } else if (prefixMode === 'keep') {
            useFileUrl = true;
        } else if (prefixMode === 'remove') {
            useFileUrl = false;
        } else {
            const lower =
                mediaPlayerPath.toLowerCase();

            if (lower.includes('vlc')) {
                useFileUrl = true;
            } else if (lower.includes('mpc')) {
                useFileUrl = false;
            } else {
                useFileUrl = /^file:\/\//i.test(path);
            }
        }

        filePath =
            useFileUrl
                ? canonical.fileUrl
                : canonical.nativePath;

        if (pathMapFrom && pathMapTo) {
            const escaped =
                pathMapFrom.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                );

            filePath =
                filePath.replace(
                    new RegExp(`^${escaped}`, 'i'),
                    pathMapTo
                );
        }

        if (settings.incrementPlayCount === true) {
            const match =
                location.pathname.match(
                    /\/scenes\/(\d+)/
                );
            
            if (match) {
                try {
                    await PluginApi.utils.StashService
                        .getClient()
                        .mutate({
                            mutation:
                                PluginApi.GQL.SceneAddPlayDocument,
                            variables: {
                                id: match[1]
                            },
                            refetchQueries: [
                                {
                                    query:
                                        PluginApi.GQL.FindSceneDocument,
                                    variables: {
                                        id: match[1]
                                    }
                                }
                            ]
                        });
                } catch (err) {
                    console.error(
                        "Failed to increment play count:",
                        err
                    );
                }
            }
        }

        if (useRemoteProtocol) {
            window.location.href =
                `stashopenmediaplayerremote://open?player=${encodeURIComponent(mediaPlayerPath)}&path=${encodeURIComponent(filePath)}`;

            return;
        }

        await PluginApi.utils.StashService.getClient().mutate({
            mutation: PluginApi.GQL.RunPluginTaskDocument,
            variables: {
                plugin_id: "stashOpenMediaPlayerRemote",
                task_name: "Open in Media Player",
                args_map: {
                    // 显式带上 name：不依赖 Stash 合并 yml 里的 defaultArgs
                    name: "mediaplayer",
                    path: encodeURIComponent(filePath),
                    mediaPlayerPath: encodeURIComponent(mediaPlayerPath)
                }
            }
        });
    }

    stash.openMediaPlayerTask =
        openMediaPlayerTask;

    function getSceneFilePath() {
        const dd =
            getElementByXpath(
                "//dt[(contains(text(),'Path') or contains(text(),'路径'))]/following-sibling::dd"
            );

        if (!dd) {
            return null;
        }

        // 优先使用纯文本路径(真实本地路径),避免 link.href 的 URL 编码破坏中文/特殊字符
        const text =
            dd.textContent?.trim();

        if (text) {
            return text;
        }

        const link = dd.querySelector("a");

        if (link) {
            return link.href;
        }

        const input =
            dd.querySelector("input, textarea");

        if (input) {
            return (
                input.value ||
                input.getAttribute("value") ||
                null
            );
        }

        return null;
    }

    // 直接走 GraphQL 取场景文件路径，不再依赖"文件信息"标签是否展开。
    // 同源请求会自动带登录 cookie，无需 ApiKey。
    async function fetchSceneFilePath() {
        const match =
            location.pathname.match(/\/scenes\/(\d+)/);

        if (!match) {
            return null;
        }

        try {
            const res = await fetch('/graphql', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query:
                        'query($id:ID!){findScene(id:$id){files{path}}}',
                    variables: { id: match[1] }
                })
            });

            if (!res.ok) {
                console.warn(
                    '[ExternalPlayer] findScene returned',
                    res.status
                );
                return null;
            }

            const json = await res.json();
            const files =
                json?.data?.findScene?.files || [];

            return files.length ? files[0].path : null;
        } catch (err) {
            console.warn(
                '[ExternalPlayer] findScene failed:',
                err
            );
            return null;
        }
    }

    // 失败必须让用户看见，避免再出现"点了没反应、无从排查"。
    function notify(message, isError) {
        try {
            const toast = window.PluginApi?.utils?.Toast;

            if (toast) {
                if (isError && toast.error) {
                    toast.error(message);
                    return;
                }
                if (!isError && toast.success) {
                    toast.success(message);
                    return;
                }
            }
        } catch (e) {
            // ignore, fall through
        }

        if (isError) {
            window.alert(message);
        } else {
            console.log('[ExternalPlayer]', message);
        }
    }

    function ensureMediaPlayerToolbarButton() {
        const toolbar =
            document.querySelector('.scene-toolbar');

        if (!toolbar) {
            return;
        }

        if (
            toolbar.querySelector(
                '.open-media-player-btn'
            )
        ) {
            return;
        }

        const btn =
            document.createElement('button');

        btn.type = 'button';
        btn.title =
            'Open in External Player';

        btn.className =
            'minimal open-media-player-btn btn btn-secondary';

        btn.innerHTML =
            '<svg data-prefix="fas" data-icon="external-link" class="svg-inline--fa fa-external-link fa-icon" role="img" viewBox="0 0 512 512" aria-hidden="true" width="1em" height="1em"><path fill="currentColor" d="M432 320h-32a16 16 0 0 0-16 16v112H80V160h112a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H64a64 64 0 0 0-64 64v304a64 64 0 0 0 64 64h368a64 64 0 0 0 64-64V336a16 16 0 0 0-16-16zM488 0H360a24 24 0 0 0-17 41l30 30L201 252a24 24 0 0 0 0 34l22 22a24 24 0 0 0 34 0L409 127l30 30A24 24 0 0 0 488 140V12a12 12 0 0 0-12-12z"></path></svg>';

        btn.addEventListener(
            'click',
            async function (e) {
                e.preventDefault();

                try {
                    // GraphQL 优先，DOM XPath 只作兜底
                    let path = await fetchSceneFilePath();

                    if (!path) {
                        path = getSceneFilePath();
                    }

                    if (!path) {
                        notify(
                            '外部播放器：取不到视频路径。请确认已登录 Stash，' +
                            '或打开「文件信息」标签后重试（F12 控制台有详情）。',
                            true
                        );
                        return;
                    }

                    await openMediaPlayerTask(path);
                    notify('已请求打开外部播放器', false);
                } catch (err) {
                    console.error('[ExternalPlayer]', err);
                    notify(
                        '外部播放器调用失败：' +
                        (err?.message || String(err)),
                        true
                    );
                }
            }
        );

        const wrapper = document.createElement('span');
        wrapper.appendChild(btn);

        const viewCount = toolbar.querySelector(
            '.count-button.increment-only'
        );

        if (viewCount) {
            const container = viewCount.closest('span');
        
            if (container && container.parentNode) {
                container.parentNode.insertBefore(
                    wrapper,
                    container
                );
                return;
            }
        }

        toolbar.appendChild(wrapper);
    }

    function watchSceneChanges() {
        let lastPath = location.pathname;
    
        setInterval(() => {
            if (location.pathname !== lastPath) {
                lastPath = location.pathname;
            
                if (location.pathname.startsWith('/scenes/')) {
                    waitForElementClass(
                        'scene-toolbar',
                        ensureMediaPlayerToolbarButton
                    );
                }
            }
        }, 100);
    }

    // 原来只在 .scene-file-info 出现时才注入按钮：停在「简介」标签、
    // 或直接打开/刷新场景页时，按钮可能压根不会出现。
    // 改为：初始等 .scene-toolbar + 全局观察 DOM，保证 SPA 切场景、
    // 工具栏重绘后按钮始终存在。
    function ensureButtonOnScenePage() {
        if (!location.pathname.startsWith('/scenes/')) {
            return;
        }

        ensureMediaPlayerToolbarButton();
    }

    const domObserver = new MutationObserver(() => {
        ensureButtonOnScenePage();
    });

    domObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    watchSceneChanges();

    waitForElementClass(
        'scene-toolbar',
        ensureButtonOnScenePage
    );
})();