'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "snapping",
    "name": "🎯 Snapping Capture"
  },
  {
    "id": "tools",
    "name": "✏️ Classic Drawing"
  },
  {
    "id": "system",
    "name": "💻 View Manipulation"
  }
];
const SHORTCUTS = [
  {
    "keys": "Q",
    "command": "Toggle Snapping Grid",
    "category": "snapping",
    "description": "Switch grid snapping on and off with one click. "
  },
  {
    "keys": "A",
    "command": "Toggle Snapping Objects",
    "category": "snapping",
    "description": "Switch geometric entity boundary snapping on and off with one click. "
  },
  {
    "keys": "X",
    "command": "Selection Tool",
    "category": "tools",
    "description": "Activate the universal mouse selection tool. "
  },
  {
    "keys": "2",
    "command": "Line Tool (draw line)",
    "category": "tools",
    "description": "Activates the standard line segment drawing command. "
  },
  {
    "keys": "4",
    "command": "Rectangle Tool (Draw a rectangle)",
    "category": "tools",
    "description": "Activates the rectangle drawing command. "
  },
  {
    "keys": "6",
    "command": "Circle Tool (draw a circle)",
    "category": "tools",
    "description": "Activates the circle drawing command. "
  },
  {
    "keys": "Ctrl + H",
    "command": "Send to Back (Move to bottom)",
    "category": "system",
    "description": "Change the stacking order of primitives and move them to the bottom. "
  },
  {
    "keys": "Ctrl + F",
    "command": "Bring to Front (Move to top)",
    "category": "system",
    "description": "Move the stacking order of graphics elements to the topmost display. "
  },
  {
    "keys": "Ctrl + Alt + C",
    "command": "Zoom to Objects",
    "category": "system",
    "description": "Scales the viewport to fully center the selected entities. "
  }
];
const TIPS = [
  {
    "title": "Classic one-button tool switching system",
    "content": "In Vectorworks, Many numbers and single letters are assigned directly to drawing tools (such as 2 represents line, 4 represents rectangle, X represents selection). When using drawing commands, Press the keyboard with multiple fingers to achieve instant pen cutting without mouse clicks. "
  }
];

export default function VectorworksProClient() {
  return (
    <ShortcutCheatsheetClient
      title="Vectorworks Pro"
      subtitle="Stage beauty, landscape and high-end architectural design tools. Provides Vectorworks smart snapping, Drawing coordinate transformation and layer combination shortcut keys. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
