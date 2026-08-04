---
title: "Substance Painter 2026 Crash During Export from TDR Timeout and Low Virtual Memory"
excerpt: "Substance Painter 2026 Crash During Export from TDR Timeout and Low Virtual Memory: symptoms, root causes, and step-by-step fixes, verified against Adobe support."
category: "troubleshooting"
softwareSlug: "substance-painter"
keyword: "Substance Painter 2026 crash during export TDR timeout low virtual memory crash while baking GPU raytracing Ryzen CPU BIOS crash insufficient disk space SVT cache freeze export specific projects crash startup NVIDIA GTX 10xx series"
slug: "substance-painter-2026-crash-during-export-from-tdr-timeout-and-low-vi"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-during-export"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-while-baking"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/known-issues"
---

# Substance Painter 2026 Crash During Export from TDR Timeout and Low Virtual Memory, Crash While Baking from GPU Raytracing and Ryzen CPU BIOS, Crash from Insufficient Disk Space and SVT Cache, Freeze on Export from Specific Projects, and Crash on Startup with NVIDIA GTX 10xx Series: TDR Registry Increase, Live Preview Disable, GPU Raytracing Disable, BIOS Update, and Disk Space Cleanup

Substance Painter produces errors from export crashes, baking crashes, disk space issues, export freezes, and startup crashes. This guide covers the 5 most common Substance Painter problems with diagnostic steps and community-verified fixes from Adobe support.

## 1. Crash During Export from TDR Timeout and Low Virtual Memory

### Symptom

Substance 3D Painter crashes while exporting, especially at very high resolution (4K or 8K). The crash occurs during the export process. Sometimes one or two textures can be exported before the crash. The crash is not accompanied by high PC usage spikes.

### Root Cause

"The Timeout Detection and Recovery (TDR) is a safety mechanism of Microsoft Windows to prevent a GPU from locking up the system with a never ending computation. This mechanism is unfortunately too restrictive for Substance 3D Painter by default. Exporting can consume a large amount of RAM, in which case the system will try to fallback on the virtual memory. If the virtual memory size is too small, Substance 3D Painter will crash because it ran out of total memory." Two causes: (1) Windows TDR mechanism kills the GPU process when it takes too long, which is too restrictive for Substance Painter's export computations. (2) Exporting at high resolution consumes large amounts of RAM, and when virtual memory is insufficient, the application crashes.

### Fix

1. **Increase TDR delay in Windows Registry**:
   - "The TDR is a safety mechanism"
   - "Too restrictive for Substance 3D Painter"
   - Increase TdrDelay
   - In registry

2. **Increase virtual memory**:
   - "If the virtual memory size is too small"
   - "Substance 3D Painter will crash"
   - "Because it ran out of total memory"
   - Increase virtual memory

3. **Export at lower resolution**:
   - "Especially at very high resolution"
   - "(such as 4K or 8K)"
   - Export at
   - 2K instead

4. **Close other applications**:
   - Close other
   - Memory-intensive
   - Applications before
   - Exporting

5. **Disable GPU overclocking**:
   - "Overclocked GPUs can often"
   - "Be more unstable"
   - "Disable the overclocking"
   - Disable overclock

6. **Increase system RAM**:
   - Add more RAM
   - To the system
   - For high-resolution
   - Exports

7. **Use SSD for virtual memory**:
   - Use an SSD
   - For the page file
   - To improve
   - Swap performance

### Community Report

> "Some specific cases can lead to Substance 3D Painter crashing while exporting, especially at very high resolution (such as 4K or 8K). The Timeout Detection and Recovery (TDR) is a safety mechanism of Microsoft Windows to prevent a GPU from locking up the system. This mechanism is unfortunately too restrictive for Substance 3D Painter by default. Exporting can consume a large amount of RAM. If the virtual memory size is too small, Substance 3D Painter will crash because it ran out of total memory."

## 2. Crash While Baking from GPU Raytracing and Ryzen CPU BIOS

### Symptom

Substance 3D Painter crashes during the baking process. The crash occurs during texture baking on some configurations. The crash may be related to GPU raytracing or Ryzen CPU multi-threaded computations. The baking process doesn't complete.

### Root Cause

"On some GPU with unstable drivers, the baking process may lead to crashes because of the GPU raytracing feature. The application may crash during the baking process on some computer configuration running with a Ryzen CPU. This is related to multi-threaded computations. Many Motherboard constructors have issued new BIOS updates to fix this issue." Two causes: (1) GPU raytracing with unstable drivers causes crashes during baking. (2) Ryzen CPU multi-threaded computations have a BIOS-level bug that causes baking crashes. Both are hardware/driver-related issues.

### Fix

