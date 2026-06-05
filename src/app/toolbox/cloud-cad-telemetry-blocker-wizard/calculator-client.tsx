'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Windows Defender Firewall (官方自带防火墙系统)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "阻断有效性",
        "score": 5
      },
      {
        "name": "系统兼容性",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "操作系统原生，0% 资源占用",
      "配置规则永不失效"
    ],
    "cons": [
      "需要管理员权限进行规则导入"
    ],
    "officialUrl": "https://www.microsoft.com/",
    "verdict": "企业级 IT 进行应用隔离的最权威通道，通过出站规则封禁特定 exe 路径即可阻断任何外连。"
  },
  {
    "name": "Enterprise CAD Hosts Blocker Script",
    "rating": 9.5,
    "metrics": [
      {
        "name": "阻断有效性",
        "score": 4.5
      },
      {
        "name": "系统兼容性",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      }
    ],
    "pros": [
      "一键脚本极速写入 hosts",
      "不影响局域网 FLEXlm 许可"
    ],
    "cons": [
      "域名列表需要定期手动维护"
    ],
    "officialUrl": "https://github.com/",
    "verdict": "通过屏蔽 Autodesk/达索系统的已知遥测网址，对本地网络请求实行零影响的静态阻断，简单纯粹。"
  },
  {
    "name": "Spybot Anti-Beacon (专业系统反监控阻断器)",
    "rating": 9.2,
    "metrics": [
      {
        "name": "阻断有效性",
        "score": 4
      },
      {
        "name": "系统兼容性",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      }
    ],
    "pros": [
      "可视化一键开关多种遥测",
      "支持主流 CAD 与 Office 生态"
    ],
    "cons": [
      "英文界面，部分设置偏极客化"
    ],
    "officialUrl": "https://www.safer-networking.org/",
    "verdict": "老牌系统优化与安全厂商出品的反隐私刺探工具，适合高级管理员对整机进行隐私防御优化。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "一键出站规则设置",
    "desc": "在高级安全 Windows 防火墙中创建新规则：选择“出站”，将程序指向 AutoCAD 目录下的 `AcWebBrowser.exe`，彻底阻止其联网渲染广告。"
  },
  {
    "title": "关闭软件内部收集开关",
    "desc": "进入 CAD ➔ 帮助 ➔ 桌面分析程序（Desktop Analytics Program），取消勾选“允许我们收集使用数据”，从源头减少遥测事件。"
  },
  {
    "title": "配置防盗版法务隔离",
    "desc": "使用专用 hosts 列表屏蔽域名，避免代理商自动化取证工具在局域网内后台静默取证。"
  }
];
const FAQS = [
  {
    "question": "封禁遥测会影响我的网络许可（FLEXlm）使用吗？",
    "answer": "不会。FLEXlm 浮动授权使用的是您局域网服务器的端口（如 27000），而封禁遥测是针对外部互联网服务器域名的阻断，局域网内的许可认证完全不受影响。"
  },
  {
    "question": "封禁后 CAD 为什么提示“无法验证您的许可状态”？",
    "answer": "这代表您误将欧特克官方的云许可验证服务器（如 Named-User 单用户登录认证）也给一并屏蔽了。请检查 hosts 列表，将 identity 相关域名移出。"
  }
];

export default function CloudCadTelemetryBlockerWizardClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Telemetry Blocker Configuration Portal"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="商业 CAD 软件（如 AutoCAD、SolidWorks、Revit）会在后台静默收集用户的使用习惯、电脑 MAC 地址及网络 IP 节点，并通过隐藏的遥测服务（Telemetry Services）定期回传官方服务器。这不仅常导致系统不明原因顿卡，还可能引发误报的反盗版合规审查函。"
      riskWarning="遥测封禁向导仅作为个人及企业 IT 进行安全网络隔离和减少宽带占用的技术参考。请在企业 IT 部门的授权合规边界内使用。本向导生成的 Windows 防火墙阻断规则和 hosts 文件不应被用于对抗合法的正版许可合规性审计。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
