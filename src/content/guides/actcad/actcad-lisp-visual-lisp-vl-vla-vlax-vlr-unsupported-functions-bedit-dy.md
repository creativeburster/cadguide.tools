---
title: "ActCAD LISP Visual LISP vl- vla- vlax- vlr- Unsupported Functions, -BEDIT Dynamic Block Crash"
excerpt: "ActCAD LISP Visual LISP vl- vla- vlax- vlr- Unsupported Functions, -BEDIT Dynamic Block Crash: symptoms, root causes, and step-by-step fixes, verified against ActCAD release notes and documentation."
category: "troubleshooting"
softwareSlug: "actcad"
keyword: "ActCAD LISP Visual LISP vl- vla- vlax- vlr- unsupported IntelliCAD -BEDIT Dynamic Block crash LISP OPEN command hang LISPCOMMANDHASMORE Move command slow Graphics zoom pan cancel ODA SDK update 1310508"
slug: "actcad-lisp-visual-lisp-vl-vla-vlax-vlr-unsupported-functions-bedit-dy"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://actcad.com/faq.php"
  - "https://dailycadcam.com/actcad-2025-update-1310508-released/"
  - "https://actcad.com/blog-single.php?id=65&title=how-to-load-lisp-programs-in-actcad-software"
---

# ActCAD LISP Visual LISP vl- vla- vlax- vlr- Unsupported Functions, -BEDIT Dynamic Block Crash, LISP Open Command Hang, Move Command Slow Performance, and Graphics Zoom Pan Cancel Issue: IntelliCAD 13.1 Update, System Variable Fix, and ODA SDK Upgrade

ActCAD's IntelliCAD kernel produces errors from unsupported Visual LISP functions, Dynamic Block editing crashes, LISP command hangs, slow Move operations, and graphics glitches. This guide covers the 5 most common ActCAD problems with diagnostic steps and community-verified fixes from ActCAD release notes and documentation.

## 1. Visual LISP vl- vla- vlax- vlr- Functions Unsupported by IntelliCAD

### Symptom

AutoLISP routines that work in AutoCAD fail in ActCAD. The routines use Visual LISP functions (vl-, vla-, vlax-, vlr- prefixes) and produce "unknown function" errors. Approximately 20% of ported routines fail. The routines may use `vl-load-com`, `vlax-get-acad-object`, `vla-get-layer`, `vla-put-layer`, or reactor functions.

### Root Cause

"Most of the LISP commands are supported in ACTCAD. However there are few limitations on VISUAL LISP. Some of the Visual LISP commands are not supported by ACTCAD. Check the code thoroughly and compare with ACTCAD Help Developer Reference." ActCAD uses the IntelliCAD kernel, which supports pure AutoLISP but not Visual LISP extensions. Visual LISP functions (vl-, vla-, vlax-, vlr-) are AutoCAD-specific ActiveX automation wrappers that IntelliCAD doesn't implement. Reactors (vlr-* functions) are also not implemented.

### Fix

1. **Check for Visual LISP functions before porting**:
   - "Search for `vl-`, `vla-`, `vlax-`, `vlr-` — if found, the routine uses Visual LISP"
   - "Search for `vla-get-`, `vla-put-` — ActiveX automation, unsupported"
   - "Search for `gsm` — Geometric Constraint Manager APIs, unsupported"
   - "If none of these searches return hits, the routine is pure AutoLISP"

2. **Replace vl- string functions with pure AutoLISP**:
   - Replace `vl-string-subst` with `substr` and `strcat`
   - Replace `vl-string-search` with looping through characters
   - Replace `vl-string-trim` with custom trimming logic
   - Use basic AutoLISP string functions

3. **Replace vla- entity property access with entget/entmod**:
   - Instead of `vla-get-layer`:
   - Use `(cdr (assoc 8 (entget (car (entsel)))))`
   - Instead of `vla-put-layer`:
   - Use `(entmod (subst (cons 8 newlayer) (assoc 8 (entget ent)) (entget ent)))`
   - The `entget` approach reads from the entity's association list

4. **Replace vl-catch-all-apply with error trapping**:
   - Instead of `(setq result (vl-catch-all-apply 'my-func (list arg1 arg2)))`
   - Use:
   ```
   (setq result nil)
   (setq *error* (lambda (msg) (setq result nil)))
   (setq result (my-func arg1 arg2))
   (setq *error* nil)
   ```

5. **Replace reactors with command callbacks**:
   - vlr- reactor functions are not implemented
   - Use command callbacks or periodic checks instead
   - For automatic actions on entity modification
   - Use `:vlr-objectModified` equivalent through custom polling

