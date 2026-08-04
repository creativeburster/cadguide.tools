---
title: "Ultimaker Cura Slicing Failed from Corrupted Configuration Upgrade"
excerpt: "Ultimaker Cura Slicing Failed from Corrupted Configuration Upgrade: symptoms, root causes, and step-by-step fixes, verified against Ultimaker Cura GitHub issues."
category: "printing"
softwareSlug: "ultimaker-cura"
keyword: "Ultimaker Cura slicing failed corrupted quality upgrade USB printing plugin serial device conflict material settings crash invalid profile values Tiled Infill GLIBCXX not found printer definition version mismatch Windows upgrade configuration folder reset plugin disable profile backup cache clear"
slug: "ultimaker-cura-slicing-failed-from-corrupted-configuration-upgrade"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://github.com/Ultimaker/Cura/issues/20577"
  - "https://github.com/Ultimaker/Cura/issues/18145"
  - "https://github.com/Ultimaker/Cura/issues/21218"
---

# Ultimaker Cura Slicing Failed from Corrupted Configuration Upgrade, USB Printing Plugin Interference, Material Settings Crash from Invalid Profile Values, Tiled Infill Plugin GLIBCXX Missing, and Printer Definition Version Mismatch After Windows Upgrade: Configuration Folder Reset, Plugin Disable, Profile Backup, and Cache Clear

Ultimaker Cura's slicing engine, USB printing, material settings, infill plugins, and printer definitions produce errors from corrupted upgrades, serial device conflicts, invalid profile values, missing system libraries, and version mismatches. This guide covers the 5 most common Ultimaker Cura problems with diagnostic steps and community-verified fixes from Ultimaker Cura GitHub issues.

## 1. Slicing Failed from Corrupted Quality Upgrade Configuration

### Symptom

After updating Cura to 5.10.0, every single STL model fails to slice. The error "Slicing failed" appears. The user had been using Cura 5.7 without issues. The log shows a `VersionUpgrade52to53` exception: `configparser.DuplicateOptionError: option 'infill_pattern' in section 'values' already exists`. The setting `speed_wall_0_roofing` is missing.

### Root Cause

"There is a setting missing, `speed_wall_0_roofing` which indicates either something went wrong during the upgrade (from previous version), or you installed the new version on top of the previous version, or you're using a custom printer definition." The upgrade from Cura 5.7 to 5.10.0 failed to properly upgrade the quality configuration files. The `VersionUpgrade52to53` script encountered a duplicate `infill_pattern` option in the quality file, causing the upgrade to fail. This left the configuration in a corrupted state — some settings were upgraded, others were not. The missing `speed_wall_0_roofing` setting causes the slicer to fail because it can't find a required parameter. "I do see a lot of exceptions in the logs for the upgrade script failing due to issues with a configuration for the quality files."

### Fix

1. **Clear the configuration folder and start fresh**:
   - "You can try to resolve the issues manually if you know where they originate from"
   - "Or attempt to clear the configuration folder (reset) and start fresh"
   - "Both paths can fix the slice issue"
   - Go to Help > Show Configuration Folder
   - Close Cura
   - Delete or rename the entire configuration folder

2. **Export custom profiles before resetting**:
   - Before clearing the configuration
   - Export all custom profiles and materials
   - Settings > Profiles > Export
   - Settings > Materials > Export
   - Save them to a separate location

3. **Re-import profiles after reset**:
   - After clearing the configuration and restarting Cura
   - Add your printer fresh
   - Import your custom profiles and materials
   - Reconfigure settings

4. **Don't install new version over old version**:
   - "You installed the new version on top of the previous version"
   - This can cause configuration corruption
   - Uninstall the old version first
   - Then install the new version

5. **Check for custom printer definitions**:
   - "You're using a custom printer definition"
   - Custom definitions may not upgrade properly
   - Remove custom printer definitions before upgrading
   - Re-add them after upgrading

6. **Check the cura.log for upgrade errors**:
   - Look for `VersionUpgrade` exceptions
   - Look for `DuplicateOptionError`
   - These indicate configuration corruption
   - The specific setting mentioned shows what's broken

