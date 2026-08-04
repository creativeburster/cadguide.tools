---
title: "KiCad Altium Importer and PCB Design Workflow Errors: Altium Importer Assigns Tracks to Non-Existent In8.Cu Layer from Missing Power Plane Mapping Requiring Manual kicad_pcb Edit, Schematic PCB Link Lost After Separate Import Requiring Update PCB from Schematic with Re-link Footprints, Silkscreen Text Size and Position Wrong from Importer Requiring Manual Correction, Zero-Sized TH Pads Created for SMD Pads Causing Plane Voids Requiring Python Script Cleanup, and Missing Footprint Library Linkage Causing DRC Warnings Requiring Export to Library"
excerpt: "KiCad fails for 5 distinct reasons: Altium importer assigns tracks to non-existent In8.Cu layer from missing power plane mapping requiring manual kicad_pcb edit, schematic PCB link lost after separate import requiring Update PCB from Schematic with Re-link footprints, silkscreen text size and position wrong from importer requiring manual correction, zero-sized TH pads created for SMD pads causing plane voids requiring Python script cleanup, and missing footprint library linkage causing DRC warnings requiring Export to Library. We cover each with fixes from KiCad.info Forums."
category: "workflow"
softwareSlug: "kicad"
keyword: "KiCad Altium importer non-existent In8.Cu layer missing power plane mapping kicad_pcb edit schematic PCB link lost separate import Update PCB from Schematic re-link footprints silkscreen text size position wrong importer zero-sized TH pads SMD pads plane voids Python script missing footprint library linkage DRC warnings export to library"
slug: "kicad-altium-importer-pcb-workflow-errors-in8cu-non-existent-power-plane-mapping-schematic-pcb-link-lost-update-pcb-relink-silkscreen-text-size-position-zero-sized-th-pads-smd"
author: "CADGuide Tools Editorial Team"
readTime: "13 min"
date: "2025-07-31"
sources:
  - "https://forum.kicad.info/t/altium-importer-importing-to-non-existent-layer/62895"
  - "https://forum.kicad.info/t/creating-project-from-existing-altium-files/58571"
  - "https://forum.kicad.info/t/strange-behaviour-when-importing-pcb-from-altium/65917"
---

# KiCad Altium Importer and PCB Design Workflow Errors: Altium Importer Assigns Tracks to Non-Existent In8.Cu Layer from Missing Power Plane Mapping Requiring Manual kicad_pcb Edit, Schematic PCB Link Lost After Separate Import Requiring Update PCB from Schematic with Re-link Footprints, Silkscreen Text Size and Position Wrong from Importer Requiring Manual Correction, Zero-Sized TH Pads Created for SMD Pads Causing Plane Voids Requiring Python Script Cleanup, and Missing Footprint Library Linkage Causing DRC Warnings Requiring Export to Library

KiCad's Altium importer, schematic-PCB linkage, silkscreen handling, and pad conversion produce errors from layer mapping, separate import limitations, and conversion artifacts. This guide covers the 5 most common KiCad problems with diagnostic steps and community-verified fixes from KiCad.info Forums.

## 1. Altium Importer Assigns Tracks to Non-Existent In8.Cu Layer

### Symptom

Importing a complex 8-layer Altium design into KiCad 9.03. Using both automatic and manual layer assignment, some tracks and zones end up assigned to In8.Cu — a layer that doesn't exist on an 8-layer board (only F, B, and In.1 through In.6). In8.Cu is not listed in the layer pane. DRC violations occur from zones on the non-existent layer. Searching the .kicad_pcb file shows In8.Cu appears 355 times.

### Root Cause

Altium distinguishes between signal layers and power plane layers. KiCad doesn't make this distinction. When the Altium importer encounters a power plane (e.g., Pwr2) that it can't find in the layer list, it creates a new layer (In8.Cu) for the missing plane's geometry. The importer found the missing copper layer during import but assigned it to a non-existent KiCad layer instead of mapping it to the correct existing layer.

### Fix

