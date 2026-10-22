const fs = require('fs');
const path = require('path');

// 1. Upgrade src/app/pricing/[slug]/page.tsx
const pricingPath = path.join(__dirname, '../src/app/pricing/[slug]/page.tsx');
let pricingContent = fs.readFileSync(pricingPath, 'utf8').replace(/\r\n/g, '\n');

const pricingTarget = `        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900 text-xs leading-relaxed">
          <p className="text-slate-300">
            <strong className="text-white uppercase">AutoCAD Alternatives & LISP Compatibility:</strong> Modern perpetual competitors (including BricsCAD, ZWCAD, GstarCAD, nanoCAD) are designed as direct AutoCAD drop-in replacements. They support native DWG files, identical keyboard command aliases, and full LISP programming API integration, enabling design offices to scale down CAD costs by over 60% with zero drafting training downtime.
          </p>
        </div>`;

const pricingReplacement = `        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900 text-xs leading-relaxed space-y-4">
          <p className="text-slate-300">
            <strong className="text-white uppercase">AutoCAD Alternatives & LISP Compatibility:</strong> Modern perpetual competitors (including BricsCAD, ZWCAD, GstarCAD, nanoCAD) are designed as direct AutoCAD drop-in replacements. They support native DWG files, identical keyboard command aliases, and full LISP programming API integration, enabling design offices to scale down CAD costs by over 60% with zero drafting training downtime.
          </p>
          <div className="pt-3 border-t border-indigo-800/60 flex flex-wrap items-center gap-3">
            <Link
              href="/toolbox/cad-subscription-vs-perpetual-roi-calculator"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>🧮 5-Year Subscription vs. Perpetual TCO Calculator →</span>
            </Link>
            <Link
              href="/toolbox/perpetual-cad-migration-compatibility-matrix"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 border border-indigo-400/30 font-bold text-xs transition-all"
            >
              <span>📊 2026 Perpetual CAD Migration Matrix →</span>
            </Link>
            <Link
              href="/toolbox/cad-floating-license-seat-calculator"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 font-bold text-xs transition-all"
            >
              <span>🔑 Floating Network Seat Ratio Estimator →</span>
            </Link>
          </div>
        </div>`;

if (pricingContent.includes(pricingTarget)) {
  pricingContent = pricingContent.replace(pricingTarget, pricingReplacement);
  fs.writeFileSync(pricingPath, pricingContent, 'utf8');
  console.log('✓ Upgraded /pricing/[slug]/page.tsx with TCO Calculator & Migration Matrix CTAs');
} else {
  console.log('ℹ️ /pricing/[slug]/page.tsx already updated or target not found');
}

// 2. Upgrade src/app/file-formats/[slug]/page.tsx
const formatPath = path.join(__dirname, '../src/app/file-formats/[slug]/page.tsx');
let formatContent = fs.readFileSync(formatPath, 'utf8').replace(/\r\n/g, '\n');

