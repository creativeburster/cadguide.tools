---
title: "Autodesk ReCap Pro 2026 Point Cloud Stuck at Percentage During Import and Indexing, FARO FLS Scan Import Freeze and Crash on Windows 11, FARO SDK Discontinued in ReCap Pro 2025, Missing Data from FARO Focus Premium Import, and ReCap Pro 2027 FARO SDK Update for Topcon and Orbis: Project Split, Version Rollback, SCENE Processing, RCS Export, and 2027 Update"
excerpt: "ReCap Pro fails for 5 distinct reasons: point cloud stuck at percentage during import and indexing requiring project split, FARO FLS scan import freeze and crash on Windows 11 requiring version rollback, FARO SDK discontinued in ReCap Pro 2025 requiring SCENE processing, missing data from FARO Focus Premium import requiring RCS export workaround, and ReCap Pro 2027 FARO SDK update for Topcon and Orbis requiring 2027 update. We cover each with fixes from Autodesk community."
category: "troubleshooting"
softwareSlug: "recap-pro"
keyword: "Autodesk ReCap Pro 2026 point cloud stuck percentage import indexing FARO FLS scan import freeze crash Windows 11 FARO SDK discontinued ReCap Pro 2025 missing data FARO Focus Premium import ReCap Pro 2027 FARO SDK Topcon Orbis"
slug: "recap-pro-2026-point-cloud-stuck-faro-fls-freeze-sdk-discontinued-missing-data-2027-update"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Pointcloud-is-stuck-at-a-certain-percentage-when-importing-and-indexing-scans-in-ReCap-Pro.html"
  - "https://forums.autodesk.com/t5/recap-forum/importing-scans-freeze/td-p/13073482"
  - "https://forums.autodesk.com/t5/recap-forum/recap-not-importing-all-data-from-faro-focus-premium/td-p/14057559"
---

# Autodesk ReCap Pro 2026 Point Cloud Stuck at Percentage During Import and Indexing, FARO FLS Scan Import Freeze and Crash on Windows 11, FARO SDK Discontinued in ReCap Pro 2025, Missing Data from FARO Focus Premium Import, and ReCap Pro 2027 FARO SDK Update for Topcon and Orbis: Project Split, Version Rollback, SCENE Processing, RCS Export, and 2027 Update

ReCap Pro produces errors from point cloud indexing, FARO import, SDK discontinuation, missing data, and version compatibility. This guide covers the 5 most common ReCap Pro problems with diagnostic steps and community-verified fixes from Autodesk community.

## 1. Point Cloud Stuck at Percentage During Import and Indexing

### Symptom

When importing or indexing scans, ReCap Pro hangs at a certain percentage and does not progress. The hang can also occur when navigating in a ReCap project or trying to save it. The issue occurs with large projects and may persist for extended periods.

### Root Cause

"ReCap Pro may temporarily stick at a certain percentage, but after a while, it will progress with the indexing process." The indexing process for large point cloud projects can take significant time. The progress bar may appear stuck while the indexing engine processes large amounts of data. Insufficient disk space on C:\ drive can also cause the indexing to not finish.

### Fix

1. **Allow more time for large projects**:
   - "Allow more time, especially if the project is large"
   - "ReCap Pro may temporarily stick"
   - "But after a while, it will progress"
   - Wait for large projects

2. **Split project into smaller ones**:
   - "Split the project into smaller ones"
   - "Create two or more new projects"
   - "And import portions of the scans there"
   - Split large projects

3. **Ensure C:\ drive has enough space**:
   - "Make sure that there is enough space"
   - "On the C:\ drive"
   - "More than 10% capacity"
   - Ensure disk space

4. **Check for tmp files in support folder**:
   - "Check for tmp files in the support folder"
   - "If found, either registration or indexing"
   - "Fails to generate RCS files"
   - Check for tmp files

5. **Save files locally**:
   - "Save files locally"
   - "To rule out network issues"
   - Save locally
   - Not on network

