# 厂商事实库（已核实）

> 规则：这里只放「对官方页核过」的结论，附来源与日期。下一批先查这里，避免重复取证。
> 核实日期：2026-11-03

## AutoCAD（Autodesk）

- 卖法：**仅订阅**（Monthly / Annual / 3-Year）+ Autodesk Flex tokens。无永久授权。
- 版本：官网当前为 AutoCAD 2027 —— **页面文案不要写版本号**。
- 平台：桌面 Windows + macOS；Web；移动 iOS/Android。行业工具集（7 个）仅 Windows。
- 导入能力（官方 KB "What file formats can AutoCAD import?"）：**3DS（3DSIN）、IPT/IAM（IMPORT，仅 64 位）确实支持** —— 不要当错误删掉。
- 官方定价：`https://www.autodesk.com/products/autocad/subscribe`（会跳 overview，仍可用）。

## ZWCAD（ZWSOFT 中望）

- 卖法：**只有 Perpetual**。官网 "From $899, You own it forever"、"Perpetual and network licenses available"。
- 官方商店三档：Standard 899 / Professional 1399 / MFG 1699，**全部标 Perpetual**。
- 平台：Windows + Linux（中望官网 `zwsoft.cn/product/zwcad/linux` 有独立 Linux 线）；无 macOS 桌面版。
- 定价页：`https://www.zwsoft.com/store/index/index`（200，含价格）。

## BricsCAD（Bricsys → Octave）

- 归属：Bricsys 官方公告 2025-06-17 起新公司命名 **Octave**（Hexagon spin-off，预计 2026 上半年完成），
  官网已改用 "Octave BricsCAD"。中文站原文「Bricsys 正式更名為 Octave」。
- 域名：`bricscad.octave.com`（旧 bricsys.com 仍可用）。
- 卖法：1 年 / 3 年订阅 + **Lifetime Perpetual** + Network。
- 档位：Lite / Pro / Mechanical / BIM / Ultimate（五个）。
- 平台：Windows / macOS / Linux。
- 图形：**Redway3D（RedSDK）** GPU 渲染（官方系统需求写明）。
- 价格页：`https://bricscad.octave.com/store/bricscad`（200）。
  ⚠️ `https://bricscad.octave.com/bricscad/pricing` 是 **404**，不要用。
- 引擎：业界普遍记为 ACIS，但厂商页未明写 —— 属「未证实但通用」，L4 阶段需复核。

## MicroStation（Bentley）

- 卖法：**Virtuoso Subscription** = 12 个月 practitioner license + 若干 Keys（可换培训/专家服务）。
  官方原话："12-month Virtuoso subscription ... Includes 1 license and 2 Keys"。
- 起价：USD 2,656（Virtuosity 官方 eStore）。
- 平台：**64-bit Windows**。
- 定价页：`https://www.virtuosity.com/software/microstation/`（Bentley 官方 eStore，非 bentley.com 域名，属已知例外）。
- 其他授权：Enterprise / E365 / SELECT（企业向，需询价）。

## DraftSight（Dassault Systèmes）

- 引擎：**ARES**（Graebert 的 OEM 内核）—— Graebert 官网明确把 DraftSight 列为 ARES OEM 客户。
- 平台：**Windows + macOS 仍然支持**（官方下载页有 Mac ARM64 / Mac X86-64，2026 SP4.0）。
  ⚠️ `draftsight.com/system-requirements` 已 404（改版），别拿它当证据。
- 卖法：named-user / network / **perpetual**（官网首页 "Perpetual Licensing: One-time purchase"）；
  Professional/Premium 线上为年订阅，perpetual 走 reseller。
- 功能：G-Code Generator 真实存在（官方页面）。
- 免费版已于 2019 后停止。

## GstarCAD（Gstarsoft 浩辰）

- 平台：官方原文 "engineered to run natively on Windows, macOS, and Linux"。
- 卖法：**Perpetual + Subscription 都有**（`/buy/` 页 Perpetual 32 处、Subscription 20 处），另有 Network Floating。
- 定价页：`https://www.gstarcad.net/buy/`（最终落地页，标题 "Get Prices & Buy Official GstarCAD Software online"）。
  ⚠️ 旧 `/Eshop` 会 301 到 `/buy/`；部分网络环境会落到 "Find a Reseller" 页 —— 直接用 `/buy/`。
  ⚠️ `/pricing/`、`/price/` 都是 404。

## QCAD（RibbonSoft GmbH，瑞士）

- 许可：官网首页写 "The QCAD core is available under a **permissive** open source license"；
  社区版通常被记为 GPLv3 —— **措辞有冲突，不要写死具体版本**，改为直链官网。
- 卖法：Freemium。Community 免费（DXF 原生），Professional/CAM 为付费永久授权。
- 平台：Windows / macOS / Linux。
- 商店：`https://www.qcad.org/en/online-shop` → 实际落到 `qcad.org/prestashop`（能看到 €42/€110 等实价）。
- 注意：DWG 读写在 Pro，不在 Community。

## nanoCAD（Nanosoft）

- 卖法：1 年 / 3 年订阅；官方原文 "upgrade to a 3-year subscription to make your licenses permanent"
  —— **不要写成「3 年含永久授权」**，这是营销措辞。
- 平台：仅 64-bit Windows。
- 起价：Commercial from $289/year。
- 定价页：`https://nanocad.com/buy/`（200）。

## progeCAD（ProgeSOFT）

- 卖法：**Perpetual only**，官网 "Perpetual Licensing! No annual fee"，另有 iCARE 维护可选。
- 平台：Windows；macOS 走**独立产品 iCADMac**（官网仍在售，iCADMac 2025/2026）。
- 引擎：IntelliCAD（DWG 原生）。
- 建筑插件：官方现用名 **EasyArch**（"EasyArch 參數化插件"），不是过时名称。
- 格式（官方列）：Rvt、Rfa、IFC、STEP、IGES、SolidWorks、PDF、3D PDF、DWF、3DS、DAE、LWO、POV、Maya、OBJ、BMP、JPG、WMF、EMF、SVG。
- 定价页：`https://www.progesoft.com/en/buy`（200）。

## LibreCAD

- 许可：**GPLv2**（官网 "Open Source and GPLv2"），完全免费。
- 格式：DXF 原生读写；**DWG 只读**（不写）；JWW **仅导入**（导出无据，别写）。
- 平台：Windows / macOS / Linux（macOS 官方说"需要社区帮忙部署"）。
- 语言：30+。
- 来源：`https://librecad.org`。

## 通用经验

- 反爬 403（Autodesk、QCAD）≠ 死链；用抓取工具复核。
- 定价链接优先「最终落地 URL」，且要能通过 geo 变化保持内容稳定。
- 凡「3 年订阅变永久」这类营销话术，一律转述为「a 3-year term makes the licence permanent」，不要升级成法律意义上的 perpetual。

---

## TurboCAD（IMSI Design，美国）

- 四档：**Designer（纯 2D）/ Deluxe（2D+入门 3D）/ Professional（全 3D + ACIS）/ Platinum（production、约束、钣金）**。
  IMSI 自己的购买表里写作 "Pro"，产品页写作 "Professional"，两种叫法都能溯源。
- 卖法：**永久 + 1 年 / 3 年 Term 同时存在**，另有 Floating、Enterprise、Academic。
- 界面语言：**EN / FR / DE**（Preferences → Localization）。
- 平台：Windows 64-bit；macOS 11–26，Intel 与 Apple Silicon 双原生。
- 试用：**15 天**，页面 `https://www.imsidesign.com/resources/free-trial`
  （注意 `/free-trials` 会 301 到这里，`/products/shop/turbocad` 会 301 到产品页）。
- 格式矩阵（help.imsidesign.com，按 edition 分）：DWF / 3DS / OBJ / SKP 可读可写；
  **3DM 仅 Platinum 只读**；SVG 仅导出；CATIA / SolidWorks / Inventor / NX / Creo / Solid Edge 零件仅 Platinum 只读。
  官方「At a glance」写 **54 in / 34 out**（Platinum），但这是版本相关数字，正文别写死。
