'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "draw",
    "name": "✏️ Curve Drawing"
  },
  {
    "id": "modeling",
    "name": "⚙️ 3D modeling"
  },
  {
    "id": "modify",
    "name": "🛠️ Entity Edit"
  },
  {
    "id": "system",
    "name": "💻 System Control"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line",
    "category": "draw",
    "description": "Draw a single straight line segment. "
  },
  {
    "keys": "PL",
    "command": "Polyline",
    "category": "draw",
    "description": "Draws continuous polylines. "
  },
  {
    "keys": "C",
    "command": "Circle",
    "category": "draw",
    "description": "Draws a circle by specifying the center and radius. "
  },
  {
    "keys": "EL",
    "command": "Ellipse",
    "category": "draw",
    "description": "Draw an elliptic curve."
  },
  {
    "keys": "E",
    "command": "ExtrudeCrv",
    "category": "modeling",
    "description": "Extrudes curves along a straight line to generate solid surfaces."
  },
  {
    "keys": "LOFT",
    "command": "Loft",
    "category": "modeling",
    "description": "Generate transition surfaces through multi-section section curve lofting. "
  },
  {
    "keys": "M",
    "command": "Move",
    "category": "modify",
    "description": "Move selected surfaces or objects. "
  },
  {
    "keys": "CO / CP",
    "command": "Copy",
    "category": "modify",
    "description": "Clone and copy the selected object. "
  },
  {
    "keys": "RO",
    "command": "Rotate",
    "category": "modify",
    "description": "Rotates an object about a specified origin and base angle. "
  },
  {
    "keys": "TR",
    "command": "Trim",
    "category": "modify",
    "description": "Use a clipping object to trim the excess. "
  },
  {
    "keys": "S",
    "command": "Scale",
    "category": "modify",
    "description": "Scale the volume of the 3D model proportionally. "
  },
  {
    "keys": "F",
    "command": "FilletEdge",
    "category": "modify",
    "description": "Chamfer a solid body. "
  },
  {
    "keys": "Ctrl + G",
    "command": "Group",
    "category": "system",
    "description": "Group multiple objects into an overall group. "
  },
  {
    "keys": "Ctrl + H",
    "command": "Hide",
    "category": "system",
    "description": "Hide all currently selected objects in the viewport. "
  },
  {
    "keys": "Ctrl + Alt + H",
    "command": "Show",
    "category": "system",
    "description": "Makes all hidden objects resurface. "
  }
];
const TIPS = [
  {
    "title": "Right click and space to quickly repeat the last command",
    "content": "Rhino The essence of the design is that the right hand does not leave the mouse. After each command, Tap the right mouse button or hit the space bar on your keyboard to quickly repeat the last command. "
  },
  {
    "title": "Custom command aliases for CAD migration",
    "content": "In 'Preferences' ➔ Alias' setting, You can load custom `.txt` alias configurations, Map commonly used extrusion, stretching, etc. to single-letter hotkeys, greatly reducing the number of keystrokes. "
  }
];

export default function Rhino3DClient() {
  return (
    <ShortcutCheatsheetClient
      title="Rhino 3D"
      subtitle="An efficient tool for industrial design and surface modeling. Selected Rhino Keyboard hotkeys, view switching commands, Supports quick search and PDF printing of memos. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      downloadAliasText={`; Rhino Command Aliases
L=Line
PL=Polyline
C=Circle
EL=Ellipse
E=ExtrudeCrv
LOFT=Loft
M=Move
CO / CP=Copy
RO=Rotate
TR=Trim
S=Scale
F=FilletEdge
Ctrl + G=Group
Ctrl + H=Hide
Ctrl + Alt + H=Show`} downloadAliasFileName="rhino_aliases.txt"
    />
);
}
