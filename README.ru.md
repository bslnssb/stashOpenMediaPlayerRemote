<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <b>Русский</b> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · неофициальная сборка с исправлением UTF-8 и путей с не-ASCII символами

> Исходный проект: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Этот форк только исправляет дефекты и дополняет описание — **это не новый плагин и не конкурент**. После того как исправление примут в upstream, рекомендуем вернуться к исходному источнику.
> Лицензия и атрибуция — в [NOTICE.md](NOTICE.md); универсальные патчи для upstream — в [patches/](patches/).

## Что исправлено в этом форке

- Симптом: в Windows, если путь установки Stash или путь к видео содержит не-ASCII символы, нажатие «Открыть во внешнем плеере» ничего не делает, а в журнале появляются `Invalid \escape` / `exit status 1`.
- Причина: Stash передаёт в stdin плагина **корректный JSON в UTF-8**. Но Python в Windows декодирует его системной ANSI-кодовой страницей (cp936 / cp932 / cp949 / cp1251 и т. п.): не-ASCII символы превращаются в мусор и «съедают» один из символов парной последовательности `\\`. Из-за этого `json.loads` выбрасывает `Invalid \escape`, процесс завершается с кодом exit 1, и до запуска плеера дело не доходит.
- Влияние: **любая Windows с путями, содержащими не-ASCII символы**, а не только системы с китайской локалью.
- Три исправления: бэкенд читает байты напрямую через `sys.stdin.buffer.read().decode("utf-8")`; фронтенд получает путь запросом GraphQL того же origin `findScene(id){files{path}}` (DOM XPath оставлен только как резервный вариант); кнопка привязывается к `.scene-toolbar` вместе с MutationObserver, и любая ошибка показывается видимой — молчаливых отказов больше нет.

## Установка

Stash → Настройки → Плагины → Добавить источник, укажите URL ниже, установите **Stash Open Media Player Remote** (version 1.0.3), затем в браузере нажмите **Ctrl+F5**.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Проверка

Откройте любую сцену, **оставаясь на вкладке по умолчанию «Обзор / Overview»** (не переключайтесь на «Файлы»), нажмите **Ctrl+F5** и щёлкните кнопку «Внешний плеер» → должен открыться локальный плеер. Если не получится, страница покажет конкретную ошибку.

## Документация

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Эти документы — лишь производные представления; источник истины — `index.yml` и проверка целостности.

> Полная английская версия: [README.md](README.md)
