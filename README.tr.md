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
  <a href="README.pt.md">Português</a> ·
  <b>Türkçe</b> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <a href="README.el.md">Ελληνικά</a>
</p>

# Stash Open Media Player Remote · resmî olmayan UTF-8 / ASCII dışı yol düzeltmesi

> Özgün proje: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Bu fork yalnızca hataları düzeltir ve belgeleri tamamlar — **yeni bir eklenti değildir, rakip de değildir**. Düzeltme üst projeye alındığında özgün kaynağa dönmeniz önerilir.
> Lisans ve atıf: [NOTICE.md](NOTICE.md); üst proje için genel yamalar: [patches/](patches/).

## Bu fork neyi düzeltiyor

- Belirti: Windows'ta Stash kurulum yolu veya video yolu ASCII dışı karakterler içeriyorsa «Harici oynatıcıda aç» düğmesi hiçbir şey yapmaz ve günlükte `Invalid \escape` / `exit status 1` görünür.
- Neden: Stash, eklentinin stdin akışına **geçerli UTF-8 JSON** yazar. Ancak Windows'taki Python bunu sistemin ANSI kod sayfasıyla (cp936 / cp932 / cp949 / cp1251 vb.) çözer: ASCII dışı karakterler bozulur ve `\\` ikilisinin bir karakterini yutar. Bunun sonucunda `json.loads` `Invalid \escape` hatası verir, süreç exit 1 ile biter ve oynatıcı hiç başlatılmaz.
- Etki: **ASCII dışı yol içeren tüm Windows sistemleri** — yalnızca Çince yerelleştirilmiş sistemler değil.
- Üç düzeltme: arka uç baytları doğrudan `sys.stdin.buffer.read().decode("utf-8")` ile okur; ön uç yolu aynı kaynaklı GraphQL `findScene(id){files{path}}` sorgusundan alır (DOM XPath yalnızca yedek olarak kalır); düğme `.scene-toolbar` öğesine sabitlenir ve MutationObserver eklenir; her hata görünür biçimde gösterilir, sessizce yutulmaz.

## Kurulum

Stash → Ayarlar → Eklentiler → Kaynak ekle bölümüne aşağıdaki URL'yi girin, **Stash Open Media Player Remote** (version 1.0.3) eklentisini kurun ve ardından tarayıcıda **Ctrl+F5** tuşlarına basın.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Doğrulama

Herhangi bir sahneyi açın, **varsayılan «Genel bakış / Overview» sekmesinde kalın** («Dosyalar» sekmesine geçmeyin), **Ctrl+F5** tuşlarına basın ve «Harici oynatıcı» düğmesine tıklayın → yerel oynatıcı açılmalıdır. Başarısız olursa sayfa somut hatayı gösterir.

## Belgeler

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Bu belgeler yalnızca türetilmiş görünümlerdir; esas alınan `index.yml` ve bütünlük denetimidir.

> Tam İngilizce başvuru: [README.md](README.md)
