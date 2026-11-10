# Attribution & licensing notice

This repository is an **unofficial fork** of
[MrArgparse/stashOpenMediaPlayerRemote](https://github.com/MrArgparse/stashOpenMediaPlayerRemote),
based on v1.0.2 (2026-08-14). All credit for the original plugin belongs to
**MrArgparse**.

## Upstream code has no license

The upstream repository does **not** contain a LICENSE file. Under default
copyright rules that means the original author retains all rights. GitHub's
terms allow forking a public repository, which is how this fork was created,
but **forking is not a license grant**: this fork does not relicense, sublicense
or claim ownership of any upstream code, and does not add a project-wide
`LICENSE` file that would pretend otherwise.

Accordingly:

* the five unchanged plugin files, the original `README.md`, `index.yml`
  structure and `images/` remain the original author's work;
* this fork exists to document and distribute a **bugfix** and to keep an
  installable build available while the fix works its way upstream;
* an issue has been filed upstream asking the maintainer to add an explicit
  license (e.g. MIT or GPL-3.0) and to include a minimal upstream-ready patch.
  **If/when upstream merges the fix or adds a license, users should switch
  back to the upstream package source.**

## Material added by this fork

The following are new contributions (documentation, patches, and the specific
code changes listed in `patches/`). To the extent that these contributions can
be licensed independently of the upstream files they modify, they are offered
under **CC0 1.0 Universal** (public domain dedication):

* `NOTICE.md`, `docs/*.md`, `patches/*.patch`, `patches/README.md`;
* the 14 localized `README.md` / `README.<lang>.md` files, including their
  language switcher, feature overview, settings table and troubleshooting
  sections (the plugin behaviour they describe is the original plugin's);
* the new functions and comments added to `stashOpenMediaPlayerRemote.py` and
  `stashOpenMediaPlayerRemote.js` as shown in the patches.

This dedication does **not** extend to any pre-existing upstream code, and does
not override the original author's rights. If the upstream author states a
different preference, this fork will comply or be taken down.

## No secrets

This repository contains no Stash configuration, API keys, session cookies,
machine-specific absolute paths, or media library paths. The reproduction
evidence in `docs/EVIDENCE.md` uses synthetic paths and redacted values.
