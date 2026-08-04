---
title: "Altium Designer PCB.DataModel.dll Crash on Routing and Polygon Repour"
excerpt: "Altium Designer PCB.DataModel.dll Crash on Routing and Polygon Repour: symptoms, root causes, and step-by-step fixes, verified against Altium Knowledge Base and community forums."
category: "troubleshooting"
softwareSlug: "altium-designer"
keyword: "Altium Designer PCB.DataModel.dll crash routing polygon repour un-routed net dead copper DRC zero-area regions clearance error same-net hidden track segments unrouted nets teardrop zero-width regions board region missing stackup Health Check Monitor"
slug: "altium-designer-pcb-datamodel-dll-crash-on-routing-and-polygon-repour"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/altium-pcb-datamodel-dll-crash-on-pcbdoc"
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/resolving-un-routed-net-dead-copper-drc-violations"
  - "https://www.eevblog.com/forum/altium/unrouted-nets-drc-error-when-routed-(fixed)/"
---

# Altium Designer PCB.DataModel.dll Crash on Routing and Polygon Repour, Un-Routed Net Dead Copper DRC Violations from Zero-Area Regions, DRC Clearance Errors on Same-Net Pads from Hidden Track Segments, Unrouted Nets DRC from Teardrop-Generated Zero-Width Regions, and Board Region Missing Stackup: Health Check Monitor, PCB Rules Panel, and Layer Stack Assignment

Altium Designer produces crashes from DataModel DLL errors, DRC violations from dead copper, false clearance errors from hidden segments, unrouted net errors from teardrop artifacts, and board region stackup issues. This guide covers the 5 most common Altium Designer problems with diagnostic steps and community-verified fixes from the Altium Knowledge Base and community forums.

## 1. PCB.DataModel.dll Crash During Routing or Polygon Repour

### Symptom

Altium Designer crashes with a "Altium.PCB.DataModel.dll" error message when trying to route traces or when repouring polygons on the PCBDoc. The crash occurs during interactive routing or polygon pour updates. The crash is repeatable and prevents any routing or polygon work on the affected board.

### Root Cause

"The root cause of the issue may be due to your board region not having a stackup defined." The PCB DataModel requires a valid layer stackup assigned to the board region. When the board region has no stackup (or an invalid stackup reference), the DataModel encounters a null reference during routing or polygon repour operations, causing the DLL crash. This is a data integrity issue — the board was created or modified without properly assigning a layer stack to the board region.

### Fix

1. **Enable Multilayer and select Board Region**:
   - "Make sure that the Multilayer layer is enabled and is the active Layer"
   - "Select the Panel tab (in the bottom right) » View Configurations"
   - "Scroll down to Other Layers and there should be an eye icon next to Multilayer"
   - "Make sure that it is not crossed out"

2. **Enter Board Planning Mode**:
   - "Enter Board Planning Mode by using View » Board Planning Mode (shortcut: press 1 key)"
   - "At the bottom in the Active Layers bar, select the Multilayer layer to make it Active"
   - "You should be able to select the Board region"

3. **Assign Layer Stack to Board Region**:
   - "Double-click the board region to open the Board Region properties"
   - "Select the Layer Stack Drop-down"
   - "Make sure it is set to a Board Layer Stack"
   - This is the critical fix — assign a valid layer stack

4. **Verify Selection Filter**:
   - "In the Properties panel, make sure that the Selection Filter is set to enable for All - On"
   - If the selection filter is too restrictive
   - You won't be able to select the board region
   - Enable all selection types

5. **Check for multiple board regions**:
   - If the board has multiple regions (rigid-flex design)
   - Ensure each region has a valid stackup assigned
   - Any region without a stackup can cause the crash
   - Check all regions in Board Planning Mode

6. **Save and restart Altium**:
   - After assigning the layer stack
   - Save the PCBDoc
   - Restart Altium Designer
   - Test routing and polygon repour

7. **Recreate the board outline if corrupted**:
   - If the board region can't be selected
   - Or the stackup assignment doesn't fix the crash
   - Recreate the board outline
   - And reassign the layer stack

### Community Report

> "Altium crashes with a Altium.PCB.DataModel.dll error message when I try to route or when repouring polygons on the PCBDoc. The root cause of the issue may be due to your board region not having a stackup defined. Enter Board Planning Mode, double-click the board region to open the Board Region properties, and then select the Layer Stack Drop-down, make sure it is set to a Board Layer Stack."

## 2. Un-Routed Net Dead Copper DRC Violations from Zero-Area Regions

### Symptom

