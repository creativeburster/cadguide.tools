// scripts/enrich_tools_data_ast.js
/**
 * Enrich tool data by scraping official URLs.
 * Uses AST parsing (via @babel/parser & recast) to reliably locate and modify the `tools` array
 * in src/lib/data.ts regardless of formatting or comments.
 *
 * Dependencies (install once):
 *   npm i @babel/parser recast cheerio prettier
 */
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // node >=18 has global fetch, but keep for safety
const cheerio = require('cheerio');
const prettier = require('prettier');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS_PATH = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');
const LOG_PATH = path.resolve(__dirname, 'enrich_log.json');
const FETCH_TIMEOUT = 20000;

const PRICE_KEYWORDS = ['price', 'pricing', 'subscription', 'perpetual', 'license', 'cost', '$', '€', '£'];
const CAPABILITY_KEYWORDS = ['feature', 'capability', 'key capability', '优势', '功能', '特点', 'key feature'];
const DETAIL_KEYWORDS = ['detail', 'detailed feature', 'specification', 'specs', 'spec', '技术特点'];

/** Helper: fetch with timeout */
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

/** Extract pricing strings from HTML */
function extractPricing($) {
  const candidates = [];
  $('*')
    .filter((_, el) => PRICE_KEYWORDS.some(k => $(el).text().toLowerCase().includes(k)))
    .each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) candidates.push(txt);
    });
  $('*')
    .filter((_, el) => /[\$€£]\s*\d/.test($(el).text()))
    .each((_, el) => {
      const txt = $(el).text().trim();
      if (txt) candidates.push(txt);
    });
  return [...new Set(candidates)].filter(t => t.length < 200);
}

/** Extract capability list */
function extractCapabilities($) {
  const caps = [];
  $('h2,h3,h4')
    .filter((_, el) => CAPABILITY_KEYWORDS.some(k => $(el).text().toLowerCase().includes(k)))
    .each((_, heading) => {
      const next = $(heading).next();
      if (next.is('ul,ol')) {
        next.find('li').each((_, li) => caps.push($(li).text().trim()));
      } else if (next.is('p')) {
        const split = next.text().split(/[·●\-–]/).map(s => s.trim());
        split.forEach(s => { if (s) caps.push(s); });
      }
    });
  if (!caps.length) {
    $('li')
      .filter((_, li) => CAPABILITY_KEYWORDS.some(k => $(li).text().toLowerCase().includes(k)))
      .each((_, li) => caps.push($(li).text().trim()));
  }
  return [...new Set(caps)];
}

/** Extract detailed features */
function extractDetails($) {
  const details = [];
  $('h2,h3,h4')
    .filter((_, el) => DETAIL_KEYWORDS.some(k => $(el).text().toLowerCase().includes(k)))
    .each((_, heading) => {
      const next = $(heading).next();
      if (next.is('ul,ol')) {
        next.find('li').each((_, li) => details.push($(li).text().trim()));
      } else if (next.is('p')) {
        const parts = next.text().split(/[·●\-–]/).map(s => s.trim());
        parts.forEach(p => { if (p) details.push(p); });
      }
    });
  if (!details.length) {
    $('li')
      .filter((_, li) => /engine|core|feature|spec/.test($(li).text().toLowerCase()))
      .each((_, li) => details.push($(li).text().trim()));
  }
  return [...new Set(details)];
}

/** Convert raw strings to structured pricing objects */
function buildPricingObjects(strings) {
  return strings.map((txt, idx) => ({
    tier: idx === 0 ? 'Primary' : `Option ${idx + 1}`,
    price: txt.replace(/\s+/g, ' ').trim(),
    notes: ''
  }));
}

