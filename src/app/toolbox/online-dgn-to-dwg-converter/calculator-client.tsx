'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Bentley MicroStation (Official desktop kernel saved as)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Cell Library Restore",
        "score": 5
      },
      {
        "name": "Level mapping degree",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Bentley Official native geometry reorganization",
      "Supports mounting CSV batch comparison table"
    ],
    "cons": [
      "Commercial version licensing is extremely expensive"
    ],
    "officialUrl": "https://www.bentley.com/software/bentley-view/",
    "verdict": "The gold standard for DGN-to-DWG conversion—supports full CSV remapping tables for Levels, Fonts, LineWeights, and Shared Cells."
  },
  {
    "name": "ODA File Converter (Official Data Alliance Converter)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "Cell Library Restore",
        "score": 4.5
      },
      {
        "name": "Level mapping degree",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Free without commercial license",
      "Provides underlying C++ SDK-level algorithms"
    ],
    "cons": [
      "No visual GUI primitive parameter fine-tuning"
    ],
    "officialUrl": "https://www.opendesign.com/guestfiles/oda_file_converter",
    "verdict": "Maintained by the Open Design Alliance (ODA), providing reliable local batch conversion between DGN V8 and DWG schemas."
  },
  {
    "name": "Any DGN to DWG Converter",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Cell Library Restore",
        "score": 4
      },
      {
        "name": "Level mapping degree",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Green lightweight batch export",
      "Runs extremely fast"
    ],
    "cons": [
      "Fitting Bentley-specific line styles requires manual configuration"
    ],
    "officialUrl": "https://anydwg.com/dgn-to-dwg.html",
    "verdict": "Professional third-party conversion gadget, runs independently, Suitable for rapid delivery during daily cross-software collaboration."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Mount the Remap CSV mapping file",
    "desc": "In MicroStation's Save As DWG Options, attach a CSV remapping table to map Bentley Levels, LineWeights, and Fonts directly to target AutoCAD Layers and ACI colors."
  },
  {
    "title": "Handling Shared Cells",
    "desc": "In the MicroStation DWG export options, map 'Shared Cells' to standard AutoCAD 'Block References' (INSERT) so compound symbols do not explode into loose primitive segments."
  },
  {
    "title": "Uniformly use True Color",
    "desc": "Map custom Bentley color tables (.tbl) to standard AutoCAD Color Index (ACI) or RGB values during export so linework remains legible on dark model-space backgrounds."
  }
];
const FAQS = [
  {
    "question": "What causes 'OLE container error' on converted DGN primitives?",
    "answer": "This occurs when the DGN file contains embedded Microsoft Office OLE objects or proprietary civil proxy data. Convert tables to native CAD table entities before exporting to DWG."
  },
  {
    "question": "Does the difference between DGN V7 and V8 formats affect conversion?",
    "answer": "Yes. DGN V7 (ISFF) is a legacy 16-bit format limited to 63 levels and 32 MB file sizes, whereas DGN V8 (introduced in 2001) is a modern 64-bit database supporting unlimited levels. Ensure your converter uses an updated ODA Teigha/DGN library."
  }
];

export default function OnlineDgnToDwgConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bentley DGN to AutoCAD DWG Layer Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="When translating Bentley MicroStation DGN files to AutoCAD DWG format, architectural differences between the two kernels often cause unmapped MicroStation Levels, exploded Cell libraries, and missing custom RSC line styles (.lin)."
      riskWarning="DGN files are widely used in critical infrastructure projects including bridges, rail transit, and municipal utilities. Always prioritize local conversion via MicroStation's built-in 'Save As DWG' engine with a validated CSV level-mapping table rather than uploading sensitive drawings to public cloud converters."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
