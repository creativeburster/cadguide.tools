'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "tools",
    "name": "🧱 Building components"
  },
  {
    "id": "edit",
    "name": "🛠️ Edit "
  },
  {
    "id": "view",
    "name": "👁️ view view"
  }
];
const SHORTCUTS = [
  {
    "keys": "W",
    "command": "Wall (Wall Tools)",
    "category": "tools",
    "description": "Activate the 3D wall modeling and drawing tool. "
  },
  {
    "keys": "D",
    "command": "Door (door tools)",
    "category": "tools",
    "description": "Activate the door build placement tool. "
  },
  {
    "keys": "Space",
    "command": "Magic Wand (Magic Wand)",
    "category": "tools",
    "description": "Press and hold the space bar to activate the magic wand, which can automatically fit the existing line segment boundaries to generate a closed wall or plate.. "
  },
  {
    "keys": "Ctrl + D",
    "command": "Drag (move)",
    "category": "edit",
    "description": "Move selected building elements. "
  },
  {
    "keys": "Ctrl + E",
    "command": "Rotate (Rotate)",
    "category": "edit",
    "description": "Align selected components by rotational degrees. "
  },
  {
    "keys": "Ctrl + M",
    "command": "Mirror (Mirror)",
    "category": "edit",
    "description": "Mirror flips the primitive structure. "
  },
  {
    "keys": "Ctrl + Alt + D",
    "command": "Drag a Copy",
    "category": "edit",
    "description": "Clone a new entity while moving. "
  },
  {
    "keys": "F3",
    "command": "3D Window",
    "category": "view",
    "description": "Instantly switch the entire image or the current selection to 3D axonometric window viewing. "
  },
  {
    "keys": "F2",
    "command": "2D Floor Plan",
    "category": "view",
    "description": "Switch back from 3D or elevation view 2D Floor plan view."
  }
];
const TIPS = [
  {
    "title": "Use the magic wand (space bar) Quick Fit",
    "content": "In ArchiCAD, If you have drawn a complex closed curve, just activate the wall or slab tool, Hold down `Spacebar` And click this curve, ArchiCAD will automatically draw the wall or plate along the curve outline with one click., Eliminate the need for manual tracing. "
  }
];

export default function GraphisoftArchiCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="Graphisoft ArchiCAD"
      subtitle="BIM solutions for major construction companies. Includes ArchiCAD plan drawing, Smart magic wand capture, multiple wall switching and 3D Edit hotkey."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
