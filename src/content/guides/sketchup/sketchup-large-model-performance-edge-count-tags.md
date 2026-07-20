---
title: "SketchUp Large Model Performance: Edge Count, Tags, and 3D Warehouse Bloat"
excerpt: "A 1.4GB SketchUp file with 47 million edges brought a 64GB RAM workstation to its knees. We cover the edge count reduction, tag management, and 3D Warehouse cleanup strategies that actually work."
category: "performance"
softwareSlug: "sketchup"
keyword: "SketchUp large model performance edge count file size"
slug: "sketchup-large-model-performance-edge-count-tags"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://forums.sketchup.com/t/huge-file-size-question/273577"
  - "https://forums.sketchup.com/t/best-practices-for-optimizing-sketchup-models-for-performance-in-complex-projects/332122"
  - "https://forums.sketchup.com/t/file-becomes-too-big-like-1-4gb-making-it-slow-to-function-anyway-to-bring-it-down/307263"
  - "https://help.sketchup.com/en/cleaning-bloated-models"
  - "https://help.sketchup.com/en/sketchup/improving-performance"
---

# SketchUp Large Model Performance: Edge Count, Tags, and 3D Warehouse Bloat

A user on the SketchUp Community forum described a nightmare scenario: they had imported a 1GB 3DS file into SketchUp, which became a 1.4GB .skp file. The file consumed about 75% of their 64GB RAM and was too slow to work with. Another user had a 180MB architectural model with 12 scenes and imported 3D Warehouse components that caused lag when orbiting or using section cuts on a machine with 32GB RAM and an RTX 4070. A third user had a 1.4GB file where moving a single object could lag the computer for 10 minutes.

All three of these problems share the same root cause: too many edges and faces in the model. SketchUp is a single-threaded application for geometry processing — one CPU core does all the work. No amount of RAM or GPU power changes this fundamental limitation. The solution is always the same: reduce the edge count.

## Understanding SketchUp's Performance Bottleneck

SketchUp renders everything in real time. Every edge, face, and material in your model must be processed by a single CPU core on every screen update. The forum expert put it clearly: "An old SketchUp saying goes: Geometry is everything. It is still true. Fast graphics cards speed up the processing of raster-based features like shadows and textures, but all the faces and edges in the model must pass through the single CPU core 3D modelling applications use."

### Checking Your Edge Count

1. Go to **Window → Model Info → Statistics**
2. Check the edge and face counts
3. Check **Show nested components** to see the total including nested geometry
4. When counts run in millions, the model will slow down
5. The 1.4GB file had 47 million edges — that's what brought the workstation to its knees

### Using Extensions to Audit Model Bloat

Two extensions help identify what's bloating your model:

1. **CG Impact Report**: Analyzes component complexity and shows which components contribute the most edges
2. **SB Statistics Probe**: Provides detailed statistics about geometry distribution

Install these from the Extension Warehouse and run them on your model. The results will show you exactly which components to simplify or remove.

## Fix 1: Purge Unused Data

The simplest and most impactful fix. Your model stores all components, materials, styles, and textures you've ever added — even after deleting them from the scene.

1. Go to **Window → Model Info → Statistics**
2. Click **Purge Unused**
3. In SketchUp 2025 and later, SketchUp asks you to purge unused entities each time you save by default
4. Verify the purge worked by checking the statistics before and after

A user on the forum reported that purging reduced their file size by 70% and eliminated nearly a million edges.

## Fix 2: Clean Up 3D Warehouse Components

3D Warehouse models are the #1 cause of model bloat. The forum expert noted: "I bet that if you delete all the models from the 3DWH on your model, it will weight less than half of its actual size. Most of the models from the 3DWH are unnecessarily heavy."

### The Correct Workflow for 3D Warehouse Imports

1. **Never import directly into your project model**
2. Create a separate SketchUp file
3. Download the component into the separate file
4. Inspect the component's edge count and complexity
5. Simplify if needed:
   - Reduce circle segments (24 → 12 or 6 for small components)
   - Remove internal geometry not visible from outside
   - Replace high-res textures with flat colors or low-res images
6. Copy the cleaned component into your project model
7. Save the cleaned component as a separate .skp file for future reuse

### Using Skimp Extension for Polygon Reduction

The Skimp extension dramatically reduces polygon count of imported models:

1. Install Skimp from the Extension Warehouse
2. Import your 3D Warehouse component into a separate file
3. Select the component and run Skimp
4. Set the target polygon count (e.g., reduce from 50,000 to 5,000)
5. Skimp preserves the overall shape while reducing internal detail
6. Copy the simplified component into your project model

### Using Cleanup3 Extension

Cleanup3 by TomTom removes unnecessary geometry:

1. Install Cleanup3 from the Extension Warehouse
2. Select the geometry to clean (or the entire model)
3. Run Cleanup3 with these settings:
   - Remove stray edges
   - Merge coplanar faces
   - Remove edge materials
   - Smooth/soften edges
