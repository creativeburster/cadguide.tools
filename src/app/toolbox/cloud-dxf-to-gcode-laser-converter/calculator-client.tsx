'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  ShieldAlert,
  Download,
  RotateCcw,
  Upload,
  ExternalLink,
  Info,
  Code2,
} from 'lucide-react';

type UnitsCode = 'G21' | 'G20';
type LaserEnableCode = 'M3' | 'M4';

interface DxfPreset {
  id: string;
  label: string;
  units: UnitsCode;
  laserMode: LaserEnableCode;
  feedRate: string;
  laserPower: string;
  dxfContent: string;
}

const SAMPLE_DXF_PLATE_HOLE = [
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'CIRCLE', '8', '0', '10', '50', '20', '30', '40', '10',
  '0', 'LINE', '8', '0', '10', '0', '20', '0', '11', '100', '21', '0',
  '0', 'LINE', '8', '0', '10', '100', '20', '0', '11', '100', '21', '60',
  '0', 'LINE', '8', '0', '10', '100', '20', '60', '11', '0', '21', '60',
  '0', 'LINE', '8', '0', '10', '0', '20', '60', '11', '0', '21', '0',
  '0', 'ENDSEC', '0', 'EOF',
].join('\n');

const SAMPLE_DXF_FILLET_BRACKET = [
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LINE', '8', '0', '10', '0', '20', '0', '11', '80', '21', '0',
  '0', 'LINE', '8', '0', '10', '80', '20', '0', '11', '80', '21', '50',
  '0', 'ARC', '8', '0', '10', '65', '20', '50', '40', '15', '50', '0', '51', '90',
  '0', 'LINE', '8', '0', '10', '65', '20', '65', '11', '0', '21', '65',
  '0', 'LINE', '8', '0', '10', '0', '20', '65', '11', '0', '21', '0',
  '0', 'ENDSEC', '0', 'EOF',
].join('\n');

const SAMPLE_DXF_LWPOLYLINE = [
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LWPOLYLINE', '8', '0', '90', '4', '70', '1',
  '10', '0', '20', '0',
  '10', '60', '20', '0',
  '10', '60', '20', '40',
  '10', '0', '20', '40',
  '0', 'ENDSEC', '0', 'EOF',
].join('\n');

const PRESETS: DxfPreset[] = [
  {
    id: 'plate-center-hole',
    label: 'Preset 1: 100×60 mm Plate + Ø20 mm Hole (LINE + CIRCLE, G2)',
    units: 'G21',
    laserMode: 'M3',
    feedRate: '1200',
    laserPower: '1000',
    dxfContent: SAMPLE_DXF_PLATE_HOLE,
  },
  {
    id: 'fillet-bracket-arc',
    label: 'Preset 2: 80×65 mm Fillet Bracket (LINE + CCW ARC, G3 / M4)',
    units: 'G21',
    laserMode: 'M4',
    feedRate: '1500',
    laserPower: '800',
    dxfContent: SAMPLE_DXF_FILLET_BRACKET,
  },
  {
    id: 'closed-lwpolyline',
    label: 'Preset 3: 60×40 mm Closed LWPOLYLINE Tag',
    units: 'G21',
    laserMode: 'M3',
    feedRate: '1000',
    laserPower: '600',
    dxfContent: SAMPLE_DXF_LWPOLYLINE,
  },
];

const GCODE_REFERENCE = [
  {
    code: 'G20 / G21',
    meaning: 'Units: G20 uses inches for length units; G21 uses millimeters for length units (LinuxCNC Sec. 19).',
  },
  {
    code: 'G90 / G17 / G94',
    meaning: 'G90 absolute distance mode; G17 XY-plane selection; G94 units-per-minute feed rate mode (LinuxCNC Sec. 54, 59).',
  },
  {
    code: 'G0',
    meaning: 'Rapid Move: linear axis traverse at rapid rate; in GRBL v1.1 Laser Mode, G0 always disables the laser.',
  },
  {
    code: 'G1',
    meaning: 'Linear Move: straight-line coordinated motion at the programmed F feed rate (LinuxCNC Sec. 4).',
  },
  {
    code: 'G2 / G3',
    meaning: 'Arc Move: G2 clockwise circular arc, G3 counterclockwise circular arc in XY plane using I, J center offsets from start point (LinuxCNC Sec. 5).',
  },
  {
    code: 'M3 / M4 / M5 / M2',
    meaning: 'Spindle / Laser Control: M3 starts spindle CW (GRBL Constant Laser Power); M4 starts CCW (GRBL Dynamic Laser Power); M5 stops spindle/laser; M2 ends program.',
  },
];

