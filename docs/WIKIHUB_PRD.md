# cadguide.tools WikiHub 与交互式计算器系统
## 产品需求文档 (PRD) — 版本 2.0 (全量战略、SEO与100阶段开发蓝图版)

本文件详细规定了 `cadguide.tools` 平台新增 **WikiHub (百科与教程中心)** 与 **Interactive Calculators (交互式纯前端计算器)** 的产品定位、长期战略路线、高强度 SEO 健壮性策略、模块具体规划、构建期只读数据架构，以及最终的 **100 阶段落地开发计划**。该文档旨在作为未来所有开发人员与 AI 编程智能体的终极权威指南。

---

## 1. 全局产品定位与商业战略 (Product Positioning & Strategy)

### 1.1 核心定位
`cadguide.tools` 是一个 **100% 独立、客观、中立的全球 CAD/BIM 软件评测、对比与导流目录站点**。
引入 **WikiHub** 与 **交互式计算器** 的目的，是使平台从单一的“软件目录黄页”升级为 **“面向全球专业工程师与设计师的完整技术知识与工具生态网”**。

### 1.2 商业与流量闭环
1.  **独立客观原则**：平台不偏袒任何单一厂商。即使引入商业赞助（如 GstarCAD、BricsCAD 等），也必须在具体场景下客观呈现其对比优势（如“低配置 PC 下的性价平替选项”），严禁破坏主目录的独立客观评级。
2.  **获取上游高意图流量**：通过技术排错（如 AutoCAD 闪退）、快捷键控制台等高频长尾词，吸引正处于“使用痛点期”或“软件替换评估期”的精准工程师用户。
3.  **内链漏斗转化**：将 Wiki 词条与具体软件的评测页（`/tools/[slug]`）和对比页（`/compare/...`）双向绑定，引导流量走向中立评测，最终实现广告点击、商业赞助推荐或正版购买的分流闭环。

### 1.3 行业深度洞察：为什么软件目录已达上限，而 WikiHub 才是无限增量？
*   **软件目录的物理上限**：全球 CAD/BIM 软件是一个高度成熟、行业壁垒极高、迭代极慢的工业软件领域。目前平台收录的 **240+ 款工具已基本网罗了全球所有的活跃软件**。在未来十年内，即使有新软件诞生，也多半是云原生或极细分行业的微创新，十年内全行业新增软件很难超过 50 款。因此，“评测目录”部分的维护工作已经处于收尾期。
*   **流量天花板与低频痛点**：纯粹的“软件目录站”流量天花板非常明显，因为用户只有在“选型购买软件”的决策瞬间才会去搜索软件名字。这属于超低频需求。
*   **WikiHub 的无限流量引擎**：当设计师与工程师选定并安装软件后，在他们日常工作的每一天，都会频繁遇到“闪退报错”、“快捷键不灵”、“PDF打印乱码”、“视口比例换算”等高频实操痛点。这些痛点衍生出了**数十万个高意图的搜索长尾词，这是源源不断的百万级流量蓝海**。通过 WikiHub 将 240+ 款软件的日常使用痛点全部包下来，是实现站点流量呈指数级增长的唯一路径。

---

## 2. 运营与技术“三不原则” (The 3 "No" Principles)

为了维持站点的高性能与 Google 排名，后续开发必须恪守以下三大底层运营与技术底线原则：

### 原则一：日活（DAU）突破 10,000 前，绝对不做多语言 (No i18n initially)
*   **SEO 权重分裂问题**：一旦过早引入多语言子路由（如 `/es/`、`/ja/`），搜索引擎的爬虫会将站点的整体 Link Equity (链接权益/权重) 分散稀释，导致主站（英语站）排名难以快速冲到前列。
*   **低质翻译惩罚风险**：如果前期完全依赖 AI 批量翻译上万级页面，缺乏专业机械/建筑工程师的人工校对，极易被 Google 的 Helpful Content 算法判定为“机器自动生成的低质量内容 (Spam)”，从而拖累全站的整体收录。
*   **聚焦核心市场**：全球 CAD 领域的专业工程师与设计师，英语普及率极高。前期将 100% 的精力聚焦于垄断全球英语长尾词，资源回报率（ROI）是最高的。

### 原则二：站点长期规划中，绝对不做“流水账 Blog” (No Chronological Blog)
*   **流水账 Blog 的弊端**：传统 Blog 的文章结构是发散且无序的（按发布时间排序，今天写A明天写B）。这种随意的结构会极大地稀释站点的 **Topical Density (主题密度)**。
*   **百科 (WikiHub) 的常青结构**：百科是以树状分类树（Taxonomy）和结构化知识图谱组织的“常青内容 (Evergreen Content)”。每一个页面都有明确的分类归属和高密度的技术信息，能向 Google 证明网页是极致的“有用内容 (Helpful Content)”，从而大幅拉升全站的主题权重。

