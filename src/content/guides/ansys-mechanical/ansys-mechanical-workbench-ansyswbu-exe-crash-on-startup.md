---
title: "Ansys Mechanical Workbench AnsysWBU.exe Crash on Startup"
excerpt: "Ansys Mechanical Workbench AnsysWBU.exe Crash on Startup: symptoms, root causes, and step-by-step fixes, verified against Ansys Knowledge Base."
category: "troubleshooting"
softwareSlug: "ansys-mechanical"
keyword: "Ansys Mechanical Workbench AnsysWBU.exe crash startup meshing error Intel compiler DLL libiomp5md.dll libmmd.dll System32 mesh script error 80004005 ProductConfig IPv6 localhost Intel Integrated Graphics NVIDIA Control Panel AppData reset"
slug: "ansys-mechanical-workbench-ansyswbu-exe-crash-on-startup"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/error-unable-to-start-mechanical-in-workbench-windows-ansyswbu-exe-encountered-a-problem-a-diagnostic-file-has-been-written-cusersusernameappdatalocaltempansyswbdumpfile-dmp-and-an/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/try-to-mesh-a-simple-geometry-e-g-a-cubic-in-workbench-mechanical-on-windows-get-a-misleading-error-of-the-mesh-generation-did-not-complete-due-to-poor-quality-elements-or-incorrect-input-please-try-meshing-with-another-mesh-method-or-different-mesh-options/"
  - "https://innovationspace.ansys.com/forum/forums/topic/ansys-meshing-script-error-80004005-nothing-seems-to-fix-it/"
---

# Ansys Mechanical Workbench AnsysWBU.exe Crash on Startup, Meshing Error from Intel Compiler DLL Conflict in System32, Mesh Script Error 80004005 from Corrupted Installation, IPv6 Localhost Resolution Preventing Workbench Launch, and Intel Integrated Graphics Overriding Professional GPU: AppData Reset, libiomp5md.dll Rename, ProductConfig Reconfiguration, IPv6 Disable, and NVIDIA Control Panel

Ansys Mechanical produces errors from Workbench startup crashes, Intel compiler DLL conflicts, mesh script corruption, IPv6 localhost issues, and graphics card override. This guide covers the 5 most common Ansys Mechanical problems with diagnostic steps and community-verified fixes from the Ansys Knowledge Base.

## 1. AnsysWBU.exe Crash on Startup from Corrupted AppData Settings

### Symptom

"AnsysWBU.exe encountered a problem. A diagnostic file has been written: C:\Users\username\AppData\Local\Temp\AnsysWBDumpFile.dmp" and "AnsysWB Module has stopped working: A problem caused the program to stop working correctly. Windows will close the program and notify you if a solution is available." Workbench cannot start. The crash occurs every time Workbench is launched. The diagnostic dump file is created but doesn't provide a clear cause.

### Root Cause

The Ansys Workbench user settings in the AppData directory have become corrupted. This can happen from a previous crash, improper shutdown, version conflict, or system update. The corrupted settings files prevent Workbench from initializing properly, causing AnsysWBU.exe to crash on startup. The settings files are stored in the user profile, not in the installation directory, so reinstalling Ansys doesn't fix the issue.

### Fix

1. **Close all Workbench sessions**:
   - "Close out of all WorkBench sessions"
   - Ensure no Ansys processes are running
   - Check Task Manager for AnsysWBU.exe and related processes
   - Kill any remaining processes

2. **Rename the Ansys AppData folder**:
   - "In Windows Explorer in the Address bar type: %appdata%"
   - "Open the folder 'Ansys'"
   - "Locate the v150, v160, v170, v180 (whatever version corresponds to the version of Ansys)"
   - "Rename the folder, for example, v150, v160, v170, v180 to v1#0_old"

3. **Rename the .ansys temp folder**:
   - "In Windows Explorer in the Address bar type: %temp%"
   - "Rename the .ansys folder"
   - This removes corrupted temporary data
   - That may be causing the crash

4. **Start a new Workbench session**:
   - "Start a new Workbench session"
   - After renaming the folders
   - Workbench will create fresh settings
   - The crash should be resolved

5. **Check graphics card and driver**:
   - "In the RUN command type: dxdiag"
   - "In the Display tab ensure that your graphics card is a supported Ansys graphics card"
   - "And that you have the latest graphics driver"
   - Update drivers if necessary

