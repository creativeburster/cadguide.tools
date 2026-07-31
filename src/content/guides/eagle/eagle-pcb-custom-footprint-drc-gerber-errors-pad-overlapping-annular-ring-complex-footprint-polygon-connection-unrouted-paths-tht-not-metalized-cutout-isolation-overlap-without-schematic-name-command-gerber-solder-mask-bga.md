---
title: "Eagle PCB Custom Footprint DRC and Gerber Manufacturing Errors: Pad Overlapping from DRC Annular Ring Expanding Narrow Pads Beyond Design, Complex Footprint DRC Errors from Polygon Pad Connection Requiring Center Within Polygon Rule, DRC Connected Unrouted Paths from THT Pads Not Metalized Requiring Cutout Polygon Isolation, DRC Overlap Error from Board Layout Without Schematic Requiring Name Command to Unify Nets, and Gerber Solder Mask Vias Under BGA from Insufficient Mask Limit Causing Ball Suck-in"
excerpt: "Eagle PCB fails for 5 distinct reasons: pad overlapping from DRC annular ring expanding narrow pads beyond design requiring circular pads with smaller diameter, complex footprint DRC errors from polygon pad connection requiring center within polygon rule, DRC connected unrouted paths from THT pads not metalized requiring cutout polygon isolation, DRC overlap error from board layout without schematic requiring Name command to unify nets, and Gerber solder mask vias under BGA from insufficient mask limit causing ball suck-in. We cover each with fixes from Autodesk Eagle Forum and EDABoard."
category: "custom-footprint-drc-and-gerber-errors"
softwareSlug: "eagle"
keyword: "Eagle PCB pad overlapping DRC annular ring narrow pads circular smaller diameter complex footprint polygon pad connection center within polygon DRC connected unrouted paths THT pads not metalized cutout polygon isolation DRC overlap error without schematic Name command unify nets Gerber solder mask vias BGA ball suck-in mask limit"
slug: "eagle-pcb-custom-footprint-drc-gerber-errors-pad-overlapping-annular-ring-complex-footprint-polygon-connection-unrouted-paths-tht-not-metalized-cutout-isolation-overlap-without-schematic-name-command-gerber-solder-mask-bga"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://forums.autodesk.com/t5/eagle-forum/custom-part-footprint-error-pad-overlapping/td-p/8666322"
  - "https://forums.autodesk.com/t5/eagle-forum/what-is-the-quot-right-quot-way-to-do-complex-footprints/td-p/9419360"
  - "https://www.edaboard.com/threads/gerber-file-check-before-manufacturing.221644/"
---

# Eagle PCB Custom Footprint DRC and Gerber Manufacturing Errors: Pad Overlapping from DRC Annular Ring Expanding Narrow Pads Beyond Design, Complex Footprint DRC Errors from Polygon Pad Connection Requiring Center Within Polygon Rule, DRC Connected Unrouted Paths from THT Pads Not Metalized Requiring Cutout Polygon Isolation, DRC Overlap Error from Board Layout Without Schematic Requiring Name Command to Unify Nets, and Gerber Solder Mask Vias Under BGA from Insufficient Mask Limit Causing Ball Suck-in

Eagle PCB's custom footprint creation, DRC validation, and Gerber manufacturing produce errors from annular ring expansion, polygon connection rules, and solder mask settings. This guide covers the 5 most common Eagle PCB problems with diagnostic steps and community-verified fixes from Autodesk Eagle Forum and EDABoard.

## 1. Pad Overlapping from DRC Annular Ring Expansion

### Symptom

Custom part footprint in Eagle library shows 1mm gap between pads. When the part is added to a board, the pads appear to overlap — the pad size increases beyond what was specified in the library. The footprint looks correct in the library editor but wrong in the board editor.

### Root Cause

Eagle's DRC (Design Rule Check) imposes a minimum "restring" (annular ring) size around pad drill holes. If the library part specifies a pad with an annular ring smaller than the DRC minimum, the board editor automatically expands the pads to meet the DRC requirement. This expansion can cause pads to overlap, especially with elongated pads and close spacing.

### Fix

1. **Understand DRC annular ring rules**:
   - "Your library specifies a drill diameter and optionally a pad size"
   - "DRC imposes a minimum restring (annular ring) size"
   - "If your library part is designed to use a ring that is too narrow, the board editor will expand the pads to meet the DRC"

