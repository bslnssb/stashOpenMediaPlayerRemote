<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <b>繁體中文</b> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a><br>
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash 外部播放器（Open Media Player Remote）

**一個按鈕，把 Stash 裡的影片丟給你自己慣用的播放器 —— VLC、MPV、MPC-HC、SMPlayer、PotPlayer 都可以。播放的是硬碟上的原始檔案，不是瀏覽器轉碼串流；Stash 裝在 Docker / NAS 上也能用。**

## 這個外掛在做什麼

每個場景（Scene）頁面的工具列會多一個「用外部播放器開啟」按鈕。按一下，這個場景的真實檔案路徑就會送進你電腦上的播放器。

- **一鍵開啟、按鈕常在** —— 按鈕就在場景工具列、緊鄰播放次數按鈕，任何場景頁都有，不必先切到「檔案」標籤頁。
- **播放器任你挑** —— 只要能用「執行檔 + 檔案路徑」從命令列啟動就行：VLC、MPV、MPC-HC/BE、SMPlayer、PotPlayer……你只要填播放器 exe 的完整路徑。
- **本機模式** —— Stash 和播放器在同一台電腦，由 Stash 伺服器直接啟動播放器。
- **遠端模式** —— Stash 跑在 Docker / Unraid / NAS / 另一台機器：瀏覽器把 `stashopenmediaplayerremote://` 交給裝在你電腦上的小幫手，由它在本機啟動播放器。伺服器不需要能連到你的桌面。
- **路徑對應** —— 把容器路徑換成真實路徑，例如 `/data` → `//NAS/stash`。
- **依播放器自動選路徑格式** —— 送出 `file://` URL 或原生路徑，預設自動判斷（VLC 偏 URL、MPC 偏路徑），也可用 `keep` / `remove` 強制。
- **可選記錄播放次數** —— 用外部播放器開啟也算一次觀看。

### 為什麼不直接用內建播放器？

內建播放器不是轉碼就是靠瀏覽器解碼：CPU 吃重，ASS 字幕與 HDR 支援有限。桌面播放器直接播原始檔，硬體解碼、多音軌、字幕樣式、HDR、快速鍵全都現成，也把轉碼壓力從伺服器上卸下來。

## 安裝

1. 在 **設定 → 外掛 → 可用外掛 → 新增來源** 加入外掛來源：

```text
名稱：
stashOpenMediaPlayerRemote

網址：
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![新增外掛來源](images/add-source.jpg)

2. 從這個來源安裝 **Stash Open Media Player Remote**。

![安裝外掛](images/install-plugin.jpg)

3. 開啟外掛設定，把 **Media Player Path** 填成播放器的完整路徑，例如 `C:\Program Files\SMPlayer\smplayer.exe`。
4. 只有遠端模式需要：勾選 **Use Remote Protocol Handler**，並在裝有播放器的那台電腦執行一次小幫手（見下）。
5. 在瀏覽器按 <kbd>Ctrl</kbd>+<kbd>F5</kbd> 強制重新整理 Stash。

## 設定項目

| 設定 | 作用 |
|---|---|
| **Media Player Path** | 播放器 exe 的完整路徑，例如 `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto`（預設：VLC 送 `file://`、MPC 送原生路徑）、`keep`（一律 `file://`）、`remove`（一律原生路徑） |
| **Use Remote Protocol Handler** | Docker / Unraid / NAS / 遠端 Stash 請開啟：讓瀏覽器啟動本機小幫手，而不是叫伺服器啟動 |
| **Path Mapping From / To** | 選用的前綴替換，例如 `/data` → `//NAS/stash` |
| **Increment Play Count** | 外部開啟時為這個場景加一次播放次數 |

![外掛設定](images/plugin-config.jpg)

## 遠端模式（Docker / Unraid / NAS）

瀏覽器會開啟 `stashopenmediaplayerremote://open?player=...&path=...`，由本機啟動播放器。每台要播放的電腦裝一次：

```bash
python install-stashOpenMediaPlayerRemote.py
```

腳本會在 Windows 登錄檔註冊通訊協定，或在 Linux 寫一個 `.desktop` 並以 `xdg-mime` 註冊。Windows 上不需要系統管理員權限。

![安裝通訊協定處理常式](images/install-protocol.jpg)

