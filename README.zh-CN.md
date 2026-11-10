<p align="center">
  <a href="README.md">English</a> ·
  <b>简体中文</b> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · UTF-8 / 中文路径修复版（非官方 fork）

> 上游：https://github.com/MrArgparse/stashOpenMediaPlayerRemote （v1.0.2）
> 本 fork 只做缺陷修复与说明，**不是新插件、不是竞品**。上游合并修复后，建议改回上游源。
> 许可与归属见 [NOTICE.md](NOTICE.md)；给上游的通用补丁见 [patches/](patches/)。

## 工程文档

本 fork 的工程说明（非官方 UTF-8 / 非 ASCII 路径修复版，version 1.0.3）：

- [复盘](docs/POSTMORTEM.md) — 根因、失效时间线、分层根因表、R01–R16 需求池、待确认问题与给架构师的交接提示。
- [架构](docs/ARCHITECTURE.md) — 模块地图、3 条链路 Mermaid 图、关键契约、10 条约定与待明确事项。
- [任务](docs/TASKS.md) — T01–T19 WBS、依赖图与发布验收清单。
- [证据](docs/EVIDENCE.md) — 原始崩溃的复现步骤与留证。
- [13 语言说明](docs/i18n.md) — 修复说明的多语言摘要。

**这些文档只是派生视图，机制以 `index.yml` 与完整性自检（校验脚本）为准。**

在 Stash 中添加本 fork 作为插件源（**不要**再使用上游 v1.0.2 的源地址）：

`https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml`

## 这个 fork 修了什么

### 1. 致命问题：按钮点了完全没反应（100% 必现）

- **不是 Stash 的锅，也不是中文特有问题。**
  Stash 往插件 stdin 写的是**合法的 UTF-8 JSON**；中文 Windows 上
  `sys.stdin.read()` 会按系统 ANSI 代码页（`gbk` / cp936）解码，
  中文路径的 UTF-8 字节被解成乱码，而且某个汉字的末字节会把紧随其后的
  一个反斜杠当成双字节字符一起「吃掉」，于是原本正确转义的 `\\` 只剩一个 `\`：

  ```
  json.decoder.JSONDecodeError: Invalid \escape: line 1 column 715 (char 714)
  Plugin returned error: exit status 1
  ```

  后端在 `json.loads` 就退出，**根本没走到启动播放器那一步**，前端也不报错，
  表现就是「点了没动静」。

- **修法**：`sys.stdin.buffer.read().decode("utf-8")` 直接读原始字节，绕开系统区域设置。
- 影响面：**任何**安装路径或媒体路径含非 ASCII 字符的 Windows（中日韩、俄文、
  带重音字母……）都会中招，不只是中文。
- 顺带：`name` 不再因 `defaultArgs` 未合并而 `KeyError`；空路径显式报错；
  日志只打 `args`，不再把 `SessionCookie` 写进 Stash 日志。

### 2. 前端几处静默失败

| 原来 | 现在 |
|---|---|
| 靠 XPath 找页面里的「路径」行，只有展开「文件信息」标签才存在 | 改用同源 `/graphql` 的 `findScene(id){files{path}}` 取路径，DOM 方式保留作兜底 |
| 按钮只在 `.scene-file-info` 出现时注入，直开/刷新/SPA 切场景可能没有按钮 | `.scene-toolbar` + 全局 `MutationObserver`，任何标签页都在 |
| 配置查询 / 点击没有 `try/catch`，抛错即静默 | 全程捕获并弹提示（Toast，降级 `alert`），失败原因可见 |
| `args_map` 不带 `name`，依赖 Stash 合并默认值 | 显式带 `name: "mediaplayer"` |

### 3. 中文路径兼容（本 fork 特有）

前端对路径做 `encodeURIComponent`、后端 `unquote` 还原，是早期为绕开同一个
编码问题加的历史兜底。按 UTF-8 读字节后已非必需，但保留以兼容旧前端与特殊字符。
**给上游的通用补丁不含这一层**，见 `patches/`。

---

## 安装

### 方式 A：作为插件源添加（推荐）

Stash → 设置 → 插件 → 添加源，填：

```text
名称：stashOpenMediaPlayerRemote-zhfix
URL：
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

