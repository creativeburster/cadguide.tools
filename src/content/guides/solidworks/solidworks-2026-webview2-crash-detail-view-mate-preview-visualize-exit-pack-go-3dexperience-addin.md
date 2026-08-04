---
title: "SOLIDWORKS 2026 Crash After Launch from Microsoft Edge WebView2 Runtime 146 Update, Generic Crash When Opening Drawing and Changing Detail View Scale, Mate References Preview Dialog Low Performance and Component Movement Scattered, Visualize 2026 SP1.1 Crashes on File Exit, and Pack and Go Search Replace Filename Not Working with 3DEXPERIENCE Add-in: HotFix QA00000445516 Install, SP2.1 Update, Mate Preview Disable, Visualize Update, and Add-in Disable"
excerpt: "SOLIDWORKS fails for 5 distinct reasons: crash after launch from Microsoft Edge WebView2 Runtime 146 update requiring HotFix QA00000445516 install, generic crash when opening drawing and changing detail view scale requiring SP2.1 update, mate references preview dialog low performance and component movement scattered requiring mate preview disable, Visualize 2026 SP1.1 crashes on File Exit requiring Visualize update, and Pack and Go search replace filename not working with 3DEXPERIENCE add-in requiring add-in disable. We cover each with fixes from SOLIDWORKS support."
category: "troubleshooting"
softwareSlug: "solidworks"
keyword: "SOLIDWORKS 2026 crash after launch Microsoft Edge WebView2 Runtime 146 update generic crash opening drawing changing detail view scale mate references preview dialog low performance component movement scattered Visualize SP1.1 crashes File Exit Pack and Go search replace filename 3DEXPERIENCE add-in"
slug: "solidworks-2026-webview2-crash-detail-view-mate-preview-visualize-exit-pack-go-3dexperience-addin"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-04"
sources:
  - "https://www.solidworks.com/support/general-hotfixes"
  - "https://support.hawkridgesys.com/hc/en-us/articles/44396298148877-SOLIDWORKS-Design-Crashes-Immediately-after-Launch-BR10000422063"
  - "https://help.solidworks.com/2026/english/SolidWorks/sldworks/c_graphics_adapters_drivers.htm"
---

# SOLIDWORKS 2026 Crash After Launch from Microsoft Edge WebView2 Runtime 146 Update, Generic Crash When Opening Drawing and Changing Detail View Scale, Mate References Preview Dialog Low Performance and Component Movement Scattered, Visualize 2026 SP1.1 Crashes on File Exit, and Pack and Go Search Replace Filename Not Working with 3DEXPERIENCE Add-in: HotFix QA00000445516 Install, SP2.1 Update, Mate Preview Disable, Visualize Update, and Add-in Disable

SOLIDWORKS produces errors from WebView2 crashes, drawing view crashes, mate preview performance, Visualize exit, and Pack and Go issues. This guide covers the 5 most common SOLIDWORKS problems with diagnostic steps and community-verified fixes from SOLIDWORKS support.

## 1. Crash After Launch from Microsoft Edge WebView2 Runtime 146 Update

### Symptom

SOLIDWORKS 2026 crashes immediately after launch with "SOLIDWORKS 2026 has encountered a problem and needs to close." The crash occurs on machines that received Microsoft Edge WebView2 Runtime 146.0.3856.xx update since March 13, 2026. The issue affects SOLIDWORKS 2025 SP5, 2026 SP0, and 2026 SP1.

### Root Cause

"An update to Microsoft Edge WebView2 Runtime can cause SOLIDWORKS Design 2025 SP5, 2026 SP0, and 2026 SP1 to crash immediately after launch. The problem is reported in Bug Report BR10000422063 - Crash after launch or when using web-based task panes with Microsoft Edge WebView2 Runtime 146 installed." The Microsoft Edge WebView2 Runtime 146 update is incompatible with SOLIDWORKS CEF (Chromium Embedded Framework). When SOLIDWORKS tries to initialize web-based task panes using the updated WebView2, it crashes.

### Fix

