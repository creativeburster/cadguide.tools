'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';

interface FontMapping {
  name: string;
  source: string;
  type: 'SHX Big Font (CJK)' | 'SHX Regular Font (Western)' | 'SHX Symbols and Rebar Fonts' | 'TrueType Operating System Fonts';
  suggestedAlt: string;
  explanation: string;
  command: string; // FONTALT assignment command
  fmpEntry: string; // Mapping entry for acad.fmp
}

const SHX_FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is the difference between a question mark (?) and garbled text?',
    answer:
      'A question mark (?) means the CAD engine cannot find the SHX font file in your Support Fonts folder, or its mapping rules cannot match special symbols. Garbled text means the code page (Codepage) or font style conflicts during parsing — for example using a Western single-byte font to parse a double-byte CJK Big Font.',
  },
  {
    question: 'Can I download full font packages online and import them?',
    answer:
      'It is strongly discouraged to download multi-gigabyte "full CAD font packages" from unverified websites. They contain duplicate, corrupted, and redundant fonts that slow down CAD startup, break snap points, and can bundle macro viruses. Configuring targeted FONTALT alternate mappings on demand is standard enterprise IT best practice.',
  },
  {
    question: 'How do I configure Big Font and a Western regular font together in AutoCAD?',
    answer:
      'In AutoCAD Text Style dialog (STYLE), configure combined fonts: the left "SHX Font" dropdown handles alphanumeric characters (e.g. simplex.shx); check "Use Big Font", then select your CJK double-byte font in the right "Big Font" dropdown (e.g. gbcbig.shx). Both must be set for drawings to display correctly.',
  },
  {
    question: 'Why do specialized architectural or structural add-ons auto-detect fonts?',
    answer:
      'These CAD add-ons automatically register their dedicated Fonts directory to AutoCAD Support File Search Path during installation. To view their drawings in vanilla AutoCAD, add their Fonts folder to your Support File Search Path in Options.',
  },
];

