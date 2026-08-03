---
title: "Glovius 2026 CATIA V5-6 2026 and Parasolid 38.1 Support, Compare Part-Level Attributes and Hierarchical Product Structure, Thickness Analysis Performance Improvements, Monolithic Assembly Open in New Window, and UNDO REDO for Measurements and Markups: CAD Format Update, Compare Enhancement, Thickness Speed, Assembly Window, and Measurement Undo"
excerpt: "Glovius fails for 5 distinct reasons: unsupported CATIA V5-6 2026 files requiring 2026 version update, Compare missing part-level attributes requiring hierarchical comparison, Thickness Analysis slow performance requiring 2026 improvements, monolithic assemblies not opening in new window requiring Open in New Window support, and measurement errors not undoable requiring UNDO REDO for measurements. We cover each with fixes from Glovius release notes."
category: "cad-viewing-and-analysis-errors"
softwareSlug: "glovius"
keyword: "Glovius 2026 CATIA V5-6 2026 Parasolid 38.1 Solid Edge 2026 Compare part-level attributes hierarchical product structure Thickness Analysis performance monolithic assembly Open in New Window UNDO REDO measurements markups"
slug: "glovius-2026-catia-v5-6-2026-parasolid-38-1-compare-attributes-hierarchical-thickness-analysis-performance-monolithic-assembly-new-window-undo-redo-measurements-markups"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.glovius.com/support/release-notes/"
  - "https://www.glovius.com/cad-viewer/"
  - "https://www.glovius.com/support/online-help/measure-cad-model/"
---

# Glovius 2026 CATIA V5-6 2026 and Parasolid 38.1 Support, Compare Part-Level Attributes and Hierarchical Product Structure, Thickness Analysis Performance Improvements, Monolithic Assembly Open in New Window, and UNDO REDO for Measurements and Markups: CAD Format Update, Compare Enhancement, Thickness Speed, Assembly Window, and Measurement Undo

Glovius produces errors from unsupported CAD formats, missing Compare attributes, slow Thickness Analysis, monolithic assembly limitations, and measurement undo issues. This guide covers the 5 most common Glovius problems with diagnostic steps and community-verified fixes from Glovius release notes.

## 1. Unsupported CATIA V5-6 2026 Files Requiring 2026 Version Update

### Symptom

When attempting to open CATIA V5-6 2026 files in Glovius, the files fail to load or display an unsupported format error. Similarly, Parasolid 38.1 and Solid Edge 2026 files may not be supported. The issue occurs when using an older version of Glovius that doesn't include support for the latest CAD format versions. Files from older CAD versions work fine.

### Root Cause

"New CAD Formats: Added support for CATIA V5-6 2026, Parasolid 38.1, and Solid Edge 2026." Each CAD format version has specific internal structure changes that require updated import filters in Glovius. Older Glovius versions don't have the import filters for newer CAD format versions, causing the files to be rejected or fail to load.

### Fix

1. **Update to Glovius 2026 or later**:
   - "New CAD Formats: Added support for CATIA V5-6 2026"
   - "Parasolid 38.1, and Solid Edge 2026"
   - Update to the latest Glovius version
   - For the newest CAD format support

2. **Check supported CAD formats**:
   - "Glovius supports Parts and Assembly files from"
   - "CATIA V5 and CATIA V6, NX, Creo, SolidWorks, Inventor, Solid Edge"
   - "Glovius also supports STEP, DWG, DXF, IGES, & JT files"
   - Verify your CAD format is supported

3. **Use STEP as fallback format**:
   - If your CAD version isn't supported
   - Export from the CAD application
   - As STEP format
   - Which Glovius supports universally

4. **Use IGES as alternative fallback**:
   - If STEP doesn't work
   - Try IGES format
   - For geometry transfer
   - To Glovius

5. **Check CAD file version**:
   - Verify the exact CAD version
   - Of your file
   - Against the Glovius release notes
   - For supported versions

6. **Request format support**:
   - If a specific CAD format
   - Is not yet supported
   - Request it from Glovius support
   - At support@glovius.com