const formatWidgetCode = `
function FormatQuickToolsHub({ slug, formatName }: { slug: string; formatName: string }) {
  const s = slug.toLowerCase();
  const links: { title: string; badge: string; href: string; desc: string }[] = [];

  if (s === 'ifc' || s === 'rvt') {
    links.push(
      { title: 'Revit (.RVT) to IFC Converter', badge: 'Top BIM Converter', href: '/convert/revit-to-ifc', desc: 'Convert native Revit projects to ISO 16739 IFC2x3 & IFC4.' },
      { title: 'BIM IFC Model Size Optimizer', badge: 'Size Reducer', href: '/toolbox/ifc-model-size-optimizer', desc: 'Reduce bloated IFC exports by up to 85% via LoD & IFCZIP.' },
      { title: 'IFC2x3 vs IFC4 vs IFC4.3 Matrix', badge: 'Standard Diff', href: '/toolbox/ifc2x3-vs-ifc4-vs-ifc4x3-matrix', desc: 'Compare schema classes, geometry kernels & global BIM mandates.' }
    );
  } else if (s === '3mf' || s === 'stl' || s === 'obj') {
    links.push(
      { title: 'STL / 3MF Mesh Polygon Decimator', badge: 'Size Reducer', href: '/toolbox/stl-mesh-decimator-reducer', desc: 'Reduce multi-million triangle meshes without losing print accuracy.' },
      { title: 'Inventor IPT to STL Converter', badge: '3D Print Ready', href: '/convert/ipt-to-stl', desc: 'Export parametric mechanical parts to watertight 3D print meshes.' },
      { title: 'Non-Manifold Mesh Defect Checker', badge: 'Slicer QA', href: '/toolbox/non-manifold-mesh-checker', desc: 'Verify watertight closure & normal orientation before slicing.' }
    );
  } else if (s === 'step' || s === 'iges' || s === 'sldprt' || s === 'catpart' || s === 'nxprt' || s === 'ipt') {
    links.push(
      { title: 'SLDPRT / CATPart / NX to STEP', badge: 'B-Rep Exchange', href: s === 'catpart' ? '/convert/catpart-to-step' : s === 'nxprt' ? '/convert/nx-prt-to-step' : '/toolbox/sldprt-to-step', desc: 'Lossless neutral ISO 10303-21 B-Rep solid assembly conversion.' },
      { title: 'STEP Assembly Defeature & Reducer', badge: 'Size Optimizer', href: '/toolbox/step-file-size-reducer', desc: 'Strip internal fasteners & threads to shrink 300MB+ STEP files.' },
      { title: 'STEP AP214 vs AP242 Comparator', badge: 'PMI Standard', href: '/toolbox/step-ap214-vs-step-ap242-comparator', desc: 'Compare automotive AP214 vs Model-Based Definition AP242.' }
    );
  } else {
    links.push(
      { title: 'DWG Bloat & File Size Reducer', badge: 'Size Optimizer', href: '/toolbox/dwg-file-size-reducer', desc: 'Purge orphaned DGN linetypes, RegApps & scale lists in seconds.' },
      { title: 'Online CAD File Compressor', badge: '#1 Popular Utility', href: '/toolbox/online-cad-file-compressor', desc: 'Universal CAD & 3D assembly compression and preflight studio.' },
      { title: 'AutoCAD DWG Version Matrix', badge: 'AC1018–AC1032', href: '/toolbox/autocad-dwg-version-feature-matrix', desc: 'Verify header versions and down-saving compatibility risks.' }
    );
  }

  return (
    <section className="my-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            Instant {formatName} Engineering Utilities
          </span>
          <h2 className="text-lg font-black text-white">
            Convert, Compress & Inspect {formatName} Files Online
          </h2>
        </div>
        <Link href="/toolbox/online-cad-file-compressor" className="text-xs font-bold text-indigo-300 hover:text-white underline">
          Universal File Compressor →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-2"
          >
            <div>
              <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 mb-1.5">
                {item.badge}
              </span>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
            </div>
            <span className="text-xs font-extrabold text-indigo-300 pt-1">Launch Tool →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
`;

if (!formatContent.includes('FormatQuickToolsHub')) {
  formatContent = formatContent.replace(
    `          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}`,
    `          <FormatQuickToolsHub slug={slug} formatName={p.formatName} />\n\n          {/* --- ASYMMETRICAL ORDER FLOW ENGINE BY ARCHETYPE --- */}`
  );
  formatContent = formatContent.replace(
    `export default async function FileFormatPage(`,
    `${formatWidgetCode}\nexport default async function FileFormatPage(`
  );
  fs.writeFileSync(formatPath, formatContent, 'utf8');
  console.log('✓ Upgraded /file-formats/[slug]/page.tsx with FormatQuickToolsHub');
}

// 3. Upgrade src/app/platforms/[slug]/page.tsx
const platformPath = path.join(__dirname, '../src/app/platforms/[slug]/page.tsx');
let platformContent = fs.readFileSync(platformPath, 'utf8').replace(/\r\n/g, '\n');

const wsTarget = `      <div className="space-y-3">
        {optimizations.steps.map((step, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-indigo-600 flex-shrink-0">Step {idx + 1}:</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>`;

const wsReplacement = `      <div className="space-y-3">
        {optimizations.steps.map((step, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed flex items-start gap-3">
            <span className="font-bold text-indigo-600 flex-shrink-0">Step {idx + 1}:</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/toolbox/cad-hardware-workstation-spec-builder"
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100 transition-all"
        >
          <span>🖥️ Open 2026 CAD Workstation Hardware Spec Matrix →</span>
        </Link>
        <Link
          href="/toolbox/cad-command-cross-translator"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl border border-slate-200 transition-all"
        >
          <span>🔄 Cross-CAD Command Translator →</span>
        </Link>
      </div>
    </div>`;

