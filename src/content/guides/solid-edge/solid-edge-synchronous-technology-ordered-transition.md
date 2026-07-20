---
title: "Solid Edge Synchronous Technology: Transitioning from Ordered to Synchronous Modeling"
excerpt: "Moving from ordered (history-based) to synchronous (direct) modeling in Solid Edge can be disorienting. We cover the hybrid workflow, steering wheel basics, and common pitfalls when adopting synchronous modeling."
category: "workflow"
softwareSlug: "solid-edge"
keyword: "Solid Edge synchronous technology ordered modeling transition steering wheel"
slug: "solid-edge-synchronous-technology-ordered-transition"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-24"
sources:
  - "https://www.designfusion.com/post/tips-to-improve-the-performance-of-solid-edge"
  - "https://community.sw.siemens.com/s/question/0D5Vb000007T5sBKAS/performance-issue-in-solid-edge-why-does-my-processor-only-reach-20"
---

# Solid Edge Synchronous Technology: Transitioning from Ordered to Synchronous Modeling

Solid Edge is unique among mid-range CAD systems in offering both ordered (history-based) and synchronous (direct) modeling in the same environment. This dual approach is powerful but can be confusing for users transitioning from other CAD systems or moving from ordered to synchronous workflows. DesignFusion's performance guide notes that understanding Solid Edge's modeling paradigms is essential for both performance and productivity.

## Understanding Ordered vs. Synchronous Modeling

### Ordered Modeling

Ordered modeling is the traditional history-based approach used by SolidWorks, Inventor, and Creo:
- Features are created in sequence and stored in a feature tree
- Each feature depends on previous features
- Editing an early feature triggers regeneration of all subsequent features
- Sketches are drawn first, then extruded/revolved into solids
- Relationships and dimensions control the geometry

### Synchronous Modeling

Synchronous modeling is a direct modeling approach:
- Features are not stored in a history tree
- Geometry can be edited directly by selecting faces and moving them
- The steering wheel tool provides intuitive manipulation controls
- Dimensions can be added to existing geometry without defining a feature
- Changes are instant — no regeneration required
- Relationships (parallel, perpendicular, tangent) can be applied to existing faces

### Hybrid Modeling

Solid Edge allows mixing both paradigms in the same part:
- Some features can be ordered, others synchronous
- The feature tree shows which features are which type
- You can convert ordered features to synchronous and vice versa
- This is the most flexible approach but requires understanding when to use each

## Fix 1: Start with the Hybrid Approach

Don't try to go fully synchronous on your first attempt. Use the hybrid approach:

1. **Use synchronous for**: Base geometry, simple shapes, imported geometry edits, concept modeling
2. **Use ordered for**: Complex features that depend on multiple references, features with design intent that must be preserved, features that may need to be reordered
3. **Create the base shape synchronously**, then switch to ordered for detailed features

### How to Switch Between Modes

1. In the feature tree, right-click the insertion point
2. Select **Insert Synchronous** or **Insert Ordered**
3. Features created after the insertion point use the selected mode
4. You can move the insertion point to add features in either mode at any time

## Fix 2: Learn the Steering Wheel

The steering wheel is the primary tool for synchronous modeling. It appears when you select a face in synchronous mode:

### Steering Wheel Components

- **Origin**: The center point — click and drag to move the face
- **Primary axis**: The arrow pointing normal to the face — drag to extrude or move along the normal
- **Secondary axis**: The arrow in the plane of the face — drag to move in-plane
- **Torus (ring)**: The ring around the origin — drag to rotate the face
- **QuickBar**: The floating menu — shows dimension input and options

### Basic Operations

1. **Move a face**: Select the face, drag the steering wheel origin to a new location
2. **Extrude a face**: Select the face, drag the primary axis arrow
3. **Rotate a face**: Select the face, drag the torus ring
4. **Align a face**: Select the face, click the primary axis, select a target face — the selected face aligns to the target
5. **Offset a face**: Select the face, type a distance in the QuickBar, press Enter

### Common Steering Wheel Pitfalls

- **Don't drag too fast**: Small, deliberate drags give better control
- **Use the QuickBar for precise values**: Don't rely on dragging for exact dimensions
- **Watch for face dependencies**: Moving a face may affect adjacent faces — check the preview
- **Use Escape to cancel**: If a move looks wrong, press Escape before committing

## Fix 3: Use Live Rules

Live Rules is a synchronous feature that automatically maintains geometric relationships:

1. When you move a face, Live Rules detects related faces and maintains their relationships
2. For example, if you move a face that's parallel to another face, Live Rules keeps them parallel
3. Live Rules indicators appear at the bottom of the screen:
   - **Parallel**: Maintains parallel relationships
   - **Perpendicular**: Maintains perpendicular relationships
   - **Tangent**: Maintains tangent relationships
   - **Concentric**: Maintains concentric relationships
