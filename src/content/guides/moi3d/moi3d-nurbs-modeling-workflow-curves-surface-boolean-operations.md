---
title: "MoI3D NURBS Modeling Workflow: Curves, Surface Construction, and Boolean Operations"
excerpt: "Learn the MoI3D NURBS modeling workflow: draw profile curves, create surfaces with extrude/revolve/loft/sweep, combine solids with Boolean operations, and apply fillets for finished models."
category: "deployment"
softwareSlug: "moi3d"
keyword: "moi3d NURBS modeling workflow curves surface boolean"
slug: "moi3d-nurbs-modeling-workflow-curves-surface-boolean-operations"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://moi3d.com/3.0/docs/moi_help.pdf"
  - "http://moi3d.com/forum/lmessages.php?msg=4865.1&webtag=MOI"
---

# MoI3D NURBS Modeling Workflow: Curves, Surface Construction, and Boolean Operations

MoI3D (Moment of Inspiration) is a NURBS-based 3D modeler that combines CAD accuracy with an intuitive interface. Unlike polygon/subdivision modelers where you push and pull vertices, MoI3D uses a curve-driven approach: draw 2D profile curves, create surfaces from them, combine with Booleans, and fillet the results. It's particularly strong for mechanical and man-made objects.

## The MoI3D Modeling Approach

The typical MoI3D workflow follows these steps:

1. **Draw outline curves** — 2D profiles that define the shape's key features
2. **Create surfaces or solids** — use Extrude, Revolve, Loft, Sweep to generate 3D geometry from curves
3. **Combine with Boolean operations** — union, difference, and intersection to build complex shapes
4. **Apply fillets** — round sharp edges where pieces intersect
5. **Export** — send to another application for rendering, CAM, or 3D printing

This is fundamentally different from polygon modeling. In NURBS modeling, Booleans are a primary construction method — you build simple shapes and combine them, rather than sculpting a single complex mesh.

## Drawing Curves

### Curve Tools

MoI3D provides standard 2D drawing tools:

- **Line** — straight lines
- **Arc** — arcs by center, start, end
- **Circle** — by center and radius, or 3-point
- **Ellipse** — by center or corner
- **Polygon** — regular polygons
- **Rectangle** — by corner or center
- **Freehand** — draw curves by hand
- **Spline** — control point curves through points

### Drawing Tips

- **Work in orthographic views** — use the Top, Front, Right views for precise 2D drawing
- **Use object snaps** — snap to endpoints, midpoints, centers, intersections
- **Draw to real-world dimensions** — enter exact values in the coordinate fields
- **Keep curves simple** — fewer control points produce cleaner surfaces
- **Use construction lines** — temporary lines for alignment and reference

### Importing Reference Images

1. Go to **View > Image**
2. Load a reference image (PNG, JPG)
3. Position the image in the desired view
4. Adjust opacity to see your curves over the image
5. Trace the key profiles

## Surface Construction

### Extrude

The most basic surface operation — extends a 2D curve into 3D:

1. Select a closed curve
2. Go to **Construct > Extrude**
3. Set the distance (height)
4. Options:
   - **Cap Ends** — creates a solid by capping top and bottom
   - **To Point** — extrudes to a point (creates a cone-like shape)
   - **Set Direction** — extrude in a custom direction
   - **Set Path** — extrude along a drawn path
   - **Taper** — extrude with an angle (expands or contracts)

### Revolve

Creates a surface by rotating a profile curve around an axis:

1. Select a profile curve
2. Go to **Construct > Revolve**
3. Define the revolution axis (click two points)
4. Set the angle (360° for full revolve, or partial)
5. Options:
   - **Cap Ends** — caps the start and end of partial revolves

### Loft

Creates a surface through multiple cross-section curves:

1. Select two or more curves in order
2. Go to **Construct > Loft**
3. Options:
   - **Loft Style** — Normal, Loose, Tight
   - **Closed** — connects the first and last profile

### Sweep

Creates a surface by sweeping a profile curve along a rail curve:

