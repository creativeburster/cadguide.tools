'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 Commonly used sketches"
  },
  {
    "id": "modeling",
    "name": "⚙️ Modeling modification"
  },
  {
    "id": "view",
    "name": "👁️ View Alignment"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (straight line)",
    "category": "sketch",
    "description": "Draw continuous straight segments in a plan sketch. "
  },
  {
    "keys": "C",
    "command": "Circle (circle)",
    "category": "sketch",
    "description": "Draws a circle centered at the specified location. "
  },
  {
    "keys": "R",
    "command": "Rectangle (rectangle)",
    "category": "sketch",
    "description": "Specify a rectangle by its bounding diagonals. "
  },
  {
    "keys": "Ctrl + G",
    "command": "Regenerate",
    "category": "modeling",
    "description": "Reconstruct and update the 3D feature tree model to prevent display abnormalities. "
  },
  {
    "keys": "Ctrl + D",
    "command": "Default View (Default perspective)",
    "category": "view",
    "description": "Instantly align the 3D working viewport and reset it back to the standard isometric default perspective. "
  },
  {
    "keys": "Ctrl + R",
    "command": "Repaint",
    "category": "view",
    "description": "Force refresh of the current working screen to eliminate drawing junk pixel artifacts. "
  },
  {
    "keys": "Shift + middle button",
    "command": "Pan View",
    "category": "view",
    "description": "Hold down the Shift key on your keyboard and drag with the middle mouse button, Pan the viewport."
  }
];
const TIPS = [
  {
    "title": "Reset the default 3D perspective with one click (Ctrl+D)",
    "content": "When you feel dizzy rotating inside the three-dimensional assembly, just press `Ctrl + D`, Creo The perspective will be aligned and returned to the standard three-dimensional axonometric view in one second, making it easy to reposition.. "
  }
];

export default function PTCCreoClient() {
  return (
    <ShortcutCheatsheetClient
      title="PTC Creo"
      subtitle="Precision structural design and parametric modeling. Provided Creo Common codes for sketching, solid trimming and assembly constraints, Supports one-click filter search. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
