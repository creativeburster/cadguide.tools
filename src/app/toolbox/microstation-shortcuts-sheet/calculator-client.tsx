'use client';

import ShortcutCheatsheetClient from '@/components/shortcut-cheatsheet-client';

const CATEGORIES = [
  {
    "id": "accudraw",
    "name": "🎯 AccuDraw 辅助"
  },
  {
    "id": "draw",
    "name": "✏️ 图元绘制"
  },
  {
    "id": "view",
    "name": "👁️ 视口控制"
  }
];
const SHORTCUTS = [
  {
    "keys": "Enter",
    "command": "SmartLock",
    "category": "accudraw",
    "description": "AccuDraw 极速精髓，锁定当前光标所在的 X 轴或 Y 轴。"
  },
  {
    "keys": "X",
    "command": "Lock X Axis",
    "category": "accudraw",
    "description": "单轴锁定 X 轴方向。"
  },
  {
    "keys": "Y",
    "command": "Lock Y Axis",
    "category": "accudraw",
    "description": "单轴锁定 Y 轴方向。"
  },
  {
    "keys": "Space",
    "command": "Toggle Compass",
    "category": "accudraw",
    "description": "在直角坐标系与极坐标系圆盘罗盘之间快速切换。"
  },
  {
    "keys": "Q",
    "command": "Quit Command",
    "category": "draw",
    "description": "退出当前正激活的绘图工具，返回默认选择状态。"
  },
  {
    "keys": "W",
    "command": "Toggle Element Selection",
    "category": "draw",
    "description": "激活或取消激活元素元素选择工具。"
  },
  {
    "keys": "Ctrl + B",
    "command": "View Attributes",
    "category": "view",
    "description": "调出视口属性面板，显示/隐藏图层填充或线重。"
  },
  {
    "keys": "Ctrl + F",
    "command": "Save Settings",
    "category": "view",
    "description": "保存当前所有的视口视角属性，防止关闭软件后视口重置。"
  }
];
const TIPS = [
  {
    "title": "AccuDraw 与回车锁定机制",
    "content": "在画线时，一旦线型捕捉到正交的对齐虚线上，立刻按一下 `Enter`（回车），此时你的鼠标可以在任意位置点击，线条方向也会死死地锁在刚才的方向，非常好用。"
  }
];

export default function BentleyMicroStationClient() {
  return (
    <ShortcutCheatsheetClient
      title="Bentley MicroStation"
      subtitle="基建与路桥设计速查指南。提供 MicroStation 常用键盘 Key-in 指令、AccuDraw 轴锁定快捷键及视口管理，支持 A4 打印。"
      categories={CATEGORIES}
      shortcuts={SHORTCUTS}
      tips={TIPS}
      
    />
  );
}
