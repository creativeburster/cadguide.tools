---
title: "Ansys Workbench DesignModeler Script Error from Corrupted Preferences XML, Project Schematic Refresh Error from Corrupted Workbench File, License Server Communication Timeout from Network Latency, DesignModeler Won't Start from Corrupted AppData, and Product Configuration Missing After Update: AppData Reset, Preferences XML Copy, ansyslmd.ini Timeout Settings, and ProductConfig Reconfiguration"
excerpt: "Ansys Workbench fails for 5 distinct reasons: DesignModeler script error from corrupted settings requiring AppData reset or Preferences XML copy, project schematic refresh error from corrupted workbench file requiring project repair, license server communication timeout from network latency requiring ansyslmd.ini timeout settings, DesignModeler won't start from corrupted AppData requiring folder rename, and product configuration missing after update requiring ProductConfig reconfiguration. We cover each with fixes from Ansys Knowledge Base."
category: "deployment"
softwareSlug: "ansys-workbench"
keyword: "Ansys Workbench DesignModeler script error corrupted Preferences XML AppData reset project schematic refresh error license server timeout ansyslmd.ini ProductConfig reconfiguration"
slug: "ansys-workbench-designmodeler-script-error-corrupted-preferences-xml-appdata-reset-project-schematic-refresh-license-server-timeout-ansyslmd-ini-productconfig-reconfiguration"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/how-to-fix-designmodeler-when-it-cannot-be-started-anymore-in-workbench/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/how-to-solve-problem-with-starting-designmodeler-in-workbench-on-windows/"
  - "https://innovationspace.ansys.com/forum/forums/topic/licensing-problems-with-anything-after-2021h2/"
---

# Ansys Workbench DesignModeler Script Error from Corrupted Preferences XML, Project Schematic Refresh Error from Corrupted Workbench File, License Server Communication Timeout from Network Latency, DesignModeler Won't Start from Corrupted AppData, and Product Configuration Missing After Update: AppData Reset, Preferences XML Copy, ansyslmd.ini Timeout Settings, and ProductConfig Reconfiguration

Ansys Workbench produces errors from DesignModeler script failures, project schematic corruption, license server timeouts, AppData corruption, and product configuration issues. This guide covers the 5 most common Workbench problems with diagnostic steps and community-verified fixes from the Ansys Knowledge Base.

## 1. DesignModeler Script Error from Corrupted Preferences XML

### Symptom

DesignModeler suddenly cannot be started from Workbench, when it worked before. The error message in Workbench is: "Script Error Line: 27637 Char: 2 Error: Object required Code: 800a01a8 Source: Microsoft JScript runtime error Script: var pg = pm.Preferencescategories.Item('CATNAME_DesignModeler').PreferencesGroups;" DesignModeler was working previously and stopped without any obvious cause.

### Root Cause

"The issue might be related to a corrupted settings file in the users settings." The DesignModeler preferences XML file (`agPreferences.xml`) in the user's AppData directory has become corrupted. This can happen from a crash during DesignModeler shutdown, a Windows update, or an Ansys version conflict. When Workbench tries to load DesignModeler, it reads the corrupted XML file, which causes the JScript runtime to fail when accessing the PreferencesCategories object.

### Fix

1. **Rename or delete the Ansys AppData folder**:
   - "These are found in the folder %APPDATA%\\ANSYS"
   - "Or C:\\Users\\<username>\\AppData\\Roaming\\Ansys"
   - "In this folder subfolders can be found for each installed ANSYS version"
   - "You can simply delete (or rename) the folder for the ANSYS version"
   - "The folder will be re-generated automatically"

2. **Copy the default Preferences XML from installation**:
   - "If the above does not fix the issue, then it might be related to a corrupted Preferences file"
   - "Copy the file from your installation folder:"
   - `C:\\Program Files\\ANSYS Inc\\v195\\aisol\\AGP\\AGPages\\Language\\en-us\\xml\\agPreferences.xml`
   - "To: C:\\Users\\<username>\\AppData\\Roaming\\Ansys\\v195\\en-us\\agPreferences.xml"

3. **Check for multiple Ansys versions**:
   - If multiple Ansys versions are installed
   - Each version has its own AppData folder (v195, v201, v221, etc.)
   - Fix the folder for the version experiencing the issue
   - Don't delete folders for other versions

4. **Restart Workbench after fix**:
   - After renaming the AppData folder or copying the XML
   - Restart Workbench
   - Try opening DesignModeler
   - The settings will be regenerated from defaults

5. **Check for write permissions**:
   - Ensure the user has write permissions
   - To the AppData\\Ansys folder
   - Permission issues can cause settings corruption
   - Run Workbench as Administrator to test

6. **Check antivirus interference**:
   - Antivirus software may block or quarantine
   - The Preferences XML file
   - Add Ansys to antivirus exclusions
   - To prevent file corruption

