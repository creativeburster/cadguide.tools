'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "SketchUp Pro Native Export (Official native desktop export)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "UV Texture Mapping",
        "score": 5
      },
      {
        "name": "Assembly level",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Official native underlying texture unpacking",
      "Perfect preservation of double-sided textures (Double-sided) "
    ],
    "cons": [
      "Commercial desktop license required"
    ],
    "officialUrl": "https://www.sketchup.com/",
    "verdict": "The most perfect FBX export solution. Precisely control the packaged output of axis, camera and material maps through the built-in export configuration panel."
  },
  {
    "name": "SimLab SKP to FBX Plugin (Professional rendering bridge plug-in)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "UVTexture mapping",
        "score": 5
      },
      {
        "name": "Assembly level",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Optimized polygon structure for Unreal Engine",
      "Support retaining PBR material nodes"
    ],
    "cons": [
      "It needs to be installed as a plug-in and the commercial version is charged"
    ],
    "officialUrl": "https://www.simlab-soft.com/",
    "verdict": "The most recommended conversion plug-in by Dassault and the stage design renderings design team, it maps material textures (UV coordinates) The alignment quality is top notch."
  },
  {
    "name": "AnyConv SKP to FBX",
    "rating": 9,
    "metrics": [
      {
        "name": "UVTexture mapping",
        "score": 3.5
      },
      {
        "name": "Assembly level",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Drag and drop to transfer without logging in",
      "Extremely fast processing speed"
    ],
    "cons": [
      "The texture may appear white and missing during large-scale scene transitions"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "It is suitable for designers to perform temporary format conversion of a single lightweight 3D group on business trips or non-work computers."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Clean up redundant materials and components",
    "desc": "Before exporting, open Window -> Model Info -> Statistics in SketchUp and click 'Purge Unused' to strip orphaned component definitions and unused texture maps, reducing FBX file size by up to 50%."
  },
  {
    "title": "Check the front and back material maps",
    "desc": "SketchUp Supports mapping on the back face of objects, but FBX only renders the front side by default. Reverse Faces to front before exporting, Prevent the texture from disappearing and turning black after importing the renderer."
  },
  {
    "title": "Off-network stand-alone native export",
    "desc": "FBX conversion for enterprise large-scale project scenarios must be entirely on-premises SketchUp Client operates offline."
  }
];
const FAQS = [
  {
    "question": "Why is my converted FBX model scaled incorrectly by 100x or 25.4x when imported into Unity or Unreal Engine?",
    "answer": "SketchUp internally stores coordinates in inches regardless of display units. When exporting to FBX, open the Export Options dialog and explicitly set the export units to 'Centimeters' (for Unreal/Unity) or 'Meters' rather than 'Model Units'."
  },
  {
    "question": "Why are the exported model tree component names all in pinyin or special garbled characters? ",
    "answer": "Legacy FBX SDK parsers have limited support for non-ASCII Unicode characters in node hierarchies. Rename SketchUp Components, Groups, and Material names to standard ASCII alphanumeric characters before exporting."
  }
];

export default function OnlineSkpToFbxCloudConverterClient() {
  return (
    <CloudReferralClient
      title="Online SketchUp SKP to FBX Render Mesh Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Transferring architectural SketchUp (`.skp`) models into real-time rendering engines (Unreal Engine, Unity, Twinmotion, or 3ds Max) via FBX requires consistent front-face normal orientation, embedded UV texture maps, and clean component hierarchy preservation."
      riskWarning="Architectural SketchUp (SKP) models often contain confidential interior layouts and proprietary design assets. For commercial projects, always export FBX files locally using SketchUp Pro's built-in 'Export -> 3D Model' engine rather than uploading scenes to third-party web converters."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