7. **Use the Marketplace gear icon**:
   - "Go to the Cura Marketplace and click on the 'gear' icon"
   - "Scroll down to 'USB Printing' and disable it"
   - "Restart Cura and try to slice a file"
   - This may also help if USB devices are interfering

### Community Report

> "I used Cura 5.7 for a long time without issues. I today updated Cura to 5.10.0 and every single .stl model fails to slice. The logs show an issue with the printer instance / definition. There is a setting missing, 'speed_wall_0_roofing' which indicates either something went wrong during the upgrade, or you installed the new version on top of the previous version, or you're using a custom printer definition. Exception in quality upgrade: configparser.DuplicateOptionError: option 'infill_pattern' in section 'values' already exists."

## 2. USB Printing Plugin Causing Slicing Hang from Serial Device Conflict

### Symptom

Cura fails to slice models. The slicing process hangs indefinitely. The user has a monitor connected via USB-C. Disabling USB Printing in the Marketplace settings doesn't fix the issue. The log file is full of USB baud rate lines, indicating Cura is trying to connect to something.

### Root Cause

"If you have USB devices plugged into your computer, and if internally they are configured as serial devices, then Cura assumes they are printers and keeps trying to connect. If (for example) the USB device is earbuds, then Cura can't connect and gets stuck and can't do anything else." The USB Printing plugin scans for serial devices and tries to connect to them. USB-C monitors, earbuds, and other USB devices that present as serial ports cause the plugin to hang while trying to establish a printer connection. This blocks the slicing engine from running. "The log file is full of USB baud rate lines and that indicates that it was trying to connect to something."

### Fix

1. **Disable the USB Printing plugin**:
   - "Go to the Cura Marketplace and click on the 'gear' icon"
   - "Scroll down to 'USB Printing' and disable it"
   - "Restart Cura and try to slice a file"
   - This prevents Cura from scanning for serial devices

2. **Disconnect USB devices**:
   - "I only have a monitor connected via USB-C"
   - Even USB-C monitors can present as serial devices
   - Disconnect non-essential USB devices
   - Especially USB-C monitors, docks, and hubs

3. **Check for serial device conflicts**:
   - Open Device Manager (Windows)
   - Look at Ports (COM & LPT)
   - Identify any USB devices presenting as serial ports
   - Disable those devices if not needed

4. **Use network printing instead of USB**:
   - If you use USB printing
   - Consider switching to network printing
   - Ultimaker printers support network connectivity
   - This avoids the USB serial device conflict

5. **Check the log for USB baud rate lines**:
   - "The log file is full of USB baud rate lines"
   - This confirms the USB Printing plugin is the cause
   - Look in the Cura log for repeated connection attempts
   - To non-printer serial devices

6. **Re-enable USB Printing only when needed**:
   - If you need USB printing
   - Enable it only when actually printing via USB
   - Disable it when slicing
   - This prevents the hang during slicing

7. **Report the issue on GitHub**:
   - If disabling USB Printing doesn't fix the slicing
   - The issue may be something else
   - Report on GitHub with the log file
   - Include the USB device details

### Community Report

> "Slicing fails on all STL models. I only have a monitor connected via USB-C. Disabled USB Printing in the marketplace settings, restarted Cura, but the error persists when slicing. The log file is full of USB baud rate lines and that indicates that it was trying to connect to something. If you have USB devices plugged into your computer, and if internally they are configured as serial devices, then Cura assumes they are printers and keeps trying to connect."

## 3. Material Settings Crash from Invalid Profile Values

### Symptom

Cura crashes 1-2 seconds after pressing the Slice button. No crash report or "submit a bug" popup appears — Cura just fully crashes. The crash happens when changing a value in the material print settings and then immediately pressing Slice. The crash also occurs with all plugins disabled. Saving to a new profile doesn't help.

### Root Cause

