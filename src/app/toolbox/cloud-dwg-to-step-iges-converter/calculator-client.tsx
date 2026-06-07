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
    "verdict": "Professional engineering data exchange core engine, 3D solid core (Parasolid, ACIS) The conversion algorithm is extremely well tuned. "
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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "Autodesk cloud modeling platform has its own processing DWG 3D The inherent advantages of databases. "
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
    "verdict": "Excellent free industrial-grade 3D hosting and translation platform, Ideal for hassle-free alignment of everyday engineering files between engineers. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Eliminate two-dimensional projection lines",
    "desc": "Before exporting 3D DWG, Delete all 2D outline layouts, Dimension lines and text comments, only pure three-dimensional entities are retained (Solid) To reduce geometric redundancy. "
  },
  {
    "title": "Prefer STEP format",
    "desc": "STEP The format has more perfect solid assembly structure information than IGES., And it can accurately lock the color of the part and the topological sewing (Sewing) of the surface. "
  },
  {
    "title": "Check for tolerance drift",
    "desc": "For mating surfaces, please import SolidWorks 'Geometry check'', Prevent tolerance drift (Tolerance Drift) during conversion. "
  }
];
const FAQS = [
  {
    "question": "What should I do if the converted 3D entity becomes a hollow shell?? ",
    "answer": "This is usually due to the surface mesh used in the original 3D DWG (Mesh/Surface) Instead of solid modeling. If it is a slice import, you need to run'Sew Surface 'command reconstructs hollow surfaces into closed solids. "
  },
  {
    "question": "STEP AP203 What is the difference between AP214 and AP214?? ",
    "answer": "AP203 Only three-dimensional spatial geometric coordinates and structures are retained; AP214 additionally supports color on this basis, Layer definition and complex dimensioning (GD&T). Recommended AP214 Format."
  }
];

export default function CloudDwgToStepIgesConverterClient() {
  return (
    <CloudReferralClient
      title="Online 3D DWG to STEP/IGES CAD Translator"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="will contain 3D solids DWG Drawings are imported into mechanical 3D CAD (e.g. SolidWorks, Creo) or for CNC manufacturing (such as Mastercam), It needs to be translated into common STEP (AP203/AP214) or IGES Geometric expression. Ordinary polygon transformations often turn surfaces into rough triangular meshes (Mesh) , Making industrial processing accuracy obsolete. "
      riskWarning="Mechanical 3D model (such as core mold, machined parts) is the company’s top-secret intellectual property. Perform 3D B-Rep (Boundary Representation) before uploading to the cloud) When converting data, special precautions must be taken to prevent data leakage and loss of trade secrets. For high-precision parts, be sure to use local CAD Conversion plug-in. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
