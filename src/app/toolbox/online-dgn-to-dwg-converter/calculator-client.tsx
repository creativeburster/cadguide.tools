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
    "officialUrl": "https://www.bentley.com/",
    "verdict": "Undoubtedly the most accurate conversion solution. Use its built-in conversion wizard to precisely define DGN levels Logic to DWG layers. "
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
    "officialUrl": "https://www.opendesign.com/",
    "verdict": "Professional low-level format converter maintained by the Open Design Alliance (ODA), For DGN V7/V8 and DWG The mapping mechanism between versions is perfect. "
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
    "officialUrl": "https://anydwg.com/",
    "verdict": "Professional third-party conversion gadget, runs independently, Suitable for rapid delivery during daily cross-software collaboration. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Mount the Remap CSV mapping file",
    "desc": "When exporting from MicroStation, Configure .csv control table, Specify Levels, Colors, LineWeights one by one as the corresponding CAD Layers and Standard Color Index (ACI)."
  },
  {
    "title": "Handling Shared Cells",
    "desc": "In the export options, change'Shared unit' expands to normal'Blocks', prevents the AutoCAD The drawing was destroyed into sporadic primitives. "
  },
  {
    "title": "Uniformly use True Color",
    "desc": "Avoid using Bentley-specific color tables, Switch element color values to generic RGB true color before conversion, Prevent everything from turning black after importing CAD. "
  }
];
const FAQS = [
  {
    "question": "Converted primitives show 'OLE container error'What is the reason? ",
    "answer": "This means that your DGN drawing has external Excel Datasheet or non-vector drawing. CAD is not compatible with this interface, It is recommended to solidify the screenshot into a normal pixel layer in Bentley before exporting.. "
  },
  {
    "question": "DGN The V7 and V8 Does the format affect conversion? ",
    "answer": "Yes. V7 is an old historical version, There are upper limits on file size and number of layers; V8 is 2001 A common 64-bit three-dimensional database format in the future. Before conversion, you need to confirm whether the target DWG platform can recognize the corresponding ODA Drive."
  }
];

export default function OnlineDgnToDwgConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bentley DGN to AutoCAD DWG Layer Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Bentley MicroStation DGN When converting drawings to AutoCAD DWG drawings, Since the base principles of the two platforms are completely different, this usually results in MicroStation 's level (Levels) 'Unable to snap to CAD' layer (Layers) ', Proprietary cell libraries (Cells) degenerate into broken line segments, and the collapse of Bentley’s signature handwritten continuous line style. "
      riskWarning="DGN The format is generally used in infrastructure design such as national large bridges, rail transit and municipal network management., Involves extremely strict physical security and project sensitivity. Please give priority to use MicroStation Local built-in 'Save as DWG'Function to perform high-precision matching and mount a regular layer comparison table (CSV) , Avoid using public conversion websites for high-volume conversions. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
