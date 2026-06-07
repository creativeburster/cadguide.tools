'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
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
    "verdict": "Official conversion toolkit maintained open source on GitHub, The output is the most rigorous and standard, and is most suitable for enterprises to cooperate with and accept.. "
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
    "verdict": "BIM A conversion tool recommended by standards-setting organizations with extremely high adaptability to international specifications.. "
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
    "verdict": "A professional collaborative conversion solution suitable for cross-team collision detection (Clash Detection) in medium and large projects. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Load standard IFC mapping parameter table",
    "desc": "Specified in Revit export configuration sharedparameters Mapping relationship, ensure RVT Properties are aligned exactly within the IFC PropertySet. "
  },
  {
    "title": "Reduced family nesting depth",
    "desc": "Eliminate unnecessary furniture families such as complex bolts before exporting to reduce the stacking of polyhedral triangle meshes., Prevent IFC volume breach G level. "
  },
  {
    "title": "Perform IFC schema validity verification",
    "desc": "After exporting, be sure to use an independent IFC verification tool to run a format audit., Confirm that major categories such as structural columns and walls are correctly mounted. "
  }
];
const FAQS = [
  {
    "question": "IFC2x3 How should I choose between IFC4 format and IFC4 format?? ",
    "answer": "IFC2x3 It is currently the most mature and widely supported version in the industry; IFC4 is used in three-dimensional geometric fitting., The electromechanical pipeline routing and terrain expression are more advanced, but some old versions of collaboration software may read and report errors.. If there is no request, the output will be given priority. IFC2x3 To ensure compatibility. "
  },
  {
    "question": "Why are some walls incomplete or missing in IFC?? ",
    "answer": "This may be because the Revit family class of these components is assigned'Generic Models', and it is not checked when exporting'Export regular model' option. Please check the component classification attributes. "
  }
];

export default function CloudBimRvtToIfcConverterClient() {
  return (
    <CloudReferralClient
      title="Online Revit RVT to openBIM IFC Standard Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Convert Revit native RVT Format exchange for openBIM open standards IFC (Industry Foundation Classes) file, the most difficult problem is Revit Parameter dictionary mapping missing, space area (IFCSpace) Properties are missing, and 3D solids become corrupted polyhedrons (Polygon Soup) , Leading to the complete scrapping of the downstream coordination system. "
      riskWarning="BIM The model includes building component details, pipeline routing, Structural steel bar configuration and total project cost and other extremely sensitive information. It is recommended to provide local Revit Use the official IFC plug-in in the client for export and debugging, Online cloud RVT parsing via unknown third-party public cloud servers is never recommended. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
