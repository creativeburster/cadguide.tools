'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CloudCompare (Open source local/cloud processing tool)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Reorganization accuracy",
        "score": 5
      },
      {
        "name": "data throughput",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Completely open source and free",
      "Top denoising and grid Poisson reconstruction algorithms"
    ],
    "cons": [
      "The interface is a bit outdated and there is a certain learning threshold."
    ],
    "officialUrl": "https://www.danielgm.net/cc/",
    "verdict": "Recognized as the cornerstone of top point cloud processing by the global academic and engineering circles, its grid reconstruction (Poisson Reconstruction) Highest fidelity."
  },
  {
    "name": "MeshLab (Professional mesh triangulation workbench)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Reorganization accuracy",
        "score": 4.5
      },
      {
        "name": "data throughput",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Supports large-scale mesh editing and repair",
      "Rich texture mapping algorithm"
    ],
    "cons": [
      "It is easy to crash when processing extremely large point clouds of tens of G."
    ],
    "officialUrl": "https://www.meshlab.net/",
    "verdict": "The classic open source 3D mesh processing center performs smooth processing on the converted triangular network. Surface reduction optimization is its core advantage."
  },
  {
    "name": "Autodesk ReCap Pro Cloud Services",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Reorganization accuracy",
        "score": 4
      },
      {
        "name": "data throughput",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Perfectly seamless alignment of Civil 3D with Revit",
      "Cloud automated cluster rendering"
    ],
    "cons": [
      "Requires premium subscription package, average price/performance ratio"
    ],
    "officialUrl": "https://www.autodesk.com/products/recap-pro/overview",
    "verdict": "The mapping point cloud processing tool under the Autodesk ecosystem supports batch conversion of photos and scanned point clouds and CAD Use it as a reference in the software."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform local hierarchical sparsification (Decimation)",
    "desc": "Before meshing, align the point cloud with a specified spatial step size (Such as 10mm) perform mean sampling sparseness, Eliminate 90% of duplicate spatial points, just keep the key contours."
  },
  {
    "title": "Poisson Reconstruct",
    "desc": "Octree Depth in reconstruction parameters) Determines the reconstruction accuracy. It is recommended to set 8-10 If the size is too large, it will easily consume all the video memory."
  },
  {
    "title": "Use isolated physical workstations",
    "desc": "National-level geographic surveying and mapping data are strictly prohibited from accessing the Internet, and dedicated planes and dedicated lines must be used for local offline calculations."
  }
];
const FAQS = [
  {
    "question": "Why do the converted mesh models have a lot of holes and flying lines? ",
    "answer": "This indicates occlusion gaps or noisy outlier points in the raw LiDAR scan. In MeshLab or CloudCompare, run 'Remove Isolated Pieces' to strip floating noise followed by 'Close Holes' or screened Poisson surface reconstruction to generate a watertight mesh."
  },
  {
    "question": "LAS How is the data different from the PTS format? ",
    "answer": "LAS It is a binary mapping format developed by the American Society for Photogrammetry and Remote Sensing, which retains the laser reflection intensity. GPS Metadata such as time; PTS/XYZ is a plain text coordinate format, Reading is relatively slow."
  }
];

export default function OnlinePointCloudToMeshConverterClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud (LAS/PTS) to Watertight Mesh Converter"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Raw 3D laser scans (`.las`, `.pts`, `.e57`, `.xyz`) contain tens of millions of unstructured points that cannot be directly boolean-modeled in standard CAD packages. Converting point clouds into watertight polygon meshes (`.stl`, `.obj`, `.ply`) requires outlier removal, normal estimation, and Screened Poisson or Ball-Pivoting surface reconstruction."
      riskWarning="3D scan datasets of industrial plants, reverse-engineered mechanical parts, and civil infrastructure are highly confidential. Process point cloud meshing locally using open-source tools like CloudCompare and MeshLab on dedicated workstations rather than public cloud uploaders."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
