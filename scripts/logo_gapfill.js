#!/usr/bin/env node
/**
 * Targeted gap-fill for the 14 tools that Phase 7's automated favicon
 * pipeline (icon.horse / Google s2 / DDG) couldn't resolve.
 *
 * Strategy: actually GET the vendor's homepage, parse <head>, and pick
 * the highest-resolution icon advertised via:
 *   1. <link rel="apple-touch-icon" sizes="...">
 *   2. <link rel="icon" sizes="...">
 *   3. <meta property="og:image">
 *   4. /favicon.ico (last-resort)
 * Resolve relative URLs against the page origin, validate the response
 * is an image, write to public/logos/<slug>.<ext>.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const LOGOS_DIR = path.join(ROOT, 'public/logos');
const MANIFEST_TS = path.join(ROOT, 'src/lib/logo-manifest.ts');
const MANIFEST_JSON = path.join(__dirname, 'phase7_logo_manifest.json');

const REQUEST_TIMEOUT_MS = 15000;
const MIN_BYTES = 100;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

// (slug, candidate-URL[]) — vendor research:
// - Where the vendor's homepage actually exposes a high-resolution mark,
//   we point straight at it (saves one HTML fetch).
// - For obscure vendors we still rely on parsing the homepage.
const TARGETS = [
  { slug: 'shoemaster', urls: ['https://www.shoemaster.co.uk'] },
  { slug: 'bimoffice', urls: ['https://www.bimoffice.com/'] },
  { slug: 'sinovation', urls: ['http://www.hweast.com/'] },
  { slug: 'haochen-cad', urls: ['http://www.hccad.net/'] },
  { slug: 'cadmeister', urls: ['https://www.cadmeister.com/', 'https://www.uel.co.jp/cadmeister/', 'https://www.uel.co.jp/'] },
  { slug: 'model-studio-cs', urls: ['https://www.mstudio.ru/'] },
  { slug: 'think3', urls: ['https://www.think3.eu/'] },
  { slug: 'cadvision', urls: ['https://www.cadvision.com/'] },
  { slug: 'dds-cad', urls: ['https://www.dds-cad.com/'] },
  { slug: 'target-3001', urls: ['https://ibf-it.com/'] },
  { slug: 'moldex3d', urls: ['https://www.moldex3d.com/'] },
  { slug: 'foran', urls: ['https://www.sener-foran.com/'] },
  { slug: 'autodesk-dynamo', urls: ['https://dynamobim.org', 'https://www.autodesk.com/products/dynamo-studio/overview'] },
  { slug: 'risa-3d', urls: ['https://risa.com/products/risa-3d', 'https://risa.com'] },
];

function fetchOnce(url, asBuffer = false) {
  return new Promise((resolve) => {
    let lib;
    try {
      const u = new URL(url);
      lib = u.protocol === 'http:' ? http : https;
    } catch {
      return resolve({ kind: 'badurl' });
    }
    const req = lib.get(url, { headers: { 'User-Agent': UA, Accept: '*/*' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        return resolve(fetchOnce(next, asBuffer));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ kind: 'status', status: res.statusCode });
      }
      if (asBuffer) {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({
            kind: 'ok',
            buffer: Buffer.concat(chunks),
            contentType: (res.headers['content-type'] || '').toLowerCase(),
          })
        );
      } else {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ kind: 'ok', body }));
      }
    });
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', (e) => resolve({ kind: 'error', error: e.message }));
  });
}

function looksLikeImage(buf) {
  if (!buf || buf.length < 8) return null;
  if (buf.slice(0, 8).toString('hex') === '89504e470d0a1a0a') return 'png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.slice(0, 6).toString() === 'GIF87a' || buf.slice(0, 6).toString() === 'GIF89a') return 'gif';
  if (buf.slice(0, 4).toString('hex') === '00000100') return 'ico';
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return 'webp';
  const head = buf.slice(0, 1024).toString('utf8').toLowerCase();
  if (head.includes('<svg') || head.includes('<?xml')) return 'svg';
  return null;
}

