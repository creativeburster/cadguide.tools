'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk DWG TrueView (官方桌面转换器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "降级保真度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "批量操作",
        "score": 4
      }
    ],
    "pros": [
      "官方底层数据库重写",
      "无损转换动态块"
    ],
    "cons": [
      "仅支持 Windows 且安装包较大"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "欧特克官方提供的免费看图与图纸版本转换器, 安全系数最高, 保证 CAD 数据库节点无缺损. "
  },
  {
    "name": "Any DWG Version Converter",
    "rating": 9.6,
    "metrics": [
      {
        "name": "降级保真度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 4
      },
      {
        "name": "批量操作",
        "score": 5
      }
    ],
    "pros": [
      "支持批量后台静默降级",
      "兼容所有 AutoCAD 历史代码"
    ],
    "cons": [
      "商业版需要许可购买"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "非常经典的批量图纸版本重构程序, 操作纯粹利落, 降级后数据兼容良好. "
  },
  {
    "name": "CADSoftTools Version Converter",
    "rating": 9.2,
    "metrics": [
      {
        "name": "降级保真度",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      },
      {
        "name": "批量操作",
        "score": 3
      }
    ],
    "pros": [
      "云端极速解包",
      "支持 DXF-DWG 互转"
    ],
    "cons": [
      "大文件偶尔出现自定义实体转换丢失"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "性能优秀的专业云端降级平台, 满足日常工程配合时的快速倒手. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "建议降级至 2013 格式 (AC1027)",
    "desc": "这是目前全行业兼容性与数据结构最平衡的版本, 几乎 100% 的替代 CAD 引擎都能流畅读写. "
  },
  {
    "title": "警惕参数化实体降解",
    "desc": "降级后, 请核对复杂的关联标注, 三维剖切以及三维模型表面的曲率参数是否被炸开 (Exploded) 为碎线. "
  },
  {
    "title": "使用隔离虚拟机转换",
    "desc": "对于来路不明的客户图纸, 建议在隔离的虚拟机环境下转换, 防范宏病毒和遥测抓取. "
  }
];
const FAQS = [
  {
    "question": "AC1032, AC1027, AC1024 都是些什么代码? ",
    "answer": "这些是 DWG 文件的首部魔数标志 (Magic Number) . 例如 AC1032 代表 2018-2027 版本的图纸数据库, 老版软件因为无法识别该头部结构, 会直接报文件损坏或版本不支持. "
  },
  {
    "question": "降级后动态块 (Dynamic Blocks) 失效了怎么回事? ",
    "answer": "一些基于新型约束关系的动态块在高版本才支持. 在强制降级后, CAD 数据库会将其转化为退化的静态普通匿名块. "
  }
];

export default function OnlineDwgVersionDowngraderCloudClient() {
  return (
    <CloudReferralClient
      title="Online DWG Format Version Downgrader"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="遭遇'图形文件版本不支持'错误时, 您可能拿到了高版本 AutoCAD (如 2018-2027 保存的 AC1032 编码) 的图纸, 而本地仅有老版本 CAD 软件. 利用云端格式降级工具可以快速将文件重写为广泛兼容的 AC1027 (2013 格式) 或 AC1021 (2007 格式) . "
      riskWarning="频繁的格式降级不仅可能导致特殊的参数化'动态块'和约束关系丢失, 甚至可能触发反盗版合规审查. 请确保降级行为是在企业授权的安全边界下进行. 对于核心机密设计, 推荐下载官方免费的桌面端 DWG TrueView 软件完成本地转换. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
