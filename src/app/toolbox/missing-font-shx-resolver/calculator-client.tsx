'use client';

import { useState, useMemo } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Search, Copy, Check, Download, RotateCcw, ExternalLink, FileText, Info } from 'lucide-react';

interface FontMapping {
  name: string;
  type: 'Big Font' | 'Regular SHX' | 'TrueType Font';
  suggestedAlt: string;
  explanation: string;
  fmpEntry: string;
}

const FONT_CATALOG: FontMapping[] = [
  {
    name: 'hztxt.shx',
    type: 'Big Font',
    suggestedAlt: 'bigfont.shx',
    explanation: 'Legacy single-stroke CJK Big Font in engineering drawings; map via acad.fmp or FONTALT when missing.',
    fmpEntry: 'hztxt.shx;bigfont.shx',
  },
  {
    name: 'tssdeng.shx',
    type: 'Regular SHX',
    suggestedAlt: 'simplex.shx',
    explanation: 'Structural engineering symbol font; if missing on workstation, map to AutoCAD default simplex.shx (special glyphs require original font).',
    fmpEntry: 'tssdeng.shx;simplex.shx',
  },
  {
    name: 'tssdchn.shx',
    type: 'Big Font',
    suggestedAlt: 'bigfont.shx',
    explanation: 'Structural engineering Big Font; fallback to an installed Asian Big Font or bigfont.shx via FONTALT/acad.fmp.',
    fmpEntry: 'tssdchn.shx;bigfont.shx',
  },
  {
    name: 'romanc.shx',
    type: 'Regular SHX',
    suggestedAlt: 'times.ttf',
    explanation: 'Autodesk FONTMAP documentation example mapping Roman SHX font to Times TrueType font in acad.fmp.',
    fmpEntry: 'romanc.shx;times.ttf',
  },
  {
    name: 'txt.shx',
    type: 'Regular SHX',
    suggestedAlt: 'simplex.shx',
    explanation: 'Standard AutoCAD SHX text font; pairs with bigfont.shx as the documented default pair in FONTALT.',
    fmpEntry: 'txt.shx;simplex.shx',
  },
  {
    name: 'simplex.shx',
    type: 'Regular SHX',
    suggestedAlt: 'simplex.shx',
    explanation: 'Documented initial value for the FONTALT system variable in AutoCAD.',
    fmpEntry: 'simplex.shx;simplex.shx',
  },
  {
    name: 'bigfont.shx',
    type: 'Big Font',
    suggestedAlt: 'bigfont.shx',
    explanation: 'Documented Asian Big Font filename in AutoCAD substitute fonts documentation (paired with txt.shx).',
    fmpEntry: 'bigfont.shx;bigfont.shx',
  },
];

interface PresetCase {
  id: string;
  label: string;
  query: string;
  fontAlt: string;
  rawList: string;
}

const PRESETS: PresetCase[] = [
  {
    id: 'default-cjk',
    label: 'Preset 1: Missing CJK + Symbol Fonts (4 lines)',
    query: '',
    fontAlt: 'simplex.shx',
    rawList: 'hztxt.shx\ntssdchn.shx\ntssdeng.shx\nromanc.shx',
  },
  {
    id: 'romanc-sample',
    label: 'Preset 2: Autodesk FONTMAP Sample (romanc.shx)',
    query: 'romanc',
    fontAlt: 'simplex.shx',
    rawList: 'romanc.shx',
  },
  {
    id: 'asian-pair',
    label: 'Preset 3: TXT + Big Font Pair',
    query: '',
    fontAlt: 'txt.shx,bigfont.shx',
    rawList: 'txt.shx\nbigfont.shx',
  },
];

const OFFICIAL_LINKS = [
  {
    name: 'Autodesk AutoCAD 2025 Help — FONTALT (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-858A8D84-5104-4A35-9C82-2094DF6F411D.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — FONTMAP (System Variable)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-FC45A5DC-31F5-4725-A482-C95769273C1C.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — About Substitute Fonts',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-928DF015-1E04-4CC2-AF1B-0037548DFBAE.htm',
  },
  {
    name: 'Autodesk AutoCAD 2025 Help — STYLE (Command)',
    url: 'https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-F8EA1280-BF0E-4674-ABCF-EEA0D41752D6.htm',
  },
];

function toAscii(str: string): string {
  return str.replace(/[^\x20-\x7E\r\n\t]/g, '');
}

