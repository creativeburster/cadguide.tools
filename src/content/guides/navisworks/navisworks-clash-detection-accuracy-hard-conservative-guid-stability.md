---
title: "Navisworks Clash Detection Accuracy: Hard vs Conservative Methods, Tolerance Filter Reliability, GUID Breakage, and 2026-2027 Stability Issues"
excerpt: "Navisworks clash detection has documented accuracy problems: Hard mode misses visible clashes that Conservative catches, distance calculations don't match minimum-path-to-clear, GUID changes from Revit element replacement break clash group tracking, and 2026/2027 versions introduce stability bugs. We cover each with workarounds from Autodesk community discussions."
category: "clash-detection-accuracy"
softwareSlug: "navisworks"
keyword: "Navisworks clash detection hard conservative tolerance GUID clash group stability 2026 2027 accuracy"
slug: "navisworks-clash-detection-accuracy-hard-conservative-guid-stability"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://forums.autodesk.com/t5/navisworks-forum/clash-detection-shows-zero-clashes-despite-visible-issues/td-p/13218951"
  - "https://forums.autodesk.com/t5/navisworks-forum/navisworks-clash-distances-and-hard-vs-conservative-issues/td-p/10306328"
  - "https://forums.autodesk.com/t5/navisworks-forum/navisworks-manage-2026-stability-issues-slow-clash-status-update/td-p/13995752"
---

# Navisworks Clash Detection Accuracy: Hard vs Conservative Methods, Tolerance Filter Reliability, GUID Breakage, and 2026-2027 Stability Issues

Navisworks Manage is the de facto standard for BIM clash detection, but its results have documented accuracy problems that practitioners have verified through testing. Hard mode misses clashes that Conservative catches, distance values don't correspond to minimum-path-to-clear, and GUID changes break clash group tracking across coordination cycles. This guide covers the accuracy issues, their root causes, and community-verified workarounds.

## 1. Zero Clashes Despite Visible Overlaps

### Symptom

Clash detection returns zero results even though visible overlaps exist with distances greater than the set tolerance (e.g., 25mm).

### Root Cause

The **Clash Type** setting determines what is detected:
- **Hard Clash**: Tests geometric intersection of triangular meshes — misses clashes near mesh boundaries
- **Hard (Conservative)**: Tests against the whole object boundary — catches more but produces false positives
- **Clearance**: Tests distance between objects — use when checking for required clearances, not intersections

### Fix

1. **Change clash type to Clearance** if checking minimum distances per BIM execution plan
2. **Change to Hard (Conservative)** to catch all potential clashes (accept false positives)
3. **Set tolerance to 0.0001** to verify the tool is working — if results appear, the tolerance was filtering them out
4. **Check "Items to Ignore"** — ensure no categories are accidentally excluded

### Why Tolerance Filtering Is Unreliable

The tolerance filter is based on the clash **distance** value. If the distance calculation is incorrect (see next section), the tolerance filter will incorrectly exclude or include clashes.

## 2. Hard vs Conservative: Distance Calculation Accuracy

### Documented Problem

Users ran controlled tests in Navisworks 2021 with two NWC models exported from Revit:
- Same settings, tolerances, and selections
- One test: Hard Clash
- One test: Hard (Conservative)

**Findings**:
1. Conservative detected more clashes (expected)
2. **Several clashes detected in Conservative should have been picked up by Hard but weren't**
3. **Distance values on several clashes didn't correspond to the minimum path to clear the clash**

### How Distance Should Work

> "Clash Detective will report the minimum distance one of the objects will need to move so the Clash no longer exists."

### Why Hard Mode Misses Clashes

Hard clash tests triangular mesh intersection. Clashes near the triangular mesh limit fall within set tolerances and are missed. Conservative considers the whole object boundary, catching these edge cases.

### Why Distances Are Wrong

The distance calculation appears to use a different algorithm than the documented "minimum path to clear." This means:
- **Tolerance filtering is unreliable** — if distances are wrong, the filter excludes valid clashes
- **Clash severity ranking is unreliable** — can't trust which clashes are most critical

### Community-Verified Workaround

> "The solution seems to be run clash test in conservative with 0 tolerance and having to deal with thousands of clashes instead of hundreds."

**Practical approach**:
1. Run **Hard (Conservative)** with **0 tolerance**
2. Accept the large number of results
3. Manually group and filter results
4. Use visual walkthrough to verify — don't rely solely on the tool

