---
title: "IronCAD Rendering and Animation: Creating Product Visualizations and Exploded Views"
excerpt: "How to create photorealistic renders and assembly animations in IronCAD — covering material assignment, lighting setup, camera angles, exploded view creation, and animation timeline editing."
category: "workflow"
softwareSlug: "ironcad"
keyword: "ironcad rendering animation exploded view"
slug: "ironcad-rendering-animation-exploded-view"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ironcad.com/support/rendering"
  - "https://forums.ironcad.com/forum/rendering"
---

# IronCAD Rendering and Animation: Creating Product Visualizations and Exploded Views

I produce product visualizations for client presentations directly in IronCAD — no need for KeyShot or Blender. IronCAD's built-in rendering engine handles materials, lighting, and camera setup. For assembly animations, the exploded view tool creates compelling "how it works" visuals in minutes. Here's the workflow.

## Rendering Setup

### Step 1: Assign Materials

1. Select a part in the scene.
2. Right-click → **Properties** → **Material**.
3. Choose from IronCAD's material library:
   - **Metals**: Steel, aluminum, brass, copper (with brushed, polished, or matte finishes)
   - **Plastics**: ABS, PC, PP (in various colors and surface finishes)
   - **Glass**: Clear, tinted, frosted
   - **Wood**: Oak, walnut, pine (with grain patterns)
   - **Rubber**: Natural, synthetic (matte black finish)
4. Adjust material properties:
   - **Color**: Click the color swatch to customize
   - **Roughness**: 0 (mirror) to 1 (matte)
   - **Metallic**: 0 (non-metal) to 1 (pure metal)

For custom materials, save to a personal material library for reuse across projects.

### Step 2: Set Up Lighting

IronCAD provides three light types:

1. **Ambient light** — Base illumination. Set intensity to 30-40% for natural look.
2. **Directional light** — Simulates sunlight. Position at 45° from front-left for standard product lighting.
3. **Point lights** — Localized illumination. Place 2-3 point lights around the product to fill shadows.

For studio-quality renders:
- Set ambient to 20%
- Add 1 directional light at 70% intensity, 45° angle
- Add 2 point lights at 40% intensity, positioned left and right of the product
- Set background to gradient (white to light gray)

### Step 3: Configure Camera

1. Go to **View** → **Camera** → **Properties**.
2. Set **Lens**: 50mm (standard product photography) or 85mm (compressed perspective, flattering for products).
3. Set **Angle**: Isometric (30° elevation, 45° azimuth) for technical products.
4. Enable **Depth of field**: Set focal point on the product, aperture f/4 for slight background blur.
5. Set **Resolution**: 1920×1080 for screen presentations, 3840×2160 for print.

### Step 4: Render

1. Go to **Render** → **Render Image**.
2. Set **Quality**: Draft (fast preview), Medium (client review), High (final output).
3. Set **Output**: Save as PNG (with alpha channel for compositing) or JPG.
4. Click **Render**.

Render times:
- Draft: 5–15 seconds
- Medium: 30–60 seconds
- High: 2–10 minutes (depending on scene complexity and resolution)

## Creating Exploded Views

### Step 1: Define Explosion Directions

1. Go to **Assembly** → **Exploded View**.
2. IronCAD enters exploded view mode.
3. For each part (or group of parts), define the explosion direction:
   - Select the part
   - Click an axis or face to define direction
   - Enter the explosion distance
4. IronCAD animates the part to its exploded position.

### Step 2: Auto-Explode

For quick results, use auto-explode:

1. Go to **Assembly** → **Exploded View** → **Auto-Explode**.
2. IronCAD analyzes the assembly structure and automatically defines explosion directions based on mating relationships.
3. Set **Explosion distance**: 50mm (adjust based on assembly size).
4. Click **OK** — all parts move to their exploded positions.

Auto-explode works well for linear assemblies (stacked plates, bolted joints). For complex assemblies with parts in multiple directions, manually define directions for better results.

### Step 3: Fine-Tune Positions

After auto-explode, adjust individual parts:

1. Select a part in the exploded view.
2. Drag along its explosion axis to increase or decrease distance.
3. Use Triball (F10) to reposition parts that auto-explode placed incorrectly.

### Step 4: Add Explosion Lines

1. Go to **Exploded View** → **Add Trail Lines**.
2. IronCAD draws dashed lines connecting each part to its original position.
3. These lines help viewers understand the assembly relationship.
4. Set line style: Dashed, color gray, weight 0.5mm.

## Creating Assembly Animations

### Step 1: Set Up the Timeline

1. Go to **Animation** → **Timeline**.
2. The timeline panel appears at the bottom of the screen.
3. Set **Duration**: 10 seconds (typical for product assembly animation).
4. Set **FPS**: 30 (standard for web video).

### Step 2: Create Keyframes

1. Move to time 0:00 on the timeline.
2. Set the assembly to its exploded state.
3. Click **Add Keyframe** — this records the starting position.
4. Move to time 10:00 on the timeline.
5. Set the assembly to its assembled state (parts in final position).
6. Click **Add Keyframe** — this records the ending position.
7. IronCAD automatically interpolates the motion between keyframes.

### Step 3: Add Camera Movement

1. At time 0:00, set the camera to a wide isometric view.
2. Add a camera keyframe.
3. At time 5:00, rotate the camera 90° around the product.
4. Add another camera keyframe.
5. At time 10:00, zoom in to a detail view.
6. Add a final camera keyframe.

### Step 4: Export the Animation

1. Go to **Animation** → **Export Video**.
2. Set **Format**: MP4 (H.264) or AVI.
3. Set **Resolution**: 1920×1080.
4. Set **FPS**: 30.
5. Click **Export** — IronCAD renders each frame and compiles the video.

Export times: ~5–15 minutes for a 10-second animation at 1080p, depending on scene complexity.

## Tips for Better Renders

- **Use reference images**: Import a professional product photo as a background reference for matching lighting and composition.
- **Add a ground plane**: Create a simple plane below the product with a matte material. This grounds the product and catches shadows naturally.
- **Use HDRI environments**: IronCAD supports HDRI environment maps for realistic reflections. Load an HDRI image in the Environment tab for studio-quality metal reflections.
- **Render in passes**: Render the product with transparent background (PNG with alpha), then composite in Photoshop/Canva with your company background. This gives more control over the final presentation.
