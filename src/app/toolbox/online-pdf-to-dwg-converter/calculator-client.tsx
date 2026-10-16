'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AnyDWG PDF to DWG Converter",
    "rating": 9.8,
    "metrics": [
      {
        "name": "Geometric accuracy",
        "score": 5
      },
      {
        "name": "Text restoration degree",
        "score": 4
      },
      {
        "name": "Layer retention",
        "score": 4
      }
    ],
    "pros": [
      "Vector curve topology restoration is excellent",
      "Supports quick alignment of batch drawings"
    ],
    "cons": [
      "The gradient fill of large drawings is occasionally missing"
    ],
    "officialUrl": "https://anydwg.com/pdf-to-dwg.html",
    "verdict": "AnyDWG Decades of experience in basic CAD development, its native engine is restoring CAD dotted lines, the algorithm is most stable when using center lines and labels."
  },
  {
    "name": "CADSoftTools PDF to DWG",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Geometric accuracy",
        "score": 4
      },
      {
        "name": "Text restoration degree",
        "score": 5
      },
      {
        "name": "Layer retention",
        "score": 3
      }
    ],
    "pros": [
      "Support Chinese font OCR remapping",
      "Provide free online quick preview"
    ],
    "cons": [
      "Occasional coordinate deviation from paper space to model space"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "Long-established industrial CAD component supplier, Industry-leading recognition accuracy for text within PDFs."
  },
  {
    "name": "CloudConvert PDF to DWG",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Geometric accuracy",
        "score": 4
      },
      {
        "name": "Text restoration degree",
        "score": 3
      },
      {
        "name": "Layer retention",
        "score": 4
      }
    ],
    "pros": [
      "All-environment queues are extremely fast",
      "Support API automated scheduling"
    ],
    "cons": [
      "Limited parsing of highly customized fonts"
    ],
    "officialUrl": "https://cloudconvert.com/",
    "verdict": "The most well-known universal file format conversion platform, suitable for rapid circulation of ordinary sketches that do not require high conversion details."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Prioritize the elimination of sensitive attributes of drawings",
    "desc": "Use PDF compression or erasure tools to remove authors before conversion, Unnecessary metadata tags such as drawing approval stamps."
  },
  {
    "title": "Local SCALE scaling alignment",
    "desc": "The converted DWG is scaled to the drawing size, please select all elements in CAD, Use SCALE to refer to known annotations (Such as 900mm door width) Reset the one-to-one ratio."
  },
  {
    "title": "Networkless local substitution strategy",
    "desc": "Large enterprises may consider deploying a local version of PDFIMPORT, or setting policies for proxy servers for external access. Prevent data reporting."
  }
];
const FAQS = [
  {
    "question": "Why are the converted lines all broken and scattered segments?",
    "answer": "This occurs when arcs or splines are discretized into discrete line segments during PDF export. You can use the PEDIT -> Join command in CAD to rejoin coincident line segments."
  },
  {
    "question": "What should I do if the converted characters display as question marks or garbled text?",
    "answer": "This happens when your system is missing the embedded PDF TrueType (TTF) font or the corresponding SHX Big Font. We recommend configuring a font substitution in your CAD Text Style Manager to gbcbig.shx or bigfont.shx."
  }
];

export default function OnlinePdfToDwgConverterClient() {
  return (
    <CloudReferralClient
      title="Online Vector PDF to CAD DWG Converter Portal"
      subtitle="Direct navigation to objective in-depth evaluation and technical guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Restore vector or scanned PDF drawings to the CAD DWG/DXF geometric entities edited in, often faced with technical problems such as curve fitting distortion, SHX/TTF fonts broken into fragmented lines, and default scale drift. This review has selected three professional engines with the highest accuracy and best layer preservation in the industry."
      riskWarning="PDF Drawings contain a large number of corporate core construction and mechanical assembly secrets. Commercial cloud converters may record and retain your drawings. In order to prevent copyright compliance audits and commercial privacy leaks, high-density drawings, Be sure to use native AutoCAD PDFIMPORT The command is used for local analysis without network. Do not upload to unknown source websites."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
