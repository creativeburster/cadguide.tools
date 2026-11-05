"""抓取官方网页或本地/远程 PDF，按关键词输出原文上下文，用于汇报中逐字引用。

用法:
  python fetch_quote.py <URL或PDF路径> <关键词1> [关键词2 ...]
输出中的文本必须原样复制进汇报，不得改写；乱码照贴并另行注明。
"""
import html
import os
import re
import sys
import tempfile
import urllib.request

CTX = 150


def page_text(src):
    if src.lower().endswith('.pdf'):
        path = src
        if src.startswith('http'):
            path = os.path.join(tempfile.gettempdir(), os.path.basename(src.split('?')[0]))
            if not os.path.exists(path):
                req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=120) as r, open(path, 'wb') as f:
                    f.write(r.read())
        import pypdf
        reader = pypdf.PdfReader(path)
        return [(f'PDF 第 {i + 1} 页', p.extract_text() or '') for i, p in enumerate(reader.pages)]
    req = urllib.request.Request(src, headers={'User-Agent': 'Mozilla/5.0'})
    raw = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
    raw = re.sub(r'<script.*?</script>|<style.*?</style>', '', raw, flags=re.S)
    txt = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', raw)))
    return [('网页', txt)]


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    src, keys = sys.argv[1], sys.argv[2:]
    print(f'来源: {src}')
    pages = page_text(src)
    for k in keys:
        hits = 0
        for label, t in pages:
            for m in re.finditer(re.escape(k), t):
                hits += 1
                if hits > 3:
                    break
                print(f'[{k}] {label}: {t[max(0, m.start() - CTX):m.end() + CTX]!r}')
        print(f'[{k}] 命中 {hits} 处' if hits else f'[{k}] 未找到（不得收录）')


if __name__ == '__main__':
    main()
