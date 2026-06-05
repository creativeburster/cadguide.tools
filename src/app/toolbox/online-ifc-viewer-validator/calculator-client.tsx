'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "BIMcollab Zoom (专业 BIM 校验看板)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "校验精确度",
        "score": 5
      },
      {
        "name": "数据展现力",
        "score": 5
      },
      {
        "name": "合规校验力",
        "score": 5
      }
    ],
    "pros": [
      "深度支持 Smart Views 数据筛选",
      "极致平滑的超大模型加载"
    ],
    "cons": [
      "商业高级模块需要订阅收费"
    ],
    "officialUrl": "https://www.bimcollab.com/",
    "verdict": "全球建筑大厂做 IFC 规则校验和设计碰撞的首选桌面端利器, 校验报告非常严谨. "
  },
  {
    "name": "Solibri Anywhere (经典 IFC 质量审计程序)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "校验精确度",
        "score": 5
      },
      {
        "name": "数据展现力",
        "score": 4.5
      },
      {
        "name": "合规校验力",
        "score": 4.5
      }
    ],
    "pros": [
      "完全免费下载",
      "强大的属性分类检验功能"
    ],
    "cons": [
      "安装包较大, 运行较占内存"
    ],
    "officialUrl": "https://www.solibri.com/",
    "verdict": "老牌芬兰 BIM 审计开发商推出的查看器, 对构件的分类映射关系审查细致入微. "
  },
  {
    "name": "xBIM Xplorer (开源轻量级校验核心)",
    "rating": 9.4,
    "metrics": [
      {
        "name": "校验精确度",
        "score": 4
      },
      {
        "name": "数据展现力",
        "score": 4
      },
      {
        "name": "合规校验力",
        "score": 4
      }
    ],
    "pros": [
      "100% 免费开源",
      "基于 .NET 架构极易进行二次开发"
    ],
    "cons": [
      "默认 UI 界面简易, 需要自行美化"
    ],
    "officialUrl": "https://github.com/xBimTeam",
    "verdict": "开源 BIM 数据解析库的代表, 非常适合软件开发者用于搭建自主的 Web 校验后台. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "执行 Schema 基础格式验证",
    "desc": "确认 IFC 头文件中的 MVD (模型视图定义) 和 IFC2X3_TC1 或 IFC4 声明无损坏. "
  },
  {
    "title": "使用本地隔离检测",
    "desc": "涉密项目在隔离的测绘专机上采用 Solibri 离线校验, 严禁配置任何网络同步. "
  },
  {
    "title": "配置防盗版防御隔离",
    "desc": "建立基于局域网的离线数据审查规范, 屏蔽无关网络流量. "
  }
];
const FAQS = [
  {
    "question": "IFC 的 Schema 报错 'Unknown Entity' 是什么原因? ",
    "answer": "这代表生成该模型的导出引擎写入了不符合 buildingSmart 官方规范的自定义专有构件名称. 可在校验器里设定属性重映射进行过滤. "
  },
  {
    "question": "如何判定 IFC 模型中的网格是否 Watertight (不漏水) ? ",
    "answer": "可以使用 Solibri 等工具的几何自相交与破洞探测规则, 扫描是否包含多余的三角面重叠或者缺失面导致的空间泄漏. "
  }
];

export default function OnlineIfcViewerValidatorClient() {
  return (
    <CloudReferralClient
      title="Online openBIM IFC Standard File Validator & Viewer"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="为了确保 BIM 协同模型在进入下游造价, 能耗分析或交付政府归档时 100% 符合 buildingSmart 规范, 开发与运维人员急需对 IFC 模型的元数据字典 (Data Dict) , 多面体几何封闭性 (Watertightness) 及父子拓扑嵌套关系进行自动化校验. "
      riskWarning="IFC 是全生命周期建筑大数据的聚合体. 不慎上传至存在数据监控的公共看图站点可能会将项目的物理结构暴露无遗. 请优先使用经过 buildingSmart 标准组织认证的安全校验客户端, 严禁直接上传政府涉密或军工项目图纸. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
