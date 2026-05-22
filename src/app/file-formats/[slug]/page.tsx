import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FILE_FORMAT_PAGES,
  formatPagePaths,
  getFormatPage,
  toolsForFormat,
  type FormatPage,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL, softwareApplicationLd } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return formatPagePaths();
}

const YEAR = 2026;

interface FormatStyle {
  archetype: 'vector-drafting' | 'solid-mechanical' | 'tessellated-mesh';
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  formatBadgeText: string;
}

function getStyleForFormat(slug: string): FormatStyle {
  const vector = ['dwg', 'dxf', 'pdf'];
  const solid = ['step', 'iges', 'jt', '3dm'];
  
  if (vector.includes(slug)) {
    return {
      archetype: 'vector-drafting',
      gradient: 'from-slate-600 via-slate-700 to-slate-800',
      badgeAccent: 'bg-slate-100 text-slate-800 border-slate-200',
      accentText: 'text-slate-700',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      formatBadgeText: '2D/Vector Drafting Standard',
    };
  }
  if (solid.includes(slug)) {
    return {
      archetype: 'solid-mechanical',
      gradient: 'from-amber-600 via-amber-700 to-yellow-800',
      badgeAccent: 'bg-amber-50 text-amber-700 border-amber-100',
      accentText: 'text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      formatBadgeText: '3D Solid & B-Rep Standard',
    };
  }
  return {
    archetype: 'tessellated-mesh',
    gradient: 'from-teal-600 to-emerald-700',
    badgeAccent: 'bg-teal-50 text-teal-700 border-teal-100',
    accentText: 'text-teal-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    formatBadgeText: 'Mesh & Facet Standard',
  };
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(p: FormatPage, count: number): string {
  return `Software That Opens & Edits ${p.formatName} Files (${count} Tools, ${YEAR})`;
}

function pageDescription(p: FormatPage, count: number): string {
  return `${count} CAD, BIM, and visualisation tools that read or write ${p.formatName} (${p.fullName}) files — ranked by score with read/write capability flagged.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getFormatPage(slug);
  if (!p) return {};
  const { reads, writes, both } = toolsForFormat(p);
  const total = reads.length + writes.length + both.length;
  return pageMetadata({
    title: pageTitle(p, total),
    description: pageDescription(p, total),
    path: `/file-formats/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: FormatPage, list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle(p, list.length),
    description: pageDescription(p, list.length),
    numberOfItems: list.length,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: list.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/tools/${t.slug}`,
      name: t.name,
    })),
  };
}

function articleLd(p: FormatPage, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(p, count),
    description: pageDescription(p, count),
    mainEntityOfPage: `${SITE_URL}/file-formats/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-15',
  };
}

