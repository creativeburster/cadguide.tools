---
title: "Trimble Business Center Import Export Crash, Traverse Angular Adjustment No Angles"
excerpt: "Trimble Business Center Import Export Crash, Traverse Angular Adjustment No Angles: symptoms, root causes, and step-by-step fixes, verified against Trimble Community."
category: "troubleshooting"
softwareSlug: "trimble-business-center"
keyword: "Trimble Business Center TBC import export crash cleanup utility traverse angular adjustment no angles question marks unclosed traverse closing angle CSV import OptionsValidationException Filepath does not exist aerial photogrammetry child process crash SentinelOne antivirus whitelisting RL reduction combined traverses unknown height marks"
slug: "trimble-business-center-import-export-crash-traverse-angular-adjustmen"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://community.trimble.com/discussion/tbc-crashes-when-i-try-to-import-or-export-anything"
  - "https://community.trimble.com/discussion/traverse-angular-adjustment"
  - "https://community.trimble.com/discussion/tbc-aerial-photogrammetry-adjust-photo-stations-error-child-process-reconstruction-terminated-unexpectedly-error"
---

# Trimble Business Center Import Export Crash, Traverse Angular Adjustment No Angles, CSV Import OptionsValidationException Filepath, Aerial Photogrammetry Child Process Crash from SentinelOne, and RL Reduction Not Working on Combined Traverses: Cleanup Utility, Closed Traverse Configuration, Antivirus Whitelisting, and Coordinate Adjustment

Trimble Business Center's import/export, traverse adjustment, CSV import, aerial photogrammetry, and RL reduction produce errors from corrupted installations, unclosed traverses, configuration issues, antivirus interference, and unknown height marks. This guide covers the 5 most common TBC problems with diagnostic steps and community-verified fixes from Trimble Community.

## 1. Import Export Crash from Corrupted Installation

### Symptom

TBC crashes when trying to import or export any file. Opening a project (.vce) and working on it works normally, but importing XML, DXF, or any other file causes TBC to hang. Installing the latest version doesn't help. Moving files to the C drive instead of OneDrive-synced Documents doesn't help. Disabling internet connection doesn't help.

### Root Cause

The TBC installation has become corrupted. This can happen from partial updates, interrupted installations, or conflicts with other software. "I have had some bizarre crashes and things happen from times to time. By the time I try to figure it out, running the cleanup utility and fully installing tends to be more efficient." The corruption affects the import/export modules specifically, while core project functionality remains intact. OneDrive sync and internet connectivity are red herrings — the issue is in the installation itself.

### Fix

1. **Run the TBC Cleanup Utility**:
   - Download the TBC Cleanup Utility from Trimble
   - Run it to remove all TBC installation files and registry entries
   - This ensures a clean slate for reinstallation

2. **Restart the computer**:
   - After running the cleanup utility
   - Restart the computer
   - This clears any remaining TBC processes

3. **Fully install the latest version**:
   - Download the latest TBC version from Trimble Downloads
   - Perform a complete installation
   - Don't install over an existing version

4. **Allow approximately 35 minutes**:
   - The cleanup and reinstall process takes time
   - Plan for the downtime

5. **Check for OneDrive interference**:
   - While OneDrive wasn't the cause in this case
   - It can cause issues with TBC project files
   - Store .vce files on a local drive

6. **Check for locked-down IT restrictions**:
   - If your PC is IT-managed
   - Request IT support to run the cleanup and reinstall
   - Admin rights are required

7. **Don't waste time troubleshooting individual crashes**:
   - For persistent crashes, cleanup + reinstall is faster
   - Than trying to identify the specific cause
   - Especially for import/export module crashes

### Community Report

> "Since yesterday, my TBC has crashed when I try to import or export a file. I can open a project and work on things as normal, but if I want to bring in anything such as an xml or dxf it just hangs. I tried installing the latest version and it made no difference. The best bet is to run the cleanup Utility. Then restart. Then fully install the latest version. It took about 35 minutes altogether. Everything is snappy again!"

