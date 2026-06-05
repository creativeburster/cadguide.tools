'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Viewer (欧特克官方云看图)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "渲染保真度",
        "score": 5
      },
      {
        "name": "剖切测量力",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "支持超 80 种工程格式",
      "完全保留参数属性层次树"
    ],
    "cons": [
      "不支持实时双向在线批注对讲"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "完全免费且最强大的在线 WebGL 看图平台, 其 Forge/APS 引擎对各类 3D 格式图纸拟合程度无与伦比. "
  },
  {
    "name": "GrabCAD Viewer / Workbench",
    "rating": 9.5,
    "metrics": [
      {
        "name": "渲染保真度",
        "score": 4
      },
      {
        "name": "剖切测量力",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "集成了社区版本控制",
      "尺寸测量精度极佳"
    ],
    "cons": [
      "需要登录且对移动端性能要求高"
    ],
    "officialUrl": "https://grabcad.com/",
    "verdict": "机械设计师最爱的免费协同看板, 对大型 SLDASM 或 STEP 结构的加载平滑度极高. "
  },
  {
    "name": "SketchUp Viewer for Web",
    "rating": 9.2,
    "metrics": [
      {
        "name": "渲染保真度",
        "score": 4
      },
      {
        "name": "剖切测量力",
        "score": 3.5
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "网页端秒开 SKP 场景",
      "自带场景样式与阴影调整"
    ],
    "cons": [
      "对 SolidWorks 等工业装配支持一般"
    ],
    "officialUrl": "https://www.sketchup.com/",
    "verdict": "专为景观, 家装及舞美设计师提供的云端方案, 完美同步图层可见性与场景页面. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "务必启用分享链接失效机制",
    "desc": "在向客户分享 WebGL 视角链接时, 请务必设置访问有效期 (如 7 天后失效) 以及防下载保护. "
  },
  {
    "title": "轻量化减面后再上传",
    "desc": "对于极大的机械零件, 上传前建议在本地运行'降噪 (Simplify Mesh) '处理, 去除无谓的螺纹, 齿轮细部以防止网页崩溃. "
  },
  {
    "title": "禁止未授权外部索引",
    "desc": "企业共享平台需配置 robots.txt 及访问权限策略, 彻底屏蔽搜索引擎的探测. "
  }
];
const FAQS = [
  {
    "question": "网页旋转模型时画面闪烁卡顿怎么解决? ",
    "answer": "这多是因为您的浏览器没有开启硬件加速, 导致 WebGL 处于 CPU 软解渲染状态. 建议在 Chrome 设置 ➔ 系统中勾选'使用硬件加速'. "
  },
  {
    "question": "为什么装配体导入后很多零件显示缺失? ",
    "answer": "像 SolidWorks 的 `.sldasm` 装配体文件本身不含几何实体, 而是引用了同级目录下的 `.sldprt` 零件. 您需要将整个装配体和所有引用的零件文件打包成 `.zip` 压缩包一并上传解析. "
  }
];

export default function Online3dCadViewerCollaboratorClient() {
  return (
    <CloudReferralClient
      title="Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="与客户或团队共享复杂的 3D CAD 装配体 (如 CATIA, NX, SolidWorks, STEP) 或 Revit BIM 模型进行现场评审时, 普通用户电脑往往没有专业建模软件. 利用云端 WebGL 3D 浏览器, 可以免安装加载大型模型, 实现在线旋转, 剖切, 红线标注与尺寸测量. "
      riskWarning="3D CAD 装配体包含零部件的所有加工尺寸, 内部拓扑与工程装配链接. 将这些文件直接上传到不知名的云端看图网站, 很容易遭遇'数据脱水拦截'和商业盗取. 推荐使用具有企业安全权限管控和动态水印加密的高端协作平台. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
