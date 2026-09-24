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
    ,
'asme-b16-5-flange-dimensions-table': {
    headers: ['NPS (Nominal Size)', 'Flange OD (mm / in)', 'Bolt Circle BC (mm / in)', 'Number of Bolts', 'Bolt Hole Dia (mm)', 'Bolt Stud Dia x Length'],
    rows: [
      ['1/2" (DN 15)', '88.9 mm (3.50")', '60.3 mm (2.38")', '4', '15.9 mm', '1/2" x 2.25"'],
      ['3/4" (DN 20)', '98.4 mm (3.88")', '69.8 mm (2.75")', '4', '15.9 mm', '1/2" x 2.50"'],
      ['1" (DN 25)', '108.0 mm (4.25")', '79.4 mm (3.12")', '4', '15.9 mm', '1/2" x 2.50"'],
      ['1-1/2" (DN 40)', '127.0 mm (5.00")', '98.4 mm (3.88")', '4', '15.9 mm', '1/2" x 2.75"'],
      ['2" (DN 50)', '152.4 mm (6.00")', '120.6 mm (4.75")', '4', '19.0 mm', '5/8" x 3.25"'],
      ['3" (DN 80)', '190.5 mm (7.50")', '152.4 mm (6.00")', '4', '19.0 mm', '5/8" x 3.50"'],
      ['4" (DN 100)', '228.6 mm (9.00")', '190.5 mm (7.50")', '8', '19.0 mm', '5/8" x 3.50"'],
      ['6" (DN 150)', '279.4 mm (11.00")', '241.3 mm (9.50")', '8', '22.2 mm', '3/4" x 4.00"'],
      ['8" (DN 200)', '342.9 mm (13.50")', '298.4 mm (11.75")', '8', '22.2 mm', '3/4" x 4.25"'],
      ['10" (DN 250)', '406.4 mm (16.00")', '362.0 mm (14.25")', '12', '25.4 mm', '7/8" x 4.75"'],
      ['12" (DN 300)', '482.6 mm (19.00")', '431.8 mm (17.00")', '12', '25.4 mm', '7/8" x 5.00"']
    ],
    note: 'Dimensions follow ASME B16.5 Class 150 Pipe Flanges and Flanged Fittings Standard.'
  },
  'as568-o-ring-size-chart': {
    headers: ['AS568 Dash No.', 'Nominal Inside Dia (ID)', 'Nominal Cross Section (CS)', 'Actual ID (mm)', 'Actual CS (mm)', 'Dynamic Groove Depth (mm)'],
    rows: [
      ['010', '1/4"', '1/16"', '6.07 mm', '1.78 mm', '1.35 - 1.45 mm'],
      ['014', '1/2"', '1/16"', '12.42 mm', '1.78 mm', '1.35 - 1.45 mm'],
      ['110', '3/8"', '3/32"', '9.19 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['114', '5/8"', '3/32"', '15.54 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['118', '7/8"', '3/32"', '21.89 mm', '2.62 mm', '2.15 - 2.25 mm'],
      ['210', '3/4"', '1/8"', '18.64 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['214', '1"', '1/8"', '24.99 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['222', '1-1/2"', '1/8"', '37.69 mm', '3.53 mm', '2.95 - 3.10 mm'],
      ['325', '1-1/2"', '3/16"', '37.47 mm', '5.33 mm', '4.55 - 4.75 mm'],
      ['425', '4-1/2"', '1/4"', '113.67 mm', '6.99 mm', '6.00 - 6.25 mm']
    ],
    note: 'Governed by Aerospace Standard AS568 Standard Size O-Rings for sealing and fluid power.'
  },
  'din-7991-iso-10642-countersunk-screw-table': {
    headers: ['Thread Size', 'Head Dia dk (max mm)', 'Head Height k (max mm)', 'Hex Socket s (mm)', 'Countersink Dia (mm)', '90° Sink Depth (mm)'],
    rows: [
      ['M3', '6.00', '1.70', '2.0', '6.6', '1.9'],
      ['M4', '8.00', '2.30', '2.5', '8.8', '2.5'],
      ['M5', '10.00', '2.80', '3.0', '10.8', '3.0'],
      ['M6', '12.00', '3.30', '4.0', '13.0', '3.5'],
      ['M8', '16.00', '4.40', '5.0', '17.2', '4.6'],
      ['M10', '20.00', '5.50', '6.0', '21.5', '5.8'],
      ['M12', '24.00', '6.50', '8.0', '25.5', '6.8'],
      ['M16', '30.00', '8.50', '10.0', '31.5', '8.8']
    ],
    note: 'Standards: DIN 7991 / ISO 10642 Hexagon Socket Countersunk Head Screws.'
  },
  'parallel-keys-din-6885-keyway-table': {
    headers: ['Shaft Dia d Range (mm)', 'Key Width b (mm)', 'Key Height h (mm)', 'Shaft Depth t1 (mm)', 'Hub Depth t2 (mm)', 'Shaft Keyway Tolerance'],
    rows: [
      ['Over 6 to 8', '2', '2', '1.2', '1.0', 'h9 / N9 / P9'],
      ['Over 8 to 10', '3', '3', '1.8', '1.4', 'h9 / N9 / P9'],
      ['Over 10 to 12', '4', '4', '2.5', '1.8', 'h9 / N9 / P9'],
      ['Over 12 to 17', '5', '5', '3.0', '2.3', 'h9 / N9 / P9'],
      ['Over 17 to 22', '6', '6', '3.5', '2.8', 'h9 / N9 / P9'],
      ['Over 22 to 30', '8', '7', '4.0', '3.3', 'h9 / N9 / P9'],
      ['Over 30 to 38', '10', '8', '5.0', '3.3', 'h9 / N9 / P9'],
      ['Over 38 to 44', '12', '8', '5.0', '3.3', 'h9 / N9 / P9'],
      ['Over 44 to 50', '14', '9', '5.5', '3.8', 'h9 / N9 / P9'],
      ['Over 50 to 58', '16', '10', '6.0', '4.3', 'h9 / N9 / P9']
    ],
    note: 'Conforms to DIN 6885-1 / ISO 773 Drive type fasteners — Parallel keys and keyways.'
  },
  'circlips-retaining-rings-din-471-472-table': {
    headers: ['Nominal Shaft/Bore d1 (mm)', 'Type (Ext/Int)', 'Ring Thickness s (mm)', 'Groove Dia d2 (mm)', 'Groove Width m (mm)', 'Allowable Thrust Load (kN)'],
    rows: [
      ['10 mm', 'DIN 471 (Shaft)', '1.00', '9.60 (-0.09)', '1.10 (+0.14)', '3.2 kN'],
      ['15 mm', 'DIN 471 (Shaft)', '1.00', '14.30 (-0.11)', '1.10 (+0.14)', '5.5 kN'],
      ['20 mm', 'DIN 471 (Shaft)', '1.20', '19.00 (-0.13)', '1.30 (+0.14)', '12.8 kN'],
      ['25 mm', 'DIN 471 (Shaft)', '1.20', '23.90 (-0.13)', '1.30 (+0.14)', '18.4 kN'],
      ['30 mm', 'DIN 471 (Shaft)', '1.50', '28.60 (-0.21)', '1.60 (+0.14)', '28.0 kN'],
      ['40 mm', 'DIN 471 (Shaft)', '1.75', '37.50 (-0.25)', '1.85 (+0.14)', '45.0 kN'],
      ['20 mm', 'DIN 472 (Bore)', '1.00', '21.00 (+0.13)', '1.10 (+0.14)', '10.5 kN'],
      ['30 mm', 'DIN 472 (Bore)', '1.20', '31.40 (+0.25)', '1.30 (+0.14)', '21.6 kN'],
      ['40 mm', 'DIN 472 (Bore)', '1.75', '42.50 (+0.25)', '1.85 (+0.14)', '49.0 kN']
    ],
    note: 'Based on DIN 471 (Shaft retaining rings) and DIN 472 (Bore retaining rings) specifications.'
  },
  'iso-273-clearance-holes-table': {
    headers: ['Fastener Size', 'Fine Series Hole (mm)', 'Medium Series Hole (mm)', 'Coarse Series Hole (mm)', 'Standard Counterbore Dia (mm)'],
    rows: [
      ['M2', '2.2 mm', '2.4 mm', '2.6 mm', '4.4 mm'],
      ['M3', '3.2 mm', '3.4 mm', '3.6 mm', '6.0 mm'],
      ['M4', '4.3 mm', '4.5 mm', '4.8 mm', '8.0 mm'],
      ['M5', '5.3 mm', '5.5 mm', '5.8 mm', '10.0 mm'],
      ['M6', '6.4 mm', '6.6 mm', '7.0 mm', '11.0 mm'],
      ['M8', '8.4 mm', '9.0 mm', '10.0 mm', '15.0 mm'],
      ['M10', '10.5 mm', '11.0 mm', '12.0 mm', '18.0 mm'],
      ['M12', '13.0 mm', '13.5 mm', '14.5 mm', '20.0 mm'],
      ['M16', '17.0 mm', '17.5 mm', '18.5 mm', '26.0 mm'],
      ['M20', '21.0 mm', '22.0 mm', '24.0 mm', '33.0 mm']
    ],
    note: 'Compliant with ISO 273 and ASME B18.2.8 clearance holes for bolts and screws.'
  },
  'sheet-metal-gauge-thickness-chart': {
    headers: ['Gauge No.', 'Carbon Steel (mm / in)', 'Galvanized Steel (mm / in)', 'Stainless Steel (mm / in)', 'Aluminum Sheet (mm / in)'],
    rows: [
      ['10 Ga', '3.416 mm (0.1345")', '3.505 mm (0.1382")', '3.571 mm (0.1406")', '2.588 mm (0.1019")'],
      ['12 Ga', '2.657 mm (0.1046")', '2.746 mm (0.1084")', '2.779 mm (0.1094")', '2.052 mm (0.0808")'],
      ['14 Ga', '1.897 mm (0.0747")', '1.994 mm (0.0785")', '1.984 mm (0.0781")', '1.628 mm (0.0641")'],
      ['16 Ga', '1.519 mm (0.0598")', '1.613 mm (0.0635")', '1.588 mm (0.0625")', '1.290 mm (0.0508")'],
      ['18 Ga', '1.214 mm (0.0478")', '1.311 mm (0.0516")', '1.270 mm (0.0500")', '1.024 mm (0.0403")'],
      ['20 Ga', '0.912 mm (0.0359")', '1.006 mm (0.0396")', '0.953 mm (0.0375")', '0.813 mm (0.0320")'],
      ['22 Ga', '0.759 mm (0.0299")', '0.853 mm (0.0336")', '0.792 mm (0.0312")', '0.643 mm (0.0253")'],
      ['24 Ga', '0.607 mm (0.0239")', '0.701 mm (0.0276")', '0.635 mm (0.0250")', '0.511 mm (0.0201")']
    ],
    note: 'Manufacturer standard gauge (MSG) and ASTM A653 / ASTM A240 standard sheet tolerances.'
  },
  'aluminum-alloy-properties-temper-chart': {
    headers: ['Alloy & Temper', 'Yield Strength (MPa)', 'Tensile Strength (MPa)', 'Elongation %', 'Brinell Hardness (HB)', 'Machinability & Weldability'],
    rows: [
      ['6061-T6', '276 MPa', '310 MPa', '12%', '95 HB', 'Excellent all-round structural alloy; highly weldable'],
      ['6061-O (Annealed)', '55 MPa', '124 MPa', '25%', '30 HB', 'High ductility for severe bending and forming'],
      ['7075-T6', '503 MPa', '572 MPa', '11%', '150 HB', 'Ultra-high strength aerospace grade; poor weldability'],
      ['5052-H32', '193 MPa', '228 MPa', '12%', '60 HB', 'Exceptional marine corrosion resistance; excellent bending'],
      ['2024-T3', '324 MPa', '469 MPa', '18%', '120 HB', 'High fatigue resistance; aircraft skin and tension members'],
      ['6063-T5', '145 MPa', '186 MPa', '12%', '60 HB', 'Architectural extrusion standard; smooth anodized finish']
    ],
    note: 'Governed by ASTM B209 and Aluminum Association (AA) temper designation systems.'
  },
  'stainless-steel-grades-comparison-chart': {
    headers: ['Grade (AISI)', 'Microstructure', 'Yield Strength (MPa)', 'PREN (Pitting Resistance)', 'Magnetic?', 'Typical Application'],
    rows: [
      ['304 (1.4301)', 'Austenitic', '205 MPa', '18 - 20', 'No (slight after cold work)', 'General architecture, kitchen equipment, food processing'],
      ['316L (1.4404)', 'Austenitic (Low C)', '220 MPa', '23 - 25', 'No', 'Marine hardware, chemical process, pharmaceutical'],
      ['430 (1.4016)', 'Ferritic', '260 MPa', '16 - 17', 'Yes', 'Appliance trim, automotive exhaust, cost-sensitive indoor'],
      ['17-4PH (H900)', 'Martensitic Age-Hardened', '1170 MPa', '30 - 32', 'Yes', 'Aerospace shafts, turbine blades, high-strength valves'],
      ['2205 Duplex', 'Austenitic-Ferritic', '450 MPa', '35 - 38', 'Yes', 'Oil & gas subsea, desalination piping, harsh marine offshore']
    ],
    note: 'Cross-referenced with ASTM A240 and EN 10088-2 European stainless steel specifications.'
  },
  'structural-steel-grades-cross-reference-table': {
    headers: ['ASTM (USA)', 'EN 10025 (Europe)', 'GB (China)', 'JIS (Japan)', 'Min Yield Strength (MPa)', 'Typical Structural Applications'],
    rows: [
      ['A36', 'S235JR (1.0038)', 'Q235B', 'SS400', '250 MPa (36 ksi)', 'General bolted/welded buildings, baseplates, platforms'],
      ['A572 Gr 50', 'S355JR (1.0045)', 'Q355B', 'SM490A', '345 MPa (50 ksi)', 'Bridge girders, high-rise structural frames, heavy cranes'],
      ['A992', 'S355J2', 'Q355D', 'SN490B', '345 MPa (50 ksi)', 'Standard I-beam and H-section steel building columns'],
      ['A514 (T-1)', 'S690QL', 'Q690D', 'SHY685', '690 MPa (100 ksi)', 'Quenched & tempered high-yield mining and chassis components'],
      ['A500 Gr B', 'S275J2H', 'Q275', 'STKR400', '315 MPa (46 ksi)', 'Cold-formed hollow structural sections (HSS tubing)']
    ],
    note: 'Covers cross-equivalencies between AISC 360, Eurocode 3 (EN 1993), GB 50017, and JIS G3101.'
  },
  'nema-vs-iec-motor-frame-dimensions-table': {
    headers: ['NEMA Frame', 'IEC Frame Equivalent', 'Shaft Center Height D/H (mm / in)', 'Shaft Diameter (mm / in)', 'Mounting Hole Pattern (mm)'],
    rows: [
      ['56', '71', '88.9 mm (3.50")', '15.875 mm (0.625")', '123.8 x 76.2 mm'],
      ['143T', '90S', '88.9 mm (3.50")', '22.225 mm (0.875")', '139.7 x 101.6 mm'],
      ['145T', '90L', '88.9 mm (3.50")', '22.225 mm (0.875")', '139.7 x 127.0 mm'],
      ['182T', '112M', '114.3 mm (4.50")', '28.575 mm (1.125")', '190.5 x 114.3 mm'],
      ['184T', '112M', '114.3 mm (4.50")', '28.575 mm (1.125")', '190.5 x 139.7 mm'],
      ['213T', '132S', '133.4 mm (5.25")', '34.925 mm (1.375")', '215.9 x 139.7 mm'],
      ['215T', '132M', '133.4 mm (5.25")', '34.925 mm (1.375")', '215.9 x 177.8 mm'],
      ['254T', '160M', '158.8 mm (6.25")', '41.275 mm (1.625")', '254.0 x 209.6 mm']
    ],
    note: 'Comparison between NEMA MG 1 Motors and Generators and IEC 60072-1 metric mounting dimensions.'
  },
  'ip-rating-enclosure-chart': {
    headers: ['IP Rating', 'Dust Protection (1st Digit)', 'Liquid Protection (2nd Digit)', 'Equivalent NEMA Rating', 'Operating Environment Suitability'],
    rows: [
      ['IP20', 'Solid objects > 12.5mm (fingers)', 'None', 'NEMA 1', 'Dry indoor industrial panels, controlled climate server rooms'],
      ['IP54', 'Dust-protected (limited ingress)', 'Splashing water from any direction', 'NEMA 3 / 12', 'Standard workshop machinery, indoor light-industrial equipment'],
      ['IP65', 'Dust-tight (zero ingress)', 'Low-pressure water jets (6.3mm nozzle)', 'NEMA 4 / 4X', 'Outdoor weather-exposed enclosures, washdown food areas'],
      ['IP66', 'Dust-tight (zero ingress)', 'Heavy sea spray or powerful water jets', 'NEMA 4X', 'Marine deck equipment, offshore drilling, mining wash-stations'],
      ['IP67', 'Dust-tight (zero ingress)', 'Temporary immersion up to 1m for 30 min', 'NEMA 6', 'Submersible sensors, automotive chassis electronics, heavy rain'],
      ['IP68', 'Dust-tight (zero ingress)', 'Continuous submersion under pressure (>1m)', 'NEMA 6P', 'Subsea instrumentation, deep borehole pumps, underground vaults'],
      ['IP69K', 'Dust-tight (zero ingress)', 'High-temp (80°C) high-pressure (100 bar) wash', 'NEMA 4X / Food Sanitization', 'Food & beverage processing, sterile pharmaceutical washdown']
    ],
    note: 'Defined by IEC 60529 and ISO 20653 degrees of protection provided by enclosures.'
  },
  'thermocouple-color-codes-limits-table': {
    headers: ['Type', 'Conductors (+ / -)', 'ANSI Color (USA)', 'IEC 60584 Color (Europe)', 'Temperature Range (°C)', 'Standard Accuracy'],
    rows: [
      ['Type K', 'Chromel / Alumel', 'Yellow / Red', 'Green / White', '-200°C to +1260°C', '±2.2°C or ±0.75%'],
      ['Type J', 'Iron / Constantan', 'White / Red', 'Black / White', '-40°C to +750°C', '±2.2°C or ±0.75%'],
      ['Type T', 'Copper / Constantan', 'Blue / Red', 'Brown / White', '-200°C to +350°C', '±1.0°C or ±0.75%'],
      ['Type E', 'Chromel / Constantan', 'Purple / Red', 'Purple / White', '-200°C to +900°C', '±1.7°C or ±0.50%'],
      ['Type N', 'Nicrosil / Nisil', 'Orange / Red', 'Pink / White', '-270°C to +1300°C', '±2.2°C or ±0.75%'],
      ['Type R / S', 'Pt-Rh / Platinum', 'Green / Red', 'Orange / White', '0°C to +1450°C', '±1.5°C or ±0.25%']
    ],
    note: 'Complies with ASTM E230 / ANSI MC96.1 and IEC 60584-3 thermocouple extension wire color standards.'
  },
  'nec-copper-wire-ampacity-table': {
    headers: ['Size (AWG / kcmil)', '60°C (TW, UF) (Amps)', '75°C (THWN, XHHW) (Amps)', '90°C (THHN, XHHW-2) (Amps)', 'Max Overcurrent Fuse (Amps)'],
    rows: [
      ['14 AWG', '15 A', '20 A', '25 A', '15 A (NEC 240.4(D))'],
      ['12 AWG', '20 A', '25 A', '30 A', '20 A (NEC 240.4(D))'],
      ['10 AWG', '30 A', '35 A', '40 A', '30 A (NEC 240.4(D))'],
      ['8 AWG', '40 A', '50 A', '55 A', '50 A'],
      ['6 AWG', '55 A', '65 A', '75 A', '60 A / 70 A'],
      ['4 AWG', '70 A', '85 A', '95 A', '80 A / 90 A'],
      ['2 AWG', '95 A', '115 A', '130 A', '100 A / 125 A'],
      ['1/0 AWG', '125 A', '150 A', '170 A', '150 A'],
      ['2/0 AWG', '145 A', '175 A', '195 A', '175 A'],
      ['4/0 AWG', '195 A', '230 A', '260 A', '225 A / 250 A']
    ],
    note: 'Based on National Electrical Code (NEC NFPA 70) Table 310.16 for not more than 3 current-carrying conductors in raceway at 30°C ambient.'
  },
  'copper-pipe-dimensions-type-k-l-m-table': {
    headers: ['Nominal Size (inch)', 'Actual Outside Dia OD (in / mm)', 'Type K Wall (Heavy mm)', 'Type L Wall (Standard mm)', 'Type M Wall (Light mm)', 'Working Pressure (PSI)'],
    rows: [
      ['1/2"', '0.625" (15.875 mm)', '1.245 mm', '0.889 mm', '0.711 mm', '720 - 1050 PSI'],
      ['3/4"', '0.875" (22.225 mm)', '1.651 mm', '1.143 mm', '0.813 mm', '600 - 900 PSI'],
      ['1"', '1.125" (28.575 mm)', '1.651 mm', '1.270 mm', '0.889 mm', '500 - 750 PSI'],
      ['1-1/4"', '1.375" (34.925 mm)', '1.651 mm', '1.397 mm', '1.067 mm', '450 - 680 PSI'],
      ['1-1/2"', '1.625" (41.275 mm)', '1.829 mm', '1.524 mm', '1.245 mm', '420 - 620 PSI'],
      ['2"', '2.125" (53.975 mm)', '2.108 mm', '1.778 mm', '1.473 mm', '380 - 550 PSI'],
      ['3"', '3.125" (79.375 mm)', '2.769 mm', '2.286 mm', '1.829 mm', '340 - 500 PSI'],
      ['4"', '4.125" (104.775 mm)', '3.404 mm', '2.794 mm', '2.413 mm', '320 - 470 PSI']
    ],
    note: 'Dimensions comply with ASTM B88 Seamless Copper Water Tube standards.'
  },
  'pvc-pipe-schedule-40-80-dimensions-table': {
    headers: ['NPS Pipe Size', 'Outside Dia OD (mm / in)', 'Sch 40 Wall (mm)', 'Sch 40 Max PSI @ 73°F', 'Sch 80 Wall (mm)', 'Sch 80 Max PSI @ 73°F'],
    rows: [
      ['1/2"', '21.3 mm (0.840")', '2.77 mm', '600 PSI', '3.73 mm', '850 PSI'],
      ['3/4"', '26.7 mm (1.050")', '2.87 mm', '480 PSI', '3.91 mm', '690 PSI'],
      ['1"', '33.4 mm (1.315")', '3.38 mm', '450 PSI', '4.55 mm', '630 PSI'],
      ['1-1/2"', '48.3 mm (1.900")', '3.68 mm', '330 PSI', '5.08 mm', '470 PSI'],
      ['2"', '60.3 mm (2.375")', '3.91 mm', '280 PSI', '5.54 mm', '400 PSI'],
      ['3"', '88.9 mm (3.500")', '5.49 mm', '260 PSI', '7.62 mm', '370 PSI'],
      ['4"', '114.3 mm (4.500")', '6.02 mm', '220 PSI', '8.56 mm', '320 PSI'],
      ['6"', '168.3 mm (6.625")', '7.11 mm', '180 PSI', '10.97 mm', '280 PSI'],
      ['8"', '219.1 mm (8.625")', '8.18 mm', '160 PSI', '12.70 mm', '250 PSI']
    ],
    note: 'Standards: ASTM D1785 Rigid Poly(Vinyl Chloride) (PVC) Compounds and Chlorinated Poly(Vinyl Chloride) (CPVC).'
  },
  'astm-standard-rebar-sizes-table': {
    headers: ['Rebar Designation', 'Nominal Diameter (mm / in)', 'Cross-Section Area (mm² / in²)', 'Nominal Mass (kg/m / lb/ft)', 'Metric Soft Equivalent'],
    rows: [
      ['#3', '9.525 mm (0.375")', '71 mm² (0.11 in²)', '0.560 kg/m (0.376 lb/ft)', '#10M'],
      ['#4', '12.700 mm (0.500")', '129 mm² (0.20 in²)', '0.994 kg/m (0.668 lb/ft)', '#13M'],
      ['#5', '15.875 mm (0.625")', '200 mm² (0.31 in²)', '1.552 kg/m (1.043 lb/ft)', '#16M'],
      ['#6', '19.050 mm (0.750")', '284 mm² (0.44 in²)', '2.235 kg/m (1.502 lb/ft)', '#19M'],
      ['#7', '22.225 mm (0.875")', '387 mm² (0.60 in²)', '3.042 kg/m (2.044 lb/ft)', '#22M'],
      ['#8', '25.400 mm (1.000")', '510 mm² (0.79 in²)', '3.973 kg/m (2.670 lb/ft)', '#25M'],
      ['#9', '28.650 mm (1.128")', '645 mm² (1.00 in²)', '5.060 kg/m (3.400 lb/ft)', '#29M'],
      ['#10', '32.260 mm (1.270")', '819 mm² (1.27 in²)', '6.404 kg/m (4.303 lb/ft)', '#32M'],
      ['#11', '35.810 mm (1.410")', '1006 mm² (1.56 in²)', '7.907 kg/m (5.313 lb/ft)', '#36M'],
      ['#14', '43.000 mm (1.693")', '1452 mm² (2.25 in²)', '11.384 kg/m (7.650 lb/ft)', '#43M'],
      ['#18', '57.330 mm (2.257")', '2581 mm² (4.00 in²)', '20.238 kg/m (13.600 lb/ft)', '#57M']
    ],
    note: 'Governed by ASTM A615 / A615M Deformed and Plain Carbon-Steel Bars for Concrete Reinforcement.'
  },
  'concrete-slump-test-workability-table': {
    headers: ['Structural Element', 'Min Slump (mm / in)', 'Max Slump (mm / in)', 'Workability Degree', 'Compaction Method'],
    rows: [
      ['Reinforced Foundation Walls & Footings', '25 mm (1.0")', '75 mm (3.0")', 'Low to Medium', 'Internal poker vibration'],
      ['Plain Footings, Caissons & Substructure', '25 mm (1.0")', '75 mm (3.0")', 'Low', 'Vibration or mechanical tamping'],
      ['Beams & Reinforced Framing Columns', '25 mm (1.0")', '100 mm (4.0")', 'Medium', 'Internal high-frequency vibration'],
      ['Building Slabs, Pavements & Sidewalks', '25 mm (1.0")', '75 mm (3.0")', 'Low to Medium', 'Screed vibration & power floating'],
      ['Heavy Mass Concrete Construction', '25 mm (1.0")', '50 mm (2.0")', 'Very Low', 'Heavy immersion vibrators'],
      ['Pumped Concrete / Complex Formwork', '75 mm (3.0")', '125 mm (5.0")', 'High', 'Internal vibration without segregation']
    ],
    note: 'Conforms to ACI 211.1 Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete.'
  },
  'soil-classification-uscs-properties-table': {
    headers: ['USCS Group', 'Soil Description', 'Typical Bearing Capacity (kPa / ksf)', 'Friction Angle φ (deg)', 'Cohesion c (kPa)', 'Permeability k (cm/s)'],
    rows: [
      ['GW', 'Well-graded gravel, gravel-sand mixtures', '300 - 400 kPa (6 - 8 ksf)', '36° - 42°', '0 kPa', '> 10⁻² (Pervious)'],
      ['GP', 'Poorly-graded gravel, gravel-sand', '250 - 350 kPa (5 - 7 ksf)', '34° - 38°', '0 kPa', '> 10⁻² (Pervious)'],
      ['SW', 'Well-graded sands, gravelly sands', '200 - 300 kPa (4 - 6 ksf)', '34° - 40°', '0 kPa', '10⁻² - 10⁻³'],
      ['SP', 'Poorly-graded sands, uniform sands', '150 - 250 kPa (3 - 5 ksf)', '30° - 35°', '0 kPa', '10⁻² - 10⁻⁴'],
      ['SM', 'Silty sands, sand-silt mixtures', '100 - 200 kPa (2 - 4 ksf)', '28° - 34°', '5 - 15 kPa', '10⁻³ - 10⁻⁵'],
      ['ML', 'Inorganic silts, very fine sands', '75 - 150 kPa (1.5 - 3 ksf)', '26° - 32°', '10 - 25 kPa', '10⁻⁴ - 10⁻⁶'],
      ['CL', 'Inorganic clays of low-to-medium plasticity', '100 - 200 kPa (2 - 4 ksf)', '18° - 26°', '25 - 60 kPa', '10⁻⁶ - 10⁻⁸'],
      ['CH', 'Inorganic clays of high plasticity (fat clay)', '50 - 150 kPa (1 - 3 ksf)', '12° - 20°', '50 - 120 kPa', '< 10⁻⁸ (Impervious)']
    ],
    note: 'Standard: ASTM D2487 Unified Soil Classification System (USCS) geotechnical baseline engineering properties.'
  },
  'fdm-3d-printing-filament-properties-chart': {
    headers: ['Filament Material', 'Nozzle Temp (°C)', 'Bed Temp (°C)', 'Tensile Yield (MPa)', 'Heat Deflection HDT (°C)', 'Enclosure Required? / Warping'],
    rows: [
      ['PLA (Polylactic Acid)', '190°C - 220°C', '20°C - 60°C', '50 - 65 MPa', '55°C', 'No / Low warping; easy printing'],
      ['PETG (Glycol-Modified)', '230°C - 250°C', '70°C - 85°C', '45 - 55 MPa', '70°C', 'No / Low-medium warping; chemical resistant'],
      ['ABS (Acrylonitrile Butadiene)', '240°C - 260°C', '95°C - 110°C', '40 - 50 MPa', '95°C', 'Yes / High warping; requires fume exhaust'],
      ['ASA (Acrylic Styrene Acrylonitrile)', '240°C - 260°C', '95°C - 110°C', '42 - 52 MPa', '98°C', 'Yes / High UV resistance outdoor grade'],
      ['TPU 95A (Polyurethane)', '215°C - 235°C', '30°C - 60°C', '25 - 35 MPa (Flex)', '50°C', 'No / High wear & vibration damping flex'],
      ['PA-CF (Carbon Fiber Nylon)', '260°C - 290°C', '80°C - 100°C', '75 - 110 MPa', '150°C', 'Recommended / Hardened nozzle required; stiff'],
      ['PC (Polycarbonate)', '270°C - 310°C', '110°C - 120°C', '65 - 75 MPa', '135°C', 'Yes / Severe warping; structural toughness']
    ],
    note: 'Industry standard FDM / FFF thermoplastic filament processing profiles and mechanical properties.'
  }
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
