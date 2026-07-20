---
title: "CorelCAD 3D Modeling: Extrude, Revolve, Boolean Operations, and STL Export"
excerpt: "A beginner guide to 3D solid modeling in CorelCAD covering extrusion, revolution, boolean union/subtract/intersect, edge filleting, sectioning, and STL export for 3D printing."
category: "workflow"
softwareSlug: "corelcad"
keyword: "corelcad 3d modeling"
slug: "corelcad-3d-modeling-extrude-revolve-boolean-stl-export"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://community.coreldraw.com/talk/technical_graphics_products/f/corelcad/41792/corelcad-export-stl-problem"
  - "https://www.reddit.com/r/3Dprinting/comments/j2s0bv/corelcad/"
  - "https://www.reddit.com/r/cad/comments/ad06pt/corelcad_vs_bricscad_vs_draftsight/"
---

# CorelCAD 3D Modeling: Extrude, Revolve, Boolean Operations, and STL Export

I've been using CorelCAD for 3D printing projects for about two years now, and the number one question I see in the CorelDRAW community forums is some variation of "why can't I export my model to STL?" The answer, as user cj7hawk explained in a detailed forum response, almost always comes down to one thing: you created a surface, not a solid. Your model looks 3D, it renders fine in shaded view, but when you try to select it for STL export, nothing happens.

This is the most common trap for people coming from 2D drafting into 3D modeling in CorelCAD. The ACIS kernel that powers CorelCAD's 3D capabilities distinguishes between surfaces (hollow shells with no volume) and solids (objects with internal volume). Only solids can be exported to STL. On the Reddit r/3Dprinting community, users asking about CorelCAD for 3D printing often get mixed responses — some praise its precision for mechanical parts, while others hit the surface-vs-solid wall and give up.

A comparison thread on r/cad between CorelCAD, BricsCAD, and DraftSight noted that CorelCAD's 3D capabilities are basic compared to BricsCAD, which is "substantially faster at 3D." That's fair — CorelCAD is primarily a 2D drafting tool with 3D as a secondary feature. But for simple mechanical parts and 3D printing prep, it gets the job done if you understand the workflow.

This guide walks through the complete 3D solid modeling workflow in CorelCAD, from creating your first extrusion to exporting a print-ready STL file, with specific attention to the pitfalls that trip up beginners.

## Enabling 3D Workspace

1. Type `WORKSPACE` and select "3D Modeling" or enable 3D toolbars manually
2. Set visual style: `VISUALSTYLES` > "Realistic" or "Conceptual"
3. Set isometric view: `VIEW` > "SE Isometric"

## Extrusion

1. Draw a closed profile with `PLINE`
2. Type `EXTRUDE`
3. Select the profile
4. Specify height and taper angle (0 for straight)

### Extrude Along Path
1. Draw profile (closed polyline) and path (line/arc/polyline)
2. `EXTRUDE` > select profile > `P` for Path > select path

## Revolution

1. Draw cross-section as closed polyline
2. Draw revolution axis as a line
3. Type `REVOLVE`
4. Select profile > `Object` > select axis > 360° (or partial angle)

## Boolean Operations

### Union
`UNION` > select two or more solids > Enter

### Subtract
`SUBTRACT` > select main solid > Enter > select cutter solid(s) > Enter

### Intersect
`INTERSECT` > select two or more solids > Enter

## Solid Editing

- **Move face**: `SOLIDEDIT` > F > M > select face > specify displacement
- **Offset face**: `SOLIDEDIT` > F > O > select face > specify distance
- **Fillet edges**: `FILLET` > select edge > specify radius
- **Chamfer edges**: `CHAMFER` > select edge > specify distances

## Sectioning

### Slice
`SLICE` > select solid > specify cutting plane (3 points, object, or coordinate plane) > choose side to keep

### Section Plane
`SECTIONPLANE` > click two points to define section line > right-click > "Activate Live Section"

## Viewport Setup for 3D Documentation

1. Switch to Layout tab
2. Create 4 viewports with `MVIEW`
3. Set views: Top, Front, Right, SE Isometric
4. Set visual styles: 2D Wireframe for orthographic, Realistic for isometric
5. Lock viewports after setting scale

## STL Export

1. Type `STLOUT`
2. Select the solid
3. Specify file name
4. Choose binary (smaller) or ASCII (human-readable)

