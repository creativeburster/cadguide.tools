---
title: "FreeCAD Crashes and Freezes: Safe Mode, Add-on Conflicts, and AppImage Stability"
excerpt: "FreeCAD crashes on startup, freezes during modeling, or behaves unpredictably after installing add-ons. I cover the safe mode restart, add-on isolation, and the AppImage vs installed version stability differences."
category: "troubleshooting"
softwareSlug: "freecad"
keyword: "FreeCAD crashes freezes safe mode add-on conflict AppImage"
slug: "freecad-crashes-freezes-safe-mode-addon-appimage"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-25"
sources:
  - "https://github.com/FreeCAD/FreeCAD/issues/20157"
  - "https://github.com/FreeCAD/FreeCAD/issues/18735"
  - "https://github.com/FreeCAD/FreeCAD/issues/8432"
---

# FreeCAD Crashes and Freezes: Safe Mode, Add-on Conflicts, and AppImage Stability

FreeCAD is an open-source CAD application built on multiple layers: Qt for the UI, Coin3D for 3D rendering, OCCT for geometry, and Python for scripting and add-ons. Each layer can introduce instability, and add-ons installed from the Add-on Manager can conflict with each other or with the core application. Users on the FreeCAD GitHub and forums report crashes on startup, freezes during modeling, and unpredictable behavior after installing add-ons.

