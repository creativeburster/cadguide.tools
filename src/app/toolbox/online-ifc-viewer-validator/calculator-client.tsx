'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "BIMcollab Zoom (Professional BIM verification dashboard)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Calibration accuracy",
        "score": 5
      },
      {
        "name": "Data presentation power",
        "score": 5
      },
      {
        "name": "Compliance Verification Power",
        "score": 5
      }
    ],
    "pros": [
      "In-depth support for Smart Views data filtering",
      "Extremely smooth loading of large models"
    ],
    "cons": [
      "Commercial premium modules require subscription fees"
    ],
    "officialUrl": "https://www.bimcollab.com/",
    "verdict": "The preferred desktop tool for IFC rule verification and design collision by major global construction companies, The verification report is very rigorous. "
  },
  {
    "name": "Solibri Anywhere (Classic IFC Quality Audit Program)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "Calibration accuracy",
        "score": 5
      },
      {
        "name": "Data presentation power",
        "score": 4.5
      },
      {
        "name": "Compliance Verification Power",
        "score": 4.5
      }
    ],
    "pros": [
      "Totally free to download",
      "Powerful attribute classification inspection function"
    ],
    "cons": [
      "The installation package is larger and takes up more memory to run."
    ],
    "officialUrl": "https://www.solibri.com/",
    "verdict": "Viewer launched by veteran Finnish BIM audit developer, The classification mapping relationship of components is reviewed in detail. "
  },
  {
    "name": "xBIM Xplorer (Open source lightweight verification core)",
    "rating": 9.4,
    "metrics": [
      {
        "name": "Calibration accuracy",
        "score": 4
      },
      {
        "name": "Data presentation power",
        "score": 4
      },
      {
        "name": "Compliance Verification Power",
        "score": 4
      }
    ],
    "pros": [
      "100% Free and open source",
      "Easy to carry out secondary development based on .NET architecture"
    ],
    "cons": [
      "The default UI interface is simple, Need to beautify it yourself"
    ],
    "officialUrl": "https://github.com/xBimTeam",
    "verdict": "Representative of open source BIM data parsing library, Very suitable for software developers to build their own web verification backend. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform Schema basic format validation",
    "desc": "Verify that in the IFC header file MVD (model view definition) and IFC2X3_TC1 or IFC4 declares no damage. "
  },
  {
    "title": "Use local isolation detection",
    "desc": "Confidential projects use Solibri offline verification on isolated surveying and mapping planes, Configuring any network synchronization is strictly prohibited. "
  },
  {
    "title": "Configure anti-piracy defense isolation",
    "desc": "Establish LAN-based offline data review specifications to block irrelevant network traffic. "
  }
];
const FAQS = [
  {
    "question": "IFC Schema error reporting 'Unknown Entity' What is the reason? ",
    "answer": "This means that the export engine that generated the model wrote a custom proprietary component name that does not comply with the official buildingSmart specification.. You can set attribute remapping in the validator for filtering. "
  },
  {
    "question": "How to determine if a mesh in an IFC model is Watertight (Watertight) ? ",
    "answer": "Geometric self-intersection and hole detection rules can be used using tools such as Solibri, Check whether the scan contains unnecessary triangle overlap or space leakage caused by missing faces. "
  }
];

export default function OnlineIfcViewerValidatorClient() {
  return (
    <CloudReferralClient
      title="Online openBIM IFC Standard File Validator & Viewer"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="In order to ensure that the BIM collaborative model enters the downstream cost, 100% compliance when analyzing energy consumption or delivering it for government filing buildingSmart Standardization, development and operation and maintenance personnel urgently need to IFC Model metadata dictionary (Data Dict), polyhedral geometry closure (Watertightness) and parent-child topology nesting relationship for automatic verification. "
      riskWarning="IFC It is an aggregation of big data of the whole life cycle of construction. Inadvertent uploading to public picture viewing sites with data monitoring may expose the physical structure of the project.. Please give priority to using the security verification client certified by the buildingSmart standards organization., It is strictly prohibited to directly upload drawings of government secrets or military projects. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
