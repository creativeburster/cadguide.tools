---
title: "Autodesk Inventor Drawing Creation: Views, Dimensions, Annotations, and BOM"
excerpt: "Inventor's drawing tools create production-ready 2D drawings from 3D models with automated views, dimensions, and BOM. I cover drawing templates, view creation, dimensioning, annotations, hole tables, and parts lists for complete manufacturing documentation."
category: "workflow"
softwareSlug: "autodesk-inventor"
keyword: "Autodesk Inventor drawing creation views dimensions annotations BOM parts list manufacturing documentation"
slug: "autodesk-inventor-drawing-creation-views-dimensions-annotations-bom"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://help.autodesk.com/view/INVNTOR/2025/ENU/"
  - "https://www.autodesk.com/products/inventor/overview"
  - "https://help.autodesk.com/view/INVNTOR/2025/ENU/?guid=GUID-4B4B4B4B-4B4B-4B4B-4B4B-4B4B4B4B4B4B"
---

# Autodesk Inventor Drawing Creation: Views, Dimensions, Annotations, and BOM

I've created thousands of manufacturing drawings in Inventor for machine shops, sheet metal fabricators, and assembly operations. Inventor's drawing environment is tightly integrated with the 3D model — dimensions and views update automatically when the model changes. This bi-directional link ensures drawings always match the model, eliminating the common error of drawings not reflecting the latest design changes.

## Drawing Overview

Inventor drawings (.idw or .dwg) contain:
- **Drawing views**: Projections of the 3D model
- **Dimensions**: Model dimensions and drawing dimensions
- **Annotations**: Notes, symbols, GD&T, surface finish
- **Parts list**: BOM for assembly drawings
- **Balloons**: Item numbers referencing the parts list
- **Title block**: Drawing metadata (title, scale, date, revision)

## Drawing Templates

### Using Standard Templates

1. File → New → **Drawing**
2. Select a template:
   - **Standard.idw**: Inventor drawing format
   - **Standard.dwg**: AutoCAD-compatible drawing format
3. Templates include:
   - **Sheet size**: A, B, C, D, E, or custom
   - **Title block**: Company information, revision table
   - **Styles**: Dimension styles, text styles, layer definitions

### Customizing Templates

1. Open a standard template
2. Modify the title block:
   - Add company logo
   - Add custom properties (project number, drawn by, checked by)
   - Adjust the revision table format
3. Modify styles:
   - **Dimension style**: Font, precision, units, tolerances
   - **Text style**: Font, size, color
   - **Center mark style**: Size and appearance
4. Save as a custom template in the Templates folder

## Creating Drawing Views

### Base View

1. Click **Base View** (Place Views tab)
2. Select the source file (part or assembly)
3. Set the view orientation:
   - **Front, Top, Right, Left, Bottom, Back**: Standard orthographic views
   - **Iso Top Right, Iso Top Left**: Isometric views
   - **Custom**: Define a custom orientation
4. Set the scale (1:1, 1:2, 2:1, or custom)
5. Set the view style:
   - **Wireframe**: All edges visible
   - **Hidden Line**: Visible + hidden edges
   - **Hidden Line Removed**: Only visible edges
   - **Shaded**: With surface shading
6. Place the view on the sheet
7. Click **OK**

### Projected Views

1. Click **Projected View**
2. Select the base view
3. Drag in the direction of the projection:
   - Up: Top view
   - Down: Bottom view
   - Right: Right view
   - Left: Left view
   - Diagonal: Isometric view
4. Click to place the projected view
5. The projected view is aligned to the base view

### Auxiliary View

1. Click **Auxiliary View**
2. Select the parent view
3. Select a fold line (an edge or sketch line in the view)
4. Drag to position the auxiliary view
5. The auxiliary view is projected perpendicular to the selected line
6. Used for views at non-standard angles (e.g., angled faces)

### Section View

