---
title: "CLO 3D Export Workflows: GLB for Web, FBX for Blender, and Unreal Engine LiveSync"
excerpt: "Exporting garments from CLO 3D requires different workflows depending on the target platform. I cover GLB export for web and e-commerce, FBX to Blender for cleanup and optimization, Unreal Engine LiveSync for real-time fashion visualization, and the specific export settings for each pipeline."
category: "workflow"
softwareSlug: "clo-3d"
keyword: "CLO 3D export GLB FBX Blender Unreal Engine LiveSync workflow"
slug: "clo-3d-export-workflows-glb-fbx-blender-unreal-engine"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-06-22"
sources:
  - "https://www.vntana.com/resource/clo3d/"
  - "https://konfiwear.com/blog/clo3d-to-konfiwear-apparel-workflow"
  - "https://www.avgguild.org/post/unreal-engine-for-fashion-real-brands-real-projects-and-a-clo3d-to-real-time-pipeline"
  - "https://support-connect.clo-set.com/hc/en-us/articles/45304309404441-Opening-CLO-MD-LiveSync-Mode"
---

# CLO 3D Export Workflows: GLB for Web, FBX for Blender, and Unreal Engine LiveSync

I've built CLO 3D export pipelines for e-commerce product pages, virtual try-on platforms, and Unreal Engine fashion visualizations. Each target platform requires a different export format and optimization workflow. Getting the export right is critical — even a perfectly designed garment can look terrible in the final platform if the mesh, UVs, or materials aren't properly configured.

## Export Format Overview

| Target Platform | Format | Key Considerations |
| --- | --- | --- |
| Web/e-commerce | GLB | PBR materials, file size optimization, Draco compression |
| Blender cleanup | FBX | Material slots preserved, unified UVs |
| Unreal Engine | USD/LiveSync | Simulation data, Chaos Cloth, MetaHuman support |
| ZBrush sculpting | OBJ | High-poly mesh, material groups |
| Animation cache | Alembic/MDD | Frame-by-frame geometry, material slot limitations |
| Production patterns | DXF-AAMA | Flat pattern data, not 3D mesh |

## GLB Export for Web and E-Commerce

GLB (binary glTF) is the standard format for web-based 3D. It supports PBR materials, is widely supported by web 3D libraries (Three.js, Babylon.js), and can be compressed for fast loading.

### Standard GLB Export

VNTANA's CLO 3D guide recommends: "We recommend a standard GLB export at this time because it maintains the texture quality in great detail, it requires the least amount of preparation steps, and it produces an extremely optimized result."

1. File → Export → glTF 2.0 (GLB)
2. Select garments only (deselect avatars)
3. Enable **Thick** for double-sided garments
4. Set scale appropriately (meters for most web viewers)
5. Click OK

### Unified UV Coordinates Export

For platforms that require a single UV set:
1. Before exporting, set up the **UV Editor** workspace
2. Arrange pattern pieces with space between them (for margin)
3. Orient pattern pieces along their grain direction
4. File → Export → glTF 2.0 (GLB)
5. Enable **Unified UV Coordinates**
6. This creates a single UV map covering all garment pieces

### Texture Baking

For high-quality textures in the GLB:
1. In the UV Editor, use **Bake Textures**
2. Set texture size to **4096 or 8192** for high quality
3. Set UV area to **All Tiles**
4. Set **Fill Texture Seams** to 64 pixels
5. Check all texture types (diffuse, normal, roughness, metallic)
6. Save baked textures to a folder

### GLB Optimization in Blender

