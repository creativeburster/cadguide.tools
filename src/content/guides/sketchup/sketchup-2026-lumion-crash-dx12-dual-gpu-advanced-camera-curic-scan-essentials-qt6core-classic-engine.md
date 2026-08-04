---
title: "SketchUp 2026 Crash on Startup from Lumion Plugin Loading, DX12 New Graphics Engine Crash on Dual GPU AMD+NVIDIA Laptops, Advanced Camera Tools and Curic Extension Crash During Initialization, Scan Essentials Crash on Startup with Point Cloud Projects, and 2026.1.256 Qt6Core.dll Instant Crash on New Graphics Engine: Lumion Plugin Removal, UseNewRenderer False, Extension Migrator Bypass, Scan Essentials Uninstall, and Classic Graphics Engine"
excerpt: "SketchUp fails for 5 distinct reasons: crash on startup from Lumion plugin loading requiring Lumion plugin removal, DX12 new graphics engine crash on dual GPU AMD+NVIDIA laptops requiring UseNewRenderer false, Advanced Camera Tools and Curic extension crash during initialization requiring extension migrator bypass, Scan Essentials crash on startup with point cloud projects requiring Scan Essentials uninstall, and 2026.1.256 Qt6Core.dll instant crash on new graphics engine requiring classic graphics engine. We cover each with fixes from SketchUp community."
category: "startup-and-graphics-errors"
softwareSlug: "sketchup"
keyword: "SketchUp 2026 crash startup Lumion plugin loading DX12 new graphics engine dual GPU AMD NVIDIA laptop UseNewRenderer false Advanced Camera Tools Curic extension crash initialization Scan Essentials crash point cloud Qt6Core.dll instant crash classic graphics engine"
slug: "sketchup-2026-lumion-crash-dx12-dual-gpu-advanced-camera-curic-scan-essentials-qt6core-classic-engine"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://forums.sketchup.com/t/crash-when-opening-sketchup-2026/346259"
  - "https://forums.sketchup.com/t/bug-crash-on-startup-dx12-engine-usenewrenderer-on-dual-gpu-system-amd-nvidia/348478"
  - "https://forums.sketchup.com/t/sketchup-2026-crashes-while-opening/344282"
---

# SketchUp 2026 Crash on Startup from Lumion Plugin Loading, DX12 New Graphics Engine Crash on Dual GPU AMD+NVIDIA Laptops, Advanced Camera Tools and Curic Extension Crash During Initialization, Scan Essentials Crash on Startup with Point Cloud Projects, and 2026.1.256 Qt6Core.dll Instant Crash on New Graphics Engine: Lumion Plugin Removal, UseNewRenderer False, Extension Migrator Bypass, Scan Essentials Uninstall, and Classic Graphics Engine

SketchUp produces errors from Lumion plugin crashes, DX12 engine, extension initialization, Scan Essentials, and Qt6Core. This guide covers the 5 most common SketchUp problems with diagnostic steps and community-verified fixes from SketchUp community.

## 1. Crash on Startup from Lumion Plugin Loading

### Symptom

SketchUp 2026 crashes with a Bug Splat every time it opens. The crash happens during startup. The user has Lumion installed. Uninstalling and reinstalling SketchUp doesn't fix the issue. The crash occurs after selecting a template or opening a file.

### Root Cause

"That has been the cause of crashes on startup for numerous users. Remove Lumion and see what you get. The crash happened while Lumion was loading. A number of people have seen that, and I have reason to believe Lumion are working on the problem." The Lumion plugin for SketchUp 2026 has a compatibility issue. When SketchUp loads the Lumion plugin during startup, the plugin initialization causes SketchUp to crash. The Lumion plugin is loaded from the Plugins folder.

### Fix

1. **Remove Lumion plugin from Plugins folder**:
   - "Go into this folder to remove the Lumion file and folder"
   - "%AppData%\SketchUp\SketchUp 2026\SketchUp\Plugins\"
   - Remove Lumion
   - Plugin files

2. **Move Lumion folder and .rb file**:
   - "Try moving the Lumion folder"
   - "And .rb file to somewhere else"
   - "And then open SketchUp"
   - Move not delete

3. **Install SketchUp as Administrator**:
   - "Right clicking on the downloaded installer"
   - "And selecting Run as administrator"
   - "From the Context menu"
   - Install as Admin

4. **Repair installation**:
   - "Repair the installation by finding the installer"
   - "Right clicking on it, choosing Run as administrator"
   - "And then when prompted, Repair"
   - Repair installation

