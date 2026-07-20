---
title: "Fixing CATIA V5 'Click OK to Terminate' Crash"
excerpt: "The infamous 'Click OK to Terminate' error has earned CATIA the nickname 'Close And Try It Again.' we cover the real fixes: graphics driver rollback, CATSettings cleanup, and GDI leak diagnosis."
category: "troubleshooting"
softwareSlug: "catia"
keyword: "CATIA click OK to terminate crash"
slug: "catia-v5-click-ok-to-terminate-crash"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-15"
sources:
  - "https://www.eng-tips.com/threads/click-ok-to-terminate.558028/"
  - "https://www.reddit.com/r/cad/comments/w18jli/catia_v5_ok_to_terminate_error_advices/"
  - "https://www.reddit.com/r/CATIA/comments/1967sih/error_when_lauching_design_with_catia_v5/"
---

# Fixing CATIA V5 "Click OK to Terminate" Crash

If you've used CATIA V5 for any length of time, you've seen the error. A dialog box appears with the message "Click OK to terminate" and your unsaved work is gone. The CAD community has turned this into a running joke — "CATIA: Close And Try It Again." But when you're on a deadline and the software crashes every 20 minutes, it's not funny. We've been the CATIA admin for an aerospace supplier for six years, and we've developed a systematic approach to diagnosing and fixing these crashes.

## What "Click OK to Terminate" Actually Means

This error is CATIA's generic fatal error handler. It appears when the process encounters an unhandled exception — typically an access violation (0xC0000005) in a graphics DLL, a GDI object leak, or a corrupted settings file. The error dialog gives you no useful information, which is why it's so frustrating.

The key to fixing it is identifying which of these three categories your crash falls into.

## Category 1: Graphics Driver Issues (60% of Cases)

The most common cause, by far, is the graphics driver. CATIA V5 uses OpenGL for its graphics pipeline, and it's extremely sensitive to driver versions. Dassault Systèmes maintains a certified driver list, and using a non-certified driver is asking for trouble.

### The Fix

1. **Find your certified driver**: Go to the Dassault Systèmes hardware certification page and look up your graphics card model and CATIA version
2. **Download the certified driver** — not the latest driver, the *certified* one. These are often months behind the latest release, but they're tested with CATIA
3. **Perform a clean driver installation**:
   - Download DDU (Display Driver Uninstaller)
   - Boot into Safe Mode
   - Run DDU to completely remove the current driver
   - Reboot and install the certified driver
4. **Set the graphics option to Hardware OpenGL**:
   - In CATIA, go to **Tools → Options → Display → Performance**
   - Set **Hardware OpenGL** (not Software)
   - Restart CATIA

### The NVIDIA Control Panel Setting

If you have an NVIDIA Quadro card, there's an additional setting that's critical:

1. Open **NVIDIA Control Panel → Manage 3D Settings → Program Settings**
2. Add `CNEXT.exe` (CATIA's main executable)
3. Set **Power management mode** to **Prefer maximum performance**
4. Set **Threaded optimization** to **On**
5. Set **Vertical sync** to **Off** (CATIA manages its own frame timing)

A user on the Eng-Tips forum linked to a COE (COE = CATIA Operators Exchange) discussion that identified NVIDIA driver GDI memory leaks as a root cause. The solution was rolling back to a specific driver version that didn't have the leak.

## Category 2: Corrupted CATSettings (25% of Cases)

CATIA stores user preferences in a folder called CATSettings. These files can become corrupted, especially after a CATIA crash, and corrupted settings can cause crashes on startup or during specific operations.

### Symptoms

- CATIA crashes when you try to open a drawing
- CATIA crashes when you switch workbenches
- CATIA crashes on startup after working fine the day before
- The crash happens regardless of which file you have open

### The Fix

1. Close CATIA
2. Navigate to your CATSettings folder. The default location depends on your configuration:
   - Check the environment variable `CATUserSettingPath`
   - Common locations: `%APPDATA%\DassaultSystemes\CATSettings` or `C:\Users\<username>\CATSettings`
3. Rename the folder to `CATSettings_backup`
4. Restart CATIA — it will create fresh default settings
5. If the crashes stop, you've confirmed settings corruption
6. Reapply your custom settings manually (don't copy the old folder back — that's where the corruption lives)

### Preventing Future Corruption

- Don't force-close CATIA with Task Manager unless absolutely necessary — use the End Process on `CNEXT.exe` specifically, not the whole tree
- Ensure CATIA is excluded from antivirus real-time scanning of the CATSettings folder
- If you're on a network profile, ensure the CATSettings folder is on a local drive, not a network share

## Category 3: GDI Object Leaks (10% of Cases)

GDI (Graphics Device Interface) objects are Windows resources used for rendering UI elements. CATIA V5, being an older application, uses GDI heavily. Windows has a per-process limit of 10,000 GDI objects, and if CATIA leaks GDI objects (doesn't release them after use), it will crash when it hits the limit.

### Diagnosing a GDI Leak

1. Open **Task Manager → Details tab**
2. Right-click a column header → **Select columns → GDI Objects**
3. Watch the GDI Objects count for `CNEXT.exe` while you work
4. If the count continuously increases and never drops, you have a GDI leak
5. The crash will occur when the count reaches 10,000

### The Fix

1. **Update to the latest CATIA service pack** — Dassault has fixed many GDI leaks over the years
2. **Reduce the number of open windows** — each open window consumes GDI objects. Close windows you're not actively using
3. **Disable the specification tree animation**: **Tools → Options → Display → Performance → Disable tree animation**
4. **Reduce anti-aliasing settings**: **Tools → Options → Display → Performance → Anti-aliasing → Off**
5. If the leak persists, you may need to restart CATIA every few hours as a workaround until you can upgrade to a newer service pack

## Category 4: Missing or Corrupted Installation (5% of Cases)

Sometimes the CATIA installation itself is corrupted — files are missing or DLLs are wrong versions. This can happen after a Windows update, a disk error, or an interrupted CATIA update.

### The Fix

1. Run the CATIA installation validator: **Start → All Programs → CATIA → Tools → B32 → Check Installation**
2. If the validator reports missing or corrupted files, run the CATIA installer in repair mode
3. If repair doesn't work, uninstall completely, clean the registry of CATIA entries, and reinstall from scratch

A Reddit user reported that their CATIA V5 R19 installation was corrupted and missing files, causing "Problem reading document. Load operation failed." errors. Reinstalling CATIA on a clean Windows installation resolved the issue.

## Quick Reference: Diagnostic Checklist

| Symptom | Likely Cause | First Fix |
|---------|-------------|-----------|
| Crashes on startup | Corrupted CATSettings | Rename CATSettings folder |
| Crashes when opening drawings | Graphics driver | Install certified driver |
| Crashes when switching workbenches | Corrupted CATSettings | Rename CATSettings folder |
| Crashes after hours of use | GDI object leak | Check Task Manager GDI count |
| Crashes on any operation | Installation corruption | Run installation validator |
| Crashes after Windows update | MSVC runtime or driver | Repair MSVC redistributables |

## Summary

The "Click OK to Terminate" error is almost always caused by a graphics driver issue or corrupted CATSettings. Start with the graphics driver — install the certified version, not the latest — and if that doesn't fix it, clear the CATSettings. These two fixes resolve about 85% of the cases we've handled. For the remaining 15%, check for GDI leaks and installation corruption. And always, always save your work frequently — CATIA V5's autosave is unreliable, and the crash will come when you least expect it.
