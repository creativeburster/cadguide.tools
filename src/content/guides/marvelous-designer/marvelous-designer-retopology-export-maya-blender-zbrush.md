---
title: "Marvelous Designer Retopology and Export: Clean Mesh Workflow for Maya, Blender, and ZBrush"
excerpt: "Marvelous Designer exports triangulated meshes that need retopology for production use. I cover the retopology workflow from Marvelous Designer to Maya and Blender, preserving material slots, handling UV coordinates, and the MDD cache workaround for animated garments with multiple materials."
category: "workflow"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer retopology export Maya Blender ZBrush mesh quality"
slug: "marvelous-designer-retopology-export-maya-blender-zbrush"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://emilie_boisvert.artstation.com/blog/RDKR/marvelous-designer-to-maya-part-1-retopology-domo-arigato-auto-retopo"
  - "https://emilie_boisvert.artstation.com/blog/9E1g/marvelous-designer-to-maya-part-2-retopology-the-numbers-game"
  - "https://www.reddit.com/r/Maya/comments/evyc2o/marvelous_designer_to_maya_retopology_for/"
  - "https://subobject.co/marvelous-designer-unreal-engine-cloth-simulation/"
---

# Marvelous Designer Retopology and Export: Clean Mesh Workflow for Maya, Blender, and ZBrush

I've taken hundreds of Marvelous Designer garments through the retopology pipeline for game and film production, and the mesh quality that comes out of Marvelous Designer is never production-ready directly. The simulation produces triangulated meshes with uneven polygon distribution, and exporting clean, quad-based topology with proper UVs and material assignments requires a structured workflow.

## Understanding Marvelous Designer's Mesh Output

Marvelous Designer's simulation engine works with triangulated meshes. As one artist notes: "Triangulated cloths simulate better than quadrangular ones, meaning that when you hit the simulation button in Marvelous Designer, the cloth will 'sit' more naturally."

This is great for simulation but problematic for production:
- **Triangles instead of quads**: Most 3D applications and game engines prefer quad-based topology for deformation and subdivision
- **Uneven polygon distribution**: High-poly areas where wrinkles form, low-poly areas on flat sections
- **No edge flow control**: The simulation determines edge flow, not the artist
- **Single UV shell**: Marvelous Designer's default UV mapping is functional but not optimized

## Export Settings for Clean Topology

Before retopologizing, configure the export properly:

### OBJ Export (for Maya/ZBrush)
1. File → Export → OBJ
2. Enable **Thick** (double-sided) for garments that will be seen from both sides
3. Enable **Unified UV Coordinates** for a single UV set
4. Set **Weld** to merge vertices within a threshold
5. Select only the garments (deselect avatars)
6. Scale: Centimeters

### FBX Export (for Maya/Blender/Unreal)
1. File → Export → FBX
2. Enable **Thick** and **Unified UV Coordinates**
3. FBX preserves material slots — each fabric in Marvelous Designer becomes a separate material
4. Enable **Embed Textures** if you want materials to include texture maps

### Alembic Export (for animation caches)
1. File → Export → Alembic (ABC)
2. The animation cache is baked — each frame is a separate mesh state
3. Material slots are NOT preserved in Alembic — this is a known limitation

### MDD Export (alternative animation cache)
1. File → Export → MDD
2. Exports an OBJ (mesh) + MDD (animation data)
3. Material slots ARE preserved when used with the OBJ
4. MDD is supported by Blender's Mesh Cache modifier

## Retopology Workflow: Marvelous Designer to Maya

### Step 1: Export from Marvelous Designer
1. Simulate the garment to its final state
2. Export as OBJ with thick option and unified UVs
3. Note the polygon count — Marvelous Designer garments at resolution 5-7 typically have 50,000-200,000 triangles

### Step 2: Import to Maya
1. Import the OBJ into Maya
2. The mesh arrives as a single triangulated mesh with material assignments
3. Check that materials imported correctly (one per fabric)

### Step 3: Auto-Retopology
Maya's retopology tools (Quad Draw or automatic retopology) can convert the triangulated mesh to quads:

**Using automatic retopology**:
1. Select the mesh
2. Mesh → Retopologize
3. Set target polygon count (typically 5,000-20,000 for a garment)
4. Set target quad size based on desired detail level
5. Run the retopology

**Using Quad Draw (manual)**:
1. Create a reference mesh from the Marvelous Designer export
2. Activate Quad Draw tool
3. Manually draw quads on the surface of the reference mesh
4. This gives full control over edge flow but is time-intensive

As an Ubisoft art director describes: "Now that your Mesh's re-topology is complete, we are going to align our extraneous pieces (patches, straps, and pockets) to our garment. If you've imported internal lines from Marvelous Designer as curves in Maya, you can use them as guidelines."

