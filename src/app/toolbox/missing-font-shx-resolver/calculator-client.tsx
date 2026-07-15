'use client';

import { useState } from 'react';
import { RelatedTools } from '@/components/related-tools';

interface FontMapping {
  name: string;
  source: string;
  type: 'SHX Chinese large font' | 'SHX Western normal font' | 'SHX Symbols and Rebar Fonts' | 'TrueType Operating System Fonts';
  suggestedAlt: string;
  explanation: string;
  command: string; // FONTALT assignment command
  fmpEntry: string; // Mapping entry for acad.fmp
}

const SHX_FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is the difference between a question mark (?) and garbled text?',
    answer:
      'A question mark (?) means the CAD engine cannot find the SHX font specified in your Fonts folder, or its mapping rules cannot match special symbols. Garbled text means the code page (Codepage) or font style (Style) declared inside the drawing conflicts during parsing — for example using a Western font to force-parse a double-byte Chinese big font.',
  },
  {
    question: 'Can I download font packages online and import them?',
    answer:
      'It is strongly discouraged to download multi-gigabyte "full CAD font packages" from the internet. They contain many duplicate, damaged and redundant fonts that can crash CAD startup speed, break coordinate snapping, and may even bundle macro trojans. Configuring targeted FONTALT alternate mappings on demand is the standard enterprise IT practice.',
  },
  {
    question: 'How do I configure Big Font and a Western regular font in CAD?',
    answer:
      'The AutoCAD text style (STYLE) allows a combined mount: the left "SHX font" box handles English letters and numbers (e.g. simplex.shx); after checking "Use Big Font", the right "Big Font" box handles CJK characters (e.g. gbcbig.shx). Drawings only restore correctly when both are configured.',
  },
  {
    question: 'Why can Tianzheng or Structure Explorer auto-detect the fonts?',
    answer:
      'These customized CAD secondary-development kits add their dedicated Fonts folders to AutoCAD\'s Support File Search Path automatically. To view such drawings in vanilla CAD, copy and add their Fonts paths to your local CAD options search path.',
  },
];

