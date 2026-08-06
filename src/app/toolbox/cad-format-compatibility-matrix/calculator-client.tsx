'use client';

import { useMemo, useState } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Settings, Zap, Info, ArrowRightLeft } from 'lucide-react';
import { tools } from '@/lib/data';
import { ToolLogo } from '@/components/tool-logo';
import Link from 'next/link';

const FORMATS = ['DWG', 'DXF', 'STEP', 'IGES', 'STL', 'IFC', 'OBJ', 'PDF', 'FBX', '3MF'];

const has = (t: (typeof tools)[number], f: string) =>
  ((t.tech_specs?.standards as string[] | undefined) ?? []).some(
    (s) => s.toUpperCase() === f.toUpperCase(),
  );

export default function CadFormatCompatibilityClient() {
  const [fmtA, setFmtA] = useState('DWG');
  const [fmtB, setFmtB] = useState('STEP');

  const result = useMemo(() => {
    const both = tools.filter((t) => has(t, fmtA) && has(t, fmtB));
    const onlyA = tools.filter((t) => has(t, fmtA) && !has(t, fmtB));
    return { both, onlyA };
  }, [fmtA, fmtB]);

  const selectCls =
    'w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-base font-bold focus:outline-none focus:ring-4 focus:ring-teal-600/5 focus:bg-white transition-all';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Pipeline</h2>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Source format</label>
            <select value={fmtA} onChange={(e) => setFmtA(e.target.value)} className={selectCls}>
              {FORMATS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-base font-black text-slate-400 uppercase tracking-wider block mb-2">Target format</label>
            <select value={fmtB} onChange={(e) => setFmtB(e.target.value)} className={selectCls}>
              {FORMATS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>Format support is taken from each vendor&apos;s published specifications in the CADGuide catalog. A tool listed here natively reads or writes the format — always confirm version-level support (e.g. STEP AP242) with the vendor.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {result.both.length} tools bridge {fmtA} → {fmtB} natively
              </h2>
            </div>
            {result.both.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium">No single tool in the catalog lists both formats. Use a two-hop pipeline via an intermediate format (e.g. DXF).</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.both.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
                    <ToolLogo slug={t.slug} src={t.logo_url} websiteUrl={t.official_url} name={t.name} className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition-colors truncate">{t.name}</div>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[9px] font-black text-teal-600 bg-teal-50 border border-teal-100 rounded px-1.5 py-0.5 uppercase">{fmtA}</span>
                        <span className="text-[9px] font-black text-teal-600 bg-teal-50 border border-teal-100 rounded px-1.5 py-0.5 uppercase">{fmtB}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
              {fmtA}-only tools ({result.onlyA.length}) — need a second hop for {fmtB}
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.onlyA.slice(0, 24).map((t) => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 hover:border-teal-200 hover:text-teal-600 rounded-xl px-3 py-2 transition-all">
                  {t.name}
                </Link>
              ))}
            </div>
          </div>

          <RelatedTools />
        </div>
      </div>
    </div>
  );
}
