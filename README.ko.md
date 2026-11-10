<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <b>한국어</b> ·
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

# Stash Open Media Player Remote · UTF-8 / 비ASCII 경로 수정판 (비공식 포크)

> 원본 프로젝트: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> 이 포크는 결함 수정과 설명만 담당합니다. **새 플러그인이 아니며 경쟁 제품도 아닙니다.** 원본에 수정이 병합되면 원본 소스로 되돌리는 것을 권장합니다.
> 라이선스와 출처는 [NOTICE.md](NOTICE.md), 원본에 보낼 일반 패치지는 [patches/](patches/)를 참고하세요.

## 이 포크가 고친 것

- 증상: Windows에서 Stash 설치 경로나 영상 경로에 비ASCII 문자가 있으면 "외부에서 열기"를 눌러도 반응이 없고, 로그에 `Invalid \escape` / `exit status 1`이 남습니다.
- 원인: Stash가 플러그인 stdin에 쓰는 것은 **정상적인 UTF-8 JSON**입니다. 그런데 Windows의 Python은 시스템 ANSI 코드 페이지(cp936 / cp932 / cp949 / cp1251 등)로 디코딩하므로 비ASCII 문자가 깨지고, 짝을 이루는 `\\` 가운데 하나를 삼켜 버립니다. 그 결과 `json.loads`가 `Invalid \escape`를 던지고 프로세스는 exit 1로 끝나며, 플레이어 실행 단계까지 가지 못합니다.
- 영향: **비ASCII 경로가 있는 모든 Windows**. 중국어 환경에만 해당하지 않습니다.
- 수정 세 가지: 백엔드는 `sys.stdin.buffer.read().decode("utf-8")`로 바이트를 직접 읽습니다. 프런트엔드는 동일 출처 GraphQL `findScene(id){files{path}}`로 경로를 가져옵니다(DOM XPath는 폴백 전용). 버튼은 `.scene-toolbar`에 고정하고 MutationObserver를 함께 쓰며, 어떤 실패든 눈에 보이는 오류를 표시해 조용히 넘어가지 않습니다.

## 설치

Stash → 설정 → 플러그인 → 소스 추가에서 아래 URL을 입력하고 **Stash Open Media Player Remote**(version 1.0.3)를 설치한 뒤, 브라우저에서 **Ctrl+F5**를 누르세요.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## 확인

아무 장면이나 열고 **기본 "개요 / Overview" 탭에 그대로 둔 채**(파일 정보 탭으로 이동하지 마세요) **Ctrl+F5**를 누른 다음 "외부 플레이어" 버튼을 클릭합니다 → 로컬 플레이어가 열리면 성공입니다. 실패하면 페이지에 구체적인 오류가 표시됩니다.

## 문서

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

이 문서들은 파생된 뷰일 뿐이며, 기준은 `index.yml`과 무결성 검사입니다.

> 전체 영어판: [README.md](README.md)
