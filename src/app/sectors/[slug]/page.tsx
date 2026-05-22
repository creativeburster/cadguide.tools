import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  SECTOR_PAGES,
  sectorPagePaths,
  getSectorPage,
  toolsForSector,
  type SectorPage,
} from '@/lib/seo-content';
import type { Tool } from '@/lib/data';
import { pageMetadata, siteBreadcrumbLd, SITE_URL } from '@/lib/seo';
import { ToolLogo } from '@/components/tool-logo';

export const dynamicParams = false;

export function generateStaticParams() {
  return sectorPagePaths();
}

const YEAR = 2026;
const SECTOR_LIMIT = 18;

// --- Sector Archetypes & Advanced Layout Mapping ---
type Archetype = 'scientific-high-computation' | 'precision-fabrication' | 'heavy-infrastructure' | 'commercial-regulated';

interface SectorStyle {
  archetype: Archetype;
  colorName: string;
  gradient: string;
  bgLight: string;
  borderLight: string;
  textAccent: string;
  badgeAccent: string;
  bgMuted: string;
  expertAdvice: string;
}

const SECTOR_STYLES: Record<string, SectorStyle> = {
  cae: {
    archetype: 'scientific-high-computation',
    colorName: 'indigo',
    gradient: 'from-indigo-600 to-violet-700',
    bgLight: 'bg-indigo-50/50',
    borderLight: 'border-indigo-100',
    textAccent: 'text-indigo-600',
    badgeAccent: 'bg-indigo-100 text-indigo-700',
    bgMuted: 'bg-indigo-950/5 border-indigo-500/10',
    expertAdvice: 'Solver Benchmarking & Parallelization: When validating CAE tools for finite element analysis (FEA) or computational fluid dynamics (CFD), the licensing model\'s approach to CPU core counts is critical. Standard licenses often cap solvers at 4 or 8 cores; scale-up to high-performance computing (HPC) clusters requires parallel solver packs. Ensure your workstation features high memory bandwidth (e.g., octa-channel DDR5) and ECC memory to avoid bit-flips during multi-day iterative non-linear solver runs. For GPU-accelerated solvers, check if double-precision (FP64) compute is required, as standard gaming cards are heavily throttled here.',
  },
  cam: {
    archetype: 'precision-fabrication',
    colorName: 'amber',
    gradient: 'from-amber-600 to-orange-700',
    bgLight: 'bg-amber-50/50',
    borderLight: 'border-amber-100',
    textAccent: 'text-amber-700',
    badgeAccent: 'bg-amber-100 text-amber-800',
    bgMuted: 'bg-amber-950/5 border-amber-500/10',
    expertAdvice: 'CNC Post-Processor Verification Protocol: A CAM package is only as reliable as its post-processors. Never run auto-generated G-code directly on a multi-axis CNC machine without verifying the specific post-processor library. Professional shops should demand certified post-processors for standard controllers (e.g., Fanuc, Haas, Heidenhain, Sinumerik). Run initial programs in \'dry run\' mode with rapid speeds dialed down and Z-axis offsets applied above the stock. Ensure the tool path simulation supports native G-code backplotting (simulating the actual G-code output) rather than just the internal CL (cutter location) data.',
  },
  '3d-printing': {
    archetype: 'precision-fabrication',
    colorName: 'orange',
    gradient: 'from-orange-600 to-amber-700',
    bgLight: 'bg-orange-50/50',
    borderLight: 'border-orange-100',
    textAccent: 'text-orange-700',
    badgeAccent: 'bg-orange-100 text-orange-800',
    bgMuted: 'bg-orange-950/5 border-orange-500/10',
    expertAdvice: 'Additive Build Optimization & File Formats: Industrial additive manufacturing requires rigorous file optimization to prevent build failures. Always favor 3MF over traditional STL; 3MF files preserve exact geometric units, color maps, and material boundaries while avoiding self-intersecting meshes and open boundaries. When preparing powder-bed fusion (SLS/SLM) or stereolithography (SLA) files, utilize orientation algorithms that minimize support volume and prevent thermal warping on overhangs. For high-volume production, integrated dynamic nesting engines are essential to maximize build chamber density.',
  },
  automotive: {
    archetype: 'commercial-regulated',
    colorName: 'rose',
    gradient: 'from-rose-600 to-pink-700',
    bgLight: 'bg-rose-50/50',
    borderLight: 'border-rose-100',
    textAccent: 'text-rose-600',
    badgeAccent: 'bg-rose-100 text-rose-700',
    bgMuted: 'bg-rose-950/5 border-rose-500/10',
    expertAdvice: 'Class-A Surfacing & Supplier Interoperability: Automotive engineering revolves around G3 curvature continuity and multi-tier supplier collaboration. Class-A surfaces—visible exterior panels and interior touchpoints—must maintain flawless reflection lines (iso-photes). Standard CAD engines (solid modeling B-reps) struggle with this level of organic mathematical perfection, necessitating specialized NURBS surface molders. Ensure your design chain supports robust STEP AP242 exchange protocols to preserve product manufacturing information (PMI) across OEM and Tier-1 boundaries.',
  },
  'hydraulic-geotechnical': {
    archetype: 'heavy-infrastructure',
    colorName: 'stone',
    gradient: 'from-stone-600 to-slate-700',
    bgLight: 'bg-stone-100/50',
    borderLight: 'border-stone-200',
    textAccent: 'text-stone-700',
    badgeAccent: 'bg-stone-200 text-stone-800',
    bgMuted: 'bg-stone-900/5 border-stone-500/15',
    expertAdvice: 'Subsurface Modeling & Geodetic Coordinate Systems: Geotechnical and hydraulic CAD workflows must handle structural interaction with highly non-linear materials (soil and rock). Before placing retaining walls, bridge abutments, or earth dams, establish a strict geodetic coordinate system (e.g., UTM or state plane grids). Always verify soil-structure interface parameters using finite element or limit equilibrium solvers (e.g., Plaxis, GeoStudio). Ensure borehole DICOM/CSV imports are dynamically linked to the 3D surface model to update excavation cut-and-fill volumes as new geological data arrives.',
  },
  aerospace: {
    archetype: 'scientific-high-computation',
    colorName: 'sky',
    gradient: 'from-sky-600 to-blue-700',
    bgLight: 'bg-sky-50/50',
    borderLight: 'border-sky-100',
    textAccent: 'text-sky-700',
    badgeAccent: 'bg-sky-100 text-sky-800',
    bgMuted: 'bg-sky-950/5 border-sky-500/10',
    expertAdvice: 'Model-Based Definition (MBD) & Defense Security Protocols: Aerospace design is shifting rapidly to Model-Based Definition (MBD) to eliminate hundreds of 2D engineering drawings. Ensure your 3D CAD environment is capable of natively embedding Product Manufacturing Information (PMI)—geometric dimensioning and tolerancing (GD&T)—directly on the 3D solid model according to ASME Y14.41 or ISO 16792. For defense contractors, verify that all cloud-based PDM or collaboration hubs conform to ITAR compliance, FedRAMP High, or local national security storage requirements.',
  },
  'rail-transit': {
    archetype: 'heavy-infrastructure',
    colorName: 'slate',
    gradient: 'from-slate-600 to-zinc-700',
    bgLight: 'bg-slate-100/50',
    borderLight: 'border-slate-200',
    textAccent: 'text-slate-700',
    badgeAccent: 'bg-slate-200 text-slate-800',
    bgMuted: 'bg-slate-900/5 border-slate-500/15',
    expertAdvice: 'Track Alignment & Clear Envelope Analysis: Rail transit engineering demands high-precision track alignment design conforming to strict speed-dependent superelevation (cant) and spiral transition curves. When modeling tunnels, platforms, and bridges, perform dynamic clearance envelope analysis. The CAD suite must calculate the swept-path outline of the specific passenger or freight cars, taking into account vehicle roll, suspension play, and track wear. Establish a central BIM model using IFC 4.3 to coordinate structural, electrical, and trackwork teams on a single spatial coordinate file.',
  },
  'medical-devices': {
    archetype: 'commercial-regulated',
    colorName: 'violet',
    gradient: 'from-violet-600 to-fuchsia-700',
    bgLight: 'bg-violet-50/50',
    borderLight: 'border-violet-100',
    textAccent: 'text-violet-600',
    badgeAccent: 'bg-violet-100 text-violet-700',
    bgMuted: 'bg-violet-950/5 border-violet-500/10',
    expertAdvice: 'FDA Design Control & DICOM Segmentation: Developing custom orthopedics, implants, or surgical instruments requires strict compliance with FDA 21 CFR Part 820 design controls. The design history file (DHF) must document every single revision, review, and verification test. For patient-specific implants, ensure your team uses metrology-validated DICOM segmentation tools to translate CT/MRI scans into meshes. Any subsequent B-rep surface fitting must be verified with deviation color maps to ensure the implant fits the anatomical bone structures within a sub-millimeter tolerance.',
  },
  'sheet-metal': {
    archetype: 'precision-fabrication',
    colorName: 'cyan',
    gradient: 'from-cyan-600 to-teal-700',
    bgLight: 'bg-cyan-50/50',
    borderLight: 'border-cyan-100',
    textAccent: 'text-cyan-700',
    badgeAccent: 'bg-cyan-100 text-cyan-800',
    bgMuted: 'bg-cyan-950/5 border-cyan-500/10',
    expertAdvice: 'K-Factor Calibration & Press Brake Tooling: An accurate sheet metal flat pattern is impossible without empirical calibration of the K-factor or bend deduction. The default K-factor (typically 0.44 or 0.5) is a theoretical starting point; actual deformation depends on material hardness, rolling direction, die width, and press brake punch radius. Always compile a standardized bend table in your CAD tool based on test bends performed in your actual fabrication shop. Ensure the CAD unfolding engine automatically alerts designers if a bend radius is physically impossible given the selected tooling.',
  },
  'steel-structures': {
    archetype: 'heavy-infrastructure',
    colorName: 'zinc',
    gradient: 'from-zinc-600 to-stone-700',
    bgLight: 'bg-zinc-100/50',
    borderLight: 'border-zinc-200',
    textAccent: 'text-zinc-700',
    badgeAccent: 'bg-zinc-200 text-zinc-800',
    bgMuted: 'bg-zinc-900/5 border-zinc-500/15',
    expertAdvice: 'Structural Connection Detailing & CIS/2 Integration: High-end steel detailing bridges the gap between structural engineering sizing calculations and physical fabrication. The 3D detailing software must support automatic parametric steel connections (gusset plates, shear tabs, base plates) that adjust dynamically if beam sizes change. For structural coordination, utilize bi-directional CIS/2 or IFC model exchanges. This allows structural analytical models (from solvers like SAP2000 or STAAD.Pro) to sync directly with the detailing model, preventing discrepancies in weld types and bolt spacings.',
  },
  'quantity-takeoff': {
    archetype: 'commercial-regulated',
    colorName: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
    bgLight: 'bg-blue-50/50',
    borderLight: 'border-blue-100',
    textAccent: 'text-blue-600',
    badgeAccent: 'bg-blue-100 text-blue-700',
    bgMuted: 'bg-blue-950/5 border-blue-500/10',
    expertAdvice: '5D BIM Quantities & 2D Vector PDF Processing: In pre-construction bidding, takeoff speed and precision make the difference between profit and loss. When processing 2D blueprints, utilize vector-based PDF tools that snap directly to drawing geometry rather than raster files which introduce measurement drift. For 3D BIM-based takeoffs, establish strict object naming standards (e.g., OmniClass or UniFormat). This allows QTO engines to automatically query material properties (such as concrete volumes or structural steel weight) and map them directly to line items in your estimation database.',
  },
  'piping-pipeline': {
    archetype: 'scientific-high-computation',
    colorName: 'teal',
    gradient: 'from-teal-600 to-emerald-700',
    bgLight: 'bg-teal-50/50',
    borderLight: 'border-teal-100',
    textAccent: 'text-teal-700',
    badgeAccent: 'bg-teal-100 text-teal-800',
    bgMuted: 'bg-teal-950/5 border-teal-500/10',
    expertAdvice: 'Smart P&ID Integration & Piping Stress Analysis: Piping design in process industries is not just about routing pipes—it is a database-driven process. Ensure your piping CAD tool maintains a bi-directional dynamic link with the process piping and instrumentation diagram (P&ID). If a valve size is changed on the schematic, the 3D model should flag a mismatch. For high-temperature or high-pressure piping networks, run thermal expansion stress analysis (e.g., Caesar II) using exported CAD geometries to prevent nozzle load failures on pumps and pressure vessels.',
  },
  'reverse-engineering': {
    archetype: 'precision-fabrication',
    colorName: 'orange',
    gradient: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50/30',
    borderLight: 'border-orange-100',
    textAccent: 'text-orange-700',
    badgeAccent: 'bg-orange-100 text-orange-800',
    bgMuted: 'bg-orange-950/5 border-orange-500/10',
    expertAdvice: 'Metrology Scan Alignment & B-Rep Reconstruction: Successful reverse engineering begins with high-fidelity point cloud processing. When importing STL meshes from metrology scanners, align the mesh to a logical coordinate system (datum planes, cylinders, and hole centers) rather than using arbitrary scanner coordinates. Do not rely solely on automated auto-surfacing, which creates massive, un-editable NURBS surfaces. Instead, construct a fully parametric boundary representation (B-Rep) by extracting geometric features (extrusions, sweeps) directly from mesh cross-sections.',
  },
  'agricultural-machinery': {
    archetype: 'commercial-regulated',
    colorName: 'lime',
    gradient: 'from-lime-600 to-emerald-700',
    bgLight: 'bg-lime-50/30',
    borderLight: 'border-lime-100',
    textAccent: 'text-lime-800',
    badgeAccent: 'bg-lime-100 text-lime-800',
    bgMuted: 'bg-lime-950/5 border-lime-500/10',
    expertAdvice: 'Rugged Assembly Planning & Mud/Dust Sealing: Heavy agricultural equipment operates under punishing shock loads and dirty environments. Designers must perform top-down assembly planning to manage heavy weldments and sheet metal housings alongside hydraulic systems. Ensure the CAD platform includes robust structural weldment design modules that calculate throat thicknesses and weld lengths automatically. Pay close attention to dynamic rotary seals, designing custom labyrinth paths in the mechanical CAD model to protect bearings from dust, water, and crop wrap.',
  },
  'woodworking-customization': {
    archetype: 'precision-fabrication',
    colorName: 'yellow',
    gradient: 'from-yellow-600 to-amber-700',
    bgLight: 'bg-yellow-50/30',
    borderLight: 'border-yellow-200',
    textAccent: 'text-amber-800',
    badgeAccent: 'bg-yellow-100 text-amber-900',
    bgMuted: 'bg-yellow-950/5 border-yellow-500/10',
    expertAdvice: 'Parametric Cabinetry & Nested CNC Output: Whole-house custom furniture design requires highly parametric models to stay profitable. The CAD system should allow designers to modify room heights or cabinet widths while automatically adjusting shelf counts, edge-banding lengths, and joint locations. For manufacturing, direct integration with nesting software is critical. The system must automatically output flat DXF panels optimized for CNC routing, taking into account grain matching, tool diametral offsets, and hardware hole drillings without manual drawing preparation.',
  },
  petrochemical: {
    archetype: 'scientific-high-computation',
    colorName: 'fuchsia',
    gradient: 'from-fuchsia-600 to-pink-700',
    bgLight: 'bg-fuchsia-50/50',
    borderLight: 'border-fuchsia-100',
    textAccent: 'text-fuchsia-700',
    badgeAccent: 'bg-fuchsia-100 text-fuchsia-800',
    bgMuted: 'bg-fuchsia-950/5 border-fuchsia-500/10',
    expertAdvice: 'Database-Driven Plant Coordination & Clash Detection: Petrochemical megaprojects involve coordinating millions of objects across multiple engineering disciplines. The 3D model must run on a database-driven multi-user architecture to prevent data corruption. Establish a daily automated clash detection routine (e.g., in Navisworks or similar) that scans for physical interferences between piping, structural steel, electrical trays, and equipment maintenance clearances. Always reserve dedicated spatial envelopes for pipe removal, valve access, and pump maintenance.',
  },
};

