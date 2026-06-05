'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "draw",
    "name": "✏️ 2D drawing"
  },
  {
    "id": "modify",
    "name": "🛠️ Modify command"
  },
  {
    "id": "view",
    "name": "👁️ viewport view"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "LINE",
    "category": "draw",
    "description": "Draw a two-dimensional straight line. "
  },
  {
    "keys": "C",
    "command": "CIRCLE",
    "category": "draw",
    "description": "Draw a circle with a specified center radius. "
  },
  {
    "keys": "PL",
    "command": "POLYLINE",
    "category": "draw",
    "description": "Draws a continuous polyline."
  },
  {
    "keys": "REC",
    "command": "RECTANGLE",
    "category": "draw",
    "description": "Draw a closed rectangular polyline. "
  },
  {
    "keys": "H",
    "command": "HATCH",
    "category": "draw",
    "description": "Fill closed areas with a custom pattern. "
  },
  {
    "keys": "M",
    "command": "MOVE",
    "category": "modify",
    "description": "Move entities in the drawing. "
  },
  {
    "keys": "CO",
    "command": "COPY",
    "category": "modify",
    "description": "Copy the selected elements. "
  },
  {
    "keys": "RO",
    "command": "ROTATE",
    "category": "modify",
    "description": "Rotate the entity."
  },
  {
    "keys": "TR",
    "command": "TRIM",
    "category": "modify",
    "description": "Trim excess line segments. "
  },
  {
    "keys": "O",
    "command": "OFFSET",
    "category": "modify",
    "description": "Copy the line segments with offset offset. "
  },
  {
    "keys": "Z",
    "command": "ZOOM",
    "category": "view",
    "description": "Zoom viewport drawing. "
  },
  {
    "keys": "P",
    "command": "PAN",
    "category": "view",
    "description": "Pan moves the current viewport. "
  }
];
const TIPS = [
  {
    "title": "Quick alias fully aligned with AutoCAD",
    "content": "DraftSight The underlying logic is completely consistent with AutoCAD. It is fully compatible with externally loaded `acad.pgp` alias configurations, Allows for a seamless transition of muscle memory. "
  }
];

export default function DassaultDraftSightClient() {
  return (
    <ShortcutCheatsheetClient
      title="Dassault DraftSight"
      subtitle="AutoCAD Competitive cost-effective solution. Organized DraftSight 2D Drawing shortcut aliases, layer table management commands and viewport configuration. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
