---
title: "Corona Renderer Fireflies HDRI Noise and Displacement Flicker"
excerpt: "Corona Renderer Fireflies HDRI Noise and Displacement Flicker: symptoms, root causes, and step-by-step fixes, verified against Chaos Forums."
category: "troubleshooting"
softwareSlug: "corona-renderer"
keyword: "Corona Renderer fireflies small sun disk reflections highlight clamping HDRI noisier Sun Sky Light Samples Multiplier displacement flicker animation Screen Size World Size NaN errors Chrome material HDRI CoronaColorCorrect Corona 11 Interactive Render clean Production fireflies denoiser not enabled"
slug: "corona-renderer-fireflies-hdri-noise-and-displacement-flicker"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://forums.chaos.com/t/fireflies/158007"
  - "https://forums.chaos.com/t/flickering-with-hdri/156122"
  - "https://forums.chaos.com/t/noise-on-bump-nan-error-window-on-viewport-ir/157383"
---

# Corona Renderer Fireflies HDRI Noise and Displacement Flicker: Fireflies from Small Sun Disk Reflections Requiring Larger Sun Disk or Highlight Clamping, HDRI Lighting Noisier than Corona Sun Sky from Difficult Sphere Sampling Requiring Light Samples Multiplier, Displacement Flicker in Animation from Screen Size Mode Requiring World Size, NaN Errors from Chrome Material with HDRI and CoronaColorCorrect in Corona 11, and Interactive Render Clean but Production Render Fireflies from Denoiser Not Enabled in Production

Corona Renderer's fireflies, HDRI noise, displacement flicker, and NaN errors produce rendering artifacts from sampling difficulty, mode settings, and material bugs. This guide covers the 5 most common Corona Renderer problems with diagnostic steps and community-verified fixes from Chaos Forums.

## 1. Fireflies from Small Sun Disk Reflections

### Symptom

Persistent fireflies in the scene that don't resolve with higher AA values or render quality. Fireflies appear with both Corona Sky and HDRI lighting. High Render Quality denoising only leads to more fireflies. LightMix values are not higher than 1. Fireflies are worst when only sky is visible.

### Root Cause

A very small light source (the sun disk) reflects/refracts in various materials, creating firefly artifacts. The small angular size of the sun makes it extremely difficult for the sampler to resolve cleanly. Highly reflective surfaces amplify the problem. This is a fundamental sampling challenge, not a bug.

### Fix

1. **Make the sun disk larger or softer**:
   - "Adjusting the lighting — making the sun disk larger or 'softer' — blurring it a bit"
   - In Corona Sun settings, increase the sun disk size
   - This makes the sun easier to sample
   - "The number of fireflies has been considerably reduced"

2. **Use Highlight Clamping**:
   - Set Highlight Clamping to 0.5 to eliminate fireflies
   - "If I set the value to 0.5, fireflies disappear"
   - Trade-off: "The glare and reflections are also eliminated"
   - Use values between 0.1 and 0.4 as a compromise

3. **Render at least 50 passes per frame**:
   - "If you are still getting fireflies after ~50 passes, that could mean your scene is built with some kind of mistake"
   - For animation, use at least 50 passes
   - "You probably need to render at least 50 passes per frame, definitely not less"

4. **Check for highly reflective surfaces**:
   - "It could be a highly reflective surface reflecting some strong light"
   - Reduce reflectivity of problematic materials
   - Use Fresnel reflections instead of constant reflectivity
   - Check for materials with IOR values that create perfect mirrors

5. **Check light intensity**:
   - "A light with too high intensity" can cause fireflies
   - Verify LightMix values are not above 1
   - Use realistic light intensities (lumens, watts)

6. **Use a 3rd party denoiser or firefly removal tool**:
   - "Use a 3rd party denoiser or firefly removal tool"
   - NVIDIA OptiX denoiser or Intel Open Image Denoise
   - Post-process in compositing software (Nuke, After Effects)

