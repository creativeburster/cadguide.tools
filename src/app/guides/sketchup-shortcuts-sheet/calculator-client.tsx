'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "tools",
    "name": "✏️ drawing tools"
  },
  {
    "id": "camera",
    "name": "🎥 Camera and view"
  },
  {
    "id": "system",
    "name": "💻 Groups and Systems"
  }
];
const SHORTCUTS = [
  {
    "keys": "Space",
    "command": "Select (Select)",
    "category": "tools",
    "description": "Activate the normal pointer selection tool and exit other editing commands. "
  },
  {
    "keys": "L",
    "command": "Line (straight line)",
    "category": "tools",
    "description": "Draw a straight line in the coordinate plane. "
  },
  {
    "keys": "C",
    "command": "Circle (circle)",
    "category": "tools",
    "description": "Draw a circle approximated by a regular polygon. "
  },
  {
    "keys": "R",
    "command": "Rectangle (rectangle)",
    "category": "tools",
    "description": "Draw a rectangle through two diagonal points. "
  },
  {
    "keys": "P",
    "command": "Push/Pull (Push and pull)",
    "category": "tools",
    "description": "The essence of Sketch Master, extruding a two-dimensional surface into a three-dimensional solid. "
  },
  {
    "keys": "M",
    "command": "Move (move)",
    "category": "tools",
    "description": "Move selected geometry to match Ctrl key to activate array copying. "
  },
  {
    "keys": "Q",
    "command": "Rotate (Rotate)",
    "category": "tools",
    "description": "Rotate the selected plane or solid. "
  },
  {
    "keys": "S",
    "command": "Scale (Zoom)",
    "category": "tools",
    "description": "Stretch and scale selected geometry. "
  },
  {
    "keys": "O",
    "command": "Orbit (Surround)",
    "category": "camera",
    "description": "Three-dimensional rotation of the viewport can also be triggered by holding down the middle mouse button.. "
  },
  {
    "keys": "H",
    "command": "Pan (Palm translation)",
    "category": "camera",
    "description": "Pans the viewport view horizontally. "
  },
  {
    "keys": "Z",
    "command": "Zoom (Zoom)",
    "category": "camera",
    "description": "Drag the mouse back and forth in real time to zoom the viewport focus. "
  },
  {
    "keys": "G",
    "command": "Make Component (Build component)",
    "category": "system",
    "description": "Group selected geometry into 'components' that can be associatively cloned'. "
  },
  {
    "keys": "Ctrl + G",
    "command": "Make Group (Create a group)",
    "category": "system",
    "description": "Group selected independent lines and surfaces to prevent mutual adhesion and deformation. "
  }
];
const TIPS = [
  {
    "title": "Ctrl-drag to copy array",
    "content": "Using 'Mobile' (M)'tool, press the keyboard `Ctrl` key, there will be an extra plus sign next to the mouse. At this point, drag the component to copy it. Enter `*5` or `/5` and press enter, Ability to clone 5 objects equidistantly or divide them equidistantly within an interval. "
  },
  {
    "title": "Three-dimensional axial locking techniques",
    "content": "When drawing a line segment or moving an object, press `↑` (Lock the blue axis), `←` (Lock the green axis) , `→` (Lock the red axis), which can force absolutely orthogonal movement in three-dimensional space, It will definitely not drift. "
  }
];

export default function SketchUpProClient() {
  return (
    <ShortcutCheatsheetClient
      title="SketchUp Pro"
      subtitle="Sketch Master Quick Solution. Contains SketchUp Commonly used drawing brushes, group settings and camera surround shortcut keys, Supports online filtering and A4 Landscape printing. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
