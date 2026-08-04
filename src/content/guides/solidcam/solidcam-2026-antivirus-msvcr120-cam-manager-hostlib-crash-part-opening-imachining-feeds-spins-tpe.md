---
title: "SolidCAM 2026 SolidCAM.exe Deleted by Anti-Virus from Quarantine, MSVCR120.dll Missing from Missing Visual C++ Redistributable, SolidCAM Add-In Cam Manager Initialization Failure from Registration Issue, SolidWorks and SolidCAM Crash Without Error Reports on Part Opening, and iMachining 3D Incorrect Feeds and Spins for Floor Machining from TPE Bug: Anti-Virus Exclusion, VC++ Redistributable Install, HostLib.dll Registration, Clean Install, and TPE Update"
excerpt: "SolidCAM fails for 5 distinct reasons: SolidCAM.exe deleted by anti-virus from quarantine requiring anti-virus exclusion, MSVCR120.dll missing from missing Visual C++ Redistributable requiring VC++ redistributable install, SolidCAM Add-In Cam Manager initialization failure from registration issue requiring HostLib.dll registration, SolidWorks and SolidCAM crash without error reports on part opening requiring clean install, and iMachining 3D incorrect feeds and spins for floor machining from TPE bug requiring TPE update. We cover each with fixes from SolidCAM forum."
category: "installation-and-machining-errors"
softwareSlug: "solidcam"
keyword: "SolidCAM 2026 SolidCAM.exe deleted anti-virus quarantine MSVCR120.dll missing Visual C++ Redistributable Add-In Cam Manager initialization failure registration HostLib.dll SolidWorks SolidCAM crash without error reports part opening iMachining 3D incorrect feeds spins floor machining TPE bug"
slug: "solidcam-2026-antivirus-msvcr120-cam-manager-hostlib-crash-part-opening-imachining-feeds-spins-tpe"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://forum.solidcam.com/forum/technical-support/3059-solidcam-installation-problems-and-solutions"
  - "https://forum.solidcam.com/forum/imachining/2517-2021-tool-path-engine-logs"
  - "https://www.solidsolutions.co.uk/whats-new-in-solidcam-2026/"
---

# SolidCAM 2026 SolidCAM.exe Deleted by Anti-Virus from Quarantine, MSVCR120.dll Missing from Missing Visual C++ Redistributable, SolidCAM Add-In Cam Manager Initialization Failure from Registration Issue, SolidWorks and SolidCAM Crash Without Error Reports on Part Opening, and iMachining 3D Incorrect Feeds and Spins for Floor Machining from TPE Bug: Anti-Virus Exclusion, VC++ Redistributable Install, HostLib.dll Registration, Clean Install, and TPE Update

SolidCAM produces errors from anti-virus deletion, missing DLLs, Add-In initialization, crashes on part opening, and iMachining TPE bugs. This guide covers the 5 most common SolidCAM problems with diagnostic steps and community-verified fixes from SolidCAM forum.

## 1. SolidCAM.exe Deleted by Anti-Virus from Quarantine

### Symptom

SolidCAM.exe is missing from the root directory. The program cannot be started. Anti-virus software has quarantined or deleted SolidCAM.exe. The executable file is not found in the installation directory.

### Root Cause

"This may also be due to virus software, but I would also check whether the Solidcam.exe is still in the root directory. This is often deleted by certain anti-virus software solutions and placed in a quarantine directory." Anti-virus software falsely identifies SolidCAM.exe as a threat and quarantines or deletes it. The executable is removed from the installation directory and placed in the anti-virus quarantine, preventing SolidCAM from starting.

### Fix

1. **Check if SolidCAM.exe is in root directory**:
   - "Check whether the Solidcam.exe"
   - "Is still in the root directory"
   - Check root

2. **Restore from anti-virus quarantine**:
   - "This is often deleted"
   - "By certain anti-virus"
   - "Software solutions"
   - "And placed in a quarantine"
   - Restore from quarantine

3. **Add SolidCAM folder to anti-virus exclusions**:
   - Add the SolidCAM
   - Installation folder
   - To anti-virus
   - Exclusion list

