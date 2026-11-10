<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>한국어</b> ·
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

**클릭 한 번으로 Stash 의 장면을 늘 쓰던 플레이어(VLC, MPV, MPC-HC, SMPlayer, PotPlayer 등)로 엽니다. 브라우저 변환 스트림이 아니라 원본 파일을 재생하며, Stash 가 Docker 나 NAS 에서 돌아가도 동작합니다.**

## 이 플러그인이 하는 일

장면(Scene) 페이지 툴바에 **외부 플레이어로 열기** 버튼이 추가됩니다. 한 번 누르면 그 장면의 실제 파일 경로가 PC 의 플레이어로 전달됩니다.

- **한 번의 클릭, 버튼은 항상 표시** — 장면 툴바의 재생 횟수 버튼 옆에 있고, '파일' 탭을 열 필요가 없습니다.
- **플레이어는 자유** — "실행 파일 + 파일 경로"로 실행되는 것이면 무엇이든(VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer …). 플레이어 exe 의 전체 경로만 넣으면 됩니다.
- **로컬 모드** — Stash 와 플레이어가 같은 PC 라면 Stash 서버가 직접 플레이어를 실행합니다.
- **원격 모드** — Stash 가 Docker / Unraid / NAS / 다른 PC 에 있다면, 브라우저가 `stashopenmediaplayerremote://` 링크를 PC 에 설치된 작은 도우미에 넘기고 도우미가 로컬에서 플레이어를 실행합니다. 서버가 내 PC 에 접근할 필요가 없습니다.
- **경로 매핑** — 컨테이너 경로를 실제 경로로 바꿉니다(예: `/data` → `//NAS/stash`).
- **플레이어별 경로 형식** — `file://` URL 또는 네이티브 경로를 자동 판별(VLC 와 MPC 는 다름)하거나 `keep` / `remove` 로 강제합니다.
- **재생 횟수(선택)** — 외부에서 열어도 한 번 재생으로 기록합니다.

### 왜 외부 플레이어인가

Stash 내장 플레이어는 트랜스코딩을 하거나 브라우저 코덱에 의존합니다. CPU 부담이 크고 ASS 자막·HDR 지원이 약합니다. 데스크톱 플레이어는 원본 파일을 하드웨어 디코딩으로 재생하고 자막·오디오 트랙 전환·HDR·키보드 단축키를 그대로 쓰며, 서버의 트랜스코딩 부담도 줄여 줍니다.

## 설치

1. **설정 → 플러그인 → 사용 가능 → 소스 추가** 에서 아래 소스를 추가합니다.

```text
이름:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![소스 추가](images/add-source.jpg)

2. 해당 소스에서 **Stash Open Media Player Remote** 를 설치합니다.

![플러그인 설치](images/install-plugin.jpg)

3. 플러그인 설정에서 **Media Player Path** 에 플레이어 전체 경로를 넣습니다(예: `C:\Program Files\SMPlayer\smplayer.exe`).
4. 원격 모드만: **Use Remote Protocol Handler** 를 켜고, 플레이어가 있는 PC 에서 도우미를 한 번 실행합니다(아래 참고).
5. 브라우저에서 <kbd>Ctrl</kbd>+<kbd>F5</kbd> 로 Stash 를 새로고침합니다.

## 설정 항목

| 설정 | 설명 |
|---|---|
| **Media Player Path** | 플레이어 exe 전체 경로(예: `C:\Program Files\SMPlayer\smplayer.exe`) |
| **File URL Prefix Mode** | `auto`(기본: VLC 는 `file://`, MPC 는 네이티브 경로), `keep`(항상 `file://`), `remove`(항상 네이티브 경로) |
| **Use Remote Protocol Handler** | Docker / Unraid / NAS / 원격 Stash 에서 켭니다. 서버 대신 PC 의 도우미를 실행합니다 |
| **Path Mapping From / To** | 선택 사항인 접두사 치환(예: `/data` → `//NAS/stash`) |
| **Increment Play Count** | 외부에서 열 때 재생 횟수를 1 올립니다 |

![플러그인 설정](images/plugin-config.jpg)

## 원격 모드(Docker / Unraid / NAS)

브라우저가 `stashopenmediaplayerremote://open?player=...&path=...` 를 열고, 내 PC 에서 플레이어가 실행됩니다. 재생할 PC 마다 한 번만 설치하세요.

