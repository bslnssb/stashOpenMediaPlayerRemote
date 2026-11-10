<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <b>Deutsch</b><br>
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote

**Ein Klick, und eine Stash-Szene startet im Player deiner Wahl — VLC, MPV, MPC-HC, SMPlayer, PotPlayer. Abgespielt wird die Originaldatei statt eines Browser-Streams, und das funktioniert auch, wenn Stash in Docker auf einem NAS läuft.**

## Was dieses Plugin macht

Jede Szenen-Seite bekommt in der Werkzeugleiste eine Schaltfläche **Im externen Player öffnen**. Ein Klick schickt den echten Dateipfad dieser Szene an deinen Player.

- **Ein Klick, immer sichtbar** — die Schaltfläche sitzt neben dem Zähler in der Szenen-Werkzeugleiste; der Tab „Dateien" muss nicht geöffnet werden.
- **Beliebiger Player** — alles, was sich als „EXE + Dateipfad" starten lässt: VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer und andere. Du gibst nur den vollständigen Pfad zur EXE an.
- **Lokaler Modus** — Stash und Player auf demselben Rechner: der Stash-Server startet den Player selbst.
- **Remote-Modus** — Stash in Docker / Unraid / auf einem NAS / auf einem anderen Rechner: der Browser übergibt einen `stashopenmediaplayerremote://`-Link an einen kleinen Helfer auf deinem PC, der den Player lokal startet. Der Server braucht keinen Zugriff auf deinen Desktop.
- **Pfad-Zuordnung** — Container-Pfade in echte Pfade umschreiben, z. B. `/data` → `//NAS/stash`.
- **Pfadformat je Player** — `file://`-URL oder nativer Pfad, automatisch erkannt (VLC und MPC verhalten sich unterschiedlich) oder erzwungen über `keep` / `remove`.
- **Optionaler Wiedergabezähler** — ein externes Öffnen zählt als Wiedergabe.

### Warum überhaupt ein externer Player?

Der eingebaute Player von Stash muss transcodieren oder auf Browser-Codecs setzen: hohe CPU-Last, schwache Unterstützung für ASS-Untertitel und HDR. Ein Desktop-Player öffnet die Originaldatei mit Hardware-Dekodierung, Untertitel- und Tonspurwechsel, HDR und Tastenkürzeln — und nimmt dem Server die Transcodierung ab.

## Installation

1. Unter **Einstellungen → Plugins → Verfügbar → Quelle hinzufügen** diese Paketquelle eintragen:

```text
Name:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![Paketquelle hinzufügen](images/add-source.jpg)

2. Aus dieser Quelle **Stash Open Media Player Remote** installieren.

![Plugin installieren](images/install-plugin.jpg)

3. In den Plugin-Einstellungen **Media Player Path** auf den vollständigen Pfad des Players setzen, z. B. `C:\Program Files\SMPlayer\smplayer.exe`.
4. Nur Remote-Modus: **Use Remote Protocol Handler** aktivieren und den Helfer einmal auf dem Rechner mit dem Player ausführen (siehe unten).
5. Stash im Browser mit <kbd>Ctrl</kbd>+<kbd>F5</kbd> neu laden.

## Einstellungen

| Einstellung | Wirkung |
|---|---|
| **Media Player Path** | Vollständiger Pfad zur Player-EXE, z. B. `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto` (Standard: VLC bekommt `file://`, MPC einen nativen Pfad), `keep` (immer `file://`), `remove` (immer nativer Pfad) |
| **Use Remote Protocol Handler** | Für Docker / Unraid / NAS / entferntes Stash einschalten: der Helfer auf dem PC startet den Player, nicht der Server |
| **Path Mapping From / To** | Optionale Präfix-Ersetzung, z. B. `/data` → `//NAS/stash` |
| **Increment Play Count** | Zählt beim externen Öffnen eine Wiedergabe dazu |

![Plugin-Konfiguration](images/plugin-config.jpg)

## Remote-Modus (Docker, Unraid, NAS)

Der Browser öffnet `stashopenmediaplayerremote://open?player=...&path=...`, und der Player startet auf deinem Rechner. Der Helfer wird einmal pro PC installiert:

```bash
python install-stashOpenMediaPlayerRemote.py
```

