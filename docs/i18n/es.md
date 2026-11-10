# Stash Open Media Player Remote · 修复说明 / Español

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1252`。

## 问题

En Windows, si la ruta de instalación de Stash o la del vídeo contiene caracteres no ASCII (ñ, tildes…), el botón del reproductor externo no responde; el registro muestra `Invalid \escape` / `exit status 1`.

## 原因

El backend lee el JSON UTF-8 con `sys.stdin.read()` y Windows lo decodifica con la página de códigos ANSI (cp1252), dañando caracteres y secuencias de escape.

## 修复

Leer los bytes tal cual: `sys.stdin.buffer.read().decode('utf-8')`. Versión corregida en el fork.

## 安装与验收

Añade la URL del `index.yml` en «Ajustes → Plugins → Fuentes» de Stash o sustituye `.py` / `.js` desde `src/`; después Ctrl+F5 en el navegador.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
