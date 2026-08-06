---
title: "InfraWorks 2026 Stuck on Initializing from Autodesk License Service"
excerpt: "InfraWorks 2026 Stuck on Initializing from Autodesk License Service: symptoms, root causes, and step-by-step fixes, verified against Autodesk Community."
category: "deployment"
softwareSlug: "infraworks"
keyword: "InfraWorks 2026 stuck Initializing Autodesk License Service Civil 3D DWG import cannot connect data sources corridor import coordinate system mismatch missing leading Y coordinate DWG re-import Windows Security OneDrive IMX Schema Version faulty installation"
slug: "infraworks-2026-stuck-on-initializing-from-autodesk-license-service"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forums.autodesk.com/t5/infraworks-forum/unable-to-run-infraworks-2026/td-p/13699197"
  - "https://forums.autodesk.com/t5/infraworks-forum/infraworks-2025-civil-dwg-import-error/td-p/13074219"
  - "https://forums.autodesk.com/t5/infraworks-forum/civil3d-corridor-to-infraworks/td-p/14121269"
---

# InfraWorks 2026 Stuck on Initializing from Autodesk License Service, Civil 3D DWG Import Cannot Connect to Data Sources from Missing Civil 3D Background Process, Corridor Import Failure from Coordinate System Mismatch with Missing Leading Y Coordinate, DWG Re-import Failure from Windows Security Network Blocking and OneDrive Path, and IMX Schema Version Error from Faulty Civil 3D Installation: License Service Downgrade, Civil 3D Reinstall, Coordinate Verification, Windows Security Exclusion, and IMX Export Workaround

InfraWorks produces errors from license service issues, Civil 3D DWG import failures, coordinate mismatches, security blocking, and IMX schema errors. This guide covers the 5 most common InfraWorks problems with diagnostic steps and community-verified fixes from Autodesk Community.

## 1. InfraWorks 2026 Stuck on Initializing from Autodesk License Service

### Symptom

InfraWorks 2026 gets stuck on the "Initializing" screen and never launches. The initializing message appears but nothing happens. Other Autodesk programs like Civil 3D 2026 work perfectly fine. The issue affects multiple users simultaneously, suggesting a systemic problem rather than a local configuration issue.

### Root Cause

"This is a known issue with the current version of the Autodesk License Service. It will be fixed with the next version. In the meantime, you can install the previous version that is attached to this article." The Autodesk License Service version bundled with InfraWorks 2026 has a bug that prevents proper license verification. The license service hangs during initialization, blocking InfraWorks from launching. Other Autodesk products may use a different license verification path, which is why they work fine.

### Fix

1. **Install previous Autodesk License Service**:
   - Install the previous license service version

2. **Check the Autodesk knowledge article**:
   - Follow the knowledge article
   - For the latest fix

3. **Verify other Autodesk products work**:
   - Verify other products work
   - To confirm it's InfraWorks-specific

4. **Wait for the next license service update**:
   - If you can't install the previous version
   - Wait for the updated license service
   - To be released

5. **Restart after installing previous version**:
   - After installing the previous license service
   - Restart the computer
   - Then launch InfraWorks 2026
   - To verify it starts correctly

6. **Check for InfraWorks updates**:
   - Check for InfraWorks updates
   - That may include
   - A fix for the license service
   - Issue

7. **Report persistent initializing issues**:
   - If InfraWorks still gets stuck
   - After installing the previous license service
   - Report to Autodesk support
   - With the license service version

### Community Report

> "I'm unable to run InfraWorks 2026 — I get a message saying 'Initializing', but nothing happens. Other programs, such as Civil 3D 2026, are working perfectly fine. This is a known issue with the current version of the Autodesk License Service. It will be fixed with the next version. In the meantime, you can install the previous version that is attached to this article."

## 2. Civil 3D DWG Import Cannot Connect to Data Sources from Missing Civil 3D Background Process

### Symptom

InfraWorks cannot import Civil 3D DWG files. The error message "Autodesk InfraWorks 2025 cannot connect to the given file data sources" appears. Aerial images, shapefiles, and other non-Civil 3D files import fine. The issue occurs even with simple DWG files containing only a basic surface. Multiple Civil 3D versions are installed on the computer.

### Root Cause

"To import a Civil 3D DWG, InfraWorks needs to have Civil 3D installed in the same version. It runs Civil 3D in the background to convert the DWG to IMX and then it loads the IMX file. Why all of a sudden InfraWorks cannot start or find Civil 3D on your computer, I don't know. It could be that a clean re-installation solves the issue." InfraWorks uses Civil 3D in the background to convert DWG files to IMX format. If Civil 3D can't be found or started in the background, the DWG import fails. The issue can occur after updates or when multiple Civil 3D versions are installed.

### Fix

1. **Export IMX from Civil 3D as workaround**:
   - Export IMX from Civil 3D and import to InfraWorks

2. **Clean reinstall Civil 3D**:
   - Uninstall Civil 3D completely
   - Then reinstall
   - The same version as InfraWorks

