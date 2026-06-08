'use client';

import { useState, DragEvent, ChangeEvent } from 'react';
import { RelatedTools } from '@/components/related-tools';

interface VersionInfo {
  code: string;
  year: string;
  released: string;
  compatibility: {
    autocad: 'full' | 'partial' | 'none';
    gstarcad: 'full' | 'partial' | 'none';
    zwcad: 'full' | 'partial' | 'none';
    dwgfastview: 'full' | 'partial' | 'none';
  };
  desc: string;
}

const VERSION_MAP: Record<string, VersionInfo> = {
  AC1032: {
    code: 'AC1032',
    year: 'AutoCAD 2018 - 2027',
    released: '2018',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'The current standard DWG format. Highly optimized for performance and handles dynamic blocks and multi-core CAD engines natively.',
  },
  AC1027: {
    code: 'AC1027',
    year: 'AutoCAD 2013 - 2017',
    released: '2013',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Widely used legacy format. Excellent compatibility with virtually all modern and older alternative CAD systems.',
  },
  AC1024: {
    code: 'AC1024',
    year: 'AutoCAD 2010 - 2012',
    released: '2010',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Older DWG version. Read/write support is universally integrated into modern tools with minimal overhead.',
  },
  AC1021: {
    code: 'AC1021',
    year: 'AutoCAD 2007 - 2009',
    released: '2007',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Introduced Unicode support to DWG. Universally supported by all alternative and viewing tools.',
  },
  AC1018: {
    code: 'AC1018',
    year: 'AutoCAD 2004 - 2006',
    released: '2004',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Highly compressed format from the mid-2000s. Completely supported.',
  },
  AC1015: {
    code: 'AC1015',
    year: 'AutoCAD 2000 - 2002',
    released: '2000',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Classic CAD format. All modern CAD software can read and save back to this format for legacy system integration.',
  },
  AC1014: {
    code: 'AC1014',
    year: 'AutoCAD Release 14',
    released: '1997',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Legacy Release 14 DWG. Autodesk dropped write support in some versions, but alternatives still read it perfectly.',
  },
  AC1012: {
    code: 'AC1012',
    year: 'AutoCAD Release 13',
    released: '1994',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Extremely old layout format. Primarily used for archiving ancient blueprints.',
  },
  AC1009: {
    code: 'AC1009',
    year: 'AutoCAD Release 11 / 12',
    released: '1990',
    compatibility: {
      autocad: 'full',
      gstarcad: 'full',
      zwcad: 'full',
      dwgfastview: 'full',
    },
    desc: 'Relic DWG/DXF format from early 90s. Used for CNC machine backward-compatibility plotting.',
  },
};

