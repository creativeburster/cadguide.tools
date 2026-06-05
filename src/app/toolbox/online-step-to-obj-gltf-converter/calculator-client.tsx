'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CAD Exchanger (B-Rep Mesh Polygon Compiler)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Polygonization quality",
        "score": 5
      },
      {
        "name": "Grid Smoothness",
        "score": 5
      },
      {
        "name": "Texture normal fidelity",
        "score": 4.5
      }
    ],
    "pros": [
      "Perfect for sewing large assemblies",
      "Generate high-precision glTF format"
    ],
    "cons": [
      "The commercial desktop version is more expensive"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "It is recognized in the industry as one of the base programs with the strongest analytical power for three-dimensional geometric formats, and its grid fitting algorithm is extremely smooth., The normal line is flawless. "
  },
  {
    "name": "CAD Assistant (Official free offline conversion program)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "Polygonization quality",
        "score": 4.5
      },
      {
        "name": "Grid Smoothness",
        "score": 4.5
      },
      {
        "name": "Texture normal fidelity",
        "score": 5
      }
    ],
    "pros": [
      "OCCT Official bottom layer, completely free",
      "Supports drag and drop to open instantly, fully localized"
    ],
    "cons": [
      "There is no web version, you need to download it manually"
    ],
    "officialUrl": "https://www.opencascade.com/",
    "verdict": "Free based on Open Cascade core 3D Search and format conversion artifact, no risk of network upload, Security is top notch. "
  },
  {
    "name": "AnyConv STEP to OBJ",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Polygonization quality",
        "score": 4
      },
      {
        "name": "Grid Smoothness",
        "score": 3.5
      },
      {
        "name": "Texture normal fidelity",
        "score": 4
      }
    ],
    "pros": [
      "Browser registration-free one-click conversion",
      "Extremely fast processing speed"
    ],
    "cons": [
      "It is easy to lose the component tree for highly nested assemblies"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "Convenient online multi-format conversion platform, suitable for designers to quickly convert rendering formats of single non-confidential parts. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Fine Tuning Chord Height Tolerance (Chordal Deviation)",
    "desc": "When polygonizing, the chord height deviation limit determines the number of patches on the cylindrical surface.. Usually setting 0.05-0.1mm can balance rendering smoothness and file size.. "
  },
  {
    "title": "Prefer compressed glTF (GLB) format",
    "desc": "glTF The format supports Physically Rendered Materials (PBR) and is much smaller than OBJ, is WebWebGL and VR The best choice for development. "
  },
  {
    "title": "Off-network stand-alone CAD Assistant is discontinued",
    "desc": "The conversion of core commercial structural components requires completely disconnecting the external network and using CAD Assistant Purely local conversion. "
  }
];
const FAQS = [
  {
    "question": "The converted OBJ is in Blender What to do if there are a lot of broken seams inside? ",
    "answer": "This may be due to the fact that the surface patch topology was not completely stitched when the original STEP was exported. (Sewing) . It is recommended to select all vertices in Blender, Do 'merge by distance' (Merge by Distance) 'Command to stitch."
  },
  {
    "question": "STEP The AP203 and AP214 What impact does meshing have? ",
    "answer": "AP203 No color information is included. After gridding, the entire image appears uniformly gray and white.; AP214 Part colors and structural levels are completely retained, and it is recommended to use it first. AP214 Make the conversion."
  }
];

export default function OnlineStepToObjGltfConverterClient() {
  return (
    <CloudReferralClient
      title="Online STEP to glTF/OBJ Rendering Mesh Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="The Industrial STEP (AP203/AP214) format is a boundary representation based on highly mathematical logic (B-Rep) stored, whose surface is in WebGL Web version (such as Three.js, Babylon.js) or a 3D renderer such as Unity, Blender) cannot be parsed directly in rendering. It must be polygonized (Polygonization) in triangular mesh format (e.g. OBJ, glTF) . During reorganization, common pain points are cracking of patch seams and excessive mesh density causing stuck web pages.. "
      riskWarning="Industrial-grade STEP 3D models involve extremely strict product confidentiality design and geometric topology. When converting STEP to rendering format using an online website, It is extremely easy to be intercepted by the cloud backend and leak core secrets. Targeting top secret components, Please use CAD Assistant locally to run the offline conversion. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
