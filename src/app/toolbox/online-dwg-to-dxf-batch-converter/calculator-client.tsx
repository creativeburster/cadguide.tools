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
      "Requires desktop installation; GUI is utilitarian"
    ],
    "officialUrl": "https://www.opendesign.com/guestfiles/oda_file_converter",
    "verdict": "The industry standard offline batch converter maintained by the Open Design Alliance—translates folders of DWG and DXF files across R12 to 2018+ schemas with clean entity dictionaries."
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
    "verdict": "Proven standalone Windows batch converter capable of queuing thousands of DWG/DXF files without requiring an AutoCAD installation."
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
    "verdict": "The famous universal format conversion cloud service, when converting lightweight 2D engineering drawings, the drawing efficiency is extremely fast."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Prefer ASCII DXF format",
    "desc": "If the conversion is for later Python script analysis or text extraction, please specify in the conversion configuration that the output is ASCII encoded DXF."
  },
  {
    "title": "Local AutoLISP batch processing",
    "desc": 'Scripts can be loaded directly into CAD: Enter `(foreach dwg (list ...) (command "_SAVEAS" "DXF" ...))` at the command line to run a fully automatic local downgrade conversion.'
  },
  {
    "title": "Limit external network script postback",
    "desc": "Validate exported DXF files in a local CNC/CAM backplotter before sending to production to verify polyline closure and unit scaling."
  }
];
const FAQS = [
  {
    "question": "What is the difference between ASCII DXF and Binary DXF formats?",
    "answer": "ASCII DXF stores group codes and coordinates as human-readable plain text (ideal for Python/ezdxf scripting and CNC post-processors), whereas Binary DXF uses compact byte encoding that reduces file size by ~25% and loads faster but cannot be inspected in a text editor."
  },
  {
    "question": "Why can’t dynamic blocks in drawings be edited after mutual conversion? ",
    "answer": "Dynamic Block actions and grips rely on proprietary AutoCAD ObjectARX evaluation graphs. Exporting to legacy DXF schemas (such as R12) converts dynamic blocks into static anonymous blocks (`*U`)."
  }
];

export default function OnlineDwgToDxfBatchConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bulk DWG / DXF Format Mutual Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Because DWG is a closed binary database, CNC laser/plasma CAM software, GIS platforms, and Python scripts (`ezdxf`) require open ASCII or Binary DXF files. Batch converting DWG to DXF must preserve polyline closure, spline tessellation tolerances, and text encoding."
      riskWarning="Batch converting entire project folders in the cloud exposes large volumes of proprietary drawings at once. For confidential production libraries, always run the free desktop ODA File Converter or an AutoCAD ScriptPro batch job locally."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
