---
title: "D5 Render Environment and Weather: HDRI Setup, Season System, and Global Illumination Tuning"
excerpt: "D5 Render's environment and weather system produces inconsistent lighting, incorrect shadows, or GI artifacts. We cover the HDRI environment configuration, the season and weather system, D5 GI settings, and the ambient and exposure controls for consistent results."
category: "performance"
softwareSlug: "d5-render"
keyword: "D5 Render environment weather HDRI GI settings fix"
slug: "d5-render-environment-weather-hdri-gi-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://www.d5render.com/posts/d5-render-smoothness"
  - "https://docs.d5render.com/user-guide/hardware/how-to-view-and-optimize-graphics-card-usage"
  - "https://www.d5render.com/posts/2026-gpu-rendering-guide-d5"
---

# D5 Render Environment and Weather: HDRI Setup, Season System, and Global Illumination Tuning

We configure D5 Render environments for architecture and landscape projects, and the environment system is where we see the most confusion. D5's environment is more than just an HDRI — it includes a proprietary GI system, a weather system, a season system, and ambient controls that all interact. Getting them right is essential for consistent, professional-looking renders.

## D5 GI: Understanding the Global Illumination System

D5 Render uses its own proprietary Global Illumination engine called **D5 GI**. Unlike traditional real-time GI systems that use precomputed lightmaps or screen-space effects, D5 GI calculates real-time ray-traced global illumination.

**How D5 GI works**:
- D5 GI uses real-time ray tracing via DXR (DirectX Raytracing)
- It calculates direct and indirect lighting in real-time
- It supports multiple light bounces for realistic interreflection
- It adapts dynamically as you move the camera — no precomputation needed

**D5 GI performance characteristics**:
- D5 2.0 introduced improved GI with 2-4x faster reflection calculations
- D5 2.1 improved GI calculations by nearly 4x compared to 2.0
- The GI sampling algorithm groups lights by brightness and samples the most important groups first
- For 1024 lights, GI calculation time dropped from 23.84ms to 11.54ms

**GI quality settings**:
1. Go to **Menu → Settings → GI**
2. **GI Quality**: Set to Medium for editing, High for final renders
3. **GI Multiplier**: Controls the intensity of indirect lighting — 1.0 is physically accurate
4. Higher GI quality increases VRAM usage and reduces FPS

## HDRI Environment Setup

D5 Render uses an HDRI environment map for sky lighting, reflections, and background.

**Setup**:
1. Go to **Environment tab → Sky**
2. Load an HDRI map or use D5's built-in sky presets
3. Adjust **Rotation** to control the sun direction and shadow angle
4. Adjust **Brightness** to control the overall environment intensity
5. Adjust **Saturation** to control the color richness of the sky

**D5's built-in sky presets**:
- **Clear Sky**: Bright, sharp shadows — best for architectural exteriors
- **Partly Cloudy**: Soft shadows with some direction — good for most projects
- **Overcast**: Soft, diffuse shadows — best for interior-focused renders
- **Sunset**: Warm, low-angle lighting — dramatic effect
- **Night**: Dark sky with moonlight — for night renders

