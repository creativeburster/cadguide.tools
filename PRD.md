# Product Requirements Document (PRD) - cadguide.tools

> **文档状态**：现行有效（更新于 2026-11-13）  
> **适用范围**：`cadguide.tools` 全站架构、产品演进重心与功能迭代标准

---

## 1. 产品定位与业务重心

`cadguide.tools` 面向工程设计、机械制造、BIM 建筑及电气设计人员，提供一个**以浏览器端实用工具为核心、以客观软件信息聚合为辅助**的静态工程站点。

根据当前业务实操与搜索流量表现，全站板块权重按以下优先级划分：

### 第一核心：CAD 与工程实用工具箱（`/toolbox/*` & `/convert/*`）
全站最核心的流量入口、留存载体与差异化内容资产：
1. **工程计算器与设计辅助工具（`/toolbox/*`）**：涵盖机械、结构、钣金、流体、电气、暖通、CNC 加工与 CAD 坐标等计算器与速查表（总计 670 项工具条目）。每批工具按 [`TOOLBOX_STANDARD.md`](./TOOLBOX_STANDARD.md) 逐一核验公式、绑定行业/国家标准来源并配置可手算复验的 E2E 测试。
2. **本地隐私 CAD 文件解析与检查工具**：100% 在用户浏览器本地运行的客户端工具（如 DWG 版本检查、DXF 解析、STEP 头部解析、STL 网格检测、CTB 笔宽查看等），零文件上传，满足企业涉密图纸隐私要求。
3. **CAD / 3D 格式转换指引频道（`/convert/*`）**：包含 47 个规范转换对页面（如 `/convert/step-to-stl`、`/convert/revit-to-ifc`），对比本地开源工具与云端转换服务的技术取舍。

### 第二核心：纯信息聚合软件目录（`/tools/*`、`/alternatives/*`、`/compare/*`、`/file-formats/*`）
定位于**纯粹的目录聚合器（Directory Aggregator）**，严格遵循 [`DIRECTORY_TOOL_STANDARD.md`](./DIRECTORY_TOOL_STANDARD.md)：
1. **软件详情目录（`/tools/[slug]`）**：聚合 191 款 CAD/BIM/CAx/EDA 软件。**零本站自撰内容、零本站主观评测与打分**。静态技术规格、支持平台、导入导出格式、套餐内容概要及 FAQ 均采集自软件官网；优缺点及带核验日期的评分快照引自 G2、Capterra、TrustRadius、Gartner Peer Insights 等权威第三方平台；动态价格与试用天数一律不写死金额，直链官网定价与试用页面。
2. **替代品与横向对比（`/alternatives/[slug]`、`/compare/[pair]`）**：基于各软件同门类技术参数，提供 80 对精简对比页与替代方案索引。
3. **文件格式与多维度聚合（`/file-formats/*`、`/best/*`、`/platforms/*`、`/for/*`、`/sectors/*`）**：提供格式解析说明与按操作系统、岗位、行业维度的纯客观聚合列表。

### 第三状态：长文指南板块（`/guides/*` — 已下线，后期规划待定）
* 历史上早期通过批量生成的 269+ 篇 `/guides/*` 长尾文章已于 **2026 年 8~9 月彻底移除**，当前线上边缘中间件对所有历史 `/guides/*` 路径统一返回 `HTTP 410 Gone`，不再纳入 Sitemap 与站内导航。
* **后期规划待定**：是否重启 Guide 板块、以及后续以何种非模板化形式重新制作高质量实操指南，目前处于待定与观察阶段。在新的方案正式确认前，**严禁以 AI 批量拼凑或模板分发方式重新引入 Guides 页面**。

---

## 2. 运营与技术底层原则

1. **保持纯英文主站（No i18n）**：聚焦单语种内容积累，不做机器翻译多语种分站，防止稀释域名权重与触发低质内容评估。
2. **零运行时服务器数据库（Zero Production DB）**：全站通过 Next.js Static Export 编译为只读静态 HTML/CSS/JS（当前构建产出 1,568 个静态路由），由 Cloudflare Pages 边缘网络分发，实现零服务器维护成本与低首字节延迟。
3. **单一规范网站地图（Single Sitemap）**：全站统一维护唯一的 [`sitemap.xml`](./src/app/sitemap.xml/route.ts)（当前包含 1,260 个规范收录目标 URL），废弃历史碎片子地图。
4. **外链源码透明（Clean Affiliate Links）**：HTML 源码中的厂商链接保持干净的官方直链，不在静态源代码中写入复杂的跳转追踪参数，避免被搜索引擎判定为门页（Doorway Page）。
5. **真实流量统计与防 Bot 去水（GA4 Anti-Bot Shield）**：在 [`src/app/layout.tsx`](./src/app/layout.tsx) 与 [`functions/_middleware.js`](./functions/_middleware.js) 中实施双层机房爬虫过滤（拦截无头浏览器异常分辨率、软件光栅化器与云机房 ASN 无来源访问），同时确保 `Googlebot` / `Bingbot` 与真实人类访客正常访问和 0ms 延迟追踪。

---

## 3. 质量与工程验收基准

* **Toolbox 计算工具标准**：见 [`TOOLBOX_STANDARD.md`](./TOOLBOX_STANDARD.md)（公式可手算复算、标准来源真实可查、E2E 覆盖默认值/修改值/空值防 NaN/下载文件断言）。
* **Directory 目录详情标准**：见 [`DIRECTORY_TOOL_STANDARD.md`](./DIRECTORY_TOOL_STANDARD.md)（严格对齐 [`/tools/autocad`](https://cadguide.tools/tools/autocad) 样板，静态事实写死，变动金额直链官方）。
* **核心 Web 指标与可访问性**：关注首屏图片预加载（LCP）、固定占位防偏移（CLS = 0）、客户端包体控制（禁止将完整数据 JSON 打包进客户端 chunk）。
* **规范文档索引**：
  * 开发准则与红线：[`AGENTS.md`](./AGENTS.md)
  * 受众与变现模型：[`PERSONA.md`](./PERSONA.md)
  * 外链建设规范：[`LINKBUILDING.md`](./LINKBUILDING.md)
  * 历史废止规划归档：[`docs/archive/`](./docs/archive/README.md)