### 原则三：页面收录低于 10 万之前，绝对不引入生产数据库 (No Production DB)
*   **0 服务器负载 (Zero-Server-Load)**：由于百科和计算器是只读的内容，不需要用户登录和实时写入。生产环境坚决不引入传统的 MySQL/PostgreSQL 等运行时数据库。
*   **完美的安全与成本控制**：没有数据库，就意味着 **SQL 注入漏洞为零、数据库连接池耗尽死机风险为零、数据库高昂的托管与并发扩容费用为零**。全站完全承载于 CDN 边缘节点，即便遭遇百万级高并发访问，依然能够秒开且不花一分钱。

---

## 3. SEO 长期健壮性与抗算法降权策略 (High-Robustness SEO Strategy)

在 Google 推行 Helpful Content Update (有用内容更新) 和 Core Updates (核心算法更新) 的背景下，单纯的程序化页面极其容易被算法识别为“薄内容垃圾站”。WikiHub 必须构建高强度的 SEO 防御壁垒：

### 3.1 规避 Doorway Page (门页) 惩罚：Mega-Wiki 聚合体系
*   **致命错误**：如果为几千个快捷键或错误代码各自生成只有 100 字的极简静态页（例如 `/wiki/errors/autocad-error-1`），会被判定为 Doorway Page。
*   **黄金方案**：**不为单一短词建薄页面，而是建立“聚合型超级权威页 (Mega-Wiki Page)”**。
    *   例如：在 `/wiki/autocad` 页面中，通过精美交互的前端 Tab、折叠面板（Accordion）和客户端即时搜索，将“AutoCAD 快捷键控制台”、“AutoCAD Top 10 闪退报错”、“AutoCAD 自定义 PGP 配置”全部融合在**这一个 3,000 字以上、高原创、强交互的权威单页**中。
    *   只有当某个具体子词的内容足够庞大（如“AutoCAD 2026 彻底清除注册表残留步骤”，需要 800 字以上且配有图表/注册表项路径）时，才为其分配子页面 `/wiki/errors/autocad/clean-registry`，并在主聚合页渲染精美卡片为其倒流。

### 3.2 提升用户停留时间 (Dwell Time) 的交互设计
*   **底层逻辑**：Google 通过 RankBrain 算法和 Chrome 浏览器数据，高度监控用户在页面上的停留时间和交互行为。
*   **实现方式**：
    *   在快捷键板块，设计 **“虚拟键盘交互器”**，用户按下实体键盘按键（或点击虚拟键），页面秒级高亮并过滤出对应命令。
    *   在计算器板块，数值变化时通过 **React 实时重新计算并渲染矢量图表 (SVG Canvas)**（如公差带的干涉动态图）。
    *   这些零延迟的纯前端高质交互，能让用户停留时间成倍增加，极大地向 Google 证明此页面的超高实用价值。

### 3.3 爬虫预算优化 (Crawl Budget) 与页面性能
*   **静态站点优势**：全球 CDN 边缘节点托管的纯 HTML 文件，无传统动态数据库查询导致的网关等待。
*   **技术参数硬指标**：
    *   **TTFB (首字节时间)**：必须稳定在 **< 50ms**；
    *   **LCP (最大内容渲染时间)**：必须在 **< 1.2s** 内完成（Above-the-Fold 图片和 LOGO 使用 Next.js `<Image priority>` 强制高优先级加载，禁用 lazy load）；
    *   **CLS (累计布局偏移)**：必须为 **0**（所有图片、广告位、交互控制台组件必须在样式中预留固定高度容器，严禁加载后页面抖动）；
    *   **TBT (总阻塞时间)**：控制在 **< 100ms**（减少第三方 JS 的同步加载，使用 `next/script` 延迟加载分析脚本）。

### 3.4 结构化数据 (JSON-LD Schema) 注入
所有 Wiki 页面和计算器页面必须自动动态编译输出符合 Schema.org 标准的结构化数据，供 Google 在搜索结果页直接渲染富媒体卡片 (Rich Snippets)：
*   **百科词条页**：注入 `DefinedTerm` & `Encyclopedia` Schema；
*   **报错排错页**：注入 `HowTo` Schema（包含 explicit `step`、`tool` 和 `supply`）；
*   **交互计算器**：注入 `SoftwareApplication` Schema（标明为 `WebApplication` 且 `operatingSystem: "All"`，并标记为 Free 软件，此招极易在 Google 搜索结果中直接呈现输入框组件）。

---

## 4. 四大模块细化规划 (Four Subsystems Plan)

