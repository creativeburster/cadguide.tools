---
title: "Substance 3D Painter Startup Crash, TDR GPU Timeout, Bake Crash, UV Tile Errors"
excerpt: "Substance 3D Painter Startup Crash, TDR GPU Timeout, Bake Crash, UV Tile Errors: symptoms, root causes, and step-by-step fixes, verified against Adobe Experience League documentation."
category: "troubleshooting"
softwareSlug: "substance-painter"
keyword: "Substance 3D Painter startup crash wrong GPU outdated drivers TDR crash Windows GPU timeout TdrDelay registry fix 60 seconds bake crash GPU raytracing Ryzen CPU BIOS update UV tile mask refresh overlapping UV spaces export crash insufficient disk space corruption"
slug: "substance-3d-painter-startup-crash-tdr-gpu-timeout-bake-crash-uv-tile"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/startup-issues/crash-or-freeze-during-startup"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/gpu-issues/gpu-drivers-crash-with-long-computations-tdr-crash"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-while-baking"
---

# Substance 3D Painter Startup Crash, TDR GPU Timeout, Bake Crash, UV Tile Errors, and Export Crash: GPU Driver Compatibility and Registry TDR Fix, Disable GPU Raytracing for Bake Stability, Ryzen BIOS Update, UV Tile Mask Refresh, and Insufficient Disk Space Corruption

Substance 3D Painter's startup, GPU computation, baking, UV tile handling, and export produce errors from wrong GPU selection, Windows TDR timeout, unstable GPU raytracing, UV tile mask issues, and disk space problems. This guide covers the 5 most common Substance Painter problems with diagnostic steps and community-verified fixes from Adobe Experience League documentation.

## 1. Startup Crash from Wrong GPU or Outdated Drivers

### Symptom

Substance 3D Painter crashes or freezes during startup. The application either doesn't launch at all or freezes shortly after the splash screen appears. No error message is displayed — the application simply closes or hangs.

### Root Cause

"If the application doesn't start on the right GPU it might lead to stability issues." On systems with multiple GPUs (integrated + discrete), Windows may assign Painter to the integrated GPU instead of the discrete GPU. The integrated GPU lacks the required OpenGL/Vulkan support, causing a crash. Additionally, "using old GPU drivers can lead to freezes and/or crashes." Outdated GPU drivers may have bugs in OpenGL/Vulkan implementation that Painter relies on. A third cause is "incorrect system Path/Python Path" — if the system has a misconfigured Python environment, Painter's Python initialization crashes during startup.

### Fix

1. **Force Painter to use the discrete GPU**:
   - "If the application doesn't start on the right GPU it might lead to stability issues"
   - Windows Settings > System > Display > Graphics settings
   - Add Substance 3D Painter to the list
   - Set to "High performance" (discrete GPU)
   - Or use NVIDIA Control Panel > Manage 3D Settings

2. **Update GPU drivers to the latest version**:
   - "We recommend to use the latest GPU drivers when available"
   - NVIDIA: Download from NVIDIA website or GeForce Experience
   - AMD: Download from AMD website
   - Intel: Download from Intel website
   - Perform a clean install

3. **Check for incompatible driver versions**:
   - NVIDIA 441.08 and 442.19: "Crash or stability issues"
   - NVIDIA 528.09: "Operating system freeze"
   - NVIDIA 572.16 to 572.42: "Artifacts or crash when baking textures"
   - AMD 21.2.3 to 21.6.1: "Crash or stability issues"
   - Avoid these specific driver versions

4. **Fix incorrect system Path/Python Path**:
   - "The application checks the system Path to load Python modules"
   - "If the system has an incorrect setup it can lead to a crash"
   - Check system environment variables
   - Remove conflicting Python paths
   - Remove conflicting DLL paths

5. **Fix crash on older versions (2018/4.x or older)**:
   - "On Windows, version 2018 (4.x) or older may not start because one of the dll file provided with the installation folder is too old"
   - Navigate to Substance Painter installation folder
   - Rename `libeay32.dll` to `backup_libeay32.dll`
   - Download the updated `libeay32.dll` from Adobe
   - Extract into the installation folder

