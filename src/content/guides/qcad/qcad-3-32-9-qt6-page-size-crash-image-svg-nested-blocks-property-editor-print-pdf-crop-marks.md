---
title: "QCAD 3.32.9 Qt6 Page Size Not Recognized for Decimal Paper Sizes, Crash with Invalid Image of Size 0 from Layout Opening, SVG Export Very Slow with Nested Blocks Qt6, Property Editor Crash with Long Update Delays Qt6, and Print PDF Export Fails When Crop Marks Enabled macOS: Qt5 Fallback, Image Reference Cleanup, Block Flattening, Update Delay Fix, and Crop Marks Disable"
excerpt: "QCAD fails for 5 distinct reasons: Qt6 page size not recognized for decimal paper sizes requiring Qt5 fallback, crash with invalid image of size 0 from layout opening requiring image reference cleanup, SVG export very slow with nested blocks Qt6 requiring block flattening, Property Editor crash with long update delays Qt6 requiring update delay fix, and Print PDF export fails when crop marks enabled macOS requiring crop marks disable. We cover each with fixes from QCAD forum and changelog."
category: "crash-and-export-errors"
softwareSlug: "qcad"
keyword: "QCAD 3.32.9 Qt6 page size not recognized decimal paper sizes crash invalid image size 0 layout opening SVG export very slow nested blocks Property Editor crash long update delays Print PDF export fails crop marks enabled macOS"
slug: "qcad-3-32-9-qt6-page-size-crash-image-svg-nested-blocks-property-editor-print-pdf-crop-marks"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://qcad.org/en/changelog"
  - "http://forum.qcad.org/t/qcad-will-not-save-paper-size/11680"
  - "http://forum.qcad.org/t/opening-a-layout-crashes-qcad/11767"
---

# QCAD 3.32.9 Qt6 Page Size Not Recognized for Decimal Paper Sizes, Crash with Invalid Image of Size 0 from Layout Opening, SVG Export Very Slow with Nested Blocks Qt6, Property Editor Crash with Long Update Delays Qt6, and Print PDF Export Fails When Crop Marks Enabled macOS: Qt5 Fallback, Image Reference Cleanup, Block Flattening, Update Delay Fix, and Crop Marks Disable

QCAD produces errors from Qt6 page size, image crashes, SVG export, Property Editor, and PDF crop marks. This guide covers the 5 most common QCAD problems with diagnostic steps and community-verified fixes from QCAD forum and changelog.

## 1. Qt6 Page Size Not Recognized for Decimal Paper Sizes

### Symptom

In QCAD 3.32.9 Qt6, the paper size is not recognized for page sizes with decimals. Setting paper size to Arch D (24" x 36") shows as "Custom" instead of "Arch D". The setting reverts to Custom after being changed. The issue occurs only in the Qt6 version, not in Qt5.

### Root Cause

"FS#2726 - Edit > Drawing Pref > Printing > Page: Page size not recognized for page sizes with decimals [Qt6]. Arch D is 24 by 36 inches (906.6mm by 914.4mm). 906mm by 914mm is custom and about 23.976 by 35.984. Apart from rounding the math is sound but not storing any preference would be the issue. It looks like a problem with Qt6 for some reason." The Qt6 version has a bug in page size recognition. Decimal page sizes like Arch D (which converts to 906.6mm x 914.4mm) are not properly recognized due to rounding and decimal handling differences between Qt5 and Qt6.

### Fix

1. **Use Qt5 version of QCAD**:
   - "I just installed version 3.32.9"
   - "(qcad-3.32.9-pro-win64-installer)"
   - "Using the QT5 windows download"
   - "And all is working better"
   - Use Qt5 version

2. **Delete configuration file**:
   - "I also deleted the configuration file"
   - "And started fresh"
   - Delete .ini config
   - And restart

3. **Set paper size in Application Preferences**:
   - Go to Application Preferences
   - Set the correct
   - Paper size there
   - Before creating drawings

