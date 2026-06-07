'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "eDrawings Viewer (Dassault Systèmes official activation-free picture viewer)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Drawing restoration degree",
        "score": 5
      },
      {
        "name": "Three-dimensional measurement",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Official underlying database engine",
      "Supports exporting self-extracting executable EXE files"
    ],
    "cons": [
      "You need to download the client, which is about a few hundred in size.MB"
    ],
    "officialUrl": "https://www.solidworks.com/",
    "verdict": "The most authoritative image viewing and distribution tool officially produced by Dassault Systèmes, 100% Restore surface mapping and dynamic motion pairs. "
  },
  {
    "name": "Autodesk Viewer (Official multi-format browser)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Drawing restoration degree",
        "score": 4.5
      },
      {
        "name": "Three-dimensional measurement",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Support online decompression of very large-scale assembly packages",
      "Support web annotation"
    ],
    "cons": [
      "Must log in to Autodesk account"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "Autodesk Cloud Viewer is extremely compatible with Dassault format, and it also requires no software installation for viewing. sldprt An excellent solution. "
  },
  {
    "name": "CAD Exchanger Web SDK",
    "rating": 9.3,
    "metrics": [
      {
        "name": "Drawing restoration degree",
        "score": 4
      },
      {
        "name": "Three-dimensional measurement",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Extremely fast loading of WebGL layers",
      "Support quick image cutting on mobile terminal"
    ],
    "cons": [
      "Advanced collaboration features require integrated purchase"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "Thorough analysis of industrial-grade 3D formats, suitable for agile development and integration by teams. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Assembly package and compressed upload",
    "desc": "SolidWorks Assembly (sldasm) contains no geometric data. Please use 'Package (Pack and Go)'function, combines the assembly and all its associated parts (sldprt) Included in a .zip package and uploaded. "
  },
  {
    "title": "Locally clear high-module features such as threads",
    "desc": "Compress and remove threads locally before sharing or uploading, Detailed features of gears and tiny fasteners make the model lightweight, Prevent the web page from directly overflowing and crashing when viewing pictures. "
  },
  {
    "title": "Block external link data monitoring",
    "desc": "Ensure that the detection environment does not leak IP and corporate domains, Prevent active remote positioning by copyright agents. "
  }
];
const FAQS = [
  {
    "question": "Why does the model appear off-white after importing?'And the material is lost? ",
    "answer": "This means that your sldprt did not include the texture library when saving it. (Texture Maps) It is solidified into the file, or the path of the referenced appearance image is lost.. When uploading the package, make sure the material resources are also selected. "
  },
  {
    "id": "measure-guide",
    "question": "Can I measure parts and distances directly inside this online viewer?",
    "answer": "Yes. The official viewer provides specialized measurement instructions: simply click two opposite faces in WebGL, and it automatically calculates the minimum center distance, normal distance, and projection declination."
  },
  {
    "id": "sharing-safety",
    "question": "Is it safe to share the eDrawings link with external manufacturers?",
    "answer": "Yes, but we recommend checking the 'Disable Measure' or 'Enable STL Export' permission flags depending on your IP requirements when creating the file in desktop SolidWorks before uploading."
  }
];

export default function OnlineSolidworksEDrawingsCloudViewerClient() {
  return (
    <CloudReferralClient
      title="Online SolidWorks eDrawings (SLDPRT/SLDASM) Viewer"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="When you need to outsource SolidWorks parts to customers or factories (.sldprt) or assemblies (.sldasm), installing large commercial CAD software is inconvenient. Using the online eDrawings rendering layer, users can browse 3D entities directly in the browser WebGL, view Assembly Trees (Component Trees), hide/display components, and measure critical mating surface spacing. "
      riskWarning="3D part drawings contain complete parameter feature trees and tolerance processes. Uploading to a public unknown drawing viewing platform may trigger commercial telemetry and leak core intellectual property rights.. For sensitive assemblies, please guide users to download the official free version of Dassault Systèmes eDrawings Viewer Local version, use of non-compliant cloud viewing websites is strictly prohibited. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
