'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Layers, RotateCcw, Copy, Download, Check } from 'lucide-react';

type MatCategory = 'all' | 'steel' | 'aluminum' | 'copper' | 'titanium' | 'plastic';

interface MaterialRow {
  grade: string;
  category: Exclude<MatCategory, 'all'>;
  density: string;
  yieldMpa: string;
  utsMpa: string;
  modulusGpa: string;
  poisson: string;
  cte: string;
  notes: string;
}

// All figures verified verbatim from Wikipedia material specs and AmesWeb CTE/density tables; unverified columns strictly '—'
const VERIFIED_MATERIALS: MaterialRow[] = [
  { grade: 'ASTM A36 Structural Steel', category: 'steel', density: '7.8', yieldMpa: '250', utsMpa: '400-550', modulusGpa: '200', poisson: '0.26', cte: '11.7', notes: 'Plates/shapes < 8 in: 250 MPa min yield, 400-550 MPa UTS.' },
  { grade: 'Carbon Steel (Mild / 1020)', category: 'steel', density: '7.85', yieldMpa: '—', utsMpa: '—', modulusGpa: '200', poisson: '—', cte: '11.7', notes: 'General low-carbon structural & machining stock.' },
  { grade: 'SAE 304 Stainless Steel', category: 'steel', density: '7.5-8.0', yieldMpa: '210', utsMpa: '—', modulusGpa: '—', poisson: '—', cte: '17.2', notes: 'Annealed tensile yield ~210 MPa; 18-20% Cr, 8-11% Ni.' },
  { grade: 'SAE 316 Stainless Steel', category: 'steel', density: '7.5-8.0', yieldMpa: '—', utsMpa: '—', modulusGpa: '—', poisson: '—', cte: '15.9', notes: 'Austenitic stainless alloy with lower CTE than 304.' },
  { grade: 'Aluminum 6061', category: 'aluminum', density: '2.70', yieldMpa: '270', utsMpa: '310', modulusGpa: '68', poisson: '0.33', cte: '23.6', notes: 'Typical structural values 310 MPa UTS / 270 MPa yield (min 290/240).' },
  { grade: 'Aluminum 7075-T6', category: 'aluminum', density: '2.81', yieldMpa: '—', utsMpa: '572', modulusGpa: '71.7', poisson: '0.33', cte: '23.4', notes: 'High-strength aerospace aluminum alloy.' },
  { grade: 'Copper (Pure / C11000 ETP)', category: 'copper', density: '8.935', yieldMpa: '—', utsMpa: '—', modulusGpa: '110-128', poisson: '0.34', cte: '17.0', notes: 'Density 8.935 g/cm3 at 20 C; high electrical/thermal conductivity.' },
  { grade: 'Brass (C36000 Free-Cutting)', category: 'copper', density: '8.40-8.73', yieldMpa: '—', utsMpa: '—', modulusGpa: '—', poisson: '—', cte: '20.5', notes: 'Density spans 8.4 to 8.73 g/cm3 depending on Cu-Zn ratio.' },
  { grade: 'Titanium Ti-6Al-4V', category: 'titanium', density: '4.429', yieldMpa: '880', utsMpa: '900-950', modulusGpa: '104-113', poisson: '0.31-0.37', cte: '8.6', notes: 'Density 4.429 g/cm3 min; yield 880-920 MPa; thermal cond 6.7-7.5 W/mK.' },
  { grade: 'PEEK', category: 'plastic', density: '1.32', yieldMpa: '—', utsMpa: '90-100', modulusGpa: '3.6', poisson: '—', cte: '—', notes: 'High-temp semi-crystalline polymer (Tg 143 C, Tm 343 C).' },
  { grade: 'Polycarbonate (PC)', category: 'plastic', density: '1.20-1.22', yieldMpa: '—', utsMpa: '55-75', modulusGpa: '2.0-2.4', poisson: '0.37', cte: '65-70', notes: 'High-impact amorphous glazing and housing polymer.' },
  { grade: 'PTFE', category: 'plastic', density: '2.20', yieldMpa: '23', utsMpa: '—', modulusGpa: '0.5', poisson: '—', cte: '112-125', notes: 'Low friction (0.05-0.10), melting point 327 C, chemical inertness.' },
  { grade: 'Acetal (POM)', category: 'plastic', density: '1.41-1.42', yieldMpa: '—', utsMpa: '—', modulusGpa: '—', poisson: '—', cte: '—', notes: 'Stiff engineering acetal homopolymer/copolymer (Tm 175 C).' },
  { grade: 'Nylon 6/6', category: 'plastic', density: '1.14', yieldMpa: '—', utsMpa: '—', modulusGpa: '—', poisson: '—', cte: '—', notes: 'Engineering polyamide resin (Tm 264 C).' },
];

