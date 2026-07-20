---
title: "Corona Renderer Performance: Adaptive Light Solver, GI Settings, and Render Time Optimization"
excerpt: "Slow Corona renders are caused by excessive ray depth, disabled Adaptive Light Solver, or brute-force approaches where the UHD Cache would suffice. We cover the performance tab settings, light solver configuration, and the memory conservation mode for large scenes."
category: "performance"
softwareSlug: "corona-renderer"
keyword: "Corona Renderer performance optimization render time settings"
slug: "corona-renderer-performance-optimization-render-time"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-21"
sources:
  - "https://docs-chaos.atlassian.net/wiki/spaces/CRMAX/pages/124759580"
  - "https://blog.chaos.com/faster-corona-renders-downscaling-guide"
  - "https://cgtips.org/corona-renderer-for-3ds-max-how-to-render-faster-part-3/"
---

# Corona Renderer Performance: Adaptive Light Solver, GI Settings, and Render Time Optimization

We optimize Corona Renderer setups for architecture and product visualization studios, and the most common issue is unnecessarily long render times. Corona's default settings are intentionally conservative — they prioritize quality over speed. But with a few targeted adjustments, you can cut render times by 50-70% without visible quality loss.

## Setting 1: Adaptive Light Solver (Up to 6x Faster)

The Adaptive Light Solver is Corona's most powerful performance feature. Enabled by default since Corona 4, it learns which scene lights are important at each location and allocates more rays to those lights.

**To verify it's enabled**:
1. Render Setup → **Performance tab → Development/Experimental Stuff → Lights**
2. Check **Adaptive light solver** is enabled

**When it helps most**:
- Scenes with 10+ lights (interior scenes with many spotlights)
- Lights with complex shapes (area lights, IES profiles)
- Occluded lights (lights behind furniture or walls)

**Important note from Chaos documentation**: "The state of the Adaptive light solver checkbox is saved in the scene, so if an older scene with the Adaptive light solver disabled is opened in a newer version of Corona Renderer, the Adaptive light solver will remain disabled."

If you're opening an old scene, check this setting — it may still be disabled from a previous Corona version.

**Performance impact**: Chaos reports up to 6x faster renders in scenes with many occluded lights. Even in simple scenes, it provides 1.5-2x speedup.

## Setting 2: Max Ray Depth

Max ray depth controls the maximum number of light bounces. The default works well for most scenes, but adjusting it can improve performance.

**Our recommendations**:
- **Default**: Keep the default for most scenes — the change in Corona is very small compared to other renderers
- **Exterior scenes**: Lowering slightly improves performance with minimal quality impact
- **Glass-heavy interiors**: May need a higher value for light to pass through multiple glass surfaces

Chaos's documentation advises: "Keeping the default value is advised." Unlike V-Ray, where adjusting bounces has a significant impact, Corona's implementation makes this a low-impact setting. Don't waste time tuning it.

## Setting 3: GI vs. AA Balance

This setting controls the ratio of GI samples to anti-aliasing samples per pass. The default of 16 works well for most scenes.

**When to adjust**:
- **GI noise is the main issue**: Increase to 24-32 (more GI samples)
- **Aliasing or DoF/motion blur noise is the main issue**: Decrease to 8-12 (more AA samples)
- **Never go below 2 or above 64** — Chaos explicitly warns against these extremes

**Our typical setting**: We keep 16 for most scenes. For interiors with complex GI, we increase to 24. For product renders with shallow DoF, we decrease to 8-12.

## Setting 4: Light Samples Multiplier (LSM)

LSM controls samples for direct lighting. Default is 2.

**Our usage**:
- **Quick test renders**: LSM 1 (faster, noisier shadows)
- **Production renders**: LSM 2 (default — good balance)
- **Hero shots with clean shadows**: LSM 3-4 (cleaner, slower)
- **Never exceed 4** — significantly increases render time without visible improvement

## Setting 5: Max Sample Intensity (MSI)

MSI controls the maximum brightness of secondary GI samples. Default is 20.

**Performance tuning**:
- **Lower MSI (10-15)**: Faster renders, fewer fireflies, slightly darker reflections
- **Higher MSI (20-30)**: Slower renders, more accurate reflections and caustics, more fireflies
- **MSI 0**: Unbiased mode — not production-ready, noise never clears in some scenes

**Our approach**: We use 15 for most production renders — it's faster than 20 and the reflection difference is negligible. We only increase to 20 for hero shots with critical reflections.

