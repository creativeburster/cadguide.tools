'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Revit Native IFC Exporter (官方开源插件)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "IfcSpace 保留",
        "score": 5
      },
      {
        "name": "参数完整度",
        "score": 5
      },
      {
        "name": "标准合规性",
        "score": 5
      }
    ],
    "pros": [
      "欧特克官方维护开源代码",
      "深度支持 IFC4 规范"
    ],
    "cons": [
      "配置参数相对复杂"
    ],
    "officialUrl": "https://github.com/Autodesk/revit-ifc",
    "verdict": "官方在 GitHub 上持续开源维护的转换工具包, 输出最为严谨和标准, 最适合企业配合验收. "
  },
  {
    "name": "buildingSmart openBIM Exporter Kits",
    "rating": 9.5,
    "metrics": [
      {
        "name": "IfcSpace 保留",
        "score": 4
      },
      {
        "name": "参数完整度",
        "score": 4
      },
      {
        "name": "标准合规性",
        "score": 5
      }
    ],
    "pros": [
      "符合 buildingSmart 认证标准",
      "支持扩展元数据字典"
    ],
    "cons": [
      "学习曲线陡峭"
    ],
    "officialUrl": "https://www.buildingsmart.org/",
    "verdict": "BIM 标准制定组织推荐的转换工具, 具有极高的国际规范适应能力. "
  },
  {
    "name": "BIMcollab Exporter Suite",
    "rating": 9.3,
    "metrics": [
      {
        "name": "IfcSpace 保留",
        "score": 4
      },
      {
        "name": "参数完整度",
        "score": 4.5
      },
      {
        "name": "标准合规性",
        "score": 4
      }
    ],
    "pros": [
      "针对协调配合做了深度参数优化",
      "附带强大的免费 IFC 查阅器"
    ],
    "cons": [
      "与 BIMcollab 云端绑定"
    ],
    "officialUrl": "https://www.bimcollab.com/",
    "verdict": "适合中大型项目在做跨团队碰撞检测 (Clash Detection) 时的专业协同转换方案. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "加载标准 IFC 映射参数表",
    "desc": "在 Revit 导出配置中指定 sharedparameters 映射关系, 确保 RVT 属性精确对齐到 IFC PropertySet 内. "
  },
  {
    "title": "精简族嵌套深度",
    "desc": "导出前剔除复杂的螺栓等非必要家具族, 减少多面体三角网格的堆叠, 防止 IFC 体积突破 G 级. "
  },
  {
    "title": "执行 IFC 架构有效性验证",
    "desc": "导出后一定要使用独立的 IFC 校验工具运行一次格式审计, 确认结构柱, 墙等大分类正确挂载. "
  }
];
const FAQS = [
  {
    "question": "IFC2x3 和 IFC4 格式我该怎么选择? ",
    "answer": "IFC2x3 是目前最为成熟和全行业支持最广的版本; IFC4 在三维几何拟合, 机电管线路由及地形表达上更先进, 但部分老版协同软件可能读取报错. 如无要求, 优先输出 IFC2x3 以保底兼容性. "
  },
  {
    "question": "为什么有些墙体在 IFC 里显示不全或缺失? ",
    "answer": "这多是因为这些构件的 Revit 族类别被指定为了'常规模型 (Generic Models)', 且导出时未勾选'导出常规模型'选项. 请核对构件分类属性. "
  }
];

export default function CloudBimRvtToIfcConverterClient() {
  return (
    <CloudReferralClient
      title="Online Revit RVT to openBIM IFC Standard Converter"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="将 Revit 原生的 RVT 格式交换为 openBIM 开放标准的 IFC (Industry Foundation Classes) 文件时, 最棘手的问题莫过于 Revit 参数字典映射丢失, 空间区域 (IFCSpace) 属性遗失, 以及三维实体变成损坏的多面体 (Polygon Soup) , 导致下游协同系统彻底报废. "
      riskWarning="BIM 模型包含建筑构件细部, 管线路由, 结构钢筋配置及工程总造价等极为敏感的敏感信息. 建议在本地 Revit 客户端中使用官方 IFC 插件进行导出与调试, 绝不推荐通过未知第三方公共云服务器进行在线云端 RVT 解析. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
