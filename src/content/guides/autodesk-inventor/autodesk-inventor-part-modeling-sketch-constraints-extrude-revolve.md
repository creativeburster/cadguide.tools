---
title: "Autodesk Inventor Part Modeling: Sketch Constraints, Extrude, Revolve, and Feature Tree"
excerpt: "Inventor's part modeling tools create parametric 3D parts from sketched profiles. I cover sketch constraints, the extrude and revolve tools, feature tree management, and parametric design best practices for robust editable parts."
category: "workflow"
softwareSlug: "autodesk-inventor"
keyword: "Autodesk Inventor part modeling sketch constraints extrude revolve feature tree parametric design"
slug: "autodesk-inventor-part-modeling-sketch-constraints-extrude-revolve"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://help.autodesk.com/view/INVNTOR/2025/ENU/"
  - "https://www.autodesk.com/products/inventor/overview"
  - "https://help.autodesk.com/cloudhelp/2026/ENU/Inventor-Help/files/GUID-FAF69614-E8F2-4763-975C-552E0BEA1DD1.htm"
---

# Autodesk Inventor Part Modeling: Sketch Constraints, Extrude, Revolve, and Feature Tree

I've designed hundreds of parametric parts in Inventor for mechanical and industrial product design. Inventor's parametric modeling approach — where sketches drive features and features build the part — is the foundation of everything else the software does. Understanding sketch constraints, feature ordering, and parametric relationships is essential for creating parts that are robust, editable, and don't break when dimensions change.

## Inventor Part Modeling Overview

Inventor uses a parametric feature-based modeling approach:
1. **Sketch**: Draw a 2D profile on a plane
2. **Feature**: Extrude, revolve, sweep, or loft the sketch into 3D
3. **Feature tree**: The ordered list of features that build the part
4. **Parameters**: Named dimensions that drive the geometry
5. **Constraints**: Geometric relationships that maintain design intent

## Sketching

### Creating a New Sketch

1. Start a new **Part** file (.ipt)
2. Click **Start 2D Sketch**
3. Select a plane (XY, XZ, YZ origin planes or an existing face)
4. The sketch environment activates
5. Draw the profile using sketch tools

### Sketch Tools

- **Line**: Draw straight segments with automatic constraints
- **Circle**: Center circle or tangent circle
- **Arc**: Three-point arc, tangent arc, or center-point arc
- **Rectangle**: Two-point, three-point, or two-point center
- **Polygon**: Regular polygon with specified sides
- **Spline**: Interpolation spline through points
- **Ellipse**: Center ellipse
- **Point**: Sketch point for hole centers or references

### Sketch Constraints

Constraints maintain geometric relationships between sketch elements:

- **Coincident**: Two points share the same location
- **Collinear**: Two lines are on the same infinite line
- **Concentric**: Two arcs/circles share the same center
- **Equal**: Two lines have equal length or two arcs/circles have equal radius
- **Horizontal**: A line is horizontal
- **Vertical**: A line is vertical
- **Parallel**: Two lines are parallel
- **Perpendicular**: Two lines are at 90°
- **Tangent**: A line/arc is tangent to another arc/circle
- **Smooth**: Spline connects smoothly to another curve
- **Symmetric**: Two elements are symmetric about an axis
- **Fix**: A point or line is locked in position

### Dimensioning Sketches

1. Click **Dimension** (D key)
2. Click the element to dimension
3. Place the dimension
4. Enter the value
5. Types of dimensions:
   - **Linear**: Distance between two points or along a line
   - **Diameter/Radius**: For circles and arcs
   - **Angular**: Between two lines
   - **Aligned**: Along the direction of a line

### Fully Constrained Sketches

A sketch should always be fully constrained:
- **Fully constrained**: All geometry is fixed by constraints and dimensions — no degrees of freedom
- **Under-constrained**: Some geometry can still move — the sketch is unstable
- **Over-constrained**: Conflicting constraints — Inventor will warn you

Check constraint status:
- **Bottom-right corner**: Shows "Fully Constrained" or "Needs X dimensions/constraints"
- **Color coding**: Constrained geometry is black, under-constrained is blue

### Best Practice: Design Intent in Sketches

