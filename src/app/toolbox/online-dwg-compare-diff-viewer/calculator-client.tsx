'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD DWG Compare (Native COMPARE Command)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Comparison accuracy",
        "score": 5
      },
      {
        "name": "Red and green highlighting fidelity",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "No need to connect to the Internet to run locally",
      "Supports saving comparison differences as new images"
    ],
    "cons": [
      "Requires installation of CAD local client"
    ],
    "officialUrl": "https://www.autodesk.com/products/autocad/features",
    "verdict": "AutoCAD's native AcDb database diff engine—accurately highlights sub-millimeter geometry shifts, text edits, and block attribute changes."
  },
  {
    "name": "Autodesk Viewer Compare Services",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Comparison accuracy",
        "score": 4.5
      },
      {
        "name": "Red and green highlighting fidelity",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "It can be run on the web page",
      "Support layout space comparison"
    ],
    "cons": [
      "Need to register an account to log in"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "The free comparison extension provided by Autodesk Cloud Viewer can effectively overlap two versions of drawings and adjust the transparency for verification."
  },
  {
    "name": "DraftSight Compare Drawings Utility",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Comparison accuracy",
        "score": 4
      },
      {
        "name": "Red and green highlighting fidelity",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Lightweight stand-alone desktop level comparison",
      "Most friendly to replacement software users"
    ],
    "cons": [
      "Limited deep change recognition for Nested Blocks"
    ],
    "officialUrl": "https://www.draftsight.com/features/drawing-compare",
    "verdict": "A local map version comparison suite with excellent performance and still has good support for large files."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Align origin and reference point",
    "desc": "Before running a diff, verify that both drawing revisions share the exact same WCS (0,0,0) base point and insertion units; an offset base point will flag the entire drawing as modified."
  },
  {
    "title": "Explode nested references locally",
    "desc": "Bind external references (XREFs) and enable block comparison options before running the diff so modifications inside nested symbols are itemized accurately."
  },
  {
    "title": "Off-grid stand-alone verification guarantee",
    "desc": "Compare confidential tender and construction drawings locally using desktop CAD diff commands (`COMPARE`) rather than uploading revisions to third-party servers."
  }
];
const FAQS = [
  {
    "question": "Red and green in comparison results, what do the three colors of gray represent? ",
    "answer": "According to the official general specification: green represents elements that only exist in the current new version of the drawing (Newly added); red means only exists in old version of drawings (has been deleted); gray indicates that the two versions are completely identical and have not been changed."
  },
  {
    "question": "Can the comparison recognize text changes in the table? ",
    "answer": "Yes. As long as it is based on MTEXT (multiline text) or DTEXT (single line of text) stored entity, if even a single punctuation mark is modified in the position or content, it will be highlighted."
  }
];

export default function OnlineDwgCompareDiffViewerClient() {
  return (
    <CloudReferralClient
      title="Cloud DWG Revision Difference & Compare Visualizer"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Spotting subtle dimensional changes, moved walls, or revised callouts between two DWG revisions by eye is error-prone. Automated DWG diff utilities overlay both drawing databases and color-code added (green), deleted (red), and unchanged (gray) entities with revision clouds."
      riskWarning="Drawing revisions reflect critical engineering change orders (ECOs) and tender pricing adjustments. For confidential projects, always run the native `COMPARE` command locally in AutoCAD, BricsCAD, or DraftSight rather than uploading files to public web portals."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
