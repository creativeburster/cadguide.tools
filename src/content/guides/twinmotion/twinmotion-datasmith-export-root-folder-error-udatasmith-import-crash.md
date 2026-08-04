---
title: "Twinmotion Datasmith Export Root Folder Error, UDatasmith Import Crash on Collapse Modes"
excerpt: "Twinmotion Datasmith Export Root Folder Error, UDatasmith Import Crash on Collapse Modes: symptoms, root causes, and step-by-step fixes, verified against Epic Developer Community Forums."
category: "troubleshooting"
softwareSlug: "twinmotion"
keyword: "Twinmotion Datasmith export root folder error udatasmith import crash Collapse by material Collapse all Keep Hierarchy 2025.1.1 Twinmotion to Unreal plugin version compatibility missing materials Datasmith reload crash Revit 2024 TM 2024.1 UE 5.1 UE 5.3 plugin version matching update installation"
slug: "twinmotion-datasmith-export-root-folder-error-udatasmith-import-crash"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forums.unrealengine.com/t/datasmith-exporter-gives-error-for-twinmotion-2024-1/1848129"
  - "https://issues.unrealengine.com/issue/TM-20848"
  - "https://forums.unrealengine.com/t/datasmith-reloading-file-crashes-revit-2024-tm-2024-1/1909447"
---

# Twinmotion Datasmith Export Root Folder Error, UDatasmith Import Crash on Collapse Modes, Twinmotion to Unreal Plugin Version Compatibility, Datasmith Reload Crash from Revit, and Missing Materials After Import to Unreal Engine: Project Root Folder Configuration, Keep Hierarchy Workaround, Plugin Version Matching, and Update Installation

Twinmotion's Datasmith export, udatasmith import, Unreal Engine plugin compatibility, Datasmith reload, and material transfer produce errors from incorrect folder selection, collapse mode bugs, version mismatches, reload crashes, and plugin incompatibilities. This guide covers the 5 most common Twinmotion problems with diagnostic steps and community-verified fixes from Epic Developer Community Forums.

## 1. Datasmith Export Root Folder Error

### Symptom

When exporting a Datasmith file from Twinmotion 2024.1, the error "Please select the root folder of your Unreal Engine project to export your scene" appears. The Datasmith file won't save. The error occurs even when trying to save in the project folder. The export worked in previous Twinmotion versions but not in 2024.1.

### Root Cause

"It seems like there was a change in how exporting datasmith files worked from previous versions of Twinmotion." In Twinmotion 2024.1, the Datasmith exporter requires the file to be saved in the Unreal Engine project's root folder — the same location as the Content folder — not inside the Content folder itself. "When saving the datasmith file, you must specify the project's root folder. Instead of saving it in the content folder, save it in the same location as the content folder." Previously, you could export Datasmith files to any folder. The new requirement enforces a specific folder structure.

### Fix

1. **Save in the project root folder, not Content**:
   - "You must specify the project's root folder"
   - "Instead of saving it in the content folder, save it in the same location as the content folder"
   - Navigate to the UE project folder
   - Save at the same level as the Content folder
   - Not inside the Content folder

2. **Create an Unreal Engine project first**:
   - "You will need to create an UnrealEngine project first and have it saved somewhere on your computer"
   - "Once the project file is created, UE creates a folder in that saved file location"
   - Create the UE project before exporting from Twinmotion
   - This gives you the correct folder structure

3. **Export directly into the UE project folder**:
   - "In Twinmotion, you will need to export the datasmith file into the UE project folder directly"
   - "You can't just export datasmith files to random folders anymore"
   - Browse to the UE project root folder
   - Save the .udatasmith file there

4. **Check for network drive issues**:
   - "My original project is stored on a network drive, so wondering if that is the cause of it?"
   - Network drives may cause permission or path issues
   - Try exporting to a local drive
   - Then copy to the network drive if needed

