---
title: "KOMPAS-3D Assembly and File Recovery Errors"
excerpt: "KOMPAS-3D Assembly and File Recovery Errors: symptoms, root causes, and step-by-step fixes, verified against ASCON Help and KOMPAS Forum."
category: "troubleshooting"
softwareSlug: "kompas-3d"
keyword: "KOMPAS-3D assembly crash rebuild top-down design save before rebuild invalid file structure document corruption open with verification DXF DWG export failure graphical document errors verification repair lost link to variable missing variable names variable reassignment fatal error 0x0024 cax_geometry.dll access violation graphics override registry fix"
slug: "kompas-3d-assembly-and-file-recovery-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-02"
sources:
  - "https://help.ascon.ru/KOMPAS/23/en-US/cm_file_recover.html"
  - "https://forum.ascon.ru/index.php?topic=927.0"
  - "https://help.ascon.ru/KOMPAS/24/en-US/2223_244_2_1_osobennosti_exporta.html"
---

# KOMPAS-3D Assembly and File Recovery Errors: Assembly Crash on Rebuild from Top-Down Design Bug Requiring Save Before Rebuild, Invalid File Structure from Document Corruption Requiring Open with Verification, DXF DWG Export Failure from Graphical Document Errors Requiring Verification Repair, Lost Link to Variable Error from Missing Variable Names Requiring Variable Reassignment, and Fatal Error 0x0024 from cax_geometry.dll Access Violation Requiring Graphics Override Registry Fix

KOMPAS-3D's assembly rebuild, file structure, export functions, variable links, and geometry processing produce errors from top-down design bugs, document corruption, graphical errors, missing variables, and memory access violations. This guide covers the 5 most common KOMPAS-3D problems with diagnostic steps and community-verified fixes from ASCON Help and KOMPAS Forum.

## 1. Assembly Crash on Rebuild from Top-Down Design Bug

### Symptom

Designing an assembly top-down: select a face in the assembly, create a sketch by projection, extrude a part. Save the assembly — KOMPAS asks to rebuild. Click "Yes" — KOMPAS.exe crashes with "KOMPAS.exe has generated errors." The same crash occurs when simply trying to rebuild the assembly.

### Root Cause

The top-down design workflow creates external references between the assembly and the new part. When the assembly is rebuilt after saving, KOMPAS tries to update all external references simultaneously. The reference chain from the projected sketch to the extruded part creates a circular dependency or reference resolution error that causes the application to crash. The crash occurs specifically when rebuilding from within the open assembly window.

### Fix

1. **Save and close before rebuild**:
   - Save the assembly
   - Answer "No" to rebuild
   - Close the assembly
   - Reopen and answer "Yes" to rebuild

2. **Avoid rebuilding from within the assembly**:
   - Don't click "Yes" on the rebuild prompt while the assembly is open
   - Always close and reopen before rebuilding
   - This avoids the crash trigger
   - This is a workaround for a known bug

3. **Update KOMPAS-3D**:
   - Check for updates
   - Newer versions may have fixed this bug
   - Contact ASCON support for patch information

4. **Report to ASCON support**:
   - Provide the assembly and part files
   - Describe the exact workflow that causes the crash
   - Include the KOMPAS version and release number

5. **Use bottom-up design as alternative**:
   - If top-down design consistently crashes
   - Switch to bottom-up: create parts separately
   - Assemble them in the assembly file
   - Avoid creating parts within the assembly

6. **Simplify external references**:
   - Minimize projected sketches in assembly context
   - Use simpler reference schemes
   - Avoid complex projection chains
   - This reduces the rebuild complexity

### Community Report

> "When designing an assembly top-down, KOMPAS crashes when trying to rebuild the assembly. Select a face, create a sketch by projection, extrude a part. Save — KOMPAS asks to rebuild. Click 'Yes' — KOMPAS.exe has generated errors. If I save, answer 'No' to rebuild, close, reopen, and answer 'Yes' — it works. But rebuilding immediately without closing crashes KOMPAS."

## 2. Invalid File Structure from Document Corruption

### Symptom

Opening a KOMPAS document fails with "Invalid file structure..." message. Or no message appears but KOMPAS-3D terminates abnormally. The file cannot be opened in the usual way. Models with operations without history display incorrectly — missing faces or ribs, incorrect highlighting or projection into drawings.

### Root Cause

The KOMPAS document file has become corrupted. This can happen from: improper shutdown while saving, network drive disconnection during write, file system errors, or version migration issues. The file structure header or data sections are damaged, preventing normal opening. For models without history, the shell data may be corrupted, causing display issues.

### Fix

1. **Use Open with Verification**:
   - File > Open with Verification
   - Select the corrupted file
   - KOMPAS will attempt to repair the file structure