Think about how the part might change:
- If two holes should always be the same size, use the **Equal** constraint
- If a hole should always be centered, dimension it symmetrically from the edges
- If a line should always be parallel to an edge, use the **Parallel** constraint
- Don't dimension to reference geometry that might disappear

## Extrude

### Creating an Extrusion

1. Finish or have an active sketch
2. Click **Extrude** (E key)
3. Select the sketch profile(s)
4. Set the extrusion type:
   - **Distance**: Extrude by a specified distance
   - **To Next**: Extrude to the next surface
   - **To**: Extrude to a selected surface or face
   - **From-To**: Extrude between two selected surfaces
   - **Midplane**: Extrude symmetrically in both directions
5. Set the operation:
   - **Join**: Add material to the existing part
   - **Cut**: Remove material from the existing part
   - **Intersect**: Keep only the overlapping volume
   - **New Solid**: Create a new solid body
6. Click **OK**

### Extrude Options

- **Taper**: Add a draft angle to the extrusion
- **Second direction**: Extrude in both directions with different distances
- **Minimum solution**: For "To" operations, use the nearest solution
- **Optimize for selection**: For thin-wall parts

## Revolve

### Creating a Revolution

1. Have an active sketch with a profile and an axis
2. Click **Revolve**
3. Select the profile
4. Select the axis (a sketch line or work axis)
5. Set the revolution type:
   - **Full**: 360° revolution
   - **Angle**: Specify the revolution angle
6. Set the operation (Join, Cut, Intersect, New Solid)
7. Click **OK**

### Revolve Best Practices

- The profile must not cross the axis (Inventor will warn you)
- The axis can be a sketch line, a work axis, or a model edge
- For hollow parts, sketch the cross-section as a closed profile with an inner and outer boundary
- Use revolve for shafts, wheels, pulleys, bottles, and any axisymmetric part

## Other Feature Tools

### Sweep

1. Create a sketch for the **profile** (cross-section)
2. Create a sketch for the **path** (trajectory)
3. Click **Sweep**
4. Select the profile and path
5. Options:
   - **Path**: Sweep along the path only
   - **Path & Guide Rail**: Sweep along path with a guide rail for orientation
   - **Path & Guide Surface**: Sweep along path on a guide surface
6. Click **OK**

### Loft

1. Create two or more sketches on different planes
2. Click **Loft**
3. Select the profiles in order
4. Options:
   - **Rails**: Add guide rails to control the loft shape
   - **Centerline**: Use a centerline to guide the loft
   - **Area loft**: Control the cross-sectional area along the loft
5. Click **OK**

### Hole

1. Click **Hole** (H key)
2. Select a face or sketch point for placement
3. Set hole type:
   - **Drilled**: Simple straight hole
   - **Counterbore**: Hole with a counterbore at the top
   - **Countersink**: Hole with a countersink at the top
   - **Tapped**: Threaded hole
4. Set dimensions:
   - **Diameter**: Hole diameter
   - **Depth**: Through-all or specified depth
   - **Counterbore/countersink dimensions**: As applicable
5. Set termination:
   - **Distance**: Specified depth
   - **Through-All**: Goes through the entire part
   - **To**: Stops at a selected face
6. Click **OK**

### Fillet and Chamfer

**Fillet**:
1. Click **Fillet** (F key)
2. Select edges or faces
3. Enter the fillet radius
4. Options:
   - **Constant radius**: Same radius along the entire edge
   - **Variable radius**: Different radii at start and end
   - **Setback**: Corner setbacks for blends
5. Click **OK**

**Chamfer**:
1. Click **Chamfer**
2. Select edges
3. Set chamfer type:
   - **Distance**: Equal distance on both faces
   - **Distance and Angle**: One distance and one angle
   - **Two Distances**: Different distances on each face
4. Click **OK**

### Pattern

**Rectangular Pattern**:
1. Click **Rectangular Pattern**
2. Select the feature(s) to pattern
3. Define Direction 1: Select an edge, enter count and spacing
4. Define Direction 2: Optional second direction
5. Click **OK**

**Circular Pattern**:
1. Click **Circular Pattern**
2. Select the feature(s) to pattern
3. Select the rotation axis
4. Enter count and angle
5. Click **OK**

### Shell

1. Click **Shell**
2. Select the face(s) to remove (open faces)
3. Set the wall thickness
4. Options:
   - **Uniform thickness**: All walls the same thickness
   - **Unique thickness**: Different thicknesses for specific faces
