---
title: "nanoCAD Plotting and Print Standards: CTB Files, Page Setups, and Batch Output"
excerpt: "A comprehensive guide to configuring plot standards in nanoCAD, covering CTB color-dependent plot tables, page setup management, viewport scaling, and batch printing across multiple layouts and drawings."
category: "printing"
softwareSlug: "nanocad"
keyword: "nanocad plotting print standards"
slug: "nanocad-plotting-print-standards-ctb-page-setups-batch-output"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://nanocad.com/products/nanocad/"
  - "https://nanocad.com/learning/online-help/nanocad-platform/ncad.lsp/"

---

# nanoCAD Plotting and Print Standards: CTB Files, Page Setups, and Batch Output

Plotting is the final and most critical step in CAD production — a perfectly drawn model means nothing if the printed output has wrong lineweights, missing layers, or incorrect scale. nanoCAD's plotting system is compatible with AutoCAD's CTB and STB plot style tables, making it straightforward to maintain consistent output standards. This guide covers the complete plotting workflow from CTB configuration to batch output.

## Plot Style Tables: CTB vs STB

### Color-Dependent Plot Table (CTB)

CTB maps entity colors to lineweights and other plot properties. This is the most common approach in 2D drafting because it is simple — the color you see on screen determines the plotted lineweight.

### Named Plot Style Table (STB)

STB assigns plot styles by name, independent of entity color. This allows more flexibility (e.g., two entities with the same color can have different lineweights) but requires more setup discipline.

This guide focuses on CTB, as it is the standard for most 2D drafting workflows.

## Creating a CTB Plot Style Table

### Step 1: Open the Plot Style Manager

1. Type `STYLESMANAGER` or go to File > Plot Style Manager
2. This opens the Windows folder containing plot style tables
3. Double-click "Add a Plot Style Table Wizard"

### Step 2: Create New CTB

1. Select "Start from scratch"
2. Choose "Color-Dependent Plot Style Table"
3. Name the file (e.g., `Architectural-Standard.ctb`)
4. Click Finish

### Step 3: Configure Color Mappings

Open the new `.ctb` file by double-clicking it. The Plot Style Table Editor shows 255 color tabs. Configure the colors you use:

| Color | Lineweight | Description |
|-------|-----------|-------------|
| 1 (Red) | 0.35mm | Exterior walls, prominent lines |
| 2 (Yellow) | 0.15mm | Notes, annotations |
| 3 (Green) | 0.25mm | Doors, windows |
| 4 (Cyan) | 0.25mm | Interior walls |
| 5 (Blue) | 0.20mm | Hidden lines, secondary geometry |
| 6 (Magenta) | 0.15mm | Center lines, layout marks |
| 7 (White/Black) | 0.15mm | Default geometry |
| 8 (Gray) | 0.10mm | Hatch patterns, secondary info |
| 9 (Light gray) | 0.00mm | No-plot layers (viewport boundaries) |

### Step 4: Set Additional Properties

For each color, also configure:

- **Screening**: 100% for normal plotting; reduce to 50% for background/reference information
- **Linetype**: Use object linetype (default) or override with a specific linetype
- **Line endpoints**: Square (standard) or round
- **Fill style**: Use object (normal) or solid fill

### Step 5: Save and Distribute

Save the `.ctb` file to a network share accessible to all users. Add the folder path to nanoCAD's Plot Style Path:

1. Tools > Options > File Locations > Plot Style Table Search Path
2. Add the network share path
3. All users will see the CTB file in the plot dialog

## Page Setup Configuration

### Creating a Page Setup

1. Switch to a Layout tab
2. Type `PAGESETUP` and click "New"
3. Name the setup (e.g., "A3-Plot")
4. Configure:

#### Printer/Plotter
- Select your physical plotter or PDF driver
- For PDF output, use "nanoCAD PDF.pc3" or a third-party PDF driver

#### Paper Size
- Match the title block size (e.g., A3 = 420 x 297mm, A1 = 841 x 594mm)
- Verify the printable area matches the title block margins

#### Plot Area
- **Layout**: Plots everything in paper space (recommended for layouts with title blocks)
- **Extents**: Plots all geometry in model space (use for model space plotting)
- **Window**: Plots a user-defined rectangular area

