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

> [!NOTE]
> **🐙 官方 GitHub 仓库与账号规范 (GitHub Repository Info)**
> * 官方仓库地址：`https://github.com/creativeburster/cadguide.tools`
> * 默认生产分支：`main`
> * **迁移规范**：本项目已全量迁移至新 GitHub 账号 `creativeburster`。旧账号 `gstar-byte` 已废弃，严禁在任何脚本、配置、文档或外链中引用旧账号地址。

---

## 🇨🇳 1. 核心交互原则：必须使用中文回复用户 (Must Respond in Chinese)

*   **唯一例外**：除非用户在此后的 Prompt 中明确要求使用其他语言（如英语），否则**所有的聊天对话、工作进度总结以及交付描述，必须使用简体中文进行回复**。
*   **代码与文档**：代码中的注释、工程文件内的文本可以遵循项目常规的英文规范，但与用户的交互界面（聊天框）必须是中文。

---

## 📂 2. 项目核心知识图谱与文档索引 (Documentation Index)

在进行任何修改前，请务必仔细阅读并遵循以下存储在项目根目录的核心现行文档：

*   **产品需求与站点定位**：[`PRD.md`](./PRD.md) — 明确当前以 Toolbox 工程工具箱 + `/convert` 为第一核心、以纯信息聚合软件目录为辅的现行产品定位（原 Guides 已下线且后期形态待定）。
*   **Toolbox 工具优化唯一标准**：[`TOOLBOX_STANDARD.md`](./TOOLBOX_STANDARD.md) — `/toolbox/*` 计算器、速查表、解析器的手算复算、标准溯源及 E2E 验收标准。
*   **Directory 软件详情唯一标准**：[`DIRECTORY_TOOL_STANDARD.md`](./DIRECTORY_TOOL_STANDARD.md) — `/tools/[slug]` 纯聚合目录规范与 `/tools/autocad` 样板基准。
*   **用户画像与分销变现模型**：[`PERSONA.md`](./PERSONA.md) — 记录 B-End 目标受众画像及客户端子联盟拦截逻辑。
*   **外链建设与推广指南**：[`LINKBUILDING.md`](./LINKBUILDING.md) — 记录海外高权重目录、替代平台及社区分发策略。
*   **历史废止规划归档**：[`docs/archive/`](./docs/archive/README.md) — 存放 2026 年 4~7 月早期规划文档（已废止，严禁作为当前开发依据）。

---

## ⚙️ 3. 核心架构约束与 SEO 铁律 (Architecture & SEO Strict Constraints)

*   **0 服务器数据库 (Zero-Server-Load)**：全站通过 Next.js Static Export 编译为只读静态 HTML/CSS/JS，部署在 Cloudflare Pages 边缘节点，生产环境严禁引入运行时关系型/非关系型数据库。
*   **前端包体轻量化**：禁止将完整数据 JSON（如工具全量明细、完整转换器大表）直接打包进 `'use client'` 客户端组件 chunk；应使用构建脚本生成的轻量索引或在 Server Component 筛选后传参。
*   **单一规范 Sitemap 与 410 出清**：全站统一使用 [`src/app/sitemap.xml/route.ts`](./src/app/sitemap.xml/route.ts) 输出规范路由；已下线的历史 `/guides/*` 等无效路径在 [`functions/_middleware.js`](./functions/_middleware.js) 中统一返回 `410 Gone`，禁止在源码内链中引用非规范别名或已废弃路径。
*   **联盟转链对爬虫透明**：所有外部商户链接在 HTML 源码中必须呈现为直接、干净的官网 URL。禁止在源码里直接写死带有各种复杂参数的跳转链接，从而规避搜索引擎对门页（Doorway Page）和低质分销站点的算法降权。
*   **极度注重设计美学 (Premium Aesthetics)**：UI 必须使用协调的配色、精致的界面层次与清晰的微交互，拒绝简陋粗糙的默认组件。

---

## 🛡️ 4. 零穿帮、强自洽内容质量红线 (Zero-Degradation Content & Logic Constraints)

