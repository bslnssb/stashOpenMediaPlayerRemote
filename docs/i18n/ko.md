# Stash Open Media Player Remote · 修复说明 / 한국어

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp949`。

## 问题

Windows에서 Stash 설치 경로나 동영상 경로에 한글 등 비 ASCII 문자가 있으면 '외부 플레이어' 버튼이 아무 반응도 하지 않습니다. Stash 로그에는 `Invalid \escape` / `exit status 1` 이 남습니다.

## 原因

플러그인 백엔드가 `sys.stdin.read()` 로 UTF-8 JSON을 읽어 Windows 시스템 ANSI 코드페이지(cp949)로 디코딩하면서 문자가 깨지고 이스케이프가 손상됩니다.

## 修复

원시 바이트를 `sys.stdin.buffer.read().decode('utf-8')` 로 읽으면 해결됩니다. 수정본은 포크를 참조하세요.

## 安装与验收

Stash '설정 → 플러그인 → 소스'에 `index.yml` 주소를 추가하거나 `src/` 의 `.py` / `.js` 를 교체하세요. 이후 브라우저에서 Ctrl+F5.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