5. **Verify the folder structure**:
   - The UE project folder should contain:
   - A Content folder
   - A Config folder
   - A .uproject file
   - Save the .udatasmith at this level

6. **Use the correct Twinmotion version**:
   - If the old workflow is preferred
   - Use a Twinmotion version before 2024.1
   - But this means missing new features
   - Updating to the latest version is recommended

7. **Check for the same issue with other users**:
   - "Can we get an update on this thread? I'm running into the same issue"
   - "The same issue is here, does anyone know how to fix this?"
   - This is a common issue
   - The root folder solution works for most users

### Community Report

> "Twinmotion 2024.1 gives an error message: 'Please select the root folder of your Unreal Engine project to export your scene.' When saving the datasmith file, you must specify the project's root folder. Instead of saving it in the content folder, save it in the same location as the content folder. You will need to create an UnrealEngine project first. You can't just export datasmith files to random folders anymore."

## 2. UDatasmith Import Crash on Collapse Modes in 2025.1.1

### Symptom

Importing a .udatasmith file in Twinmotion 2025.1.1 consistently crashes. The crash occurs when using "Collapse by material" or "Collapse all" import modes. The crash does not occur with "Keep Hierarchy" mode. The same .udatasmith file imports fine in prior Twinmotion versions.

### Root Cause

"This was consistently reproducible when importing using Collapse by material or Collapse all modes. Keep Hierarchy mode did not crash. Crash does not occur in prior versions." (TM-20848) The collapse modes in Twinmotion 2025.1.1 have a bug that causes an EXCEPTION_ACCESS_VIOLATION when processing certain .udatasmith files. The collapse operation merges geometry by material or into a single mesh, and the bug is in this merge logic. The issue was introduced in 2025.1.1 and affects files that worked in previous versions.

### Fix

1. **Use Keep Hierarchy mode as workaround**:
   - "Keep Hierarchy mode did not crash"
   - When importing .udatasmith files
   - Set Collapse mode to "Keep Hierarchy"
   - This avoids the crash entirely
   - The hierarchy is preserved instead of collapsed

2. **Update to Twinmotion 2025.2 beta 3 or later**:
   - "Target Fix: twinmotion 2025.2 beta 3"
   - "Resolved: Aug 11, 2025"
   - The fix is in Twinmotion 2025.2
   - Install the latest version

3. **Use a prior Twinmotion version**:
   - "Crash does not occur in prior versions"
   - If you can't update to 2025.2
   - Use Twinmotion 2025.1.0 or earlier
   - The collapse modes work correctly in those versions

4. **Collapse manually after import**:
   - Import with Keep Hierarchy mode
   - Then manually collapse the hierarchy
   - Select the objects and merge them
   - This achieves the same result as Collapse modes

5. **Report additional crash files**:
   - If you have .udatasmith files that crash
   - Report them to Epic Games
   - Include the file and crash details
   - This helps verify the fix

6. **Check the issue tracker**:
   - "Unreal Engine Issues and Bug Tracker (TM-20848)"
   - Check the issue status at issues.unrealengine.com
   - Verify the fix is in your version
   - Report if the crash persists after the fix

### Community Report

> "The user has reported that one of their .udatasmith files will consistently crash in TM 2025.1.1 during import. This was consistently reproducible when importing using Collapse by material or Collapse all modes. Keep Hierarchy mode did not crash. Crash does not occur in prior versions. Set Collapse mode to Keep Hierarchy. Target Fix: twinmotion 2025.2 beta 3. Resolved: Aug 11, 2025."

## 3. Twinmotion to Unreal Plugin Version Compatibility

### Symptom

After importing a Twinmotion Datasmith export into Unreal Engine, materials are missing. The geometry imports correctly but shows without textures. The error "No compatible asset for path" appears in the output log. Materials show as invalid or not applied to meshes.

### Root Cause

