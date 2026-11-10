<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a><br>
  <a href="README.es.md">Español</a> ·
  <b>Français</b> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote

**Un clic et la scène Stash s'ouvre dans votre lecteur habituel — VLC, MPV, MPC-HC, SMPlayer, PotPlayer —. C'est le fichier d'origine qui est lu, pas un flux transcodé par le navigateur, et cela fonctionne même si Stash tourne dans Docker sur un NAS.**

## Ce que fait ce plugin

Chaque page de scène reçoit un bouton **Ouvrir dans un lecteur externe** dans sa barre d'outils. Un clic envoie le chemin réel du fichier de la scène au lecteur installé sur votre machine.

- **Un clic, bouton toujours présent** — il se trouve dans la barre d'outils de la scène, à côté du compteur de lectures ; inutile d'ouvrir l'onglet « Fichiers ».
- **N'importe quel lecteur** — tout ce qui se lance en « exécutable + chemin de fichier » : VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer, etc. Il suffit d'indiquer le chemin complet de l'exécutable.
- **Mode local** — Stash et le lecteur sur la même machine : le serveur Stash lance le lecteur lui-même.
- **Mode distant** — Stash dans Docker / Unraid / sur un NAS / sur une autre machine : le navigateur transmet un lien `stashopenmediaplayerremote://` à un petit assistant installé sur votre PC, qui lance le lecteur en local. Le serveur n'a pas besoin d'accéder à votre bureau.
- **Mappage de chemins** — réécrire les chemins du conteneur vers les chemins réels, par exemple `/data` → `//NAS/stash`.
- **Format de chemin selon le lecteur** — URL `file://` ou chemin natif, détecté automatiquement (VLC et MPC ne se comportent pas pareil) ou forcé avec `keep` / `remove`.
- **Compteur de lectures (facultatif)** — une ouverture externe compte comme une lecture.

### Pourquoi un lecteur externe ?

Le lecteur intégré de Stash doit transcoder ou s'appuyer sur les codecs du navigateur : charge CPU élevée, support limité des sous-titres ASS et du HDR. Un lecteur de bureau lit le fichier d'origine avec décodage matériel, changement de sous-titres et de pistes audio, HDR et raccourcis clavier — et soulage le serveur.

## Installation

1. Dans **Paramètres → Extensions → Disponibles → Ajouter une source**, ajoutez cette source :

```text
Nom :
stashOpenMediaPlayerRemote

URL :
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![Ajout de la source](images/add-source.jpg)

2. Installez **Stash Open Media Player Remote** depuis cette source.

![Installation du plugin](images/install-plugin.jpg)

3. Dans les réglages du plugin, renseignez **Media Player Path** avec le chemin complet du lecteur, par exemple `C:\Program Files\SMPlayer\smplayer.exe`.
4. Mode distant uniquement : activez **Use Remote Protocol Handler** et lancez l'assistant une fois sur le PC où se trouve le lecteur (voir ci-dessous).
5. Rechargez Stash dans le navigateur avec <kbd>Ctrl</kbd>+<kbd>F5</kbd>.

## Réglages

| Réglage | Rôle |
|---|---|
| **Media Player Path** | Chemin complet de l'exécutable, p. ex. `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto` (par défaut : VLC reçoit `file://`, MPC un chemin natif), `keep` (toujours `file://`), `remove` (toujours chemin natif) |
| **Use Remote Protocol Handler** | À activer pour Docker / Unraid / NAS / Stash distant : c'est l'assistant du PC qui lance le lecteur, pas le serveur |
| **Path Mapping From / To** | Réécriture facultative de préfixe, p. ex. `/data` → `//NAS/stash` |
| **Increment Play Count** | Ajoute une lecture lors d'une ouverture externe |

![Configuration du plugin](images/plugin-config.jpg)

## Mode distant (Docker, Unraid, NAS)

