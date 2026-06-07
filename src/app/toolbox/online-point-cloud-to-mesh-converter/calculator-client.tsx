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
    "verdict": "Recognized as the cornerstone of top point cloud processing by the global academic and engineering circles, its grid reconstruction (Poisson Reconstruction) Highest fidelity. "
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
    "verdict": "The classic open source 3D mesh processing center performs smooth processing on the converted triangular network., Surface reduction optimization is its core advantage. "
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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "The mapping point cloud processing tool under the Autodesk ecosystem supports batch conversion of photos and scanned point clouds and CAD Use it as a reference in the software. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform local hierarchical sparsification (Decimation)",
    "desc": "Before meshing, align the point cloud with a specified spatial step size (Such as 10mm) perform mean sampling sparseness, Eliminate 90% of duplicate spatial points, Just keep the key contours. "
  },
  {
    "title": "Poisson Reconstruct",
    "desc": "Octree Depth in reconstruction parameters) Determines the reconstruction accuracy. It is recommended to set 8-10 If the size is too large, it will easily consume all the video memory.. "
  },
  {
    "title": "Use isolated physical workstations",
    "desc": "National-level geographic surveying and mapping data are strictly prohibited from accessing the Internet, and dedicated planes and dedicated lines must be used for local offline calculations.. "
  }
];
const FAQS = [
  {
    "question": "Why do the converted mesh models have a lot of holes and flying lines? ",
    "answer": "This means that there are shadow dead spots in the point cloud during scanning. It needs to be MeshLab Execute 'Closed Hole' in (Close Holes)'and 'Clean orphaned primitives' (Remove Isolated Pieces)'Wait for the mesh patch command. "
  },
  {
    "question": "LAS How is the data different from the PTS format?? ",
    "answer": "LAS It is a binary mapping format developed by the American Society for Photogrammetry and Remote Sensing, which retains the laser reflection intensity., GPS Metadata such as time; PTS/XYZ is a plain text coordinate format, Reading is relatively slow. "
  }
];

export default function OnlinePointCloudToMeshConverterClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud (LAS/PTS) to Watertight Mesh Converter"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Billions of point cloud coordinate data (LAS/PTS/XYZ) obtained by lidar scanning, if directly loaded into ordinary modeling software, It is easy to cause the running memory to burst directly. Therefore, We need to use cloud algorithms to reduce noise and streamline point clouds, And reconstructed into a closed geometric mesh (Watertight Mesh, such as OBJ, DXF, STL) . "
      riskWarning="Surveying and 3D scanning data (such as topographic maps, Digital scanning of historical buildings, sensitive defense factories, etc.) It is highly restricted data. Please ensure that the cloud platform you upload complies with the national data export compliance standards., For high-density projects, please use the open source CloudCompare on the local LAN cluster for processing.. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
