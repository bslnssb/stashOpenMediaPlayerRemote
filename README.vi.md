<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a><br>
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <b>Tiếng Việt</b> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote

**Một cú nhấp là mở cảnh trong Stash bằng trình phát bạn vẫn dùng — VLC, MPV, MPC-HC, SMPlayer, PotPlayer. Nó phát tệp gốc chứ không phải luồng đã chuyển mã của trình duyệt, và vẫn dùng được khi Stash chạy trong Docker trên NAS.**

## Plugin này làm gì

Mỗi trang cảnh (scene) có thêm nút **Mở bằng trình phát ngoài** trên thanh công cụ. Nhấp một lần, đường dẫn tệp thật của cảnh được gửi tới trình phát trên máy bạn.

- **Một cú nhấp, nút luôn hiện** — nút nằm trên thanh công cụ của cảnh, cạnh nút đếm lượt xem; không cần mở tab «Tệp».
- **Trình phát nào cũng được** — miễn là chạy được theo dạng «tệp thực thi + đường dẫn tệp»: VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer… Bạn chỉ cần nhập đường dẫn đầy đủ tới tệp exe.
- **Chế độ cục bộ** — Stash và trình phát trên cùng một máy: máy chủ Stash tự khởi chạy trình phát.
- **Chế độ từ xa** — Stash trong Docker / Unraid / NAS / máy khác: trình duyệt chuyển liên kết `stashopenmediaplayerremote://` cho một trợ thủ nhỏ cài trên máy bạn, trợ thủ này mở trình phát tại máy cục bộ. Máy chủ không cần truy cập vào máy tính của bạn.
- **Ánh xạ đường dẫn** — đổi đường dẫn trong container thành đường dẫn thật, ví dụ `/data` → `//NAS/stash`.
- **Định dạng đường dẫn theo trình phát** — URL `file://` hay đường dẫn gốc; tự nhận biết (VLC và MPC khác nhau) hoặc ép bằng `keep` / `remove`.
- **Đếm lượt xem (tùy chọn)** — mở bằng trình phát ngoài cũng tính là một lượt xem.

### Vì sao cần trình phát ngoài?

Trình phát tích hợp của Stash phải chuyển mã hoặc dựa vào codec của trình duyệt: tốn CPU, hỗ trợ phụ đề ASS và HDR kém. Trình phát trên máy tính mở tệp gốc với giải mã phần cứng, đổi phụ đề và âm thanh, HDR và phím tắt — đồng thời giảm tải chuyển mã cho máy chủ.

## Cài đặt

1. Trong **Cài đặt → Tiện ích → Có sẵn → Thêm nguồn**, thêm nguồn sau:

```text
Tên:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![Thêm nguồn](images/add-source.jpg)

2. Cài **Stash Open Media Player Remote** từ nguồn đó.

![Cài tiện ích](images/install-plugin.jpg)

3. Trong phần cài đặt tiện ích, điền **Media Player Path** bằng đường dẫn đầy đủ tới trình phát, ví dụ `C:\Program Files\SMPlayer\smplayer.exe`.
4. Chỉ với chế độ từ xa: bật **Use Remote Protocol Handler** và chạy trợ thủ một lần trên máy có trình phát (xem bên dưới).
5. Tải lại Stash trong trình duyệt bằng <kbd>Ctrl</kbd>+<kbd>F5</kbd>.

## Các thiết lập

| Thiết lập | Tác dụng |
|---|---|
| **Media Player Path** | Đường dẫn đầy đủ tới tệp exe, ví dụ `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto` (mặc định: VLC nhận `file://`, MPC nhận đường dẫn gốc), `keep` (luôn `file://`), `remove` (luôn đường dẫn gốc) |
| **Use Remote Protocol Handler** | Bật cho Docker / Unraid / NAS / Stash từ xa: trợ thủ trên máy tính khởi chạy trình phát thay vì máy chủ |
| **Path Mapping From / To** | Thay tiền tố tùy chọn, ví dụ `/data` → `//NAS/stash` |
| **Increment Play Count** | Cộng một lượt xem khi mở bằng trình phát ngoài |

![Cấu hình tiện ích](images/plugin-config.jpg)

## Chế độ từ xa (Docker, Unraid, NAS)

