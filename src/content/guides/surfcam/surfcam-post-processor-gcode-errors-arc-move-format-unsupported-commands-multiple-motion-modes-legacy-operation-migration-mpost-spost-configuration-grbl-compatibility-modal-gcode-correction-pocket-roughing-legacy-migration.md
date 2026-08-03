---
title: "SurfCAM Post Processor G-Code Errors, Arc Move Format Issues, Unsupported Commands, Multiple Motion Modes, and Legacy Operation Migration: M-Post and S-Post Configuration, Grbl Compatibility Fixes, Modal G-Code Correction, and Pocket Roughing Legacy Migration"
excerpt: "SurfCAM fails for 5 distinct reasons: post processor G-code errors from unsupported commands requiring M-Post or S-Post configuration, arc move format errors from missing I/J coordinates requiring post processor edit, unsupported G-code commands like G70 G40 G80 requiring post customization, multiple motion modes from duplicate G00 requiring G-code cleanup, and pocket roughing moved to legacy operations requiring migration to new strategies. We cover each with fixes from Carbide 3D Community and Hexagon documentation."
category: "post-processor-and-gcode-errors"
softwareSlug: "surfcam"
keyword: "SurfCAM post processor G-code errors M-Post S-Post configuration arc move format missing I/J coordinates unsupported commands G70 G40 G80 multiple motion modes duplicate G00 pocket roughing legacy operations migration Grbl compatibility modal G-code correction"
slug: "surfcam-post-processor-gcode-errors-arc-move-format-unsupported-commands-multiple-motion-modes-legacy-operation-migration-mpost-spost-configuration-grbl-compatibility-modal-gcode-correction-pocket-roughing-legacy-migration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://community.carbide3d.com/t/surfcam-post-processor-nomad/5975"
  - "https://hexagon.com/products/surfcam-post-processors"
  - "https://pmtechnologies.com/surfcam/surfcam-post-processors/"
---

# SurfCAM Post Processor G-Code Errors, Arc Move Format Issues, Unsupported Commands, Multiple Motion Modes, and Legacy Operation Migration: M-Post and S-Post Configuration, Grbl Compatibility Fixes, Modal G-Code Correction, and Pocket Roughing Legacy Migration

SurfCAM's post processor output, arc move formatting, G-code command compatibility, motion mode handling, and legacy operation migration produce errors from unsupported commands, missing arc coordinates, incompatible G-codes, duplicate motion modes, and deprecated operations. This guide covers the 5 most common SurfCAM problems with diagnostic steps and community-verified fixes from Carbide 3D Community and Hexagon documentation.

## 1. Post Processor G-Code Errors from Unsupported Commands

### Symptom

SurfCAM 2017 Traditional outputs G-code that produces errors on the target CNC machine. GRBL error 26 or error 32 appears depending on the post processor used. Every post processor option tried has at least 1 error in the code. The G-code will not run on the machine.

### Root Cause

SurfCAM Traditional's built-in post processors output G-code that includes commands not supported by all CNC controllers. The default posts include commands like G70 (inch units), G40 (cutter compensation cancel), G80 (cancel canned cycle), and program numbers (O0001) that GRBL-based controllers don't recognize. "SurfCAM 2017 Traditional does not seem to have many post processor options." The M-Post utility only lets you select from a list of existing posts — you can't create new ones from scratch. "Their support told me they have to make the post if it affects the motion of the tool."

### Fix

1. **Use M-Post to edit the header and footer**:
   - "From what I can see in MPost from SurfCAM, this lets me edit the header and footer of the gcode"
   - Open M-Post from SurfCAM
   - Select the closest post processor
   - Edit the header to remove unsupported commands
   - Edit the footer similarly

2. **Use S-Post for more complex customization**:
   - "S-POST has an easy-to-use generator module with dynamic menus, context sensitive help and a powerful Factory Interface Language (FIL) utility"
   - S-Post supports more complex post processing
   - Use the Option File Generator to create custom posts
   - No programming required for basic customization

3. **Remove unsupported G-code commands**:
   - Remove G70 (inch units) — use G21 (metric) instead
   - Remove G40 if not needed — or ensure it's supported
   - Remove G80 if not needed
   - Remove program numbers (O0001) for GRBL controllers

4. **Use a Mach3 post as a starting point**:
   - "There is supposed to be a Mach 3 post-processor at machsupport.com"
   - Download the Mach3 post for SurfCAM
   - Use as a base for customization
   - Mach3 posts are closer to GRBL compatibility

