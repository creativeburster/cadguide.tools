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
    "verdict": "The preferred desktop tool for IFC rule verification and design collision by major global construction companies, the verification report is very rigorous."
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
    "verdict": "Viewer launched by veteran Finnish BIM audit developer, the classification mapping relationship of components is reviewed in detail."
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
    "officialUrl": "https://github.com/xBimTeam/XbimWindowsUI",
    "verdict": "Representative of open source BIM data parsing library, Very suitable for software developers to build their own web verification backend."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform Schema basic format validation",
    "desc": "Verify that in the IFC header file MVD (model view definition) and IFC2X3_TC1 or IFC4 declares no damage."
  },
  {
    "title": "Use local isolation detection",
    "desc": "Confidential projects use Solibri offline verification on isolated surveying and mapping planes, Configuring any network synchronization is strictly prohibited."
  },
  {
    "title": "Configure anti-piracy defense isolation",
    "desc": "Establish LAN-based offline data review specifications to block irrelevant network traffic."
  }
];
const FAQS = [
  {
    "question": "What causes 'Unknown Entity' schema validation errors in an IFC file?",
    "answer": "This means that the export engine that generated the model wrote a custom proprietary component name that does not comply with the official buildingSmart specification. You can set attribute remapping in the validator for filtering."
  },
  {
    "question": "How to determine if a mesh in an IFC model is Watertight ? ",
    "answer": "Geometric self-intersection and hole detection rules can be used using tools such as Solibri, Check whether the scan contains unnecessary triangle overlap or space leakage caused by missing faces."
  }
];

export default function OnlineIfcViewerValidatorClient() {
  return (
    <CloudReferralClient
      title="Online openBIM IFC Standard File Validator & Viewer"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Before submitting openBIM deliverables for clash detection, quantity takeoff, or COBie handover, BIM coordinators must validate IFC2x3/IFC4 files against buildingSMART schema rules, Model View Definitions (MVD), and IDS property requirements."
      riskWarning="IFC models contain comprehensive architectural, structural, and MEP asset data for the entire facility. For sensitive infrastructure or commercial projects, run schema validation locally using desktop tools (such as BIMcollab Zoom, Solibri Anywhere, or BlenderBIM) rather than unverified public web viewers."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
