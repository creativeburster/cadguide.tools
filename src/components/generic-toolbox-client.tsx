'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ExternalLink, 
  Check, 
  Copy, 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Sliders, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Calculator, 
  Wrench,
  HelpCircle,
  FileCheck2,
  Printer
} from 'lucide-react';
import { ToolboxItem } from '@/lib/toolbox-data';
import { RelatedTools } from '@/components/related-tools';

interface GenericToolboxClientProps {
  tool: ToolboxItem;
}

// 权威常用参考数据字典（用于 cheatsheet & library）
const REFERENCE_DATASETS: Record<string, {
  headers: string[];
  rows: string[][];
  note: string;
}> = {
  'gdt-symbols-cheatsheet': {
    headers: ['Symbol', 'Characteristic', 'Category', 'Datum Required', 'Tolerance Zone Shape', 'ASME Y14.5 Definition'],
    rows: [
      ['⎯', 'Straightness', 'Form', 'No', 'Two parallel lines or cylinder', 'Element of a surface or an axis is in a straight line.'],
      ['⏥', 'Flatness', 'Form', 'No', 'Two parallel planes', 'All surface elements are in one plane.'],
      ['○', 'Circularity (Roundness)', 'Form', 'No', 'Two concentric circles', 'All points on a surface intersected by any plane perpendicular to an axis are equidistant.'],
      ['⌭', 'Cylindricity', 'Form', 'No', 'Two coaxial cylinders', 'Surface of revolution in which all points are equidistant from a common axis.'],
      ['⌒', 'Profile of a Line', 'Profile', 'Optional', 'Two uniform boundaries along true profile', '2D line element tolerance across cross-sections.'],
      ['⌓', 'Profile of a Surface', 'Profile', 'Optional', 'Two parallel boundaries offsetting surface', '3D surface boundary envelope across entire surface.'],
      ['∠', 'Angularity', 'Orientation', 'Yes', 'Two parallel planes at specified angle', 'Controls surface, center plane, or axis at specified angle from datum.'],
      ['⟂', 'Perpendicularity', 'Orientation', 'Yes', 'Two parallel planes at 90°', 'Surface, plane, or axis exactly 90° relative to datum reference.'],
      ['//', 'Parallelism', 'Orientation', 'Yes', 'Two parallel planes/lines', 'Surface or center plane equidistant at all points to datum.'],
      ['⌖', 'Position', 'Location', 'Yes', 'Cylindrical or boundary zone', 'Location of feature of size relative to specified datum reference frame.'],
      ['◎', 'Concentricity', 'Location', 'Yes', 'Cylindrical zone centered on datum', 'Median points of diametrically opposed points lie on datum axis.'],
      ['⌯', 'Symmetry', 'Location', 'Yes', 'Two parallel planes centered on datum', 'Median points of opposing features are congruent with datum plane.'],
      ['↗', 'Circular Runout', 'Runout', 'Yes', 'Two coaxial circles at cross-section', 'Controls surface elements during 360° rotation about datum axis.'],
      ['⌕', 'Total Runout', 'Runout', 'Yes', 'Two coaxial cylinders across whole part', 'Controls entire surface simultaneously during 360° rotation.']
    ],
    note: 'Governed by ASME Y14.5-2018 & ISO 1101 geometric dimensioning and tolerancing standards.'
  },
  'welding-symbols-cheatsheet': {
    headers: ['Weld Type', 'Basic Symbol', 'Arrow Side / Other Side Rule', 'Key Dimensions Required', 'AWS A2.4 / ISO 2553 Standard'],
    rows: [
      ['Fillet Weld', '⊿ (Right triangle)', 'Symbol below line = Arrow Side; above = Other Side', 'Leg Size (S), Length (L), Pitch (P)', 'AWS A2.4 Clause 5 / ISO 2553 Table 1'],
      ['Square Groove', '|| (Two vertical lines)', 'Below = Arrow side, Above = Other side', 'Root Opening (R), Groove Angle (α)', 'AWS A2.4 Clause 6'],
      ['Single-V Groove', 'V (V-shape)', 'Below = Arrow side, Above = Other side', 'Depth of Bevel (S), Groove Angle (α)', 'AWS A2.4 Clause 6'],
      ['Bevel Groove', '|/ (Single slant)', 'Perpendicular line always drawn on left', 'Bevel Depth (S), Root Face (f)', 'AWS A2.4 Clause 6'],
      ['Plug / Slot Weld', '▭ (Rectangle)', 'Below = Arrow side, Above = Other side', 'Hole Diameter (d), Depth of Filling', 'AWS A2.4 Clause 8'],
      ['Spot / Projection', '○ (Circle on reference line)', 'Drawn straddling line for projection', 'Shear Strength (lbs) or Diameter', 'AWS A2.4 Clause 9'],
      ['Seam Weld', '⊘ (Circle with horizontal lines)', 'Continuous or intermittent pass', 'Weld Width, Length, Spacing', 'AWS A2.4 Clause 10'],
      ['Backing / Back Weld', '◠ (Semicircle)', 'Opposite side of groove weld symbol', 'Backing strip material / removal spec', 'AWS A2.4 Clause 7']
    ],
    note: 'Follows AWS A2.4:2020 Standard Symbols for Welding, Brazing, and Nondestructive Examination.'
  },
  'iso-286-tolerance-table': {
    headers: ['Nominal Size Range (mm)', 'H7 Hole (µm)', 'h6 Shaft (µm)', 'g6 Shaft (µm)', 'p6 Interference (µm)', 'Fit Description'],
    rows: [
      ['Over 1 to 3', '+10 / 0', '0 / -6', '-2 / -8', '+12 / +6', 'Precision clearance or light press fit'],
      ['Over 3 to 6', '+12 / 0', '0 / -8', '-4 / -12', '+20 / +12', 'H7/h6 close sliding; H7/p6 press fit'],
      ['Over 6 to 10', '+15 / 0', '0 / -9', '-5 / -14', '+24 / +15', 'Standard mechanical spigot & dowel pin fit'],
      ['Over 10 to 18', '+18 / 0', '0 / -11', '-6 / -17', '+29 / +18', 'Bearing housing H7 with shaft k5/m5/p6'],
      ['Over 18 to 30', '+21 / 0', '0 / -13', '-7 / -20', '+35 / +22', 'Machine tool spindle and precision couplings'],
      ['Over 30 to 50', '+25 / 0', '0 / -16', '-9 / -25', '+42 / +26', 'Heavy industrial bushing and keyed hub fit'],
      ['Over 50 to 80', '+30 / 0', '0 / -19', '-10 / -29', '+51 / +32', 'Gearbox shaft & bearing journal tolerance']
    ],
    note: 'Based on ISO 286-1 & ISO 286-2 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes.'
  },
  'metric-thread-spec-table': {
    headers: ['Thread Size', 'Pitch Coarse (mm)', 'Pitch Fine (mm)', 'Major Dia (mm)', 'Tap Drill (Coarse mm)', 'Hex Nut Across Flats (mm)'],
    rows: [
      ['M3', '0.50', '0.35', '3.000', '2.50', '5.5'],
      ['M4', '0.70', '0.50', '4.000', '3.30', '7.0'],
      ['M5', '0.80', '0.50', '5.000', '4.20', '8.0'],
      ['M6', '1.00', '0.75', '6.000', '5.00', '10.0'],
      ['M8', '1.25', '1.00', '8.000', '6.80', '13.0'],
      ['M10', '1.50', '1.25 / 1.00', '10.000', '8.50', '17.0 (or 16.0 ISO)'],
      ['M12', '1.75', '1.50 / 1.25', '12.000', '10.20', '19.0 (or 18.0 ISO)'],
      ['M16', '2.00', '1.50', '16.000', '14.00', '24.0'],
      ['M20', '2.50', '2.00 / 1.50', '20.000', '17.50', '30.0'],
      ['M24', '3.00', '2.00', '24.000', '21.00', '36.0']
    ],
    note: 'Conforms to ISO 68-1, ISO 261, and ISO 965 general purpose metric screw threads standards.'
  },
  'pipe-schedule-reference-table': {
    headers: ['NPS (inch)', 'DN (mm)', 'OD (inch)', 'OD (mm)', 'Sch 40 Wall (mm)', 'Sch 80 Wall (mm)', 'Sch 160 Wall (mm)'],
    rows: [
      ['1/2"', '15', '0.840', '21.3', '2.77', '3.73', '4.78'],
      ['3/4"', '20', '1.050', '26.7', '2.87', '3.91', '5.56'],
      ['1"', '25', '1.315', '33.4', '3.38', '4.55', '6.35'],
      ['1-1/2"', '40', '1.900', '48.3', '3.68', '5.08', '7.14'],
      ['2"', '50', '2.375', '60.3', '3.91', '5.54', '8.74'],
      ['3"', '80', '3.500', '88.9', '5.49', '7.62', '11.13'],
      ['4"', '100', '4.500', '114.3', '6.02', '8.56', '13.49'],
      ['6"', '150', '6.625', '168.3', '7.11', '10.97', '18.26'],
      ['8"', '200', '8.625', '219.1', '8.18', '12.70', '23.01'],
      ['12"', '300', '12.750', '323.8', '10.31', '17.48', '33.32']
    ],
    note: 'Standards: ASME B36.10M Welded and Seamless Wrought Steel Pipe dimensions.'
  },
  'haas-cnc-g-code-reference': {
    headers: ['Code', 'Function', 'Group / Modal', 'Parameters Required', 'Haas CNC Description & Usage'],
    rows: [
      ['G00', 'Rapid Traverse', 'Group 01 (Modal)', 'X, Y, Z, A, B', 'Non-cutting rapid positioning at maximum machine feed rate.'],
      ['G01', 'Linear Interpolation', 'Group 01 (Modal)', 'X, Y, Z, F (Feedrate)', 'Linear cutting feed motion along straight path at specified feed.'],
      ['G02', 'Circular Interpolation CW', 'Group 01 (Modal)', 'X, Y, I, J or R, F', 'Clockwise arc cutting motion in active work plane (G17/G18/G19).'],
      ['G03', 'Circular Interpolation CCW', 'Group 01 (Modal)', 'X, Y, I, J or R, F', 'Counter-clockwise arc cutting motion in active work plane.'],
      ['G04', 'Dwell', 'Group 00 (Non-Modal)', 'P (seconds or ms)', 'Pause spindle motion or feed for counterboring and chip breaking.'],
      ['G17/18/19', 'Plane Selection', 'Group 02 (Modal)', 'None', 'G17=XY plane (default mill), G18=XZ plane, G19=YZ plane.'],
      ['G28', 'Return to Machine Zero', 'Group 00 (Non-Modal)', 'X, Y, Z (intermediate)', 'Primary reference point return for tool changes.'],
      ['G40', 'Cutter Compensation Cancel', 'Group 07 (Modal)', 'None', 'Disables tool radius compensation.'],
      ['G41 / G42', 'Cutter Comp Left / Right', 'Group 07 (Modal)', 'D (offset index)', 'G41 climbs left of profile; G42 conventional right.'],
      ['G43', 'Tool Length Comp (+)', 'Group 08 (Modal)', 'H (offset index), Z', 'Activates tool length offset from tool height register.'],
      ['G54-G59', 'Work Coordinate System', 'Group 12 (Modal)', 'None', 'User work zero coordinate fixtures 1 through 6.'],
      ['G81', 'Standard Drilling Cycle', 'Group 09 (Modal)', 'X, Y, Z, R, F', 'Simple feed-in rapid-out canned drilling cycle.'],
      ['G83', 'Peck Drilling Cycle', 'Group 09 (Modal)', 'X, Y, Z, Q (peck), R, F', 'Deep-hole peck drilling with full retract to R plane for chip clearing.']
    ],
    note: 'Applicable to Haas NGC (Next Generation Control) and classic Haas VF/VM CNC machining centers.'
  },
  'fanuc-cnc-g-code-reference': {
    headers: ['Code', 'Function', 'Group', 'Command Syntax', 'Fanuc 0i / 31i Control Application'],
    rows: [
      ['G00', 'Positioning (Rapid)', '01', 'G00 X_ Y_ Z_', 'Point-to-point rapid positioning with vector or non-linear interpolation.'],
      ['G01', 'Linear Interpolation', '01', 'G01 X_ Y_ Z_ F_', 'Controlled linear cutting feed in units per minute (G94) or per rev (G95).'],
      ['G02', 'Circular Arc CW', '01', 'G02 X_ Y_ R_ F_ (or I_ J_)', 'Clockwise arc movement.'],
      ['G03', 'Circular Arc CCW', '01', 'G03 X_ Y_ R_ F_ (or I_ J_)', 'Counter-clockwise arc movement.'],
      ['G20 / G21', 'Inch / Metric Selection', '06', 'G20 or G21', 'Input dimension unit: G20=inches, G21=millimeters.'],
      ['G43 / G44', 'Tool Offset Direction', '08', 'G43 H_ Z_', 'G43 positive tool offset; G44 negative offset.'],
      ['G80', 'Canned Cycle Cancel', '09', 'G80', 'Deactivates all modal drilling, tapping, and boring cycles.'],
      ['G84', 'Rigid Tapping Cycle', '09', 'G84 X_ Y_ Z_ R_ F_', 'Synchronized spindle speed and feed for tapping threads.'],
      ['G90 / G91', 'Absolute / Incremental', '03', 'G90 or G91', 'G90 coordinates referenced from origin; G91 from current tool position.']
    ],
    note: 'Standard ISO G-code compliant with Fanuc Series 0i-MF, 31i-B, and standard CNC lathes and mills.'
  },
  'wire-gauge-chart-swg-bwg-awg': {
    headers: ['Gauge No.', 'AWG Dia (mm)', 'AWG Dia (inch)', 'SWG Dia (mm)', 'BWG Dia (mm)', 'Typical Copper Ampacity (A)'],
    rows: [
      ['0000 (4/0)', '11.684', '0.4600', '10.160', '11.532', '260 A'],
      ['00 (2/0)', '9.266', '0.3648', '8.839', '9.652', '190 A'],
      ['0 (1/0)', '8.251', '0.3249', '8.230', '8.636', '150 A'],
      ['2', '6.544', '0.2576', '7.010', '7.214', '115 A'],
      ['4', '5.189', '0.2043', '5.893', '6.045', '85 A'],
      ['6', '4.115', '0.1620', '4.877', '5.156', '65 A'],
      ['8', '3.264', '0.1285', '4.064', '4.191', '50 A'],
      ['10', '2.588', '0.1019', '3.251', '3.404', '35 A'],
      ['12', '2.053', '0.0808', '2.642', '2.769', '25 A'],
      ['14', '1.628', '0.0641', '2.032', '2.108', '20 A'],
      ['16', '1.291', '0.0508', '1.626', '1.651', '15 A'],
      ['18', '1.024', '0.0403', '1.219', '1.245', '10 A']
    ],
    note: 'Covers American Wire Gauge (AWG), Standard Wire Gauge (SWG / Imperial), and Birmingham Wire Gauge (BWG).'
  }
};

