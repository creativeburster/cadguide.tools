---
title: "FreeCAD TechDraw Slow Performance: View Rendering, Dimension Lag, and Export Fixes"
excerpt: "FreeCAD's TechDraw workbench takes minutes to render views and lags when placing dimensions. I cover the Keep Updated setting, view simplification, and the external rendering workflow that keeps TechDraw usable."
category: "performance"
softwareSlug: "freecad"
keyword: "FreeCAD TechDraw slow performance view rendering dimension"
slug: "freecad-techdraw-slow-performance-view-rendering-fix"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-24"
sources:
  - "https://github.com/FreeCAD/FreeCAD/issues/18735"
  - "https://github.com/FreeCAD/FreeCAD/issues/20157"

---

# FreeCAD TechDraw Slow Performance: View Rendering, Dimension Lag, and Export Fixes

FreeCAD's TechDraw workbench is the built-in 2D drawing tool for creating technical drawings from 3D models. It replaced the older Drawing workbench and is significantly more capable, but it has well-known performance issues. Users on the FreeCAD Developer Forum reported that files containing TechDraw pages took minutes to open, and the investigation revealed that TechDraw page recalculation was the primary bottleneck. Even on fast hardware, TechDraw can freeze FreeCAD for extended periods when rendering complex views or updating dimensions.

## Understanding TechDraw Performance

### How TechDraw Works

TechDraw creates 2D projections of 3D geometry using OCCT's HLR (Hidden Line Removal) algorithm. For each view, TechDraw:

1. Loads the 3D geometry from the referenced body or assembly
2. Calculates the projection direction based on the view orientation
3. Runs HLR to determine visible and hidden edges
4. Renders the edges as 2D geometry on the drawing page
5. Calculates dimension positions based on the projected geometry

Step 3 (HLR) is the most computationally expensive. For a complex model with thousands of edges, HLR can take 30+ seconds per view. With 10 views on a page, that's 5+ minutes of rendering.

### Why TechDraw Gets Slower Over Time

1. **Model complexity increases**: As you add features to the 3D model, each view has more edges to process
2. **Multiple pages**: Each page recalculates independently, so more pages = longer total time
3. **Linked geometry**: Views that reference external files must load those files before rendering
4. **Dimension recalculation**: Each dimension queries the 3D model for geometry positions

## Fix 1: Set Keep Updated to False

This is the most important setting for TechDraw performance:

1. Select each TechDraw page in the Model tree
2. In the **Property** panel (Data tab), find **Keep Updated**
3. Set it to **false**
4. Now views are only recalculated when you manually update them
5. To manually update: right-click the page → **Update Page**

### Benefits

- File opens instantly (no auto-recalculation)
- You can edit the 3D model without waiting for TechDraw to update
- You control when rendering happens — update only when ready

### Workflow

1. Set Keep Updated to false on all pages
2. Work on the 3D model
3. When ready to check the drawing, right-click each page → **Update Page**
4. Wait for rendering to complete
5. If you need to make more model changes, the pages stay in their current state until you update again

## Fix 2: Reduce View Complexity

### Use Section Views Instead of Full Views

1. A section view shows only the cut surface and visible edges behind the cut
2. This processes much less geometry than a full external view
3. Use **TechDraw → Section View** instead of a standard **View**

### Use Detail Views

1. Instead of showing an entire assembly in one view, use **Detail Views**
2. Detail views show only a zoomed-in portion of the model
3. Less geometry is processed per view

### Limit the Displayed Geometry

1. In the View properties, find **Source**
2. Instead of selecting the entire assembly, select only the relevant body
3. The view will only render that body's geometry
4. Use multiple views, each showing a different body, instead of one view showing everything

### Adjust View Direction

1. Orthographic views (front, top, side) process fewer edges than isometric views
2. Use orthographic views for primary dimensions
3. Use one isometric view for visual reference only

## Fix 3: Use the Coarse View Setting

