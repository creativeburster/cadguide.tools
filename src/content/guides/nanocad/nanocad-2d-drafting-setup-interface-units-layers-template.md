---
title: "nanoCAD 2D Drafting Setup: Interface, Units, Layers, and Template Creation"
excerpt: "A beginner-to-intermediate guide for setting up nanoCAD as a 2D drafting environment, covering interface customization, unit configuration, layer standards, and reusable template creation for consistent drawing production."
category: "workflow"
softwareSlug: "nanocad"
keyword: "nanocad 2d drafting setup"
slug: "nanocad-2d-drafting-setup-interface-units-layers-template"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://nanocad.com/products/nanocad/"

---

# nanoCAD 2D Drafting Setup: Interface, Units, Layers, and Template Creation

nanoCAD is a free-to-use 2D CAD application that reads and writes DWG files with command-line compatibility similar to AutoCAD. For small firms, independent contractors, and educational users, nanoCAD provides a no-cost entry point into professional DWG-based drafting. This guide covers the complete setup from installation to a production-ready drafting template.

## Interface Overview and Customization

### Default Workspace Layout

When you first launch nanoCAD, the interface displays:

- **Command line** — bottom of the screen, accepts typed commands
- **Toolbars** — Standard, Draw, Modify, and Properties toolbars by default
- **Properties panel** — right side, shows selected entity properties
- **Model tab and Layout tabs** — bottom left, switch between model space and paper space
- **Status bar** — bottom, shows cursor coordinates and toggle switches (Snap, Grid, Ortho, etc.)

### Essential Interface Adjustments

1. **Enable the Properties panel**: View > Properties (or `Ctrl+1`)
2. **Enable the Tool Palettes**: View > Tool Palettes (or `Ctrl+3`)
3. **Set background color**: Tools > Options > Display > Colors > Model Space > set to black or white per preference
4. **Set crosshair size**: Tools > Options > Display > Crosshair Size > 100 (full screen) or 5 (compact)
5. **Show line weights**: Tools > Options > Display > Show Line Weights > enable for visual lineweight feedback

### Command Line Configuration

The command line is the primary interaction method in nanoCAD. To optimize it:

1. Right-click the command line > Options
2. Set `Command line font` to Consolas 11pt (clear, monospaced)
3. Set `Lines in command line` to 3 (shows recent command history)
4. Enable `AutoComplete` — suggests commands as you type
5. Set `Input search options` to search commands and system variables

## Drawing Units Configuration

Type `UNITS` to open the Drawing Units dialog:

### For Metric Drawings
- **Length type**: Decimal
- **Precision**: 0.00
- **Insertion scale**: Millimeters
- **Angle type**: Decimal Degrees
- **Angle precision**: 0.0
- **Direction**: East (0° = positive X)

### For Imperial Drawings
- **Length type**: Architectural
- **Precision**: 0'-0 1/16"
- **Insertion scale**: Inches
- **Angle type**: Surveyor's Units
- **Angle precision**: 0.0
- **Direction**: East (0° = positive X, North = 90°)

### Drawing Limits

Set the drawing limits to match your paper size at 1:1 scale:

```
LIMITS
0,0
420,297    ;; A3 landscape in mm
```

After setting limits, run `GRID` to show the grid within the limits. Use `ZOOM > All` to fit the limits to the screen.

## Layer Setup

### Standard Layer Naming

Use a consistent naming convention. For architectural drawings:

| Layer Name | Description | Color | Lineweight |
|------------|-------------|-------|------------|
| A-WALL-EXT | Exterior walls | 1 (Red) | 0.35mm |
| A-WALL-INT | Interior walls | 4 (Cyan) | 0.25mm |
| A-DOOR | Doors | 3 (Green) | 0.25mm |
| A-WIND | Windows | 3 (Green) | 0.25mm |
| A-FLOR | Floor outlines | 7 (White) | 0.15mm |
| A-FLOR-PATT | Floor hatch | 8 (Gray) | 0.10mm |
| A-ANNO-DIMS | Dimensions | 7 (White) | 0.15mm |
| A-ANNO-NOTE | Text and notes | 2 (Yellow) | 0.15mm |
| A-ANNO-TTLB | Title block | 7 (White) | 0.35mm |
| A-ANNO-VIEW | Viewport boundaries | 9 (Light gray) | 0.00mm (no plot) |