4. **Disable anti-virus during installation**:
   - Disable anti-virus
   - Before installing
   - Or reinstalling
   - SolidCAM

5. **Reinstall SolidCAM after disabling anti-virus**:
   - Reinstall
   - SolidCAM with
   - Anti-virus
   - Disabled

6. **Verify SolidCAM.exe exists after install**:
   - After install
   - Verify SolidCAM.exe
   - Exists in
   - Root directory

7. **Monitor anti-virus for future deletions**:
   - Monitor anti-virus
   - Logs for
   - Future quarantines
   - Of SolidCAM files

### Community Report

> "This may also be due to virus software, but I would also check whether the Solidcam.exe is still in the root directory. This is often deleted by certain anti-virus software solutions and placed in a quarantine directory."

## 2. MSVCR120.dll Missing from Missing Visual C++ Redistributable

### Symptom

The error "The code execution cannot proceed because MSVCR120.dll was not found. Reinstalling the program may fix this problem" appears. SolidCAM cannot start. The MSVCR120.dll file is missing from the system. Reinstalling SolidCAM alone doesn't fix the issue.

### Root Cause

"The code execution cannot proceed because MSVCR120.dll was not found. Reinstalling the program may fix this problem." The Microsoft Visual C++ 2013 Redistributable Package is not installed or is corrupted. MSVCR120.dll is part of this redistributable package. SolidCAM requires this DLL to run but it's missing from the system.

### Fix

1. **Install Microsoft Visual C++ 2013 Redistributable**:
   - "MSVCR120.dll was not found"
   - "Reinstalling the program"
   - "May fix this problem"
   - Install VC++ 2013

2. **Install both x86 and x64 versions**:
   - Install both
   - x86 and x64
   - Versions of
   - VC++ 2013

3. **Reinstall SolidCAM after VC++ install**:
   - Reinstall
   - SolidCAM after
   - Installing VC++
   - Redistributable

4. **Check for corrupted VC++ installation**:
   - If VC++ is
   - Already installed
   - It may be
   - Corrupted

5. **Repair VC++ installation**:
   - Use Control Panel
   - To repair the
   - Visual C++
   - Installation

6. **Verify MSVCR120.dll exists after install**:
   - After installing
   - Verify MSVCR120.dll
   - Exists in
   - System32

7. **Restart computer after installation**:
   - Restart the
   - Computer after
   - Installing VC++
   - Redistributable

### Community Report

> "The code execution cannot proceed because MSVCR120.dll was not found. Reinstalling the program may fix this problem. Added - Unhandled Exception: Failed to load DLL: SetupUtill. Added - SolidCAM crashing on creating new part or opening an old one."

## 3. SolidCAM Add-In Cam Manager Initialization Failure from Registration Issue

### Symptom**

SolidCAM cannot be loaded in SolidWorks. The error "Cannot load SolidCAM -> Cam manager initialization failure" appears. The SolidCAM Add-In doesn't appear in SolidWorks. The Add-In registration has failed.

### Root Cause**

"Cannot load SolidCAM -> Cam manager initialization failure. Registering SolidCAM HostLib.dll to SolidWorks." The SolidCAM HostLib.dll is not properly registered with SolidWorks. The Cam Manager initialization fails because the Add-In registration is broken or missing. The HostLib.dll registration is required for SolidCAM to load as an Add-In in SolidWorks.

### Fix

1. **Register SolidCAM HostLib.dll to SolidWorks**:
   - "Registering SolidCAM"
   - "HostLib.dll to SolidWorks"
   - Register HostLib.dll

2. **Use SolidCAM Clean-Up Tool**:
   - "SolidCAM Clean Install"
   - "SolidCAM Clean-Up Tool"
   - Use Clean-Up Tool

3. **Perform SolidCAM Clean Install**:
   - "SolidCAM Clean Install"
   - Perform clean
   - Installation after
   - Clean-Up

4. **Register SolidCAM to SolidWorks**:
   - "Registering SolidCAM/InventorCAM"
   - "To SolidWorks/Inventor"
   - Register to
   - SolidWorks

