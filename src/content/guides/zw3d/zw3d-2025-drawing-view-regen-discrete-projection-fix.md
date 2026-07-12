---
title: "ZW3D 2025 Drawing Views Won't Regen: Discrete Projection Setting Fix"
excerpt: "ZW3D 2025 introduced a Discrete Projection mode that greys out the Regen control on drawing views. Here's why it happens and how to restore normal Regen behavior."
category: "troubleshooting"
softwareSlug: "zw3d"
keyword: "zw3d 2025 drawing view regen greyed out discrete projection fix"
slug: "zw3d-2025-drawing-view-regen-discrete-projection-fix"
author: "CADGuide Technical Editorial"
readTime: "6 min read"
date: "2026-07-12"
sources:
  - "https://zw3dforum.com/t/cannot-regen-a-view-or-projection-important-v2025/1837"
  - "https://www.zwsoft.com/news/products/zw3d-2025-has-released"
---

# ZW3D 2025 Drawing Views Won't Regen: Discrete Projection Setting Fix

A ZW3D Forum user (Cowboy99) documented a confusing behavior in ZW3D 2025: drawing views cannot be regenerated, and the Regen option appears greyed out. This is caused by the new Discrete Projection feature introduced in ZW3D 2025, which changes how drawing views are created and managed.

## The Problem

**Affected version**: ZW3D 2025 and later

**Symptoms**:
- Drawing views cannot be regenerated (Regen option is greyed out)
- Right-clicking a view → Attributes shows Regen as inactive or greyed out
- The Regen control is shaded out during view insertion
- Adding new sheets to an existing drawing does not fix the issue

## Root Cause: Discrete Projection

ZW3D 2025 introduced a new **Discrete Projection** mode for 2D drawing creation. According to ZW3D's official release notes, this technology delivers "over 90% faster projection speeds for large files."

However, Discrete Projection has a side effect that the forum post highlights: **by default, Discrete Projection always regenerates**. This means you cannot turn the view Regen OFF. The Regen Control option appears greyed out because the system is always in Regen mode under Discrete Projection.

This is confusing because users are used to seeing the active Regen highlighted as an option they control. With Discrete Projection, the Regen is locked on — the option is greyed out not because Regen is disabled, but because it's always enabled and can't be turned off.

## The Fix

### If You Need to Turn Regen OFF

If you specifically need a view that does NOT regenerate (e.g., to show stages of a part construction), you must change the projection method before creating the drawing:

1. Go to **Utilities → Configuration → 2D - Drawing Sheet**
2. Turn OFF the **Discrete Projection** option
3. Create a **new drawing sheet** — this is critical, as the Discrete Projection flag is embedded in the sheet at creation time
4. Adding new sheets to an existing drawing does NOT solve the problem — you must create a completely new sheet
5. Text and markup can be copied from the original sheet to the new sheet

### If Regen Is Working but Appears Greyed Out

If your views are actually updating correctly but the Regen control just looks greyed out, this is the expected behavior with Discrete Projection. The views are regenerating automatically — the greyed-out control means Regen is locked ON, not OFF.

## Better Alternative for Staged Construction Views

The forum user (Cowboy99) suggests that if you need to show stages of a part construction without Regen, the **RMB → History → State** option is a better solution than disabling Regen. This lets you capture and display specific model states without fighting the Discrete Projection system.

## Performance Benefit vs. Behavior Change

The Discrete Projection feature is a significant performance improvement. ZWSOFT reports:

- ZW3D 2025: 90% faster projection speeds for large files
- ZW3D 2026: 60% faster 2D drawing projections and 70% increase in operational efficiency

For most users, the performance benefit outweighs the confusion of the greyed-out Regen control. If you don't need to disable Regen on specific views, leave Discrete Projection enabled and accept that Regen is always on.

## When to Disable Discrete Projection

Only disable Discrete Projection if you specifically need:
- Views that don't update when the 3D model changes (rare)
- Staged construction views with manual Regen control
- Compatibility with older drawing workflows that depend on manual Regen

For all other cases, Discrete Projection's automatic Regen is the correct behavior — your drawings will always stay in sync with the 3D model.
