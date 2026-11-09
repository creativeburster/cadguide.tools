// Cloudflare Pages Function: intercept deleted URLs and return 410 Gone
// This tells Google to permanently de-index these pages instead of recrawling them.
// Also blocks resource-draining SEO/analytics crawlers — the robots.txt Disallow
// for these agents is advisory only and ignored by misbehaving bots.

const BLOCKED_USER_AGENTS = [
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'blexbot',
  'mj12bot',
  'megaindex',
  'dataforseobot',
  'bytespider',
  'petalbot',
  'baiduspider',
];

// Active curated comparison paths (80 pairs)
const VALID_COMPARE_PATHS = new Set([
  "/compare/autocad-vs-bricscad",
  "/compare/autocad-vs-draftsight",
  "/compare/autocad-vs-zwcad",
  "/compare/autocad-vs-gstarcad",
  "/compare/autocad-vs-microstation",
  "/compare/autocad-vs-librecad",
  "/compare/bricscad-vs-draftsight",
  "/compare/bricscad-vs-zwcad",
  "/compare/gstarcad-vs-zwcad",
  "/compare/bricscad-vs-gstarcad",
  "/compare/draftsight-vs-zwcad",
  "/compare/autocad-vs-nanocad",
  "/compare/bricscad-vs-nanocad",
  "/compare/nanocad-vs-zwcad",
  "/compare/librecad-vs-qcad",
  "/compare/freecad-vs-librecad",
  "/compare/autocad-vs-revit",
  "/compare/autocad-vs-civil-3d",
  "/compare/autodesk-inventor-vs-solidworks",
  "/compare/ptc-creo-vs-solidworks",
  "/compare/fusion-360-vs-solidworks",
  "/compare/onshape-vs-solidworks",
  "/compare/solid-edge-vs-solidworks",
  "/compare/catia-vs-solidworks",
  "/compare/siemens-nx-vs-solidworks",
  "/compare/freecad-vs-solidworks",
  "/compare/solidcam-vs-solidworks",
  "/compare/autodesk-inventor-vs-solid-edge",
  "/compare/autodesk-inventor-vs-fusion-360",
  "/compare/catia-vs-siemens-nx",
  "/compare/catia-vs-ptc-creo",
  "/compare/ptc-creo-vs-siemens-nx",
  "/compare/blender-vs-maya",
  "/compare/3ds-max-vs-blender",
  "/compare/blender-vs-rhino-3d",
  "/compare/rhino-3d-vs-sketchup",
  "/compare/matrixgold-vs-rhino-3d",
  "/compare/rhino-3d-vs-shapr3d",
  "/compare/sketchup-vs-tinkercad",
  "/compare/openscad-vs-tinkercad",
  "/compare/fusion-360-vs-onshape",
  "/compare/fusion-360-vs-shapr3d",
  "/compare/onshape-vs-shapr3d",
  "/compare/freecad-vs-fusion-360",
  "/compare/blender-vs-freecad",
  "/compare/archicad-vs-revit",
  "/compare/revit-vs-vectorworks",
  "/compare/revit-vs-sketchup",
  "/compare/archicad-vs-vectorworks",
  "/compare/archicad-vs-sketchup",
  "/compare/sketchup-vs-vectorworks",
  "/compare/revit-vs-tekla-structures",
  "/compare/chief-architect-vs-revit",
  "/compare/chief-architect-vs-sketchup",
  "/compare/archicad-vs-chief-architect",
  "/compare/bluebeam-revu-vs-navisworks",
  "/compare/fusion-360-vs-mastercam",
  "/compare/hypermill-vs-mastercam",
  "/compare/mastercam-vs-solidworks",
  "/compare/mastercam-vs-solidcam",
  "/compare/ansys-fluent-vs-comsol-multiphysics",
  "/compare/abaqus-vs-ansys-mechanical",
  "/compare/altium-designer-vs-kicad",
  "/compare/eagle-vs-kicad",
  "/compare/altium-designer-vs-orcad",
  "/compare/altium-365-vs-altium-designer",
  "/compare/altium-designer-vs-eagle",
  "/compare/kicad-vs-orcad",
  "/compare/easyeda-vs-kicad",
  "/compare/eplan-electric-p8-vs-kicad",
  "/compare/altium-designer-vs-eplan-electric-p8",
  "/compare/lumion-vs-twinmotion",
  "/compare/enscape-vs-lumion",
  "/compare/enscape-vs-twinmotion",
  "/compare/corona-renderer-vs-v-ray",
  "/compare/twinmotion-vs-v-ray",
  "/compare/prusaslicer-vs-ultimaker-cura",
  "/compare/bambu-studio-vs-ultimaker-cura",
  "/compare/bambu-studio-vs-prusaslicer",
  "/compare/clo-3d-vs-marvelous-designer"
]);

