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
    "verdict": "Official free online picture viewing and publishing platform, fully reserved CTB, Layer attributes and primitive associations are the safest and most reliable. "
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
    "verdict": "The best choice for extremely fast conversion of ordinary drawings, supporting static plane export of mainstream layers. "
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
    "verdict": "An extremely fast viewing and conversion channel suitable for temporary use by individuals. It is not recommended for large enterprises to deploy sensitive services.. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Clean up junk entities locally",
    "desc": "Run in CAD before printing PURGE and -AUDIT command, Bind redundant scale lists and external references to reduce size. "
  },
  {
    "title": "Using Microsoft Print to PDF",
    "desc": "If no CAD restrictions are installed, PDF output using Microsoft Virtual Print Driver has the highest geometric fidelity. "
  },
  {
    "title": "Limit external link telemetry",
    "desc": "For sensitive files, choose a pure read-only local parsing solution that limits network access. "
  }
];
const FAQS = [
  {
    "question": "Why do all the lines in the converted PDF have the same thickness?? ",
    "answer": "This is because your .ctb print style file was not mounted correctly when converting. You can look for the 'Plot styles' option in the cloud print settings, Or solidify the print style into the drawing in Monochrome mode. "
  },
  {
    "question": "Why do the line segments in multiple viewports overlap and become incomplete? ",
    "answer": "This is a layout space Viewport coordinate occlusion and cropping problem. It is recommended to change the viewport in CAD before printing Shade Plot Set to As Displayed) . "
  }
];

export default function OnlineDwgToPdfCloudPrinterClient() {
  return (
    <CloudReferralClient
      title="Online DWG to Vector PDF Batch Cloud Printer"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Without AutoCAD installed, How to quickly convert DWG to high-fidelity PDF format for reporting? Universal conversion tools often result in CTB Printing line width is lost (the thickness of the entire image is the same) , Layout Tabs are not visible, and complex line style collapse. "
      riskWarning="DWG Files are the core carrier of enterprise digital assets. DWG When uploading to cloud printing, you must not only check the privacy agreement, Also avoid activating anti-piracy detection networks of alliances such as Autodesk. Never upload any files that have not been saved by an officially authorized client for cloud printing. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
