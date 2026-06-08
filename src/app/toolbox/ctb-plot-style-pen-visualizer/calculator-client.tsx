'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { RelatedTools } from '@/components/related-tools';
import { Info, Download, HelpCircle, Copy, Check, FileText, Settings, Sliders, Eye, Grid, CheckSquare, XSquare, Plus } from 'lucide-react';

interface AciColor {
  index: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  name: string;
}

// Compact, mathematically accurate AutoCAD Index Color (ACI) Generator
const generateAciColors = (): AciColor[] => {
  const list: AciColor[] = [];

  // 1. Standard ACI colors (1 to 9)
  const stdColors = [
    { r: 255, g: 0, b: 0, name: 'Red (Standard index 1)' },          // ACI 1
    { r: 255, g: 255, b: 0, name: 'Yellow (Standard index 2)' },    // ACI 2
    { r: 0, g: 255, b: 0, name: 'Green (Standard index 3)' },        // ACI 3
    { r: 0, g: 255, b: 255, name: 'Cyan (Standard index 4)' },       // ACI 4
    { r: 0, g: 0, b: 255, name: 'Blue (Standard index 5)' },         // ACI 5
    { r: 255, g: 0, b: 255, name: 'Magenta (Standard index 6)' },    // ACI 6
    { r: 255, g: 255, b: 255, name: 'White/Black (Standard index 7)' }, // ACI 7
    { r: 128, g: 128, b: 128, name: 'Dark Grey (Standard index 8)' }, // ACI 8
    { r: 192, g: 192, b: 192, name: 'Light Grey (Standard index 9)' }, // ACI 9
  ];
  stdColors.forEach((c, idx) => {
    const index = idx + 1;
    const hex = '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    list.push({ index, ...c, hex });
  });

  // 2. Grayscale ACI colors (250 to 255)
  const grays = [
    { r: 51, g: 51, b: 51, name: 'Gray (ACI 250)' },
    { r: 91, g: 91, b: 91, name: 'Gray (ACI 251)' },
    { r: 132, g: 132, b: 132, name: 'Gray (ACI 252)' },
    { r: 173, g: 173, b: 173, name: 'Gray (ACI 253)' },
    { r: 214, g: 214, b: 214, name: 'Gray (ACI 254)' },
    { r: 255, g: 255, b: 255, name: 'White (ACI 255)' },
  ];
  grays.forEach((c, idx) => {
    const index = 250 + idx;
    const hex = '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    list.push({ index, ...c, hex });
  });

  // 3. Hue grid (10 to 249)
  const baseHues = [
    [255, 0, 0, 'Red'],
    [255, 63, 0, 'Red-Orange'],
    [255, 127, 0, 'Orange'],
    [255, 191, 0, 'Yellow-Orange'],
    [255, 255, 0, 'Yellow'],
    [191, 255, 0, 'Yellow-Green'],
    [127, 255, 0, 'Green'],
    [63, 255, 0, 'Green-Cyan'],
    [0, 255, 0, 'Green'],
    [0, 255, 63, 'Cyan-Green'],
    [0, 255, 127, 'Cyan-Green-Blue'],
    [0, 255, 191, 'Cyan-Blue'],
    [0, 255, 255, 'Cyan'],
    [0, 191, 255, 'Cyan-Blue-Violet'],
    [0, 127, 255, 'Blue-Cyan'],
    [0, 63, 255, 'Blue'],
    [0, 0, 255, 'Blue'],
    [63, 0, 255, 'Blue-Indigo'],
    [127, 0, 255, 'Indigo'],
    [191, 0, 255, 'Indigo-Violet'],
    [255, 0, 255, 'Violet/Magenta'],
    [255, 0, 191, 'Magenta-Violet'],
    [255, 0, 127, 'Magenta'],
    [255, 0, 63, 'Magenta-Red'],
  ];

  const brightnessFactors = [1.0, 0.78, 0.56, 0.34, 0.12];

  for (let h = 0; h < 24; h++) {
    const [br, bg, bb, hueName] = baseHues[h];
    const baseR = br as number;
    const baseG = bg as number;
    const baseB = bb as number;
    
    for (let s = 0; s < 10; s++) {
      const index = 10 + h * 10 + s;
      const isEven = s % 2 === 0;
      const factorIndex = Math.floor(s / 2);
      const factor = brightnessFactors[factorIndex];

      let r = 0, g = 0, b = 0;
      let shadeName = '';

      if (isEven) {
        r = Math.round(baseR * factor);
        g = Math.round(baseG * factor);
        b = Math.round(baseB * factor);
        shadeName = `${hueName} (Shade ${factorIndex + 1})`;
      } else {
        const mixR = (baseR + 255) / 2;
        const mixG = (baseG + 255) / 2;
        const mixB = (baseB + 255) / 2;

        r = Math.round(mixR * factor);
        g = Math.round(mixG * factor);
        b = Math.round(mixB * factor);
        shadeName = `${hueName} (Pastel Shade ${factorIndex + 1})`;
      }

      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      list.push({ index, r, g, b, hex, name: shadeName });
    }
  }

  return list.sort((a, b) => a.index - b.index);
};

const ACI_COLORS_DB = generateAciColors();

