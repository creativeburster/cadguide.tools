---
title: "MatrixGold Rendering and Presentation: Metals, Gems, and Client Visualization"
excerpt: "MatrixGold's rendering tools create photorealistic jewelry visualizations for client approval and marketing. I cover metal material configuration, gem rendering settings, lighting setup, and creating presentation images and turntable animations."
category: "workflow"
softwareSlug: "matrixgold"
keyword: "MatrixGold rendering presentation metals gems lighting client visualization KeyShot"
slug: "matrixgold-rendering-presentation-metals-gems-client-visualization"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://matrixgoldbook.com/product/designing-jewelry-with-matrixgold/"
  - "https://www.udemy.com/course/matrixgold-essentials-for-jewelers-video-training-course/"
  - "https://www.coursehero.com/file/161703770/MatrixGold2019TrainingGuidepdf/"
---

# MatrixGold Rendering and Presentation: Metals, Gems, and Client Visualization

I've rendered hundreds of jewelry pieces in MatrixGold for client presentations, e-commerce catalogs, and marketing materials. The rendering quality can make or break a sale — clients buy with their eyes, and a photorealistic render often closes the deal before the physical piece is even made. MatrixGold's rendering tools, powered by KeyShot integration, produce stunning metal and gem visualizations when configured correctly.

## Rendering in MatrixGold

MatrixGold uses integrated rendering (powered by KeyShot) for photorealistic jewelry visualization. The rendering workflow involves:

1. **Assign materials** to metal and gem components
2. **Configure lighting** for jewelry-specific illumination
3. **Set up the camera** for the best angle
4. **Configure render settings** for quality vs. speed
5. **Render** the final image

## Metal Materials

### Assigning Metal Materials

1. Select the metal body (without gems)
2. Open the **Material Editor** (right-click → Material)
3. Choose a metal type:
   - **Gold 14K Yellow**: Warm yellow tone
   - **Gold 18K Yellow**: Richer yellow than 14K
   - **Gold 14K White**: Cool white, slightly gray
   - **Gold 18K White**: Brighter white than 14K
   - **Platinum**: Cool gray-white, high reflectivity
   - **Silver**: Bright white, slightly warm
   - **Rose Gold**: Pinkish hue from copper content
   - **Black Rhodium**: Dark gunmetal finish
4. Adjust material properties:
   - **Roughness**: 0.05-0.15 for polished metal, 0.2-0.4 for brushed
   - **Reflectivity**: High for polished metal (0.8-0.95)
   - **Color**: Fine-tune the metal tint if needed

### Metal Finishes

- **Polished**: Low roughness (0.05), high reflectivity — mirror-like shine
- **Satin/Brushed**: Higher roughness (0.2-0.4), directional texture — soft sheen
- **Matte**: High roughness (0.5+), low reflectivity — no shine
- **Hammered**: Apply a bump map for texture — organic surface

## Gem Materials

### Assigning Gem Materials

1. Select the gems in the model
2. Open the **Material Editor**
3. Choose a gem type:
   - **Diamond**: High refractive index (2.42), high dispersion
   - **Sapphire**: Refractive index 1.77, various colors
   - **Ruby**: Refractive index 1.77, red color
   - **Emerald**: Refractive index 1.58, green color
   - **Amethyst**: Refractive index 1.55, purple color
   - **Citrine**: Refractive index 1.55, yellow-orange color
   - **Topaz**: Refractive index 1.62, various colors
   - **Moissanite**: Refractive index 2.65, higher dispersion than diamond
4. Configure gem properties:
   - **Refractive Index (IOR)**: Controls how light bends through the gem
   - **Dispersion**: Controls the "fire" (color splitting) effect
   - **Color**: Gem color (saturation and hue)
   - **Transparency**: How much light passes through (0.85-0.98 for most gems)
   - **Abbe Number**: Controls dispersion amount (low = more fire)

### Diamond Rendering Settings

For the most realistic diamond rendering:
- **IOR**: 2.42
- **Dispersion**: High (Abbe number ~55)
- **Transparency**: 0.98
- **Color**: Slightly tinted (near-colorless to faint yellow for lower grades)
- **Surface roughness**: 0.01-0.02 (polished facets)

### Colored Stone Settings

- **Sapphire (blue)**: IOR 1.77, color deep blue, transparency 0.90
- **Ruby (red)**: IOR 1.77, color deep red, transparency 0.88
- **Emerald (green)**: IOR 1.58, color deep green, transparency 0.85
- **Amethyst (purple)**: IOR 1.55, color purple, transparency 0.92

## Lighting Setup

### Jewelry Lighting Principles

Jewelry rendering requires specific lighting to showcase metal shine and gem brilliance:

