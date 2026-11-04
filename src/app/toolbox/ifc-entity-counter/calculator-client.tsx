'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, UploadCloud, Download, Building2 } from 'lucide-react';
import { getSampleIfcText } from '@/lib/open-source-cad-engines';

export default function IfcEntityCounterClient() {
  const [inputs, setInputs] = useState(['500', '80', '120', '200', '150']);
  const [ifcFileName, setIfcFileName] = useState<string>('');
  const [parsedElements, setParsedElements] = useState<
    { id: string; ifcClass: string; guid: string; name: string }[]
  >([]);

  const updateInput = (idx: number, val: string) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const parseIfcContent = (text: string, name: string) => {
    setIfcFileName(name);
    let wall = 0,
      door = 0,
      win = 0,
      slab = 0,
      col = 0;
    const elements: { id: string; ifcClass: string; guid: string; name: string }[] = [];
    const re = /^#(\d+)\s*=\s*(IFC[A-Z0-9_]+)\s*\(([^;]*)\);/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const cls = m[2].toUpperCase();
      if (cls === 'IFCWALL' || cls === 'IFCWALLSTANDARDCASE') wall++;
      else if (cls === 'IFCDOOR') door++;
      else if (cls === 'IFCWINDOW') win++;
      else if (cls === 'IFCSLAB') slab++;
      else if (cls === 'IFCCOLUMN') col++;

      if (/^IFC(WALL|WALLSTANDARDCASE|SLAB|COLUMN|BEAM|DOOR|WINDOW|SPACE|BUILDINGSTOREY)$/.test(cls)) {
        const parts = m[3].split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
        elements.push({
          id: `#${m[1]}`,
          ifcClass: cls,
          guid: parts[0] || '—',
          name: parts[2] || '(Unnamed)',
        });
      }
    }
    setInputs([String(wall), String(door), String(win), String(slab), String(col)]);
    setParsedElements(elements);
  };

  const result = useMemo(() => {
    const wall = parseFloat(inputs[0]) || 0;
    const door = parseFloat(inputs[1]) || 0;
    const win = parseFloat(inputs[2]) || 0;
    const slab = parseFloat(inputs[3]) || 0;
    const col = parseFloat(inputs[4]) || 0;
    const total = wall + door + win + slab + col;
    const ratio = wall > 0 ? (door + win) / wall : 0;
    const structRatio = total > 0 ? (wall + slab + col) / total : 0;
    return { total, ratio, structRatio };
  }, [inputs]);

  const formatNum = (n: number) => {
    if (isNaN(n) || !isFinite(n)) return '—';
    if (Math.abs(n) >= 10000) return n.toFixed(0);
    if (Math.abs(n) >= 100) return n.toFixed(2);
    if (Math.abs(n) >= 1) return n.toFixed(3);
    return n.toFixed(4);
  };

  return (
    <div className="space-y-8">
      {/* Local .IFC STEP File Parser Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Drop or Load an openBIM .IFC File for Automatic QTO Entity Counting
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              {ifcFileName
                ? `Parsed ${ifcFileName} (${parsedElements.length} spatial & building entities extracted locally)`
                : 'Parses IFC2x3 / IFC4 STEP physical files 100% locally in your browser.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4" />
            <span>Load .IFC File</span>
            <input
              type="file"
              accept=".ifc"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                f.text().then((txt) => parseIfcContent(txt, f.name));
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => parseIfcContent(getSampleIfcText(), 'Sample-Office-Core-IFC4.ifc')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black"
          >
            Load Sample IFC4 Model
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">IFC Class Counts</h2>
          </div>

          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">IfcWall</label>
            <input
              type="text"
              value={inputs[0]}
              onChange={(e) => updateInput(0, e.target.value)}
              placeholder="500"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">IfcDoor</label>
            <input
              type="text"
              value={inputs[1]}
              onChange={(e) => updateInput(1, e.target.value)}
              placeholder="80"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">IfcWindow</label>
            <input
              type="text"
              value={inputs[2]}
              onChange={(e) => updateInput(2, e.target.value)}
              placeholder="120"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">IfcSlab</label>
            <input
              type="text"
              value={inputs[3]}
              onChange={(e) => updateInput(3, e.target.value)}
              placeholder="200"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">IfcColumn</label>
            <input
              type="text"
              value={inputs[4]}
              onChange={(e) => updateInput(4, e.target.value)}
              placeholder="150"
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => {
              setInputs(['500', '80', '120', '200', '150']);
              setParsedElements([]);
              setIfcFileName('');
            }}
            className="w-full py-3 rounded-xl text-base font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
          >
            Reset Defaults
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">QTO & Density Ratios</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-2">Total Entities</div>
                <div className="text-3xl font-black text-blue-700">{formatNum(result.total)}</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <div className="text-xs font-black text-green-600 uppercase tracking-wider mb-2">Opening / Wall Ratio</div>
                <div className="text-3xl font-black text-green-700">{formatNum(result.ratio)}</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-xs font-black text-orange-500 uppercase tracking-wider mb-2">Structural Ratio</div>
                <div className="text-3xl font-black text-orange-700">{formatNum(result.structRatio)}</div>
              </div>
            </div>

            {parsedElements.length > 0 && (
              <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-black text-slate-700">
                  Extracted IFC Elements ({parsedElements.length})
                </div>
                <div className="max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/60 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-2 px-3">ID</th>
                        <th className="py-2 px-3">Class</th>
                        <th className="py-2 px-3">GlobalId</th>
                        <th className="py-2 px-3">Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedElements.map((el) => (
                        <tr key={el.id}>
                          <td className="py-1.5 px-3 font-mono text-slate-500">{el.id}</td>
                          <td className="py-1.5 px-3 font-black text-blue-700">{el.ifcClass}</td>
                          <td className="py-1.5 px-3 font-mono text-[11px] text-slate-500">{el.guid}</td>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">{el.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <Info className="w-4 h-4 text-slate-400" />
                Count by IfcClass, check hierarchy levels, or drop any .IFC file above.
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
