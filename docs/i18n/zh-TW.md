# Stash Open Media Player Remote · 修复说明 / 繁體中文

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp950`。

## 问题

在 Windows 上，若 Stash 安裝目錄或影片路徑含中文等非 ASCII 字元，按下「外部播放器」完全沒有反應；Stash 記錄會出現 `Invalid \escape` / `exit status 1`。

## 原因

外掛後端以 `sys.stdin.read()` 讀取 Stash 輸出的 UTF-8 JSON，Windows 會用系統 ANSI 字碼頁 cp950 解碼，中文字變亂碼並吃掉一個跳脫反斜線。

## 修复

改用 `sys.stdin.buffer.read().decode('utf-8')` 直接讀原始位元組。非官方修正版見 fork 連結。

## 安装与验收

在 Stash「設定 → 外掛 → 來源」加入 `index.yml` 網址，或手動替換 `src/` 的 `.py` / `.js`；改完瀏覽器按 Ctrl+F5 強制重新整理。

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