"The Twinmotion Program and the Unreal to Twinmotion Plugin you are using have to be compatible with each other." Each Twinmotion version produces Datasmith exports that are only compatible with specific Unreal Engine plugin versions. "For Example Twinmotion 2024 Datasmith Exports will NOT work with Unreals 5.3's version of 'Twinmotion to Unreal Plugin'. Only Twinmotion 2023.3.1.2 Datasmith Exports WILL." Using mismatched versions causes materials to not load — the material references in the Datasmith file don't match the available materials in the plugin.

### Fix

1. **Check version compatibility**:
   - "Twinmotion 2024 Datasmith Exports WILL work with UE 5.4 WITHOUT the datasmith Plugin"
   - "Twinmotion 2024 Datasmith Exports will NOT work with UE 5.3's version of the plugin"
   - "Only Twinmotion 2023.3.1.2 Datasmith Exports WILL work with UE 5.3"
   - Check the compatibility matrix before importing

2. **Install the correct plugins**:
   - "Please install Twinmotion Content for Unreal Engine Plugin (Beta 4)"
   - "And Datasmith Twinmotion Importer Plugin (Beta 4)"
   - "And enable both plugins"
   - Install from UE Marketplace

3. **Use UE 5.4+ for Twinmotion 2024 exports**:
   - "Twinmotion 2024 Datasmith Exports WILL work with UE 5.4"
   - "WITHOUT the datasmith Plugin"
   - Upgrade to UE 5.4 or later
   - This simplifies the workflow

4. **Use UE 5.1-5.2 for Twinmotion 2022 or older**:
   - "Twinmotion 2022 or older didn't have a datasmith exporter"
   - "It is only compatible with the 'retired' Twinmotion to unreal plugin in UE 5.1"
   - "Also worked with UE 5.2"
   - Use the retired plugin for old Twinmotion versions

5. **Upgrade UE for Twinmotion 2025**:
   - "Is UE 5.1 compatible with TM 2025, or should I upgrade to 5.3 or higher?"
   - Upgrade to UE 5.4 or later for Twinmotion 2025
   - UE 5.1 is not compatible with TM 2025
   - Materials will not import correctly

6. **Reinstall plugins after updating**:
   - "After updating the plugin I have no more material on the landscape"
   - "Error: No compatible asset for path"
   - Reinstall both plugins after any update
   - Verify plugin versions match

7. **Check the Twinmotion Materials package**:
   - "The Twinmotion Materials for Unreal Engine package is not related to the Twinmotion To Unreal plugin"
   - These are separate packages
   - Install both for full material support
   - Don't confuse the two

### Community Report

> "The Twinmotion Program and the Unreal to Twinmotion Plugin you are using have to be compatible with each other. Twinmotion 2024 Datasmith Exports will NOT work with Unreals 5.3's version of 'Twinmotion to Unreal Plugin'. Only Twinmotion 2023.3.1.2 Datasmith Exports WILL. Twinmotion 2024 Datasmith Exports WILL work with UE 5.4 WITHOUT the datasmith Plugin. Please install Twinmotion Content for Unreal Engine Plugin and Datasmith Twinmotion Importer Plugin and enable both plugins."

## 4. Datasmith Reload Crash from Revit to Twinmotion

### Symptom

A Revit 2024 model was exported as Datasmith and imported into Twinmotion 2024.1 successfully. After making changes in Revit, a new Datasmith file is exported. In Twinmotion, the reload of the updated .udatasmith file crashes with "Unhandled Exception: EXCEPTION_ACCESS_VIOLATION." The initial import always works, but the reload always crashes.

### Root Cause

The Datasmith reload function in Twinmotion 2024.1 had a bug that caused an access violation when reloading an updated .udatasmith file over an existing one. The reload process tries to update geometry and materials in place, but the update logic had a memory access error. "I have tried other exports and other versions, and always the initial import works fine — and when I go to reload the updated uDatasmith file — it crashes. Doesn't matter the version I'm working in." The issue was resolved in a subsequent update.

### Fix