#### Plot Scale
- For layouts: 1:1 (the viewport handles model space scaling)
- For model space: set to the drawing scale (e.g., 1:50 means 1mm on paper = 50mm in model)

#### Plot Style Table
- Select your CTB file (e.g., `Architectural-Standard.ctb`)
- Check "Display plot styles" to preview lineweights on screen

#### Orientation
- Landscape or Portrait to match the title block

### Applying Page Setups

- Each layout can have a different page setup
- Right-click a Layout tab > Page Setup Manager > select and apply
- To copy a page setup between drawings, use `PUBLISH` with saved settings

## Viewport Scaling

### Creating a Viewport

1. In a Layout tab, type `MVIEW`
2. Draw a rectangle within the title block area
3. The viewport is created showing model space geometry

### Setting Viewport Scale

1. Double-click inside the viewport to enter model space
2. From the viewport scale dropdown (bottom right of status bar), select the scale:
   - 1:1, 1:5, 1:10, 1:20, 1:25, 1:50, 1:100, etc.
3. Pan to position the drawing within the viewport
4. Double-click outside the viewport to return to paper space

### Locking Viewport Scale

1. Select the viewport border
2. Right-click > Display Locked > Yes
3. This prevents accidental scale changes when panning/zooming in the viewport

### Multiple Viewports at Different Scales

For detail drawings with a main view and a detail callout:

1. Create two viewports side by side
2. Set the main viewport to 1:50
3. Set the detail viewport to 1:10
4. Draw a leader line from the detail area to the detail viewport (in paper space)

## Batch Printing with PUBLISH

### Setting Up Batch Print

1. Type `PUBLISH` to open the Publish dialog
2. Add sheets:
   - Click "Add Sheet" > select DWG files from disk
   - Or expand the current drawing to add specific layouts
3. For each sheet, configure:
   - Page setup (select from saved setups)
   - Printer/plotter
   - Paper size
4. Arrange sheet order using up/down arrows

### Saving Publish Set

1. Click "Save Sheet List"
2. Name as `.dsd` file (e.g., `Project-Plot-Set.dsd`)
3. Reload later with "Load Sheet List"

### Batch to PDF

1. In the Publish dialog, set "Publish To" = PDF
2. Set output folder
3. Choose:
   - **Single-sheet PDF**: One PDF per layout (recommended for individual sheets)
   - **Multi-sheet PDF**: All layouts in one PDF (recommended for complete sets)
4. Click "Publish" and wait for processing to complete

## Common Plotting Issues

### Issue: Lineweights Not Showing in Plot

**Cause**: CTB not selected, or lineweights set to 0.00mm in the CTB.

**Fix**:
1. Verify CTB is selected in the Page Setup
2. Open the CTB file and verify each color has a non-zero lineweight
3. Check that entity colors match the CTB mapping (e.g., red entities should be color 1, not a custom RGB red)

### Issue: Viewport Boundary Prints

**Cause**: The viewport border is on a layer that is set to plot.

**Fix**:
1. Create a dedicated layer (e.g., `A-ANNO-VIEW`) for viewport borders
2. Set the layer to no-plot (open Layer Manager, click the printer icon to disable)
3. Move all viewport borders to this layer

### Issue: Text Too Small or Too Large in Plot

**Cause**: Text height does not match the viewport scale.

**Fix**:
1. Calculate required text height: `printed_height × viewport_scale`
2. For 2.5mm text at 1:50 scale: `2.5 × 50 = 125mm` in model space
3. Select all text and update height in the Properties panel

### Issue: PDF Output Is Low Resolution

**Cause**: PDF driver resolution is set too low.

**Fix**:
1. In the Page Setup, click "Properties" next to the PDF plotter
2. Set resolution to 1200 DPI for engineering drawings, 600 DPI for architectural
3. For raster content (images), set raster quality to "High"

## Conclusion

Consistent plotting output requires three things: a well-configured CTB plot style table, standardized page setups, and properly scaled viewports. By creating a CTB that maps colors to lineweights, saving page setups for each paper size, and using the PUBLISH command for batch output, you can ensure that every drawing your team produces has the same professional appearance. The key is to configure these standards once in a template file and distribute it to all users — never rely on individual users to configure plot settings correctly on every drawing.