> 该源地址必须与仓库根目录的 [index.yml](index.yml) 绑定一致；其由来见 [复盘](docs/POSTMORTEM.md)，发布前请按 [发布验收清单](docs/TASKS.md) 逐项核对。文档只是派生视图，机制以 `index.yml` 与完整性自检为准。

然后安装 **Stash Open Media Player Remote**。

> ⚠️ 安装/更新后**浏览器必须 Ctrl+F5 强刷**（插件 JS 有 304 缓存）。
> 插件 JS 由 `/plugin/<id>/javascript` 实时读盘下发，**不需要重启 Stash**。

### 方式 B：手动替换两个文件

把你已装插件目录 `plugins/stashOpenMediaPlayerRemote/` 下的这两个文件替换成本仓库 `src/` 里的版本：

- `stashOpenMediaPlayerRemote.py`
- `stashOpenMediaPlayerRemote.js`

改前请自行备份。其余 6 个文件与上游 v1.0.2 完全一致。

### 验收（怎么确认修复真的生效）

1. 打开任意一个场景详情页，例如 `http://localhost:9999/scenes/3780`。
2. 按 **Ctrl + F5**：强制刷新，让浏览器重新下载插件 JS；普通 F5 会用旧缓存，看不到修复。
3. **不要切换标签**，保持页面默认打开的那个「简介 / Overview」标签。
4. 直接点页面上的「外部播放器」按钮 → 应弹出本机播放器。
   - 旧版本的毛病正是「必须先切到『文件信息』标签，按钮才有效」，
     所以特意停在「简介」标签测试，就是为了证明这个限制已经没了。
   - 现在若失败，页面会弹出明确错误提示，不再「点了没反应」。

> 若所在网络访问不了 `raw.githubusercontent.com`，方式 A 会添加失败；
> 请配置代理后重试，或改用方式 B 手动替换文件。

### 排障

1. 看 Stash 服务端日志（倒序、需要 ApiKey）：
   ```graphql
   { logs { time level message } }
   ```
   正常应为 `[Plugin / Stash Open Media Player Remote] Media player launched successfully`。
2. 插件 JS 的真实地址是 `/plugin/<id>/javascript`，不是 `/assets/...`。
3. **不要在 Stash UI 里「更新/重装」到上游源**，会把本地修复覆盖回去。

---

## 与上游的差异对照

| 文件 | 上游 v1.0.2 | 本 fork |
|---|---|---|
| `stashOpenMediaPlayerRemote.py` | `json.loads(sys.stdin.read())` | 按 UTF-8 读原始字节 + 容错兜底 + 参数校验 + 日志脱敏 |
| `stashOpenMediaPlayerRemote.js` | DOM XPath 取路径、无错误提示 | GraphQL 取路径 + 可见错误 + 稳定注入按钮 |
| `manifest` / `*.yml` / `index.yml` | 指向上游 | 指向本 fork、版本 `1.0.3`、zip 的 sha256 已重算 |
| 其余 5 个 `.py` | 原样 | 原样（sha256 一致） |

`patches/` 里的两个补丁是**去掉中文定制后的通用修复**，可直接用
`git apply` 打到上游 v1.0.2 源码上，用于提 PR / issue。

---

## 已知边界

- 上游仓库**没有 LICENSE**。本 fork 通过 GitHub Fork 建立、保留原作者归属，
  但不对上游代码重新授权；详见 [NOTICE.md](NOTICE.md)。
- 本 fork 不改插件 ID，所以与上游源同时添加时 Stash 会看到同一个插件的两个版本，
  **请只保留一个源**。
- 复现与验证证据（已脱敏）：[docs/EVIDENCE.md](docs/EVIDENCE.md)。
