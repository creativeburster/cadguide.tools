'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "sketch",
    "name": "📐 草图常用"
  },
  {
    "id": "modeling",
    "name": "⚙️ 建模修改"
  },
  {
    "id": "view",
    "name": "👁️ 视图对齐"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line (直线)",
    "category": "sketch",
    "description": "在平面草图中绘制连续直线段. "
  },
  {
    "keys": "C",
    "command": "Circle (圆)",
    "category": "sketch",
    "description": "绘制以指定位置为中心的圆. "
  },
  {
    "keys": "R",
    "command": "Rectangle (矩形)",
    "category": "sketch",
    "description": "通过边界对角线指定矩形. "
  },
  {
    "keys": "Ctrl + G",
    "command": "Regenerate",
    "category": "modeling",
    "description": "重构并更新三维特征树模型, 防止显示异常. "
  },
  {
    "keys": "Ctrl + D",
    "command": "Default View (默认视角)",
    "category": "view",
    "description": "瞬间将三维工作视口对正并重置回标准等轴测默认视角. "
  },
  {
    "keys": "Ctrl + R",
    "command": "Repaint",
    "category": "view",
    "description": "强制刷新当前工作屏幕, 消除绘图垃圾像素虚影. "
  },
  {
    "keys": "Shift + 中键",
    "command": "Pan View",
    "category": "view",
    "description": "按住键盘 Shift 键配合鼠标中键拖动, 平移视口. "
  }
];
const TIPS = [
  {
    "title": "一键重置默认三维视角 (Ctrl+D)",
    "content": "当在三维装配体内旋转得晕头转向时, 直接按下 `Ctrl + D`, Creo 会一秒将视角对齐并归位到标准的立体轴测图, 方便重新定位. "
  }
];

export default function PTCCreoClient() {
  return (
    <ShortcutCheatsheetClient
      title="PTC Creo"
      subtitle="精密结构设计与参数化建模. 提供 Creo 草图绘制, 实体剪裁及装配约束常用代码, 支持一键过滤搜索. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