5. **Check SolidWorks Add-In manager**:
   - Check SolidWorks
   - Add-In manager
   - For SolidCAM
   - Entry

6. **Verify SolidWorks installation**:
   - "SolidWorks was not found"
   - "On your machine"
   - Verify SolidWorks
   - Is installed

7. **Check SolidCAM version compatibility**:
   - Verify SolidCAM
   - Version is
   - Compatible with
   - SolidWorks version

### Community Report

> "SolidCAM Add-In: Cannot load SolidCAM -> Cam manager initialization failure. Registering SolidCAM HostLib.dll to SolidWorks. SolidCAM Clean Install - SolidCAM Clean-Up Tool. Registering SolidCAM/InventorCAM to SolidWorks/Inventor."

## 4. SolidWorks and SolidCAM Crash Without Error Reports on Part Opening

### Symptom**

SolidWorks and SolidCAM crash without any error reports when opening parts. The crash occurs on part opening, both new and old parts. No error report or crash dump is generated. The crash is silent and unexpected.

### Root Cause**

"SolidWorks and SolidCAM crash without error reports on part opening. SolidCAM crashing on creating new part or opening an old one." The SolidCAM-SolidWorks integration has a stability issue that causes silent crashes during part opening. The crash may be caused by corrupted SolidCAM configuration files, incompatible SolidWorks version, or corrupted part files.

### Fix

1. **Perform SolidCAM Clean Install**:
   - "SolidCAM Clean Install"
   - "SolidCAM Clean-Up Tool"
   - Clean install

2. **Use SolidCAM Clean-Up Tool first**:
   - Run Clean-Up Tool
   - Before clean
   - Installation
   - To remove old files

3. **Check SolidWorks version compatibility**:
   - Verify SolidWorks
   - Version is
   - Compatible with
   - SolidCAM version

4. **Update SolidCAM to latest version**:
   - Update SolidCAM
   - To latest
   - Version for
   - Stability fixes

5. **Check for corrupted part files**:
   - Test with
   - New part file
   - To isolate
   - Corruption

6. **Disable other SolidWorks Add-Ins**:
   - Disable other
   - Add-Ins to
   - Check for
   - Conflicts

7. **Check Windows Event Viewer**:
   - Check Event
   - Viewer for
   - Crash information
   - Not shown in SolidCAM

### Community Report

> "Added - SolidCAM crashing on creating new part or opening an old one. Added - SolidWorks and SolidCAM crash without error reports on part opening. SolidCAM Clean Install - SolidCAM Clean-Up Tool."

## 5. iMachining 3D Incorrect Feeds and Spins for Floor Machining from TPE Bug

### Symptom**

iMachining 3D operations produce incorrect feeds and spindle speeds when machining floors. The feeds and speeds don't match the expected values from the Technology Wizard. The issue occurs specifically with 3D iMachining floor machining operations.

### Root Cause**

"TPE-2021SP3HF1-123345-3.dll Fixed incorrect feeds and spins for 3D iMachining when machining floors. Fixed missing iFinish pass for non rest material operations." The Tool Path Engine (TPE) has a bug in the feeds and speeds calculation for 3D iMachining floor machining. The Technology Wizard's synchronization of feed rate, spindle speed, and cutting parameters produces incorrect values for floor machining operations.

### Fix

1. **Update to latest TPE version**:
   - "Fixed incorrect feeds and spins"
   - "For 3D iMachining"
   - "When machining floors"
   - Update TPE

2. **Check TPE version in SolidCAM**:
   - Verify the
   - TPE version
   - Is the latest
   - Available

3. **Verify feeds and speeds after update**:
   - After TPE update
   - Verify feeds
   - And speeds are
   - Correct

4. **Use iMachining Technology Wizard**:
   - "The iMachining Technology Wizard"
   - "Automatically calculates synchronized"
   - "Values of feed rate, spindle speed"
   - Use Wizard

5. **Keep Wizard On for optimal results**:
   - "It is recommended"
   - "To leave the Wizard On"
   - "And utilize the optimal"
   - Keep Wizard On

