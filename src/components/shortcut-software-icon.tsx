/**
 * ShortcutSoftwareIcon
 * Hand-crafted SVG icons for each CAD/BIM shortcut-sheet card.
 * Each icon uses a distinctive geometric motif + curated HSL color palette.
 * No external images — always sharp at any size.
 */

import React from 'react';

interface IconProps {
  /** CSS classes applied to the root <svg> */
  className?: string;
}

/* ─────────────────────────────────────────────
   Individual SVG icons
───────────────────────────────────────────── */

/** Cross-Platform CAD Shortcuts Matrix — keyboard grid motif */
const ShortcutsMatrixIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(220,80%,14%)" />
    {/* keyboard rows */}
    {[8, 15, 22, 29, 36].map((y, ri) =>
      [8, 16, 24, 32].slice(0, ri === 4 ? 2 : 4).map((x, ci) => (
        <rect key={`${ri}-${ci}`} x={x} y={y} width={6} height={5} rx={1.5} fill={ri === 0 ? 'hsl(204,90%,54%)' : 'hsl(220,30%,35%)'} opacity={0.9} />
      ))
    )}
    <rect x="8" y="36" width="14" height="5" rx="1.5" fill="hsl(204,90%,54%)" opacity={0.9} />
    <rect x="24" y="36" width="16" height="5" rx="1.5" fill="hsl(220,30%,35%)" opacity={0.9} />
  </svg>
);

/** SolidWorks — interlocking gear teeth */
const SolidworksIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(4,80%,20%)" />
    <circle cx="24" cy="24" r="9" fill="none" stroke="hsl(4,90%,58%)" strokeWidth="3" />
    <circle cx="24" cy="24" r="4" fill="hsl(4,90%,58%)" />
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 24 + Math.cos(rad) * 9;
      const y1 = 24 + Math.sin(rad) * 9;
      const x2 = 24 + Math.cos(rad) * 14;
      const y2 = 24 + Math.sin(rad) * 14;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(4,90%,58%)" strokeWidth="2.5" strokeLinecap="round" />;
    })}
  </svg>
);

/** Rhino 3D — NURBS curve arc motif */
const RhinoIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(270,60%,15%)" />
    {/* stylised rhino horn / NURBS arc */}
    <path d="M8 38 Q14 10 28 14 Q36 17 40 28" stroke="hsl(270,80%,72%)" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M16 38 Q22 20 32 22 Q38 24 40 34" stroke="hsl(270,50%,50%)" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* control points */}
    <circle cx="8" cy="38" r="2.5" fill="hsl(270,80%,72%)" />
    <circle cx="28" cy="14" r="2.5" fill="hsl(270,80%,72%)" />
    <circle cx="40" cy="28" r="2.5" fill="hsl(270,80%,72%)" />
  </svg>
);

/** Revit — parametric BIM section-cut icon */
const RevitIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(200,65%,15%)" />
    {/* floor-plan cross */}
    <rect x="10" y="10" width="28" height="28" rx="2" fill="none" stroke="hsl(200,80%,55%)" strokeWidth="2.5" />
    <line x1="24" y1="10" x2="24" y2="38" stroke="hsl(200,80%,55%)" strokeWidth="1.5" strokeDasharray="2 2" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="hsl(200,80%,55%)" strokeWidth="1.5" strokeDasharray="2 2" />
    {/* corner markers */}
    {[[10,10],[38,10],[10,38],[38,38]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(200,80%,55%)" />
    ))}
    <rect x="19" y="19" width="10" height="10" rx="1" fill="hsl(200,80%,55%)" opacity={0.35} />
  </svg>
);

/** SketchUp — push/pull cube motif */
const SketchupIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(30,70%,16%)" />
    {/* isometric cube */}
    <polygon points="24,8 38,16 38,32 24,40 10,32 10,16" fill="none" stroke="hsl(30,90%,58%)" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="24" y1="8" x2="24" y2="24" stroke="hsl(30,90%,58%)" strokeWidth="2" />
    <line x1="10" y1="16" x2="24" y2="24" stroke="hsl(30,90%,58%)" strokeWidth="2" />
    <line x1="38" y1="16" x2="24" y2="24" stroke="hsl(30,90%,58%)" strokeWidth="2" />
    {/* push-pull arrow */}
    <path d="M24 24 L24 36" stroke="hsl(30,90%,58%)" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 33 L24 38 L28 33" fill="hsl(30,90%,58%)" />
  </svg>
);

