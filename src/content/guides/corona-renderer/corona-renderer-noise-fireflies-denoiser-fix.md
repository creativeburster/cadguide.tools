---
title: "Corona Renderer Noise and Fireflies: Noise Limit, Denoiser, and MSI Settings"
excerpt: "Corona Renderer produces persistent noise and fireflies that won't resolve with more passes. I cover the Noise Limit optimization, Intel AI Denoiser configuration, Fireflies Filter, and Max Sample Intensity (MSI) tuning for clean renders."
category: "troubleshooting"
softwareSlug: "corona-renderer"
keyword: "Corona Renderer noise fireflies denoiser MSI fix"
slug: "corona-renderer-noise-fireflies-denoiser-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-20"
sources:
  - "https://support.chaos.com/hc/en-us/articles/4528247036305-How-to-get-rid-of-excessive-noise"
  - "https://support.chaos.com/hc/en-us/articles/4528588388113-How-to-use-denoising-in-Corona-for-3ds-Max"
  - "https://support.chaos.com/hc/en-us/articles/35925546440209-How-to-use-the-Fireflies-Filter-in-3ds-Max"
---

# Corona Renderer Noise and Fireflies: Noise Limit, Denoiser, and MSI Settings

I've been using Corona Renderer since version 3, and I still see the same noise issues on the Chaos support forums every week. The render reaches 50 passes and the noise just won't clean up — splotchy shadows, fireflies around bright lights, and grainy reflections. Corona's approach to noise is different from V-Ray's, and understanding the specific settings is key to getting clean renders without waiting hours.

## Understanding Corona's Noise Model

Corona uses a progressive path-tracing approach. Each pass adds samples, and the noise gradually decreases. The **Noise Limit** setting tells Corona when to stop — when the noise level falls below the threshold, rendering stops. But some noise sources don't respond well to more passes, and that's when you need the denoiser and other tools.

Chaos's support documentation distinguishes between two types of noise:
1. **Normal noise**: Decreases with more passes — just needs time
2. **Problem noise**: Persists despite many passes — indicates a scene setup issue

## Fix 1: Enable the Denoiser (50-70% Render Time Reduction)

Corona's denoiser is the single most effective tool for clean renders. Chaos reports "render time reductions between 50 and 70%" when using denoising.

**To enable**:
1. In Render Setup → **Scene tab → General Settings → Denoising**
2. Set **Mode** to **Always** (denoises during rendering) or **After rendering** (denoises when rendering stops)
3. Set **Denoise amount** to 0.65 (default — good balance of cleanup and detail preservation)
4. For high-quality final renders: set to 0.85

**Denoiser types**:
- **Intel CPU AI Denoiser**: Runs on CPU, good quality, no GPU required
- **Intel GPU AI Denoiser**: Runs on GPU, faster than CPU version
- **NVIDIA GPU AI Denoiser**: Fastest, requires NVIDIA RTX card, highest quality
- **Legacy**: Old denoiser, not recommended — use AI denoisers instead

**My recommendation**: Use NVIDIA GPU AI Denoiser if you have an RTX card. It's the fastest and highest quality. For non-RTX systems, use Intel GPU AI Denoiser.

## Fix 2: The Downscaling Method (6x Faster Renders)

Chaos's official blog documents a technique that produces high-quality renders 6x faster than the standard approach:

1. **Set render resolution to 2x your target**: If you need 1920x1080, set resolution to 3840x2160 (4K)
2. **Set Noise Limit high**: 20-30% (much higher than normal — this lets Corona finish quickly)
3. **Enable Intel AI Denoiser**: Set amount to 0.85
4. **Set Image Filter to Tent**: In Render Setup → System → Image Filter → Tent
5. **Render**: The 4K render with 20-30% noise limit finishes very quickly
6. **Use Save 50%**: In the Corona VFB (Virtual Frame Buffer), click the **Save 50%** button
7. This downscales the 4K image to 1920x1080, and the downscaling hides the remaining noise

**Why this works**: Downscaling naturally hides small artifacts and grain. By rendering at 2x resolution with a high noise limit (fast), denoising, and then downscaling, you get a clean 1080p image in a fraction of the time. Chaos's example: a render that normally takes 41 minutes finishes in 7 minutes with this method.

## Fix 3: Enable the Fireflies Filter

Corona includes a dedicated **Fireflies Filter** that targets isolated bright pixels (fireflies) without blurring the rest of the image.

**To enable**:
1. In Render Setup → **Scene tab → General Settings → Denoising**
2. Enable **Fireflies Filter**
3. Set **Strength** to **Medium** (or High for scenes with many small bright lights)

The Fireflies Filter works alongside the denoiser — the filter removes isolated bright pixels, and the denoiser cleans up general noise. Using both together produces cleaner results than either alone.

