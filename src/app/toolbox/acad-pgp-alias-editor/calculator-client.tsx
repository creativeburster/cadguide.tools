'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Upload, Download, AlertTriangle, Check, Plus, Trash2, Terminal, Sparkles, Search, RefreshCw, Eye, Image as ImageIcon } from 'lucide-react';

interface AliasItem {
  alias: string;
  command: string;
  isCustom?: boolean;
}

const DEFAULT_AUTOCAD_ALIASES: AliasItem[] = [
  { alias: 'A', command: 'ARC' },
  { alias: 'B', command: 'BLOCK' },
  { alias: 'C', command: 'CIRCLE' },
  { alias: 'CO', command: 'COPY' },
  { alias: 'CP', command: 'COPY' },
  { alias: 'D', command: 'DIMSTYLE' },
  { alias: 'E', command: 'ERASE' },
  { alias: 'EX', command: 'EXTEND' },
  { alias: 'F', command: 'FILLET' },
  { alias: 'G', command: 'GROUP' },
  { alias: 'H', command: 'HATCH' },
  { alias: 'I', command: 'INSERT' },
  { alias: 'L', command: 'LINE' },
  { alias: 'M', command: 'MOVE' },
  { alias: 'O', command: 'OFFSET' },
  { alias: 'P', command: 'PAN' },
  { alias: 'PE', command: 'PEDIT' },
  { alias: 'PL', command: 'PLINE' },
  { alias: 'PO', command: 'POINT' },
  { alias: 'RE', command: 'REGEN' },
  { alias: 'RO', command: 'ROTATE' },
  { alias: 'S', command: 'STRETCH' },
  { alias: 'SC', command: 'SCALE' },
  { alias: 'T', command: 'MTEXT' },
  { alias: 'TR', command: 'TRIM' },
  { alias: 'UN', command: 'UNITS' },
  { alias: 'X', command: 'EXPLODE' },
  { alias: 'Z', command: 'ZOOM' }
];

const DEFAULT_GSTARCAD_ALIASES: AliasItem[] = [
  { alias: 'A', command: 'ARC' },
  { alias: 'B', command: 'BLOCK' },
  { alias: 'C', command: 'CIRCLE' },
  { alias: 'CO', command: 'COPY' },
  { alias: 'D', command: 'DIMSTYLE' },
  { alias: 'E', command: 'ERASE' },
  { alias: 'EX', command: 'EXTEND' },
  { alias: 'F', command: 'FILLET' },
  { alias: 'H', command: 'HATCH' },
  { alias: 'I', command: 'INSERT' },
  { alias: 'L', command: 'LINE' },
  { alias: 'M', command: 'MOVE' },
  { alias: 'O', command: 'OFFSET' },
  { alias: 'P', command: 'PAN' },
  { alias: 'PL', command: 'PLINE' },
  { alias: 'RO', command: 'ROTATE' },
  { alias: 'S', command: 'STRETCH' },
  { alias: 'SC', command: 'SCALE' },
  { alias: 'T', command: 'MTEXT' },
  { alias: 'TR', command: 'TRIM' },
  { alias: 'X', command: 'EXPLODE' },
  { alias: 'Z', command: 'ZOOM' },
  { alias: 'GWS', command: 'GSTARWORKSPACES' },
  { alias: 'SPLAT', command: 'SPLINE' }
];

