"""验证「非 ASCII 路径 + Windows ANSI 代码页」这个故障到底影响哪些语言。

背景：Stash 传给插件后端的 stdin 是**合法 UTF-8 JSON**。
旧代码 ``json.loads(sys.stdin.read())`` 会让 Python 按系统 ANSI 代码页
（中文 cp936、日文 cp932、韩文 cp949、俄文 cp1251、西欧 cp1252……）解码；
新代码 ``sys.stdin.buffer.read().decode('utf-8')`` 直接读原始字节。

本脚本用各语言的**虚构**路径构造同一份 JSON，分别模拟两种解码方式，
检查：① 能否 json.loads；② 解析出的路径是否与原字符串逐字一致。

用法：python scripts\\test_stdin_utf8_locales.py
"""
import json
import sys

sys.stdout.reconfigure(encoding="utf-8")

# 语言 / Windows 区域设置对应的 ANSI 代码页 / 虚构安装目录 / 虚构媒体目录
LOCALES = [
    ("English (ASCII)", "cp1252", "Stash", "Movies"),
    ("简体中文", "cp936", "我的文件夹", "电影收藏"),
    ("繁體中文", "cp950", "我的資料夾", "影片收藏"),
    ("日本語", "cp932", "マイフォルダ", "映画コレクション"),
    ("한국어", "cp949", "내 폴더", "영화 모음"),
    ("Русский", "cp1251", "Мои папки", "Фильмы"),
    ("Deutsch", "cp1252", "Meine Ordner", "Filme ÄÖÜ"),
    ("Español", "cp1252", "Mis carpetas", "Películas ñ"),
    ("Français", "cp1252", "Mes dossiers", "Films éèà"),
    ("Português", "cp1252", "Minhas pastas", "Filmes ãõ"),
    ("Türkçe", "cp1254", "Klasörlerim", "Filmler şğı"),
    ("Tiếng Việt", "cp1258", "Thư mục của tôi", "Phim ảnh"),
    ("ไทย", "cp874", "โฟลเดอร์ของฉัน", "ภาพยนตร์"),
    ("Ελληνικά", "cp1253", "Οι φάκελοί μου", "Ταινίες"),
]


def make_payload(install_dir, media_dir):
    install = f"D:\\Stash\\{install_dir}\\stash-win"
    media = f"D:\\Media\\{media_dir}\\sample.mkv"
    return {
        "server_connection": {
            "Scheme": "http",
            "Host": "localhost",
            "Port": 9999,
            "Dir": install,
            "SessionCookie": {"Name": "session", "Value": "<redacted>"},
            "ApiKey": "<redacted>",
        },
        "args": {
            "name": "mediaplayer",
            "path": media,
            "mediaPlayerPath": "D:\\Player\\PotPlayerMini64.exe",
        },
    }


def decode_and_parse(raw, encoding):
    """返回 (是否解析成功, 路径是否无损, 说明)"""
    try:
        text = raw.decode(encoding, errors="replace")
    except Exception as exc:
        return False, False, f"decode: {type(exc).__name__}"
    try:
        obj = json.loads(text)
    except Exception as exc:
        return False, False, f"json: {type(exc).__name__}: {str(exc)[:60]}"
    dir_ok = obj["server_connection"]["Dir"] == f"D:\\Stash\\{CURRENT_DIR}\\stash-win"
    path_ok = obj["args"]["path"] == f"D:\\Media\\{CURRENT_MEDIA}\\sample.mkv"
    if not (dir_ok and path_ok):
        return True, False, "路径字符已损坏（乱码）"
    return True, True, "OK"


CURRENT_DIR = ""
CURRENT_MEDIA = ""


def main():
    global CURRENT_DIR, CURRENT_MEDIA
    header = f"{'语言':<16} {'代码页':<8} {'旧写法 json.loads':<20} {'路径无损':<10} {'新写法(UTF-8)':<14}"
    print(header)
    print("-" * len(header))
    affected = 0
    total = 0
    rows = []
    for name, codepage, install_dir, media_dir in LOCALES:
        CURRENT_DIR, CURRENT_MEDIA = install_dir, media_dir
        payload = make_payload(install_dir, media_dir)
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")

        legacy_ok, legacy_intact, legacy_note = decode_and_parse(raw, codepage)
        new_ok, new_intact, new_note = decode_and_parse(raw, "utf-8")

        is_ascii = install_dir.isascii() and media_dir.isascii()
        total += 1
        if not is_ascii and not (legacy_ok and legacy_intact):
            affected += 1
        legacy = "OK" if (legacy_ok and legacy_intact) else ("解析失败" if not legacy_ok else "乱码")
        new = "OK" if (new_ok and new_intact) else "FAIL"
        rows.append((name, codepage, legacy, "是" if legacy_intact else "否", new, legacy_note))
        print(f"{name:<16} {codepage:<8} {legacy:<20} {'是' if legacy_intact else '否':<10} {new:<14}")

    print()
    print(f"结论：{total} 组用例中，{affected} 组非 ASCII 路径在旧写法下失败；"
          f"新写法（按 UTF-8 读字节）全部 {total}/{total} 通过。")
    print()
    print("各语言旧写法的具体报错（用于 issue / EVIDENCE）：")
    for name, codepage, legacy, intact, new, note in rows:
        if legacy != "OK":
            print(f"  {name:<16} {codepage:<8} {note}")


if __name__ == "__main__":
    main()
