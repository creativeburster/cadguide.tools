---
title: "IJCAD DWG Compatibility and Large Drawing Performance Errors: TrustedDWG Files from Other CAD Show Hatch Scale Differences and Print Discrepancies Requiring Version Update, Large CAD File Opening Stability and Performance from IJCAD 6+ Improvements, Layout Space Object Copy Causes Viewport and Frame Offset from Paper Margin Setting Mismatch, Polygon Viewport Clip Causes Freeze and Crash on Non-TrustedDWG Files, and PLOT Command Single Character Text Not Printed by DWG to PDF"
excerpt: "IJCAD fails for 5 distinct reasons: TrustedDWG files from other CAD show hatch scale differences and print discrepancies requiring version update, large CAD file opening stability and performance from IJCAD 6+ improvements, layout space object copy causes viewport and frame offset from paper margin setting mismatch, polygon viewport clip causes freeze and crash on non-TrustedDWG files, and PLOT command single character text not printed by DWG to PDF. We cover each with fixes from IJCAD Help Center and ITreview."
category: "performance"
softwareSlug: "ijcad"
keyword: "IJCAD TrustedDWG hatch scale differences print discrepancies large CAD file opening stability performance layout space object copy viewport frame offset paper margin polygon viewport clip freeze crash non-TrustedDWG PLOT command single character text DWG to PDF"
slug: "ijcad-dwg-compatibility-large-drawing-performance-errors-trustdwg-hatch-scale-print-large-file-stability-layout-copy-viewport-offset-paper-margin-polygon-viewport-clip-freeze-crash"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://support.ijcad.jp/hc/en-us/articles/202730179-IJCAD-and-AutoCAD-of-relationship"
  - "https://www.itreview.jp/products/ijcad/reviews/136802"
  - "https://ja.stackoverflow.com/questions/51282/ijcad%e3%81%a7%e3%83%ac%e3%82%a4%e3%82%a2%e3%82%a6%e3%83%88%e7%a9%ba%e9%96%93%e3%81%ab%e3%82%aa%e3%83%96%e3%82%b8%e3%82%a7%e3%82%af%e3%83%88%e3%82%92%e3%82%b3%e3%83%94%e3%83%bc%e3%81%99%e3%82%8b%e3%81%a8%e5%9b%b3%e6%9e%a0%e3%82%84%e3%83%93%e3%83%a5%e3%83%bc%e3%83%9d%e3%83%bc%e3%83%88%e3%81%8c%e3%81%af%e3%81%bf%e5%87%ba%e3%82%8b"
---

# IJCAD DWG Compatibility and Large Drawing Performance Errors: TrustedDWG Files from Other CAD Show Hatch Scale Differences and Print Discrepancies Requiring Version Update, Large CAD File Opening Stability and Performance from IJCAD 6+ Improvements, Layout Space Object Copy Causes Viewport and Frame Offset from Paper Margin Setting Mismatch, Polygon Viewport Clip Causes Freeze and Crash on Non-TrustedDWG Files, and PLOT Command Single Character Text Not Printed by DWG to PDF

IJCAD's DWG compatibility, large file handling, layout space operations, and PDF printing produce errors from cross-CAD file handling, viewport clipping, and print engine limitations. This guide covers the 5 most common IJCAD problems with diagnostic steps and community-verified fixes from IJCAD Help Center and ITreview.

## 1. TrustedDWG Files from Other CAD Show Hatch Scale Differences and Print Discrepancies

### Symptom

DWG files created or edited in other CAD software (not AutoCAD) show hatch patterns at different scales when opened in IJCAD. Print output differs from AutoCAD — semi-transparent objects print as solid black. These issues are chronic when handling DWG files from multiple editors and CAD systems.

### Root Cause

IJCAD has high DWG compatibility with AutoCAD, but files from other compatible CAD systems (not AutoCAD-edited DWG) may have subtle differences in hatch pattern definitions, transparency handling, and print settings. IJCAD 2022 had a bug where semi-transparent objects printed as solid black. IJCAD 2023 fixed this and other issues. Hatch scale differences occur because IJCAD and AutoCAD may interpret hatch pattern definitions slightly differently.

### Fix