1. Select a TechDraw view in the Model tree
2. In the **Property** panel, find **Coarse View**
3. Set it to **true**
4. Coarse View uses simplified geometry for rendering
5. The view renders faster but with less detail
6. Set Coarse View to **false** before final export

## Fix 4: Separate TechDraw into Its Own File

As identified in the forum discussion, mixing TechDraw pages with assembly data in the same file causes performance problems:

1. Create your 3D model in one file (e.g., `model.FCStd`)
2. Create a separate file for drawings (e.g., `drawing.FCStd`)
3. In the drawing file, use **File → Import** to bring in the model file
4. Create TechDraw pages in the drawing file
5. The model file opens and edits quickly (no TechDraw overhead)
6. The drawing file opens with TechDraw but no assembly solver overhead

### Using External Links

1. In the drawing file, use **Link to External File** to reference the model
2. Changes to the model file will be reflected when you update the drawing file
3. This keeps the two files in sync without mixing their data

## Fix 5: Optimize Dimension Performance

### Use 3D Dimensions Instead of 2D

1. In the Part Design workbench, use **Sketcher dimensions** to dimension features
2. These dimensions are stored in the 3D model, not in TechDraw
3. They don't cause TechDraw recalculation
4. In TechDraw, use **Projected Dimensions** to display the 3D dimensions

### Avoid Dimensioning to Splines and Curves

1. Dimensioning to spline endpoints or curve intersections is computationally expensive
2. TechDraw must calculate the exact intersection point each time
3. Dimension to straight edges and circular arcs instead
4. If you must dimension to a curve, use a reference point created in the 3D model

### Batch Dimension Placement

1. Place all dimensions on one view before switching to another view
2. Each view switch triggers a recalculation of the previous view
3. By batching dimensions on one view, you minimize view switches

## Fix 6: Optimize Export Performance

### Export to SVG Instead of PDF

1. SVG export is faster than PDF export
2. SVG is a vector format that preserves line quality
3. Use **File → Export → SVG** to export individual pages
4. Convert SVG to PDF using an external tool (Inkscape, rsvg-convert)

### Export One Page at a Time

1. Don't export all pages simultaneously
2. Select one page in the Model tree
3. Use **File → Export → PDF** and select **Selected Objects Only**
4. Repeat for each page
5. Combine PDFs using an external tool

### Reduce Export Resolution

1. In the Export dialog, reduce the DPI setting
2. 150 DPI is sufficient for most technical drawings
3. Use 300 DPI only for final client deliverables

## Fix 7: Use the TechDraw Templates Efficiently

1. Create a custom TechDraw template with pre-defined title block fields
2. Don't use complex SVG templates with many embedded images
3. Keep templates simple — line art only
4. Complex templates slow down page rendering and export

## Fix 8: Alternative — Export to DXF for External Drawing

If TechDraw is too slow for your needs:

1. In the Part workbench, use **Part → Export** to export the 3D model as DXF
2. This exports 2D projections as DXF format
3. Open the DXF in LibreCAD, QCAD, or AutoCAD for dimensioning
4. This completely bypasses TechDraw's rendering engine

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Set Keep Updated to false | Very high — prevents auto-recalculation | Easy |
| Reduce view complexity | High — less geometry per view | Easy |
| Use Coarse View | Medium — faster rendering | Easy |
| Separate TechDraw into own file | Very high — isolates rendering overhead | Medium |
| Use 3D dimensions | Medium — reduces 2D dimension queries | Easy |
| Export to SVG | Medium — faster than PDF | Easy |
| Export one page at a time | Medium — reduces memory per export | Easy |
| Export to DXF for external drawing | High — bypasses TechDraw entirely | Medium |

The most effective combination: set Keep Updated to false on all pages, separate TechDraw into its own file, and use simple orthographic views. This reduces TechDraw from a minutes-long freeze to a controlled, on-demand rendering process. For users who find TechDraw still too slow, exporting to DXF and dimensioning in a dedicated 2D CAD tool is a viable alternative.