// 66 permanently removed tool slugs (returns 410 Gone for /tools/:slug, /alternatives/:slug, /pricing/:slug)
const REMOVED_TOOL_SLUGS = new Set([
  "leica-cyclone",
  "cadvision",
  "actcad",
  "arcsite",
  "cadian",
  "cadopia",
  "cadra",
  "ijcad",
  "medusa4",
  "rootpro-cad",
  "updraw",
  "uvcad",
  "v-nas",
  "think3",
  "t-flex-cad",
  "varicad",
  "crowncad",
  "ironcad",
  "keycreator",
  "bimoffice",
  "eberick",
  "edificius",
  "edilus",
  "hicad",
  "tekton3d",
  "renga",
  "model-studio-cs",
  "beckercad",
  "cadmeister",
  "metacam",
  "oofelie",
  "sinovation",
  "woodwop",
  "esi-visual-environment",
  "lusas",
  "opencascade",
  "target-3001",
  "quadcept",
  "cr-8000",
  "pulsonix",
  "synopsys-fusion-compiler",
  "foran",
  "napa",
  "shipconstructor",
  "icad3d-plus",
  "imos-ix",
  "kd-max",
  "palette-cad",
  "pc-schematic",
  "promine",
  "pytha",
  "rhinogold",
  "shoemaster",
  "wysiwyg",
  "jewelcad-pro",
  "3design",
  "exocad",
  "lectra-modaris",
  "optitex",
  "browzwear",
  "gerber-accumark",
  "cabinet-vision",
  "promob",
  "pconplanner",
  "land-fx",
  "20-20-design"
]);

// Additional specific deleted paths
const GONE_PATHS = new Set([
  "/licensing",
  "/sitemap-guides.xml",
  "/opengraph-image?2a9887d061e4717c",
  "/opengraph-image?6326e64b2f6d9251",
  "/tools/autodesk-construction-cloud/opengraph-image?fd68c87673cbe7f5",
  "/tools/catia/opengraph-image?dde98c4133b54de0",
  "/tools/glovius/opengraph-image?dde98c4133b54de0",
  "/tools/tinkercad/opengraph-image?dde98c4133b54de0",
  "/tools/uvcad/opengraph-image?dde98c4133b54de0",
  "/tools/varicad/opengraph-image?dde98c4133b54de0"
]);

