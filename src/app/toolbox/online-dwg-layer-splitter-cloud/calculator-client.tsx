'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD WBLOCK Command (Native tile writing instructions)",
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
    "verdict": "Run via CAD built-in commands WBLOCK Combined with Layer Isolation (LAYISO) it is the cleanest, The safest layer splitting rule. "
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
    "officialUrl": "https://github.com/",
    "verdict": "Written based on ODA library Python A drawing processing script that can quickly divide the hierarchical structure of hundreds of drawings on an offline computer.. "
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
    "verdict": "Suitable for emergency drawing hierarchical inspection and output when you are on a business trip and do not have CAD software at hand.. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform local PURE purification",
    "desc": "Run PURGE before splitting to clean up unreferenced empty layers, This prevents the split sub-drawings from still containing a bunch of meaningless empty layer lists. "
  },
  {
    "title": "Absolutely preserve coordinate system consistency",
    "desc": "When writing out a new tile (WBLOCK), Be sure to use absolute zero (0,0,0) as the base point, Otherwise, each sub-drawing will be XREF (external reference) When they overlap, they will completely drift out of position. "
  },
  {
    "title": "Off-network stand-alone LISP script deployment",
    "desc": "The processing of the enterprise's sensitive general picture requires the use of AutoLISP or in a completely disconnected environment. Python Offline script splits output with one click. "
  }
];
const FAQS = [
  {
    "question": "Why are the split sub-drawing files still the same size as the original drawing? ",
    "answer": "This means that most of the elements in the original image may be contained in external references (Xrefs), Or the drawing contains a large number of uncleaned registry junk entities (Regapps). It is necessary to bind external references first and thoroughly purge Split after purification. "
  },
  {
    "question": "How to quickly split a layer locally using a LISP script? ",
    "answer": "This code can be loaded: `(foreach lay (layoutlist) (command \"-WBLOCK\" (strcat lay \".dwg\") \"\" ...))` It can write it out as a local file in seconds according to the layout layer and layer table. "
  }
];

export default function OnlineDwgLayerSplitterCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Layer Splitter & Batch Drawing Separator"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Processing is extremely large and includes architectural, mechanical and electrical, In order to distribute the drawings of different disciplines to different contractors when creating a general drawing with dozens of layers such as pipelines, It needs to be manually split into independent single layer sub-DWGs. Cloud DWG Layer Splitter Can identify layer tables in batches and automatically separate them in the backend (WBLOCK Figure), and keep the datum origin completely coincident. "
      riskWarning="The general map represents the overall geographical arrangement and all confidentiality of the project. Uploading the general map to a public cloud service provider is very easy to encounter global leaks and compliance audits.. Please first load a minimalist file in local AutoCAD AutoLISP Scripts are used to split local layers, and direct unpacking and processing on the public network are prohibited.. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
