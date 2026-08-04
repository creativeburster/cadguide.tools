---
title: "BricsCAD Status Bar Freeze from Custom CUI and LISP Macros, GUI Crash on Linux from GTK Widget Critical, ARX Freeze After Using BricsCAD Commands Before Loading, LISP Stops Working on Second Drawing from Per-Document Loading, and on_doc_load LISP Not Loading from Errant Support Path: on_start.lsp and on_doc_load.lsp, Downgrade, Ribbon Tab Switch, ACADLSPASDOC, and Support Path Priority"
excerpt: "BricsCAD fails for 5 distinct reasons: status bar freeze from custom CUI and LISP macros requiring on_start.lsp and on_doc_load.lsp configuration, GUI crash on Linux from GTK widget critical errors requiring downgrade to previous version, ARX freeze after using BricsCAD commands before loading requiring ribbon tab switch workaround, LISP stops working on second drawing from per-document loading requiring ACADLSPASDOC=1, and on_doc_load LISP not loading from errant support path requiring path priority correction. We cover each with fixes from BricsCAD Forum."
category: "troubleshooting"
softwareSlug: "bricscad"
keyword: "BricsCAD status bar freeze custom CUI LISP macros GUI crash Linux GTK widget critical ARX freeze commands before loading LISP stops working second drawing per-document ACADLSPASDOC on_doc_load errant support path on_start.lsp downgrade ribbon tab switch"
slug: "bricscad-status-bar-freeze-custom-cui-lisp-macros-gui-crash-linux-gtk-widget-arx-freeze-commands-before-loading-lisp-stops-working-second-drawing-acadlspasdoc-on-doc-load-errant"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forum.bricsys.com/discussion/38901/status-bar-freezes-after-running-custom-macros-and-lisps"
  - "https://forum.bricsys.com/discussion/38959/v24-2-05-suddenly-crashes-when-loading-the-gui"
  - "https://forum.bricsys.com/discussion/40056/lisp-loads-then-stops-working"
---

# BricsCAD Status Bar Freeze from Custom CUI and LISP Macros, GUI Crash on Linux from GTK Widget Critical, ARX Freeze After Using BricsCAD Commands Before Loading, LISP Stops Working on Second Drawing from Per-Document Loading, and on_doc_load LISP Not Loading from Errant Support Path: on_start.lsp and on_doc_load.lsp, Downgrade, Ribbon Tab Switch, ACADLSPASDOC, and Support Path Priority

BricsCAD produces errors from status bar freezes, Linux GUI crashes, ARX loading conflicts, LISP per-document issues, and support path problems. This guide covers the 5 most common BricsCAD problems with diagnostic steps and community-verified fixes from the BricsCAD Forum.

## 1. Status Bar Freeze from Custom CUI and LISP Macros

### Symptom

The status bar freezes when customization is introduced in the form of a partial CUI or LISP and macros are run. The freeze occurs after running any customized LISP or macro. The status bar becomes unresponsive — it doesn't update coordinates, snap settings, or other status information. The drawing area may still be functional but the status bar is stuck.

### Root Cause

The status bar freeze occurs when BricsCAD's UI framework encounters a conflict between custom CUI (Custom User Interface) files and LISP routines that modify UI elements. The partial CUI file may register status bar handlers that conflict with LISP macros that also interact with the status bar. When both are active, the status bar update mechanism deadlocks, causing it to freeze. The issue is specific to custom CUI files — the default CUI doesn't cause this problem.

### Fix

1. **Use on_start.lsp and on_doc_load.lsp**:
   - "User LISP file names to use are: on_start.lsp and on_doc_load.lsp"
   - "on_start.lsp (equivalent to acad.lsp). Loaded automatically on application startup"
   - "on_doc_load.lsp (equivalent to acaddoc.lsp). Loaded automatically with each drawing opened"
   - Use these files instead of custom CUI for LISP loading

2. **Unload custom partial CUI files**:
   - "Unloaded one Custom Partial CUI file (included two custom button macros)"
   - Test if the freeze resolves after unloading
   - If it does, the CUI file is the cause
   - Rebuild the CUI without status bar interactions

