# 为什么这个插件反复失效 —— 根因复盘与防复发需求定义（轻量 PRD）

> 复盘对象：Stash v0.31.1（Windows 中文环境）第三方插件 `stashOpenMediaPlayerRemote`，上游 `MrArgparse/stashOpenMediaPlayerRemote` v1.0.2（无 LICENSE、1 star、0 issue/PR、最后 push 2026-08-14）。核实日期：2026-11-10。本文只讨论「为什么会反复坏」与「需要什么机制才不会再坏」；文中路径均为仓库相对路径，敏感值一律以 `<占位>` 表示。
>
> 相关文档：[架构设计与任务分工](ARCHITECTURE.md) · [任务分解 WBS](TASKS.md) · [复现证据](EVIDENCE.md) · [多语言说明](i18n.md)

> 本地路径说明：文中出现的 `scripts/`、`github-prepare/`、`config.yml` 等均属本地私有工作区的临时路径，只用于还原当时的排查与打包过程，公开仓库并不包含这些文件、也不存在缺件，请勿据此查找；发布物的权威依据是仓库根目录的 `index.yml` 与完整性自检结果，本文及同批文档仅为派生视图。
>
> Note on local paths: mentions of `scripts/`, `github-prepare/`, `config.yml` and similar refer to a private local workspace used only to document the original investigation and packaging steps; they are not part of this public repository and are not missing files, so do not look for them here. The authoritative release artifacts are `index.yml` at the repository root and the integrity self-check; all docs in this batch are derived views.

## 1. 一句话结论

**这不是「中文编码 bug 修了又犯」，而是修复始终停留在「本机插件文件」这一层，从未被固化进「插件源 → 构建 → 分发 → 更新 → 验收」的发布链路。** 于是任何一次「更新/重装」、任何一次目录迁移、任何一份过时的交接文档，都能把已验收通过的修复合法地还原成故障。真正的缺陷不是 `cp936`，而是**没有任何机制保证「验证过的那份代码」就是「用户正在运行的那份代码」**。

## 2. 产品目标与用户故事

| 编号 | 目标（正交） | 可度量含义 |
| --- | --- | --- |
| G1 | 一致性 | 任意时刻可判定「线上插件源 / 分发 zip / 本机运行文件」同源且哈希可复现 |
| G2 | 可诊断 | 任何失效在用户一次点击内给出可见原因，定位不再依赖抓 stdin 原始字节 |
| G3 | 可传承 | 接手者与上游无需本机记忆或私有文档即可独立复现、验证、分发与评估 |

| 角色 | 用户故事 |
| --- | --- |
| 最终用户 | 作为中文 Windows 上的 Stash 用户，我希望点「外部打开」后要么成功、要么看到明确原因，这样不会把故障误判成「没装好」而反复重装 |
| 接手运维的人 | 作为接手运维的人，我希望 clone 后一条命令即可校验三者一致性并复现 locale 问题，这样不依赖含密钥的本地《交接文档.md》，也不被历史误判带偏 |
| 上游维护者 | 作为上游维护者，我希望在不接触任何用户环境信息的前提下拿到可复现的最小证据与 13/14 locale 矩阵，这样能在自己的仓库评估并合并修复 |
| fork 发布者 | 作为 fork 发布者，我希望发布脚本拒绝含敏感信息或哈希不一致的产物，这样「公开发布」不依赖人的细心 |

## 3. 失效时间线

| # | 阶段 | 事件 | 暴露层次 |
| --- | --- | --- | --- |
| 1 | 首次失效 | 非 ASCII 路径点击无反应：`sys.stdin.read()` 按 cp936 解 UTF-8 字节 → `Invalid \escape` → exit 1 | 代码层 / 可观测性层 |
| 2 | 误判 ① | 交接文档写「后端正常、根因在 DOM」：`test_backend*.py` 手工喂合法 JSON，绕过真实 stdin | 验证层 / 文档层 |
| 3 | 误判 ② | 写「Stash 写出未转义反斜杠」；抓 stdin 原始字节后推翻：utf-8 可解析，gbk 精确复现 column 715 | 验证层 / 可观测性层 |
| 4 | 本机修复验收通过 | 改 UTF-8 字节解码、GraphQL 取路径、全链路 try/catch、`.scene-toolbar` + MutationObserver；Ctrl+F5 后成功 | — |
| 5 | 再次失效（覆盖） | 用户执行「更新」，插件源仍指上游 v1.0.2，修复被合法覆盖回退 | 发布层 |
| 6 | 再次失效（半装） | 「更新」= 先卸载再安装；卸载因旧记录指向上游失败，manifest / log.py / install-*.py 被删未装回，`import log` 崩 | 生命周期 / 状态层 |
| 7 | 慢性漂移 | 安装目录迁移两次，config.yml 的 backup_directory_path / metadata 仍指失效旧路径；早期脚本写死绝对路径；zip 因 mtime 导致 sha256 每次变化 | 配置层 / 发布层 |
| 8 | 固化 | fork `bslnssb/…` 1.0.3 + 完整性校验 + 可复现构建 + 脱敏 + 勘误表 + 13 语言文档与上游 issue #1 | — |

