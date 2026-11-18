/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 47 Master E2E Suite (#231-#235):
 * 231. online-point-cloud-las-to-dxf-contour
 * 232. online-point-cloud-to-mesh-converter
 * 233. online-revit-family-checker-audit
 * 234. online-skp-to-fbx-cloud-converter
 * 235. online-solidworks-e-drawings-cloud-viewer
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B47_TERMS = [
  'Eurocode 7',
  'NIST Special Publication 811',
  'ASME Y14.5',
  'ISO/ASTM 52900',
  'AIA CAD Layer Guidelines',
  'ISO 19650',
  'CloudReferralClient',
  'Best Online',
  'Valid CFBF OLE Container',
];

function parseNumeric(text) {
  const cleaned = String(text || '').replace(/,/g, '').trim();
  const m = cleaned.match(/[+-]?\d+(?:\.\d+)?/);
  assert(m, `Expected numeric value in "${text}"`);
  return parseFloat(m[0]);
}

function approx(actualText, expected, label) {
  const actual = parseNumeric(actualText);
  const diff = Math.abs(actual - expected);
  const bound = Math.max(Math.abs(expected) * TOL, 1e-4);
  assert(diff <= bound, `${label}: expected ${expected} (+/-${bound}), got ${actual}`);
}

async function assertNoNan(main, label) {
  const body = await main.innerText();
  assert(!/\bNaN\b|\bInfinity\b/i.test(body), `${label}: contains NaN/Infinity`);
}

function assertAscii(text, label) {
  for (let i = 0; i < text.length; i++) {
    assert(text.charCodeAt(i) <= 127, `${label}: non-ASCII char code ${text.charCodeAt(i)} at index ${i}`);
  }
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
}

async function openToolPage(page, url, waitSelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector(waitSelector, { timeout: 15000 });
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
    },
    waitSelector,
    { timeout: 15000 }
  );
}

async function verifyNegativeTerms(page, terms, label) {
  const scopedText = await page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
    if (!mainEl) return '';
    const clone = mainEl.cloneNode(true);
    clone
      .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
  for (const term of terms) {
    assert(!scopedText.includes(term), `${label}: forbidden term "${term}" present`);
  }
}

async function assertZeroNumberInputs(main, label) {
  const cnt = await main.locator('input[type="number"]').count();
  assert.strictEqual(cnt, 0, `${label}: found ${cnt} <input type="number">`);
}

async function assertClipboardRejectSafe(page, main, label) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await main.locator('[data-testid="btn-copy"]').click();
  await page.waitForTimeout(50);
  const copyTxt = await main.locator('[data-testid="btn-copy"]').innerText();
  assert(!/Copied/i.test(copyTxt), `${label}: btn-copy must not show Copied on rejection`);
  await assertNoNan(main, `${label} clipboard-reject`);
}

