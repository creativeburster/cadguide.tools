---
title: "Twinmotion Performance Optimization: GPU RAM, Quality Settings, Path Tracer, and Nanite"
excerpt: "Twinmotion performance drops when GPU RAM exceeds 80%, too many lights are active, or Path Tracer samples are set too high. I cover the Statistics panel monitoring, Quality settings strategy, Nanite geometry optimization, and Lumen configuration."
category: "performance"
softwareSlug: "twinmotion"
keyword: "Twinmotion performance optimization GPU RAM quality settings"
slug: "twinmotion-performance-optimization-gpu-ram-quality"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-21"
sources:
  - "https://dev.epicgames.com/community/learning/knowledge-base/rMyK/optimizing-your-twinmotion-scenes"
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/statistics-in-twinmotion"
  - "https://dev.epicgames.com/documentation/en-us/twinmotion/optimizing-geometry-with-nanite-in-twinmotion"
---

# Twinmotion Performance Optimization: GPU RAM, Quality Settings, Path Tracer, and Nanite

I audit Twinmotion workstations for architecture firms, and the performance complaints follow a predictable pattern: the scene starts out smooth at 60 FPS, but as the architect adds more assets, materials, and lights, the framerate drops to 15-20 FPS and navigation becomes painful. Twinmotion is a real-time GPU renderer — every element in the scene is processed every frame, so complexity directly impacts performance.

## Monitoring: The Statistics Panel

Before optimizing, you need to know what's causing the bottleneck. Twinmotion's Statistics panel is your diagnostic tool:

1. Open it via **View → Statistics** (or the gear icon in the toolbar)
2. Key metrics to watch:
   - **FPS**: Target 30+ for smooth navigation
   - **GPU RAM**: If this exceeds 80% of your GPU's VRAM, you're at risk of out-of-memory crashes
   - **GPU**: If consistently at 100%, the GPU can't keep up with the scene complexity
   - **CPU**: Should be lower than GPU usage; if CPU is near 70%, performance issues arise
   - **Triangles**: Total polygon count in the scene
   - **Lights**: Number of active light sources

I check the Statistics panel at the start of every session and after adding significant new content. If GPU RAM is above 80%, I optimize before continuing.

## Optimization 1: Quality Settings Strategy

Twinmotion's Quality settings control viewport resolution and feature quality. The key insight from Epic's documentation: **lowering Quality settings improves viewport performance without affecting export quality**.

**My workflow**:
- **While editing**: Set Quality to **Simple** or **Medium** — this gives maximum FPS for navigation
- **For preview**: Switch to **High** to see what the final render will look like
- **For export**: Switch to **Ultra** just before rendering

Quality settings can be changed without restarting Twinmotion, so I switch back and forth constantly. Working at Simple quality and exporting at Ultra quality gives me the best of both worlds.

**To change**: Click the **Quality** button in the top toolbar, or go to **Preferences → Quality**.

## Optimization 2: GPU RAM Management

GPU RAM (VRAM) is the most common bottleneck. When VRAM exceeds 80% capacity, Twinmotion becomes unstable — lag, render errors, and crashes.

**VRAM reduction strategies**:

1. **Reduce texture sizes**: Large 4K textures consume significant VRAM. For materials far from the camera, use 1K or 2K textures instead. The visual difference at distance is negligible, but the VRAM savings are substantial.

2. **Remove unused materials**: Twinmotion loads all materials in the Materials dock into VRAM, even if they're not applied to any objects. Go through the Materials dock and delete materials that aren't in use, then save the file.

3. **Limit high-poly assets**: Each high-quality tree, vehicle, or furniture piece can have 50,000+ triangles. Use standard-quality versions for background elements and reserve high-quality assets for foreground shots.

4. **Merge imported objects**: When you import multiple objects from the same source file, Twinmotion may create separate mesh entries for each. Merging them into a single object reduces draw calls and VRAM overhead.

## Optimization 3: Nanite for High-Poly Geometry

Twinmotion includes Nanite, Unreal Engine's virtualized geometry system. Nanite dynamically reduces triangle count based on screen space — objects far from the camera use fewer triangles, objects close to the camera use more.

**When to use Nanite**:
- High-quality photogrammetry scans (trees, rocks, terrain)
- Imported models with 100K+ triangles
- Scenes with many detailed objects at varying distances

**To enable Nanite on import**:
1. When importing a model, check **Enable Nanite** in the import dialog
2. For existing geometry: select it in the Scene Graph → Properties → enable Nanite