7. **Lower Max Sample Intensity (MSI)**:
   - "Lowering the MSI to a lower value — 1 or 2 — could help"
   - MSI controls how many samples are spent on bright spots
   - Lower MSI = fewer samples on fireflies = less visible

### Community Report

> "This type of fireflies is expected since a very small light source (sun) reflects/refracts in various materials. I would advise either adjusting the lighting (making the sun disk larger or softer) or using a 3rd party denoiser."

## 2. HDRI Lighting Noisier than Corona Sun Sky

### Symptom

Lighting a scene with HDRI introduces more noise than using Corona Sun & Sky system. The HDRI-lit scene requires more render time to achieve the same noise level. Even after cranking up the denoiser, HDRI scenes remain noisier.

### Root Cause

Sampling an HDRI sphere is more computationally difficult than sampling a known quantity like the Corona Sun & Sky system. The HDRI has varying brightness across the sphere, requiring more samples to resolve. Some HDRI maps are particularly "wicked" and need special treatment.

### Fix

1. **Increase Light Samples Multiplier**:
   - "Increasing the Light Samples Multiplier to something like 4"
   - "The lighting generated by the environment and other light sources should render less noisy faster"
   - Trade-off: "at the cost of other effects like GI or glossy surfaces"
   - Default is 2, try 4 for HDRI-heavy scenes

2. **Use Corona Sun & Sky instead of HDRI**:
   - For interiors, Corona Sun & Sky is cleaner
   - "I still use HDRIs to this day for interiors although the big problem is you can't just be like 'yo, make the sunlight more diffuse'"
   - Use HDRI only when you need specific lighting from a captured environment

3. **Choose a clean HDRI map**:
   - "Some can be quite 'wicked' and need a bit of TLC"
   - Test different HDRI maps
   - Some maps produce more noise than others
   - Use high-quality HDRI maps from reputable sources

4. **Use Corona Sky with custom sun position**:
   - Corona Sky is optimized for Corona's sampler
   - Adjust sun position and size for desired lighting
   - Add Corona Lights for additional fill
   - This is cleaner than HDRI for most scenarios

5. **Render longer or use denoiser**:
   - "Unless you're rendering long animation where every saved second counts, it doesn't matter if HDRI is slightly noisier"
   - "You just render few minutes longer, or use denoiser"
   - Choose the method that brings you closer to the desired result

6. **Check HDRI resolution**:
   - "In Corona the resolution of the HDRI doesn't matter (or not much)"
   - The issue is sampling difficulty, not resolution
   - Don't waste time trying higher resolution HDRIs
   - Focus on Light Samples Multiplier instead

### Community Report

> "Yes, HDRI is noisier. It has to do with how much more difficult sampling an HDRI sphere is compared to a known quantity type setup such as the Corona Sun & Sky system. Increasing the Light Samples Multiplier to 4 should help."

## 3. Displacement Flicker in Animation from Screen Size Mode

### Symptom

Animation rendered with Corona shows flickering on displaced surfaces (tree branches, ground textures). The displacement appears to "dance" between frames. The flickering is most obvious on detailed displacement like tree bark or ground texture.

### Root Cause

Corona's displacement mode is set to "Screen Size" by default. Screen Size calculates displacement based on the camera's screen resolution. Each frame has a different camera position, so the displacement is calculated differently for each frame. This creates a "dancing" effect as the displacement changes between frames.

### Fix

1. **Change displacement mode to "World Size"**:
   - "Use world size instead to 'lock' the displacement in place and avoid flicker"
   - In Performance Settings > Displacement
   - Change from "Screen Size" to "World Size"
   - This locks displacement to world coordinates, not screen coordinates

2. **Check CoronaDisplacementMod modifier settings**:
   - "The tree had CoronaDisplacementMod modifier and it was still set to 'Screen size' in the modifier settings"
   - The modifier overrides the global displacement settings
   - Change the modifier to "World Size" as well
   - Or simply delete the modifier to use global settings