const FONTS_REGISTRY: FontMapping[] = [
  {
    name: 'HZTXT',
    source: 'The most classic single-line Chinese imitation Song font in China',
    type: 'SHX Chinese large font',
    suggestedAlt: 'hztxt.shx or gbcbig.shx',
    explanation: 'HZTXT It is a Chinese font widely circulated in major domestic design institutes in the early days. It is often used for filling in multi-line text and single-line forms.. If it is missing locally, without special symbols, Use the national standard large font that comes with AutoCAD by default (gbcbig.shx) Substitution can 100% avoid garbled characters. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'hztxt;gbcbig.shx',
  },
  {
    name: 'TSSDENG',
    source: 'Explorer Structural Design Software (TSSD) Spanish Symbol Font',
    type: 'SHX Symbols and Rebar Fonts',
    suggestedAlt: 'tssdeng.shx (It is recommended to copy from an older version of Explorer or use the standard symbol library)',
    explanation: 'The Explorer series fonts have built-in a large number of special symbols for steel bars (such as first-grade steel, Class II steel, Class III steel symbol, The corresponding characters are %%130 - %%133). If used directly simplex.shx Instead, the rebar symbol will become a blank or question mark. Must be replaced by tssdeng.shx that supports the corresponding encoding. ',
    command: '(setvar "FONTALT" "tssdeng.shx")',
    fmpEntry: 'tssdeng;gbcbig.shx', // fall back if tssdeng is not installed
  },
  {
    name: 'TSSDCHN',
    source: 'Explorer Structural Design Software (TSSD) Chinese large font',
    type: 'SHX Chinese large font',
    suggestedAlt: 'gbcbig.shx or tssdchn.shx',
    explanation: 'This is the structural typesetting Chinese font of Explorer software. If Explorer is not installed locally, You can directly point the backup large font to the national standard large font gbcbig.shx. The font width and height are very close., Typesetting overflow almost never occurs. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tssdchn;gbcbig.shx',
  },
  {
    name: 'TCH',
    source: 'Tangent early Chinese font',
    type: 'SHX Chinese large font',
    suggestedAlt: 'gbcbig.shx or ttxt2.shx',
    explanation: 'Old drawings exported by Tianzheng Construction often contain this large font. When running in Tianzheng software, it will be replaced normally., However, when opening the drawing in ordinary AutoCAD, it will report missing. Can be directly mapped to gbcbig.shx, with good character alignment accuracy. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'tch;gbcbig.shx',
  },
  {
    name: 'CHINA',
    source: 'Early Architectural Design Institute customized version of Chinese imitation Song Dynasty large font',
    type: 'SHX Chinese large font',
    suggestedAlt: 'gbcbig.shx',
    explanation: 'This was from the 1990s to 2000 At the beginning of the year, many provinces established customized CAD fonts.. It has been basically merged by gbcbig.shx. Just point it to gbcbig.shx directly in the configuration file or alternative font options. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'china;gbcbig.shx',
  },
  {
    name: 'CASS',
    source: 'Southern Surveying and Mapping CASS terrain and feature symbols large font',
    type: 'SHX Symbols and Rebar Fonts',
    suggestedAlt: 'cass.shx or simplex.shx',
    explanation: 'Used for geographical information and engineering survey terrain contour marking. Contains specific compasses, Depth point, control elevation symbol. If CASS is not installed locally, it can be directly mapped to an ordinary simplex.shx to view the main text, but some mapping element symbols may display abnormally. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'cass;simplex.shx',
  },
  {
    name: 'HZDX',
    source: 'Early domestic pinyin initials in Chinese large font',
    type: 'SHX Chinese large font',
    suggestedAlt: 'hztxt.shx or gbcbig.shx',
    explanation: 'One of the earliest single-line Chinese character large fonts in China, with simple strokes, Renders quickly. Directly mapped to modern large fonts hztxt.shx You can recreate the perfect silhouette. ',
    command: '(setvar "FONTALT" "hztxt.shx")',
    fmpEntry: 'hzdx;hztxt.shx',
  },
  {
    name: 'BIGFONT',
    source: 'Universal Chinese font virtual large placeholder',
    type: 'SHX Chinese large font',
    suggestedAlt: 'gbcbig.shx',
    explanation: 'In some drawings of foreign companies or joint venture projects, due to differences in drawing specifications, Directly name the Chinese font category BIGFONT. Directly replace it with AutoCAD The default national standard font gbcbig.shx is enough. ',
    command: '(setvar "FONTALT" "gbcbig.shx")',
    fmpEntry: 'bigfont;gbcbig.shx',
  },
  {
    name: 'TXT',
    source: 'AutoCAD Native and simplest line Western font',
    type: 'SHX Western normal font',
    suggestedAlt: 'txt.shx or gbenor.shx',
    explanation: 'AutoCAD The Western single-line body that comes with it from the beginning. Due to the lack of arc fitting, All spliced by polylines (extremely fast rendering, but a little stiff). All CAD The platform comes with it by default, if the prompt is missing, Usually the current CAD installation path Fonts The directory has been cleaned, copy it back txt.shx That\'s it. ',
    command: '(setvar "FONTALT" "txt.shx")',
    fmpEntry: 'txt;txt.shx',
  },
  {
    name: 'SIMPLEX',
    source: 'AutoCAD Standard arc fitting single line Western font',
    type: 'SHX Western normal font',
    suggestedAlt: 'simplex.shx or gbenor.shx',
    explanation: 'Compared with txt.shx, simplex optimizes arc rendering, The appearance is more sleek and beautiful, and it is currently the recommended Western and digital annotation font in domestic two-dimensional engineering drawings.. When it is missing locally, you can replace it with one click AutoCAD The default alternative is Spanish. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'simplex;simplex.shx',
  },
  {
    name: 'ROMANS',
    source: 'Roman single line fine Spanish font',
    type: 'SHX Western normal font',
    suggestedAlt: 'romans.shx or simplex.shx',
    explanation: 'It is mainly used for high-definition letter annotation on precision machinery manufacturing drawings and general floor plans. Compared with simplex The line width is more uniform and maps to simplex.shx It can ensure that the typesetting width remains unchanged. ',
    command: '(setvar "FONTALT" "simplex.shx")',
    fmpEntry: 'romans;simplex.shx',
  },
  {
    name: 'COMPLEX',
    source: 'AutoCAD Early two-line Western font',
    type: 'SHX Western normal font',
    suggestedAlt: 'complex.shx or romans.shx',
    explanation: 'A double-lined Western text with a certain stroke thickness. Used for the title of the drawing., Can be downgraded and replaced by a normal single-line body to improve the system scaling rendering frame rate. ',
    command: '(setvar "FONTALT" "romans.shx")',
    fmpEntry: 'complex;romans.shx',
  },
  {
    name: 'FS',
    source: 'Windows The operating system comes with TrueType imitation Song Dynasty',
    type: 'SHX Chinese large font',
    suggestedAlt: 'Imitation Song_GB2312 (Windows TTF)',
    explanation: 'Some designers directly quoted the faux Song font that comes with the Windows system. (imitationsong.ttf) . This is available in a partially offline or lite version Windows On professional servers, an error will be reported due to the lack of the system font. It is recommended to copy back the corresponding imitation Song font in the control panel._GB2312 Font package. ',
    command: 'N/A (It is recommended to copy the system fonts to C:\\Windows\\Fonts)',
    fmpEntry: 'fs;Imitation Song_GB2312',
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
      (activeCategory === 'chinese' && font.type === 'SHX Chinese large font') ||
      (activeCategory === 'western' && font.type === 'SHX Western normal font') ||
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
            ✏️ Chinese large font ({FONTS_REGISTRY.filter(f => f.type === 'SHX Chinese large font').length})
          </button>
          <button
            onClick={() => setActiveCategory('western')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'western'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🔤 Western normal font ({FONTS_REGISTRY.filter(f => f.type === 'SHX Western normal font').length})
          </button>
          <button
            onClick={() => setActiveCategory('symbol')}
            className={`px-4 py-2 rounded-xl text-base font-black border transition-all ${
              activeCategory === 'symbol'
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🎯 symbol/reinforcement body ({FONTS_REGISTRY.filter(f => f.type === 'SHX Symbols and Rebar Fonts').length})
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
                    Copy the `(setvar &quot;FONTALT&quot; &quot;gbcbig.shx&quot;)` command on the left above. Paste directly into the CAD command line and press Enter key. This specifies the fallback for the default missing font to be GB large font. 
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm">
                  2
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">Perform a rebuild to refresh the viewport</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    Enter at the CAD command line `REGEN` and press Enter. The system will recompile and render the full image text., At this time, all question marks (?) will be gbcbig Substitute and render normally. 
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-black flex-shrink-0 text-sm">
                  3
                </span>
                <div>
                  <h5 className="font-bold text-slate-100 print:text-slate-800">Permanent solution: Configuration acad.fmp</h5>
                  <p className="text-slate-400 print:text-slate-500 mt-0.5">
                    If you want to fix the missing specific font once and for all (such as opening tssdchn Always automatically map without popping up every time), you can copy the above right acad.fmp Configuration items. Pass CAD `OP` Options ➔ File ➔ Text Editor ➔ Font Map File Find the corresponding path and edit it `.fmp` file and paste the mapping relationship into the bottom of it and save it. 
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
              AutoCAD The built-in default includes `gbcbig.shx` (Chinese large font), `hztxt.shx` (Classic Chinese fonts) and `simplex.shx` (Single-line Spanish fonts). These fonts have extremely high versatility and safety factor.. 
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
            <h4 className="font-bold text-slate-800 mb-2 text-lg">What is the difference between a question mark (?) and garbled text?? </h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              * **Question mark (?)** represents CAD The engine cannot find the drawing specified in your Fonts folder. SHX The font, or its mapping rules cannot match special symbols; 
              * **Scrambled Text** represents the code page specified inside the drawing (Codepage) or font style (Style) resolution conflict, For example, use Western fonts to force parsing of double-byte Chinese large fonts. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">Can I download font packages online and import them? </h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              It is highly not recommended to download batches of several gigabytes from the Internet in batches.&quot;CADFull font package&quot;. This type of package contains a large number of duplicate names, Damaged and redundant fonts, prone to triggering CAD Startup speed plummets, coordinate capture fails, Even bundled with macro Trojans. Targeted configuration on demand FONTALT Alternate mapping is the standard specification for enterprise IT operations. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">Big Font and Spanish regular font in CAD How to configure it? </h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              AutoCAD The text style (STYLE) allows combined mounting: &quot;SHX font on the left&quot;The box is responsible for English letters and numbers (such as simplex.shx) ; Check &quot;Use large fonts&quot;&quot;rear, right&quot;The large font &quot;box is responsible for Chinese, Japanese and Korean characters (Such as gbcbig.shx). Only if both are configured correctly, The drawings can be restored correctly. 
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 print:border-slate-300">
            <h4 className="font-bold text-slate-800 mb-2 text-lg">Why can Tianzheng Software or Structure Explorer automatically identify it? </h4>
            <p className="text-base text-slate-500 leading-relaxed font-medium">
              These customized CAD secondary development kits will be installed with their dedicated Fonts Folders are automatically added to AutoCAD&apos;s&quot;Support File Search Path &quot;Medium. To view in bare CAD, Just copy and add their Fonts paths to your local CAD within the options search path. 
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <RelatedTools />
    </div>
);
}
