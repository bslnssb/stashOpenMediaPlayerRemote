# Patches against upstream v1.0.2

These two patches contain the **generic, non-Chinese-specific** fixes. They are
what should go upstream (issue / PR). They do **not** include the zh-CN fork's
`encodeURIComponent`/`unquote` compatibility layer or Chinese UI strings.

Generated from the unmodified files inside upstream `stashOpenMediaPlayerRemote.zip`
(sha256 `c444e46adf3ab787acefb2f859a23a45aab46ae8037e9d86867f1f46d9193700`).

| Patch | Purpose |
|---|---|
| `01-backend-utf8-stdin.patch` | Read stdin as UTF-8 bytes; safe `name`; validate paths; stop logging the session cookie |
| `02-frontend-robustness.patch` | GraphQL path lookup + DOM fallback; explicit `name`; visible errors; reliable button injection |

## Apply

```bash
# from a directory containing src/ with the upstream v1.0.2 plugin files
git apply 01-backend-utf8-stdin.patch
git apply 02-frontend-robustness.patch
```

Verified with `git apply --check`, then a real apply followed by
`python -m py_compile` and `node --check`.

> On Windows with `core.autocrlf=true`, applying may convert line endings to
> CRLF. Content is identical; only the bytes differ. Use
> `git -c core.autocrlf=false apply …` if you need byte-for-byte LF output.

## Regenerating

From the private workspace:

```bash
python github-prepare/tools/prepare.py
```

This rebuilds `upstream-ready/`, `fork/src/`, `fork/patches/`, the release zip
and `index.yml`'s sha256, and runs a secret scan over everything under `fork/`.