### User Trust Level

> "I'm starting having doubts... I'm still doing visual identification by walking through the model. I just do this clash test only as part of the requirement of the client."

## 3. GUID Changes Breaking Clash Group Tracking

### The Coordination Workflow Problem

Standard clash detection workflow:
1. Create separate tests (Steel vs HVAC, Steel vs Plumbing, etc.)
2. Group similar clashes, create viewpoints with numbered groups
3. Report viewpoints to subcontractors in coordination meetings
4. Subcontractors update models
5. Re-run clash tests, focus on new clashes

### The GUID Breakage Problem

When element GUIDs change between model updates:
- Existing clash groups show as **"resolved"**
- New clashes are created for the **same physical locations**
- All tracking is lost — can't tell which clashes were actually fixed

### When GUIDs Change

| Source | GUID Preservation |
|--------|------------------|
| Revit native file → Navisworks | ✅ Preserved |
| Revit export to NWC | ✅ Usually preserved |
| AutoCAD → NWC | ❌ New GUIDs each export |
| Revit: delete + recreate element | ❌ New GUID |
| Revit: modify existing element | ✅ Same GUID |

### Fix

1. **Use native Revit files** in Navisworks when possible — preserves GUIDs
2. **Don't delete and recreate elements** — modify in place to preserve GUIDs
3. **Don't try to "close the loop"** on clash detection when subcontractors use AutoCAD
4. **Get reasonably good models** that avoid unnecessary clashes — reduces the tracking burden
5. **Accept that clash tracking is imperfect** — focus on resolving clashes, not tracking status changes

## 4. Navisworks Manage 2026: Stability Issues

### Issue 1: Multiple Files Freeze

When performing any task (clash review, selection, navigation) in one Navisworks model, any other simultaneously opened Navisworks file becomes **unresponsive** until the current operation completes or the application is restarted.

**Workaround**: Only work with one Navisworks file at a time.

### Issue 2: Slow Clash Status Update + Unexpected Closure

While reviewing clashes and changing clash statuses, the application takes unusually long to respond. In some cases, the Navisworks file **closes unexpectedly** without warning, causing loss of work.

**Workaround**: Save frequently. Submit crash reports to Autodesk support.

### Issue 3: Clash Test Reordering

When clash status is changed, the related clash test or clash items **automatically change their order** in the results table, disrupting the review workflow.

**Root Cause**: This is caused by a **sort being active on one of the columns**. When a clash status changes, the table re-sorts based on the active column sort.

**Fix**: Remove column sorting before reviewing clashes, or be aware that status changes will trigger re-sorting.

## 5. Navisworks 2027: Issues Add-In Broken

### Symptom

The Issues Add-In (v5.1.0 and v5.1.1) in Navisworks 2027 cannot associate issues with clash groups:
1. Clicking on a created issue shows **no pushpin** in the model
2. Action → Select Issue shows: **"This clash does not have a related issue"**
3. The **"Related" column** is missing from the clash results table
4. Creating a new issue: **"Couldn't add clash information to issue"**

### Impact

The entire coordination workflow between clash groups and issues is broken in Navisworks 2027. Users cannot visually or logically confirm the relationship between clashes and issues.

### Status

- Same workflow works correctly in Navisworks 2026
- Updating to Issues Add-In v5.1.1 does not fix the problem
- No official fix announced as of the community report

### Workaround

**Stay on Navisworks 2026** until the Issues Add-In is fixed for 2027. If migration to 2027 is required, use ACC Model Coordination for issue tracking instead of the local Issues Add-In.

## Best Practices for Reliable Clash Detection

1. **Use Conservative mode with 0 tolerance** — accept more results for completeness
2. **Don't trust distance values** for severity ranking — verify visually
3. **Use native Revit files** to preserve GUIDs for clash tracking
4. **Avoid deleting and recreating elements** in Revit — modify in place
5. **Don't run multiple Navisworks files simultaneously** (2026 stability issue)
6. **Remove column sorting** before clash review to prevent reordering
7. **Stay on 2026** if Issues Add-In integration is critical (2027 broken)
8. **Use visual walkthrough** as a complement to automated clash detection
9. **Save frequently** — unexpected closures in 2026 can lose work
10. **Submit crash reports** to Autodesk to help prioritize fixes
