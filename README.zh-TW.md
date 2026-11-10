<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <b>繁體中文</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · UTF-8 / 非 ASCII 路徑修復版（非官方 fork）

> 上游專案：https://github.com/MrArgparse/stashOpenMediaPlayerRemote （v1.0.2）
> 本 fork 只做缺陷修復與說明，**不是新外掛、不是競品**。上游合併修復後，建議改回上游來源。
> 授權與歸屬見 [NOTICE.md](NOTICE.md)；給上游的通用補丁見 [patches/](patches/)。

## 這個 fork 修了什麼

- 現象：Windows 上 Stash 的安裝路徑或影片路徑含有非 ASCII 字元時，點「外部開啟」沒有反應，日誌出現 `Invalid \escape` / `exit status 1`。
- 原因：Stash 寫入外掛 stdin 的是**合法 UTF-8 JSON**；Windows 上的 Python 以系統 ANSI 代碼頁（cp936 / cp932 / cp949 / cp1251 等）解碼，非 ASCII 字元變成亂碼並吞掉成對 `\\` 中的一個，`json.loads` 拋出 `Invalid \escape`，行程以 exit 1 結束，根本沒走到啟動播放器。
- 影響：**所有含非 ASCII 路徑的 Windows**，不限於中文環境。
- 修復三條：後端改用 `sys.stdin.buffer.read().decode("utf-8")` 直接讀位元組；前端改用同源 GraphQL `findScene(id){files{path}}` 取得路徑（DOM XPath 僅作後備）；按鈕錨定 `.scene-toolbar` 並搭配 MutationObserver，且任何失敗都顯示可見錯誤，不再靜默。

## 安裝

Stash → 設定 → 外掛 → 新增來源，填入下列位址，安裝 **Stash Open Media Player Remote**（version 1.0.3），接著在瀏覽器按 **Ctrl+F5**。

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## 驗收

開啟任意場景，**停在預設的「簡介 / Overview」分頁**（不要切到「檔案資訊」），按 **Ctrl+F5**，再點「外部播放器」按鈕 → 應會彈出本機播放器；若失敗，頁面會顯示具體錯誤。

## 文件

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

這些文件只是衍生檢視，機制以 `index.yml` 與完整性自檢為準。

> 完整英文參考：[README.md](README.md)
