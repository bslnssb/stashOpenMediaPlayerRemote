<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <b>日本語</b> ·
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

# Stash Open Media Player Remote

**ワンクリックで Stash のシーンを、いつも使っているプレイヤー（VLC / MPV / MPC-HC / SMPlayer / PotPlayer など）で開くプラグインです。ブラウザの変換ストリームではなく元ファイルを再生し、Stash が Docker や NAS 上で動いていても使えます。**

## このプラグインでできること

シーンページのツールバーに「外部プレイヤーで開く」ボタンが追加されます。クリックすると、そのシーンの実際のファイルパスがお使いの PC のプレイヤーに渡されます。

- **ワンクリック／ボタンは常に表示** — シーンツールバーの再生回数ボタンの隣に常駐し、「ファイル」タブを開く必要はありません。
- **プレイヤーは自由** — 「実行ファイル + ファイルパス」で起動できるものなら何でも（VLC、MPV、MPC-HC/BE、SMPlayer、PotPlayer など）。プレイヤーの exe のフルパスを設定するだけです。
- **ローカルモード** — Stash とプレイヤーが同じ PC にある場合、Stash サーバーが直接プレイヤーを起動します。
- **リモートモード** — Stash が Docker / Unraid / NAS / 別 PC にある場合、ブラウザが `stashopenmediaplayerremote://` リンクを PC 側の小さなヘルパーに渡し、ヘルパーがローカルでプレイヤーを起動します。サーバーからあなたの PC へアクセスできる必要はありません。
- **パスマッピング** — コンテナ内パスを実際のパスに置換（例: `/data` → `//NAS/stash`）。
- **プレイヤーごとのパス形式** — `file://` URL かネイティブパスかを自動判定（VLC と MPC で挙動が違う）、`keep` / `remove` で強制も可能。
- **再生回数の加算（任意）** — 外部プレイヤーで開いたときも 1 回としてカウントします。

### なぜ外部プレイヤーなのか

Stash 内蔵プレイヤーはトランスコードするか、ブラウザのデコーダに依存します。CPU 負荷が高く、ASS 字幕や HDR は苦手です。デスクトップのプレイヤーなら元ファイルをハードウェアデコードで再生でき、字幕・音声トラック切替・HDR・キーボード操作がそのまま使え、サーバーの負荷も下がります。

## インストール

1. **設定 → プラグイン → 利用可能 → ソースを追加** で以下を追加します。

```text
名前:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![ソースの追加](images/add-source.jpg)

2. そのソースから **Stash Open Media Player Remote** をインストールします。

![プラグインのインストール](images/install-plugin.jpg)

3. プラグイン設定の **Media Player Path** にプレイヤーのフルパスを入力します（例: `C:\Program Files\SMPlayer\smplayer.exe`）。
4. リモートモードのみ: **Use Remote Protocol Handler** を有効にし、プレイヤーがある PC でヘルパーを一度実行します（下記）。
5. ブラウザで <kbd>Ctrl</kbd>+<kbd>F5</kbd> を押して Stash を再読み込みします。

## 設定項目

| 設定 | 内容 |
|---|---|
| **Media Player Path** | プレイヤー exe のフルパス（例: `C:\Program Files\SMPlayer\smplayer.exe`） |
| **File URL Prefix Mode** | `auto`（既定: VLC は `file://`、MPC はネイティブパス）、`keep`（常に `file://`）、`remove`（常にネイティブパス） |
| **Use Remote Protocol Handler** | Docker / Unraid / NAS / リモート Stash ではオン。サーバーではなく PC 側のヘルパーを起動します |
| **Path Mapping From / To** | 任意のプレフィックス置換（例: `/data` → `//NAS/stash`） |
| **Increment Play Count** | 外部で開いたときに再生回数を 1 回加算 |

![プラグイン設定](images/plugin-config.jpg)

## リモートモード（Docker / Unraid / NAS）

ブラウザが `stashopenmediaplayerremote://open?player=...&path=...` を開き、あなたの PC 側でプレイヤーが起動します。再生したい PC ごとに一度だけ実行してください。

```bash
python install-stashOpenMediaPlayerRemote.py
```

Windows ではレジストリに、Linux では `.desktop` を `xdg-mime` で登録します。Windows で管理者権限は不要です。

![プロトコルハンドラのインストール](images/install-protocol.jpg)

初回クリック時にブラウザの確認ダイアログが出るので「許可」を選んでください。

## トラブルシューティング

### メディアファイルが見つからない

- **Path Mapping From** が Stash の保存パス（シーンページに表示されるパス）と一致しているか。
- **Path Mapping To** がこの PC から実際に開ける共有を指しているか。
- マッピング後のパスをエクスプローラーに貼って開けるか。

例: `/data` → `//network_path/stash`

### ボタンが表示されない

インストール／更新後に Stash を再読み込みしてください。それでも出ない場合は **設定 → プラグイン** でプラグインを再読み込みします。更新後はページとプラグイン一覧の両方を更新する必要があります。

### ブラウザのプロトコル確認を止める（任意）

Chromium 系ブラウザは `stashopenmediaplayerremote://` を開くたびに確認します。`AutoLaunchProtocolsFromOrigins` ポリシーで恒久的に許可できます（JSON は英語 README の同項目を参照）。ポリシーキーは Chrome なら `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`、Edge なら `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge` です。ポータブル版はシステムポリシーを無視することがあります。任意設定です。

## この fork の変更点（上流 v1.0.2 との差分）

本リポジトリは**非公式フォーク**です。プラグイン本体は [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote) の作品で、ここでは非 ASCII パスの Windows でも動くようにし、確実に配布できる形に整えています。

- **非 ASCII パスでのクラッシュ（主要な修正）** — Stash は正しい UTF-8 JSON を送りますが、Windows の Python が ANSI コードページ（cp936 / cp932 / cp949 / cp1251 など）でデコードし、`\\` の片方が消えて `json.loads` が `Invalid \escape` を投げ、exit 1 で終了してプレイヤーが起動しませんでした。stdin を生バイトで読み UTF-8 でデコードするよう変更しました。
- **クリックしても無反応** — パス取得を同一オリジンの GraphQL `findScene(id){files{path}}` に変更（DOM/XPath はフォールバック）。設定取得の失敗でハンドラが黙って死ぬこともなくなりました。
- **ボタンが消える** — `.scene-toolbar` に注入し、`MutationObserver` で再付与。SPA 遷移やツールバー再描画でも残ります。
- **エラーが見える** — 失敗時は理由をトースト（または alert）で表示します。
- **認証情報の漏洩を停止** — ログに `server_connection`（session cookie と ApiKey）を出さなくなりました。
- **配布の健全性** — 再現可能な zip、`index.yml` とハッシュの紐付け、整合性セルフチェック、13 言語の説明。

上流にそのまま送れるパッチは [patches/](patches/)、ライセンスと帰属は [NOTICE.md](NOTICE.md) を参照してください。上流が修正版を出したら、上流のソースに戻すことをおすすめします。

## 対応環境

- **Windows 11 + Stash v0.31.1**（Chrome / Edge）で動作確認済み。標準の `PluginApi` と `raw` タスクのみを使うため、最近の Stash でも動作するはずです。
- プロトコルヘルパーは **Windows**（レジストリ）と **Linux**（`xdg-mime`）に対応。macOS はローカルモードのみ可能で、ヘルパーは未対応です。
- Docker / Unraid / NAS では**リモートモード**とパスマッピングが必須です。
