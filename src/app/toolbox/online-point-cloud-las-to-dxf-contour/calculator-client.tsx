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
    "officialUrl": "https://www.bluemarblegeo.com/",
    "verdict": "Irreplaceable terrain and geographical data processing platform, reconstructing three-dimensional landforms from radar elevation data (Contours) The functionality is second to none. "
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
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "Autodesk's cornerstone in municipal and geographical engineering, directly constructing surfaces and fitting contours to point clouds (TIN Surface) The most professional. "
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
    "officialUrl": "https://rapidlasso.de/",
    "verdict": "A well-known point cloud data stream batch processing artifact in the surveying and mapping industry. las2dem and las2shp can generate hundreds of millions of terrain contours in seconds. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Perform point cloud classification filtering (Classify)",
    "desc": "Before fitting contours, the ground point classification filtering algorithm must be run (CSF) , Cull vegetation, power lines and building points, Keep only bare earth points) Elevation. "
  },
  {
    "title": "Set a reasonable contour interval (Interval)",
    "desc": "Flat terrain setting 0.5m or 1 meter spacing; in mountainous areas it can be relaxed to 5 meters, to prevent the generation of DXF Too many line segments cause CAD drawing to crash. "
  },
  {
    "title": "Local off-network data sandbox isolation",
    "desc": "Large-scale projects involving terrain survey should be handled on an independent sandbox computer without network cables plugged in. "
  }
];
const FAQS = [
  {
    "question": "Why do the extracted contours appear in CAD?'jagged 'hard angle'? ",
    "answer": "This is due to the resolution of the fitting grid being set too low. It is recommended to Civil 3D When exporting, check'Contour Smoothing ', choose to use Bezier curves for smooth interpolation. "
  },
  {
    "question": "How to determine whether the coordinate system in a LAS file is correct? ",
    "answer": "LAS The file header contains a projection space description in WKT format.. EPSG codes can be checked using global mapping tools (Such as CGCS2000 alignment WGS84) , Prevent coordinate drift of hundreds of kilometers after importing CAD. "
  }
];

export default function OnlinePointCloudLasToDxfContourClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud LAS to DXF Terrain Contour Generator"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="A major pain point in surveying and mapping and road and bridge design is: from lidar point cloud (LAS) Manually fitting contour drawings or elevation texts is not only time-consuming, but also prone to local surface depressions.. Cloud Contours contour extractor quickly calculates digital elevation models (DEM) , and directly for Civil 3D or MicroStation Export smooth terrain DXF vector drawings. "
      riskWarning="High-precision geospatial three-dimensional coordinates and surveying point cloud data are directly related to national physical information security. You need to be extra vigilant about compliance risks when uploading to non-certified overseas cloud service providers.. For conventional industrial and civil construction projects, offline software in the local area network can be used to extract, Avoid violating data compliance by leaving the country. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
