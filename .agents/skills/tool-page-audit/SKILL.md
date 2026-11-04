---
name: tool-page-audit
description: 对 cadguide.tools 的工具详情页（src/lib/data/c1..c7.ts）做「批次化事实核查 + 修复」。当用户要求核查/纠错/更新工具页信息、检查张冠李戴或前后矛盾、批量清理写死价格/版本/试用天数、核对官方链接时使用。每批 10 个，按数据文件原顺序推进。
---

> **【最高优先级唯一标准声明（2026-11-04 用户钦定：纯目录聚合定位，零自撰内容）】**
> **第一性原则**：Directory 本质是一个纯聚合目录，每个 Tool 的信息都不是自己写的，100% 来自软件官网和权威第三方（测评站点、评分站点、搜索结果排名靠前的目录站点或其他高排名搜索结果）。静态信息直接写死；隔一段时间会变的信息或不同国家不一样的价格，只能直链官方（软件官网及权威第三方评分/目录站）。
> 所有 `/tools/[slug]` 页面必须严格遵守根目录下的 [`DIRECTORY_TOOL_STANDARD.md`](../../../DIRECTORY_TOOL_STANDARD.md) 与样板页 [`/tools/autocad`](https://cadguide.tools/tools/autocad) 标准：
> 1. **最顶部标签行**：尽量多链接本站其他文章、聚合页（分类 `/tools?category=...`、榜单 `/best/...`、授权 `/pricing/...`、全平台 `/platforms/...`、角色 `/for/...`、行业 `/sectors/...`、格式 `/file-formats/...`、替代品 `/alternatives/...` 及 `related_links` 工具箱文章）。
> 2. **严禁本站自评打分**：全站取消 `Expert Score` / `Editor Score` 本站自评；顶部标题下方与底部 `CADGuide Verdict` 统一展示第三方权威评分网站（G2、Capterra、TrustRadius、Gartner Peer Insights、GetApp 等）的分值、评论数、**分值日期 (`verified_date`)** 并直链到对应评分网站（有 5 个显示 5 个，有 3 个显示 3 个）。
> 3. **文字描述 (`description`)**：直接从目标软件官网提取最权威、最明显的介绍。
> 4. **井号标签 (`#core_features`)**：选取该产品最核心、最广为人知的标志性特征，并关联站内特性/格式内链。
> 5. **价格部分 (`pricing_tiers`)**：每个套餐显示大概内容，具体价格一律直链官网 (`pricing_url`)。
> 6. **FAQ (`faqs`)**：优先直接采用目标官网的官方 FAQ 并附官网链接，不要自己编造。
> 7. **功能、规格与优缺点 (`detailed_features`, `tech_specs`, `pros`, `cons`)**：力求准确完善，`pros`/`cons` 写出 5~6 条具体完整的工程优缺点（参考主流评测与 AI 调研），禁止削成两三个词的短语。

# 工具页事实核查（批次化）

## 为什么不靠「感觉准确」

工具页有 ~40 个字段，其中只有一部分能被机器证明（结构、自洽、链接、禁用字段）。
「这个产品到底有没有这个功能」必须逐个对厂商官方页核。所以本 skill 把工作拆成
**机器可证明的** 与 **必须人工取证的** 两层，两层都过才算合格。

---

## 一、质量分级（用这个描述进度，别用「差不多准了」）

| 级别 | 名称 | 判定条件 |
|---|---|---|
| L0 | 未核 | 没人看过 |
| L1 | 结构合规 | 能解析、必填字段齐、无 `version`/`free_trial_days`/`last_updated`、无写死货币数字 |
| L2 | 事实对齐 | 卖法（订阅/买断/免费/报价）、平台、在售状态、价格链接 4 项与官方一致 |
| L3 | 页内自洽 | L2 + 交叉字段无矛盾（pricing_type↔档位、platforms↔FAQ、格式数组↔FAQ、描述↔cons） |
| L4 | 字段实证 | L3 + 所有「专有名词 / 数字 / 唯一性」断言可溯源（泛化描述不强制） |

- **合格线 = L3**（可以对外说「信息准确」）
- **标杆 = L3 + 抽样 L4**（关键工具的关键字段做到 L4）
- **核心定位铁律（纯目录聚合，零自撰内容）**：Directory 是纯聚合目录，所有信息 100% 来自软件官网或权威第三方（测评站点、评分站点、搜索排名靠前的目录站点或高排名搜索结果），没有任何自己撰写或编辑主观判断的信息。静态信息直接写死，隔一段时间会变的信息或不同国家不一样的价格一律直链官方（含软件官网及权威评分/目录站）。

**标尺只有 0–4 五档，L4 是满级，没有 L5。** L4 判定的对象是「专有名词 / 数字 / 唯一性断言」，
泛化描述（「界面直观」「适合中小团队」）不强制；评分与 pros/cons 属编辑判断，不在 L4 覆盖范围内。
因此 L4 = **这套自定义标尺下的全项达标**，不等于「零错误」或「权威」，见第 28 行。

**当前进度（2026-11-03 完成）：`verify-batch --strict` c1–c7 全绿、`tsc` 通过、
无硬编码价格、无空 `features`、无缺格式 FAQ。L4 分级审计：**186 / 186 全部达 L4**。**

**数字从台账里数，不要凭印象报**：`node scratch/audit/l4-audit.js` 输出
`scratch/audit/l4-ledger.tsv`（file / slug / level / reasons / advisories）。
**改完规则要逆测试**（坑 58）——注入已知缺陷确认还能报错，再看全绿。

各批取证情况：
- #1–82（c1–c4）已取证；
- c5 **全部 61 个（#83–143）已完成厂商取证**：A 批 #83–110、B 批 #111–122、
  C 批 #123–143 以及补抓的 A 批残留 12 个（`ntop` / `magics` / `ansys-mechanical` /
  `msc-nastran` / `altair-hyperworks` / `topsolid` / `visi` / `kisssoft` / `featurecam` /
  `autoform` / `moldflow` / `moldex3d`）；
- c6 **全部 16 个（#144–159）**（EDA），另做第二轮深挖：修掉「导出当导入」
  （Altium IPC-2581）、为消警硬塞的 DWG、被当成基础功能的独立授权分析引擎；
- c7 **全部 27 个（#160–186）**：切片器 5、渲染器 7、DCC 5、测绘与垂直 10，
  41 条告警与 18 处 FAQ 模板残句清零；
- 收尾轮：393 条外链复验（0 死链）、SigmaTEK 更名与范围越界、3 个退化套餐；
- 终轮：5 个缺失的格式 FAQ 补齐（autocad-lt / mcad / mechcad / rvt-convert /
  3d-house-planner），9 个工具的取证结论落进 `vendor-facts.md`。

**已知非缺陷状态**（不要再当 bug 追）：
- `languages` 空 147/186 —— 厂商未公布，前端 `tool.languages?.length > 0` 才渲染。
- `tech_specs` 含 "Not published by the vendor" —— 诚实声明。
- `description` 含年份 4 处（corelcad / geomagic-design-x / archicad / eagle）——
  停售或收购日期，历史事实锚点。
- `pricing_type` 表达不了「有免费版 + 也有订阅」（Solid Edge）——记 advisory。
- pros / cons / score / expert_verdict 属编辑判断，不在 L4 强制范围。

**先不 push，下班前统一推。** 当前 11 个本地提交待推。




---

## 二、每批执行流程（默认 10 个）

```bash
# 0) 选批：按 c1→c7 原数组顺序，取 10 个 slug
node -e "const s=require('fs').readFileSync('src/lib/data/c1.ts','utf8');const t=eval(s.slice(s.indexOf('[',s.indexOf('export const')),s.lastIndexOf('];')+1));console.log(t.map(x=>x.slug).join(','))"

# 1) 机器预检（先看结构层有没有硬伤）
node .workbuddy/skills/tool-page-audit/scripts/verify-batch.js --file src/lib/data/c1.ts --slugs <列表>

# 2) 人工取证：每个工具对官方页回答「四问」（见第三节）
# 3) 修数据（只改问题字段，不整块重序列化）
# 4) 机器验证
node .workbuddy/skills/tool-page-audit/scripts/verify-batch.js --file src/lib/data/c1.ts --slugs <列表> --strict
npx tsc --noEmit
node scratch/audit/scan-consistency.js && node scratch/audit/scan-deep.js && node scratch/audit/scan-facts.js

# 5) 出批次报告（references/report-template.md）
# 6) 追加 .workbuddy/memory/YYYY-MM-DD.md
```

---

## 三、四问（每个工具必答，答案要带 URL + 原文片段）

1. **它是什么** —— 品类、厂商、是否同名不同物 / 同一物两个页面。
2. **卖法** —— 订阅 / 买断 / 免费 / 报价；有几档、档名是什么。
3. **平台** —— 官方明确支持哪些系统（注意「另一个独立产品」不算，如 progeCAD 的 iCADMac）。
4. **还在不在卖** —— 停售 / 改名 / 被收购 / 换域名。

四问里任何一项与数据不符 → 记为严重，必修。

---

## 三之一、全站筛选器与聚合页强依赖的 9 个结构化字段（最高优先级，错一个即误导用户筛选）

工具页的数据不只是给人读的，更是全站交互式筛选器（`/tools`）、选型向导（`/matchmaker`）、对比问答（`/compare`）以及数百个聚合榜单页（`/file-formats/*`、`/convert/*`、`/platforms/*`、`/free/*`、`/best/feature/*`、`/sectors/*`、`/for/*`）的**唯一计算源**。逐个核查官网时，必须优先确保以下 9 项与厂商现实严格一致：

1. **`pricing_type`（受控枚举）**：
   - 直接决定 `/tools` 左侧 Pricing Model 筛选器、`/free/*`、`/open-source` 及 Matchmaker 免费筛选。
   - 若有永久免费层（哪怕是受限的非商用 Maker/Freeware 版，如 SolidCAM Maker、DipTrace Freeware）必须标 `Freemium`；若已取消买断改为纯订阅（如 Archicad 2026+），严禁残留 `Perpetual`。
2. **`quote_only` 与 `starting_price`**：
   - 决定 `/tools` 价格排序、`/compare` 对比表是否显示 `Custom Quote`、详情页按钮显示 `Request a Quote` 还是 `Official Live Pricing`，以及 `/best/*` 预算阈值计算。凡官网不公开标价、需联系销售/代理商报价的，必须设 `quote_only: true`。
3. **`platforms`（原生运行系统）**：
   - 直接驱动 `/tools` 的 OS 筛选器、`/platforms/[slug]` 聚合页与 Matchmaker 平台打分。
   - 只填该产品**本体原生支持**的系统（Windows / macOS / Linux / Web / iOS / Android）。严禁把同厂另一个独立软件（如 iCADMac）或虚拟机运行算进 `platforms`。
4. **`file_formats_in` 与 `file_formats_out`（严格区分 Read 与 Write）**：
   - 直接驱动 `/file-formats/[slug]`（Reads / Writes / Both 三栏）和 `/convert/[pair]` 转换推荐页。
   - **严禁把导入格式对称复制到导出**（如 CAM/查看器/仿真软件往往能读 STEP/IGES，但只导出刀路/报告/图片）；宿主软件的能力（如 Revit 的 RVT/IFC）严禁算在插件（如 Dynamo/MagiCAD/SolidCAM）头上。
5. **`tech_specs.engine`（几何内核 / 求解引擎）**：
   - 直接生成 `/tools` 左侧 **CAD Kernel 筛选器**的下拉选项！
   - 必须填写真实、规范的内核名称（如 `Parasolid`、`ACIS`、`Open CASCADE`、`Graebert ARES`、`Overdrive` 等）或 `Not published by the vendor`，严禁自造营销词，否则会污染整个目录的内核筛选栏。
6. **`features`、`core_features`、`detailed_features` 及正文关键词（防跨品类榜单串台）**：
   - `/best/feature/[slug]`（如 `integrated-cam`、`sheet-metal`、`simulation-fea`、`parametric-modeling`、`rendering`）除了读 `features` 数组，还会**全文匹配** `short_desc`、`description`、`core_features`、`detailed_features` 里的关键词（如 `"toolpath"`、`"cam"`、`"k-factor"`、`"fea"`）。
   - **绝对禁止跨品类残留模板词**（例如结构软件里出现 `"toolpath"` 会导致它被抓进 CNC 机床 CAM 排行榜）。
7. **`industries` 与 `user_scales`**：
   - 直接驱动 `/tools` 的 Industry / User Scale 筛选器，以及 `/sectors/[slug]`、`/for/[slug]` 页面收录与 Matchmaker 行业匹配度。必须贴合该软件的真实目标客群。
8. **`discontinued`（停售标记）**：
   - 停售软件（如 CorelCAD、Autodesk EAGLE）必须设 `discontinued: true`，否则 `rankToolsForCategory()` 会把死软件排进 `/best/*` 年度推荐榜误导用户下载。
9. **`external_ratings`**：
   - 决定 `/best/*` 排行榜在同分情况下的先后排序权重，不得编造虚假评论数。

---

## 三之二、L4 的可验收标准（别按「每条都核」理解）

全量逐条核不现实（186 工具 × 12 条 ≈ 2000+ 断言，厂商页多半只给营销话术）。
**L4 = 只核「可证伪的具体断言」**：

| 必须溯源（否则降级/删除） | 不强制溯源（允许保留） |
|---|---|
| 专有名词：`Propagate`、`BIMify`、`EasyArch`、`iCADLib`、`Floating Windows` | "2D drawing tools" |
| 数字：语言数、格式数、档位数、Keys 数量 | "annotation and dimensioning" |
| 唯一性说法：`only`、`first`、`natively on X` | "layer and block management" |
| 引擎 / 内核 / 渲染器名称 | "cloud collaboration" |
| 格式清单里的每一项 | 泛化的 pros/cons |

操作方式：每个工具挑 3–6 条「一旦写错就是硬伤」的断言去证，其余标为泛化描述。
证不了的，要么删专有名词改成泛化，要么写 `Not published by the vendor`。

**L4 缺口登记表**（每批报告附上，避免假装达标）：

| 工具 | 字段 | 状态 | 说明 |
|---|---|---|---|
| bricscad | tech_specs.engine | 未证实 | "ACIS" 是业界通说，厂商页未明写 |



## 四、交叉七查（机器已覆盖大部分，人工复核例外）

1. `pricing_type` ↔ 档位 `period`（Perpetual 不应出现 subscription）
2. `platforms` ↔ OS 那条 FAQ
3. `file_formats_in/out` ↔ 格式那条 FAQ
4. `description` ↔ `cons`（说「lacks X」时，别处不能又说支持 X）
5. `pros` ↔ `cons` ↔ `expert_verdict`
6. 档位 features ↔ 官方档位表（警惕 `All Pro features` 这类从别家抄来的串味）
7. FAQ 之间互相引用（alternatives 里的卖法描述要和那个工具的页面一致）

---

## 五、硬规则（违反即返工）

- **不写死**：价格数字、货币符号、版本号、试用天数、年份（`20xx`）、折扣、套餐数量。
- **价格只允许**：`Official Store` / `Official Pricing` / `Free` / `Open Source` / `Contact Sales` / `Custom Quote`。
- **价格链接必须是官方定价/商店页**，且优先用最终落地 URL（避免软跳转、geo 跳转）。
- **无据不写**：厂商没公开的技术规格，写 `Not published by the vendor`，不要编。
- **模板串味是重罪**：同一句话出现在 3 个以上工具里，必须拆（除非是客观事实如 `Single-threaded`）。
- **不 `git add -A`**；推送需用户明确指令。
- **本地不裸跑 `next build`**，只能 `npm run build:local`。

---

## 六、验收 DoD（全勾才算这批完成）

- [ ] `verify-batch.js --strict` → ERROR=0 WARN=0
- [ ] `npx tsc --noEmit` → 0 error
- [ ] `scan-consistency` P0/P1/P2 = 0/0/0
- [ ] `scan-deep` P0/P1 = 0（P2 需逐条确认是良性的）
- [ ] `scan-facts` 无新增类别
- [ ] 每个工具的四问都有官方 URL 记录
- [ ] 价格链接实测可访问（curl 带 UA + 无 UA 双跑，403 需用抓取复核）
- [ ] 批次报告 + memory 已写

---

## 七、已知坑

1. **反爬 403 ≠ 死链**：Autodesk / QCAD 对 curl 返回 403，但页面正常。必须用抓取再确认。
2. **软跳转**：`gstarcad.net/Eshop` → `/buy/`；`qcad.org/en/online-shop` → `/prestashop`。
   定价链接尽量写最终 URL。
3. **geo 跳转**：同一条 URL 在不同 IP 可能落到「Find a Reseller」页。定价链接要选内容稳定的路径。
4. **TS 数据文件不是 JSON**：用 `eval(slice(...))` 解析数组，不要 `JSON.parse`。
5. **CRLF**：Git blob 是 LF，工作区是 CRLF。批量脚本写回时要 `.replace(/\n/g,'\r\n')`。
6. **Edit 串改**：`"period": "perpetual / subscription"` 这类字符串多处重复，必须带上下文（如 engine 行）定位。
7. **改 FAQ 会打破数组一致性**：补全 FAQ 里的格式/平台列表后，记得同步 `file_formats_*` / `platforms`。
8. **品类模板句（最贵的坑）**：全站有 8 句模板顶掉了 60+ 个工具的格式 FAQ，同一句话套在整个品类上——
   `"X works with standard BIM interchange formats including IFC, RVT, and DWG."`
   一句话把品类里所有工具的格式清单拉平，必然有工具被写上自己并不支持的格式（实测 Tekla 无原生 RVT 导入，
   SolveSpace / Maya 被写上 STEP / IGES / Parasolid）。校验器已加 `E11-faq-template` 点名。
   **凡是「A 支持 B、C、D」这种三项并列且跨厂商雷同的句子，先当成模板怀疑，再逐个取证。**
9. **模板值的三种合法归宿**：① 能查到官方说法 → 写具体值；② 查不到 → `"Not published by the vendor"`；
   ③ 产品已停售 → `"Not for Sale"`。不要为了填满而编，也不要留 `"Basic"` / `"N/A"` / `"Cloud"` 这种空壳值。
10. **停滞判断要区分「会漂」和「不会漂」**：停产产品的停售日/最终版本/停止支持日、公司被收购的时间，
    都是冻结历史，写死年份反而更准确；只有「当前价格 / 当前最新版」才会过时。校验器 E4 已按此区分。
11. **浏览器产品的平台字段**：Onshape / Glovius 这类 `platforms` 写 `["Web", ...]` 是对的，
    FAQ 里说「在 Windows/macOS/Linux 的浏览器里都能跑」也不矛盾，不要为了对齐而硬塞桌面 OS。
12. **`languages` 是虚报率最高的字段（65% 出错）**：45 个工具里 17 个有语言清单，其中 11 个是错的。
    三种典型错法：
    - **跨厂商照抄**：`ptc-creo` 的 13 种与 `autodesk-inventor` 的 13 种**逐项且同序**相同——
      Creo 从来不本地化捷克语/波兰语，那两项是从 Inventor 抄过来的。凡是两个不同厂商的数组
     **长度与顺序完全一致**，直接当复制品怀疑。
    - **凭印象增减**：SketchUp 写了荷兰语（官方发的是瑞典语）、Rhino 多写了葡萄牙语、
      CATIA 多写了西班牙语和巴葡。商业厂商的语言表都能在「帮助/语言包下载页」查到，
      查得到就照抄，查不到就别写。
    - **开源项目照抄半截**：LibreCAD 写了仓库里根本不存在的马来语/保加利亚语/越南语，
      同时漏掉 14 种真实存在的；Blender 只写了 17 种，实际有 50 个 `.po`。
13. **开源项目的语言清单要从仓库取，不要从营销页取**：
    `github.com/LibreCAD/LibreCAD/librecad/ts`（68 个 `.ts`，去掉 17 个西班牙语地区变体 = 42）、
    `blender/blender/locale/po`（49 个 `.po` + 源语言英文）。
    FreeCAD 更省事——官方给出 `FreeCADGui.supportedLocales()` 的 36 项，是代码级事实。
    这类清单会随版本变（Blender 每版都清理零活跃语种），所以**只写「当前仓库有什么」，
    并在卡片脚注保留「community-maintained, coverage varies」的免责句**。
14. **长清单要在 UI 收敛，不要砍数据**：LibreCAD 42 项、Blender 50 项铺开会撑破卡片。
    已在 `tool-detail-client.tsx` 加折叠（先显示 10 个 + `+N more`），
    **数据保持完整、渲染负责收敛**——反过来（为好看而截断数据）就是造假。
15. **`alternatives` FAQ 是模板生成的，最容易误标许可（c4 实测 5 处）**。
    "The closest alternatives to X are ... while Y (free and open-source) is another top-rated option"
    这句话对每个工具的竞品套一遍，就把 **DWG TrueView 写成了「free and open-source」**——
    它是 Autodesk 的免费**专有**软件，不是开源。同类短语还有「offered on a Subscription license」，
    也可能与竞品的真实卖法不符。**校验器查不出这个**（不在 E1–E12 覆盖范围），
    每批要人工 grep 一遍 `open-source` / `open source`，逐个对 `pricing_type` 与厂商许可页。
16. **「查看器 / 平台」的格式能力 ≠ 同厂「建模器」的格式能力**（c4 最贵的坑）。
    - `solid-edge-viewer` 官方只支持 Solid Edge 原生（asm/par/psm/pwd/dft）+ DXF/DWG，
      只读、只能存图像快照。**STEP/IGES/JT/IFC 一个都没有**；而付费 Solid Edge 建模版
      有完整矩阵，Solid Edge 安装包里那个免费 2D Drafting 模式还能看 STEP/IGES ——
      三者必须分开，拿错一个就是编造。
    - `dwg-trueview` 只做三件事：看、跨版本转换 DWG、发布 DWF/PDF/图片。不能编辑几何。
    - `bluebeam-revu` **只能打开 PDF**，DWG/RVT/Office 都要先经 Stapler 转成 PDF；
      IFC 仅是 3D PDF 的输入素材，不是 BIM 模型导入。
    - `solibri` 读模型出报告（BCF/PDF/RTF/Excel），**不写回模型格式**；
      且官方文档对「能否导出 IFC」自相矛盾（格式页只列 opened/imported，
      另一篇写 import/export，buildingSMART 认证只写 import capable）——
      这种要标注存疑，不能写成能力。
17. **官方文档自相矛盾时，写「存疑」而不是选一个**。Solibri 的 IFC 导出就是例子。
    判据优先级：产品级格式表 > 帮助中心单篇教程 > 营销页。三条冲突时如实呈现分歧。
18. **品类模板句会「串台」，E11 只查句式、不查品类是否匹配**（c5 新坑）。
    `scia-engineer`（结构 FEA）和 `esprit`（CAM）都被写成
    "works with standard **2D CAD** interchange formats including DWG, DXF, and PDF"。
    E11 能抓到模板句，但**抓不到「2D CAD 这个品类词根本不属于这个产品」**。
    重写时必须按产品重新取证，不能只把品类词从 2D CAD 换成 CAE/CAM 就交差。
19. **E10 域名告警里混着「真错链」，不能一律加白名单**（c5 最该记住的一条）。
    - 已核实的母公司 / 继任关系：`worknc.com` / `surfcam.com` / `alphacam.com` /
      `radan.com` / `espritcam.com` → `hexagon.com`（Hexagon 收购 Vero、DP Technology）；
      `sigmanest.com` → `sigmateksystems.com`（公司更名 SigmaTEK，隶属 Sandvik）。
      这些是**正确的官方链路**，不是死链。
    - 但 `scia-engineer` 的 `pricing_url` 也指向 `hexagon.com` 是**真错**：SCIA 属
      **Nemetschek Group / ALLPLAN**，与 Hexagon 无关，且自有 webshop 是订阅制。
    - 最优解：把已核实的 **(产品域 → 母公司域) 成对登记**进 `CORPORATE_DOMAIN_PAIRS`，
      规则仍对未登记的组合继续报警。不要为了消警告把 E10 整体放宽，也不要把真错链
      当成「母公司关系」放过去。
20. **复合格式名会制造 E7 假阳性，改规则而不是削数据**。
    `PDF Analysis Reports`、`Stress Reports (PDF/Excel)`、`PDF Calculation Notes`、
    `RVT (Direct Link)` 这类「输出内容 + 格式」是**准确的描述**，但 token 抽取器抽出
    `PDF` / `RVT` 后数组里没有裸 token 就报警。正确做法是让 E7 把复合名里出现的
    token 一并计入 `known`；**不要为了绿灯把 `PDF Analysis Reports` 削成 `PDF`**，
    那反而丢掉了「这是报告、不是可编辑模型」的关键信息。
21. **CAM 品类的「导入清单长、导出清单极短」，且官方模板句不能当导出证据**。
    - ESPRIT EDGE 的 STEP 帮助页写 "Options for importing and exporting STEP files"，
      但全文**只有 Import Options**；同样的模板句也出现在 CATIA / SOLIDWORKS /
      Inventor 页，那些页同样没有 Export Options。判定导出只认三样：
      `Export Options` 段、明确的 export 命令、`Save As` 类型列表。
    - 对称性不能假设：SURFCAM 的 STEP / AlphaCAM 的 STEP 与 DWG **只导入**；
      WorkNC 导出只有 IGES/DWG/DXF；GibbsCAM 导出只有 IGES/DXF；
      SolidCAM / Edgecam / CAMWorks 官方**根本没有独立 in/out 矩阵**（前者是插件，
      能力属于宿主）。把导入能力顺手写成导出，是本批最大的批量错误来源。
    - RADAN / Lantek / SigmaNEST 这类钣金套料软件的真实输出是
      **NC code + 报表 + DXF/DWG**，不是 STEP/IGES 模型。别拿同厂 DESIGNER、
      REcreate、CAD Import Plus 选件的文档给本体登记能力。
22. **免费 / 浏览器工具的「完全本地、零云端」断言最容易翻车**。
    `engineering-on-web` 原写「entirely client-side」「zero cloud data retention」
    「100% free」「三个工具」「STL 可导入」，官方实际是**四个工具**（含 PCB）、
    Analysis 计算**在服务器**、文档有**匿名服务器副本**、AI copilot **走云端**
    （官方警告勿发机密数据）、首次**缓存约 50 MB 内核**、CAD 侧 **"STL is export only"**、
    PDF 仅 CAD 打印式导出。这类自述型产品必须逐条对官方 FAQ / 隐私政策 / 格式指南，
    **不能沿用 description 里的营销话术**，也不能把「免费」写成官网没有的 "100% free"。
23. **机械清理后要查 `zeroGroupTools`**。`purge-df-*` 会把空 `detailed_features`
    整块删掉（c3 的 `3d-house-planner`、c5 的 `engineering-on-web` 都中招）。
    必须按官网能力重建分组，不能留空，也不能套通用分类名充数。
24. **`tier.features` 与 `tech_specs` 曾是校验盲区，机器全绿也会漏**（本批人工 grep 才抓到）。
    E3 只查 `tier.price`，E4 只查 `short_desc` / `description` / `expert_verdict` / `faqs`。
    结果 `pricing_tiers.features` 里塞进了 "save €500 vs annual renewals"、
    "€4,000 per workstation"，`tech_specs.gpu_optimization` 里塞进了 "(2024 R1+)"，
    `verify-batch --strict` 照样 `ERROR=0 WARN=0`。
    已补规则：**`tier.features` 出现硬价格 = ERROR**（`E3-hard-price-feature`），
    **tech_specs 标量值出现年份 = WARN**（`*_url`、数组型 `standards`、
    `FROZEN_EVENT` 冻结史实均豁免）。
    **每批收尾仍要人工 grep 三样**：`[$€£¥]`、`\b(19|20)\d{2}\b`、`open-source`。
    别只信 verify 的输出——它检查的是「已写进规则的字段」。
25. **CAE 尾巴句是第二类「模板指纹」，且比品类模板句更隐蔽**（c5 B/C 批）。
    `"Direct CAD associative interfaces and neutral solver/exchange formats are
    supported depending on your licensed modules."` 跟在数组清单后面，看似留了余地，
    实则对求解器/前处理器/平台类产品**全是假话**：Fluent 根本不直接读 CAD，
    OpenFOAM 没有 "licensed modules"，Nastran 连 CAD 导入器都没有。
    c5 曾有 35 处、c7 还有 22 处。已纳入 E11（`CAE_TAIL`）。
    **判定口径**：这类句子本身不报错，但它标记的 FAQ 一定没逐条取证过——见到它就当
    「未核」处理，别只看 verify 是否变绿。
26. **「数组清单复述句」不能靠正则判定**（本轮踩过的过度设计）。
    我一度想用 `imports A, B, C and exports D, E` 抓机械复述，结果把
    `caxa-cad` / `dds-cad` / `engineering-on-web` / `nestforge` 这些**人写的、准确的**
    FAQ 全判成模板。教训：规则只抓**可判定的模板指纹**（固定句子），不做语言风格判断。
    已把该规则删掉，只保留 `BOILER` + `CAE_TAIL` 两条。**规则加得越"聪明"，误报越多。**
27. **产品改名不要动 `slug` / `name`，把新名写进描述层**（2026 三次收购/分拆的通用解法）。
    - `CAESAR II` → **Octave Aspect Pipe Stress**（Formerly CAESAR II），归 Octave；
    - `PV Elite` → **Octave Aspect Pressure Vessel**（Formerly PV Elite），归 Octave；
    - `MSC Nastran / Adams / Patran` → 归 **Cadence**（2026-02-23 完成收购 Hexagon D&E），
      产品名仍是 MSC 品牌，文档暂留 Hexagon Nexus；
    - `Aspen HYSYS` → 保留 AspenTech 品牌，注 "an Emerson company"（2025 起全资子公司），
      **不要写成「2025 年被 Emerson 收购」**；
    - `PAM-STAMP` → **Keysight CAE**（原 ESI Group），正式名 Sheet Metal Forming。
    为什么不改 slug/name：官网自己保留 "Formerly …"，用户搜索和全站 186 页的
    alternatives 交叉引用都基于通用名，改 slug 会断链、毁 SEO。
    正确做法：**slug/name 不动，short_desc / description / verdict / FAQ / tier 写清现名与现归属。**
28. **母公司域名迁移要区分「过渡期仍有效」与「真死链」**（E10 的延伸）。
    - `hexagon.com/products/caesar-ii`、`/pv-elite` **仍可访问**（返回 Octave 内容），
      但已不是正确品牌入口 → 换成 `octave.com` 对应产品页；
    - `octave.com` **没有公开询价页**（`/contact` `/contact-us` `/company/contact` 全 404，
      只有 `/support` 200）→ `pricing_url` 直接指向**官方产品页本身**，并在价格 FAQ 里
      说明「不公开价目、直链官方」，**不要猜一个 contact 路径充数**（会造死链）；
    - `cadence.com` 产品页与 `/company/contact-us.html` 均 200，可成对使用；
    - `hexagon.com` 对 curl 返回 403 是**反爬**，不代表页面不存在；
      判定链接是否有效要带浏览器 UA 复验，别无脑把 403 当死链删掉。
29. **「导入对称成导出」是 CAE/CAM 最高频的方向性错误，本轮一次抓到 6 类**。
    - `kisssoft` 的 STEP / Parasolid / IGES / DXF **全是只出不进**（官方 Exchange Formats 页只有导出）；
    - `featurecam` 官方导出只有 DXF / DWG / IGES / STL，**没有 STEP**；
    - `ntop` 的 **IGES 只出不进**（官方导入表无 IGES）；
    - `ansys-mechanical` **不导出几何**（STEP/IGES 属 SpaceClaim / DesignModeler）；
    - `magics` 的 IGES / Parasolid / CATPart / SLDPRT 是**可选模块、仅导入**；
    - `msc-nastran` 是**纯求解器**，STEP/IGES/Parasolid/CATPart 是 Patran / MSC Apex 的能力。
    判定口径：看官方 **Export / Save As / Data Export** 段，不看营销页「can work with」；
    导入清单长、导出清单短是常态，**不能把导入清单抄成导出清单**。
30. **旧取证结论也会被新官方文档推翻，要允许「翻案」**。
    VISI 上一轮被判「没有官方记载的 CAD 写出器」，本轮官方手册与 2025.2 在线帮助
    明确写了 CATIA write、JT Open read **and write**、SAT read **and write**，
    以及 STEP/IGES/VDA/Parasolid 双向 + 3D PDF 导出。**结论要带来源和日期，重核时敢推翻。**
    同理，营销页「can work with …」不能当**否定**证据——要找手册 / 帮助中心 / 格式表。

31. **「EDA 互换格式」模板句是第三类指纹**。
    `works with standard EDA interchange formats including Gerber, IPC-2581, and ODB++`
    横跨 LTspice（纯 SPICE 仿真器）、Multisim（仿真器）、CircuitMaker（只出 Gerber /
    NC Drill / ODB++）、KiCad、EasyEDA 逐字重复。**仿真器根本不产出制造数据**，
    见到这句先假设全错，逐条重写。E11 的 `BOILER` 里本来就有 `EDA` 分支，
    所以这 10 条是被规则直接报出来的——**规则抓得到，但只有人工才知道该改成什么**。
32. **套餐名比格式更容易过期，且校验器完全不看**。
    Proteus 已从 Starter/Level 1-3/Platinum 改成 **Enterprise / Platinum / Custom**；
    EasyEDA 的付费层是**商业使用会员**而不是「Professional 版」——Pro 编辑器本身永久免费；
    CircuitMaker 从来没有「Pro 层」，也**从未要求项目必须公开**（2.0 起可开 5 个私有项目）。
    这类错误只能靠读官方定价页发现，机器绿色不代表套餐对。
33. **short_desc 截断会污染 FAQ**。生成器把 `short_desc` 拼进
    `What is X used for?` 的答案，于是 Xpedition 变成
    `…grow with you, from independent Xpedition is an EDA solution.`，
    TopSolid 变成 `…mechanical engineering, sheet metal  TopSolid is a CAE / CAM solution.`。
    **体检方法**：`short_desc` 长度 > 90 且不以 `.?!)]` 结尾即疑似截断，
    一条 node 脚本可全站扫完（本项目扫出 2 处：`xpedition`、`topsolid`）。
34. **`Not applicable` / `Single-threaded` / `Not published by the vendor` 是 E8 白名单**。
    `verify-batch.js` 的 `dupScan` 有 `GENERIC` 集合，这三个值是「事实相同」不算模板复用。
    所以给 EPLAN（无 DRC/autorouting/SPICE）、Allegro、Xpedition 之类写 `Not applicable`
    既诚实又不会触发「多工具共享同一串」告警——**别为了避开告警去编不同的假描述**。
35. **重定向不等于死链，但要跟到终点**。`eplan-software.com` → 301 → `eplan.com`；
    `orcad.com` → 301 → `cadence.com/.../orcad.html`。E10 比的是**注册域**，
    所以官方页与定价页都要写成跳转后的同域地址才能消警。

36. **「导出 → 导入」是方向性错误的镜像版，比「导入 → 导出」更隐蔽**。
    Altium 官方文档写得很清楚：IPC-2581 走 `File » Fabrication Outputs » IPC-2581`，
    产出 `.cvg`，**纯导出**，靠默认安装的 IPC2581 扩展。上一轮我却把它留在 `in` 数组里。
    判定口径：凡是出现在 **Fabrication Outputs / Export / Save As** 菜单里的，就是导出；
    `in` 只能放 Import Wizard / File » Import / Open 能读的东西。
    同理 Gerber、ODB++ 一般只出不进，不要因为「支持这个格式」就两边都写。
37. **DWG ≠ DXF**。DWG 是 Autodesk 原生二进制格式，Cadence Allegro / OrCAD、Siemens PADS
    都只吃 **DXF**，需要先转换。为了消掉 E7 告警而把 DWG 塞进数组，
    正是坑 26 说的反模式——正确做法是改 FAQ 措辞（"AutoCAD drawings have to be
    converted to DXF"），让规则和数据都成立。
38. **分析引擎要看清是不是单独授权**。HyperLynx（SI/PI/Thermal/EMC）、Sigrity、
    Celsius、Valor NPI 都是**独立许可**的模块，写进 PADS / Xpedition / Allegro / OrCAD
    的 `detailed_features` 时必须标注 "(HyperLynx)" "(Sigrity option)" 之类，
    否则等于把没买的功能算进基础能力。同理 Xpedition 的 "Mentor Graphics"
    是 2017 年就停用的品牌名，应写 Siemens EDA。
39. **`languages` 为空是对的，不要编**。EDA 厂商极少公布 UI 语言清单，
    前端 `tool.languages?.length > 0` 才渲染，缺失即整段隐藏 —— 这比填一串猜测安全。
    c6 只有 altium-designer 有实证清单（7 种），其余 15 个留空是正确状态。
40. **`industries` / `user_scales` 是受控词表，重复是正常的**。
    c6 的 industries 只有 27 个取值、user_scales 只有 8 个，`Electronics` 出现 11 次
    不代表模板化。**只有 prose 字段（description / FAQ / pros / cons）的逐字重复才是问题**。

41. **「What is X used for?」会被生成器拼成残句**。
    模板把 `core_features` 直接粘进句子，产出
    `…widely used across Maker, Education, Manufacturing for 400+ printer profiles
    out of the box, Tree, normal, and Cura Engine support generation, Marketplace for
    plugins…`。c7 有 **18/27** 中招，c1–c6 为 0。**体检正则**：
    `/widely (?:used|adopted) across .*? for (.+)$/` 且该段逗号 ≥ 2 个即为残句。
    这类问题机器规则抓不到（不是格式、不是价格），只能扫文本形态。
42. **渲染器 / 切片器的 out 是「影像」，不是 CAD**。
    KeyShot / Lumion / Enscape / Twinmotion / D5 / V-Ray / Corona 的输出是
    PNG/EXR/MP4/360 全景/独立查看器，**没有一家写 CAD 文件**；Cura 之类切片器
    的输出是 G-code / 3MF 工程 / UFP。看到渲染器 out 里有 DXF/DWG/STEP 就要怀疑。
43. **`in` 里混宿主软件名是类别错误**。Enscape 根本没有导入器（它渲染宿主里的活模型），
    却把 `Revit / SketchUp / Rhino` 写进 `in`。正确写法是**宿主文件格式**：
    `RVT / SKP / 3DM / PLN / VWX`，并在 FAQ 里说明「无独立导入器」。
44. **对渲染器把 `gpu_optimization` 写成 `N/A` 是最坏答案**。GPU 就是渲染器的核心，
    等于把产品卖点抹掉。要写实际加速路径（OptiX / DX12 / Lumen / RTX），
    纯 CPU 的（Corona）要明确写「CPU-only，GPU 仅用于降噪」。
45. **`country` 是单值字段**。ZBrush 曾写成 `USA / Germany (Maxon)`——
    字段只能装一个国家，归属公司写进 description。
46. **`detailed_features` 要检查是不是爬来的营销小标题**。
    Maptek Vulcan 里是 `Mining software / Mining solutions / Mining cycle`
    和 `2500+ sites / 90 countries`；AVEVA Marine 是
    `Unit & Coordinate System Calibration / Windows Runtime Support`。
    判据：条目名不像功能、像官网导航或数字，就是爬的。
47. **垂直行业工具的「工程能力」常被跨产品抄袭**。
    pic2CAD 只读照片，却被写了 `Native DWG / DXF / STEP Import Pipeline`。
    越是小工具，越要核「它到底读什么」——读文件的种类决定了它属于哪条产线。
48. **curl 报 `000` 不等于死链，先看 `%{time_appconnect}`**。
    Windows 上 curl 走 schannel，遇到不发 `close_notify` 的服务器会直接
    `curl: (56) schannel: server closed abruptly (missing close_notify)` 并返回 000。
    判据：如果 `tls=0.46` 这种**握手时间有值**，说明 TLS 已经成功连上，
    只是收尾不规范；再用 WebFetch 取一次内容即可确认。全站 393 条里 8 条报 000，
    复核结果 **0 条真死链**。别因为 000 就改 URL。
49. **公司更名比套餐更名更狠，会连带整条 URL 迁移**。
    2026-10-12「SigmaNEST 公司」整体更名为 **SigmaTEK**（Sandvik Group 旗下），
    产品名仍叫 SigmaNEST，但 `sigmanest.com` 已 301 到 `sigmateksystems.com`。
    查法：`curl -w '%{url_effective}' -L`，落点换注册域就说明品牌变了，
    `official_url` 要改成**当前产品页**（这里是 `/en/sigmanest`），不是首页。
50. **品牌套件拆分会造成 scope 错误，比格式错误更难发现**。
    SigmaNEST 本体只做 2D/坡口型材切割、铣削、冲压；tube / beam / saw / press-brake
    分别是 **SigmaTUBE / SigmaBEAM / SigmaSAW / SigmaBEND** 独立产品。
    老条目把「tube cutting」写进 SigmaNEST 的 short_desc，事实是错的。
    判据：官网有 `/products` 或「Our different solutions」分栏时，
    逐个核「这个能力属于哪个 SKU」，别按行业关键词归并。
51. **退化套餐的三个指纹：`name` == `pricing_type`、`price` == "Official Store"、
    `features` == []**。这是生成器留下的占位符，不是真实档位。
    全站扫出 3 个（cypecad / vertex-bd / topsolid），一律按官方 edition 名重建：
    CYPECAD ADVANCED / EXPERT、Vertex BD licence、TopSolid'Design…'Cut。
    注意套餐名取自**官方 shop 页**，不是官网首页的行业分栏。
52. **「整批做过」不等于「这条达到 L4」，必须能逐条追溯**。
    这是本项目最容易自欺的一点：批次报告全绿，就顺手说「186 个都到 L4 了」。
    实际上 `verify-batch` 只覆盖规则集内；`vendor-facts.md` 才是取证归档，
    而它只覆盖 142/186。**打法**：`scratch/audit/l4-audit.js` 逐工具评级并输出
    `l4-ledger.tsv`（file / slug / level / reasons / advisories），
    数字从台账里数，不从记忆里报。
53. **评级器本身要先校准，否则它会把「正确」判成「错误」**。踩过四次：
    - `tech_specs.standards` 不能拿去比文件格式数组。它装的是规范号
      （STEP AP242 / B-Rep / IFC 4.3 / glTF 2.0），一次误判 162/186。
    - 浏览器型产品的「支持 Windows/macOS/Linux」是浏览器跨平台，不是原生多平台。
      `platforms` 含 Web 且句子讲到 browser 时要豁免。
    - 「桌面端跑 X，另有独立 App/云版支持 Y」是标准正确写法（ZWCAD、progeCAD 的
      iCADMac、ARES 的 Touch/Kudo、Rhino 的 iRhino、OpenSCAD 的 WASM 版、
      SOLIDWORKS 的 3DEXPERIENCE）。含 separate/companion/app/cloud/browser 的句子要跳过。
    - 「没有免费版」的否定句被当成「有免费版」，一次误伤 125 条。只认肯定句式。
    **教训：任何新规则先跑一遍，看到大面积告警就先怀疑规则，而不是先改数据。**
54. **`pricing_type` 是粗粒度枚举，装不下「有免费版 + 也有订阅」**。
    Solid Edge 就是：免费 2D Drafting + Community/Student Edition + 付费订阅，
    但枚举里只能填一个值。遇到这种记成 advisory，不判级、不改数据。
    `Freemium` 反过来说，FAQ 里写「没有免费版」就是**文案错**——
    BIMcollab（"ZOOM Free ... not time limited"）和 Twinmotion（营收低于官方阈值免费）
    都是这种，字段对、文案错。
55. **补丁元组漏参数会把 `undefined` 直接写进正文，而校验器抓不到**。
    `['c1','mcad','新文案']` 少写一个元素时，`to` 就是 `undefined`，
    替换后正文变成 `"undefined Drawings leave in the same two formats."`。
    JSON 完全合法、`verify-batch` 全绿、`tsc` 通过——只有人眼能看出来。
    **对策**：`l4-audit.js` 的 L1 加一条 prose 泄漏检查
    （`/\b(?:undefined|NaN|\[object Object\])\b/`），每次提交前跑一遍。
56. **`FORMAT_TOKEN` 会把英文单词 "step" 当成 STEP 格式**。
    写「with no converter step」会触发 `E7-formats: FAQ mentions formats not in arrays: STEP`。
    同理会误伤的普通词：`obj`、`sat`、`3ds`、`plt`。写文案时绕开这些词
    （改成「without needing a converter」）。
57. **版本年份不要写进 FAQ 正文**。`MCAD 2026`、`MECHCAD 2026`、`Revit 2023`
    全被 `E4-year` 抓到，而且它们**确实会漂**（RVT Convert 的目标版本会随厂商往上挪）。
    正确写法：「one fixed older release — the one the service currently targets」+ 直链官方。
    `FROZEN_EVENT` 里的 `up to Revit` / `and later` / `since` 只适用于真冻结史实。
58. **评分器收窄规则后必须做逆测试**。我为了消误报改了四轮规则，
    结果从 58 涨到 186——这时候最该怀疑的不是数据，是尺子。
    **做法**：往一条记录里注入已知缺陷（一个营销词 + 一个 `undefined`），
    跑一遍确认仍报 L0，再恢复。**尺子能报坏，它的"全绿"才有意义。**
59. **批量模式修复很快，但「改过」不等于「查深了」**。用 git 量化深度：
    对每个工具统计「被几个提交改动过」（比对相邻版本该 slug 的序列化结果）。
    实测：4 个零改动、91 个只改过 1 次、80 个 2 次、10 个 3 次、1 个 4 次。
    **「整批做过」这句话必须配这个分布才有意义。**
60. **单轮工具要抽样验证，不能假设够用**。做法：固定种子从单轮池里抽 10 个
    （`seed=20261103`，可复现），按 L4 四维重新对厂商页核。
    **实测命中率 2/7（能下结论的 7 个里错 2 个）**：
    - `glovius` 导出少了 ACIS / Parasolid / JT
    - `corona-renderer` 只写了 Solo / Premium，实际还有 **Collection**；
      且 Premium 的 features 是旧内容（Chaos Phoenix / Chaos Player 已不在定价页）
    另有 3 个因厂商页不公布格式表而**无法下结论**——记「未证实」，
    既不算错也不算通过。**别把「查不到」写成「没问题」。**
    结论：单轮工具的残留错误率约三成，91 个单轮工具值得补二轮，
    且优先补两类字段：**套餐列表**与**导出格式**（这两类最容易少写）。
61. **先按形状扫，再按页面读**。补二轮时最大的浪费是逐页读厂商站；
    更快的路径是先写个形状扫描器把嫌疑锁定，再只对嫌疑取证。
    实测三种形状，10 分钟扫完 186 个，比抽读快两个数量级：
    - **退化档**：`name` == `pricing_type` / `price` 是占位符 / `features` 为 `[]`
    - **元描述档**（新指纹）：`features` 全是「怎么报价」而不是「产品能干什么」。
      SCIA Engineer 与 ESPRIT 就是这样——档位里一条产品事实都没有，
      写的是「Sold as a subscription through the official SCIA webshop」。
      扫描式：命中 `/quoted|price|webshop|vendor page|editions, /` 比例 ≥50% 且总数 ≤3。
    - **模板残留**：同一句话跨 N 个工具逐字相同（见坑 63）。
62. **`"Official Store"` 是全站 230 处的统一写法，不是占位符 bug**。
    只有同时看到「`name` 是模块名（如 `iMachining`）+ `features` 只有 3 条口水话」才是退化档。
    看到非数字 `price` 就批量"修"，会一次改坏 230 条。
63. **模板文案里的「点击本页的按钮」是站内 UI 指代，不是厂商链接**。
    14 个工具共用 "click the Official Free Trial button on this page"，
    另 1 个共用 "Official Live Pricing button"。它们都对应 `trial_url` / `pricing_url`
    字段，文案却不给链接。改成 `[Official X trial page](trial_url)`，
    并写明「时长与资格由厂商设定」。
    **注意**：统一替换会顺手抹掉真事实——Onshape 的免费方案（非商用、文档公开）
    就这样被覆盖过，改完必须把「本来正确的少数」单独补回。
64. **同一段 boilerplate 的提问措辞不一样，按「问题前缀」改会漏**。
    `faqEdit('Is there a free version')` 改不到 Onshape 的
    "Does Onshape offer a free trial?"，也改不到 Chief Architect 的变体措辞。
    **做法**：按**答案内容**定位（`block.indexOf(NEEDLE)`）而不是按问题前缀。
65. **「同一产品在文案里出现两次」是生成器的系统性错误**。
    `alternatives` 存 `fusion-360`，显示名是 `Autodesk Fusion (Fusion 360)`，
    文案把短名和显示名都写了一遍 → "Fusion 360, and Autodesk Fusion (Fusion 360)"。
    全站 9 个中招（solidcam / shapr3d / solid-edge / designspark-mechanical /
    bobcad-cam / ansys-discovery / altair-inspire / quantcad-hybrid / accelygen）；
    另有 `fabrapid-3d` 数组里 `meshlab` 重复。**检查式**：把文案里的产品列表
    拆出来两两做子串比较，别只看数组有没有重复项。
66. 另外两类扫出来的：**价格 / 试用天数写死在正文**（全站只剩 `diptrace` 一处：
    "30-day trial" 加「5.x 线内更新」），以及 **`price_period` 缺失 50/186**——
    后者是**可选字段**，不是缺陷，别当 bug 批量补。
67. **「no free tier is listed for it here」同时犯三个错**：自指（"here" 指我们这页，
    对读者和爬虫都没信息量）、是未经逐家核实的厂商断言（SolidCAM 就是反例，
    它写 no free tier，官网有免费 Maker Version）、以及把"免费物件的缺失"当成了答案。
    按最高原则（会变 / 各国不同 → 直链官方）的改法：**只断言我们维护的那一项（计价模型）**，
    免费物件（trial / 学生版 / 精简查看器）交给厂商页。
    一次改 93 条，带外链比例 28.2% → 30.7%。
68. **模板统一会制造新的同构，别假装改好了**。93 条改成同一骨架后，
    模板同构率从 34.3% 升到 **34.9%**（虽然最大同构组从 92 降到 78）。
    这类"结构性相似"对生成式引擎是低信息增益，但它是**已知的剩余弱点**，
    不是"已修复"。报告时要把两个数一起给，别只报好看的。
69. **检查器的正则太窄会造出假缺口，先排假阳性再动手**。本轮两次教训：
    - 17 个工具被判"缺免费版问答"，实际全都把免费写在「多少钱」里（FOSS 工具），
      硬加一条只会变成重复；
    - 3 个浏览器型工具被判"缺系统/用途/价格"，实际用自定义问法（"What is X?"）
      已经答了——模板不是目的。
    另外 `alternatives` 里的 slug **可能跨文件**（cad-exchanger → meshlab 在 c4），
    按单文件建索引会漏掉一半，补出来的文案就只剩 1 个候选。
70. **覆盖口径要分层，别把两种"做过"混成一个数**。本轮台账分三档：
    `vendor_page`（本轮真读了厂商页，14 个）、`structural`（结构/字段/一致性检查，
    其余 172 个）、以及早前轮次记在 `vendor-facts.md` 里的取证。
    「186 全部 L4」是机器结论；「186 全部重读过厂商页」是另一句话，两者不能互换。


---

## 七之二、复核节奏（内容会过期不是缺陷，不知道哪块过期了才是）

186 个页面「今天准确」不等于「一直准确」。厂商改名、被收购、套餐重排、域名迁移、
免费策略调整——这些在本轮就撞了十几次。所以复核不是"再查一遍"，是**按字段的挥发速度排期**。

**三档，按字段而不是按工具分**：

| 档 | 周期 | 范围 | 成本 |
| --- | --- | --- | --- |
| `automated` | **6 个月** | `verify-batch --strict` × 7 + `l4-audit` + 393 条外链复验 | 纯机器，很便宜 |
| `pricing` | **12 个月** | 价格字段：`pricing_type` / 套餐名 / 免费版与试用 / 所有权归属 | 需 LLM 判断，贵 |
| `full` | **24 个月** | 全量重核：格式矩阵、平台、模块归属、`detailed_features` | 最贵 |

**为什么价格 12 个月而不是 6 个月**：6 个月跑一遍 pricing 意味着每半年重核 186 个定价页。
实际经验是**单点变更远多于全面漂移**——真要变，多半伴随新闻（收购/改名/停售），
这类由 watchlist 和触发式兜住，比无差别半年扫更划算。

```bash
node .workbuddy/skills/tool-page-audit/scripts/recheck.js            # 看档期与到期日
node .workbuddy/skills/tool-page-audit/scripts/recheck.js --done automated
node .workbuddy/skills/tool-page-audit/scripts/recheck.js --watchlist # 打印定价页，逐条核
```

`references/verified.json` 存三档的上次完成日期与 watchlist，脚本按它算到期日。

**watchlist 的维护规则**：只放**实测观察到会漂**的，不放"感觉重要"的。
入榜理由分三类，加进去要写一行注释：
- 公司层面（更名 / 被并购 / 分拆）——如 `sigmanest`（→ SigmaTEK）、`msc-nastran`（→ Cadence）
- 产品线重构（退役 / 合并 / 改名）——如 `autodesk-netfabb`、`proteus-design-suite`
- 定价模型特殊（阈值 / 分层 / 双轨）——如 `twinmotion`、`bimcollab`、`vectorworks`

**触发式复核**（不等排期，立刻插队）：
1. 外链复验出现**跨注册域 301**（`curl -w '%{url_effective}'` 落点换域）→ 品牌多半变了
2. 厂商被收购 / 合并 / 更名的新闻 → 连带所有权、定价页、产品名一起核
3. `verify-batch` 新增规则后第一次全量跑出告警 → 先怀疑规则，再怀疑数据（见坑 53）
4. 用户或读者指出某条错 → 该条立刻降级重核，且同类工具全批复查
5. 某工具**停售 / 停止支持** → 加 `discontinued` 标记，正文改成冻结史实（`FROZEN_EVENT` 豁免年份）

**复核完必须做的一件事**：`--done <stage>` 更新日期，并重跑 `l4-audit`。
只改内容不改日期，等于排期失真——下一次就不知道该查谁了。


---

## 八、参考文件

- `references/vendor-facts.md` —— 已核实的厂商事实库（先查这里，避免重复取证）
- `references/report-template.md` —— 批次报告模板
- `references/verified.json` —— 三档复核的完成日期 + watchlist
- `scripts/verify-batch.js` —— 批次校验器
- `scripts/l4-audit.js`（在 `scratch/audit/`）—— L0–L4 逐工具分级，输出 `l4-ledger.tsv`
- `scripts/recheck.js` —— 复核排程（6 / 12 / 24 个月三档）