### 4.1 百科内容库与词条规范 (Glossary & Terms)
*   **覆盖主题**：AIA 图层命名规范、GD&T 几何公差与尺寸、投影几何法、机械公差配合、制图标准（ASME Y14.5、ISO 128、DIN 等）、暖通/电气/给排水制图代号。
*   **页面模板要求**：
    *   标准化的“学术定义” + “标准号说明”；
    *   SVG 格式的无损矢量图示（禁止使用普通低清图片）；
    *   **“CAD 实操指南”**：讲解该术语在 AutoCAD/GstarCAD 中的具体画法或图层设置指令。

### 4.2 快捷键控制台与配置文件 (Shortcuts & Config)
*   **键盘过滤交互设计**：
    *   页面顶部显示一张 60% 比例的经典 QWERTY 键盘 SVG。用户点击键盘上的某个按键（如 “L”），下方即时过滤出以 L 开头的所有命令（`LINE`, `LTSCALE`, `LAYISO` 等）。
*   **PGP 配置迁移工具**：
    *   提供在线 `.pgp` 文本配置文件解析组件。用户只需把自己的 AutoCAD 快捷键文本复制进来，我们通过纯前端 JS 解析，一键将其导出为完全兼容 GstarCAD 或 BricsCAD 的快捷键配置文件格式，提供高价值的“迁移无痛过渡工具”。

### 4.3 报错与闪退排错手册 (Runtime Error Playbooks)
*   **分级错误库**：
    1.  **安装/激活期报错**：Error 1603、FlexNet License Finder 授权超时、动态链接库 (.dll) 丢失；
    2.  **启动期报错**：FATAL ERROR: Unhandled Access Violation、软件图标双击无反应；
    3.  **运行期报错**：OutOfMemory 内存泄露崩溃、移动大图纸卡顿丢帧、XREF（外部参照）断链；
    4.  **文件保存与恢复**：DWG file is corrupted、AUDIT & RECOVER 失败、找回自动备份文件 (.sv$) 与临时文件 (.ac$)。

### 4.4 纯前端交互计算器 (Free Interactive Calculators)
1.  **尺寸与单位换算器**：实现建筑级英制（Feet-Fractional Inches，如 `12'-6 1/2"`）与公制（Millimeters, Meters）之间的即时无缝高精度互换，支持复制直接粘贴回 CAD 标注。
2.  **绘图比例因子换算器**：输入出图纸张大小（A0 - A4）和图纸真实尺寸，智能换算视口比例（Viewport Scale）、线型比例参数（LTSCALE）以及打印样式因子。
3.  **ISO/ANSI 公差与配合速查器**：输入基本尺寸（如 50）与配合代号（如 H7/g6），即时输出最大极限尺寸、最小极限尺寸、上偏差、下偏差，并以高保真 SVG 动态绘制出公差带图表（直观显示间隙、过渡或过盈状态）。
4.  **螺纹标准规格速查器**：提供 Metric (M 系列) 与 Unified (UNC/UNF) 螺纹规格的完整牙距、公称直径、底孔钻头尺寸速查，免去翻阅厚重手册。
5.  **角度度分秒 (DMS) 转换器**：支持十进制角度（如 `45.75°`）与度分秒（`45°45'00"`）及弧度之间的毫秒级双向转换。

---

## 5. 后期上万级页面平滑扩展方案 (Architecture & Scalability at Scale)

当 `cadguide.tools` 的 WikiHub 逐渐填充，包含的快捷键组合、报错代码、术语标准累积到 **10,000+ 个静态页面**时，常规的 Next.js 静态文件读取和内存编译会遇到严重的瓶颈：本地开发极其卡顿、编译部署动辄超过 30 分钟、内存溢出崩溃。

为了实现**运维成本为 0 ($0 Hosting Cost)** 且 **全球首字节时间极速 (Sub-50ms TTFB)** 的初衷，平台绝对不能在生产环境引入运行期数据库。我们必须采取以下 **“构建期静态数据库 (Build-Time Static Database)”** 扩展策略：

### 5.1 为什么生产环境坚决不要 Relational DB (MySQL / PostgreSQL)？

| 评估维度 | 生产环境关系型数据库 | 构建期静态数据库系统 (Next.js + 静态 HTML) |
| :--- | :--- | :--- |
| **服务器成本** | 极高（需要付费托管数据库、连接池、高可用备灾） | **绝对为 $0**（部署在 Vercel/Cloudflare/Netlify CDN 上） |
| **页面载入速度 (TTFB)**| 200ms - 800ms（取决于数据库地理查询延迟） | **<50ms**（全球 CDN 边缘节点直接缓存并秒开 HTML） |
| **高并发承载能力** | 差（高并发时数据库连接池瞬间耗尽，导致 504 错误） | **近乎无限**（CDN 承载，可轻松应对每秒十万级访问） |
| **安全防护风险** | 存在 SQL 注入、勒索病毒、连接耗尽攻击等风险 | **绝对安全**（无数据库连接、无漏洞可黑） |
| **SEO 爬虫亲和度** | 受到服务器负载和网络延迟的波动影响 | **100% 稳定**（Google 爬虫每次来都能瞬间抓取完毕） |

