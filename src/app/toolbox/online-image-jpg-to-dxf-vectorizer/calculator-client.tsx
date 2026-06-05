'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Vectorizer.io (Professional-grade vectorized cloud service)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "Polyline fitting degree",
        "score": 5
      },
      {
        "name": "Bezier control",
        "score": 5
      },
      {
        "name": "Noise reduction processing power",
        "score": 4.5
      }
    ],
    "pros": [
      "Supports fully automatic curve smoothing interpolation",
      "Rich color layered export"
    ],
    "cons": [
      "The free quota is small, large files require a subscription"
    ],
    "officialUrl": "https://www.vectorizer.io/",
    "verdict": "Currently the most intelligent engine in the field of online image sketching, the fitted DXF Vector line segments are very smooth and rarely produce hard-angled broken lines.. "
  },
  {
    "name": "Autotrace (Classic open source image tracking suite)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Polyline fitting degree",
        "score": 4
      },
      {
        "name": "Bezier control",
        "score": 4
      },
      {
        "name": "Noise reduction processing power",
        "score": 5
      }
    ],
    "pros": [
      "100% Free and open source",
      "Support local command line batch operations"
    ],
    "cons": [
      "No visual advanced real-time fine-tuning panel"
    ],
    "officialUrl": "https://github.com/autotrace/autotrace",
    "verdict": "A well-established and powerful open source image tracing engine, very suitable for server-side batch processing and secondary programming development.. "
  },
  {
    "name": "WinTopo (Professional engineering grade image vectorization tool)",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Polyline fitting degree",
        "score": 4.5
      },
      {
        "name": "Bezier control",
        "score": 4
      },
      {
        "name": "Noise reduction processing power",
        "score": 4
      }
    ],
    "pros": [
      "Optimized for engineering geology and scanning mechanical drawings",
      "Supports one-click skeletonization (Skeletonization) "
    ],
    "cons": [
      "The interface is old, you need to download the desktop version"
    ],
    "officialUrl": "https://wintopo.com/",
    "verdict": "An evergreen tree in the field of vectorization of engineering drawings, which extracts scan line center lines (Skeleton line) algorithm is particularly accurate, CAD A must for cartographers. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Drawings are pre-processed with high contrast",
    "desc": "Before tracing, use it locally Photoshop Convert the image to grayscale and adjust the color levels to maximize the contrast between black and white., Eliminate redundant grayscale pixels. "
  },
  {
    "title": "Perform local noise reduction (De-speckle)",
    "desc": "Remove tiny noise spots (spots) on scanned drawings) , Otherwise, the tracing algorithm will generate tens of thousands of meaningless closed tiny polygons for these noise points. "
  },
  {
    "title": "Local non-network dedicated machine running WinTopo",
    "desc": "If the original scanned image contains geological surveying or equipment samples, please download a local offline program to complete the vectorization in a stand-alone physical isolation environment.. "
  }
];
const FAQS = [
  {
    "question": "Why do the converted lines have ghost images? ",
    "answer": "This may be because the tracing algorithm uses the 'contour mode' (Outline Mode) 'Draw lines on both sides of the thick line. For engineering drawings, 'Centerline Mode' should be selected (Centerline/Skeleton Mode) 'Extract the central axis skeleton. "
  },
  {
    "question": "What should I do if the converted lines are not accurate enough? ",
    "answer": "Image resolution (DPI) is the core determinant of tracing accuracy. If the original image only has a few hundred pixels, the conversion result will inevitably be severely distorted.. It is recommended to use a scanned blueprint of 300 DPI or above for tracing.. "
  }
];

export default function OnlineImageJpgToDxfVectorizerClient() {
  return (
    <CloudReferralClient
      title="Online Image Raster (JPG/PNG) to Vector DXF Tracer"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="File Parser & Converter"
      painPointDesc="Convert hand-drawn sketches, scanned blueprints or JPG/PNG Losslessly convert pixel images into images that can be stretched and edited in CAD DXF Vector lines (segments and arcs) , It is the key to digitizing drawings. Ordinary automatic tracing tools often produce tens of thousands of fine jagged short polylines., As a result, the software freezes directly after importing CAD.. This review has selected the top engines with Bezier curve fitting and edge sharpening algorithms. "
      riskWarning="Some scanned drawings come from old government files or old factory expansions of confidential companies. Uploading such sensitive images to unknown online vectorization websites can easily lead to confidentiality leakage risks.. Regular projects should use native Illustrator or Vectorization Independent stand-alone program for processing, eliminating hidden dangers in network transmission. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
