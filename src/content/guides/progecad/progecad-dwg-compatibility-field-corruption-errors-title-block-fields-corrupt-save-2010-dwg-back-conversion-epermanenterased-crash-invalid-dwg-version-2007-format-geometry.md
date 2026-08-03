---
title: "progeCAD DWG Compatibility and Field Corruption Errors: Title Block Fields Corrupt After Save from 2010 DWG Back-Conversion Requiring Pre-Save in AutoCAD 2010, ePermanentlyErased Crash Opening progeCAD DWGs in AutoCAD from XREF Issues Requiring Audit and Recover, Invalid DWG Version Error from 2007 Format Save Requiring 2004 Format Save, DWG Geometry Misalignment in AutoCAD Map 3D from Translation Loss Requiring DWG Audit, and progeCAD Drawings Not Opening in Older AutoCAD from Version Mismatch Requiring Save As Correct Version"
excerpt: "progeCAD fails for 5 distinct reasons: title block fields corrupt after save from 2010 DWG back-conversion requiring pre-save in AutoCAD 2010, ePermanentlyErased crash opening progeCAD DWGs in AutoCAD from XREF issues requiring audit and recover, invalid DWG version error from 2007 format save requiring 2004 format save, DWG geometry misalignment in AutoCAD Map 3D from translation loss requiring DWG audit, and progeCAD drawings not opening in older AutoCAD from version mismatch requiring save as correct version. We cover each with fixes from CADDIT Forum and Autodesk Community."
category: "dwg-compatibility-and-field-corruption-errors"
softwareSlug: "progecad"
keyword: "progeCAD title block fields corrupt save 2010 DWG back-conversion pre-save AutoCAD ePermanentlyErased crash opening progeCAD DWG XREF audit recover invalid DWG version 2007 format save 2004 format geometry misalignment AutoCAD Map 3D translation loss DWG audit drawings not opening older AutoCAD version mismatch save as correct version"
slug: "progecad-dwg-compatibility-field-corruption-errors-title-block-fields-corrupt-save-2010-dwg-back-conversion-epermanenterased-crash-invalid-dwg-version-2007-format-geometry"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://www.caddit.net/forum.21/viewtopic.php?t=687"
  - "https://www.caddit.net/forum.21/viewtopic.php?t=55"
  - "https://forums.autodesk.com/t5/autocad-map-3d-ideas/progecad-dwg-compatibility-problems-in-autocad-map-3d/idi-p/12475858"
---

# progeCAD DWG Compatibility and Field Corruption Errors: Title Block Fields Corrupt After Save from 2010 DWG Back-Conversion Requiring Pre-Save in AutoCAD 2010, ePermanentlyErased Crash Opening progeCAD DWGs in AutoCAD from XREF Issues Requiring Audit and Recover, Invalid DWG Version Error from 2007 Format Save Requiring 2004 Format Save, DWG Geometry Misalignment in AutoCAD Map 3D from Translation Loss Requiring DWG Audit, and progeCAD Drawings Not Opening in Older AutoCAD from Version Mismatch Requiring Save As Correct Version

progeCAD's DWG save conversion, XREF handling, version compatibility, geometry translation, and file format management produce errors from back-conversion data loss, XREF corruption, version mismatch, translation issues, and format incompatibility. This guide covers the 5 most common progeCAD problems with diagnostic steps and community-verified fixes from CADDIT Forum and Autodesk Community.

## 1. Title Block Fields Corrupt After Save from 2010 DWG Back-Conversion

### Symptom

progeCAD user opens a DWG with a title block created in AutoCAD. The title block uses fields from the file's custom drawing properties. After the progeCAD user opens, modifies, and saves the file, AutoCAD users experience: title block fields no longer linked, title block not editable, custom drawing properties that are not populated are deleted from the file, AutoCAD crashes upon closing the file. The current remedy is to delete the title block, purge the drawing, and reinstate the title block — still with a crash on close.

### Root Cause

