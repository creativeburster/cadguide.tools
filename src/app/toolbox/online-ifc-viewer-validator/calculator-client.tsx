'use client';

import React, { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import {
  AlertTriangle,
  Building2,
  Check,
  Copy,
  Download,
  ExternalLink,
  Info,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { getSampleIfcText } from '@/lib/open-source-cad-engines';

const SAMPLE_IFC_VALID = getSampleIfcText();

const SAMPLE_IFC_MISSING_STOREY = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('Partial IFC4 test'),'2;1');
FILE_NAME('missing_storey.ifc','2026-11-18T00:00:00',('BIM'),('CADGuide'),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPROJECT('0Proj',#2,'Demo Project',$,$,$,$,$,#3);
#20=IFCSITE('0Site',#2,'Main Site',$,$,$,$,$,.ELEMENT.,$,$,$,$,$);
#30=IFCBUILDING('0Bldg',#2,'Block A',$,$,$,$,$,.ELEMENT.,$,$,$);
#101=IFCWALL('0W1',#2,'W-01',$,$,$,$,'W1',.STANDARD.);
#102=IFCSLAB('0S1',#2,'S-01',$,$,$,$,'S1',.FLOOR.);
ENDSEC;
END-ISO-10303-21;`;

function toSafeAscii(s: string): string {
  return s.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

function validateIfcSource(sourceText: string) {
  const trimmed = sourceText.trim();
  if (!trimmed) {
    return { valid: false as const, error: 'IFC STEP source cannot be empty.' };
  }
  if (!/ISO-10303-21\s*;/i.test(trimmed)) {
    return {
      valid: false as const,
      error: 'Input does not begin with valid ISO-10303-21 STEP header.',
    };
  }

  const schemaMatch = trimmed.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i);
  const schema = schemaMatch ? schemaMatch[1] : 'UNKNOWN';
  const totalInstances = (trimmed.match(/^\s*#\d+\s*=/gm) || []).length;

  const projectCount = (trimmed.match(/=\s*IFCPROJECT\s*\(/gi) || []).length;
  const siteCount = (trimmed.match(/=\s*IFCSITE\s*\(/gi) || []).length;
  const buildingCount = (trimmed.match(/=\s*IFCBUILDING\s*\(/gi) || []).length;
  const storeyCount = (trimmed.match(/=\s*IFCBUILDINGSTOREY\s*\(/gi) || []).length;

  const wallCount = (trimmed.match(/=\s*IFCWALL(?:STANDARDCASE|ELEMENTEDCASE)?\s*\(/gi) || []).length;
  const slabCount = (trimmed.match(/=\s*IFCSLAB\s*\(/gi) || []).length;
  const columnCount = (trimmed.match(/=\s*IFCCOLUMN\s*\(/gi) || []).length;
  const beamCount = (trimmed.match(/=\s*IFCBEAM\s*\(/gi) || []).length;
  const doorCount = (trimmed.match(/=\s*IFCDOOR\s*\(/gi) || []).length;
  const windowCount = (trimmed.match(/=\s*IFCWINDOW\s*\(/gi) || []).length;
  const spaceCount = (trimmed.match(/=\s*IFCSPACE\s*\(/gi) || []).length;

  const elementTotal = wallCount + slabCount + columnCount + beamCount + doorCount + windowCount + spaceCount;
  const hierarchyChecks = [
    { entity: 'IFCPROJECT', count: projectCount, ok: projectCount >= 1 },
    { entity: 'IFCSITE', count: siteCount, ok: siteCount >= 1 },
    { entity: 'IFCBUILDING', count: buildingCount, ok: buildingCount >= 1 },
    { entity: 'IFCBUILDINGSTOREY', count: storeyCount, ok: storeyCount >= 1 },
  ];
  const passedCount = hierarchyChecks.filter((h) => h.ok).length;
  const complianceStatus = passedCount === 4 ? 'PASS' : 'WARN';

  return {
    valid: true as const,
    schema,
    totalInstances,
    elementTotal,
    hierarchyChecks,
    passedCount,
    complianceStatus,
    breakdown: [
      { label: 'IFCWALL', count: wallCount },
      { label: 'IFCSLAB', count: slabCount },
      { label: 'IFCCOLUMN', count: columnCount },
      { label: 'IFCBEAM', count: beamCount },
      { label: 'IFCDOOR', count: doorCount },
      { label: 'IFCWINDOW', count: windowCount },
      { label: 'IFCSPACE', count: spaceCount },
    ],
  };
}

export default function OnlineIfcViewerValidatorClient() {
  const [ifcText, setIfcText] = useState(SAMPLE_IFC_VALID);
  const [copied, setCopied] = useState(false);

  const report = useMemo(() => validateIfcSource(ifcText), [ifcText]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.slice(0, 6 * 1024 * 1024).text();
    setIfcText(text);
  };

  const resetDefaults = () => {
    setIfcText(SAMPLE_IFC_VALID);
  };

  const handleCopy = () => {
    if (!report.valid) return;
    const lines = [
      'IFC-SPF Schema & Spatial Hierarchy Audit Summary',
      `FILE_SCHEMA: ${report.schema} | Status: ${report.complianceStatus} (${report.passedCount}/4 spatial tiers)`,
      `Total STEP Records: ${report.totalInstances} | Core Architectural/Structural Elements: ${report.elementTotal}`,
      ...report.hierarchyChecks.map((h) => `${h.entity}: ${h.count} (${h.ok ? 'OK' : 'MISSING'})`),
    ];
    navigator.clipboard
      .writeText(lines.join('\n'))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(false);
      });
  };

  const handleDownloadCsv = () => {
    if (!report.valid) return;
    const lines = [
      'CheckOrEntity,Count,Status',
      `FILE_SCHEMA=${toSafeAscii(report.schema)},1,${report.complianceStatus}`,
      `Total STEP Records,${report.totalInstances},INFO`,
      ...report.hierarchyChecks.map((h) => `${h.entity},${h.count},${h.ok ? 'PASS' : 'MISSING'}`),
      ...report.breakdown.map((b) => `${b.label},${b.count},COUNT`),
    ];
    const blob = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ifc_spatial_audit_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-black">Browser-Local IFC-SPF Schema &amp; Spatial Audit:</span> Inspects ISO 10303-21 `.ifc` STEP headers, `FILE_SCHEMA`, mandatory `IFCPROJECT/IFCSITE/IFCBUILDING/IFCBUILDINGSTOREY` hierarchy, and entity counts locally (`0 bytes uploaded`). Full 3D B-Rep geometry viewing requires dedicated desktop BIM tools.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid="preset-valid"
          onClick={() => setIfcText(SAMPLE_IFC_VALID)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 1: Valid IFC4 Office Core (4/4 Tiers, 27 Instances)
        </button>
        <button
          type="button"
          data-testid="preset-missing-storey"
          onClick={() => setIfcText(SAMPLE_IFC_MISSING_STOREY)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:border-blue-400"
        >
          Preset 2: Missing IFCBUILDINGSTOREY Warning Case
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-slate-900">IFC-SPF Source</h2>
            <label className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              Load .ifc
              <input type="file" accept=".ifc,.txt" onChange={handleUpload} className="hidden" />
            </label>
          </div>
          <textarea
            data-testid="input-ifc"
            rows={14}
            value={ifcText}
            onChange={(e) => setIfcText(e.target.value)}
            spellCheck={false}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800"
          />
          <button
            type="button"
            data-testid="btn-reset"
            onClick={resetDefaults}
            className="w-full py-2.5 rounded-xl text-sm font-black bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Valid Sample
          </button>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-slate-900">Schema &amp; Hierarchy Validation</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="btn-copy"
                  onClick={handleCopy}
                  disabled={!report.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  type="button"
                  data-testid="btn-download-csv"
                  onClick={handleDownloadCsv}
                  disabled={!report.valid}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Audit CSV
                </button>
              </div>
            </div>

            {!report.valid ? (
              <div
                data-testid="validation-error"
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{report.error}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-xs font-bold text-blue-600 uppercase">Schema</div>
                    <div data-testid="out-schema" className="text-xl font-black text-blue-900 mt-1">{report.schema}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-slate-600 uppercase">STEP Records</div>
                    <div data-testid="out-records" className="text-xl font-black text-slate-900 mt-1">{report.totalInstances}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <div className="text-xs font-bold text-indigo-600 uppercase">Building Elements</div>
                    <div data-testid="out-elements" className="text-xl font-black text-indigo-900 mt-1">{report.elementTotal}</div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border ${
                      report.complianceStatus === 'PASS'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">Spatial Tiers</div>
                    <div data-testid="out-status" className="text-xl font-black mt-1">
                      {report.complianceStatus} ({report.passedCount}/4)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {report.hierarchyChecks.map((h) => (
                    <div
                      key={h.entity}
                      className={`p-3 rounded-xl border text-xs font-bold ${
                        h.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="font-mono">{h.entity}</div>
                      <div className="mt-1">{h.ok ? `OK (${h.count})` : 'MISSING (0)'}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  IFC-SPF is an ASCII STEP Part 21 encoding governed by ISO 16739-1 (`IFC2X3`, `IFC4`, `IFC4.3`). Standard BIM coordination expects complete spatial containment (`IFCPROJECT` -&gt; `IFCSITE` -&gt; `IFCBUILDING` -&gt; `IFCBUILDINGSTOREY`).
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://en.wikipedia.org/wiki/Industry_Foundation_Classes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  IFC / ISO 16739-1 Overview (Wikipedia) <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://en.wikipedia.org/wiki/ISO_10303-21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  STEP Part 21 (ISO 10303-21) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
