---
title: "Bluebeam Revu Hangs or Freezes from Alienware Command Center Graphics Hook, Stopped Working from Corrupted Profile, Periodic Freeze from Recent Files Network Drive Search, Slow Performance from Rendering Engine and Power Settings, and Blurred Garbled Text from AWCC Secondary Monitor: AWCC Update or Uninstall, Software Rendering, Profile Switch and Rebuild, Hardware Rendering and High Performance Power Plan, and Enable Recent Files Disable"
excerpt: "Bluebeam Revu fails for 5 distinct reasons: hangs or freezes from Alienware Command Center graphics driver hooks requiring AWCC update or uninstall, stopped working from corrupted profile requiring profile switch and rebuild, periodic 5-10 second freeze from Recent Files searching network drive requiring Enable Recent Files disable, slow performance from rendering engine and power settings requiring Hardware rendering and High Performance power plan, and blurred garbled text from AWCC secondary monitor requiring Software Rendering. We cover each with fixes from Bluebeam Technical Support and Community."
category: "freeze-and-performance-errors"
softwareSlug: "bluebeam-revu"
keyword: "Bluebeam Revu hangs freezes Alienware Command Center AWCC graphics hook stopped working corrupted profile periodic freeze Recent Files network drive slow performance rendering engine power settings blurred garbled text secondary monitor Software Rendering Hardware Rendering High Performance power plan"
slug: "bluebeam-revu-hangs-freezes-awcc-graphics-hook-stopped-working-corrupted-profile-periodic-freeze-recent-files-network-drive-slow-performance-rendering-engine-blurred-garbled-text-software-rendering"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://support.bluebeam.com/revu/troubleshooting/hangs-or-freezes-when-opening-a-pdf.html"
  - "https://support.bluebeam.com/revu/troubleshooting/error-revu-has-stopped-working.html"
  - "https://support.bluebeam.com/revu/troubleshooting/performance-improvement.html"
---

# Bluebeam Revu Hangs or Freezes from Alienware Command Center Graphics Hook, Stopped Working from Corrupted Profile, Periodic Freeze from Recent Files Network Drive Search, Slow Performance from Rendering Engine and Power Settings, and Blurred Garbled Text from AWCC Secondary Monitor: AWCC Update or Uninstall, Software Rendering, Profile Switch and Rebuild, Hardware Rendering and High Performance Power Plan, and Enable Recent Files Disable

Bluebeam Revu produces errors from AWCC graphics hooks, corrupted profiles, Recent Files network searches, rendering performance, and secondary monitor display issues. This guide covers the 5 most common Revu problems with diagnostic steps and community-verified fixes from Bluebeam Technical Support and Community.

## 1. Hangs or Freezes from Alienware Command Center Graphics Hook

### Symptom

Revu hangs, freezes, or causes graphical issues on Dell and Alienware computers running the Alienware Command Center (AWCC) application. The issue occurs on machines with an external graphics card (e.g., NVIDIA GeForce) and an external monitor set as the non-primary display. Users may also experience blurred and garbled text or elements skewed out of proportion.

### Root Cause

"These issues are most likely related to how the AWCC interacts with graphics card drivers. Monitoring and/or performance hooks may be injected into the graphics card drivers, which cause rendering or graphical issues on secondary monitors." AWCC injects monitoring and performance hooks into the graphics card drivers to track system performance. These hooks interfere with Revu's hardware rendering pipeline, especially when rendering to a secondary (non-primary) monitor. The hooks can cause the rendering pipeline to stall, resulting in hangs, freezes, or graphical corruption.

### Fix

1. **Update AWCC to the latest version**:
   - "Launch the AWCC application on your system"
   - "You should be prompted to install the latest update"
   - "After updating, reboot your system and note if the issue persists"
   - This is the first recommended fix