2. **Change pad shape to circular with smaller diameter**:
   - "I solved it by simply changing the shape of the pads to a circle with a smaller diameter"
   - Circular pads have smaller overall size than elongated pads
   - This prevents expansion from causing overlap

3. **Adjust DRC restring settings**:
   - In DRC > Restring tab, reduce minimum annular ring values
   - Check what your board house can fabricate
   - "Set high enough to ensure reliable fabrication but not too much higher"
   - Typical minimum: 0.15mm (6 mil) for standard PCBs

4. **Reduce elongation settings**:
   - "You are using elongated pads, which isn't helping here"
   - "You can adjust the amount of elongation in the DRC settings"
   - Reduce elongation to minimize pad expansion
   - Or switch to round pads entirely

5. **Design pads with adequate annular ring from the start**:
   - Set pad diameter = drill diameter + 2 × minimum restring
   - This prevents DRC from expanding the pads
   - Example: 0.8mm drill + 2 × 0.15mm restring = 1.1mm pad diameter

6. **Check board house capabilities**:
   - "Check what your board house can do"
   - Some board houses support smaller annular rings
   - Adjust DRC to match board house capabilities
   - Don't use pessimistic DRC settings if your board house can do better

### Community Report

> "The footprint uses a grid of 0.5mm with a 1mm gap between pads. But when I add this part in a new schematic, the pads are overlapping. The DRC imposes a minimum restring size — if your library part uses a ring too narrow, the board editor expands the pads. I solved it by changing the pads to a circle with a smaller diameter."

## 2. Complex Footprint DRC Errors from Polygon Pad Connection

### Symptom

Designing a footprint for a DC-DC converter (AOZ2261) with a funky pad layout. Standard pads plus polygons in the middle for heat dissipation. The polygon connections to pads generate DRC errors. Multiple pads share the same signal (VIN, LX, PGND) but routing to them creates excessive DRC errors.

### Root Cause

Eagle's DRC doesn't recognize polygon-to-pad connections unless the pad center lies within the polygon area. If the polygon merely touches the pad edge, the DRC reports overlap errors. Additionally, when multiple pads share the same signal, Eagle needs to know whether they are "any" (connect to one) or "all" (connect to all) — this affects airwire generation.

### Fix

1. **Ensure pad center is within the polygon**:
   - "A polygon in a signal layer is considered connected to a pad if the center of the pad lies within the area defined by the center lines of the polygon wires"
   - Extend the polygon so the pad center is inside it
   - Not just touching the pad edge

2. **Route connections in the footprint itself**:
   - "It may work if you route the VIN and LX connections in the footprint itself, not the board"
   - This creates internal connections that DRC recognizes
   - Reduces airwires on the board

3. **Set pad connection mode correctly**:
   - "Eagle allows you to define multiple pads being the same signal but then YOU have to tell it whether they are 'any' or 'all'"
   - **"any"**: connect to one pad only (e.g., switch pairs)
   - **"all"**: must connect to all pads (e.g., ground pins)
   - Check datasheet to determine correct mode

4. **Use arbitrary pad shapes**:
   - "Create arbitrary pad shapes by drawing a polygon around a pad"
   - "Or by drawing wires that have one end connected to the pad"
   - This creates custom pad shapes that DRC recognizes

5. **Accept remaining airwires for "all" mode pads**:
   - "It still doesn't quite understand that the pads and poly are the same signal, so there are still some airwires"
   - For "all" mode, airwires indicate required connections
   - Route these connections explicitly on the board
   - Approve any remaining DRC errors after verification

6. **Use Connect command in library**:
   - In the library device editor, use Connect to link pads to pins
   - This defines which pads share the same signal
   - The Connections dialog shows pin-to-pad mapping

### Community Report

> "I made the footprint with normal pads plus polygons in the middle. This gives a bunch of DRC errors. The key was that the pad center must lie within the polygon. It still doesn't understand that the pads and poly are the same signal — there are still some airwires. Eagle allows 'any' or 'all' mode for multiple pads sharing a signal."

## 3. DRC Connected Unrouted Paths from THT Pads Not Metalized

### Symptom

DRC reports no unrouted paths, but a GND connection is not actually connected. The device on the top layer can't be soldered at that layer because THT (Through-Hole Technology) pads are not metalized in this project. The prototype doesn't work because of the missing connection.