6. **Use ActCAD Developer Reference**:
   - "Check the code thoroughly and compare with ACTCAD Help Developer Reference"
   - The Developer Reference lists supported functions
   - Check which IntelliCAD-specific functions are available
   - Some IntelliCAD extensions may provide similar functionality

7. **Rewrite heavy ActiveX routines in .NET**:
   - For routines that heavily depend on ActiveX
   - Consider rewriting in .NET using the IntelliCAD .NET API
   - This provides full access to the document object model
   - Without the Visual LISP limitation

### Community Report

> "Most of the LISP commands are supported in ACTCAD. However there are few limitations on VISUAL LISP. Some of the Visual LISP commands are not supported by ACTCAD. Check the code thoroughly and compare with ACTCAD Help Developer Reference. Visual LISP (VL- functions) — vl-load-com, vlax-get-acad-object, vla-* functions are not supported. Reactors — vlr-* reactor functions are not implemented."

## 2. -BEDIT Crash on Dynamic Blocks with Constraints

### Symptom

Using the `-BEDIT` command on Dynamic Blocks that contain Constraints causes ActCAD to crash. The crash occurs when editing the block definition in the Block Editor. The crash is immediate and doesn't produce an error message — the application simply closes.

### Root Cause

"Fixed crash issue when using -BEDIT on Dynamic Blocks with Constraints by clearing the selection set and adding a check for constraints." The `-BEDIT` command (command-line version of Block Edit) doesn't properly handle Dynamic Blocks with parametric constraints. The selection set from the previous command may interfere with the Block Editor's initialization. The constraint checking code doesn't properly validate the block definition before opening the editor, causing a null reference or memory access violation.

### Fix

1. **Update to ActCAD 2025 Update 1310508 or later**:
   - "ActCAD 2025 New update 1310508 released based on latest IntelliCAD 13.1 engine"
   - "Fixed crash issue when using -BEDIT on Dynamic Blocks with Constraints"
   - "By clearing the selection set and adding a check for constraints"
   - This is the primary fix — update to the latest version

2. **Use BEDIT (dialog version) instead of -BEDIT**:
   - The dialog version `BEDIT` may not have the same crash
   - Use the dialog interface to select and edit blocks
   - Instead of the command-line `-BEDIT` version
   - This is a workaround until updating

3. **Clear selection set before -BEDIT**:
   - Press Escape twice before running `-BEDIT`
   - This clears any active selection set
   - Which may interfere with the Block Editor
   - The fix in update 1310508 does this automatically

4. **Remove constraints from Dynamic Blocks**:
   - If possible, remove parametric constraints from the block
   - Before using `-BEDIT`
   - Constraints can be re-added after editing
   - This is a workaround for older versions

5. **Use the Block Editor palette**:
   - Instead of the `-BEDIT` command
   - Use the Block Editor palette from the ribbon
   - This provides a different code path
   - That may not have the same crash

6. **Report the crash to ActCAD support**:
   - If the crash persists after updating
   - Report to ActCAD support
   - Provide the block file and steps to reproduce
   - Include the crash report

### Community Report

> "ActCAD 2025 New update 1310508 released based on latest IntelliCAD 13.1 engine. Fixed crash issue when using -BEDIT on Dynamic Blocks with Constraints by clearing the selection set and adding a check for constraints. Resolved compilation errors for Visual Studio 17.14.0 to ensure IntelliCAD builds successfully."

## 3. LISP OPEN Command Hang from LISPCOMMANDHASMORE System Variable

### Symptom

When a LISP routine uses the `OPEN` command, ActCAD hangs or freezes. The hang occurs after the OPEN command is executed from within the LISP routine. The application becomes unresponsive and must be force-closed. The issue is intermittent and doesn't occur when using OPEN from the command line directly.

### Root Cause

"Resolved certain issue with the OPEN command via LISP by hiding the LISPCOMMANDHASMORE system variable." The `LISPCOMMANDHASMORE` system variable in IntelliCAD indicates whether a LISP command has more input pending. When the OPEN command is called from within a LISP routine, this system variable can cause the command processor to wait for additional input that never comes, resulting in a hang. The variable's state isn't properly reset after the OPEN command completes.

### Fix

1. **Update to ActCAD 2025 Update 1310508 or later**:
   - "Resolved certain issue with the OPEN command via LISP"
   - "By hiding the LISPCOMMANDHASMORE system variable"
   - This is the primary fix — update to the latest version
   - The update hides the variable from LISP routines