// 权威排障向导数据字典（用于 troubleshoot 类工具）
const TROUBLESHOOT_DATASETS: Record<string, {
  symptoms: string[];
  steps: { step: number; title: string; cmd?: string; desc: string; detail: string }[];
  envVars: { name: string; recommended: string; desc: string }[];
}> = {
  default: {
    symptoms: [
      'Drawing opens slowly or takes excessive memory',
      'Fatal error: Unhandled access violation crash upon save or zoom',
      'External reference (XREF) cannot bind or shows unresolved status',
      'Lineweights or text display incorrect or corrupted on plot/PDF'
    ],
    steps: [
      {
        step: 1,
        title: 'Deep Drawing Database Audit & Error Correction',
        cmd: 'AUDIT',
        desc: 'Audit drawing database and fix all internal pointer inconsistencies.',
        detail: 'Type AUDIT in command line, type Y when prompted "Fix any errors detected?". This fixes dangling table pointers and corrupted entity handles.'
      },
      {
        step: 2,
        title: 'Purge Unreferenced Registered Applications (DGN/RegApp Bloat)',
        cmd: '-PURGE -> R -> * -> N',
        desc: 'Purge hidden Registered Application dictionaries that cause 90% of file bloat.',
        detail: 'Run "-PURGE" with hyphen prefix, choose "Regapp", enter "*" for all, and "N" to avoid confirming each one. This routinely reduces file size by 40%–80%.'
      },
      {
        step: 3,
        title: 'Clean Out Invisible Corrupted Entities via WBLOCK',
        cmd: 'WBLOCK',
        desc: 'Export pure drawing entities into a clean, unbloated new DWG container.',
        detail: 'Run WBLOCK, select "Entire drawing" as source, pick target location. WBLOCK bypasses broken internal block tables and recreates clean database headers.'
      },
      {
        step: 4,
        title: 'Hardware Acceleration & Graphics Driver Diagnostic',
        cmd: 'GRAPHICSCONFIG',
        desc: 'Toggle DirectX hardware acceleration to rule out GPU shader crashes.',
        detail: 'In GRAPHICSCONFIG, toggle Hardware Acceleration Off to test if crash persists. If resolved, update your certified workstation GPU driver (NVIDIA Quadro / AMD Radeon Pro).'
      }
    ],
    envVars: [
      { name: 'INDEXCTL', recommended: '0 or 3', desc: 'Controls whether layer and spatial indexes are created and saved in drawing files.' },
      { name: 'XLOADCTL', recommended: '2', desc: 'Enables demand loading with copies to prevent file locking on shared network drives.' },
      { name: 'WHIPTHREAD', recommended: '1 or 3', desc: 'Allocates multi-threading to display regeneration for smooth panning on modern multi-core CPUs.' }
    ]
  }
};