1. **Install HotFix QA00000445516**:
   - "The HotFix is provided in QA00000445516"
   - "Hotfix for user-license versions"
   - "Of SOLIDWORKS Design"
   - Install HotFix

2. **Download and install HotFix**:
   - "Download the hotfix file attachment"
   - "Double-click the hotfix file"
   - "In the WinZip Self-Extractor dialog"
   - "Click Unzip then OK"

3. **Restart Windows before installing**:
   - "Restart Windows"
   - Before installing
   - The HotFix
   - For clean state

4. **Undo previous workarounds**:
   - "Undo any previous workaround(s)"
   - "You applied or attempted"
   - Before installing
   - The HotFix

5. **Rename SWK3DCompassAddin.dll as workaround**:
   - "Rename SWK3DCompassAddin.dll"
   - "To SWK3DCompassAddin.dll.bak"
   - "In C:\Program Files\Dassault Systemes\"
   - "SOLIDWORKS 3DEXPERIENCE R2026x\win_b64\code\bin\SWXDesktopAddins"
   - Rename as workaround

6. **Update to 3DEXPERIENCE R2026x HotFix 1.8**:
   - "The fix has been delivered with"
   - "3DEXPERIENCE R2026x HotFix 1.8"
   - "For SOLIDWORKS Design app"
   - Update to HF 1.8

7. **Check WebView2 Runtime version**:
   - Check if WebView2
   - Runtime 146 is
   - Installed on
   - The machine

### Community Report

> "SOLIDWORKS Design terminates after launch or when using web-based task panes with Microsoft Edge WebView2 Runtime 146 installed. The issue occurs on machines which have received the Microsoft Edge WebView2 Runtime 146.0.3856.xx update since March 13, 2026. The fix has been delivered with 3DEXPERIENCE R2026x HotFix 1.8. The HotFix is provided in QA00000445516."

## 2. Generic Crash When Opening Drawing and Changing Detail View Scale

### Symptom

A generic crash or hang occurs when opening a drawing and changing the view scale of a detail view. The crash happens during the view scale modification. The issue occurs in SOLIDWORKS 2026 SP0 and SP1.

### Root Cause

"BR10000419941: Generic crash or hang when opening a drawing and changing the view-scale of detail view." The detail view scale change operation has a bug in SOLIDWORKS 2026 SP0/SP1. When the user modifies the view scale of a detail view, the drawing update routine accesses invalid memory or enters an infinite loop, causing a crash or hang.

### Fix

1. **Update to SP2.1**:
   - "2026 Release SP2.1"
   - Check if the fix
   - Is included in
   - SP2.1

2. **Save before changing view scale**:
   - Save the drawing
   - Before changing
   - The detail view
   - Scale

3. **Change scale in small increments**:
   - Change the scale
   - In small increments
   - Instead of
   - Large changes

4. **Use drawing properties to change scale**:
   - Use drawing properties
   - Instead of
   - Direct view
   - Scale change

5. **Recreate detail view**:
   - Delete and recreate
   - The detail view
   - With the correct
   - Scale from start

6. **Check for lightweight mode**:
   - Check if drawing
   - Is in lightweight
   - Mode and
   - Disable it

7. **Report persistent crash**:
   - If crash persists
   - After SP2.1
   - Report to
   - SOLIDWORKS support

### Community Report

> "BR10000419941: Generic crash or hang when opening a drawing and changing the view-scale of detail view. 2026 Release SP2.1."

## 3. Mate References Preview Dialog Low Performance and Component Movement Scattered

### Symptom

Mate References with mate preview dialog generate low performance. Components' movement is scattered or stops during the mate preview. The issue sometimes leads to a crash. The performance degradation occurs when the mate preview dialog is active.

### Root Cause

"BR10000404661: Mates References + mate preview dialog generate low performance - components' movement scattered or stop - sometimes leading to crash." The mate preview dialog rendering has a performance bug. When the preview dialog is open, the component movement calculation is inefficient, causing scattered or stopped movement. The performance issue can escalate to a crash.

### Fix

