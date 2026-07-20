---
title: "Shapr3D on iPad Pro: Complete Mobile CAD Workflow from Sketch to Manufacturing"
excerpt: "How to run a complete product design workflow on iPad Pro using Shapr3D — covering sketching with Apple Pencil, 3D modeling, exporting STEP files, and sending parts to CNC machining."
category: "workflow"
softwareSlug: "shapr3d"
keyword: "shapr3d ipad pro mobile cad workflow"
slug: "shapr3d-ipad-pro-mobile-cad-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.shapr3d.com/download/ipad"
  - "https://illustrarch.com/articles/design-softwares/93688-shapr3d-review-architects.html"
---

# Shapr3D on iPad Pro: Complete Mobile CAD Workflow from Sketch to Manufacturing

I designed a complete product — from concept sketch to CNC-ready STEP file — entirely on an iPad Pro with Shapr3D. No desktop, no external monitor. It works. Here's the full workflow I use for client projects.

## Hardware Setup

- **iPad Pro 12.9" (M2 or later)** — The larger screen gives enough workspace for sketching and modeling. M1 works but M2+ handles complex models better.
- **Apple Pencil 2** — Essential. Shapr3D is designed around Pencil input. Touch-only modeling is impractical.
- **Magic Keyboard** (optional) — For typing dimensions and navigating the UI faster. Not required but helpful for production work.

## Step 1: Import Reference Material

1. Open Shapr3D on iPad.
2. Tap **Import** → select an image (sketch, photo, or reference drawing).
3. The image appears as a reference plane in the 3D workspace.
4. Scale the image: tap the image → drag the scale handle → enter a known dimension.
5. Position the image as a background reference for sketching.

For 2D drawings (DWG/DXF):
1. Tap **Import** → select DWG/DXF file.
2. The 2D geometry appears as sketch lines in the workspace.
3. Use these lines directly for extrusion or as references for 3D modeling.

## Step 2: Sketch with Apple Pencil

Shapr3D's sketching is the most intuitive of any CAD tool I've used:

1. Tap **Sketch** → select a plane (XY, XZ, YZ, or a face of existing geometry).
2. Draw lines freehand with the Pencil — Shapr3D auto-snaps to horizontal, vertical, and parallel.
3. Draw a circle: tap the center point, drag to set radius.
4. Draw a rectangle: tap two opposite corners.
5. Add dimensions: tap a line → drag the dimension label → type the value on the keyboard or with Pencil.

Sketch constraints appear automatically:
- **Coincident** — Two endpoints at the same point
- **Horizontal/Vertical** — Lines aligned to axes
- **Parallel** — Two lines at the same angle
- **Equal** — Two lines or arcs with the same length/radius

To add a constraint manually: tap and hold two sketch elements → select the constraint from the pop-up menu.

## Step 3: Create 3D Features

### Extrude

1. Select a closed sketch profile.
2. Tap **Extrude** → drag the arrow to set height, or type a value.
3. For subtractive extrude (cut): tap the **Remove** option before extruding.

### Revolve

1. Select a closed profile and an axis line.
2. Tap **Revolve** → drag to set the angle (360° for full revolution).
3. Creates cylindrical or rotational parts.

### Sweep

1. Create a profile sketch and a path sketch (on a different plane).
2. Select the profile and the path.
3. Tap **Sweep** — Shapr3D sweeps the profile along the path.

### Loft

1. Create two or more profiles on different planes.
2. Select all profiles in order.
3. Tap **Loft** — creates a transitional shape between profiles.

## Step 4: Add Detail Features

### Fillet

1. Select an edge (tap it with Pencil).
2. Tap **Fillet** → drag to set radius, or type a value.
3. For variable-radius fillets: tap the edge at multiple points and set different radii.

### Chamfer

1. Select an edge.
2. Tap **Chamfer** → set distance and angle.

### Shell

1. Select a face to remove (the "open" face of a shell).
2. Tap **Shell** → set wall thickness.
3. Shapr3D hollows the part, leaving the specified wall thickness.

### Pattern

1. Select a feature (extrude, hole, fillet).
2. Tap **Pattern** → choose **Linear** or **Circular**.
3. Set count and spacing (linear) or count and angle (circular).

## Step 5: Create 2D Drawings

Shapr3D can generate 2D drawings directly on iPad:

1. Tap **Drawings** → **New Drawing**.
2. Select the part.
3. Choose view layout: **Single view**, **Three views**, or **Isometric + views**.
4. Set paper size (A4, A3, ANSI B, etc.) and scale.
5. Shapr3D generates the views automatically.
6. Add dimensions: tap an edge → drag the dimension to position.
7. Add annotations: tap the text tool → tap the drawing → type notes.
8. Export as PDF or DWG.

## Step 6: Export for Manufacturing

1. Tap **Export** → choose format:
   - **STEP** (AP242) — For CNC machining, injection molding
   - **STL** — For 3D printing
   - **OBJ** — For rendering and visualization
   - **3MF** — For 3D printing with color
   - **DXF** — For 2D cutting (laser, waterjet)
2. Set options:
   - **Units**: Millimeters (standard for manufacturing)
   - **Resolution** (STL only): 0.05mm deviation for most 3D printing
3. Tap **Export** → save to Files, send via email, or upload to cloud storage.

## Step 7: Cloud Sync and Collaboration

Shapr3D syncs to Shapr3D Cloud automatically:

1. All files are saved to the cloud by default.
2. On desktop (Mac/Windows), open Shapr3D → files appear in the cloud panel.
3. Changes sync between iPad and desktop in seconds.
4. Share a file: tap the share icon → send a link → recipient views in browser (no Shapr3D license needed for viewing).

## Limitations of iPad-Only Workflow

Shapr3D on iPad can't do:
- **Large assemblies** — Practical limit is ~50 parts. Above that, the iPad struggles.
- **Complex surface modeling** — No G2 continuity, no surface trim/extend tools.
- **Sheet metal** — No dedicated sheet metal module.
- **Simulation (FEA)** — Not available on iPad.
- **Rendering** — Basic only. For photorealistic renders, export to KeyShot or Blender on desktop.

## My Verdict

For individual product designers and small projects, the iPad-only workflow is viable and enjoyable. The Pencil-based sketching is faster than mouse-based sketching in any desktop CAD. For complex assemblies or production-level manufacturing documentation, you'll need to move to desktop Shapr3D or another CAD system.
