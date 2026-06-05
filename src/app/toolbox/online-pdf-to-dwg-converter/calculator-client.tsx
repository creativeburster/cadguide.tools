'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AnyDWG PDF to DWG Converter",
    "rating": 9.8,
    "metrics": [
      {
        "name": "几何精确度",
        "score": 5
      },
      {
        "name": "文字还原度",
        "score": 4
      },
      {
        "name": "图层保留度",
        "score": 4
      }
    ],
    "pros": [
      "矢量曲线拓扑还原极佳",
      "支持批量图纸快速对齐"
    ],
    "cons": [
      "大图纸的渐变色填充偶有缺失"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "AnyDWG 拥有数十年的 CAD 基础开发经验，其本地引擎在还原 CAD 点划线、中心线和标注时算法最稳定。"
  },
  {
    "name": "CADSoftTools PDF to DWG",
    "rating": 9.5,
    "metrics": [
      {
        "name": "几何精确度",
        "score": 4
      },
      {
        "name": "文字还原度",
        "score": 5
      },
      {
        "name": "图层保留度",
        "score": 3
      }
    ],
    "pros": [
      "支持中文字体 OCR 重新映射",
      "提供免费的在线快速预览"
    ],
    "cons": [
      "图纸空间到模型空间偶尔坐标偏离"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "老牌工业级 CAD 组件商，对 PDF 内部文字的识别精度行业领先。"
  },
  {
    "name": "CloudConvert PDF to DWG",
    "rating": 9.1,
    "metrics": [
      {
        "name": "几何精确度",
        "score": 4
      },
      {
        "name": "文字还原度",
        "score": 3
      },
      {
        "name": "图层保留度",
        "score": 4
      }
    ],
    "pros": [
      "全环境队列极其高速",
      "支持 API 自动化调度"
    ],
    "cons": [
      "对高度自定义的字体解析有限"
    ],
    "officialUrl": "https://cloudconvert.com/",
    "verdict": "最知名的通用文件格式转换平台，适合对转换细节要求不高的普通草图快速流转。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "优先剔除图纸敏感属性",
    "desc": "转换前使用 PDF 压缩或擦除工具去除作者、审图戳记等不必要的元数据标记。"
  },
  {
    "title": "本地 SCALE 缩放对齐",
    "desc": "转换出的 DWG 会缩放至图纸尺寸，请在 CAD 中选中所有图元，使用 SCALE 参照已知标注（如 900mm 门宽）重置一比一比例。"
  },
  {
    "title": "无网本地代换策略",
    "desc": "大型企业可考虑部署本地版 PDFIMPORT，或对对外访问的代理服务器设置策略，防范数据上报。"
  }
];
const FAQS = [
  {
    "question": "为什么转换出来的线条都是断开的散线？",
    "answer": "这是由于 PDF 导出时将圆弧或样条曲线离散化成了直线段。您可以在 CAD 中通过 PEDIT ➔ J (连接) 命令将多段断开的线条重新缝合。"
  },
  {
    "question": "转换出来的中文字符变成了乱码怎么办？",
    "answer": "这是因为您的系统缺少 PDF 导图时原装的 TrueType (TTF) 字体或 SHX 双大字体。建议在 CAD 字体管理器中设置 substitution（代换）为 gbcbig.shx 或 hztxt.shx。"
  }
];

export default function OnlinePdfToDwgConverterClient() {
  return (
    <CloudReferralClient
      title="Online Vector PDF to CAD DWG Converter Portal"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="File Parser & Converter"
      painPointDesc="将矢量或扫描式 PDF 图纸还原为可在 CAD 中编辑的 DWG/DXF 几何实体，通常会面临曲线拟合失真、SHX/TTF 字体打散为零碎线条以及默认比例尺漂移等技术难题。本评测挑选了业界精度最高、图层保留最完好的三款专业引擎。"
      riskWarning="PDF 图纸包含大量企业核心建筑与机械装配机密。商业云端转换器有可能记录并留存您的图纸。为了防范版权合规稽查与商业隐私泄露，针对高密图纸，请务必使用本地 AutoCAD 的 PDFIMPORT 命令进行无网本地解析，切勿上传到未知来源网站。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