4. For very large models, run Cleanup3 on sections of the model rather than the whole thing at once

## Fix 3: Use Tags Aggressively

Tags control visibility. When you tag geometry and turn off the tag, SketchUp doesn't render that geometry, which improves performance.

### Tag Strategy for Large Models

1. Create tags for each major category: **Walls**, **Roof**, **Furniture**, **Landscaping**, **Interior**, **Exterior**
2. Assign tags to groups and components (not to raw geometry)
3. While modeling, turn off tags for categories you're not working on
4. For presentations, turn on only the tags needed for the current view

### Important: Don't Tag Raw Geometry

Tags should be assigned to groups and components, not to individual edges and faces. If you tag raw geometry, you'll create a mess that's difficult to manage and can cause display issues.

## Fix 4: Reduce Circle and Arc Segments

Every circle in SketchUp is made of straight edges. A 24-segment circle has 24 edges. A 24-segment arc has 24 edges. When you have hundreds of circles in your model (furniture, pipes, bolts), the edge count adds up fast.

1. Before drawing a circle or arc, type the segment count:
   - Type `6s` for 6 segments (sufficient for small components)
   - Type `12s` for 12 segments (good for medium components)
   - Type `24s` for 24 segments (only for large, prominent features)
2. For existing circles, use the **Entity Info** panel to reduce segments
3. A circle going from 24 segments to 6 segments reduces its edge count by 75%

## Fix 5: Use Components Instead of Groups

When you copy a component, SketchUp stores one definition and multiple instances. When you copy a group, each group has its own unique geometry.

The forum expert noted: "Every object in the model is unique — no instancing appears to have been preserved at all. This is why both the file itself is so big, but it will also be why it is so slow."

1. Use **Components** (G key) for repeated objects like windows, doors, furniture
2. Use **Groups** (G key, then right-click → Make Group) only for unique geometry
3. If you have 100 identical groups, convert them to components:
   - Select one group
   - Right-click → **Make Component**
   - Delete the other 99 groups
   - Copy the component 99 times
   - File size and memory usage will drop dramatically

## Fix 6: Use Proxy Components for Rendering

If you render with V-Ray or Enscape, use proxy components instead of full-detail geometry:

1. Create a low-poly placeholder component (a simple box)
2. In your render engine, link the placeholder to a high-detail proxy file
3. SketchUp only processes the low-poly placeholder
4. The render engine loads the high-detail geometry only during rendering

This is especially useful for vegetation, cars, and people — objects that need detail in renders but not in the SketchUp viewport.

## Fix 7: Material and Texture Optimization

High-resolution textures consume significant memory. The forum expert noted: "There are a number of excessively large texture images. Since the textures get downsampled anyway, there's really no point in them being so large."

1. Use **Material Resizer** extension (by Trimble) to batch-resize textures
2. Set maximum texture resolution to 512×512 for large-scale models
3. Use 1024×1024 only for close-up materials
4. Use JPEG instead of TIFF for textures — JPEG is smaller and sufficient for most cases
5. Replace textures with flat colors for distant or background objects

## Fix 8: Fast Styles for Modeling

Create a "fast style" that disables shadows, textures, and edge effects during modeling:

1. Go to **Window → Default Tray → Styles**
2. Create a new style:
   - **Edge Settings**: Disable profiles, depth cue, extension
   - **Face Settings**: Set to **Front Color** only (no textures)
   - **Background Settings**: Plain white or light gray
   - **Shadow Settings**: Disable shadows
3. Save this style as "Fast Modeling"
4. Switch to a presentation style only for final views and exports

## Fix 9: Split Large Models

If your model is still too large after all optimizations, split it into multiple files:

1. Create a master file with the building shell and major structure
2. Create separate files for interior, landscaping, furniture, etc.
3. Use **Components → Reload** to link files together
4. Only load the files you're currently working on
5. For LayOut, link each viewport to the appropriate file

## Real-World Impact

The user with the 64GB RAM workstation upgraded to 128GB and reported: "It takes several minutes to load the 1.5GB SU file, but after that I can now easily manipulate it, it went from unusable to being able to orbit etc in real time with no delays." But adding RAM is a last resort — the edge count reduction strategies above are more effective and don't require hardware upgrades.

## Summary

| Fix | Edge Count Reduction | Difficulty |
|-----|---------------------|------------|
| Purge unused data | 10-70% | Easy |
| Clean 3D Warehouse components | 30-80% | Medium |
| Reduce circle segments | 10-40% | Easy |
| Convert groups to components | 20-60% | Easy |
| Use proxy components | 50-90% | Medium |
| Material/texture optimization | 10-30% | Easy |
| Fast styles for modeling | No reduction, but faster display | Easy |

Start with Purge Unused — it takes 5 seconds and can reduce file size by up to 70%. Then audit your 3D Warehouse imports, which are the most common source of bloat. Finally, adopt the workflow of importing 3D Warehouse components into a separate file first, cleaning them up, and only then copying them into your project model.