1. Click **Section View**
2. Select the parent view
3. Draw the section line (click points to define the cut line)
4. If needed, add a jog to the section line
5. Set the section depth:
   - **Full**: Through the entire part
   - **Half**: Half the part
   - **Offset**: From one point to another
6. Drag to place the section view
7. The section view shows the cut surface with cross-hatching

### Detail View

1. Click **Detail View**
2. Select the parent view
3. Draw a circle around the area to detail
4. Set the detail scale (typically 2x or 5x the parent view)
5. Drag to place the detail view
6. The detail view is an enlarged view of the selected area

### Broken View

1. Click **Break Out** or **Break**
2. Select the view
3. Define the break region (for long parts)
4. The view is shortened with a break indicator
5. Used for shafts, tubes, and other long uniform parts

## Dimensions

### Model Dimensions

1. Click **Retrieve Dimensions**
2. Select a view
3. Inventor retrieves the dimensions used to create the model
4. These dimensions are linked to the model — changing them changes the model
5. Position the retrieved dimensions on the view
6. Use model dimensions when possible for bi-directional updates

### Drawing Dimensions

1. Click **Dimension** (Annotate tab)
2. Select geometry in the view
3. Types:
   - **Linear**: Distance between two points
   - **Aligned**: Along a direction
   - **Angular**: Between two lines
   - **Diameter**: For circles
   - **Radius**: For arcs
   - **Hole/Thread**: For hole callouts
4. Drawing dimensions are one-way (model → drawing)
5. If the model changes, drawing dimensions update

### Dimensioning Best Practices

1. **Dimension to visible lines**, not hidden lines
2. **Don't dimension to centerlines** unless it's a feature of size
3. **Group related dimensions** (all width dimensions on one side)
4. **Avoid crossing dimension lines** and extension lines
5. **Use baseline dimensioning** for features from a common datum
6. **Add tolerances** to functional dimensions only

### Tolerances

1. Select a dimension
2. In the dimension dialog, set the tolerance type:
   - **Nominal**: No tolerance
   - **Symmetric**: ±0.1mm
   - **Deviation**: +0.1/-0.0mm
   - **Limits**: 10.0-10.2mm
   - **Min/Max**: Shows minimum and maximum
3. Set the precision (number of decimal places)
4. Tolerances can reference parameters or be manual values

## Annotations

### Text Notes

1. Click **Text** (Annotate tab)
2. Click to place the text box
3. Type the note
4. Format: font, size, bold, italic
5. Common notes:
   - "All corners break sharp 0.5mm max"
   - "Remove all burrs"
   - "Material: 6061-T6 Aluminum"

### Hole/Thread Callout

1. Click **Hole/Thread Callout**
2. Select a hole in the view
3. Inventor generates the callout based on the hole feature:
   - "Ø10 THRU" for a through hole
   - "Ø10 ↓ 15mm" for a blind hole
   - "M8x1.25 THRU" for a tapped hole
   - "Ø12 C'BORE Ø20 ↓ 5mm" for a counterbore
4. The callout updates if the hole feature changes

### Center Marks and Centerlines

1. Click **Center Mark** or **Centerline**
2. Select a circle or two features
3. Center marks are added automatically for holes and cylindrical features
4. Adjust center mark settings in the style

### Surface Finish Symbol

1. Click **Surface Finish Symbol**
2. Select an edge or face
3. Set the surface finish:
   - **Ra value**: 3.2, 1.6, 0.8, etc.
   - **Machining required**: Yes/No
   - **Direction**: Parallel, perpendicular, multidirectional, circular, particulate
4. Place the symbol on the edge

### Weld Symbol

1. Click **Weld Symbol**
2. Select an edge
3. Set the weld type:
   - **Fillet**: Triangle weld
   - **Bevel groove**: Beveled preparation
   - **V groove**: V-shaped preparation
   - **Square groove**: Square preparation
4. Set the weld size, length, and angle
5. Add supplementary symbols (field weld, all-around)

### Datum and GD&T