4. **Check Drawing Preferences separately**:
   - Check Drawing Preferences
   - > Printing > Page
   - For the correct
   - Paper size

5. **Use Qt5 installer for paper size issues**:
   - "The 3.32.6 version"
   - "That works properly"
   - "In regard to paper size"
   - "Does not appear to be QT6"
   - Use Qt5 installer

6. **Report Qt6 page size issues**:
   - "Bug report at: FS#2726"
   - Report Qt6 issues
   - To QCAD developers
   - For fixing

7. **Use mm units for paper size**:
   - Use mm units
   - Instead of inches
   - To avoid decimal
   - Rounding issues

### Community Report

> "Every time I go to the layout block a dialog box asking if I want to change it to the default paper size pops up. The setting page for page size lists custom instead of Arch D. Qcad will not save the setting and list custom instead of Arch D paper size. I just installed version 3.32.9 using the QT5 windows download and all is working better. It looks like a problem with Qt6 for some reason. Bug report at: FS#2726."

## 2. Crash with Invalid Image of Size 0 from Layout Opening

### Symptom

When opening a layout in a DXF/DWG file, QCAD crashes. The file contains drawings, several page-layouts, and images. The crash occurs when QCAD tries to render an image entity. The image has Width and Height factors equal to NaN. The crash happens on certain platforms but not others.

### Root Cause

"FS#2731 - Crash with invalid image of size 0. The suspected image is a null-entity, typically positioned at (0,0) after reload and stored with a Width and Height factor equal to NaN. Picture data is never included within a DXF, only a link and some parameters. These pictures files were not included, QCAD would normally skip them silently and render an empty image entity." The DXF file contains image references with corrupted Width and Height factors (NaN). When QCAD tries to render these invalid image entities in a layout, it crashes. The issue occurs when image files are missing or corrupted.

### Fix

1. **Remove corrupted image references**:
   - "Delete the selected and corrupted"
   - "Image reference and all should be OK"
   - Delete corrupted
   - Image references

2. **Box-select around origin in Block**:
   - "Box-select around the origin"
   - "In that Block"
   - "That would select 1 image entity"
   - Box-select at origin

3. **Use Selection Filter**:
   - "Found in Block with the"
   - "Selection Filter (Image filename contains)"
   - Use Selection Filter
   - To find corrupted images

4. **Keep images in drawing directory**:
   - "It is wise to keep all images"
   - "In the drawing directory"
   - Keep images
   - In same directory

5. **Check image paths**:
   - Verify image paths
   - Are valid and
   - Accessible
   - Before opening

6. **Fix NaN width and height**:
   - "Width and Height factor"
   - "Equal to NaN"
   - Fix NaN values
   - To valid numbers

7. **Remove all images from blocks**:
   - "For each Block (Including Model-Space)"
   - "Box-select around the origin"
   - Remove all corrupted
   - Image entities

### Community Report

> "The moment I want to open one of the layouts Qcad crashes. There are various images attached to the drawing and QCAD crashes trying to render one of them. The suspected image is a null-entity, typically positioned at (0,0) after reload and stored with a Width and Height factor equal to NaN. Bug report at: FS#2731: Crash with invalid image of size 0. Delete the selected and corrupted image reference and all should be OK."

## 3. SVG Export Very Slow with Nested Blocks Qt6

### Symptom

SVG export is very slow when the drawing contains nested blocks. The issue occurs in the Qt6 version of QCAD. Export can take significantly longer than expected. The slowness is proportional to the nesting depth and number of blocks.

### Root Cause

"FS#2710 - File > SVG Export: Very slow with nested blocks [Qt6]." The Qt6 version's SVG export engine has a performance bug with nested blocks. The export algorithm traverses each block hierarchy level, and with Qt6, the traversal is significantly slower than with Qt5, especially for deeply nested block structures.

### Fix

1. **Use Qt5 version for SVG export**:
   - If SVG export is slow
   - With Qt6
   - Use Qt5 version
   - For export

