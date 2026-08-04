---
title: "Lumion Ray Tracing and Crash Errors"
excerpt: "Lumion Ray Tracing and Crash Errors: symptoms, root causes, and step-by-step fixes, verified against Lumion Support and NVIDIA Forums."
category: "troubleshooting"
softwareSlug: "lumion"
keyword: "Lumion Ray Tracing artifacts blotches insufficient samples denoiser sample adjustment frequent crash rendering NVIDIA driver incompatibility driver downgrade DDS texture crash non-divisible-by-4 resolution image resize Project Recovery effects reverted default crash recovery bug 2025.2 update Merge Project black scene incompatible project files version match"
slug: "lumion-ray-tracing-and-crash-errors"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://support.lumion.com/knowledge-base/rendering-questions"
  - "https://support.lumion.com/knowledge-base/lumion-2025.2-release-notes"
  - "https://www.nvidia.com/en-us/geforce/forums/geforce-graphics-cards/5/586679/frequent-crash-lumion-2024-when-render-with-ray-tr/"
---

# Lumion Ray Tracing and Crash Errors: Ray Tracing Artifacts and Blotches from Insufficient Samples Requiring Denoiser and Sample Adjustment, Frequent Crash When Rendering with Ray Tracing from NVIDIA Driver Incompatibility Requiring Driver Downgrade, DDS Texture Crash from Non-Divisible-by-4 Resolution Requiring Image Resize, Project Recovery Effects Reverted to Default from Crash Recovery Bug Requiring 2025.2 Update, and Merge Project Black Scene from Incompatible Project Files Requiring Version Match

Lumion's Ray Tracing engine, NVIDIA driver compatibility, texture loading, crash recovery, and project merging produce errors from insufficient sampling, driver updates, texture format issues, recovery bugs, and version incompatibility. This guide covers the 5 most common Lumion problems with diagnostic steps and community-verified fixes from Lumion Support and NVIDIA Forums.

## 1. Ray Tracing Artifacts and Blotches from Insufficient Samples

### Symptom

Rendering with Ray Tracing produces artifacts, blotches, or patchy-looking renders. The rendered image has noise, fireflies, or uneven lighting patches. These artifacts are especially visible in darker areas with indirect lighting.

### Root Cause

"Why do you get artifacts, blotches or patchy looking renders with Ray Tracing?" Ray Tracing uses path tracing which requires many samples to converge to a clean image. With insufficient samples, the Monte Carlo noise appears as blotches and artifacts. "In previous versions, similar conditions would often produce noticeable moving blotches, even when multiple bounces were used." Darker areas with indirect lighting are particularly susceptible because they receive fewer light paths.

### Fix

1. **Use the built-in Denoiser**:
   - "Lumion 2024.0 advanced the capability to use Ray Tracing much more in Movie Mode by implementing a high performance neural Denoiser"
   - Enable the Denoiser effect in Photo or Movie mode
   - The neural denoiser removes noise while preserving detail
   - This is the primary fix for blotches

2. **Increase sample count**:
   - "Multiple sampling techniques and improving light distribution to produce a higher accuracy result"
   - In render settings, increase the number of samples
   - More samples = less noise but longer render time
   - Find the balance between quality and speed

3. **Use Radiance Cache (2025.1+)**:
   - "Real Time Preview Performance and Quality: Radiance Cache Technology"
   - "Smoother and more refined lighting is added to the Real-time preview"
   - "Cached radiance values help smooth out noise in global illumination"
   - "Leading to cleaner images"
   - Update to Lumion 2025.1 or later

4. **Increase light bounces**:
   - "Even with just one bounce, the effect gradually accumulates"
   - "Resulting in a stable and consistent render over time"
   - Increase the number of bounces in Ray Trace settings
   - More bounces = better indirect lighting but longer render

5. **Use Rasterization for fast previews**:
   - "Lumion continues the full featured Rasterization rendering approach"
   - "Or using the full Ray Trace rendering using Path Tracing approach"
   - "You choose which best suits any Photo, Movie or 360 Panorama"
   - Use Rasterization for quick previews, Ray Tracing for final renders

6. **Render at higher resolution**:
   - Render at a higher resolution and downscale
   - This averages out noise
   - Use the AI Upscaler for final output
   - "How does the AI Upscaler work in Lumion?"

### Community Report

> "Why do you get artifacts, blotches or patchy looking renders with Ray Tracing? Lumion 2024.0 implemented a high performance neural Denoiser, multiple sampling techniques and improving light distribution. Radiance Cache technology stores and reuses computed radiance values rather than recalculating for every ray. In previous versions, similar conditions would often produce noticeable moving blotches. With Radiance Cache, these artifacts are significantly reduced."

## 2. Frequent Crash When Rendering with Ray Tracing from NVIDIA Driver Incompatibility

### Symptom

Lumion 2024 frequently crashes when rendering with Ray Tracing enabled. The crash occurs during the render process. Everything worked fine until NVIDIA driver version 577.00. After updating to the latest driver, RT rendering crashes consistently. Rolling back to driver 572.83 works.

