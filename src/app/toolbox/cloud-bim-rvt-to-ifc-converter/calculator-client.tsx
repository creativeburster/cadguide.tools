'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  FileCode2,
  ExternalLink,
  Download,
  RotateCcw,
  Upload,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface IfcSamplePreset {
  id: string;
  label: string;
  fileName: string;
  isBinaryRvt: boolean;
  maxProxyPct: string;
  content: string;
}

const SAMPLE_IFC4_ARCH = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');
FILE_NAME('office-core-arch.ifc','2026-11-12T09:00:00',('Architect'),('BIM Team'),'Autodesk Revit IFC','Revit','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#10=IFCPROJECT('0xScRe4m1',#2,'Office Core',$,$,$,$,(#6),#7);
#101=IFCWALL('w1',#2,'CW-01',$,$,#20,#21,'W-01',.STANDARD.);
#102=IFCWALL('w2',#2,'CW-02',$,$,#22,#23,'W-02',.STANDARD.);
#103=IFCWALL('w3',#2,'CW-03',$,$,#24,#25,'W-03',.STANDARD.);
#104=IFCWALL('w4',#2,'IW-01',$,$,#26,#27,'W-04',.MOVABLE.);
#201=IFCSLAB('s1',#2,'Floor L01',$,$,#30,#31,'S-01',.FLOOR.);
#202=IFCSLAB('s2',#2,'Roof Slab',$,$,#32,#33,'S-02',.ROOF.);
#301=IFCCOLUMN('c1',#2,'C-A1',$,$,#40,#41,'COL-01',.COLUMN.);
#302=IFCCOLUMN('c2',#2,'C-A2',$,$,#42,#43,'COL-02',.COLUMN.);
#401=IFCSPACE('sp1',#2,'101 Lobby',$,$,#50,#51,'Lobby',.ELEMENT.,.INTERNAL.,$);
#501=IFCBUILDINGELEMENTPROXY('p1',#2,'Unmapped Custom Signage',$,$,#60,#61,'PRX-01',.USERDEFINED.);
ENDSEC;
END-ISO-10303-21;`;

const SAMPLE_IFC2X3_STRUCT = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ViewDefinition [CoordinationView_V2.0]'),'2;1');
FILE_NAME('podium-frame.ifc','2026-11-12T10:30:00',('Structural Engineer'),('SE Group'),'Autodesk Revit IFC','Revit','');
FILE_SCHEMA(('IFC2X3'));
ENDSEC;
DATA;
#10=IFCPROJECT('1aBcDeFg2',#2,'Podium Frame',$,$,$,$,(#6),#7);
#101=IFCWALL('sw1',#2,'ShearWall-N',$,$,#20,#21,'SW-01');
#102=IFCWALL('sw2',#2,'ShearWall-S',$,$,#22,#23,'SW-02');
#201=IFCSLAB('sl1',#2,'Mat Foundation',$,$,#30,#31,'SL-01',.BASESLAB.);
#301=IFCCOLUMN('sc1',#2,'SC-01',$,$,#40,#41,'SC-01');
#302=IFCCOLUMN('sc2',#2,'SC-02',$,$,#42,#43,'SC-02');
#303=IFCCOLUMN('sc3',#2,'SC-03',$,$,#44,#45,'SC-03');
#501=IFCBUILDINGELEMENTPROXY('px1',#2,'Generic Gusset 1',$,$,#60,#61,.ELEMENT.);
#502=IFCBUILDINGELEMENTPROXY('px2',#2,'Generic Gusset 2',$,$,#62,#63,.ELEMENT.);
ENDSEC;
END-ISO-10303-21;`;

const PRESETS: IfcSamplePreset[] = [
  {
    id: 'ifc4-arch',
    label: 'Sample 1: IFC4 Architectural Export (10 Elements)',
    fileName: 'office-core-arch.ifc',
    isBinaryRvt: false,
    maxProxyPct: '15',
    content: SAMPLE_IFC4_ARCH,
  },
  {
    id: 'ifc2x3-struct',
    label: 'Sample 2: IFC2x3 Structural Export (8 Elements)',
    fileName: 'podium-frame.ifc',
    isBinaryRvt: false,
    maxProxyPct: '15',
    content: SAMPLE_IFC2X3_STRUCT,
  },
  {
    id: 'rvt-binary-demo',
    label: 'Sample 3: Binary .RVT OLE2 Container Check',
    fileName: 'campus-tower-2025.rvt',
    isBinaryRvt: true,
    maxProxyPct: '15',
    content: '',
  },
];

const OFFICIAL_LINKS = [
  {
    name: 'Autodesk Revit Help — Export a Model to IFC',
    url: 'https://help.autodesk.com/cloudhelp/2024/ENU/Revit-DocumentPresent/files/GUID-14037C31-EBAD-41A8-9099-E6DD65BB626E.htm',
    desc: 'Official step-by-step instructions: load your IFC mapping file, then click File tab > Export > (IFC) inside desktop Revit.',
  },
  {
    name: 'Autodesk / revit-ifc (Official Open-Source Plug-in on GitHub)',
    url: 'https://github.com/Autodesk/revit-ifc',
    desc: 'Official .NET IFC for Revit (2019+) source repository maintained by Autodesk to override and update built-in IFC export support.',
  },
  {
    name: 'buildingSMART International — Industry Foundation Classes (ISO 16739-1:2024)',
    url: 'https://www.buildingsmart.org/',
    desc: 'Standards body maintaining openBIM IFC specifications including IFC2x3 and IFC4.',
  },
];

function parseStrictNumber(raw: string): number {
  const trimmed = raw.trim();
  if (trimmed === '') return NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function countEntity(ifcText: string, entityName: string): number {
  const regex = new RegExp(`=\\s*${entityName}\\s*\\(`, 'gi');
  const matches = ifcText.match(regex);
  return matches ? matches.length : 0;
}

export default function CloudBimRvtToIfcConverterClient() {
  const [fileName, setFileName] = useState(PRESETS[0].fileName);
  const [isBinaryRvt, setIsBinaryRvt] = useState(false);
  const [ifcText, setIfcText] = useState(PRESETS[0].content);
  const [maxProxyPctStr, setMaxProxyPctStr] = useState('15');
  const [minSpaceCountStr, setMinSpaceCountStr] = useState('1');

  const applyPreset = (p: IfcSamplePreset) => {
    setFileName(p.fileName);
    setIsBinaryRvt(p.isBinaryRvt);
    setIfcText(p.content);
    setMaxProxyPctStr(p.maxProxyPct);
    setMinSpaceCountStr('1');
  };

  const resetDefaults = () => {
    applyPreset(PRESETS[0]);
  };

  const handleLocalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const headerBuf = await file.slice(0, 8).arrayBuffer();
    const bytes = new Uint8Array(headerBuf);
    // OLE2 Compound Document magic bytes: D0 CF 11 E0 A1 B1 1A E1
    const isOle2 =
      bytes.length >= 4 &&
      bytes[0] === 0xd0 &&
      bytes[1] === 0xcf &&
      bytes[2] === 0x11 &&
      bytes[3] === 0xe0;

    if (isOle2 || file.name.toLowerCase().endsWith('.rvt') || file.name.toLowerCase().endsWith('.rfa')) {
      setIsBinaryRvt(true);
      setIfcText('');
      return;
    }

    const sliceText = await file.slice(0, 2 * 1024 * 1024).text();
    setIsBinaryRvt(false);
    setIfcText(sliceText);
  };

  const audit = useMemo(() => {
    const maxProxyPct = parseStrictNumber(maxProxyPctStr);
    const minSpaces = parseStrictNumber(minSpaceCountStr);

    if (!Number.isFinite(maxProxyPct) || !Number.isFinite(minSpaces)) {
      return {
        validThreshold: false as const,
        error: 'Enter valid finite numbers for Max Proxy Ratio (%) and Minimum Required IfcSpace Count.',
      };
    }
    if (maxProxyPct < 0 || maxProxyPct > 100) {
      return {
        validThreshold: false as const,
        error: 'Max Proxy Ratio (%) must be between 0 and 100.',
      };
    }
    if (minSpaces < 0 || minSpaces > 100000 || !Number.isInteger(minSpaces)) {
      return {
        validThreshold: false as const,
        error: 'Minimum Required IfcSpace Count must be a non-negative integer (0 to 100,000).',
      };
    }

    if (isBinaryRvt) {
      return {
        validThreshold: true as const,
        binaryRvtDetected: true as const,
      };
    }

    const schemaMatch = ifcText.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
    const schema = schemaMatch ? schemaMatch[1].toUpperCase() : 'UNKNOWN';

    const walls = countEntity(ifcText, 'IFCWALL') + countEntity(ifcText, 'IFCWALLSTANDARDCASE');
    const slabs = countEntity(ifcText, 'IFCSLAB');
    const columns = countEntity(ifcText, 'IFCCOLUMN');
    const spaces = countEntity(ifcText, 'IFCSPACE');
    const proxies = countEntity(ifcText, 'IFCBUILDINGELEMENTPROXY');
    const totalTracked = walls + slabs + columns + spaces + proxies;
    const proxyPct = totalTracked > 0 ? (proxies / totalTracked) * 100 : 0;
    const passesQa = totalTracked > 0 && proxyPct <= maxProxyPct && spaces >= minSpaces;

    return {
      validThreshold: true as const,
      binaryRvtDetected: false as const,
      schema,
      walls,
      slabs,
      columns,
      spaces,
      proxies,
      totalTracked,
      proxyPct,
      passesQa,
      maxProxyPct,
      minSpaces,
    };
  }, [ifcText, isBinaryRvt, maxProxyPctStr, minSpaceCountStr]);

  const handleExportCsv = () => {
    if (!audit.validThreshold || audit.binaryRvtDetected) return;
    const rows = [
      ['Metric', 'Value', 'Notes'],
      ['Inspected File Name', fileName, 'Local browser read only (0 bytes uploaded)'],
      ['Detected FILE_SCHEMA', audit.schema, 'ISO 16739-1 openBIM Schema'],
      ['IfcWall / IfcWallStandardCase Count', String(audit.walls), ''],
      ['IfcSlab Count', String(audit.slabs), ''],
      ['IfcColumn Count', String(audit.columns), ''],
      ['IfcSpace Count', String(audit.spaces), `Min required: ${audit.minSpaces}`],
      ['IfcBuildingElementProxy Count', String(audit.proxies), 'Unmapped / generic elements'],
      ['Total Tracked Building Elements', String(audit.totalTracked), 'Walls + Slabs + Columns + Spaces + Proxies'],
      ['Proxy Element Share (%)', audit.proxyPct.toFixed(2), `Max allowed: ${audit.maxProxyPct.toFixed(2)}%`],
      ['QA Gate Status', audit.passesQa ? 'PASS' : 'REVIEW_MAPPING', ''],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ifc-schema-entity-audit.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Honest capability disclosure banner */}
      <div
        data-testid="honest-disclosure-banner"
        className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex items-start gap-4"
      >
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-sm text-amber-950">
          <h2 className="font-black text-base">
            Why Browser-Only RVT-to-IFC Conversion Is Not Possible
          </h2>
          <p className="leading-relaxed font-medium text-amber-900">
            Autodesk Revit <code>.rvt</code> files are proprietary OLE2 binary databases whose geometry is regenerated by
            Revit&apos;s internal parametric engine. This page <strong>does not convert binary RVT files in the browser</strong>{' '}
            and never uploads your model to third-party servers. Export IFC directly inside desktop Revit (
            <code>File tab &gt; Export &gt; (IFC)</code>), then use the local inspector below to verify your exported{' '}
            <code>.ifc</code> file&apos;s schema, spatial zones (<code>IfcSpace</code>), and unmapped proxy ratio before
            issuing deliverables.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
          Local Inspection Samples
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
        {/* Left: Local File & QA Threshold Inputs */}
        <div
          data-testid="calculator-inputs"
          className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Local IFC QA Inputs</h2>
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

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
              Inspect Local .IFC or .RVT File (0-Upload)
            </label>
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 text-sm font-bold text-slate-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Select Local .ifc / .rvt</span>
              <input
                type="file"
                accept=".ifc,.rvt,.rfa"
                onChange={handleLocalFile}
                className="hidden"
              />
            </label>
            <p className="text-xs text-slate-500 mt-2">
              Active buffer: <strong data-testid="active-file-name">{fileName}</strong>
            </p>
          </div>

          <div>
            <label htmlFor="ifc-max-proxy" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Max Allowed Proxy Share (%)
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Maximum acceptable percentage of <code>IfcBuildingElementProxy</code> items (typical QA target: 0–15%).
            </p>
            <input
              id="ifc-max-proxy"
              data-testid="input-max-proxy"
              type="text"
              inputMode="decimal"
              value={maxProxyPctStr}
              onChange={(e) => setMaxProxyPctStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="ifc-min-spaces" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">
              Min Required IfcSpace Count
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Set to 1+ when exporting architectural rooms/areas; set to 0 for structural-only models.
            </p>
            <input
              id="ifc-min-spaces"
              data-testid="input-min-spaces"
              type="text"
              inputMode="numeric"
              value={minSpaceCountStr}
              onChange={(e) => setMinSpaceCountStr(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Results & Official Revit Export Workflow */}
        <div data-testid="calculator-results" className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Local Schema & Entity Audit Results
              </h2>
              <button
                type="button"
                data-testid="export-csv-button"
                disabled={!audit.validThreshold || audit.binaryRvtDetected}
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export Audit CSV
              </button>
            </div>

            {!audit.validThreshold && (
              <div
                data-testid="validation-alert"
                className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-semibold"
              >
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span>{audit.error}</span>
              </div>
            )}

            {audit.validThreshold && audit.binaryRvtDetected && (
              <div
                data-testid="rvt-binary-notice"
                className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2"
              >
                <div className="font-black text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Binary Revit Container Detected (OLE2 / .RVT) — Cannot Convert in Browser
                </div>
                <p className="text-sm font-medium text-rose-900 leading-relaxed">
                  Open this model in Autodesk Revit, load your IFC class mapping table, and run{' '}
                  <code>File tab &gt; Export &gt; (IFC)</code>. Once exported, select the resulting <code>.ifc</code>{' '}
                  file here to audit its <code>FILE_SCHEMA</code> and entity counts locally.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <div className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">FILE_SCHEMA</div>
                <div className="text-2xl font-black text-blue-950" data-testid="result-schema">
                  {audit.validThreshold && !audit.binaryRvtDetected ? audit.schema : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Tracked Elements</div>
                <div className="text-2xl font-black text-slate-900" data-testid="result-total-elements">
                  {audit.validThreshold && !audit.binaryRvtDetected ? String(audit.totalTracked) : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Proxy Ratio</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-proxy-pct">
                    {audit.validThreshold && !audit.binaryRvtDetected ? audit.proxyPct.toFixed(2) : '—'}
                  </span>
                  {audit.validThreshold && !audit.binaryRvtDetected && (
                    <span className="text-sm font-bold text-slate-500 ml-1">%</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500">IfcWall</div>
                <div className="text-xl font-black text-slate-900" data-testid="result-walls">
                  {audit.validThreshold && !audit.binaryRvtDetected ? String(audit.walls) : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500">IfcSlab / IfcColumn</div>
                <div className="text-xl font-black text-slate-900" data-testid="result-slabs-columns">
                  {audit.validThreshold && !audit.binaryRvtDetected ? `${audit.slabs} / ${audit.columns}` : '—'}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-bold text-slate-500">IfcSpace / Proxy</div>
                <div className="text-xl font-black text-slate-900" data-testid="result-spaces-proxies">
                  {audit.validThreshold && !audit.binaryRvtDetected ? `${audit.spaces} / ${audit.proxies}` : '—'}
                </div>
              </div>
            </div>

            <div
              data-testid="result-qa-status"
              className={`p-4 rounded-2xl border text-sm font-bold flex items-center gap-2.5 ${
                !audit.validThreshold || audit.binaryRvtDetected
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : audit.passesQa
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {!audit.validThreshold || audit.binaryRvtDetected
                  ? 'QA Gate: —'
                  : audit.passesQa
                    ? `PASS — Proxy share (${audit.proxyPct.toFixed(2)}%) ≤ ${audit.maxProxyPct.toFixed(2)}% and IfcSpace count (${audit.spaces}) ≥ ${audit.minSpaces}.`
                    : `REVIEW MAPPING — Proxy share (${audit.proxyPct.toFixed(2)}%) vs max ${audit.maxProxyPct.toFixed(2)}%, or IfcSpace count (${audit.spaces}) vs min ${audit.minSpaces}.`}
              </span>
            </div>
          </div>

          {/* Official Revit IFC Export Steps & Links */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              Official Autodesk Revit IFC Export Procedure & Standards References
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700 font-medium leading-relaxed">
              <li>
                In Autodesk Revit, load the IFC class mapping file required by your project BIM Execution Plan before
                exporting so Revit categories map to standard <code>ISO 16739-1:2024</code> entities rather than{' '}
                <code>IfcBuildingElementProxy</code>.
              </li>
              <li>
                Click <code>File tab &gt; Export &gt; (IFC)</code>, browse to your target local folder, and select{' '}
                <code>IFC4</code> (Reference View / Design Transfer View) or <code>IFC2x3</code> (Coordination View 2.0)
                per downstream software requirements.
              </li>
              <li>
                Keep updated with the official open-source <strong>IFC for Revit (revit-ifc)</strong> add-in maintained
                by Autodesk on GitHub for Revit 2019 and later.
              </li>
            </ol>

            <div className="space-y-3 pt-2">
              {OFFICIAL_LINKS.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 font-black text-sm text-slate-900">
                    <span>{item.name}</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
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