7. **Reinstall DesignModeler component**:
   - If the installation folder XML is also corrupted
   - Run the Ansys installer in repair mode
   - Or reinstall the DesignModeler component
   - From the Ansys installation media

### Community Report

> "DesignModeler suddenly cannot be started anymore from Workbench, when it worked before. Script Error Line: 27637 Char: 2 Error: Object required Code: 800a01a8. The issue might be related to a corrupted settings file in the users settings. These are found in the folder %APPDATA%\\ANSYS. You can simply delete (or rename) the folder for the ANSYS version. If the above does not fix the issue, copy the file agPreferences.xml from your installation folder."

## 2. Project Schematic Refresh Error from Corrupted Workbench File

### Symptom

The error message "Unexpected error while refreshing view files: The given key was not present in the dictionary." occurs in the project schematic. The project can't be opened or updated. The error may occur after a crash, network disconnection, or version upgrade. The project schematic shows cells with yellow or red icons.

### Root Cause

The Workbench project file (.wbpj) or its associated database files have become corrupted. The "given key was not present in the dictionary" error indicates that the project's internal database has a missing or corrupted entry. This can happen from an improper shutdown, network issues when working on network drives, or file system errors. The project schematic's internal data structure has lost integrity.

### Fix

1. **Restore from backup**:
   - If you have a backup of the project
   - Restore the entire project folder
   - Including the .wbpj file and all subfolders
   - This is the most reliable fix

2. **Use the Workbench project recovery**:
   - "How to restore the corrupted project in ANSYS Workbench"
   - Workbench has a built-in recovery mechanism
   - Try opening the project with the recovery option
   - If available in your version

3. **Check the project database files**:
   - The project folder contains database files
   - Check for zero-byte or corrupted files
   - In the project's hidden subfolders
   - Replace corrupted files from backup

4. **Copy project to local drive**:
   - If the project is on a network drive
   - Copy the entire project folder to a local drive
   - Network issues can cause file corruption
   - Try opening from the local copy

5. **Open individual component files**:
   - If the project schematic can't be opened
   - Try opening individual component files directly
   - Such as the .mechdb file for Mechanical
   - Or the .agdb file for DesignModeler

6. **Create a new project and import files**:
   - Create a new Workbench project
   - Import the individual component files
   - From the corrupted project
   - This creates a fresh project structure

7. **Check file permissions**:
   - Ensure the user has full read/write permissions
   - To the project folder and all contents
   - Permission issues can cause write failures
   - Leading to corruption

### Community Report

> "Sometimes the error message 'Unexpected error while refreshing view files: The given key was not present in the dictionary.' occurs in the project schematic. How to restore the corrupted project in ANSYS Workbench?"

## 3. License Server Communication Timeout from Network Latency

### Symptom

Ansys Workbench 2022R1 and newer can't communicate with the licensing server. Workbench hangs on "initializing project" for a long time, then times out. Individual programs like Fluent and Speos launch without licensing errors. The issue only affects Workbench, not individual solvers. "Features in use" shows "lmgrd is not running" even though the license server is operational.

### Root Cause

"This looks like a latency and network issue. The license server lost messages generally means you were disconnected from the server for the amount of time displayed in the message." Workbench's licensing component has a shorter timeout than individual solvers. When network latency causes delays in license server communication, Workbench times out before the license server responds. Individual solvers have longer timeouts or different communication patterns, so they succeed where Workbench fails.

### Fix

1. **Add timeout settings to ansyslmd.ini**:
   - "Go to C:\\Program Files\\ANSYS Inc\\Shared Files\\Licensing directory"
   - "Copy the ansyslmd.ini file to the desktop"
   - "Open the ansyslmd.ini file using Notepad and add the following lines:"
   ```
   ANSYSLI_FNP_IP_ENV=1
   ANSYSLI_TIMEOUT_FLEXLM=20
   ANSYSLI_FLEXLM_TIMEOUT_ENV=20000000
   ANSYSCL_TIMEOUT_CONNECT=60
   ANSYSCL_TIMEOUT_RESPONSE=300
   ```

2. **Check network connectivity**:
   - "Open a command prompt and execute ping <license_server>"
   - Check for packet loss or high latency
   - If using VPN, test with and without VPN
   - Network instability causes license timeouts

3. **Verify license server settings**:
   - "Open the Licensing Settings 2023R1"
   - "See if the server info is populated"
   - "Does the test button return a green tick?"
   - Ensure the correct server is configured

4. **Check for multiple Ansys versions**:
   - "Can you check if you are pointed to the same server"
   - "In the Client Licensing Settings 2021R1/R2 as well?"
   - Different Ansys versions may have different license server settings
   - Ensure all versions point to the same server

