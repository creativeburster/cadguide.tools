/**
 * Phase 7 — Download per-tool logos to public/logos/.
 *
 * Strategy per tool:
 *   1. Extract slug + name + official_url from data.ts.
 *   2. Derive hostname from official_url (strip www.).
 *   3. Try icon.horse first — returns high-res favicons / Apple touch icons.
 *   4. Fall back to https://www.google.com/s2/favicons?domain=<host>&sz=128.
 *   5. Validate response: HTTP 200, content-type starts with image/, body
 *      length >= MIN_BYTES (filters out 1×1 placeholder pixels).
 *   6. Save to public/logos/<slug>.<ext> based on content-type.
 *   7. Write a manifest at scripts/phase7_logo_manifest.json: { slug: filename | null }.
 *
 * Idempotent: skips tools whose target file already exists.
 *
 * Run:  node scripts/phase7_download_logos.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const REPO = path.resolve(__dirname, '..');
const DATA_TS = path.join(REPO, 'src', 'lib', 'data.ts');
const LOGOS_DIR = path.join(REPO, 'public', 'logos');
const MANIFEST_PATH = path.join(__dirname, 'phase7_logo_manifest.json');
const MIN_BYTES = 100; // typical 1×1 ICO is ~70 bytes; SVG favicons can be ~200-400 bytes
const CONCURRENCY = 6;
const REQUEST_TIMEOUT_MS = 12000;

// Ensure target directories exist.
fs.mkdirSync(LOGOS_DIR, { recursive: true });

/** Parse data.ts and return [{slug, name, official_url}]. */
function loadTools() {
  const src = fs.readFileSync(DATA_TS, 'utf8');
  // Each tool object is a `{`...`}, {` block inside `const tools: Tool[] = [...]`.
  // Use a regex on the slug + name + official_url triplet. Both quoted and
  // unquoted property names need to be handled because phase 6 inserted entries
  // with quoted keys.
  const tools = [];
  // Capture blocks between top-level `id: "..."` lines and the next id or closing `];`.
  // Anchored to start-of-line + 2 spaces so we only match top-level tool ids,
  // not nested `id` fields inside pricing tiers etc.
  const blockRe = /(?:^  "?id"?\s*:\s*"([^"]+)")([\s\S]*?)(?=(?:^  "?id"?\s*:\s*"[^"]+")|(?:^\];))/gm;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const id = m[1];
    const body = m[2];
    const slugMatch = /"?slug"?\s*:\s*"([^"]+)"/.exec(body);
    const nameMatch = /"?name"?\s*:\s*"([^"]+)"/.exec(body);
    const urlMatch = /"?official_url"?\s*:\s*"([^"]+)"/.exec(body);
    if (!slugMatch || !nameMatch) continue;
    tools.push({
      id,
      slug: slugMatch[1],
      name: nameMatch[1],
      official_url: urlMatch ? urlMatch[1] : null,
    });
  }
  return tools;
}

function hostnameOf(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function fetchBuffer(url) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    const req = https.get(
      url,
      {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        // Follow up to 3 redirects.
        if (status >= 300 && status < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, url).toString();
          finish({ kind: 'redirect', to: next });
          return;
        }
        if (status !== 200) {
          res.resume();
          finish({ kind: 'error', error: `HTTP ${status}` });
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          finish({
            kind: 'ok',
            buffer: Buffer.concat(chunks),
            contentType: res.headers['content-type'] || '',
          })
        );
        res.on('error', (e) => finish({ kind: 'error', error: e.message }));
      }
    );
    req.on('error', (e) => finish({ kind: 'error', error: e.message }));
    req.on('timeout', () => {
      req.destroy();
      finish({ kind: 'error', error: 'timeout' });
    });
  });
}

async function fetchWithRedirects(url, max = 3) {
  let current = url;
  for (let i = 0; i <= max; i++) {
    const r = await fetchBuffer(current);
    if (r.kind === 'redirect') {
      current = r.to;
      continue;
    }
    return r;
  }
  return { kind: 'error', error: 'too many redirects' };
}

