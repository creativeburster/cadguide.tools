---
title: "SketchUp 2025 Crashes on Startup: Graphics Engine Switch and Extension Isolation"
excerpt: "SketchUp 2025 crashes before BugSplat even appears, or crashes repeatedly on startup with no clear cause. I cover the classic graphics engine switch, login_session.dat deletion, and extension isolation that actually fix this."
category: "troubleshooting"
softwareSlug: "sketchup"
keyword: "SketchUp 2025 crashes startup graphics engine classic"
slug: "sketchup-2025-crashes-startup-graphics-engine"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-21"
sources:
  - "https://forums.sketchup.com/t/2025-crashes-without-bugsplat/317731"
  - "https://forums.sketchup.com/t/sketchup-2025-pc-desktop-won-t-open-files-crashes-at-welcome-screen/340197"
  - "https://forums.sketchup.com/t/anyone-else-find-pro-2025-to-be-unstable/326002"
---

# SketchUp 2025 Crashes on Startup: Graphics Engine Switch and Extension Isolation

A user on the SketchUp Community forum reported that SketchUp 2025 Pro crashed before any BugSplat appeared, even after updating the driver for their GeForce RTX 4090. Another user said SketchUp 2025 on Windows 11 would open to the welcome screen but crash completely as soon as they clicked to open any file — even one they had been working on just two hours earlier. A third user on macOS 15.4.1 reported that extensions caused crashes at startup, sometimes requiring 3-4 restart attempts before SketchUp finally opened. These are the three most common crash patterns I've seen with SketchUp 2025, and they have different root causes and different fixes.

## Crash Pattern 1: Silent Crash Before BugSplat

The user with the RTX 4090 described the most frustrating scenario: SketchUp crashes silently — no BugSplat dialog, no error message, no crash report. The application just disappears. This started after upgrading from SketchUp 2024, which had a similar but less frequent issue that was partially fixed by switching to the "old engine."

### Root Cause: New Graphics Engine Incompatibility

SketchUp 2025 introduced a new graphics engine that uses the GPU more aggressively. On some NVIDIA driver versions (particularly production driver 572.83), the new engine crashes during initialization — before BugSplat can even load. The crash happens at the graphics context creation stage, which is earlier in the startup sequence than the extension loading stage.

### Fix 1: Switch to Classic Graphics Engine

If you can't open SketchUp at all, you need to manually edit the preferences file:

