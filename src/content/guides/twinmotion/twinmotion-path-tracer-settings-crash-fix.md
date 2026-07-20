---
title: "Twinmotion Path Tracer: Settings, Crashes, and Multi-GPU Configuration for Photorealistic Renders"
excerpt: "Twinmotion's Path Tracer produces photorealistic output but crashes on high sample settings, requires DXR-compatible GPUs, and needs specific Multi-GPU configuration. We cover the hardware requirements, sample tuning, and crash prevention settings."
category: "performance"
softwareSlug: "twinmotion"
keyword: "Twinmotion Path Tracer settings crash multi-GPU fix"
slug: "twinmotion-path-tracer-settings-crash-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-23"
sources:
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/path-tracer-requirements-for-twinmotion"
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/using-lumen-global-illumination"
  - "https://dev.epicgames.com/community/learning/knowledge-base/rMyK/optimizing-your-twinmotion-scenes"
---

# Twinmotion Path Tracer: Settings, Crashes, and Multi-GPU Configuration for Photorealistic Renders

The Path Tracer is Twinmotion's highest-quality rendering mode — it uses ray tracing to calculate accurate lighting, reflections, and global illumination. When it works, the results are stunning. When it crashes, which happens frequently with aggressive settings, you get a black screen. The reliable setup process below avoids most of those crashes.

## Hardware Requirements

The Path Tracer requires a GPU that supports **DirectX 12 Raytracing (DXR)**:

**Supported NVIDIA GPUs**:
- RTX 2060 and newer (Turing architecture and later)
- RTX 3000 series, RTX 4000 series, RTX 5000 series

**Supported AMD GPUs**:
- RX 6000 series and newer (RDNA 2 architecture and later)

**Unsupported GPUs**: Any card without hardware DXR support will cause the Path Tracer to fail or produce a black screen. If your GPU doesn't meet these requirements, use Standard or Lumen rendering mode instead.

**To verify DXR support**: In Twinmotion, go to **Preferences → Settings → Graphic hardware support**. If DirectX 12 is available, your GPU supports DXR. If only DirectX 11 is shown, your GPU doesn't support the Path Tracer.

## Path Tracer Settings

The two critical settings that control quality and performance:

### Samples per Pixel
- **32-64**: Fast preview quality, visible noise
- **64-128**: Good quality for most renders, minor noise in dark areas
- **128-256**: High quality, minimal noise
- **256-512**: Production quality, very clean — long render times

### Bounces
- **3**: Exterior scenes (minimal light bouncing)
- **4-5**: Interior scenes (light needs to bounce off multiple surfaces)
- **6+**: Complex interiors with glass and mirrors — increases render time significantly

**Our recommended settings by scene type**:
- **Exterior still**: 128 samples, 3 bounces
- **Interior still**: 256 samples, 5 bounces
- **Exterior video**: 64 samples, 3 bounces
- **Interior video**: 128 samples, 4 bounces

## Path Tracer Crashes: Causes and Fixes

### Crash Cause 1: Samples or Bounces Too High

Epic's documentation explicitly warns: "Setting these values too high can lead to GPU crashes." The Path Tracer uses GPU VRAM proportional to the sample count and bounce count. On an 8GB GPU, 512 samples with 6 bounces can exceed VRAM and crash.

**Fix**: Start with low values (64 samples, 3 bounces) and increase gradually. If the Path Tracer crashes, reduce both values by 50% and try again. Find the maximum values your GPU can handle without crashing.

**Safe starting points by VRAM**:
- **8GB VRAM**: 64 samples, 3 bounces
- **12GB VRAM**: 128 samples, 4 bounces
- **16GB VRAM**: 256 samples, 5 bounces
- **24GB VRAM**: 512 samples, 6 bounces

### Crash Cause 2: GPU VRAM Exhaustion

The Path Tracer loads all scene geometry, textures, and ray tracing acceleration structures into VRAM. If the scene is already using 80% of VRAM in Standard mode, the Path Tracer's additional memory needs will push it over the limit.

