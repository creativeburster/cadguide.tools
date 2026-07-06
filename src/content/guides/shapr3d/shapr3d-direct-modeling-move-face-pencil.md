---
title: "Shapr3D Direct Modeling: Move, Rotate, and Scale Faces with Pencil Gestures"
excerpt: "How to use Shapr3D's direct modeling tools on iPad — covering face move, rotate, scale, copy, and the quick-selection techniques that make Pencil-based editing faster than mouse-based CAD."
category: "workflow"
softwareSlug: "shapr3d"
keyword: "shapr3d direct modeling move face pencil"
slug: "shapr3d-direct-modeling-move-face-pencil"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://help.shapr3d.com/direct-modeling"
  - "https://www.shapr3d.com/download/ipad"
---

# Shapr3D Direct Modeling: Move, Rotate, and Scale Faces with Pencil Gestures

Shapr3D combines direct modeling with Pencil-based input, and the result is the fastest face-editing workflow I've used in any CAD tool. Moving a face in SolidWorks takes 4-5 clicks. In Shapr3D, it takes 2 taps and a drag. Here's the complete direct modeling toolkit.

## The Select Tool

The foundation of direct modeling in Shapr3D is the **Select** tool:

1. Tap **Select** in the toolbar.
2. Tap a face on the 3D model — it highlights in blue.
3. Tap additional faces to add to the selection (multi-select).
4. Tap and hold a face, then drag to pre-position before committing.

Selection filters:
- **Faces only**: Tap the face filter icon → only faces are selectable
- **Edges only**: Tap the edge filter → only edges are selectable
- **Bodies**: Tap the body filter → entire bodies are selectable

## Move Tool

### Move a Single Face

1. Select a face.
2. Tap **Move/Rotate** from the toolbar.
3. A manipulator (gizmo) appears at the face center with three axis arrows and three rotation arcs.
4. Drag an **axis arrow** to move the face along that axis.
5. Type a distance value for precise movement.
6. Tap **Done** to commit.

The face moves and adjacent faces extend or trim to maintain the solid. This is true direct modeling — no feature tree, no regeneration, just immediate geometry changes.

### Move Multiple Faces

1. Select multiple faces (tap each one).
2. Tap **Move/Rotate**.
3. The gizmo appears at the centroid of selected faces.
4. Drag to move all faces together.
5. Adjacent faces update to maintain solid topology.

### Copy While Moving

1. Select a face.
2. Tap **Move/Rotate**.
3. Tap the **Copy** option in the move panel.
4. Drag to the new position.
5. The original face stays; a copy appears at the new position.
6. Adjacent faces extend to incorporate the copy.

This is useful for adding repeated features (ribs, bosses) without using the Pattern tool.

## Rotate Tool

### Rotate a Face

1. Select a face.
2. Tap **Move/Rotate**.
3. Drag a **rotation arc** (the curved arrows between the axis arrows).
4. The face rotates around the gizmo center.
5. Type an angle for precise rotation.

### Rotate Around a Custom Pivot

1. Select a face.
2. Tap **Move/Rotate**.
3. Tap the gizmo center → tap **Move Pivot**.
4. Tap a new pivot point on the model.
5. Drag a rotation arc — the face rotates around the new pivot.

This is essential for rotating features around an edge or hole center.

## Scale Tool

### Scale a Body

1. Select an entire body (body filter).
2. Tap **Scale**.
3. A scale gizmo appears with a uniform scale handle.
4. Drag the handle to scale uniformly.
5. Type a scale factor (e.g., 2.0 for double size, 0.5 for half size).

### Non-Uniform Scale

1. Select a body.
2. Tap **Scale**.
3. Drag an **axis handle** (not the uniform handle) to scale along one axis only.
4. This stretches or compresses the body in one direction.

Non-uniform scale is useful for adjusting a part to fit a specific envelope without redesigning features.

## Face Offset (Thickness Adjustment)

1. Select a face.
2. Tap **Offset**.
3. Drag to set offset distance (positive = outward, negative = inward).
4. The face moves parallel to its original position.
5. Adjacent faces adjust to maintain the solid.

This is the fastest way to change wall thickness or adjust a part's overall size without editing the original sketch.

## Delete Face

1. Select a face.
2. Tap **Delete**.
3. Shapr3D removes the face and heals the surrounding geometry.
4. For through-holes: select all cylindrical faces of the hole, then delete — the hole fills in.

## Combine Operations

### Subtract (Boolean Cut)

1. Position two bodies so they overlap.
2. Select the body to keep (target).
3. Tap **Subtract**.
4. Select the body to remove (tool).
5. Tap **Done** — the tool body is subtracted from the target.

### Union (Boolean Add)

1. Position two bodies so they touch or overlap.
2. Select the first body.
3. Tap **Union**.
4. Select the second body.
5. Tap **Done** — the bodies merge into one.

### Intersect

1. Position two overlapping bodies.
2. Select the first body.
3. Tap **Intersect**.
4. Select the second body.
5. Tap **Done** — only the overlapping volume remains.

## Pencil Gesture Shortcuts

Shapr3D supports Pencil gestures that speed up common operations:

- **Tap + hold + drag on a face**: Quick-move the face along its normal direction
- **Double-tap a face**: Select all adjacent faces (useful for selecting a pocket's interior)
- **Tap + hold on an edge**: Select the entire edge loop (connected edges)
- **Two-finger tap**: Undo (same as ⌘Z on keyboard)
- **Three-finger swipe left/right**: Undo/Redo

## Tips for Faster Direct Modeling

1. **Use selection filters** — Switch to face-only mode when editing faces to avoid accidentally selecting edges or bodies.

2. **Work in orthographic view** — Switch to front/top/right view for precise face selection. Isometric view can make it hard to tap the correct face on dense models.

3. **Hide bodies you're not editing** — Tap a body in the items list → tap the eye icon to hide it. This prevents accidental selection and reduces visual clutter.

4. **Use Section View** — Tap **Section** → drag the cutting plane through the model. This exposes interior faces for selection and editing — essential for modifying internal features.

5. **Combine direct modeling with parametric sketches** — Create the base form with sketches and extrusions, then use direct modeling for modifications. Shapr3D supports both paradigms in the same model.
