import json
import re
import log
import sys
import subprocess
import os
from urllib.parse import unquote


def read_plugin_input():
    """读取并容错解析 Stash 传给插件的 JSON。

    真正根因（2026-11-10 复核）：Stash 写出的是**完全合法的 UTF-8 JSON**。
    但在中文 Windows 上 ``sys.stdin.read()`` 会按系统 ANSI 代码页
    （gbk / cp936）解码：UTF-8 的中文字节被解成乱码，且某个中文字符的
    末字节会被 gbk 当成双字节字符的前导字节，把紧随其后的一个反斜杠
    一起"吃掉"，于是 JSON 里原本成对的反斜杠只剩一个，
    ``server_connection.Dir`` 变成含非法转义序列的字符串，
    json.loads 抛 ``JSONDecodeError: Invalid \\escape``，进程 exit 1，
    播放器永远不会被启动。

    正确做法：直接读 stdin 的**原始字节**并按 UTF-8 解码。
    保留正则兜底只是为了兼容确实存在非法转义的旧版 / 手工输入。
    """
    raw_bytes = sys.stdin.buffer.read()
    raw = raw_bytes.decode("utf-8", errors="replace")

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # 只把「后面不是合法 JSON 转义字符」的单个反斜杠补成 \\；
        # 合法成对转义（\\、\"、\uXXXX 等）原样保留，不会被破坏。
        fixed = re.sub(
            r'\\(?:\\|["/bfnrtu])|\\',
            lambda m: m.group(0) if len(m.group(0)) == 2 else r"\\",
            raw,
        )
        try:
            return json.loads(fixed)
        except Exception:
            # 留一份现场，方便以后排查别的序列化问题
            try:
                with open(
                    r"C:\temp\stash_plugin_input_error.txt",
                    "w",
                    encoding="utf-8",
                    errors="replace",
                ) as f:
                    f.write(raw)
            except OSError:
                pass
            raise


json_input = read_plugin_input()
args = json_input.get("args", {}) or {}
name = args.get("name", "mediaplayer")

# 只记录 args：原实现把整个 server_connection（含 session cookie / ApiKey）
# 打进 Stash 日志，属于不必要的凭证外溢。
log.info(json.dumps({"args": args}, indent=2, ensure_ascii=False))

if name == "mediaplayer":
    mediaplayer_path = args.get("mediaPlayerPath", "") or ""
    path = args.get("path", "") or ""
    file_url_prefix_mode = args.get("fileUrlPrefixMode")

    if file_url_prefix_mode is None or file_url_prefix_mode == "undefined":
        file_url_prefix_mode = "auto"

    # 前端将路径经 encodeURIComponent 编码传递, 此处解码还原为真实路径
    # (早期为绕开 stdin 编码问题而加；保留以兼容旧前端/特殊字符)
    mediaplayer_path = unquote(mediaplayer_path)
    path = unquote(path)

    log.debug(f"mediaplayer_path: {mediaplayer_path}")
    log.debug(f"fileUrlPrefixMode: {file_url_prefix_mode}")
    log.debug(f"{name}: {path}")

    if not mediaplayer_path or not path:
        log.error(
            f"Missing player or media path: player={mediaplayer_path!r} path={path!r}"
        )
        sys.exit(1)

    # Check if media player path exists
    if not os.path.exists(mediaplayer_path):
        log.warning(f"Media player not found at: {mediaplayer_path}")
        log.info(
            "If running Stash in a Docker container, ensure the media player path is valid "
            "in the container environment, or use a remote playback method."
        )

    try:
        log.debug(f"Attempting to launch: {mediaplayer_path} {path}")
        subprocess.Popen([mediaplayer_path, path])
        log.info("Media player launched successfully")
    except FileNotFoundError as e:
        log.error(f"Media player executable not found: {e}")
    except OSError as e:
        log.error(f"Failed to launch media player: {e}")
    except Exception as e:
        log.error(f"Unexpected error launching media player: {e}")