"You have issues in your custom profile/settings. You've set a raft base line width of '0.0' which in the settings shows an error." The custom material profile has invalid values — specifically a raft base line width of 0.0. When Cura tries to slice with these invalid values, the slicer engine crashes. The crash is silent because it happens in the backend (CuraEngine), not in the UI. "A weird interaction between the different plugins and your input. There are no clear 'Error' logs for the crash, but a lot of warnings for settings without value."

### Fix

1. **Check for invalid setting values**:
   - "You've set a raft base line width of '0.0' which in the settings shows an error"
   - Look for red error indicators in the settings
   - Fix any values that show errors
   - Don't slice with invalid values

2. **Revert to a backup of settings**:
   - "I went to my backups and reverted to my latest backup"
   - Keep regular backups of your Cura configuration
   - If a crash appears after changing settings
   - Revert to the last known good backup

3. **Delete old beta installations**:
   - "I went to delete the old 5.7.0 beta installation in file explorer"
   - Old beta installations can conflict
   - Delete old Cura versions
   - Keep only the latest stable version

4. **Don't change material settings and slice immediately**:
   - "Change some value within the materials print settings"
   - "And then straight after you press slice, then Cura crashes"
   - Apply settings changes
   - Wait for the UI to update
   - Then press Slice

5. **Check with plugins disabled**:
   - "With all plugins disabled, it still crashed"
   - If the crash persists with plugins disabled
   - The issue is in the profile settings
   - Not in a plugin

6. **Create a fresh profile**:
   - "Saving it to a new profile didn't work"
   - But creating a completely fresh profile might
   - Start with a default profile
   - Change settings one at a time
   - Test slicing after each change

7. **Share the configuration folder for debugging**:
   - "Go to Help > Show Configuration Folder"
   - "Zip that entire folder (.../cura/5.7)"
   - Share it on GitHub for debugging
   - This helps developers reproduce the issue

8. **Reset to default material settings**:
   - If the crash persists
   - Reset all material settings to defaults
   - Remove custom material profiles
   - Start fresh with default materials

### Community Report

> "Cura crashes 1-2 seconds after pressing slice, doesn't bring up popup like 'crash report' or 'submit a bug', just fully crashes. You have issues in your custom profile/settings. You've set a raft base line width of '0.0' which in the settings shows an error. I went to my backups and reverted to my latest backup. I went to delete the old 5.7.0 beta installation. I decided to open up the file again, enable all plugins and restart, and it didn't crash, and fully sliced."

## 4. Tiled Infill Plugin GLIBCXX Version Not Found

### Symptom

Slicing fails with the CuraEngineTiledInfill plugin enabled. The CuraEngine log shows: `curaengine_plugin_infill_generate: /usr/lib64/libstdc++.so.6: version 'GLIBCXX_3.4.32' not found`. The plugin also reports `GLIBC_2.34 not found`. Slicing works after disabling the Tiled Infill plugin. The issue occurs on older Linux systems.

### Root Cause

The CuraEngineTiledInfill plugin is compiled against a newer version of the C++ standard library (libstdc++) and glibc than what's available on the user's system. "So it looks like it doesn't like my old system." The plugin requires GLIBCXX_3.4.32 and GLIBC_2.34, but the user's system has an older version. The plugin binary can't load the required shared libraries, causing the backend to crash with a connection refused error: "failed to connect to all addresses; last error: UNKNOWN: ipv4:127.0.0.1:58669: Failed to connect to remote host: Connection refused."

### Fix

1. **Disable the Tiled Infill plugin**:
   - "I disabled 'Cura Engine Tiled Infill' plugin and slice works again"
   - Go to Marketplace > gear icon
   - Find CuraEngineTiledInfill
   - Disable it
   - Restart Cura

2. **Update the C++ standard library**:
   - "This appears to be the fix"
   - "https://stackoverflow.com/questions/76974555/glibcxx-3-4-32-not-found-error-at-runtime-gcc-13-2-0"
   - Update to a newer version of libstdc++
   - Install GCC 13.2.0 or later

