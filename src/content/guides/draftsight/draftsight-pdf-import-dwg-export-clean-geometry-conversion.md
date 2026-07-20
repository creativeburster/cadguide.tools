---
title: "DraftSight PDF Import and DWG Export: Clean Geometry Conversion Workflow"
excerpt: "A practical guide to importing PDF drawings into DraftSight as editable DWG geometry, handling raster-to-vector conversion issues, and exporting clean DWG files for collaboration with AutoCAD users."
category: "workflow"
softwareSlug: "draftsight"
keyword: "draftsight pdf import dwg export"
slug: "draftsight-pdf-import-dwg-export-clean-geometry-conversion"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-06-30"
sources:
  - "https://help.3ds.com/draftsight/user-guide"
  - "https://www.3ds.com/products-services/draftsight/resources/"
---

# DraftSight PDF Import and DWG Export: Clean Geometry Conversion Workflow

PDF is the most common format for sharing CAD drawings outside the engineering team — clients, contractors, and architects all receive PDFs. But when you need to edit a drawing that only exists as a PDF, you need to convert it back to editable DWG geometry. DraftSight includes a PDF import tool that converts PDF vector data into DWG entities. This guide covers the complete workflow from PDF import to clean, editable DWG output.

## Understanding PDF Content Types

A PDF file can contain three types of drawing data:

1. **Vector geometry** — lines, arcs, text, and fills stored as mathematical paths. These convert cleanly to DWG entities.
2. **Raster images** — scanned drawings or screenshots embedded as pixel data. These do not convert to vectors; they import as image references.
3. **Embedded fonts** — text stored as Unicode characters with font references. These convert to TEXT or MTEXT entities if the font is available on the system.

Before importing, check the PDF source. If the PDF was generated from a CAD application (via PDF plot or export), it contains vector data and will convert well. If the PDF is a scanned drawing, it contains only raster data and needs OCR/trace conversion, which DraftSight does not do natively.

## Importing PDF into DraftSight

### Command: PDFIMPORT

1. Type `PDFIMPORT` or use `Insert > PDF Import`
2. Select the PDF file
3. Choose the page to import (if multi-page PDF)
4. Set import options:

#### Import Options

- **Vector geometry**: Check to import lines, arcs, and polylines
- **Solid fills**: Check to import filled regions as solid hatch entities
- **TrueType text**: Check to import text as MTEXT entities
- **Raster images**: Check to import embedded images as image references
- **Layers**: Choose how to handle PDF layers:
  - `Create layers from PDF layers` — preserves the PDF's layer structure
  - `Use current drawing layer` — all imported entities go on the current layer
  - `Create separate layer for each PDF page` — useful for multi-page imports

#### Scale and Rotation

- **Insertion point**: Specify 0,0 for the origin, or click on screen
- **Scale**: Set to 1:1 if the PDF was plotted at 1:1 scale; otherwise, calculate the scale factor
- **Rotation**: 0 for standard orientation

### Post-Import Cleanup

After import, the geometry will need cleanup. Common issues:

#### Line Segment Fragmentation

PDF vector paths often import as many short line segments rather than continuous polylines. To fix:

1. Select all imported lines on a layer
2. Use `PEDIT` > `Multiple` > `Join` to connect segments
3. Set a join tolerance of 0.01mm to connect segments with small gaps
4. Repeat for each layer

#### Text Height Mismatches

PDF text may import at incorrect heights due to font substitution. To fix:

1. Select all imported text entities
2. Open the Properties panel
3. Check the actual text height against the expected height
4. Calculate the ratio and use `SCALE` with a reference to correct all text at once

#### Layer Color Mapping

PDF colors do not always map to standard CAD colors. After import:

1. Open the Layer Manager
2. Assign standard colors to each layer (1=red, 2=yellow, 3=green, 4=cyan, 5=blue, 6=magenta, 7=white/black)
3. Set layer-specific linetypes (Continuous, Hidden, Center, etc.)

## Handling Scanned PDFs (Raster Only)

If the PDF is a scanned drawing with no vector data, DraftSight cannot convert it to DWG geometry natively. Options:

### Option 1: Manual Tracing

