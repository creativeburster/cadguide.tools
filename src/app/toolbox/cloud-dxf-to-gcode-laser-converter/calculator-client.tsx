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
      "Client-side browser G-Code parser with interactive 3D toolpath visualization",
      "Provide real-time 3D simulation tool animation"
    ],
    "cons": [
      "Backplot simulator only; does not generate G-Code from DXF"
    ],
    "officialUrl": "https://ncviewer.com/",
    "verdict": "Currently the best and most secure online tool path verification platform, it is recommended to perform a dry run simulation here before sending G-Code to the machine tool."
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
    "verdict": "Reliable desktop 2.5D CAM utility for CNC routers and laser cutters, running 100% locally with intuitive lead-in and tab controls."
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
    "verdict": "The most secure online open source cutting compiler, does not rely on servers, it is the lightweight tool of choice for engineering and technical personnel."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Set up reasonable lead-in/out",
    "desc": "To prevent laser pierce marks or plasma divots on finished part edges, configure tangential arc or linear lead-ins that initiate the pierce inside the scrap region."
  },
  {
    "title": "Arc converted to true G02/G03",
    "desc": "Ensure your CAM post-processor converts DXF arcs into native G02/G03 circular interpolation commands rather than thousands of tiny G01 segments that cause CNC chatter."
  },
  {
    "title": "Safe Height Verification",
    "desc": "Always verify that the G00 rapid retract clearance plane (e.g., Z10–Z25 mm) clears all workholding clamps and hold-down tabs."
  }
];
const FAQS = [
  {
    "question": "Why can’t the converted G-code file be run on my engraving machine? ",
    "answer": "This happens when the generated G-Code dialect does not match your CNC motion controller (e.g., GRBL, Mach3, Fanuc, or Syntec). Select the matching post-processor profile so modal headers and arc center formats (I/J vs. R) align."
  },
  {
    "question": "How to solve the problem of converting arcs into polyline segments? ",
    "answer": "This occurs when splines or arcs in the source DXF are discretized into short linear G01 segments. Convert splines to true polyline arcs (PEDIT) in CAD before exporting, or enable G02/G03 arc fitting in your CAM post-processor."
  }
];

export default function CloudDxfToGcodeLaserConverterClient() {
  return (
    <CloudReferralClient
      title="Online DXF to CNC G-Code Path Planner"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Engineering & Design Calculator"
      painPointDesc="Converting 2D DXF profiles into CNC G-Code for laser, plasma, waterjet, or router cutting requires clean loop chaining, kerf/cutter compensation (G41/G42), and accurate G02/G03 arc fitting to prevent machine stutter and pierce burn marks."
      riskWarning="Production DXF flat patterns contain exact sheet metal and machining dimensions. For proprietary parts, generate toolpaths locally using offline CAM software (such as Fusion, SheetCam, Vectric, or Carbide Create) rather than uploading geometry to public web servers."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