## Setting 6: Noise Limit and Passes

The Noise Limit tells Corona when to stop rendering. Lower values = cleaner = longer render time.

**Our settings**:
- **Test renders**: Noise Limit 5-10% (quick, noisy but usable for checking composition)
- **Production renders with denoiser**: Noise Limit 3-5% (the denoiser cleans up remaining noise)
- **Production renders without denoiser**: Noise Limit 1-2% (clean but slow)

**Max passes**: Set to 0 (unlimited) for production — let the Noise Limit determine when to stop. For interactive rendering, set to 50-100 to prevent infinite rendering.

## Setting 7: Conserve Memory Mode

For scenes that run out of RAM during rendering:

1. Render Setup → **Performance tab → Performance Settings**
2. Enable **Conserve memory (slower)**
3. This reduces peak memory usage by up to 30%
4. Trade-off: rendering is approximately 10-20% slower

**When to use**: Large scenes with heavy geometry (3ds Max Forest Pack, multi-million poly imports) that cause "out of memory" errors. The slower render time is better than a crash.

## Setting 8: Displacement Optimization

Displacement is one of the most expensive operations in Corona. The settings in the Performance tab control how displacement is tessellated:

- **Screen size (px)**: Controls adaptive tessellation — smaller values produce more triangles at render time. Default is 4px.
- **Edge length**: Lower values = more tessellation = slower but smoother
- **Max subdivision**: Limits how many times each triangle can be subdivided

**Our displacement settings**:
- **Test renders**: Screen size 8px (less tessellation, faster)
- **Production renders**: Screen size 4px (default — good balance)
- **Hero close-ups**: Screen size 2px (more tessellation, smoother silhouettes)

## Setting 9: Interactive Rendering Performance

For interactive rendering (region render in the VFB), Corona uses different settings:

1. **Force Path Tracing**: When enabled (default), interactive rendering uses pure path tracing instead of the UHD Cache. This keeps interactive rendering responsive but produces more noise.
2. **Max passes for interactive**: Set to 0 (unlimited) for region rendering — each region should render until you stop it.

**Tip**: Interactive rendering is always noisier than production rendering because it doesn't use the UHD Cache. Don't judge final quality from interactive renders — do a quick production render to see the actual result.

## Setting 10: The Downscaling Method (6x Faster)

Chaos's official blog documents this technique for 6x faster renders:

1. Set resolution to 2x your target (e.g., 4K for a 1080p output)
2. Set Noise Limit to 20-30% (much higher than normal)
3. Enable Intel AI Denoiser at 0.85
4. Set Image Filter to **Tent** in Render Setup → System
5. Render — finishes quickly due to high noise limit
6. Use **Save 50%** in the VFB to downscale to target resolution
7. Downscaling hides the remaining noise

**Example from Chaos**: A render that normally takes 41 minutes finishes in 7 minutes with this method. The quality is comparable because the downscaling at 2x resolution effectively anti-aliases the image while hiding noise.

## Setting 11: Reset to Defaults

Chaos's documentation includes an important reminder: "After a period of experimentation that does not yield satisfactory results and may even slow down render times, resetting the settings to default might be the best and safest option."

If you've tweaked multiple settings and renders are slower than before, reset all performance settings to defaults. The defaults are well-chosen and work for the majority of scenes.

## Practical Example

An architectural interior was taking 35 minutes per frame at 1080p. Here's what we changed:

1. Verified Adaptive Light Solver was enabled (it was disabled from an old scene): 35 min → 12 min
2. Applied downscaling method (4K render, 25% noise limit, denoise, save 50%): 12 min → 5 min
3. Set MSI from 20 to 15: 5 min → 4 min
4. Set LSM from 2 to 1 (sufficient for this scene's lighting): 4 min → 3.5 min

Final result: 35 minutes → 3.5 minutes per frame. The Adaptive Light Solver alone provided a 3x speedup — it had been disabled because the scene was created in Corona 3.

## Summary

Corona render time optimization is about using the right settings for each scene type. Our optimization order: verify Adaptive Light Solver is enabled → apply the downscaling method (2x resolution, high noise limit, denoise, save 50%) → set MSI to 15 → set LSM to 1-2 → use Conserve Memory mode for large scenes → optimize displacement settings → reset to defaults if experimentation makes things worse. The Adaptive Light Solver and downscaling method together provide the biggest gains — up to 10x faster in multi-light interior scenes.
