---
title: "Navisworks Clash Detective and Stability Errors: Crash When Grouping Clashes After Not Maintaining Groups Requiring Select Screen Workaround or Update 2, 2026 Constant Crashing from Clash Manager Drag-Drop Bug Requiring Update 2, Search Set Creation Fatal Error from CLR Exception Requiring File Repair, Freezing When Grouping All Tests from Name Preview Generation Requiring Simplified Grouping, and Viewpoint Disappearing and Crash from Folder Drag-Drop Requiring Sort Workaround"
excerpt: "Navisworks fails for 5 distinct reasons: crash when grouping clashes after not maintaining groups requiring select screen workaround or Update 2, 2026 constant crashing from clash manager drag-drop bug requiring Update 2, search set creation fatal error from CLR exception requiring file repair, freezing when grouping all tests from name preview generation requiring simplified grouping, and viewpoint disappearing and crash from folder drag-drop requiring sort workaround. We cover each with fixes from Autodesk Community Forums."
category: "clash-detective-and-stability-errors"
softwareSlug: "navisworks"
keyword: "Navisworks crash grouping clashes not maintaining groups select screen workaround Update 2 2026 constant crashing clash manager drag-drop bug search set creation fatal error CLR exception file repair freezing grouping all tests name preview generation simplified grouping viewpoint disappearing crash folder drag-drop sort workaround"
slug: "navisworks-clash-detective-stability-errors-crash-grouping-clashes-not-maintaining-groups-2026-constant-crashing-drag-drop-search-set-fatal-error-clr-exception-freezing-grouping-all-tests-viewpoint-disappearing-sort-workaround"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://forums.autodesk.com/t5/navisworks-forum/bug-crash-manage-2026-u1-crash-when-grouping-clashes-after-not/td-p/13748825"
  - "https://forums.autodesk.com/t5/navisworks-forum/navisworks-2026-crashing/td-p/13716123"
  - "https://forums.autodesk.com/t5/navisworks-forum/navisworks-2025-crashes-sundely-when-creating-search-sets/td-p/13222611"
---

# Navisworks Clash Detective and Stability Errors: Crash When Grouping Clashes After Not Maintaining Groups Requiring Select Screen Workaround or Update 2, 2026 Constant Crashing from Clash Manager Drag-Drop Bug Requiring Update 2, Search Set Creation Fatal Error from CLR Exception Requiring File Repair, Freezing When Grouping All Tests from Name Preview Generation Requiring Simplified Grouping, and Viewpoint Disappearing and Crash from Folder Drag-Drop Requiring Sort Workaround

Navisworks' clash grouping, drag-drop operations, search set creation, clash test grouping, and viewpoint management produce errors from group maintenance bugs, clash manager issues, CLR exceptions, name preview overload, and folder drag-drop problems. This guide covers the 5 most common Navisworks problems with diagnostic steps and community-verified fixes from Autodesk Community Forums.

## 1. Crash When Grouping Clashes After Not Maintaining Groups

### Symptom

In Navisworks Manage 2026 U1, if you group clashes without the "maintain existing groups" unchecked that are already in groups while on the "results" screen in the Clash Detective, and then switch between select then back to results, Navisworks crashes every time. The crash is reproducible.

### Root Cause

"If you group clashes without the 'maintain existing groups' unchecked that are already in groups while on the 'results' screen in the Clash Detective and then switch between select then back to results, Navisworks will crash every time." The Clash Detective has a bug where regrouping clashes on the Results screen while existing groups are present causes a state conflict. When switching between Select and Results screens, the clash group display refresh triggers the crash because it tries to render old group names while the regrouping is in progress.

### Fix

1. **Group clashes while in the Select screen**:
   - "I think a work around is to group clashes while in the 'select' screen so that the old group names are not displayed while regrouping clashes"
   - Switch to the Select screen before grouping
   - Perform the grouping operation there
   - Then switch back to Results

2. **Check "Maintain existing groups"**:
   - When grouping clashes that are already in groups
   - Check the "maintain existing groups" option
   - This prevents the conflict that causes the crash
   - Then perform the grouping