2. **Use (command "_.OPEN") syntax**:
   - Use the underscore and period prefix
   - `(command "_.OPEN" filename)`
   - This forces the English version of the command
   - And may avoid the system variable issue

3. **Use (vla-Open) via ActiveX (if supported)**:
   - If ActCAD supports the Document Open via API
   - Use the API approach instead of the command
   - This bypasses the command processor entirely
   - And the LISPCOMMANDHASMORE variable

4. **Reset LISPCOMMANDHASMORE before OPEN**:
   - If accessible, set the variable to 0
   - Before calling OPEN from LISP
   - `(setvar "LISPCOMMANDHASMORE" 0)`
   - Then call the OPEN command

5. **Use file dialog instead of command-line OPEN**:
   - Use `(getfiled "Select File" "" "dwg" 0)`
   - To get the filename
   - Then use `(command "_.OPEN" filename)`
   - The dialog approach may avoid the hang

6. **Wrap OPEN in error handling**:
   - Use error trapping around the OPEN command
   - Set a timeout or flag
   - If the command hangs, the error handler can recover
   - This is a workaround, not a proper fix

### Community Report

> "ActCAD 2025 New update 1310508 released. Resolved certain issue with the OPEN command via LISP by hiding the LISPCOMMANDHASMORE system variable. Fixed the hanging issue if ESC or Enter is pressed, hang symptoms appear while running LISP."

## 4. Move Command Slow Performance on Specific Drawings

### Symptom

The Move command is very slow when working on certain drawings. Moving even simple entities takes several seconds. The delay increases with the number of entities in the drawing. Other commands (Copy, Rotate) may also be slow on the same drawings. The issue is drawing-specific — the same command works fine on other drawings.

### Root Cause

"Fixed Move command slow issue for a given drawing." The Move command's performance depends on the drawing's internal structure. Drawings with many complex entities, nested blocks, or corrupted extension data can cause the Move command to perform excessive processing. The command checks for associated dimensions, constraints, and other references for each moved entity. If the drawing has corrupted or excessive extension data, these checks become very slow.

### Fix

1. **Update to the latest ActCAD version**:
   - "Fixed Move command slow issue for a given drawing"
   - This fix is included in recent ActCAD updates
   - Update to ActCAD 2025 or later
   - Check the release history for the specific fix

2. **PURGE the drawing**:
   - Run `PURGE` to remove unused blocks, layers, styles
   - Purge nested blocks (check "Purge nested items")
   - Remove unused linetypes, text styles, dimension styles
   - This reduces the drawing's complexity

3. **AUDIT and repair the drawing**:
   - Run `AUDIT` to check for errors
   - Fix any errors found
   - Run `AUDIT` again until no errors are reported
   - Corrupted entities can slow down commands

4. **Remove excess extension data**:
   - Use `(entget (car (entsel)) '("APPNAME"))`
   - To check for extension data
   - Remove unnecessary extension data from entities
   - This can significantly speed up commands

5. **Explode complex nested blocks**:
   - If the drawing has deeply nested blocks
   - Consider exploding them (if appropriate)
   - This reduces the block reference chain
   - That the Move command must traverse

6. **WBLOCK and re-insert**:
   - Use `WBLOCK` to write the drawing to a new file
   - Open the new file and check performance
   - This can strip corrupted data
   - And reduce file size

7. **Disable selection cycling**:
   - If selection cycling is enabled
   - It can slow down entity selection
   - Turn off selection cycling
   - In the status bar or settings

### Community Report

> "ActCAD 2025 update. Fixed Move command slow issue for a given drawing. Fixed Graphics zoom and pan actions issue when some CAD commands are canceled. Fixed crash issue after changing wall length. Fixed the hanging issue if ESC or Enter is pressed, hang symptoms appear while running LISP."

## 5. Graphics Zoom Pan Cancel Issue When CAD Commands Canceled

### Symptom

After canceling certain CAD commands (pressing ESC), graphics zoom and pan actions become glitchy or unresponsive. The viewport doesn't update properly during zoom and pan. The issue persists until ActCAD is restarted or a new command is executed. The graphics may show artifacts or incomplete redraws.

### Root Cause

"Fixed Graphics zoom and pan actions issue when some CAD commands are canceled." When certain CAD commands are canceled (via ESC), the graphics pipeline doesn't properly reset. The command's graphics context (temporary graphics, rubber-band lines, selection highlights) isn't cleaned up, leaving the graphics system in an inconsistent state. This affects subsequent zoom and pan operations, which rely on a clean graphics context.

### Fix

1. **Update to the latest ActCAD version**:
   - "Fixed Graphics zoom and pan actions issue when some CAD commands are canceled"
   - This fix is included in recent ActCAD updates
   - Update to ActCAD 2025 or later
   - Check the release history for the specific fix