1. **Check layer assignment in the import dialog**:
   - "I reimported the Altium file using the automatic layer assignment dialog"
   - "I carefully checked the layer assignment that the importer picked"
   - "It was missing a copper layer called Pwr2"
   - "Missing was In4.Cu which it couldn't find a match for but obviously should have been Pwr2"
   - Always verify all layers are mapped before completing import

2. **Edit the .kicad_pcb file directly**:
   - "I pulled the .kicad_pcb file into a text editor"
   - "In8.Cu is not listed as one of the layers at the beginning of the file"
   - "When I search for it, it appears 355 times"
   - "I did a global find and replace changing the In8.Cu fields to In4.Cu"
   - "I opened the file by launching the pcb editor from the manager and everything is there"
   - Back up the file before editing
   - Use a text editor with find-and-replace

3. **Identify which Altium layer maps to the missing KiCad layer**:
   - "I can see Pwr2 in my Altium Reader software, but it doesn't appear in the list of Altium layers that KiCad found"
   - "It found the other 7 copper layers and matched those just fine"
   - Use Altium Reader or Altium Designer to identify all layers
   - Map missing layers manually in the import dialog

4. **File a bug report**:
   - "Definitely report this as a bug. You can create an issue on Gitlab quickly via KiCad > Help > Report a bug"
   - "If you mark the issue as confidential, only the core dev team will be able to see it"
   - Provide both the Altium source and KiCad converted files
   - This helps improve the importer

5. **Use nightly builds for improved layer mapping**:
   - "In the nightly KiCad you can select which Altium layers you want to put to which KiCad layer"
   - "This is the corresponding feature request which was implemented, but only for KiCad nightly, not 8.0.x"
   - Use nightly builds for better layer assignment control
   - Check if the feature is in the stable release

6. **Verify all zones after import**:
   - "When I launch Zone Manager there are zones in In.8"
   - "These zones don't appear anywhere when I cycle through the layers"
   - Check Zone Manager for zones on non-existent layers
   - Reassign zones to correct layers

### Community Report

> "I imported a complex 8-layer Altium design into KiCad 9.03. I ended up with a few tracks and zones assigned to In.8. It's an 8-layer board so there is no In.8. In8.Cu is not listed in the layer pane but when I search for it in the .kicad_pcb file, it appears 355 times. I did a global find and replace changing In8.Cu to In4.Cu and everything is there now."

## 2. Schematic PCB Link Lost After Separate Import

### Symptom

Importing an Altium project into KiCad. The schematic imports successfully, and the PCB imports separately. But after import, the schematic symbols and PCB footprints are not linked. DRC shows many errors. The schematic and PCB don't synchronize when changes are made.

### Root Cause

KiCad imports the Altium schematic and PCB as separate operations, not as a project. When imported separately, KiCad loses the connection between schematic symbols and PCB footprints. The reference designators match, but the internal UUIDs don't link. This is a fundamental limitation of the Altium import process — it doesn't import the Altium project file (.PrjPcb).

### Fix

1. **Use Update PCB from Schematic with Re-link**:
   - "The normal method is to use Update PCB from Schematic [F8] with the option: Re-link footprints to schematic symbols based on their reference designators"
   - Open the schematic editor
   - Press F8 (or Tools > Update PCB from Schematic)
   - Check "Re-link footprints to schematic symbols based on their reference designators"
   - Click Update PCB

2. **Import schematic and PCB separately, then link**:
   - "You import the schematic and the PCB separately, and not the 'project'"
   - "As a result, KiCad loses the connection between schematic symbols and footprints on the PCB"
   - After importing both, use the Re-link option
   - This re-establishes the symbol-footprint connection

3. **Set grid to mil before import**:
   - "The grid was set to metric in the schematic editor, and that does not work in KiCad"
   - "So I set the grid to mill, and those grid warnings went away"
   - Altium designs often use mil grid
   - Set KiCad grid to mil before importing

4. **Align elements to grid after import**:
   - "I attempted to fix the grid issue by selecting everything and executing Align Elements to grid"
   - "That did not work this time"
   - Set grid to mil first, then align elements
   - This fixes most grid warnings

