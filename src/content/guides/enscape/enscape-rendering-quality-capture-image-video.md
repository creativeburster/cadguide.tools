---
title: "Enscape Rendering Quality: Capturing Images, Video, and Panoramas Without Artifacts"
excerpt: "Enscape's final renders can show noise, jagged shadows, and texture shimmering that aren't visible in the real-time preview. I cover the capture settings, anti-aliasing configuration, and the post-processing workflow that produces clean final output."
category: "performance"
softwareSlug: "enscape"
keyword: "Enscape rendering quality capture image video panorama settings"
slug: "enscape-rendering-quality-capture-image-video"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-24"
sources:
  - "https://documentation.chaos.com/space/ESKETCHUP/128031543/Rendering+Quality+in+Enscape"
  - "https://learn.enscape3d.com/blog/knowledgebase/performance-considerations-macos/"
  - "https://allsketchup.com/the-ultimate-guide-to-optimizing-enscape-real-time-rendering-performance.html"
---

# Enscape Rendering Quality: Capturing Images, Video, and Panoramas Without Artifacts

There's a gap between what you see in Enscape's real-time preview and what you get in the final captured render. The preview looks great at 60 FPS, but when you click "Capture Image," the result has noise, jagged shadow edges, or texture shimmering. I've worked through all of these issues and developed a capture workflow that consistently produces clean, professional output.

## Understanding Real-Time vs Capture Quality

Enscape uses different quality settings for real-time preview and final captures. The **Quality slider** in General settings controls real-time quality. When you capture an image or video, Enscape can use higher quality settings that would be too slow for real-time.

**The key setting**: In Settings → **Capture** tab, there's a separate quality configuration for captures. This is where you set the output resolution, quality, and format for images, videos, and panoramas.

## Image Capture Settings

### Resolution
- **Standard HD (1920x1080)**: Sufficient for screen presentations and web
- **2K (2560x1440)**: Good for client presentations on large screens
- **4K (3840x2160)**: Best for printed materials and zoom-in detail
- **Custom**: Set exact pixel dimensions for specific output requirements

I render at 4K for all client deliverables. The capture time is longer (30-60 seconds vs 5-10 seconds for HD), but the quality difference is significant, especially when the client zooms in on details.

### Quality for Captures
- **Low**: Fastest capture, visible noise and artifacts — only for quick previews
- **Medium**: Good for internal review, some noise in shadows
- **High**: Clean results for most client work
- **Ultra**: Best quality, longest capture time — for hero shots and marketing materials

My standard: High for all client images, Ultra for the 2-3 hero shots that define the project.

### Format
- **PNG**: Lossless, large file size — best for final deliverables
- **JPG**: Lossy, small file size — good for quick previews and email
- **EXR**: High dynamic range — for compositing in Photoshop or After Effects

I capture in PNG for all final deliverables. The file size is larger, but there's no compression artifacting, and clients can re-export to JPG themselves if needed.

## Video Capture Settings

Video is where I see the most quality issues. Captured videos can have frame-to-frame noise variation (flickering), shadow crawling, and texture shimmering that aren't visible in single images.

### Resolution and FPS
- **1080p / 30 FPS**: Standard for client presentations
- **1080p / 60 FPS**: Smoother motion for walkthroughs
- **4K / 30 FPS**: High quality for marketing videos
- **4K / 60 FPS**: Only for high-end deliverables — very long render times

### Video Quality Issues and Fixes

**Frame flickering (noise variation between frames)**:
1. Set capture quality to **High** or **Ultra** — this increases samples per frame, reducing noise
2. Enable **Temporal Stability** if available in your Enscape version — this smooths noise across frames
3. If flickering persists, render at a higher quality and downscale in post-production

**Shadow crawling (shadows that shift position slightly between frames)**:
1. Enable **Ray-Traced Sun Shadows** for captures — ray-traced shadows are more stable than rasterized
2. Increase the **Shadow Quality** setting
3. If using rasterized shadows, increase the shadow map resolution in settings

**Texture shimmering (textures that appear to move or vibrate)**:
1. This is an anti-aliasing issue — increase the capture quality to High or Ultra
2. Enable **TAA (Temporal Anti-Aliasing)** if available
3. If TAA isn't available, the shimmering is caused by insufficient texture filtering — use higher resolution textures in the source model

