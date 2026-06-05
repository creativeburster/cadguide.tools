'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Revit Model Checker (官方免费审计扩展)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "审计深度",
        "score": 5
      },
      {
        "name": "规则配置性",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "官方底层原生支持",
      "完全支持自定义 XML 审计规则表"
    ],
    "cons": [
      "需要学习一定的配置语法"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "毫无疑问的 BIM 数据质检标杆, 直接集成在 Revit 界面, 能对 RFA 进行多达数十项指标的深度扫描. "
  },
  {
    "name": "Solibri Model Checker (BIM 数据与合规性质量审计)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "审计深度",
        "score": 5
      },
      {
        "name": "规则配置性",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "全方位 IFC 和 RFA 逻辑验证",
      "强大的空间冲突检测"
    ],
    "cons": [
      "商业版费用较高"
    ],
    "officialUrl": "https://www.solibri.com/",
    "verdict": "偏向于大型项目设计协调和造价核算的高级质检工具, 其属性字典审计 (Attribute Checker) 极为硬核. "
  },
  {
    "name": "Plannerly BIM Management Suite",
    "rating": 9.3,
    "metrics": [
      {
        "name": "审计深度",
        "score": 4
      },
      {
        "name": "规则配置性",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "BIM 规范管理一体化",
      "支持云端直接比对"
    ],
    "cons": [
      "必须连网使用"
    ],
    "officialUrl": "https://www.plannerly.com/",
    "verdict": "出色的轻量化在线 BIM 管理平台, 能自动依据 LOD 精度等级对族图元参数进行标准化约束审计. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "本地双重 Purge 净化",
    "desc": "在 Revit 族编辑器中, 至少连续点击运行两次'清除未使用项 (Purge Unused)', 可剔除 90% 的废弃材质和子族缓存. "
  },
  {
    "title": "去除无谓的三维细节",
    "desc": "机械阀门族等构件的螺栓等细节应设置为仅在'精细'视图下显示, 在'粗糙'和'中等'下用简单实体代替, 防止主图加载卡顿. "
  },
  {
    "title": "建立企业级统一共享参数表",
    "desc": "避免使用临时自定义参数, 统一从企业统一只读的共享参数 .txt 文件中加载参数属性, 保障数据纯净. "
  }
];
const FAQS = [
  {
    "question": "为什么 RFA 族文件只有几百 KB, 导入项目后却变大很多? ",
    "answer": "这通常是由于该族内部'嵌套'了大量的其他子族, 且这些子族未被设置为'共享 (Shared) '. Revit 会在导入时强制复制这部分子族库, 导致主图体积膨胀. "
  },
  {
    "question": "Revit 里的'可变参数'和'类型参数'有什么区别? ",
    "answer": "'类型参数 (Type Parameters) '修改时会同时改变项目中所有同类族的大小; '实例参数 (Instance Parameters) '则只改变当前选中的那一个. 推荐非尺寸关键的属性设为实例参数以减少定义冗余. "
  }
];

export default function OnlineRevitFamilyCheckerAuditClient() {
  return (
    <CloudReferralClient
      title="BIM Revit Family File Integrity & Parameter Auditor"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="在 BIM 协同设计中, 从网上下载或由供应商提供族文件 (.rfa) 质量良莠不齐. 过度嵌套的族, 过多未清除的垃圾实体 (Unpurged Objects) 以及命名不合规的共享参数 (Shared Parameters) 会导致 Revit 主模型体积暴涨, 引发项目载入极其缓慢和性能崩溃. "
      riskWarning="Revit 族文件不仅包含三维精细网格, 还带有厂商的工艺技术规范和规格. 大批量上传图元库进行云端审计, 存在数据被二次收集的版权合规风险. 针对企业核心族库, 推荐在本地 Revit 中安装官方 Model Checker 插件做离线合规审计. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