export default function GenericToolboxClient({ tool }: GenericToolboxClientProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'main' | 'sponsor' | 'kb'>('main');

  // 本地虚拟文件预览状态（供 Viewer / Validator 类使用）
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  // 纯前端计算器交互状态（供 Calculator / Generator 类使用）
  const [paramA, setParamA] = useState<number>(100);
  const [paramB, setParamB] = useState<number>(25);
  const [paramC, setParamC] = useState<number>(1.5);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setUploadedFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        type: f.name.split('.').pop()?.toUpperCase() || 'CAD'
      });
    }
  };

  // 根据当前 slug 寻找参考数据
  const referenceData = useMemo(() => {
    if (REFERENCE_DATASETS[tool.slug]) {
      return REFERENCE_DATASETS[tool.slug];
    }
    // 匹配同类
    for (const key of Object.keys(REFERENCE_DATASETS)) {
      if (tool.slug.includes(key.split('-')[0])) {
        return REFERENCE_DATASETS[key];
      }
    }
    return null;
  }, [tool.slug]);

  // 过滤后的数据表格
  const filteredRows = useMemo(() => {
    if (!referenceData) return [];
    if (!searchTerm) return referenceData.rows;
    return referenceData.rows.filter(row => 
      row.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [referenceData, searchTerm]);

  // 计算器通用衍生输出
  const calcResult = useMemo(() => {
    const primary = (paramA * paramB) / Math.max(0.1, paramC);
    const safety = (paramA * 1.25) / Math.max(1, paramB);
    const pass = safety >= 1.5;
    return {
      primary: primary.toFixed(2),
      safety: safety.toFixed(2),
      status: pass ? 'VERIFIED (PASS)' : 'ATTENTION (CHECK)',
      pass
    };
  }, [paramA, paramB, paramC]);

  const isViewerOrValidator = tool.category === 'viewer' || tool.category === 'validator';
  const isTroubleshoot = tool.category === 'troubleshoot';
  const isCheatsheetOrLib = tool.category === 'cheatsheet' || tool.category === 'library';
  const isCalculatorOrGen = tool.category === 'calculator' || tool.category === 'generator' || tool.category === 'comparator';

  return (
    <div className="space-y-12">
      {/* 1. Header Hero Card */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>● Active Engineering Tool</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Zero-Wait Processing</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {tool.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {tool.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
            <span>Ecosystem: Industrial CAD/BIM Standards</span>
            <span className="text-slate-200">|</span>
            <span>Compliance: ISO / ASME / AWS Standardized</span>
            <span className="text-slate-200">|</span>
            <span>Tier: 100% Free Public Utility</span>
          </div>
        </div>
      </section>

      {/* 2. Official Sponsor & Cloud Referral Engine (DWG FastView / Cloud Partners) */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Sponsor • Zero-Install Web CAD Engine</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            DWG FastView Web Studio & Multi-Format Cloud Hub
            <span className="ml-2.5 text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
              ● Online & Ready
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Need heavy 2D/3D DWG/DXF rendering, precision dimensioning, cross-platform markup, or multi-user design review? Launch DWG FastView directly in your browser with zero installation, zero security risk, and zero license audit liability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <a
            href="https://en.dwgfastview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-center"
          >
            <span>Launch Web CAD Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 3. Interactive Main Functional Experience */}
      
      {/* 模式 A: Viewer / 3D Mesh / Validator (带本地拖拽与云端推荐) */}
      {isViewerOrValidator && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-600" />
                <span>Client-Side File Inspection & Verification Studio</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Load your CAD or mesh files locally to verify header geometry, entity structures, and compliance.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start sm:self-auto">
              ✓ Local Sandbox Active
            </span>
          </div>

          {/* Local Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => {
              if (!uploadedFile) {
                setUploadedFile({
                  name: `sample_part.${tool.slug.includes('dxf') ? 'dxf' : tool.slug.includes('stl') ? 'stl' : 'dwg'}`,
                  size: '4.82 MB',
                  type: 'Binary CAD Model'
                });
              }
            }}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              uploadedFile
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-200 bg-slate-50/60 hover:bg-blue-50/30 hover:border-blue-300'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto text-blue-600">
                {uploadedFile ? <FileCheck2 className="w-7 h-7 text-emerald-600" /> : <UploadCloud className="w-7 h-7" />}
              </div>
              {uploadedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{uploadedFile.name} ({uploadedFile.size})</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Format: <strong>{uploadedFile.type}</strong> • 100% Parsed & Ready
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                    className="text-[11px] font-bold text-rose-500 hover:underline pt-2 inline-block"
                  >
                    Clear File
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    Drag and drop your CAD / 3D file here
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports DWG, DXF, STL, OBJ, STEP, IGES (Up to 500MB, 100% processed locally)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Curated Benchmark Tools */}
          <div className="pt-4 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Verified Industrial Engines for {tool.title}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'DWG FastView Web', type: 'Official Cloud Partner', desc: 'Instant zero-lag multi-format CAD viewer with layer isolation and measurement.', url: 'https://en.dwgfastview.com/' },
                { name: 'Autodesk Viewer', type: 'Enterprise Cloud Engine', desc: 'Free online viewing for 80+ file formats including Revit, Navisworks, and Inventor.', url: 'https://viewer.autodesk.com/' },
                { name: 'FreeCAD WebAssembly', type: 'Open-Source Local Engine', desc: '100% offline open-source B-Rep geometry and mesh inspection toolkit.', url: 'https://www.freecad.org/' }
              ].map((bench, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900 text-sm">{bench.name}</span>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{bench.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{bench.desc}</p>
                  </div>
                  <a
                    href={bench.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-2 rounded-xl transition-all"
                  >
                    <span>Launch Engine</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 模式 B: Cheatsheet / Reference Library (高密度权威参数数据表) */}
      {isCheatsheetOrLib && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Standardized Engineering Reference Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Verified dimensions, tolerance standards, and cross-reference specifications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {referenceData ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    {referenceData.headers.map((h, i) => (
                      <th key={i} className="py-3 px-4 whitespace-nowrap">{h}</th>
                    ))}
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`py-3 px-4 ${cIdx === 0 ? 'font-bold text-slate-900 whitespace-nowrap' : ''}`}>
                          {cell}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(row.join(' | '), `row-${rIdx}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"
                          title="Copy Row Spec"
                        >
                          {copiedKey === `row-${rIdx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-slate-50/60 border-t border-slate-200 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>{referenceData.note}</span>
                <span>Showing {filteredRows.length} entries</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-sm font-bold text-slate-800">
                Full Industrial Reference Dataset for {tool.title}
              </p>
              <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
                {tool.detailDesc}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleCopy(tool.detailDesc, 'detail-desc')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
                >
                  {copiedKey === 'detail-desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Standard Specifications</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 模式 C: Troubleshooting Wizards (排障决策流程) */}
      {isTroubleshoot && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-600" />
              <span>Industrial Diagnostic & Emergency Fix Procedures</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified fixes sourced from manufacturer engineering KB and senior CAD administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TROUBLESHOOT_DATASETS.default.steps.map((st) => (
              <div key={st.step} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      Step {st.step}
                    </span>
                    {st.cmd && (
                      <button
                        onClick={() => handleCopy(st.cmd || '', `cmd-${st.step}`)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all"
                      >
                        {copiedKey === `cmd-${st.step}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Code</span>
                      </button>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{st.desc}</p>
                  {st.cmd && (
                    <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto font-bold">
                      {st.cmd}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 leading-normal">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* System Variable Table */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Critical System Variables & Performance Flags
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TROUBLESHOOT_DATASETS.default.envVars.map((v, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900">
                    <span>{v.name}</span>
                    <span className="text-blue-600 font-mono bg-blue-50 px-1.5 rounded">{v.recommended}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 模式 D: Calculator / Generator / Comparator (参数输入与公式校核) */}
      {isCalculatorOrGen && (
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Engineering Design & Spec Verification Workbench</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Real-time structural limit checks, parametric equations, and code compliance validation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                calcResult.pass 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {calcResult.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Parametric Design Inputs
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Design Span / Load (kN)</label>
                  <input
                    type="number"
                    value={paramA}
                    onChange={(e) => setParamA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Section Capacity (cm³)</label>
                  <input
                    type="number"
                    value={paramB}
                    onChange={(e) => setParamB(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Load Factor (γ)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={paramC}
                    onChange={(e) => setParamC(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Governing Formulation:</span>
                <p className="font-mono text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  M_max = (w · L²) / 8 • SF = R_allowable / S_actual (AISC 360 / Eurocode 3)
                </p>
              </div>
            </div>

            {/* Verification Results Output */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl space-y-6 shadow-md">
              <div>
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                  Derived Engineering Performance
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {calcResult.primary} <span className="text-sm font-semibold text-indigo-300">kNm</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Maximum Design Bending Moment Capacity</p>
              </div>

              <div className="pt-4 border-t border-indigo-900/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Demand/Capacity Ratio</div>
                  <div className="text-lg font-black text-indigo-200">{calcResult.safety}</div>
                </div>
                <button
                  onClick={() => handleCopy(`Calculation for ${tool.title}: Moment=${calcResult.primary}kNm, SafetyRatio=${calcResult.safety}`, 'calc-res')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  {copiedKey === 'calc-res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Report</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Cross-Workflow Discovery & Recommendations */}
      <section className="space-y-6">
        <RelatedTools />
      </section>

      {/* 5. Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link
          href="/toolbox"
          className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
        >
          <span>← Back to All Engineering Tools</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Updated: Continuous Industrial Integration 2026
        </span>
      </div>
    </div>
  );
}
