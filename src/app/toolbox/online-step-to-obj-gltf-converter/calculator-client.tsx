'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CAD Exchanger (B-Rep 网格多边形编译器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "多边形化质量",
        "score": 5
      },
      {
        "name": "网格平滑度",
        "score": 5
      },
      {
        "name": "贴图法线保真",
        "score": 4.5
      }
    ],
    "pros": [
      "完美处理大装配体缝合",
      "生成高精度 glTF 格式"
    ],
    "cons": [
      "商业桌面版费用较高"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "业界公认三维几何格式解析力最强的底座程序之一, 其网格化拟合算法极度平滑, 法线无暇. "
  },
  {
    "name": "CAD Assistant (官方免费离线转换程序)",
    "rating": 9.7,
    "metrics": [
      {
        "name": "多边形化质量",
        "score": 4.5
      },
      {
        "name": "网格平滑度",
        "score": 4.5
      },
      {
        "name": "贴图法线保真",
        "score": 5
      }
    ],
    "pros": [
      "OCCT 官方底层, 完全免费",
      "支持拖拽秒开, 完全本地化"
    ],
    "cons": [
      "没有网页版, 需要手动下载"
    ],
    "officialUrl": "https://www.opencascade.com/",
    "verdict": "基于 Open Cascade 核心的免费 3D 查阅和格式转换神器, 无网络上传风险, 安全性一流. "
  },
  {
    "name": "AnyConv STEP to OBJ",
    "rating": 9.1,
    "metrics": [
      {
        "name": "多边形化质量",
        "score": 4
      },
      {
        "name": "网格平滑度",
        "score": 3.5
      },
      {
        "name": "贴图法线保真",
        "score": 4
      }
    ],
    "pros": [
      "浏览器免注册一键转换",
      "处理速度极快"
    ],
    "cons": [
      "对高度嵌套的装配体容易丢失组件树"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "便利的在线多格式转化平台, 适合设计师用来对单个非机密零件进行快速渲染格式转换. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "精细调整弦高公差 (Chordal Deviation)",
    "desc": "多边形化时, 弦高偏差限制决定了圆柱面的面片数. 通常设置 0.05-0.1mm 即可兼顾渲染平滑度和文件大小. "
  },
  {
    "title": "优先选择压缩型 glTF (GLB) 格式",
    "desc": "glTF 格式支持物理渲染材质 (PBR) 且体积远小于 OBJ, 是 WebWebGL 和 VR 开发的最佳首选. "
  },
  {
    "title": "脱网单机 CAD Assistant 倒手",
    "desc": "核心商业结构件的转换需彻底断开外网, 使用 CAD Assistant 纯本地转换. "
  }
];
const FAQS = [
  {
    "question": "转换出来的 OBJ 在 Blender 里有很多破面接缝怎么处理? ",
    "answer": "这多是由于原 STEP 导出时曲面片拓扑未完全缝合 (Sewing) . 建议在 Blender 中选中所有顶点, 执行'合并按距离 (Merge by Distance) '命令进行缝合. "
  },
  {
    "question": "STEP 的 AP203 和 AP214 对网格化有何影响? ",
    "answer": "AP203 不含颜色信息, 网格化后全图呈统一灰白; AP214 完整保留了部件颜色和结构层级, 推荐优先使用 AP214 进行转换. "
  }
];

export default function OnlineStepToObjGltfConverterClient() {
  return (
    <CloudReferralClient
      title="Online STEP to glTF/OBJ Rendering Mesh Converter"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="工业 STEP (AP203/AP214) 格式是基于高度数学逻辑的边界表示法 (B-Rep) 存储的, 其曲面在 WebGL 网页端 (如 Three.js, Babylon.js) 或三维渲染器 (如 Unity, Blender) 中无法直接直接解析渲染. 必须将其多边形化 (Polygonization) 为三角网格格式 (如 OBJ, glTF) . 在重组中, 面片接缝裂开以及网格密度过大卡死网页是常见痛点. "
      riskWarning="工业级 STEP 三维模型涉及极其严密的产品机密设计与几何拓扑. 使用在线网站将 STEP 转换成渲染格式时, 极易被云端后台拦截并泄漏核心机密. 针对绝密部件, 请在本地使用 CAD Assistant 运行离线转换. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