```bash
python install-stashOpenMediaPlayerRemote.py
```

Windows 에서는 레지스트리에, Linux 에서는 `.desktop` 을 `xdg-mime` 으로 등록합니다. Windows 에서 관리자 권한은 필요 없습니다.

![프로토콜 핸들러 설치](images/install-protocol.jpg)

처음 버튼을 누를 때 브라우저 확인 창에서 '허용'을 선택하세요.

## 문제 해결

### 미디어 파일을 찾을 수 없음

- **Path Mapping From** 이 Stash 에 저장된 경로(장면 페이지에 보이는 경로)와 같은지 확인하세요.
- **Path Mapping To** 가 이 PC 에서 실제로 열리는 공유를 가리키는지 확인하세요.
- 매핑한 경로를 탐색기에 붙여 넣었을 때 파일이 열리는지 확인하세요.

예: `/data` → `//network_path/stash`

### 버튼이 보이지 않음

설치·업데이트 후 Stash 를 새로고침하세요. 그래도 없으면 **설정 → 플러그인** 에서 플러그인을 다시 불러오세요. 업데이트 후에는 페이지와 플러그인 목록을 모두 새로고침해야 합니다.

### 브라우저 프로토콜 확인 창 끄기(선택)

Chromium 계열 브라우저는 `stashopenmediaplayerremote://` 를 열 때마다 확인합니다. `AutoLaunchProtocolsFromOrigins` 정책으로 영구 허용할 수 있습니다(JSON 은 영문 README 의 같은 항목 참고). 정책 키는 Chrome 이면 `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`, Edge 면 `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge` 입니다. 포터블 빌드는 시스템 정책을 무시할 수 있으며, 전부 선택 사항입니다.

## 이 포크의 변경점(업스트림 v1.0.2 대비)

이 저장소는 **비공식 포크**입니다. 플러그인 자체는 [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote) 의 작품이며, 여기서는 비 ASCII 경로를 쓰는 Windows 에서도 동작하도록 고치고 안정적으로 배포되게 정리했습니다.

- **비 ASCII 경로 크래시(핵심 수정)** — Stash 는 정상 UTF-8 JSON 을 보내지만, Windows 의 Python 이 ANSI 코드페이지(cp936 / cp932 / cp949 / cp1251 …)로 디코딩해 `\\` 한 쌍 중 하나가 사라지고 `json.loads` 가 `Invalid \escape` 를 던져 exit 1 로 끝났습니다. 이제 stdin 을 원시 바이트로 읽어 UTF-8 로 디코딩합니다.
- **눌러도 반응 없음** — 경로를 동일 출처 GraphQL `findScene(id){files{path}}` 로 가져오고 DOM/XPath 는 예비로만 씁니다. 설정 조회 실패로 핸들러가 조용히 죽지 않습니다.
- **버튼이 사라짐** — `.scene-toolbar` 에 주입하고 `MutationObserver` 로 계속 보충해 SPA 이동·툴바 재렌더에도 유지됩니다.
- **오류가 보임** — 실패 시 이유를 토스트(또는 alert)로 표시합니다.
- **자격 증명 노출 중단** — 로그에 `server_connection`(세션 쿠키, ApiKey)을 더 이상 남기지 않습니다.
- **배포 위생** — 재현 가능한 zip, `index.yml` 해시 바인딩, 무결성 자체 점검, 13개 언어 문서.

업스트림에 그대로 보낼 수 있는 패치는 [patches/](patches/), 라이선스와 출처는 [NOTICE.md](NOTICE.md) 를 보세요. 업스트림이 수정판을 내면 업스트림 소스로 돌아가는 것을 권합니다.

## 호환성

- **Windows 11 + Stash v0.31.1**(Chrome / Edge)에서 검증했습니다. 표준 `PluginApi` 와 `raw` 태스크만 쓰므로 최신 Stash 에서도 동작해야 합니다.
- 프로토콜 도우미는 **Windows**(레지스트리)와 **Linux**(`xdg-mime`)를 지원합니다. macOS 는 로컬 모드만 가능하며 도우미는 아직 스크립트로 설치되지 않습니다.
- Docker / Unraid / NAS 에서는 **원격 모드**와 경로 매핑이 필요합니다.
