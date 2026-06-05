const fs = require('fs');
const path = require('path');

// 1. Definition of the 17 Third-Party Cloud Referral Tools
const referralTools = [
  {
    slug: 'online-pdf-to-dwg-converter',
    title: 'Online Vector PDF to CAD DWG Converter Portal',
    seoTitle: 'Best Online Vector PDF to CAD DWG Converter Guide',
    seoDesc: 'Compare the best online PDF to DWG converters. Review layer fidelity, text OCR accuracy, and find safe, registry-compliant cloud conversion portals.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '将矢量或扫描式 PDF 图纸还原为可在 CAD 中编辑的 DWG/DXF 几何实体，通常会面临曲线拟合失真、SHX/TTF 字体打散为零碎线条以及默认比例尺漂移等技术难题。本评测挑选了业界精度最高、图层保留最完好的三款专业引擎。',
    riskWarning: 'PDF 图纸包含大量企业核心建筑与机械装配机密。商业云端转换器有可能记录并留存您的图纸。为了防范版权合规稽查与商业隐私泄露，针对高密图纸，请务必使用本地 AutoCAD 的 PDFIMPORT 命令进行无网本地解析，切勿上传到未知来源网站。',
    recommendedTools: [
      { name: 'AnyDWG PDF to DWG Converter', rating: 9.8, metrics: [{ name: '几何精确度', score: 5 }, { name: '文字还原度', score: 4 }, { name: '图层保留度', score: 4 }], pros: ['矢量曲线拓扑还原极佳', '支持批量图纸快速对齐'], cons: ['大图纸的渐变色填充偶有缺失'], officialUrl: 'https://anydwg.com/', verdict: 'AnyDWG 拥有数十年的 CAD 基础开发经验，其本地引擎在还原 CAD 点划线、中心线和标注时算法最稳定。' },
      { name: 'CADSoftTools PDF to DWG', rating: 9.5, metrics: [{ name: '几何精确度', score: 4 }, { name: '文字还原度', score: 5 }, { name: '图层保留度', score: 3 }], pros: ['支持中文字体 OCR 重新映射', '提供免费的在线快速预览'], cons: ['图纸空间到模型空间偶尔坐标偏离'], officialUrl: 'https://cadsofttools.com/', verdict: '老牌工业级 CAD 组件商，对 PDF 内部文字的识别精度行业领先。' },
      { name: 'CloudConvert PDF to DWG', rating: 9.1, metrics: [{ name: '几何精确度', score: 4 }, { name: '文字还原度', score: 3 }, { name: '图层保留度', score: 4 }], pros: ['全环境队列极其高速', '支持 API 自动化调度'], cons: ['对高度自定义的字体解析有限'], officialUrl: 'https://cloudconvert.com/', verdict: '最知名的通用文件格式转换平台，适合对转换细节要求不高的普通草图快速流转。' }
    ],
    bestPractices: [
      { title: '优先剔除图纸敏感属性', desc: '转换前使用 PDF 压缩或擦除工具去除作者、审图戳记等不必要的元数据标记。' },
      { title: '本地 SCALE 缩放对齐', desc: '转换出的 DWG 会缩放至图纸尺寸，请在 CAD 中选中所有图元，使用 SCALE 参照已知标注（如 900mm 门宽）重置一比一比例。' },
      { title: '无网本地代换策略', desc: '大型企业可考虑部署本地版 PDFIMPORT，或对对外访问的代理服务器设置策略，防范数据上报。' }
    ],
    faqs: [
      { question: '为什么转换出来的线条都是断开的散线？', answer: '这是由于 PDF 导出时将圆弧或样条曲线离散化成了直线段。您可以在 CAD 中通过 PEDIT ➔ J (连接) 命令将多段断开的线条重新缝合。' },
      { question: '转换出来的中文字符变成了乱码怎么办？', answer: '这是因为您的系统缺少 PDF 导图时原装的 TrueType (TTF) 字体或 SHX 双大字体。建议在 CAD 字体管理器中设置 substitution（代换）为 gbcbig.shx 或 hztxt.shx。' }
    ]
  },
  {
    slug: 'online-dwg-to-pdf-cloud-printer',
    title: 'Online DWG to Vector PDF Batch Cloud Printer',
    seoTitle: 'Best Online DWG to Vector PDF Cloud Printers Review',
    seoDesc: 'Compare the best online tools to batch print DWG drawings to PDF format without CAD installed. Check layout plotting and CTB style preservation.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '在没有安装 AutoCAD 的情况下，如何将 DWG 快速转为高保真的 PDF 格式用于汇报？通用转换工具往往会导致 CTB 打印线宽丢失（全图粗细一样）、图纸布局空间（Layout Tabs）不可见、以及复杂线型样式崩塌。',
    riskWarning: 'DWG 文件是企业数字资产的最核心承载。将 DWG 上传到云端打印时，不仅要核对隐私协议，还要避免激活 Autodesk 等联盟的反盗版侦测网络。切勿上传任何未经官方授权客户端保存的文件进行云端打印。',
    recommendedTools: [
      { name: 'Autodesk Viewer (官方免费通道)', rating: 9.9, metrics: [{ name: '线宽保真度', score: 5 }, { name: '布局完整度', score: 5 }, { name: '安全合规性', score: 4 }], pros: ['Autodesk 官方引擎绝对一致', '100% 支持三维视图'], cons: ['必须登录且加载相对缓慢'], officialUrl: 'https://viewer.autodesk.com/', verdict: '官方免费在线看图与发布平台，完全保留 CTB、图层属性以及图元关联，最安全可靠。' },
      { name: 'CloudConvert DWG to PDF', rating: 9.3, metrics: [{ name: '线宽保真度', score: 4 }, { name: '布局完整度', score: 4 }, { name: '安全合规性', score: 3 }], pros: ['支持批量脚本调用', '提供高匿接口'], cons: ['不支持高度复杂的 CTB 自定义笔宽'], officialUrl: 'https://cloudconvert.com/', verdict: '极速转换普通图纸的最佳选择，支持主流图层静态平面导出。' },
      { name: 'Allinpdf DWG to PDF', rating: 9.0, metrics: [{ name: '线宽保真度', score: 3 }, { name: '布局完整度', score: 4 }, { name: '安全合规性', score: 3 }], pros: ['纯前端拖拽无需登录', '速度飞快'], cons: ['对大图纸可能出现线条丢失'], officialUrl: 'https://allinpdf.com/', verdict: '适合个人临时使用的极速查看与转换渠道，不建议大企业敏感业务部署。' }
    ],
    bestPractices: [
      { title: '本地清理垃圾实体', desc: '打印前在 CAD 中运行 PURGE 和 -AUDIT 命令，将冗余的 scale list 和外部引用绑定以减小体积。' },
      { title: '采用 Microsoft Print to PDF', desc: '如无安装 CAD 限制，使用微软虚拟打印驱动输出的 PDF 几何保真度最高。' },
      { title: '限制外链遥测', desc: '对于敏感文件，选择限制网络访问的纯只读本地解析方案。' }
    ],
    faqs: [
      { question: '转换出来的 PDF 为什么全图线条都是一个粗细？', answer: '这是因为转换时没有正确挂载您的 .ctb 打印样式文件。可以在云打印设置中寻找 "Plot styles" 选项，或者将打印样式以单色（Monochrome）模式固化到图纸内部。' },
      { question: '多视口视角的线段为何重叠残缺？', answer: '这是布局空间 Viewport 坐标遮挡裁剪问题。建议打印前在 CAD 里将视口的 Shade Plot 设定为 As Displayed（按显示渲染）。' }
    ]
  },
  {
    slug: 'online-dwg-version-downgrader-cloud',
    title: 'Online DWG Format Version Downgrader',
    seoTitle: 'Best Online DWG Version Converter & Downgrader',
    seoDesc: 'Benchmark and compare tools to downgrade AutoCAD DWG version code (e.g., AC1032 to AC1027). Learn how to open unsupported drawings.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '遭遇“图形文件版本不支持”错误时，您可能拿到了高版本 AutoCAD（如 2018-2027 保存的 AC1032 编码）的图纸，而本地仅有老版本 CAD 软件。利用云端格式降级工具可以快速将文件重写为广泛兼容的 AC1027（2013 格式）或 AC1021（2007 格式）。',
    riskWarning: '频繁的格式降级不仅可能导致特殊的参数化“动态块”和约束关系丢失，甚至可能触发反盗版合规审查。请确保降级行为是在企业授权的安全边界下进行。对于核心机密设计，推荐下载官方免费的桌面端 DWG TrueView 软件完成本地转换。',
    recommendedTools: [
      { name: 'Autodesk DWG TrueView (官方桌面转换器)', rating: 9.9, metrics: [{ name: '降级保真度', score: 5 }, { name: '数据安全性', score: 5 }, { name: '批量操作', score: 4 }], pros: ['官方底层数据库重写', '无损转换动态块'], cons: ['仅支持 Windows 且安装包较大'], officialUrl: 'https://www.autodesk.com/', verdict: '欧特克官方提供的免费看图与图纸版本转换器，安全系数最高，保证 CAD 数据库节点无缺损。' },
      { name: 'Any DWG Version Converter', rating: 9.6, metrics: [{ name: '降级保真度', score: 4.5 }, { name: '数据安全性', score: 4 }, { name: '批量操作', score: 5 }], pros: ['支持批量后台静默降级', '兼容所有 AutoCAD 历史代码'], cons: ['商业版需要许可购买'], officialUrl: 'https://anydwg.com/', verdict: '非常经典的批量图纸版本重构程序，操作纯粹利落，降级后数据兼容良好。' },
      { name: 'CADSoftTools Version Converter', rating: 9.2, metrics: [{ name: '降级保真度', score: 4 }, { name: '数据安全性', score: 4 }, { name: '批量操作', score: 3 }], pros: ['云端极速解包', '支持 DXF-DWG 互转'], cons: ['大文件偶尔出现自定义实体转换丢失'], officialUrl: 'https://cadsofttools.com/', verdict: '性能优秀的专业云端降级平台，满足日常工程配合时的快速倒手。' }
    ],
    bestPractices: [
      { title: '建议降级至 2013 格式 (AC1027)', desc: '这是目前全行业兼容性与数据结构最平衡的版本，几乎 100% 的替代 CAD 引擎都能流畅读写。' },
      { title: '警惕参数化实体降解', desc: '降级后，请核对复杂的关联标注、三维剖切以及三维模型表面的曲率参数是否被炸开（Exploded）为碎线。' },
      { title: '使用隔离虚拟机转换', desc: '对于来路不明的客户图纸，建议在隔离的虚拟机环境下转换，防范宏病毒和遥测抓取。' }
    ],
    faqs: [
      { question: 'AC1032、AC1027、AC1024 都是些什么代码？', answer: '这些是 DWG 文件的首部魔数标志（Magic Number）。例如 AC1032 代表 2018-2027 版本的图纸数据库，老版软件因为无法识别该头部结构，会直接报文件损坏或版本不支持。' },
      { question: '降级后动态块（Dynamic Blocks）失效了怎么回事？', answer: '一些基于新型约束关系的动态块在高版本才支持。在强制降级后，CAD 数据库会将其转化为退化的静态普通匿名块。' }
    ]
  },
  {
    slug: 'cloud-dwg-to-step-iges-converter',
    title: 'Online 3D DWG to STEP/IGES CAD Translator',
    seoTitle: 'Best Online 3D DWG to STEP/IGES Converters Review',
    seoDesc: 'Lookup and benchmark online translators to convert 3D DWG solids to STEP or IGES files for CNC machining and SolidWorks modeling.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '将包含 3D 实体的 DWG 图纸导入机械三维 CAD（如 SolidWorks、Creo）或用于 CNC 制造（如 Mastercam）时，需要将其翻译为通用的 STEP（AP203/AP214）或 IGES 几何表达。普通多边形转换往往将曲面变成了粗糙的三角网格（Mesh），使得工业加工精度报废。',
    riskWarning: '机械三维模型（如核心模具、机加工零件）是企业绝密知识产权。在上传至云端进行 3D B-Rep (边界表示法) 数据转换时，要特别防范数据泄露与商业秘密流失。对于高精度零部件，请务必使用本地 CAD 转换插件。',
    recommendedTools: [
      { name: 'CAD Exchanger (业界公认 3D 转换器)', rating: 9.8, metrics: [{ name: '拓扑拟合度', score: 5 }, { name: '数据还原度', score: 5 }, { name: '格式丰富度', score: 4 }], pros: ['B-Rep 拓扑拓扑重构极准', '完美保留曲面曲率'], cons: ['商业桌面版费用较高'], officialUrl: 'https://cadexchanger.com/', verdict: '专业的工程数据交换核心引擎，对三维实体内核（Parasolid, ACIS）转换算法调优极高。' },
      { name: 'Autodesk Fusion (官方集成通道)', rating: 9.6, metrics: [{ name: '拓扑拟合度', score: 4 }, { name: '数据还原度', score: 5 }, { name: '格式丰富度', score: 4 }], pros: ['云端原生解析 DWG 实体', '一键导出 AP214 STEP'], cons: ['需要加载云账号且速度受网速限制'], officialUrl: 'https://www.autodesk.com/', verdict: '欧特克云端建模平台，拥有处理自身 DWG 3D 数据库的先天优势。' },
      { name: 'GrabCAD Workbench Translators', rating: 9.2, metrics: [{ name: '拓扑拟合度', score: 4 }, { name: '数据还原度', score: 4 }, { name: '格式丰富度', score: 3.5 }], pros: ['完全免费的协作空间', '集成大型装配体解析'], cons: ['对非常旧的 IGES 格式支持有限'], officialUrl: 'https://grabcad.com/', verdict: '优秀的免费工业级 3D 托管和翻译平台，适合工程师之间日常工程文件的无障碍对齐。' }
    ],
    bestPractices: [
      { title: '剔除二维投影线', desc: '在导出 3D DWG 前，删掉所有的 2D 轮廓布局、尺寸线以及文字批注，仅保留纯三维实体（Solid）以减少几何冗余。' },
      { title: '优先选择 STEP 格式', desc: 'STEP 格式相比 IGES 具有更完美的实体装配结构信息，并能精准锁定零件颜色与面与面的拓扑缝合（Sewing）。' },
      { title: '核对公差漂移', desc: '对于配合面，请在导入 SolidWorks 后进行“几何检查”，防止转换过程中发生公差漂移（Tolerance Drift）。' }
    ],
    faqs: [
      { question: '转换出来的 3D 实体变成空心壳子了怎么办？', answer: '这通常是由于原 3D DWG 中使用了表面网格（Mesh/Surface）而不是实体（Solid）建模。如果是片体导入，需要运行“缝合曲面（Sew Surface）”命令将空心面重构为封闭实体。' },
      { question: 'STEP AP203 和 AP214 有什么区别？', answer: 'AP203 仅保留三维空间几何坐标和结构；AP214 在此基础上额外支持颜色、图层定义以及复杂的尺寸标注（GD&T）。推荐优先采用 AP214 格式。' }
    ]
  },
  {
    slug: 'cloud-bim-rvt-to-ifc-converter',
    title: 'Online Revit RVT to openBIM IFC Standard Converter',
    seoTitle: 'Best Online Revit RVT to openBIM IFC Exporters Review',
    seoDesc: 'Evaluate the best Revit RVT to buildingSmart IFC converters. Find compliant exporters that preserve parameters and spaces mapping.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '将 Revit 原生的 RVT 格式交换为 openBIM 开放标准的 IFC (Industry Foundation Classes) 文件时，最棘手的问题莫过于 Revit 参数字典映射丢失、空间区域（IFCSpace）属性遗失、以及三维实体变成损坏的多面体（Polygon Soup），导致下游协同系统彻底报废。',
    riskWarning: 'BIM 模型包含建筑构件细部、管线路由、结构钢筋配置及工程总造价等极为敏感的敏感信息。建议在本地 Revit 客户端中使用官方 IFC 插件进行导出与调试，绝不推荐通过未知第三方公共云服务器进行在线云端 RVT 解析。',
    recommendedTools: [
      { name: 'Revit Native IFC Exporter (官方开源插件)', rating: 9.9, metrics: [{ name: 'IfcSpace 保留', score: 5 }, { name: '参数完整度', score: 5 }, { name: '标准合规性', score: 5 }], pros: ['欧特克官方维护开源代码', '深度支持 IFC4 规范'], cons: ['配置参数相对复杂'], officialUrl: 'https://github.com/Autodesk/revit-ifc', verdict: '官方在 GitHub 上持续开源维护的转换工具包，输出最为严谨和标准，最适合企业配合验收。' },
      { name: 'buildingSmart openBIM Exporter Kits', rating: 9.5, metrics: [{ name: 'IfcSpace 保留', score: 4 }, { name: '参数完整度', score: 4 }, { name: '标准合规性', score: 5 }], pros: ['符合 buildingSmart 认证标准', '支持扩展元数据字典'], cons: ['学习曲线陡峭'], officialUrl: 'https://www.buildingsmart.org/', verdict: 'BIM 标准制定组织推荐的转换工具，具有极高的国际规范适应能力。' },
      { name: 'BIMcollab Exporter Suite', rating: 9.3, metrics: [{ name: 'IfcSpace 保留', score: 4 }, { name: '参数完整度', score: 4.5 }, { name: '标准合规性', score: 4 }], pros: ['针对协调配合做了深度参数优化', '附带强大的免费 IFC 查阅器'], cons: ['与 BIMcollab 云端绑定'], officialUrl: 'https://www.bimcollab.com/', verdict: '适合中大型项目在做跨团队碰撞检测（Clash Detection）时的专业协同转换方案。' }
    ],
    bestPractices: [
      { title: '加载标准 IFC 映射参数表', desc: '在 Revit 导出配置中指定 sharedparameters 映射关系，确保 RVT 属性精确对齐到 IFC PropertySet 内。' },
      { title: '精简族嵌套深度', desc: '导出前剔除复杂的螺栓等非必要家具族，减少多面体三角网格的堆叠，防止 IFC 体积突破 G 级。' },
      { title: '执行 IFC 架构有效性验证', desc: '导出后一定要使用独立的 IFC 校验工具运行一次格式审计，确认结构柱、墙等大分类正确挂载。' }
    ],
    faqs: [
      { question: 'IFC2x3 和 IFC4 格式我该怎么选择？', answer: 'IFC2x3 是目前最为成熟和全行业支持最广的版本；IFC4 在三维几何拟合、机电管线路由及地形表达上更先进，但部分老版协同软件可能读取报错。如无要求，优先输出 IFC2x3 以保底兼容性。' },
      { question: '为什么有些墙体在 IFC 里显示不全或缺失？', answer: '这多是因为这些构件的 Revit 族类别被指定为了“常规模型 (Generic Models)”，且导出时未勾选“导出常规模型”选项。请核对构件分类属性。' }
    ]
  },
  {
    slug: 'online-dgn-to-dwg-converter',
    title: 'Online Bentley DGN to AutoCAD DWG Layer Converter',
    seoTitle: 'Best Online DGN to DWG Converters & Layer Mappers',
    seoDesc: 'Compare DGN to DWG online converters. Review level-to-layer mappings, cell library preservation, and Bentley baseline conversions.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: 'Bentley MicroStation DGN 图纸在向 AutoCAD DWG 图纸转换时，由于两个平台底座原理完全不同，通常会导致 MicroStation 的“层级（Levels）”无法对齐到 CAD“图层（Layers）”、专有的单元库（Cells）退化为破碎线段、以及 Bentley 标志性的手写连续线型样式崩塌。',
    riskWarning: 'DGN 格式一般用于国家大型桥梁、轨道交通及市政网管等基础设施设计，涉及极为严格的物理安全和项目敏感性。请优先使用 MicroStation 本地内置的“另存为 DWG”功能进行高精度匹配，并挂载正规图层对照表（CSV），避免使用公共转换网站进行大批量转换。',
    recommendedTools: [
      { name: 'Bentley MicroStation (官方桌面内核另存为)', rating: 9.9, metrics: [{ name: '单元库还原', score: 5 }, { name: '层级映射度', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['Bentley 官方原生几何重组', '支持挂载 CSV 批量对照表'], cons: ['商业版授权极为昂贵'], officialUrl: 'https://www.bentley.com/', verdict: '毋庸置疑的最高精度转换方案。利用其内置转换向导能精确定义 DGN levels 到 DWG layers 的逻辑。' },
      { name: 'ODA File Converter (官方数据联盟转换器)', rating: 9.7, metrics: [{ name: '单元库还原', score: 4.5 }, { name: '层级映射度', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['免费无需商业授权', '提供底层 C++ SDK 级别的算法'], cons: ['没有可视化 GUI 图元参数微调'], officialUrl: 'https://www.opendesign.com/', verdict: '开放设计联盟（ODA）维护的专业底层格式转换器，对 DGN V7/V8 和 DWG 各版本的映射机制非常完美。' },
      { name: 'Any DGN to DWG Converter', rating: 9.2, metrics: [{ name: '单元库还原', score: 4 }, { name: '层级映射度', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['绿色轻量级批量导出', '运行速度极快'], cons: ['对 Bentley 专属线型的拟合需要手动配置'], officialUrl: 'https://anydwg.com/', verdict: '专业的第三方转换小工具，运行独立，适合日常跨软件协作时的快速交付。' }
    ],
    bestPractices: [
      { title: '挂载 Remap CSV 映射文件', desc: '在 MicroStation 导出时，配置 .csv 控制表，将 Levels、Colors、LineWeights 一一指定为对应的 CAD 图层和标准索引颜色（ACI）。' },
      { title: '处理共享单元 (Shared Cells)', desc: '在导出选项中，将“共享单元”展开为普通“块 (Blocks)”，防止在 AutoCAD 中图纸被破坏为零星图元。' },
      { title: '统一使用真彩色 (True Color)', desc: '避免使用 Bentley 专用的颜色表，在转换前将元素色值切换为通用的 RGB 真彩色，防止导入 CAD 后全部发黑。' }
    ],
    faqs: [
      { question: '转换出的图元显示“OLE 容器错误”是什么原因？', answer: '这代表您的 DGN 图纸中内嵌了外部的 Excel 数据表或非矢量图。CAD 对此接口不兼容，建议导出前在 Bentley 里将其截图固化为普通像素图层。' },
      { question: 'DGN 的 V7 和 V8 格式对转换有影响吗？', answer: '有。V7 是历史旧版本，有文件大小及图层数量上限限制；V8 是 2001 年后通用的 64 位三维数据库格式。转换前需确认目标 DWG 平台是否能识别对应 ODA 驱动。' }
    ]
  },
  {
    slug: 'online-3d-cad-viewer-collaborator',
    title: 'Cloud 3D CAD/BIM Multi-User Viewer & Mockup Portal',
    seoTitle: 'Best Cloud 3D CAD/BIM Viewers & Collab Portals Review',
    seoDesc: 'Benchmark top online WebGL CAD viewers. Compare rendering accuracy, redline markup tools, and secure project sharing.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '与客户或团队共享复杂的 3D CAD 装配体（如 CATIA, NX, SolidWorks, STEP）或 Revit BIM 模型进行现场评审时，普通用户电脑往往没有专业建模软件。利用云端 WebGL 3D 浏览器，可以免安装加载大型模型，实现在线旋转、剖切、红线标注与尺寸测量。',
    riskWarning: '3D CAD 装配体包含零部件的所有加工尺寸、内部拓扑与工程装配链接。将这些文件直接上传到不知名的云端看图网站，很容易遭遇“数据脱水拦截”和商业盗取。推荐使用具有企业安全权限管控和动态水印加密的高端协作平台。',
    recommendedTools: [
      { name: 'Autodesk Viewer (欧特克官方云看图)', rating: 9.9, metrics: [{ name: '渲染保真度', score: 5 }, { name: '剖切测量力', score: 5 }, { name: '数据安全性', score: 4 }], pros: ['支持超 80 种工程格式', '完全保留参数属性层次树'], cons: ['不支持实时双向在线批注对讲'], officialUrl: 'https://viewer.autodesk.com/', verdict: '完全免费且最强大的在线 WebGL 看图平台，其 Forge/APS 引擎对各类 3D 格式图纸拟合程度无与伦比。' },
      { name: 'GrabCAD Viewer / Workbench', rating: 9.5, metrics: [{ name: '渲染保真度', score: 4 }, { name: '剖切测量力', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['集成了社区版本控制', '尺寸测量精度极佳'], cons: ['需要登录且对移动端性能要求高'], officialUrl: 'https://grabcad.com/', verdict: '机械设计师最爱的免费协同看板，对大型 SLDASM 或 STEP 结构的加载平滑度极高。' },
      { name: 'SketchUp Viewer for Web', rating: 9.2, metrics: [{ name: '渲染保真度', score: 4 }, { name: '剖切测量力', score: 3.5 }, { name: '数据安全性', score: 4 }], pros: ['网页端秒开 SKP 场景', '自带场景样式与阴影调整'], cons: ['对 SolidWorks 等工业装配支持一般'], officialUrl: 'https://www.sketchup.com/', verdict: '专为景观、家装及舞美设计师提供的云端方案，完美同步图层可见性与场景页面。' }
    ],
    bestPractices: [
      { title: '务必启用分享链接失效机制', desc: '在向客户分享 WebGL 视角链接时，请务必设置访问有效期（如 7 天后失效）以及防下载保护。' },
      { title: '轻量化减面后再上传', desc: '对于极大的机械零件，上传前建议在本地运行“降噪（Simplify Mesh）”处理，去除无谓的螺纹、齿轮细部以防止网页崩溃。' },
      { title: '禁止未授权外部索引', desc: '企业共享平台需配置 robots.txt 及访问权限策略，彻底屏蔽搜索引擎的探测。' }
    ],
    faqs: [
      { question: '网页旋转模型时画面闪烁卡顿怎么解决？', answer: '这多是因为您的浏览器没有开启硬件加速，导致 WebGL 处于 CPU 软解渲染状态。建议在 Chrome 设置 ➔ 系统中勾选“使用硬件加速”。' },
      { question: '为什么装配体导入后很多零件显示缺失？', answer: '像 SolidWorks 的 `.sldasm` 装配体文件本身不含几何实体，而是引用了同级目录下的 `.sldprt` 零件。您需要将整个装配体和所有引用的零件文件打包成 `.zip` 压缩包一并上传解析。' }
    ]
  },
  {
    slug: 'online-point-cloud-to-mesh-converter',
    title: 'Online Point Cloud (LAS/PTS) to Watertight Mesh Converter',
    seoTitle: 'Best Online Point Cloud (LAS/PTS) to Watertight Mesh Converters',
    seoDesc: 'Lookup online tools to convert LiDAR point clouds (LAS/PTS) to watertight CAD meshes. Compare reconstruction quality.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '激光雷达扫描获取的亿万点云坐标数据（LAS/PTS/XYZ），如果直接载入普通建模软件，很容易导致运行内存直接撑爆。因此，我们需要通过云端算法对点云进行降噪、精简，并重建为由三角面片构成的封闭几何网格（Watertight Mesh，如 OBJ、DXF、STL）。',
    riskWarning: '测绘及三维扫描数据（如地形图、历史古建数字化扫描、敏感国防厂区等）属于高度受限数据。请确保上传的云平台符合国家数据出境合规标准，高密项目请全部在本地局域网集群上使用开源的 CloudCompare 进行处理。',
    recommendedTools: [
      { name: 'CloudCompare (开源本地/云处理利器)', rating: 9.9, metrics: [{ name: '重组精准度', score: 5 }, { name: '数据吞吐力', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['完全开源免费', '顶级降噪和网格泊松重建算法'], cons: ['界面略显陈旧，有一定学习门槛'], officialUrl: 'https://www.danielgm.net/cc/', verdict: '全球学术界和工程界公认的顶级点云处理基石，其网格化重建（Poisson Reconstruction）保真度最高。' },
      { name: 'MeshLab (专业网格三角化工作台)', rating: 9.6, metrics: [{ name: '重组精准度', score: 4.5 }, { name: '数据吞吐力', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['支持大范围网格编辑修补', '丰富的纹理映射算法'], cons: ['处理超大几十G点云时容易崩溃'], officialUrl: 'https://www.meshlab.net/', verdict: '经典的开源三维网格处理中心，对转换后的三角网络做光滑处理、减面优化是其核心优势。' },
      { name: 'Autodesk ReCap Pro Cloud Services', rating: 9.2, metrics: [{ name: '重组精准度', score: 4 }, { name: '数据吞吐力', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['完美无缝对齐 Civil 3D 与 Revit', '云端自动化集群渲染'], cons: ['需要高级订阅套餐，性价比一般'], officialUrl: 'https://www.autodesk.com/', verdict: '欧特克生态下的测绘点云处理工具，支持将照片和扫描点云批量转换并在 CAD 软件中做参照。' }
    ],
    bestPractices: [
      { title: '执行本地分层稀疏化 (Decimation)', desc: '在网格化之前，对点云以指定空间步长（如 10mm）进行均值采样稀疏化，剔除 90% 重复空间点，保留关键轮廓即可。' },
      { title: '泊松表面重建 (Poisson Reconstruct)', desc: '重建参数中的 Octree Depth（八叉树深度）决定了重建精度。建议设置在 8-10 之间，过大容易耗光显存。' },
      { title: '使用隔离物理工作站', desc: '国家级地理测绘数据严禁上网，必须使用专机专线进行本地离线计算。' }
    ],
    faqs: [
      { question: '转换出来的网格模型为什么有大量破洞和飞线？', answer: '这代表点云在扫描时存在阴影死角。需要在 MeshLab 中执行“封闭孔洞 (Close Holes)”和“清理孤立图元 (Remove Isolated Pieces)”等网格修补命令。' },
      { question: 'LAS 和 PTS 格式在数据上有何不同？', answer: 'LAS 是美国摄影测量与遥感协会制定的二进制测绘格式，保留了激光反射强度、GPS 时间等元数据；PTS/XYZ 是纯文本坐标格式，读取相对较慢。' }
    ]
  },
  {
    slug: 'online-dwg-to-dxf-batch-converter',
    title: 'Online Bulk DWG / DXF Format Mutual Converter',
    seoTitle: 'Best Online Bulk DWG to DXF Batch Converters Review',
    seoDesc: 'Benchmark bulk DWG to DXF batch online converters. Find speed-optimized translators that keep text encoding and scripting safety.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '对于需要导入非 AutoCAD 绘图系统、激光切板软件或开展自定义脚本读取的用户而言，DWG 这个闭源的二进制数据库非常难以直接提取。将其批量且安全地转换为开放的 ASCII/Binary DXF 格式是解决行业互联的通用桥梁。但在转换中，文字编码破损和线型失效非常高频。',
    riskWarning: '批量转换代表着图纸资产的集中处理，极易在打包上传时被外部抓取工具进行服务器日志拦截。对于涉及敏感商业机密的图纸集群，应完全规避在线公共云转换，建议通过编写本地 AutoLISP 脚本命令自动在本地调用 ODA 文件转换器。',
    recommendedTools: [
      { name: 'ODA File Converter (官方数据转换程序)', rating: 9.9, metrics: [{ name: '转换精确度', score: 5 }, { name: '批量吞吐力', score: 5 }, { name: '安全性', score: 5 }], pros: ['纯本地离线执行', '完全开源免费且跨平台'], cons: ['需要下载客户端，命令行参数需要配置'], officialUrl: 'https://www.opendesign.com/', verdict: '业内最严谨的图纸格式互转基石，对 DWG / DXF 各个大版本的转换结果数据最纯净、无任何冗余垃圾字典。' },
      { name: 'Any DWG DXF Converter', rating: 9.6, metrics: [{ name: '转换精确度', score: 4.5 }, { name: '批量吞吐力', score: 5 }, { name: '安全性', score: 4.5 }], pros: ['独立的 Windows 小程序', '拖拽支持上千个文件排队'], cons: ['软件界面偏老，商业版需付费'], officialUrl: 'https://anydwg.com/', verdict: '老牌转换小工具，支持双向一键互转，速度和批量性能经过工程考验，稳定高效。' },
      { name: 'Convertio (万能云转换器)', rating: 9.1, metrics: [{ name: '转换精确度', score: 4 }, { name: '批量吞吐力', score: 4 }, { name: '安全性', score: 3 }], pros: ['免去下载，浏览器一键运行', '支持批量并发任务'], cons: ['免费版单文件大小受限'], officialUrl: 'https://convertio.co/', verdict: '大名鼎鼎的通用格式转换云服务，在转化轻量级二维工程图时，出图效率极快。' }
    ],
    bestPractices: [
      { title: '优先选择 ASCII DXF 格式', desc: '如果转换是为了后期进行 Python 脚本分析或文字提取，请在转换配置中指定输出为 ASCII 编码的 DXF。' },
      { title: '本地 AutoLISP 批量处理', desc: '可直接在 CAD 里加载脚本：在命令行输入 `(foreach dwg (list ...) (command "_SAVEAS" "DXF" ...))` 运行全自动本地降级转换。' },
      { title: '限制外网脚本回传', desc: '使用带防遥测配置的企业防火墙，屏蔽不必要的端口，防范合规侦测。' }
    ],
    faqs: [
      { question: 'DXF 的二进制 (Binary) 与文本 (ASCII) 格式有什么区别？', answer: 'ASCII 格式是纯文本文件，虽然体积大，但可用记事本直接读取和修改数据；Binary 格式经过压缩，文件体积小，读取载入速度更快，但无法直接用文本方式编辑。' },
      { question: '为什么互转后，图纸里的动态块无法编辑？', answer: '有些动态块信息属于 AutoCAD 专有的高层类（ArRx）。转换成 DXF 时，若版本太低，数据库会退化它们，导致再次导入后丧失滑块等拉伸手柄。' }
    ]
  },
  {
    slug: 'online-ifc-viewer-validator',
    title: 'Online openBIM IFC Standard File Validator & Viewer',
    seoTitle: 'Best Online openBIM IFC Validators & WebGL Viewers',
    seoDesc: 'Compare buildingSmart certified IFC online validators and lightweight viewers. Check geometric watertightness and properties audit.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '为了确保 BIM 协同模型在进入下游造价、能耗分析或交付政府归档时 100% 符合 buildingSmart 规范，开发与运维人员急需对 IFC 模型的元数据字典（Data Dict）、多面体几何封闭性（Watertightness）及父子拓扑嵌套关系进行自动化校验。',
    riskWarning: 'IFC 是全生命周期建筑大数据的聚合体。不慎上传至存在数据监控的公共看图站点可能会将项目的物理结构暴露无遗。请优先使用经过 buildingSmart 标准组织认证的安全校验客户端，严禁直接上传政府涉密或军工项目图纸。',
    recommendedTools: [
      { name: 'BIMcollab Zoom (专业 BIM 校验看板)', rating: 9.9, metrics: [{ name: '校验精确度', score: 5 }, { name: '数据展现力', score: 5 }, { name: '合规校验力', score: 5 }], pros: ['深度支持 Smart Views 数据筛选', '极致平滑的超大模型加载'], cons: ['商业高级模块需要订阅收费'], officialUrl: 'https://www.bimcollab.com/', verdict: '全球建筑大厂做 IFC 规则校验和设计碰撞的首选桌面端利器，校验报告非常严谨。' },
      { name: 'Solibri Anywhere (经典 IFC 质量审计程序)', rating: 9.7, metrics: [{ name: '校验精确度', score: 5 }, { name: '数据展现力', score: 4.5 }, { name: '合规校验力', score: 4.5 }], pros: ['完全免费下载', '强大的属性分类检验功能'], cons: ['安装包较大，运行较占内存'], officialUrl: 'https://www.solibri.com/', verdict: '老牌芬兰 BIM 审计开发商推出的查看器，对构件的分类映射关系审查细致入微。' },
      { name: 'xBIM Xplorer (开源轻量级校验核心)', rating: 9.4, metrics: [{ name: '校验精确度', score: 4 }, { name: '数据展现力', score: 4 }, { name: '合规校验力', score: 4 }], pros: ['100% 免费开源', '基于 .NET 架构极易进行二次开发'], cons: ['默认 UI 界面简易，需要自行美化'], officialUrl: 'https://github.com/xBimTeam', verdict: '开源 BIM 数据解析库的代表，非常适合软件开发者用于搭建自主的 Web 校验后台。' }
    ],
    bestPractices: [
      { title: '执行 Schema 基础格式验证', desc: '确认 IFC 头文件中的 MVD（模型视图定义）和 IFC2X3_TC1 或 IFC4 声明无损坏。' },
      { title: '使用本地隔离检测', desc: '涉密项目在隔离的测绘专机上采用 Solibri 离线校验，严禁配置任何网络同步。' },
      { title: '配置防盗版防御隔离', desc: '建立基于局域网的离线数据审查规范，屏蔽无关网络流量。' }
    ],
    faqs: [
      { question: 'IFC 的 Schema 报错 “Unknown Entity” 是什么原因？', answer: '这代表生成该模型的导出引擎写入了不符合 buildingSmart 官方规范的自定义专有构件名称。可在校验器里设定属性重映射进行过滤。' },
      { question: '如何判定 IFC 模型中的网格是否 Watertight（不漏水）？', answer: '可以使用 Solibri 等工具的几何自相交与破洞探测规则，扫描是否包含多余的三角面重叠或者缺失面导致的空间泄漏。' }
    ]
  },
  {
    slug: 'online-point-cloud-las-to-dxf-contour',
    title: 'Online Point Cloud LAS to DXF Terrain Contour Generator',
    seoTitle: 'Best Online Point Cloud LAS to DXF Contour Tools Review',
    seoDesc: 'Benchmark online utilities to generate DXF topographic contours from raw LiDAR LAS files. Learn terrain elevation mapping.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '测绘与路桥设计的一大痛点是：从激光雷达点云（LAS）或高程文本中手工拟合等高线图纸不仅耗时，而且极易出现局部曲面凹陷。云端 Contours 等高线提取器能快速计算数字高程模型（DEM），并直接为 Civil 3D 或 MicroStation 输出平滑的地形 DXF 矢量图纸。',
    riskWarning: '高精度地理空间三维坐标和测绘点云数据直接关系国家物理信息安全，在上传至非认证的境外云服务商时需格外警惕合规风险。针对常规工民建项目，可采用局域网内离线软件提取，规避违反数据合规出境。',
    recommendedTools: [
      { name: 'Global Mapper (专业测绘与地形综合工作站)', rating: 9.9, metrics: [{ name: '等高线生成精度', score: 5 }, { name: '大规模数据支持', score: 5 }, { name: '安全性', score: 5 }], pros: ['支持各类点云过滤算法', '等高线平滑与网格导出无暇'], cons: ['商业全功能版授权价格高'], officialUrl: 'https://www.bluemarblegeo.com/', verdict: '无可替代的地形和地理数据处理平台，对雷达高程数据重建三维地貌（Contours）的功能首屈一指。' },
      { name: 'Autodesk Civil 3D (官方路桥地形系统)', rating: 9.7, metrics: [{ name: '等高线生成精度', score: 4.5 }, { name: '大规模数据支持', score: 5 }, { name: '安全性', score: 4.5 }], pros: ['与 AutoCAD 界面完全无缝一致', '支持在曲面中实时动态调整间距'], cons: ['运行硬件要求极高'], officialUrl: 'https://www.autodesk.com/', verdict: '欧特克在市政与地理工程方面的基石，对点云直接建构曲面并拟合等高线（TIN Surface）最专业。' },
      { name: 'LAStools (极速命令行点云预处理包)', rating: 9.5, metrics: [{ name: '等高线生成精度', score: 4.5 }, { name: '大规模数据支持', score: 4.5 }, { name: '安全性', score: 5 }], pros: ['C++ 编写速度冠绝全球', '支持自动化脚本批量提取'], cons: ['纯命令行界面，非专业人员不易上手'], officialUrl: 'https://rapidlasso.de/', verdict: '享誉测绘界的点云数据流批处理神器，其 las2dem 和 las2shp 可以在秒级生成数亿点地形的等高线。' }
    ],
    bestPractices: [
      { title: '执行点云分类过滤 (Classify)', desc: '在拟合等高线前，必须运行地面点分类滤波算法（CSF），剔除植被、电线和建筑物点，仅保留 bare earth（裸土点）高程。' },
      { title: '设置合理的等高线间距 (Interval)', desc: '平坦地形设置 0.5 米或 1 米间距；山地可放宽到 5 米，防止生成的 DXF 线段过多导致 CAD 开图崩溃。' },
      { title: '本地脱网数据沙箱隔离', desc: '涉及地形勘测的大规模工程请在不插网线的独立沙箱电脑中处理。' }
    ],
    faqs: [
      { question: '为什么提取出来的等高线在 CAD 里呈“锯齿状”硬角？', answer: '这是由于拟合网格的分辨率设置过低。建议在 Civil 3D 导出时，勾选“等高线平滑（Contour Smoothing）”，选择使用贝塞尔曲线对其进行光滑插值。' },
      { question: '如何判定 LAS 文件中的坐标系是否正确？', answer: 'LAS 文件头中含有 WKT 格式的投影空间描述。可以使用全局测绘工具核对 EPSG 代码（如 CGCS2000 对齐 WGS84），防止导入 CAD 后产生数百公里的坐标漂移。' }
    ]
  },
  {
    slug: 'online-solidworks-e-drawings-cloud-viewer',
    title: 'Online SolidWorks eDrawings (SLDPRT/SLDASM) Viewer',
    seoTitle: 'Best Online SolidWorks eDrawings SLDPRT/SLDASM Viewers',
    seoDesc: 'Lookup and benchmark online SLDPRT and SLDASM viewers. Verify CAD file rendering fidelity and review sharing privacy rules.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '当您需要向客户或工厂发包 SolidWorks 零件（.sldprt）或装配体（.sldasm）时，安装大型商业 CAD 软件非常不便。利用在线 eDrawings 渲染层，用户可以直接在浏览器 WebGL 中浏览三维实体、查看装配层次树（Component Tree）、隐藏/显示构件以及测量关键配合面间距。',
    riskWarning: '三维零件图纸包含完整的参数特征树与公差工艺。上传到公共未知看图平台可能会触发商业遥测以及泄漏核心知识产权。针对敏感装配体，请引导用户下载达索系统官方免费的 eDrawings Viewer 本地版，严禁使用非合规的云看图网站。',
    recommendedTools: [
      { name: 'eDrawings Viewer (达索系统官方免激活看图器)', rating: 9.9, metrics: [{ name: '图纸还原度', score: 5 }, { name: '三维测量度', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['官方底层数据库引擎', '支持导出自解压的可执行EXE文件'], cons: ['需要下载客户端，体积约几百MB'], officialUrl: 'https://www.solidworks.com/', verdict: '达索系统官方出品的看图与分发利器，最权威，100% 还原曲面贴图及动态运动副。' },
      { name: 'Autodesk Viewer (官方多格式浏览器)', rating: 9.6, metrics: [{ name: '图纸还原度', score: 4.5 }, { name: '三维测量度', score: 4.5 }, { name: '数据安全性', score: 4 }], pros: ['支持超大规模装配包在线解压', '支持 Web 标注'], cons: ['必须登录 Autodesk 账号'], officialUrl: 'https://viewer.autodesk.com/', verdict: '欧特克云端看图器对于达索格式的兼容极为完美，也是免装软件查看 sldprt 的极佳方案。' },
      { name: 'CAD Exchanger Web SDK', rating: 9.3, metrics: [{ name: '图纸还原度', score: 4 }, { name: '三维测量度', score: 4.5 }, { name: '数据安全性', score: 4 }], pros: ['极速加载 WebGL 层', '支持在移动端快速切图'], cons: ['高级协作功能需集成购买'], officialUrl: 'https://cadexchanger.com/', verdict: '对工业级三维格式解析透彻，适合团队做敏捷开发集成。' }
    ],
    bestPractices: [
      { title: '装配体打包压缩上传', desc: 'SolidWorks 装配体（sldasm）不含几何数据。请使用“打包 (Pack and Go)”功能，将装配体及其关联的全部零件（sldprt）收录至一个 .zip 包中上传。' },
      { title: '本地清除螺纹等高模特征', desc: '在分享或上传前，在本地压缩去除螺纹、齿轮和细微紧固件的详细特征，将模型轻量化，防止看图网页直接内存溢出闪退。' },
      { title: '屏蔽外链数据监听', desc: '确保检测环境不泄露 IP 与企业域，防范版权代理商的主动遥测定位。' }
    ],
    faqs: [
      { question: '为什么导入后模型呈现“灰白色”且材质丢失？', answer: '这代表您的 sldprt 在保存时没有把材质贴图库（Texture Maps）固化至文件中，或者引用的外观图片路径丢失。在上传打包时，确保将材质资源也选上。' },
      { question: 'eDrawings 能否支持测量装配间隙？', answer: '能。官方 viewer 提供专门的测量测量（Measure）指令，只需在 WebGL 中点击两个相对面，它会自动计算最小中心距、法线距离和投影偏角。' }
    ]
  },
  {
    slug: 'online-dwg-compare-diff-viewer',
    title: 'Cloud DWG Revision Difference & Compare Visualizer',
    seoTitle: 'Best Cloud DWG Revision Compare & Diff Tools Review',
    seoDesc: 'Compare DWG revision difference online. Review high-fidelity visual overlays, red/green entity highlighting, and version controls.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '在处理大型建筑或机电工程的多次版次变更时，找出两版 DWG 图纸的微小物理变化是一大难题。单纯靠人工校对极易遗漏。利用云端 DWG Revision Compare 差异比对程序，可以实现高精度的叠图比对，自动使用红、绿两色高亮标注新图纸的增、删和修改实体。',
    riskWarning: '改动图纸往往代表着工程的核心变更和商业预算底牌。将两版 DWG 集中上传到不知名看图对比网站非常危险。如果条件允许，请优先在本地运行 AutoCAD 的 COMPARE（图形比较）命令，严禁使用非受信公共云服务以防商业机密泄露。',
    recommendedTools: [
      { name: 'AutoCAD DWG Compare (官方本地内置命令)', rating: 9.9, metrics: [{ name: '比对精确度', score: 5 }, { name: '红绿高亮保真', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['本地运行无需连网', '支持把比对差异另存为新图'], cons: ['需要安装 CAD 本地客户端'], officialUrl: 'https://www.autodesk.com/', verdict: '官方底层的图形比较功能，算法最强，不仅能识别几毫米的线条移动，还能识别块属性的改动。' },
      { name: 'Autodesk Viewer Compare Services', rating: 9.6, metrics: [{ name: '比对精确度', score: 4.5 }, { name: '红绿高亮保真', score: 4.5 }, { name: '数据安全性', score: 4 }], pros: ['网页端即可运行', '支持布局空间比较'], cons: ['需要注册账号登录'], officialUrl: 'https://viewer.autodesk.com/', verdict: '欧特克云端看图器提供的免费比对扩展，能够极好地把两个版次的图纸重叠并调整透明度进行校验。' },
      { name: 'DraftSight Compare Drawings Utility', rating: 9.2, metrics: [{ name: '比对精确度', score: 4 }, { name: '红绿高亮保真', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['轻量级独立桌面级比对', '对平替软件用户最友好'], cons: ['对嵌套块（Nested Blocks）的深层更改识别有限'], officialUrl: 'https://www.draftsight.com/', verdict: '性能优秀的本地图纸版本比对套件，对大文件运行依然有良好支持。' }
    ],
    bestPractices: [
      { title: '对齐原点与基准点', desc: '比对前，必须确保两个版次图纸的模型空间原点（0,0,0）完全对齐。如果原点发生偏差，比对结果会误报全图图元都在移动。' },
      { title: '本地炸开嵌套引用', desc: '对于复杂的图纸，比对前可以先执行 EXPLODE（炸开）那些自定义块和嵌套的外部参照（Xrefs），以防比对算法将它们直接算作单一删除动作。' },
      { title: '脱网单机校验保障', desc: '敏感的招标图纸应在没有网络访问的专机上进行 AutoCAD 本地图纸比对。' }
    ],
    faqs: [
      { question: '比对结果里的红、绿、灰三种颜色都代表什么？', answer: '根据官方通用规范：绿色代表仅在当前新版图纸中存在的图元（新增）；红色代表仅在旧版图纸中存在（已被删除）；灰色代表两个版次完全一致没有改动的图元。' },
      { question: '比对能识别到表格里的文字文字改动吗？', answer: '可以。只要是以 MTEXT（多行文字）或 DTEXT（单行文字）存储的实体，位置或内容发生哪怕一个标点符号的修改，都会被高亮圈出来。' }
    ]
  },
  {
    slug: 'online-image-jpg-to-dxf-vectorizer',
    title: 'Online Image Raster (JPG/PNG) to Vector DXF Tracer',
    seoTitle: 'Best Online Image JPG/PNG to Vector DXF Tracers Guide',
    seoDesc: 'Compare image raster to vector DXF online tracers. Review vectorization accuracy, bezier arc fitting, and outline detection.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '将手绘草图、扫描版蓝图或 JPG/PNG 像素图无损转换为能在 CAD 中进行拉伸编辑的 DXF 矢量线条（线段与圆弧），是实现图纸数字化的关键。普通的自动描摹工具往往会产生几万个细碎的锯齿短折线，导致导入 CAD 后软件直接卡死。本评测筛选了具备贝塞尔曲线拟合和边缘锐化算法的顶级引擎。',
    riskWarning: '有些扫描版图纸来自政府旧档或涉密企业老厂房扩建。把这类敏感图像上传至不知名在线矢量化网站极易引发机密泄漏风控。常规项目应使用本地 Illustrator 或 Vectorization 独立单机程序进行处理，杜绝网络传输隐患。',
    recommendedTools: [
      { name: 'Vectorizer.io (专业级矢量化云服务)', rating: 9.8, metrics: [{ name: '折线拟合度', score: 5 }, { name: '贝塞尔控制', score: 5 }, { name: '降噪处理力', score: 4.5 }], pros: ['支持全自动曲线平滑插值', '丰富的色彩分层导出'], cons: ['免费额度较少，大文件需要订阅'], officialUrl: 'https://www.vectorizer.io/', verdict: '目前在线像素描摹领域中最智能的引擎，拟合出的 DXF 矢量线段非常光滑，极少产生硬角碎线。' },
      { name: 'Autotrace (经典开源图像跟踪套件)', rating: 9.5, metrics: [{ name: '折线拟合度', score: 4 }, { name: '贝塞尔控制', score: 4 }, { name: '降噪处理力', score: 5 }], pros: ['100% 免费开源', '支持本地命令行批量操作'], cons: ['无可视化高级实时微调面板'], officialUrl: 'https://github.com/autotrace/autotrace', verdict: '老牌且实力雄厚的开源图像描摹引擎，非常适合用于服务器端批处理及编程二次开发开发。' },
      { name: 'WinTopo (专业工程级图像矢量化工具)', rating: 9.2, metrics: [{ name: '折线拟合度', score: 4.5 }, { name: '贝塞尔控制', score: 4 }, { name: '降噪处理力', score: 4 }], pros: ['专为工程地质和扫描机械图纸优化', '支持一键骨架化（Skeletonization）'], cons: ['界面偏老，需要下载桌面端'], officialUrl: 'https://wintopo.com/', verdict: '工程图纸矢量化领域的常青树，其提取扫描线条中心线（骨架线）的算法特别精准，CAD 制图人员必备。' }
    ],
    bestPractices: [
      { title: '图纸预先高对比度处理', desc: '在描摹前，先在本地用 Photoshop 将图片转换为灰度图，并调整色阶将黑白对比拉到极致，消除多余灰度像素。' },
      { title: '执行本地降噪 (De-speckle)', desc: '剔除扫描图纸上细小的杂色点（斑点），否则描摹算法会为这些杂点生成上万个无意义的闭合微小多边形。' },
      { title: '本地无网专机跑 WinTopo', desc: '如果扫描原图带有地质测绘或设备大样，请下载本地离线程序在单机物理隔绝环境下完成矢量化。' }
    ],
    faqs: [
      { question: '为什么转换出来的线条有重影？', answer: '这多是因为描摹算法采用了“轮廓模式（Outline Mode）”把粗线条的两侧边缘都画出了线。对于工程图，应该选择“中心线模式（Centerline/Skeleton Mode）”提取中轴骨架。' },
      { question: '转换出来的线条精度不够怎么办？', answer: '图像分辨率（DPI）是决定描摹精度的核心。如果原图只有几百像素，转换结果必然失真严重。建议采用 300 DPI 以上的扫描版蓝图进行描摹。' }
    ]
  },
  {
    slug: 'online-step-to-obj-gltf-converter',
    title: 'Online STEP to glTF/OBJ Rendering Mesh Converter',
    seoTitle: 'Best Online STEP to glTF/OBJ Converters & Slicers',
    seoDesc: 'Compare the best tools to polygonize STEP boundary representation models to OBJ or glTF files for VR/WebGL development.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '工业 STEP (AP203/AP214) 格式是基于高度数学逻辑的边界表示法（B-Rep）存储的，其曲面在 WebGL 网页端（如 Three.js、Babylon.js）或三维渲染器（如 Unity, Blender）中无法直接直接解析渲染。必须将其多边形化（Polygonization）为三角网格格式（如 OBJ, glTF）。在重组中，面片接缝裂开以及网格密度过大卡死网页是常见痛点。',
    riskWarning: '工业级 STEP 三维模型涉及极其严密的产品机密设计与几何拓扑。使用在线网站将 STEP 转换成渲染格式时，极易被云端后台拦截并泄漏核心机密。针对绝密部件，请在本地使用 CAD Assistant 运行离线转换。',
    recommendedTools: [
      { name: 'CAD Exchanger (B-Rep 网格多边形编译器)', rating: 9.9, metrics: [{ name: '多边形化质量', score: 5 }, { name: '网格平滑度', score: 5 }, { name: '贴图法线保真', score: 4.5 }], pros: ['完美处理大装配体缝合', '生成高精度 glTF 格式'], cons: ['商业桌面版费用较高'], officialUrl: 'https://cadexchanger.com/', verdict: '业界公认三维几何格式解析力最强的底座程序之一，其网格化拟合算法极度平滑，法线无暇。' },
      { name: 'CAD Assistant (官方免费离线转换程序)', rating: 9.7, metrics: [{ name: '多边形化质量', score: 4.5 }, { name: '网格平滑度', score: 4.5 }, { name: '贴图法线保真', score: 5 }], pros: ['OCCT 官方底层，完全免费', '支持拖拽秒开，完全本地化'], cons: ['没有网页版，需要手动下载'], officialUrl: 'https://www.opencascade.com/', verdict: '基于 Open Cascade 核心的免费 3D 查阅和格式转换神器，无网络上传风险，安全性一流。' },
      { name: 'AnyConv STEP to OBJ', rating: 9.1, metrics: [{ name: '多边形化质量', score: 4 }, { name: '网格平滑度', score: 3.5 }, { name: '贴图法线保真', score: 4 }], pros: ['浏览器免注册一键转换', '处理速度极快'], cons: ['对高度嵌套的装配体容易丢失组件树'], officialUrl: 'https://anyconv.com/', verdict: '便利的在线多格式转化平台，适合设计师用来对单个非机密零件进行快速渲染格式转换。' }
    ],
    bestPractices: [
      { title: '精细调整弦高公差 (Chordal Deviation)', desc: '多边形化时，弦高偏差限制决定了圆柱面的面片数。通常设置 0.05-0.1mm 即可兼顾渲染平滑度和文件大小。' },
      { title: '优先选择压缩型 glTF (GLB) 格式', desc: 'glTF 格式支持物理渲染材质（PBR）且体积远小于 OBJ，是 WebWebGL 和 VR 开发的最佳首选。' },
      { title: '脱网单机 CAD Assistant 倒手', desc: '核心商业结构件的转换需彻底断开外网，使用 CAD Assistant 纯本地转换。' }
    ],
    faqs: [
      { question: '转换出来的 OBJ 在 Blender 里有很多破面接缝怎么处理？', answer: '这多是由于原 STEP 导出时曲面片拓扑未完全缝合（Sewing）。建议在 Blender 中选中所有顶点，执行“合并按距离（Merge by Distance）”命令进行缝合。' },
      { question: 'STEP 的 AP203 和 AP214 对网格化有何影响？', answer: 'AP203 不含颜色信息，网格化后全图呈统一灰白；AP214 完整保留了部件颜色和结构层级，推荐优先使用 AP214 进行转换。' }
    ]
  },
  {
    slug: 'online-dwg-layer-splitter-cloud',
    title: 'Online DWG Layer Splitter & Batch Drawing Separator',
    seoTitle: 'Best Online DWG Layer Splitters & Batch Separators',
    seoDesc: 'Compare online DWG layer splitters. Review batch level isolation, WBLOCK coordinate alignments, and custom layer script builders.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '处理极其庞大且包含建筑、机电、管路等几十个图层的总图时，为了将不同专业的图纸分发给不同的承包商，需要手工将其拆分为独立的单图层子 DWG。云端 DWG Layer Splitter 能批量识别图层表，自动在后端将其分离（WBLOCK 出图），并保持基准原点完全重合。',
    riskWarning: '总图代表项目全局的地理排布与全量机密。在公共云服务商上传总图极易遭遇全局泄露和合规稽查。请优先通过在本地 AutoCAD 内加载一段极简的 AutoLISP 脚本来进行本地图层拆分，禁止在公网直接解包处理。',
    recommendedTools: [
      { name: 'AutoCAD WBLOCK Command (原生图块写出指令)', rating: 9.9, metrics: [{ name: '图层分离精确度', score: 5 }, { name: '原点对齐保真', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['本地运行，0% 数据泄露', '100% 保持图纸数据库清洁'], cons: ['不支持多文件的拖拽队列'], officialUrl: 'https://www.autodesk.com/', verdict: '通过 CAD 内置命令运行 WBLOCK 配合 Layer Isolation (LAYISO) 是最干净、最安全的图层分割法则。' },
      { name: 'Any CAD Layer Splitter Script', rating: 9.5, metrics: [{ name: '图层分离精确度', score: 4.5 }, { name: '原点对齐保真', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['纯本地 LISP 或 Python 处理', '高吞吐批量并发'], cons: ['需要一点点基础的脚本配置'], officialUrl: 'https://github.com/', verdict: '基于 ODA 库编写的 Python 图纸处理脚本，能够在脱网电脑中快速分割上百张图纸的层级结构。' },
      { name: 'Convertio Bulk Separator', rating: 9.1, metrics: [{ name: '图层分离精确度', score: 4 }, { name: '原点对齐保真', score: 4 }, { name: '数据安全性', score: 3 }], pros: ['云端并行计算排队', '一键下载 ZIP 打包件'], cons: ['免费版大图纸可能超时报错'], officialUrl: 'https://convertio.co/', verdict: '适合外地出差且手头没有 CAD 软件时的紧急图纸分层查验与输出。' }
    ],
    bestPractices: [
      { title: '执行本地 PURE 净化', desc: '拆分前运行 PURGE 清理掉未引用的空图层，防止拆分出来的子图纸依然带有一堆无意义的空层列表。' },
      { title: '绝对保留坐标系一致性', desc: '写出新图块（WBLOCK）时，务必使用绝对零点（0,0,0）作为基准点，否则各子图纸在后期进行 XREF（外部参照）重合时会完全飘移错位。' },
      { title: '脱网单机 LISP 脚本部署', desc: '企业敏感总图的处理需在完全断网环境下使用 AutoLISP 或 Python 离线脚本一键拆分输出。' }
    ],
    faqs: [
      { question: '拆分出来的子图纸文件大小怎么还是跟原图一样大？', answer: '这代表原图中的大部分图元可能被包含在了外部参照（Xrefs）里，或者图纸中包含大量未清理的注册表垃圾实体（Regapps）。需要先绑定外部参照并彻底 purge 净化后再进行拆分。' },
      { question: '如何使用 LISP 脚本快速在本地拆分图层？', answer: '可以加载这段代码：`(foreach lay (layoutlist) (command "-WBLOCK" (strcat lay ".dwg") "" ...))` 它可以按照布局层和图层表将其秒级写出为本地文件。' }
    ]
  },
  {
    slug: 'online-skp-to-fbx-cloud-converter',
    title: 'Online SketchUp SKP to FBX Render Mesh Converter',
    seoTitle: 'Best Online SketchUp SKP to FBX Mesh Converters Review',
    seoDesc: 'Benchmark online utilities to convert SketchUp SKP scenes to textured FBX models. Review UV coordinate mapping and render exports.',
    categoryLabel: 'File Parser & Converter',
    painPointDesc: '将 SketchUp（SKP）设计的建筑或景观模型导入到高端渲染器（如 Twinmotion, Lumion, Unreal Engine）中时，直接导入 SKP 往往会导致 UV 贴图坐标发生严重错位、材质折射参数丢失以及复杂嵌套组件打散崩塌。转换成带有高保真材质贴图包（Textures）的 FBX 网格是业界标准方案。',
    riskWarning: '建筑设计与效果图场景（SKP）包含企业的设计机密和客户布局信息。商业云端转换工具可能会保存并泄露这些设计细节。为了防范商业风险，建议优先使用 SketchUp Pro 桌面版自带的“导出 3D 模型”功能，完全在本地单机导出。',
    recommendedTools: [
      { name: 'SketchUp Pro Native Export (官方原生桌面导出)', rating: 9.9, metrics: [{ name: 'UV贴图映射', score: 5 }, { name: '装配体层次', score: 5 }, { name: '数据安全性', score: 5 }], pros: ['官方原生底层贴图解包', '完美保留两面贴图（Double-sided）'], cons: ['需要商业桌面版授权'], officialUrl: 'https://www.sketchup.com/', verdict: '最完美的 FBX 导出方案。通过内置的导出配置面板可精确控制轴向、相机和材质贴图的打包输出。' },
      { name: 'SimLab SKP to FBX Plugin (专业渲染桥梁插件)', rating: 9.7, metrics: [{ name: 'UV贴图映射', score: 5 }, { name: '装配体层次', score: 4.5 }, { name: '数据安全性', score: 5 }], pros: ['针对虚幻引擎优化了面数结构', '支持保留 PBR 材质节点'], cons: ['需要作为插件安装且商业版收费'], officialUrl: 'https://www.simlab-soft.com/', verdict: '达索和舞美效果图设计团队最推崇的转化插件，对材质贴图映射（UV coordinates）的对齐质量最顶尖。' },
      { name: 'AnyConv SKP to FBX', rating: 9.0, metrics: [{ name: 'UV贴图映射', score: 3.5 }, { name: '装配体层次', score: 4 }, { name: '数据安全性', score: 4 }], pros: ['免登录拖拽即转', '处理速度极快'], cons: ['大范围场景转换时贴图可能发白缺失'], officialUrl: 'https://anyconv.com/', verdict: '适合设计师在出差或非工作电脑上对单个轻量级三维组进行临时的格式转换。' }
    ],
    bestPractices: [
      { title: '清理冗余材质和组件', desc: '导出前，在 SketchUp 窗口 ➔ 模型信息 ➔ 统计信息中点击“清除未使用项 (Purge Unused)”，可减小 FBX 50% 以上的体积。' },
      { title: '检查正反面材质贴图', desc: 'SketchUp 支持在物体的反面（Back face）贴图，但 FBX 默认只渲染正面。导出前将反面贴图反转（Reverse Faces）为正面，防止导入渲染器后贴图消失变黑。' },
      { title: '脱网单机 native 导出', desc: '企业大型项目方案的 FBX 转换必须完全在本地 SketchUp 客户端离线操作。' }
    ],
    faqs: [
      { question: '转换出的 FBX 导入 Unity 为什么全图比例变小了 100 倍？', answer: '这是因为 SketchUp 默认采用“英寸 (Inches)”作为底层系统单位。导出 FBX 时，在 Options 中必须将单位强制指定为“米 (Meters)”或“毫米 (Millimeters)”。' },
      { question: '为什么导出的模型树组件名称全是拼音或特殊乱码？', answer: 'FBX 格式在老版本驱动中对 Unicode 中文字符支持有限。建议在导出前，将 SketchUp 中的“组件（Components）”和“群组（Groups）”命名全部替换为英文或拼音。' }
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

  referralTools.forEach((tool) => {
    // Regular expression: find 'slug: "..."' and the nearest 'status: "coming-soon"' in the object
    const regex = new RegExp(`(slug:\\s*'${tool.slug}',[\\s\\S]*?status:\\s*)'coming-soon'`);
    if (regex.test(content)) {
      content = content.replace(regex, `$1'released',\n    releasedDate: '2026-06-05'`);
      console.log(`Updated status and releasedDate in config for: ${tool.slug}`);
      updatedCount++;
    } else {
      console.log(`Config for ${tool.slug} is already released or missing matching code block.`);
    }
  });

  fs.writeFileSync(toolboxDataPath, content, 'utf8');
  console.log(`Total database updates: ${updatedCount}`);
};

// 3. Generate Folder, page.tsx and calculator-client.tsx
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
console.log('All Category 2 referral assets generated and configured successfully!');
