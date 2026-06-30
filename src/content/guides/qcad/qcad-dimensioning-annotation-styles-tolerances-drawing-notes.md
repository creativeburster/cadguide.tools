---
title: "QCAD Dimensioning and Annotation: Styles, Tolerances, and Drawing Notes"
excerpt: "A guide to configuring dimension styles in QCAD, covering linear, angular, radial, and diameter dimensions, tolerance display, text annotations, and dimension style templates for consistent technical drawings."
category: "standards"
softwareSlug: "qcad"
keyword: "qcad dimensioning annotation"
slug: "qcad-dimensioning-annotation-styles-tolerances-drawing-notes"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-06-30"
sources:
  - "https://qcad.org/en/qcad-documentation/dimensions"
  - "https://qcad.org/en/qcad-user-manual"
---

# QCAD Dimensioning and Annotation: Styles, Tolerances, and Drawing Notes

Accurate dimensioning is what separates a sketch from a technical drawing. QCAD provides a full set of dimensioning tools and configurable dimension styles. This guide covers everything from basic linear dimensions to tolerance display and annotation best practices.

## Dimension Types

### Linear Dimensions

- **Horizontal**: Measures horizontal distance between two points
- **Vertical**: Measures vertical distance
- **Aligned**: Measures actual distance along the line direction
- **Rotated**: Measures at a specified angle

### Angular Dimensions

Measures the angle between two lines or three points.

### Radial Dimensions

- **Radius**: Measures circle/arc radius with R prefix
- **Diameter**: Measures circle/arc diameter with Ø prefix

### Other Types

- **Leader**: Points to a feature with text annotation
- **Ordinate**: Measures X or Y coordinate from a datum

## Creating Dimensions

### Linear Dimension

1. Select Dimension > Linear from the menu or tool matrix
2. Click the first extension line origin
3. Click the second extension line origin
4. Click to position the dimension line

### Aligned Dimension

1. Select Dimension > Aligned
2. Click first point
3. Click second point
4. Click to position the dimension

### Angular Dimension

1. Select Dimension > Angular
2. Click the first line
3. Click the second line
4. Click to position the angle text

### Radius/Diameter

1. Select Dimension > Radius or Diameter
2. Click the circle or arc
3. Click to position the dimension text

### Leader

1. Select Dimension > Leader
2. Click the start point (arrow end)
3. Click intermediate points for the leader path
4. Press Enter, then enter the text

## Dimension Style Configuration

### Creating a Dimension Style

1. Dimension > Dimension Settings
2. Configure the following:

#### General
- **Text height**: 2.5mm (standard for most drawings)
- **Text font**: Select from available fonts
- **Arrow size**: 2.5mm
- **Arrow type**: Architectural tick, closed arrow, or open arrow
- **Extension line offset**: 1mm (gap from origin)
- **Extension line extension**: 2mm (beyond dimension line)
- **Dimension line gap**: 0.625mm (text offset from line)

#### Precision
- **Linear precision**: 0.0 (one decimal place) or 0.00 (two places)
- **Angular precision**: 0.0°
- **Tolerance precision**: 0.00

#### Units
- **Linear unit format**: Decimal
- **Angular unit format**: Decimal Degrees
- **Measurement scale**: 1.0

#### Tolerances
- **Mode**: None, Symmetric (±), Deviation (upper/lower)
- **Upper value**: e.g., 0.1
- **Lower value**: e.g., 0.1
- **Tolerance text height**: 1.8mm (smaller than main text)

### Saving Dimension Styles

QCAD stores dimension settings per drawing. To reuse settings:

1. Configure dimensions in a template drawing
2. Save as a `.dxf` template file
3. Start new drawings from this template

## Tolerance Display

### Symmetric Tolerance (±)

For dimensions with equal upper and lower tolerances (e.g., 50±0.1):

1. Dimension Settings > Tolerances > Mode: Symmetric
2. Set value: 0.1
3. Result: `50 ±0.1`

### Deviation Tolerance

For asymmetric tolerances (e.g., 50 +0.2/-0.1):

1. Dimension Settings > Tolerances > Mode: Deviation
2. Upper value: 0.2
3. Lower value: 0.1
4. Result: `50 +0.2 / -0.1`

### Limits Tolerance

For showing actual limits instead of nominal ± tolerance:

1. Dimension Settings > Tolerances > Mode: Limits
2. Upper value: 50.2
3. Lower value: 49.9
4. Result: `50.2 / 49.9`

## Text Annotations

### Single-Line Text

1. Draw > Text > Text (Single Line)
2. Click insertion point
3. Enter text
4. Set height and angle

### Multi-Line Text

1. Draw > Text > Text (Multi Line)
2. Click first corner, then opposite corner to define text box
3. Enter text in the editor
4. Set font, height, alignment

### Text Styles

QCAD supports multiple text styles:
1. Edit > Application Preferences > Text
2. Configure default font, height, and width factor
3. For per-entity text properties, use the Property editor

## Annotation Best Practices

1. **Dimension on dedicated layers** — create `A-ANNO-DIMS` and `A-ANNO-NOTE` layers
2. **Use consistent text heights** — 2.5mm for dimensions, 3.5mm for notes, 5mm for titles
3. **Avoid overlapping dimensions** — use `MOVE` to adjust dimension positions
4. **Use leaders sparingly** — too many leaders clutter the drawing
5. **Dimension to object snaps** — always snap to endpoints or centers for accuracy
6. **Check dimension accuracy** — use `INFO > Distance` to verify critical dimensions

## Printing Dimensions at Correct Scale

Since QCAD lacks paper space viewports, dimension text must be sized for the final print scale:

- For 1:50 scale: text height in drawing = 2.5mm × 50 = 125mm
- For 1:100 scale: text height = 2.5mm × 100 = 250mm

Set the text height in Dimension Settings to match your print scale.

## Conclusion

QCAD's dimensioning tools cover all standard dimension types with configurable styles, tolerance display, and text annotations. The key to professional output is consistency — use a template with pre-configured dimension settings and always dimension to object snaps for accuracy. Since QCAD lacks paper space, remember to scale text and arrow sizes for the intended print scale.
