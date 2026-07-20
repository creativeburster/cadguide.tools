---
title: "ZBrush Brush Lag and Stuttering: Dynamic SubDiv, Lazy Mouse, and Sculptris Pro Fixes"
excerpt: "Brush lag in ZBrush is almost always caused by Dynamic Subdivision being enabled while sculpting, Lazy Mouse overhead, or Sculptris Pro mode on dense meshes. We cover the specific settings we disable and the Fast Samples trick that extends smooth sculpting to 1.5M+ polys."
category: "performance"
softwareSlug: "zbrush"
keyword: "ZBrush brush lag stuttering sculpting performance fix"
slug: "zbrush-brush-lag-stuttering-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-20"
sources:
  - "https://www.zbrushcentral.com/t/help-regarding-zbrush-performance/376456"
  - "https://www.zbrushcentral.com/t/brush-lag/333147"
  - "https://pixologic.com/zbrushlive/askzbrush-my-sculpting-brushes-started-lagging-and-drawing-dots-on-the-model-whats-happening/"
---

# ZBrush Brush Lag and Stuttering: Dynamic SubDiv, Lazy Mouse, and Sculptris Pro Fixes

We've been sculpting in ZBrush for years, and we still see the same question posted on ZBrushCentral every week: "My brushes are lagging and drawing dots on the model. I have a decent PC and only 300K polygons. What's going on?" The frustration is real — you're trying to sculpt a detail and each stroke takes 2-3 seconds to appear. Let us walk through the fixes we've collected from years of troubleshooting.

## Fix 1: Disable Dynamic Subdivision (The #1 Culprit)

This is the first thing we check, and it fixes the problem about 80% of the time. Dynamic Subdivision applies a real-time subdivision preview to your model while you sculpt. It looks great — smooth surfaces, clean edges — but it doubles or quadruples the effective polygon count that ZBrush has to process for every brush stroke.

**To disable it**:
1. Go to **Tool → Geometry → Dynamic SubDiv**
2. Click the **Dynamic** button to turn it off
3. Your model will drop back to its actual polygon count

The irony is that many new users enable Dynamic SubDiv because the model looks smoother, not realizing it's the cause of their lag. We keep it off during sculpting and only enable it for preview screenshots.

## Fix 2: Disable Lazy Mouse for Faster Strokes

Lazy Mouse is a stroke smoothing feature that's enabled by default on many brushes. It creates smoother, more accurate strokes by interpolating between your input points. But this interpolation comes with a performance cost — on dense meshes, the extra calculation per stroke point adds up.

**To toggle it**: Press the **L** key to disable Lazy Mouse temporarily. You'll notice immediately that strokes feel more responsive, though slightly less smooth.

We toggle Lazy Mouse on and off throughout a sculpting session: on for fine detail work where smoothness matters, off for blocking in large forms where speed matters more.

## Fix 3: Sculptris Pro Mode and Fast Samples

Sculptris Pro is a mode that dynamically adds and removes polygons as you sculpt, giving you localized density where you need it. It's incredibly powerful but computationally expensive — every stroke triggers real-time remeshing.

If you're experiencing lag in Sculptris Pro mode, there's a lesser-known setting that helps significantly:

1. Open the **Brush Palette**
2. Go to the **Samples** section
3. Enable **Fast Samples** (it's right next to the Build Up option)

A user on ZBrushCentral discovered that enabling Fast Samples pushes the lag threshold from around 300K polygons to about 1.5 million polygons before you notice any stuttering. We've tested this ourselves and it works — Fast Samples reduces the sampling quality slightly, but the performance gain is worth it for blocking in forms.

Also check the **Stroke → Sculptris Pro** menu settings. Lowering the **Max Size** for Sculptris Pro reduces how many new polygons are generated per stroke, which directly impacts performance.

## Fix 4: Use Matcap Materials Instead of Standard Materials

This one surprised us when we first discovered it. Standard materials in ZBrush calculate real-time lighting across every visible polygon. On a 5-million-poly model, that's a lot of calculations per frame. Matcap materials bake the lighting into the material itself — no per-pixel lighting calculation needed.

**To switch**: In the Material palette, choose any material from the **MatCap** section (the red sphere icon) rather than the **Standard** section.

If you must use a Standard material (for example, when polypainting), go to **Material → Modifiers** and set **Specular to 0**. The specular highlight calculation is the most expensive part of the Standard material, and turning it off gives you most of the performance back.

## Fix 5: Preview Shadow Optimization

In the Render tab, there's a **Preview Shadow** setting with an **ObjShadows** slider. If this is set to a high value, ZBrush calculates real-time shadows for every visible surface — expensive on dense meshes.

**To fix**: Go to **Render → Preview Shadow** and set the **ObjShadows** slider to **0**. You'll lose the real-time shadow preview, but your brush responsiveness will improve noticeably.

## Fix 6: QTrans Threshold for Navigation Lag

If your model lags when you rotate, pan, or zoom (but not when sculpting), the QTrans Threshold setting controls how ZBrush handles viewport navigation on dense meshes.

**To configure**: Go to **Preferences → Performance → QTransThreshold**. Setting this to **0** means ZBrush will always drop to the lowest subdivision level during navigation. When you stop moving, it pops back to your current subdivision level.

This is on by default, but if someone changed it, you'll get lag during every rotation. Set it back to 0.

## Fix 7: Solo Mode During Navigation

In newer ZBrush versions, the **Solo** button has a **Dynamic** option. When enabled, only the currently selected SubTool is displayed while you pan, zoom, or rotate. When you stop moving, all SubTools reappear.

This is a game-changer for multi-SubTool projects. Instead of trying to rotate a scene with 20 SubTools totaling 30 million polygons, Solo mode shows only your active SubTool during navigation — maybe 2 million polygons. The difference in responsiveness is dramatic.

## Fix 8: Manage Your Subdivision Levels

We see this mistake constantly: artists subdivide their model to 10 million polygons and then try to sculpt at that level. ZBrush can handle it, but it's not efficient.

**Our workflow**:
1. Block in forms at the **lowest subdivision level** (50K-200K polys)
2. Refine proportions and major shapes at the **next level up** (500K-1M polys)
3. Only go to the **highest level** (5M+ polys) for final detail — pores, wrinkles, fine texture
4. Use **Shift+D** to step down subdivision levels quickly when you need to adjust larger forms

Working at the appropriate subdivision level for each task is the single most effective way to maintain smooth performance.

## Fix 9: Split Large SubTools

A single SubTool with 100 million polygons will cause problems no matter what settings you tweak. Maxon's own knowledge base recommends splitting dense meshes into multiple SubTools.

For example, instead of one SubTool with 100 million polygons, split it into four SubTools with 25 million each. ZBrush only processes the active SubTool's geometry for brush calculations, so you effectively quarter the workload.

## Fix 10: Increase Undo Memory

If ZBrush feels sluggish after several minutes of sculpting, it might be running low on undo memory. Each brush stroke creates an undo state, and on dense meshes, these states are large.

**To increase**: Go to **Preferences → Memory → Undo Memory** and increase the value. We set it to 8000MB (8GB) on workstations with 32GB+ RAM. The default is often too low for production work.

## Summary

ZBrush brush lag is almost never a hardware problem — it's a settings problem. Our fix order: disable Dynamic SubDiv → toggle Lazy Mouse off → enable Fast Samples for Sculptris Pro → switch to Matcap materials → set ObjShadows to 0 → check QTransThreshold → use Solo mode for navigation. These eight settings cover virtually every lag scenario we've encountered.
