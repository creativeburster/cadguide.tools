# 📋 CADGuide.tools Development & Content Expansion Plan

本文件记录了 `cadguide.tools` 的长期内容扩张计划、交互式计算器子系统，以及长尾 SEO 攻坚规划。

---

## 1. 权威指南板块扩张计划 (Guides Hub Content Plan)

我们将指南体系划分为 **8 大核心大动脉**，专为 B-End 企业级专业用户提供硬核技术解决方案：

1.  **Troubleshooting（故障分析）**：解决致命崩溃、Exception Code 签名分析与注册表残留清理。
2.  **Performance（性能调优）**：图形加速设置、多线程分配基准、ISV 显卡驱动匹配。
3.  **Print & PDF（矢量出图）**：CTB/STB 打印线宽校准、PDF 转换中文字体乱码与线条丢失修复。
4.  **Standards & APIs（开发与标准）**：AutoLISP API 兼容性对照、CUIX 菜单与自定义 Hatch 导入。
5.  **BIM & Coordination（协同规范）**：BIM 执行计划 (BEP) 模板、LOD 300 到 LOD 500 精度边界约束。
6.  **MCAD & Geometry（内核与拓扑）**：Parasolid 与 ACIS 内核转换误差、NURBS 拓扑缝合（Topological Sewing）指南。
7.  **CAM & 3D Print（数字制造）**：CNC 刀路优化、G-Code 切片算法与 K-Factor 折弯系数。
8.  **SAM & Compliance（合规审计）**：FLEXlm 授权管理、Named-User 许可证合规审计防范对抗。

### 差异化内容排版模板
针对不同分类指南，我们设计了四套去 AI 化的技术模板以满足 Google 的 E-E-A-T 质量门槛：
*   **模板 A (技术尸检)**：包含 Exception Code 表格、病因诊断、Windows 注册表路径及修复代码块。
*   **模板 B (合规风控)**：包含合规风险晴雨表、EULA 协议条款漏洞分析、3 年 TCO 成本复利矩阵。
*   **模板 C (工业标准)**：包含 ISO/ANSI 标准元数据框、线宽对应对照表、一键部署脚本。
*   **模板 D (内核基准)**：包含几何精度丢失率（Tolerance Drift）表、C++ 或 Python 底层 API 示例。

---

## 2. 纯前端交互式微工具蓝图 (Interactive Calculators & Tools Blueprint)

为了提升用户页面停留时间 (Dwell Time)，我们计划推出 **5 款纯前端执行的交互微工具**。基于数据隐私保护，所有计算、文件解析均在**客户端浏览器本地**完成（零服务器上传，100% 数据安全）：

| 工具名称 | 输入参数 | 核心输出与交互 | SEO 目标 |
| :--- | :--- | :--- | :--- |
| **1. DXF 头文件与水印扫描器** | 拖拽上传本地 `.dxf` 文件 | 提取 CAD 版本代号、解析图层表（Layer List）并扫描是否带有教育版水印戳（Watermark Detection）。 | `online dxf viewer`, `dxf educational watermark detector` |
| **2. CTB 打印样式转换器** | 上传本地 `.ctb` 线型文件 | 动态渲染 255 色矩阵，点击色块查看笔宽、颜色覆盖、线性等参数，并提供 clean PDF 和 JSON 导出。 | `cad ctb reader`, `convert ctb line weights` |
| **3. 钣金折弯系数计算器** | 板材厚度 $T$、折弯半径 $R$、折弯角度 $A$、K-Factor | 基于 DIN 6935 标准计算弯曲补偿（BA）和扣除值（BD）。使用 SVG 2D Canvas 动态演示折弯受力与 Neutral Fiber 偏移。 | `k-factor sheet metal calculation`, `bend allowance calculator` |
| **4. 3D 打印弦高偏差优化器** | 孔径半径 (mm)、STL 导出角度 (deg)、打印机层高 | 计算 Chordal Deviation 弦高偏差（S），判断三维网格是否达到 Watertight 标准。SVG 可视化圆弧的多边形近似步长。 | `stl export tolerance calculator`, `mesh density optimizer` |
| **5. FLEXlm Options 配置生成器** | Daemon 端口、Feature Code、用户组列表 | 纯前端可视化选项编译器，支持 RESERVE, INCLUDE, TIMEOUT 等配置，一键下载标准 options.opt 文件。 | `flexlm options file builder`, `cad license reservation` |

---

## 3. 开发阶段状态跟踪 (Implementation Roadmap)

目前我们正处于**第一阶段基础建设与 Deals 页面上线**完成期：

*   `[x]` **Phase I (Deals 页升级)**：Deals 页面完成 19 个真实折扣整理、Tabs 分类器、复制功能，并开放搜索引擎 index。
*   `[x]` **Phase II (全局 Notice 优化)**：更新顶部 SiteNotice，向用户准确传递 cadguide.tools 定位。
*   `[ ]` **Phase III (交互计算器开发)**：优先启动“CTB 打印样式转换器”与“钣金折弯系数计算器”的纯前端 React 组件开发。
*   `[ ]` **Phase IV (企业级长尾指南铺设)**：按照 8 大核心领域逐步编写长尾叶子页并实现全站内链闭环。