5. **Update license server manager**:
   - "License Manager is 2023R1 version 1.5.1 on the server"
   - Ensure the license server runs a compatible version
   - "Your license server must be using a minimum of Ansys License Manager Release 2024 R1.03"
   - For Ansys 2025 R1 and newer

6. **Check firewall settings**:
   - Ensure firewall allows communication
   - On ports 1055, 1056, 2325, 2326
   - Between client and license server
   - Firewall can cause intermittent timeouts

7. **Test with individual solvers**:
   - "Can you launch SpaceClaim 2021R2 and 2023R1 one at a time"
   - "Are you able to launch it without errors?"
   - If individual solvers work but Workbench doesn't
   - The issue is Workbench-specific timeout

### Community Report

> "Workbench 2022R1 and newer can't communicate with licensing server. It will hang on the 'initializing project' message for a long time, then it times out. I can still launch individual programs like Fluent and Speos with no delays. This looks like a latency and network issue. Add the following lines to ansyslmd.ini: ANSYSLI_FNP_IP_ENV=1, ANSYSLI_TIMEOUT_FLEXLM=20, ANSYSLI_FLEXLM_TIMEOUT_ENV=20000000, ANSYSCL_TIMEOUT_CONNECT=60, ANSYSCL_TIMEOUT_RESPONSE=300."

## 4. DesignModeler Won't Start from Corrupted AppData

### Symptom

DesignModeler on Windows does not start. Workbench shows "AnsysWBU.exe encountered a problem. A diagnostic file has been written: C:\\Users\\<username>\\AppData\\Local\\Temp\\AnsysWBDumpFile.dmp" and DesignModeler shows "Unable to start the geometry editor." The issue may be user-specific — DesignModeler works for other users on the same machine.

### Root Cause

The user's Ansys settings in AppData have become corrupted. The corruption may be user-specific, which is why other users can launch DesignModeler. The corrupted settings prevent the geometry editor from initializing, causing both the Workbench crash (AnsysWBU.exe) and the DesignModeler error. The corruption can occur from a previous crash, improper shutdown, or version conflict.

### Fix

1. **Update graphics card driver**:
   - "Check that the graphics card driver is up to date"
   - Download the latest driver from NVIDIA or AMD
   - Install and restart
   - Try launching DesignModeler

2. **Unconfigure and reconfigure the product**:
   - "Unconfigure and re-configure the product and CAD installation"
   - "With 'Product & CAD Configuration' tool available from the Start menu"
   - Run ProductConfig.exe as Administrator
   - Select all options and install prerequisites

3. **Check if the issue is user-specific**:
   - "Is the issue user specific, i.e. try with a different user login?"
   - If DesignModeler works for other users
   - The issue is in the user's profile
   - Follow the AppData reset steps

4. **Rename AppData\\Ansys folder**:
   - "Open %APPDATA% and rename or remove the directory 'Ansys'"
   - This removes all corrupted user settings
   - The folder will be recreated on next launch
   - With default settings

5. **Rename %TEMP%\\.ansys folder**:
   - "Open %TEMP% and rename or remove the directory '.ansys'"
   - This removes corrupted temporary data
   - That may prevent DesignModeler from starting
   - Restart Workbench after renaming

6. **Recreate the Windows user profile**:
   - "If the above does not help, re-create the user profile on the Windows machine"
   - This is a last resort
   - Create a new Windows user account
   - And migrate to the new profile

7. **Check firewall and antivirus**:
   - "Check Firewall and virus scanner settings, or deactivate temporarily"
   - Firewall or antivirus may block DesignModeler
   - Add Ansys to exclusions
   - Test with antivirus temporarily disabled

### Community Report

> "DM on Windows does not start and the following WB error message: AnsysWBU.exe encountered a problem. A diagnostic file has been written. And DM error message: Unable to start the geometry editor. 1) Check that the graphics card driver is up to date. 2) Unconfigure and re-configure the product and CAD installation. 3) Is the issue user specific? Open %APPDATA% and rename or remove the directory 'Ansys'. Open %TEMP% and rename or remove the directory '.ansys'. 4) Check Firewall and virus scanner settings."

## 5. Product Configuration Missing After Update

### Symptom

After updating Ansys to a new version, Workbench or its components don't start properly. Meshing, Mechanical, or other components may fail to launch. The error may include "script error" or "component not found." The issue started after an update or new installation. Reinstalling doesn't fix the issue.

### Root Cause

The Product Configuration step was not properly completed during the update. Ansys installations require a Product Configuration step that registers components, installs prerequisites, and configures CAD interfaces. If this step is skipped, interrupted, or fails silently, components are not properly registered. Subsequent reinstalls may not fix the issue if the corrupted configuration persists.

### Fix