export default function AcadPgpEditorClient() {
  const [aliases, setAliases] = useState<AliasItem[]>(DEFAULT_AUTOCAD_ALIASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newCommand, setNewCommand] = useState('');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'AutoCAD Command Terminal Simulator v1.0',
    'Enter the shortcut alias and press Enter to simulate CAD Command line command execution mechanism. ',
    'Type REINIT to simulate reloading PGP File procedure. '
  ]);
  const [activeTab, setActiveTab] = useState<'presets' | 'editor'>('editor');
  const [lastExecutedCommand, setLastExecutedCommand] = useState<string | null>(null);

  // Wallpaper generation states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wallpaperTheme, setWallpaperTheme] = useState<'minimalist' | 'blueprint' | 'cyberpunk'>('blueprint');
  const [wallpaperResolution, setWallpaperResolution] = useState<'4k' | '1080p' | 'phone'>('4k');
  const [selectedAliases, setSelectedAliases] = useState<string[]>(DEFAULT_AUTOCAD_ALIASES.slice(0, 16).map(a => a.alias));

  // Sync selected aliases when aliases list changes
  useEffect(() => {
    const allExisting = aliases.map(a => a.alias);
    const validSelected = selectedAliases.filter(alias => allExisting.includes(alias));
    if (validSelected.length === 0) {
      setSelectedAliases(aliases.slice(0, 16).map(a => a.alias));
    } else {
      setSelectedAliases(validSelected);
    }
  }, [aliases]);

  // Canvas Drawing logic
  const drawWallpaperToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 3840;
    let height = 2160;
    if (wallpaperResolution === '1080p') {
      width = 1920;
      height = 1080;
    } else if (wallpaperResolution === 'phone') {
      width = 1080;
      height = 1920;
    }
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (wallpaperTheme === 'minimalist') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridSize = Math.round(width / 40);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (wallpaperTheme === 'blueprint') {
      ctx.fillStyle = '#0f1e36';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1e2d4a';
      ctx.lineWidth = 1.5;
      const gridSize = Math.round(width / 50);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1;
      const gridSize = Math.round(width / 30);
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    const padding = Math.round(width * 0.04);
    ctx.strokeStyle = wallpaperTheme === 'minimalist' ? '#64748b' : (wallpaperTheme === 'blueprint' ? '#3b82f6' : '#10b981');
    ctx.lineWidth = Math.round(width * 0.002);
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const ticksSize = Math.round(width * 0.01);
    ctx.beginPath();
    ctx.moveTo(halfWidth, padding);
    ctx.lineTo(halfWidth, padding + ticksSize);
    ctx.moveTo(halfWidth, height - padding);
    ctx.lineTo(halfWidth, height - padding - ticksSize);
    ctx.moveTo(padding, halfHeight);
    ctx.lineTo(padding + ticksSize, halfHeight);
    ctx.moveTo(width - padding, halfHeight);
    ctx.lineTo(width - padding - ticksSize, halfHeight);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const titleFontSize = Math.round(width * 0.022);
    ctx.font = `bold ${titleFontSize}px monospace, system-ui`;
    ctx.fillStyle = wallpaperTheme === 'minimalist' ? '#0f172a' : (wallpaperTheme === 'blueprint' ? '#ffffff' : '#06b6d4');
    
    const isMobile = wallpaperResolution === 'phone';
    const titleY = Math.round(height * 0.08);
    ctx.fillText('AutoCAD Shortcut Commands Reference'.toUpperCase(), halfWidth, titleY);

    const subTitleFontSize = Math.round(width * 0.01);
    ctx.font = `bold ${subTitleFontSize}px monospace, system-ui`;
    ctx.fillStyle = wallpaperTheme === 'minimalist' ? '#64748b' : (wallpaperTheme === 'blueprint' ? '#f59e0b' : '#10b981');
    ctx.fillText(`LAYOUT MODE: ${wallpaperResolution.toUpperCase()} | ENGINE: ONLINE PGP COMPILER | DATE: ${new Date().toLocaleDateString()}`, halfWidth, titleY + titleFontSize + 15);

    const renderList = aliases.filter(item => selectedAliases.includes(item.alias));
    
    if (renderList.length > 0) {
      let cols = 3;
      if (isMobile) {
        cols = 1;
      } else {
        if (renderList.length <= 8) cols = 2;
        else if (renderList.length <= 18) cols = 3;
        else if (renderList.length <= 32) cols = 4;
        else cols = 5;
      }

      const rows = Math.ceil(renderList.length / cols);
      const startX = padding * 1.5;
      const endX = width - padding * 1.5;
      const startY = titleY + titleFontSize + subTitleFontSize + Math.round(height * 0.06);
      const endY = height - padding * 2;
      
      const colWidth = (endX - startX) / cols;
      const rowHeight = (endY - startY) / rows;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const aliasFontSize = Math.round(Math.min(colWidth * 0.12, rowHeight * 0.35));
      const descFontSize = Math.round(aliasFontSize * 0.75);

      renderList.forEach((item, index) => {
        const c = index % cols;
        const r = Math.floor(index / cols);

        const x = startX + c * colWidth;
        const y = startY + r * rowHeight + rowHeight / 2;

        if (wallpaperTheme === 'cyberpunk') {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#06b6d4';
        }

        ctx.font = `black ${aliasFontSize}px monospace, system-ui`;
        ctx.fillStyle = wallpaperTheme === 'minimalist' ? '#0f172a' : (wallpaperTheme === 'blueprint' ? '#f59e0b' : '#10b981');
        const aliasText = item.alias.padEnd(4, ' ');
        ctx.fillText(aliasText, x + 20, y);

        ctx.shadowBlur = 0;

        ctx.font = `bold ${descFontSize}px monospace, system-ui`;
        ctx.fillStyle = wallpaperTheme === 'minimalist' ? '#334155' : (wallpaperTheme === 'blueprint' ? '#ffffff' : '#e2e8f0');
        ctx.fillText(`➔  ${item.command}`, x + 20 + ctx.measureText(aliasText).width + 10, y);

        ctx.strokeStyle = wallpaperTheme === 'minimalist' ? '#e2e8f0' : (wallpaperTheme === 'blueprint' ? '#1e2d4a' : '#1e293b');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 20, y + rowHeight * 0.25);
        ctx.lineTo(x + colWidth - 20, y + rowHeight * 0.25);
        ctx.stroke();
      });
    }

    if (!isMobile) {
      const ucsX = width - padding * 2;
      const ucsY = height - padding * 2;
      const ucsSize = Math.round(width * 0.02);

      ctx.strokeStyle = wallpaperTheme === 'minimalist' ? '#64748b' : (wallpaperTheme === 'blueprint' ? '#3b82f6' : '#10b981');
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(ucsX, ucsY);
      ctx.lineTo(ucsX + ucsSize, ucsY);
      ctx.stroke();
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillText('X', ucsX + ucsSize + 2, ucsY - 2);

      ctx.beginPath();
      ctx.moveTo(ucsX, ucsY);
      ctx.lineTo(ucsX, ucsY - ucsSize);
      ctx.stroke();
      ctx.fillText('Y', ucsX - 8, ucsY - ucsSize - 2);

      ctx.beginPath();
      ctx.arc(ucsX, ucsY, 3, 0, Math.PI * 2);
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = `bold ${Math.round(width * 0.0075)}px monospace`;
    ctx.fillStyle = wallpaperTheme === 'minimalist' ? '#94a3b8' : (wallpaperTheme === 'blueprint' ? '#475569' : '#374151');
    ctx.fillText('DESIGNED VIA CADGUIDE.TOOLS | ONLINE COMMAND ALIAS COMPILER', halfWidth, height - padding - 10);
  };

  // Re-draw on configuration updates
  useEffect(() => {
    drawWallpaperToCanvas();
  }, [aliases, wallpaperTheme, wallpaperResolution, selectedAliases]);

  // Handle wallpaper download
  const handleDownloadWallpaper = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadguide_wallpaper_${wallpaperTheme}_${wallpaperResolution}.png`;
    link.click();

    setTerminalHistory((prev) => [
      ...prev,
      `>>> High-resolution wallpaper downloaded successfully! Theme: ${wallpaperTheme.toUpperCase()}, Res: ${wallpaperResolution.toUpperCase()}`
    ]);
  };

  // File parse routine
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const parsed: AliasItem[] = [];

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(';')) return;

        const commaIndex = trimmed.indexOf(',');
        if (commaIndex !== -1) {
          const alias = trimmed.substring(0, commaIndex).trim().toUpperCase();
          let commandPart = trimmed.substring(commaIndex + 1).trim();
          if (commandPart.startsWith('*')) {
            commandPart = commandPart.substring(1).trim();
          }
          // Remove secondary flags if any
          const secondaryComma = commandPart.indexOf(',');
          if (secondaryComma !== -1) {
            commandPart = commandPart.substring(0, secondaryComma).trim();
          }

          if (alias && commandPart) {
            parsed.push({
              alias,
              command: commandPart.toUpperCase(),
              isCustom: true
            });
          }
        }
      });

      if (parsed.length > 0) {
        setAliases(parsed);
        setTerminalHistory((prev) => [
          ...prev,
          `>>> Successfully imported local PGP file: Parse out the ${parsed.length} alias. `
        ]);
        setActiveTab('editor');
      } else {
        alert('No valid CAD alias definition resolved. Please make sure the file matches the "alias, *command" format. ');
      }
    };
    reader.readAsText(file);
  };

  // Compile to PGP format and trigger file download
  const handleDownload = () => {
    let pgpContent = `; =========================================================================\n`;
    pgpContent += `; AutoCAD Command Alias (PGP) File\n`;
    pgpContent += `; Generated by CADGuide.tools Online Compiler\n`;
    pgpContent += `; Date: ${new Date().toLocaleDateString()}\n`;
    pgpContent += `; -------------------------------------------------------------------------\n`;
    pgpContent += `; Rules: [Alias], *[Command]\n`;
    pgpContent += `; =========================================================================\n\n`;

    aliases.forEach((item) => {
      // Space align formatting for premium aesthetics
      const aliasPadded = item.alias.padEnd(10, ' ');
      pgpContent += `${aliasPadded}, *${item.command}\n`;
    });

    pgpContent += `\n; End of AutoCAD Command Alias file`;

    const blob = new Blob([pgpContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'acad.pgp';
    link.click();
    URL.revokeObjectURL(url);

    setTerminalHistory((prev) => [...prev, '>>> acad.pgp Compiled and downloaded successfully! ']);
  };

  // Pre-scan duplicate keys
  const aliasCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    aliases.forEach((item) => {
      counts[item.alias] = (counts[item.alias] || 0) + 1;
    });
    return counts;
  }, [aliases]);

  // Handle addition
  const handleAddAlias = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAlias = newAlias.trim().toUpperCase();
    const cleanCmd = newCommand.trim().toUpperCase();

    if (!cleanAlias || !cleanCmd) return;

    if (cleanAlias.includes(',') || cleanCmd.includes(',')) {
      alert('Commas cannot be included in aliases or commands! ');
      return;
    }

    setAliases((prev) => [
      { alias: cleanAlias, command: cleanCmd, isCustom: true },
      ...prev
    ]);
    setNewAlias('');
    setNewCommand('');

    setTerminalHistory((prev) => [
      ...prev,
      `>>> Alias added: ${cleanAlias} ➔ *${cleanCmd}`
    ]);
  };

  // Delete handler
  const handleDelete = (indexToDelete: number) => {
    const item = aliases[indexToDelete];
    setAliases((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    if (item) {
      setTerminalHistory((prev) => [
        ...prev,
        `>>> Alias removed: ${item.alias}`
      ]);
    }
  };

  // Inline value updates
  const handleCellEdit = (index: number, field: 'alias' | 'command', val: string) => {
    const updatedVal = val.toUpperCase().replace(/[\s,]/g, ''); // strip commas and whitespace
    setAliases((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: updatedVal };
      return copy;
    });
  };

  // Terminal submission action
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toUpperCase();
    if (!cmd) return;

    let response = '';
    if (cmd === 'REINIT') {
      response = 'Reloading PGP alias database... Reload successful! Currently loaded ' + aliases.length + ' Alias command. ';
      setTerminalInput('');
      setTerminalHistory((prev) => [...prev, `COMMAND: ${cmd}`, response]);
      return;
    }

    // Match alias
    const matched = aliases.find((item) => item.alias === cmd);
    if (matched) {
      response = `Find alias mapping: [${matched.alias}] ➔ Execute core command [${matched.command}]`;
      setLastExecutedCommand(matched.command);
    } else {
      // Fallback check if it's already a full command
      const isKnownCommand = aliases.some((item) => item.command === cmd);
      if (isKnownCommand) {
        response = `Directly execute the core command [${cmd}]`;
        setLastExecutedCommand(cmd);
      } else {
        response = `Unknown command or unregistered alias: "${cmd}"`;
        setLastExecutedCommand(null);
      }
    }

    setTerminalHistory((prev) => [...prev, `COMMAND: ${cmd}`, response]);
    setTerminalInput('');
  };

  // Load presets helper
  const loadPreset = (presetName: 'autocad' | 'gstarcad') => {
    if (presetName === 'autocad') {
      setAliases(DEFAULT_AUTOCAD_ALIASES);
      setTerminalHistory((prev) => [...prev, '>>> Default AutoCAD PGP configuration restored. ']);
    } else if (presetName === 'gstarcad') {
      setAliases(DEFAULT_GSTARCAD_ALIASES);
      setTerminalHistory((prev) => [...prev, '>>> GstarCAD alias configuration preset loaded. ']);
    }
  };

  // Filter aliases based on search query
  const filteredAliases = useMemo(() => {
    return aliases.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      return (
        item.alias.toLowerCase().includes(query) ||
        item.command.toLowerCase().includes(query)
);
    });
  }, [aliases, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Top control panel - file import and compilation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Card 1: PGP file loading/Export */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-slate-900 font-black text-lg tracking-tight">File configuration panel</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
              PGP Loader & Compiler
            </p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Support uploading your local <b>`acad.pgp`</b> / <b>`gcad.pgp`</b> for offline editing. After editing, generate a new one with one click PGP file. 
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="file"
                accept=".pgp"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="pgp-file-input"
              />
              <label
                htmlFor="pgp-file-input"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 text-slate-600 hover:text-blue-600 font-bold text-sm transition-all cursor-pointer text-center w-full"
              >
                <Upload className="w-4 h-4" />
                Upload local .pgp alias file
              </label>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer w-full"
            >
              <Download className="w-4 h-4" />
              Compile and download acad.pgp
            </button>
          </div>
        </div>

        {/* Card 2: SVG Dynamics CAD Command line terminal emulator */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col justify-between min-h-[250px] lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Terminal className="w-40 h-40 text-blue-500" />
          </div>

          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono font-black text-slate-400">CAD COMMAND LINE TERMINAL</span>
            </div>
            <button
              onClick={() => setTerminalHistory(['Terminal Reset Completed. PGP Simulator active.'])}
              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              clear screen
            </button>
          </div>

          {/* Terminal log output area */}
          <div className="flex-1 overflow-y-auto max-h-[140px] font-mono text-[10px] text-emerald-400/90 py-3 flex flex-col gap-1.5 scrollbar-thin">
            {terminalHistory.map((log, index) => (
              <div key={index} className="leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
))}
          </div>

          {/* Drawing rendering micro-interaction */}
          <div className="absolute right-4 bottom-16 w-16 h-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              {lastExecutedCommand === 'CIRCLE' && (
                <circle cx="50" cy="50" r="30" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" strokeDashoffset="0" />
)}
              {lastExecutedCommand === 'LINE' && (
                <line x1="15" y1="85" x2="85" y2="15" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand === 'ARC' && (
                <path d="M 20 80 A 40 40 0 0 1 80 80" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand === 'RECTANGLE' && (
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="#60a5fa" strokeWidth="4" className="animate-[dash_1.5s_ease-in-out_infinite]" strokeDasharray="200" />
)}
              {lastExecutedCommand && !['CIRCLE', 'LINE', 'ARC', 'RECTANGLE'].includes(lastExecutedCommand) && (
                <text x="50" y="55" fontSize="10" textAnchor="middle" fill="#60a5fa" className="animate-bounce font-mono">
                  {lastExecutedCommand}
                </text>
)}
              {!lastExecutedCommand && (
                <text x="50" y="55" fontSize="8" textAnchor="middle" fill="#475569" className="font-mono">
                  WAITING
                </text>
)}
            </svg>
          </div>

          {/* Terminal input form */}
          <form onSubmit={handleTerminalSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
            <span className="text-emerald-500 font-mono font-bold text-xs flex items-center">CAD&gt;</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="For example: C, L, REINIT, PL..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none border-none p-0"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono text-[10px] cursor-pointer"
            >
              send
            </button>
          </form>

        </div>
      </div>

      {/* Premium Wallpaper Generator Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h2 className="text-slate-900 font-black text-lg tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" /> CAD Command Line Shortcut Wallpaper Designer
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
            High-Resolution Desktop & Mobile Wallpaper Generator (Linkable Asset)
          </p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Configure your customized command line aliases into a beautiful minimalist, engineering blueprint, or retro cyberpunk desktop wallpaper. Display your daily drawing cheatsheet on your screen for quick lookup.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Canvas Live Preview Area */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl p-4 flex flex-col justify-center items-center border border-slate-800 shadow-inner min-h-[280px]">
            <span className="text-[10px] font-mono text-slate-500 mb-3 flex items-center gap-1.5 uppercase tracking-widest">
              <Eye className="w-3.5 h-3.5" /> Real-time Live Preview Thumbnail
            </span>
            <div className="w-full flex justify-center items-center flex-1">
              <canvas
                ref={canvasRef}
                className={`border border-slate-800 rounded-xl shadow-lg bg-slate-900 cursor-pointer max-w-full transition-all duration-300 ${
                  wallpaperResolution === 'phone' ? 'aspect-[9/16] max-h-[280px] w-auto' : 'aspect-[16/9] max-h-[220px] w-full'
                }`}
              />
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-2">
              Dimensions: {wallpaperResolution === 'phone' ? '1080 × 1920 (Mobile)' : wallpaperResolution === '1080p' ? '1920 × 1080 (FHD)' : '3840 × 2160 (4K UHD)'}
            </span>
          </div>

          {/* Right: Customization Controls */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              {/* 1. Theme Picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">1. Wallpaper Aesthetics Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'minimalist', name: 'Minimalist Tech', desc: 'Clean Light Gray', bg: 'bg-slate-50 border-slate-200 text-slate-800' },
                    { id: 'blueprint', name: 'Classic Blueprint', desc: 'Engineering Blue', bg: 'bg-blue-950 border-blue-900 text-blue-200' },
                    { id: 'cyberpunk', name: 'Cyber Neon', desc: 'Terminal Dark', bg: 'bg-emerald-950/45 border-emerald-900/40 text-emerald-300' }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setWallpaperTheme(theme.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all active:scale-95 cursor-pointer ${theme.bg} ${
                        wallpaperTheme === theme.id ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02] shadow-sm' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <span className="font-bold text-xs">{theme.name}</span>
                      <span className="text-[9px] opacity-75">{theme.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Resolution Picker */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">2. Canvas Dimension Ratio</label>
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 w-full sm:w-auto inline-flex">
                  {[
                    { id: '4k', label: '4K UHD (3840x2160)' },
                    { id: '1080p', label: '1080p (1920x1080)' },
                    { id: 'phone', label: 'Phone Portrait (1080x1920)' }
                  ].map(res => (
                    <button
                      key={res.id}
                      onClick={() => setWallpaperResolution(res.id as any)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        wallpaperResolution === res.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Aliases Selector list */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">3. Select Shortcuts to Render ({selectedAliases.length} selected)</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAliases(aliases.slice(0, 16).map(a => a.alias))}
                      className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Default Top 16
                    </button>
                    <button
                      onClick={() => setSelectedAliases(aliases.map(a => a.alias))}
                      className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedAliases([])}
                      className="text-[9px] font-bold text-slate-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {/* Scrollable list of aliases checkable */}
                <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 max-h-[120px] overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-2 scrollbar-thin">
                  {aliases.map(item => {
                    const isChecked = selectedAliases.includes(item.alias);
                    return (
                      <label
                        key={item.alias}
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[10px] cursor-pointer transition-all hover:bg-white select-none ${
                          isChecked ? 'border-blue-100 bg-white font-black text-slate-900' : 'border-slate-100 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAliases(prev => [...prev, item.alias]);
                            } else {
                              setSelectedAliases(prev => prev.filter(a => a !== item.alias));
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3 cursor-pointer"
                        />
                        <span className="font-mono">{item.alias}</span>
                        <span className="opacity-60 truncate">({item.command})</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Download wallpaper button */}
            <button
              onClick={handleDownloadWallpaper}
              disabled={selectedAliases.length === 0}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer w-full text-center"
            >
              <Download className="w-4 h-4" />
              Generate & Download High-Resolution Wallpaper (.PNG)
            </button>
          </div>
        </div>
      </div>

      {/* Default management and editor table */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              📋 Shortcut list editor
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              ⚡ Quickly load official presets
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for shortcut keys or commands..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-700"
            />
          </div>
        </div>

        {/* Official default Tab view */}
        {activeTab === 'presets' && (
          <div className="py-6 flex flex-col gap-6">
            <div>
              <h3 className="text-slate-800 font-bold text-sm">Select a basic development preset</h3>
              <p className="text-xs text-slate-400 mt-1">You can load the factory default alias libraries of major CAD platforms with one click here., Use this as a blueprint for secondary customization. </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">AutoCAD Official</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-2">AutoCAD Official default shortcut key preset</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Including C (Circle), L (Line), PL (Pline), etc. 30 An official high-frequency alias. </p>
                </div>
                <button
                  onClick={() => { loadPreset('autocad'); setActiveTab('editor'); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer"
                >
                  Load AutoCAD preset
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">GstarCAD Official</span>
                  <h4 className="font-bold text-slate-800 text-sm mt-2">Haochen CAD official default shortcut key presets</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Integrated Haochen&apos;s unique instructions (such as workspace switching, shortcut alias for extended commands, etc.). </p>
                </div>
                <button
                  onClick={() => { loadPreset('gstarcad'); setActiveTab('editor'); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center cursor-pointer"
                >
                  Load Haochen CAD preset
                </button>
              </div>
            </div>
          </div>
)}

        {/* Table Editor Tab View */}
        {activeTab === 'editor' && (
          <div className="flex flex-col gap-6">
            
            {/* Added alias input field */}
            <form onSubmit={handleAddAlias} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-end gap-3">
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick aliases (such as: C)</label>
                <input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="C"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono font-bold text-slate-800 uppercase"
                />
              </div>

              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Point to CAD command (Such as: CIRCLE)</label>
                <input
                  type="text"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  placeholder="CIRCLE"
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-mono font-bold text-slate-800 uppercase"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer w-full md:w-auto h-[38px] flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add alias item
              </button>
            </form>

            {/* List rendering */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-3 px-4 w-[160px]">Alias</th>
                    <th className="py-3 px-4">Mapping CAD commands (Command)</th>
                    <th className="py-3 px-4 w-[100px] text-center">Status check</th>
                    <th className="py-3 px-4 w-[80px] text-center">Operation</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-600">
                  {filteredAliases.map((item, idx) => {
                    const count = aliasCounts[item.alias] || 0;
                    const isConflict = count > 1;

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-slate-50 hover:bg-slate-50/40 transition-colors ${
                          isConflict ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={item.alias}
                            onChange={(e) => handleCellEdit(idx, 'alias', e.target.value)}
                            className="bg-transparent font-bold text-slate-900 border-b border-transparent focus:border-slate-300 focus:outline-none w-full uppercase py-1"
                          />
                        </td>
                        <td className="py-2.5 px-4 font-mono">
                          <input
                            type="text"
                            value={item.command}
                            onChange={(e) => handleCellEdit(idx, 'command', e.target.value)}
                            className="bg-transparent text-slate-700 border-b border-transparent focus:border-slate-300 focus:outline-none w-full uppercase py-1"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {isConflict ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                              <AlertTriangle className="w-3 h-3" />
                              Alias conflict
                            </span>
) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              normal
                            </span>
)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => handleDelete(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
);
                  })}
                  {filteredAliases.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                        No matching alias records, please try changing the search terms or adding new items. 
                      </td>
                    </tr>
)}
                </tbody>
              </table>
            </div>

          </div>
)}

      </div>

      {/* Geek's Guide - REINIT Effectiveness and Alias Priority */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-slate-900 font-black text-base tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            AutoCAD Advanced Guide to Shortcut Key Aliases
          </h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wide">
            AutoCAD PGP Deployment & Priority Optimization Guide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed text-slate-500">
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              1. Directly overload the REINIT mechanism from the command line
            </h4>
            <p>
              After modifying and replacing `acad.pgp`, You<b>don&apos;t need it at all</b>Close and restart the CAD software. Just use AutoCAD / Haochen CAD Enter <b>`REINIT`</b> on the command line, and in the pop-up&quot;Check &quot;Reinitialize&quot; in the small dialog box. <b>&quot;PGP File&quot;</b> option and OK, The software will recompile the shortcut key index in the memory within milliseconds, making the modifications effective immediately.. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              2. Alias conflicts and priority override rules
            </h4>
            <p>
              If the same alias is defined multiple times in a PGP file (For example, the previous line defines `C, *CIRCLE`, and the next line defines `C, *COPY`) , CAD and will not crash. Its internal read logic follows <b>&quot;Post-override-precede&quot;</b> rule. In order to ensure that your drawing cleaning and command line experience is refreshing enough and free of garbage, it is recommended to use conflict checking to eliminate duplicate and redundant items.. 
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              3. External command extension fields
            </h4>
            <p>
              PGP In addition to defining keyboard shortcut aliases, the file can also define external systems Shell command (such as calling Windows Notepad, running calculator, etc.) , The syntax format is `[command], [System Shell execution path], [Flag/Flag]`. This editor is dedicated to the core Command Purified and filtered, only the most critical graphics drawing commands are compiled and downloaded.. 
            </p>
          </div>
        </div>
      </div>

      <RelatedTools />
    </div>
);
}
