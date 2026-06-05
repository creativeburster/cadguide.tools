'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD WBLOCK Command (原生图块写出指令)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "图层分离精确度",
        "score": 5
      },
      {
        "name": "原点对齐保真",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "本地运行, 0% 数据泄露",
      "100% 保持图纸数据库清洁"
    ],
    "cons": [
      "不支持多文件的拖拽队列"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "通过 CAD 内置命令运行 WBLOCK 配合 Layer Isolation (LAYISO) 是最干净, 最安全的图层分割法则. "
  },
  {
    "name": "Any CAD Layer Splitter Script",
    "rating": 9.5,
    "metrics": [
      {
        "name": "图层分离精确度",
        "score": 4.5
      },
      {
        "name": "原点对齐保真",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "纯本地 LISP 或 Python 处理",
      "高吞吐批量并发"
    ],
    "cons": [
      "需要一点点基础的脚本配置"
    ],
    "officialUrl": "https://github.com/",
    "verdict": "基于 ODA 库编写的 Python 图纸处理脚本, 能够在脱网电脑中快速分割上百张图纸的层级结构. "
  },
  {
    "name": "Convertio Bulk Separator",
    "rating": 9.1,
    "metrics": [
      {
        "name": "图层分离精确度",
        "score": 4
      },
      {
        "name": "原点对齐保真",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 3
      }
    ],
    "pros": [
      "云端并行计算排队",
      "一键下载 ZIP 打包件"
    ],
    "cons": [
      "免费版大图纸可能超时报错"
    ],
    "officialUrl": "https://convertio.co/",
    "verdict": "适合外地出差且手头没有 CAD 软件时的紧急图纸分层查验与输出. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "执行本地 PURE 净化",
    "desc": "拆分前运行 PURGE 清理掉未引用的空图层, 防止拆分出来的子图纸依然带有一堆无意义的空层列表. "
  },
  {
    "title": "绝对保留坐标系一致性",
    "desc": "写出新图块 (WBLOCK) 时, 务必使用绝对零点 (0,0,0) 作为基准点, 否则各子图纸在后期进行 XREF (外部参照) 重合时会完全飘移错位. "
  },
  {
    "title": "脱网单机 LISP 脚本部署",
    "desc": "企业敏感总图的处理需在完全断网环境下使用 AutoLISP 或 Python 离线脚本一键拆分输出. "
  }
];
const FAQS = [
  {
    "question": "拆分出来的子图纸文件大小怎么还是跟原图一样大? ",
    "answer": "这代表原图中的大部分图元可能被包含在了外部参照 (Xrefs) 里, 或者图纸中包含大量未清理的注册表垃圾实体 (Regapps) . 需要先绑定外部参照并彻底 purge 净化后再进行拆分. "
  },
  {
    "question": "如何使用 LISP 脚本快速在本地拆分图层? ",
    "answer": "可以加载这段代码: `(foreach lay (layoutlist) (command \"-WBLOCK\" (strcat lay \".dwg\") \"\" ...))` 它可以按照布局层和图层表将其秒级写出为本地文件. "
  }
];

export default function OnlineDwgLayerSplitterCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Layer Splitter & Batch Drawing Separator"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="处理极其庞大且包含建筑, 机电, 管路等几十个图层的总图时, 为了将不同专业的图纸分发给不同的承包商, 需要手工将其拆分为独立的单图层子 DWG. 云端 DWG Layer Splitter 能批量识别图层表, 自动在后端将其分离 (WBLOCK 出图) , 并保持基准原点完全重合. "
      riskWarning="总图代表项目全局的地理排布与全量机密. 在公共云服务商上传总图极易遭遇全局泄露和合规稽查. 请优先通过在本地 AutoCAD 内加载一段极简的 AutoLISP 脚本来进行本地图层拆分, 禁止在公网直接解包处理. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
