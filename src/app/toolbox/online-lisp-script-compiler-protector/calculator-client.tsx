'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = [
  {
    "name": "AutoCAD Visual LISP IDE (VLIDE 官方内置编译器)",
    "rating": 9.9,
    "metrics": [
      {
        "name": "加密安全性",
        "score": 5
      },
      {
        "name": "编译正确率",
        "score": 5
      },
      {
        "name": "调试能力",
        "score": 5
      }
    ],
    "pros": [
      "AutoCAD 底层原生自带",
      "完美支持大型 VLX 复合包"
    ],
    "cons": [
      "需要有 AutoCAD 本地安装"
    ],
    "officialUrl": "https://www.autodesk.com/",
    "verdict": "欧特克官方提供的最正规, 最安全的加密和编译环境, 保证字节码在 CAD 各版本间 100% 稳定运行. "
  },
  {
    "name": "Visual Studio Code LISP Extension (官方新型 IDE)",
    "rating": 9.6,
    "metrics": [
      {
        "name": "加密安全性",
        "score": 4.5
      },
      {
        "name": "编译正确率",
        "score": 4.5
      },
      {
        "name": "调试能力",
        "score": 5
      }
    ],
    "pros": [
      "现代化代码编辑体验",
      "支持跨平台 (Windows/Mac) 编译"
    ],
    "cons": [
      "需要安装额外的 Node.js 编译器驱动"
    ],
    "officialUrl": "https://code.visualstudio.com/",
    "verdict": "微软与欧特克联手打造的现代化 LISP 开发环境, 是替代老旧 VLIDE 命令行编译的首选. "
  },
  {
    "name": "AnyConv LISP Compiler",
    "rating": 9,
    "metrics": [
      {
        "name": "加密安全性",
        "score": 3.5
      },
      {
        "name": "编译正确率",
        "score": 4
      },
      {
        "name": "调试能力",
        "score": 3
      }
    ],
    "pros": [
      "纯前端一键拖拽",
      "生成 FAS 极其迅速"
    ],
    "cons": [
      "无法配置编译参数"
    ],
    "officialUrl": "https://anyconv.com/",
    "verdict": "只适合临时临时转换非机密的简易功能小宏, 复杂 LISP 极易转换后类型丢失. "
  }
];
const BEST_PRACTICES = [
  {
    "title": "本地 `(vlisp-compile)` 快速编译",
    "desc": "可以直接在 CAD 命令行输入: `(vlisp-compile 'rx \"C:/path/to/my.lsp\")` 即可瞬间在同目录下输出加密的 `my.fas` 文件, 无需打开 IDE. "
  },
  {
    "title": "制作 VLX 独立交付包",
    "desc": "如果您的插件包含多个 LSP 文件和 DCL 对话框, 在 VLIDE 中选择'打包应用程序 (Make Application)', 可将所有关联文件固化封包为单个 .vlx 文件. "
  },
  {
    "title": "防反编译二次混淆",
    "desc": "在编译成字节码前, 使用正规混淆工具混淆局部变量名 (将变量重命名为无意义的符号) , 实现物理和逻辑的双重加密防御. "
  }
];
const FAQS = [
  {
    "question": "编译出的 FAS 文件可以在浩辰或中望 CAD 中直接加载吗? ",
    "answer": "一般可以. 大多数 IntelliCAD 底座能直接加载和运行标准的加密 FAS 图纸扩展. 但部分使用了特殊 ActiveX/COM API 的高级 LISP 可能会在跨平台运行时报错. "
  },
  {
    "question": "已经编译为 FAS 的文件会被逆向还原为 LSP 源码吗? ",
    "answer": "FAS 是高度转译的编译型二进制字节码, 不存在完美的'反编译器'. 一般只能提取出明文字符串和部分系统变量, 您的核心几何算法逻辑是绝对安全的. "
  }
];

export default function OnlineLispScriptCompilerProtectorClient() {
  return (
    <CloudReferralClient
      title="AutoLISP LSP Script Encryption (FAS/VLX) Online Portal"
      subtitle="客观深度评测与防审计直达导航. "
      categoryLabel="Troubleshooting Wizard"
      painPointDesc="当您辛苦编写了提效的 AutoLISP 或 Visual LISP 插件 (.lsp) , 为了在内测或发包分发时不泄露明文源码, 防范同行恶意窃取二次打包, 需要将其编译为不可逆的二进制字节码 (FAS) 或者打包为含有 DCL 界面在内的应用程序 (VLX) . "
      riskWarning="AutoLISP 源码通常凝聚了企业的核心提效算法. 利用第三方在线'LISP 混淆器'有极高的源码在云端被捕获和留存的风险. 我们强烈推荐用户直接使用 AutoCAD 桌面客户端内置的官方 Visual LISP 编辑器进行本地无损编译, 拒绝使用未知在线编译框. "
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
);
}
