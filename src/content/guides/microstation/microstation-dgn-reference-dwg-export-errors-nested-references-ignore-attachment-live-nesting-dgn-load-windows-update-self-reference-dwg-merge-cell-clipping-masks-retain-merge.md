---
title: "MicroStation DGN Reference Attachment and DWG Export Errors: Nested References Not Showing from Ignore Attachment When Live Nesting Enabled Requiring Dialog Setting Disable, DGN Unable to Load After Windows Update from Reference File Attachment Requiring Path Verification, Self-Reference Attachments Not Supported in DWG Format Requiring Merge to Cell, Clipping Masks Lost When Saving to DWG with Retain Setting Requiring Merge Instead, and Reference Attachments Not Portable from Full Absolute Paths Requiring Save Relative Path or Configuration Variables"
excerpt: "MicroStation fails for 5 distinct reasons: nested references not showing from Ignore Attachment when live nesting enabled requiring dialog setting disable, DGN unable to load after Windows update from reference file attachment requiring path verification, self-reference attachments not supported in DWG format requiring merge to cell, clipping masks lost when saving to DWG with Retain setting requiring Merge instead, and reference attachments not portable from full absolute paths requiring Save Relative Path or configuration variables. We cover each with fixes from Bentley Docs and Community."
category: "troubleshooting"
softwareSlug: "microstation"
keyword: "MicroStation nested references not showing Ignore Attachment live nesting DGN unable to load Windows update reference file path self-reference not supported DWG merge to cell clipping masks lost saving DWG retain merge reference attachments not portable full absolute paths Save Relative Path configuration variables"
slug: "microstation-dgn-reference-dwg-export-errors-nested-references-ignore-attachment-live-nesting-dgn-load-windows-update-self-reference-dwg-merge-cell-clipping-masks-retain-merge"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://bentleysystems.service-now.com/community?id=kb_article&sysparm_article=KB0108431"
  - "https://docs.bentley.com/LiveContent/web/MicroStation-v2025.0.1/Help/en/topics/123015/GUID-900A3745-640A-4FDF-084D-E5FB6C345F7C.html"
  - "https://docs.bentley.com/LiveContent/web/MicroStation-v2024.2/Help/en/html5/topics/122973/GUID-60315B0B-658B-8F49-E056-36074C2C7A8E.html"
---

# MicroStation DGN Reference Attachment and DWG Export Errors: Nested References Not Showing from Ignore Attachment When Live Nesting Enabled Requiring Dialog Setting Disable, DGN Unable to Load After Windows Update from Reference File Attachment Requiring Path Verification, Self-Reference Attachments Not Supported in DWG Format Requiring Merge to Cell, Clipping Masks Lost When Saving to DWG with Retain Setting Requiring Merge Instead, and Reference Attachments Not Portable from Full Absolute Paths Requiring Save Relative Path or Configuration Variables

MicroStation's reference nesting, DGN loading, DWG export, clipping masks, and path management produce errors from nesting settings, Windows updates, format incompatibilities, and path configurations. This guide covers the 5 most common MicroStation problems with diagnostic steps and community-verified fixes from Bentley Docs and Community.

## 1. Nested References Not Showing from Ignore Attachment When Live Nesting Enabled

### Symptom

When attaching reference files with live nesting enabled in MicroStation, nested references are not showing. The parent reference appears, but its nested references are invisible. This occurs in MicroStation V8i, CONNECT, 2023, 2024, and 2025.

### Root Cause

"The Reference attachment setting 'Ignore Attachment when live nesting' is probably enabled." When this setting is enabled on a reference attachment, MicroStation ignores that attachment's nested references when displaying live nesting. The setting is per-attachment and can be accidentally enabled.

### Fix

1. **Disable "Ignore Attachment when live nesting"**:
   - "Open file that has the missing reference(s) attached"
   - "Open Reference dialog"
   - "Double-click on reference attachment"
   - "Disable 'Ignore Attachment when live nesting'"
   - "Click OK"
   - "Save changes to file"
   - "Close and return to previous file"
   - "Reference should appear as expected"