1. Select the profile curve(s)
2. Go to **Construct > Sweep**
3. Select the rail curve(s)
4. Options:
   - **Single rail** — profile follows one rail
   - **Two rail** — profile follows two rails (more control over orientation)

### Network

Creates a surface from a grid of intersecting curves:

1. Draw curves in one direction (e.g., horizontal)
2. Draw curves in the other direction (e.g., vertical)
3. Select all curves
4. Go to **Construct > Network**
5. MoI3D creates a surface that passes through all curves

## Boolean Operations

Booleans combine solids by intersecting, adding, or subtracting:

### Boolean Union

Combines two or more solids into one:

1. Select the first solid
2. Go to **Construct > Boolean > Union**
3. Select the second solid
4. The solids merge into a single solid

### Boolean Difference

Subtracts one solid from another:

1. Select the base solid (the one to subtract from)
2. Go to **Construct > Boolean > Difference**
3. Select the cutting solid (the one to subtract)
4. The cutting solid is removed from the base

### Boolean Intersection

Keeps only the overlapping volume:

1. Select the first solid
2. Go to **Construct > Boolean > Intersection**
3. Select the second solid
4. Only the shared volume remains

### Boolean Tips

- **Booleans work best with solids** (closed surfaces), not open surfaces
- **Ensure solids overlap** — the cutting solid must extend beyond the base solid's surface
- **Check for coplanar faces** — if two faces are exactly coplanar, the Boolean may fail
- **Use Trim instead of Boolean** for open surfaces — Trim cuts a surface with a curve or another surface

## Fillets and Chamfers

### Fillet

Rounds sharp edges:

1. Go to **Construct > Fillet**
2. Select the edges to fillet
3. Set the fillet radius
4. Options:
   - **Variable radius** — different radii at different points along the edge
   - **G2 blend** — smoother curvature continuity

### Chamfer

Creates angled edges:

1. Go to **Construct > Chamfer**
2. Select the edges to chamfer
3. Set the chamfer distance(s)

### Fillet Tips

- **Fillet after all Booleans** — apply fillets as the last step
- **Fillet larger edges first** — large fillets may fail if small fillets are already applied
- **Check for failed fillets** — if a fillet fails, the edge may be too complex; try a smaller radius
- **Use Blend instead of Fillet** for edges where Fillet fails — Blend creates a smooth surface between two edges

## Exporting

MoI3D exports to formats for downstream applications:

- **OBJ, STL** — for 3D printing and polygon rendering
- **3DM** — Rhino format, preserves NURBS surfaces
- **STEP, IGES** — for CAM and CAD interchange
- **PDF, AI** — for 2D curves and drafting
- **SAT** — for ACIS-based CAD systems

### Mesh Export Settings

When exporting to OBJ or STL:

1. Set the **mesh density** — finer meshes are smoother but larger files
2. Use **Angle** — 12° is a good default; 5° for very smooth surfaces
3. **Avoid over-tessellation** — too many polygons slow down rendering and printing

## Common Issues

### Boolean Fails

- Ensure both objects are solids (closed surfaces)
- Check for coplanar faces — offset one object slightly
- Try using Trim instead of Boolean for open surfaces
- Check for self-intersecting geometry

### Surface Has Visible Seams

- The surface was created from curves with different point counts
- Use Rebuild to standardize curve point counts before Loft or Sweep
- Use Network instead of Loft for complex surfaces

### Fillet Fails

- The edge is too sharp or complex for the requested radius
- Try a smaller radius
- Use Blend instead of Fillet
- Check for微小 geometry issues at the edge

## Best Practices

- **Start with simple shapes** — build from simple solids and combine with Booleans
- **Draw curves in orthographic views** — ensures accuracy
- **Use real-world dimensions** — enter exact values, don't eyeball
- **Keep curves simple** — fewer control points = cleaner surfaces
- **Fillet last** — apply fillets after all Boolean operations
- **Save frequently** — MoI3D files are small; save often
- **Use the forum** — the MoI3D forum has extensive tutorials and community support
- **Think in terms of subtraction** — like machining, start with a block and cut away material
