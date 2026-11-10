# Stash Open Media Player Remote · 修复说明 / Türkçe

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1254`。

## 问题

Windows'ta Stash kurulum yolu veya video yolu ASCII olmayan karakterler (ş, ğ, ı vb.) içeriyorsa harici oynatıcı düğmesi yanıt vermez; Stash günlüğünde `Invalid \escape` / `exit status 1` görülür.

## 原因

Arka uç UTF-8 JSON'u `sys.stdin.read()` ile okur; Windows bunu sistem ANSI kod sayfasıyla (cp1254) çözer, karakterler ve kaçış dizileri bozulur.

## 修复

Ham baytları okuyun: `sys.stdin.buffer.read().decode('utf-8')`. Düzeltilmiş sürüm fork'ta.

## 安装与验收

Stash «Ayarlar → Eklentiler → Kaynaklar» bölümüne `index.yml` adresini ekleyin veya `src/` içindeki `.py` / `.js` dosyalarını değiştirin; ardından tarayıcıda Ctrl+F5.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
