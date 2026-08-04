---
title: "EPLAN 2026 Project Database Update Required for Old Projects Causing Cannot Open Error"
excerpt: "EPLAN 2026 Project Database Update Required for Old Projects Causing Cannot Open Error: symptoms, root causes, and step-by-step fixes, verified against EPLAN Help 2026."
category: "troubleshooting"
softwareSlug: "eplan"
keyword: "EPLAN 2026 project database update old projects cannot open P013056 part not exist database deleted parts changed part number P022017 excessive field length values device tag macro parts data not stored synchronization automated batch processing"
slug: "eplan-2026-project-database-update-required-for-old-projects-causing-c"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# EPLAN 2026 Project Database Update Required for Old Projects Causing Cannot Open Error, Part Not Exist in Database P013056 from Deleted Parts or Changed Part Numbers, Excessive Field Length Values in Database P022017 from Long Device Tags, Macro Parts Data Not Automatically Stored Requiring Manual Synchronization, and Automated Batch Project Database Update via Project Management: Database Update Prompt, Part Exchange or Project Compress, Advanced Mode Reorganization, Parts Update and Complete Commands, and Automated Processing Scheme

EPLAN produces errors from database updates, missing parts, field length overflows, macro data synchronization, and batch processing. This guide covers the 5 most common EPLAN problems with diagnostic steps and community-verified fixes from EPLAN Help 2026.

## 1. 2026 Project Database Update Required for Old Projects Causing Cannot Open Error

### Symptom

After upgrading to EPLAN 2026, old projects created in previous versions cannot be opened. When attempting to open an old project, EPLAN prompts whether to import the project in the current version. If the user declines, the project cannot be opened at all. If the user accepts, the project is updated and a backup copy is created. Projects created in 2026 cannot be opened with old EPLAN versions.

### Root Cause

"As part of miscellaneous extensions and optimizations, the project databases have been changed in Version 2026. This has the effect that new projects are essentially created with new project databases. In order for old projects to be edited (or also just viewed) in the new Eplan version, updating of the project databases is absolutely essential for these projects." EPLAN 2026 changed the project database format. Old projects use the previous database format, which is incompatible with the 2026 version. The update is mandatory — without it, old projects cannot be opened in 2026, and updated projects cannot be opened in old versions.

### Fix

1. **Confirm the update prompt with Yes**:
   - Always click Yes to update

2. **Verify backup copy creation**:
   - Verify the .zw1 backup was created
   - In the project directory

3. **Use Automated Processing for batch updates**:
   - Use batch update for multiple projects

4. **Don't skip the update**:
   - The update is mandatory
   - There is no workaround

5. **Be aware of backward incompatibility**:
   - Once updated, projects can't go back
   - To old EPLAN versions

6. **Keep old EPLAN version installed**:
   - If you need to work with both old and new projects
   - Keep the old EPLAN version installed
   - Alongside 2026
   - For backward compatibility

7. **Test the update on a copy first**:
   - Before updating critical projects
   - Test the update process
   - On a copy of the project
   - To verify everything works

### Community Report

> "As part of miscellaneous extensions and optimizations, the project databases have been changed in Version 2026. In order for old projects to be edited (or also just viewed) in the new Eplan version, updating of the project databases is absolutely essential for these projects. Old projects are updated the first time they are opened with the current Eplan version. If you confirm with [Yes], the project is first updated and then opened. In addition, a backup copy with the not-updated project databases is created in the project directory. If you do not update an old project, you will not be able to open this project in the version 2026."

## 2. Part Not Exist in Database P013056 from Deleted Parts or Changed Part Numbers

### Symptom

The message P013056 appears: "The part with part number '<x>' and variant '<y>' does not exist in the database." The message appears during project checks or when opening a project. The part may have been deleted from the parts database, or the part number may have been changed. The message appears for both placed and unplaced parts.

### Root Cause

"A stored part was determined in the project whose part number or variant stored in the project is not stored in the parts database. Possibly the part or the part variant was deleted from the parts database or the part number in the parts database was changed." The project references a part that no longer exists in the parts database. The part was either deleted, or its part number was changed in the parts database, creating a mismatch between the project's part reference and the database's actual parts.

### Fix

1. **For placed parts — exchange the part**:
   - Use Go to (graphic) to find the object

2. **For unplaced parts — compress the project**:
   - Compress to remove unused parts

3. **Start a new check run**:
   - After exchanging parts or compressing
   - Run the check again
   - To verify the message is resolved

4. **Check if the part was deleted**:
   - Verify if the part
   - Was intentionally deleted
   - From the parts database
   - Or if it was an accidental deletion

