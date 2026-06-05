'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "ODA File Converter (Official data conversion program)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Conversion accuracy",
        "score": 5
      },
      {
        "name": "Batch throughput",
        "score": 5
      },
      {
        "name": "security",
        "score": 5
      }
    ],
    "pros": [
      "Purely local offline execution",
      "Completely open source, free and cross-platform"
    ],
    "cons": [
      "The client needs to be downloaded and the command line parameters need to be configured."
    ],
    "officialUrl": "https://www.opendesign.com/",
    "verdict": "The industry's most rigorous drawing format interchange cornerstone, DWG / DXF The conversion result data of each major version is the purest, without any redundant junk dictionary. "
  },
  {
    "name": "Any DWG DXF Converter",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Conversion accuracy",
        "score": 4.5
      },
      {
        "name": "Batch throughput",
        "score": 5
      },
      {
        "name": "security",
        "score": 4.5
      }
    ],
    "pros": [
      "Standalone Windows applets",
      "Drag and drop supports thousands of files queued"
    ],
    "cons": [
      "The software interface is old, and the commercial version requires payment"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "A well-established conversion gadget that supports two-way one-click conversion, Speed and batch performance have been tested by engineering and are stable and efficient.. "
  },
  {
    "name": "Convertio (Universal Cloud Converter)",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Conversion accuracy",
        "score": 4
      },
      {
        "name": "Batch throughput",
        "score": 4
      },
      {
        "name": "security",
        "score": 3
      }
    ],
    "pros": [
      "No need to download, just run the browser with one click",
      "Support batch concurrent tasks"
    ],
    "cons": [
      "Free version file size is limited"
    ],
    "officialUrl": "https://convertio.co/",
    "verdict": "The famous universal format conversion cloud service, when converting lightweight 2D engineering drawings, The drawing efficiency is extremely fast. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Prefer ASCII DXF format",
    "desc": "If the conversion is for later Python script analysis or text extraction, Please specify in the conversion configuration that the output is ASCII encoded DXF. "
  },
  {
    "title": "Local AutoLISP batch processing",
    "desc": 'Scripts can be loaded directly into CAD: Enter `(foreach dwg (list ...) (command "_SAVEAS" "DXF" ...))` at the command line to run a fully automatic local downgrade conversion. '
  },
  {
    "title": "Limit external network script postback",
    "desc": "Use a corporate firewall with anti-telemetry configuration to block unnecessary ports, Prevent compliance detection. "
  }
];
const FAQS = [
  {
    "question": "DXF Binary and text (ASCII) What is the difference between formats? ",
    "answer": "ASCII The format is a plain text file, although it is large in size, However, Notepad can be used to read and modify data directly; the Binary format is compressed, Small file size, faster reading and loading speed, But it cannot be edited directly in text mode. "
  },
  {
    "question": "Why can’t dynamic blocks in drawings be edited after mutual conversion?? ",
    "answer": "Some dynamic block information belongs to AutoCAD-specific high-level classes (ArRx) . When converting to DXF, If the version is too low, the database will degrade them, As a result, the slider and other stretch handles will be lost after re-importing. "
  }
];

export default function OnlineDwgToDxfBatchConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bulk DWG / DXF Format Mutual Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="For non-AutoCAD drawing systems that need to be imported, For users of laser cutting software or custom script reading, DWG, a closed-source binary database, is very difficult to extract directly.. Batch and secure conversion to the open ASCII/Binary DXF format is a universal bridge to solve industry interconnections. However, during conversion, text encoding damage and line style failure are very frequent.. "
      riskWarning="Batch conversion represents the centralized processing of drawing assets, and it is very easy to be intercepted by external crawling tools in server logs when packaging and uploading.. For drawing clusters involving sensitive trade secrets, online public cloud conversion should be circumvented entirely, It is recommended to automatically call it locally by writing a local AutoLISP script command. ODA File converter."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
