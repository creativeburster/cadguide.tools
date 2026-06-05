'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Vectorizer.io (专业级矢量化云服务)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "折线拟合度",
        "score": 5
      },
      {
        "name": "贝塞尔控制",
        "score": 5
      },
      {
        "name": "降噪处理力",
        "score": 4.5
      }
    ],
    "pros": [
      "支持全自动曲线平滑插值",
      "丰富的色彩分层导出"
    ],
    "cons": [
      "免费额度较少，大文件需要订阅"
    ],
    "officialUrl": "https://www.vectorizer.io/",
    "verdict": "目前在线像素描摹领域中最智能的引擎，拟合出的 DXF 矢量线段非常光滑，极少产生硬角碎线。"
  },
  {
    "name": "Autotrace (经典开源图像跟踪套件)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "折线拟合度",
        "score": 4
      },
      {
        "name": "贝塞尔控制",
        "score": 4
      },
      {
        "name": "降噪处理力",
        "score": 5
      }
    ],
    "pros": [
      "100% 免费开源",
      "支持本地命令行批量操作"
    ],
    "cons": [
      "无可视化高级实时微调面板"
    ],
    "officialUrl": "https://github.com/autotrace/autotrace",
    "verdict": "老牌且实力雄厚的开源图像描摹引擎，非常适合用于服务器端批处理及编程二次开发开发。"
  },
  {
    "name": "WinTopo (专业工程级图像矢量化工具)",
    "rating": 9.2,
    "metrics": [
      {
        "name": "折线拟合度",
        "score": 4.5
      },
      {
        "name": "贝塞尔控制",
        "score": 4
      },
      {
        "name": "降噪处理力",
        "score": 4
      }
    ],
    "pros": [
      "专为工程地质和扫描机械图纸优化",
      "支持一键骨架化（Skeletonization）"
    ],
    "cons": [
      "界面偏老，需要下载桌面端"
    ],
    "officialUrl": "https://wintopo.com/",
    "verdict": "工程图纸矢量化领域的常青树，其提取扫描线条中心线（骨架线）的算法特别精准，CAD 制图人员必备。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "图纸预先高对比度处理",
    "desc": "在描摹前，先在本地用 Photoshop 将图片转换为灰度图，并调整色阶将黑白对比拉到极致，消除多余灰度像素。"
  },
  {
    "title": "执行本地降噪 (De-speckle)",
    "desc": "剔除扫描图纸上细小的杂色点（斑点），否则描摹算法会为这些杂点生成上万个无意义的闭合微小多边形。"
  },
  {
    "title": "本地无网专机跑 WinTopo",
    "desc": "如果扫描原图带有地质测绘或设备大样，请下载本地离线程序在单机物理隔绝环境下完成矢量化。"
  }
];
const FAQS = [
  {
    "question": "为什么转换出来的线条有重影？",
    "answer": "这多是因为描摹算法采用了“轮廓模式（Outline Mode）”把粗线条的两侧边缘都画出了线。对于工程图，应该选择“中心线模式（Centerline/Skeleton Mode）”提取中轴骨架。"
  },
  {
    "question": "转换出来的线条精度不够怎么办？",
    "answer": "图像分辨率（DPI）是决定描摹精度的核心。如果原图只有几百像素，转换结果必然失真严重。建议采用 300 DPI 以上的扫描版蓝图进行描摹。"
  }
];

export default function OnlineImageJpgToDxfVectorizerClient() {
  return (
    <CloudReferralClient
      title="Online Image Raster (JPG/PNG) to Vector DXF Tracer"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="File Parser & Converter"
      painPointDesc="将手绘草图、扫描版蓝图或 JPG/PNG 像素图无损转换为能在 CAD 中进行拉伸编辑的 DXF 矢量线条（线段与圆弧），是实现图纸数字化的关键。普通的自动描摹工具往往会产生几万个细碎的锯齿短折线，导致导入 CAD 后软件直接卡死。本评测筛选了具备贝塞尔曲线拟合和边缘锐化算法的顶级引擎。"
      riskWarning="有些扫描版图纸来自政府旧档或涉密企业老厂房扩建。把这类敏感图像上传至不知名在线矢量化网站极易引发机密泄漏风控。常规项目应使用本地 Illustrator 或 Vectorization 独立单机程序进行处理，杜绝网络传输隐患。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
