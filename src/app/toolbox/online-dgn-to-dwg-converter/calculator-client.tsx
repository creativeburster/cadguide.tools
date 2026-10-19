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
    "verdict": "Undoubtedly the most accurate conversion solution. Use its built-in conversion wizard to precisely define DGN levels Logic to DWG layers."
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
    "verdict": "Professional low-level format converter maintained by the Open Design Alliance (ODA), for DGN V7/V8 and DWG The mapping mechanism between versions is perfect."
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
    "desc": "When exporting from MicroStation, Configure .csv control table, Specify Levels, Colors, LineWeights one by one as the corresponding CAD Layers and Standard Color Index (ACI)."
  },
  {
    "title": "Handling Shared Cells",
    "desc": "In the MicroStation DWG export options, map 'Shared Cells' to standard AutoCAD 'Block References' (INSERT) so compound symbols do not explode into loose primitive segments."
  },
  {
    "title": "Uniformly use True Color",
    "desc": "Avoid using Bentley-specific color tables, Switch element color values to generic RGB true color before conversion, Prevent everything from turning black after importing CAD."
  }
];
const FAQS = [
  {
    "question": "What causes 'OLE container error' on converted DGN primitives?",
    "answer": "This means that your DGN drawing has external Excel Datasheet or non-vector drawing. CAD is not compatible with this interface, it is recommended to solidify the screenshot into a normal pixel layer in Bentley before exporting."
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
