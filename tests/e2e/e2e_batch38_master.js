/* eslint-disable @typescript-eslint/no-require-imports */
// Batch 38 E2E Master Script: Tools 186-190 (skipped kicad-shortcuts-sheet)
// 186. land-survey-area-calculator
// 187. laser-cutting-calculator
// 188. led-resistor-calculator
// 189. length-unit-converter
// 190. lever-mechanical-advantage-calculator

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

const BANNED_B38_TERMS = ['ISO 80000', 'BIPM', 'ASHRAE', 'SMACNA'];

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

  // 186. land-survey-area-calculator
  {
    const label = '186 land-survey-area-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/land-survey-area-calculator`, '[data-testid="pt-x-0"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B38_TERMS, label);

    approx(await main.locator('[data-testid="result-area-sqm"]').innerText(), 5000, `${label} def sqm`);
    approx(await main.locator('[data-testid="result-area-ha"]').innerText(), 0.5, `${label} def ha`);
    approx(await main.locator('[data-testid="result-area-sqft"]').innerText(), 53819.552084, `${label} def sqft`);
    approx(await main.locator('[data-testid="result-area-acres"]').innerText(), 1.235527, `${label} def acres`);
    approx(await main.locator('[data-testid="result-perimeter"]').innerText(), 300, `${label} def perim`);

    await main.locator('[data-testid="preset-trapezoid"]').click();
    approx(await main.locator('[data-testid="result-area-sqm"]').innerText(), 5850, `${label} trap sqm`);
    approx(await main.locator('[data-testid="result-area-ha"]').innerText(), 0.585, `${label} trap ha`);
    approx(await main.locator('[data-testid="result-perimeter"]').innerText(), 323.245553, `${label} trap perim`);

    await main.locator('[data-testid="btn-add-point"]').click();
    assert(await main.locator('[data-testid="pt-x-4"]').isVisible(), `${label} add pt 4`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('result,area_sq_m,'), `${label} csv area`);

    await main.locator('[data-testid="pt-x-0"]').fill('abc');
    assert.strictEqual((await main.locator('[data-testid="result-area-sqm"]').innerText()).trim(), '—', `${label} invalid coord`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-area-sqm"]').innerText(), 5000, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 187. laser-cutting-calculator
  {
    const label = '187 laser-cutting-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/laser-cutting-calculator`, '[data-testid="input-power"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B38_TERMS, label);

    approx(await main.locator('[data-testid="result-speed-mms"]').innerText(), 58.333333, `${label} def mms`);
    approx(await main.locator('[data-testid="result-speed-mmin"]').innerText(), 3.5, `${label} def mmin`);
    approx(await main.locator('[data-testid="result-cut-time"]').innerText(), 41.142857, `${label} def cut`);
    approx(await main.locator('[data-testid="result-total-time"]').innerText(), 45.942857, `${label} def total`);

    await main.locator('[data-testid="preset-6kw-ss"]').click();
    approx(await main.locator('[data-testid="result-speed-mms"]').innerText(), 57.692308, `${label} ss mms`);
    approx(await main.locator('[data-testid="result-total-time"]').innerText(), 74.4, `${label} ss total`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('cutting_speed_mm_s,57.6923,mm/s'), `${label} csv speed`);

    await main.locator('[data-testid="input-absorb"]').fill('1.5');
    assert.strictEqual((await main.locator('[data-testid="result-speed-mms"]').innerText()).trim(), '—', `${label} eta > 1 invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-speed-mms"]').innerText(), 58.333333, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 188. led-resistor-calculator
  {
    const label = '188 led-resistor-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/led-resistor-calculator`, '[data-testid="input-vs"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B38_TERMS, label);

    approx(await main.locator('[data-testid="result-ohms"]').innerText(), 285, `${label} def ohms`);
    approx(await main.locator('[data-testid="result-e24"]').innerText(), 300, `${label} def e24`);
    approx(await main.locator('[data-testid="result-p-resistor"]').innerText(), 114, `${label} def pres`);
    approx(await main.locator('[data-testid="result-p-total"]').innerText(), 240, `${label} def ptot`);

    await main.locator('[data-testid="preset-24v-6white"]').click();
    approx(await main.locator('[data-testid="result-ohms"]').innerText(), 270, `${label} 24v ohms`);
    approx(await main.locator('[data-testid="result-e24"]').innerText(), 270, `${label} 24v e24`);
    approx(await main.locator('[data-testid="result-p-resistor"]').innerText(), 108, `${label} 24v pres`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('exact_resistance_ohm,270.0000,Ohm'), `${label} csv ohms`);

    await main.locator('[data-testid="input-count"]').fill('8');
    assert.strictEqual((await main.locator('[data-testid="result-ohms"]').innerText()).trim(), '—', `${label} Vs <= N*Vf dash`);
    await main.locator('[data-testid="input-count"]').fill('1.5');
    assert.strictEqual((await main.locator('[data-testid="result-ohms"]').innerText()).trim(), '—', `${label} float N dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-ohms"]').innerText(), 285, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 189. length-unit-converter
  {
    const label = '189 length-unit-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/length-unit-converter`, '[data-testid="input-value"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B38_TERMS, label);

    approx(await main.locator('[data-testid="result-converted"]').innerText(), 3.937008, `${label} 100mm->in`);
    approx(await main.locator('[data-testid="unit-ft"]').innerText(), 0.328084, `${label} 100mm->ft`);

    await main.locator('[data-testid="preset-1mi-km"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 1.609344, `${label} 1mi->km`);

    await main.locator('[data-testid="btn-swap"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 0.621371, `${label} 1km->mi`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('mi,Statute Miles (mi),'), `${label} csv mi`);

    await main.locator('[data-testid="input-value"]').fill('10mm');
    assert.strictEqual((await main.locator('[data-testid="result-converted"]').innerText()).trim(), '—', `${label} 10mm dash`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-converted"]').innerText(), 3.937008, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 190. lever-mechanical-advantage-calculator
  {
    const label = '190 lever-mechanical-advantage-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/lever-mechanical-advantage-calculator`, '[data-testid="input-load-force"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B38_TERMS, label);

    approx(await main.locator('[data-testid="result-ma"]').innerText(), 5.0, `${label} def ma`);
    approx(await main.locator('[data-testid="result-effort"]').innerText(), 40.0, `${label} def effort`);
    approx(await main.locator('[data-testid="result-reaction"]').innerText(), 240.0, `${label} def reaction`);

    await main.locator('[data-testid="preset-class2-wheelbarrow"]').click();
    approx(await main.locator('[data-testid="result-ma"]').innerText(), 3.5, `${label} c2 ma`);
    approx(await main.locator('[data-testid="result-effort"]').innerText(), 142.857143, `${label} c2 effort`);
    approx(await main.locator('[data-testid="result-reaction"]').innerText(), 357.142857, `${label} c2 reaction`);

    await main.locator('[data-testid="preset-class3-tongs"]').click();
    approx(await main.locator('[data-testid="result-ma"]').innerText(), 0.333333, `${label} c3 ma`);
    approx(await main.locator('[data-testid="result-effort"]').innerText(), 90.0, `${label} c3 effort`);
    approx(await main.locator('[data-testid="result-reaction"]').innerText(), 60.0, `${label} c3 reaction`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('lever_class,class_3,type'), `${label} csv c3`);

    await main.locator('[data-testid="input-effort-arm"]').fill('0.5');
    assert.strictEqual((await main.locator('[data-testid="result-ma"]').innerText()).trim(), '—', `${label} c3 Le>=Ll invalid`);
    await assertNoNan(main, label);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-ma"]').innerText(), 5.0, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 38 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