3. **Update the Linux system**:
   - The system is too old for the plugin
   - Update to a newer Linux distribution
   - That includes GLIBCXX_3.4.32 and GLIBC_2.34
   - This is the permanent fix

4. **Use an older version of the plugin**:
   - If a system update isn't possible
   - Find an older version of CuraEngineTiledInfill
   - Compiled against an older libstdc++
   - That's compatible with your system

5. **Use alternative infill patterns**:
   - If Tiled Infill is not essential
   - Use standard infill patterns
   - Cura includes many infill options
   - That don't require the Tiled Infill plugin

6. **Check the plugin log**:
   - "I checked CuraEngineTiledInfill.log"
   - The log shows the specific missing library versions
   - Use this to determine what to update
   - GLIBCXX and GLIBC version requirements

7. **Report the issue**:
   - "It looks like this bug: https://github.com/Ultimaker/CuraEngine_plugin_infill_generate/issues/7"
   - Report on the plugin's GitHub repository
   - Include your system specifications
   - And the exact error messages

### Community Report

> "Slice failed with multiple projects that works on 5.3.1. I checked CuraEngineTiledInfill.log and found: curaengine_plugin_infill_generate: /usr/lib64/libstdc++.so.6: version 'GLIBCXX_3.4.32' not found. So it looks like it doesn't like my old system. I disabled 'Cura Engine Tiled Infill' plugin and slice works again. This appears to be the fix: https://stackoverflow.com/questions/76974555/glibcxx-3-4-32-not-found-error-at-runtime-gcc-13-2-0"

## 5. Printer Definition Version Mismatch After Windows Upgrade

### Symptom

After updating from Windows 10 to Windows 11, Cura slicing stops about halfway or fails completely. The user's printer is an FLSun V400. Running in compatibility mode doesn't help. The log shows: "Unable to upgrade file of type variant of version 4000020" and "Instance container flsun_v400_0.4 is outdated. Its setting version is 20 but it should be 25." The backend reports: "Trying to retrieve setting with no value given: speed_wall_0_roofing."

### Root Cause

"There is an error in your definition file of the printer and Cura cannot upgrade that definition due to the changes. Either this is caused by importing a project file or as a side effect of the windows upgrade." The Windows upgrade may have changed file permissions or paths, preventing Cura from properly upgrading the printer definition files. The printer definition has version 4000020, but the current setting version is 25. Cura can't upgrade the definition, leaving settings in an outdated state. The missing `speed_wall_0_roofing` setting causes the slice to fail.

### Fix

1. **Export custom profiles and materials**:
   - "Easiest way to resolve is by:"
   - "Exporting all your custom profiles and materials"
   - Settings > Profiles > Export
   - Settings > Materials > Export
   - Save to a separate location