// High-authority inbound backlink redirects (Zenodo DOIs, Dev.to articles, ReadTheDocs, and engineering forums)
// Must be intercepted with a 301 Permanent Redirect BEFORE any 410 Gone check so link equity is 100% preserved.
const BACKLINK_301_REDIRECTS = new Map([
  // 1. Authoritative /guides/* targets cited in Zenodo DOIs & Dev.to technical articles
  ["/guides", "/toolbox"],
  ["/guides/solidworks-workstation-hw-procurement-guide", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/guides/revit-workstation-hw-procurement-tco", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/guides/multi-layer-pcb-impedance-profile-stackup", "/toolbox/wire-gauge-awg-calculator"],
  ["/guides/revit-worksharing-wizard", "/toolbox/revit-worksharing-wizard"],
  ["/guides/repair-imported-step-iges-knit-surface", "/toolbox/online-step-iges-mutual-converter"],
  ["/guides/solidworks-step-import-defeature-and-healing-workflow", "/toolbox/online-sldprt-to-step-converter"],
  ["/guides/solidworks-large-assembly-performance", "/toolbox/solidworks-crash-diagnostic-wizard"],
  ["/guides/freecad-topological-naming-problem-mitigation-2026", "/tools/freecad"],
  ["/guides/autodesk-vault-vs-solidworks-pdm-enterprise-comparison", "/compare/autodesk-inventor-vs-solidworks"],
  ["/guides/bim-ifc4-geometry-validation", "/toolbox/online-ifc-viewer-validator"],
  ["/guides/autocad-lt-hardware-acceleration-greyed-out-fix", "/toolbox/autocad-display-graphics-wizard"],
  ["/guides/step-file-header-format", "/toolbox/step-file-header-parser"],

  // 2. Legacy /calculators/* and /calculator/* short paths used in forum profiles & posts
  ["/calculator/hardware", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/calculators/workstation-spec", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/calculators/hardware", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/calculators/dwg-compatibility", "/toolbox/dwg-version-checker"],
  ["/calculators/k-factor", "/toolbox/k-factor-calculator"],
  ["/calculators/sheet-metal-k-factor", "/toolbox/k-factor-calculator"],
  ["/calculators/cnc-speeds-feeds", "/toolbox/turning-speeds-feeds-calculator"],
  ["/calculators/machining-speed-feed", "/toolbox/turning-speeds-feeds-calculator"],
  ["/calculators/tolerance", "/toolbox/tolerance-stackup-calculator"],
  ["/calculators/trace-impedance", "/toolbox/wire-gauge-awg-calculator"],
  ["/calculators/3d-print-tolerances", "/toolbox/3d-printing-chordal-deviation"],
  ["/calculators/cad-cloud-cost", "/toolbox/cad-license-tco-calculator"],
  ["/calculators/cad-license-cost", "/toolbox/cad-license-tco-calculator"],
  ["/calculators/license-cost", "/toolbox/cad-license-tco-calculator"],
  ["/calculators/cloud-render", "/toolbox/3d-print-cost-time-estimator"],
  ["/calculators/rendering-time", "/toolbox/3d-print-cost-time-estimator"],

  // 3. Shortened /toolbox/*, /convert/*, and root-level alias paths from external publications
  ["/toolbox/acad-pgp-editor", "/toolbox/acad-pgp-alias-editor"],
  ["/toolbox/concurrent-license-calculator", "/toolbox/flexlm-concurrent-seats-queue"],
  ["/toolbox/flexlm-concurrent-license-calculator", "/toolbox/flexlm-concurrent-seats-queue"],
  ["/toolbox/gcode", "/toolbox/gcode-quick-reference-sheet"],
  ["/toolbox/gcode-viewer", "/toolbox/gcode-toolpath-visualizer"],
  ["/toolbox/hardware-benchmark", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/toolbox/hardware-calculator", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/toolbox/workstation-recommender", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/toolbox/sheet-metal-calculator", "/toolbox/sheet-metal-bend-calculator"],
  ["/convert/dwg-to-dxf", "/toolbox/online-dwg-to-dxf-batch-converter"],
  ["/standards", "/toolbox/drawing-standards-comparison-reference"],
  ["/workstation-hardware", "/toolbox/cad-hardware-workstation-spec-builder"],
  ["/dwg-magic-bytes", "/toolbox/dwg-version-checker"],
  ["/sheet-metal-kfactor", "/toolbox/k-factor-calculator"],
  ["/step-to-stl-manifold-kfactor-2026", "/toolbox/stl-mesh-checker"],
  ["/asme-y145-gdt-autolisp-automation-2026", "/toolbox/true-position-calculator"],
]);

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  const userAgent = (context.request.headers.get('user-agent') || '').toLowerCase();
  if (BLOCKED_USER_AGENTS.some(ua => userAgent.includes(ua))) {
    return new Response('Access Denied: Your bot is blocked to conserve server resources.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 0. 301 Redirect any known external backlink target path to its canonical live 200 OK page
  const redirectTarget = BACKLINK_301_REDIRECTS.get(path);
  if (redirectTarget) {
    return Response.redirect(`${url.origin}${redirectTarget}`, 301);
  }

  // 1. All /guides and /guides/* paths have been permanently decommissioned — return 410 Gone
  const isGuidesPath = path === '/guides' || path.startsWith('/guides/');

  // 2. Any legacy /compare/:pair that is no longer in the curated 80 comparison pairs — return 410 Gone
  const isRemovedComparePath = path.startsWith('/compare/') && !VALID_COMPARE_PATHS.has(path);

  // 3. Any removed tool under /tools/:slug, /alternatives/:slug, or /pricing/:slug — return 410 Gone
  let isRemovedToolPath = false;
  if (path.startsWith('/tools/') || path.startsWith('/alternatives/') || path.startsWith('/pricing/')) {
    const parts = path.split('/');
    if (parts.length >= 3 && REMOVED_TOOL_SLUGS.has(parts[2])) {
      isRemovedToolPath = true;
    }
  }

  if (GONE_PATHS.has(path) || GONE_PATHS.has(path + url.search) || isGuidesPath || isRemovedComparePath || isRemovedToolPath) {
    return new Response(
      `<!DOCTYPE html>
<html lang="en-US">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>410 Gone</title></head>
<body>
<h1>410 Gone</h1>
<p>This page has been permanently removed and will not return.</p>
<p><a href="/">Return to CADGuide.tools</a></p>
</body>
</html>`,
      {
        status: 410,
        headers: {
          "Content-Type": "text/html;charset=UTF-8",
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  }

  // Pass through to static assets and neutralize Cloudflare Rocket Loader on all <script> tags
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html") && typeof HTMLRewriter !== "undefined") {
    return new HTMLRewriter()
      .on("script", {
        element(el) {
          if (!el.hasAttribute("data-cfasync")) {
            el.setAttribute("data-cfasync", "false");
          }
        },
      })
      .transform(response);
  }
  return response;
}
