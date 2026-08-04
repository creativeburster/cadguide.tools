---
title: "AVEVA E3D Design GUI Recovery After Crash with Unsaved Database Elements, PML unset(!A) Crash from Missing PMLVAR Support, IFC Property Import Failure, DGN Import Unexpected End of File and Insufficient Memory, and MultiCAD NWD Import Scale and Performance from Large Models: Session Recovery, 3.1.10 Fix, Property Set Mapping, BucketSize Option, and Model Simplification"
excerpt: "AVEVA E3D Design fails for 5 distinct reasons: GUI recovery after crash with unsaved DB elements requiring session recovery, PML unset(!A) crash from missing PMLVAR support requiring 3.1.10 fix, IFC property import failure from unmapped property sets requiring 3.1.10 fix, DGN import unexpected end of file and insufficient memory requiring file verification, and MultiCAD NWD import incorrect scale and performance from large models requiring BucketSize option and model simplification. We cover each with fixes from AVEVA documentation."
category: "troubleshooting"
softwareSlug: "aveva-e3d-design"
keyword: "AVEVA E3D Design GUI recovery crash unsaved database PML unset PMLVAR IFC property import DGN unexpected end of file insufficient memory MultiCAD NWD import scale BucketSize model simplification session recovery 3.1.10 fix"
slug: "aveva-e3d-design-gui-recovery-crash-unsaved-database-pml-unset-pmlvar-ifc-property-import-dgn-unexpected-end-of-file-insufficient-memory-multicad-nwd-import-scale-bucketsize-model"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://docs.aveva.com/bundle/e3d-design/page/909529.html"
  - "https://koulakengineering.com/aveva-e3d-design-3-1-10-known-issue-fixes/"
  - "https://docs.aveva.com/bundle/e3d-design/page/938070.html"
---

# AVEVA E3D Design GUI Recovery After Crash with Unsaved Database Elements, PML unset(!A) Crash from Missing PMLVAR Support, IFC Property Import Failure, DGN Import Unexpected End of File and Insufficient Memory, and MultiCAD NWD Import Scale and Performance from Large Models: Session Recovery, 3.1.10 Fix, Property Set Mapping, BucketSize Option, and Model Simplification

AVEVA E3D Design produces errors from GUI recovery failures, PML crashes, IFC import issues, DGN import errors, and MultiCAD NWD import problems. This guide covers the 5 most common E3D Design problems with diagnostic steps and community-verified fixes from AVEVA documentation.

## 1. GUI Recovery After Crash with Unsaved Database Elements

### Symptom

After AVEVA E3D Design crashes, the GUI windows fail to initialize properly on relaunch. Error messages appear in the Command Window: "Db Source - undefined reference", "RefDatumByName - Reference Datum does not exist", "Load failed: Method xxx not found". The IFC Export window and other windows can't access elements that were created before the crash but never saved to the database.

### Root Cause

"AVEVA E3D Design might crash completely without saving elements to the Database (DB). Upon relaunch, the window tries to access elements that have been created before the crash." When E3D crashes, any elements created since the last savework are lost — they were in memory but never written to the DB. On relaunch, the GUI windows try to reference these lost elements, producing "undefined reference" errors. The "Load failed: Method xxx not found" error occurs when settings files reference functions from a previous session that no longer exist.

### Fix

1. **Understand that unsaved elements are lost**:
   - "These elements no longer exist"
   - "When AVEVA E3D Design is relaunched, these elements no longer exist"
   - Any elements created after the last savework
   - Are permanently lost after a crash

2. **Recreate lost Reference Datums**:
   - "A Reference Datum might have been created and used for a failed export"
   - "The System cannot use that, and then refers to the default Reference Datum, IFCGLOBAL"
   - "The Reference Datum must be created again"
   - Recreate any lost Reference Datums

3. **Don't worry about IFCGLOBAL**:
   - "If IFCGLOBAL has not been saved before crashing, the message is displayed"
   - "In this case, no action is required"
   - "As the default Reference Datum, IFCGLOBAL, is created automatically"
   - IFCGLOBAL is auto-created on relaunch

4. **Remove stale settings files**:
   - "This error might occur when trying to use a settings file"
   - "Which refers to functions that no longer exist"
   - "The System might need alternative information before export"
   - Delete or recreate stale settings files

5. **Save work frequently**:
   - "When a savework is made a new session will be created on the database"
   - "The changed data will always be written to the end of the file"
   - Use savework frequently
   - To minimize data loss from crashes

