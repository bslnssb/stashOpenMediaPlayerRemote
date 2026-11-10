# Stash Open Media Player Remote · 修复说明 / ไทย

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp874`。

## 问题

บน Windows หากพาธติดตั้ง Stash หรือพาธวิดีโอมีอักขระที่ไม่ใช่ ASCII ปุ่มเปิดโปรแกรมเล่นภายนอกจะไม่ตอบสนอง และบันทึกจะแสดง `Invalid \escape` / `exit status 1`

## 原因

ส่วนหลังบ้านอ่าน JSON UTF-8 ด้วย `sys.stdin.read()` ซึ่ง Windows ถอดรหัสด้วยหน้ารหัส ANSI (cp874) ทำให้อักขระและชุดอักขระหลีกเสียหาย

## 修复

อ่านไบต์ดิบด้วย `sys.stdin.buffer.read().decode('utf-8')` และใช้เวอร์ชันที่แก้แล้วจาก fork

## 安装与验收

เพิ่ม URL ของ `index.yml` ใน «Settings → Plugins → Sources» หรือแทนที่ `.py` / `.js` จาก `src/` แล้วกด Ctrl+F5 ในเบราว์เซอร์

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
