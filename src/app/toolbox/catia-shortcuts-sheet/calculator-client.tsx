'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "mouse",
    "name": "🖱️ Mouse and Viewport"
  },
  {
    "id": "sketch",
    "name": "📐 Sketch design"
  },
  {
    "id": "system",
    "name": "💻 System control"
  }
];
const SHORTCUTS = [
  {
    "keys": "MB2 (middle mouse button)",
    "command": "Pan (Pan)",
    "category": "mouse",
    "description": "Hold down the middle mouse button and drag to pan the entire drawing model in the viewport. "
  },
  {
    "keys": "MB2 + MB1 (or MB3)",
    "command": "Rotate (Rotate)",
    "category": "mouse",
    "description": "While holding down the middle mouse button, hold down the left button (or right button) Drag to trigger the three-dimensional surround view. "
  },
  {
    "keys": "MB2 + Click MB1",
    "command": "Zoom (Zoom)",
    "category": "mouse",
    "description": "Hold down the middle button and click the left button, Then drag the mouse up and down to achieve smooth zooming with infinite focal length.. "
  },
  {
    "keys": "C",
    "command": "Constraint (constraint)",
    "category": "sketch",
    "description": "Activate the Geometric Constraint Dimension tool. "
  },
  {
    "keys": "P",
    "command": "Point (draw dots)",
    "category": "sketch",
    "description": "Insert anchor points in the plan sketch. "
  },
  {
    "keys": "Alt + Enter",
    "command": "Properties (properties)",
    "category": "system",
    "description": "View the physical properties of the currently selected solid feature or geometry segment. "
  },
  {
    "keys": "Ctrl + U",
    "command": "Update (Update model)",
    "category": "system",
    "description": "After modifying the sketch parameters, reconstruct and update the solid assembly with one click. "
  }
];
const TIPS = [
  {
    "title": "CATIA The magic zoom operation of the three-button mouse",
    "content": "CATIA The viewing angle zoom is different from ordinary CAD wheel scrolling.: First press and hold the `middle button` without loosening, then press quickly `Left click, then move the mouse up and down, You can achieve extremely sensitive macro focus zooming, eliminating the lag caused by frequent scrolling.. "
  }
];

export default function DassaultCATIAClient() {
  return (
    <ShortcutCheatsheetClient
      title="Dassault CATIA"
      subtitle="Aviation and high-end manufacturing machinery assembly. Finishing CATIA Part sketch design, axis constraints and 3D viewport dragging, Print optimization. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
