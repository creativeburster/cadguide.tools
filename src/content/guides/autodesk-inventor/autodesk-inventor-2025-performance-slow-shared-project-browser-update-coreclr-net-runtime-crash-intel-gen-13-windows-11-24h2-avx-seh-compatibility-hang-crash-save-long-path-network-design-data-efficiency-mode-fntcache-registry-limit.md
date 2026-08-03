---
title: "Autodesk Inventor 2025 Performance Slow from Shared Project Browser Update, Random Crashes from coreclr.dll .NET Runtime on Intel Gen 13, Windows 11 24H2 AVX SEH Compatibility Crash, Hang or Crash on Save from Long Path and Network Design Data, and Windows Efficiency Mode Freezing Inventor: 2025.1.1 Update, FNTCACHE.DAT Rename, Registry Limit Increase, KB5067036, and Efficiency Mode Disable"
excerpt: "Autodesk Inventor fails for 5 distinct reasons: 2025 performance slow from Shared Project unnecessary browser update requiring 2025.1.1 update, random crashes from coreclr.dll .NET runtime error on Intel Gen 13 CPU requiring registry limit increase and Windows updates, Windows 11 24H2 AVX and SEH compatibility crash requiring Inventor 2025.4 or downgrade to 23H2, hang or crash on save from long file path and network Design Data requiring local drive and path shortening, and Windows Efficiency Mode freezing Inventor requiring Efficiency Mode disable. We cover each with fixes from Autodesk Community and Support."
category: "performance-crash-and-os-compatibility-errors"
softwareSlug: "autodesk-inventor"
keyword: "Autodesk Inventor 2025 performance slow Shared Project browser update coreclr.dll .NET runtime crash Intel Gen 13 Windows 11 24H2 AVX SEH compatibility hang crash save long path network Design Data Windows Efficiency Mode FNTCACHE.DAT registry limit"
slug: "autodesk-inventor-2025-performance-slow-shared-project-browser-update-coreclr-net-runtime-crash-intel-gen-13-windows-11-24h2-avx-seh-compatibility-hang-crash-save-long-path-network-design-data-efficiency-mode-fntcache-registry-limit"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forums.autodesk.com/t5/inventor-forum/inventor-2025-performance-slow/td-p/12844087"
  - "https://forums.autodesk.com/t5/inventor-forum/inventor-random-crashes-due-to-microsoft-netcore-app-8-0-12/td-p/13292805"
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Inventor-crashing-after-updating-to-Windows-11-24H2.html"
---

# Autodesk Inventor 2025 Performance Slow from Shared Project Browser Update, Random Crashes from coreclr.dll .NET Runtime on Intel Gen 13, Windows 11 24H2 AVX SEH Compatibility Crash, Hang or Crash on Save from Long Path and Network Design Data, and Windows Efficiency Mode Freezing Inventor: 2025.1.1 Update, FNTCACHE.DAT Rename, Registry Limit Increase, KB5067036, and Efficiency Mode Disable

Autodesk Inventor produces errors from Shared Project performance, .NET runtime crashes, Windows 11 24H2 incompatibility, save/open hangs, and Windows Efficiency Mode. This guide covers the 5 most common Inventor problems with diagnostic steps and community-verified fixes from the Autodesk Community and Support.

## 1. 2025 Performance Slow from Shared Project Browser Update

### Symptom

After upgrading to Inventor 2025, every action — deleting a constraint, modifying a constraint, adding a part in an assembly — freezes for 5-10 seconds. CPU usage is only about 8% during the freeze. Large assemblies (18,500 parts) take 30 minutes for a single save and replace command. The progress bar scrolls but CPU is at 9-10% with "very high" power usage. The issue occurs with Shared Project type but not Single-User Project.

### Root Cause

"We are investigating a dataset-specific performance issue with Shared Project (INVGEN-78677). It does not reproduce with Single-User Project. The root cause is related to an unnecessary browser update for shared project type." Inventor 2025 has a bug where the browser (feature tree) unnecessarily updates after every operation when using Shared Project type. This causes a 5-10 second delay on every action, even though CPU usage is low (the update is I/O bound, not CPU bound). The issue doesn't occur with Single-User Project because the browser update behavior is different.

### Fix

1. **Install Inventor 2025.1.1 or later**:
   - "2025.1.1 has been released. It contains the fix to resolve the issue"
   - "The root cause is related to an unnecessary browser update for shared project type"
   - "We are in the process of integrating the fix to affected releases"
   - This is the primary fix — update to 2025.1.1