- 约束引擎正名：**D-Cubed**（Siemens），不是 "D-Cube"。

## CorelCAD（已停产，Corel → Graebert ARES）

- 停售 2024-01-09，最终版 **CorelCAD 2023**，停止支持 2025-12-31（Corel KB 130078）。
- **重要更正**：ARES Commander **2025 起已内建 .cdr / .des 读写**（Alludo 与 Graebert 合作的结果）。
  所以「ARES Commander 是没有 CorelDRAW 桥的同一个引擎」这句话**已经过时**，必须改。
- Graebert 迁移页 `https://www.graebert.com/corelcad/` **必须带尾斜杠**，不带会返回 520。

## Graebert ARES Commander

- 桌面三平台：Windows / macOS / Linux。ARES Touch（Android/iOS）与 ARES Kudo（浏览器）
  是**独立产品**，买 Trinity 套餐才含，不要写进 `platforms`。
- 授权：Monthly / Annual / 3-Year / **Perpetual**（含 365 天维护）+ Flex 浮动。
- 真实购买页：`https://www.graebert.com/cad-software/buy/configurator/`
  （`/buy`、`/pricing`、`/cad-software/ares-commander/pricing` 全部 520）。

## CAXA CAD 电子图板（数码大方）

- 公司英文名 **CAXA Technology Co., Ltd.**（北京数码大方科技股份有限公司）。"Digital Grand Technology" 是错的。
- 两个 SKU：**电子图板** 与 **电子图板 机械版**。没有「基础版 / 增强版」。
- 卖法：**年度/月度租用（线上）+ 永久授权（线下、带加密锁、走代理）**。
- 官网明确声明：**产品为中国大陆专用版本，价格仅适用中国大陆**，境外客户联系当地分销商。
- 格式：DWG/DXF 双向 + 批量版本转换；**PDF 可导入**（保留比例、图层、线宽、颜色）；
  导出 PDF / JPG / PNG / TIF。**官方从未提 DWF**，不要写。
- 购买页 `https://cad.caxa.com/pc/buy`；`https://cad.caxa.com/en/pricing` 是「大方讲堂」占位页，假的。

## MCAD / MECHCAD（Mechatronics Designed，泰国）

- `mcad` = **MCAD 2026**（2D，Windows + MCAD Web）；`mechcad` = **MECHCAD 2026**（3D CAD/CAM）。
  早期误判为「虚构产品」，实为两个真实姊妹产品，别删。
- 电气符号库官方数字：**547 symbols**（IEC 电气 + ISO 1219 气动），不是 700+。
- 命令数：**233 commands + aliases**。
- 格式：只读写 DWG/DXF；输出 G-code、DXF。**没有 PDF / SVG 的证据**。
- 价格公开（THB 15,000 永久 / 690 月 / 6,900 年，含 7% VAT）——但本站不渲染价格，只链接。

## SolidWorks（Dassault）

- 仍有**永久授权**（Professional 起），同时有年订阅 → `Subscription / Perpetual` 正确。
- **IFC 可导入**（3D Interconnect，IFC 2x3 / IFC 4），`file_formats_in` 必须含 IFC / IFCZIP。
- 3D Interconnect 支持清单：ACIS(.sat/.sab/.asat/.asab)、Inventor(.ipt/.iam)、CATIA V5、
  DXF/DWG、IFC、IGES、JT、Creo、Solid Edge(.par/.asm/.psm)、STEP、NX、xDesign。
  FAQ 里写 "ACIS (.sat)" 时，数组写 `SAT (ACIS)` 才能被校验器对上。

## Solid Edge（Siemens）

- 卖法：线上商店只卖**月度/年度订阅**，**永久授权通过 solution partner 购买** → `Subscription / Perpetual` 正确。
- 品牌迁移：现在叫 **Designcenter Solid Edge**，另有 SaaS 版 **Designcenter X Solid Edge**。
- `Designcenter X Solid Edge` **不在中国大陆提供**（Siemens 购买指南原文）。

## Archicad（Graphisoft / Nemetschek）

- **永久授权已终止**：新客户截至 2024-12-31，老客户截至 2025-12-31；**2026 起只卖订阅**。
- 在售计划：**Archicad Studio**、**Archicad Collaborate**、MEP Designer Studio、BIMcloud。
  **Archicad Max 是「Coming soon」，尚未开卖**——档位价格必须写 `Not for Sale` + period `coming soon`，
  不能写 `Contact Sales`（会让人以为能买）。

## SketchUp（Trimble）

- 域名已迁：`sketchup.com` → **`sketchup.trimble.com/en`**，`/plans-and-pricing`、`/try-sketchup` 同理。

## 其他链接事实

- CATIA 官方页：`https://www.3ds.com/products/catia`（`/products-services/catia/` 会 301）。
- ZW3D：`https://www.zwsoft.com/product/zw3d`。
- Glovius：`https://www.glovius.com/`（无 www 会 301）。
- KOMPAS-3D：产品页 `https://ascon.net/kompas-3d/`，公司站 `ascon.net` 单独存在。
- `official_url` 里**不要带 `?utm_source=`** 之类的追踪参数。

## 界面语言清单（`languages` 字段的唯一可信来源）

**通用规律：商业厂商的语言表在「本地化帮助 / 语言包下载页」，不在产品首页。**
首页写的 7 种常常是营销口径，帮助页才是全量。

| 厂商 | 可信来源 | 结论 |
|---|---|---|
| Autodesk AutoCAD | 2026 产品帮助语言页 | **16 种**（含荷兰语、芬兰语、匈牙利语、捷克语） |
| Autodesk Inventor | `autodesk.com/inventor-2026-help-download` | **13 种**（含捷克语、波兰语） |
| Autodesk Fusion | KB「Available User Languages」 | **8 种**（无繁体中文、无俄语） |
| Dassault SOLIDWORKS | `help.solidworks.com` 语言 MSI 清单 | **14 种**（含捷克语、波兰语、土耳其语） |
| Dassault CATIA V5 | V5 User Guide「Locales for which Version 5 delivers user interface files」 | **7 种 + 俄语 = 8**，**没有西班牙语、没有巴葡** |
| PTC Creo | PTC Store「Supported languages in Creo」+ 帮助「About Language Support」 | **11 种**。捷克语/波兰语**只有字符支持**，没有本地化 UI |
| Trimble SketchUp | `help.sketchup.com` Product questions | **13 种，有瑞典语、无荷兰语** |
| McNeel Rhino | `docs.mcneel.com` 启动参数 `/language=` 的 LCID 表 | **12 种，无葡萄牙语** |
| Corel / Graebert CorelCAD | CorelCAD 2023 规格（停售后由经销商存档） | **14 种** |
| Ribbonsoft QCAD | `qcad.org` User Interface Language（Tier 1 + Tier 2） | **34 种**（Tier 2 为机器翻译） |
| progeSOFT progeCAD | 官网语言切换器 ∩ iCAD 会员页「Language Support」 | **11 种**（交集口径），无葡语、无日语 |
| Nanosoft nanoCAD | nanoCAD 26「Multilingual Interface」+ 安装向导 | **7 种**，**国际版无俄语** |
| FreeCAD | `FreeCADGui.supportedLocales()`（wiki Localisation） | **36 项** |
| LibreCAD | `librecad/ts` 目录 68 个 `.ts` − 17 个西语地区变体 | **42 项**，**无马来语/保加利亚语/越南语** |
| Blender | `locale/po` 49 个 `.po` + 源语言英文 | **50 项**，每版会清理零活跃语种 |

**已确认无误、不要重复取证的**：autocad(16)、autodesk-inventor(13)、solidworks(14)、
fusion-360(8)、onshape(9)、turbocad(3)。

Onshape 的语言表藏在 `cad.onshape.com/help` 的「My Account – Preferences」日期格式表里
（英语 / 法德意西 / 简繁日韩 共 9 种），是个不显眼但极准的口径。

## 查看器 / 转换器 / 平台类（c4 已核）

