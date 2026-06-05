'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 草图绘制"
  },
  {
    "id": "part",
    "name": "⚙️ 零件建模"
  },
  {
    "id": "assembly",
    "name": "🔗 装配约束"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (直线)",
    "category": "sketch",
    "description": "创建二维或三维草图直线. "
  },
  {
    "keys": "C",
    "command": "Center Point Circle",
    "category": "sketch",
    "description": "绘制以指定点为圆心的圆. "
  },
  {
    "keys": "D",
    "command": "Dimension (尺寸)",
    "category": "sketch",
    "description": "对草图几何体进行尺寸驱动标注约束. "
  },
  {
    "keys": "F",
    "command": "Fillet (圆角)",
    "category": "sketch",
    "description": "在草图两相交线之间创建圆角.. "
  },
  {
    "keys": "E",
    "command": "Extrude (拉伸)",
    "category": "part",
    "description": "将封闭草图轮廓挤出为特征实体. "
  },
  {
    "keys": "R",
    "command": "Revolve (旋转)",
    "category": "part",
    "description": "通过将二维草图围绕某轴旋转生成特征. "
  },
  {
    "keys": "H",
    "command": "Hole (打孔)",
    "category": "part",
    "description": "在实体面上以指定点快速创建螺纹孔, 沉头孔等. "
  },
  {
    "keys": "F3",
    "command": "Toggle Visibility",
    "category": "part",
    "description": "快速切换当前鼠标悬浮构件的可见性状态. "
  },
  {
    "keys": "C",
    "command": "Constraint (约束)",
    "category": "assembly",
    "description": "在装配体环境调出面贴合, 同轴心等约束面板. "
  },
  {
    "keys": "P",
    "command": "Place Component",
    "category": "assembly",
    "description": "从本地硬盘或库中插入现有的三维零件. "
  }
];
const TIPS = [
  {
    "title": "草图标注快捷键 D 的魔力",
    "content": "键入 D 命令可以快速开始尺寸标注. 如果是标注圆弧, 它会自动默认为半径标注; 如果是两个圆, 它会自动默认为中心距标注, 极度智能化. "
  }
];

export default function AutodeskInventorClient() {
  return (
    <ShortcutCheatsheetClient
      title="Autodesk Inventor"
      subtitle="三维机械装配建模速查. 整理 Inventor 草图约束, 零件特征与大型装配体约束快捷键, 支持搜索和 A4 打印. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
