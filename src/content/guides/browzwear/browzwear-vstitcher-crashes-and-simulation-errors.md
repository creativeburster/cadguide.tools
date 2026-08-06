---
title: "Browzwear VStitcher Crashes and Simulation Errors"
excerpt: "Browzwear VStitcher Crashes and Simulation Errors: symptoms, root causes, and step-by-step fixes, verified against Browzwear release notes and help center."
category: "troubleshooting"
softwareSlug: "browzwear"
keyword: "Browzwear VStitcher crash trim stitched pattern extra-large size simulation lightning bolt shattered glass display graphics card DXF import grading distorted save outfit API plugin"
slug: "browzwear-vstitcher-crashes-and-simulation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://help.browzwear.com/en/articles/13065219-release-notes-2021-2-1"
  - "https://help.browzwear.com/en/articles/13066191-lightning-bolt-or-shattered-glass-displays"
  - "https://help.browzwear.com/en/articles/13065188-release-notes-vstitcher-2023-3-1"
---

# Browzwear VStitcher Crashes and Simulation Errors: Trim Stitched to Pattern Crash, Extra-Large Size Simulation Crash, Lightning Bolt Display from Graphics Card Settings, DXF Import Without Grading or Distorted Grading, and Save Outfit Crash with API Plugin Failure

VStitcher is a leading 3D garment simulation tool, but crashes from trims, size changes, graphics settings, and DXF import issues disrupt production. This guide covers the 5 most common VStitcher crash and simulation problems with diagnostic steps and fixes from Browzwear release notes and help center.

## 1. Trim Stitched to Pattern Piece Causes Crash

### Symptom

VStitcher crashes when a trim (like a zipper, button, or binding) is stitched to a pattern piece instead of being directly applied to the garment.

### Root Cause

This is a confirmed software bug. When trims are attached via stitching to a pattern piece rather than through the direct trim application workflow, the simulation engine encounters an invalid state and crashes.

### Fix

1. **Apply trims directly** instead of stitching them to pattern pieces:
   - Use the Trim tool to apply trims directly to the garment
   - Don't use the stitch function to attach trims to patterns

2. **Update VStitcher** — this was fixed in version 2021.2.1:
   - Check for updates in Help → Check for Updates
   - Or download the latest version from the Browzwear portal

3. **Workaround** — if you must stitch trims to patterns:
   - Save the file before simulating
   - If it crashes, reopen and apply the trim directly instead

## 2. Extra-Large Size Simulation Crash

### Symptom

Changing the avatar to extra-large sizes and then running simulation causes VStitcher to crash.

### Root Cause

Confirmed bug — the simulation engine fails when garment dimensions exceed certain thresholds with extra-large avatars. The fabric strain calculations produce invalid values at extreme sizes.

### Fix

1. **Update VStitcher** — fixed in version 2021.2.1

2. **Workaround** — if you need extra-large sizes:
   - Gradually increase the size instead of jumping to extra-large
   - Run simulation at each intermediate size
   - Adjust fabric properties (stretch, bend) for larger sizes
   - Save before each size change

3. **Use tension/pressure map cautiously** — using the tension or pressure map alongside multi-avatar display can also cause crashes:
   - Disable tension/pressure maps before changing sizes
   - Re-enable after simulation is complete

## 3. Lightning Bolt or Shattered Glass Display from Graphics Card Settings

### Symptom

Shooting rays projecting out of the garment appear within the 2D window, resembling lightning bolts or shattered glass. The software may also experience slow performance or crash consistently.

### Root Cause

Incorrect graphics card settings cause this visual bug. The GPU rendering pipeline produces artifacts when the graphics card doesn't meet VStitcher's requirements or has wrong settings.

### Fix

1. **Check graphics card requirements** — refer to Browzwear's Requirements Details:
   - Ensure the GPU meets minimum specifications
   - VStitcher requires a dedicated GPU with specific OpenGL support

2. **Update graphics drivers**:
   - Download the latest driver from NVIDIA/AMD/Intel
   - Perform a clean install (not just an update)
   - Restart the computer after installation

3. **Check graphics settings in VStitcher**:
   - Switch between OpenGL and V-Ray render engines
   - If using OpenGL, try switching to the other engine
   - Check if the issue persists with different render settings

4. **Check Windows graphics performance settings**:
   - Settings → System → Display → Graphics
   - Ensure VStitcher is set to "High performance" GPU
   - Not the integrated GPU (if on a laptop with dual GPUs)

