# Stash Open Media Player Remote · 修复说明 / Ελληνικά

> 非官方修复版（unofficial fork）：https://github.com/bslnssb/stashOpenMediaPlayerRemote
> 完整英文说明：[README](../../README.md) · 详细中文文档：[README.zh-CN.md](../../README.zh-CN.md)
> 多语言索引：[i18n.md](../i18n.md)

**受影响环境**：Windows，系统 ANSI 代码页 `cp1253`。

## 问题

Στα Windows, αν η διαδρομή εγκατάστασης του Stash ή του βίντεο περιέχει μη ASCII χαρακτήρες, το κουμπί του εξωτερικού προγράμματος αναπαραγωγής δεν ανταποκρίνεται· στο αρχείο καταγραφής εμφανίζεται `Invalid \escape` / `exit status 1`.

## 原因

Το backend διαβάζει το UTF-8 JSON με `sys.stdin.read()` και τα Windows το αποκωδικοποιούν με την ANSI κωδικοσελίδα (cp1253), καταστρέφοντας χαρακτήρες και ακολουθίες διαφυγής.

## 修复

Διαβάστε τα ακατέργαστα bytes: `sys.stdin.buffer.read().decode('utf-8')`. Η διορθωμένη έκδοση βρίσκεται στο fork.

## 安装与验收

Προσθέστε το URL του `index.yml` στις «Ρυθμίσεις → Πρόσθετα → Πηγές» του Stash ή αντικαταστήστε τα `.py` / `.js` από το `src/`· μετά Ctrl+F5 στον browser.

插件源地址（Stash 设置 → 插件 → 添加源）：

```text
https://raw.githubusercontent.com/bslnssb/stashOpenMediaPlayerRemote/refs/heads/main/index.yml
```

详细步骤见 [README.zh-CN.md](../../README.zh-CN.md)。
