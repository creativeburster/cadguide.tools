'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Download, HelpCircle, Layers, Copy, Check, FileText } from 'lucide-react';

interface AciColor {
  index: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  name: string;
}

// Compact, mathematically accurate AutoCAD Index Color (ACI) Generator
const generateAciColors = (): AciColor[] => {
  const list: AciColor[] = [];

  // 1. Standard ACI colors (1 to 9)
  const stdColors = [
    { r: 255, g: 0, b: 0, name: 'Red (Standard index 1)' },          // ACI 1
    { r: 255, g: 255, b: 0, name: 'Yellow (Standard index 2)' },    // ACI 2
    { r: 0, g: 255, b: 0, name: 'Green (Standard index 3)' },        // ACI 3
    { r: 0, g: 255, b: 255, name: 'Cyan (Standard index 4)' },       // ACI 4
    { r: 0, g: 0, b: 255, name: 'Blue (Standard index 5)' },         // ACI 5
    { r: 255, g: 0, b: 255, name: 'Magenta (Standard index 6)' },    // ACI 6
    { r: 255, g: 255, b: 255, name: 'White/Black (Standard index 7)' }, // ACI 7
    { r: 128, g: 128, b: 128, name: 'Dark Grey (Standard index 8)' }, // ACI 8
    { r: 192, g: 192, b: 192, name: 'Light Grey (Standard index 9)' }, // ACI 9
  ];
  stdColors.forEach((c, idx) => {
    const index = idx + 1;
    const hex = '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    list.push({ index, ...c, hex });
  });

  // 2. Grayscale ACI colors (250 to 255)
  const grays = [
    { r: 51, g: 51, b: 51, name: 'Gray (ACI 250)' },
    { r: 91, g: 91, b: 91, name: 'Gray (ACI 251)' },
    { r: 132, g: 132, b: 132, name: 'Gray (ACI 252)' },
    { r: 173, g: 173, b: 173, name: 'Gray (ACI 253)' },
    { r: 214, g: 214, b: 214, name: 'Gray (ACI 254)' },
    { r: 255, g: 255, b: 255, name: 'White (ACI 255)' },
  ];
  grays.forEach((c, idx) => {
    const index = 250 + idx;
    const hex = '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    list.push({ index, ...c, hex });
  });

  // 3. Hue grid (10 to 249)
  // 24 Base Hues along the standard CAD color wheel
  const baseHues = [
    [255, 0, 0, 'Red'],
    [255, 63, 0, 'Red-Orange'],
    [255, 127, 0, 'Orange'],
    [255, 191, 0, 'Yellow-Orange'],
    [255, 255, 0, 'Yellow'],
    [191, 255, 0, 'Yellow-Green'],
    [127, 255, 0, 'Green'],
    [63, 255, 0, 'Green-Cyan'],
    [0, 255, 0, 'Green'],
    [0, 255, 63, 'Cyan-Green'],
    [0, 255, 127, 'Cyan-Green-Blue'],
    [0, 255, 191, 'Cyan-Blue'],
    [0, 255, 255, 'Cyan'],
    [0, 191, 255, 'Cyan-Blue-Violet'],
    [0, 127, 255, 'Blue-Cyan'],
    [0, 63, 255, 'Blue'],
    [0, 0, 255, 'Blue'],
    [63, 0, 255, 'Blue-Indigo'],
    [127, 0, 255, 'Indigo'],
    [191, 0, 255, 'Indigo-Violet'],
    [255, 0, 255, 'Violet/Magenta'],
    [255, 0, 191, 'Magenta-Violet'],
    [255, 0, 127, 'Magenta'],
    [255, 0, 63, 'Magenta-Red'],
  ];

  // Autodesk standard shade scaling factors
  const brightnessFactors = [1.0, 0.78, 0.56, 0.34, 0.12];

  for (let h = 0; h < 24; h++) {
    const [br, bg, bb, hueName] = baseHues[h];
    const baseR = br as number;
    const baseG = bg as number;
    const baseB = bb as number;
    
    for (let s = 0; s < 10; s++) {
      const index = 10 + h * 10 + s;
      const isEven = s % 2 === 0;
      const factorIndex = Math.floor(s / 2);
      const factor = brightnessFactors[factorIndex];

      let r = 0, g = 0, b = 0;
      let shadeName = '';

      if (isEven) {
        // Pure hue, scaled
        r = Math.round(baseR * factor);
        g = Math.round(baseG * factor);
        b = Math.round(baseB * factor);
        shadeName = `${hueName} (Shade ${factorIndex + 1})`;
      } else {
        // Desaturated pastel (blend with white, then scale)
        const mixR = (baseR + 255) / 2;
        const mixG = (baseG + 255) / 2;
        const mixB = (baseB + 255) / 2;

        r = Math.round(mixR * factor);
        g = Math.round(mixG * factor);
        b = Math.round(mixB * factor);
        shadeName = `${hueName} (Pastel Shade ${factorIndex + 1})`;
      }

      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      list.push({
        index,
        r,
        g,
        b,
        hex,
        name: shadeName,
      });
    }
  }

  return list.sort((a, b) => a.index - b.index);
};