**Using custom HDRIs**:
1. D5 supports loading custom HDRI files (.hdr, .exr)
2. For best results, use HDRIs with at least 8K resolution for sharp reflections
3. Lower-resolution HDRIs (2K) produce blurry reflections on glossy surfaces
4. Store custom HDRIs in `C:\Users\[username]\Documents\D5Render\HDRIs\` for easy access

## Sun and Shadow Configuration

D5's sun system works alongside the HDRI environment:

**Setup**:
1. Go to **Environment tab → Sun**
2. **Sun position**: Set by time of day and geographic location
3. **Sun intensity**: Controls the brightness of direct sunlight
4. **Shadow softness**: Controls how soft the shadow edges are (higher = softer, lower = sharper)
5. **Sun size**: Controls the apparent size of the sun disc (affects shadow penumbra)

**For architectural renders, our standard settings**:
- Time: 10:00 AM or 2:00 PM (good shadow angles for facades)
- Sun intensity: 1.0-1.5
- Shadow softness: 0.3-0.5 (moderate softness — not too sharp, not too diffuse)
- Geographic location: Set to the project's actual location for accurate sun angles

## Weather System

D5 Render includes a real-time weather system that adds rain, snow, and fog to the scene.

**Rain**:
1. Go to **Environment tab → Weather → Rain**
2. Adjust **Intensity** for rain density
3. D5 automatically adds wet surface effects to materials
4. Rain creates puddles and wet reflections on surfaces
5. Performance impact: moderate — reduce rain intensity if FPS drops

**Snow**:
1. Go to **Environment tab → Weather → Snow**
2. Adjust **Snow amount** for snow coverage
3. D5 automatically applies snow accumulation to surfaces
4. Snow affects all horizontal surfaces — verify that it looks correct on your geometry

**Fog**:
1. Go to **Environment tab → Weather → Fog**
2. Adjust **Density** for fog thickness
3. Adjust **Height** to control how far the fog extends vertically
4. Fog adds atmospheric depth to large scenes
5. Performance impact: low — fog is a post-processing effect

## Season System

D5's season system changes the appearance of vegetation based on the time of year:

1. Go to **Environment tab → Season**
2. Select **Spring, Summer, Autumn, or Winter**
3. D5's vegetation assets automatically change color and density based on the season
4. **Spring**: Light green, new growth
5. **Summer**: Full green, dense foliage
6. **Autumn**: Orange/red/yellow, thinning foliage
7. **Winter**: Bare branches, snow on some assets

**Important**: The season system only affects D5's built-in vegetation assets. Imported custom vegetation won't change appearance with seasons — you need to swap models manually.

## Ambient and Exposure Controls

D5's ambient and exposure settings control the overall brightness and contrast of the scene:

**Exposure**:
1. Go to **Environment tab → Exposure**
2. **Exposure value (EV)**: Controls overall brightness — higher = brighter
3. **Contrast**: Controls the difference between bright and dark areas
4. **Highlights**: Controls the brightness of the brightest areas
5. **Shadows**: Controls the darkness of the darkest areas

**Our exposure workflow**:
1. Set the HDRI brightness and sun intensity first
2. Then adjust exposure to match the desired overall brightness
3. Use highlights and shadows for fine-tuning
4. Don't rely on exposure to fix bad lighting — fix the light sources first

**Ambient light**:
1. Go to **Environment tab → Ambient**
2. **Ambient intensity**: Adds a flat fill light to all surfaces
3. Use sparingly — too much ambient light flattens the image
4. We typically set ambient to 0.1-0.2 — just enough to lift very dark shadows

## Common Environment Issues

**Issue: Render is too dark**
**Fix**: Increase HDRI brightness, increase sun intensity, or increase exposure. Check that the HDRI is loaded correctly — a missing HDRI produces a dark scene with only direct sun lighting.

**Issue: Shadows are too sharp or too soft**
**Fix**: Adjust the **Shadow softness** in the Sun settings. Also check the sun size — a larger sun produces softer shadows (like an overcast sky), a smaller sun produces sharper shadows (like a clear day).

**Issue: GI artifacts (splotchy reflections, dark corners)**
**Fix**: Increase GI Quality to High. If artifacts persist, check that your GPU meets the minimum requirements — D5 GI requires DXR support. Update GPU drivers to the latest version.

**Issue: Vegetation doesn't match the season**
**Fix**: Ensure you're using D5's built-in vegetation assets, not imported custom models. The season system only affects D5's native assets.

**Issue: HDRI reflections look blurry**
**Fix**: Use a higher-resolution HDRI (8K instead of 2K). The reflection quality is directly tied to the HDRI resolution — low-res HDRIs produce blurry reflections on glossy surfaces.

**Issue: Fog obscures the building**
**Fix**: Reduce fog density or lower the fog height. Fog should add atmosphere, not hide the subject. We typically use very low density (0.1-0.2) for architectural renders.

## Best Practices

1. **Start with a D5 sky preset**: Don't jump straight to custom HDRIs — the built-in presets are well-tuned for architectural visualization
2. **Set sun position by time and location**: Use the actual project location for accurate sun angles
3. **Use seasons for context**: Set the season to match the project's presentation context
4. **Adjust exposure, not light intensity**: Once lights are set, use exposure for brightness adjustments — it's non-destructive
5. **Use weather sparingly**: Rain, snow, and fog are dramatic effects — use them only when they enhance the story
6. **Keep GI at Medium for editing**: Switch to High only for final renders to save FPS during editing
7. **Test with different times of day**: Render the same view at 9AM, noon, and 4PM to find the most flattering light

## Summary

D5 Render's environment system combines HDRI, sun, weather, seasons, and D5 GI for comprehensive scene lighting. Our setup process: select a D5 sky preset or load a custom HDRI → set sun position by time and location → adjust shadow softness → set the season → configure exposure and ambient → keep GI at Medium for editing, High for finals. For consistent results, fix light sources before adjusting exposure, and use D5's built-in vegetation for season-aware landscaping.