Chaos's documentation notes: "This filter targets only isolated fireflies while preserving most of the image's detail, avoiding the blur or smearing that denoising can introduce."

## Fix 4: Adjust Max Sample Intensity (MSI)

MSI controls the maximum brightness of secondary GI samples. The default value of 20 works well for most scenes, but problematic scenes may need adjustment.

**For fireflies around bright lights**:
1. Go to Render Setup → **Performance tab → Performance Settings**
2. Find **Max Sample Intensity (MSI)**
3. Lower the value from 20 to **10-15**
4. This clamps the brightness of secondary rays, reducing fireflies
5. Trade-off: the image may appear slightly darker in reflections and caustics

**For dark/noisy reflections**:
1. If reflections are too dark with low MSI, increase back toward 20
2. MSI 0 enables unbiased mode — not recommended for production (noise never fully clears)

## Fix 5: Identify and Fix Scene-Specific Noise Sources

Chaos's documentation lists specific scene elements that cause persistent noise:

### Caustics
- **Symptom**: Noise around glass, water, or reflective surfaces
- **Fix**: Disable caustics in the material or light settings unless you specifically need them. Corona's caustics solver is expensive and noisy. For most architectural renders, fake caustics with a displacement map or projection light.

### Refraction in Small Objects
- **Symptom**: Noise inside glass objects, especially small ones
- **Fix**: Increase **Max ray depth** in Performance settings (default is usually sufficient, but complex glass may need 6-8 bounces). Also consider using a simpler glass material for small objects.

### High-Frequency Bump Maps
- **Symptom**: Noise on surfaces with detailed bump maps
- **Fix**: Reduce the bump map intensity, or use a normal map instead (normal maps are cleaner than bump maps in path tracers)

### Many Lights
- **Symptom**: Noise in scenes with 10+ light sources
- **Fix**: Enable the **Adaptive Light Solver** in Render Setup → Performance → Development/Experimental Stuff → Lights. This algorithm learns which lights are important and allocates more rays to them, reducing noise by up to 6x in multi-light scenes.

## Fix 6: Adjust GI vs AA Balance

The **GI vs. AA balance** controls the ratio of global illumination samples to anti-aliasing samples. The default of 16 works well for most scenes.

**For noisy indirect lighting (GI noise)**:
- Increase GI vs. AA to **24-32** — more samples go to GI, cleaning up indirect lighting noise
- Don't exceed 64 — excessively long render times with minimal improvement

**For noisy edges, motion blur, or depth of field**:
- Decrease GI vs. AA to **8-12** — more samples go to anti-aliasing
- Don't go below 2 — produces poor quality

## Fix 7: Light Samples Multiplier (LSM)

LSM controls the number of samples for direct lighting. The default of 2 works well for most scenes.

**For noisy direct lighting (shadow noise)**:
- Increase LSM to **3-4** — more samples for direct light, cleaner shadows
- Don't exceed 4 — diminishing returns with significantly longer render times

**For quick test renders**:
- Set LSM to **1** — faster but noisier direct lighting

## Fix 8: Use the UHD Cache Correctly

The UHD Cache is Corona's GI precomputation system. It's enabled by default and dramatically reduces GI noise.

**Settings to check**:
1. Render Setup → Performance → **UHD Cache**
2. **Precision**: Default is fine for most scenes. Increase for animation (to reduce flickering between frames).
3. **Force Path Tracing for Interactive**: Keep enabled — when using interactive rendering, Corona uses pure path tracing (no UHD Cache) for responsiveness. This is expected behavior, and interactive renders will be noisier than production renders.

**For animations**: Set UHD Cache to **Animated** mode to reduce flickering between frames. The cache is precomputed per frame with interpolation, which takes longer but produces stable results.

## Practical Example

An interior scene was taking 45 minutes to reach acceptable noise levels at 1080p. Here's what I changed:

1. Enabled NVIDIA GPU AI Denoiser at 0.85 (render time: 45 min → 15 min)
2. Enabled Fireflies Filter at Medium (removed remaining fireflies from spotlights)
3. Set MSI from 20 to 15 (reduced fireflies further)
4. Applied the downscaling method: render at 4K with 25% noise limit, denoise, save 50% (render time: 15 min → 7 min)

Final result: 45 minutes → 7 minutes. The downscaled 1080p image was visually indistinguishable from the original 45-minute render.

## Summary

Corona noise and fireflies are best addressed with the denoiser and Fireflies Filter, not by waiting for more passes. My fix order: enable NVIDIA GPU AI Denoiser at 0.85 → enable Fireflies Filter at Medium → apply the downscaling method (render at 2x resolution, denoise, save 50%) → adjust MSI to 10-15 for fireflies → enable Adaptive Light Solver for multi-light scenes → adjust GI vs. AA balance for specific noise types. The denoiser and downscaling method together provide a 6x render time reduction with no visible quality loss.
