'use client';

import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, HelpCircle, Layers, RotateCcw } from 'lucide-react';
import { RelatedTools } from '@/components/related-tools';

type DistanceMetric = 'cie76' | 'euclidean';

interface AciColor {
  index: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  name: string;
}

// Exact AutoCAD 2020 default dark modelspace ACI palette (indices 1..255)
// Source: ezdxf colors.py DXF_DEFAULT_COLORS (cross-verified with netDxf AciColor.cs)
const ACI_HEX_1_TO_255 = [
  'FF0000', 'FFFF00', '00FF00', '00FFFF', '0000FF', 'FF00FF', 'FFFFFF', '808080', 'C0C0C0', 'FF0000',
  'FF7F7F', 'A50000', 'A55252', '7F0000', '7F3F3F', '4C0000', '4C2626', '260000', '261313', 'FF3F00',
  'FF9F7F', 'A52900', 'A56752', '7F1F00', '7F4F3F', '4C1300', '4C2F26', '260900', '261713', 'FF7F00',
  'FFBF7F', 'A55200', 'A57C52', '7F3F00', '7F5F3F', '4C2600', '4C3926', '261300', '261C13', 'FFBF00',
  'FFDF7F', 'A57C00', 'A59152', '7F5F00', '7F6F3F', '4C3900', '4C4226', '261C00', '262113', 'FFFF00',
  'FFFF7F', 'A5A500', 'A5A552', '7F7F00', '7F7F3F', '4C4C00', '4C4C26', '262600', '262613', 'BFFF00',
  'DFFF7F', '7CA500', '91A552', '5F7F00', '6F7F3F', '394C00', '424C26', '1C2600', '212613', '7FFF00',
  'BFFF7F', '52A500', '7CA552', '3F7F00', '5F7F3F', '264C00', '394C26', '132600', '1C2613', '3FFF00',
  '9FFF7F', '29A500', '67A552', '1F7F00', '4F7F3F', '134C00', '2F4C26', '092600', '172613', '00FF00',
  '7FFF7F', '00A500', '52A552', '007F00', '3F7F3F', '004C00', '264C26', '002600', '132613', '00FF3F',
  '7FFF9F', '00A529', '52A567', '007F1F', '3F7F4F', '004C13', '264C2F', '002609', '135817', '00FF7F',
  '7FFFBF', '00A552', '52A57C', '007F3F', '3F7F5F', '004C26', '264C39', '002613', '13581C', '00FFBF',
  '7FFFDF', '00A57C', '52A591', '007F5F', '3F7F6F', '004C39', '264C42', '00261C', '135858', '00FFFF',
  '7FFFFF', '00A5A5', '52A5A5', '007F7F', '3F7F7F', '004C4C', '264C4C', '002626', '135858', '00BFFF',
  '7FDFFF', '007CA5', '5291A5', '005F7F', '3F6F7F', '00394C', '26427E', '001C26', '135858', '007FFF',
  '7FBFFF', '0052A5', '527CA5', '003F7F', '3F5F7F', '00264C', '26397E', '001326', '131C58', '003FFF',
  '7F9FFF', '0029A5', '5267A5', '001F7F', '3F4F7F', '00134C', '262F7E', '000926', '131758', '0000FF',
  '7F7FFF', '0000A5', '5252A5', '00007F', '3F3F7F', '00004C', '26267E', '000026', '131358', '3F00FF',
  '9F7FFF', '2900A5', '6752A5', '1F007F', '4F3F7F', '13004C', '2F267E', '090026', '171358', '7F00FF',
  'BF7FFF', '5200A5', '7C52A5', '3F007F', '5F3F7F', '26004C', '39267E', '130026', '1C1358', 'BF00FF',
  'DF7FFF', '7C00A5', '9152A5', '5F007F', '6F3F7F', '39004C', '42264C', '1C0026', '581358', 'FF00FF',
  'FF7FFF', 'A500A5', 'A552A5', '7F007F', '7F3F7F', '4C004C', '4C264C', '260026', '581358', 'FF00BF',
  'FF7FDF', 'A5007C', 'A55291', '7F005F', '7F3F6F', '4C0039', '4C2642', '26001C', '581358', 'FF007F',
  'FF7FBF', 'A50052', 'A5527C', '7F003F', '7F3F5F', '4C0026', '4C2639', '260013', '58131C', 'FF003F',
  'FF7F9F', 'A50029', 'A55267', '7F001F', '7F3F4F', '4C0013', '4C262F', '260009', '581317', '000000',
  '656565', '666666', '999999', 'CCCCCC', 'FFFFFF',
] as const;

