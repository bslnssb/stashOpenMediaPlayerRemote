# Stash Open Media Player Remote · 修复说明 / Português

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1252`。

## 问题

No Windows, se o caminho de instalação do Stash ou o do vídeo contiver caracteres não ASCII (acentos, til…), o botão do reprodutor externo não responde; o registro mostra `Invalid \escape` / `exit status 1`.

## 原因

O backend lê o JSON UTF-8 com `sys.stdin.read()` e o Windows decodifica pela página de código ANSI (cp1252), corrompendo caracteres e sequências de escape.

## 修复

Ler os bytes brutos: `sys.stdin.buffer.read().decode('utf-8')`. Versão corrigida no fork.

## 安装与验收

Adicione a URL do `index.yml` em «Configurações → Plugins → Fontes» do Stash ou substitua `.py` / `.js` a partir de `src/`; depois Ctrl+F5 no navegador.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
