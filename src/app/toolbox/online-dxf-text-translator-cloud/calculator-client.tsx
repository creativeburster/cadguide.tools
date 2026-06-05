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
    "officialUrl": "https://github.com/",
    "verdict": "CAD-based native API The batch text export and in-situ replacement scripts written are the most secure and efficient solutions.. "
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
    "verdict": "Customized translation extensions for CAD formats from the global translation software giant, Supports direct reading and export of translation DWG, with extremely high degree of restoration. "
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
    "verdict": "It is suitable for individual designers to quickly translate and convert small language annotations on non-confidential parts sketches or product packaging plans. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "Extract plain text to TMX for translation",
    "desc": "Use a script to extract all Text/MText/Attribute text in the drawing and output it to a standard text file, Translate in the translation software and then import it in place to ensure that the geometric structure of the drawing is never damaged.. "
  },
  {
    "title": "Using double-byte SHX large font",
    "desc": "If the translated text is in multiple languages (such as Cyrillic or Japanese) , The corresponding mount support must be provided in the CAD style Unicode Encoded SHX large font (Such as gbcbig.shx) to prevent question marks from appearing. "
  },
  {
    "title": "Encrypted tunnel transmission isolation",
    "desc": "Enterprises should fully establish agency secure network channels when translating collaborative drawings from multiple countries to prevent leaks.. "
  }
];
const FAQS = [
  {
    "question": "What should I do if the translated text suppresses the dimension line? ",
    "answer": "This may be due to the large difference in character length between different languages (for example, Chinese 'The word \"valve\"', Translated into English is the five characters of 'Valve') . It is recommended to use LISP Scripts limit the width factor (Width Factor) or set multi-line text to adaptive wrapping. "
  },
  {
    "question": "Why can’t the words in Attribute Blocks be translated?? ",
    "answer": "Ordinary text translation commands usually only recognize ordinary TEXT or MTEXT Primitives, defined in layer blocks (Blocks) Internal attribute literals (ATTRIB) require deep nesting parsing API. You must select a translation tool that supports recursive extraction of attribute blocks. "
  }
];

export default function OnlineDxfTextTranslatorCloudClient() {
  return (
    <CloudReferralClient
      title="Online DXF/DWG Drawing Multi-Language Batch Translator"
      subtitle="Direct navigation to objective in-depth evaluation and anti-audit. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="When carrying out transnational engineering or industrial equipment outsourcing, it is often necessary to provide Chinese DXF/DWG Batch translation of process text and annotations in drawings into English and Russian, Japanese and other languages. Ordinary online translation often causes the coordinate origin of the text to drift. (misalignment), the font is displayed as a question mark due to incompatible encoding, Or translating a single line of text into an overly long paragraph causing the drawing to be obscured. "
      riskWarning="Technical requirements marked in drawings, detailed list (BOM) and dimensional tolerances cover the core manufacturing process and patents of the product. Uploading large batches to public translation websites without security isolation has a very high risk of sensitive data leakage. For confidential projects, local is recommended CAD Use professional offline plug-ins for text translation. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
