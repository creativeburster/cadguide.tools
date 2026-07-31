---
title: "Ultimaker Cura Slicing Engine Errors: CuraEngine.exe Crash in polyclipping.dll from Corrupt Profile, Slicing Hangup at 60% from Randomize Infill Starts Bug, Engine Cannot Connect to localhost 127.0.0.1 from AV/Firewall, Unnecessary Top/Bottom Layers from Single-Sided Surface Model, and TiledInfill Plugin Slicing Failure from Mesh Folds"
excerpt: "Ultimaker Cura fails for 5 distinct reasons: CuraEngine.exe crashes in polyclipping.dll from corrupt custom profile fixable by switching to default profile, slicing hangs at 60% from Randomize Infill Starts bug in 5.12.0, CuraEngine cannot connect to localhost from antivirus/firewall blocking, single-sided surface models get unnecessary top/bottom layers requiring Surface Mode, and TiledInfill plugin causes slicing failure from mesh folds. We cover each with fixes from Ultimaker community and GitHub issues."
category: "slicing-engine-errors"
softwareSlug: "ultimaker-cura"
keyword: "Ultimaker Cura CuraEngine polyclipping.dll crash corrupt profile Randomize Infill Starts hangup localhost antivirus firewall single-sided surface top bottom layers TiledInfill mesh folds"
slug: "ultimaker-cura-slicing-engine-errors-polyclipping-randomize-infill-localhost-antivirus-surface-mode-tiledinfill"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.ultimaker.com/topic/44597-unexpected-error-when-slicing/"
  - "https://github.com/Ultimaker/Cura/issues/21530"
  - "https://github.com/Ultimaker/Cura/issues/21603"
---

# Ultimaker Cura Slicing Engine Errors: CuraEngine.exe Crash in polyclipping.dll from Corrupt Profile, Slicing Hangup at 60% from Randomize Infill Starts Bug, Engine Cannot Connect to localhost 127.0.0.1 from AV/Firewall, Unnecessary Top/Bottom Layers from Single-Sided Surface Model, and TiledInfill Plugin Slicing Failure from Mesh Folds

Cura's slicing engine (CuraEngine) crashes, hangs, and fails on specific models and configurations. DLL crashes from corrupt profiles, slicing hangups from the Randomize Infill Starts bug, localhost connection failures from antivirus, and plugin compatibility issues are common. This guide covers the 5 most common slicing engine errors with diagnostic steps and community-verified fixes from the Ultimaker community and GitHub issues.

## 1. CuraEngine.exe Crash in polyclipping.dll from Corrupt Profile

### Error Message (Event Viewer)

```
Faulting application name: CuraEngine.exe, version: 1.0.0.0
Faulting module name: polyclipping.dll, version: 0.0.0.0
Exception code: 0xc0000005
Faulting application path: C:\Program Files\UltiMaker Cura 5.6.0\CuraEngine.exe
```

### Symptom

Cura crashes when attempting to slice any file. Reinstalling Cura (including clean reinstall of 5.6.0) doesn't fix the issue. The crash occurs in `polyclipping.dll`, not a graphics DLL.

### Root Cause

A corrupt or invalid custom slicing profile causes the polyclipping library to crash during the clipping operation. The profile contains settings that produce invalid geometry parameters for the polyclipping algorithm.

### Fix

1. **Switch to a default slicing profile**:
   - Select one of the default profiles like "Dynamic Quality - 0.16 mm"
   - Try slicing — if it works, the custom profile was the problem

2. **Start with a fresh profile**:
   - Create a new custom profile from a default
   - Adjust settings incrementally
   - Check after each change whether slicing still works

3. **Delete the corrupt profile**:
   - Navigate to Cura profile folder
   - Delete the problematic custom profile
   - Recreate from scratch

4. **Enable engine crash reporting** (Cura 5.7.0+):
   - Preferences → Privacy → Enable "Send engine crash reports"
   - This helps developers diagnose the crash

5. **Workaround: change any setting slightly**:
   - Sometimes changing almost any setting to something different, slicing, then changing it back fixes the crash
   - Or move the model slightly on the build plate and slice again

### Community Report

> "I also got this error, but I fixed it by selecting one of the default slicing profiles like 'Dynamic Quality - 0.16 mm'. So I probably created the error by selecting something odd in the Advanced profile settings."

> "It's almost certainly not a problem with any particular quality profile setting. Sometimes you can get a successful slice after changing a setting (almost any of them, really) to something different, slicing, then changing it back and slicing again."

