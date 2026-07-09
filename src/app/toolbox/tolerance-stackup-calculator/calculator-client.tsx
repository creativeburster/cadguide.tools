'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Download, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

interface DimRow {
  id: number;
  nominal: number;
  tolerance: number;
  direction: 1 | -1;
}

let nextId = 4;

export default function ToleranceStackupClient() {
  const [rows, setRows] = useState<DimRow[]>([
    { id: 1, nominal: 50, tolerance: 0.1, direction: 1 },
    { id: 2, nominal: 30, tolerance: 0.05, direction: 1 },
    { id: 3, nominal: 20, tolerance: 0.08, direction: -1 },
  ]);

  const addRow = () => {
    setRows([...rows, { id: nextId++, nominal: 10, tolerance: 0.05, direction: 1 }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: number, field: keyof DimRow, value: number) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const results = useMemo(() => {
    // Nominal sum
    const nominalSum = rows.reduce((sum, r) => sum + r.nominal * r.direction, 0);

    // Worst Case (arithmetic)
    const worstCaseTol = rows.reduce((sum, r) => sum + Math.abs(r.tolerance), 0);
    const wcMax = nominalSum + worstCaseTol;
    const wcMin = nominalSum - worstCaseTol;

    // RSS (statistical)
    const rssTol = Math.sqrt(rows.reduce((sum, r) => sum + r.tolerance * r.tolerance, 0));
    const rssMax = nominalSum + rssTol;
    const rssMin = nominalSum - rssTol;

    // Identify critical contributor (largest tolerance)
    const criticalRow = rows.length > 0 ? rows.reduce((max, r) => Math.abs(r.tolerance) > Math.abs(max.tolerance) ? r : max, rows[0]) : null;

    return {
      nominalSum: nominalSum.toFixed(3),
      worstCaseTol: worstCaseTol.toFixed(3),
      wcMax: wcMax.toFixed(3),
      wcMin: wcMin.toFixed(3),
      rssTol: rssTol.toFixed(3),
      rssMax: rssMax.toFixed(3),
      rssMin: rssMin.toFixed(3),
      criticalTol: criticalRow ? criticalRow.tolerance.toFixed(3) : '0',
      criticalPct: criticalRow && worstCaseTol > 0 ? ((criticalRow.tolerance / worstCaseTol) * 100).toFixed(1) : '0',
    };
  }, [rows]);

  const downloadCsv = () => {
    const csv = [
      ['Tolerance Stack-Up Analysis Report', ''],
      ['Date', new Date().toLocaleDateString()],
      ['', ''],
      ['Dimension Chain', ''],
      'ID,Nominal (mm),Tolerance (±mm),Direction'.split(','),
      ...rows.map(r => [r.id, r.nominal, r.tolerance, r.direction === 1 ? '+' : '-']),
      ['', ''],
      ['Results', ''],
      ['Nominal Sum', results.nominalSum],
      ['Worst Case Tolerance', results.worstCaseTol],
      ['Worst Case Max', results.wcMax],
      ['Worst Case Min', results.wcMin],
      ['RSS Tolerance', results.rssTol],
      ['RSS Max', results.rssMax],
      ['RSS Min', results.rssMin],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tolerance-stackup-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Table */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Dimension Chain</h2>
            </div>
            <button onClick={addRow} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 transition-all">
              <Plus className="w-4 h-4" />
              Add Dimension
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-[10px]">#</th>
                  <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-[10px]">Nominal (mm)</th>
                  <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-[10px]">±Tol (mm)</th>
                  <th className="text-left py-3 px-2 font-black text-slate-400 uppercase tracking-wider text-[10px]">Dir</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={r.id} className="border-b border-slate-50">
                    <td className="py-3 px-2 font-bold text-slate-400 text-xs">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.1"
                        value={r.nominal}
                        onChange={e => updateRow(r.id, 'nominal', parseFloat(e.target.value) || 0)}
                        className="w-24 h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={r.tolerance}
                        onChange={e => updateRow(r.id, 'tolerance', parseFloat(e.target.value) || 0)}
                        className="w-24 h-10 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => updateRow(r.id, 'direction', r.direction === 1 ? -1 : 1)}
                        className={`w-12 h-10 rounded-xl text-sm font-black border transition-all ${
                          r.direction === 1
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                            : 'bg-red-50 border-red-200 text-red-600'
                        }`}
                      >
                        {r.direction === 1 ? '+' : '−'}
                      </button>
                    </td>
                    <td className="py-2 px-2">
                      <button onClick={() => removeRow(r.id)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rows.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm font-bold">No dimensions. Click "Add Dimension" to start.</div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Analysis Results</h2>
              <button onClick={downloadCsv} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all">
                <Download className="w-4 h-4" />
                CSV
              </button>
            </div>

            {/* Nominal */}
            <div className="rounded-2xl bg-slate-900 p-5 text-white mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">Nominal Dimension</p>
              <p className="text-3xl font-black">{results.nominalSum}<span className="text-sm font-bold ml-2 opacity-60">mm</span></p>
            </div>

            {/* Worst Case */}
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5 mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 mb-2">Worst Case (Arithmetic)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Max</p>
                  <p className="text-xl font-black text-blue-700">{results.wcMax}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Min</p>
                  <p className="text-xl font-black text-blue-700">{results.wcMin}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">±{results.worstCaseTol} mm tolerance band</p>
            </div>

            {/* RSS */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 mb-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-2">RSS (Statistical, ±3σ)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Max</p>
                  <p className="text-xl font-black text-emerald-700">{results.rssMax}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">Min</p>
                  <p className="text-xl font-black text-emerald-700">{results.rssMin}</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">±{results.rssTol} mm tolerance band</p>
            </div>

            {/* Critical Contributor */}
            {rows.length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Critical Contributor</p>
                </div>
                <p className="text-xs text-slate-600 font-bold mt-1">
                  Largest tolerance ±{results.criticalTol} mm contributes {results.criticalPct}% of total WC band
                </p>
              </div>
            )}
          </div>

          {/* Method Comparison */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-3">Method Comparison</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-700">Worst Case</p>
                  <p className="text-slate-500 font-medium">100% yield guaranteed. All parts assemble regardless of individual tolerance combinations. Use for critical/safety applications.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-700">RSS (Statistical)</p>
                  <p className="text-slate-500 font-medium">Assumes normal distribution. 99.73% yield (±3σ). Tighter assembly tolerance. Use for high-volume production with controlled processes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedTools compact />
    </div>
  );
}