const mobileTarget = `      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {capabilities.points.map((p, idx) => (
          <div key={idx} className="p-4 bg-violet-50/20 rounded-xl border border-violet-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-violet-700 block mb-1">Standard {idx + 1}</span>
            {p}
          </div>
        ))}
      </div>
    </div>`;

const mobileReplacement = `      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {capabilities.points.map((p, idx) => (
          <div key={idx} className="p-4 bg-violet-50/20 rounded-xl border border-violet-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-violet-700 block mb-1">Standard {idx + 1}</span>
            {p}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl">
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Sponsored • Instant Mobile & Web CAD</span>
          <p className="text-xs font-bold text-slate-200">Need to open, measure, and mark up DWG/3D files on Android, iOS, or Browser with zero lag?</p>
        </div>
        <a
          href="https://en.dwgfastview.com/"
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-lg shrink-0 text-center transition-all"
        >
          Launch DWG FastView →
        </a>
      </div>
    </div>`;

if (platformContent.includes(wsTarget)) {
  platformContent = platformContent.replace(wsTarget, wsReplacement);
}
if (platformContent.includes(mobileTarget)) {
  platformContent = platformContent.replace(mobileTarget, mobileReplacement);
}
fs.writeFileSync(platformPath, platformContent, 'utf8');
console.log('✓ Upgraded /platforms/[slug]/page.tsx with Workstation Spec Matrix & Mobile CAD CTAs');

// 4. Upgrade src/components/related-tools.tsx with new high-converting tools
const relatedPath = path.join(__dirname, '../src/components/related-tools.tsx');
let relatedContent = fs.readFileSync(relatedPath, 'utf8').replace(/\r\n/g, '\n');

const newPoolItems = `  {
    name: 'DWG Bloat & File Size Reducer',
    desc: 'Diagnose 50MB+ bloated AutoCAD DWG files and purge orphaned DGN linetypes & RegApps.',
    link: '/toolbox/dwg-file-size-reducer',
    icon: Zap,
    tag: 'Size Reducer',
    domain: 'aec',
  },
  {
    name: 'STEP Assembly Defeature & Size Optimizer',
    desc: 'Calculate 3D STEP/SLDASM file size reduction by stripping internal hardware and threads.',
    link: '/toolbox/step-file-size-reducer',
    icon: HardDrive,
    tag: 'Size Optimizer',
    domain: 'mcad',
  },
  {
    name: '5-Year CAD Subscription vs. Perpetual TCO',
    desc: 'Compare 5-year cumulative SaaS rental costs vs. one-time perpetual buyout CAD alternatives.',
    link: '/toolbox/cad-subscription-vs-perpetual-roi-calculator',
    icon: Scale,
    tag: 'ROI & TCO',
    domain: 'general',
  },
  {
    name: '2026 CAD Workstation Hardware Spec Matrix',
    desc: 'Match your CAD/BIM software and assembly size to optimal CPU single-core GHz, RAM & GPU.',
    link: '/toolbox/cad-hardware-workstation-spec-builder',
    icon: Cpu,
    tag: 'Hardware Guide',
    domain: 'mcad',
  },
  {
    name: 'SmartPlant 3D (SP3D) Piping Cheat Sheet',
    desc: 'Searchable PinPoint locks, piping routing hotkeys, and isometric check commands for SP3D.',
    link: '/toolbox/smartplant-3d-shortcuts-sheet',
    icon: LayoutGrid,
    tag: 'Plant & Piping',
    domain: 'bim',
  },
  {
    name: 'STL / 3MF Mesh Polygon Decimator',
    desc: 'Calculate optimal triangle decimation ratios and binary STL byte size for 3D printing.',
    link: '/toolbox/stl-mesh-decimator-reducer',
    icon: Printer,
    tag: 'Mesh Reducer',
    domain: '3dprint',
  },
`;

if (!relatedContent.includes('dwg-file-size-reducer')) {
  relatedContent = relatedContent.replace(
    `const TOOL_POOL: WorkflowToolItem[] = [`,
    `const TOOL_POOL: WorkflowToolItem[] = [\n${newPoolItems}`
  );
  fs.writeFileSync(relatedPath, relatedContent, 'utf8');
  console.log('✓ Upgraded src/components/related-tools.tsx with 6 new flagship tools in TOOL_POOL');
}