For web delivery, optimize the GLB in Blender:
1. Import the GLB into Blender
2. Select all mesh objects
3. Navigate to Mesh → Apply → All Transforms
4. Merge meshes by material (select parts with same material, join them)
5. Clean up unused material slots
6. Export as GLB with **Draco compression** enabled
7. Disable Shape Keys (Draco doesn't support morph targets)

A Konfiwear workflow guide emphasizes: "All mesh parts that share the same material must also share the same UV name. The configurator uses UVs to generate print files. Shared materials with different UV names cause broken exports."

## FBX Export to Blender

FBX is the most reliable format for transferring CLO garments to Blender for cleanup, retopology, and optimization.

### Export Settings

1. File → Export → FBX
2. Enable **Unified UV Coordinates**
3. Enable **Export as Multiple Objects** (keeps garment parts separate)
4. Enable **Thick** for double-sided geometry
5. Leave other settings at default
6. Scale: Centimeters

### Blender Import and Cleanup

1. File → Import → FBX in Blender
2. Material slots are preserved from CLO
3. Clean up the mesh:
   - Merge duplicate vertices
   - Remove unused material slots
   - Check UV maps for errors
   - Apply all transforms (Ctrl+A → All Transforms)

### Merging Meshes by Material

For optimized exports, merge all mesh parts that share the same material:
1. Identify parts using the same material
2. Select them together in the outliner
3. Join them (Ctrl+J)
4. This reduces draw calls and improves performance in real-time applications

## Unreal Engine LiveSync

CLO 3D (and Marvelous Designer) include a LiveSync plugin for Unreal Engine that enables real-time synchronization between the two applications.

### Setting Up LiveSync

1. Install the LiveSync plugin from the Epic Marketplace
2. In Unreal Engine, enable the plugin (Edit → Plugins → search "LiveSync")
3. Ensure CLO 3D is running
4. In Unreal Engine, open the LiveSync tab (Shift+9 or Selection Mode → CLO/MD LiveSync)
5. Click "Update" to sync the current CLO scene

### LiveSync Options

The LiveSync documentation describes the key options:

**Garment Import**:
- **Include Garment**: Brings garments from CLO to Unreal Engine
- **Single Object vs. Multiple Object**: Weld meshes together or keep separate
- **Thin vs. Thick**: Thin = Textured Surface mode, Thick = Thick Texture Surface mode
- **Unified UV Coordinate**: Enable for single UV set

**Simulation Data**:
- **Include Garment Simulation Data**: Prerequisite for Chaos Cloth Asset creation
- **Include Cache Animation**: Brings animated garment data as Geometry Cache Asset

**Avatar Import**:
- **Include Avatar**: Brings avatars from CLO to Unreal (skeletal mesh if it has joints)

**Material Settings**:
- **Translucent vs. Opacity Mask**: Choose material blend mode for garments
- **Flip Green Channel**: Flips green channel for normal maps (needed for some workflows)

**Pose Transition**:
- Introduced in LiveSync 2.1.0
- Select a start pose (e.g., A-pose) and target animation (e.g., running)
- Set transition duration
- Makes it easier to dress MetaHumans before transitioning to animation

### Chaos Cloth Setup

For real-time cloth simulation in Unreal Engine:
1. Enable "Include Garment Simulation Data" in LiveSync
2. In Unreal Engine, the garment can be saved as a **Chaos Cloth Asset**
3. The simulation data from CLO (bending, stretch, shear, density) is preserved
4. Configure collision settings in the Chaos Cloth Asset editor
5. Assign the cloth asset to your character's skeletal mesh

### Unreal Engine for Fashion Visualization

As one production guide describes: "If Unreal is the stage, CLO3D is often where the garment becomes real. A common production flow: design and simulate in CLO3D, export with real-time in mind, look-dev and final output in Unreal."

The key advantages of Unreal Engine for fashion:
- **Real-time rendering**: Photorealistic results without offline render times
- **Lighting flexibility**: Multiple lighting setups and moods in minutes
- **Camera freedom**: Virtual cameras for runway-style shots
- **Interactive experiences**: Virtual showrooms and try-on applications
- **Colorway iteration**: Swap colors and materials in real-time

## OBJ Export for ZBrush

For garments that need sculpting detail:
1. File → Export → OBJ
2. Enable **Thick** for double-sided geometry
3. Enable **Unified UV Coordinates**
4. In ZBrush, import as a subtool
5. Use ZRemesher for retopology
6. Project original detail onto retopologized mesh
7. Sculpt additional wrinkles and surface detail

## Pre-Export Checklist

Before exporting from CLO 3D, verify:

1. **Pattern piece names**: Use only Latin letters. Non-Latin characters cause export errors in some platforms
2. **Grainline orientation**: Pattern pieces should be oriented along grain direction in the 2D window
3. **Topstitch type**: Set to "Texture" rather than "OBJ" for export compatibility
4. **UV layout**: Set up in the UV Editor before exporting with Unified UV Coordinates
5. **Simulation state**: Ensure the garment is in its final simulated state
6. **Avatar selection**: Deselect avatars if you only want to export garments
7. **Scale**: Verify the export scale matches your target platform (cm vs. m)

## Common Export Issues

### Textures Appear at Wrong Scale

The texture DPI doesn't match between CLO and the target application. Ensure all textures are at the same DPI as the original scan (typically 300 DPI). Edit DPI in Photoshop before importing back to CLO.

### Materials Missing After Export

- For FBX: materials should transfer automatically
- For GLB: ensure textures are baked before export
- For Alembic: material slots are not preserved — use the Blender MDD workaround
- For OBJ: material groups are preserved but may need reassignment

### Mesh Appears Too Large or Too Small

Check the export scale setting. CLO uses centimeters by default. If your target platform expects meters, the model will appear 100x too large. Set the scale explicitly in the export dialog.

### Avatar Transforms Not Applied

When exporting with the avatar, transforms may not be applied. In Blender:
1. Select the avatar and accessories
2. Apply all modifiers
3. Navigate to Mesh → Apply → All Transforms
4. Re-export

## Summary

CLO 3D supports multiple export workflows for different target platforms. For web and e-commerce, use GLB with baked textures and Draco compression. For Blender cleanup and retopology, use FBX with unified UVs and multiple objects. For Unreal Engine real-time fashion visualization, use the LiveSync plugin with garment simulation data enabled for Chaos Cloth. Always verify pattern piece names use Latin letters, set up UVs in the UV Editor before unified UV export, and check export scale before sending to the target platform. The pre-export checklist — names, grainlines, topstitch type, UVs, simulation state, scale — prevents the most common export issues.