### 5.2 上万级静态页面编译优化方案 (SQLite 构建期加载器)

如果将 10,000 多个 Wiki 条目存成 10,000 个独立的 `.json` 或 `.md` 文件，在 Next.js 构建时，Node.js 频繁的磁盘 I/O 读取会导致构建速度极慢。

#### **黄金架构：本地只读 SQLite 构建期载入器 (Local SQLite Compiler Loader)**

```
               [ 开发者 / 自动化生成脚本 ]
                          │
                          ▼
           写入 / 导入数据到本地静态库文件
            (src/lib/data/wikihub.db)
                          │
           ┌──────────────┴──────────────┐ (仅在本地开发 / CI 构建期)
           ▼                             ▼
   [ Next.js dev server ]      [ Next.js npm run build ]
    (使用 better-sqlite3         (读取 SQLite 数据, 通过 generateStaticParams
     实现毫秒级 HMR 刷新)          将 10000+ 页面全量编译为静态纯 HTML/CSS)
                                         │
                                         ▼
                            [ 导出 100% 静态 HTML 产物 ]
                                         │
                                         ▼
                             [ 部署到全球 CDN 边缘节点 ]
                               (生产环境 0 数据库, 0 运维成本)
```

1.  **数据存放位置**：在项目代码仓库中放置一个高度压缩、高度索引化的 SQLite 数据库文件 `src/lib/data/wikihub.db`。该文件完全随 Git 代码一同提交和版本管理。
2.  **构建时查询 (Build-Time Query)**：
    *   在 Next.js 的 Server Component 中，编写数据查询函数：
        ```typescript
        // src/lib/wiki-data.ts
        import Database from 'better-sqlite3';
        import { join } from 'path';

        let db: any = null;

        function getDb() {
          if (!db) {
            const dbPath = join(process.cwd(), 'src/lib/data/wikihub.db');
            db = new Database(dbPath, { readonly: true }); // 以只读模式加载，速度极快
          }
          return db;
        }

        export async function getWikiPageData(slug: string) {
          const stmt = getDb().prepare('SELECT * FROM wikihub_pages WHERE slug = ?');
          return stmt.get(slug);
        }

        export async function getAllWikiSlugs() {
          const stmt = getDb().prepare('SELECT slug FROM wikihub_pages');
          return stmt.all().map((row: any) => row.slug);
        }
        ```
3.  **动态路径生成**：
    在 `src/app/wiki/[slug]/page.tsx` 中，利用 Next.js 静态生成参数：
    ```typescript
    export async function generateStaticParams() {
      // 在构建时，从 SQLite 快速拉取 10,000 个 slug
      // better-sqlite3 读取 10,000 条索引数据仅需 5-10 毫秒！
      const slugs = await getAllWikiSlugs();
      return slugs.map((slug) => ({ slug }));
    }

    export default async function WikiPage({ params }: { params: { slug: string } }) {
      const data = await getWikiPageData(params.slug);
      if (!data) return notFound();
      return (
        <article className="prose max-w-4xl mx-auto dark:prose-invert">
          <h1>{data.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.html_content }} />
        </article>
      );
    }
    ```
4.  **架构优势**：
    *   **极致的开发 DX**：因为 `better-sqlite3` 是 C++ 绑定的只读单文件数据库，本地 `npm run dev` 开发时，任何页面的修改和渲染都是毫秒级即时响应，完全不卡顿。
    *   **超快编译**：Next.js 构建时只用跟一个 SQLite 文件进行单连接高并发读取，磁盘寻道时间几乎降为 0，构建速度可提升 10 倍以上。
    *   **打包体积**：编译结束后，打包产物只有静态的 HTML/CSS/JS。**`better-sqlite3` 库和 `wikihub.db` 文件完全不会被打包进最终的客户端 JS Bundle 中**，网页依旧保持极致轻量。

---

## 6. 全站内链回环设计 (Internal Link Loop Schema)

为了最大化流转页面权重 (Link Equity / PageRank) 并在 Google 算法中建立强烈的网状相关性，未来的开发必须严格确保每一篇 Wiki 页面均无缝契合如下**双向闭环链条**：

