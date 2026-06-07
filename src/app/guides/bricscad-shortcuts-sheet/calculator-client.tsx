'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "quad",
    "name": "🌀 Quad Smart Cursor"
  },
  {
    "id": "draw",
    "name": "✏️ Drawing commands"
  },
  {
    "id": "modify",
    "name": "🛠️ Modify and edit"
  }
];
const SHORTCUTS = [
  {
    "keys": "Ctrl",
    "command": "Toggle Quad Display",
    "category": "quad",
    "description": "BricsCAD Core feature, show or hide floating smart tool tray. "
  },
  {
    "keys": "L",
    "command": "LINE",
    "category": "draw",
    "description": "Draw a straight line segment."
  },
  {
    "keys": "C",
    "command": "CIRCLE",
    "category": "draw",
    "description": "Draw the specified center circle. "
  },
  {
    "keys": "PL",
    "command": "PLINE",
    "category": "draw",
    "description": "Draws a planar polyline. "
  },
  {
    "keys": "REC",
    "command": "RECTANGLE",
    "category": "draw",
    "description": "Draw a rectangular closed curve. "
  },
  {
    "keys": "M",
    "command": "MOVE",
    "category": "modify",
    "description": "Move selected primitive entities."
  },
  {
    "keys": "CO",
    "command": "COPY",
    "category": "modify",
    "description": "Clone the graphic. "
  },
  {
    "keys": "RO",
    "command": "ROTATE",
    "category": "modify",
    "description": "Alignment of rotating objects. "
  },
  {
    "keys": "TR",
    "command": "TRIM",
    "category": "modify",
    "description": "Trim intersecting geometric lines. "
  },
  {
    "keys": "X",
    "command": "EXPLODE",
    "category": "modify",
    "description": "Break up the block or compound polyline into a single geometric line. "
  }
];
const TIPS = [
  {
    "title": "Improve performance with Quad Smart Roulette 2 times",
    "content": "BricsCAD Unique Quad smart floating tool tray, It will automatically calculate and recommend the most likely needed elements based on the type of primitive your cursor is currently hovering over. 5 tools (such as pruning, chamfer, layer properties) , Drastically reduce the number of times you move your hands to the top menu. "
  }
];

export default function HexagonBricsCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="Hexagon BricsCAD"
      subtitle="High-performance professional 2D/3D CAD. Included BricsCAD Smart Quad shortcut tool tray commands, Polyline and 3D axis side quick check. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