1. **Key light**: Main light source, typically from upper left (45° angle)
2. **Fill light**: Softer light from the opposite side to reduce harsh shadows
3. **Rim light**: Light from behind to create edge highlights on metal
4. **Environment**: HDRI environment map for realistic reflections

### HDRI Environment

1. Use a jewelry-specific HDRI map (studio or showcase environment)
2. The HDRI provides realistic reflections on metal surfaces
3. Choose an HDRI with:
   - Soft, diffuse lighting (not harsh direct light)
   - Neutral color (gray/white studio environment)
   - Visible light sources for sparkle highlights on gems

### Light Configuration

- **Key light intensity**: 2-3x environment intensity
- **Fill light intensity**: 0.5-1x environment intensity
- **Rim light intensity**: 1.5-2x environment intensity
- **Light temperature**: 5500K (neutral white) for accurate metal color

### Sparkle Enhancement

To enhance gem sparkle in renders:
1. Add small point lights near the gems
2. Set point light intensity high (5-10x)
3. Position lights to create reflections in the gem facets
4. Use multiple small lights for multiple sparkle points
5. This simulates the dynamic sparkle seen in real gems

## Camera Setup

### Camera Angle

For rings:
- **Three-quarter view**: Shows the top and side simultaneously (most common)
- **Top view**: Shows the gem layout and setting pattern
- **Side profile**: Shows the shank profile and gallery
- **Straight-on**: Shows the face of the ring

For pendants:
- **Front view**: Shows the full design
- **Three-quarter view**: Shows depth and dimension
- **On-chain view**: Shows the pendant on a chain for context

For earrings:
- **Front view**: Shows the design
- **Side view**: Shows the profile and depth

### Camera Settings

- **Field of View**: 35-50mm equivalent (moderate telephoto for minimal distortion)
- **Depth of Field**: Optional — focus on the center stone, blur the background
- **Background**: White, gray, or black (white is most common for jewelry)
- **Resolution**: 1500x1500 for web, 3000x3000 for print

## Render Settings

### Quality Settings

- **Draft**: Fast rendering, lower quality — for design review
- **Standard**: Medium quality — for client presentation
- **High**: High quality — for marketing materials
- **Maximum**: Highest quality — for print catalogs

### Render Parameters

- **Samples**: 500-1000 for production quality
- **Ray bounces**: 10-15 for gems (light needs to bounce through facets)
- **Caustics**: Enable for realistic gem light refraction
- **Anti-aliasing**: High for smooth edges

### Render Time

- **Draft**: 10-30 seconds
- **Standard**: 1-5 minutes
- **High**: 5-20 minutes
- **Maximum**: 20-60 minutes (depending on model complexity)

## Turntable Animation

For interactive client presentations:

1. Set up the camera and materials
2. Enable **Turntable** in the render settings
3. Set the number of frames (36 for 10° increments, 72 for 5°)
4. Set rotation direction (clockwise or counter-clockwise)
5. Render all frames
6. The frames can be combined into a video or GIF
7. Turntable animations show the piece from all angles

## Common Rendering Issues

### Metal Looks Flat or Gray

- Increase environment intensity
- Use a better HDRI map with more visible light sources
- Increase metal reflectivity
- Reduce roughness for more mirror-like reflections
- Add rim lighting for edge highlights

### Gems Look Dark or Glassy

- Increase ray bounces (light needs to bounce through facets)
- Enable caustics for proper light refraction
- Increase gem transparency
- Add point lights near the gems for sparkle
- Verify the correct IOR for the gem type

### Render Takes Too Long

- Reduce sample count
- Reduce ray bounces (but gems need at least 10)
- Reduce resolution for draft previews
- Disable caustics for faster rendering
- Simplify the model (fewer gems = faster render)

### Colors Don't Match Real Metal

- Verify the metal material preset matches the actual alloy
- Adjust the color tint manually
- Check light temperature (5500K is neutral)
- Compare against reference photos of the actual metal

## Summary

MatrixGold rendering creates photorealistic jewelry visualizations for client approval and marketing. Assign metal materials with appropriate roughness (0.05 for polished, 0.2-0.4 for brushed) and reflectivity. Configure gems with correct IOR (2.42 for diamond, 1.77 for sapphire/ruby) and transparency. Use a jewelry-specific HDRI environment for realistic metal reflections, and add point lights near gems for sparkle. Position the camera at a three-quarter angle for rings to show top and side simultaneously. Render at high quality with 500+ samples and 10+ ray bounces for gems. Create turntable animations for interactive client presentations. The most common issues — flat metal, dark gems, and long render times — are fixed by adjusting environment intensity, ray bounces, and sample count respectively.
