---
title: "KeyShot Material and Texture Mapping: UV Projection, Label Alignment, and Environment Mapping Fixes"
excerpt: "KeyShot materials show incorrect texture mapping, labels appear misaligned, and environment reflections look wrong. I cover the UV projection types, label mapping workflow, and environment mapping configuration for product visualization."
category: "troubleshooting"
softwareSlug: "keyshot"
keyword: "KeyShot material texture mapping UV label environment fix"
slug: "keyshot-material-texture-mapping-uv-label-fix"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://support.keyshot.com/en/knowledge-base/slow-real-time-rendering"
  - "https://manuals.keyshot.com/kss2026/en-us/manual/Nvidia-Requirements.htm"
---

# KeyShot Material and Texture Mapping: UV Projection, Label Alignment, and Environment Mapping Fixes

I work with industrial designers who use KeyShot for product visualization, and texture mapping is the area where I see the most issues. A product model comes in from SolidWorks or Rhino, the designer applies a material, and the texture is stretched, misaligned, or oriented incorrectly. Getting texture mapping right in KeyShot requires understanding the projection types and knowing when to use each one.

## Understanding KeyShot's Texture Mapping Types

KeyShot offers five texture mapping types. Choosing the right one is the first step in fixing texture issues:

### 1. UV Mapping
- Uses the UV coordinates from the imported 3D file
- Best for: Organic shapes, characters, models with proper UV unwrapping
- Requirement: The source application must have correct UV coordinates
- Common issue: CAD models from SolidWorks, Rhino, or Inventor often don't have UV coordinates, making this mapping type produce stretched or random results

### 2. Planar Mapping
- Projects the texture onto the model from a single plane (like a projector)
- Best for: Flat surfaces, labels, decals, screens
- Common issue: Texture appears correct on one face but stretched on perpendicular faces
- Fix: Adjust the **Mapping Type → Planar** and rotate the projection gizmo to align with the surface

### 3. Box Mapping
- Projects the texture from six directions (like a box unfolding around the model)
- Best for: Architectural objects, furniture, products with mostly flat surfaces
- Common issue: Visible seams where the six projections meet
- Fix: Adjust the **Scale** to make the texture pattern consistent across all faces

### 4. Cylindrical Mapping
- Wraps the texture around the model like a cylinder
- Best for: Bottles, cans, tubes, any cylindrical product
- Common issue: A visible seam where the texture wraps around and meets itself
- Fix: Rotate the mapping gizmo to place the seam on the back of the model, or use a seamless texture

### 5. Spherical Mapping
- Wraps the texture around the model like a sphere
- Best for: Balls, helmets, domes
- Common issue: Texture pinches at the poles (top and bottom)
- Fix: Use a texture designed for spherical mapping, or switch to UV mapping with proper unwrapping

## Fix 1: Texture Stretched on CAD Imports

This is the most common issue I encounter. CAD models from SolidWorks, Rhino, or Inventor import without UV coordinates, and KeyShot's default mapping produces stretched textures.

**The fix**:
1. Select the material in KeyShot
2. Go to the **Material Properties → Texture tab**
3. Change **Mapping Type** from **UV** to **Box** (for most products) or **Planar** (for flat surfaces)
4. Adjust the **Scale** to match the desired texture size
5. Use the **Position** and **Rotation** controls to align the texture

For complex products with multiple surfaces at different angles, I use **Box Mapping** as the default — it handles most product shapes reasonably well without requiring UV unwrapping.

## Fix 2: Label and Decal Alignment

Labels on product packaging are a frequent source of frustration. The label needs to be positioned precisely on a specific face of the product.

**The workflow**:
1. Select the part where the label goes
2. Go to **Material Properties → Labels**
3. Click **Add Label** and load the label texture (PNG with transparency)
4. Set the label's **Mapping Type** to **Planar**
5. Use the **Position** controls to place the label on the correct face
6. Use the **Scale** to size the label correctly
7. Use the **Rotation** to orient the label

**For curved surfaces** (bottles, cans):
1. Use **Cylindrical Mapping** for the label
2. Adjust the cylinder gizmo to match the product's curvature
3. Set the seam to the back of the product

**For multiple labels on different faces**:
1. Add multiple labels in the Labels tab
2. Each label has its own mapping type and position
3. This allows different labels on different faces of the same part

## Fix 3: Texture Scale Inconsistency

The same material looks different on different parts — the texture is larger on some parts and smaller on others.