## 2. Traverse Angular Adjustment No Angles — Question Marks in Report

### Symptom

During a traverse adjustment in TBC, distance errors appear as expected, but there is no angular adjustment happening at all. The entire adjustment report has "?" for anything related to angles. TBC only performs a distance adjustment, not solving the angular misclosure. The data was collected on Survey Pro and exported using a .job file.

### Root Cause

"The issue is one of two things. When I get this question, most of the time there is not a closed traverse." A closed traverse requires the survey to return to the starting point and close the angle. "The traverse was started at point 2 backsighting 1. The traverse was run around and the last angle was set at point 5 (same as 1) and turned to point 6 (same as 2)." If the traverse doesn't close — e.g., occupying point 4 and turning to point 5 and ending the survey there — TBC can't compute angular misclosure. The second issue: "If you name a point as 1, it will always be point 1." If closing points are given new names instead of reusing the original point names, TBC doesn't recognize them as the same points and can't close the traverse.

### Fix

1. **Ensure the traverse is closed**:
   - The traverse must return to the starting point
   - The closing angle must be between the starting and second points
   - Don't end the survey before closing

2. **Reuse original point names for closing points**:
   - When the data collector asks to average points

3. **Never use a new point name for existing points**:
   - Reuse the original point name
   - TBC recognizes it as the same point
   - This enables proper traverse closure

4. **Check the closing angle**:
   - Verify the closing angle was observed
   - The traverse must have a final angle measurement
   - That closes back to the starting reference

5. **Verify the .job file export**:
   - Check the .job file includes angle observations
   - Verify the export settings include angles
   - Re-export if angles are missing

6. **Check if you re-occupied the first setup point**:
   - The traverse must physically return to the starting point
   - Not just sight it from the last setup
   - Re-occupy and re-measure if needed

7. **Use TBC's dynamic network adjustment as alternative**:
   - Consider using the network adjustment instead
   - It's more flexible than traditional traverse adjustment

### Community Report

> "I am working on a traverse adjustment and I get distance errors as expected, but there is no angular adjustment happening at all. The entire report just has '?' for anything related to angles. The issue is one of two things — most of the time there is not a closed traverse. If you name a point as 1, it will always be point 1. If you do have a closed traverse, try renaming the closing points to their original names."

## 3. CSV Import OptionsValidationException Filepath Does Not Exist

### Symptom

After upgrading to a new work laptop and installing TBC 24.10, importing CSV files from previous surveys fails. The error message shows: "Exception Source: Microsoft.Extensions.Options, Exception Type: Microsoft.Extensions.Options.OptionsValidationException, Exception Message: Filepath does not exist." The error occurs on every CSV import attempt.

### Root Cause

The TBC installation or configuration is referencing a file path that doesn't exist on the new laptop. This can happen when TBC is installed on a new computer without properly migrating configuration files. The import function tries to access a configuration file or template at a path from the old computer, which doesn't exist on the new one. The OptionsValidationException is a .NET configuration error — TBC's dependency injection system can't find a required configuration file.

### Fix

1. **Run the TBC Cleanup Utility and reinstall**:
   - As with Problem 1, cleanup and reinstall is the most reliable fix
   - Download the TBC Cleanup Utility
   - Run it to remove all TBC files
   - Restart and install the latest TBC version

2. **Check the CSV import template path**:
   - The error "Filepath does not exist" suggests a template path issue
   - Check TBC import settings
   - Verify the CSV import template path exists
   - Browse to the correct template location

3. **Create a new CSV import template**:
   - If the old template path doesn't exist
   - Create a new CSV import template
   - Configure the column mappings
   - Save the template to a local path

4. **Check for migrated configuration files**:
   - If configuration files were copied from the old laptop
   - They may reference paths that don't exist on the new one
   - Delete old configuration files
   - Let TBC recreate them

5. **Verify file paths are on local drives**:
   - Don't use network paths or OneDrive paths for templates
   - Store CSV import templates on C drive
   - Use full local paths
   - Avoid relative paths