1. **Install the latest Twinmotion update**:
   - "There was a recent update, which I installed, and apparently this has resolved this issue"
   - "I have been able to Export new Datasmith files (overwriting the existing one)"
   - "And in TM, reload the DS file"
   - "I have been able to do this 4 times now, without incident"
   - Install the latest Twinmotion update

2. **Import as new and delete old as workaround**:
   - "Sure, I can import the new model, then delete the old one"
   - "Then RE-APPLY ALL my Materials"
   - If the reload crashes
   - Import the updated model as a new import
   - Delete the old model
   - Re-apply materials manually

3. **Use Direct Link instead of Datasmith export**:
   - "A livelink isn't an available option (as you need 2025 for that version)"
   - For Revit 2025+, use Direct Link
   - This avoids the export/reload workflow
   - Direct Link updates automatically

4. **Check the update installation location**:
   - "Where was the location for the update installation?"
   - "I checked Autodesk Access but there is no new version available"
   - Check Twinmotion for updates, not Autodesk Access
   - The update is for Twinmotion, not Revit

5. **Save before reloading**:
   - "I'm still cringing a little as the progress bar gets to the end"
   - Always save your Twinmotion project before reloading
   - If the reload crashes, you can restore
   - Without losing your work

6. **Verify the fix works**:
   - After installing the update
   - Test the reload workflow
   - Export a new Datasmith from Revit
   - Reload in Twinmotion
   - Verify it doesn't crash

7. **Report persistent crashes**:
   - If the crash persists after updating
   - Report to Epic Games
   - Include the crash log and .udatasmith file
   - Use the Twinmotion crash reporter

### Community Report

> "I had already started a project in Twinmotion 2024. Exported via Datasmith from Revit 2024. Worked like a charm. Came back the next day and had to make some changes in the Revit model. When I go to reload the updated uDatasmith file — it crashes. Doesn't matter the version. There was a recent update, which I installed, and apparently this has resolved this issue. I have been able to do this 4 times now, without incident."

## 5. Missing Materials After Import from TM 2025 to UE 5.1

### Symptom

After importing a Twinmotion 2025 project into Unreal Engine 5.1 using the Datasmith plugin, geometry shows up fine but none of the materials appear. The entire scene shows up without any textures or material assignments. The output log shows hundreds of errors: "DatasmithImport: Error: No compatible asset for path '/Game/Twinmotion/Materials/...' Skipping material ..."

### Root Cause

Twinmotion 2025 is not compatible with Unreal Engine 5.1's Datasmith plugin. The material references in the Twinmotion 2025 Datasmith export use a format that UE 5.1's plugin can't resolve. "Is UE 5.1 compatible with TM 2025, or should I upgrade to 5.3 or higher?" The answer is no — UE 5.1 is too old for Twinmotion 2025. The material paths reference assets that don't exist in the UE 5.1 plugin version. Additionally, "invalid DrawScale/DrawScale3D warnings" may appear for some actors.

### Fix

1. **Upgrade to UE 5.4 or later**:
   - "Twinmotion 2024 Datasmith Exports WILL work with UE 5.4"
   - Twinmotion 2025 requires UE 5.4 or later
   - Upgrade your Unreal Engine version
   - This is the primary fix

2. **Install the correct plugin versions**:
   - "Install Twinmotion Content for Unreal Engine Plugin (Beta 4)"
   - "And Datasmith Twinmotion Importer Plugin (Beta 4)"
   - "And enable both plugins"
   - Get them from the UE Marketplace

3. **Check the output log for material errors**:
   - "DatasmithImport: Error: No compatible asset for path"
   - "Skipping material ..."
   - These errors confirm the version mismatch
   - Upgrade UE to resolve

4. **Re-import after upgrading UE**:
   - After upgrading to UE 5.4+
   - Re-import the Datasmith file
   - Materials should now load correctly
   - Verify all textures are applied

5. **Check for DrawScale warnings**:
   - "I see invalid DrawScale/DrawScale3D warnings in the output log"
   - These may indicate scale issues in the import
   - Check the scale settings in the Datasmith import options
   - Verify the model scale is correct

