const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FEATURE_MAP = {
  "bricscad": ["ai-assisted", "sheet-metal", "bim-integration", "direct-modeling", "drafting-detailing"],
  "autocad": ["ai-assisted", "piping-routing", "drafting-detailing"],
  "fusion-360": ["ai-assisted", "cloud-collaboration", "parametric-modeling", "rendering", "sheet-metal", "generative-design", "reverse-engineering", "integrated-cam", "simulation-fea", "subdivision-modeling", "direct-modeling", "mesh-modeling", "surface-modeling"],
  "ansys-discovery": ["ai-assisted", "generative-design", "simulation-fea"],
  "altair-inspire": ["ai-assisted", "generative-design"],
  "solidworks": ["ai-assisted", "parametric-modeling", "rendering", "sheet-metal", "generative-design", "reverse-engineering", "integrated-cam", "simulation-fea", "piping-routing", "surface-modeling"],
  "shapr3d": ["ai-assisted", "parametric-modeling", "reverse-engineering", "subdivision-modeling", "direct-modeling"],
  "onshape": ["cloud-collaboration", "parametric-modeling"],
  "easyeda": ["cloud-collaboration"],
  "altium-designer": ["cloud-collaboration"],
  "revit": ["cloud-collaboration", "bim-integration", "piping-routing"],
  "archicad": ["cloud-collaboration", "bim-integration"],
  "ptc-creo": ["parametric-modeling", "sheet-metal", "generative-design", "simulation-fea", "piping-routing", "surface-modeling"],
  "autodesk-inventor": ["parametric-modeling", "sheet-metal", "simulation-fea", "piping-routing"],
  "freecad": ["parametric-modeling"],
  "siemens-nx": ["parametric-modeling", "generative-design", "reverse-engineering", "simulation-fea", "mesh-modeling", "piping-routing", "surface-modeling"],
  "lumion": ["rendering"],
  "twinmotion": ["rendering"],
  "enscape": ["rendering"],
  "v-ray": ["rendering"],
  "blender": ["rendering", "subdivision-modeling", "mesh-modeling"],
  "sketchup": ["rendering", "direct-modeling"],
  "3ds-max": ["rendering", "subdivision-modeling", "mesh-modeling"],
  "solid-edge": ["sheet-metal", "simulation-fea", "direct-modeling", "piping-routing"],
  "ntop": ["generative-design"],
  "geomagic-design-x": ["reverse-engineering", "mesh-modeling"],
  "rhino-3d": ["reverse-engineering", "subdivision-modeling", "direct-modeling", "mesh-modeling", "surface-modeling"],
  "mastercam": ["integrated-cam"],
  "solidcam": ["integrated-cam"],
  "camworks": ["integrated-cam"],
  "hypermill": ["integrated-cam"],
  "cimatron": ["integrated-cam"],
  "zw3d": ["integrated-cam", "mesh-modeling"],
  "ansys-fluent": ["simulation-fea"],
  "comsol-multiphysics": ["simulation-fea"],
  "abaqus": ["simulation-fea"],
  "ansys-mechanical": ["simulation-fea"],
  "maya": ["subdivision-modeling", "mesh-modeling"],
  "vectorworks": ["bim-integration"],
  "tekla-structures": ["bim-integration"],
  "spaceclaim": ["direct-modeling"],
  "meshlab": ["mesh-modeling"],
  "microstation": ["piping-routing", "drafting-detailing"],
  "catia": ["surface-modeling"],
  "alias": ["surface-modeling"],
  "draftsight": ["drafting-detailing"],
  "zwcad": ["drafting-detailing"],
  "gstarcad": ["drafting-detailing"],
  "qcad": ["drafting-detailing"],
  "librecad": ["drafting-detailing"],
};

function parseTsFile(filePath, varName, regexToReplace) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Strip import statements
  const cleanContent = content.replace(/^import\s+.*$/gm, '');
  // Replace export statement with simple variable declaration
  const code = cleanContent.replace(regexToReplace, `const ${varName} =`) + `\n; ${varName};`;
  
  const context = vm.createContext({
    getLogo: (key) => `/logos/${key.toLowerCase()}.png`
  });
  return vm.runInContext(code, context);
}

// 1. Load Categories
const categoriesPath = path.join(__dirname, '../src/lib/data/categories.ts');
const categories = parseTsFile(categoriesPath, 'categories', /export const categories: Category\[\] =/);

const categoryMap = {};
categories.forEach(c => {
  categoryMap[c.id] = c.name;
});

// 2. Load Tools
const allTools = [];
for (let i = 1; i <= 7; i++) {
  const filePath = path.join(__dirname, `../src/lib/data/c${i}.ts`);
  const regex = new RegExp(`export const c${i}Tools: Tool\\[\\] =`);
  const tools = parseTsFile(filePath, 'tools', regex);
  allTools.push(...tools);
}

// 3. Compile Search Index
const searchIndex = allTools.map(t => {
  const features = FEATURE_MAP[t.slug] || [];
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    short_desc: t.short_desc || '',
    score: t.score || 0,
    logo_url: t.logo_url || '',
    official_url: t.official_url || '',
    category_id: t.category_id,
    category_name: categoryMap[t.category_id] || '',
    aliases: t.aliases || [],
    industries: t.industries || [],
    features: features
  };
});

// Sort using the same logic as in data.ts
const EXT_ORDER = [
  'ext-infraworks',
  'ext-3ds-max',
  'ext-zbrush',
  'ext-keyshot',
  'ext-lumion',
  'ext-enscape',
  'ext-twinmotion',
];

function orderKey(id) {
  if (id.startsWith('t') && !id.startsWith('ext-')) {
    const n = parseInt(id.slice(1), 10);
    return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
  }
  if (id.startsWith('ext-')) {
    const idx = EXT_ORDER.indexOf(id);
    return 1000000 + (idx >= 0 ? idx : EXT_ORDER.length);
  }
  return Number.MAX_SAFE_INTEGER;
}

searchIndex.sort((a, b) => orderKey(a.id) - orderKey(b.id));

// 4. Save Search Index
const outputPath = path.join(__dirname, '../src/lib/search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf8');
console.log(`Successfully generated lightweight search index with ${searchIndex.length} tools at ${outputPath}`);