const STANDARD_NAMES: Record<number, string> = {
  1: 'Red (ACI 1)',
  2: 'Yellow (ACI 2)',
  3: 'Green (ACI 3)',
  4: 'Cyan (ACI 4)',
  5: 'Blue (ACI 5)',
  6: 'Magenta (ACI 6)',
  7: 'White / Black (ACI 7)',
  8: 'Gray (ACI 8)',
  9: 'Light Gray (ACI 9)',
  250: 'Gray Shade 250 (ACI 250)',
  251: 'Gray Shade 251 (ACI 251)',
  252: 'Gray Shade 252 (ACI 252)',
  253: 'Gray Shade 253 (ACI 253)',
  254: 'Gray Shade 254 (ACI 254)',
  255: 'Gray Shade 255 / White (ACI 255)',
};

const ACI_COLORS_DB: AciColor[] = ACI_HEX_1_TO_255.map((hexBody, i) => {
  const index = i + 1;
  const r = parseInt(hexBody.slice(0, 2), 16);
  const g = parseInt(hexBody.slice(2, 4), 16);
  const b = parseInt(hexBody.slice(4, 6), 16);
  return {
    index,
    r,
    g,
    b,
    hex: `#${hexBody}`,
    name: STANDARD_NAMES[index] ?? `ACI Color ${index}`,
  };
});

function rgbToXyzD65(r: number, g: number, b: number) {
  const lin = (v: number) => {
    const c = v / 255;
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  };
  const rL = lin(r) * 100;
  const gL = lin(g) * 100;
  const bL = lin(b) * 100;

  return {
    x: rL * 0.4124 + gL * 0.3576 + bL * 0.1805,
    y: rL * 0.2126 + gL * 0.7152 + bL * 0.0722,
    z: rL * 0.0193 + gL * 0.1192 + bL * 0.9505,
  };
}

function xyzToLab(x: number, y: number, z: number) {
  const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);
  const fx = f(x / 95.047);
  const fy = f(y / 100.0);
  const fz = f(z / 108.883);
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function cie76DeltaE(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const xyz1 = rgbToXyzD65(r1, g1, b1);
  const lab1 = xyzToLab(xyz1.x, xyz1.y, xyz1.z);
  const xyz2 = rgbToXyzD65(r2, g2, b2);
  const lab2 = xyzToLab(xyz2.x, xyz2.y, xyz2.z);
  return Math.sqrt(
    (lab1.L - lab2.L) ** 2 +
      (lab1.a - lab2.a) ** 2 +
      (lab1.b - lab2.b) ** 2
  );
}

function euclideanRgbDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function parseRgbByte(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0 || n > 255) return null;
  return n;
}

function parseHexColor(raw: string): { r: number; g: number; b: number; hex: string } | null {
  const s = raw.trim();
  const m = /^#?([0-9a-f]{6})$/i.exec(s);
  if (!m) return null;
  const hexBody = m[1].toUpperCase();
  return {
    r: parseInt(hexBody.slice(0, 2), 16),
    g: parseInt(hexBody.slice(2, 4), 16),
    b: parseInt(hexBody.slice(4, 6), 16),
    hex: `#${hexBody}`,
  };
}

const PRESETS = [
  { id: 'default-blue', name: 'Default Blue', hex: '#3B82F6' },
  { id: 'autocad-blue', name: 'AutoCAD Blue', hex: '#005691' },
  { id: 'red-alert', name: 'Standard Red', hex: '#D32F2F' },
  { id: 'exact-red', name: 'Exact ACI 1', hex: '#FF0000' },
  { id: 'gray-253', name: 'ACI 253 Gray', hex: '#999999' },
];

