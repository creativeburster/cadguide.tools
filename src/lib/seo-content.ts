// Step 5 — Long-tail SEO content pages.
//
// Two page types live here:
//   1. Category best-of pages    -> /best/<category-slug>
//   2. Tool-vs-tool comparisons  -> /compare/<a-vs-b>
//
// This module owns the data shape & generation logic so both page
// routes and the sitemap can import a single source of truth.
import { categories, tools, getToolBySlug } from "./data";
import type { Tool, Category } from "./data";

/** ---------- Best-of ranking --------------------------------------- */

/** Number of tools surfaced on each /best/<category> page. */
export const BEST_OF_LIMIT = 12;

/**
 * Rank tools within a category for the "Best X" listicle pages. The
 * sort order is a small layered tiebreaker so that:
 *  - Higher overall score wins first.
 *  - Then we prefer tools with real external reviews (count of all
 *    external_ratings entries, summed).
 *  - Then we prefer tools with more populated metadata (a rough
 *    "completeness" tiebreaker so well-documented tools rank ahead
 *    of stubs).
 */

export function rankToolsForCategory(category: Category): Tool[] {
  const inCat = tools.filter((t) => t.category_id === category.id);

  function externalReviewWeight(t: Tool): number {
    if (!t.external_ratings || t.external_ratings.length === 0) return 0;
    return t.external_ratings.reduce((acc, r) => acc + (r.count ?? 0), 0);
  }

  function completenessScore(t: Tool): number {
    let n = 0;
    if (t.version) n++;
    if (t.last_updated) n++;
    if (t.languages && t.languages.length > 0) n++;
    if (t.file_formats_in && t.file_formats_in.length > 0) n++;
    if (t.integrations && t.integrations.length > 0) n++;
    if (t.deployment_options && t.deployment_options.length > 0) n++;
    if (t.security_compliance && t.security_compliance.length > 0) n++;
    if (t.api_sdk?.has_api) n++;
    return n;
  }

  return [...inCat]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const rA = externalReviewWeight(a);
      const rB = externalReviewWeight(b);
      if (rB !== rA) return rB - rA;
      return completenessScore(b) - completenessScore(a);
    })
    .slice(0, BEST_OF_LIMIT);
}

/**
 * Filter tools by a feature ID and rank them using the same logic as categories.
 * Returns a sorted array of tools that include the given feature ID.
 */