1. Import the PDF as a raster image reference using `IMAGEATTACH`
2. Set the image layer to a light gray color for easy tracing
3. Lock the image layer to prevent accidental movement
4. Trace over the geometry on new layers using standard drafting commands
5. Delete or freeze the image layer when tracing is complete

### Option 2: External Raster-to-Vector Conversion

Use a dedicated raster-to-vector tool (such as AutoTrace, WinTopo, or Scan2CAD) to convert the scanned PDF to DXF, then import the DXF into DraftSight using `DXFIN`.

## Exporting Clean DWG Files

When sharing DraftSight drawings with AutoCAD users, follow these steps to ensure clean, compatible DWG output:

### Step 1: Purge Unused Objects

Run `PURGE` and remove:
- Unused blocks
- Unused layers
- Unused linetypes
- Unused text styles
- Unused dimension styles

### Step 2: Audit

Run `AUDIT` with `Y` (fix errors) to repair any drawing database issues.

### Step 3: Set DWG Save Format

Type `DWGFORMAT` and set to `2018` (maximum compatibility with current AutoCAD versions).

### Step 4: Remove DraftSight-Specific Data

DraftSight adds custom data to DWG files that AutoCAD does not recognize. While this data does not cause errors, it increases file size. To minimize:

1. Avoid using DraftSight-specific features (e.g., DraftSight-specific constraint types)
2. Use `WBLOCK` to write the drawing to a new file — this strips some custom data
3. In AutoCAD, run `PURGE` again to remove any remaining unrecognized data

### Step 5: Verify in AutoCAD

If possible, open the exported DWG in AutoCAD and verify:
- All geometry displays correctly
- Text styles and fonts render properly
- Dimension styles are intact
- Layouts and viewports are preserved
- No "Missing References" warnings appear

## Batch PDF Import

For importing multiple PDF files:

1. Create a LISP script that loops through PDF files in a folder:

```lisp
(defun c:BatchPDFImport ( / pdfdir pdffiles filename)
  (setq pdfdir (getstring "\nPDF folder path: "))
  (setq pdffiles (vl-directory-files pdfdir "*.pdf" 1))
  (foreach filename pdffiles
    (command "_.-PDFIMPORT" (strcat pdfdir "\\" filename) "")
    (princ (strcat "\nImported: " filename))
  )
  (princ "\nBatch import complete.")
  (princ)
)
```

2. After import, run cleanup operations (PEDIT join, layer assignment, text height correction) on each drawing

## Common PDF Import Issues

### Issue: Geometry Imports as Zero-Length Lines

**Cause**: The PDF contains extremely short vector segments (common in PDFs generated from low-resolution sources).
**Fix**: Use `QSELECT` to select all lines with length < 0.01mm, then delete them. Run `OVERKILL` to remove any remaining duplicates.

### Issue: Text Imports as Geometry (Outlines)

**Cause**: The PDF was generated with text "curves" option (text converted to vector outlines before PDF creation).
**Fix**: This text cannot be converted back to editable text entities. You must delete the outlined text and retype it using `TEXT` or `MTEXT`.

### Issue: Hatches Import as Individual Lines

**Cause**: The PDF hatch patterns were stored as individual line segments rather than fill regions.
**Fix**: Select all line segments in the hatch area, use `HATCH` with the `Select Objects` option to create a proper hatch entity, then delete the original lines.

### Issue: Scale Is Wrong After Import

**Cause**: The PDF was plotted at a non-1:1 scale, and the import scale was set to 1.
**Fix**: Measure a known dimension on the imported drawing (e.g., a door width should be 900mm). Calculate the correction factor: `actual / measured`. Select all entities and use `SCALE` with the correction factor.

## Conclusion

PDF import in DraftSight is a practical tool for converting vector PDFs back to editable DWG geometry. The key to success is understanding what the PDF contains (vector vs. raster), using the right import options, and performing thorough post-import cleanup. For DWG export, the process is straightforward — purge, audit, set format, and verify in AutoCAD. By following this workflow, you can maintain clean, compatible drawings that move seamlessly between PDF, DraftSight, and AutoCAD environments.
