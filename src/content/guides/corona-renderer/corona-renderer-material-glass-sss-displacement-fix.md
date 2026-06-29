---
title: "Corona Renderer Materials and Displacement: PBR Setup, Glass, and SSS Configuration"
excerpt: "Corona materials render incorrectly due to wrong PBR settings, glass IOR mismatches, or displacement edge length misconfiguration. I cover the Corona Physical Material setup, glass and SSS parameters, and displacement tuning for clean surfaces."
category: "troubleshooting"
softwareSlug: "corona-renderer"
keyword: "Corona Renderer material PBR glass SSS displacement setup"
slug: "corona-renderer-material-glass-sss-displacement-fix"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://docs-chaos.atlassian.net/wiki/spaces/CRMAX/pages/124759580"
  - "https://support.chaos.com/hc/en-us/articles/4528588388113-How-to-use-denoising-in-Corona-for-3ds-Max"
---

# Corona Renderer Materials and Displacement: PBR Setup, Glass, and SSS Configuration

I set up Corona materials for architecture and product visualization projects, and the material issues I see most often are: PBR materials with incorrect roughness/metallic values, glass that renders dark or with wrong refraction, SSS materials that are noisy or look melted, and displacement that produces jagged edges or excessive render times. Let me walk through each material type and the settings I use.

## Corona Physical Material: PBR Setup

The Corona Physical Material is the standard material type — it replaces the legacy Corona Material and follows PBR (Physically Based Rendering) conventions.

**Base PBR setup**:
1. Create a **Corona Physical Material**
2. **Base layer**:
   - **Color**: Connect the albedo/base color map here
   - **Roughness**: Connect the roughness map (black = smooth/shiny, white = rough/matte)
   - **Metalness**: Set to 1.0 for metals, 0.0 for non-metals. Connect a metallic map if the material has both metal and non-metal parts.
3. **Clearcoat layer** (for car paint, lacquered wood):
   - Enable for a glossy top layer over the base
   - Set **Amount** to 0.5-1.0 and **Roughness** to 0.1-0.3

**Common PBR mistakes**:
1. **Roughness and Glossiness confusion**: Corona uses **Roughness** (0 = mirror, 1 = matte). Some texture libraries use **Glossiness** (0 = matte, 1 = mirror). If your material looks inverted (shiny areas are matte and vice versa), you need to invert the map: add a **Color Correction** node with **Invert** enabled.

2. **Metalness value wrong**: A metal should have Metalness = 1.0 and a color matching the metal's tint (copper = orange, gold = yellow). A non-metal should have Metalness = 0.0. Setting Metalness to 0.5 produces incorrect results — it's not a blend.

3. **Normal map in wrong slot**: Connect normal maps to the **Bump** slot with the **Normal** mode selected (not Bump mode). A normal map in Bump mode produces incorrect surface detail.

## Glass Material Setup

Glass is one of the most common materials I configure, and it's also the most error-prone.

**Standard glass setup**:
1. Create a Corona Physical Material
2. Set **Base layer → Color** to white (or slightly tinted)
3. Set **Roughness** to 0 (perfectly smooth) or 0.05-0.1 for slightly imperfect glass
4. Set **Metalness** to 0
5. In the **Thin shell** section:
   - Enable **Thin shell** for single-surface glass (windows, simple bottles)
   - Disable for solid glass (thick glass blocks, lenses)
6. Set **IOR** (Index of Refraction):
   - **1.50**: Standard glass
   - **1.52**: Window glass
   - **1.49**: Acrylic/Plexiglas
   - **1.33**: Water
   - **1.45**: Quartz

**Common glass issues**:

1. **Glass appears black**: The IOR is set incorrectly, or there aren't enough ray bounces. Check **Max ray depth** in Performance settings — set to 6-8 for glass-heavy scenes.

2. **Glass appears too dark**: The **Absorption** color is too strong. Set absorption distance to a larger value (e.g., 100mm instead of 10mm) so the glass only tints at thicker sections.

3. **Glass has no reflections**: Ensure the material's **Roughness** is 0 and the **Fresnel** option is enabled. Fresnel controls how reflections appear at grazing angles — without it, glass looks flat.

4. **Frosted glass is noisy**: Increase the **Roughness** samples. In the material settings, set **Roughness samples** to 16-32 for clean frosted glass. Lower values produce noise.