6. **Check for missing iFinish pass**:
   - "Fixed missing iFinish pass"
   - "For non rest material operations"
   - Check iFinish

7. **Use iFinish protection for unmachined areas**:
   - "Added iFinish protection"
   - "From unmachined areas"
   - "When using updated stock"
   - Use protection

### Community Report

> "TPE-2021SP3HF1-123345-3.dll Fixed incorrect feeds and spins for 3D iMachining when machining floors. Fixed missing iFinish pass for non rest material operations. Added iFinish protection from unmachined areas when using updated stock. The iMachining Technology Wizard automatically calculates synchronized values of feed rate, spindle speed, axial depth of cut, cutting angles and chip thickness."

## 6. Additional SolidCAM Issues

### SolidCAM Runs Only After Installation

**Issue**: "SolidCAM runs only after installation, after PC restart nothing happens."
**Fix**: Register SolidCAM after restart. Check HostLib.dll registration. Verify Add-In loading.

### SolidWorks Not Found on Machine

**Issue**: "SolidWorks was not found on your machine."
**Fix**: Verify SolidWorks is installed. Check SolidWorks version. Reinstall SolidWorks if needed.

### Installed Version Cannot Be Determined

**Issue**: "The installed version of the application could not be determined. The setup will now terminate."
**Fix**: Check registry entries. Verify installation integrity. Contact SolidCAM support.

### Unhandled Exception Failed to Load DLL SetupUtil

**Issue**: "Unhandled Exception: Failed to load DLL: SetupUtil."
**Fix**: Check DLL permissions. Verify installation integrity. Reinstall SolidCAM.

### User Account Control Microsoft Register Server

**Issue**: "User Account Control Microsoft Register server – Do you want to run the software – scautom.dll."
**Fix**: Allow UAC prompt. Register scautom.dll. Check permissions.

### FeatureWorks Application Initialization

**Issue**: "Could not initialize the FeatureWorks Application and Could not initialize SolidWorks Utilities."
**Fix**: Initialize FeatureWorks. Check SolidWorks Utilities. Verify installation.

### InventorCAM Registration from Inventor 2024

**Issue**: "Registering InventorCAM from Autodesk Inventor 2024 (including 2024 version)."
**Fix**: Register InventorCAM to Inventor. Check Inventor version. Verify registration.

### Open Edge Extension Toolpath Wrap

**Issue**: "Fixed problem with open edge extension (modify geometry) that causes toolpath to be wrapped around edges."
**Fix**: Update TPE. Check open edge extension. Verify toolpath generation.

### Mirrored Transformations Empty Toolpath

**Issue**: "SolidCAM also prevents mirrored transformations where Updated Stock would create empty toolpaths."
**Fix**: Update to SolidCAM 2026. Check mirrored transformations. Verify Updated Stock.

### Gouge Check and Clearance Display

**Issue**: "The Gouge Check and Clearance interfaces in 3-axis and 5-axis jobs now display only the tool elements that are actually used."
**Fix**: Update to SolidCAM 2026. Check Gouge Check display. Verify Clearance interface.

## Best Practices

1. **Add SolidCAM folder to anti-virus exclusions** — prevents SolidCAM.exe deletion
2. **Install Microsoft Visual C++ 2013 Redistributable (x86 and x64)** — fixes MSVCR120.dll missing
3. **Register HostLib.dll to SolidWorks after installation** — fixes Cam Manager initialization
4. **Use SolidCAM Clean-Up Tool before clean install** — removes corrupted files
5. **Update to latest TPE for iMachining 3D feeds and spins fix** — corrects floor machining values
6. **Keep iMachining Technology Wizard On** — ensures synchronized cutting parameters
7. **Update to SolidCAM 2026 for machining strategy improvements** — better control and stability
8. **Disable other SolidWorks Add-Ins to check for conflicts** — isolates crash causes
9. **Check Windows Event Viewer for silent crash information** — provides crash details
10. **Verify SolidCAM version compatibility with SolidWorks** — prevents integration issues