*   **严禁无脑模板拼凑**：全站禁止任何形式的“随机词库拼凑、跨工具套话复用”的灌水行为。无论是工具计算器说明还是软件目录数据，都必须贴合对应软件/工程领域的真实使用场景。
*   **强类型特征与适用边界熔断**：在维护工具列表、软件聚合页推荐或速查表映射时，严禁出现张冠李戴的工程逻辑冲突：
    *   *开源/免费软件*（如 FreeCAD, LibreCAD）：绝对不允许捏造商业授权（License/FLEXlm/EULA 审计/Seat 采购）描述或虚构付费价格。
    *   *纯 2D 绘图 CAD*（如 QCAD, DraftSight）：绝对不允许关联 3D 实体（STEP/IGES/B-Rep）缝合、3D 打印切片、钣金折弯计算工具。
    *   *纯创意动画/渲染软件*（如 V-Ray, KeyShot, Blender）：绝对不允许关联电气原理图（IEC/Schematic）或建筑属性协同（IFC4/BEP）内容。
    *   *不支持 LISP/PGP 引擎软件*（如 Revit, SolidWorks）：绝对不允许关联 AutoLISP 脚本、PGP 命令简写别名、CUIX 菜单操作。
*   **行话方言映射适配 (Jargon Map)**：针对不同的软件门类（MCAD, BIM, AEC, Creative），必须采用该领域工程师的真实专业术语与行业标准号（如 ISO、ASME、DIN、ASTM、NEC 等）。

---

## 🚫 5. 严格的 Git 推送禁令与 Cloudflare 构建额度守护 (Strict Git Push Ban & Cloudflare Build Shield)

*   **绝对禁止擅自 Git Push**：在任何情况下，AI 智能体**绝对不允许自主执行 `git push` 命令**。
*   **额度风控与成本控制**：由于站点部署在 Cloudflare，每次 push 都会触发全量构建（当前约 1,560+ 个静态页面），存在构建配额与服务成本限制，严禁以任何理由“抢跑推送”。
*   **标准工作流**：
    1. 智能体仅在本地 Workspace 修改代码，并通过 `npx tsc --noEmit` 和 `npm run build` 进行类型与构建校验。
    2. 校验成功后，只在本地完成 `git commit`，并在对话框中将构建输出呈报给用户。
    3. **有且仅有当用户在聊天对话中发出明确的“推送”或“push”字样时，智能体方可执行 `git push`**。
*   **违反后果**：未经用户首肯擅自执行 push 将被视为严重违规与逻辑越权故障。

---

## 📝 6. `/guides` 板块现状与约束（已下线，后期规划待定）

*   **已彻底下线**：原 `/guides/*` 长文指南板块已于 2026 年 8~9 月全量移除，目前代码库中不存在 `src/app/guides/` 路由，且边缘中间件 [`functions/_middleware.js`](./functions/_middleware.js) 对所有历史 `/guides/*` 访问返回 `HTTP 410 Gone`。
*   **后期规则待定**：站点当前重心为 `/toolbox/*`（工程工具箱）、`/convert/*`（格式转换指引）与 `/tools/*`（纯信息聚合目录）。未来是否以及如何重做真正具备实操价值的 Guide 内容尚未最终敲定。
*   **现阶段严格禁令**：在用户正式确立新版 Guide PRD 并发出指令之前，**严禁任何 Agent 擅自恢复 `/guides` 路由、生成任何指南文章，或在站内页面中添加指向 `/guides/*` 的链接**。


---

## 📐 7. Directory 软件详情页 (`/tools/[slug]`) 唯一标准规范 (Single Source of Truth)

