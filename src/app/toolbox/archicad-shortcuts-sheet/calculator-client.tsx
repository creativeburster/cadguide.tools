'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "tools",
    "name": "🧱 建筑构件"
  },
  {
    "id": "edit",
    "name": "🛠️ 编辑修改"
  },
  {
    "id": "view",
    "name": "👁️ 视图查看"
  }
];
const SHORTCUTS = [
  {
    "keys": "W",
    "command": "Wall (墙工具)",
    "category": "tools",
    "description": "激活墙体三维建模绘制工具. "
  },
  {
    "keys": "D",
    "command": "Door (门工具)",
    "category": "tools",
    "description": "激活门构建放置工具. "
  },
  {
    "keys": "Space",
    "command": "Magic Wand (魔术棒)",
    "category": "tools",
    "description": "按住空格键激活魔术棒, 可根据已有线段边界自动拟合生成闭合墙体或板. "
  },
  {
    "keys": "Ctrl + D",
    "command": "Drag (移动)",
    "category": "edit",
    "description": "移动选定的建筑图元. "
  },
  {
    "keys": "Ctrl + E",
    "command": "Rotate (旋转)",
    "category": "edit",
    "description": "对选定构件进行旋转度数对齐. "
  },
  {
    "keys": "Ctrl + M",
    "command": "Mirror (镜像)",
    "category": "edit",
    "description": "镜像翻转图元结构. "
  },
  {
    "keys": "Ctrl + Alt + D",
    "command": "Drag a Copy",
    "category": "edit",
    "description": "移动的同时克隆一个新实体. "
  },
  {
    "keys": "F3",
    "command": "3D Window",
    "category": "view",
    "description": "瞬间将全图或当前选定范围切换到 3D 轴测透视窗口浏览. "
  },
  {
    "keys": "F2",
    "command": "2D Floor Plan",
    "category": "view",
    "description": "从 3D 或立面图切换回 2D 平面图视图. "
  }
];
const TIPS = [
  {
    "title": "活用魔术棒 (空格键) 快捷拟合",
    "content": "在 ArchiCAD 中, 如果您画好了一条复杂的封闭曲线, 只需要激活墙体或板工具, 按住 `空格键` 并点击这条曲线, ArchiCAD 就会自动将墙体或板沿着该曲线轮廓一键绘制完毕, 免去手动描摹. "
  }
];

export default function GraphisoftArchiCADClient() {
  return (
    <ShortcutCheatsheetClient
      title="Graphisoft ArchiCAD"
      subtitle="建筑大厂 BIM 方案. 收录 ArchiCAD 平面图绘制, 智能魔术棒捕捉, 多重墙体切换及 3D 编辑热键. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
