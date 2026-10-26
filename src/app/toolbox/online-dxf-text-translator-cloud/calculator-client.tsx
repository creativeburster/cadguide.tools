'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "CADText Translator LISP Script (Local offline script)",
    "rating": 9.8,
    "metrics": [
      {
        "name": "Origin retention",
        "score": 5
      },
      {
        "name": "Font matching",
        "score": 5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Pure local execution, data 100% safe",
      "Automatically filter coordinate and elevation values"
    ],
    "cons": [
      "Need to mount the API key of the translation engine"
    ],
    "officialUrl": "https://github.com/mozman/ezdxf",
    "verdict": "Local Python (`ezdxf`) or AutoLISP scripts that extract `TEXT`, `MTEXT`, and `ATTRIB` strings for translation while keeping all geometry offline."
  },
  {
    "name": "SDL Trados CAD Plugin (Professional Engineering Translation Suite)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "Origin retention",
        "score": 4.5
      },
      {
        "name": "Font matching",
        "score": 4.5
      },
      {
        "name": "Data Security",
        "score": 5
      }
    ],
    "pros": [
      "Support the establishment of professional engineering translation memory database",
      "Translation consistency is high"
    ],
    "cons": [
      "Requires purchase of Trados commercial version software license"
    ],
    "officialUrl": "https://www.rws.com/",
    "verdict": "Enterprise computer-assisted translation (CAT) workflow supporting bilingual terminology glossaries and Translation Memory (TM) reuse across DXF/DWG drawing sets."
  },
  {
    "name": "Allinpdf Translator Cloud (Cloud Viewing and Translation Platform)",
    "rating": 9.1,
    "metrics": [
      {
        "name": "Origin retention",
        "score": 4
      },
      {
        "name": "Font matching",
        "score": 3.5
      },
      {
        "name": "Data Security",
        "score": 3
      }
    ],
    "pros": [
      "Pure web version drag and drop for extremely fast translation",
      "Provide bilingual preview"
    ],
    "cons": [
      "The free version has limited support for large files and complex layers"
    ],
    "officialUrl": "https://allinpdf.com/",
    "verdict": "It is suitable for individual designers to quickly translate and convert small language annotations on non-confidential parts sketches or product packaging plans."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Extract plain text to TMX for translation",
    "desc": "Use a script to extract Text, MText, and Attribute entities into a standard translation memory format, perform translation, and re-import in place to guarantee drawing geometry remains intact."
  },
  {
    "title": "Use double-byte SHX Big Fonts",
    "desc": "If translated text contains multi-byte Asian or Cyrillic characters, ensure the corresponding text style specifies an SHX Big Font (such as gbcbig.shx or bigfont.shx) to prevent question marks from rendering."
  },
  {
    "title": "Encrypted tunnel transmission isolation",
    "desc": "Enterprises should enforce secure, encrypted network channels when collaborating on cross-border technical drawings to protect intellectual property."
  }
];
const FAQS = [
  {
    "question": "What should I do if the translated text suppresses the dimension line? ",
    "answer": "This may be due to the large difference in character length between different languages (for example, Chinese 'The word \"valve\"', Translated into English is the five characters of 'Valve') . It is recommended to use LISP Scripts limit the width factor (Width Factor) or set multi-line text to adaptive wrapping."
  },
  {
    "question": "Why can’t the words in Attribute Blocks be translated? ",
    "answer": "Ordinary text translation commands usually only recognize ordinary TEXT or MTEXT Primitives, defined in layer blocks Internal attribute literals (ATTRIB) require deep nesting parsing API. You must select a translation tool that supports recursive extraction of attribute blocks."
  }
];

export default function OnlineDxfTextTranslatorCloudClient() {
  return (
    <CloudReferralClient
      title="Online DXF/DWG Drawing Multi-Language Batch Translator"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="Cross-border EPC and manufacturing projects frequently require translating thousands of `TEXT`, `MTEXT`, and block attribute annotations across DWG/DXF drawing sets without shifting insertion coordinates, breaking dimension leaders, or causing SHX font encoding errors (`???`)."
      riskWarning="Drawing notes, title blocks, and BOM tables contain proprietary manufacturing specifications. Instead of uploading entire DWG files to public translation websites, extract text strings locally via AutoLISP or `ezdxf` and translate only the de-contextualized text table."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