export default function MissingFontResolverClient() {
  const [searchQuery, setSearchQuery] = useState(PRESETS[0].query);
  const [activeCategory, setActiveCategory] = useState<'all' | 'Big Font' | 'Regular SHX'>('all');
  const [fontAltVal, setFontAltVal] = useState(PRESETS[0].fontAlt);
  const [missingListRaw, setMissingListRaw] = useState(PRESETS[0].rawList);
  const [copied, setCopied] = useState(false);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FONT_CATALOG.filter((f) => {
      if (activeCategory !== 'all' && f.type !== activeCategory) return false;
      if (!q) return true;
      return f.name.toLowerCase().includes(q) || f.suggestedAlt.toLowerCase().includes(q) || f.explanation.toLowerCase().includes(q);
    });
  }, [searchQuery, activeCategory]);

  const parsedMappings = useMemo(() => {
    const cleanAlt = toAscii(fontAltVal.trim());
    const lines = missingListRaw
      .split(/\r?\n/)
      .map((l) => toAscii(l.trim()))
      .filter((l) => l.length > 0 && !l.startsWith(';'));

    if (cleanAlt === '' || lines.length === 0) {
      return { valid: false as const, lines: [] as { orig: string; target: string; fmpLine: string }[], fmpText: '', scrText: '' };
    }

    const mapped = lines.map((orig) => {
      const hit = FONT_CATALOG.find((c) => c.name.toLowerCase() === orig.toLowerCase());
      const target = hit ? hit.suggestedAlt : cleanAlt.split(',')[0].trim();
      return { orig, target, fmpLine: `${orig};${target}` };
    });

    const fmpText = toAscii(
      [
        '; AutoCAD Font Mapping Table (acad.fmp)',
        '; Format: original_font;substitute_font (semicolon delimiter per Autodesk FONTMAP spec)',
        ...mapped.map((m) => m.fmpLine),
        '',
      ].join('\r\n')
    );

    const scrText = toAscii(
      [
        '; AutoCAD Substitute Font Script (.scr)',
        `FONTALT ${cleanAlt}`,
        'REGEN',
        '',
      ].join('\r\n')
    );

    return { valid: true as const, lines: mapped, fmpText, scrText };
  }, [fontAltVal, missingListRaw]);

  const applyPreset = (p: PresetCase) => {
    setSearchQuery(p.query);
    setActiveCategory('all');
    setFontAltVal(p.fontAlt);
    setMissingListRaw(p.rawList);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!parsedMappings.valid) return;
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') return;
      await navigator.clipboard.writeText(parsedMappings.fmpText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const downloadAscii = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=us-ascii' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">FONTMAP &amp; FONTALT Setup</h2>
            <button
              type="button"
              data-testid="btn-reset"
              onClick={() => applyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`preset-${p.id}`}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="shx-fontalt" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              FONTALT Fallback Font (Default: simplex.shx)
            </label>
            <input
              id="shx-fontalt"
              type="text"
              data-testid="input-fontalt"
              value={fontAltVal}
              onChange={(e) => setFontAltVal(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="shx-list" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Missing Fonts (One Filename Per Line)
            </label>
            <textarea
              id="shx-list"
              rows={5}
              data-testid="input-missing-list"
              value={missingListRaw}
              onChange={(e) => setMissingListRaw(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono font-bold text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="shx-search" className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
              Filter Reference Catalog
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                id="shx-search"
                type="text"
                data-testid="input-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by font name..."
                className="w-full h-11 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(['all', 'Big Font', 'Regular SHX'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-testid={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                    activeCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black text-slate-900">Generated Pure-ASCII Mapping &amp; Script</h2>
              <span
                data-testid="badge-status"
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  parsedMappings.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {parsedMappings.valid ? 'READY (ASCII)' : 'AWAITING FONTALT & FONT LIST'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="text-xs font-black text-blue-500 uppercase mb-1">Parsed Missing Fonts</div>
                <div className="text-2xl font-black text-blue-900">
                  <span data-testid="result-mapped-count">{parsedMappings.valid ? parsedMappings.lines.length : '—'}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase mb-1">Catalog Matches</div>
                <div className="text-2xl font-black text-slate-900">
                  <span data-testid="result-catalog-count">{filteredCatalog.length}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="text-xs font-black text-slate-500 uppercase mb-1">Active FONTALT</div>
                <div className="text-sm font-mono font-black text-slate-900 truncate pt-1">
                  <span data-testid="result-fontalt">{parsedMappings.valid ? toAscii(fontAltVal.trim()) : '—'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-black text-slate-500 uppercase mb-1.5">acad.fmp Mapping Preview</div>
                <pre
                  data-testid="preview-fmp"
                  className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto min-h-[120px]"
                >
                  {parsedMappings.valid ? parsedMappings.fmpText : '; Enter FONTALT and at least one missing font filename.'}
                </pre>
              </div>
              <div>
                <div className="text-xs font-black text-slate-500 uppercase mb-1.5">FONTALT Script (.scr) Preview</div>
                <pre
                  data-testid="preview-scr"
                  className="p-4 rounded-2xl bg-slate-900 text-emerald-300 text-xs font-mono overflow-x-auto min-h-[120px]"
                >
                  {parsedMappings.valid ? parsedMappings.scrText : '; Enter FONTALT and at least one missing font filename.'}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                data-testid="btn-copy"
                disabled={!parsedMappings.valid}
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy acad.fmp'}</span>
              </button>
              <button
                type="button"
                data-testid="btn-download"
                disabled={!parsedMappings.valid}
                onClick={() => parsedMappings.valid && downloadAscii(parsedMappings.fmpText, 'acad.fmp')}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download acad.fmp</span>
              </button>
              <button
                type="button"
                data-testid="btn-download-scr"
                disabled={!parsedMappings.valid}
                onClick={() => parsedMappings.valid && downloadAscii(parsedMappings.scrText, 'set-fontalt.scr')}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Download .scr</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <h3 className="text-base font-black text-slate-900">Reference Font Mapping Catalog ({filteredCatalog.length})</h3>
            <div className="divide-y divide-slate-100">
              {filteredCatalog.map((item) => (
                <div key={item.name} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-slate-900 font-mono">{item.name} → {item.suggestedAlt}</div>
                    <p className="text-xs text-slate-500">{item.explanation}</p>
                  </div>
                  <code className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 shrink-0">
                    {item.fmpEntry}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-base font-black text-slate-900">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Official Autodesk AutoCAD Font Documentation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICIAL_LINKS.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 text-xs font-bold text-slate-800"
                >
                  <span>{link.name}</span>
                  <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
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
