'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "SketchUp Pro Native Export (官方原生桌面导出)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "UV贴图映射",
        "score": 5
      },
      {
        "name": "装配体层次",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "官方原生底层贴图解包",
      "完美保留两面贴图（Double-sided）"
    ],
    "cons": [
      "需要商业桌面版授权"
    ],
    "officialUrl": "https://www.sketchup.com/",
    "verdict": "最完美的 FBX 导出方案。通过内置的导出配置面板可精确控制轴向、相机和材质贴图的打包输出。"
  },
  {
    "name": "SimLab SKP to FBX Plugin (专业渲染桥梁插件)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "UV贴图映射",
        "score": 5
      },
      {
        "name": "装配体层次",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "针对虚幻引擎优化了面数结构",
      "支持保留 PBR 材质节点"
    ],
    "cons": [
      "需要作为插件安装且商业版收费"
    ],
    "officialUrl": "https://www.simlab-soft.com/",
    "verdict": "达索和舞美效果图设计团队最推崇的转化插件，对材质贴图映射（UV coordinates）的对齐质量最顶尖。"
  },
  {
    "name": "AnyConv SKP to FBX",
    "rating": 9,
    "metrics": [
      {
        "name": "UV贴图映射",
        "score": 3.5
      },
      {
        "name": "装配体层次",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "免登录拖拽即转",
      "处理速度极快"
    ],
    "cons": [
      "大范围场景转换时贴图可能发白缺失"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "适合设计师在出差或非工作电脑上对单个轻量级三维组进行临时的格式转换。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "清理冗余材质和组件",
    "desc": "导出前，在 SketchUp 窗口 ➔ 模型信息 ➔ 统计信息中点击“清除未使用项 (Purge Unused)”，可减小 FBX 50% 以上的体积。"
  },
  {
    "title": "检查正反面材质贴图",
    "desc": "SketchUp 支持在物体的反面（Back face）贴图，但 FBX 默认只渲染正面。导出前将反面贴图反转（Reverse Faces）为正面，防止导入渲染器后贴图消失变黑。"
  },
  {
    "title": "脱网单机 native 导出",
    "desc": "企业大型项目方案的 FBX 转换必须完全在本地 SketchUp 客户端离线操作。"
  }
];
const FAQS = [
  {
    "question": "转换出的 FBX 导入 Unity 为什么全图比例变小了 100 倍？",
    "answer": "这是因为 SketchUp 默认采用“英寸 (Inches)”作为底层系统单位。导出 FBX 时，在 Options 中必须将单位强制指定为“米 (Meters)”或“毫米 (Millimeters)”。"
  },
  {
    "question": "为什么导出的模型树组件名称全是拼音或特殊乱码？",
    "answer": "FBX 格式在老版本驱动中对 Unicode 中文字符支持有限。建议在导出前，将 SketchUp 中的“组件（Components）”和“群组（Groups）”命名全部替换为英文或拼音。"
  }
];

export default function OnlineSkpToFbxCloudConverterClient() {
  return (
    <CloudReferralClient
      title="Online SketchUp SKP to FBX Render Mesh Converter"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="File Parser & Converter"
      painPointDesc="将 SketchUp（SKP）设计的建筑或景观模型导入到高端渲染器（如 Twinmotion, Lumion, Unreal Engine）中时，直接导入 SKP 往往会导致 UV 贴图坐标发生严重错位、材质折射参数丢失以及复杂嵌套组件打散崩塌。转换成带有高保真材质贴图包（Textures）的 FBX 网格是业界标准方案。"
      riskWarning="建筑设计与效果图场景（SKP）包含企业的设计机密和客户布局信息。商业云端转换工具可能会保存并泄露这些设计细节。为了防范商业风险，建议优先使用 SketchUp Pro 桌面版自带的“导出 3D 模型”功能，完全在本地单机导出。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
