# Reproduction & verification evidence (sanitized)

All paths below are **synthetic**. No real configuration, API key, session
cookie or media filename appears in this document.

## 1. Environment

| | |
|---|---|
| Stash | v0.31.1, Windows |
| Plugin | stashOpenMediaPlayerRemote v1.0.2 (upstream zip sha256 `c444e46a…`) |
| Python | 3.12, launched via `exec: python` |
| OS locale | Chinese (Simplified) → ANSI code page `cp936` / `gbk` |
| Stash install dir (synthetic) | `D:\Stash\我的文件夹\stash-win\` |
| Player | PotPlayer (any external player shows the same failure) |

## 2. Observable failure

Clicking the external-player button produced no UI response. Stash's own
in-memory log (`{ logs { time level message } }`, reverse chronological,
requires an `ApiKey` header) showed on **every** click:

```
Plugin returned error: exit status 1
json.decoder.JSONDecodeError: Invalid \escape: line 1 column 715 (char 714)
```

The backend exits before `subprocess.Popen`, so no player process is created.

## 3. Raw stdin capture

A temporary diagnostic dumped the plugin's **raw stdin bytes** before any
decoding. Inside that process:

```
sys.stdin.encoding = gbk
```

The JSON Stash actually wrote (session cookie value redacted) was valid:

```json
{
  "server_connection": {
    "Scheme": "http",
    "Host": "0.0.0.0",
    "Port": 9999,
    "SessionCookie": { "Name": "session", "Value": "<REDACTED>" },
    "Dir": "D:\\Stash\\我的文件夹\\stash-win",
    "PluginDir": "plugins\\stashOpenMediaPlayerRemote"
  },
  "args": {
    "name": "mediaplayer",
    "path": "D:\\Media\\clip.mkv",
    "mediaPlayerPath": "D:\\Player\\player.exe"
  }
}
```

Parsing the **same byte buffer** two ways:

| Decode | Result |
|---|---|
| `decode('utf-8')` | `json.loads` succeeds; `Dir == D:\Stash\我的文件夹\stash-win` |
| `decode('gbk')` | `Dir` becomes `"D:\\Stash\\<mojibake>\<mojibake>\stash-win"`; `json.loads` → `Invalid \escape: line 1 column 715 (char 714)` |

The mojibake is not cosmetic: a trailing byte of a multi-byte UTF-8 character
is consumed by the GBK decoder together with the following `0x5C` backslash
(0x5C is a valid GBK trail byte), so one half of an escaped `\\` disappears.

**Conclusion:** Stash emits valid UTF-8 JSON. `sys.stdin.read()` decoding with
the Windows ANSI code page is the bug. It affects any non-ASCII path, not only
Chinese ones.

## 4. Fix

```python
def read_plugin_input():
    raw = sys.stdin.buffer.read().decode("utf-8", errors="replace")
    return json.loads(raw)
```

## 5. Verification

| Check | Result |
|---|---|
| Apply both patches to upstream v1.0.2 (`git apply --check` / `git apply`) | pass |
| `compile()` on both fixed `.py` variants | pass |
| `node --check` on both fixed `.js` variants | pass |
| Real `runPluginTask` after the fix | Stash log `Media player launched successfully` |
| Player process | started (verified with a harmless probe program and with a real image file) |
| Reappearance of `Invalid \escape` | none |
| Working tab | Details tab (no need to expand File Info) |
| Failure feedback | visible toast / alert instead of silence |

### 5.1 Locale matrix (why this is not a Chinese-only bug)

`docs/reproduce_locales.py` builds the same valid UTF-8 JSON with a localised
install directory and media path, then decodes it with each Windows ANSI code
page (what `sys.stdin.read()` does) versus plain UTF-8. It uses synthetic paths
only, contains no machine-specific data, and can be run standalone with Python.

| Locale | ANSI code page | `sys.stdin.read()` | UTF-8 byte read |
|---|---|---|---|
| English, ASCII only | cp1252 | OK | OK |
| Simplified Chinese | cp936 | `Invalid \escape` | OK |
| Traditional Chinese | cp950 | `Invalid \escape` | OK |
| Japanese | cp932 | mojibake, path corrupted | OK |
| Korean | cp949 | mojibake, path corrupted | OK |
| Russian | cp1251 | mojibake, path corrupted | OK |
| German / Spanish / French / Portuguese | cp1252 | mojibake, path corrupted | OK |
| Turkish | cp1254 | mojibake, path corrupted | OK |
| Vietnamese | cp1258 | mojibake, path corrupted | OK |
| Thai | cp874 | mojibake, path corrupted | OK |
| Greek | cp1253 | mojibake, path corrupted | OK |

**13 of 14 locales fail with the old code; 14 of 14 pass with the UTF-8 byte
read.** A corrupted path is as fatal as a parse error: the player is launched
with a path that no longer exists. Per-language notes for affected users are
in [`docs/i18n.md`](i18n.md).

## 6. Independent reproduction (no plugin changes needed)

On a Chinese-locale Windows, put Stash in a directory containing CJK
characters, then query the plugin task with any scene path and read Stash's
`{ logs }`. Alternatively, from inside any raw Python plugin:

```python
import sys
print(sys.stdin.encoding)          # 'gbk' on a zh-CN Windows
raw = sys.stdin.buffer.read()
print(raw.decode('utf-8')[:200])   # valid JSON
print(raw.decode('gbk')[:200])     # mojibake + broken escapes
```

## 7. What is NOT in this document

`config.yml`, API keys, the `SessionCookie.Value`, the real installation path,
real media filenames and any machine-specific absolute path are intentionally
omitted. The private handover document that contains those values is not part
of this repository and must never be published.
