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
    "verdict": "It is recognized in the industry as one of the base programs with the strongest analytical power for three-dimensional geometric formats, and its grid fitting algorithm is extremely smooth. The normal line is flawless."
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
    "verdict": "Free based on Open Cascade core 3D Search and format conversion artifact, no risk of network upload, Security is top notch."
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
    "verdict": "Convenient online multi-format conversion platform, suitable for designers to quickly convert rendering formats of single non-confidential parts."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Fine Tuning Chord Height Tolerance (Chordal Deviation)",
    "desc": "When polygonizing, the chord height deviation limit determines the number of patches on the cylindrical surface. Usually setting 0.05-0.1mm can balance rendering smoothness and file size."
  },
  {
    "title": "Prefer compressed glTF (GLB) format",
    "desc": "Binary glTF (.glb) natively supports Physically Based Rendering (PBR) materials, scene hierarchies, and Draco mesh compression, making it far more compact than legacy OBJ+MTL files for WebGL, Three.js, and AR/VR applications."
  },
  {
    "title": "Off-network stand-alone CAD Assistant is discontinued",
    "desc": "The conversion of core commercial structural components requires completely disconnecting the external network and using CAD Assistant Purely local conversion."
  }
];
const FAQS = [
  {
    "question": "How do I fix split surface seams and detached faces after importing the converted OBJ into Blender?",
    "answer": "This occurs when adjacent NURBS patches in the source STEP file were tessellated independently without shared boundary vertices. In Blender Edit Mode, select all vertices and run 'Mesh -> Merge -> By Distance' (coupled with recalculating weighted normals) to weld the seams."
  },
  {
    "question": "How does choosing between STEP AP203 and STEP AP214 affect glTF/OBJ mesh conversion?",
    "answer": "STEP AP203 strips all surface color and layer appearance metadata, resulting in a uniform gray mesh. STEP AP214 (and AP242) preserves per-face RGB colors and assembly node names, which translate directly into glTF material slots."
  }
];

export default function OnlineStepToObjGltfConverterClient() {
  return (
    <CloudReferralClient
      title="Online STEP to glTF/OBJ Rendering Mesh Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="STEP (AP203/AP214/AP242) files store exact mathematical NURBS boundary representations (B-Rep) that cannot be rendered directly by WebGL engines (Three.js, Babylon.js) or DCC tools (Blender, Unity, Unreal). Converting STEP to glTF/GLB or OBJ requires controlled tessellation (chordal deflection and normal welding) to prevent cracked UV seams or excessive polygon counts."
      riskWarning="STEP models contain exact 3D manufacturing geometry. For confidential mechanical designs, tessellate STEP files to glTF/OBJ locally using Open Cascade CAD Assistant, FreeCAD, or Blender rather than uploading B-Rep data to public web converters."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
