---
title: "Alphacam Nesting and Post Processor Errors: Subroutine Nesting Loses 90% of G-Code, .anc to .pgm Conversion Failure for Morbidelli Xilog, Post Processor Font Tracing Deviation from Open Contours, Accurite Millpwr Missing Post Processor, and Tool Direction Wrong Side from Incorrect Side Setting"
excerpt: "Alphacam fails for 5 distinct reasons: subroutine nesting instead of linear loses 90% of G-code with 004 address not found error, .anc files can't convert to Morbidelli .pgm requiring .xxl rename and WinXISO, post processor font tracing deviates from open contours and loops in geometry, Accurite Millpwr controller has no available post processor, and tool direction appears on wrong side requiring Tool Directions correction. We cover each with fixes from WOODWEB and CNCZone forums."
category: "nesting-and-post-processor-errors"
softwareSlug: "alphacam"
keyword: "Alphacam subroutine nesting linear G-code 004 address not found anc pgm Morbidelli Xilog WinXISO post processor font tracing open contour Accurite Millpwr tool direction wrong side"
slug: "alphacam-nesting-post-processor-errors-subroutine-linear-anc-pgm-morbidelli-xilog-font-tracing-accurite-tool-direction"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://woodweb.com/cgi-bin/forums/cnc.pl?read=872064"
  - "https://en.cncarena.com/forum/thread/261381-morbidelli-alphacam-help-please/"
  - "https://woodweb.com/knowledge_base/PostProcessor_Runs_Amuck.html"
---

# Alphacam Nesting and Post Processor Errors: Subroutine Nesting Loses 90% of G-Code, .anc to .pgm Conversion Failure for Morbidelli Xilog, Post Processor Font Tracing Deviation from Open Contours, Accurite Millpwr Missing Post Processor, and Tool Direction Wrong Side from Incorrect Side Setting

Alphacam's nesting, post processing, and tool direction features suffer from G-code loss, file conversion failures, and geometry-related toolpath deviations. This guide covers the 5 most common Alphacam problems with diagnostic steps and community-verified fixes from WOODWEB and CNCZone forums.

## 1. Subroutine Nesting Loses 90% of G-Code

### Symptom

When nesting 20 copies of the same part, the CNC machines a single copy fine but when nesting all 20, the post loses 90% of the code. The spindle starts, axes travel, but when lowering to machine the first hole, "004 address not found" is prompted. The rapid traverse Z height changes from "Z 25.1" to just "1". First piece appears as white geometry instead of color-coded toolpaths.

### Root Cause

The nesting mode is set to "subroutine" instead of "linear." Subroutine nesting uses subprogram calls (M98 P...) which the Fanuc controller can't resolve properly with this post processor. The post generates subroutine references that don't match the actual subprogram addresses.

### Fix

1. **Switch from subroutine to linear nesting**:
   - In the nesting menu, change the nesting type from "Subroutines" to "Linear"
   - Linear nesting outputs each part's G-code sequentially without subprogram calls
   - This is the direct fix — the user confirmed: "I have been erroneously using subroutines nesting instead of linear"

2. **Check the post processor's subroutine support**:
   - Not all post processors support subroutine nesting
   - If the controller doesn't support M98/M99 subprogram calls, use linear nesting
   - Contact the post processor developer for subroutine-compatible versions

3. **Verify G-code after posting**:
   - Open the posted G-code in a text editor
   - Check for M98 P#### subprogram calls
   - If subprograms are referenced but not defined, the post is generating invalid code
   - Switch to linear nesting and re-post

4. **Check tool change handling**:
   - With subroutine nesting, tool changes between subprograms can fail
   - The "004 address not found" error indicates a missing tool address
   - Linear nesting handles tool changes inline

### Community Report

> "I got it figured out through trial and error. I have been erroneously using subroutines nesting instead of linear."

> "When I nest a single copy, CNC machines it with no issues. When I nest all 20 it seems to forget about 90% of the code."

## 2. .anc to .pgm Conversion Failure for Morbidelli Xilog

### Symptom

