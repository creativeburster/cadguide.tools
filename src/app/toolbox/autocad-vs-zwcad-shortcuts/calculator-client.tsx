'use client';

import ShortcutDiffClient, { DiffItem } from '@/components/shortcut-diff-client';

const DIFF_DATA: DiffItem[] = [
  // 1. Core Identical 2D Drawing & Editing (100% PGP Aligned)
  {
    shortcut: "L",
    primaryCmd: "LINE",
    secondaryCmd: "LINE",
    isSame: true,
    diffNote: "",
    useCase: "Draw straight two-dimensional vector line segments between coordinate points."
  },
  {
    shortcut: "C",
    primaryCmd: "CIRCLE",
    secondaryCmd: "CIRCLE",
    isSame: true,
    diffNote: "",
    useCase: "Draw circles with specified center point and radius or diameter."
  },
  {
    shortcut: "REC",
    primaryCmd: "RECTANG",
    secondaryCmd: "RECTANG",
    isSame: true,
    diffNote: "",
    useCase: "Draw rectangular closed polyline boundaries."
  },
  {
    shortcut: "PL",
    primaryCmd: "PLINE",
    secondaryCmd: "PLINE",
    isSame: true,
    diffNote: "",
    useCase: "Draw continuous 2D polyline segments combining straight and curved vertices."
  },
  {
    shortcut: "M",
    primaryCmd: "MOVE",
    secondaryCmd: "MOVE",
    isSame: true,
    diffNote: "",
    useCase: "Translate selected drawing entities by a displacement vector."
  },
  {
    shortcut: "CO",
    primaryCmd: "COPY",
    secondaryCmd: "COPY",
    isSame: true,
    diffNote: "",
    useCase: "Duplicate entities to specified base point and destination coordinates."
  },
  {
    shortcut: "RO",
    primaryCmd: "ROTATE",
    secondaryCmd: "ROTATE",
    isSame: true,
    diffNote: "",
    useCase: "Rotate objects about a specified base point by angle or reference."
  },
  {
    shortcut: "TR",
    primaryCmd: "TRIM",
    secondaryCmd: "TRIM",
    isSame: true,
    diffNote: "",
    useCase: "Trim excess geometry intersecting cutting boundary edges."
  },
  {
    shortcut: "EX",
    primaryCmd: "EXTEND",
    secondaryCmd: "EXTEND",
    isSame: true,
    diffNote: "",
    useCase: "Extend line or arc entities to meet defined boundary edges."
  },
  {
    shortcut: "F",
    primaryCmd: "FILLET",
    secondaryCmd: "FILLET",
    isSame: true,
    diffNote: "",
    useCase: "Round or tangent-fillet intersecting edges with specified radius."
  },
  {
    shortcut: "MI",
    primaryCmd: "MIRROR",
    secondaryCmd: "MIRROR",
    isSame: true,
    diffNote: "",
    useCase: "Create mirrored copies of geometry across a specified reflection axis."
  },
  {
    shortcut: "O",
    primaryCmd: "OFFSET",
    secondaryCmd: "OFFSET",
    isSame: true,
    diffNote: "",
    useCase: "Create concentric circles, parallel lines, or parallel curves at offset distance."
  },
  {
    shortcut: "SPL",
    primaryCmd: "SPLINE",
    secondaryCmd: "SPLINE",
    isSame: true,
    diffNote: "",
    useCase: "Create smooth non-uniform rational B-spline (NURBS) interpolation curves."
  },
  {
    shortcut: "DI",
    primaryCmd: "DIST",
    secondaryCmd: "DIST",
    isSame: true,
    diffNote: "",
    useCase: "Measure linear distance, delta X/Y/Z, and angles between two points."
  },
  {
    shortcut: "E",
    primaryCmd: "ERASE",
    secondaryCmd: "ERASE",
    isSame: true,
    diffNote: "",
    useCase: "Remove and purge selected drawing entities from current model or layout."
  },
  {
    shortcut: "Z",
    primaryCmd: "ZOOM",
    secondaryCmd: "ZOOM",
    isSame: true,
    diffNote: "",
    useCase: "Zoom display window (Extents, Window, Previous, Dynamic, Realtime)."
  },
  {
    shortcut: "H",
    primaryCmd: "HATCH",
    secondaryCmd: "HATCH",
    isSame: true,
    diffNote: "",
    useCase: "Fill enclosed boundary with standard ANSI/ISO vector hatch patterns or gradients."
  },
  {
    shortcut: "MA",
    primaryCmd: "MATCHPROP",
    secondaryCmd: "MATCHPROP",
    isSame: true,
    diffNote: "",
    useCase: "Paint and copy layer, color, linetype, and lineweight properties to other objects."
  },

  // 2. Real ZWCAD Proprietary Innovations & Differences (Documented in ZWCAD Official User Guide)
  {
    shortcut: "SS",
    primaryCmd: "QSELECT",
    secondaryCmd: "SMARTSELECT",
    isSame: false,
    diffNote: "ZWCAD SmartSelect runs in a real-time side palette to multi-filter objects by color, layer, or geometry dynamically without modal dialog interruptions.",
    useCase: "High-speed multi-criteria entity filtering and batch attribute selection."
  },
  {
    shortcut: "FC",
    primaryCmd: "COMPARE",
    secondaryCmd: "FILECOMPARE",
    isSame: false,
    diffNote: "ZWCAD native File Compare overlays two DWG drawings and color-codes differences (Yellow/Red/Cyan) with an integrated difference navigation toolbar.",
    useCase: "Fast revision diffing between contract and shop drawing versions."
  },
  {
    shortcut: "SMARTVOICE",
    primaryCmd: "N/A",
    secondaryCmd: "SMARTVOICE",
    isSame: false,
    diffNote: "ZWCAD proprietary voice annotation engine. Records audio notes and attaches sound icons directly onto drawing entities for site coordination.",
    useCase: "Collaborative audio review annotations without typing lengthy text notes."
  },
  {
    shortcut: "SMARTPLOT",
    primaryCmd: "PUBLISH",
    secondaryCmd: "SMARTPLOT",
    isSame: false,
    diffNote: "ZWCAD SmartPlot automatically recognizes title block frames and layer bounds across model space to batch export multiple PDF/DWF sheets in one click.",
    useCase: "Batch automatic plotting of complete drawing sets without layout tabs."
  },
  {
    shortcut: "BARCODE",
    primaryCmd: "N/A",
    secondaryCmd: "BARCODE",
    isSame: false,
    diffNote: "ZWCAD built-in barcode generator. Directly encodes part numbers, drawing numbers, or project codes into Code 39/128 symbologies on the drawing.",
    useCase: "Manufacturing shop-floor tracking and ERP asset tag drawing embedding."
  },
  {
    shortcut: "QRCODE",
    primaryCmd: "N/A",
    secondaryCmd: "QRCODE",
    isSame: false,
    diffNote: "ZWCAD built-in 2D matrix QR code generator. Allows scanning with mobile devices on construction sites to access online specification docs.",
    useCase: "Embedding URL links and cloud inspection documents into drawing title blocks."
  },
  {
    shortcut: "DATASMART",
    primaryCmd: "DATAEXTRACTION",
    secondaryCmd: "DATASMART",
    isSame: false,
    diffNote: "ZWCAD streamlined data extraction wizard for exporting block attributes and geometric parameters into bidirectional Microsoft Excel tables.",
    useCase: "Door, window, and structural steel schedule data extraction to Excel."
  }
];

export default function AutocadVsZwcadShortcutsClient() {
  return (
    <ShortcutDiffClient
      primaryApp="AutoCAD"
      secondaryApp="ZWCAD"
      diffData={DIFF_DATA}
    />
  );
}
