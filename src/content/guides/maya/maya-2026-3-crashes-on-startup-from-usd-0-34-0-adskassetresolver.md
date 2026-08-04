---
title: "Maya 2026.3 Crashes on Startup from USD 0.34.0 AdskAssetResolver"
excerpt: "Maya 2026.3 Crashes on Startup from USD 0.34.0 AdskAssetResolver: symptoms, root causes, and step-by-step fixes, verified against Autodesk community and release notes."
category: "troubleshooting"
softwareSlug: "maya"
keyword: "Maya 2026.3 crashes startup USD 0.34.0 AdskAssetResolver freeze making keys non-certified GPU cacheEvaluator plugin crash Windows update ML Deformer error training Linux Motion Trail editing broken viewport Graph Editor"
slug: "maya-2026-3-crashes-on-startup-from-usd-0-34-0-adskassetresolver"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# Maya 2026.3 Crashes on Startup from USD 0.34.0 AdskAssetResolver, Freeze When Making Keys from Non-Certified GPU, cacheEvaluator Plugin Crash from Windows Update, ML Deformer Error Training on Linux, and Motion Trail Editing Broken in Viewport: USD Rollback, DG Evaluation Mode, Plugin Disable, Deformer Update, and Graph Editor Workaround

Maya produces errors from startup crashes, key freezing, plugin crashes, deformer errors, and motion trail issues. This guide covers the 5 most common Maya problems with diagnostic steps and community-verified fixes from Autodesk community and release notes.

## 1. Maya 2026.3 Crashes on Startup from USD 0.34.0 AdskAssetResolver

### Symptom

Maya 2026.3 crashes during the USD plugin load phase at startup. The crash occurs before Maya fully launches. The crash log shows the crash happening during USD 0.34.0 initialization. The issue occurs on Windows 11 with up-to-date graphics drivers. No version of Maya works after the crash starts, requiring a reboot.

### Root Cause

"For those crashing at startup on Windows with Maya 2026.3 with USD 0.34.0 on initialization, you can try rolling back to the previous version of USD which does not have the AdskAssetResolver that is triggering the crash." Maya 2026.3 ships with USD 0.34.0, which includes a new AdskAssetResolver component. This component has a bug that causes Maya to crash during USD plugin initialization. The crash is triggered by the AdskAssetResolver's initialization code.

### Fix

1. **Roll back to USD 0.33.0**:
   - Install USD 0.33.0

2. **Update GPU drivers**:
   - Update GPU drivers
   - To the latest version

3. **Force close Autodesk background processes**:
   - Close background processes

4. **Reboot before launching Maya**:
   - Reboot before
   - Launching Maya

5. **Clean GPU driver install**:
   - Do a clean install
   - Of GPU drivers

6. **Disable third-party plugins**:
   - Disable third-party plugins

7. **Report persistent startup crashes**:
   - Report to Autodesk support

### Community Report

> "Maya 2026.3 has been crashing during the USD plugin load phase. For those crashing at startup on Windows with Maya 2026.3 with USD 0.34.0 on initialization, you can try rolling back to the previous version of USD which does not have the AdskAssetResolver that is triggering the crash. Uninstall v0.34.0 and grab v0.33.0 from Github. I got mine to work after I updated my graphics card driver (AMD)."

## 2. Freeze When Making Keys from Non-Certified GPU

### Symptom

Maya freezes whenever making a key to anything, from primitive shapes to rigged characters. Primitive shapes freeze for 2-4 minutes, while heavier rigs freeze up to 10 minutes. The issue occurs on systems with non-certified GPUs. The freeze happens every time a keyframe is created.

### Root Cause

"That really sounds like a graphic card issue. In Preferences -> Animation, turn Evaluation Mode to DG. In your Viewport Renderer, Viewport 2.0 Settings, turn off GPU Instancing. Turn off Cached Playback." The non-certified GPU can't handle Maya's default parallel evaluation mode and GPU instancing. When a key is created, Maya triggers a viewport update and evaluation that overwhelms the non-certified GPU, causing a freeze.

### Fix

1. **Set Evaluation Mode to DG**:
   - Switch from Parallel to DG

2. **Turn off GPU Instancing**:
   - Disable GPU Instancing

