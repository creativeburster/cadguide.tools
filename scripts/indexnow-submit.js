#!/usr/bin/env node
/**
 * IndexNow URL Submission Script
 *
 * Reads the exact <loc> URLs from the built single-file sitemap.xml
 * (.next/server/app/sitemap.xml.body or out/sitemap.xml) so IndexNow
 * submits the exact 1,260 canonical URLs present in sitemap.xml.
 *
 * Usage:
 *   node scripts/indexnow-submit.js --force  # Submit all URLs immediately
 *   node scripts/indexnow-submit.js --dry    # Preview without submitting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEXNOW_KEY = 'c0c3a6b3fc6eb867423f763462d49591';
const INDEXNOW_KEY_LOCATION = `https://cadguide.tools/${INDEXNOW_KEY}.txt`;
const HOST = 'cadguide.tools';
const API_ENDPOINT = 'api.indexnow.org';
const BATCH_SIZE = 10000;

const isDryRun = process.argv.includes('--dry');

function collectUrlsFromSitemap() {
  const candidates = [
    path.join(process.cwd(), 'out', 'sitemap.xml'),
    path.join(process.cwd(), '.next', 'server', 'app', 'sitemap.xml.body'),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      const xml = fs.readFileSync(file, 'utf-8');
      const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
      if (matches.length > 0 && !xml.includes('<sitemapindex')) {
        console.log(`Loaded ${matches.length} canonical URLs from ${path.relative(process.cwd(), file)}`);
        return [...new Set(matches)];
      }
    }
  }
  return [];
}

function submitToIndexNow(fullUrlList) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: fullUrlList,
    });

    const options = {
      hostname: API_ENDPOINT,
      port: 443,
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
        'Host': API_ENDPOINT,
      },
    };

    if (isDryRun) {
      console.log(`[DRY RUN] Would submit ${fullUrlList.length} URLs to IndexNow`);
      console.log(`Payload size: ${Buffer.byteLength(payload)} bytes`);
      resolve({ status: 200, ok: true, dryRun: true });
      return;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`IndexNow response: ${res.statusCode} ${res.statusMessage}`);
        if (!ok) {
          console.log(`Response body: ${body}`);
        }
        resolve({ status: res.statusCode, ok, body });
      });
    });

    req.on('error', (err) => {
      console.error('IndexNow request failed:', err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('--- IndexNow URL Submission ---');
  console.log(`Host: ${HOST}`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Key location: ${INDEXNOW_KEY_LOCATION}`);
  console.log('');

  const isCloudflareProd = process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH === 'main';
  const isVercel = process.env.VERCEL === '1';
  const forceSubmit =
    process.argv.includes('--force') ||
    process.argv.includes('--submit') ||
    process.env.SUBMIT_INDEXNOW === '1';

  if (!isCloudflareProd && !isVercel && !forceSubmit && !isDryRun) {
    console.log('[IndexNow Shield] Local build detected. Skipping submission to protect search engine quotas.');
    console.log('To force submission locally, run: node scripts/indexnow-submit.js --force');
    return;
  }

  const urls = collectUrlsFromSitemap();
  console.log(`Collected ${urls.length} URLs to submit`);

  if (urls.length === 0) {
    console.log('No URLs found in built sitemap.xml. Exiting.');
    return;
  }

  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  console.log(`Submitting in ${batches.length} batch(es)...`);
  for (let i = 0; i < batches.length; i++) {
    console.log(`Batch ${i + 1}/${batches.length} (${batches[i].length} URLs)...`);
    const result = await submitToIndexNow(batches[i]);
    if (result.ok) {
      console.log('  ✓ Success');
    } else {
      console.log(`  ✗ Failed (HTTP ${result.status})`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
