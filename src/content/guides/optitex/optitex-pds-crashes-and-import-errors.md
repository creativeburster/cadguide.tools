---
title: "Optitex PDS Crashes and Import Errors"
excerpt: "Optitex PDS Crashes and Import Errors: symptoms, root causes, and step-by-step fixes, verified against Optitex help center."
category: "troubleshooting"
softwareSlug: "optitex"
keyword: "Optitex PDS crash DXF ASTM import Lectra Gerber contour deformation HPGL PLT file corruption auto-save 3D texture graphics card GPU simulation stretchy O/Cloud Link oaff"
slug: "optitex-pds-crashes-and-import-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
---

# Optitex PDS Crashes and Import Errors: DXF and ASTM Import Crashes from Various Source Software, HPGL and PLT File Import Crash, PDS File Corruption and AutoSave Recovery, 3D Texture Problems from Graphics Card After Upgrade, and GPU Simulation Stretchy Results and O/Cloud Link Hang

Optitex PDS (Pattern Design Software) suffers from import crashes, file corruption, texture problems, and GPU simulation issues. This guide covers the 5 most common Optitex problems with diagnostic steps and community-verified fixes from the Optitex help center.

## 1. DXF and ASTM Import Crashes from Various Source Software

### Symptom

PDS crashes when importing DXF or ASTM files. The crash occurs with files created by specific source software: Lectra, Gerber 11, Elitron, or Siemens. Some imports don't crash but produce unacceptable contour deformation or incorrect piece import.

### Root Cause

Optitex PDS has import compatibility issues with DXF/ASTM files from various pattern-making software. Each source software exports DXF/ASTM slightly differently, and Optitex's import parser doesn't handle all variations correctly.

### Fix by Source Software

1. **Lectra-created ASTM files**:
   - PDS crashes during import of certain ASTM files created by Lectra
   - Update to the latest Optitex version — many import fixes are included in point releases
   - If the crash persists, export from Lectra in a different format (DXF instead of ASTM)

2. **Gerber 11-created ASTM files**:
   - PDS gets stuck or crashes when importing ASTM files from Gerber 11
   - Try exporting from Gerber in DXF format instead
   - Or use a different Gerber version for export

3. **Elitron-created DXF files**:
   - Incorrect piece import from DXF files created by Elitron
   - Check import settings — try different import options
   - Verify piece contours after import

4. **Siemens-created DXF files**:
   - Unacceptable contour deformation after import from DXF created in Siemens
   - The spline conversion from Siemens DXF may be incorrect
   - Try exporting from Siemens with different spline settings

5. **General DXF import issues**:
   - Incorrect DXF file import — check the DXF version compatibility
   - Incorrect import of splines from DXF format — convert splines to arcs in the source software
   - DXF file with text leads to crash — remove text from the DXF before importing
   - Auto-recognition of working units is incorrect when importing AAMA/ASTM — manually set the correct units

6. **"External Contours Only" option issues**:
   - ASTM Import: Wrong contour import when "External Contours Only" option is used
   - Don't use this option if it causes incorrect contours
   - Import without the option and filter contours manually

### Community Report

> "ASTM Import: PDS application crashes during import of certain ASTM files created by Lectra."

> "DXF Import: Inacceptable contour deformation during the import."

> "DXF Import: Incorrect import of splines from DXF format."

## 2. HPGL and PLT File Import Crash

### Symptom

PDS crashes when importing HPGL (.hpgl) or PLT (.plt) plot files. The crash occurs immediately upon attempting the import.

### Root Cause

Confirmed software bugs in the HPGL and PLT import parsers. The import routine encounters invalid data or unsupported commands in the plot files and crashes instead of handling the error gracefully.

### Fix

1. **Update Optitex** — these import bugs are fixed in newer versions:
   - "Importing of HPGL file leads to crash" — listed as fixed
   - "Importing PLT files leads to crash" — listed as fixed
   - Check the release notes for your version

2. **Convert the file format** — as a workaround:
   - Convert HPGL/PLT to DXF using a third-party converter
   - Import the DXF file instead
   - Several free HPGL-to-DXF converters are available online

