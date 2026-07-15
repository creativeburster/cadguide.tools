'use client';

import { useState, useCallback } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Upload, FileBox, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

interface MeshStats {
  fileName: string;
  fileSize: number;
  fileType: 'ASCII' | 'Binary' | '';
  triangleCount: number;
  boundingBox: { min: [number, number, number]; max: [number, number, number] };
  volume: number;
  surfaceArea: number;
  edgeCount: number;
  uniqueEdges: number;
  nonManifoldEdges: number;
  isWatertight: boolean;
}

export default function STLMeshCheckerClient() {
  const [stats, setStats] = useState<MeshStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseSTL = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setStats(null);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // Detect ASCII vs Binary
      // ASCII STL starts with "solid"
      const headerStr = new TextDecoder().decode(bytes.slice(0, 5));
      const isASCII = headerStr.toLowerCase().startsWith('solid');

      let triangles: number[][] = [];

      if (isASCII) {
        const text = new TextDecoder().decode(bytes);
        const facetRegex = /facet normal\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)[\s\S]*?outer loop[\s\S]*?vertex\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)[\s\S]*?vertex\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)[\s\S]*?vertex\s+([-\d.e+]+)\s+([-\d.e+]+)\s+([-\d.e+]+)/g;
        let match;
        while ((match = facetRegex.exec(text)) !== null) {
          triangles.push([
            parseFloat(match[4]), parseFloat(match[5]), parseFloat(match[6]),
            parseFloat(match[7]), parseFloat(match[8]), parseFloat(match[9]),
            parseFloat(match[10]), parseFloat(match[11]), parseFloat(match[12]),
          ]);
        }
      } else {
        // Binary STL: 80-byte header, 4-byte triangle count, then triangles
        const view = new DataView(buffer);
        const triCount = view.getUint32(80, true);
        let offset = 84;
        for (let i = 0; i < triCount && offset + 50 <= bytes.length; i++) {
          // Skip normal (3 floats = 12 bytes)
          offset += 12;
          const v1 = [view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true)];
          offset += 12;
          const v2 = [view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true)];
          offset += 12;
          const v3 = [view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true)];
          offset += 12;
          // Skip attribute byte count
          offset += 2;
          triangles.push([...v1, ...v2, ...v3]);
        }
      }

      if (triangles.length === 0) {
        setError('No triangles found in STL file. The file may be corrupted or empty.');
        setLoading(false);
        return;
      }

      // Calculate bounding box
      let min = [Infinity, Infinity, Infinity];
      let max = [-Infinity, -Infinity, -Infinity];
      for (const t of triangles) {
        for (let i = 0; i < 3; i++) {
          const v = [t[i * 3], t[i * 3 + 1], t[i * 3 + 2]];
          for (let j = 0; j < 3; j++) {
            if (v[j] < min[j]) min[j] = v[j];
            if (v[j] > max[j]) max[j] = v[j];
          }
        }
      }

      // Calculate volume and surface area
      let volume = 0;
      let surfaceArea = 0;
      for (const t of triangles) {
        const v1 = [t[0], t[1], t[2]];
        const v2 = [t[3], t[4], t[5]];
        const v3 = [t[6], t[7], t[8]];

        // Volume via signed tetrahedron
        const cross = [
          v2[1] * v3[2] - v2[2] * v3[1],
          v2[2] * v3[0] - v2[0] * v3[2],
          v2[0] * v3[1] - v2[1] * v3[0],
        ];
        volume += (v1[0] * cross[0] + v1[1] * cross[1] + v1[2] * cross[2]) / 6;

        // Surface area via cross product
        const e1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
        const e2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
        const triCross = [
          e1[1] * e2[2] - e1[2] * e2[1],
          e1[2] * e2[0] - e1[0] * e2[2],
          e1[0] * e2[1] - e1[1] * e2[0],
        ];
        surfaceArea += Math.sqrt(triCross[0] ** 2 + triCross[1] ** 2 + triCross[2] ** 2) / 2;
      }
      volume = Math.abs(volume);

      // Edge analysis for watertightness
      const edgeMap = new Map<string, number>();
      for (const t of triangles) {
        const v1 = [t[0], t[1], t[2]];
        const v2 = [t[3], t[4], t[5]];
        const v3 = [t[6], t[7], t[8]];
        const edges = [
          [v1, v2], [v2, v3], [v3, v1],
        ];
        for (const [a, b] of edges) {
          // Sort vertices to create a canonical edge key
          const key = a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) || (a[0] === b[0] && a[1] === b[1] && a[2] < b[2])
            ? `${a[0]},${a[1]},${a[2]}|${b[0]},${b[1]},${b[2]}`
            : `${b[0]},${b[1]},${b[2]}|${a[0]},${a[1]},${a[2]}`;
          edgeMap.set(key, (edgeMap.get(key) || 0) + 1);
        }
      }

      const edgeCount = triangles.length * 3;
      const uniqueEdges = edgeMap.size;
      const nonManifoldEdges = Array.from(edgeMap.values()).filter(c => c !== 2).length;
      const isWatertight = nonManifoldEdges === 0;

      setStats({
        fileName: file.name,
        fileSize: file.size,
        fileType: isASCII ? 'ASCII' : 'Binary',
        triangleCount: triangles.length,
        boundingBox: {
          min: min as [number, number, number],
          max: max as [number, number, number],
        },
        volume,
        surfaceArea,
        edgeCount,
        uniqueEdges,
        nonManifoldEdges,
        isWatertight,
      });
    } catch (err) {
      setError(`Failed to parse STL file: ${(err as Error).message}`);
    }
    setLoading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.toLowerCase().endsWith('.stl') || file.name.toLowerCase().endsWith('.stl'))) {
      parseSTL(file);
    } else {
      setError('Please drop a .stl file.');
    }
  }, [parseSTL]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseSTL(file);
  }, [parseSTL]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onClick={() => document.getElementById('stl-file-input')?.click()}
      >
        <input id="stl-file-input" type="file" accept=".stl" className="hidden" onChange={handleFileInput} />
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-lg font-bold text-slate-600">Parsing STL file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">Drop your STL file here</p>
              <p className="text-base text-slate-500 font-medium mt-1">or click to browse • .stl files only • 100% client-side processing</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-lg font-bold text-red-700">{error}</p>
        </div>
      )}

      {stats && (
        <div className="space-y-6">
          {/* File Info */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <FileBox className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">{stats.fileName}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'File Size', value: formatSize(stats.fileSize) },
                { label: 'Format', value: stats.fileType },
                { label: 'Triangles', value: stats.triangleCount.toLocaleString() },
                { label: 'Unique Edges', value: stats.uniqueEdges.toLocaleString() },
              ].map(item => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bounding Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Bounding Box (mm)</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['X', 'Y', 'Z'] as const).map((axis, i) => {
                const size = stats.boundingBox.max[i] - stats.boundingBox.min[i];
                return (
                  <div key={axis} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">{axis}-Axis</p>
                    <p className="text-xl font-black text-slate-900">{size.toFixed(2)}<span className="text-base text-slate-400 font-bold ml-1">mm</span></p>
                    <p className="text-sm text-slate-400 mt-1 font-medium">{stats.boundingBox.min[i].toFixed(2)} to {stats.boundingBox.max[i].toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Volume & Surface Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Mesh Volume</p>
              <p className="text-3xl font-black text-blue-600">{stats.volume.toFixed(2)}<span className="text-lg font-bold ml-2 text-slate-400">mm³</span></p>
              <p className="text-base text-slate-500 mt-2 font-medium">{(stats.volume / 1000).toFixed(2)} cm³</p>
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Surface Area</p>
              <p className="text-3xl font-black text-emerald-600">{stats.surfaceArea.toFixed(2)}<span className="text-lg font-bold ml-2 text-slate-400">mm²</span></p>
              <p className="text-base text-slate-500 mt-2 font-medium">{(stats.surfaceArea / 100).toFixed(2)} cm²</p>
            </div>
          </div>

          {/* Watertightness Check */}
          <div className={`rounded-3xl border-2 p-8 ${stats.isWatertight ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stats.isWatertight ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
                {stats.isWatertight ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <p className={`text-lg font-black ${stats.isWatertight ? 'text-emerald-700' : 'text-red-700'}`}>
                  {stats.isWatertight ? 'Mesh is Watertight ✓' : 'Mesh is NOT Watertight'}
                </p>
                <p className="text-base text-slate-500 font-medium mt-1">
                  {stats.isWatertight
                    ? 'All edges are shared by exactly 2 triangles. Safe for 3D printing.'
                    : `${stats.nonManifoldEdges} non-manifold edges found (edges shared by ≠ 2 triangles). Fix before 3D printing.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <RelatedTools compact />
    </div>
  );
}