**这一类的共同陷阱：格式能力远小于同厂建模软件，且很多根本没有「导出」。**

| 产品 | 官方口径 | 关键结论 |
|---|---|---|
| Bluebeam Revu | `support.bluebeam.com`「Revu can only open and edit PDFs」 | **只能开 PDF**。DWG/DXF/DGN/RVT/Office 都要先经 Stapler 转 PDF。IFC/U3D/PRC 仅作 3D PDF 的**输入**。STEP/IGES 全不支持 |
| Navisworks | `help.autodesk.com` 2026 格式表 + 导出 KB | 读入极宽（含 RVT/STEP/IGES/PDF/JT/CATIA/NX），**写出极窄**：NWD/NWF + DWF/DWFx/FBX/KML。**无 PDF 导出、无内置 3D PDF**。NWC 是 CAD 端 exporter 产物，不是它导出的 |
| Solibri | `help.solibri.com` Supported File Formats + 报告页 | 读 IFC 2x3/4、DWG（**仅 3D 几何**）、PDF（2D 叠加）、E57/LAS/LAZ、XLSX；导出只有 BCF/BCFZIP/PDF/RTF/XLSX + 自有 SMC。**IFC 导出存疑**（官方两处说法矛盾） |
| MeshLab | `pymeshlab` I/O 全集 | 网格/点云格式。**不支持 STEP/IGES/PDF/DWG/RVT**。DXF **仅导出**。开源 ISTI-CNR |
| ReCap Pro | `help.autodesk.com` supported_file_formats | 点云：E57/LAS/PTX/PTS/FLS/ZFS/RCS/RCP/CL3/CLR/RDS/PTG。**无 DWG/DXF、无 STEP/IGES/PDF**。**无 LAZ 导入**（官方查不到）。IFC 仅 2027 Mesh Editor 的 **IFC4 网格导出** |
| Solid Edge Viewer | `solidedge.siemens.com` free-viewer 页 | 只开 Solid Edge 原生 asm/par/psm/pwd/dft + DXF/DWG，只读，只能存图像快照。**STEP/IGES/JT/IFC 均无官方说明** |
| DWG TrueView | `help.autodesk.com/view/TRUEVIEW` | 只看/转换/发布：DWG（可回存至 R14）、DXF、DWT → DWF/DWFx/PDF/JPG/PNG。**不支持 IFC/RVT/STEP/IGES**。免费但**专有，非开源** |
| DWG FastView | `en.dwgfastview.com` | 2D：DWG/DXF/DWT 查看+编辑、跨版本另存；**3D 查看 RVT/STEP/IFC（view-only）**；导出 PDF/JPG/PNG/BMP；PDF↔DWG 互转。无 DWF |
| CADProps | `cadprops.com` | 92+ 扩展名；STEP/IGES B-Rep、IFC 网格、SolidWorks/Inventor/CATIA/NX/Parasolid 原生读取；DWG/DXF **仅 2D 视图、无 DWG 写回** |
| 3Dstudio.co Web Tools | `3dstudio.co` press kit | 3D converter **读 18 写 8**；各 viewer 分散支持 DWG/DXF/IFC/STL/3MF/OBJ/GLB/PLY/FBX；**RVT 经 Autodesk 转 IFC**（EU 服务器，24h 删除）——这条站内 FAQ 已有说明 |

**许可表述速查**：DWG TrueView = 免费**专有**；MeshLab = GPL 开源；Bluebeam/Navisworks/Solibri/ReCap = 订阅。
不确定就不要写「open-source」——校验器不检查 alternatives 里的许可措辞。

## CAM / 模具 / 钣金套料（c5 A 批 #83–110，已取证）

**这一类的共同陷阱：导入清单长、导出清单极短；「导入」不能对称成「导出」；
官方帮助里 "Options for importing and exporting X files" 是通用模板句，
只有出现 `Export Options` 段 / 明确 export 命令 / `Save As` 类型列表才算有导出依据。**

| 产品 | 导入（官方有据） | 导出（官方有据） | 关键结论 |
|---|---|---|---|
| Mastercam | 逐版本转换表逐项 R/W；STEP/IGES/Parasolid/SAT + 原生 SLDPRT/IPT/CATPart/PRT + DWG/DXF/STL | NC G-code、NCI + STEP/IGES/Parasolid/STL/DWG/DXF | 独立 CAD/CAM（非插件），Sandvik；购买页 `mastercam.com/how-to-buy/` |
| SolidCAM | **无独立矩阵**，宿主 SOLIDWORKS / Solid Edge / Inventor 打开原生件 | **仅 NC G-code** | 集成插件，格式能力属宿主，不能算给它 |
| Cimatron | STEP/IGES/Parasolid/ACIS/DWG/DXF 双向 + 原生读取 | NC G-code + ELT | 官方 Import/Export Capabilities 表；**无 IFC / RVT**；Sandvik；无公开定价页 |
| CAMWorks | **无独立矩阵**，能力绑定宿主 | NC G-code | **HCLSoftware**（常被误写 Hexagon/Dassault）；integrated 或 standalone；促销页已过期不宜作定价页 |
| Edgecam | 官方 2017R2 表只列导入：STEP/IGES/Parasolid/SAT/SolidWorks/Inventor/DWG/DXF | NC G-code | **无 CAD 模型导出官方说明**；`edgecam.com` → `hexagon.com` |
| GibbsCAM | ACIS/SAT、Parasolid、STEP、VDA-FS、IGES、DXF、DWG、STL | **IGES、DXF** + NC G-code | 导出只有 IGES/DXF；Sandvik（经 Cambrio）；官方商店 `gibbscam.com/en/shop` |
| hyperMILL | STEP/IGES/Parasolid/CATPart/SolidWorks/NX/Inventor/STL/DWG/DXF | STEP/IGES/STL/DWG/DXF + NC、POF | OPEN MIND（Mensch und Maschine 集团）；独立版 + 插件版；无公开价目表 |
| Tebis | STEP 双向；IGES/DXF 套餐相关；CATPart/NX/Creo/Parasolid/STL | STEP + 套餐相关 IGES/DXF + NC | **无 DWG 官方说明**；独立家族企业，未被 Sandvik/Hexagon 收购 |
| WorkNC | Nexus 导入表很全 | **只有 IGES/DWG/DXF** + NC | 无 STEP/Parasolid/SAT 导出依据；`WorkNC WP` 格式名无依据；原写死价格 / perpetual / 「德法工程背书」均无依据 |
| SURFCAM | Open 清单含 STEP/IGES/Parasolid/SAT/DWG/DXF/SLDPRT/IPT/STL | Save As **无 STEP、无 DWG**；IGES/Parasolid/SAT/DWG/DXF + NC | **STEP 只导入** |
| BobCAD-CAM | STEP/IGES/ACIS/DWG/DXF 双向；Parasolid X_T/X_B **只读**；STL/3DM 读者 | STEP/IGES/SAT/DWG/DXF + NC、BBCD | 官方商店是**年度订阅**（非永久授权），价格随版本变；部分旧 URL 已 404 |
| AlphaCAM | STEP **只导入**、DWG **只导入**、DXF/IGES 双向 | DXF/IGES + NC、ANC | 官方输出清单无 STEP、无 DWG |
| RADAN | DXF/DWG/CSV | clean DXF、RADAN Parts/Nest Project、NC code、CSV 报表 | STEP/IGES/Parasolid/SAT 在本体文档无逐项说明；**不能拿 DESIGNER / REcreate 文档充数** |
| Lantek Expert | DXF/DWG/DSTV 双向；IGES 笼统 Intelligent Import/Export | NC cut code、MEC、2D 几何、报表 | STEP 中文 FAQ 写「取决于配置」但无明确 in/out；`lantek.com/contact` 询价 |
| SigmaNEST | DXF/DWG/DSTV/STEP 原生；IGES/3D DWG/CDL/G-code/ESSI；Parasolid/ACIS 需 **CAD Import Plus** 选件 | NC code、报表、套料结果、DXF/DWG | **无 STEP/IGES 模型导出依据**；公司更名 SigmaTEK（Sandvik），产品名不变 |