6. **Check Windows user profile**:
   - The new laptop may have a different username
   - TBC configuration files may reference the old username path
   - Check `C:\Users\[username]\AppData\...`
   - Update paths if username changed

7. **Contact Trimble support**:
   - If the error persists after cleanup and reinstall
   - Contact Trimble support
   - Provide the full exception message
   - Include TBC version and Windows version

### Community Report

> "I recently upgraded my work laptop and installed TBC 24.10. It will not let me import any csv files from previous surveys. Each time I carry out the process, I end up with error message: Exception Source: Microsoft.Extensions.Options, Exception Type: Microsoft.Extensions.Options.OptionsValidationException, Exception Message: Filepath does not exist."

## 4. Aerial Photogrammetry Child Process Crash from SentinelOne Antivirus

### Symptom

When performing a relative adjustment in TBC's Aerial Photogrammetry module, the error "Child process Reconstruction terminated unexpectedly" appears. The photogrammetry reconstruction fails. The error occurs consistently across multiple projects. Users with SentinelOne antivirus are all affected.

### Root Cause

"This has been strongly linked to the use of SentinelOne Antivirus software. All users who have been running this have disabled the AV software to prove this was indeed causing the process to be terminated." SentinelOne is an endpoint security solution that monitors and blocks suspicious process behavior. TBC's aerial photogrammetry module spawns child processes for photo reconstruction. SentinelOne interprets these child processes as suspicious and terminates them, causing the "Child process Reconstruction terminated unexpectedly" error.

### Fix

1. **Whitelist the TBC installation folder**:
   - In SentinelOne management console
   - Add the TBC installation directory to the exclusion list
   - Include all subfolders
   - This prevents SentinelOne from scanning TBC processes

2. **Temporarily disable SentinelOne to verify**:
   - Temporarily disable SentinelOne
   - Run the aerial photogrammetry adjustment
   - If it succeeds, SentinelOne is confirmed as the cause

3. **Whitelist specific TBC executables**:
   - Add TBC.exe to the whitelist
   - Add any child process executables in the TBC folder
   - Add the photogrammetry reconstruction executable
   - Check the TBC installation folder for process executables

4. **Contact SentinelOne support**:
   - If whitelisting doesn't work
   - Contact SentinelOne support
   - Explain that TBC child processes are being terminated
   - Request guidance on proper exclusions

5. **Use an alternative antivirus**:
   - If SentinelOne can't be configured properly
   - Consider using a different antivirus
   - Windows Defender doesn't have this issue
   - Other AV solutions may not block TBC processes

6. **Wait for a TBC fix**:
   - Trimble is working on a fix
   - That prevents SentinelOne from interfering
   - Check for TBC updates

7. **Report to Trimble support**:
   - If you experience this issue
   - Report it to Trimble support
   - Include SentinelOne version and TBC version
   - This helps prioritize the fix

### Community Report

> "There have been countless reports of users facing this error when performing a relative adjustment in TBC: Error: Child process Reconstruction terminated unexpectedly. This has been strongly linked to the use of SentinelOne Antivirus software. All users who have been running this have disabled the AV software to prove this was indeed causing the process to be terminated. Whitelisting the TBC installation and its subfolders should be the resolution while the developers work to combat this issue occurring by default."

## 5. RL Reduction Not Working on Combined Traverses

### Symptom

A pre-construction survey reduces well with no issues. A post-construction traverse commenced on marks with unknown heights but observed marks common with the pre-construction survey. When combining the two sets of data, the RLs (Reduced Levels) are not reduced for the post-construction traverse. The adjustment doesn't carry over the known heights to the post-construction data.

### Root Cause

The post-construction traverse started on marks with unknown heights. While it observed marks common with the pre-construction survey (where RLs were established), TBC doesn't automatically link the two traverses unless the point names match exactly. The common marks in the post-construction traverse must have the same point names as in the pre-construction traverse for TBC to recognize them as the same points and carry over the RLs. If the point names differ, TBC treats them as separate points with unknown heights.

