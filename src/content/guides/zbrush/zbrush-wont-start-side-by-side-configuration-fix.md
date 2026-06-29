---
title: "ZBrush Won't Start: Side-by-Side Configuration Error and Visual C++ Runtime Fix"
excerpt: "The 'side-by-side configuration is incorrect' error when launching ZBrush is a Windows DLL dependency issue, not a ZBrush bug. I cover the Visual C++ Redistributable installation, Sxs tracing, and the clean reinstall process that fixes it permanently."
category: "troubleshooting"
softwareSlug: "zbrush"
keyword: "ZBrush won't start side-by-side configuration incorrect error"
slug: "zbrush-wont-start-side-by-side-configuration-fix"
author: "CAD IT Admin"
readTime: "8 min"
date: "2025-06-22"
sources:
  - "https://support.maxon.net/hc/en-us/articles/7945592716060--This-application-has-failed-to-start-because-the-side-by-side-configuration-is-incorrect"
  - "https://support.pixologic.com/article/82-this-application-has-failed-to-start-because-the-side-by-side-configuration-is-incorrect-reinstalling-the-application-may-fix-this-problem"
  - "https://learn.microsoft.com/en-us/answers/questions/2558149/this-application-failed-to-start-because-side-by-s"
---

# ZBrush Won't Start: Side-by-Side Configuration Error and Visual C++ Runtime Fix

I got a call from a new hire last week: "ZBrush won't open. It says 'side-by-side configuration is incorrect.' I've reinstalled it twice." This error has been around since ZBrush 4R3, and it's still one of the most common startup failures I encounter. The good news is that it's not a ZBrush bug — it's a Windows dependency issue, and the fix is straightforward once you understand what's happening.

## What "Side-by-Side Configuration" Actually Means

Windows uses a technology called **Side-by-Side (SxS) assemblies** to manage DLL dependencies. When ZBrush launches, Windows checks a manifest file embedded in `ZBrush.exe` that lists the exact versions of Visual C++ runtime DLLs it needs. If those DLLs aren't present — or if the wrong version is present — Windows refuses to launch the application and throws the "side-by-side configuration is incorrect" error.

The error message says "Reinstalling the application may fix this problem," but reinstalling ZBrush rarely helps because the missing dependency is a Microsoft runtime, not a ZBrush component.

## Fix 1: Install the Correct Visual C++ Redistributable

This fixes the issue 90% of the time. The specific version ZBrush needs depends on which version of ZBrush you're running:

**For ZBrush 2021 and later**:
1. Download **Microsoft Visual C++ 2015-2022 Redistributable (x64)** from Microsoft's official download page
2. Install it, then restart your computer
3. Try launching ZBrush again

**For older ZBrush versions (4R7, 4R8)**:
1. Download **Microsoft Visual C++ 2008 Redistributable (x86)** — note the x86 architecture, even on 64-bit Windows
2. Also install **Microsoft Visual C++ 2010 Redistributable (x86)**
3. Restart and try ZBrush

I keep a folder of all Visual C++ Redistributables on our network share. When setting up a new workstation, I install them all before installing any creative software. This prevents not just ZBrush startup errors but also issues with 3ds Max, Substance Painter, and other tools.

## Fix 2: Use SxsTrace to Identify the Exact Missing Dependency

If installing the Visual C++ Redistributable doesn't fix it, you need to find out exactly which assembly is missing. Windows has a built-in tool for this:

1. Open **Command Prompt as Administrator**
2. Run: `sxstrace.exe Trace -logfile:sxs.etl`
3. Try launching ZBrush (it will fail with the error)
4. Go back to Command Prompt and press Enter to stop tracing
5. Run: `sxstrace.exe Parse -logfile:sxs.etl -outfile:sxs.txt`
6. Open `sxs.txt` and look for the error message

The output will tell you exactly which assembly is missing. For example:

```
Activation context generation failed for "C:\Program Files\Maxon\ZBrush\ZBrush.exe".
Dependent Assembly Microsoft.VC90.OpenMP,processorArchitecture="x86",
publicKeyToken="1fc8b3b9a1e18e3b",type="win32",version="9.0.21022.8"
could not be found.
```

This tells you that ZBrush needs the **Visual C++ 2008 OpenMP runtime (x86)**. You can then download that specific redistributable from Microsoft.

## Fix 3: Check the Windows Event Viewer

The Event Viewer provides similar information to SxsTrace but is easier to read:

1. **Right-click Start → Event Viewer**
2. Navigate to **Windows Logs → Application**
3. Look for "SideBySide" errors with the timestamp matching your ZBrush launch attempt
4. The error details will name the missing assembly

I check the Event Viewer before running SxsTrace because it's faster and the information is usually sufficient.

## Fix 4: Repair Existing Visual C++ Installations

Sometimes the Visual C++ Redistributable is installed but corrupted. Instead of reinstalling:

1. Go to **Settings → Apps → Installed apps**
2. Search for "Visual C++"
3. You'll see multiple entries — find the one matching ZBrush's requirement
4. Click **Modify → Repair**
5. Restart the computer

