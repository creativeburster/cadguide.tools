'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD WBLOCK & LAYISO Workflow (Native Local Export)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Layer separation accuracy",
        "score": 5
      },
      {
        "name": "Origin alignment fidelity",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Runs locally, 0% data leakage",
      "100% Keep your drawing database clean"
    ],
    "cons": [
      "Multi-file drag queue is not supported"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "Combining native `LAYISO` and `WBLOCK` (or an AutoLISP loop) exports clean per-discipline DWG files locally with zero coordinate drift."
  },
  {
    "name": "Any CAD Layer Splitter Script",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Layer separation accuracy",
        "score": 4.5
      },
      {
        "name": "Origin alignment fidelity",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "purely native LISP or Python Process",
      "High throughput batch concurrency"
    ],
    "cons": [
      "Requires a little basic script configuration"
    ],
    "officialUrl": "https://github.com/mozman/ezdxf",
    "verdict": "Open-source Python library (`ezdxf`) capable of batch-splitting DXF/DWG files by layer prefix on offline engineering workstations."
  },
  {
    "name": "Convertio Bulk Separator",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Layer separation accuracy",
        "score": 4
      },
      {
        "name": "Origin alignment fidelity",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 3
      }
    ],
    "pros": [
      "Cloud parallel computing queuing",
      "Download ZIP packages with one click"
    ],
    "cons": [
      "The free version of large drawings may time out and report an error."
    ],
    "officialUrl": "https://convertio.co/",
    "verdict": "Suitable for emergency drawing hierarchical inspection and output when you are on a business trip and do not have CAD software at hand."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform local PURE purification",
    "desc": "Run `-PURGE` before splitting so exported sub-drawings only contain active discipline layers rather than hundreds of empty template layers."
  },
  {
    "title": "Absolutely preserve coordinate system consistency",
    "desc": "When exporting separated layers to new drawing files (WBLOCK), always lock the insertion base point to world origin (0,0,0) so the split sub-drawings align accurately when re-attached as external references (XREFs)."
  },
  {
    "title": "Off-network stand-alone LISP script deployment",
    "desc": "For confidential master site plans, run automated AutoLISP or Python (`ezdxf`) layer-splitting scripts locally on your workstation."
  }
];
const FAQS = [
  {
    "question": "Why are the split sub-drawing files still the same size as the original drawing? ",
    "answer": "This means that most of the elements in the original image may be contained in external references (Xrefs), or the drawing contains a large number of uncleaned registry junk entities (Regapps). It is necessary to bind external references first and thoroughly purge Split after purification."
  },
  {
    "question": "How to quickly split a layer locally using a LISP script? ",
    "answer": "This code can be loaded: `(foreach lay (layoutlist) (command \"-WBLOCK\" (strcat lay \".dwg\") \"\" ...))` It can write it out as a local file in seconds according to the layout layer and layer table."
  }
];

export default function OnlineDwgLayerSplitterCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Layer Splitter & Batch Drawing Separator"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="When managing master site plans containing architectural, structural, and MEP layers in a single file, engineers often need to split discipline layers into standalone DWG files for subcontractors. Automated layer splitters batch-export layer groups via WBLOCK while preserving the shared (0,0,0) world coordinate origin."
      riskWarning="Master coordination drawings contain complete site layouts, coordinates, and multi-discipline designs. Avoid uploading confidential master DWGs to public cloud splitters; use local AutoLISP or `WBLOCK` automation instead."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