/** Autodesk Inventor — assembly constraint rings */
const InventorIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(215,70%,14%)" />
    <circle cx="18" cy="22" r="9" fill="none" stroke="hsl(215,85%,58%)" strokeWidth="2.5" />
    <circle cx="30" cy="28" r="9" fill="none" stroke="hsl(50,90%,58%)" strokeWidth="2.5" />
    <circle cx="18" cy="22" r="3" fill="hsl(215,85%,58%)" />
    <circle cx="30" cy="28" r="3" fill="hsl(50,90%,58%)" />
    {/* constraint line */}
    <line x1="18" y1="22" x2="30" y2="28" stroke="hsl(0,0%,80%)" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

/** MicroStation — precision drafting compass + T-square */
const MicrostationIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(160,55%,13%)" />
    {/* T-square horizontal */}
    <rect x="8" y="22" width="32" height="4" rx="2" fill="hsl(160,70%,42%)" opacity={0.4} />
    {/* vertical rule */}
    <rect x="14" y="8" width="3" height="32" rx="1.5" fill="hsl(160,70%,42%)" />
    {/* compass arc */}
    <path d="M24 14 A12 12 0 0 1 36 26" stroke="hsl(160,80%,58%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="24" cy="14" r="2" fill="hsl(160,80%,58%)" />
    <circle cx="36" cy="26" r="2" fill="hsl(160,80%,58%)" />
    <line x1="24" y1="14" x2="32" y2="34" stroke="hsl(160,80%,58%)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** ArchiCAD — architectural plan element / parametric wall */
const ArchicadIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(240,55%,16%)" />
    {/* floor plan L-shaped wall */}
    <path d="M10 38 L10 14 L26 14" stroke="hsl(240,80%,72%)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M10 28 L22 28 L22 38" stroke="hsl(240,60%,55%)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* dimension tick */}
    <line x1="26" y1="10" x2="26" y2="18" stroke="hsl(240,80%,72%)" strokeWidth="1.5" />
    <line x1="30" y1="14" x2="38" y2="14" stroke="hsl(240,80%,72%)" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="38" cy="14" r="2" fill="hsl(240,80%,72%)" />
  </svg>
);

/** CATIA — parametric surface / swept body */
const CatiaIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(195,65%,13%)" />
    {/* swept surface curves */}
    <path d="M8 34 Q18 10 40 20" stroke="hsl(195,85%,58%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M8 40 Q18 16 40 26" stroke="hsl(195,60%,45%)" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M8 28 Q18 4 40 14" stroke="hsl(195,70%,38%)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* ribs / iso-lines */}
    {[18, 28, 38].map((x,i) => {
      const y1 = 34 - (i*6);
      const y2 = y1 + 6;
      return <line key={i} x1={x} y1={y1} x2={x} y2={y2 + 6} stroke="hsl(195,85%,58%)" strokeWidth="1.5" opacity={0.6} />;
    })}
  </svg>
);

/** PTC Creo — feature tree / extrude icon */
const CreoIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(15,70%,14%)" />
    {/* extruded block */}
    <polygon points="14,30 26,24 38,30 38,40 26,34 14,40" fill="hsl(15,80%,35%)" />
    <polygon points="14,22 26,16 38,22 26,28" fill="hsl(15,85%,55%)" />
    <polygon points="14,22 14,32 26,28 26,16" fill="hsl(15,70%,44%)" />
    {/* direction arrow */}
    <line x1="26" y1="14" x2="26" y2="8" stroke="hsl(15,85%,72%)" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 11 L26 7 L30 11" fill="hsl(15,85%,72%)" />
  </svg>
);

/** FreeCAD — open-source gear + wrench */
const FreecadIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(85,55%,12%)" />
    <circle cx="22" cy="24" r="8" fill="none" stroke="hsl(85,70%,52%)" strokeWidth="2.5" />
    <circle cx="22" cy="24" r="3.5" fill="hsl(85,70%,52%)" />
    {[0,60,120,180,240,300].map((deg,i) => {
      const r = (deg*Math.PI)/180;
      return <line key={i} x1={22+Math.cos(r)*8} y1={24+Math.sin(r)*8} x2={22+Math.cos(r)*12} y2={24+Math.sin(r)*12} stroke="hsl(85,70%,52%)" strokeWidth="2.5" strokeLinecap="round" />;
    })}
    {/* wrench handle */}
    <path d="M34 14 L40 20 L36 24 L30 18 Z" fill="hsl(85,50%,38%)" />
    <line x1="36" y1="24" x2="28" y2="36" stroke="hsl(85,50%,38%)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Fusion 360 — parametric timeline / orbit icon */