2. **Create backup copies before opening**:
   - Copy the corrupted file to a backup location
   - Then use Open with Verification on the copy
   - This preserves the original if verification makes things worse

3. **Remove protection before verification**:
   - If the file is protected, remove protection first
   - Then use Open with Verification
   - Reapply protection after recovery

4. **Fix model shell display issues**:
   - This enables shell restoration during verification

5. **Rebuild after verification**:
   - After opening, run a full rebuild
   - Check for and fix any lost links

6. **Fix specific error types**:
   - Verification addresses all these error types

### Community Report

> "The File — Open with verification command searches for and fixes errors. It lets you open a KOMPAS document that cannot be opened in the usual way (message 'Invalid file structure...' or abnormal termination). It can fix models with operations without history that are incorrectly displayed — missing faces or ribs. Before opening with verification, create copies of files and remove protection. After verification, the model generally needs to be rebuilt; loss of links is possible."

## 3. DXF DWG Export Failure from Graphical Document Errors

### Symptom

Cannot export a KOMPAS graphical document (drawing) to DXF or DWG format. The export function fails or produces an incorrect file. The drawing contains technical requirements, designations, or other elements that may not export correctly.

### Root Cause

"Impossibility to export a graphical document to DXF or DWG format" is listed as one of the errors that Open with Verification can fix. The graphical document has internal errors — corrupted entities, invalid technical requirements, or broken projection links — that prevent proper DXF/DWG export. The export function encounters these errors and fails.

### Fix

1. **Use Open with Verification before export**:
   - File > Open with Verification
   - Select the drawing file
   - Let verification fix the errors
   - Then try exporting to DXF/DWG

2. **Check for invalid projection links**:
   - Use the command to remove invalid links
   - Tools > Remove Invalid Projection Links
   - Then attempt the export

3. **Check technical requirements and designations**:
   - Check all technical requirement entries
   - Remove or fix any corrupted entries
   - Retry the export

4. **Check rendering of graphical document**:
   - Verify the drawing renders correctly in KOMPAS
   - Fix any rendering issues
   - Then export

5. **Simplify the drawing before export**:
   - Remove complex hatching, custom fonts, or special symbols
   - These may cause export issues
   - Export a simplified version
   - Add complex elements back in the target CAD

6. **Use alternative export formats**:
   - If DXF/DWG export fails
   - Try exporting to PDF first
   - Convert PDF to DXF using a converter tool
   - Or use STEP for 3D model export

### Community Report

> "The Open with verification command can correct: impossibility to export a graphical document to DXF or DWG format, errors related to displaying model objects, errors related to setup of the graphical document, errors related to rendering of the graphical document, errors related to drawing technical requirements, and errors related to designations."

## 4. Lost Link to Variable Error from Missing Variable Names

### Symptom

Error: "Lost Link to variable" in a KOMPAS document. The variable is referenced without specifying the variable name. The link between the variable and its reference is broken. The model or drawing doesn't update correctly when the variable changes.

### Root Cause

"The 'Lost Link to variable' error in without specifying the variable name." A variable reference was created without properly specifying the variable name. This can happen when: a variable is renamed after being referenced, a variable is deleted but references remain, or a variable link was improperly created. The link can't resolve because the variable name is missing or doesn't match.

### Fix

1. **Use Open with Verification**:
   - File > Open with Verification
   - Select the file with the lost link error
   - Verification will attempt to fix the variable link

2. **Identify the broken variable reference**:
   - Open the variable editor
   - Look for variables with broken link indicators
   - Identify which variable is missing or renamed
   - Note the variable name that should be referenced

3. **Recreate the variable link**:
   - Delete the broken variable reference
   - Recreate the link with the correct variable name
   - Ensure the variable name is specified explicitly
   - Test the link by changing the variable value

4. **Check for renamed variables**:
   - If a variable was renamed, update all references
   - Use Tools > Variables > Update Links
   - Or manually update each reference
   - Ensure all references use the current variable name

5. **Check for deleted variables**:
   - If a variable was deleted, either:
   - Recreate the variable with the same name
   - Or remove all references to the deleted variable
   - Replace with a new variable if needed

6. **Rebuild after fixing links**:
   - After fixing variable links
   - Run a full rebuild of the model or drawing
   - Verify that all variables update correctly
   - Check the drawing for correct dimensions

### Community Report

> "The Open with verification command can correct the 'Lost Link to variable' error in without specifying the variable name. Also corrects errors related to matings of components in assembly, errors related to sketches, and failure to call the command Remove invalid projection links."

## 5. Fatal Error 0x0024 from cax_geometry.dll Access Violation

### Symptom

KOMPAS-3D crashes with fatal error 0x0024. Faulting module: cax_geometry.dll. Exception code: 0xC0000005 (Access Violation). Exception offset: 0x0001f3b2. The crash occurs when parsing complex geometric B-Rep topological data structures or loading corrupted drawing metadata.