6. **Run as Administrator**:
   - "Run the program as Administrator"
   - Run ReCap Pro
   - As Administrator
   - For proper permissions

7. **Update ReCap Pro**:
   - "Update ReCap Pro to the latest version"
   - Update to
   - Latest version
   - For bug fixes

### Community Report

> "Users reported that when importing or indexing scans, ReCap Pro hangs at a certain percentage and does not progress. Allow more time, especially if the project is large. Split the project into smaller ones. Make sure that there is enough space on the C:\ drive (more than 10% capacity). Save files locally to rule out network issues. Run the program as Administrator. Update ReCap Pro to the latest version."

## 2. FARO FLS Scan Import Freeze and Crash on Windows 11

### Symptom

When importing FARO FLS scans into ReCap Pro on Windows 11, the import freezes and crashes. The freeze occurs at the cloud import step. The issue occurs on new Windows 11 desktops with better specs than older Windows 10 machines that work fine. All ReCap releases including 2027 experience the freeze.

### Root Cause

The FARO FLS import on Windows 11 has compatibility issues with certain hardware configurations. The freeze may be related to GPU driver compatibility, FARO SDK integration, or Windows 11-specific system changes that affect the FARO scan import process.

### Fix

1. **Roll back to ReCap Pro 2024**:
   - "My solution was to go back"
   - "To Recap Pro 2024"
   - "Where the import works like always"
   - Roll back to 2024

2. **Remove ReCap Pro 2025 before installing 2024**:
   - "You can not have 2 Recap installations"
   - "In parallel on your machine"
   - "You need to remove Recap Pro 2025"
   - "Before installing Recap Pro 2024"
   - Remove 2025 first

3. **Try ReCap Pro 2023**:
   - "Maybe the 2023 is"
   - "The more stable one for FARO"
   - Try 2023
   - For FARO stability

4. **Update GPU drivers**:
   - Update GPU drivers
   - To latest version
   - For Windows 11
   - Compatibility

5. **Check FARO SDK installation**:
   - "The Autodesk Recap FARO converter"
   - "Is missing in the task manager"
   - "When using 2025"
   - Check FARO converter

6. **Use FARO SCENE LT workaround**:
   - "See that video for a workaround"
   - "It shows Recap Pro 2023"
   - "And FARO SCENE LT 2022"
   - Use SCENE LT

7. **Try ReCap Pro 2027**:
   - "The latest ReCap 2027 Release"
   - "Contains the latest FARO SDK"
   - Try 2027
   - For latest SDK

### Community Report

> "Since I purchased my new Windows 11 desktop I tried with no success all Recap releases including the 2027 and ended up with freeze and crash at the cloud import step. My solution was to go back to Recap Pro 2024 where the import works like always. You can not have 2 Recap installations in parallel. You need to remove Recap Pro 2025 before installing Recap Pro 2024."

## 3. FARO SDK Discontinued in ReCap Pro 2025

### Symptom

In ReCap Pro 2025, FARO FLS scan import fails. The "Autodesk ReCap FARO converter" is missing from the Task Manager. The import freezes or doesn't start. The issue doesn't occur in ReCap Pro 2024 or earlier versions.

### Root Cause

"I think it has something to do with FARO discontinued its own SDK. Therefore it is not implemented in Recap Pro 2025 any more and the import fails. My opinion is that FARO wants to sell another licence for their SCENE software. The Autodesk Recap FARO converter is missing in the task manager when using 2025." FARO discontinued its SDK, and Autodesk didn't include it in ReCap Pro 2025. Without the FARO SDK, ReCap Pro can't convert FARO FLS files, causing the import to fail.

### Fix

1. **Use ReCap Pro 2024 or earlier**:
   - "Go back to Recap Pro 2024"
   - "Where the import works like always"
   - Use 2024
   - For FARO import

2. **Process in FARO SCENE first**:
   - "Process all scans in Scene first"
   - "Then export all the FLS files"
   - "Back out after processing"
   - Use SCENE processing