1. **Disable live preview baking**:
   - "Disable the option"
   - "Enable live preview baking process"
   - "Edit > Settings > General"
   - "Baking Options"
   - Disable live preview

2. **Disable GPU raytracing**:
   - "Uncheck/Disable the option"
   - "Enable GPU raytracing"
   - "Edit > Settings > General"
   - "Baking Options"
   - Disable raytracing

3. **Update BIOS for Ryzen CPUs**:
   - "An update of the BIOS"
   - "Usually fix the problem"
   - "Refer to the Motherboard manual"
   - "And constructor website"
   - Update BIOS

4. **Update GPU drivers**:
   - Update GPU drivers
   - To latest
   - Stable version
   - For baking

5. **Delete incompatible assbin files**:
   - "Simply deleting them"
   - "Should solve the problem"
   - "As they will be regenerated"
   - Delete assbin files

6. **Use CPU baking instead of GPU**:
   - If GPU baking
   - Continues to crash
   - Use CPU
   - Baking instead

7. **Check for overheating**:
   - Monitor GPU and
   - CPU temperatures
   - During baking
   - For overheating

### Community Report

> "Substance 3D Painter may crash during the baking process on some configurations. On some GPU with unstable drivers, the baking process may lead to crashes because of the GPU raytracing feature. The application may crash during the baking process on some computer configuration running with a Ryzen CPU. This is related to multi-threaded computations. Many Motherboard constructors have issued new BIOS updates to fix this issue."

## 3. Crash from Insufficient Disk Space and SVT Cache

### Symptom

Substance 3D Painter crashes due to lack of disk space. The crash occurs when Sparse Virtual Textures (SVT) can't write cache to disk. The application can't transfer and write the cache, leading to a crash. Saving with insufficient disk space can also crash or corrupt projects.

### Root Cause

"Since the introduction of the Sparse Virtual Textures (SVT) Substance 3D Painter can stream out on the disk some cache to balance performances. If there is not enough free space on your disk, it may lead to a crash because the application wasn't able to transfer and write the cache. Saving with insufficient disk space can crash or corrupt projects." The SVT system uses disk space to cache texture data. When disk space is insufficient, the cache write fails, causing a crash. Saving projects with insufficient disk space can also corrupt the project file.

### Fix

1. **Free up disk space**:
   - "If there is not enough free space"
   - "On your disk, it may lead"
   - "To a crash"
   - Free disk space

2. **Move SVT cache location**:
   - "Cache location can be moved"
   - "From the default system"
   - "Temporary files folder"
   - Move cache

3. **Use SSD with sufficient space**:
   - Use an SSD
   - With sufficient
   - Free space for
   - SVT cache

4. **Check disk space before saving**:
   - Verify sufficient
   - Disk space before
   - Saving projects
   - To prevent corruption

5. **Clean up temporary files**:
   - Clean up
   - Temporary files
   - To free
   - Disk space

6. **Monitor disk space during work**:
   - Monitor disk
   - Space during
   - Long painting
   - Sessions

7. **Use external drive for cache**:
   - If internal drive
   - Is full, use
   - An external SSD
   - For SVT cache

### Community Report

> "Since the introduction of the Sparse Virtual Textures (SVT) Substance 3D Painter can stream out on the disk some cache to balance performances. If there is not enough free space on your disk, it may lead to a crash because the application wasn't able to transfer and write the cache. Saving with insufficient disk space can crash or corrupt projects."

## 4. Freeze on Export from Specific Projects

### Symptom

Export from specific projects causes a crash or freeze. The issue is project-specific, not affecting all projects. The freeze occurs during the export process. Some projects can be exported while others cannot.

### Root Cause

"Crash/Freeze: Export from specific projects." Certain project configurations or content cause the export process to hang or crash. This may be due to corrupted project data, specific layer configurations, or incompatible texture set setups that trigger a bug in the export routine.

### Fix

1. **Recreate the project**:
   - Recreate the
   - Problematic project
   - From scratch
   - As workaround

2. **Simplify project layers**:
   - Reduce the number
   - Of layers and
   - Texture sets
   - In the project

3. **Check for corrupted layers**:
   - Check for
   - Corrupted layers
   - Or masks
   - In the project

4. **Export individual texture sets**:
   - Export texture
   - Sets individually
   - Instead of
   - All at once

5. **Update to latest version**:
   - Check if the fix
   - Is included in
   - The latest
   - Version

6. **Check UV tile configuration**:
   - "UV Tiles: No error message"
   - "On overlapping UV spaces"
   - Check UV
   - Tile setup

7. **Report persistent issue**:
   - If issue persists
   - After update
   - Report to
   - Adobe support

### Community Report

> "Crash/Freeze: Export from specific projects. Saving with insufficient disk space can crash or corrupt projects. UV Tiles: No error message on overlapping UV spaces with a specific mesh."