6. **Check localhost resolution**:
   - "Make sure you can resolve localhost"
   - "Open up a command window and type: ping localhost"
   - "If it returns an IPv6 address disable IPv6"
   - "It should return something like 127.0.0.1"

7. **Gather diagnostics if issue persists**:
   - "Please launch the ANSLIC_ADMIN Utility"
   - "Click View Status/Options, then Gather Diagnostic Information"
   - "Click 'Yes' when prompted"
   - Send diagnostics to Ansys support

### Community Report

> "Unable to start Mechanical in Workbench WINDOWS. AnsysWBU.exe encountered a problem. A diagnostic file has been written. In Windows Explorer in the Address bar type: %appdata% and open the folder 'Ansys'. Locate the v150, v160, v170, v180. Rename the folder to v1#0_old. In Windows Explorer in the Address bar type: %temp%. Rename the .ansys folder. Start a new Workbench session."

## 2. Meshing Error from Intel Compiler DLL Conflict in System32

### Symptom

Trying to mesh even a simple geometry (e.g., a cube) in Workbench Mechanical on Windows produces a misleading error: "The mesh generation did not complete due to poor quality elements or incorrect input. Please try meshing with another mesh method or different mesh options." The error occurs for any geometry, even simple ones. The mesh should generate without issues for a simple cube.

### Root Cause

"Some 3rd party software's installation on Windows may place some old version Intel compiler runtime library files under C:\Windows\system32, and crash some ANSYS applications, including meshing in Workbench Mechanical and Mesh, Mechanical APDL, Explicit Dynamic, Fluent and other ANSYS solvers." Third-party software installs old versions of Intel compiler runtime libraries (libiomp5md.dll and libmmd.dll) into C:\Windows\system32. These old versions (dated 2010) are much smaller than the versions in the Ansys installation directory. When Ansys applications load, Windows finds the old DLLs in System32 first (due to DLL search path), causing the meshing server to crash.

### Fix

1. **Check for conflicting DLLs in System32**:
   - Look for these files in `C:\Windows\system32`:
   - `libiomp5md.dll` (Intel OpenMP Runtime Library)
   - `libmmd.dll` (Math Library for Intel Compiler)
   - Check file dates and sizes

2. **Compare with Ansys installation versions**:
   - "Below files were found on two customers' C:\Windows\system32 folder:"
   - "09/02/2010 08:20 PM 529,080 libiomp5md.dll"
   - "09/02/2010 08:16 PM 2,838,200 libmmd.dll"
   - "They are old dated, file size are much smaller than the below ones in Ansys installation:"
   - "02/06/2019 08:38 AM 1,728,232 libiomp5md.dll"
   - "02/06/2019 08:38 AM 4,271,848 libmmd.dll"

3. **Rename the conflicting DLLs**:
   - "Try to rename the 2 files by adding .old"
   - Rename `C:\Windows\system32\libiomp5md.dll` to `libiomp5md.dll.old`
   - Rename `C:\Windows\system32\libmmd.dll` to `libmmd.dll.old`
   - Relaunch Workbench

4. **Verify Ansys uses correct DLLs**:
   - After renaming the System32 DLLs
   - Ansys will use the correct DLLs
   - From `C:\Program Files\ANSYS Inc\v2xx\vtp\IntelCompiler\...\winx64`
   - Meshing should now work

5. **Handle third-party application issues**:
   - "If above renaming affects 3rd party applications"
   - "Copy them to the folder where 3rd party application executable is located"
   - "And rename them back"
   - The third-party app should use its local copies

6. **Remove DLLs from System32 permanently**:
   - "Such Intel compiler runtime library files should not be placed in C:\Windows\system32"
   - "Since different applications or same application but different versions may need different version runtime libraries"
   - Move the DLLs to the third-party app's directory
   - Instead of System32

7. **Check for other conflicting DLLs**:
   - After fixing libiomp5md.dll and libmmd.dll
   - Check for other Intel compiler DLLs in System32
   - That may conflict with Ansys
   - Rename any conflicting DLLs

### Community Report

