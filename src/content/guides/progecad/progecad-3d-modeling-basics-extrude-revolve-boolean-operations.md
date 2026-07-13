---
title: "progeCAD 3D Modeling Basics: Extrude, Revolve, and Boolean Operations"
excerpt: "A beginner guide to 3D modeling in progeCAD Professional covering extrusion, revolution, boolean union/subtract/intersect, solid editing, and viewport setup for 3D documentation."
category: "workflow"
softwareSlug: "progecad"
keyword: "progecad 3d modeling"
slug: "progecad-3d-modeling-basics-extrude-revolve-boolean-operations"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.progesoft.com/products/progecad-professional/"
  - "https://www.progesoft.com/products/progecad-professional/manual?mp=drawing-in-three-dimensions%2Fcreating-three-dimensional-entities%2Fcreating-extruded-solids-or-surfaces"

---

# progeCAD 3D Modeling Basics: Extrude, Revolve, and Boolean Operations

progeCAD Professional includes 3D modeling capabilities based on the ACIS solid modeling kernel. While not as comprehensive as AutoCAD's 3D tools or dedicated MCAD applications like SolidWorks, it handles basic mechanical part modeling, architectural massing studies, and 3D documentation. This guide covers the fundamental 3D workflow from 2D profile to finished solid.

## Enabling 3D Workspace

1. Type `WORKSPACE` and select "3D Modeling" (if available) or manually enable 3D toolbars
2. Enable the 3D Modeling toolbar: right-click toolbar area > 3D Modeling
3. Set visual style: type `VISUALSTYLES` and select "Realistic" or "Conceptual"
4. Set view: type `VIEW` > select "SE Isometric" for a standard 3D viewing angle

## Creating 3D Solids by Extrusion

Extrusion extends a 2D profile along a straight path to create a solid.

### Step 1: Draw the 2D Profile

Draw a closed profile using `PLINE` (polyline). The profile must be closed for solid extrusion:

```
PLINE
0,0
100,0
100,50
50,50
50,100
0,100
C    ;; Close
```

### Step 2: Extrude

1. Type `EXTRUDE`
2. Select the closed polyline
3. Specify height (e.g., 30mm)
4. Specify taper angle (0 for straight extrusion, or enter an angle for tapered walls)

### Extrusion with Path

To extrude along a curved path:
1. Draw the profile (closed polyline) and the path (line, arc, or polyline)
2. Type `EXTRUDE`
3. Select the profile
4. Type `P` for Path mode
5. Select the path object

The profile is swept along the path to create the solid.

## Creating 3D Solids by Revolution

Revolution rotates a 2D profile around an axis to create a solid (e.g., shafts, wheels, vessels).

### Step 1: Draw the Profile

Draw the cross-section profile as a closed polyline. Draw the revolution axis as a line.

### Step 2: Revolve

1. Type `REVOLVE`
2. Select the closed polyline
3. Specify the axis:
   - `Object` — select an existing line as the axis
   - `X` or `Y` — revolve around the X or Y axis
   - `Start point / End point` — define the axis by two points
4. Specify the angle of revolution (360 for full revolution, or less for partial)

### Example: Creating a Shaft

1. Draw the shaft cross-section as a closed polyline (half profile)
2. Draw a centerline along the shaft axis
3. `REVOLVE` > select profile > `Object` > select centerline > 360°
4. The shaft solid is created

## Boolean Operations

Boolean operations combine or modify solids:

### Union (Combine Solids)

1. Type `UNION`
2. Select two or more solids
3. Press Enter
4. The solids are merged into a single solid

### Subtract (Cut One Solid from Another)

1. Type `SUBTRACT`
2. Select the solid to subtract FROM (the main body)
3. Press Enter
4. Select the solid(s) to subtract (the cutter)
5. Press Enter
6. The cutter is removed from the main body

### Example: Creating a Hole

1. Create a box: `BOX` > 0,0,0 > 100,50,30
2. Create a cylinder for the hole: `CYLINDER` > 50,25,0 > 10 (radius) > 30 (height through the box)
3. `SUBTRACT` > select box > Enter > select cylinder > Enter
4. The hole is cut through the box

### Intersect (Keep Only Overlapping Volume)

