---
title: "EasyEDA BOM and Pick Place CSV Double Quote Header Breaking JLCPCB SMT Assembly Upload, Unicode Text Tab Delimited BOM with CSV Extension Not Recognized by JLCPCB, Component Rotation Mismatch Between EasyEDA and JLCPCB Placement Preview, Missing LCSC Part Numbers Causing Part Not Matched Warnings, and Gerber Drill Coordinate Format Precision Offset in CAM350: CSV Save As Excel, Header Quote Removal, LCSC Part Number Assignment, Rotation Verification, and Drill Format 3:3 mm"
excerpt: "EasyEDA fails for 5 distinct reasons: BOM and Pick Place CSV double quote header breaking JLCPCB SMT upload requiring Excel Save As CSV, Unicode Text tab delimited BOM with CSV extension not recognized by JLCPCB requiring CSV comma delimited save, component rotation mismatch between EasyEDA and JLCPCB requiring placement preview verification, missing LCSC part numbers causing Part Not Matched warnings requiring LCSC assignment, and Gerber drill coordinate format precision offset in CAM350 requiring 3:3 mm format. We cover each with fixes from EasyEDA Forum and Schemalyzer."
category: "bom-and-gerber-export-errors"
softwareSlug: "easyeda"
keyword: "EasyEDA BOM Pick Place CSV double quote header JLCPCB SMT assembly upload Unicode Text tab delimited CSV extension component rotation mismatch LCSC part numbers Part Not Matched Gerber drill coordinate format precision CAM350 offset"
slug: "easyeda-bom-pick-place-csv-double-quote-header-jlcpcb-smt-upload-unicode-text-tab-delimited-component-rotation-mismatch-lcsc-part-numbers-not-matched-gerber-drill-coordinate-precision-cam350-offset"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://easyeda.com/forum/topic/JLCPCB-does-not-recognize-BOM-and-CPL-export-from-EasyEDA-when-adding-SMT-service-to-order-2a1403c7627f47a6bdb94b4143316bb7"
  - "https://easyeda.com/forum/topic/BOM-and-Pick-And-Place-EasyEDA-format-export-issues-causing-Uploaded-file-format-is-incorrect-on-JLCPCB-SMT-Assembly-wizard-1b376a7cc4824fa1a0f665660fe7fe94"
  - "https://www.schemalyzer.com/en/blog/easyeda/export-import/easyeda-bom-export-jlcpcb"
---

# EasyEDA BOM and Pick Place CSV Double Quote Header Breaking JLCPCB SMT Assembly Upload, Unicode Text Tab Delimited BOM with CSV Extension Not Recognized by JLCPCB, Component Rotation Mismatch Between EasyEDA and JLCPCB Placement Preview, Missing LCSC Part Numbers Causing Part Not Matched Warnings, and Gerber Drill Coordinate Format Precision Offset in CAM350: CSV Save As Excel, Header Quote Removal, LCSC Part Number Assignment, Rotation Verification, and Drill Format 3:3 mm

EasyEDA produces errors from CSV header quotes, Unicode BOM format, rotation mismatches, missing LCSC numbers, and Gerber drill offsets. This guide covers the 5 most common EasyEDA problems with diagnostic steps and community-verified fixes from EasyEDA Forum and Schemalyzer.

## 1. BOM and Pick Place CSV Double Quote Header Breaking JLCPCB SMT Assembly Upload

### Symptom

BOM and Pick and Place files exported from EasyEDA starting from version 6.3.39 are not properly understood by JLCPCB during the SMT BOM and CPL upload wizard. JLCPCB reports "Uploaded file format is incorrect." The issue is caused by double quote characters being added to the first header row of the CSV files. Files exported from earlier EasyEDA versions work fine. The issue was introduced in v6.3.39 and fixed in v6.3.41.

### Root Cause

"We adding the double quotes to head fields of CSV, it was treated as bug fixed in the new version. For CSV file format, contains quotes for head fields should be a correct format (as before, only the head fields without double quotes), but this fix impact JLCPCB system, we didn't realize that JLCPCB was hard-coded the CSV head fields." EasyEDA added double quotes to CSV header fields as a format improvement, but JLCPCB's system was hard-coded to expect header fields without double quotes. The mismatch caused JLCPCB's parser to reject the files.

