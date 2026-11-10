<p align="center" translate="no">
  <b>English</b> ·
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
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote

**Open a Stash scene in the player you already use — VLC, MPV, MPC-HC, SMPlayer, PotPlayer — with one click. It plays the original file instead of a browser stream, and it keeps working when Stash runs in Docker on a NAS.**

## What this plugin does

Every scene page gets an **Open in external player** button in its toolbar. One click sends that scene's real file path to your desktop media player.

- **One click, always there** — the button sits in the scene toolbar next to the play-count control, on any scene page, without first opening the *Files* tab.
- **Any player** — anything that accepts "executable + file path" on the command line: VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer, … You only provide the full path to the player's executable.
- **Local mode** — Stash and the player run on the same computer: the Stash server launches the player itself.
- **Remote mode** — Stash runs in Docker / Unraid / NAS / on another machine: the browser hands a `stashopenmediaplayerremote://` link to a small helper installed on your desktop, and the helper launches the player locally. The server never needs access to your desktop.
- **Path mapping** — rewrite container paths into real ones, e.g. `/data` → `//NAS/stash`.
- **Path style per player** — send a `file://` URL or a native path; detected per player (VLC vs. MPC), or forced with `keep` / `remove`.
- **Optional play count** — count an external open as a play.

### Why use an external player at all?

Stash's built-in player has to transcode or rely on browser codecs: heavy on the CPU, weak on ASS subtitles and HDR. A desktop player opens the original file with hardware decoding, subtitle and audio-track switching, HDR and keyboard shortcuts — and it takes the transcoding load off the Stash server.

## Install

1. Add this package source in **Settings → Plugins → Available → Add source**:

```text
Name:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![Adding the package source](images/add-source.jpg)

2. Install **Stash Open Media Player Remote** from that source.

![Installing the plugin](images/install-plugin.jpg)

3. Open the plugin settings and set **Media Player Path** to the full path of your player, for example `C:\Program Files\SMPlayer\smplayer.exe`.
4. Remote mode only: enable **Use Remote Protocol Handler** and run the helper on the computer that has the player (see below).
5. Reload Stash in the browser with <kbd>Ctrl</kbd>+<kbd>F5</kbd>.

## Settings

| Setting | What it does |
|---|---|
| **Media Player Path** | Full path to the player executable, e.g. `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto` (default: VLC gets `file://`, MPC gets a native path), `keep` (always `file://`), `remove` (always native path) |
| **Use Remote Protocol Handler** | Turn on for Docker / Unraid / NAS / remote Stash: the browser launches the local helper instead of the server |
| **Path Mapping From / To** | Optional prefix rewrite, e.g. `/data` → `//NAS/stash` |
| **Increment Play Count** | Add one play when the scene is opened externally |

![Plugin configuration](images/plugin-config.jpg)

## Remote mode (Docker, Unraid, NAS)

The browser opens `stashopenmediaplayerremote://open?player=...&path=...`, which starts the player on your own machine. Install the helper once on every desktop that should play media:

```bash
python install-stashOpenMediaPlayerRemote.py
```

The script registers the protocol in the Windows registry, or as a Linux `.desktop` handler via `xdg-mime`. No administrator rights are needed on Windows.

![Installing the protocol handler](images/install-protocol.jpg)

Accept the browser's permission prompt the first time you click the button.

## Troubleshooting

### The media file is not found

Check that:

- **Path Mapping From** matches the path Stash stores (the path shown on the scene page).
- **Path Mapping To** points to a share this computer can really open.
- The file opens from Windows Explorer / your file manager when you paste the mapped path.

Example: `/data` → `//network_path/stash`

### The button does not appear

Reload Stash after installing or updating the plugin. If it still does not show up, open **Settings → Plugins** and reload the plugins. Both the page and the plugin list must be refreshed after an update.

### Suppress the Chromium protocol prompt (optional)