DRC reports "Un-Routed Net Constraint: Region (0 hole(s)) Dead Copper - Net Not Assigned" violations. The dead copper regions are not visible in the PCB layout, making them difficult to locate and delete manually. The violations persist even after routing all nets. The dead copper appears on various layers and may have been created by automated tools.

### Root Cause

"In Altium Designer, a DRC violation occurs when there is dead copper or zero-area regions or polygons on a PCB layer that is not assigned to any net." Zero-area regions can be created by various automated operations (teardrop generation, polygon pour updates, or routing commands). These regions are too small to be visible in the layout but are detected by the DRC. The regions have no net assignment, triggering the "dead copper" rule.

### Fix

1. **Use PCB Health Check Monitor (Altium 22+)**:
   - "Altium Designer 22 introduced the Health Check Monitor functionality"
   - "Which can automatically detect and fix zero-area polygons or dead copper"
   - "With nothing selected in the PCB document open the Properties Panel"
   - "Click on the Health Check tab"
   - "Click Check All"
   - "Select the Zero Area Regions check"
   - "Click on Fix Issues to automatically delete zero area regions"

2. **Manual Removal via PCB Rules And Violations Panel**:
   - "Run the DRC: Tools » Design Rule Check... » Run Design Rule Check"
   - "Open the PCB Rules And Violations Panel"
   - "Ensure the Select option is enabled in the panel"
   - "Navigate to and select the UnRoutedNet rule"
   - "Select the 'Dead Copper - Net Not Assigned' violation"
   - "Press Delete or use Edit » Delete to delete the dead copper"

3. **Use PCB List Panel for inspection**:
   - "Dead copper and zero-area objects can further be inspected with the PCB List Panel"
   - "Open the PCB List Panel"
   - "Check the Area Size and Layer of the suspected objects"
   - "Right-click and choose Zoom Selected to locate the objects on the layout"

4. **Check for teardrop-generated regions**:
   - "I think it might have been the teardrop generator as half of them were at T junctions"
   - If teardrops were recently added
   - Check for zero-width regions created by the teardrop tool
   - Delete them from the PCB List panel

5. **Filter by Area Size in PCB List**:
   - In the PCB List panel
   - Sort by Area Size column
   - Look for regions with area = 0
   - Select and delete all zero-area regions

6. **Re-run DRC after cleanup**:
   - After deleting all dead copper
   - Re-run the DRC
   - Verify all un-routed net violations are resolved
   - Save the PCB file

7. **Prevent future dead copper**:
   - After running automated tools (teardrops, polygon pours)
   - Check for zero-area regions
   - Run Health Check Monitor regularly
   - To catch dead copper early

### Community Report

> "Un-Routed Net Design Rule Check (DRC) violations, caused by dead copper or zero-area regions can occur in PCB layouts. The error message appears as: 'Un-Routed Net Constraint: Region (0 hole(s)) Dead Copper - Net Not Assigned.' Altium Designer 22 introduced the Health Check Monitor functionality, which can automatically detect and fix zero-area polygons or dead copper. Click on Fix Issues to automatically delete zero area regions."

## 3. DRC Clearance Errors on Same-Net Pads from Hidden Track Segments

### Symptom

All traces show DRC clearance errors, even pads connected on the same net show a 0.2 mm clearance error. Two parts of a single continuous trace show clearance errors against each other. Altium doesn't recognize that the segments are on the same net and pad. The errors appear even on properly routed connections.

### Root Cause

The DRC is detecting hidden track segments that are not on the same net or are slightly offset from the pad. "Sometimes a very small track segment will reside within a component pad and cause the cause of a DRC violation." These segments may be created by routing operations that don't properly connect to the pad center, or by partial routing operations that leave tiny segments. The segments are too small to see in the normal view but are detected by the DRC.

### Fix

1. **Right-click and check Violations**:
   - "Right-click on the violation track or pad and select Violations from the context menu"
   - "From there you can select individual design rules that have triggered the violation"
   - "Or Show All Violations"
   - "Reviewing this list and the descriptions can often help you determine which elements are involved"

2. **Enable all layers**:
   - "Ensure that all layers are being shown"
   - "Sometimes a violation will be unclear as an element involved is hidden"
   - "Click Used On in the View Configuration panel"
   - "Cycle through layers to find hidden design rule violations"

3. **Use extended selection to find hidden segments**:
   - "Select one of the violating tracks or pads"
   - "Then press Tab to extend the selection to connected copper"
   - "This can be helpful when there exists geometry that's not obvious but causing a violation"
   - "For example, a segment of track that isn't assigned the same net"