6. **Use Getwork to see latest changes**:
   - "If you do want to see the changes made by others then you must do a 'Getwork'"
   - "'Getwork' will always reposition you to view the latest session"
   - Use Getwork after relaunch
   - To see the latest saved state

7. **Check session history**:
   - "Internally there is a linked list between sessions"
   - "Once a session is written, it will never be changed"
   - Check the session history
   - To identify which session to recover from

### Community Report

> "AVEVA E3D Design might crash completely without saving elements to the Database (DB). Upon relaunch, the window tries to access elements that have been created before the crash. Messages are displayed in the Command Window: Db Source - undefined reference, RefDatumByName - Reference Datum does not exist, Load failed: Method xxx not found. When AVEVA E3D Design is relaunched, these elements no longer exist. The Reference Datum must be created again. No action is required for IFCGLOBAL as it is created automatically."

## 2. PML unset(!A) Crash from Missing PMLVAR Support

### Symptom

E3D Design crashes when running PML code that uses the `unset(!A)` command. The crash is an unhandled exception with no recovery option. The PML code worked in previous versions but crashes in the current version. The crash occurs specifically when the `unset` command is used with array variables.

### Root Cause

"Issue About q unset(!A) will cause E3D Crash. Resolution: Fixed – Added missing support for PMLVAR." The PML interpreter in E3D Design 3.1.x had a missing implementation for the PMLVAR type in the `unset` command. When `unset(!A)` is called with a variable of type PMLVAR, the interpreter encounters an unhandled case, causing the application to crash. This was fixed in E3D Design 3.1.10.

### Fix

1. **Update to E3D Design 3.1.10 or later**:
   - "Issue About q unset(!A) will cause E3D Crash"
   - "Resolution: Fixed – Added missing support for PMLVAR"
   - Install the latest version
   - That includes the PMLVAR fix

2. **Avoid unset with PMLVAR variables**:
   - If you can't update immediately
   - Avoid using `unset(!A)` with PMLVAR type variables
   - Use alternative methods to clear variables
   - Such as assigning empty values

3. **Use alternative variable clearing**:
   - Instead of `unset(!A)`
   - Use `!A = !!null()` or `!A = ''`
   - To clear variable contents
   - Without triggering the crash

4. **Check PML code for unset usage**:
   - Review all PML macros and functions
   - For `unset` command usage
   - Replace with alternatives
   - Until the update is installed

5. **Report PML crashes to AVEVA support**:
   - If the crash persists after updating
   - Report to AVEVA Customer Support
   - Provide the PML code that triggers the crash
   - And the exact error message

6. **Use PML error handling**:
   - Add error handling around `unset` calls
   - Use `!!error` checking
   - To gracefully handle any PML errors
   - Without crashing the application

7. **Test PML macros after update**:
   - After installing 3.1.10
   - Test all PML macros that use `unset`
   - Verify they work correctly
   - With PMLVAR variables

### Community Report

> "E3D Design: Issue About q unset(!A) will cause E3D Crash. Resolution: Fixed – Added missing support for PMLVAR. E3D Design 3.1.10 Known Issues & Fixes."

## 3. IFC Property Import Failure

### Symptom

When importing IFC files into E3D Design, property sets are not imported correctly. Some properties are missing or have incorrect values. The IFC file contains valid property sets that are recognized by other IFC viewers. The import completes without error messages, but the properties are not available in E3D.

### Root Cause

"Issue with IFC property import in E3D. Resolution: Fixed – identified property sets are successfully imported." E3D Design 3.1.x had a bug in the IFC import module that failed to properly parse and import certain property sets. The import routine didn't correctly map IFC property sets to E3D's internal property structure, causing properties to be silently dropped. This was fixed in E3D Design 3.1.10.

### Fix

1. **Update to E3D Design 3.1.10 or later**:
   - "Issue with IFC property import in E3D"
   - "Resolution: Fixed – identified property sets are successfully imported"
   - Install the latest version
   - That includes the IFC import fix

2. **Verify IFC file compliance**:
   - Check the IFC file with an IFC validator
   - Ensure property sets are properly defined
   - In the IFC file
   - Use IFC validators like IfcDoc or buildingSMART validators

3. **Check property set mapping**:
   - E3D maps IFC property sets
   - To internal properties
   - Verify the mapping configuration
   - In the import settings

