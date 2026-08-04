---
title: "exocad DentalCAD Margin Line, Scan Import, and Model Creator Errors: Cutting Operation Failed from Incorrect Antagonist Type, 3Shape .3oxz Import XML Error from Format Change, iTero Margin Won't Snap from Mesh Holes, Model Creator Crash from Implant Library, and Bad Margin Line Detection from Intraoral Scan Quality"
excerpt: "exocad DentalCAD fails for 5 distinct reasons: cutting operation fails after margin line detection from incorrect scan orientation and antagonist type, 3Shape Trios .3oxz files show XML parsing error from format incompatibility, iTero scan margins won't snap from mesh holes requiring close holes in edit mesh, Model Creator crashes at scan body alignment from implant library bug, and bad margin lines from poor intraoral scan quality require manual drawing. We cover each with fixes from exocad wiki and Dental Lab Network."
category: "troubleshooting"
softwareSlug: "exocad"
keyword: "exocad DentalCAD cutting operation failed antagonist type 3Shape 3oxz XML import error iTero margin snap mesh holes Model Creator crash implant library bad margin line intraoral scan"
slug: "exocad-dentalcad-margin-scan-import-errors-cutting-operation-antagonist-3shape-3oxz-itero-mesh-holes-model-creator-implant-library"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://wiki.exocad.com/wiki/index.php/Troubleshooting_-_Preparation_margin_cutting_operation_failed"
  - "https://dentallabnetwork.com/forums/threads/error-when-trying-to-import-3xoz-3shape-trios-files-to-exocad.37178/"
  - "https://dentallabnetwork.com/forums/threads/itero-exocad-margin-problems.26109/"
---

# exocad DentalCAD Margin Line, Scan Import, and Model Creator Errors: Cutting Operation Failed from Incorrect Antagonist Type, 3Shape .3oxz Import XML Error from Format Change, iTero Margin Won't Snap from Mesh Holes, Model Creator Crash from Implant Library, and Bad Margin Line Detection from Intraoral Scan Quality

exocad DentalCAD is a leading dental CAD tool, but margin line detection failures, scan import incompatibilities, and Model Creator crashes block production. This guide covers the 5 most common exocad problems with diagnostic steps and community-verified fixes from the exocad wiki and Dental Lab Network forums.

## 1. Cutting Operation Failed from Incorrect Antagonist Type

### Error Messages

- "Cutting Operation Failed"
- "A problem occurred while processing scan data"
- Crown bottom / coping is created on the wrong side of the scan data (outside the preparation)

### Symptom

After margin line detection, the cutting operation fails. The coping is generated on the wrong side of the preparation — outside the tooth instead of inside.

### Root Cause

The scan data is oriented incorrectly. The "Antagonist Type" setting in DentalDB doesn't match how the scan data was actually aligned in 3D space by the scanner software. This is a scanner or scan software issue, not a bug in exocad.

### Fix

1. **Change the Antagonist Type in DentalDB**:
   - Open DentalDB
   - Change the "Antagonist Type" setting to match how the scan was actually performed
   - The setting determines how the scan data is interpreted in 3D space

2. **Don't change Antagonist Type after scanning**:
   - The scan data will still reflect the old antagonist type
   - Set the correct type before scanning

3. **For manual STL import (no scanner integration)**:
   - Use the "Adjust Scan Data" functionality at the beginning of the wizard
   - Rotate the view so you look on the preparations from the top
   - Click "Set current view..."
   - This correctly orients the scan data

4. **Contact scanner supplier** — if the scanner software has a bug:
   - The scanner software may not properly consider the Antagonist Type setting
   - This is typically a scanner software bug, not an exocad bug

### Community Report

> "The scan data is oriented incorrectly. The most common reason is that the scanner software has not properly considered the 'Antagonist type' setting in DentalDB."

## 2. 3Shape Trios .3oxz Import XML Error from Format Change

### Error Message

"Document's Errors XML (18, 16). Entry characters chain was not in correct format."

### Symptom

After a 3Shape Trios software update, .3oxz files can no longer be imported into exocad. The XML parsing error appears on every .3oxz import. STL and PLY files from Trios still work fine.

### Root Cause

3Shape changed something in the .3oxz format in a Trios update, making it incompatible with exocad's import parser. This is a format incompatibility, not a file corruption issue.