5. **Do a cold reboot**:
   - "After that do a cold reboot"
   - "Of your computer"
   - Cold reboot
   - After repair

6. **Check for Lumion update**:
   - "Maybe you'll get away with reloading Lumion"
   - "But I wouldn't count on it"
   - "Unless there's a new release of Lumion"
   - Check for update

7. **Use alternative rendering application**:
   - "Might be worth looking at"
   - "A different rendering application"
   - Consider alternative
   - Rendering tool

### Community Report

> "A bug splat crash keeps happening every time I open SketchUp 2026. Do you have Lumion installed? That has been the cause of crashes on startup for numerous users. Remove Lumion and see what you get. The crash happened while Lumion was loading. Go into this folder to remove the Lumion file and folder: %AppData%\SketchUp\SketchUp 2026\SketchUp\Plugins\"

## 2. DX12 New Graphics Engine Crash on Dual GPU AMD+NVIDIA Laptops

### Symptom

SketchUp 2026 opens and immediately closes upon startup. The Welcome Window appears, but SketchUp crashes to the desktop upon clicking any template. Toolbar configurations and positions are not saved between sessions. The crash occurs on laptops with AMD Radeon integrated GPU + NVIDIA RTX dedicated GPU.

### Root Cause

"The new DX12 rendering engine (UseNewRenderer) in SketchUp 2026 is unstable on laptops with a dual GPU setup (AMD iGPU + NVIDIA dGPU). When attempting to initialize the 3D viewport after loading plugins, the engine crashes without leaving an error message in the log. The crash occurred after all plugins finished loading, at the exact moment SketchUp attempted to initialize the 3D main window." The DX12 rendering engine can't properly handle the dual GPU switching on laptops with AMD integrated and NVIDIA dedicated graphics. The engine crashes during 3D viewport initialization.

### Fix

1. **Set UseNewRenderer to false**:
   - "Edit the file: PrivatePreferences.json"
   - "UseNewRenderer: false"
   - "This forces SketchUp to use the classic OpenGL engine"
   - Set to false

2. **Access PrivatePreferences.json**:
   - "C:\Users\[user]\AppData\Local\"
   - "SketchUp\SketchUp 2026\SketchUp\PrivatePreferences.json"
   - Edit the file

3. **Disable su_diffusion from ShippedExtensions**:
   - "Rename su_diffusion.rb to su_diffusion.rb.DISABLED"
   - "Rename su_diffusion to su_diffusion.DISABLED"
   - "In ShippedExtensions folder"
   - Disable su_diffusion

4. **Use classic OpenGL engine**:
   - "Which is completely stable"
   - "With this device's dual GPU configuration"
   - Use classic
   - OpenGL engine

5. **Verify PrivatePreferences after updates**:
   - "If SketchUp 2026 crashes again"
   - "After an update"
   - "Verify that PrivatePreferences.json"
   - "Has UseNewRenderer: false"
   - Verify after updates

6. **Reinstall AI Render from Extension Warehouse**:
   - "To reinstall AI Render"
   - "Do a clean install"
   - "From the Extension Warehouse"
   - Reinstall AI Render

7. **Check for cascading plugin pattern**:
   - "This cascading pattern was the key"
   - "To understanding that the plugins"
   - "Were not the actual cause"
   - Check cascading

### Community Report

> "SketchUp would open and immediately close upon startup. The Welcome Window would appear, but SketchUp would crash to the desktop upon clicking any template. The new DX12 rendering engine (UseNewRenderer) in SketchUp 2026 is unstable on laptops with a dual GPU setup (AMD iGPU + NVIDIA dGPU). The critical setting was found in PrivatePreferences.json: UseNewRenderer: true. Setting it to false forces SketchUp to use the classic OpenGL engine, which is completely stable."

## 3. Advanced Camera Tools and Curic Extension Crash During Initialization

### Symptom

SketchUp 2026 crashes while opening. The user must open 2025 first, then open the same file with 2026 as read-only. The crash happens while Advanced Camera Tools or Curic extensions are loading. The user has at least 90 extensions, four or more for rendering. Disabling one plugin leads to the next one crashing.

### Root Cause

"All of your crashes happened while Advanced Camera Tools was loading. You have at least 90 extensions, four or more of which are for rendering. Some of the extensions may be initializing something outside of SketchUp. Curic 2D was causing many of my crashes and I have since disabled that extension. Other Curic extensions were causing crashing during initialisation." Certain extensions crash during initialization in SketchUp 2026. The extension migrator may bring incompatible extensions from 2025. The cascading crash pattern (each disabled plugin leads to the next crashing) indicates a deeper initialization issue.