## 4. 分层根因表

| 层次 | 具体机制 | 为什么当时没发现 | 需求编号 |
| --- | --- | --- | --- |
| 代码层（后端） | Stash 写入的是**合法 UTF-8 JSON**；中文 Windows 上 `sys.stdin.encoding=gbk/cp936`，`sys.stdin.read()` 按 cp936 解码，中文变乱码且吞掉成对 `\\` 中的一个 → `json.loads` 抛 `Invalid \escape` → exit 1。影响**所有含非 ASCII 路径的 Windows** | 开发/测试机默认 UTF-8；错误发生在进程最入口且无日志，页面只表现为「点了没反应」 | R01 R10 |
| 代码层（前端） | 依赖「文件信息」标签 XPath 取路径、无 try/catch、按钮注入早于异步渲染 | 验收只走 happy path | R02 R03 R04 |
| 验证层（C） | 手工构造合法 JSON、直接 Popen 充当测试，绕开 Stash 真实 stdin 字节链路 | 「测试通过」被当成「链路通过」 | R09 R10 |
| 可观测性层（补充） | 后端 exit 1 时 Stash 不展示 stderr，无结构化日志与退出码映射，前端静默失败 | 每次定位都要重新抓 stdin 原始字节，于是靠猜，产生误判 ①② | R03 R11 |
| 缓存 / 交付层（D 后半） | 插件 JS 被浏览器 304 缓存，改完必须 Ctrl+F5 | 改完自己刷新过即以为生效 | R11 |
| 发布层（A、G） | 修复只落本机文件，插件源仍指上游 v1.0.2；本地修复文件 ≠ 可分发 zip ≠ 线上插件源，三者无绑定校验 | 验收在「刚改完」的瞬间完成，没覆盖「更新/重装之后」 | R05 R06 R07 R09 |
| 构建可复现性层（G） | zip 含 mtime，sha256 每次变化，哈希无法充当一致性凭证 | 未把哈希当作校验输入 | R07 |
| 生命周期 / 状态层（B） | Stash「更新」先卸载再安装；卸载阶段失败后删掉 manifest / log.py / install-*.py 却未装回，形成局部残留态 | 「半装」比完全没修更难查 | R12 |
| 配置层（E） | 安装目录迁移两次，config.yml 的 backup_directory_path / metadata 仍指失效旧路径；早期脚本写死绝对路径 | 一次迁移后仍能跑，漂移累积到重装才爆发 | R13 |
| 文档层（F） | 交接文档保留过时/误判结论，后续排查被自己人带偏 | 文档被当成事实而非带时间戳的假设 | R14 |
| 供应链 / 治理层（补充） | 上游 v1.0.2 无 LICENSE、1 star、0 issue/PR、最后 push 2026-08-14：单点依赖、无维护响应、无发布签名，且不能合法重新授权 | 选型时只看「能用」 | R15 R16 |

## 5. 需求池