2. **Switch to Single-User Project (workaround)**:
   - "It does not reproduce with Single-User Project"
   - If possible, switch from Shared Project to Single-User Project
   - This eliminates the unnecessary browser updates
   - Until the fix is installed

3. **Check if the assembly is open on another machine**:
   - "It seems the assembly I've been working with is also opened on my coworker's PC"
   - "If I open an assembly that he doesn't have open I have no issues at all"
   - Shared Project locks cause additional browser updates
   - When multiple users access the same assembly

4. **Clean up %TEMP%**:
   - "Clean up %temp%"
   - Delete temporary files
   - That may slow down Inventor
   - Especially on Shared Project

5. **Rename FNTCACHE.DAT**:
   - "Go to C:\\Windows\\System32 and find 'FNTCACHE.DAT'"
   - "Rename it to something else. Restart the machine"
   - This can improve font caching performance
   - Which affects browser rendering

6. **Run as Admin and set High DPI**:
   - "Right-click on Inventor desktop icon -> Properties -> Compatibility"
   - "Check 'Run as Admin'"
   - "Click 'Change High DPI settings' -> check both boxes"
   - This can improve overall performance

7. **Disable Dell system management tools**:
   - "If you are using Dell machines, try disabling any Dell system managing tools"
   - Dell bloatware can interfere with Inventor performance
   - Disable Dell Optimizer and similar tools
   - Test performance after disabling

### Community Report

> "Since upgrading to 2025 I've noticed a huge performance hit. Every time I try to do something the program freezes for 5-10 seconds and my CPU fan ramps up although my CPU usage is only at about 8%. We are investigating a dataset-specific performance issue with Shared Project (INVGEN-78677). It does not reproduce with Single-User Project. The root cause is related to an unnecessary browser update for shared project type. 2025.1.1 has been released. It contains the fix to resolve the issue."

## 2. Random Crashes from coreclr.dll .NET Runtime on Intel Gen 13

### Symptom

Inventor crashes without warning. No popups or crash reports appear. The only sign is in Event Viewer: "Application: Inventor.exe, CoreCLR Version: 8.0.1224.60305, .NET Version: 8.0.12, Description: The process was terminated due to an internal error in the .NET Runtime." The crash happens randomly, sometimes months apart. The machine has an Intel Gen 13 CPU.

### Root Cause

"The Intel Gen 13 CPU has a general stability issue due to high voltage. Intel has been working with PC vendors to publish updates." The .NET runtime crash (coreclr.dll) is caused by Intel Gen 13/14 K-series CPU instability at high voltages. The CPU produces incorrect computation results, which cause the .NET runtime to encounter internal errors and terminate the process. The crash is silent because the .NET runtime exits before Inventor's crash reporter can capture the error.

### Fix

1. **Install Intel CPU stability updates**:
   - "The Intel Gen 13 CPU has a general stability issue due to high voltage"
   - "Intel has been working with PC vendors to publish updates"
   - "Please go to PC vendor site and install all critical updates"
   - "To your specific machine"

2. **Install all critical Windows updates**:
   - "Please make sure all critical Windows updates are installed"
   - "And the graphics driver is updated"
   - Keep Windows fully updated
   - To ensure OS-level compatibility

3. **Install latest Inventor update**:
   - "Install the latest Inventor update to your Inventor release"
   - Check for updates in Autodesk desktop app
   - Install the latest service pack
   - For your Inventor version

4. **Enable WER support**:
   - "Go to Control Panel -> System -> Advanced System Settings -> Environment Variables"
   - "Add 'INV_ENABLE_WER_SUPPORT' and set it to 1"
   - This enables Windows Error Reporting
   - Which may capture more crash information

5. **Increase registry limits**:
   - "Run Regedit.exe and find the following two registry keys"
   - "Change the value to 1000000:"
   - `Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\USERPostMessageLimit`
   - `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Windows\\GDIProcessHandleQuota`

6. **Disable overclocking or turbo**:
   - "Disable any performance ability (overclock or turbo) on the machine"
   - Intel Gen 13 instability is worse with overclocking
   - Disable turbo boost in BIOS
   - To improve stability

7. **Use Microsoft Disk Cleanup**:
   - "Use Microsoft Disk Cleanup to remove cached files"
   - Clean up old .NET runtime caches
   - And Windows update caches
   - That may cause conflicts

### Community Report

