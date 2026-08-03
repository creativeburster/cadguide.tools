---
title: "3DEXPERIENCE SOLIDWORKS Connection Error After Platform Upgrade, MySession Refresh Freeze on Large Assemblies, On-the-Fly Conversion Performance Degradation, Multi-Configuration Save Delays, and xCAD Connector Reinstall: Trusted Sites, Asynchronous Refresh, Dynamic Tree Expansion, and Clean Reinstall"
excerpt: "3DEXPERIENCE integration with SOLIDWORKS fails for 5 distinct reasons: unable to connect after platform upgrade from security settings blocking *.3ds.com requiring trusted sites configuration, MySession refresh freeze on large assemblies from synchronous data retrieval requiring asynchronous refresh, on-the-fly conversion performance degradation from platform-native Physical Products requiring local file caching, multi-configuration save delays from mapped attributes requiring attribute optimization, and xCAD Connector corruption requiring clean reinstall. We cover each with fixes from Dassault and Hawk Ridge Systems."
category: "platform-integration-and-connection-errors"
softwareSlug: "3dexperience"
keyword: "3DEXPERIENCE SOLIDWORKS unable to connect platform upgrade trusted sites MySession refresh freeze large assembly asynchronous retrieval on-the-fly conversion Physical Products multi-configuration save delays xCAD Connector clean reinstall"
slug: "3dexperience-solidworks-connection-error-upgrade-mysession-freeze-large-assembly-conversion-performance-multi-config-save-delays-xcad-connector-reinstall-trusted-sites-async-refresh-dynamic-tree-clean-reinstall"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://support.hawkridgesys.com/hc/en-us/articles/37491616937741-Restore-the-Connection-between-SOLIDWORKS-and-the-3DEXPERIENCE-Platform"
  - "https://3dswym.3dexperience.3ds.com/wiki/solidworks-news-info/understanding-solidworks-my-session-architecture-and-optimizing-performance-solidpractices_bJFmXC4ZTxedM2WKrd0kUw"
  - "https://seacadtech.com/blog/3dexprienc-platform-upgrade-to-r2025x-additional-information/"
---

# 3DEXPERIENCE SOLIDWORKS Connection Error After Platform Upgrade, MySession Refresh Freeze on Large Assemblies, On-the-Fly Conversion Performance Degradation, Multi-Configuration Save Delays, and xCAD Connector Reinstall: Trusted Sites, Asynchronous Refresh, Dynamic Tree Expansion, and Clean Reinstall

3DEXPERIENCE integration with SOLIDWORKS produces errors from platform upgrade security changes, MySession synchronous refresh, on-the-fly conversion of platform-native components, multi-configuration attribute mapping, and xCAD Connector corruption. This guide covers the 5 most common 3DEXPERIENCE integration problems with diagnostic steps and community-verified fixes from Dassault Systèmes and Hawk Ridge Systems.

## 1. Unable to Connect to 3DEXPERIENCE After Platform Upgrade

### Symptom

After a 3DEXPERIENCE platform upgrade to R2025x, SOLIDWORKS Connected can't connect to the platform. Shortly after the MySession app loads, an "Unable to connect to 3DEXPERIENCE" dialog appears. In other cases, users encounter a blank white login dialog or a blank blue login dialog. Minimizing, ignoring, or closing the dialog triggers the error message. SOLIDWORKS Desktop + Design users also experience challenges but SOLIDWORKS Connected is most affected.

### Root Cause

"Unable to connect to 3DExperience after platform upgrade." Platform updates at the user level have introduced issues, most noticeably impacting SOLIDWORKS Connected. The upgrade changes security configurations, authentication tokens, and CEF (Chromium Embedded Framework) cache. The old CEF cache and cookies become incompatible with the upgraded platform's authentication flow. Firewall, VPN, proxy server, and Zero Trust Network Access (ZTNA) solutions may block the new platform endpoints. The Internet Explorer security zone settings (used by CEF for authentication) don't include the upgraded platform URLs.

### Fix

1. **Add *.3ds.com to Trusted Sites**:
   - "Add *.3ds.com (and/or https://*.3ds.com) to the sites list in your Trusted sites zone"
   - Internet Options > Security > Trusted Sites > Sites
   - Add `*.3ds.com`
   - Add `https://*.3ds.com`

