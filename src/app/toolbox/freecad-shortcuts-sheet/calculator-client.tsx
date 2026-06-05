'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "navigation",
    "name": "🖱️ 鼠标导航 preset"
  },
  {
    "id": "part",
    "name": "⚙️ PartDesign 建模"
  },
  {
    "id": "view",
    "name": "👁️ 视角切换"
  }
];
const SHORTCUTS = [
  {
    "keys": "Shift + 右键",
    "command": "Rotate View (CAD 模式)",
    "category": "navigation",
    "description": "在默认 CAD 鼠标风格下，按住 Shift 配合右键拖动可旋转视口。"
  },
  {
    "keys": "中键 + 右键",
    "command": "Rotate View (Alternative)",
    "category": "navigation",
    "description": "在部分 Linux 或单手模式下使用的旋转中继组合。"
  },
  {
    "keys": "Space",
    "command": "Toggle Visibility",
    "category": "part",
    "description": "极高频按键！一键显示或隐藏当前所选实体或草图。"
  },
  {
    "keys": "Ctrl + R",
    "command": "Refine Shape",
    "category": "part",
    "description": "优化几何形体，清除布尔运算产生的冗余线面。"
  },
  {
    "keys": "F5",
    "command": "Recompute",
    "category": "part",
    "description": "重新计算几何模型，将未应用的约束参数强制重绘生效。"
  },
  {
    "keys": "0",
    "command": "Isometric View",
    "category": "view",
    "description": "切换到三维等轴测透视。"
  },
  {
    "keys": "1",
    "command": "Front View",
    "category": "view",
    "description": "切换到正前平视图。"
  },
  {
    "keys": "2",
    "command": "Top View",
    "category": "view",
    "description": "切换到正顶平视图。"
  }
];
const TIPS = [
  {
    "title": "巧用空格键（Space）控制图层显示",
    "content": "FreeCAD 是通过树状特征进行管理的。在左侧树状视图中，选中任意零件或草图并按下 `空格键`，即可快速在显示/隐藏状态之间切换，无需右键选择。"
  }
];

export default function FreeCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="FreeCAD"
      subtitle="开源三维建模极客速查。收录 FreeCAD 零部件、草图约束与视图导航键盘热键，完美适配 A4 纸张打印。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
