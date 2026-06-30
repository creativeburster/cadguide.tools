---
title: "TurboCAD 3D Modeling: Solid Primitives, Boolean Operations, and Assembly Design"
excerpt: "A guide to 3D solid modeling in TurboCAD Platinum covering primitive creation, extrusion, boolean operations, assembly design with constraints, and STL/STEP export for manufacturing."
category: "workflow"
softwareSlug: "turbocad"
keyword: "turbocad 3d modeling"
slug: "turbocad-3d-modeling-solid-primitives-boolean-assembly-design"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.turbocad.com/documentation/3d-modeling"
  - "https://www.turbocad.com/products/turbocad-platinum"
---

# TurboCAD 3D Modeling: Solid Primitives, Boolean Operations, and Assembly Design

TurboCAD Platinum includes 3D solid modeling based on both ACIS and Spatial kernels, providing capabilities for mechanical part design and assembly modeling. This guide covers the fundamental 3D workflow from primitive creation to assembly design with constraints.

## Enabling 3D Workspace

1. View > 3D Workspace (enables 3D toolbars and panels)
2. Set visual style: View > Visual Styles > Realistic, Conceptual, or Wireframe
3. Set isometric view: View > Isometric > SE Isometric

## Solid Primitives

### Box
1. Insert > 3D Object > Box
2. Specify first corner
3. Specify opposite corner (or enter dimensions)

### Cylinder
1. Insert > 3D Object > Cylinder
3. Specify center of base
3. Specify radius
4. Specify height

### Cone
1. Insert > 3D Object > Cone
2. Specify base center, radius, and height

### Sphere
1. Insert > 3D Object > Sphere
2. Specify center and radius

### Torus
1. Insert > 3D Object > Torus
2. Specify center, major radius, and minor radius

### Wedge
1. Insert > 3D Object > Wedge
2. Specify base corners and height

## Extrusion

1. Draw a closed 2D profile (polyline)
2. Modify > 3D > Extrude
3. Select the profile
4. Specify height and direction
5. Set taper angle (0 for straight, or angle for tapered walls)

### Extrude Along Path
1. Draw profile (closed polyline) and path (line, arc, polyline)
2. Modify > 3D > Extrude Along Path
3. Select profile, then path

## Revolution

1. Draw cross-section as closed polyline
2. Draw revolution axis as a line
3. Modify > 3D > Revolve
4. Select profile, then axis
5. Specify angle (360° for full, or partial)

## Boolean Operations

### Union
1. Modify > 3D Boolean > Union
2. Select two or more solids
3. They merge into one solid

### Subtract
1. Modify > 3D Boolean > Subtract
2. Select the main solid
3. Select the cutter solid(s)
4. The cutter volume is removed

### Intersect
1. Modify > 3D Boolean > Intersect
2. Select two or more solids
3. Only the overlapping volume remains

## Solid Editing

### Fillet Edges
1. Modify > 3D > Fillet Edges
2. Select the edge(s)
3. Specify radius

### Chamfer Edges
1. Modify > 3D > Chamfer Edges
2. Select the edge(s)
3. Specify distances

### Shell (Hollow Out)
1. Modify > 3D > Shell
2. Select the solid
3. Specify wall thickness
4. Select faces to remove (open faces)

### Draft Faces (Add Taper)
1. Modify > 3D > Draft Faces
2. Select faces
3. Specify draft angle and direction

## Assembly Design

### Creating an Assembly

1. Insert > Component > Create Component
2. Select the solid(s) to include
3. Name the component
4. The component appears in the Assembly Tree panel

### Inserting Components into Assembly

1. Insert > Component > Insert Component
2. Select the component file or existing component
3. Position in the assembly

### Assembly Constraints

TurboCAD Platinum supports assembly constraints:

- **Mate**: Align two faces to be coincident
- **Align**: Align two faces with an offset
- **Insert**: Align a shaft into a hole (concentric + mate)
- **Orient**: Align two faces parallel
- **Tangent**: Make two faces tangent
- **Parallel**: Make two edges or faces parallel
- **Perpendicular**: Make two edges or faces perpendicular

