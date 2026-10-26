'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Revit Model Checker (Official free audit extension)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Audit depth",
        "score": 5
      },
      {
        "name": "Rule configurability",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Official underlying native support",
      "Full support for custom XML audit rule tables"
    ],
    "cons": [
      "You need to learn certain configuration syntax"
    ],
    "officialUrl": "https://www.autodesk.com/products/revit/overview",
    "verdict": "The unquestionable benchmark for BIM data quality assurance, Integrate directly into the Revit interface, Ability to conduct in-depth scans of dozens of indicators on RFA."
  },
  {
    "name": "Solibri Model Checker (BIM Data and Compliance Quality Audit)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "Audit depth",
        "score": 5
      },
      {
        "name": "Rule configurability",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Comprehensive IFC and RFA Logical verification",
      "Powerful spatial conflict detection"
    ],
    "cons": [
      "The commercial version costs more"
    ],
    "officialUrl": "https://www.solibri.com/solibri-office",
    "verdict": "An advanced quality inspection tool favored for large-scale project design coordination and cost accounting, with attribute dictionary auditing (Attribute Checker) Extremely hardcore."
  },
  {
    "name": "Plannerly BIM Management Suite",
    "rating": 9.3,
    "metrics": [
      {
        "name": "Audit depth",
        "score": 4
      },
      {
        "name": "Rule configurability",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "BIM Standardized management integration",
      "Supports direct comparison in the cloud"
    ],
    "cons": [
      "Must be connected to the Internet"
    ],
    "officialUrl": "https://www.plannerly.com/",
    "verdict": "Excellent lightweight online BIM management platform, can automatically perform standardized constraint audit on family primitive parameters based on LOD accuracy level."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Local double purge",
    "desc": "In the Revit Family Editor, run 'Purge Unused' at least two to three times consecutively to strip nested unused materials, line patterns, and orphaned sub-family definitions."
  },
  {
    "title": "Remove unnecessary three-dimensional details",
    "desc": "Assign high-polygon hardware details (such as valve flange bolts and 3D embossed text) to display only at 'Fine' Detail Level, and use simplified symbolic lines for 'Coarse' and 'Medium' views to keep project viewport navigation fast."
  },
  {
    "title": "Establish an enterprise-level unified shared parameter table",
    "desc": "Avoid using temporary custom parameters and unify read-only shared parameters from the enterprise .txt Load parameter attributes into the file to ensure data purity."
  }
];
const FAQS = [
  {
    "question": "Why does a compact 500 KB RFA family file bloat the main Revit project by tens of megabytes?",
    "answer": "This typically happens when the RFA contains deeply nested sub-families, imported 3D DWG/SAT meshes, or over-modeled parametric arrays that regenerate thousands of faces for every placed instance in the project."
  },
  {
    "question": "What is the difference between Instance Parameters and Type Parameters in Revit?",
    "answer": "Modifying a 'Type Parameter' updates every placed instance of that family type across the entire project simultaneously, whereas an 'Instance Parameter' only affects the individual selected element. Use Type Parameters for standardized catalog sizes to minimize memory overhead."
  }
];

export default function OnlineRevitFamilyCheckerAuditClient() {
  return (
    <CloudReferralClient
      title="BIM Revit Family File Integrity & Parameter Auditor"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Unvetted Revit family files (`.rfa`) downloaded from manufacturer portals often contain imported 3D DWG/SAT geometry, excessive nesting depth, unpurged materials, and non-standard Shared Parameters that severely degrade central RVT model performance."
      riskWarning="Proprietary enterprise Revit family libraries encode custom parametric formulas and BIM standards. Audit `.rfa` files locally using the free Autodesk Interoperability Tools Model Checker for Revit rather than uploading family libraries to unverified third-party servers."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