## 2. Slicing Hangup at 60% from Randomize Infill Starts Bug

### Symptom

Slicing gets to about 60% then stops. No error message, it just sits there making no progress. This happens with any model, including objects previously sliced successfully. Occurs in Cura 5.12.0.

### Root Cause

This is a **confirmed bug** in Cura 5.12.0 related to the "Randomize Infill Starts" setting. When enabled, the slicing engine enters an infinite loop during infill generation.

### Fix

1. **Disable Randomize Infill Starts**:
   - Infill settings → uncheck "Randomize Infill Starts"
   - Try slicing — should complete in about 1 second

2. **Update to Cura 5.13 or later** — the bug has been addressed:
   - "This bug has been addressed and will be fixed in 5.13."

3. **Fall back to Cura 5.11** — if you need Randomize Infill Starts:
   - Install Cura 5.11 alongside 5.12
   - Use 5.11 until 5.13 is released

4. **Move the model on the build plate** — an old workaround:
   - Slightly move or reorient the model
   - Sometimes this bypasses the hang
   - Not a reliable fix but worth trying

### Community Report

> "All I did was import a simple model from Fusion360, set my temperatures and speed for PETG+CF and hit slice. The slicing process gets to about 60% then it just stops."

> "Firstly, make sure that Randomize Infill Starts is disabled. An issue seems to have cropped up in 5.12.0 with this setting and it can (and will) stop slicing like this."

> "That seems to be the culprit. I imported the same model from Fusion360 to Cura 5.12, disabled 'Randomize Infill Start' and it took about 1 second to slice."

## 3. Engine Cannot Connect to localhost from AV/Firewall

### Error Log

```
[Backend] [info] Connecting to 127.0.0.1:49676
[Backend] [error] Could not connect to the given address
[Backend] libc++abi: terminating
CuraEngineBackend: Backend exited abnormally with return code -6!
```

### Symptom

Slicing starts, progress bar doesn't fill, eventually an error message appears. The Cura frontend cannot connect to the CuraEngine backend on localhost.

### Root Cause

Antivirus or firewall software blocks the localhost communication between the Cura UI and CuraEngine. Cura uses localhost (127.0.0.1) for inter-process communication between the Python frontend and the C++ engine. AV/firewall software can block this connection.

### Fix

1. **Temporarily disable AV/firewall** — test if this resolves the issue:
   - Disable antivirus temporarily
   - Try slicing
   - If it works, the AV is the cause

2. **Whitelist Cura and CuraEngine**:
   - Add Cura.exe and CuraEngine.exe to antivirus exclusions
   - Add the Cura installation folder to firewall exceptions
   - Allow localhost communication for Cura

3. **Check for localhost conflicts**:
   - Another process may be occupying the same localhost port
   - Check for other applications using 127.0.0.1
   - Close conflicting applications

4. **Clean reinstall** — installing Cura on top of a previous installation can cause issues:
   - Uninstall Cura completely
   - Delete remaining files in the installation directory
   - Install fresh from the latest download

5. **Check OS-specific issues** — some macOS versions have stricter localhost security:
   - macOS 26 users report this issue
   - Check macOS firewall settings
   - Allow incoming connections for Cura

### Community Report

> "Looks like an AV/Firewall issue based on the logs. Cura uses localhost communication between UI and engine. The Cura front end cannot connect to the Engine on the machine, the connection to local host (127.0.0.1:49676)."

## 4. Unnecessary Top/Bottom Layers from Single-Sided Surface Model

### Symptom

Cura adds top and bottom layers inside the model where they shouldn't be. The model is a section of an airplane wing — mainly empty with structural parts inside. Setting top/bottom layers to 0 isn't an option because they're needed in other parts of the model.

### Root Cause

The model was designed with **single-sided surfaces** — surfaces with no thickness. Cura interprets some of this geometry as requiring top/bottom skin layers, adding solid layers where the model should be open.

### Fix

1. **Change Surface Mode**:
   - Search for "Surface Mode" in settings
   - Change from "Normal" to "Surface"
   - This tells Cura to treat the model as surfaces, not volumes
   - Cura will not add top/bottom layers to single-sided surfaces

2. **Increase Small Top/Bottom Width**:
   - Top/Bottom → Small Top/Bottom Width
   - Increase the value — surfaces below this width will be printed using walls instead of skin
   - This may not fully solve the issue for large single-sided areas

