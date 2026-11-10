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
  <b>Tiếng Việt</b> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · bản vá không chính thức cho UTF-8 / đường dẫn không phải ASCII

> Dự án gốc: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Fork này chỉ sửa lỗi và bổ sung tài liệu — **không phải plugin mới, không phải sản phẩm cạnh tranh**. Khi bản sửa được hợp nhất vào dự án gốc, nên quay lại dùng nguồn gốc.
> Giấy phép và ghi nhận nguồn: [NOTICE.md](NOTICE.md); bản vá dùng chung cho dự án gốc: [patches/](patches/).

## Fork này sửa những gì

- Hiện tượng: trên Windows, nếu đường dẫn cài đặt Stash hoặc đường dẫn video chứa ký tự không phải ASCII, bấm «Mở bằng trình phát bên ngoài» không có phản ứng và nhật ký hiện `Invalid \escape` / `exit status 1`.
- Nguyên nhân: Stash ghi **JSON UTF-8 hợp lệ** vào luồng stdin của plugin. Nhưng trên Windows, Python giải mã bằng bảng mã ANSI của hệ thống (cp936 / cp932 / cp949 / cp1251, v.v.), nên các ký tự không phải ASCII bị lỗi mã hóa và "nuốt" mất một trong hai ký tự của cặp `\\`. Do đó `json.loads` ném lỗi `Invalid \escape`, tiến trình kết thúc với exit 1 và trình phát không bao giờ được khởi chạy.
- Phạm vi: **mọi Windows có đường dẫn chứa ký tự không phải ASCII**, không chỉ các hệ thống dùng tiếng Trung.
- Ba sửa đổi: phần backend đọc trực tiếp byte bằng `sys.stdin.buffer.read().decode("utf-8")`; phần frontend lấy đường dẫn qua truy vấn GraphQL cùng nguồn gốc `findScene(id){files{path}}` (XPath trên DOM chỉ còn là phương án dự phòng); nút được neo vào `.scene-toolbar` kèm MutationObserver, và mọi lỗi đều hiển thị rõ ràng thay vì thất bại âm thầm.

## Cài đặt

Stash → Cài đặt → Plugin → Thêm nguồn, nhập URL bên dưới, cài **Stash Open Media Player Remote** (version 1.0.3), sau đó nhấn **Ctrl+F5** trên trình duyệt.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Kiểm tra

Mở bất kỳ cảnh nào, **giữ nguyên tab mặc định «Tổng quan / Overview»** (không chuyển sang «Tệp tin»), nhấn **Ctrl+F5** rồi bấm nút «Trình phát bên ngoài» → trình phát trên máy sẽ mở ra. Nếu thất bại, trang sẽ hiển thị lỗi cụ thể.

## Tài liệu

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Những tài liệu này chỉ là dạng xem phái sinh; chuẩn tham chiếu là `index.yml` cùng bước kiểm tra toàn vẹn.

> Bản tiếng Anh đầy đủ: [README.md](README.md)
