---
title: "Land F/X Plant Manager Freeze and Cloud Data Import Crash: Plant Manager Freezes AutoCAD from Firewall Blocking Cloud Data Endpoint, Black Screen Lockup from NVIDIA Display Driver Conflict, Cloud Data Import Crash from Security Software Blocking landfx.com, Unhandled Exception in dcl-slideview-load ARX from Corrupted Block Files, and No Function Definition LOOKUP from September 2025 Update Bug"
excerpt: "Land F/X fails for 5 distinct reasons: Plant Manager freezes AutoCAD from firewall or security router blocking cloud data endpoint fixable by editing a plant first, black screen lockup from NVIDIA display driver conflict requiring driver version experimentation, cloud data import crash from security software blocking landfx.com requiring firewall exceptions, unhandled exception in dcl-slideview-load ARX from corrupted block or slide files, and No Function Definition LOOKUP error from September 2025 update requiring reinstall. We cover each with fixes from Land F/X support community."
category: "plant-manager-freeze-and-import-crash-errors"
softwareSlug: "land-fx"
keyword: "Land F/X Plant Manager freeze AutoCAD firewall cloud data endpoint black screen NVIDIA display driver cloud data import crash security software landfx.com unhandled exception dcl-slideview-load ARX No Function Definition LOOKUP September 2025"
slug: "land-fx-plant-manager-freeze-import-crash-errors-firewall-cloud-endpoint-nvidia-driver-security-software-dcl-slideview-arx-lookup-function"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.landfx.com/community/plant-manager-freezes-autocad-2021.html"
  - "https://www.landfx.com/kb/planting-issues/adding/4358-import-crash"
  - "https://www.landfx.com/kb/planting-issues/errors.html"
---

# Land F/X Plant Manager Freeze and Cloud Data Import Crash: Plant Manager Freezes AutoCAD from Firewall Blocking Cloud Data Endpoint, Black Screen Lockup from NVIDIA Display Driver Conflict, Cloud Data Import Crash from Security Software Blocking landfx.com, Unhandled Exception in dcl-slideview-load ARX from Corrupted Block Files, and No Function Definition LOOKUP from September 2025 Update Bug

Land F/X (landscape design plugin for AutoCAD) suffers from Plant Manager freezes, black screen lockups, cloud data import crashes, and ARX exceptions. This guide covers the 5 most common Land F/X problems with diagnostic steps and community-verified fixes from the Land F/X support community.

## 1. Plant Manager Freezes AutoCAD from Firewall Blocking Cloud Data

### Symptom

Every time the Plant Manager is opened and "New" is clicked, AutoCAD opens the dialog box to add a plant but freezes. Cannot close out or click away. No plants show up in the list. Must use Task Manager to end AutoCAD without saving. Happens at least once a day, typically the first time opening for the day.

### Root Cause

The Plant Manager makes multiple cloud data calls to the Land F/X plant database endpoint. A firewall, security router, or network policy blocks the request to the cloud endpoint, seeing it as a stray request to an unknown or untrusted location. AutoCAD freezes waiting for the blocked network response.

### Fix

1. **Edit a plant first before clicking New**:
   - Before clicking "New" for the first time, click "Edit" on an existing plant
   - Click the "Plant Data >" button — this accesses a web page from the plant database endpoint
   - Close the edit plant dialog
   - Then try clicking "New" — if it works, a network/security issue is confirmed

2. **Add firewall exceptions**:
   - Add landfx.com to the firewall whitelist
   - Add the Land F/X cloud data endpoint to trusted sites
   - Contact your IT administrator to add exceptions
   - Both landfx.com and your LandFX folder need exceptions

3. **Check security router settings**:
   - Office security routers may block unknown endpoints
   - Add landfx.com to the router's whitelist
   - Check if the router has deep packet inspection blocking the request

4. **Check proxy settings**:
   - If using a corporate proxy, add landfx.com to the proxy bypass list
   - AutoCAD and Land F/X need direct access to the cloud endpoint

5. **Test on a different network**:
   - Try on a mobile hotspot or home network
   - If it works on a different network, the office network is blocking it
   - Confirm with IT that landfx.com needs to be whitelisted

### Community Report

> "It is possible that you have a firewall, or security router, that is blocking the request, seeing it as a stray request to an unknown or un-trusted location. Before clicking New for the first time, instead Edit a plant, and click the 'Plant Data >' button. Then close the edit plant dialog, and try clicking New."

## 2. Black Screen Lockup from NVIDIA Display Driver Conflict

### Symptom

F/X CAD blacks out and locks up the entire computer when adding plants from the Plant Manager. The screen goes black and the computer becomes unresponsive. Graphics card driver is up to date.

