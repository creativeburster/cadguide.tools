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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "The unquestionable benchmark for BIM data quality assurance, Integrate directly into the Revit interface, Ability to conduct in-depth scans of dozens of indicators on RFA. "
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
    "officialUrl": "https://www.solibri.com/",
    "verdict": "An advanced quality inspection tool favored for large-scale project design coordination and cost accounting, with attribute dictionary auditing (Attribute Checker) Extremely hardcore. "
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
    "verdict": "Excellent lightweight online BIM management platform, Can automatically perform standardized constraint audit on family primitive parameters based on LOD accuracy level. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Local double purge",
    "desc": "In the Revit Family Editor, Click Run at least twice in succession to clear unused items (Purge Unused)', Can cull 90% of obsolete materials and subfamily caches. "
  },
  {
    "title": "Remove unnecessary three-dimensional details",
    "desc": "Details such as bolts of components such as mechanical valve families should be set to only in 'Fine'displayed under the view, in'Rough' and'Use simple entities instead, Prevent the main image from loading lag. "
  },
  {
    "title": "Establish an enterprise-level unified shared parameter table",
    "desc": "Avoid using temporary custom parameters and unify read-only shared parameters from the enterprise .txt Load parameter attributes into the file to ensure data purity. "
  }
];
const FAQS = [
  {
    "question": "Why are there only a few hundred RFA family files? KB, After importing the project, it becomes much larger? ",
    "answer": "This is usually due to 'nesting' within the family'A large number of other subfamilies, and these subfamilies are not set to'Shared '. Revit will force a copy of this subfamily library when importing, This causes the main image to expand in size. "
  },
  {
    "question": "Revit 'variable parameters' in'and 'type parameters'What's the difference? ",
    "answer": "'Type Parameters 'When modified, the size of all similar families in the project will be changed at the same time; 'Instance Parameters 'Only change the currently selected one. It is recommended that non-size-critical properties be set as instance parameters to reduce definition redundancy. "
  }
];

export default function OnlineRevitFamilyCheckerAuditClient() {
  return (
    <CloudReferralClient
      title="BIM Revit Family File Integrity & Parameter Auditor"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="In BIM collaborative design, Family files (.rfa) downloaded from the Internet or provided by vendors may vary in quality. Overly nested families, too many uncleaned garbage entities (Unpurged Objects) And illegally named shared parameters (Shared Parameters) will cause Revit The size of the main model skyrocketed, causing project loading to be extremely slow and performance crashing.. "
      riskWarning="Revit The family file not only contains the three-dimensional fine mesh, but also contains the manufacturer's process specifications and specifications.. Uploading graphic element libraries in large batches for cloud auditing involves copyright compliance risks of secondary collection of data.. For enterprise core family libraries, it is recommended to use local Revit Install the official Model Checker plug-in for offline compliance auditing. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