To apply constraints:
1. Tools > Assembly > Constraint toolbar
2. Select constraint type
3. Select the first face/edge on component A
4. Select the second face/edge on component B
5. Specify offset if needed

### Checking Interference

1. Tools > Assembly > Interference Check
2. Select all components (or specific pairs)
3. The tool reports interfering volumes
4. Interfering solids are highlighted

## 3D Dimensioning and Documentation

### Creating 2D Views from 3D

1. Insert > Drawing Views > First Angle or Third Angle
2. Select the 3D solid
3. Choose view orientation (Front, Top, Right, Isometric)
4. Place the view on the layout
5. Add additional views (section, detail) as needed

### Section View

1. Insert > Drawing Views > Section
2. Select the 3D solid
3. Draw the section line on the view
4. The section view is generated automatically

### Detail View

1. Insert > Drawing Views > Detail
2. Select the area to enlarge
3. Specify the detail view scale
4. Place the detail view

## Export

### STL (3D Printing)
1. File > Export > STL
2. Select solids to export
3. Choose binary or ASCII
4. Set tessellation quality (higher = smoother, larger file)

### STEP (for CAM and other CAD)
1. File > Export > STEP
2. Select solids
3. Choose STEP version (AP203 or AP214)

### IGES
1. File > Export > IGES
2. Select solids

### 3D PDF
1. File > Export > 3D PDF
2. Select solids
3. Interactive 3D view in Adobe Reader

## Common 3D Issues

### Extrusion Creates Surface Instead of Solid

**Cause**: Profile is not closed.
**Fix**: Close the polyline with `PEDIT > Close`, then re-extrude.

### Boolean Operation Fails

**Cause**: Solids don't overlap or have non-manifold edges.
**Fix**: Use Interference Check to verify overlap. Rebuild solids if geometry is corrupted.

### Assembly Constraint Fails

**Cause**: Selected faces are not compatible (e.g., trying to mate a cylindrical face with a planar face).
**Fix**: Use appropriate constraint types for the geometry. Use "Insert" for shaft-hole, "Mate" for flat faces.

## Stability Tips for 3D Work

Based on community discussions and personal experience, TurboCAD's 3D modeling is more prone to crashes than its 2D drafting. To minimize stability issues: save frequently (every 10-15 minutes during 3D work), avoid complex boolean operations on more than two solids at a time, break large assemblies into sub-assemblies, and close other memory-intensive applications while working in 3D. If TurboCAD crashes during a boolean operation, the file may become corrupted — always keep a backup before performing complex 3D operations. The ACIS kernel that powers TurboCAD's 3D is the same technology used in CorelCAD and progeCAD, so the solid modeling workflow and limitations are similar across all three.

## Assembly Modeling Workflow Tips

TurboCAD's assembly modeling tools allow you to position multiple parts relative to each other using constraints. The available constraint types include mate (faces touching), align (faces parallel and oriented same direction), insert (cylindrical faces coaxial), and angle (faces at specified angle). To create an assembly, start by inserting the base part as a fixed component. Then insert subsequent parts and apply constraints to position them. The constraint solver in TurboCAD is less robust than SolidWorks' — complex constraint chains with more than 10-15 parts can become unstable and may not solve correctly. For large assemblies, break them into sub-assemblies and combine them hierarchically. Always save before applying new constraints, as the solver can occasionally crash during complex operations. When a constraint fails to solve, check for conflicting constraints — two parts can't be both mated and aligned to the same face simultaneously. The assembly tree in the drawing explorer shows all parts and their constraints, making it easier to diagnose positioning issues.

## Conclusion

TurboCAD Platinum's 3D modeling capabilities cover the full mechanical design workflow: primitive creation, extrusion, revolution, boolean operations, solid editing, assembly design with constraints, and 2D drawing generation from 3D models. The ACIS kernel ensures compatibility with other CAD systems through STEP and IGES export. While not as advanced as SolidWorks or Inventor, TurboCAD provides sufficient 3D tools for small to medium mechanical design projects at a significantly lower price point.
