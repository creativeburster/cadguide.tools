'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "eDrawings Viewer (达索系统官方免激活看图器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "图纸还原度",
        "score": 5
      },
      {
        "name": "三维测量度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "官方底层数据库引擎",
      "支持导出自解压的可执行EXE文件"
    ],
    "cons": [
      "需要下载客户端, 体积约几百MB"
    ],
    "officialUrl": "https://www.solidworks.com/",
    "verdict": "达索系统官方出品的看图与分发利器, 最权威, 100% 还原曲面贴图及动态运动副. "
  },
  {
    "name": "Autodesk Viewer (官方多格式浏览器)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "图纸还原度",
        "score": 4.5
      },
      {
        "name": "三维测量度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "支持超大规模装配包在线解压",
      "支持 Web 标注"
    ],
    "cons": [
      "必须登录 Autodesk 账号"
    ],
    "officialUrl": "https://viewer.autodesk.com/",
    "verdict": "欧特克云端看图器对于达索格式的兼容极为完美, 也是免装软件查看 sldprt 的极佳方案. "
  },
  {
    "name": "CAD Exchanger Web SDK",
    "rating": 9.3,
    "metrics": [
      {
        "name": "图纸还原度",
        "score": 4
      },
      {
        "name": "三维测量度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "极速加载 WebGL 层",
      "支持在移动端快速切图"
    ],
    "cons": [
      "高级协作功能需集成购买"
    ],
    "officialUrl": "https://cadexchanger.com/",
    "verdict": "对工业级三维格式解析透彻, 适合团队做敏捷开发集成. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "装配体打包压缩上传",
    "desc": "SolidWorks 装配体 (sldasm) 不含几何数据. 请使用'打包 (Pack and Go)'功能, 将装配体及其关联的全部零件 (sldprt) 收录至一个 .zip 包中上传. "
  },
  {
    "title": "本地清除螺纹等高模特征",
    "desc": "在分享或上传前, 在本地压缩去除螺纹, 齿轮和细微紧固件的详细特征, 将模型轻量化, 防止看图网页直接内存溢出闪退. "
  },
  {
    "title": "屏蔽外链数据监听",
    "desc": "确保检测环境不泄露 IP 与企业域, 防范版权代理商的主动遥测定位. "
  }
];
const FAQS = [
  {
    "question": "为什么导入后模型呈现'灰白色'且材质丢失? ",
    "answer": "这代表您的 sldprt 在保存时没有把材质贴图库 (Texture Maps) 固化至文件中, 或者引用的外观图片路径丢失. 在上传打包时, 确保将材质资源也选上. "
  },
  {
    "question": "eDrawings 能否支持测量装配间隙? ",
    "answer": "能. 官方 viewer 提供专门的测量测量 (Measure) 指令, 只需在 WebGL 中点击两个相对面, 它会自动计算最小中心距, 法线距离和投影偏角. "
  }
];

export default function OnlineSolidworksEDrawingsCloudViewerClient() {
  return (
    <CloudReferralClient
      title="Online SolidWorks eDrawings (SLDPRT/SLDASM) Viewer"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="当您需要向客户或工厂发包 SolidWorks 零件 (.sldprt) 或装配体 (.sldasm) 时, 安装大型商业 CAD 软件非常不便. 利用在线 eDrawings 渲染层, 用户可以直接在浏览器 WebGL 中浏览三维实体, 查看装配层次树 (Component Tree) , 隐藏/显示构件以及测量关键配合面间距. "
      riskWarning="三维零件图纸包含完整的参数特征树与公差工艺. 上传到公共未知看图平台可能会触发商业遥测以及泄漏核心知识产权. 针对敏感装配体, 请引导用户下载达索系统官方免费的 eDrawings Viewer 本地版, 严禁使用非合规的云看图网站. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
