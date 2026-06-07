'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "SketchUp Pro Native Export (Official native desktop export)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "UVTexture mapping",
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
    "verdict": "The most perfect FBX export solution. Precisely control the packaged output of axis, camera and material maps through the built-in export configuration panel. "
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
    "verdict": "The most recommended conversion plug-in by Dassault and the stage design renderings design team, it maps material textures (UV coordinates) The alignment quality is top notch. "
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
    "verdict": "It is suitable for designers to perform temporary format conversion of a single lightweight 3D group on business trips or non-work computers. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Clean up redundant materials and components",
    "desc": "Before exporting, in SketchUp Window ➔ Model Information ➔ Click 'Clear Unused Items' in Statistics (Purge Unused)', Can reduce the size of FBX by more than 50%. "
  },
  {
    "title": "Check the front and back material maps",
    "desc": "SketchUp Supports mapping on the back face of objects, But FBX only renders the front side by default. Reverse Faces to front before exporting, Prevent the texture from disappearing and turning black after importing the renderer. "
  },
  {
    "title": "Off-network stand-alone native export",
    "desc": "FBX conversion for enterprise large-scale project scenarios must be entirely on-premises SketchUp Client operates offline. "
  }
];
const FAQS = [
  {
    "question": "Converted FBX import Unity Why is the overall image scale reduced by 100 times?? ",
    "answer": "This is because SketchUp defaults to'Inches' as the underlying system unit. When exporting FBX, In Options the units must be forced to be'Meters' or'Millimeters'. "
  },
  {
    "question": "Why are the exported model tree component names all in pinyin or special garbled characters? ",
    "answer": "FBX The format has limited support for Unicode Chinese characters in older versions of the driver.. It is recommended that before exporting, SketchUp 'component in (Components) 'and 'group (Groups) 'Replace all names with English or Pinyin. "
  }
];

export default function OnlineSkpToFbxCloudConverterClient() {
  return (
    <CloudReferralClient
      title="Online SketchUp SKP to FBX Render Mesh Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Import architectural or landscape models designed in SketchUp (SKP) into high-end renderers (Such as Twinmotion, Lumion, Unreal Engine), Directly importing SKP often results in UV The texture coordinates are seriously misaligned, the material refraction parameters are lost, and complex nested components are broken up and collapsed.. Converted with high-fidelity texture packs (Textures) FBX Grid is the industry standard solution. "
      riskWarning="Architectural Design and Rendering Scenarios (SKP) contain corporate design secrets and client layout information. Commercial cloud conversion tools may save and leak these design details. To prevent business risks, It is recommended to give priority to using the SketchUp Pro desktop version that comes with it.'Export 3D model'Function, completely exported locally and on a single machine. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
