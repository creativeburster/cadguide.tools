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