4. **Check for tiny segments within pads**:
   - "Sometimes a very small track segment will reside within a component pad"
   - "And cause be the cause of a DRC violation"
   - Zoom into pad areas
   - Look for tiny track segments

5. **Delete hidden segments**:
   - After identifying hidden segments
   - Select them in the PCB List panel
   - Or by clicking on them after zooming in
   - Delete them to resolve the clearance error

6. **Disable rules one at a time**:
   - "Try disabling design rules (remove the checkbox from the Enabled column)"
   - "In the PCB Rules and Constraints Editor"
   - "Often by enabling rules one at a time (or changing the priority of rules)"
   - "You can see how they are causing an undesired or unintended effect"

7. **Re-route the connection**:
   - If hidden segments can't be found
   - Delete the entire trace
   - And re-route it from scratch
   - This ensures a clean connection without hidden segments

### Community Report

> "All my traces are showing errors. Even the pads I've connected on the same net are showing a 0.2 mm clearance error. If there are two parts in a single continuous trace, it still shows a clearance error. Select one of the violating tracks or pads, then press Tab to extend the selection to connected copper. Sometimes a very small track segment will reside within a component pad and cause be the cause of a DRC violation."

## 4. Unrouted Nets DRC from Teardrop-Generated Zero-Width Regions

### Symptom

DRC reports unrouted nets that are visually routed correctly. Pressing Ctrl+H selects the whole net correctly, confirming the net is connected. The unrouted net errors appeared suddenly on nets that previously passed DRC. The errors are in multichannel designs and appear under the same tracks in every room.

### Root Cause

"I found there were regions with 0 width under the offending traces. Deleting these solved the issue, I'm not sure what created them, I think it might have been the teardrop generator as half of them were at T junctions." The teardrop generator or other automated tools create zero-width regions under tracks. These regions have the same net as the tracks but still cause unrouted net DRC violations. The regions are invisible in the normal view and can only be found through the PCB List panel.

### Fix

1. **Check PCB List for zero-width regions**:
   - "I found there were regions with 0 width under the offending traces"
   - Open the PCB List panel
   - Filter for Region objects
   - Look for regions with width = 0

2. **Delete zero-width regions**:
   - "Deleting these solved the issue"
   - Select the zero-width regions in the PCB List
   - Delete them
   - Re-run DRC to verify the violations are resolved

3. **Check at T junctions**:
   - "Half of them were at T junctions"
   - Zoom into T junctions where teardrops were added
   - Look for zero-width regions
   - Delete them

4. **Check in multichannel designs**:
   - "The regions showed up under the same tracks in every room"
   - In multichannel designs
   - Check all rooms for zero-width regions
   - They may appear in every room instance

5. **Remove teardrops and re-add**:
   - If the teardrop generator created the regions
   - Remove all teardrops
   - Check for and delete any remaining zero-width regions
   - Re-add teardrops with updated settings

6. **Use PCB List panel to find suspicious regions**:
   - "Solved by looking for suspicious Regions on PCB List"
   - Open PCB List panel
   - Filter for Region objects
   - Sort by width or area to find zero-width/zero-area regions

7. **Run Health Check Monitor**:
   - If using Altium 22 or later
   - Run the Health Check Monitor
   - Select "Zero Area Regions" check
   - Click "Fix Issues" to automatically delete them

### Community Report

> "I started getting really weird DRC errors saying I had unrouted nets which were previously passing DRC. I could also see that they were routed correctly and pressing ctrl+H would select the whole net correctly. I found there were regions with 0 width under the offending traces. Deleting these solved the issue. I think it might have been the teardrop generator as half of them were at T junctions. This is in Altium 17 btw."

## 5. Board Region Missing Stackup Causing DataModel Crash

### Symptom

Altium Designer crashes with "Altium.PCB.DataModel.dll" error when performing routing or polygon repour operations. The crash may have started after importing a board, modifying the layer stack, or creating a rigid-flex design. The board appears normal in the layout view but crashes on specific operations.

### Root Cause

"The root cause of the issue may be due to your board region not having a stackup defined." When a board is imported, modified, or when the layer stack is changed, the board region may lose its stackup reference. The DataModel DLL requires a valid stackup reference for all board regions. Without it, the DLL encounters a null reference during operations that access the layer stack (routing, polygon repour), causing the crash.

### Fix

1. **Set Selection Filter to All - On**:
   - "In the Properties panel, make sure that the Selection Filter is set to enable for All - On"
   - This ensures you can select all object types
   - Including board regions
   - Which may be filtered out by default

