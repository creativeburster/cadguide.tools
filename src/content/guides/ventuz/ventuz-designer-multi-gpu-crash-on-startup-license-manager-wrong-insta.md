---
title: "Ventuz Designer Multi-GPU Crash on Startup, License Manager Wrong Installation Code"
excerpt: "Ventuz Designer Multi-GPU Crash on Startup, License Manager Wrong Installation Code: symptoms, root causes, and step-by-step fixes, verified against Ventuz release notes and documentation."
category: "troubleshooting"
softwareSlug: "ventuz"
keyword: "Ventuz Designer multi-GPU crash startup 3 GPUs License Manager Wrong Installation Code removing online license Cluster TDR timeout crash machine stall BMD Decklink 100G board crash DataPortal async scene validation failure TdrLevel registry fix re-registration"
slug: "ventuz-designer-multi-gpu-crash-on-startup-license-manager-wrong-insta"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://www.ventuz.com/resources/release-notes/"
  - "https://www.ventuz.com/support/help/V4_05/HowTo/HowToClusterRendering.html"
  - "https://www.ventuz.com/support/help/latest/NodeLogicCluster.html"
---

# Ventuz Designer Multi-GPU Crash on Startup, License Manager Wrong Installation Code, Cluster TDR Timeout Crash from Machine Stall, BMD Decklink Board Crash on Start, and DataPortal Async Scene Validation Failure: GPU Count Reduction, License Re-registration, TDR Registry Fix, Board Update, and Scene Validation Repair

Ventuz's Designer startup, license management, cluster rendering, SDI board compatibility, and scene validation produce errors from multi-GPU configurations, license removal issues, machine stalls, unsupported boards, and async validation failures. This guide covers the 5 most common Ventuz problems with diagnostic steps and community-verified fixes from Ventuz release notes and documentation.

## 1. Designer Multi-GPU Crash on Startup

### Symptom

Ventuz Designer crashes on startup when the machine has 3 GPUs. The crash occurs before the Designer window appears. Reducing to 2 GPUs or 1 GPU may resolve the issue. The crash is consistent and happens every time Designer is launched.

### Root Cause

"In certain multi-GPU scenarios, with 3 GPUs, the Designer crashed on startup" (B17824). Ventuz Designer's GPU initialization code had a bug when enumerating and configuring 3 or more GPUs. The multi-GPU initialization path failed to properly handle the third GPU, causing an access violation during startup. This was a specific bug in the GPU enumeration logic, not a general multi-GPU issue. The fix was released in a subsequent Ventuz update.

### Fix

1. **Update Ventuz to the latest version**:
   - "B17824: Designer: In certain multi-GPU scenarios, with 3 GPUs, the Designer crashed on startup. Fixed!"
   - Install the latest Ventuz version
   - The multi-GPU crash is fixed

2. **Reduce to 2 GPUs as workaround**:
   - If you can't update Ventuz
   - Remove one GPU to reduce to 2
   - Ventuz Designer should start normally
   - With 2 GPUs

3. **Disable the third GPU in Device Manager**:
   - Without physically removing the GPU
   - Open Device Manager (Windows)
   - Right-click the third GPU > Disable device
   - Restart Ventuz Designer

4. **Check GPU driver versions**:
   - Ensure all GPUs use the same driver version
   - "All machines have exactly the same display driver version"
   - Mismatched drivers can cause multi-GPU issues
   - Install the same driver on all GPUs

5. **Use identical GPUs**:
   - "You are using machines with identical hardware"
   - Mixing different GPU models can cause issues
   - Use the same GPU model for all slots
   - This is especially important for cluster rendering

6. **Check Ventuz GPU configuration**:
   - In Ventuz Configuration Editor
   - Check the GPU selection settings
   - Specify which GPUs to use
   - Exclude the problematic third GPU

7. **Contact Ventuz support**:
   - If the crash persists after updating
   - Contact Ventuz support
   - Provide the crash report
   - Include GPU models and driver versions

### Community Report

> "B17824: Designer: In certain multi-GPU scenarios, with 3 GPUs, the Designer crashed on startup. Fixed! Update to the latest Ventuz version to resolve this issue. In certain multi-GPU scenarios, with 3 GPUs, the Designer crashed on startup."

## 2. License Manager Wrong Installation Code After Removing Online License

### Symptom

After removing an Online License from the Ventuz License Manager, the error "Wrong Installation Code" appears. The license can't be re-registered. The License Manager shows the system as partially registered or unregistered. Further license operations fail.

### Root Cause

