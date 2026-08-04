---
title: "Spatial Editor 2026 Crashes on Model Import from Insufficient Disk Space and RAM, No 3D Model Visible After CAD Import from Missing Part References in CATIA Assembly Files, Very Slow CAD Import from Native vs Neutral Format Differences, ntdll.dll Corruption Causing Crash on Application Close, and Network License Check Failure Without Network Connection: Disk Space Cleanup, Part File Verification, Native Format Preference, Windows System Repair, and Network Connectivity"
excerpt: "Spatial Editor fails for 5 distinct reasons: crashes on model import from insufficient disk space and RAM requiring disk space cleanup, no 3D model visible after CAD import from missing part references in CATIA assembly files requiring part file verification, very slow CAD import from native vs neutral format differences requiring native format preference, ntdll.dll corruption causing crash on application close requiring Windows system repair, and network license check failure without network connection requiring network connectivity. We cover each with fixes from TeamViewer support."
category: "import-and-crash-errors"
softwareSlug: "spatial-planner"
keyword: "Spatial Editor 2026 crashes model import insufficient disk space RAM no 3D model visible CAD import missing part references CATIA assembly files very slow CAD import native neutral format ntdll.dll corruption crash application close network license check failure"
slug: "spatial-editor-2026-crash-import-disk-space-missing-part-references-slow-native-format-ntdll-license-network"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-frontline/frontline-spatial/troubleshooting/spatial-editor-troubleshooting/"
  - "https://success.blueyonder.com/s/article/Space-Planning-crashing-and-dump-files-are-getting-generated"
  - "https://success.blueyonder.com/s/article/Space-Planning-crashes-when-closing-APP-CRASH-message-lists-ntdll-dll-file?language=en_US"
---

# Spatial Editor 2026 Crashes on Model Import from Insufficient Disk Space and RAM, No 3D Model Visible After CAD Import from Missing Part References in CATIA Assembly Files, Very Slow CAD Import from Native vs Neutral Format Differences, ntdll.dll Corruption Causing Crash on Application Close, and Network License Check Failure Without Network Connection: Disk Space Cleanup, Part File Verification, Native Format Preference, Windows System Repair, and Network Connectivity

Spatial Editor produces errors from import crashes, missing parts, slow imports, ntdll.dll corruption, and license check failures. This guide covers the 5 most common Spatial Editor problems with diagnostic steps and community-verified fixes from TeamViewer support.

## 1. Crashes on Model Import from Insufficient Disk Space and RAM

### Symptom

The Spatial Editor crashes while importing a 3D CAD model. The crash occurs during the import process. Large models cause intensive RAM consumption. When total memory capacity is reached, data is swapped to the hard disk. A crash occurs if there is no disk space left.

### Root Cause

"No remaining disk space: Large models lead to intensive computer memory (RAM) consumption while importing. When the total memory capacity is reached, data is swapped out to the hard disk to make space within the RAM memory. A crash can happen if there is no disk space left in the computer." Large CAD models consume significant RAM during import. When RAM is exhausted, the system uses virtual memory (disk swap). If the disk is also full, the swap fails and the application crashes.

### Fix

1. **Free up disk space**:
   - "No remaining disk space"
   - "A crash can happen if"
   - "There is no disk space left"
   - Free disk space

2. **Increase available RAM**:
   - Large models need
   - Sufficient RAM
   - To avoid
   - Excessive swapping

3. **Close other applications**:
   - Close other
   - Memory-intensive
   - Applications before
   - Importing large models

4. **Increase virtual memory**:
   - Increase Windows
   - Virtual memory
   - (page file) size
   - For better swap capacity

5. **Use smaller models**:
   - Split large models
   - Into smaller parts
   - For import
   - Individually

6. **Check disk space before import**:
   - Verify sufficient
   - Disk space before
   - Starting the
   - Import process

7. **Use SSD for swap file**:
   - Use an SSD
   - For the swap file
   - To improve
   - Swap performance

### Community Report

> "Spatial Editor Crashes on Model Import. There are two possible reasons why the Editor might crash while importing a model: No remaining disk space: Large models lead to intensive computer memory (RAM) consumption while importing. When the total memory capacity is reached, data is swapped out to the hard disk to make space within the RAM memory. A crash can happen if there is no disk space left in the computer."

## 2. No 3D Model Visible After CAD Import from Missing Part References in CATIA Assembly Files

### Symptom

The CAD import finishes without an error message but no 3D model is shown in the Spatial Editor. The import appears successful but the viewport is empty. The issue occurs with CATIA files that consist of separate assembly and part files.

### Root Cause

