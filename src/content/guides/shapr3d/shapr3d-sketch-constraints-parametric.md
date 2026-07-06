---
title: "Shapr3D Sketch Constraints: Mastering Parametric Relationships on iPad"
excerpt: "Complete guide to using sketch constraints in Shapr3D — covering auto-constraints, manual constraint application, constraint diagnostics, and best practices for stable sketches."
category: "workflow"
softwareSlug: "shapr3d"
keyword: "shapr3d sketch constraints parametric"
slug: "shapr3d-sketch-constraints-parametric"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.shapr3d.com/learn/tutorials/sketch-constraints"
  - "https://help.shapr3d.com/constraints"
---

# Shapr3D Sketch Constraints: Mastering Parametric Relationships on iPad

Sketch constraints are what separate a proper CAD model from a doodle. Shapr3D applies many constraints automatically, but understanding how to control them manually is the difference between a sketch that behaves predictably and one that distorts when you change a dimension.

## How Shapr3D Handles Constraints

Shapr3D applies **auto-constraints** as you sketch:
- Lines drawn near-horizontal snap to horizontal (H icon appears)
- Lines drawn near-vertical snap to vertical (V icon)
- Endpoints near other endpoints snap to coincident (● icon)
- Arcs near existing arcs snap to equal radius (= icon)

Auto-constraints are shown as small badges on the sketch. Tap a badge to see which elements it connects.

## Available Constraint Types

| Constraint | Symbol | Function |
|-----------|--------|----------|
| Coincident | ● | Two points at the same location |
| Horizontal | H | Line locked to horizontal |
| Vertical | V | Line locked to vertical |
| Parallel | ∥ | Two lines at the same angle |
| Perpendicular | ⊥ | Two lines at 90° |
| Tangent | ⊙ | Line/arc tangent to another arc/line |
| Equal | = | Two lines or arcs with same length/radius |
| Concentric | ◎ | Two arcs/circles sharing the same center |
| Midpoint | ▲ | Point at the midpoint of a line |
| Fix | 📌 | Point or line locked in position |
| Symmetry | ⬯ | Two elements symmetric about an axis |

## Applying Manual Constraints

1. Tap and hold the first sketch element (line, arc, or point).
2. Tap the second element.
3. A constraint menu appears — tap the desired constraint.
4. The constraint is applied and the badge appears.

To apply a constraint to a single element (horizontal, vertical, fix):
1. Tap and hold the element.
2. Tap the constraint from the pop-up menu.

## Constraint Diagnostics

To see all constraints on a sketch:

1. Tap the sketch in the items list.
2. All constraint badges become visible.
3. Tap any badge to highlight the connected elements.

To find conflicting or over-constrained geometry:
1. Look for **red badges** — these indicate conflicts.
2. A red badge means the constraint contradicts another constraint or dimension.
3. Tap the red badge → tap **Delete** to remove the conflicting constraint.

Common conflict: A line has both a **horizontal** constraint and a **dimensioned angle** of 45°. These contradict — either remove the horizontal constraint or change the angle to 0°.

## Best Practices for Stable Sketches

### 1. Sketch Roughly, Then Dimension

Don't try to draw exact dimensions while sketching. Draw the approximate shape, then add precise dimensions. Shapr3D's auto-constraints handle the relationships; dimensions handle the exact values.

### 2. Avoid Over-Constraining

A sketch is fully constrained when every element's position and size are determined. Adding more constraints than necessary makes the sketch rigid and hard to modify.

Signs of over-constraining:
- You can't drag a sketch element to resize it
- Changing one dimension causes multiple elements to shift unexpectedly
- Red constraint badges appear

### 3. Use Construction Lines for References

Construction lines (centerlines) help locate geometry without adding constraints to the actual profile:

1. Tap the **Construction Line** tool.
2. Draw a line — it appears as a dashed line.
3. Use this line as a reference for dimensions and constraints.
4. Construction lines don't participate in the profile (they're not extruded).

Example: Draw a construction line between two circle centers, then dimension the distance. The circles move together when the dimension changes.

### 4. Symmetry with Mirror

For symmetric parts, draw half and mirror:

1. Draw a centerline (construction line).
2. Sketch one side of the profile.
3. Tap **Mirror** → select the centerline → select the sketch elements.
4. Shapr3D creates mirrored copies with symmetry constraints.

The mirrored side updates automatically when you modify the original side.

### 5. Fix Critical References

Use the **Fix** constraint to lock elements that shouldn't move:

1. Tap and hold a point or line.
2. Tap **Fix** (📌).
3. The element is locked — it won't move when other dimensions change.

Use this for:
- Mounting hole positions (locked to match physical hardware)
- Part origin (locked at 0,0)
- Reference edges that align with mating parts

## Common Constraint Problems

### Problem: Sketch Distorts When Dimension Changes

**Cause**: Missing constraints. When you change a dimension, unconstrained elements drift.

**Fix**: Add constraints to stabilize the sketch. Typically:
- Make adjacent lines **parallel** or **perpendicular**
- Make symmetric elements **equal**
- Fix reference points with **Fix** constraint

### Problem: Can't Add a Dimension

**Cause**: The element is already fully constrained by other constraints. Adding a dimension would over-constrain it.

**Fix**: Remove a conflicting constraint first, then add the dimension.

### Problem: Circle Moves When Adjacent Line Changes

**Cause**: The circle's center point is not constrained to a fixed position.

**Fix**: Add a **coincident** constraint between the circle center and a fixed reference point, or use **Fix** on the center point.

## Constraint Strategy for Common Profiles

### Rectangular Plate with Rounded Corners

1. Draw rectangle (auto horizontal/vertical constraints apply)
2. Add **equal** constraint to opposite sides (width = width, height = height)
3. Dimension width and height
4. Fillet corners (fillet tool, not sketch constraint)
5. Add **equal** constraint to all four fillet radii

### Bolt Circle Pattern

1. Draw a construction circle (bolt circle diameter)
2. Draw a small circle on the bolt circle
3. Add **concentric** constraint between small circle center and bolt circle
4. Use **Circular Pattern** to create remaining holes
5. Dimension the bolt circle diameter and hole size

### Symmetric Bracket

1. Draw centerline (construction line, vertical)
2. Sketch left half of profile
3. Mirror about centerline
4. Dimension one side — mirrored side updates automatically
5. Fix the centerline to prevent it from moving