Trình duyệt mở `stashopenmediaplayerremote://open?player=...&path=...` và trình phát khởi chạy trên máy bạn. Cài trợ thủ một lần cho mỗi máy cần phát:

```bash
python install-stashOpenMediaPlayerRemote.py
```

Script đăng ký giao thức trong registry Windows hoặc dưới dạng trình xử lý `.desktop` trên Linux qua `xdg-mime`. Trên Windows không cần quyền quản trị.

![Cài trình xử lý giao thức](images/install-protocol.jpg)

Lần đầu bấm nút, hãy chấp nhận hộp thoại xin phép của trình duyệt.

## Khắc phục sự cố

### Không tìm thấy tệp

- **Path Mapping From** khớp với đường dẫn Stash lưu (đường dẫn hiện trên trang cảnh).
- **Path Mapping To** trỏ tới thư mục chia sẻ mà máy này thật sự mở được.
- Dán đường dẫn sau khi ánh xạ vào trình quản lý tệp và mở thử.

Ví dụ: `/data` → `//network_path/stash`

### Không thấy nút

Tải lại Stash sau khi cài hoặc cập nhật tiện ích. Nếu vẫn không có, vào **Cài đặt → Tiện ích** và tải lại tiện ích; sau khi cập nhật phải làm mới cả trang lẫn danh sách.

### Tắt hộp thoại xác nhận giao thức (tùy chọn)

Trình duyệt nhân Chromium hỏi mỗi lần mở `stashopenmediaplayerremote://`. Có thể cho phép vĩnh viễn bằng chính sách `AutoLaunchProtocolsFromOrigins` (JSON nằm trong README tiếng Anh, mục Troubleshooting). Khóa chính sách: Chrome `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`, Edge `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge`. Bản portable có thể bỏ qua chính sách hệ thống; bước này hoàn toàn tùy chọn.

## Fork này thay đổi gì (so với upstream v1.0.2)

Kho lưu trữ này là **fork không chính thức**. Bản thân tiện ích là tác phẩm của [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote); ở đây nó được sửa để chạy lại trên Windows có đường dẫn không phải ASCII và được phát hành ổn định.

- **Sập với đường dẫn không ASCII (bản sửa chính)** — Stash gửi JSON UTF-8 hợp lệ, nhưng Python trên Windows giải mã bằng bảng mã ANSI (cp936 / cp932 / cp949 / cp1251…): ký tự bị hỏng và một trong hai dấu gạch chéo ngược của `\\` bị nuốt mất, nên `json.loads` ném `Invalid \escape`, tác vụ kết thúc với mã 1 và trình phát không bao giờ mở. Phần backend giờ đọc byte thô từ stdin và giải mã UTF-8.
- **Bấm không phản hồi** — đường dẫn lấy qua truy vấn GraphQL cùng nguồn `findScene(id){files{path}}`; DOM/XPath chỉ còn là dự phòng. Lỗi khi đọc cấu hình không còn làm handler chết im lặng.
- **Nút biến mất** — chèn vào `.scene-toolbar` và gắn lại bằng `MutationObserver`, nên vẫn còn khi chuyển cảnh SPA hoặc thanh công cụ vẽ lại.
- **Lỗi hiển thị rõ** — mọi thất bại đều hiện toast kèm lý do thay vì «không có gì xảy ra».
- **Không lộ thông tin đăng nhập** — nhật ký không còn ghi `server_connection` (cookie phiên, ApiKey).
- **Phát hành kiểm chứng được** — zip tái tạo được, `index.yml` gắn với mã băm gói, tự kiểm tra toàn vẹn, ghi chú 13 ngôn ngữ.

Bản vá sẵn sàng gửi upstream ở [patches/](patches/); giấy phép và ghi công ở [NOTICE.md](NOTICE.md). Khi upstream phát hành bản sửa, nên quay lại nguồn của họ.

## Tương thích

- Đã thử với **Windows 11 + Stash v0.31.1** (Chrome / Edge). Tiện ích chỉ dùng `PluginApi` chuẩn và một tác vụ `raw`, nên các bản Stash mới nên chạy được.
- Trợ thủ giao thức cài trên **Windows** (registry) và **Linux** (`xdg-mime`). Trên macOS chế độ cục bộ vẫn chạy nhưng script chưa cài trợ thủ.
- Docker / Unraid / NAS cần **chế độ từ xa** và ánh xạ đường dẫn.