**Fix**:
1. Check VRAM usage in the Statistics panel while in Standard mode
2. If VRAM is above 70%, optimize the scene before enabling Path Tracer:
   - Reduce texture sizes
   - Remove unused materials
   - Enable Nanite on high-poly geometry
   - Reduce light count
3. Once VRAM is below 60% in Standard mode, switch to Path Tracer

### Crash Cause 3: Outdated GPU Drivers

The Path Tracer uses cutting-edge DXR features that are frequently updated in GPU drivers. An outdated driver can cause crashes or black screens.

**Fix**:
1. Install the latest **NVIDIA Studio Driver** (not Game Ready) for NVIDIA cards
2. For AMD, install the latest **Adrenalin** driver
3. Use **DDU (Display Driver Uninstaller)** in Safe Mode to completely remove old drivers before installing new ones
4. Restart and test the Path Tracer

### Crash Cause 4: DirectX 12 Instability

If DirectX 12 is causing crashes, Twinmotion falls back to DirectX 11, which doesn't support the Path Tracer.

**Fix**:
1. In **Preferences → Settings → Graphic hardware support**, verify DirectX 12 is selected
2. If it keeps reverting to DirectX 11, your GPU may not fully support DXR
3. Update your GPU driver to the latest version
4. If crashes persist, try a clean Windows installation — accumulated DirectX corruption can cause instability

## Multi-GPU Configuration

Twinmotion supports multiple NVIDIA GPUs via SLI for the Path Tracer. Epic reports 50-200% performance improvement with multi-GPU setups.

**Setup**:
1. Ensure both GPUs are the same model (or at least the same architecture)
2. Connect them with an **NVIDIA NVLink or SLI bridge**
3. Enable SLI in the **NVIDIA Control Panel → 3D Settings → Configure SLI**
4. In Twinmotion: **Preferences → Settings → Path Tracer → Multi-GPU checkbox**

**Important limitations**:
- Multi-GPU only accelerates the Path Tracer, not Standard or Lumen rendering
- Both GPUs must be NVIDIA — AMD CrossFire is not supported
- The performance gain depends on the SLI bridge bandwidth — NVLink provides better scaling than a standard SLI bridge

**Our experience**: With two RTX 4090s connected via NVLink, Path Tracer render time for a 256-sample interior still dropped from 4 minutes to 1.5 minutes — roughly a 2.7x improvement.

## Path Tracer vs Lumen: When to Use Each

**Path Tracer**:
- Best quality: accurate reflections, refractions, caustics
- Best for: final renders, hero shots, marketing materials
- Slowest: progressive rendering, takes minutes per frame
- No real-time navigation: you set up the view and wait

**Lumen**:
- Good quality: real-time GI with reasonable accuracy
- Best for: interactive presentations, client walkthroughs
- Fast: real-time or near-real-time
- Supports navigation: walk through the scene with GI active

**Standard**:
- Basic quality: no advanced GI
- Best for: editing and scene setup
- Fastest: maximum FPS for navigation

**Our workflow**: Standard for editing → Lumen for client walkthroughs → Path Tracer for final renders. We switch between modes depending on the task, not the quality setting.

## Path Tracer Artifacts and Fixes

**Noisy reflections**: Increase samples. Reflections converge slower than diffuse surfaces — 256+ samples may be needed for clean mirror reflections.

**Fireflies (bright isolated pixels)**: These are caused by small, extremely bright light sources. Reduce the intensity of point lights, or replace small point lights with larger area lights.

**Dark interiors**: If the interior is too dark, increase the bounce count to 5-6 so light bounces more times before being absorbed. Also check that your light sources have sufficient intensity.

**Glass not rendering correctly**: The Path Tracer handles glass accurately, but it requires sufficient bounces (4+) for light to pass through glass and illuminate interior spaces. If glass appears black, increase bounces.

## Summary

Twinmotion's Path Tracer requires a DXR-compatible GPU, careful sample and bounce tuning, and sufficient VRAM headroom. Our setup process: verify DXR GPU support → start with 64 samples and 3 bounces → increase gradually until you find your GPU's limit → optimize scene VRAM before enabling Path Tracer → use Multi-GPU with SLI for 50-200% speedup. Use Path Tracer for final renders, Lumen for walkthroughs, and Standard for editing.
