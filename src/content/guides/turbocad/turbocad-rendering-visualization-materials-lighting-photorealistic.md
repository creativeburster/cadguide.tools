---
title: "TurboCAD Rendering and Visualization: Materials, Lighting, and Photorealistic Output"
excerpt: "A guide to creating photorealistic renders in TurboCAD Platinum using the Lightworks rendering engine, covering material assignment, lighting setup, environment configuration, and high-resolution image export."
category: "workflow"
softwareSlug: "turbocad"
keyword: "turbocad rendering visualization"
slug: "turbocad-rendering-visualization-materials-lighting-photorealistic"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.turbocad.com/documentation/rendering"
  - "https://www.turbocad.com/products/turbocad-platinum"
---

# TurboCAD Rendering and Visualization: Materials, Lighting, and Photorealistic Output

TurboCAD Platinum includes the Lightworks rendering engine for photorealistic visualization of 3D models. While not as advanced as dedicated rendering tools like KeyShot or V-Ray, it produces presentation-quality images suitable for client presentations and design reviews. This guide covers the complete rendering workflow.

## Setting Up the Rendering Environment

### View Setup

1. Set view: View > Isometric > SE Isometric (or custom view)
2. Set visual style: View > Visual Styles > Realistic
3. Zoom to frame the model: View > Zoom > Extents

### Render Configuration

1. Tools > Render > Render Settings
2. Select render quality:
   - **Draft**: Fast preview, low quality
   - **Standard**: Balanced speed/quality
   - **High**: Slow, high quality
   - **Ultra**: Very slow, maximum quality
3. Set output resolution:
   - 800x600 for preview
   - 1920x1080 for presentation
   - 3840x2160 for print-quality

## Material Assignment

### Applying Materials

1. Tools > Render > Materials palette
2. Select a material from the library (e.g., Metals > Brushed Aluminum)
3. Drag the material onto a 3D face
4. The material is applied to that face

### Material Categories

TurboCAD's material library includes:
- **Metals**: Aluminum, steel, brass, copper, chrome, gold
- **Plastics**: Matte, glossy, textured
- **Wood**: Oak, pine, mahogany, walnut
- **Stone**: Granite, marble, concrete, brick
- **Glass**: Clear, tinted, frosted
- **Fabrics**: Cloth, leather, carpet
- **Miscellaneous**: Rubber, ceramic, water

### Custom Materials

To create a custom material:

1. Tools > Render > Materials > New
2. Set properties:
   - **Color**: RGB values or color picker
   - **Diffuse**: How much light scatters (0-1)
   - **Specular**: Highlight intensity (0-1)
   - **Roughness**: Surface smoothness (0 = mirror, 1 = matte)
   - **Transparency**: 0 = opaque, 1 = fully transparent
   - **Refraction**: For glass/water (1.0 = air, 1.5 = glass, 1.33 = water)
   - **Texture**: Apply an image map (BMP, JPG, PNG)

### Texture Mapping

For textured materials (wood grain, brick pattern):

1. Apply the textured material to the face
2. Tools > Render > Texture Mapping
3. Select the face
4. Choose mapping type:
   - **Planar**: Projects texture flat (good for walls)
   - **Cylindrical**: Wraps around cylinders
   - **Spherical**: Wraps around spheres
   - **Box**: Projects from all six directions
5. Adjust scale, rotation, and offset to position the texture

## Lighting Setup

### Default Lighting

TurboCAD provides default headlamp lighting (a light at the camera position). This is sufficient for basic previews but produces flat results.

### Adding Lights

1. Insert > Light > choose light type:
   - **Point Light**: Omnidirectional light (like a bare bulb)
   - **Spot Light**: Directional cone of light
   - **Distant Light**: Parallel rays (simulates sunlight)
   - **Area Light**: Soft light from a rectangular area

2. Position the light by clicking in the drawing
3. Set light properties:
   - **Intensity**: 0-1 (0.5-0.8 is typical for key light)
   - **Color**: White for neutral, warm for tungsten, cool for LED
   - **Shadows**: On/Off (on for realism, off for speed)
   - **Shadow softness**: 0 = hard, 1 = very soft

### Three-Point Lighting Setup

For professional results, use three-point lighting:

1. **Key Light**: Distant light at 45° from front-left, intensity 0.7, shadows on
2. **Fill Light**: Point light at front-right, intensity 0.3, shadows off
3. **Back Light**: Spot light from behind, intensity 0.5, shadows off

### Sun Light

For architectural exteriors:

1. Insert > Light > Distant Light
2. Set direction to match sun angle:
   - Azimuth: 135° (southeast)
   - Altitude: 45° (mid-afternoon)
3. Set color to warm white (slight yellow tint)
4. Enable shadows

## Environment Settings

### Background

1. Tools > Render > Environment
2. Set background type:
   - **Solid Color**: Single color (e.g., light gray for studio)
   - **Gradient**: Two-color gradient (e.g., blue to white for sky)
   - **Image**: HDR or image background (for realistic reflections)

### Ground Plane

1. Tools > Render > Environment > Ground Plane
2. Enable ground plane
3. Set material (e.g., concrete, grass)
4. Set size (large enough to receive shadows)

### Image-Based Lighting (IBL)

For realistic reflections and ambient light:

1. Tools > Render > Environment > IBL
2. Load an HDR image (e.g., studio, outdoor, sky)
3. The HDR image provides:
   - Ambient lighting from all directions
   - Realistic reflections on metallic/glass surfaces
4. Set IBL intensity (0.3-0.5 typically)

## Rendering and Export

### Render to Screen

1. Tools > Render > Render to Screen
2. The render processes and displays in the viewport
3. Use Draft quality for previews, High/Ultra for final output

### Render to File

1. Tools > Render > Render to File
2. Set output format:
   - **PNG**: Lossless, supports transparency
   - **JPG**: Smaller files, slight quality loss
   - **BMP**: Uncompressed, large files
   - **TIFF**: Professional format, supports 16-bit
3. Set resolution (1920x1080 minimum for presentation)
4. Set quality (High or Ultra)
5. Click Render — the image is saved to the specified file

### Batch Rendering

For rendering multiple views:

1. Save multiple named views: View > Named Views > Save
2. Create a render script or use Tools > Render > Batch Render
3. Specify views and output files
4. TurboCAD renders each view sequentially

## Common Rendering Issues

### Render Is Too Dark

**Cause**: Insufficient lighting or dark materials.
**Fix**: Add a fill light, increase light intensity, or use IBL for ambient light. Check material diffuse values.

### Shadows Are Too Harsh

**Cause**: Shadow softness is 0 (hard shadows).
**Fix**: Increase shadow softness to 0.5-0.8. Use area lights instead of point lights for naturally soft shadows.

### Materials Look Flat

**Cause**: No specular highlights or environment reflections.
**Fix**: Increase specular value on materials. Enable IBL for realistic reflections. Add a background image or gradient.

### Render Takes Too Long

**Cause**: High quality settings with complex geometry.
**Fix**: Use Draft quality for previews. Reduce output resolution. Disable shadows for test renders. Simplify geometry by reducing facet count.

## Conclusion

TurboCAD Platinum's Lightworks rendering engine produces presentation-quality images when configured correctly. The key to good results is three-point lighting, appropriate material assignment with texture mapping, and an environment with IBL for realistic reflections. Start with Draft quality for composition, then switch to High or Ultra for final output. By following the lighting and material workflows in this guide, you can create professional renders without exporting to a dedicated rendering application.