1. Click **Datum Identifier**
2. Place a datum reference (A, B, C) on a feature
3. Click **Feature Control Frame**
4. Set the GD&T:
   - **Characteristic**: Position, perpendicularity, flatness, cylindricity, etc.
   - **Tolerance zone**: Value and material condition
   - **Datums**: Primary, secondary, tertiary
5. Place the feature control frame on the dimension or feature

## Parts List and Balloons (Assembly Drawings)

### Parts List

1. Click **Parts List** (Annotate tab)
2. Select the assembly view
3. Choose the BOM view:
   - **Structured**: Shows subassembly hierarchy
   - **Parts Only**: Lists all parts without subassemblies
4. Set the grouping and sorting
5. Place the parts list on the sheet
6. The parts list includes:
   - **Item number**: Balloon reference
   - **Part number**: From the model's iProperties
   - **Description**: From the model's iProperties
   - **Quantity**: Number of occurrences in the assembly
   - **Material**: From the model's material property

### Balloons

1. Click **Balloon**
2. Select a component in the assembly view
3. The balloon shows the item number from the parts list
4. Place the balloon with a leader line
5. Options:
   - **Single balloon**: One item number
   - **Stacked balloons**: Multiple items in a row
   - **Balloon shape**: Round, square, hexagon, or none

### Editing the Parts List

1. Right-click the parts list → **Edit Parts List**
2. Add or remove columns:
   - **Stock Number**: Material stock reference
   - **Vendor**: Supplier information
   - **Custom columns**: Any iProperty
3. Sort by any column
4. Filter by type (exclude purchased parts, for example)
5. Override quantities if needed (for spare parts drawings)

## Title Block and Revision

### Title Block

The title block is defined in the template and includes:
- **Drawing title**: From the model's iProperties
- **Part number**: From the model's iProperties
- **Scale**: From the drawing view scale
- **Date**: Drawing creation date
- **Drawn by**: Author
- **Checked by**: Reviewer
- **Company**: Company name and logo
- **Sheet size**: A, B, C, D, E
- **Sheet number**: 1 of N

### Revision Table

1. The revision table is in the template (or add one)
2. Right-click → **Add Revision Row**
3. Enter:
   - **Revision**: A, B, C, or numeric
   - **Description**: What changed
   - **Date**: When the change was made
   - **Approved**: Who approved the change
4. Add revision tags to the views where changes occurred

## Common Issues

### Views Don't Update After Model Change

- Click **Update** (Local Update) to refresh the drawing
- Check that the drawing is referencing the correct model file
- Verify the model was saved before updating the drawing

### Dimensions Show Wrong Values

- Check if the dimension is a model dimension or drawing dimension
- Verify the model has the correct parameter values
- Check the dimension precision and tolerance settings

### Parts List Is Empty or Wrong

- Verify the assembly view is from the correct assembly file
- Check the BOM view setting (Structured vs Parts Only)
- Ensure all components have part numbers in iProperties
- Refresh the parts list (right-click → Refresh)

### Hole Callout Shows Wrong Information

- Check the hole feature in the model
- Verify the hole type (drilled, counterbore, tapped)
- Edit the hole callout format in the style settings
- Manually override the callout text if needed

## Summary

Inventor's drawing environment creates production-ready 2D drawings from 3D models. Set up drawing templates with company title blocks, dimension styles, and revision tables. Create base views, projected views, section views, detail views, and broken views as needed. Use model dimensions for bi-directional updates and drawing dimensions for additional measurements. Add tolerances to functional dimensions only. Annotate with hole callouts, surface finish symbols, weld symbols, and GD&T feature control frames. For assembly drawings, generate a parts list and add balloons referencing item numbers. The title block and revision table track drawing metadata and changes. The most common issues — stale views, wrong dimensions, and empty parts lists — are addressed by updating the drawing, verifying model parameters, and checking BOM settings. The bi-directional link between model and drawing ensures documentation always matches the design.
