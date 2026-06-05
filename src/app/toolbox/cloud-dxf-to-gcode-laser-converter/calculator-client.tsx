'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "NC Viewer (在线 G-Code 可视化与模拟器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "仿真精度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "易用性",
        "score": 5
      }
    ],
    "pros": [
      "纯前端解析 G-Code 并呈现 3D 刀线轨迹",
      "提供实时的三维仿真走刀动画"
    ],
    "cons": [
      "仅做仿真，不提供 DXF 转 G-Code 服务"
    ],
    "officialUrl": "https://ncviewer.com/",
    "verdict": "目前最优秀、最安全的在线刀轨核对平台，在将 G-Code 送入机床前推荐在此进行空跑模拟。"
  },
  {
    "name": "Carbide Create (轻量级刀轨设计器)",
    "rating": 9.3,
    "metrics": [
      {
        "name": "刀路控制",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "易用性",
        "score": 4.5
      }
    ],
    "pros": [
      "界面简单直观，本地运行无泄密风险",
      "支持指定刀具半径补偿与雕刻深度"
    ],
    "cons": [
      "高级三维雕刻需要购买 Pro 版本"
    ],
    "officialUrl": "https://carbide3d.com/carbidecreate/",
    "verdict": "极适合创客和小型 DIY 雕刻，本地运行非常安全，能够进行简单边缘切割的快速转换。"
  },
  {
    "name": "jscut (开源 Web 刀轨编译器)",
    "rating": 9.5,
    "metrics": [
      {
        "name": "本地隐私",
        "score": 5
      },
      {
        "name": "路径精度",
        "score": 4.5
      },
      {
        "name": "配置灵活度",
        "score": 4
      }
    ],
    "pros": [
      "100% 浏览器本地运算，数据不上传服务器",
      "支持 SVG/DXF，可精细设置切削步距与下刀量"
    ],
    "cons": [
      "初次使用需要熟悉参数概念，有一定的专业门槛"
    ],
    "officialUrl": "http://jscut.org/",
    "verdict": "最安全的在线开源切削编译器，不依赖服务器，是工程技术人员首选的轻量级工具。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "设置合理引入引出线 (Lead-In/Out)",
    "desc": "为防止激光在零件边缘起刀点留下烧灼凹坑，应配置引入引出圆弧或斜线，使起刀点位于废料区。"
  },
  {
    "title": "圆弧转换为真正 G02/G03",
    "desc": "检查转换器是否支持将多段线圆弧拟合为 G2/G3 圆弧插补命令，这可以显著减小 G-Code 文件体积，避免机床抖动。"
  },
  {
    "title": "安全高度 (Safe Height) 校验",
    "desc": "务必将 G00 快速移动的安全高度（通常为 Z5-Z10）设置得大于夹具高度，杜绝横移撞刀风险。"
  }
];
const FAQS = [
  {
    "question": "为什么转换出的 G-code 文件在我的雕刻机上无法运行？",
    "answer": "这通常是因为转换器输出的 G-code 格式（方言）与您的控制器（如 GRBL, Mach3, Syntec 新代）不匹配。需要在转换时选择正确的后处理器 (Post Processor)。"
  },
  {
    "question": "如何解决转换后圆弧变成折线段的问题？",
    "answer": "这是因为原 DXF 图纸中的圆弧被转换器强行打散（Explode）为了直线微小段。确保在 CAD 中保存为圆弧对象，或在转换器中开启圆弧插补优化。"
  }
];

export default function CloudDxfToGcodeLaserConverterClient() {
  return (
    <CloudReferralClient
      title="Online DXF to CNC G-Code Path Planner"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="Engineering & Design Calculator"
      painPointDesc="数字制造与激光切割中，将 2D 矢量 DXF 图纸转化为雕刻机、水刀、等离子或激光切割机可读的 G-Code（G代码）是核心链路。市面上云端转换器品质不一，不合理的刀轨计算常导致空跑、材料烧焦、撞刀或圆弧插补（G02/G03）解析错误。"
      riskWarning="转换的 DXF 轮廓往往代表精密钣金、机械传动件等商业设计。在免费的第三方在线转换器上传时，图纸会被云端服务器解析并存储，可能泄露几何知识产权。对于高机密零件图，强烈建议使用本地离线 CNC 编程软件（如 Fusion 360, Vectric, Carbide Create）或开源离线转换器。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