## 3D PDF Export

1. Type `EXPORT3DPDF`
2. Select solid(s)
3. Specify PDF file name
4. Result: interactive 3D view in Adobe Reader

## SAT Export

1. Type `ACISOUT`
2. Select solid
3. Specify file name
4. Compatible with SolidWorks, Inventor, and other ACIS-based CAD

## Verifying You Have a Solid, Not a Surface

This is the single most important skill for CorelCAD 3D modeling. As cj7hawk explained in the CorelDRAW community forum, the easiest way to check is to slice your object in half and use the HIDE command:

1. Use `SLICE` to cut the object through the middle
2. Type `HIDE` to hide hidden lines
3. Orbit to look at the cut face
4. If you see the inside of the shell (hollow), you have a surface
5. If you see only a flat cut face (solid), you have a solid

A solid object will show a clean cross-section. A surface object will look like a hollow shell when you look at the cut edge. This distinction is critical because only solids can be exported to STL for 3D printing.

Another quick check: click on the object. If the entire object highlights, it's likely a solid. If only one face highlights, it's a surface.

## Common 3D Modeling Issues (From Real Forum Discussions)

### Issue: STL Export Shows No Selectable Objects

This is the exact problem reported in the CorelDRAW community forum. The user created what looked like a 3D model but couldn't select anything when running `STLOUT`.

**Cause**: The model is a surface, not a solid. `EXTRUDE`, `REVOLVE`, `SWEEP`, and `LOFT` only create solids when the input profile is a closed, welded polyline. An open profile (even with a tiny gap) creates a surface.

**Fix**: Use `PEDIT` > Join to close gaps in the profile. Then use `WELD` to ensure all vertices are joined. Re-extrude. Verify with the slice-and-hide method above.

### Issue: Boolean Operation Fails

**Cause**: Solids do not intersect in 3D space, or one of the objects is actually a surface, not a solid. Non-manifold geometry (edges shared by more than two faces) will also cause failures.

**Fix**: Verify both objects are solids using the slice method. Use `INTERFERE` to check if solids actually overlap. If they just touch at a face, add a tiny overlap by moving one object slightly.

### Issue: STL File Is Empty or Corrupted

**Cause**: The solid has errors in its ACIS representation. This can happen after multiple boolean operations that create tiny sliver faces.

**Fix**: Run `AUDIT` with Y to fix errors. Then run `SOLIDEDIT` > Body > Check to validate the solid. If errors persist, rebuild the solid from scratch using simpler operations. As cj7hawk recommended, avoid making 3D solids out of multiple separate parts — join them with `UNION` before exporting to create a single manifold solid.

### Issue: 3D Print Has Internal Walls or Extra Material

This was another point cj7hawk raised: if you don't union multiple solids before exporting, the STL file will contain separate shells that may overlap, causing the printer to create internal walls and waste material.

**Fix**: Always `UNION` all solids into a single solid body before `STLOUT`. If parts need to remain separate for assembly, export each part as its own STL file.

## STL Export Settings for 3D Printing

When exporting via `STLOUT`, choose binary format — it produces smaller files than ASCII. The default facet resolution is usually fine, but if you need smoother curves on cylindrical or spherical surfaces, you can adjust the facet deviation:

- `FACETRES` system variable: 0.01 for rough, 0.5 for normal, 1.0 for smooth
- Higher values produce larger STL files but smoother surfaces
- For most 3D printing, 0.5 is the sweet spot

After exporting, always open the STL in your slicer (Cura, PrusaSlicer, Bambu Studio) and check the preview. Look for:
- Missing faces (indicates non-manifold geometry)
- Internal structures (indicates un-joined solids)
- Inverted normals (some slicers auto-fix this, but not all)

## Conclusion

CorelCAD's 3D modeling capabilities cover the fundamentals needed for basic mechanical parts, architectural massing, and 3D printing. The ACIS kernel ensures compatibility with other CAD systems through SAT export, and STL export works reliably when you follow the solid-modeling rules. The key takeaway from countless forum discussions is this: always verify you're working with solids, not surfaces, and always union multiple parts before STL export. While CorelCAD won't replace dedicated MCAD software like Fusion 360 or SolidWorks for complex assemblies, it's more than capable for single-part 3D printing projects — especially given its perpetual license model compared to Autodesk's subscription-only approach.