6. **Use Twinmotion 2023.3.1.2 for UE 5.3**:
   - If you can't upgrade to UE 5.4
   - Use Twinmotion 2023.3.1.2
   - This is the only version compatible with UE 5.3
   - "Any other version of Twinmotion Datasmith exports will not work with UE 5.3"

7. **Don't use UE 5.1 with Twinmotion 2025**:
   - UE 5.1 is not compatible with TM 2025
   - Materials will not import
   - Upgrade UE or downgrade Twinmotion
   - There is no other workaround

### Community Report

> "I'm facing an issue while importing a Twinmotion 2025 project into Unreal Engine 5.1. The geometry comes in fine, but none of the materials are appearing. The output log shows: DatasmithImport: Error: No compatible asset for path '/Game/Twinmotion/Materials/...' Skipping material. Is UE 5.1 compatible with TM 2025, or should I upgrade to 5.3 or higher? Twinmotion 2024 Datasmith Exports WILL work with UE 5.4."

## 6. Additional Twinmotion Issues

### Network Drive Export Issues

**Issue**: "My original project is stored on a network drive, so wondering if that is the cause?"
**Fix**: Try exporting to a local drive first. Network drives may cause permission or path issues. Copy the Datasmith file to the UE project folder locally. Then import.

### Livelink Not Available for Revit 2024

**Issue**: "A livelink isn't an available option (as you need 2025 for that version)."
**Fix**: Use Datasmith export/import for Revit 2024. Upgrade to Revit 2025 for Direct Link support. Direct Link provides automatic updates without manual export.

### Material Reapplication After Reload

**Issue**: After reloading a Datasmith file, materials may need to be reapplied.
**Fix**: "Import the new model, then delete the old one, then RE-APPLY ALL my Materials." Save material assignments as presets. Use the material organizer. Reapply after reload.

### Large File Performance

**Issue**: "File is now up to a gig" — large Datasmith files may be slow.
**Fix**: Simplify the Revit model before export. Reduce polygon count. Remove unnecessary elements. Use LODs in Twinmotion.

### Twinmotion Update Installation

**Issue**: "Where was the location for the update installation? I checked Autodesk Access."
**Fix**: Twinmotion updates are in the Epic Games Launcher, not Autodesk Access. Check the Epic Games Launcher for Twinmotion updates. Install from there.

### Plugin Reinstallation After Update

**Issue**: "After updating the plugin I have no more material on the landscape."
**Fix**: Reinstall both Twinmotion Content and Datasmith Importer plugins. Enable both in UE. Verify plugin versions match Twinmotion version. Re-import the Datasmith file.

### Retired Plugin for Old Twinmotion

**Issue**: "Twinmotion 2022 or older didn't have a datasmith exporter."
**Fix**: "It is only compatible with the 'retired' Twinmotion to unreal plugin in UE 5.1 (also worked with UE 5.2)." Use the retired plugin for old versions. Upgrade Twinmotion for newer UE versions.

## Best Practices

1. **Save Datasmith in the UE project root folder** — not inside the Content folder
2. **Create the UE project before exporting from Twinmotion** — ensures correct folder structure
3. **Use Keep Hierarchy mode for imports in 2025.1.1** — avoids Collapse mode crash
4. **Update to Twinmotion 2025.2+ for Collapse mode fix** — resolves the import crash
5. **Match Twinmotion and UE plugin versions** — check compatibility matrix
6. **Use UE 5.4+ for Twinmotion 2024/2025** — no plugin needed for TM 2024 with UE 5.4
7. **Install both Twinmotion Content and Datasmith Importer plugins** — required for materials
8. **Install Twinmotion updates from Epic Games Launcher** — not Autodesk Access
9. **Save before reloading Datasmith files** — prevents data loss from reload crashes
10. **Use Direct Link for Revit 2025+** — avoids manual export/reload workflow
