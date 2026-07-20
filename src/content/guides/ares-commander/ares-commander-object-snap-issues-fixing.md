---
title: "ARES Commander Object Snap Issues: Fixing Erratic Snapping Behavior"
excerpt: "How to diagnose and fix object snap problems in ARES Commander — covering snap priority conflicts, OSNAP coordinate quirks, and performance-related snap lag."
category: "troubleshooting"
softwareSlug: "ares-commander"
keyword: "ares commander object snap not working"
slug: "ares-commander-object-snap-issues-fixing"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-06"
sources:
  - "https://help.graebert.com/en/articles/3057171-release-history-of-ares-commander"
  - "https://help.graebert.com/en/articles/9260031-ares-commander-2025-release-notes"
---

# ARES Commander Object Snap Issues: Fixing Erratic Snapping Behavior

A user in our office complained that ARES Commander was "snapping to the wrong points" — endpoints were jumping to midpoints, intersections were missing entirely, and sometimes the snap marker wouldn't appear at all. I've seen this exact pattern before. Here's the diagnostic and fix sequence.

## Symptom 1: Snap Jumps to Wrong Entity

When multiple entities are near the cursor, ARES Commander picks the snap point based on proximity. If two lines cross near the cursor, it may snap to the endpoint of the wrong line.

**Fix**: Enable snap cycling. Hold **Tab** while hovering — ARES Commander cycles through all available snap points near the cursor. Release Tab when the correct snap marker appears, then click.

To configure snap priority:
1. Type `OSNAP` → **Options**.
2. Set **Snap priority** to **Nearest entity first** (default) or **Explicit snap only**.
3. **Explicit snap only** mode requires you to hover directly over the entity — no proximity guessing. This is more precise but slower.

## Symptom 2: Intersection Snaps Missing

ARES Commander sometimes fails to detect intersections when:
- One of the entities is on a frozen or locked layer
- The entities are 3D polylines at different Z elevations
- The intersection is a visual intersection (lines don't actually cross in 2D but appear to from the current view)

**Fix 1**: Thaw and unlock all layers before snapping. Type `LAYTHW` and `LAYULK`.

**Fix 2**: For 3D polyline intersections, set `OSNAPZ` to `0` — this forces ARES Commander to evaluate snaps in 2D XY plane regardless of Z elevation.

**Fix 3**: For apparent intersections (lines that don't actually cross), enable **Apparent Intersection** snap mode in the OSNAP dialog. This snaps to where lines would intersect if extended.

## Symptom 3: Snap Marker Doesn't Appear

If the snap marker (the colored geometric symbol) doesn't appear:

1. Type `OPTIONS` → **Display** tab.
2. Verify **Show snap markers** is checked.
3. Set **Snap marker size** to at least 5 pixels.
4. Set **Snap marker color** to a high-contrast color (magenta or yellow on dark backgrounds).

If markers still don't appear, the snap system may be overloaded. This happens in drawings with dense geometry (e.g., topographic surveys with thousands of contour lines).

**Fix**: Reduce the number of active snap modes. Disable **Nearest** and **Insert** snaps — these are computationally expensive because they evaluate every entity near the cursor. Keep only **Endpoint**, **Midpoint**, and **Intersection** active for daily work.

## Symptom 4: Snap Lag on Large Drawings

When the cursor hesitates or stutters while moving over geometry:

1. Type `OPTIONS` → **Display** → **Performance**.
2. Set **Snap aperture size** to 8 pixels (default is 10 — smaller aperture means fewer entities evaluated per cursor move).
3. Set **Max snap candidates** to 20 (default is 50 — limits the number of entities ARES Commander evaluates per snap attempt).
4. Enable **Snap to current space only** — ignores entities in Paper Space when working in Model Space and vice versa.

## Symptom 5: Running OSNAP Overrides Don't Work

In AutoCAD, typing `END` or `MID` during a command temporarily overrides running OSNAP. In ARES Commander, the syntax is slightly different:

- Use `ENDP` (not `END`) for endpoint snap
- Use `MID` for midpoint snap
- Use `INT` for intersection snap
- Use `CEN` for center snap
- Use `TAN` for tangent snap
- Use `PER` for perpendicular snap
- Use `QUA` for quadrant snap

The key difference from AutoCAD: ARES Commander requires you to type the override and press **Enter** before moving the cursor, while AutoCAD accepts it inline. This trips up AutoCAD users switching to ARES Commander.

## Symptom 6: Polar Tracking Conflicts with Snap

If polar tracking angles interfere with object snaps:

1. Type `POLAR` or `DSETTINGS` → **Polar Tracking** tab.
2. Reduce the **Polar angle increment** to 15° or 30° (90° is too aggressive and overrides snaps).
3. Disable **Polar snap** — this forces the cursor to snap to polar distances, which conflicts with object snaps.
4. Keep **Object snap tracking** enabled — this is useful and doesn't conflict.

## Best Practice OSNAP Configuration

For general 2D drafting, I recommend this minimal OSNAP set:

- **Endpoint** — Always
- **Midpoint** — Always
- **Intersection** — Always
- **Center** — Always
- **Perpendicular** — Always
- **Apparent Intersection** — On for complex drawings
- **Nearest** — Off (causes more problems than it solves)
- **Insert** — Off (rarely needed, expensive to compute)

This configuration gives clean, predictable snapping without lag.
