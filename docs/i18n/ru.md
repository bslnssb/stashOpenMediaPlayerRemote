# Stash Open Media Player Remote · 修复说明 / Русский

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1251`。

## 问题

В Windows, если путь установки Stash или путь к видео содержит не-ASCII символы (кириллицу и т. п.), кнопка внешнего плеера никак не реагирует; в журнале Stash — `Invalid \escape` / `exit status 1`.

## 原因

Бэкенд читает UTF-8 JSON через `sys.stdin.read()`, и Windows декодирует его системной ANSI-кодовой страницей (cp1251), искажая символы и escape-последовательности.

## 修复

Читать сырые байты: `sys.stdin.buffer.read().decode('utf-8')`. Исправленная версия — в форке.

## 安装与验收

Добавьте URL `index.yml` в «Настройки → Плагины → Источники» Stash или замените `.py` / `.js` из `src/`; затем Ctrl+F5 в браузере.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
