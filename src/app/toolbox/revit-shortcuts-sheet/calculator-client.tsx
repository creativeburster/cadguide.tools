'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "arch",
    "name": "🏠 建筑与墙体"
  },
  {
    "id": "struct",
    "name": "🏗️ 结构构件"
  },
  {
    "id": "view",
    "name": "👁️ 视图控制"
  },
  {
    "id": "modify",
    "name": "🛠️ 修改与编辑"
  }
];
const SHORTCUTS = [
  {
    "keys": "WA",
    "command": "Wall (墙体)",
    "category": "arch",
    "description": "在平面图中绘制建筑墙体。"
  },
  {
    "keys": "DR",
    "command": "Door (门)",
    "category": "arch",
    "description": "在墙体上放置门构件。"
  },
  {
    "keys": "WN",
    "command": "Window (窗)",
    "category": "arch",
    "description": "在墙体上快速开窗。"
  },
  {
    "keys": "CL",
    "command": "Column (结构柱)",
    "category": "struct",
    "description": "放置承重结构柱构件。"
  },
  {
    "keys": "BM",
    "command": "Beam (结构梁)",
    "category": "struct",
    "description": "绘制水平梁承重框架。"
  },
  {
    "keys": "VG / VV",
    "command": "Visibility/Graphics",
    "category": "view",
    "description": "调出视图可见性控制面板，管理图元类别过滤器。"
  },
  {
    "keys": "WT",
    "command": "Tile Windows",
    "category": "view",
    "description": "将所有已打开的视图平铺平铺在当前屏幕中，方便协同核对。"
  },
  {
    "keys": "ZA",
    "command": "Zoom All",
    "category": "view",
    "description": "将所有平铺视口中的模型居中对齐全屏显示。"
  },
  {
    "keys": "MV",
    "command": "Move",
    "category": "modify",
    "description": "移动选定的墙体或模型图元。"
  },
  {
    "keys": "CO",
    "command": "Copy",
    "category": "modify",
    "description": "克隆选取的构件。"
  },
  {
    "keys": "RO",
    "command": "Rotate",
    "category": "modify",
    "description": "旋转模型图元。"
  },
  {
    "keys": "AL",
    "command": "Align",
    "category": "modify",
    "description": "将一个或多个图元对齐到参考边界，BIM 排版必用。"
  },
  {
    "keys": "TR",
    "command": "Trim/Extend",
    "category": "modify",
    "description": "修剪或延伸多段管线及墙体边界。"
  }
];
const TIPS = [
  {
    "title": "Revit 快捷键输入无需按回车",
    "content": "与 AutoCAD 规则不同，Revit 中的命令大多是双字母组合（如 WA, CO）。键入两个字母后命令会立即执行，千万不要敲击 Enter 键，否则会多出一个无意义的换行操作。"
  },
  {
    "title": "平铺视口 WT 与平铺收拢",
    "content": "处理大型项目时，多视口联跑容易卡顿。用 WT平铺检查完毕后，使用 `Ctrl + Tab` 可以快速循环，使用 `Tab` 可在单个窗口最大化模式下浏览。"
  }
];

export default function RevitBIMClient() {
  return (
    <ShortcutCheatsheetClient
      title="Revit BIM"
      subtitle="BIM 三维协同建模效率表。精选 Revit 建筑、结构、机电（MEP）双字母常用快捷代码，支持一键搜索与 A4 打印。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