**Root cause**: When using UV mapping, the texture scale depends on the UV unwrap, which varies between parts. When using Box or Planar mapping, the scale is in scene units and should be consistent.

**The fix**:
1. Switch all parts to the same mapping type (Box is most consistent)
2. Set the same **Scale** value on all materials
3. Or: use **Real-World Scale** — enable this in the texture settings, and the texture will be sized in real-world units (e.g., 100mm x 100mm) regardless of the part size

**Real-World Scale** is the most reliable approach for multi-part products. I enable it on all materials and set the texture size to match the physical material (e.g., a wood grain texture at 200mm x 200mm represents a 200mm section of wood).

## Fix 4: Environment Reflections Look Wrong

The HDRI environment provides reflections on metallic and glossy surfaces. Sometimes the reflections don't match the intended environment or look distorted.

**Fixes**:

1. **Reflection appears upside down**: In the **Environment tab**, adjust the **Rotation** value. A 180° rotation flips the environment horizontally and vertically.

2. **Reflection is too strong**: Reduce the environment's **Intensity** or increase the material's **Roughness**. A roughness of 0.1-0.3 gives sharp reflections; 0.5+ gives diffuse reflections.

3. **Reflection shows indoor environment on an outdoor product**: Switch the HDRI to an outdoor environment. KeyShot includes several environment presets — use the appropriate one for your product's context.

4. **Reflection is blurry on a mirror-like surface**: Check that the material's **Roughness** is 0 and **Specular** is high. Also check the HDRI resolution — low-resolution HDRIs produce blurry reflections. Use 4K or 8K HDRIs for sharp reflections.

## Fix 5: Bump and Normal Maps Not Working

The surface looks flat even though a bump or normal map is applied.

**Fixes**:

1. **Bump map appears too subtle**: Increase the **Bump Height** in the material's texture settings. I typically use 0.1-0.5 for subtle surface detail and 0.5-1.0 for pronounced detail.

2. **Normal map shows incorrect detail**: Check that the normal map is connected to the **Normal** slot, not the **Bump** slot. Normal maps and bump maps work differently — a normal map in the bump slot produces incorrect results.

3. **Normal map appears inverted**: Some normal maps use OpenGL convention (green channel up) while others use DirectX convention (green channel down). In KeyShot's texture settings, enable **Flip Y (Green)** to switch between conventions.

4. **Texture appears as a color on the surface**: The texture is connected to the wrong slot. A bump map should be connected to the **Bump** slot, not the **Diffuse** slot. Check the material's texture connections in the Material Graph.

## Fix 6: Transparent Materials Rendering Incorrectly

Glass or transparent plastic doesn't look right — either too dark, too transparent, or showing incorrect refraction.

**Fixes**:

1. **Glass appears black**: The material's **Refractive Index (IOR)** is set incorrectly. Use 1.5 for standard glass, 1.33 for water, 1.49 for acrylic. An IOR of 1.0 makes the material invisible.

2. **Glass appears too dark**: Increase the **Transparency** value. Also check that there are no opaque materials behind the glass that are blocking light.

3. **Glass has no refraction**: Enable **Refraction** in the material settings. Also increase the **Samples** for refraction — 8-16 samples gives clean refraction without excessive render time.

4. **Frosted glass looks noisy**: Increase the **Roughness** samples. Frosted glass uses roughness to blur the refraction, and low samples produce noise. Set samples to 16-32 for clean frosted glass.

## Fix 7: Material Color Mismatch Between Applications

A material that looks correct in SolidWorks or Rhino appears different in KeyShot.

**Root cause**: Different applications use different color spaces and lighting models. KeyShot uses physically-based rendering (PBR), which may render colors differently than the CAD application's viewport.

**Fix**:
1. In KeyShot, check the material's **Color Space** setting
2. For textures created in sRGB (most textures): set to **sRGB**
3. For linear textures (normal maps, roughness maps): set to **Linear**
4. Adjust the material's **Diffuse** color to match the intended appearance — don't rely on the CAD application's preview

## Summary

KeyShot texture mapping issues are most often caused by using UV mapping on CAD models without UV coordinates. My fix order: switch from UV to Box or Planar mapping → adjust scale and position → use Real-World Scale for consistency → use Planar mapping for labels → configure environment reflections with HDRI rotation and intensity → verify normal map connections and color space. For transparent materials, always verify IOR values and refraction sample counts.
