'use client';

import { useState, useRef } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { FileCode2, Upload, RotateCcw, Copy, Download, Check, AlertTriangle } from 'lucide-react';

const INT0_RE = /^\d+$/;

function parseNonNegInt(raw: string): number | null {
  const t = raw.trim();
  if (!INT0_RE.test(t)) return null;
  const v = Number(t);
  return Number.isInteger(v) && v >= 0 ? v : null;
}

const DEFAULT_IFC_SAMPLE = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView_V2.0]'),'2;1');
FILE_NAME('sample_office.ifc','2026-01-15T10:00:00',('Architect'),('BIM Studio'),'IfcEngine','CAD Export','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPROJECT('0G2x9A',#2,'Office Annex',$,$,$,$,(#10),#11);
#2=IFCSITE('1K8p2B',#2,'Site A',$,$,#12,$,$,.ELEMENT.,$,$,$,$,$);
#3=IFCBUILDING('2M4q8C',#2,'Main Block',$,$,#13,$,$,.ELEMENT.,$,$,$);
#4=IFCBUILDINGSTOREY('3P1r7D',#2,'Level 01',$,$,#14,$,$,.ELEMENT.,0.0);
#5=IFCWALLSTANDARDCASE('4A101',#2,'Exterior Wall North',$,$,#20,#21,'W-01');
#6=IFCWALLSTANDARDCASE('4A102',#2,'Exterior Wall South',$,$,#22,#23,'W-02');
#7=IFCWALLSTANDARDCASE('4A103',#2,'Core Partition',$,$,#24,#25,'W-03');
#8=IFCSLAB('5B201',#2,'Ground Slab S1',$,$,#30,#31,'S-01',.FLOOR.);
#9=IFCDOOR('6C301',#2,'Entry Door D1',$,$,#40,#41,'D-01',2100.,1000.);
#10=IFCDOOR('6C302',#2,'Office Door D2',$,$,#42,#43,'D-02',2100.,900.);
#11=IFCWINDOW('7D401',#2,'Facade Glazing W1',$,$,#50,#51,'GL-01',1500.,1800.);
#12=IFCWINDOW('7D402',#2,'Facade Glazing W2',$,$,#52,#53,'GL-02',1500.,1800.);
ENDSEC;
END-ISO-10303-21;`;

const STRUCTURAL_IFC_SAMPLE = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');
FILE_NAME('steel_bay.ifc','2026-01-16T09:00:00',('StructEng'),('FrameWorks'),'IfcOpenShell','','');
FILE_SCHEMA(('IFC4X3_ADD2'));
ENDSEC;
DATA;
#1=IFCPROJECT('1001',#2,'Steel Frame Bay',$,$,$,$,$,$);
#2=IFCSITE('1002',#2,'Plant North',$,$,$,$,$,.ELEMENT.,$,$,$,$,$);
#3=IFCBUILDING('1003',#2,'Warehouse Bay',$,$,$,$,$,.ELEMENT.,$,$,$);
#4=IFCBUILDINGSTOREY('1004',#2,'Ground Elevation',$,$,$,$,$,.ELEMENT.,0.);
#10=IFCCOLUMN('2001',#2,'Column C1',$,$,$,$,'COL-A1');
#11=IFCCOLUMN('2002',#2,'Column C2',$,$,$,$,'COL-A2');
#12=IFCBEAM('3001',#2,'Girder B1',$,$,$,$,'BM-01');
#13=IFCBEAM('3002',#2,'Girder B2',$,$,$,$,'BM-02');
#14=IFCFOOTING('4001',#2,'Pad Footing F1',$,$,$,$,'FTG-1',.PAD_FOOTING.);
ENDSEC;
END-ISO-10303-21;`;

const ARCHITECTURAL_TINY_IFC = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');
FILE_NAME('pavilion.ifc','2026-01-17T12:00:00',('Studio'),('BIM'),'Export','','');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;
DATA;
#1=IFCPROJECT('A1',#2,'Pavilion',$,$,$,$,$,$);
#2=IFCSITE('A2',#2,'Park',$,$,$,$,$,.ELEMENT.,$,$,$,$,$);
#3=IFCBUILDING('A3',#2,'Pavilion Shell',$,$,$,$,$,.ELEMENT.,$,$,$);
#4=IFCWALL('A4',#2,'Brick Wall',$,$,$,$,'BW-1');
#5=IFCROOF('A5',#2,'Timber Roof',$,$,$,$,'RF-1',.FLAT_ROOF.);
#6=IFCDOOR('A6',#2,'Main Entry',$,$,$,$,'DR-1',2200.,1200.);
ENDSEC;
END-ISO-10303-21;`;

interface EntityStats {
  schemaVersion: string;
  totalEntities: number;
  uniqueClasses: number;
  spatialHierarchyCount: number;
  counts: { name: string; count: number }[];
}

function parseIfcEntities(text: string): EntityStats {
  const schemaMatch = text.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
  const schemaVersion = schemaMatch ? schemaMatch[1] : 'UNKNOWN';

  const countMap = new Map<string, number>();
  const entityRegex = /^#\d+\s*=\s*(IFC[A-Z0-9_]+)\s*\(/gim;
  let match: RegExpExecArray | null;
  let totalEntities = 0;

  while ((match = entityRegex.exec(text)) !== null) {
    const cls = match[1].toUpperCase();
    totalEntities += 1;
    countMap.set(cls, (countMap.get(cls) ?? 0) + 1);
  }

  const spatialKeys = ['IFCPROJECT', 'IFCSITE', 'IFCBUILDING', 'IFCBUILDINGSTOREY'];
  let spatialHierarchyCount = 0;
  for (const k of spatialKeys) {
    if ((countMap.get(k) ?? 0) > 0) spatialHierarchyCount += 1;
  }

  const counts = Array.from(countMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    schemaVersion,
    totalEntities,
    uniqueClasses: counts.length,
    spatialHierarchyCount,
    counts,
  };
}

export default function IfcEntityCounterClient() {
  const [ifcText, setIfcText] = useState(DEFAULT_IFC_SAMPLE);
  const [filterStr, setFilterStr] = useState('');
  const [minCountStr, setMinCountStr] = useState('1');
  const [copied, setCopied] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const minCount = parseNonNegInt(minCountStr);
  const hasIfcText = ifcText.trim().length > 0;
  const parsed = hasIfcText ? parseIfcEntities(ifcText) : null;
  const isValid = parsed !== null && parsed.totalEntities > 0 && minCount !== null;

  const filteredCounts =
    parsed && minCount !== null
      ? parsed.counts.filter(
          item =>
            item.count >= minCount &&
            (filterStr.trim() === '' || item.name.toLowerCase().includes(filterStr.trim().toLowerCase()))
        )
      : [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      setFileError('File exceeds 15 MB browser limit.');
      return;
    }
    setFileError(null);
    const content = await file.text();
    setIfcText(content);
  };

  const handleReset = () => {
    setIfcText(DEFAULT_IFC_SAMPLE);
    setFilterStr('');
    setMinCountStr('1');
    setFileError(null);
  };

  const handleCopy = async () => {
    if (!isValid || !parsed) return;
    const summary = [
      `IFC Entity Summary (Schema: ${parsed.schemaVersion})`,
      `Total Entities: ${parsed.totalEntities}`,
      `Unique Classes: ${parsed.uniqueClasses}`,
      `Spatial Levels Present: ${parsed.spatialHierarchyCount}/4`,
      ...filteredCounts.map(c => `${c.name}: ${c.count}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!isValid || !parsed) return;
    const rows = [
      ['ifc_class', 'count', 'schema'],
      ...filteredCounts.map(c => [c.name, String(c.count), parsed.schemaVersion]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ifc-entity-counts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">STEP / IFC Input</h2>
          </div>

          <div>
            <div className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Quick Sample Models</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="preset-office-ifc"
                onClick={() => {
                  setIfcText(DEFAULT_IFC_SAMPLE);
                  setFileError(null);
                }}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Office Annex (12 IFC4 Entities)
              </button>
              <button
                type="button"
                data-testid="preset-structural-ifc"
                onClick={() => {
                  setIfcText(STRUCTURAL_IFC_SAMPLE);
                  setFileError(null);
                }}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Steel Frame Bay (9 IFC4X3 Entities)
              </button>
              <button
                type="button"
                data-testid="preset-pavilion-ifc"
                onClick={() => {
                  setIfcText(ARCHITECTURAL_TINY_IFC);
                  setFileError(null);
                }}
                className="text-left px-3 py-2 rounded-xl text-sm font-bold bg-slate-50 hover:bg-indigo-50 text-slate-700 border border-slate-200 transition-colors"
              >
                Timber Pavilion (6 IFC2X3 Entities)
              </button>
            </div>
          </div>

          <input ref={fileRef} type="file" accept=".ifc,.stp,.step,.txt" onChange={handleFileUpload} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 text-sm font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" /> Upload Local .IFC File
          </button>
          {fileError && <div className="text-xs font-bold text-red-600">{fileError}</div>}

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">
              Minimum Entity Count Filter
            </label>
            <input
              type="text"
              inputMode="numeric"
              data-testid="input-min-count"
              value={minCountStr}
              onChange={e => setMinCountStr(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">
              Class Name Filter (e.g. WALL, DOOR)
            </label>
            <input
              type="text"
              data-testid="input-filter"
              value={filterStr}
              onChange={e => setFilterStr(e.target.value)}
              placeholder="All classes..."
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500 uppercase tracking-wider block mb-1">
              Raw STEP / IFC Text
            </label>
            <textarea
              data-testid="input-ifc-text"
              value={ifcText}
              onChange={e => setIfcText(e.target.value)}
              rows={6}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {!isValid && (
            <div data-testid="validation-error" className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Provide valid ISO 10303-21 #id=IFC... entity lines and a non-negative integer threshold (&ge; 0).</span>
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
              className="flex-1 py-2.5 px-3 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-1.5"
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
              <Download className="w-4 h-4" /> Export Entity CSV
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Parsed Entity Breakdown</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                <div className="text-xs font-black text-indigo-500 uppercase tracking-wider mb-1">Total Entities</div>
                <div className="text-3xl font-black text-indigo-900">
                  <span data-testid="result-total">{isValid && parsed ? parsed.totalEntities : '—'}</span>
                </div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase tracking-wider mb-1">Unique Classes</div>
                <div className="text-3xl font-black text-blue-900">
                  <span data-testid="result-unique">{isValid && parsed ? parsed.uniqueClasses : '—'}</span>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Spatial Levels</div>
                <div className="text-3xl font-black text-emerald-900">
                  <span data-testid="result-spatial">{isValid && parsed ? `${parsed.spatialHierarchyCount}/4` : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">IFC Schema</div>
                <div className="text-xl font-black text-slate-900 mt-1">
                  <span data-testid="result-schema">{isValid && parsed ? parsed.schemaVersion : '—'}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-black uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">IFC Entity Class</th>
                    <th className="px-4 py-3 text-right">Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCounts.map(row => (
                    <tr key={row.name} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono font-bold text-slate-800">{row.name}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-indigo-700">{row.count}</td>
                    </tr>
                  ))}
                  {filteredCounts.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-slate-400 font-medium">
                        No matching entities for current filter settings.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