Le navigateur ouvre `stashopenmediaplayerremote://open?player=...&path=...` et le lecteur démarre sur votre machine. L'assistant s'installe une fois par PC :

```bash
python install-stashOpenMediaPlayerRemote.py
```

Le script enregistre le protocole dans le registre Windows ou comme gestionnaire `.desktop` sous Linux via `xdg-mime`. Aucun droit administrateur n'est nécessaire sous Windows.

![Installation du gestionnaire de protocole](images/install-protocol.jpg)

Acceptez l'invite du navigateur au premier clic.

## Dépannage

### Fichier introuvable

- **Path Mapping From** correspond au chemin stocké par Stash (celui affiché sur la page de la scène).
- **Path Mapping To** pointe vers un partage réellement accessible depuis ce PC.
- Le chemin obtenu s'ouvre depuis l'explorateur de fichiers.

Exemple : `/data` → `//network_path/stash`

### Le bouton n'apparaît pas

Rechargez Stash après l'installation ou la mise à jour. Sinon, allez dans **Paramètres → Extensions** et rechargez les extensions : après une mise à jour, il faut rafraîchir la page et la liste.

### Supprimer l'invite de protocole du navigateur (facultatif)

Les navigateurs Chromium demandent une confirmation à chaque ouverture de `stashopenmediaplayerremote://`. La stratégie `AutoLaunchProtocolsFromOrigins` permet de l'autoriser définitivement (JSON dans le README anglais, section Troubleshooting). Clé de stratégie : Chrome `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`, Edge `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge`. Les versions portables peuvent ignorer les stratégies système ; cette étape est purement facultative.

## Ce que change ce fork (par rapport à l'upstream v1.0.2)

Ce dépôt est un **fork non officiel**. Le plugin est l'œuvre de [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote) ; ce fork le rend de nouveau fonctionnel sous Windows avec des chemins non ASCII et le distribue de façon fiable.

- **Plantage sur chemins non ASCII (correctif principal)** — Stash envoie du JSON UTF-8 valide, mais Python sous Windows le décodait avec la page de codes ANSI (cp936 / cp932 / cp949 / cp1251…) : les caractères étaient corrompus et l'une des deux barres obliques inverses de `\\` disparaissait, donc `json.loads` levait `Invalid \escape`, la tâche se terminait avec le code 1 et le lecteur ne se lançait jamais. Le backend lit désormais les octets bruts de stdin et décode en UTF-8.
- **Clic sans effet** — le chemin est récupéré via la requête GraphQL de même origine `findScene(id){files{path}}` ; le DOM/XPath ne sert plus que de secours. Une erreur de récupération de configuration ne tue plus le gestionnaire en silence.
- **Bouton qui disparaissait** — injecté dans `.scene-toolbar` et réattaché par un `MutationObserver`, il survit à la navigation SPA et aux redessins de la barre.
- **Erreurs visibles** — chaque échec affiche un toast avec la cause au lieu de « rien ne se passe ».
- **Pas de fuite d'identifiants** — le journal n'écrit plus `server_connection` (cookie de session, ApiKey).
- **Distribution vérifiable** — zip reproductible, `index.yml` lié au hachage du paquet, autocontrôle d'intégrité, notes en 13 langues.

Les correctifs prêts pour l'upstream sont dans [patches/](patches/) ; licence et attribution dans [NOTICE.md](NOTICE.md). Si l'upstream publie le correctif, revenez à sa source.

## Compatibilité

- Testé avec **Windows 11 + Stash v0.31.1** (Chrome / Edge). Le plugin n'utilise que la `PluginApi` standard et une tâche `raw`, les versions récentes de Stash devraient donc fonctionner.
- L'assistant de protocole s'installe sous **Windows** (registre) et **Linux** (`xdg-mime`). Sous macOS, le mode local fonctionne mais l'assistant n'est pas encore installé par le script.
- Docker / Unraid / NAS exigent le **mode distant** et le mappage de chemins.
