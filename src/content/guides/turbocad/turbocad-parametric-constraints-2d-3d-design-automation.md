---
title: "TurboCAD Parametric Constraints: 2D and 3D Design Automation"
excerpt: "A guide to using parametric constraints in TurboCAD Platinum for both 2D and 3D design, covering geometric constraints, dimensional constraints, constraint groups, and design table-driven modeling."
category: "workflow"
softwareSlug: "turbocad"
keyword: "turbocad parametric constraints"
slug: "turbocad-parametric-constraints-2d-3d-design-automation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.turbocad.com/documentation/parametric"
  - "https://www.turbocad.com/products/turbocad-platinum"
---

# TurboCAD Parametric Constraints: 2D and 3D Design Automation

Parametric constraints allow you to define relationships between geometric entities so that modifying one element automatically updates related elements. TurboCAD Platinum supports both 2D and 3D parametric constraints, making it possible to create intelligent, adaptable designs. This guide covers the complete constraint workflow.

## 2D Geometric Constraints

### Available Constraint Types

- **Coincident**: Two points share the same location
- **Collinear**: Two lines lie on the same infinite line
- **Concentric**: Two arcs/circles share the same center
- **Equal**: Two lines have equal length, or two arcs/circles have equal radius
- **Fix**: Lock an entity in position
- **Horizontal**: A line is constrained to horizontal
- **Vertical**: A line is constrained to vertical
- **Parallel**: Two lines are parallel
- **Perpendicular**: Two lines are perpendicular
- **Tangent**: A line/arc is tangent to another arc/circle
- **Symmetric**: Two entities are symmetric about a line
- **Smooth**: Two splines connect with continuous curvature

### Applying Geometric Constraints

1. Tools > Parametric > Geometric Constraint toolbar
2. Select the constraint type
3. Select the first entity
4. Select the second entity
5. The constraint is applied and a badge appears on the entities

### Example: Constraining a Rectangle

1. Draw a rectangle (4 lines)
2. Apply Horizontal constraint to top and bottom lines
3. Apply Vertical constraint to left and right lines
4. Apply Perpendicular constraint between adjacent lines
5. Apply Equal constraint to opposite sides
6. Now dragging any corner maintains the rectangular shape

## 2D Dimensional Constraints

Dimensional constraints are driving dimensions — changing the dimension value changes the geometry.

### Available Types

- **Linear**: Distance between two points or along a line
- **Aligned**: True distance along a line direction
- **Angular**: Angle between two lines
- **Radial**: Radius of an arc/circle
- **Diameter**: Diameter of an arc/circle

### Applying Dimensional Constraints

1. Tools > Parametric > Dimensional Constraint toolbar
2. Select the constraint type
3. Select the entities to constrain
4. Enter the driving value
5. The geometry adjusts to match the value

### Example: Parametric Bracket

1. Draw the bracket profile
2. Apply geometric constraints (parallel, perpendicular, tangent)
3. Apply dimensional constraints:
   - Width = 100mm
   - Height = 80mm
   - Hole diameter = 20mm
   - Hole center X = 50mm
   - Hole center Y = 40mm
4. Change any dimensional value and the entire profile updates

## Constraint Groups

Constraint groups allow you to manage sets of constraints independently:

1. Tools > Parametric > Constraint Groups
2. Create named groups (e.g., "Base Plate", "Mounting Holes")
3. Assign constraints to groups
4. Toggle groups on/off to suppress/unsuppress constraints
5. This is useful for design variants — suppress one group to explore an alternative configuration

## Design Tables (Excel-Driven Dimensions)

TurboCAD can drive dimensional constraints from an Excel spreadsheet:

1. Create dimensional constraints on your profile
2. Tools > Parametric > Design Table
3. Export the current values to Excel
4. In Excel, create multiple rows with different dimension values:
   | Variant | Width | Height | HoleDia |
   |---------|-------|--------|---------|
   | A | 100 | 80 | 20 |
   | B | 120 | 90 | 25 |
   | C | 80 | 60 | 16 |