"Currently, when you save the drawing in progeCAD, its format is automatically first converted to AutoCAD 2010 DWG. We verified that the field data is currently lost in this step." progeCAD automatically converts drawings to AutoCAD 2010 DWG format before saving. During this back-conversion, the field data entities (used in title blocks for dynamic text) are lost. The field data is a relatively new AutoCAD feature that progeCAD's conversion process doesn't fully support. When AutoCAD opens the file, the fields are missing, the title block is broken, and the custom properties are deleted.

### Fix

1. **Pre-save in AutoCAD 2010 format**:
   - "As a temporary work-around to prevent any data loss, you have to always save the drawing to 2010 format from AutoCAD first before opening in progeCAD"
   - In AutoCAD: File > Save As > AutoCAD 2010 DWG
   - Then open in progeCAD
   - This avoids the back-conversion in progeCAD

2. **Update to next major progeCAD release**:
   - "This issue with the data fields in AutoCAD 2015 will probably be addressed in the next major release of progeCAD, because the 2010 back-conversion process is no longer used then"
   - Update to the latest progeCAD version
   - The back-conversion process is removed in newer versions
   - Check release notes for field data fixes

3. **Don't use fields in progeCAD**:
   - If working in a mixed progeCAD/AutoCAD environment
   - Don't use field entities in title blocks
   - Use static text instead
   - This avoids the corruption entirely

4. **Recover after progeCAD save**:
   - After progeCAD saves the file
   - In AutoCAD: use RECOVER command
   - This may restore some field data
   - Then rebuild the title block

5. **Keep a backup before progeCAD editing**:
   - Before sending a DWG to a progeCAD user
   - Keep a backup of the original
   - If fields are corrupted, restore from backup
   - Reapply only the progeCAD user's changes manually

6. **Use progeCAD 2024+ with IntelliCAD 11.1**:
   - "New Engine Based on the latest IntelliCAD 11.1 source code. Hundreds of bugs fixed"
   - progeCAD 2024 uses a new engine
   - Many compatibility bugs are fixed
   - Update to progeCAD 2024 or later

### Community Report

> "Each time the ProgeCAD user opens, modifies the title block and saves the file, any subsequent use in AutoCAD comes with: Title block fields are no longer linked, title block is not editable, custom drawing properties that are not populated are deleted, AutoCAD crashes upon closing of file. Currently, when you save the drawing in progeCAD, its format is automatically first converted to AutoCAD 2010 DWG. We verified that the field data is currently lost in this step. As a temporary work-around, save the drawing to 2010 format from AutoCAD first before opening in progeCAD."

## 2. ePermanentlyErased Crash Opening progeCAD DWGs in AutoCAD from XREF Issues

### Symptom

Drawings originally created in AutoCAD, worked on in progeCAD, and saved as 2004 AutoCAD version. When trying to open in any version of AutoCAD: sometimes they load very slowly but won't plot, sometimes they won't load at all. Error: `!dbspace.h@401: ePermanentlyErased`. 40 drawings affected.

### Root Cause

"There is something wrong with your drawings. AutoCAD users have also experienced similar errors with their own software. The thread above seems to indicate it might well have something to do with an invalid XREF." The ePermanentlyErased error indicates that a database object referenced in the drawing has been permanently erased. This is typically caused by an invalid XREF or block reference. progeCAD's save process may not properly handle all XREF references, especially complex ones. When AutoCAD opens the file, it finds references to objects that no longer exist in the database, causing the crash.

### Fix

1. **Run AUDIT and RECOVER in progeCAD first**:
   - "Have you tried to 'audit' and 'recover' commands in progeCAD first before saving back to AutoCAD?"
   - In progeCAD: run AUDIT command to fix errors
   - Then run RECOVER command
   - Save the file after auditing

2. **Check for XREF issues**:
   - "It might well have something to do with an invalid XREF"
   - Check XREF references in progeCAD
   - Detach any invalid or missing XREFs
   - Reattach them if needed