// Standard Lineweight List (mm)
const STANDARD_LINEWEIGHTS = [
  { value: -1, label: 'Use Object Lineweight' },
  { value: 0.00, label: '0.00 mm (Hairline)' },
  { value: 0.05, label: '0.05 mm' },
  { value: 0.09, label: '0.09 mm' },
  { value: 0.13, label: '0.13 mm' },
  { value: 0.15, label: '0.15 mm' },
  { value: 0.18, label: '0.18 mm (Thin)' },
  { value: 0.20, label: '0.20 mm' },
  { value: 0.25, label: '0.25 mm (Standard Medium)' },
  { value: 0.30, label: '0.30 mm' },
  { value: 0.35, label: '0.35 mm (Medium-Thick)' },
  { value: 0.40, label: '0.40 mm' },
  { value: 0.50, label: '0.50 mm (Thick)' },
  { value: 0.53, label: '0.53 mm' },
  { value: 0.60, label: '0.60 mm' },
  { value: 0.70, label: '0.70 mm (Extra Thick)' },
  { value: 0.80, label: '0.80 mm' },
  { value: 0.90, label: '0.90 mm' },
  { value: 1.00, label: '1.00 mm (Heavy Border)' },
  { value: 1.06, label: '1.06 mm' },
  { value: 1.20, label: '1.20 mm' },
  { value: 1.40, label: '1.40 mm' },
  { value: 2.00, label: '2.00 mm' },
  { value: 2.11, label: '2.11 mm' },
];

interface PlotStyleConfig {
  index: number;
  plotColorType: 'object' | 'black' | 'grayscale' | 'custom';
  customColorHex?: string;
  screening: number; // 0 - 100
  lineweight: number; // in mm, -1 for default
  linetype: 'object' | 'solid' | 'dashed' | 'dotted' | 'dashdot';
}

type PreconfigPreset = 'monochrome' | 'acad' | 'grayscale';