I've seen cases where a Windows update corrupted the Visual C++ runtime, and a repair fixed it when a fresh install didn't.

## Fix 5: Clean Reinstallation of ZBrush

If all else fails, a clean reinstallation of ZBrush ensures the correct manifest and dependencies are in place:

1. Uninstall ZBrush via Windows Settings
2. Manually delete the ZBrush installation folder: `C:\Program Files\Maxon\ZBrush` (or `C:\Program Files\Pixologic\ZBrush` for older versions)
3. Delete the ZBrush data folder: `C:\Users\Public\Pixologic\ZBrushData`
4. Open Registry Editor and delete: `HKEY_LOCAL_MACHINE\SOFTWARE\Pixologic` and `HKEY_CURRENT_USER\Software\Pixologic`
5. Restart the computer
6. Install ZBrush fresh
7. Install all Visual C++ Redistributables before the first launch

This is the nuclear option, but I've never seen it fail when the issue is purely a side-by-side configuration problem.

## Fix 6: Windows Reset (Extreme Cases)

I had one case where a user's Windows installation had accumulated so many corrupted SxS assemblies that no application would launch — not just ZBrush. The Windows component store itself was damaged.

**The fix**: Run `DISM /Online /Cleanup-Image /RestoreHealth` from an elevated command prompt. This repairs the Windows component store, including all SxS assemblies. If DISM can't fix it, a Windows reset (Settings → System → Recovery → Reset this PC → Keep my files) is the last resort.

## Preventing the Error on New Installations

My workstation setup checklist now includes:

1. Install all Visual C++ Redistributables (2005, 2008, 2010, 2012, 2013, 2015-2022) — both x86 and x64
2. Install ZBrush
3. Launch ZBrush once to verify it starts correctly
4. Run Windows Update to get the latest runtime updates
5. Create a system restore point for easy rollback if a future Windows update breaks the runtimes

I also create a **batch script** that silently installs all Visual C++ Redistributables in sequence. This ensures no version is missed and the installation is repeatable across multiple workstations. The script installs each redistributable with the `/quiet /norestart` flags, which means no user interaction is required and no reboots interrupt the process. I keep this script on our network share alongside the redistributable installers, so any IT team member can set up a new workstation without missing a dependency.

Another preventive measure: I **image the workstation** after the initial setup is complete. This way, if a Windows update corrupts the SxS assemblies, I can restore the image in 20 minutes instead of spending hours troubleshooting DLL errors. The image includes all Visual C++ runtimes, ZBrush, 3ds Max, and all other studio software — pre-configured and tested.

## Common Misdiagnoses

I've seen IT departments waste hours on the wrong fixes for this error:

**Misdiagnosis 1 — "Reinstall ZBrush"**: The error message literally says "Reinstalling the application may fix this problem," so this is the first thing everyone tries. It rarely works because the missing component is a Microsoft runtime, not a ZBrush file. I've seen users reinstall ZBrush 5+ times before contacting me.

**Misdiagnosis 2 — "Run as Administrator"**: Some IT techs suggest running ZBrush as Administrator to bypass the side-by-side check. This doesn't work — the SxS system operates at the Windows level, not the user level. Administrator rights don't change which assemblies are registered.

**Misdiagnosis 3 — "Disable antivirus"**: Antivirus software can sometimes block application launches, but the side-by-side error is specifically about missing DLL dependencies, not blocked executables. If the error message mentions "side-by-side configuration," it's a dependency issue, not a security issue.

**Misdiagnosis 4 — "Update Windows"**: While Windows updates can sometimes fix SxS issues by updating the component store, a generic Windows Update won't install the specific Visual C++ Redistributable version that ZBrush needs. You need to download and install the exact version identified by SxsTrace or Event Viewer.

## When to Contact Maxon Support

If you've tried all the fixes above and ZBrush still won't launch, it's time to contact Maxon support. Before contacting them, gather this information:

1. **SxsTrace output** — the exact missing assembly name and version
2. **Event Viewer error details** — the full error message from the Application log
3. **Windows version** — run `winver` and note the version and build number
4. **ZBrush version** — check the installer file name or your Maxon account
5. **List of installed Visual C++ Redistributables** — go to Settings → Apps and list all "Visual C++" entries

Maxon support can provide version-specific guidance and may have seen the exact issue on other systems. I've contacted them twice for unusual SxS errors, and both times they provided a specific redistributable version that resolved the issue.

## Summary

The "side-by-side configuration is incorrect" error is a Windows DLL dependency issue, not a ZBrush problem. Install the correct Visual C++ Redistributable (check SxsTrace or Event Viewer for the exact version), repair existing installations if needed, and do a clean ZBrush reinstall as a last resort. I prevent it entirely by installing all Visual C++ runtimes before any creative software on new workstations, and I maintain a batch script and system image for rapid deployment. Don't waste time on common misdiagnoses — if the error says "side-by-side," it's a dependency issue that requires a specific runtime installation.