```
                    ┌───────────────────────────────┐
                    │        /tools/[slug]          │
                    │   (软件客观评测与规格指标大页)   │
                    └───────┬───────────────▲───────┘
                            │               │
            在工具评测页中，   │               │ 在Wiki百科页中，
            自动嵌入对应软件的 │               │ 渲染显目的商业对比卡片，
            Wiki/排错/快捷键导流 │               │ 导流回评测页以形成购买漏斗
                            ▼               │
                    ┌───────────────────────┴───────┐
                    │       /wiki/[tool-slug]       │
                    │   (软件级聚合 Mega-Wiki 权威页)  │
                    └───────┬───────────────▲───────┘
                            │               │
            教程提到具体计算或  │               │ 计算器结果页中，
            换算步骤时，无缝内嵌 │               │ 提供返回特定软件
            交互式 React 计算器 │               │ Wiki 与制图规范的超链接
                            ▼               │
                    ┌───────────────────────┴───────┐
                    │    /calculators/[widget-id]   │
                    │  (纯前端免下载 React 交互计算器) │
                    └───────────────────────────────┘
```

1.  **从评测页流向 Wiki**：
    *   在 `src/app/tools/[slug]/page.tsx` 中增加自动关联检测：如果 `wikihub.db` 中存在该软件对应的 shortcuts 或 errors 数据，必须在评测页底部或右侧侧边栏渲染一个精致的 **"🛠️ Technical Troubleshooting & Shortcuts Guide for [CAD名称]"** 卡片，引导有实操痛点的用户点进 Wiki 深度阅读。
2.  **从 Wiki 流向评测页（商业闭环）**：
    *   在每一篇 `/wiki/[tool-slug]` 及子报错解决页面的显著位置，设计一个客观的 **“Alternative Recommendations & CAD Selection Guide”** 组件。
    *   例如，在 AutoCAD 闪退排错页中写道：“If you are tired of frequent licensing errors or system crashes on high-res monitors, check our objective [AutoCAD vs GstarCAD Comparison](/compare/autocad-vs-gstarcad) or read our complete [GstarCAD Review](/tools/gstarcad) to find a high-performance native replacement.” 这能将技术求助流量以极高转换率引导至平台推荐的正版低配置平替软件中。
3.  **从 Wiki/指南流向计算器**：
    *   当教程（如 `scale-setup-ctb-stb` 比例打印指南）涉及到复杂的数值换算或公差计算时，文章正文中必须插入精美的行内高亮按钮 or 直接内嵌该计算器组件，最大化站点的停留时间。

---

## 7. 100 阶段落地开发计划 (The 100-Phase Implementation Roadmap)

此计划将整个 WikiHub 与交互计算器系统的落地划分为 **10 大主阶段**，共 **100 个极其细致的执行步骤**。未来的开发人员或 AI 编程智能体必须严格按此步骤推进，每个步骤均可独立测试与提交。

---

### 【阶段一】技术基础建设与设计系统扩展 (Phase 1 - 10)
*   **Phase 1**：创建主路由目录：`src/app/wiki/`、`src/app/guides/`、`src/app/calculators/`，并配置全局基础的 `page.tsx`。
*   **Phase 2**：在主导航栏组件 `src/components/navbar.tsx` 中精致嵌入“WikiHub”与“Calculators”入口，添加流畅的 Hover 动效。
*   **Phase 3**：在全局页脚 `src/components/footer.tsx` 中增加对应的语义分类导流链接，扩展底座。
*   **Phase 4**：定义 WikiHub 与计算器专用的 Tailwind CSS 毛玻璃（Glassmorphism）与 HSL 柔和渐变色卡片设计令牌（Design Tokens）。
*   **Phase 5**：扩展 Markdown 渲染器解析工具，准备支持 `.md` 轻量内容的解析渲染。
*   **Phase 6**：设计并测试全局统一的 SEO 元数据组件 `src/components/wiki-seo.tsx`，支持自动 Canonical、Metadata 生成。
*   **Phase 7**：定义全局错误处理组件 `src/components/error-boundary.tsx`，捕捉纯前端计算器潜在的 JS 运行时异常。
*   **Phase 8**：在项目 `next.config.ts` 中配置 `serverExternalPackages: ['better-sqlite3']`，防止构建打包时将其混入客户端。
*   **Phase 9**：建立本地自动化脚手架脚本目录 `scripts/`，用于后续批量数据导入与校验。
*   **Phase 10**：提交初始化的骨架代码，并运行全静态构建测试（`npm run build`），确保骨架导出 HTML 无死链。

---