5. **Contact SurfCAM support for custom posts**:
   - "Their support told me they have to make the post if it affects the motion of the tool"
   - If the post change affects tool motion
   - SurfCAM support must create the post
   - Provide machine specs and controller details

6. **Use third-party post processors**:
   - "OmegaPost is a 3rd party, high performance CNC code generator"
   - "3DPost" is another third-party option
   - These support more complex machines
   - Contact CAMcad Technologies for OmegaPost

7. **Manually edit the output G-code**:
   - "Users can also make on-the-fly changes to M-Post NC code directly in any text editor"
   - Post the toolpath
   - Open the .NCC file in a text editor
   - Remove unsupported commands
   - Run on the machine

### Community Report

> "I am trying to get SurfCAM to output files for the Nomad, but am having a hard time finding the right post processor. Seems like every option I have tried has at least 1 error in the code. I am mostly getting grbl error 26 or 32. I am using SurfCAM 2017 Traditional which does not seem to have many post processor options. Their support told me they have to make the post if it affects the motion of the tool."

## 2. Arc Move Format Errors from Missing I/J Coordinates

### Symptom

G-code output from SurfCAM produces "bad arc format, No I/J" errors on the CNC controller. Arc moves (G02/G03) are missing required I and J coordinates. The error appears on specific arc lines where the I or J value is absent or incomplete. The controller stops at the arc move and won't continue.

### Root Cause

"I think my problem is mostly coming from arc moves because the plane of the move is not defined." SurfCAM's post processor may output arc moves without properly defining the arc plane (G17/G18/G19) or without complete I/J coordinates. GRBL requires all arc moves to have X/Y coordinates and I/J offsets. When SurfCAM outputs an arc with only I but no J (or vice versa), GRBL rejects it. Additionally, if the arc plane is not defined before the arc move, the controller doesn't know which plane to interpret the I/J values in.

### Fix

1. **Ensure arc plane is defined**:
   - "The plane of the move is not defined"
   - Add G17 (XY plane) before arc moves
   - Or ensure the post processor includes G17 in the header
   - This tells the controller which plane to use

2. **Ensure all arc moves have complete I/J**:
   - "G03 X0.2936 Y-0.5977 Z-0.0017 I-0.0125" — missing J
   - The post must output both I and J for every arc
   - Even if one is zero, output I0 or J0
   - Edit the post to always include both values

3. **Use the correct post for your controller**:
   - GRBL requires specific arc format
   - Use a GRBL-compatible post if available
   - Or modify the existing post
   - Test with simple arcs first

4. **Convert arcs to linear moves**:
   - If arc format issues persist
   - Configure the post to output linear moves (G01) instead of arcs
   - This increases file size but avoids arc format issues
   - Set the tolerance appropriately

5. **Check for modal arc mode issues**:
   - "G00 would cancel the flow on effect of the G02/G03"
   - After a G00 or G01 move, the arc mode (G02/G03) is canceled
   - The post must re-output G02 or G03 after any G00/G01
   - Check the post's modal handling

6. **Verify arc endpoints match**:
   - "The start and endpoints don't line up to the last decimal, and GRBL doesn't like that"
   - Ensure arc start and end points are precise
   - Rounding errors can cause arc failures
   - Use higher precision in the post

7. **Use R-format arcs instead of I/J**:
   - Some controllers prefer R (radius) format
   - Configure the post to use R instead of I/J
   - But note: GRBL may have issues with R format too
   - Test both formats

### Community Report

> "I think my problem is mostly coming from arc moves because the plane of the move is not defined. Error in line 13: bad arc format, No I/J. G03 X0.2936 Y-0.5977 Z-0.0017 I-0.0125. The start and endpoints don't line up to the last decimal, and GRBL doesn't like that."

## 3. Unsupported G-Code Commands Like G70 G40 G80

### Symptom

The G-code output from SurfCAM includes multiple G-codes on a single line that the CNC controller doesn't support. Error: "Unsupported G Code" on line 5: "G00 G17 G70 G40 G80 G90 M05". Removing G70 doesn't fix the error. The controller rejects the entire line.

### Root Cause

SurfCAM's default post processors output multiple G-codes on a single line in the header. Many controllers, especially GRBL-based ones, don't support multiple G-codes on the same line (only one modal group command per block). G70 (inch mode), G40 (cutter compensation cancel), and G80 (cancel canned cycle) are not supported by GRBL at all. Even after removing G70, the presence of G40 and G80 on the same line as other commands causes errors because GRBL can't parse multiple modal commands in one block.