1. **Update to IJCAD 2023 or later**:
   - "IJCAD 2022 had a bug where semi-transparent objects printed as solid black — fixed in 2023"
   - "IJCAD 2023 fixed: hatching at different scale when opened in AutoCAD"
   - "LIMITS command drawing area not printed — fixed"
   - "PLOT command single character text not printed by DWG to PDF — fixed"
   - Update to the latest IJCAD version

2. **Verify hatch pattern definitions**:
   - Open the DWG in AutoCAD to verify hatch scales
   - If hatches appear different in IJCAD, adjust the hatch scale
   - Use HATCHEDIT to correct the scale
   - Save in IJCAD and verify in AutoCAD

3. **Check transparency settings before printing**:
   - "In IJCAD 2022, semi-transparent objects printed as solid black"
   - Verify transparency settings in the Properties palette
   - Use PLOT preview before printing
   - Compare with AutoCAD print output

4. **Use AutoCAD for critical print verification**:
   - "Checking whether it prints the same as AutoCAD became an unnecessary task"
   - For client-critical drawings, verify print output in AutoCAD
   - This adds a verification step but ensures consistency

5. **Report bugs to IJCAD support**:
   - "The official community censors bug reports"
   - "Posts about bugs are thoroughly deleted"
   - Contact IJCAD support directly for bug reports
   - Use the version upgrade request process

### Community Report

> "Most bugs occur when editing non-TrustedDWG DWG data or using polygon viewport clip. These are chronic issues not resolved in previous version updates. IJCAD 2023 fixed: hatching at different scale when opened in AutoCAD, semi-transparent objects printing as solid black, LIMITS area not printing, and single character text not printed by DWG to PDF."

## 2. Large CAD File Opening Stability and Performance

### Symptom

Opening large CAD files in IJCAD causes instability, freezes, or slow performance. Files with complex geometry, many layers, or large block references take a long time to open. In older IJCAD versions (before IJCAD 6), large files could crash the program.

### Root Cause

IJCAD's early versions had limitations in handling large DWG files. The IntelliCAD-based engine was less optimized for large files than AutoCAD's. IJCAD 6 and later versions significantly improved large file handling. IJCAD 2014 further improved performance and stability. However, very large files or files with many external references may still be slow.

### Fix

1. **Update to IJCAD 2014 or later**:
   - "IJCAD 6 had stability and performance issues with large CAD files"
   - "After upgrading to IJCAD 2014, quality and performance issues were mostly resolved"
   - "Program startup is faster in IJCAD than AutoCAD"
   - Update to the latest IJCAD version

2. **Use AutoCAD for very large files**:
   - "For larger data, use AutoCAD; for smaller projects, use IJCAD"
   - This hybrid approach was adopted by users like Nikken Lease
   - "Using AutoCAD for large data and IJCAD for small projects solved the cost issue"
   - Keep one AutoCAD license for large file handling

3. **Optimize DWG files before opening**:
   - Purge unused blocks, layers, and styles in AutoCAD
   - Use WBLOCK to create clean copies
   - Reduce the number of external references
   - Bind or detach unnecessary XRefs

4. **Disable unnecessary features**:
   - Turn off layer thumbnails
   - Disable real-time regen
   - Reduce the number of open drawings
   - Close the Properties palette when not needed

5. **Use IJCAD Mobile for field viewing**:
   - "IJCAD Mobile can view and edit DWG/DXF files"
   - "FREE version for viewing, PRO version for AutoLISP macros"
   - Use mobile for field verification of large drawings
   - Desktop for editing

### Community Report

> "In early IJCAD versions, stability and performance with large CAD files were issues. After upgrading from IJCAD 6 to IJCAD 2014, quality and performance issues were mostly resolved. Program startup is faster in IJCAD than AutoCAD. For larger data, use AutoCAD; for smaller projects, use IJCAD."

## 3. Layout Space Object Copy Causes Viewport and Frame Offset

### Symptom

In IJCAD 2018 Mechanical, using C# to port AutoCAD source code to IJCAD. Copying objects from model space to layout space causes the drawing frame and viewport to shift/offset. The viewport extends beyond the paper boundary. The same code works correctly in AutoCAD.

### Root Cause

