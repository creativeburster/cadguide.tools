---
title: "Tinkercad for Beginners: Creating Your First 3D Model for 3D Printing"
excerpt: "Step-by-step guide to creating your first 3D model in Tinkercad — covering the interface, basic shapes, grouping, hole tool, and exporting an STL file ready for 3D printing."
category: "workflow"
softwareSlug: "tinkercad"
keyword: "tinkercad beginners first 3d model 3d printing"
slug: "tinkercad-beginners-first-3d-model-3d-printing"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://nozzledown.com/tinkercad-tutorial-2026-design-first-3d-printable-object/"
  - "https://learn.sparkfun.com/tutorials/getting-started-with-3d-printing-using-tinkercad/modeling-in-tinkercad"
---

# Tinkercad for Beginners: Creating Your First 3D Model for 3D Printing

Tinkercad is the easiest way to start 3D modeling. I teach 3D printing workshops and Tinkercad is where everyone begins. No installation needed — it runs in the browser. Here's how to create your first printable model.

## Getting Started

1. Go to **tinkercad.com** → sign in with an Autodesk account (free).
2. Click **Create New Design**.
3. The workspace opens with:
   - **Shape panel** (right side): Basic shapes, holes, text, and shape generators
   - **Workplane** (center): The grid where you build your model
   - **View controls** (left side): Zoom, pan, rotate
   - **Toolbar** (top): Group, ungroup, align, mirror, ruler

## Navigation

- **Rotate view**: Right-click + drag, or use the cube icon on the left
- **Pan**: Hold Shift + right-click + drag
- **Zoom**: Scroll wheel
- **Reset view**: Click the home icon

## Project 1: Simple Name Tag

### Step 1: Create the Base

1. Click **Box** from the shape panel → click on the workplane to place it.
2. Click on the box to select it → drag the corner handles to resize:
   - **Width**: 60mm
   - **Depth**: 20mm
   - **Height**: 3mm (drag the cone handle on top)

3. Use the ruler tool for precise dimensions:
   - Click **Ruler** from the toolbar → click on the workplane
   - Enter exact dimensions in the inspector panel

### Step 2: Add a Hole for the String

1. Click **Hole** from the shape panel (it appears as a gray cylinder).
2. Place it on the left end of the name tag.
3. Resize:
   - **Diameter**: 4mm (for a string or chain)
   - **Height**: 5mm (taller than the base so it cuts through)

4. Position the hole:
   - Drag it to the left end, centered vertically
   - Use the black cone handle to raise it so it's centered through the 3mm base

5. Select both the box and the hole → click **Group** in the toolbar.
6. The hole cuts through the base — you now have a name tag with a string hole.

### Step 3: Add Text

1. Click **Text** from the shape panel → click on the workplane.
2. Type your name in the text field.
3. Set the text height to 2mm (so it sits on top of the 3mm base).
4. Resize the text to fit on the name tag:
   - Width: ~40mm
   - Depth: ~10mm

5. Position the text:
   - Drag it onto the name tag
   - Use the black cone to set the height to 3mm (sitting on top of the base)
   - The text will protrude 2mm above the base (total height 5mm)

6. Select all objects → **Group** → the text is now part of the name tag.

### Step 4: Export for 3D Printing

1. Click **Export** (top right).
2. Select **STL** — the standard format for 3D printing.
3. The STL file downloads to your computer.

4. Open in your 3D printing slicer (Cura, PrusaSlicer, etc.):
   - Set layer height: 0.2mm (standard quality)
   - Set infill: 20% (the name tag is solid enough at 20%)
   - Set print speed: 50mm/s
   - Add a brim if the base has adhesion issues

5. Print!

## Project 2: Phone Stand

### Step 1: Create the Base

1. Place a **Box**: 80×40×10mm.
2. Round the edges:
   - Add a **Hole** box at each corner (10×10×15mm)
   - Group to round the corners

### Step 2: Create the Slot

1. Place a **Hole** box: 60×10×5mm.
2. Position it on top of the base, centered, at the back.
3. Group to create a slot for the phone to sit in.

### Step 3: Add a Back Support

1. Place a **Box**: 60×5×50mm.
2. Position it behind the slot, standing vertically.
3. Angle it slightly backward (10°) for a better viewing angle:
   - Select the box → click the rotation handle → rotate 10°

4. Group all parts together.

### Step 4: Export and Print

1. Export as STL.
2. Print with 30% infill for strength.

## Essential Tinkercad Techniques

### The Hole Tool

Holes cut through solid objects when grouped:
1. Place a solid shape (e.g., box).
2. Place a hole shape on top of it.
3. Select both → **Group** → the hole cuts through the solid.

### Align Tool

1. Select two or more objects.
2. Click **Align** in the toolbar.
3. Alignment handles appear on each axis.
4. Click a handle to align the objects on that axis.

### Mirror Tool

1. Select an object.
2. Click **Mirror** in the toolbar.
3. Choose the mirror axis (X, Y, or Z).
4. The object is mirrored — useful for creating symmetric parts.

### Workplane Tool

1. Click **Workplane** from the shape panel.
2. Click on a face of an existing object.
3. A new workplane is placed on that face.
4. New shapes are placed on this workplane instead of the grid.
5. This is essential for building on angled or vertical surfaces.

### Shape Generators

Tinkercad has community-created shape generators for complex geometry:
1. Click **Shape Generators** in the shape panel.
2. Browse categories: All, Featured, Community.
3. Useful generators:
   - **Text on a curve**: For curved text
   - **Gear**: For mechanical gears
   - **Thread**: For screw threads
   - **Pipes**: For tubular structures

## Tips for Better Models

1. **Keep it simple**: Tinkercad is for simple models. If your design has more than 30 shapes, consider moving to Fusion 360 or FreeCAD.

2. **Check dimensions**: Use the ruler tool to verify dimensions before exporting. 3D printers are precise — a 0.5mm error can make parts not fit.

3. **Avoid overhangs > 45°**: 3D printers can't print in mid-air. If your model has overhangs steeper than 45°, add supports in your slicer.

4. **Export as STL for printing, OBJ for rendering**: STL is the standard for 3D printing. OBJ preserves colors and is better for rendering.

5. **Measure with the ruler**: The ruler tool shows precise dimensions of any object. Use it to verify your model fits the intended space.
