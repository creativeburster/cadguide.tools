---
title: "Marvelous Designer Pattern Making: Polygon Tool, Sewing, and Internal Lines Guide"
excerpt: "Pattern making in Marvelous Designer follows real-world garment construction — draft 2D pattern pieces, sew them together, and simulate. I cover the Polygon and Rectangle tools, segment and free sewing, internal lines for details and wrinkles, and the workflow for creating a complete garment from scratch."
category: "workflow"
softwareSlug: "marvelous-designer"
keyword: "Marvelous Designer pattern making polygon tool sewing internal lines"
slug: "marvelous-designer-pattern-making-polygon-sewing-internal-lines"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358234730905-4-Pattern-Making"
  - "https://support.marvelousdesigner.com/hc/en-us/articles/47358302592409-3D-Segment-Sewing-VER4-2-0"
  - "https://www.versluis.com/2020/11/how-to-trace-patterns-in-marvelous-designer/"
  - "https://create.imvu.com/articles/studio/imvu-studio-marvelous-designer-making-a-garment/"
---

# Marvelous Designer Pattern Making: Polygon Tool, Sewing, and Internal Lines Guide

I've created garments ranging from simple t-shirts to complex historical costumes in Marvelous Designer, and the pattern making workflow is fundamentally the same as real-world garment construction. You draft 2D pattern pieces, sew them together, and let the simulation handle the 3D draping. Understanding the tools and their shortcuts is essential for efficient garment creation.

## Pattern Creation Tools

### Polygon Tool (H)

The Polygon tool is the primary tool for creating free-form pattern shapes. It's the tool I use most frequently.

**How to use**:
1. Press **H** to activate the Polygon tool
2. Click in the 2D window to start creating a pattern
3. Click additional points to define the shape
4. Click the starting point to close the pattern
5. A new pattern piece is created

**Key modifiers**:
- **Ctrl + click**: Create a curved (Bezier) point instead of a corner point
- **Shift + click**: Enable smart guides (90° and 45° snapping)
- **Click and drag**: Draw Bezier curves directly
- **Delete/Backspace**: Undo the last point
- **Esc**: Cancel and start over

### Rectangle Tool (S)

Creates rectangular pattern pieces. Faster than Polygon for simple shapes.

1. Press **S** to activate the Rectangle tool
2. Click and drag to define the rectangle
3. The pattern is created with four corner points

I use the Rectangle tool for simple panels (sleeves, pant legs) and then refine with the Edit Pattern tool.

### Internal Polygon/Line Tool (G)

Draws lines or shapes within an existing pattern piece. Used for:
- Internal seam lines (darts, pleats)
- Cut lines for splitting a pattern into multiple pieces
- Reference lines for sewing

1. Press **G** to activate
2. Single-click to start a line, double-click to end
3. **Shift**: Lock to 90° or 45°
4. Create a closed shape by connecting endpoints
5. Right-click while creating to open the Create Internal Polygon dialog

## Editing Patterns

### Edit Pattern Tool (Z)

The most frequently used tool after creation. Select and modify pattern elements.

1. Press **Z** to activate
2. Click on points, lines, or the pattern itself to select
3. Drag to move selected elements
4. **Shift + click**: Select/deselect multiple elements
5. Selected elements turn blue when hovered, highlighted when selected

### Edit Curve Point Tool

Converts straight lines to curves and adjusts existing curves.

1. Select a line segment with the Edit Pattern tool
2. Right-click → Edit Curve Point
3. Click and drag on the line to create a curve
4. Adjust Bezier handles to refine the curve shape

As one tutorial describes: "Click and drag onto the line that's supposed to be curved and just drag it close to the curve in the pattern. If it does not work with one point, set one or more additional points until the curve is complete."

### Add Point/Split Line

Adds points to existing lines, allowing you to create more complex shapes.

1. Select a line segment
2. Right-click → Add Point (or use the toolbar icon)
3. Click on the line where you want to add a point
4. The line is split into two segments at that point

## Sewing Tools

### Segment Sewing (N)

The most common sewing method. Connects corresponding segments between two pattern pieces.

1. Press **N** to activate Segment Sewing
2. All sewable segments are highlighted (bold lines)
3. Click on a segment of the first pattern piece
4. Hover over the segment to be sewn on the second pattern piece
5. Align the directional notches (small arrows) so they point in the same direction
6. Click to create the seam

**Critical**: Directional notches must be parallel. If they're crossed, the garment will be inside-out after simulation.

