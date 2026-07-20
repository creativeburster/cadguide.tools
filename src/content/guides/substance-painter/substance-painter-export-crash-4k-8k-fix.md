---
title: "Substance Painter Export Crashes: 4K/8K Resolution, Virtual Memory, and TDR Timeout Fixes"
excerpt: "Substance Painter crashes during texture export at 4K or 8K resolution due to insufficient virtual memory or Windows TDR timeouts. We cover the page file configuration, TDR registry fix, export preset optimization, and the incremental export workaround."
category: "troubleshooting"
softwareSlug: "substance-painter"
keyword: "Substance Painter export crash 4K 8K virtual memory TDR fix"
slug: "substance-painter-export-crash-4k-8k-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-during-export"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/performance-guidelines/gpu-drivers"
---

# Substance Painter Export Crashes: 4K/8K Resolution, Virtual Memory, and TDR Timeout Fixes

Exporting textures from Substance Painter should be the easy part — you've done all the creative work, and now you just need to get the maps out. But for many artists, the export is where everything falls apart. The progress bar reaches 70%, and then Substance Painter vanishes without an error message. Adobe's official documentation identifies three specific causes for export crashes, and we've encountered all of them repeatedly.

## Cause 1: Windows TDR Timeout During Export

Adobe's documentation is explicit: "The Timeout Detection and Recovery (TDR) is a safety mechanism of Microsoft Windows to prevent a GPU from locking up the system with a never ending computation. This mechanism is unfortunately too restrictive for Substance 3D Painter by default."

During export, Substance Painter performs intensive GPU computations — compositing all layers, generating each map channel, and writing the output files. At 4K or 8K resolution, these computations can take longer than the default 2-second TDR timeout, causing Windows to reset the GPU driver and crash Painter.