function extOf(contentType, fallback = 'png') {
  const ct = (contentType || '').toLowerCase();
  if (ct.includes('svg')) return 'svg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('icon') || ct.includes('x-icon')) return 'ico';
  return fallback;
}

function looksLikeImage(buf) {
  if (!buf || buf.length < 8) return false;
  const head = buf.slice(0, 12);
  // PNG: 89 50 4E 47
  if (head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47) return 'png';
  // JPEG: FF D8 FF
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return 'jpg';
  // GIF87a / GIF89a
  if (head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46) return 'gif';
  // ICO: 00 00 01 00
  if (head[0] === 0x00 && head[1] === 0x00 && head[2] === 0x01 && head[3] === 0x00) return 'ico';
  // WebP: 'RIFF'....'WEBP'
  if (head.slice(0, 4).toString('ascii') === 'RIFF' && head.slice(8, 12).toString('ascii') === 'WEBP') return 'webp';
  // SVG (text-based)
  const start = buf.slice(0, 200).toString('utf8').trimStart().toLowerCase();
  if (start.startsWith('<?xml') || start.startsWith('<svg')) return 'svg';
  return false;
}

async function downloadOne(tool, existingFiles) {
  // Skip if a file matching <slug>.* already exists.
  const existing = existingFiles.find((f) => f.startsWith(tool.slug + '.'));
  if (existing) {
    return { slug: tool.slug, file: existing, source: 'cache' };
  }
  const host = hostnameOf(tool.official_url);
  if (!host) {
    return { slug: tool.slug, file: null, source: 'no-host', error: 'no official_url' };
  }

  const sources = [
    { name: 'icon.horse', url: `https://icon.horse/icon/${host}` },
    { name: 'google-s2', url: `https://www.google.com/s2/favicons?domain=${host}&sz=128` },
    { name: 'ddg', url: `https://icons.duckduckgo.com/ip3/${host}.ico` },
  ];

  for (const src of sources) {
    const r = await fetchWithRedirects(src.url);
    if (r.kind !== 'ok') continue;
    if (!r.buffer || r.buffer.length < MIN_BYTES) continue;
    const detected = looksLikeImage(r.buffer);
    if (!detected) continue;
    const ext = detected || extOf(r.contentType);
    const filename = `${tool.slug}.${ext}`;
    fs.writeFileSync(path.join(LOGOS_DIR, filename), r.buffer);
    return { slug: tool.slug, file: filename, source: src.name, bytes: r.buffer.length };
  }
  return { slug: tool.slug, file: null, source: 'failed', error: 'no source returned a valid image' };
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let i = 0;
  let active = 0;
  return new Promise((resolve) => {
    const next = () => {
      if (i >= items.length && active === 0) {
        return resolve(results);
      }
      while (active < concurrency && i < items.length) {
        const idx = i++;
        active++;
        worker(items[idx], idx).then((r) => {
          results[idx] = r;
          active--;
          if (results.length % 10 === 0 || active === 0) {
            process.stdout.write(`. ${idx + 1}/${items.length}\r`);
          }
          next();
        });
      }
    };
    next();
  });
}

async function main() {
  const tools = loadTools();
  console.log(`Loaded ${tools.length} tools from data.ts.`);

  const existingFiles = fs.readdirSync(LOGOS_DIR);
  const results = await runPool(tools, (t) => downloadOne(t, existingFiles), CONCURRENCY);

  const manifest = {};
  const failed = [];
  let cached = 0;
  let downloaded = 0;
  for (const r of results) {
    manifest[r.slug] = r.file;
    if (r.source === 'cache') cached++;
    else if (r.file) downloaded++;
    else failed.push(r);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('');
  console.log(`Downloaded:   ${downloaded}`);
  console.log(`Cached:       ${cached}`);
  console.log(`Failed:       ${failed.length}`);
  if (failed.length > 0) {
    console.log('Failed slugs:');
    for (const f of failed) {
      console.log(`  - ${f.slug}  (${f.error || 'unknown error'})`);
    }
  }
  console.log(`Manifest:     ${MANIFEST_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
