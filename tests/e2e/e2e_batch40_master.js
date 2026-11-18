// Batch 40 E2E Master Script: Tools 196-200 (skipped mastercam-shortcuts-sheet)
// 196. manifold-pressure-calculator
// 197. manometer-pressure-calculator
// 198. mass-unit-converter
// 199. material-density-calculator
// 200. material-properties-reference

const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function approx(actualStr, expected, label) {
  const cleaned = String(actualStr).replace(/,/g, '').trim();
  const actual = Number(cleaned);
  assert(!Number.isNaN(actual) && Number.isFinite(actual), `${label}: expected finite number, got "${actualStr}"`);
  const tol = Math.max(1e-6, Math.abs(expected) * 0.001);
  assert(
    Math.abs(actual - expected) <= tol,
    `${label}: expected ${expected} (+/-${tol}), got ${actual}`
  );
}

function assertAscii(text, label) {
  assert(/^[\x00-\x7F]*$/.test(text), `${label}: non-ASCII detected`);
}

async function readDownloadText(download) {
  const p = await download.path();
  return fs.readFileSync(p, 'utf8');
}

async function openToolPage(page, url, readySelector) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector(readySelector);
  await page.waitForFunction((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    return Object.keys(el).some((k) => k.startsWith('__reactProps$') || k.startsWith('__reactFiber$'));
  }, readySelector);
}

async function verifyNegativeTerms(page, forbiddenTerms, label) {
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
  for (const term of forbiddenTerms) {
    assert(!scopedText.includes(term), `${label}: found forbidden term "${term}"`);
  }
}

async function assertNoNan(mainLoc, label) {
  const txt = await mainLoc.innerText();
  assert(!/\bNaN\b|\bInfinity\b|\bundefined\b/.test(txt), `${label}: found NaN/Infinity/undefined`);
}

async function assertZeroNumberInputs(mainLoc, label) {
  const count = await mainLoc.locator('input[type="number"]').count();
  assert.strictEqual(count, 0, `${label}: expected 0 input[type="number"], found ${count}`);
}

async function assertClipboardRejectSafe(page, mainLoc, label) {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error('Clipboard blocked')),
      },
    });
  });
  await mainLoc.locator('[data-testid="btn-copy"]').click();
  await page.waitForTimeout(50);
  const copyTxt = await mainLoc.locator('[data-testid="btn-copy"]').innerText();
  assert(!/Copied/i.test(copyTxt), `${label}: btn-copy must not show Copied on rejection`);
}