3. **Run RECOVER in AutoCAD**:
   - In AutoCAD: use RECOVER command
   - File > Drawing Utilities > Recover
   - Select the progeCAD-saved DWG
   - AutoCAD will attempt to fix the drawing

4. **Detach and reattach XREFs**:
   - In progeCAD, detach all XREFs
   - Save the file
   - Open in AutoCAD
   - Reattach XREFs in AutoCAD

5. **Use WBLOCK to clean drawings**:
   - In progeCAD: WBLOCK the drawing contents
   - To a new file
   - This removes corrupted database entries
   - Then open the WBLOCK'd file in AutoCAD

6. **Check block references**:
   - "Do your drawings contain XREF or blocks?"
   - Check for corrupted block definitions
   - Purge unused blocks
   - Redefine corrupted blocks

7. **Update progeCAD version**:
   - "You should upgrade to 8.0.18.18"
   - Check for the latest progeCAD version
   - Many DWG compatibility issues are fixed in updates
   - Install the latest version before working on critical files

### Community Report

> "I now have 40 Drawings that were originally created in Acad, worked on in Proge, and saved as 2004 ACAD versions. I can't open the files in any version of Acad. Sometimes they will load very slowly but they will not plot. Sometimes they will not load at all. The error reads: !dbspace.h@401: ePermanentlyErased. It might well have something to do with an invalid XREF. Have you tried audit and recover commands in progeCAD first before saving back to AutoCAD?"

## 3. Invalid DWG Version Error from 2007 Format Save

### Symptom

Every time a DWG file is opened in progeCAD 2009 PRO, a dialog box appears: "Invalid DWG Version" and "Only drawing versions 2.5 through version 2009 are supported." It asks if you would like to recover the file instead. This happens 2-3 times when opening a DWG. The files are AutoCAD 2004 and 2007 files. After saving in progeCAD, the same thing happens the next time.

### Root Cause

"I think this is more of a .dwg compatibility issue." progeCAD 2009 doesn't fully support AutoCAD 2007 DWG format. When progeCAD opens a 2007-format DWG, it reports "Invalid DWG Version" because the 2007 format uses a different internal structure than what progeCAD 2009 expects. The error appears multiple times because progeCAD checks the version at different stages of the loading process. Saving in 2007 format doesn't fix it because progeCAD's 2007 format implementation is incomplete.

### Fix

1. **Save as AutoCAD 2004 format**:
   - "I tried re-saving the .dwg's in AutoCad 2004 format and now they're okay"
   - "I used to save the drawing files in AutoCad 2007"
   - In progeCAD: File > Save As > AutoCAD 2004 DWG
   - The 2004 format is fully supported by progeCAD 2009

2. **Don't use AutoCAD 2007 format**:
   - "I overlooked the save as option"
   - Avoid saving in AutoCAD 2007 format
   - Use 2004 or earlier format
   - progeCAD 2009 fully supports these

3. **Update progeCAD version**:
   - "Are you using the latest version of progeCAD 9.0.28.10?"
   - Update to the latest progeCAD version
   - Newer versions support newer DWG formats
   - progeCAD 2024 supports up to AutoCAD 2024 DWG

4. **Run AUDIT on files**:
   - "Do you have errors in your drawing files?"
   - "Check them in AutoCAD first using the audit and purge commands"
   - Run AUDIT in AutoCAD before sending to progeCAD
   - Fix any errors first

5. **Check file version before opening**:
   - Right-click the DWG file
   - Properties > Details
   - Check the DWG version
   - If 2007+, resave as 2004 in AutoCAD

6. **Use progeCAD 2024 with IntelliCAD 11.1**:
   - "New Engine Based on the latest IntelliCAD 11.1 source code"
   - "Hundreds of bugs fixed"
   - progeCAD 2024 supports modern DWG formats
   - No more "Invalid DWG Version" errors

### Community Report

