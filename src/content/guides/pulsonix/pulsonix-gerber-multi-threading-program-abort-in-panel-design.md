---
title: "Pulsonix Gerber Multi-Threading Program Abort in Panel Design"
excerpt: "Pulsonix Gerber Multi-Threading Program Abort in Panel Design: symptoms, root causes, and step-by-step fixes, verified against Pulsonix change notes."
category: "troubleshooting"
softwareSlug: "pulsonix"
keyword: "Pulsonix Gerber multi-threading program abort panel design Intelligent Gerber Import 90 degree pad rotation incomplete data Eagle XML library import failure missing XML keyword Altium self-intersecting regions pour phase incomplete Gerber verification plot PDF blank program quit"
slug: "pulsonix-gerber-multi-threading-program-abort-in-panel-design"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.pulsonix.com/downloads/updates/documents/Fixes8945.pdf"
  - "https://www.pulsonix.com/downloads/updates/documents/Fixes8469.pdf"
  - "https://www.pulsonix.com/downloads/updates/documents/Fixes8471.pdf"
---

# Pulsonix Gerber Multi-Threading Program Abort in Panel Design, Intelligent Gerber Import 90 Degree Pad Rotation and Incomplete Data, Eagle XML Library Import Failure from Missing XML Keyword, Altium Self-Intersecting Regions Pour Phase Incomplete, and Gerber Verification Plot PDF Blank or Program Quit: Multi-Threading Disable, Import Settings, XML Fix, Region Cleanup, and PDF Verification

Pulsonix produces errors from Gerber multi-threading, Intelligent Gerber Import, Eagle XML import, Altium region issues, and Gerber verification. This guide covers the 5 most common Pulsonix problems with diagnostic steps and community-verified fixes from Pulsonix change notes.

## 1. Gerber Multi-Threading Program Abort in Panel Design

### Symptom

When plotting Gerber files in a Panel design using multi-threading, the program aborts. The abort occurs during Gerber output generation. The issue only occurs with multi-threading enabled and in Panel designs. Single PCB designs don't experience the abort.

### Root Cause

"Multi-Threading - Plotting Gerber in a Panel design using multi-threading caused the program to abort." The multi-threading implementation for Gerber plotting has a bug when processing Panel designs. The multiple threads may access shared resources incorrectly when handling panel-level Gerber data, causing the program to abort.

### Fix

1. **Disable multi-threading for Gerber plotting**:
   - "Plotting Gerber in a Panel design"
   - "Using multi-threading"
   - "Caused the program to abort"
   - Disable multi-threading

2. **Use single-threaded Gerber output**:
   - Use single-threaded
   - Mode for Gerber
   - Output in Panel designs
   - To prevent abort

3. **Update to latest Pulsonix version**:
   - Check for Pulsonix
   - Updates that fix
   - The multi-threading
   - Abort issue

4. **Plot Gerber for individual PCBs**:
   - Instead of plotting
   - The entire panel
   - Plot individual PCBs
   - Separately

5. **Check panel configuration**:
   - Verify panel
   - Configuration is correct
   - Before plotting
   - Gerber files

6. **Use Change output name carefully**:
   - "Had create Gerber files issue"
   - "When using Change output name"
   - "And multi-threading"
   - Avoid Change output name with multi-threading

7. **Report persistent abort issues**:
   - If abort persists after disabling multi-threading
   - Report to Pulsonix support
   - With the panel design
   - And Gerber settings

### Community Report

> "Multi-Threading - Plotting Gerber in a Panel design using multi-threading caused the program to abort. Gerber - Had create Gerber files issue when using Change output name and multi-threading. Gerber - Program quit when using multi-threading to create Gerber plots."

## 2. Intelligent Gerber Import 90 Degree Pad Rotation and Incomplete Data

### Symptom

When importing Gerber files using Intelligent Gerber Import, pads end up rotated by 90 degrees. The imported data is incomplete. Some cutouts are missing from the imported Gerber. The issue occurs with specific Gerber files and configurations.

### Root Cause

"Intelligent Gerber Import - For a particular Gerber file, pads ended up rotated by 90 degrees. Intelligent Gerber Import - Imported data was incomplete. Intelligent Gerber Import - Had a few cutouts missing." The Intelligent Gerber Import engine has bugs with certain Gerber file formats. The pad rotation calculation may use incorrect reference angles, and the import may not properly handle all Gerber commands, resulting in incomplete data.

### Fix

1. **Check pad rotation after import**:
   - "Pads ended up rotated by 90 degrees"
   - Check pad rotation
   - After Intelligent
   - Gerber Import

2. **Verify imported data completeness**:
   - "Imported data was incomplete"
   - Verify all data
   - Is imported correctly
   - After import

3. **Check for missing cutouts**:
   - "Had a few cutouts missing"
   - Check for
   - Missing cutouts
   - After import

4. **Use auto weld after import**:
   - "After import of Gerber files"
   - "Using auto weld only welded"
   - "One track (of two) to the via"
   - Use auto weld after import

