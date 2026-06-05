'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "ODA File Converter (官方数据转换程序)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "转换精确度",
        "score": 5
      },
      {
        "name": "批量吞吐力",
        "score": 5
      },
      {
        "name": "安全性",
        "score": 5
      }
    ],
    "pros": [
      "纯本地离线执行",
      "完全开源免费且跨平台"
    ],
    "cons": [
      "需要下载客户端, 命令行参数需要配置"
    ],
    "officialUrl": "https://www.opendesign.com/",
    "verdict": "业内最严谨的图纸格式互转基石, 对 DWG / DXF 各个大版本的转换结果数据最纯净, 无任何冗余垃圾字典. "
  },
  {
    "name": "Any DWG DXF Converter",
    "rating": 9.6,
    "metrics": [
      {
        "name": "转换精确度",
        "score": 4.5
      },
      {
        "name": "批量吞吐力",
        "score": 5
      },
      {
        "name": "安全性",
        "score": 4.5
      }
    ],
    "pros": [
      "独立的 Windows 小程序",
      "拖拽支持上千个文件排队"
    ],
    "cons": [
      "软件界面偏老, 商业版需付费"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "老牌转换小工具, 支持双向一键互转, 速度和批量性能经过工程考验, 稳定高效. "
  },
  {
    "name": "Convertio (万能云转换器)",
    "rating": 9.1,
    "metrics": [
      {
        "name": "转换精确度",
        "score": 4
      },
      {
        "name": "批量吞吐力",
        "score": 4
      },
      {
        "name": "安全性",
        "score": 3
      }
    ],
    "pros": [
      "免去下载, 浏览器一键运行",
      "支持批量并发任务"
    ],
    "cons": [
      "免费版单文件大小受限"
    ],
    "officialUrl": "https://convertio.co/",
    "verdict": "大名鼎鼎的通用格式转换云服务, 在转化轻量级二维工程图时, 出图效率极快. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "优先选择 ASCII DXF 格式",
    "desc": "如果转换是为了后期进行 Python 脚本分析或文字提取, 请在转换配置中指定输出为 ASCII 编码的 DXF. "
  },
  {
    "title": "本地 AutoLISP 批量处理",
    "desc": "可直接在 CAD 里加载脚本: 在命令行输入 `(foreach dwg (list ...) (command \"_SAVEAS\" \"DXF\" ...))` 运行全自动本地降级转换. "
  },
  {
    "title": "限制外网脚本回传",
    "desc": "使用带防遥测配置的企业防火墙, 屏蔽不必要的端口, 防范合规侦测. "
  }
];
const FAQS = [
  {
    "question": "DXF 的二进制 (Binary) 与文本 (ASCII) 格式有什么区别? ",
    "answer": "ASCII 格式是纯文本文件, 虽然体积大, 但可用记事本直接读取和修改数据; Binary 格式经过压缩, 文件体积小, 读取载入速度更快, 但无法直接用文本方式编辑. "
  },
  {
    "question": "为什么互转后, 图纸里的动态块无法编辑? ",
    "answer": "有些动态块信息属于 AutoCAD 专有的高层类 (ArRx) . 转换成 DXF 时, 若版本太低, 数据库会退化它们, 导致再次导入后丧失滑块等拉伸手柄. "
  }
];

export default function OnlineDwgToDxfBatchConverterClient() {
  return (
    <CloudReferralClient
      title="Online Bulk DWG / DXF Format Mutual Converter"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="File Parser & Converter"
      painPointDesc="对于需要导入非 AutoCAD 绘图系统, 激光切板软件或开展自定义脚本读取的用户而言, DWG 这个闭源的二进制数据库非常难以直接提取. 将其批量且安全地转换为开放的 ASCII/Binary DXF 格式是解决行业互联的通用桥梁. 但在转换中, 文字编码破损和线型失效非常高频. "
      riskWarning="批量转换代表着图纸资产的集中处理, 极易在打包上传时被外部抓取工具进行服务器日志拦截. 对于涉及敏感商业机密的图纸集群, 应完全规避在线公共云转换, 建议通过编写本地 AutoLISP 脚本命令自动在本地调用 ODA 文件转换器. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
