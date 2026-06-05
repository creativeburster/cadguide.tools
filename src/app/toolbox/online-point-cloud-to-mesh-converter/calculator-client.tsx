'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CloudCompare (开源本地/云处理利器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "重组精准度",
        "score": 5
      },
      {
        "name": "数据吞吐力",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "完全开源免费",
      "顶级降噪和网格泊松重建算法"
    ],
    "cons": [
      "界面略显陈旧, 有一定学习门槛"
    ],
    "officialUrl": "https://www.danielgm.net/cc/",
    "verdict": "全球学术界和工程界公认的顶级点云处理基石, 其网格化重建 (Poisson Reconstruction) 保真度最高. "
  },
  {
    "name": "MeshLab (专业网格三角化工作台)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "重组精准度",
        "score": 4.5
      },
      {
        "name": "数据吞吐力",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "支持大范围网格编辑修补",
      "丰富的纹理映射算法"
    ],
    "cons": [
      "处理超大几十G点云时容易崩溃"
    ],
    "officialUrl": "https://www.meshlab.net/",
    "verdict": "经典的开源三维网格处理中心, 对转换后的三角网络做光滑处理, 减面优化是其核心优势. "
  },
  {
    "name": "Autodesk ReCap Pro Cloud Services",
    "rating": 9.2,
    "metrics": [
      {
        "name": "重组精准度",
        "score": 4
      },
      {
        "name": "数据吞吐力",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "完美无缝对齐 Civil 3D 与 Revit",
      "云端自动化集群渲染"
    ],
    "cons": [
      "需要高级订阅套餐, 性价比一般"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "欧特克生态下的测绘点云处理工具, 支持将照片和扫描点云批量转换并在 CAD 软件中做参照. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "执行本地分层稀疏化 (Decimation)",
    "desc": "在网格化之前, 对点云以指定空间步长 (如 10mm) 进行均值采样稀疏化, 剔除 90% 重复空间点, 保留关键轮廓即可. "
  },
  {
    "title": "泊松表面重建 (Poisson Reconstruct)",
    "desc": "重建参数中的 Octree Depth (八叉树深度) 决定了重建精度. 建议设置在 8-10 之间, 过大容易耗光显存. "
  },
  {
    "title": "使用隔离物理工作站",
    "desc": "国家级地理测绘数据严禁上网, 必须使用专机专线进行本地离线计算. "
  }
];
const FAQS = [
  {
    "question": "转换出来的网格模型为什么有大量破洞和飞线? ",
    "answer": "这代表点云在扫描时存在阴影死角. 需要在 MeshLab 中执行'封闭孔洞 (Close Holes)'和'清理孤立图元 (Remove Isolated Pieces)'等网格修补命令. "
  },
  {
    "question": "LAS 和 PTS 格式在数据上有何不同? ",
    "answer": "LAS 是美国摄影测量与遥感协会制定的二进制测绘格式, 保留了激光反射强度, GPS 时间等元数据; PTS/XYZ 是纯文本坐标格式, 读取相对较慢. "
  }
];

export default function OnlinePointCloudToMeshConverterClient() {
  return (
    <CloudReferralClient
      title="Online Point Cloud (LAS/PTS) to Watertight Mesh Converter"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="激光雷达扫描获取的亿万点云坐标数据 (LAS/PTS/XYZ) , 如果直接载入普通建模软件, 很容易导致运行内存直接撑爆. 因此, 我们需要通过云端算法对点云进行降噪, 精简, 并重建为由三角面片构成的封闭几何网格 (Watertight Mesh, 如 OBJ, DXF, STL) . "
      riskWarning="测绘及三维扫描数据 (如地形图, 历史古建数字化扫描, 敏感国防厂区等) 属于高度受限数据. 请确保上传的云平台符合国家数据出境合规标准, 高密项目请全部在本地局域网集群上使用开源的 CloudCompare 进行处理. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
