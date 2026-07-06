---
title: "EdgeCAM Feature Recognition: Automating Toolpath Generation from Solid Models"
excerpt: "How to use EdgeCAM's Feature Finder to automatically detect pockets, holes, and profiles from solid models — covering feature types, recognition settings, and batch processing for multi-feature parts."
category: "workflow"
softwareSlug: "edgecam"
keyword: "edgecam feature recognition finder automatic toolpath"
slug: "edgecam-feature-recognition-finder-automatic-toolpath"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://hexagon.com/products/edgecam-intelligent-manufacturing"
  - "https://documentation-be.hexagon.com/bundle/edgecam_gs_2022.1/raw/resource/enus/edgecam_gs_2022.1.pdf"
---

# EdgeCAM Feature Recognition: Automating Toolpath Generation from Solid Models

EdgeCAM's Feature Finder is the single biggest time-saver in the software. Instead of manually selecting edges and faces for each operation, Feature Finder scans the solid model and identifies all machinable features automatically. I program a part with 30 features in under 10 minutes — manually it would take an hour. Here's how to use it effectively.

## What Feature Finder Detects

EdgeCAM recognizes these feature types:

- **2D Pockets** — Closed interior regions with flat bottoms
- **2D Profiles** — Open or closed outer edges
- **Holes** — Simple, counterbored, countersunk, tapped
- **Islands** — Raised regions within pockets
- **3D Pockets** — Freeform interior regions
- **3D Profiles** — Freeform outer edges
- **Faces** — Planar surfaces to be machined
- **Slots** — Rectangular or T-shaped channels
- **Engravings** — Text or logo recesses

## Step 1: Load the Solid Model

1. Open EdgeCAM → **File** → **Open** → select a STEP, Parasolid, or SolidWorks file.
2. The model appears in the graphics window.
3. Verify the model orientation matches your machine setup (top view = XY plane, Z = spindle axis).
4. If the orientation is wrong, use **Geometry** → **Transform** → **Rotate** to reposition.

## Step 2: Run Feature Finder

1. Go to **Machining** → **Feature Finder**.
2. The Feature Finder dialog appears with these options:

### Recognition Settings

- **Feature types to find**: Check the types you want detected (pockets, profiles, holes, etc.). Uncheck types you don't need.
- **Minimum feature size**: Set to 0.1mm (ignores tiny features from model tolerances).
- **Hole detection mode**: 
  - **All holes**: Detects every circular feature
  - **Through holes only**: Only holes that go through the part
  - **Blind holes only**: Only holes with a defined depth
- **Pocket detection mode**:
  - **With islands**: Detects pockets that contain raised islands
  - **Simple only**: Only detects pockets without islands
- **Profile detection mode**:
  - **Closed only**: Only closed loops (complete outlines)
  - **Open and closed**: Includes open profiles (edges that don't form a closed loop)

3. Click **Find Features**.
4. EdgeCAM scans the model and displays found features in the feature tree.
5. Each feature is color-coded by type (pockets = blue, profiles = green, holes = red).

## Step 3: Review Detected Features

Feature Finder is about 85% accurate. Always review the results:

### Check for Missing Features

Scroll through the model and compare against the feature tree. Common misses:
- **Shallow pockets** (< 0.5mm depth) may not be detected — set minimum feature size lower
- **Non-circular holes** (square, hexagonal) aren't detected as holes — manually create them as pockets
- **Partial radius edges** — fillets between faces may be missed as profile features

### Check for False Positives

- **Chamfers detected as profiles** — A chamfer edge may be detected as a profile feature. Delete it if you don't need to machine the chamfer separately.
- **Internal fillets detected as pockets** — Small fillet radii inside a pocket may be detected as separate features. Merge them with the parent pocket.

### Edit Feature Properties

Right-click a feature → **Properties**:
- **Depth**: Verify the detected depth matches the model
- **Stock allowance**: Set how much material to leave for finishing (typically 0.3mm)
- **Approach/exit**: Define how the tool enters and exits the feature
- **Machining order**: Set priority for this feature in the operation sequence

## Step 4: Assign Operations to Features

Once features are verified, assign machining operations:

### Batch Assignment (Fast)

1. Select multiple features of the same type (e.g., all holes).
2. Right-click → **Assign Operation**.
3. Select the operation type:
   - Holes → **Drilling**, **Tapping**, **Boring**
   - Pockets → **Roughing**, **Finishing**
   - Profiles → **Profiling**
4. EdgeCAM assigns the same operation to all selected features.
5. Select the tool from your tool library.
6. EdgeCAM generates toolpaths for all features automatically.

### Individual Assignment (Precise)

For features requiring specific parameters:
1. Right-click a single feature → **Assign Operation**.
2. Configure operation-specific settings (stepover, depth per cut, feed rate).
3. Repeat for each feature.

## Step 5: Auto-Sequence Operations

After assigning operations, EdgeCAM can optimize the machining sequence:

1. Go to **Machining** → **Sequence** → **Auto-Sequence**.
2. Set sequencing rules:
   - **Tool priority**: Group operations by tool (minimizes tool changes)
   - **Depth priority**: Machine from top to bottom (prevents cutting through stock that supports the part)
   - **Feature type priority**: Rough all pockets, then finish all pockets, then profile all edges
3. Click **Apply**.
4. EdgeCAM reorders operations to minimize tool changes and ensure safe machining order.

## Step 6: Simulate and Verify

1. Run solid simulation on the complete sequence.
2. Verify all features are machined correctly.
3. Check for rest material in pockets (may need a separate finishing operation).
4. Check for gouges on profiles (may need to adjust stock allowance).

## Tips for Better Feature Recognition

### Clean Up the Model Before Import

Feature Finder works best with clean, well-defined solid models:
- Remove cosmetic features (logos, text engravings) that you don't need to machine
- Simplify complex fillets to standard radii
- Ensure all holes are properly defined (not just cylindrical surfaces)

### Use Feature Templates

If you machine similar parts repeatedly:
1. Create a feature template with pre-assigned operations and tools.
2. Save the template: **Feature** → **Save Template**.
3. On the next similar part, load the template: **Feature** → **Load Template**.
4. EdgeCAM matches features to the template and assigns operations automatically.

### Handle Complex Features Manually

Feature Finder can't handle everything. For these, create features manually:
- **3D sculpted surfaces** — Use **3D Machining** → **Z-Level Finishing** directly on the surface
- **Undercuts** — Use **3D Machining** → **Pencil Tracing** or **Rest Machining**
- **Thread milling** — Create a hole feature, then assign a thread mill operation with custom parameters

## Common Issues

**Feature Finder finds nothing**: The model may be imported as surfaces instead of a solid. Re-import with the **Import as Solid** option. If the source file is IGES, it may contain unconnected surfaces — use STEP instead.

**Hole depths are wrong**: Feature Finder uses the solid model's geometry to determine depth. If the model has a through-hole but the detection shows it as blind, check if there's a thin surface at the bottom of the hole in the model. Remove it in the CAD system and re-import.

**Pockets detected as profiles**: If a pocket has an open side (not fully enclosed), Feature Finder may detect it as a profile instead. Manually create a pocket feature and select the edges yourself.