"Missing part references: Some CAD formats (such as CATIA) consist of separate assembly and part files. This means that the assembly files only include the 3D model/product structure and the actual geometry is included within the part files. If the part files are missing in the folder of the CAD model, the geometry cannot be imported and only empty references are loaded in the Spatial Editor." CATIA assembly files reference external part files for the actual geometry. If the part files are not in the same folder as the assembly file, only the structure is loaded without geometry, resulting in an empty viewport.

### Fix

1. **Verify all part files are present**:
   - "If the part files are missing"
   - "In the folder of the CAD model"
   - "The geometry cannot be imported"
   - Check part files

2. **Keep part files in same folder**:
   - Keep all part files
   - In the same folder
   - As the assembly
   - File

3. **Check file references**:
   - Verify file
   - References in the
   - Assembly file
   - Are correct

4. **Use neutral format (STEP) instead**:
   - If part files
   - Can't be located
   - Export as STEP
   - From original CAD

5. **Consolidate files before import**:
   - Consolidate all
   - Assembly and part
   - Files into one
   - Folder before import

6. **Check for missing file prompts**:
   - Check if Spatial Editor
   - Prompts for
   - Missing part
   - Files

7. **Contact development team**:
   - "Contact the development team"
   - "At frontline-service@teamviewer.com"
   - If issue persists
   - With all files present

### Community Report

> "Can't see any 3D model after CAD 3D model import. If the import finishes without an error message but with no 3D model shown, there are two possible reasons: Missing part references: Some CAD formats (such as CATIA) consist of separate assembly and part files. If the part files are missing in the folder of the CAD model, the geometry cannot be imported and only empty references are loaded in the Spatial Editor."

## 3. Very Slow CAD Import from Native vs Neutral Format Differences

### Symptom

The Spatial Editor is very slow during CAD 3D model import. Import times are excessively long for certain file formats. The slowness varies significantly depending on the CAD file format used.

### Root Cause

"CAD file format: Some formats - especially the native ones such as CATIA, JT, etc. - are much faster in importing than others such as STEP (very slow)." Native CAD formats (CATIA, JT) are faster to import because they don't require format translation. Neutral formats like STEP require translation through the CAD SDK, which is significantly slower. The translation process parses and converts the geometry, adding overhead.

### Fix

1. **Use native formats when possible**:
   - "Some formats - especially the native ones"
   - "Such as CATIA, JT, etc."
   - "Are much faster in importing"
   - Use native formats

2. **Avoid STEP for large models**:
   - STEP is
   - "Very slow"
   - For large models
   - Avoid if possible

3. **Use JT format for large assemblies**:
   - JT format
   - Is fast for
   - Large assemblies
   - Use JT

4. **Convert to native format before import**:
   - Convert STEP
   - To native format
   - Before importing
   - To Spatial Editor

5. **Split large models**:
   - Split large models
   - Into smaller parts
   - For faster
   - Import

6. **Check CAD SDK version**:
   - "We have to forward"
   - "The issue to our CAD SDK"
   - "Provider, Spatial Corp"
   - Check SDK version

7. **Be patient with STEP imports**:
   - For STEP imports
   - Allow sufficient
   - Time for
   - The translation

### Community Report

> "Spatial Editor is very slow during a CAD 3D model import. The following factors can affect the import duration of a CAD model: CAD file format: Some formats - especially the native ones such as CATIA, JT, etc. - are much faster in importing than others such as STEP (very slow)."

## 4. ntdll.dll Corruption Causing Crash on Application Close

### Symptom

The application crashes when closing. The APP CRASH message lists ntdll.dll as the faulting module. The crash occurs specifically during the application shutdown sequence. The issue is caused by a corrupted Windows system file.

### Root Cause

"Space Planning crashes when closing. APP CRASH message lists ntdll.dll file. This is a Windows file located in C:\Windows\System32 that has been corrupted. Consult your IT department to either repair this file, or reimage your computer." The ntdll.dll file in C:\Windows\System32 is corrupted. This Windows system file is critical for application operation. When corrupted, it causes crashes during application shutdown.

### Fix

1. **Repair ntdll.dll file**:
   - "Consult your IT department"
   - "To either repair this file"
   - "Or reimage your computer"
   - Repair ntdll.dll

2. **Run System File Checker**:
   - Run sfc /scannow
   - In Command Prompt
   - As Administrator
   - To repair system files

3. **Run DISM tool**:
   - Run DISM /Online
   - /Cleanup-Image /RestoreHealth
   - To repair
   - Windows image

4. **Reimage the computer**:
   - If repair doesn't work
   - Reimage the
   - Computer with
   - A fresh Windows install

5. **Check for malware**:
   - Run malware scan
   - As malware can
   - Corrupt system
   - Files like ntdll.dll