function extractIconCandidates(html, baseUrl) {
  const candidates = [];

  // Apple touch icons (usually highest-quality, 180px+)
  const appleRe = /<link[^>]+rel=["']?apple-touch-icon[^"']*["']?[^>]+>/gi;
  for (const m of html.matchAll(appleRe)) {
    const href = /href=["']([^"']+)["']/i.exec(m[0]);
    const sizes = /sizes=["']([^"']+)["']/i.exec(m[0]);
    if (href) {
      const size = sizes ? parseInt(sizes[1].split('x')[0], 10) : 180;
      candidates.push({ href: href[1], size, kind: 'apple' });
    }
  }

  // Icon links
  const iconRe = /<link[^>]+rel=["']?(?:shortcut )?icon["']?[^>]+>/gi;
  for (const m of html.matchAll(iconRe)) {
    const href = /href=["']([^"']+)["']/i.exec(m[0]);
    const sizes = /sizes=["']([^"']+)["']/i.exec(m[0]);
    const typeAttr = /type=["']([^"']+)["']/i.exec(m[0]);
    if (href) {
      let size = sizes ? parseInt(sizes[1].split('x')[0], 10) : 32;
      if (typeAttr && typeAttr[1].includes('svg')) size = 999; // SVG always wins on quality
      candidates.push({ href: href[1], size, kind: 'icon' });
    }
  }

  // og:image as last-priority candidate
  const ogRe = /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i;
  const og = ogRe.exec(html);
  if (og) candidates.push({ href: og[1], size: 50, kind: 'og' });

  // /favicon.ico as ultimate fallback
  candidates.push({ href: '/favicon.ico', size: 16, kind: 'favicon-default' });

  // Resolve URLs and sort by size desc (SVG / largest first)
  return candidates
    .map((c) => {
      try {
        return { ...c, abs: new URL(c.href, baseUrl).toString() };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.size - a.size);
}

async function tryDownloadIcon(slug, urls) {
  for (const homepage of urls) {
    const page = await fetchOnce(homepage, false);
    if (page.kind !== 'ok' || !page.body) continue;
    const candidates = extractIconCandidates(page.body, homepage);
    for (const cand of candidates) {
      const r = await fetchOnce(cand.abs, true);
      if (r.kind !== 'ok' || !r.buffer || r.buffer.length < MIN_BYTES) continue;
      const ext = looksLikeImage(r.buffer);
      if (!ext) continue;
      const filename = `${slug}.${ext}`;
      fs.writeFileSync(path.join(LOGOS_DIR, filename), r.buffer);
      return {
        ok: true,
        file: filename,
        bytes: r.buffer.length,
        source: cand.abs,
        kind: cand.kind,
        size: cand.size,
      };
    }
  }
  return { ok: false };
}

async function main() {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
  const results = [];
  for (const t of TARGETS) {
    process.stdout.write(`[${t.slug}] ... `);
    const r = await tryDownloadIcon(t.slug, t.urls);
    if (r.ok) {
      console.log(`OK ${r.file} (${r.bytes} B, ${r.kind}@${r.size}px from ${r.source})`);
    } else {
      console.log('FAILED — no usable icon');
    }
    results.push({ slug: t.slug, ...r });
  }

  // Rebuild manifest.ts from public/logos/ + add new entries
  const existing = JSON.parse(fs.readFileSync(MANIFEST_JSON, 'utf8'));
  for (const r of results) {
    if (r.ok) existing[r.slug] = { file: r.file, source: r.source, bytes: r.bytes };
  }
  fs.writeFileSync(MANIFEST_JSON, JSON.stringify(existing, null, 2));

  const entries = Object.entries(existing)
    .filter(([, v]) => v && v.file)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v.file)},`)
    .join('\n');

  fs.writeFileSync(
    MANIFEST_TS,
    `// Auto-generated by scripts/phase7_download_logos.js + scripts/logo_gapfill.js
// Maps tool slug to a local file in public/logos/.
// Tools missing from this map fall back to icon.horse / Google s2 / gradient initials.

export const LOGO_MANIFEST: Record<string, string> = {
${entries}
};
`
  );

  console.log('\n--- Summary ---');
  for (const r of results) console.log(`${r.ok ? '+' : ' '} ${r.slug}: ${r.ok ? r.file : 'failed'}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
