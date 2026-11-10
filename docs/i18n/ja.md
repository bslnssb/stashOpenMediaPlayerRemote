# Stash Open Media Player Remote · 修复说明 / 日本語

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp932`。

## 问题

Windows で Stash のインストール先や動画のパスに日本語などの非 ASCII 文字が含まれると、「外部プレイヤー」ボタンを押しても何も起きません。Stash のログには `Invalid \escape` / `exit status 1` が出ます。

## 原因

プラグインのバックエンドが `sys.stdin.read()` で Stash の UTF-8 JSON を読むため、Windows がシステムの ANSI コードページ (cp932) でデコードし、文字化けとエスケープ破壊が起きます。

## 修复

`sys.stdin.buffer.read().decode('utf-8')` で生バイトを読むようにします。修正版は fork を参照してください。

## 安装与验收

Stash の「設定 → プラグイン → ソース」に `index.yml` の URL を追加するか、`src/` の `.py` / `.js` を差し替えてください。変更後はブラウザで Ctrl+F5 です。

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
