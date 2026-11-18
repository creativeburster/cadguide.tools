/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 44 Master E2E Suite (#216-#220):
 * 216. online-cad-license-audit-shield
 * 217. online-dgn-to-dwg-converter
 * 218. online-dwg-compare-diff-viewer
 * 219. online-dwg-layer-splitter-cloud
 * 220. online-dwg-to-dxf-batch-converter
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B44_TERMS = [
  'ISO 16739-1',
  'ISO/ASTM 52900',
  'ISO 19650',
  'AIA CAD Layer Guidelines',
  'Best Online DGN',
  'Best Cloud DWG Revision',
  'Best Online DWG Layer Splitters',
  'Best Online Bulk DWG',
  'Enterprise CAD Software Asset Management (SAM) Self-Check Guide',
  '9.9',
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

  // 216. online-cad-license-audit-shield
  {
    const label = '216 online-cad-license-audit-shield';
    await openToolPage(page, `${BASE_URL}/toolbox/online-cad-license-audit-shield`, '[data-testid="input-owned-seats"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B44_TERMS, label);

    approx(await main.locator('[data-testid="out-peak-with"]').innerText(), 25.5, `${label} default peakWith`);
    approx(await main.locator('[data-testid="out-peak-without"]').innerText(), 30.0, `${label} default peakWithout`);
    approx(await main.locator('[data-testid="out-reclaimed"]').innerText(), 4.5, `${label} default reclaimed`);
    approx(await main.locator('[data-testid="out-utilization"]').innerText(), 102.0, `${label} default util`);

    await main.locator('[data-testid="preset-zero-reclaim-test"]').click();
    approx(await main.locator('[data-testid="out-peak-with"]').innerText(), 10.0, `${label} preset3 peakWith`);
    approx(await main.locator('[data-testid="out-reclaimed"]').innerText(), 0.0, `${label} preset3 reclaimed`);
    approx(await main.locator('[data-testid="out-utilization"]').innerText(), 83.3333, `${label} preset3 util`);

    await main.locator('[data-testid="input-owned-seats"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty ownedSeats`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-peak-with"]').innerText(), 25.5, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('25.500000'), `${label} CSV missing peakWith`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 217. online-dgn-to-dwg-converter
  {
    const label = '217 online-dgn-to-dwg-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dgn-to-dwg-converter`, '[data-testid="select-master-unit"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B44_TERMS, label);

    approx(await main.locator('[data-testid="out-scale"]').innerText(), 1000.0, `${label} default scale`);
    approx(await main.locator('[data-testid="out-scaled-coord"]').innerText(), 12500.0, `${label} default scaled`);
    approx(await main.locator('[data-testid="out-uor"]').innerText(), 100000.0, `${label} default uor`);
    approx(await main.locator('[data-testid="out-resolution"]').innerText(), 0.01, `${label} default res`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('INSUNITS 4'), `${label} default INSUNITS`);

    await main.locator('[data-testid="preset-imperial-ft-to-in"]').click();
    approx(await main.locator('[data-testid="out-scale"]').innerText(), 12.0, `${label} imperial scale`);
    approx(await main.locator('[data-testid="out-scaled-coord"]').innerText(), 1200.0, `${label} imperial scaled`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('INSUNITS 1'), `${label} imperial INSUNITS`);

    await main.locator('[data-testid="input-sub-per-master"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty sub`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-scale"]').innerText(), 1000.0, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('-DGNIMPORT'), `${label} SCR missing -DGNIMPORT`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 218. online-dwg-compare-diff-viewer
  {
    const label = '218 online-dwg-compare-diff-viewer';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dwg-compare-diff-viewer`, '[data-testid="input-rev-a"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B44_TERMS, label);

    approx(await main.locator('[data-testid="out-total-a"]').innerText(), 4, `${label} default totalA`);
    approx(await main.locator('[data-testid="out-total-b"]').innerText(), 6, `${label} default totalB`);
    approx(await main.locator('[data-testid="out-net-delta"]').innerText(), 2, `${label} default delta`);
    assert((await main.locator('[data-testid="out-added-layers"]').innerText()).includes('A-FURN'), `${label} added layer`);

    const revAText = await main.locator('[data-testid="input-rev-a"]').inputValue();
    await main.locator('[data-testid="input-rev-b"]').fill(revAText);
    approx(await main.locator('[data-testid="out-net-delta"]').innerText(), 0, `${label} identical delta`);

    await main.locator('[data-testid="input-rev-a"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty revA`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-net-delta"]').innerText(), 2, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('LWPOLYLINE,0,1,1'), `${label} CSV missing LWPOLYLINE row`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 219. online-dwg-layer-splitter-cloud
  {
    const label = '219 online-dwg-layer-splitter-cloud';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dwg-layer-splitter-cloud`, '[data-testid="input-dxf"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B44_TERMS, label);

    approx(await main.locator('[data-testid="out-total-layers"]').innerText(), 4, `${label} default totalLayers`);
    approx(await main.locator('[data-testid="out-active-layers"]').innerText(), 3, `${label} default activeLayers`);
    approx(await main.locator('[data-testid="out-total-entities"]').innerText(), 6, `${label} default totalEntities`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('SPLIT_A-WALL.dwg'), `${label} default script`);

    await main.locator('[data-testid="input-prefix"]').fill('EXT_');
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('EXT_A-WALL.dwg'), `${label} prefix update`);

    await main.locator('[data-testid="input-dxf"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty dxf`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-total-entities"]').innerText(), 6, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('-WBLOCK "SPLIT_A-WALL.dwg"'), `${label} SCR missing -WBLOCK`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 220. online-dwg-to-dxf-batch-converter
  {
    const label = '220 online-dwg-to-dxf-batch-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dwg-to-dxf-batch-converter`, '[data-testid="select-target-format"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B44_TERMS, label);

    approx(await main.locator('[data-testid="out-listed-count"]').innerText(), 4, `${label} default count`);
    approx(await main.locator('[data-testid="out-total-sec"]').innerText(), 60.0, `${label} default totalSec`);
    approx(await main.locator('[data-testid="out-total-min"]').innerText(), 1.0, `${label} default totalMin`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('SAVEAS DXF 16'), `${label} default SAVEAS`);

    await main.locator('[data-testid="preset-dxf-2004-cnc"]').click();
    approx(await main.locator('[data-testid="out-listed-count"]').innerText(), 2, `${label} preset2 count`);
    approx(await main.locator('[data-testid="out-total-sec"]').innerText(), 100.0, `${label} preset2 sec`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('SAVEAS DXF 6'), `${label} preset2 SAVEAS`);

    await main.locator('[data-testid="input-file-list"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty file list`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-listed-count"]').innerText(), 4, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('SAVEAS DXF 16 "floor_plan_L1.dxf" V 2018 Y'), `${label} SCR missing SAVEAS line`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 44 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
