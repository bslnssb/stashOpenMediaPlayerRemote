<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <b>Português</b> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · correção não oficial de UTF-8 / caminhos não ASCII

> Projeto original: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Este fork apenas corrige defeitos e complementa a documentação — **não é um plugin novo nem um concorrente**. Quando a correção for incorporada ao projeto original, é recomendável voltar à fonte original.
> Licença e atribuição: [NOTICE.md](NOTICE.md); patches genéricos para o projeto original: [patches/](patches/).

## O que este fork corrige

- Sintoma: no Windows, se o caminho de instalação do Stash ou o caminho do vídeo contiver caracteres não ASCII, clicar em «Abrir em player externo» não faz nada e o log mostra `Invalid \escape` / `exit status 1`.
- Causa: o Stash grava **JSON UTF-8 válido** na entrada padrão do plugin. Porém, no Windows, o Python o decodifica com a página de código ANSI do sistema (cp936 / cp932 / cp949 / cp1251 etc.): os caracteres não ASCII viram lixo e engolem um dos dois caracteres do par `\\`. Com isso, `json.loads` lança `Invalid \escape`, o processo termina com exit 1 e o player nunca chega a ser iniciado.
- Alcance: **qualquer Windows com caminhos não ASCII**, não apenas sistemas em chinês.
- Três correções: o backend lê os bytes diretamente com `sys.stdin.buffer.read().decode("utf-8")`; o frontend obtém o caminho pela consulta GraphQL de mesma origem `findScene(id){files{path}}` (o XPath do DOM fica apenas como alternativa); o botão é ancorado em `.scene-toolbar` junto com um MutationObserver, e qualquer falha é exibida como erro visível, sem mais falhar em silêncio.

## Instalação

Stash → Configurações → Plugins → Adicionar fonte, informe a URL abaixo, instale **Stash Open Media Player Remote** (version 1.0.3) e depois pressione **Ctrl+F5** no navegador.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Verificação

Abra qualquer cena, **fique na aba padrão «Visão geral / Overview»** (não mude para «Arquivos»), pressione **Ctrl+F5** e clique no botão «Player externo» → o player local deve abrir. Se falhar, a página mostrará o erro específico.

## Documentação

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Estes documentos são apenas visões derivadas; a referência é `index.yml` junto com a verificação de integridade.

> Referência completa em inglês: [README.md](README.md)
