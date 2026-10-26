'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Viewer (Official WebGL CAD/BIM Review Portal)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Rendering Fidelity",
        "score": 5
      },
      {
        "name": "Sectioning & Measurement",
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
    "verdict": "Industry-standard free WebGL review portal powered by Autodesk Platform Services (APS), supporting 80+ native CAD and BIM formats with sectioning and measurement."
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
        "name": "Sectioning & Measurement",
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
    "verdict": "Widely used mechanical CAD collaboration portal with smooth browser rendering for SolidWorks assemblies and STEP files."
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
        "name": "Sectioning & Measurement",
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
    "verdict": "Official Trimble web viewer tailored for architectural and interior `.skp` scenes, preserving scene tabs, tags, and shadow studies."
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
    "desc": "Configure strict access tokens and `noindex` headers on self-hosted review portals so shared project links are never indexed by search engines."
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
      painPointDesc="Reviewing complex 3D mechanical assemblies (SolidWorks, CATIA, NX, STEP) or BIM models with external stakeholders requires zero-install WebGL viewers that support live section planes, redline markups, and point-to-point measurements in the browser."
      riskWarning="3D CAD assemblies contain exact machining dimensions, internal topology, and kinematic mates. Avoid uploading proprietary assemblies to unverified public viewers; use enterprise collaboration portals with role-based access control, dynamic watermarking, and disabled B-Rep downloads."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
