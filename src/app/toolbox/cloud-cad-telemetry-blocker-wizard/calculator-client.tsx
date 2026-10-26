'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "Windows Defender Firewall (Official built-in firewall system)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "Blocking effectiveness",
        "score": 5
      },
      {
        "name": "System Compatibility",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Native to the operating system, 0% resource usage",
      "Configuration rules never expire"
    ],
    "cons": [
      "Administrator rights are required to import rules"
    ],
    "officialUrl": "https://www.microsoft.com/",
    "verdict": "The standard enterprise IT mechanism for network isolation—restricts outbound connections for specific CAD helper executables via Group Policy firewall rules."
  },
  {
    "name": "Enterprise CAD Hosts Blocker Script",
    "rating": 9.5,
    "metrics": [
      {
        "name": "Blocking effectiveness",
        "score": 4.5
      },
      {
        "name": "System Compatibility",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "One-click script to quickly write hosts",
      "Does not affect LAN FLEXlm licensing"
    ],
    "cons": [
      "The domain name list requires regular manual maintenance"
    ],
    "officialUrl": "https://github.com/crazy-max/WindowsSpyBlocker",
    "verdict": "Routes non-essential background analytics domains to localhost via the system hosts file with zero CPU overhead."
  },
  {
    "name": "Spybot Anti-Beacon (Professional system anti-surveillance blocker)",
    "rating": 9.2,
    "metrics": [
      {
        "name": "Blocking effectiveness",
        "score": 4
      },
      {
        "name": "System Compatibility",
        "score": 4
      },
      {
        "name": "Data Security",
        "score": 4
      }
    ],
    "pros": [
      "Visual toggle interface for Windows and application telemetry settings",
      "Covers common desktop productivity and engineering suites"
    ],
    "cons": [
      "Advanced registry toggles require administrative familiarity"
    ],
    "officialUrl": "https://www.safer-networking.org/",
    "verdict": "Established endpoint privacy utility suited for system administrators hardening air-gapped or restricted engineering workstations."
  }
];
const BEST_PRACTICES = [
  {
    "title": "One-click outbound rule settings",
    "desc": "In Windows Defender Firewall with Advanced Security, create outbound rules for non-essential background web helper processes to reduce idle network traffic."
  },
  {
    "title": "Turn off the internal collection switch of the software",
    "desc": "Navigate to Help -> Desktop Analytics Program inside your CAD application and uncheck 'Allow collection of usage data' to minimize background telemetry at the source."
  },
  {
    "title": "Configure telemetry isolation per privacy policy",
    "desc": "Limit outbound telemetry domains via a managed hosts list, in line with corporate data-minimization and privacy requirements (e.g. GDPR)."
  }
];
const FAQS = [
  {
    "question": "Will blocking telemetry affect my network license (FLEXlm) usage? ",
    "answer": "No. On-premise FLEXlm/FlexNet floating licenses communicate over local intranet ports (typically TCP 27000–27009). Restricting external analytics domains does not affect LAN license checkouts."
  },
  {
    "question": "Why does CAD prompt 'Unable to verify your license status' after applying firewall rules?",
    "answer": "This indicates that the firewall or hosts rule inadvertently blocked the vendor's identity and subscription licensing endpoints (required for Named-User OAuth authentication). Whitelist official authentication domains to restore sign-in verification."
  }
];

export default function CloudCadTelemetryBlockerWizardClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Telemetry Privacy Configuration Portal"
      subtitle="Direct navigation to objective in-depth telemetry-privacy and network-isolation tooling."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Commercial CAD suites run background desktop analytics and Customer Experience Improvement Program (CEIP) services that periodically transmit command usage logs and hardware diagnostics. On restricted or high-security engineering networks, administrators often need to minimize non-essential outbound traffic to comply with internal data governance and GDPR policies."
      riskWarning="This network configuration reference is intended solely for legitimate enterprise IT administration, VDI bandwidth optimization, and GDPR data-minimization compliance. Firewall and DNS rules must never be used to circumvent valid software license agreements."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
