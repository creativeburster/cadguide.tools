---
title: "SketchUp Inferencing Stops Working: Cursor Not Snapping to Corners and Guidelines"
excerpt: "SketchUp's inferencing suddenly stops — the cursor no longer snaps to endpoints, midpoints, or intersections. We cover the click-out-click-in fix, the graphics engine switch, and the preferences reset that restore snapping."
category: "troubleshooting"
softwareSlug: "sketchup"
keyword: "SketchUp inferencing not working snapping cursor corners"
slug: "sketchup-inferencing-stops-working-snapping-fix"
author: "CADGuide Tools Editorial Team"
readTime: "7 min"
date: "2025-06-26"
sources:
  - "https://forums.sketchup.com/t/sketchup-2024-crashing-on-startup-and-cursor-stops-snapping-to-corners-and-guidelines/312624"
  - "https://help.sketchup.com/en/sketchup/improving-performance"
---

# SketchUp Inferencing Stops Working: Cursor Not Snapping to Corners and Guidelines

A user on the SketchUp Community forum reported two related problems on their M1 MacBook Pro: SketchUp 2024 crashed on startup (before opening any files), and when they could get it running, the cursor would frequently stop snapping to corners, endpoints, and guidelines. They had to restart SketchUp each time to restore inferencing. The SketchUp staff response confirmed that these two issues are related — both are caused by the new graphics engine — and provided fixes for each.

This is a problem we've encountered across multiple SketchUp versions and platforms. Inferencing — SketchUp's smart snapping system that highlights endpoints, midpoints, intersections, and on-edge positions — is one of the most fundamental modeling tools. When it stops working, modeling becomes nearly impossible.

## Understanding SketchUp Inferencing

Inferencing is SketchUp's system for detecting geometric relationships between the cursor and existing geometry. It highlights:

- **Endpoints**: Green dots at line endpoints
- **Midpoints**: Cyan dots at line midpoints
- **Intersections**: Red X marks where two edges cross
- **On Edge**: Red dots when the cursor is on an edge
- **On Face**: Blue highlight when the cursor is on a face
- **Inferences from hidden geometry**: Snap points from geometry that's hidden but within the current editing context

When inferencing stops, none of these indicators appear. The cursor moves freely without snapping, making precise modeling impossible.

## Root Cause: Graphics Engine Issues

The SketchUp staff response confirmed: "For the losing inferencing, yes, that can lead to a crash. The next update from us has fixes in it to help prevent the problem from occurring."

The inferencing system relies on the graphics engine to render the snap indicators (dots, X marks, highlights). When the graphics engine encounters an error — a rendering context loss, a GPU driver timeout, or a memory issue — the inferencing indicators stop rendering. The snapping logic may still be running, but you can't see the visual feedback.

This is more common with:
- The new graphics engine (introduced in SketchUp 2024)
- Integrated graphics (Intel UHD, Apple M-series integrated)
- NVIDIA production/game-ready drivers (vs Studio drivers)
- Systems with dual GPUs (laptops with NVIDIA + AMD/integrated)

## Fix 1: Click Out, Click In (Immediate Workaround)

The SketchUp staff provided this quick workaround: "If you notice inferencing has stopped working, you should be able to left-click into another application, and left-click back into SketchUp, to get inferencing back."

1. When inferencing stops, click on any other application window (your browser, file explorer, etc.)
2. Click back into the SketchUp window
3. The graphics context is refreshed, and inferencing should work again
4. This is a temporary fix — inferencing may stop again after some time

This workaround works because clicking out of SketchUp causes the operating system to switch the graphics context to the other application. Clicking back forces SketchUp to reinitialize its graphics context, which restores the inferencing rendering.

## Fix 2: Switch to Classic Graphics Engine

This is the permanent fix for the inferencing problem:

### If You Can Open SketchUp

1. Go to **Preferences → Graphics**
2. Change **Graphics Engine** from **New** to **Classic**
3. Restart SketchUp
4. Inferencing should work consistently with the classic engine

### If SketchUp Crashes Before You Can Access Preferences

