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
    useCase: "Draw 2D straight line segments between picked coordinate points."
  },
  {
    shortcut: "C",
    primaryCmd: "CIRCLE",
    secondaryCmd: "CIRCLE",
    isSame: true,
    diffNote: "",
    useCase: "Draw circles with specified center point and radius/diameter."
  },
  {
    shortcut: "REC",
    primaryCmd: "RECTANG",
    secondaryCmd: "RECTANG",
    isSame: true,
    diffNote: "",
    useCase: "Draw rectangular closed polyline boundaries with chamfer/fillet options."
  },
  {
    shortcut: "PL",
    primaryCmd: "PLINE",
    secondaryCmd: "PLINE",
    isSame: true,
    diffNote: "",
    useCase: "Draw connected 2D polyline segments with combined straight and arc vertices."
  },
  {
    shortcut: "M",
    primaryCmd: "MOVE",
    secondaryCmd: "MOVE",
    isSame: true,
    diffNote: "",
    useCase: "Translate selected drawing entities by a 2D/3D displacement vector."
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
    useCase: "Trim entities at cutting edges formed by other intersecting geometry."
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

  // 2. Real GstarCAD Proprietary Innovations & Differences (Documented in GstarCAD Official Guide)
  {
    shortcut: "FCMP",
    primaryCmd: "COMPARE",
    secondaryCmd: "FCMP",
    isSame: false,
    diffNote: "GstarCAD native File Compare engine. Overlays two DWG revisions to instantly highlight modified, added, and deleted entities with color codes.",
    useCase: "High-speed drawing revision diff verification between version releases."
  },
  {
    shortcut: "AREASUM",
    primaryCmd: "AREA",
    secondaryCmd: "AREASUM",
    isSame: false,
    diffNote: "AutoCAD AREA requires tedious manual picking and boundary addition/subtraction. GstarCAD AREASUM automatically sums multiple closed regions in one click.",
    useCase: "Batch floor plan area and room schedule square meter calculations."
  },
  {
    shortcut: "AUTOSORT",
    primaryCmd: "N/A",
    secondaryCmd: "AUTOSORT",
    isSame: false,
    diffNote: "GstarCAD built-in tool that automatically scans and numbers drawing title blocks and layout sheet sequences without custom AutoLISP scripts.",
    useCase: "Automated drawing sheet renumbering and title block batch sequencing."
  },
  {
    shortcut: "MAGNIFIER",
    primaryCmd: "N/A",
    secondaryCmd: "MAGNIFIER",
    isSame: false,
    diffNote: "Interactive floating viewport lens. Allows real-time inspection, snapping, and editing of dense detail drawings without losing global viewport context.",
    useCase: "Precision micro-geometry inspection in complex architectural floor plans."
  },
  {
    shortcut: "DWGCONVERT",
    primaryCmd: "DWGCONVERT",
    secondaryCmd: "DWGCONVERT",
    isSame: true,
    diffNote: "",
    useCase: "Batch convert DWG file formats across AutoCAD R14 through 2024 versions."
  },
  {
    shortcut: "BCOUNT",
    primaryCmd: "BCOUNT (Express)",
    secondaryCmd: "BCOUNT",
    isSame: false,
    diffNote: "In AutoCAD, BCOUNT requires Express Tools loaded. GstarCAD includes BCOUNT natively in the core kernel to generate block count tables.",
    useCase: "Bill of materials (BOM) counting of valve, door, and equipment blocks."
  },
  {
    shortcut: "FREEPOLY",
    primaryCmd: "SKETCH",
    secondaryCmd: "FREEPOLY",
    isSame: false,
    diffNote: "GstarCAD dedicated freehand polyline sketching command with automatic vertex optimization. AutoCAD relies on the legacy SKETCH command.",
    useCase: "Freehand geological contour tracing, revision clouds, and organic path drafting."
  }
];

export default function AutocadVsGstarcadShortcutsClient() {
  return (
    <ShortcutDiffClient
      primaryApp="AutoCAD"
      secondaryApp="GstarCAD"
      diffData={DIFF_DATA}
    />
  );
}