### Root Cause

NVIDIA display driver conflict with Land F/X's plant block rendering. When Land F/X attempts to display plant blocks (which use slide images), the NVIDIA driver conflicts with the rendering pipeline, causing a black screen and system lockup.

### Fix

1. **Follow the Land F/X NVIDIA driver KB article**:
   - The fix is documented at landfx.com/kb/planting-issues/adding/7629-black-screen
   - The fix involves multiple steps, not just a driver update

2. **Try different NVIDIA driver versions**:
   - "It may take some experimentation with different driver versions"
   - The latest driver isn't always the best — try older versions
   - Try Studio drivers instead of Game Ready drivers (or vice versa)
   - NVIDIA's driver quality varies between versions

3. **Three distinct steps in the KB**:
   - "It is not a single correction — there are two other distinct steps mentioned beyond replacing the video driver"
   - Follow all steps in the KB article, not just the driver update
   - Each step addresses a different aspect of the conflict

4. **Change the graphics renderer in AutoCAD**:
   - AutoCAD has multiple graphics system options
   - Try switching between DirectX and OpenGL
   - Tools → Options → System → Graphics Performance
   - Turn off hardware acceleration as a test

5. **Submit a tech support ticket**:
   - If the KB steps don't resolve the issue
   - Land F/X can have a technician assist
   - "We have had this happen multiple times and have followed the steps each time. It does not help. Mostly it resolves itself after a day or so."

### Community Report

> "This is due to an issue with your Nvidia display drivers. It may take some experimentation with different driver versions, as the KB notes. Further, it is not a single correction, as there are two other distinct steps mentioned beyond replacing the video driver."

## 3. Cloud Data Import Crash from Security Software

### Symptom

When trying to import plants, concept plants, reference notes, details, or irrigation equipment from a project or template using Cloud Data, AutoCAD freezes or crashes. The office uses Cloud Data for plant and equipment information.

### Root Cause

Security software (antivirus, endpoint protection, or firewall) blocks Land F/X from carrying out the import. The cloud data import requires network access to landfx.com servers, which security software may block or quarantine.

### Fix

