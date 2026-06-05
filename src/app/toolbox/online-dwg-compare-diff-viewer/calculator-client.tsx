'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD DWG Compare (Official local built-in command)",
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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "The official bottom-level graphics comparison function has the strongest algorithm, Not only can it identify line movements of a few millimeters, but also changes in block attributes.. "
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
    "verdict": "The free comparison extension provided by Autodesk Cloud Viewer can effectively overlap two versions of drawings and adjust the transparency for verification.. "
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
    "officialUrl": "https://www.draftsight.com/",
    "verdict": "A local map version comparison suite with excellent performance and still has good support for large files.. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Align origin and reference point",
    "desc": "Before comparison, the origin of the model space of the two versions of the drawings must be ensured. (0,0,0) Perfectly aligned. If the origin is offset, The comparison result will falsely report that all the elements in the image are moving. "
  },
  {
    "title": "Explode nested references locally",
    "desc": "For complex drawings, you can perform the comparison first EXPLODE (explode) those custom blocks and nested xrefs (Xrefs) , To prevent the comparison algorithm from counting them directly as a single deletion action. "
  },
  {
    "title": "Off-grid stand-alone verification guarantee",
    "desc": "Sensitive bidding drawings should be compared with AutoCAD local drawings on a dedicated machine without network access. "
  }
];
const FAQS = [
  {
    "question": "Red and green in comparison results, What do the three colors of gray represent? ",
    "answer": "According to the official general specification: green represents elements that only exist in the current new version of the drawing (Newly added); red means only exists in old version of drawings (has been deleted); gray indicates that the two versions are completely identical and have not been changed.. "
  },
  {
    "question": "Can the comparison recognize text changes in the table? ",
    "answer": "Yes. As long as it is based on MTEXT (multiline text) or DTEXT (single line of text) stored entity, If even a single punctuation mark is modified in the position or content, it will be highlighted.. "
  }
];

export default function OnlineDwgCompareDiffViewerClient() {
  return (
    <CloudReferralClient
      title="Cloud DWG Revision Difference & Compare Visualizer"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="When dealing with multiple revision changes for large construction or electrical and mechanical projects, find two revisions DWG Small physical changes in drawings are a big problem. It is easy to miss them simply by manual proofreading.. Using the cloud-based DWG Revision Compare diff program, It can achieve high-precision overlay comparison and automatically use red, Green highlights add, delete and modify entities in new drawings. "
      riskWarning="Changes to drawings often represent core changes to the project and business budget cards. Combine the two versions DWG It is very dangerous to centrally upload to unknown picture comparison websites. If conditions permit, Please run AutoCAD locally first COMPARE (graph compare) command, It is strictly prohibited to use untrusted public cloud services to prevent the leakage of business secrets. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
