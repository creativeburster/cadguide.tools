---
title: "Lumion Performance Optimization: FPS, Render Times, and Project Complexity Management"
excerpt: "Lumion performance drops when project complexity exceeds GPU capabilities. We cover the Editor Quality settings, effect management, VRAM optimization, and the project complexity audit we run on every struggling workstation."
category: "performance"
softwareSlug: "lumion"
keyword: "Lumion performance slow FPS render time optimization"
slug: "lumion-performance-optimization-fps-render-time"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.lumion.com/knowledge-base/api/v2/help_center/en-us/articles/4403014277010.json"
  - "https://lumion.com/news/performance-improvements-2024"
---

# Lumion Performance Optimization: FPS, Render Times, and Project Complexity Management

The most common Lumion issue in architecture firms is poor performance — single-digit FPS in the editor, long render times, and occasional white-screen freezes. Lumion is a real-time renderer, which means its performance is directly tied to your GPU's ability to process the entire scene at every frame. Unlike offline renderers like V-Ray, you can't just "wait longer" — if the GPU can't handle the scene, it stutters or crashes.

## Understanding Lumion's Performance Model

Lumion's performance depends on three factors:

1. **3D Point Count** — the total number of vertices in all visible geometry
2. **Texture Memory** — the total VRAM used by all textures
3. **Effect Stack** — the number and complexity of active rendering effects

When any of these exceeds your GPU's capacity, performance drops. The key is managing all three simultaneously.

## Optimization 1: Editor Quality and Resolution

The fastest performance gain is reducing the Editor Quality and Resolution during work, then increasing them only for final renders.

**In Settings (gear icon)**:
- **Editor Quality**: Set to 2-star while working. Switch to 3-star only for final render output.
- **Editor Resolution**: Set to 50-75% while working. Set to 100% only for final renders.
- **High-Quality Trees**: Disable while working. Enable only for final renders if needed.

These three settings alone can double your FPS during editing. Since you're spending 90% of your time editing and 10% rendering, optimizing for editing speed is the priority.

## Optimization 2: Manage Library Object Impact

Lumion's library objects are beautiful but expensive. The knowledge base specifically calls out certain object types as high-impact:

**High-impact objects (use sparingly)**:
- **High-quality trees**: Each tree can have 50,000+ polygons. Use standard quality for distant trees and reserve high-quality trees for foreground shots.
- **Animated people and vehicles**: Each animation adds GPU load. Limit to 5-10 animated objects per scene.
- **3D grass**: The grass rendering feature creates millions of blades in real-time. Use it only in close-up shots, not for wide landscape views.
- **Water surfaces**: Animated water with reflections is expensive. Use simple water for large areas and detailed water only for foregrounds.

**Our approach**: We create two versions of each project — a "working" version with standard-quality objects and a "final" version with high-quality objects swapped in for the render. This keeps editing fast while maintaining render quality.

## Optimization 3: Effect Stack Management

Every effect in Lumion's Photo or Movie mode adds GPU load. We've seen projects with 15+ effects active, many of which make no visible difference.

**Our effect audit process**:
1. Open the Effect stack
2. Toggle each effect off one at a time
3. If you can't see a difference, remove it permanently
4. Common unnecessary effects we find:
   - **2-Point Perspective** when the camera is already level
   - **Fog** when it's barely visible
   - **Skylight** when the scene already has good ambient lighting
   - **Depth of Field** with a very wide focus range (effectively no blur)
   - **Lens Flare** at low intensity (invisible but still calculated)

**Expensive effects to use carefully**:
- **Ray Traced Sun Shadows**: Beautiful but expensive. Enable only for final renders.
- **Global Reflection**: Set to **Screen** mode while working, **Ray Traced** only for finals.
- **Atmospheric Clouds**: Use 2D clouds while working, 3D volumetric clouds only for finals.

## Optimization 4: Shadow Performance

The knowledge base mentions a critical shadow setting: **"All shadows rendered at once will drastically reduce Preview performance."** If you have real-time shadows enabled in the Build mode, it can cut your FPS by 50% or more.