5. Import the table back into TurboCAD
6. Select a row to apply that variant's dimensions to the model

This is powerful for families of parts that differ only in dimensions.

## 3D Parametric Constraints

TurboCAD Platinum extends parametric constraints to 3D:

### 3D Geometric Constraints

- **Mate**: Two planar faces are coincident
- **Align**: Two planar faces are parallel with an offset
- **Insert**: Shaft fits into a hole (concentric + mate)
- **Orient**: Two faces are parallel
- **Tangent**: Two faces are tangent
- **Width**: Center two faces between two other faces

### 3D Dimensional Constraints

- **Distance**: Between two faces or points
- **Angle**: Between two faces
- **Radius**: Of a cylindrical face

### Applying 3D Constraints

1. Tools > 3D Constraints toolbar
2. Select constraint type
3. Select the first face/edge
4. Select the second face/edge
5. Enter the driving value (for dimensional constraints)

### Example: Parametric Assembly

1. Create a base plate with 4 mounting holes
2. Create a bracket that mounts on the plate
3. Apply Insert constraint between bracket holes and plate holes
4. Apply Mate constraint between bracket bottom and plate top
5. Apply Distance constraint to position the bracket
6. Change the distance value to move the bracket along the plate

## Troubleshooting Constraint Issues

### Constraint Conflict

**Symptom**: Applying a constraint causes geometry to distort unexpectedly.
**Cause**: Over-constrained geometry — too many constraints for the degrees of freedom.
**Fix**: Remove one constraint. The system needs exactly enough constraints to define the geometry, no more.

### Constraint Not Satisfied

**Symptom**: A constraint badge shows red/warning state.
**Cause**: The constraint cannot be satisfied with the current geometry.
**Fix**: Check if other constraints conflict. Use the Constraint Manager panel to identify and remove conflicting constraints.

### Dimensional Constraint Not Driving

**Symptom**: Changing a dimensional value does not update the geometry.
**Cause**: The geometry is over-constrained — another constraint is preventing the change.
**Fix**: Remove conflicting constraints or convert the dimensional constraint to a reference (non-driving) dimension.

## Best Practices

1. **Apply geometric constraints first** — establish relationships before driving dimensions
2. **Use minimum constraints** — only constrain what is necessary
3. **Name dimensional constraints** — use meaningful names (Width, Height, HoleDia) instead of d1, d2, d3
4. **Test by dragging** — after constraining, drag entities to verify relationships work
5. **Use design tables for part families** — avoid creating separate drawings for dimension variants
6. **Group constraints logically** — use constraint groups for complex designs

## Practical Parametric Design Examples

Parametric constraints in TurboCAD shine in scenarios where you need to test multiple dimension values without redrawing. A common use case is a bracket with variable hole spacing — apply geometric constraints to keep holes centered on the bracket, then use dimensional constraints to drive the spacing. Change the spacing dimension and the holes reposition automatically. Another use case is a series of similar parts with different sizes — create one parametric part and generate variants by changing the driving dimensions. The Parametric Part Manager stores these variants and lets you insert any version into a drawing. For 3D parts, constraints can drive extrusion heights, revolution angles, and boolean operation positions. The key limitation is that constraint chains can become circular — if dimension A depends on dimension B which depends on dimension A, the solver will fail. Always build constraints in a logical hierarchy where parent dimensions drive child dimensions, never the reverse. Test each constraint as you add it rather than adding many at once and trying to debug the entire chain.

## Conclusion

Parametric constraints in TurboCAD Platinum transform static drawings into intelligent, adaptable designs. The 2D constraint system handles profile design and part families through design tables, while the 3D constraint system enables assembly positioning and parametric relationships between parts. By following the workflow of geometric constraints first, dimensional constraints second, and design tables for variants, you can create flexible designs that update automatically when requirements change.
