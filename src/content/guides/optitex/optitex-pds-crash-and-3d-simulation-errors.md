---
title: "Optitex PDS Crash and 3D Simulation Errors"
excerpt: "Optitex PDS Crash and 3D Simulation Errors: symptoms, root causes, and step-by-step fixes, verified against Optitex Release Notes."
category: "troubleshooting"
softwareSlug: "optitex"
keyword: "Optitex PDS crash outer notch internal piece notch validation View Fabric cannot turn off pieces disappear 3DDI export NVIDIA settings GPU configuration stitches not visible 3D window stitching issue half piece stitch rebuild PDS crash bending field empty HQR texture missing validation bending value OAFF file load hangs PDS not logged O-Cloud Link authentication"
slug: "optitex-pds-crash-and-3d-simulation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
---

# Optitex PDS Crash and 3D Simulation Errors: PDS Crash with Outer Notch on Internal Piece from Notch Validation Bug Requiring Update to O26, View Fabric Cannot Be Turned Off and Pieces Disappear After 3DDI Export from NVIDIA Settings Requiring GPU Configuration, Stitches Not Visible in 3D Window from Stitching Issue on Half Piece Requiring Stitch Rebuild, PDS Crash When Bending Field Empty in HQR with Texture from Missing Validation Requiring Bending Value, and OAFF File Load Hangs PDS When Not Logged Into O-Cloud Link Requiring Authentication Before Load

Optitex's PDS notch handling, 3D display, stitch rendering, fabric parameters, and O-Cloud authentication produce errors from notch validation bugs, NVIDIA GPU misconfiguration, stitching issues, missing bending values, and authentication requirements. This guide covers the 5 most common Optitex problems with diagnostic steps and community-verified fixes from Optitex Release Notes and Help Documentation.

## 1. PDS Crash with Outer Notch on Internal Piece from Notch Validation Bug

### Symptom

PDS crashes when working with an outer notch on an internal piece. The crash occurs when adding, editing, or manipulating notches that are placed on internal pieces (pieces within the main pattern outline). The crash is immediate and no error message is displayed — PDS simply closes.

### Root Cause

The notch validation code in PDS doesn't properly handle notches placed on internal pieces. Internal pieces have different topology than external pieces — they're enclosed within the main piece boundary. The notch validation algorithm assumes the notch is on an external boundary, and when it encounters an internal piece boundary, it accesses invalid data, causing the crash. This is a code bug fixed in O/26.0.

### Fix

1. **Update to Optitex O/26.0**:
   - The fix is included in Optitex 26.0
   - Update to the latest version
   - This is the primary fix

2. **Avoid notches on internal pieces**:
   - Until the update is installed
   - Don't place outer notches on internal pieces
   - Use internal notches instead
   - Or place notches on the external boundary

3. **Move notch to external boundary**:
   - If a notch is needed at that location
   - Move it to the external piece boundary
   - External boundary notches don't trigger the crash
   - Adjust the pattern design accordingly

4. **Use internal notch type**:
   - Instead of outer notch
   - Use internal notch type
   - Internal notches may not trigger the validation bug
   - Check if the crash still occurs

5. **Save before notch operations**:
   - Save the PDS file before adding or editing notches
   - If PDS crashes, reopen the saved file
   - This prevents data loss
   - Enable auto-save in preferences

6. **Report to Optitex support**:
   - If the crash persists after update
   - Send the PDS file to Optitex support
   - Include the steps to reproduce
   - They can investigate further

### Community Report

> "PDS crash with outer notch on an internal piece. Fixed in O/26.0. The crash occurs when adding or manipulating outer notches placed on internal pieces within the pattern. The notch validation code doesn't properly handle internal piece boundaries, causing an immediate crash with no error message."

## 2. View Fabric Cannot Be Turned Off and Pieces Disappear After 3DDI Export from NVIDIA Settings

### Symptom

Two related issues: (1) View Fabric (pattern displayed on the desk) cannot be turned off, and 2D actions are hidden. (2) After exporting to 3DDI, all pieces disappear from the desk and only reopening the file brings them back. Both issues occur on systems with NVIDIA graphics cards.

### Root Cause

"If you encounter either: View Fabric cannot be turned off and 2D actions are hidden, or after exporting to 3DDI all pieces disappear from the desk — the solution is in the Nvidia settings." The NVIDIA graphics driver settings are misconfigured for Optitex. The GPU is handling the 2D rendering incorrectly, causing the View Fabric display to lock and pieces to disappear after 3DDI export. The NVIDIA control panel settings need to be adjusted for Optitex compatibility.

### Fix

1. **Configure NVIDIA Control Panel settings**:
   - Open NVIDIA Control Panel
   - Navigate to Manage 3D Settings > Program Settings
   - Add PDS.exe to the list
   - Set the preferred graphics processor to NVIDIA

2. **Set power management to maximum performance**:
   - In NVIDIA Control Panel
   - Set Power Management Mode to "Prefer maximum performance"
   - This prevents the GPU from throttling
   - Which can cause display issues

