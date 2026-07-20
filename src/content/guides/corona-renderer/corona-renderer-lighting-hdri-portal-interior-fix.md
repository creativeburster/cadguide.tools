---
title: "Corona Renderer Lighting: HDRI Setup, Light Portal, and Interior Daylight Workflow"
excerpt: "Corona interior renders are noisy and dark when HDRI and light portals are misconfigured. We cover the Corona Sun + Sky setup, HDRI Dome Light configuration, light portal placement for windows, and the adaptive light solver tuning for multi-light interiors."
category: "performance"
softwareSlug: "corona-renderer"
keyword: "Corona Renderer lighting HDRI light portal interior fix"
slug: "corona-renderer-lighting-hdri-portal-interior-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-23"
sources:
  - "https://support.chaos.com/hc/en-us/articles/4528466192273-What-is-the-Adaptive-light-solver-option-3ds-Max"
  - "https://docs-chaos.atlassian.net/wiki/spaces/CRMAX/pages/124759580"
  - "https://cgtips.org/corona-renderer-for-3ds-max-how-to-render-faster-part-3/"
---

# Corona Renderer Lighting: HDRI Setup, Light Portal, and Interior Daylight Workflow

We set up lighting for architectural visualization in Corona Renderer, and the most common issue we encounter is dark, noisy interiors. The architect places an HDRI in the environment slot, hits render, and gets a splotchy mess that takes 200 passes to clean up. The problem isn't the HDRI — it's the lack of light portals and incorrect GI configuration for interior daylight.

## Interior Daylight: Sun + Sky + Light Portals

### Step 1: Corona Sun + Sky

For interior daylight, we use Corona Sun + Sky rather than an HDRI. The Sun is a direct light that's perfectly sampled — no noise, no fireflies.

**Setup**:
1. Create a **Corona Sun** in the Create panel → Lights → Corona
2. Position the sun to match your desired time of day
3. In the sun parameters:
   - **Intensity multiplier**: 1.0 (adjust to taste)
   - **Size multiplier**: 1.0 (higher = softer shadows, lower = sharper)
   - **Shadow subdivs**: 16 (sufficient for clean shadows)
4. Add **Corona Sky** to the Environment map slot (Render Setup → Environment)

### Step 2: Light Portals at Windows

This is the step most artists miss, and it's the #1 cause of noisy interior renders. Light portals tell Corona where light enters the interior, allowing the renderer to focus samples on those openings.

**Setup**:
1. Create a **Corona Light** at each window opening
2. Set **Type** to **Portal** (this is the critical setting)
3. Size the light to cover the entire window opening
4. Position it just outside the window, facing into the room
5. The portal doesn't emit light itself — it guides Corona's sampling toward the window

**Without light portals**: Corona has to randomly sample the entire environment to find light entering through windows. Most samples miss the windows and hit walls instead, producing noise.

**With light portals**: Corona knows exactly where light enters and focuses samples there. Interior renders clean up 3-5x faster with portals.

