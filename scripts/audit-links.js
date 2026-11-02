#!/usr/bin/env node
/**
 * Site-wide external link audit.
 *
 * Probes every external URL the site ships:
 *   1. Tool records  — official_url / pricing_url / trial_url / release_notes_url
 *                      / download_url / system_reqs_url  (src/lib/data/c*.ts)
 *   2. Deal cards    — link  (src/lib/deals-data.ts)
 *
 * Why this exists: vendors restructure their sites every year or two. A spot
 * audit on 2026-11-02 found 16 broken links out of 285 (5.6%), all of which
 * were silently shipping to users and crawlers.
 *
 * Classification matters — a 403 is almost always an anti-bot WAF (Autodesk,
 * Siemens, Adobe, SolidWorks all block non-browser clients) and is NOT a dead
 * link. Only 404 / 410 and unresolvable hosts are treated as failures.
 *
 * Usage:
 *   npm run audit:links              # probe everything, write a report
 *   npm run audit:links -- --strict  # also exit 1 when bot-blocked links appear
 *
 * Exit code: 0 when no dead links, 1 when dead links are found (so it can gate
 * a CI job). The report is always written to scratch/audit/.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const dns = require('dns');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'scratch', 'audit');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/125.0 Safari/537.36';
const CONCURRENCY = 10;
const TIMEOUT_MS = 20000;
const MAX_REDIRECTS = 8;
const STRICT = process.argv.includes('--strict');

const TOOL_FIELDS = [
  'official_url',
  'pricing_url',
  'trial_url',
  'release_notes_url',
  'download_url',
  'system_reqs_url',
];

/* ------------------------------------------------------------------ */
/* collect                                                             */
/* ------------------------------------------------------------------ */

function loadTools() {
  const tools = [];
  for (const n of ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7']) {
    const file = path.join(ROOT, 'src', 'lib', 'data', n + '.ts');
    const src = fs.readFileSync(file, 'utf8');
    const arrStart = src.indexOf('[');
    const body = src
      .slice(arrStart)
      .trim()
      .replace(/^\[/, '')
      .replace(/\];?\s*$/, '');
    // The data files are plain object literals with no type annotations inside,
    // so a direct eval is safe and mirrors what scripts/generate-search-index.js does.
    const arr = eval('[' + body + ']'); // eslint-disable-line no-eval
    arr.forEach((t) => tools.push(t));
  }
  return tools;
}

function loadDealLinks() {
  const file = path.join(ROOT, 'src', 'lib', 'deals-data.ts');
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, 'utf8');
  const out = new Map();
  const re = /id:\s*'([^']+)'/g;
  const ids = [];
  let m;
  while ((m = re.exec(src))) ids.push({ id: m[1], at: m.index });
  const linkRe = /link:\s*'([^']+)'/g;
  while ((m = linkRe.exec(src))) {
    const url = m[1];
    if (!/^https?:\/\//.test(url)) continue;
    // attribute to the nearest preceding id for a readable report
    const owner = ids.filter((x) => x.at < m.index).pop();
    const label = owner ? 'deal:' + owner.id : 'deal:?';
    if (!out.has(url)) out.set(url, []);
    out.get(url).push(label);
  }
  return [...out.entries()];
}

/* ------------------------------------------------------------------ */
/* probe                                                               */
/* ------------------------------------------------------------------ */

function probe(url, redirects = 0, chain = []) {
  return new Promise((resolve) => {
    if (redirects > MAX_REDIRECTS) return resolve({ code: 'REDIRECT_LOOP' });
    let mod;
    try {
      mod = url.startsWith('https') ? https : http;
    } catch {
      return resolve({ code: 'BAD_URL' });
    }
    let settled = false;
    const done = (r) => {
      if (!settled) {
        settled = true;
        resolve(r);
      }
    };
    let req;
    try {
      req = mod.get(
        url,
        { headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, timeout: TIMEOUT_MS },
        (res) => {
          const code = res.statusCode;
          res.resume();
          if (code >= 300 && code < 400 && res.headers.location) {
            let next;
            try {
              next = new URL(res.headers.location, url).toString();
            } catch {
              return done({ code });
            }
            if (chain.includes(next)) return done({ code: 'REDIRECT_LOOP' });
            return probe(next, redirects + 1, [...chain, next]).then(done);
          }
          done({ code, finalUrl: redirects ? url : undefined });
        }
      );
    } catch {
      return done({ code: 'BAD_URL' });
    }
    req.on('timeout', () => {
      req.destroy();
      done({ code: 'TIMEOUT' });
    });
    req.on('error', (e) => done({ code: 'ERR:' + (e.code || 'unknown') }));
  });
}

