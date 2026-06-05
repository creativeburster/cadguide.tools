'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CAD Exchanger (业界公认 3D 转换器)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "拓扑拟合度",
        "score": 5
      },
      {
        "name": "数据还原度",
        "score": 5
      },
      {
        "name": "格式丰富度",
        "score": 4
      }
    ],
    "pros": [
      "B-Rep 拓扑拓扑重构极准",
      "完美保留曲面曲率"
    ],
    "cons": [
      "商业桌面版费用较高"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "专业的工程数据交换核心引擎, 对三维实体内核 (Parasolid, ACIS) 转换算法调优极高. "
  },
  {
    "name": "Autodesk Fusion (官方集成通道)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "拓扑拟合度",
        "score": 4
      },
      {
        "name": "数据还原度",
        "score": 5
      },
      {
        "name": "格式丰富度",
        "score": 4
      }
    ],
    "pros": [
      "云端原生解析 DWG 实体",
      "一键导出 AP214 STEP"
    ],
    "cons": [
      "需要加载云账号且速度受网速限制"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "欧特克云端建模平台, 拥有处理自身 DWG 3D 数据库的先天优势. "
  },
  {
    "name": "GrabCAD Workbench Translators",
    "rating": 9.2,
    "metrics": [
      {
        "name": "拓扑拟合度",
        "score": 4
      },
      {
        "name": "数据还原度",
        "score": 4
      },
      {
        "name": "格式丰富度",
        "score": 3.5
      }
    ],
    "pros": [
      "完全免费的协作空间",
      "集成大型装配体解析"
    ],
    "cons": [
      "对非常旧的 IGES 格式支持有限"
    ],
    "officialUrl": "https://grabcad.com/",
    "verdict": "优秀的免费工业级 3D 托管和翻译平台, 适合工程师之间日常工程文件的无障碍对齐. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "剔除二维投影线",
    "desc": "在导出 3D DWG 前, 删掉所有的 2D 轮廓布局, 尺寸线以及文字批注, 仅保留纯三维实体 (Solid) 以减少几何冗余. "
  },
  {
    "title": "优先选择 STEP 格式",
    "desc": "STEP 格式相比 IGES 具有更完美的实体装配结构信息, 并能精准锁定零件颜色与面与面的拓扑缝合 (Sewing) . "
  },
  {
    "title": "核对公差漂移",
    "desc": "对于配合面, 请在导入 SolidWorks 后进行'几何检查', 防止转换过程中发生公差漂移 (Tolerance Drift) . "
  }
];
const FAQS = [
  {
    "question": "转换出来的 3D 实体变成空心壳子了怎么办? ",
    "answer": "这通常是由于原 3D DWG 中使用了表面网格 (Mesh/Surface) 而不是实体 (Solid) 建模. 如果是片体导入, 需要运行'缝合曲面 (Sew Surface) '命令将空心面重构为封闭实体. "
  },
  {
    "question": "STEP AP203 和 AP214 有什么区别? ",
    "answer": "AP203 仅保留三维空间几何坐标和结构; AP214 在此基础上额外支持颜色, 图层定义以及复杂的尺寸标注 (GD&T) . 推荐优先采用 AP214 格式. "
  }
];

export default function CloudDwgToStepIgesConverterClient() {
  return (
    <CloudReferralClient
      title="Online 3D DWG to STEP/IGES CAD Translator"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="将包含 3D 实体的 DWG 图纸导入机械三维 CAD (如 SolidWorks, Creo) 或用于 CNC 制造 (如 Mastercam) 时, 需要将其翻译为通用的 STEP (AP203/AP214) 或 IGES 几何表达. 普通多边形转换往往将曲面变成了粗糙的三角网格 (Mesh) , 使得工业加工精度报废. "
      riskWarning="机械三维模型 (如核心模具, 机加工零件) 是企业绝密知识产权. 在上传至云端进行 3D B-Rep (边界表示法) 数据转换时, 要特别防范数据泄露与商业秘密流失. 对于高精度零部件, 请务必使用本地 CAD 转换插件. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
