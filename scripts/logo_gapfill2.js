#!/usr/bin/env node
/**
 * Logo gap-fill v2 — uses Google's s2 favicon service for the 13 remaining
 * tools whose homepages are unreachable / DNS-failed / behind paywalls from
 * this VM. After the v1 script (logo_gapfill.js) recovered moldex3d and
 * risa-3d, the remaining 13 needed corrected source domains, which were
 * researched manually and are pinned below.
 *
 * Sources (researched via web search 2026-05-16, see commit message):
 *   shoemaster      → atom-shoemaster.com   (rebrand under Atom group)
 *   bimoffice       → bimoffice.fr           (ABVENT/IFI, .fr is canonical)
 *   sinovation      → hoteamsoft.com         (parent: 华天软件 Hoteam Soft)
 *   haochen-cad     → gstarcad.net           (浩辰 == GstarCAD intl. brand)
 *   cadmeister      → biprogy-uel.co.jp      (UEL renamed to BIPROGY-UEL)
 *   model-studio-cs → csoft.ru               (parent: CSoft Development)
 *   think3          → dptlab.com             (DPT acquired the ThinkDesign IP)
 *   cadvision       → cadvision-systems.com
 *   dds-cad         → graphisoft.com         (Nemetschek/Graphisoft DDS-CAD)
 *   target-3001     → ibfriedrich.com        (IB-Friedrich, vendor)
 *   foran           → siemens.com            (Siemens acquired SENER Marine 2024)
 *   autodesk-dynamo → autodesk.com           (Autodesk product line)
 *
 * The Google s2 endpoint resolves canonical favicons server-side (it can
 * read Apple-touch-icons and rel=icon links the VM cannot fetch directly).
 * Size capped at 128px regardless of sz parameter request.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGETS = [
  { slug: 'shoemaster',      host: 'atom-shoemaster.com' },
  { slug: 'bimoffice',       host: 'bimoffice.fr' },
  { slug: 'sinovation',      host: 'hoteamsoft.com' },
  { slug: 'haochen-cad',     host: 'gstarcad.net' },
  { slug: 'cadmeister',      host: 'biprogy-uel.co.jp' },
  { slug: 'model-studio-cs', host: 'csoft.ru' },
  { slug: 'think3',          host: 'dptlab.com' },
  { slug: 'cadvision',       host: 'cadvision-systems.com' },
  { slug: 'dds-cad',         host: 'graphisoft.com' },
  { slug: 'target-3001',     host: 'ibfriedrich.com' },
  { slug: 'foran',           host: 'siemens.com' },
  { slug: 'autodesk-dynamo', host: 'autodesk.com' },
];

const OUT_DIR = path.join(__dirname, '..', 'public', 'logos');
const MANIFEST_TS = path.join(__dirname, '..', 'src', 'lib', 'logo-manifest.ts');
const MANIFEST_JSON = path.join(__dirname, 'phase7_logo_manifest.json');

function fetchBuf(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux) AppleWebKit/537.36 Chrome/120 Safari/537.36' }, timeout: 15000 },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects > 0) {
          res.resume();
          const next = new URL(res.headers.location, url).toString();
          return resolve(fetchBuf(next, redirects - 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error('HTTP ' + res.statusCode));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      },
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('timeout')));
  });
}

function detectExt(buf) {
  const head8 = buf.slice(0, 8).toString('hex');
  if (head8.startsWith('89504e47')) return 'png';
  if (head8.startsWith('ffd8ff')) return 'jpg';
  if (head8.startsWith('47494638')) return 'gif';
  if (head8.startsWith('00000100')) return 'ico';
  if (head8.startsWith('52494646')) return 'webp';
  const txt = buf.slice(0, 256).toString('utf8').trim().toLowerCase();
  if (txt.startsWith('<?xml') || txt.startsWith('<svg')) return 'svg';
  return null;
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = JSON.parse(fs.existsSync(MANIFEST_JSON) ? fs.readFileSync(MANIFEST_JSON, 'utf8') : '{}');
  let added = 0;

  for (const { slug, host } of TARGETS) {
    const url = `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
    try {
      const buf = await fetchBuf(url);
      if (buf.length < 200) throw new Error('too small (' + buf.length + 'B)');
      const ext = detectExt(buf);
      if (!ext) throw new Error('unknown magic');
      const dst = path.join(OUT_DIR, `${slug}.${ext}`);
      fs.writeFileSync(dst, buf);
      manifest[slug] = `${slug}.${ext}`;
      console.log(`OK ${slug.padEnd(18)} ${ext}  ${buf.length}B  ${host}`);
      added++;
    } catch (e) {
      console.log(`FAIL ${slug.padEnd(18)} ${host}  ${e.message}`);
    }
  }

  // sort & write manifest.json
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  fs.writeFileSync(MANIFEST_JSON, JSON.stringify(sorted, null, 2) + '\n');

  // regenerate logo-manifest.ts
  const tsLines = [
    '// auto-generated by scripts/phase7_download_logos.js + logo_gapfill*.js — do not hand-edit',
    'export const LOGO_MANIFEST: Record<string, string> = {',
    ...Object.entries(sorted).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
    '};',
    '',
  ];
  fs.writeFileSync(MANIFEST_TS, tsLines.join('\n'));

  console.log(`\n${added}/${TARGETS.length} logos added. Manifest now has ${Object.keys(sorted).length} entries.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