> **🚨 核心定性原则（每个 Agent、每个会话必须知悉）**：
> `cadguide.tools` 的 Directory 目录本质上是一个**纯聚合目录（Directory Aggregator）**。每个 Tool 的信息**都不是自己写的，没有任何自撰内容或本站打分**，100% 全部来自**软件官网**和**权威第三方**（包括测评站点、G2/Capterra/TrustRadius/Gartner 等评分站点、Google 搜索排名靠前的目录站点及其他排名靠前的搜索结果）。
> - **静态信息直接写死**（官网简介、核心特征、套餐大概内容、技术规格、官网 FAQ、权威第三方优缺点与带日期的评分快照）。
> - **隔一段时间会变的信息或不同国家不一样的价格，一律直链官方**（具体价格直链软件官网定价页，评分直链各大评分网站，本站绝不自己打分、绝不自己编造内容）。

所有 AI 智能体在创建或修改 `/tools/[slug]` 软件详情页（涉及 `src/components/tool-detail-client.tsx`、`src/lib/data/c1.ts` ~ `c7.ts`、`src/lib/seo.ts`）时，**必须以 [`DIRECTORY_TOOL_STANDARD.md`](file:///F:/cadguide.tools/DIRECTORY_TOOL_STANDARD.md) 及样板页 [`/tools/autocad`](https://cadguide.tools/tools/autocad) 为唯一标准**，严禁自创评分体系或批量改写模板套话：

1. **最顶部内链标签行 (Top Internal Link Badges)**：必须尽可能多地链接本站真实存在的文章与聚合页（主分类目录 `/tools?category=...`、分类榜单 `/best/...`、授权模式 `/pricing/...`、全部支持的操作系统 `/platforms/...`、适用工程师角色 `/for/...`、行业 `/sectors/...`、核心格式 `/file-formats/...`、替代品页 `/alternatives/[slug]` 以及 `related_links` 中配置的本站专属 `/toolbox/...` 速查表与工具页）。
2. **严禁本站自评打分 (No Self-Assigned Score)**：全站取消 `★ 4.8 Expert Score` / `Editor Score` 本站自评。顶部标题下方与底部 `CADGuide Verdict` 区域统一展示主流第三方评分网站（G2、Capterra、TrustRadius、Gartner Peer Insights、GetApp 等）的真实分值、评论数、**分值核验日期 (`verified_date`，如 `Nov 2026`)** 并直链到对应评分网站（有 5 个显示 5 个，有 3 个显示 3 个）。
3. **产品文字描述 (`description`)**：直接从目标软件官网提取最权威、最醒目的官方介绍，禁止自行编造吹捧修辞。
4. **井号核心特征 (`#core_features`)**：选取该产品最核心、最主要、最广为人知的 5~7 个标志性特征，支持关联站内特性/格式专题链接。
5. **价格与套餐 (`pricing_tiers`)**：每个套餐显示官方真实套餐名称与包含的大概内容（权益列表），具体价格一律不写死金额数字，全部直链官方网站定价页 (`pricing_url`)。
6. **核心功能、规格与优缺点 (`detailed_features`, `tech_specs`, `pros`, `cons`)**：功能与技术参数严格核对官方文档力求准确完善；`pros` 与 `cons` 结合主流评测平台与 AI 综合调研写出 5~6 条具体、客观的完整说明，禁止只写两三个词的短语。
7. **常见问题 (`faqs`)**：优先直接采用目标软件官方网站上的官方 FAQ 问答，并附带官网对应链接，禁止凭空自造问答套话。

---

## 🧮 8. Toolbox 工具页 (`/toolbox/[slug]`) 优化与验收标准

修改任何 `/toolbox/*` 计算器、换算器、脚本生成器、诊断向导或速查表之前，**必须先读 [`TOOLBOX_STANDARD.md`](file:///F:/cadguide.tools/TOOLBOX_STANDARD.md)**。核心要求：

1. **能复算**：默认值、`toolbox-engineering-specs.json` 算例、E2E 断言三者为同一组数，且可手算验证。
2. **不编造**：标准号、CAD 别名、软件版本号、注册表键只写能查到官方出处的，查不到就删。
3. **E2E 必须断言真实数据**：默认值与修改值手算断言、空值不出现 NaN、下载文件内容、数据列表内容，并回归历史批次。
4. **报告附证据**：每项“已完成”附文件行号或 `git show --stat`；跳过的工具写明原因；全站遗留问题如实标注“另行处理”。