## SSS (Subsurface Scattering) Setup

SSS simulates light penetrating a surface and scattering beneath it — essential for skin, wax, milk, marble, and plastic.

**Corona SSS setup**:
1. Create a Corona Physical Material
2. Enable the **Subsurface** layer
3. Set **Amount** to 1.0 (full SSS effect)
4. Set **Scatter color**: The color of light after it scatters inside the material (e.g., red for skin, yellow for wax)
5. Set **Radius**: How far light scatters inside the material
   - **Skin**: 5-15mm
   - **Marble**: 10-30mm
   - **Wax**: 5-20mm
   - **Milk**: 15-30mm
6. Set **IOR**: 1.4 for organic materials, 1.5 for minerals

**Common SSS issues**:

1. **SSS is noisy**: SSS is one of the most expensive material types. Increase samples in the Performance tab, or use the denoiser. Also, reduce the **Radius** — large radius values require more samples to resolve.

2. **SSS looks melted or too strong**: Reduce the **Amount** to 0.5-0.7. Full SSS (1.0) can make hard surfaces look soft.

3. **SSS color is wrong**: The scatter color should be the color you see when light passes through the material, not the surface color. For marble, the scatter color is white/cream, not the vein color.

4. **SSS takes too long to render**: Use the **Corona SSS Fast** material instead of the full SSS in the Physical Material. It's optimized for speed and produces nearly identical results for most use cases.

## Displacement Setup

Corona's displacement adds real geometric detail at render time. It's powerful but expensive.

**Setup**:
1. Add a **Corona Displacement Modifier** to the object
2. Load the displacement map (16-bit or 32-bit TIFF/EXR from ZBrush or Substance Painter)
3. Set **Amount**: The displacement height in scene units
4. Set **Edge length**: Controls tessellation quality
   - **4px** (default): Good for most cases
   - **2px**: Higher quality, smoother silhouettes, 2-3x slower
   - **8px**: Faster, may show jagged silhouettes

**Common displacement issues**:

1. **Displacement direction inverted**: In the Corona Displacement Modifier, try negating the **Amount** value (e.g., -1.0 instead of 1.0). The direction depends on the displacement map's convention.

2. **Jagged silhouette edges**: Decrease the **Edge length** to 2px. Also check that the displacement map is at least 16-bit — 8-bit maps produce banding.

3. **Excessive render time**: Increase Edge length to 6-8px, or use a normal map instead of displacement for surfaces that don't need true geometric detail.

4. **Displacement on curved surfaces looks faceted**: Enable **3D displacement** mode instead of 2D. 3D displacement subdivides each triangle into micro-polygons, producing smooth results on curved surfaces. It's more expensive but necessary for organic shapes.

5. **UV seam artifacts**: In ZBrush, enable **Smooth UVs** when baking the displacement map. In the Corona Displacement Modifier, enable **Smooth UVs** as well. Also ensure UV padding is at least 8 pixels.

## Material Performance Tips

1. **Use the Corona Material Library**: Corona includes a curated material library with pre-configured PBR materials. These are optimized for both quality and performance.

2. **Limit clearcoat usage**: Clearcoat adds a second reflection layer, roughly doubling the material's render cost. Only use it where needed (car paint, lacquered surfaces).

3. **Optimize SSS**: SSS is 5-10x more expensive than standard materials. Use it only for materials that truly need it, and use the Fast SSS variant when possible.

4. **Bump vs Normal vs Displacement**:
   - **Bump**: Cheapest, fakes surface detail, no silhouette change
   - **Normal**: Moderate cost, better than bump for angled surfaces, no silhouette change
   - **Displacement**: Most expensive, true geometric detail, changes silhouette
   - Use the cheapest option that produces the required visual result.

5. **Use material presets**: For common materials (glass, metal, wood, concrete), start with a preset and adjust. This avoids common setup mistakes.

## Summary

Corona material issues are most often caused by incorrect PBR values, wrong glass IOR, or displacement misconfiguration. My setup process: use Corona Physical Material with correct Roughness (not Glossiness) → set Metalness to 0 or 1 (never 0.5) → configure glass with correct IOR and Fresnel → use Fast SSS for subsurface materials → set displacement Edge length to 4px with 16-bit maps → use 3D displacement for curved surfaces. For performance, use the cheapest surface detail method (bump < normal < displacement) that meets the visual requirement.