2. **Flatten nested blocks**:
   - Flatten nested
   - Block structures
   - Before SVG export
   - To reduce traversal

3. **Explode blocks before export**:
   - Explode blocks
   - Before SVG export
   - To eliminate
   - Nesting

4. **Use Advanced SVG Export**:
   - "File > Advanced SVG Export"
   - Try Advanced SVG Export
   - As alternative
   - To standard export

5. **Check for scaled viewports**:
   - "FS#2706 - Scaled viewports"
   - "Fail to inversely scale"
   - "Linetype patterns"
   - Check viewport settings

6. **Update to latest QCAD version**:
   - Check for QCAD
   - Updates that fix
   - The Qt6 SVG
   - Export performance

7. **Reduce block nesting depth**:
   - Reduce the depth
   - Of block nesting
   - Before export
   - To improve speed

### Community Report

> "FS#2710 - File > SVG Export: Very slow with nested blocks [Qt6]. FS#2706 - File > SVG Export: Scaled viewports fail to inversely scale linetype patterns. FS#2714 - File > Advanced SVG Export: selected entities exported in selection color."

## 4. Property Editor Crash with Long Update Delays Qt6

### Symptom

The Property Editor crashes in QCAD Qt6 version. The crash occurs after long update delays. The Property Editor becomes unresponsive and then crashes. The issue is specific to the Qt6 version.

### Root Cause

"FS#2704 - Property Editor: Crash with long update delays [Qt6]." The Qt6 version's Property Editor has a bug where long update delays cause a crash. The Property Editor's update mechanism in Qt6 has a timing issue where delayed updates result in accessing invalid or null objects, causing the crash.

### Fix

1. **Use Qt5 version**:
   - If Property Editor
   - Crashes in Qt6
   - Use Qt5 version
   - As workaround

2. **Update to latest QCAD version**:
   - Check for QCAD
   - Updates that fix
   - The Property Editor
   - Crash in Qt6

3. **Avoid rapid property changes**:
   - Avoid making
   - Rapid property changes
   - That trigger
   - Long update delays

4. **Close and reopen Property Editor**:
   - If Property Editor
   - Becomes unresponsive
   - Close and reopen
   - The Property Editor

5. **Use Qt5 for complex drawings**:
   - For complex drawings
   - With many properties
   - Use Qt5 version
   - To avoid crash

6. **Report persistent crashes**:
   - If crashes persist
   - Report to QCAD
   - With crash details
   - And drawing file

7. **Reduce drawing complexity**:
   - Reduce the number
   - Of entities with
   - Complex properties
   - To reduce update delays

### Community Report

> "FS#2704 - Property Editor: Crash with long update delays [Qt6]. FS#2702 - SVG Import: crash / seg fault [Qt5]. FS#2670 - Crash on exit with Qt 6.9."

## 5. Print PDF Export Fails When Crop Marks Enabled macOS

### Symptom

File > Print / PDF Export fails when crop marks are enabled on macOS (M1/M2/M3). The print or PDF export doesn't complete. The issue only occurs on Apple Silicon Macs with crop marks enabled. Disabling crop marks resolves the issue.

### Root Cause

"FS#2508 - File > Print / PDF Export: Fails when crop marks are enabled [macOS M1/M2/M3]." The crop marks rendering on macOS Apple Silicon has a bug that causes the print/PDF export to fail. The crop marks drawing code may use APIs that are not compatible with Apple Silicon, causing the export to fail.

### Fix

1. **Disable crop marks**:
   - "Fails when crop marks"
   - "Are enabled"
   - Disable crop marks
   - For print/PDF export

2. **Use PDF export without crop marks**:
   - Export PDF
   - Without crop marks
   - As workaround
   - On macOS

3. **Update to latest QCAD version**:
   - Check for QCAD
   - Updates that fix
   - The crop marks
   - Issue on macOS

4. **Use print preview**:
   - Use print preview
   - To verify output
   - Before printing
   - Without crop marks