**归属纠错（派活前提常被写错）**：Mastercam / Cimatron / GibbsCAM / SigmaNEST = Sandvik 集团；
CAMWorks = **HCLSoftware**；WorkNC / SURFCAM / AlphaCAM / RADAN / Edgecam / ESPRIT = **Hexagon**（Vero / DP Technology 收购，旧域跳转不是死链）；
hyperMILL = OPEN MIND（Mensch und Maschine 集团）；Tebis = 独立家族企业；
**SCIA Engineer = Nemetschek Group / ALLPLAN，不是 Hexagon**（本批唯一真错链）。

**母公司域名 / 遗留跳转（E10 已登记进 `CORPORATE_DOMAIN_PAIRS`）**：
`worknc.com` `surfcam.com` `alphacam.com` `radan.com` `espritcam.com` → `hexagon.com`；
`sigmanest.com` → `sigmateksystems.com`。Hexagon 只走 sales enquiry、不公开价目表。

## SCIA Engineer / ESPRIT（c5 专项）

| 产品 | 结论 |
|---|---|
| SCIA Engineer | 属 **Nemetschek Group（ALLPLAN 伞下）**，官方 `scia.net`，自有 webshop 是**订阅制**（曾公开标价，当前标注 offline，转当地销售）。官方 Import/Export 手册有 Import/Export/Update 三列；IFC 2x3/4、DWG/DXF、SDNF、ESA XML、DSTV、SAF 双向；报告导出 PDF（含 3D PDF）、RTF、HTML、TXT、XLSX。**手册里的 "StepSteel" 是钢结构 ASCII 交换格式，不是 ISO 10303 STEP** —— 官方无 STEP 导入/导出依据。`pricing_url` 指向 hexagon.com 是真错，已改 `scia.net/en/software`。 |
| ESPRIT | Hexagon（原 DP Technology）；主站归一到 `espritcam.hexagon.com`；新一代产品名 **ESPRIT EDGE**，旧线 ESPRIT 2K，**没有 "Hexagon ESPRIT" 这个正式产品名**。读取器按 CAD 系统名列出，完整清单在需登录的 ESPRITWeb。导出有据：NC/G-code、IGES、STL、Parasolid、ACIS(SAT)、DWG/DXF、GDML、BMP/PNG。**STEP 导出无官方依据**（STEP 帮助页只有 Import Options，且同模板的 CATIA/SOLIDWORKS/Inventor 页同样只有 Import Options）。只有 Sales Inquiry，无公开价目表。 |

## Engineering on Web（#143，免费浏览器工具）

官方 `engineeringonweb.com`（首页 / `/cad/` / `/fea/` / `/analysis/` / `/pcb/` / `/sobre` / 隐私政策 / 格式指南）。
**四个工具**（CAD、FEA、Analysis、PCB），不是三个；官方原文 "The tools are free."，
**没有 "100% free" 字面表述**；无注册、无安装程序，但**首次缓存约 50 MB 几何内核**。
- 执行边界：CAD 用 OpenCascade→WebAssembly，FEA 用 Web Workers + WebGPU（自动 CPU fallback）；
  但 **Analysis 统计计算在服务器**、文档有**匿名服务器副本**、大网格/STEP 可选走服务器 worker、
  **AI copilot 走 Puter.js / 服务器 AI**（官方警告勿发机密数据）。所以「完全客户端」「零云端留存」是错的。
- 格式：CAD 侧 **STEP/IGES/BREP/DXF 双向**，**"STL is export only."**（FEA 侧才能读 STL/DXF），
  工程图导出 **SVG 或 PDF（print，打印式）**；Analysis 图表只有 SVG/PNG；FEA 结果只有 CSV。
  官方无 Analysis/FEA 的 PDF 导出依据。
- 官方免责：安全相关设计须由合格工程师按适用标准复核。
- `detailed_features` 按官网四个工具区块重建，不要留空。

**结构分析软件的 PDF 报告输出**：是行业通用且官方有据（报告输出 ≠ 可编辑模型格式）。
佐证：Bentley STAAD.Pro 官方帮助 "export the report … a PDF document"；
Hexagon CAESAR II 用户指南 "Sends output reports directly to a .pdf file"；
SCIA Engineer 官方 "Export Engineering Report to PDF"。
→ `file_formats_out` 里写 `PDF Analysis Reports`、`Stress Reports (PDF/Excel)`、`PDF Calculation Notes`
这类复合名是**准确的**，E7 已升级为识别复合名中的 token，不要削成裸 `PDF`。

---

# 2026 年归属变更（三次已完成交易）

核验日期 2026-11-03。台账：**产品名保留旧名，归属更新到现母公司；官方 URL 换成现品牌域**。

| 产品 | 现归属 | 现正式名 | 官方产品页 | 备注 |
|---|---|---|---|---|
| MSC Nastran | **Cadence** | MSC Nastran | `cadence.com/en_US/home/tools/msc-software/msc-nastran.html` | 2026-02-23 Cadence 完成收购 Hexagon D&E（含 MSC Software）；产品名保留 MSC 品牌；文档暂留 `documentation.cadence.com` / 旧 Hexagon Nexus |
| MSC Adams | **Cadence** | MSC Adams | `…/msc-software/adams.html` | 同上 |
| MSC Patran | **Cadence** | MSC Patran | `…/msc-software/patran.html` | 同上；产品页 FAQ 仍链 `simcompanion.hexagon.com` 属支持门户过渡 |
| CAESAR II | **Octave** | Octave Aspect Pipe Stress | `octave.com/products/engineering-analysis/aspect/pipe-stress` | Hexagon 分拆 Octave Intelligence plc（2026-04-24 股东大会决议，独立上市）；官网保留 "Formerly CAESAR II"；文档仍 `docs.hexagonali.com` |
| PV Elite | **Octave** | Octave Aspect Pressure Vessel | `…/aspect/pressure-vessel` | 同上；官网 FAQ 明说 Aspect Pressure Vessel 是 PV Elite 的 rebrand |
| Aspen HYSYS | **Emerson**（品牌仍 AspenTech） | AspenTech Aspen HYSYS | `aspentech.com/en/products/engineering/aspen-hysys` | 2025-03-12 Emerson 完成收购剩余流通股，AspenTech 成全资子公司并退市；**品牌与域保留**，写 "an Emerson company"，不要写「被 Emerson 收购」 |
| PAM-STAMP | **Keysight CAE**（原 ESI Group） | Sheet Metal Forming (PAM-STAMP) | `keysight.com/us/en/products/design-engineering-software/computer-aided-engineering-software/sheet-metal-forming.html` | 2024-01-18 要约交割、squeeze-out；`esi-group.com` 现展示 Keysight CAE 品牌 |

**链接可达性实测（curl + 浏览器 UA）**：
- `octave.com/products/engineering-analysis/aspect/pipe-stress` → 200
- `octave.com/products/engineering-analysis/aspect/pressure-vessel` → 200
- `octave.com/contact`、`/contact-us`、`/company/contact`、`/request-a-demo` → **全 404**；
  只有 `/support` 200。→ 无公开询价页，`pricing_url` 用产品页本身。
- `cadence.com` 三个 MSC 产品页 + `/en_US/home/company/contact-us.html` → 200
- `hexagon.com/products/caesar-ii`、`/pv-elite` → 403（**反爬，不是死链**，仍返回 Octave 内容）
- `madegrain.com/nestforge/#pricing` → 200（NestForge 定价锚点）
- `dinamicpro.ro/quantcad-hybrid.html` → 200（QuantCAD-Hybrid 官方页）

---

# CAE / CFD 格式与定位（c5 B 批 #111–122，已取证）

共同错误：把「求解器输出 / 原生工程文件 / 输出内容描述」当成交换格式，以及把导入对称成导出。

