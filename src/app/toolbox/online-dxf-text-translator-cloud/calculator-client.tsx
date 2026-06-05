'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CADText Translator LISP Script (本地离线脚本)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "原点保留度",
        "score": 5
      },
      {
        "name": "字体匹配度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "纯本地执行, 数据 100% 安全",
      "自动过滤坐标和标高数值"
    ],
    "cons": [
      "需要挂载翻译引擎的 API 密钥"
    ],
    "officialUrl": "https://github.com/",
    "verdict": "基于 CAD 本地 API 编写的批量文本导出与原位替换脚本, 是安全保密性最高的高效方案. "
  },
  {
    "name": "SDL Trados CAD Plugin (专业工程翻译套件)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "原点保留度",
        "score": 4.5
      },
      {
        "name": "字体匹配度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "支持建立专业的工程翻译记忆库",
      "翻译一致性高"
    ],
    "cons": [
      "需要购买 Trados 商业版软件授权"
    ],
    "officialUrl": "https://www.rws.com/",
    "verdict": "全球翻译软件巨头为 CAD 格式定制的翻译扩展, 支持直接读取并导出译文 DWG, 还原度极高. "
  },
  {
    "name": "Allinpdf Translator Cloud (云看图与翻译平台)",
    "rating": 9.1,
    "metrics": [
      {
        "name": "原点保留度",
        "score": 4
      },
      {
        "name": "字体匹配度",
        "score": 3.5
      },
      {
        "name": "数据安全性",
        "score": 3
      }
    ],
    "pros": [
      "纯网页版拖拽极速翻译",
      "提供双语对照预览"
    ],
    "cons": [
      "免费版对大文件及复杂图层支持有限"
    ],
    "officialUrl": "https://allinpdf.com/",
    "verdict": "适合个人设计师对非涉密零件草图或产品包装平面图进行快速的小语种标注翻译转换. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "提取纯文本至 TMX 进行翻译",
    "desc": "使用脚本提取图纸中所有的 Text/MText/Attribute 文本输出为标准的文本文件, 在翻译软件中翻译后再原位导入, 这样可以确保图纸几何结构绝不受损. "
  },
  {
    "title": "采用双字节 SHX 大字体",
    "desc": "翻译出的文字如果是多国语种 (如西里尔字母或日语) , 在 CAD 样式中必须为其挂载支持对应 Unicode 编码的 SHX 大字体 (如 gbcbig.shx) , 防止出现问号. "
  },
  {
    "title": "加密隧道传输隔离",
    "desc": "企业在涉及多国协同图纸翻译时应完全建立代理安全网络通道, 防范泄密. "
  }
];
const FAQS = [
  {
    "question": "翻译后的文字把尺寸标注线给压住了怎么办? ",
    "answer": "这多是由于不同语种的字符长度差异过大 (例如中文'阀门'两个字, 翻译成英文是'Valve'五个字符) . 建议在代换前, 使用 LISP 脚本限制字宽因子 (Width Factor) 或将多行文本设置为自适应换行. "
  },
  {
    "question": "为什么标注属性块 (Attribute Blocks) 里的字翻译不过来? ",
    "answer": "普通的文本翻译命令通常只能识别普通的 TEXT 或 MTEXT 图元, 而定义在图层块 (Blocks) 内部的属性文字 (ATTRIB) 需要使用深层嵌套解析 API. 您必须选用支持属性块递归提取的翻译工具. "
  }
];

export default function OnlineDxfTextTranslatorCloudClient() {
  return (
    <CloudReferralClient
      title="Online DXF/DWG Drawing Multi-Language Batch Translator"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="在开展跨国工程或工业设备发包时, 常需要将中文 DXF/DWG 图纸内的工艺文字和标注批量翻译成英语, 俄语, 日语等语种. 普通在线翻译往往会导致文字的坐标原点发生漂移 (错位) , 字体由于编码不兼容显示为问号, 或者把单行文本翻译成超长段落导致遮挡图纸. "
      riskWarning="图纸中标注的技术要求, 明细表 (BOM) 及尺寸公差涵盖了产品的核心制造工艺与专利. 大批量上传至未经安全隔离的公共翻译网站存在极高的敏感数据泄漏风险. 对于机密项目, 推荐在本地 CAD 内使用专业离线插件进行文本翻译. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