2. **Reset Internet Explorer**:
   - "Delete the Internet Explorer 11 cache (INetCache)"
   - "Reset the Internet zone to the default level"
   - "Restore advanced settings"
   - CEF uses IE security settings for authentication

3. **Run the Cloud Eligibility Checker**:
   - "Run the Cloud Eligibility Checker provided by Dassault Systèmes"
   - "To ensure your environment meets the requirements"
   - Check network bandwidth and latency
   - Verify all required domains and ports are open

4. **Check firewall and VPN settings**:
   - "Make sure that the connection is not being blocked by network security solutions"
   - "Like a firewall, Virtual Private Network (VPN), proxy server, and Zero Trust Network Access (ZTNA)"
   - Add exceptions for *.3ds.com domains
   - Disable VPN temporarily to test

5. **Clean uninstall and reinstall SOLIDWORKS Connected**:
   - "Clean uninstall SOLIDWORKS Connected and 3DEXPERIENCE Launcher"
   - Uninstall: 3DEXPERIENCE Launcher, CEF for SOLIDWORKS Applications, Dassault Systemes SOLIDWORKS 3DEXPERIENCE R202Xx
   - Delete: `%localappdata%\DassaultSystemes`, `%appdata%\DassaultSystemes`, `%programdata%\DassaultSystemes\3DEXPERIENCELauncher`
   - Reinstall SOLIDWORKS Connected from the platform

6. **Reboot before reinstalling**:
   - "It's always better to take precautions than to deal with issues later"
   - "Reboot the system before beginning the installation process"
   - "This helps prevent conflicts with processes such as PLMCSA and EDMServerV6"
   - "Which may have DLLs in use"

7. **Uninstall and reinstall xCAD Connector (Design with SOLIDWORKS only)**:
   - "Uninstalling and reinstalling the application that provides this connection"
   - "This step is only applicable to users with Design with SOLIDWORKS / Collaborative Designer for SOLIDWORKS"
   - Windows Start Menu > Add or Remove Programs
   - Locate and uninstall "Dassault Systèmes xCAD Connectors 3DEXPERIENCE R202Xx"
   - Relaunch Design with SOLIDWORKS from the platform to trigger reinstallation

### Community Report

> "Shortly after the MySession app loads, an 'Unable to connect to 3DEXPERIENCE' dialog appears. In other cases, users encounter a blank white login dialog following MySession's load. A similar problem arises with a blank blue login dialog. Add *.3ds.com to the sites list in your Trusted sites zone. Reset Internet Explorer. Clean uninstall/reinstall SOLIDWORKS Connected."

## 2. MySession Refresh Freeze on Large Assemblies

### Symptom

When working with large assemblies in SOLIDWORKS with the 3DEXPERIENCE tab active, MySession refreshes freeze SOLIDWORKS. The freeze occurs when switching documents, rebuilding, or performing other actions that trigger a MySession refresh. SOLIDWORKS becomes "Not Responding" during the refresh. Large assemblies with many instances are most affected.

### Root Cause

"MySession content refreshes as needed beginning with 3DEXPERIENCE R2024x FD03 July 2024 Update and SOLIDWORKS 2024 Service Pack 2.0 and higher." Before this update, MySession refreshed synchronously — all data (SOLIDWORKS and 3DEXPERIENCE) was retrieved in the main UI thread, freezing SOLIDWORKS. "The MySession app refreshes the content in two steps since 3DEXPERIENCE R2024x General Availability (GA). Reducing the amount of time SOLIDWORKS is frozen or unusable during a MySession refresh is the reason for this change." However, even with asynchronous refresh, the first step (retrieving SOLIDWORKS information) still occurs in the main UI thread and can freeze SOLIDWORKS for large assemblies.

### Fix

1. **Update to R2024x FD03 or later**:
   - "MySession content refreshes as needed beginning with 3DEXPERIENCE R2024x FD03"
   - "SOLIDWORKS 2024 Service Pack 2.0 and higher"
   - This enables refresh-only-when-needed behavior
   - And asynchronous retrieval of 3DEXPERIENCE data

2. **Disable "Refresh MySession after opening files"**:
   - "When you disable 'Refresh MySession after opening files' in Options from the Tools tab"
   - "Opening the file will load only the first level of child components"
   - "Subsequent expansion only opens one level at a time"
   - "Helping reduce load times and improving file structure browsing"

