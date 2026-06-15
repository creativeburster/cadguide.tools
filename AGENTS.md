<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🤖 CADGuide.tools AI Agent Guide & Rules (智能体开发与原则规范)

欢迎来到 `cadguide.tools` 的协作空间！为了保证多 Agent 协作的一致性、对用户表达的流畅性以及系统架构的纯净度，所有进入本项目的 AI 编码智能体必须严格遵循以下开发原则。

---

## 🇨🇳 1. 核心交互原则：必须使用中文回复用户 (Must Respond in Chinese)

*   **唯一例外**：除非用户在此后的 Prompt 中明确要求使用其他语言（如英语），否则**所有的聊天对话、工作进度总结以及交付描述，必须使用简体中文进行回复**。
*   **代码与文档**：代码中的注释、工程文件内的文本可以遵循项目常规的英文规范，但与用户的交互界面（聊天框）必须是中文。

---

## 📂 2. 项目核心知识图谱与文档索引 (Documentation Index)

在进行任何修改前，请务必仔细阅读并遵循以下存储在项目根目录和文档目录下的核心战略文档：

*   **项目灵魂与人格契约**：[SOUL.md](file:///f:/cad%20tools%20io/cadtools-cc/SOUL.md) — 记录了 Antigravity 的人格规范、已完成的重要里程碑和代码习惯。
*   **产品百科与计算器 PRD**：[WIKIHUB_PRD.md](file:///f:/cad%20tools%20io/cadtools-cc/docs/WIKIHUB_PRD.md) — 包含百科全量方案、只读静态 SQLite 架构设计以及 100 阶段落地开发计划。
*   **开发路线与内容生成计划**：[PLAN.md](file:///f:/cad%20tools%20io/cadtools-cc/PLAN.md) — 记录了五大交互计算器指标、跨软件长尾排错内容规划与开发阶段跟踪。
*   **用户画像与分销变现模型**：[PERSONA.md](file:///f:/cad%20tools%20io/cadtools-cc/PERSONA.md) — 记录了四类靶向设计师画像，以及基于客户端拦截的子联盟网络（Brandreward / Sovrn）的无缝转化逻辑。
*   **外链建设与推广指南**：[LINKBUILDING.md](file:///f:/cad%20tools%20io/cadtools-cc/LINKBUILDING.md) — 记录了海外高权重目录、替代平台提交文案包以及社交引流策略。

---

## ⚙️ 3. 核心架构约束与 SEO 铁律 (Architecture & SEO Strict Constraints)

*   **0 服务器数据库 (Zero-Server-Load)**：由于百科和计算器是只读的内容，为保持边缘节点秒开性能并实现 $0 托管成本，生产环境严禁引入关系型/非关系型运行时数据库。
*   **构建期 SQLite 动态生成**：当页面达到上万级时，应采用构建期 SQLite 读取方案（读取本地 `wikihub.db` 并在静态编译期 `generateStaticParams` 渲染为 HTML），绝不能打包进客户端 JS 中。
*   **联盟转链对爬虫透明**：所有外部商户链接在 HTML 源码中必须呈现为直接、干净的官网 URL。禁止在源码里直接写死带有各种复杂参数的跳转链接，从而规避谷歌对门页（Doorway Page）和低质分销站点的算法降权。
*   **极度注重设计美学 (Premium Aesthetics)**：UI 必须使用 curated、HSL 调制的配色、精致的毛玻璃效果（Glassmorphism）和流畅的微交互。拒绝任何简陋粗糙的默认组件。

---

## 🛡️ 4. 零穿帮、强自洽内容质量红线 (Zero-Degradation Content & Logic Constraints)

*   **严禁无脑随机拼凑**：全站禁止进行任何形式的“随机抓取词库、段落胡乱拼接”的灌水生成。所有长尾 Guides 技术指南必须基于逻辑 100% 自洽、合理的专业文章母版，通过属性分发实现规模化。
*   **强类型特征物理熔断**：在 `isArticleCompatibleWithTool` 过滤引擎中，必须以硬代码写死特征熔断，从源头杜绝“秦琼战关公”的不合理配置：
    *   *开源/免费软件*（如 FreeCAD, LibreCAD）：绝对不允许生成任何商业授权（License/FLEXlm/EULA 审计/Seat 采购）相关网页。
    *   *纯 2D 绘图 CAD*（如 QCAD, DraftSight）：绝对不允许生成 3D 实体（STEP/IGES/B-Rep）缝合、3D 打印切片、钣金折弯系数（K-Factor/G-Code）相关网页。
    *   *纯创意动画/渲染软件*（如 V-Ray, KeyShot, Blender）：绝对不允许生成电气原理图（IEC/Schematic）或建筑属性协同（IFC4/BEP）相关网页。
    *   *不支持 LISP/PGP 引擎软件*（如 Revit, SolidWorks）：绝对不允许生成 AutoLISP 脚本运行、PGP 命令简写别名配置、CUIX 菜单修改相关网页。
*   **行话方言映射适配 (Jargon Map)**：针对不同的软件门类（MCAD, BIM, AEC, Creative），必须调用其专属词汇字典进行本地化重写（如 AEC 替换为图纸/图层，MCAD 替换为 Feature Tree/Sketch），确保术语符合该领域高工的真实工作习惯。
*   **上线前的“极端用例”脑补推演**：AI 智能体在完成任何涉及网页数量扩增（如本轮 Guides 从 10 篇放宽至 20 篇）后，**必须在脑海中把最极端的工具配对（如 Revit 运行 LISP、V-Ray 配置电气原理图、Altium Designer 配置建筑 BEP）强行带入测试**，一旦有万分之一的张冠李戴风险，必须立刻加固熔断逻辑，否则严禁提交或部署。
