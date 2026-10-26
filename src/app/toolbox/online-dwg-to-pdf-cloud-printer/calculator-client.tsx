'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Viewer (Official free channel)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Linewidth Fidelity",
        "score": 5
      },
      {
        "name": "Layout completeness",
        "score": 5
      },
      {
        "name": "Security Compliance",
        "score": 4
      }
    ],
    "pros": [
      "Autodesk The official engine is absolutely the same",
      "100% Support 3D view"
    ],
    "cons": [
      "Must be logged in and loading is relatively slow"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "Autodesk's official cloud viewer and plotter—renders DWG layouts with accurate SHX/TTF fonts and layer hierarchy."
  },
  {
    "name": "CloudConvert DWG to PDF",
    "rating": 9.3,
    "metrics": [
      {
        "name": "Linewidth Fidelity",
        "score": 4
      },
      {
        "name": "Layout completeness",
        "score": 4
      },
      {
        "name": "Security Compliance",
        "score": 3
      }
    ],
    "pros": [
      "Support batch script calling",
      "Provide high-anonymity interface"
    ],
    "cons": [
      "Highly complex CTB custom pen widths are not supported"
    ],
    "officialUrl": "https://cloudconvert.com/",
    "verdict": "The best choice for extremely fast conversion of ordinary drawings, supporting static plane export of mainstream layers."
  },
  {
    "name": "Allinpdf DWG to PDF",
    "rating": 9,
    "metrics": [
      {
        "name": "Linewidth Fidelity",
        "score": 3
      },
      {
        "name": "Layout completeness",
        "score": 4
      },
      {
        "name": "Security Compliance",
        "score": 3
      }
    ],
    "pros": [
      "Pure front-end drag and drop without logging in",
      "Very fast"
    ],
    "cons": [
      "For large drawings, lines may be lost"
    ],
    "officialUrl": "https://allinpdf.com/",
    "verdict": "An extremely fast viewing and conversion channel suitable for temporary use by individuals. It is not recommended for large enterprises to deploy sensitive services."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Clean up junk entities locally",
    "desc": "Before plotting to PDF, run `-PURGE` and `-SCALELISTEDIT` (Reset) to strip bloated annotation scale lists and keep vector PDF sizes compact."
  },
  {
    "title": "Using Microsoft Print to PDF",
    "desc": "If no CAD restrictions are installed, PDF output using Microsoft Virtual Print Driver has the highest geometric fidelity."
  },
  {
    "title": "Limit external link telemetry",
    "desc": "For sensitive files, choose a pure read-only local parsing solution that limits network access."
  }
];
const FAQS = [
  {
    "question": "Why do all the lines in the converted PDF have the same thickness? ",
    "answer": "This is because your .ctb print style file was not mounted correctly when converting. You can look for the 'Plot styles' option in the cloud print settings, or solidify the print style into the drawing in Monochrome mode."
  },
  {
    "question": "Why do the line segments in multiple viewports overlap and become incomplete? ",
    "answer": "This is a layout space Viewport coordinate occlusion and cropping problem. It is recommended to change the viewport in CAD before printing Shade Plot Set to As Displayed) ."
  }
];

export default function OnlineDwgToPdfCloudPrinterClient() {
  return (
    <CloudReferralClient
      title="Online DWG to Vector PDF Batch Cloud Printer"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Converting DWG drawings to vector PDF without a local CAD seat often results in missing `.ctb` plot-style lineweights, unmapped SHX fonts, or clipped Paper Space viewports. Choosing an ODA- or Autodesk-backed plotting engine preserves crisp vector lineweights and searchable text."
      riskWarning="Native DWG files contain complete model-space coordinates, blocks, and layer structures. For confidential projects, plot PDFs locally using Autodesk's free desktop DWG TrueView utility rather than uploading source DWG files to unverified third-party cloud printers."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
