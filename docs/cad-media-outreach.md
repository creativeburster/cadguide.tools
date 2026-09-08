# 📰 CAD 垂直媒体投稿包（站长从邮箱手动发送）

> 用法：以下每封邮件都是可直接发送的成品。用 **contact@cadguide.tools** 从你的邮箱发出，
> 收件人通过各媒体官网的 Contact / About 页面获取（我没有臆造邮箱地址，防止打错人）。
> 建议每封邮件间隔 1-2 天发送，避免被当成群发。

---

## 通用英文 Pitch 模板（正文）

> **Subject**: Free independent CAD comparison engine — data story tip for [OUTLET]
>
> Hi [editor name],
>
> I'm Will, founder of CADGuide.tools — a free, independent comparison engine for CAD/BIM/CAE software. We index 170+ tools with real pricing, licensing models (perpetual vs subscription), platform support, and API/LISP compatibility — no paid rankings, no vendor pay-to-play.
>
> Alongside the directory we ship 480+ free client-side engineering calculators (K-factor bend, bearing life, beam deflection, a DWG version checker that reads files locally — nothing uploads), and publish data-driven articles on CAD licensing economics.
>
> [角度段落 — 每家媒体不同，见下]
>
> Would any of this fit [OUTLET]? Happy to write a guest column, share our dataset, or do an interview — whatever is easiest for your editorial calendar.
>
> Best,
> Will Sun
> Founder, CADGuide.tools
> https://cadguide.tools · contact@cadguide.tools

### 角度段落（按媒体选择）

- **DEVELOP3D（develop3d.com，CAD/PLM 月刊）**：
  "We've been tracking a quiet industry split: subscription-only vendors vs the perpetual holdouts (GstarCAD $499 once, progeCAD $399 once, ZWCAD from $899). Our indexed pricing across 170+ tools shows the 3-year total-cost gap between the two camps has widened to 4-12x per seat. Readers deciding between Autodesk and the challengers might find the dataset useful."

- **Cadalyst（cadalyst.com，Autodesk 系老牌刊物）**：
  "A practical piece your AutoCAD audience may like: 'AutoCAD on macOS — what the Mac version is missing, and the LISP-compatible alternatives that actually run on Apple hardware.' It's based on our indexed platform and API support data, and it doesn't pretend the Mac version equals the Windows one."

- **UPFRONT.eZine / WorldCAD Access（Ralph Grabowski，worldcadaccess.com，行业老牌评论人）**：
  "A short industry note: while Autodesk pushed subscription-only, a cluster of DOS-era holdouts kept perpetual licensing alive — and their combined price floor ($399-499 once) is now the anchor of the challenger market. We've indexed the numbers across 170+ tools. Happy to share the raw data if useful for UPFRONT."

- **AEC Magazine（aecmag.com，AEC/BIM 方向）**：
  "An angle for AEC readers: small architecture firms on AutoCAD subscriptions are 4-12x per seat over three years compared to the perpetual-license challengers — but the BIM capability gap is real. We've indexed both sides of that trade-off."

---

## SourceForge 手动收录（DA 91，机器人被 Cloudflare 拦截，需你手动）

1. 浏览器打开 **sourceforge.net** → 右上角 **Register** 注册账号（用 contact@cadguide.tools，邮箱验证）
2. 登录后访问 **sourceforge.net** 顶部菜单 → **Create** → 选择 **Software Listing**（或直接搜索 "submit software listing" 进入口）
3. 按以下内容填写：

- **Name**: CADGuide.tools
- **Summary**: Free interactive directory for comparing 170+ CAD, BIM, and CAE software tools — pricing, licensing, platforms, and API support. Includes 480+ free client-side engineering calculators.
- **Description**:
  ```
  CADGuide.tools is a free, independent comparison directory for professional
  CAD, BIM, and CAE software. Evaluate 170+ desktop and cloud tools side by
  side across 40+ technical attributes: AutoLISP support, geometry kernel,
  network licensing, native DWG handling, and perpetual vs subscription
  pricing. Includes an interactive matchmaker and 480+ free client-side
  engineering utilities (DWG version checker, K-Factor bend calculator,
  beam analyzers, shortcut matrices) that run 100% in your browser —
  no uploads, no signup, no paid rankings.
  ```
- **Website**: https://cadguide.tools
- **Logo/Icon**: https://cadguide.tools/icon-512.png
- **Categories**: Graphics / CAD; Scientific/Engineering
- **License**: Free / Open Source related — 选 "Freeware" 或 "Other"

4. 提交后 SourceForge 会有项目页，把项目页 URL 发我，我做后续关联优化。

---

## AlternativeTo / GrabCAD（注册后可随时恢复）

- **AlternativeTo**（DA 90+）：账号注册后，打开 alternativeto.net 的 AutoCAD 页面 → "Add as alternative" 提交 CADGuide.tools → 出现在其 AutoCAD 替代品列表（高流量页）。注册入口已在 Edge 第 4 个标签页开过：alternativeto.net/login。
- **GrabCAD**（数百万工程师社区）：注册后我能发一篇《How we built 480+ browser-based engineering calculators》教程（含工具箱链接）。注册入口：grabcad.com/profile/register。

---

## 已死渠道备忘（不再尝试）

- ~~Slant.co~~ — 站点 SSL 失效（2026-09-07 确认）
- ~~CADdigest~~ — 站点连接失败（2026-09-09 确认）