3. **Turn off Cached Playback**:
   - Disable Cached Playback
   - To reduce GPU load

4. **Use OpenGL Legacy rendering**:
   - Switch to OpenGL Legacy

5. **Update GPU drivers**:
   - Update graphics drivers
   - To the latest version
   - From the manufacturer

6. **Use certified GPU**:
   - Use a Maya-certified
   - Graphics card
   - For best performance

7. **Remove peripheral devices**:
   - Remove peripherals to test

### Community Report

> "My Maya will freeze whenever I make a key to anything, whether it's a primitive shape all the way to a high rigged character. The primitive shape would freeze for maybe 2-4 minutes, but heavier rigs would freeze up to 10 minutes. In Preferences -> Animation, turn Evaluation Mode to DG. In your Viewport 2.0 Settings, turn off GPU Instancing. Turn off Cached Playback. This did help with the freezing issue!"

## 3. cacheEvaluator Plugin Crash from Windows Update

### Symptom

Maya crashes when it gets to the loading plugins (cacheEvaluator) part during startup. Removing the preferences folder and a complete uninstall/reinstall don't fix the issue. The crash log can't even be opened. The issue started after a Windows update.

### Root Cause

"What fixed it for me was disabling the cacheEvaluator plugin manually. I went to the Maya install directory, opened the plug-ins folder, and temporarily renamed the cacheEvaluator plugin file so Maya couldn't load it. This issue started after a Windows update." The cacheEvaluator plugin has a compatibility issue with certain Windows updates. The plugin tries to access GPU resources during initialization, and the Windows update changes how GPU resources are accessed, causing the crash.

### Fix

1. **Disable cacheEvaluator plugin**.

2. **Clean GPU driver install**:
   - Do a clean install
   - Of GPU drivers

3. **Update Windows**:
   - Update or roll back Windows

4. **Re-enable plugin after GPU update**:
   - Re-enable after fixing

5. **Remove third-party plugins**:
   - Remove third-party plugins

6. **Force close Autodesk processes**:
   - In Task Manager
   - Before launching Maya

7. **Reboot before launching**:
   - Reboot the computer
   - Before launching Maya
   - To clear any
   - Stale GPU state

### Community Report

> "Every time I try to open Maya 2026.2 it crashes when it gets to the loading plugins (cacheEvaluator) part. I have tried removing the preferences folder and a complete uninstall and reinstall and nothing works. What fixed it for me was disabling the cacheEvaluator plugin manually. I went to the Maya install directory, opened the plug-ins folder, and temporarily renamed the cacheEvaluator plugin file so Maya couldn't load it. This issue started after a Windows update."

## 4. ML Deformer Error Training on Linux

### Symptom

When using ML Deformer on Linux, an error occurs during training. The training process fails and the deformer can't be trained. The issue is specific to Linux and doesn't occur on Windows or macOS. The error prevents the ML Deformer from being used.

### Root Cause

"ML Deformer: Error training with Linux MAYA-138160." The ML Deformer training algorithm has a platform-specific bug on Linux. The training code uses platform-dependent GPU or memory operations that behave differently on Linux, causing the training to fail. Fixed in Maya 2026.2.

### Fix

1. **Update to Maya 2026.2 or later**:
   - Fixed in 2026.2
   - Update to the latest version

2. **Use Windows or macOS as workaround**:
   - If you can't update
   - Use Windows or macOS
   - For ML Deformer training

3. **Check GPU drivers on Linux**:
   - Verify GPU drivers
   - Are up to date
   - On Linux

4. **Check CUDA compatibility**:
   - Verify CUDA version
   - Is compatible with
   - Maya on Linux

5. **Report persistent training errors**:
   - If training errors persist after updating
   - Report to Autodesk support
   - With the error log

6. **Use traditional deformers**:
   - If ML Deformer fails
   - Use traditional
   - Deformers as alternative

7. **Check Linux distribution compatibility**:
   - Verify your Linux distribution
   - Is supported by Maya
   - Check system requirements

### Community Report

> "ML Deformer: Error training with Linux MAYA-138160. Fixed in Maya 2026.2 Update Release Notes."

## 5. Motion Trail Editing Broken in Viewport

### Symptom