Das Skript registriert das Protokoll in der Windows-Registrierung oder als `.desktop`-Handler unter Linux via `xdg-mime`. Unter Windows sind keine Administratorrechte nötig.

![Protokoll-Handler installieren](images/install-protocol.jpg)

Beim ersten Klick die Nachfrage des Browsers bestätigen.

## Fehlerbehebung

### Mediendatei nicht gefunden

- **Path Mapping From** entspricht dem Pfad, den Stash speichert (sichtbar auf der Szenen-Seite).
- **Path Mapping To** zeigt auf eine Freigabe, die dieser PC wirklich öffnen kann.
- Der zugeordnete Pfad lässt sich im Explorer direkt öffnen.

Beispiel: `/data` → `//network_path/stash`

### Schaltfläche erscheint nicht

Stash nach Installation oder Update neu laden. Hilft das nicht, unter **Einstellungen → Plugins** die Plugins neu laden — nach einem Update müssen sowohl Seite als auch Plugin-Liste aktualisiert werden.

### Protokoll-Abfrage des Browsers abschalten (optional)

Chromium-Browser fragen bei jedem `stashopenmediaplayerremote://`-Aufruf nach. Dauerhaft erlauben lässt sich das mit der Richtlinie `AutoLaunchProtocolsFromOrigins` (JSON im englischen README, Abschnitt Troubleshooting). Richtlinienschlüssel: Chrome `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`, Edge `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge`. Portable Builds ignorieren Systemrichtlinien teils; der Schritt ist rein optional.

## Was dieser Fork ändert (gegenüber Upstream v1.0.2)

Dieses Repository ist ein **inoffizieller Fork**. Das Plugin selbst stammt von [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote); hier wird es auf Windows mit Nicht-ASCII-Pfaden wieder lauffähig gemacht und verlässlich verteilt.

- **Absturz bei Nicht-ASCII-Pfaden (Hauptkorrektur)** — Stash sendet gültiges UTF-8-JSON, aber Python unter Windows dekodierte es mit der ANSI-Codepage (cp936 / cp932 / cp949 / cp1251 …): Zeichen wurden verstümmelt, einer der beiden Backslashes von `\\` verschwand, `json.loads` warf `Invalid \escape`, der Task endete mit Exit-Code 1 und der Player startete nie. Der Backend liest jetzt die Rohbytes von stdin und dekodiert UTF-8.
- **Klick ohne Reaktion** — der Pfad kommt über die gleichursprüngliche GraphQL-Abfrage `findScene(id){files{path}}`; DOM/XPath ist nur noch Rückfallebene. Fehler beim Laden der Einstellungen beenden den Klick-Handler nicht mehr still.
- **Verschwindende Schaltfläche** — wird in `.scene-toolbar` eingefügt und per `MutationObserver` erneut angehängt, übersteht also SPA-Wechsel und Neuzeichnen der Werkzeugleiste.
- **Sichtbare Fehler** — jeder Fehlschlag zeigt einen Toast mit der Ursache statt „es passiert nichts".
- **Keine Zugangsdaten im Log** — `server_connection` (Session-Cookie, ApiKey) wird nicht mehr protokolliert.
- **Saubere Verteilung** — reproduzierbares Zip, `index.yml` an den Paket-Hash gebunden, Integritäts-Selbsttest, Hinweise in 13 Sprachen.

Upstream-taugliche Patches liegen in [patches/](patches/), Lizenz und Urheberschaft in [NOTICE.md](NOTICE.md). Sobald Upstream die Korrektur veröffentlicht, am besten wieder dessen Quelle verwenden.

## Kompatibilität

- Getestet mit **Windows 11 + Stash v0.31.1** (Chrome / Edge). Das Plugin nutzt nur die Standard-`PluginApi` und einen `raw`-Task, neuere Stash-Versionen sollten funktionieren.
- Der Protokoll-Helfer lässt sich unter **Windows** (Registrierung) und **Linux** (`xdg-mime`) installieren. Unter macOS funktioniert der lokale Modus, der Helfer wird aber noch nicht per Skript installiert.
- Docker / Unraid / NAS brauchen den **Remote-Modus** plus Pfad-Zuordnung.