const OFFICIAL_DOCS = [
  {
    name: 'LinuxCNC Official Documentation — G-Codes (G0, G1, G2, G3, G17, G20/G21, G90, G94)',
    url: 'https://linuxcnc.org/docs/html/gcode/g-code.html',
    desc: 'Defines G0 Rapid Move, G1 Linear Move, G2/G3 Arc Move (clockwise/counterclockwise with I/J center offsets), G20/G21 Units, and G90 Distance Mode.',
  },
  {
    name: 'LinuxCNC Official Documentation — M-Codes (M2, M3, M4, M5)',
    url: 'https://linuxcnc.org/docs/html/gcode/m-code.html',
    desc: 'Defines M3/M4/M5 Spindle Control (start clockwise/counterclockwise at S speed, stop selected spindle) and M2 Program End.',
  },
  {
    name: 'GRBL v1.1 Official Wiki — Laser Mode & Supported G-Codes',
    url: 'https://github.com/gnea/grbl/wiki/Grbl-v1.1-Laser-Mode',
    desc: 'Documents M3 Constant Laser Power Mode, M4 Dynamic Laser Power Mode, M5 laser off, and automatic laser disable during G0 rapid moves.',
  },
  {
    name: 'Autodesk AutoCAD 2025 DXF Reference — LINE, CIRCLE, ARC Group Codes',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-DXF/files/GUID-FCEF5726-53AE-4C43-B4EA-C84EB8686A66.htm',
    desc: 'Specifies DXF ENTITIES group codes: 10/20 start or center point, 11/21 endpoint, 40 radius, and 50/51 start and end angles.',
  },
];

