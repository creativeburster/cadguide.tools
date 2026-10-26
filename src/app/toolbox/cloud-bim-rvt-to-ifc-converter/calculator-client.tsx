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
    "verdict": "Officially maintained open-source exporter on GitHub producing standards-compliant IFC schemas ideal for enterprise BIM deliverables."
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
    "verdict": "Recommended by international openBIM standards bodies for strict ISO 16739 schema compliance."
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
      "Optimized property set mapping for multi-discipline coordination",
      "Comes with powerful free IFC viewer"
    ],
    "cons": [
      "Requires BIMcollab ecosystem integration"
    ],
    "officialUrl": "https://www.bimcollab.com/",
    "verdict": "A professional collaborative conversion solution suitable for cross-team collision detection (Clash Detection) in medium and large projects."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Load standard IFC mapping parameter table",
    "desc": "Specify a Shared Parameters mapping table in the Revit IFC export setup so custom RVT parameters map accurately to target IFC PropertySets."
  },
  {
    "title": "Reduced family nesting depth",
    "desc": "Suppress over-detailed hardware and furniture families before exporting to prevent dense polyhedral mesh tessellation and multi-gigabyte IFC file bloat."
  },
  {
    "title": "Perform IFC schema validity verification",
    "desc": "Always audit exported files in an independent IFC viewer to verify that structural columns, walls, and MEP systems are assigned to the proper IFC entity classes."
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
