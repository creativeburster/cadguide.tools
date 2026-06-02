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

---

## ⚙️ 3. 核心架构约束与 SEO 铁律 (Architecture & SEO Strict Constraints)

*   **0 服务器数据库 (Zero-Server-Load)**：由于百科和计算器是只读的内容，为保持边缘节点秒开性能并实现 $0 托管成本，生产环境严禁引入关系型/非关系型运行时数据库。
*   **构建期 SQLite 动态生成**：当页面达到上万级时，应采用构建期 SQLite 读取方案（读取本地 `wikihub.db` 并在静态编译期 `generateStaticParams` 渲染为 HTML），绝不能打包进客户端 JS 中。
*   **联盟转链对爬虫透明**：所有外部商户链接在 HTML 源码中必须呈现为直接、干净的官网 URL。禁止在源码里直接写死带有各种复杂参数的跳转链接，从而规避谷歌对门页（Doorway Page）和低质分销站点的算法降权。
*   **极度注重设计美学 (Premium Aesthetics)**：UI 必须使用 curated、HSL 调制的配色、精致的毛玻璃效果（Glassmorphism）和流畅的微交互。拒绝任何简陋粗糙的默认组件。