1. **Disable mate preview**:
   - Disable mate
   - Preview dialog
   - To improve
   - Performance

2. **Update to latest SP**:
   - Check if the fix
   - Is included in
   - The latest
   - Service pack

3. **Use mates without preview**:
   - Apply mates
   - Without the
   - Preview dialog
   - For better performance

4. **Simplify assembly before mating**:
   - Simplify the
   - Assembly before
   - Applying mates
   - With preview

5. **Reduce component count**:
   - Reduce the number
   - Of visible components
   - During mate
   - Operations

6. **Check graphics performance settings**:
   - "Clear Enhanced graphics performance"
   - "(requires SOLIDWORKS Design restart)"
   - Check graphics
   - Performance settings

7. **Use Software OpenGL for testing**:
   - "Start SOLIDWORKS Design"
   - "By using Software OpenGL"
   - "This disables the graphics adapter"
   - "Hardware accelerator"
   - Use Software OpenGL

### Community Report

> "BR10000404661: Mates References + mate preview dialog generate low performance - components' movement scattered or stop - sometimes leading to crash. If you suspect problems with the graphics adapter, you can start SOLIDWORKS Design by using Software OpenGL. This disables the graphics adapter hardware accelerator."

## 4. Visualize 2026 SP1.1 Crashes on File Exit

### Symptom

SOLIDWORKS Visualize 2026 SP1.1 crashes when choosing File > Exit. The crash occurs during the application shutdown. The issue is specific to Visualize 2026 SP1.1.

### Root Cause

"BR10000420406: SolidWorks Visualize 2026 SP1.1 crashes when choosing File, Exit." The Visualize 2026 SP1.1 exit routine has a bug. When the user selects File > Exit, the shutdown sequence accesses invalid memory or fails to properly clean up resources, causing a crash.

### Fix

1. **Update to latest SP**:
   - Check if the fix
   - Is included in
   - The latest
   - Service pack

2. **Use alternative exit method**:
   - Instead of File > Exit
   - Use the window
   - Close button (X)
   - To close Visualize

3. **Save project before exit**:
   - Save the project
   - Before exiting
   - To prevent
   - Data loss

4. **Use Task Manager to close**:
   - If Visualize crashes
   - On exit
   - Use Task Manager
   - To terminate

5. **Check for unsaved changes**:
   - Verify all changes
   - Are saved before
   - Exiting Visualize
   - To prevent loss

6. **Report persistent crash**:
   - If crash persists
   - After update
   - Report to
   - SOLIDWORKS support

7. **Reinstall Visualize**:
   - If crashes persist
   - Uninstall and
   - Reinstall Visualize
   - 2026

### Community Report

> "BR10000420406: SolidWorks Visualize 2026 SP1.1 crashes when choosing File, Exit."

## 5. Pack and Go Search Replace Filename Not Working with 3DEXPERIENCE Add-in

### Symptom

Search and Replace of Filename does not work in Pack and Go when run from SOLIDWORKS Design with the 3DEXPERIENCE add-in enabled. The Pack and Go feature functions correctly without the 3DEXPERIENCE add-in. The issue occurs in SOLIDWORKS 2026 SP2.

### Root Cause

"BR10000424866: Search / Replace of Filename does not work in Pack and Go when run from SOLIDWORKS Design with the 3DEXPERIENCE add-in enabled." The 3DEXPERIENCE add-in interferes with the Pack and Go Search/Replace functionality. The add-in's file management system overrides or blocks the filename search and replace operation in Pack and Go.

### Fix

1. **Disable 3DEXPERIENCE add-in**:
   - Disable the
   - 3DEXPERIENCE add-in
   - Before using
   - Pack and Go

2. **Update to latest SP**:
   - "2026 Release SP2.1"
   - Check if the fix
   - Is included in
   - SP2.1

3. **Use Pack and Go without add-in**:
   - Run Pack and Go
   - Without the
   - 3DEXPERIENCE add-in
   - Enabled

4. **Rename files manually**:
   - If Search/Replace
   - Doesn't work
   - Rename files
   - Manually after Pack and Go