5. **Run multiple rounds of Update PCB/Schematic**:
   - "I did a few rounds of Update PCB from Schematic [F8] and Update Schematic from PCB"
   - "Also exported the footprints to Library_2.pretty, updated the schematic with those links"
   - "And exported the symbols to Library_2.pretty/Library_2.kicad_sym"
   - Multiple rounds may be needed to resolve all links

6. **Start from scratch for complex designs**:
   - "I think tomorrow, I'll start from scratch, because there's still over 4-500 warnings and maybe 50-60 errors left in DRC"
   - For complex Altium designs with many custom components
   - It may be faster to recreate the design in KiCad
   - Use the Altium design as reference only

### Community Report

> "You import the schematic and the PCB separately, and not the 'project'. As a result, KiCad loses the connection between schematic symbols and footprints. The normal method is to use Update PCB from Schematic [F8] with the option: Re-link footprints to schematic symbols based on their reference designators."

## 3. Silkscreen Text Size and Position Wrong from Importer

### Symptom

After importing an Altium PCB into KiCad, silkscreen text is approximately double the expected size. Text positions are wrong — designators (R1, R5) are in incorrect locations. Bottom layer silkscreen information is merged into the top layer. Text imported as 'KiCad Font' has the size/position issue, but text in Arial appears fine.

### Root Cause

The Altium importer doesn't correctly convert Altium text properties to KiCad text properties. Altium and KiCad use different text sizing models (point size vs. stroke width). The importer may double the text size during conversion. Bottom silkscreen layer mapping may be incorrect, causing bottom text to appear on the top layer. The 'KiCad Font' text type has a conversion bug that Arial text doesn't have.

### Fix

1. **Manually correct text size and position**:
   - "The text size, position and layering issue is still present"
   - "Not only is the text too large (approx double size) but it is in the wrong position"
   - Select each text element
   - Edit properties: reduce size by ~50%, reposition

2. **Use Arial font instead of KiCad Font**:
   - "Text imported as 'KiCad Font' has this issue, the text in Arial seems fine"
   - In Altium, use Arial font for silkscreen text
   - This avoids the KiCad Font conversion bug
   - If already imported, change font to Arial in KiCad

3. **Check and fix layer assignment**:
   - "KiCad is merging some silk screen info from the bottom layer into the top"
   - Select text that should be on the bottom silkscreen
   - Change layer to B.SilkS (or B.Silkscreen)
   - Verify all silkscreen text is on the correct layer

4. **Use nightly builds for improved import**:
   - "Some things have recently changed with Altium import, yes"
   - "It's a fairly new feature, but in its original version did not support as many things as it does today"
   - Nightly builds may have improved text import
   - Check if the fix is in the latest stable release

5. **Report the bug with test project**:
   - "The two problems you mentioned are not ones that the team is currently aware of"
   - "It would be helpful if you could report a bug with the Altium file attached"
   - "You can mark it as confidential if needed"
   - Create a minimal test project that reproduces the issue

6. **Replace imported text with native KiCad text**:
   - "If this was my project, my next step would be to replace most of the symbols and footprints with native KiCad parts"
   - "That would fix most of the font and silkscreen issues"
   - Delete imported silkscreen text
   - Re-create with KiCad's native text tools

### Community Report

> "The text size, position and layering issue is still present. Not only is the text too large (approx double size) but it is in the wrong position. Text imported as 'KiCad Font' has this issue, the text in Arial seems fine. KiCad is merging some silk screen info from the bottom layer into the top."

## 4. Zero-Sized TH Pads Created for SMD Pads Causing Plane Voids

### Symptom

After importing an Altium PCB into KiCad, all SMD pads on the top and bottom layers generate empty spaces in the inner power planes. The SMD pads appear as through-hole pads in the plane rendering. Setting the pad properties back to SMD doesn't fix the issue — planes still regenerate with voids around SMD pads.

### Root Cause

The Altium importer creates a 0mm through-hole pad for each SMD pad during conversion. These zero-sized TH pads are not visible in the normal pad properties but are present in the .kicad_pcb file. The plane generator treats these as through-hole pads and creates voids around them in all copper layers, even though the SMD pads should only affect their own layer.