3. **Lower noise level limit for animation**:
   - "I lowered the noise level limit and raised the precision for the animation"
   - This increases render quality per frame
   - "The rendering (about 30% longer) was much better — acceptable"
   - Use noise level limit of 1-2% for animation

4. **Use consistent render settings**:
   - Don't change render settings between frames
   - Use the same GI solver (UDH Cache/Calculate Scratch for animation)
   - Use the same denoiser settings
   - Inconsistent settings cause frame-to-frame flickering

5. **Verify displacement map resolution**:
   - Low-resolution displacement maps cause stepping artifacts
   - Use at least 2K displacement maps for close-up shots
   - Use 4K+ for hero objects with visible displacement

6. **Test with a short frame range first**:
   - Render 5-10 frames to check for flickering
   - If flickering is present, adjust displacement mode
   - Don't render the full animation before testing

### Community Report

> "You were using displacement with screen size. This will cause flicker in displacement as displacement will be calculated for each frame with different 'seed.' Use world size instead to 'lock' the displacement in place. The tree had CoronaDisplacementMod modifier still set to 'Screen size' — set it to world size in the modifier settings too."

## 4. NaN Errors from Chrome Material with HDRI in Corona 11

### Symptom

NaN (Not a Number) error window appears during viewport Interactive Rendering (IR). The error occurs when:
- A CoronaPhysicalMtl is set to "Chrome" preset
- HDRI is connected to a CoronaColorCorrect as light source
- The error appears at every change in the VFB, even after removing HDRI or changing material

NaN errors are more frequent since Corona 11 and 11 HF1. They happen during IR, denoising phase, and even in gray material mode. The more complex the scene and the longer you work, the more frequent the errors.

### Root Cause

A bug in Corona 11's handling of Chrome material with HDRI lighting through CoronaColorCorrect. The combination creates a computation that produces NaN values (infinite or undefined numbers). Once triggered, the NaN state persists in the scene even after removing the triggering elements. This is a confirmed bug in Corona 11/11.1.

### Fix

1. **Don't use Chrome preset with HDRI + CoronaColorCorrect**:
   - The combination of Chrome material preset + HDRI + CoronaColorCorrect triggers NaN
   - Use a different material preset (e.g., custom metal)
   - Or connect HDRI directly without CoronaColorCorrect

2. **Don't use LightMix as a workaround**:
   - "Only solution working is not to use LightMix — which is not a pleasant thing"
   - LightMix may trigger or worsen NaN errors
   - Disable LightMix if NaN errors persist

3. **Save and restart the scene**:
   - "If I save the scene, it remains plagued by this problem"
   - The NaN state persists in the saved file
   - Start a new scene and import objects
   - Or use "Save As" to create a clean copy

4. **Use VFB IR instead of viewport IR**:
   - "I'm not getting the error on the VFB IR"
   - The viewport IR triggers NaN more frequently
   - Use the VFB (Virtual Frame Buffer) for Interactive Rendering
   - This avoids the viewport IR bug

5. **Downgrade to Corona 10**:
   - "NaNs are now happening to me on both my computers with Corona 11"
   - "The same thing happens in 11.1 Corona"
   - If the issue is critical, use Corona 10
   - Wait for a fix in Corona 11.2 or later

6. **Report to Chaos support**:
   - "I was able to repro the same issue on my end with 3ds Max 2023 and 2024 + Corona 11 HF 1"
   - Chaos has confirmed the bug
   - Submit a support ticket with the scene file
   - Track the fix in Corona release notes

7. **Avoid importing models with metal materials from Corona Cosmos**:
   - "I imported some models with metal materials from Corona Cosmos — then the NaN was there every time"
   - Some Cosmos assets trigger NaN
   - Check imported materials for Chrome presets
   - Replace with custom metal materials

### Community Report

> "I apply a CoronaPhysicalMtl with the 'Chrome' preset. If I put an HDRI connected to a CoronaColorCorrect as a light source, I get the NaN message. It appears at every change in the VFB, even if I remove the HDRI or change the material. N aN errors are more frequent since Corona 11."

## 5. Interactive Render Clean but Production Render Has Fireflies

