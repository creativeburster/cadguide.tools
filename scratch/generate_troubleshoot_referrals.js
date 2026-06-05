const fs = require('fs');
const path = require('path');

// 1. Definition of the 6 Troubleshooting Cloud Referral Tools
const referralTools = [
  {
    slug: 'cloud-dwg-drawing-recovery-service',
    title: 'Online Damaged DWG Drawing Recovery & Repair Portal',
    seoTitle: 'Best Online Damaged DWG Drawing Recovery & Repair Services',
    seoDesc: 'Compare the best online tools to recover corrupt DWG files. Learn how to bypass the invalid drawing error and salvage layers locally.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '当您开图时遭遇“图形文件无效 (Drawing file is not valid)”错误，或者 CAD 在加载特定图块时闪退，往往意味着 DWG 内部的数据库节点或文件首部已严重损坏。本地内置的 RECOVER (修复) 命令经常失效，此时需要评估高效的云端或本地重建服务。',
    riskWarning: '损坏图纸往往属于正进行的项目，内含大量商业与设计核心信息。不要轻易在安全性不明的公共修复网站上传涉密图纸。对于核心数据，推荐使用本地物理隔离电脑运行安全修复，或尝试恢复临时自动保存的备份文件（.sv$）。',
    recommendedTools: [
      { name: 'AutoCAD Recover Utility (官方内置修复指令)', rating: 9.9, metrics: [{ name: '修复精准度', score: 5 }, { name: '数据安全性', score: 5 }, { name: '易用性', score: 5 }], pros: ['本地执行无连网风险', '完美重建原图图层表'], cons: ['对严重损坏首部的文件修复率一般'], officialUrl: 'https://www.autodesk.com/', verdict: '开图报错时的第一道修复防线，完全离线执行，是工程人员必须掌握的原生命令。' },
      { name: 'AnyDWG Recovery Tool', rating: 9.5, metrics: [{ name: '修复精准度', score: 4.5 }, { name: '数据安全性', score: 4.5 }, { name: '易用性', score: 4 }], pros: ['支持批量图纸排队修复', '重建算法脱离 CAD 独立运行'], cons: ['商业版需要付费'], officialUrl: 'https://anydwg.com/', verdict: '高性能的第三方独立图纸修复方案，当本地 CAD 因为严重错误崩溃而无法运行 RECOVER 时是极佳平替。' },
      { name: 'CADSoftTools Recovery Service', rating: 9.1, metrics: [{ name: '修复精准度', score: 4 }, { name: '数据安全性', score: 4 }, { name: '易用性', score: 4.5 }], pros: ['云端一键在线重构', '免安装免注册'], cons: ['大文件上传速度受网速限制'], officialUrl: 'https://cadsofttools.com/', verdict: '老牌 CAD 格式解析商提供的在线应急通道，适合临时急需开图的普通非涉密草纸处理。' }
    ],
    bestPractices: [
      { title: '启用备份文件恢复法', desc: '检查您在 CAD 选项中设置的自动保存目录，寻找同名的 `.bak` 或 `.sv$` 文件，将后缀强制改名为 `.dwg`，往往能找回 99% 的进度。' },
      { title: '使用 INSERT 块置入法', desc: '如果 RECOVER 失败，尝试在空白图纸中输入 `-INSERT` 命令，将损坏图纸作为“外部块”强行塞入新图中，常常能绕过首部损坏。' },
      { title: '本地运行 PURGE 净化', desc: '修复成功后，立刻在命令行执行 `PURGE` 和 `AUDIT` 命令，彻底擦除导致损坏的注册表垃圾图元。' }
    ],
    faqs: [
      { question: '“图形文件无效”一般是什么原因造成的？', answer: '这通常是由于断电、CAD 异常闪退、存盘未完成导致的二进制截断，或是用低版本 CAD 强行读取未降级的高版本图纸。' },
      { question: '为什么修复后，我的图纸图层颜色全变成了白色？', answer: '这代表图纸内的层表数据库（Layer Table）元数据已彻底崩塌。修复算法为了保全几何线段，将其强行挂载在了 0 图层上，您需要手动重新整理图层。' }
    ]
  },
  {
    slug: 'cloud-cad-telemetry-blocker-wizard',
    title: 'Enterprise CAD Telemetry Blocker Configuration Portal',
    seoTitle: 'Best Enterprise CAD Telemetry Blockers & Proxy Rules',
    seoDesc: 'Benchmark the best firewall configuration rules and proxy scripts to block CAD outbound telemetry and compliance pings.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '商业 CAD 软件（如 AutoCAD、SolidWorks、Revit）会在后台静默收集用户的使用习惯、电脑 MAC 地址及网络 IP 节点，并通过隐藏的遥测服务（Telemetry Services）定期回传官方服务器。这不仅常导致系统不明原因顿卡，还可能引发误报的反盗版合规审查函。',
    riskWarning: '遥测封禁向导仅作为个人及企业 IT 进行安全网络隔离和减少宽带占用的技术参考。请在企业 IT 部门的授权合规边界内使用。本向导生成的 Windows 防火墙阻断规则和 hosts 文件不应被用于对抗合法的正版许可合规性审计。',
    recommendedTools: [
      { name: 'Windows Defender Firewall (官方自带防火墙系统)', rating: 9.9, metrics: [{ name: '阻断有效性', score: 5 }, { name: '系统兼容性', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['操作系统原生，0% 资源占用', '配置规则永不失效'], cons: ['需要管理员权限进行规则导入'], officialUrl: 'https://www.microsoft.com/', verdict: '企业级 IT 进行应用隔离的最权威通道，通过出站规则封禁特定 exe 路径即可阻断任何外连。' },
      { name: 'Enterprise CAD Hosts Blocker Script', rating: 9.5, metrics: [{ name: '阻断有效性', score: 4.5 }, { name: '系统兼容性', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['一键脚本极速写入 hosts', '不影响局域网 FLEXlm 许可'], cons: ['域名列表需要定期手动维护'], officialUrl: 'https://github.com/', verdict: '通过屏蔽 Autodesk/达索系统的已知遥测网址，对本地网络请求实行零影响的静态阻断，简单纯粹。' },
      { name: 'Spybot Anti-Beacon (专业系统反监控阻断器)', rating: 9.2, metrics: [{ name: '阻断有效性', score: 4 }, { name: '系统兼容性', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['可视化一键开关多种遥测', '支持主流 CAD 与 Office 生态'], cons: ['英文界面，部分设置偏极客化'], officialUrl: 'https://www.safer-networking.org/', verdict: '老牌系统优化与安全厂商出品的反隐私刺探工具，适合高级管理员对整机进行隐私防御优化。' }
    ],
    bestPractices: [
      { title: '一键出站规则设置', desc: '在高级安全 Windows 防火墙中创建新规则：选择“出站”，将程序指向 AutoCAD 目录下的 `AcWebBrowser.exe`，彻底阻止其联网渲染广告。' },
      { title: '关闭软件内部收集开关', desc: '进入 CAD ➔ 帮助 ➔ 桌面分析程序（Desktop Analytics Program），取消勾选“允许我们收集使用数据”，从源头减少遥测事件。' },
      { title: '配置防盗版法务隔离', desc: '使用专用 hosts 列表屏蔽域名，避免代理商自动化取证工具在局域网内后台静默取证。' }
    ],
    faqs: [
      { question: '封禁遥测会影响我的网络许可（FLEXlm）使用吗？', answer: '不会。FLEXlm 浮动授权使用的是您局域网服务器的端口（如 27000），而封禁遥测是针对外部互联网服务器域名的阻断，局域网内的许可认证完全不受影响。' },
      { question: '封禁后 CAD 为什么提示“无法验证您的许可状态”？', answer: '这代表您误将欧特克官方的云许可验证服务器（如 Named-User 单用户登录认证）也给一并屏蔽了。请检查 hosts 列表，将 identity 相关域名移出。' }
    ]
  },
  {
    slug: 'online-lisp-script-compiler-protector',
    title: 'AutoLISP LSP Script Encryption (FAS/VLX) Online Portal',
    seoTitle: 'Best Online AutoLISP LSP to FAS/VLX Compilers Guide',
    seoDesc: 'Compare the best ways to encrypt AutoLISP source files (.lsp) to compiled bytecode (.fas / .vlx). Protect your CAD IPs online.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '当您辛苦编写了提效的 AutoLISP 或 Visual LISP 插件（.lsp），为了在内测或发包分发时不泄露明文源码，防范同行恶意窃取二次打包，需要将其编译为不可逆的二进制字节码（FAS）或者打包为含有 DCL 界面在内的应用程序（VLX）。',
    riskWarning: 'AutoLISP 源码通常凝聚了企业的核心提效算法。利用第三方在线“LISP 混淆器”有极高的源码在云端被捕获和留存的风险。我们强烈推荐用户直接使用 AutoCAD 桌面客户端内置的官方 Visual LISP 编辑器进行本地无损编译，拒绝使用未知在线编译框。',
    recommendedTools: [
      { name: 'AutoCAD Visual LISP IDE (VLIDE 官方内置编译器)', rating: 9.9, metrics: [{ name: '加密安全性', score: 5 }, { name: '编译正确率', score: 5 }, { name: '调试能力', score: 5 }], pros: ['AutoCAD 底层原生自带', '完美支持大型 VLX 复合包'], cons: ['需要有 AutoCAD 本地安装'], officialUrl: 'https://www.autodesk.com/', verdict: '欧特克官方提供的最正规、最安全的加密和编译环境，保证字节码在 CAD 各版本间 100% 稳定运行。' },
      { name: 'Visual Studio Code LISP Extension (官方新型 IDE)', rating: 9.6, metrics: [{ name: '加密安全性', score: 4.5 }, { name: '编译正确率', score: 4.5 }, { name: '调试能力', score: 5 }], pros: ['现代化代码编辑体验', '支持跨平台（Windows/Mac）编译'], cons: ['需要安装额外的 Node.js 编译器驱动'], officialUrl: 'https://code.visualstudio.com/', verdict: '微软与欧特克联手打造的现代化 LISP 开发环境，是替代老旧 VLIDE 命令行编译的首选。' },
      { name: 'AnyConv LISP Compiler', rating: 9.0, metrics: [{ name: '加密安全性', score: 3.5 }, { name: '编译正确率', score: 4 }, { name: '调试能力', score: 3 }], pros: ['纯前端一键拖拽', '生成 FAS 极其迅速'], cons: ['无法配置编译参数'], officialUrl: 'https://anyconv.com/', verdict: '只适合临时临时转换非机密的简易功能小宏，复杂 LISP 极易转换后类型丢失。' }
    ],
    bestPractices: [
      { title: '本地 `(vlisp-compile)` 快速编译', desc: '可以直接在 CAD 命令行输入：`(vlisp-compile \'rx "C:/path/to/my.lsp")` 即可瞬间在同目录下输出加密的 `my.fas` 文件，无需打开 IDE。' },
      { title: '制作 VLX 独立交付包', desc: '如果您的插件包含多个 LSP 文件和 DCL 对话框，在 VLIDE 中选择“打包应用程序 (Make Application)”，可将所有关联文件固化封包为单个 .vlx 文件。' },
      { title: '防反编译二次混淆', desc: '在编译成字节码前，使用正规混淆工具混淆局部变量名（将变量重命名为无意义的符号），实现物理和逻辑的双重加密防御。' }
    ],
    faqs: [
      { question: '编译出的 FAS 文件可以在浩辰或中望 CAD 中直接加载吗？', answer: '一般可以。大多数 IntelliCAD 底座能直接加载和运行标准的加密 FAS 图纸扩展。但部分使用了特殊 ActiveX/COM API 的高级 LISP 可能会在跨平台运行时报错。' },
      { question: '已经编译为 FAS 的文件会被逆向还原为 LSP 源码吗？', answer: 'FAS 是高度转译的编译型二进制字节码，不存在完美的“反编译器”。一般只能提取出明文字符串和部分系统变量，您的核心几何算法逻辑是绝对安全的。' }
    ]
  },
  {
    slug: 'online-revit-family-checker-audit',
    title: 'BIM Revit Family File Integrity & Parameter Auditor',
    seoTitle: 'Best Online Revit Family File (.rfa) Auditors & Checkers',
    seoDesc: 'Compare the best Revit family file checkers. Audit RFA size bloat, verify shared parameters compliance, and optimize BIM performance.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '在 BIM 协同设计中，从网上下载或由供应商提供族文件（.rfa）质量良莠不齐。过度嵌套的族、过多未清除的垃圾实体（Unpurged Objects）以及命名不合规的共享参数（Shared Parameters）会导致 Revit 主模型体积暴涨，引发项目载入极其缓慢和性能崩溃。',
    riskWarning: 'Revit 族文件不仅包含三维精细网格，还带有厂商的工艺技术规范和规格。大批量上传图元库进行云端审计，存在数据被二次收集的版权合规风险。针对企业核心族库，推荐在本地 Revit 中安装官方 Model Checker 插件做离线合规审计。',
    recommendedTools: [
      { name: 'Autodesk Revit Model Checker (官方免费审计扩展)', rating: 9.9, metrics: [{ name: '审计深度', score: 5 }, { name: '规则配置性', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['官方底层原生支持', '完全支持自定义 XML 审计规则表'], cons: ['需要学习一定的配置语法'], officialUrl: 'https://www.autodesk.com/', verdict: '毫无疑问的 BIM 数据质检标杆，直接集成在 Revit 界面，能对 RFA 进行多达数十项指标的深度扫描。' },
      { name: 'Solibri Model Checker (BIM 数据与合规性质量审计)', rating: 9.7, metrics: [{ name: '审计深度', score: 5 }, { name: '规则配置性', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['全方位 IFC 和 RFA 逻辑验证', '强大的空间冲突检测'], cons: ['商业版费用较高'], officialUrl: 'https://www.solibri.com/', verdict: '偏向于大型项目设计协调和造价核算的高级质检工具，其属性字典审计（Attribute Checker）极为硬核。' },
      { name: 'Plannerly BIM Management Suite', rating: 9.3, metrics: [{ name: '审计深度', score: 4 }, { name: '规则配置性', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['BIM 规范管理一体化', '支持云端直接比对'], cons: ['必须连网使用'], officialUrl: 'https://www.plannerly.com/', verdict: '出色的轻量化在线 BIM 管理平台，能自动依据 LOD 精度等级对族图元参数进行标准化约束审计。' }
    ],
    bestPractices: [
      { title: '本地双重 Purge 净化', desc: '在 Revit 族编辑器中，至少连续点击运行两次“清除未使用项 (Purge Unused)”，可剔除 90% 的废弃材质和子族缓存。' },
      { title: '去除无谓的三维细节', desc: '机械阀门族等构件的螺栓等细节应设置为仅在“精细”视图下显示，在“粗糙”和“中等”下用简单实体代替，防止主图加载卡顿。' },
      { title: '建立企业级统一共享参数表', desc: '避免使用临时自定义参数，统一从企业统一只读的共享参数 .txt 文件中加载参数属性，保障数据纯净。' }
    ],
    faqs: [
      { question: '为什么 RFA 族文件只有几百 KB，导入项目后却变大很多？', answer: '这通常是由于该族内部“嵌套”了大量的其他子族，且这些子族未被设置为“共享（Shared）”。Revit 会在导入时强制复制这部分子族库，导致主图体积膨胀。' },
      { question: 'Revit 里的“可变参数”和“类型参数”有什么区别？', answer: '“类型参数（Type Parameters）”修改时会同时改变项目中所有同类族的大小；“实例参数（Instance Parameters）”则只改变当前选中的那一个。推荐非尺寸关键的属性设为实例参数以减少定义冗余。' }
    ]
  },
  {
    slug: 'online-cad-license-audit-shield',
    title: 'Enterprise CAD Software Anti-Piracy Audit Shield Guide',
    seoTitle: 'Best CAD Software Anti-Piracy Audit Shield & Asset Guides',
    seoDesc: 'Compare the best tools and checklists for enterprise Software Asset Management (SAM) to defend against Autodesk and SolidWorks license audits.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '许多企业 IT 部门常面临由于个别员工私自下载安装破解版软件，而意外收到 Autodesk 或 SolidWorks 代理商发来的法务版权合规审计信的难题。这通常会面临高昂的补买罚款与诉讼纠纷。SAM 管理员需要在收到信函前完成自查与防御阻断。',
    riskWarning: '企业反盗版合规自查必须遵循国家知识产权法律和公司SAM管理边界。本指南仅提供资产自查及限制无关域名监听的IT合规白皮书技术方案，不应用于掩盖任何已知违规行为。企业正版化是长远发展的唯一合法之路。',
    recommendedTools: [
      { name: 'Autodesk Licensing Support Tool (官方版权自查程序)', rating: 9.9, metrics: [{ name: '自查准确度', score: 5 }, { name: '数据安全性', score: 5 }, { name: '部署便捷度', score: 5 }], pros: ['官方提供，一键生成全局报表', '准确标出所有无授权的安装'], cons: ['需要联网提交部分验证'], officialUrl: 'https://www.autodesk.com/', verdict: '官方提供的合规扫描诊断助手，能精准显示企业网络中哪些机器处于违规激活状态。' },
      { name: 'Enterprise SAM Checklist (企业软件资产审计清单)', rating: 9.6, metrics: [{ name: '自查准确度', score: 4.5 }, { name: '数据安全性', score: 5 }, { name: '部署便捷度', score: 4.5 }], pros: ['100% 局域网离线核对', '规避外部域名扫描取证'], cons: ['需要手动普查终端'], officialUrl: 'https://www.microsoft.com/', verdict: '目前最稳妥的安全方案。通过域控（Group Policy）脚本查询内网中已安装的 CAD 注册表项。' },
      { name: 'CAD Telemetry Shield Script', rating: 9.3, metrics: [{ name: '自查准确度', score: 4 }, { name: '数据安全性', score: 4.5 }, { name: '部署便捷度', score: 4.5 }], pros: ['自动阻断网络静默回传', '防范代理商无预警端口扫描'], cons: ['需要根据软件更新不断调整规则'], officialUrl: 'https://github.com/', verdict: '针对外网抓取数据进行过滤的企业级网络屏蔽规则包，能够防止代理商通过抓取 MAC 和 IP 取证。' }
    ],
    bestPractices: [
      { title: '内网一键彻底卸载盗版', desc: '盗版软件破解补丁常含有木马和后门，使用官方专用的 Uninstall Helper 彻底清除注册表残余及 licensing 锁文件。' },
      { title: '部署 FLEXlm 授权池进行统一配额', desc: '用正规授权服务器取代 Named-User，并在 `options.opt` 文件中配置保留（RESERVE）策略，限制非授权部门安装。' },
      { title: '统一使用平替 CAD 以降低合规成本', desc: '对非高频使用 CAD 建模的设计岗，统一采购浩辰或中望 CAD 等性价比极高的平替软件，可直接降低 80% 的正版化资金压力。' }
    ],
    faqs: [
      { question: '代理商发来的“版权核对函”有法律效力吗？', answer: '大多数常规的函件是由分销代理商发出的商业劝购信（Sales Pitch），目的是促使您购买正版；但若收到来自律所的正式“律师函”或包含内网详细违规 MAC 地址取证表格的公函，则表明取证已完成，需严肃对待并开展内网自查。' },
      { question: '代理商是怎么知道我们公司使用了盗版 CAD 的？', answer: '当本地盗版 CAD 或插件在连网状态下启动时，内置的遥测模块会自动记录您的公网 IP 及电脑 MAC 地址，并发送回官方合规数据库。一旦匹配到该公网 IP 未在企业购买正版名单中，就会自动派单给当地代理商跟进。' }
    ]
  },
  {
    slug: 'online-dxf-text-translator-cloud',
    title: 'Online DXF/DWG Drawing Multi-Language Batch Translator',
    seoTitle: 'Best Online DXF/DWG Multi-Language Translators Review',
    seoDesc: 'Compare the best tools to batch translate DXF/DWG drawings text. Review vector coordinates preservation and font encoding support.',
    categoryLabel: 'Troubleshooting Wizard',
    painPointDesc: '在开展跨国工程或工业设备发包时，常需要将中文 DXF/DWG 图纸内的工艺文字和标注批量翻译成英语、俄语、日语等语种。普通在线翻译往往会导致文字的坐标原点发生漂移（错位）、字体由于编码不兼容显示为问号，或者把单行文本翻译成超长段落导致遮挡图纸。',
    riskWarning: '图纸中标注的技术要求、明细表（BOM）及尺寸公差涵盖了产品的核心制造工艺与专利。大批量上传至未经安全隔离的公共翻译网站存在极高的敏感数据泄漏风险。对于机密项目，推荐在本地 CAD 内使用专业离线插件进行文本翻译。',
    recommendedTools: [
      { name: 'CADText Translator LISP Script (本地离线脚本)', rating: 9.8, metrics: [{ name: '原点保留度', score: 5 }, { name: '字体匹配度', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['纯本地执行，数据 100% 安全', '自动过滤坐标和标高数值'], cons: ['需要挂载翻译引擎的 API 密钥'], officialUrl: 'https://github.com/', verdict: '基于 CAD 本地 API 编写的批量文本导出与原位替换脚本，是安全保密性最高的高效方案。' },
      { name: 'SDL Trados CAD Plugin (专业工程翻译套件)', rating: 9.6, metrics: [{ name: '原点保留度', score: 4.5 }, { name: '字体匹配度', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['支持建立专业的工程翻译记忆库', '翻译一致性高'], cons: ['需要购买 Trados 商业版软件授权'], officialUrl: 'https://www.rws.com/', verdict: '全球翻译软件巨头为 CAD 格式定制的翻译扩展，支持直接读取并导出译文 DWG，还原度极高。' },
      { name: 'Allinpdf Translator Cloud (云看图与翻译平台)', rating: 9.1, metrics: [{ name: '原点保留度', score: 4 }, { name: '字体匹配度', score: 3.5 }, { name: '数据安全性', score: 3 }], pros: ['纯网页版拖拽极速翻译', '提供双语对照预览'], cons: ['免费版对大文件及复杂图层支持有限'], officialUrl: 'https://allinpdf.com/', verdict: '适合个人设计师对非涉密零件草图或产品包装平面图进行快速的小语种标注翻译转换。' }
    ],
    bestPractices: [
      { title: '提取纯文本至 TMX 进行翻译', desc: '使用脚本提取图纸中所有的 Text/MText/Attribute 文本输出为标准的文本文件，在翻译软件中翻译后再原位导入，这样可以确保图纸几何结构绝不受损。' },
      { title: '采用双字节 SHX 大字体', desc: '翻译出的文字如果是多国语种（如西里尔字母或日语），在 CAD 样式中必须为其挂载支持对应 Unicode 编码的 SHX 大字体（如 gbcbig.shx），防止出现问号。' },
      { title: '加密隧道传输隔离', desc: '企业在涉及多国协同图纸翻译时应完全建立代理安全网络通道，防范泄密。' }
    ],
    faqs: [
      { question: '翻译后的文字把尺寸标注线给压住了怎么办？', answer: '这多是由于不同语种的字符长度差异过大（例如中文“阀门”两个字，翻译成英文是“Valve”五个字符）。建议在代换前，使用 LISP 脚本限制字宽因子（Width Factor）或将多行文本设置为自适应换行。' },
      { question: '为什么标注属性块（Attribute Blocks）里的字翻译不过来？', answer: '普通的文本翻译命令通常只能识别普通的 TEXT 或 MTEXT 图元，而定义在图层块（Blocks）内部的属性文字（ATTRIB）需要使用深层嵌套解析 API。您必须选用支持属性块递归提取的翻译工具。' }
    ]
  }
];

// 2. Load and Update `src/lib/toolbox-data.ts`
const updateToolboxData = () => {
  const toolboxDataPath = path.join(__dirname, '..', 'src', 'lib', 'toolbox-data.ts');
  console.log(`Loading database from: ${toolboxDataPath}`);
  
  if (!fs.existsSync(toolboxDataPath)) {
    console.error('CRITICAL: toolbox-data.ts not found!');
    process.exit(1);
  }

  let content = fs.readFileSync(toolboxDataPath, 'utf8');
  let updatedCount = 0;

  // We have 7 tools to release in Category 3 (1 native + 6 third-party)
  const allReleaseSlugs = ['missing-font-shx-resolver', ...referralTools.map(t => t.slug)];

  allReleaseSlugs.forEach((slug) => {
    // Regex matches the slug and updates its status from 'coming-soon' to 'released'
    const regex = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?status:\\s*)'coming-soon'`);
    if (regex.test(content)) {
      content = content.replace(regex, `$1'released',\n    releasedDate: '2026-06-05'`);
      console.log(`Updated status and releasedDate in config for: ${slug}`);
      updatedCount++;
    } else {
      console.log(`Config for ${slug} is already released or missing matching code block.`);
    }
  });

  fs.writeFileSync(toolboxDataPath, content, 'utf8');
  console.log(`Total database updates: ${updatedCount}`);
};

// 3. Generate Folder, page.tsx and calculator-client.tsx for third-party tools
const generatePages = () => {
  referralTools.forEach((item) => {
    const folder = path.join(__dirname, '..', 'src', 'app', 'toolbox', item.slug);
    
    // Create folder
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`Created folder: ${folder}`);
    }

    const componentName = item.slug
      .replace(/[\s.-]+/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('') + 'Client';

    // page.tsx layout code
    const pageCode = `import { pageMetadata, siteBreadcrumbLd } from '@/lib/seo';
import type { Metadata } from 'next';
import ${componentName} from './calculator-client';

export const metadata: Metadata = pageMetadata({
  title: '${item.seoTitle} | CADGuide.tools',
  description: '${item.seoDesc}',
  path: '/toolbox/${item.slug}',
});

export default function ${componentName.replace('Client', 'Page')}() {
  const breadcrumbs = siteBreadcrumbLd([
    { name: 'Home', path: '/' },
    { name: 'Toolbox', path: '/toolbox' },
    { name: '${item.title.split(' | ')[0]}', path: '/toolbox/${item.slug}' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <main className="min-h-screen bg-slate-50 print:bg-white print:min-h-0">
        <section className="bg-slate-900 text-white py-16 relative overflow-hidden print:hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
          <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 uppercase tracking-[0.15em]">
              Cloud Referral & Evaluation Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              ${item.title}
            </h1>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
              客观深度评测与防审计直达导航。
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1000px] mx-auto px-6 md:px-12 print:p-0">
          <${componentName} />
        </section>
      </main>
    </>
  );
}
`;

    // calculator-client.tsx layout code
    const clientCode = `'use client';

import CloudReferralClient from '@/components/cloud-referral-client';

const RECOMMENDED_TOOLS = ${JSON.stringify(item.recommendedTools, null, 2)};
const BEST_PRACTICES = ${JSON.stringify(item.bestPractices, null, 2)};
const FAQS = ${JSON.stringify(item.faqs, null, 2)};

export default function ${componentName}() {
  return (
    <CloudReferralClient
      title="${item.title}"
      subtitle="客观深度评测与防审计直达导航。"
      categoryLabel="${item.categoryLabel}"
      painPointDesc="${item.painPointDesc}"
      riskWarning="${item.riskWarning}"
      recommendedTools={RECOMMENDED_TOOLS}
      bestPractices={BEST_PRACTICES}
      faqs={FAQS}
    />
  );
}
`;

    fs.writeFileSync(path.join(folder, 'page.tsx'), pageCode, 'utf8');
    fs.writeFileSync(path.join(folder, 'calculator-client.tsx'), clientCode, 'utf8');
    console.log(`Generated physical page and client files for: ${item.slug}`);
  });
};

// Execute
updateToolboxData();
generatePages();
console.log('All Category 3 troubleshoot referral assets generated and configured successfully!');
