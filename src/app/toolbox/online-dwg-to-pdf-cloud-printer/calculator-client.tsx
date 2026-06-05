'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Viewer (官方免费通道)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "线宽保真度",
        "score": 5
      },
      {
        "name": "布局完整度",
        "score": 5
      },
      {
        "name": "安全合规性",
        "score": 4
      }
    ],
    "pros": [
      "Autodesk 官方引擎绝对一致",
      "100% 支持三维视图"
    ],
    "cons": [
      "必须登录且加载相对缓慢"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "官方免费在线看图与发布平台, 完全保留 CTB, 图层属性以及图元关联, 最安全可靠. "
  },
  {
    "name": "CloudConvert DWG to PDF",
    "rating": 9.3,
    "metrics": [
      {
        "name": "线宽保真度",
        "score": 4
      },
      {
        "name": "布局完整度",
        "score": 4
      },
      {
        "name": "安全合规性",
        "score": 3
      }
    ],
    "pros": [
      "支持批量脚本调用",
      "提供高匿接口"
    ],
    "cons": [
      "不支持高度复杂的 CTB 自定义笔宽"
    ],
    "officialUrl": "https://cloudconvert.com/",
    "verdict": "极速转换普通图纸的最佳选择, 支持主流图层静态平面导出. "
  },
  {
    "name": "Allinpdf DWG to PDF",
    "rating": 9,
    "metrics": [
      {
        "name": "线宽保真度",
        "score": 3
      },
      {
        "name": "布局完整度",
        "score": 4
      },
      {
        "name": "安全合规性",
        "score": 3
      }
    ],
    "pros": [
      "纯前端拖拽无需登录",
      "速度飞快"
    ],
    "cons": [
      "对大图纸可能出现线条丢失"
    ],
    "officialUrl": "https://allinpdf.com/",
    "verdict": "适合个人临时使用的极速查看与转换渠道, 不建议大企业敏感业务部署. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "本地清理垃圾实体",
    "desc": "打印前在 CAD 中运行 PURGE 和 -AUDIT 命令, 将冗余的 scale list 和外部引用绑定以减小体积. "
  },
  {
    "title": "采用 Microsoft Print to PDF",
    "desc": "如无安装 CAD 限制, 使用微软虚拟打印驱动输出的 PDF 几何保真度最高. "
  },
  {
    "title": "限制外链遥测",
    "desc": "对于敏感文件, 选择限制网络访问的纯只读本地解析方案. "
  }
];
const FAQS = [
  {
    "question": "转换出来的 PDF 为什么全图线条都是一个粗细? ",
    "answer": "这是因为转换时没有正确挂载您的 .ctb 打印样式文件. 可以在云打印设置中寻找 \"Plot styles\" 选项, 或者将打印样式以单色 (Monochrome) 模式固化到图纸内部. "
  },
  {
    "question": "多视口视角的线段为何重叠残缺? ",
    "answer": "这是布局空间 Viewport 坐标遮挡裁剪问题. 建议打印前在 CAD 里将视口的 Shade Plot 设定为 As Displayed (按显示渲染) . "
  }
];

export default function OnlineDwgToPdfCloudPrinterClient() {
  return (
    <CloudReferralClient
      title="Online DWG to Vector PDF Batch Cloud Printer"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="在没有安装 AutoCAD 的情况下, 如何将 DWG 快速转为高保真的 PDF 格式用于汇报? 通用转换工具往往会导致 CTB 打印线宽丢失 (全图粗细一样) , 图纸布局空间 (Layout Tabs) 不可见, 以及复杂线型样式崩塌. "
      riskWarning="DWG 文件是企业数字资产的最核心承载. 将 DWG 上传到云端打印时, 不仅要核对隐私协议, 还要避免激活 Autodesk 等联盟的反盗版侦测网络. 切勿上传任何未经官方授权客户端保存的文件进行云端打印. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
