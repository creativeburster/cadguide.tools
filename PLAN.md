# 📋 CADGuide.tools Niche Expansion & Content Roadmap

本文件详细记录了 `cadguide.tools` 的长期内容规划、交互计算器子系统，以及长尾 SEO 攻坚战的落地计划。本规划与 [WIKIHUB_PRD.md](file:///f:/cad%20tools%20io/cadtools-cc/docs/WIKIHUB_PRD.md) 保持一致。

---

## 1. 交互式计算器子系统 (Interactive Calculators)

为了大幅度拉升用户在网页上的**停留时间 (Dwell Time)**，从而提升谷歌对整站权重的评分，我们计划在 `/calculators` 下推出 **5 款纯前端免下载的 React 交互计算器**。计算器在输入数值变化时，会利用 SVG Canvas 动态重绘示意图，实现零延迟、强交互体验。

| 计算器名称 | 核心数学模型与功能 | SEO 目标关键词 |
| :--- | :--- | :--- |
| **1. 尺寸与单位换算器** | 建筑级英制（Feet-Fractional Inches，如 `12'-6 1/2"`）与公制（Millimeters, Meters）之间的高精度双向换算。支持复制并直接粘贴回 CAD 标注。 | `cad unit converter`, `feet to mm cad` |
| **2. 绘图比例因子换算器** | 输入图纸真实尺寸和目标打印纸张大小（A0 - A4），智能算出视口比例（Viewport Scale）、标注特征比例参数（DIMSCALE）和线型比例参数（LTSCALE）。 | `cad scale factor calculator`, `ltscale viewport` |
| **3. ISO/ANSI 公差与配合速查器**| 输入基本尺寸（如 50）与公差配合代号（如 H7/g6），即时输出最大/最小极限尺寸、上下偏差。通过 SVG 动态重绘公差带，直观显示间隙或过盈。 | `iso tolerance calculator`, `shaft hole fit lookup` |
| **4. 螺纹标准规格速查器** | 提供公制 (Metric M系列) 与美制 (UNC/UNF) 螺纹规格的完整牙距、公称直径、底孔钻头尺寸速查，免去翻阅机械设计手册。 | `tap drill size chart`, `metric thread specifications` |
| **5. 角度度分秒 (DMS) 转换器** | 十进制角度（如 `45.75°`）、度分秒（`45°45'00"`）及弧度之间的双向高精度毫秒级转换。 | `degrees minutes seconds converter`, `dms to decimal` |

---

## 2. 跨软件与工作流长尾内容规划 (Cross-Software & Workflow SEO Plan)

由于全球 CAD/BIM 软件目录已臻物理上限（已收录 240+ 款工具），我们将内容增量瞄准了**数万个日常工作流痛点的长尾搜索词**。通过提供跨软件迁移指南与工作流排错百科，获取高意图、高转化的精准流量。

### 2.1 跨软件迁移指南 (Migration Playbooks)
重点针对“从 AutoCAD 迁移到性价比平替（GstarCAD, BricsCAD, ZWCAD）”的企业 IT 管理员和绘图员：
*   **AutoCAD 快捷键别名兼容映射表 (.pgp)**：提供在线解析与转换工具，方便用户将个人快捷键习惯无缝导入新软件。
*   **AutoLISP / VBA 插件二次开发接口移植手册**：评估各平台 LISP/GRX 接口的兼容度，帮助企业技术部门评估迁移成本。

### 2.2 核心制图工作流指南 (Evergreen Workflow Guides)
*   **打印与线宽控制 (Plotting Standards)**：CTB（颜色相关打印样式）与 STB（命名打印样式）精密转换指南，解决“打印 PDF 线条丢失或中文字体显示为问号”的经典问题。
*   **制图图层标准 (Layer Standards)**：AIA（美国建筑师协会）图层命名规范与机械加工图标准图层设置指南。
*   **硬件配置推荐 (Hardware Specifications)**：针对 CAD 图纸大装配和渲染（如 Rhino+Grasshopper、SolidWorks）的单核 CPU 与显卡选购指南。

---

## 3. 开发阶段状态跟踪 (Implementation Status)

结合 PRD 中的 **100 阶段落地蓝图**，当前项目的整体开发进度如下：

*   `[x]` **Phase 1 - 10 (技术基础建设)**：完成主路由配置（`/wiki`、`/calculators`）、导航栏和脚手架设计。
*   `[ ]` **Phase 11 - 20 (计算器模块开发)**：优先启动“尺寸单位换算器”与“绘图比例换算器”的前端数学模型与 React 组件开发。
*   `[ ]` **Phase 21 - 30 (SQLite 只读引擎)**：配置本地 `wikihub.db` 静态 SQLite 结构以支撑后续上万级 Wiki 页面的超低编译延迟。
*   `[ ]` **Phase 31 - 40 (Mega-Wiki 模板与交互组件)**：开发三合一多功能 Tab 切换面板与虚拟键盘快捷键过滤交互器。
*   `[ ]` **Phase 41 - 100 (数据填充、SEO 调优与上线)**：批量填充报错手册、快捷键数据、常青指南并最终上线部署。
