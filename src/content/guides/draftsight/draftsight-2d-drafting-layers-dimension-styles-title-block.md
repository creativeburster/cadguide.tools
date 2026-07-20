---
title: "DraftSight 2D Drafting: Layers, Dimension Styles, and Title Block Setup"
excerpt: "A foundational workflow guide for setting up 2D drafting standards in DraftSight, covering layer creation, dimension style configuration, title block insertion, and sheet layout best practices."
category: "workflow"
softwareSlug: "draftsight"
keyword: "draftsight 2d drafting"
slug: "draftsight-2d-drafting-layers-dimension-styles-title-block"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.3ds.com/products-services/draftsight/resources/"
  - "https://help.3ds.com/draftsight/user-guide"
---

# DraftSight 2D Drafting: Layers, Dimension Styles, and Title Block Setup

DraftSight is Dassault Systèmes' 2D drafting application that reads and writes DWG files with AutoCAD-compatible command syntax. For teams transitioning from AutoCAD to DraftSight, the command line interface is familiar, but the settings dialogs and tool palette locations differ enough to cause setup friction. This guide covers the complete 2D drafting environment setup from a blank installation to a production-ready template.

## Initial Configuration

### Setting Drawing Units

Type `UNITS` to open the Drawing Units dialog:

- **Length type**: Decimal (for metric) or Architectural (for imperial)
- **Precision**: 0.00 for general drafting, 0.0000 for precision engineering
- **Angle type**: Decimal Degrees
- **Angle precision**: 0.0
- **Direction**: East (0 degrees = positive X axis) — standard convention
- **Insertion scale**: Millimeters or Inches depending on your standard

### Setting Drawing Limits

Type `LIMITS` and specify the lower-left and upper-right corners:

```
LIMITS
0,0
420,297    (A3 landscape in mm)
```

After setting limits, run `GRID` to enable the visible grid within the limits area. Note that DraftSight does not enforce limits — you can draw outside them — but they define the zoom extents for the `ZOOM > All` command.

## Layer Management

### Standard Layer Naming Convention

Follow a consistent naming convention. The National CAD Standard (NCS) layer format is widely used:

| Layer Name | Description | Color | Linetype |
|------------|-------------|-------|----------|
| A-WALL-EXT | Exterior walls | Red | Continuous |
| A-WALL-INT | Interior walls | Cyan | Continuous |
| A-DOOR | Doors | Green | Continuous |
| A-WIND | Windows | Green | Continuous |
| A-FLOR-PATT | Floor hatch | 8 (gray) | Continuous |
| A-ANNO-DIMS | Dimensions | White | Continuous |
| A-ANNO-NOTE | Notes and text | Yellow | Continuous |
| A-ANNO-TTLB | Title block | White | Continuous |

### Creating Layers via Command Line

```lisp
;; Batch layer creation script
-LAYER
N A-WALL-EXT,A-WALL-INT,A-DOOR,A-WIND
C 1 A-WALL-EXT
C 4 A-WALL-INT
C 3 A-DOOR,A-WIND
N A-ANNO-DIMS,A-ANNO-NOTE,A-ANNO-TTLB
C 2 A-ANNO-NOTE
L HIDDEN A-ANNO-DIMS
```

### Layer States

Save layer configurations using `LAYERSTATE` command. This lets you switch between different display configurations (e.g., "Floor Plan" vs "Reflected Ceiling Plan") without recreating layer settings each time.

## Dimension Style Configuration

Dimension styles in DraftSight follow the same structure as AutoCAD's `DIMSTYLE` command but the dialog layout differs.

### Creating a Standard Dimension Style

1. Type `DIMSTYLE` and click "New"
2. Name the style (e.g., "ARCH-25" for architectural at 1:25 scale)
3. Configure the following tabs:

#### Lines Tab
- **Baseline spacing**: 10mm (distance between stacked dimensions)
- **Extend beyond dim lines**: 2mm
- **Offset from origin**: 1mm (gap between dimension origin and extension line start)

