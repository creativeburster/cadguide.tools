---
title: "Browzwear VStitcher Export and Integration: GLB, FBX, DXF, and Browzwear Cloud Workflow"
excerpt: "Exporting garments from VStitcher requires different formats for different targets: GLB for web, FBX for 3D software, DXF for pattern production, and Browzwear Cloud for team collaboration. We cover each export workflow with settings, optimization tips, and common issues."
category: "workflow"
softwareSlug: "browzwear"
keyword: "Browzwear VStitcher export GLB FBX DXF Browzwear Cloud integration workflow"
slug: "browzwear-vstitcher-export-integration-glb-fbx-dxf-cloud"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-22"
sources:
  - "https://browzwear.com/products/v-stitcher"
  - "https://help.browzwear.com/en/articles/13065178-release-notes-vstitcher-2025-1-1"
  - "https://browzwear.com/blog/introducing-the-latest-3d-block-library"
---

# Browzwear VStitcher Export and Integration: GLB, FBX, DXF, and Browzwear Cloud Workflow

We've built export pipelines from VStitcher to web viewers, 3D rendering software, and manufacturing systems. Each target requires a specific export format and configuration. Getting the export right ensures that garments look correct in the destination platform and that production files contain all necessary information.

## Export Format Overview

| Target | Format | Key Considerations |
|--------|--------|-------------------|
| Web/e-commerce | GLB | PBR materials, file size, Draco compression |
| 3D rendering (KeyShot, Blender) | FBX | Material slots, UV coordinates, mesh quality |
| Pattern production | DXF-AAMA | Pattern geometry, notches, grading |
| Tech pack | PDF/Excel | POM measurements, BOM, flat sketches |
| Team collaboration | Browzwear Cloud | Style sharing, review, colorways |
| Animation | Alembic/FBX | Frame-by-frame geometry cache |

## GLB Export for Web and E-Commerce

GLB (binary glTF) is the standard format for web-based 3D viewing.

### Export Settings

1. File → Export → GLB
2. Select garments only (deselect avatars if not needed)
3. Configure settings:
   - **Texture Resolution**: 2048 or 4096 for web, 8192 for high-quality
   - **Mesh Quality**: Choose based on target platform
   - **Include Avatar**: Optional — include if the garment should be shown on a body
4. Click Export

### Optimization for Web

1. **Reduce mesh resolution**: Lower particle distance before export to reduce polygon count
2. **Texture compression**: Use JPEG instead of PNG for diffuse maps where transparency isn't needed
3. **Draco compression**: If the target platform supports it, enable Draco mesh compression
4. **Merge meshes by material**: Reduces draw calls for better performance
5. **Target file size**: Aim for under 5MB for standard web pages, under 15MB for dedicated 3D viewers

## FBX Export for 3D Software

FBX is the most reliable format for transferring VStitcher garments to 3D rendering and animation software.

### Export Settings

1. File → Export → FBX
2. Configure settings:
   - **Include Avatar**: Optional
   - **Mesh Quality**: High for rendering, medium for animation
   - **Texture Embedding**: Embed textures in the FBX for portability
   - **Scale**: Centimeters (standard for most 3D software)
3. Click Export

### Importing to KeyShot

1. In KeyShot, File → Import → FBX
2. Material slots are preserved from VStitcher
3. Assign KeyShot materials to each fabric slot
4. The garment appears with proper UV coordinates

### Importing to Blender

1. In Blender, File → Import → FBX
2. Material slots are preserved
3. Clean up the mesh:
   - Apply all transforms (Ctrl+A)
   - Merge duplicate vertices
   - Check UV maps

### Importing to Maya

1. In Maya, File → Import → FBX
2. Material slots appear as shading groups
3. The mesh is triangulated — retopologize for production use

## DXF-AAMA Export for Pattern Production

DXF-AAMA is the industry-standard format for transferring patterns to CAD cutting systems.

### Export Settings

1. File → Export → DXF
2. Select pattern pieces to export
3. Choose format: **DXF-AAMA** (not standard DXF)
4. Select sizes:
   - **Individual size**: Export one size
   - **Nested grading**: Export all sizes in one file