### Video Compression
- Enscape outputs MP4 (H.264) by default
- For maximum quality, check if your Enscape version supports **lossless** or **high bitrate** output
- If not, render at the highest quality setting and re-encode with a higher bitrate using HandBrake or Adobe Media Encoder
- I always re-encode Enscape videos through Adobe Media Encoder at 50 Mbps for client deliverables

## Panorama Capture Settings

Panoramas (360-degree images) have specific quality considerations:

### Resolution
- **2048x1024**: Quick preview quality
- **4096x2048**: Standard for client VR viewing
- **8192x4096**: High detail for zoom-in VR — very large file size

### Panorama-Specific Issues

**Seam visibility at the 360-degree join**:
1. This is caused by different sampling on the left and right edges of the panorama
2. Increasing capture quality to High or Ultra reduces the seam
3. If the seam is still visible, it's a known limitation — some Enscape versions handle panorama seams better than others

**VR performance with large panoramas**:
1. An 8K panorama file can be 20MB+ — too large for smooth VR viewing on mobile devices
2. For mobile VR, use 4K panoramas (5-8MB)
3. For desktop VR (Oculus Link, etc.), 8K is fine

## Anti-Aliasing Configuration

Anti-aliasing is critical for clean edges in Enscape captures. The settings depend on your GPU:

**NVIDIA RTX cards**:
- Enable **NVIDIA DLSS** in Quality mode — this provides excellent anti-aliasing with a performance boost
- DLSS is superior to traditional AA methods for architectural scenes with many straight edges

**Non-RTX cards**:
- Use **TAA (Temporal Anti-Aliasing)** if available
- TAA provides good edge quality but can cause slight blurring in motion
- If TAA isn't available, use **FXAA** — it's faster but less precise

**Disabling AA**:
- Never disable anti-aliasing for final captures — the jagged edges will be very visible
- Only disable for quick internal previews where speed matters more than quality

## Lighting Quality for Captures

The real-time preview uses simplified lighting for performance. Captures can use more accurate lighting:

**Enable for captures**:
1. **Ray-Traced Sun Shadows**: Produces accurate, soft shadow penumbra that rasterized shadows can't match
2. **NVIDIA Shadow Denoiser**: Cleans up noisy ray-traced shadows (RTX cards only)
3. **Global Reflection**: Set to **Screen** for real-time, switch to **Ray Traced** for captures if available
4. **Ambient Occlusion**: Enable for captures — adds contact shadows that ground objects

## Post-Processing in Enscape

Enscape includes built-in post-processing effects that can significantly improve capture quality:

**Essential effects for captures**:
1. **Exposure**: Adjust to match the scene's lighting — I typically set this between 0.8 and 1.2
2. **White Balance**: Set based on the scene's lighting temperature — 5500K for daylight, 3200K for warm interior
3. **Contrast**: A slight increase (10-15%) adds punch without looking artificial
4. **Saturation**: A small boost (5-10%) makes colors more vibrant — don't overdo it
5. **Vignette**: A subtle vignette (10-15%) focuses attention on the center of the image
6. **Depth of Field**: Use sparingly — a subtle DoF with a wide focus area adds realism without blurring important details
7. **Lens Flare**: Disable for architectural work — it looks artificial in most cases
8. **Chromatic Aberration**: Disable — it adds colored fringing that looks like a rendering error

## My Capture Workflow

1. **Set up the view**: Position the camera, adjust sun angle, configure lighting
2. **Switch to capture quality**: Settings → Capture → set resolution to 4K, quality to High
3. **Enable ray tracing**: Turn on Ray-Traced Sun Shadows and Shadow Denoiser
4. **Configure post-processing**: Apply exposure, white balance, contrast, and subtle vignette
5. **Enable grass and 3D features**: Turn on grass rendering and any features disabled during editing
6. **Wait for the preview to settle**: Give Enscape 5-10 seconds to fully resolve the scene at capture quality
7. **Capture**: Click Capture Image and wait for the render to complete
8. **Review**: Check the captured image at 100% zoom for noise, artifacts, and edge quality
9. **Re-capture if needed**: Adjust settings and re-capture — don't settle for artifacts in final deliverables

## Summary

Clean Enscape captures require configuring settings specifically for output, not relying on real-time preview quality. My workflow: set capture resolution to 4K with High quality → enable ray-traced shadows and denoiser → configure post-processing (exposure, white balance, contrast, vignette) → enable 3D grass and features → wait for preview to settle → capture → review at 100% zoom. For video, use High or Ultra quality to prevent frame-to-frame noise flickering, and re-encode at high bitrate in post.