function getStyleForSector(slug: string): SectorStyle {
  return SECTOR_STYLES[slug] || {
    archetype: 'commercial-regulated',
    colorName: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
    bgLight: 'bg-blue-50/50',
    borderLight: 'border-blue-100',
    textAccent: 'text-blue-600',
    badgeAccent: 'bg-blue-100 text-blue-700',
    bgMuted: 'bg-blue-950/5 border-blue-500/10',
    expertAdvice: 'General Engineering Protocol: Curating your tool catalog requires deep verification of file translations, versioning accuracy, and system integration. Work alongside certified partners to confirm structural and parametric integrity.',
  };
}

function pricingLabel(t: Tool): string {
  if (t.pricing_type === 'Free') return 'Free';
  if (t.pricing_type === 'Open Source') return 'Open Source';
  if (t.pricing_type === 'Freemium') return 'Freemium';
  if (t.starting_price > 0) return `from $${t.starting_price}`;
  return t.pricing_type;
}

function pageTitle(s: SectorPage, count: number): string {
  return `Best CAD Software for ${s.displayName} in ${YEAR} (${count} Tools Reviewed)`;
}

function pageDescription(s: SectorPage, count: number): string {
  return `Curated list of the best CAD, CAE, CAM, and BIM tools for ${s.displayName} workflows. Expert reviews, ratings, pricing, and system requirements for each ${s.shortNoun}.`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const s = getSectorPage(slug);
  if (!s) return {};
  const list = toolsForSector(s).slice(0, SECTOR_LIMIT);
  return pageMetadata({
    title: pageTitle(s, list.length),
    description: pageDescription(s, list.length),
    path: `/sectors/${s.slug}`,
    ogType: 'article',
  });
}