2. **Uninstall AWCC if update doesn't help**:
   - "If updating to the latest version of AWCC did not resolve your issue"
   - "Consider uninstalling the AWCC application from your system"
   - "Uninstall Alienware Command Center, Alienware Command Center Suite, and Alienware OC Controls"
   - "After uninstalling, reboot your system"

3. **Enable Software Rendering**:
   - "If the problem continues after attempting the solution(s) above, enable Software Rendering"
   - "Go to Revu > Preferences"
   - "In the Preferences sidebar, select Advanced"
   - "On the 2D Rendering tab, from the Rendering Engine dropdown menu, select Software"
   - "And then select OK"

4. **Set external monitor as primary**:
   - If using an external monitor
   - Set it as the primary display
   - This may avoid the secondary monitor rendering issue
   - That triggers the AWCC hook

5. **Use a single monitor**:
   - If the issue only occurs with dual monitors
   - Try using a single monitor
   - To verify if the AWCC hook
   - Is the root cause

6. **Update graphics drivers**:
   - Update NVIDIA or AMD drivers
   - To the latest version
   - From the manufacturer's website
   - Not from Windows Update

7. **Contact Bluebeam support**:
   - "If none of the suggested workarounds solve this issue, please contact us"
   - If the issue persists after all fixes
   - Contact Bluebeam Technical Support
   - With system details and crash information

### Community Report

> "Revu hangs, freezes, or causes graphical issues on some Dell and Alienware computers running the Alienware Command Center (AWCC) application. This issue is most likely to occur on machines equipped with an external graphics card and an external monitor set as the non-primary display. These issues are most likely related to how the AWCC interacts with graphics card drivers. Monitoring and/or performance hooks may be injected into the graphics card drivers, which cause rendering or graphical issues on secondary monitors."

## 2. Stopped Working from Corrupted Profile

### Symptom

PDF files do not open in Revu and only the File tab is visible. The error message "Bluebeam Revu has stopped working. Windows is checking for a solution to the problem." appears when attempting to close the document or Revu. The issue may be profile-specific — other profiles may work fine.

### Root Cause

"This could happen because there's a problem with the Revu Profile you're using." The Revu profile contains user settings, tool sets, and interface configurations. If the profile becomes corrupted (from a crash, improper shutdown, or update), Revu can't properly initialize the PDF display, causing the "stopped working" error. The corruption may affect only the PDF rendering component, which is why the File tab still appears but PDFs don't display.

### Fix

1. **Start Revu without opening a document**:
   - "Start Revu without opening a document"
   - "Select a different profile and then open a file"
   - Don't open a PDF directly
   - Launch Revu first, then switch profiles

2. **Switch to a different profile**:
   - "Navigate to Revu > Profiles"
   - "Select a different Profile from the menu"
   - "Open a PDF file to see if it displays"
   - If the PDF displays, the original profile is corrupted

3. **Switch back to original profile**:
   - "If the file displays correctly, switch back to your original profile"
   - "By switching between profiles, functionality should return to the original profile"
   - Sometimes the act of switching profiles
   - Resets the corrupted state

4. **Delete the corrupted profile**:
   - "If this does not fix the problem, then the original profile will need to be deleted"
   - "Navigate to Revu > Profiles"
   - "Click Manage Profiles"
   - "Select the profile you wish to delete, and click Delete"

5. **Rebuild the profile**:
   - "If the profile you've deleted was a preloaded profile"
   - "A new copy will be automatically imported the next time Revu starts"
   - "If it was a custom profile or a preloaded profile that you customized"
   - "You'll need to rebuild it"

6. **Back up Revu settings**:
   - "Once you've rebuilt the profile, it's recommended to back up your Revu settings"
   - "The backup includes all your profiles and tool sets"
   - "And will be useful if you need to install Revu on a new machine"
   - Create backups regularly

7. **Note that tool sets are preserved**:
   - "Deleting the profile does not delete any tool sets"
   - "That may have been associated with it"
   - Tool sets are stored separately
   - And survive profile deletion

### Community Report

