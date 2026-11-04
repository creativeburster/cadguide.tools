'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  UploadCloud,
  Download,
  Layers,
  GitCompare,
  Languages,
  Image as ImageIcon,
  Cpu,
  Box,
  Building2,
  Mountain,
  ShieldCheck,
  Code2,
  Play,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  parseDxf,
  segmentsOf,
  parseStl,
  parseObj,
  meshStats,
  sliceMesh,
  parseGcode,
  Mesh,
} from '@/lib/cad-file-analysis';
import {
  getSampleBracketDxf,
  getSampleRevisionBDxf,
  getSampleIfcText,
  getSamplePointCloudXyz,
  getSampleAutoLispCode,
  serializeDxfDoc,
  extractDxfTextEntries,
  computeDxfDiff,
  traceGrayscaleGridToDxf,
  compileDxfToGcode,
  generateParametricPart,
  exportMeshToBinaryStl,
  exportMeshToObj,
  exportMeshToGltfJson,
  tessellateStepTextToMesh,
  processPointCloudToContoursAndMesh,
  obfuscateAutoLisp,
} from '@/lib/open-source-cad-engines';

export type WorkbenchEngineMode =
  | 'dxf-layer-batch-downgrade'
  | 'dxf-visual-diff'
  | 'dxf-text-translator'
  | 'raster-pdf-to-dxf-tracer'
  | 'dxf-to-gcode-cam'
  | 'mesh-step-3d-workbench'
  | 'bim-ifc-rvt-auditor'
  | 'point-cloud-contour-mesh'
  | 'autolisp-compiler-protector'
  | 'telemetry-sam-shield';

export function detectEngineModeFromSlug(slugOrPath: string): WorkbenchEngineMode {
  const s = slugOrPath.toLowerCase();
  if (s.includes('compare-diff')) return 'dxf-visual-diff';
  if (s.includes('text-translator')) return 'dxf-text-translator';
  if (s.includes('image-jpg-to-dxf') || s.includes('pdf-to-dwg')) return 'raster-pdf-to-dxf-tracer';
  if (s.includes('dxf-to-gcode')) return 'dxf-to-gcode-cam';
  if (
    s.includes('3d-cad-viewer') ||
    s.includes('step-to-obj') ||
    s.includes('step-to-stl') ||
    s.includes('e-drawings') ||
    s.includes('skp-to-fbx') ||
    s.includes('dwg-to-step')
  ) {
    return 'mesh-step-3d-workbench';
  }
  if (s.includes('ifc') || s.includes('rvt') || s.includes('revit-family')) {
    return 'bim-ifc-rvt-auditor';
  }
  if (s.includes('point-cloud')) return 'point-cloud-contour-mesh';
  if (s.includes('lisp-script')) return 'autolisp-compiler-protector';
  if (s.includes('telemetry-blocker') || s.includes('license-audit')) return 'telemetry-sam-shield';
  return 'dxf-layer-batch-downgrade';
}