export default function MaterialPropertiesClient() {
  const [searchStr, setSearchStr] = useState('');
  const [cat, setCat] = useState<MatCategory>('all');
  const [copied, setCopied] = useState(false);

  const q = searchStr.trim().toLowerCase();
  const filtered = VERIFIED_MATERIALS.filter(m => {
    if (cat !== 'all' && m.category !== cat) return false;
    if (!q) return true;
    return m.grade.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  const featured = filtered[0] ?? null;

  const handleReset = () => {
    setSearchStr('');
    setCat('all');
  };

  const handleCopy = async () => {
    if (filtered.length === 0) return;
    const text = [
      'Engineering Material Properties Reference (14 Verified Grades)',
      ...filtered.map(
        m => `${m.grade} | rho=${m.density} g/cm3 | Yield=${m.yieldMpa} MPa | UTS=${m.utsMpa} MPa | E=${m.modulusGpa} GPa | nu=${m.poisson} | CTE=${m.cte}`
      ),
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
    if (filtered.length === 0) return;
    const rows = [
      ['grade', 'category', 'density_g_cm3', 'yield_mpa', 'uts_mpa', 'modulus_gpa', 'poisson', 'cte_e6_per_c'],
      ...filtered.map(m => [
        m.grade,
        m.category,
        m.density,
        m.yieldMpa === '—' ? '' : m.yieldMpa,
        m.utsMpa === '—' ? '' : m.utsMpa,
        m.modulusGpa === '—' ? '' : m.modulusGpa,
        m.poisson === '—' ? '' : m.poisson,
        m.cte === '—' ? '' : m.cte,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engineering-material-properties.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Verified Material Data Sheet</h2>
              <p className="text-sm text-slate-500 font-medium">14 core engineering metals &amp; polymers (missing unverified fields left as —)</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              data-testid="preset-a36"
              onClick={() => {
                setCat('steel');
                setSearchStr('A36');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
            >
              ASTM A36 Steel
            </button>
            <button
              type="button"
              data-testid="preset-6061"
              onClick={() => {
                setCat('aluminum');
                setSearchStr('6061');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
            >
              Aluminum 6061
            </button>
            <button
              type="button"
              data-testid="preset-ti64"
              onClick={() => {
                setCat('titanium');
                setSearchStr('Ti-6Al-4V');
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-teal-50 text-slate-700 border border-slate-200"
            >
              Titanium Ti-6Al-4V
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              data-testid="input-search"
              value={searchStr}
              onChange={e => setSearchStr(e.target.value)}
              placeholder="Search grade (e.g. 6061, A36, PEEK)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-1.5">
            {(['all', 'steel', 'aluminum', 'copper', 'titanium', 'plastic'] as MatCategory[]).map(c => (
              <button
                key={c}
                type="button"
                data-testid={`filter-${c}`}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize border ${
                  cat === c ? 'bg-teal-700 text-white border-teal-700' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <div className="text-xs font-black text-teal-600 uppercase tracking-wider mb-1">Matching Grades</div>
            <div className="text-2xl font-black text-teal-900">
              <span data-testid="result-count">{filtered.length}</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Top Match</div>
            <div className="text-sm font-black text-slate-900 truncate">
              <span data-testid="result-top-grade">{featured ? featured.grade : '—'}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Density (g/cm3)</div>
            <div className="text-xl font-black text-blue-900">
              <span data-testid="result-top-density">{featured ? featured.density : '—'}</span>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Young&apos;s Modulus (GPa)</div>
            <div className="text-xl font-black text-emerald-900">
              <span data-testid="result-top-modulus">{featured ? featured.modulusGpa : '—'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            data-testid="btn-reset"
            onClick={handleReset}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            type="button"
            data-testid="btn-copy"
            onClick={handleCopy}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Visible Rows'}
          </button>
          <button
            type="button"
            data-testid="btn-download"
            onClick={handleDownload}
            className="py-2.5 px-4 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-black uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Material Grade</th>
                <th className="px-4 py-3 text-right">rho (g/cm3)</th>
                <th className="px-4 py-3 text-right">Yield (MPa)</th>
                <th className="px-4 py-3 text-right">UTS (MPa)</th>
                <th className="px-4 py-3 text-right">E (GPa)</th>
                <th className="px-4 py-3 text-right">nu</th>
                <th className="px-4 py-3 text-right">CTE (10^-6/C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => (
                <tr key={m.grade} className="hover:bg-teal-50/40">
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-900">{m.grade}</div>
                    <div className="text-xs text-slate-500">{m.notes}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-bold">{m.density}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{m.yieldMpa}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{m.utsMpa}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{m.modulusGpa}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{m.poisson}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{m.cte}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                    No matching materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RelatedTools />
    </div>
  );
}