### Fix

1. **Disable Advanced Camera Tools**:
   - "All of your crashes happened"
   - "While Advanced Camera Tools was loading"
   - Disable Advanced
   - Camera Tools

2. **Disable Curic extensions**:
   - "Curic 2D was causing many of my crashes"
   - "Other Curic extensions were causing"
   - "Crashing during initialisation"
   - Disable Curic

3. **Don't use extension migrator**:
   - "Start again with getting your extensions"
   - "Into 2026, without using the extension migrator"
   - Manual extension
   - Installation

4. **Rename Plugins folder for testing**:
   - "Try renaming the Plugins folder"
   - "So that SketchUp starts up"
   - "With only the shipped extensions"
   - Rename Plugins

5. **Move extensions a few at a time**:
   - "Move a few extensions at a time"
   - "Into the newly created Plugins folder"
   - "If it suddenly doesn't open again"
   - "One of the last few extensions is the cause"
   - Batch test

6. **Check for new tools added to toolbar**:
   - "New tools are added to my custom toolbar"
   - "If I disable the plugin of the added tool"
   - "I can open SketchUp next time"
   - Check toolbar

7. **Disable automatic updates**:
   - "I have disabled automatic updates"
   - Disable auto
   - Updates to
   - Prevent issues

### Community Report

> "All of your crashes happened while Advanced Camera Tools was loading. You have at least 90 extensions. Disabling Advanced Camera Tools didn't help. Curic 2D was causing many of my crashes and I have since disabled that extension. Other Curic extensions were causing crashing during initialisation. Start again with getting your extensions into 2026, without using the extension migrator. Try renaming the Plugins folder, so that SketchUp starts up with only the shipped extensions."

## 4. Scan Essentials Crash on Startup with Point Cloud Projects

### Symptom

SketchUp 2026 crashes on startup. All crashes happen while Scan Essentials is loading. The user has a clean OS install with only SketchUp, web browser, and 3DConnexion software. The crash occurs even with blank new projects, not just point cloud-linked projects.

### Root Cause

"All of those crashes were while Scan Essentials was loading. The version you are using is more recent than the latest one in extension warehouse, and later than the one that comes with 2026.2." The Scan Essentials extension version is incompatible with SketchUp 2026.2. An outdated or mismatched version of Scan Essentials causes SketchUp to crash during extension initialization, even for blank projects.

### Fix

1. **Delete su_pcp.rb and su_pcp folder**:
   - "Go into this folder: %AppData%\SketchUp\SketchUp 2026\SketchUp\Plugins\"
   - "Delete su_pcp.rb and the su_pcp folder"
   - Delete Scan
   - Essentials files

2. **Uncheck Scan Essentials in installer**:
   - "Run the installer again"
   - "And choose the option to modify add ons"
   - "Uncheck Scan Essentials"
   - Uncheck in installer

3. **Delete files after installer modification**:
   - "You may need to go and delete"
   - "The file and folder I had mentioned"
   - Delete after
   - Modification

4. **Restart SketchUp after removal**:
   - "Then open SketchUp"
   - "And it should be free of Scan Essentials"
   - Restart after
   - Removal

5. **Check for other extension crashes**:
   - "That did change things"
   - "The crash now happens when"
   - "Sandbox Tools is loading"
   - Check next crash

6. **Rename Plugins folder for clean start**:
   - "Rename the Plugins folder"
   - "So that SketchUp starts up"
   - "With only the shipped extensions"
   - Rename Plugins

7. **Move extensions back gradually**:
   - "Move a few extensions at a time"
   - "Into the newly created Plugins folder"
   - Move gradually
   - To identify cause

### Community Report

> "All of those crashes were while Scan Essentials was loading. The version you are using is more recent than the latest one in extension warehouse. Go into %AppData%\SketchUp\SketchUp 2026\SketchUp\Plugins\ and delete su_pcp.rb and the su_pcp folder. Run the installer again, and choose the option to modify add ons. Uncheck Scan Essentials. That did change things. The crash now happens when Sandbox Tools is loading."

## 5. 2026.1.256 Qt6Core.dll Instant Crash on New Graphics Engine

### Symptom

SketchUp 2026.0.429 works perfectly on the new graphics engine. Updating to 2026.1.256 causes instant crash on Qt6Core.dll when creating or opening any file. The crash occurs on laptops with NVIDIA RTX 4060 and hybrid GPU setup. The crash is instant upon file creation or opening.

### Root Cause

