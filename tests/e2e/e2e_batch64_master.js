/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Batch 64 Master E2E Suite:
 * 1. solar-panel-sizing-calculator
 * 2. solidworks-crash-diagnostic-wizard
 * 3. sound-transmission-class-calculator
 * 4. speed-unit-converter
 * 5. spindle-power-calculator
 */
const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TOL = 0.001;

const BANNED_B64_TERMS = [
  'IBC 1206',
  'ASTM E90',
  'ASTM E413',
  'GDIProcessHandleQuota',
  'reg delete',
  'reg add',
  'del /q',
  'GraphicsCache',
  'ISO 10303',
  'VDI 2230',
  'ISO 898',
  'NFPA 70',
  'IEC 60909',
  'IEC 60364',
  'IEEE Std 1584',
  'IPC-2221',
  'Mach number',
  'BIPM',
  'NIST',
  'ISO 80000',
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
  page.on('pageerror', (err) => {
    pageErrors.push(String(err));
  });

  // 1. solar-panel-sizing-calculator
  {
    const label = 'solar-panel-sizing-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-energy"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B64_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-np"]').innerText(), 2, `${label} def Np`);
    approx(await page.locator('[data-testid="output-parray"]').innerText(), 800, `${label} def Parray`);
    approx(await page.locator('[data-testid="output-ah"]').innerText(), 208.333333, `${label} def Ah`);
    approx(await page.locator('[data-testid="output-wh"]').innerText(), 10000, `${label} def Wh`);

    await page.fill('[data-testid="input-energy"]', '6000');
    await page.fill('[data-testid="input-sun"]', '4.5');
    await page.fill('[data-testid="input-volt"]', '48');
    await page.fill('[data-testid="input-pw"]', '550');
    await page.fill('[data-testid="input-days"]', '3');
    await page.fill('[data-testid="input-eff"]', '0.80');
    await page.fill('[data-testid="input-dod"]', '0.85');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-parray"]').innerText(), 1666.666667, `${label} mod Parray`);
    approx(await page.locator('[data-testid="output-np"]').innerText(), 4, `${label} mod Np`);
    approx(await page.locator('[data-testid="output-ah"]').innerText(), 551.470588, `${label} mod Ah`);
    approx(await page.locator('[data-testid="output-wh"]').innerText(), 26470.588235, `${label} mod Wh`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('551.470588') && csv.includes('1666.666667'), `${label} csv values missing`);

    await page.fill('[data-testid="input-energy"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-ah"]').innerText(), 208.333333, `${label} reset Ah`);
    console.log(`[PASS] ${label}`);
  }

  // 2. solidworks-crash-diagnostic-wizard
  {
    const label = 'solidworks-crash-diagnostic-wizard';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="scenario-graphics-opengl"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B64_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    const defTitle = await page.locator('[data-testid="diag-title"]').innerText();
    assert(defTitle.includes('rotate') || defTitle.includes('display') || defTitle.includes('OpenGL') || defTitle.includes('models'), `${label} def title mismatch`);

    await page.click('[data-testid="scenario-large-assembly"]');
    const panelText = await page.locator('[data-testid="diagnostic-panel"]').innerText();
    assert(panelText.includes('SpeedPak'), `${label} SpeedPak missing`);

    await page.click('[data-testid="step-0"]');
    const progText = await page.locator('[data-testid="progress-count"]').innerText();
    assert(progText.toLowerCase().includes('1 / 2 checked'), `${label} progress expected 1 / 2 checked, got "${progText}"`);

    await page.evaluate(() => {
      const mockClipboard = { writeText: () => Promise.reject(new Error('Clipboard denied')) };
      try {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mockClipboard });
      } catch {
        if (navigator.clipboard) {
          navigator.clipboard.writeText = mockClipboard.writeText;
        }
      }
    });
    await page.click('[data-testid="copy-checklist-btn"]');
    await page.waitForTimeout(100);
    const copyBtnText = await page.locator('[data-testid="copy-checklist-btn"]').innerText();
    assert(!copyBtnText.includes('Copied') && copyBtnText.includes('Copy Steps'), `${label} clipboard reject showed Copied: "${copyBtnText}"`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-txt-btn"]'),
    ]);
    const txt = await readDownloadText(dl);
    assertAscii(txt, `${label} txt`);
    assert(txt.includes('SpeedPak') && txt.includes('https://blogs.solidworks.com/'), `${label} txt content mismatch`);

    await page.click('[data-testid="scenario-problem-capture"]');
    const problemCaptureHref = await page.locator('[data-testid="diagnostic-panel"] a').getAttribute('href');
    assert.strictEqual(
      problemCaptureHref,
      'https://blogs.solidworks.com/products/solidworks/complete-guide-using-solidworks-rx/',
      `${label} problem-capture officialUrl mismatch: ${problemCaptureHref}`
    );
    const problemCaptureText = await page.locator('[data-testid="diagnostic-panel"]').innerText();
    assert(
      problemCaptureText.includes('Source: SOLIDWORKS Graphic Optimization Guide (PDF), p. 4'),
      `${label} problem-capture actionNote missing`
    );

    await page.click('[data-testid="btn-reset"]');
    const resetProg = await page.locator('[data-testid="progress-count"]').innerText();
    assert(resetProg.toLowerCase().includes('0 / 2 checked'), `${label} reset prog mismatch, got "${resetProg}"`);
    console.log(`[PASS] ${label}`);
  }

  // 3. sound-transmission-class-calculator
  {
    const label = 'sound-transmission-class-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-mass"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B64_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-stc"]').innerText(), 54.283625, `${label} def stc`);
    approx(await page.locator('[data-testid="output-tlf"]').innerText(), 54.283625, `${label} def tlf`);
    approx(await page.locator('[data-testid="output-tl500"]').innerText(), 54.283625, `${label} def tl500`);

    await page.click('[data-testid="preset-slab"]');
    await page.fill('[data-testid="input-freq"]', '1000');
    await page.fill('[data-testid="input-adj"]', '4');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-tlf"]').innerText(), 63.581361, `${label} mod tlf`);
    approx(await page.locator('[data-testid="output-tl500"]').innerText(), 57.560761, `${label} mod tl500`);
    approx(await page.locator('[data-testid="output-stc"]').innerText(), 61.560761, `${label} mod stc`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('63.581361') && csv.includes('8000,15,72.561'), `${label} csv band rows missing`);

    await page.fill('[data-testid="input-mass"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-stc"]').innerText(), 54.283625, `${label} reset stc`);
    console.log(`[PASS] ${label}`);
  }

  // 4. speed-unit-converter
  {
    const label = 'speed-unit-converter';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-val"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B64_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-result"]').innerText(), 62.137119, `${label} def res`);
    approx(await page.locator('[data-testid="output-unit-ms"]').innerText(), 27.777778, `${label} def ms`);
    approx(await page.locator('[data-testid="output-unit-knot"]').innerText(), 53.99568, `${label} def knot`);

    await page.selectOption('[data-testid="select-from"]', 'knot');
    await page.selectOption('[data-testid="select-to"]', 'kmh');
    await page.fill('[data-testid="input-val"]', '60');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-result"]').innerText(), 111.12, `${label} mod res`);
    approx(await page.locator('[data-testid="output-unit-mph"]').innerText(), 69.046767, `${label} mod mph`);

    await page.click('[data-testid="btn-swap"]');
    approx(await page.locator('[data-testid="output-result"]').innerText(), 32.397408, `${label} swap res`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('32.397408'), `${label} csv swap val missing`);

    await page.fill('[data-testid="input-val"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-result"]').innerText(), 62.137119, `${label} reset res`);
    console.log(`[PASS] ${label}`);
  }

  // 5. spindle-power-calculator
  {
    const label = 'spindle-power-calculator';
    await openToolPage(page, `${BASE_URL}/toolbox/${label}`, '[data-testid="input-fc"]');
    await verifyNoBannedAndNoNumberInput(page, BANNED_B64_TERMS, label);
    const main = page.locator('main').last();
    await assertNoNan(main, `${label} default`);

    approx(await page.locator('[data-testid="output-pc-net"]').innerText(), 2.0, `${label} def pc_net`);
    approx(await page.locator('[data-testid="output-pc"]').innerText(), 2.352941, `${label} def pc`);
    approx(await page.locator('[data-testid="output-pf"]').innerText(), 0.001765, `${label} def pf`);
    approx(await page.locator('[data-testid="output-pt"]').innerText(), 2.354706, `${label} def pt`);

    await page.fill('[data-testid="input-fc"]', '1200');
    await page.fill('[data-testid="input-vc"]', '200');
    await page.fill('[data-testid="input-ff"]', '450');
    await page.fill('[data-testid="input-vf"]', '600');
    await page.fill('[data-testid="input-eta"]', '0.80');

    await assertNoNan(main, `${label} mod`);
    approx(await page.locator('[data-testid="output-pc-net"]').innerText(), 4.0, `${label} mod pc_net`);
    approx(await page.locator('[data-testid="output-pc"]').innerText(), 5.0, `${label} mod pc`);
    approx(await page.locator('[data-testid="output-pf"]').innerText(), 0.005625, `${label} mod pf`);
    approx(await page.locator('[data-testid="output-pt"]').innerText(), 5.005625, `${label} mod pt`);

    const [dl] = await Promise.all([
      page.waitForEvent('download'),
      page.click('[data-testid="export-csv-btn"]'),
    ]);
    const csv = await readDownloadText(dl);
    assertAscii(csv, `${label} csv`);
    assert(csv.includes('0.005625') && csv.includes('5.005625'), `${label} csv values missing`);

    await page.fill('[data-testid="input-fc"]', '');
    await page.waitForSelector('[data-testid="validation-msg"]');
    await assertNoNan(main, `${label} empty`);
    await page.click('[data-testid="btn-reset"]');
    approx(await page.locator('[data-testid="output-pt"]').innerText(), 2.354706, `${label} reset pt`);
    console.log(`[PASS] ${label}`);
  }

  assert.strictEqual(consoleErrors.length, 0, `Console errors: ${consoleErrors.join('; ')}`);
  assert.strictEqual(pageErrors.length, 0, `Page errors: ${pageErrors.join('; ')}`);

  await browser.close();
  console.log('ALL_BATCH64_PASSED');
})();
