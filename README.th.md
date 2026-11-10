<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <b>ไทย</b> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · แพตช์ไม่เป็นทางการสำหรับ UTF-8 / พาธที่ไม่ใช่ ASCII

> โครงการต้นฉบับ: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> fork นี้แก้ไขข้อบกพร่องและเพิ่มเอกสารเท่านั้น — **ไม่ใช่ปลั๊กอินใหม่และไม่ใช่คู่แข่ง** เมื่อโครงการต้นฉบับรวมการแก้ไขแล้ว แนะนำให้กลับไปใช้แหล่งต้นฉบับ
> สัญญาอนุญาตและการอ้างอิงที่มา: [NOTICE.md](NOTICE.md); แพตช์ทั่วไปสำหรับโครงการต้นฉบับ: [patches/](patches/)

## fork นี้แก้ไขอะไร

- อาการ: บน Windows หากพาธติดตั้ง Stash หรือพาธวิดีโอมีอักขระที่ไม่ใช่ ASCII การกด «เปิดในโปรแกรมเล่นภายนอก» จะไม่มีปฏิกิริยาใด ๆ และบันทึกมี `Invalid \escape` / `exit status 1`
- สาเหตุ: Stash เขียน **JSON แบบ UTF-8 ที่ถูกต้อง** ลงใน stdin ของปลั๊กอิน แต่ Python บน Windows ถอดรหัสด้วยโค้ดเพจ ANSI ของระบบ (cp936 / cp932 / cp949 / cp1251 ฯลฯ) ทำให้อักขระที่ไม่ใช่ ASCII กลายเป็นตัวเพี้ยนและกลืนอักขระหนึ่งตัวในคู่ `\\` ส่งผลให้ `json.loads` โยนข้อผิดพลาด `Invalid \escape` โปรเซสจบด้วย exit 1 และไม่เคยไปถึงขั้นตอนเปิดโปรแกรมเล่น
- ขอบเขต: **Windows ทุกระบบที่มีพาธไม่ใช่ ASCII** ไม่จำกัดเฉพาะระบบภาษาไทยหรือภาษาจีน
- การแก้ไขสามข้อ: ฝั่งแบ็กเอนด์อ่านไบต์โดยตรงด้วย `sys.stdin.buffer.read().decode("utf-8")`; ฝั่งฟรอนต์เอนด์ดึงพาธผ่าน GraphQL แหล่งเดียวกัน `findScene(id){files{path}}` (XPath บน DOM เหลือเป็นเพียงทางสำรอง); ปุ่มถูกยึดกับ `.scene-toolbar` พร้อม MutationObserver และทุกความล้มเหลวจะแสดงข้อผิดพลาดที่มองเห็นได้ ไม่เงียบหายอีก

## การติดตั้ง

Stash → การตั้งค่า → ปลั๊กอิน → เพิ่มแหล่งที่มา ใส่ URL ด้านล่าง ติดตั้ง **Stash Open Media Player Remote** (version 1.0.3) แล้วกด **Ctrl+F5** ในเบราว์เซอร์

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## การตรวจสอบ

เปิดฉากใดก็ได้ **อยู่ในแท็บเริ่มต้น «ภาพรวม / Overview»** (อย่าสลับไปที่ «ไฟล์») กด **Ctrl+F5** แล้วคลิกปุ่ม «โปรแกรมเล่นภายนอก» → โปรแกรมเล่นในเครื่องควรเปิดขึ้น หากล้มเหลว หน้าจะแสดงข้อผิดพลาดที่ชัดเจน

## เอกสาร

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

เอกสารเหล่านี้เป็นเพียงมุมมองที่สืบทอดมา แหล่งอ้างอิงที่แท้จริงคือ `index.yml` และการตรวจสอบความสมบูรณ์

> ฉบับภาษาอังกฤษฉบับเต็ม: [README.md](README.md)