export default function ColorMatchboxClient() {
  const [metric, setMetric] = useState<DistanceMetric>('cie76');
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rStr, setRStr] = useState('59');
  const [gStr, setGStr] = useState('130');
  const [bStr, setBStr] = useState('246');
  const [copied, setCopied] = useState(false);

  const applyHex = (hex: string) => {
    setHexInput(hex);
    const parsed = parseHexColor(hex);
    if (parsed) {
      setRStr(String(parsed.r));
      setGStr(String(parsed.g));
      setBStr(String(parsed.b));
    }
  };

  const applyRgbChannels = (nextR: string, nextG: string, nextB: string) => {
    setRStr(nextR);
    setGStr(nextG);
    setBStr(nextB);
    const r = parseRgbByte(nextR);
    const g = parseRgbByte(nextG);
    const b = parseRgbByte(nextB);
    if (r !== null && g !== null && b !== null) {
      const hex =
        '#' +
        [r, g, b]
          .map((c) => c.toString(16).padStart(2, '0').toUpperCase())
          .join('');
      setHexInput(hex);
    }
  };

  const handleReset = () => applyHex('#3B82F6');

  const calc = useMemo(() => {
    const r = parseRgbByte(rStr);
    const g = parseRgbByte(gStr);
    const b = parseRgbByte(bStr);
    const hexParsed = parseHexColor(hexInput);

    // Both HEX text box and R/G/B inputs must agree as valid when edited directly
    if (r === null || g === null || b === null || hexParsed === null) {
      return {
        valid: false as const,
        error: 'Enter valid R, G, B integers (0–255) or a 6-digit HEX code (#RRGGBB).',
      };
    }

    const xyz = rgbToXyzD65(r, g, b);
    const ranked = ACI_COLORS_DB.map((aci) => {
      const deltaE = cie76DeltaE(r, g, b, aci.r, aci.g, aci.b);
      const euclid = euclideanRgbDistance(r, g, b, aci.r, aci.g, aci.b);
      return {
        ...aci,
        deltaE,
        euclid,
        primaryDistance: metric === 'cie76' ? deltaE : euclid,
      };
    }).sort((a, bItem) => {
      if (a.primaryDistance !== bItem.primaryDistance) {
        return a.primaryDistance - bItem.primaryDistance;
      }
      return a.index - bItem.index;
    });

    return {
      valid: true as const,
      r,
      g,
      b,
      hex: hexParsed.hex,
      xyz,
      bestMatch: ranked[0],
      alternatives: ranked.slice(1, 6),
    };
  }, [rStr, gStr, bStr, hexInput, metric]);

  const handleCopyIndex = async () => {
    if (!calc.valid) return;
    try {
      if (!navigator.clipboard?.writeText) {
        setCopied(false);
        return;
      }
      await navigator.clipboard.writeText(String(calc.bestMatch.index));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleExportCsv = () => {
    if (!calc.valid) return;
    const m = calc.bestMatch;
    const rows = [
      'field,value,notes',
      `input_hex,${calc.hex},User HEX input`,
      `input_rgb,"${calc.r},${calc.g},${calc.b}",Integer channels 0..255`,
      `distance_metric,${metric},cie76 (Delta-E) or euclidean (RGB)`,
      `matched_aci_index,${m.index},AutoCAD Color Index (1-255)`,
      `matched_name,${m.name},Standard ACI name or index`,
      `matched_hex,${m.hex},ezdxf DXF_DEFAULT_COLORS`,
      `matched_rgb,"${m.r},${m.g},${m.b}",Matched ACI sRGB triplet`,
      `cie76_delta_e,${m.deltaE.toFixed(2)},Perceptual CIE L*a*b* distance`,
      `euclidean_rgb_distance,${m.euclid.toFixed(2)},sqrt(dR^2 + dG^2 + dB^2)`,
    ];
    const blob = new Blob([rows.join('\n') + '\n'], { type: 'text/csv;charset=ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rgb-to-aci-match.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" /> Presets &amp; Distance Algorithm
          </h3>
          <button
            type="button"
            data-testid="reset-button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              onClick={() => applyHex(p.hex)}
              className="px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition"
            >
              {p.name} ({p.hex})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 max-w-lg">
          <button
            type="button"
            data-testid="metric-cie76"
            onClick={() => setMetric('cie76')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
              metric === 'cie76' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CIE76 Delta-E (Perceptual)
          </button>
          <button
            type="button"
            data-testid="metric-euclidean"
            onClick={() => setMetric('euclidean')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
              metric === 'euclidean' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Euclidean RGB Distance
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">RGB / HEX Color Input</h2>
            <p className="text-sm text-slate-500">
              Palette: AutoCAD 2020 default dark modelspace ACI 1–255 (<code>ezdxf</code> / <code>netDxf</code>).
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 relative shrink-0">
              <input
                aria-label="Color Picker"
                type="color"
                value={calc.valid ? calc.hex : '#3B82F6'}
                onChange={(e) => applyHex(e.target.value)}
                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
              />
            </div>
            <div className="space-y-1 w-full">
              <label htmlFor="color-hex-input" className="block text-xs font-bold text-slate-500 uppercase">
                HEX Code (#RRGGBB)
              </label>
              <input
                id="color-hex-input"
                data-testid="input-hex"
                type="text"
                value={hexInput}
                onChange={(e) => applyHex(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-bold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="color-r-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Red (0–255)
              </label>
              <input
                id="color-r-input"
                data-testid="input-r"
                type="text"
                inputMode="numeric"
                value={rStr}
                onChange={(e) => applyRgbChannels(e.target.value, gStr, bStr)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="color-g-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Green (0–255)
              </label>
              <input
                id="color-g-input"
                data-testid="input-g"
                type="text"
                inputMode="numeric"
                value={gStr}
                onChange={(e) => applyRgbChannels(rStr, e.target.value, bStr)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="color-b-input" className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Blue (0–255)
              </label>
              <input
                id="color-b-input"
                data-testid="input-b"
                type="text"
                inputMode="numeric"
                value={bStr}
                onChange={(e) => applyRgbChannels(rStr, gStr, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {!calc.valid && (
            <div data-testid="validation-error" className="text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {calc.error}
            </div>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              data-testid="export-csv"
              disabled={!calc.valid}
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-40 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV Match
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Closest AutoCAD Color Index ({metric === 'cie76' ? 'CIE76 Delta-E' : 'Euclidean RGB'})
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span data-testid="result-aci-index" className="text-4xl font-black font-mono text-slate-900">
                    {calc.valid ? `ACI ${calc.bestMatch.index}` : '—'}
                  </span>
                  <span data-testid="result-aci-name" className="text-base font-bold text-slate-600">
                    {calc.valid ? calc.bestMatch.name : '—'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={!calc.valid}
                onClick={handleCopyIndex}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-40 transition"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Index'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">Input Color</div>
                <div
                  className="h-14 rounded-xl border border-slate-200"
                  style={{ backgroundColor: calc.valid ? calc.hex : '#e2e8f0' }}
                />
                <div data-testid="result-input-hex" className="font-mono text-sm font-bold text-slate-800">
                  {calc.valid ? `${calc.hex} (${calc.r}, ${calc.g}, ${calc.b})` : '—'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">Matched ACI Swatch</div>
                <div
                  className="h-14 rounded-xl border border-slate-200"
                  style={{ backgroundColor: calc.valid ? calc.bestMatch.hex : '#e2e8f0' }}
                />
                <div data-testid="result-matched-hex" className="font-mono text-sm font-bold text-slate-800">
                  {calc.valid
                    ? `${calc.bestMatch.hex} (${calc.bestMatch.r}, ${calc.bestMatch.g}, ${calc.bestMatch.b})`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase text-slate-400">CIE76 Delta-E (ΔE76)</div>
                <div data-testid="result-delta-e" className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {calc.valid ? calc.bestMatch.deltaE.toFixed(2) : '—'}
                </div>
                <div className="text-xs text-slate-500 mt-1">D65 sRGB → CIE L*a*b* perceptual distance</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="text-xs font-bold uppercase text-slate-400">Euclidean RGB Distance</div>
                <div data-testid="result-euclidean" className="text-2xl font-black font-mono text-slate-900 mt-1">
                  {calc.valid ? calc.bestMatch.euclid.toFixed(2) : '—'}
                </div>
                <div className="text-xs text-slate-500 mt-1">sqrt((dR)^2 + (dG)^2 + (dB)^2) in 0–255 space</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Top 5 Alternative Matches</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {calc.valid
                  ? calc.alternatives.map((aci) => (
                      <button
                        key={aci.index}
                        type="button"
                        onClick={() => applyHex(aci.hex)}
                        className="border border-slate-200 hover:border-blue-400 rounded-xl p-2 text-center bg-white transition"
                      >
                        <div className="h-8 rounded-lg mb-1.5 border border-slate-100" style={{ backgroundColor: aci.hex }} />
                        <div className="text-xs font-black text-slate-800">ACI {aci.index}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {metric === 'cie76' ? `ΔE ${aci.deltaE.toFixed(1)}` : `d ${aci.euclid.toFixed(1)}`}
                        </div>
                      </button>
                    ))
                  : Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-3 text-center text-slate-400 font-mono text-xs bg-white">
                        —
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Distance Formulas, Palette Behavior &amp; CAD Command
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="font-bold text-slate-900">1. Matching Algorithms &amp; AutoCAD ACI Behavior</div>
            <p>
              <strong>Euclidean RGB:</strong> d = sqrt((R1 - R2)^2 + (G1 - G2)^2 + (B1 - B2)^2). Exact matches yield d = 0.00.
            </p>
            <p>
              <strong>CIE76 Delta-E:</strong> Converts sRGB channels (0–255) via sRGB linearization to CIE XYZ (D65/2 deg) and CIE L*a*b*, then computes ΔE76 = sqrt((L1 - L2)^2 + (a1 - a2)^2 + (b1 - b2)^2).
            </p>
            <p>
              <strong>ACI Palette Scope &amp; Viewport Adaptation:</strong> Autodesk <em>Index Color Tab (Select Color Dialog Box)</em> (<code>GUID-C163F875</code>) organizes the 255 AutoCAD Color Index values into indices 1–9 (named colors), 10–249, and 250–255 (shades of gray) without specifying background shifts. Separately, comparing <code>ezdxf</code> <code>DXF_DEFAULT_COLORS</code> (default 2D model space RGB 33,40,48) vs. <code>DXF_DEFAULT_PAPERSPACE_COLORS</code> (white layout RGB 255,255,255) shows that ACI 7 (#FFFFFF vs. #000000), gray shades 251–255, and 21 dark-tone indices adapt to background contrast while ACI 250 remains #000000 in both palettes. Always verify CTB/STB plot lineweights in your office plot style table.
            </p>
          </div>

          <div className="space-y-2.5 bg-slate-50 p-5 rounded-2xl border border-slate-100 font-mono text-xs text-slate-700">
            <div className="font-sans font-bold text-sm text-slate-900">2. Color Conversion Log &amp; Layer Command</div>
            <div data-testid="xyz-log">
              {calc.valid
                ? `D65 XYZ (from linearized sRGB): X=${calc.xyz.x.toFixed(2)}, Y=${calc.xyz.y.toFixed(2)}, Z=${calc.xyz.z.toFixed(2)}`
                : 'D65 XYZ: —'}
            </div>
            <div className="pt-2 border-t border-slate-200 text-slate-900 font-bold">
              {calc.valid
                ? `-LAYER C ${calc.bestMatch.index} <layer_name>`
                : '-LAYER C — <layer_name>'}
            </div>
            <div className="font-sans text-slate-500">
              Palette table: ACI 1–9 standard named/gray indices, 10–249 color wheel, 250–255 dark-to-light gray shades (#000000, #656565, #666666, #999999, #CCCCCC, #FFFFFF in ezdxf AutoCAD 2020 dark modelspace table).
            </div>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
