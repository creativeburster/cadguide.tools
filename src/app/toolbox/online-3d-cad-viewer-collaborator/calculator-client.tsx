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
    "verdict": "Completely free and the most powerful online WebGL image viewing platform, its Forge/APS engine is suitable for all types of 3D The fit of the format drawings is unparalleled."
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
    "verdict": "Mechanical designers’ favorite free collaborative bulletin board, perfect for large-scale SLDASM or STEP structure has extremely smooth loading."
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
    "verdict": "A cloud solution specially provided for landscape, home decoration and stage design designers, Perfect synchronization of layer visibility with scene page."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Be sure to enable the sharing link expiration mechanism",
    "desc": "When sharing WebGL review links with external clients, always enforce link expiration policies (e.g., 7-day auto-expiration), password protection, and geometry download restrictions."
  },
  {
    "title": "Lighten up and reduce the size before uploading",
    "desc": "For large mechanical assemblies, run 'Simplify / Defeature' locally before uploading to suppress internal helical threads, gear teeth, and fastener fillets, preventing browser WebGL memory overflow."
  },
  {
    "title": "Unauthorized external indexing is prohibited",
    "desc": "The enterprise sharing platform needs to configure robots.txt and access permission policies, completely block search engine detection."
  }
];
const FAQS = [
  {
    "question": "How to solve the problem of screen flickering and freezing when rotating a model on a web page? ",
    "answer": "This occurs when browser GPU hardware acceleration is disabled, forcing WebGL into software rendering on the CPU. Enable 'Use graphics acceleration when available' in Chrome Settings -> System."
  },
  {
    "question": "Why do many parts appear missing after the assembly is imported? ",
    "answer": "Native assembly files like SolidWorks `.sldasm` only store component transforms and file references rather than embedded part geometry. Use 'Pack and Go' to bundle the `.sldasm` and all referenced `.sldprt` files into a single `.zip` archive before uploading."
  }
];

export default function Online3dCadViewerCollaboratorClient() {
  return (
    <CloudReferralClient
      title="Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Share complex 3D CAD assemblies with clients or teams (such as CATIA, NX, SolidWorks, STEP) or Revit BIM When models are reviewed on-site, ordinary users often do not have professional modeling software on their computers. Leveraging a cloud-based WebGL 3D browser, Large models can be loaded without installation and can be rotated online, Sectioning, red line marking and dimension measurement."
      riskWarning="3D CAD assemblies contain exact machining dimensions, internal topology, and kinematic mates. Avoid uploading proprietary assemblies to unverified public viewers; use enterprise collaboration portals with role-based access control, dynamic watermarking, and disabled B-Rep downloads."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