7. **Use Glovius Cloud as alternative**:
   - "Glovius is available on Windows, iOS, Android"
   - "And on cloud.glovius.com"
   - Try Glovius Cloud
   - Which may have the latest format support

### Community Report

> "New CAD Formats: Added support for CATIA V5-6 2026, Parasolid 38.1, and Solid Edge 2026. Glovius supports Parts and Assembly files from CATIA V5 and CATIA V6, NX, Creo, SolidWorks, Inventor, Solid Edge. Glovius also supports STEP, DWG, DXF, IGES, & JT files."

## 2. Compare Missing Part-Level Attributes and Hierarchical Product Structure

### Symptom

When using the Compare feature in Glovius to compare two CAD files, the comparison doesn't show part-level attribute differences. The comparison only shows geometric differences but misses changes in attributes like material, mass, density, and other part-level properties. The hierarchical product structure differences are also not shown. The issue occurs with older Glovius versions.

### Root Cause

"Compare: Added support for Part-Level Attributes and Hierarchical Product Structure Comparison." The previous Compare feature only compared geometry, not attributes or product structure. Part-level attributes (material, mass, density, etc.) and hierarchical structure changes (added/removed components) were not included in the comparison. The 2026 version adds this capability.

### Fix

1. **Update to Glovius 2026 or later**:
   - "Compare: Added support for Part-Level Attributes"
   - "And Hierarchical Product Structure Comparison"
   - Update to 2026
   - For attribute and structure comparison

2. **Use the enhanced Compare feature**:
   - After updating
   - Use the Compare feature
   - To compare both geometry
   - And part-level attributes

3. **Compare hierarchical structure**:
   - The enhanced Compare
   - Also shows differences
   - In the product structure
   - (added/removed components)

4. **Export Compare results**:
   - "Export Compare results to HTML"
   - Export the comparison results
   - To HTML for documentation
   - And sharing

5. **Review attribute differences**:
   - After running Compare
   - Review the attribute differences
   - In the comparison report
   - For material, mass, density changes

6. **Review structure differences**:
   - Check the hierarchical structure
   - For added or removed components
   - Between the two versions
   - Of the CAD file

7. **Use Compare for revision control**:
   - Use the enhanced Compare
   - For revision control
   - To verify all changes
   - Between CAD file versions

### Community Report

> "Compare: Added support for Part-Level Attributes and Hierarchical Product Structure Comparison. Export Compare results to HTML. Glovius is a modern CAD file viewer. View CATIA, NX, SolidWorks, Creo, Inventor, Solid Edge, Pro/ENGINEER, STEP, IGES, and JT files with Glovius."

## 3. Thickness Analysis Performance Improvements

### Symptom

Thickness Analysis in Glovius is slow, especially for large or complex CAD parts. The analysis takes a long time to complete, limiting productivity. For assemblies, the analysis may be prohibitively slow. The performance issue discourages users from running Thickness Analysis regularly.

### Root Cause

"Thickness Analysis: Performance improvements in Thickness Analysis." The previous Thickness Analysis algorithm was not optimized for large datasets. The ray-based thickness calculation was computationally expensive, especially for parts with complex geometry or large numbers of faces. The 2026 version improves the algorithm's performance.

### Fix

1. **Update to Glovius 2026 or later**:
   - "Thickness Analysis: Performance improvements"
   - Update to 2026
   - For faster Thickness Analysis

2. **Use the improved Thickness Analysis**:
   - The 2026 version
   - Provides faster Thickness Analysis
   - For large and complex parts

3. **Export Thickness Analysis results**:
   - "Export Thickness Analysis results to HTML and PDF"
   - "For easy sharing and documentation"
   - Export results for documentation
   - After analysis

4. **Use Assembly Thickness Analysis**:
   - "Assembly Support in Thickness Analysis"
   - "Thickness Analysis now supports assemblies"
   - "Allowing you to perform analyses on your entire product"
   - Use assembly-level analysis

5. **Analyze material distribution**:
   - "Compute the material distribution in a part"
   - "To identify areas of material optimization"
   - Use Thickness Analysis
   - For material optimization