### Free Sewing (M)

Allows sewing between arbitrary points rather than predefined segments. Useful for:
- Sewing partial segments
- Connecting points on different parts of patterns
- Creating non-standard seam lines

1. Press **M** to activate Free Sewing
2. Click the start point on the first pattern
3. Hover to the end point, click to finish the first half
4. Repeat on the second pattern piece

### M:N Segment Sewing

Sews multiple segments on one pattern to a single segment on another (or vice versa). Useful for:
- Sewing a curved sleeve cap to a straight armhole
- Gathering fabric
- Creating complex seam lines

1. Use Segment Sewing
2. Hold the shortcut key for M:N sewing (usually Ctrl or Shift depending on version)
3. Select multiple segments on one side, then one segment on the other

### 3D Segment Sewing

Sewing can be done in the 3D window as well as the 2D window:
1. Main Menu → Sewing → Segment Sewing
2. Click pattern segments directly in the 3D view
3. Sewing lines appear in both 2D and 3D windows simultaneously

This is useful when you can see which edges need to be connected more clearly in 3D than in 2D.

## Internal Lines for Details and Wrinkles

Internal lines serve multiple purposes in garment construction:

### Darts

Create tapered internal lines that remove fabric volume:
1. Draw an internal line (G tool) in a V or diamond shape
2. Right-click the internal line → Edit Sewing
3. Sew the internal line to itself (fold the dart)
4. Simulate to see the dart shape the fabric

### Pleats

Create parallel internal lines and sew them together:
1. Draw multiple parallel internal lines
2. Sew adjacent lines together
3. Simulate to form the pleats

### Topstitching

Add visible stitching lines on the garment surface:
1. Draw internal lines where you want topstitching
2. Right-click → Topstitch
3. Configure stitch type, length, and thread color

### Controlled Wrinkling

Internal lines can control where fabric wrinkles:
1. Draw internal lines at points where you want wrinkles to form
2. Set the internal line's "Shrinking" property
3. Simulate — the fabric contracts at the internal line, creating controlled wrinkles

## Complete Garment Workflow: Simple T-Shirt

Here's the workflow I use to create a basic t-shirt:

### Step 1: Create the Front Panel
1. Use the Rectangle tool (S) to create a rectangle roughly the width of the torso + ease
2. Use Edit Pattern (Z) to select the top edge
3. Use Edit Curve Point to create a neckline curve
4. Use Add Point to mark shoulder points and armhole points
5. Edit the armhole edge to create a curve

### Step 2: Create the Back Panel
1. Copy the front panel (Ctrl+C, Ctrl+V)
2. Adjust the neckline to be higher (back of neck)
3. The shoulder and side seams should match the front panel

### Step 3: Create Sleeves
1. Use the Polygon tool (H) to create a sleeve shape
2. Curve the top edge (sleeve cap) to fit the armhole
3. Use Symmetric Editing to ensure both sleeves are identical

### Step 4: Position on Avatar
1. Click Show Arrangement Points
2. Snap the front panel to the chest arrangement point
3. Snap the back panel to the back arrangement point
4. Snap sleeves to the shoulder arrangement points

### Step 5: Sew
1. Use Segment Sewing (N) to sew shoulder seams (front to back)
2. Sew side seams (front to back)
3. Sew sleeve caps to armholes
4. Sew sleeve underseams
5. Sew sleeve hems

### Step 6: Simulate
1. Turn on simulation at low resolution (2)
2. Let the garment settle on the avatar
3. Check for clipping, floating, or misaligned seams
4. Adjust pattern dimensions as needed
5. Increase resolution to 5-7 for final detail

## Tracing Patterns from Images

For reproducing real garment patterns:
1. Create a material with the pattern image as a texture
2. Apply it to a background pattern piece
3. Create a second material for tracing (40% opacity)
4. Use the Polygon tool (H) to trace the pattern outline
5. Use Edit Curve Point to match curves in the image
6. Delete the background image when tracing is complete

## Summary

Pattern making in Marvelous Designer follows real-world garment construction: create 2D pattern pieces with the Polygon or Rectangle tools, refine shapes with Edit Pattern and Edit Curve Point, connect pieces with Segment or Free Sewing, and simulate to see the 3D result. Internal lines add darts, pleats, topstitching, and controlled wrinkling. The workflow is iterative — create, position, sew, simulate, adjust, re-simulate. Start with simple garments (t-shirts, skirts) before attempting complex multi-panel garments like jackets and dresses.
