'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD Recover Utility (Official built-in repair instructions)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Repair accuracy",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Ease of use",
        "score": 5
      }
    ],
    "pros": [
      "Local execution without network risk",
      "Perfectly reconstruct the original image layer table"
    ],
    "cons": [
      "The repair rate for files with severely damaged headers is average"
    ],
    "officialUrl": "https://www.autodesk.com/products/dwg-trueview/overview",
    "verdict": "The first line of defense when reporting errors when opening a map, completely executed offline, it is a native command that engineers must master."
  },
  {
    "name": "AnyDWG Recovery Tool",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Repair accuracy",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 4.5
      },
      {
        "name": "Ease of use",
        "score": 4
      }
    ],
    "pros": [
      "Support batch drawing queue repair",
      "Reconstruction algorithms run independently of CAD"
    ],
    "cons": [
      "The commercial version requires payment"
    ],
    "officialUrl": "https://anydwg.com/dwg-repair.html",
    "verdict": "High-performance third-party independent drawing repair solution, when local CAD Excellent replacement when unable to run RECOVER due to severe error crashes."
  },
  {
    "name": "CADSoftTools Recovery Service",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Repair accuracy",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      },
      {
        "name": "Ease of use",
        "score": 4.5
      }
    ],
    "pros": [
      "One-click online reconstruction in the cloud",
      "No installation or registration required"
    ],
    "cons": [
      "Large file upload speed is limited by network speed"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "Online emergency channel provided by a well-established CAD format parser, Suitable for processing ordinary non-confidential papyrus that requires temporary drawings."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Enable backup file recovery method",
    "desc": "Check the autosave directory you set in CAD options, Find a `.bak` with the same name or `.sv$` file, force the suffix to be renamed `.dwg`, often 99% of progress can be retrieved."
  },
  {
    "title": "Use INSERT block placement method",
    "desc": "If RECOVER fails, open a clean drawing and run the `-INSERT` command to insert the corrupted DWG as an external block reference, which often bypasses damaged header metadata."
  },
  {
    "title": "Running PURGE locally",
    "desc": "After the repair is successful, execute it immediately on the command line `PURGE` and the `AUDIT` command, completely erases junk registry elements that cause corruption."
  }
];
const FAQS = [
  {
    "question": "What are the most common causes of the 'Drawing file is not valid' error?",
    "answer": "This typically occurs due to binary truncation during an unexpected power outage or crash while saving, or when attempting to open a newer DWG schema (such as AC1032) in an older CAD release without downgrading."
  },
  {
    "question": "Why after repair, the color of all my drawing layers turned to white? ",
    "answer": "This means that the layer table database (Layer Table) metadata in the drawing has completely collapsed. In order to preserve the geometric line segments, the repair algorithm forcibly mounts them on 0 layer, you need to manually rearrange the layer."
  }
];

export default function CloudDwgDrawingRecoveryServiceClient() {
  return (
    <CloudReferralClient
      title="Online Damaged DWG Drawing Recovery & Repair Portal"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Encountering the 'Drawing file is not valid' error or experiencing a crash while loading specific block definitions usually indicates corrupted DWG header pointers or damaged AcDb object nodes. When the built-in RECOVER command fails, specialized binary recovery utilities can salvage model space geometry."
      riskWarning="Damage drawings often belong to ongoing projects and contain a large amount of core business and design information. Do not easily upload confidential drawings to public restoration websites whose security is unknown. For core data, it is recommended to use a local physically isolated computer to run security repairs, or try to restore a temporary automatically saved backup file (.sv$) ."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
