'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "mouse",
    "name": "🖱️ 鼠标与视口"
  },
  {
    "id": "sketch",
    "name": "📐 草图设计"
  },
  {
    "id": "system",
    "name": "💻 系统操控"
  }
];
const SHORTCUTS = [
  {
    "keys": "MB2 (鼠标中键)",
    "command": "Pan (平移)",
    "category": "mouse",
    "description": "按住鼠标中键并拖动，可在视口中平移整个图纸模型。"
  },
  {
    "keys": "MB2 + MB1 (或 MB3)",
    "command": "Rotate (旋转)",
    "category": "mouse",
    "description": "按住鼠标中键的同时按住左键（或右键）进行拖动，即可触发三维环绕视角。"
  },
  {
    "keys": "MB2 + Click MB1",
    "command": "Zoom (缩放)",
    "category": "mouse",
    "description": "按住中键，点击一下左键，然后上下拖动鼠标，可实现无极焦距平滑缩放。"
  },
  {
    "keys": "C",
    "command": "Constraint (约束)",
    "category": "sketch",
    "description": "激活几何约束标注工具。"
  },
  {
    "keys": "P",
    "command": "Point (画点)",
    "category": "sketch",
    "description": "在平面草图中插入定位点。"
  },
  {
    "keys": "Alt + Enter",
    "command": "Properties (属性)",
    "category": "system",
    "description": "查看当前选定的实体特征或几何线段的物理属性。"
  },
  {
    "keys": "Ctrl + U",
    "command": "Update (更新模型)",
    "category": "system",
    "description": "当修改草图参数后，一键重构更新实体装配。"
  }
];
const TIPS = [
  {
    "title": "CATIA 三键鼠标的缩放神操作",
    "content": "CATIA 的视角缩放与普通 CAD 用轮子滚动不同：先按住 `中键` 不松，然后快速按一下 `左键`，接着上下移动鼠标，即可实现极高灵敏度的微距焦距缩放，省去频繁滚轮带来的卡顿。"
  }
];

export default function DassaultCATIAClient() {
  return (
    <ShortcutCheatsheetClient
      title="Dassault CATIA"
      subtitle="航空与高端制造机械装配。整理 CATIA 零件草图设计、轴心约束与三维视口拖拽，打印优化。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
