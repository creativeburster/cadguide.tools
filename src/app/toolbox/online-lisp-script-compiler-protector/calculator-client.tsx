'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD Visual LISP IDE (VLIDE Official built-in compiler)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "cryptographic security",
        "score": 5
      },
      {
        "name": "Compilation accuracy",
        "score": 5
      },
      {
        "name": "Debugging capabilities",
        "score": 5
      }
    ],
    "pros": [
      "AutoCAD The bottom layer comes natively",
      "Perfect support for large VLX composite packages"
    ],
    "cons": [
      "Requires a local installation of AutoCAD"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "The most formal and secure encryption and compilation environment officially provided by Autodesk, Ensure bytecode is consistent between CAD versions 100% Stable operation."
  },
  {
    "name": "Visual Studio Code LISP Extension (Official new IDE)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "cryptographic security",
        "score": 4.5
      },
      {
        "name": "Compilation accuracy",
        "score": 4.5
      },
      {
        "name": "Debugging capabilities",
        "score": 5
      }
    ],
    "pros": [
      "A modern code editing experience",
      "Supports cross-platform (Windows/Mac) compilation"
    ],
    "cons": [
      "Requires installation of additional Node.js compiler driver"
    ],
    "officialUrl": "https://marketplace.visualstudio.com/items?itemName=Autodesk.autolispext",
    "verdict": "Microsoft and Autodesk jointly create a modern LISP development environment, it is the first choice to replace the old VLIDE command line compilation."
  },
  {
    "name": "AnyConv LISP Compiler",
    "rating": 9,
    "metrics": [
      {
        "name": "cryptographic security",
        "score": 3.5
      },
      {
        "name": "Compilation accuracy",
        "score": 4
      },
      {
        "name": "Debugging capabilities",
        "score": 3
      }
    ],
    "pros": [
      "Pure front-end one-click drag and drop",
      "Generate FAS extremely quickly"
    ],
    "cons": [
      "Unable to configure compilation parameters"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "Only suitable for temporary temporary conversion of non-confidential simple function macros, complex LISP It is extremely easy for the type to be lost after conversion."
  }
];
const BEST_PRACTICES = [
  {
    "title": "Local `(vlisp-compile)` fast compilation",
    "desc": "Can be entered directly at the CAD command line: `(vlisp-compile 'rx \"C:/path/to/my.lsp\")` You can instantly output the encrypted `my.fas` file in the same directory. No need to open the IDE."
  },
  {
    "title": "Create a VLX standalone delivery package",
    "desc": "If your plugin contains multiple LSP files and DCL dialog box in VLIDE Select 'Package Application (Make Application)', all associated files can be solidified and packaged into a single .vlx file."
  },
  {
    "title": "Prevent decompilation from secondary confusion",
    "desc": "Use regular obfuscation tools to obfuscate local variable names before compiling into bytecode. (Rename variables to meaningless symbols) to achieve physical and logical double encryption defense."
  }
];
const FAQS = [
  {
    "question": "The compiled FAS file can be found in GstarCAD or ZWCAD Load directly? ",
    "answer": "Generally OK. Most IntelliCAD Base can directly load and run standard encrypted FAS drawing extensions. However, some advanced LISP An error may occur when running cross-platform."
  },
  {
    "question": "Files that have been compiled into FAS will be reverse-restored to LSP Source code? ",
    "answer": "FAS is compiled binary bytecode optimized for the Visual LISP virtual machine, and cannot be cleanly decompiled back into commented LSP source code. For maximum IP protection, obfuscate symbol names prior to compiling into FAS or VLX packages."
  }
];

export default function OnlineLispScriptCompilerProtectorClient() {
  return (
    <CloudReferralClient
      title="AutoLISP LSP Script Encryption (FAS/VLX) Online Portal"
      subtitle="Direct access to objective engineering benchmarks, local header preflight, and security compliance guidelines."
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="When you've worked hard to write a more efficient AutoLISP or Visual LISP Plug-in (.lsp), in order not to leak the plain source code during internal testing or package distribution, to prevent peers from maliciously stealing secondary packaging, it needs to be compiled into irreversible binary bytecode. (FAS) Or packaged as an application including a DCL interface (VLX) ."
      riskWarning="Proprietary AutoLISP (.lsp) source code often contains your organization's core automation algorithms. Avoid uploading raw LSP scripts to untrusted third-party web obfuscators; always compile FAS/VLX bytecode locally using AutoCAD's built-in Visual LISP IDE (VLIDE) or `(vlisp-compile)`."
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