3. **Update to Navisworks 2026 Update 2**:
   - "Not investigated yet, but has been ticketed for 2026 update 2"
   - "Affects 2026/2026.1 and can occur when moving clashes into or out of a group via drag/drop"
   - Install Update 2 when available
   - This is the permanent fix

4. **Avoid regrouping on Results screen**:
   - Don't group or regroup clashes while on the Results screen
   - Always switch to Select screen first
   - This avoids the bug trigger
   - Until the update is installed

5. **Save before grouping**:
   - Save the NWF file before any grouping operation
   - If the crash occurs, reopen the saved file
   - This prevents losing work
   - Set auto-save to every 2-3 minutes

### Community Report

> "If you group clashes without the 'maintain existing groups' unchecked that are already in groups while on the 'results' screen in the Clash Detective and then switch between select then back to results, Navisworks will crash every time. A work around is to group clashes while in the 'select' screen so that the old group names are not displayed while regrouping clashes. Ticketed for 2026 update 2."

## 2. 2026 Constant Crashing from Clash Manager Drag-Drop Bug

### Symptom

Navisworks 2026 continually crashes when doing simple selections and routine tasks within Manage. Crashes when trying to change the status of multiple clashes or moving multiple clashes into a group. Updating video card drivers and unchecking hardware acceleration don't help. The crash occurs when moving clashes into or out of a group via drag/drop.

### Root Cause

"Affects 2026/2026.1 and can occur when moving clashes into or out of a group via drag/drop." The Clash Manager in Navisworks 2026 has a bug in the drag/drop handler. When dragging multiple clash results into or out of a group, the internal state management fails. The software can't handle the multi-selection drag/drop operation correctly, causing a crash. This is a version-specific bug in 2026/2026.1.

### Fix

1. **Update to Navisworks 2026 Update 2**:
   - "Update 2 is now released, including this fix and many others"
   - "Release notes can be found at https://help.autodesk.com/view/NAV/2026/ENU/?guid=Navisworks_2026_2_release"
   - Install Update 2
   - This is the primary fix

2. **Use Navisworks 2025 as fallback**:
   - "I'm using NW 2025 until this is addressed"
   - "Which is a real shame, as some of the new features in NW 2026 are very useful"
   - If Update 2 doesn't fully fix the issue
   - Use 2025 for critical work

3. **Avoid drag/drop for multiple clashes**:
   - Don't drag multiple clash results at once
   - Move clashes one at a time
   - Or use right-click > Move to Group
   - This avoids the multi-selection drag/drop bug

4. **Set auto-save to 2-3 minutes**:
   - "I would recommend setting auto-save to be every 2-3 minutes"
   - "I also save really often out of habit because I have lost too much work from crashes"
   - Set auto-save in application settings
   - Save manually after each grouping operation

5. **Avoid shift-click multi selection**:
   - "A crash will occur when you have a clash result selected that appears after a clash grouping"
   - "Apply a filter, hold down shift and select another clash to multi select"
   - "To avoid this crash, click the already selected clash prior to using shift click"
   - Click the already-selected clash first, then shift-click

6. **Check for remaining crash after Update 2**:
   - "Edit: Nope, clash manager still crashing when trying to move multiple clashes in to a folder"
   - Update 2 may not fully fix the issue
   - If crashes persist, use the workarounds
   - Report to Autodesk support

### Community Report

> "Navisworks 2026 continually crashing when doing simple selections and routine tasks. Makes the clash detective unusable. Lost track of how many times it has crashed in a single session. Trying to change the status of multiple clashes or move multiple clashes into a group causes the crash. Affects 2026/2026.1 when moving clashes into or out of a group via drag/drop. Update 2 is now released. But clash manager still crashing when trying to move multiple clashes into a folder."

## 3. Search Set Creation Fatal Error from CLR Exception

### Symptom

Navisworks 2025 crashes suddenly when creating search sets. Working in an NWF file with 3 small models linked. When trying to save a simple search set, a fatal error occurs. The error is: "CLR exception - code e0434352. Managed exception type: System.InvalidOperationException." The issue occurs on two different computers with the same file.

### Root Cause

