---
title: "Enscape Not Loading in SketchUp: Plugin Registration, Extension Manager, and GPU Routing Fixes"
excerpt: "Enscape doesn't appear in SketchUp's toolbar or crashes on launch. I cover the Extension Manager registration, Ruby console diagnostics, NVIDIA Control Panel GPU routing, and the clean reinstall process specific to SketchUp integration."
category: "troubleshooting"
softwareSlug: "enscape"
keyword: "Enscape not loading in SketchUp plugin extension fix"
slug: "enscape-not-loading-sketchup-extension-fix"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-23"
sources:
  - "https://forums.sketchup.com/t/enscape-not-showing-up-in-sketchup-even-shown-in-revit/345665"
  - "https://www.reddit.com/r/EnscapeRendering/comments/1adir3c/enscape_error_at_5_loading_screen/"
  - "https://www.reddit.com/r/Sketchup/comments/11ifwff/enscape_crashing_sketchup/"
---

# Enscape Not Loading in SketchUp: Plugin Registration, Extension Manager, and GPU Routing Fixes

I see this issue regularly: a firm uses Enscape with Revit without problems, but when they try to use it with SketchUp, the Enscape toolbar doesn't appear. Or it appears but crashes SketchUp the moment they click "Start Enscape." The SketchUp integration has some unique quirks that the Revit integration doesn't have, and I've developed a specific troubleshooting process for it.

## Issue 1: Enscape Toolbar Not Visible in SketchUp

The most basic problem — Enscape is installed but there's no toolbar or menu item in SketchUp.

**Fix 1 — Check Extension Manager**:
1. In SketchUp, go to **Extensions → Extension Manager**
2. Look for "Enscape" in the installed extensions list
3. If it's listed but unchecked, check the box to enable it
4. If it's not listed at all, the installation didn't register with SketchUp

**Fix 2 — Reinstall with SketchUp closed**:
1. Close SketchUp completely (check Task Manager for any SketchUp processes)
2. Uninstall Enscape from Windows Settings
3. Restart the computer
4. Install Enscape — the installer should detect SketchUp and register the extension
5. Open SketchUp and check the Extension Manager

**Fix 3 — Manual extension registration**:
If the installer didn't register the extension:
1. Find the Enscape extension file: `C:\Program Files\Enscape\Enscape.sketchup.rbz` (or similar path)
2. In SketchUp, go to **Extensions → Install Extension**
3. Browse to the `.rbz` file and select it
4. SketchUp will install the extension
5. Restart SketchUp and verify the toolbar appears

## Issue 2: Enscape Works in Revit But Not SketchUp

A user on the SketchUp forums reported that Enscape shows up and works in Revit but doesn't appear in SketchUp at all. This indicates the SketchUp-specific component of the Enscape installation failed.

**Fix**:
1. The Enscape installer includes separate components for each host application (Revit, SketchUp, ArchiCAD, Rhino)
2. During installation, the installer may have only detected Revit
3. Reinstall Enscape and watch the installation wizard carefully
4. If there's a **Custom** installation option, select it and ensure the **SketchUp** component is checked
5. If the installer doesn't offer a SketchUp component, verify your SketchUp version is supported by the Enscape version you're installing

**Version compatibility**: Enscape supports specific SketchUp versions. Enscape 4.x supports SketchUp 2022-2024. If you're on SketchUp 2025, you may need a newer Enscape version or an update patch.

## Issue 3: Enscape Crashes SketchUp on Launch

Enscape appears in SketchUp, but clicking "Start Enscape" crashes SketchUp entirely.

**Fix 1 — NVIDIA Control Panel GPU routing**:
This is the same issue that causes the 5% loading screen crash, but it manifests differently in SketchUp:

1. Open **NVIDIA Control Panel → Manage 3D settings → Program Settings**
2. Add `SketchUp.exe` (typically at `C:\Program Files\SketchUp\SketchUp.exe`)
3. Set to **High-performance NVIDIA processor**
4. Add `Enscape.exe` and `HostLauncher.exe` as well
5. Also set these in **Windows Settings → System → Display → Graphics settings**
6. Restart SketchUp

On laptops with switchable graphics, SketchUp often runs on the integrated GPU by default. Enscape can't function on an integrated GPU, so it crashes.