4. Toggle each Live Rule on or off as needed
5. Disable Live Rules if you want to move a face independently

### When to Disable Live Rules

- When you want to change the angle between faces (disable Parallel)
- When you want to break a tangent relationship (disable Tangent)
- When moving imported geometry that has no design intent

## Fix 4: Add Dimensions to Existing Geometry

In synchronous mode, you can add dimensions to existing faces without creating a sketch:

1. Select a face
2. Use **Smart Dimension** (same as in ordered mode)
3. The dimension is attached directly to the face
4. Changing the dimension value moves the face
5. This is much faster than creating a sketch, dimensioning it, and extruding

### PMI (Product Manufacturing Information) Dimensions

1. Synchronous dimensions are PMI dimensions
2. They appear in the feature tree as "PMI Dimensions"
3. They can be edited at any time by double-clicking
4. They can be deleted without affecting the geometry (the face stays in its current position)

## Fix 5: Converting Ordered Features to Synchronous

If you have an existing ordered model and want to convert it to synchronous:

1. In the feature tree, select the ordered features to convert
2. Right-click → **Convert to Synchronous**
3. Solid Edge analyzes the features and creates synchronous equivalents
4. Sketches are converted to PMI dimensions
5. Some complex features may not convert cleanly — check the results

### What Converts Well

- Extrusions and revolves convert cleanly
- Holes convert to synchronous holes
- Fillets and chamfers convert to synchronous rounds

### What Doesn't Convert Well

- Lofted features may lose their profiles
- Swept features may lose their paths
- Patterns may need to be recreated
- Features with complex dependencies may break

## Fix 6: Use Synchronous for Imported Geometry

Synchronous modeling is ideal for editing imported STEP, IGES, or Parasolid files:

1. Import the file: **File → Open → STEP/IGES/Parasolid**
2. The imported geometry has no feature tree — it's a "dumb solid"
3. In synchronous mode, you can directly:
   - Move faces to change dimensions
   - Delete faces to remove features
   - Add holes and cuts
   - Add fillets and chamfers
4. Use the steering wheel to manipulate any face
5. Add PMI dimensions to document the changes

### Why This Is Better Than Ordered for Imports

- No need to recreate the feature tree
- No need to identify how the original model was built
- Direct manipulation is intuitive and fast
- Changes are instant — no regeneration

## Fix 7: Common Synchronous Modeling Mistakes

### Mistake 1: Not Using Relationships

In synchronous mode, faces don't automatically maintain relationships unless you explicitly add them:

1. Select two faces that should be parallel
2. Use **Home → Relate → Parallel**
3. Now the faces will stay parallel when either is moved
4. Without this relationship, moving one face doesn't affect the other

### Mistake 2: Over-Constraining with PMI Dimensions

Adding too many PMI dimensions can over-constrain the model:

1. Only add dimensions that define the design intent
2. Don't dimension every face — let some faces be driven by relationships
3. If a dimension won't accept a new value, the model may be over-constrained
4. Delete unnecessary dimensions to resolve conflicts

### Mistake 3: Not Using Configurations

Synchronous models are ideal for configurations because there's no feature tree to manage:

1. Create a base model synchronously
2. Create a configuration called "Variant A"
3. Move faces to create the variant
4. Create a configuration called "Variant B"
5. Move faces differently
6. Switch between configurations instantly — no regeneration

## Fix 8: When to Use Ordered Instead of Synchronous

Synchronous is not always the best choice. Use ordered when:

- **Design intent is complex**: If features have many interdependencies, ordered modeling preserves them better
- **You need design history**: If you need to track how a model was built (for manufacturing documentation), ordered provides the history
- **Features must be reordered**: If you need to change the order of operations, ordered allows reordering
- **You're collaborating with ordered users**: If your team uses ordered modeling, stay consistent
- **Complex sweeps and lofts**: These are easier to create and edit in ordered mode

## Summary

| Topic | Key Point |
|-------|-----------|
| Hybrid approach | Use synchronous for base geometry, ordered for complex features |
| Steering wheel | Primary tool for synchronous face manipulation |
| Live Rules | Auto-maintains geometric relationships — toggle as needed |
| PMI dimensions | Direct dimensions on faces, no sketch required |
| Converting ordered to synchronous | Works well for simple features, may fail for complex ones |
| Imported geometry | Synchronous is ideal — no need to recreate feature tree |
| Common mistakes | Not using relationships, over-constraining, not using configurations |
| When to use ordered | Complex design intent, history tracking, complex sweeps/lofts |

The hybrid approach is the most productive: use synchronous for base geometry and imported model edits, and ordered for complex features that need design intent and history tracking. Learn the steering wheel thoroughly — it's the key to efficient synchronous modeling. Start with simple parts before attempting to convert complex ordered models to synchronous.
