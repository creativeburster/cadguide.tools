'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk DWG TrueView (Official Desktop Converter)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Downgrade Fidelity",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Batch operation",
        "score": 4
      }
    ],
    "pros": [
      "Official underlying database rewriting",
      "Lossless conversion of dynamic blocks"
    ],
    "cons": [
      "Only supports Windows and the installation package is large"
    ],
    "officialUrl": "https://www.autodesk.com/products/dwg-trueview/overview",
    "verdict": "Autodesk officially provides free image viewing and drawing version converter, with the highest safety factor, Ensure that the CAD database nodes are intact."
  },
  {
    "name": "Any DWG Version Converter",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Downgrade Fidelity",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 4
      },
      {
        "name": "Batch operation",
        "score": 5
      }
    ],
    "pros": [
      "Support batch background silent downgrade",
      "Compatible with all AutoCAD historical codes"
    ],
    "cons": [
      "Commercial version requires license purchase"
    ],
    "officialUrl": "https://anydwg.com/dwg-converter.html",
    "verdict": "A very classic batch drawing version reconstruction program, the operation is pure and neat, Data compatibility is good after downgrading."
  },
  {
    "name": "CADSoftTools Version Converter",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Downgrade Fidelity",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      },
      {
        "name": "Batch operation",
        "score": 3
      }
    ],
    "pros": [
      "Extremely fast unpacking in the cloud",
      "Support DXF-DWG mutual conversion"
    ],
    "cons": [
      "Occasionally custom entity conversion is lost in large files"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "A professional cloud downgrade platform with excellent performance to meet the needs of rapid handover during daily engineering cooperation."
  }
];
const BEST_PRACTICES = [
  {
    "title": "It is recommended to downgrade to 2013 format (AC1027)",
    "desc": "This is currently the most balanced version of compatibility and data structure in the entire industry, almost 100% All alternative CAD engines can read and write smoothly."
  },
  {
    "title": "Be wary of parameterized entity degradation",
    "desc": "After downgrading, please check complex association annotations, whether the curvature parameters of the 3D section and the 3D model surface are exploded as broken lines."
  },
  {
    "title": "Use isolated virtual machine conversion",
    "desc": "For customer drawings of unknown origin, it is recommended to convert them in an isolated virtual machine environment. Protect against macro viruses and telemetry scraping."
  }
];
const FAQS = [
  {
    "question": "What do DWG header version codes like AC1032, AC1027, and AC1024 mean?",
    "answer": "These are the first magic number marks of the DWG file (Magic Number) . For example AC1032 represents 2018-2027 version of the drawing database, because the old version of the software cannot recognize the head structure. It will directly report that the file is damaged or the version is not supported."
  },
  {
    "question": "What happened if Dynamic Blocks failed after downgrading? ",
    "answer": "Some dynamic blocks based on new constraint relationships are only supported in higher versions. After forced downgrade, CAD The database will convert this into a degenerate static plain anonymous block."
  }
];

export default function OnlineDwgVersionDowngraderCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Format Version Downgrader"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Encountering the 'Drawing file was created by an incompatible version' error means the DWG uses a newer header schema (such as AutoCAD 2018-2026 AC1032) than your installed CAD software supports. Downgrading converts the binary database to widely compatible AC1027 (AutoCAD 2013) or AC1021 (AutoCAD 2007) schemas."
      riskWarning="Downgrading to legacy DWG formats (such as R14 or 2000) can strip modern parametric constraints, dynamic block actions, and AEC custom proxy objects. For confidential engineering drawings, use Autodesk's free desktop DWG TrueView utility to batch-convert DWG versions locally offline."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
