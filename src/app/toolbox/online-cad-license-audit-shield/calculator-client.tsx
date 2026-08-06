'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Licensing Support Tool (Official copyright self-examination procedure)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Self-check accuracy",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Deployment ease",
        "score": 5
      }
    ],
    "pros": [
      "Officially provided, one-click generation of global reports",
      "Accurately flag all unauthorized installations"
    ],
    "cons": [
      "Requires online submission for partial verification"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "The official compliance scanning diagnostic assistant can accurately display which machines in the corporate network are in violation activation status.. "
  },
  {
    "name": "Enterprise SAM Checklist (Enterprise Software Asset Audit Checklist)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Self-check accuracy",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      },
      {
        "name": "Deployment ease",
        "score": 4.5
      }
    ],
    "pros": [
      "100% LAN offline verification",
      "Runs entirely on the intranet, no external scanning"
    ],
    "cons": [
      "Manual census terminal is required"
    ],
    "officialUrl": "https://www.microsoft.com/",
    "verdict": "The most reliable security solution at present. Through domain control (Group Policy) Script queries installed CAD registry keys on the intranet. "
  },
  {
    "name": "CAD Telemetry Privacy Script",
    "rating": 9.3,
    "metrics": [
      {
        "name": "Self-check accuracy",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4.5
      },
      {
        "name": "Deployment ease",
        "score": 4.5
      }
    ],
    "pros": [
      "Limits outbound CAD telemetry per corporate privacy policy",
      "Reduces background network noise on managed fleets"
    ],
    "cons": [
      "Rules need to be constantly adjusted based on software updates"
    ],
    "officialUrl": "https://github.com/",
    "verdict": "Enterprise firewall rule set for minimizing outbound CAD telemetry in line with corporate privacy and security policy (e.g. GDPR data minimization). "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Completely uninstall piracy in one click on the intranet",
    "desc": "Crack patches for pirated software often contain Trojans and backdoors. Use official and exclusive ones. Uninstall Helper Completely clear registry remnants and licensing lock files. "
  },
  {
    "title": "Deploy FLEXlm authorization pool for unified quota",
    "desc": "Replace Named-User with a formal authorization server, and `options.opt` In-file configuration retention (RESERVE) policy, Restrict installation by unauthorized departments. "
  },
  {
    "title": "Unified use of alternative CAD to reduce compliance costs",
    "desc": "For design positions that do not use CAD modeling frequently, Unified purchase of highly cost-effective replacement software such as Haochen or Zhongwang CAD, Can directly reduce 80% of the financial pressure on genuine products. "
  }
];
const FAQS = [
  {
    "question": "Copyright verification letter sent by the agent'Is it legally binding? ",
    "answer": "Most regular letters are commercial purchase letters (Sales Pitch) sent by distribution agents, with the purpose of urging you to purchase genuine products.; However, if you receive a formal lawyer's letter from a law firm'Or an official letter containing an intranet detailed illegal MAC address evidence collection form, It indicates that the evidence collection has been completed and needs to be taken seriously and an intranet self-examination must be carried out.. "
  },
  {
    "question": "How did the agent know that our company was using pirated CAD?? ",
    "answer": "When a local pirated CAD or plug-in is launched while connected to the Internet, The built-in telemetry module automatically records your public IP and computer MAC address, and sent back to the official compliance database. Once the public IP is matched, it is not in the company's list of genuine purchases., The order will be automatically dispatched to the local agent for follow-up. "
  }
];

export default function OnlineCadLicenseAuditShieldClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Software Asset Management (SAM) Self-Check Guide"
      subtitle="Direct navigation to objective in-depth SAM and telemetry-privacy tooling evaluations. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Many enterprise IT departments often face problems due to individual employees downloading and installing cracked versions of software without permission., and unexpectedly received an Autodesk or SolidWorks The problem of legal copyright compliance audit letters sent by agents. This usually leads to high repurchase fines and litigation disputes. SAM Administrators need to complete self-examination and remediation before any letter arrives. "
      riskWarning="Enterprise anti-piracy compliance self-examination must comply with national intellectual property laws and company SAM management boundaries. This guide only provides IT compliance white paper technical solutions for asset self-examination and limiting the monitoring of irrelevant domain names., Should not be used to cover up any known violations. Corporate legalization is the only legal path to long-term development. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