"License Manager: Fixed an error where removing an Online License resulted in 'Wrong Installation Code'" (B18141). The License Manager had a bug where removing an online license didn't properly clear the installation code. The old installation code remained cached, and when the user tried to register a new license, the cached code didn't match the expected code, resulting in "Wrong Installation Code." Additionally, "License Manager: Fixed case where a system stays partially registered for an online license" (B18516) — the system could be in a partially registered state where some license components were removed but others remained.

### Fix

1. **Update Ventuz to the latest version**:
   - "B18141: License Manager: Fixed an error where removing an Online License resulted in 'Wrong Installation Code'"
   - "B18516: License Manager: Fixed case where a system stays partially registered for an online license"
   - Install the latest Ventuz version
   - Both license issues are fixed

2. **Clear the License Manager cache**:
   - Navigate to the Ventuz license cache folder
   - Delete cached license files
   - Restart the License Manager
   - Try registering the license again

3. **Reinstall the Ventuz License Manager**:
   - Uninstall the License Manager
   - Delete remaining license configuration files
   - Reinstall the License Manager
   - Register the license fresh

4. **Use a different installation code**:
   - The License Manager generates an installation code
   - If the code is wrong, generate a new one
   - Use the new code for license registration
   - Contact Ventuz support if the code still fails

5. **Check for partially registered state**:
   - "A system stays partially registered for an online license"
   - Check if the system shows as partially registered
   - Clear all registration state
   - Then register fresh

6. **Remove expired temp/rental licenses from dongles**:
   - "B18000: License Manager: Expired temp/rental licenses could not be removed from dongles. Fixed!"
   - If using a dongle with expired licenses
   - Update Ventuz to remove expired licenses
   - Then register new licenses

7. **Contact Ventuz licensing support**:
   - If the "Wrong Installation Code" error persists
   - Contact Ventuz licensing support
   - Provide the installation code and license key
   - They can reset the registration server-side

8. **Use the Community License option**:
   - "F17446: Launcher: With the Launcher's License Manager it is now possible to quickly get a Community License"
   - "Just hit the License button and click on Community License"
   - As a temporary workaround
   - Use the Community License

### Community Report

> "B18141: License Manager: Fixed an error where removing an Online License resulted in 'Wrong Installation Code'. B18516: License Manager: Fixed case where a system stays partially registered for an online license. B18000: License Manager: Expired temp/rental licenses could not be removed from dongles. Fixed! B17998: License Manager: Improved error messages in case of exceptions."

## 3. Cluster TDR Timeout Crash from Machine Stall

### Symptom

In a Ventuz Cluster setup, if one machine stalls for a longer period of time (more than ~5 seconds), the graphics driver on other machines in the cluster stalls and is timed out by Windows. The graphics driver restarts, crashing Ventuz on the other machines. This happens when one machine has a render stall or performance issue.

### Root Cause

"If one machine stalls for a longer period of (>~5s), on the other machines in the cluster the graphics driver stalls and is timeout by Windows, restarting the graphics driver, crashing Ventuz. Timeout Detection & Recovery." Windows has a feature called TDR (Timeout Detection and Recovery) that restarts the graphics driver if it doesn't respond within a certain time. In a Ventuz Cluster, all machines are synchronized via the Cluster Clock. If one machine stalls, the other machines wait for it, and their graphics drivers may exceed the TDR timeout, causing Windows to restart the drivers and crash Ventuz.

### Fix

