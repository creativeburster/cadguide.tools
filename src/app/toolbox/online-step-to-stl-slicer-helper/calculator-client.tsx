'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    name: "FreeCAD (开源本地参数化三维软件)",
    rating: 9.9,
    metrics: [
      { name: "数据安全性", score: 5 },
      { name: "网格控制度", score: 4.5 },
      { name: "易用性", score: 4 }
    ],
    pros: ["完全免费且 100% 离线, 数据安全", "提供详尽的弦偏差 (Chordal Deviation) 与网格划分参数调节"],
    cons: ["界面较传统, 大型装配体解析较慢"],
    officialUrl: "https://www.freecad.org/",
    verdict: "目前最安全, 对网格划分控制力最强的本地平替方案, 强烈推荐用其替代云端上传转换. "
  },
  {
    name: "CAD Exchanger Cloud (专业 3D 格式转换引擎)",
    rating: 9.6,
    metrics: [
      { name: "转化正确率", score: 5 },
      { name: "数据安全性", score: 4.5 },
      { name: "易用性", score: 4.8 }
    ],
    pros: ["行业级 3D 格式转换解析, 曲面过渡平滑", "支持大装配体在线分流预览"],
    cons: ["免费版有月转换额度限制"],
    officialUrl: "https://cadexchanger.com/",
    verdict: "商业级解析的佼佼者. 当您本地没有大型 3D 软件, 但急需还原高精度水密 STL 打印网格时是第一推荐. "
  },
  {
    name: "GrabCAD Print Utility (云端打印管理工具)",
    rating: 9.2,
    metrics: [
      { name: "转化正确率", score: 4 },
      { name: "数据安全性", score: 4 },
      { name: "易用性", score: 4.5 }
    ],
    pros: ["完美对接主流工业 3D 打印机", "支持直接读取 STEP 并自动切片"],
    cons: ["必须安装其桌面客户端软件"],
    officialUrl: "https://grabcad.com/",
    verdict: "3D 打印巨头 Stratasys 旗下的云端打印工具, 适合不需要频繁在 CAD 之间互相导格式, 想直接快速打印 STEP 的创客. "
  }
];

const BEST_PRACTICES = [
  {
    title: "控制弦向偏差 (Chordal Deviation)",
    desc: "导出 STL 时, 弦向偏差设置得越小, 圆弧曲面就越圆润, 但网格量会暴增. 对于普通 FDM 打印, 0.01 - 0.05 mm 即可; 对于光固化 (SLA) , 建议设为 0.005 mm. "
  },
  {
    title: "检查水密性 (Watertightness)",
    desc: "确保导出的 STL 没有悬空破孔和自相交网格 (Non-manifold edge) , 否则 3D 打印切片软件 (如 Cura, PrusaSlicer) 在计算内部填充时会报错. "
  },
  {
    title: "毫米单位一致性 (Unit Alignment)",
    desc: "很多转换器默认将 STEP 中的单位转化为英寸或厘米. 导入切片软件前, 务必确认模型大小是否缩放了 25.4 倍或 10 倍. "
  }
];

const FAQS = [
  {
    question: "为什么 STEP 转换为 STL 后, 原本圆润的螺纹孔变成了多边形? ",
    answer: "这是因为 STEP 中的光滑曲面在离散化 (网格化) 时设定的步长精度太低. 可在 FreeCAD 或 CAD Exchanger 的转换选项中调高'Surface Deviation'或'Maximum Edge Length'. "
  },
  {
    question: "在线转换后的 STL 为什么在 Cura 中打开显示为红色, 无法切片? ",
    answer: "这代表导出的网格不是一个闭合实体, 内部存在缝隙 (通常称为'破面') . 建议在原三维 CAD 中运行'缝合曲面 (Heal/Stitch Surfaces) '后再进行导出. "
  }
];

export default function OnlineStepToStlSlicerHelperClient() {
  return (
    <CloudReferralClient
      title="STEP to Sliced STL Mesh Resolution Cloud Helper"
      subtitle="客观评测与直达: 在线将三维工程格式 (STEP) 转换为适合 3D 打印的 STL 网格. "
      categoryLabel="File Parser & Converter"
      painPointDesc="在 3D 打印与增材制造中, 将高保真的参数化三维 CAD 模型 (STEP 或 STP 格式) 转换为三角网格 (STL 格式) 是必经之路. 普通的在线免费转换器经常会导致曲面网格化粗糙 (圆球变成多面体) , 大装配体转换超时崩溃, 或是丢失实体密合度出现漏孔 (破面) . "
      riskWarning="工业 STEP 模型通常含有精密注塑, 压铸或钣金件的商业机械设计图, 一旦在不知名的公共云转换网站上传, 极易导致专利图纸在服务器端外泄. 推荐使用离线三维建模软件 (如 SolidWorks, Fusion 360, FreeCAD, Blender) 进行本地无损导出, 拒绝上传核心保密结构件. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
