# Directory 软件详情页 (`/tools/[slug]`) 唯一标准规范 (Single Source of Truth)

> **适用范围**：`cadguide.tools` 下所有 `/tools/[slug]` 软件详情页（模板文件：`src/app/tools/[slug]/page.tsx`、`src/components/tool-detail-client.tsx`；数据文件：`src/lib/data/c1.ts` ~ `c7.ts`；SEO 结构化数据：`src/lib/seo.ts`）。
> **样板基准页**：[`https://cadguide.tools/tools/autocad`](https://cadguide.tools/tools/autocad)（修改任何其他软件详情页前，必须以 `autocad` 的数据结构与渲染效果为唯一基准，严禁任何 Agent 自创评分体系或批量改写模板套话）。

---

## 0. 最高总纲：纯目录聚合定位（零自撰内容，静态写死 vs 动态直链）

> **【每个 Agent、每个会话必须知悉并严格遵守的第一性原则】**
> 1. **本质是纯目录聚合（100% 来自官网与权威第三方，零自撰内容）**：
>    - `cadguide.tools` 的 Directory（`/tools/[slug]`）是一个**聚合目录（Directory Aggregator）**。
>    - 每个 Tool 页面上的所有信息**均不是本站自己撰写的**，没有任何主观生造的评论或本站自评打分，**100% 来自该软件官网（Tool Official Website）和权威第三方**。
>    - **“官方与权威第三方”的范围**：既包括目标软件官方网站，也包括权威测评站点、主流评分站点（G2、Capterra、TrustRadius、Gartner Peer Insights、GetApp、Software Advice 等）、Google 搜索结果排名靠前的权威目录站点，以及其他排名靠前的优质搜索结果。
> 2. **静态信息直接写死，动态/分地区变化的信息一律直链官方**：
>    - **静态信息直接写死**：官网产品核心定义（`description`）、最广为人知的核心特征（`#core_features`）、套餐包含的大概功能列表（`pricing_tiers.features`）、技术参数与支持格式（`tech_specs` / `file_formats_*`）、官网常见问答（`faqs`）、以及采自权威第三方的优缺点（`pros` / `cons`）和带日期的第三方评分快照（`external_ratings`），直接写死在数据文件中。
>    - **动态信息或不同国家不一样的价格一律直链官方**：隔一段时间就会变化的信息（如实时价格、试用期政策、实时版本号）以及不同国家/地区用户看到不一样的价格，**一律不写死具体金额或易过时数字，全部直接链接到软件官网或对应的权威第三方评分/目录站点**。

---

## 1. 最顶部内链标签行 (Top Internal Link Badges)

- **核心原则**：最顶部这一行胶囊标签（Badges）必须**尽可能多地链接到本站其他真实存在的聚合页、格式页、对比页与工具箱文章**，形成高密度的站内内链网（严禁产生 404 链接）。
- **必须包含的内链类型**：
  1. **主分类目录与分类榜单**：如 `2D CAD` → `/tools?category=c1`，`Best 2D CAD Picks` → `/best/2d-cad`。
  2. **授权模式聚合页**：如 `Subscription` → `/pricing/subscription`（或 `/pricing/perpetual`、`/free`、`/open-source`、`/pricing/freemium`）。
  3. **全部支持的操作系统聚合页**：不截断数量，支持几个平台就链接几个（如 `/platforms/windows`、`/platforms/mac`、`/platforms/web`、`/platforms/ios`、`/platforms/android`、`/platforms/linux`）。
  4. **适用工程师角色与行业聚合页**：自动或通过配置链接到 `/for/architects`、`/for/mechanical-engineers`、`/for/electrical-engineers`、`/for/civil-engineers` 及 `/sectors/...`。
  5. **核心原生文件格式百科页**：如 `DWG Native` → `/file-formats/dwg`、`DXF Support` → `/file-formats/dxf` 等。
  6. **替代品专题与本站专属工具页 (`related_links`)**：
     - 链接到该软件的替代品指南 `/alternatives/[slug]`（如 `AutoCAD Alternatives`）。
     - 链接到本站 `/toolbox/` 下与该软件直接相关的快捷键速查表、命令参考、排错向导或格式转换页（如 `/toolbox/autocad-shortcuts-sheet`、`/toolbox/autocad-250-commands-reference`、`/toolbox/dwg-file-size-reducer`）。

---

## 2. 顶部评分区域与“本站不评分”铁律 (Third-Party Ratings Only)

- **核心原则**：**本站自己不打分（No Self-Assigned Expert/Editor Score）**。取消单一的 `★ 4.8 Expert Score` 本站自评展示。
- **展示规范**：
  - 在产品标题下方，直接**批量展示主流第三方评分网站的真实分值、评论数量、直达外链，并明确注明分值采集日期（`verified_date`，如 `Nov 2026`）**。
  - 常见权威评分来源包括：`G2`、`Capterra`、`TrustRadius`、`Gartner Peer Insights`、`GetApp`、`Software Advice`、`SourceForge`、`Trustpilot`。
  - 每个评分徽章点击后直接跳转到对应第三方评分网站的该软件评测页面。

---

## 3. 产品核心文字描述 (`description`)

- **核心原则**：**直接从目标软件官方网站获取最权威、最醒目的产品定义与核心介绍**，严禁 Agent 自行编造空洞的吹捧套话（如“作为行业先驱……”等自创文学修辞）。
- **内容要求**：准确陈述该软件由哪家厂商开发、面向哪些工程专业人员、核心解决什么设计/建模/仿真问题，以及官方主打的工作流能力。

---

## 4. 井号核心特征标签 (`#core_features`)

- **核心原则**：选取该产品**最核心、最主要、行业内最广为人知的标志性特征**（通常 5~7 个）。
- **示例（以 AutoCAD 为例）**：
  - `#2D Drafting & Documentation`
  - `#3D Solid, Surface & Mesh Modeling`
  - `#Native .DWG File Format`
  - `#7 Industry Toolsets (Architecture, Mechanical, Electrical, MEP...)`
  - `#AutoLISP, ObjectARX & .NET Automation`
  - `#Smart Blocks & Markup Assist (Autodesk AI)`
  - `#AutoCAD Web & Mobile Apps`
- **内链增强**：若某个 `#标签` 对应本站已有的特性聚合页（`/best/feature/[slug]`）或格式页（`/file-formats/[slug]`），支持点击直接跳转。

---

## 5. 价格与套餐部分 (Full Pricing Breakdown)

- **核心原则**：因为同一软件在不同国家/地区、不同币种、不同税率及授权代理商下看到的价格差异很大，**全站一律不写死具体金额数字，所有价格查询全部直链官方网站定价页（`pricing_url`）**。
- **套餐卡片规范**：
  - 每个套餐卡片展示**官方真实套餐名称**（如 `Monthly Subscription`、`Annual Subscription`、`3-Year Subscription & Autodesk Flex`）及计费周期类型。
  - 卡片正文清晰列出**该套餐包含的大概内容与核心权益**（`features` 列表）。
  - 价格显示区域与底部行动按钮统一链接至官网定价页（`pricing_url || official_url`），提示用户点击查看所在国家/地区的官方实时价格。

---

## 6. 核心功能与技术规格 (`detailed_features` & `tech_specs`)

- **核心原则**：力求**准确、完善、贴合官方技术文档**，严禁跨类别张冠李戴。
- **规范要求**：
  - `detailed_features`（Key Capabilities）：按该软件的真实工程模块分为 3~4 个具体类别（每个类别 4~6 项真实功能），不写泛泛而谈的空词。
  - `tech_specs`（Technical Audit）：准确填写几何/绘图内核（`engine`）、CPU 多线程机制（`multicore`）、GPU 硬件加速 API（`gpu_optimization`，如 DirectX 12 / Metal / OpenGL）及核心行业标准（`standards`）。
  - `file_formats_in` / `file_formats_out` / `api_sdk` / `integrations`：严格核对官方导入导出支持列表与开发者文档。

---

## 7. 优缺点分析 (`The Pros` & `The Cons`)

- **核心原则**：结合主流评测网站（G2、Capterra、TrustRadius）、工程师社区真实反馈以及 AI 综合调研结果，写出**具体、客观、言之有物的优缺点**（每边 5~6 条）。
- **禁止事项**：禁止只写两三个单词的敷衍短语（如仅写 `"Expensive"`、`"High precision"`）。每条必须说明具体原因或工程场景（例如：说明为什么贵、对哪类团队有成本压力；说明在什么格式或工作流下兼容性好）。

---

## 8. 底部总结与评分网站矩阵 (`CADGuide Verdict`)

- **核心原则**：**本站不评分**。彻底移除底部深色卡片中的 `Editor Score: X.X / 5.0` 和 `Highly Recommended` 自评标签。
- **展示规范**：
  - 上半部分展示客观的行业选型结论（`expert_verdict`）。
  - 下半部分**直接展示并链接到该软件的主要第三方评分网站**：
    - 如果该软件有 **5 个**评分网站数据，就并列显示 **5 个**；如果有 **3 个**，就显示 **3 个**。
    - 每个评分卡片清晰展示：评分网站名称、真实得分（如 `4.4 / 5` 或 `8.8 / 10`）、评论数量、**分值核验日期（如 `Nov 2026`）**，点击直接跳转至该评分网站原页面。

---

## 9. 常见问题解答 (`Expert Q&A` / `Official FAQ`)

- **核心原则**：**优先直接采用目标软件官方网站上的 FAQ（Frequently Asked Questions）**，不要自己凭空编造问题。
- **规范要求**：
  - 选取官网产品页、订阅页或官方知识库中最核心的 6~8 个真实常见问题（如软件用途、订阅包含内容、版本差异、操作系统要求、免费试用/学生版政策、支持格式与二次开发 API 等）。
  - 回答内容以官方口径为准，并在涉及价格、试用、系统要求或开发文档时直接嵌入官网对应 URL 链接。