1. Type `INTERSECT`
2. Select two or more solids
3. Press Enter
4. Only the volume where all solids overlap is retained

## Solid Editing

### Move a Face

1. Type `SOLIDEDIT`
2. Select `F` (Face) > `M` (Move)
3. Select the face to move
4. Specify base point and displacement
5. The face moves, extending or trimming adjacent faces

### Offset a Face

1. `SOLIDEDIT` > `F` (Face) > `O` (Offset)
2. Select the face
3. Specify distance (positive = outward, negative = inward)
4. The face offsets, adjusting the solid volume

### Extrude a Face

1. `SOLIDEDIT` > `F` (Face) > `E` (Extrude)
2. Select the face
3. Specify height
4. The face extrudes outward or inward

### Fillet Edges

1. Type `FILLET`
2. Select an edge of the 3D solid
3. Specify fillet radius
4. The edge is rounded

### Chamfer Edges

1. Type `CHAMFER`
2. Select an edge of the 3D solid
3. Specify distances for the two adjacent faces
4. The edge is beveled

## Sectioning and Slicing

### Slice a Solid

1. Type `SLICE`
2. Select the solid
3. Specify the cutting plane:
   - `3points` — define plane by three points
   - `Object` — use a circle, ellipse, or spline as the cutting object
   - `ZX`/`YZ`/`XY` — use a coordinate plane
4. Choose which side to keep (or keep both)

### Section Plane

1. Type `SECTIONPLANE`
2. Click two points to define the section line
3. The section plane is created
4. Right-click the section plane > "Activate Live Section" to see the cut view
5. Use `SECTIONPLANE` > "Generate 2D/3D Section" to create 2D drawings from the section

## Viewport Setup for 3D Documentation

1. Switch to a Layout tab
2. Type `MVIEW` and create viewports
3. For multiple views:
   - Create 4 viewports: top, front, right, isometric
   - In each viewport, set the appropriate view: `VIEW > Top`, `VIEW > Front`, `VIEW > Right`, `VIEW > SE Isometric`
4. Set visual style per viewport:
   - Top/Front/Right: 2D Wireframe (for dimensioning)
   - Isometric: Realistic or Conceptual (for visualization)
5. Lock each viewport after setting the view and scale

## Exporting 3D Models

### STL Export (for 3D printing)

1. Type `STLOUT`
2. Select the solid
3. Specify file name
4. Choose binary or ASCII format

### 3D PDF Export

1. Type `EXPORT3DPDF` (progeCAD Professional feature)
2. Select the solid(s)
3. Specify PDF file name
4. The PDF includes an interactive 3D view that can be rotated in Adobe Reader

### SAT Export (for CAM or other CAD)

1. Type `ACISOUT`
2. Select the solid
3. Specify file name
4. The .sat file can be imported into SolidWorks, Inventor, or other ACIS-based applications

## Common 3D Modeling Pitfalls and How to Avoid Them

The most common pitfall in ACIS-based 3D modeling is creating surfaces instead of solids. This happens when the 2D profile used for extrusion or revolution is not a closed, welded polyline. If you draw a rectangle using four separate lines and try to extrude it, you'll get a surface, not a solid. The fix is to use the PEDIT command to join the lines into a single closed polyline before extruding. Another common issue is boolean operations failing — this typically happens when two solids share a coincident face or edge. The ACIS kernel sometimes can't resolve the topology. The workaround is to slightly offset one solid so the faces overlap rather than coincide. A third pitfall is STL export producing an empty file — this means the object is a surface, not a solid. Use the MASSPROP command to verify an object is a solid before exporting to STL. If MASSPROP returns volume and mass properties, it's a solid. If it returns an error, it's a surface that needs to be converted.

## Conclusion

progeCAD Professional's 3D modeling capabilities cover the fundamentals: extrusion, revolution, boolean operations, solid editing, sectioning, and export to common 3D formats. While not a replacement for dedicated MCAD software, it is sufficient for basic mechanical parts, architectural massing, and 3D documentation. The ACIS kernel ensures compatibility with other ACIS-based CAD systems through SAT export. By mastering these fundamental operations, you can extend your progeCAD workflow from 2D drafting into basic 3D modeling without purchasing additional software.
