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
    "verdict": "The most authoritative channel for enterprise-level IT application isolation, Block specific exe paths through outbound rules to block any external connections. "
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
    "officialUrl": "https://github.com/",
    "verdict": "By blocking known telemetry URLs for Autodesk/Dassault Systèmes, Static blocking of local network requests with zero impact, simple and pure. "
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
      "Visualize one-click switch on multiple telemetry",
      "Supports mainstream CAD and Office Ecology"
    ],
    "cons": [
      "English interface, some settings are biased toward geeky customization"
    ],
    "officialUrl": "https://www.safer-networking.org/",
    "verdict": "An anti-privacy spying tool produced by a well-established system optimization and security manufacturer, suitable for senior administrators to optimize the privacy defense of the entire machine.. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "One-click outbound rule settings",
    "desc": "Create a new rule in Windows Firewall with Advanced Security: Select 'Outbound', Point the program to the AutoCAD directory `AcWebBrowser.exe`, Completely prevent them from rendering ads online. "
  },
  {
    "title": "Turn off the internal collection switch of the software",
    "desc": "Go to CAD ➔ Help ➔ Desktop Analytics Program, uncheck'Allows us to collect usage data', reducing telemetry events at their source. "
  },
  {
    "title": "Configure telemetry isolation per privacy policy",
    "desc": "Limit outbound telemetry domains via a managed hosts list, in line with corporate data-minimization and privacy requirements (e.g. GDPR). "
  }
];
const FAQS = [
  {
    "question": "Will blocking telemetry affect my network license (FLEXlm) usage?? ",
    "answer": "No. FLEXlm floating license uses the port of your LAN server (Such as 27000), and blocking telemetry is for blocking external Internet server domain names, Licensing and authentication within the LAN are not affected at all. "
  },
  {
    "question": "Why does CAD prompt after the ban?'Unable to verify your license status'? ",
    "answer": "This means that you mistakenly entered Autodesk's official cloud license verification server (e.g. Named-User Single-user login authentication) is also blocked.. Please check the hosts list, Move identity-related domain names out. "
  }
];

export default function CloudCadTelemetryBlockerWizardClient() {
  return (
    <CloudReferralClient
      title="Enterprise CAD Telemetry Privacy Configuration Portal"
      subtitle="Direct navigation to objective in-depth telemetry-privacy and network-isolation tooling. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Commercial CAD software (Such as AutoCAD, SolidWorks, Revit) will silently collect user usage habits in the background, Computer MAC address and network IP node, and via a hidden telemetry service (Telemetry Services) Regularly upload to the official server. This not only often causes the system to freeze for unknown reasons., It also raises data-privacy concerns under corporate policies such as GDPR."
      riskWarning="The Telemetry Blocking Wizard is only used as a technical reference for personal and enterprise IT to securely isolate networks and reduce bandwidth usage.. Please use within the authorization compliance boundaries of your enterprise IT department. The Windows Firewall blocking rules and hosts Documentation should not be used to counter legitimate genuine license compliance audits. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
