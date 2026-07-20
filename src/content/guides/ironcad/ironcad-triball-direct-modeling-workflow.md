---
title: "IronCAD Direct Modeling Workflow: When to Use Triball vs Parametric Features"
excerpt: "How to choose between IronCAD's Triball direct modeling and parametric feature tree in different design scenarios — covering speed advantages, editability tradeoffs, and hybrid workflows."
category: "workflow"
softwareSlug: "ironcad"
keyword: "ironcad triball direct modeling parametric"
slug: "ironcad-triball-direct-modeling-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.ironcad.com/blog/anatomy-ironcads-triball/"
  - "https://www.ironcad.academy/tutorial/triball"
---

# IronCAD Direct Modeling Workflow: When to Use Triball vs Parametric Features

IronCAD is unique among mid-range 3D CAD tools — it offers both direct modeling (via the Triball tool) and parametric history-based modeling in the same environment. Most CAD systems force you to choose one paradigm. IronCAD lets you switch freely. After three years of using IronCAD, we've learned when each approach wins and how to combine them.

## Understanding the Two Paradigms

**Parametric (History-Based)**: You build features in sequence — sketch, extrude, fillet, hole, pattern. Each feature is recorded in a feature tree. Editing requires changing a feature and regenerating all downstream features.

**Direct (Triball)**: You manipulate geometry directly — push/pull faces, move edges, rotate selected features with the Triball positioning tool. No history is recorded. Changes are immediate and independent.

## When to Use Parametric Features

Use parametric modeling when:

1. **You need design intent** — If the hole should always be 20mm from the edge, parametric constraints ensure that relationship is maintained when the part size changes.

2. **You're designing a part family** — Configurations and design tables let you generate 50 variants from one parametric model. Direct modeling can't do this.

3. **The part will be modified frequently** — Parametric models are easier to modify predictably. Change the hole diameter from 10mm to 15mm, and the pattern, fillets, and chamfers all update correctly.

4. **You need detailed drawings with GD&T** — Parametric features carry metadata (hole callouts, feature symbols) that links to the 2D drawing. Direct edits may break this linkage.

5. **You're collaborating with SolidWorks or Creo users** — Exporting a parametric model preserves the feature tree (in STEP AP242), which downstream users can modify parametrically.

## When to Use Triball Direct Modeling

Use Triball when:

1. **You're modifying imported geometry** — Received a STEP file from a client and need to move a face 5mm? Triball does it in 2 clicks. Parametric modeling would require reverse-engineering the feature tree.

2. **You're in concept design phase** — Exploring shapes quickly without worrying about feature order. Direct modeling lets you push, pull, and reshape without planning the history tree.

3. **You need to reposition parts in an assembly** — Triball's positioning capabilities (rotate around point, align to face, snap to grid) are faster than mating constraints for quick layout work.

4. **You're doing design modifications on legacy parts** — Old parts with broken or missing feature trees can be edited directly without rebuilding the history.

5. **You're creating tooling or fixtures** — These are typically one-off designs where design intent doesn't matter. Direct modeling is faster.

## The Triball Tool: Key Operations

The Triball is IronCAD's signature direct manipulation tool. Activate it with the **F10** key. The Triball appears at the selected geometry's center.

### Move Face

1. Select a face.
2. Press **F10** to activate Triball.
3. Click and drag an axis handle to move the face along that axis.
4. Type a distance value for precise movement.

### Rotate Feature

1. Select a feature (e.g., a protrusion).
2. Press **F10**.
3. Click the rotation arc around the desired axis.
4. Drag to rotate, or type an angle.

### Copy with Triball

1. Select the feature to copy.
2. Press **F10**.
3. Hold **Ctrl** and drag along an axis — this creates a copy at the new position.
4. For pattern copies: hold **Ctrl+Shift** and drag — IronCAD creates evenly spaced copies.

### Align to Another Face

1. Select the face to move.
2. Press **F10**.
3. Right-click the Triball center → **Align**.
4. Select the target face — the selected face aligns to the target.

## Hybrid Workflow: The Best of Both

The most powerful IronCAD workflow combines both paradigms:

1. **Build the base parametrically** — Create the main body with sketches and extrusions. Add critical features (mounting holes, bearing seats) parametrically with dimensions.

2. **Modify details directly** — Use Triball to adjust fillets, move non-critical features, or tweak imported geometry. These direct edits don't affect the parametric tree.

3. **Use parametric for production parts, direct for tooling** — Design the product parametrically, then design the manufacturing fixtures using direct modeling.

4. **Switch freely during design** — IronCAD tracks both parametric features and direct edits in the same scene. The scene tree shows which features are parametric and which are direct.

## Common Mistakes

**Over-using Triball on parametric parts**: If you directly move a face that was created parametrically, IronCAD adds a "direct edit" feature to the tree. This is fine for one-off adjustments, but if you make many direct edits to a parametric part, the tree becomes confusing and hard to modify later.

**Ignoring Triball for imported parts**: Trying to reverse-engineer a feature tree from an imported STEP file is a waste of time. Use Triball to modify the imported geometry directly — it's faster and more reliable.

**Not using Triball for assembly layout**: Many users default to mating constraints for assembly positioning. For quick layout and concept work, Triball positioning is 5-10× faster. Switch to mates only for final positioning and interference checks.