### Fix

1. **Import STL or PLY files instead**:
   - Export scans from Trios as STL or PLY
   - Import manually into exocad
   - You lose the convenience of automatic order creation, scan body merging, and bite scan import

2. **Create a new order and import manually**:
   - If margins are not marked in the .3oxz file, just create a new order in DentalDB
   - Import the STL/PLY files manually
   - Mark margins in exocad

3. **Wait for exocad update** — exocad typically updates their import parser to handle new 3Shape formats:
   - Check for exocad updates regularly
   - Report the issue to exocad support

4. **Use 3Shape's PLY export with texture**:
   - In 3Shape Dental Manager, export as PLY
   - Ensure the JPG texture file is in the same folder as the PLY
   - The PLY header should reference the texture file: `comment TextureFile Filename.jpg`
   - Import the PLY into exocad for color texture

5. **Avoid special characters in file names**:
   - 3Shape may corrupt file names with special characters (German umlauts, etc.)
   - Use only simple ASCII characters in OrderID and file names
   - Verify the PLY header with Notepad++ if texture doesn't load

### Community Report

> "Most likely, 3Shape changed something in their 3oxz format to make it incompatible, forcing Exo to play catch-up."

> "If the margins are not marked, just create a new order and import it manually."

## 3. iTero Margin Won't Snap from Mesh Holes

### Symptom

iTero intraoral scan imported into exocad — crown bottoms won't snap to the margin marked by iTero. Even correcting the margin manually doesn't fix it. The margin stays "goofy" and won't adapt to the preparation.

### Root Cause

The iTero scan has tiny holes in the mesh near the preparation margin. These holes prevent exocad's margin detection algorithm from properly snapping the crown bottom to the margin line. The holes are not visible in normal view but cause the margin algorithm to fail.

### Fix

1. **Close holes in the mesh before marking the margin**:
   - Before marking the margin, go to Expert mode
   - Right-click and select "Edit Mesh"
   - Circle the preparation area (or the entire prep including sulcus)
   - Select "Close Holes"
   - Return to the wizard and try the margin again

2. **Invert the mesh** — if the mesh orientation is wrong:
   - Expert mode → Right-click → Edit Mesh
   - Try inverting the mesh
   - This can fix cases where the mesh normals are flipped

3. **Save and reimport the iTero scan**:
   - Save the imported iTero scan as STL
   - Open the copied STL in exocad as a new case
   - Select the tooth number and crown type
   - Go through the orientation step carefully
   - This sometimes resolves the margin issue

4. **Look for fragmented data**:
   - Sometimes fragmented mesh data corrupts the margin detection
   - Use the Divide tool to isolate the preparation tooth
   - Close holes on the isolated preparation
   - Try margin detection on the isolated mesh

5. **Check if the preparation is still attached to the model**:
   - When the prep is still attached to the rest of the model, margin detection often fails
   - When the prep is floating separately (as some scanners export it), it usually works
   - Use the Divide tool to separate the prep from the model

### Community Report

> "The problem appears to be holes in scan mesh. Tiny holes near the preparation. Save the imported iTero scan as STL. Open in exocad, select Expert mode, Right-click, select Edit Mesh. Select area on prep, select Close Holes. The mesh should now be ready for marking margins."

> "When I open the scans in Exocad, the cases I have problems with always have the prep still attached to the rest of the model. The cases that work well have the crown floating in space with no attaching to the rest of the model."

## 4. Model Creator Crash from Implant Library

### Symptom

Model Creator crashes at the scan body alignment step for implant cases. The screen turns transparent white and gives the option to "wait for the program to respond" or "close the program." Using the "Hiossen ET-TI" implant library.

### Root Cause

The implant library has a bug or incompatibility with the current version of exocad. The scan body alignment algorithm encounters invalid data from the library and crashes.

### Fix

1. **Contact exocad support**:
   - The crash may be a library issue
   - If so, you'll need to contact the implant manufacturer (e.g., Hiossen) to report the bug
   - Exocad support can help determine if it's a software or library issue

2. **Try a different implant library version**:
   - Download a different version of the Hiossen ET-TI library
   - Or try a compatible generic library
   - Test if the crash still occurs

