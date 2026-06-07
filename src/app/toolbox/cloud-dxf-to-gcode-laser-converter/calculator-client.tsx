'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "NC Viewer (Online G-Code Visualization and Simulator)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Simulation accuracy",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Ease of use",
        "score": 5
      }
    ],
    "pros": [
      "Pure front-end parses G-Code and renders it 3D Knife line trajectory",
      "Provide real-time 3D simulation tool animation"
    ],
    "cons": [
      "Only for simulation, not provided DXF Convert G-Code service"
    ],
    "officialUrl": "https://ncviewer.com/",
    "verdict": "Currently the best and most secure online tool path verification platform, It is recommended to perform a dry run simulation here before sending G-Code to the machine tool.. "
  },
  {
    "name": "Carbide Create (Lightweight tool path designer)",
    "rating": 9.3,
    "metrics": [
      {
        "name": "Tool path control",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Ease of use",
        "score": 4.5
      }
    ],
    "pros": [
      "The interface is simple and intuitive, and there is no risk of leakage when running locally.",
      "Supports specifying tool radius compensation and engraving depth"
    ],
    "cons": [
      "Advanced 3D engraving requires purchasing the Pro version"
    ],
    "officialUrl": "https://carbide3d.com/carbidecreate/",
    "verdict": "Great for makers and small DIY sculpting, Very safe to run locally, enabling fast changeovers for simple edge cuts. "
  },
  {
    "name": "jscut (Open source web toolpath compiler)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "local privacy",
        "score": 5
      },
      {
        "name": "path accuracy",
        "score": 4.5
      },
      {
        "name": "Configuration flexibility",
        "score": 4
      }
    ],
    "pros": [
      "100% Browser local computing, data is not uploaded to the server",
      "Supports SVG/DXF, and can finely set the cutting step distance and cutting amount"
    ],
    "cons": [
      "For first-time use, you need to be familiar with the concept of parameters and have a certain professional threshold."
    ],
    "officialUrl": "http://jscut.org/",
    "verdict": "The most secure online open source cutting compiler, does not rely on servers, It is the lightweight tool of choice for engineering and technical personnel. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Set up reasonable lead-in/out",
    "desc": "In order to prevent the laser from leaving burning pits at the starting point of the edge of the part, lead-in and lead-out arcs or diagonal lines should be configured, Position the starting point in the scrap area. "
  },
  {
    "title": "Arc converted to true G02/G03",
    "desc": "Check if the converter supports fitting polyline arcs to G2/G3 arc interpolation commands, This can significantly reduce the G-Code file size, Avoid machine vibration. "
  },
  {
    "title": "Safe Height Verification",
    "desc": "Be sure to set the safe height for rapid movement of G00 (Usually Z5-Z10) set larger than the fixture height, Eliminate the risk of lateral movement and knife collision. "
  }
];
const FAQS = [
  {
    "question": "Why can’t the converted G-code file be run on my engraving machine?? ",
    "answer": "This is usually due to the G-code format of the converter output (dialect) with your controller (Such as GRBL, Mach3, Syntec new generation) No match. Need to select the correct post-processor when converting (Post Processor). "
  },
  {
    "question": "How to solve the problem of converting arcs into polyline segments? ",
    "answer": "This is because the arcs in the original DXF drawing were forcibly broken up by the converter. (Explode) For tiny segments of straight lines. Make sure the CAD Save as an arc object in the converter, or enable arc interpolation optimization in the converter. "
  }
];

export default function CloudDxfToGcodeLaserConverterClient() {
  return (
    <CloudReferralClient
      title="Online DXF to CNC G-Code Path Planner"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="Engineering & Design Calculator"
      painPointDesc="In digital manufacturing and laser cutting, the 2D Convert vector DXF drawings to engraving machine, Readable by waterjet, plasma or laser cutters G-Code (Gcode) is the core link. The quality of cloud converters on the market varies, and unreasonable tool path calculations often lead to empty runs., Material burnt, tool impact or arc interpolation (G02/G03) Parsing error. "
      riskWarning="Converted DXF outlines often represent precision sheet metal, Commercial designs such as mechanical transmission parts. When uploaded to a free third-party online converter, The drawings will be parsed and stored by the cloud server, which may leak geometric intellectual property rights.. For high-confidential part drawings, it is highly recommended to use local offline CNC Programming software (such as Fusion 360, Vectric, Carbide Create) Or open source offline converter. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
