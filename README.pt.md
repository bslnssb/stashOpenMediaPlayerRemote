<p align="center" translate="no">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a><br>
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a> ·
  <b>Português</b> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote

**Um clique e a cena do Stash abre no player que você já usa — VLC, MPV, MPC-HC, SMPlayer, PotPlayer. Toca o arquivo original, não um fluxo transcodificado pelo navegador, e continua funcionando com o Stash em Docker num NAS.**

## O que este plugin faz

Cada página de cena ganha um botão **Abrir no player externo** na barra de ferramentas. Um clique envia o caminho real do arquivo da cena para o player do seu computador.

- **Um clique, botão sempre visível** — fica na barra de ferramentas da cena, ao lado do contador de reproduções; não é preciso abrir a aba «Arquivos».
- **Qualquer player** — qualquer um que inicie como «executável + caminho do arquivo»: VLC, MPV, MPC-HC/BE, SMPlayer, PotPlayer… Basta informar o caminho completo do executável.
- **Modo local** — Stash e player no mesmo computador: o servidor do Stash inicia o player.
- **Modo remoto** — Stash em Docker / Unraid / NAS / outra máquina: o navegador entrega um link `stashopenmediaplayerremote://` a um pequeno assistente instalado no seu PC, que abre o player localmente. O servidor não precisa acessar sua área de trabalho.
- **Mapeamento de caminhos** — reescreve caminhos do contêiner para caminhos reais, por exemplo `/data` → `//NAS/stash`.
- **Formato conforme o player** — URL `file://` ou caminho nativo, detectado automaticamente (VLC e MPC se comportam de forma diferente) ou forçado com `keep` / `remove`.
- **Contador de reproduções (opcional)** — abrir externamente também conta como reprodução.

### Por que usar um player externo?

O player embutido do Stash precisa transcodificar ou depender dos codecs do navegador: muito uso de CPU e suporte fraco a legendas ASS e HDR. Um player de desktop abre o arquivo original com decodificação por hardware, troca de legendas e faixas de áudio, HDR e atalhos de teclado — e tira a transcodificação do servidor.

## Instalação

1. Em **Configurações → Plugins → Disponíveis → Adicionar fonte**, adicione esta fonte:

```text
Nome:
stashOpenMediaPlayerRemote

URL:
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

![Adicionar a fonte](images/add-source.jpg)

2. Instale **Stash Open Media Player Remote** a partir dessa fonte.

![Instalar o plugin](images/install-plugin.jpg)

3. Nas configurações do plugin, preencha **Media Player Path** com o caminho completo do player, por exemplo `C:\Program Files\SMPlayer\smplayer.exe`.
4. Apenas no modo remoto: ative **Use Remote Protocol Handler** e execute o assistente uma vez no computador onde está o player (veja abaixo).
5. Recarregue o Stash no navegador com <kbd>Ctrl</kbd>+<kbd>F5</kbd>.

## Configurações

| Opção | O que faz |
|---|---|
| **Media Player Path** | Caminho completo do executável, p. ex. `C:\Program Files\SMPlayer\smplayer.exe` |
| **File URL Prefix Mode** | `auto` (padrão: VLC recebe `file://`, MPC caminho nativo), `keep` (sempre `file://`), `remove` (sempre caminho nativo) |
| **Use Remote Protocol Handler** | Ative para Docker / Unraid / NAS / Stash remoto: o assistente do PC inicia o player, não o servidor |
| **Path Mapping From / To** | Reescrita opcional de prefixo, p. ex. `/data` → `//NAS/stash` |
| **Increment Play Count** | Soma uma reprodução ao abrir externamente |

![Configuração do plugin](images/plugin-config.jpg)

## Modo remoto (Docker, Unraid, NAS)

O navegador abre `stashopenmediaplayerremote://open?player=...&path=...` e o player inicia na sua máquina. O assistente é instalado uma vez por PC:

```bash
python install-stashOpenMediaPlayerRemote.py
```

O script registra o protocolo no registro do Windows ou como manipulador `.desktop` no Linux via `xdg-mime`. Não é preciso administrador no Windows.

![Instalar o manipulador de protocolo](images/install-protocol.jpg)

Aceite o aviso do navegador na primeira vez que clicar no botão.

## Problemas comuns

### Arquivo não encontrado

- **Path Mapping From** igual ao caminho guardado pelo Stash (o que aparece na página da cena).
- **Path Mapping To** aponta para um compartilhamento que este PC realmente abre.
- O caminho resultante abre no Explorador de Arquivos.

Exemplo: `/data` → `//network_path/stash`

### O botão não aparece

Recarregue o Stash após instalar ou atualizar. Se persistir, vá em **Configurações → Plugins** e recarregue os plugins — após atualizar, tanto a página quanto a lista precisam ser atualizadas.

### Remover o aviso de protocolo do navegador (opcional)

Navegadores Chromium perguntam toda vez que `stashopenmediaplayerremote://` é aberto. Dá para liberar permanentemente com a política `AutoLaunchProtocolsFromOrigins` (o JSON está no README em inglês, seção Troubleshooting). Chave da política: Chrome `HKEY_CURRENT_USER\Software\Policies\Google\Chrome`, Edge `HKEY_CURRENT_USER\Software\Policies\Microsoft\Edge`. Versões portáteis podem ignorar políticas do sistema; é totalmente opcional.

## O que este fork muda (em relação ao upstream v1.0.2)

Este repositório é um **fork não oficial**. O plugin é obra de [MrArgparse](https://github.com/MrArgparse/stashOpenMediaPlayerRemote); aqui ele volta a funcionar no Windows com caminhos não ASCII e passa a ser distribuído de forma confiável.

- **Travamento com caminhos não ASCII (correção principal)** — o Stash envia JSON UTF-8 válido, mas o Python no Windows decodificava com a página de código ANSI (cp936 / cp932 / cp949 / cp1251…): os caracteres se corrompiam e uma das duas barras invertidas de `\\` desaparecia, então `json.loads` lançava `Invalid \escape`, a tarefa terminava com código 1 e o player nunca abria. O backend agora lê os bytes crus do stdin e decodifica em UTF-8.
- **Clique sem reação** — o caminho vem da consulta GraphQL de mesma origem `findScene(id){files{path}}`; DOM/XPath é só reserva. Erro ao ler a configuração não mata mais o handler em silêncio.
- **Botão que desaparecia** — injetado em `.scene-toolbar` e reanexado por um `MutationObserver`, sobrevive à navegação SPA e ao redesenho da barra.
- **Erros visíveis** — qualquer falha mostra um aviso com o motivo, em vez de «nada acontece».
- **Sem vazamento de credenciais** — o log não grava mais `server_connection` (cookie de sessão e ApiKey).
- **Distribuição verificável** — zip reprodutível, `index.yml` ligado ao hash do pacote, autoverificação de integridade e notas em 13 idiomas.

Os patches prontos para o upstream estão em [patches/](patches/); licença e autoria em [NOTICE.md](NOTICE.md). Quando o upstream publicar a correção, volte para a fonte dele.

## Compatibilidade

- Testado com **Windows 11 + Stash v0.31.1** (Chrome / Edge). Usa apenas a `PluginApi` padrão e uma tarefa `raw`, então versões recentes do Stash devem funcionar.
- O assistente de protocolo instala em **Windows** (registro) e **Linux** (`xdg-mime`). No macOS o modo local funciona, mas o assistente ainda não é instalado pelo script.
- Docker / Unraid / NAS exigem **modo remoto** e mapeamento de caminhos.