The CLR (Common Language Runtime) exception indicates a .NET runtime error in Navisworks. The System.InvalidOperationException suggests that the search set creation code is performing an invalid operation. This could be caused by: (1) corrupted model data in the NWF file, (2) invalid search criteria that the .NET code can't handle, (3) a bug in the search set save function, or (4) corrupted application state.

### Fix

1. **Try recommended crash fixes**:
   - "I have also already tried all of these recommendations with no success"
   - Follow Autodesk's Navisworks crash troubleshooting guide
   - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Navisworks-crashes-randomly.html"
   - Try all recommended steps

2. **Create a new NWF file**:
   - Create a fresh NWF file
   - Re-attach the models
   - Try creating search sets in the new file
   - If it works, the old NWF is corrupted

3. **Simplify search criteria**:
   - Start with the simplest possible search set
   - Use a single search criterion (e.g., Category = Walls)
   - Add criteria one at a time
   - Identify which criterion causes the crash

4. **Check model file integrity**:
   - One of the 3 linked models may be corrupted
   - Detach all models
   - Re-attach one at a time
   - Test search set creation after each attachment

5. **Use different file format**:
   - Try saving as NWD instead of NWF
   - Or try a different NWF with the same models
   - The file format may be causing the issue
   - Test with different formats

6. **Submit crash report to Autodesk**:
   - Submit a support ticket to Autodesk
   - Include the error details and the NWF file
   - The CLR exception details help developers
   - "Erro: CLR exception - code e0434352"

### Community Report

> "Navisworks 2025 crashes suddenly when creating search sets. Working in a NWF file with 3 small models linked. When I try to save a simple search set, a fatal error occurs. Aplicativo: Roamer.exe. Erro: CLR exception - code e0434352. Tipo da exceção gerenciada: System.InvalidOperationException. Tried two different computers and the same problem is happening. Using Navisworks 2025 update 4."

## 4. Freezing When Grouping All Tests from Name Preview Generation

### Symptom

Navisworks 2026 freezes up or is very slow when grouping all tests. Complex clash grouping setup (Level > Element-Category > Element-Workset > Element-System Classification > Grid Intersection) with 30-40 clash tests and thousands of clashes. Clicking the "select all" box causes the freeze. The clash name preview box tries to generate a preview for every single property and clash test at the same time.

### Root Cause

"I believe this is because the clash name preview box is trying to generate a preview for every single property and clash test at the same time." When "select all" is clicked with a complex grouping hierarchy, Navisworks generates a name preview for every clash result using all grouping levels. With 30-40 clash tests and thousands of clashes, this generates thousands of preview strings simultaneously, overwhelming the UI thread and causing the freeze.

### Fix

1. **Simplify grouping hierarchy**:
   - Reduce the number of grouping levels
   - Use fewer levels: Level > Element-Category instead of 5 levels
   - This reduces the preview generation load
   - Add levels incrementally

2. **Group tests individually**:
   - Don't use "select all"
   - Group one clash test at a time
   - This reduces the number of previews generated
   - Repeat for each test

3. **Disable name preview**:
   - "I think disabling the 'name preview' when you click 'select all'"
   - "Or only limiting it to the first clash test in the list would resolve this issue"
   - Check if there's a setting to disable name preview
   - Or limit preview to first test

4. **Reduce number of clash tests**:
   - Consolidate similar clash tests
   - Delete unnecessary tests
   - Fewer tests = fewer previews to generate
   - Keep only essential tests

5. **Use simpler grouping for bulk operations**:
   - For initial grouping, use simple hierarchy
   - Group by Level only
   - After grouping, add more levels
   - This avoids the preview overload

6. **Process in batches**:
   - Select a subset of clash tests
   - Group those tests
   - Then select the next batch
   - This keeps the preview generation manageable

### Community Report

> "Navisworks 2026 freezes up/very slow when grouping all tests. Complex clash grouping setup (Level > Element-Category > Element-Workset > Element-System Classification > Grid Intersection) with 30-40 clash tests and thousands of clashes. The clash name preview box is trying to generate a preview for every single property and clash test at the same time. Disabling the name preview or limiting it to the first clash test would resolve this."