4. **Use standard IFC property sets**:
   - Use standard buildingSMART property sets
   - Such as Pset_ManufacturerTypeInformation
   - That are more likely to be recognized
   - By E3D's import routine

5. **Import properties manually**:
   - If automatic import fails
   - Extract properties from the IFC file
   - Using a text editor or IFC tool
   - And add them manually in E3D

6. **Check import log for warnings**:
   - "Open User Messages to see descriptive messages for each import failure"
   - Check the User Messages window
   - For import warnings or errors
   - That indicate missing properties

7. **Report missing properties to AVEVA**:
   - If specific property sets are still not imported
   - After updating to 3.1.10
   - Report to AVEVA support
   - With the IFC file and expected properties

### Community Report

> "E3D Design: Issue with IFC property import in E3D. Resolution: Fixed – identified property sets are successfully imported. During the import, the software will check each row to ensure that it can be imported correctly and that resultant model and connections will be valid. If problems are detected, warning messages will be displayed."

## 4. DGN Import Unexpected End of File and Insufficient Memory

### Symptom

When importing DGN files into E3D Design, errors occur: "Unexpected End of File was found", "Unexpected record for a complex shape hole", "Cannot open file", "The read from the file failed error 'n'", "Insufficient memory space", "Pointer was not found in buffer store". The import stops after the first error. The DGN file may be large or complex.

### Root Cause

"The program stops processing after an error is reported." DGN import errors can come from multiple sources: corrupted DGN files (unexpected end of file), incompatible DGN format (unexpected record), file access issues (cannot open file), insufficient memory for large files, and internal buffer management issues. "Not all the allocated memory has been cleared" indicates a memory management bug in the import routine. Large or complex DGN files can exceed E3D's memory limits.

### Fix

1. **Verify DGN file integrity**:
   - "Unexpected End of File was found"
   - Check the DGN file for corruption
   - Try opening it in MicroStation or other DGN viewer
   - To verify it's not corrupted

2. **Check file accessibility**:
   - "Cannot open file"
   - Ensure the file is accessible
   - Check file permissions
   - And that the file is not locked by another process

3. **Simplify the DGN file**:
   - "Insufficient memory space"
   - If the file is too large
   - Simplify it in MicroStation
   - Remove unnecessary elements or reduce complexity

4. **Use AVEVA Model Simplification**:
   - "Where possible, we recommend using simpler versions of the original CAD model"
   - "Either with export options in the original system"
   - "Or trying AVEVA Model Simplification"
   - To reduce model complexity before import

5. **Contact AVEVA Customer Support for specific errors**:
   - "If the following errors occur, contact the AVEVA Customer Support desk"
   - "Not all the allocated memory has been cleared"
   - "Insufficient memory space"
   - "Pointer was not found in buffer store"
   - These indicate internal bugs

6. **Check DGN format compatibility**:
   - "Unexpected record for a complex shape hole"
   - The DGN file may use features
   - Not supported by E3D's import
   - Try saving in a different DGN version

7. **Close other applications**:
   - "Insufficient memory space"
   - Close other applications
   - To free up memory for the import
   - And restart E3D before importing

### Community Report

> "The section lists errors that can occur when running Import-DGN. The program stops processing after an error is reported. Unexpected End of File was found. Unexpected record for a complex shape hole. Cannot open file. Insufficient memory space. Pointer was not found in buffer store. If the following errors occur, contact the AVEVA Customer Support desk."

## 5. MultiCAD NWD Import Scale and Performance from Large Models

### Symptom

When importing NWD (Navisworks) files using MultiCAD, the imported model has incorrect scale — it appears too large or too small. Large NWD models are very slow to work with after import. The import may fail for very complicated models. The model exceeds E3D's internal resource limits.

### Root Cause

"MultiCAD has been changed to assume that a STL file is defined in millimetres, which is common but not universal." For NWD files, the scale issue comes from unit assumptions in the MultiCAD import. For performance, "this is a large and complicated model and it is important to use the 'Limit no. of import elements per level' option." Large NWD models contain thousands of elements that overwhelm E3D's graphics and memory systems, making the model very slow to navigate and edit. "Unified Engineering is better for large models than E3D Design 3.1 series, as it can use more memory (as a 64-bit process)."

### Fix