3. **Use Dynamic Tree Expansion**:
   - "Dynamic Tree Expansion In MySession — open and navigate large assemblies easily"
   - "Experience better performance when opening large models with complex assembly structures"
   - "The entire tree structure in MySession is completely expanded and updates on each file"
   - "Now when you disable refresh, it loads only the first level"

4. **Reduce the number of rows in MySession**:
   - "This option may help improve refresh performance if you work with very large SOLIDWORKS Assembly structures"
   - "With many instances and you notice a delay updating the 3DEXPERIENCE information in MySession"
   - "This reduces the number of rows to display within MySession"
   - Filter to show only the active document

5. **Save SOLIDWORKS files locally**:
   - "If you have saved SOLIDWORKS files on your computer you may experience much less network activity"
   - "With the 3DEXPERIENCE platform network services during the open procedure"
   - Local files don't require network download
   - Significantly reducing open time

6. **Run the Performance Evaluation tool**:
   - "A good place to start is to run the Performance Evaluation tool"
   - If SOLIDWORKS takes a very long time to open files
   - And the network requests happen very fast
   - The issue is local, not network-related

7. **Check network performance**:
   - "Your network performance (bandwidth and latency) is a key influencer"
   - "For the time that it takes to download the SOLIDWORKS files"
   - "Check your network performance by running the Cloud Eligibility tool"
   - Improve network bandwidth if possible

### Community Report

> "The MySession app refreshes the content in two steps since 3DEXPERIENCE R2024x General Availability (GA). Step 1: Retrieve SOLIDWORKS information from memory — occurs within the main user interface thread. Step 2: Retrieve 3DEXPERIENCE information — happens on a secondary thread giving the user back control in SOLIDWORKS. Dynamic Tree Expansion In MySession — open and navigate large assemblies easily. When you disable 'Refresh MySession after opening files,' opening the file will load only the first level of child components."

## 3. On-the-Fly Conversion Performance Degradation from Platform-Native Physical Products

### Symptom

Opening assemblies in SOLIDWORKS that contain Physical Products created directly within the 3DEXPERIENCE platform causes severe latency. SOLIDWORKS enters "Not Responding" during the conversion process. Opening speeds are significantly degraded compared to SOLIDWORKS-native parts. Top-level assemblies can no longer be opened once a threshold is reached.

### Root Cause

Platform-native Physical Products (including Duplicates and those created using SOLIDWORKS templates) require on-the-fly conversion when opened in SOLIDWORKS. The conversion process downloads the 3DXML data from the platform, converts it to SOLIDWORKS format, and loads it into memory. This process is network-dependent and CPU-intensive. "If the SOLIDWORKS file does not exist in your local work folder, the time to open data is heavily dependent on the network plus the time to open the SOLIDWORKS data in SOLIDWORKS." The 2026 update decreased the assembly opening threshold, making the problem worse.

### Fix

1. **Save SOLIDWORKS files locally**:
   - "If you have saved SOLIDWORKS files on your computer"
   - "You may experience much less network activity"
   - "With the 3DEXPERIENCE platform network services during the open procedure"
   - Always save files to local work folder after first open

2. **Use the 3DEXPERIENCE local cache**:
   - The platform maintains a local cache of downloaded files
   - Ensure the cache is not cleared unnecessarily
   - Check cache settings in the 3DEXPERIENCE Configuration
   - Increase cache size if possible

3. **Pre-download assemblies before opening**:
   - Use the 3DEXPERIENCE web interface to download assemblies
   - Then open the local copy in SOLIDWORKS
   - This avoids on-the-fly conversion during opening
   - And reduces SOLIDWORKS freeze time

4. **Convert Physical Products to SOLIDWORKS parts**:
   - Open the Physical Product in SOLIDWORKS
   - Save As a SOLIDWORKS native part
   - Replace the Physical Product in the assembly
   - With the SOLIDWORKS native part

5. **Simplify large assemblies**:
   - Use simplified configurations for large assemblies
   - Suppress non-critical components
   - Reduce the number of Physical Products
   - Use envelope parts for reference

6. **Check network performance**:
   - "The size of the SOLIDWORKS files and your network performance"
   - "Are the key influencers for the time to open"
   - Run the Cloud Eligibility tool
   - Improve network bandwidth if possible

