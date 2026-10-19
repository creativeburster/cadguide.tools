'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "RVT Convert (Revit Version Downgrade & Audit)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Parametric Preservation",
        "score": 5
      },
      {
        "name": "Native RVT/RFA Support",
        "score": 5
      },
      {
        "name": "Ease of Use",
        "score": 5
      }
    ],
    "pros": [
      "Converts Revit 2024-2027 files back to 2023 format without losing parametric family parameters",
      "Avoids stripping geometry into dumb direct shapes unlike traditional intermediate IFC exports",
      "Free browser-based tool with built-in batch Revit version checker"
    ],
    "cons": [
      "Web upload required for cloud conversion processing"
    ],
    "officialUrl": "https://rvtconvert.com/?utm_source=cadguide",
    "verdict": "The best solution when exchanging Revit files with teams on older versions. Preserves editable parametric BIM elements instead of lossy IFC geometry conversion."
  },
  {
    "name": "Revit Native IFC Exporter (Official open source plug-in)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "IfcSpace Reserve",
        "score": 5
      },
      {
        "name": "Parameter completeness",
        "score": 5
      },
      {
        "name": "Standards Compliance",
        "score": 5
      }
    ],
    "pros": [
      "Autodesk officially maintains open source code",
      "Deep support for IFC4 specification"
    ],
    "cons": [
      "Configuration parameters are relatively complex"
    ],
    "officialUrl": "https://github.com/Autodesk/revit-ifc",
    "verdict": "Official conversion toolkit maintained open source on GitHub, the output is the most rigorous and standard, and is most suitable for enterprises to cooperate with and accept."
  },
  {
    "name": "buildingSmart openBIM Exporter Kits",
    "rating": 9.5,
    "metrics": [
      {
        "name": "IfcSpace Reserve",
        "score": 4
      },
      {
        "name": "Parameter completeness",
        "score": 4
      },
      {
        "name": "Standards Compliance",
        "score": 5
      }
    ],
    "pros": [
      "Meet buildingSmart certification standards",
      "Support extended metadata dictionary"
    ],
    "cons": [
      "Steep learning curve"
    ],
    "officialUrl": "https://www.buildingsmart.org/",
    "verdict": "BIM A conversion tool recommended by standards-setting organizations with extremely high adaptability to international specifications."
  },
  {
    "name": "BIMcollab Exporter Suite",
    "rating": 9.3,
    "metrics": [
      {
        "name": "IfcSpace Reserve",
        "score": 4
      },
      {
        "name": "Parameter completeness",
        "score": 4.5
      },
      {
        "name": "Standards Compliance",
        "score": 4
      }
    ],
    "pros": [
      "In-depth parameter optimization has been done for coordination",
      "Comes with powerful free IFC viewer"
    ],
    "cons": [
      "Bind to BIMcollab cloud"
    ],
    "officialUrl": "https://www.bimcollab.com/",
    "verdict": "A professional collaborative conversion solution suitable for cross-team collision detection (Clash Detection) in medium and large projects."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Load standard IFC mapping parameter table",
    "desc": "Specified in Revit export configuration sharedparameters Mapping relationship, ensure RVT Properties are aligned exactly within the IFC PropertySet."
  },
  {
    "title": "Reduced family nesting depth",
    "desc": "Eliminate unnecessary furniture families such as complex bolts before exporting to reduce the stacking of polyhedral triangle meshes. Prevent IFC volume breach G level."
  },
  {
    "title": "Perform IFC schema validity verification",
    "desc": "After exporting, be sure to use an independent IFC verification tool to run a format audit. Confirm that major categories such as structural columns and walls are correctly mounted."
  }
];
const FAQS = [
  {
    "question": "How should I choose between IFC2x3 and IFC4 formats?",
    "answer": "IFC2x3 (Coordination View 2.0) is currently the most mature and widely supported schema across legacy BIM platforms. IFC4 offers superior NURBS/B-Rep geometry fitting, MEP routing, and terrain representation, though older coordination viewers may fail to parse it. Default to IFC2x3 unless IFC4 is explicitly required by the BIM Execution Plan (BEP)."
  },
  {
    "question": "Why are some walls incomplete or missing in IFC? ",
    "answer": "This usually happens when the Revit family category of those components is assigned to 'Generic Models' (IfcBuildingElementProxy) and filtered out during export, or when custom in-place openings fail boolean subtraction. Verify the IFC Export As mapping parameter on the affected families."
  }
];

export default function CloudBimRvtToIfcConverterClient() {
  return (
    <CloudReferralClient
      title="Online Revit RVT to openBIM IFC Standard Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="When converting native Revit RVT models to openBIM IFC (Industry Foundation Classes) files, common engineering challenges include unmapped custom parameter dictionaries, missing spatial boundary (IfcSpace) properties, and curved 3D solids tessellating into faceted polygon soup."
      riskWarning="BIM models contain detailed structural reinforcement, MEP routing, and project cost metadata. For confidential projects, always export IFC files locally using the official open-source Revit IFC Exporter add-in rather than uploading native RVT files to untrusted public servers."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