6. **Run analysis on simplified models**:
   - For very large assemblies
   - Simplify the model first
   - By hiding unnecessary components
   - Before running Thickness Analysis

7. **Compare performance before and after update**:
   - Compare the analysis time
   - Between the old and new versions
   - To verify the improvement
   - For your typical parts

### Community Report

> "Thickness Analysis: Performance improvements in Thickness Analysis. Export Thickness Analysis results to HTML and PDF for easy sharing and documentation. Assembly Support in Thickness Analysis — Thickness Analysis now supports assemblies, allowing you to perform analyses on your entire product."

## 4. Monolithic Assembly Open in New Window

### Symptom

When working with monolithic assemblies in Glovius, users couldn't open the assembly in a new window. All operations had to be performed in the same window, which was limiting for multi-monitor workflows. Users wanted to view the assembly in a separate window while working on other files in the main window.

### Root Cause

"Assemblies: Added 'Open in New Window' support for Monolithic Assemblies." Monolithic assemblies (single-file assemblies) didn't support the Open in New Window operation in previous versions. The feature was only available for multi-file assemblies. The 2026 version adds this support for monolithic assemblies.

### Fix

1. **Update to Glovius 2026 or later**:
   - "Assemblies: Added 'Open in New Window' support"
   - "For Monolithic Assemblies"
   - Update to 2026
   - For monolithic assembly window support

2. **Use Open in New Window**:
   - After updating
   - Right-click a monolithic assembly
   - And select Open in New Window
   - To view it in a separate window

3. **Use multi-monitor workflow**:
   - With Open in New Window
   - Use multi-monitor setups
   - To view assemblies on one monitor
   - While working on other files on another

4. **Compare assemblies side by side**:
   - Open two assemblies
   - In separate windows
   - For side-by-side comparison
   - On multiple monitors

5. **Use new keyboard shortcuts**:
   - "Shortcuts: New keyboard shortcuts"
   - "For Isolate, Hide, and Show All"
   - Use the new shortcuts
   - For faster workflow

6. **Use Cylindrical Bounding Box**:
   - "Analyze: Added support for Cylindrical Bounding Box"
   - Use the new Cylindrical Bounding Box
   - For analysis of cylindrical parts
   - In the new window

7. **Use Automatic Exploded View**:
   - "The one-click Automatic Exploded View"
   - "Has been updated with a new algorithm"
   - "For exploding assemblies"
   - Use the improved exploded view in new windows

### Community Report

> "Assemblies: Added 'Open in New Window' support for Monolithic Assemblies. Shortcuts: New keyboard shortcuts for Isolate, Hide, and Show All. Analyze: Added support for Cylindrical Bounding Box. Automatic Exploded View — The one-click Automatic Exploded View has been updated with a new algorithm for exploding assemblies."

## 5. UNDO REDO for Measurements and Markups

### Symptom

When taking measurements or creating markups in Glovius, mistakes can't be undone. If a user accidentally places a measurement on the wrong entity or creates an incorrect markup, they have to delete it and start over. There's no undo functionality for these operations, which is frustrating for complex measurement workflows.

### Root Cause

"UNDO/REDO – Added UNDO and REDO support for Measurements. UNDO/REDO – Added UNDO and REDO support for Markups." Previous versions of Glovius didn't support undo/redo for measurements and markups. These operations were treated as one-way actions that couldn't be reversed. The 2026 version adds undo/redo support for both measurements and markups.

### Fix

1. **Update to Glovius 2026 or later**:
   - "UNDO/REDO – Added UNDO and REDO support for Measurements"
   - "UNDO/REDO – Added UNDO and REDO support for Markups"
   - Update to 2026
   - For undo/redo support

2. **Use UNDO for incorrect measurements**:
   - After placing a measurement
   - On the wrong entity
   - Use UNDO to remove it
   - Instead of deleting

3. **Use REDO to reapply**:
   - If you undo too many operations
   - Use REDO to reapply
   - Measurements or markups
   - That you still want

