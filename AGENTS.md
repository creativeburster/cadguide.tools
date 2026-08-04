<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🤖 CADGuide.tools AI Agent Guide & Rules (智能体开发与原则规范)

欢迎来到 `cadguide.tools` 的协作空间！为了保证多 Agent 协作的一致性、对用户表达的流畅性以及系统架构的纯净度，所有进入本项目的 AI 编码智能体必须严格遵循以下开发原则。

> [!IMPORTANT]
> **🌟 终极红线原则：绝对禁止擅自推送代码 (Strict Git Push Ban)**
> 无论在何种情况下，智能体**绝对不允许自主执行 `git push` 命令**！
> 必须在本地完成修改、本地通过 `npx tsc --noEmit` 和 `npm run build` 验证无误、提交 `git commit` 后，将状态呈报给用户。
> **只有当用户在对话中明确下达“push”或“推送”指令时，智能体方可执行推送。** 屡教不改者将被直接熔断或终止运行。

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
*   **用户画像与分销变现模型**：[PERSONA.md](file:///f:/cad%20tools%20io/cadtools-cc/PERSONA.md) — 记录了四类靶向设计师画像，以及基于客户端拦截 of 子联盟网络（Brandreward / Sovrn）的无缝转化逻辑。
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
    *   *开源/免费软件*（如 FreeCAD, LibreCAD）：绝对不允许生成 any 商业授权（License/FLEXlm/EULA 审计/Seat 采购）相关网页。
    *   *纯 2D 绘图 CAD*（如 QCAD, DraftSight）：绝对不允许生成 3D 实体（STEP/IGES/B-Rep）缝合、3D 打印切片、钣金折弯系数（K-Factor/G-Code）相关网页。
    *   *纯创意动画/渲染软件*（如 V-Ray, KeyShot, Blender）：绝对不允许生成电气原理图（IEC/Schematic）或建筑属性协同（IFC4/BEP）相关网页。
    *   *不支持 LISP/PGP 引擎软件*（如 Revit, SolidWorks）：绝对不允许生成 AutoLISP 脚本运行、PGP 命令简写别名配置、CUIX 菜单修改相关网页。
*   **行话方言映射适配 (Jargon Map)**：针对不同的软件门类（MCAD, BIM, AEC, Creative），必须调用其专属词汇字典进行本地化重写（如 AEC 替换为图纸/图层，MCAD 替换为 Feature Tree/Sketch），确保术语符合该领域高工的真实工作习惯。
*   **上线前的“极端用例”脑补推演**：AI 智能体在完成任何涉及网页数量扩增（如本轮 Guides 从 10 篇放宽至 20 篇）后，**必须在脑海中把最极端的工具配对（如 Revit 运行 LISP、V-Ray 配置电气原理图、Altium Designer 配置建筑 BEP）强行带入测试**，一旦有万分之一的张冠李戴风险，必须立刻加固熔断逻辑，否则严禁提交或部署。

---

## 🚫 5. 严格的 Git 推送禁令与 Vercel 额度守护 (Strict Git Push Ban & Vercel Shield)

*   **绝对禁止擅自 Git Push**：在任何情况下，AI 智能体**绝对不允许自主执行 `git push` 命令**。
*   **额度风控与成本控制**：由于 Vercel 部署存在构建配额与服务成本限制，且 6,160+ 个静态页面的项目全量渲染极为耗时，严禁以任何理由“抢跑推送”。
*   **标准工作流**：
    1. 智能体仅在本地 Workspace 修改代码，并通过 `npx tsc --noEmit` 和 `npm run build` 进行类型与构建校验。
    2. 校验成功后，只在本地完成 `git commit`，并在对话框中将构建输出呈报给用户。
    3. **有且仅有当用户在聊天对话中发出明确的“推送”或“push”字样时，智能体方可执行 `git push`**。
*   **违反后果**：未经用户首肯擅自执行 push 将被视为严重违规与逻辑越权故障。

---

## 📝 6. Guide 内容创作准则 (Guide Content Creation Principles)

### 核心规则
每篇 guide 必须基于**真实搜索需求和实际社区讨论**，不能凭空生成。

### 研究优先流程
1. **搜索量验证** — 确认话题有真实搜索需求（Google Trends、论坛提及、Reddit 帖子、Autodesk/SolidWorks 社区帖子）。
2. **来源收集** — 写作前收集 2+ 权威来源（官方文档、厂商 KB、社区帖子、有互动的 YouTube 教程）。
3. **综合改写** — 将多个来源整合为一个连贯叙述。禁止复制粘贴。用自己的话改写并加入实际经验。

### 语气与风格
- **去 AI 味** — 禁止使用 "In this comprehensive guide, we will explore…", "It's worth noting that…", "Delve into", "Navigate the complexities of", "In the realm of" 等 AI 典型措辞。
- **直接实用** — 像资深 CAD 管理员跟同事说话，不像教科书。
- **实战经验** — 引用真实场景（须来自可核实来源，见禁止事项）。

### 质量标准
- **1000+ 字** 每篇 guide
- **2+ 来源** 在 frontmatter `sources` 数组中引用
- **可操作步骤** — 每篇 guide 必须有具体修复步骤，不只是理论
- **无废话** — 每段都要传递信息， aggressively 删减填充内容
- **Frontmatter 必填** — title, excerpt, category, softwareSlug, keyword, slug, author, readTime, date, sources

### 分类
**选题由真实搜索需求决定，不是先定选题再填内容；但 `category` 字段必须从下列受控枚举中取值。**

流程：先搜索该工具的真实讨论、论坛帖子、搜索量数据 → 根据实际发现的内容确定选题与分类 → 分类只能取下方枚举之一。

受控枚举（与站点 UI 的 CATEGORY_LABELS 一一对应）：
- `troubleshooting` — 错误修复、崩溃、文件损坏
- `performance` — 速度优化、大文件、硬件
- `migration` — 版本升级、平台切换
- `standards` — 制图标准、合规、格式
- `procurement` — 许可、采购、审计
- `deployment` — 安装、网络配置、部署
- `manufacturing` — CAM、钣金、3D 打印
- `printing` — 打印、PDF 导出、打印标准
- `workflow` — 工作流程教程
- `comparison` — 软件对比

**严禁自造一次性分类值**（如 "crash-and-performance-errors"）：不在枚举内的分类值不会出现在 /guides 列表页的分类筛选下拉框中，相关文章匹配也会失效，等于把文章从站点导航中隐形。确需新增分类时，必须先同步更新 `src/app/guides/guides-list-client.tsx` 与 `src/app/guides/[slug]/page.tsx` 中的 CATEGORY_LABELS/CATEGORY_COLORS，再在 frontmatter 中使用。

**禁止按模板分配分类**（如"每个工具必须 1 篇 troubleshooting + 1 篇 performance…"）。每个工具的 guide 分类组合应反映该工具真实的搜索需求分布，不同工具的组合应该不同。

### 禁止事项
- 不研究真实需求就生成 guide
- 编造错误代码、文件路径或注册表键
- 适用于任何软件的通用建议
- AI 典型的对冲语言和元评论
- **杜撰虚构的个人经历** — 禁止编造"我在三台工作站上验证过"、"上周客户打电话说…"等无法核实的第一人称叙事。可以基于真实来源的内容用第一人称改写，但不得编造具体场景、数字和事件
- **预设分类再填内容** — 禁止先确定分类模板再据此生成 guide。分类必须由搜索调研中发现的真实话题决定
- **编造具体技术参数** — 如加工转速、进给速度、注册表路径等，除非来自可验证的来源。不确定时应标注"请参考厂商推荐参数"
