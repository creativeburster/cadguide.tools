'use client';

import ShortcutDiffClient from '@/components/shortcut-diff-client';

const DIFF_DATA = [
  {
    "shortcut": "L",
    "primaryCmd": "LINE",
    "secondaryCmd": "LINE",
    "isSame": true,
    "diffNote": "",
    "useCase": "绘制二维直线. "
  },
  {
    "shortcut": "C",
    "primaryCmd": "CIRCLE",
    "secondaryCmd": "CIRCLE",
    "isSame": true,
    "diffNote": "",
    "useCase": "绘制圆形. "
  },
  {
    "shortcut": "SS",
    "primaryCmd": "QSELECT",
    "secondaryCmd": "SMARTSELECT",
    "isSame": false,
    "diffNote": "中望自主研发的智能选择工具 (SmartSelect) , 相较于 CAD 原生 QSELECT, 能在独立面板中通过拖动属性进行高频批量图元过滤. ",
    "useCase": "根据图元颜色, 图层, 类型等属性快速全选并过滤实体. "
  },
  {
    "shortcut": "FC",
    "primaryCmd": "N/A",
    "secondaryCmd": "FILECOMPARE",
    "isSame": false,
    "diffNote": "中望独创图纸比对命令, 直接在当前视口将新旧两版图纸重合叠加, 用不同高亮色标记改动图元. AutoCAD 中对应需使用 COMPARE 命令. ",
    "useCase": "快速对比双版本图纸变更. "
  },
  {
    "shortcut": "MX",
    "primaryCmd": "N/A",
    "secondaryCmd": "MESSENGER",
    "isSame": false,
    "diffNote": "中望专有机电与协同通讯助手别名, 可在图纸内与当前局域网下的其他设计师收发消息与协同备注. ",
    "useCase": "设计师在线即时沟通备注. "
  },
  {
    "shortcut": "CO",
    "primaryCmd": "COPY",
    "secondaryCmd": "COPY",
    "isSame": true,
    "diffNote": "",
    "useCase": "克隆复制. "
  },
  {
    "shortcut": "TR",
    "primaryCmd": "TRIM",
    "secondaryCmd": "TRIM",
    "isSame": true,
    "diffNote": "",
    "useCase": "修剪几何线段. "
  }
];

export default function AutocadVsZwcadShortcutsClient() {
  return (
    <ShortcutDiffClient
      primaryApp="AutoCAD"
      secondaryApp="ZWCAD"
      diffData={DIFF_DATA}
    />
);
}
