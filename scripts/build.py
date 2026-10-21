#!/usr/bin/env python3
"""Package only public static files and validate local HTML/CSS references."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'
SOURCES = ['rainbow-bowling-static/static-site']
shutil.rmtree(OUT, ignore_errors=True)
OUT.mkdir()
for name in SOURCES:
    source = ROOT / name
    if source.is_dir():
        shutil.copytree(source, OUT, dirs_exist_ok=True, ignore=shutil.ignore_patterns("previews"))
    else:
        shutil.copy2(source, OUT / source.name)
(OUT / '.nojekyll').touch()
errors = []
class References(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = []; self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs: self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs: self.refs.append(attrs[key])
parsed = {}
for page in OUT.rglob('*.html'):
    doc = References(); doc.feed(page.read_text()); parsed[page] = doc
for page, doc in parsed.items():
    for ref in doc.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        if not ref or ref == '#':
            errors.append(f'{page.relative_to(OUT)}: empty link'); continue
        target = (page.parent / unquote(url.path)).resolve() if url.path else page
        if not target.is_relative_to(OUT.resolve()):
            errors.append(f'{page.relative_to(OUT)}: link escapes site: {ref}'); continue
        if not target.exists(): errors.append(f'{page.relative_to(OUT)}: missing {ref}')
        elif url.fragment and target in parsed and url.fragment not in parsed[target].ids:
            errors.append(f'{page.relative_to(OUT)}: missing fragment {ref}')
for sheet in OUT.rglob('*.css'):
    for ref in re.findall(r'url\([\'\"]?([^\)\'\"]+)', sheet.read_text()):
        if urlsplit(ref).scheme or ref.startswith('//'): continue
        if not (sheet.parent / ref.split('?')[0]).exists(): errors.append(f'{sheet.name}: missing {ref}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Packaged {len(parsed)} pages; local HTML and CSS references pass.')