export default function DwgVersionCheckerClient() {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VersionInfo | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const parseDwgHeader = (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFileName(file.name);
    
    // Format file size
    const sizeInKb = file.size / 1024;
    setFileSize(sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${sizeInKb.toFixed(1)} KB`);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer || buffer.byteLength < 6) {
          throw new Error('File is too small to be a valid DWG file.');
        }

        const bytes = new Uint8Array(buffer);
        let magic = '';
        for (let i = 0; i < 6; i++) {
          magic += String.fromCharCode(bytes[i]);
        }

        if (!magic.startsWith('AC')) {
          throw new Error('This file does not appear to be a standard AutoCAD DWG drawing. Magic header prefix is missing.');
        }

        const match = VERSION_MAP[magic];
        if (match) {
          setResult(match);
        } else {
          // If it starts with AC but we don't know the specific version code
          setResult({
            code: magic,
            year: 'Unknown / Pre-release AutoCAD',
            released: 'N/A',
            compatibility: {
              autocad: 'partial',
              gstarcad: 'partial',
              zwcad: 'partial',
              dwgfastview: 'full',
            },
            desc: `Recognized header '${magic}', but it does not map to a standard release year. It could be an export from an incompatible 3rd party CAD system or an extremely early version.`,
          });
        }
      } catch (err: unknown) {
        setError((err instanceof Error ? err.message : '') || 'An error occurred while parsing the DWG header.');
      } finally {
        setLoading(false);
      }
    };

    reader.onloadend = () => {};

    reader.onerror = () => {
      setError('Failed to read the file.');
      setLoading(false);
    };

    // Slice first 6 bytes to read fast
    const slice = file.slice(0, 6);
    reader.readAsArrayBuffer(slice);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseDwgHeader(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseDwgHeader(e.target.files[0]);
    }
  };

  const handleManualSelect = (code: string) => {
    setError(null);
    setFileName(null);
    setFileSize(null);
    setResult(VERSION_MAP[code]);
  };

  const renderBadge = (status: 'full' | 'partial' | 'none') => {
    switch (status) {
      case 'full':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            ● Read & Write (Full)
          </span>
);
      case 'partial':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
            ▲ Read Only / Viewer
          </span>
);
      case 'none':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-600 border border-rose-500/20">
            × Unsupported
          </span>
);
    }
  };

  return (
    <div className="space-y-16">
      {/* Upload/Drop Area */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[32px] blur-xl opacity-10 group-hover:opacity-20 transition duration-300"></div>
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-[32px] text-center transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-lg ${
            result ? 'min-h-[110px] p-6' : 'min-h-[320px] p-12'
          } ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50 scale-[0.99]'
              : 'border-slate-200 hover:border-blue-500/50'
          }`}
        >
          <input
            type="file"
            id="dwg-file-input"
            accept=".dwg"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {result ? (
            <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-sm font-bold text-slate-800">
                  Analyze another DWG drawing?
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Drag & drop here or <span className="text-blue-600 font-bold underline">browse files</span>. Client-side local processing.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Drag & Drop your DWG file here
              </h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm">
                Or <span className="text-blue-600 font-bold underline">browse files</span> on your device.
                Processing is 100% local — your data never leaves your browser.
              </p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                Pure client-side WebAssembly / JS
              </div>
            </>
          )}
        </div>
      </div>

      {/* Parsing Status / Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-sm text-slate-500 font-bold">Analyzing file bytes...</p>
        </div>
)}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="text-rose-600 text-2xl font-bold">⚠️</div>
          <div>
            <h4 className="font-bold text-rose-800 mb-1">Failed to analyze file</h4>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        </div>
)}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                Detected Format Header: {result.code}
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                {result.year}
              </h2>
              {fileName && (
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  File: <span className="text-slate-800 font-bold">{fileName}</span> ({fileSize})
                </p>
)}
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center md:text-right">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Released Year</div>
              <div className="text-2xl font-black text-slate-700">{result.released}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-slate-800">Format Description</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{result.desc}</p>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50">
              <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider mb-2">SEO Suggestion</h4>
              <p className="text-xs text-blue-600 leading-relaxed">
                Need to collaborate with users on different versions? Make sure to save down to <strong>AC1027 (2013 Format)</strong> if your clients run legacy AutoCAD 2014-2016 clients.
              </p>
            </div>
          </div>

          {/* Compatibility Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Software Compatibility Grid</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider">CAD Platform</th>
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider">Support Level</th>
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-4 font-bold text-slate-800">Autodesk AutoCAD (2018+)</td>
                    <td className="py-4">{renderBadge(result.compatibility.autocad)}</td>
                    <td className="py-4 text-xs text-slate-500">Native format ownership. Supports full object mapping.</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-slate-800">GstarCAD (2024+)</td>
                    <td className="py-4">{renderBadge(result.compatibility.gstarcad)}</td>
                    <td className="py-4 text-xs text-slate-500">Excellent 1:1 format compatibility, native reading and fast saving.</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-slate-800">ZWCAD (2024+)</td>
                    <td className="py-4">{renderBadge(result.compatibility.zwcad)}</td>
                    <td className="py-4 text-xs text-slate-500">Full block rendering and DWG database fidelity.</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-slate-800">DWG FastView (Mobile & Web)</td>
                    <td className="py-4">{renderBadge(result.compatibility.dwgfastview)}</td>
                    <td className="py-4 text-xs text-slate-500">Best lightweight mobile viewer for this specific layout.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
)}

      {/* Manual Selection Dropdown */}
      <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Manual Code Explorer
          </h3>
          <p className="text-xs text-slate-500">
            No drawing file handy? Manually inspect any DWG header code to test its cross-platform CAD software support matrix.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.keys(VERSION_MAP).map((code) => (
            <button
              key={code}
              onClick={() => handleManualSelect(code)}
              className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                result?.code === code
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {code} ({VERSION_MAP[code].year.split(' ')[0]})
            </button>
))}
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900">DWG Version Compatibility FAQ</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h4 className="font-bold text-slate-800 mb-2">What is a DWG magic header code?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every DWG file begins with a 6-byte ascii code (e.g. AC1032) indicating the format database version it was written in. The CAD program reads this code first to decide whether it can unpack the vector data.
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h4 className="font-bold text-slate-800 mb-2">Why can&apos;t my AutoCAD open a newer DWG?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Autodesk AutoCAD is not forward-compatible. If you run AutoCAD 2017 (AC1027), you cannot open a DWG saved in AutoCAD 2018 format (AC1032). You must convert it using a newer viewer or an alternative CAD tool.
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h4 className="font-bold text-slate-800 mb-2">Are alternative CAD tools 100% compatible?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Modern IntelliCAD and ODA-based engines (GstarCAD, ZWCAD, etc.) are native DWG systems. They can read and write standard DWG formats directly without conversion, matching Autodesk&apos;s structural fidelity.
            </p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <h4 className="font-bold text-slate-800 mb-2">Is my file safe when dragging into this page?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Yes, absolutely. We only use the local HTML5 FileReader API to read the first 6 characters in your browser. The file is never uploaded to any remote server or third-party database.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Hook */}
      <RelatedTools />
    </div>
);
}