| 产品 | 形态 | 导入（有据） | 导出（有据） | 关键否定 |
|---|---|---|---|---|
| ANSYS Fluent | CFD 求解器 | MSH/CAS/CGNS/STL + 第三方求解数据（NASTRAN/PATRAN/I-deas/ABAQUS） | CAS/DAT/MSH/CGNS/EnSight/FieldView/Tecplot/VTK/NASTRAN/PATRAN/I-deas/ABAQUS/ASCII | **不直接读 STEP/IGES/Parasolid**（经 Fluent Meshing CAD reader）；无 CSV / 模型导出 |
| ANSYS Workbench | 项目平台 | WBPJ/WBPZ/MSH/CAS/CDB/BDF/INP + CAD attach | WBPJ/WBPZ | WBPJ/WBPZ 是项目/归档；几何写出属 DesignModeler/SpaceClaim；**无 PDF 导出** |
| ANSYS Discovery | 直接建模+实时仿真 | SCDOC/DSCO + STEP/IGES/Parasolid/SAT/STL/OBJ/DWG/DXF/VRML/AMF/PLY/3D PDF | 同左 | **SCDM 是产品缩写不是扩展名**（SCDOC/DSCO）；无 3MF；不导出 WBPJ |
| Abaqus | FEA 求解器+CAE | CAE/INP/ODB + STEP/IGES/Parasolid/SAT/VDA-FS/CATPart/SLDPRT/DXF/CDB/NASTRAN | CAE/INP/ODB/FIL/STEP/IGES/SAT/VDA-FS/OBJ/VRML/3D XML/NASTRAN | **不能导出 Parasolid/CATIA/SOLIDWORKS/NX/Elysium**；无 STL / CSV |
| COMSOL | 多物理平台 | STEP/IGES/Parasolid/SAT/DXF/DWG/STL/PLY/3MF/VRML（+NASTRAN 属网格表） | STEP/IGES/Parasolid/SAT/DXF/STL/PLY/3MF/NASTRAN/VTU/CSV/TXT/XLSX | **输出是 `.vtu` 不是裸 VTK**；**无 MP4**（GIF/AVI/WebM）；MPH 是原生模型 |
| LS-DYNA | 求解器 | 求解器只读 keyword（.k/.key/.dyn）；PrePost 才有 IGES/STEP/STL/OBJ/Nastran | d3plot/d3thdt/binout + keyword；PrePost 可写 CSV | **无 VTK/EnSight/INP**；d3plot 是求解器输出 |
| Simcenter STAR-CCM+ | CFD 平台 | STEP/IGES/Parasolid/CATPart/STL/CGNS/NASTRAN/IFC/JT + 原生 CAD | CGNS/NASTRAN/CSV/MP4/PNG/PDF/SCD5 | **无 VTK/EnSight 导出**；SIM 是原生工程；"Images" 不是格式名 |
| OpenFOAM | C++ 工具箱 | STL/OBJ/Fluent MSH/Gmsh MSH/UNV/CCM/legacy VTK/I-DEAS/Plot3D | VTK/EnSight/Fluent MSH/pro-STAR/GMV/OBJ | **无官方统一格式表**；blockMeshDict 不是导入格式；`.foam` 是 ParaView 占位；**CGNS 不在官方发行版** |
| SimScale | 云 CAE | 原生（Parasolid/SLDPRT/IPT/3DM/CATPart/PRT/PAR/RVT/nTop）+ 中性（STEP/IGES/SAT/STL） | .foam 文件夹 / VTM / Ensight Gold .case / CSV / PDF / MP4 | **下载返回原件，不导出改后的 STEP/IGES**；**无 "Cloud Interactive 3D"** 官方术语 |
| Femap | FEA 前/后处理 | STEP/Parasolid/IGES/SAT/NASTRAN/Ansys CDB/Abaqus INP/DXF/CATPart/SLDPRT/3DXML/Rhino 3DM/STL | NASTRAN/Ansys/Abaqus/STEP/IGES/Parasolid/SAT/JT/STL/VRML/CSV | **JT 是导出，非导入**；BDF/CDB/INP 是分析模型接口 |
| Altair Inspire | 结构仿真+拓扑优化 | 几何（STEP/IGES/Parasolid/SAT/3MF/CATPart/IPT/JT/Creo/NX/SLDPRT/STL/OBJ）+ 网格（STL/OptiStruct fem/dat/nas） | 几何（STEP AP214/IGES/Parasolid/SAT）+ 网格（STL/VRML/OBJ） | **3MF 仅导入**；**FEM/dat/nas 仅导入** |
| MSC Patran | FEA 前/后处理 | DB/PAT + STEP/IGES/Parasolid/ACIS/CATIA V4/V5/V6/Creo/SOLIDWORKS/NX/STL/JT/PLMXML/BDF | PAT/STEP/IGES/Parasolid/ACIS/BDF/INP/CDB | **无 JT 导出、无 STEP AP242**；DB 是原生，PAT 是中性文件 |

---

# 结构 / 管道 / 土木（c5 C 批 #123–143，已取证）

| 产品 | 原生 | 有据交换 | 关键否定 |
|---|---|---|---|
| CAESAR II → Octave Aspect Pipe Stress | CII | CII（双向）、C2 / Caesar II XML（AutoPIPE 写出给 CAESAR II） | **PCF 直接互转未确认**；Stress Reports / 3D Deflection Visuals 是输出内容非格式 |
| Bentley AutoPIPE | DAT | DAT/PCF/CII/C2/XML/MDB/SQLite/PLT/DXF/DGN + Word/Excel 报表 | **无原生 PDF 导出**（打印/PLT）；C2/XML 仅 AutoPIPE 导出，反向未确认 |
| PV Elite → Octave Aspect Pressure Vessel | PVI | PVI、DXF | ASME 计算报告 / 3D PDF / Word/Excel 是报表内容 |
| Aspen HYSYS | HSC | HSC、HYSYS XML、HFL、Excel（ASW / 内置 Spreadsheet / COM） | **DEX / DWG / PDF 无官方依据**；Excel 不止 ASW 一条路 |
| CSI SAP2000 / ETABS | SDB / EDB | DWG/DXF/IFC/CIS/2（方向依操作与版本） | **CSiXRevit 是插件不是格式**；PDF 分析报告不是官方格式 |
| Bentley STAAD.Pro | STD | DXF/CIS/2/ISM | **无 DWG**；IFC 仅经 ISM/iTwin 间接；有 PDF 报告 |
| Tekla Tedds | TED | TED 源文档；PDF/RTF/Word 输出文档 | **Excel 是变量链接不是文档导入** |
| Autodesk Robot | RTD | IFC（仅导入）、DWG/DXF、SMXX | **不直接读写 RVT**（Revit 是插件+SMXX）；**无 PDF Calculation Notes** |
| IDEA StatiCa | ideaCon | SAF（仅导入）、IFC（仅导出）、DWG/DXF（仅导出） | **无 3D PDF**；Tekla/Revit/STAAD 等是插件连接非格式 |
| RISA-3D | R3D | DXF；SDNF（仅导出）；CIS/2（需独立 Translator） | **Revit 是双向链接插件**；**PDF 不是官方导出**；属 Nemetschek Group |
| MIDAS Civil NX / Gen | MCBZ / MGT | DXF、MCT/MGT 文本命令 | **无 DWG**；XLSX 不是 File > Export 格式；**Civil NX 与 Gen 不互通** |
| PowerMill | — | 导入 STEP/IGES/Parasolid/SAT/DWG/DXF/STL/DGK；导出 NC/CL/DGK/STL | **无 STEP/IGES/DWG/DXF 导出**；F3D 是 Fusion/FeatureCAM 的，不属 PowerMill |
| PAM-STAMP | — | 官方公开页**无格式矩阵** | **STEP/IGES/VDA 导出无依据** → out 留空 |
| NestForge | — | SVG / text DXF 导入；SVG / DXF / PDF 排版输出 | **无 G-code**；"Germany" 无官方依据；pricing 锚点 `#pricing` |
| QuantCAD-Hybrid | — | STEP/STP、PDF、Excel 导入 | **CSV 无依据**；导出格式官方未点名 → out 留空 |

---