### 【阶段二】开发纯前端核心计算器模块 (Phase 11 - 20)
*   **Phase 11**：编写 `src/app/calculators/unit-converter/` 路由与尺寸单位转换器页面框架。
*   **Phase 12**：实现英制分数（如 `1/16`, `3/32`）到公制毫米的精密前端数学解析算法（纯 React State）。
*   **Phase 13**：编写单位转换器 UI：支持双向实时输入更新，支持一键“复制到剪贴板”。
*   **Phase 14**：编写 `src/app/calculators/scale-calculator/` 视口比例换算器页面。
*   **Phase 15**：集成纸张物理尺寸、模型空间尺寸与比例因子的联动数学模型，支持毫米与英寸多制式。
*   **Phase 16**：编写 `src/app/calculators/tolerance-lookup/` 公差速查器主体，集成 ISO/ANSI 基本数据接口。
*   **Phase 17**：开发基于 React 的 **SVG 公差带动态示意图** 组件，根据用户选择的配合（如 H7/g6）即时重绘相对位置。
*   **Phase 18**：开发 `src/app/calculators/thread-specs/` 螺纹规格速查计算器。
*   **Phase 19**：开发 `src/app/calculators/angle-converter/` 角度度分秒精密转换计算器。
*   **Phase 20**：对 5 大计算器进行全量单元测试与 Responsive 响应式测试，确保在 iOS/Android 移动端屏幕下完美适配。

---

### 【阶段三】构建只读本地编译期 SQLite 引擎 (Phase 21 - 30)
*   **Phase 21**：安装 `better-sqlite3` 并编写 SQLite 连接器辅助类 `src/lib/db-connector.ts`，支持严格的 readonly 只读加载。
*   **Phase 22**：设计 SQLite 物理表 Schema。创建 `wikihub_pages`（主页面表）、`wikihub_shortcuts`（快捷键关联表）与 `wikihub_errors`（报错表）。
*   **Phase 23**：对 SQLite 表中的 `slug` 和 `tool_id` 字段建立高并发主键及联合 B-Tree 索引，确保查询延迟 < 1ms。
*   **Phase 24**：编写本地静态数据生成脚本 `scripts/seed-db.js`，支持将本地 JSON/YAML 数据批量序列化写入本地 SQLite。
*   **Phase 25**：编写第一批 240+ 款 CAD 软件在 SQLite 里的基础关系卡片（将 `src/lib/data.ts` 的部分关联参数录入库中）。
*   **Phase 26**：编写 Next.js Server Component 里的数据适配器层 `src/lib/wiki-data-service.ts`，导出所有查询 API。
*   **Phase 27**：在本地开发环境配置 SQLite 自动重载监听机制，修改库中数据时触发 Next.js HMR 刷新。
*   **Phase 28**：设计 SQLite 构建期读取的安全降级机制：如果本地构建时 SQLite 加载失败，自动回退到内存 JSON 缓冲读取，增强 CI 构建健壮性。
*   **Phase 29**：编写测试脚本，模拟 Next.js 在构建期并发读取 SQLite 10,000 次，确保零死锁、零内存泄露。
*   **Phase 30**：提交 SQLite 引擎代码，并将其加入 Git 管理。

---

### 【阶段四】开发 Unified Mega-Wiki 聚合模版与交互组件 (Phase 31 - 40)
*   **Phase 31**：开发 `src/app/wiki/[slug]/page.tsx` 动态路由文件，搭建 Mega-Wiki 页面骨架框架。
*   **Phase 32**：开发页面顶部的 **“三合一多功能 Tab 切换面板”**：支持“快捷键速查”、“常见报错解决”、“软件平替指南”无刷新秒级切换。
*   **Phase 33**：开发 **“虚拟键盘快捷键过滤交互器 (Virtual Keyboard Filter)”** 组件：动态渲染 60% 键盘布局。
*   **Phase 34**：编写过滤器的底层模糊搜索算法：输入 "draw"，高亮显示 Q/L 等键位，同时下方网格卡片即时呈现过滤结果。
*   **Phase 35**：编写快捷键的“一键复制 CAD 命令”组件，带微型 Toast 成功提示气泡。
*   **Phase 36**：开发 **“Top 10 FAQ 折叠 Accordion 面板”**：针对报错和打印设置提供极其易读的折叠展开样式。
*   **Phase 37**：编写平替对比徽章卡片组件，直接抓取主站对比数据动态渲染卡片。
*   **Phase 38**：在页面右侧或底部设计精美的浮动 **“目录导航导航器 (TOC - Table of Contents)”**，随页面滚动智能高亮当前阅读位置。
*   **Phase 39**：设计 Above-the-Fold（首屏折叠线以上）的极速加载架构，确保大Tab控制台优先处于可交互状态 (FID 最小化)。
*   **Phase 40**：全量跑通 `generateStaticParams()` 进行构建期抓取测试，验证 `/wiki/autocad`、`/wiki/gstarcad` 静态 HTML 文件正确输出。

---