**Portal settings**:
- **Color**: White (or match the sky color)
- **Intensity**: 1.0 (portals don't need high intensity — they guide sampling, not illuminate)
- **Visible in render**: Off (you don't want to see the portal itself)

### Step 3: HDRI for Ambient Fill

If the Sun + Sky doesn't provide enough ambient light, add an HDRI for fill:

1. Create a **Corona Light** → Type: **Dome**
2. Load the HDRI in the **Dome tex** slot
3. Set **Multiplier** to 0.3-0.5 (lower than the Sun — it's just fill)
4. The Dome Light provides ambient sky color and reflections

**Why Dome Light instead of Environment map**: The Dome Light uses importance sampling, which is more efficient than the Environment map. This reduces noise by about 30-40% for the same render time.

## Exterior Lighting: HDRI Dome Light

For exterior scenes, the HDRI Dome Light is the primary light source:

**Setup**:
1. Create a **Corona Light** → Type: **Dome**
2. Load the HDRI in the **Dome tex** slot
3. Set **Resolution** to 1024 (controls internal sampling resolution)
4. Set **Multiplier** to 1.0 (adjust based on HDRI brightness)
5. Rotate the Dome Light on the Z-axis to control shadow direction

**For exterior + interior visible through windows**: Use the Dome Light + Sun combination:
- Dome Light with HDRI for ambient sky and reflections
- Corona Sun for direct sunlight and crisp shadows
- Set the Dome Light multiplier lower (0.3-0.5) since the Sun provides the main illumination

## Adaptive Light Solver for Multi-Light Interiors

The Adaptive Light Solver is essential for interior scenes with many artificial lights. Chaos reports up to 6x faster renders with this feature enabled.

**To verify**:
1. Render Setup → **Performance → Development/Experimental Stuff → Lights**
2. **Adaptive light solver** should be checked (enabled by default since Corona 4)

**How it works**: The solver analyzes which lights contribute most to each part of the scene and allocates more rays to those lights. Lights that are occluded or contribute little receive fewer rays, reducing wasted computation.

**Important note from Chaos**: "The state of the Adaptive light solver checkbox is saved in the scene." If you open a scene created in Corona 3 or earlier, the solver may be disabled. Always check this setting on old scenes.

## Artificial Light Setup

For interior scenes with artificial lighting (lamps, ceiling lights, LED strips):

**Corona Light types we use**:
- **Area Light**: For rectangular light panels, ceiling troffers, flat panels
- **Sphere Light**: For bulbs, spherical lamps
- **Spot Light**: For directional lights, track lighting
- **IES Light**: For fixtures with photometric profiles — use manufacturer IES files for accurate light distribution

**Tips for clean artificial lighting**:
1. **Use IES files when available**: IES profiles produce accurate light distribution and are well-sampled by Corona
2. **Avoid very small point lights**: Extremely small lights produce fireflies. Use a small sphere light instead of a point light.
3. **Don't use too many lights**: The Adaptive Light Solver helps, but 50+ lights will still be slow. Where possible, replace multiple small lights with a single area light.
4. **Set correct intensity**: Corona uses physical light units (lumens, watts, lux). Use real-world values:
   - LED bulb: 800-1600 lumens
   - Ceiling spotlight: 400-800 lumens
   - LED strip (per meter): 500-1500 lumens

## HDRI Multiplier and Intensity Tuning

Getting the right HDRI intensity is a common challenge:

1. **Start at 1.0**: Render and check the exposure
2. **Too dark**: Increase multiplier in 0.5 increments
3. **Too bright**: Decrease multiplier in 0.5 increments
4. **Use the VFB exposure control**: Instead of changing the HDRI multiplier, adjust the **Exposure** in the Corona VFB. This is like camera exposure — it affects the entire image without changing the lighting.

**Our approach**: We set the HDRI multiplier to 1.0 and adjust exposure in the VFB. This keeps the lighting physically accurate and makes exposure adjustments non-destructive.

## Environment Override

For scenes where the HDRI provides lighting but you want a different background:

1. In Render Setup → **Scene → Environment**
2. Set **Background** to a different map (gradient, photo, solid color)
3. The HDRI Dome Light still provides lighting and reflections
4. The background map only affects what's visible behind the geometry

This is useful for architectural renders where you want a clean sky gradient for the background but an HDRI for realistic reflections.

## Common Lighting Issues

**Issue: Interior is too dark even with portals**
**Fix**: Increase the Corona Sun intensity, or add additional Corona Lights inside the room. Also check that the portal lights are correctly positioned at the window openings and set to Portal type.

**Issue: Noise around spotlights and IES lights**
**Fix**: Enable the Adaptive Light Solver. Increase the **Light Samples Multiplier** to 3-4 for scenes with many spotlights. Use the denoiser for final cleanup.

**Issue: Reflections show the HDRI but the background should be different**
**Fix**: Use the Environment override (see above) to set a different background while keeping the HDRI for reflections.

**Issue: Shadows are too hard or too soft**
**Fix**: For the Corona Sun, adjust the **Size multiplier** — higher values (2-5) produce softer shadows, lower values (0.5-1) produce sharper shadows. For area lights, increase the light's physical size to soften shadows.

## Summary

Corona lighting setup depends on scene type. For interiors: use Corona Sun + Sky for daylight, add Light Portals at every window (this is the most important step), and enable the Adaptive Light Solver for multi-light scenes. For exteriors: use a Dome Light with HDRI for ambient lighting and Corona Sun for direct light. Use the VFB exposure control for brightness adjustments instead of changing light intensities. Light Portals alone typically reduce interior render times by 3-5x by focusing samples on window openings.
