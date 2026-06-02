# 📖 Product Requirements Document (PRD) - cadguide.tools

## 1. 全局定位与产品愿景 (Product Positioning)

`cadguide.tools` 致力于成为 **全球最大、最中立客观的 2D/3D CAD & BIM 软件比较、评测与决策辅助平台**。

### 核心功能模块：
1.  **软件大厅 (Directory)**：收录 240+ 款专业 CAD/BIM/CAx/EDA 工具，支持精细化的分类、平台、许可证类型筛选。
2.  **选型PK (Comparisons)**：提供 side-by-side 对比页面（`/compare/[pair]`），动态输出详细的技术规格、功能跑分和价格趋势。
3.  **权威指南 (Guides Hub)**：针对 B-End 工程师在出图、打印、性能加速、IT 静默分发与反审计等方面的日常工作流痛点，提供高 E-E-A-T 的长尾长文指南。
4.  **特惠中心 (Deals)**：收录真实、长期有效的官方年付折扣、学生免费授权及主流平替软件的真实优惠券码。
5.  **交互微工具 (Interactive Calculators)**：100% 运行于客户端浏览器本地的高质微型工具，通过计算与 SVG 可视化交互，直接拉长用户单次停留时间。

---

## 2. 运营与技术底层原则 (The 3 "No" Principles)

为保持系统秒开、低成本和谷歌排名高亲和力，项目坚守以下原则：
*   **原则一：绝对不做多语言 (No i18n)**：在日活突破 10,000 前，聚焦纯英文内容以聚合 Link Equity，避免机器低质翻译被 Google  Helpful Content 算法惩罚。
*   **原则二：绝对不做流水账 Blog (No Chronological Blog)**：以结构化的 Guides 分类和常青内容作为流量引擎，强化站点的主题密度 (Topical Density)。
*   **原则三：绝对不引入运行时生产数据库 (No Production DB)**：除本地构建时静态调用以提高生成速度外，生产环境 100% 为只读静态文件（HTML/CSS/JS），完全基于 CDN 边缘分发，以实现 **0 服务器运维成本**、**高安全防御** 与 **极致的首字节载入延迟 (TTFB < 50ms)**。

---

## 3. SEO 长期健壮性指标 (SEO Standards)

全量页面（3,340+ 个路由）必须达到以下 SEO 硬性指标：
*   **LCP (最大内容渲染)**：首屏核心图片/Logo 预设 priority 提权加载，LCP 保持在 **< 1.2s**。
*   **CLS (累计布局偏移)**：给所有广告位、图片、动态卡片预设固定高度占位，CLS 必须保持为 **0**。
*   **TBT (总阻塞时间)**：减少非必要第三方阻塞 JS 加载，TBT 控制在 **< 100ms**。
*   **结构化数据 (JSON-LD)**：
    *   `/compare/[pair]`：注入 `Product` 规格参数、评价与对比 `FAQPage` 结构化数据。
    *   `/guides/[slug]`：注入 `HowTo` 步骤指示器、所需工具及故障处理步骤 Schema。
    *   `/deals`：注入 `SoftwareApplication` 优惠卡片 Schema。
*   **变现安全度**：所有外链在静态源码中必须保持原站 Clean Link（如直接写 `autocad.com`），规避被搜索引擎判定为 Doorway Page。

---

## 4. 交互微工具与计算器说明 (Calculators Specification)

交互工具子系统是提升用户单次停留（Dwell Time）的核心手段。详见 [PLAN.md](file:///f:/cad%20tools%20io/cadtools-cc/PLAN.md)。
1.  **DXF 水印扫描器**：本地解析 ASCII DXF 水印及版本标记。
2.  **CTB 打印样式转换器**：读取 CTB 笔宽、线型配置并提供 PDF 导出。
3.  **折弯系数计算器**：DIN 6935 折弯补偿（BA）和扣除值（BD）数学模型与 SVG 2D Animate 演示。
4.  **STL 弦高偏差优化器**：3D 打印切片网格多边形度近似与圆弧拟合度检测。
5.  **FLEXlm Options 生成器**： options.opt 管理器语法树编译下载。
