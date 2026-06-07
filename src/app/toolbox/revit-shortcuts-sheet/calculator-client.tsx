'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "arch",
    "name": "🏠 Buildings and Walls"
  },
  {
    "id": "struct",
    "name": "🏗️ Structural components"
  },
  {
    "id": "view",
    "name": "👁️ View Control"
  },
  {
    "id": "modify",
    "name": "🛠️ Modify and edit"
  }
];
const SHORTCUTS = [
  {
    "keys": "WA",
    "command": "Wall (wall)",
    "category": "arch",
    "description": "Draw building walls in plan view. "
  },
  {
    "keys": "DR",
    "command": "Door (door)",
    "category": "arch",
    "description": "Place the door component on the wall. "
  },
  {
    "keys": "WN",
    "command": "Window (window)",
    "category": "arch",
    "description": "Quickly open windows on the wall. "
  },
  {
    "keys": "CL",
    "command": "Column (structural column)",
    "category": "struct",
    "description": "Place load-bearing structural column members."
  },
  {
    "keys": "BM",
    "command": "Beam (structural beam)",
    "category": "struct",
    "description": "Draw the horizontal beam load-bearing frame. "
  },
  {
    "keys": "VG / VV",
    "command": "Visibility/Graphics",
    "category": "view",
    "description": "Bring up the view visibility control panel and manage element category filters. "
  },
  {
    "keys": "WT",
    "command": "Tile Windows",
    "category": "view",
    "description": "Tile all open views on the current screen to facilitate collaborative checking. "
  },
  {
    "keys": "ZA",
    "command": "Zoom All",
    "category": "view",
    "description": "Center the model in all tiled viewports to fit the full screen. "
  },
  {
    "keys": "MV",
    "command": "Move",
    "category": "modify",
    "description": "Move selected walls or model elements. "
  },
  {
    "keys": "CO",
    "command": "Copy",
    "category": "modify",
    "description": "Clone the selected widget."
  },
  {
    "keys": "RO",
    "command": "Rotate",
    "category": "modify",
    "description": "Rotate model primitives. "
  },
  {
    "keys": "AL",
    "command": "Align",
    "category": "modify",
    "description": "Align one or more primitives to the reference boundary, required for BIM layout. "
  },
  {
    "keys": "TR",
    "command": "Trim/Extend",
    "category": "modify",
    "description": "Trim or extend multiple segments of pipe and wall boundaries. "
  }
];
const TIPS = [
  {
    "title": "Revit You don’t need to press Enter to enter shortcut keys",
    "content": "Different from AutoCAD rules, Revit Most of the commands in are two-letter combinations (e.g. WA, CO) . The command will be executed immediately after typing two letters. Do not type. Enter key, otherwise there will be a meaningless line break operation. "
  },
  {
    "title": "Tile viewport WT and tile collapse",
    "content": "When working on large-scale projects, multi-viewport joint running is prone to lags. After checking with WT tiling, Use `Ctrl + Tab` to quickly cycle, Use `Tab` to browse in single window maximized mode. "
  }
];

export default function RevitBIMClient() {
  return (
    <ShortcutCheatsheetClient
      title="Revit BIM"
      subtitle="BIM Three-dimensional collaborative modeling efficiency table. Selected Revit architecture, structure, Electromechanical (MEP) two-letter common shortcut codes, Supports one-click search and A4 printing. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