const FONTS_REGISTRY: FontMapping[] = [
  {
    name: 'HZTXT',
    source: 'Classic single-line CJK imitation Song font widely used in engineering',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'hztxt.shx or gbcbig.shx',
    explanation: 'HZTXT is a legacy Chinese big font commonly used in engineering drawings and tabular forms. If missing locally, mapping to AutoCAD default national standard font gbcbig.shx completely resolves missing character prompts.',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'hztxt;gbcbig.shx',
  },
  {
    name: 'TSSDENG',
    source: 'Structural Engineering (TSSD) Special Symbols & Rebar Font',
    type: 'SHX Symbols and Rebar Fonts',
    suggestedAlt: 'tssdeng.shx (or standard structural symbol font)',
    explanation: 'Contains proprietary reinforcement symbols (e.g. Grade I, II, III rebar glyphs mapped to %%130-%%133). Replacing with vanilla simplex.shx will cause rebar symbols to appear blank or as question marks. Must be mapped to tssdeng.shx or a compatible rebar font.',
    command: '(setvar "FONTALT" "tssdeng.shx")',
    fmpEntry: 'tssdeng;gbcbig.shx',
  },
  {
    name: 'TSSDCHN',
    source: 'Structural Engineering (TSSD) Chinese Big Font',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'gbcbig.shx or tssdchn.shx',
    explanation: 'Structural typesetting font for civil engineering. If missing, map directly to gbcbig.shx; aspect ratios and line heights match closely, avoiding annotation overlap.',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tssdchn;gbcbig.shx',
  },
  {
    name: 'TCH',
    source: 'Architectural CJK Big Font',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'gbcbig.shx or ttxt2.shx',
    explanation: 'Drawings exported by architectural suites often declare this font. When opened in vanilla AutoCAD without the plugin, it triggers missing font prompts. Maps cleanly to gbcbig.shx.',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tch;gbcbig.shx',
  },
  {
    name: 'CHINA',
    source: 'Legacy architectural institute CJK Big Font',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'gbcbig.shx',
    explanation: 'Legacy CJK Big Font widely used in 1990s and 2000s CAD drawings. Standardized and superseded by gbcbig.shx in modern workflows.',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'china;gbcbig.shx',
  },
  {
    name: 'CASS',
    source: 'Civil Surveying CASS Terrain & Feature Symbol Font',
    type: 'SHX Symbols and Rebar Fonts',
    suggestedAlt: 'cass.shx or simplex.shx',
    explanation: 'Used for GIS and surveying contour mapping, elevation marks, and feature symbols. If CASS is not installed locally, mapping to simplex.shx allows reading alphanumeric labels, though custom topographic symbols may not render.',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'cass;simplex.shx',
  },
  {
    name: 'HZDX',
    source: 'Legacy single-line CJK Big Font',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'hztxt.shx or gbcbig.shx',
    explanation: 'Lightweight single-line CJK big font designed for fast vector redraw. Maps cleanly to hztxt.shx or gbcbig.shx.',
    command: '(setvar "FONTALT" "hztxt.shx")',
    fmpEntry: 'hzdx;hztxt.shx',
  },
  {
    name: 'BIGFONT',
    source: 'Universal CJK Big Font placeholder',
    type: 'SHX Big Font (CJK)',
    suggestedAlt: 'gbcbig.shx',
    explanation: 'Used as a generic Big Font style declaration in international drawings. Map directly to AutoCAD standard gbcbig.shx.',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'bigfont;gbcbig.shx',
  },
  {
    name: 'TXT',
    source: 'AutoCAD native un-smoothed single-line Western font',
    type: 'SHX Regular Font (Western)',
    suggestedAlt: 'txt.shx or gbenor.shx',
    explanation: 'The original AutoCAD un-smoothed vector font composed of segmented polylines. Ships with all AutoCAD installations. If missing, copy txt.shx into your AutoCAD Fonts folder.',
    command: '(setvar "FONTALT" "txt.shx")',
    fmpEntry: 'txt;txt.shx',
  },
  {
    name: 'SIMPLEX',
    source: 'AutoCAD standard smooth single-line Western font',
    type: 'SHX Regular Font (Western)',
    suggestedAlt: 'simplex.shx or gbenor.shx',
    explanation: 'Industry standard single-line Western font with arc-smoothed glyphs. Recommended for all alphanumeric engineering dimensions and annotations.',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'simplex;simplex.shx',
  },
  {
    name: 'ROMANS',
    source: 'Roman single-line precision Western font',
    type: 'SHX Regular Font (Western)',
    suggestedAlt: 'romans.shx or simplex.shx',
    explanation: 'High-clarity proportional Western font used in mechanical detailing and architectural floor plans. Character widths match simplex.shx.',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'romans;simplex.shx',
  },
  {
    name: 'COMPLEX',
    source: 'AutoCAD multi-stroke Western display font',
    type: 'SHX Regular Font (Western)',
    suggestedAlt: 'complex.shx or romans.shx',
    explanation: 'Double-stroke Western font used for drawing title blocks. Can be mapped to romans.shx to speed up pan and zoom rendering.',
    command: '(setvar "FONTALT" "romans.shx")',
    fmpEntry: 'complex;romans.shx',
  },
  {
    name: 'FS',
    source: 'Windows Operating System TrueType Font (FangSong)',
    type: 'TrueType Operating System Fonts',
    suggestedAlt: 'FangSong / FangSong_GB2312 (Windows TTF)',
    explanation: 'Referenced when CAD drawings call system TrueType fonts. If missing on headless or minimal Windows installations, install the standard TrueType font package into C:\\Windows\\Fonts.',
    command: 'N/A (Copy TrueType font file to C:\\Windows\\Fonts)',
    fmpEntry: 'fs;FangSong',
  }
];

