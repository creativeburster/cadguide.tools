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
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return formatPagePaths();
}

const YEAR = 2026;

interface FormatStyle {
  archetype: 'vector-drafting' | 'solid-mechanical' | 'tessellated-mesh' | 'bim-coordination' | 'machine-instruction';
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  formatBadgeText: string;
}

function getStyleForFormat(slug: string): FormatStyle {
  const vector = ['dwg', 'dxf', 'pdf', 'dgn', 'dwf', 'exb', 'slddrw', 'idw'];
  const solid = ['step', 'iges', 'jt', '3dm', 'sldprt', 'ipt', 'sat', 'vda', 'catpart', 'nxprt', 'creoprt', 'f3d'];
  const mesh = ['stl', 'obj', 'fbx', '3mf', 'usd', 'cgr'];
  const bim = ['ifc', 'rvt'];
  const machine = ['gcode'];
  
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
  if (bim.includes(slug)) {
    return {
      archetype: 'bim-coordination',
      gradient: 'from-indigo-600 via-blue-700 to-sky-800',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      formatBadgeText: 'BIM & AEC Database Standard',
    };
  }
  if (machine.includes(slug)) {
    return {
      archetype: 'machine-instruction',
      gradient: 'from-rose-600 via-red-700 to-orange-800',
      badgeAccent: 'bg-rose-50 text-rose-700 border-rose-100',
      accentText: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      formatBadgeText: 'Machine Control & G-Code',
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
    dateModified: new Date().toISOString().slice(0, 10),
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
    },
    'dgn': {
      title: "DGN Geospatial & Large-Scale Design Standards",
      points: [
        "64-bit Element Database: DGN V8 utilizes a 64-bit coordinate space, letting infrastructure designers place millions of assets across vast geographic systems without coordinate degradation.",
        "Master vs Sub-Units Mapping: Always map working units (e.g. Survey Feet vs Meters) explicitly when importing DGN datasets into AutoCAD to prevent scale shifts.",
        "Integrated History Tracking: DGN archives support delta history logs, enabling CAD administrators to audit and rollback design modifications to older timestamps."
      ]
    },
    'dwf': {
      title: "DWF Plan Review & Takeoff Specifications",
      points: [
        "Locked Vector Coordinates: DWF acts as an unmodifiable blueprint, securing native vector geometries from modifications while permitting precise stakeholder measurements.",
        "XML Container Architecture: DWFx is packaged as an XML Paper Specification (XPS) container, allowing Windows users to print and inspect files natively in a web browser.",
        "Takeoff Metadata Binding: Estimatation databases can pull area dimensions, layer names, and custom sheet scale properties directly from DWF headers."
      ]
    },
    'exb': {
      title: "EXB Localized GB Drafting Standards",
      points: [
        "GB Standard Component Templates: EXB integrates Chinese drafting standards natively. Border frames, weld symbols, and roughness callouts automatically format to GB syntax.",
        "Dynamic ERP Integration: Title blocks and structural bill of materials inside EXB map directly to local manufacturing resource planning software.",
        "Dual-Kernel AutoCAD Mapping: CAXA's engine handles DWG imports using a dual-kernel framework, rendering complex dynamic blocks cleanly."
      ]
    },
    'slddrw': {
      title: "SolidWorks Drawing Associativity Standards",
      points: [
        "Live Bidirectional Constraints: SLDDRW files remain actively linked to parent assembly geometries. Model revisions automatically redraw orthographic projected views.",
        "Detailing Mode Compilation: Open heavy multi-sheet SLDDRW drawings in Detailing Mode to quickly inspect and print layouts without rendering the heavy 3D assembly models.",
        "Broken Pointer Resolution: If views display empty spaces, trace component paths under File -> Replace and target the corresponding `.sldprt` files."
      ]
    },
    'idw': {
      title: "Inventor Drawing Documentation Standards",
      points: [
        "IPT/IAM Model Linking: IDW sheets read material data and volume matrices from IPT files, dynamically filling drawing title block weight profiles.",
        "Raster View Optimization: For massive industrial layouts, configure views as raster drafts to keep local drawing files lightweight during sketch creation.",
        "DWG Sheet Interoperability: Choose Inventor-DWG instead of IDW if you frequently share vector drawing files directly with standard AutoCAD environments."
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
    },
    'sldprt': {
      title: "SLDPRT SolidWorks Feature Tree Guidelines",
      points: [
        "Parasolid Modeler Alignment: SLDPRT solids run natively on the Siemens Parasolid engine. Exporting as Parasolid format (.x_t) maintains perfect coordinate structure.",
        "Rebuild Sequence Rules: SolidWorks generates features sequentially. Place complex fillets and structural drafts at the end of the history tree to prevent rebuild breaks.",
        "Assembly Mate Caching: Large assemblies save local boundary representations in SLDASM. Lock external references to bypass cycle recalculation slowdowns."
      ]
    },
    'ipt': {
      title: "Inventor IPT ShapeManager Specifications",
      points: [
        "ShapeManager Solid Engine: IPT files are built on Autodesk's proprietary ShapeManager kernel (derived from ACIS), using double-precision solid parameters.",
        "Model-Based Definition (MBD): Inventor IPT files natively support 3D dimensioning and geometric tolerance symbols, facilitating paperless downstream manufacturing.",
        "Adaptive Feature Restrictions: Adaptive parts dynamically alter lengths based on mating assemblies. Lock adaptivity once dimensions are finalized to avoid CPU load."
      ]
    },
    'sat': {
      title: "ACIS SAT Geometry Translation Guidelines",
      points: [
        "ACIS Modeler Coordination: SAT stores precise mathematical B-Rep curves and solid regions utilizing Spatial Corporation's ACIS modeling engine.",
        "ASCII Troubleshooting: Because SAT is a text format, developers can debug boundary loops and coordinate matrix errors using a simple text viewer.",
        "Version Level Settings: Match the exported SAT version to the receiver's ACIS engine level (e.g. export as R18 to guarantee support on older tools)."
      ]
    },
    'vda': {
      title: "VDA-FS German Automotive surface Matrix",
      points: [
        "German Car Styling Standards: VDA-FS represents high-end Class-A freeform surfaces with zero topological solid definitions, specialized for automotive body panels.",
        "NURBS Surface Continuity: Ensure your surfacing tool achieves G2 (Curvature) or G3 (Acceleration) continuity to avoid visible highlight breaks on panels.",
        "Modern STEP Transition: Translate VDA-FS files to STEP AP214 or AP242 to incorporate modern solid properties and geometric tolerances for production."
      ]
    },
    'catpart': {
      title: "CATIA CGM Kernel Geometric Specifications",
      points: [
        "CGM Kernel Precision: CATPart models are created on Dassault's Convergence Geometric Modeler, optimized to handle advanced aeronautical surface deviations.",
        "Hybrid Modeling Containers: A single CATPart file hosts precise wireframe, complex NURBS styling surfaces, and structural manufacturing solid bodies.",
        "Backward Translation Limits: CATIA V5 is file-dependent. Models compiled on newer releases cannot be opened in older releases without using utility utilities."
      ]
    },
    'nxprt': {
      title: "Siemens NX Unified Part Architecture",
      points: [
        "Single File Multi-Application: NX uses a unified .prt extension for parts, assemblies, simulation FEA meshes, and CAM post-processor toolpath setups.",
        "WAVE Geometry Linker: NX PRT uses WAVE links to copy coordinates between parts, letting design updates propagate while preventing cyclic reference crashes.",
        "Synchronous technology Direct Editing: Push and pull boundary surfaces of imported static solid geometry directly without requiring a feature history tree."
      ]
    },
    'creoprt': {
      title: "Creo PRT Parametric History Guidelines",
      points: [
        "Strict Feature Hierarchy: Creo PRT models depend on sequential parent-child relationships. Modifying early base sketches requires careful rebuild checkups.",
        "Creo Purge Suffix System: Creo saves files with incremented suffixes (e.g. `.prt.1`, `.prt.2`). Deploy the `purge` command line tool regularly to clean storage.",
        "Skeleton Assembly Planning: Build coordinate skeletons inside Creo assemblies to share reference geometries down to child parts, preventing loop errors."
      ]
    },
    'f3d': {
      title: "Fusion 360 Local Archive Specifications",
      points: [
        "Unified Parametric Containers: F3D local backup files bundle 2D sketches, modeling history, simulation properties, and CAM tooling parameters in one database.",
        "Assembly Reference Packing: When archiving assemblies containing external links, export as a `.f3z` package to zip all referenced components together.",
        "Offline Database Synchronization: Import local F3D files directly into the Fusion desktop client. Changes made offline will sync back to the cloud on reconnect."
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
    '3mf': {
      title: "3MF Multi-Material Printing Specifications",
      checks: [
        { label: "Voxel and Gradients", desc: "3MF files support voxel-based color gradients. Verify your slicer supports gradient infills to utilize advanced physical shading." },
        { label: "Native Lattice Structures", desc: "Lighter structures can be mathematically generated without huge STL file sizes, as 3MF stores lattice nodes directly in XML syntax." },
        { label: "Multi-material Tool Offset", desc: "Store distinct physical extruder designations inside the 3MF package to cleanly map dual or quad printhead color changes." }
      ]
    },
    'usd': {
      title: "USD Collaborative Scene Layering Guidelines",
      checks: [
        { label: "Non-Destructive Overrides", desc: "USD separates geometry modifications into non-destructive overlay files, letting modelers edit textures without breaking coordinates." },
        { label: "AR Ready USDZ Archives", desc: "Combine binary USDC geometry and diffuse texture maps inside a zero-compression zip archive to run native AR Quick Look on Apple devices." },
        { label: "Universal Real-Time Syncing", desc: "USD handles asset databases within collaborative ray-tracers like NVIDIA Omniverse, enabling cross-application layout updates." }
      ]
    },
    'cgr': {
      title: "CGR Visualization Mockup Quality Standards",
      checks: [
        { label: "CGM Tessellation Level", desc: "CGR files strip CGM B-Rep boundaries, saving optimized mesh graphics to verify mechanical assembly spacing." },
        { label: "Lightweight DMU Loading", desc: "Designers use CGR mesh envelopes inside CATIA to run clash analysis across thousands of components concurrently without running out of RAM." },
        { label: "Solid Data Protection", desc: "Distributing CGR visualization files protects critical enterprise IP, since mathematically exact solid boundaries cannot be extracted." }
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

function BIMCoordinationWidget({ slug }: { slug: string }) {
  const data = {
    'ifc': {
      title: "IFC Semantic OpenBIM Coordination Standards",
      points: [
        "Spatial Hierarchy Binding: Every BIM object must inherit a structured project path: IfcProject -> IfcSite -> IfcBuilding -> IfcBuildingStorey to pass grid checks.",
        "Model View Definition (MVD) Profiles: Set the export wizard to Reference View 2.0 if the recipient only needs to coordinate positions, or Design Transfer MVD for edits.",
        "Semantic Class Mapping: Confirm elements map to correct classifications (e.g. IfcWall, IfcSlab). Avoid generic BuildingElementProxy fallbacks to clear validation checks."
      ]
    },
    'rvt': {
      title: "Revit RVT Database & Worksharing Standards",
      points: [
        "Relational Project Database: RVT stores geometry coordinates, 2D sheet layouts, and scheduling tables in one dynamic relational database container.",
        "Concurrent Central Worksharing: Design teams use local project replicas to synchronize edits to a central RVT database hosted on Revit Server or Autodesk Construction Cloud.",
        "Strict Release Compatibility: Revit databases cannot save back to older versions. Confirm the project year release before saving to avoid format lockout."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!data) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-indigo-800 font-bold text-lg">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span>{data.title}</span>
      </div>
      <div className="space-y-3">
        {data.points.map((pt, idx) => (
          <div key={idx} className="p-3 bg-indigo-50/20 rounded-xl border border-indigo-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-indigo-700 flex-shrink-0">Standard {idx + 1}:</span>
            <span>{pt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MachineControlWidget({ slug }: { slug: string }) {
  const specs = {
    'gcode': {
      title: "G-Code Numerical Machine Toolpath Specifications",
      points: [
        "Post-Processor Dialects: G-code instructions must run through custom post-processor scripts to output compatible coordinates for Fanuc, Haas, or GRBL controllers.",
        "Coordinate Mode Alignment: Verify if the G-code uses absolute coordinates (G90) or incremental movements (G91) to prevent machining head collision.",
        "Instruction Sequence Safety: Keep start-up operations (homing, spindle heating) and termination offsets (retract tools, shut coolants) configured to protect CNC hardware."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!specs) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-rose-800 font-bold text-lg">
        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{specs.title}</span>
      </div>
      <div className="space-y-3">
        {specs.points.map((pt, idx) => (
          <div key={idx} className="p-3 bg-rose-50/20 rounded-xl border border-rose-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-rose-700 flex-shrink-0">Rule {idx + 1}:</span>
            <span>{pt}</span>
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
          <FoldingList
            itemType="ul"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {both.map((t) => <ToolCard key={t.slug} t={t} capability="both" />)}
          </FoldingList>
        </section>
      )}

      {reads.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
            Read-only / viewers ({reads.length})
          </h2>
          <FoldingList
            itemType="ul"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {reads.map((t) => <ToolCard key={t.slug} t={t} capability="read" />)}
          </FoldingList>
        </section>
      )}

      {writes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient}`} />
            Write / export ({writes.length})
          </h2>
          <FoldingList
            itemType="ul"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {writes.map((t) => <ToolCard key={t.slug} t={t} capability="write" />)}
          </FoldingList>
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

          {/* Flow 4: BIM Coordination (Tool list first, BIM widget, FAQs, CTA, links) */}
          {style.archetype === 'bim-coordination' && (
            <>
              {renderFormatToolLists(both, reads, writes, total, style, p)}
              <BIMCoordinationWidget slug={slug} />
              {renderFormatFAQs(p, style)}
              {renderFormatCTA(p, total)}
              {renderFormatLinks(p)}
            </>
          )}

          {/* Flow 5: Machine Instruction (Machine control widget first, FAQs, tool list, CTA, links) */}
          {style.archetype === 'machine-instruction' && (
            <>
              <MachineControlWidget slug={slug} />
              {renderFormatFAQs(p, style)}
              {renderFormatToolLists(both, reads, writes, total, style, p)}
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
