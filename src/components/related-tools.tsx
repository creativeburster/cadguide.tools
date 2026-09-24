'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileSearch,
  Zap,
  AlertTriangle,
  Type,
  Ruler,
  Layers,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Cpu,
  FileCode,
  HardDrive
} from 'lucide-react';

export interface WorkflowToolItem {
  name: string;
  desc: string;
  link: string;
  icon: typeof LayoutGrid;
  tag?: string;
  domain: 'mcad' | 'aec' | 'bim' | '3dprint' | 'general';
}

const TOOL_POOL: WorkflowToolItem[] = [
  // --- MCAD & Mechanical Engineering Tools ---
  {
    name: 'K-Factor & Bend Allowance Calc',
    desc: 'Calculate sheet metal neutral axis shift, bend deductions, and flat pattern blank sizes per DIN 6935.',
    link: '/toolbox/k-factor-calculator',
    icon: Ruler,
    tag: 'Calculators',
    domain: 'mcad',
  },
  {
    name: 'Online CAD File Compressor',
    desc: 'Reduce large CAD assemblies and mesh file sizes by up to 80% without geometry precision loss.',
    link: '/toolbox/online-cad-file-compressor',
    icon: Zap,
    tag: 'Popular',
    domain: 'mcad',
  },
  {
    name: 'SolidWorks Shortcuts Cheatsheet',
    desc: 'Interactive hotkeys for sketch tools, feature mates, assembly evaluation, and drawing sheets.',
    link: '/toolbox/solidworks-shortcuts-sheet',
    icon: LayoutGrid,
    tag: 'Productivity',
    domain: 'mcad',
  },
  {
    name: 'STEP File Header & Schema Parser',
    desc: 'Parse AP203/AP214/AP242 schemas, authoring CAD kernel origins, and units directly in-browser.',
    link: '/toolbox/step-file-header-parser',
    icon: FileCode,
    tag: 'Inspection',
    domain: 'mcad',
  },
  {
    name: 'SolidWorks vs Fusion 360',
    desc: 'Deep side-by-side comparison of parametric modeling, cloud PDM, CAM, and pricing in 2026.',
    link: '/compare/fusion-360-vs-solidworks',
    icon: Scale,
    tag: 'Comparison',
    domain: 'mcad',
  },
  {
    name: 'Sheet Metal Punching Force Calc',
    desc: 'Estimate tonnage requirements for press brakes, shear blades, and CNC punch presses.',
    link: '/toolbox/punching-force-calculator',
    icon: Cpu,
    tag: 'Fabrication',
    domain: 'mcad',
  },

  // --- AEC & AutoCAD Drafting Tools ---
  {
    name: 'DWG Version & Release Checker',
    desc: 'Instantly identify AutoCAD file format versions (AC1032, AC1027, AC1024) and app compatibility.',
    link: '/toolbox/dwg-version-checker',
    icon: FileSearch,
    tag: 'Popular',
    domain: 'aec',
  },
  {
    name: 'Drawing Lag & Database Cleaner',
    desc: 'Purge orphan regapps, unreferenced DGN linestyles, and block bloat causing viewport freezing.',
    link: '/toolbox/drawing-lag-performance-cleaner',
    icon: Zap,
    tag: 'Speed Up',
    domain: 'aec',
  },
  {
    name: 'AutoCAD pgp Command Alias Editor',
    desc: 'Edit, customize, clean, and download your acad.pgp shortcut definitions in a visual client.',
    link: '/toolbox/acad-pgp-alias-editor',
    icon: LayoutGrid,
    tag: 'Customizer',
    domain: 'aec',
  },
  {
    name: 'AutoCAD vs GstarCAD Shortcuts',
    desc: 'Side-by-side comparison of command alias compatibility and migration differences.',
    link: '/toolbox/autocad-vs-gstarcad-shortcuts',
    icon: Scale,
    tag: 'Migration',
    domain: 'aec',
  },
  {
    name: 'Fatal Error Crash Diagnostic Wizard',
    desc: 'Step-by-step resolution for graphics hardware acceleration crashes and access violation traps.',
    link: '/toolbox/fatal-error-diagnostic-wizard',
    icon: AlertTriangle,
    tag: 'Troubleshoot',
    domain: 'aec',
  },
  {
    name: 'SHX Missing Font & Gibberish Resolver',
    desc: 'Fix missing question mark symbols, bigfont codepages, and compile SHX shapes for clear prints.',
    link: '/toolbox/missing-font-shx-resolver',
    icon: Type,
    tag: 'Fix Font',
    domain: 'aec',
  },

  // --- BIM & Architectural Coordination Tools ---
  {
    name: 'Revit to IFC High-Precision Converter',
    desc: 'Step-by-step export setup guide for IFC2x3, IFC4, Pset property mapping, and geometry verification.',
    link: '/convert/revit-to-ifc',
    icon: FileCode,
    tag: 'BIM Standard',
    domain: 'bim',
  },
  {
    name: 'Revit Family Parameter Calculator',
    desc: 'Audit nested family formulas, flex geometry constraints, and streamline model performance.',
    link: '/toolbox/revit-family-param-calculator',
    icon: Layers,
    tag: 'Family Tuning',
    domain: 'bim',
  },
  {
    name: 'ArchiCAD vs Revit BIM Comparison',
    desc: 'Detailed architectural BIM analysis: Apple Silicon macOS support, OpenBIM, and collaboration.',
    link: '/compare/archicad-vs-revit',
    icon: Scale,
    tag: 'BIM Showdown',
    domain: 'bim',
  },
  {
    name: 'Revit Worksharing Conflict Resolver',
    desc: 'Resolve central model sync locks, element ownership borrow permissions, and slow worksets.',
    link: '/toolbox/revit-worksharing-wizard',
    icon: ShieldCheck,
    tag: 'Coordination',
    domain: 'bim',
  },
  {
    name: 'Point Cloud Density & Scan Sizer',
    desc: 'Compute decimation grids, laser scan point intervals, and LAS/E57 memory footprints for BIM.',
    link: '/toolbox/point-cloud-density-calculator',
    icon: HardDrive,
    tag: 'Surveying',
    domain: 'bim',
  },
  {
    name: 'Revit Shortcuts & Keyboard Aliases',
    desc: 'Complete keyboard shortcut table for architectural walls, doors, structural grids, and views.',
    link: '/toolbox/revit-shortcuts-sheet',
    icon: LayoutGrid,
    tag: 'Productivity',
    domain: 'bim',
  },

  // --- 3D Printing & Additive Manufacturing Tools ---
  {
    name: '3D Printing Chordal Deviation Optimizer',
    desc: 'Balance polygonal faceting vs file size when exporting STEP/CAD solids into watertight STL/3MF.',
    link: '/toolbox/3d-printing-chordal-deviation',
    icon: Ruler,
    tag: 'Mesh Quality',
    domain: '3dprint',
  },
  {
    name: 'STL Mesh Integrity & Slicer Checker',
    desc: 'Identify non-manifold edges, inverted surface normals, and intersecting shells before printing.',
    link: '/toolbox/stl-mesh-checker',
    icon: AlertTriangle,
    tag: 'Print Prep',
    domain: '3dprint',
  },
  {
    name: '3D Print Cost & Layer Time Estimator',
    desc: 'Calculate material filament weight, machine amortized hourly rates, and total part cost.',
    link: '/toolbox/3d-print-cost-time-estimator',
    icon: Zap,
    tag: 'Cost Estimator',
    domain: '3dprint',
  },
  {
    name: 'Blender Keyboard Shortcuts Reference',
    desc: 'Comprehensive hotkeys for 3D modeling, mesh editing, sculpting brushes, and Cycles rendering.',
    link: '/toolbox/blender-shortcuts-sheet',
    icon: LayoutGrid,
    tag: '3D Modeling',
    domain: '3dprint',
  },
  {
    name: 'Online STEP to STL Slicer Helper',
    desc: 'Convert STEP/IGES assemblies to optimized 3MF/STL geometry for PrusaSlicer & Bambu Studio.',
    link: '/toolbox/online-step-to-stl-slicer-helper',
    icon: Printer,
    tag: 'Conversion',
    domain: '3dprint',
  },
];

