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
  <a href="README.tr.md">Türkçe</a> ·
  <a href="README.vi.md">Tiếng Việt</a> ·
  <a href="README.th.md">ไทย</a> ·
  <b>Ελληνικά</b>
</p>

# Stash Open Media Player Remote · ανεπίσημη διόρθωση UTF-8 / διαδρομών εκτός ASCII

> Αρχικό έργο: https://github.com/MrArgparse/stashOpenMediaPlayerRemote (v1.0.2)
> Αυτό το fork διορθώνει μόνο σφάλματα και συμπληρώνει την τεκμηρίωση — **δεν είναι νέο πρόσθετο ούτε ανταγωνιστικό προϊόν**. Όταν η διόρθωση ενσωματωθεί στο αρχικό έργο, συνιστάται η επιστροφή στην αρχική πηγή.
> Άδεια και απόδοση: [NOTICE.md](NOTICE.md)· γενικά patches για το αρχικό έργο: [patches/](patches/).

## Τι διορθώνει αυτό το fork

- Σύμπτωμα: στα Windows, αν η διαδρομή εγκατάστασης του Stash ή η διαδρομή του βίντεο περιέχει χαρακτήρες εκτός ASCII, το κλικ στο «Άνοιγμα σε εξωτερικό πρόγραμμα» δεν κάνει τίποτα και το αρχείο καταγραφής εμφανίζει `Invalid \escape` / `exit status 1`.
- Αιτία: το Stash γράφει **έγκυρο JSON σε UTF-8** στο stdin του πρόσθετου. Όμως στα Windows η Python το αποκωδικοποιεί με την κωδικοσελίδα ANSI του συστήματος (cp936 / cp932 / cp949 / cp1251 κ.λπ.), οπότε οι χαρακτήρες εκτός ASCII αλλοιώνονται και «καταπίνουν» έναν από τους δύο χαρακτήρες του ζεύγους `\\`. Έτσι το `json.loads` πετά `Invalid \escape`, η διεργασία τερματίζεται με exit 1 και το πρόγραμμα αναπαραγωγής δεν ξεκινά ποτέ.
- Επίπτωση: **κάθε Windows με διαδρομές εκτός ASCII**, όχι μόνο συστήματα με κινεζικές ρυθμίσεις.
- Τρεις διορθώσεις: το backend διαβάζει τα byte απευθείας με `sys.stdin.buffer.read().decode("utf-8")`· το frontend λαμβάνει τη διαδρομή μέσω GraphQL ίδιας προέλευσης `findScene(id){files{path}}` (το XPath στο DOM μένει μόνο ως εφεδρική λύση)· το κουμπί αγκυρώνεται στο `.scene-toolbar` μαζί με MutationObserver, και κάθε αποτυχία εμφανίζεται ως ορατό σφάλμα, χωρίς πλέον σιωπηλή αποτυχία.

## Εγκατάσταση

Stash → Ρυθμίσεις → Πρόσθετα → Προσθήκη πηγής, καταχωρίστε το παρακάτω URL, εγκαταστήστε το **Stash Open Media Player Remote** (version 1.0.3) και έπειτα πατήστε **Ctrl+F5** στο πρόγραμμα περιήγησης.

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

## Επαλήθευση

Ανοίξτε οποιαδήποτε σκηνή, **μείνετε στην προεπιλεγμένη καρτέλα «Επισκόπηση / Overview»** (μην αλλάξετε σε «Αρχεία»), πατήστε **Ctrl+F5** και κάντε κλικ στο κουμπί «Εξωτερικό πρόγραμμα αναπαραγωγής» → θα πρέπει να ανοίξει το τοπικό πρόγραμμα αναπαραγωγής. Αν αποτύχει, η σελίδα θα εμφανίσει το συγκεκριμένο σφάλμα.

## Τεκμηρίωση

[Postmortem](docs/POSTMORTEM.md) · [Architecture](docs/ARCHITECTURE.md) · [Tasks](docs/TASKS.md) · [Evidence](docs/EVIDENCE.md)

Αυτά τα έγγραφα είναι μόνο παράγωγες όψεις· η αναφορά είναι το `index.yml` και ο έλεγχος ακεραιότητας.

> Πλήρης αγγλική αναφορά: [README.md](README.md)