5. **Restore the part in the database**:
   - If the part was accidentally deleted
   - Restore it in the parts database
   - With the same part number and variant
   - As referenced in the project

6. **Update part references**:
   - If the part number was changed
   - Update the project's part references
   - To match the new part number
   - In the parts database

7. **Note: offline check only**:
   - The P013056 check
   - Must be run offline

### Community Report

> "P013056: The part with part number '<x>' and variant '<y>' does not exist in the database. A stored part was determined in the project whose part number or variant stored in the project is not stored in the parts database. Possibly the part or the part variant was deleted from the parts database or the part number in the parts database was changed. For placed parts: Locate the object, open Properties, exchange the part. For unplaced parts: Compress project with Remove unnecessary project data, Unused parts, and Unused part variants."

## 3. Excessive Field Length Values in Database P022017 from Long Device Tags

### Symptom

The message P022017 appears: "The project contains excessive field length values in the database: <x>." The message indicates that certain identifiers, numbers, or designations in the project exceed the database's field length limits. The issue can produce incorrect results in various project operations. The problem often occurs with very long device tags or other identifying components.

### Root Cause

"A number of identifiers, numbers, and designations in Eplan projects, such as the device tag, are managed by different databases. In individual cases, the input of very long sequences of letters and / or numbers can result in a cap on information in one of the databases and thus produce incorrect results." EPLAN's databases have field length limits for various identifiers. When a device tag or other identifier exceeds these limits, the database caps the information, which can produce incorrect results. The field length limits are: 16 characters for the prefix, 16 characters for the identifier, 64 characters for the counter, and 16 characters for the subcounter.

### Fix

1. **Reorganize the project with Advanced Mode**:
   - Use Advanced Mode reorganization

2. **Save and run the reorganization**:
   - Wait for completion and recheck

3. **Keep device tags short**:
   - Use short, concise device tags
   - To prevent field length overflow

4. **Check field length limits**:
   - Verify device tags don't exceed these limits

5. **Shorten existing long device tags**:
   - Identify device tags that exceed limits
   - Shorten them to within the limits
   - Update all references
   - To the shortened device tags

6. **Use numbering schemes wisely**:
   - Configure numbering schemes
   - To generate device tags
   - That stay within field length limits
   - Avoid excessive counter lengths

7. **Run check after reorganization**:
   - After the Advanced Mode reorganization
   - Run a full project check
   - To verify the P022017 message
   - No longer appears

### Community Report

> "P022017: The project contains excessive field length values in the database. A number of identifiers, numbers, and designations in Eplan projects, such as the device tag, are managed by different databases. In individual cases, the input of very long sequences of letters and / or numbers can result in a cap on information in one of the databases and thus produce incorrect results. Reorganize the project. In the field Data to be compressed select the check box Advanced mode below the check box Reorganize project. Eplan supports 16 characters for the prefix, 16 for the identifier, 64 for the counter, and 16 for the subcounter."

## 4. Macro Parts Data Not Automatically Stored Requiring Manual Synchronization

### Symptom

When inserting a macro containing parts into a project, the parts data is not automatically stored in the project. The macro's parts are visible in the schematic but not available in the parts database. Similarly, plot frames and forms in macros are not automatically stored. The parts must be manually synchronized with the master data.

### Root Cause

"Macros are broken up in the project as soon as they are inserted. Data is then undistinguishable from manually inserted individual elements. All data in a macro are referenced when stored (except foreign language texts). If a macro contains parts, they are not automatically stored." When a macro is inserted, it's broken up into individual elements. The parts data in the macro is referenced but not automatically stored in the project's parts database. The user must manually synchronize the parts data with the master data.

### Fix

1. **Use Parts Update for macro parts**:
   - Use the Parts Update command

2. **Use Parts Complete for missing master data**:
   - Use the Parts Complete command

3. **Use Synchronize for selective synchronization**:
   - Use Synchronize for individual parts

4. **Note: Update overwrites project data**:
   - Be aware that Update overwrites
   - Project-related parts data

5. **Run Update after inserting macros**:
   - After inserting a macro with parts
   - Run the Parts Update command
   - To synchronize the macro's parts
   - With the master data

6. **Run Complete for plot frames and forms**:
   - After inserting a macro with plot frames or forms
   - Run the Parts Complete command
   - To store the missing master data
   - Automatically

7. **Verify parts after synchronization**:
   - After running Update or Complete
   - Verify the parts are now
   - Available in the parts database
   - And properly synchronized

### Community Report

> "Macros are broken up in the project as soon as they are inserted. Data is then undistinguishable from manually inserted individual elements. If a macro contains parts, they are not automatically stored. Parts in macros are synchronized with the master data parts, i.e., the data in the parts database are transferred into the macros. Select Tab Master data > Command group Part > Update. If the macro contains a plot frame or form, select Tab Master data > Command group Part > Complete. For selective synchronization, use Tab Master data > Command group Part > Synchronize."

