'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 草图设计"
  },
  {
    "id": "modeling",
    "name": "⚙️ 特征实体"
  },
  {
    "id": "system",
    "name": "💻 视口与系统"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (直线)",
    "category": "sketch",
    "description": "启动草图并绘制折线段. "
  },
  {
    "keys": "C",
    "command": "Center Diameter Circle",
    "category": "sketch",
    "description": "绘制指定心半径圆. "
  },
  {
    "keys": "R",
    "command": "2-Point Rectangle",
    "category": "sketch",
    "description": "绘制标准对角矩形. "
  },
  {
    "keys": "D",
    "command": "Sketch Dimension",
    "category": "sketch",
    "description": "对草图曲线标注物理尺寸约束. "
  },
  {
    "keys": "X",
    "command": "Construction Line Toggle",
    "category": "sketch",
    "description": "高频键! 将当前绘制线一键转换为虚线构造辅助线. "
  },
  {
    "keys": "E",
    "command": "Extrude (拉伸)",
    "category": "modeling",
    "description": "将二维多边形拉伸成立体特征. "
  },
  {
    "keys": "F",
    "command": "Fillet (倒圆角)",
    "category": "modeling",
    "description": "对实体边界边缘进行光滑倒圆角. "
  },
  {
    "keys": "M",
    "command": "Move/Copy",
    "category": "modeling",
    "description": "移动或原位克隆复制实体模型. "
  },
  {
    "keys": "Shift + S",
    "command": "Scripts and Add-Ins",
    "category": "system",
    "description": "调出 Python 或 API 插件管理窗口. "
  },
  {
    "keys": "Ctrl + Shift + R",
    "command": "Compute All",
    "category": "system",
    "description": "当大量装配链改变后, 重构重算所有关联的配合. "
  }
];
const TIPS = [
  {
    "title": "构造辅助线切换键 X",
    "content": "在草图中绘制几何线时, 如果不需要它作为拉伸分界面, 只需选中该线条并按一下 `X` 键, 线条即可转换为辅助虚线, 再次按 `X` 复原, 非常快捷. "
  }
];

export default function AutodeskFusion360Client() {
  return (
    <ShortcutCheatsheetClient
      title="Autodesk Fusion 360"
      subtitle="云端协作设计轻量三维方案. 提供 Fusion 360 雕刻面, 三维拉伸与 CAM 制造刀路快捷代码, A4 打印优化. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
