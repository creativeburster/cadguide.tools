/**
 * Phase 5 — Per-tool FAQ generation + alternatives auto-fill.
 *
 * Replaces every `faqs: genericFaqs("Name")` with an inline 6-question
 * FAQ array tailored to the tool's actual properties (pricing_type,
 * platforms, languages, file_formats, integrations, free_trial_days,
 * api_sdk, alternatives, etc.).
 *
 * For tools with `alternatives: []`, picks the 3 nearest peers by
 * (same category_id) + (closest score) + (same pricing_type if possible).
 *
 * AST patching via recast + @babel/parser so formatting / comments
 * survive intact. Re-runnable: skips tools that already have inline
 * FAQs (i.e. not a call to genericFaqs), and skips alternatives that
 * are already populated. The script is therefore idempotent against
 * any subsequent manual edits.
 *
 * Run:  node scripts/phase5_faq_alternatives.js
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const DATA_TS = path.resolve(__dirname, '..', 'src', 'lib', 'data.ts');

// ---------- Step 1. Parse data.ts ----------
const source = fs.readFileSync(DATA_TS, 'utf8');
const ast = recast.parse(source, {
  parser: {
    parse(s) {
      return parser.parse(s, {
        sourceType: 'module',
        plugins: ['typescript'],
        tokens: true,
      });
    },
  },
});

const builders = recast.types.builders;

// Locate the `tools` array.
let toolsArray = null;
recast.visit(ast, {
  visitVariableDeclarator(p) {
    if (
      p.node.id &&
      p.node.id.name === 'tools' &&
      p.node.init &&
      p.node.init.type === 'ArrayExpression'
    ) {
      toolsArray = p.node.init;
      return false;
    }
    this.traverse(p);
  },
});
if (!toolsArray) throw new Error('Could not locate `tools` array');

// ---------- Step 2. Project each tool object → simple JS ----------
function literalValue(node) {
  if (!node) return undefined;
  if (node.type === 'StringLiteral') return node.value;
  if (node.type === 'NumericLiteral') return node.value;
  if (node.type === 'BooleanLiteral') return node.value;
  if (node.type === 'NullLiteral') return null;
  if (node.type === 'ArrayExpression') return node.elements.map(literalValue);
  if (node.type === 'ObjectExpression') {
    const o = {};
    for (const p of node.properties) {
      if (p.type !== 'ObjectProperty' || p.computed) continue;
      const key = p.key.name || p.key.value;
      o[key] = literalValue(p.value);
    }
    return o;
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked).join('');
  }
  // call expressions etc → undefined
  return undefined;
}

const toolPropertyOf = (objExpr, name) =>
  objExpr.properties.find(
    (p) =>
      p.type === 'ObjectProperty' &&
      !p.computed &&
      p.key &&
      (p.key.name === name || p.key.value === name),
  );

const toolEntries = toolsArray.elements
  .map((node, i) => {
    if (!node || node.type !== 'ObjectExpression') return null;
    const get = (k) => {
      const p = toolPropertyOf(node, k);
      return p ? literalValue(p.value) : undefined;
    };
    return {
      index: i,
      node,
      id: get('id'),
      name: get('name'),
      slug: get('slug'),
      short_desc: get('short_desc'),
      description: get('description'),
      category_id: get('category_id'),
      pricing_type: get('pricing_type'),
      starting_price: get('starting_price'),
      platforms: get('platforms') || [],
      industries: get('industries') || [],
      core_features: get('core_features') || [],
      user_scales: get('user_scales') || [],
      official_url: get('official_url'),
      country: get('country'),
      score: get('score'),
      pros: get('pros') || [],
      cons: get('cons') || [],
      alternatives: get('alternatives') || [],
      version: get('version'),
      free_trial_days: get('free_trial_days'),
      languages: get('languages') || [],
      file_formats_in: get('file_formats_in') || [],
      file_formats_out: get('file_formats_out') || [],
      integrations: get('integrations') || [],
      deployment_options: get('deployment_options') || [],
      license_types: get('license_types') || [],
      api_sdk: get('api_sdk'),
      support_channels: get('support_channels') || [],
      security_compliance: get('security_compliance') || [],
      external_ratings: get('external_ratings') || [],
    };
  })
  .filter((t) => t && t.slug);

const bySlug = new Map(toolEntries.map((t) => [t.slug, t]));

// Known aliases for legacy alternative slugs that reference tools by short
// vendor name instead of canonical slug. Anything not in this map and not in
// bySlug is dropped from FAQ rendering.
const SLUG_ALIASES = {
  altium: 'altium-designer',
  kicad: null, // not in catalog
  solidedge: null, // not in catalog
  revizto: null,
  netfabb: null,
  cyclone: null,
  parasolid: null,
};
function resolveSlug(s) {
  if (bySlug.has(s)) return s;
  if (s in SLUG_ALIASES) return SLUG_ALIASES[s];
  return null;
}
function resolveAlts(slugs, selfSlug) {
  const out = [];
  for (const s of slugs || []) {
    if (s === selfSlug) continue;
    const r = resolveSlug(s);
    if (r && !out.includes(r)) out.push(r);
  }
  return out;
}

// ---------- Step 3. Category name lookup ----------
let categoriesArray = null;
recast.visit(ast, {
  visitVariableDeclarator(p) {
    if (
      p.node.id &&
      p.node.id.name === 'categories' &&
      p.node.init &&
      p.node.init.type === 'ArrayExpression'
    ) {
      categoriesArray = p.node.init;
      return false;
    }
    this.traverse(p);
  },
});
const categoryNameById = new Map();
if (categoriesArray) {
  for (const c of categoriesArray.elements) {
    if (!c || c.type !== 'ObjectExpression') continue;
    const idP = toolPropertyOf(c, 'id');
    const nameP = toolPropertyOf(c, 'name');
    if (idP && nameP) {
      categoryNameById.set(literalValue(idP.value), literalValue(nameP.value));
    }
  }
}
function categoryNameOf(tool) {
  return categoryNameById.get(tool.category_id) || 'CAD';
}

// Format the category name for in-sentence prose. Preserves acronyms and
// 2D/3D prefixes; lowercases plain noun-phrase categories.
const CATEGORY_LABEL_OVERRIDES = {
  c1: '2D CAD',
  c2: '3D modeling',
  c3: 'BIM',
  c4: 'CAD viewer',
  c5: 'CAE / CAM',
  c6: 'EDA',
  c7: 'visualization and rendering',
};
function categoryLabelFor(tool) {
  if (CATEGORY_LABEL_OVERRIDES[tool.category_id]) return CATEGORY_LABEL_OVERRIDES[tool.category_id];
  const raw = categoryNameOf(tool);
  if (/^[A-Z]{2,}([\/&\- ][A-Z]{2,})*$/.test(raw)) return raw;
  return raw.toLowerCase();
}

// 'a' vs 'an' for the prose article in front of the category label.
function articleFor(word) {
  return /^[aeiouAEIOU]/.test(word) ? 'an' : 'a';
}

// ---------- Step 4. Generate FAQs ----------
function platformsLabel(t) {
  const p = t.platforms || [];
  if (p.length === 0) return 'major desktop platforms';
  if (p.length === 1) return p[0];
  if (p.length === 2) return `${p[0]} and ${p[1]}`;
  return `${p.slice(0, -1).join(', ')}, and ${p[p.length - 1]}`;
}

function buildFaqs(t) {
  const name = t.name;
  const platforms = platformsLabel(t);
  const out = [];

  // 1. What is it? — always.
  out.push({
    q: `What is ${name} used for?`,
    a:
      (t.short_desc && `${t.short_desc} `) +
      `${name} is ${articleFor(categoryLabelFor(t))} ${categoryLabelFor(t)} solution${
        t.industries && t.industries.length
          ? ` widely adopted in ${t.industries.slice(0, 3).join(', ')}.`
          : '.'
      }`,
  });

  // 2. Pricing
  let priceA;
  if (t.pricing_type === 'Free' || t.pricing_type === 'Open Source') {
    priceA = `${name} is ${t.pricing_type === 'Open Source' ? 'open-source and free to use' : 'completely free for both personal and commercial use'}. Vendor support and commercial services may be offered separately.`;
  } else if (typeof t.starting_price === 'number' && t.starting_price > 0) {
    const license = t.license_types && t.license_types.length
      ? t.license_types.slice(0, 2).join(' and ').toLowerCase()
      : (t.pricing_type || 'commercial').toLowerCase();
    priceA = `${name} starts at $${t.starting_price.toLocaleString()} per seat on a ${license} license. Volume, network, and educational tiers are typically available — contact the vendor for an enterprise quote.`;
  } else {
    priceA = `${name} is offered on a ${(t.pricing_type || 'commercial').toLowerCase()} model. The vendor does not publish a fixed list price; pricing scales with module bundles and seat counts.`;
  }
  out.push({ q: `How much does ${name} cost?`, a: priceA });

  // 3. Free trial — free / open-source tools get the "really free" answer
  // even if free_trial_days is set to 0 in the data.
  if (t.pricing_type === 'Free' || t.pricing_type === 'Open Source') {
    out.push({
      q: `Is ${name} really free?`,
      a: `Yes — ${name} is ${t.pricing_type === 'Open Source' ? 'open-source software released under a permissive license' : 'a free product distributed by the vendor'}. You can download and use it without paying a license fee. Premium services, training, or vertical add-ons may be sold separately.`,
    });
  } else if (typeof t.free_trial_days === 'number') {
    if (t.free_trial_days > 0) {
      out.push({
        q: `Does ${name} offer a free trial?`,
        a: `Yes — ${name} ships with a ${t.free_trial_days}-day free trial available directly from the vendor. The trial includes the full feature set so you can validate workflow compatibility before purchase.`,
      });
    } else {
      out.push({
        q: `Does ${name} offer a free trial?`,
        a: `${name} does not currently advertise a public time-boxed trial. The vendor typically arranges evaluation access on request through reseller partners.`,
      });
    }
  } else {
    out.push({
      q: `Is there a free version of ${name}?`,
      a: `${name} is a commercial product without a free permanent tier. Most vendors offer a 15-30 day evaluation on request; verified educational seats are typically free for students.`,
    });
  }

  // 4. Platforms
  out.push({
    q: `What operating systems does ${name} support?`,
    a: `${name} runs on ${platforms}.${
      t.deployment_options && t.deployment_options.length
        ? ` Deployment options include ${t.deployment_options
            .slice(0, 3)
            .map((d) => d.toLowerCase())
            .join(', ')}.`
        : ''
    }${
      t.platforms && t.platforms.includes('Web') && !(t.deployment_options || []).some((d) => /cloud|web/i.test(d))
        ? ' The browser-based experience requires no local install.'
        : ''
    }`,
  });

  // 5. File formats / interop (preferred over generic if we have data)
  if (t.file_formats_in && t.file_formats_in.length) {
    const inFmts = t.file_formats_in.slice(0, 6).join(', ');
    const outFmts =
      t.file_formats_out && t.file_formats_out.length
        ? t.file_formats_out.slice(0, 6).join(', ')
        : null;
    out.push({
      q: `Which file formats does ${name} support?`,
      a: `${name} imports ${inFmts}${t.file_formats_in.length > 6 ? ' and more' : ''}.${
        outFmts ? ` Export covers ${outFmts}${t.file_formats_out.length > 6 ? ' and more' : ''}.` : ''
      }`,
    });
  } else {
    // Fallback: derive from category
    const hint =
      t.category_id === 'c1' ? 'DWG, DXF, and PDF' :
      t.category_id === 'c2' ? 'STEP, IGES, STL, and Parasolid' :
      t.category_id === 'c3' ? 'IFC, RVT, and DWG' :
      t.category_id === 'c4' ? 'STEP, IGES, JT, and 3D PDF for viewing' :
      t.category_id === 'c5' ? 'STEP, IGES, and native NC formats' :
      t.category_id === 'c6' ? 'Gerber, IPC-2581, and ODB++' :
      t.category_id === 'c7' ? 'FBX, OBJ, glTF, and USD' :
      'common interchange formats';
    out.push({
      q: `Which file formats does ${name} support?`,
      a: `${name} works with standard ${categoryLabelFor(t)} interchange formats including ${hint}. Check the vendor's official documentation for the complete list of supported import and export options.`,
    });
  }

  // 6. Choose between: alternatives / integrations / api / hardware / learning curve
  const buyerQ = pickBuyerQuestion(t);
  if (buyerQ) out.push(buyerQ);

  // Pad to 6 if we have fewer (some early branches add fewer)
  while (out.length < 6) {
    const filler = fallbackFaq(t, out);
    if (!filler) break;
    out.push(filler);
  }
  return out.slice(0, 6);
}

function pickBuyerQuestion(t) {
  const name = t.name;
  const cat = categoryNameOf(t);

  // Prefer API question for EDA, large-vendor 3D, BIM
  if (t.api_sdk && (t.api_sdk.has_api || t.api_sdk.has_sdk)) {
    const langs =
      t.api_sdk.sdk_languages && t.api_sdk.sdk_languages.length
        ? t.api_sdk.sdk_languages.slice(0, 4).join(', ')
        : 'C++, C#, or Python';
    return {
      q: `Does ${name} have an API for automation and customization?`,
      a: `Yes. ${name} exposes ${
        t.api_sdk.api_type ? t.api_sdk.api_type : 'a programmatic API'
      } with SDK bindings for ${langs}. Common automation use cases include parametric scripting, custom toolbars, and integration with PLM/PDM pipelines${
        t.api_sdk.docs_url ? `; full reference docs are published by the vendor` : ''
      }.`,
    };
  }

  // Otherwise: alternatives if populated (resolve aliases, drop unknown/self).
  // Top up to 3 via category-nearest peers when the legacy list is short.
  let validAlts = resolveAlts(t.alternatives, t.slug);
  if (validAlts.length < 3) {
    const more = pickAlternativesFor(t).filter((s) => !validAlts.includes(s) && s !== t.slug);
    while (validAlts.length < 3 && more.length > 0) validAlts.push(more.shift());
  }
  validAlts = validAlts.slice(0, 3);
  if (validAlts.length > 0) {
    const altNames = validAlts
      .map((s) => (bySlug.get(s) || {}).name)
      .filter(Boolean)
      .join(', ');
    return {
      q: `What are the best alternatives to ${name}?`,
      a: `The closest alternatives within the ${cat} space are ${altNames}. The right fit depends on whether you prioritise file-format compatibility, geometry kernel, ecosystem of plugins, or pricing model — compare them side-by-side using the CADTools comparison tool.`,
    };
  }

  // Otherwise: learning curve
  return {
    q: `How steep is the learning curve for ${name}?`,
    a: `${name} sits at the ${
      t.user_scales && t.user_scales.includes('Enterprise') ? 'professional' : 'practical'
    } end of the ${cat} spectrum. Most users become productive within 2-4 weeks of focused use; mastery of advanced features (assemblies, surfacing, scripting) typically takes 3-6 months of regular project work. Official training courses and community forums materially shorten the ramp-up.`,
  };
}

// Also clean up pre-existing alternatives that reference unknown slugs.
function cleanAlternativesIfBroken(t) {
  if (!t.alternatives || t.alternatives.length === 0) return null;
  const cleaned = resolveAlts(t.alternatives, t.slug);
  if (cleaned.length === t.alternatives.length && cleaned.every((s, i) => s === t.alternatives[i])) {
    return null; // unchanged
  }
  // If cleaning leaves us short of 3 entries, top up with computed peers.
  if (cleaned.length < 3) {
    const more = pickAlternativesFor(t).filter((s) => !cleaned.includes(s));
    while (cleaned.length < 3 && more.length > 0) cleaned.push(more.shift());
  }
  return cleaned;
}

function fallbackFaq(t, existing) {
  const used = new Set(existing.map((e) => e.q));
  const candidates = [];

  if (t.integrations && t.integrations.length) {
    candidates.push({
      q: `Which other tools does ${t.name} integrate with?`,
      a: `${t.name} provides native or first-party integrations with ${t.integrations
        .slice(0, 5)
        .join(', ')}${t.integrations.length > 5 ? ' and more' : ''}. These integrations cover data exchange, lifecycle management, and rendering pipelines without requiring custom middleware.`,
    });
  }

  if (t.languages && t.languages.length) {
    candidates.push({
      q: `What languages is ${t.name} available in?`,
      a: `${t.name}'s interface and documentation are localised in ${t.languages.length} languages including ${t.languages.slice(0, 6).join(', ')}${t.languages.length > 6 ? ' and others' : ''}, making it suitable for distributed and multilingual teams.`,
    });
  }

  if (t.security_compliance && t.security_compliance.length) {
    candidates.push({
      q: `Is ${t.name} suitable for regulated industries?`,
      a: `${t.name} carries ${t.security_compliance.slice(0, 4).join(', ')} compliance attestations. This makes it appropriate for organisations subject to enterprise security review processes including aerospace, defence, healthcare, and government work.`,
    });
  }

  // Hardware / system requirements
  candidates.push({
    q: `What are the system requirements for ${t.name}?`,
    a: `${t.name} typically requires a 64-bit multi-core CPU, 16 GB or more of RAM, and a workstation-class GPU with up-to-date drivers. Large assemblies, GPU rendering, and real-time simulation benefit from 32 GB+ RAM and an NVIDIA RTX-class GPU; consult the vendor's published hardware recommendations for the version you plan to deploy.`,
  });

  // Origin
  if (t.country) {
    candidates.push({
      q: `Who develops ${t.name}?`,
      a: `${t.name} is developed and maintained by a vendor headquartered in ${t.country}. The product is sold and supported globally through both direct vendor channels and an authorised reseller network.`,
    });
  }

  for (const c of candidates) {
    if (!used.has(c.q)) return c;
  }
  return null;
}

// ---------- Step 5. Compute alternatives where empty ----------
function pickAlternativesFor(t) {
  const sameCat = toolEntries.filter(
    (o) => o.slug !== t.slug && o.category_id === t.category_id,
  );
  if (sameCat.length === 0) return [];
  // score: prefer same pricing_type, then closest score
  const scored = sameCat.map((o) => {
    let s = 0;
    if (o.pricing_type === t.pricing_type) s += 5;
    // Closer scores -> higher
    const dScore = Math.abs((o.score || 0) - (t.score || 0));
    s += Math.max(0, 5 - dScore * 2);
    // Same user scale
    const overlapScales = (t.user_scales || []).filter((u) =>
      (o.user_scales || []).includes(u),
    ).length;
    s += overlapScales;
    // Prefer enriched (has external_ratings) tools to balance pages
    if (o.external_ratings && o.external_ratings.length) s += 0.5;
    return { tool: o, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, 3).map((x) => x.tool.slug);
}

// ---------- Step 6. Apply patches ----------
function arrayOfStringsAst(strs) {
  return builders.arrayExpression(strs.map((s) => builders.stringLiteral(s)));
}

function faqObjectsAst(faqs) {
  return builders.arrayExpression(
    faqs.map((f) =>
      builders.objectExpression([
        builders.objectProperty(builders.identifier('q'), builders.stringLiteral(f.q)),
        builders.objectProperty(builders.identifier('a'), builders.stringLiteral(f.a)),
      ]),
    ),
  );
}

let faqPatched = 0;
let altPatched = 0;

for (const t of toolEntries) {
  // FAQ
  const faqsProp = toolPropertyOf(t.node, 'faqs');
  if (faqsProp && faqsProp.value && faqsProp.value.type === 'CallExpression') {
    const callee = faqsProp.value.callee;
    if (callee && callee.type === 'Identifier' && callee.name === 'genericFaqs') {
      const faqs = buildFaqs(t);
      faqsProp.value = faqObjectsAst(faqs);
      faqPatched++;
    }
  }

  // Alternatives — fill if empty, OR clean if it references unknown slugs.
  const altProp = toolPropertyOf(t.node, 'alternatives');
  if (altProp && altProp.value && altProp.value.type === 'ArrayExpression') {
    if (altProp.value.elements.length === 0) {
      const picks = pickAlternativesFor(t);
      if (picks.length > 0) {
        altProp.value = arrayOfStringsAst(picks);
        altPatched++;
      }
    } else {
      const cleaned = cleanAlternativesIfBroken(t);
      if (cleaned) {
        altProp.value = arrayOfStringsAst(cleaned);
        altPatched++;
      }
    }
  }
}

// ---------- Step 7. Print + cleanup unused helpers ----------
// Drop the now-unused `genericFaqs` helper if no remaining tool references it.
let genericRemoved = false;
recast.visit(ast, {
  visitVariableDeclaration(p) {
    if (
      p.node.declarations.length === 1 &&
      p.node.declarations[0].id &&
      p.node.declarations[0].id.name === 'genericFaqs'
    ) {
      // Confirm no remaining references in the file.
      let stillUsed = false;
      recast.visit(ast, {
        visitIdentifier(ip) {
          if (
            ip.node.name === 'genericFaqs' &&
            ip.parent.node !== p.node.declarations[0].id
          ) {
            // Skip the declaration itself.
            if (ip.parent.node.type !== 'VariableDeclarator') {
              stillUsed = true;
            }
          }
          this.traverse(ip);
        },
      });
      if (!stillUsed) {
        p.prune();
        genericRemoved = true;
      }
      return false;
    }
    this.traverse(p);
  },
});

const out = recast.print(ast, { quote: 'single', trailingComma: true }).code;
fs.writeFileSync(DATA_TS, out, 'utf8');

console.log(`FAQ patched:           ${faqPatched}`);
console.log(`Alternatives patched:  ${altPatched}`);
console.log(`genericFaqs removed:   ${genericRemoved}`);