> "Everything I open on progeCAD 2009 PRO shows a dialog box: 'Invalid DWG Version' and 'Only drawing versions 2.5 through version 2009 are supported.' This happens 2-3 times when I open a dwg file. The files are AutoCad 2004 and 2007 files. I tried re-saving the .dwg's in AutoCad 2004 format and now they're okay. I used to save the drawing files in AutoCad 2007."

## 4. DWG Geometry Misalignment in AutoCAD Map 3D from Translation Loss

### Symptom

A contractor used progeCAD 2020 Professional for engineering drawings. After importing their DWG data into AutoCAD Map 3D, everything appeared corrupted. Cables were not connected properly and features were significantly misaligned. However, examining the original DWG files created in progeCAD, everything appeared correct. Something is lost in translation during the file conversion process.

### Root Cause

progeCAD and AutoCAD Map 3D use different implementations of the DWG format. progeCAD uses the IntelliCAD engine, which has a different internal representation for some entities. When AutoCAD Map 3D opens a progeCAD-created DWG, it may interpret certain entities differently. GIS-specific entities (cables, features) may use extended data or custom entities that progeCAD handles differently. The geometry coordinates may also be stored with different precision, causing misalignment.

### Fix

1. **Audit files in progeCAD before delivery**:
   - Before sending DWGs to AutoCAD users
   - Run AUDIT command in progeCAD
   - Fix any errors
   - Purge unused elements

2. **Save in the correct DWG version**:
   - Save as the AutoCAD version used by the recipient
   - Don't use progeCAD's default format
   - Use File > Save As > select the correct version
   - Test by opening in AutoCAD

3. **Use standard AutoCAD entities only**:
   - Don't use progeCAD-specific entities
   - Use standard lines, polylines, arcs
   - Avoid custom objects or extended data
   - These may not translate correctly

4. **Check coordinate systems**:
   - Verify the coordinate system is set correctly
   - Both progeCAD and AutoCAD should use the same CRS
   - Check if coordinates are stored differently
   - Use the same units and precision

5. **Use DXF as intermediary**:
   - If DWG translation fails
   - Export from progeCAD as DXF
   - Import DXF into AutoCAD Map 3D
   - DXF is a simpler format with less translation risk

6. **Verify in AutoCAD before use**:
   - After receiving progeCAD DWGs
   - Open in AutoCAD and verify geometry
   - Check cable connections and feature alignment
   - Report discrepancies to the contractor

7. **Update progeCAD to 2024**:
   - "New Engine Based on the latest IntelliCAD 11.1 source code"
   - "Hundreds of bugs fixed"
   - progeCAD 2024 has improved DWG compatibility
   - Update to reduce translation issues

### Community Report

> "We encountered an issue with one of our contractors who used ProgeCAD 2020 Professional. After importing their data into AutoCAD, we discovered that everything appeared to be corrupted. Cables were not connected properly and features were significantly misaligned. However, upon examining the original DWG files created by the contractor, everything appeared to be correct. It seems that something is being lost in translation during the file conversion process."

## 5. progeCAD Drawings Not Opening in Older AutoCAD from Version Mismatch

### Symptom

Drawings created in progeCAD cannot be opened in AutoCAD 2005-2007. The error says "file not valid." The drawings were saved in progeCAD's default format, which is AutoCAD 2007+ version DWG. Older AutoCAD versions cannot read newer DWG formats.

### Root Cause

"Your error is different and normally caused when you try to open a DWG file with the wrong version of AutoCAD. Remember that AutoCAD 2006- versions CAN NOT read AutoCAD 2007+ version DWG which is progeCAD default." progeCAD's default save format is AutoCAD 2007 or later. AutoCAD 2006 and earlier cannot read DWG files saved in 2007+ format. The DWG format changed significantly in 2007 (new compression, new object types). Older AutoCAD versions report "file not valid" when encountering the newer format.

### Fix

1. **Save As the correct AutoCAD version**:
   - "You need to choose the correct version using the 'save as..' dialogue box"
   - In progeCAD: File > Save As
   - Select AutoCAD 2004 DWG format
   - This is readable by AutoCAD 2004-2006