1. Close SketchUp completely
2. Open File Explorer and enable **View → Hidden Items**
3. Navigate to: `%AppData%\SketchUp\SketchUp 2025\`
4. Open `PrivatePreferences.json` in a text editor
5. Search for `"useNewGraphicsEngine"` and change its value from `true` to `false`
6. Save the file and restart SketchUp

If you can open SketchUp but it crashes shortly after:

1. Go to **Preferences → Graphics**
2. Change **Graphics Engine** from **New** to **Classic**
3. Restart SketchUp

The forum response from SketchUp staff confirmed: "The issue seems to happen if you are using the new graphics engine. Setting SketchUp to use the classic graphics engine would at least let you work."

### Fix 2: Update to the Latest NVIDIA Studio Driver

The SketchUp staff member noted: "I set my PC laptop to be Studio and 576.02, in the hope of seeing the problem, but I still don't. I did get a variation of the problem with Production and 572.83."

1. Open **NVIDIA Control Panel → Help → System Information**
2. Note your current driver version and type (Production vs Studio)
3. Download **NVIDIA Studio Driver 576.02 or later** from the NVIDIA website
4. Use DDU (Display Driver Uninstaller) to cleanly remove the current driver
5. Install the Studio Driver
6. Restart and test SketchUp

Studio drivers are more stable for creative applications than production/game-ready drivers. If you're using a GeForce card (not Quadro), always use Studio drivers with SketchUp.

### Fix 3: Dual GPU Systems (NVIDIA + AMD)

The SketchUp staff member asked: "I see you have an AMD GPU as well as Nvidia. Do you get any more success if you set SketchUp to use the AMD instead of the Nvidia GPU?"

1. Open **NVIDIA Control Panel → Manage 3D Settings → Program Settings**
2. Add `SketchUp.exe` (typically at `C:\Program Files\SketchUp\SketchUp 2025\SketchUp.exe`)
3. Set **Preferred graphics processor** to your AMD GPU
4. Alternatively, set it to **Auto-select** and test

Dual GPU laptops (NVIDIA discrete + AMD integrated) can cause graphics engine conflicts. Forcing SketchUp to use one GPU consistently often resolves the crash.

## Crash Pattern 2: Crash When Opening Any File

The Windows 11 user could open SketchUp to the welcome screen, but clicking any file — recent or new — caused the application to close completely. No error message, no BugSplat.

### Root Cause: Corrupted login_session.dat

A SketchUp forum expert identified the cause: a corrupted login session file. When SketchUp tries to validate your Trimble ID at startup, the corrupted file causes a crash.

### Fix 1: Delete login_session.dat

1. Close SketchUp
2. Open File Explorer and enable **View → Hidden Items**
3. Navigate to: `%AppData%\Roaming\SketchUp\SketchUp 2025\`
4. Delete `login_session.dat`
5. Do a cold reboot of your computer
6. Start SketchUp — you'll need to sign in again

### Fix 2: Hold Shift to Bypass Auto-Recovery

If SketchUp is trying to recover a corrupted auto-save file on startup:

1. Hold down **Shift** while starting SketchUp
2. This opens a blank document and bypasses the auto-recovery
3. If SketchUp opens successfully, the auto-save file was the problem
4. Go to **Preferences → General** and note the auto-save location
5. Delete the corrupted auto-save file

### Fix 3: Check for Integrated Graphics

The forum expert noted: "SketchUp 2025 doesn't run very well with integrated graphics such as what you list in your profile." If your system has only Intel integrated graphics:

1. Switch to **Classic Graphics Engine** (see Fix 1 above)
2. Lower display quality in **Preferences → Graphics**
3. Consider upgrading to a discrete GPU — SketchUp 2025's new engine requires dedicated graphics

## Crash Pattern 3: Extension-Caused Startup Crashes

The macOS user reported that extensions caused crashes at startup, sometimes requiring 3-4 restarts before SketchUp would open. On the first crash, SketchUp offers to skip extension loading. Sometimes skipping works, sometimes it doesn't.

### Fix 1: Disable All Extensions, Re-enable One at a Time

1. Start SketchUp while holding **Shift** (Windows) or **Option** (Mac) to skip extension loading
2. If SketchUp opens, go to **Extensions → Extension Manager**
3. Disable all extensions
4. Restart SketchUp normally (without holding Shift)
5. If SketchUp opens successfully, extensions are the cause
6. Re-enable extensions one at a time, restarting after each
7. When SketchUp crashes after enabling a specific extension, that's the culprit

### Fix 2: Check for Extension Migration Issues

When upgrading from 2024 to 2025, SketchUp offers to migrate extensions. This can cause problems if extensions aren't compatible with the new version:

1. Don't migrate extensions during the 2025 installation
2. Install extensions fresh from the Extension Warehouse
3. Check each extension's compatibility page for SketchUp 2025 support
4. If you already migrated and have crashes:
   - Go to `%AppData%\SketchUp\SketchUp 2025\Plugins\` (Windows)
   - Or `~/Library/Application Support/SketchUp 2025/Plugins/` (Mac)
   - Move all extension files to a temporary folder
   - Restart SketchUp and reinstall extensions one by one

### Fix 3: The "NoMethodError" Extension Issue

A user reported that after upgrading to 2024 (and the same applies to 2025), extensions like Shape Loader, Artisan, ClothWorks, and FlexTools gave "NoMethodError" messages. This happens when extensions use Ruby API methods that have been deprecated or changed in the new version.

1. Check the extension developer's website for an updated version
2. If no update is available, contact the developer directly
3. Some extensions may never be updated — find alternatives
4. Don't force-load incompatible extensions — they can corrupt your model

## Crash Pattern 4: V-Ray Related Crashes

A user with an RTX 5070 Ti reported that SketchUp 2025 crashed frequently during or after V-Ray GPU rendering, especially when denoising kicked in. Crashes also occurred during simple modeling tasks and even during idle.

### Fix 1: Update V-Ray to the Latest Version

1. Open the V-Ray installer and check for updates
2. V-Ray 6.2 or later is required for SketchUp 2025 compatibility
3. After updating, restart SketchUp
4. If crashes persist, try V-Ray CPU rendering instead of GPU rendering

### Fix 2: Disable V-Ray Denoising

1. In the V-Ray Asset Editor, go to **Render Elements**
2. Disable **Denoiser**
3. The denoiser uses GPU memory aggressively and can cause crashes on cards with less than 8GB VRAM
4. Use the NVIDIA AI Denoiser in post-processing instead

## General Stability Tips for SketchUp 2025

1. **Keep SketchUp updated**: Check for updates via **Help → Check for Update** (Windows) or **SketchUp → Check Web for Update** (Mac)
2. **Use Studio drivers on NVIDIA**: Studio drivers are tested with creative applications; game-ready drivers are not
3. **Purge unused entities**: Go to **Window → Model Info → Statistics → Purge Unused** to reduce model bloat
4. **Limit 3D Warehouse imports**: Download components to a separate file first, clean them up, then copy into your main model
5. **Use tags to hide geometry**: Hidden geometry still consumes resources — use tags to control visibility and reduce rendering load

## Summary

| Crash Pattern | Root Cause | Fix |
|--------------|-----------|-----|
| Silent crash before BugSplat | New graphics engine + NVIDIA driver | Switch to classic engine, update to Studio driver 576.02+ |
| Crash when opening any file | Corrupted login_session.dat | Delete login_session.dat, cold reboot |
| Extension startup crashes | Incompatible extensions | Disable all, re-enable one at a time |
| V-Ray rendering crashes | GPU memory exhaustion | Update V-Ray, disable denoising, use CPU rendering |

If SketchUp 2025 is unusable after all fixes, SketchUp 2023 remains stable on the same systems. Several forum users reported reverting to 2023 until SketchUp releases a stability update for 2025.