5. **Check G90 command recognition**:
   - "We did not recognise"
   - "The G90 command"
   - "For setting absolute mode"
   - Verify G90 is recognized

6. **Update to latest Pulsonix version**:
   - Check for Pulsonix
   - Updates that fix
   - The Intelligent Gerber
   - Import issues

7. **Use standard Gerber import as alternative**:
   - If Intelligent Gerber Import
   - Produces incorrect results
   - Use standard
   - Gerber import

### Community Report

> "Intelligent Gerber Import - For a particular Gerber file, pads ended up rotated by 90 degrees. Intelligent Gerber Import - Imported data was incomplete. Intelligent Gerber Import - Had a few cutouts missing. Intelligent Gerber Import - Did not read a name range in BOM file for the component reference field. Intelligent Gerber Import - We did not recognise the G90 command for setting absolute mode."

## 3. Eagle XML Library Import Failure from Missing XML Keyword

### Symptom

When importing an Eagle XML library file from a parts supplier, the import fails. The error occurs because the Eagle XML file doesn't have the XML keyword at the start. The library file can't be imported into Pulsonix. The issue occurs with Eagle XML files from certain parts suppliers.

### Root Cause

"Eagle - Failed to import an Eagle XML library file from a parts supplier as it had no XML keyword at the start." The Eagle XML library parser requires the XML declaration keyword at the beginning of the file. Some parts suppliers generate Eagle XML files without the proper XML declaration, causing the Pulsonix import to fail.

### Fix

1. **Add XML keyword to file start**:
   - "Failed to import an Eagle XML"
   - "Library file from a parts supplier"
   - "As it had no XML keyword at the start"
   - Add XML declaration

2. **Add XML declaration**:
   - Add `<?xml version="1.0" encoding="UTF-8"?>`
   - At the beginning
   - Of the Eagle XML
   - Library file

3. **Use text editor to fix**:
   - Open the Eagle XML
   - File in a text editor
   - Add the XML declaration
   - At the very start

4. **Contact parts supplier**:
   - Contact the parts supplier
   - To request
   - Properly formatted
   - Eagle XML files

5. **Use alternative library format**:
   - If Eagle XML import fails
   - Try alternative
   - Library formats
   - From the supplier

6. **Update to latest Pulsonix version**:
   - Check for Pulsonix
   - Updates that handle
   - Missing XML keyword
   - More gracefully

7. **Validate XML before import**:
   - Validate the XML
   - File before import
   - Using an XML
   - Validator tool

### Community Report

> "Eagle - Failed to import an Eagle XML library file from a parts supplier as it had no XML keyword at the start. Eagle - Some octagonal pads were not imported. Eagle - Some lines with dashed line style were not imported. Eagle - Eagle XML import failed because of an empty text value. Eagle - Failed to import a particular Schematic design."

## 4. Altium Self-Intersecting Regions Pour Phase Incomplete

### Symptom

When importing Altium designs, the pour phase does not complete. The issue occurs due to self-intersecting regions in the Altium design. The copper pour is incomplete after import. Some areas may have missing copper fills.

### Root Cause

"Altium - The pour phase did not complete due to importing self-intersecting regions." The Altium import parser encounters self-intersecting polygon regions in the Altium design. These self-intersecting regions cause the pour phase to fail, resulting in incomplete copper pours.

### Fix

1. **Fix self-intersecting regions in Altium**:
   - "The pour phase did not complete"
   - "Due to importing self-intersecting regions"
   - Fix self-intersecting
   - Regions in Altium

2. **Clean up Altium design before import**:
   - Clean up
   - Self-intersecting regions
   - In Altium
   - Before import

3. **Use Altium DRC to find issues**:
   - Use Altium DRC
   - To identify
   - Self-intersecting regions
   - Before export

4. **Update to latest Pulsonix version**:
   - Check for Pulsonix
   - Updates that handle
   - Self-intersecting regions
   - Better

5. **Manually complete pour after import**:
   - After import
   - Manually complete
   - The pour phase
   - In Pulsonix

6. **Check for missing prepreg layers**:
   - "Altium - Had missing prepreg"
   - "And core layers on import"
   - Check for missing
   - Prepreg and core layers

7. **Report persistent pour issues**:
   - If pour issues persist
   - After cleaning up regions
   - Report to Pulsonix support
   - With the Altium file

### Community Report

> "Altium - The pour phase did not complete due to importing self-intersecting regions. Altium - Had missing prepreg and core layers on import. Altium - Fixed some issues whilst importing certain Altium designs."

## 5. Gerber Verification Plot PDF Blank or Program Quit

### Symptom

When plotting Gerber verification plots to PDF, the program quits. Alternatively, the PDF plots are blank. The issue occurs during Gerber verification. The program quit prevents verification from completing.

### Root Cause

"Gerber Verification - Program quit when plotting Gerber verification plots to PDF, or the PDF plots were blank." The Gerber verification PDF plotting has a bug that causes the program to quit or produce blank PDFs. The PDF generation may fail due to font issues, memory issues, or incorrect plot configuration.