3. **Export as RCS from SCENE**:
   - "Export the cleaned point cloud"
   - "As an RCS file"
   - Export RCS from SCENE
   - Import RCS to ReCap

4. **Use ReCap Pro 2027 with latest SDK**:
   - "The latest ReCap 2027 Release"
   - "Contains the latest FARO SDK"
   - "To enable Faro-Topcon and Faro Orbis support"
   - Use 2027

5. **Import processed scans**:
   - "I then bring the processed scans"
   - "Into Recap and it works fine"
   - Import processed
   - Not raw scans

6. **Batch import for large datasets**:
   - "I recommend doing a few at a time"
   - "Letting those process"
   - "Then do another batch"
   - Batch import

7. **Let run overnight for 80+ scans**:
   - "It'll take a very long time"
   - "To initially start processing in Recap"
   - "(30-60 minutes) if you've imported 80+ scans"
   - Let run overnight

### Community Report

> "I think it has something to do with FARO discontinued its own SDK. Therefore it is not implemented in Recap Pro 2025 any more and the import fails. The Autodesk Recap FARO converter is missing in the task manager when using 2025. My solution was to go back to Recap Pro 2024 where the import works like always. Process all scans in Scene first, then export all the FLS files back out after processing."

## 4. Missing Data from FARO Focus Premium Import

### Symptom

When importing FARO Focus Premium scan FLS folders into ReCap, data appears to be missing. The data is present when viewed in FARO SCENE. Registration and data integrity are fine in SCENE. ReCap doesn't import all the data, as if data is missing. The issue occurs with the latest ReCap version.

### Root Cause

ReCap Pro's FARO import engine doesn't properly handle all data from FARO Focus Premium scans. The import may skip or lose certain data elements during the conversion process. The issue may be related to the FARO SDK version or data format incompatibility between FARO and ReCap.

### Fix

1. **Process in SCENE first**:
   - "I usually do is process all scans"
   - "In Scene first"
   - "Then export all the FLS files"
   - "Back out after processing"
   - Process in SCENE

2. **Import processed scans to ReCap**:
   - "I then bring the processed scans"
   - "Into Recap and it works fine"
   - Import processed
   - Scans to ReCap

3. **Export as RCS from SCENE**:
   - "Export the cleaned point cloud"
   - "As an RCS file"
   - Export RCS
   - Import to ReCap

4. **Use ReCap Pro 2027**:
   - "The latest ReCap 2027 Release"
   - "Contains the latest FARO SDK"
   - "It is working without data loss"
   - Use 2027

5. **Batch import**:
   - "Doing a few at a time"
   - "Letting those process"
   - "Then do another batch"
   - Batch import

6. **Let run overnight**:
   - "Just let it run over night"
   - For 80+ scans
   - Let run
   - Overnight

7. **Check for Ricoh Z1 camera issue**:
   - "If you use the Ricoh Z1 camera"
   - "For creating the colored scans"
   - "Then Recap cannot process them"
   - Check camera compatibility

### Community Report

> "When i do the same with Recap i get the following - it's like the data is missing. I usually process all scans in Scene first, then export all the FLS files back out after processing. I then bring the processed scans into Recap and it works fine. The latest ReCap 2027 Release contains the latest FARO SDK. It is working without data loss for the data that we are testing with."

## 5. ReCap Pro 2027 FARO SDK Update for Topcon and Orbis

### Symptom

FARO-Topcon and FARO Orbis scan support is missing in older ReCap Pro versions. The latest FARO SDK is needed for these scanner types. ReCap Pro 2027 includes the updated FARO SDK. Users with Topcon or Orbis scanners need to update to 2027.

### Root Cause

"The latest ReCap 2027 Release contains the latest FARO SDK to enable Faro-Topcon and Faro Orbis support. It is working without data loss for the data that we are testing with." Older ReCap Pro versions don't include the latest FARO SDK, which is required for FARO-Topcon and FARO Orbis scanner support. ReCap Pro 2027 includes the updated SDK.

