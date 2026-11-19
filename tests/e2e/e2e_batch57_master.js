/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 57 Master E2E Suite:
 * 1. retaining-wall-calculator
 * 2. retaining-wall-sliding-calculator
 * 3. revit-family-param-calculator
 * 4. revit-performance-diagnostic-wizard
 * 5. revit-room-area-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B57_TERMS = [
  'Eurocode 7',
  'EN 1997',
  'FHWA Geotechnical',
  'ASTM D1557',
  'AASHTO Green Book',
  'ISO 10303-21',
  'ISO 16739-1',
  'ISO/ASTM 52900',
  'AIA CAD Layer',
  'ISO 19650',
  '5-10x slower',
  '2 GB',
  '100+ MB',
  '5-10 worksets',
  'GUID-A80AFF8B',
  'Manage DWF Markup',
  'embeds all layers and patterns',
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

async function verifyNoBannedAndNoNumberInput(page, terms, label) {
  const typeCount = await page.locator('input[type="number"], input[type="range"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"] or input[type="range"]`);
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
    assert(!scopedText.includes(term), `${label}: banned term found -> "${term}"`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  try {
    // 1. retaining-wall-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/retaining-wall-calculator`, '[data-testid="input-gamma"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, 'retaining-wall-calculator');
    approx(await page.locator('[data-testid="res-pa"]').innerText(), 61.3333, 'rw default pa');
    approx(await page.locator('[data-testid="res-pp"]').innerText(), 432.0, 'rw default pp');
    approx(await page.locator('[data-testid="res-mo"]').innerText(), 90.6667, 'rw default mo');
    approx(await page.locator('[data-testid="res-ka"]').innerText(), 0.3333, 'rw default ka');
    approx(await page.locator('[data-testid="res-kp"]').innerText(), 3.0, 'rw default kp');

    await page.locator('[data-testid="input-gamma"]').fill('20');
    await page.locator('[data-testid="input-height"]').fill('5');
    await page.locator('[data-testid="input-phi"]').fill('35');
    await page.locator('[data-testid="input-q"]').fill('0');
    approx(await page.locator('[data-testid="res-pa"]').innerText(), 67.7475, 'rw mod pa');
    approx(await page.locator('[data-testid="res-pp"]').innerText(), 922.543, 'rw mod pp');
    approx(await page.locator('[data-testid="res-mo"]').innerText(), 112.9125, 'rw mod mo');
    approx(await page.locator('[data-testid="res-ka"]').innerText(), 0.271, 'rw mod ka');

    await page.locator('[data-testid="input-gamma"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'rw empty');
    await page.locator('[data-testid="input-gamma"]').fill('20');
    const [dl1] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv1 = await readDownloadText(dl1);
    assertAscii(csv1, 'rw CSV');
    assert(csv1.includes('67.7475'), 'rw CSV pa check');
    console.log('[PASS] retaining-wall-calculator');

    // 2. retaining-wall-sliding-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/retaining-wall-sliding-calculator`, '[data-testid="input-height"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, 'retaining-wall-sliding-calculator');
    approx(await page.locator('[data-testid="res-fs-slide"]').innerText(), 1.9516, 'slide default fs');
    approx(await page.locator('[data-testid="res-pa"]').innerText(), 57.55, 'slide default pa');
    approx(await page.locator('[data-testid="res-rs"]').innerText(), 112.32, 'slide default rs');
    approx(await page.locator('[data-testid="res-fs-ot"]').innerText(), 3.9254, 'slide default ot');

    await page.locator('[data-testid="input-height"]').fill('5.5');
    await page.locator('[data-testid="input-base"]').fill('3.5');
    await page.locator('[data-testid="input-tstem"]').fill('0.5');
    await page.locator('[data-testid="input-tbase"]').fill('0.6');
    await page.locator('[data-testid="input-gamma-s"]').fill('19');
    await page.locator('[data-testid="input-phi"]').fill('35');
    await page.locator('[data-testid="input-mu"]').fill('0.5');
    await page.locator('[data-testid="input-cb"]').fill('10');
    approx(await page.locator('[data-testid="res-fs-slide"]').innerText(), 2.9438, 'slide mod fs');
    approx(await page.locator('[data-testid="res-pa"]').innerText(), 77.88, 'slide mod pa');
    approx(await page.locator('[data-testid="res-rs"]').innerText(), 229.25, 'slide mod rs');
    approx(await page.locator('[data-testid="res-fs-ot"]').innerText(), 4.6333, 'slide mod ot');

    await page.locator('[data-testid="input-height"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'slide empty');
    await page.locator('[data-testid="input-height"]').fill('5.5');
    const [dl2] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv2 = await readDownloadText(dl2);
    assertAscii(csv2, 'slide CSV');
    assert(csv2.includes('2.9438'), 'slide CSV fs check');
    console.log('[PASS] retaining-wall-sliding-calculator');

    // 3. revit-family-param-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/revit-family-param-calculator`, '[data-testid="input-width"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, 'revit-family-param-calculator');
    approx(await page.locator('[data-testid="res-rw"]').innerText(), 1000.0, 'revit-fam default rw');
    approx(await page.locator('[data-testid="res-rh"]').innerText(), 2150.0, 'revit-fam default rh');
    approx(await page.locator('[data-testid="res-vol"]').innerText(), 0.86, 'revit-fam default vol');
    approx(await page.locator('[data-testid="res-array-count"]').innerText(), 7, 'revit-fam default count');
    approx(await page.locator('[data-testid="res-array-spacing"]').innerText(), 600.0, 'revit-fam default spacing');

    await page.locator('[data-testid="input-width"]').fill('1200');
    await page.locator('[data-testid="input-span"]').fill('5000');
    await page.locator('[data-testid="input-max-spacing"]').fill('800');
    approx(await page.locator('[data-testid="res-rw"]').innerText(), 1300.0, 'revit-fam mod rw');
    approx(await page.locator('[data-testid="res-array-count"]').innerText(), 8, 'revit-fam mod count');
    approx(await page.locator('[data-testid="res-array-spacing"]').innerText(), 714.29, 'revit-fam mod spacing');
    await page.getByRole('button', { name: 'Copy' }).click();

    await page.locator('[data-testid="input-width"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'revit-fam empty');
    await page.locator('[data-testid="input-width"]').fill('1200');
    const [dl3] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv3 = await readDownloadText(dl3);
    assertAscii(csv3, 'revit-fam CSV');
    assert(csv3.includes('714.29'), 'revit-fam CSV spacing check');
    console.log('[PASS] revit-family-param-calculator');

    // 4. revit-performance-diagnostic-wizard
    await openToolPage(page, `${BASE_URL}/toolbox/revit-performance-diagnostic-wizard`, '[data-testid="issue-btn-families"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, 'revit-performance-diagnostic-wizard');
    const issueIds = ['families', 'links', 'views', 'worksharing', 'dwg-imports'];
    for (const id of issueIds) {
      await page.locator(`[data-testid="issue-btn-${id}"]`).click();
      await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, `revit-performance-${id}`);
      const href = await page.locator('[data-testid="official-help-link"]').getAttribute('href');
      assert(href && href.startsWith('https://help.autodesk.com/cloudhelp/'), `revit-perf ${id} invalid href: ${href}`);
      if (id === 'views') {
        assert.strictEqual(
          href,
          'https://help.autodesk.com/cloudhelp/2024/ENU/Revit-Customize/files/GUID-A9C36610-6853-433D-AFB5-639090BD017F.htm',
          'revit-perf views must link to Revit View Templates Help'
        );
      }
    }
    const [dl4] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export Checklist' }).click(),
    ]);
    const txt4 = await readDownloadText(dl4);
    assertAscii(txt4, 'revit-perf checklist');
    assert(txt4.includes('https://help.autodesk.com/cloudhelp/'), 'revit-perf checklist link');
    console.log('[PASS] revit-performance-diagnostic-wizard');

    // 5. revit-room-area-calculator
    await openToolPage(page, `${BASE_URL}/toolbox/revit-room-area-calculator`, '[data-testid="input-len"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B57_TERMS, 'revit-room-area-calculator');
    approx(await page.locator('[data-testid="res-net-area"]').innerText(), 20.0, 'revit-room default net');
    approx(await page.locator('[data-testid="res-center-area"]').innerText(), 21.84, 'revit-room default center');
    approx(await page.locator('[data-testid="res-wall-area"]').innerText(), 50.0, 'revit-room default wall');
    approx(await page.locator('[data-testid="res-vol"]').innerText(), 60.0, 'revit-room default vol');
    approx(await page.locator('[data-testid="res-perim"]').innerText(), 18.0, 'revit-room default perim');

    await page.locator('[data-testid="input-len"]').fill('8');
    await page.locator('[data-testid="input-wid"]').fill('6');
    await page.locator('[data-testid="input-height"]').fill('3.5');
    await page.locator('[data-testid="input-open"]').fill('8');
    await page.locator('[data-testid="input-half-thick"]').fill('0.15');
    approx(await page.locator('[data-testid="res-net-area"]').innerText(), 48.0, 'revit-room mod net');
    approx(await page.locator('[data-testid="res-center-area"]').innerText(), 52.29, 'revit-room mod center');
    approx(await page.locator('[data-testid="res-wall-area"]').innerText(), 90.0, 'revit-room mod wall');
    approx(await page.locator('[data-testid="res-vol"]').innerText(), 168.0, 'revit-room mod vol');
    approx(await page.locator('[data-testid="res-perim"]').innerText(), 28.0, 'revit-room mod perim');

    await page.locator('[data-testid="input-len"]').fill('');
    await page.waitForSelector('[data-testid="validation-error"]', { timeout: 5000 });
    await assertNoNan(page.locator('main').last(), 'revit-room empty');
    await page.locator('[data-testid="input-len"]').fill('8');
    const [dl5] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export CSV' }).click(),
    ]);
    const csv5 = await readDownloadText(dl5);
    assertAscii(csv5, 'revit-room CSV');
    assert(csv5.includes('52.2900'), 'revit-room CSV center check');
    console.log('[PASS] revit-room-area-calculator');

    assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
    assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);
    console.log('BATCH 57 E2E ALL PASSED (5/5)');
  } finally {
    await browser.close();
  }
})();