> "Some 3rd party software's installation on Windows may place some old version Intel compiler runtime library files under C:\Windows\system32, and crash some ANSYS applications, including meshing in Workbench Mechanical. libiomp5md.dll is Intel OpenMP Runtime Library. And libmmd.dll is Math Library for Intel Compiler. Both are required by AnsMeshingServer.exe. Try to rename the 2 files by adding .old, relaunch Workbench and/or affected ANSYS applications, it should turn to the correct libraries in ANSYS installation and fix the issue."

## 3. Mesh Script Error 80004005 from Corrupted Installation

### Symptom

Ansys Meshing reports "script error 80004005" every time the mesh module is edited. The error may have started with "Failed determining temp directory location" before progressing to the script error. Renaming the Ansys folder in AppData, running regsvr32 commands, changing the Workbench language, and updating graphics drivers don't fix the issue. Uninstalling and reinstalling Ansys multiple times doesn't help.

### Root Cause

"Looks like meshing is got corrupted." The Ansys Meshing installation has become corrupted. This can happen from a failed update, interrupted installation, or conflict with other software. The meshing component's registration or dependencies are damaged. Simply uninstalling and reinstalling may not fix the issue if the corrupted components are not properly removed during uninstallation. The Microsoft Visual C++ redistributables may also be corrupted or conflicting.

### Fix

1. **Run ProductConfig.exe as Administrator**:
   - "Run the ProductConfig.exe from C:\Program Files\ANSYS Inc\v2xx"
   - "Right clicking the productconfig.exe file and select 'Run as Administrator'"
   - "Selecting all options"
   - "Make sure you also click on 'Install Required Prerequisites'"

2. **Uninstall and reinstall Microsoft Visual C++**:
   - "Please try uninstalling these:"
   - "Microsoft Visual C++ 2019 / x86 and x64"
   - "Microsoft Visual C++ 2017 / x86 and x64"
   - "Download and install the Microsoft Visual C++ Redistributable for Visual Studio 2015, 2017 and 2019, both x86 and x64"

3. **Rename the Ansys AppData folder**:
   - "Open a file explorer and enter %APPDATA% in the address line"
   - "Here you will find an Ansys directory"
   - "Inside this you will find various directories with the number of the release"
   - "Rename that corresponding folder (i.e. v211) to a different name (i.e. backup_v211)"

4. **Restart Workbench after reconfiguration**:
   - "Then start Ansys Workbench again"
   - "And test to open Ansys Meshing"
   - "The folder will automatically get created again"
   - "It only contains user settings, so typically can just be removed and re-created"

5. **Clean uninstall Ansys**:
   - "If the above workaround doesn't help"
   - "Can you try re-installing the Ansys version on client machine?"
   - Use the Ansys uninstaller
   - Then manually delete remaining Ansys folders

6. **Delete remaining Ansys folders after uninstall**:
   - After uninstalling, check for remaining folders:
   - `C:\Program Files\ANSYS Inc`
   - `%APPDATA%\Ansys`
   - `%LOCALAPPDATA%\Ansys`
   - Delete all remaining Ansys folders before reinstalling

7. **Install with antivirus disabled**:
   - Temporarily disable antivirus during installation
   - Antivirus can interfere with Ansys installation
   - By blocking DLL registration or file copying
   - Re-enable antivirus after installation

### Community Report

> "I keep receiving this error from Ansys Meshing every time I try to edit the mesh module. It all started with the error: Failed determining temp directory location. I have literally tried everything. Run the ProductConfig.exe from C:\Program Files\ANSYS Inc\v2xx and configure the application again, by right clicking and selecting Run as Administrator. Please try uninstalling Microsoft Visual C++ 2019 / x86 and x64 and reinstalling. Rename the corresponding folder in %APPDATA%\Ansys."

## 4. IPv6 Localhost Resolution Preventing Workbench Launch

### Symptom

Ansys Workbench can't start or crashes during startup. The crash may be related to licensing — Workbench can't connect to the local license server. Pinging localhost returns an IPv6 address instead of IPv4 127.0.0.1. The issue may have started after a Windows update that enabled IPv6 by default.

### Root Cause

"Make sure you can resolve localhost. Open up a command window and type: ping localhost. If it returns an IPv6 address disable IPv6. It should return something like this for IPv4: Pinging computer_name.domain.com [127.0.0.1]." Ansys Workbench and its licensing components use localhost to connect to the local license server. When IPv6 is enabled, localhost may resolve to an IPv6 address (::1) instead of IPv4 (127.0.0.1). Some Ansys components don't support IPv6, causing the connection to fail and Workbench to crash.