### Fix

1. **Update to EasyEDA v6.3.41 or later**:
   - "It fixed at v6.3.41"
   - "We will fix it soon, rollback the old format"
   - "(fields without double quotes)"
   - Install the latest EasyEDA version

2. **Remove double quotes from header row**:
   - "I've solved the problem opening the BOM and Pick and Place files"
   - "With a simple text editor (TextEdit on Mac)"
   - "And removing the double quotes on the first row of the files"
   - Manually edit the CSV file header

3. **Save As XLSX or XLS format**:
   - "At present, the best way is csv SAVE AS to xlsx, xls format to upload"
   - Open the CSV in Excel
   - Save As XLSX or XLS
   - Upload the XLSX/XLS to JLCPCB

4. **Use EasyEDA Pro for exports**:
   - EasyEDA Pro may have
   - Better export formatting
   - Try exporting from EasyEDA Pro
   - Instead of standard EasyEDA

5. **Verify header format before upload**:
   - Before uploading to JLCPCB
   - Open the CSV in a text editor
   - Check the header row
   - For unexpected double quotes

6. **Report persistent issues**:
   - If the issue persists after updating
   - Report on the EasyEDA forum
   - With the exported file
   - And EasyEDA version

7. **Use JLCPCB's example files**:
   - "I was able to use that to get something together using the example files"
   - Download JLCPCB's example BOM and CPL files
   - As a template for correct formatting
   - And match your export to the template

### Community Report

> "I've discovered an issue in BOM and Pick and Place files exported from EasyEda starting from the v6.3.39. The exported files are not well understood from JLCPCB during SMT BOM and CPL upload wizard, giving the error 'Uploaded file format is incorrect.' I've found that the first header row of the .csv files starting from the v6.3.39 version have the double quote char. The workaround: I've solved the problem opening the files with a simple text editor and removing the double quotes on the first row. We adding the double quotes to head fields of CSV, it was treated as bug fixed. But this fix impact JLCPCB system, we didn't realize that JLCPCB was hard-coded the CSV head fields. It fixed at v6.3.41."

## 2. Unicode Text Tab Delimited BOM with CSV Extension Not Recognized by JLCPCB

### Symptom

When uploading EasyEDA-exported BOM and CPL files to JLCPCB for SMT assembly, JLCPCB reports "there is no smd part on top side, please go back to re-upload files or choose to assemble the other side." The files exported from EasyEDA are designated as "Unicode Text (*.txt)" and are TAB delimited, but have the .csv file extension. JLCPCB accepts the file as valid initially but fails during the build process.

### Root Cause

"The files exported from EasyEDA are designated as 'Unicode Text (*.txt) and are TAB delimited, but have the .csv file extension. JLCPCB will accept this file type as valid, however once you continue with the build process, the JLCPCB website will fail." EasyEDA exports BOM files as Unicode Text with TAB delimiters but uses the .csv extension. JLCPCB's initial file validation accepts the .csv extension, but the actual file content (TAB-delimited Unicode) doesn't match the expected CSV format (comma-delimited ASCII), causing the build process to fail.

### Fix

1. **Save As CSV (Comma delimited) in Excel**:
   - "The solution is to export the BOM and CPL files as you normally would from EasyEDA"
   - "And store those to your local PC"
   - "Then, open the files in EXCEL and perform a 'Save As'"
   - "Making sure to select 'CSV (Comma delimited) (*.csv)' as the file type"
   - Open in Excel and Save As CSV

2. **Reduce BOM output columns**:
   - "I also find it necessary to reduce the output of the native BOM export"
   - "So it makes it easier to identify the parts that are actually going to be placed on the board"
   - "Since JLCPCB SMT services does not place certain parts"
   - Simplify the BOM to essential columns

3. **Use modified BOM format**:
   - "MODIFIED BOM Export: Name,Designator,Quantity,Manufacturer Part,Supplier Part"
   - Use a simplified BOM format
   - With only essential columns
   - For JLCPCB upload

