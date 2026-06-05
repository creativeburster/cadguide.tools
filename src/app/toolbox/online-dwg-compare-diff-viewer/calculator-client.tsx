'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD DWG Compare (官方本地内置命令)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "比对精确度",
        "score": 5
      },
      {
        "name": "红绿高亮保真",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "本地运行无需连网",
      "支持把比对差异另存为新图"
    ],
    "cons": [
      "需要安装 CAD 本地客户端"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "官方底层的图形比较功能, 算法最强, 不仅能识别几毫米的线条移动, 还能识别块属性的改动. "
  },
  {
    "name": "Autodesk Viewer Compare Services",
    "rating": 9.6,
    "metrics": [
      {
        "name": "比对精确度",
        "score": 4.5
      },
      {
        "name": "红绿高亮保真",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "网页端即可运行",
      "支持布局空间比较"
    ],
    "cons": [
      "需要注册账号登录"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "欧特克云端看图器提供的免费比对扩展, 能够极好地把两个版次的图纸重叠并调整透明度进行校验. "
  },
  {
    "name": "DraftSight Compare Drawings Utility",
    "rating": 9.2,
    "metrics": [
      {
        "name": "比对精确度",
        "score": 4
      },
      {
        "name": "红绿高亮保真",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "轻量级独立桌面级比对",
      "对平替软件用户最友好"
    ],
    "cons": [
      "对嵌套块 (Nested Blocks) 的深层更改识别有限"
    ],
    "officialUrl": "https://www.draftsight.com/",
    "verdict": "性能优秀的本地图纸版本比对套件, 对大文件运行依然有良好支持. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "对齐原点与基准点",
    "desc": "比对前, 必须确保两个版次图纸的模型空间原点 (0,0,0) 完全对齐. 如果原点发生偏差, 比对结果会误报全图图元都在移动. "
  },
  {
    "title": "本地炸开嵌套引用",
    "desc": "对于复杂的图纸, 比对前可以先执行 EXPLODE (炸开) 那些自定义块和嵌套的外部参照 (Xrefs) , 以防比对算法将它们直接算作单一删除动作. "
  },
  {
    "title": "脱网单机校验保障",
    "desc": "敏感的招标图纸应在没有网络访问的专机上进行 AutoCAD 本地图纸比对. "
  }
];
const FAQS = [
  {
    "question": "比对结果里的红, 绿, 灰三种颜色都代表什么? ",
    "answer": "根据官方通用规范: 绿色代表仅在当前新版图纸中存在的图元 (新增) ; 红色代表仅在旧版图纸中存在 (已被删除) ; 灰色代表两个版次完全一致没有改动的图元. "
  },
  {
    "question": "比对能识别到表格里的文字文字改动吗? ",
    "answer": "可以. 只要是以 MTEXT (多行文字) 或 DTEXT (单行文字) 存储的实体, 位置或内容发生哪怕一个标点符号的修改, 都会被高亮圈出来. "
  }
];

export default function OnlineDwgCompareDiffViewerClient() {
  return (
    <CloudReferralClient
      title="Cloud DWG Revision Difference & Compare Visualizer"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="在处理大型建筑或机电工程的多次版次变更时, 找出两版 DWG 图纸的微小物理变化是一大难题. 单纯靠人工校对极易遗漏. 利用云端 DWG Revision Compare 差异比对程序, 可以实现高精度的叠图比对, 自动使用红, 绿两色高亮标注新图纸的增, 删和修改实体. "
      riskWarning="改动图纸往往代表着工程的核心变更和商业预算底牌. 将两版 DWG 集中上传到不知名看图对比网站非常危险. 如果条件允许, 请优先在本地运行 AutoCAD 的 COMPARE (图形比较) 命令, 严禁使用非受信公共云服务以防商业机密泄露. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
