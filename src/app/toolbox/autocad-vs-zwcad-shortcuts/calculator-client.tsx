'use client';

import ShortcutDiffClient from '@/components/shortcut-diff-client';

const DIFF_DATA = [
  {
    "shortcut": "L",
    "primaryCmd": "LINE",
    "secondaryCmd": "LINE",
    "isSame": true,
    "diffNote": "",
    "useCase": "Draw a two-dimensional straight line. "
  },
  {
    "shortcut": "C",
    "primaryCmd": "CIRCLE",
    "secondaryCmd": "CIRCLE",
    "isSame": true,
    "diffNote": "",
    "useCase": "Draw a circle."
  },
  {
    "shortcut": "SS",
    "primaryCmd": "QSELECT",
    "secondaryCmd": "SMARTSELECT",
    "isSame": false,
    "diffNote": "ZW’s independently developed smart selection tool (SmartSelect), compared to CAD Native QSELECT, capable of high-frequency batch filtering of primitives by dragging attributes in an independent panel. ",
    "useCase": "According to the primitive color, the layer, Use attributes such as type to quickly select and filter entities. "
  },
  {
    "shortcut": "FC",
    "primaryCmd": "N/A",
    "secondaryCmd": "FILECOMPARE",
    "isSame": false,
    "diffNote": "ZW's original drawing comparison command directly overlays the old and new drawings in the current viewport., Use different highlight colors to mark modified entities. Use the corresponding ones in AutoCAD COMPARE command. ",
    "useCase": "Quickly compare drawing changes between two versions. "
  },
  {
    "shortcut": "MX",
    "primaryCmd": "N/A",
    "secondaryCmd": "MESSENGER",
    "isSame": false,
    "diffNote": "ZW's proprietary electromechanical and collaborative communication assistant alias can send and receive messages and collaborative notes within the drawing with other designers under the current local area network.. ",
    "useCase": "Designers’ online instant communication notes. "
  },
  {
    "shortcut": "CO",
    "primaryCmd": "COPY",
    "secondaryCmd": "COPY",
    "isSame": true,
    "diffNote": "",
    "useCase": "Clone copy."
  },
  {
    "shortcut": "TR",
    "primaryCmd": "TRIM",
    "secondaryCmd": "TRIM",
    "isSame": true,
    "diffNote": "",
    "useCase": "Trim geometric segments. "
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