| 编号 | 需求 | 优先级 | 验收标准（可验证） | 状态 |
| --- | --- | --- | --- | --- |
| R01 | stdin 一律走字节流 `sys.stdin.buffer.read().decode("utf-8", errors="replace")`，禁止依赖平台默认编码 | P0 | `scripts/test_stdin_utf8_locales.py` 在 14 组 locale 下旧写法 13/14 失败、新写法 14/14 通过；含中文路径真实点击成功 | 已落地 |
| R02 | 路径优先取同源 GraphQL `findScene(id){files{path}}` 且显式带 `name`，XPath 仅作兜底 | P0 | 隐藏「文件信息」标签后仍能打开 | 已落地 |
| R03 | 前后端全链路 try/catch + 可见错误提示，禁止静默失败 | P0 | 分别注入后端 exit 1、GraphQL 失败、路径不存在，页面均显示具体错误 | 已落地 |
| R04 | 按钮注入锚定 `.scene-toolbar` + MutationObserver | P0 | 连续切换 10 个场景，按钮存在且仅 1 个 | 已落地 |
| R05 | 插件源指向 fork `index.yml`（version 1.0.3），不改插件 ID | P0 | 干净环境执行 Stash「更新/重装」后 R06 全通过 | 已落地 |
| R06 | `scripts/check_plugin_integrity.py`：按 manifest.files 比对 8 个插件文件与 5 个修复标记、按 URL 内容识别插件源、校验 zip 与 index.yml 的 sha256 | P0 | 把任一文件换回上游 v1.0.2 或改回上游 URL，脚本非零退出并列出差异项 | 已落地 |
| R07 | 可复现构建：固定时间戳，zip 哈希恒定 | P0 | 连续两次执行 `github-prepare/tools/prepare.py`，产出 sha256 相同 | 已落地 |
| R08 | 发布前脱敏扫描作为前置拒绝条件 | P0 | `github-prepare/fork/` 扫描 0 命中；植入反例能被检出 | 已落地 |
| R09 | 真实链路端到端回归并纳入发布门禁，禁止手工构造 JSON / 直接 Popen 充当验收 | P1 | 门禁覆盖「Stash 实发 stdin 字节 → 插件进程 → 播放器调用」，含 ≥14 组 locale 与非 ASCII 路径；不一致时拒绝发布 | 部分 |
| R10 | locale 实测矩阵可复现 | P1 | 任意 clone 后运行 `docs/reproduce_locales.py` 可复现 13/14 与 14/14 | 已落地 |
| R11 | 浏览器缓存失效与版本可见性 | P1 | 插件 JS 带版本化参数或安装后提示刷新；「关于」可见当前生效 version 与来源 URL | 待办 |
| R12 | 更新流程原子性 / 残留态自检 | P1 | 模拟卸载失败后自动补齐或明确回滚报错，不产生半装态 | 待办 |
| R13 | 配置与脚本零绝对路径，迁移后可自检 | P1 | 全仓盘符/绝对路径 0 命中；config.yml 迁移后校验通过 | 部分 |
| R14 | 文档勘误表 + 事故记录，误判结论显式作废 | P1 | 两条误判均带「已推翻」标记并链到 `docs/EVIDENCE.md` | 已落地 |
| R15 | 上游协同与合规声明 | P2 | 上游 issue #1 含英文正文、13 语言折叠摘要与 13/14 矩阵；`NOTICE.md` 声明 parent 与归属；不新增项目级 LICENSE | 已落地 |
| R16 | 上游长期无维护 / 无 LICENSE 的分发策略决策 | P2 | 形成书面决策记录，写明触发条件与备选方案 | 待办 |

## 6. 待确认问题

1. 上游 issue #1 若长期无回应，是否把 fork 从「补丁分发」升级为「独立实现」？授权边界由谁裁定？
2. `check_plugin_integrity.py` 只需留在发布门禁，还是做成 Stash 更新后的自动钩子？后者会引入对 Stash 内部目录的写入依赖。
3. 上游若发布 v1.0.3 或更高版本，fork 的版本号如何避让才能不冲突、又不被 Stash 判为降级？
4. 含密钥的本地《交接文档.md》永不上传；脱敏边界是否需要双人复核 + 发布前签名？
5. 14 组 locale 矩阵是否纳入 CI 常驻，是否值得扩展到非 Windows 平台？

## 7. 给架构师的交接提示：必须是「机制」，不是「文档提醒」

| 不能靠提醒的事 | 必须落成的机制 | 对应需求 |
| --- | --- | --- |
| 「记得按 UTF-8 读 stdin」 | 统一输入适配层 + CI locale 矩阵，默认编码写法在门禁层被拒绝 | R01 R09 R10 |
| 「更新前别覆盖修复」 | 插件源指向 fork、完整性校验、可复现哈希三者绑定，门禁在不一致时拒绝产出 | R05 R06 R07 R09 |
| 「记得看日志 / 记得 Ctrl+F5」 | 运行时错误上报契约 + 版本化资源与可见生效版本 | R03 R11 |
| 「重装一遍试试」 | 安装器原子性与残留态自检，把「半装」态变成不可达状态或显式报错 | R12 |
| 「发布前记得检查密钥 / 记得改文档」 | 脱敏扫描作为发布前置拒绝条件；真相源是脚本、`index.yml` 与可机读勘误表，文档只作派生视图 | R08 R13 R14 |

> 判定原则：一条防复发措施，如果**删掉所有文档后仍然生效**，才算机制；否则只是提醒。

---

相关文档：[架构设计与任务分工](ARCHITECTURE.md) · [任务分解 WBS](TASKS.md) · [复现证据](EVIDENCE.md) · [多语言说明](i18n.md)