### Fix

1. **Update to ReCap Pro 2027**:
   - "The latest ReCap 2027 Release"
   - "Contains the latest FARO SDK"
   - Update to 2027
   - For Topcon/Orbis

2. **Verify data import**:
   - "It is working without data loss"
   - "For the data that we are testing with"
   - Verify data
   - Import results

3. **Report persistent data loss**:
   - "Please let us know"
   - "If your data is still failing"
   - "So that we can investigate further"
   - Report data loss

4. **Check FARO SDK version**:
   - Verify the FARO SDK
   - Version in ReCap
   - Matches the
   - Scanner requirements

5. **Test with sample data**:
   - Test with sample
   - FARO-Topcon or
   - FARO Orbis data
   - Before production

6. **Verify scan registration**:
   - Verify scans are
   - Properly registered
   - Before importing
   - To ReCap

7. **Use RCS export from SCENE**:
   - If direct import fails
   - Export RCS from SCENE
   - And import to ReCap
   - As workaround

### Community Report

> "The latest ReCap 2027 Release contains the latest FARO SDK to enable Faro-Topcon and Faro Orbis support. It is working without data loss for the data that we are testing with. It would be worth checking this out if you get a chance. Please let us know if your data is still failing so that we can investigate further."

## 6. Additional ReCap Pro Issues

### Manual Registration Workflow

**Issue**: "Register the scans. Perform a manual registration. Follow the instructions on the manual registration screen."
**Fix**: Use manual registration for scan alignment. Select common targets between scans. Index scans before registration.

### Panorama Import Issues

**Issue**: "If the issue happens when importing and indexing the scans with panoramas."
**Fix**: Export cleaned point cloud as RCS. Rename panoramas in support file. Import both RCS and renamed panoramas. Save as e57 and merge.

### E57 Export and Merge

**Issue**: "Save the new projects as e57 files and merge them to obtain the final result of the point cloud."
**Fix**: Export as e57 files. Merge e57 files for final result. Use e57 format for panorama data.

### RCS File Import

**Issue**: "Select all RCC files of the point cloud and import them. The data must be structured."
**Fix**: Import RCC files with structured data. Verify data structure before import. Use RCS format for cleaned data.

### Network Drive Issues

**Issue**: "Save files locally to rule out network issues."
**Fix**: Save files on local drive. Avoid network drives for scan files. Check network connection stability.

### tmp Files in Support Folder

**Issue**: "Check for tmp files in the support folder. If found, either registration or indexing fails to generate RCS files."
**Fix**: Check support folder for tmp files. Delete tmp files. Re-run registration or indexing.

### C:\ Drive Space

**Issue**: "If the C:\ drive is low on space, the indexing might not finish (make sure that the C:\ has more than 10% capacity)."
**Fix**: Ensure C:\ drive has more than 10% free space. Clean up temporary files. Move non-essential files to other drives.

### Project Creation Before Import

**Issue**: "Create a project in ReCap Pro. Select all RCC files of the point cloud and import them."
**Fix**: Create project first. Import RCC files into project. Register scans after indexing. Save project after registration.

## Best Practices

1. **Split large projects into smaller ones** — prevents indexing hang at percentage
2. **Ensure C:\ drive has >10% free space** — indexing requires temporary space
3. **Use ReCap Pro 2024 for FARO FLS import** — 2025+ has discontinued FARO SDK
4. **Process scans in FARO SCENE first** — then export and import to ReCap
5. **Export RCS from SCENE as workaround** — import RCS to ReCap for missing data
6. **Update to ReCap Pro 2027 for FARO-Topcon and Orbis** — latest FARO SDK
7. **Save files locally, not on network** — rules out network issues
8. **Run as Administrator** — ensures proper permissions for indexing
9. **Batch import for 80+ scans** — do a few at a time, let process, then more
10. **Check for tmp files in support folder** — delete to fix RCS generation failure