3. **Use the SmartAvionics fork of Cura** (based on UM Cura 4.x):
   - The SmartAvionics fork handles single-sided surfaces better
   - It's the go-to fork for models that need spiralize or surface mode

4. **Adjust layer height** — changing layer height can affect which layers get top/bottom:
   - Some "bottom" layers may be removed with different layer heights
   - Experiment with layer height to minimize unwanted skin

5. **Fix the model** — if possible, give the single-sided surfaces actual thickness in CAD:
   - This allows Cura to process the model in Normal mode
   - Eliminates the ambiguity that causes unwanted top/bottom layers

### Community Report

> "The model was designed with single-sided surfaces. They have no thickness and Cura is interpreting some of the geometry to require Tops/Bottoms."

> "I sliced this with the SmartAvionics fork of Cura. It's my go-to for things that look like they will need to be spiralized. This slice was not spiralized but rather was sliced with 'Surface Mode' set to 'Surface'."

## 5. TiledInfill Plugin Slicing Failure from Mesh Folds

### Symptom

Slicing fails when the TiledInfill plugin is installed. The model has "folds on surface" near the taper of a thread. The STL passes checks in Blender, MS 3D Builder, and online repair tools, but Cura's Mesh Tools finds issues.

### Root Cause

The model has mesh folds — a specific type of surface defect where the mesh surface folds back on itself. These folds are not detected by most mesh repair tools but cause Cura's slicing engine to fail, especially when the TiledInfill plugin processes the geometry.

### Fix

1. **Disable the TiledInfill plugin** — test if slicing works without it:
   - Marketplace → Installed Plugins → Disable TiledInfill
   - If slicing works, the plugin is triggering the failure

2. **Fix the mesh folds**:
   - The folds are near the taper of the thread
   - Remodel the thread in the source CAD tool (FreeCAD, Fusion 360)
   - Re-export with better meshing settings
   - Try different meshing methods (netgen, gmsh, mefisto)

3. **Use MS 3D Builder** — even though it doesn't show errors, try:
   - Open in MS 3D Builder
   - Use the repair function
   - Re-export

4. **Move the model on the build plate** — sometimes this bypasses the issue:
   - Move slightly in X or Y
   - Rotate the part
   - Try the banana slice tool to cut and reposition

5. **Try a different slicer** — if Cura can't slice it:
   - PrusaSlicer or OrcaSlicer may handle the model
   - Compare results to identify if it's a Cura-specific issue

6. **Report on Cura GitHub** — include the project file:
   - Create a project file (.3mf)
   - Upload to GitHub issue
   - Include screenshots of the mesh folds

### Community Report

> "FreeCAD's own Mesh Analyzer finds 'folds on surface' close to the taper of the thread, but no other mistakes. These folds happen irrespective of the meshing method used (FreeCAD native, netgen, gmsh, mefisto), and simply increase in number with higher resolution meshes."

> "Other methods of checking the model for errors (Blender, Grid:Space's mesh:tool) also found no issue with the mesh."

## 6. Additional Cura Issues

### Model Error Popup on Zoom

**Issue**: A model error popup appears when zooming in/out of the model.
**Fix**: The model has mesh issues — fix in the source CAD tool or use a mesh repair tool.

### Slicing Works on Windows but Not macOS/Linux

**Issue**: The same model slices fine on Windows but fails on macOS or Linux.
**Fix**: This may be a platform-specific Cura bug. Report on GitHub with system details.

### Custom Printer Definition Issues

**Issue**: Custom printer definitions don't load correctly in project files.
**Fix**: Use a standard printer profile, or manually configure the custom printer on the receiving machine.

### Large Model Performance

**Issue**: Large models (100MB+ STL) cause Cura to be slow or unresponsive.
**Fix**: Simplify the mesh in MeshLab before importing. Disable automatic preview loading.

## Best Practices

1. **Try a default profile first** — if CuraEngine crashes, switch to a default quality profile
2. **Disable Randomize Infill Starts in 5.12.0** — known bug causing 60% hangup
3. **Update to 5.13+** — many slicing bugs are fixed in newer versions
4. **Whitelist Cura in antivirus** — localhost communication is critical
5. **Clean reinstall if installing on top of previous version** — avoids stale files
6. **Use Surface Mode for single-sided models** — prevents unwanted top/bottom layers
7. **Try SmartAvionics fork for difficult models** — better handling of surface models
8. **Disable plugins to isolate slicing failures** — especially TiledInfill
9. **Fix mesh folds in source CAD** — most repair tools don't detect them
10. **Report slicing failures on GitHub** — include project files and system details