4. **Verify file encoding**:
   - After saving as CSV in Excel
   - Verify the file encoding
   - Is ANSI or UTF-8
   - Not Unicode

5. **Check delimiter**:
   - After saving as CSV
   - Open in a text editor
   - Verify commas are used
   - Not tabs

6. **Remove non-assembled parts**:
   - Remove through-hole parts
   - And parts that JLCPCB doesn't place
   - From the BOM before upload
   - To avoid confusion

7. **Request EasyEDA to add format option**:
   - "It would be nice if the exports for BOM and CPL in EasyEDA"
   - "Had an option for which file type should be exported"
   - Request the feature on the EasyEDA forum
   - For proper CSV export

### Community Report

> "If you are having JLCPCB perform SMT services to build your PCB and place SMD parts on the board, the native exports of the BOM and the CPL files will not work. The files exported from EasyEDA are designated as 'Unicode Text (*.txt) and are TAB delimited, but have the .csv file extension. JLCPCB will accept this file type as valid, however once you continue with the build process, the JLCPCB website will fail with the error 'there is no smd part on top side.' The solution is to open the files in EXCEL and perform a 'Save As', making sure to select 'CSV (Comma delimited) (*.csv)' as the file type."

## 3. Component Rotation Mismatch Between EasyEDA and JLCPCB Placement Preview

### Symptom

Components appear correctly oriented in EasyEDA but show incorrect rotation in JLCPCB's placement preview. Some parts appear rotated 90° or 180° from their expected orientation. The issue occurs even with EasyEDA's native exports. Polarized components (electrolytic capacitors, diodes, ICs with pin 1 markers) are particularly affected. The rotation mismatch can cause assembly errors if not caught in the preview.

### Root Cause

"This is usually a rotation offset issue between the library footprint and JLCPCB's internal component definition." EasyEDA and JLCPCB define "0° rotation" differently for certain component packages. The footprint library in EasyEDA may use a different rotation reference than JLCPCB's internal component database. This offset causes components to appear correctly in EasyEDA but rotated in JLCPCB's preview.

### Fix

1. **Verify rotation in JLCPCB preview**:
   - "Use JLCPCB's Parts Placement Editor to rotate the component to the correct orientation"
   - "The preview is what you'll get"
   - Always check the JLCPCB placement preview
   - Before confirming the order

2. **Use Parts Placement Editor**:
   - "Click 'Review Parts Placement' in the quote step"
   - "Check each component's rotation and position"
   - "Use Parts Placement Editor to fix any issues"
   - "Pay special attention to polarized components"
   - Use the editor to correct rotations

3. **Check polarized components**:
   - "Pay special attention to polarized components"
   - Verify polarity markers
   - For capacitors, diodes, and ICs
   - In the JLCPCB preview

4. **Order small quantities first**:
   - "For new designs, order 5 boards with assembly"
   - "Before ordering 100"
   - "This catches any BOM/CPL issues"
   - "Before a large production run"
   - Test with a small batch first

5. **Verify footprint rotation in EasyEDA**:
   - Check the footprint definition
   - In EasyEDA's library editor
   - For correct rotation reference
   - Before exporting

6. **Use Basic parts from JLCPCB**:
   - "Prioritize Basic parts to minimize setup fees"
   - Basic parts are more likely
   - To have correct rotation data
   - In JLCPCB's database

7. **Document rotation offsets**:
   - If certain components
   - Consistently have rotation offsets
   - Document the offset
   - For future projects

### Community Report

> "My component shows correct in EasyEDA but wrong in JLCPCB's preview. This is usually a rotation offset issue between the library footprint and JLCPCB's internal component definition. Use JLCPCB's Parts Placement Editor to rotate the component to the correct orientation. The preview is what you'll get. Pay special attention to polarized components. For new designs, order 5 boards with assembly before ordering 100. This catches any BOM/CPL issues before a large production run."

## 4. Missing LCSC Part Numbers Causing Part Not Matched Warnings

### Symptom

