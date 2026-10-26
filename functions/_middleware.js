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