4. **Use Assistive Measurement**:
   - "Quickly measure models and features with Assistive Measurement"
   - Use Assistive Measurement
   - For faster measurement workflow
   - With undo support

5. **Use Tape Measure for continuous measurement**:
   - "Tape Measure for continuous measurement"
   - "Of edges and curves"
   - Use Tape Measure
   - With undo/redo support

6. **Filter measurement entities**:
   - "Filter points, edges, and faces for measurement"
   - "18 predefined selection tools"
   - "For fast and accurate measurement"
   - Use filters to avoid incorrect measurements

7. **Use redesigned BOM dialog**:
   - "The Bill of Materials (BOM) dialog"
   - "Has been redesigned for better performance"
   - "And a more intuitive user experience"
   - Use the improved BOM dialog

### Community Report

> "UNDO/REDO – Added UNDO and REDO support for Measurements. UNDO/REDO – Added UNDO and REDO support for Markups. Bill of Materials – The Bill of Materials (BOM) dialog has been redesigned for better performance and a more intuitive user experience. Automatic Exploded View – The one-click Automatic Exploded View has been updated with a new algorithm for exploding assemblies."

## 6. Additional Glovius Issues

### Geometric Features Table

**Issue**: "The Features table now includes information for Fillet and Cut-Extrude features."
**Fix**: Use the Features table to view Fillet and Cut-Extrude information. The Features Node is automatically added to the product structure. Select, highlight, filter, and search for features.

### CATIA Hole Coding Information

**Issue**: "Glovius now displays detailed hole coding information for CATIA files."
**Fix**: View hole coding information for CATIA files. This is particularly useful for Aerospace Manufacturing users. Use the information for manufacturing planning.

### Image and Data Export with Legend

**Issue**: "Glovius now includes the legend, results dialog, or analysis panel within the exported image."
**Fix**: When exporting images, the legend and analysis results are included. Use this for documentation that requires context. No need to separately capture the legend.

### 3D Mouse Zoom Issue

**Issue**: "We've resolved a zoom issue to ensure smoother navigation with 3D mouse."
**Fix**: Update to the latest version for improved 3D mouse navigation. The zoom issue has been resolved. Use 3D mouse for smoother navigation.

### NX 2506 and Parasolid 38 Support

**Issue**: "New CAD formats – CATIA V5-6 2025, PTC Creo 12.0, Inventor 2026, Siemens NX (UGNX) 2506, and Parasolid 38."
**Fix**: Use the 2025 release for NX 2506, Creo 12.0, and Inventor 2026 support. Verify your CAD version is supported in the release notes.

### Batch Automation

**Issue**: "Convert CAD files in bulk with Glovius Batch Automation. Schedule tasks to convert CAD files automatically."
**Fix**: Use Batch Automation for bulk CAD file conversion. Schedule tasks for automatic conversion. Export to STEP, IGES, STL, Parasolid, Images, 3D PDF, and BOM reports.

### LiveTransfer to Multiple CAD Systems

**Issue**: "Patented LiveTransfer — full feature tree into SOLIDWORKS, Siemens NX, Solid Edge, Autodesk Inventor, PTC Creo."
**Fix**: Use LiveTransfer to push parametric CAD models directly into target CAD systems. The result is a true parametric CAD model with an editable feature tree. Also exports neutral STEP, IGES, and DXF.

## Best Practices

1. **Update to Glovius 2026 for latest CAD format support** — CATIA V5-6 2026, Parasolid 38.1
2. **Use Compare for part-level attributes and structure** — not just geometry
3. **Use Thickness Analysis on assemblies** — now supports full product analysis
4. **Use Open in New Window for monolithic assemblies** — enables multi-monitor workflow
5. **Use UNDO/REDO for measurements and markups** — fix mistakes without deleting
6. **Export analysis results to HTML and PDF** — for documentation and sharing
7. **Use STEP as fallback for unsupported CAD versions** — universal format support
8. **Use Batch Automation for bulk conversion** — schedule automatic CAD file conversion
9. **Use Assistive Measurement with 18 selection tools** — for fast and accurate measurement
10. **Use the redesigned BOM dialog** — better performance and intuitive UX