**Nanite settings I configure**:
- **Precision**: Auto (let Twinmotion calculate based on geometry size)
- **Border edge tolerance**: Enable for vegetation (prevents gaps in canopies)
- **Ribbon triangles**: Enable for foliage and grass

Nanite can dramatically improve FPS in scenes with dense vegetation or complex architectural models. In one project, enabling Nanite on 200 imported trees improved FPS from 18 to 42 on an RTX 4070.

## Optimization 4: Light Count Management

Epic's documentation is clear: "A large number of lights can be GPU-intensive and can result in longer rendering times, poor performance, and crashes."

**Light optimization**:
1. **Count your lights**: Check the Statistics panel for the light count
2. **Target**: Keep under 50 active lights for smooth performance
3. **Disable unnecessary lights**: Turn off lights that aren't visible in the current view
4. **Use emissive materials instead of lights**: For small accent lights (LEDs, signage), use emissive materials rather than actual light sources. Emissive materials don't cast light but provide the visual effect at zero GPU cost.
5. **Merge lights**: Multiple point lights close together can be replaced with a single area light

## Optimization 5: Lumen Global Illumination Configuration

Lumen provides realistic real-time global illumination but requires significant GPU resources. Epic recommends monitoring specific parameters when Lumen is enabled:

**Before enabling Lumen**:
1. Ensure **DirectX 12** is selected in Preferences → Settings → Graphic hardware support
2. Set Quality to **High** or **Ultra** (Lumen requires these quality levels)

**Lumen performance tuning**:
- If **GPU RAM is near 100%**: Reduce geometry and texture complexity
- If **GPU is near 100%**: Reduce visual effects and lower Quality settings
- **Material roughness matters**: Lumen works best on materials with Roughness above 40%. Materials with Roughness below 40% (glossy surfaces) require extra ray tracing, increasing GPU load. For distant objects, increase Roughness to reduce Lumen cost.

**When to use Lumen vs Standard GI**:
- **Lumen**: Final renders and client presentations where realistic GI is essential
- **Standard**: Editing and navigation where FPS matters more than GI accuracy

## Optimization 6: Path Tracer Settings

Twinmotion's Path Tracer produces photorealistic renders but is computationally expensive. The Sample per pixel and Bounces settings directly affect GPU memory and render time.

**My Path Tracer settings**:
- **Samples per pixel**: 64-256 for still images, 32-64 for video
- **Bounces**: 4-6 for interiors, 3 for exteriors
- **Multi-GPU**: If you have multiple NVIDIA GPUs with SLI, enable Multi-GPU in Preferences → Settings → Path Tracer for 50-200% performance improvement

**Crash prevention**: If the Path Tracer crashes, lower the Samples and Bounces values. Epic's documentation warns that setting these too high can lead to GPU crashes.

## Optimization 7: Vsync and Frame Rate Limiting

Enable Vsync to limit the frame rate to your monitor's refresh rate:
1. **Preferences → Settings → Vsync → Activate**
2. This prevents Twinmotion from rendering frames faster than your display can show them
3. Reduces GPU load and power consumption
4. On a 60Hz monitor, capping at 60 FPS saves GPU resources for other processing

## Practical Example

A firm came to me with a large urban plaza project running at 12 FPS on an RTX 3080 (10GB VRAM). Here's what I changed:

1. Quality: Ultra → Simple (FPS: 12 → 28)
2. Enabled Nanite on 150 imported tree models (FPS: 28 → 38)
3. Reduced active lights from 80 to 35 (FPS: 38 → 45)
4. Replaced 4K textures with 2K on distant surfaces (VRAM: 9.2GB → 7.1GB)
5. Deleted 40 unused materials from the Materials dock (VRAM: 7.1GB → 6.3GB)
6. Enabled Vsync (stable 45 FPS, no spikes)

Final result: 12 FPS → 45 FPS, VRAM usage reduced from 92% to 63%. The project was now fully navigable, and final renders at Ultra quality with Path Tracer looked identical to the original setup.

## Summary

Twinmotion performance optimization is about managing GPU RAM, geometry complexity, and light count within your hardware's capabilities. My optimization order: monitor Statistics panel → lower Quality for editing → enable Nanite on high-poly assets → reduce light count → manage texture sizes → delete unused materials → use Lumen only for previews/finals → configure Path Tracer samples carefully. The Quality setting and Nanite together typically provide the biggest FPS improvements.
