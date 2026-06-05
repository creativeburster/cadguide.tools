'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "snapping",
    "name": "🎯 Snapping 捕捉"
  },
  {
    "id": "tools",
    "name": "✏️ 经典绘图"
  },
  {
    "id": "system",
    "name": "💻 视图操控"
  }
];
const SHORTCUTS = [
  {
    "keys": "Q",
    "command": "Toggle Snapping Grid",
    "category": "snapping",
    "description": "一键开关网格捕捉。"
  },
  {
    "keys": "A",
    "command": "Toggle Snapping Objects",
    "category": "snapping",
    "description": "一键开关几何实体边界捕捉。"
  },
  {
    "keys": "X",
    "command": "Selection Tool",
    "category": "tools",
    "description": "激活通用鼠标选择工具。"
  },
  {
    "keys": "2",
    "command": "Line Tool (画线)",
    "category": "tools",
    "description": "激活标准线段绘制命令。"
  },
  {
    "keys": "4",
    "command": "Rectangle Tool (画矩形)",
    "category": "tools",
    "description": "激活矩形绘图命令。"
  },
  {
    "keys": "6",
    "command": "Circle Tool (画圆)",
    "category": "tools",
    "description": "激活圆形绘图命令。"
  },
  {
    "keys": "Ctrl + H",
    "command": "Send to Back (移至底层)",
    "category": "system",
    "description": "更改图元叠放次序，将其移到底层。"
  },
  {
    "keys": "Ctrl + F",
    "command": "Bring to Front (移至顶层)",
    "category": "system",
    "description": "将图元叠放次序移到最顶层显示。"
  },
  {
    "keys": "Ctrl + Alt + C",
    "command": "Zoom to Objects",
    "category": "system",
    "description": "缩放视口以将所选实体完全居中居中呈现。"
  }
];
const TIPS = [
  {
    "title": "经典单键工具切换系统",
    "content": "在 Vectorworks 中，数字和单字母很多被直接赋予了绘图工具（如 2 代表线，4 代表矩形，X 代表选择）。在使用绘图命令时，多指轻按键盘即可实现无鼠标点击的瞬间切笔。"
  }
];

export default function VectorworksProClient() {
  return (
    <ShortcutCheatsheetClient
      title="Vectorworks Pro"
      subtitle="舞美、景观与高端建筑设计利器。提供 Vectorworks 智能吸附、绘图坐标变换与图层组合快捷键。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