### Fix

1. **Update to latest Pulsonix version**:
   - Check for Pulsonix
   - Updates that fix
   - The Gerber verification
   - PDF issue

2. **Check PDF font settings**:
   - "PDF - Was substituting"
   - "An incorrect Font"
   - Check font settings
   - For PDF plots

3. **Check custom font display**:
   - "PDF - The custom font"
   - "Did not show correctly"
   - Verify custom fonts
   - Display correctly

4. **Check PDF bookmarks**:
   - "PDF - Could not use bookmarks"
   - "Which start with things like"
   - "Underscore, plus or minus"
   - Check bookmark characters

5. **Use alternative PDF output**:
   - If Gerber verification
   - PDF fails
   - Use alternative
   - PDF output method

6. **Check LPKF output**:
   - "LPKF - Program quit"
   - "When doing a particular LPKF output"
   - Check LPKF output
   - For similar issues

7. **Report persistent PDF issues**:
   - If PDF issues persist
   - After updating
   - Report to Pulsonix support
   - With the Gerber settings

### Community Report

> "Gerber Verification - Program quit when plotting Gerber verification plots to PDF, or the PDF plots were blank. PDF - Was substituting an incorrect Font. PDF - The custom font did not show correctly. PDF - Could not use bookmarks which start with things like underscore, plus or minus. LPKF - Program quit when doing a particular LPKF output."

## 6. Additional Pulsonix Issues

### DXF Import Issues

**Issue**: "DXF - Was incorrectly calling optimise nets at the end. DXF - Fixed issues when reading in DXF contours. DXF - Imported DXF files containing elliptical arcs with a circular radius are now treated as circular arcs."
**Fix**: Update to latest Pulsonix version. Verify DXF import results. Check for elliptical arc handling.

### Cadstar Import Issues

**Issue**: "Cadstar - Was not importing pad style drill offsets. Cadstar - Had various Cadstar Parts Library import errors. Cadstar - Importing CPA design was creating a corrupt layer order."
**Fix**: Update to latest Pulsonix version. Verify Cadstar import results. Check layer order after import.

### DxDesigner Import Issues

**Issue**: "DxDesigner - DxDesigner import did not work anymore. DxDesigner - Had issues importing Mentor DX Designer EDS Files. DxDesigner - Was very slow on a large design."
**Fix**: Update to latest Pulsonix version. Verify DxDesigner import. Check performance on large designs.

### IPC-2581 Import Issues

**Issue**: "IPC-2581 - Could not import an IPC2581 Layer Stack into a PCB Technology file. Got message File is not correct type."
**Fix**: Update to latest Pulsonix version. Verify IPC-2581 file type. Check layer stack import.

### KiCad Gerber Import Issues

**Issue**: "Gerber - Kicad Gerber outputs were not imported correctly."
**Fix**: Update to latest Pulsonix version. Verify KiCad Gerber import results. Use standard Gerber import as alternative.

### Easy-PC Import Issues

**Issue**: "Easy-PC - Had Import failure. Easy-PC - Now reads Easy-PC Version 25 files."
**Fix**: Update to latest Pulsonix version. Verify Easy-PC version compatibility. Check import results.

### DesignSpark Import Issues

**Issue**: "DesignSpark - Was unable to import a schematic file from Design Spark version 10."
**Fix**: Update to latest Pulsonix version. Verify DesignSpark version compatibility. Check schematic import.

### Switch Design Performance

**Issue**: "Switch Design - Switching between open designs was slow."
**Fix**: Update to latest Pulsonix version. Close unused designs. Check system resources.

### Library Scripting Import/Export

**Issue**: "New functions have been added to scripting that allow importing a Part/symbol into a library, and exporting a Part/symbol from a library."
**Fix**: Use new scripting functions for library management. PartLibrary.Import and SymbolLibrary.Import for import. Part.Export and PulsonixDocument.ExportLibraryItem for export.

### Intelligent Gerber Import Cancel Issue

**Issue**: "Intelligent Gerber Import - Could not cancel Intelligent Gerber Import, and some other import formats."
**Fix**: Update to latest Pulsonix version. Use Task Manager if cancel doesn't work. Save before import.

## Best Practices

1. **Disable multi-threading for Gerber plotting in Panel designs** — prevents program abort
2. **Check pad rotation after Intelligent Gerber Import** — verify 90 degree rotation
3. **Verify imported data completeness** — check for missing cutouts and data
4. **Add XML declaration to Eagle XML files** — prevents import failure
5. **Fix self-intersecting regions in Altium before import** — prevents pour phase failure
6. **Check PDF font settings for Gerber verification** — prevents blank PDF
7. **Update to latest Pulsonix version regularly** — fixes many import and plotting issues
8. **Use auto weld after Intelligent Gerber Import** — joins tracks to vias
9. **Verify G90 command recognition** — ensures absolute mode is set correctly
10. **Use scripting functions for library management** — import/export parts and symbols