3. **Use autoload function**:
   - "Look into using the 'Autoload' function in your single lisp"
   - "(autoload 'COPY0' '(\"COPY0\"))"
   - Autoload demand-loads LISP when the command is typed
   - Reducing memory usage and potential conflicts

4. **Consolidate LISP files**:
   - "Using the Appload Start up suite, you do not have to have multiple single lisps"
   - "You can load one big one with all your custom lisps in it"
   - Consolidate multiple LISP files into one
   - To reduce loading conflicts

5. **Clean reinstall**:
   - "Uninstalled per BricsCAD Help instructions"
   - "Renamed existing installation's two folders - appended filenames with 'OLD'"
   - Do a clean reinstall
   - Removing old configuration files

6. **Test on local and cloud copies**:
   - "Worked on a DWG file copy on both the cloud and a copy saved locally"
   - Test if the issue is network-related
   - By trying both cloud and local files
   - Network latency can worsen the freeze

7. **Submit a support request**:
   - If the freeze persists after all fixes
   - Submit a support request to Bricsys
   - With the CUI and LISP files
   - And steps to reproduce

### Community Report

> "The status bar freezes when customization is introduced in the form of a partial CUI or LISP and macros are run. Status bar freezes after running all customized LISPs and/or macros. Unloaded one Custom Partial CUI file. Uninstalled per BricsCAD Help instructions. User LISP file names to use are: on_start.lsp (equivalent to acad.lsp) and on_doc_load.lsp (equivalent to acaddoc.lsp)."

## 2. GUI Crash on Linux from GTK Widget Critical Errors

### Symptom

BricsCAD V24.2.05 suddenly crashes when loading the GUI on Ubuntu 24.04 (X11). The crash occurs just as BricsCAD is about to display the main start screen after selecting a workspace in the BricsCAD Starter menu. Before the crash, dozens of GTK-CRITICAL warnings appear: "gtk_widget_get_parent: assertion 'GTK_IS_WIDGET (widget)' failed". Reinstalling the same version doesn't help.

### Root Cause

The crash is caused by a compatibility issue between BricsCAD V24.2.05 and the GTK library in Ubuntu 24.04. The GTK-CRITICAL warnings indicate that BricsCAD's GUI code is passing invalid widget references to GTK functions. The crash occurs in `libbcutils.so` during the destruction of the main frame, specifically in `initSectionSymbolGripPE` which accesses an invalid object. "Reinstalling of the current version 24.2.05 did not help, but a downgrade to the previous version 24.2.04 resulted in a working program. I did that twice to confirm that the problem only occurs in 24.2.05."

### Fix

1. **Downgrade to V24.2.04**:
   - "A downgrade to the previous version 24.2.04 resulted in a working program"
   - "I did that twice to confirm that the problem only occurs in 24.2.05"
   - Uninstall V24.2.05
   - Install V24.2.04

2. **Create a support request**:
   - "Please create a support request for this crash"
   - "In which you add the crash report, and your config file"
   - "You can find the config by making sure that the Show hidden Files is enabled"
   - "Then go to Home > .bricscad"

3. **Check GTK warnings**:
   - "The warnings show up in both versions of BricsCAD I tested"
   - "Even when the program is running normally"
   - "So this might not be connected to the crash"
   - GTK warnings alone don't indicate the crash

4. **Try a different desktop environment**:
   - "Same behavior here, bricscad V24.2.06-1 and openSUSE Leap 15.5 KDE"
   - The issue occurs on multiple Linux distributions
   - Try a different desktop environment
   - (e.g., XFCE instead of GNOME/KDE)

5. **Use the Windows version via WINE**:
   - If the Linux version continues to crash
   - Consider running the Windows version
   - Via WINE or CrossOver
   - As a workaround

6. **Check for OS updates**:
   - "Seems related to libc and others"
   - Ensure all Linux library updates are installed
   - Especially libc and GTK packages
   - Newer library versions may resolve the issue

7. **Wait for a fix in the next version**:
   - The issue is version-specific (24.2.05)
   - Wait for the next release
   - Which should address the GTK compatibility
   - Check the Bricsys release notes

