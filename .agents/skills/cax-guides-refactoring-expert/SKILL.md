---
name: cax-guides-refactoring-expert
description: 用于 CAx/BIM 软件专业技术指南与 Q&A 数据库的深度抓取、去 AI 味重构、方言映射及 SSG 静态路由隔离的 SOP 开发技能。
---

# 🤖 CAx/BIM 软件指南与 FAQ 深度重构操作指南 (SOP)

本技能旨在规范 `cadguide.tools` 项目中全量 240 个 CAD/BIM/CAE/EDA 软件的指南（Guides）与问答（FAQs）的扩容开发，确保生成的内容 100% 具备技术真实性，消除 AI 腔调，并彻底杜绝“张冠李戴”的穿帮现象。

---

## 📂 1. 技术事实获取与深度学习 (Fact-Finding & Grabbing)

禁止凭空捏造任何故障现象、参数、注册表路径或解决方案。所有内容必须通过搜索和抓取进行结构化重构：

### A. 数据源头优先级
1. **Autodesk 官方支持库 (Autodesk Knowledge Network - AKN)**：获取最权威的错误代码（如 1603, Error -15）以及官方排错指令。
2. **软件官方开发者指南 / Help Center**：获取最新的 API 迁移细节（如 Revit 2025/2026 API 向 .NET 8.0 移植，ObjectARX 版本与 MSVC 编译器的对照关系）。
3. **官方技术讨论论坛 (Technical Forums) 与 Reddit 热帖**：获取 BIM 经理、IT 网管和一线设计师讨论的真实痛点与可行的“非官方”民间避坑方案（如清除 CollaborationCache 缓存以解决中央模型同步死锁）。

### B. 核心参数与命令的真实性校验
* **Product Key (产品密钥)**：必须使用特定软件特定年份的真实密钥（如 Revit 2026 为 `829R1`，AutoCAD 2026 为 `001R1`）。
* **文件路径与注册表**：必须对齐实机运行路径，包括 `%APPDATA%`、`%PROGRAMDATA%` 与 `HKEY_CURRENT_USER\Software\...`。
* **选项文件参数**：对齐授权协议，如 `adskflex.opt` 里的 `TIMEOUTALL` 最小限制为 `900` 秒。

---

## 🛡️ 2. 内容隔离与物理防穿帮原则 (Zero-Degradation Content Constraints)

### A. 物理防噪熔断
在 `isArticleCompatibleWithTool` 与 `faq-data.ts` 的 `tools` 数组中执行硬编码隔离：
* **开源/免费工具**：彻底屏蔽并隐藏 `Procurement & TCO` (采购成本与 TCO) 板块及标签，防范在免费软件中出现授权购买等低级穿帮。
* **特定软件功能硬熔断**：
  * 免费/开源软件（如 FreeCAD, LibreCAD）绝对不允许出现商业授权/FLEXlm/EULA 审计网页；
  * 纯 2D 绘图软件（如 QCAD）绝对不允许出现 3D 实体缝合、K-Factor 钣金折弯或 G-Code 切片网页；
  * 不支持 API/LISP 引擎的软件（如 Revit, SolidWorks）绝对不允许生成 AutoLISP 或 PGP 别名配置网页。

### B. 行业行话方言映射 (Jargon Map)
为避免千篇一律的分类标签，在 `guides-client.tsx` 中配置动态行话映射，使不同门类的软件呈现差异化的专业 Tab 标签和大厅卡片：
* **BIM 类软件 (如 Revit, Archicad)**: 
  * `migration` ➜ `Dynamo & API Automation`
  * `manufacturing` ➜ `MEP & Structural Detailing`
  * `printing` ➜ `PDF Sheet Printing`
  * `standards` ➜ `BIM Standards & Coordinates`
* **MCAD 类软件 (如 SolidWorks, Inventor)**: 
  * `migration` ➜ `API & PDM Customization`
  * `manufacturing` ➜ `Sheet Metal & Solid Detailing`
  * `printing` ➜ `Drawing & Pen Styles`
  * `standards` ➜ `MCAD Formats & Standards`
* **2D CAD 类软件 (如 AutoCAD)**:
  * `migration` ➜ `AutoLISP & ObjectARX`
  * `printing` ➜ `Plot Style & Printing`
  * `standards` ➜ `CAD Layer Standards`

---

## ✍️ 3. 去 AI 味的正文重新撰写标准

* **直接与干练**：正文首段直切主题（Executive Summary），绝不使用 “In today's fast-paced world...”、“As we all know...” 等无意义引言。
* **结构化与矩阵化**：高频使用对比表格（Comparison Table）展示参数差异，使用代码块展示 CLI 参数和 GPO Batch 脚本。
* **标示源头链接**：文章尾部必须明确附带 **Source Links (出处来源链接)**，指明引用的 Autodesk AKN 页面或 Reddit/论坛原贴。

---

## 🚦 4. 本地编译与发布验证工作流

任何软件的扩容改动在提交前必须执行以下流程：
1. **生成与去重**：使用 Python 脚本生成元数据及 markdown 存根，脚本中必须包含防覆盖去重逻辑，跳过已精细化手写的正文文件。
2. **转义校正**：检查导出的数据文件中是否包含非法的反斜杠转义序列（如路径中的 `\8`），防止编译报错，必要时在生成时自动将 `\` 替换为 `\\`。
3. **类型校验**：运行 `npx tsc --noEmit`，确保无任何 TypeScript 类型隐患。
4. **SSG 打包测试**：在 Windows PowerShell 下带环境变量执行 `if (Test-Path .next) { Remove-Item -Recurse -Force .next }; $env:NEXT_FONT_GOOGLE_DISABLE_FETCH="1"; npm run build`，确保全站静态预渲染 100% 成功。
5. **本地 Git Commit**：在本地库进行 `git add .` 和 `git commit`。**严禁在未收到用户明确“push/推送”指令前执行 `git push`**。
