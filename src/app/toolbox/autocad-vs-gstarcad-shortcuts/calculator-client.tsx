'use client';

import ShortcutDiffClient from '@/components/shortcut-diff-client';

const DIFF_DATA = [
  {
    "shortcut": "L",
    "primaryCmd": "LINE",
    "secondaryCmd": "LINE",
    "isSame": true,
    "diffNote": "",
    "useCase": "Draw ordinary two-dimensional straight line primitives. "
  },
  {
    "shortcut": "C",
    "primaryCmd": "CIRCLE",
    "secondaryCmd": "CIRCLE",
    "isSame": true,
    "diffNote": "",
    "useCase": "Draw a circle with a specified center radius. "
  },
  {
    "shortcut": "GWS",
    "primaryCmd": "N/A",
    "secondaryCmd": "GSTARWORKSPACES",
    "isSame": false,
    "diffNote": "Haochen CAD’s unique workspace configurator command. AutoCAD The corresponding use is the WSCURRENT command. ",
    "useCase": "Switch between the classic menu layout and the 2D sketch function panel area. "
  },
  {
    "shortcut": "SPLAT",
    "primaryCmd": "SPLINE",
    "secondaryCmd": "SPLINE (SPLAT)",
    "isSame": false,
    "diffNote": "Haochen's unique spline special alias mapping supports inputting more suitable for spelling memory. SPLAT Quick execution. ",
    "useCase": "Draw a spline interpolation curve. "
  },
  {
    "shortcut": "VP",
    "primaryCmd": "VPOINT",
    "secondaryCmd": "VPOINT",
    "isSame": true,
    "diffNote": "",
    "useCase": "Sets and locks the projection viewpoint in three-dimensional space. "
  },
  {
    "shortcut": "EXPRINT",
    "primaryCmd": "EXPORT",
    "secondaryCmd": "EXPORTLAYOUT",
    "isSame": false,
    "diffNote": "Haochen provides a direct extension that independently outputs the current drawing space layout entities into ordinary model space drawings. ",
    "useCase": "Extract layout views and export as stand-alone DWG drawing files. "
  },
  {
    "shortcut": "CO",
    "primaryCmd": "COPY",
    "secondaryCmd": "COPY",
    "isSame": true,
    "diffNote": "",
    "useCase": "Copy the selected entity entity. "
  },
  {
    "shortcut": "TR",
    "primaryCmd": "TRIM",
    "secondaryCmd": "TRIM",
    "isSame": true,
    "diffNote": "",
    "useCase": "Trim excess intersecting line segments. "
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