## 5. Crash on Startup with NVIDIA GTX 10xx Series

### Symptom

Substance 3D Painter crashes during startup on machines with NVIDIA GTX 10xx series graphics cards. The crash occurs before the application fully loads. The issue is specific to GTX 10xx series GPUs.

### Root Cause

"Crash: Crash during startup on Nvidia GTX 10xx series." The application's graphics initialization is incompatible with certain NVIDIA GTX 10xx series GPU drivers. The startup graphics engine initialization fails, causing a crash before the application window appears.

### Fix

1. **Update NVIDIA drivers**:
   - Update NVIDIA
   - GTX 10xx drivers
   - To latest
   - Version

2. **Use Studio drivers instead of Game Ready**:
   - Use NVIDIA
   - Studio drivers
   - Instead of Game
   - Ready drivers

3. **Update Substance Painter**:
   - "Crash during startup"
   - "On Nvidia GTX 10xx series"
   - Update to
   - Latest version

4. **Check graphics settings**:
   - Check graphics
   - Settings in
   - Substance Painter
   - Configuration

5. **Use Software OpenGL**:
   - Try launching
   - With software
   - OpenGL as
   - Workaround

6. **Clean install GPU drivers**:
   - Clean install
   - NVIDIA drivers
   - Using DDU
   - (Display Driver Uninstaller)

7. **Report persistent crash**:
   - If crash persists
   - After driver update
   - Report to
   - Adobe support

### Community Report

> "Crash: Crash during startup on Nvidia GTX 10xx series. Crash: Using the color picker on different Texture Sets can result in a crash when quitting the application. Performance: Performance issue when painting in project with many layers."

## 6. Additional Substance Painter Issues

### Compressed GLTF Project Crash

**Issue**: "Creating project with compressed glTF file causes a crash."
**Fix**: Use uncompressed GLTF files. Decompress GLTF before import. Update to latest version.

### Select Export Mesh When Mesh Failed to Load

**Issue**: "Crash: Select Export mesh when mesh failed to load."
**Fix**: Verify mesh is properly loaded before export. Don't select Export mesh if mesh failed. Reload mesh before export.

### Device Lost in Baking

**Issue**: "Crash: Returning to painting mode after device lost in baking."
**Fix**: Don't switch to painting mode during baking. Wait for baking to complete. Check GPU stability.

### Assbin File Crash

**Issue**: "Crash: Baking crash when .assbin file can't be written in folder."
**Fix**: Check folder write permissions. Delete old .assbin files. Verify disk space for .assbin files.

### Ribbon Tool Crash

**Issue**: "Crash: Using ribbon can cause crashes for some projects."
**Fix**: Avoid ribbon tool if crashes occur. Update to latest version. Check ribbon tool settings.

### Material Channel Output Mask Crash

**Issue**: "Crash: Changing a material channel output in a mask can crash."
**Fix**: Save before changing material channel outputs in masks. Update to latest version. Check mask configuration.

### USD Mesh Import Crash

**Issue**: "Crash: USD mesh with no material assigned can crash at import."
**Fix**: Assign material to USD mesh before import. Update to latest version. Check USD file for missing materials.

### OBJ Import Issues

**Issue**: "Import: OBJ meshes from Stager can fail at project creation. Import: OBJ has missing face in some cases."
**Fix**: Check OBJ file format. Verify OBJ from Stager compatibility. Use alternative format if OBJ fails.

### Python Crash on Exit

**Issue**: "Crash: Painter crash on exit with leftover Qt widgets."
**Fix**: Close all Python Qt widgets before exit. Update to latest version. Check Python scripts for leftover widgets.

### macOS Saving Crash

**Issue**: "Crash: Saving project from previous version always crash on MacOS."
**Fix**: Update to latest version. Save as new project instead of overwriting. Check macOS compatibility.

## Best Practices

1. **Increase TDR delay in Windows Registry for export crashes** — prevents GPU timeout during export
2. **Increase virtual memory for high-resolution exports** — prevents out of memory crash
3. **Disable live preview baking and GPU raytracing** — prevents baking crashes
4. **Update BIOS for Ryzen CPU multi-threaded baking crashes** — motherboard constructors have fixes
5. **Free up disk space for SVT cache** — prevents cache write failure crash
6. **Move SVT cache to SSD with sufficient space** — improves cache performance
7. **Update NVIDIA drivers to Studio version for GTX 10xx** — prevents startup crash
8. **Delete incompatible .assbin files before rebaking** — prevents baking crash from old files
9. **Save projects with sufficient disk space** — prevents project corruption
10. **Export at lower resolution if 4K/8K crashes** — reduces memory consumption
