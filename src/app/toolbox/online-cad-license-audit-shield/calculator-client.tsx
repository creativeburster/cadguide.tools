'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Licensing Support Tool (官方版权自查程序)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "自查准确度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "部署便捷度",
        "score": 5
      }
    ],
    "pros": [
      "官方提供, 一键生成全局报表",
      "准确标出所有无授权的安装"
    ],
    "cons": [
      "需要联网提交部分验证"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "官方提供的合规扫描诊断助手, 能精准显示企业网络中哪些机器处于违规激活状态. "
  },
  {
    "name": "Enterprise SAM Checklist (企业软件资产审计清单)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "自查准确度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "部署便捷度",
        "score": 4.5
      }
    ],
    "pros": [
      "100% 局域网离线核对",
      "规避外部域名扫描取证"
    ],
    "cons": [
      "需要手动普查终端"
    ],
    "officialUrl": "https://www.microsoft.com/",
    "verdict": "目前最稳妥的安全方案. 通过域控 (Group Policy) 脚本查询内网中已安装的 CAD 注册表项. "
  },
  {
    "name": "CAD Telemetry Shield Script",
    "rating": 9.3,
    "metrics": [
      {
        "name": "自查准确度",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4.5
      },
      {
        "name": "部署便捷度",
        "score": 4.5
      }
    ],
    "pros": [
      "自动阻断网络静默回传",
      "防范代理商无预警端口扫描"
    ],
    "cons": [
      "需要根据软件更新不断调整规则"
    ],
    "officialUrl": "https://github.com/",
    "verdict": "针对外网抓取数据进行过滤的企业级网络屏蔽规则包, 能够防止代理商通过抓取 MAC 和 IP 取证. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "内网一键彻底卸载盗版",
    "desc": "盗版软件破解补丁常含有木马和后门, 使用官方专用的 Uninstall Helper 彻底清除注册表残余及 licensing 锁文件. "
  },
  {
    "title": "部署 FLEXlm 授权池进行统一配额",
    "desc": "用正规授权服务器取代 Named-User, 并在 `options.opt` 文件中配置保留 (RESERVE) 策略, 限制非授权部门安装. "
  },
  {
    "title": "统一使用平替 CAD 以降低合规成本",
    "desc": "对非高频使用 CAD 建模的设计岗, 统一采购浩辰或中望 CAD 等性价比极高的平替软件, 可直接降低 80% 的正版化资金压力. "
  }
];
const FAQS = [
  {
    "question": "代理商发来的'版权核对函'有法律效力吗? ",
    "answer": "大多数常规的函件是由分销代理商发出的商业劝购信 (Sales Pitch) , 目的是促使您购买正版; 但若收到来自律所的正式'律师函'或包含内网详细违规 MAC 地址取证表格的公函, 则表明取证已完成, 需严肃对待并开展内网自查. "
  },
  {
    "question": "代理商是怎么知道我们公司使用了盗版 CAD 的? ",
    "answer": "当本地盗版 CAD 或插件在连网状态下启动时, 内置的遥测模块会自动记录您的公网 IP 及电脑 MAC 地址, 并发送回官方合规数据库. 一旦匹配到该公网 IP 未在企业购买正版名单中, 就会自动派单给当地代理商跟进. "
  }
];

export default function OnlineCadLicenseAuditShieldClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Software Anti-Piracy Audit Shield Guide"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="许多企业 IT 部门常面临由于个别员工私自下载安装破解版软件, 而意外收到 Autodesk 或 SolidWorks 代理商发来的法务版权合规审计信的难题. 这通常会面临高昂的补买罚款与诉讼纠纷. SAM 管理员需要在收到信函前完成自查与防御阻断. "
      riskWarning="企业反盗版合规自查必须遵循国家知识产权法律和公司SAM管理边界. 本指南仅提供资产自查及限制无关域名监听的IT合规白皮书技术方案, 不应用于掩盖任何已知违规行为. 企业正版化是长远发展的唯一合法之路. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