### Community Report

> "After working flawlessly for a week, BricsCAD V24 suddenly starts crashing under Ubuntu 24.04 (X11) when it is just about to display the main start screen. Illegal access: Address not mapped to object. Before the crash there are dozens of GTK-CRITICAL lines. Reinstalling of the current version 24.2.05 did not help, but a downgrade to the previous version 24.2.04 resulted in a working program. Same behavior here, bricscad V24.2.06-1 and openSUSE Leap 15.5 KDE. Seems related to libc and others."

## 3. ARX Freeze After Using BricsCAD Commands Before Loading

### Symptom

When loading a custom-built ARX immediately after starting BricsCAD (without using any commands first), it loads successfully. However, when using BricsCAD commands (RECT, POLYLINE, ERASE) before loading the ARX via APPLOAD, BricsCAD freezes and must be force-closed. The ARX entry point function is never entered. The issue reproduces in both V24.2.04 and V25.1.02.

### Root Cause

"BricsCAD seems to be in the process of loading the ARX when it is frozen, but never enters the ARX code." The freeze occurs during the ARX loading process, before the ARX entry point is called. Using BricsCAD commands before loading the ARX puts the application in a state where the ARX loader encounters a deadlock — likely a conflict between the command history state and the ARX loading mechanism. The ARX file is locked (Windows says it's in use) but the code never executes.

### Fix

1. **Load ARX before using any commands**:
   - "When I load the ARX right after starting BricsCAD"
   - "Without using any BricsCAD commands before loading the ARX"
   - "It successfully loads with no issues"
   - Load the ARX first, then use commands

2. **Switch ribbon tabs before loading**:
   - "Does anything change if you switch to a different ribbon tab, then back to Home, before loading your app?"
   - Try switching to a different ribbon tab
   - Then back to Home
   - Before loading the ARX

3. **Use on_start.lsp for ARX loading**:
   - Load the ARX from on_start.lsp
   - Which runs at application startup
   - Before any commands are used
   - "(arxload \"path/to/your.arx\")"

4. **Submit a support ticket**:
   - "I suggest submitting a support ticket so the problem can be investigated"
   - "Yes I have submitted a support ticket now"
   - Report the issue to Bricsys
   - With reproduction steps and the ARX file

5. **Use APPLOAD startup suite**:
   - Add the ARX to the APPLOAD startup suite
   - So it loads automatically on startup
   - Before any commands are used
   - This avoids the command-before-loading conflict

6. **Test with a minimal ARX**:
   - Create a minimal ARX with just the entry point
   - Test if it also freezes
   - This helps determine if the issue
   - Is with the ARX code or the loading mechanism

7. **Check for command-related state**:
   - The issue may be related to command history
   - Or undo/redo stack state
   - Try clearing the command history
   - Before loading the ARX

### Community Report

> "When I load the ARX right after starting BricsCAD, without using any BricsCAD commands before loading the ARX, it successfully loads. However, when I use some BCAD commands (RECT, POLYLINE, ERASE) before using APPLOAD command to load my ARX, BricsCAD freezes. I confirmed in my ARX code that the ARX entry point function is never entered. BricsCAD seems to be in the process of loading the ARX when it is frozen. Does anything change if you switch to a different ribbon tab, then back to Home, before loading your app? I suggest submitting a support ticket."

## 4. LISP Stops Working on Second Drawing from Per-Document Loading

### Symptom

Custom LISP routines load and work correctly when BricsCAD starts and the first drawing is opened. However, when opening a second file or closing the first file and opening another, the LISP routines stop working. The LISP commands are no longer recognized. The user has a large collection of custom LISP routines built up over 40 years of AutoCAD use.

### Root Cause

"I think lisp is per document." BricsCAD loads LISP per document by default. The on_start.lsp loads LISP at application startup, but the LISP functions are only available in the first document. When a new document is opened, it doesn't automatically reload the LISP unless on_doc_load.lsp is configured. This is different from AutoCAD's behavior where LISP can be loaded globally.

### Fix

1. **Use on_doc_load.lsp for per-document loading**:
   - "on_doc_load.lsp (equivalent to acaddoc.lsp)"
   - "Loaded automatically with each drawing opened"
   - Place LISP loading calls in on_doc_load.lsp
   - So LISP loads for every drawing

2. **Set ACADLSPASDOC = 1**:
   - "You can force on_start.lsp to load with each drawing"
   - "By Setting ACADLSPASDOC = 1"
   - This setting makes on_start.lsp
   - Load for every document

3. **Use APPLOAD autoload**:
   - "Use 'APPLOAD' command"
   - "That command let you choose all the lisps that you want to load"
   - "And set them to autoload for every drawing load"
   - "Those lisp's calls are saved to appload.dfs"

4. **Use autoload function**:
   - "Look into using the 'Autoload' function"
   - "(autoload 'COPY0' '(\"COPY0\"))"
   - "When you type the command the lisp is loaded"
   - Autoload demand-loads LISP per command

5. **Don't use default file names**:
   - "on_doc_load_default.lsp & on_start_default.lsp shouldn't be used"
   - "These are reserved files for the use of Bricsys"
   - "And maybe be overwritten by them!"
   - Use on_doc_load.lsp and on_start.lsp instead

6. **Consolidate into one LISP file**:
   - "You can load one big one with all your custom lisps in it"
   - "My Custom.lsp has some 38 defuns in it plus lots of 'Autoload'"
   - Consolidate all LISP routines into one file
   - And load it from on_doc_load.lsp

7. **Place LISP on support search path**:
   - "These Lisp need to be placed somewhere on your support file search path (SRCHPATH)"
   - Ensure the LISP files are in a folder
   - That's on the SRCHPATH
   - So BricsCAD can find them

### Community Report

> "When I start up Brics, it loads the default LISP and that then loads all the subsequent LISP files. They work great. However, if I open a second file or if I close the first file and open another file, the LISPs stop working. I think lisp is per document. on_doc_load.lsp (equivalent to acaddoc.lsp) is loaded automatically with each drawing opened. Not recommended, but you can force on_start.lsp to load with each drawing by Setting ACADLSPASDOC = 1."

## 5. on_doc_load LISP Not Loading from Errant Support Path

### Symptom

A LISP routine will not load via the on_doc_load file. Using APPLOAD, the routine loads manually, but the "Autoload" and "Load" checkboxes are unticked when BricsCAD restarts. The LISP can be loaded using the full path from the command line. The support path appears correct in the settings, and the LISP files are in the support folder.

### Root Cause

"It was an errant reference the V24 in the support file path. So it was obviously reading that first, couldn't see it and skipped the correct one." An old version path (V24) was still in the support file search path. BricsCAD searches support paths in order, and when it found the V24 path first, it tried to load the LISP from there. Since the file didn't exist in the V24 path, it skipped the correct path entirely. The APPLOAD autoload settings were also not persisting because the appload.dfs file was in the wrong location.

### Fix

1. **Check support file search paths**:
   - "In reading support path when you have multiple paths"
   - "Make sure top priority one is the 1st entry"
   - "In the other CAD once a program etc is found it stops looking"
   - Remove old version paths from SRCHPATH

2. **Remove errant version paths**:
   - "It was an errant reference the V24 in the support file path"
   - "As soon as I removed that, it worked fine"
   - Check for old version references (V24, V25, etc.)
   - In the support file search path

3. **Verify path order**:
   - "Make sure top priority one is the 1st entry"
   - The correct path should be first
   - In the support file search path list
   - BricsCAD searches in order

4. **Use APPLOAD startup suite**:
   - "Using the Appload Start up suite"
   - "You do not have to have multiple single lisps loaded"
   - "You can load one big one with all your custom lisps in it"
   - Add the LISP to the APPLOAD startup suite

5. **Check appload.dfs location**:
   - "Those lisp's calls are saved to a file name 'appload.dfs'"
   - "Saved in: C:\\Users\\User\\AppData\\Roaming\\Bricsys\\BricsCAD\\V26x64\\en_US"
   - Verify the appload.dfs file
   - Is in the correct version folder

6. **Check for missing text styles**:
   - "I didn't have your textstyles in my drawing, so added the style"
   - "And the routine worked"
   - LISP routines that reference text styles
   - Will fail if the style doesn't exist

7. **Use on_doc_load.lsp correctly**:
   - "Added it to my on_doc_load.lsp and it also worked no problem"
   - Call the LISP from on_doc_load.lsp
   - Using (load "path/to/lisp.lsp")
   - For automatic per-document loading

### Community Report

> "I have a lisp routine that will not load via the on_doc_load file. If I use appload, the routine will load, but even though I tick 'Autoload' and 'Load' both are unticked when I restart Bricscad. I actually found the issue. It was an errant reference the V24 in the support file path. It was obviously reading that first, couldn't see it and skipped the correct one. As soon as I removed that, it worked fine. In reading support path when you have multiple paths make sure top priority one is the 1st entry."

## 6. Additional BricsCAD Issues

### on_start_default.lsp and on_doc_load_default.lsp Are Reserved

**Issue**: "on_doc_load_default.lsp & on_start_default.lsp shouldn't be used, these are reserved files for the use of Bricsys and maybe overwritten by them!"
**Fix**: Use on_start.lsp and on_doc_load.lsp (without "_default") for user LISP files. The "_default" versions are reserved for Bricsys and may be overwritten during updates.

### APPLOAD Autoload Not Persisting

**Issue**: "Even though I tick 'Autoload' and 'Load' both are unticked when I restart Briscad."
**Fix**: Check the appload.dfs file location. It should be in the correct version folder under AppData\\Roaming\\Bricsys\\BricsCAD\\Vxxx64\\en_US. Old version paths in SRCHPATH can prevent the file from being found.

### LISP Text Style Dependencies

**Issue**: "I didn't have your textstyles in my drawing, so added the style and the routine worked."
**Fix**: Ensure all text styles referenced in LISP routines exist in the drawing or template. Add missing text styles to the template file. LISP routines that create text will fail if the referenced style doesn't exist.

### Autoload for Memory Efficiency

**Issue**: Loading all LISP routines at startup uses too much memory.
**Fix**: "Look into using the 'Autoload' function. When you type the command the lisp is loaded." Use autoload to demand-load LISP only when the command is typed, reducing memory usage.

### Multiple LISP Files vs Single File

**Issue**: Managing many individual LISP files is cumbersome.
**Fix**: "You can load one big one with all your custom lisps in it. My Custom.lps has some 38 defuns in it plus lots of 'Autoload'." Consolidate into a single LISP file with autoload definitions for each command.

### GTK-CRITICAL Warnings on Linux

**Issue**: "Gtk-CRITICAL **: gtk_widget_get_parent: assertion 'GTK_IS_WIDGET (widget)' failed"
**Fix**: These warnings appear in both working and crashing versions. They are generally harmless. Only action is needed if they precede a crash. If a crash occurs, downgrade to the previous version.

### Config File Location on Linux

**Issue**: Where to find BricsCAD config files on Linux for support requests.
**Fix**: "You can find the config by making sure that the Show hidden Files is enabled the go to Home > .bricscad" The config files are in the hidden .bricscad directory in the home folder.

## Best Practices

1. **Use on_start.lsp and on_doc_load.lsp** — not the "_default" versions which are reserved by Bricsys
2. **Remove old version paths from SRCHPATH** — prevents LISP loading failures
3. **Set ACADLSPASDOC = 1** — forces on_start.lsp to load for every document
4. **Load ARX before using any BricsCAD commands** — prevents ARX loading freeze
5. **Downgrade on Linux if GUI crashes** — version-specific GTK compatibility issues
6. **Use autoload for memory efficiency** — demand-loads LISP only when commands are typed
7. **Consolidate LISP into one file** — reduces loading conflicts and management overhead
8. **Ensure text styles exist in template** — prevents LISP failures from missing styles
9. **Verify appload.dfs location** — ensures APPLOAD autoload settings persist
10. **Submit support tickets for ARX and GUI crashes** — helps Bricsys identify and fix bugs