7. **Use SOLIDWORKS PDM for large assemblies**:
   - Consider using SOLIDWORKS PDM instead of 3DEXPERIENCE
   - For very large assemblies
   - PDM provides local file access
   - Without on-the-fly conversion

### Community Report

> "Opening assemblies in SOLIDWORKS that contain Physical Products created directly within the 3DEXPERIENCE platform causes severe latency. SOLIDWORKS enters 'Not Responding' during the conversion process. If the SOLIDWORKS file does not exist in your local work folder, the time to open data is heavily dependent on the network plus the time to open the SOLIDWORKS data in SOLIDWORKS."

## 4. Multi-Configuration Save Delays from Mapped Attributes

### Symptom

Saving assemblies with multi-configuration files that have mapped 3DEXPERIENCE attributes takes dramatically longer than saving without the 3DEXPERIENCE integration. The save time increases with the number of configurations and mapped attributes. In some cases, saves can take minutes instead of seconds.

### Root Cause

When SOLIDWORKS files with multiple configurations are saved with 3DEXPERIENCE integration, the platform needs to update the attribute mapping for each configuration. Each configuration's mapped attributes must be synchronized with the platform, requiring network requests. The more configurations and mapped attributes, the more network requests, and the longer the save takes. The synchronization happens synchronously in the main thread, freezing SOLIDWORKS during the save.

### Fix

1. **Reduce the number of mapped attributes**:
   - Review which attributes are mapped to 3DEXPERIENCE
   - Remove non-essential attribute mappings
   - Only map attributes that need platform visibility
   - This reduces the number of synchronization requests

2. **Reduce the number of configurations**:
   - Consolidate configurations where possible
   - Use design tables instead of multiple configurations
   - Remove unused configurations
   - Fewer configurations = fewer sync requests

3. **Save without 3DEXPERIENCE sync for local work**:
   - Temporarily disable the 3DEXPERIENCE tab
   - Save locally without platform sync
   - Re-enable when ready to sync
   - This speeds up local saves

4. **Use Save As instead of Save for large changes**:
   - Save As can be faster than incremental Save
   - For large changes, use Save As
   - This replaces the file instead of updating
   - And may reduce sync overhead

5. **Optimize network performance**:
   - Each mapped attribute requires a network request
   - Faster network = faster saves
   - Use a wired connection instead of Wi-Fi
   - Reduce network latency to the platform

6. **Batch save configurations**:
   - Instead of saving all configurations at once
   - Save configurations in smaller batches
   - This reduces the peak sync load
   - And prevents long freezes

7. **Update to the latest 3DEXPERIENCE version**:
   - Newer versions may optimize attribute synchronization
   - Check release notes for performance improvements
   - Update to the latest hotfix
   - Attribute sync performance may be improved

### Community Report

> "Multi-configuration files with mapped attributes slow saves dramatically. Each configuration's mapped attributes must be synchronized with the platform, requiring network requests. The more configurations and mapped attributes, the more network requests, and the longer the save takes."

## 5. xCAD Connector Corruption Requiring Clean Reinstall

### Symptom

The connection between SOLIDWORKS and the 3DEXPERIENCE platform is broken or interrupted. The connection loads indefinitely without completing. Error messages appear when trying to connect. Standard troubleshooting (trusted sites, IE reset) doesn't resolve the issue. The xCAD Connector application may be corrupted or misconfigured.

### Root Cause

"Uninstalling and reinstalling the application that provides this connection." The xCAD Connector is the bridge between SOLIDWORKS Desktop and the 3DEXPERIENCE platform. Over time, updates, configuration changes, or corrupted installation files can cause the connector to malfunction. The connector's DLL files may be locked by running processes, preventing proper updates. The local cache and configuration files may become inconsistent with the platform version.

### Fix

1. **Uninstall the xCAD Connector**:
   - "Windows Start Menu > Add or Remove Programs"
   - "Locate and uninstall 'Dassault Systèmes xCAD Connectors 3DEXPERIENCE R202Xx'"
   - This removes the corrupted connector
   - And its configuration files

2. **Delete remaining installation data**:
   - "Locate folder listed below and delete it by using 'Run Command'"
   - Delete `%localappdata%\DassaultSystemes`
   - Delete `%appdata%\DassaultSystemes`
   - Delete `%programdata%\DassaultSystemes\3DEXPERIENCELauncher`