5. Click **OK**

## Feature Tree Management

### The Browser (Feature Tree)

The browser shows all features in creation order:
- Each feature is listed with its name
- Features can be reordered by dragging (if dependencies allow)
- Features can be suppressed (temporarily disabled)
- Features can be edited by double-clicking

### Feature Dependencies

Features depend on earlier features:
- An extrude depends on its sketch
- A fillet depends on the edge it references
- If a parent feature is deleted or changed, dependent features may fail
- Inventor shows failed features with a red warning icon

### Best Practice: Feature Ordering

1. **Base feature first**: The primary shape (extrude or revolve)
2. **Secondary features**: Additional material additions
3. **Cuts and holes**: Material removal features
4. **Fillets and chamfers**: Last, after all geometry is defined
5. **Patterns**: After the original feature is complete

This order minimizes failures:
- Fillets last means edge references don't change
- Cuts after base means the base is stable
- Patterns after the original means the pattern source is correct

### Editing Features

1. Double-click a feature in the browser
2. The feature dialog opens with current parameters
3. Change dimensions or options
4. Click **OK**
5. The part rebuilds with the new parameters

### Suppressing Features

1. Right-click a feature → **Suppress**
2. The feature is temporarily removed from the part
3. Dependent features may also be suppressed
4. Useful for:
   - Simplifying the part for analysis
   - Testing alternative designs
   - Speeding up rebuild time for large parts

## Parameters

### Viewing Parameters

1. Click **Parameters** (fx button)
2. The Parameters table shows:
   - **Model parameters**: Dimensions created by features
   - **User parameters**: Custom named parameters
   - **Reference parameters**: Driven dimensions (measurements)
3. Each parameter has:
   - **Name**: Parameter name (e.g., "Width", "Length")
   - **Equation**: Value or formula (e.g., "Width * 2")
   - **Value**: Calculated value
   - **Unit**: mm, in, deg, etc.

### Creating User Parameters

1. In the Parameters table, click **Add**
2. Enter a name (e.g., "Hole_Diameter")
3. Enter a value (e.g., "10 mm")
4. Use this parameter in dimensions by typing the name

### Parameter Equations

Parameters can reference other parameters:
- `Length = Width * 2`
- `Hole_Diameter = Thickness * 0.5`
- `Fillet_Radius = min(Thickness, 5 mm)`
- Functions: `sin()`, `cos()`, `tan()`, `sqrt()`, `abs()`, `min()`, `max()`

### Linking to External Parameters

1. Click **Link** in the Parameters table
2. Select an Excel spreadsheet
3. Parameters from the spreadsheet become available in the part
4. Changes to the spreadsheet update the part
5. Useful for design tables and standard part families

## Common Issues

### Sketch Won't Extrude

- Check that the profile is closed (no gaps)
- Look for overlapping lines
- Ensure the profile doesn't self-intersect
- Use **Sketch Doctor** to diagnose sketch problems

### Feature Fails After Edit

- Check if a referenced edge or face was removed by the edit
- Look for failed features in the browser (red icon)
- Edit the failed feature and reselect references
- Consider reordering features in the browser

### Part Rebuilds Slowly

- Suppress unnecessary fillets and patterns
- Simplify complex sketches
- Reduce the number of features
- Use simplified representations for large assemblies

### Fillet Fails

- The fillet radius may be too large for the edge
- Try a smaller radius
- Check for intersecting fillets that create complex geometry
- Use variable radius fillets for difficult corners

## Summary

Autodesk Inventor's part modeling is built on parametric sketches and features. Create fully constrained sketches using geometric constraints and dimensions — always check the constraint status in the bottom-right corner. Use extrude for prismatic shapes, revolve for axisymmetric parts, sweep for paths, and loft for transitions between profiles. Order features logically: base first, secondary features next, cuts and holes, then fillets and chamfers last. Manage the feature tree by editing, suppressing, and reordering features as needed. Use named parameters and equations to drive dimensions with design intent. The most common issues — sketch failures, broken features, and slow rebuilds — are addressed with the Sketch Doctor, reselecting references, and simplifying the feature tree. A well-structured part with fully constrained sketches and logical feature ordering is easy to edit and rarely fails.