1. **Run ProductConfig.exe as Administrator**:
   - "Run the ProductConfig.exe from C:\\Program Files\\ANSYS Inc\\v2xx"
   - "Right clicking the productconfig.exe file and select 'Run as Administrator'"
   - "Selecting all options"
   - "Make sure you also click on 'Install Required Prerequisites'"

2. **Uninstall and reinstall Visual C++ redistributables**:
   - "Please try uninstalling these:"
   - "Microsoft Visual C++ 2019 / x86 and x64"
   - "Microsoft Visual C++ 2017 / x86 and x64"
   - "Download and install the Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019, both x86 and x64"

3. **Rename the Ansys AppData folder**:
   - "Open a file explorer and enter %APPDATA% in the address line"
   - "Here you will find an Ansys directory"
   - "Rename that corresponding folder (i.e. v211) to a different name (i.e. backup_v211)"
   - "The folder will automatically get created again"

4. **Restart Workbench after reconfiguration**:
   - "Then start Ansys Workbench again"
   - "And test to open Ansys Meshing"
   - The fresh configuration should resolve the issue
   - If not, proceed to clean reinstall

5. **Clean uninstall and reinstall**:
   - "If the above workaround doesn't help"
   - "Can you try re-installing the Ansys version on client machine?"
   - Uninstall Ansys completely
   - Delete remaining folders, then reinstall

6. **Delete remaining Ansys folders**:
   - After uninstalling, check for remaining folders:
   - `C:\\Program Files\\ANSYS Inc`
   - `%APPDATA%\\Ansys`
   - `%LOCALAPPDATA%\\Ansys`
   - Delete all before reinstalling

7. **Install with antivirus disabled**:
   - Temporarily disable antivirus during installation
   - Antivirus can block DLL registration
   - And file copying during installation
   - Re-enable antivirus after installation

### Community Report

> "Run the ProductConfig.exe from C:\\Program Files\\ANSYS Inc\\v2xx and configure the application again, by right clicking and selecting Run as Administrator, selecting all options and make sure you also click on 'Install Required Prerequisites'. Please try uninstalling Microsoft Visual C++ 2019 / x86 and x64. Rename the corresponding folder in %APPDATA%\\Ansys. If the above doesn't help, try re-installing the Ansys version."

## 6. Additional Ansys Workbench Issues

### Workbench Applications Don't Start After Crash (Linux)

**Issue**: "On Linux machines, if Workbench applications do not launch after an abnormal exit such as a crash."
**Fix**: Run the specified utility to clean up lock files and shared memory. On Linux, abnormal exits leave lock files that prevent applications from launching.

### Wobbly Windows Desktop Effect Causes Crashes (Linux)

**Issue**: "The wobbly windows desktop effect on Linux machines may cause Workbench or its applications to crash."
**Fix**: "This effect is on by default on some Linux platforms. Make sure the effect is turned off." Disable desktop effects (Compiz) when running Ansys on Linux.

### System Coupling Crashes in Remote Session

**Issue**: "System Coupling component crashes in Remote Session."
**Fix**: Remote session configurations may have specific limitations for System Coupling. Check the Ansys help for remote session requirements.

### Workbench File Path Too Long

**Issue**: Project files with paths longer than 255 characters cause errors.
**Fix**: "Make sure that the save path of the file is shorter than 255 characters." Move the project to a shorter path. Use drive substitution (subst) to create shorter paths.

### Design Data on Network Drive

**Issue**: "The Design Data is situated on a distant network drive" causing slow performance or crashes.
**Fix**: Move Design Data to a local drive. Network latency for Design Data access causes significant performance issues. Configure the project to use local Design Data.

### Templates Folder on Network Drive

**Issue**: "The Templates folder is situated on a distant network drive."
**Fix**: Move the Templates folder to a local drive. Configure Inventor/Workbench to use local templates. Network template access causes delays and potential corruption.

### Multiple Workbench Sessions

**Issue**: "Opening Inventor files in different sessions causing conflicts between the processes."
**Fix**: Don't run multiple Workbench sessions simultaneously. If you must, ensure different projects are open in each session. File locking conflicts cause crashes on save.

## Best Practices

1. **Rename AppData\\Ansys for startup issues** — fixes most Workbench and DesignModeler crashes
2. **Copy default agPreferences.xml for DesignModeler script errors** — restores corrupted preferences
3. **Add timeout settings to ansyslmd.ini** — fixes license server communication on high-latency networks
4. **Run ProductConfig.exe as Administrator after updates** — ensures proper component registration
5. **Reinstall Visual C++ redistributables for meshing errors** — fixes dependency corruption
6. **Keep projects on local drives** — prevents network-related corruption
7. **Maintain project backups** — enables recovery from schematic corruption
8. **Update graphics drivers regularly** — prevents display-related crashes
9. **Check if issues are user-specific** — helps isolate profile corruption
10. **Disable antivirus during installation** — prevents file blocking and DLL registration issues