2. **Check all nested reference levels**:
   - The setting may be enabled at any nesting level
   - Check each reference attachment in the nesting chain
   - Disable the setting on each attachment
   - Save after each change

3. **Verify live nesting depth**:
   - In the Reference dialog, check the nesting depth
   - Set Live Nesting to the required depth (e.g., 99 for all levels)
   - Ensure nesting is set to "Live" not "No Nesting"
   - Apply to all references

### Community Report

> "When attaching reference files with live nesting enabled, nested references are not showing. The Reference attachment setting 'Ignore Attachment when live nesting' is probably enabled. Disable 'Ignore Attachment when live nesting' in the Reference dialog by double-clicking on the reference attachment. Save changes and close. Reference should appear as expected."

## 2. DGN Unable to Load After Windows Update from Reference File Attachment

### Symptom

After a recent Windows update, MicroStation is unable to load DGN files that have reference files attached. DGN files without references load normally. The issue started immediately after the Windows update. No MicroStation settings were changed.

### Root Cause

Windows updates can change file path handling, security permissions, or network drive mappings. If reference files are stored on network drives, Windows updates may remap or disconnect the drives. If the reference paths are absolute, a drive letter change breaks the path. Windows security updates may also block access to certain file locations.

### Fix

1. **Verify reference file paths**:
   - Open the DGN file (ignoring reference errors)
   - Open the Reference dialog
   - Check each reference's path
   - Verify the path still exists after the Windows update

2. **Check network drive mappings**:
   - Open File Explorer
   - Check if network drives are still mapped
   - If drives were disconnected, remap them
   - Use the same drive letters as before

3. **Use relative paths**:
   - "Save Relative Path in the Attach Reference dialog"
   - "This causes the relative paths to DGN files to be saved as attachment data"
   - Relative paths are not affected by drive letter changes
   - Reattach references with Save Relative Path enabled

4. **Use configuration variables for reference paths**:
   - "Define the configuration variable MS_RFDIR to specify the directory in which references reside"
   - "The configuration variable name, but not its definition, is saved as attachment data"
   - "If files are moved, the only change needed is to redefine the variable"
   - This is more robust than absolute paths

5. **Check Windows security settings**:
   - Windows updates may change file permissions
   - Right-click the reference file folder > Properties > Security
   - Ensure the current user has Read access
   - Check for blocked files (Properties > General > Unblock)

6. **Set MS_DISALLOWFULLREFPATH**:
   - "Administrators can prevent the storage of full paths by setting MS_DISALLOWFULLREFPATH"
   - This forces relative paths for all new attachments
   - Existing attachments with full paths need to be reattached
   - This prevents future path issues

### Community Report

> "Unable to load DGN (when a reference file is attached) after recent Windows update. DGN files without references load normally. The issue started immediately after the Windows update."

## 3. Self-Reference Attachments Not Supported in DWG Format Requiring Merge to Cell

### Symptom

A MicroStation DGN file uses self-references (the active model attached to itself as a reference). This is commonly used for detailed sections. When saving the DGN to DWG format, the self-reference is lost or causes errors. AutoCAD doesn't support self-references.

### Root Cause

"Do not attach the active model to itself as a reference (self-reference), since the DWG file format does not support this type of reference." AutoCAD's XREF system requires external files — it can't reference itself. When saving to DWG, MicroStation needs to handle self-references by merging or omitting them.

### Fix

1. **Merge self-attachments when saving to DWG**:
   - "You must merge self-attachments to preserve their display"
   - File > Save As > DWG > Options > References tab
   - Set Self Attachments to "Merge to Cell"
   - This preserves the self-reference geometry as a cell in the DWG

2. **Use Merge for self-attachments**:
   - In the References tab of Save As DWG Options
   - Set Self Attachments to "Merge"
   - This merges the geometry as individual elements
   - Not as a single cell