export default function MissingFontResolverClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'chinese' | 'western' | 'symbol'>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedFmpIndex, setCopiedFmpIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number, isFmp: boolean) => {
    navigator.clipboard.writeText(text);
    if (isFmp) {
      setCopiedFmpIndex(index);
      setTimeout(() => setCopiedFmpIndex(null), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Filtering Logic
  const filteredFonts = FONTS_REGISTRY.filter((font) => {
    const matchesSearch = font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.source.includes(searchQuery) ||
      font.suggestedAlt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'chinese' && font.type === 'SHX Big Font (CJK)') ||
      (activeCategory === 'western' && font.type === 'SHX Regular Font (Western)') ||
      (activeCategory === 'symbol' && font.type === 'SHX Symbols and Rebar Fonts');

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      
      {/* Search & Filter Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 print:hidden">
        <div className="relative max-w-lg">
          <input
            type="text"
            placeholder="Enter the missing font file name (e.g.: hztxt, tssdeng, tch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-6 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 select-none pointer-events-none">
            🔍
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            📋 All fonts ({FONTS_REGISTRY.length})
          </button>
          <button
            onClick={() => setActiveCategory('chinese')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'chinese'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            ✏️ Big Font CJK ({FONTS_REGISTRY.filter(f => f.type === 'SHX Big Font (CJK)').length})
          </button>
          <button
            onClick={() => setActiveCategory('western')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'western'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🔤 Regular Western ({FONTS_REGISTRY.filter(f => f.type === 'SHX Regular Font (Western)').length})
          </button>
          <button
            onClick={() => setActiveCategory('symbol')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'symbol'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🎯 Symbols & Rebar ({FONTS_REGISTRY.filter(f => f.type === 'SHX Symbols and Rebar Fonts').length})
          </button>
        </div>
      </div>

      {/* Main Grid: Info Area & Steps */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Results Cards List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900">
              List of matching results ({filteredFonts.length})
            </h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-base text-blue-600 font-bold underline hover:text-blue-700"
              >
                Clear search criteria
              </button>
)}
          </div>

          {filteredFonts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-500">
              <span className="text-3xl block mb-2">❓</span>
              <p className="text-lg font-bold">No related font name was matched. </p>
              <p className="text-base text-slate-400 mt-1">You can try typing the main letters of the font (e.g.: Abbreviate hztxt2.shx as hztxt Search) . </p>
            </div>
) : (
            <div className="space-y-6">
              {filteredFonts.map((font, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-100 p-6 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 print:border-slate-300 print:shadow-none"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-lg font-black text-slate-800 tracking-tight">
                          {font.name}.SHX
                        </h4>
                        <span className="text-sm font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 uppercase tracking-widest">
                          {font.type}
                        </span>
                      </div>
                      <p className="text-base text-slate-400 font-bold">
                        Background: {font.source}
                      </p>
                    </div>
                  </div>

                  {/* Body & Alt Suggested */}
                  <div className="grid md:grid-cols-3 gap-6 bg-slate-50/50 border border-slate-100/50 rounded-2xl p-4 print:bg-white print:border-slate-300">
                    <div className="md:col-span-2 space-y-2">
                      <h5 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                        Substitution Principles and Guidelines
                      </h5>
                      <p className="text-base text-slate-500 leading-relaxed font-semibold">
                        {font.explanation}
                      </p>
                    </div>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-50/50 print:bg-white print:border-slate-200">
                      <h5 className="text-sm font-black text-blue-800 uppercase tracking-widest mb-1">
                        Optimal security substitution
                      </h5>
                      <p className="text-base font-black text-blue-600">
                        {font.suggestedAlt}
                      </p>
                    </div>
                  </div>

                  {/* Copy Commands (hidden during print) */}
                  <div className="grid md:grid-cols-2 gap-4 pt-2 print:hidden">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                          AutoLISP Alternate instructions (executed directly from the command line) 
                        </span>
                        {font.command !== 'N/A' && (
                          <button
                            onClick={() => handleCopy(font.command, idx, false)}
                            className="text-sm text-blue-600 font-bold underline hover:text-blue-700"
                          >
                            {copiedIndex === idx ? '✓ Copied ' : 'Copy command'}
                          </button>
)}
                      </div>
                      <div className="bg-slate-900 text-slate-300 text-[11px] font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-800 overflow-x-auto select-all">
                        {font.command}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                          acad.fmp Map configuration items (write configuration files) 
                        </span>
                        <button
                          onClick={() => handleCopy(font.fmpEntry, idx, true)}
                          className="text-sm text-blue-600 font-bold underline hover:text-blue-700"
                        >
                          {copiedFmpIndex === idx ? '✓ Copied' : 'Copy configuration'}
                        </button>
                      </div>
                      <div className="bg-slate-900 text-slate-300 text-[11px] font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-800 overflow-x-auto select-all">
                        {font.fmpEntry}
                      </div>
                    </div>
                  </div>

                </div>
))}
            </div>
)}
        </div>

        {/* Right Sidebar: Guide & Steps */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800/50 space-y-6 print:bg-white print:border-slate-300 print:text-slate-900">
            <h3 className="text-lg font-black tracking-tight text-white print:text-slate-900">
              💡 Three-step method for quick repair (How to Fix)
            </h3>
            
            <ol className="space-y-4 text-base leading-relaxed font-semibold">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm">
                  1
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">Set alternate default font</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    Copy the `(setvar &quot;FONTALT&quot; &quot;gbcbig.shx&quot;)` command above. Paste directly into the AutoCAD command line and press Enter. This designates gbcbig.shx as the fallback font whenever a requested SHX file is not found.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm">
                  2
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">Regenerate viewport to refresh text</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    Type `REGEN` and press Enter. AutoCAD will recompile and redraw all text entities, replacing question marks (?) with standard legible glyphs.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm">
                  3
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">Permanent solution: Configure acad.fmp</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    To automate mapping permanently, add font entries to your `acad.fmp` file. In AutoCAD, open Options (`OP`) ➔ Files ➔ Text Editor, Dictionary, and Font File Names ➔ Font Mapping File, locate your `.fmp` file, and append the mapping lines to the bottom.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 print:border-slate-300">
            <h4 className="text-base font-black text-slate-400 uppercase tracking-widest">
              Standard Fonts Package
            </h4>
            <p className="text-base text-slate-500 leading-relaxed font-semibold">
              AutoCAD natively includes `gbcbig.shx` (CJK Big Font), `hztxt.shx` (Classic CJK font), and `simplex.shx` (Single-line Western font). These standard fonts offer universal compatibility across all workstations.
            </p>
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: SHX_FAQS.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: { '@type': 'Answer', text: faq.answer },
              })),
            }),
          }}
        />
        <h3 className="text-2xl font-black text-slate-900">Troubleshooting missing fonts and garbled characters (SHX Font FAQ)</h3>
        <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">What is the difference between a question mark (?) and garbled text?</h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              * **Question mark (?)**: The CAD engine cannot locate the specified SHX font in your search paths, or the font lacks specific glyphs or symbols.<br />
              * **Garbled text**: Indicates an encoding or code page conflict (e.g. attempting to parse double-byte CJK text using a single-byte Western font).
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">Can I download full font packs online and import them?</h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              We strongly advise against downloading massive multi-gigabyte font packs from third-party sites. They often contain corrupted fonts, duplicate files that degrade AutoCAD startup speed, and potential security risks. Using targeted FONTALT or acad.fmp mappings is the recommended practice.
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">How to configure Big Font and Western fonts together?</h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              In AutoCAD's Text Style dialog (`STYLE`), configure paired fonts: select a regular Western font on the left (e.g. `simplex.shx`), check "Use Big Font", then choose your CJK Big Font on the right (e.g. `gbcbig.shx`).
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">Why do vertical CAD add-ons find their fonts automatically?</h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              Specialized civil, structural, and architectural suites automatically append their custom font directories to the AutoCAD Support File Search Path. To open their drawings in standard AutoCAD, simply add their Fonts folder to your Support Search Paths in Options.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <RelatedTools />
    </div>
);
}
