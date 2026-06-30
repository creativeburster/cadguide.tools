---
title: "CorelCAD 3D Modeling: Extrude, Revolve, Boolean Operations, and STL Export"
excerpt: "A beginner guide to 3D solid modeling in CorelCAD covering extrusion, revolution, boolean union/subtract/intersect, edge filleting, sectioning, and STL export for 3D printing."
category: "workflow"
softwareSlug: "corelcad"
keyword: "corelcad 3d modeling"
slug: "corelcad-3d-modeling-extrude-revolve-boolean-stl-export"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.coreldraw.com/en/pages/corelcad/help/3d-modeling/"
  - "https://www.coreldraw.com/en/pages/corelcad/"
---

# CorelCAD 3D Modeling: Extrude, Revolve, Boolean Operations, and STL Export

CorelCAD includes 3D solid modeling based on the ACIS kernel, enabling basic mechanical part design and 3D documentation. This guide covers the fundamental 3D workflow from 2D profile to finished solid with STL export for 3D printing.

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

## Common 3D Modeling Issues

### Issue: Extrusion Creates Surface Instead of Solid

**Cause**: The 2D profile is not closed.
**Fix**: Use `PEDIT` > Join to close gaps, then re-extrude. Verify the polyline is closed with `LIST`.

### Issue: Boolean Operation Fails

**Cause**: Solids do not intersect or have non-manifold geometry.
**Fix**: Verify solids overlap in 3D space. Use `INTERFERE` to check interference between solids before subtracting.

### Issue: STL File Is Empty or Corrupted

**Cause**: The solid has errors or is not a valid ACIS solid.
**Fix**: Run `AUDIT` with Y, then `SOLIDEDIT` > B > C (check solid). If errors are found, rebuild the solid from scratch.

## Conclusion

CorelCAD's 3D modeling capabilities cover the fundamentals needed for basic mechanical parts, architectural massing, and 3D documentation. The ACIS kernel ensures compatibility with other CAD systems through SAT export, and the STL export supports 3D printing workflows. While not a replacement for dedicated MCAD software, these tools extend CorelCAD's value from 2D drafting into basic 3D modeling without additional software purchases.