> "Inventor random crashes due to Microsoft.NETCore.App\\8.0.12\\coreclr.dll. The process was terminated due to an internal error in the .NET Runtime. The Intel Gen 13 CPU has a general stability issue due to high voltage. Please go to PC vendor site and install all critical updates. Run Regedit.exe and change USERPostMessageLimit and GDIProcessHandleQuota to 1000000. The new reports point to a known issue INVGEN-83127."

## 3. Windows 11 24H2 AVX SEH Compatibility Crash

### Symptom

After updating to Windows 11 24H2, Inventor frequently crashes during various operations: saving or closing files, checking in to Vault, replacing parts, changing colors, or suppressing components. The crashes may occur in conjunction with updating Inventor from a previous version. The crashes are random and don't produce consistent error messages.

### Root Cause

"Investigation into this behavior determined the issue is caused by compatibility problems between Inventor and certain components of the Windows 11 24H2 OS, particularly the AVX (Advanced Vector Extensions) and SEH (Structured Exception Handling)." Windows 11 24H2 introduced changes to AVX and SEH handling that are incompatible with certain Inventor operations. AVX is used for vector computations in Inventor's modeling engine, and SEH is used for error handling. The 24H2 changes cause Inventor's AVX instructions or SEH handlers to fail, resulting in crashes during common operations.

### Fix

1. **Install Inventor 2025.4 or 2026.0.1**:
   - "This incident has been resolved in: Inventor 2023.5.3, Inventor 2025.4, Inventor 2024.3.5, Inventor 2026.0.1"
   - Update to the latest version
   - That includes the compatibility fix
   - Check Autodesk desktop app for updates

2. **Install Microsoft KB5067036**:
   - "Microsoft have released KB5067036"
   - "Is an update for Win11 25H2 & Win11 24H2"
   - "OS Builds 26200.7019 and 26100.7019"
   - "That should be installed to improve stability"

3. **Downgrade to Windows 11 23H2**:
   - "To avoid stability issues, CAD users are advised to avoid applying Windows 11 24H2"
   - "And if possible downgrade to Windows 11 23H2"
   - "Until Microsoft have released fixes for this issue"
   - See Microsoft's downgrade guide

4. **Ensure both Autodesk and Microsoft updates are installed**:
   - "Ensure that the latest update from both Microsoft and Autodesk are installed"
   - Install Inventor updates first
   - Then install Windows updates
   - Or vice versa — both must be current

5. **Check Windows 11 24H2 known issues**:
   - "The Autodesk Inventor team is continuing to partner with Microsoft"
   - "To identify and implement more solutions"
   - "Related to Windows 11, version 24H2"
   - "Windows 11, version 24H2 known issues and notifications"
   - Monitor Microsoft's known issues page

6. **Avoid Windows 11 24H2 for CAD**:
   - "CAD users are advised to avoid applying Windows 11 24H2"
   - If you haven't updated yet
   - Stay on 23H2 until all fixes are released
   - This is the safest approach

7. **Follow General Inventor Stability troubleshooting**:
   - "General Inventor Stability troubleshooting guidance can be found here"
   - "Troubleshooting Inventor stability, crash and hanging issues"
   - Follow Autodesk's general stability guide
   - For additional troubleshooting steps

### Community Report

> "Users reported that after updating to Windows 11 24H2 OS, Inventor frequently crashes during various operations: saving or closing files, checking in to Vault, replacing parts, changing colors, suppressing components. The issue is caused by compatibility problems between Inventor and certain components of the Windows 11 24H2 OS, particularly the AVX (Advanced Vector Extensions) and SEH (Structured Exception Handling). This incident has been resolved in Inventor 2025.4, Inventor 2024.3.5, Inventor 2026.0.1. Microsoft have released KB5067036. CAD users are advised to avoid applying Windows 11 24H2 and if possible downgrade to Windows 11 23H2."

## 4. Hang or Crash on Save from Long Path and Network Design Data

### Symptom

When trying to save or open Part (IPT), Assembly (IAM) or Drawing (DWG, IDW) files, Inventor hangs, freezes, or crashes. Inventor shows "Not responding" on the title bar or in Task Manager. An Autodesk Inventor Error Report pop up may appear. The issue occurs with specific files or projects, not all files.

### Root Cause

