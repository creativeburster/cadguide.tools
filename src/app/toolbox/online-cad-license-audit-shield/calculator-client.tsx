'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Autodesk Licensing Support Tool (Official Diagnostic Utility)",
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
    "verdict": "Official command-line and GUI diagnostic utility from Autodesk for inspecting local licensing services, login tokens, and flexnet configurations."
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
    "verdict": "Uses internal Active Directory Group Policy (GPO) and PowerShell inventory scripts to audit installed CAD versions and license serials across the corporate LAN."
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
    "officialUrl": "https://github.com/crazy-max/WindowsSpyBlocker",
    "verdict": "Enterprise firewall rule set for minimizing outbound CAD telemetry in line with corporate privacy and security policy (e.g. GDPR data minimization)."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Remove unauthorized installations and residual registry keys",
    "desc": "Unauthorized CAD builds frequently bundle malware or tampered DLLs. Use official vendor uninstall utilities to cleanly remove unlicensed installations and reset licensing services."
  },
  {
    "title": "Centralize floating licenses with FLEXlm options files",
    "desc": "Where multi-user network licensing is supported, configure `adskflex.opt` / `solidworks.opt` with `INCLUDE` and `RESERVE` rules to allocate seats strictly to authorized engineering groups."
  },
  {
    "title": "Adopt cost-effective DWG-compatible CAD alternatives for 2D drafting",
    "desc": "For reviewers and occasional 2D drafters, deploying perpetual-license DWG alternatives (such as BricsCAD, ZWCAD, or GstarCAD) or free viewers (DWG TrueView) reduces subscription overhead by up to 70%."
  }
];
const FAQS = [
  {
    "question": "How should IT administrators evaluate a software license compliance inquiry letter?",
    "answer": "Standard outreach letters from regional resellers are often commercial sales inquiries, whereas formal audit notices issued by the software vendor's legal compliance team or BSA counsel require a structured internal Software Asset Management (SAM) reconciliation and legal review."
  },
  {
    "question": "How do software vendors detect unlicensed CAD installations on corporate networks?",
    "answer": "When an unlicensed or modified CAD executable connects to the internet, background crash-reporting and licensing services can log public IP addresses, domain suffixes, and machine identifiers that fail entitlement reconciliation."
  }
];

export default function OnlineCadLicenseAuditShieldClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Software Asset Management (SAM) Self-Check Guide"
      subtitle="Direct navigation to objective in-depth SAM and telemetry-privacy tooling evaluations."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Unscheduled software license compliance audits are often triggered when employees install unauthorized CAD copies on corporate laptops. Implementing proactive Software Asset Management (SAM), endpoint installation controls, and right-sized viewer/alternative licenses keeps engineering teams 100% compliant."
      riskWarning="Software Asset Management (SAM) audits must adhere to applicable copyright laws and enterprise license agreements. This guide provides legitimate IT inventory and license optimization practices to help organizations achieve and maintain full licensing compliance."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