#### Symbols and Arrows Tab
- **Arrow size**: 2.5mm
- **Arrow type**: Architectural tick (for architectural drawings) or Closed filled (for engineering)
- **Center marks**: None (for most applications)

#### Text Tab
- **Text style**: Select a pre-created style (see below)
- **Text height**: 2.5mm
- **Text placement**: Above the dimension line, centered
- **Offset from dim line**: 1mm
- **Text alignment**: Aligned with dimension line

#### Fit Tab
- **Scale for dimension features**: 25 (for 1:25 plot scale — set to the plot scale factor)
- **Text placement**: Beside the dimension line when space is insufficient

#### Primary Units Tab
- **Unit format**: Decimal
- **Precision**: 0.0 (one decimal place for metric architectural)
- **Decimal separator**: Period (.)
- **Round distances to**: 0.5 (round to nearest half unit if needed)
- **Measurement scale factor**: 1.0 (only change if drawing at non-1:1 scale)

### Text Style for Dimensions

Create a dedicated text style before setting up dimension styles:

1. Type `STYLE` and click "New"
2. Name: "DIM-TEXT"
3. Font: `romans.shx` or `Arial` (TrueType for clearer small text)
4. Height: 0 (set to 0 so the dimension style controls height)
5. Width factor: 1.0
6. Oblique angle: 0

## Title Block Setup

### Creating a Title Block Block

1. Draw the title block geometry on the `A-ANNO-TTLB` layer at 1:1 scale
2. Add attribute definitions using `ATTDEF`:
   - `TITLE` — drawing title (text height 5mm, justified center)
   - `DWG-NO` — drawing number (text height 3mm, justified center)
   - `SCALE` — plot scale (text height 3mm)
   - `DATE` — date (text height 3mm)
   - `DRAWN` — drafter name (text height 3mm)
   - `CHECKED` — checker name (text height 3mm)
3. Use `BLOCK` to create a block from the geometry and attributes
4. Save the block to an external file using `WBLOCK` for reuse across drawings

### Inserting the Title Block

1. Switch to a Layout tab (paper space)
2. Type `INSERT` and select the title block file
3. Set insertion point to 0,0 and scale to 1
4. After insertion, use `EATTEDIT` (Enhanced Attribute Edit) to fill in attribute values

### Viewport Setup in Layout

1. In paper space, type `MVIEW` and draw a rectangle for the viewport
2. Double-click inside the viewport to enter model space
3. Set the viewport scale using the viewport scale dropdown (e.g., 1:25)
4. Pan to center the drawing within the viewport
5. Double-click outside the viewport to return to paper space
6. Lock the viewport scale: select the viewport, right-click, "Display Locked" > Yes

## Template File Creation

Once all settings are configured, save as a template:

1. Type `SAVEAS`
2. File type: `.dwt` (Drawing Template)
3. Name: `A3-Architectural.dwt`
4. Location: DraftSight template folder (typically `C:\ProgramData\Dassault Systemes\DraftSight\Templates\`)

To start a new drawing from this template, use `NEW` and select the template file. All layers, dimension styles, text styles, and title block will be pre-configured.

## Plot Configuration

### Page Setup

1. In the Layout tab, type `PAGESETUP`
2. Select the printer/plotter
3. Set paper size to match the title block size (e.g., A3)
4. Set plot area to "Layout" (plots everything in paper space)
5. Set plot scale to 1:1 (the viewport handles the model space scaling)
6. Set plot style table (CTB or STB) if using color-based or named plot styles

### Print Preview Check

Before final plotting, always run `PREVIEW` and verify:
- Title block fits within the printable area
- Dimension text is legible at the final scale
- Lineweights display correctly (check `LWDISPLAY` setting)
- Viewport boundary is on a `no-plot` layer

## Conclusion

Setting up a 2D drafting environment in DraftSight follows the same logical sequence as AutoCAD: units, layers, dimension styles, text styles, title block, and template. The key is to build a comprehensive `.dwt` template that encodes all your standards so that every new drawing starts with the correct configuration. By following the layer naming conventions, dimension style settings, and title block workflow in this guide, you can establish a consistent drafting standard that produces clean, professional drawings every time.