1. **Use BucketSize option for large models**:
   - "It is important to use the 'Limit no. of import elements per level' option"
   - "In the IMP command the option is for example 'Bucketsize 300'"
   - Use the BucketSize option
   - To limit elements per level

2. **Use AVEVA Model Simplification**:
   - "We recommend using simpler versions of the original CAD model"
   - "Either with export options in the original system"
   - "Or trying AVEVA Model Simplification"
   - Simplify the model before importing

3. **Use Unified Engineering for large models**:
   - "Unified Engineering is better for large models that E3D Design 3.1 series"
   - "As it can use more memory (as a 64-bit process)"
   - For very large models
   - Use Unified Engineering instead of E3D Design 3.1

4. **Fix STL scale with SCALE command**:
   - "MultiCAD has been changed to assume that a STL file is defined in millimetres"
   - "The workaround for non-millimetre files is to use a SCALE and command line input"
   - For non-mm STL files
   - Use the SCALE command after import

5. **Export simpler versions from original system**:
   - "Where possible, we recommend using simpler versions of the original CAD model"
   - "Either with export options in the original system"
   - Use export options in Navisworks
   - To reduce model complexity

6. **Be aware of internal resource limits**:
   - "Both E3D Design 3.1 series and Unified Engineering can occasionally fail"
   - "With very complicated models which can exceed various internal resource limits"
   - Very complex models may exceed limits
   - In both E3D Design and Unified Engineering

7. **Monitor performance after import**:
   - "Complex imported models such as this are always relatively slow to work with"
   - After import, monitor performance
   - If the model is too slow
   - Consider simplifying further

### Community Report

> "Import NWD using MultiCAD. Note that this is a large and complicated model and it is important to use the 'Limit no. of import elements per level' option (in the IMP command the option is for example 'Bucketsize 300'). Complex imported models such as this are always relatively slow to work with. Unified Engineering is better for large models that E3D Design 3.1 series, as it can use more memory. We recommend using simpler versions of the original CAD model, either with export options in the original system, or trying AVEVA Model Simplification."

## 6. Additional AVEVA E3D Design Issues

### Adding Additional Folder Crashes

**Issue**: "Error message on adding additional folder structure to VA_DESIGN_USER."
**Fix**: Update to E3D Design 3.1.10 or later. "Adding additional folder and crashes – unhandled no longer presented."

### HrefQualifier TrefQualifier Connection Issues

**Issue**: "If an HrefQualifier or TrefQualifier refers to an end that is already connected, then the import will not be able to establish a connection."
**Fix**: "Imports will not overwrite existing connections." Check for existing connections before importing. Remove existing connections if the import needs to establish new ones.

### Session Management

**Issue**: Understanding sessions and savework/getwork.
**Fix**: "When a savework is made a new session will be created on the database. The changed data will always be written to the end of the file. This represents the 'delta' from the previous session. Once a session is written, it will never be changed. If you do want to see the changes made by others then you must do a 'Getwork'."

### IFC Export Window Recovery

**Issue**: "On startup, the IFC Export window searches for the default .expsav file."
**Fix**: "If one is not found, the System default values are used. If it is found, the fields on the IFC Export window are set accordingly." The .expsav file stores IFC export settings. If it's corrupted, delete it to use system defaults.

### Import Warning Messages

**Issue**: "If problems are detected, warning messages will be displayed on screen, one by one, as each is found."
**Fix**: "Open User Messages to see descriptive messages for each import failure." Review all warning messages in the User Messages window. Each message indicates a specific import issue that needs attention.

### Error While Closing File

**Issue**: "Error while closing … file (may be incomplete):"
**Fix**: This indicates the import didn't complete. The file may be incomplete or corrupted. Try re-importing after fixing the source file. Check available disk space.

## Best Practices

1. **Save work frequently with savework** — minimizes data loss from crashes
2. **Update to E3D Design 3.1.10+** — fixes PML unset, IFC import, and folder crashes
3. **Use BucketSize option for large NWD imports** — limits elements per level
4. **Use AVEVA Model Simplification for complex models** — prevents performance issues
5. **Use Unified Engineering for very large models** — 64-bit memory access
6. **Verify DGN file integrity before import** — prevents unexpected end of file errors
7. **Check User Messages for import warnings** — identifies all import failures
8. **Use SCALE command for non-mm STL files** — fixes incorrect scale after import
9. **Don't rely on unsaved elements after crash** — they are permanently lost
10. **Use Getwork to see latest changes by others** — always repositions to latest session