### 【阶段五】SEO 自动化管道与高阶架构调优 (Phase 41 - 50)
*   **Phase 41**：开发自动 Schema.org 结构化数据生成管道 `src/lib/seo-schema.ts`，根据当前 Wiki 种类实时生成 JSON-LD 并安全注入 `<head>`。
*   **Phase 42**：为 5 大前端计算器编写定制的 `SoftwareApplication` 级富媒体卡片 Schema。
*   **Phase 43**：在 `src/app/sitemap.ts` 中集成动态 Sitemap 生成算法：自动抓取所有 Wiki 页面的 Slug，设定独立更新频率与 `0.9` 权重。
*   **Phase 44**：自动校验 Canonical Tag，防止同一页面在不同路由参数下（如 Tab 激活时）被判定为重复内容。
*   **Phase 45**：针对 Wiki 中的所有静态图片和 SVG 图表，编写编译期自动补全 alt 标签的校验脚本，防止薄弱项降权。
*   **Phase 46**：实施 **Above-the-Fold (ATF) 图像强制提权**：在 Next.js `<Image>` 标签中加入 `priority={true}` 与 `fetchPriority="high"`。
*   **Phase 47**：实施 Below-the-Fold（首屏以下）大组件的 Lazy Loading 惰性加载，降低页面的 Total Blocking Time (TBT)。
*   **Phase 48**：消除页面在首屏渲染时的累计布局偏移（CLS），对所有广告空隙、动态计算结果区域设定硬编码的最小占位高度。
*   **Phase 49**：运行 Lighthouse 模拟器，确保 Wiki 页面的 Performance、SEO、Best Practices 分数达到全绿 (均 > 95)。
*   **Phase 50**：提交 SEO 调优与结构化数据层代码。

---

### 【阶段六】报错与闪退排错手册数据入库 (Phase 51 - 60)
*   **Phase 51**：编写 `AutoCAD Fatal Error: Unhandled Access Violation` 标准修复指南数据并写入库中。
*   **Phase 52**：编写 `FlexNet License Finder / License Manager Error` 许可证激活报错的通用排错指南。
*   **Phase 53**：编写 `CAD crash on startup on Windows 11` 显卡兼容性与高分屏导致启动崩溃排查方案。
*   **Phase 54**：编写 `How to recover corrupted DWG files (Audit, Recover, bak/sv$ recovery)` 损坏文件救援保姆级指南。
*   **Phase 55**：编写 `OutOfMemory / Memory leak when opening 100MB+ large drawings` 超大图纸闪退专项优化。
*   **Phase 56**：为 GstarCAD、BricsCAD 等代表性平替工具编写针对性的独家排错条目。
*   **Phase 57**：为每篇排错页面底部，设计自然嵌入的“无痛平替对比推荐卡片”。
*   **Phase 58**：在排错文章正文中，合理埋入 `HowTo` Rich Snippets。
*   **Phase 59**：编写测试：检测排错页面的内链分布，确保没有任何一篇排错文章处于孤岛状态 (Orphan Page)。
*   **Phase 60**：批量导入第一批 100 条核心高频报错解决方案并编译测试。

---

### 【阶段七】快捷键控制台与自定义配置数据入库 (Phase 61 - 70)
*   **Phase 61**：梳理并编写 AutoCAD 经典 150 条命令快捷键别名映射表。
*   **Phase 62**：梳理并编写 GstarCAD 对应的快捷键兼容性别名表。
*   **Phase 63**：梳理并编写 BricsCAD 对应的快捷键映射表。
*   **Phase 64**：编写 `.pgp` 自定义快捷键文件的结构化说明文档与编辑规范内容。
*   **Phase 65**：开发纯前端 **“AutoCAD PGP 别名格式转化器”**，用户复制粘贴后一键下载兼容 GstarCAD 的 pgp 文件。
*   **Phase 66**：录入各工具 Windows 平台与 macOS 平台的快捷键物理差异（如 Command 键与 Ctrl 键的映射说明）。
*   **Phase 67**：在快捷键 Tab 页面顶部设计精美的常用命令“快捷筛选聚合泡”（如“一键只看绘图命令”、“一键只看标注命令”）。
*   **Phase 68**：对快捷键交互界面进行高强度点击交互测试，确保千次按键后 React 虚拟 DOM 零卡顿。
*   **Phase 69**：验证在 Google 搜索 `[CAD名称] command aliases` 时，快捷键 Tab 在首屏能被完美呈现。
*   **Phase 70**：批量导入第一期 8 款核心 CAD 软件的完整快捷键控制台数据并成功测试构建。

---

