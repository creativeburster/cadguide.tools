'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD Recover Utility (官方内置修复指令)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "修复精准度",
        "score": 5
      },
      {
        "name": "数据安全性",
        "score": 5
      },
      {
        "name": "易用性",
        "score": 5
      }
    ],
    "pros": [
      "本地执行无连网风险",
      "完美重建原图图层表"
    ],
    "cons": [
      "对严重损坏首部的文件修复率一般"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "开图报错时的第一道修复防线，完全离线执行，是工程人员必须掌握的原生命令。"
  },
  {
    "name": "AnyDWG Recovery Tool",
    "rating": 9.5,
    "metrics": [
      {
        "name": "修复精准度",
        "score": 4.5
      },
      {
        "name": "数据安全性",
        "score": 4.5
      },
      {
        "name": "易用性",
        "score": 4
      }
    ],
    "pros": [
      "支持批量图纸排队修复",
      "重建算法脱离 CAD 独立运行"
    ],
    "cons": [
      "商业版需要付费"
    ],
    "officialUrl": "https://anydwg.com/",
    "verdict": "高性能的第三方独立图纸修复方案，当本地 CAD 因为严重错误崩溃而无法运行 RECOVER 时是极佳平替。"
  },
  {
    "name": "CADSoftTools Recovery Service",
    "rating": 9.1,
    "metrics": [
      {
        "name": "修复精准度",
        "score": 4
      },
      {
        "name": "数据安全性",
        "score": 4
      },
      {
        "name": "易用性",
        "score": 4.5
      }
    ],
    "pros": [
      "云端一键在线重构",
      "免安装免注册"
    ],
    "cons": [
      "大文件上传速度受网速限制"
    ],
    "officialUrl": "https://cadsofttools.com/",
    "verdict": "老牌 CAD 格式解析商提供的在线应急通道，适合临时急需开图的普通非涉密草纸处理。"
  }
];
const BEST_PRACTICES = [
  {
    "title": "启用备份文件恢复法",
    "desc": "检查您在 CAD 选项中设置的自动保存目录，寻找同名的 `.bak` 或 `.sv$` 文件，将后缀强制改名为 `.dwg`，往往能找回 99% 的进度。"
  },
  {
    "title": "使用 INSERT 块置入法",
    "desc": "如果 RECOVER 失败，尝试在空白图纸中输入 `-INSERT` 命令，将损坏图纸作为“外部块”强行塞入新图中，常常能绕过首部损坏。"
  },
  {
    "title": "本地运行 PURGE 净化",
    "desc": "修复成功后，立刻在命令行执行 `PURGE` 和 `AUDIT` 命令，彻底擦除导致损坏的注册表垃圾图元。"
  }
];
const FAQS = [
  {
    "question": "“图形文件无效”一般是什么原因造成的？",
    "answer": "这通常是由于断电、CAD 异常闪退、存盘未完成导致的二进制截断，或是用低版本 CAD 强行读取未降级的高版本图纸。"
  },
  {
    "question": "为什么修复后，我的图纸图层颜色全变成了白色？",
    "answer": "这代表图纸内的层表数据库（Layer Table）元数据已彻底崩塌。修复算法为了保全几何线段，将其强行挂载在了 0 图层上，您需要手动重新整理图层。"
  }
];

export default function CloudDwgDrawingRecoveryServiceClient() {
  return (
    <CloudReferralClient
      title="Online Damaged DWG Drawing Recovery & Repair Portal"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="当您开图时遭遇“图形文件无效 (Drawing file is not valid)”错误，或者 CAD 在加载特定图块时闪退，往往意味着 DWG 内部的数据库节点或文件首部已严重损坏。本地内置的 RECOVER (修复) 命令经常失效，此时需要评估高效的云端或本地重建服务。"
      riskWarning="损坏图纸往往属于正进行的项目，内含大量商业与设计核心信息。不要轻易在安全性不明的公共修复网站上传涉密图纸。对于核心数据，推荐使用本地物理隔离电脑运行安全修复，或尝试恢复临时自动保存的备份文件（.sv$）。"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