6. **Check for crash on Nvidia GTX 10xx series**:
   - "Crash during startup on Nvidia GTX 10xx series"
   - Update to the latest Painter version
   - Update GPU drivers
   - If persistent, use the previous version

7. **Check Windows event viewer**:
   - Open Event Viewer > Windows Logs > Application
   - Look for Substance Painter crash entries
   - Check the faulting module
   - Report to Adobe support with the details

### Community Report

> "If the application doesn't start on the right GPU it might lead to stability issues. Using old GPU drivers can lead to freezes and/or crashes. We recommend to use the latest GPU drivers when available. The application checks the system Path to load Python modules and environment settings. If the system has an incorrect setup it can lead to a crash during the startup."

## 2. TDR Crash from Windows GPU Timeout During Long Computations

### Symptom

During long GPU computations (baking, exporting, rendering), Substance 3D Painter crashes. A Windows notification may appear saying the GPU driver stopped responding and has recovered. Painter shows a warning dialog about TDR values being below the recommended limit (10 seconds). The crash happens unpredictably during heavy operations.

### Root Cause

"On Windows, the operating system kills the GPU driver whenever a rendering takes more than a few seconds." Windows has a TDR (Timeout Detection and Recovery) mechanism that kills the GPU driver if it's unresponsive for too long. The default TDR delay is 2 seconds (TdrDelay) and 5 seconds (TdrDdiDelay). Substance Painter's GPU computations (baking, Iray rendering, export) can take longer than 2 seconds, triggering TDR and crashing the application. "It is not possible to know how long a rendering task or a computation may take, therefore it is not possible to put a limit on how much the computer should process and avoid the crash from the application level."

### Fix