5. **Use SOLIDWORKS Explorer**:
   - Use SOLIDWORKS Explorer
   - For Pack and Go
   - Operations instead
   - Of SOLIDWORKS Design

6. **Check add-in compatibility**:
   - Verify 3DEXPERIENCE
   - Add-in version
   - Is compatible
   - With SOLIDWORKS 2026

7. **Report persistent issue**:
   - If issue persists
   - After SP2.1
   - Report to
   - SOLIDWORKS support

### Community Report

> "BR10000424866: Search / Replace of Filename does not work in Pack and Go when run from SOLIDWORKS Design with the 3DEXPERIENCE add-in enabled. 2026 Release SP2.1."

## 6. Additional SOLIDWORKS Issues

### Drawing Open Performance Slow

**Issue**: "BR10000401932: SOLIDWORKS Drawing open performance is slower than expected with view palette views."
**Fix**: Update to latest SP. Check view palette settings. Simplify drawing views. Use Quick View.

### Assembly Lightweight Parts Switch

**Issue**: "BR10000421687: Opening assembly with lightweight parts causes the parts to switch from 3DEXPERIENCE compatible to SOLIDWORKS configurations."
**Fix**: Update to latest SP. Check lightweight settings. Verify 3DEXPERIENCE compatibility after opening.

### Unable to Open Drawing Files

**Issue**: "BR10000422560: Unable to open the drawing files in the SOLIDWORKS Design SP1.1 or SP1.0 version."
**Fix**: Update to SP2.1. Check drawing file format. Verify SOLIDWORKS version compatibility.

### What's Wrong Analysis Missing

**Issue**: "BR10000425820: What's Wrong Analysis missing from SOLIDWORKS AI Skills 2026 SP02."
**Fix**: Update to SP2.1. Check AI Skills settings. Verify AI Skills installation.

### Software OpenGL for Graphics Testing

**Issue**: "If you suspect problems with the graphics adapter, you can start SOLIDWORKS Design by using Software OpenGL."
**Fix**: Enable Software OpenGL in Options > Performance. Clear Enhanced graphics performance. Open a document and examine the display. If display improves, graphics adapter is the cause.

### Graphics Adapter and Driver Certification

**Issue**: "Several commonly used graphics adapters and drivers are tested with SOLIDWORKS Design."
**Fix**: Check SOLIDWORKS hardware certification page. Use certified graphics cards. Keep drivers up to date. Use NVIDIA RTX Ada Generation cards for best performance.

### Add-in Performance Optimization

**Issue**: "Many add-ins are turned on by default in SOLIDWORKS. To help boost performance, configure add-ins to load for current session only."
**Fix**: Turn off non-essential add-ins on startup. Enable add-ins only when needed. Configure add-ins for current session only. Check add-in compatibility with SOLIDWORKS 2026.

### Windows Fast Startup Impact

**Issue**: "Windows Fast Startup does not clear the session information in order to boot up as fast as possible."
**Fix**: Use Restart instead of Shut down. Disable Fast Startup. Keep reboot count below 5 days. Clear session information regularly.

## Best Practices

1. **Install HotFix QA00000445516 for WebView2 crash** — fixes crash after launch from Edge WebView2 146
2. **Update to SP2.1 for drawing and Pack and Go fixes** — resolves detail view and search/replace issues
3. **Disable mate preview dialog for better performance** — prevents scattered component movement
4. **Use window close button instead of File > Exit in Visualize** — avoids exit crash in SP1.1
5. **Disable 3DEXPERIENCE add-in for Pack and Go operations** — fixes search/replace filename issue
6. **Use Software OpenGL to test graphics adapter issues** — isolates graphics vs. model problems
7. **Keep graphics drivers up to date with certified versions** — check SOLIDWORKS hardware certification
8. **Turn off non-essential add-ins on startup** — improves launch time and performance
9. **Use Restart instead of Shut down to clear session** — Windows Fast Startup doesn't clear session info
10. **Check SOLIDWORKS hardware certification before buying** — use certified cards for best performance
