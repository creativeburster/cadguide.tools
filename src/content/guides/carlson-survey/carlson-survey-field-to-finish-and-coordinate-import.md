---
title: "Carlson Survey Field-to-Finish and Coordinate Import"
excerpt: "Carlson Survey Field-to-Finish and Coordinate Import: symptoms, root causes, and step-by-step fixes, verified against Carlson Software forums."
category: "workflow"
softwareSlug: "carlson-survey"
keyword: "Carlson Survey Field to Finish point node wrong layer undefined code description truncation C&G CRD fixed length lat long scale NAD83 coordinate file empty data collector C&G Numeric Carlson Numeric field code conversion"
slug: "carlson-survey-field-to-finish-and-coordinate-import"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# Carlson Survey Field-to-Finish and Coordinate Import: Point Node on Wrong Layer from Undefined F2F Codes, Description Truncation from C&G CRD Fixed Length, Lat/Long Scale Factor from NAD83 Import, Coordinate File Empty on Data Collector from Wrong Format, and Field Code Conversion for Client Requirements

Carlson Survey's Field-to-Finish (F2F) automates linework, symbols, and labeling from field codes, but configuration errors produce misplaced point nodes, truncated descriptions, wrong coordinate scaling, and empty data collector transfers. This guide covers the 5 most common F2F and coordinate import problems with diagnostic steps and community-verified fixes from Carlson Software forums.

## 1. Point Node on Wrong Layer from Undefined F2F Codes

### Symptom

When importing an ASCII file with Field-to-Finish, the linework and point description appear on the correct layer, but the point node is on a different (wrong) layer. This happens when transitioning from Civil 3D to Carlson.

### Root Cause

The field codes in the .fld file are not fully defined. Undefined codes tend to come in with "wonky" point nodes — the nodes don't follow the layer assignment rules because the code doesn't have explicit node layer settings.

### Fix

1. **Define all codes in the .fld file** — ensure every field code used by the field crew has a corresponding entry in the Field-to-Finish code set
2. **Check point options settings** — under Settings, verify how point options are set to use point blocks
3. **Use the Point Erase and Draw/Locate Points workflow**:
   - Run Field-to-Finish to import all points, lines, and symbols
   - Do a **Point Erase**: command → `N` for number → `ALL` → DO NOT erase points from coordinate file → Yes to final question
   - Now all lines and symbols remain, but point nodes are removed
   - Run **Draw/Locate Points** → select **Draw All**
   - Points are redrawn with correct node placement on correct layers

4. **Verify point descriptor settings** in the .fld file — each code should have:
   - Layer assignment for the point node
   - Layer assignment for the linework
   - Symbol definition
   - Labeling format

## 2. Point Description Truncation from C&G CRD Fixed Length

### Symptom

When importing a CSV of field points into Carlson, point descriptions are shortened. The full description is in the CSV (e.g., "SAWED OFF UPOLE RMNS") but Carlson truncates it.

### Root Cause

The coordinate file format being used (C&G CRD) has a **fixed description length**. Descriptions longer than the fixed length are automatically truncated.

### Fix

1. **Check coordinate file format**:
   - Use **Coordinate File Utilities** to see the current coordinate file and format
   - The C&G point manager (command `cg_pt_mngr`) displays the file format and description length

2. **Change the description length**:
   - Open C&G Point Manager: `cg_pt_mngr`
   - Change the description length to accommodate longer descriptions
   - Re-import the CSV file

3. **Switch to Carlson Numeric format** — Carlson's native format doesn't have the same fixed-length limitation:
   - Coordinate File Utilities → Change Format → Carlson Numeric

4. **Check Text File Import settings** — a fixed format configured for Text File Import can also cause truncation:
   - Verify import settings match the CSV format
   - Ensure description field width is sufficient

## 3. Lat/Long Scale Factor from NAD83 Import

### Symptom

Importing points from a text file with lat/long coordinates (NAD83(2011) from MnCors) results in points at the wrong scale — they are very tiny with the annotation being huge. Changing the scale setting doesn't fix the issue.

### Root Cause

Lat/long coordinates are in geographic coordinates (degrees), not projected coordinates (feet/meters). Carlson is treating the degree values as drawing units, making the points extremely close together relative to the annotation size. The scale setting affects annotation, not the coordinate values.

### Fix