1. **Increase TdrDelay in the Windows Registry**:
   - "Change both TdrDelay and TdrDdiDelay to a higher value (like 60 seconds)"
   - Open Registry Editor (regedit)
   - Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\GraphicsDrivers`
   - Right-click > New > DWORD (32bit) Value
   - Name it "TdrDelay" (case-sensitive, no trailing space)
   - Double-click, set Base to Decimal, set value to 60

2. **Increase TdrDdiDelay in the Windows Registry**:
   - In the same registry location
   - Right-click > New > DWORD (32bit) Value
   - Name it "TdrDdiDelay" (case-sensitive, no spaces)
   - Double-click, set Base to Decimal, set value to 60

3. **Restart the computer**:
   - "The TdrValue is only looked at when the computer start, so to force a refresh a reboot is necessary"
   - Close all applications
   - Restart (not shutdown + power on)
   - The new TDR values take effect

4. **If crashes persist, increase further**:
   - "If the application still crashes when doing a long computation, try increasing the delay from 60 to 120"
   - Set both TdrDelay and TdrDdiDelay to 120
   - Restart the computer
   - Test again

5. **Beware of Windows/GPU driver updates resetting TDR**:
   - "These Keys can be reset to their default value by Windows updates or GPU Drivers updates"
   - After any Windows or GPU driver update
   - Check the TDR values
   - Re-apply if reset

6. **Use a .reg file for quick re-application**:
   - Create a text file with:
   ```
   Windows Registry Editor Version 5.00
   [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers]
   "TdrDdiDelay"=dword:0000003c
   "TdrDelay"=dword:0000003c
   ```
   - Save as `.reg` file
   - Double-click to apply after updates

7. **Revert TDR to defaults if needed**:
   - "Set the TdrDelay to 2s and the TdrDdiDelay to 5s"
   - Or remove the TdrDelay and TdrDdiDelay keys
   - Restart the computer

### Community Report

> "On Windows, this window will appear if Substance 3D Painter detects that the current TDR value is below a specific limit (10 seconds). The Windows operating system kills the GPU driver whenever a rendering takes more than a few seconds. When the driver is killed, the application using it crashes automatically. To adjust the TDR simply increase the TDR Delay: change both TdrDelay and TdrDdiDelay to a higher value (like 60 seconds). Note that these Keys can be reset to their default value by Windows updates or GPU Drivers updates."

## 3. Bake Crash from GPU Raytracing or Ryzen CPU

### Symptom

Substance 3D Painter crashes during the baking process. The crash occurs while baking textures (AO, curvature, normal maps, etc.). The crash may happen on specific meshes or with specific baking settings. On some configurations, the crash is reproducible; on others, it's intermittent.

### Root Cause

Two main causes: (1) "On some GPU with unstable drivers, the baking process may lead to crashes because of the GPU raytracing feature." GPU raytracing uses hardware raytracing (RTX) for baking. Some GPU drivers have bugs in their raytracing implementation that cause crashes during baking. (2) "The application may crash during the baking process on some computer configuration running with a Ryzen CPU." AMD Ryzen CPUs have a microcode issue with multi-threaded computations that can crash baking. "This is related to multi-threaded computations. Many Motherboard constructors have issued new BIOS updates to fix this issue." A third cause is corrupted `.assbin` files — "high-poly meshes are pre-processed into *.assbin files to speed-up rebaking later. In some rare cases, loading these files may crash the application."

### Fix

1. **Disable GPU raytracing**:
   - "Use Edit > Settings to open the main settings"
   - "Under General scroll down to the section named Baking Options"
   - "Uncheck/Disable the option Enable GPU raytracing"
   - This forces CPU-based raytracing
   - More stable but slower

2. **Update BIOS for Ryzen CPUs**:
   - "An update of the BIOS usually fix the problem"
   - "Many Motherboard constructors have issued new BIOS updates"
   - "Refer to the Motherboard manual and constructor website"
   - Update to the latest BIOS version
   - This fixes the Ryzen multi-threading crash

3. **Delete corrupted .assbin files**:
   - "High-poly meshes are pre-processed into *.assbin files"
   - "In some rare cases, loading these files may crash the application"
   - "Simply deleting them should solve the problem"
   - Find .assbin files in the project cache
   - Delete them and re-bake

4. **Disable in-progress baking viewport display**:
   - "By default Substance 3D Painter display in the viewport the in-progress state of the baking"
   - "On some computers this feature may lead to instabilities"
   - Disable in-progress display in Settings
   - This reduces GPU load during baking

5. **Update GPU drivers**:
   - Check for driver versions with known baking issues
   - NVIDIA 572.16 to 572.42: "Artifacts or crash when baking textures"
   - Update to a stable driver version
   - Perform a clean install

6. **Use CPU baking instead of GPU**:
   - If GPU baking continues to crash
   - Switch to CPU-only baking
   - Edit > Settings > Baking Options
   - Select CPU as the baking engine

7. **Reduce mesh complexity**:
   - If baking crashes on large meshes
   - Reduce the high-poly mesh polygon count
   - Use a simplified mesh for baking
   - Or bake in smaller batches

### Community Report

> "Substance 3D Painter may crash during the baking process on some configurations. On some GPU with unstable drivers, the baking process may lead to crashes because of the GPU raytracing feature. Use Edit > Settings, under General scroll down to Baking Options, uncheck Enable GPU raytracing. The application may crash during the baking process on some computer configuration running with a Ryzen CPU. An update of the BIOS usually fix the problem. Many Motherboard constructors have issued new BIOS updates to fix this issue."

## 4. UV Tile Mask Refresh and Overlapping UV Space Errors

### Symptom

When working with UV tiles in Substance 3D Painter, the height combination mask is not refreshed with UV Tile mask changes. No error message appears on overlapping UV spaces with specific meshes. Position maps are not imported correctly for UV tile sequences. Anchor point's extracted alpha is ignored by other tiles. Image sequences with a single image also fill other UV tiles.

### Root Cause

UV tile handling in Substance Painter has several known issues: (1) "Height combination mask is not refresh with UV Tile mask" — when a UV tile mask changes, the height combination mask doesn't update automatically. (2) "No error message on overlapping UV spaces with a specific mesh" — overlapping UV tiles should produce an error, but for some meshes the error is not detected. (3) "Position maps are not imported correctly" for UV tile sequences — the position map import doesn't handle tile sequences properly. (4) "Anchor point's extracted alpha ignored by other tiles" — alpha extracted from an anchor point on one tile doesn't apply to other tiles.

### Fix

1. **Manually refresh the height combination mask**:
   - "Height combination mask is not refresh with UV Tile mask"
   - After changing a UV tile mask
   - Manually refresh the height combination mask
   - Toggle the mask visibility off and on
   - Or re-select the mask layer

2. **Check for overlapping UV spaces manually**:
   - "No error message on overlapping UV spaces with a specific mesh"
   - Don't rely on automatic error detection
   - Check UV layout in the UV view
   - Ensure no tiles overlap
   - Fix overlapping UVs in the modeling software

3. **Fix position map import for UV tile sequences**:
   - "Position maps are not imported correctly" for UV tile sequences
   - Import position maps per-tile
   - Don't use sequence import
   - Or use the naming convention for individual tiles

4. **Apply anchor point alpha to all tiles**:
   - "Anchor point's extracted alpha ignored by other tiles"
   - Create separate anchor points per tile
   - Or manually copy the alpha to other tiles
   - Use a fill layer with the alpha as a mask

5. **Fix single image filling other UV tiles**:
   - "Image sequence with a single image also fills other UV Tiles"
   - Don't use image sequence for a single image
   - Import as a regular image
   - Apply to the specific tile only

6. **Use matching by name suffix carefully**:
   - "Matching by name suffix interpretation is wrong"
   - Check the name suffix matching
   - Ensure names follow the convention
   - Verify the correct textures are matched

7. **Check UV seams after mesh reimport**:
   - "UV seams do not appear after mesh reimport"
   - After reimporting a mesh
   - Check UV seams in the UV view
   - Re-bake if seams are missing

8. **Check displacement export with UV tiles**:
   - "Displacement not exported with specific UV tiles set up"
   - Verify displacement maps are exported for all tiles
   - Check export settings
   - Export per-tile if needed

### Community Report

> "[UV Tiles] Height combination mask is not refresh with UV Tile mask. [UV Tiles] No error message on overlapping UV spaces with a specific mesh. [UV Tile sequence] Position maps are not imported correctly. [UV Tiles] Anchor point's extracted alpha ignored by other tiles. [UV Tiles] Image sequence with a single image also fills other UV Tiles. [Baking] Matching by name suffix interpretation is wrong. [Baking] UV seams do not appear after mesh reimport."

## 5. Export Crash from TDR Timeout or Insufficient Disk Space

### Symptom

Substance 3D Painter crashes while exporting textures. The crash may happen during the export of large texture sets or when exporting to certain formats. In some cases, the project file becomes corrupted after the crash. The crash may also occur when saving a project with insufficient disk space.

### Root Cause

Two main causes: (1) TDR timeout — "The Timeout Detection and Recovery (TDR) is a safety mechanism of Microsoft Windows to prevent a GPU from locking up the system with a never ending computation. This mechanism is unfortunately too restrictive for Substance 3D Painter by default." Exporting large textures involves GPU computation that can exceed the default 2-second TDR limit. (2) "Saving with insufficient disk space can crash or corrupt projects" — if the disk doesn't have enough space for the export files or the project save, the application crashes and may corrupt the project file.

### Fix

1. **Apply the TDR registry fix**:
   - See Problem 2 for detailed TDR fix
   - Set TdrDelay and TdrDdiDelay to 60 seconds
   - Restart the computer
   - This prevents TDR crashes during export

2. **Check disk space before exporting**:
   - "Saving with insufficient disk space can crash or corrupt projects"
   - Check available disk space
   - Ensure at least 2x the expected export size is free
   - Clear temporary files
   - Move projects to a larger drive

3. **Export in smaller batches**:
   - If exporting all texture sets crashes
   - Export one texture set at a time
   - Or export per UV tile
   - This reduces GPU computation time per export

4. **Use CPU export instead of GPU**:
   - If GPU export crashes
   - Switch to CPU-based export
   - Edit > Settings > Export
   - Select CPU as the export engine

5. **Check export format compatibility**:
   - Some formats may cause crashes
   - Try a different export format (PNG, TIFF, EXR)
   - Check if the format supports the texture size
   - Use a smaller texture size if needed

6. **Verify project integrity after crash**:
   - If the project is corrupted after a crash
   - Try opening the backup file
   - Check the autosave folder
   - If the project won't open, use the recovery tool

7. **Clear the export cache**:
   - Delete temporary export files
   - Check `%TEMP%` for Substance Painter files
   - Clear the project cache
   - Restart and try exporting again

8. **Disable viewport display during export**:
   - Close the viewport
   - Or minimize the application
   - This reduces GPU load during export
   - May prevent TDR crashes

### Community Report

> "Painter crashing while exporting. The Timeout Detection and Recovery (TDR) is a safety mechanism of Microsoft Windows to prevent a GPU from locking up the system with a never ending computation. This mechanism is unfortunately too restrictive for Substance 3D Painter by default. For more information see: GPU drivers crash with long computations (TDR crash). Saving with insufficient disk space can crash or corrupt projects."

## 6. Additional Substance Painter Issues

### Compressed GLTF Project Crash

**Issue**: "Creating project with compressed gltf file causes a crash."
**Fix**: Decompress the GLTF file before importing. Use a tool to convert to uncompressed GLTF. Or import as OBJ/FBX instead.

### OBJ Import from Stager Fails

**Issue**: "OBJ meshes from Stager can fail at project creation."
**Fix**: Export OBJ from Stager with compatible settings. Or use FBX format instead. Check OBJ file for unsupported features.

### USD Mesh with No Material Crash

**Issue**: "USD mesh with no material assigned can crash at import."
**Fix**: Assign a material to the USD mesh before importing. Or use a different format. Update to the latest Painter version.

### Device Lost in Baking

**Issue**: "Returning to painting mode after device lost in baking."
**Fix**: "Device lost even with raytracing disabled on Nvidia GTX 10XX series." Update GPU drivers. Disable GPU raytracing. Use CPU baking.

### Members Count Mismatch

**Issue**: "Error 'members count mismatch' when opening project made in previous version."
**Fix**: Update to the latest Painter version. Open the project in the version it was created. Export assets and recreate the project.

### Ribbon Tool Crash

**Issue**: "Using ribbon can cause crashes for some projects."
**Fix**: Update to the latest version. Avoid complex ribbon paths. Use the fill layer instead of ribbon for complex shapes.

### Python Crash on Exit

**Issue**: "Painter crash on exit with leftover Qt widgets."
**Fix**: Close all Python panels before exiting. Update to the latest version. Check for conflicting Python plugins.

### Color Picker Crash

**Issue**: "Using the color picker on different Texture Sets can result in a crash when quitting."
**Fix**: "Crash during startup on Nvidia GTX 10xx series." Update GPU drivers. Avoid using color picker across texture sets. Update Painter.

## Best Practices

1. **Force Painter to use the discrete GPU** — prevents startup crash on multi-GPU systems
2. **Keep GPU drivers updated** — but avoid known problematic versions (441.08, 442.19, 528.09, 572.16-572.42)
3. **Set TdrDelay and TdrDdiDelay to 60 in the registry** — prevents TDR crashes during baking and export
4. **Re-apply TDR settings after Windows/GPU driver updates** — they can reset to defaults
5. **Disable GPU raytracing if baking crashes** — use CPU raytracing as fallback
6. **Update BIOS for Ryzen CPU systems** — fixes multi-threaded baking crashes
7. **Delete corrupted .assbin files** — prevents bake crashes from cached high-poly data
8. **Check UV tile layout manually for overlaps** — automatic detection may miss some cases
9. **Ensure sufficient disk space before export** — prevents crash and project corruption
10. **Export in smaller batches for large texture sets** — avoids TDR timeout during export
