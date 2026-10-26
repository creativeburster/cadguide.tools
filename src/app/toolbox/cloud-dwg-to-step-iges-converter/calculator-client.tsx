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
    "verdict": "Industry-grade CAD translation engine with highly accurate ACIS-to-Parasolid and STEP B-Rep kernel healing."
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
    "verdict": "Uses Autodesk's native ACIS/ShapeManager kernel to read 3D DWG solids and export clean AP214 STEP assemblies."
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
    "desc": "Before exporting a 3D DWG, strip 2D title blocks, dimensions, and annotation layers so only watertight 3DSOLID entities are translated into STEP."
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
      riskWarning="3D mechanical models (such as injection molds and precision machined assemblies) represent core intellectual property. For confidential parts, perform B-Rep STEP/IGES translation locally inside your desktop CAD workstation rather than uploading to public cloud converters."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