> "Your PDF files do not open in Revu and you only see the File tab. Bluebeam Revu has stopped working. This could happen because there's a problem with the Revu Profile you're using. Start Revu without opening a document, select a different profile and then open a file. If the file displays correctly, switch back to your original profile. If this does not fix the problem, the original profile will need to be deleted."

## 3. Periodic Freeze from Recent Files Network Drive Search

### Symptom

Revu freezes for 5-10 seconds approximately every 60 seconds. The freeze occurs even when not actively working on a document. The user has recently opened files stored on a network drive with slow response times (~10 seconds). No errors appear in the log files. The freeze makes Revu nearly unusable for continuous work.

### Root Cause

"I believe it was caused by Revu periodically searching for my recently opened files on a network drive that notoriously has about 10 second response times." Revu's "Enable Recent Files" feature periodically checks the file list to verify that recently opened files still exist and to update their thumbnails. When recent files are on a network drive with slow response times, each check takes several seconds, causing Revu to freeze. The check runs on the main thread, blocking the UI until the network response is received or times out.

### Fix

1. **Disable Enable Recent Files**:
   - "Unchecking 'Enable Recent Files' in Preferences > Interface > File Access solved the issue"
   - Go to Revu > Preferences > Interface > File Access
   - Uncheck "Enable Recent Files"
   - This immediately stops the periodic freeze

2. **Move recently opened files to local drive**:
   - If you need the Recent Files feature
   - Move recently opened files
   - From the network drive to a local drive
   - This eliminates the slow network check

3. **Use faster network connection**:
   - If files must remain on the network
   - Use a faster network connection
   - Or a local cache (e.g., OneDrive Files On-Demand)
   - To reduce response times

4. **Map network drive locally**:
   - Map the network drive
   - To a local drive letter
   - This may improve response times
   - Compared to UNC paths

5. **Clear recent files list**:
   - Clear the recent files list
   - Of any network drive paths
   - This removes the slow network checks
   - While keeping the feature enabled for local files

6. **Report the threading issue**:
   - "This function needs to be running on a separate thread"
   - "So that it does not freeze the application"
   - "When it struggles to access a file location"
   - Report to Bluebeam as a feature request

7. **Use offline mode for network files**:
   - If using Bluebeam Cloud or Studio
   - Download files for offline use
   - This makes them local
   - And eliminates network checks

### Community Report

> "Every 60 seconds or so, my Revu will freeze for 5-10 seconds. It turned out that unchecking 'Enable Recent Files' in Preferences > Interface > File Access solved the issue. I believe it was caused by Revu periodically searching for my recently opened files on a network drive that notoriously has about 10 second response times. This function needs to be running on a separate thread so that it does not freeze the application when it struggles to access a file location."

## 4. Slow Performance from Rendering Engine and Power Settings

### Symptom

Documents render and refresh slowly when zooming and navigating. Documents take longer than usual to open. The program becomes unresponsive. The interface is slow to respond to input. The issue may occur after a Revu update, Windows update, or on a new machine.

### Root Cause

Multiple causes contribute to slow performance: (1) Software rendering enabled instead of hardware rendering — software rendering uses CPU instead of GPU. (2) Aggressive Windows power saving settings — reduce display performance to save power. (3) Outdated Microsoft Visual C++ Redistributable — affects rendering of large images and scans. (4) Outdated .NET Framework — affects general program performance and file opening speed. (5) Partial rendering mode causing excessive redraws.

### Fix

1. **Use Hardware rendering**:
   - "Hardware rendering generally works best, especially if you have a dedicated graphics card"
   - "Go to Revu > Preferences"
   - "In the Preferences dialog, select Advanced"
   - "Select the 2D Rendering tab"
   - "From the Rendering Engine dropdown menu, select Hardware"