async function runTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('response', (res) => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  // 231. online-point-cloud-las-to-dxf-contour
  {
    const label = '231 online-point-cloud-las-to-dxf-contour';
    await openToolPage(page, `${BASE_URL}/toolbox/online-point-cloud-las-to-dxf-contour`, '[data-testid="input-points"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B47_TERMS, label);

    approx(await main.locator('[data-testid="out-points"]').innerText(), 6, `${label} default points`);
    approx(await main.locator('[data-testid="out-relief"]').innerText(), 6.0, `${label} default relief`);
    approx(await main.locator('[data-testid="out-bands"]').innerText(), 4, `${label} default bands`);

    await main.locator('[data-testid="preset-slope"]').click();
    approx(await main.locator('[data-testid="out-points"]').innerText(), 4, `${label} slope points`);
    await main.locator('[data-testid="input-interval"]').fill('5');
    approx(await main.locator('[data-testid="out-bands"]').innerText(), 2, `${label} slope 5m interval bands`);

    await main.locator('[data-testid="input-interval"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid interval`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-points"]').innerText(), 6, `${label} reset points`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('ELEV_100.00_TO_102.00,2'), `${label} CSV missing elevation band`);

    const [dlDxf] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-dxf"]').click(),
    ]);
    const dxf = await readDownloadText(dlDxf);
    assertAscii(dxf, `${label} DXF`);
    assert(dxf.includes('AC1027') && dxf.includes('ELEV_100.00_TO_102.00') && dxf.includes('EOF'), `${label} DXF missing entities`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 232. online-point-cloud-to-mesh-converter
  {
    const label = '232 online-point-cloud-to-mesh-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-point-cloud-to-mesh-converter`, '[data-testid="input-span-x"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B47_TERMS, label);

    approx(await main.locator('[data-testid="out-density"]').innerText(), 1000.0, `${label} default density`);
    approx(await main.locator('[data-testid="out-triangles"]').innerText(), 560000, `${label} default triangles`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 28000084, `${label} default stl bytes`);
    approx(await main.locator('[data-testid="out-stl-mb"]').innerText(), 26.703, `${label} default stl mb`);

    await main.locator('[data-testid="preset-small-bracket"]').click();
    approx(await main.locator('[data-testid="out-density"]').innerText(), 500000.0, `${label} preset density`);
    approx(await main.locator('[data-testid="out-triangles"]').innerText(), 1200, `${label} preset triangles`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 60084, `${label} preset stl bytes`);

    await main.locator('[data-testid="input-voxel"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty voxel`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-triangles"]').innerText(), 560000, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Binary STL Size,28000084,bytes'), `${label} CSV missing STL bytes`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 233. online-revit-family-checker-audit
  {
    const label = '233 online-revit-family-checker-audit';
    await openToolPage(page, `${BASE_URL}/toolbox/online-revit-family-checker-audit`, '[data-testid="input-size-kb"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B47_TERMS, label);

    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('PASS'), `${label} default pass`);
    approx(await main.locator('[data-testid="out-size-ratio"]').innerText(), 60.0, `${label} default size ratio`);
    approx(await main.locator('[data-testid="out-tri-ratio"]').innerText(), 50.0, `${label} default tri ratio`);

    await main.locator('[data-testid="preset-bloated-family"]').click();
    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('FAIL'), `${label} preset fail`);
    approx(await main.locator('[data-testid="out-size-ratio"]').innerText(), 225.0, `${label} preset size ratio`);
    approx(await main.locator('[data-testid="out-tri-ratio"]').innerText(), 240.0, `${label} preset tri ratio`);

    await main.locator('[data-testid="input-size-kb"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid size`);

    await main.locator('[data-testid="btn-reset"]').click();
    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('PASS'), `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Overall Gate,0 failures,0 failures,PASS'), `${label} CSV missing PASS summary`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 234. online-skp-to-fbx-cloud-converter
  {
    const label = '234 online-skp-to-fbx-cloud-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-skp-to-fbx-cloud-converter`, '[data-testid="input-tris"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B47_TERMS, label);

    approx(await main.locator('[data-testid="out-geom-mb"]').innerText(), 4.1962, `${label} default geom`);
    approx(await main.locator('[data-testid="out-tex-mb"]').innerText(), 16.0, `${label} default tex`);
    approx(await main.locator('[data-testid="out-total-mb"]').innerText(), 20.1962, `${label} default total`);

    await main.locator('[data-testid="preset-heavy-fbx-mip"]').click();
    approx(await main.locator('[data-testid="out-geom-mb"]').innerText(), 34.3323, `${label} heavy geom`);
    approx(await main.locator('[data-testid="out-tex-mb"]').innerText(), 170.6624, `${label} heavy tex`);
    approx(await main.locator('[data-testid="out-total-mb"]').innerText(), 204.9947, `${label} heavy total`);

    await main.locator('[data-testid="input-tris"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid tris`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-total-mb"]').innerText(), 20.1962, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Geometry Vertex+Index Buffer,4400000,4.196167'), `${label} CSV missing geometry buffer`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 235. online-solidworks-e-drawings-cloud-viewer
  {
    const label = '235 online-solidworks-e-drawings-cloud-viewer';
    await openToolPage(page, `${BASE_URL}/toolbox/online-solidworks-e-drawings-cloud-viewer`, '[data-testid="input-total-comp"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B47_TERMS, label);

    approx(await main.locator('[data-testid="out-active-comp"]').innerText(), 300.0, `${label} default active`);
    approx(await main.locator('[data-testid="out-total-tris"]').innerText(), 600000, `${label} default tris`);
    approx(await main.locator('[data-testid="out-stl-mb"]').innerText(), 28.6103, `${label} default mb`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 30000084, `${label} default bytes`);

    await main.locator('[data-testid="preset-full-machine"]').click();
    approx(await main.locator('[data-testid="out-active-comp"]').innerText(), 100.0, `${label} full active`);
    approx(await main.locator('[data-testid="out-total-tris"]').innerText(), 1000000, `${label} full tris`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 50000084, `${label} full bytes`);

    await main.locator('[data-testid="input-suppressed-pct"]').fill('100');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid suppressed pct`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-total-tris"]').innerText(), 600000, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Binary STL Size Bytes,30000084,bytes'), `${label} CSV missing STL bytes`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `Failed requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 47 E2E TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
