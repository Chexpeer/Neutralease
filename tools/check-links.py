#!/usr/bin/env python3
"""
check-links.py - Controle qualite NeutralEase (a lancer AVANT chaque commit).
    python tools/check-links.py
Code de sortie 0 = OK, 1 = au moins une erreur.

Controles :
  1. Chaque href/src/url() existe, AVEC LA CASSE EXACTE (Vercel/Linux est sensible a la casse,
     Windows non : c'est la cause du 404 /Financement/).
  2. Si Git est disponible : la casse des fichiers suivis par Git correspond a celle du disque.
  3. Header identique et footer identique sur toutes les pages (apres normalisation).
  4. Aucun lien "Contact" dans le header ; lien "Contact" obligatoire dans le footer.
  5. Aucune page orpheline (sans lien entrant).
  6. Chaque page a <title>, <meta name="description">, un seul <h1>, et charge global.css + main.js.
"""
import os, re, glob, subprocess, sys
from urllib.parse import unquote

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
os.chdir(ROOT)
errors, warnings = [], []

def exists_exact(path):
    """Vrai seulement si chaque segment du chemin existe avec la casse exacte."""
    parts = [p for p in path.replace("\\", "/").split("/") if p not in ("", ".")]
    cur = "."
    for p in parts:
        if p not in os.listdir(cur):
            return False
        cur = os.path.join(cur, p)
    return True

pages = sorted(f.replace("\\", "/") for f in glob.glob("**/*.html", recursive=True)
               if not f.startswith(("assets/", "tools/")))
styles = sorted(f.replace("\\", "/") for f in glob.glob("**/*.css", recursive=True))
read = lambda p: open(p, encoding="utf-8").read()

# 1. references
for f in pages + styles:
    s = read(f)
    refs = re.findall(r'(?:href|src)=["\']([^"\'#?]+)', s) + re.findall(r'url\(["\']?([^)"\']+)', s)
    for r in refs:
        if re.match(r"(https?:|mailto:|tel:|data:|//)", r) or not r.strip():
            continue
        target = os.path.normpath(os.path.join(os.path.dirname(f), unquote(r))).replace("\\", "/")
        if target.startswith(".."):
            errors.append(f"{f}: lien sort du site -> {r}")
        elif not exists_exact(target):
            errors.append(f"{f}: lien/ressource introuvable (ou mauvaise casse) -> {r}")

# 2. casse Git
try:
    tracked = subprocess.run(["git", "ls-files"], capture_output=True, text=True, check=True).stdout.split("\n")
    on_disk = {os.path.relpath(os.path.join(d, n), ".").replace("\\", "/")
               for d, _, fs in os.walk(".") if ".git" not in d for n in fs}
    low = {p.lower(): p for p in on_disk}
    for t in filter(None, tracked):
        if t not in on_disk and t.lower() in low:
            errors.append(f"GIT casse differente : Git='{t}'  disque='{low[t.lower()]}'  -> git rm -r --cached <dossier> puis git add")
except Exception:
    warnings.append("Git indisponible : controle de casse Git ignore")

# 3 & 4. header / footer uniques, sans Contact
def norm(block, page):
    """Resout chaque href en chemin depuis la racine pour comparer des pages de profondeurs differentes."""
    def fix(m):
        t = os.path.normpath(os.path.join(os.path.dirname(page), m.group(1))).replace("\\", "/")
        return f'href="{t}"'
    out = re.sub(r'href="([^"#]+)"', fix, block)
    out = re.sub(r'src="([^"#]+)"', lambda m: 'src="' + os.path.normpath(os.path.join(os.path.dirname(page), m.group(1))).replace("\\", "/") + '"', out)
    return out.replace(' class="active"', "")
H, F = {}, {}
for f in pages:
    s = read(f)
    h = re.search(r"<header\b.*?</header>", s, re.S)
    ft = re.search(r"<footer\b.*?</footer>", s, re.S)
    if not h: errors.append(f"{f}: header manquant"); continue
    if not ft: errors.append(f"{f}: footer manquant"); continue
    H.setdefault(norm(h.group(0), f), []).append(f)
    F.setdefault(norm(ft.group(0), f), []).append(f)
    if re.search(r'href="[^"]*contact\.html"', h.group(0)):
        errors.append(f"{f}: lien Contact present dans le header (interdit)")
    if not re.search(r'href="[^"]*contact\.html"', ft.group(0)):
        errors.append(f"{f}: lien Contact absent du footer (obligatoire)")
for name, d in (("header", H), ("footer", F)):
    if len(d) > 1:
        errors.append(f"{len(d)} variantes de {name} : lancer python tools/sync-layout.py")

# 5. orphelines
inbound = dict.fromkeys(pages, 0)
for f in pages:
    for h in re.findall(r'href="([^"#]+)"', read(f)):
        if h.startswith(("http", "mailto", "tel")): continue
        t = os.path.normpath(os.path.join(os.path.dirname(f), h)).replace("\\", "/")
        if t in inbound and t != f: inbound[t] += 1
for p, n in inbound.items():
    if n == 0 and p != "index.html":
        errors.append(f"{p}: page orpheline (aucun lien entrant)")

# 6. hygiene de page
for f in pages:
    s = read(f)
    if not re.search(r"<title>.+?</title>", s): errors.append(f"{f}: <title> manquant")
    if 'name="description"' not in s: warnings.append(f"{f}: <meta name=\"description\"> manquante")
    if len(re.findall(r"<h1\b", s)) != 1: errors.append(f"{f}: il faut exactement un <h1>")
    if not re.search(r'assets/css/global\.css', s): errors.append(f"{f}: global.css non charge")
    if not re.search(r'assets/js/main\.js', s): errors.append(f"{f}: main.js non charge")
    todo = len(re.findall(r"\[À compléter", s))
    if todo: warnings.append(f"{f}: {todo} champ(s) '[À compléter ...]' a renseigner avant mise en ligne")

print(f"{len(pages)} pages, {len(styles)} CSS controles")
for w in warnings: print("  [avert.]", w)
for e in errors: print("  [ERREUR]", e)
print("RESULTAT :", "OK" if not errors else f"{len(errors)} erreur(s)")
sys.exit(1 if errors else 0)