2. **Use Wait for Completion rendering mode**:
   - "The Wait for Completion rendering mode disables partial redrawing of the display"
   - "The screen will not update until the full page is ready to display"
   - "Which reduces the total redraw time for the PDF, especially for 4k displays"
   - From the Rendering Mode dropdown, select "Wait for completion"

3. **Set Windows power to High Performance**:
   - "Aggressive power saving settings sacrifice display performance"
   - "To reduce power consumption and extend battery life"
   - "Click Start, type power settings, and select Choose a power plan"
   - "Select the High performance or Maximum performance setting"

4. **Update Microsoft Visual C++ Redistributable**:
   - "Install the latest version of the Microsoft Visual C++ Redistributable"
   - "These updates will improve rendering performance for large images and scans within Revu"
   - Download from Microsoft's website
   - Install both x86 and x64 versions

5. **Update Microsoft .NET Framework**:
   - "Install the latest Microsoft .NET Framework that your PC can work with"
   - "Once the .NET installation is complete, documents will open faster"
   - "And the general performance and responsiveness of the program will improve"
   - Restart after installation

6. **Check RAM and file location**:
   - "How much RAM does this computer have?"
   - "Are you accessing the files locally or across a network?"
   - Ensure adequate RAM (8GB+ recommended)
   - Access files locally for best performance

7. **Check for 4K display impact**:
   - "Are you using a high resolution monitor, such as a 4K display?"
   - 4K displays require more rendering power
   - Use Wait for Completion rendering mode
   - And ensure hardware rendering is enabled

8. **Contact Technical Support**:
   - "If none of the steps above improve your performance, please contact the Support team"
   - "You'll get the fastest resolution by opening Revu and going to Help > Report an Issue"
   - "Which attaches the Revu log files and settings to a new email message"
   - Include detailed description and sample files

### Community Report

> "Documents render and refresh slowly when zooming and navigating. Documents take longer than usual to open. Program becomes unresponsive. Revu includes multiple rendering engine options. Hardware rendering generally works best. The Wait for Completion rendering mode disables partial redrawing of the display, which reduces the total redraw time for the PDF, especially for 4k displays. Aggressive power saving settings sacrifice display performance. Install the latest version of the Microsoft Visual C++ Redistributable. Install the latest Microsoft .NET Framework."

## 5. Blurred Garbled Text from AWCC Secondary Monitor

### Symptom

Revu displays blurred and garbled text on a secondary monitor. Certain elements appear skewed out of proportion. The issue occurs on Dell/Alienware machines with AWCC installed, an external NVIDIA graphics card, and an external monitor set as the non-primary display. The text is readable on the primary monitor but corrupted on the secondary.

### Root Cause

"Users running the AWCC application might also experience issues such as blurred and garbled text or certain elements skewed out of proportion. These issues are most likely related to how the AWCC interacts with graphics card drivers. Monitoring and/or performance hooks may be injected into the graphics card drivers, which cause rendering or graphical issues on secondary monitors." AWCC's graphics hooks corrupt the rendering output when Revu renders to a secondary monitor. The hooks may alter the rendering pipeline's output, causing text to appear garbled and elements to be skewed.

### Fix

1. **Update AWCC**:
   - "Launch the AWCC application on your system"
   - "You should be prompted to install the latest update"
   - "After updating, reboot your system and note if the issue persists"
   - This is the first recommended fix

2. **Uninstall AWCC**:
   - "If updating did not resolve your issue, consider uninstalling the AWCC application"
   - "Uninstall Alienware Command Center, Alienware Command Center Suite, and Alienware OC Controls"
   - "After uninstalling, reboot your system"
   - This removes the graphics hooks entirely

3. **Enable Software Rendering**:
   - "If the problem continues, enable Software Rendering"
   - "Go to Revu > Preferences > Advanced > 2D Rendering tab"
   - "From the Rendering Engine dropdown menu, select Software"
   - Software rendering bypasses the graphics hooks

4. **Set secondary monitor as primary**:
   - If the issue only occurs on the secondary monitor
   - Set it as the primary display
   - The AWCC hooks may not affect
   - The primary monitor's rendering