2. **Check recipient's AutoCAD version**:
   - Before saving, check which AutoCAD version the recipient uses
   - Save in that version or earlier
   - Don't assume the recipient has the latest AutoCAD
   - Ask if unsure

3. **Use DWG TrueView for conversion**:
   - Download Autodesk DWG TrueView (free)
   - Open the progeCAD DWG in TrueView
   - Save As the required older version
   - Then open in older AutoCAD

4. **Set default save format in progeCAD**:
   - In progeCAD settings
   - Set the default save format to AutoCAD 2004
   - This ensures all saves are compatible
   - With older AutoCAD versions

5. **Use DXF format for maximum compatibility**:
   - DXF format is supported by all AutoCAD versions
   - Export from progeCAD as DXF
   - Import in any AutoCAD version
   - DXF has no version compatibility issues

6. **Update progeCAD for better version support**:
   - progeCAD 2024 supports saving to multiple DWG versions
   - "New Engine Based on the latest IntelliCAD 11.1 source code"
   - Update to the latest version
   - Better version management

### Community Report

> "I can't open in AutoCad the drawings I did in ProgeCad. It says 'file not valid.' I am currently reviewing ProgeCad, even with the trial version, I'm getting a lot of problems. Your error is normally caused when you try to open a DWG file with the wrong version of AutoCAD. Remember that AutoCAD 2006- versions CAN NOT read AutoCAD 2007+ version DWG which is progeCAD default. You need to choose the correct version using the 'save as' dialogue box."

## 6. Additional progeCAD Issues

### XCLIP Problems

**Issue**: "I'm getting a lot of problems in xclipping."
**Fix**: Update progeCAD to latest version. Use alternative clipping methods. Check XREF boundaries. Avoid complex XCLIP boundaries.

### Paperspace Scaling Issues

**Issue**: "Problems in working in paperspace, in scaling."
**Fix**: Check viewport scale settings. Verify annotation scale. Use model space for accurate scaling. Update progeCAD version.

### IFC Underlay Audit

**Issue**: "Use the Audit command to check for errors in .IFC files that are attached as underlays."
**Fix**: Run Audit on IFC underlays. Fix IFC file errors in source application. Reattach IFC underlay. Check IFC file validity.

### ViewCube Issues

**Issue**: ViewCube not working correctly in progeCAD 2024.
**Fix**: Check ViewCube settings in preferences. Reset ViewCube to default. Update graphics drivers. Use alternative view controls.

### Performance with Large Drawings

**Issue**: "The Quick Select command is faster by 2x in large drawings" but still slow.
**Fix**: Update to progeCAD 2024. Use QSELECT instead of manual selection. Purge drawings regularly. Use layer isolation for large drawings.

### Polyline Vectorization Performance

**Issue**: Slow polyline rendering in large drawings.
**Fix**: Update to progeCAD 2024 — "Faster polyline vectorization." Reduce polyline complexity. Use simplified display modes. Purge unused polylines.

## Best Practices

1. **Pre-save in AutoCAD 2010 format before progeCAD editing** — prevents field data corruption
2. **Update to progeCAD 2024 with IntelliCAD 11.1** — hundreds of bugs fixed, better compatibility
3. **Run AUDIT and RECOVER in progeCAD before saving for AutoCAD** — prevents ePermanentlyErased
4. **Save as AutoCAD 2004 format for older AutoCAD compatibility** — prevents Invalid DWG Version
5. **Don't use progeCAD's default save format for cross-platform work** — always specify the target version
6. **Use standard AutoCAD entities only** — avoids translation issues in AutoCAD Map 3D
7. **Use DXF as intermediary for problematic files** — simpler format, less translation risk
8. **Check recipient's AutoCAD version before saving** — ensures compatibility
9. **Don't use field entities in mixed progeCAD/AutoCAD environments** — fields are lost in conversion
10. **Keep backups before progeCAD editing** — allows recovery if corruption occurs