The paper margin settings differ between the source layout (where the template was created) and the destination layout (in IJCAD). When objects are copied between layouts with different paper sizes or margin settings, the viewport and frame positions shift. IJCAD and AutoCAD may handle default paper margins differently, causing the offset.

### Fix

1. **Match paper margin settings between layouts**:
   - "The offset is caused by different paper margin settings between the source and destination layouts"
   - Check page setup in both layouts
   - Ensure paper size, margins, and printable area match
   - Adjust margins to be identical

2. **Move viewport to correct position after copy**:
   - "Move the viewport so its lower-left corner is within the drawing frame coordinates"
   - After copying objects to layout space
   - Select the viewport
   - Use MOVE to position it within the frame
   - Verify the viewport boundary is within the paper

3. **Set plot type to Layout**:
   - "Set plot type to Layout instead of Extents or Window"
   - Use PlotSettingsValidator to set plot type:
   - `icPlSetVdr.SetPlotType(lay, GrxCAD.DatabaseServices.PlotType.Layout)`
   - This uses the layout's paper size for plotting

4. **Set scale to fit**:
   - "Set Use Standard Scale to true and StdScaleType to ScaleToFit"
   - `icPlSetVdr.SetUseStandardScale(lay, true)`
   - `icPlSetVdr.SetStdScaleType(lay, StdScaleType.ScaleToFit)`
   - This ensures the drawing fits within the paper

5. **Center the plot**:
   - "Set plot centered to true"
   - `icPlSetVdr.SetPlotCentered(lay, true)`
   - This centers the drawing on the paper

6. **Use the same template in IJCAD**:
   - "When the template file is opened in IJCAD, it works correctly"
   - Create the template in IJCAD rather than importing from AutoCAD
   - This ensures paper settings match IJCAD's defaults

### Community Report

> "Copying objects from model space to layout space causes the drawing frame and viewport to shift. The paper margin settings differ between the source and destination layouts. Move the viewport so its lower-left corner is within the drawing frame coordinates."

## 4. Polygon Viewport Clip Causes Freeze and Crash on Non-TrustedDWG Files

### Symptom

Using polygon viewport clip (viewport clip function) with DWG files not created in AutoCAD causes IJCAD to freeze or crash. The crash happens during viewport operations or when regenerating the display. Files created in AutoCAD (TrustedDWG) don't have this issue.

### Root Cause

IJCAD's viewport clip function has compatibility issues with DWG files from other CAD systems. Non-TrustedDWG files may have slightly different internal structures for viewport definitions. When IJCAD's polygon viewport clip processes these files, the internal structure mismatch causes a crash. This is a chronic bug that persists across IJCAD versions.

### Fix

1. **Open and save in AutoCAD first**:
   - Open the non-TrustedDWG file in AutoCAD
   - Save as DWG (this creates a TrustedDWG)
   - Open the TrustedDWG in IJCAD
   - The viewport clip should work correctly

2. **Avoid polygon viewport clip on non-TrustedDWG**:
   - "Most crashes occur when editing non-TrustedDWG DWG data or using polygon viewport clip"
   - "These are chronic issues not resolved in previous version updates"
   - If the file is not from AutoCAD, avoid viewport clip
   - Use rectangular viewports instead

3. **Use WBLOCK to create a clean copy**:
   - In the source CAD, use WBLOCK to export the drawing
   - This creates a clean DWG file
   - Open in IJCAD and try viewport clip
   - WBLOCK may remove problematic internal structures

4. **Report to IJCAD support**:
   - "If you encounter bugs in IJCAD, contact support directly"
   - "The official community censors bug reports"
   - Provide the DWG file and crash details to support
   - Request a fix in the next version

5. **Use AutoCAD for viewport clipping**:
   - If viewport clip is essential for the workflow
   - Use AutoCAD for the viewport clip operation
   - Save the file and open in IJCAD for further editing
   - This avoids the IJCAD viewport clip bug

6. **Consider alternative CAD for non-TrustedDWG workflows**:
   - "If you work with non-TrustedDWG files frequently, consider whether IJCAD is the right tool"
   - "For business use with non-TrustedDWG files, avoid IJCAD"
   - AutoCAD or other compatible CAD may be more stable

### Community Report

> "Most crashes occur when editing non-TrustedDWG DWG data or using polygon viewport clip. These are chronic issues not resolved in previous version updates. If you work with files from various CAD systems, consider whether IJCAD is suitable for your workflow."