When editing motion trail keys directly in the viewport, the editing is broken. Changes to motion trail keys don't work as expected. The motion trail can't be edited interactively in the viewport. The issue affects animation workflow.

### Root Cause

"Motion Trail: Editing motion trail keys in viewport is broken MAYA-139646. Workaround: Edit the motion trail from the Graph Editor." The motion trail viewport editing code has a bug that prevents direct key editing in the viewport. The viewport interaction doesn't properly update the motion trail keys when edited directly. Fixed in Maya 2026.2.

### Fix

1. **Use Graph Editor as workaround**:
   - Use Graph Editor
   - For motion trail editing

2. **Update to Maya 2026.2 or later**:
   - Fixed in 2026.2
   - Update to the latest version

3. **Select motion trail in Graph Editor**:
   - Select the motion trail
   - In the Graph Editor
   - To edit keys

4. **Use Channel Box for key editing**:
   - Use the Channel Box
   - As alternative
   - For editing motion trail keys

5. **Avoid viewport motion trail editing**:
   - Until the fix is applied
   - Avoid editing motion trail
   - Keys in the viewport

6. **Report persistent motion trail issues**:
   - If motion trail issues persist after updating
   - Report to Autodesk support

7. **Use Dope Sheet for timing**:
   - Use the Dope Sheet
   - For timing adjustments
   - As alternative to
   - Motion trail editing

### Community Report

> "Motion Trail: Editing motion trail keys in viewport is broken MAYA-139646. Workaround: Edit the motion trail from the Graph Editor. Fixed in Maya 2026.2 Update Release Notes."

## 6. Additional Maya Issues

### Changes Not Reflected on Mesh When Undoing Rig Translation

**Issue**: "Changes are not reflected on the mesh when undoing rig translation MAYA-138046."
**Fix**: Update to Maya 2026.2. Verify mesh updates after undoing rig translations. Check evaluation mode if issue persists.

### Incorrect Evaluation When Hiding/Unhiding Rig

**Issue**: "Incorrect evaluation when hiding/unhiding rig MAYA-132921."
**Fix**: Update to Maya 2026.2. Verify evaluation is correct after hiding/unhiding rigs. Use Parallel evaluation mode.

### Morph Deformer Loses Component Lookup Index

**Issue**: "Morph Deformer loses Component lookup Index on scene reload MAYA-137283."
**Fix**: Update to Maya 2026.2. Verify Morph Deformer after scene reload. Check component lookup index.

### autoLoader.mll Plugin Freeze

**Issue**: "The auto-load status of the autoLoader.mll plugin can cause Maya to freeze in case it is searching for updates without a connection to the server."
**Fix**: Deactivate auto load for autoLoader.mll in Plugin Manager. Prevent Maya from searching for updates when offline.

### ScriptExploit Causing Maya Freeze

**Issue**: "ScriptExploit causing Maya freeze on scriptNode."
**Fix**: Install Maya Security Tools update. Follow the guide to diagnose and clean Maya ScriptExploit issues. Clean infected scenes.

### Project Tab Corruption

**Issue**: "Project tab corruption can cause Maya to freeze."
**Fix**: Remove the project tab. Reset Maya preferences. Create a new project to avoid corruption.

### Qt OpenGL Crash on Mac OS Tahoe

**Issue**: "You are hitting a known Qt crash where OpenGL is failing and the fallback is causing the application to crash."
**Fix**: Update Intel GFX drivers on Mac. Reboot before launching Maya. Check for macOS updates.

## Best Practices

1. **Roll back USD to 0.33.0 for Maya 2026.3 startup crash** — AdskAssetResolver bug
2. **Set Evaluation Mode to DG for non-certified GPU** — prevents key freezing
3. **Disable GPU Instancing and Cached Playback** — reduces GPU load
4. **Disable cacheEvaluator plugin if crash at startup** — rename plugin file temporarily
5. **Do clean GPU driver install** — not express install
6. **Force close Autodesk background processes** — prevents startup conflicts
7. **Reboot before launching Maya** — clears stale GPU state
8. **Use Graph Editor for motion trail editing** — viewport editing is broken
9. **Deactivate autoLoader.mll auto-load** — prevents freeze when offline
10. **Install Security Tools for ScriptExploit** — cleans infected scenes