Multiple causes can produce save/open hangs: "The file path to files is too long. High CPU or disk usage. The Design Data is situated on a distant network drive. The Templates folder is situated on a distant network drive. The template files are corrupted. Temp folder is running out of space. Windows user permissions are blocked for some locations. Antivirus blocking or checking in real-time files." The most common causes are long file paths (>255 characters), network drive latency for Design Data access, and antivirus interference.

### Fix

1. **Reduce file and folder paths**:
   - "Make sure that the save path of the file is shorter than 255 characters"
   - Move the project to a shorter path
   - Use drive substitution: `subst I: C:\\Users\\name\\Documents\\Projects\\VeryLongPath`
   - To create shorter paths

2. **Move Design Data to local drive**:
   - "The Design Data is situated on a distant network drive"
   - Move Design Data to a local drive
   - Configure the project to use local Design Data
   - Network Design Data causes significant delays

3. **Move Templates to local drive**:
   - "The Templates folder is situated on a distant network drive"
   - Move Templates to a local drive
   - Configure the project to use local Templates
   - Network Templates cause delays and potential corruption

4. **Delete temporary files**:
   - "%TEMP% folder is running out of space"
   - "Click Windows Start, paste '%TEMP%', click Enter"
   - "Delete temporary files"
   - Ensure adequate free space in temp

5. **Set up antivirus exclusions**:
   - "Set up exceptions for Antivirus"
   - "Exceptions should be done also on the server when working on the network drive"
   - "New Antivirus exceptions should be done always after installing a new version of Inventor"
   - Add Inventor executables and project folders to exclusions

6. **Check for corrupted templates**:
   - "The template files are corrupted"
   - "Try to use the default drawing files"
   - "If it works, create a new template using the default template"
   - Recreate templates from defaults

7. **Check .NET Framework**:
   - "The required .NET framework version is not installed or is corrupted"
   - "Verify the .NET Framework is turned on"
   - "Control Panel -> Programs and Features -> Turn Windows features on or off"
   - "Repair or reinstall .NET Framework"

8. **Avoid multiple Inventor sessions**:
   - "Opening Inventor files in different sessions causing conflicts"
   - "Files opened in multiple sessions can lead to crashes on save"
   - "As both sessions attempt to lock the files"
   - Use only one Inventor session

9. **Update 3D mouse driver**:
   - "The driver of 3D mouse hangs Inventor"
   - "Testing without the 3D Mouse and unload this from the Add-ins"
   - Update or uninstall 3D mouse drivers
   - If they cause hangs

10. **Check for bad bodies**:
    - "Checking for Bad Bodies. How to utilize the CTRL + F7 in Inventor to find bad bodies"
    - Use Ctrl+F7 to check for bad bodies
    - In part files
    - Bad bodies can cause save/open crashes

### Community Report

> "When trying to save or open Part (IPT), Assembly (IAM) or Drawing (DWG, IDW) files Inventor hangs, freezes, or crashes. The file path to files is too long. The Design Data is situated on a distant network drive. The Templates folder is situated on a distant network drive. Temp folder is running out of space. Antivirus blocking or checking in real-time files. Make sure that the save path of the file is shorter than 255 characters. Set up exceptions for Antivirus."

## 5. Windows Efficiency Mode Freezing Inventor

### Symptom

Inventor randomly freezes during various operations — measuring between two points, rotating the model, closing the rendered window in Studio. The freezes are not crashes to desktop — Inventor shows "Not responding" and must be closed from Task Manager. No crash report can be submitted because Inventor doesn't actually crash. The freezes are intermittent and random.

### Root Cause

"Inventor will freeze as soon as Windows puts another app into Efficiency Mode." Windows 11 has an Efficiency Mode feature that throttles background applications. When Windows puts another application into Efficiency Mode, it can affect Inventor's performance and cause it to freeze. The freeze occurs because Inventor may be waiting for a resource (such as a shared library or system service) that is being throttled by Efficiency Mode. The issue is not with Inventor itself but with Windows' resource management.

### Fix

1. **Close Chrome and other background apps**:
   - "I always have Plex running in Chrome to stream music from my PC at home"
   - "I closed the chrome tab that had Plex running and now Inventor doesn't randomly freeze"
   - "So maybe Plex/Chrome was fighting Inventor for system resources"
   - Close browser tabs and background apps

2. **Disable Windows Efficiency Mode**:
   - "Inventor will freeze as soon as Windows puts another app into Efficiency Mode"
   - Open Task Manager
   - Find apps in Efficiency Mode (leaf icon)
   - Right-click and "Disable Efficiency Mode"