### Step 4: Transfer UVs
1. Select the original mesh and the retopologized mesh
2. Use Mesh → Transfer Attributes
3. Transfer UVs from the high-poly original to the retopologized mesh
4. Clean up UV seams and packing as needed

### Step 5: Transfer Skinning
If the garment will be skinned to a character skeleton:
1. Import the character's skeletal mesh
2. Use the original Marvelous Designer mesh as a reference for skin weights
3. Transfer weights from the closest body mesh to the garment
4. Clean up weight painting around collars, cuffs, and hems

## Retopology Workflow: Marvelous Designer to Blender

### Step 1: Export and Import
1. Export from Marvelous Designer as OBJ or FBX
2. Import into Blender
3. For FBX: material slots are preserved automatically
4. For OBJ: materials may need to be reassigned

### Step 2: Retopology
Blender offers several retopology approaches:

**Using Blender's retopology tools**:
1. Add a new mesh object
2. Enable snapping to faces
3. Use the Poly Build or Face tools to draw new topology on the Marvelous Designer mesh surface
4. Target quad-based topology with even polygon distribution

**Using add-ons**:
- **RetopoFlow**: Commercial add-on with excellent retopology tools
- **BSurfaces**: Free add-on for curve-based retopology

### Step 3: UV Transfer
1. Select the original mesh, then the retopologized mesh
2. Use the Data Transfer modifier
3. Transfer UVs from the original to the retopologized mesh

## The MDD Cache Workaround for Animated Garments

When exporting animated garments (geometry caches) with multiple materials, the Alembic format loses material slots. The workaround:

1. **Export static mesh as FBX** from Marvelous Designer (preserves materials)
2. **Export animation as MDD** from Marvelous Designer (OBJ + MDD)
3. **Import FBX into Blender** — material slots are preserved
4. **In Blender Sculpt mode**: Create Face Sets based on materials
5. **Apply MDD animation** via Mesh Cache modifier — Face Sets are preserved
6. **Export from Blender as Alembic** — Face Sets become material groups
7. **Import into Unreal Engine/Maya** — material slots are intact

This workflow was documented by a practitioner at SubObject.co who discovered: "MDD files can be loaded using the Mesh Cache modifier. I imported the OBJ in Blender, applied the Face Sets, and when I applied the animation via the MDD file, the Face Sets remained!"

## Marvelous Designer's Built-in Retopology Tools

Recent versions of Marvelous Designer include basic retopology tools:
1. Select a garment in the 3D window
2. Right-click → Remeshing
3. Configure target polygon count and quad ratio
4. The remeshing tool converts triangles to a mix of quads and triangles

This is useful for quick optimization but doesn't provide the control of dedicated retopology in Maya or Blender. I use it for prototyping and use Maya/Blender for final production retopology.

## ZBrush Workflow

For garments that need sculpting detail (wrinkles, folds, surface texture):

1. Export from Marvelous Designer as OBJ
2. Import into ZBrush as a subtool
3. Use ZRemesher for automatic retopology
4. Project the original detail onto the retopologized mesh
5. Sculpt additional detail as needed
6. Export as OBJ for use in Maya/Blender/Unreal

## Common Issues

### Mesh Has Too Many Polygons After Export
- Reduce simulation resolution in Marvelous Designer before export
- Use Marvelous Designer's remeshing tool to reduce polygon count
- Use automatic retopology in Maya/Blender to target a specific polygon count

### Materials Lost After Retopology
- Retopology creates a new mesh — material assignments from the original are lost
- Use Face Sets (Blender) or shading groups (Maya) to preserve material boundaries
- Transfer material assignments from the original mesh to the retopologized mesh

### UVs Are Distorted After Retopology
- Transfer UVs from the original mesh using transfer attributes/UV transfer tools
- If UVs can't be transferred cleanly, recreate UVs on the retopologized mesh
- Use Marvelous Designer's internal lines as UV seam guides

### Garment Deforms Incorrectly After Skinning
- Transfer skin weights from the body mesh, not the Marvelous Designer mesh
- The Marvelous Designer mesh has no skin weights — it's a simulation result
- Use closest-distance weight transfer and then manually clean up problem areas

## Summary

Marvelous Designer's simulation output is never production-ready — it requires retopology for clean quad-based topology, UV transfer for proper texture mapping, and material preservation workflows. For static garments, export as FBX (preserves materials) and retopologize in Maya or Blender. For animated garments, use the MDD cache workaround through Blender to preserve material slots. For garments needing sculpted detail, use ZBrush's ZRemesher and projection workflow. Always export at the lowest simulation resolution that gives acceptable visual quality — higher resolution means more polygons to retopologize.