### Fix

1. **Remove unsupported G-codes from the post**:
   - "After removing G70 G40 and G80, this error went away"
   - Edit the post header in M-Post
   - Remove G70 (use G21 for metric instead)
   - Remove G40 (not needed if no cutter compensation is used)
   - Remove G80 (not needed if no canned cycles are used)

2. **Split multiple G-codes to separate lines**:
   - "G00 G17 G70 G40 G80 G90 M05" — too many on one line
   - Put each G-code on its own line
   - Or at least separate different modal groups
   - GRBL accepts only one command per modal group per block

3. **Use metric mode (G21) instead of G70**:
   - G70 sets inch mode — not supported by GRBL
   - Use G21 (metric) instead
   - Or configure the post to output in the correct units
   - GRBL speaks metric natively

4. **Remove program number line**:
   - "O0001(INCAAA)" — not supported by GRBL
   - "Error in line 2: Syntax Error"
   - Remove the program number line from the post header
   - GRBL doesn't use program numbers

5. **Check for other unsupported codes**:
   - Review the full G-code output
   - Check each command against the controller's documentation
   - Remove or replace unsupported commands
   - Test incrementally

6. **Use a controller-specific post**:
   - If available, use a post designed for your controller
   - Check the Mach3 post as a starting point
   - Modify for GRBL compatibility
   - Or contact SurfCAM support

7. **Validate G-code before running**:
   - Use a G-code simulator/validator
   - Check for unsupported commands
   - Verify syntax
   - Test in simulation before running on the machine

### Community Report

> "Error in line 5: Unsupported G Code 5 G00 G17 G70 G40 G80 G90 M05. I tried removing G70 because it appears to be the only command in that line that is not supported. After removing G70 G40 and G80, this error went away. Not sure why the other commands produced errors."

## 4. Multiple Motion Modes from Duplicate G00

### Symptom

G-code output from SurfCAM produces "Multiple Motion Modes" errors. Error on line 8: "G00 G90 G00 X0.3509 Y-0.6102 S9000 M03". The line contains G00 twice — once as a safety block and once as the actual motion command. The controller rejects the line because it sees two motion mode commands.

### Root Cause

The SurfCAM post processor outputs G00 in both the safety block (G00 G90) and the actual motion line (G00 X0.3509 Y-0.6102). GRBL interprets the second G00 as a duplicate motion mode command, which is an error. While many controllers tolerate duplicate modal commands, GRBL is strict — it only accepts one motion mode per block. The post template has G00 in both the initialization block and the rapid move block, causing the duplication.

### Fix

1. **Remove duplicate G00 from the post**:
   - "Removed the second G00"
   - Edit the post template
   - Remove G00 from either the safety block or the motion block
   - Keep G00 only where the actual motion occurs

2. **Separate safety and motion blocks**:
   - Put G90 (absolute mode) on a separate line
   - Put G00 (rapid motion) only on the motion line
   - Don't combine safety codes with motion codes
   - This avoids duplicate modal commands

3. **Check the post template for duplicates**:
   - Open the post in M-Post
   - Review the rapid move template
   - Look for G00 in multiple places
   - Remove duplicates

4. **Use modal G-code correctly**:
   - G00 is modal — it stays in effect until changed
   - Don't need to repeat G00 on every rapid line
   - Only output G00 when switching from G01/G02/G03
   - This reduces file size and avoids errors

5. **Test the modified post**:
   - After removing duplicates
   - Post a test toolpath
   - Verify no "Multiple Motion Modes" errors
   - Run in simulation before the machine

6. **Check for other duplicate commands**:
   - Review the entire G-code output
   - Look for other duplicate modal commands
   - Remove all duplicates
   - Validate with a G-code checker

### Community Report

> "Error on Line 8: Multiple Motion Modes 8 G00 G90 G00 X0.3509 Y-0.6102 S9000 M03. Removed the second G00."

## 5. Pocket Roughing Moved to Legacy Operations in SurfCAM 2025.1

### Symptom

After updating to SurfCAM 2025.1, the Pocket Roughing operation is no longer in the standard operation list. It has been moved to "Legacy Operations." Users who previously used Pocket Roughing can't find it in the new interface. Existing toolpaths using Pocket Roughing still work but can't be created new from the standard menu.

### Root Cause

