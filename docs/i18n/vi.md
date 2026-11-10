# Stash Open Media Player Remote · 修复说明 / Tiếng Việt

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1258`。

## 问题

Trên Windows, nếu đường dẫn cài đặt Stash hoặc đường dẫn video chứa ký tự không phải ASCII (tiếng Việt có dấu…), nút trình phát ngoài không phản hồi; nhật ký ghi `Invalid \escape` / `exit status 1`.

## 原因

Backend đọc JSON UTF-8 bằng `sys.stdin.read()`; Windows giải mã theo bảng mã ANSI (cp1258), làm hỏng ký tự và chuỗi thoát.

## 修复

Đọc byte thô: `sys.stdin.buffer.read().decode('utf-8')`. Bản đã sửa nằm ở fork.

## 安装与验收

Thêm URL `index.yml` trong «Cài đặt → Plugin → Nguồn» của Stash hoặc thay `.py` / `.js` từ `src/`; sau đó Ctrl+F5 trong trình duyệt.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
