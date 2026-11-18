/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 46 Master E2E Suite (#226-#230):
 * 226. online-gerber-pcb-viewer
 * 227. online-ifc-viewer-validator
 * 228. online-image-jpg-to-dxf-vectorizer
 * 229. online-lisp-script-compiler-protector
 * 230. online-pdf-to-dwg-converter
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B46_TERMS = [
  'Eurocode 7',
  'FHWA Geotechnical',
  'ASTM D1557',
  'AASHTO Green Book',
  'ISO/ASTM 52900',
  'ISO 19650',
  'AIA CAD Layer Guidelines',
  'Best Online openBIM',
  'Best Online Image JPG/PNG',
  'Best Online AutoLISP',
  'Best Online Vector PDF',
  '9.9',
  '9.8',
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

  // 226. online-gerber-pcb-viewer
  {
    const label = '226 online-gerber-pcb-viewer';
    await openToolPage(page, `${BASE_URL}/toolbox/online-gerber-pcb-viewer`, '[data-testid="input-gerber"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B46_TERMS, label);

    await main.locator('[data-testid="preset-rect50x30"]').click();
    approx(await main.locator('[data-testid="out-board-w"]').innerText(), 50.2, `${label} rect boardW`);
    approx(await main.locator('[data-testid="out-board-h"]').innerText(), 30.2, `${label} rect boardH`);
    approx(await main.locator('[data-testid="out-traces"]').innerText(), 4, `${label} rect traces`);
    approx(await main.locator('[data-testid="out-pads"]').innerText(), 4, `${label} rect pads`);
    approx(await main.locator('[data-testid="out-drills"]').innerText(), 4, `${label} rect drills`);

    await main.locator('[data-testid="input-gerber"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty gerber`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-board-w"]').innerText(), 60.25, `${label} reset`);
    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Board Width,60.2500,mm'), `${label} CSV missing board width`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 227. online-ifc-viewer-validator
  {
    const label = '227 online-ifc-viewer-validator';
    await openToolPage(page, `${BASE_URL}/toolbox/online-ifc-viewer-validator`, '[data-testid="input-ifc"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B46_TERMS, label);

    assert.strictEqual((await main.locator('[data-testid="out-schema"]').innerText()).trim(), 'IFC4');
    approx(await main.locator('[data-testid="out-records"]').innerText(), 30, `${label} default records`);
    approx(await main.locator('[data-testid="out-elements"]').innerText(), 22, `${label} default elements`);
    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('PASS (4/4)'), `${label} pass status`);

    await main.locator('[data-testid="preset-missing-storey"]').click();
    approx(await main.locator('[data-testid="out-records"]').innerText(), 5, `${label} missing records`);
    approx(await main.locator('[data-testid="out-elements"]').innerText(), 2, `${label} missing elements`);
    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('WARN (3/4)'), `${label} warn status`);

    await main.locator('[data-testid="input-ifc"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty ifc`);

    await main.locator('[data-testid="btn-reset"]').click();
    assert((await main.locator('[data-testid="out-status"]').innerText()).includes('PASS (4/4)'), `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('IFCBUILDINGSTOREY,3,PASS'), `${label} CSV missing storey row`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 228. online-image-jpg-to-dxf-vectorizer
  {
    const label = '228 online-image-jpg-to-dxf-vectorizer';
    await openToolPage(page, `${BASE_URL}/toolbox/online-image-jpg-to-dxf-vectorizer`, '[data-testid="input-px-w"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B46_TERMS, label);

    approx(await main.locator('[data-testid="out-mm-per-px"]').innerText(), 0.1, `${label} default mmPerPx`);
    approx(await main.locator('[data-testid="out-cal-w"]').innerText(), 496.0, `${label} default calW`);
    approx(await main.locator('[data-testid="out-cal-h"]').innerText(), 350.8, `${label} default calH`);
    approx(await main.locator('[data-testid="out-dev-pct"]').innerText(), 18.1102, `${label} default devPct`);

    await main.locator('[data-testid="preset-254dpi-exact"]').click();
    approx(await main.locator('[data-testid="out-cal-w"]').innerText(), 254.0, `${label} 254dpi calW`);
    approx(await main.locator('[data-testid="out-cal-h"]').innerText(), 127.0, `${label} 254dpi calH`);
    approx(await main.locator('[data-testid="out-dev-pct"]').innerText(), 0.0, `${label} 254dpi devPct`);

    await main.locator('[data-testid="input-ref-px"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} zero refPx`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-cal-w"]').innerText(), 496.0, `${label} reset`);
    const [dlDxf] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-dxf"]').click(),
    ]);
    const dxf = await readDownloadText(dlDxf);
    assertAscii(dxf, `${label} DXF`);
    assert(dxf.includes('RASTER_CALIBRATION_FRAME'), `${label} DXF missing layer`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 229. online-lisp-script-compiler-protector
  {
    const label = '229 online-lisp-script-compiler-protector';
    await openToolPage(page, `${BASE_URL}/toolbox/online-lisp-script-compiler-protector`, '[data-testid="input-lsp"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B46_TERMS, label);

    assert.strictEqual((await main.locator('[data-testid="out-status"]').innerText()).trim().toUpperCase(), 'PASS');
    approx(await main.locator('[data-testid="out-open"]').innerText(), 18, `${label} default openParens`);
    approx(await main.locator('[data-testid="out-close"]').innerText(), 18, `${label} default closeParens`);
    approx(await main.locator('[data-testid="out-defuns"]').innerText(), 2, `${label} default defuns`);
    approx(await main.locator('[data-testid="out-missing-locals"]').innerText(), 0, `${label} default missingLocals`);

    await main.locator('[data-testid="preset-unbalanced"]').click();
    assert.strictEqual((await main.locator('[data-testid="out-status"]').innerText()).trim().toUpperCase(), 'FAIL');
    approx(await main.locator('[data-testid="out-missing-locals"]').innerText(), 1, `${label} unbalanced missingLocals`);

    await main.locator('[data-testid="input-lsp"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty lsp`);

    await main.locator('[data-testid="btn-reset"]').click();
    assert.strictEqual((await main.locator('[data-testid="out-status"]').innerText()).trim().toUpperCase(), 'PASS');
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Syntax Balance,18/18,PASS'), `${label} CSV missing syntax row`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 230. online-pdf-to-dwg-converter
  {
    const label = '230 online-pdf-to-dwg-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-pdf-to-dwg-converter`, '[data-testid="input-pdf-source"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B46_TERMS, label);

    assert((await main.locator('[data-testid="out-version"]').innerText()).includes('1.7'), `${label} default PDF 1.7`);
    approx(await main.locator('[data-testid="out-pages"]').innerText(), 2, `${label} default pages`);
    approx(await main.locator('[data-testid="out-images"]').innerText(), 0, `${label} default images`);
    assert((await main.locator('[data-testid="out-class"]').innerText()).toUpperCase().includes('VECTOR_READY'), `${label} vector class`);

    await main.locator('[data-testid="preset-raster"]').click();
    approx(await main.locator('[data-testid="out-pages"]').innerText(), 1, `${label} raster pages`);
    approx(await main.locator('[data-testid="out-images"]').innerText(), 1, `${label} raster images`);
    assert((await main.locator('[data-testid="out-class"]').innerText()).toUpperCase().includes('RASTER_SCAN_ONLY'), `${label} raster class`);

    await main.locator('[data-testid="input-pdf-source"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty pdf`);

    await main.locator('[data-testid="btn-reset"]').click();
    assert((await main.locator('[data-testid="out-class"]').innerText()).toUpperCase().includes('VECTOR_READY'), `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('-PDFIMPORT F "architectural_vector.pdf" 1 0,0 1 0'), `${label} SCR missing PDFIMPORT`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 46 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