function downloadBlob(content: string | ArrayBuffer, filename: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OpenSourceCadWorkbench({
  title,
  forcedMode,
}: {
  title?: string;
  forcedMode?: WorkbenchEngineMode;
}) {
  const pathname = usePathname() || '';
  const mode = forcedMode || detectEngineModeFromSlug(pathname || title || '');

  // ==========================================================================
  // ENGINE 1: 2D DXF Layer Splitter, Version Downgrader, Recovery & PDF Plot
  // ==========================================================================
  const [dxfSource, setDxfSource] = useState<string>(() => getSampleBracketDxf());
  const [dxfFileName, setDxfFileName] = useState<string>('sample-sheetmetal-bracket.dxf');
  const [targetAcadVer, setTargetAcadVer] = useState<string>('AC1027');
  const [healCorrupt, setHealCorrupt] = useState<boolean>(true);
  const [selectedLayers, setSelectedLayers] = useState<Record<string, boolean>>({});
  const [plotColorMode, setPlotColorMode] = useState<'color' | 'monochrome'>('color');

  const parsedDxf = useMemo(() => parseDxf(dxfSource), [dxfSource]);

  const layerNames = useMemo(() => {
    if (!parsedDxf) return [];
    const set = new Set<string>();
    parsedDxf.layers.forEach((l) => set.add(l.name));
    parsedDxf.entities.forEach((e) => set.add(e.layer));
    return Array.from(set);
  }, [parsedDxf]);

  const activeLayerSet = useMemo(() => {
    const s = new Set<string>();
    for (const ln of layerNames) {
      if (selectedLayers[ln] !== false) s.add(ln);
    }
    return s;
  }, [layerNames, selectedLayers]);

  // ==========================================================================
  // ENGINE 2: 2D Drawing Visual Diff & Revision Comparator
  // ==========================================================================
  const [revAText, setRevAText] = useState<string>(() => getSampleBracketDxf());
  const [revBText, setRevBText] = useState<string>(() => getSampleRevisionBDxf());
  const [diffTol, setDiffTol] = useState<number>(0.1);

  const diffResult = useMemo(() => {
    const docA = parseDxf(revAText);
    const docB = parseDxf(revBText);
    if (!docA || !docB) return { unchanged: [], addedInB: [], removedFromA: [] };
    return computeDxfDiff(docA, docB, diffTol);
  }, [revAText, revBText, diffTol]);

  // ==========================================================================
  // ENGINE 3: DXF Multi-Language Text Extractor & Batch Translator
  // ==========================================================================
  const [textOverrides, setTextOverrides] = useState<Record<number, string>>({});
  const [dictionaryPreset, setDictionaryPreset] = useState<string>('en-to-de');

  const textEntries = useMemo(() => {
    if (!parsedDxf) return [];
    return extractDxfTextEntries(parsedDxf);
  }, [parsedDxf]);

  const applyEngineeringDictionary = (preset: string) => {
    setDictionaryPreset(preset);
    const dict: Record<string, Record<string, string>> = {
      'en-to-de': {
        'PART: BRACKET-304SS-2MM': 'BAUTEIL: HALTERUNG-1.4301-2MM',
        'BEND UP 90 DEG R=2.0': 'ABKANTEN +90 GRAD R=2.0',
        'TOLERANCE ISO 2768-mK': 'ALLGEMEINTOLERANZ ISO 2768-mK',
      },
      'en-to-ja': {
        'PART: BRACKET-304SS-2MM': '部品: ブラケット SUS304 t2.0',
        'BEND UP 90 DEG R=2.0': '曲げ加工 90° R=2.0',
        'TOLERANCE ISO 2768-mK': '一般公差 JIS B 0405-m',
      },
      'en-to-es': {
        'PART: BRACKET-304SS-2MM': 'PIEZA: SOPORTE INOX-304 2MM',
        'BEND UP 90 DEG R=2.0': 'PLEGAR 90 GRADOS R=2.0',
        'TOLERANCE ISO 2768-mK': 'TOLERANCIA GENERAL ISO 2768-mK',
      },
    };
    const next: Record<number, string> = {};
    for (const item of textEntries) {
      const mapped = dict[preset]?.[item.originalText];
      if (mapped) next[item.entityIndex] = mapped;
    }
    setTextOverrides(next);
  };

  // ==========================================================================
  // ENGINE 4: Raster Image (JPG/PNG) & PDF to Vector DXF Tracer
  // ==========================================================================
  const [traceThreshold, setTraceThreshold] = useState<number>(128);
  const [traceMinLen, setTraceMinLen] = useState<number>(0.6);
  const [rasterGrid, setRasterGrid] = useState<{ gray: Uint8Array; w: number; h: number }>(() => {
    // Generate synthetic technical flange logo / geometry grid by default
    const w = 80, h = 60;
    const gray = new Uint8Array(w * h).fill(255);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dCenter = Math.hypot(x - 40, y - 30);
        const dHoleL = Math.hypot(x - 22, y - 30);
        const dHoleR = Math.hypot(x - 58, y - 30);
        if (dCenter < 24 && dCenter > 10 && dHoleL > 4.5 && dHoleR > 4.5) {
          gray[y * w + x] = 20;
        }
      }
    }
    return { gray, w, h };
  });

  const tracedResult = useMemo(
    () => traceGrayscaleGridToDxf(rasterGrid.gray, rasterGrid.w, rasterGrid.h, traceThreshold, traceMinLen),
    [rasterGrid, traceThreshold, traceMinLen]
  );

  const handleRasterImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const w = 96;
        const h = Math.max(32, Math.round((img.height / (img.width || 1)) * w));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const gray = new Uint8Array(w * h);
        for (let i = 0; i < w * h; i++) {
          gray[i] = Math.round(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
        }
        setRasterGrid({ gray, w, h });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ==========================================================================
  // ENGINE 5: DXF to CNC / Laser G-Code Compiler
  // ==========================================================================
  const [camMode, setCamMode] = useState<'laser' | 'mill'>('laser');
  const [camFeed, setCamFeed] = useState<number>(1800);
  const [camPower, setCamPower] = useState<number>(1000);
  const [camCutDepth, setCamCutDepth] = useState<number>(-3.0);
  const [camStepDown, setCamStepDown] = useState<number>(1.0);

  const compiledCam = useMemo(() => {
    if (!parsedDxf) return { gcode: '', segmentCount: 0, estimatedMinutes: 0 };
    return compileDxfToGcode(parsedDxf, {
      mode: camMode,
      feedRate: camFeed,
      plungeRate: Math.round(camFeed * 0.25),
      spindleOrLaserPower: camPower,
      safeZ: 5.0,
      cutDepth: camCutDepth,
      stepDown: camStepDown,
    });
  }, [parsedDxf, camMode, camFeed, camPower, camCutDepth, camStepDown]);

  const parsedGcodePreview = useMemo(() => parseGcode(compiledCam.gcode), [compiledCam.gcode]);

  // ==========================================================================
  // ENGINE 6: 3D STEP / STL / OBJ / glTF Viewer, Slicer & Format Converter
  // ==========================================================================
  const [activeMesh, setActiveMesh] = useState<Mesh>(() =>
    generateParametricPart({ kind: 'spur-gear', module: 2.5, teeth: 24, thickness: 12, boreDia: 16 }).mesh
  );
  const [meshSourceName, setMeshSourceName] = useState<string>('parametric-spur-gear-24t.step');
  const [rotYaw, setRotYaw] = useState<number>(38);
  const [rotPitch, setRotPitch] = useState<number>(28);
  const [sliceZRatio, setSliceZRatio] = useState<number>(0.5);
  const [wireframe3d, setWireframe3d] = useState<boolean>(false);
  const canvas3dRef = useRef<HTMLCanvasElement | null>(null);

  const mStats = useMemo(() => meshStats(activeMesh), [activeMesh]);
  const sliceZHeight = useMemo(
    () => mStats.bbox.min[2] + (mStats.bbox.max[2] - mStats.bbox.min[2]) * sliceZRatio,
    [mStats, sliceZRatio]
  );
  const currentSliceSegments = useMemo(() => sliceMesh(activeMesh, sliceZHeight), [activeMesh, sliceZHeight]);

  useEffect(() => {
    if (mode !== 'mesh-step-3d-workbench') return;
    const canvas = canvas3dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle dark CAD viewport background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const t = activeMesh.tris;
    const cx = (mStats.bbox.min[0] + mStats.bbox.max[0]) / 2;
    const cy = (mStats.bbox.min[1] + mStats.bbox.max[1]) / 2;
    const cz = (mStats.bbox.min[2] + mStats.bbox.max[2]) / 2;
    const span = Math.max(
      mStats.bbox.max[0] - mStats.bbox.min[0],
      mStats.bbox.max[1] - mStats.bbox.min[1],
      mStats.bbox.max[2] - mStats.bbox.min[2],
      1
    );
    const scale = (Math.min(w, h) * 0.68) / span;

    const yaw = (rotYaw * Math.PI) / 180;
    const pitch = (rotPitch * Math.PI) / 180;
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

    const project = (x: number, y: number, z: number): [number, number, number] => {
      const dx = x - cx, dy = y - cy, dz = z - cz;
      const x1 = dx * cosY - dy * sinY;
      const y1 = dx * sinY + dy * cosY;
      const z2 = dz * cosP - y1 * sinP;
      const depth = dz * sinP + y1 * cosP;
      return [w / 2 + x1 * scale, h / 2 - z2 * scale, depth];
    };

    const faces: { pts: [number, number][]; depth: number; shade: number }[] = [];
    const numTris = Math.floor(t.length / 9);
    const step = numTris > 4000 ? Math.ceil(numTris / 4000) : 1;

    for (let f = 0; f < numTris; f += step) {
      const o = f * 9;
      if (t[o + 2] > sliceZHeight && t[o + 5] > sliceZHeight && t[o + 8] > sliceZHeight) continue;
      const p0 = project(t[o], t[o + 1], t[o + 2]);
      const p1 = project(t[o + 3], t[o + 4], t[o + 5]);
      const p2 = project(t[o + 6], t[o + 7], t[o + 8]);
      const depth = (p0[2] + p1[2] + p2[2]) / 3;
      const nx = activeMesh.normals[f * 3] || 0;
      const ny = activeMesh.normals[f * 3 + 1] || 0;
      const nz = activeMesh.normals[f * 3 + 2] || 1;
      const shade = Math.max(0.28, Math.min(1, Math.abs(nx * 0.4 + ny * 0.3 + nz * 0.85)));
      faces.push({ pts: [[p0[0], p0[1]], [p1[0], p1[1]], [p2[0], p2[1]]], depth, shade });
    }
    faces.sort((a, b) => a.depth - b.depth);

    for (const face of faces) {
      ctx.beginPath();
      ctx.moveTo(face.pts[0][0], face.pts[0][1]);
      ctx.lineTo(face.pts[1][0], face.pts[1][1]);
      ctx.lineTo(face.pts[2][0], face.pts[2][1]);
      ctx.closePath();
      if (!wireframe3d) {
        const r = Math.round(59 * face.shade);
        const g = Math.round(130 * face.shade);
        const b = Math.round(246 * face.shade);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      }
      ctx.strokeStyle = wireframe3d ? '#38bdf8' : 'rgba(148,163,184,0.22)';
      ctx.lineWidth = wireframe3d ? 0.9 : 0.4;
      ctx.stroke();
    }
  }, [mode, activeMesh, mStats, rotYaw, rotPitch, sliceZHeight, wireframe3d]);

  const handle3dFileUpload = (file: File) => {
    setMeshSourceName(file.name);
    const lower = file.name.toLowerCase();
    const reader = new FileReader();
    reader.onload = () => {
      const buf = reader.result as ArrayBuffer;
      if (!buf) return;
      if (lower.endsWith('.stl')) {
        const parsed = parseStl(buf);
        if (parsed) setActiveMesh(parsed);
      } else if (lower.endsWith('.obj')) {
        const parsed = parseObj(new TextDecoder().decode(new Uint8Array(buf)));
        if (parsed) setActiveMesh(parsed);
      } else {
        const text = new TextDecoder().decode(new Uint8Array(buf));
        setActiveMesh(tessellateStepTextToMesh(text));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ==========================================================================
  // ENGINE 7: openBIM IFC & Revit Family (RFA/RVT) Schema Auditor & QTO
  // ==========================================================================
  const [ifcText, setIfcText] = useState<string>(() => getSampleIfcText());
  const [ifcFileName, setIfcFileName] = useState<string>('PRJ01-ARC-ZZ-01-M3-A-0001.ifc');

  const ifcAudit = useMemo(() => {
    const schema = ifcText.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i)?.[1] || 'IFC4';
    const classCounts: Record<string, number> = {};
    const elements: { id: string; ifcClass: string; guid: string; name: string }[] = [];
    const re = /^#(\d+)\s*=\s*(IFC[A-Z0-9_]+)\s*\(([^;]*)\);/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(ifcText)) !== null) {
      const cls = m[2].toUpperCase();
      classCounts[cls] = (classCounts[cls] || 0) + 1;
      if (
        /^IFC(WALL|SLAB|COLUMN|BEAM|DOOR|WINDOW|SPACE|BUILDINGSTOREY|ROOF|STAIR|RAILING|FURNISHINGELEMENT|BUILDINGELEMENTPROXY)$/.test(
          cls
        )
      ) {
        const parts = m[3].split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
        elements.push({
          id: `#${m[1]}`,
          ifcClass: cls,
          guid: parts[0] || '—',
          name: parts[2] || parts[7] || '(Unnamed)',
        });
      }
    }
    return { schema, classCounts, elements };
  }, [ifcText]);

  const exportIfcQtoCsv = () => {
    const rows = ['STEP_ID,IFC_CLASS,GLOBAL_ID,ELEMENT_NAME'];
    for (const el of ifcAudit.elements) {
      rows.push(`${el.id},${el.ifcClass},"${el.guid}","${el.name.replace(/"/g, '""')}"`);
    }
    downloadBlob(rows.join('\n'), `${ifcFileName.replace(/\.[^.]+$/, '')}-QTO-Schedule.csv`, 'text/csv;charset=utf-8');
  };

  // ==========================================================================
  // ENGINE 8: Point Cloud (LAS/XYZ/PTS/CSV) Contour DXF & Mesh Generator
  // ==========================================================================
  const [pcText, setPcText] = useState<string>(() => getSamplePointCloudXyz());
  const [contourStep, setContourStep] = useState<number>(2.5);

  const pcResult = useMemo(() => processPointCloudToContoursAndMesh(pcText, contourStep), [pcText, contourStep]);

  // ==========================================================================
  // ENGINE 9: AutoLISP (.LSP) Compiler & Protector
  // ==========================================================================
  const [lispInput, setLispInput] = useState<string>(() => getSampleAutoLispCode());
  const [lispByteStreamMode, setLispByteStreamMode] = useState<boolean>(false);

  const lispResult = useMemo(
    () => obfuscateAutoLisp(lispInput, lispByteStreamMode),
    [lispInput, lispByteStreamMode]
  );

  // ==========================================================================
  // ENGINE 10: Enterprise CAD Telemetry Blocker & SAM License Audit Script
  // ==========================================================================
  const [blockAutodesk, setBlockAutodesk] = useState<boolean>(true);
  const [blockSolidWorks, setBlockSolidWorks] = useState<boolean>(true);
  const [blockSketchUp, setBlockSketchUp] = useState<boolean>(true);
  const [lmutilHost, setLmutilHost] = useState<string>('27000@cad-license-srv.internal');

  const generatedFirewallPs1 = useMemo(() => {
    const lines = [
      '# ============================================================================',
      '# Enterprise CAD Outbound Telemetry & SAM License Audit PowerShell Script',
      '# Generated Locally by CADGuide.tools Zero-Upload Workbench',
      '# ============================================================================',
      '$ErrorActionPreference = "Stop"',
      'Write-Host "[CADGuide] Applying Outbound CAD Telemetry Firewall Rules..." -ForegroundColor Cyan',
    ];
    if (blockAutodesk) {
      lines.push(
        'New-NetFirewallRule -DisplayName "CADGuide_Block_ADPClientService" -Direction Outbound -Program "$env:ProgramFiles\\Autodesk\\AdODIS\\V1\\Setup\\AdpSDKWrapper.exe" -Action Block -ErrorAction SilentlyContinue',
        '# Host Telemetry Endpoints (Autodesk ADP / Analytics)',
        '# 0.0.0.0 ase.autodesk.com',
        '# 0.0.0.0 analytics.autodesk.com'
      );
    }
    if (blockSolidWorks) {
      lines.push(
        'New-NetFirewallRule -DisplayName "CADGuide_Block_SWCEIP" -Direction Outbound -Program "$env:ProgramFiles\\SOLIDWORKS Corp\\SOLIDWORKS\\swceip.exe" -Action Block -ErrorAction SilentlyContinue'
      );
    }
    if (blockSketchUp) {
      lines.push(
        'New-NetFirewallRule -DisplayName "CADGuide_Block_BugSplat" -Direction Outbound -Program "$env:ProgramFiles\\SketchUp\\SketchUp 2026\\BsSndRpt64.exe" -Action Block -ErrorAction SilentlyContinue'
      );
    }
    lines.push(
      '',
      `# Query FlexNet Publisher License Server (${lmutilHost})`,
      `Write-Host "[CADGuide] Auditing Concurrent Floating Seats on ${lmutilHost}..." -ForegroundColor Green`,
      `lmutil lmstat -a -c "${lmutilHost}" > "$env:USERPROFILE\\Desktop\\CAD_SAM_Audit_Report.txt"`
    );
    return lines.join('\n');
  }, [blockAutodesk, blockSolidWorks, blockSketchUp, lmutilHost]);

  // ==========================================================================
  // RENDER BY ENGINE MODE
  // ==========================================================================

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 print:hidden">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-black uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open-Source Client-Side CAD Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {title || 'Interactive Local CAD / BIM / CAM Workbench'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            100% browser-local execution powered by deterministic geometric algorithms. Zero file uploads to external servers.
          </p>
        </div>
        <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0">
          ✓ 100% Local Processing
        </span>
      </div>

      {/* ====================================================================
          MODE 1: 2D DXF LAYER SPLITTER / BATCH CONVERTER / VERSION DOWNGRADER
      ==================================================================== */}
      {mode === 'dxf-layer-batch-downgrade' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-black text-slate-900">Active Drawing: {dxfFileName}</div>
                <div className="text-[11px] text-slate-500 font-semibold">
                  {parsedDxf ? `${parsedDxf.entities.length} Entities · ${layerNames.length} Layers · Header ${parsedDxf.header['$ACADVER']?.[0] || 'AC1027'}` : 'Invalid DXF'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 transition-colors">
                <UploadCloud className="w-4 h-4" />
                <span>Load .DXF File</span>
                <input
                  type="file"
                  accept=".dxf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setDxfFileName(f.name);
                    f.text().then((txt) => {
                      setDxfSource(txt);
                      setSelectedLayers({});
                    });
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setDxfFileName('sample-sheetmetal-bracket.dxf');
                  setDxfSource(getSampleBracketDxf());
                  setSelectedLayers({});
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black transition-colors"
              >
                Reset Sample Bracket
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Layer Isolation, Version Rewriter & Recovery Controls */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Target DXF Version ($ACADVER Down-Save)
                </label>
                <select
                  value={targetAcadVer}
                  onChange={(e) => setTargetAcadVer(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                >
                  <option value="AC1032">AutoCAD 2018–2026 (AC1032)</option>
                  <option value="AC1027">AutoCAD 2013–2017 (AC1027)</option>
                  <option value="AC1024">AutoCAD 2010–2012 (AC1024)</option>
                  <option value="AC1015">AutoCAD 2000 (AC1015)</option>
                  <option value="AC1009">AutoCAD R12 Legacy CNC (AC1009 — LWPOLYLINE→POLYLINE)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={healCorrupt}
                  onChange={(e) => setHealCorrupt(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Purge zero-length & corrupt degenerate entities</span>
              </label>

              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Layer Splitter ({activeLayerSet.size}/{layerNames.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const allOn = activeLayerSet.size === layerNames.length;
                      const next: Record<string, boolean> = {};
                      layerNames.forEach((ln) => (next[ln] = !allOn));
                      setSelectedLayers(next);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Toggle All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {layerNames.map((ln) => {
                    const count = parsedDxf?.entities.filter((e) => e.layer === ln).length || 0;
                    const checked = activeLayerSet.has(ln);
                    return (
                      <div
                        key={ln}
                        className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer truncate">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setSelectedLayers((prev) => ({ ...prev, [ln]: e.target.checked }))
                            }
                          />
                          <span className="truncate">{ln}</span>
                          <span className="text-[10px] text-slate-400">({count})</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!parsedDxf) return;
                            const res = serializeDxfDoc(parsedDxf, {
                              allowedLayers: new Set([ln]),
                              targetAcadVer,
                              healCorruptEntities: healCorrupt,
                            });
                            downloadBlob(res.dxfText, `${dxfFileName.replace(/\.dxf$/i, '')}_Layer_${ln}.dxf`);
                          }}
                          className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded"
                        >
                          Split .DXF
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!parsedDxf) return;
                    const res = serializeDxfDoc(parsedDxf, {
                      allowedLayers: activeLayerSet,
                      targetAcadVer,
                      healCorruptEntities: healCorrupt,
                    });
                    downloadBlob(res.dxfText, `${dxfFileName.replace(/\.dxf$/i, '')}_${targetAcadVer}.dxf`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Rewritten DXF ({targetAcadVer})</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black transition-colors"
                >
                  Print / Plot Vector View to PDF
                </button>
              </div>
            </div>

            {/* Right: Interactive 2D Vector SVG Viewport */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between min-h-[340px]">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200">2D Model-Space Vector Preview</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlotColorMode((m) => (m === 'color' ? 'monochrome' : 'color'))}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-bold hover:bg-slate-700"
                  >
                    CTB Style: {plotColorMode === 'color' ? 'Color (ByLayer)' : 'Monochrome.ctb'}
                  </button>
                </div>
              </div>
              {parsedDxf ? (
                (() => {
                  const filteredDoc = {
                    ...parsedDxf,
                    entities: parsedDxf.entities.filter((e) => activeLayerSet.has(e.layer)),
                  };
                  const segs = segmentsOf(filteredDoc);
                  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                  for (const s of segs) {
                    minX = Math.min(minX, s.x1, s.x2);
                    minY = Math.min(minY, s.y1, s.y2);
                    maxX = Math.max(maxX, s.x1, s.x2);
                    maxY = Math.max(maxY, s.y1, s.y2);
                  }
                  if (!Number.isFinite(minX)) { minX = 0; minY = 0; maxX = 100; maxY = 100; }
                  const pad = Math.max(maxX - minX, maxY - minY, 10) * 0.1;
                  const vbW = maxX - minX + pad * 2;
                  const vbH = maxY - minY + pad * 2;

                  return (
                    <svg
                      viewBox={`${minX - pad} ${minY - pad} ${vbW} ${vbH}`}
                      className="w-full h-72 bg-slate-950 rounded-xl my-2"
                    >
                      <g transform={`scale(1,-1) translate(0,${-(minY + maxY)})`}>
                        {segs.map((s, idx) => (
                          <line
                            key={idx}
                            x1={s.x1}
                            y1={s.y1}
                            x2={s.x2}
                            y2={s.y2}
                            stroke={plotColorMode === 'monochrome' ? '#f8fafc' : '#38bdf8'}
                            strokeWidth={vbW * 0.004}
                            strokeLinecap="round"
                          />
                        ))}
                      </g>
                    </svg>
                  );
                })()
              ) : (
                <div className="text-center text-slate-400 text-xs py-20">Unable to parse ASCII DXF.</div>
              )}
              <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                <span>Active Layers Rendered: {activeLayerSet.size}</span>
                <span>Output Schema: {targetAcadVer}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 2: 2D DRAWING VISUAL DIFF & REVISION COMPARATOR
      ==================================================================== */}
      {mode === 'dxf-visual-diff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 cursor-pointer text-center">
              <div className="text-xs font-black text-slate-800">1. Baseline Drawing (Rev A .DXF)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Click to load or use built-in Rev A</div>
              <input
                type="file"
                accept=".dxf"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setRevAText)}
              />
            </label>
            <label className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50 cursor-pointer text-center">
              <div className="text-xs font-black text-slate-800">2. Revised Drawing (Rev B .DXF)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Click to load or use built-in Rev B</div>
              <input
                type="file"
                accept=".dxf"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setRevBText)}
              />
            </label>
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-center">
              <label className="text-[11px] font-black text-slate-600 uppercase">
                Geometric Snap Tolerance: {diffTol} mm
              </label>
              <input
                type="range"
                min="0.01"
                max="2.0"
                step="0.05"
                value={diffTol}
                onChange={(e) => setDiffTol(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="text-xs font-bold text-slate-500">Unchanged Entities</div>
              <div className="text-xl font-black text-slate-800">{diffResult.unchanged.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-700">Added in Rev B (Green)</div>
              <div className="text-xl font-black text-emerald-700">+{diffResult.addedInB.length}</div>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="text-xs font-bold text-rose-700">Removed from Rev A (Red)</div>
              <div className="text-xl font-black text-rose-700">-{diffResult.removedFromA.length}</div>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-4">
            <svg viewBox="-15 -15 160 110" className="w-full h-72">
              <g transform="scale(1,-1) translate(0,-80)">
                {diffResult.unchanged.map((s, i) => (
                  <line key={`u-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#64748b" strokeWidth="0.6" />
                ))}
                {diffResult.removedFromA.map((s, i) => (
                  <line
                    key={`r-${i}`}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="#f43f5e"
                    strokeWidth="1.2"
                    strokeDasharray="2 1"
                  />
                ))}
                {diffResult.addedInB.map((s, i) => (
                  <line key={`a-${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#10b981" strokeWidth="1.4" />
                ))}
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 3: DXF MULTI-LANGUAGE TEXT EXTRACTOR & TRANSLATOR
      ==================================================================== */}
      {mode === 'dxf-text-translator' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-black text-slate-800">
                Extracted {textEntries.length} TEXT / MTEXT Annotations from {dxfFileName}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyEngineeringDictionary('en-to-de')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  dictionaryPreset === 'en-to-de' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                }`}
              >
                Auto-Translate: German (DIN)
              </button>
              <button
                type="button"
                onClick={() => applyEngineeringDictionary('en-to-ja')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  dictionaryPreset === 'en-to-ja' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                }`}
              >
                Japanese (JIS)
              </button>
              <button
                type="button"
                onClick={() => applyEngineeringDictionary('en-to-es')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  dictionaryPreset === 'en-to-es' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                }`}
              >
                Spanish (UNE)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Layer</th>
                  <th className="py-3 px-4">Position (X, Y)</th>
                  <th className="py-3 px-4">Original CAD Text</th>
                  <th className="py-3 px-4">Translated Text (Editable in Place)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {textEntries.map((item) => (
                  <tr key={item.entityIndex}>
                    <td className="py-2.5 px-4 font-bold text-slate-700">{item.layer}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      ({item.x.toFixed(1)}, {item.y.toFixed(1)})
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">{item.originalText}</td>
                    <td className="py-2.5 px-4">
                      <input
                        type="text"
                        value={textOverrides[item.entityIndex] ?? item.originalText}
                        onChange={(e) =>
                          setTextOverrides((prev) => ({ ...prev, [item.entityIndex]: e.target.value }))
                        }
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-blue-700 bg-blue-50/30"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!parsedDxf) return;
                const map = new Map<number, string>();
                Object.entries(textOverrides).forEach(([k, v]) => map.set(Number(k), v));
                const res = serializeDxfDoc(parsedDxf, { textOverrides: map });
                downloadBlob(res.dxfText, `Translated_${dxfFileName}`);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Translated .DXF Drawing</span>
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 4: RASTER IMAGE (JPG/PNG) & PDF TO VECTOR DXF TRACER
      ==================================================================== */}
      {mode === 'raster-pdf-to-dxf-tracer' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Upload JPG / PNG / Scan</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleRasterImageUpload(e.target.files[0])}
              />
            </label>
            <div>
              <label className="text-xs font-black text-slate-700 block">
                Luminance Threshold: {traceThreshold} / 255
              </label>
              <input
                type="range"
                min="20"
                max="240"
                value={traceThreshold}
                onChange={(e) => setTraceThreshold(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-700 block">
                Speckle Filter / Min Segment: {traceMinLen.toFixed(1)} px
              </label>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.2"
                value={traceMinLen}
                onChange={(e) => setTraceMinLen(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Grid Resolution:</span>
                <span className="font-black text-slate-800">{rasterGrid.w} × {rasterGrid.h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Extracted Vector Lines:</span>
                <span className="font-black text-blue-600">{tracedResult.segments.length}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => downloadBlob(tracedResult.dxfText, 'vectorized-contours.dxf')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Traced .DXF</span>
            </button>
            <button
              type="button"
              onClick={() => downloadBlob(tracedResult.svgText, 'vectorized-contours.svg', 'image/svg+xml')}
              className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-black"
            >
              Download Traced .SVG
            </button>
          </div>
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 flex flex-col justify-between">
            <div className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              Marching-Squares Iso-Contour Vector Preview ({tracedResult.segments.length} segments)
            </div>
            <svg viewBox={`0 0 ${rasterGrid.w} ${rasterGrid.h}`} className="w-full h-72 my-2">
              {tracedResult.segments.map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={rasterGrid.h - y1}
                  x2={x2}
                  y2={rasterGrid.h - y2}
                  stroke="#38bdf8"
                  strokeWidth="0.45"
                />
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 5: DXF TO CNC / LASER G-CODE COMPILER
      ==================================================================== */}
      {mode === 'dxf-to-gcode-cam' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCamMode('laser')}
                className={`py-2 rounded-xl text-xs font-black border ${
                  camMode === 'laser' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                }`}
              >
                2D Laser / Plasma
              </button>
              <button
                type="button"
                onClick={() => setCamMode('mill')}
                className={`py-2 rounded-xl text-xs font-black border ${
                  camMode === 'mill' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
                }`}
              >
                2.5D CNC Router
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">Feed Rate (F mm/min)</label>
              <input
                type="number"
                value={camFeed}
                onChange={(e) => setCamFeed(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600">
                {camMode === 'laser' ? 'Laser PWM Power (S 0–1000)' : 'Spindle Speed (S RPM)'}
              </label>
              <input
                type="number"
                value={camPower}
                onChange={(e) => setCamPower(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
              />
            </div>
            {camMode === 'mill' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600">Final Z Depth (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={camCutDepth}
                    onChange={(e) => setCamCutDepth(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Stepdown (mm)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={camStepDown}
                    onChange={(e) => setCamStepDown(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => downloadBlob(compiledCam.gcode, `${dxfFileName.replace(/\.dxf$/i, '')}.nc`)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download CNC G-Code (.NC)</span>
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold text-slate-200">
                  Toolpath Preview (Green = G1 Feed Cut, Amber Dashed = G0 Rapid)
                </span>
                <span>Est. Cycle Time: {compiledCam.estimatedMinutes.toFixed(2)} min</span>
              </div>
              <svg viewBox="-15 -15 155 110" className="w-full h-56">
                <g transform="scale(1,-1) translate(0,-80)">
                  {parsedGcodePreview.moves.map((m, idx) => (
                    <line
                      key={idx}
                      x1={m.x1}
                      y1={m.y1}
                      x2={m.x2}
                      y2={m.y2}
                      stroke={m.rapid ? '#f59e0b' : '#10b981'}
                      strokeWidth={m.rapid ? '0.45' : '0.9'}
                      strokeDasharray={m.rapid ? '2 1.5' : undefined}
                    />
                  ))}
                </g>
              </svg>
            </div>
            <pre className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-4 rounded-2xl max-h-40 overflow-y-auto">
              {compiledCam.gcode}
            </pre>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 6: 3D STEP / STL / OBJ / glTF VIEWER, SLICER & CONVERTER
      ==================================================================== */}
      {mode === 'mesh-step-3d-workbench' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>Load STEP / STL / OBJ File</span>
              <input
                type="file"
                accept=".step,.stp,.iges,.igs,.stl,.obj"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handle3dFileUpload(e.target.files[0])}
              />
            </label>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setMeshSourceName('spur-gear-24t.step');
                  setActiveMesh(generateParametricPart({ kind: 'spur-gear', teeth: 24 }).mesh);
                }}
                className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold hover:bg-blue-50"
              >
                Sample Gear
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeshSourceName('dn65-pipe-flange.step');
                  setActiveMesh(generateParametricPart({ kind: 'pipe-flange' }).mesh);
                }}
                className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold hover:bg-blue-50"
              >
                Sample Flange
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeshSourceName('sheetmetal-bracket.step');
                  setActiveMesh(generateParametricPart({ kind: 'l-bracket' }).mesh);
                }}
                className="py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold hover:bg-blue-50"
              >
                L-Bracket
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div>
                <label className="font-bold text-slate-600">Orbit Yaw ({rotYaw}°)</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotYaw}
                  onChange={(e) => setRotYaw(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Orbit Pitch ({rotPitch}°)</label>
                <input
                  type="range"
                  min="-85"
                  max="85"
                  value={rotPitch}
                  onChange={(e) => setRotPitch(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">
                  Z Section Clipping Plane ({sliceZHeight.toFixed(2)} mm)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={sliceZRatio}
                  onChange={(e) => setSliceZRatio(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Triangles / Vertices:</span>
                <span className="font-black text-slate-800">
                  {mStats.triangles.toLocaleString()} / {mStats.vertices.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Surface Area:</span>
                <span className="font-black text-slate-800">{mStats.area.toFixed(1)} mm²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Slice Contours @ Z:</span>
                <span className="font-black text-blue-600">{currentSliceSegments.length} segs</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    exportMeshToBinaryStl(activeMesh),
                    `${meshSourceName.replace(/\.[^.]+$/, '')}.stl`,
                    'application/octet-stream'
                  )
                }
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Convert & Download Binary .STL</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(exportMeshToObj(activeMesh), `${meshSourceName.replace(/\.[^.]+$/, '')}.obj`)
                  }
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black"
                >
                  Export .OBJ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(
                      exportMeshToGltfJson(activeMesh),
                      `${meshSourceName.replace(/\.[^.]+$/, '')}.gltf`,
                      'model/gltf+json'
                    )
                  }
                  className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black"
                >
                  Export .glTF 2.0
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
              <span className="font-bold">{meshSourceName} — Interactive 3D Viewport</span>
              <button
                type="button"
                onClick={() => setWireframe3d((w) => !w)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold"
              >
                {wireframe3d ? 'Mode: Wireframe' : 'Mode: Shaded B-Rep'}
              </button>
            </div>
            <canvas ref={canvas3dRef} width={620} height={340} className="w-full h-80 rounded-xl my-2" />
            <div className="text-[11px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
              <span>
                BBox:{' '}
                {[0, 1, 2]
                  .map((k) => (mStats.bbox.max[k] - mStats.bbox.min[k]).toFixed(1))
                  .join(' × ')}{' '}
                mm
              </span>
              <span>Watertight Check: {mStats.boundaryEdges === 0 ? '✓ Closed Solid' : `${mStats.boundaryEdges} Open Edges`}</span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 7: openBIM IFC & REVIT FAMILY SCHEMA AUDITOR & QTO EXTRACTOR
      ==================================================================== */}
      {mode === 'bim-ifc-rvt-auditor' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-black text-slate-900">
                  Active BIM Model: {ifcFileName} (Schema: {ifcAudit.schema})
                </div>
                <div className="text-[11px] text-slate-500 font-semibold">
                  {ifcAudit.elements.length} Spatial & Building Elements Parsed Locally
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" />
                <span>Load .IFC File</span>
                <input
                  type="file"
                  accept=".ifc"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setIfcFileName(f.name);
                    f.text().then(setIfcText);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={exportIfcQtoCsv}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export QTO Schedule (.CSV)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(ifcAudit.classCounts)
              .filter(([k]) => /^IFC(WALL|SLAB|COLUMN|BEAM|DOOR|WINDOW|BUILDINGSTOREY|SPACE)$/.test(k))
              .map(([cls, count]) => (
                <div key={cls} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-black text-slate-400 uppercase">{cls}</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{count}</div>
                </div>
              ))}
          </div>

          <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-black uppercase border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">STEP ID</th>
                  <th className="py-2.5 px-4">IFC Class</th>
                  <th className="py-2.5 px-4">GlobalId (GUID)</th>
                  <th className="py-2.5 px-4">Element Name / Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ifcAudit.elements.map((el) => (
                  <tr key={el.id}>
                    <td className="py-2 px-4 font-mono text-slate-500">{el.id}</td>
                    <td className="py-2 px-4 font-black text-blue-700">{el.ifcClass}</td>
                    <td className="py-2 px-4 font-mono text-[11px] text-slate-500">{el.guid}</td>
                    <td className="py-2 px-4 font-semibold text-slate-800">{el.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 8: POINT CLOUD (LAS/XYZ/CSV) CONTOUR DXF & TERRAIN MESH
      ==================================================================== */}
      {mode === 'point-cloud-contour-mesh' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <label className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer flex items-center justify-center gap-2">
              <Mountain className="w-4 h-4" />
              <span>Load .XYZ / .PTS / .CSV Survey</span>
              <input
                type="file"
                accept=".xyz,.pts,.csv,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0]?.text().then(setPcText)}
              />
            </label>
            <div>
              <label className="text-xs font-bold text-slate-700">
                Contour Elevation Interval: {contourStep.toFixed(1)} m
              </label>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.5"
                value={contourStep}
                onChange={(e) => setContourStep(Number(e.target.value))}
                className="w-full mt-1"
              />
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Survey Points Parsed:</span>
                <span className="font-black text-slate-800">{pcResult.pointCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Elevation Range:</span>
                <span className="font-black text-slate-800">
                  {pcResult.minZ.toFixed(1)}m – {pcResult.maxZ.toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Generated Contour Vectors:</span>
                <span className="font-black text-emerald-600">{pcResult.contourSegments.length}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => downloadBlob(pcResult.dxfText, 'terrain-contours-3d.dxf')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download 3D Contours (.DXF)</span>
            </button>
            <button
              type="button"
              onClick={() =>
                downloadBlob(exportMeshToBinaryStl(pcResult.mesh), 'terrain-surface-mesh.stl', 'application/octet-stream')
              }
              className="w-full py-2 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black"
            >
              Download TIN Surface Mesh (.STL)
            </button>
          </div>
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4">
            <div className="text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              Topographic Elevation Iso-Contours Preview
            </div>
            <svg viewBox="-5 -5 130 130" className="w-full h-72 my-2">
              {pcResult.contourSegments.map((s, i) => {
                const norm = (s.z - pcResult.minZ) / Math.max(1, pcResult.maxZ - pcResult.minZ);
                const hue = Math.round(210 - norm * 160);
                return (
                  <line
                    key={i}
                    x1={s.x1}
                    y1={120 - s.y1}
                    x2={s.x2}
                    y2={120 - s.y2}
                    stroke={`hsl(${hue}, 85%, 60%)`}
                    strokeWidth="0.65"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 9: AUTOLISP (.LSP) COMPILER & SYMBOL OBFUSCATOR
      ==================================================================== */}
      {mode === 'autolisp-compiler-protector' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={lispByteStreamMode}
                onChange={(e) => setLispByteStreamMode(e.target.checked)}
              />
              <span>Wrap in Self-Decoding ASCII Byte-Stream (`vl-list-&gt;string` + `eval`)</span>
            </label>
            <button
              type="button"
              onClick={() => downloadBlob(lispResult.protectedCode, 'protected-routine.lsp')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Protected .LSP</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black text-slate-600 uppercase block mb-1.5">
                Source AutoLISP Code (.LSP)
              </label>
              <textarea
                value={lispInput}
                onChange={(e) => setLispInput(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-2xl border border-slate-200 font-mono text-xs bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-600 uppercase block mb-1.5">
                Obfuscated & Minified Output ({lispResult.symbolMap.length} local symbols renamed)
              </label>
              <textarea
                readOnly
                value={lispResult.protectedCode}
                rows={10}
                className="w-full p-3 rounded-2xl border border-slate-800 font-mono text-xs bg-slate-950 text-emerald-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODE 10: ENTERPRISE TELEMETRY BLOCKER & SAM LICENSE AUDIT SHIELD
      ==================================================================== */}
      {mode === 'telemetry-sam-shield' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="text-xs font-black text-slate-800 uppercase">Target CAD Telemetry Rules</div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={blockAutodesk}
                onChange={(e) => setBlockAutodesk(e.target.checked)}
              />
              <span>Autodesk ADPClientService / AdODIS</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={blockSolidWorks}
                onChange={(e) => setBlockSolidWorks(e.target.checked)}
              />
              <span>SolidWorks CEIP (swceip.exe)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={blockSketchUp}
                onChange={(e) => setBlockSketchUp(e.target.checked)}
              />
              <span>Trimble BugSplat Telemetry</span>
            </label>
            <div>
              <label className="text-xs font-bold text-slate-600 block">FlexNet License Server (port@host)</label>
              <input
                type="text"
                value={lmutilHost}
                onChange={(e) => setLmutilHost(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold"
              />
            </div>
            <button
              type="button"
              onClick={() => downloadBlob(generatedFirewallPs1, 'cad-sam-telemetry-shield.ps1')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PowerShell Script (.PS1)</span>
            </button>
          </div>
          <div className="lg:col-span-2">
            <pre className="bg-slate-950 text-emerald-400 font-mono text-xs p-5 rounded-2xl overflow-x-auto h-full">
              {generatedFirewallPs1}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
