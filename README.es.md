<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja.md">日本語</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <b>Español</b> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · Corrección no oficial de UTF-8 y rutas con caracteres no ASCII

> Proyecto original: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Este fork solo corrige defectos y amplía la documentación: **no es un plugin nuevo ni un competidor**. Cuando la corrección se integre en el proyecto original, conviene volver a su fuente.
> Licencia y atribución: [NOTICE.md](NOTICE.md); parches genéricos para el proyecto original: [patches/](patches/).

## Qué corrige este fork

- Síntoma: en Windows, si la ruta de instalación de Stash o la del vídeo contiene caracteres no ASCII, pulsar «Abrir en reproductor externo» no hace nada y el registro muestra `Invalid \escape` / `exit status 1`.
- Causa: Stash escribe **JSON UTF-8 válido** en la entrada estándar del plugin. Sin embargo, Python en Windows lo decodifica con la página de códigos ANSI del sistema (cp936 / cp932 / cp949 / cp1251, etc.): los caracteres no ASCII se corrompen y se «comen» uno de los dos caracteres de la pareja `\\`. Entonces `json.loads` lanza `Invalid \escape`, el proceso termina con exit 1 y nunca se llega a lanzar el reproductor.
- Alcance: **cualquier Windows con rutas no ASCII**, no solo los sistemas en chino.
- Tres correcciones: el backend lee los bytes directamente con `sys.stdin.buffer.read().decode("utf-8")`; el frontend obtiene la ruta mediante la consulta GraphQL del mismo origen `findScene(id){files{path}}` (el XPath del DOM queda solo como respaldo); el botón se ancla a `.scene-toolbar` junto con un MutationObserver, y todo fallo se muestra como un error visible, sin volver a fallar en silencio.

## Instalación

Stash → Ajustes → Complementos → Añadir origen, introduce la URL siguiente, instala **Stash Open Media Player Remote** (version 1.0.3) y después pulsa **Ctrl+F5** en el navegador.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Comprobación

Abre cualquier escena, **quédate en la pestaña predeterminada «Resumen / Overview»** (no cambies a «Archivos»), pulsa **Ctrl+F5** y haz clic en el botón «Reproductor externo» → debería abrirse el reproductor local. Si falla, la página mostrará el error concreto.

## Documentación

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Estos documentos son solo vistas derivadas; la referencia real es `index.yml` junto con la comprobación de integridad.

> Referencia completa en inglés: [README.md](README.md)
