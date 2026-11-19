/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 49 Master E2E Suite (#241-#245):
 * 241. parametric-3d-part-generator
 * 242. parking-capacity-calculator
 * 243. passing-sight-distance-calculator
 * 244. pavement-thickness-calculator
 * 245. pdf-plot-chinese-gibberish-resolver
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B49_TERMS = [
  'AASHTO',
  'Eurocode 7',
  'FHWA',
  'ASTM D1557',
  'NIST Special Publication',
  'BIPM SI Brochure',
  'ISO/ASTM 52900',
  'AIA CAD Layer Guidelines',
  'ISO 19650',
  'ASME/DIN',
  'ISO 53',
  'AGMA Standard',
  'ADA TITLE III',
  'ISO 80000-1',
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
  const cnt = await main.locator('input[type="number"], input[type="range"]').count();
  assert.strictEqual(cnt, 0, `${label}: found ${cnt} <input type="number|range">`);
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

  // 241. parametric-3d-part-generator
  {
    const label = '241 parametric-3d-part-generator';
    await openToolPage(page, `${BASE_URL}/toolbox/parametric-3d-part-generator`, '[data-testid="input-module"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B49_TERMS, label);

    approx(await main.locator('[data-testid="out-tris"]').innerText(), 1152, `${label} gear tris`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 57684, `${label} gear stl bytes`);
    approx(await main.locator('[data-testid="out-spec-0"]').innerText(), 60.0, `${label} gear pitch dia`);

    await main.locator('[data-testid="preset-flange"]').click();
    approx(await main.locator('[data-testid="out-tris"]').innerText(), 832, `${label} flange tris`);
    approx(await main.locator('[data-testid="out-stl-bytes"]').innerText(), 41684, `${label} flange stl bytes`);

    await main.locator('[data-testid="preset-bracket"]').click();
    approx(await main.locator('[data-testid="out-tris"]').innerText(), 24, `${label} bracket tris`);

    await main.locator('[data-testid="input-leg-a"]').fill('5');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid bracket leg`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-tris"]').innerText(), 1152, `${label} reset gear`);

    await main.locator('[data-testid="btn-yaw-inc"]').click();
    assert.strictEqual(await main.locator('[data-testid="input-yaw"]').inputValue(), '51');
    await main.locator('[data-testid="btn-pitch-dec"]').click();
    assert.strictEqual(await main.locator('[data-testid="input-pitch"]').inputValue(), '15');
    await main.locator('[data-testid="input-yaw"]').fill('45');
    await assertNoNan(main, `${label} viewport rotation`);
    await main.locator('[data-testid="btn-reset"]').click();

    const [dlStl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-stl"]').click(),
    ]);
    const stlSize = fs.statSync(await dlStl.path()).size;
    assert.strictEqual(stlSize, 57684, `${label} Binary STL size mismatch: ${stlSize}`);

    const [dlStep] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-step"]').click(),
    ]);
    const stepText = await readDownloadText(dlStep);
    assertAscii(stepText, `${label} STEP`);
    assert(stepText.includes('ISO-10303-21;') && stepText.includes('END-ISO-10303-21;'), `${label} STEP envelope missing`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('TriangleCount,1152'), `${label} CSV missing TriangleCount`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 242. parking-capacity-calculator
  {
    const label = '242 parking-capacity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/parking-capacity-calculator`, '[data-testid="input-area"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B49_TERMS, label);

    approx(await main.locator('[data-testid="out-total"]').innerText(), 152, `${label} default total`);
    approx(await main.locator('[data-testid="out-accessible"]').innerText(), 6, `${label} default accessible`);
    approx(await main.locator('[data-testid="out-van"]').innerText(), 1, `${label} default van`);

    await main.locator('[data-testid="preset-mega-30000"]').click();
    approx(await main.locator('[data-testid="out-total"]').innerText(), 1200, `${label} mega total`);
    approx(await main.locator('[data-testid="out-accessible"]').innerText(), 22, `${label} mega accessible`);
    approx(await main.locator('[data-testid="out-van"]').innerText(), 4, `${label} mega van`);

    await main.locator('[data-testid="input-area"]').fill('10');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} area < factor`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-total"]').innerText(), 152, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Required Accessible Stalls (ADA 208.2),6,spaces'), `${label} CSV missing ADA 208.2`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 243. passing-sight-distance-calculator
  {
    const label = '243 passing-sight-distance-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/passing-sight-distance-calculator`, '[data-testid="input-vp"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B49_TERMS, label);

    approx(await main.locator('[data-testid="out-d1"]').innerText(), 85.2, `${label} default d1`);
    approx(await main.locator('[data-testid="out-d2"]').innerText(), 250.0, `${label} default d2`);
    approx(await main.locator('[data-testid="out-d3"]').innerText(), 55.0, `${label} default d3`);
    approx(await main.locator('[data-testid="out-d4"]').innerText(), 165.0, `${label} default d4`);
    approx(await main.locator('[data-testid="out-psd"]').innerText(), 555.2, `${label} default PSD`);

    await main.locator('[data-testid="preset-highway-110"]').click();
    approx(await main.locator('[data-testid="out-d1"]').innerText(), 110.292, `${label} hwy d1`);
    approx(await main.locator('[data-testid="out-psd"]').innerText(), 741.4031, `${label} hwy PSD`);

    await main.locator('[data-testid="input-vs"]').fill('120');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} Vs >= Vp`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-psd"]').innerText(), 555.2, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Total Passing Sight Distance,555.2000,m'), `${label} CSV missing PSD`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 244. pavement-thickness-calculator
  {
    const label = '244 pavement-thickness-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/pavement-thickness-calculator`, '[data-testid="input-sn"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B49_TERMS, label);

    approx(await main.locator('[data-testid="out-d3-exact"]').innerText(), 222.9091, `${label} default D3 exact`);
    approx(await main.locator('[data-testid="out-d3-design"]').innerText(), 230, `${label} default D3 design`);
    approx(await main.locator('[data-testid="out-sn-total"]').innerText(), 3.8307, `${label} default SN total`);
    approx(await main.locator('[data-testid="out-total-depth"]').innerText(), 530, `${label} default total depth`);

    await main.locator('[data-testid="preset-heavy-haul"]').click();
    approx(await main.locator('[data-testid="out-d3-exact"]').innerText(), 335.2273, `${label} heavy D3 exact`);
    approx(await main.locator('[data-testid="out-d3-design"]').innerText(), 350, `${label} heavy D3 design`);
    approx(await main.locator('[data-testid="out-sn-total"]').innerText(), 5.0512, `${label} heavy SN total`);
    approx(await main.locator('[data-testid="out-total-depth"]').innerText(), 750, `${label} heavy total depth`);

    await main.locator('[data-testid="input-a3"]').fill('0');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} a3 <= 0`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-total-depth"]').innerText(), 530, `${label} reset`);

    const [dlCsv] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dlCsv);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('TOTAL,530.00,3.8307'), `${label} CSV missing TOTAL`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 245. pdf-plot-chinese-gibberish-resolver
  {
    const label = '245 pdf-plot-chinese-gibberish-resolver';
    await openToolPage(page, `${BASE_URL}/toolbox/pdf-plot-chinese-gibberish-resolver`, '[data-testid="input-fontalt"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B49_TERMS, label);

    const lispDef = await main.locator('[data-testid="lisp-preview"]').innerText();
    assert(lispDef.includes('(setvar "FONTALT" "gbcbig.shx")'), `${label} missing default FONTALT`);
    assertAscii(lispDef, `${label} default LISP preview`);

    await main.locator('[data-testid="input-fontalt"]').fill('bad"font.shx');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} invalid fontalt`);

    await main.locator('[data-testid="btn-reset"]').click();
    await main.locator('[data-testid="symptom-outline_geometry"]').click();
    const lispOut = await main.locator('[data-testid="lisp-preview"]').innerText();
    assert(lispOut.includes('(setvar "TEXTFILL" 1)') && lispOut.includes('(setvar "PDFSHX" 0)'), `${label} missing outline LISP`);

    const [dlLsp] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-lsp"]').click(),
    ]);
    const lspText = await readDownloadText(dlLsp);
    assertAscii(lspText, `${label} LSP download`);
    assert(lspText.includes('[OK]') && lspText.includes('(setvar "TEXTFILL" 1)'), `${label} LSP download mismatch`);

    const [dlScr] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scrText = await readDownloadText(dlScr);
    assertAscii(scrText, `${label} SCR download`);
    assert(scrText.includes('PDFSHX') && scrText.includes('TEXTFILL'), `${label} SCR download mismatch`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `Failed requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 49 E2E TESTS PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