2. **Clear the Cura cache and configuration**:
   - "Clearing the Cura cache and configuration (Local & Roaming)"
   - Navigate to `%LocalAppData%\cura\` and `%AppData%\cura\`
   - Delete or rename these folders
   - This removes all cached configuration

3. **Restart Cura and add printer fresh**:
   - "Starting Cura and importing the profiles and materials back after adding the printer"
   - Launch Cura
   - Add your printer as a new printer
   - Select the correct printer model

4. **Import profiles and materials**:
   - After adding the printer
   - Import your custom profiles
   - Import your custom materials
   - Verify settings are correct

5. **Don't use compatibility mode**:
   - "Tried running in compatibility mode to no avail"
   - Compatibility mode doesn't fix the version mismatch
   - Use the cache clearing method instead
   - It's more reliable

6. **Check the log for version warnings**:
   - "Unable to upgrade file of type variant of version 4000020"
   - "Its setting version is 20 but it should be 25"
   - These warnings confirm the version mismatch
   - Clearing the cache resolves it

7. **Attempt manual configuration fix**:
   - "Alternatively you can attempt to fix the configuration manually"
   - "But that is easier said than done"
   - Only attempt if you understand the configuration format
   - Otherwise, use the cache clearing method

8. **Reinstall Cura after Windows upgrade**:
   - After a major Windows upgrade
   - Consider reinstalling Cura completely
   - This ensures all paths and permissions are correct
   - And configuration is fresh

### Community Report

> "Newly updated to Win 11 from 10. When slicing, slice stops about halfway or fails. Tried running in compatibility mode to no avail. There is an error in your definition file of the printer and Cura cannot upgrade that definition due to the changes. Either this is caused by importing a project file or as a side effect of the windows upgrade. Instance container flsun_v400_0.4 is outdated. Its setting version is 20 but it should be 25. Easiest way to resolve: Exporting all your custom profiles and materials, clearing the Cura cache and configuration (Local & Roaming), starting Cura and importing the profiles and materials back after adding the printer."

## 6. Additional Ultimaker Cura Issues

### Raft and Lightning Infill Slicing Failure

**Issue**: "Slicing would fail when both Raft build plate adhesion and Support Lightning Infill were enabled."
**Fix**: Update to the latest Cura version. This was resolved in a recent release. Check the release notes for the fix version.

### Tree Support Slicing Crash

**Issue**: "Fixed some slicing crashes with tree support."
**Fix**: Update to the latest Cura version. Tree support crashes have been fixed. Check the release notes for specific fixes.

### Self-Intersecting Polygons Crash

**Issue**: "Fixed a significant amount of crashes that are caused by self intersecting polygons."
**Fix**: Update to the latest Cura version. Self-intersecting polygon crashes are fixed. Use mesh repair tools for problematic models.

### Overhang Angle 90 Degrees Slice Failure

**Issue**: "Fixed a bug where a slice would fail if the overhang angle was set to 90 degrees."
**Fix**: Update to the latest Cura version. Or reduce the overhang angle to less than 90 degrees. This was a known bug that's now fixed.

### Skirt Larger Than Build Plate

**Issue**: "Fixed a slicing crash if the skirt was larger than the build plate."
**Fix**: Update to the latest Cura version. Or reduce the skirt line count/distance. Ensure the skirt fits within the build plate.

### Painted Model Crash on Printer Switch

**Issue**: "Fixed a bug where Cura would crash if you switched to another printer with a painted model."
**Fix**: Update to the latest Cura version. Clear paint before switching printers. Re-paint after switching if needed.

### Gradual Flow Plugin Crash

**Issue**: "Slicing crashes when the plugin was used in combination with a large number of smaller models."
**Fix**: "Moved the Gradual Flow Engine Plugin to CuraEngine; this also resolved slicing crashes." Update to the latest Cura version.

### Connect Top/Bottom Polygons Crash

**Issue**: "Fixed a bug where Connect Top/Bottom Polygons would cause a slicing crash."
**Fix**: Update to the latest Cura version. Or disable Connect Top/Bottom Polygons in settings. This was a known crash that's now fixed.

### Slow Slicing with Many Holes

**Issue**: "Fixed significantly slower slicing for models with a lot of holes."
**Fix**: Update to the latest Cura version. Slicing speed for models with many holes is improved. Check the release notes for the fix version.

### Slice Crash from Inward Infill Move

**Issue**: "Addressed a CuraEngine issue that caused slicing to crash when generating the inward infill move."
**Fix**: Update to the latest Cura version. "Making slicing more robust for tricky geometries."

## Best Practices

1. **Clear configuration folder for slicing failures** — fixes corrupted upgrades
2. **Don't install new Cura versions over old ones** — causes configuration corruption
3. **Export profiles before upgrading** — allows easy recovery
4. **Disable USB Printing plugin if slicing hangs** — prevents serial device conflicts
5. **Disconnect USB-C monitors and hubs** — can present as serial devices
6. **Check for invalid setting values (0.0, empty)** — causes silent slicing crashes
7. **Keep backups of Cura configuration** — revert when crashes appear
8. **Disable Tiled Infill on older Linux systems** — GLIBCXX version mismatch
9. **Clear Cura cache after Windows upgrades** — fixes printer definition version mismatch
10. **Keep Cura updated** — each release fixes multiple slicing crashes