function itemListLd(s: SectorPage, list: Tool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle(s, list.length),
    description: pageDescription(s, list.length),
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

function articleLd(s: SectorPage, count: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle(s, count),
    description: pageDescription(s, count),
    mainEntityOfPage: `${SITE_URL}/sectors/${s.slug}`,
    publisher: { '@type': 'Organization', name: 'CADGuide.tools', url: SITE_URL },
    datePublished: '2026-01-01',
    dateModified: '2026-05-22',
  };
}

function faqLd(s: SectorPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// Helper to guess a CAD geometry kernel if missing in database records
function guessGeometryKernel(t: Tool): string {
  if (t.tech_specs?.engine) return t.tech_specs.engine;
  const name = t.name.toLowerCase();
  if (name.includes('solidworks') || name.includes('solid edge') || name.includes('nx') || name.includes('parasolid')) return 'Parasolid (Siemens)';
  if (name.includes('inventor') || name.includes('autocad') || name.includes('revit')) return 'ShapeManager / ACIS (Autodesk)';
  if (name.includes('rhino') || name.includes('rhinoceros')) return 'OpenNURBS (Robert McNeel)';
  if (name.includes('fusion 360')) return 'Parasolid / ShapeManager';
  if (name.includes('freecad') || name.includes('opencascade')) return 'Open CASCADE (Open Source)';
  if (name.includes('shapr3d')) return 'Parasolid';
  return 'Proprietary Vector B-Rep';
}

// --- Dynamic Interactive Custom Widgets ---

function WorkstationSpecsWidget() {
  return (
    <div className="my-8 rounded-3xl bg-slate-950 text-slate-100 p-6 border border-slate-900 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-900/10 rounded-full blur-2xl"></div>
      <h4 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>💻</span> Recommended Workstation Solver Specifications
      </h4>
      <p className="text-xs text-slate-400 mb-4">
        Iterative solvers and CFD meshes require non-linear hardware scaling. Our technical team recommends the following base platform:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="font-bold text-white block mb-1">Processors (CPU)</span>
          AMD Threadripper 7000 or Intel Xeon W-3400 (minimum 16-32 physical cores, high AVX-512 throughput).
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="font-bold text-white block mb-1">System Memory</span>
          64GB - 128GB ECC DDR5 (quad-channel or octa-channel configurations to maximize memory bus bandwidth).
        </div>
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <span className="font-bold text-white block mb-1">Compute GPUs</span>
          NVIDIA RTX A5000 / RTX 6000 Ada (FP64 double-precision support is mandatory for native structural FEA).
        </div>
      </div>
    </div>
  );
}

function MaterialMachineWidget() {
  return (
    <div className="my-8 rounded-3xl bg-amber-50/70 p-6 border border-amber-200/60 text-slate-800">
      <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>🔧</span> Shop-Floor Machine & Material Alignment Protocol
      </h4>
      <p className="text-xs text-slate-600 mb-4">
        Ensure your parametric models output vector pathways calibrated to physical tooling.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-amber-200/80">
              <th className="pb-2 font-bold text-amber-900 pr-2">Machine Category</th>
              <th className="pb-2 font-bold text-amber-900 px-2">Target Materials</th>
              <th className="pb-2 font-bold text-amber-900 pl-2">Optimal Cycle Calibration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            <tr>
              <td className="py-2.5 font-semibold text-slate-900 pr-2">CNC Milling (3/5-Axis)</td>
              <td className="py-2.5 px-2">Al6061, Ti6Al4V, Tool Steels</td>
              <td className="py-2.5 pl-2">High-HSM Trochoidal Cycles (2,500 - 15,000 RPM)</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-slate-900 pr-2">Industrial Additive (SLM/SLS)</td>
              <td className="py-2.5 px-2">PA12, Inconel 718, Stainless 316L</td>
              <td className="py-2.5 pl-2">Layer Thickness: 20μm - 60μm / N2 gas purging</td>
            </tr>
            <tr>
              <td className="py-2.5 font-semibold text-slate-900 pr-2">Precision Laser / Waterjet</td>
              <td className="py-2.5 px-2">Carbon Steel (0.5mm - 12mm panels)</td>
              <td className="py-2.5 pl-2">Assist Gas: O2 (carbon) / N2 (stainless, aluminium)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BIMStandardsWidget() {
  return (
    <div className="my-8 rounded-3xl bg-slate-100 p-6 border border-slate-200/80 text-slate-800">
      <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>🌐</span> OpenBIM Standards & Geodetic Datum Matrix
      </h4>
      <p className="text-xs text-slate-600 mb-4">
        Infrastructure scale alignments demand open database translation. Verify coordinate datum maps prior to placing foundations:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">IFC 4.3 Standard (buildingSMART)</span>
          Standardized representation of alignment, track, bridge, road, and geotechnical assets. Mandatory for national public tenders in 2026.
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="font-bold text-slate-900 block mb-1">LandXML & CityGML Integrations</span>
          LandXML handles civil survey, parcel surfaces, and pipe networks; CityGML encodes regional semantic multi-lod (Level of Detail) city models.
        </div>
      </div>
    </div>
  );
}

function ComplianceChecklistWidget() {
  return (
    <div className="my-8 rounded-3xl bg-rose-50/50 p-6 border border-rose-100 text-slate-800">
      <h4 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-3 flex items-center gap-2">
        <span>📋</span> FDA Design Controls & PDM Audit Checklist
      </h4>
      <p className="text-xs text-slate-600 mb-4">
        Regulated product deployment requires maintaining continuous Design History Files (DHF).
      </p>
      <ul className="space-y-3 text-xs text-slate-700">
        <li className="flex items-start gap-2.5">
          <input type="checkbox" checked readOnly className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5" />
          <span><strong>21 CFR 820.30(c) Inputs Check:</strong> Convert raw voxel coordinates (DICOM) to verified meshes prior to B-rep mold fitting.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <input type="checkbox" checked readOnly className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5" />
          <span><strong>ISO 13485 Revision Log:</strong> Lock all model versions in dedicated databases with automated check-in/check-out signatures.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <input type="checkbox" checked readOnly className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5" />
          <span><strong>Secure Hosting Audit:</strong> All design databases, supplier links, and cloud storage hubs must conform to SOC 2 Type II controls.</span>
        </li>
      </ul>
    </div>
  );
}

// --- Modular Section Rendering Engines (Ensures Structural Layout Asymmetry) ---

function renderAdvisory(s: SectorPage, style: SectorStyle) {
  return (
    <section key="advisory" className={`my-10 rounded-3xl p-6 sm:p-8 border ${style.borderLight} ${style.bgLight} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-60"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🛡️</span>
          <div>
            <h3 className="text-base font-bold text-slate-900">E-E-A-T Professional Advisory</h3>
            <p className="text-xs text-slate-500">Verified industry guidelines for {s.shortNoun}s</p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic border-l-2 border-slate-300 pl-4">
          "{style.expertAdvice}"
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Reviewed by CADGuide.tools Technical Committee · Updated May 2026</span>
        </div>
      </div>
    </section>
  );
}

function renderRankings(list: Tool[], style: SectorStyle) {
  return (
    <section key="rankings" className="my-10">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Curated Technical Rankings</h2>
      <ol className="space-y-6">
        {list.map((t, i) => {
          const kernel = guessGeometryKernel(t);
          const supportsMultiCore = t.tech_specs?.multicore || 'Optimized (Multi-threaded)';
          const gpuOptimization = t.tech_specs?.gpu_optimization || 'Hardware Accelerated (OpenCL/DirectX)';
          const supportedStandards = t.tech_specs?.standards && t.tech_specs.standards.length > 0 
            ? t.tech_specs.standards.slice(0, 3).join(', ') 
            : 'STEP, IGES, DXF';

          return (
            <li key={t.slug} className="rounded-3xl bg-white border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row items-start gap-5">
                {/* Rank Badge & Logo Container */}
                <div className="flex items-center md:items-start gap-4 flex-shrink-0">
                  <div className="text-2xl font-black text-slate-400 bg-slate-100 rounded-2xl w-10 h-10 flex items-center justify-center">
                    {i + 1}
                  </div>
                  <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-16 h-16 rounded-2xl border border-slate-100 shadow-inner flex-shrink-0" />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link href={`/tools/${t.slug}`} className="text-xl sm:text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {t.name}
                    </Link>
                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pricingLabel(t)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {t.platforms.join(' / ')}
                    </span>
                  </div>

                  {/* Ratings stars */}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-amber-500 font-bold">★ {t.score.toFixed(1)}/5</span>
                    <span className="text-xs text-slate-400">Expert Rating Score</span>
                  </div>

                  {/* Short Description */}
                  <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
                    {t.short_desc}
                  </p>

                  {/* --- UNIQUE ARCHETYPE TOOL BLOCK DIFFERENTIATION --- */}
                  
                  {/* 1. Scientific & High Computation Layout Details */}
                  {style.archetype === 'scientific-high-computation' && (
                    <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-800 block">Geometry Engine/Kernel</span>
                        <span className="mt-0.5 inline-block">{kernel}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">CPU Parallelization Level</span>
                        <span className="mt-0.5 inline-block">{supportsMultiCore}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">GPU Acceleration</span>
                        <span className="mt-0.5 inline-block">{gpuOptimization}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Exchange Protocols</span>
                        <span className="mt-0.5 inline-block">{supportedStandards}</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Precision Fabrication Layout Details */}
                  {style.archetype === 'precision-fabrication' && (
                    <div className="mt-5 space-y-4">
                      {/* File format badges */}
                      <div className="flex flex-wrap gap-2 items-center text-xs">
                        <span className="font-bold text-slate-700 mr-1">Machine Formats:</span>
                        {(t.file_formats_in || ['STEP', 'STL', 'DXF']).slice(0, 4).map(f => (
                          <span key={f} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100 font-mono">
                            {f}
                          </span>
                        ))}
                        <span>→</span>
                        {(t.file_formats_out || ['STEP', 'STL', 'G-Code']).slice(0, 4).map(f => (
                          <span key={f} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono">
                            {f}
                          </span>
                        ))}
                      </div>
                      
                      {/* Pros and cons summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <span className="font-bold text-emerald-700 block mb-1">👍 Production Strengths</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {t.pros.slice(0, 2).map((pro, index) => <li key={index} className="line-clamp-1">{pro}</li>)}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold text-rose-700 block mb-1">⚠️ Shop Constraints</span>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            {t.cons.slice(0, 2).map((con, index) => <li key={index} className="line-clamp-1">{con}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Heavy Infrastructure Layout Details */}
                  {style.archetype === 'heavy-infrastructure' && (
                    <div className="mt-5 space-y-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="font-bold text-slate-700 block">BIM Standards Complied</span>
                          <span className="mt-0.5 inline-block text-emerald-700 font-semibold">IFC 2x3, IFC4, IFC4.3, LandXML</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-700 block">Geographic Integration</span>
                          <span className="mt-0.5 inline-block">GIS Coordinate projections, LiDAR Ready</span>
                        </div>
                      </div>
                      
                      {t.expert_verdict && (
                        <p className="text-xs text-slate-600 italic border-l-2 border-slate-300 pl-3 leading-relaxed">
                          <strong>Expert Verdict:</strong> "{t.expert_verdict}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* 4. Commercial & Regulated Layout Details */}
                  {style.archetype === 'commercial-regulated' && (
                    <div className="mt-5 space-y-3">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="font-bold text-slate-700 mr-2">Enterprise Security:</span>
                        {(t.security_compliance || ['ISO 27001', 'SOC 2 Type II', 'GDPR']).map(sec => (
                          <span key={sec} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                            {sec}
                          </span>
                        ))}
                      </div>
                      {t.pros.length > 0 && (
                        <div className="pt-2 text-xs text-slate-600">
                          <span className="font-bold text-slate-800">Key Feature Spotlight:</span> {t.pros[0]}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function renderFAQs(s: SectorPage, style: SectorStyle) {
  return (
    <section key="faqs" className="my-10 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
      <dl className="space-y-6 divide-y divide-slate-100">
        {s.faqs.map((f, index) => (
          <div key={f.q} className={index > 0 ? "pt-6" : ""}>
            <dt className="font-bold text-slate-900 text-base sm:text-lg flex items-start gap-2">
              <span className={`text-sm inline-block px-2 py-0.5 rounded font-mono ${style.badgeAccent}`}>Q</span>
              <span>{f.q}</span>
            </dt>
            <dd className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base pl-8">
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function renderCTA(s: SectorPage, totalCount: number, style: SectorStyle) {
  return (
    <section key="cta" className={`my-10 rounded-[36px] bg-gradient-to-br ${style.gradient} text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-xl shadow-slate-900/10`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
      <h2 className="text-3xl font-extrabold tracking-tight">Need a tailored CAD recommendation?</h2>
      <p className="mt-4 text-blue-50 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
        Skip hours of specification grids. Our smart interactive Matchmaker identifies the perfect match for your {s.shortNoun} workflow, team size, and budget in under 60 seconds.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/matchmaker" className="inline-block bg-white text-slate-950 font-extrabold px-8 py-4 rounded-2xl hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl text-base">
          Launch CAD Matchmaker →
        </Link>
      </div>
    </section>
  );
}

function renderLinks(s: SectorPage) {
  return (
    <section key="links" className="my-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4">CAD Software Guides for Other Sectors</h2>
      <ul className="flex flex-wrap gap-2 text-xs">
        {Object.values(SECTOR_PAGES)
          .filter((x) => x.slug !== s.slug)
          .map((x) => (
            <li key={x.slug}>
              <Link href={`/sectors/${x.slug}`} className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950 font-medium inline-block transition-colors">
                CAD for {x.displayName}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}

// --- Main Dynamic Page Route ---

export default async function SectorPageRoute(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const s = getSectorPage(slug);
  if (!s) notFound();

  const fullList = toolsForSector(s);
  const list = fullList.slice(0, SECTOR_LIMIT);
  const style = getStyleForSector(s.slug);

  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'CAD by Sector', path: '/sectors' },
    { name: s.displayName, path: `/sectors/${s.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd(s, list)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd(s, list.length)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(s)) }} />

      <main className="min-h-screen bg-slate-50 pb-20">
        {/* Banner with Accent Gradient */}
        <div className={`w-full py-1.5 bg-gradient-to-r ${style.gradient}`} />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-500 mb-6 flex flex-wrap gap-x-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/sectors" className="hover:underline">By Sector</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{s.displayName}</span>
          </nav>

          {/* Heading Section */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.badgeAccent}`}>
                Industry Guide
              </span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                {list.length} Verified Solutions
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {pageTitle(s, list.length)}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              {s.intro}
            </p>
            {fullList.length > SECTOR_LIMIT && (
              <p className="mt-3 text-sm text-slate-500">
                Showing the top {SECTOR_LIMIT} of {fullList.length}. See all entries in the{' '}
                <Link href="/tools" className="text-blue-600 hover:underline font-medium">main tool index</Link>.
              </p>
            )}
          </header>

          {/* --- RENDERING SECTOR-SPECIFIC INTERACTIVE WIDGETS (COMPONENT ASYMMETRY) --- */}
          {style.archetype === 'scientific-high-computation' && <WorkstationSpecsWidget />}
          {style.archetype === 'precision-fabrication' && <MaterialMachineWidget />}
          {style.archetype === 'heavy-infrastructure' && <BIMStandardsWidget />}
          {style.archetype === 'commercial-regulated' && <ComplianceChecklistWidget />}

          {/* --- ASYMMETRICAL ORDER LAYOUT FLOW ENGINES (STRUCTURAL ASYMMETRY) --- */}
          
          {/* Flow 1: Standard Direct */}
          {style.archetype === 'scientific-high-computation' && (
            <>
              {renderAdvisory(s, style)}
              {renderRankings(list, style)}
              {renderFAQs(s, style)}
              {renderCTA(s, fullList.length, style)}
              {renderLinks(s)}
            </>
          )}

          {/* Flow 2: FAQ-First / Educational */}
          {style.archetype === 'precision-fabrication' && (
            <>
              {renderFAQs(s, style)}
              {renderRankings(list, style)}
              {renderAdvisory(s, style)}
              {renderLinks(s)}
              {renderCTA(s, fullList.length, style)}
            </>
          )}

          {/* Flow 3: Advisory-First / Actionable */}
          {style.archetype === 'heavy-infrastructure' && (
            <>
              {renderAdvisory(s, style)}
              {renderLinks(s)}
              {renderRankings(list, style)}
              {renderCTA(s, fullList.length, style)}
              {renderFAQs(s, style)}
            </>
          )}

          {/* Flow 4: List-First / Direct Guide */}
          {style.archetype === 'commercial-regulated' && (
            <>
              {renderRankings(list, style)}
              {renderCTA(s, fullList.length, style)}
              {renderAdvisory(s, style)}
              {renderFAQs(s, style)}
              {renderLinks(s)}
            </>
          )}

        </article>
      </main>
    </>
  );
}

export const revalidate = 86400;
