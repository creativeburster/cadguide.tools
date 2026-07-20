---
title: "Lumion Ray Tracing Artifacts: Blotches, Square Pixels, and Reflection Plane Issues"
excerpt: "Lumion's ray tracing mode produces blotchy artifacts, square pixel patterns, and incorrect reflections when settings are misconfigured. I cover the NRD vs OIDN denoiser selection, reflection plane placement, and the quality settings that produce clean ray-traced output."
category: "troubleshooting"
softwareSlug: "lumion"
keyword: "Lumion ray tracing artifacts blotches square pixels reflections fix"
slug: "lumion-ray-tracing-artifacts-blotches-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-24"
sources:
  - "https://support.lumion.com/knowledge-base/rendering-questions"
  - "https://lumion.com/news/performance-improvements-2024"
---

# Lumion Ray Tracing Artifacts: Blotches, Square Pixel Patterns, and Reflection Plane Issues

Lumion's ray tracing feature, introduced in Lumion 2023 and significantly improved through 2024 and 2025, produces stunning realistic reflections and shadows. But it's also prone to artifacts that can ruin an otherwise perfect render. I've spent months working through these issues across multiple projects, and I've developed a systematic approach to eliminating them.

## Artifact Type 1: Blotchy or Patchy Ray-Traced Renders

The most common artifact — the render has patchy, blotchy areas that look like uneven noise, especially on floors, walls, and reflective surfaces.

**Root cause**: Insufficient ray tracing samples. Ray tracing in Lumion uses a limited number of rays per pixel, and when there aren't enough, the result is noisy and blotchy.

**Fix — denoiser selection**:
1. In the **Ray Tracing effect** settings, check the **Denoiser** option
2. **NRD (NVIDIA Real-Time Denoiser)**: Best for NVIDIA RTX cards. It's the most effective denoiser and produces clean results with fewer samples. If you have an RTX card, always use NRD.
3. **OIDN (Open Image Denoise)**: Fallback for AMD and non-RTX NVIDIA cards. Lumion 2024.2+ improved OIDN performance for AMD cards specifically.
4. If blotches persist with the denoiser on, increase the **Sample Count** in the Ray Tracing settings — but this increases render time significantly.

**Key insight from Lumion 2024 updates**: NRD requires fewer samples than OIDN to achieve the same quality. Upgrading to Lumion 2024.x or 2025.x and using NRD can produce clean ray-traced video up to 5x faster than older versions with OIDN.

## Artifact Type 2: Square Pixel Patterns

The render shows a visible grid of square pixels, especially in reflections or on smooth surfaces. This is a distinct artifact from blotchy noise — it looks like a checkerboard pattern overlaid on the image.

**Root cause**: The denoiser is struggling with the sample pattern, producing a structured artifact instead of random noise. This typically happens when the sample count is very low and the denoiser tries to interpolate too aggressively.

**Fix**:
1. Increase the **Sample Count** slightly — going from 1 to 2 samples per pixel often eliminates square pixel artifacts
2. Switch from OIDN to NRD (if you have an RTX card) — NRD handles low sample counts better
3. If the artifact appears only in reflections, reduce the **Reflection Plane** count — too many overlapping reflection planes can cause the ray tracer to produce structured artifacts
4. As a last resort, disable ray tracing for the specific surface by removing its material from the ray-traced reflection list

## Artifact Type 3: Incorrect or Missing Reflections

Reflections appear in wrong places, are missing entirely, or show incorrect geometry.

**Root cause**: Reflection Planes in Lumion define which surfaces act as mirrors. If reflection planes are incorrectly placed or sized, reflections are wrong.

**Fix — Reflection Plane management**:
1. In the **Reflections effect**, check the **Reflection Planes** list
2. Each reflection plane should cover exactly one flat reflective surface (floor, countertop, water)
3. **Remove duplicate or overlapping planes** — I've seen projects with 5 reflection planes all covering the same floor, which causes conflicting reflections
4. **Size the planes precisely** — a reflection plane that extends beyond the actual surface creates reflections in empty space
5. For curved reflective surfaces (like a curved glass wall), use the **Global Reflection** effect instead of reflection planes — reflection planes only work for flat surfaces