1. Close SketchUp
2. Navigate to: `%AppData%\SketchUp\SketchUp 2024\` (Windows) or `~/Library/Application Support/SketchUp 2024/` (Mac)
3. Open `PrivatePreferences.json` in a text editor
4. Search for `"useNewGraphicsEngine"`
5. Change the value from `true` to `false`
6. Save the file
7. Restart SketchUp

The SketchUp staff confirmed: "SketchUp 24 should work using the new graphics engine for integrated silicon graphics, but to get work done you can switch over to the classic OpenGL graphics engine via the Preferences > Graphics dialog."

## Fix 3: Update Graphics Drivers

### NVIDIA Graphics

1. Download the latest **NVIDIA Studio Driver** (not Game Ready/Production)
2. Use DDU (Display Driver Uninstaller) to remove the current driver completely
3. Install the Studio Driver
4. Restart and test SketchUp

### AMD Graphics

1. Download the latest AMD Adrenalin driver
2. Use AMD Clean Install option during installation
3. Restart and test

### Intel Integrated Graphics

1. Download the latest Intel graphics driver from Intel's website (not from Windows Update)
2. Install and restart
3. If inferencing still fails, switch to Classic Graphics Engine

### Apple Silicon (M1/M2/M3)

On Apple Silicon Macs, graphics drivers are part of macOS updates:

1. Update to the latest macOS version
2. If inferencing still fails, switch to Classic Graphics Engine
3. The new graphics engine on Apple Silicon has known issues with inferencing that Apple and SketchUp are working to fix

## Fix 4: Reset SketchUp Preferences

Corrupted preferences can cause inferencing issues:

1. Close SketchUp
2. Navigate to: `%AppData%\SketchUp\SketchUp 2024\` (Windows) or `~/Library/Application Support/SketchUp 2024/` (Mac)
3. Rename `PrivatePreferences.json` to `PrivatePreferences.json.bak`
4. Rename `Preferences.json` to `Preferences.json.bak`
5. Restart SketchUp — it will create fresh preference files with default settings
6. Test inferencing
7. If inferencing works, reapply your custom preferences manually
8. If inferencing still doesn't work, the preferences weren't the cause

## Fix 5: Check for Conflicting Extensions

Some extensions modify the inferencing system or the graphics rendering pipeline:

1. Hold **Shift** while starting SketchUp to skip extension loading
2. Test inferencing without extensions
3. If inferencing works without extensions, one of your extensions is causing the conflict
4. Re-enable extensions one at a time, testing inferencing after each
5. Common culprits:
   - Extensions that modify the drawing tools (e.g., vertex tools, line tools)
   - Extensions that override the graphics rendering (e.g., V-Ray, Enscape)
   - Extensions that modify the inference engine directly

## Fix 6: Reduce Model Complexity

Inferencing can slow down or stop on very complex models because the inference engine has to check every edge and face for snap points:

1. Check your edge count: **Window → Model Info → Statistics**
2. If the edge count is in the millions, inferencing may be overwhelmed
3. **Purge Unused** to reduce model bloat
4. Use **Tags** to hide geometry you're not currently working on
5. Work on one component at a time — enter the component's editing context rather than modeling in the top-level model

## Fix 7: Check Display Settings

1. Go to **View → Edge Style**
2. Disable **Profiles** — thick profile edges can interfere with inferencing rendering
3. Go to **View → Face Style**
4. Switch to **Wireframe** or **Hidden Line** temporarily
5. If inferencing works in Wireframe but not in Shaded, the issue is with texture/material rendering
6. Reduce texture resolution or switch to flat colors

## Fix 8: Multiple Monitor Issues

If you use multiple monitors with different resolutions or scaling factors:

1. Try moving SketchUp to your primary monitor
2. Set both monitors to the same scaling (100% or 150%)
3. Right-click SketchUp shortcut → **Properties → Compatibility**
4. Check **Disable high DPI scaling on this program**
5. Restart SketchUp

Multiple monitors with different DPI settings can cause the graphics engine to miscalculate cursor positions, which breaks inferencing.

## Summary

| Fix | Type | Effectiveness |
|-----|------|--------------|
| Click out, click in | Immediate workaround | Temporary — restores for a while |
| Switch to Classic Graphics Engine | Permanent fix | Very high — eliminates the root cause |
| Update graphics drivers | Permanent fix | High — fixes driver-related issues |
| Reset preferences | Diagnostic | Medium — fixes corruption-related issues |
| Disable conflicting extensions | Diagnostic | Medium — identifies extension conflicts |
| Reduce model complexity | Performance | Medium — reduces inference engine load |
| Check display settings | Diagnostic | Low — fixes rendering-specific issues |
| Fix multiple monitor issues | Permanent fix | Medium — fixes DPI-related issues |

The click-out-click-in workaround is useful when you're in the middle of work and can't restart. But the permanent fix is switching to the Classic Graphics Engine, which eliminates the root cause. If you need the new engine for its performance benefits, ensure your graphics drivers are up to date and report the issue to SketchUp support with a BugSplat report.