function parseStrictNum(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function toSafeAscii(input: string): string {
  return input.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

interface MoveSegment {
  kind: 'line' | 'arc-cw' | 'arc-ccw';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  i?: number;
  j?: number;
  length: number;
}

function parseAsciiDxfEntities(dxfText: string): {
  valid: boolean;
  error?: string;
  entityCount: number;
  unsupportedEntities: string[];
  segments: MoveSegment[];
} {
  if (dxfText.includes('\0') || dxfText.startsWith('AutoCAD Binary DXF')) {
    return {
      valid: false,
      error: 'Binary DXF files are not supported in browser parser. Save as ASCII DXF in your desktop CAD software.',
      entityCount: 0,
      unsupportedEntities: [],
      segments: [],
    };
  }

  const rawLines = dxfText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const pairs: Array<{ code: number; val: string }> = [];
  for (let idx = 0; idx + 1 < rawLines.length; idx += 2) {
    const c = parseStrictNum(rawLines[idx]);
    if (!Number.isInteger(c)) {
      continue;
    }
    pairs.push({ code: c, val: rawLines[idx + 1].trim() });
  }

  const hasSection = pairs.some((p) => p.code === 0 && p.val.toUpperCase() === 'SECTION');
  let inEntities = !hasSection;
  let awaitingSectionName = false;

  const segments: MoveSegment[] = [];
  const unsupportedSet = new Set<string>();
  let entityCount = 0;

  let curType = '';
  let curPairs: Array<{ code: number; val: string }> = [];

  const flushEntity = () => {
    if (!curType) return;
    const t = curType.toUpperCase();
    if (t === 'LINE') {
      let x1 = NaN, y1 = NaN, x2 = NaN, y2 = NaN;
      for (const p of curPairs) {
        if (p.code === 10) x1 = parseStrictNum(p.val);
        else if (p.code === 20) y1 = parseStrictNum(p.val);
        else if (p.code === 11) x2 = parseStrictNum(p.val);
        else if (p.code === 21) y2 = parseStrictNum(p.val);
      }
      if (Number.isFinite(x1) && Number.isFinite(y1) && Number.isFinite(x2) && Number.isFinite(y2)) {
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (len > 1e-9) {
          entityCount += 1;
          segments.push({ kind: 'line', x1, y1, x2, y2, length: len });
        }
      }
    } else if (t === 'CIRCLE') {
      let cx = NaN, cy = NaN, r = NaN;
      for (const p of curPairs) {
        if (p.code === 10) cx = parseStrictNum(p.val);
        else if (p.code === 20) cy = parseStrictNum(p.val);
        else if (p.code === 40) r = parseStrictNum(p.val);
      }
      if (Number.isFinite(cx) && Number.isFinite(cy) && Number.isFinite(r) && r > 0) {
        entityCount += 1;
        // Split full circle into two 180-deg CW G2 semicircles for controller compatibility
        segments.push({
          kind: 'arc-cw',
          x1: cx + r,
          y1: cy,
          x2: cx - r,
          y2: cy,
          i: -r,
          j: 0,
          length: Math.PI * r,
        });
        segments.push({
          kind: 'arc-cw',
          x1: cx - r,
          y1: cy,
          x2: cx + r,
          y2: cy,
          i: r,
          j: 0,
          length: Math.PI * r,
        });
      }
    } else if (t === 'ARC') {
      let cx = NaN, cy = NaN, r = NaN, a1 = NaN, a2 = NaN;
      for (const p of curPairs) {
        if (p.code === 10) cx = parseStrictNum(p.val);
        else if (p.code === 20) cy = parseStrictNum(p.val);
        else if (p.code === 40) r = parseStrictNum(p.val);
        else if (p.code === 50) a1 = parseStrictNum(p.val);
        else if (p.code === 51) a2 = parseStrictNum(p.val);
      }
      if (
        Number.isFinite(cx) &&
        Number.isFinite(cy) &&
        Number.isFinite(r) &&
        r > 0 &&
        Number.isFinite(a1) &&
        Number.isFinite(a2)
      ) {
        entityCount += 1;
        let sweepDeg = (a2 - a1) % 360;
        if (sweepDeg <= 0) sweepDeg += 360;
        const emitArcSpan = (degStart: number, degEnd: number, spanDeg: number) => {
          const rad1 = (degStart * Math.PI) / 180;
          const rad2 = (degEnd * Math.PI) / 180;
          const x1 = cx + r * Math.cos(rad1);
          const y1 = cy + r * Math.sin(rad1);
          const x2 = cx + r * Math.cos(rad2);
          const y2 = cy + r * Math.sin(rad2);
          segments.push({
            kind: 'arc-ccw',
            x1,
            y1,
            x2,
            y2,
            i: cx - x1,
            j: cy - y1,
            length: r * ((spanDeg * Math.PI) / 180),
          });
        };
        if (sweepDeg <= 180) {
          emitArcSpan(a1, a1 + sweepDeg, sweepDeg);
        } else {
          const half = sweepDeg / 2;
          emitArcSpan(a1, a1 + half, half);
          emitArcSpan(a1 + half, a1 + sweepDeg, half);
        }
      }
    } else if (t === 'LWPOLYLINE') {
      let flags = 0;
      const verts: Array<{ x: number; y: number; bulge: number }> = [];
      let pendingX: number | null = null;
      for (const p of curPairs) {
        if (p.code === 70) {
          const fv = parseStrictNum(p.val);
          if (Number.isInteger(fv)) flags = fv;
        } else if (p.code === 10) {
          pendingX = parseStrictNum(p.val);
        } else if (p.code === 20 && pendingX !== null) {
          const py = parseStrictNum(p.val);
          if (Number.isFinite(pendingX) && Number.isFinite(py)) {
            verts.push({ x: pendingX, y: py, bulge: 0 });
          }
          pendingX = null;
        } else if (p.code === 42 && verts.length > 0) {
          const b = parseStrictNum(p.val);
          if (Number.isFinite(b) && Math.abs(b) > 1e-9) {
            unsupportedSet.add('LWPOLYLINE bulge');
          }
        }
      }
      if (verts.length >= 2) {
        entityCount += 1;
        const closed = (flags & 1) === 1;
        const count = closed ? verts.length : verts.length - 1;
        for (let k = 0; k < count; k++) {
          const v1 = verts[k];
          const v2 = verts[(k + 1) % verts.length];
          const len = Math.hypot(v2.x - v1.x, v2.y - v1.y);
          if (len > 1e-9) {
            segments.push({ kind: 'line', x1: v1.x, y1: v1.y, x2: v2.x, y2: v2.y, length: len });
          }
        }
      }
    } else if (t !== 'SECTION' && t !== 'ENDSEC' && t !== 'EOF') {
      unsupportedSet.add(t);
    }
    curType = '';
    curPairs = [];
  };

  for (const p of pairs) {
    if (p.code === 0) {
      flushEntity();
      const upper = p.val.toUpperCase();
      if (upper === 'SECTION') {
        awaitingSectionName = true;
      } else if (upper === 'ENDSEC') {
        inEntities = false;
        awaitingSectionName = false;
      } else if (upper === 'EOF') {
        break;
      } else if (inEntities) {
        curType = upper;
      }
    } else if (awaitingSectionName && p.code === 2) {
      inEntities = p.val.toUpperCase() === 'ENTITIES';
      awaitingSectionName = false;
    } else if (inEntities && curType) {
      curPairs.push(p);
    }
  }
  flushEntity();

  if (segments.length === 0) {
    return {
      valid: false,
      error:
        'No supported 2D entities (LINE, CIRCLE, ARC, or straight-segment LWPOLYLINE) found in ENTITIES section.',
      entityCount: 0,
      unsupportedEntities: Array.from(unsupportedSet),
      segments: [],
    };
  }

  return {
    valid: true,
    entityCount,
    unsupportedEntities: Array.from(unsupportedSet),
    segments,
  };
}

export default function CloudDxfToGcodeLaserConverterClient() {
  const [units, setUnits] = useState<UnitsCode>('G21');
  const [laserMode, setLaserMode] = useState<LaserEnableCode>('M3');
  const [feedRateStr, setFeedRateStr] = useState('1200');
  const [laserPowerStr, setLaserPowerStr] = useState('1000');
  const [dxfText, setDxfText] = useState(SAMPLE_DXF_PLATE_HOLE);

  const applyPreset = (p: DxfPreset) => {
    setUnits(p.units);
    setLaserMode(p.laserMode);
    setFeedRateStr(p.feedRate);
    setLaserPowerStr(p.laserPower);
    setDxfText(p.dxfContent);
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setDxfText(text);
  };

  const compilation = useMemo(() => {
    const feed = parseStrictNum(feedRateStr);
    const power = parseStrictNum(laserPowerStr);

    if (!Number.isFinite(feed) || !Number.isFinite(power)) {
      return {
        valid: false as const,
        error: 'Enter valid finite numbers for Cutting Feed Rate F and Laser Power S.',
      };
    }

    if (feed <= 0 || feed > 100000) {
      return {
        valid: false as const,
        error: 'Cutting Feed Rate F must be greater than 0 and at most 100,000.',
      };
    }

    if (power < 0 || power > 100000) {
      return {
        valid: false as const,
        error: 'Laser / Spindle S value must be between 0 and 100,000.',
      };
    }

    const parsed = parseAsciiDxfEntities(dxfText);
    if (!parsed.valid) {
      return {
        valid: false as const,
        error: parsed.error || 'Unable to parse ASCII DXF entities.',
      };
    }

    const unitLabel = units === 'G21' ? 'mm' : 'in';
    const feedUnitLabel = units === 'G21' ? 'mm/min' : 'in/min';

    const lines: string[] = [
      `; Pure-ASCII 2D Contour G-Code generated locally in browser`,
      `; Mandatory Safety Check: NO kerf offset (G41/G42), NO lead-in, NO collision detection.`,
      `; Verify in CAM/backplotter and run an unpowered air-cut dry run before enabling laser!`,
      `${units} ; ${units === 'G21' ? 'Millimeters (LinuxCNC G21)' : 'Inches (LinuxCNC G20)'}`,
      `G90 ; Absolute distance mode`,
      `G17 ; XY plane selection`,
      `G94 ; Units per minute feed rate mode`,
      `M5 ; Ensure spindle/laser is stopped before initial rapid move`,
    ];

    let curX = NaN;
    let curY = NaN;
    let laserActive = false;
    let totalCutLength = 0;

    for (const seg of parsed.segments) {
      totalCutLength += seg.length;
      const connected =
        Number.isFinite(curX) &&
        Number.isFinite(curY) &&
        Math.hypot(seg.x1 - curX, seg.y1 - curY) < 1e-4;

      if (!connected) {
        if (laserActive) {
          lines.push('M5');
          laserActive = false;
        }
        lines.push(`G0 X${seg.x1.toFixed(3)} Y${seg.y1.toFixed(3)}`);
      }

      if (!laserActive) {
        lines.push(`${laserMode} S${power}`);
        laserActive = true;
      }

      if (seg.kind === 'line') {
        lines.push(`G1 X${seg.x2.toFixed(3)} Y${seg.y2.toFixed(3)} F${feed}`);
      } else if (seg.kind === 'arc-cw') {
        lines.push(
          `G2 X${seg.x2.toFixed(3)} Y${seg.y2.toFixed(3)} I${(seg.i ?? 0).toFixed(3)} J${(seg.j ?? 0).toFixed(3)} F${feed}`
        );
      } else {
        lines.push(
          `G3 X${seg.x2.toFixed(3)} Y${seg.y2.toFixed(3)} I${(seg.i ?? 0).toFixed(3)} J${(seg.j ?? 0).toFixed(3)} F${feed}`
        );
      }

      curX = seg.x2;
      curY = seg.y2;
    }

    if (laserActive) {
      lines.push('M5');
    }
    lines.push('G0 X0.000 Y0.000');
    lines.push('M2 ; Program end');

    // Exact cutting motion time (excluding G0 rapid moves and controller acceleration ramps):
    // t_cut [s] = (L_cut [mm or in] / F [mm/min or in/min]) * 60 [s/min]
    const cutTimeSec = (totalCutLength / feed) * 60;
    const gcodeContent = toSafeAscii(lines.join('\r\n') + '\r\n');

    return {
      valid: true as const,
      entityCount: parsed.entityCount,
      unsupportedEntities: parsed.unsupportedEntities,
      totalCutLength,
      cutTimeSec,
      unitLabel,
      feedUnitLabel,
      gcodeContent,
    };
  }, [units, laserMode, feedRateStr, laserPowerStr, dxfText]);

  const downloadGcode = () => {
    if (!compilation.valid) return;
    const blob = new Blob([compilation.gcodeContent], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dxf-laser-contour.nc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Mandatory CAM Review & Dry-Run Safety Warning + Scope Disclosure */}
      <div
        data-testid="cam-safety-warning"
        className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm text-rose-950">
          <h2 className="font-black text-base">
            Mandatory CAM Verification &amp; Dry-Run Warning — Honest Capability Scope
          </h2>
          <p className="leading-relaxed font-medium text-rose-900">
            This browser utility translates 2D ASCII DXF <code>ENTITIES</code> (<code>LINE</code>,{' '}
            <code>CIRCLE</code>, <code>ARC</code>, and straight-segment <code>LWPOLYLINE</code>) directly into
            uncompensated 2D <code>G0</code> / <code>G1</code> / <code>G2</code> / <code>G3</code> coordinates.{' '}
            <strong>
              You must inspect the generated program in dedicated CAM software and run an unpowered dry run (air cut
              with laser disabled) on your machine before cutting.
            </strong>
          </p>
          <p className="text-xs font-semibold text-rose-800 leading-relaxed">
            <strong>What this tool does NOT do:</strong> It does not compute laser kerf / cutter radius compensation (
            <code>G41</code> / <code>G42</code>), pierce delays, lead-ins/lead-outs, holding tabs, part nesting,
            inside-before-outside sorting, binary DXF decoding, or <code>SPLINE</code> / <code>ELLIPSE</code> fitting.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Sample ASCII DXF Contour Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyPreset(p)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Laser Parameters</h2>
            </div>
            <button
              type="button"
              data-testid="reset-button"
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dxf-units" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Units Preamble
              </label>
              <select
                id="dxf-units"
                data-testid="select-units"
                value={units}
                onChange={(e) => setUnits(e.target.value as UnitsCode)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 cursor-pointer"
              >
                <option value="G21">G21 (mm)</option>
                <option value="G20">G20 (inches)</option>
              </select>
            </div>
            <div>
              <label htmlFor="dxf-laser-mode" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                Laser Enable
              </label>
              <select
                id="dxf-laser-mode"
                data-testid="select-laser-mode"
                value={laserMode}
                onChange={(e) => setLaserMode(e.target.value as LaserEnableCode)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 cursor-pointer"
              >
                <option value="M3">M3 (Constant CW)</option>
                <option value="M4">M4 (GRBL Dynamic)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dxf-feed" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Cutting Feed Rate F ({units === 'G21' ? 'mm/min' : 'in/min'})
            </label>
            <input
              id="dxf-feed"
              data-testid="input-feed-rate"
              type="text"
              inputMode="decimal"
              value={feedRateStr}
              onChange={(e) => setFeedRateStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="dxf-power" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Spindle / Laser S Word
            </label>
            <input
              id="dxf-power"
              data-testid="input-laser-power"
              type="text"
              inputMode="decimal"
              value={laserPowerStr}
              onChange={(e) => setLaserPowerStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Match your controller PWM range (e.g., GRBL <code>$30</code> max spindle speed, commonly 1000).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="dxf-source" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                ASCII DXF Source (Local Only)
              </label>
              <label className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Load .DXF</span>
                <input type="file" accept=".dxf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              id="dxf-source"
              data-testid="input-dxf-text"
              rows={8}
              value={dxfText}
              onChange={(e) => setDxfText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white"
            />
          </div>
        </div>

        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Compiled Pure-ASCII G-Code &amp; Path Metrics
              </h2>
              <button
                type="button"
                data-testid="download-gcode-button"
                disabled={!compilation.valid}
                onClick={downloadGcode}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download .NC G-Code
              </button>
            </div>

            {!compilation.valid && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{compilation.error}</span>
              </div>
            )}

            {compilation.valid && compilation.unsupportedEntities.length > 0 && (
              <div
                data-testid="unsupported-entities-warning"
                className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900"
              >
                Skipped unsupported entity types ({compilation.unsupportedEntities.join(', ')}). Explode or convert
                splines/blocks to LINE and ARC in desktop CAD before exporting DXF.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Parsed Entities</div>
                <div className="text-2xl font-black text-slate-900" data-testid="result-entity-count">
                  {compilation.valid ? String(compilation.entityCount) : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Cut Path Length</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-cut-length">
                    {compilation.valid ? compilation.totalCutLength.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-slate-500">{units === 'G21' ? 'mm' : 'in'}</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">
                  Pure Cutting Time
                </div>
                <div className="text-2xl font-black text-blue-950">
                  <span data-testid="result-cut-time">
                    {compilation.valid ? compilation.cutTimeSec.toFixed(2) : '—'}
                  </span>{' '}
                  <span className="text-sm font-bold text-blue-500">s</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-0.5">t = (L_cut / F) × 60 (excludes G0 &amp; accel)</div>
              </div>
            </div>

            {compilation.valid && (
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Generated G-Code Preview (dxf-laser-contour.nc)
                </div>
                <pre
                  data-testid="preview-gcode"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs font-mono max-h-72 overflow-auto leading-relaxed"
                >
                  {compilation.gcodeContent}
                </pre>
              </div>
            )}
          </div>

          {/* LinuxCNC & GRBL Code Reference */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Official LinuxCNC &amp; GRBL v1.1 G/M-Code Definitions
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {GCODE_REFERENCE.map((item) => (
                <div key={item.code} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <code className="font-black text-blue-700 w-36 shrink-0">{item.code}</code>
                  <span className="text-slate-600 font-medium leading-relaxed">{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Docs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              Verified Official Documentation Sources
            </div>
            <div className="space-y-3">
              {OFFICIAL_DOCS.map((doc) => (
                <a
                  key={doc.url}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 font-black text-sm text-slate-900">
                    <span>{doc.name}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{doc.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
