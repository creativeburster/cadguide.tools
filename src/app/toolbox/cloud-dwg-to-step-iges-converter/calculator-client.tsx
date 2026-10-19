'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CAD Exchanger (Industry recognized 3D converter)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "Topological fitting degree",
        "score": 5
      },
      {
        "name": "Data restoration degree",
        "score": 5
      },
      {
        "name": "Format richness",
        "score": 4
      }
    ],
    "pros": [
      "B-Rep Topology reconstruction is extremely accurate",
      "Perfectly retain surface curvature"
    ],
    "cons": [
      "The commercial desktop version is more expensive"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "Professional engineering data exchange core engine, 3D solid core (Parasolid, ACIS) The conversion algorithm is extremely well tuned."
  },
  {
    "name": "Autodesk Fusion (Official integrated channel)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Topological fitting degree",
        "score": 4
      },
      {
        "name": "Data restoration degree",
        "score": 5
      },
      {
        "name": "Format richness",
        "score": 4
      }
    ],
    "pros": [
      "Cloud-native parsing of DWG entities",
      "One-click export AP214 STEP"
    ],
    "cons": [
      "A cloud account needs to be loaded and the speed is limited by network speed"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "Autodesk cloud modeling platform has its own processing DWG 3D The inherent advantages of databases."
  },
  {
    "name": "GrabCAD Workbench Translators",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Topological fitting degree",
        "score": 4
      },
      {
        "name": "Data restoration degree",
        "score": 4
      },
      {
        "name": "Format richness",
        "score": 3.5
      }
    ],
    "pros": [
      "Completely free collaboration space",
      "Integrated large assembly analysis"
    ],
    "cons": [
      "Limited support for very old IGES formats"
    ],
    "officialUrl": "https://grabcad.com/",
    "verdict": "Excellent free industrial-grade 3D hosting and translation platform, Ideal for hassle-free alignment of everyday engineering files between engineers."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Eliminate two-dimensional projection lines",
    "desc": "Before exporting 3D DWG, Delete all 2D outline layouts, Dimension lines and text comments, only pure three-dimensional entities are retained (Solid) To reduce geometric redundancy."
  },
  {
    "title": "Prefer STEP format",
    "desc": "The STEP format preserves solid assembly hierarchy, part colors (AP214), and closed B-Rep surface topology much more reliably than legacy IGES files."
  },
  {
    "title": "Check for tolerance drift",
    "desc": "For precision mating surfaces, run 'Import Diagnostics' and 'Check Geometry' in SolidWorks after conversion to detect any boundary tolerance drift."
  }
];
const FAQS = [
  {
    "question": "What should I do if the converted 3D entity becomes a hollow shell? ",
    "answer": "This happens when the source 3D DWG contains open polygon meshes or unstitched surfaces (Mesh/Surface) rather than watertight 3DSOLID ACIS entities. Run the 'Knit / Stitch Surface' command in your MCAD system to heal open sheets into a solid body."
  },
  {
    "question": "What is the difference between STEP AP203 and STEP AP214?",
    "answer": "STEP AP203 only stores 3D geometric topology and assembly structure; STEP AP214 additionally preserves face/body colors, layer assignments, and validation properties, making AP214 (or AP242) the recommended choice."
  }
];

export default function CloudDwgToStepIgesConverterClient() {
  return (
    <CloudReferralClient
      title="Online 3D DWG to STEP/IGES CAD Translator"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Importing 3D DWG solids into mechanical CAD platforms (such as SolidWorks or Creo) or CAM systems (such as Mastercam) requires translating ACIS 3DSOLID entities into parametric STEP (AP203/AP214) or IGES boundary representations (B-Rep) rather than faceted polygon meshes."
      riskWarning="Mechanical 3D model (such as core mold, machined parts) is the company’s top-secret intellectual property. Perform 3D B-Rep (Boundary Representation) before uploading to the cloud) When converting data, special precautions must be taken to prevent data leakage and loss of trade secrets. For high-precision parts, be sure to use local CAD Conversion plug-in."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