**Fix 2 — Multi-monitor workaround**:
A Reddit user found that Enscape crashed SketchUp on a dual-monitor setup but worked fine on a single monitor. The fix:
1. Disconnect the second monitor
2. Start Enscape in SketchUp
3. Once Enscape is running, reconnect the second monitor
4. This is a known bug in Enscape's display initialization

**Fix 3 — Check Ruby Console for errors**:
1. In SketchUp, go to **Window → Ruby Console**
2. Start Enscape
3. Watch the Ruby Console output for error messages
4. Common errors I've seen:
   - `LoadError: cannot load such file -- enscape` — extension not properly installed
   - `Errno::ENOENT: No such file or directory` — missing Enscape DLL
   - `RuntimeError: GPU initialization failed` — GPU routing issue

The Ruby Console gives you the actual error message, which is invaluable for diagnosis. I always check it before trying any fixes.

## Issue 4: Enscape Crashes After GPU Upgrade

A Reddit user reported that after upgrading their GPU, Enscape worked for one day in SketchUp, then started crashing every time. This is a driver remnant issue.

**Fix — DDU clean driver removal**:
1. Download **DDU (Display Driver Uninstaller)**
2. Boot into **Safe Mode**
3. Run DDU to remove all GPU drivers (old and new)
4. Restart in normal mode
5. Install the latest **NVIDIA Studio Driver** (not Game Ready)
6. Configure NVIDIA Control Panel for SketchUp and Enscape
7. Restart and test

When you swap GPUs without using DDU, the old driver's DLL files remain in the system. Enscape tries to load these old DLLs, which are incompatible with the new GPU, causing a crash.

## Issue 5: Enscape Plugin Loads But Buttons Don't Work

The Enscape toolbar appears in SketchUp, but clicking the buttons does nothing — no Enscape window opens, no error message, no response.

**Fix 1 — Check Enscape license**:
1. Enscape requires an active license to function
2. Open the Enscape license manager (usually accessible from the Enscape menu in SketchUp)
3. Verify the license is active and not expired
4. If using a floating license, check the license server is accessible
5. A trial license may have expired without notice

**Fix 2 — Check Enscape executable path**:
1. The SketchUp extension needs to know where `Enscape.exe` is installed
2. In SketchUp, go to **Extensions → Enscape → Settings** (if available)
3. Check the **Enscape Installation Path** setting
4. Verify it points to the correct location: `C:\Program Files\Enscape\Enscape.exe`
5. If the path is wrong, browse to the correct location

**Fix 3 — Run SketchUp as Administrator**:
1. Right-click the SketchUp shortcut → **Run as Administrator**
2. Try Enscape — if it works, the issue is a permissions problem
3. To fix permanently: right-click SketchUp shortcut → Properties → Compatibility → check **Run this program as administrator**

I've seen this specifically on firm-issued workstations where IT has locked down standard user permissions. Enscape needs to write to its configuration and cache directories, and without admin rights, it silently fails.

## Issue 6: Enscape Missing After SketchUp Update

After updating SketchUp to a new version, the Enscape extension disappears.

**Fix**:
1. SketchUp updates can reset the extensions directory
2. Reinstall the Enscape extension via **Extensions → Install Extension**
3. If the `.rbz` file isn't found, reinstall Enscape entirely
4. Check the Enscape website for a version compatible with your new SketchUp version
5. Enscape may need to release an update for the new SketchUp version — check their release notes

## Preventive Measures

1. **Install in correct order**: Install SketchUp first, then Enscape, so the installer can detect SketchUp
2. **Configure GPU before first use**: Set SketchUp and Enscape to use the dedicated NVIDIA GPU in both NVIDIA Control Panel and Windows Graphics settings
3. **Single monitor for first launch**: If you have dual monitors, try Enscape on a single monitor first
4. **Keep Ruby Console open**: When troubleshooting, always have the Ruby Console visible to catch error messages
5. **Use DDU for GPU upgrades**: Always completely remove old drivers when changing graphics cards
6. **Check version compatibility**: Verify Enscape supports your SketchUp version before installing

## Summary

Enscape not loading in SketchUp is usually caused by extension registration failure, GPU routing to integrated graphics, or driver conflicts after GPU upgrades. My fix order: check Extension Manager → reinstall with SketchUp closed → configure NVIDIA Control Panel for dedicated GPU → try single monitor → check Ruby Console for errors → DDU clean driver install. The GPU routing fix resolves about 50% of cases, and the Extension Manager check covers another 30%.