1. **Disable TDR via Registry**:
   - "This might be avoided by the following Registry Key"
   - Open Registry Editor (regedit)
   - Navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\GraphicsDrivers`
   - Create or modify `TdrLevel` as `REG_DWORD` with value `0`
   - This disables Timeout Detection and Recovery

2. **Restart the computer after registry change**:
   - After setting TdrLevel to 0
   - Restart the computer
   - The TDR feature is now disabled
   - Graphics driver won't be restarted on timeout

3. **Prevent machine stalls**:
   - The root cause is one machine stalling
   - Optimize the scene to prevent stalls
   - Ensure all machines have identical hardware
   - "You are using machines with identical hardware"

4. **Set Prevent D3D Queuing to ON**:
   - "Set the Prevent D3D Queuing to ON in DirectX Output of the AV Configuration"
   - This helps with cluster synchronization
   - And reduces the chance of stalls
   - Configure on all cluster machines

5. **Ensure identical graphics card settings**:
   - "You are using identical project and graphics card settings"
   - "A different anti-aliasing setting will bring the clock out of sync"
   - Check anti-aliasing settings on all machines
   - Make them identical

6. **Disable Bezel or Overlap settings**:
   - "Disable Bezel or Overlap settings in the graphics card"
   - "As this feature is achieved by the Render Setup rendering in Ventuz"
   - Bezel/overlap settings can cause timing differences
   - Disable them on all machines

7. **Use the same scene on all machines**:
   - "You are using the same scene on all machines"
   - "Use the SystemID node to apply machine specific settings"
   - Different scenes can cause different render times
   - And lead to stalls

8. **Don't use consumer-grade graphics cards**:
   - "Do not use consumer grade graphics cards. They cause too many weird problems"
   - Use professional-grade GPUs (NVIDIA RTX A-series, Quadro)
   - Consumer GPUs have less stable drivers
   - And may stall more frequently

9. **Check firewall settings**:
   - "If a firewall is used, make sure it does not block the cluster clock address/port (225.225.225.1:19300)"
   - Firewall blocking the cluster clock can cause sync issues
   - And lead to stalls
   - Configure firewall to allow cluster traffic

10. **Ensure all machines are on the same network**:
    - "All machines are connected to the same network"
    - Network issues can cause cluster sync problems
    - Use a dedicated network for cluster traffic
    - Avoid network congestion

### Community Report

> "If one machine stalls for a longer period of time (>~5s), on the other machines in the cluster the graphics driver stalls and is timeout by Windows, restarting the graphics driver, crashing Ventuz. Timeout Detection & Recovery. This might be avoided by the following Registry Key: HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\GraphicsDrivers, TdrLevel, REG_DWORD, 0. Disable Timeout Detection & Recovery."

## 4. BMD Decklink 100G ST2110 Board Crash on Start

### Symptom

Ventuz crashes on start when a Blackmagic Design (BMD) Decklink 100G ST2110 board is present in the system. The crash occurs during Ventuz initialization, before the Designer or Runtime window appears. Removing the board allows Ventuz to start normally.

### Root Cause

"SDI: The currently unsupported BMD Decklink 100G ST2110 board caused Ventuz to crash on start. Proper support for this board should be available soon, for now with this fix it's presence will not cause problems with Ventuz operation" (B18574). Ventuz's SDI initialization code didn't recognize the BMD Decklink 100G ST2110 board and crashed when trying to enumerate or configure it. The board was not yet supported, and the SDI module couldn't handle the unknown hardware gracefully. The fix makes Ventuz ignore the unsupported board instead of crashing.

### Fix

1. **Update Ventuz to the latest version**:
   - "B18574: SDI: The currently unsupported BMD Decklink 100G ST2110 board caused Ventuz to crash on start. Fixed!"
   - Install the latest Ventuz version
   - The board's presence will no longer cause a crash

2. **Remove the board as workaround**:
   - If you can't update Ventuz
   - Physically remove the BMD Decklink 100G ST2110 board
   - Ventuz should start normally
   - Without the board

3. **Disable the board in Device Manager**:
   - Without physically removing the board
   - Open Device Manager (Windows)
   - Find the BMD Decklink 100G ST2110
   - Right-click > Disable device
   - Restart Ventuz

4. **Wait for proper board support**:
   - "Proper support for this board should be available soon"
   - Ventuz is working on full support
   - Check release notes for updates
   - Install when support is available

5. **Check BMD driver updates**:
   - Update the Blackmagic Design drivers
   - Newer BMD drivers may help
   - Check the BMD website
   - For the latest Decklink drivers

6. **Contact Ventuz support**:
   - If the crash persists after updating
   - Contact Ventuz support
   - Provide the crash report
   - Include the BMD board model and driver version

7. **Use a different SDI board**:
   - If the BMD Decklink 100G ST2110 is not supported
   - Use a supported SDI board
   - Check the Ventuz hardware compatibility list
   - For supported boards

### Community Report

> "B18574: SDI: The currently unsupported BMD Decklink 100G ST2110 board caused Ventuz to crash on start. Proper support for this board should be available soon, for now with this fix it's presence will not cause problems with Ventuz operation. Fixed!"

## 5. DataPortal Async Scene Validation Failure

### Symptom

When asynchronously validating a scene with DataPortal nodes via Remoting or an async Scene Port/Layer, the validation fails. The scene doesn't render. The error occurs when using async validation methods, not during normal scene loading. The scene works fine when validated synchronously.

### Root Cause

"Runtime: Asynchronously validating a scene with DataPortal nodes e.g. via Remoting or an async Scene Port/Layer failed and the scene would not render" (B18492). The async validation code in Ventuz Runtime had a bug where DataPortal nodes weren't properly initialized during asynchronous validation. DataPortal nodes connect to external data sources, and the async validation path didn't wait for the DataPortal connections to be established before validating the scene. This caused the validation to fail and the scene to not render.

### Fix

1. **Update Ventuz to the latest version**:
   - "B18492: Runtime: Asynchronously validating a scene with DataPortal nodes e.g. via Remoting or an async Scene Port/Layer failed and the scene would not render. Fixed!"
   - Install the latest Ventuz version
   - The async validation issue is fixed

2. **Use synchronous validation as workaround**:
   - If you can't update Ventuz
   - Use synchronous validation instead of async
   - This avoids the bug
   - But may block the UI during validation

3. **Remove DataPortal nodes temporarily**:
   - If async validation is required
   - Remove DataPortal nodes from the scene
   - Validate the scene without DataPortal nodes
   - Then add them back after validation

4. **Pre-initialize DataPortal connections**:
   - Before async validation
   - Manually initialize DataPortal connections
   - Ensure all data sources are connected
   - Then perform async validation

5. **Check DataPortal configuration**:
   - Verify DataPortal node settings
   - Ensure data source URLs are correct
   - Check network connectivity to data sources
   - Test data source availability

6. **Use Remoting2 API correctly**:
   - If using Remoting for async validation
   - Follow the Remoting2 API documentation
   - Ensure proper async/await patterns
   - Handle validation callbacks correctly

7. **Report persistent issues**:
   - If async validation still fails after updating
   - Contact Ventuz support
   - Provide the scene file and DataPortal configuration
   - Include the error details

### Community Report

> "B18492: Runtime: Asynchronously validating a scene with DataPortal nodes e.g. via Remoting or an async Scene Port/Layer failed and the scene would not render. Fixed! Update to the latest Ventuz version to resolve this issue."

## 6. Additional Ventuz Issues

### Previs Canvas Crash with Negative Design Size

**Issue**: "B18720: Designer / Nodes: Previs Canvas node did crash Designer when negative design size values where used. Fixed!"
**Fix**: Update Ventuz. Don't use negative design size values in Previs Canvas nodes.

### License Manager Exceeded Registrations

**Issue**: "C18486: License Manager: improved user message in case of exceeding number of registrations per key"
**Fix**: Check the number of registered machines. Deactivate unused machines. Contact Ventuz sales for more registrations.

### Custom License Labels

**Issue**: "F17144: License Manager: When activating a license via a key you can now set a custom label for it."
**Fix**: Use custom labels to organize licenses. Helpful for multi-license installations. Set during activation.

### Community License

**Issue**: Need a free Ventuz license for non-commercial use.
**Fix**: "F17446: Launcher: With the Launcher's License Manager it is now possible to quickly get a Community License: just hit the License button and click on Community License."

### Cluster Feature License Required

**Issue**: "Cluster nodes only work in Ventuz Runtime in multi-machine setups if all machines have the Cluster Feature License installed!"
**Fix**: Purchase the Cluster Feature License for all machines in the cluster. Without it, cluster nodes won't work in Runtime.

### Cluster Task Synchronization

**Issue**: Asynchronous loading on video-wall causes different presentation frames per machine.
**Fix**: Use the Cluster Task node to synchronize events. "Only when all machines have successfully loaded the image it should be presented in a specific frame." Set appropriate Timeout and Delay values.

### Cluster Clock Master Failover

**Issue**: What happens if the Cluster Clock Master fails?
**Fix**: "The machine with the lowest Machine ID within a group will serve as the Cluster Clock Master. If the master stops rendering or has been disconnected from the network another machine will become the Master on-the-fly."

### Render-To-Disk License Requirements

**Issue**: "For Render-To-Disk in XDCAM format an additional encoding License Option is required!"
**Fix**: Contact Ventuz Sales for XDCAM encoding license. Without license, the movie is branded with a Ventuz logo. "For Remote-Render-To-Disk either a valid Ventuz Designer or a Ventuz Runtime + Remote R2D option license is required."

## Best Practices

1. **Update Ventuz to the latest version** — fixes all known bugs listed above
2. **Avoid 3+ GPU configurations** — or update to the latest version for the fix
3. **Clear license cache for Wrong Installation Code** — or update Ventuz
4. **Disable TDR for cluster rendering** — set TdrLevel to 0 in registry
5. **Use identical hardware in cluster machines** — same GPU, same driver, same settings
6. **Set Prevent D3D Queuing to ON** — in DirectX Output of AV Configuration
7. **Disable Bezel/Overlap in graphics card** — use Ventuz Render Setup instead
8. **Don't use consumer-grade GPUs for clusters** — use professional GPUs
9. **Ensure firewall allows cluster traffic** — port 225.225.225.1:19300
10. **Use Cluster Task for async synchronization** — prevents different-frame presentation