/** Main enrichment flow */
(async () => {
  console.log('=== Enriching tools data (AST version) ===');

  const src = fs.readFileSync(DATA_TS_PATH, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse(code) {
        return parser.parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'classProperties', 'decorators-legacy']
        });
      }
    }
  });

  // Locate ExportNamedDeclaration with const tools = [...];
  let toolsArrayPath = null;
  recast.types.visit(ast, {
    visitExportNamedDeclaration(path) {
      const decl = path.node.declaration;
      if (decl && decl.type === 'VariableDeclaration') {
        const declarator = decl.declarations.find(d => d.id.name === 'tools');
        if (declarator && declarator.init && declarator.init.type === 'ArrayExpression') {
          toolsArrayPath = path.get('declaration', 'declarations', decl.declarations.indexOf(declarator), 'init');
          return false; // stop traversal
        }
      }
      this.traverse(path);
    }
  });

  if (!toolsArrayPath) {
    console.error('Cannot locate exported const tools array in data.ts');
    process.exit(1);
  }

  const toolsElements = toolsArrayPath.get('elements'); 
  const log = {};

  // We use .value to get the actual array of elements
  for (let i = 0; i < toolsElements.value.length; i++) {
    const elemPath = toolsElements.get(i);
    const objExpr = elemPath.node; // ObjectExpression
    const getProp = name => objExpr.properties.find(p => p.key && p.key.name === name);
    const slugProp = getProp('slug');
    const urlProp = getProp('official_url');
    if (!slugProp || !urlProp) {
      continue; // skip malformed entry
    }
    const slug = slugProp.value.value;
    const officialUrl = urlProp.value.value;
    console.log(`Processing ${slug} → ${officialUrl}`);
    const entryLog = { status: 'pending' };
    log[slug] = entryLog;
    if (!officialUrl) {
      entryLog.status = 'skipped';
      entryLog.reason = 'no official_url';
      continue;
    }
    
    // Skip if already has pricing data (to avoid overwriting manual enrichment)
    if (getProp('pricing_breakdown') && getProp('pricing_breakdown').value.elements.length > 0) {
      console.log(`Skipping ${slug} (already enriched)`);
      entryLog.status = 'skipped';
      entryLog.reason = 'already has data';
      continue;
    }
    try {
      const html = await fetchWithTimeout(officialUrl);
      const $ = cheerio.load(html);

      const pricingRaw = extractPricing($);
      const pricing_breakdown = buildPricingObjects(pricingRaw);
      const key_capabilities = extractCapabilities($);
      const detailed_features = extractDetails($);

      // ---- Insert / update fields in the AST ----
      const makeArrayExpression = arr =>
        recast.types.builders.arrayExpression(arr.map(v => recast.types.builders.stringLiteral(v)));
      const makePricingArray = arr =>
        recast.types.builders.arrayExpression(
          arr.map(p =>
            recast.types.builders.objectExpression([
              recast.types.builders.objectProperty(recast.types.builders.identifier('tier'), recast.types.builders.stringLiteral(p.tier)),
              recast.types.builders.objectProperty(recast.types.builders.identifier('price'), recast.types.builders.stringLiteral(p.price)),
              recast.types.builders.objectProperty(recast.types.builders.identifier('notes'), recast.types.builders.stringLiteral(p.notes))
            ])
          )
        );

      const ensureProp = (name, valueNode) => {
        const existing = getProp(name);
        if (existing) {
          existing.value = valueNode;
        } else {
          objExpr.properties.push(
            recast.types.builders.objectProperty(
              recast.types.builders.identifier(name),
              valueNode
            )
          );
        }
      };

      if (pricing_breakdown.length) ensureProp('pricing_breakdown', makePricingArray(pricing_breakdown));
      if (key_capabilities.length) ensureProp('key_capabilities', makeArrayExpression(key_capabilities));
      if (detailed_features.length) ensureProp('detailed_features', makeArrayExpression(detailed_features));

      entryLog.status = 'success';
      entryLog.fetched = {
        pricing: pricing_breakdown.length,
        capabilities: key_capabilities.length,
        details: detailed_features.length
      };
    } catch (e) {
      entryLog.status = 'error';
      entryLog.error = e.message;
      console.error(`Error for ${slug}: ${e.message}`);
    }
    // polite delay
    await new Promise(r => setTimeout(r, 1500));
  }

  // Write back modified AST to file
  const output = recast.print(ast).code;
  // Run prettier for consistency
  let formatted = output;
  try {
    const prettierConfig = await prettier.resolveConfig(DATA_TS_PATH);
    formatted = await prettier.format(output, { ...prettierConfig, parser: 'typescript' });
  } catch (_) {
    // ignore prettier errors
  }
  fs.writeFileSync(DATA_TS_PATH, formatted, 'utf8');
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
  console.log('✅ Enrichment finished. Log saved to', LOG_PATH);
})();
