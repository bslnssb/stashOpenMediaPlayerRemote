<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <b>Deutsch</b> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · Inoffizieller Fix für UTF-8 und Nicht-ASCII-Pfade

> Ursprüngliches Projekt: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Dieser Fork behebt ausschließlich Fehler und ergänzt die Dokumentation — **kein neues Plugin, keine Konkurrenz**. Sobald der Fix upstream übernommen ist, empfiehlt es sich, wieder die Originalquelle zu verwenden.
> Lizenz und Zuordnung: [NOTICE.md](NOTICE.md); allgemeine Patches für upstream: [patches/](patches/).

## Was dieser Fork behebt

- Symptom: Unter Windows bleibt ein Klick auf „Extern öffnen“ ohne Wirkung, sobald der Stash-Installationspfad oder der Videopfad Nicht-ASCII-Zeichen enthält; im Log erscheinen `Invalid \escape` / `exit status 1`.
- Ursache: Stash schreibt **gültiges UTF-8-JSON** in die stdin des Plugins. Python unter Windows dekodiert es jedoch mit der ANSI-Codepage des Systems (cp936 / cp932 / cp949 / cp1251 usw.); Nicht-ASCII-Zeichen werden zu Mojibake und verschlucken dabei eines der beiden Zeichen der Paarung `\\`. Dadurch wirft `json.loads` `Invalid \escape`, der Prozess endet mit exit 1 und der Player wird nie gestartet.
- Auswirkung: **jedes Windows mit Nicht-ASCII-Pfaden** — nicht nur Systeme mit chinesischer Locale.
- Drei Korrekturen: Das Backend liest Bytes direkt über `sys.stdin.buffer.read().decode("utf-8")`; das Frontend holt den Pfad über die gleichursprüngliche GraphQL-Abfrage `findScene(id){files{path}}` (DOM XPath nur noch als Rückfallebene); die Schaltfläche wird an `.scene-toolbar` verankert, ergänzt um einen MutationObserver, und jeder Fehler wird sichtbar angezeigt statt still zu scheitern.

## Installation

Stash → Einstellungen → Plugins → Quelle hinzufügen, die folgende URL eintragen, **Stash Open Media Player Remote** (version 1.0.3) installieren und anschließend im Browser **Strg+F5** drücken.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Prüfung

Öffne eine beliebige Szene, **bleibe auf dem Standard-Tab „Übersicht / Overview“** (nicht zu „Dateien“ wechseln), drücke **Strg+F5** und klicke auf die Schaltfläche „Externer Player“ → der lokale Player sollte starten. Schlägt es fehl, zeigt die Seite die konkrete Fehlermeldung.

## Dokumentation

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Diese Dokumente sind nur abgeleitete Ansichten; maßgeblich sind `index.yml` und die Integritätsprüfung.

> Vollständige englische Referenz: [README.md](README.md)
