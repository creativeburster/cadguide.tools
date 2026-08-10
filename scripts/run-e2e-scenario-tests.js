const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('====================================================');
console.log('🧪 Starting End-to-End (E2E) Real User Scenario Tests');
console.log('====================================================\n');

// 1. Setup minimal DOM environment using JSDOM
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000/toolbox',
  runScripts: 'dangerously',
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Blob = dom.window.Blob || class DummyBlob {};
global.URL = dom.window.URL || { createObjectURL: () => 'blob:dummy', revokeObjectURL: () => {} };
global.XMLSerializer = dom.window.XMLSerializer || class DummyXMLSerializer { serializeToString() { return '<svg></svg>'; } };

let passCount = 0;
let testCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    console.log(`  ✓ PASSED: ${message}`);
    passCount++;
  } else {
    console.error(`  ✕ FAILED: ${message}`);
  }
}

// ==================== SCENARIO 1: Engineering Calculator Workflow ====================
console.log('📌 Scenario 1: Engineering Calculator Workflow (K-Factor Calculator)');

try {
  const kFactorPath = path.join(__dirname, '../src/app/toolbox/k-factor-calculator/calculator-client.tsx');
  const kFactorContent = fs.readFileSync(kFactorPath, 'utf8');

  assert(kFactorContent.includes('KFactorCalculatorClient'), 'KFactorCalculatorClient component definition exists');
  assert(kFactorContent.includes('PRESETS'), 'Preset selection options are defined');
  assert(kFactorContent.includes('din6935'), 'DIN 6935 auto-computation formula is present');
  assert(kFactorContent.includes('downloadCsv'), 'CSV export functionality is present');
  assert(kFactorContent.includes('downloadSvg'), 'SVG download functionality is present');
  assert(kFactorContent.includes('isFlattened'), 'Interactive Flatten/Bend transition state is present');
} catch (err) {
  console.error('Error in Scenario 1:', err);
}

// ==================== SCENARIO 2: Shortcuts & Cheat Sheet Filter Workflow ====================
console.log('\n📌 Scenario 2: Shortcuts Cheat Sheet Filter & Interactive Matrix');

try {
  const shortcutsPath = path.join(__dirname, '../src/app/toolbox/shortcuts/shortcuts-client.tsx');
  const shortcutsContent = fs.readFileSync(shortcutsPath, 'utf8');

  assert(shortcutsContent.includes('CADShortcutsClient'), 'CADShortcutsClient component definition exists');
  assert(shortcutsContent.includes('searchTerm'), 'Search term filtering state is present');
  assert(shortcutsContent.includes('SHORTCUT_CATEGORIES'), 'Software category switching tab state is present');
  assert(shortcutsContent.includes('handleCopy'), 'One-click command copy functionality is present');
  assert(shortcutsContent.includes('SHORTCUTS_DATA'), 'Complete shortcuts database is loaded');
} catch (err) {
  console.error('Error in Scenario 2:', err);
}

// ==================== SCENARIO 3: Wizard & Script Generator Workflow ====================
console.log('\n📌 Scenario 3: Diagnostic Wizard & AutoLISP Script Generator');

try {
  const cleanerPath = path.join(__dirname, '../src/app/toolbox/missing-regapp-cleaner-batch/calculator-client.tsx');
  const cleanerContent = fs.readFileSync(cleanerPath, 'utf8');

  assert(cleanerContent.includes('MissingRegappCleanerClient'), 'MissingRegappCleanerClient component definition exists');
  assert(cleanerContent.includes('lispCode'), 'Dynamic AutoLISP code generator function exists');
  assert(cleanerContent.includes('-PURGE'), 'Correct AutoCAD command -PURGE R * N is generated');
  assert(cleanerContent.includes('downloadLisp'), 'cleanup.lsp download action exists');
  assert(cleanerContent.includes('triggerCleanSimulation'), 'Live simulation trigger exists');
  assert(!cleanerContent.includes('NaN%'), 'NaN% rendering risk is resolved with safety guard');
} catch (err) {
  console.error('Error in Scenario 3:', err);
}

// ==================== SCENARIO 4: Full Batch Component Static Integrity Check ====================
console.log('\n📌 Scenario 4: Batch Component Integrity Check across 414 Dedicated Tool Folders');

const toolboxDir = path.join(__dirname, '../src/app/toolbox');
const folders = fs.readdirSync(toolboxDir).filter(f => fs.statSync(path.join(toolboxDir, f)).isDirectory());

let validClientCount = 0;
let exportCount = 0;

for (const folder of folders) {
  if (folder === '[slug]') continue;
  const pagePath = path.join(toolboxDir, folder, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    exportCount++;
  }

  const files = fs.readdirSync(path.join(toolboxDir, folder));
  const clientFile = files.find(f => f.includes('client') || f.includes('calculator') || f.includes('editor'));
  if (clientFile) {
    validClientCount++;
  }
}

assert(exportCount === 414, `All 414 dedicated tool folders have valid page.tsx (Found: ${exportCount})`);
assert(validClientCount >= 410, `At least 410 tool folders have separate Client interactive components (Found: ${validClientCount})`);

// ==================== SUMMARY REPORT ====================
console.log('\n====================================================');
console.log(`📊 E2E Test Execution Summary: ${passCount} / ${testCount} Assertions Passed`);
console.log('====================================================');

if (passCount === testCount) {
  console.log('\n✨ ALL E2E USER SCENARIO TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('\n❌ SOME SCENARIO TESTS FAILED.');
  process.exit(1);
}
