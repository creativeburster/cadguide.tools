'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { CloudLightning, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const POS_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

function parsePos(raw: string): number | null {
  const t = raw.trim();
  if (!POS_RE.test(t)) return null;
  const v = Number(t);
  return Number.isFinite(v) && v > 0 ? v : null;
}

export default function LightningProtectionCalculatorClient() {
  const [lenStr, setLenStr] = useState('45');
  const [widStr, setWidStr] = useState('25');
  const [heightStr, setHeightStr] = useState('22');
  const [slopeKStr, setSlopeKStr] = useState('3');
  const [ngStr, setNgStr] = useState('4.0');
  const [cdStr, setCdStr] = useState('1.0');
  const [ncStr, setNcStr] = useState('0.0001');
  const [copied, setCopied] = useState(false);

  const l = parsePos(lenStr);
  const w = parsePos(widStr);
  const h = parsePos(heightStr);
  const kSlope = parsePos(slopeKStr);
  const ng = parsePos(ngStr);
  const cd = parsePos(cdStr);
  const nc = parsePos(ncStr);

  const isValid = l !== null && w !== null && h !== null && kSlope !== null && ng !== null && cd !== null && nc !== null;

  let aeSqM: number | null = null;
  let aeThousand: number | null = null;
  let nd: number | null = null;
  let exceeds: boolean | null = null;

  if (isValid && l !== null && w !== null && h !== null && kSlope !== null && ng !== null && cd !== null && nc !== null) {
    const ext = kSlope * h;
    aeSqM = l * w + 2 * ext * (l + w) + Math.PI * ext * ext;
    aeThousand = aeSqM / 1000;
    nd = ng * 1e-6 * aeSqM * cd;
    exceeds = nd > nc;
  }

  const fmt = (n: number | null, dec: number) => (n !== null && Number.isFinite(n) ? n.toFixed(dec) : '—');

  const applyPreset = (lv: string, wv: string, hv: string, kv: string, ngv: string, cdv: string, ncv: string) => {
    setLenStr(lv);
    setWidStr(wv);
    setHeightStr(hv);
    setSlopeKStr(kv);
    setNgStr(ngv);
    setCdStr(cdv);
    setNcStr(ncv);
  };

  const handleReset = () => applyPreset('45', '25', '22', '3', '4.0', '1.0', '0.0001');

  const handleCopy = async () => {
    if (!isValid || aeSqM === null || nd === null || exceeds === null) return;
    const text = [
      'Lightning Collection Area & Direct Strike Frequency',
      `L=${l} m, W=${w} m, H=${h} m, Envelope k=${kSlope}, Ng=${ng}, Cd=${cd}`,
      `Equivalent Collection Area Ae: ${aeSqM.toFixed(1)} m2`,
      `Annual Strike Frequency Nd: ${nd.toFixed(5)} strikes/yr vs Nc=${nc} (${exceeds ? 'EXCEEDS' : 'BELOW'} threshold)`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || aeSqM === null || aeThousand === null || nd === null || exceeds === null) return;
    const rows = [
      ['parameter', 'value', 'unit'],
      ['building_length', String(l), 'm'],
      ['building_width', String(w), 'm'],
      ['building_height', String(h), 'm'],
      ['envelope_slope_k', String(kSlope), 'ratio'],
      ['ground_flash_density_ng', String(ng), 'flashes/km2/yr'],
      ['location_factor_cd', String(cd), 'ratio'],
      ['tolerable_frequency_nc', String(nc), 'strikes/yr'],
      ['collection_area_ae_m2', aeSqM.toFixed(2), 'm2'],
      ['collection_area_thousand_m2', aeThousand.toFixed(4), 'thousand_m2'],
      ['expected_strikes_nd', nd.toFixed(6), 'strikes/yr'],
      ['exceeds_nc', exceeds ? 'YES' : 'NO', 'flag'],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lightning-collection-frequency.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <CloudLightning className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Structure &amp; Flash Density</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Presets</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-k3-warehouse"
                onClick={() => applyPreset('45', '25', '22', '3', '4.0', '1.0', '0.0001')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Plant Hall (45x25x22 m, k=3 envelope)
              </button>
              <button
                type="button"
                data-testid="preset-k1-low"
                onClick={() => applyPreset('30', '20', '10', '1', '2.0', '0.5', '0.0001')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Low-Slope k=1 Building (30x20x10 m)
              </button>
              <button
                type="button"
                data-testid="preset-k3-highrise"
                onClick={() => applyPreset('20', '20', '45', '3', '5.0', '1.5', '0.0001')}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-orange-50 text-slate-700 border border-slate-200"
              >
                Exposed High Structure (20x20x45 m, k=3)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Length L (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-len"
                  value={lenStr}
                  onChange={e => setLenStr(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Width W (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-wid"
                  value={widStr}
                  onChange={e => setWidStr(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Height H (m)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-height"
                  value={heightStr}
                  onChange={e => setHeightStr(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Envelope Slope k</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-kslope"
                  value={slopeKStr}
                  onChange={e => setSlopeKStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Density Ng (/km2/yr)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-ng"
                  value={ngStr}
                  onChange={e => setNgStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Location Factor Cd</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-cd"
                  value={cdStr}
                  onChange={e => setCdStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-500 uppercase block mb-1">Threshold Nc (/yr)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  data-testid="input-nc"
                  value={ncStr}
                  onChange={e => setNcStr(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold"
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>All building dimensions, k slope, density Ng, factor Cd, and Nc must be strictly positive numbers.</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="btn-reset"
              onClick={handleReset}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              type="button"
              data-testid="btn-copy"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              type="button"
              data-testid="btn-download"
              onClick={handleDownload}
              className="w-full py-2.5 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Collection Area &amp; Strike Frequency</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Ae = L*W + 2*(k*H)*(L + W) + pi*(k*H)^2, Nd = Ng * Ae * Cd * 10^-6
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-sm font-black text-orange-600 uppercase tracking-wider mb-1">Strike Frequency Nd</div>
                <div className="text-3xl font-black text-orange-900">
                  <span data-testid="result-nd">{fmt(nd, 6)}</span>{' '}
                  <span className="text-base text-orange-600">strikes/yr</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-sm font-black text-blue-600 uppercase tracking-wider mb-1">Collection Area Ae</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-ae">{fmt(aeSqM, 1)}</span>{' '}
                  <span className="text-lg text-blue-600">m2</span>
                </div>
                <div className="text-xs text-blue-700 mt-1 font-medium">
                  <span data-testid="result-ae-k">{fmt(aeThousand, 3)}</span> thousand m2
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sm:col-span-2">
                <div className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Threshold Comparison (Nd vs Nc)</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-status">
                    {exceeds === null ? '—' : exceeds ? 'EXCEEDS TOLERABLE FREQUENCY' : 'WITHIN TOLERABLE FREQUENCY'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
