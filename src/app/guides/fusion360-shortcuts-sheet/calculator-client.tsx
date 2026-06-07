'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 Sketch design"
  },
  {
    "id": "modeling",
    "name": "⚙️ Characteristic entity"
  },
  {
    "id": "system",
    "name": "💻 Viewport and system"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (straight line)",
    "category": "sketch",
    "description": "Start sketching and draw polyline segments. "
  },
  {
    "keys": "C",
    "command": "Center Diameter Circle",
    "category": "sketch",
    "description": "Draw a circle with a specified center radius. "
  },
  {
    "keys": "R",
    "command": "2-Point Rectangle",
    "category": "sketch",
    "description": "Draws a standard diagonal rectangle. "
  },
  {
    "keys": "D",
    "command": "Sketch Dimension",
    "category": "sketch",
    "description": "Annotate physical dimensional constraints on sketch curves. "
  },
  {
    "keys": "X",
    "command": "Construction Line Toggle",
    "category": "sketch",
    "description": "High-frequency key! Convert the current drawn line into a dotted construction auxiliary line with one click. "
  },
  {
    "keys": "E",
    "command": "Extrude (Stretch)",
    "category": "modeling",
    "description": "Extrude a 2D polygon into a three-dimensional feature. "
  },
  {
    "keys": "F",
    "command": "Fillet (Round)",
    "category": "modeling",
    "description": "Smoothly round edges of solid boundaries. "
  },
  {
    "keys": "M",
    "command": "Move/Copy",
    "category": "modeling",
    "description": "Move or clone a solid model in place."
  },
  {
    "keys": "Shift + S",
    "command": "Scripts and Add-Ins",
    "category": "system",
    "description": "Call up Python or API Plug-in management window. "
  },
  {
    "keys": "Ctrl + Shift + R",
    "command": "Compute All",
    "category": "system",
    "description": "Refactoring recalculates all associated fits when a large number of assembly chains are changed. "
  }
];
const TIPS = [
  {
    "title": "Construction auxiliary line toggle key X",
    "content": "When drawing a geometric line in a sketch, if it is not needed as an extrusion interface, Just select the line and press the `X` key, The line can be converted into an auxiliary dotted line, press again `X` Restore, very fast. "
  }
];

export default function AutodeskFusion360Client() {
  return (
    <ShortcutCheatsheetClient
      title="Autodesk Fusion 360"
      subtitle="Cloud collaborative design of lightweight 3D solutions. Provided Fusion 360 Sculpted surfaces, 3D extrusions &amp; CAM Manufacturing tool path shortcut code, A4 printing optimization. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
