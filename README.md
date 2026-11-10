<p align="center">
  <b>English</b> ·
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
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

> **Unofficial fork — UTF-8 / zh-CN fix (2026-11-10).**
> Fixes a 100%-reproducible backend crash on Windows with non-ASCII paths,
> plus several silent frontend failures. Original project:
> https://github.com/MrArgparse/stashOpenMediaPlayerRemote
> Chinese notes: [README.zh-CN.md](README.zh-CN.md) · License/credit: [NOTICE.md](NOTICE.md)
> The upstream fix (no CJK-only changes) is in [patches/](patches/).
> Notes in 13 languages: [docs/i18n.md](docs/i18n.md)

## Documentation

Engineering notes for this fork (unofficial UTF-8 / non-ASCII path fix, version 1.0.3):

- [Postmortem](docs/POSTMORTEM.md) — root cause, failure timeline, layered cause table, R01–R16 requirement pool, open questions, and the architect hand-off.
- [Architecture](docs/ARCHITECTURE.md) — module map, three Mermaid flows, key contracts, ten conventions, and points to clarify.
- [Tasks](docs/TASKS.md) — T01–T19 WBS, dependency graph, and the release acceptance checklist.
- [Evidence](docs/EVIDENCE.md) — reproduction steps and captured evidence of the original crash.
- [Notes in 13 languages](docs/i18n.md) — translated summaries of the fix.

These docs are derived views; index.yml and the integrity checks are the source of truth.

Package source for this fork — use this URL in Stash, not the upstream v1.0.2 one:

`https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml`

# Stash Open Media Player Remote

Open Stash scenes in an external media player such as SMPlayer, VLC, MPC-HC, MPV, and others.

Supports:

- Local media player launching
- Remote protocol launching (recommended for Docker, Unraid, NAS, and remote Stash installations)
- Path mapping between Stash paths and SMB/network paths
- Optional play count incrementing

---

# Add the source

Add the following package source to Stash:

```text
Name:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```


![alt text](images/add-source.jpg)

---

# Install the plugin

Install **Stash Open Media Player Remote** from the package source.

![alt text](images/install-plugin.jpg)

---

# Install the protocol handler (Remote Mode)

If Stash is running on:

- Docker
- Unraid
- NAS
- Another machine

then enable **Use Remote Protocol Handler** and install the helper script on the computer where the media player is installed.

Navigate to the plugin folder and run:

```bash
python install-stashOpenMediaPlayerRemote.py
```

![alt text](images/install-protocol.jpg)

---

# Example configuration

## Remote Setup (Recommended)

```text
Media Player Path:
C:\Program Files\SMPlayer\smplayer.exe

Use Remote Protocol Handler:
Enabled

Path Mapping From:
/data

Path Mapping To:
//network_path/stash

Increment Play Count:
Enabled
```

![alt text](images/plugin-config.jpg)

## Local Mode

Stash launches the media player directly.

Recommended only when Stash and the media player are running on the same machine.

## Remote Mode

The browser launches:

```text
stashopenmediaplayerremote://
```

which starts the configured media player on your local computer. 

Make sure to accept the permission prompt in your browser the first time you click the "open with external player" button.

This mode is recommended for:

- Docker
- Unraid
- NAS
- Remote servers

---

# Troubleshooting

## Media file not found

Verify that:

- Path Mapping From matches the Stash file path.
- Path Mapping To points to a valid SMB/network share.
- The media file can be opened manually from Windows Explorer.

Example:

```text
/data
```

→

```text
//network_path/stash
```

## Button does not appear

Refresh Stash after installing or updating the plugin.

If the issue persists, reload plugins from Settings → Plugins.

## Optional: Suppress Chromium-Based Browser Launch Prompts

Chromium-based browsers may display a confirmation dialog every time the
`stashopenmediaplayerremote://` protocol is launched.

This can be suppressed using the `AutoLaunchProtocolsFromOrigins` browser policy.

### Policy Value

Create a string value named:

```text
AutoLaunchProtocolsFromOrigins
```

with the following JSON:

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

### Windows Registry Locations

Create the `AutoLaunchProtocolsFromOrigins` value in the appropriate location
for your browser:

#### Chromium

```text
HKEY_CURRENT_USER\Software\Policies\Chromium
```

#### Google Chrome

```text
HKEY_CURRENT_USER\Software\Policies\Google\Chrome
```

#### Microsoft Edge

```text
HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge
```

#### Vivaldi

```text
HKEY_CURRENT_USER\Software\Policies\Vivaldi
```

#### Brave

```text
HKEY_CURRENT_USER\Software\Policies\BraveSoftware\Brave
```

### Verify The Policy

Restart the browser and visit its policy page:

| Browser | Policy Page |
|----------|------------|
| Chromium | `chrome://policy` |
| Google Chrome | `chrome://policy` |
| Microsoft Edge | `edge://policy` |
| Vivaldi | `vivaldi://policy` |
| Brave | `brave://policy` |

The `AutoLaunchProtocolsFromOrigins` policy should appear as **Set**.

### Notes

- This is optional.
- This only affects the specified browser.
- Portable browser versions may ignore system policies.
- Browser updates may change policy behaviour in the future.