// Compile full list statically
const ACI_COLORS_DB = generateAciColors();

// Math helpers for CIE76 Delta-E Color Distance calculation
const rgbToXyz = (r: number, g: number, b: number) => {
  let rL = r / 255;
  let gL = g / 255;
  let bL = b / 255;

  rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
  gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
  bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;

  rL *= 100;
  gL *= 100;
  bL *= 100;

  // Standard D65 observer coefficients
  const x = rL * 0.4124 + gL * 0.3576 + bL * 0.1805;
  const y = rL * 0.2126 + gL * 0.7152 + bL * 0.0722;
  const z = rL * 0.0193 + gL * 0.1192 + bL * 0.9505;

  return { x, y, z };
};

const xyzToLab = (x: number, y: number, z: number) => {
  const refX = 95.047;
  const refY = 100.000;
  const refZ = 108.883;

  let xL = x / refX;
  let yL = y / refY;
  let zL = z / refZ;

  xL = xL > 0.008856 ? Math.pow(xL, 1/3) : (7.787 * xL) + (16 / 116);
  yL = yL > 0.008856 ? Math.pow(yL, 1/3) : (7.787 * yL) + (16 / 116);
  zL = zL > 0.008856 ? Math.pow(zL, 1/3) : (7.787 * zL) + (16 / 116);

  const L = (116 * yL) - 16;
  const a = 500 * (xL - yL);
  const b = 200 * (yL - zL);

  return { L, a, b };
};

const calculateDeltaE = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
  const xyz1 = rgbToXyz(r1, g1, b1);
  const lab1 = xyzToLab(xyz1.x, xyz1.y, xyz1.z);

  const xyz2 = rgbToXyz(r2, g2, b2);
  const lab2 = xyzToLab(xyz2.x, xyz2.y, xyz2.z);

  return Math.sqrt(
    Math.pow(lab1.L - lab2.L, 2) +
    Math.pow(lab1.a - lab2.a, 2) +
    Math.pow(lab1.b - lab2.b, 2)
  );
};