### Creating Layers

Use the Layer Manager (`LAYER` command):

1. Click "New Layer" for each layer
2. Set the color by clicking the color swatch
3. Set lineweight by clicking the lineweight column
4. Set linetype by clicking the linetype column (load additional linetypes with `LINETYPE` > Load)
5. Set plot/no-plot by clicking the printer icon

### Layer Filters

For drawings with many layers, create layer filters:

1. In the Layer Manager, right-click the filter tree > New Filter
2. Name the filter (e.g., "Annotations")
3. Add layers to the filter by dragging or by setting filter criteria (e.g., name starts with "A-ANNO-")

## Dimension Style Setup

### Creating a Dimension Style

1. Type `DIMSTYLE` and click "New"
2. Name: "ARCH-50" (for 1:50 plot scale)
3. Set the following parameters:

#### Lines Tab
- **Extend beyond dim line**: 2mm
- **Offset from origin**: 1mm
- **Baseline spacing**: 10mm

#### Arrows Tab
- **Arrow type**: Architectural tick
- **Arrow size**: 2.5mm

#### Text Tab
- **Text style**: "DIM" (create first with `STYLE` command)
- **Text height**: 2.5mm
- **Text placement**: Above line, centered
- **Text alignment**: Aligned with dimension line

#### Fit Tab
- **Scale for dimension features**: 50 (matches 1:50 plot scale)
- **Text placement**: Beside the dimension line when not enough space

#### Primary Units Tab
- **Unit format**: Decimal
- **Precision**: 0.0
- **Measurement scale factor**: 1.0

### Text Style for Dimensions

1. Type `STYLE` and click "New"
2. Name: "DIM"
3. Font: `simplex.shx` or `Arial Narrow`
4. Height: 0 (let the dimension style control height)
5. Width factor: 0.8 (slightly condensed for compact dimensions)
6. Oblique angle: 0

## Title Block Creation

### Drawing the Title Block

1. Switch to a Layout tab (click the Layout1 tab at the bottom)
2. Draw the title block border at A3 size (420 x 297mm) on the `A-ANNO-TTLB` layer
3. Add internal lines for the title block panels (title, drawing number, scale, date, drawn by, checked by)

### Adding Attributes

1. Type `ATTDEF` to create attribute definitions:
   - **Tag**: TITLE
   - **Prompt**: Enter drawing title
   - **Default**: (blank)
   - **Text height**: 5mm
   - **Justification**: Center
   - **Insertion point**: center of the title panel

2. Repeat for each attribute: DWG-NO, SCALE, DATE, DRAWN, CHECKED, PROJECT

3. Use `BLOCK` to create a block from the title block geometry and all attributes
4. Use `WBLOCK` to save the block to an external file for reuse

## Template Creation

### Saving the Template

1. With all settings configured (units, layers, dimension styles, text styles, title block):
2. Type `SAVEAS`
3. File type: `.dwt` (Drawing Template)
4. Name: `A3-Architectural-Metric.dwt`
5. Location: nanoCAD template folder (typically `C:\Program Files\Nanosoft\nanoCAD x.x\Templates\`)

### Using the Template

1. Type `NEW`
2. Select the template from the list
3. All layers, styles, and title block are pre-loaded

## Plot Configuration

### Page Setup

1. In the Layout tab, type `PAGESETUP`
2. Select printer/plotter
3. Paper size: A3 (420 x 297mm)
4. Plot area: Layout
5. Plot scale: 1:1 (viewport handles model space scaling)
6. Plot style: select your CTB file

### Viewport Setup

1. Type `MVIEW` and draw a rectangle within the title block
2. Double-click inside the viewport to enter model space
3. Set the viewport scale from the scale dropdown (e.g., 1:50)
4. Pan to position the drawing
5. Double-click outside to return to paper space
6. Select the viewport, right-click > Properties > Display Locked > Yes

## Conclusion

Setting up nanoCAD for 2D drafting follows the same logical workflow as AutoCAD: configure the interface, set units, create layers, define dimension and text styles, build a title block, and save everything as a reusable template. The template is the key to consistent output — once it is configured correctly, every new drawing starts with the right settings. By following this guide, you can transform a default nanoCAD installation into a professional drafting environment at zero software cost.
