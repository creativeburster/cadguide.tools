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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "Autodesk officially provides free image viewing and drawing version converter, with the highest safety factor, Ensure that the CAD database nodes are intact. "
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
    "officialUrl": "https://anydwg.com/",
    "verdict": "A very classic batch drawing version reconstruction program, the operation is pure and neat, Data compatibility is good after downgrading. "
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
    "verdict": "A professional cloud downgrade platform with excellent performance to meet the needs of rapid handover during daily engineering cooperation.. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "It is recommended to downgrade to 2013 format (AC1027)",
    "desc": "This is currently the most balanced version of compatibility and data structure in the entire industry, almost 100% All alternative CAD engines can read and write smoothly. "
  },
  {
    "title": "Be wary of parameterized entity degradation",
    "desc": "After downgrading, please check complex association annotations, Whether the curvature parameters of the 3D section and the 3D model surface are exploded as broken lines. "
  },
  {
    "title": "Use isolated virtual machine conversion",
    "desc": "For customer drawings of unknown origin, it is recommended to convert them in an isolated virtual machine environment., Protect against macro viruses and telemetry scraping. "
  }
];
const FAQS = [
  {
    "question": "AC1032, AC1027, AC1024 What are the codes? ",
    "answer": "These are the first magic number marks of the DWG file (Magic Number) . For example AC1032 represents 2018-2027 version of the drawing database, because the old version of the software cannot recognize the head structure., It will directly report that the file is damaged or the version is not supported. "
  },
  {
    "question": "What happened if Dynamic Blocks failed after downgrading?? ",
    "answer": "Some dynamic blocks based on new constraint relationships are only supported in higher versions. After forced downgrade, CAD The database will convert this into a degenerate static plain anonymous block. "
  }
];

export default function OnlineDwgVersionDowngraderCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Format Version Downgrader"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Encountered 'Graph file version not supported''When the error occurs, you may have obtained a higher version AutoCAD (As saved in 2018-2027 AC1032 coding) drawings, However, there are only old versions of CAD software available locally.. Use cloud-based format downgrade tools to quickly rewrite files to the broadly compatible AC1027 (2013) format) or AC1021 (2007 format) . "
      riskWarning="Frequent format degradation may not only result in special parameterized 'dynamic blocks''and the constraint relationship is lost, it may even trigger an anti-piracy compliance review. Please ensure that the downgrade behavior is carried out within the security boundary of enterprise authorization. For core confidential design, It is recommended to download the official free desktop DWG TrueView software to complete local conversion. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
