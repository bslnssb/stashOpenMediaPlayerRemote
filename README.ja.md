<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <b>日本語</b> ·
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

# Stash Open Media Player Remote · UTF-8 / 非 ASCII パス修正版（非公式フォーク）

> 上流プロジェクト：https://github.com/MrArgparse/stashOpenMediaPlayerRemote （v1.0.2）
> このフォークは不具合の修正と説明のみを行います。**新しいプラグインでも競合製品でもありません**。上流に修正が取り込まれたら、上流のソースに戻すことを推奨します。
> ライセンスと帰属は [NOTICE.md](NOTICE.md)、上流向けの汎用パッチは [patches/](patches/) を参照してください。

## このフォークが修正した内容

- 症状：Windows で Stash のインストール先や動画のパスに非 ASCII 文字が含まれると、「外部で開く」を押しても反応せず、ログに `Invalid \escape` / `exit status 1` が出ます。
- 原因：Stash がプラグインの stdin に書き込むのは**正当な UTF-8 JSON** です。ところが Windows 上の Python はシステムの ANSI コードページ（cp936 / cp932 / cp949 / cp1251 など）でデコードするため、非 ASCII 文字が文字化けを起こし、対になる `\\` の片方を飲み込んでしまいます。その結果 `json.loads` が `Invalid \escape` を投げ、プロセスは exit 1 で終了し、プレイヤーの起動まで到達しません。
- 影響：**非 ASCII パスを含むすべての Windows**。中国語環境に限りません。
- 修正は 3 点：バックエンドは `sys.stdin.buffer.read().decode("utf-8")` でバイト列を直接読みます。フロントエンドは同一オリジンの GraphQL `findScene(id){files{path}}` でパスを取得します（DOM XPath はフォールバックのみ）。ボタンは `.scene-toolbar` にアンカーし MutationObserver を併用、失敗時は必ず可視のエラーを表示して、無言で失敗しないようにしました。

## インストール

Stash → 設定 → プラグイン → ソースを追加 で次の URL を入力し、**Stash Open Media Player Remote**（version 1.0.3）をインストールします。その後ブラウザで **Ctrl+F5** を押してください。

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## 動作確認

任意のシーンを開き、**既定の「概要 / Overview」タブのまま**（「ファイル情報」に切り替えない）で **Ctrl+F5** を押し、「外部プレイヤー」ボタンをクリックします → ローカルのプレイヤーが起動すれば成功です。失敗した場合は、ページに具体的なエラーが表示されます。

## ドキュメント

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

これらの文書は派生的なビューにすぎません。正となるのは `index.yml` と整合性チェックです。

> 英語の完全版：[README.md](README.md)