5. **Disable GPU acceleration** as a workaround:
   - If the issue persists, try software rendering mode
   - Performance will be slower but the crash should stop

### Community Report

> "A visual bug may appear for V-Stitcher or Lotta users on Windows where shooting rays projecting out of the garment appear within the 2D window. This issue is caused by incorrect graphics card settings."

## 4. DXF Import Without Grading or Distorted Grading

### Symptom

DXF pattern files import without grading information, or the grading is distorted — sizes don't follow the intended grade rules.

### Root Cause

DXF files from different pattern-making software use different grading data formats. VStitcher may not correctly interpret the grading data from all DXF sources, resulting in missing or distorted grading.

### Fix

1. **Verify DXF export settings** from the source software:
   - Ensure grading data is included in the DXF export
   - Check the DXF version (AIMS, Optitex, Lectra, etc.)
   - Some DXF formats don't include grading — only base size

2. **Import the base size first**:
   - Import the DXF with just the base size
   - Apply grading manually in VStitcher
   - Use the Grading tool to define grade rules

3. **Check for file name issues**:
   - Avoid special characters in file names (German umlauts, spaces, etc.)
   - Some software corrupts file names which causes import problems
   - Rename the file with simple ASCII characters

4. **Update VStitcher** — DXF import improvements are included in regular updates:
   - Version 2022.2 includes fixes for DXF import issues
   - Check the release notes for DXF-related fixes

5. **Try a different DXF format**:
   - Export from the source software in a different DXF variant
   - Some formats handle grading better than others
   - ASTM/AAMA DXF is the most widely supported

### Community Report

> "DXF files sometimes importing without grading or with distorted grading."

## 5. Save Outfit Crash and API Plugin Failure

### Symptom

Saving an outfit causes VStitcher to crash. Additionally, the API MenuFunctionReloadAdd plugin is not working properly after the crash.

### Root Cause

Confirmed bug in VStitcher 2023.3 — saving outfits with certain configurations triggers a crash in the save routine. The API plugin failure is a related issue where the plugin reload mechanism doesn't recover properly after a crash.

### Fix

1. **Update VStitcher** — fixed in version 2023.3.1:
   - "Saving an outfit caused VStitcher to crash" — listed as fixed

2. **Workaround for saving**:
   - Save the garment file (.bw) instead of the outfit
   - Export the garment to a different format as backup
   - Avoid saving outfits with complex configurations

3. **API plugin workaround**:
   - Restart VStitcher after the crash
   - Manually reload the plugin from the API menu
   - If the plugin still doesn't work, reinstall it

4. **Check for conflicting plugins**:
   - Disable all custom plugins
   - Enable them one by one to identify conflicts
   - Remove or update conflicting plugins

## 6. Additional VStitcher Issues

### Internal Lines Not Appearing in 3D

**Issue**: Internal lines don't appear in the 3D window when "Show in 3D" is toggled on.
**Fix**: Update to 2023.3.1 — this was fixed.

### Incorrect Stitch Size on Smart Zippers

**Issue**: Smart zippers in sizes other than base size get incorrect stitch size, resulting in uneven simulation.
**Fix**: Update to 2023.3.1 — this was fixed.

### White Specks in Fabric with Fur Property

**Issue**: White specks appear in fabric where the Fur property is applied.
**Fix**: Update to 2023.3.1 — this was fixed.

### Tension Map Inconsistencies Between Versions

**Issue**: Tension maps show inconsistencies when opening the same file in different VStitcher versions.
**Fix**: Use the same VStitcher version across the team. Update to 2023.3.1 for improved consistency.

### V-Ray Render Freeze

**Issue**: Normal render fails with error message, and other renders freeze the window.
**Fix**: Update V-Ray to the latest version. Try OpenGL render as alternative.

## Best Practices

1. **Apply trims directly, not via stitching** — stitching trims to patterns causes crashes
2. **Increase avatar size gradually** — jumping to extra-large crashes the simulation
3. **Update graphics drivers regularly** — lightning bolt display is a GPU settings issue
4. **Set VStitcher to high-performance GPU** — especially on laptops with dual GPUs
5. **Verify DXF export includes grading** — check source software export settings
6. **Avoid special characters in file names** — causes import problems
7. **Save garment files (.bw) as backup** — don't rely solely on outfit saves
8. **Keep VStitcher updated** — many crash bugs are fixed in point releases
9. **Disable tension/pressure maps before size changes** — prevents crashes
10. **Use the same VStitcher version across the team** — prevents tension map inconsistencies