3. **Verify Civil 3D version matches**:
   - Verify the Civil 3D version
   - Matches the InfraWorks version

4. **Check for multiple Civil 3D versions**:
   - Multiple versions can cause conflicts
   - Consider uninstalling older versions

5. **Install InfraWorks hotfix**:
   - Check for InfraWorks hotfixes
   - That may address the issue

6. **Delete local cache**:
   - Delete the InfraWorks local cache
   - And retry the import
   - To clear corrupted cache data

7. **Update both Civil 3D and InfraWorks**:
   - Update both products
   - To the latest versions

### Community Report

> "Autodesk InfraWorks 2025 cannot connect to the given file data sources. To import a Civil 3D DWG, InfraWorks needs to have Civil 3D installed in the same version. It runs Civil 3D in the background to convert the DWG to IMX and then it loads the IMX file. A workaround for you could be to export an IMX from Civil 3D and import that into InfraWorks. It could be that a clean re-installation solves the issue."

## 3. Corridor Import Failure from Coordinate System Mismatch with Missing Leading Y Coordinate

### Symptom

Civil 3D corridors fail to import into InfraWorks 2026. The error occurs even when coordinate systems appear to match between Civil 3D and InfraWorks. LiDAR and TIFF data import without issues — only the corridor fails. The corridor depends on alignments, profiles, assemblies, and surfaces, all of which are in the correct coordinate system.

### Root Cause

"The reason for the error message is that your Civil 3D objects are not within the defined boundaries of the coordinate system. Easiest way to see that is by comparing the coordinates in Civil 3D and InfraWorks. Load the aerial images in Civil 3D with GEOMAP — they are far away. It looks as if the leading 5 of the Y coordinate is missing. So, instead of 5 200 000 it is 200 000." The corridor objects have incorrect coordinates — the leading digit of the Y coordinate is missing. The objects appear to be in the correct coordinate system, but the actual coordinate values are wrong, placing the objects far outside the coordinate system's valid boundaries.

### Fix

1. **Compare coordinates between Civil 3D and InfraWorks**:
   - Compare the coordinate values
   - In both applications

2. **Load aerial images to verify position**:
   - Use GEOMAP to load aerial images
   - And check if objects are in the right location

3. **Check for missing leading Y coordinate digits**:
   - Check if the Y coordinate
   - Is missing leading digits

4. **Move objects to correct coordinates**:
   - Move objects to correct position

5. **Verify Model Properties coordinate system**:
   - Verify the InfraWorks model
   - Uses the same coordinate system

6. **Don't use data source offset for corridors**:
   - Move in Civil 3D, not in InfraWorks

7. **Use IMX export for corridors**:
   - Export the corridor as IMX from Civil 3D
   - Then import the IMX into InfraWorks
   - As an alternative to DWG import

### Community Report

> "The reason for the error message is that your Civil 3D objects are not within the defined boundaries of the coordinate system. Easiest way to see that is by comparing the coordinates in Civil 3D and InfraWorks. Load the aerial images in Civil 3D with GEOMAP — they are far away. It looks as if the leading 5 of the Y coordinate is missing. So, instead of 5 200 000 it is 200 000. The solution is to move all drawing objects '0, 5000000, 0', means 5000000 units to the north. Then reimport the DWG into InfraWorks."

## 4. DWG Re-import Failure from Windows Security Network Blocking and OneDrive Path

### Symptom

DWG files that previously imported successfully into InfraWorks now fail to import. The same DWG, with minimal changes, won't import again. Creating a new project allows the DWG to import, but existing projects fail. Both reconnecting and importing fresh fail. The InfraWorks log file shows "Service Exception: Network issues are preventing this operation."

### Root Cause

"Service Exception: Network issues are preventing this operation. I added Infraworks to the allowed apps in Windows Security and it seems to be working consistently now." Windows Security (Windows Defender Firewall) was blocking InfraWorks' network access, preventing it from connecting to data sources. Additionally, storing files on OneDrive caused sync conflicts that interfered with InfraWorks' file access.

### Fix

1. **Add InfraWorks to Windows Security allowed apps**:
   - Add InfraWorks to the allowed apps list
   - In Windows Security > Firewall

2. **Store files on local drive instead of OneDrive**:
   - Use local drive for InfraWorks files

3. **Check the InfraWorks log file**:
   - Check the log file
   - For network error messages

4. **Create a new project**:
   - Creating a new project
   - Can bypass the corrupted project
   - As a workaround

5. **Use reconnect for existing data sources**:
   - Try both reconnecting
   - And importing fresh

6. **Disable OneDrive sync for InfraWorks folders**:
   - If using OneDrive
   - Disable sync for InfraWorks project folders
   - Or move projects
   - To a non-OneDrive location

7. **Check for recurring issues**:
   - Monitor for recurring issues
   - After applying the fixes

### Community Report