### 【阶段八】行业制图流程与常青指南内容建设 (Phase 71 - 80)
*   **Phase 71**：编写 `AIA CAD Layer Standard Guidelines` 行业图层命名标准深度指南。
*   **Phase 72**：编写机械零件加工图（Mechanical Shop Drawings）标准制图图层与公差规范指南。
*   **Phase 73**：编写建筑施工图（Architectural Floor Plans）标准布局、视口比例与图层色彩配置指南。
*   **Phase 74**：编写暖通空调与给排水（HVAC/Plumbing）专业CAD布线与阀门符号百科。
*   **Phase 75**：编写 `Plotting PDF missing lines / shx text question marks` 中文字体乱码与打印线条丢失专项常青长文指南。
*   **Phase 76**：编写 `How to convert CTB plot styles to STB styles` 打印样式表精密转换指南。
*   **Phase 77**：编写 `CAD workstation hardware assembly recommendation` 最佳单核 CPU 与专业显卡选型采购指南。
*   **Phase 78**：在所有常青指南的换算步骤中，动态无缝嵌入对应的单位转换器与视口比例计算器。
*   **Phase 79**：编写词条内部超链接交叉引流管道（自动检测指南中的特定术语，编译时自动加上指向 `/wiki/terms/` 的超链接）。
*   **Phase 80**：生成第一批 20 篇高权威常青指南 HTML 静态页并进行编译打包。

---

### 【阶段九】跨软件迁移与全站内链闭环集成 (Phase 81 - 90)
*   **Phase 81**：编写 `AutoCAD to GstarCAD Seamless Migration Guide` 经典高意图迁移平替对比指南。
*   **Phase 82**：编写 `How to port AutoLISP / VBA plugins to BricsCAD` 企业IT管理员高度关切的二次开发插件移植手册。
*   **Phase 83**：设计并实现 `src/app/tools/[slug]/page.tsx` 中中立评测页面的底层关联：如果该工具有 Wiki 数据，在侧边栏和底部动态插入评测入口卡片。
*   **Phase 84**：在每一篇 `/wiki/[tool-slug]` 聚合页面的页头，渲染其在主站的评分及 objective comparison 挂载徽章，实现双向闭环引流。
*   **Phase 85**：在计算器的结果输出组件中，插入指向特定软件制图规范和常青指南的内链推荐逻辑。
*   **Phase 86**：运行孤立链接排查脚本，确保全站 100% 的新增页面都能在主路由大厅或关联页面里被至少抓取一次。
*   **Phase 87**：检验 sponsor 赞助卡片在平替推荐组件中的渲染逻辑，确保中立声明的可见性。
*   **Phase 88**：进行跨设备交互流模拟，确保“评测页 -> 闪退解决 -> 计算器 -> 评测页”的用户流量循环漏斗无比顺畅。
*   **Phase 89**：进行全站 404 死链深度扫描，保证 100% 的内链均指向合法静态路由。
*   **Phase 90**：提交内链回环与闭环集成的全量代码。

---

### 【阶段十】全静态构建审计、性能调优与上线部署 (Phase 91 - 100)
*   **Phase 91**：在本地运行 `npm run build`，获取最终的静态导出压缩包，记录全量生成的 HTML 路径总数。
*   **Phase 92**：检查 Next.js 构建日志，验证 100% 的 Wiki 和计算器页面均生成为代表纯静态的 `○` 或 `●` 状态，确保未夹带任何运行期 API 查询负载。
*   **Phase 93**：编写测试：对生产环境打包出来的静态 HTML 进行抽样，确认 `better-sqlite3` 驱动和 SQLite 本地物理文件确实没有被混入打包客户端的 Webpack JS Bundle。
*   **Phase 94**：在本地通过 `http-server` 模拟生产环境 CDN 载入行为，进行网络瀑布流性能审计，重点解决 LCP 加载瓶颈。
*   **Phase 95**：验证全局 Google Analytics 4 (GA4) 跟踪标签是否正常：在交互计算器按钮被点击、快捷键被复制、平替卡片被点击时正确发送自定义事件。
*   **Phase 96**：在 staging 测试服务器上，使用 Chrome Headless 浏览器进行爬虫抓取仿真，确保搜索引擎能瞬间完美抓取所有 JSON-LD 结构化数据。
*   **Phase 97**：将代码合并至 GitHub `main` 分支，触发 Vercel/Cloudflare Pages 边缘 CDN 自动化生产构建。
*   **Phase 98**：在 Google Search Console (GSC) 中手动上传新生成的 Sitemap.xml，触发首批 Wiki 核心聚合页面的快速收录。
*   **Phase 99**：在社交平台（如 CAD 论坛、Reddit、LinkedIn）及友情链接合作站点精准分流，为新上线的计算器和排错大厅进行冷启动引流。
*   **Phase 100**：设定阶段性里程碑：进入数据监控期，每日追踪 DAU 增长速度、计算器用户停留时间 (Dwell Time)，静待日活突破 10,000 大关后准时启动多语言 i18n 翻译计划。

---
*文档版本 2.0 更新于：2026年5月22日。该文档为 cadguide.tools WikiHub 系统的最终建设标准与长期战略演进指引。*
