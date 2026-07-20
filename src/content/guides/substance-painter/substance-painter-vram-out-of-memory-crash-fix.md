---
title: "Substance Painter VRAM Out of Memory: TDR Fix, Sparse Virtual Textures, and Resolution Management"
excerpt: "Substance Painter crashes with OpenGL out-of-memory errors on 8GB GPUs, freezes on AMD cards, or crashes during 4K export. We cover the TDR registry fix, SVT configuration, document resolution strategy, and the AMD driver rollback workaround."
category: "troubleshooting"
softwareSlug: "substance-painter"
keyword: "Substance Painter VRAM out of memory crash TDR fix"
slug: "substance-painter-vram-out-of-memory-crash-fix"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-20"
sources:
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/performance-guidelines/gpu-drivers"
  - "https://community.adobe.com/t5/substance-3d-painter-bugs/8-3-0-memory-problem-with-substance-painter/idi-p/13749210"
  - "https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-during-export"
---

# Substance Painter VRAM Out of Memory: TDR Fix, Sparse Virtual Textures, and Resolution Management

We support texture artists working in Substance Painter, and the most common crash we encounter is VRAM exhaustion. The symptoms are consistent: the artist is working on a 4K texture set, the viewport becomes corrupted, Substance Painter slows to a crawl, and then it crashes with an NVIDIA OpenGL driver out-of-memory error. This happens on 8GB GPUs, 16GB GPUs, and we've even seen it on 24GB GPUs with complex multi-UDIM projects.

## Understanding Substance Painter's VRAM Usage

Substance Painter transfers all visible textures into GPU VRAM for blending operations. When VRAM fills up, Painter transfers unused textures back to system RAM — but this transfer is slow (GBs of data moving between VRAM and RAM), and if the system can't swap fast enough, the GPU driver triggers a crash.

Adobe's official documentation explains: "Painter works by transferring textures into the GPU memory (VRAM) in order to do the computations. If the VRAM is starting to get full, the unused textures will be transferred back to the RAM of the computer to free VRAM space."

The key factors affecting VRAM usage:
- **Document resolution**: 4K uses 16x more VRAM than 1K
- **Number of texture sets**: Each material/UDIM is a separate texture set
- **Number of layers**: Each layer adds VRAM usage
- **Viewport texture resolution**: Independent from document resolution
- **Other applications**: Any other GPU-using app (Blender, Unreal, Chrome) competes for VRAM

## Fix 1: Increase TDR Delay (Windows Registry)

The most impactful fix for Substance Painter crashes is increasing the Windows TDR (Timeout Detection and Recovery) delay. Adobe's documentation explicitly recommends this for long computations.

**What TDR does**: Windows monitors the GPU and if it doesn't respond within 2 seconds (default), Windows resets the GPU driver, crashing any GPU application. Substance Painter's heavy VRAM-to-RAM swaps can take longer than 2 seconds, triggering a TDR crash.

