/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 42 Master E2E Suite (#206-#210):
 * 206. moment-inertia-shape-calculator
 * 207. mortar-quantity-calculator
 * 208. motor-efficiency-calculator
 * 209. motor-starting-current-calculator
 * 210. mrr-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B42_TERMS = [
  'NIST SP 811',
  'BIPM SI Brochure',
  'ACI 318-19',
  'ADA 2010',
  'NFPA 70',
  'IEEE Std 1584',
  'IPC-2221',
  'IEC 60034-30-1',
  'IEC 60034-2-1',
  'NEMA MG 1',
  'ISO 286-1',
  'DIN 6935',
];

function parseNumeric(text) {
  const cleaned = String(text || '').replace(/,/g, '').trim();
  const m = cleaned.match(/-?\d+(?:\.\d+)?/);
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
  assert(!/\bNaN\b/i.test(body), `${label}: contains NaN`);
  assert(!/\bInfinity\b/i.test(body), `${label}: contains Infinity`);
}

function assertAscii(text, label) {
  for (let i = 0; i < text.length; i++) {
    assert(text.charCodeAt(i) <= 127, `${label}: non-ASCII char code ${text.charCodeAt(i)} at index ${i}`);
  }
}

async function readDownloadText(download) {
  const path = await download.path();
  return fs.readFileSync(path, 'utf8');
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
    if (res.status() >= 400 && !res.url().includes('favicon.ico')) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  // 206. moment-inertia-shape-calculator
  {
    const label = '206 moment-inertia-shape-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/moment-inertia-shape-calculator`, '[data-testid="select-shape"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B42_TERMS, label);

    // Default rect: b=100mm (10cm), h=200mm (20cm)
    // Ix = 10 * 20^3 / 12 = 6666.6667 cm4, Iy = 1666.6667 cm4, J = 8333.3333 cm4
    approx(await main.locator('[data-testid="result-ix"]').innerText(), 6666.6667, `${label} rect Ix`);
    approx(await main.locator('[data-testid="result-iy"]').innerText(), 1666.6667, `${label} rect Iy`);
    approx(await main.locator('[data-testid="result-j"]').innerText(), 8333.3333, `${label} rect J`);
    approx(await main.locator('[data-testid="result-area"]').innerText(), 200, `${label} rect A`);
    approx(await main.locator('[data-testid="result-zx"]').innerText(), 666.6667, `${label} rect Zx`);
    approx(await main.locator('[data-testid="result-rx"]').innerText(), 5.7735, `${label} rect rx`);

    // I-Beam preset: H=200, bf=100, tw=6, tf=10
    // A = 30.8 cm2, Ix = 2098.2667 cm4, Iy = 166.9907 cm4, Zx = 209.8267 cm3, rx = 8.2538 cm
    await main.locator('[data-testid="preset-i-beam-200"]').click();
    approx(await main.locator('[data-testid="result-ix"]').innerText(), 2098.2667, `${label} ibeam Ix`);
    approx(await main.locator('[data-testid="result-iy"]').innerText(), 166.9907, `${label} ibeam Iy`);
    approx(await main.locator('[data-testid="result-area"]').innerText(), 30.8, `${label} ibeam A`);
    approx(await main.locator('[data-testid="result-rx"]').innerText(), 8.2538, `${label} ibeam rx`);

    // Boundary check: hollow tube with di >= D must reject cleanly
    await main.locator('[data-testid="preset-hollow-tube"]').click();
    await main.locator('[data-testid="input-dinner"]').fill('110');
    assert.strictEqual((await main.locator('[data-testid="result-ix"]').innerText()).trim(), '—', `${label} di>=D dash`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-ix"]').innerText(), 6666.6667, `${label} reset`);
    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('ix,6666.6667,cm4'), `${label} csv Ix`);

    await main.locator('[data-testid="input-b"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-ix"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);
    await main.locator('[data-testid="btn-reset"]').click();
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 207. mortar-quantity-calculator
  {
    const label = '207 mortar-quantity-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/mortar-quantity-calculator`, '[data-testid="input-length"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B42_TERMS, label);

    // Default: L=10, H=3, T=230, r=0.20, 1:4, k=1.33, w=10, rho=1440, bag=50
    // wall=6.9, wet=1.38, dry=2.01894, bags=12, sand=1.615152, cement=581.45472
    approx(await main.locator('[data-testid="result-wall-vol"]').innerText(), 6.9, `${label} def wall`);
    approx(await main.locator('[data-testid="result-wet-vol"]').innerText(), 1.38, `${label} def wet`);
    approx(await main.locator('[data-testid="result-dry-vol"]').innerText(), 2.0189, `${label} def dry`);
    approx(await main.locator('[data-testid="result-bags"]').innerText(), 12, `${label} def bags`);
    approx(await main.locator('[data-testid="result-sand-vol"]').innerText(), 1.6152, `${label} def sand`);

    // Block wall preset: L=15, H=3.2, T=200, r=0.12, 1:6, k=1.30, w=5, rho=1440, bag=50
    // wall=9.6, wet=1.152, dry=1.152*1.30*1.05=1.57248, cemVol=0.22464, cemKg=323.4816 => 7 bags, sand=1.34784
    await main.locator('[data-testid="preset-block-1-6"]').click();
    approx(await main.locator('[data-testid="result-dry-vol"]').innerText(), 1.57248, `${label} block dry`);
    approx(await main.locator('[data-testid="result-bags"]').innerText(), 7, `${label} block bags`);
    approx(await main.locator('[data-testid="result-sand-vol"]').innerText(), 1.34784, `${label} block sand`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('cement_bags_ceil,7,bags'), `${label} csv bags`);

    await main.locator('[data-testid="input-length"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-dry-vol"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);
    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-bags"]').innerText(), 12, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 208. motor-efficiency-calculator
  {
    const label = '208 motor-efficiency-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/motor-efficiency-calculator`, '[data-testid="input-pout"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B42_TERMS, label);

    // Default: pout=37, pin=40, freq=50, poles=4, rpm=1475
    // eta=92.5%, loss=3.0 kW, Ns=1500, slip=1.6667%, torque=239.5417 N*m
    approx(await main.locator('[data-testid="result-eff"]').innerText(), 92.5, `${label} def eff`);
    approx(await main.locator('[data-testid="result-loss"]').innerText(), 3.0, `${label} def loss`);
    approx(await main.locator('[data-testid="result-ns"]').innerText(), 1500, `${label} def ns`);
    approx(await main.locator('[data-testid="result-slip"]').innerText(), 1.6667, `${label} def slip`);
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 239.5417, `${label} def torque`);

    // 60Hz preset: 75/80 = 93.75%, Ns=1800, slip=20/1800=1.1111%, T=75000*60/(2*pi*1780)=402.3627
    await main.locator('[data-testid="preset-60hz-4p-75kw"]').click();
    approx(await main.locator('[data-testid="result-eff"]').innerText(), 93.75, `${label} 60hz eff`);
    approx(await main.locator('[data-testid="result-ns"]').innerText(), 1800, `${label} 60hz ns`);
    approx(await main.locator('[data-testid="result-slip"]').innerText(), 1.1111, `${label} 60hz slip`);
    approx(await main.locator('[data-testid="result-torque"]').innerText(), 402.3627, `${label} 60hz torque`);

    // Boundary: P_out >= P_in must reject cleanly
    await main.locator('[data-testid="input-pout"]').fill('85');
    assert.strictEqual((await main.locator('[data-testid="result-eff"]').innerText()).trim(), '—', `${label} pout>=pin dash`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-eff"]').innerText(), 92.5, `${label} reset`);
    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('efficiency_pct,92.5000,%'), `${label} csv eff`);

    await main.locator('[data-testid="input-pin"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-eff"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);
    await main.locator('[data-testid="btn-reset"]').click();
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 209. motor-starting-current-calculator
  {
    const label = '209 motor-starting-current-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/motor-starting-current-calculator`, '[data-testid="input-kw"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B42_TERMS, label);

    // Default DOL: 15 kW, 400 V, eff=0.9, pf=0.85, K=6.5, 3-phase
    // IFL=28.3015 A, Istart=183.9596 A, SkVA=127.4510 kVA
    approx(await main.locator('[data-testid="result-ifl"]').innerText(), 28.3015, `${label} dol ifl`);
    approx(await main.locator('[data-testid="result-istart"]').innerText(), 183.9596, `${label} dol istart`);
    approx(await main.locator('[data-testid="result-skva"]').innerText(), 127.4510, `${label} dol skva`);
    approx(await main.locator('[data-testid="result-torque-pct"]').innerText(), 100.0, `${label} dol torque`);

    // Star-delta preset: 30 kW, 400V, 0.92, 0.86, 6.5 => IFL=54.7286 A, Istart=118.5786 A, SkVA=82.1537 kVA, 33.33%
    await main.locator('[data-testid="preset-star-delta-30kw"]').click();
    approx(await main.locator('[data-testid="result-ifl"]').innerText(), 54.7286, `${label} sd ifl`);
    approx(await main.locator('[data-testid="result-istart"]').innerText(), 118.5786, `${label} sd istart`);
    approx(await main.locator('[data-testid="result-skva"]').innerText(), 82.1537, `${label} sd skva`);
    approx(await main.locator('[data-testid="result-torque-pct"]').innerText(), 33.33, `${label} sd torque`);

    // Boundary: eff > 1 must reject cleanly
    await main.locator('[data-testid="input-eff"]').fill('1.2');
    assert.strictEqual((await main.locator('[data-testid="result-ifl"]').innerText()).trim(), '—', `${label} eff>1 dash`);

    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-istart"]').innerText(), 183.9596, `${label} reset`);
    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('line_starting_current,183.9596,A'), `${label} csv istart`);

    await main.locator('[data-testid="input-kw"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-istart"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);
    await main.locator('[data-testid="btn-reset"]').click();
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  // 210. mrr-calculator
  {
    const label = '210 mrr-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/mrr-calculator`, '[data-testid="select-mode"]');
    const main = page.getByRole('main').last();
    await assertZeroNumberInputs(main, label);
    await verifyNegativeTerms(page, BANNED_B42_TERMS, label);

    // Default milling: w=10, d=2, f=500, rho=7.85, kc=1800 => 10 cm3/min, 10000 mm3/min, 78.5 g/min, 0.30000 kW
    approx(await main.locator('[data-testid="result-mrr-cm3"]').innerText(), 10.0, `${label} def cm3`);
    approx(await main.locator('[data-testid="result-mrr-mm3"]').innerText(), 10000.0, `${label} def mm3`);
    approx(await main.locator('[data-testid="result-mass-rate"]').innerText(), 78.5, `${label} def mass`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 0.3, `${label} def power`);

    // Turning preset: Vc=200, f=0.25, doc=2, rho=7.85, kc=2100 => 100 cm3/min, 785 g/min, 3.5 kW
    await main.locator('[data-testid="preset-turning-steel"]').click();
    approx(await main.locator('[data-testid="result-mrr-cm3"]').innerText(), 100.0, `${label} turn cm3`);
    approx(await main.locator('[data-testid="result-mass-rate"]').innerText(), 785.0, `${label} turn mass`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 3.5, `${label} turn power`);

    // Drilling preset: D=12, Vc=60, fr=0.20, rho=7.85, kc=1800 => 36 cm3/min, 282.6 g/min, 1.08 kW
    await main.locator('[data-testid="preset-drilling-12mm"]').click();
    approx(await main.locator('[data-testid="result-mrr-cm3"]').innerText(), 36.0, `${label} drill cm3`);
    approx(await main.locator('[data-testid="result-mass-rate"]').innerText(), 282.6, `${label} drill mass`);
    approx(await main.locator('[data-testid="result-power"]').innerText(), 1.08, `${label} drill power`);

    const [dl] = await Promise.all([page.waitForEvent('download'), main.locator('[data-testid="btn-download"]').click()]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('mrr_cm3_min,36.0000,cm3/min'), `${label} csv drill`);

    await main.locator('[data-testid="input-drill-dia"]').fill('');
    assert.strictEqual((await main.locator('[data-testid="result-mrr-cm3"]').innerText()).trim(), '—', `${label} empty dash`);
    await assertNoNan(main, label);
    await main.locator('[data-testid="btn-reset"]').click();
    approx(await main.locator('[data-testid="result-mrr-cm3"]').innerText(), 10.0, `${label} reset`);
    await assertClipboardRejectSafe(page, main, label);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert.strictEqual(failedRequests.length, 0, `HTTP >=400 requests: ${failedRequests.join(' | ')}`);

  await browser.close();
  console.log('ALL BATCH 42 E2E ASSERTIONS PASSED');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