3. **Prevent Efficiency Mode for Inventor**:
   - In Windows Settings > System > Power & battery
   - Or in Task Manager
   - Ensure Inventor is not subject to Efficiency Mode
   - Set Inventor to "High performance" power mode

4. **Monitor Task Manager for Efficiency Mode**:
   - "I've had Task Manager open all day on my second monitor"
   - Watch for when Windows puts apps into Efficiency Mode
   - If Inventor freezes when another app enters Efficiency Mode
   - Disable Efficiency Mode for that app

5. **Close resource-intensive background apps**:
   - Media streaming (Plex, Spotify)
   - Browser tabs with hardware acceleration
   - Cloud sync apps (OneDrive, Dropbox)
   - These can trigger Efficiency Mode interactions

6. **Use Windows Performance settings**:
   - Go to Windows Appearance and Performance Options
   - Set to "Adjust for best performance"
   - Or "Let Windows choose what's best for my computer"
   - Disable unnecessary visual effects

7. **Ensure adequate graphics RAM**:
   - "Make sure the graphics card has adequate RAM (8GB+)"
   - Insufficient graphics memory
   - Can cause Inventor to freeze
   - When Windows throttles other apps

### Community Report

> "Inventor randomly freezes on me, and since it never crashes to desktop I am never able to submit a crash report. I am forced to close it from Task Manager. I think I found the source of the freeze. I always have Plex running in Chrome. I closed the chrome tab and now Inventor doesn't randomly freeze. I've had Task Manager open all day. Inventor will freeze as soon as Windows puts another app into Efficiency Mode."

## 6. Additional Autodesk Inventor Issues

### Mismatched Display Resolutions

**Issue**: "I have heard instability due to mismatched resolutions between two displays."
**Fix**: "Please make sure the two displays are using the same resolution settings. Also make the one hosting Inventor the primary display." Mismatched resolutions can cause rendering issues and crashes.

### Intel Hyper Threading

**Issue**: "Check if Intel Hyper Threading is enabled. If yes, test while turned off."
**Fix**: Disable Intel Hyper Threading in BIOS. Test Inventor stability with HT off. Some Inventor operations are more stable without HT.

### iLogic Rules on Open

**Issue**: "Some iLogic rules are running while opening files."
**Fix**: "If able, unloading iLogic from Add-ins for testing." Disable iLogic rules that run on file open. These can cause delays and crashes during file opening.

### Third-Party Add-ins

**Issue**: "3D-party add-ins affecting work of Inventor."
**Fix**: Disable third-party add-ins. Test Inventor without add-ins. Enable add-ins one at a time to identify the problematic one.

### Files in Older Version Not Migrated

**Issue**: "Files are in an older version of Inventor and were never migrated."
**Fix**: Migrate files to the current Inventor version. Open and save each file in the new version. Use the Task Scheduler for batch migration.

### Docking Station Issues

**Issue**: "Test without being connected to a docking station."
**Fix**: Docking stations can cause graphics and USB issues. Test Inventor without the docking station. If the issue resolves, update docking station drivers.

### Inventor Reset Utility

**Issue**: Inventor settings corrupted after update.
**Fix**: "Use the Inventor Reset Utility." The reset utility restores Inventor to default settings. Run it after major updates or when experiencing persistent issues.

### High CPU from ntoskrnl.exe

**Issue**: "Microsoft ntoskrnl.exe might generate high CPU and disk usage."
**Fix**: This is a Windows kernel issue. Install all Windows updates. Check for driver conflicts. Monitor with Process Explorer to identify the root cause.

## Best Practices

1. **Install Inventor 2025.1.1+ for Shared Project fix** — resolves unnecessary browser update
2. **Install Intel CPU stability updates for Gen 13/14** — fixes coreclr.dll .NET crashes
3. **Install Inventor 2025.4+ for Windows 11 24H2 compatibility** — fixes AVX/SEH crashes
4. **Install Microsoft KB5067036** — improves Windows 11 24H2 stability for CAD
5. **Keep file paths under 255 characters** — prevents save/open hangs
6. **Move Design Data and Templates to local drive** — prevents network latency issues
7. **Set up antivirus exclusions for Inventor** — prevents real-time scanning interference
8. **Close background apps that trigger Efficiency Mode** — prevents Inventor freezes
9. **Disable overclocking on Intel Gen 13/14** — improves CPU stability
10. **Use only one Inventor session** — prevents file locking conflicts