/**
 * Connection-level failures. These are retried once before being reported,
 * because a local DNS hiccup or a WAF that drops the TCP connection looks
 * exactly like this and is not a dead link. Notable real cases:
 *   - solidworks.com / autodesk.com reset the connection for non-browser clients
 *   - espritcam.com resolves through easyredir and occasionally fails to resolve
 */
const RETRYABLE = new Set([
  'TIMEOUT',
  'ERR:ECONNRESET',
  'ERR:ECONNREFUSED',
  'ERR:ETIMEDOUT',
  'ERR:EPIPE',
  'ERR:EAI_AGAIN',
]);

function classify(code) {
  if (code === 200 || code === 202 || code === 204) return 'OK';
  if (code === 401 || code === 403 || code === 429 || code === 999) return 'BOT_BLOCKED';
  if (code === 404 || code === 410) return 'DEAD';
  if (code === 'REDIRECT_LOOP') return 'BROKEN';
  if (code === 'DNS_FLAKY') return 'UNREACHABLE';
  if (typeof code === 'string') {
    // ENOTFOUND and TLS errors are real; dropped connections are not provable.
    return RETRYABLE.has(code) ? 'UNREACHABLE' : 'BROKEN';
  }
  return 'REDIRECT_UNRESOLVED';
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * A host that won't resolve can mean two very different things:
 *   - the vendor deleted the subdomain (a real, fixable dead link), or
 *   - this machine's resolver hiccupped (a false alarm).
 * Their apex domain tells them apart: if `example.com` still resolves, the
 * failure is almost certainly local flakiness on `sub.example.com`.
 */
async function apexResolves(host) {
  if (!host) return false;
  const parts = host.split('.');
  const apex = parts.length > 2 ? parts.slice(-2).join('.') : host;
  try {
    await dns.promises.lookup(apex, { family: 0 });
    return true;
  } catch {
    return false;
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function probeWithRetry(url) {
  let r = await probe(url);
  if (RETRYABLE.has(r.code)) {
    await sleep(600);
    const again = await probe(url);
    // Keep the second result if it got further, otherwise keep reporting the flake.
    if (!RETRYABLE.has(again.code)) r = again;
  }
  if (r.code === 'ERR:ENOTFOUND' && (await apexResolves(hostOf(url)))) {
    return { code: 'DNS_FLAKY', detail: hostOf(url) };
  }
  return r;
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  const tools = loadTools();
  const map = new Map(); // url -> [ "Tool name:field", ... ]

  const add = (url, owner) => {
    if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) return;
    if (!map.has(url)) map.set(url, new Set());
    map.get(url).add(owner);
  };

  for (const t of tools) {
    for (const f of TOOL_FIELDS) add(t[f], t.name + ':' + f);
  }
  for (const [url, owners] of loadDealLinks()) {
    owners.forEach((o) => add(url, o));
  }

  const urls = [...map.keys()];
  console.log(
    `auditing ${urls.length} unique external URLs (${tools.length} tools + deals) ...`
  );

  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const probed = await Promise.all(batch.map((u) => probeWithRetry(u)));
    probed.forEach((r, k) => results.push({ url: batch[k], ...r }));
    process.stdout.write(
      `\r  ${Math.min(i + CONCURRENCY, urls.length)}/${urls.length}`
    );
  }
  process.stdout.write('\n');

  const buckets = {
    OK: [],
    BOT_BLOCKED: [],
    DEAD: [],
    BROKEN: [],
    UNREACHABLE: [],
    REDIRECT_UNRESOLVED: [],
  };
  results.forEach((r) => {
    const k = classify(r.code);
    (buckets[k] || buckets.REDIRECT_UNRESOLVED).push(r);
  });

  const problems = [...buckets.DEAD, ...buckets.BROKEN, ...buckets.REDIRECT_UNRESOLVED];
  const warnings = buckets.UNREACHABLE;

  /* ---- console summary ---- */
  console.log('');
  console.log('=== SUMMARY ===');
  console.log(`  OK                 ${buckets.OK.length}`);
  console.log(`  bot-blocked (403)  ${buckets.BOT_BLOCKED.length}   (fine in a real browser)`);
  console.log(`  DEAD               ${buckets.DEAD.length}`);
  console.log(`  BROKEN (dns/tls)   ${buckets.BROKEN.length}`);
  console.log(`  unreachable        ${warnings.length}   (connection dropped / flaky DNS — verify by hand)`);
  console.log(`  unresolved 3xx     ${buckets.REDIRECT_UNRESOLVED.length}`);

  if (problems.length) {
    console.log('');
    console.log('=== NEEDS ATTENTION ===');
    problems.forEach((r) => {
      console.log(`  ${String(r.code).padEnd(14)} ${r.url}`);
      console.log(`                 used by: ${[...map.get(r.url)].join(', ')}`);
    });
  }

  if (warnings.length) {
    console.log('');
    console.log('=== WARNINGS (not counted as failures) ===');
    warnings.forEach((r) => {
      console.log(`  ${String(r.code).padEnd(14)} ${r.url}`);
      console.log(`                 used by: ${[...map.get(r.url)].join(', ')}`);
    });
  }

  /* ---- markdown report ---- */
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(REPORT_DIR, `link-audit-${stamp}.md`);
  const lines = [];
  lines.push(`# External link audit — ${stamp}`);
  lines.push('');
  lines.push(`- URLs probed: **${urls.length}**`);
  lines.push(`- Tool records: ${tools.length}`);
  lines.push('');
  lines.push('| Result | Count | Meaning |');
  lines.push('| --- | --- | --- |');
  lines.push(`| OK | ${buckets.OK.length} | 2xx, healthy |`);
  lines.push(`| Bot-blocked | ${buckets.BOT_BLOCKED.length} | 401/403/429 — WAF, fine in a browser |`);
  lines.push(`| Dead | ${buckets.DEAD.length} | 404/410 — must be fixed |`);
  lines.push(`| Broken | ${buckets.BROKEN.length} | DNS / TLS — must be fixed |`);
  lines.push(`| Unreachable | ${warnings.length} | connection dropped / flaky DNS — verify by hand |`);
  lines.push(`| Unresolved redirect | ${buckets.REDIRECT_UNRESOLVED.length} | 3xx that never resolved |`);
  lines.push('');
  if (problems.length) {
    lines.push('## Needs attention');
    lines.push('');
    lines.push('| Status | URL | Used by |');
    lines.push('| --- | --- | --- |');
    problems.forEach((r) => {
      lines.push(`| ${r.code} | ${r.url} | ${[...map.get(r.url)].join('<br>')} |`);
    });
  } else {
    lines.push('No dead or broken links. ');
  }
  if (warnings.length) {
    lines.push('');
    lines.push('## Warnings (not failures)');
    lines.push('');
    lines.push('| Status | URL | Used by |');
    lines.push('| --- | --- | --- |');
    warnings.forEach((r) => {
      lines.push(`| ${r.code} | ${r.url} | ${[...map.get(r.url)].join('<br>')} |`);
    });
  }
  fs.writeFileSync(reportPath, lines.join('\n') + '\n');
  console.log('');
  console.log('report written to ' + path.relative(ROOT, reportPath));

  const failing =
    problems.length > 0 ||
    (STRICT && (warnings.length > 0 || buckets.BOT_BLOCKED.length > 0));
  process.exit(failing ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