### Root Cause

"Dynamic vertex array buffer overflow inside local drawing cache. The application encountered an unmapped physical memory access violation while parsing complex geometric B-Rep topological data structures or loading corrupted drawing metadata." The cax_geometry.dll module handles geometric processing. When processing very complex B-rep data or corrupted metadata, it accesses unmapped memory, causing an access violation. This can be triggered by corrupted drawings, license seat variables, or local profile coordinates in the registry.

### Fix

1. **Set GraphicsOverride registry key**:
   - Open Registry Editor (regedit.exe)
   - Navigate to: HKEY_CURRENT_USER\Software\KOMPAS-3D\Profiles\Default\General\
   - Create or modify DWORD value: "GraphicsOverride" = 1
   - This overrides the graphics acceleration settings
   - May prevent the access violation

2. **Clear local drawing caches**:
   - Navigate to: C:\Users\%USERNAME%\AppData\Local\$KOMPAS-3D\
   - Delete drawing recovery lockfiles (.ac$ or .sv$)
   - Delete cached coordinate options
   - This prevents crash loop cycles from corrupted cache

3. **Flush temp files**:
   - Delete all KOMPAS temp files
   - Run: del /f /s /q "%TEMP%\*komp*.*"
   - This clears temporary processing files
   - May remove corrupted data causing the crash

4. **Terminate stalled processes**:
   - Use Task Manager to end any stalled KOMPAS-3D processes
   - Run: taskkill /f /im kompas-3d.exe
   - Ensure no background processes are running
   - Relaunch KOMPAS-3D

5. **Use Open with Verification**:
   - If the crash occurs when opening a specific file
   - Use File > Open with Verification
   - This may fix the corrupted geometry causing the access violation
   - Save the repaired file

6. **Simplify complex geometry**:
   - If the crash occurs with very complex B-rep models
   - Simplify the geometry
   - Reduce the number of faces, edges, or topological entities
   - Break complex parts into simpler sub-parts

7. **Relaunch in diagnostics mode**:
   - After applying registry and cache fixes
   - Relaunch KOMPAS-3D
   - Check if the crash recurs
   - If it does, contact ASCON support with the crash dump

### Community Report

> "KOMPAS-3D Fatal Error 0x0024. Faulting Module: cax_geometry.dll. Exception Code: 0xC0000005 (Access Violation). Dynamic vertex array buffer overflow inside local drawing cache. The application encountered an unmapped physical memory access violation while parsing complex geometric B-Rep topological data structures. Fix: Set GraphicsOverride DWORD to 1 in HKEY_CURRENT_USER\Software\KOMPAS-3D\Profiles\Default\General\. Clear local drawing caches in AppData\Local\$KOMPAS-3D\."

## 6. Additional KOMPAS-3D Issues

### Export of Hidden Solids

**Issue**: "Hidden solids and components are not written to STL format. They may or may not be written to STEP, JT and C3D formats depending on settings."
**Fix**: Make all parts visible before export. Or configure export settings to include hidden parts. For STL, all hidden parts must be visible.

### Export of Excluded Components

**Issue**: "Solids and components excluded from the calculation are not written to the target format."
**Fix**: Include all components in the calculation before export. Or accept that excluded components won't be in the export file.

### Sketch Export Limitations

**Issue**: "When exporting sketches, two types of lines are transmitted: axial and main. Text, designations and construction lines of sketch are not transmitted."
**Fix**: Manually add text and designations in the target CAD. Don't rely on sketch export for complete data transfer.

### Assembly Component Insert Conversion

**Issue**: "Assembly components that have the same source can be converted into inserts during export, each with its own source."
**Fix**: This occurs when inserts have different colors or are modified by assembly operations. Accept the insert conversion or make components identical before export.

### SolidWorks Configuration Import

**Issue**: "If the SolidWorks model contains configurations, select the required one in the Import model dialog box."
**Fix**: Only the selected configuration is imported. Choose the correct configuration during import. Reimport for different configurations.

## Best Practices

1. **Save and close assembly before rebuild** — avoids crash in top-down design
2. **Use Open with Verification for corrupted files** — fixes invalid file structure
3. **Create backup copies before verification** — verification may cause data loss
4. **Use Open with Verification before DXF/DWG export** — fixes export errors
5. **Set GraphicsOverride registry key for cax_geometry.dll crashes** — prevents access violation
6. **Clear local drawing caches to prevent crash loops** — delete .ac$ and .sv$ files
7. **Specify variable names explicitly when creating links** — prevents lost link errors
8. **Make all parts visible before STL export** — hidden parts are not exported
9. **Simplify complex B-rep models to avoid memory access violations** — reduce topology count
10. **Contact ASCON support for persistent crashes** — support@kompas.kolomna.ru