3. **Reboot the system**:
   - "It's always better to take precautions"
   - "Reboot the system before beginning the installation process"
   - "This helps prevent conflicts with processes such as PLMCSA and EDMServerV6"
   - "Which may have DLLs in use"

4. **Reinstall from the platform**:
   - "Launch Design with SOLIDWORKS from the 3DEXPERIENCE platform"
   - "This will prompt the reinstallation of the xCAD Connector"
   - The platform will download and install the latest connector
   - With correct configuration for the current platform version

5. **Verify connection after reinstall**:
   - After reinstallation, launch SOLIDWORKS
   - Check the 3DEXPERIENCE tab
   - Verify MySession loads correctly
   - Test file save and open operations

6. **Run Cloud Eligibility Checker**:
   - "Run the Cloud Eligibility Checker provided by Dassault Systèmes"
   - "To ensure your environment meets the requirements"
   - Verify all domains and ports are accessible
   - Check QA00000302341 in the Knowledge Base for details

7. **Contact support if issues persist**:
   - "If the connection issues persist, please contact our support team"
   - Contact Hawk Ridge Systems at 877.266.4469 (US) or 866.587.6803 (Canada)
   - Or contact Dassault Systèmes support directly
   - Provide error messages and troubleshooting steps already tried

### Community Report

> "If the above steps failed to restore your connection between SOLIDWORKS and the 3DEXPERIENCE platform, you can try uninstalling and reinstalling the application that provides this connection. This step is only applicable to users with Design with SOLIDWORKS / Collaborative Designer for SOLIDWORKS. Uninstall 'Dassault Systèmes xCAD Connectors 3DEXPERIENCE R202Xx' and relaunch from the platform to trigger reinstallation."

## 6. Additional 3DEXPERIENCE Issues

### CEF Browser Performance

**Issue**: The 3DEXPERIENCE tab uses Chromium Embedded Framework (CEF) which can be slow.
**Fix**: "If you experience a performance issue interacting with different apps within the 3DEXPERIENCE tab CEF browser instance, you may also experience the same issue within the stand-alone browser, such as Google Chrome." Test in Chrome to isolate CEF vs network issues.

### PLMCSA Server Download Slow

**Issue**: Downloading SOLIDWORKS files from the platform is slow.
**Fix**: "This is the PLMCSA server request operation to download SOLIDWORKS files. Your network performance (bandwidth and latency) is a key influencer. Check your network performance by running the Cloud Eligibility tool."

### SOLIDWORKS Reload API

**Issue**: Files need to be reloaded after platform changes.
**Fix**: "Similar with the addition of SOLIDWORKS reload API to reload files in session. The number of files downloaded may vary depending on the current state."

### SelectByID2 Communication

**Issue**: Selecting files in MySession doesn't select in SOLIDWORKS Feature Manager.
**Fix**: "The MySession app sends a Select message. SOLIDWORKS responds by calling the SelectByID2 method of the SOLIDWORKS API to select the file within the Feature Manager design tree."

### Rebuild Triggers MySession Refresh

**Issue**: Rebuilding in SOLIDWORKS triggers MySession refresh.
**Fix**: "The rebuild command in SOLIDWORKS triggers an event which causes the MySession App to perform a refresh." This is expected behavior. Disable auto-refresh if rebuilds are frequent.

### R2025x FD03 Dynamic Tree Expansion

**Issue**: Opening large assemblies in MySession is slow due to full tree expansion.
**Fix**: "Dynamic Tree Expansion In MySession — open and navigate large assemblies easily. When you disable 'Refresh MySession after opening files,' opening the file will load only the first level of child components. Subsequent expansion only opens one level at a time."

## Best Practices

1. **Add *.3ds.com to Trusted Sites** — prevents connection errors after upgrades
2. **Reset Internet Explorer cache** — CEF uses IE security settings
3. **Update to R2024x FD03 or later** — enables asynchronous MySession refresh
4. **Disable "Refresh MySession after opening files"** — speeds up large assembly opens
5. **Save SOLIDWORKS files locally** — reduces network dependency
6. **Reduce mapped attributes** — speeds up multi-configuration saves
7. **Clean reinstall xCAD Connector for persistent connection issues** — removes corruption
8. **Reboot before reinstalling** — prevents DLL conflicts
9. **Run Cloud Eligibility Checker** — verifies network compatibility
10. **Check release notes for performance improvements** — each update may help