# A 批残留 12 个（c5 #83–110 补充取证）

| 产品 | 形态 | 导入 | 导出 | 关键纠正 |
|---|---|---|---|---|
| nTop | 隐式建模平台 | STEP/Parasolid/ACIS/CATIA/Creo/Inventor/NX/SOLIDWORKS + STL/OBJ/PLY/3MF + FE 网格 INP/CDB/BDF/CGNS/UNV/PAT/MSH | STEP AP242/Parasolid/**IGES**/网格/FE 网格/CSV/CLI | **IGES 只出不进**；"FE Mesh" 是内容标签 |
| Materialise Magics | 增材数据准备 | STL/3MF/STEP/OBJ/AMF/PLY/DXF + 可选模块 IGES/Parasolid/CATPart/SLDPRT/JT | STL/3MF/STEP/AMF/OBJ/PLY/DXF/CLI/SLC/**SLL** | 原生 CAD 仅导入；**SLI 应为 SLL**；"Machine build files" 是内容标签 |
| ANSYS Mechanical | FEA 求解器+前后处理 | STEP/IGES/Parasolid/SAT/CATPart/SLDPRT/IPT/DWG/DXF/JT/Rhino 3DM/SCDOC | STL/AVZ/PMDB/NASTRAN BDF/CSV/TXT | **不导出几何**（STEP/IGES 属 SpaceClaim/DesignModeler）；**无 3D PDF**（第三方插件）、**无 VTK** |
| MSC Nastran | **纯求解器** | DAT/BDF/NAS（+OP2 restart） | F06/F04/OP2/PCH/XDB/H5/PLT | **无 CAD 导入**；**无 CSV 导出** |
| Altair HyperWorks | CAE 前处理平台 | HM + CAD readers + NASTRAN/INP/CDB | HM/STEP/IGES/Parasolid/**JT**/OptiStruct FEM/INP/CDB | **H3D 是结果文件非几何导出**；CAD 写出器经 `*geomexport` |
| TopSolid | CAD/CAM 一体 | TOP + 双向（STEP/IGES/Parasolid/ACIS/CATIA/JT/VDA/DWG/DXF/STL/3MF/AMF/IFC）+ 只读（SLDPRT/IPT/NX/Creo/Revit/Rhino/OBJ） | 同双向集 + PDF(2D&3D)/DSTV/glTF | **SLDPRT/IPT 仅导入**；**NC(G-Code) 不是交换格式** |
| VISI | 模具 CAD/CAM | STEP/IGES/VDA/Parasolid/DWG/DXF/STL/SW/SE/Inventor/CATIA/NX/Creo/JT/SAT | **STEP/IGES/VDA/Parasolid/ACIS/CATIA V5/NX/JT/DWG/DXF/3D PDF** | **「无写出器」旧结论被推翻**（官方手册 + 2025.2 帮助） |
| KISSsoft | 齿轮计算 | **仅 KISSsys/KISSdesign 原生**（无 STEP/Parasolid/IGES/DXF 导入） | STEP/Parasolid/DXF(2D)/IGES(2D)/GDE/GAMA/REXS | **四项全只出不进**；无 G-code；"3D Tooth Profiles" 是内容 |
| FeatureCAM | CAM 编程 | STEP/IGES/Parasolid/ACIS/SLDPRT/IPT/DWG/DXF/STL/F3D | **仅 DXF/DWG/IGES/STL** | **不导出 STEP**；FM 是原生工程文件 |
| AutoForm | 钣金成形仿真 | IGES/VDA/STL（官方文字）+ STEP/CATPart/Parasolid（仅对话框，部分确认） | **IGES/VDAFS**（仅此有据） | **无官方统一矩阵**；STEP 导出/AF results/Compensated CAD/Reports 无依据 |
| Moldflow | 注塑模流 | UDM/STEP/IGES/Parasolid/SAT/SLDPRT/IPT/STL/CATPart/JT/SDY/UNV/BDF/PAT | MFR/STEP/STL/UDM/IGES/SAT/PAT/NOD/H3D/SMT/MFL/TXT/XML/HTML | **STEP 是通用几何导出，不是 "STEP (Warpage)"**；CSV 非官方格式表项（曲线出 TXT/XML） |
| Moldex3D | 注塑模流 | STEP/IGES/Parasolid/STL/JT/MFE/Nastran DAT/ANS/PAT/UNV/INP | STEP/MFE/MSH/PAT/UNV/ANS/DAT/FEM/STL/CSV/LS-DYNA deck/PPT/XLSX | **VRML 无依据**；PDF 仅旧版报告；"STEP (Deformed)" 是内容限定 |

---

## EDA 层（c6 #144–159）2026-11-03 取证

### 格式矩阵

| slug | 形态 | 导入有据 | 导出有据 | 关键否定 |
|---|---|---|---|---|
| kicad | 开源 PCB 全流程 | Altium(PrjPcb/SchDoc/PcbDoc)、CircuitStudio(CSPcbDoc)、CircuitMaker(CMPcbDoc)、Allegro(BRD)、CADSTAR(CSA/CPA/CSAG)、EAGLE(SCH/BRD XML)、EasyEDA(Std JSON / Pro EPRO)、Fabmaster(FAB)、PADS ASCII、P-CAD 200x、gEDA/Lepton、LTspice(ASC)、SolidWorks PCB(SWPcbDoc) | Gerber RS-274X/X2、Excellon、IPC-2581、ODB++、GenCAD、IPC-D-356、PDF、PostScript、SVG、DXF、STEP、VRML、STL、IDF、GLB、BREP、XAO、PLY | **无 IGES**；**无内置 autorouter** |
| diptrace | 桌面 PCB | DipTrace XML、DXF、EAGLE、Altium、P-CAD、STEP、VRML | Gerber RS-274X+X2、Excellon、ODB++、IPC-2581C、IPC-D-356A、Pick&Place、BOM、DXF、STEP、VRML | **无 Linux 原生版**（仅 Win 32/64 + macOS） |
| circuitmaker | 免费云 PCB | SchDoc、CMPcbDoc、DXF、STEP | Gerber、NC Drill、ODB++、IPC-D-356、BOM、SmartPDF、STEP | **无 IPC-2581**；从未要求公开项目；无 Pro 层 |
| easyeda | 网页/桌面 | EasyEDA JSON、Altium SchDoc/PcbDoc、EAGLE、KiCad、LTspice、DXF | Gerber、NC Drill、Pick&Place CSV、BOM、PDF、SVG、STEP | **无 IPC-2581 / ODB++** |
| ltspice | 纯 SPICE 仿真 | ASC、ASY、CIR/NET、LIB/MOD、RAW | NET、RAW、TXT、LOG、MEAS、FFT、BMP/WMF、WAV | **无任何制造格式**（Gerber/ODB++/IPC-2581 全无） |
| multisim | SPICE 仿真 | MS14、SPICE netlist、模型库、LabVIEW | MS14、netlist、BOM、Excel/CSV、PDF | **Gerber 属 Ultiboard，不属 Multisim** |
| eagle | 已停售 PCB | SCH、BRD、LBR、EAGLE XML、DXF | Gerber RS-274X、Excellon、DXF、PDF、STEP、位图 | **无 Gerber 导入**；IPC-2581 仅社区 ULP |

### 商用 EDA（公开矩阵不完整，需按版本/模块确认）

| slug | 持有者 | 许可 | 备注 |
|---|---|---|---|
| altium-designer | Altium | 订阅（`altium.com/develop/pricing` 200） | 套餐已改为 Altium Develop / Agile Teams / Agile Enterprise |
| altium-365 | Altium | 订阅 | **不自有格式矩阵**，继承 Altium Designer |
| eplan-electric-p8 / eplan | EPLAN（`eplan.com`，`eplan-software.com` 已 301 至此） | 订阅 | STEP 属 **Pro Panel 模块**，非 Electric P8 本体 |
| allegro-pcb / orcad | Cadence（`orcad.com` 301 → `cadence.com/.../orcad.html`） | Perpetual（Allegro）/ 订阅+永久（OrCAD） | **不导入 Gerber**；OrCAD 无 IGES |
| pads-professional / xpedition | Siemens EDA | 订阅+永久 | 官方页面 siemens.com 200；eda.sw.siemens.com 301 |