第一次按按鈕時，記得在瀏覽器彈窗按「允許」。

## 疑難排解

### 找不到媒體檔案

- **Path Mapping From** 要和 Stash 存的路徑一致（場景頁面上顯示的那個路徑）。
- **Path Mapping To** 要指向這台電腦真的打得開的共用資料夾。
- 把對應後的路徑貼到檔案總管，檔案要能直接開啟。

例如：`/data` → `//network_path/stash`

### 按鈕沒出現

安裝或更新外掛後要重新整理 Stash；還不行就到 **設定 → 外掛** 重新載入。更新之後「頁面」與「外掛清單」都要各重新整理一次。

### 關掉瀏覽器的通訊協定確認視窗（選用）

Chromium 系瀏覽器每次開啟 `stashopenmediaplayerremote://` 都會問一次，可用 `AutoLaunchProtocolsFromOrigins` 原則永久放行：

```json
[
  {
    "protocol": "stashopenmediaplayerremote",
    "allowed_origins": [
      "http://YOUR-STASH-SERVER:9999"
    ]
  }
]
```

在對應瀏覽器的原則機碼下新增字串值 `AutoLaunchProtocolsFromOrigins`，內容填上面的 JSON；各瀏覽器位置與原則頁面（`chrome://policy`、`edge://policy`、`vivaldi://policy`、`brave://policy`）與 Windows 版 Chrome / Edge 相同慣例。可攜版瀏覽器可能忽略系統原則，這一步完全選用。

## 這個 fork 改了什麼（相對上游 v1.0.2）

本儲存庫是**非官方分支**。外掛本身是 [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote) 的作品；這裡做的是讓它在非 ASCII 路徑的 Windows 上重新可用，並穩定地散布出去。

- **非 ASCII 路徑崩潰（主要修復）** —— Stash 送出的是合法 UTF-8 JSON，但 Windows 上的 Python 用系統 ANSI 代碼頁（cp936 / cp932 / cp949 / cp1251……）解碼：非 ASCII 字元變亂碼，且會把緊接其後的一個反斜線吃掉，`\\` 只剩一個，`json.loads` 丟出 `Invalid \escape`，工作以 exit 1 結束，播放器根本不會啟動。後端改為直接讀 stdin 原始位元組並以 UTF-8 解碼。
- **按了沒反應** —— 路徑改以同源 GraphQL `findScene(id){files{path}}` 取得，不再依賴「檔案」標籤頁是否展開；DOM/XPath 只作後備。設定查詢出錯也不會再讓點擊事件靜默失敗。
- **按鈕時有時無** —— 改為注入 `.scene-toolbar` 並掛 `MutationObserver` 持續補上，切場景、工具列重繪都不會消失。
- **錯誤看得見** —— 任何失敗都彈出 toast（或 alert）說明原因，不再「什麼都沒發生」。
- **不再外洩憑證** —— 外掛日誌不再把整個 `server_connection`（含 session cookie 與 ApiKey）寫進 Stash 日誌。
- **散布可驗證** —— 固定 mtime 的可重現 zip、`index.yml` 與套件雜湊綁定、完整性自檢、13 語言說明。

可直接提交上游的補丁（不含僅針對中文的改動）在 [patches/](patches/)；授權與歸屬見 [NOTICE.md](NOTICE.md)。若上游發布修復版，建議改回上游來源。

## 相容性

- 已在 **Windows 11 + Stash v0.31.1**（Chrome / Edge）實測。外掛只用標準 `PluginApi` 與 `raw` 工作，較新的 Stash 版本應都能用。
- 通訊協定小幫手支援 **Windows**（登錄檔）與 **Linux**（`xdg-mime`）。macOS 本機模式可用，但小幫手目前不由腳本安裝。
- Docker / Unraid / NAS 部署必須用**遠端模式**加路徑對應。

## 授權與歸屬

原始外掛作者：**MrArgparse** —— <https://github.com/MrArgparse/stashOpenMediaPlayerRemote>。上游儲存庫沒有 `LICENSE`，因此不對上游程式碼授予任何授權，本 fork 也不會代為重新授權。本 fork 新增內容以 CC0 1.0 提供，詳見 [NOTICE.md](NOTICE.md)。