### Fix

1. **Delete zero-sized TH pads with Python script**:
   - "When importing the project from Altium, KiCad created a 0mm TH pad for each SMD pad"
   - "I deleted all the TH 0mm pads with a Python script directly from the layout file"
   - "And the problem was solved"
   - Write a Python script to parse the .kicad_pcb file
   - Remove all pads with drill size 0 and type through-hole

2. **Python script example**:
   ```python
   import re
   with open('board.kicad_pcb', 'r') as f:
       content = f.read()
   # Remove zero-sized TH pads
   content = re.sub(r'\(pad "" thru_hole circle \(at [^\)]+\) \(size 0\) \(drill 0\)[^\)]*\)', '', content)
   with open('board_fixed.kicad_pcb', 'w') as f:
       f.write(content)
   ```

3. **Check for "Invalid zero-sized pad pinned to 1um"**:
   - "The problem seems to be related to multiple 'Invalid zero-sized pad pinned to 1um' created by the importer tool"
   - Check the DRC messages for this warning
   - These are the problematic zero-sized pads
   - Delete them from the file

4. **Regenerate planes after cleanup**:
   - After removing the zero-sized TH pads
   - Open the PCB in KiCad
   - Run Tools > Reannotate or Edit > Edit Tracks and Vias > Regenerate planes
   - The voids around SMD pads should disappear

5. **Use KiCad 9.0+ for improved import**:
   - "Bug fixes to the Altium importer are very frequent"
   - "Application: KiCad x64 on x64, Version: 9.0.7-rc1"
   - Update to the latest KiCad version
   - The zero-sized pad bug may be fixed

6. **Report the bug**:
   - "Always provide your exact KiCad version and OS"
   - "Bug fixes to the Altium importer are very frequent"
   - Report with the Altium source file
   - Mark as confidential if needed

### Community Report

> "When importing the project from Altium, KiCad created a 0mm TH pad for each SMD pad. I deleted all the TH 0mm pads with a Python script directly from the layout file, and the problem was solved. The problem seems to be related to multiple 'Invalid zero-sized pad pinned to 1um' created by the importer tool."

## 5. Missing Footprint Library Linkage Causing DRC Warnings

### Symptom

After importing an Altium project, DRC gives warnings: "Footprint 'XXX' does not match copy in library 'Library_2'." This occurs for nearly all footprints. The footprints were exported to a library, the schematic was updated with links, but DRC still shows warnings. Hundreds of warnings and 50-60 errors remain.

### Root Cause

The Altium importer creates footprints in the PCB but doesn't properly link them to a KiCad library. Even after exporting footprints to a .pretty library and updating schematic links, the internal UUIDs don't match between the PCB footprints and the library copies. KiCad's DRC checks for consistency between the PCB footprint and the library copy, and the UUID mismatch causes warnings.

### Fix

1. **Export footprints to a library**:
   - "Exported the footprints to Library_2.pretty"
   - "Updated the schematic with those links"
   - In the PCB editor: File > Export > Footprints to Library
   - Create a new library for the imported footprints

2. **Export symbols to a library**:
   - "Exported the symbols to Library_2.pretty/Library_2.kicad_sym"
   - In the schematic editor: File > Export > Symbols to Library
   - Create a new symbol library

3. **Update schematic with library links**:
   - After exporting both footprints and symbols
   - Update the schematic to use the new library references
   - Use Tools > Edit Symbol Fields to update library links
   - Ensure all symbols point to the new library

4. **Replace imported parts with native KiCad parts**:
   - "If this was my project, my next step would be to replace most of the symbols and footprints with native KiCad parts"
   - "That would fix most of the font and silkscreen issues"
   - "The project has to be checked anyway"
   - Replace custom parts with KiCad's built-in library equivalents

5. **Accept remaining warnings after verification**:
   - "I also noticed a bunch of issues related to text and overlapping silkscreen"
   - "KiCad is a bit annoying in that regard"
   - After replacing parts and fixing silkscreen
   - Remaining warnings may be acceptable
   - Verify each warning is not a real design issue

