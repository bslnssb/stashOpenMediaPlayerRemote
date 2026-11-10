<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <b>Français</b> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · correctif non officiel UTF-8 / chemins non ASCII

> Projet d'origine : https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Ce fork ne fait que corriger des défauts et compléter la documentation — **ce n'est pas un nouveau plugin ni un concurrent**. Une fois le correctif intégré en amont, il est recommandé de revenir à la source d'origine.
> Licence et attribution : [NOTICE.md](NOTICE.md) ; correctifs génériques pour l'amont : [patches/](patches/).

## Ce que corrige ce fork

- Symptôme : sous Windows, si le chemin d'installation de Stash ou le chemin de la vidéo contient des caractères non ASCII, un clic sur « Ouvrir en externe » ne fait rien et le journal affiche `Invalid \escape` / `exit status 1`.
- Cause : Stash écrit **du JSON UTF-8 valide** sur l'entrée standard du plugin. Or, sous Windows, Python le décode avec la page de code ANSI du système (cp936 / cp932 / cp949 / cp1251, etc.) : les caractères non ASCII deviennent des charabias et avalent l'un des deux caractères de la paire `\\`. `json.loads` lève alors `Invalid \escape`, le processus se termine avec exit 1 et le lecteur n'est jamais lancé.
- Portée : **tout Windows dont les chemins contiennent des caractères non ASCII**, pas seulement les systèmes configurés en chinois.
- Trois corrections : le backend lit directement les octets via `sys.stdin.buffer.read().decode("utf-8")` ; le frontend récupère le chemin via la requête GraphQL de même origine `findScene(id){files{path}}` (le XPath du DOM ne sert plus que de repli) ; le bouton est ancré à `.scene-toolbar` avec un MutationObserver, et toute erreur s'affiche de façon visible au lieu d'échouer en silence.

## Installation

Stash → Paramètres → Plugins → Ajouter une source, saisissez l'URL ci-dessous, installez **Stash Open Media Player Remote** (version 1.0.3), puis appuyez sur **Ctrl+F5** dans le navigateur.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Vérification

Ouvrez n'importe quelle scène, **restez sur l'onglet par défaut « Présentation / Overview »** (ne passez pas à « Fichiers »), appuyez sur **Ctrl+F5** puis cliquez sur le bouton « Lecteur externe » → le lecteur local devrait s'ouvrir. En cas d'échec, la page affiche l'erreur précise.

## Documentation

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Ces documents ne sont que des vues dérivées ; la référence reste `index.yml` et le contrôle d'intégrité.

> Référence complète en anglais : [README.md](README.md)