5. **Use alternative PDF export**:
   - Use alternative
   - PDF export method
   - If Print/PDF fails
   - With crop marks

6. **Check paper size in print dialog**:
   - "FS#2400 - Print / PDF Export"
   - "Page size always A4"
   - Check paper size
   - In print dialog

7. **Use Qt5 version on macOS**:
   - If Qt6 has issues
   - On macOS
   - Try Qt5 version
   - As alternative

### Community Report

> "FS#2508 - File > Print / PDF Export: Fails when crop marks are enabled [macOS M1/M2/M3]. FS#2400 - Print / PDF Export: Page size always A4."

## 6. Additional QCAD Issues

### Hatch from Segments Failure

**Issue**: "FS#2732 - Draw > Hatch > Hatch from Segments: fails with certain arcs."
**Fix**: Update to latest QCAD version. Use standard Hatch tool as alternative. Check arc geometry before hatching.

### Bitmap Export Margin Offset

**Issue**: "FS#2729 - File > Bitmap Export: margin creates offset."
**Fix**: Update to latest QCAD version. Check margin settings before bitmap export. Use zero margin as workaround.

### Transparent Entity Color Correction

**Issue**: "FS#2733 - Transparent black or white entities lose transparency with color correction."
**Fix**: Disable color correction for transparent entities. Use Prevent white on white / black on black export option. Check entity transparency after export.

### SVG Import Crash

**Issue**: "FS#2702 - SVG Import: crash / seg fault [Qt5]."
**Fix**: Use Qt6 version for SVG import. Update to latest QCAD version. Check SVG file validity before import.

### SVG Export Unit Issue

**Issue**: "FS#2659 - File > SVG Export: unit centimeter not accepted."
**Fix**: Use mm or inch units for SVG export. Update to latest QCAD version. Check unit settings before export.

### Text Question Marks Between Asian Glyphs

**Issue**: "FS#2712 - Text: question marks between asian glyphs if font does not support zero-width space."
**Fix**: Use font that supports zero-width space. Update to latest QCAD version. Check font compatibility for Asian text.

### DWF Export Exception

**Issue**: "Fix exception when exporting to DWF format."
**Fix**: Update to latest QCAD version. Use alternative export format. Check DWF export settings.

### Print Paper Size A4 Default

**Issue**: "FS#2400 - Print / PDF Export: Page size always A4."
**Fix**: Check print dialog paper size. Set correct paper size in Drawing Preferences. Use Print/EnforcePageSize option.

### SVG Export Selection Color

**Issue**: "FS#2714 - File > Advanced SVG Export: selected entities exported in selection color."
**Fix**: Update to latest QCAD version. Check selection color settings. Use standard SVG export as alternative.

### Print Enforce Page Size

**Issue**: "On Windows the print dialog is the native PrintDlgEx, which round-trips a DEVMODE through the printer driver. Drivers are free to hand back a DEVMODE describing their own default paper (A4 here) instead of the one Qt seeded it with."
**Fix**: Use Print/EnforcePageSize option (default true). Re-applies drawing's paper size after native print dialog. Check log for mismatch warnings.

## Best Practices

1. **Use Qt5 version for paper size issues** — Qt6 has decimal page size recognition bug
2. **Delete corrupted image references in DXF files** — prevents layout opening crash
3. **Keep image files in drawing directory** — prevents missing image references
4. **Use Qt5 for SVG export with nested blocks** — Qt6 is very slow with nested blocks
5. **Avoid rapid property changes in Qt6** — prevents Property Editor crash
6. **Disable crop marks on macOS M1/M2/M3** — prevents Print/PDF export failure
7. **Use Print/EnforcePageSize option** — re-applies paper size after native print dialog
8. **Update to latest QCAD version regularly** — fixes many Qt6 bugs
9. **Use mm units for paper size** — avoids decimal rounding issues in Qt6
10. **Explode blocks before SVG export** — reduces nesting depth and improves speed