### 2026 年商业事实

- **Proteus**（Labcenter）：现行为 **Enterprise / Platinum / Custom** 三档，永久授权，
  价格只在配置器里给（`labcenter.com/pricing/` 200），不得写死。
- **EasyEDA**：编辑器 Standard 与 Pro **均永久免费**；付费的是商业使用会员
  （Premium Commercial、Enterprise、On-premises），核心功能"free forever"。
- **NI Multisim**：2023-10-11 并入 **Emerson**（$8.2B），品牌与 ni.com 保留；
  现行分 **Education / Designers**，订阅与永久两种授权并存。
- **Autodesk EAGLE**：官方支持文章确认 **2026-06-07 起停止销售与支持**；
  EAGLE Free 同样在该日终止；永久授权不受影响。

### c6 第二轮深挖（2026-11-03）：方向性与模块归属

| 事实 | 依据 | 影响 |
|---|---|---|
| **Altium IPC-2581 是纯导出** | altium.com/documentation「IPC-2581 Support_AD」：`File » Fabrication Outputs » IPC-2581`，产出 `.cvg`，需 IPC2581 扩展（默认安装） | `altium-designer` / `altium-365` 的 `in` 不得含 IPC-2581 |
| Altium Import Wizard 覆盖面 | 同上文档族：Protel 99SE(DDB)、P-CAD、OrCAD、PADS、EAGLE、CircuitStudio、xDxDesigner | 这些才是 `in` 的正当成员 |
| **Allegro / OrCAD / PADS 不读 DWG** | 三者机械交换均以 DXF（+STEP/IDF）为主，DWG 需先转 DXF | `in` 去 DWG；FAQ 措辞写「需先转 DXF」 |
| HyperLynx 为独立许可 | Siemens PADS / Xpedition 的 SI/PI/Thermal/EMC 分析由 HyperLynx 提供，按 bundle 授权 | `detailed_features` 必须标注 "(HyperLynx)" |
| Sigrity / Celsius 为独立许可 | Cadence Allegro / OrCAD 的 SI/PI 由 Sigrity、热分析由 Celsius 提供 | 标注 "(Sigrity option)" "(Celsius option)" |
| Xpedition 品牌 | Mentor Graphics 2017 年更名为 Siemens EDA | 不得再写 "Mentor Graphics" |
| KiCad 无 autorouter | 官方文档无自动布线功能 | `multicore` 不得写 Autorouting |

---

## 切片 / 渲染 / DCC / 垂直行业（c7 #160–186）2026-11-03 取证

### 切片器

| slug | 导入 | 导出 | 依据 |
|---|---|---|---|
| ultimaker-cura | STL, 3MF, OBJ, X3D（+ 位图作高度图） | G-code, UFP, 3MF 工程, STL | 不读 STEP/IGES |
| prusaslicer | **STL, STEP, 3MF, OBJ, AMF**（官方原文） | G-code(.gcode/.bgcode), 3MF 工程, STL, OBJ, AMF, SL1 | STEP 导入自 **2.5.0**（2022） |
| bambu-studio | **3MF, STL, STEP, AMF, OBJ, SVG**（官方 wiki + H2D 手册） | 3MF 工程, G-code, STL | 基于 3MF 工程流 |
| simplify3d | STL, OBJ, 3MF | G-code, X3G | 纯网格 |
| autodesk-netfabb | STL, OBJ, 3MF, AMF | 机器构建数据 / 切片 / G-code | 不读 STEP |

**Netfabb 2026 重组**（Autodesk 官方购买页 + 多家行业媒体一致）：
Ultimate 退役（无 2026 版、不可续订、席位冻结在 2025.1）；Premium 更名为
**Netfabb**，只随 **Autodesk Fusion with Netfabb** 出售；Selective Space Structures、
Optimization Utility、Lattice Topology 停止开发；Netfabb Online 修复服务已下线；
Netfabb Local Simulation 单独报价。

### 渲染器（共同事实：输出是影像，不写 CAD）

| slug | 输入 | 输出 |
|---|---|---|
| keyshot | STEP/IGES/Parasolid + 原生 SLDPRT/SLDASM/IPT/IAM/CATPart/PRT + 3DM/SKP/OBJ/FBX/glTF/USD | PNG/JPG/TIFF/EXR/PSD、MP4/AVI、USD/USDZ/glTF |
| lumion | FBX/OBJ/DAE/SKP/3DS/DWG/DXF/STL + LiveSync | MP4、PNG/JPG/BMP/TGA、360 全景 |
| enscape | **无导入器**，读宿主活模型：RVT/SKP/3DM/PLN/VWX | PNG/JPG/EXR、MP4、360、EXE 独立查看器、Web 独立页 |
| twinmotion | FBX/OBJ/glTF/SKP/C4D/3DS/DAE/Datasmith | MP4/PNG/EXR/360、EXE、云演示链接 |
| d5-render | SKP/FBX/OBJ/3DM/ABC/glTF/DAE/3DS + 实时联动 | PNG/EXR/TIF/JPG、MP4/AVI、360、虚拟漫游 |
| v-ray | 宿主场景 + VRSCENE/OBJ/FBX/Alembic/USD | EXR/PNG/TIFF/JPG、VRIMG、VRSCENE |
| corona-renderer | 宿主场景 + OBJ/FBX/Alembic、CGeoProxy(.cgeo) | EXR/PNG/TIFF/JPG、CXR、.cgeo |

### DCC / 内容创作

- **3ds Max**：原生 .max；交换 FBX/OBJ/USD/Alembic/glTF/3DS/STL + DWG/DXF/SKP。
  **不原生读 STEP / IGES / SAT**（需第三方转换器）。
- **ZBrush**：.ztl/.zpr + OBJ/FBX/STL/PLY + GoZ；导出另含 VRML、EXR/TIFF 贴图。
  归 Maxon（德国），不读 .ma。
- **CLO 3D / Marvelous Designer**：共同点是 **DXF-AAMA / DXF-ASTM** 纸样标准；
  几何走 OBJ/FBX/glTF/USD/Alembic。CLO 偏服装生产，MD 偏影视游戏。

### 测绘与垂直行业

- **InfraWorks**：自有的 IMX 是核心；**不导出 DWG**，详细设计经 IMX 进 Civil 3D。
- **Maptek Vulcan**：DWG/DXF/CSV/LandXML/LAS + Surpac(STR)/Datamine；模块化永久授权。
- **pic2CAD**：**只读照片**（PNG/JPG/TIFF/WEBP），出 DXF/SVG/PNG，无任何 CAD 输入。
- **MatrixGold**：Rhino 内核，.3dm 原生；出 STL/3MF 供打印或雕刻。
- **AVEVA Marine / E3D**：STEP/IGES/DWG/DXF + AVEVA RVM 作审阅发布格式。

## 收尾轮补录（更名 / 品牌套件 / 退化套餐）

### SigmaTEK（原 SigmaNEST 公司）

