'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "tools",
    "name": "✏️ 绘图工具"
  },
  {
    "id": "camera",
    "name": "🎥 相机与视图"
  },
  {
    "id": "system",
    "name": "💻 组与系统"
  }
];
const SHORTCUTS = [
  {
    "keys": "Space",
    "command": "Select (选择)",
    "category": "tools",
    "description": "激活普通指针框选工具，退出其它编辑指令。"
  },
  {
    "keys": "L",
    "command": "Line (直线)",
    "category": "tools",
    "description": "在坐标平面内绘制一段直线。"
  },
  {
    "keys": "C",
    "command": "Circle (圆)",
    "category": "tools",
    "description": "绘制正多边形逼近的圆形。"
  },
  {
    "keys": "R",
    "command": "Rectangle (矩形)",
    "category": "tools",
    "description": "通过对角线两点绘制矩形。"
  },
  {
    "keys": "P",
    "command": "Push/Pull (推拉)",
    "category": "tools",
    "description": "草图大师精髓，将二维面拉伸为三维实体。"
  },
  {
    "keys": "M",
    "command": "Move (移动)",
    "category": "tools",
    "description": "移动所选几何体，配合 Ctrl 键可激活阵列复制。"
  },
  {
    "keys": "Q",
    "command": "Rotate (旋转)",
    "category": "tools",
    "description": "旋转选定的平面或实体。"
  },
  {
    "keys": "S",
    "command": "Scale (缩放)",
    "category": "tools",
    "description": "对选定几何体进行拉伸缩放。"
  },
  {
    "keys": "O",
    "command": "Orbit (环绕)",
    "category": "camera",
    "description": "三维环绕旋转视口，按住鼠标中键同样可触发。"
  },
  {
    "keys": "H",
    "command": "Pan (手掌平移)",
    "category": "camera",
    "description": "水平平移视口视图。"
  },
  {
    "keys": "Z",
    "command": "Zoom (缩放)",
    "category": "camera",
    "description": "实时前后拖动鼠标缩放视口焦距。"
  },
  {
    "keys": "G",
    "command": "Make Component (建组件)",
    "category": "system",
    "description": "将选中的几何体归纳为可以关联克隆的“组件”。"
  },
  {
    "keys": "Ctrl + G",
    "command": "Make Group (建群组)",
    "category": "system",
    "description": "将选中的独立线面打组，防止相互粘连变形。"
  }
];
const TIPS = [
  {
    "title": "按住 Ctrl 拖动进行阵列复制",
    "content": "在使用“移动 (M)”工具时，按一下键盘 `Ctrl` 键，鼠标旁会多出一个加号。此时拖动构件即可复制。输入 `*5` 或 `/5` 并回车，能实现等距克隆 5 个物体或在区间内等距平分。"
  },
  {
    "title": "三维轴向锁定技巧",
    "content": "在绘制线段或移动物体时，按键盘的 `↑`（锁定蓝轴）、`←`（锁定绿轴）、`→`（锁定红轴），可强制在三维空间中绝对正交移动，绝对不会飘线。"
  }
];

export default function SketchUpProClient() {
  return (
    <ShortcutCheatsheetClient
      title="SketchUp Pro"
      subtitle="草图大师极速方案。包含 SketchUp 常用绘图笔刷、群组设置与相机环绕快捷键，支持在线过滤及 A4 Landscape 打印。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
