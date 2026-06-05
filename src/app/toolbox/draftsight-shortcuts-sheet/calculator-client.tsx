'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "draw",
    "name": "✏️ 二维绘图"
  },
  {
    "id": "modify",
    "name": "🛠️ 修改命令"
  },
  {
    "id": "view",
    "name": "👁️ 视口查看"
  }
];
const SHORTCUTS = [
  {
    "keys": "L",
    "command": "LINE",
    "category": "draw",
    "description": "绘制二维直线. "
  },
  {
    "keys": "C",
    "command": "CIRCLE",
    "category": "draw",
    "description": "绘制指定心半径圆. "
  },
  {
    "keys": "PL",
    "command": "POLYLINE",
    "category": "draw",
    "description": "绘制连续的多段线. "
  },
  {
    "keys": "REC",
    "command": "RECTANGLE",
    "category": "draw",
    "description": "绘制闭合矩形折线. "
  },
  {
    "keys": "H",
    "command": "HATCH",
    "category": "draw",
    "description": "为闭合区域填充自定义图案. "
  },
  {
    "keys": "M",
    "command": "MOVE",
    "category": "modify",
    "description": "移动图纸中的实体. "
  },
  {
    "keys": "CO",
    "command": "COPY",
    "category": "modify",
    "description": "复制选中图元. "
  },
  {
    "keys": "RO",
    "command": "ROTATE",
    "category": "modify",
    "description": "旋转实体. "
  },
  {
    "keys": "TR",
    "command": "TRIM",
    "category": "modify",
    "description": "修剪多余线段. "
  },
  {
    "keys": "O",
    "command": "OFFSET",
    "category": "modify",
    "description": "等距偏移复制线段. "
  },
  {
    "keys": "Z",
    "command": "ZOOM",
    "category": "view",
    "description": "缩放视口图纸. "
  },
  {
    "keys": "P",
    "command": "PAN",
    "category": "view",
    "description": "平移移动当前视口. "
  }
];
const TIPS = [
  {
    "title": "完全对标 AutoCAD 的快捷别名",
    "content": "DraftSight 的底层逻辑与 AutoCAD 完全吻合. 它完全兼容外部加载的 `acad.pgp` 别名配置, 可实现肌肉记忆的无缝过渡. "
  }
];

export default function DassaultDraftSightClient() {
  return (
    <ShortcutCheatsheetClient
      title="Dassault DraftSight"
      subtitle="AutoCAD 平替高性价比方案. 整理 DraftSight 2D 绘图快捷别名, 层表管理命令与视口配置. "
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
);
}