### Root Cause

Eagle's DRC assumes THT pads connect top and bottom layers through plating. If the board technology uses non-plated holes (no via metallization), the DRC still thinks the pads connect both layers. The actual board doesn't have this connection, creating a hidden open circuit that DRC can't detect.

### Fix

1. **Use cutout polygons to isolate bottom-layer pads**:
   - "Place a polygon defined as a cutout around each of those pins on the bottom layer"
   - "So that the plane being connected to them does not reach them"
   - This prevents the ground plane from connecting to non-metalized pads

2. **Create SMT pad with non-plated hole in library**:
   - "Create a round SMT pad and place a non-plated hole in it"
   - This tells Eagle the pad is surface-mount only
   - The hole doesn't connect top and bottom
   - May lead to DRC errors but accurately represents the board

3. **Manually verify all THT connections**:
   - Don't rely solely on DRC for non-standard board technologies
   - Check each THT pad for actual connectivity
   - Use a multimeter on the prototype to verify

4. **Inform DRC about non-plated holes**:
   - "It seems there is no way to inform DRC that some components can't connect top and bottom"
   - Eagle's DRC doesn't support non-plated THT pads natively
   - Use workarounds (cutout polygons, SMT pads with holes)

5. **Move cutout polygons with components**:
   - "When component is shifted to another place, it is necessary to remember to shift all related polygons"
   - Group the component and its cutout polygons
   - Use group move to keep them together

6. **Consider using SMT components instead**:
   - If board technology doesn't support plated holes
   - Use surface-mount versions of components
   - Avoids the THT metallization issue entirely

### Community Report

> "DRC claims there are no unrouted paths, but the GND connection is not actually connected because THT pads are not metalized. There is no way to inform DRC that some components can't connect top and bottom. The simple fix is to place a cutout polygon around each pin on the bottom layer."

## 4. DRC Overlap Error from Board Layout Without Schematic

### Symptom

Creating a coil PCB directly in Eagle's board editor without drawing a schematic first. Lines that should be connected are recognized as different nets, producing DRC overlap errors. The copper is physically connected but Eagle doesn't recognize the connection.

### Root Cause

Eagle expects board layouts to be created from schematics. When drawing directly in the board editor, each wire/trace is an independent net unless explicitly named. Overlapping wires with different net names produce DRC overlap errors, even if they're physically connected. The Name command is needed to assign the same net name to connected traces.

### Fix

1. **Use the NAME command to unify nets**:
   - "Using the NAME command is usually sufficient to rename the traces"
   - Select a trace, use NAME command (Edit > Name)
   - Give connected traces the same net name
   - This tells Eagle they are the same net

2. **Draw the schematic first (recommended)**:
   - "I think this error is caused by not doing the layout after drawing the schematic"
   - Create the schematic with proper net connections
   - Then switch to board layout
   - Eagle maintains net consistency between schematic and board

3. **Approve DRC errors if Gerber is correct**:
   - "Even though there is overlap error at DRC, when it is well connected at PCB Viewer, is it okay?"
   - "Yes it will be OK, so you can approve the errors and proceed"
   - Verify in Gerber viewer that connections are correct
   - Approve the DRC errors manually

4. **Use SIGNAL command to create named nets**:
   - In board editor, use SIGNAL command
   - This creates a named net and connects traces to it
   - Better than drawing individual wires

5. **Check with Gerber viewer**:
   - Export Gerber files
   - Open in GC-Prevue or other Gerber viewer
   - Verify that copper connections are correct
   - If Gerber is correct, DRC errors are false positives

6. **Best practice: always create schematic first**:
   - Schematic-driven design prevents net naming issues
   - Eagle maintains schematic-to-board synchronization
   - DRC validates both schematic and board
   - Avoids manual net naming errors

### Community Report

> "I am making a coil PCB using Eagle CAD. The lines I want to connect are recognized as different lines and I get an overlap DRC error. Using the NAME command is usually sufficient to rename the traces. Yes, it will be OK if well connected at PCB Viewer — you can approve the errors."

## 5. Gerber Solder Mask Vias Under BGA from Insufficient Mask Limit

### Symptom

Gerber files show solder mask openings for vias under a BGA (Ball Grid Array). The mask openings are too large, risking BGA balls being sucked into via holes during assembly. This is a manufacturing risk that can cause short circuits.

