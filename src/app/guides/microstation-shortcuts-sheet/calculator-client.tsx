'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "accudraw",
    "name": "🎯 AccuDraw Auxiliary"
  },
  {
    "id": "draw",
    "name": "✏️ Graph element drawing"
  },
  {
    "id": "view",
    "name": "👁️ Viewport Control"
  }
];
const SHORTCUTS = [
  {
    "keys": "Enter",
    "command": "SmartLock",
    "category": "accudraw",
    "description": "AccuDraw The essence of extreme speed, lock the current cursor location X axis or Y-axis. "
  },
  {
    "keys": "X",
    "command": "Lock X Axis",
    "category": "accudraw",
    "description": "Single axis locking X-axis direction. "
  },
  {
    "keys": "Y",
    "command": "Lock Y Axis",
    "category": "accudraw",
    "description": "Single axis locking Y axis direction. "
  },
  {
    "keys": "Space",
    "command": "Toggle Compass",
    "category": "accudraw",
    "description": "Quickly switch between Cartesian and polar coordinate systems. "
  },
  {
    "keys": "Q",
    "command": "Quit Command",
    "category": "draw",
    "description": "Exit the currently active drawing tool and return to the default selection state. "
  },
  {
    "keys": "W",
    "command": "Toggle Element Selection",
    "category": "draw",
    "description": "Activates or deactivates the element element selection tool. "
  },
  {
    "keys": "Ctrl + B",
    "command": "View Attributes",
    "category": "view",
    "description": "Bring up the viewport properties panel and display/Hide layer fill or line weight."
  },
  {
    "keys": "Ctrl + F",
    "command": "Save Settings",
    "category": "view",
    "description": "Save all current viewport perspective attributes to prevent the viewport from being reset after closing the software. "
  }
];
const TIPS = [
  {
    "title": "AccuDraw with the carriage return locking mechanism",
    "content": "When drawing a line, once the linetype snaps to the orthogonal alignment dash, Immediately press `Enter`) , At this time, your mouse can be clicked anywhere, and the direction of the line will be locked in the previous direction., Very useful. "
  }
];

export default function BentleyMicroStationClient() {
  return (
    <ShortcutCheatsheetClient
      title="Bentley MicroStation"
      subtitle="A quick guide to infrastructure and road and bridge design. Provided MicroStation Commonly used keyboard Key-in commands, AccuDraw Axis lock shortcut keys and viewport management, supported A4 Print."
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