Alphacam generates toolpaths correctly but can't output files in the format the Morbidelli machine requires. The only save option is .anc, but the machine needs .pgm files via Xilog. The translation from .anc through Xilog to the machine fails.

### Root Cause

The Alphacam post processor is not configured to output .xxl files or run WinXISO automatically. Morbidelli machines with Xilog require .xxl files that are converted to .pgm using WinXISO. The default post only outputs .anc files.

### Fix

1. **Rename .anc to .xxl and use WinXISO**:
   - Save the NC code as .anc
   - Rename the .anc file extension to .xxl
   - On the Morbidelli, select .xxl filetype and choose "copy program"
   - The machine converts .xxl to .pgm automatically

2. **Save as .txt and use WinXISO manually**:
   - When Alphacam asks to save NC code, select "Save as type: All Files (*.*)"
   - Use .xxl or .txt extension
   - Open WinXISO.exe and convert the .txt/.xxl to .pgm

3. **Modify the post processor to run WinXISO automatically**:
   - Add code to the post processor to call WinXISO after posting
   - The WinXISO.exe runs after NC code generation
   - Places the .pgm file in the output folder automatically
   - Example post processor code:
     ```
     // Call WinXISO after post processing
     EXEC("C:\Path\To\WinXISO.exe", $OUTPUT_FILE)
     ```

4. **Get the correct post processor**:
   - The "common" post processor for Morbidelli is not the correct one
   - Contact ICAMTEK or an authorized Alphacam post developer
   - They have the correct post that outputs .xxl directly

5. **Use the correct post for SCM/Morbidelli**:
   - Some SCM posts create .xxl and run WinXISO automatically
   - These are custom posts from SCM, not standard Alphacam posts
   - Contact SCM or the machine distributor for the correct post

### Community Report

> "You can just rename the .anc file to .xxl. Then on the Morbidelli select xxl filetype and choose copy program, name the program what you would like and it will be converted to a pgm file."

> "Save the .anc file as a .txt file and use WINXISO.exe to convert to .PGM."

## 3. Post Processor Font Tracing Deviation from Open Contours

### Symptom

Pocketing a text logo looks perfect in Alphacam simulation, but on the router the bit sporadically deviates from the interior of the pocket, creating notches along the perimeter. At one point, the bit traveled completely off the spoil board, causing a crash and program stop.

### Root Cause

The font geometry has open contours or loops — self-intersecting line/arc segments in the font outlines. The post processor processes these as valid geometry, but the machine controller interprets them differently, causing erratic tool movements. The problem is in the geometry, not the post or the machine.

### Fix

1. **Inspect the geometry at trouble points**:
   - Zoom in on the corners where erratic tool paths occur
   - Check for errant line or arc segments floating around
   - Look for crossing or self-intersecting elements

2. **Check for open contours**:
   - Alphacam may not check for open contours before setting toolpaths
   - Use the Join command to close open contours
   - Select all geometry and use Join to connect broken segments

3. **Modify the font geometry**:
   - Convert fonts to geometry before creating toolpaths
   - Explode the text to individual elements
   - Clean up self-intersecting curves
   - Use simpler fonts that produce cleaner geometry

4. **Check the Full Circle Threshold (FCT) parameter**:
   - Some controllers have an FCT parameter that determines when to complete arcs
   - If FCT is too large, the controller may misinterpret small arc moves
   - Change FCT to a very small number (0.0001) in the G-code
   - If this fixes the problem, modify the post to include this value

5. **Use EnRoute for font toolpaths** — as an alternative:
   - EnRoute checks for open contours before setting toolpaths
   - If Alphacam doesn't catch the geometry issues, use a different CAM tool for fonts

6. **Simplify the font**:
   - Use sans-serif fonts with simpler geometry
   - Avoid decorative fonts with complex curves
   - Convert all text to polylines before toolpath creation

### Community Report

> "Zoom up on the corners where you see the erratic tool paths and check to see if the geometry, better yet the elements that compose the geometry, cross over each other."

> "This is because of the font used and how the geometry is created from it. The geometry has open contours or loops that the post processes but the machine misinterprets."