3. **Remove self-references before saving**:
   - If merging is not desired
   - Detach all self-references before saving to DWG
   - Copy the self-reference geometry into the active model
   - Then save to DWG

4. **Use Live Nesting for compatible references**:
   - "Use MicroStation's Live Nesting option, since it is compatible with AutoCAD's settings"
   - Live Nesting is compatible with AutoCAD XREF nesting
   - This preserves nested reference display in DWG

5. **Check Merge Viewport Attachments**:
   - "A special type of self attachment, default model into a sheet model (viewport in DWG), will not be merged unless the Merge Viewport Attachments check box is turned on"
   - Enable "Merge Viewport Attachments" in the References tab
   - This preserves sheet model viewports when saving to DWG

### Community Report

> "Do not attach the active model to itself as a reference (self-reference), since the DWG file format does not support this type of reference. You must merge self-attachments to preserve their display. In the Save As DWG/DXF Options, set Self Attachments to Merge to Cell or Merge."

## 4. Clipping Masks Lost When Saving to DWG with Retain Setting

### Symptom

A MicroStation DGN file has references with clipping masks applied. After saving to DWG format with references set to "Retain" (as XREFs), the clipping masks are removed. The XREFs in the DWG file have no clipping.

### Root Cause

"Earlier versions of AutoCAD did not support XREFs with clipping masks. Since R2010, AutoCAD started supporting single clip masks (invert clips). However, AutoCAD still does not support more than one clip on the same attachment. Therefore, saving a masked attachment to a DWG file (Retain) may remove any clipping masks applied to that attachment."

### Fix

1. **Use Merge instead of Retain for masked attachments**:
   - "When you use merging, the clipping masks are applied to the geometry as it is merged"
   - In Save As DWG Options > References tab
   - Set Masked Attachments to "Merge" or "Merge to Cell"
   - This preserves the clipping effect in the geometry

2. **Use DGN Underlay for masked attachments**:
   - "DGN Underlay creates DGN underlays of masked attachments in a DWG file"
   - Set Masked Attachments to "DGN Underlay"
   - This preserves the reference with clipping in DWG format
   - Requires AutoCAD with DGN underlay support

3. **Apply clipping in AutoCAD after saving**:
   - Save with Retain (clipping will be lost)
   - Open the DWG in AutoCAD
   - Use XCLIP command to reapply clipping masks
   - AutoCAD supports single clip masks since R2010

4. **Check for multiple clips on same attachment**:
   - If a reference has multiple clipping masks
   - AutoCAD can't support them all
   - Use Merge to preserve all clipping effects
   - Or reduce to a single clip before saving

5. **Understand priority settings**:
   - "If External Attachments and Masked Attachments are set differently, the one with the highest priority takes effect"
   - Priority from highest to lowest: Omit, Merge to Cell, Merge, Retain
   - "If either is set to Omit, then all attachments will be omitted"
   - Check both settings before saving

### Community Report

> "AutoCAD still does not support more than one clip on the same attachment. Saving a masked attachment to a DWG file (Retain) may remove any clipping masks. When you use merging, the clipping masks are applied to the geometry as it is merged. Set Masked Attachments to Merge or Merge to Cell."

## 5. Reference Attachments Not Portable from Full Absolute Paths

### Symptom

Reference attachments use full absolute paths (e.g., C:\Projects\12345\References\file.dgn). When the project is moved to another directory or shared with another user, references can't be found. The Reference dialog shows missing references with red indicators.

### Root Cause

"A reference attachment that specifies the DGN file containing the attached model by its full (absolute) path is not portable across directories, WorkSets, and networked systems." Absolute paths are specific to the machine where they were created. Moving files or sharing them breaks the paths.

### Fix

1. **Use Save Relative Path**:
   - "Turn on Save Relative Path in the Attach Reference dialog"
   - "This causes the relative paths to DGN files to be saved as attachment data"
   - Relative paths are based on the host file's location
   - Moving the entire project folder preserves references