5. **Use matching resolutions**:
   - Ensure both monitors use
   - The same resolution and scaling
   - Mismatched settings can cause
   - Rendering corruption

6. **Update graphics drivers**:
   - Update NVIDIA drivers
   - From NVIDIA's website
   - Newer drivers may resolve
   - The AWCC hook interference

7. **See Graphical issues in Revu menus and interface**:
   - "Please see Graphical issues in Revu menus and interface"
   - Refer to Bluebeam's graphical issues guide
   - For additional troubleshooting steps
   - Specific to interface rendering

### Community Report

> "Users running the AWCC application might also experience issues such as blurred and garbled text or certain elements skewed out of proportion. These issues are most likely related to how the AWCC interacts with graphics card drivers. Monitoring and/or performance hooks may be injected into the graphics card drivers, which cause rendering or graphical issues on secondary monitors. If the problem continues after attempting the solution(s) above, enable Software Rendering."

## 6. Additional Bluebeam Revu Issues

### Multiple Monitors Performance

**Issue**: "Do you have multiple monitors?" — performance issues with multiple monitors.
**Fix**: Use matching resolutions on all monitors. Set the Revu monitor as primary. Ensure adequate graphics card RAM (8GB+). Try disabling one monitor to test.

### Network File Access Performance

**Issue**: "Are you accessing the files locally or across a network?" — slow performance with network files.
**Fix**: Copy files to local drive for editing. Use Bluebeam Studio for collaborative access. Map network drives to drive letters. Disable Recent Files feature if network is slow.

### 4K Display Performance

**Issue**: "Are you using a high resolution monitor, such as a 4K display?" — slow rendering on 4K.
**Fix**: Use Wait for Completion rendering mode. Ensure hardware rendering is enabled. Update graphics drivers. Use recommended scaling (not custom scaling).

### Report an Issue for Fast Support

**Issue**: How to get fastest support resolution.
**Fix**: "You'll get the fastest resolution by opening Revu and going to Help > Report an Issue, which attaches the Revu log files and settings to a new email message. Include a detailed description, attach relevant sample files, and answer questions about RAM, file location, monitors, and display resolution."

### Profile Backup and Restore

**Issue**: How to preserve settings when reinstalling.
**Fix**: "Back up your Revu settings. The backup includes all your profiles and tool sets, and will be useful if you need to install Revu on a new machine and keep current settings." Use Revu > Profiles > Manage Profiles to export profiles.

### Tool Sets Not Deleted with Profile

**Issue**: Concern about losing tool sets when deleting a profile.
**Fix**: "Deleting the profile does not delete any tool sets that may have been associated with it." Tool sets are stored separately from profiles. They persist through profile deletion and recreation.

### Slow After Upgrade

**Issue**: "Are you experiencing slow document rendering or a slow interface after upgrading to Revu?"
**Fix**: After upgrading, update rendering engine settings, Visual C++, and .NET Framework. Old settings may not be optimal for the new version. Reset preferences if performance doesn't improve.

## Best Practices

1. **Uninstall AWCC on Dell/Alienware machines** — eliminates graphics hook interference
2. **Enable Software Rendering if hardware rendering causes issues** — bypasses graphics hooks
3. **Switch profiles for "stopped working" errors** — identifies and fixes profile corruption
4. **Disable Enable Recent Files for network drives** — prevents periodic 5-10 second freezes
5. **Use Hardware rendering with Wait for Completion** — best performance for most setups
6. **Set Windows to High Performance power plan** — prevents power saving from throttling rendering
7. **Update Visual C++ and .NET Framework** — improves rendering and general performance
8. **Keep files on local drive** — network file access causes slow opening and rendering
9. **Use matching monitor resolutions** — prevents rendering corruption on multi-monitor setups
10. **Back up Revu settings regularly** — enables quick recovery from profile corruption
