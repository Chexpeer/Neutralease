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
    """Remplace {{ROOT}} selon la profondeur et, pour le header, marque la page courante."""
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
        if "aria-label" in m.group(0):          # le logo n'est jamais actif
            return m.group(0)
        return m.group(0)[:-1] + ' class="active">' if is_current(m.group(1)) else m.group(0)

    out = re.sub(r'<a href="([^"]+)"[^>]*>', mark, out)

    def parent(m):                                # parent actif si un enfant l'est
        block = m.group(0)
        head, _, children = block.partition('<ul class="submenu">')
        if 'class="active"' in children and 'class="active"' not in head:
            head = re.sub(r'(<a href="[^"]+")>', r'\1 class="active">', head, count=1)
        return head + '<ul class="submenu">' + children

    return re.sub(r'<li class="dropdown">.*?</ul>\s*</li>', parent, out, flags=re.S)


def indent(block):
    return "\n".join(("    " + l if l.strip() else l) for l in block.split("\n"))


for f in sorted(glob.glob("**/*.html", recursive=True)):
    if f.startswith(("assets/", "tools/")):
        continue
    page = f.replace("\\", "/")
    s = read(f)
    s = re.sub(r"[ \t]*<header\b.*?</header>", lambda m: indent(resolve(HEADER, page, True)), s, count=1, flags=re.S)
    s = re.sub(r"[ \t]*<footer\b.*?</footer>", lambda m: indent(resolve(FOOTER, page, False)), s, count=1, flags=re.S)
    open(f, "w", encoding="utf-8", newline="\n").write(s)
    print("OK ", page)