When uploading BOM files to JLCPCB, some components show as "unmatched" during the part matching process. JLCPCB's system can't identify which parts to use for these components. The warning "Part not matched" appears for components without LCSC part numbers. The issue occurs when components are added without specifying LCSC part numbers in EasyEDA.

### Root Cause

"Including LCSC part numbers in your BOM is the single most important step for successful assembly. Without them, JLCPCB's system must guess which parts to use." LCSC (JLCPCB's component store) part numbers are the primary identifier that JLCPCB uses to match components. Without LCSC part numbers, JLCPCB's system tries to match based on manufacturer part numbers and descriptions, which may be ambiguous or have multiple matches.

### Fix

1. **Add LCSC part numbers to all components**:
   - "Including LCSC part numbers in your BOM"
   - "Is the single most important step for successful assembly"
   - "Without them, JLCPCB's system must guess which parts to use"
   - Add LCSC numbers in EasyEDA schematic

2. **Assign LCSC numbers in EasyEDA**:
   - "Open your schematic in EasyEDA"
   - "Click the BOM icon in the top toolbar"
   - "In the dialog, review the component list"
   - "And assign any missing LCSC part numbers"
   - Use the BOM dialog to assign numbers

3. **Check part availability in JLCPCB inventory**:
   - "Check that part is available in JLCPCB inventory"
   - Verify LCSC parts
   - Are in stock
   - Before placing the order

4. **Manually select correct part from suggestions**:
   - "Manually select correct part from suggestions"
   - If JLCPCB provides suggestions
   - For unmatched parts
   - Manually select the correct one

5. **Consider substituting with available parts**:
   - "Consider substituting with available Basic/Extended part"
   - If the exact part is not available
   - Substitute with an equivalent
   - From JLCPCB's inventory

6. **Remove DNP parts from BOM**:
   - "Remove DNP parts from both files"
   - Do Not Populate parts
   - Should be removed from
   - Both BOM and CPL files

7. **Update PCB from schematic before export**:
   - "Update PCB from schematic before exporting"
   - "Ensure both are synchronized"
   - Always update the PCB
   - From the schematic before exporting

### Community Report

> "Including LCSC part numbers in your BOM is the single most important step for successful assembly. Without them, JLCPCB's system must guess which parts to use. Add LCSC part numbers to guarantee matching. Check that part is available in JLCPCB inventory. Manually select correct part from suggestions. Consider substituting with available Basic/Extended part. Remove DNP parts from both files."

## 5. Gerber Drill Coordinate Format Precision Offset in CAM350

### Symptom

When viewing EasyEDA-exported Gerber files in CAM350 or other Gerber viewers, drill holes appear offset from their expected positions. The drill coordinates don't align with the copper pads. The issue is related to the drill coordinate format precision. The default export precision may not match what CAM350 expects.

### Root Cause

"When exporting Gerber, the default coordinate format precision for drilling files (integer bits: decimal bits) is 3:5 for mm and 2:6 for inch. If the size exceeds the range, it will automatically use the 4:2 format. If you find drilling offsets in viewing tools such as CAM350, you can adjust the drilling coordinate format (usually mm 3:3, inch 2:4)." The default drill coordinate precision (3:5 for mm) may not be correctly interpreted by CAM350, causing drill holes to appear offset. CAM350 typically expects 3:3 mm or 2:4 inch format.

### Fix

1. **Adjust drill coordinate format**:
   - "If you find drilling offsets in viewing tools such as CAM350"
   - "You can adjust the drilling coordinate format"
   - "(usually mm 3:3, inch 2:4)"
   - Change the drill format to 3:3 mm

2. **Use custom output for drill format**:
   - "You can also choose custom output when exporting"
   - "And set the format precision"
   - Use the custom export option
   - To set the correct precision

3. **Verify in Gerber Viewer before manufacturing**:
   - "Before sending the Gerber file to the manufacturer"
   - "Use the Gerber Viewer to double-check"
   - "That the Gerber meets the design requirements"
   - "And has no design flaws"
   - Always verify drill alignment

4. **Check drill alignment with copper pads**:
   - In the Gerber viewer
   - Zoom in on drill holes
   - And verify they align
   - With the center of copper pads

5. **Use mm 3:3 format for CAM350**:
   - Set the drill format to mm 3:3
   - For CAM350 compatibility
   - This is the most common format
   - Expected by Gerber viewers

6. **Verify with JLCPCB's Gerber Viewer**:
   - Upload to JLCPCB's online Gerber Viewer
   - To verify the drill alignment
   - JLCPCB's viewer may interpret
   - The format differently than CAM350

7. **Check coordinate origin**:
   - Verify the coordinate origin
   - Is consistent between
   - The drill file and copper layers
   - To prevent offsets

### Community Report

> "When exporting Gerber, the default coordinate format precision for drilling files (integer bits: decimal bits) is 3:5 for mm and 2:6 for inch. If the size exceeds the range, it will automatically use the 4:2 format. If you find drilling offsets in viewing tools such as CAM350, you can adjust the drilling coordinate format (usually mm 3:3, inch 2:4). You can also choose custom output when exporting and set the format precision. Before sending the Gerber file to the manufacturer, use the Gerber Viewer to double-check that the Gerber meets the design requirements."

## 6. Additional EasyEDA Issues

### BOM and CPL No Valid Content Found

**Issue**: "I get an error message saying: 'No valid content found.'"
**Fix**: Check the BOM and CPL file format. Ensure proper CSV formatting. Remove any special characters. Try the Excel Save As CSV workaround. Use JLCPCB's example files as template.

### Through-Hole Parts Not in CPL

**Issue**: "Through-hole parts may not export to CPL."
**Fix**: Manually add through-hole parts to the CPL file. Or exclude through-hole parts from SMT assembly. JLCPCB can place through-hole parts manually for an additional fee.

### Design Rule Check (DRC)

**Issue**: How to verify the PCB design before generating outputs.
**Fix**: "Go to Tools > Design Rule Check and start the DRC process. CircuitMaker will analyze the board against the rules you set earlier and generate a report. If the report lists any violations, review them carefully and fix them before moving on."

### Gerber Generated by Browser

**Issue**: "The generated Gerber is generated by the browser, so it must be downloaded through the browser's own download function, and cannot use any third-party downloader."
**Fix**: Use the browser's built-in download function. Don't use third-party download managers. They may corrupt the Gerber ZIP file.

### jlcpcb.json Configuration File

**Issue**: "jlcpcb.json: Gerber configuration file, is used only to store some additional order information."
**Fix**: The jlcpcb.json file stores order information like reinforcing plate positions. Don't delete it from the Gerber ZIP. It helps JLCPCB process the order correctly.

### 2D and 3D Preview Before Gerber Export

**Issue**: "Before generating a manufacturing file, be sure to do a 2D or 3D preview to check the Design Manager's DRC error entry."
**Fix**: Always run DRC before exporting Gerber. Use 2D and 3D preview to verify the design. Check for any DRC errors. Fix all errors before generating manufacturing files.

### Gerber Coordinate System

**Issue**: "The Gerber file follow the canvas coordinates."
**Fix**: Understand that Gerber coordinates follow the EasyEDA canvas. The origin is at the canvas origin. Verify the coordinate system matches the manufacturer's expectations.

## Best Practices

1. **Update to EasyEDA v6.3.41+** — fixes CSV double quote header issue
2. **Always Save As CSV (Comma delimited) in Excel** — fixes Unicode Text format
3. **Add LCSC part numbers to all components** — ensures JLCPCB part matching
4. **Verify rotations in JLCPCB placement preview** — catches rotation offsets
5. **Use mm 3:3 drill format for CAM350** — prevents drill coordinate offsets
6. **Order 5 boards first for new designs** — catches BOM/CPL issues before mass production
7. **Remove DNP and through-hole parts from BOM** — avoids assembly confusion
8. **Run DRC before exporting Gerber** — catches design errors before manufacturing
9. **Use browser's built-in download for Gerber** — third-party downloaders may corrupt files
10. **Prioritize Basic parts from JLCPCB** — minimizes setup fees and rotation issues
