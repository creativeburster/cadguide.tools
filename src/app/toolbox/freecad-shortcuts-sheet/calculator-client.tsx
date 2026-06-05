'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "navigation",
    "name": "🖱️ Mouse navigation preset"
  },
  {
    "id": "part",
    "name": "⚙️ PartDesign Modeling"
  },
  {
    "id": "view",
    "name": "👁️ View switching"
  }
];
const SHORTCUTS = [
  {
    "keys": "Shift + Right click",
    "command": "Rotate View (CAD mode)",
    "category": "navigation",
    "description": "In default CAD mouse style, Hold down Shift and right-drag to rotate the viewport. "
  },
  {
    "keys": "Middle click + right click",
    "command": "Rotate View (Alternative)",
    "category": "navigation",
    "description": "Rotary relay combination for use in some Linux or one-handed modes. "
  },
  {
    "keys": "Space",
    "command": "Toggle Visibility",
    "category": "part",
    "description": "Extremely high-frequency keystrokes! Show or hide the currently selected entity or sketch with one click. "
  },
  {
    "keys": "Ctrl + R",
    "command": "Refine Shape",
    "category": "part",
    "description": "Optimize geometric shapes and eliminate redundant lines and surfaces produced by Boolean operations. "
  },
  {
    "keys": "F5",
    "command": "Recompute",
    "category": "part",
    "description": "Recalculate the geometric model and force redrawing of unapplied constraint parameters to take effect. "
  },
  {
    "keys": "0",
    "command": "Isometric View",
    "category": "view",
    "description": "Switch to 3D isometric perspective. "
  },
  {
    "keys": "1",
    "command": "Front View",
    "category": "view",
    "description": "Switch to front view. "
  },
  {
    "keys": "2",
    "command": "Top View",
    "category": "view",
    "description": "Switch to top view. "
  }
];
const TIPS = [
  {
    "title": "Use the space bar (Space) to control layer display",
    "content": "FreeCAD are managed through tree features. In the tree view on the left, Select any part or sketch and press `Spacebar`, You can quickly switch between show/hide status, No need to right-click to select. "
  }
];

export default function FreeCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="FreeCAD"
      subtitle="Open source 3D modeling geek quick check. Included FreeCAD Components, Sketch Constraints and View Navigation Keyboard Hotkeys, Perfectly adapted to A4 paper printing. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