## 5. PLOT Command Single Character Text Not Printed by DWG to PDF

### Symptom

When printing to PDF using the DWG to PDF.pc3 plotter in IJCAD, single character text (1 character only) is not included in the PDF output. Multi-character text prints correctly. The issue only affects single character text elements.

### Root Cause

This is a known bug in IJCAD's DWG to PDF.pc3 plotter driver. The PDF generation logic has a condition that skips text elements with only one character. This was fixed in IJCAD 2023 SP1. The fix was included in the version update along with other printing-related bug fixes.

### Fix

1. **Update to IJCAD 2023 SP1 or later**:
   - "Fixed: PLOT command, specific condition single character text not printed by DWG to PDF"
   - "Fixed: PREVIEW command, after PLOT settings change, first Print button click doesn't output"
   - Install IJCAD 2023 SP1 (Build 230227) or later

2. **Use alternative PDF printer**:
   - If you can't update to IJCAD 2023
   - Use Adobe PDF or another virtual PDF printer
   - These don't have the single character text bug
   - Configure in the PLOT dialog printer selection

3. **Add a space to single character text**:
   - As a workaround, add a trailing space to single character text
   - "A" becomes "A " (two characters)
   - This bypasses the single character condition
   - The text will print correctly

4. **Use PREVIEW before printing**:
   - "Fixed: PREVIEW command, first Print button click doesn't output after PLOT settings change"
   - In older versions, click Print twice in preview
   - First click doesn't output, second click does
   - Update to IJCAD 2023 to fix this

5. **Check for other printing fixes in IJCAD 2023**:
   - "Fixed: LIMITS command, drawing area not printed"
   - "Fixed: DIMCONTINUE on locked layers, Undo option causes abnormal termination"
   - "Fixed: hatch scale differences when opened in AutoCAD"
   - Update to get all printing fixes

### Community Report

> "IJCAD 2023 SP1 fixed: PLOT command, specific condition single character text not printed by DWG to PDF. PREVIEW command, after PLOT settings change, first Print button click doesn't output. LIMITS command, drawing area not printed. DIMCONTINUE on locked layers, Undo causes abnormal termination."

## 6. Additional IJCAD Issues

### DIMCONTINUE on Locked Layers Crashes

**Issue**: "DIMCONTINUE command on locked layers, Undo option causes abnormal termination."
**Fix**: Update to IJCAD 2023 SP1. Avoid using Undo during DIMCONTINUE on locked layers. Unlock the layer before dimensioning.

### LIMITS Command Drawing Area Not Printed

**Issue**: "LIMITS command, drawing area not printed."
**Fix**: Update to IJCAD 2023 SP1. As workaround, use Window plot area instead of LIMITS.

### AutoLISP Compatibility

**Issue**: AutoLISP macros from AutoCAD may not work in IJCAD.
**Fix**: "IJCAD has high compatibility with AutoCAD AutoLISP." Most LISP programs work without modification. IJCAD Mobile PRO supports AutoLISP macros. Test LISP programs in IJCAD before deployment.

### Community Censorship of Bug Reports

**Issue**: "The official community censors bug reports. Posts about bugs are thoroughly deleted."
**Fix**: Contact IJCAD support directly for bug reports. Don't rely on community forums for bug information. Use ITreview and other third-party review sites for user experiences.

## Best Practices

1. **Update to IJCAD 2023 SP1+ for printing fixes** — single character text, LIMITS, PREVIEW
2. **Open non-TrustedDWG files in AutoCAD first** — creates TrustedDWG for IJCAD
3. **Avoid polygon viewport clip on non-TrustedDWG files** — chronic crash bug
4. **Use AutoCAD for very large files** — IJCAD performance improves but AutoCAD is still better
5. **Match paper margin settings between layouts** — prevents viewport offset on copy
6. **Set plot type to Layout with ScaleToFit** — ensures proper printing
7. **Verify hatch scales in AutoCAD** — IJCAD may show different scales
8. **Use Adobe PDF as alternative printer** — avoids DWG to PDF bugs
9. **Contact support directly for bugs** — community censors bug reports
10. **Keep one AutoCAD license for critical workflows** — hybrid approach for reliability
