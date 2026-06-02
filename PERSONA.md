# 👥 CADGuide.tools Target Personas & Niche Market Research

本文件记录了平台的专业 B-End 目标受众画像、细分市场竞争，以及基准变现模型。

---

## 1. 核心受众画像 (B-End Target Audience Profile)

与常规面向零基础入门学生的 CAD 教程网不同，本平台**过滤低净值纯小白流量**，精准锁定拥有软件采购决策权或高频实操痛点的企业级（B-End）专业人士：

### 👤 主任建筑师 & 绘图室/BIM 经理 (Principal BIM/CAD Managers & CAD Lead Architects)
*   **职责范围**：制定多国协同设计办公室的图纸图层标准、图纸套模板规范、网络协作管道、以及多版本协作工作流。
*   **核心关注**：图件格式完整性、LOD 标注规范、大图打印及线宽 CTB  pen weights 配置。
*   **痛点**：PDF 打印乱码、大装配图纸协同延迟、图层分类混乱。
*   **价值**：高客单价的 BIM/CAD 软件订阅主要采购决策人，Cookie 极具商业转化价值。

### 👤 机械工程主管 & 工业设计师 (Mechanical Engineering Leads & Industrial Designers)
*   **职责范围**：负责高密度 parametric/generative assemblies、运动学仿真内核配置、数控加工与数字钣金流线。
*   **核心关注**：NURBS 复杂曲面精度、基本尺寸与公差带配合（H7/g6 等配合计算）、运动副干涉检测。
*   **痛点**：Rhino 到 Inventor 等不同建模软件间的模型缝合（Sewing）拓扑损坏、精度退化。
*   **价值**：Rhino 3D 等高价永久授权的直接买家，或中端 CAD 替代品的主导引入者。

### 👤 IT 管理员 & 软件资产合规总监 (IT Administrators & Software Asset Managers - SAM)
*   **职责范围**：管理公司 FLEXlm 网络许可守护进程、 Named-User 用户池授权、局域网静默 MSI 批量部署、Okta 统一认证。
*   **核心关注**：并发网络许可证的最大化利用率、逃避厂商的反盗版合规审查（Audit Letter）、以及排查静默部署错误。
*   **痛点**：网络漂移许可证连接超时、被厂商静默回传遥测数据判定违规。
*   **价值**：负责公司大宗正版软件采买与续签的核心技术把关人。

### 👤 数控/CAM 编程师 & 数字化制造者 (CNC/CAM Programmers & Digital Fabricators)
*   **职责范围**：配置 G-Code 刀具轨迹、计算折弯机 K-Factor 折弯系数、调节 SLA 3D 打印弦高偏差。
*   **核心关注**：Watertight 网格导出分辨率、底孔螺纹钻头规格速查。
*   **痛点**：网格表面步距条纹（Faceting Step）影响精加工品质。
*   **价值**：高精度工业微工具的日常高频用户，可带来大量工程论坛中的高质量自然外链。

---

## 2. 细分市场调研与分销变现模型 (Monetization & Affiliate Logic)

### 2.1 流量来源：高意图长尾痛点
*   CAD/BIM 软件的“选型购买”行为在企业中极低频发生（通常 3 年一次），而“使用报错、打印异常、参数换算”在工作中每日发生。
*   因此，我们不生产流水账式的 Blog，而是通过解决高频技术痛点（如 Fatal error 诊断、options.opt 语法生成器、K-Factor 换算）吸引大量的精准流量。

### 2.2 变现通道：全局子联盟拦截 (Sub-Affiliate Interception)
为同时保证高加载性能与谷歌 SEO 收录，平台采用**基于客户端点击拦截的动态转链**：

1.  **直链源码**：网站在静态 HTML 中完全呈现为官网原链接（例如 `https://www.sketchup.com`）。这对谷歌爬虫而言是完全绿色、无分销指纹的优质外链，**绝对防范 Doorway Page 或低质量站点算法降权**。
2.  **点击瞬间重定向**：全局加载的 **Brandreward** 脚本（或 Sovrn / Skimlinks 备选）在用户点击链接的微秒瞬间，拦截跳转请求，动态将其转化为带有我们 Site ID 标记（如 `81f9b4c973e1fb37a704344789dc0719`）的追踪链接。
3.  **多联盟分流与对比**：
    *   **Sovrn (VigLink)**：欧美大厂（Autodesk, SketchUp, Vectorworks）直签佣金高。
    *   **Brandreward**：替代品小厂（ZWCAD, progeCAD, nanoCAD, GstarCAD）及多国支付转化好。
    *   **页面分流设计**：在 `/deals` 页面使用 Brandreward 脚本来拦截小型 CAD 折扣码，在 `/tools` 和 `/compare` 页面可动态配置 Sovrn 脚本来获取大厂高额返佣。