### Root Cause

Eagle's DRC Mask tab has a "Limit" value that determines which drill holes get solder mask. Any drill smaller than the Limit value gets solder mask. If the Limit is set too low, vias under the BGA don't get masked, leaving open holes that can suck in BGA solder balls during reflow.

### Fix

1. **Increase the Mask Limit in DRC**:
   - "If you want solder resist over your vias, increase the 'limit' value on the MASKS tab of the DRC"
   - "Any drill smaller than LIMIT will have solder resist"
   - Set Limit to cover via drills (e.g., 0.3mm or 0.4mm)
   - This applies solder mask to small vias

2. **Reduce solder mask enlargement**:
   - "Reduce solder mask openings to a size slightly larger than the drills"
   - "To achieve sufficient pad to via spacing, particularly under the BGA"
   - In DRC > Masks tab, reduce Solder Mask expansion
   - Typical: 0.05mm (2 mil) expansion

3. **Remove unconnected via and PTH pads on inner layers**:
   - "It's recommended to remove unconnected via and PTH pads on inner layers"
   - "If dynamic pad and vias are not supported by your tool, it can be done by the PCB manufacturer"
   - This reduces routing congestion under BGA

4. **Use blind/buried vias only when necessary**:
   - "It seems to me that the blind via option won't be strictly required for this design"
   - "There's plenty of room for standard vias"
   - Blind vias add significant cost
   - Use standard vias where possible

5. **Create a separate outline plot**:
   - "You would want to have a separate outline plot with your gerber file"
   - "But it can be extracted from the silk screen plots"
   - Include board outline in a separate Gerber layer
   - Some manufacturers require this

6. **Verify Gerber files before manufacturing**:
   - Use GC-Prevue (free) or other Gerber viewer
   - "Load the drill files as well as the Gerber files"
   - Check solder mask coverage on all vias
   - Verify BGA pad spacing and mask openings
   - "I have had a look at the Eagle files and there are no problems I can see"

7. **Use manufacturer's design rules**:
   - "You have obviously got the design rules from Sunstone"
   - Download DRC files from your board house
   - Import them into Eagle: File > Open > DRC
   - "When you load the design rules into your PCB, they stay there"

### Community Report

> "You have solder mask openings for vias. Reduce them to a size slightly larger than the drills to achieve sufficient pad to via spacing, particularly under the BGA. If you want solder resist over your vias, increase the 'limit' value on the MASKS tab of the DRC."

## 6. Additional Eagle PCB Issues

### Polygon Isolation Between Power Planes

**Issue**: Need more isolation between multiple power polygons on the same layer.
**Fix**: In DRC > Distance tab, increase "Polygon Isolate" value. Or edit individual polygon isolate values in the polygon properties. "I would have kept more than 5mil spacing between the polygons."

### Non-45 Degree Tracks

**Issue**: Routing looks untidy with non-45 degree tracks.
**Fix**: Use the Miter command to convert 90-degree corners to 45-degree angles. Set the wire bend style in the toolbar. "Some of the routing looks untidy but it is only aesthetic."

### Frame Around Schematic

**Issue**: Schematic lacks a frame with title, date, copyright, revision data.
**Fix**: "A frame around the schematic usually looks better and allows you to keep it to a certain size such as A3." Use the Frame library part. Add title block text fields.

### Splitting Schematic Into Multiple Pages

**Issue**: Need to split a large schematic into multiple pages.
**Fix**: "If you want to split into multiple pages with an existing circuit/layout, let me know and I will explain the method you must use to preserve the link between the schematic and layout." Use hierarchical sheets or multiple schematic sheets within the same project.

## Best Practices

1. **Design pads with adequate annular ring from the start** — prevents DRC expansion
2. **Ensure pad center lies within polygon for connection** — Eagle's connection rule
3. **Set pad connection mode (any vs all) correctly** — check datasheet
4. **Use cutout polygons for non-metalized THT pads** — prevents false connections
5. **Always create schematic before board layout** — prevents net naming errors
6. **Use NAME command to unify nets if layout without schematic** — manual fix
7. **Verify in Gerber viewer before manufacturing** — catches DRC false positives
8. **Increase Mask Limit for vias under BGA** — prevents ball suck-in
9. **Import board house DRC files** — ensures manufacturable design
10. **Use GC-Prevue for Gerber verification** — free and reliable