6. **Update Windows**:
   - Install all
   - Windows updates
   - To ensure system
   - Files are current

7. **Check dump files**:
   - Check crash dump
   - Files for
   - Additional error
   - Information

### Community Report

> "Space Planning crashes when closing. APP CRASH message lists ntdll.dll file. This is a Windows file located in C:\Windows\System32 that has been corrupted. Consult your IT department to either repair this file, or reimage your computer."

## 5. Network License Check Failure Without Network Connection

### Symptom

The CAD import feature doesn't work without a network connection. The license check fails when offline. The Spatial Editor cannot import CAD models without network connectivity. The issue occurs when using the Spatial Editor without internet access.

### Root Cause

"The CAD import feature has to be enabled by TeamViewer because it results in extra costs with the external SDK provider. When using the Spatial Editor without a network connection, the license check cannot be performed." The CAD import feature requires a license check that depends on network connectivity. The license check verifies the CAD SDK license with TeamViewer's servers. Without network access, the license check fails and CAD import is disabled.

### Fix

1. **Ensure network connectivity**:
   - "When using the Spatial Editor"
   - "Without a network connection"
   - "The license check cannot be performed"
   - Ensure network

2. **Check internet connection**:
   - Verify internet
   - Connection is
   - Active before
   - Using CAD import

3. **Configure firewall settings**:
   - Check firewall
   - Settings to allow
   - License check
   - Communication

4. **Use offline license if available**:
   - Check if offline
   - License option
   - Is available
   - For CAD import

5. **Contact TeamViewer support**:
   - "Contact the development team"
   - "At frontline-service@teamviewer.com"
   - For license
   - Issues

6. **Check proxy settings**:
   - Verify proxy
   - Settings don't
   - Block license
   - Check traffic

7. **Plan for offline work**:
   - Pre-import CAD models
   - While online
   - For offline
   - Use later

### Community Report

> "3D Model format missing for import. The CAD import feature has to be enabled by TeamViewer because it results in extra costs with the external SDK provider. When using the Spatial Editor without a network connection, the license check cannot be performed."

## 6. Additional Spatial Editor Issues

### CAD Model Format Issues

**Issue**: "Problems/issues with the 3D CAD model format: An issue with the 3D CAD model format can only be investigated by the development team."
**Fix**: Contact frontline-service@teamviewer.com. Share the CAD model file for investigation. Check if issue is with SDK provider (Spatial Corp).

### Space Planning Crash with Dump Files

**Issue**: "Space Planning crashing and dump files are getting generated simultaneously."
**Fix**: Apply patch for ITX-71936, ITX-71937, ITX-71854. Raise a case for the patch. Refer to release notes for install instructions. Fixed in 2018.1.2.12.

### Multiple Crash Issues Fixed in Patch

**Issue**: "Fixed in 2018.1.2.12 - Multiple Issues, ITX-71936, ITX-71937, ITX-71854."
**Fix**: Request the patch from support. Follow patch installation instructions. Verify crash issues resolved after patch.

### CAD SDK Provider Issues

**Issue**: "If our investigation results with no bug on our side, we have to forward the issue to our CAD SDK provider, Spatial Corp."
**Fix**: Report issue to TeamViewer. They will investigate and forward to Spatial Corp if needed. Check for SDK updates.

### Large Model Memory Consumption

**Issue**: "Large models lead to intensive computer memory (RAM) consumption while importing."
**Fix**: Use smaller models. Increase RAM. Free up disk space. Close other applications. Use SSD for swap.

### Import Cancel Option

**Issue**: "Click Stop in the status bar to cancel an import while it is in progress."
**Fix**: Use Stop button for long imports. Check partial import results. Verify Status Log for import status.

### File Path Invalid Characters

**Issue**: "If there is an invalid character in the path of a file you are trying to open or insert, that character is replaced with a valid character to avoid errors."
**Fix**: Check file paths for invalid characters. Let Spatial Editor replace invalid characters. Verify file path after replacement.

## Best Practices

1. **Free up disk space before importing large models** — prevents crash from swap failure
2. **Keep all CATIA part files in the same folder as assembly file** — prevents empty import
3. **Use native formats (CATIA, JT) instead of STEP for faster import** — STEP is very slow
4. **Run sfc /scannow to repair corrupted ntdll.dll** — fixes crash on application close
5. **Ensure network connectivity for CAD import license check** — prevents license failure
6. **Close other memory-intensive applications before import** — frees RAM for large models
7. **Use SSD for swap file to improve swap performance** — reduces import crash risk
8. **Split large models into smaller parts for import** — reduces memory consumption
9. **Contact frontline-service@teamviewer.com for CAD format issues** — development team support
10. **Apply patches for known crash issues** — check for available patches from support