export function filterToolsByFeature(featureId: string): Tool[] {
  const inFeature = tools.filter((t) => {
    const slug = t.slug.toLowerCase();
    const shortDesc = (t.short_desc ?? '').toLowerCase();
    const desc = (t.description ?? '').toLowerCase();
    const coreFeatures = (t.core_features ?? []).map(f => f.toLowerCase());
    const detailedFeatures = (t.detailed_features ?? []).flatMap(df => df.items ?? []).map(item => item.name.toLowerCase());
    
    if (featureId === 'ai-assisted') {
      const explicitSlugs = ["bricscad", "autocad", "fusion-360", "ansys-discovery", "altair-inspire", "solidworks", "shapr3d"];
      if (explicitSlugs.includes(slug)) return true;
      
      const keywords = ["ai-assisted", "ai-powered", "generative design", "artificial intelligence", "smart blocks", "smart mouse", "propagate", "bimify", "topology optimization", "live physics gpu solver"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'cloud-collaboration') {
      const explicitSlugs = ["onshape", "fusion-360", "easyeda", "altium-designer", "revit", "archicad"];
      if (explicitSlugs.includes(slug)) return true;
      
      const keywords = ["cloud-collaboration", "cloud collaboration", "real-time collaboration", "multi-user", "co-authoring", "browser-based", "saas", "cloud storage", "bimcloud", "3dexperience", "projectwise", "cloud sync"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'parametric-modeling') {
      const explicitSlugs = ["solidworks", "ptc-creo", "autodesk-inventor", "onshape", "fusion-360", "freecad", "siemens-nx", "shapr3d"];
      if (explicitSlugs.includes(slug)) return true;
      
      const keywords = ["parametric modeling", "parametric design", "parametric", "history-based", "constraint-based", "dimension-driven", "equations & variables", "dynamic assembly mates"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'rendering') {
      const explicitSlugs = ["lumion", "twinmotion", "enscape", "v-ray", "blender", "fusion-360", "solidworks", "sketchup", "3ds-max"];
      if (explicitSlugs.includes(slug)) return true;
      
      const keywords = ["rendering", "render", "ray tracing", "visualisation", "visualization", "photorealistic", "pbr", "gpu ray tracing", "cinerender", "twinmotion", "lumion", "enscape"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    return false;
  });

  // Reuse the same ranking helpers defined above.
  function externalReviewWeight(t: Tool): number {
    if (!t.external_ratings || t.external_ratings.length === 0) return 0;
    return t.external_ratings.reduce((acc, r) => acc + (r.count ?? 0), 0);
  }
  function completenessScore(t: Tool): number {
    let n = 0;
    if (t.version) n++;
    if (t.last_updated) n++;
    if (t.languages && t.languages.length > 0) n++;
    if (t.file_formats_in && t.file_formats_in.length > 0) n++;
    if (t.integrations && t.integrations.length > 0) n++;
    if (t.deployment_options && t.deployment_options.length > 0) n++;
    if (t.security_compliance && t.security_compliance.length > 0) n++;
    if (t.api_sdk?.has_api) n++;
    return n;
  }

  return [...inFeature]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const rA = externalReviewWeight(a);
      const rB = externalReviewWeight(b);
      if (rB !== rA) return rB - rA;
      return completenessScore(b) - completenessScore(a);
    })
    .slice(0, BEST_OF_LIMIT);
}

export function bestOfPaths(): { slug: string; category: Category }[] {
  return categories.map((c) => ({ slug: c.slug, category: c }));
}

export function findCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** ---------- Tool-vs-tool comparison pairs ------------------------- */

/**
 * Curated comparison-pair list. These are the queries with real
 * search demand based on how buyers compare CAD tools in 2026:
 *   - Direct in-category rivals (autocad-vs-bricscad, kicad-vs-eagle)
 *   - Cross-category but commonly-confused alternatives
 *     (autocad-vs-revit, blender-vs-maya)
 *   - Tier substitutes (solidworks-vs-fusion-360, altium-designer-vs-kicad)
 *
 * Each pair is stored as `[slugA, slugB]` and validated at build time
 * — if either slug doesn't exist, `comparisonPaths` drops the pair
 * rather than crashing.
 */
const RAW_COMPARISON_PAIRS: [string, string][] = [
  // ---- 2D CAD ----
  ["autocad", "bricscad"],
  ["autocad", "draftsight"],
  ["autocad", "zwcad"],
  ["autocad", "microstation"],
  ["autocad", "librecad"],
  ["bricscad", "draftsight"],
  ["bricscad", "zwcad"],
  // ---- 2D CAD <-> BIM (common cross-category buyer query) ----
  ["autocad", "revit"],
  ["autocad", "civil-3d"],
  // ---- 3D Modeling MCAD ----
  ["solidworks", "autodesk-inventor"],
  ["solidworks", "ptc-creo"],
  ["solidworks", "fusion-360"],
  ["solidworks", "onshape"],
  ["solidworks", "solid-edge"],
  ["autodesk-inventor", "solid-edge"],
  ["autodesk-inventor", "fusion-360"],
  ["catia", "siemens-nx"],
  ["catia", "ptc-creo"],
  ["siemens-nx", "ptc-creo"],
  // ---- 3D Modeling artistic / general ----
  ["blender", "maya"],
  ["blender", "3ds-max"],
  ["rhino-3d", "blender"],
  ["rhino-3d", "sketchup"],
  ["fusion-360", "onshape"],
  ["fusion-360", "shapr3d"],
  ["onshape", "shapr3d"],
  ["freecad", "fusion-360"],
  ["freecad", "blender"],
  // ---- BIM ----
  ["revit", "archicad"],
  ["revit", "vectorworks"],
  ["revit", "sketchup"],
  ["archicad", "vectorworks"],
  ["tekla-structures", "revit"],
  // ---- Viewer ----
  ["bluebeam-revu", "navisworks"],
  // ---- CAE/CAM ----
  ["mastercam", "fusion-360"],
  ["mastercam", "hypermill"],
  ["ansys-fluent", "comsol-multiphysics"],
  ["ansys-mechanical", "abaqus"],
  // ---- EDA ----
  ["kicad", "altium-designer"],
  ["kicad", "eagle"],
  ["altium-designer", "orcad"],
  ["altium-365", "altium-designer"],
  // ---- Specialized (render / slicer) ----
  ["lumion", "twinmotion"],
  ["lumion", "enscape"],
  ["enscape", "twinmotion"],
  ["v-ray", "corona-renderer"],
  ["ultimaker-cura", "prusaslicer"],
  ["ultimaker-cura", "bambu-studio"],
];

export interface ComparisonPair {
  pairSlug: string; // canonical url segment, e.g. "autocad-vs-bricscad"
  a: Tool;
  b: Tool;
}

/** Canonical comparison URL segment for two slugs (alphabetical). */
export function pairSlugFor(a: string, b: string): string {
  const [first, second] = [a, b].sort();
  return `${first}-vs-${second}`;
}

/** Build the validated comparison pair list (drops pairs with unknown slugs). */
export function comparisonPairs(): ComparisonPair[] {
  const seen = new Set<string>();
  const out: ComparisonPair[] = [];
  for (const [aSlug, bSlug] of RAW_COMPARISON_PAIRS) {
    if (aSlug === bSlug) continue;
    const a = getToolBySlug(aSlug);
    const b = getToolBySlug(bSlug);
    if (!a || !b) continue;
    const pairSlug = pairSlugFor(aSlug, bSlug);
    if (seen.has(pairSlug)) continue;
    seen.add(pairSlug);
    out.push({ pairSlug, a, b });
  }
  return out;
}

/** ---------- Editor-picked top comparisons -------------------------
 * The dozen pairs we surface as discovery cards on the `/compare` page.
 * Each pair has a short editorial blurb so the card has copy beyond
 * "X vs Y". Pairs that point to unknown slugs are silently dropped so
 * the UI degrades gracefully if the catalog changes. The slug pair is
 * passed to `pairSlugFor` for canonicalisation, matching the same
 * alphabetised URL the static route uses.
 */
const EDITOR_PICK_PAIRS: { a: string; b: string; blurb: string }[] = [
  { a: "autocad", b: "bricscad", blurb: "The 2D-CAD industry standard meets the AutoCAD-compatible challenger that costs a fraction." },
  { a: "solidworks", b: "fusion-360", blurb: "Per-seat parametric MCAD vs the subscription cloud workflow Autodesk is betting on." },
  { a: "revit", b: "archicad", blurb: "The two BIM authoring suites architects keep weighing — workflow, ecosystem, price." },
  { a: "autocad", b: "revit", blurb: "Should your firm still draft in 2D, or jump to a full BIM model?" },
  { a: "blender", b: "maya", blurb: "Open-source 3D powerhouse vs the studio-grade animation standard." },
  { a: "kicad", b: "altium-designer", blurb: "Free, open-source PCB design vs the enterprise EDA suite of choice." },
  { a: "lumion", b: "twinmotion", blurb: "Real-time architectural visualisation, head to head." },
  { a: "fusion-360", b: "onshape", blurb: "Two cloud-first MCAD platforms with very different licensing philosophies." },
  { a: "solidworks", b: "autodesk-inventor", blurb: "Dassault vs Autodesk for mid-range parametric MCAD." },
  { a: "ansys-fluent", b: "comsol-multiphysics", blurb: "Dedicated CFD solver vs the multiphysics generalist." },
  { a: "ultimaker-cura", b: "prusaslicer", blurb: "The battle of the top open-source FDM slicers." },
  { a: "catia", b: "siemens-nx", blurb: "High-end aerospace and automotive CAD, going toe to toe." },
];

export interface EditorPickPair extends ComparisonPair {
  blurb: string;
}

/**
 * Return the editor-picked comparison pairs, resolved against the live
 * catalog. Pairs whose slugs no longer exist are dropped.
 */
export function editorPickPairs(): EditorPickPair[] {
  const out: EditorPickPair[] = [];
  for (const { a: aSlug, b: bSlug, blurb } of EDITOR_PICK_PAIRS) {
    if (aSlug === bSlug) continue;
    const a = getToolBySlug(aSlug);
    const b = getToolBySlug(bSlug);
    if (!a || !b) continue;
    out.push({ pairSlug: pairSlugFor(aSlug, bSlug), a, b, blurb });
  }
  return out;
}

/** Parse "<a>-vs-<b>" and return the two tools, or null if unknown. */
export function parseComparisonPair(pairSlug: string): ComparisonPair | null {
  const m = pairSlug.match(/^([a-z0-9-]+)-vs-([a-z0-9-]+)$/i);
  if (!m) return null;
  const a = getToolBySlug(m[1]);
  const b = getToolBySlug(m[2]);
  if (!a || !b) return null;
  if (a.slug === b.slug) return null;
  return { pairSlug, a, b };
}

/** ---------- Alternatives pages ------------------------------------
 * `/alternatives/[slug]` — one page per tool listing 5-10 alternatives.
 * Targets long-tail keywords: "[tool] alternatives", "best [tool]
 * alternative 2026", "software like [tool]".
 *
 * Each tool already has a hand-curated `alternatives: string[]` field
 * (Phase 5). For tools without one, we fall back to same-category top
 * tools so 100% of /tools/[slug] have a paired /alternatives/[slug].
 */
export const ALTERNATIVES_LIMIT = 8;

export function alternativesFor(tool: Tool): Tool[] {
  // Explicit hand-curated list takes precedence.
  if (tool.alternatives && tool.alternatives.length > 0) {
    const resolved = tool.alternatives
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is Tool => Boolean(t));
    if (resolved.length >= 2) {
      return resolved.slice(0, ALTERNATIVES_LIMIT);
    }
  }
  // Fallback: same-category tools sorted by score, excluding self.
  return tools
    .filter((t) => t.category_id === tool.category_id && t.slug !== tool.slug)
    .sort((a, b) => b.score - a.score)
    .slice(0, ALTERNATIVES_LIMIT);
}

/** Build the slug list for `generateStaticParams` on /alternatives/[slug]. */
export function alternativesPagePaths(): { slug: string }[] {
  return tools.map((t) => ({ slug: t.slug }));
}

/** ---------- Platform / OS pages -----------------------------------
 * `/platforms/[slug]` — one page per operating system / runtime.
 * Targets long-tail keywords: "CAD for Mac", "Linux CAD software",
 * "browser-based CAD", "iPad CAD".
 */
export interface PlatformPage {
  slug: string;
  /** Display name shown in H1 ("macOS", "Linux", "Web Browser"). */
  displayName: string;
  /** Value in `tool.platforms[]` we filter on (case-sensitive). */
  platformValue: string;
  /** ~80-word intro paragraph specific to this platform. */
  intro: string;
  faqs: { q: string; a: string }[];
}

export const PLATFORM_PAGES: Record<string, PlatformPage> = {
  mac: {
    slug: "mac",
    displayName: "macOS",
    platformValue: "macOS",
    intro:
      "macOS has gone from CAD afterthought to a credible primary platform in 2026. Apple Silicon's unified memory and on-die GPU make M-series Macs surprisingly competitive for 3D modeling and architectural visualisation, while native Cocoa CAD apps have matured well beyond the old AutoCAD-for-Mac days. Below are every macOS-compatible CAD, BIM, CAE, and EDA tool in our catalog — sorted by expert score and review weight, with a clear callout for tools that ship a true native Mac build versus those that require Crossover, Parallels, or a Windows VM.",
    faqs: [
      {
        q: "Is AutoCAD for Mac as full-featured as AutoCAD for Windows?",
        a: "Close but not identical. AutoCAD for Mac has nearly full 2D and 3D feature parity in 2026, but plugins and LISP routines that ship Windows-only DLLs remain unsupported. Heavy Civil 3D / Plant 3D users should still keep a Windows seat.",
      },
      {
        q: "Do native macOS CAD apps run on Apple Silicon (M1/M2/M3)?",
        a: "Every tool on this list either ships a native arm64 build, runs in Rosetta 2 without major slowdown, or has a publicly-stated Apple Silicon roadmap.",
      },
      {
        q: "Which CAD tools are Mac-only?",
        a: "Vectorworks and ArchiCAD have particularly strong Mac heritage. Shapr3D ships a polished native macOS / iPadOS combo.",
      },
    ],
  },
  linux: {
    slug: "linux",
    displayName: "Linux",
    platformValue: "Linux",
    intro:
      "Linux CAD remains a small but high-quality cohort in 2026. The list is dominated by open-source tooling (FreeCAD, LibreCAD, KiCad, Blender) and serious commercial EDA / CAM packages where engineering shops prefer Linux's stability and licensing model. Below are all CAD, BIM, CAE, and EDA tools in our catalog that publish a native Linux build or a fully-supported Wine layer — sorted by expert score.",
    faqs: [
      {
        q: "Which CAD tool is best on Linux?",
        a: "FreeCAD for parametric MCAD, KiCad for PCB, Blender for 3D, and LibreCAD for 2D drafting are all first-class on Linux. Commercial offerings include BricsCAD, Siemens NX, and several CAE solvers.",
      },
      {
        q: "Does AutoCAD run on Linux?",
        a: "No native build exists. Some users run AutoCAD via Wine or in a Windows VM, but the experience is unsupported. BricsCAD is the closest .dwg-native alternative with a native Linux build.",
      },
    ],
  },
  web: {
    slug: "web",
    displayName: "Web Browser",
    platformValue: "Web",
    intro:
      "Browser-based CAD has graduated from novelty to viable production tool in 2026. WebGL/WebGPU and the maturity of TypeScript-based CAD kernels mean a serious modeling session can now happen entirely in Chrome or Safari — no install, no licence dongle, no OS lock-in. The trade-off is that complex assemblies and high-poly visualisation workflows still benefit from a native client. Below are every CAD, BIM, and visualisation tool in our catalog with a full-featured browser version.",
    faqs: [
      {
        q: "Is browser-based CAD secure for proprietary IP?",
        a: "Most modern web CAD tools encrypt project files at rest, support SSO/SAML, and offer enterprise plans with on-prem deployment options. Onshape's per-user data isolation is the gold-standard model.",
      },
      {
        q: "Can I use web CAD offline?",
        a: "Some tools (Onshape, Shapr3D Web) require an internet connection. Others have offline-capable PWAs. Check each tool's documentation.",
      },
    ],
  },
  ios: {
    slug: "ios",
    displayName: "iPad / iOS",
    platformValue: "iOS",
    intro:
      "iPad CAD has been quietly revolutionised by Apple's M-series chips and the Apple Pencil. In 2026, sketching a parametric assembly on an iPad Pro is no longer a compromised experience — it's a primary workflow for industrial designers and architects who prefer touch-first interaction. Below are every CAD tool in our catalog with a real iPadOS / iOS app (not just a viewer).",
    faqs: [
      {
        q: "Which is the best CAD app for iPad?",
        a: "Shapr3D is the standout — a fully parametric 3D modeller designed for iPadOS with native Apple Pencil integration. Other strong picks: SketchUp Free (web on iPad), AutoCAD Mobile, and BIMx for BIM model viewing.",
      },
    ],
  },
};

export function platformPagePaths(): { slug: string }[] {
  return Object.values(PLATFORM_PAGES).map((p) => ({ slug: p.slug }));
}

export function getPlatformPage(slug: string): PlatformPage | undefined {
  return PLATFORM_PAGES[slug];
}

export function toolsForPlatform(p: PlatformPage): Tool[] {
  return tools
    .filter((t) => t.platforms.includes(p.platformValue))
    .sort((a, b) => b.score - a.score);
}

/** ---------- File-format pages -------------------------------------
 * `/file-formats/[slug]` — one page per CAD/BIM file format.
 * Targets long-tail keywords: "DWG viewer", "STEP file editor",
 * "open STL files", "IFC viewer".
 */
export interface FormatPage {
  slug: string;
  /** Display name in URL-uppercased form ("DWG", "STEP"). */
  formatName: string;
  /** Values in `tool.file_formats_in[]` / `file_formats_out[]` to match. */
  formatValues: string[];
  /** Plain-language full name ("AutoCAD Drawing"). */
  fullName: string;
  /** ~120-word intro paragraph about the format. */
  intro: string;
  faqs: { q: string; a: string }[];
}

export const FILE_FORMAT_PAGES: Record<string, FormatPage> = {
  dwg: {
    slug: "dwg",
    formatName: "DWG",
    formatValues: ["DWG"],
    fullName: "AutoCAD Drawing",
    intro:
      "DWG is the de facto interchange format for 2D and 3D CAD drawings. Originally developed for AutoCAD in 1982 and now maintained by Autodesk, the format stores vector geometry, layers, annotations, and limited 3D solid modeling data. Because DWG dominates the AEC and manufacturing CAD ecosystems, the ability to read and write it cleanly is the single most important interop feature for any 2D CAD tool. Below are every tool in our catalog that imports and/or exports DWG.",
    faqs: [
      {
        q: "What's the difference between DWG and DXF?",
        a: "DWG is Autodesk's proprietary binary format; DXF is the open ASCII (or binary) equivalent designed for interchange. DXF is human-readable and easier to parse but loses some advanced AutoCAD features (xrefs, complex blocks).",
      },
      {
        q: "Is there a free DWG viewer?",
        a: "Yes. Autodesk DWG TrueView is the official free viewer. Open-source LibreCAD and ProgeCAD-DWG-Viewer are also options. For mobile, AutoCAD Mobile App offers free read-only access.",
      },
      {
        q: "Can I edit DWG without AutoCAD?",
        a: "Absolutely. BricsCAD, DraftSight, ZWCAD, and GstarCAD all read and write DWG with high fidelity at a fraction of AutoCAD's price.",
      },
    ],
  },
  dxf: {
    slug: "dxf",
    formatName: "DXF",
    formatValues: ["DXF"],
    fullName: "Drawing Exchange Format",
    intro:
      "DXF (Drawing Exchange Format) is the open-spec sibling to DWG, designed in 1982 specifically for moving CAD data between applications. As an ASCII text format (binary DXF also exists), it's the lingua franca for laser cutters, plasma cutters, CNC routers, and any toolchain that needs to read CAD geometry without an AutoCAD licence. Every serious 2D CAD tool reads and writes DXF cleanly.",
    faqs: [
      {
        q: "Is DXF the same as DWG?",
        a: "Same family, different on-disk format. DXF is ASCII/binary and open-spec; DWG is Autodesk's proprietary binary. Modern CAD tools generally write both. Use DXF for interchange with non-CAD software (laser cutters, GIS, scripting).",
      },
      {
        q: "Best free DXF editor?",
        a: "LibreCAD and QCAD are excellent free options. Inkscape can also read DXF for vector-illustration work.",
      },
    ],
  },
  step: {
    slug: "step",
    formatName: "STEP",
    formatValues: ["STEP"],
    fullName: "Standard for the Exchange of Product model data",
    intro:
      "STEP (ISO 10303) is the international standard for exchanging 3D solid CAD data. Unlike DWG/DXF, STEP captures real B-rep solid geometry — meaning the receiving CAD tool gets the model's solid topology, not just surface meshes. This makes STEP the default format for cross-vendor mechanical design (SolidWorks ↔ Inventor ↔ Creo ↔ NX), and increasingly for 3D printing and CAM workflows where the kernel needs to do real surface analysis.",
    faqs: [
      {
        q: "What's the difference between STEP AP203, AP214, and AP242?",
        a: "These are different STEP application protocols. AP203 (configuration controlled) is the legacy mechanical standard. AP214 adds automotive-specific data (colours, layers). AP242 is the modern combined protocol used for new exports — including PMI (product manufacturing information) and tessellated geometry.",
      },
      {
        q: "Can I open a STEP file for free?",
        a: "Yes. FreeCAD, eDrawings Viewer, and Open Cascade-based viewers all read STEP for free. For editing, FreeCAD and Fusion 360 (free for non-commercial) are the most accessible.",
      },
    ],
  },
  stl: {
    slug: "stl",
    formatName: "STL",
    formatValues: ["STL"],
    fullName: "STereoLithography / Standard Tessellation Language",
    intro:
      "STL is the universal language of 3D printing. The format represents 3D geometry as a mesh of triangulated facets — simple, ubiquitous, and supported by every slicer and every printer. STL is lossy (no colour, no parametric history, no NURBS) but its simplicity is its strength: anything that can output STL can be 3D printed. Below are every tool in our catalog that imports or exports STL.",
    faqs: [
      {
        q: "Free STL viewer for any OS?",
        a: "Microsoft 3D Builder (Windows), Apple Preview (macOS native), Blender (all platforms), MeshLab (research-grade, all platforms).",
      },
      {
        q: "STL vs 3MF — which should I use?",
        a: "3MF is the modern successor: keeps the simplicity of STL but adds colour, materials, units, and metadata. Use 3MF if your slicer supports it. Use STL for maximum compatibility.",
      },
    ],
  },
  iges: {
    slug: "iges",
    formatName: "IGES",
    formatValues: ["IGES"],
    fullName: "Initial Graphics Exchange Specification",
    intro:
      "IGES is the older neutral CAD exchange format, predating STEP and historically used heavily in aerospace, automotive, and shipbuilding workflows where surface geometry (not solids) was the primary representation. IGES carries NURBS surfaces, curves, and analytic primitives, but lacks STEP's solid topology and PMI. Most mechanical CAD tools still read and write IGES for backwards-compatibility with legacy data.",
    faqs: [
      {
        q: "Should I use IGES or STEP?",
        a: "STEP is preferred for new work — it carries solid topology and PMI. Use IGES only when exchanging with legacy systems or surface-only workflows (industrial design, shipbuilding).",
      },
    ],
  },
  ifc: {
    slug: "ifc",
    formatName: "IFC",
    formatValues: ["IFC"],
    fullName: "Industry Foundation Classes",
    intro:
      "IFC is the open BIM data standard maintained by buildingSMART International. Where DWG carries lines and STEP carries solids, IFC carries semantically-rich building models — walls know they are walls, doors know they are doors, slabs reference their floor level. This makes IFC the cornerstone of BIM-to-BIM interoperability and the required format for openBIM submissions to governments and large-firm collaboration. IFC4 is the current production version; IFC4.3 adds infrastructure (roads, rails, bridges) support.",
    faqs: [
      {
        q: "Free IFC viewer?",
        a: "Solibri Anywhere (free tier), BIMcollab Zoom, BIMx (Graphisoft), and the open-source BIMvision are all strong choices.",
      },
      {
        q: "Which BIM tool exports the cleanest IFC?",
        a: "Native authoring tools (ArchiCAD, Revit, Vectorworks Architect, Allplan) export IFC directly with high fidelity. Coordination tools like Navisworks consume IFC but don't author it.",
      },
    ],
  },
  obj: {
    slug: "obj",
    formatName: "OBJ",
    formatValues: ["OBJ"],
    fullName: "Wavefront Object",
    intro:
      "OBJ is the universal interchange format for 3D mesh data with materials. Originally from Wavefront Technologies in the 1980s, it became the standard for moving 3D models between modelling, animation, and rendering applications. Unlike STL, OBJ carries textures, materials (via .mtl), vertex normals, and UV coordinates — making it the format of choice for visualisation, game asset pipelines, and 3D scanning output.",
    faqs: [
      {
        q: "OBJ vs FBX — which is better?",
        a: "OBJ is simpler and more portable; FBX carries animation rigs, scene graphs, and cameras. Use OBJ for static meshes; FBX for anything animated or scene-aware.",
      },
    ],
  },
  pdf: {
    slug: "pdf",
    formatName: "PDF",
    formatValues: ["PDF"],
    fullName: "Portable Document Format",
    intro:
      "PDF in the CAD world is more than just a print format — it's the lingua franca for stakeholder review. PDF carries vector geometry, layers, annotations, and (in 3D PDF / U3D / PRC variants) full 3D model data with measurement and section tools. Most CAD tools export PDF for plotting, markup, and digital sign-off, while specialist tools like Bluebeam Revu and Adobe Acrobat handle the review/markup side of the workflow.",
    faqs: [
      {
        q: "What's a 3D PDF?",
        a: "A PDF that embeds an interactive 3D model viewer using the PRC or U3D format. Acrobat Reader can rotate, zoom, section, and measure the embedded model without any CAD licence.",
      },
    ],
  },
  fbx: {
    slug: "fbx",
    formatName: "FBX",
    formatValues: ["FBX"],
    fullName: "Filmbox",
    intro:
      "FBX is Autodesk's proprietary scene-and-animation interchange format. It carries 3D meshes, materials, rigs, animations, lights, and cameras — everything a game engine or animation pipeline needs. FBX dominates the games/film/animation toolchain (Unity, Unreal, Maya, 3ds Max), and increasingly architectural visualisation workflows where you need full scene fidelity (lights + materials + animation) not just geometry.",
    faqs: [
      {
        q: "Is FBX still being developed?",
        a: "Yes — Autodesk continues to release SDK updates and the format is still the default for Unreal/Unity pipelines. The newer USD (Universal Scene Description) is the long-term successor but FBX remains dominant in 2026.",
      },
    ],
  },
  jt: {
    slug: "jt",
    formatName: "JT",
    formatValues: ["JT"],
    fullName: "Jupiter Tessellation",
    intro:
      "JT is the lightweight 3D visualisation format used heavily in automotive and aerospace mechanical design. Maintained by Siemens (and an ISO standard, ISO 14306), JT is designed for huge assembly visualisation — millions of parts, level-of-detail mesh data, attached PMI. It's the format of choice for digital-mockup workflows at the OEM level, particularly in supply chains anchored to Siemens NX and Teamcenter PLM.",
    faqs: [
      {
        q: "JT vs STEP — when to use each?",
        a: "STEP for solid-model exchange (you'll edit the geometry). JT for visualisation, mockup, and large-assembly review (you'll only view and measure).",
      },
    ],
  },
};

export function formatPagePaths(): { slug: string }[] {
  return Object.values(FILE_FORMAT_PAGES).map((p) => ({ slug: p.slug }));
}

export function getFormatPage(slug: string): FormatPage | undefined {
  return FILE_FORMAT_PAGES[slug];
}

export function toolsForFormat(p: FormatPage): {
  reads: Tool[];
  writes: Tool[];
  both: Tool[];
} {
  const reads: Tool[] = [];
  const writes: Tool[] = [];
  const both: Tool[] = [];
  for (const t of tools) {
    const canRead = (t.file_formats_in ?? []).some((f) =>
      p.formatValues.includes(f),
    );
    const canWrite = (t.file_formats_out ?? []).some((f) =>
      p.formatValues.includes(f),
    );
    if (canRead && canWrite) both.push(t);
    else if (canRead) reads.push(t);
    else if (canWrite) writes.push(t);
  }
  const byScore = (a: Tool, b: Tool) => b.score - a.score;
  return {
    reads: reads.sort(byScore),
    writes: writes.sort(byScore),
    both: both.sort(byScore),
  };
}

/** ---------- Persona / use-case pages ------------------------------
 * `/for/[slug]` — one page per buyer persona / use case.
 * Targets long-tail keywords: "best CAD for architects", "CAD for
 * mechanical engineers", "CAD for students", etc.
 */
export interface PersonaPage {
  slug: string;
  /** Display name shown in H1 ("Architects", "Mechanical Engineers"). */
  displayName: string;
  /** Singular noun for body copy ("architect"). */
  shortNoun: string;
  /** Filter function for which tools belong on this list. */
  filter: (t: Tool) => boolean;
  /** ~120-word custom intro paragraph specific to this persona. */
  intro: string;
  /** Optional category emphasis for context badges. */
  emphasisCategoryIds?: string[];
  faqs: { q: string; a: string }[];
}

const hasAny = (haystack: string[] | undefined, needles: string[]) =>
  (haystack ?? []).some((h) => needles.includes(h));

export const PERSONA_PAGES: Record<string, PersonaPage> = {
  architects: {
    slug: "architects",
    displayName: "Architects",
    shortNoun: "architect",
    filter: (t) =>
      hasAny(t.industries, [
        "Architecture",
        "AEC",
        "Interior Design",
        "Construction",
      ]),
    intro:
      "Architects in 2026 work across a spectrum that runs from 2D detailing all the way through full BIM coordination, real-time visualisation, and parametric facade design. A modern architectural toolchain rarely has just one CAD tool — most firms run a Revit/ArchiCAD/Vectorworks core for authoring, a SketchUp or Rhino layer for concept design, and a Lumion or Twinmotion seat for presentation. Below are every CAD, BIM, and visualisation tool in our catalog tagged for architecture, AEC, interior design, or construction — sorted by expert score and review weight.",
    faqs: [
      {
        q: "Revit, ArchiCAD, or Vectorworks for a small architecture practice?",
        a: "Revit dominates the Autodesk-centric AEC ecosystem (US, UK, large firms). ArchiCAD has the best Mac story and a cleaner BIM model. Vectorworks is the strongest choice for landscape, exhibit, and interior design.",
      },
      {
        q: "Do architects still use AutoCAD?",
        a: "Yes — for detailed 2D drawings, schedules, and as the format-of-record for sharing with consultants. Most architecture practices use AutoCAD alongside a BIM tool, not instead of one.",
      },
    ],
  },
  "mechanical-engineers": {
    slug: "mechanical-engineers",
    displayName: "Mechanical Engineers",
    shortNoun: "mechanical engineer",
    filter: (t) =>
      hasAny(t.industries, [
        "Mechanical",
        "Manufacturing",
        "Automotive",
        "Aerospace",
        "Industrial Design",
        "Product Design",
      ]),
    intro:
      "Mechanical engineering CAD is the most mature segment of the market — parametric solid modelling has been a mature discipline since the SolidWorks-vs-Pro/E days of the 1990s. In 2026 the choices are split along three axes: traditional desktop parametric (SolidWorks, Inventor, Creo, Solid Edge) vs cloud-native (Fusion 360, Onshape) vs high-end (NX, CATIA). Below are every mechanical CAD, CAE, and CAM tool in our catalog — sorted by expert score.",
    faqs: [
      {
        q: "SolidWorks or Fusion 360 for mechanical design?",
        a: "SolidWorks is the industry standard, has the deepest plugin ecosystem, and is the safest hiring pool bet. Fusion 360 is dramatically cheaper, runs natively on Mac, and has integrated CAM. For startups and freelancers, Fusion 360. For mid-market and enterprise, SolidWorks.",
      },
      {
        q: "Best free mechanical CAD?",
        a: "FreeCAD (open-source, parametric, Linux/Mac/Windows). Onshape Free (browser-based, public-only projects). Fusion 360 Personal (free for non-commercial use).",
      },
    ],
  },
  "civil-engineers": {
    slug: "civil-engineers",
    displayName: "Civil Engineers",
    shortNoun: "civil engineer",
    filter: (t) =>
      hasAny(t.industries, [
        "Civil Engineering",
        "Construction",
        "Infrastructure",
        "Surveying",
        "AEC",
      ]),
    intro:
      "Civil engineering CAD has its own toolchain distinct from mechanical or architectural workflows. Surface modeling, alignment design, grading, drainage, and earthworks all require purpose-built tools — generic 3D modelers don't cut it. The 2026 landscape is anchored by Autodesk Civil 3D and Bentley OpenRoads, with strong support from MicroStation-based workflows in transportation and rail, and emerging BIM-for-infrastructure with IFC4.3. Below are every civil engineering and infrastructure tool in our catalog.",
    faqs: [
      {
        q: "Civil 3D or OpenRoads?",
        a: "Civil 3D dominates US private-sector civil engineering. OpenRoads (Bentley) is preferred in transportation, rail, and large infrastructure projects globally. Most large firms run both.",
      },
    ],
  },
  students: {
    slug: "students",
    displayName: "Students",
    shortNoun: "student",
    filter: (t) =>
      t.pricing_type === "Free" ||
      t.pricing_type === "Open Source" ||
      t.pricing_type === "Freemium" ||
      hasAny(t.industries, ["Education"]),
    intro:
      "Every major CAD vendor offers free or heavily-discounted student licences in 2026, but not all educational programs are equal. Some give you the full commercial product (Autodesk, Onshape, SolidWorks); some are watermarked or feature-restricted; some require yearly re-verification. Below are the tools that are realistically available to students at zero or near-zero cost — including outright free / open-source options that have no expiration date and can follow you into your career.",
    faqs: [
      {
        q: "Best free CAD for engineering students?",
        a: "Fusion 360 (free for students), Onshape (free for educational use), and FreeCAD (open-source, never expires) cover the parametric MCAD needs of most engineering programs.",
      },
      {
        q: "Best free CAD for architecture students?",
        a: "Revit and AutoCAD via the Autodesk Education Plan; SketchUp Free (browser); Blender for visualisation.",
      },
    ],
  },
  "jewelry-designers": {
    slug: "jewelry-designers",
    displayName: "Jewelry Designers",
    shortNoun: "jewelry designer",
    filter: (t) =>
      hasAny(t.industries, ["Jewelry", "Fashion", "Apparel"]) ||
      ["matrix", "rhino-3d", "jewelcad", "3design", "firestorm"].some((s) =>
        t.slug.includes(s),
      ),
    intro:
      "Jewelry design CAD is its own micro-discipline. The tools (Rhino + Matrix, JewelCAD, 3Design, Firestorm CAD) emphasise organic surface modeling, prong/pavé/cluster setting templates, and ring-sizer libraries that aren't relevant to any other design workflow. Output is almost always for 3D printing (lost-wax casting) or direct CNC milling. Below are CAD tools in our catalog with documented jewelry or fashion workflows.",
    faqs: [
      {
        q: "Rhino vs Matrix for jewelry?",
        a: "Matrix is a Rhino plugin — they aren't competitors. You buy Rhino and add Matrix on top. The combination is the industry standard for fine jewelry. JewelCAD and 3Design are alternative complete suites.",
      },
    ],
  },
  "electrical-engineers": {
    slug: "electrical-engineers",
    displayName: "Electrical Engineers",
    shortNoun: "electrical engineer",
    filter: (t) =>
      hasAny(t.industries, ["Electrical", "Electronics", "Power", "Energy"]) ||
      t.category_id === "c4",
    intro:
      "Electrical engineering CAD splits into two distinct toolchains: EDA (electronic design automation) for PCB and chip design, and electrical schematic CAD for control panels, wiring harnesses, and building electrical systems. KiCad and Altium dominate the EDA side; EPLAN and AutoCAD Electrical dominate the panel/schematic side. Below are every EDA and electrical-schematic tool in our catalog.",
    faqs: [
      {
        q: "KiCad vs Altium for PCB design?",
        a: "KiCad is free, open-source, and has matured into a credible production tool. Altium is the commercial standard with deeper ecosystem (cloud library, MCAD integration). Many shops start on KiCad and migrate to Altium when their needs grow.",
      },
    ],
  },
  animators: {
    slug: "animators",
    displayName: "Animators & VFX Artists",
    shortNoun: "animator",
    filter: (t) =>
      hasAny(t.industries, ["Games", "Product Visualization", "Education"]) ||
      ["blender", "maya", "3ds-max", "zbrush", "houdini", "cinema-4d"].some(
        (s) => t.slug.includes(s),
      ) ||
      t.category_id === "c7",
    intro:
      "Animation and VFX live at the intersection of CAD's 3D modeling discipline and the games/film toolchain's rigging, texturing, and rendering pipelines. The toolset overlaps with architectural visualisation (Lumion, Twinmotion, Enscape, V-Ray) and overlaps with product design when industrial designers need to author cinematic-quality renders. Below are the modeling, rigging, and rendering tools in our catalog suitable for animation, VFX, and motion-design workflows.",
    faqs: [
      {
        q: "Blender or Maya for animation?",
        a: "Maya remains the studio standard for film/TV animation and rigging. Blender has caught up dramatically and is the default for indie / freelance / hobbyist work and increasingly used in studios for specific tasks.",
      },
    ],
  },
  "3d-printing": {
    slug: "3d-printing",
    displayName: "3D Printing & Makers",
    shortNoun: "maker",
    filter: (t) =>
      hasAny(t.industries, ["Hobbyist", "Maker"]) ||
      (t.file_formats_out ?? []).some((f) =>
        ["STL", "3MF", "OBJ"].includes(f),
      ) ||
      ["cura", "prusaslicer", "bambu-studio", "tinkercad"].some((s) =>
        t.slug.includes(s),
      ),
    intro:
      "3D printing combines two distinct tool categories: modeling (where you design the part) and slicing (where you convert the model into printer-specific G-code). The modeling side is dominated by Tinkercad for beginners, Fusion 360 for parametric design, and Blender / ZBrush for organic / artistic modeling. The slicing side belongs to Ultimaker Cura, PrusaSlicer, and Bambu Studio. Below are every modeling tool that exports STL/3MF, and every slicer, in our catalog.",
    faqs: [
      {
        q: "Best free 3D modeller for 3D printing?",
        a: "Tinkercad (beginners, browser-based), Fusion 360 (parametric, free for personal use), Blender (organic / artistic, open-source), FreeCAD (parametric, open-source).",
      },
      {
        q: "Cura, PrusaSlicer, or Bambu Studio for slicing?",
        a: "Cura is the most universal — works with almost every printer. PrusaSlicer is the gold-standard for Prusa printers (and supports others via profiles). Bambu Studio is the de facto choice for Bambu Lab printers but works with others too.",
      },
    ],
  },
  startups: {
    slug: "startups",
    displayName: "Startups",
    shortNoun: "startup founder",
    filter: (t) =>
      t.pricing_type === "Free" ||
      t.pricing_type === "Open Source" ||
      t.pricing_type === "Freemium" ||
      (t.pricing_type === "Subscription" && t.starting_price <= 100),
    intro:
      "Startups need CAD tools that scale with the team, run in the browser (no IT department), have flexible per-seat pricing, and integrate with modern dev workflows (version control, REST APIs, webhooks). The 2026 landscape rewards cloud-native CAD (Onshape, Fusion 360, Shapr3D) and free/open-source options that don't require capex approval. Below are every CAD tool in our catalog with founder-friendly pricing: free, freemium, open-source, or subscription under $100/month.",
    faqs: [
      {
        q: "What CAD do hardware startups use?",
        a: "Most US hardware startups standardise on SolidWorks (incumbent ecosystem) or Onshape (cloud-native, no IT). For early prototypes, Fusion 360 is the workhorse.",
      },
    ],
  },
  freelancers: {
    slug: "freelancers",
    displayName: "Freelancers",
    shortNoun: "freelancer",
    filter: (t) =>
      t.pricing_type === "Free" ||
      t.pricing_type === "Open Source" ||
      t.pricing_type === "Freemium" ||
      (t.starting_price > 0 && t.starting_price <= 150) ||
      (t.license_types ?? []).includes("Perpetual"),
    intro:
      "Freelancers face two CAD problems enterprise users don't: perpetual licensing (because clients move on and you don't always want to keep paying), and file compatibility with whatever the client uses. The 2026 winning move is a primary tool with strong file format support (BricsCAD, Vectorworks, Rhino) plus a free/freemium backup (Fusion 360 Personal, Onshape Free) for the occasional outlier client. Below are every CAD tool in our catalog with a credible freelancer-friendly licensing path: free, perpetual, or low-cost subscription.",
    faqs: [
      {
        q: "Is there still perpetual-licence CAD in 2026?",
        a: "Yes — BricsCAD, Vectorworks, Rhino, NanoCAD, and ZWCAD all still offer perpetual licences. Avoid Autodesk's tools if perpetual is a hard requirement.",
      },
    ],
  },
};

export function personaPagePaths(): { slug: string }[] {
  return Object.values(PERSONA_PAGES).map((p) => ({ slug: p.slug }));
}

export function getPersonaPage(slug: string): PersonaPage | undefined {
  return PERSONA_PAGES[slug];
}

export function toolsForPersona(p: PersonaPage): Tool[] {
  return tools.filter(p.filter).sort((a, b) => b.score - a.score);
}

/** ---------- Pricing bucket pages ----------------------------------
 * `/free` and `/open-source` — single-route pricing-tier listicles.
 * Targets very high-volume long-tail: "free CAD software",
 * "best free CAD", "open source CAD".
 */
export function freeTools(): Tool[] {
  return tools
    .filter(
      (t) => t.pricing_type === "Free" || t.pricing_type === "Freemium",
    )
    .sort((a, b) => b.score - a.score);
}

export function openSourceTools(): Tool[] {
  return tools
    .filter((t) => t.pricing_type === "Open Source")
    .sort((a, b) => b.score - a.score);
}
