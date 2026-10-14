#!/usr/bin/env python3
"""
sync-layout.py - Applique assets/html/header.html et footer.html sur toutes les pages.
CDC V5.3 : header unique, footer unique. Sources de verite = assets/html/.
Usage (depuis n'importe ou) :  python tools/sync-layout.py
Idempotent : relancer apres toute modification des gabarits.
"""
import os, re, glob

ROOT_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
os.chdir(ROOT_DIR)

def read(p):
    return open(p, encoding="utf-8").read().replace("\r\n", "\n")

HEADER = read("assets/html/header.html").strip()
FOOTER = read("assets/html/footer.html").strip()


def resolve(tpl, page, with_active):
    """Remplace {{ROOT}} par le chemin relatif le plus court ; pour le header, marque la page courante."""
    start = os.path.dirname(page) or "."
    out = re.sub(
        r"\{\{ROOT\}\}([^\"]*)",
        lambda m: os.path.relpath(m.group(1), start).replace("\\", "/"),
        tpl,
    )
    if not with_active:
        return out

    def is_current(href):
        target = os.path.normpath(os.path.join(os.path.dirname(page), href))
        return target.replace("\\", "/") == page

    def mark(m):
        tag = m.group(0)
        if "aria-label" in tag or "data-noactive" in tag:   # logo et liens de renvoi : jamais actifs
            return tag
        return tag[:-1] + ' class="active">' if is_current(m.group(1)) else tag

    out = re.sub(r'<a href="([^"]+)"[^>]*>', mark, out)

    # un parent de sous-menu est actif si l'un de ses enfants l'est (gère les listes imbriquées)
    pieces, i = [], 0
    while True:
        j = out.find('<li class="dropdown">', i)
        if j < 0:
            pieces.append(out[i:]); break
        pieces.append(out[i:j]); depth, k = 0, j
        for m in re.finditer(r"<ul\b|</ul>", out[j:]):
            depth += 1 if m.group(0).startswith("<ul") else -1
            if depth == 0:
                k = j + m.end(); break
        k = out.find("</li>", k) + len("</li>")
        block = out[j:k]
        head, _, children = block.partition("<ul")
        if 'class="active"' in children and 'class="active"' not in head:
            head = re.sub(r'(<a href="[^"]+")', r'\1 class="active"', head, count=1)
        pieces.append(head + ("<ul" + children if children else ""))
        i = k
    return "".join(pieces)


def indent(block):
    return "\n".join(("    " + l if l.strip() else l) for l in block.split("\n"))


for f in sorted(glob.glob("**/*.html", recursive=True)):
    if f.startswith(("assets/", "tools/")):
        continue
    page = f.replace("\\", "/")
    s = read(f)
    s = re.sub(r"[ \t]*<header\b.*?</header>", lambda m: indent(resolve(HEADER, page, True)), s, count=1, flags=re.S)
    s = re.sub(r"[ \t]*<footer\b.*?</footer>", lambda m: indent(resolve(FOOTER, page, False)), s, count=1, flags=re.S)
    if 'rel="icon"' not in s:
        icon = os.path.relpath("images/favicon.png", os.path.dirname(page) or ".").replace("\\", "/")
        s = s.replace("</head>", '    <link rel="icon" type="image/png" href="%s">\n</head>' % icon, 1)
    open(f, "w", encoding="utf-8", newline="\n").write(s)
    print("OK ", page)