> "I started using Infraworks 2024 where importing was pretty seamless. 2025 seems like a big downgrade where I can only successfully import dwg's half the time. I noticed there was a lot of 'Service Exception: Network issues are preventing this operation.' I added Infraworks to the allowed apps in Windows Security and it seems to be working consistently now. I made a new project and set the files to be stored on my local drive, rather than on Onedrive. It did start working after that."

## 5. IMX Schema Version Error from Faulty Civil 3D Installation

### Symptom

When importing Civil 3D DWG files into InfraWorks, an "IMX Schema Version" error appears. The DWG file is stored on a network drive (P:\). The error occurs even after updating both Civil 3D and InfraWorks. The issue is specific to certain DWG files and doesn't affect all imports.

### Root Cause

"The last time I saw the IMX Schema Version error, was due to a faulty installation of Civil 3D and it had to be reinstalled." The IMX Schema Version error occurs when the Civil 3D installation is corrupted or incomplete. InfraWorks uses Civil 3D in the background to convert DWG to IMX, and if the Civil 3D installation is faulty, the IMX conversion fails with a schema version mismatch.

### Fix

1. **Reinstall Civil 3D**:
   - Uninstall and reinstall Civil 3D
   - To fix the faulty installation

2. **Export IMX from Civil 3D**:
   - Try exporting IMX from Civil 3D
   - And importing to InfraWorks

3. **Copy DWG to local drive**:
   - Copy the DWG from network drive
   - To a local drive before importing

4. **Update both Civil 3D and InfraWorks**:
   - Update both products
   - To the latest versions

5. **Check IMX schema compatibility**:
   - Verify the IMX schema version
   - Is compatible between
   - The Civil 3D and InfraWorks
   - Versions

6. **Use a different Civil 3D version**:
   - If multiple Civil 3D versions are installed
   - Try exporting IMX
   - From a different version
   - To see if the schema matches

7. **Send log file to Autodesk support**:
   - Send the log file
   - To Autodesk support for analysis

### Community Report

> "The last time I saw the IMX Schema Version error, was due to a faulty installation of Civil 3D and it had to be reinstalled. What happens if you export to an IMX format in Civil 3D and import the IMX file into InfraWorks? Can you try and copy the DWG from path P:\ to a local drive and retest? Thank karsten, I try to update both civil and infra then the problem is fixed."

## 6. Additional InfraWorks Issues

### Civil 3D Version Match Requirement

**Issue**: "To import a Civil 3D DWG, InfraWorks needs to have Civil 3D installed in the same version."
**Fix**: Ensure Civil 3D and InfraWorks versions match. InfraWorks runs Civil 3D in the background for DWG-to-IMX conversion. If versions don't match, use IMX export from Civil 3D instead.

### Corridor Dependency on Multiple Objects

**Issue**: "It's probably because the corridor is dependent of so many other objects (alignment, profile, assemblies, surface, etc.)."
**Fix**: Corridors can't be offset in InfraWorks data source configuration. Fix coordinate issues in Civil 3D before exporting. Use IMX export for complex corridor imports.

### InfraWorks Hotfix Installation

**Issue**: "Installing Infraworks Hotfix that came out at the end of september."
**Fix**: Check for and install InfraWorks hotfixes. Hotfixes may address import issues. Install hotfixes before troubleshooting further.

### Model Builder Coordinate System

**Issue**: "Just because you are selecting a coordinate system in the Configure dialog box, doesn't mean your actual model coordinate system is set correctly."
**Fix**: "Click on Model Properties and make sure it matches your Civil 3D coordinate system." Verify the model's actual coordinate system in Model Properties, not just the Configure dialog.

### Aerial Image and Shapefile Import Success

**Issue**: "I have no problem importing aerial images or shape files or it seems anything else other than Civil 3d files."
**Fix**: Non-Civil 3D files don't require the Civil 3D background process. If only Civil 3D files fail, the issue is with the Civil 3D integration, not InfraWorks itself.

### Simple Surface Test

**Issue**: "Creating a brand new civil file with civil 2023 and also 2025 with a simple surface and importing that."
**Fix**: Test with a simple surface DWG to isolate the issue. If the simple surface fails, the issue is with the Civil 3D installation. If it succeeds, the issue is with the specific DWG file.

## Best Practices

1. **Install previous Autodesk License Service if stuck on Initializing** — known issue fix
2. **Export IMX from Civil 3D as workaround for DWG import** — bypasses background process
3. **Verify coordinates with GEOMAP aerial images** — detects missing leading Y digits
4. **Add InfraWorks to Windows Security allowed apps** — prevents network blocking
5. **Store InfraWorks files on local drive, not OneDrive** — prevents sync conflicts
6. **Reinstall Civil 3D for IMX Schema Version errors** — fixes faulty installations
7. **Match Civil 3D and InfraWorks versions** — required for background DWG conversion
8. **Check InfraWorks log file for error messages** — provides diagnostic information
9. **Update both Civil 3D and InfraWorks together** — ensures compatibility
10. **Fix corridor coordinates in Civil 3D, not InfraWorks** — corridors can't be offset in data source