5. Configure units (mm or inches)
6. Click Export

### What's Included in the DXF

- Pattern piece outlines
- Internal lines (darts, pleats, cut lines)
- Notches and drill marks
- Grainline direction
- Seam allowances
- Pattern piece names and annotations

### Importing to CAD Systems

The DXF-AAMA file can be imported into:
- **Gerber AccuMark**: Standard pattern cutting system
- **Lectra Modaris**: Pattern making and cutting
- **Optitex**: 3D pattern making
- **Investronica**: Pattern cutting
- Most automated cutting machines support DXF-AAMA directly

## Tech Pack Export

### Generating the Tech Pack

1. Ensure all POM measurements are created
2. Set up the BOM with fabric and trim information
3. Add construction notes and callouts
4. File → Export → Tech Pack
5. Choose format:
   - **PDF**: For sharing with manufacturers
   - **Excel**: For importing into PLM systems

### Tech Pack Contents

- **Flat sketches**: Front and back technical drawings
- **POM spec sheet**: All measurements with tolerances
- **Size run**: Graded measurements for all sizes
- **BOM**: Fabric, lining, trims, hardware
- **Construction details**: Seam types, stitch specifications
- **Colorway information**: Color variants

## Browzwear Cloud Integration

Browzwear Cloud is the collaboration platform for sharing VStitcher garments with team members.

### Uploading to Browzwear Cloud

1. In VStitcher, File → Upload to Cloud
2. Configure sharing settings:
   - **Private**: Only you can access
   - **Team**: Shared with your organization
   - **External**: Shared with specific external partners
3. The garment and all associated data (patterns, fabrics, colorways) are uploaded

### Cloud Features

- **3D Viewer**: View garments in a web browser without VStitcher
- **Colorway Management**: Create and share color variants
- **Review and Comments**: Team members can leave feedback on specific garment areas
- **Version Control**: Track changes and revert to previous versions
- **Lotta Access**: Merchandisers and sales teams can access garments via Lotta

### Lotta Integration

Lotta is Browzwear's simplified tool for non-technical users:
1. Garments created in VStitcher are accessible in Lotta
2. Lotta users can:
   - View 3D garments
   - Create colorways
   - Generate presentation images
   - Share with buyers and retailers
3. Lotta does not include pattern editing or tech pack generation

## Animation Export

For animated garment visualization:

### FBX Animation Export

1. Set up an animated avatar in VStitcher
2. Simulate the garment on the animated body
3. File → Export → FBX (with animation)
4. The FBX includes the garment mesh at each frame

### Alembic Export

1. File → Export → Alembic
2. The Alembic cache contains frame-by-frame geometry
3. Import into Maya, Blender, or Houdini
4. Note: Material slots are not preserved in Alembic — reassign materials in the target software

## Common Export Issues

### Textures Missing After Export

- For FBX: enable **Embed Textures** in the export dialog
- For GLB: ensure textures are baked before export
- For Alembic: material slots are not preserved — reassign in target software

### Mesh Too Large or Too Small

- Check the export scale setting
- VStitcher uses centimeters by default
- If the target platform expects meters, the model appears 100x too large

### DXF Import Fails in CAD System

- Ensure the file is DXF-AAMA format (not standard DXF)
- Check that pattern piece names use Latin characters
- Verify units match the target system

### GLB File Too Large

- Reduce texture resolution
- Reduce mesh resolution (increase particle distance)
- Enable Draco compression
- Merge meshes by material to reduce draw calls

## Summary

VStitcher supports multiple export formats for different targets. Use GLB for web and e-commerce with texture compression and Draco encoding. Use FBX for 3D rendering software (KeyShot, Blender, Maya) with embedded textures. Use DXF-AAMA for pattern production with CAD cutting systems. Generate tech packs as PDF or Excel for manufacturers. Use Browzwear Cloud for team collaboration and Lotta for merchandiser access. For animation, use FBX with animation data or Alembic caches (reassign materials in the target software). Always verify export scale, texture embedding, and format compatibility before sending files to the target platform.