export default function CtbPlotStyleClient() {
  const [configs, setConfigs] = useState<Record<number, PlotStyleConfig>>({});
  const [selectedPreset, setSelectedPreset] = useState<PreconfigPreset>('monochrome');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([1]); // Default select ACI 1
  const [activeTab, setActiveTab] = useState<'model' | 'plot'>('plot');
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<'all' | 'standard' | 'grayscale'>('all');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Configurations based on Preset Selection
  const initPreset = (presetType: PreconfigPreset) => {
    const newConfigs: Record<number, PlotStyleConfig> = {};
    
    ACI_COLORS_DB.forEach((color) => {
      if (presetType === 'monochrome') {
        // Monochrome setup
        let lw = -1; // Default Use Object Lineweight
        // AutoCAD Standard monochrome default weights mapping for 1-9
        if (color.index === 1) lw = 0.18; // Red
        else if (color.index === 2) lw = 0.25; // Yellow
        else if (color.index === 3) lw = 0.35; // Green
        else if (color.index === 4) lw = 0.50; // Cyan
        else if (color.index === 5) lw = 0.70; // Blue
        else if (color.index === 6) lw = 0.18; // Magenta
        else if (color.index === 7) lw = 0.25; // White
        else if (color.index === 8) lw = 0.15; // Dark Grey
        else if (color.index === 9) lw = 0.15; // Light Grey

        newConfigs[color.index] = {
          index: color.index,
          plotColorType: 'black',
          customColorHex: '#000000',
          screening: 100,
          lineweight: lw,
          linetype: 'object',
        };
      } else if (presetType === 'acad') {
        // Normal Color Output
        newConfigs[color.index] = {
          index: color.index,
          plotColorType: 'object',
          screening: 100,
          lineweight: -1,
          linetype: 'object',
        };
      } else if (presetType === 'grayscale') {
        // Grayscale setup
        newConfigs[color.index] = {
          index: color.index,
          plotColorType: 'grayscale',
          screening: 100,
          lineweight: -1,
          linetype: 'object',
        };
      }
    });

    setConfigs(newConfigs);
  };

  // Run initial loading
  useEffect(() => {
    // Initializes derived config from the selected preset.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initPreset(selectedPreset);
  }, [selectedPreset]);

  // Handle Preset Reset click
  const handlePresetReset = (preset: PreconfigPreset) => {
    setSelectedPreset(preset);
    initPreset(preset);
  };

  // Filter ACI colors grid based on search query and category filters
  const filteredColors = useMemo(() => {
    return ACI_COLORS_DB.filter((c) => {
      const matchesSearch = 
        c.index.toString() === searchQuery.trim() || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hex.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        colorFilter === 'all' ||
        (colorFilter === 'standard' && c.index <= 9) ||
        (colorFilter === 'grayscale' && c.index >= 250);

      return (searchQuery === '' ? true : matchesSearch) && matchesFilter;
    });
  }, [searchQuery, colorFilter]);

  // Handle Color Block click selection
  const handleColorClick = (index: number, e: React.MouseEvent) => {
    if (isBatchMode || e.ctrlKey || e.metaKey) {
      if (selectedIndices.includes(index)) {
        if (selectedIndices.length > 1) {
          setSelectedIndices(selectedIndices.filter((i) => i !== index));
        }
      } else {
        setSelectedIndices([...selectedIndices, index]);
      }
    } else if (e.shiftKey && selectedIndices.length > 0) {
      // Shift Select range
      const lastSelected = selectedIndices[selectedIndices.length - 1];
      const start = Math.min(lastSelected, index);
      const end = Math.max(lastSelected, index);
      
      const newRange: number[] = [];
      for (let i = start; i <= end; i++) {
        if (ACI_COLORS_DB.some((color) => color.index === i)) {
          newRange.push(i);
        }
      }
      setSelectedIndices(Array.from(new Set([...selectedIndices, ...newRange])));
    } else {
      setSelectedIndices([index]);
    }
  };

  // Shortcuts to select standard groupings
  const selectQuickGroup = (type: 'standard' | 'grays' | 'all' | 'clear') => {
    if (type === 'standard') {
      setSelectedIndices([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    } else if (type === 'grays') {
      setSelectedIndices([250, 251, 252, 253, 254, 255]);
    } else if (type === 'all') {
      setSelectedIndices(ACI_COLORS_DB.map((c) => c.index));
    } else if (type === 'clear') {
      setSelectedIndices([1]);
    }
  };

  // Get active edit configuration (shows values of first selection, or blended state)
  const editConfig = useMemo(() => {
    if (selectedIndices.length === 0) return null;
    const firstConfig = configs[selectedIndices[0]];
    if (!firstConfig) return null;

    // Check if properties are unified across all selections
    const isMulti = selectedIndices.length > 1;
    const plotColorType = selectedIndices.every(i => configs[i]?.plotColorType === firstConfig.plotColorType) 
      ? firstConfig.plotColorType : ('object' as const); // Fallback
    const customColorHex = selectedIndices.every(i => configs[i]?.customColorHex === firstConfig.customColorHex) 
      ? firstConfig.customColorHex : '#000000';
    const screening = selectedIndices.every(i => configs[i]?.screening === firstConfig.screening) 
      ? firstConfig.screening : 100;
    const lineweight = selectedIndices.every(i => configs[i]?.lineweight === firstConfig.lineweight) 
      ? firstConfig.lineweight : -1;
    const linetype = selectedIndices.every(i => configs[i]?.linetype === firstConfig.linetype) 
      ? firstConfig.linetype : ('object' as const);

    return {
      isMulti,
      plotColorType,
      customColorHex,
      screening,
      lineweight,
      linetype
    };
  }, [selectedIndices, configs]);

  // Bulk update properties for all selected indices
  const updateSelectedConfig = <K extends keyof PlotStyleConfig>(key: K, value: PlotStyleConfig[K]) => {
    setConfigs((prev) => {
      const updated = { ...prev };
      selectedIndices.forEach((idx) => {
        if (updated[idx]) {
          updated[idx] = {
            ...updated[idx],
            [key]: value
          };
        }
      });
      return updated;
    });
  };

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI Canvas scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Helper: Map color based on CTB rules
    const getPlotColor = (aciIndex: number): string => {
      const config = configs[aciIndex];
      const aciColor = ACI_COLORS_DB.find((c) => c.index === aciIndex);
      if (!config || !aciColor) return '#ffffff';

      if (activeTab === 'model') {
        // AutoCAD Model space is black backdrop, color is ACI color itself
        if (aciIndex === 7) return '#ffffff'; // White displays as white on dark backdrop
        return aciColor.hex;
      } else {
        // Plot space is white backdrop
        const type = config.plotColorType;
        let baseColor = '#000000';
        
        if (type === 'object') {
          // White color index 7 plots as black on white paper
          baseColor = aciIndex === 7 ? '#000000' : aciColor.hex;
        } else if (type === 'black') {
          baseColor = '#000000';
        } else if (type === 'grayscale') {
          // Standard ITU-R BT.601 Grayscale weights
          const gray = Math.round(0.299 * aciColor.r + 0.587 * aciColor.g + 0.114 * aciColor.b);
          baseColor = `rgb(${gray},${gray},${gray})`;
        } else if (type === 'custom') {
          baseColor = config.customColorHex || '#000000';
        }

        // Apply Screening (Opacity mixing with White backdrop)
        const screeningPercent = config.screening / 100;
        if (screeningPercent < 1.0) {
          // Extract RGB from hex or rgb string
          let r = 0, g = 0, b = 0;
          if (baseColor.startsWith('#')) {
            r = parseInt(baseColor.slice(1, 3), 16);
            g = parseInt(baseColor.slice(3, 5), 16);
            b = parseInt(baseColor.slice(5, 7), 16);
          } else if (baseColor.startsWith('rgb')) {
            const matches = baseColor.match(/\d+/g);
            if (matches && matches.length >= 3) {
              r = parseInt(matches[0]);
              g = parseInt(matches[1]);
              b = parseInt(matches[2]);
            }
          }
          // Linear blend with White background (255, 255, 255)
          const finalR = Math.round(r * screeningPercent + 255 * (1 - screeningPercent));
          const finalG = Math.round(g * screeningPercent + 255 * (1 - screeningPercent));
          const finalB = Math.round(b * screeningPercent + 255 * (1 - screeningPercent));
          return `rgb(${finalR}, ${finalG}, ${finalB})`;
        }

        return baseColor;
      }
    };

    // Helper: Set Lineweight based on configuration
    const setContextLineweight = (aciIndex: number) => {
      if (activeTab === 'model') {
        ctx.lineWidth = 1; // Default thin lines in model space
        return;
      }
      
      const config = configs[aciIndex];
      const defaultWeight = 0.25; // 0.25mm default
      let lw = defaultWeight;
      
      if (config && config.lineweight !== -1) {
        lw = config.lineweight;
      }

      // Convert mm size to canvas pixels (approx. Scale factor 5.5 for display crispness)
      ctx.lineWidth = Math.max(0.6, lw * 6.5);
    };

    // Helper: Set Linetype based on configuration
    const setContextLinetype = (aciIndex: number) => {
      const config = configs[aciIndex];
      if (!config || config.linetype === 'object') {
        // Fallback or use standard object assignment based on index
        if (aciIndex === 1) {
          // Center lines (Red) usually dashed in drafts
          ctx.setLineDash([8, 6]);
        } else {
          ctx.setLineDash([]);
        }
        return;
      }

      const type = config.linetype;
      if (type === 'solid') ctx.setLineDash([]);
      else if (type === 'dashed') ctx.setLineDash([10, 6]);
      else if (type === 'dotted') ctx.setLineDash([2, 5]);
      else if (type === 'dashdot') ctx.setLineDash([12, 4, 2, 4]);
    };

    // 1. Draw Backdrop
    if (activeTab === 'model') {
      ctx.fillStyle = '#0f172a'; // Deep Navy slate background (AutoCAD Model Space)
      ctx.fillRect(0, 0, width, height);

      // Model Space fine coordinate Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      const gridSize = 25;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ffffff'; // White Plotting Paper space
      ctx.fillRect(0, 0, width, height);

      // Light gray paper border shadow
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    }

    // 2. Draw AutoCAD Elements based on CTB color mappings

    // Element A: Title Block Border (ACI 7 - White/Black)
    ctx.strokeStyle = getPlotColor(7);
    setContextLineweight(7);
    ctx.setLineDash([]);
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.strokeRect(width - 150, height - 100, 135, 85);

    // Title Block text labels
    ctx.fillStyle = getPlotColor(7);
    ctx.font = '10px monospace';
    ctx.fillText('CADGUIDE.TOOLS CTB DEMO', width - 142, height - 80);
    ctx.fillText('SCALE: 1:50', width - 142, height - 60);
    ctx.fillText('LAYOUT: PAPER-SPACE', width - 142, height - 40);
    ctx.fillText(`ACTIVE ACI MAPPING`, width - 142, height - 20);

    // Element B: Center Reference Grid Axes (ACI 1 - Red, Dashed)
    ctx.strokeStyle = getPlotColor(1);
    setContextLineweight(1);
    setContextLinetype(1);
    ctx.beginPath();
    // Horizontal axis line
    ctx.moveTo(25, height / 2 - 20);
    ctx.lineTo(width - 25, height / 2 - 20);
    // Vertical axes
    ctx.moveTo(110, 25);
    ctx.lineTo(110, height - 25);
    ctx.moveTo(width - 200, 25);
    ctx.lineTo(width - 200, height - 25);
    ctx.stroke();

    // Element C: Structural Concrete Wall Hatch (ACI 8 - Dark Grey, solid diagonal strokes)
    ctx.strokeStyle = getPlotColor(8);
    setContextLineweight(8);
    setContextLinetype(8);
    ctx.beginPath();
    // Hatch lines within wall bounds
    const wallLeft = 80;
    const wallRight = 320;
    const wallTop = 80;
    const wallBottom = 260;
    const wallThick = 24;

    // Draw wall hatching lines (45 degree offset)
    const drawHatch = (x1: number, y1: number, w: number, h: number) => {
      ctx.save();
      ctx.rect(x1, y1, w, h);
      ctx.clip();
      ctx.beginPath();
      for (let offset = -h; offset < w; offset += 12) {
        ctx.moveTo(x1 + offset, y1);
        ctx.lineTo(x1 + offset + h, y1 + h);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Draw hatch on outer rooms
    drawHatch(wallLeft, wallTop, wallRight - wallLeft, wallThick);
    drawHatch(wallLeft, wallTop + wallThick, wallThick, wallBottom - wallTop - wallThick);
    drawHatch(wallLeft, wallBottom - wallThick, wallRight - wallLeft, wallThick);
    drawHatch(wallRight - wallThick, wallTop + wallThick, wallThick, wallBottom - wallTop - wallThick);
    
    // Element D: Outer Wall Outline Frames (ACI 3 - Green, Heavy lines)
    ctx.strokeStyle = getPlotColor(3);
    setContextLineweight(3);
    setContextLinetype(3);
    ctx.strokeRect(wallLeft, wallTop, wallRight - wallLeft, wallBottom - wallTop);
    ctx.strokeRect(wallLeft + wallThick, wallTop + wallThick, wallRight - wallLeft - 2 * wallThick, wallBottom - wallTop - 2 * wallThick);

    // Element E: Inner Architectural Furniture Placement (ACI 4 - Cyan, thin continuous line)
    ctx.strokeStyle = getPlotColor(4);
    setContextLineweight(4);
    setContextLinetype(4);
    // Draw table & chairs outline inside the room
    const cx = (wallLeft + wallRight) / 2;
    const cy = (wallTop + wallBottom) / 2;
    // Draw Round Table
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.stroke();
    // Draw 4 chairs
    ctx.strokeRect(cx - 10, cy - 48, 20, 12);
    ctx.strokeRect(cx - 10, cy + 36, 20, 12);
    ctx.strokeRect(cx - 48, cy - 10, 12, 20);
    ctx.strokeRect(cx + 36, cy - 10, 12, 20);

    // Element F: Foliage / Room Plants (ACI 5 - Blue, medium line weight)
    ctx.strokeStyle = getPlotColor(5);
    setContextLineweight(5);
    setContextLinetype(5);
    // Flower pot circle
    ctx.beginPath();
    ctx.arc(wallLeft + 50, wallBottom - 50, 14, 0, Math.PI * 2);
    ctx.stroke();
    // Inner leaves arcs
    ctx.beginPath();
    ctx.arc(wallLeft + 44, wallBottom - 52, 10, 0, Math.PI, true);
    ctx.arc(wallLeft + 56, wallBottom - 48, 10, Math.PI, 0, true);
    ctx.stroke();

    // Element G: Dimensions Reference & Extension Arrows (ACI 2 - Yellow, fine crisp lines)
    ctx.strokeStyle = getPlotColor(2);
    setContextLineweight(2);
    setContextLinetype(2);
    // Dimension line offsets
    const dimY = wallTop - 22;
    ctx.beginPath();
    // Main dimension line
    ctx.moveTo(wallLeft, dimY);
    ctx.lineTo(wallRight, dimY);
    // Extension line left
    ctx.moveTo(wallLeft, wallTop - 5);
    ctx.lineTo(wallLeft, dimY - 6);
    // Extension line right
    ctx.moveTo(wallRight, wallTop - 5);
    ctx.lineTo(wallRight, dimY - 6);
    ctx.stroke();

    // Draw dimension tick marks (AutoCAD Architect Ticks)
    ctx.beginPath();
    ctx.moveTo(wallLeft - 4, dimY + 4);
    ctx.lineTo(wallLeft + 4, dimY - 4);
    ctx.moveTo(wallRight - 4, dimY + 4);
    ctx.lineTo(wallRight + 4, dimY - 4);
    ctx.stroke();

    // Dimension label text
    ctx.fillStyle = getPlotColor(2);
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('12,000 mm', cx, dimY - 6);

  }, [configs, activeTab]);

  // Export to PCP Plot Parameters File
  const handleExportPcp = () => {
    let output = `; CADGuide.tools AutoCAD CTB to PCP Plot Pen Configuration Map\n`;
    output += `; Generated date: ${new Date().toLocaleDateString()}\n`;
    output += `; Preset base: ${selectedPreset}\n\n`;
    output += `[PenMap]\n`;

    for (let i = 1; i <= 255; i++) {
      const conf = configs[i];
      if (!conf) continue;
      
      let pColor = 0; // standard pen behavior
      if (conf.plotColorType === 'black') pColor = 7; // Plot color mapped to Black
      else if (conf.plotColorType === 'grayscale') pColor = 8; // Grayscale proxy
      else if (conf.plotColorType === 'custom') pColor = 7; // Custom fallback to black
      
      const widthMm = conf.lineweight === -1 ? 0.25 : conf.lineweight;
      const screeningVal = conf.screening;

      // Format: PenIndex = ColorIndex, Lineweight(mm), Screening(%)
      output += `Pen${i}=${pColor}, ${widthMm.toFixed(2)}, ${screeningVal}\n`;
    }

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadtools_${selectedPreset}_plot_style.pcp`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON Map settings
  const handleExportJson = () => {
    const dataStr = JSON.stringify(configs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cadtools_ctb_config_${selectedPreset}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import custom JSON setup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Basic schema verification
        if (typeof parsed === 'object' && parsed['1']) {
          setConfigs({ ...configs, ...parsed });
          alert('Plot settings loaded successfully!');
        } else {
          alert('Invalid file format. Please upload a configuration file previously exported by this tool.');
        }
      } catch {
        alert('Error parsing config file.');
      }
    };
    reader.readAsText(file);
  };

  // Generate copyable markdown snippet of modified colors
  const handleCopyMarkdown = () => {
    let md = `| AutoCAD Color Index (ACI) | Plot Color Mapping | Lineweight (mm) | Screening | Linetype |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    
    let modifiedCount = 0;
    for (let i = 1; i <= 255; i++) {
      const conf = configs[i];
      if (!conf) continue;

      // Determine if modified from default Use Object setup
      const isDefault = 
        conf.plotColorType === 'object' && 
        conf.lineweight === -1 && 
        conf.screening === 100 && 
        conf.linetype === 'object';
      
      if (!isDefault) {
        modifiedCount++;
        const aciColor = ACI_COLORS_DB.find((c) => c.index === i);
        const colorName = aciColor ? `${aciColor.name} (ACI ${i})` : `ACI ${i}`;
        const colorMap = conf.plotColorType === 'object' ? 'Use Object Color' : 
                          conf.plotColorType === 'black' ? 'Black' : 
                          conf.plotColorType === 'grayscale' ? 'Grayscale' : `Custom (${conf.customColorHex})`;
        const lw = conf.lineweight === -1 ? 'Use Object Default' : `${conf.lineweight} mm`;
        
        md += `| **${colorName}** | ${colorMap} | ${lw} | ${conf.screening}% | ${conf.linetype} |\n`;
      }
    }

    if (modifiedCount === 0) {
      md = `All 255 ACI colors are currently utilizing default CAD plot mappings (acad.ctb preset style).`;
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  // Number of changed pens count
  const modifiedPensCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 255; i++) {
      const conf = configs[i];
      if (!conf) continue;
      const isDefault = 
        conf.plotColorType === 'object' && 
        conf.lineweight === -1 && 
        conf.screening === 100 && 
        conf.linetype === 'object';
      if (!isDefault) count++;
    }
    return count;
  }, [configs]);

  return (
    <div className="space-y-12">
      {/* Upper Panel: Layout Controls & Canvas Viewport Splitter */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Real-time Plot Canvas Simulator */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" /> Plot Style Sheet Blueprint Simulator
              </h2>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">
                Visualizing lines mapping matching rule changes
              </p>
            </div>
            
            {/* Model/Paper Tabs */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 self-stretch sm:self-auto">
              <button
                onClick={() => setActiveTab('model')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'model'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Model View (CAD Black)
              </button>
              <button
                onClick={() => setActiveTab('plot')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'plot'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Plot Preview (Paper White)
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative bg-slate-950 aspect-[3/2] w-full rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner flex items-center justify-center">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full object-contain"
              style={{ minHeight: '300px' }}
            />
            
            {/* Quick Badge indicator */}
            <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest bg-slate-900/80 text-white/90 uppercase border border-white/10 backdrop-blur-sm">
              {activeTab === 'model' ? 'AutoCAD Space' : `${selectedPreset.toUpperCase()} Active`}
            </div>
          </div>

          {/* Preset Buttons Bar */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handlePresetReset('monochrome')}
              className={`p-3 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                selectedPreset === 'monochrome'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>monochrome.ctb</span>
              <span className="text-[9px] opacity-75 font-semibold">100% Black Ink (Drafting Std)</span>
            </button>
            <button
              onClick={() => handlePresetReset('acad')}
              className={`p-3 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                selectedPreset === 'acad'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>acad.ctb</span>
              <span className="text-[9px] opacity-75 font-semibold">Use Object Color (Full Color)</span>
            </button>
            <button
              onClick={() => handlePresetReset('grayscale')}
              className={`p-3 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                selectedPreset === 'grayscale'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>grayscale.ctb</span>
              <span className="text-[9px] opacity-75 font-semibold">Luminance Grayscale Conversion</span>
            </button>
          </div>
        </div>

        {/* Right Side: Properties Sidebar Editor */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" /> Pen Properties Panel
              </h2>
              <span className="text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                {selectedIndices.length} Selected
              </span>
            </div>

            {/* Selection Overview Container */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Editing Color Target:
              </div>
              
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedIndices.map((idx) => {
                  const c = ACI_COLORS_DB.find((item) => item.index === idx);
                  if (!c) return null;
                  return (
                    <div 
                      key={idx}
                      className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-750 px-2.5 py-1 rounded-xl text-xs font-black border border-slate-700/50 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>Color {idx}</span>
                    </div>
                  );
                })}
              </div>

              {selectedIndices.length === 1 && (
                <div className="text-[10px] text-slate-400 font-bold leading-relaxed border-t border-slate-800 pt-2 flex justify-between">
                  <span>Name: {ACI_COLORS_DB.find(i => i.index === selectedIndices[0])?.name}</span>
                  <span>RGB: ({ACI_COLORS_DB.find(i => i.index === selectedIndices[0])?.r}, {ACI_COLORS_DB.find(i => i.index === selectedIndices[0])?.g}, {ACI_COLORS_DB.find(i => i.index === selectedIndices[0])?.b})</span>
                </div>
              )}
            </div>
          </div>

          {/* Properties Forms fields */}
          {editConfig ? (
            <div className="space-y-5 flex-1 pt-2">
              
              {/* Plot Color Mapping Select */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                  <span>1. Plot Color Mapping</span>
                  <span className="text-[10px] text-blue-400 lowercase">AutoCAD Color Style</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSelectedConfig('plotColorType', 'black')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      editConfig.plotColorType === 'black'
                        ? 'bg-white text-slate-900 border-white shadow'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Force Black Ink
                  </button>
                  <button
                    onClick={() => updateSelectedConfig('plotColorType', 'object')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      editConfig.plotColorType === 'object'
                        ? 'bg-white text-slate-900 border-white shadow'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Use Object Color
                  </button>
                  <button
                    onClick={() => updateSelectedConfig('plotColorType', 'grayscale')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      editConfig.plotColorType === 'grayscale'
                        ? 'bg-white text-slate-900 border-white shadow'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Grayscale Output
                  </button>
                  <button
                    onClick={() => updateSelectedConfig('plotColorType', 'custom')}
                    className={`py-2 px-3 rounded-xl text-xs font-black border transition-all ${
                      editConfig.plotColorType === 'custom'
                        ? 'bg-white text-slate-900 border-white shadow'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    Custom Color RGB
                  </button>
                </div>
                
                {editConfig.plotColorType === 'custom' && (
                  <div className="flex items-center gap-3 pt-2 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                    <input 
                      type="color" 
                      value={editConfig.customColorHex}
                      onChange={(e) => updateSelectedConfig('customColorHex', e.target.value)}
                      className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none"
                    />
                    <input 
                      type="text" 
                      value={editConfig.customColorHex}
                      onChange={(e) => updateSelectedConfig('customColorHex', e.target.value)}
                      className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono w-full text-white uppercase focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Lineweight Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wide flex justify-between">
                  <span>2. Lineweight (Pen Width)</span>
                  <span className="text-[10px] text-blue-400 font-mono">mm</span>
                </label>
                <select
                  value={editConfig.lineweight}
                  onChange={(e) => updateSelectedConfig('lineweight', parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4.5 py-3 text-xs font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white"
                >
                  {STANDARD_LINEWEIGHTS.map((lw) => (
                    <option key={lw.value} value={lw.value} className="bg-slate-900">
                      {lw.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linetype Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wide">
                  3. Vector Linetype
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'object', label: 'Use Object' },
                    { id: 'solid', label: 'Solid Line' },
                    { id: 'dashed', label: 'Dashed' },
                    { id: 'dotted', label: 'Dotted' },
                    { id: 'dashdot', label: 'DashDot' },
                  ].map((lt) => (
                    <button
                      key={lt.id}
                      onClick={() => updateSelectedConfig('linetype', lt.id as PlotStyleConfig['linetype'])}
                      className={`py-2.5 px-1 rounded-xl text-[10px] font-black border transition-all ${
                        editConfig.linetype === lt.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screening Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-wide">
                  <span>4. Screening (Ink Density)</span>
                  <span className="text-blue-400 font-mono text-sm">{editConfig.screening}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editConfig.screening}
                  onChange={(e) => updateSelectedConfig('screening', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[8px] text-slate-500 font-bold">
                  <span>0% (Faded Out)</span>
                  <span>50% (Watermark tint)</span>
                  <span>100% (Solid Ink)</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 py-12 flex flex-col items-center justify-center text-slate-500 text-center">
              <Settings className="w-12 h-12 stroke-[1.5] mb-3 animate-spin" />
              <p className="text-sm font-semibold">Select colors on the grid to change settings</p>
            </div>
          )}

          {/* Sidebar Action utilities */}
          <div className="border-t border-slate-800 pt-5 space-y-3.5">
            <div className="flex gap-3">
              <button
                onClick={handleExportPcp}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs py-3 px-4.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" /> Export PCP Pen File
              </button>
              <button
                onClick={handleExportJson}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-black text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                title="Backup active settings as JSON configuration"
              >
                <FileText className="w-4 h-4" /> Save Config
              </button>
            </div>

            {/* Custom Import Label trigger */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 bg-slate-950/30 p-3 rounded-xl border border-slate-850">
              <span>Import backup JSON style:</span>
              <label className="cursor-pointer text-blue-400 hover:text-blue-300 font-black flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Upload File
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

      </div>

      {/* Lower Panel: Interactive Color Matrix Grid Area */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Color Panel Header & Filter Tools */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
              <Grid className="w-5 h-5 text-blue-600" /> AutoCAD Index Color (ACI 1-255) Grid Matrix
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Currently modifying {modifiedPensCount} style mapping rules from AutoCAD defaults
            </p>
          </div>

          {/* Interactive controls filters */}
          <div className="flex flex-wrap items-center gap-3.5 w-full md:w-auto">
            {/* Search query input */}
            <input
              type="text"
              placeholder="Search by Index (e.g. 3, 252) or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 md:w-60 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            {/* Filter buttons */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5">
              <button
                onClick={() => setColorFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  colorFilter === 'all' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setColorFilter('standard')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  colorFilter === 'standard' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                1-9 Std
              </button>
              <button
                onClick={() => setColorFilter('grayscale')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                  colorFilter === 'grayscale' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                250-255 Grays
              </button>
            </div>

            {/* Selection help and settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBatchMode(!isBatchMode)}
                className={`p-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1.5 ${
                  isBatchMode 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title="Toggle multiselect mode without holding Shift key"
              >
                {isBatchMode ? <CheckSquare className="w-4 h-4" /> : <XSquare className="w-4 h-4" />}
                <span>Batch Select Mode</span>
              </button>
            </div>

          </div>
        </div>

        {/* Quick selection shortcut buttons */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="text-slate-400 self-center mr-2 text-[11px] uppercase tracking-wide font-black">Quick Select:</span>
          <button 
            onClick={() => selectQuickGroup('standard')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          >
            ACI 1-9 (Red-Light Grey)
          </button>
          <button 
            onClick={() => selectQuickGroup('grays')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          >
            ACI 250-255 (Grayscale)
          </button>
          <button 
            onClick={() => selectQuickGroup('all')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
          >
            Select All 255 Colors
          </button>
          <button 
            onClick={() => selectQuickGroup('clear')}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/50"
          >
            Clear Selections
          </button>
        </div>

        {/* 255-Color Scroll Grid container */}
        <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl">
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-3">
            {filteredColors.map((color) => {
              const isSelected = selectedIndices.includes(color.index);
              const conf = configs[color.index];
              const isPenModified = conf && (
                conf.plotColorType !== 'object' ||
                conf.lineweight !== -1 ||
                conf.screening !== 100 ||
                conf.linetype !== 'object'
              );

              return (
                <button
                  key={color.index}
                  onClick={(e) => handleColorClick(color.index, e)}
                  style={{ backgroundColor: color.hex }}
                  className={`group relative aspect-square w-full rounded-xl transition-all flex flex-col justify-between p-1.5 font-bold cursor-pointer ${
                    isSelected 
                      ? 'ring-4 ring-offset-2 ring-blue-500 scale-[1.08] z-20 shadow-md' 
                      : 'hover:scale-105 hover:z-10'
                  } border border-black/10`}
                >
                  {/* Text Color index indicator */}
                  <span className={`text-[9px] px-1 py-0.5 rounded leading-none ${
                    // Detect high lightness to use black text label
                    (color.r * 299 + color.g * 587 + color.b * 114) / 1000 > 160
                      ? 'text-black bg-white/70'
                      : 'text-white bg-black/45'
                  }`}>
                    {color.index}
                  </span>

                  {/* Tiny modified indicator dot */}
                  {isPenModified && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 border border-white rounded-full" title="Plot styling is customized" />
                  )}

                  {/* Tiny Lineweight Preview text */}
                  {conf && conf.lineweight !== -1 && (
                    <span className={`text-[7px] text-center rounded block px-0.5 ${
                      (color.r * 299 + color.g * 587 + color.b * 114) / 1000 > 160
                        ? 'text-black/80 bg-white/80'
                        : 'text-white/85 bg-black/60'
                    }`}>
                      {conf.lineweight}
                    </span>
                  )}
                </button>
              );
            })}

            {filteredColors.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-semibold">
                No matching colors found. Adjust your search.
              </div>
            )}
          </div>
        </div>

        {/* Tip banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4.5 flex gap-3 text-xs text-blue-700 leading-relaxed font-semibold">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold uppercase text-blue-800">ACI Selection Tip:</span> You can hold <kbd className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded border border-blue-200">Ctrl</kbd> (or <kbd className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded border border-blue-200">Cmd</kbd>) to toggle multiple specific colors, or hold <kbd className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded border border-blue-200">Shift</kbd> to select color blocks ranges on the ACI matrix grid. Toggle <span className="text-blue-800 underline">Batch Select Mode</span> for easy touch and click select.
          </div>
        </div>

      </div>

      {/* Copyable Layout Markdown Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Export Plot Rules Standard Table
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              Copy configured plot pen overrides directly as a markdown chart table for documentation
            </p>
          </div>

          <button
            onClick={handleCopyMarkdown}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-green-400" /> Copied Markdown!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Custom Pen Chart (Markdown)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Guide Reference Explanations details */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" /> Troubleshooting CTB Plots & Pen Styles
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">1. How to use PCP/CTB configuration files in AutoCAD</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                <strong>Importing PCP mapping settings</strong>: When running plot outputs in AutoCAD, you can import our generated `.pcp` table structure by typing the command <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">STYLEMANAGER</code>.
              </p>
              <p>
                Copy the downloaded PCP parameters file into the AutoCAD Plot Styles directory, or choose the Custom Import option inside the wizard config layout selector to apply the exact pen weights mapped from this visualizer.
              </p>
              <p>
                <strong>Setting CTB globally</strong>: Ensure your drawing is set to use color-dependent plot styles (CTB) rather than named plot styles (STB). You can toggle this using the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">CONVERTPSTYLES</code> command if your drawing properties are locked to STB formatting.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-800 tracking-wide uppercase">2. Industry standard pen thickness conventions</h4>
            <div className="space-y-3 text-xs text-slate-500 font-semibold leading-relaxed">
              <p>
                To maintain standard engineering and architectural layout styles (ISO/ANSI drafting guidelines), we recommend assigning the following line weights to standard color codes:
              </p>
              <ul className="list-disc pl-4 space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-xl font-mono text-[10px]">
                <li><strong className="text-red-600">ACI 1 (Red)</strong>: 0.18 mm — Center lines, grids, hatch contours.</li>
                <li><strong className="text-yellow-500">ACI 2 (Yellow)</strong>: 0.25 mm — Dimensions, annotation tags, leaders.</li>
                <li><strong className="text-green-600">ACI 3 (Green)</strong>: 0.35 mm — Standard structural walls, visible geometry.</li>
                <li><strong className="text-cyan-600">ACI 4 (Cyan)</strong>: 0.50 mm — Heavy cut-through lines, room boundaries.</li>
                <li><strong className="text-blue-600">ACI 5 (Blue)</strong>: 0.70 mm — Extruded border margins, heavy structures.</li>
                <li><strong className="text-slate-600">ACI 8/9 (Greys)</strong>: 0.13 - 0.15 mm — Hatch fills (screening at 50% density).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture form NewsletterSubscribe */}
      <RelatedTools />
    </div>
  );
}