2. **Run REGEN after canceling commands**:
   - After canceling a command with ESC
   - Run `REGEN` to regenerate the display
   - This forces a complete redraw
   - And resets the graphics context

3. **Run REDRAW to clear temporary graphics**:
   - Run `REDRAW` to clear temporary graphics
   - This is faster than REGEN
   - But may not fix all issues
   - Try REDRAW first, then REGEN if needed

4. **Switch to a different layout tab and back**:
   - Switch to another layout tab (Model/Paper)
   - Then switch back
   - This forces a complete graphics refresh
   - And can clear artifacts

5. **Minimize and restore ActCAD**:
   - Minimize the ActCAD window
   - Then restore it
   - This forces a complete screen redraw
   - Similar to a graphics reset

6. **Avoid canceling commands mid-operation**:
   - When possible, let commands complete naturally
   - Instead of canceling with ESC
   - Use Enter to complete with default values
   - This avoids the graphics context issue

7. **Report persistent issues to ActCAD support**:
   - If the issue persists after updating
   - Report to ActCAD support
   - Provide the specific command that causes the issue
   - And the steps to reproduce

### Community Report

> "ActCAD 2025 update. Fixed Graphics zoom and pan actions issue when some CAD commands are canceled. Updated ODA Libraries to latest version. Added a sysvar to identify build number. Fixed crash issue after changing wall length. Updated to ODA SDKs Version 2024.12 for improved compatibility and development."

## 6. Additional ActCAD Issues

### LISP ESC Enter Hang

**Issue**: "Fixed the hanging issue if ESC or Enter is pressed, hang symptoms appear while running LISP."
**Fix**: Update to the latest ActCAD version. The hang occurs when ESC or Enter is pressed during LISP execution. The latest update fixes this by properly handling keyboard input during LISP execution.

### Crash After Changing Wall Length

**Issue**: "Fixed crash issue after changing wall length."
**Fix**: Update to the latest ActCAD version. The crash occurs when modifying wall geometry in architectural drawings. The fix properly validates wall parameters before applying changes.

### Alibre Script Crash on Launch

**Issue**: "Alibre silently crashes when launching Alibre Script from Part/Asm workspace."
**Fix**: "Fixed issue that caused crash when starting Alibre Script after a new install of Alibre Design, until the PC was rebooted." Reboot the PC after installing Alibre Design before using Alibre Script.

### ODA SDK Compatibility

**Issue**: "Updated to ODA SDKs Version 2024.12 for improved compatibility and development."
**Fix**: Keep ActCAD updated to the latest version. ODA SDK updates improve DWG file compatibility and rendering. Check for updates regularly.

### REGENTOOLTIP with REGENMODE Off

**Issue**: "REGENTOOLTIP should work when REGENMODE is Off."
**Fix**: Update to the latest ActCAD version. The fix ensures the regen tooltip displays correctly even when automatic regen is disabled. Set `REGENMODE` to 0 to disable automatic regen.

### .NET Compilation Issues

**Issue**: "Fixed certain compilation issue of .Net code."
**Fix**: Update to the latest ActCAD version. .NET API compilation issues have been resolved. If developing .NET add-ins, use the latest ActCAD SDK.

### Visual Studio Build Compatibility

**Issue**: "Resolved compilation errors for Visual Studio 17.14.0 to ensure IntelliCAD builds successfully."
**Fix**: If building IntelliCAD from source (for ActCAD development), use Visual Studio 17.14.0 or later. The latest ActCAD update resolves compilation errors with newer Visual Studio versions.

## Best Practices

1. **Check for Visual LISP functions before porting** — search for vl-, vla-, vlax-, vlr-
2. **Replace vla- functions with entget/entmod** — pure AutoLISP approach
3. **Update to ActCAD 2025 Update 1310508 or later** — fixes -BEDIT crash, OPEN hang, Move slow
4. **Use BEDIT dialog instead of -BEDIT** — workaround for Dynamic Block crash
5. **PURGE and AUDIT drawings regularly** — prevents Move command slowdowns
6. **Run REGEN after canceling commands** — fixes graphics zoom/pan issues
7. **Use _. prefix for commands in LISP** — ensures English command names
8. **Enable verbose error reporting in LISP** — `(setq *error* (lambda (msg) (princ (strcat "\nError: " msg)) (princ)))`
9. **Use APPLOAD to load LISP files** — same interface as AutoCAD
10. **Keep ActCAD updated** — ODA SDK and IntelliCAD engine updates improve compatibility