**Fix**: Disable real-time shadows in Build mode. To preview shadows, hold **F8** — this temporarily enables shadows without keeping them on permanently.

## Optimization 5: Model Simplification Before Import

The most effective performance optimization happens before the model even reaches Lumion. We work with architects to simplify their Revit and SketchUp models before export:

**Revit simplification**:
- Hide unnecessary categories (furniture, electrical, plumbing) before export
- Use **Coarse** detail level for background buildings
- Disable **Surface Smoothing** for flat surfaces (walls, floors)
- Export only visible elements — don't export the entire model if only part is needed

**SketchUp simplification**:
- Use **Simplify** plugin to reduce polygon count on complex geometry
- Delete hidden geometry that won't be visible in the render
- Reduce curve segments: Window → Model Info → Units → Angle tolerance

## Optimization 6: VRAM Management

Lumion loads all textures into GPU VRAM. If your scene uses more VRAM than your GPU has, Lumion starts swapping to system RAM, which is 10-100x slower.

**VRAM budget by GPU**:
- **8GB VRAM** (RTX 3060/4060): ~15GB project file maximum
- **12GB VRAM** (RTX 3060 12GB/4070): ~25GB project file
- **16GB VRAM** (RTX 4080): ~40GB project file
- **24GB VRAM** (RTX 3090/4090): ~60GB project file

These are rough guidelines — actual limits depend on texture sizes and effect complexity. We monitor VRAM usage with **GPU-Z** or **Task Manager → Performance → GPU** during editing. If VRAM usage exceeds 80% of capacity, we start simplifying.

## Optimization 7: Lumion 2024/2025 Performance Features

Lumion has added significant performance improvements in recent versions:

- **NRD (NVIDIA Real-Time Denoiser)**: Reduces noise in ray-traced previews and renders. Available in Build, Photo, and Movie modes. Enables clean ray-traced results with fewer samples — up to 5x faster ray-traced video rendering.
- **OIDN Denoiser for AMD**: Improved performance for AMD GPU users.
- **Multiple Importance Sampling (MIS)**: Reduces noise on rough surfaces, enabling high-quality renders with fewer samples.
- **VRAM Optimization**: Lumion 2024.4+ reduced VRAM usage by up to 46% for rasterization and 18% for ray tracing.

If you're on an older version of Lumion, upgrading to 2024.4 or 2025.x can provide a significant performance boost without any hardware changes.

## Optimization 8: Output Resolution and Format

For final renders, the output resolution directly affects render time:

- **4K (3840x2160)**: 4x the pixels of 1080p — 4x the render time
- **2K (2560x1440)**: Good balance for most presentations
- **1080p (1920x1080)**: Fastest, sufficient for screen presentations

**Our approach**: Render at 2K for client presentations (sufficient for projector and screen display). Only render at 4K for printed materials or when the client specifically requests it.

For video: render at 1080p/30fps for most presentations. Only go to 4K/60fps for high-end marketing videos.

## Practical Example

A firm came to us with a Lumion project that was running at 3 FPS on an RTX 3070 (8GB VRAM). Here's what we changed:

1. Editor Quality: 3-star → 2-star (FPS: 3 → 7)
2. Editor Resolution: 100% → 50% (FPS: 7 → 12)
3. High-Quality Trees: On → Off (FPS: 12 → 18)
4. Removed 6 unnecessary effects (FPS: 18 → 24)
5. Disabled real-time shadows in Build mode (FPS: 24 → 35)
6. Simplified Revit model — reduced from 800K to 300K polygons (FPS: 35 → 45)

Final result: 3 FPS → 45 FPS. The project was now fully usable for editing, and final renders at 3-star quality looked identical to the original setup.

## Summary

Lumion performance optimization is about managing project complexity within your GPU's capabilities. Our optimization order: reduce Editor Quality and Resolution → audit and remove unnecessary effects → disable real-time shadows in Build mode → simplify models before import → manage VRAM budget → use NRD denoiser for faster ray-traced renders. The biggest gains come from the simplest changes — Editor Quality and effect cleanup alone typically double FPS.
