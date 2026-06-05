'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "quad",
    "name": "🌀 Quad 智能光标"
  },
  {
    "id": "draw",
    "name": "✏️ 绘图命令"
  },
  {
    "id": "modify",
    "name": "🛠️ 修改与编辑"
  }
];
const SHORTCUTS = [
  {
    "keys": "Ctrl",
    "command": "Toggle Quad Display",
    "category": "quad",
    "description": "BricsCAD 核心特色，显示或隐藏悬浮智能工具盘。"
  },
  {
    "keys": "L",
    "command": "LINE",
    "category": "draw",
    "description": "绘制直线段。"
  },
  {
    "keys": "C",
    "command": "CIRCLE",
    "category": "draw",
    "description": "绘制指定心圆。"
  },
  {
    "keys": "PL",
    "command": "PLINE",
    "category": "draw",
    "description": "绘制平面多段线。"
  },
  {
    "keys": "REC",
    "command": "RECTANGLE",
    "category": "draw",
    "description": "绘制矩形闭合曲线。"
  },
  {
    "keys": "M",
    "command": "MOVE",
    "category": "modify",
    "description": "移动选定的图元实体。"
  },
  {
    "keys": "CO",
    "command": "COPY",
    "category": "modify",
    "description": "克隆复制图形。"
  },
  {
    "keys": "RO",
    "command": "ROTATE",
    "category": "modify",
    "description": "旋转物体对齐。"
  },
  {
    "keys": "TR",
    "command": "TRIM",
    "category": "modify",
    "description": "修剪相交几何线条。"
  },
  {
    "keys": "X",
    "command": "EXPLODE",
    "category": "modify",
    "description": "打散块或复合折线为单条几何线。"
  }
];
const TIPS = [
  {
    "title": "使用 Quad 智能轮盘提效 2 倍",
    "content": "BricsCAD 特有的 Quad 智能浮动工具盘，会根据您当前光标所悬停的图元类型，自动计算并推荐最可能需要的 5 个工具（如修剪、倒角、图层属性），彻底减少把手移向顶部菜单的次数。"
  }
];

export default function HexagonBricsCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="Hexagon BricsCAD"
      subtitle="高性能专业 2D/3D CAD。收录 BricsCAD 智能 Quad 快捷工具盘命令、多段线和三维轴侧速查。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