const BANNED_B40_TERMS = [
  'ISO 80000',
  'BIPM',
  '40+ engineering materials',
  'Inconel 718',
  'Monel 400',
  '~$1/kg',
];

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

  // 196. manifold-pressure-calculator
  {
    const label = '196 manifold-pressure-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/manifold-pressure-calculator`, '[data-testid="input-dia"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B40_TERMS, label);

    approx(await main.locator('[data-testid="result-dp-kpa"]').innerText(), 2.591223, `${label} def kpa`);
    approx(await main.locator('[data-testid="result-dp-pa"]').innerText(), 2591.2233, `${label} def pa`);
    approx(await main.locator('[data-testid="result-vel"]').innerText(), 1.527887, `${label} def vel`);
    approx(await main.locator('[data-testid="result-dyn"]').innerText(), 1.164886, `${label} def dyn`);

    await main.locator('[data-testid="preset-cooling-12out"]').click();
    approx(await main.locator('[data-testid="result-dp-kpa"]').innerText(), 2.852737, `${label} cool kpa`);
    approx(await main.locator('[data-testid="result-vel"]').innerText(), 1.591549, `${label} cool vel`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('total_pressure_drop_kpa,2.85274,kPa'), `${label} csv kpa`);

    await main.locator('[data-testid="input-outlets"]').fill('2.5');
    assert.strictEqual((await main.locator('[data-testid="result-dp-kpa"]').innerText()).trim(), '—', `${label} float outlets`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-dp-kpa"]').innerText(), 2.591223, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 197. manometer-pressure-calculator
  {
    const label = '197 manometer-pressure-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/manometer-pressure-calculator`, '[data-testid="input-rho"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B40_TERMS, label);

    approx(await main.locator('[data-testid="result-pa"]').innerText(), 2446.7592, `${label} def pa`);
    approx(await main.locator('[data-testid="result-kpa"]').innerText(), 2.446759, `${label} def kpa`);
    approx(await main.locator('[data-testid="result-mbar"]').innerText(), 24.467592, `${label} def mbar`);
    approx(await main.locator('[data-testid="result-mmh2o"]').innerText(), 249.5, `${label} def mmh2o`);

    await main.locator('[data-testid="preset-inclined-30deg"]').click();
    approx(await main.locator('[data-testid="result-pa"]').innerText(), 1608.2906, `${label} inc30 pa`);
    approx(await main.locator('[data-testid="result-kpa"]').innerText(), 1.608291, `${label} inc30 kpa`);
    approx(await main.locator('[data-testid="result-mmh2o"]').innerText(), 164.0, `${label} inc30 mmh2o`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('pressure_kpa,1.60829,kPa'), `${label} csv kpa`);

    await main.locator('[data-testid="input-angle"]').fill('100');
    assert.strictEqual((await main.locator('[data-testid="result-pa"]').innerText()).trim(), '—', `${label} angle > 90`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-pa"]').innerText(), 2446.7592, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 198. mass-unit-converter
  {
    const label = '198 mass-unit-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/mass-unit-converter`, '[data-testid="input-value"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B40_TERMS, label);

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 220.462262, `${label} 100kg->lb`);

    await main.locator('[data-testid="preset-1t-short"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 1.102311, `${label} 1t->short_ton`);

    await main.locator('[data-testid="btn-swap"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 0.907185, `${label} 1short_ton->t`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('short_ton,US Short Tons (2000 lb),'), `${label} csv short_ton`);

    await main.locator('[data-testid="input-value"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', `${label} invalid dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 220.462262, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 199. material-density-calculator
  {
    const label = '199 material-density-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/material-density-calculator`, '[data-testid="input-rho"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B40_TERMS, label);

    approx(await main.locator('[data-testid="result-vol-cm3"]').innerText(), 1500.0, `${label} def vol`);
    approx(await main.locator('[data-testid="result-mass-kg"]').innerText(), 11.775, `${label} def kg`);
    approx(await main.locator('[data-testid="result-mass-lb"]').innerText(), 25.95943, `${label} def lb`);

    await main.locator('[data-testid="preset-ti-tube"]').click();
    approx(await main.locator('[data-testid="result-vol-cm3"]').innerText(), 353.4292, `${label} ti tube vol`);
    approx(await main.locator('[data-testid="result-mass-kg"]').innerText(), 1.56534, `${label} ti tube kg`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('total_mass_kg,1.56534,kg'), `${label} csv ti kg`);

    await main.locator('[data-testid="input-d2"]').fill('60'); // ID > OD invalid for hollow tube
    assert.strictEqual((await main.locator('[data-testid="result-mass-kg"]').innerText()).trim(), '—', `${label} ID>=OD dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-mass-kg"]').innerText(), 11.775, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 200. material-properties-reference
  {
    const label = '200 material-properties-reference';
    await openToolPage(page, `${BASE_URL}/toolbox/material-properties-reference`, '[data-testid="input-search"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B40_TERMS, label);

    approx(await main.locator('[data-testid="result-count"]').innerText(), 14, `${label} total 14 grades`);

    await main.locator('[data-testid="preset-6061"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 1, `${label} 6061 count`);
    assert.strictEqual((await main.locator('[data-testid="result-top-grade"]').innerText()).trim(), 'Aluminum 6061', `${label} 6061 grade`);
    approx(await main.locator('[data-testid="result-top-density"]').innerText(), 2.7, `${label} 6061 rho`);
    approx(await main.locator('[data-testid="result-top-modulus"]').innerText(), 68, `${label} 6061 E`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-count"]').innerText(), 14, `${label} reset`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('ASTM A36 Structural Steel,steel,7.8,250,400-550,200,0.26,11.7'), `${label} csv A36`);
    assert(csv.includes('Titanium Ti-6Al-4V,titanium,4.429,880,900-950,104-113,0.31-0.37,8.6'), `${label} csv Ti64`);

    await assertNoNan(main, label);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 40 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
