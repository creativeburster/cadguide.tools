'use client';

import { useState, useCallback } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Upload, FileBox, AlertTriangle, Loader, Info } from 'lucide-react';

interface STEPHeader {
  fileName: string;
  fileSize: number;
  description: string;
  implementationLevel: string;
  name: string;
  timeStamp: string;
  author: string[];
  organization: string[];
  preprocessorVersion: string;
  originatingSystem: string;
  authorization: string;
  schema: string[];
  schemaPretty: string;
}

const AP_NAMES: Record<string, string> = {
  'AP203': 'Configuration Controlled Design (2D/3D Mechanical Parts)',
  'AP203_IS': 'Configuration Controlled Design (ISO 10303-203)',
  'AP214': 'Core Data for Automotive Mechanical Design Processes',
  'AP214_IS': 'Core Data for Automotive Mechanical Design (ISO 10303-214)',
  'AP242': 'Managed Model Based 3D Engineering (latest standard)',
  'AP242_IS': 'Managed Model Based 3D Engineering (ISO 10303-242)',
};

export default function STEPParserClient() {
  const [header, setHeader] = useState<STEPHeader | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseSTEP = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setHeader(null);

    try {
      // Only read first 8KB for header (HEADER section is always at the top)
      const slice = file.slice(0, 8192);
      const text = await slice.text();

      // Extract HEADER section between HEADER; and ENDSEC;
      const headerMatch = text.match(/HEADER;\s*([\s\S]*?)\s*ENDSEC;/);
      if (!headerMatch) {
        setError('No HEADER section found. This may not be a valid STEP (ISO 10303) file.');
        setLoading(false);
        return;
      }

      const headerContent = headerMatch[1];

      // Parse FILE_DESCRIPTION
      const descMatch = headerContent.match(/FILE_DESCRIPTION\s*\(([\s\S]*?)\)\s*;/);
      let description = '';
      let implementationLevel = '';
      if (descMatch) {
        const descInner = descMatch[1];
        const descStr = descInner.match(/'([^']*)'/);
        if (descStr) description = descStr[1];
        const implStr = descInner.match(/'[^']*'\s*,\s*'([^']*)'/);
        if (implStr) implementationLevel = implStr[1];
      }

      // Parse FILE_NAME
      const nameMatch = headerContent.match(/FILE_NAME\s*\(([\s\S]*?)\)\s*;/);
      let name = '';
      let timeStamp = '';
      let author: string[] = [];
      let organization: string[] = [];
      let preprocessorVersion = '';
      let originatingSystem = '';
      let authorization = '';

      if (nameMatch) {
        const parts = nameMatch[1];
        // Extract all quoted strings
        const strings = parts.match(/'[^']*'/g) || [];
        if (strings.length > 0) name = strings[0]?.replace(/'/g, '') || '';
        if (strings.length > 1) timeStamp = strings[1]?.replace(/'/g, '') || '';
        if (strings.length > 2) author = strings.slice(2, strings.length - 3).map(s => s.replace(/'/g, ''));
        if (strings.length > 2) organization = [strings[strings.length - 3]?.replace(/'/g, '') || ''];
        if (strings.length > 3) preprocessorVersion = strings[strings.length - 2]?.replace(/'/g, '') || '';
        if (strings.length > 4) originatingSystem = strings[strings.length - 1]?.replace(/'/g, '') || '';
        // authorization is the last unquoted item, harder to parse
        const authMatch = parts.match(/'[^']*'\s*,\s*'[^']*'\s*,\s*\(([^)]*)\)\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*'[^']*'\s*,\s*'([^']*)'/);
        if (authMatch) authorization = authMatch[2];
      }

      // Parse FILE_SCHEMA
      const schemaMatch = headerContent.match(/FILE_SCHEMA\s*\(([\s\S]*?)\)\s*;/);
      let schema: string[] = [];
      let schemaPretty = '';
      if (schemaMatch) {
        const schemaStrs = schemaMatch[1].match(/'[^']*'/g) || [];
        schema = schemaStrs.map(s => s.replace(/'/g, ''));
        schemaPretty = schema.map(s => AP_NAMES[s] || s).join(' — ');
      }

      setHeader({
        fileName: file.name,
        fileSize: file.size,
        description,
        implementationLevel,
        name,
        timeStamp,
        author,
        organization,
        preprocessorVersion,
        originatingSystem,
        authorization,
        schema,
        schemaPretty,
      });
    } catch (err) {
      setError(`Failed to parse STEP file: ${(err as Error).message}`);
    }
    setLoading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.toLowerCase().endsWith('.step') || file.name.toLowerCase().endsWith('.stp'))) {
      parseSTEP(file);
    } else {
      setError('Please drop a .step or .stp file.');
    }
  }, [parseSTEP]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseSTEP(file);
  }, [parseSTEP]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onClick={() => document.getElementById('step-file-input')?.click()}
      >
        <input id="step-file-input" type="file" accept=".step,.stp" className="hidden" onChange={handleFileInput} />
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-sm font-bold text-slate-600">Parsing STEP header...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">Drop your STEP file here</p>
              <p className="text-xs text-slate-500 font-medium mt-1">or click to browse • .step / .stp files • Only header is read, no upload</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      {header && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileBox className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{header.fileName}</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">{formatSize(header.fileSize)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'File Name (internal)', value: header.name || '—' },
                { label: 'Timestamp', value: header.timeStamp || '—' },
                { label: 'Author', value: header.author.join(', ') || '—' },
                { label: 'Organization', value: header.organization.join(', ') || '—' },
                { label: 'Preprocessor Version', value: header.preprocessorVersion || '—' },
                { label: 'Originating System', value: header.originatingSystem || '—' },
                { label: 'Authorization', value: header.authorization || '—' },
                { label: 'Implementation Level', value: header.implementationLevel || '—' },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-900 break-all">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Schema / AP Protocol */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">ISO 10303 Application Protocol</h3>
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <p className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">FILE_SCHEMA</p>
              <p className="text-2xl font-black">{header.schema.join(', ') || 'Unknown'}</p>
              <p className="text-xs mt-2 opacity-80 font-medium">{header.schemaPretty || 'Unknown protocol'}</p>
            </div>
          </div>

          {/* Description */}
          {header.description && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-4">FILE_DESCRIPTION</h3>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{header.description}</p>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Only the first 8 KB of the file was read to extract the ISO 10303 HEADER section. The DATA section (geometry, topology, product structure) was not parsed. Your file was never uploaded to any server.
            </p>
          </div>
        </div>
      )}

      <RelatedTools compact />
    </div>
  );
}