6. **Start from scratch for complex designs**:
   - "I am close to giving up on this, and start from scratch"
   - "There's still over 4-500 warnings and maybe 50-60 errors left in DRC"
   - "I am feeling that I am losing control over all the changes"
   - For complex designs, recreating in KiCad may be faster
   - Use the Altium design as a reference

7. **Use Altium consultant for critical projects**:
   - "Honestly, at one low point, I thought of putting the job out to an Altium consultant"
   - For time-critical projects with complex Altium imports
   - Consider hiring a consultant with Altium + KiCad experience
   - This may be more cost-effective than struggling with import issues

### Community Report

> "I did a few rounds of Update PCB from Schematic [F8] and Update Schematic from PCB, exported the footprints to Library_2.pretty, updated the schematic with those links, and exported the symbols to Library_2.kicad_sym. But after that DRC still gives: Warning: Footprint 'XXX' does not match copy in library 'Library_2'. And it does so for nearly all footprints."

## 6. Additional KiCad Issues

### Missing Altium Layers Mapped to Eco1_User

**Issue**: Altium layers 71 and 72 have no KiCad equivalent and are moved to Eco1_User.
**Fix**: "In the nightly KiCad you can select which Altium layers you want to put to which KiCad layer." Use nightly builds for custom layer mapping. In stable, manually move objects from Eco1_User to appropriate layers.

### Grid Set to Metric in Schematic

**Issue**: "The grid was set to metric in the schematic editor, and that does not work in KiCad."
**Fix**: "Set the grid to mill, and those grid warnings went away." Altium designs often use mil grid. Set KiCad grid to mil before and after import.

### Mounting Hole Creation

**Issue**: "In Altium I can just drop a pad, turn off plating, done. In KiCad, not sure how to do other than go back to schematic and place one there, then push to layout."
**Fix**: In KiCad, place a Mounting Hole footprint from the library. Or create a pad with plating off in the footprint editor. Add the mounting hole in the schematic first for proper annotation.

### Designator Auto-Placement

**Issue**: "When I rotate the component, the designator stays in the same spot in Altium. In KiCad it seems to rotate around and wind up upside down."
**Fix**: KiCad's designator auto-placement is less sophisticated than Altium's. Use the "Position Designators" script or manually place designators after component placement. Some users wrote custom scripts for this.

### 3D Body Generation in Footprint

**Issue**: "In Altium, they have the worlds simplest and most limited 3D generation tool that did 80% of what I needed. In KiCad, I've toiled with FreeCAD and it's frustratingly hard."
**Fix**: Use KiCad's 3D model import (STEP, WRL). Download 3D models from SnapMagic, UltraLibrarian, or manufacturer websites. For simple shapes, use FreeCAD with the KiCad StepUp plugin.

### Included Libraries Lack Footprint Linkage

**Issue**: "Drop a resistor onto the schematic, and then have to pick a footprint. KiCad has some great libraries, but included libraries seem to lack linkage to footprints."
**Fix**: KiCad separates symbols and footprints. After placing a symbol, assign a footprint using the "Assign Footprints" tool (CvPcb) or in the symbol properties. Use KiCad's library for standard footprints.

## Best Practices

1. **Verify all layer mappings in the import dialog** — especially power planes
2. **Edit .kicad_pcb file for non-existent layer assignments** — find and replace
3. **Use Re-link footprints option in Update PCB from Schematic** — restores symbol-footprint link
4. **Set grid to mil before importing Altium designs** — prevents grid warnings
5. **Run multiple rounds of Update PCB/Schematic** — resolves link issues
6. **Manually fix silkscreen text size and position** — importer doubles text size
7. **Use Arial font in Altium for cleaner import** — avoids KiCad Font conversion bug
8. **Delete zero-sized TH pads with Python script** — fixes plane voids around SMD pads
9. **Export footprints and symbols to libraries** — enables proper library linkage
10. **Consider starting from scratch for complex designs** — may be faster than fixing imports
