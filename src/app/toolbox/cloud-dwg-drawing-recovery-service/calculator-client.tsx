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
      "Reconstructs damaged layer tables and block definitions natively"
    ],
    "cons": [
      "The repair rate for files with severely damaged headers is average"
    ],
    "officialUrl": "https://www.autodesk.com/products/dwg-trueview/overview",
    "verdict": "The primary built-in diagnostic utility for corrupted DWG files—executes 100% offline with full AcDb database awareness."
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
    "verdict": "Standalone binary DWG recovery utility—useful when severe header corruption causes native CAD applications to crash during RECOVER."
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
    "verdict": "Browser-based emergency recovery service suited for salvaging non-confidential 2D drawings when desktop CAD tools are unavailable."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Enable backup file recovery method",
    "desc": "Locate the matching `.bak` or autosave `.sv$` file in your configured AutoCAD temporary directory and rename its extension to `.dwg` to restore the last valid save state."
  },
  {
    "title": "Use INSERT block placement method",
    "desc": "If RECOVER fails, open a clean drawing and run the `-INSERT` command to insert the corrupted DWG as an external block reference, which often bypasses damaged header metadata."
  },
  {
    "title": "Running PURGE locally",
    "desc": "Immediately after salvaging geometry, run `AUDIT` (with fix errors enabled) and `-PURGE` (including RegApps) to strip orphaned database records."
  }
];
const FAQS = [
  {
    "question": "What are the most common causes of the 'Drawing file is not valid' error?",
    "answer": "This typically occurs due to binary truncation during an unexpected power outage or crash while saving, or when attempting to open a newer DWG schema (such as AC1032) in an older CAD release without downgrading."
  },
  {
    "question": "Why after repair, the color of all my drawing layers turned to white? ",
    "answer": "This occurs when the drawing's AcDbLayerTable header is irrecoverably damaged. To salvage the vector geometry, the recovery engine reassigns orphaned entities to Layer 0."
  }
];

export default function CloudDwgDrawingRecoveryServiceClient() {
  return (
    <CloudReferralClient
      title="Online Damaged DWG Drawing Recovery & Repair Portal"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Encountering the 'Drawing file is not valid' error or experiencing a crash while loading specific block definitions usually indicates corrupted DWG header pointers or damaged AcDb object nodes. When the built-in RECOVER command fails, specialized binary recovery utilities can salvage model space geometry."
      riskWarning="Corrupted engineering drawings often contain confidential project geometry and title-block metadata. Avoid uploading proprietary files to unverified public recovery websites; always attempt local recovery via AutoCAD RECOVER or `.bak`/`.sv$` backup restoration first."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