2. **Enable Multilayer in View Configurations**:
   - "Select the Panel tab (in the bottom right) » View Configurations"
   - "Scroll down to Other Layers"
   - "There should be an eye icon next to Multilayer"
   - "Make sure that it is not crossed out"

3. **Enter Board Planning Mode**:
   - "Enter Board Planning Mode by using View » Board Planning Mode (shortcut: press 1 key)"
   - This is the only mode where board regions can be selected
   - "At the bottom in the Active Layers bar, select the Multilayer layer to make it Active"

4. **Select and edit the Board Region**:
   - "You should be able to select the Board region"
   - "Double-click the board region to open the Board Region properties"
   - "Select the Layer Stack Drop-down"
   - "Make sure it is set to a Board Layer Stack"

5. **Check all board regions in rigid-flex**:
   - For rigid-flex designs with multiple regions
   - Check each region's stackup assignment
   - Each region must have a valid stackup
   - Any missing stackup can cause the crash

6. **Create a layer stack if none exists**:
   - If no layer stack is defined
   - Go to Design » Layer Stack Manager
   - Create and save a layer stack
   - Then assign it to the board region

7. **Restart and test after fix**:
   - After assigning the stackup
   - Save the PCBDoc
   - Restart Altium Designer
   - Test routing and polygon repour to verify the fix

### Community Report

> "The root cause of the issue may be due to your board region not having a stackup defined. Make sure that the Multilayer layer is enabled. Enter Board Planning Mode by using View » Board Planning Mode (shortcut: press 1 key). Double-click the board region to open the Board Region properties, and then select the Layer Stack Drop-down, make sure it is set to a Board Layer Stack."

## 6. Additional Altium Designer Issues

### Unrouted Net Correction Not Saving

**Issue**: "I correct it, and re-run the design rule check, and one of the nodes again has 'Unrouted net' problem, and the edited correction that I had just put in has somehow just not happened."
**Fix**: The track doesn't reach the center of the pad/via. Check the snap settings — ensure snap to pad center is enabled. Delete the track and re-route it. Save the project after each correction.

### DRC Clearance on Same-Net Parts

**Issue**: "If there are two parts in a single continuous trace, it still shows a clearance error."
**Fix**: Check for hidden track segments using Tab to extend selection. The segments may not be on the same net. Delete and re-route the connection. Check net assignments of all segments.

### Nothing Selects in Area with Snap Point

**Issue**: "Nothing would select in the area, yet there was a snap point that the cursor would go to, and which other nets would refuse to route through."
**Fix**: "Solved by looking for suspicious Regions on PCB List." There are hidden zero-width regions blocking routing. Find and delete them in the PCB List panel.

### Teardrop Generator Creating Regions at T Junctions

**Issue**: "I think it might have been the teardrop generator as half of them were at T junctions."
**Fix**: After running the teardrop generator, check for zero-width regions. Use PCB List panel to find and delete them. Consider using a different teardrop settings or version.

### Multichannel Design DRC Issues

**Issue**: "The regions showed up under the same tracks in every room" in multichannel designs.
**Fix**: Zero-width regions appear in all room instances. Check and clean all rooms. Use PCB List panel with room filter. Delete regions in all rooms.

### Clean All Nets Command Issues

**Issue**: "Could be something automated in my case, like the teardrop or clean all nets commands."
**Fix**: After running automated cleanup commands, check for zero-width regions. Run Health Check Monitor. Verify DRC passes after cleanup.

### DRC Shows Errors on Previously Passing Design

**Issue**: DRC errors appear on a design that previously passed all checks.
**Fix**: Check for recently added regions, teardrops, or polygon pours. Use PCB List panel to find zero-width/zero-area objects. Delete them and re-run DRC.

## Best Practices

1. **Always assign layer stack to board regions** — prevents DataModel.dll crash
2. **Run Health Check Monitor regularly** — catches zero-area regions automatically
3. **Use PCB List panel to find hidden objects** — filter by area/width to find zero-size regions
4. **Press Tab to extend selection** — reveals hidden track segments causing DRC errors
5. **Check for teardrop-generated regions** — especially at T junctions
6. **Enable all layers when debugging DRC** — hidden layers may contain violating objects
7. **Disable rules one at a time** — isolates which rule causes the violation
8. **Save after each DRC fix** — prevents losing corrections
9. **Check snap settings for unrouted nets** — ensure tracks reach pad centers
10. **Use PCB Rules And Violations panel** — for manual violation navigation and deletion