## 5. Viewpoint Disappearing and Crash from Folder Drag-Drop

### Symptom

When dragging viewpoints around to different folders, the views can just disappear. The next interaction with the Viewpoints window causes the software to crash. Entire folders of viewpoints disappear without warning. The issue occurs in Navisworks 2026.

### Root Cause

The viewpoint folder drag-drop has a bug similar to the clash grouping drag-drop bug. When dragging viewpoints between folders, the internal state update fails. Some viewpoints are dropped from the data structure, causing them to disappear. The next interaction with the Viewpoints window triggers a null reference or invalid state access, causing the crash.

### Fix

1. **Use Sort to recover disappeared viewpoints**:
   - "I have found that when they disappear, if I 'Sort' the viewpoints they come back"
   - "I have entire folders disappear and return with this method"
   - Click the Sort button in the Viewpoints window
   - This refreshes the viewpoint list and recovers disappeared items

2. **Avoid drag-drop for viewpoints**:
   - Don't drag viewpoints between folders
   - Use right-click > Move to Folder instead
   - Or cut and paste viewpoints
   - This avoids the drag-drop bug

3. **Save before organizing viewpoints**:
   - Save the NWF file before any viewpoint organization
   - If viewpoints disappear, reopen the saved file
   - This prevents losing viewpoint organization
   - Set auto-save to frequent intervals

4. **Update to Navisworks 2026 Update 2**:
   - The viewpoint drag-drop bug may be fixed in Update 2
   - Install the latest update
   - Check if the issue persists
   - Report if it does

5. **Use viewpoint categories instead of folders**:
   - If folder drag-drop is unstable
   - Use viewpoint categories (tags) instead
   - Categories don't require drag-drop
   - Assign categories through properties

6. **Don't interact after disappearance**:
   - If viewpoints disappear after drag-drop
   - Don't click anything in the Viewpoints window
   - Save the file immediately (if possible)
   - Use Sort to recover, then save

### Community Report

> "This issue applies to viewpoints as well. When dragging viewpoints around to different folders, the views can just disappear. The next interaction with viewpoints window causes the software to crash. I have found that when they disappear, if I 'Sort' the viewpoints they come back. I have entire folders disappear and return with this method. Still needs work, lots of crashing with the clash detective remains."

## 6. Additional Navisworks Issues

### Navisworks 2025 General Crash

**Issue**: "Navisworks Manage 2025 Crash — crashing without warning and without any error message."
**Fix**: Update to latest version. Check hardware compatibility. Submit crash report to Autodesk. Try on a different computer. Use 2024 as fallback.

### Hardware Acceleration Issues

**Issue**: Crashes even after updating video card drivers and unchecking hardware acceleration.
**Fix**: Try different graphics driver versions. Use software rendering. Check for conflicting GPU utilities. Update DirectX.

### Unrecognized OS Crash

**Issue**: "Some tell tale signs that pops after trying multiple number of times is unrecognized OS."
**Fix**: Verify OS compatibility with Navisworks version. Update Windows. Check system requirements. Run in compatibility mode.

### Large NWD File Crash

**Issue**: Crash with large NWD files (72 MB+).
**Fix**: Reduce file size by removing unnecessary models. Use NWF instead of NWD for large datasets. Split into multiple files. Optimize model attachments.

## Best Practices

1. **Group clashes on the Select screen, not Results** — avoids group maintenance crash
2. **Update to Navisworks 2026 Update 2** — fixes clash manager drag-drop crash
3. **Use Navisworks 2025 as fallback** — more stable for critical work
4. **Set auto-save to 2-3 minutes** — minimizes data loss from crashes
5. **Move clashes one at a time, not via multi-drag** — avoids drag-drop bug
6. **Click already-selected clash before shift-click** — avoids multi-selection crash
7. **Simplify clash grouping hierarchy** — prevents name preview freeze
8. **Group tests individually, not with select all** — reduces preview generation load
9. **Use Sort to recover disappeared viewpoints** — fixes folder drag-drop disappearance
10. **Save before organizing viewpoints** — prevents loss from drag-drop crash