1. **Add security software exceptions**:
   - Add exceptions for both `landfx.com` (domain) and the LandFX folder (local path)
   - The LandFX folder is typically at `C:\LandFX\` or a custom location
   - You may need your IT administrator to complete these steps
   - Add exceptions in antivirus, firewall, and endpoint protection

2. **Temporarily disable security software**:
   - As a test, temporarily disable antivirus and firewall
   - Try the import — if it works, security software is the cause
   - Re-enable security software and add proper exceptions

3. **Reinstall F/X CAD if exceptions don't work**:
   - If security exceptions are already in place
   - Or if you've added them and CAD is still freezing
   - Uninstall and reinstall F/X CAD
   - This ensures a clean installation without security interference

4. **Check Windows Defender**:
   - Even if third-party antivirus is installed, Windows Defender may be active
   - Add landfx.com and the LandFX folder to Windows Defender exclusions
   - Settings → Update & Security → Windows Security → Virus & threat protection → Exclusions

5. **Check corporate endpoint protection**:
   - Corporate IT may have endpoint protection beyond standard antivirus
   - Policies may block cloud data access
   - Contact IT to whitelist landfx.com in the endpoint protection system

### Community Report

> "Your security software may be blocking our software from carrying out the import. Verify that your security software has exceptions for both landfx.com and your LandFX folder. If security exceptions are already in place, or if you've added them and CAD is still freezing, uninstall and reinstall F/X CAD."

## 4. Unhandled Exception in dcl-slideview-load ARX

### Error Message

"Unhandled Exception in dcl-slideview-load ARX"

### Symptom

When placing a plant, irrigation equipment, or a site object (such as a Reference Note or Lighting Fixture), the error "Unhandled Exception in dcl-slideview-load ARX" appears. The operation cannot complete.

### Root Cause

The ARX (AutoCAD Runtime Extension) module that handles slide view loading encounters corrupted or missing block/slide files. The dcl-slideview-load function tries to load a slide image for the plant/equipment block and fails with an unhandled exception.

### Fix

1. **Check for corrupted block files**:
   - Navigate to the LandFX folder (typically `C:\LandFX\`)
   - Check the block library folder for corrupted or missing files
   - Look for .dwg block files with 0 KB size or invalid format
   - Replace corrupted blocks from a backup

2. **Check for missing slide files**:
   - Land F/X uses slide files (.sld) for plant block previews
   - Missing or corrupted slide files cause the ARX exception
   - Regenerate slides using the Land F/X slide generation tool

3. **Reinstall the Land F/X block library**:
   - If blocks are corrupted, reinstall the Land F/X block library
   - This replaces all standard blocks and slides
   - Custom blocks may need to be recreated

4. **Check for invalid block references**:
   - The error can occur if a block reference points to a non-existent file
   - Use the Land F/X block manager to verify all block paths
   - Fix any broken references

5. **Update Land F/X**:
   - This error may be fixed in newer versions
   - Check for updates at landfx.com
   - Install the latest version and patch

6. **Check for network path issues**:
   - If the LandFX folder is on a network drive
   - Network interruptions can cause the ARX to fail loading slides
   - Ensure stable network connection to the LandFX folder

### Community Report

> "Error: 'Unhandled Exception in dcl-slideview-load ARX' — Placing a Plant, Irrigation Equipment, or a Site Object such as a Reference Note or Lighting Fixture."

## 5. No Function Definition LOOKUP from September 2025 Update

### Error Message

"Error: No Function Definition: LOOKUP"

### Symptom

When placing or regenerating a plant schedule (September 2025), the error "No Function Definition: LOOKUP" appears. This is a new error that started after a September 2025 update.

### Root Cause

A software update in September 2025 introduced a bug where the LOOKUP function is not properly defined. The function is called during plant schedule placement or regeneration but isn't available in the loaded AutoLISP/ARX environment.

### Fix

1. **Update to the latest Land F/X version**:
   - This is likely a bug introduced in a September 2025 update
   - Check for a patch or hotfix at landfx.com
   - Install the latest version

2. **Reinstall Land F/X**:
   - If updating doesn't fix it, perform a clean reinstall
   - Uninstall Land F/X completely
   - Delete the LandFX folder and AppData entries
   - Reinstall from the latest download

3. **Check AutoCAD version compatibility**:
   - The September 2025 update may not be compatible with your AutoCAD version
   - Verify supported AutoCAD versions on the Land F/X website
   - Use a compatible AutoCAD version

4. **Contact Land F/X support**:
   - This is a software bug, not a user error
   - Submit a tech support ticket
   - Include the error message and your Land F/X and AutoCAD versions
   - Land F/X typically fixes such bugs quickly

5. **Workaround — use an older schedule**:
   - If you have an existing schedule from before the update
   - Don't regenerate it — leave it as is
   - Create new schedules manually if needed
   - Wait for the fix before regenerating

### Community Report

> "Error: No Function Definition: LOOKUP (Placing or Regenerating a Plant Schedule, September 2025)"

## 6. Additional Land F/X Issues

### Automation Error — Description Not Provided

**Issue**: "Automation Error. Description was not provided" when running a Bloom Schedule.
**Fix**: Update Land F/X, check for corrupted project data, contact support if persistent.

### Unable to Read Plant List

**Issue**: "Unable to Read Plant List" when running a schedule.
**Fix**: Check project data integrity, verify the project is properly configured, reinstall Land F/X if needed.

### Bad Argument Type: ListP

**Issue**: "Error: Bad Argument Type: ListP" when running a schedule.
**Fix**: Check for corrupted data in the project, update Land F/X, contact support.

### AutoCAD Variable Settings Rejected: CLAYER

**Issue**: "AutoCAD Variable Settings Rejected: CLAYER" when running a schedule.
**Fix**: Check layer settings, ensure the CLAYER variable is set to a valid layer, reset AutoCAD variables.

### Error Loading Type Library/DLL

**Issue**: "Error Loading Type Library/DLL" when working with groundcovers or colorized plant symbols.
**Fix**: Reinstall Land F/X, check for missing DLLs in the LandFX folder, run as Administrator.

### Invalid Block or Missing File Error

**Issue**: "Gray Xs on block file icons" or "Invalid Block or Missing File Error" when placing plants with shared online folders.
**Fix**: Ensure the LandFX folder is accessible, check network paths, verify block files exist at the expected location.

## Best Practices

1. **Add landfx.com to firewall whitelist** — prevents Plant Manager freeze
2. **Edit a plant before clicking New** — tests cloud data connectivity
3. **Try different NVIDIA driver versions** — latest isn't always best for Land F/X
4. **Follow all steps in the black screen KB** — not just driver update
5. **Add security exceptions for landfx.com and LandFX folder** — prevents import crash
6. **Reinstall F/X CAD if exceptions don't work** — clean installation
7. **Check block files for corruption** — prevents dcl-slideview-load ARX exception
8. **Keep Land F/X updated** — bugs like LOOKUP are fixed in patches
9. **Use compatible AutoCAD versions** — check Land F/X compatibility list
10. **Submit tech support tickets for software bugs** — Land F/X support is responsive