3. **Disable NVIDIA multi-display mode**:
   - If using multiple monitors
   - Disable multi-display mixed acceleration
   - This can interfere with Optitex rendering
   - Use single display mode

4. **Update NVIDIA driver**:
   - Download the latest NVIDIA driver
   - Perform a clean install (not express install)
   - This removes old settings that may conflict

5. **Check PDS is using the correct GPU**:
   - Ensure PDS shows the NVIDIA card
   - Not the Intel integrated graphics
   - If wrong, configure in NVIDIA Control Panel

6. **Reset NVIDIA 3D settings**:
   - In NVIDIA Control Panel
   - Click "Restore" to reset all 3D settings to default
   - Then reconfigure for Optitex
   - This removes any conflicting custom settings

7. **Disable antialiasing for PDS**:
   - In NVIDIA Control Panel > Program Settings > PDS
   - Set Antialiasing - Mode to "Off"
   - Or set to "Application-controlled"
   - Forced antialiasing can cause display issues

### Community Report

> "If you encounter either: View Fabric (pattern displayed on the desk) cannot be turned off and 2D actions are hidden. Or: After exporting to 3DDI, all pieces disappear from the desk and only reopening the file brings them back, the solution is in the Nvidia settings. Go to Help > About and verify the name of the graphic card. Make sure your graphic card is updated."

## 3. Stitches Not Visible in 3D Window from Stitching Issue on Half Piece

### Symptom

Stitches are not visible in the 3D Window. The stitches exist in the 2D pattern but don't appear in the 3D simulation. The issue occurs specifically with half pieces — stitching on half pieces results in different simulation behavior than full pieces.

### Root Cause

"Stitching issue resulting in different simulation on half piece. Stitches are not visible in 3D Window." The stitch rendering code doesn't properly handle stitches on half pieces. Half pieces are mirrored pieces — the stitch on one half should be mirrored to the other half. The 3D stitch rendering skips half-piece stitches because it doesn't resolve the mirror reference correctly. The stitching issue also causes different simulation behavior because the stitch forces aren't applied symmetrically.

### Fix

1. **Update to Optitex O/26.0**:
   - Both issues are fixed in version 26.0
   - Update to the latest version

2. **Use full pieces instead of half pieces**:
   - Until the update is installed
   - Don't use half pieces with stitches
   - Create full pieces instead
   - This avoids the mirror reference issue

3. **Add stitches to both halves manually**:
   - If half pieces must be used
   - Add stitches to both halves manually
   - Don't rely on mirror stitching
   - This ensures stitches are visible in 3D

4. **Check stitch properties**:
   - Verify stitch type is correct
   - Check stitch length and direction
   - Ensure stitches are not hidden in 3D settings
   - Toggle stitch visibility in 3D Window settings

5. **Rebuild stitches**:
   - Delete all stitches on the half piece
   - Recreate them from scratch
   - Sometimes the stitch data is corrupted
   - Rebuilding fixes the visibility issue

6. **Check 3D display settings**:
   - In the 3D Window
   - Check if stitches are set to visible
   - Toggle the stitch display option
   - Sometimes stitches are hidden by display settings

### Community Report

> "Stitching issue resulting in different simulation on half piece. Fixed in O/26.0. Stitches are not visible in 3D Window. Fixed in O/26.0. The stitch rendering code doesn't properly handle stitches on half pieces — the mirror reference isn't resolved correctly, causing stitches to be invisible in 3D and simulation to behave differently on half pieces."

## 4. PDS Crash When Bending Field Empty in HQR with Texture from Missing Validation

### Symptom

PDS crashes when the Bending field is empty in HQR (High Quality Rendering) if the material has a texture applied to it. The crash occurs when trying to render or simulate a material that has a texture but no bending value specified. The Bending field in the fabric properties is left empty.

### Root Cause

"PDS crashes when Bending field is empty in HQR if it has texture applied to it." The HQR rendering code expects a bending value when a texture is applied. The texture affects how the fabric bends, and without a bending value, the calculation produces undefined results. The code doesn't validate for empty bending values before processing, causing a null or undefined value to be used in the bending calculation, leading to the crash.

### Fix

1. **Always specify a bending value**:
   - When applying a texture to a material
   - Always set a value in the Bending field
   - Even if the value is a default (e.g., 0.1)
   - Never leave the Bending field empty

2. **Update to latest Optitex version**:
   - The crash is a validation bug
   - Later versions may add validation for empty bending values
   - Check the release notes for fixes
   - Update to the latest version

3. **Remove texture before clearing bending**:
   - If you need to clear the bending value
   - First remove the texture from the material
   - Then clear the bending field
   - This avoids the HQR crash

4. **Set bending to default value**:
   - Instead of leaving the field empty
   - Set it to the default bending value
   - Check the fabric library for typical values
   - Use 0.1 or similar as a placeholder

5. **Check fabric properties before HQR**:
   - Before running HQR
   - Verify all fabric properties are filled
   - Especially Bending, Tension, and Shear
   - Don't leave any fields empty

6. **Use a fabric template**:
   - Create a fabric template with all fields filled
   - Apply the template before adding textures
   - This ensures no fields are empty
   - Prevents the crash