const Fusion360Icon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(188,70%,12%)" />
    {/* orbit ellipse */}
    <ellipse cx="24" cy="24" rx="16" ry="8" fill="none" stroke="hsl(188,85%,52%)" strokeWidth="2" />
    <ellipse cx="24" cy="24" rx="8" ry="16" fill="none" stroke="hsl(188,60%,42%)" strokeWidth="2" />
    <circle cx="24" cy="24" r="3.5" fill="hsl(188,85%,62%)" />
    {/* timeline bar */}
    <rect x="10" y="38" width="28" height="3" rx="1.5" fill="hsl(188,40%,30%)" />
    {[14,20,26,32].map((x,i) => (
      <rect key={i} x={x} y="36" width="2" height="5" rx="1" fill={i===1?'hsl(188,85%,62%)':'hsl(188,40%,50%)'} />
    ))}
  </svg>
);

/** DraftSight — migration arrows / alias swap */
const DraftsightIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(225,60%,14%)" />
    {/* two swap arrows */}
    <path d="M12 18 L36 18" stroke="hsl(225,80%,65%)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 13 L36 18 L30 23" fill="hsl(225,80%,65%)" />
    <path d="M36 30 L12 30" stroke="hsl(50,85%,58%)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 25 L12 30 L18 35" fill="hsl(50,85%,58%)" />
    {/* AD label stub */}
    <rect x="12" y="36" width="10" height="4" rx="2" fill="hsl(225,80%,65%)" opacity={0.4} />
    <rect x="26" y="36" width="10" height="4" rx="2" fill="hsl(50,85%,58%)" opacity={0.4} />
  </svg>
);

/** BricsCAD — quad-cursor cross */
const BricscadIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(260,55%,14%)" />
    {/* quad cursor */}
    <line x1="24" y1="8" x2="24" y2="40" stroke="hsl(260,80%,68%)" strokeWidth="2" />
    <line x1="8" y1="24" x2="40" y2="24" stroke="hsl(260,80%,68%)" strokeWidth="2" />
    {/* four quad labels */}
    {[
      {x:14,y:16,label:'M'},
      {x:32,y:16,label:'E'},
      {x:14,y:34,label:'D'},
      {x:32,y:34,label:'S'},
    ].map(({x,y,label},i) => (
      <g key={i}>
        <rect x={x-5} y={y-5} width="10" height="10" rx="3" fill="hsl(260,80%,68%)" opacity={0.2} />
        <text x={x} y={y+4} textAnchor="middle" fill="hsl(260,80%,78%)" fontSize="7" fontWeight="700" fontFamily="monospace">{label}</text>
      </g>
    ))}
  </svg>
);

/** Vectorworks — layered spotlight */
const VectorworksIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(320,55%,13%)" />
    {/* concentric circles — layers */}
    <circle cx="24" cy="24" r="14" fill="none" stroke="hsl(320,75%,58%)" strokeWidth="1.5" opacity={0.3} />
    <circle cx="24" cy="24" r="10" fill="none" stroke="hsl(320,75%,58%)" strokeWidth="1.5" opacity={0.55} />
    <circle cx="24" cy="24" r="6" fill="none" stroke="hsl(320,75%,68%)" strokeWidth="2" />
    <circle cx="24" cy="24" r="2.5" fill="hsl(320,85%,72%)" />
    {/* spotlight rays */}
    {[30,90,150,210,270,330].map((deg,i) => {
      const r=(deg*Math.PI)/180;
      return <line key={i} x1={24+Math.cos(r)*6} y1={24+Math.sin(r)*6} x2={24+Math.cos(r)*14} y2={24+Math.sin(r)*14} stroke="hsl(320,75%,58%)" strokeWidth="1" opacity={0.5} />;
    })}
  </svg>
);