SketchUp 2026.1.256 introduced a Qt6 update that is incompatible with certain GPU configurations. The Qt6Core.dll crash occurs when the new graphics engine tries to initialize with hybrid GPU setups. The 2026.0.429 version didn't have this Qt6 incompatibility.

### Fix

1. **Switch to classic graphics engine**:
   - "Sketchup 2026.1.256"
   - "Classic graphics engine - works perfectly"
   - Switch to classic
   - Graphics engine

2. **Set UseNewRenderer to false**:
   - Edit PrivatePreferences.json
   - Set UseNewRenderer
   - To false
   - For classic engine

3. **Roll back to 2026.0.429**:
   - "SketchUp 2026.0.429"
   - "Works perfectly on new graphics engine"
   - Roll back
   - To 2026.0.429

4. **Update NVIDIA drivers**:
   - "NVIDIA RTX 4060"
   - "(Driver 596.36)"
   - Update GPU
   - Drivers

5. **Check hybrid GPU settings**:
   - "Hybrid GPU setup"
   - Check hybrid
   - GPU configuration
   - Settings

6. **Report Qt6Core.dll crash**:
   - Report crash
   - With Bug Splat
   - Number and
   - System info

7. **Wait for 2026.2 fix**:
   - Check for 2026.2
   - Update that fixes
   - Qt6Core.dll
   - Crash issue

### Community Report

> "SketchUp 2026.0.429 works perfectly on new graphics engine. Updating to 2026.1.256 causes instant crash on Qt6Core.dll when creating or opening any file. Machine: Laptop Avell, NVIDIA RTX 4060 (Driver 596.36), Hybrid GPU setup. Sketchup 2026.1.256 - Classic graphics engine - works perfectly."

## 6. Additional SketchUp Issues

### MS Visual C++ Redistributable Conflict

**Issue**: "Some recent MS Visual C++ Redistributable files could be suspect, specifically the 2015-2022 (x64) and (x86) versions. Install date of 04-18-2026."
**Fix**: Uninstall and reinstall MS Visual C++ Redistributables. Run as admin. Check install dates for recent updates.

### Windows Update Causing Crash

**Issue**: "On Saturday 4/18 AM, my machine was off, so apparently MS did some overnight updates."
**Fix**: Check Windows Update history. Uninstall recent updates if causing crashes. Disable automatic updates temporarily.

### Extension Migrator Issues

**Issue**: "Start again with getting your extensions into 2026, without using the extension migrator."
**Fix**: Don't use extension migrator. Install extensions manually from Extension Warehouse. Verify each extension works in 2026.

### Multiple Rendering Extensions

**Issue**: "You have at least 90 extensions, four or more of which are for rendering."
**Fix**: Reduce number of rendering extensions. Keep only one rendering extension. Disable unused rendering extensions.

### Open 2025 Before 2026 Workaround

**Issue**: "The only way I've found to open SketchUp 2026 is opening a file with 2025 then open the same file with 2026 as a read only file."
**Fix**: Use 2025-then-2026 workaround if needed. But better to fix the root cause. Disable problematic extensions.

### Mac vs Windows Difference

**Issue**: "On mac there's no problem, I've been working on my macbook the entire weekend and had no crashes."
**Fix**: Issue is Windows-specific. Check Windows-specific extensions. Consider using Mac if available.

### Toolbar Configuration Not Saved

**Issue**: "Toolbar configurations and positions were not saved between sessions."
**Fix**: Set UseNewRenderer to false. Check toolbar settings after each session. Report if toolbars still not saved.

### su_diffusion Corrupted Plugin

**Issue**: "Trimble's AI Render plugin (su_diffusion) was corrupted. Even if the user's copies are deleted, SketchUp continues to load the one from Program Files."
**Fix**: Disable both copies of su_diffusion. Rename in ShippedExtensions folder. Reinstall from Extension Warehouse if needed.

## Best Practices

1. **Remove Lumion plugin from Plugins folder** — primary cause of startup crashes
2. **Set UseNewRenderer to false on dual GPU laptops** — prevents DX12 engine crash
3. **Install SketchUp as Administrator** — ensures proper file permissions
4. **Don't use extension migrator for 2026** — install extensions manually
5. **Rename Plugins folder for clean start** — identifies problematic extensions
6. **Move extensions back a few at a time** — isolates crash-causing extensions
7. **Uncheck Scan Essentials in installer** — prevents Scan Essentials crash
8. **Use classic graphics engine if new engine crashes** — stable alternative
9. **Check MS Visual C++ Redistributable versions** — recent updates may cause crashes
10. **Send Bug Splat reports with details** — helps SketchUp team diagnose issues