### Root Cause

The NVIDIA driver update (577.00 and later) introduced changes that are incompatible with Lumion 2024's Ray Tracing implementation. The driver's RTX handling changed, causing Lumion's path tracing engine to crash. This is a driver-software compatibility issue, not a Lumion bug per se. "RTX 5080, Lumion 2024 Crash on the updated driver Ver:576.02. But still working on older version like Ver: 572.83."

### Fix

1. **Downgrade NVIDIA driver**:
   - "Still working on older version like Ver: 572.83"
   - Download NVIDIA driver version 572.83 or earlier
   - Use NVIDIA Studio Driver (not Game Ready)
   - Perform a clean install of the older driver

2. **Try the hotfix driver**:
   - "Try the 576.15 Hot Fix"
   - NVIDIA may release hotfix drivers
   - Check the NVIDIA forums for hotfix announcements
   - Test if the hotfix resolves the crash

3. **Update Lumion to the latest version**:
   - Check for Lumion updates
   - "Lumion 2025.2 Release Notes" may include driver compatibility fixes
   - Update to the latest Lumion version
   - Test with the latest NVIDIA driver

4. **Use Rasterization instead of Ray Tracing**:
   - "There still may be a need to render using the Rasterization rendering option"
   - "For fastest possible outcomes (Project dependent)"
   - Switch to Rasterization mode
   - This avoids the RT crash entirely

5. **Report to NVIDIA and Lumion**:
   - Report the crash on NVIDIA GeForce Forums
   - Report to Lumion Support
   - Include: GPU model, driver version, Lumion version, crash details
   - Both companies need to coordinate on the fix

6. **Clean driver installation**:
   - Use DDU (Display Driver Uninstaller)
   - Completely remove the current driver
   - Install the working driver version
   - Prevent automatic driver updates

### Community Report

> "Frequent crash, Lumion 2024 when render with Ray Tracing. HP Omen 16 with RTX 4070. Everything was okay until driver version 577.00. Now it frequently crashes if render with RT on. RTX 5080, Lumion 2024 Crash on the updated driver Ver:576.02. But still working on older version like Ver: 572.83. Try the 576.15 Hot Fix."

## 3. DDS Texture Crash from Non-Divisible-by-4 Resolution

### Symptom

Loading a .DDS texture file causes Lumion to crash. The crash occurs when the texture is loaded into the material editor or when rendering with the texture applied. Not all DDS files cause the crash — only some specific textures.

### Root Cause

"Lumion no longer crashes when loading a .DDS texture with a resolution that is not divisible by 4." DDS (DirectDraw Surface) textures have specific requirements for resolution. The DDS format uses block compression (BC1-BC7) which requires dimensions to be divisible by 4. When a DDS file has dimensions not divisible by 4, Lumion's texture loader crashes trying to decompress the blocks.

### Fix

1. **Update to Lumion 2025.2 or later**:
   - "Lumion no longer crashes when loading a .DDS texture with a resolution that is not divisible by 4"
   - This is fixed in Lumion 2025.2
   - Update to the latest version
   - The fix handles non-standard DDS dimensions

2. **Resize the DDS texture**:
   - If not updating, resize the DDS texture
   - Ensure both width and height are divisible by 4
   - Use image editing software (Photoshop, GIMP with DDS plugin)
   - Common sizes: 256, 512, 1024, 2048, 4096

3. **Convert DDS to PNG or JPG**:
   - If resizing is not feasible
   - Convert the DDS to PNG or JPG
   - These formats don't have the divisibility requirement
   - Import the converted texture into Lumion

4. **Check DDS file format**:
   - Verify the DDS compression format
   - Use BC1 (DXT1) for opaque textures
   - Use BC3 (DXT5) for textures with alpha
   - Use BC7 for high quality compression

5. **Use standard texture resolutions**:
   - Always use power-of-2 resolutions for DDS
   - 128x128, 256x256, 512x512, 1024x1024, 2048x2048, 4096x4096
   - These are always divisible by 4
   - Avoid non-standard sizes

### Community Report

> "Lumion 2025.2 Release Notes: .DDS textures — Lumion no longer crashes when loading a .DDS texture with a resolution that is not divisible by 4. Fixed an issue that would result in Lumion showing the wrong file type in Recent Files after switching license type."

## 4. Project Recovery Effects Reverted to Default from Crash Recovery Bug

### Symptom

After a crash, Lumion's Project Recovery feature recovers the project. But some Effects have their settings reverted to default or have excessive values. The Color Correction Effect may have extreme values. The recovered project doesn't match the state before the crash.

### Root Cause

"When recovering a Project after a crash, some Effects would have their settings reverted to default or have excessive values such as for the Color Correction Effect." The crash recovery system doesn't properly save the current Effect settings. When the project is recovered, the Effect parameters are loaded with incorrect values — either defaults or extreme values from corrupted recovery data.

### Fix

1. **Update to Lumion 2025.2**:
   - "This has been fixed"
   - The Project Recovery Effect issue is fixed in 2025.2
   - Update to the latest version
   - Crash recovery will now preserve Effect settings

