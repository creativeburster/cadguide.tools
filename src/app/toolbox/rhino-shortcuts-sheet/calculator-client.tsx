'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "draw",
    "name": "✏️ 曲线绘制"
  },
  {
    "id": "modeling",
    "name": "⚙️ 三维建模"
  },
  {
    "id": "modify",
    "name": "🛠️ 实体编辑"
  },
  {
    "id": "system",
    "name": "💻 系统控制"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "Line",
    "category": "draw",
    "description": "绘制单条直线段。"
  },
  {
    "keys": "PL",
    "command": "Polyline",
    "category": "draw",
    "description": "绘制连续的多重折线。"
  },
  {
    "keys": "C",
    "command": "Circle",
    "category": "draw",
    "description": "通过指定圆心和半径绘制圆。"
  },
  {
    "keys": "EL",
    "command": "Ellipse",
    "category": "draw",
    "description": "绘制椭圆曲线。"
  },
  {
    "keys": "E",
    "command": "ExtrudeCrv",
    "category": "modeling",
    "description": "沿直线方向挤出曲线生成实体表面。"
  },
  {
    "keys": "LOFT",
    "command": "Loft",
    "category": "modeling",
    "description": "通过多段断面曲线放样生成过渡曲面。"
  },
  {
    "keys": "M",
    "command": "Move",
    "category": "modify",
    "description": "移动选定的曲面或物件。"
  },
  {
    "keys": "CO / CP",
    "command": "Copy",
    "category": "modify",
    "description": "克隆并复制选中物件。"
  },
  {
    "keys": "RO",
    "command": "Rotate",
    "category": "modify",
    "description": "围绕指定原点和基准角旋转物件。"
  },
  {
    "keys": "TR",
    "command": "Trim",
    "category": "modify",
    "description": "用剪切物体修剪多余的部分。"
  },
  {
    "keys": "S",
    "command": "Scale",
    "category": "modify",
    "description": "等比例缩放三维模型体积。"
  },
  {
    "keys": "F",
    "command": "FilletEdge",
    "category": "modify",
    "description": "对实体倒角倒圆角。"
  },
  {
    "keys": "Ctrl + G",
    "command": "Group",
    "category": "system",
    "description": "将多个物件组合为一个整体组。"
  },
  {
    "keys": "Ctrl + H",
    "command": "Hide",
    "category": "system",
    "description": "在视口中隐藏当前选择的所有物件。"
  },
  {
    "keys": "Ctrl + Alt + H",
    "command": "Show",
    "category": "system",
    "description": "使所有被隐藏的物件重新浮现。"
  }
];
const TIPS = [
  {
    "title": "右键与空格快速重复上次命令",
    "content": "Rhino 设计的精髓在于右手不离开鼠标。每一次命令结束后，轻点鼠标右键或敲击键盘空格键即可快速重复执行上一次命令。"
  },
  {
    "title": "自定义命令别名实现 CAD 迁移",
    "content": "在“首选项 ➔ 别名”设置中，您可以加载自定义的 `.txt` 别名配置，将常用的挤出拉伸等映射为单字母热键，极大缩短击键次数。"
  }
];

export default function Rhino3DClient() {
  return (
    <ShortcutCheatsheetClient
      title="Rhino 3D"
      subtitle="工业设计与曲面建模效率利器。精选 Rhino 键盘热键、视图切换指令，支持快速搜索及 PDF 打印备忘录。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      downloadAliasText={`; Rhino Command Aliases
L=Line
PL=Polyline
C=Circle
EL=Ellipse
E=ExtrudeCrv
LOFT=Loft
M=Move
CO / CP=Copy
RO=Rotate
TR=Trim
S=Scale
F=FilletEdge
Ctrl + G=Group
Ctrl + H=Hide
Ctrl + Alt + H=Show`} downloadAliasFileName="rhino_aliases.txt"
    />
  );
}