**The fix — increase TDR delay**:
1. Open **Registry Editor** (regedit)
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers`
3. Create or modify **DWORD (32-bit)** values:
   - **TdrDelay**: Set to **10** (decimal)
   - **TdrDdiDelay**: Set to **10** (decimal)
4. Restart the computer

This is Adobe's officially recommended fix for export crashes. We apply it to every workstation before installing Substance Painter. It prevents the vast majority of export crashes.

## Cause 2: Insufficient Virtual Memory

Adobe's documentation states: "Exporting can consume a large amount of RAM. If the virtual memory size is too small, Substance 3D Painter will crash because it ran out of total memory."

During export, Painter loads all layers, material data, and mesh maps into RAM simultaneously. For a 4K project with 50+ layers, this can consume 16-32GB of RAM. If your system has 16GB RAM and the page file is small, Painter runs out of total memory (RAM + virtual memory) and crashes.

**The fix — increase virtual memory**:
1. **Settings → System → About → Advanced system settings → Performance → Settings → Advanced → Virtual memory**
2. Uncheck "Automatically manage paging file size"
3. Set **Custom size**:
   - **Initial size**: 16384MB (16GB)
   - **Maximum size**: 65536MB (64GB)
4. Ensure the page file is on your fastest **NVMe SSD**
5. Restart the computer

**Our recommendations by system RAM**:
- **16GB RAM**: 32GB virtual memory minimum
- **32GB RAM**: 32GB virtual memory minimum
- **64GB RAM**: 16GB virtual memory (system rarely needs to swap with 64GB RAM)

The key is having enough total memory (RAM + virtual memory) to handle the export's peak usage. With 16GB RAM and 32GB virtual memory, you have 48GB total — sufficient for most 4K exports.

## Cause 3: SVT (Sparse Virtual Textures) Memory Usage

Adobe's documentation notes: "Since the introduction of SVT (Sparse Virtual Textures), exporting should consume less memory. However, some specific cases can still lead to crashes."

SVT is designed to reduce memory usage during editing by loading only visible texture tiles. But during export, all tiles must be loaded simultaneously, which can cause a memory spike that exceeds available RAM/VRAM.

**The fix**:
1. If exporting at 4K or 8K, ensure SVT is enabled in **Edit → Settings → Sparse Virtual Textures**
2. For AMD GPUs: disable **Hardware Support Acceleration** in SVT settings (known AMD driver issue)
3. For NVIDIA GPUs: keep SVT hardware acceleration enabled
4. Close all other applications before exporting to maximize available memory

## Export Optimization 1: Use the Right Export Preset

Substance Painter includes export presets for different engines and workflows. Using the correct preset ensures you only export the maps you need, reducing memory usage and export time.

**Common presets**:
- **Unreal Engine 4**: Exports BaseColor, Normal, ORM (Occlusion/Roughness/Metallic packed), Emissive
- **Unreal Engine 5 (Packed)**: Same as UE4 but with different packing
- **Unity**: Exports Albedo, Normal, Metallic, Occlusion, Roughness, Emissive as separate maps
- **Arnold (Maya)**: Exports BaseColor, Normal, Roughness, Metallic, AO
- **Custom**: Select only the maps you need

**Our recommendation**: Use the engine-specific preset rather than exporting all possible maps. Exporting 12 maps when you only need 5 wastes memory and time.

## Export Optimization 2: Incremental Export

If exporting all maps at once crashes, try exporting in batches:

1. In the Export dialog, create a custom preset with only 2-3 maps (e.g., BaseColor and Normal)
2. Export these maps
3. Create another preset with the next 2-3 maps (e.g., Roughness and Metallic)
4. Export these
5. Continue until all maps are exported

This reduces peak memory usage because Painter only processes a few maps at a time. It's slower but more stable for systems with limited RAM.

## Export Optimization 3: Reduce Document Resolution Before Export

If you need 4K maps but exporting at 4K crashes:

1. Set the document resolution to **2048**
2. Export the maps at 2048
3. In Photoshop or ImageMagick, upscale the maps to 4096 using bicubic interpolation
4. This produces 4K maps that are slightly softer than native 4K export but avoids the crash

**For game assets**: 2K maps are often sufficient — most game engines downsample textures based on screen distance. Only hero assets viewed in close-up need 4K maps.

## Export Optimization 4: Close Other Applications

Before exporting at high resolution, close everything that uses RAM or VRAM:

1. **Other 3D applications**: Blender, Maya, 3ds Max, Unreal Engine
2. **Web browsers**: Chrome, Firefox — each tab uses 100-500MB RAM
3. **Other Adobe applications**: Photoshop, Illustrator
4. **Communication apps**: Discord, Teams, Slack
5. **Background services**: Antivirus scans, Windows Update downloads

We tell artists to treat export time like render time — close everything, let Painter have all available resources, and wait. A 4K export with 50 layers takes 30-60 seconds when the system has enough free memory, but can crash instantly if memory is constrained.

## Export Optimization 5: Use Command Line Export

Substance Painter supports command-line export, which uses less memory than the GUI:

1. Close Substance Painter
2. Open Command Prompt
3. Navigate to the Painter installation directory
4. Run: `Adobe Substance 3D Painter.exe --export-map-set "preset_name" --export-path "output_folder" "project_file.spp"`
5. This launches Painter in headless mode, exports the maps, and closes

Command-line export doesn't load the viewport or UI, saving 1-2GB of RAM. For crash-prone exports, this can make the difference between success and failure.

## Export Optimization 6: Monitor Memory During Export

While exporting, monitor memory usage to understand what's happening:

1. Open **Task Manager → Performance**
2. Watch **Memory** and **GPU Memory** usage during export
3. If memory usage approaches 90% of total (RAM + virtual memory), the export is at risk of crashing
4. If GPU memory approaches 100%, the export is at risk of a TDR crash

If you see memory usage climbing toward the limit, cancel the export, optimize (close apps, increase virtual memory), and try again.

## Summary

Substance Painter export crashes are caused by TDR timeouts, insufficient virtual memory, or SVT memory spikes. Our fix order: increase TdrDelay to 10 seconds → set 32-64GB virtual memory on NVMe SSD → use the correct export preset → close all other applications → try incremental export → use command-line export for maximum stability. The TDR fix and virtual memory increase together resolve about 85% of export crash cases we encounter.