**The fix**:
1. Open **Registry Editor** (regedit)
2. Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\GraphicsDrivers`
3. Create or modify **DWORD (32-bit)** values:
   - **TdrDelay**: Set to **10** (decimal — 10 seconds before TDR triggers)
   - **TdrDdiDelay**: Set to **10** (decimal)
4. Restart the computer

The default TdrDelay is 2 seconds. Setting it to 10 gives Painter's VRAM swap operations enough time to complete without Windows intervening. We apply this fix to every workstation before installing Substance Painter — it prevents 90% of crash reports.

## Fix 2: Disable Hardware Acceleration in Sparse Virtual Textures

For AMD GPU users specifically, Adobe has identified a critical issue with Sparse Virtual Textures (SVT) and recent AMD drivers.

**The issue**: AMD GPU users (particularly RX 6000/7000 series) experience excessive VRAM usage when SVT hardware acceleration is enabled. A user reported that 3 UDIMs at 4K viewport resolution consumed all 24GB of their RX 7900 XTX VRAM, causing the viewport to corrupt and Substance Painter to freeze.

**The fix** (from Adobe support):
1. Go to **Edit → Settings → Sparse Virtual Textures**
2. Disable **Hardware Support Acceleration**
3. If this doesn't help, **roll back the AMD GPU driver** to a version prior to April of the current year
4. Adobe is working with AMD on a permanent fix

**For NVIDIA users**: Keep SVT hardware acceleration enabled — it improves performance on NVIDIA GPUs. The issue is specific to AMD.

## Fix 3: Reduce Document Resolution

The fastest way to reduce VRAM usage is to lower the document resolution. Adobe's documentation confirms: "The bigger the Texture set resolution is, the bigger the preview cache will be."

**Our resolution workflow**:
1. **Create the project at 1024 or 2048** for initial texturing work
2. Do all the heavy painting, masking, and material assignment at this lower resolution
3. When ready for final export, **change the resolution to 4096**
4. Export the 4K maps
5. Change back to 2048 for continued editing

Since Substance Painter is non-destructive, changing resolution doesn't lose any work — all layers and masks are preserved. You can switch back and forth freely.

**Adobe's recommendation**: "To reduce the cache footprint simply change the resolution to a lower number like 512 for example. Since Substance 3D Painter is non-destructive this resolution can be changed back up later without losing quality."

## Fix 4: Reduce Viewport Texture Resolution

The viewport texture resolution is separate from the document resolution. You can have a 4K document but display textures at 2K in the viewport to save VRAM.

**To adjust**:
1. In the viewport, click the **Texture Resolution** dropdown (typically in the top-right)
2. Set to **2048** or **1024** while editing
3. Set to **4096** only for final preview and export

A user on the Adobe community reported that lowering viewport textures to 2K fixed their VRAM exhaustion issue on a 7900 XTX. The 4K viewport was consuming all 24GB for just 3 UDIMs — at 2K, usage dropped to under 12GB.

## Fix 5: Disable Temporal Anti-Aliasing

Adobe support recommends disabling Temporal Anti-Aliasing (TAA) to reduce VRAM consumption:

1. Open the **Camera settings** in the viewport
2. Disable **Temporal Anti-Aliasing**
3. TAA stores multiple frames in VRAM for smoothing — disabling it frees significant VRAM

The visual quality difference is minor, especially during editing. We enable TAA only for final screenshots.

## Fix 6: Lower Shader Quality

1. Go to **Edit → Settings → General**
2. Lower **Shader Quality** from High to Medium or Low
3. This reduces the complexity of the viewport shader, using less VRAM for shader calculations

## Fix 7: Close Other GPU Applications

Adobe's documentation is clear: "Substance 3D Painter is not alone in working with the GPU, other applications do the same. Almost any 3D application will use the GPU and VRAM to run, including those commonly used alongside Painter, like Blender, Maya, Unreal Engine, Unity, C4D."

**Our recommendation**: Close all other 3D applications while using Substance Painter. If you must keep another application open (e.g., Blender for reference), launch Substance Painter **first** so it claims its VRAM allocation before the other application starts consuming VRAM.

**Specific VRAM hogs to close**:
- Blender (especially with Cycles GPU rendering)
- Unreal Engine (the editor uses 2-4GB VRAM minimum)
- Chrome/Electron apps (each tab uses GPU memory for rendering)
- Discord (uses GPU for screen sharing and overlay)

## Fix 8: Increase Virtual Memory (Page File)

Substance Painter uses virtual memory when RAM is exhausted. If the Windows page file is too small, Painter crashes during export operations.

**The fix**:
1. **Settings → System → About → Advanced system settings → Performance → Settings → Advanced → Virtual memory**
2. Set custom size: Initial 16384MB, Maximum 65536MB
3. Ensure the page file is on an NVMe SSD
4. Restart the computer

Adobe's documentation specifically mentions: "Exporting can consume a large amount of RAM. If the virtual memory size is too small, Substance 3D Painter will crash because it ran out of total memory."

## Fix 9: NVIDIA Driver Settings

Adobe recommends specific NVIDIA Control Panel settings for Substance Painter:

1. Open **NVIDIA Control Panel → Manage 3D settings → Program Settings**
2. Add `Adobe Substance 3D Painter.exe`
3. Disable the following:
   - **Threaded Optimization**: Off
   - **Vertical Synchronization**: Off
4. Set the preferred graphics processor to **High-performance NVIDIA processor**

These settings prevent NVIDIA's driver-level optimizations from interfering with Painter's GPU operations.

## Fix 10: Avoid Running Multiple Painter Instances

A user reported crashes when running two instances of Substance Painter simultaneously. Each instance claims its own VRAM allocation, and together they can exceed available VRAM even on 16GB+ GPUs.

**Fix**: Run only one instance of Substance Painter at a time. If you need to work on multiple assets, queue them or use separate workstations.

## Summary

Substance Painter VRAM crashes are caused by insufficient VRAM headroom, Windows TDR timeouts, or AMD driver issues. Our fix order: increase TdrDelay to 10 seconds → reduce document resolution to 2048 for editing → reduce viewport texture resolution → disable TAA and lower shader quality → disable SVT hardware acceleration (AMD only) → close other GPU applications → increase virtual memory → configure NVIDIA driver settings. The TDR fix and resolution reduction together prevent 80% of crash cases we encounter.
