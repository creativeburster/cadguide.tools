'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Viewer (Autodesk official cloud view picture)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Rendering Fidelity",
        "score": 5
      },
      {
        "name": "Cutting Measurement Force",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Supports over 80 project formats",
      "Completely retain the parameter attribute hierarchical tree"
    ],
    "cons": [
      "Real-time two-way online annotation intercom is not supported"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "Completely free and the most powerful online WebGL image viewing platform, Its Forge/APS engine is suitable for all types of 3D The fit of the format drawings is unparalleled. "
  },
  {
    "name": "GrabCAD Viewer / Workbench",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Rendering Fidelity",
        "score": 4
      },
      {
        "name": "Cutting Measurement Force",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Integrated community version control",
      "Excellent dimensional measurement accuracy"
    ],
    "cons": [
      "Requires login and requires high mobile performance"
    ],
    "officialUrl": "https://grabcad.com/",
    "verdict": "Mechanical designers’ favorite free collaborative bulletin board, perfect for large-scale SLDASM or STEP structure has extremely smooth loading. "
  },
  {
    "name": "SketchUp Viewer for Web",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Rendering Fidelity",
        "score": 4
      },
      {
        "name": "Cutting Measurement Force",
        "score": 3.5
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Open the SKP scene instantly on the web page",
      "Comes with scene style and shadow adjustment"
    ],
    "cons": [
      "General support for industrial assembly such as SolidWorks"
    ],
    "officialUrl": "https://www.sketchup.com/",
    "verdict": "A cloud solution specially provided for landscape, home decoration and stage design designers, Perfect synchronization of layer visibility with scene page. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Be sure to enable the sharing link expiration mechanism",
    "desc": "When sharing WebGL perspective links to clients, Be sure to set an access validity period (e.g. 7 Queen of Heaven expires) and anti-download protection. "
  },
  {
    "title": "Lighten up and reduce the size before uploading",
    "desc": "For extremely large mechanical parts, it is recommended to run them locally before uploading.'Noise Reduction (Simplify Mesh) 'Processing, Remove unnecessary threads, gear details to prevent webpage crashes. "
  },
  {
    "title": "Unauthorized external indexing is prohibited",
    "desc": "The enterprise sharing platform needs to configure robots.txt and access permission policies, Completely block search engine detection. "
  }
];
const FAQS = [
  {
    "question": "How to solve the problem of screen flickering and freezing when rotating a model on a web page? ",
    "answer": "This may be because your browser does not have hardware acceleration turned on. WebGL In CPU soft rendering state. It is recommended to set it in Chrome ➔ Check 'Use hardware acceleration' in the system'. "
  },
  {
    "question": "Why do many parts appear missing after the assembly is imported? ",
    "answer": "Like SolidWorks `.sldasm` The assembly file itself does not contain geometric entities, but refers to the `.sldprt` parts. You need to package the entire assembly and all referenced part files into `.zip` Upload the compressed package together for analysis. "
  }
];

export default function Online3dCadViewerCollaboratorClient() {
  return (
    <CloudReferralClient
      title="Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Share complex 3D CAD assemblies with clients or teams (such as CATIA, NX, SolidWorks, STEP) or Revit BIM When models are reviewed on-site, ordinary users often do not have professional modeling software on their computers.. Leveraging a cloud-based WebGL 3D browser, Large models can be loaded without installation and can be rotated online, Sectioning, red line marking and dimension measurement. "
      riskWarning="3D CAD The assembly contains all machining dimensions of the components, internal topology and engineering assembly links. Uploading these files directly to unknown cloud photo viewing websites is easy to encounter'Data Dehydration Interception' and Commercial Theft. It is recommended to use a high-end collaboration platform with enterprise security permission control and dynamic watermark encryption. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
