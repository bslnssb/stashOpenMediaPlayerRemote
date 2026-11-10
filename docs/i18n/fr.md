# Stash Open Media Player Remote · 修复说明 / Français

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1252`。

## 问题

Sous Windows, si le chemin d'installation de Stash ou celui de la vidéo contient des caractères non ASCII (accents…), le bouton du lecteur externe ne répond pas ; le journal indique `Invalid \escape` / `exit status 1`.

## 原因

Le backend lit le JSON UTF-8 via `sys.stdin.read()` et Windows le décode avec la page de codes ANSI (cp1252), ce qui corrompt les caractères et les séquences d'échappement.

## 修复

Lire les octets bruts : `sys.stdin.buffer.read().decode('utf-8')`. Version corrigée dans le fork.

## 安装与验收

Ajoutez l'URL du fichier `index.yml` dans « Paramètres → Plugins → Sources » de Stash ou remplacez `.py` / `.js` depuis `src/` ; puis Ctrl+F5 dans le navigateur.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
