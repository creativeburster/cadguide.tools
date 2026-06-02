# 👥 CADGuide.tools User Persona & Niche Market Research

本文件记录了平台的靶向用户画像、市场竞争调研，以及商业变现的底层闭环逻辑，旨在为接手的 AI 编程智能体或新开发者提供清晰的战略背景。

---

## 1. 靶向用户画像 (Target User Personas)

我们的流量增长和功能设计围绕以下四类核心 CAD 行业用户展开：

### 👤 建筑/BIM 资深设计师 (AEC Professional - Architect & BIM Modeler)
*   **软件需求**：Revit, ArchiCAD, AutoCAD, Vectorworks, SketchUp.
*   **日常痛点**：多源图纸协同、大图载入卡顿、图层命名不规范（AIA标准）、PDF 打印线条丢失、图纸打印比例换算错误。
*   **特征行为**：常在谷歌上搜索工作流排错（如 `missing lines on cad export to pdf`）或图纸比例换算。
*   **价值贡献**：商业软件（Revit 等）升级与订阅的主力购买人群，客单价极高（年订阅费数千美元），Cookie 转化价值大。

### 👤 机械/工业设计工程师 (Mechanical Engineer - Solid Modeling & CAM)
*   **软件需求**：SolidWorks, Siemens NX, Creo, Fusion 360, Rhino 3D, Solid Edge.
*   **日常痛点**：NURBS 曲面建模干涉、配合与公差标注（ISO H7/g6 等配合计算）、螺纹底孔标准规格查询、CNC 导出后处理错误。
*   **特征行为**：经常查阅繁琐的工程机械设计手册，喜欢免下载、零延迟的前端计算速查工具。
*   **价值贡献**：Rhino 3D 等永久授权购买者，或中端 CAD 替代品（ZWCAD Mechanical, SolidEdge）的商业化购买主力。

### 👤 中小型工作室负责人 & 独立绘图员 (Small business Owner & Freelance Draftsman)
*   **软件需求**：AutoCAD 替代品 (ZWCAD, GstarCAD, progeCAD, nanoCAD, BricsCAD).
*   **日常痛点**：AutoCAD 订阅费过高（占固定成本大头）、需要 100% 完美兼容 DWG 的永久授权（Perpetual）软件、需要无缝迁移个人 PGP 快捷键配置。
*   **特征行为**：在 Deals 页面极度活跃，专门搜索 `AutoCAD coupons` 或 `cheap AutoCAD alternative`。
*   **价值贡献**：中小企业直接决策购买人，替代品 CAD 折扣码的超高转化率客户。

### 👤 建筑/工程院校学生 (Academic Student & Educator)
*   **软件需求**：所有主流 CAD/BIM 软件的教育版。
*   **日常痛点**：教育授权申请被拒、寻找免费激活码、学习软件常用命令快捷键。
*   **特征行为**：常搜 `SolidWorks for student free` 或 `AutoCAD command aliases`，频繁查看免费版汇总。
*   **价值贡献**：通过推荐学生版与免费方案，极易建立品牌信任。用户虽不购买，但会带来大量社交媒体分享与外部优质反向链接（Backlinks），且种下的 Cookie 会随着他们日后毕业进入职场买商业版而间接变现。

---

## 2. 细分市场调研与商业化模式 (Niche Market & Monetization Model)

### 2.1 市场痛点
*   **信息不透明**：市场上大多数 CAD/BIM 软件评测都带有厂商的商业偏见。
*   **低频决策 vs 高频实操**：软件“选型和购买”是低频决策需求；但制图过程中的“排错和计算”是每日高频发生的需求。

### 2.2 变现逻辑：基于点击拦截的子联盟网络 (Sub-Affiliate Interception)
*   **零摩擦集成**：平台不需要逐一向 Autodesk、Dassault Systemes 等大厂繁琐地申请独立的联盟项目，而是全局集成 **Brandreward** 脚本（后续可根据情况加入 **Sovrn Commerce** 与 **Skimlinks** 作为备选分流）。
*   **点击时动态转链**：
    *   全站所有网页（包含 Tool 详情页和 Deals 优惠页）上的商户链接在 HTML 源码中保持干净的原始直链（例如 `https://www.autodesk.com`），确保 **100% 获得谷歌爬虫的 SEO 权重传递（Outbound Link SEO equity）**，避免联盟链接直接写死被降权。
    *   当用户点击链接的瞬间，JavaScript 脚本会拦截该点击，并动态重定向通过联盟网络（如 `n.brandreward.com`），给用户浏览器种植 Cookie。
    *   若用户发生购买，佣金会由商户结算给联盟平台，联盟平台在扣除部分提成后，自动汇总并发放到我们的联盟后台（由 Site ID `81f9b4c973e1fb37a704344789dc0719` 追踪识别）。

### 2.3 联盟平台对比与多路分流设想 (Cross-Network Routing Idea)
*   **对比策略**：
    *   **Sovrn (VigLink)**：在欧美主流大厂（Autodesk AutoCAD, SketchUp）的合作佣金比例上更有优势。
    *   **Brandreward**：对亚洲及替代软件开发商（ZWCAD, progeCAD, nanoCAD）的折扣码和长尾转化覆盖更好。
*   **多路分流设想**：后续我们可以在 [layout.tsx](file:///f:/cad%20tools%20io/cadtools-cc/src/app/layout.tsx) 中根据 `usePathname()` 动态加载脚本：对于 `/deals` 页面加载 Brandreward 脚本以捕获替代品的特惠成交；而对于 `/tools/[slug]` 页或对比页加载 Sovrn 脚本以获取大厂的高额提成。