| 事项 | 事实 | 来源 |
| --- | --- | --- |
| 公司更名 | 2026-10-12「SigmaNEST 公司」→ **SigmaTEK**，隶属 **Sandvik Group**；**产品名仍为 SigmaNEST** | sigmateksystems.com/en/news/sigmanest-company-becomes-sigmatek |
| 域名 | `sigmanest.com` → 301 → `sigmateksystems.com`；产品页 `https://www.sigmateksystems.com/en/sigmanest` | curl -L |
| 总部 | Mason, Ohio（原 Cincinnati）；1993 年成立；23,000+ 客户 / 50+ 国家 | 官方 press release |
| 当前发布 | **SigmaTEK Connected Shop Suite V27**（新名后首个版本，主题 Automate and Simplify） | 同上 |
| AI | **SigmaTEK Copilot**，内置进 SigmaNEST，V27 有 200+ 动作，需有效维护计划 | 同上 |
| 客户门户 | my.sigmateksystems.com | 同上 |
| 套料引擎 | **HD SuperNest**（time-based，持续重排直到收益率不再提升）；另有 HD Rectangular / Trueshape / Advanced Automatic Nesting / Shear / Continuous / AutoDynamic Punch | 官方 /en/sigmanest |
| 模块 | Profile AutoNC、Advanced NC Profiling、Common Line Cutting；Knife/Router/Drilling/Waterjet/Bevel/Profile-Punch/Right Angle Shear NC/Profile Destruct/Punch Tooling/BHQ | 同上 |
| CAD 导入 | DXF / 3D DWG / IGES / DSTV / STEP；PDF 与栅格图转零件；直连 SolidWorks / Inventor / NX / Solid Edge；**CAD Import Plus** 加 Creo / Rhino / CATIA / Parasolid | 同上 |
| **范围边界** | SigmaNEST 本体只做 **2D/坡口型材切割、铣削、冲压**。tube = **SigmaTUBE**、beam = **SigmaBEAM**、saw = **SigmaSAW**、press brake = **SigmaBEND** —— 都是独立 SKU | 官方 /en/cad-cam |

### 退化套餐（`name` == `pricing_type` 且 `features` 为空）

| slug | 官方真实档位 | 来源 |
| --- | --- | --- |
| cypecad | **CYPECAD ADVANCED**（2 程序 33 模块）、**CYPECAD EXPERT**（含钢/木/组合结构、冲切、土-结构相互作用、节点抗震、防火） | shop.cype.com/en |
| vertex-bd | 单一 **Vertex BD licence**（木/冷弯薄壁钢结构 BIM，自动出图+桁架+料单+加工数据，Vertex Sync 云） | vertexcad.com/bd |
| topsolid | **TopSolid'Design / 'Cam / 'Wood / 'Steel / 'Mold / 'Cut** 六条产品线 | topsolid.com/en/products |

### 链接复验口径

- Windows curl 走 schannel，遇不发 `close_notify` 的服务器报
  `curl: (56) schannel: server closed abruptly` 并返回 **000**。
  **TLS 其实已握手成功**（`%{time_appconnect}` 有值，约 0.46s），页面正常。
  已知受影响：`www.solidworks.com`、`www.magicad.com`。**不要据 000 改 URL。**
- 全站 393 条：300×200 / 83×403（autodesk 47、hexagon 11 等反爬）/ 2×202 / 8×000，
  8 条 000 复核后 **0 条死链**。


## 证据归档补齐（L4 台账带出的 9 条）

这 9 个的数据此前没查出错误，缺的只是"取证结论没落到事实库"。以下为逐条核实后归档。

### AutoCAD LT（Autodesk，订阅）

- 原生 **DWG**，读 DXF 与 DWT 模板；输入侧可挂 **PDF / DWF(DWFx) 作底图**；
  输出 DWG / DXF / DWT，另有 PDF 与 PNG / JPG 栅格。
- **AutoLISP 在 LT 上是支持的**（LSP / FAS / VLX）。这点极易写错——
  老资料说"LT 无 AutoLISP"，现在不成立。
- 与完整 AutoCAD 的差距在：**3D 功能、第三方连接、开发工具、七个专用工具集**，
  不是"没有自动化"。
- 订阅含当前版 + 前三个版本；可装多机但**同时只能一台激活**；
  含 AutoCAD Web 与移动版（iOS / Android / Windows）。

### MCAD / MECHCAD（MET，泰国）

- 同一家：Mechatronics Designed Co. Ltd.（MET），泰国团队，LINE / 电话支持。
- **MCAD**：单版本 2D 制图 + 原生 DWG/DXF；内置**真实形状套料、G-code 导出、
  激光/线切割、齿轮生成器**——这几项是它相对通用 2D 软件的差异点。
  授权：桌面**永久 THB 15,000**，网页版 THB 690/月 或 6,900/年（含 7% VAT）。
- **MECHCAD**：三版本 **Standard / Expert / Premium**，30 天**全功能 Premium 试用**。
  曲面建模与钣金 **Expert 起**；CAM **仅 Premium**。
  直读 **SolidWorks (.SLDPRT/.SLDASM，无需装 SolidWorks)、Alibre (.AD_PRT)、
  Siemens NX (.prt)**，且 SolidWorks / Alibre 导入保留可编辑草图与特征树。
  钣金可出 **Flat DXF**。

### RVT Convert（英国，免费在线）

- 只做一件事：把 **.rvt / .rfa / .rte / .rft** 降到**一个固定的旧版本**（当前 2023），
  单文件上限 **2 GB**。页头写 "Downgrade Revit files to 2023"。
- **不是跨平台转换器**：不读 IFC / DWG / STEP，也不产出这些。
- 因此 FAQ 里"为什么只降到一个固定版本"是产品定义，不是缺陷。

### 3D House Planner（巴西，免费 Web）

- 浏览器端住宅/公寓设计，**项目存浏览器本地**（autosave + 崩溃恢复），
  无账号、无上传、无云库。
- **IFC4 带属性集双向**；可出面积/体积/造价清单与模型检查（重叠、缺失宿主、空楼层），
  清单下 **CSV**。
- 导入 IFC / DXF / GLB / glTF / OBJ / STL / PNG / JPG / JSON；
  导出 IFC / DXF / SVG / OBJ / GLB / glTF / STL / PNG / CSV / JSON。
- 最多 **50 层**；免费，接受捐赠。

### DXF Medic（Madegrain，Freemium）

- 浏览器端 **DXF / SVG 体检与修复**：轮廓缺口、重复顶点、退化几何、自交（仅报告）；
  可设闭合容差，圆与圆弧修完仍是曲线。
- **只吃文本 DXF（R12 / 2000 / 2007）与 SVG，不读 DWG**；
  不重绘、不套料、不生成 G-code。
- 免费：诊断不限文件、导出 ≤ 5 个零件；超过需 **€9 买断 v1**（非订阅，离线 key）。
- 文件不上传，处理在本地，可离线。

### FabRapid 3D（免费，纯浏览器）

- 浏览器内 3D 格式转换 / 压缩 / 查看，**71 种输入、23 种输出、1608 个转换组合**；
  源格式自动识别，无需下拉选择。
- **文件不上传**，在当前浏览器会话内处理。
- 我们的数组只列常见项，是节选不是全集——FAQ 里不要写成"仅支持这些"。

### OpenSCAD（开源，免费）

- 脚本式实体建模，用自己的 **CSG 语言（.scad）**，没有 GUI 草图。
- 导入 **DXF / SVG / STL / OFF / AMF / 3MF**；导出 **STL / OFF / AMF / 3MF /
  DXF / SVG / CSG / PNG / PDF**。
- **不读 STEP / IGES**——这是它和参数化 CAD 的分界线。

### 3DEXPERIENCE（达索，订阅）

- 是**平台**不是单一 CAD：按"角色"订阅，内含 SOLIDWORKS Connected、CATIA 等应用。
- 原生 **3DXML**；吃 **JT / STEP / IGES / DWG**；出 STEP / IGES / DWG / PDF / JT / 3DXML / STL。
- 因此它的 `pricing_type` 与"套餐"要按角色写，不能按传统版本档位写。

### Vectorworks（Nemetschek，订阅/永久）

- Nemetschek 旗下（美国 Columbia, Maryland）；原生 **.vwx**。
- **IFC 导入导出**（含属性与分类），可直接读 **RVT / SKP / Rhino 3DM**。
- 导出面很宽：DWG / DXF / IFC / C4D / KML / 3D PDF / SVG / FBX / USD / VGX 等。

### Adobe Substance 3D Painter（订阅）

- 工程文件 **.spp**；导入网格 **FBX / OBJ / glTF / USD**（含 DAE）。
- 导出贴图 **PNG / TIFF / EXR / TGA / JPEG / PSD**，网格 **FBX / OBJ / glTF / USD**。
- 定位是**贴图/材质绘制**，不是建模工具——不要写建模能力。