### Fix

1. **Check localhost resolution**:
   - "Open up a command window and type: ping localhost"
   - If it returns `::1` (IPv6), that's the problem
   - It should return `127.0.0.1` (IPv4)
   - "If it returns an IPv6 address disable IPv6"

2. **Uncheck IPv6 on network adapter**:
   - "Open up the properties of your network adapter"
   - "And uncheck the IPv6 checkbox only"
   - This unbinds IPv6 from that particular network adapter
   - But doesn't disable IPv6 in Windows entirely

3. **Disable IPv6 via registry (complete disable)**:
   - "Doing this however, only unbinds IPv6 from that particular network adapter"
   - "It doesn't disable IPv6 in Windows"
   - "To cleanly disable IPv6 a registry key must be added"
   - "Go to the following web site for a registry file: https://support.microsoft.com/en-us/kb/929852"

4. **Verify IPv6 is disabled**:
   - "Verify that IPv6 is disabled by typing ipconfig /all"
   - "From the command prompt"
   - "The output should only show IPv4 addresses"
   - No IPv6 addresses should appear

5. **Reboot after disabling IPv6**:
   - "When you have disabled IPv6 a reboot is necessary"
   - Restart the computer
   - Then try launching Workbench
   - The localhost should now resolve to 127.0.0.1

6. **Check hosts file**:
   - Open `C:\Windows\System32\drivers\etc\hosts`
   - Ensure `127.0.0.1 localhost` is present
   - And `::1 localhost` is commented out or removed
   - This forces IPv4 resolution for localhost

7. **Check license server connection**:
   - After disabling IPv6
   - Verify the license server is accessible
   - Run `ping localhost` to confirm IPv4
   - Launch Workbench

### Community Report

> "Make sure you can resolve localhost. Open up a command window and type: ping localhost. If it returns an IPv6 address disable IPv6. It should return something like this for IPv4: Pinging computer_name.domain.com [127.0.0.1]. Open up the properties of your network adapter and uncheck the IPv6 checkbox only. To cleanly disable IPv6 a registry key must be added. When you have disabled IPv6 a reboot is necessary."

## 5. Intel Integrated Graphics Overriding Professional GPU

### Symptom

Ansys Workbench or Mechanical crashes, has display issues, or runs slowly. The system has both Intel Integrated Graphics and a professional NVIDIA or AMD graphics card. The Intel Integrated Graphics is the primary graphics processor, taking precedence over the professional card. Workbench uses the Intel graphics instead of the professional GPU.

### Root Cause

"If the output is showing that Intel Integrated Graphics is the primary graphics card taking precedence over your Professional graphics card." On systems with dual graphics (laptops or desktops with integrated + discrete graphics), Windows may default to the Intel Integrated Graphics for applications. Intel Integrated Graphics is not supported by Ansys and can cause crashes, display issues, and performance problems. The professional GPU (NVIDIA Quadro, AMD Radeon Pro) must be set as the preferred graphics processor for Ansys applications.

### Fix

1. **Set NVIDIA as preferred graphics processor**:
   - "Open up Control Panel > nVidia Control Panel"
   - "Go to 3D settings > Manage 3D settings"
   - "Under Preferred Graphics Processor > choose nVidia"
   - "Apply"

2. **Set specific Ansys executables to use NVIDIA**:
   - In NVIDIA Control Panel > Manage 3D Settings > Program Settings
   - Add Ansys executables:
   - `AnsysWBU.exe` (Workbench)
   - `AnsMechanical.exe` (Mechanical)
   - `AnsMeshingServer.exe` (Meshing)
   - Set each to use the NVIDIA GPU

3. **Check dxdiag for active graphics card**:
   - "In the RUN command type: dxdiag"
   - "In the Display tab ensure that your graphics card is a supported Ansys graphics card"
   - "And that you have the latest graphics driver"
   - Verify the professional GPU is active

4. **Update graphics drivers**:
   - "Please visit the graphics card vendors web site"
   - "And download and install the newest graphics driver"
   - For NVIDIA: download from NVIDIA website
   - For AMD: download from AMD website

