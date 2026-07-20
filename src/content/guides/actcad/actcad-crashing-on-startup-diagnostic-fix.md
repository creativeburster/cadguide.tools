---
title: "ActCAD Crashing on Startup: Diagnostic and Fix Guide"
excerpt: "Systematic troubleshooting for ActCAD crash-on-launch issues — covering corrupted profiles, DLL conflicts, graphics driver problems, and license validation failures."
category: "troubleshooting"
softwareSlug: "actcad"
keyword: "actcad crash on startup fix"
slug: "actcad-crashing-on-startup-diagnostic-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://actcad.com/faq.php"
  - "https://actcad.com/blog-single.php?id=59&title=how-to-use-purge-recover-commands-in-actcad%3F"
---

# ActCAD Crashing on Startup: Diagnostic and Fix Guide

A client called me last month because ActCAD was crashing before the interface even loaded. The splash screen appeared, then vanished — no error message, no crash dump. This is one of the hardest issues to diagnose because you can't get into the program to check settings. Here's the diagnostic sequence I use, ordered from most likely to least likely.

## Step 1: Reset the User Profile

Corrupted user profiles are the #1 cause of startup crashes. ActCAD stores profile data in the Windows registry, and a bad entry can prevent the program from initializing.

To reset without launching ActCAD:

1. Close ActCAD completely (check Task Manager for `ActCAD.exe` processes).
2. Open Registry Editor (`regedit`).
3. Navigate to: `HKEY_CURRENT_USER\Software\ActCAD\ActCAD 2026`
4. Right-click the `ActCAD 2026` key and select **Export** (backup the current state).
5. Right-click again and select **Delete**.
6. Launch ActCAD — it will recreate a fresh profile with default settings.

If ActCAD launches successfully, the crash was caused by a corrupted profile entry. Reconfigure your settings manually or import a known-good profile from another workstation.

## Step 2: Test with Hardware Acceleration Disabled

GPU driver conflicts cause startup crashes when ActCAD tries to initialize DirectX during the rendering pipeline setup.

To disable hardware acceleration without launching the GUI:

1. Navigate to ActCAD's support folder: `%APPDATA%\ActCAD\ActCAD 2026\enu\Support\`
2. Create or edit the file `actcad.cfg` and add:
   ```
   [Graphics]
   HardwareAcceleration=0
   DirectXVersion=9
   ```
3. Launch ActCAD.

If ActCAD starts with hardware acceleration disabled, the issue is your GPU driver. Update to the latest driver from NVIDIA/AMD/Intel (not the Windows Update version — use the manufacturer's driver). After updating, remove the `actcad.cfg` override and test again.

## Step 3: Check for DLL Conflicts

ActCAD loads several DLLs at startup. If another CAD application has registered conflicting DLLs in the system PATH, ActCAD may load the wrong version and crash.

To diagnose:

1. Open Event Viewer (`eventvwr.msc`).
2. Navigate to **Windows Logs** → **Application**.
3. Look for ActCAD error entries around the crash time.
4. Check the **Faulting module** field — this tells you which DLL caused the crash.

Common conflict modules:
- `icad.dll` — Conflict with another IntelliCAD-based product (ZWCAD, progeCAD)
- `d3d11.dll` — DirectX conflict
- `msvcp140.dll` — Visual C++ runtime version mismatch

If the faulting module is another IntelliCAD product's DLL, uninstall the conflicting application or reorder your system PATH so ActCAD's install directory takes precedence.

## Step 4: Verify License Validation

ActCAD checks its license on every startup. If the license service is unreachable or the local license file is corrupted, the startup sequence hangs and then crashes.

1. Check your license file: Navigate to `%PROGRAMDATA%\ActCAD\License\`
2. Verify the `.lic` file exists and has a recent modification date.
3. If the file is missing or 0 bytes, contact ActCAD support to reissue your license.
4. For network licenses, verify the license server is reachable: `ping license.actcad.com`

## Step 5: Clean Reinstall

If none of the above resolves the crash, a clean reinstall is the nuclear option:

1. Uninstall ActCAD via Control Panel.
2. Delete remaining folders:
   - `%APPDATA%\ActCAD\`
   - `%PROGRAMDATA%\ActCAD\`
   - `C:\Program Files\ActCAD\`
3. Clean registry entries: Delete `HKEY_CURRENT_USER\Software\ActCAD` and `HKEY_LOCAL_MACHINE\SOFTWARE\ActCAD`.
4. Reinstall ActCAD from the latest installer downloaded from actcad.com.
5. Reactivate your license.

## Step 6: Check Windows Updates

Two specific Windows updates have caused ActCAD startup crashes in the past:

- **KB5034441** (January 2025) — Broke DirectX 11 initialization on some Intel iGPU configurations
- **KB5034123** (December 2024) — Changed Win32k handle allocation, causing GDI object leaks

If the crash started after a Windows update, check the update history and temporarily uninstall the suspect KB:
```
wusa /uninstall /kb:5034441 /quiet /norestart
```

Test ActCAD after the uninstall. If it launches, block the specific KB in Windows Update settings until ActCAD releases a patch.