2. **Set MS_ALWAYSRELATIVEREFPATH**:
   - "Set the configuration variable MS_ALWAYSRELATIVEREFPATH"
   - "When set, MicroStation always turns on Save Relative Path and disables it so it cannot be turned off"
   - This enforces relative paths for all new attachments
   - Prevents future portability issues

3. **Use MS_RFDIR configuration variable**:
   - "Define the configuration variable MS_RFDIR to specify the directory in which references reside"
   - "The configuration variable name, but not its definition, is saved as attachment data"
   - "If files are moved, the only change needed is to redefine the variable"
   - This is ideal for WorkSets with changing directory structures

4. **Use custom configuration variables**:
   - "Defining multiple custom configuration variables, such as WorkSet-specific or data type-specific variables, provides even greater flexibility"
   - Create variables like `PROJECT_REFS`, `SURVEY_REFS`, etc.
   - Attach references using these variable names
   - Redefine variables when moving projects

5. **Set MS_DISALLOWFULLREFPATH**:
   - "Administrators can prevent the storage of full paths by setting MS_DISALLOWFULLREFPATH"
   - This blocks absolute paths entirely
   - Forces users to use relative paths or configuration variables
   - Prevents portability issues at the organizational level

6. **Combine techniques**:
   - "You can combine the above techniques — specify the location with a configuration variable and a relative path"
   - Use a configuration variable for the base directory
   - Use relative paths within that directory
   - This provides maximum flexibility

### Community Report

> "A reference attachment that specifies the DGN file by its full (absolute) path is not portable across directories, WorkSets, and networked systems. Turn on Save Relative Path in the Attach Reference dialog. Or define MS_RFDIR to specify the directory in which references reside. The configuration variable name is saved as attachment data, so only the variable definition needs to change when files are moved."

## 6. Additional MicroStation Issues

### Non-Default Model Attachments in DWG

**Issue**: "AutoCAD's support for multiple models within a file is much more restrictive than MicroStation's."
**Fix**: "AutoCAD is limited to one default model per file with one or more sheets. AutoCAD's XREF attachments can only display the default model." Set Non-Default Model Attachments to Merge or Merge to Cell when saving to DWG.

### 3D Reference Visible Edge Merge

**Issue**: 3D reference file attachments don't display correctly in DWG format.
**Fix**: "A 3D reference file attachment will have its visible edge representation merged into the master file. This setting affects all references except wireframe geometry. Useful when using Dynamic Views because DWG and V7 DGN do not support dynamic view display options."

### Default Xref Block Insert Layer

**Issue**: "The default Xref Block insert layer for a DGN reference attachment saved in DWG is the layer named '0'."
**Fix**: "Set the configuration variable MS_DWGINSERTLAYER to the desired layer name. For example, MS_DWGINSERTLAYER set to 'MSINSERT' results in inserts assigned to 'MSINSERT'. If this layer doesn't exist, it will be created."

### Reference Dialog Shows Missing References

**Issue**: References show as missing after moving files.
**Fix**: Check if paths are absolute or relative. If absolute, reattach with Save Relative Path. Use the References dialog to repair paths. Set MS_RFDIR for organization-wide reference path management.

## Best Practices

1. **Disable "Ignore Attachment when live nesting" for nested references** — most common nesting fix
2. **Use Save Relative Path for all reference attachments** — ensures portability
3. **Set MS_ALWAYSRELATIVEREFPATH to enforce relative paths** — prevents absolute path issues
4. **Use MS_RFDIR for reference directories** — flexible across directory changes
5. **Set MS_DISALLOWFULLREFPATH organization-wide** — prevents absolute paths entirely
6. **Merge self-references when saving to DWG** — AutoCAD doesn't support self-references
7. **Merge masked attachments to preserve clipping** — Retain removes clipping masks in DWG
8. **Use DGN Underlay for masked attachments in DWG** — preserves reference with clipping
9. **Set Merge Viewport Attachments for sheet models** — preserves viewports in DWG
10. **Use Live Nesting for DWG-compatible nesting** — compatible with AutoCAD settings