### Fix

1. **Ensure common marks have identical point names**:
   - The common marks observed in both traverses
   - Must have exactly the same point names
   - In both the pre-construction and post-construction data
   - TBC uses point names to link observations

2. **Combine the data in a single TBC project**:
   - Import both traverses into the same TBC project
   - Use Home > Import to bring in both datasets
   - TBC will recognize common point names
   - And link the observations

3. **Run a combined network adjustment**:
   - After importing both datasets
   - Run a network adjustment
   - TBC will use the known heights from the pre-construction
   - To reduce the post-construction traverse

4. **Check point coordinates match**:
   - Verify the common marks have similar coordinates
   - In both traverses (within tolerance)
   - If coordinates differ significantly
   - There may be a data issue

5. **Use the Least Squares adjustment**:
   - For combined traverses
   - Use the Least Squares adjustment method
   - It handles combined datasets better
   - Than traditional traverse adjustment

6. **Assign known heights manually**:
   - If automatic linking doesn't work
   - Manually assign the known RLs
   - To the common marks in the post-construction traverse
   - Then run the adjustment

7. **Check raw data for height observations**:
   - Verify the post-construction raw data
   - Includes height observations to common marks
   - Check the .job file for vertical angle/distance data
   - That can be used for height transfer

8. **Use cleaned-up CSV files**:
   - Clean the raw data before importing
   - Remove erroneous observations

### Community Report

> "I have conducted a traverse in two parts; pre-construction and post-construction. The pre-construction survey reduces well with no issues. The post-construction survey commenced on marks with unknown heights, but did observe marks that were common with the pre-construction survey in which the RL's for these common marks was established. When I combine the 2 sets of data, the RLs are not reduced for the post-construction traverse."

## 6. Additional Trimble Business Center Issues

### TBC Performance Issues

**Issue**: "TBC is slow, performance issues, display problem, slow in zooming and snapping."
**Fix**: Update GPU drivers. Disable model history collection. Avoid high contrast mode. Remove reference models. Meet hardware recommendations. Install latest service pack.

### TBC Import Points Error on New Installation

**Issue**: "TBC gives error when I try to import points to new job" after fresh installation.
**Fix**: Run cleanup utility and reinstall. Check configuration file paths. Create new import templates. Verify Windows user profile paths.

### TBC Coordinate System Auto-Populate

**Issue**: "Coordinate System tab won't auto populate anymore" in Trimble Sync Manager.
**Fix**: "The map service that drives the Coordinate System to auto populate was changed recently as the old map service was deprecated." Update to version 2.20.2.0 of Trimble Sync Manager.

### TBC Survey Pro Export Issues

**Issue**: Data collected on Survey Pro and exported as .job file has missing angles.
**Fix**: Check Survey Pro export settings. Ensure angle observations are included. Verify the .job file format. Re-export with all observations.

### TBC OneDrive Sync Conflicts

**Issue**: TBC project files on OneDrive-synced folders cause crashes.
**Fix**: Store .vce files on local drives. Don't sync TBC project folders with OneDrive. Use local C drive for active projects.

## Best Practices

1. **Run the cleanup utility for persistent crashes** — faster than troubleshooting
2. **Fully reinstall the latest TBC version** — don't install over existing
3. **Ensure traverses are properly closed** — return to starting point with closing angle
4. **Reuse original point names for closing points** — enables TBC to recognize same points
5. **Never use new point names for existing points** — TBC treats them as different points
6. **Whitelist TBC in SentinelOne antivirus** — prevents child process termination
7. **Store TBC files on local drives** — avoid OneDrive sync conflicts
8. **Ensure common marks have identical names across traverses** — enables RL transfer
9. **Use Least Squares adjustment for combined traverses** — handles multiple datasets
10. **Keep TBC and Trimble Sync Manager updated** — fixes map service and compatibility issues
