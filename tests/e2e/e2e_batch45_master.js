/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 45 Master E2E Suite (#221-#225):
 * 221. online-dwg-to-pdf-cloud-printer
 * 222. online-dwg-version-downgrader-cloud
 * 223. online-dxf-svg-nesting-tool
 * 224. online-dxf-text-translator-cloud
 * 225. online-gcode-viewer-simulator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B45_TERMS = [
  'ISO 16739-1',
  'ISO/ASTM 52900',
  'ISO 19650',
  'AIA CAD Layer Guidelines',
  'Best Online DWG to Vector PDF',
  'Best Online DWG Version Converter',
  'Best Online DXF/DWG Multi-Language',
  'Online DWG to Vector PDF Batch Cloud Printer',
  'Online DWG Format Version Downgrader',
  'Online DXF/DWG Drawing Multi-Language Batch Translator',
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

  // 221. online-dwg-to-pdf-cloud-printer
  {
    const label = '221 online-dwg-to-pdf-cloud-printer';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dwg-to-pdf-cloud-printer`, '[data-testid="input-width-mm"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B45_TERMS, label);

    approx(await main.locator('[data-testid="out-px-w"]').innerText(), 9933.0709, `${label} default pxW`);
    approx(await main.locator('[data-testid="out-raster-mb"]').innerText(), 199.3834, `${label} default MB`);
    approx(await main.locator('[data-testid="out-model-w"]').innerText(), 84.1, `${label} default modelW`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('PDFSHX 2'), `${label} PDFSHX`);

    await main.locator('[data-testid="preset-arch-d-exact"]').click();
    approx(await main.locator('[data-testid="out-px-w"]').innerText(), 2000.0, `${label} exact pxW`);
    approx(await main.locator('[data-testid="out-px-h"]').innerText(), 1000.0, `${label} exact pxH`);
    approx(await main.locator('[data-testid="out-raster-mb"]').innerText(), 5.7220, `${label} exact MB`);
    approx(await main.locator('[data-testid="out-model-w"]').innerText(), 25.4, `${label} exact modelW`);

    await main.locator('[data-testid="input-dpi"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty dpi`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-px-w"]').innerText(), 9933.0709, `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('DWG To PDF.pc3'), `${label} SCR missing PC3`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 222. online-dwg-version-downgrader-cloud
  {
    const label = '222 online-dwg-version-downgrader-cloud';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dwg-version-downgrader-cloud`, '[data-testid="select-source-magic"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B45_TERMS, label);

    assert.strictEqual((await main.locator('[data-testid="out-src-magic"]').innerText()).trim(), 'AC1032');
    assert.strictEqual((await main.locator('[data-testid="out-dst-magic"]').innerText()).trim(), 'AC1027');
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('-EXPORTTOAUTOCAD F 2013'), `${label} default script`);

    await main.locator('[data-testid="select-target-magic"]').selectOption('AC1015');
    assert((await main.locator('[data-testid="out-step-delta"]').innerText()).includes('-5 format generations'), `${label} 5 gen step`);
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('-EXPORTTOAUTOCAD F 2000'), `${label} 2000 target`);

    await main.locator('[data-testid="input-filename"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty filename`);

    await main.locator('[data-testid="btn-reset"]').click();
    assert((await main.locator('[data-testid="out-script"]').innerText()).includes('-EXPORTTOAUTOCAD F 2013'), `${label} reset`);
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-scr"]').click(),
    ]);
    const scr = await readDownloadText(dl);
    assertAscii(scr, `${label} SCR`);
    assert(scr.includes('civil_site_plan_2013.dwg'), `${label} SCR missing target dwg`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 223. online-dxf-svg-nesting-tool
  {
    const label = '223 online-dxf-svg-nesting-tool';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dxf-svg-nesting-tool`, '[data-testid="input-sheet-w"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B45_TERMS, label);

    await main.locator('[data-testid="preset-handcheck"]').click();
    approx(await main.locator('[data-testid="out-placed"]').innerText(), 4, `${label} handcheck placed`);
    approx(await main.locator('[data-testid="out-unplaced"]').innerText(), 0, `${label} handcheck unplaced`);
    approx(await main.locator('[data-testid="out-utilization"]').innerText(), 40.0, `${label} handcheck util`);
    approx(await main.locator('[data-testid="out-used-m2"]').innerText(), 0.2, `${label} handcheck m2`);

    await main.locator('[data-testid="input-sheet-w"]').fill('500');
    approx(await main.locator('[data-testid="out-utilization"]').innerText(), 80.0, `${label} 500x500 util`);

    await main.locator('[data-testid="input-sheet-w"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty sheetW`);

    await main.locator('[data-testid="btn-reset"]').click();
    const [dlDxf] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-dxf"]').click(),
    ]);
    const dxf = await readDownloadText(dlDxf);
    assertAscii(dxf, `${label} DXF`);
    assert(dxf.includes('NESTED_PARTS'), `${label} DXF missing NESTED_PARTS`);

    const [dlSvg] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-svg"]').click(),
    ]);
    const svg = await readDownloadText(dlSvg);
    assertAscii(svg, `${label} SVG`);
    assert(svg.includes('<svg'), `${label} SVG missing <svg`);

    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 224. online-dxf-text-translator-cloud
  {
    const label = '224 online-dxf-text-translator-cloud';
    await openToolPage(page, `${BASE_URL}/toolbox/online-dxf-text-translator-cloud`, '[data-testid="input-dxf"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B45_TERMS, label);

    approx(await main.locator('[data-testid="out-text-count"]').innerText(), 3, `${label} default textCount`);
    approx(await main.locator('[data-testid="out-modified-count"]').innerText(), 3, `${label} default modCount`);
    approx(await main.locator('[data-testid="out-hit-count"]').innerText(), 6, `${label} default hitCount`);
    assert.strictEqual((await main.locator('[data-testid="row-translated-0"]').innerText()).trim(), 'MATERIAL: STEEL');

    const prevGlossary = await main.locator('[data-testid="input-glossary"]').inputValue();
    await main.locator('[data-testid="input-glossary"]').fill(prevGlossary + '\nUND=AND');
    approx(await main.locator('[data-testid="out-hit-count"]').innerText(), 7, `${label} added rule hitCount`);
    assert.strictEqual((await main.locator('[data-testid="row-translated-2"]').innerText()).trim(), 'SHAFT AND SEAL INSPECT');

    await main.locator('[data-testid="input-dxf"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty dxf`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="out-hit-count"]').innerText(), 6, `${label} reset`);
    const [dlDxf] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-dxf"]').click(),
    ]);
    const dxf = await readDownloadText(dlDxf);
    assertAscii(dxf, `${label} DXF`);
    assert(dxf.includes('MATERIAL: STEEL'), `${label} DXF missing translation`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 225. online-gcode-viewer-simulator
  {
    const label = '225 online-gcode-viewer-simulator';
    await openToolPage(page, `${BASE_URL}/toolbox/online-gcode-viewer-simulator`, '[data-testid="input-gcode"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B45_TERMS, label);

    const defSegs = parseNumeric(await main.locator('[data-testid="out-segments"]').innerText());
    assert(defSegs > 10, `${label} default segments > 10, got ${defSegs}`);

    await main.locator('[data-testid="preset-square"]').click();
    approx(await main.locator('[data-testid="out-segments"]').innerText(), 5, `${label} square segments`);
    approx(await main.locator('[data-testid="out-cut-len"]').innerText(), 300.0, `${label} square cutLen`);
    approx(await main.locator('[data-testid="out-rapid-len"]').innerText(), 5.0, `${label} square rapidLen`);
    approx(await main.locator('[data-testid="out-cut-time"]').innerText(), 0.5, `${label} square cutTime`);

    await main.locator('[data-testid="input-gcode"]').fill('');
    await main.locator('[data-testid="validation-error"]').waitFor({ state: 'visible' });
    await assertNoNan(main, `${label} empty gcode`);

    await main.locator('[data-testid="btn-reset"]').click();
    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      main.locator('[data-testid="btn-download-csv"]').click(),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} CSV`);
    assert(csv.includes('Motion Segments'), `${label} CSV missing Motion Segments`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  await browser.close();
  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join('; ')}`);
  console.log('ALL BATCH 45 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