function faqLd(p: FormatPage) {
  if (!p.faqs || p.faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function ToolCard({ t, capability }: { t: Tool; capability: 'read' | 'write' | 'both' }) {
  const capLabel = capability === 'both' ? 'Read & Write' : capability === 'read' ? 'Read Only' : 'Write Only';
  const capColor = capability === 'both' ? 'bg-emerald-100 text-emerald-800' : capability === 'read' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800';
  return (
    <li className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-4">
        <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Link href={`/tools/${t.slug}`} className="text-lg font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${capColor}`}>{capLabel}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')} · ★ {t.score.toFixed(1)}</div>
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">{t.short_desc}</p>
        </div>
      </div>
    </li>
  );
}

// --- CURATED WIDGETS ---

function VectorLayerSpecsWidget({ slug }: { slug: string }) {
  const specs = {
    'dwg': {
      title: "DWG Layer & Coordinate Compatibility Standards",
      points: [
        "Dynamic Blocks & Constraints: Modern DWG features like parametric constraints and dynamic block states often require native RealDWG libraries to compile without conversion errors.",
        "Annotation Scale Syncing: When importing DWGs to non-Autodesk tools, confirm that active viewport layouts preserve layout scales, line type definitions, and text height ratios.",
        "External References (XRefs): Ensure XRef paths are absolute or correctly stored in relative subfolders so referenced architectural grids resolve during background loading."
      ]
    },
    'dxf': {
      title: "DXF Drawing Interchange Standards",
      points: [
        "ASCII vs Binary Parsing: Standard CNC routers prefer ASCII DXF for human-readable vector tracing, but binary DXF files are significantly smaller and faster to open.",
        "Splines vs Polylines: Legacy laser cutting software cannot trace NURBS splines; convert complex curves to chorded linear segments (polylines) before CAM export.",
        "Layer Separation protocols: Keep separate cut paths, engravings, and dimensions on strict layer names to allow direct machine toolpath automation."
      ]
    },
    'pdf': {
      title: "CAD Vector PDF Extraction & Review Standards",
      points: [
        "Vector vs Raster Layers: Ensure PDF export uses vector layout output rather than flattened raster images so that recipient engineers can snap lines and pull measurements.",
        "Scale Calibration: Set up scale bars inside sheet templates. Review tools like Bluebeam require manual two-point calibration to verify precise field dimensions.",
        "Font Embedding: Embed TrueType or OpenType fonts directly inside the PDF export to prevent standard architectural text overlaps or symbol corruption on other OS viewports."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!specs) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <span>{specs.title}</span>
      </div>
      <div className="space-y-3">
        {specs.points.map((pt, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-slate-700 flex-shrink-0">Rule {idx + 1}:</span>
            <span>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BRepIntegrityWidget({ slug }: { slug: string }) {
  const data = {
    'step': {
      title: "STEP Solid Geometry Integrity Matrix",
      points: [
        "Solid B-Rep Topology: STEP preserves mathematical solid boundary representations. Receiving kernels can perform accurate volume calculations and cross-sectional cutouts.",
        "PMI Metadata: STEP AP242 carries Product Manufacturing Information, embedding tolerance bands, surface finish symbols, and GD&T directly into the 3D model.",
        "Sewing Tolerances: If a STEP import shows open shells instead of water-tight solids, adjust the kernel's sewing tolerance (typically 0.01mm to 0.001mm) to stitch open boundary edges."
      ]
    },
    'iges': {
      title: "IGES Surface Geometry Exchange Matrix",
      points: [
        "Trimmed Surfaces (Type 144): IGES files frequently split into loose, disconnected trimmed surface patches during export. Run healing algorithms to re-stitch them into solids.",
        "NURBS Precision: Ensure your exporting tool is using double-precision float limits to avoid slight spline edge mismatches which prevent solid shell generation.",
        "Coordinate Alignment: Export IGES using the absolute coordinate system rather than local user coordinates (UCS) to prevent mechanical assembly component offset errors."
      ]
    },
    'jt': {
      title: "JT Lightweight PLM Performance Matrix",
      points: [
        "LOD Optimization: JT stores multiple Levels of Detail (LOD). Viewing pipelines load ultra-low-resolution facet meshes for quick rotation, only loading B-Rep solids on active selection.",
        "Teamcenter PLM Alignment: Siemens native files carry critical lifecycle metadata (part revision state, release authority) directly attached inside the JT header structure.",
        "Monolithic vs Shattered: Choose monolithic export to compile an entire multi-part assembly into a single file, or shattered to export external individual part files."
      ]
    },
    '3dm': {
      title: "Rhino 3DM Double-Precision NURBS Standards",
      points: [
        "NURBS Spline Resolution: Rhino 3DM stores precise mathematical NURBS parameters, enabling infinite resolution zoom and manufacturing-ready surface curvatures.",
        "Embedded Mesh Cache: 3DM files cache custom viewport meshes to speed up drawing. Modify render settings to control local file size without affecting solid precision.",
        "OpenNURBS Integration: Because McNeel provides the openNURBS library freely, third-party CAM and rendering tools can pull precise mathematical geometry without file translation."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!data) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
        <span>{data.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.points.map((p, idx) => (
          <div key={idx} className="p-4 bg-amber-50/20 rounded-xl border border-amber-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-amber-700 block mb-1">Standard {idx + 1}</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

function MeshValidationWidget({ slug }: { slug: string }) {
  const validation = {
    'stl': {
      title: "STL Mesh Validation Checklist for 3D Printing",
      checks: [
        { label: "Manifold Mesh Integrity", desc: "The mesh must be 100% water-tight (manifold). Self-intersections or open holes will crash typical slicer toolpaths." },
        { label: "Unit Scale Verification", desc: "STL carries no built-in unit headers. If a model imports 25.4x too small, check whether millimeter vs inch scale was mismarked." },
        { label: "Normal Vector Correction", desc: "Every triangular facet has a front face and back face (normal vector). Inverted normals cause printing voids and slicer errors." }
      ]
    },
    'obj': {
      title: "OBJ Texture & Material Coordinate Mapping",
      checks: [
        { label: "MTL File Association", desc: "OBJ meshes load colors and specular maps from a separate, sidecar .mtl file. Keep both files in the exact same workspace directory." },
        { label: "UV Layout Alignment", desc: "Always unwrap model UV channels cleanly before OBJ export to ensure high-fidelity texture layouts translate to external game or render engines." },
        { label: "Quad vs Triangle Meshes", desc: "Subdivision modelers output four-sided polygons (quads) for clean subdivision. game engines or slicers auto-triangulate meshes." }
      ]
    },
    'fbx': {
      title: "FBX Scene Exchange & Rigging Parameters",
      checks: [
        { label: "Animation Rig Compatibility", desc: "Ensure bone hierarchies, skin weight maps, and blendshape target arrays are mapped cleanly to standard Unity or Unreal humanoid skeletons." },
        { label: "Scale Conversion (Centimeter)", desc: "Autodesk tools run natively on different grid units. Confirm the scale factor (typically 1.0 or 0.01) matches target scene grids." },
        { label: "Embedded Texture Settings", desc: "Select 'Embed Media' on export so that diffuse maps, normal maps, and bump files are stored inside the binary file rather than as broken absolute paths." }
      ]
    },
    'ifc': {
      title: "IFC Semantic BIM Validation Matrix",
      checks: [
        { label: "Spatial Hierarchy Mapping", desc: "BIM objects must belong to a clear structure: Project -> Site -> Building -> Storey -> Element. Floating walls will fail structural coordination." },
        { label: "MVD Compliance Profiles", desc: "Select the correct Model View Definition (e.g., Coordination View 2.0 or Design Transfer MVD) to match the coordination firm's expected parameters." },
        { label: "Property Set Mapping", desc: "Ensure thermal resistance coefficients, concrete strengths, and fire-ratings are saved on standard IFC properties (Pset_WallCommon)." }
      ]
    },
    '3mf': {
      title: "3MF Multi-Material Printing Specifications",
      checks: [
        { label: "Voxel and Gradients", desc: "3MF files support voxel-based color gradients. Verify your slicer supports gradient infills to utilize advanced physical shading." },
        { label: "Native Lattice Structures", desc: "Lighter structures can be mathematically generated without huge STL file sizes, as 3MF stores lattice nodes directly in XML syntax." },
        { label: "Multi-material Tool Offset", desc: "Store distinct physical extruder designations inside the 3MF package to cleanly map dual or quad printhead color changes." }
      ]
    }
  }[slug] as { title: string; checks: { label: string; desc: string }[] } | undefined;

  if (!validation) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{validation.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {validation.checks.map((c, idx) => (
          <div key={idx} className="p-4 bg-teal-50/20 rounded-xl border border-teal-100 relative">
            <h4 className="font-bold text-slate-900 text-sm">{c.label}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- RENDER COMPONENT PIPELINES ---

function renderFormatToolLists(
  both: Tool[],
  reads: Tool[],
  writes: Tool[],
  total: number,
  style: FormatStyle,
  p: FormatPage
) {
  return (
    <>
      {both.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
            Full read & write support ({both.length})
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {both.map((t) => <ToolCard key={t.slug} t={t} capability="both" />)}
          </ul>
        </section>
      )}

      {reads.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
            Read-only / viewers ({reads.length})
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reads.map((t) => <ToolCard key={t.slug} t={t} capability="read" />)}
          </ul>
        </section>
      )}

      {writes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
            Write / export ({writes.length})
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {writes.map((t) => <ToolCard key={t.slug} t={t} capability="write" />)}
          </ul>
        </section>
      )}

      {total === 0 && (
        <p className="text-slate-600">
          No tools currently tagged with {p.formatName} support in our catalog. Browse the{' '}
          <Link href="/tools" className="text-blue-600 hover:underline">full directory</Link>{' '}
          to find compatible tools by category.
        </p>
      )}
    </>
  );
}

function renderFormatFAQs(p: FormatPage, style: FormatStyle) {
  if (!p.faqs || p.faqs.length === 0) return null;
  return (
    <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
        Frequently asked
      </h2>
      <dl className="space-y-4">
        {p.faqs.map((f) => (
          <div key={f.q} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <dt className="font-semibold text-slate-900 text-sm sm:text-base">{f.q}</dt>
            <dd className="mt-2 text-slate-600 text-sm leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function renderFormatCTA(p: FormatPage, total: number) {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
      <h2 className="text-2xl font-bold">Need a specific conversion?</h2>
      <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
        Our interactive CAD Matchmaker filters all {total} {p.formatName}-compatible platforms against your budget, hardware configuration, and precise parametric drafting needs.
      </p>
      <Link href="/matchmaker" className="inline-block mt-5 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 shadow-lg transition-all">
        Launch Matchmaker →
      </Link>
    </section>
  );
}

function renderFormatLinks(p: FormatPage) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3">Other file formats</h2>
      <ul className="flex flex-wrap gap-2 text-sm">
        {Object.values(FILE_FORMAT_PAGES)
          .filter((x) => x.slug !== p.slug)
          .map((x) => (
            <li key={x.slug}>
              <Link href={`/file-formats/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                {x.formatName} support
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

// --- MAIN CONTROLLER PAGE ROUTE ---

export default async function FileFormatPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getFormatPage(slug);
  if (!p) notFound();

  const { reads, writes, both } = toolsForFormat(p);
  const all = [...both, ...reads, ...writes];
  const total = all.length;
  const style = getStyleForFormat(slug);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'File Formats', path: '/file-formats' },
    { name: p.formatName, path: `/file-formats/${p.slug}` },
  ]);
  const faqsSchema = faqLd(p);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, all)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p, total)) }} />
      {faqsSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqsSchema) }} />}
      {all.slice(0, 5).map((t, i) => (
        <script key={`software-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd(t)) }} />
      ))}

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Colorful Gradient Header Accent */}
        <div className={`w-full py-1.5 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-slate-500 mb-6 flex flex-wrap gap-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/file-formats" className="hover:underline">Formats</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{p.formatName}</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
                {style.formatBadgeText}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {total} verified tools
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {pageTitle(p, total)}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">{p.intro}</p>
          </header>

          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}

          {/* Flow 1: Vector Drafting (Specs first, tool list, FAQs, CTA, links) */}
          {style.archetype === 'vector-drafting' && (
            <>
              <VectorLayerSpecsWidget slug={slug} />
              {renderFormatToolLists(both, reads, writes, total, style, p)}
              {renderFormatFAQs(p, style)}
              {renderFormatCTA(p, total)}
              {renderFormatLinks(p)}
            </>
          )}

          {/* Flow 2: Solid Mechanical (Tool list first, B-Rep widget, FAQs, CTA, links) */}
          {style.archetype === 'solid-mechanical' && (
            <>
              {renderFormatToolLists(both, reads, writes, total, style, p)}
              <BRepIntegrityWidget slug={slug} />
              {renderFormatFAQs(p, style)}
              {renderFormatCTA(p, total)}
              {renderFormatLinks(p)}
            </>
          )}

          {/* Flow 3: Tessellated Mesh (FAQs first, tool list, mesh validation widget, CTA, links) */}
          {style.archetype === 'tessellated-mesh' && (
            <>
              {renderFormatFAQs(p, style)}
              {renderFormatToolLists(both, reads, writes, total, style, p)}
              <MeshValidationWidget slug={slug} />
              {renderFormatCTA(p, total)}
              {renderFormatLinks(p)}
            </>
          )}

        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