A GitHub issue (#20157) reported that hovering over imported STEP geometry was "very slow" and that orbiting froze the program for several seconds. The developer response suggested restarting in safe mode to isolate the issue. This is a common debugging approach in FreeCAD.

## Fix 1: Restart in Safe Mode

FreeCAD's safe mode disables all add-ons and starts with default preferences. This is the first step in diagnosing any crash or freeze:

1. Go to **Help → Restart in Safe Mode**
2. FreeCAD restarts with:
   - All add-ons disabled
   - Default preferences
   - No custom workbenches
3. Test the operation that was causing the crash or freeze
4. If the problem disappears in safe mode, an add-on or preference is the cause
5. If the problem persists in safe mode, it's a core FreeCAD issue

### After Safe Mode Testing

If the problem disappears in safe mode:

1. Restart FreeCAD normally
2. Go to **Tools → Add-on Manager**
3. Disable all add-ons
4. Restart FreeCAD
5. Re-enable add-ons one at a time, testing after each
6. When the problem reappears, the last enabled add-on is the culprit

If the problem persists in safe mode:

1. Report the issue on the FreeCAD GitHub with:
   - FreeCAD version (from **Help → About FreeCAD**)
   - Operating system
   - Steps to reproduce
   - The FreeCAD report file (**Help → Report Bug**)

## Fix 2: Clear FreeCAD Configuration

Corrupted configuration files can cause crashes on startup:

### Windows

1. Close FreeCAD
2. Open File Explorer and enable **View → Hidden Items**
3. Navigate to: `%AppData%\FreeCAD\`
4. Rename the `user.cfg` file to `user.cfg.bak`
5. Rename the `system.cfg` file to `system.cfg.bak`
6. Restart FreeCAD — it will create fresh configuration files
7. If FreeCAD starts successfully, reconfigure your preferences manually

### Linux

1. Close FreeCAD
2. Rename `~/.config/FreeCAD/user.cfg` to `user.cfg.bak`
3. Rename `~/.config/FreeCAD/system.cfg` to `system.cfg.bak`
4. Restart FreeCAD

### Mac

1. Close FreeCAD
2. Rename `~/Library/Preferences/FreeCAD/user.cfg` to `user.cfg.bak`
3. Rename `~/Library/Preferences/FreeCAD/system.cfg` to `system.cfg.bak`
4. Restart FreeCAD

## Fix 3: Use the AppImage (Linux)

On Linux, the AppImage version of FreeCAD can be more stable than the repository version:

1. Download the AppImage from the FreeCAD website
2. Make it executable: `chmod +x FreeCAD*.AppImage`
3. Run it: `./FreeCAD*.AppImage`
4. The AppImage includes all dependencies (OCCT, Qt, Coin, Python) in a tested configuration
5. Repository versions may use system libraries that are incompatible with FreeCAD

### AppImage vs Repository

| Aspect | AppImage | Repository |
|--------|----------|------------|
| Dependencies | Bundled | System |
| Stability | Tested by FreeCAD team | Depends on distro maintainer |
| Updates | Manual download | Automatic with system updates |
| Version | Latest stable | May lag behind |

If you're experiencing crashes on Linux, try the AppImage before reporting a bug.

## Fix 4: Update OCCT and Python Versions

FreeCAD's stability depends on the versions of OCCT (geometry kernel) and Python (scripting engine):

1. Check your versions: **Help → About FreeCAD → Copy to clipboard**
2. Look for:
   - `OCC version`: Should be 7.7.0 or later
   - `Python version`: Should be 3.10 or later
   - `Qt version`: Should be 5.15 or 6.5+
3. If OCCT is older than 7.7, use the AppImage (Linux) or the official installer (Windows/Mac) which bundles a newer OCCT
4. Old OCCT versions have known bugs with STEP import and boolean operations

## Fix 5: Check for Conflicting Add-ons

Some add-ons are known to conflict with each other or with specific FreeCAD versions:

### Assembly Workbench Conflicts

1. Don't install A2plus, Assembly3, and Assembly4 simultaneously
2. They all modify the assembly handling and can conflict
3. Choose one assembly workbench and stick with it
4. If you need to switch, uninstall the old one first

### Workbench Loading Order

1. Some add-ons load at startup and can interfere with core workbenches
2. Go to **Edit → Preferences → Workbenches**
3. Review the **Enabled Workbenches** list
4. Disable any workbenches you don't use
5. Fewer loaded workbenches = faster startup and fewer potential conflicts

### Python Dependency Conflicts

1. Some add-ons require specific Python packages
2. If two add-ons require different versions of the same package, conflicts occur
3. Check the Add-on Manager for dependency warnings
4. Install add-ons one at a time and test after each installation

## Fix 6: Fix Freezes During Modeling

### Boolean Operation Freezes

Boolean operations (fuse, cut, common) on complex geometry can freeze FreeCAD:

1. Simplify the input geometry before the boolean operation
2. Remove fillets and chamfers before boolean operations
3. Use **Part → Check Geometry** to verify inputs are valid
4. If the operation still freezes, try the **Part → Boolean** tool instead of the toolbar buttons
5. For very complex operations, use Python scripting:
   ```python
   import Part
   shape1 = Part.Shape()
   shape1.read("file1.brep")
   shape2 = Part.Shape()
   shape2.read("file2.brep")
   result = shape1.cut(shape2)
   result.exportBrep("result.brep")
   ```
   This bypasses the UI and can complete operations that freeze in the GUI.

### Rendering Freezes

1. Go to **Edit → Preferences → Display → 3D View**
2. Reduce **Maximum rendering framerate** to 30 FPS
3. Disable **Anti-aliasing**
4. Set **Render cache** to **Separate**
5. Disable **Show bounding box**
6. These settings reduce the rendering load and prevent freezes during orbiting

## Fix 7: Fix Startup Crashes

### Missing DLL Errors (Windows)

1. Install the **Microsoft Visual C++ Redistributable** (latest version)
2. Install the **Visual Studio 2019 Redistributable** specifically
3. FreeCAD depends on these libraries — missing versions cause startup crashes

### Python Path Issues

1. If you have multiple Python installations, FreeCAD may use the wrong one
2. Check: **Help → Python Console** → type `import sys; print(sys.executable)`
3. The path should point to FreeCAD's bundled Python, not a system Python
4. If it points to a system Python, remove or rename the `PYTHONPATH` and `PYTHONHOME` environment variables

### Permission Issues

1. Run FreeCAD as administrator (Windows) or with sudo (Linux) once
2. This ensures all configuration files are created with correct permissions
3. After the first run, run as a normal user

## Fix 8: Report Bugs Effectively

If you've tried all fixes and FreeCAD still crashes:

1. **Help → Report Bug** — generates a report with system info
2. Include the FreeCAD version info (copy from **Help → About**)
3. Attach the model file that causes the crash (or a simplified version)
4. Describe the exact steps to reproduce the crash
5. Check the FreeCAD GitHub issues to see if the bug is already reported
6. Post on the FreeCAD forum for community help before opening a GitHub issue

## Summary

| Fix | Type | Impact |
|-----|------|--------|
| Safe mode restart | Diagnostic | Identifies add-on vs core issue |
| Clear configuration | Recovery | Fixes corrupted preferences |
| Use AppImage (Linux) | Alternative | More stable than repo version |
| Update OCCT/Python | Preventive | Fixes kernel-related crashes |
| Remove conflicting add-ons | Preventive | Eliminates add-on conflicts |
| Simplify boolean operations | Preventive | Prevents modeling freezes |
| Fix rendering settings | Preventive | Prevents orbiting freezes |
| Fix startup crashes | Recovery | Fixes DLL/Python/permission issues |

Always start with safe mode — it takes 30 seconds and immediately tells you whether the problem is an add-on or a core issue. If it's an add-on, isolate it by re-enabling one at a time. If it's a core issue, try clearing the configuration and updating to the latest FreeCAD version with the AppImage (Linux) or official installer (Windows/Mac).
