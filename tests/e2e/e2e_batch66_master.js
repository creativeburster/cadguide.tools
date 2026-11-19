/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 66 Master E2E Suite:
 * 1. steel-beam-load-calculator
 * 2. steel-grade-selector
 * 3. steel-section-properties-reference
 * 4. steel-section-weight-calculator
 * 5. steel-weight-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B66_SHARED = [
  'AISC 360',
  'Eurocode 3',
  'UPE',
  'PFC',
  'Wy_',
  'SS304',
  '6061-T6',
  '5052-H32',
  'C36000',
  'C11000',
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

async function getScopedText(page) {
  return page.evaluate(() => {
    const mains = document.querySelectorAll('main');
    const mainEl = mains[mains.length - 1];
    if (!mainEl) return '';
    const clone = mainEl.cloneNode(true);
    clone
      .querySelectorAll('a[href^="/toolbox/"], a[href^="/compare/"], a[href^="/convert/"]')
      .forEach((el) => el.remove());
    return clone.textContent || '';
  });
}

async function verifyNoBannedAndNoNumberInput(page, terms, label) {
  const typeCount = await page.locator('input[type="number"], input[type="range"]').count();
  assert.strictEqual(typeCount, 0, `${label}: found input[type="number"] or input[type="range"]`);
  const scopedText = await getScopedText(page);
  for (const term of terms) {
    assert(!scopedText.includes(term), `${label}: banned term found -> "${term}"`);
  }
  return scopedText;
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
  page.on('pageerror', (err) => {
    pageErrors.push(String(err));
  });

  // 1. steel-beam-load-calculator
  {
    const label = 'steel-beam-load-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-zx"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B66_SHARED, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-my"]').innerText(), 50.0, `${label} def My`);
    approx(await page.locator('[data-testid="output-ma"]').innerText(), 29.94012, `${label} def Ma`);
    approx(await page.locator('[data-testid="output-w-udl"]').innerText(), 9.580838, `${label} def w`);
    approx(await page.locator('[data-testid="output-p-point"]').innerText(), 23.952096, `${label} def P`);
    approx(await page.locator('[data-testid="output-governing"]').innerText(), 9.580838, `${label} def gov`);

    await page.fill('[data-testid="input-zx"]', '350');
    await page.fill('[data-testid="input-fy"]', '355');
    await page.fill('[data-testid="input-span"]', '6');
    await page.fill('[data-testid="input-omega"]', '1.50');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-my"]').innerText(), 124.25, `${label} mod My`);
    approx(await page.locator('[data-testid="output-ma"]').innerText(), 82.833333, `${label} mod Ma`);
    approx(await page.locator('[data-testid="output-w-udl"]').innerText(), 18.407407, `${label} mod w`);
    approx(await page.locator('[data-testid="output-p-point"]').innerText(), 55.222222, `${label} mod P`);

    await page.click('[data-testid="load-point"]');
    approx(await page.locator('[data-testid="output-governing"]').innerText(), 55.222222, `${label} mod point gov`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('18.407407') && csv.includes('55.222222'), `${label} csv values missing`);

    await page.fill('[data-testid="input-zx"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-w-udl"]').innerText(), 9.580838, `${label} reset w`);
    console.log(`[PASS] ${label}`);
  }

  // 2. steel-grade-selector
  {
    const label = 'steel-grade-selector';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-fy"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B66_SHARED, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-fy-eff"]').innerText(), 250.0, `${label} def fyEff`);
    approx(await page.locator('[data-testid="output-sigma-allow"]').innerText(), 166.666667, `${label} def sigma`);
    approx(await page.locator('[data-testid="output-tau-allow"]').innerText(), 96.225045, `${label} def tau`);

    await page.click('[data-testid="preset-en-s355"]');
    await page.fill('[data-testid="input-kt"]', '0.95');
    await page.fill('[data-testid="input-sf"]', '1.67');
    await page.fill('[data-testid="input-req-stress"]', '180');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-fy-eff"]').innerText(), 337.25, `${label} mod fyEff`);
    approx(await page.locator('[data-testid="output-sigma-allow"]').innerText(), 201.946108, `${label} mod sigma`);
    approx(await page.locator('[data-testid="output-tau-allow"]').innerText(), 116.59364, `${label} mod tau`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('337.250000') && csv.includes('201.946108'), `${label} csv values missing`);

    await page.fill('[data-testid="input-fy"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-fy-eff"]').innerText(), 250.0, `${label} reset fyEff`);
    console.log(`[PASS] ${label}`);
  }

  // 3. steel-section-properties-reference
  {
    const label = 'steel-section-properties-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-search"]');
    const scopedText = await verifyNoBannedAndNoNumberInput(page, [...BANNED_B66_SHARED, 'EN 10025'], label);
    assert(!/\b(IPE|UB|UC)\b/.test(scopedText), `${label}: found disallowed legacy family IPE/UB/UC`);

    approx(await page.locator('[data-testid="output-count"]').innerText(), 42, `${label} def count`);
    await page.click('[data-testid="series-din-i"]');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 16, `${label} din-i count`);
    await page.click('[data-testid="series-he-a"]');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 13, `${label} he-a count`);
    await page.click('[data-testid="series-he-b"]');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 13, `${label} he-b count`);
    await page.click('[data-testid="series-all"]');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 42, `${label} all count`);

    await page.fill('[data-testid="input-search"]', '300B');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 1, `${label} search count`);
    const rowText = await page.locator('[data-testid="row-300B"]').innerText();
    assert(rowText.includes('25170') && rowText.includes('1680'), `${label} 300B values mismatch`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('300B,DIN 1025 HE-B,300,300,11,149,117,25170,8560,1680,571'), `${label} csv row mismatch`);

    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-count"]').innerText(), 42, `${label} reset count`);
    console.log(`[PASS] ${label}`);
  }

  // 4. steel-section-weight-calculator
  {
    const label = 'steel-section-weight-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-h"]');
    await verifyNoBannedAndNoNumberInput(page, [...BANNED_B66_SHARED, 'A36', 'S235'], label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-area"]').innerText(), 2743.1, `${label} def area`);
    approx(await page.locator('[data-testid="output-weight-per-meter"]').innerText(), 21.533335, `${label} def wpm`);
    approx(await page.locator('[data-testid="output-total-weight"]').innerText(), 129.20001, `${label} def totalW`);
    approx(await page.locator('[data-testid="output-surface-per-m"]').innerText(), 0.7886, `${label} def surPerM`);
    approx(await page.locator('[data-testid="output-total-surface"]').innerText(), 4.737086, `${label} def totalSur`);
    approx(await page.locator('[data-testid="output-estimated-cost"]').innerText(), 161.500013, `${label} def cost`);

    await page.click('[data-testid="profile-channel"]');
    await page.fill('[data-testid="input-ch"]', '200');
    await page.fill('[data-testid="input-cb"]', '75');
    await page.fill('[data-testid="input-ctw"]', '5');
    await page.fill('[data-testid="input-ctf"]', '9');
    await page.fill('[data-testid="input-length"]', '6');
    await page.fill('[data-testid="input-qty"]', '2');
    await page.fill('[data-testid="input-price"]', '1.50');

    await assertNoNan(main, `${label} mod channel`);
    approx(await page.locator('[data-testid="output-area"]').innerText(), 2260, `${label} mod area`);
    approx(await page.locator('[data-testid="output-weight-per-meter"]').innerText(), 17.741, `${label} mod wpm`);
    approx(await page.locator('[data-testid="output-total-weight"]').innerText(), 212.892, `${label} mod totalW`);
    approx(await page.locator('[data-testid="output-surface-per-m"]').innerText(), 0.69, `${label} mod surPerM`);
    approx(await page.locator('[data-testid="output-total-surface"]').innerText(), 8.28904, `${label} mod totalSur`);
    approx(await page.locator('[data-testid="output-estimated-cost"]').innerText(), 319.338, `${label} mod cost`);

    await page.click('[data-testid="add-to-bom-btn"]');
    approx(await page.locator('[data-testid="bom-total-weight"]').innerText(), 212.89, `${label} bom totalW`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    const csvLines = csv.split(/\r?\n/);
    const bomHeader = csvLines.find((l) => l.startsWith('Tag,Material,'));
    const totalLine = csvLines.find((l) => l.startsWith('TOTAL,'));
    assert(bomHeader && totalLine, `${label} csv BOM header or TOTAL missing`);
    assert.strictEqual(
      totalLine.split(',').length,
      bomHeader.split(',').length,
      `${label} csv TOTAL column count mismatch (${totalLine.split(',').length} vs ${bomHeader.split(',').length})`
    );
    assert(csv.includes('212.892'), `${label} csv channel weight missing`);

    await page.fill('[data-testid="input-ch"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-weight-per-meter"]').innerText(), 21.533335, `${label} reset wpm`);
    console.log(`[PASS] ${label}`);
  }

  // 5. steel-weight-calculator
  {
    const label = 'steel-weight-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-h"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B66_SHARED, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-area"]').innerText(), 34.4, `${label} def area`);
    approx(await page.locator('[data-testid="output-uw"]').innerText(), 27.004, `${label} def uw`);
    approx(await page.locator('[data-testid="output-total-w"]').innerText(), 162.024, `${label} def totalW`);

    await page.click('[data-testid="shape-tube"]');
    await page.fill('[data-testid="input-h"]', '100');
    await page.fill('[data-testid="input-b"]', '60');
    await page.fill('[data-testid="input-t1"]', '4');
    await page.fill('[data-testid="input-t2"]', '0');
    await page.fill('[data-testid="input-length"]', '5');

    await assertNoNan(main, `${label} mod tube`);
    approx(await page.locator('[data-testid="output-area"]').innerText(), 12.16, `${label} mod area`);
    approx(await page.locator('[data-testid="output-uw"]').innerText(), 9.5456, `${label} mod uw`);
    approx(await page.locator('[data-testid="output-total-w"]').innerText(), 47.728, `${label} mod totalW`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('9.545600') && csv.includes('47.728000'), `${label} csv values missing`);

    await page.fill('[data-testid="input-h"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-total-w"]').innerText(), 162.024, `${label} reset totalW`);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);

  await browser.close();
  console.log('ALL_BATCH66_PASSED');
})();