export default function ColorMatchboxClient() {
  const [hexInput, setHexInput] = useState<string>('#3b82f6');
  const [rgbR, setRgbR] = useState<number>(59);
  const [rgbG, setRgbG] = useState<number>(130);
  const [rgbB, setRgbB] = useState<number>(246);
  const [copied, setCopied] = useState<boolean>(false);

  // Apply Brand Presets
  const handleApplyPreset = (hex: string) => {
    setHexInput(hex);
    // Parse hex to RGB
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      setRgbR(parseInt(result[1], 16));
      setRgbG(parseInt(result[2], 16));
      setRgbB(parseInt(result[3], 16));
    }
  };

  // Convert RGB Slider adjustments back to Hex
  const handleRgbChange = (r: number, g: number, b: number) => {
    setRgbR(r);
    setRgbG(g);
    setRgbB(b);
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    setHexInput(hex);
  };

  // Convert Hex string manual input back to RGB
  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
      if (result) {
        setRgbR(parseInt(result[1], 16));
        setRgbG(parseInt(result[2], 16));
        setRgbB(parseInt(result[3], 16));
      }
    }
  };

  // Compute CIE76 Delta-E matching to standard Autodesk 255 color list
  const matchedColors = useMemo(() => {
    const list = ACI_COLORS_DB.map((aci) => {
      const distance = calculateDeltaE(rgbR, rgbG, rgbB, aci.r, aci.g, aci.b);
      return {
        ...aci,
        distance,
      };
    });

    // Sort by smallest distance
    return list.sort((a, b) => a.distance - b.distance);
  }, [rgbR, rgbG, rgbB]);

  const bestMatch = matchedColors[0];

  // Specific CTB plotting thickness and layers advice
  const ctbRecommendation = useMemo(() => {
    if (!bestMatch) return null;
    const idx = bestMatch.index;

    // Standard indexing defaults
    if (idx === 1) return { pen: '0.18 mm', layer: 'Hatch borders, text notes, centerline details', screening: '100%' };
    if (idx === 2) return { pen: '0.35 mm', layer: 'Hidden outlines, minor detail views, dims text', screening: '100%' };
    if (idx === 3) return { pen: '0.50 mm', layer: 'Primary solid visible outlines, mechanical borders', screening: '100%' };
    if (idx === 4) return { pen: '0.70 mm', layer: 'Title block borders, framing sheets, heavy cut planes', screening: '100%' };
    if (idx === 5) return { pen: '0.25 mm', layer: 'Electrical cabling, piping runs, general utilities layout', screening: '100%' };
    if (idx === 6) return { pen: '0.35 mm', layer: 'Section lines, symmetry axis, center markings', screening: '100%' };
    if (idx === 7) return { pen: '0.50 mm (Plots Black)', layer: 'Standard drafting text, visible geometry boundaries', screening: '100%' };
    if (idx === 8 || idx === 9) return { pen: '0.13 mm', layer: 'Thin background equipment overlays, grid ticks', screening: '60% (Screened)' };
    if (idx >= 250 && idx <= 254) return { pen: '0.09 mm', layer: 'Civil contours, architectural partition texture grids', screening: '40% (Screened)' };

    // General hue index
    return {
      pen: '0.25 mm',
      layer: 'General layers. Match in layers styles table to overwrite defaults.',
      screening: idx % 2 === 1 ? '70% (Pastel)' : '100% (Solid)',
    };
  }, [bestMatch]);

  const handleCopyIndex = () => {
    if (!bestMatch) return;
    navigator.clipboard.writeText(bestMatch.index.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Brand Color Presets */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Common Digital Color Presets
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {[
            { name: 'AutoCAD Blue', hex: '#005691' },
            { name: 'Standard Red Alert', hex: '#d32f2f' },
            { name: 'Safety Yellow', hex: '#fbc02d' },
            { name: 'Forest Green', hex: '#2e7d32' },
            { name: 'Sky Cyan', hex: '#0288d1' },
            { name: 'Plum Violet', hex: '#7b1fa2' },
            { name: 'Slate Gray', hex: '#455a64' },
          ].map((c) => (
            <button
              key={c.name}
              onClick={() => handleApplyPreset(c.hex)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-100 text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all"
            >
              {c.name} ({c.hex})
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Color Input controls */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Digital Color Input</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Select a custom color to translate to its nearest AutoCAD indexing value.
            </p>
          </div>

          <div className="space-y-6">
            {/* Color picker and hex text input */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 relative shrink-0">
                <input
                  type="color"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer"
                />
              </div>
              <div className="space-y-1 w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase">HEX Code</span>
                <input
                  type="text"
                  value={hexInput}
                  maxLength={7}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#3B82F6"
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white text-sm font-mono text-slate-700"
                />
              </div>
            </div>

            {/* Red slider */}
            <div className="space-y-2 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-slate-400 uppercase">Red (R)</span>
                <span className="font-mono">{rgbR}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbR}
                onChange={(e) => handleRgbChange(parseInt(e.target.value), rgbG, rgbB)}
                className="w-full h-1.5 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            {/* Green slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-slate-400 uppercase">Green (G)</span>
                <span className="font-mono">{rgbG}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbG}
                onChange={(e) => handleRgbChange(rgbR, parseInt(e.target.value), rgbB)}
                className="w-full h-1.5 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Blue slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-slate-400 uppercase">Blue (B)</span>
                <span className="font-mono">{rgbB}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgbB}
                onChange={(e) => handleRgbChange(rgbR, rgbG, parseInt(e.target.value))}
                className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Split-screen Compare & matched index details */}
        {bestMatch && ctbRecommendation && (
          <div className="lg:col-span-7 space-y-6">
            {/* Split Screen Matchbox */}
            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
              <div className="h-44 flex text-center font-bold text-xs uppercase tracking-widest text-white">
                {/* Left side: user custom input */}
                <div
                  style={{ backgroundColor: hexInput }}
                  className="w-1/2 flex flex-col items-center justify-center p-4 drop-shadow-sm transition-all duration-300"
                >
                  <span className="bg-slate-900/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    Custom Input
                  </span>
                  <span className="text-sm font-black font-mono mt-2 bg-slate-900/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    {hexInput.toUpperCase()}
                  </span>
                </div>

                {/* Right side: standard AutoCAD matching */}
                <div
                  style={{ backgroundColor: bestMatch.hex }}
                  className="w-1/2 flex flex-col items-center justify-center p-4 drop-shadow-sm transition-all duration-300"
                >
                  <span className="bg-slate-900/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    Autodesk ACI Match
                  </span>
                  <span className="text-sm font-black font-mono mt-2 bg-slate-900/40 px-3 py-1 rounded-full backdrop-blur-sm">
                    ACI {bestMatch.index} ({bestMatch.hex.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Match description */}
              <div className="p-6 md:p-8 space-y-6 border-t border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                      Matched Color: {bestMatch.name}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      AutoCAD Index ACI {bestMatch.index}
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyIndex}
                    className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Index
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Index
                      </>
                    )}
                  </button>
                </div>

                {/* Recommended CTB plot details */}
                <div className="grid md:grid-cols-3 gap-6 text-slate-700">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Pen Width</div>
                    <div className="text-lg font-black text-slate-800">{ctbRecommendation.pen}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Color Screening</div>
                    <div className="text-lg font-black text-slate-800">{ctbRecommendation.screening}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CIE76 Delta-E Distance</div>
                    <div className="text-lg font-black text-slate-800">{bestMatch.distance.toFixed(1)}</div>
                  </div>
                </div>

                {/* Layer mapping recommendation */}
                <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-50/50 space-y-2">
                  <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Recommended Layer & Usage
                  </h4>
                  <p className="text-xs text-blue-600 leading-relaxed font-semibold">
                    {ctbRecommendation.layer}. 
                    {bestMatch.distance > 8 && ' Note: The closest matching ACI index has a Delta-E distance of ' + bestMatch.distance.toFixed(1) + '. It is recommended to use layers configurations instead of direct color overriding if absolute brand precision is needed.'}
                  </p>
                </div>
              </div>
            </div>

            {/* alternative nearest matching candidates */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Top 5 Alternative Matches</h4>
              <div className="grid grid-cols-5 gap-3">
                {matchedColors.slice(1, 6).map((aci) => (
                  <button
                    key={aci.index}
                    onClick={() => handleRgbChange(aci.r, aci.g, aci.b)}
                    className="group border border-slate-100 hover:border-blue-300 rounded-2xl overflow-hidden p-2 text-center transition-all bg-slate-50 hover:bg-white"
                  >
                    <div
                      style={{ backgroundColor: aci.hex }}
                      className="h-10 rounded-lg mb-2 group-hover:scale-95 transition-transform"
                    ></div>
                    <div className="text-[10px] font-extrabold text-slate-800">Index {aci.index}</div>
                    <div className="text-[8px] text-slate-400 font-semibold mt-0.5">ΔE: {aci.distance.toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CIE76 Delta-E reference guidelines */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> CIE76 Delta-E Color Distance Reference
        </h3>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">1. Why Delta-E mapping is necessary</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Euclidean RGB vs Human Eye</strong>: A simple distance formula in RGB space ({"$d = \\sqrt{\\Delta R^2 + \\Delta G^2 + \\Delta B^2}$"}) treats color channels linearly. However, the human eye is far more sensitive to green wavelengths than blue, and perceives brightness non-linearly.
              </p>
              <p>
                <strong>CIE76 standard</strong>: We convert the RGB coordinates into the CIE {"$L^*a^*b^*$"} color space. This model separates lightness ({"$L$"}) from the color channels ({"$a$"}: red-green axis, {"$b$"}: yellow-blue axis) to align mathematically with human visual perception limits.
              </p>
              <p>
                <strong>Delta-E ({"$\\Delta E$"}) Threshold values</strong>:
                <br />• <strong>{"$\\Delta E \\le 1.0$"}</strong>: Inappreciable (not perceptible by the human eye).
                <br />• <strong>{"$1.0 < \\Delta E \\le 2.0$"}</strong>: Perceptible only by close observation.
                <br />• <strong>{"$2.0 < \\Delta E \\le 10.0$"}</strong>: Perceptible at a glance.
                <br />• <strong>{"$\\Delta E > 10.0$"}</strong>: Colors look distinctly different.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide">2. Color translation log</h4>
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs font-semibold text-slate-600 leading-relaxed font-mono">
              <div>
                <span className="text-slate-400">// XYZ D65 reference conversion</span>
                <div>X = {rgbR * 0.4124 + rgbG * 0.3576 + rgbB * 0.1805}</div>
                <div>Y = {rgbR * 0.2126 + rgbG * 0.7152 + rgbB * 0.0722}</div>
              </div>
              <div className="pt-2 border-t border-slate-200/50">
                <span className="text-slate-400">// Matched CTB stylesheet tip</span>
                <div>To avoid overriding global drawing styles:</div>
                <div className="text-slate-800 font-mono font-bold text-[11px]">Specify layer color index: {bestMatch?.index}</div>
                <div className="text-slate-400 font-mono text-[9px] pt-1">// Set Layer Color in Command line: -LAYER C {bestMatch?.index} [layerName]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Newsletter banner */}
      <RelatedTools />
    </div>
  );
}
