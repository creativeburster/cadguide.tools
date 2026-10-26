'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Global Mapper (Professional surveying and topography comprehensive workstation)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Contour generation accuracy",
        "score": 5
      },
      {
        "name": "Large-scale data support",
        "score": 5
      },
      {
        "name": "security",
        "score": 5
      }
    ],
    "pros": [
      "Supports various point cloud filtering algorithms",
      "Contour smoothing and mesh export flawless"
    ],
    "cons": [
      "Commercial full-featured version license price is high"
    ],
    "officialUrl": "https://www.bluemarblegeo.com/global-mapper/",
    "verdict": "Irreplaceable terrain and geographical data processing platform, reconstructing three-dimensional landforms from radar elevation data (Contours) The functionality is second to none."
  },
  {
    "name": "Autodesk Civil 3D (Official road and bridge terrain system)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "Contour generation accuracy",
        "score": 4.5
      },
      {
        "name": "Large-scale data support",
        "score": 5
      },
      {
        "name": "security",
        "score": 4.5
      }
    ],
    "pros": [
      "Fully seamless alignment with the AutoCAD interface",
      "Supports real-time dynamic adjustment of spacing on the surface"
    ],
    "cons": [
      "The hardware requirements for running are extremely high"
    ],
    "officialUrl": "https://www.autodesk.com/products/recap-pro/overview",
    "verdict": "Autodesk's cornerstone in municipal and geographical engineering, directly constructing surfaces and fitting contours to point clouds (TIN Surface) The most professional."
  },
  {
    "name": "LAStools (Extremely fast command line point cloud preprocessing package)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Contour generation accuracy",
        "score": 4.5
      },
      {
        "name": "Large-scale data support",
        "score": 4.5
      },
      {
        "name": "security",
        "score": 5
      }
    ],
    "pros": [
      "C++ The writing speed is the best in the world",
      "Support automated script batch extraction"
    ],
    "cons": [
      "Pure command line interface, difficult for non-professionals to use"
    ],
    "officialUrl": "https://rapidlasso.de/lastools/",
    "verdict": "A well-known point cloud data stream batch processing artifact in the surveying and mapping industry. las2dem and las2shp can generate hundreds of millions of terrain contours in seconds."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform point cloud classification filtering (Classify)",
    "desc": "Before fitting contours, the ground point classification filtering algorithm must be run (CSF) , Cull vegetation, power lines and building points, Keep only bare earth points) Elevation."
  },
  {
    "title": "Set a reasonable contour interval",
    "desc": "Flat terrain setting 0.5m or 1 meter spacing; in mountainous areas it can be relaxed to 5 meters, to prevent the generation of DXF Too many line segments cause CAD drawing to crash."
  },
  {
    "title": "Local off-network data sandbox isolation",
    "desc": "Large-scale projects involving terrain survey should be handled on an independent sandbox computer without network cables plugged in."
  }
];
const FAQS = [
  {
    "question": "Why do extracted contour lines appear jagged with sharp vertices in CAD?",
    "answer": "This occurs when contours are extracted directly from a coarse TIN or DEM grid without spline smoothing. In Civil 3D or Global Mapper, enable 'Contour Smoothing' (Bezier or B-Spline vertex interpolation) prior to exporting the DXF."
  },
  {
    "question": "How to determine whether the coordinate system in a LAS file is correct? ",
    "answer": "LAS The file header contains a projection space description in WKT format. EPSG codes can be checked using global mapping tools (Such as CGCS2000 alignment WGS84) , Prevent coordinate drift of hundreds of kilometers after importing CAD."
  }
];

export default function OnlinePointCloudLasToDxfContourClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud LAS to DXF Terrain Contour Generator"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="File Parser & Converter"
      painPointDesc="Generating smooth topographic DXF contour polylines from raw LiDAR point clouds (`.las` / `.laz`) requires bare-earth ground classification (filtering out vegetation and buildings), TIN/DEM surface triangulation, and B-spline vertex smoothing so resulting CAD files do not overwhelm Civil 3D or AutoCAD."
      riskWarning="Georeferenced LiDAR point clouds and topographic surveys are subject to strict geospatial data regulations and client confidentiality agreements. Always process sensitive survey data locally using desktop GIS/CAD workstations (such as Global Mapper, Civil 3D, QGIS, or LAStools)."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