1. **Convert lat/long to state plane coordinates** before importing:
   - Use Carlson's coordinate conversion tools
   - Or use an online NGS tool to convert NAD83 lat/long to state plane coordinates
   - Import the converted state plane coordinates instead

2. **Set the coordinate system in Carlson**:
   - Configure the drawing's coordinate system to match the NAD83(2011) datum
   - Use the appropriate state plane zone (e.g., Minnesota South)
   - Carlson will then project the lat/long coordinates correctly

3. **Check the import format** — ensure the text file import is set to recognize lat/long format, not northing/easting

4. **Verify datum and epoch** — NAD83(2011) is a specific realization; ensure the coordinate system settings match exactly

## 4. Coordinate File Empty on Data Collector Transfer

### Symptom

Field crews arrive at the site and their coordinate file is empty. During transfer from PC to data collector, all points in the coordinate file get erased. This only happens with coordinate files created on one specific computer — files from other computers transfer correctly.

### Root Cause

The coordinate file format on the problematic computer is set to **C&G Numeric** instead of **Carlson Numeric**. The data collector expects Carlson Numeric format, and the C&G Numeric format is either incompatible or transfers incorrectly.

### Fix

1. **Check coordinate file format on the problematic computer**:
   - Open Coordinate File Utilities
   - Check the current format — if it says "C&G Numeric", that's the problem

2. **Change to Carlson Numeric format**:
   - Coordinate File Utilities → Change Format → Carlson Numeric
   - Re-save the coordinate file in Carlson Numeric format
   - Transfer to data collector — points should now transfer correctly

3. **Check SurvCom settings** — if using SurvCom for data transfer:
   - Verify the data collector path is correct
   - The specific computer may be sending data to a different file on the data collector
   - Check ActiveSync connection settings

4. **Standardize coordinate file format across all computers** — ensure all office computers use Carlson Numeric format to prevent format mismatch issues

## 5. Field Code Conversion for Client Requirements

### Symptom

A client requires new field coding requirements for an existing large topographic project. The existing F2F is extensive with individual numeric codes for Power pole, Deadman, Drop, etc. The client's codes are different (e.g., "Power symbols"). There is no built-in tool to translate between code sets without manually changing every point's code.

### Root Cause

Carlson doesn't have a direct "code mapping" or "code translation" tool similar to MicroStation's level-to-level mapping. Field codes are stored as point descriptions, and changing them requires either manual editing or a custom script.

### Workaround

1. **Export points to CSV**:
   - Export all points with their current descriptions to a CSV file
   - Open in Excel or a text editor

2. **Use Excel find-and-replace or VLOOKUP**:
   - Create a translation table: old code → new code
   - Use VLOOKUP or find-and-replace to convert all codes
   - Save the modified CSV

3. **Re-import the modified CSV**:
   - Import the CSV with converted codes back into Carlson
   - Run F2F with the client's code set

4. **Create a second .fld file** for the client's coding system:
   - Maintain both the original and client code sets
   - Switch between .fld files depending on which client the project is for

5. **Request a code mapping feature** from Carlson development — this is a commonly requested feature on the Carlson forum

## 6. Additional Carlson Survey Issues

### Point Description Not Listed Fully

**Issue**: CSV import truncates descriptions (see Section 2).
**Fix**: Change coordinate file format from C&G CRD to Carlson Numeric, or increase description length in C&G Point Manager.

### Problem Scaling Points

**Issue**: Points import at wrong scale (see Section 3).
**Fix**: Convert lat/long to state plane coordinates before import, or set coordinate system in Carlson.

### Coordinate File Empty on Transfer

**Issue**: Data collector receives empty file (see Section 4).
**Fix**: Change coordinate file format to Carlson Numeric on the problematic computer.

## Best Practices

1. **Define all field codes in the .fld file** — undefined codes cause misplaced point nodes
2. **Use Point Erase + Draw/Locate Points** to fix node placement after F2F import
3. **Use Carlson Numeric format** for coordinate files — avoids C&G CRD truncation and transfer issues
4. **Check description length** in C&G Point Manager if using C&G format
5. **Convert lat/long to state plane** before importing — don't import raw geographic coordinates
6. **Set coordinate system in Carlson** to match the survey datum (NAD83(2011), etc.)
7. **Standardize coordinate file format** across all office computers
8. **Maintain multiple .fld files** for different client coding systems
9. **Use Excel for bulk code conversion** — export, translate, re-import
10. **Check SurvCom data collector path** if transfer produces empty files