3. **Check the HPGL/PLT file for corruption**:
   - Open the file in a text editor to verify it's valid
   - Check for truncated or malformed commands
   - Re-export from the source software if possible

4. **Simplify the plot file**:
   - Remove complex elements (curves, patterns)
   - Keep only basic geometry (lines, arcs)
   - Try importing the simplified version

5. **Import in batches** — if the file contains multiple pieces:
   - Split the file into smaller files with fewer pieces
   - Import each file separately
   - Combine in PDS after import

## 3. PDS File Corruption and AutoSave Recovery

### Symptom

PDS crashes while working on a pattern, and the current work is lost. The .pds file becomes corrupted and cannot be opened normally.

### Root Cause

PDS files can become corrupted from software crashes, power outages, or disk write errors. The file structure is damaged, preventing normal opening.

### Fix

1. **Open the auto-saved backup file**:
   - Go to File → File Utilities → Open Backup
   - This automatically opens the last file you worked on
   - The backup is created at regular intervals

2. **Configure auto-save settings**:
   - Go to Preferences → Save → AutoSave Backup File
   - Set the file name and location for auto-saved files
   - Configure the auto-save interval
   - The following values are stored in the .ini file

3. **Check the backup folder**:
   - The default backup location can be changed in Preferences
   - Look for .bak files in the same directory as the original file
   - Rename .bak to .pds and try opening

4. **Cannot import files when internals exceed 5000**:
   - Reduce the number of internal lines/pieces before importing
   - Split the file into smaller parts

5. **PDS crashes during export to Adobe Illustrator**:
   - This is a confirmed bug
   - Try exporting to a different format (DXF, PDF) as a workaround
   - Update to the latest Optitex version

6. **PDS crashes using the Build Piece tool**:
   - Confirmed bug — update Optitex
   - Workaround: use alternative tools to build the piece

7. **PDS crashes when Bending field is empty**:
   - Don't leave the Bending field empty — always enter a value
   - This is a confirmed bug that causes an immediate crash

### Community Report

> "My computer crashed while working on a pattern, how do I open the automatically saved file? Go to File > File Utilities > Open Backup. This automatically opens the last file you worked on."

## 4. 3D Texture Problems from Graphics Card After Upgrade

### Symptom

After upgrading Optitex version, 3D models have texture problems — white skin, missing textures, or incorrect rendering. The 3D model looked fine in the previous version.

### Root Cause

This is typically a graphics card issue. After upgrading Optitex, the new version may require different GPU settings or a newer graphics driver. The PDS may also be using the wrong graphics card (integrated instead of dedicated).

### Fix

1. **Check graphics card requirements**:
   - Verify the GPU meets Optitex minimum requirements
   - Check the Optitex documentation for supported GPUs

2. **Verify PDS is using the correct graphics card**:
   - Go to Help → About
   - Verify the name of the graphics card displayed
   - If the wrong card is shown (integrated instead of NVIDIA), fix it:
     - Go to NVIDIA Control Panel → 3D Settings → Manage 3D Settings
     - Add PDS program to Program Settings
     - Set the preferred graphics processor to "High-performance NVIDIA processor"

3. **Update graphics driver**:
   - Download the latest driver from the NVIDIA/AMD website
   - Perform a clean install (not just an update)
   - Restart the computer

4. **Check Graphic Adapter Information**:
   - Go to Help → About → Graphic Adapter Information
   - Verify the graphics card is properly detected
   - Check driver version and update if needed

5. **3D model has white skin** — specific causes:
   - PDS is using a model from another version (previous version not fully uninstalled)
   - Delete the old Optitex folder before installing the new version
   - Graphics driver is old — update from NVIDIA website
   - PDS is not running with the NVIDIA driver — fix in NVIDIA Control Panel

6. **Previous version not fully uninstalled**:
   - Uninstall the old version completely
   - Delete the Optitex folder manually
   - Install the new version fresh
   - Old model files can cause texture conflicts

### Community Report

> "This is most likely a graphic card issue. Check that your graphic card is within the minimum requirements. Check that PDS is using the correct graphic card. Go to Help > About and verify the name of the graphic card. Make sure your graphic card is updated."

> "This can occur if the user has a few different versions of PDS or if a previous version was uninstalled but the Optitex folder was not deleted."