interface RelatedToolsProps {
  gridCols?: string;
  limit?: number;
  compact?: boolean;
  category?: 'mcad' | 'aec' | 'bim' | '3dprint' | 'general';
  headline?: string;
  subheadline?: string;
}

export function RelatedTools({
  gridCols,
  limit = 6,
  compact = false,
  category,
  headline,
  subheadline
}: RelatedToolsProps = {}) {
  const pathname = usePathname() || '';

  // Infer the engineering domain dynamically from the current pathname if not explicitly passed
  const inferredDomain = useMemo(() => {
    if (category) return category;

    const p = pathname.toLowerCase();

    // 1. BIM & Architectural indicators
    if (
      p.includes('revit') ||
      p.includes('archicad') ||
      p.includes('bim') ||
      p.includes('ifc') ||
      p.includes('hvac') ||
      p.includes('duct') ||
      p.includes('concrete') ||
      p.includes('rebar') ||
      p.includes('wall') ||
      p.includes('stair') ||
      p.includes('plumbing')
    ) {
      return 'bim';
    }

    // 2. 3D Printing & Additive Manufacturing indicators
    if (
      p.includes('3d-print') ||
      p.includes('stl') ||
      p.includes('slic') ||
      p.includes('chordal') ||
      p.includes('mesh') ||
      p.includes('blender')
    ) {
      return '3dprint';
    }

    // 3. MCAD & Mechanical Engineering indicators
    if (
      p.includes('solidworks') ||
      p.includes('inventor') ||
      p.includes('creo') ||
      p.includes('k-factor') ||
      p.includes('bend') ||
      p.includes('sheet-metal') ||
      p.includes('stress') ||
      p.includes('strain') ||
      p.includes('beam') ||
      p.includes('gear') ||
      p.includes('shaft') ||
      p.includes('bolt') ||
      p.includes('bearing') ||
      p.includes('torque') ||
      p.includes('punch') ||
      p.includes('compressor') ||
      p.includes('step')
    ) {
      return 'mcad';
    }

    // 4. AEC & 2D Drafting / AutoCAD indicators
    if (
      p.includes('autocad') ||
      p.includes('dwg') ||
      p.includes('dxf') ||
      p.includes('acad') ||
      p.includes('gstarcad') ||
      p.includes('zwcad') ||
      p.includes('bricscad') ||
      p.includes('lisp') ||
      p.includes('hatch') ||
      p.includes('font') ||
      p.includes('shx') ||
      p.includes('layer') ||
      p.includes('draft')
    ) {
      return 'aec';
    }

    // Fallback: general engineering
    return 'general';
  }, [category, pathname]);

  // Select tools matching the inferred domain, excluding the current tool URL
  const tools = useMemo(() => {
    // Collect domain matching tools
    let selected = TOOL_POOL.filter(t => {
      // Exclude self-links
      if (t.link === pathname || pathname.endsWith(t.link)) return false;
      if (inferredDomain === 'general') return true;
      return t.domain === inferredDomain;
    });

    // If matching count is too low, backfill with high-retention cross-domain tools
    if (selected.length < limit) {
      const backfill = TOOL_POOL.filter(t => {
        if (t.link === pathname || pathname.endsWith(t.link)) return false;
        return !selected.some(s => s.link === t.link);
      });
      selected = [...selected, ...backfill];
    }

    return selected.slice(0, limit);
  }, [inferredDomain, pathname, limit]);

  // Dynamic headlines matching the domain
  const headerContent = useMemo(() => {
    if (headline) {
      return {
        title: headline,
        subtitle: subheadline || 'Curated high-performance tools for your engineering workflow'
      };
    }

    switch (inferredDomain) {
      case 'mcad':
        return {
          title: 'Next Steps in Your Mechanical Workflow',
          subtitle: 'Handpicked calculators, parsers, and shortcuts for sheet metal, modeling & fabrication'
        };
      case 'bim':
        return {
          title: 'Next Steps in Your BIM & AEC Workflow',
          subtitle: 'Essential IFC exporters, family optimizers, and coordination tools for architects & engineers'
        };
      case '3dprint':
        return {
          title: 'Additive Manufacturing & Mesh Utilities',
          subtitle: 'Verify watertight STL geometry, calculate print costs, and optimize chordal deviations'
        };
      case 'aec':
        return {
          title: 'Essential AutoCAD & 2D Drafting Utilities',
          subtitle: 'Clean drawing lag, check DWG format releases, and customize keyboard aliases'
        };
      default:
        return {
          title: 'Recommended Engineering & CAD Utilities',
          subtitle: 'Handpicked companion tools to streamline modeling, calculation, and drafting workflows'
        };
    }
  }, [headline, subheadline, inferredDomain]);

  if (compact) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 print:hidden">
        <div>
          <h3 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            {headerContent.title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
            {headerContent.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.link}
                href={tool.link}
                className="group relative bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-white group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-slate-900 font-bold text-sm group-hover:text-blue-600 transition-colors truncate">
                      {tool.name}
                    </h4>
                    {tool.tag && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md shrink-0">
                        {tool.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <Link href="/toolbox" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 group">
            Browse All 100+ Free CAD Tools
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/compare" className="text-slate-400 hover:text-slate-600 font-semibold">
            Compare Software →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm flex flex-col gap-8 print:hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-600 border border-blue-100 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next Steps in Workflow
          </div>
          <h3 className="text-slate-900 font-black text-2xl tracking-tight">
            {headerContent.title}
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {headerContent.subtitle}
          </p>
        </div>
        <Link
          href="/toolbox"
          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 shrink-0 group"
        >
          Explore Full CAD Toolbox
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className={gridCols || "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.link}
              href={tool.link}
              className="group relative bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-600 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-blue-200 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.tag && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-full group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-colors">
                      {tool.tag}
                    </span>
                  )}
                </div>
                <h4 className="text-slate-900 font-bold text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {tool.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Launch Utility</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
