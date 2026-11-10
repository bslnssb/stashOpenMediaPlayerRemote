# Stash Open Media Player Remote · 修复说明 / Deutsch

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1252`。

## 问题

Unter Windows reagiert die Schaltfläche für den externen Player nicht, wenn der Installationspfad von Stash oder der Videopfad Nicht-ASCII-Zeichen (z. B. Umlaute) enthält; im Stash-Log steht `Invalid \escape` / `exit status 1`.

## 原因

Das Backend liest das UTF-8-JSON mit `sys.stdin.read()`; Windows dekodiert dabei mit der ANSI-Codepage (cp1252), wodurch Zeichen und Escape-Sequenzen beschädigt werden.

## 修复

Rohbytes direkt lesen: `sys.stdin.buffer.read().decode('utf-8')`. Korrigierte Version im Fork.

## 安装与验收

URL der `index.yml` unter „Einstellungen → Plugins → Quellen“ hinzufügen oder `.py` / `.js` aus `src/` ersetzen; danach im Browser Ctrl+F5.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