## 5. Automated Batch Project Database Update via Project Management

### Symptom

After upgrading to EPLAN 2026, many old projects need to be updated to the new database format. Opening and updating each project individually is time-consuming. Users need a way to batch update multiple projects simultaneously. The manual process of opening each project, confirming the update prompt, and waiting for completion is inefficient for organizations with many projects.

### Root Cause

"In case of a program update, you can update several older projects in one go in the project management (command path: File > Project management). To do this select the marked projects in the popup menu item Automated processing. To update the project databases the 'Project import' scheme is now available in the Run: Automated processing dialog." EPLAN 2026 provides a batch update feature through the Project Management's Automated Processing function. Many users are unaware of this feature and continue to update projects one by one.

### Fix

1. **Open Project Management**:
   - Open the Project Management dialog
   - From the File menu
   - In EPLAN 2026

2. **Select multiple projects**:
   - Select the projects
   - That need to be updated
   - In the Project Management list

3. **Use Automated Processing**:
   - Right-click the selected projects
   - And choose Automated Processing
   - From the popup menu

4. **Select the Project Import scheme**:
   - Select the Project Import scheme

5. **Run the batch update**:
   - After selecting the scheme
   - Run the Automated Processing
   - To update all selected projects
   - In one batch operation

6. **Verify backup copies**:
   - After the batch update
   - Verify that .zw1 backup copies
   - Were created for each project
   - In their respective project directories

7. **Check updated projects**:
   - After the batch update
   - Open a few updated projects
   - To verify they open correctly
   - In EPLAN 2026

### Community Report

> "In case of a program update, you can update several older projects in one go in the project management (command path: File > Project management). To do this select the marked projects in the popup menu item Automated processing. To update the project databases the 'Project import' scheme is now available in the Run: Automated processing dialog."

## 6. Additional EPLAN Issues

### Compressible Project Data — Remove Macro Property

**Issue**: "Remove 'Macro' property from components: Deletes the contents of the property 'Macro' (ID 20468) on all components."
**Fix**: Use this compression option to remove macro properties from components. The macros inserted into the schematic and their components remain. Only the macro property is removed.

### Compressible Project Data — Remove Protected Groups

**Issue**: "Remove protected groups: Removes the grouping at all protected groups. The macros inserted into the schematic and their components remain."
**Fix**: Use this compression option to remove protected group groupings. The macro components remain in the schematic. Only the grouping is removed.

### Reorganize Project Database

**Issue**: "Reorganize project: Deleted data is permanently deleted from the project database. The database is reduced in size."
**Fix**: Use Reorganize project to permanently delete deleted data. This reduces the database size. Use Advanced Mode to also correct field length excesses and sorting IDs.

### Unused Parts Compression

**Issue**: "Unused parts: Parts that are stored in the project and are not used are deleted from the project."
**Fix**: Use the Unused parts compression option to remove unused parts. This cleans up the parts database. Combine with Unused part variants for thorough cleanup.

### Foreign Language Texts in Macros

**Issue**: "All data in a macro are referenced when stored (except foreign language texts)."
**Fix**: Foreign language texts in macros are not referenced but stored directly. Be aware of this when working with multilingual projects. Translation data in macros may need separate management.

### Project Database Backup

**Issue**: How to restore a project if the database update fails.
**Fix**: "The backup file *.zw1 can be simply restored by using the command File > Open." The .zw1 backup is created automatically during the update. Use File > Open to restore the backup. The restored project uses the old database format.

### Staged Update for Large Organizations

**Issue**: Large organizations need to manage the update of many projects.
**Fix**: Use the Automated Processing feature for batch updates. Update projects in batches by department or project type. Test the update process on a small batch first. Keep the old EPLAN version installed during the transition period.

## Best Practices

1. **Always confirm the database update prompt with Yes** — mandatory for opening old projects
2. **Use Automated Processing for batch updates** — saves time when upgrading many projects
3. **Verify .zw1 backup creation after update** — ensures rollback is possible
4. **Keep device tags short to prevent P022017** — stay within field length limits
5. **Run Parts Update after inserting macros with parts** — synchronizes parts with master data
6. **Run Parts Complete for macros with plot frames and forms** — stores missing master data
7. **Use Advanced Mode reorganization for P022017** — corrects field length excesses
8. **Compress projects regularly to remove unused parts** — keeps database clean
9. **Don't attempt to open updated projects in old EPLAN versions** — backward incompatible
10. **Keep old EPLAN version installed during transition** — for projects not yet updated