**Does increasing reflection plane margins increase render time?** Yes. Lumion's knowledge base confirms that larger reflection plane margins (the area around the plane that also receives reflections) increase the computational load. Keep margins at the default value unless you specifically need wider reflection coverage.

## Artifact Type 4: Ray-Traced Shadows Look Wrong

Ray-traced shadows have hard edges, incorrect penumbra, or show shadow acne (thin lines radiating from the base of objects).

**Fix**:
1. **Shadow acne**: This is a self-shadowing artifact caused by insufficient shadow precision. In the Ray Tracing settings, increase the **Shadow Precision** or **Shadow Bias** slightly.
2. **Hard shadow edges**: Increase the **Sun Shadow Softness** in the Sun effect. Ray-traced sun shadows should have natural softening at the edges.
3. **Incorrect shadow direction**: Check that the **Sun Position** in the Sun effect matches the sun direction in your HDRI (if using one). Mismatched sun positions cause shadows that don't align with the lighting.

## Artifact Type 5: Ray Tracing Not Working at All

The Ray Tracing effect is enabled but the render looks identical to non-ray-traced output — no reflections, no improved shadows.

**Fix — check GPU compatibility**:
1. Ray tracing requires an **NVIDIA RTX card** (RTX 2060 or newer) or an **AMD RX 6000 series or newer**
2. If you have a compatible card, check that the **NVIDIA driver** is up to date — specifically, use the Studio Driver, not Game Ready
3. In Lumion Settings, check that **Hardware-accelerated Ray-Tracing** is enabled
4. If ray tracing causes crashes on an RTX card, try disabling it and using rasterized rendering — some driver versions have bugs that cause ray tracing to fail

**Known driver issue**: Lumion documented a critical issue with NVIDIA driver 580.88 that caused crashes when using Ray Tracing with NRD. The fix was updating to driver 581.08 or newer. Always check Lumion's known issues page before updating drivers.

## Artifact Type 6: Ray-Traced Video Freezes or Looks Strange

When rendering ray-traced video, the MP4 output freezes during playback or shows strange artifacts that weren't visible in the preview.

**Fix**:
1. **Video freeze**: This is usually a memory issue. Ray-traced video requires significantly more VRAM than rasterized video. Reduce the output resolution (1080p instead of 4K) or reduce the scene complexity.
2. **Strange artifacts in video**: Check if the artifacts appear in specific frames. If so, those frames may have complex reflections that the denoiser can't handle. Increase the sample count for video renders.
3. **Background rendering**: Lumion supports background rendering for video. If background rendering causes issues, switch to foreground rendering — it's slower but more stable.

## Optimizing Ray Tracing Settings for Quality vs Speed

My recommended settings based on output type:

**Photo renders (single image)**:
- **Denoiser**: NRD (or OIDN for AMD)
- **Samples**: 4-8 per pixel
- **Reflection Planes**: Only for key reflective surfaces
- **Render time**: 30 seconds to 2 minutes per photo

**Video renders**:
- **Denoiser**: NRD (essential for video — OIDN is too slow for animation)
- **Samples**: 2-4 per pixel (NRD handles low samples well)
- **Reflection Planes**: Minimum necessary
- **Render time**: 1-5 minutes per second of video at 1080p

**Real-time preview**:
- **Denoiser**: NRD
- **Samples**: 1-2 per pixel
- **Reflection Planes**: Disable during editing, enable for preview
- **FPS**: 15-30 with NRD on RTX 4070 or better

## Summary

Lumion ray tracing artifacts are caused by insufficient samples, incorrect denoiser selection, or misconfigured reflection planes. My fix order: enable NRD denoiser (or OIDN for AMD) → increase sample count if blotches persist → check reflection plane placement and remove duplicates → verify GPU compatibility and driver version → reduce resolution or complexity for video renders. With NRD and proper settings, ray-traced output in Lumion 2024+ is dramatically faster and cleaner than earlier versions.
