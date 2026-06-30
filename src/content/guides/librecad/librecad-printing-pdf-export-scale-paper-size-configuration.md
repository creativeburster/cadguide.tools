---
title: "LibreCAD Printing and PDF Export: Scale, Paper Size, and Output Configuration"
excerpt: "A guide to configuring print output in LibreCAD, covering print scale calculation, paper size selection, print area settings, and PDF export for sharing technical drawings with clients and contractors."
category: "printing"
softwareSlug: "librecad"
keyword: "librecad printing pdf export"
slug: "librecad-printing-pdf-export-scale-paper-size-configuration"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-06-30"
sources:
  - "https://librecad.org/docs/"
  - "https://librecad.org/wiki/printing"
---

# LibreCAD Printing and PDF Export: Scale, Paper Size, and Output Configuration

LibreCAD is a model-space-only application — it does not have paper space layouts or viewports like AutoCAD. This means printing requires careful scale configuration directly in the print dialog. This guide covers the complete printing and PDF export workflow.

## Print Scale Calculation

### Understanding Scale

In model space, you draw at 1:1 (actual size). When printing, you reduce the drawing to fit paper. The print scale determines this ratio:

| Scale | 1mm on paper = | Use case |
|-------|---------------|----------|
| 1:1 | 1mm in drawing | Full size, detail drawings |
| 1:5 | 5mm in drawing | Large details |
| 1:10 | 10mm in drawing | Small details |
| 1:20 | 20mm in drawing | Room layouts |
| 1:50 | 50mm in drawing | Floor plans |
| 1:100 | 100mm in drawing | Site plans |
| 1:200 | 200mm in drawing | Large site plans |

### Text and Dimension Sizing

Since there are no viewports, text and dimensions must be drawn at the size that will appear correct when printed at scale:

- For 1:50 scale, 2.5mm text on paper = 2.5 × 50 = **125mm** in the drawing
- For 1:100 scale, 2.5mm text on paper = 2.5 × 100 = **250mm** in the drawing

Set text height and dimension arrow sizes accordingly in Options > Current Drawing Preferences.

## Printing Configuration

### Step-by-Step Print Setup

1. File > Print Preview (to see how the drawing will fit on paper)
2. File > Print
3. Select printer from the list
4. Set paper size:
   - A4 (210 x 297mm) — small drawings
   - A3 (420 x 297mm) — standard architectural
   - A2 (594 x 420mm) — large architectural
   - A1 (841 x 594mm) — presentation drawings
5. Set orientation: Portrait or Landscape
6. Set print scale (e.g., 1:50)
7. Set print area:
   - **Window**: Click two corners to define the print area
   - **Drawing**: Prints all visible entities
   - **Extents**: Prints the bounding box of all entities
8. Position the drawing on the page using the offset controls
9. Click Print

### Print Preview

Always use Print Preview before printing:

1. File > Print Preview
2. The drawing displays with a paper boundary overlay
3. Adjust scale and position in the preview
4. Verify:
   - All geometry fits within the paper boundary
   - Text is legible at the chosen scale
   - Dimensions are not overlapping
   - Title block is within the printable area
5. Click Print when satisfied

## PDF Export

### Exporting to PDF

1. File > Export > PDF
2. Set paper size and orientation
3. Set scale (same as printing)
4. Set print area (window, drawing, or extents)
5. Choose file location and name
6. Click Export

### PDF Quality Settings

LibreCAD exports vector PDF by default, which is ideal for technical drawings:
- Vector PDF: scalable, crisp at any zoom level, small file size
- Text is searchable in the PDF
- Lineweights are preserved

### Multi-Page PDF

LibreCAD does not support multi-page PDF export natively. For multi-sheet drawing sets:
1. Export each drawing as a separate PDF
2. Use a PDF merge tool (PDFsam, pdftk, Adobe Acrobat) to combine them

## Common Printing Issues

### Issue: Drawing Is Too Small or Too Large on Paper

**Cause**: Wrong print scale.
**Fix**: Calculate the correct scale. Measure the drawing extents (View > Info > Drawing Extents), then divide by the paper printable area. For example, if the drawing is 42000 x 29700mm and paper is A3 (420 x 297mm printable area ~ 400 x 277mm), the scale is 42000/400 = 105, so use 1:100.

### Issue: Text Is Illegible at Print Scale

**Cause**: Text height too small for the chosen scale.
**Fix**: Calculate required text height: `desired_printed_height × scale_factor`. For 2.5mm text at 1:50: `2.5 × 50 = 125mm`. Update text height in the drawing.

### Issue: Lineweights Not Showing in Print

**Cause**: Lineweights not enabled in print settings.
**Fix**: In the Print dialog, check "Print with lineweights". Also verify that layers have non-zero lineweights assigned.

### Issue: Drawing Is Offset on Paper

**Cause**: The print origin is not centered.
**Fix**: In Print Preview, use the centering controls to position the drawing. Or set the offset to center the drawing extents on the page.

### Issue: PDF Opens But Is Blank

**Cause**: Print area is set to "Window" but no window was defined.
**Fix**: Set print area to "Drawing" or "Extents", or redefine the window by clicking two corners in the preview.

## Print Standards Checklist

Before printing, verify:

- [ ] Print scale is correct (e.g., 1:50)
- [ ] Paper size matches title block size
- [ ] Orientation matches title block orientation
- [ ] All layers that should print are set to "Print"
- [ ] No-plot layers (viewport refs, construction) are set to "No Print"
- [ ] Text height is appropriate for the print scale
- [ ] Dimension text is legible
- [ ] Lineweights are enabled
- [ ] Title block is within the printable area
- [ ] Drawing is centered on the page

## Conclusion

Printing in LibreCAD requires manual scale configuration since the application lacks paper space layouts. The key is calculating the correct text and dimension sizes for your intended print scale before you start drawing. Always use Print Preview to verify the output before committing to paper or PDF. By following the scale calculation formulas and print checklist in this guide, you can produce professional-quality prints from LibreCAD at any standard scale.