## 4. Accurite Millpwr Missing Post Processor

### Symptom

Using Alphacam v2020.1.2007.137, need to post G-code to an Accurite Millpwr controller. No post processor is available for this controller.

### Root Cause

Alphacam doesn't ship with a post processor for the Accurite Millpwr controller. This is a less common controller, and post processors are typically developed for popular machines first.

### Fix

1. **Contact Alphacam support**:
   - Ask if they have a post processor for Accurite Millpwr
   - They may have an unofficial or beta post available

2. **Contact a post processor developer**:
   - Companies like ICAMTEK develop custom posts for Alphacam
   - They can create a post for any controller

3. **Modify an existing post**:
   - Start with a generic Fanuc or Haas post
   - Modify the output format to match Accurite Millpwr requirements
   - Test with simple parts first

4. **Use a generic G-code post**:
   - Many controllers accept standard Fanuc-style G-code
   - Try a generic Fanuc post and check if the Millpwr accepts it
   - Adjust specific codes (tool change, coolant, etc.) as needed

5. **Check the Accurite Millpwr documentation**:
   - Determine what G-code format the controller accepts
   - Compare with existing Alphacam post formats
   - Identify which post is closest and modify from there

## 5. Tool Direction Wrong Side from Incorrect Side Setting

### Symptom

The toolpath appears on the wrong side of the geometry. An outside profile toolpath appears inside the contour, or vice versa. The tool cuts on the wrong side of the line.

### Root Cause

The Tool Direction / Machining Side setting is incorrect for the operation. Alphacam allows setting the cutting side (left, right, or on the line), and the wrong setting produces a toolpath on the wrong side.

### Fix

1. **Open Tool Directions**:
   - Machine tab → Tool Directions
   - Select the geometry
   - Change the Side setting (Left / Right / On)

2. **Check direction arrows**:
   - Press Ctrl+G to show direction arrows
   - The arrow shows the cutting direction and side
   - The toolpath should be offset from geometry by the tool radius

3. **Verify the toolpath visually**:
   - After changing the side, the arrow updates immediately
   - The toolpath should be on the correct side of the geometry
   - For outside profiles, the toolpath should be outside the contour
   - For inside pockets, the toolpath should be inside the contour

4. **Check the operation's Machining Side setting**:
   - In the operation dialog, check the Machining Side dropdown
   - "Climb" vs "Conventional" affects the direction
   - "Outside" vs "Inside" affects which side of the geometry

5. **Use simulation to verify**:
   - Run Alphacam's built-in simulation
   - The simulation shows the tool moving along the toolpath
   - Catches direction errors visually before running on the machine

## 6. Additional Alphacam Issues

### DXF Import Geometry Issues

**Issue**: DXF files from AutoCAD import with non-circular geometry that needs joining.
**Fix**: Use Home → Input CAD, then join all non-circular geometry. Use Set Geometry Z levels for 3D work.

### Convert to .ard for Cabinet Vision Compatibility

**Issue**: Alphacam doesn't nest DXF files the same way as Cabinet Vision files.
**Fix**: Convert the DXF to an .ard file and process as if it were a CV file.

### Safe Z Height in Post Processor

**Issue**: Rapid moves (G0) to Z0 — the cutting surface — causing tool breakage.
**Fix**: Edit the post processor (.arp file) and set safe Z height above the workpiece (e.g., 25mm). Check for G0 moves to Z0 in the G-code before running.

## Best Practices

1. **Use linear nesting, not subroutine** — unless the controller supports M98/M99
2. **Rename .anc to .xxl for Morbidelli** — or modify the post to output .xxl directly
3. **Check font geometry for open contours** — before creating pocketing toolpaths
4. **Join all geometry after DXF import** — prevents open contour issues
5. **Show direction arrows (Ctrl+G)** — before creating operations
6. **Verify toolpath visually** — should be offset from geometry by tool radius
7. **Review G-code before running** — check for G0 moves to Z0
8. **Keep post processor backups** — save a copy before editing
9. **Test new posts on scrap material** — before production runs
10. **Use simulation** — catches direction errors before the machine
