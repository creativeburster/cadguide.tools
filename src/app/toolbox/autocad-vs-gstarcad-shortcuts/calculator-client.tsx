'use client';

import ShortcutDiffClient from '@/components/shortcut-diff-client';

const DIFF_DATA = [
  {
    "shortcut": "L",
    "primaryCmd": "LINE",
    "secondaryCmd": "LINE",
    "isSame": true,
    "diffNote": "",
    "useCase": "绘制普通二维直线图元. "
  },
  {
    "shortcut": "C",
    "primaryCmd": "CIRCLE",
    "secondaryCmd": "CIRCLE",
    "isSame": true,
    "diffNote": "",
    "useCase": "绘制指定心半径圆. "
  },
  {
    "shortcut": "GWS",
    "primaryCmd": "N/A",
    "secondaryCmd": "GSTARWORKSPACES",
    "isSame": false,
    "diffNote": "浩辰 CAD 特有的工作空间配置器指令. AutoCAD 对应使用的是 WSCURRENT 命令. ",
    "useCase": "切换经典菜单布局与二维草图功能面板区. "
  },
  {
    "shortcut": "SPLAT",
    "primaryCmd": "SPLINE",
    "secondaryCmd": "SPLINE (SPLAT)",
    "isSame": false,
    "diffNote": "浩辰独有样条曲线特殊别名映射, 支持输入更适合拼写记忆的 SPLAT 快捷执行. ",
    "useCase": "绘制样条插值曲线. "
  },
  {
    "shortcut": "VP",
    "primaryCmd": "VPOINT",
    "secondaryCmd": "VPOINT",
    "isSame": true,
    "diffNote": "",
    "useCase": "设置并锁定三维空间的投影视点视角. "
  },
  {
    "shortcut": "EXPRINT",
    "primaryCmd": "EXPORT",
    "secondaryCmd": "EXPORTLAYOUT",
    "isSame": false,
    "diffNote": "浩辰提供的将当前图纸空间布局实体独立输出为普通模型空间图纸的直达扩展. ",
    "useCase": "提取布局视图并输出为独立 DWG 图纸文件. "
  },
  {
    "shortcut": "CO",
    "primaryCmd": "COPY",
    "secondaryCmd": "COPY",
    "isSame": true,
    "diffNote": "",
    "useCase": "复制选中图元实体. "
  },
  {
    "shortcut": "TR",
    "primaryCmd": "TRIM",
    "secondaryCmd": "TRIM",
    "isSame": true,
    "diffNote": "",
    "useCase": "修剪相交多余线段. "
  }
];

export default function AutocadVsGstarcadShortcutsClient() {
  return (
    <ShortcutDiffClient
      primaryApp="AutoCAD"
      secondaryApp="GstarCAD"
      diffData={DIFF_DATA}
    />
);
}
