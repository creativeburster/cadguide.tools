'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Bentley MicroStation (官方桌面内核另存为)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "单元库还原",
        "score": 5
      },
      {
        "name": "层级映射度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "Bentley 官方原生几何重组",
      "支持挂载 CSV 批量对照表"
    ],
    "cons": [
      "商业版授权极为昂贵"
    ],
    "officialUrl": "https://www.bentley.com/",
    "verdict": "毋庸置疑的最高精度转换方案。利用其内置转换向导能精确定义 DGN levels 到 DWG layers 的逻辑。"
  },
  {
    "name": "ODA File Converter (官方数据联盟转换器)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "单元库还原",
        "score": 4.5
      },
      {
        "name": "层级映射度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "免费无需商业授权",
      "提供底层 C++ SDK 级别的算法"
    ],
    "cons": [
      "没有可视化 GUI 图元参数微调"
    ],
    "officialUrl": "https://www.opendesign.com/",
    "verdict": "开放设计联盟（ODA）维护的专业底层格式转换器，对 DGN V7/V8 和 DWG 各版本的映射机制非常完美。"
  },
  {
    "name": "Any DGN to DWG Converter",
    "rating": 9.2,
    "metrics": [
      {
        "name": "单元库还原",
        "score": 4
      },
      {
        "name": "层级映射度",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "绿色轻量级批量导出",
      "运行速度极快"
    ],
    "cons": [
      "对 Bentley 专属线型的拟合需要手动配置"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "专业的第三方转换小工具，运行独立，适合日常跨软件协作时的快速交付。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "挂载 Remap CSV 映射文件",
    "desc": "在 MicroStation 导出时，配置 .csv 控制表，将 Levels、Colors、LineWeights 一一指定为对应的 CAD 图层和标准索引颜色（ACI）。"
  },
  {
    "title": "处理共享单元 (Shared Cells)",
    "desc": "在导出选项中，将“共享单元”展开为普通“块 (Blocks)”，防止在 AutoCAD 中图纸被破坏为零星图元。"
  },
  {
    "title": "统一使用真彩色 (True Color)",
    "desc": "避免使用 Bentley 专用的颜色表，在转换前将元素色值切换为通用的 RGB 真彩色，防止导入 CAD 后全部发黑。"
  }
];
const FAQS = [
  {
    "question": "转换出的图元显示“OLE 容器错误”是什么原因？",
    "answer": "这代表您的 DGN 图纸中内嵌了外部的 Excel 数据表或非矢量图。CAD 对此接口不兼容，建议导出前在 Bentley 里将其截图固化为普通像素图层。"
  },
  {
    "question": "DGN 的 V7 和 V8 格式对转换有影响吗？",
    "answer": "有。V7 是历史旧版本，有文件大小及图层数量上限限制；V8 是 2001 年后通用的 64 位三维数据库格式。转换前需确认目标 DWG 平台是否能识别对应 ODA 驱动。"
  }
];

export default function OnlineDgnToDwgConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bentley DGN to AutoCAD DWG Layer Converter"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="File Parser & Converter"
      painPointDesc="Bentley MicroStation DGN 图纸在向 AutoCAD DWG 图纸转换时，由于两个平台底座原理完全不同，通常会导致 MicroStation 的“层级（Levels）”无法对齐到 CAD“图层（Layers）”、专有的单元库（Cells）退化为破碎线段、以及 Bentley 标志性的手写连续线型样式崩塌。"
      riskWarning="DGN 格式一般用于国家大型桥梁、轨道交通及市政网管等基础设施设计，涉及极为严格的物理安全和项目敏感性。请优先使用 MicroStation 本地内置的“另存为 DWG”功能进行高精度匹配，并挂载正规图层对照表（CSV），避免使用公共转换网站进行大批量转换。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
