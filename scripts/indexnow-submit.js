#!/usr/bin/env node
/**
 * IndexNow URL Submission Script
 *
 * Submits all public URLs to IndexNow (Bing, Yandex, Naver, etc.)
 * for instant indexing. Run after `next build` to notify search
 * engines of new or updated content.
 *
 * Usage:
 *   node scripts/indexnow-submit.js          # Submit all URLs
 *   node scripts/indexnow-submit.js --dry    # Preview without submitting
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const INDEXNOW_KEY = 'c0c3a6b3fc6eb867423f763462d49591';
const INDEXNOW_KEY_LOCATION = `https://cadguide.tools/${INDEXNOW_KEY}.txt`;
const HOST = 'cadguide.tools';
const BASE_URL = `https://${HOST}`;
const API_ENDPOINT = 'api.indexnow.org';
const BATCH_SIZE = 10000; // IndexNow allows up to 10,000 URLs per request

const isDryRun = process.argv.includes('--dry');

// Collect all static URLs from the Next.js build output
function collectUrls() {
  const urls = new Set();

  // 1. Core static pages
  const staticPages = [
    '/',
    '/tools',
    '/compare',
    '/pricing',
    '/free',
    '/open-source',
    '/matchmaker',
    '/best',
    '/toolbox',
    '/deals',
  ];
  staticPages.forEach(u => urls.add(u));

  // 2. Tool detail pages — read from data files
  const dataDir = path.join(process.cwd(), 'src', 'lib', 'data');
  if (fs.existsSync(dataDir)) {
    const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));
    for (const file of dataFiles) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      // Extract slug values from the tool objects
      const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
      for (const match of slugMatches) {
        const slug = match[1];
        if (slug && !slug.includes('${')) {
          urls.add(`/tools/${slug}`);
        }
      }
    }
  }

  // 3. Compare pair pages — read from seo-content
  const seoContentPath = path.join(process.cwd(), 'src', 'lib', 'seo-content.ts');
  if (fs.existsSync(seoContentPath)) {
    const content = fs.readFileSync(seoContentPath, 'utf-8');
    const slugMatches = content.matchAll(/pairSlug:\s*["']([^"']+)["']/g);
    for (const match of slugMatches) {
      urls.add(`/compare/${match[1]}`);
    }
  }

  // 5. Pricing pages
  const pricingSlugs = ['subscription', 'perpetual', 'network', 'educational', 'freemium'];
  pricingSlugs.forEach(s => urls.add(`/pricing/${s}`));

  // 5b. Free subpages
  const freeSlugs = ['2d-cad', '3d-cad', 'bim', 'pcb', 'cam', 'rendering'];
  freeSlugs.forEach(s => urls.add(`/free/${s}`));

  // 5c. Best category pages
  const bestCategorySlugs = ['2d-cad', '3d-modeling', 'bim', 'viewer', 'cae-cam', 'eda', 'specialized', 'beginners'];
  bestCategorySlugs.forEach(s => urls.add(`/best/${s}`));

  // 5d. Best feature pages
  const bestFeatureSlugs = ['ai-assisted', 'cloud-collaboration', 'generative-design', 'parametric-modeling', 'direct-modeling', 'sheet-metal', 'surface-modeling', 'subdivision-modeling', 'mesh-modeling', 'reverse-engineering', 'integrated-cam', 'simulation-fea', 'bim-integration', 'piping-routing', 'rendering', 'drafting-detailing'];
  bestFeatureSlugs.forEach(s => urls.add(`/best/feature/${s}`));

  // 5e. Persona pages
  const personaSlugs = ['architects', 'mechanical-engineers', 'civil-engineers', 'students', 'jewelry-designers', 'electrical-engineers', 'animators', '3d-printing', 'startups', 'freelancers', 'landscape-architects', 'hvac-engineers', 'interior-designers', 'construction-managers', 'industrial-designers', 'cnc-machinists', 'cad-managers', 'structural-engineers', 'surveyors', 'fashion-designers'];
  personaSlugs.forEach(s => urls.add(`/for/${s}`));

  // 5f. Sector pages
  const sectorSlugs = ['cae', 'cam', '3d-printing', 'automotive', 'hydraulic-geotechnical', 'aerospace', 'rail-transit', 'medical-devices', 'sheet-metal', 'steel-structures', 'quantity-takeoff', 'piping-pipeline', 'reverse-engineering', 'agricultural-machinery', 'woodworking-customization', 'petrochemical'];
  sectorSlugs.forEach(s => urls.add(`/sectors/${s}`));

  // 5g. Platform pages
  const platformSlugs = ['mac', 'linux', 'web', 'ios', 'windows', 'android'];
  platformSlugs.forEach(s => urls.add(`/platforms/${s}`));

  // 5h. Alternatives pages — one per tool slug
  if (fs.existsSync(dataDir)) {
    const dataFiles2 = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));
    for (const file of dataFiles2) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
      const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
      for (const match of slugMatches) {
        const slug = match[1];
        if (slug && !slug.includes('${')) {
          urls.add(`/alternatives/${slug}`);
        }
      }
    }
  }

  // 5i. File format pages
  const formatSlugs = ['dwg', 'dxf', 'step', 'stl', 'iges', 'ifc', 'obj', 'pdf', 'fbx', 'jt', '3dm', '3mf', 'sldprt', 'ipt', 'rvt', 'dgn', 'gcode', 'x_t', 'sat', 'usd', 'dwf', 'exb', 'vda', 'cgr', 'catpart', 'nxprt', 'creoprt', 'slddrw', 'idw', 'f3d', 'skp'];
  formatSlugs.forEach(s => urls.add(`/formats/${s}`));

  // 6. Toolbox pages — read from app directory
  const toolboxDir = path.join(process.cwd(), 'src', 'app', 'toolbox');
  if (fs.existsSync(toolboxDir)) {
    const entries = fs.readdirSync(toolboxDir);
    for (const entry of entries) {
      const entryPath = path.join(toolboxDir, entry);
      if (fs.statSync(entryPath).isDirectory() && !entry.startsWith('[') && !entry.startsWith('(')) {
        urls.add(`/toolbox/${entry}`);
      }
    }
  }

  return [...urls].sort();
}

function submitToIndexNow(urlList) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: urlList.map(u => `${BASE_URL}${u}`),
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
      console.log(`[DRY RUN] Would submit ${urlList.length} URLs to IndexNow`);
      console.log(`Payload size: ${Buffer.byteLength(payload)} bytes`);
      resolve({ status: 200, ok: true, dryRun: true });
      return;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
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

  const urls = collectUrls();
  console.log(`Collected ${urls.length} URLs to submit`);

  if (urls.length === 0) {
    console.log('No URLs found. Exiting.');
    return;
  }

  // Submit in batches
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  console.log(`Submitting in ${batches.length} batch(es)...`);
  console.log('');

  for (let i = 0; i < batches.length; i++) {
    console.log(`Batch ${i + 1}/${batches.length} (${batches[i].length} URLs)...`);
    try {
      const result = await submitToIndexNow(batches[i]);
      if (result.ok) {
        console.log(`  ✓ Success`);
      } else {
        console.log(`  ✗ Failed (HTTP ${result.status})`);
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  console.log('');
  console.log('Done! Verify in Bing Webmaster Tools:');
  console.log('https://www.bing.com/webmasters/settings');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