3. **Check for library inconsistencies**:
   - ExoPlan may show an "Inconsistencies of imported library" error
   - This indicates the library file is corrupt or incompatible
   - Re-download the library from the manufacturer

4. **Update exocad**:
   - Check for the latest exocad version
   - Library compatibility issues are often fixed in updates

5. **Use a different scan body**:
   - If possible, use a different scan body that has a compatible library
   - This is a workaround, not a fix

### Community Report

> "Every time I try to use the model creator for the implant it does not go past the scan body alignment. It ends up loading, then the screen turns to a transparent white and gives me an option to either 'wait for the program to respond' or to 'close the program.'"

> "Contact your exocad support — though it may end up a library issue. If so, you'll need to contact Hiossen to report a bug."

## 5. Bad Margin Line Detection from Poor Intraoral Scan Quality

### Symptom

Exocad cannot automatically detect the margin line on cases with poor preparation quality — unclear margins, undercuts, or poor scan quality from intraoral scanners. The automatic margin detection fails or produces an incorrect line.

### Root Cause

The automatic margin detection algorithm uses mathematical geometry analysis — it's not actually analyzing the clinical quality of the preparation. On bad scans or poorly prepared teeth, the algorithm cannot find a clear margin line.

### Fix

1. **Draw the margin manually**:
   - Use Correct/Draw → Draw → Magnetic or Free
   - Free drawing is preferred for difficult cases
   - You have full control over the margin line placement

2. **Adjust lighting to see the margin better**:
   - Go to Tools → adjust the lighting
   - Different lighting angles can reveal the margin on bad scans
   - Look from the underside of the prep — sometimes helpful

3. **Use color/texture scans**:
   - Import PLY files with color texture
   - Color helps distinguish tooth from gingiva
   - Use texture, geometry, and shadows to see finer details

4. **Divide the mesh to isolate the tooth**:
   - Use the Divide tool to segment the preparation tooth
   - This makes it easier to see and mark the margin
   - Doesn't affect Model Creator as long as meshes are close

5. **Understand the "lights off" feature**:
   - After setting insertion direction, exocad "turns the lights off"
   - This is not a bug — it indicates where undercuts start
   - Use this information to verify your insertion direction

6. **Check for holes and folds**:
   - Bad scans often have mesh holes and folds
   - Close holes in Expert mode before marking the margin
   - This improves both automatic and manual margin detection

### Community Report

> "It's simply using math to detect what could be the margin, it's not actually analyzing anything. You have to correct it, and you can either keep clicking points hoping to train the software, or use the Correct/Draw button to draw your own margin."

> "I find looking from the underside of the prep to be helpful sometimes."

## 6. Additional exocad Issues

### PLY Texture File Not Loading

**Issue**: PLY file imported from 3Shape has no color texture.
**Fix**: Ensure the JPG texture file is in the same folder as the PLY. Check the PLY header with Notepad++ for `comment TextureFile Filename.jpg`. Avoid special characters in file names.

### Internal Line to Edge Conversion Not Working

**Issue**: The "convert internal line to edge" function doesn't work — the internal line is greyed out.
**Fix**: Update exocad — this was fixed in version 2022.2.

### Snapshot File Name with Dot Not Read

**Issue**: Snapshots that include a dot in the file name are not read properly and appear empty.
**Fix**: Don't use dots in snapshot file names. Use underscores instead.

### Metadata Lost When Updating Group Material via API

**Issue**: Metadata is sometimes lost when updating group material via the API.
**Fix**: Update exocad — this was fixed in recent versions. Check API documentation for proper metadata handling.

## Best Practices

1. **Set the correct Antagonist Type before scanning** — prevents cutting operation failures
2. **Use "Adjust Scan Data" for manual STL imports** — orient the view from top and set current view
3. **Import STL/PLY instead of .3oxz after 3Shape updates** — avoids XML format incompatibility
4. **Close mesh holes before marking margins** — especially for iTero scans
5. **Draw margins manually on bad scans** — don't rely on automatic detection
6. **Use the Divide tool to isolate the preparation** — makes margin marking easier
7. **Check PLY header for texture file reference** — ensures color texture loads
8. **Avoid special characters in file names** — prevents import problems
9. **Contact exocad support for Model Creator crashes** — may be an implant library bug
10. **Use color/texture scans for better margin visibility** — PLY with JPG texture