"Pocket Roughing / Moved to Legacy Operations" is listed as a change in SurfCAM 2025.1. Hexagon has reorganized the operation types, moving older strategies to a Legacy category. Pocket Roughing has been superseded by newer, more efficient roughing strategies. The operation is still available for backward compatibility but is no longer the recommended approach. This is part of SurfCAM 2025.1's focus on "core users' needs for general and advanced usage."

### Fix

1. **Find Pocket Roughing in Legacy Operations**:
   - "Pocket Roughing / Moved to Legacy Operations"
   - Look in the Legacy Operations category
   - The operation is still available
   - But not in the standard menu

2. **Migrate to the new roughing strategy**:
   - Use the newer roughing operations
   - These are more efficient
   - Better toolpath quality
   - Supported with future updates

3. **Use the Migration Tool**:
   - "Migration Tool update" is in SurfCAM 2025.1
   - Use the migration tool to convert old operations
   - To the new equivalent strategies
   - Preserves parameters where possible

4. **Keep existing Pocket Roughing toolpaths**:
   - Existing toolpaths still work
   - Don't need to be converted immediately
   - But can't create new Pocket Roughing from standard menu
   - Plan migration for new projects

5. **Review the 2025.1 release notes**:
   - Check what other operations moved to Legacy
   - Plan migration for all affected operations
   - Update templates and macros
   - Train users on new strategies

6. **Use the updated Tool Library**:
   - "Updated Tool Library (SQL Database)" in 2025.1
   - "Tool Library Application update – Delete/Remove"
   - Set up tools in the new SQL database
   - Use with new operations

7. **Check NCSIMUL Essential update**:
   - "NCSIMUL Essential update" in 2025.1
   - Use for verification of new toolpaths
   - Simulate before running on machine
   - Verify migrated operations

### Community Report

> "SurfCAM 2025.1 release highlights include: Pocket Roughing / Moved to Legacy Operations, Migration Tool update, Tool Library Application update, Updated Tool Library (SQL Database), NCSIMUL Essential update, Solidworks 2025 support, EditNC Version 13.0.1, CAM Engine updates, Bug Fixes."

## 6. Additional SurfCAM Issues

### EditNC Version Update

**Issue**: EditNC updated to version 13.0.1 in SurfCAM 2025.1.
**Fix**: Use the updated EditNC for G-code editing. New features and bug fixes. Check compatibility with existing workflows.

### SolidWorks 2025 Support

**Issue**: SurfCAM 2025.1 adds SolidWorks 2025 support.
**Fix**: Update SurfCAM to 2025.1 for SolidWorks 2025 compatibility. Check translator updates. Verify file import/export.

### Mask Setting Saved in SCPRT File

**Issue**: "Mask Setting saved in SCPRT file" — new in 2025.1.
**Fix**: Mask settings are now saved with the project. No need to reconfigure masks. Check compatibility with older project files.

### Layers Duplicate Index Check

**Issue**: "Layers – Check for duplicate index number" — new in 2025.1.
**Fix**: SurfCAM now checks for duplicate layer index numbers. Fix any duplicates in existing files. Use the Layers dialog RMB for Expand/Collapse.

### Fixture Stock Tree View

**Issue**: "Operation Manager – Fixture stock supports Tree view layout" — new in 2025.1.
**Fix**: Use tree view for fixture stock management. Better organization of complex setups. Check compatibility with existing setups.

### Operation Manager Recent Comment List

**Issue**: "Operation Manager – Recent comment list / Ability to Edit" — new in 2025.1.
**Fix**: Use the recent comment list for quick access. Edit comments directly. Improves workflow for recurring comments.

## Best Practices

1. **Use S-Post for complex post customization** — more powerful than M-Post
2. **Remove unsupported G-codes for GRBL controllers** — G70, G40, G80, program numbers
3. **Ensure all arc moves have complete I/J coordinates** — prevents "bad arc format" errors
4. **Define the arc plane (G17) before arc moves** — prevents plane ambiguity
5. **Don't output duplicate motion mode commands** — one G00 per block
6. **Use metric output for GRBL controllers** — GRBL speaks metric natively
7. **Migrate Pocket Roughing to new strategies in 2025.1** — it's now a Legacy operation
8. **Use the Migration Tool for updating old projects** — converts operations to new strategies
9. **Validate G-code before running on machine** — use a G-code simulator
10. **Contact SurfCAM support for custom posts** — especially if tool motion is affected
