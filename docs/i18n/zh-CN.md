# Stash Open Media Player Remote · 修复说明 / 简体中文

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp936 / gbk`。

## 问题

在 Windows 上，如果 Stash 安装目录或视频路径含中文等非 ASCII 字符，点击「外部播放器」完全没反应；Stash 日志里是 `Invalid \escape` / `exit status 1`。

## 原因

插件后端用 `sys.stdin.read()` 读 Stash 写出的 UTF-8 JSON，Windows 会按系统 ANSI 代码页 cp936 解码，中文变乱码并吞掉一个转义反斜杠。

## 修复

改成 `sys.stdin.buffer.read().decode('utf-8')` 直接读原始字节。非官方修复版见 fork 链接。

## 安装与验收

在 Stash「设置 → 插件 → 源」添加 `index.yml` 地址，或手动替换 `src/` 里的 `.py` / `.js`；改完浏览器按 Ctrl+F5 强刷。

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