### Community Report

> "PDS crashes when Bending field is empty in HQR if it has texture applied to it. The HQR rendering code expects a bending value when a texture is applied. Without a bending value, the calculation produces undefined results, causing a crash. Always specify a bending value when applying textures to materials."

## 5. OAFF File Load Hangs PDS When Not Logged Into O-Cloud Link

### Symptom

Loading an OAFF file (Optitex Avatar Framework) while not logged in to O-Cloud Link generates a "Busy" message and hangs PDS. The application becomes unresponsive and must be force-closed. The OAFF file never loads. The issue only occurs when not logged into O-Cloud Link.

### Root Cause

"Loading an oaff file (Optitex Avatar Framework) while not logged in to O-Cloud Link, generates 'Busy' message and hangs PDS." The OAFF file format requires O-Cloud Link authentication to load avatar framework data. When PDS tries to load an OAFF file without O-Cloud Link authentication, it sends a request to the cloud service. The request fails due to no authentication, but PDS doesn't handle the failure — it waits indefinitely for a response, showing "Busy" and hanging.

### Fix

1. **Log into O-Cloud Link before loading OAFF**:
   - Open O-Cloud Link
   - Log in with your Optitex account
   - Then load the OAFF file in PDS

2. **Check O-Cloud Link connection**:
   - Verify O-Cloud Link is running
   - Check the system tray for the O-Cloud Link icon
   - Ensure it shows "Connected" status
   - If not connected, troubleshoot the connection

3. **Force close and restart**:
   - If PDS is already hung
   - Force close PDS from Task Manager
   - Log into O-Cloud Link
   - Restart PDS and load the OAFF file

4. **Use offline avatar files**:
   - If O-Cloud Link is unavailable
   - Use offline avatar files instead of OAFF
   - Standard avatar files don't require cloud authentication
   - Check the avatar library for offline options

5. **Verify O-Cloud Link credentials**:
   - Ensure your O-Cloud Link credentials are valid
   - Check if your subscription is active
   - Contact Optitex support if login fails
   - The OAFF load requires valid authentication

6. **Check firewall and network**:
   - O-Cloud Link requires internet access
   - Check firewall settings
   - Ensure PDS and O-Cloud Link can access the internet
   - Network restrictions can prevent authentication

### Community Report

> "Loading an oaff file (Optitex Avatar Framework) while not logged in to O-Cloud Link, generates 'Busy' message and hangs PDS. Make sure you are logged in before attempting to load an oaff file. The OAFF file format requires O-Cloud Link authentication to load avatar framework data. When PDS tries to load without authentication, it waits indefinitely for a response."

## 6. Additional Optitex Issues

### GLB Export Error from Chinese Stitch Names

**Issue**: "GLB export error due to stitch name in Chinese."
**Fix**: Rename stitches to ASCII characters before GLB export. Update to O/24SP2 where this is fixed. Use English stitch names. Avoid non-ASCII characters in stitch names.

### PDS Slow After Using FDFX File

**Issue**: "PDS slow after using FDFX file."
**Fix**: Update to O/24SP2 where this is fixed. Close and reopen PDS. Clear temporary files. Use smaller FDFX files. Check system resources.

### Move Texture Tool Not Working on Converted Materials

**Issue**: "Move Texture tool is not working properly on the converted materials."
**Fix**: Update to latest version. Use original materials instead of converted ones. Reapply texture to the material. Check texture mapping settings.

### glTF Export Texture Not Applied

**Issue**: "glTF export texture is not applied to pieces."
**Fix**: Check texture settings before export. Verify texture file path. Ensure texture is embedded in the material. Update to latest version with glTF fixes.

### STL File Cannot Be Loaded

**Issue**: "STL file format cannot be loaded."
**Fix**: Use OBJ or FBX instead of STL. Check STL file for errors. Use MeshLab to repair STL. Import through 3D import wizard.

### GPU Simulation Limitations

**Issue**: "Only one instance of GPS can run GPU simulation. GPU simulation cannot be used if an instance of version O/22 is running."
**Fix**: Close all O/22 instances. Run only one GPU simulation at a time. Use CPU simulation for additional instances. Check GPU simulation requirements.

## Best Practices

1. **Update to Optitex O/26.0** — fixes notch crash, stitching issues, and stitch visibility
2. **Configure NVIDIA Control Panel for PDS** — fixes View Fabric and 3DDI export issues
3. **Verify GPU in Help > About** — ensures PDS uses the correct graphics card
4. **Keep NVIDIA drivers updated** — prevents display and rendering issues
5. **Always specify bending values when textures are applied** — prevents HQR crash
6. **Log into O-Cloud Link before loading OAFF files** — prevents PDS hang
7. **Use full pieces instead of half pieces for stitching** — avoids stitch visibility issues
8. **Use ASCII stitch names for GLB export** — prevents export errors
9. **Close O/22 instances before GPU simulation** — prevents GPU simulation conflicts
10. **Save before notch operations on internal pieces** — prevents data loss from crash
