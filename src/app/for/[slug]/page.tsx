import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  PERSONA_PAGES,
  personaPagePaths,
  getPersonaPage,
  toolsForPersona,
  type PersonaPage,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';
import { FoldingList } from '@/components/folding-list';
import React from 'react';

export const dynamicParams = false;

export function generateStaticParams() {
  return personaPagePaths();
}

const YEAR = 2026;
const PERSONA_LIMIT = 18;

interface PersonaStyle {
  archetype: 'technical-engineering' | 'creative-design' | 'business-management' | 'academic-individual';
  gradient: string;
  badgeAccent: string;
  accentText: string;
  badgeBg: string;
  roleBadgeText: string;
}

function getStyleForPersona(slug: string): PersonaStyle {
  const tech = ['mechanical-engineers', 'civil-engineers', 'electrical-engineers', 'hvac-engineers', 'cnc-machinists'];
  const creative = ['architects', 'jewelry-designers', 'animators', '3d-printing', 'landscape-architects', 'interior-designers', 'industrial-designers'];
  const business = ['startups', 'freelancers', 'construction-managers', 'cad-managers'];
  
  if (tech.includes(slug)) {
    return {
      archetype: 'technical-engineering',
      gradient: 'from-slate-800 to-indigo-900',
      badgeAccent: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      accentText: 'text-indigo-600',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
      roleBadgeText: 'Engineering Directive',
    };
  }
  if (creative.includes(slug)) {
    return {
      archetype: 'creative-design',
      gradient: 'from-rose-600 to-fuchsia-700',
      badgeAccent: 'bg-rose-50 text-rose-700 border-rose-100',
      accentText: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      roleBadgeText: 'Creative Showcase',
    };
  }
  if (business.includes(slug)) {
    return {
      archetype: 'business-management',
      gradient: 'from-blue-700 via-indigo-800 to-slate-900',
      badgeAccent: 'bg-blue-50 text-blue-700 border-blue-100',
      accentText: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      roleBadgeText: 'Enterprise & Strategy',
    };
  }
  return {
    archetype: 'academic-individual',
    gradient: 'from-emerald-600 to-teal-800',
    badgeAccent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accentText: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    roleBadgeText: 'Access Opportunity',
  };
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(p: PersonaPage, count: number): string {
  return `Best CAD Software for ${p.displayName} in ${YEAR} (${count} Tools Reviewed)`;
}

function pageDescription(p: PersonaPage, count: number): string {
  return `${count} CAD, BIM, CAE, and EDA tools that fit ${p.shortNoun} workflows — ranked by expert score and customer reviews. Pricing, platforms, and best-for guidance included.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const p = getPersonaPage(slug);
  if (!p) return {};
  const list = toolsForPersona(p).slice(0, PERSONA_LIMIT);
  return pageMetadata({
    title: pageTitle(p, list.length),
    description: pageDescription(p, list.length),
    path: `/for/${p.slug}`,
    ogType: 'article',
  });
}

function itemListLd(p: PersonaPage, list: Tool[]) {
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

function articleLd(p: PersonaPage, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(p, count),
    description: pageDescription(p, count),
    mainEntityOfPage: `${SITE_URL}/for/${p.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  };
}

function faqLd(p: PersonaPage) {
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

// --- CURATED WIDGETS ---

function PersonaHardwareWidget({ slug }: { slug: string }) {
  const specs = {
    'mechanical-engineers': {
      title: "Recommended MCAD Workstation Setup",
      cpu: "Intel Core i9-14900K or AMD Ryzen 9 7950X (High Single-Core Clock Speed)",
      ram: "64GB DDR5 (Critical for complex assemblies and FEA meshing)",
      gpu: "NVIDIA RTX A4000 or RTX 4080 (ISV certified graphics drivers)",
      storage: "2TB NVMe M.2 SSD (Gen4 x4) for assembly local caching",
      tip: "MCAD modeling is heavily single-thread bound. Prioritize CPU clock speed (GHz) over core count unless you are running daily locally-computed CPU simulation solvers."
    },
    'civil-engineers': {
      title: "Recommended Civil/GIS Workstation Setup",
      cpu: "AMD Ryzen 7 7800X3D or Intel Core i7-14700K",
      ram: "32GB - 64GB DDR5 (Required for handling massive surface LiDAR scan models)",
      gpu: "NVIDIA RTX 4070 or AMD Radeon Pro W7600",
      storage: "2TB NVMe PCIe Gen4 SSD",
      tip: "Massive coordinates and geographic projection calculations thrive on unified storage access. A secondary ultra-wide monitor is strongly advised for concurrent CAD and spreadsheet mapping."
    },
    'electrical-engineers': {
      title: "Recommended EDA/Schematic Workstation Setup",
      cpu: "Intel Core i7 or AMD Ryzen 7 (Stable multi-threaded calculations)",
      ram: "32GB RAM",
      gpu: "NVIDIA RTX 4060 or integrated Intel Iris Xe (for pure schematic work)",
      storage: "1TB NVMe SSD",
      tip: "Schematic routing and PCB layer tracing benefit from high horizontal resolution. Dual 27-inch 4K monitors or a single 38-inch curved screen significantly cut zooming time."
    },
    'hvac-engineers': {
      title: "Recommended HVAC/MEP Workstation Setup",
      cpu: "Intel Core i7-14700K or AMD Ryzen 9 7900X (High clock speeds speed up dynamic duct/pipe routing calculations)",
      ram: "64GB DDR5 (Critical for loading large multi-link architectural coordination reference files)",
      gpu: "NVIDIA RTX 4060 Ti or AMD Radeon Pro W7500 (ISV-certified drivers ensure stability in complex workspaces)",
      storage: "1TB NVMe PCIe Gen4 SSD",
      tip: "MEP modeling is heavily dependent on cross-model linking. If your system RAM is insufficient, linked structural models will cause severe viewport performance lag."
    },
    'cnc-machinists': {
      title: "Recommended CNC/CAM Workstation Setup",
      cpu: "Intel Core i7-14700K or AMD Ryzen 7 7700X (High clock speeds minimize toolpath calculation wait times)",
      ram: "32GB DDR5 RAM",
      gpu: "NVIDIA RTX A2000 or RTX 4060 (Optimized for smooth toolpath backplotting and dynamic material removal simulation)",
      storage: "1TB NVMe SSD",
      tip: "CAM simulations run directly on local GPU and CPU. Dedicated graphics memory (VRAM of 6GB+) is essential for simulating multi-axis stock removal without visual stuttering."
    }
  }[slug] as { title: string; cpu: string; ram: string; gpu: string; storage: string; tip: string } | undefined;

  if (!specs) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{specs.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Processor (CPU)</span>
          <span className="text-slate-600 mt-1 inline-block">{specs.cpu}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Memory (RAM)</span>
          <span className="text-slate-600 mt-1 inline-block">{specs.ram}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Graphics Card (GPU)</span>
          <span className="text-slate-600 mt-1 inline-block">{specs.gpu}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wide">Primary Storage</span>
          <span className="text-slate-600 mt-1 inline-block">{specs.storage}</span>
        </div>
      </div>
      <div className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-2">
        <span className="font-bold flex-shrink-0">Workstation Rule:</span>
        <span>{specs.tip}</span>
      </div>
    </div>
  );
}

function CreativeWorkflowWidget({ slug }: { slug: string }) {
  const workflows = {
    'architects': {
      title: "Standard Architectural Concept-to-Delivery Pipeline",
      stages: [
        { name: "1. Spatial Concepting", tool: "SketchUp / Rhino", desc: "Rapid massing, block layouts, and client aesthetic orientation." },
        { name: "2. Detailed BIM Model", tool: "Revit / ArchiCAD", desc: "Coordinating walls, slabs, windows, and standard structural grids." },
        { name: "3. Interactive Visuals", tool: "Lumion / Twinmotion", desc: "Placing materials, foliage, active lighting, and video renders." }
      ]
    },
    'jewelry-designers': {
      title: "Fine Jewelry Digital Cast Prep Pipeline",
      stages: [
        { name: "1. NURBS Construction", tool: "Rhino + MatrixGold", desc: "Placing exact prongs, bezel settings, band sizes, and stone sizes." },
        { name: "2. Photo-real Clay Renders", tool: "KeyShot", desc: "Assigning metal alloys, diamond dispersion indices, and facet highlights." },
        { name: "3. SLA 3D Printing Prep", tool: "PreForm / Slicers", desc: "Building support lattices and exporting casting-ready wax meshes." }
      ]
    },
    'animators': {
      title: "Animators Poly Mesh Modeling & Presentation Flow",
      stages: [
        { name: "1. Polygon Sculpting", tool: "Blender / ZBrush", desc: "Freeform mesh molding, sculpting fine anatomical detailing, and topology retopo." },
        { name: "2. Rigging & Materials", tool: "Maya / Substance", desc: "Deformable bone structure mapping, UV unwrap, and physically-based textures." },
        { name: "3. GPU Raytracing Render", tool: "Unreal Engine / V-Ray", desc: "Simulating lighting bounces, shadow maps, and path-traced rendering." }
      ]
    },
    '3d-printing': {
      title: "Maker & Prototypes FDM/SLA Printing Flow",
      stages: [
        { name: "1. Solid CAD Modeling", tool: "Fusion 360 / Tinkercad", desc: "Establishing strict dimensional thickness constraints and parametric joints." },
        { name: "2. Mesh Integrity Check", tool: "MeshLab / Netfabb", desc: "Scanning for self-intersecting shells, holes, and non-manifold edges." },
        { name: "3. G-Code Generation", tool: "PrusaSlicer / Cura", desc: "Layer slicing, defining infill patterns, wall perimeters, and nozzle heat schedules." }
      ]
    },
    'landscape-architects': {
      title: "Site Grading & BIM Landscape Pipeline",
      stages: [
        { name: "1. GIS & Survey Import", tool: "Civil 3D / Vectorworks Landmark", desc: "Acquiring topographic contour data, geospatial shapefiles, and drone scan point clouds." },
        { name: "2. Terrain Grading Design", tool: "Vectorworks Landmark", desc: "Designing grading pads, retaining walls, and executing automated cut-and-fill soil calculations." },
        { name: "3. Planting & Presentation", tool: "Lands Design / Twinmotion", desc: "Populating botanical planting plans with age/growth parameters and rendering natural environment views." }
      ]
    },
    'interior-designers': {
      title: "Interior Space Planning & FF&E Pipeline",
      stages: [
        { name: "1. Space Planning (2D/3D)", tool: "SketchUp / Chief Architect", desc: "Sketching quick wall layouts, furniture spatial arrangements, and clearances." },
        { name: "2. Millwork Construction Detailing", tool: "AutoCAD / SketchUp Pro", desc: "Drafting precise elevation and section sheets of custom cabinetry for manufacturing hand-off." },
        { name: "3. Photorealistic Presentation", tool: "Enscape / V-Ray", desc: "Setting up real-time ray-traced client walk-throughs and texture rendering." }
      ]
    },
    'industrial-designers': {
      title: "Industrial Product Concept-to-Production Pipeline",
      stages: [
        { name: "1. Concept Styling & SubD", tool: "Rhino / Shapr3D", desc: "Organic freeform styling, ergonomic contour exploration, and subdivision modeling." },
        { name: "2. Precise NURBS Reconstruction", tool: "Rhino / Alias", desc: "Converting concept meshes to double-precision math NURBS surfaces with G2/G3 continuity." },
        { name: "3. Parametric MCAD Hand-off", tool: "SolidWorks / STEP Export", desc: "Exporting precise surface data to mechanical engineering teams for internal structural parts." }
      ]
    }
  }[slug] as { title: string; stages: { name: string; tool: string; desc: string }[] } | undefined;

  if (!workflows) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M3 12l-3 3m3-3l3 3M9 5.25L12 3m0 0l3 2.25M12 3v18" />
        </svg>
        <span>{workflows.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.stages.map((stg, i) => (
          <div key={i} className="p-4 bg-rose-50/20 rounded-xl border border-rose-100/50 relative">
            <span className="absolute right-3 top-3 text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded">Step {i+1}</span>
            <h4 className="font-bold text-slate-900 text-sm">{stg.name}</h4>
            <span className="text-xs font-semibold text-rose-600 block mt-1.5">{stg.tool}</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{stg.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LicensingGuideWidget({ slug }: { slug: string }) {
  const guide = {
    'students': {
      title: "How to Access CAD Student Licensing in 2026",
      points: [
        "Autodesk Student Plan: Register with a valid school email address (.edu) to access a free 12-month renewable subscription of AutoCAD, Revit, Inventor, and Maya.",
        "Onshape Education Standard: Pure cloud CAD is completely free for K-12 and college students. No install required — runs instantly in Chrome/Safari.",
        "Open-Source Perpetual Safety: Tools like FreeCAD, KiCad, and Blender are 100% free with zero time limits, allowing you to use them post-graduation."
      ]
    }
  }[slug] as { title: string; points: string[] } | undefined;

  if (!guide) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{guide.title}</span>
      </div>
      <ul className="space-y-3 text-sm">
        {guide.points.map((p, i) => (
          <li key={i} className="flex items-start gap-3 bg-emerald-50/20 rounded-xl p-3 border border-emerald-100/50">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
            <span className="text-slate-700 leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BusinessChecklistWidget({ slug }: { slug: string }) {
  const checklist = {
    'startups': {
      title: "Startup CAD Stack Setup & ROI Checklist",
      points: [
        { label: "IP Access Protection", desc: "Enforce multi-user cloud CAD permissions (e.g. Onshape, Fusion 360) with role-based access levels to prevent proprietary design database leakage." },
        { label: "SaaS Scaling Flexibility", desc: "Select subscription tiers with monthly rolling agreements to dynamically adjust seat counts according to product milestones." },
        { label: "Downstream PLM Connectivity", desc: "Verify that your selected CAD stack can hook directly into ECAD/MCAD cloud databases (Altium 365, Arena PLM) to streamline supply chain releases." }
      ]
    },
    'freelancers': {
      title: "Freelance Overhead & Interop Checklist",
      points: [
        { label: "Perpetual License Evaluation", desc: "Assess perpetual license buyouts (like BricsCAD Pro, Rhino 3D) to eliminate fixed software bills during slower contract months." },
        { label: "Universal Export Capabilities", desc: "Verify that your primary CAD stack exports exact neutral solid models (STEP) and drawing formats (DWG/DXF) to match whatever clients request." },
        { label: "Version Check Audits", desc: "Confirm the client's software release version before starting work to avoid backward-compatibility file opening issues." }
      ]
    },
    'construction-managers': {
      title: "Construction Coordination & Model Takeoff Checklist",
      points: [
        { label: "Multi-Disciplinary Integration", desc: "Consolidate structural, architectural, and MEP files inside coordination suites (Navisworks) to run interference checks before framing." },
        { label: "Vector Calibration Verification", desc: "Confirm that imported PDF drawings contain clean vector lines to enable automatic snap metrics for quantity estimation." },
        { label: "Field Database Access", desc: "Deploy tablet-ready model viewers to the site so inspectors can reference live coordinated design updates instantly." }
      ]
    },
    'cad-managers': {
      title: "Enterprise Standardization & License Audit Checklist",
      points: [
        { label: "Floating License Allocation", desc: "Establish floating network pools to share high-cost CAD licenses among designers, reducing overall seat overhead." },
        { label: "Standardized CAD Templates", desc: "Implement unified layered standards, plot styles, title blocks, and dyn-blocks to guarantee consistent print sets." },
        { label: "Information Governance Compliance", desc: "Confirm that cloud CAD databases and on-prem repositories conform to corporate IT governance standards (SOC 2, ISO 27001)." }
      ]
    }
  }[slug] as { title: string; points: { label: string; desc: string }[] } | undefined;

  if (!checklist) return null;

  return (
    <div className="my-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span>{checklist.title}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {checklist.points.map((pt, idx) => (
          <div key={idx} className="p-4 bg-indigo-50/20 rounded-xl border border-indigo-100 relative">
            <h4 className="font-bold text-slate-900 text-sm flex gap-1.5 items-center">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{idx+1}</span>
              {pt.label}
            </h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- RENDER COMPONENT FLOW ENGINES ---

function renderPersonaFAQs(p: PersonaPage, style: PersonaStyle) {
  return (
    <section className="mt-12 rounded-2xl bg-white border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className={`w-1.5 h-6 rounded-full bg-gradient-to-b ${style.gradient.replace('from-', 'from-').replace('to-', 'to-')}`} />
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

function renderPersonaList(list: Tool[], style: PersonaStyle, fullListLength: number, p: PersonaPage) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Top Vetted Tools for {p.displayName}
        </h2>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${style.badgeAccent}`}>
          {list.length} Solutions
        </span>
      </div>
      
      <FoldingList
        itemType="ol"
        className="space-y-5"
      >
        {list.map((t, i) => (
          <li key={t.slug} className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 hover:border-slate-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex-shrink-0 text-2xl font-extrabold text-slate-400 w-8 sm:w-10 text-center">{i + 1}.</div>
              <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link href={`/tools/${t.slug}`} className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-600">{t.name}</Link>
                  <span className="text-sm text-slate-500">{pricingLabel(t)} · {t.platforms.join(' / ')}</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-amber-500 font-bold">★ {t.score.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/ 5 Rating</span>
                </div>
                <p className="mt-3 text-slate-700 leading-relaxed text-sm sm:text-base">{t.short_desc}</p>
                <div className="mt-4">
                  <Link href={`/tools/${t.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                    View full profile and platform benchmarks →
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </FoldingList>

      {fullListLength > PERSONA_LIMIT && (
        <p className="mt-6 text-sm text-slate-500 text-center">
          Showing top {PERSONA_LIMIT} of {fullListLength}. See the full directory in the{' '}
          <Link href="/tools" className="text-blue-600 hover:underline font-bold">main tool index</Link>.
        </p>
      )}
    </section>
  );
}

function renderPersonaCTA(p: PersonaPage, fullListLength: number) {
  return (
    <section className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
      <h2 className="text-2xl font-bold">Get a personalized shortlist</h2>
      <p className="mt-3 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
        Our Matchmaker filters all {fullListLength} {p.displayName.toLowerCase()}-friendly tools against your real budget, hardware setup, and feature needs in 60 seconds.
      </p>
      <Link href="/matchmaker" className="inline-block mt-5 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 shadow-lg hover:shadow-xl transition-all">
        Launch Matchmaker →
      </Link>
    </section>
  );
}

function renderPersonaLinks(p: PersonaPage) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-slate-900 mb-3">CAD for other roles</h2>
      <ul className="flex flex-wrap gap-2 text-sm">
        {Object.values(PERSONA_PAGES)
          .filter((x) => x.slug !== p.slug)
          .map((x) => (
            <li key={x.slug}>
              <Link href={`/for/${x.slug}`} className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition-colors">
                CAD for {x.displayName}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

// --- MAIN CONTROLLER PAGE ---

export default async function PersonaPageRoute(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const p = getPersonaPage(slug);
  if (!p) notFound();

  const fullList = toolsForPersona(p);
  const list = fullList.slice(0, PERSONA_LIMIT);
  const style = getStyleForPersona(slug);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'CAD by Role', path: '/for' },
    { name: p.displayName, path: `/for/${p.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(p, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(p, list.length)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(p)) }} />

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Colorful Gradient Header Accent */}
        <div className={`w-full py-1.5 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumb nav */}
          <nav className="text-sm text-slate-500 mb-6 flex flex-wrap gap-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/for" className="hover:underline">By Role</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{p.displayName}</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
                {style.roleBadgeText}
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {list.length} Expert Shortlists
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {pageTitle(p, list.length)}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">{p.intro}</p>
          </header>

          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}

          {/* Flow 1: Technical & Engineering (Specs first, list, FAQs, CTA) */}
          {style.archetype === 'technical-engineering' && (
            <>
              <PersonaHardwareWidget slug={slug} />
              {renderPersonaList(list, style, fullList.length, p)}
              {renderPersonaFAQs(p, style)}
              {renderPersonaCTA(p, fullList.length)}
              {renderPersonaLinks(p)}
            </>
          )}

          {/* Flow 2: Creative & Design (Workflow first, list, FAQs, CTA) */}
          {style.archetype === 'creative-design' && (
            <>
              <CreativeWorkflowWidget slug={slug} />
              {renderPersonaList(list, style, fullList.length, p)}
              {renderPersonaFAQs(p, style)}
              {renderPersonaCTA(p, fullList.length)}
              {renderPersonaLinks(p)}
            </>
          )}

          {/* Flow 3: Business & Management (Checklist first, list, FAQs, CTA) */}
          {style.archetype === 'business-management' && (
            <>
              <BusinessChecklistWidget slug={slug} />
              {renderPersonaList(list, style, fullList.length, p)}
              {renderPersonaFAQs(p, style)}
              {renderPersonaCTA(p, fullList.length)}
              {renderPersonaLinks(p)}
            </>
          )}

          {/* Flow 4: Academic & Individual (FAQ first, list, Licensing Guide, CTA) */}
          {style.archetype === 'academic-individual' && (
            <>
              {renderPersonaFAQs(p, style)}
              {renderPersonaList(list, style, fullList.length, p)}
              <LicensingGuideWidget slug={slug} />
              {renderPersonaCTA(p, fullList.length)}
              {renderPersonaLinks(p)}
            </>
          )}

        </article>
      </main>
    </>
  );
}

export const dynamic = 'force-static';
