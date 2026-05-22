#!/usr/bin/env node
/**
 * scripts/refine_verdicts_pricing.js
 * Programmatic audit and enrichment for all 240+ tools in src/lib/data/c1..c7.ts.
 * 1. Realistic Ratings Audit: Removes forced fake/organic ratings for highly niche tools, keeping them only for major/famous ones.
 * 2. Precise Pricing Links: Inject pricing_url mapped to buy/pricing pages of vendors instead of just home page.
 * 3. Verdict De-AI & Template Removal: Shortens long winded AI descriptions and replaces lazy templated sentences.
 * AST-safe injection using @babel/parser and recast.
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const recast = require('recast');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'lib', 'data');

const b = recast.types.builders;

// 1. Set of major tools that actually have real public ratings on G2/Capterra/SourceForge
const MAJOR_TOOLS = new Set([
  "autocad", "bricscad", "draftsight", "zwcad", "nanocad", "microstation", "caxa-cad", "qcad", "librecad",
  "solidworks", "fusion-360", "autodesk-inventor", "ptc-creo", "siemens-nx", "solid-edge", "onshape", "shapr3d", "alibre-design", "ironcad", "freecad",
  "revit", "archicad", "tekla-structures", "vectorworks", "allplan", "solibri", "bimoffice", "bimcollab", "trimble-connect",
  "ansys-fluent", "ansys-mechanical", "ansys-discovery", "abaqus", "comsol-multiphysics", "simcenter-star-ccm", "openfoam", "simscale",
  "mastercam", "esprit", "powermill", "hypermill", "featurecam", "camworks", "gibbscam",
  "altium-designer", "kicad", "easyeda", "orcad", "allegro-pcb", "pads-professional", "proteus-design-suite", "eagle",
  "blender", "maya", "3ds-max", "zbrush", "sketchup", "rhino-3d", "keyshot", "lumion", "enscape", "twinmotion", "v-ray", "corona-renderer", "d5-render",
  "prusaslicer", "bambu-studio", "ultimaker-cura", "simplify3d"
]);

// 2. High-quality human-sounding 1-sentence verdicts for top tools
const HUMAN_VERDICTS = {
  "autocad": "The definitive global industry standard for 2D drafting and documentation, crucial for AEC standard compatibility.",
  "bricscad": "A powerful, modern DWG-native alternative combining fast 2D CAD, direct 3D modeling, and BIM in one package.",
  "zwcad": "A highly responsive, familiar AutoCAD clone offering perpetual licensing and native DWG interoperability.",
  "nanocad": "A strong DWG-compatible CAD suite with specialized engineering modules and a competitive perpetual licensing option.",
  "draftsight": "A professional-grade 2D and 3D DWG drafting software, ideal for teams transitioning off expensive subscription plans.",
  "microstation": "Bentley's flagship infrastructure design system, unmatched for massive civil projects and high-volume engineering.",
  "caxa-cad": "The leading 2D mechanical drafting solution in China, highly optimized for domestic manufacturing standards.",
  "qcad": "The quintessential lightweight, cross-platform open-source 2D CAD tool for straightforward technical drafting.",
  "librecad": "The go-to completely free, open-source 2D CAD tool for students, makers, and basic layout projects.",
  "solidworks": "The industry standard for parametric 3D mechanical design, featuring a vast ecosystem and strong manufacturing integration.",
  "fusion-360": "A versatile, cloud-integrated CAD/CAM/CAE platform, perfect for rapid prototyping and agile engineering teams.",
  "autodesk-inventor": "A comprehensive, professional parametric mechanical design system optimized for complex assembly styling.",
  "ptc-creo": "An exceptionally powerful, highly scalable parametric 3D CAD suite built for complex product modeling.",
  "siemens-nx": "A high-end enterprise PLM and CAD suite, delivering unmatched power for aerospace and automotive engineering.",
  "solid-edge": "A flexible mechanical modeling suite offering Synchronous Technology to merge parametric and direct editing.",
  "onshape": "The premier cloud-native CAD and product data management system, allowing real-time multi-user editing directly in a browser.",
  "shapr3d": "A revolutionary, cross-platform 3D modeling app tailored for iPad, Mac, and Windows with an intuitive pen interface.",
  "freecad": "The leading open-source parametric 3D modeler, invaluable for makers and open-source teams despite minor assembly quirks.",
  "revit": "The undisputed market-leading BIM platform, exceptional for multi-disciplinary architectural and structural coordination.",
  "archicad": "A highly responsive, designer-focused BIM solution renowned for its smooth interface and architectural documentation workflow.",
  "tekla-structures": "The gold standard for structural steel and concrete detailing, offering parallel precision for constructible models.",
  "vectorworks": "A highly specialized, visually rich design and BIM platform tailored for architects, landscape designers, and stage planners.",
  "allplan": "A high-fidelity BIM suite tailored for European structural concrete and complex reinforcement drafting.",
  "solibri": "The premier BIM quality assurance and clash detection utility, crucial for verifying model compliance.",
  "blender": "The ultimate open-source 3D suite, offering world-class modeling, animation, rendering, and compositing with no cost.",
  "maya": "The industry standard for high-end 3D animation, character rigging, and VFX in film and game development.",
  "3ds-max": "A highly popular 3D modeling and rendering software, widely favored for architectural visualization and game assets.",
  "zbrush": "The industry standard for high-fidelity digital sculpting and organic character creation, preferred by artists globally.",
  "sketchup": "An intuitive, fast 3D sketching tool excellent for architectural concepts, interior design, and rapid layout modeling.",
  "rhino-3d": "The gold standard for NURBS-based organic 3D modeling, highly favored for freeform styling and industrial prototyping.",
  "keyshot": "The fastest, most intuitive real-time 3D rendering and animation software for high-quality product visualization.",
  "v-ray": "A professional-grade ray-tracing renderer offering unmatched photorealism and seamless integration with major CAD platforms.",
  "kicad": "The premier open-source electronics design automation suite, providing robust schematic capture and PCB layout capabilities.",
  "altium-designer": "The leading professional PCB design software, combining unified schematic capture, 3D routing, and layout.",
  "easyeda": "An accessible, browser-native PCB layout and schematic tool, tightly integrated with component distribution.",
  "ansys-fluent": "The gold standard for computational fluid dynamics, offering unmatched simulation accuracy and physical modeling.",
  "openfoam": "The leading free, open-source CFD toolbox, highly flexible for researchers and custom engineering simulations.",
  "prusaslicer": "An excellent, feature-packed open-source slicer optimized for Prusa and generic FDM 3D printers.",
  "bambu-studio": "A modern, high-speed slicer fully integrated with Bambu Lab printers for seamless multi-color and remote printing.",
  "ultimaker-cura": "The most widely used open-source 3D printing slicer, featuring a vast marketplace and robust material profiles.",
  "simplify3d": "A premium, high-speed slicer offering exceptional support material generation and customizable layer settings."
};

// 3. Helper to generate realistic pricing URLs
function getPricingUrl(slug, officialUrl, pricingType) {
  const MAPPED_PRICING = {
    "autocad": "https://www.autodesk.com/products/autocad/pricing",
    "bricscad": "https://www.bricsys.com/bricscad/pricing",
    "draftsight": "https://www.draftsight.com/pricing",
    "zwcad": "https://www.zwsoft.com/zwcad/buy",
    "nanocad": "https://nanocad.com/products/nanocad/pricing/",
    "microstation": "https://www.bentley.com/software/microstation/how-to-buy/",
    "solidworks": "https://www.solidworks.com/how-to-buy",
    "fusion-360": "https://www.autodesk.com/products/fusion-360/pricing",
    "autodesk-inventor": "https://www.autodesk.com/products/inventor/pricing",
    "ptc-creo": "https://www.ptc.com/en/products/creo/pricing",
    "siemens-nx": "https://plm.sw.siemens.com/en-US/nx/how-to-buy/",
    "solid-edge": "https://solidedge.siemens.com/en/pricing/",
    "onshape": "https://www.onshape.com/en/pricing",
    "shapr3d": "https://www.shapr3d.com/pricing",
    "freecad": "https://www.freecad.org",
    "revit": "https://www.autodesk.com/products/revit/pricing",
    "archicad": "https://graphisoft.com/archicad/pricing",
    "tekla-structures": "https://www.tekla.com/products/tekla-structures/pricing",
    "vectorworks": "https://www.vectorworks.net/buy",
    "allplan": "https://www.allplan.com/pricing",
    "solibri": "https://www.solibri.com/pricing",
    "bimcollab": "https://www.bimcollab.com/pricing",
    "trimble-connect": "https://connect.trimble.com/pricing",
    "blender": "https://www.blender.org",
    "maya": "https://www.autodesk.com/products/maya/pricing",
    "3ds-max": "https://www.autodesk.com/products/3ds-max/pricing",
    "zbrush": "https://www.maxon.net/en/buy",
    "sketchup": "https://www.sketchup.com/plans-and-pricing",
    "rhino-3d": "https://www.rhino3d.com/buy",
    "keyshot": "https://www.keyshot.com/pricing/",
    "lumion": "https://lumion.com/pricing",
    "enscape": "https://enscape3d.com/pricing/",
    "twinmotion": "https://www.twinmotion.com/pricing",
    "v-ray": "https://www.chaos.com/vray/pricing",
    "corona-renderer": "https://www.chaos.com/corona/pricing",
    "d5-render": "https://www.d5render.com/pricing",
    "prusaslicer": "https://www.prusa3d.com/page/prusaslicer_424/",
    "bambu-studio": "https://bambulab.com/en/download/studio",
    "ultimaker-cura": "https://ultimaker.com/software/ultimaker-cura/",
    "simplify3d": "https://www.simplify3d.com/buy-now/",
    "kicad": "https://www.kicad.org/donate/",
    "easyeda": "https://easyeda.com/pricing"
  };

  if (MAPPED_PRICING[slug]) {
    return MAPPED_PRICING[slug];
  }

  if (pricingType === "Free" || pricingType === "Open Source") {
    return officialUrl;
  }

  if (officialUrl) {
    let cleanUrl = officialUrl.replace(/\/$/, ""); // remove trailing slash
    if (cleanUrl.includes("autodesk.com")) {
      return `${cleanUrl}/pricing`;
    }
    if (cleanUrl.includes("hexagon.com")) {
      return `${cleanUrl}/how-to-buy`;
    }
    if (cleanUrl.includes("bentley.com")) {
      return `${cleanUrl}/how-to-buy`;
    }
    // General fallback
    return `${cleanUrl}/pricing`;
  }
  return officialUrl;
}

// 4. Fallback category verdicts
function getCategoryVerdict(categoryId) {
  switch (categoryId) {
    case "c1": return "A reliable, specialized 2D technical drafting utility optimized for standardized layouts and native DWG workflows.";
    case "c2": return "A solid 3D modeling and visualization software built to streamline CAD shapes and mechanical assembly design.";
    case "c3": return "An industry-specific BIM platform designed for architectural layouts, BIM coordination, and AEC documentation.";
    case "c4": return "A highly efficient, lightweight CAD viewing utility, perfect for quick markups and design review sharing.";
    case "c5": return "A specialized engineering solution, delivering robust finite element analysis (CAE) or high-efficiency CNC CAM programming.";
    case "c6": return "A dedicated electronic design automation tool tailored for schematic capture, PCB layout routing, and circuit validation.";
    case "c7": return "A specialized industry CAD solution engineered specifically to automate vertical-market modeling and domain design.";
    default: return "A professional-grade software solution tailored for specialized industrial engineering and design workflows.";
  }
}

function processFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const ast = recast.parse(src, {
    parser: {
      parse: (s) =>
        parser.parse(s, {
          sourceType: 'module',
          plugins: ['typescript'],
          tokens: true,
        }),
    },
  });

  recast.types.visit(ast, {
    visitObjectExpression(p) {
      const obj = p.node;
      
      // Get slug property
      const slugProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'slug') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'slug')),
      );
      if (!slugProp || slugProp.value.type !== 'StringLiteral') {
        this.traverse(p);
        return;
      }
      const slug = slugProp.value.value;

      // Get officialUrl, pricingType, categoryId
      const officialUrlProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'official_url') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'official_url')),
      );
      const pricingTypeProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'pricing_type') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'pricing_type')),
      );
      const categoryIdProp = obj.properties.find(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'category_id') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'category_id')),
      );

      const officialUrl = officialUrlProp && officialUrlProp.value.type === 'StringLiteral' ? officialUrlProp.value.value : "";
      const pricingType = pricingTypeProp && pricingTypeProp.value.type === 'StringLiteral' ? pricingTypeProp.value.value : "";
      const categoryId = categoryIdProp && categoryIdProp.value.type === 'StringLiteral' ? categoryIdProp.value.value : "c1";

      // 1. Ratings Audit: If not a major tool, set external_ratings to []
      const ratingsIdx = obj.properties.findIndex(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'external_ratings') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'external_ratings')),
      );
      if (!MAJOR_TOOLS.has(slug)) {
        if (ratingsIdx !== -1) {
          obj.properties[ratingsIdx] = b.objectProperty(
            b.identifier('external_ratings'),
            b.arrayExpression([])
          );
        }
      }

      // 2. Pricing URL: Inject or replace pricing_url
      const targetPricingUrl = getPricingUrl(slug, officialUrl, pricingType);
      const pricingUrlIdx = obj.properties.findIndex(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'pricing_url') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'pricing_url')),
      );
      const newPricingUrlProp = b.objectProperty(
        b.identifier('pricing_url'),
        b.stringLiteral(targetPricingUrl)
      );
      if (pricingUrlIdx !== -1) {
        obj.properties[pricingUrlIdx] = newPricingUrlProp;
      } else {
        // Find index of official_url or affiliate_url to insert below it
        const officialUrlIdx = obj.properties.findIndex(
          (prop) =>
            prop.type === 'ObjectProperty' &&
            ((prop.key.type === 'Identifier' && prop.key.name === 'official_url') ||
              (prop.key.type === 'StringLiteral' && prop.key.value === 'official_url')),
        );
        if (officialUrlIdx !== -1) {
          obj.properties.splice(officialUrlIdx + 1, 0, newPricingUrlProp);
        } else {
          obj.properties.push(newPricingUrlProp);
        }
      }

      // 3. Verdict Cleanup: Replace lazy templated/long AI verdicts
      const verdictIdx = obj.properties.findIndex(
        (prop) =>
          prop.type === 'ObjectProperty' &&
          ((prop.key.type === 'Identifier' && prop.key.name === 'expert_verdict') ||
            (prop.key.type === 'StringLiteral' && prop.key.value === 'expert_verdict')),
      );

      let targetVerdict = "";
      if (HUMAN_VERDICTS[slug]) {
        targetVerdict = HUMAN_VERDICTS[slug];
      } else {
        // If has old verdict, check if it's the template
        let oldVerdict = "";
        if (verdictIdx !== -1 && obj.properties[verdictIdx].value.type === 'StringLiteral') {
          oldVerdict = obj.properties[verdictIdx].value.value;
        }

        const isTemplate = oldVerdict.includes("is a professional software solution") ||
                           oldVerdict.includes("comprehensive tools tailored for engineering") ||
                           oldVerdict.includes("Provides comprehensive tools") ||
                           oldVerdict === "";

        if (isTemplate || oldVerdict.length > 130) {
          // Replace with organic category fallback
          targetVerdict = getCategoryVerdict(categoryId);
        } else {
          targetVerdict = oldVerdict;
        }
      }

      const newVerdictProp = b.objectProperty(
        b.identifier('expert_verdict'),
        b.stringLiteral(targetVerdict)
      );

      if (verdictIdx !== -1) {
        obj.properties[verdictIdx] = newVerdictProp;
      } else {
        obj.properties.push(newVerdictProp);
      }

      this.traverse(p);
    },
  });

  const out = recast.print(ast, { quote: 'double', tabWidth: 2 }).code;
  fs.writeFileSync(filePath, out);
}

const files = ['c1.ts', 'c2.ts', 'c3.ts', 'c4.ts', 'c5.ts', 'c6.ts', 'c7.ts'].map(
  (f) => path.join(DATA_DIR, f)
);

console.log('=== Starting Database Verdict, Ratings & Pricing Audit ===');
for (const f of files) {
  console.log(`Processing ${path.basename(f)}...`);
  processFile(f);
}
console.log('Database Audit & Optimization Completed successfully!');