Chromium-based browsers ask for confirmation every time a `stashopenmediaplayerremote://` link is opened. You can allow it permanently with the `AutoLaunchProtocolsFromOrigins` policy:

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

Create a string value named `AutoLaunchProtocolsFromOrigins` with that JSON under the policy key of your browser:

| Browser | Registry key (Windows) | Policy page |
|---|---|---|
| Chromium | `HKEY_CURRENT_USER\Software\Policies\Chromium` | `chrome://policy` |
| Google Chrome | `HKEY_CURRENT_USER\Software\Policies\Google\Chrome` | `chrome://policy` |
| Microsoft Edge | `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge` | `edge://policy` |
| Vivaldi | `HKEY_CURRENT_USER\Software\Policies\Vivaldi` | `vivaldi://policy` |
| Brave | `HKEY_CURRENT_USER\Software\Policies\BraveSoftware\Brave` | `brave://policy` |

Restart the browser and check that the policy shows as **Set**. Portable browser builds may ignore system policies, and this is entirely optional.

## What this fork changes (vs. upstream v1.0.2)

This repository is an **unofficial fork**. The plugin above is the original work of [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote); this fork keeps it installable and fixes defects that broke it on Windows with non-ASCII paths.

- **Non-ASCII path crash (main fix)** — Stash sends valid UTF-8 JSON to the plugin, but Python on Windows decoded it with the ANSI code page (cp936 / cp932 / cp949 / cp1251 …). Non-ASCII characters were mangled and one backslash of a `\\` pair was swallowed, so `json.loads` raised `Invalid \escape`, the task exited with code 1, and the player never started. The backend now reads the raw bytes with `sys.stdin.buffer.read().decode("utf-8")`.
- **Silent button failures** — the scene path is fetched through the same-origin GraphQL query `findScene(id){files{path}}` instead of scraping the *Files* tab; the DOM/XPath path is only a fallback. Configuration-query errors no longer kill the click handler silently.
- **Button that disappears** — injected into `.scene-toolbar` and re-attached by a `MutationObserver`, so it survives SPA navigation and toolbar re-renders.
- **Visible errors** — every failure shows a toast (or an alert) with the reason, instead of "nothing happens".
- **No credential spill** — the plugin log no longer dumps `server_connection`, which contained the session cookie and ApiKey.
- **Distribution hygiene** — fixed mtime + reproducible zip, `index.yml` hash-bound to the package, integrity self-check, and 13-language notes.

Upstream-ready patches (no CJK-only changes) are in [patches/](patches/); licensing and attribution are in [NOTICE.md](NOTICE.md). If the upstream repository ships the fix, switch back to its package source.

## Compatibility

- Tested with **Stash v0.31.1** on Windows 11 (Chrome / Edge). The plugin uses the standard `PluginApi` and a `raw` task, so recent Stash versions should work.
- The protocol helper installs on **Windows** (registry) and **Linux** (`xdg-mime`). On macOS, local mode works but the protocol helper is not installed by the script yet.
- Docker / Unraid / NAS setups need **remote mode** plus path mapping; the plugin cannot launch a player inside the container.

## Documentation

- [Postmortem](docs/POSTMORTEM.md) — root cause, failure timeline, layered cause table, requirement pool.
- [Architecture](docs/ARCHITECTURE.md) — module map, runtime / distribution / gate flows, contracts.
- [Tasks](docs/TASKS.md) — WBS, dependency graph, release checklist.
- [Evidence](docs/EVIDENCE.md) — reproduction steps and captured proof.
- [Notes in 13 languages](docs/i18n.md) — translated summaries of the fix.

These documents are derived views; `index.yml` plus the integrity check are the source of truth.

## License and credit

Original plugin: **MrArgparse** — <https://github.com/MrArgparse/stashOpenMediaPlayerRemote>. The upstream repository has no `LICENSE` file, so no license is granted or implied for upstream code; this fork does not relicense it. New material in this fork is offered under CC0 1.0. See [NOTICE.md](NOTICE.md).