/** AutoCAD vs GstarCAD — diff table / two-column compare */
const AutocadVsGstarcadIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(40,65%,13%)" />
    {/* two columns */}
    <rect x="8" y="10" width="13" height="28" rx="3" fill="hsl(40,80%,48%)" opacity={0.25} />
    <rect x="27" y="10" width="13" height="28" rx="3" fill="hsl(200,80%,52%)" opacity={0.25} />
    {/* divider */}
    <line x1="24" y1="10" x2="24" y2="38" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="2 2" />
    {/* row highlights (diff) */}
    <rect x="8" y="18" width="13" height="5" rx="1" fill="hsl(40,90%,60%)" opacity={0.6} />
    <rect x="27" y="26" width="13" height="5" rx="1" fill="hsl(200,90%,60%)" opacity={0.6} />
    {/* = signs */}
    {[13,21,31].map((y,i) => (
      <line key={i} x1="10" y1={y} x2="20" y2={y} stroke="hsl(40,50%,55%)" strokeWidth="1.5" strokeLinecap="round" />
    ))}
  </svg>
);

/** AutoCAD vs ZWCAD — diff with Z-mark */
const AutocadVsZwcadIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="hsl(160,55%,12%)" />
    {/* two columns */}
    <rect x="8" y="10" width="13" height="28" rx="3" fill="hsl(40,80%,48%)" opacity={0.2} />
    <rect x="27" y="10" width="13" height="28" rx="3" fill="hsl(160,80%,48%)" opacity={0.2} />
    <line x1="24" y1="10" x2="24" y2="38" stroke="hsl(0,0%,60%)" strokeWidth="1" strokeDasharray="2 2" />
    {/* Z mark in right column */}
    <path d="M29 16 L37 16 L29 24 L37 24" stroke="hsl(160,80%,58%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {/* diff row */}
    <rect x="8" y="28" width="13" height="5" rx="1" fill="hsl(40,90%,60%)" opacity={0.55} />
    <rect x="27" y="28" width="13" height="5" rx="1" fill="hsl(160,85%,52%)" opacity={0.55} />
  </svg>
);

/* ─────────────────────────────────────────────
   Lookup map + main export
───────────────────────────────────────────── */

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  'shortcuts':                    ShortcutsMatrixIcon,
  'solidworks-shortcuts-sheet':   SolidworksIcon,
  'rhino-shortcuts-sheet':        RhinoIcon,
  'revit-shortcuts-sheet':        RevitIcon,
  'sketchup-shortcuts-sheet':     SketchupIcon,
  'inventor-shortcuts-sheet':     InventorIcon,
  'microstation-shortcuts-sheet': MicrostationIcon,
  'archicad-shortcuts-sheet':     ArchicadIcon,
  'catia-shortcuts-sheet':        CatiaIcon,
  'creo-shortcuts-sheet':         CreoIcon,
  'freecad-shortcuts-sheet':      FreecadIcon,
  'fusion360-shortcuts-sheet':    Fusion360Icon,
  'draftsight-shortcuts-sheet':   DraftsightIcon,
  'bricscad-shortcuts-sheet':     BricscadIcon,
  'vectorworks-shortcuts-sheet':  VectorworksIcon,
  'autocad-vs-gstarcad-shortcuts':AutocadVsGstarcadIcon,
  'autocad-vs-zwcad-shortcuts':   AutocadVsZwcadIcon,
};

interface ShortcutSoftwareIconProps {
  slug: string;
  className?: string;
}

/**
 * Returns the hand-crafted SVG icon for the given cheatsheet slug.
 * Falls back to a generic keyboard icon if the slug is not found.
 */
export default function ShortcutSoftwareIcon({ slug, className = 'w-12 h-12' }: ShortcutSoftwareIconProps) {
  const Icon = ICON_MAP[slug];
  if (!Icon) {
    // Generic keyboard fallback
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="hsl(220,15%,20%)" />
        <rect x="8" y="14" width="32" height="20" rx="4" fill="none" stroke="hsl(220,60%,65%)" strokeWidth="2" />
        {[14,20,26].map(y => [12,18,24,30].map(x => (
          <rect key={`${x}-${y}`} x={x} y={y} width="4" height="3" rx="1" fill="hsl(220,60%,65%)" opacity={0.6} />
        )))}
      </svg>
    );
  }
  return <Icon className={className} />;
}