### Symptom

Interactive Rendering (IR) in Corona shows a clean image with no fireflies. But when launching Production Rendering, the frames appear with lots of noise and fireflies. The same render settings are used for both.

### Root Cause

The AI denoiser is enabled during Interactive Rendering but not during Production Rendering. IR automatically applies denoising to the viewport display. Production Rendering doesn't apply denoising by default — it must be explicitly enabled in the render settings.

### Fix

1. **Enable the same denoiser in Production Rendering**:
   - "To me it looks like you have one of the AI denoisers enabled when doing Interactive Rendering whereas the final renders are without any denoising"
   - "If you want to have a matching image to the IR one, enable the same denoiser for your final renders"
   - In Render Settings > Denoising, enable the denoiser
   - Use the same denoiser type as IR (NVIDIA OptiX, Intel OIDN, or Corona High Quality)

2. **Use default render settings**:
   - "Please revert your performance render settings to defaults — GI/AA balance to 16, light samples multiplier to 2"
   - "With Corona, you should generally use the default render settings"
   - "Usually there is no need to change them"
   - Non-default settings can cause unexpected behavior

3. **Render enough passes**:
   - "What is your render time per frame? What kind of limit are you using?"
   - "You probably need to render at least 50 passes per frame, definitely not less"
   - Use pass limit, not time limit, for consistent quality

4. **Check denoiser settings match**:
   - Verify the denoiser type matches between IR and Production
   - NVIDIA OptiX: fast, GPU-based
   - Intel OIDN: balanced, CPU/GPU
   - Corona High Quality: slowest, highest quality
   - Different denoisers produce different results

5. **Use Highlight Clamping for animation**:
   - For animation, set Highlight Clamping to 0.5
   - This eliminates fireflies that the denoiser might miss
   - Trade-off: reduced glare and bloom effects
   - Compensate with post-processing bloom

### Community Report

> "If I use Corona's interactive rendering mode, the image appears clean and perfect. But when I launch 'Start Production Rendering,' the frames appear with a lot of noise and fireflies. You have one of the AI denoisers enabled when doing IR whereas the final renders are without any denoising."

## 6. Additional Corona Renderer Issues

### Caustics Flickering with HDRI

**Issue**: Caustics-like flickering on branches with HDRI animation.
**Fix**: Lower noise level limit. Raise precision for animation. Use UDH Cache/Calculate Scratch as secondary solver. Increase Light Samples Multiplier.

### Bump Map Noise with NaN

**Issue**: Noise on bump maps triggers NaN error in viewport IR.
**Fix**: Use VFB IR instead of viewport IR. Check bump map resolution. Avoid Chrome material with HDRI. Downgrade to Corona 10 if issue persists.

### LightMix Triggers NaN

**Issue**: Enabling LightMix causes NaN errors in Corona 11.
**Fix**: "Only solution working is not to use LightMix." Disable LightMix. Use separate render passes instead. Wait for Corona 11.2+ fix.

### CoronaBitmap Slow Save

**Issue**: Files with CoronaBitmaps take 20 seconds to save vs 1 second with standard Bitmaps.
**Fix**: Convert CoronaBitmaps to standard Bitmaps using Corona Scene Converter. See the 3ds Max guide for details.

## Best Practices

1. **Make sun disk larger or softer** — reduces fireflies from small light source
2. **Set Highlight Clamping to 0.5 for animation** — eliminates fireflies
3. **Render at least 50 passes per frame** — minimum for clean animation
4. **Increase Light Samples Multiplier to 4 for HDRI** — reduces HDRI noise
5. **Use World Size displacement for animation** — prevents dancing displacement
6. **Check CoronaDisplacementMod modifier settings** — may override global settings
7. **Avoid Chrome preset + HDRI + CoronaColorCorrect** — triggers NaN in Corona 11
8. **Use VFB IR instead of viewport IR** — avoids NaN errors
9. **Enable denoiser in Production Rendering** — matches IR quality
10. **Use default render settings** — Corona works best with defaults
