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
    // 1. Check self-reported features array (primary source of truth)
    if (t.features && t.features.includes(featureId)) {
      return true;
    }

    // 2. Keyword fallback check for backward compatibility
    const shortDesc = (t.short_desc ?? '').toLowerCase();
    const desc = (t.description ?? '').toLowerCase();
    const coreFeatures = (t.core_features ?? []).map(f => f.toLowerCase());
    const detailedFeatures = (t.detailed_features ?? []).flatMap(df => df.items ?? []).map(item => item.name.toLowerCase());
    
    if (featureId === 'ai-assisted') {
      const keywords = ["ai-assisted", "ai-powered", "generative design", "artificial intelligence", "smart blocks", "smart mouse", "propagate", "bimify", "topology optimization", "live physics gpu solver"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'cloud-collaboration') {
      const keywords = ["cloud-collaboration", "cloud collaboration", "real-time collaboration", "multi-user", "co-authoring", "browser-based", "saas", "cloud storage", "bimcloud", "3dexperience", "projectwise", "cloud sync"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'parametric-modeling') {
      const keywords = ["parametric modeling", "parametric design", "parametric", "history-based", "constraint-based", "dimension-driven", "equations & variables", "dynamic assembly mates"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'rendering') {
      const keywords = ["rendering", "render", "ray tracing", "visualisation", "visualization", "photorealistic", "pbr", "gpu ray tracing", "cinerender", "twinmotion", "lumion", "enscape"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'sheet-metal') {
      const keywords = ["sheet metal", "flat pattern", "k-factor", "folding", "unfolding", "press brake", "bend allowance", "punching"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'generative-design') {
      const keywords = ["generative design", "topology optimization", "structural optimization", "lattice structures", "additive manufacturing"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'reverse-engineering') {
      const keywords = ["reverse engineering", "3d scan", "point cloud", "mesh to solid", "b-rep conversion", "deviation analysis"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }
    
    if (featureId === 'integrated-cam') {
      const keywords = ["cam", "cnc", "toolpath", "g-code", "milling", "turning", "multi-axis", "machining simulation"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'simulation-fea') {
      const keywords = ["simulation", "fea", "finite element analysis", "cfd", "thermal analysis", "stress analysis", "structural analysis", "live physics", "fatigue simulation", "fluid dynamics"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'subdivision-modeling') {
      const keywords = ["subdivision modeling", "subd", "subdivision surface", "organic shape", "freeform", "t-splines", "organic modeling", "ergonomic design"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'bim-integration') {
      const keywords = ["bim", "building information modeling", "ifc", "clash detection", "openbim", "bimcloud"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'direct-modeling') {
      const keywords = ["direct modeling", "history-free", "push-pull", "direct design", "interactive modeling", "synchronous technology", "dynamic modeling"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'mesh-modeling') {
      const keywords = ["mesh modeling", "polygon editing", "polygon manipulation", "mesh repair", "stl mesh", "obj mesh", "3d scan mesh", "mesh optimization", "point cloud mesh", "mesh to solid", "polygon mesh"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'piping-routing') {
      const keywords = ["piping", "cabling", "routing", "wiring harness", "hvac routing", "electrical routing", "piping design", "piping and instrumentation", "p&id", "cable tray", "conduit design"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'surface-modeling') {
      const keywords = ["surface modeling", "class-a", "nurbs", "class-a surfacing", "freeform surface", "bezier curves", "lofting", "surfacing", "aesthetic shape", "styling engine"];
      return keywords.some(kw => 
        shortDesc.includes(kw) || 
        desc.includes(kw) || 
        coreFeatures.some(cf => cf.includes(kw)) ||
        detailedFeatures.some(df => df.includes(kw))
      );
    }

    if (featureId === 'drafting-detailing') {
      const keywords = ["drafting", "detailing", "2d drafting", "technical drawing", "blueprint", "gd&t", "geometric dimensioning", "tolerancing", "drafting tools", "sheet layout", "detailing viewport"];
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
  ["autocad", "gstarcad"],
  ["autocad", "microstation"],
  ["autocad", "librecad"],
  ["bricscad", "draftsight"],
  ["bricscad", "zwcad"],
  ["gstarcad", "zwcad"],
  ["gstarcad", "bricscad"],
  ["zwcad", "draftsight"],
  ["nanocad", "autocad"],
  ["nanocad", "bricscad"],
  ["nanocad", "zwcad"],
  ["qcad", "librecad"],
  ["librecad", "freecad"],
  // ---- 2D CAD <-> BIM (common cross-category buyer query) ----
  ["autocad", "revit"],
  ["autocad", "civil-3d"],
  // ---- 3D Modeling MCAD ----
  ["solidworks", "autodesk-inventor"],
  ["solidworks", "ptc-creo"],
  ["solidworks", "fusion-360"],
  ["solidworks", "onshape"],
  ["solidworks", "solid-edge"],
  ["solidworks", "catia"],
  ["solidworks", "siemens-nx"],
  ["solidworks", "freecad"],
  ["solidworks", "solidcam"],
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
  ["rhino-3d", "matrixgold"],
  ["shapr3d", "rhino-3d"],
  ["blender", "rhino-3d"],
  ["sketchup", "rhino-3d"],
  ["tinkercad", "sketchup"],
  ["tinkercad", "openscad"],
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
  ["archicad", "sketchup"],
  ["vectorworks", "sketchup"],
  ["tekla-structures", "revit"],
  ["chief-architect", "revit"],
  ["chief-architect", "sketchup"],
  ["archicad", "chief-architect"],
  // ---- Viewer ----
  ["bluebeam-revu", "navisworks"],
  // ---- CAE/CAM ----
  ["mastercam", "fusion-360"],
  ["mastercam", "hypermill"],
  ["mastercam", "solidworks"],
  ["mastercam", "solidcam"],
  ["ansys-fluent", "comsol-multiphysics"],
  ["ansys-mechanical", "abaqus"],
  // ---- EDA ----
  ["kicad", "altium-designer"],
  ["kicad", "eagle"],
  ["altium-designer", "orcad"],
  ["altium-365", "altium-designer"],
  ["altium-designer", "eagle"],
  ["kicad", "orcad"],
  ["easyeda", "kicad"],
  ["eplan-electric-p8", "kicad"],
  ["altium-designer", "eplan-electric-p8"],
  // ---- Specialized (render / slicer) ----
  ["lumion", "twinmotion"],
  ["lumion", "enscape"],
  ["enscape", "twinmotion"],
  ["v-ray", "corona-renderer"],
  ["twinmotion", "v-ray"],
  ["ultimaker-cura", "prusaslicer"],
  ["ultimaker-cura", "bambu-studio"],
  ["prusaslicer", "bambu-studio"],
  ["clo-3d", "marvelous-designer"],
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

let cachedPairs: ComparisonPair[] | null = null;

/** Build the validated comparison pair list (drops pairs with unknown slugs). */
export function comparisonPairs(): ComparisonPair[] {
  if (cachedPairs) return cachedPairs;
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
  cachedPairs = out;
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
  { a: "prusaslicer", b: "bambu-studio", blurb: "The ultimate open-source slicer vs the dominant high-speed plug-and-play printer ecosystem." },
  { a: "shapr3d", b: "rhino-3d", blurb: "iPad-native modern modeling vs the traditional desktop NURBS modeler." },
  { a: "solidworks", b: "freecad", blurb: "The commercial engineering standard vs the leading open-source parametric CAD alternative." }
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
  windows: {
    slug: "windows",
    displayName: "Windows",
    platformValue: "Windows",
    intro:
      "Windows remains the undisputed gold standard and primary development environment for the global CAD and engineering industry in 2026. Virtually 100% of advanced mechanical design, finite element analysis (FEA), computational fluid dynamics (CFD), and deep electronic design automation (EDA) suites are optimized natively for Windows architectures, taking full advantage of DirectX 12, Vulkan, and modern multi-threaded workstation CPUs. Below is the complete catalog of Windows-compatible CAD, BIM, CAE, and EDA software, sorted by expert score and review weight.",
    faqs: [
      {
        q: "Why is Windows still the preferred OS for heavy CAD and CAE workloads?",
        a: "Legacy software architectures, deep integration with proprietary graphics pipelines (like DirectX), and the vast majority of specialized third-party plugins (especially C++ and .NET libraries) remain exclusively compatible with Windows. High-end simulation solvers and PLM suites are heavily optimized for Windows Workstation environments.",
      },
      {
        q: "Do Windows CAD applications require a dedicated graphics card?",
        a: "Yes, for any serious 3D modeling, rendering, or large assembly work, a dedicated GPU with ISV-certified drivers (such as NVIDIA RTX Enterprise/Quadro or AMD Radeon Pro) is strongly recommended. However, modern integrated GPUs can run basic 2D drafting and light 3D design tasks.",
      },
      {
        q: "Can I run all Windows CAD tools on Windows on ARM?",
        a: "Many major applications are releasing native ARM64 builds or run via the built-in Windows 11 emulation layer. However, legacy tools, complex LISP/DLL integrations, and specialized hardware drivers may still require native x64 Intel/AMD environments in 2026.",
      },
    ],
  },
  android: {
    slug: "android",
    displayName: "Android",
    platformValue: "Android",
    intro:
      "Android is rapidly growing from a simple model-viewer platform into an agile, on-site collaboration and redlining environment in 2026. Equipped with powerful mobile chips and high-resolution stylus support, modern Android tablets and smartphones allow architects, field engineers, and project managers to edit 2D DWGs, inspect massive 3D BIM models, and sync modifications directly to cloud-based design databases from the field. Below are the CAD, BIM, and visualization tools in our database that provide fully functional, native Android apps.",
    faqs: [
      {
        q: "Can I do full 3D modeling and mechanical design on an Android tablet?",
        a: "While intensive 3D CAD modeling is still primarily a desktop workstation task, Android apps like AutoCAD Mobile, GstarCAD Mobile, and various cloud-based viewers enable precise 2D drafting, measurements, annotations, and lightweight 3D inspections directly on mobile hardware.",
      },
      {
        q: "Is an active internet connection required to run Android CAD apps?",
        a: "Most professional Android CAD apps allow you to download drawing files locally for offline viewing, measurement, and basic editing. The changes will then sync back to your enterprise cloud repository as soon as you reconnect to the network.",
      },
      {
        q: "Which Android devices are best for CAD workflows?",
        a: "Large-screen Android tablets with high performance, high color accuracy, and precise active stylus support (such as the Samsung Galaxy Tab S series) provide the most productive and accurate experience for drafting, sketching, and markup review.",
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
  const sorted = tools
    .filter((t) => t.platforms.includes(p.platformValue))
    .sort((a, b) => b.score - a.score);
  if (p.slug === "windows") {
    return sorted.slice(0, 20);
  }
  return sorted;
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
  "3dm": {
    slug: "3dm",
    formatName: "3DM",
    formatValues: ["3DM"],
    fullName: "Rhino 3D Model",
    intro:
      "The 3DM format is the native file type of Rhinoceros 3D, the industry standard for NURBS-based mathematical 3D modeling, industrial design, and computational architecture. Because 3DM files store precise double-precision NURBS curves, surfaces, and solids, they maintain perfect geometric fidelity without the mesh tessellation loss of formats like STL. The format is open-source (via the openNURBS initiative), allowing a wide variety of CAD, rendering, and rapid prototyping tools to import and export Rhino models directly. Below are all the tools in our catalog that support the 3DM format.",
    faqs: [
      {
        q: "What is the primary benefit of the 3DM format over STL or OBJ?",
        a: "STL and OBJ represent 3D models as a collection of flat triangles (tessellated mesh), which introduces approximation errors. 3DM represents models using exact mathematical NURBS equations, providing infinite resolution and absolute precision, which is critical for industrial manufacturing and marine design.",
      },
      {
        q: "Is the 3DM format open and accessible?",
        a: "Yes. McNeil & Associates maintains the openNURBS toolkit, a free, open-source C++ and .NET software library that enables any software developer to read and write 3DM files natively without requiring Rhinoceros licenses.",
      },
      {
        q: "Can I view a 3DM file without Rhino?",
        a: "Absolutely. Many general CAD programs, standalone viewers (such as eDrawings or openNURBS-based viewers), and web-based portfolio platforms can view and inspect 3DM models without any active Rhino installation.",
      },
    ],
  },
  "3mf": {
    slug: "3mf",
    formatName: "3MF",
    formatValues: ["3MF"],
    fullName: "3D Manufacturing Format",
    intro:
      "The 3D Manufacturing Format (3MF) is the modern, open-standard file format designed specifically for additive manufacturing and 3D printing. Developed by the 3MF Consortium (which includes Autodesk, Microsoft, HP, and UltiMaker), 3MF addresses the severe limitations of the legacy STL format. It is a clean, XML-based format that packs full scene geometry, scale units, color gradients, materials, textures, and internal lattice structures into a single compressed archive. Below are the tools in our catalog that support importing, exporting, or slicing 3MF files.",
    faqs: [
      {
        q: "Why is 3MF superior to STL for 3D printing?",
        a: "Unlike STL, which only defines raw surface triangles with no scale or color data, 3MF stores precise physical units, multi-material specifications, color maps, texture coordinates, and even internal structural lattices. It is also highly compressed and less prone to mesh errors like self-intersections or holes.",
      },
      {
        q: "Who supports and maintains the 3MF format?",
        a: "The 3MF Consortium, a collaborative joint industry project composed of leading CAD developers, 3D printer manufacturers, and material companies, governs and continuously improves the open 3MF specification.",
      },
      {
        q: "Can I use 3MF files in standard CAD and slicer programs?",
        a: "Yes. Almost all modern 3D CAD platforms (like SolidWorks, Fusion 360) and standard slicers (such as PrusaSlicer, Bambu Studio, and Cura) fully support 3MF as a primary import and export format for 3D printing workflows.",
      },
    ],
  },
  sldprt: {
    slug: "sldprt",
    formatName: "SLDPRT",
    formatValues: ["SLDPRT", "SLDASM"],
    fullName: "SolidWorks Part and Assembly",
    intro:
      "SLDPRT and SLDASM are the native, proprietary file formats used by Dassault Systèmes SolidWorks to store individual part files and multi-component assembly data. Since SolidWorks is the most widely adopted mechanical CAD program in the world, these formats contain critical feature-history trees, equations, assembly mates, and design parameters. Because they are native and proprietary, direct interoperability with other CAD kernels often requires translation, making them the most frequently searched formats for viewing and format conversion. Below are the tools in our database that support or convert SolidWorks files.",
    faqs: [
      {
        q: "How can I open a SolidWorks file (.sldprt / .sldasm) without SolidWorks?",
        a: "You can view these files for free using Autodesk Viewer or Dassault's official free eDrawings Viewer. If you need to edit or import them into other CAD platforms (like Fusion 360, Rhino, or Onshape), these platforms have built-in importers that convert them to their native geometries.",
      },
      {
        q: "What is the best way to convert SLDPRT files to a universal format?",
        a: "The industry standard is to export the file from SolidWorks as a STEP (.step) or Parasolid (.x_t) file, which preserves high-fidelity 3D solid geometry without design history.",
      },
    ],
  },
  ipt: {
    slug: "ipt",
    formatName: "IPT",
    formatValues: ["IPT", "IAM"],
    fullName: "Autodesk Inventor Part and Assembly",
    intro:
      "IPT and IAM are the native file formats for Autodesk Inventor, storing 2D/3D sketches, parametric features, physical material properties, and complex hierarchical assemblies (IAM). Highly optimized for Autodesk's proprietary modeling engine, these files maintain design history and constraints. While sharing them with non-Autodesk users often requires translation to neutral formats, their direct support in modern downstream simulation (CAE) and manufacturing (CAM) pipelines is vital for collaborative industrial engineering.",
    faqs: [
      {
        q: "What is the difference between an IPT and an IAM file?",
        a: "An IPT file represents a single solid part with its individual features. An IAM file is an assembly file that references multiple IPT files (or other sub-assemblies) and defines the spatial relationships (mates and constraints) between them.",
      },
      {
        q: "How do I view IPT or IAM files without an Inventor license?",
        a: "Autodesk offers the free Autodesk Viewer online, which allows you to inspect, measure, and section Inventor parts in a browser. You can also use free CAD viewers like eDrawings or CAD Exchanger.",
      },
    ],
  },
  rvt: {
    slug: "rvt",
    formatName: "RVT",
    formatValues: ["RVT"],
    fullName: "Autodesk Revit Project File",
    intro:
      "RVT is the native project file format of Autodesk Revit, the industry-dominant BIM authoring platform. A single RVT file acts as a relational database, storing all structural designs, architectural components (walls, windows, doors), MEP pipe routings, sheets, scheduling, and 3D visualization data. Because Revit models are extremely complex and carry rich semantic metadata, opening and sharing RVT files without software incompatibility is one of the most critical challenges in modern AEC project coordination.",
    faqs: [
      {
        q: "Can I open an RVT file in AutoCAD or other 2D CAD programs?",
        a: "No, RVT is a proprietary BIM database file. To open it in AutoCAD or other non-BIM CAD applications, you must first export it from Revit to DWG (for 2D plans) or IFC (for 3D BIM coordination).",
      },
      {
        q: "How can I view a Revit RVT file for free?",
        a: "You can upload it to the free web-based Autodesk Viewer to inspect the 3D model, view 2D sheets, and read BIM properties. Alternatively, you can use coordination tools like Autodesk BIM 360 or Navisworks Freedom.",
      },
    ],
  },
  dgn: {
    slug: "dgn",
    formatName: "DGN",
    formatValues: ["DGN"],
    fullName: "MicroStation Design File",
    intro:
      "DGN is the native file format of Bentley Systems MicroStation and its vertical civil infrastructure design suites. Originally developed in the 1980s, the DGN format (specifically V8 DGN) is widely recognized as the format of record for large-scale, long-lifecycle civil engineering projects, including highways, railways, bridges, and plant designs. Known for its incredible stability with massive datasets, DGN is the standard format for major transport departments and civil engineering consortia globally.",
    faqs: [
      {
        q: "What is the difference between DGN and DWG formats?",
        a: "While DWG (Autodesk) dominates general AEC and building design, DGN (Bentley) is optimized for massive infrastructure projects. DGN V8 has no file size limitations and handles high-precision geospatial coordinates much better than standard DWG.",
      },
      {
        q: "How do I convert a DGN file to DWG or DXF?",
        a: "Bentley MicroStation has a built-in batch converter to export DGN directly to DWG. Autodesk AutoCAD can also import DGN files using the DGNIMPORT command, converting DGN elements into DWG entities.",
      },
    ],
  },
  gcode: {
    slug: "gcode",
    formatName: "GCODE",
    formatValues: ["GCODE", "G-CODE"],
    fullName: "G-Code Machine Instruction File",
    intro:
      "G-Code (often saved as .gcode, .nc, or .cnc) is the universal, standardized programming language used to control automated machine tools. Generated by CAM (Computer-Aided Manufacturing) software or 3D printer slicers, a G-Code file contains line-by-line coordinates, speeds, feeds, tool changes, and temperature parameters that command a CNC mill, lathe, laser cutter, or FDM 3D printer exactly how to move and fabricate a physical object from digital geometry.",
    faqs: [
      {
        q: "Can I edit a G-Code file directly?",
        a: "Yes. G-Code is standard ASCII text. You can open and edit it in any basic text editor (like Notepad) or specialized G-code editors that include toolpath backplotting and visual simulation.",
      },
      {
        q: "How do I convert a CAD model (STEP/STL) to G-Code?",
        a: "You cannot convert a CAD model to G-Code directly. You must import the 3D model into a Slicer (for 3D printing) or CAM software (for CNC machining) to calculate the toolpaths, speeds, and tool specifications, which are then 'post-processed' to output the final G-Code.",
      },
    ],
  },
  x_t: {
    slug: "x_t",
    formatName: "X_T",
    formatValues: ["X_T", "X_B", "Parasolid"],
    fullName: "Parasolid Model Text/Binary",
    intro:
      "X_T (ASCII) and X_B (Binary) are the native geometric kernel formats for Siemens Parasolid, the modeling engine that powers SolidWorks, Siemens NX, Solid Edge, Onshape, and over 300 other commercial CAD applications. Because it represents precise boundary representation (B-Rep) solid geometry, Parasolid files are the highest-fidelity neutral exchange format for transferring models between systems sharing the Parasolid kernel. Using X_T avoids the typical translation errors and topology issues that occur when converting to generic formats.",
    faqs: [
      {
        q: "Why is X_T preferred over STEP for exchanging models between SolidWorks and Solid Edge?",
        a: "Because both SolidWorks and Solid Edge are built on the Parasolid geometric kernel, transferring files via X_T is native and lossless. Converting to STEP introduces a translator layer that can occasionally fail or create minor face errors.",
      },
      {
        q: "Can X_T files store parametric feature design history?",
        a: "No. While X_T preserves mathematically perfect boundary surfaces, volumes, colors, and assembly hierarchies, it does not store the parametric feature history tree or assembly constraints.",
      },
    ],
  },
  sat: {
    slug: "sat",
    formatName: "SAT",
    formatValues: ["SAT", "SAB", "ACIS"],
    fullName: "ACIS Solid Model Text/Binary",
    intro:
      "SAT (ASCII) and SAB (Binary) are the native geometric kernel exchange formats of the ACIS modeler, developed by Spatial Corporation (a Dassault Systèmes subsidiary). ACIS is the core geometric engine behind Autodesk AutoCAD, BricsCAD, Inventor (partially), and various specialized CAE/CAM applications. SAT files store precise mathematical descriptions of 3D solids and surfaces, providing robust interop for applications utilizing the ACIS kernel.",
    faqs: [
      {
        q: "What is the difference between SAT and SAB?",
        a: "SAT files are standard ASCII text, making them readable by developers and easier to debug. SAB files are compressed binary equivalents, which are much smaller in file size and load faster in CAD software.",
      },
      {
        q: "Which major software suites natively support ACIS SAT files?",
        a: "AutoCAD, BricsCAD, DraftSight, and various industry-standard CAM and analysis tools support importing and exporting ACIS SAT/SAB formats natively.",
      },
    ],
  },
  usd: {
    slug: "usd",
    formatName: "USD",
    formatValues: ["USD", "USDZ", "USDC"],
    fullName: "Universal Scene Description",
    intro:
      "Universal Scene Description (USD), developed by Pixar and standardized for web/mobile as USDZ by Apple, is an open, extensible, and high-performance 3D scene description format. While traditional CAD formats focus strictly on solid geometry, USD is designed for collaborative, multi-layered 3D scenes—packing meshes, materials, lighting, cameras, animations, and AR capabilities. In 2026, USD is rapidly becoming the standard for exporting architectural designs and industrial CAD assets into real-time rendering engines, VR/AR platforms, and spatial computing environments.",
    faqs: [
      {
        q: "What is the difference between USD, USDC, and USDZ?",
        a: "USD is the general ASCII/text file format. USDC is the binary, high-performance optimized version. USDZ is a zero-compression zip archive that packages the USDC file along with all textures and audio, making it the standard for AR quick-look on iOS devices.",
      },
      {
        q: "Can USD replace formats like STEP or DWG for engineering?",
        a: "No, USD is not designed for engineering manufacturing or parametric drafting. It is optimized for lightweight visualization, material rendering, and real-time collaboration. Use STEP for manufacturing and USD/USDZ for client presentations, AR, and animation pipelines.",
      },
    ],
  },
  dwf: {
    slug: "dwf",
    formatName: "DWF",
    formatValues: ["DWF", "DWFX"],
    fullName: "Design Web Format",
    intro:
      "DWF and DWFx are highly compressed, secure, and metadata-rich file formats developed by Autodesk specifically for multi-disciplinary design review, construction estimation, and secure plan distribution. Unlike raw DWG files, which carry complete editable CAD coordinate history and proprietary block geometry, DWF acts as a 'digital blueprint'. It preserves exact vector scale, layer names, and hierarchical block attributes while locking down coordinates from direct drawing modifications, making it the standard for sending construction sets to subcontractors and quantity surveyors.",
    faqs: [
      {
        q: "What is the key technical difference between DWF and DWFx?",
        a: "Standard DWF requires Autodesk Design Review or another proprietary viewer to read. DWFx is based on Microsoft's XML Paper Specification (XPS), meaning it can be opened and printed natively in any standard Windows web browser without installing additional plug-ins, while retaining full 2D/3D vector scale and sheet properties.",
      },
      {
        q: "Can I convert a DWF file back to an editable DWG, and what are the limitations?",
        a: "Yes, you can import DWF vectors back into AutoCAD using the DWFATTACH and subsequent DWFIMPORT commands. However, because DWF is a flattened output format, advanced CAD objects (such as parametric dynamic blocks, hatch associations, and dimension constraints) are stripped. The imported geometry will be standard lines, arcs, and simple text.",
      },
      {
        q: "Why do estimators prefer DWF over PDF for quantity takeoff?",
        a: "DWF files embed true object data (such as area boundaries, thickness attributes, and sheet scale parameters) directly from the authoring CAD engine. Estimation tools like Autodesk Takeoff or Bluebeam can read these metadata sheets directly, allowing for automated and highly accurate material count extraction.",
      },
    ],
  },
  exb: {
    slug: "exb",
    formatName: "EXB",
    formatValues: ["EXB", "CAXA"],
    fullName: "CAXA Electronic Draft File",
    intro:
      "EXB is the native file format of CAXA Electronic Draft, a leading Chinese CAD platform widely deployed across China's heavy industrial manufacturing, machining, and engineering education sectors. Built to align strictly with Chinese national drafting standards (GB standards), EXB files house detailed 2D production plans, localized dimension styles, annotated welding symbols, and structured BOM (Bill of Materials) systems that map directly to enterprise ERP systems.",
    faqs: [
      {
        q: "Is there a direct viewer for EXB files in non-Chinese CAD environments?",
        a: "No, EXB is a highly proprietary structure. To view or edit EXB files in AutoCAD, BricsCAD, or GstarCAD, you must use CAXA's built-in batch conversion utility to export the sheets as standard DWG or DXF files first.",
      },
      {
        q: "How does EXB maintain compatibility with legacy DWG data?",
        a: "CAXA's graphics engine uses a dual-kernel database structure. When importing DWGs, it maps AutoCAD elements to native EXB drafting entities with extremely high fidelity. When exporting, it generates standard DWG containers, allowing Chinese manufacturers to exchange data with international partners.",
      },
    ],
  },
  vda: {
    slug: "vda",
    formatName: "VDA",
    formatValues: ["VDA", "VDAFS", "VDA-FS"],
    fullName: "VDA-FS Surface Interface File",
    intro:
      "VDA-FS (often saved as .vda) is a neutral 3D CAD data exchange specification defined by the German Association of the Automotive Industry (Verband der Automobilindustrie). Developed specifically to bypass geometric modeling engine discrepancies between CATIA and Siemens NX at the OEM level, VDA-FS is specialized for transferring highly complex mathematical Class-A surface geometry, freeform styling contours, and injection mold parting surfaces without translation errors.",
    faqs: [
      {
        q: "What is the primary technical limitation of VDA-FS compared to STEP?",
        a: "VDA-FS is strictly a surface format. It represents geometry as mathematical NURBS curves and faces; it cannot store solid model topology (B-Rep structures), assembly constraints, sheet metal properties, or Product Manufacturing Information (PMI). Supply chains have largely replaced it with STEP AP214 and AP242.",
      },
      {
        q: "Which industries still maintain active support for VDA-FS files?",
        a: "The German automotive sector (including Mercedes-Benz, BMW, Audi and their Tier-1 stamping mold suppliers) maintains VDA-FS compatibility inside high-end CAM systems and metrology software to verify stamping die geometries against legacy surface models.",
      },
    ],
  },
  cgr: {
    slug: "cgr",
    formatName: "CGR",
    formatValues: ["CGR", "3DXML"],
    fullName: "CATIA Graphical Representation",
    intro:
      "CGR (CATIA Graphical Representation) and its web-friendly packaging format, 3DXML, are lightweight, tessellated 3D visualization formats developed by Dassault Systèmes. Engineered to enable digital mockup (DMU) reviews of massive industrial assemblies, CGR files strip away the heavy, precise mathematical B-Rep (boundary representation) solid definitions. What remains is a highly optimized polygonal mesh shell that can be loaded in thousands of instances concurrently inside CATIA, ENOVIA, or web-based PLM platforms to perform clearance checks, clash analysis, and layout coordination.",
    faqs: [
      {
        q: "Can a CGR or 3DXML file be edited or parsed back into solid geometry?",
        a: "Direct editing is not possible because the exact solid boundaries are replaced with a flat triangulated mesh. However, designers use specialized CATIA reverse engineering modules or third-party mesh-to-solid tools to rebuild exact NURBS surfaces on top of the CGR polygonal shell.",
      },
      {
        q: "What is the role of 3DXML in modern enterprise PLM systems?",
        a: "3DXML acts as the universal viewing standard inside Dassault's 3DEXPERIENCE platform. It allows purchasing managers, structural testers, and executive stakeholders to view, rotate, section, and measure full multi-level product models directly in their web browsers without a local CAD license.",
      },
    ],
  },
  catpart: {
    slug: "catpart",
    formatName: "CATPART",
    formatValues: ["CATPART", "CATPRODUCT"],
    fullName: "CATIA Part and Product File",
    intro:
      "CATPart and CATProduct are the native geometric modeling formats of Dassault Systèmes CATIA, the high-end PLM software suite dominant in the global aerospace, defense, and automotive OEM sectors. A CATPart stores mathematically perfect solid models, complex multi-patch Class-A surfaces, functional tolerances, and tooling definitions built on Dassault's proprietary CGM (Convergence Geometric Modeler) engine. A CATProduct manages the assembly hierarchies, positioning coordinates, and links to external parts. Because of their advanced mathematical structure, opening these files directly in mid-range CAD engines requires certified translation layers.",
    faqs: [
      {
        q: "Why do CATIA files require specialized translation compared to SolidWorks files?",
        a: "Mid-range CAD tools like SolidWorks use the Parasolid kernel. CATIA uses the proprietary CGM engine. Translating CATPart geometry to Parasolid requires mapping complex NURBS face continuities (G2/G3). Without a certified CGM-to-Parasolid translator, the imported model often exhibits missing faces, open edges, or self-intersecting surfaces.",
      },
      {
        q: "What is the difference between CATIA V5 and V6 file structures?",
        a: "CATIA V5 uses standard file-based document trees (.CATPart and .CATProduct saved on local drives). CATIA V6 (and 3DEXPERIENCE) uses a database-driven architecture, saving design components as discrete database entries, allowing for real-time collaborative concurrent design without file locking.",
      },
    ],
  },
  nxprt: {
    slug: "nxprt",
    formatName: "NXPRT",
    formatValues: ["NXPRT", "NX-PRT"],
    fullName: "Siemens NX Part and Assembly",
    intro:
      "NX PRT is the native database file format of Siemens NX (formerly Unigraphics), a high-end enterprise CAD/CAM/CAE system. Unlike mid-range CAD platforms that split components into separate part (.sldprt) and assembly (.sldasm) formats, NX uses a unified .prt extension for parts, assemblies, CNC toolpaths, and finite element meshes. Built natively on the Parasolid geometric kernel, NX PRT files are designed to manage massive product structures and maintain absolute downstream parametric associativity throughout the entire lifecycle.",
    faqs: [
      {
        q: "Can SolidWorks open an NX PRT file natively since both share the Parasolid kernel?",
        a: "Yes, SolidWorks can read the 3D solid geometry from an NX .prt file natively. However, because each software wraps the Parasolid data in its own proprietary feature history wrapper, the parametric design tree (history of steps) will not be imported. The model will appear as a static solid body.",
      },
      {
        q: "How does NX manage huge assemblies within a single PRT file structure?",
        a: "NX utilizes 'Assembly Component' references. The master assembly .prt file does not copy the geometry of the sub-parts; instead, it saves pointer links to the independent component .prt files and records spatial position matrices, keeping file sizes small and enabling concurrent engineering.",
      },
    ],
  },
  creoprt: {
    slug: "creoprt",
    formatName: "CREOPRT",
    formatValues: ["CREOPRT", "CREO-PRT", "CREO-ASM"],
    fullName: "PTC Creo Part and Assembly",
    intro:
      "Creo PRT and ASM are the native formats of PTC Creo (historically Pro/ENGINEER), the platform that pioneered history-based parametric 3D CAD modeling. These files store precise double-precision boundary representation (B-Rep) solids, parametric relationships, equations, and assembly constraints. Known for its mathematically rigorous handling of complex mechanisms and sheet metal flat patterns, the Creo file format maintains active, bi-directional links between the 3D model, downstream structural simulations, and CNC manufacturing toolpaths.",
    faqs: [
      {
        q: "Why do Creo files have numbers appended to their extensions (e.g., part.prt.1, part.prt.2)?",
        a: "Creo uses a built-in version backup system. Instead of overwriting the file on disk during a save, it increments the number suffix. To open the latest version, the CAD system automatically selects the highest number. Older versions can be purged using Creo's cleanup utility.",
      },
      {
        q: "How do Creo parts maintain external references across assemblies?",
        a: "Creo uses a system of 'Skeleton Models' and 'Copy Geometry' features. Designers reference a skeleton file representing the master assembly dimensions, ensuring that any top-level dimension change propagates down to the individual Creo part files automatically without creating cyclic errors.",
      },
    ],
  },
  slddrw: {
    slug: "slddrw",
    formatName: "SLDDRW",
    formatValues: ["SLDDRW"],
    fullName: "SolidWorks Drawing",
    intro:
      "SLDDRW is the native 2D technical drawing sheet format utilized by Dassault Systèmes SolidWorks to generate manufacturing-ready documentation. While sldprt and sldasm represent the 3D model, SLDDRW files store the associated 2D projection views, detailed section cuts, dimensions, welding symbols, and BOM tables. SLDDRW files maintain a live, bidirectional link to the 3D database: if you modify a sketch dimension on the 3D part, the 2D sheet dimensions update automatically.",
    faqs: [
      {
        q: "Can I open and print an SLDDRW drawing file without having the original SLDPRT files?",
        a: "Yes. SolidWorks has a detailing mode and a free eDrawings viewer that allows you to open, measure, print, and annotate SLDDRW files without local access to the 3D geometry. However, you cannot make model-driven dimension changes or update projected views without the 3D files.",
      },
      {
        q: "How do CAD managers prevent broken link issues with SLDDRW sheets?",
        a: "By using SolidWorks PDM (Product Data Management) or strict folder naming conventions. PDM maintains database pointer associations, ensuring that if a 3D part is renamed or moved to another directory, the drawing sheet's references are updated automatically.",
      },
    ],
  },
  idw: {
    slug: "idw",
    formatName: "IDW",
    formatValues: ["IDW"],
    fullName: "Autodesk Inventor Drawing",
    intro:
      "IDW is the native 2D drafting sheet format used by Autodesk Inventor to compile production-ready blueprints, section specifications, and assembly detail bills. It maps 3D parametric components directly onto 2D drawing sheets. IDW files maintain absolute associativity with the parent IPT (parts) and IAM (assemblies) files, automatically redrawing viewport projections, centerlines, and dimension callouts whenever the parent 3D components are modified.",
    faqs: [
      {
        q: "Should I select IDW or Inventor-DWG when creating drawings in Autodesk Inventor?",
        a: "Use IDW if your workspace is purely Inventor-based, as it yields slightly smaller file sizes. Use Inventor-DWG if you need to share drawing sheets with AutoCAD users, allowing them to open, view, and print the sheets natively in 2D without exporting.",
      },
    ],
  },
  f3d: {
    slug: "f3d",
    formatName: "F3D",
    formatValues: ["F3D", "F3Z"],
    fullName: "Autodesk Fusion 360 Archive",
    intro:
      "F3D and F3Z are the native export formats of Autodesk Fusion 360, a cloud-first CAD/CAM/CAE platform. Since Fusion 360 stores projects by default in Autodesk's cloud servers, F3D acts as a local backup archive for an individual part. F3Z is a zipped container used for assemblies, archiving the top-level model along with all externally referenced part files. These archives contain full parametric feature trees, multi-body geometry, simulation meshes, rendering parameters, and CNC CAM toolpaths.",
    faqs: [
      {
        q: "How do I open an F3D file offline?",
        a: "You can import F3D files directly into the Fusion 360 desktop client. Once loaded, you can edit the models in offline mode; the software will automatically queue changes and sync the design back to your cloud hub once internet connection is re-established.",
      },
    ],
  },
  skp: {
    slug: "skp",
    formatName: "SKP",
    formatValues: ["SKP"],
    fullName: "SketchUp Document",
    intro:
      "SKP is the native file format utilized by Trimble SketchUp, a widely popular 3D modeling application used in architecture, interior design, civil engineering, and video game development. SKP files store 3D models composed of faces and edges (polygon mesh representation) rather than parametric solid kernels. SKP documents are designed for rapid conceptual sketching, supporting custom materials, component libraries, scenes, and geographic styles.",
    faqs: [
      {
        q: "How do I open and view SKP files for free?",
        a: "SketchUp offers 'SketchUp Viewer' (available for free on Windows, macOS, iOS, and Android) to view and present 3D models. Alternatively, Trimble publishes 'SketchUp Free', a web browser-based modeler that lets you open, view, and make basic edits to SKP files directly without any desktop installation.",
      },
      {
        q: "How can I import SKP files into other CAD software like Revit or AutoCAD?",
        a: "Autodesk Revit and AutoCAD support direct SKP imports. When importing into Revit, SKP components are mapped as Revit families, and textures can be customized in the materials editor. Alternatively, you can export SketchUp models to DWG, DXF, or IFC formats to preserve structured metadata.",
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
  "landscape-architects": {
    slug: "landscape-architects",
    displayName: "Landscape Architects",
    shortNoun: "landscape architect",
    filter: (t) =>
      hasAny(t.industries, [
        "Landscape",
        "Landscape Architecture",
        "Urban Planning",
        "Site Design",
        "GIS",
      ]) ||
      /landscape|garden|terrain|urban planning|gis|planting/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro:
      "Landscape architecture and urban design require CAD tools that blend 3D architectural modeling with precise site terrain grading, GIS data integration, stormwater runoff analysis, and comprehensive planting schedules. Unlike standard building architects, landscape designers deal with living materials, non-linear terrains, and large-scale geographic coordinates. The 2026 landscape ecosystem is led by Vectorworks Landmark, dedicated Rhino plugins (like Lands Design), and GIS-enabled civil platforms that automate site-specific workflows. Below are the premier landscape design and site grading tools.",
    faqs: [
      {
        q: "What is the best software for landscape architecture?",
        a: "Vectorworks Landmark is widely considered the industry standard for dedicated landscape architecture, offering integrated GIS, terrain modeling, and vast botanical databases. For 3D concept designs, Rhino 3D combined with Lands Design is incredibly popular, while Revit remains the choice for landscape teams collaborating closely with BIM consultants.",
      },
      {
        q: "How does GIS data integrate with landscape CAD?",
        a: "Modern landscape CAD platforms can connect directly to Esri ArcGIS servers or import Shapefiles (SHP) and geo-referenced images. This automatically aligns the site plan with real-world geographic coordinates, elevation surveys, and regional environmental datasets.",
      },
    ],
  },
  "hvac-engineers": {
    slug: "hvac-engineers",
    displayName: "HVAC & MEP Engineers",
    shortNoun: "MEP engineer",
    filter: (t) =>
      hasAny(t.industries, ["MEP", "HVAC", "Plumbing", "Piping", "AEC", "Construction"]) &&
      (hasAny(t.core_features, ["Piping", "Harness", "Wiring", "BIM Integration", "Simulation"]) ||
        /hvac|pipe|duct|mep|plumbing|ventilation|clash detection/i.test(t.name + " " + t.short_desc + " " + t.description)),
    intro:
      "HVAC, electrical, and plumbing (MEP) engineers design the complex systems that make buildings function. In 2026, MEP CAD has moved entirely into 3D BIM integration, allowing engineers to route ductwork, calculate piping flows, and map electrical runs directly inside a virtual model. The primary focus is clash detection—preventing physical pipes and ducts from occupying the same space as structural beams before construction begins. Below are the top MEP, piping, and HVAC design tools in our database.",
    faqs: [
      {
        q: "Why is 3D BIM coordination critical for MEP engineers?",
        a: "In traditional 2D drafting, it is incredibly difficult to spot when a large HVAC duct collides with a steel beam or structural column. 3D BIM tools automatically detect these clashes during the design phase, saving thousands of dollars in construction rework.",
      },
      {
        q: "What is the difference between Revit MEP and other specialized MEP software?",
        a: "Revit MEP is integrated directly into the core Revit building model, ensuring real-time coordination with the architects. Other tools like MagiCAD or DDS-CAD operate as specialized add-ons or standalone platforms with highly optimized calculation engines for airflow and pipe pressure drops.",
      },
    ],
  },
  "interior-designers": {
    slug: "interior-designers",
    displayName: "Interior Designers",
    shortNoun: "interior designer",
    filter: (t) =>
      hasAny(t.industries, ["Interior Design", "Architecture", "Furniture", "AEC"]) ||
      /interior|furniture|kitchen|bath|rendering|space planning/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro:
      "Interior designers require CAD tools that emphasize fast 3D space planning, extensive libraries of furniture, fixtures, and equipment (FF&E), and high-quality photorealistic rendering for client presentations. While architects focus on structural integrity and building regulations, interior designers focus on aesthetic layouts, material specifications, and spatial flow. From simple 2D layouts to advanced VR walkthroughs, these are the top interior design tools.",
    faqs: [
      {
        q: "What is the best CAD software for interior design layout and styling?",
        a: "SketchUp is highly popular for quick concept design, space planning, and importing custom 3D warehouse furniture models. For high-end professional firms collaborating on construction documents, Revit and AutoCad remain standard, while dedicated tools like Chief Architect specialize in kitchen and bath modeling.",
      },
      {
        q: "Do interior designers need to output CAD drawings?",
        a: "Yes. Interior designers produce construction documentation including partition layouts, lighting plans, finish schedules, and detailed elevation drawings of custom cabinetry (millwork) for contractors to build from.",
      },
    ],
  },
  "construction-managers": {
    slug: "construction-managers",
    displayName: "Construction Managers",
    shortNoun: "construction manager",
    filter: (t) =>
      t.category_id === "c4" ||
      hasAny(t.industries, ["Construction", "AEC", "Project Management"]) ||
      /construction|takeoff|estimating|viewer|bluebeam|navisworks|redline|markup/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro:
      "Construction managers and general contractors rely on CAD/BIM tools not for designing, but for execution, coordination, cost estimation, and schedule validation. In 2026, the construction site uses digital models for quantity takeoff (extracting materials and dimensions), 4D simulation (linking the model to construction schedules), and real-time site inspection. These tools focus on PDF markup, multi-discipline model consolidation, and high-fidelity file viewing. Below are the top construction coordination and estimation tools.",
    faqs: [
      {
        q: "Why do construction managers use Navisworks or Bluebeam?",
        a: "Navisworks allows managers to combine architectural, structural, and MEP models from different software into one file to run clash detection and construction sequences. Bluebeam Revu is the standard for marking up 2D PDF blueprints, tracking RFIs, and performing digital material estimates.",
      },
      {
        q: "What is 4D and 5D BIM in construction?",
        a: "4D BIM adds the element of time (linking the CAD model to a Gantt scheduling chart to animate construction progress). 5D BIM adds cost estimation, dynamically calculating material quantities and budgets directly from the model components.",
      },
    ],
  },
  "industrial-designers": {
    slug: "industrial-designers",
    displayName: "Industrial Designers",
    shortNoun: "industrial designer",
    filter: (t) =>
      hasAny(t.industries, ["Industrial Design", "Product Design", "Consumer Electronics", "Automotive"]) &&
      (hasAny(t.core_features, ["Surface Modeling", "Direct Modeling", "Subdivision Modeling", "Rendering"]) ||
        /industrial design|styling|ergonomic|nurbs|surface|concept model/i.test(t.name + " " + t.short_desc + " " + t.description)),
    intro:
      "Industrial designers bridge the gap between aesthetics, human factors, and engineering feasibility. Their CAD workflows demand advanced freeform modeling tools (like NURBS and subdivision surfaces) to design complex ergonomic curves and organic shapes, combined with fast photorealistic rendering to present design concepts. In 2026, tools like Rhino 3D, Alias, and Shapr3D allow industrial designers to iterate concepts rapidly before exporting precise solid geometry to mechanical engineering teams. Below are the top product and industrial design tools.",
    faqs: [
      {
        q: "What is the difference between industrial design CAD and mechanical CAD?",
        a: "Industrial design CAD (like Alias or Rhino) focuses on aesthetic styling, shape exploration, and Class-A surfacing using mathematical curves. Mechanical CAD (like SolidWorks or Inventor) focuses on parametric accuracy, mechanical assemblies, drawings, and manufacturing constraints.",
      },
      {
        q: "Why is Rhino 3D highly favored by industrial designers?",
        a: "Rhino offers an incredibly flexible command structure and precise NURBS modeling at an accessible price point. It allows designers to model almost any shape imaginable without the strict history-tree constraints of traditional parametric software.",
      },
    ],
  },
  "cnc-machinists": {
    slug: "cnc-machinists",
    displayName: "CNC Machinists & CAM",
    shortNoun: "CNC machinist",
    filter: (t) =>
      hasAny(t.industries, ["Manufacturing", "Machining", "Tooling"]) ||
      hasAny(t.core_features, ["CAM", "CNC", "Toolpath", "Milling", "Turning", "G-code"]) ||
      /machinist|cam |cnc |toolpath|milling|turning|g-code/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro:
      "CNC Machinists and Computer-Aided Manufacturing (CAM) engineers translate digital 3D designs into physical metal or plastic parts. In 2026, the machinist's toolchain uses CAM software to analyze 3D geometry, define cutting tool selections, calculate optimal toolpaths (cutting trajectories), and simulate the machining sequence to prevent collisions. Below are the premier CAM programming and machine toolpath simulation tools in our catalog.",
    faqs: [
      {
        q: "What is a post-processor in CAM software?",
        a: "A post-processor is a translator script within CAM software that converts the universal cutting paths into the specific G-code dialect required by your specific CNC machine controller (like Fanuc, Haas, or Heidenhain).",
      },
      {
        q: "What is the benefit of high-speed machining (HSM) toolpaths?",
        a: "HSM toolpaths use continuous, smooth trochoidal loops rather than sharp angles. This maintains a constant load on the cutter, allowing much faster feeds, reducing cycle times, and preventing tool breakage.",
      },
    ],
  },
  "cad-managers": {
    slug: "cad-managers",
    displayName: "CAD & BIM Managers",
    shortNoun: "CAD manager",
    filter: (t) =>
      t.category_id === "c1" ||
      t.category_id === "c3" ||
      hasAny(t.industries, ["AEC", "Mechanical", "Manufacturing"]) &&
      /manager|enterprise|standard|admin|licensing|deployment/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro:
      "CAD and BIM Managers oversee a firm's design technology stack, license compliance, network deployments, template standardization, and training protocols. Rather than modeling, they focus on inter-operability, cost ROI of software subscriptions (such as Autodesk enterprise plans versus perpetual alternative buyouts), and workflow integration across large drafting teams. Below are the major industry-standard platforms managed by design IT administrators globally.",
    faqs: [
      {
        q: "What is a primary challenge for modern CAD managers?",
        a: "Managing the transition from local desktop hardware to cloud-based CAD/BIM environments while maintaining strict data governance, active directory (SSO) security, and budgeting variable subscription costs.",
      },
      {
        q: "How do CAD managers reduce licensing costs?",
        a: "By auditing software usage, deploying network/floating licenses where possible, and strategically replacing expensive Autodesk seats with high-compatibility alternative CAD engines (like BricsCAD or ZWCAD) for basic 2D drafters.",
      },
    ],
  },
  "structural-engineers": {
    slug: "structural-engineers",
    displayName: "Structural Engineers",
    shortNoun: "structural engineer",
    filter: (t) =>
      hasAny(t.industries, ["Structural Engineering", "Construction", "AEC", "Civil Engineering"]) &&
      /structural|staad|etabs|sap2000|risa|robot|idea|connection|fea|analysis|concrete|steel|timber|seismic|wind|foundation|retaining/i.test(t.name + " " + t.short_desc + " " + (t.core_features || []).join(" ")) ||
      ["sap2000", "etabs", "staad-pro", "autodesk-robot", "idea-statica", "risa-3d"].includes(t.slug),
    intro:
      "Structural engineers live in the space between architecture and physics — turning schematic designs into load-bearing reality. The tools in this category handle finite element analysis, steel and concrete connection design, seismic and wind load calculations, and BIM-integrated structural coordination. Whether you are running a high-rise through ETABS or detailing steel connections in IDEA StatiCa, below are the platforms that structural engineers rely on daily.",
    faqs: [
      {
        q: "What is the best structural analysis software for buildings?",
        a: "CSI ETABS is the industry standard for building structural analysis, particularly for high-rise and seismic design. For general-purpose analysis (bridges, towers, industrial), CSI SAP2000 and Bentley STAAD.Pro are the leading choices. RISA-3D is popular in US consulting offices for light commercial and residential.",
      },
      {
        q: "STAAD.Pro vs ETABS — which should I choose?",
        a: "ETABS is purpose-built for building analysis with strong seismic and wind load capabilities. STAAD.Pro is more general-purpose and excels in industrial structures, offshore, and infrastructure projects. Many structural firms maintain licenses for both.",
      },
      {
        q: "How does BIM integration work for structural engineers?",
        a: "Autodesk Robot Structural Analysis links directly with Revit for BIM-driven structural workflows — model changes in Revit propagate to Robot for analysis. CSI ETABS and SAP2000 also import IFC models from Revit and ArchiCAD. IDEA StatiCa connects to both Revit and ETABS for steel connection detailing.",
      },
    ],
  },
  "surveyors": {
    slug: "surveyors",
    displayName: "Land Surveyors",
    shortNoun: "land surveyor",
    filter: (t) =>
      hasAny(t.industries, ["Surveying", "Land Development", "Mapping"]) ||
      /survey|gnss|total.station|field.to.finish|data.collector|cadastral|topograph/i.test(t.name + " " + t.short_desc + " " + (t.core_features || []).join(" ")) ||
      ["carlson-survey", "microsurvey"].includes(t.slug),
    intro:
      "Land surveyors need CAD tools that speak the language of field-to-finish workflows — importing total station and GNSS data, processing field collector files, generating cadastral plans, and producing topographic surface models. Unlike general civil engineering, surveying CAD prioritizes coordinate geometry (COGO), legal description generation, and compatibility with data collectors like Carlson SurvCE. Below are the tools that land surveyors depend on for production work.",
    faqs: [
      {
        q: "What is the best CAD software for land surveyors?",
        a: "Carlson Survey is the dominant choice for US land surveyors, running on AutoCAD or bundled IntelliCAD with strong total-station and GNSS integration. For civil engineering firms that also do surveying, Autodesk Civil 3D with its survey tools is a common alternative.",
      },
      {
        q: "Can I use AutoCAD for surveying?",
        a: "AutoCAD alone lacks survey-specific COGO and field-to-finish tools. Most surveyors add Carlson Survey or MicroSurvey as a companion. Civil 3D includes basic survey functionality but is heavier and more expensive than dedicated surveying CAD.",
      },
      {
        q: "Do surveyors need drone or point cloud processing?",
        a: "Increasingly yes. Drone photogrammetry and LiDAR scans are replacing traditional topographic surveys. Tools like Carlson Survey and Civil 3D both import point clouds, but dedicated processing software (Bentley ContextCapture, Agisoft Metashape) is often used upstream to generate the surface models.",
      },
    ],
  },
  "fashion-designers": {
    slug: "fashion-designers",
    displayName: "Fashion & Apparel Designers",
    shortNoun: "fashion designer",
    filter: (t) =>
      hasAny(t.industries, ["Fashion", "Apparel", "Textile", "Luxury", "Footwear"]) ||
      /garment|pattern|apparel|fashion|textile|fabric|virtual.sampl|clo3d|browzwear|optitex|accumark|modaris|shoemaster/i.test(t.name + " " + t.short_desc + " " + (t.core_features || []).join(" ")),
    intro:
      "Fashion and apparel designers have their own specialized CAD ecosystem — 2D pattern making, grading, marker making, and 3D virtual garment simulation. Tools like CLO 3D and Browzwear VStitcher let brands replace physical samples with photoreal digital prototypes, while Gerber AccuMark and Lectra Modaris remain the backbone of production pattern making in global apparel factories. Below are the CAD platforms powering the fashion industry.",
    faqs: [
      {
        q: "What is the best 3D fashion design software?",
        a: "CLO 3D is the leading 3D garment design tool for fashion brands and indie designers — intuitive draping, fabric simulation, and virtual fitting. Browzwear VStitcher is the enterprise alternative, stronger in technical development and integration with PLM systems. Both replace physical sampling with digital prototypes.",
      },
      {
        q: "CLO 3D vs Browzwear — which should I choose?",
        a: "CLO 3D for design-led teams and smaller brands — it has a gentler learning curve and better visualization. Browzwear VStitcher for large apparel manufacturers — it has deeper technical pattern tools, PLM integration, and is built for enterprise scale. Many brands use both: CLO for concept, Browzwear for production.",
      },
      {
        q: "What is the industry standard for apparel pattern making?",
        a: "Gerber AccuMark (now Lectra) and Lectra Modaris are the two dominant 2D pattern making and grading systems in global apparel manufacturing. Virtually every major apparel factory runs one or both. Optitex is a strong alternative with integrated 3D simulation.",
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

/** ---------- Sector / Industry vertical pages ----------------------
 * `/sectors/[slug]` — one page per industry vertical.
 * Targets long-tail keywords: "best CAD for automotive design",
 * "CAE and FEA software comparison", "woodworking CNC CAD", etc.
 */
export interface SectorPage {
  slug: string;
  /** Display name in H1 ("CAE & Simulation", "Automotive & Auto Parts"). */
  displayName: string;
  /** Singular noun for body copy ("simulation engineer", "automotive designer"). */
  shortNoun: string;
  /** Filter function for which tools belong on this list. */
  filter: (t: Tool) => boolean;
  /** ~120-word custom intro paragraph specific to this sector. */
  intro: string;
  faqs: { q: string; a: string }[];
}

export const SECTOR_PAGES: Record<string, SectorPage> = {
  cae: {
    slug: "cae",
    displayName: "CAE & Simulation",
    shortNoun: "simulation engineer",
    filter: (t) => t.category_id === "c5" && (
      (t.industries ?? []).some(i => ["CAE", "Simulation", "Aerospace", "Automotive", "Structural"].includes(i)) ||
      (t.core_features ?? []).some(f => ["FEA", "Simulation", "CFD", "Thermal Analysis", "Structural Analysis"].includes(f)) ||
      /cae|fea|finite element|simulation|cfd|multiphysics/i.test(t.name + " " + t.short_desc + " " + t.description)
    ),
    intro: "Computer-Aided Engineering (CAE) and Finite Element Analysis (FEA) are critical for validating designs before physical prototyping. In 2026, simulation is no longer a late-stage validation step; it is integrated directly into the design process with real-time solvers, generative design, and multiphysics capabilities. From structural mechanics to computational fluid dynamics (CFD) and electromagnetic analysis, these tools help engineers optimize performance, weight, and durability. Below are the top-rated CAE and simulation suites in our database, sorted by expert score and review depth.",
    faqs: [
      {
        q: "What is the difference between FEA and CFD?",
        a: "FEA (Finite Element Analysis) is primarily used for structural, thermal, and modal analysis of solid bodies. CFD (Computational Fluid Dynamics) simulates fluid flow (liquids and gases) and thermal interaction within or around complex geometries.",
      },
      {
        q: "Is cloud-based simulation secure for sensitive intellectual property?",
        a: "Yes. Modern cloud simulation platforms use military-grade end-to-end encryption, multi-tenant isolation, and comply with strict security standards like SOC 2 Type II and ISO 27001. Leading aerospace and defense companies regularly utilize secure cloud environments for simulation.",
      },
      {
        q: "Do I need a high-end workstation to run CAE software?",
        a: "For traditional desktop solvers, a high-core-count CPU, massive RAM (64GB+), and workstation-grade GPUs are required. However, cloud-native platforms offload solver calculations to remote HPC clusters, allowing you to run complex simulations on an ordinary laptop.",
      },
    ],
  },
  cam: {
    slug: "cam",
    displayName: "CAM & CNC Manufacturing",
    shortNoun: "CNC machinist",
    filter: (t) => t.category_id === "c5" && (
      (t.industries ?? []).some(i => ["Manufacturing", "Machining", "Tooling"].includes(i)) ||
      (t.core_features ?? []).some(f => ["CAM", "CNC", "Toolpath", "Milling", "Turning", "G-code"].includes(f)) ||
      /cam|cnc|toolpath|machin|milling|turning|g-code/i.test(t.name + " " + t.short_desc + " " + t.description)
    ),
    intro: "Computer-Aided Manufacturing (CAM) bridges the gap between digital 3D design and physical production. Modern CAM tools translate complex 3D CAD geometry into precise G-code to drive CNC mills, lathes, EDM machines, and multi-axis machining centers. The 2026 manufacturing landscape demands seamless CAD/CAM integration to avoid translation errors, automated toolpath generation, dynamic collision avoidance, and specialized high-speed machining (HSM) cycles that reduce tool wear and cycle times. Below are the premier CAM software packages currently ranked.",
    faqs: [
      {
        q: "What are the benefits of integrated CAD/CAM versus standalone CAM?",
        a: "Integrated CAD/CAM (like Fusion 360 or SolidCAM inside SolidWorks) eliminates file conversion issues and maintains associativity. If you change the 3D model, the toolpaths automatically update. Standalone CAM is preferred by dedicated machine shops that receive file formats from multiple different client CAD tools.",
      },
      {
        q: "What is high-speed machining (HSM) or dynamic milling?",
        a: "These are advanced toolpath strategies that maintain a constant tool load and engagement angle. By avoiding sharp corners and heavy cuts, they allow the machine to run at much higher speeds, reducing cycle times by up to 70% and extending tool life.",
      },
      {
        q: "How many axes of machining do I need?",
        a: "2.5-axis and 3-axis cover basic flat or organic milling. 4-axis adds rotational capabilities for cylindrical parts. 5-axis allows the tool to approach the part from any angle, enabling complex aerospace/medical components in a single setup.",
      },
    ],
  },
  "3d-printing": {
    slug: "3d-printing",
    displayName: "3D Printing & Additive Manufacturing",
    shortNoun: "additive specialist",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Additive Manufacturing", "3D Printing", "Hobbyist", "Maker"].includes(i)) ||
      (t.core_features ?? []).some(f => ["Slicing", "Slicer", "3D Printing", "Mesh Repair"].includes(f)) ||
      /3d print|slicer|slicing|stl|additive/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "3D printing and additive manufacturing have transitioned from simple hobbyist prototyping to high-volume industrial production in 2026. Designing for additive manufacturing (DfAM) requires a unique toolchain, blending geometric modeling (NURBS or subdivision surfaces), mesh repair (STL/3MF optimization), topology optimization, lattice structure generation, and slicing. Below is a curated selection of CAD modellers, structural optimization suites, and precision slicing engines tailored for both industrial metal/polymer printers and desktop makers.",
    faqs: [
      {
        q: "Which file format is best for 3D printing in 2026?",
        a: "While STL remains the most common, 3MF is the modern standard. 3MF is XML-based, compact, stores exact units, colors, material specifications, and internal lattice structures, eliminating typical mesh repair issues associated with STL.",
      },
      {
        q: "What is topology optimization in additive manufacturing?",
        a: "It is an algorithmic design method that strips away material from a non-critical load path, creating organic, bone-like shapes that are lightweight yet incredibly strong. These complex shapes can typically only be fabricated using 3D printing.",
      },
      {
        q: "Do I need a dedicated slicer for my 3D printer?",
        a: "Yes. Slicers slice the 3D mesh into horizontal layers and generate printer-specific G-code. Popular slicers include Ultimaker Cura, PrusaSlicer, and Bambu Studio, which are tailored to specific hardware architectures.",
      },
    ],
  },
  automotive: {
    slug: "automotive",
    displayName: "Automotive & Auto Parts",
    shortNoun: "automotive designer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Automotive", "Transportation", "Vehicle"].includes(i)) ||
      /automotive|vehicle|car |body-in-white/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "The automotive sector demands CAD/CAM software capable of handling massive assemblies, strict Class-A surface aesthetics, complex wiring harnesses, sheet metal press-forming, and rigorous safety simulation. From OEM-level vehicle layout to tier-1 auto parts engineering, automotive CAD tools integrate deeply with Product Lifecycle Management (PLM) systems. In 2026, the shift to electric vehicles and smart components requires multidisciplinary design platforms that unify mechanical, electronic, and software engineering.",
    faqs: [
      {
        q: "Which CAD systems do major automotive OEMs use?",
        a: "CATIA and Siemens NX are the industry standards for major automotive OEMs globally due to their high-end surface modeling, large assembly capabilities, and deep PLM integration. Tier-1 suppliers generally use SolidWorks, Creo, or Autodesk Inventor to align with OEM requirements.",
      },
      {
        q: "What is a Class-A surface in automotive design?",
        a: "A Class-A surface is a mathematically perfect surface with G3 curvature continuity, ensuring perfectly smooth highlights and reflections on visible parts like car body panels. This requires advanced NURBS surfacing tools found in CATIA, Alias, and Rhino.",
      },
      {
        q: "How does PLM fit into automotive CAD?",
        a: "Product Lifecycle Management (PLM) software (like Teamcenter or Windchill) tracks version control, bill of materials (BOM), supplier access, change orders, and manufacturing workflows across thousands of engineers working on the same vehicle platform.",
      },
    ],
  },
  "hydraulic-geotechnical": {
    slug: "hydraulic-geotechnical",
    displayName: "Hydraulic & Geotechnical",
    shortNoun: "geotechnical engineer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Hydraulic", "Geotechnical", "Civil Engineering", "Water", "Earthworks"].includes(i)) ||
      (t.core_features ?? []).some(f => ["Hydraulic", "Geotechnical", "Slope Stability", "Dam"].includes(f)) ||
      /hydraulic|geotechnical|soil|slope stability|geostudio|plaxis|earthwork/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Hydraulic and geotechnical engineering CAD deals with the design and analysis of earthworks, foundations, retaining structures, tunnels, dams, and water resource infrastructure. Unlike structural design, geotechnical workflows require modeling complex subsurface geology, soil mechanics, groundwater flow, and slope stability. In 2026, integrating geotechnical data with building information modeling (BIM) via open formats like IFC is key to mitigating risk, reducing construction cost, and ensuring long-term structural safety.",
    faqs: [
      {
        q: "Why do geotechnical engineers need specialized CAD software?",
        a: "Soil and rock behave non-linearly, and subsurface layers are highly irregular. General-purpose CAD cannot analyze soil-structure interaction, slope failure slip surfaces, or groundwater seepage, requiring specialized FEM solvers like Plaxis or GeoStudio.",
      },
      {
        q: "How is geotechnical data integrated into a BIM model?",
        a: "Geotechnical data (borehole logs, soil profiles) is integrated using specialized BIM plugins or import tools that map subsurface layers to 3D surfaces. The emerging IFC4.3 standard natively supports geotechnical and infrastructure objects.",
      },
      {
        q: "What is civil site design in hydraulic engineering?",
        a: "It involves grading, stormwater management, retention pond layout, and drainage pipe design. These workflows require precise dynamic grading tools that calculate cut-and-fill volumes automatically to minimize site disturbance.",
      },
    ],
  },
  aerospace: {
    slug: "aerospace",
    displayName: "Aerospace & Defense",
    shortNoun: "aerospace engineer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Aerospace", "Aviation", "Defense"].includes(i)) ||
      /aerospace|aircraft|aviation|spacecraft|satellite/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Aerospace engineering CAD operates at the absolute cutting edge of precision, performance, and complexity. Developing aircraft, spacecraft, satellites, and propulsion systems requires tools that handle millions of parts, advanced composites, high-end aerodynamic surfaces, and extreme structural simulations (FEA/CFD). The 2026 aerospace ecosystem demands rigorous compliance tracking, model-based definition (MBD) to eliminate 2D drawings, and seamless collaboration throughout a global supply chain under strict defense security protocols.",
    faqs: [
      {
        q: "Which CAD platforms dominate the aerospace industry?",
        a: "CATIA (Dassault Systèmes) and Siemens NX are the absolute standard for major aerospace manufacturers (Boeing, Airbus, Lockheed Martin, SpaceX). They are chosen for their unbeatable assembly capacity, advanced surfacing, and deep PLM links.",
      },
      {
        q: "What is Model-Based Definition (MBD)?",
        a: "MBD is the practice of embedding Product Manufacturing Information (PMI), such as dimensions, tolerances, and surface finishes, directly within the 3D CAD model. This serves as the single source of truth, reducing drawing overhead and downstream errors.",
      },
      {
        q: "How does composite design work in aerospace CAD?",
        a: "Aerospace CAD includes specialized composite modules (like CATIA CPD or NX Laminate) that model the ply layup, orientation, and draping behavior of carbon fiber parts, simulating structural strength and manufacturing feasibility.",
      },
    ],
  },
  "rail-transit": {
    slug: "rail-transit",
    displayName: "Rail & Rail Transit",
    shortNoun: "rail designer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Transportation", "Rail", "Rail Transportation", "Infrastructure"].includes(i)) ||
      /railway|railroad|rail transit|metro |trackwork|locomotive/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Rail transit CAD focuses on the complex design of railway networks, high-speed rail lines, metro systems, and light rail corridors. This specialized infrastructure vertical involves alignment design (horizontal and vertical profiles), station and platform layout, structural bridge/tunnel integration, catenary systems, signaling schematics, and digital trackwork modeling. In 2026, the industry standard relies on specialized BIM-for-infrastructure workflows to maintain safety clearance envelopes and plan construction stages with minimal operational disruption.",
    faqs: [
      {
        q: "What is alignment design in rail CAD?",
        a: "Alignment design is the calculation of horizontal curves, vertical profiles, and transition spirals (cant/superelevation) that ensure trains can travel safely and smoothly at design speeds, obeying physics-based structural constraints.",
      },
      {
        q: "How is clearance envelope analysis performed?",
        a: "Rail CAD suites include specialized swept-path analysis tools that simulate the spatial movement of train cars along the track, verifying that the dynamic vehicle outline does not collide with tunnels, platforms, or catenary masts.",
      },
      {
        q: "What software is preferred for rail infrastructure projects?",
        a: "Bentley OpenRail Designer is the global leader in rail design, built on the stable MicroStation engine. Autodesk Civil 3D is also widely used for track design, along with specialized European suites like Card-1 or NovaPOINT.",
      },
    ],
  },
  "medical-devices": {
    slug: "medical-devices",
    displayName: "Medical Devices & Implants",
    shortNoun: "medical device engineer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Medical", "Dental", "Healthcare", "Medical Devices", "Biomedical"].includes(i)) ||
      /medical device|dental|implant|prosthetic|surgical|orthopedic|anatomical/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Designing medical devices, surgical instrumentation, and custom anatomical implants requires CAD software that bridges the gap between organic human anatomy and high-precision engineering. Workflows often start with patient CT/MRI scans, translating voxels into 3D polygon meshes or mathematical surfaces. In 2026, medical CAD tools must support advanced organic surfacing, bio-compatible material specifications, additive manufacturing build prep, and rigid version control to comply with FDA, CE, and ISO 13485 regulations.",
    faqs: [
      {
        q: "How do medical CAD tools interface with CT or MRI scans?",
        a: "CT/MRI scanners output DICOM files. Specialized software (like Materialise Mimics or Geomagic) imports DICOM data, segments the voxels, and converts anatomical structures into 3D meshes (STL/3MF) which can then be imported into CAD for custom implant design.",
      },
      {
        q: "What is organic surfacing in medical device design?",
        a: "Human bones and organs are freeform and non-symmetrical. Medical CAD must support subdivision (SubD) surfaces, organic NURBS, and direct mesh modeling to model ergonomic handles, joint prosthetics, and patient-specific implants.",
      },
      {
        q: "What regulations affect medical CAD data?",
        a: "ISO 13485 requires strict quality management and design controls. Medical CAD systems must operate alongside PDM/PLM systems that maintain a complete history of revisions, design reviews, electronic signatures, and verification testing.",
      },
    ],
  },
  "sheet-metal": {
    slug: "sheet-metal",
    displayName: "Sheet Metal & Fabrication",
    shortNoun: "sheet metal designer",
    filter: (t) =>
      (t.core_features ?? []).some(f => ["Sheet Metal", "Unfolding", "Flat Pattern"].includes(f)) ||
      /sheet metal|sheet-metal|flat pattern|unfolding|bending|press brake/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Sheet metal CAD is a specialized mechanical engineering discipline focusing on parts manufactured by cutting, punching, bending, and forming flat sheet metal panels. Designing sheet metal parts requires deep knowledge of material deformation, bend allowances, and K-factors. In 2026, sheet metal CAD tools must offer dynamic unfolding engines that generate perfectly accurate flat patterns for laser/waterjet cutting and CNC press brakes, ensuring that the physical bent part matches the digital 3D model.",
    faqs: [
      {
        q: "What is a K-factor and why is it critical in sheet metal CAD?",
        a: "The K-factor represents the ratio of the neutral axis position to the material thickness. When metal is bent, the outer surface stretches and the inner surface compresses. CAD needs the correct K-factor to calculate the exact flat pattern length.",
      },
      {
        q: "Which CAD tools are best for sheet metal design?",
        a: "SolidWorks, Autodesk Inventor, Solid Edge, and BricsCAD have industry-leading, dedicated sheet metal environments. They offer automatic corner relief, bend tables, dynamic flattening, and direct sheet metal feature conversion from solid bodies.",
      },
      {
        q: "What is sheet metal nesting?",
        a: "Nesting is the process of arranging multiple flat pattern parts on a single raw sheet of metal to minimize scrap waste. Modern sheet metal CAD suites include nested layout engines that calculate optimal yields for laser, plasma, or CNC punch cutters.",
      },
    ],
  },
  "steel-structures": {
    slug: "steel-structures",
    displayName: "Steel Structures & Detailing",
    shortNoun: "structural detailer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Structural Engineering", "Steel Structures", "Construction"].includes(i)) ||
      (t.core_features ?? []).some(f => ["Steel Detailing", "Connection Design", "Rebar"].includes(f)) ||
      /steel structure|steel frame|structural steel|tekla structures/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Steel structures CAD is the backbone of industrial plants, multi-story buildings, bridges, and infrastructure framing. Designing steel structures requires specialized BIM modeling tools that can place standard rolled shapes (beams, columns, trusses), model complex structural connections (bolts, welds, gusset plates), and automatically generate CNC shop drawings. In 2026, deep integration with structural analysis solvers and open structural BIM formats (like CIS/2 or IFC) is mandatory for modern workflows.",
    faqs: [
      {
        q: "What is the difference between structural design and steel detailing?",
        a: "Structural design involves engineering calculations to size member profiles. Steel detailing is the creation of highly detailed 3D fabrication models showing every single plate, bolt, weld, and hole required to fabricate and erect the frame on site.",
      },
      {
        q: "Which software is the industry standard for steel detailing?",
        a: "Tekla Structures is the undisputed global leader in high-end steel detailing. Other strong professional choices include Autodesk Advance Steel, SDS2, and specialized structural detailing add-ons for general BIM tools like Revit.",
      },
      {
        q: "How does structural analysis link to steel CAD?",
        a: "Engineers analyze structural loads in CAE software (SAP2000, STAAD.Pro, midas Gen) and export structural profiles to steel detailing software. This bi-directional link ensures member sizes match calculation models perfectly.",
      },
    ],
  },
  "quantity-takeoff": {
    slug: "quantity-takeoff",
    displayName: "Quantity Takeoff & Cost Estimation",
    shortNoun: "estimator",
    filter: (t) =>
      (t.core_features ?? []).some(f => ["Quantity Takeoff", "Estimation", "Cost Estimating", "Measurement"].includes(f)) ||
      /quantity takeoff|takeoff|cost estimation|take-off|measurement|estimating/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Quantity takeoff (QTO) and cost estimation are critical components of the pre-construction bidding phase. Estimators must extract precise material quantities—such as concrete volumes, sheet metal weight, drywall areas, and pipe lengths—from 2D CAD blueprints and 3D BIM models. In 2026, automated QTO tools dramatically reduce human error, link 3D geometry directly to dynamic cost databases, and facilitate instant recalculations when design modifications occur.",
    faqs: [
      {
        q: "What is 5D BIM in cost estimation?",
        a: "5D BIM is the integration of cost estimation (5th dimension) directly with the 3D model geometry (3D) and the construction schedule (4D/time). As the model evolves, the cost and schedule update in real time.",
      },
      {
        q: "How does a 2D takeoff work compared to a 3D takeoff?",
        a: "2D takeoff involves manually tracing lines and polygons on PDF blueprints to calculate areas and lengths. 3D takeoff automatically queries BIM database properties, extracting exact volume, weight, and count metadata in seconds.",
      },
      {
        q: "What software is preferred for quantity takeoff?",
        a: "Bluebeam Revu is the standard for PDF-based 2D takeoff. Autodesk Takeoff (part of Construction Cloud) and CostX are market leaders for unified 2D and 3D takeoff workflows, while Trimble Nova and SCENE are used in heavy structural sectors.",
      },
    ],
  },
  "piping-pipeline": {
    slug: "piping-pipeline",
    displayName: "Piping & Pipelines",
    shortNoun: "piping designer",
    filter: (t) =>
      (t.core_features ?? []).some(f => ["Piping", "Routing", "Cabling", "HVAC Routing", "Piping Design"].includes(f)) ||
      /piping|routing|wiring harness|cabling|conduit|pipeline/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Piping and pipeline CAD handles the routing of pipes, valves, fittings, and supports in chemical plants, oil refineries, power stations, HVAC systems, and cross-country networks. Piping layout is governed by complex spatial constraints, chemical compatibility, and safety codes. In 2026, piping CAD relies on smart 3D routing engines that link directly to 2D Piping & Instrumentation Diagrams (P&IDs), automate isometric drawing generation, and run stress analysis to prevent thermal expansion failures.",
    faqs: [
      {
        q: "What is a P&ID and how does it link to 3D piping?",
        a: "A P&ID (Piping and Instrumentation Diagram) is a schematic drawing showing process flow and instrumentation. Modern piping CAD links the P&ID database directly to the 3D layout, highlighting routing discrepancies and ensuring all valves and instruments are placed correctly.",
      },
      {
        q: "What is a piping isometric drawing?",
        a: "A piping isometric is a simplified, non-scale 3D drawing of a single pipe run, showing exact cut lengths, fittings, weld locations, and a bill of materials (BOM). Fabricators use these drawings to pre-assemble pipe spools in a workshop.",
      },
      {
        q: "Which software is best for plant piping design?",
        a: "AutoCAD Plant 3D and AVEVA E3D Design are the leading tools for large-scale industrial plants. For mechanical assemblies, SolidWorks, Creo, and Siemens NX offer highly robust piping, cabling, and routing add-on modules.",
      },
    ],
  },
  "reverse-engineering": {
    slug: "reverse-engineering",
    displayName: "Reverse Engineering",
    shortNoun: "metrology specialist",
    filter: (t) =>
      ["geomagic-design-x", "rhino-3d", "solidworks", "fusion-360", "siemens-nx", "shapr3d"].includes(t.slug) ||
      (t.core_features ?? []).some(f => ["Reverse Engineering", "3D Scanning", "Point Cloud"].includes(f)) ||
      /reverse engineering|3d scan|point cloud|geomagic/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Reverse engineering is the process of digitizing a physical part to create a precise CAD model. This workflow is critical for replacing worn or broken machine components, modifying existing products, or capturing clay mockups. In 2026, reverse engineering CAD combines metrology-grade 3D scanning, point cloud registration, triangle mesh optimization, and advanced B-Rep surface reconstruction to convert raw scan data into fully parametric CAD models.",
    faqs: [
      {
        q: "How does reverse engineering CAD differ from standard 3D CAD?",
        a: "Standard CAD designs from scratch using mathematical shapes. Reverse engineering CAD must import massive mesh files (millions of triangles), align them to coordinate systems, and fit exact NURBS surfaces or parametric features to the scan geometry.",
      },
      {
        q: "What is a point cloud?",
        a: "A point cloud is a collection of millions of individual XYZ coordinate points captured by a 3D laser scanner or photogrammetry system, representing the external shape of a scanned physical object.",
      },
      {
        q: "Which software is recommended for Metrology and Reverse Engineering?",
        a: "Geomagic Design X is the gold standard for scan-to-CAD parametric modeling. PolyWorks and GOM Inspect are widely used for quality control inspection, while Rhino 3D with specialized plugins is popular for aesthetic shape reconstruction.",
      },
    ],
  },
  "agricultural-machinery": {
    slug: "agricultural-machinery",
    displayName: "Agricultural Machinery",
    shortNoun: "agricultural engineer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Agriculture", "Agricultural Machinery", "Heavy Equipment"].includes(i)) ||
      /agriculture|agricultural|tractor|combine harvester|farm machinery/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Agricultural machinery CAD focuses on the engineering and manufacturing of tractors, combine harvesters, seeders, and smart farming attachments. Designing heavy agricultural equipment requires CAD platforms that can handle massive mechanical assemblies, model rugged sheet metal chassis, and simulate mechanical stress, fluid flow, and terrain interaction in harsh, dusty, and muddy environments. In 2026, tools must support rapid design loops and PDM databases to streamline supply chain coordination.",
    faqs: [
      {
        q: "What challenges face agricultural machinery CAD designers?",
        a: "Machines operate under extreme vibrational, structural, and environmental loads. Designers must perform complex dynamic simulations (FEA) to verify structural integrity and design sealed components that keep dirt and moisture out.",
      },
      {
        q: "Which CAD systems do agricultural equipment OEMs use?",
        a: "Major OEMs (like John Deere, AGCO, CNH Industrial) standardise on Siemens NX or PTC Creo due to their powerful top-down assembly planning, advanced modeling capabilities, and robust global PLM infrastructures.",
      },
      {
        q: "How is IoT and smart tech integrated into agricultural CAD?",
        a: "Modern tractors use advanced electronics, sensors, and GPS guidance. CAD tools with integrated EDA (electronics design automation) and wire harness routing allow engineers to plan physical routing alongside mechanical models.",
      },
    ],
  },
  "woodworking-customization": {
    slug: "woodworking-customization",
    displayName: "Woodworking & Customization",
    shortNoun: "custom woodworker",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Woodworking", "Furniture", "Timber Construction", "Interior Design", "Whole-House Customization"].includes(i)) ||
      (t.core_features ?? []).some(f => ["Timber CAD", "Cabinet Design", "Furniture Design"].includes(f)) ||
      /woodworking|furniture|cabinet|timber|customization|panel cutting|wood design/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "Woodworking, cabinet making, and whole-house customization require CAD software that can design custom cabinetry, timber structures, and interior joinery while automatically generating production data. In 2026, this sector demands smart parametric models where changing room dimensions instantly updates cabinet widths, generates nested panel-cutting layouts for CNC wood routers, calculates hardware counts (hinges, drawer slides), and renders high-quality visualisations for client approvals.",
    faqs: [
      {
        q: "What is whole-house customization in modern CAD?",
        a: "It is the design of bespoke built-in wardrobes, kitchen cabinets, and wall paneling tailored to a specific home layout. Parameterization ensures that if the room width changes, the furniture scales dynamically according to predefined design rules.",
      },
      {
        q: "Why do woodworkers need specialized CAD/CAM?",
        a: "Standard CAD does not understand wood grain direction, board joint types (dowels, tenons), or edge-banding. Wood-specific CAD automates these details and links directly to CNC panel saws and nested router cutters.",
      },
      {
        q: "What software is preferred for custom woodworking?",
        a: "Top choices include Cabinet Vision and woodWOP for cabinetry. IMOS 3D and TopSolid Wood are leading high-end parametric systems. For architecture-heavy timber framing, cadwork is the standard, while SketchUp with plugins is highly popular for custom shops.",
      },
    ],
  },
  petrochemical: {
    slug: "petrochemical",
    displayName: "Petrochemicals & Plant Design",
    shortNoun: "plant designer",
    filter: (t) =>
      (t.industries ?? []).some(i => ["Oil & Gas", "Chemical", "Petrochemical", "Energy", "Process Industry"].includes(i)) ||
      /petrochemical|oil & gas|refinery|chemical plant|process piping|piping and instrumentation|p&id/i.test(t.name + " " + t.short_desc + " " + t.description),
    intro: "The petrochemical and process plant industry is home to some of the largest, most complex 3D digital models on earth. Designing refineries, chemical processing units, offshore platforms, and storage terminals requires CAD software capable of organizing massive layouts with thousands of pipes, structural columns, instruments, and items of equipment. In 2026, plant design CAD relies on database-driven architectures that enforce strict process engineering rules, check spatial clearances, and generate piping isometrics automatically.",
    faqs: [
      {
        q: "What are the core components of a petrochemical plant design suite?",
        a: "A complete plant design suite unifies 2D P&IDs, 3D equipment layouts, 3D structural steel design, smart 3D piping routing, clash detection, and database links that track line lists, valve schedules, and instrumentation datasheets.",
      },
      {
        q: "Which software systems lead the petrochemical plant design industry?",
        a: "AVEVA E3D Design (formerly PDMS) and Hexagon Smart 3D (formerly Intergraph) are the absolute standards for massive global petrochemical EPC projects. For mid-range and package design, AutoCAD Plant 3D and Bentley OpenPlant are highly popular.",
      },
      {
        q: "How is laser scanning used in petrochemical plant retrofits?",
        a: "Retrofitting active refineries is high-risk. Engineers laser scan the plant, import massive point clouds directly into CAD (using Navisworks or Leica CloudWorx), and route new piping around existing physical obstacles, verifying clash-free installation.",
      },
    ],
  },
};

export function sectorPagePaths(): { slug: string }[] {
  return Object.values(SECTOR_PAGES).map((s) => ({ slug: s.slug }));
}

export function getSectorPage(slug: string): SectorPage | undefined {
  return SECTOR_PAGES[slug];
}

export function toolsForSector(s: SectorPage): Tool[] {
  return tools.filter(s.filter).sort((a, b) => b.score - a.score);
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

export interface FreeSubPage {
  slug: string;
  displayName: string;
  categoryIds: string[];
  title: string;
  description: string;
  intro: string;
  faqs: { q: string; a: string }[];
}

export const FREE_SUBPAGES: Record<string, FreeSubPage> = {
  "2d-cad": {
    slug: "2d-cad",
    displayName: "2D CAD",
    categoryIds: ["c1"],
    title: "Best Free 2D CAD Software in 2026",
    description: "Free and open-source 2D drafting tools — LibreCAD, QCAD, NanoCAD, and more. No trials, no watermarks, no expiry.",
    intro: "Free 2D CAD has come a long way from the days of buggy DXF importers and missing dimension styles. In 2026, tools like LibreCAD and QCAD handle production drafting with clean DWG/DXF compatibility, proper layer management, and print-ready sheet layouts. Below are every free and freemium 2D CAD tool in our catalog, ranked by expert score.",
    faqs: [
      { q: "Is LibreCAD really free for commercial use?", a: "Yes. LibreCAD is GPL-licensed and has zero commercial restrictions. You can use it for paid drafting work with no license fees." },
      { q: "Can free 2D CAD open and edit DWG files?", a: "Most can. LibreCAD uses DXF natively but imports DWG via the libdxfrw library. NanoCAD Free and DWG FastView both handle DWG directly. Be aware that complex AutoCAD entities (dynamic blocks, annotative objects) may not survive the round-trip perfectly." },
      { q: "What is the best free alternative to AutoCAD for 2D drafting?", a: "For pure 2D drafting, NanoCAD Free (Windows) and LibreCAD (cross-platform) are the strongest options. QCAD Community Edition is also solid for simpler drawings." },
    ],
  },
  "3d-cad": {
    slug: "3d-cad",
    displayName: "3D CAD",
    categoryIds: ["c2"],
    title: "Best Free 3D CAD Software in 2026",
    description: "Free and open-source 3D modeling tools — FreeCAD, Blender, OpenSCAD, SolveSpace, and more. Parametric, mesh, and script-based options.",
    intro: "Free 3D CAD in 2026 is genuinely production-capable. FreeCAD delivers parametric solid modeling with a growing assembly workbench. Blender handles organic mesh modeling, sculpting, and rendering. OpenSCAD lets you build geometry from code. Below are every free and freemium 3D modeling tool in our catalog, sorted by expert score.",
    faqs: [
      { q: "Is FreeCAD good enough for professional mechanical design?", a: "FreeCAD has matured significantly and is now used in professional mechanical design, especially for small studios and startups that cannot justify SolidWorks or Fusion 360 subscriptions. The Part Design workbench is stable for parametric modeling, though the assembly workbench is still evolving." },
      { q: "Blender vs FreeCAD for 3D modeling?", a: "They serve different purposes. FreeCAD is a parametric solid modeler (good for engineering, dimensions, constraints). Blender is a polygon mesh modeler (good for organic shapes, animation, rendering). Many users run both." },
      { q: "Can I use free 3D CAD for commercial product design?", a: "FreeCAD, Blender, and OpenSCAD are all GPL or open-source licensed with no commercial-use restrictions. Fusion 360 Personal and Onshape Free are freemium but prohibit commercial use in their terms." },
    ],
  },
  bim: {
    slug: "bim",
    displayName: "BIM",
    categoryIds: ["c3"],
    title: "Best Free BIM Software in 2026",
    description: "Free and open-source Building Information Modeling tools — BlenderBIM, FreeCAD BIM, and freemium BIM options for architects.",
    intro: "Free BIM is the hardest category to fill in 2026. Native BIM authoring is still dominated by commercial tools (Revit, ArchiCAD, Vectorworks). However, BlenderBIM (IFC-native BIM inside Blender) and FreeCAD's BIM workbench are closing the gap rapidly, and several vendors offer free educational or community tiers. Below are all free and freemium BIM-capable tools in our catalog.",
    faqs: [
      { q: "Is BlenderBIM production-ready?", a: "BlenderBIM is the most mature open-source BIM authoring tool, with full IFC4 support and an active development community. It is usable for real projects, though it lacks the documentation automation and multi-discipline coordination features of Revit or ArchiCAD." },
      { q: "Can I get Revit for free?", a: "Revit is available free for students and educators through the Autodesk Education plan (1-year renewable). There is no free commercial tier. For commercial work, consider BlenderBIM or FreeCAD BIM as open-source alternatives." },
      { q: "What is the best free BIM software for small architecture firms?", a: "BlenderBIM for IFC-native modeling, FreeCAD BIM workbench for parametric architectural design, and SketchUp Free for concept massing. None of these match Revit's documentation output yet, but they cover modeling and coordination." },
    ],
  },
  pcb: {
    slug: "pcb",
    displayName: "PCB / EDA",
    categoryIds: ["c6"],
    title: "Best Free PCB Design Software in 2026",
    description: "Free and open-source PCB / EDA tools — KiCad, EasyEDA, LTspice, CircuitMaker, and more. From schematic to Gerber output at zero cost.",
    intro: "Free PCB design software is arguably the most mature segment of free CAD. KiCad is a production-grade EDA suite used by professional hardware companies. EasyEDA offers one-click fabrication through JLCPCB. LTspice dominates analog simulation. Below are every free and freemium EDA tool in our catalog, ranked by expert score.",
    faqs: [
      { q: "Is KiCad really good enough for professional PCB design?", a: "Yes. KiCad is used by professional hardware teams at companies like Tesla and SparkFun. It handles multi-layer boards, differential pairs, length matching, and 3D board visualization. The main gap vs Altium is in advanced constraint management and enterprise collaboration features." },
      { q: "KiCad vs EasyEDA — which should I choose?", a: "KiCad for professional desktop-based work with full offline control. EasyEDA for rapid prototyping with integrated PCB fabrication (JLCPCB). KiCad has better library management; EasyEDA has faster order-to-board workflow." },
      { q: "Can I design a 4-layer PCB with free EDA software?", a: "Absolutely. KiCad supports up to 32 copper layers. EasyEDA supports 6 layers on their free tier. Both handle impedance-controlled routing and 3D board previews." },
    ],
  },
  cam: {
    slug: "cam",
    displayName: "CAM / CNC",
    categoryIds: ["c5"],
    title: "Best Free CAM Software in 2026",
    description: "Free and open-source CAM / CNC programming tools — FreeCAD Path, Blender CAM, and freemium CAM options for makers and hobbyists.",
    intro: "Free CAM software has improved dramatically, though it still trails commercial packages like Mastercam and Fusion 360's CAM module in toolpath sophistication and post-processor coverage. FreeCAD's Path workbench and Blender CAM cover basic 2.5D and 3D routing. Below are all free and freemium CAM-capable tools in our catalog.",
    faqs: [
      { q: "Is free CAM software safe for production CNC machining?", a: "FreeCAD Path is suitable for simple 2.5D parts and hobbyist CNC work. For production machining with complex 3D surfacing, high-speed toolpaths, or 5-axis operations, commercial CAM (Fusion 360, Mastercam, NX CAM) is strongly recommended for both capability and safety." },
      { q: "Can I use FreeCAD Path for 3D carving?", a: "Yes, FreeCAD Path supports 3D surface machining with ball-nose toolpaths. It is slower and less optimized than commercial alternatives, but functional for wood, foam, and soft materials." },
      { q: "What is the best free CAM for a hobbyist CNC router?", a: "FreeCAD Path for 2.5D pocketing and profiling. For simple G-code editing and simulation, NCViewer (browser-based) is a handy companion tool." },
    ],
  },
  rendering: {
    slug: "rendering",
    displayName: "Rendering & Visualization",
    categoryIds: ["c7"],
    title: "Best Free CAD Rendering Software in 2026",
    description: "Free rendering and visualization tools for CAD — Blender Cycles, D5 Render Community, and freemium visualization options.",
    intro: "Free rendering has been transformed by GPU ray tracing and denoising. Blender's Cycles engine delivers photorealistic results on consumer GPUs. D5 Render Community Edition offers real-time architectural visualization. Below are all free and freemium rendering and visualization tools in our catalog, ranked by expert score.",
    faqs: [
      { q: "Can Blender Cycles match V-Ray or KeyShot for CAD rendering?", a: "For static product renders and architectural visualization, Cycles can produce results indistinguishable from commercial renderers. The main gap is in material library convenience (V-Ray's material library, KeyShot's drag-and-drop materials) and render speed on complex scenes." },
      { q: "Is D5 Render Community Edition really free?", a: "Yes, D5 Render Community is free with no time limit. It includes real-time ray tracing, PBR materials, and commercial use. The paid Pro tier adds higher resolution exports, asset library access, and advanced weather systems." },
      { q: "What hardware do I need for free CAD rendering?", a: "Blender Cycles works on both CPU and GPU (CUDA, OptiX, HIP, Metal). For real-time rendering (D5 Render, Unreal Engine), an NVIDIA RTX 3060 or better with 8GB+ VRAM is the practical minimum." },
    ],
  },
};

export function freeToolsByCategory(categoryIds: string[]): Tool[] {
  return tools
    .filter(
      (t) =>
        (t.pricing_type === "Free" ||
          t.pricing_type === "Freemium" ||
          t.pricing_type === "Open Source") &&
        categoryIds.includes(t.category_id),
    )
    .sort((a, b) => b.score - a.score);
}

export function freeSubPagePaths(): { slug: string }[] {
  return Object.values(FREE_SUBPAGES).map((p) => ({ slug: p.slug }));
}

export function getFreeSubPage(slug: string): FreeSubPage | undefined {
  return FREE_SUBPAGES[slug];
}

/** ---------- Article Search System ---------------------------------
 * Combine all article pages into a single searchable index
 */
export interface ArticleSearchItem {
  type: "best" | "compare" | "alternatives" | "platform" | "file-format" | "persona" | "sector";
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  url: string;
}

function normalizeStringForSearch(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ');
}

function generateBestOfArticles(): ArticleSearchItem[] {
  return categories.map((category) => ({
    type: "best",
    slug: category.slug,
    title: `Best ${category.name} Software`,
    description: `Top-rated ${category.name} tools, expertly reviewed and compared.`,
    keywords: [
      `best ${category.name}`,
      category.name.toLowerCase(),
      `top ${category.name}`,
      `free ${category.name}`,
    ],
    url: `/best/${category.slug}`,
  }));
}

function generateComparisonArticles(): ArticleSearchItem[] {
  return comparisonPairs().map((pair) => {
    const tool1Name = pair.a.name;
    const tool2Name = pair.b.name;
    return {
      type: "compare",
      slug: pair.pairSlug,
      title: `${tool1Name} vs ${tool2Name}`,
      description: `Expert comparison between ${tool1Name} and ${tool2Name}`,
      keywords: [
        `${tool1Name.toLowerCase()} vs ${tool2Name.toLowerCase()}`,
        `${tool1Name.toLowerCase()} alternative`,
        `${tool2Name.toLowerCase()} alternative`,
      ],
      url: `/compare/${pair.pairSlug}`,
    };
  });
}

function generateAlternativesArticles(): ArticleSearchItem[] {
  return tools.map((tool) => ({
    type: "alternatives",
    slug: tool.slug,
    title: `Best ${tool.name} Alternatives`,
    description: `Top alternatives to ${tool.name} with expert reviews.`,
    keywords: [
      `${tool.name.toLowerCase()} alternative`,
      `software like ${tool.name.toLowerCase()}`,
      `${tool.name.toLowerCase()} competitor`,
    ],
    url: `/alternatives/${tool.slug}`,
  }));
}

function generatePlatformArticles(): ArticleSearchItem[] {
  return Object.values(PLATFORM_PAGES).map((platform) => ({
    type: "platform",
    slug: platform.slug,
    title: `Best CAD Software for ${platform.displayName}`,
    description: platform.intro.slice(0, 150) + "...",
    keywords: [
      `cad for ${platform.slug}`,
      `${platform.slug.toLowerCase()} cad software`,
    ],
    url: `/platforms/${platform.slug}`,
  }));
}

function generateFileFormatArticles(): ArticleSearchItem[] {
  return Object.values(FILE_FORMAT_PAGES).map((format) => ({
    type: "file-format",
    slug: format.slug,
    title: `Software for ${format.formatName} Files`,
    description: format.intro.slice(0, 150) + "...",
    keywords: [
      `${format.formatName.toLowerCase()} viewer`,
      `${format.formatName.toLowerCase()} editor`,
      `${format.formatName.toLowerCase()} software`,
    ],
    url: `/file-formats/${format.slug}`,
  }));
}

function generatePersonaArticles(): ArticleSearchItem[] {
  return Object.values(PERSONA_PAGES).map((persona) => ({
    type: "persona",
    slug: persona.slug,
    title: `Best CAD for ${persona.displayName}`,
    description: persona.intro.slice(0, 150) + "...",
    keywords: [
      `cad for ${persona.shortNoun}`,
      `${persona.slug.toLowerCase()} cad software`,
    ],
    url: `/for/${persona.slug}`,
  }));
}

function generateSectorArticles(): ArticleSearchItem[] {
  return Object.values(SECTOR_PAGES).map((sector) => ({
    type: "sector",
    slug: sector.slug,
    title: `Best ${sector.displayName} Software`,
    description: sector.intro.slice(0, 150) + "...",
    keywords: [sector.slug.toLowerCase().replace(/-/g, " ")],
    url: `/sectors/${sector.slug}`,
  }));
}

let cachedAllArticles: ArticleSearchItem[] | null = null;

export function getAllArticles(): ArticleSearchItem[] {
  if (cachedAllArticles) return cachedAllArticles;
  cachedAllArticles = [
    ...generateBestOfArticles(),
    ...generateComparisonArticles(),
    ...generateAlternativesArticles(),
    ...generatePlatformArticles(),
    ...generateFileFormatArticles(),
    ...generatePersonaArticles(),
    ...generateSectorArticles(),
  ];
  return cachedAllArticles;
}

export function searchArticles(query: string, maxResults: number = 8): ArticleSearchItem[] {
  const normalizedQuery = normalizeStringForSearch(query);
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

  const articles = getAllArticles();

  const scoredArticles = articles.map((article) => {
    let score = 0;

    const searchText = normalizeStringForSearch(
      article.title + " " + article.description + " " + article.keywords.join(" "),
    );

    // 1. Exact title match gets highest priority
    if (normalizeStringForSearch(article.title).includes(normalizedQuery)) {
      score += 100;
    }

    // 2. Check if all query words are present (AND logic)
    const allWordsPresent = queryWords.every((word) => searchText.includes(word));
    if (allWordsPresent) {
      score += 50;
    }

    // 3. Individual keyword matches
    for (const word of queryWords) {
      if (searchText.includes(word)) {
        score += 15;
      }
    }

    // 4. Boost for free/open source queries
    if (query.toLowerCase().includes("free") || query.toLowerCase().includes("open source")) {
      if (article.type === "best" || article.type === "persona") {
        score += 30;
      }
    }

    return { ...article, score };
  });

  return scoredArticles
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

export function shouldSearchArticles(query: string, toolNames: string[]): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if query is exactly a single tool name (exact match first)
  const isExactToolName = toolNames.some((name) => {
    const normalizedName = name.toLowerCase().trim();
    return normalizedName === normalizedQuery;
  });

  if (isExactToolName) return false;

  // Check query length and complexity - 3 or more words = article search
  const wordCount = normalizedQuery.split(/\s+/).filter((w) => w.length > 0).length;
  if (wordCount >= 3) return true;

  // Check for article-specific keywords
  const articleKeywords = [
    "best", "top", "free", "open source", "vs", "vs.", "versus", "compare", "comparison", 
    "alternative", "alternatives", "like", "for", "how to", "what is", "which", 
    "software", "cad", "viewer", "editor", "platform", "mac", "linux", "web", "windows", 
    "ios", "android", "file format", "stl", "dwg", "step", "ifc", "for architect", 
    "for engineer", "guide", "list", "review", "comparing",
  ];

  const hasArticleKeyword = articleKeywords.some((kw) => normalizedQuery.includes(kw));
  if (hasArticleKeyword) return true;

  // Otherwise, prefer tools
  return false;
}

export type SearchMode = "tools" | "articles" | "both";

export function determineSearchMode(query: string, toolNames: string[]): SearchMode {
  if (!query.trim()) return "both";
  
  // First check if we should search articles
  if (shouldSearchArticles(query, toolNames)) return "articles";

  // Otherwise search tools
  return "tools";
}