## 5. GPU Simulation Stretchy Results and O/Cloud Link Hang

### Symptom

GPU simulation produces results that are too stretchy — garments deform more than expected. Additionally, loading an .oaff file (Optitex Avatar Framework) while not logged in to O/Cloud Link generates a "Server Busy" message and hangs PDS.

### Root Cause

1. **Stretchy GPU simulation**: The GPU simulation engine uses different solver parameters than CPU simulation. Some material properties and garment features may not translate correctly to GPU.

2. **O/Cloud Link hang**: The .oaff file format requires O/Cloud authentication. Loading without being logged in causes the application to hang waiting for server response.

### Fix for GPU Simulation Issues

1. **Known GPU simulation limitations**:
   - Simulation may be too stretchy
   - Pleats & Dart-Pleats may not simulate correctly
   - The floor is not available in GPU simulation
   - Only one instance of GPU simulation can run at a time

2. **GPU simulation cannot run with O/22 instances**:
   - Close all version O/22 instances to use GPU simulation
   - GPU simulation and O/22 are incompatible

3. **Compare CPU vs GPU results**:
   - Run the same simulation on CPU and GPU
   - If results differ significantly, use CPU for final simulation
   - Use GPU for quick previews only

4. **Send GPU simulation issues to support**:
   - Include a description with maximum details
   - Include error messages
   - Include PC and graphics specs
   - Include relevant style files
   - Include the log file: `PdsFitModuleLog.txt` under `C:\Users\Public\Optitex\Optitex 23\Logs\`

### Fix for O/Cloud Link Hang

1. **Log in to O/Cloud Link before loading .oaff files**:
   - This is the direct fix — log in first, then load

2. **If PDS hangs**:
   - Open Task Manager (Ctrl+Alt+Del)
   - End the PDS process
   - Restart PDS
   - Log in to O/Cloud Link first
   - Then load the .oaff file

3. **STL file format cannot be loaded**:
   - Use FBX or other supported formats instead
   - For 3D scanner objects, use OBJ or FBX

### Community Report

> "Loading an oaff file (Optitex Avatar Framework) while not logged in to O/Cloud Link, generates 'Server Busy' message and hangs PDS. Make sure you are logged in to O/Cloud Link before attempting to load an oaff file."

> "Simulation may be too stretchy. Pleats & Dart-Pleats — the floor is not available. Only one instance of GPS can run GPU simulation."

## 6. Additional Optitex Issues

### Stitching Issues

**Issue**: Stitching results in different simulation on half piece.
**Fix**: Update to O/26.0 — fixed. Check stitch placement and direction.

### Stitches Not Visible in 3D Window

**Issue**: Stitches are not visible in the 3D window.
**Fix**: Update to O/26.0 — fixed.

### PDS Crash with Outer Notch on Internal Piece

**Issue**: PDS crashes with an outer notch on an internal piece.
**Fix**: Update to O/26.0 — fixed.

### Variation Grading Inverted After Walk

**Issue**: Variation grading results are inverted after Walk operation.
**Fix**: Update to O/26.0 — fixed.

### Nest++2 and ++Pro Error Prevents Placing All Pieces

**Issue**: Nest++2 and ++Pro error does not allow placing all pieces.
**Fix**: Update to O/26.0 — fixed.

### Marker Hangs When Adding Specific Piece

**Issue**: Production Diagram: Marker hangs when adding a specific piece to board.
**Fix**: Update to O/26.0 — fixed.

## Best Practices

1. **Update Optitex regularly** — many import and crash bugs are fixed in point releases
2. **Convert HPGL/PLT to DXF** — avoids import crashes
3. **Remove text from DXF files before import** — text causes crashes
4. **Set auto-save in Preferences** — recover work after crashes via File Utilities > Open Backup
5. **Keep internals under 5000** — exceeding this prevents file import
6. **Verify PDS uses the correct GPU** — check Help > About for graphics card name
7. **Delete old Optitex folders before installing new versions** — prevents texture conflicts
8. **Log in to O/Cloud Link before loading .oaff files** — prevents "Server Busy" hang
9. **Use FBX instead of STL for 3D imports** — STL is not supported
10. **Don't leave Bending field empty** — causes immediate crash
