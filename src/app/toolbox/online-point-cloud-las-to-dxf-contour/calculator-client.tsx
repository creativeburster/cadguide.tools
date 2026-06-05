'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Global Mapper (专业测绘与地形综合工作站)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "等高线生成精度",
        "score": 5
      },
      {
        "name": "大规模数据支持",
        "score": 5
      },
      {
        "name": "安全性",
        "score": 5
      }
    ],
    "pros": [
      "支持各类点云过滤算法",
      "等高线平滑与网格导出无暇"
    ],
    "cons": [
      "商业全功能版授权价格高"
    ],
    "officialUrl": "https://www.bluemarblegeo.com/",
    "verdict": "无可替代的地形和地理数据处理平台，对雷达高程数据重建三维地貌（Contours）的功能首屈一指。"
  },
  {
    "name": "Autodesk Civil 3D (官方路桥地形系统)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "等高线生成精度",
        "score": 4.5
      },
      {
        "name": "大规模数据支持",
        "score": 5
      },
      {
        "name": "安全性",
        "score": 4.5
      }
    ],
    "pros": [
      "与 AutoCAD 界面完全无缝一致",
      "支持在曲面中实时动态调整间距"
    ],
    "cons": [
      "运行硬件要求极高"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "欧特克在市政与地理工程方面的基石，对点云直接建构曲面并拟合等高线（TIN Surface）最专业。"
  },
  {
    "name": "LAStools (极速命令行点云预处理包)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "等高线生成精度",
        "score": 4.5
      },
      {
        "name": "大规模数据支持",
        "score": 4.5
      },
      {
        "name": "安全性",
        "score": 5
      }
    ],
    "pros": [
      "C++ 编写速度冠绝全球",
      "支持自动化脚本批量提取"
    ],
    "cons": [
      "纯命令行界面，非专业人员不易上手"
    ],
    "officialUrl": "https://rapidlasso.de/",
    "verdict": "享誉测绘界的点云数据流批处理神器，其 las2dem 和 las2shp 可以在秒级生成数亿点地形的等高线。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "执行点云分类过滤 (Classify)",
    "desc": "在拟合等高线前，必须运行地面点分类滤波算法（CSF），剔除植被、电线和建筑物点，仅保留 bare earth（裸土点）高程。"
  },
  {
    "title": "设置合理的等高线间距 (Interval)",
    "desc": "平坦地形设置 0.5 米或 1 米间距；山地可放宽到 5 米，防止生成的 DXF 线段过多导致 CAD 开图崩溃。"
  },
  {
    "title": "本地脱网数据沙箱隔离",
    "desc": "涉及地形勘测的大规模工程请在不插网线的独立沙箱电脑中处理。"
  }
];
const FAQS = [
  {
    "question": "为什么提取出来的等高线在 CAD 里呈“锯齿状”硬角？",
    "answer": "这是由于拟合网格的分辨率设置过低。建议在 Civil 3D 导出时，勾选“等高线平滑（Contour Smoothing）”，选择使用贝塞尔曲线对其进行光滑插值。"
  },
  {
    "question": "如何判定 LAS 文件中的坐标系是否正确？",
    "answer": "LAS 文件头中含有 WKT 格式的投影空间描述。可以使用全局测绘工具核对 EPSG 代码（如 CGCS2000 对齐 WGS84），防止导入 CAD 后产生数百公里的坐标漂移。"
  }
];

export default function OnlinePointCloudLasToDxfContourClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud LAS to DXF Terrain Contour Generator"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="File Parser & Converter"
      painPointDesc="测绘与路桥设计的一大痛点是：从激光雷达点云（LAS）或高程文本中手工拟合等高线图纸不仅耗时，而且极易出现局部曲面凹陷。云端 Contours 等高线提取器能快速计算数字高程模型（DEM），并直接为 Civil 3D 或 MicroStation 输出平滑的地形 DXF 矢量图纸。"
      riskWarning="高精度地理空间三维坐标和测绘点云数据直接关系国家物理信息安全，在上传至非认证的境外云服务商时需格外警惕合规风险。针对常规工民建项目，可采用局域网内离线软件提取，规避违反数据合规出境。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