2. **Save manually before rendering**:
   - Don't rely solely on auto-save
   - Save the project manually before starting a render
   - Use Save As to create versioned backups
   - This ensures you have a known-good state

3. **Check Effects after recovery**:
   - After any crash recovery
   - Review all Effects in the project
   - Check for reverted or extreme values
   - Manually fix any incorrect settings

4. **Export project settings**:
   - Before complex render setups
   - Take screenshots of all Effect settings
   - Or note the values in a document
   - Use these to restore settings after recovery

5. **Avoid crashes to prevent recovery issues**:
   - Save frequently
   - Close other GPU-intensive applications
   - Ensure adequate system resources
   - Update drivers and Lumion regularly

### Community Report

> "Lumion 2025.2 Release Notes: Project Recovery — When recovering a Project after a crash, some Effects would have their settings reverted to default or have excessive values such as for the Color Correction Effect. This has been fixed."

## 5. Merge Project Black Scene from Incompatible Project Files

### Symptom

Using Merge Project to combine projects. After merging, the scene is completely black. No objects, materials, or lighting are visible. The merged project appears empty despite both source projects having content.

### Root Cause

"Resolved an issue caused by merging incompatible Project files, which could result in a completely black scene." The Merge Project feature doesn't properly handle projects created in different Lumion versions. When projects from incompatible versions are merged, the scene data is corrupted, resulting in a completely black scene with no visible content.

### Fix

1. **Update to Lumion 2025.2**:
   - "Resolved an issue caused by merging incompatible Project files"
   - "Which could result in a completely black scene"
   - This is fixed in Lumion 2025.2
   - Update to the latest version

2. **Ensure both projects are the same version**:
   - Before merging, open both projects in the same Lumion version
   - Save both projects in the current version
   - Then attempt the merge
   - This ensures version compatibility

3. **Merge in small batches**:
   - Instead of merging entire projects
   - Export objects from one project
   - Import them into the other project
   - This avoids the merge compatibility issue

4. **Check scene after merge**:
   - After merging, check if the scene is black
   - If black, undo the merge
   - Try merging different combinations
   - Identify which project causes the issue

5. **Use Import/Export instead of Merge**:
   - If Merge Project consistently fails
   - Export models from one project
   - Import them into the other project
   - This is more reliable than Merge Project

6. **Contact Lumion Support**:
   - If the black scene persists after updating
   - Contact Lumion Support
   - Provide both project files
   - They can diagnose the incompatibility

### Community Report

> "Lumion 2025.2 Release Notes: Merge Project — Resolved an issue caused by merging incompatible Project files, which could result in a completely black scene. Also fixed: Save option unavailable when closing Lumion. Raytracing Effect: Reduced Reflectivity of Ocean when using Fully Ray-Traced Glass and Water. Fixed dark shading near horizon edge of Ocean."

## 6. Additional Lumion Issues

### Ray Tracing 3D Grass Reflectivity

**Issue**: "3D Grass could look very reflective when using Ray Tracing."
**Fix**: Update to Lumion 2025.2. "Fixed a problem that could cause 3D Grass to look very reflective when using Ray Tracing."

### Black Thumbnails with Ray Tracing

**Issue**: "Fixed black thumbnails being created when storing a Photo after rendering the HQ Preview while the Raytracing Effect is enabled."
**Fix**: Update to Lumion 2025.2. This thumbnail issue is fixed.

### Ocean Reflectivity with Ray Tracing

**Issue**: "Reduced the Reflectivity of the Ocean when using Fully Ray-Traced Glass and Water."
**Fix**: Update to Lumion 2025.2. Ocean rendering with RT is improved. "Fixed the dark shading near the horizon edge of the Ocean."

### Save Option Unavailable

**Issue**: "Fixed a problem that could cause the Save option to be unavailable when closing Lumion."
**Fix**: Update to Lumion 2025.2. The Save option issue is fixed.

### PC Restart During Editing or Rendering

**Issue**: "Why does your PC sometimes restart while you are editing a Project or when you start rendering?"
**Fix**: Check power supply adequacy. Monitor GPU temperature. Update drivers. Check for overheating. Ensure stable power delivery.

## Best Practices

1. **Enable the neural Denoiser when using Ray Tracing** — removes blotches and artifacts
2. **Update to Lumion 2025.2 for DDS texture and recovery fixes** — many bugs fixed
3. **Use NVIDIA Studio Driver 572.83 if RT rendering crashes** — avoid incompatible driver versions
4. **Ensure DDS textures have dimensions divisible by 4** — prevents texture loading crash
5. **Save manually before rendering — don't rely on auto-recovery** — prevents Effect setting loss
6. **Ensure both projects are the same Lumion version before merging** — prevents black scene
7. **Use Radiance Cache (2025.1+) for smoother real-time preview** — reduces noise
8. **Use Rasterization for fast previews, Ray Tracing for final renders** — balance speed and quality
9. **Render at higher resolution and downscale for cleaner results** — averages out noise
10. **Monitor GPU temperature and power during RT rendering** — prevents PC restarts