5. **Disable Intel Integrated Graphics**:
   - If setting NVIDIA as preferred doesn't work
   - Disable Intel Integrated Graphics in Device Manager
   - This forces all applications to use the professional GPU
   - But may affect battery life on laptops

6. **Check supported graphics cards**:
   - "If you have an AMD Radeon, Nvidia Matrix or are using the Intel Integrated graphics cards"
   - "These will generally not work and are not supported"
   - "Please visit the Ansys graphics cards tested page"
   - Ensure your professional GPU is on the supported list

7. **Set Windows graphics performance preference**:
   - In Windows 10/11: Settings > System > Display > Graphics
   - Add Ansys executables
   - Set to "High performance" (NVIDIA GPU)
   - This is an alternative to NVIDIA Control Panel

### Community Report

> "In the Display tab ensure that your graphics card is a supported Ansys graphics card and that you have the latest graphics driver. If the output is showing that Intel Integrated Graphics is the primary graphics card taking precedence over your Professional graphics card then do the following: Open up Control Panel > nVidia control Panel > go to 3D settings > Manage 3D settings > Under Preferred Graphics Processor > choose nVidia > Apply."

## 6. Additional Ansys Mechanical Issues

### Workbench Applications Don't Start After Crash (Linux)

**Issue**: "On Linux machines, if Workbench applications do not launch after an abnormal exit such as a crash."
**Fix**: Run the specified utility to clean up lock files and shared memory. On Linux, abnormal exits can leave lock files that prevent applications from launching.

### Wobbly Windows Desktop Effect Causes Crashes (Linux)

**Issue**: "The wobbly windows desktop effect on Linux machines may cause Workbench or its applications to crash."
**Fix**: "This effect is on by default on some Linux platforms. Make sure the effect is turned off." Disable desktop effects (Compiz or similar) when running Ansys on Linux.

### System Coupling Crashes in Remote Session

**Issue**: "System Coupling component crashes in Remote Session."
**Fix**: Refer to the General Workbench Issues documentation. Remote session configurations may have specific limitations for System Coupling. Check the Ansys help for remote session requirements.

### 2025 R2 AnsysWBU.exe Error

**Issue**: "Mechanical 2025 R2 error 'AnsysWBU.exe has encountered a problem.'"
**Fix**: Same as the general AnsysWBU.exe crash fix — rename AppData\Ansys folder and %temp%\.ansys folder. If the issue persists, check for Intel compiler DLL conflicts and graphics card issues.

### Meshing Error with Simple Geometry

**Issue**: "Try to mesh a simple geometry (e.g., a cubic) in Workbench Mechanical on Windows, get a misleading error."
**Fix**: The error is misleading — the real cause is Intel compiler DLL conflict in System32. Rename libiomp5md.dll and libmmd.dll in C:\Windows\system32. This affects not just meshing but also Mechanical APDL, Explicit Dynamic, Fluent, and other solvers.

### Failed Determining Temp Directory Location

**Issue**: "It all started with the error: Failed determining temp directory location."
**Fix**: Check the TEMP and TMP environment variables. Ensure they point to valid directories with sufficient space. Check permissions on the temp directory. Rename the .ansys folder in %temp%.

### Ansys License Server Version Compatibility

**Issue**: What license server version is required for Ansys 2025 R1+?
**Fix**: "Your license server must be using a minimum of Ansys License Manager Release 2024 R1.03. Client systems must be pointing to the license server, using an FlexNet Publisher binaries equal to or greater than v11.19.5.0."

## Best Practices

1. **Rename AppData\Ansys and %temp%\.ansys for WBU crash** — fixes most startup crashes
2. **Check for Intel compiler DLLs in System32** — rename libiomp5md.dll and libmmd.dll
3. **Run ProductConfig.exe as Administrator** — fixes corrupted meshing installation
4. **Reinstall Microsoft Visual C++ redistributables** — fixes dependency corruption
5. **Disable IPv6 if localhost resolves to ::1** — fixes license server connection
6. **Set NVIDIA as preferred graphics processor** — prevents Intel graphics override
7. **Update graphics drivers regularly** — ensures compatibility and stability
8. **Disable antivirus during installation** — prevents file blocking and DLL registration issues
9. **Check dxdiag for active graphics card** — verify professional GPU is being used
10. **Clean uninstall before reinstalling** — delete all remaining Ansys folders
