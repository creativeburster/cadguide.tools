---
title: "Maxwell Render Network Rendering and Firefly Errors"
excerpt: "Maxwell Render Network Rendering and Firefly Errors: symptoms, root causes, and step-by-step fixes, verified against Maxwell Documentation and Forum."
category: "troubleshooting"
softwareSlug: "maxwell-render"
keyword: "Maxwell Render network node communication firewall TCP UDP ports 45454-45474 MXI merging different versions nodes version sync antivirus interferes network rendering node stop communicating AV exclusion fireflies noise ultra-reflective scene light sources denoiser scene openings render crash 9SL RAM exhaustion mirrored space resolution reduction"
slug: "maxwell-render-network-rendering-and-firefly-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://nextlimitsupport.atlassian.net/wiki/spaces/maxwell/pages/22686242/Network+troubleshooting"
  - "https://forum.maxwellrender.com/viewtopic.php?p=402128"
  - "https://forum.maxwellrender.com/viewtopic.php?f=1&p=399762&t=45682"
---

# Maxwell Render Network Rendering and Firefly Errors: Network Node Communication Fails from Firewall Blocking TCP UDP Ports 45454-45474 Requiring Firewall Rules, MXI Merging Fails from Different Maxwell Versions on Nodes Requiring Version Sync, Antivirus Interferes with Network Rendering Causing Node to Stop Communicating Requiring AV Exclusion, Fireflies and Noise in Ultra-Reflective Scene with Many Light Sources Requiring Denoiser and Scene Openings, and Render Crashes at 9SL from RAM Exhaustion in Complex Mirrored Space Requiring Resolution Reduction

Maxwell Render's network rendering, node communication, firefly generation, and memory management produce errors from firewall conflicts, version mismatches, antivirus interference, and scene complexity. This guide covers the 5 most common Maxwell Render problems with diagnostic steps and community-verified fixes from Maxwell Documentation and Forum.

## 1. Network Node Communication Fails from Firewall Blocking TCP UDP Ports

### Symptom

Maxwell Render Network Manager cannot detect nodes on the network. Nodes don't appear in the Monitor's Nodes panel. Network rendering jobs fail because no nodes are available. The Manager log shows no node connections.

### Root Cause

Maxwell Network uses TCP and UDP ports 45454-45474 by default. Firewalls on the Manager or Node computers block these ports, preventing communication. The Manager can't send jobs to nodes, and nodes can't return rendered MXI files. This is the most common network rendering issue.

### Fix

1. **Create firewall rules for Maxwell Network**:
   - Windows Firewall: "Allow an app through Windows Firewall"
   - Add mxnetwork application from the Maxwell installation folder

2. **Disable firewall for testing**:
   - Temporarily disable the firewall on all machines
   - Run a test job to verify communication
   - If the job succeeds, the firewall is the issue
   - Re-enable firewall with proper rules

3. **Change port range if needed**:
   - File > Preferences in Manager/Monitor/Node
   - Change the port range to a non-blocked range
   - Update all machines to the same port range

4. **Check Manager log for warnings**:
   - File > Preferences > Logging > Minimum Log Verbosity: Warnings
   - Check the log for node connection attempts
   - Identify which nodes are blocked

5. **Use gigabit network**:
   - Ensure all machines are on a gigabit network
   - Wi-Fi connections may be too slow or unreliable
   - Use wired Ethernet for network rendering

6. **Set computers to Never sleep**:
   - Power Options > Put the computer to sleep: Never
   - This prevents nodes from going offline during rendering

### Community Report

> "Make sure firewalls do not interfere by first running a job with firewalls disabled. Network uses by default the TCP and UDP port range of 45454-45474. You can change this port range but it is very important to change the range in the preferences of Manager/Monitor and all Nodes. Remember to turn off your firewall if you are getting issues detecting nodes."

## 2. MXI Merging Fails from Different Maxwell Versions on Nodes

### Symptom

Network cooperative rendering job completes on all nodes. The Manager attempts to merge the MXI files from each node. The merging process fails. The final image is not produced or is corrupted. The Manager log shows warnings about different versions.

### Root Cause

"Make sure the same version of Maxwell Render (and thus Network) is running on all your nodes. If an older version is running in one of the Nodes, the MXI merging process may fail." Different Maxwell versions produce MXI files with incompatible formats. The Manager can't merge MXI files from different versions.

### Fix

1. **Sync Maxwell versions on all nodes**:
   - Check version in the title window of Manager/Monitor/Node

2. **Check Manager log for version warnings**:
   - Set Minimum Log Verbosity to Warnings
   - Identify and update the outdated node(s)

3. **Update all machines simultaneously**:
   - Download the latest Maxwell Render version
   - Install on all machines before starting new jobs
   - Don't mix versions during a rendering job
   - Verify all nodes show the same version

4. **Use homogeneous network**:
   - Use similar GPUs and CPUs across nodes
   - This ensures consistent rendering and merging

5. **Check MXI file sizes**:
   - Check disk space before starting cooperative jobs

### Community Report

> "Make sure the same version of Maxwell Render is running on all your nodes. If an older version is running in one of the Nodes, the MXI merging process may fail. Many transference problems in the network are caused by having different Maxwell Render versions. Updating to the last version on all machines will ensure the best communication."

## 3. Antivirus Interferes with Network Rendering Causing Node to Stop Communicating

### Symptom**

A Maxwell Network Node stops communicating with the Manager during rendering. The node appears frozen in the Monitor but is actually still rendering. The node cannot be stopped from the Monitor. The issue is intermittent and affects random nodes.

### Root Cause

"We have had reports of Network behaving strangely, eventually a Node stops communicating with the Manager and seems frozen but it is in fact still rendering." Antivirus software (Avast, Windows Defender, and others) monitors file activity in the Maxwell installation folder and the temporary folder used by mxnetwork. The AV scanning slows down or blocks network communication, causing the node to appear frozen.

### Fix

1. **Exclude Maxwell folders from antivirus scanning**:
   - Add the Maxwell installation folder to AV exclusions
   - Add the temp folder to AV exclusions

2. **Find the temp folder location**:
   - Note the temp folder path
   - Add this path to AV exclusions

3. **Disable AV during rendering**:
   - As a temporary workaround
   - Disable antivirus on all rendering nodes
   - Run the rendering job
   - Re-enable AV after rendering completes

4. **Use Windows Defender exclusions**:
   - Windows Security > Virus & threat protection > Manage settings
   - Add or remove exclusions > Add an exclusion
   - Add the Maxwell installation folder
   - Add the mxnetwork temp folder

5. **Check for frozen nodes in Monitor**:
   - In the Monitor > Nodes panel
   - Check if any node shows "Rendering" but is unresponsive
   - Try to stop the node — if it doesn't stop, AV may be interfering
   - Apply the AV exclusion fix

6. **Use UNC paths for output**:
   - Use `\\computername\myfolder\myrender.png` format
   - This ensures all nodes can write to the output location
   - Local paths may not be accessible from all nodes

### Community Report

> "We have had reports of Network behaving strangely, eventually a Node stops communicating with the Manager and seems frozen but it is in fact still rendering. The node cannot be stopped from the Monitor. The solution was to prevent the Anti Virus application from monitoring the activity of the Maxwell install folder and the temporary folder that mxnetwork uses for network rendering."

## 4. Fireflies and Noise in Ultra-Reflective Scene with Many Light Sources

### Symptom

Rendering a very complex space: a windowless restaurant with segmented mirror cladding on all walls and a fully mirrored ceiling. Almost everything is reflective: chrome leather, silver fabric, brushed stainless steel. Many light sources: spotlights, chandeliers, lamps, glass wall lights. The render has a lot of noise and fireflies. Spotlights make things significantly worse. Infinite mirror reflections create a black horizon.

### Root Cause

Ultra-reflective scenes with many light sources create extremely complex light transport. Each light ray bounces between reflective surfaces many times, creating infinite mirror reflections. Spotlights produce concentrated high-intensity areas that generate fireflies (bright isolated pixels). The black horizon is a rendering artifact from the infinite mirror effect — light rays that bounce too many times lose energy and appear black.

### Fix

1. **Use Maxwell 5.1+ Denoiser with firefly removal**:
   - Enable Denoiser in render settings
   - Enable the firefly removal option
   - The denoiser can clean up most fireflies

2. **Reduce camera resolution**:
   - Lower resolution reduces memory usage
   - Use AI upscaling for final output if needed

3. **Add openings in the model**:
   - Remove or hide one wall to let light escape

4. **Reduce spotlight intensity**:
   - Reduce spotlight intensity
   - Use more diffuse area lights instead of spotlights
   - This reduces concentrated high-intensity areas

5. **Reduce material reflectivity**:
   - Not all surfaces need to be perfectly reflective
   - Reduce reflectivity slightly (e.g., 90% instead of 100%)
   - Add slight roughness to break up perfect reflections
   - This reduces infinite bounce paths

6. **Use the black horizon fix**:
   - Increase the maximum ray bounce depth
   - Or add a subtle environment light to fill dark areas
   - The black horizon is from rays exhausting their bounce limit

7. **Increase sampling level (SL)**:
   - Higher SL = more samples = less noise
   - But also longer render time
   - Use the denoiser to achieve clean results at lower SL
   - Balance SL with denoiser strength

8. **Use GPU engine improvements (Maxwell 5.1+)**:
   - Update to Maxwell 5.1 or later
   - GPU engine has improved firefly handling

### Community Report

> "I'm getting a lot of noise (or fireflies). The spotlights seem to make things significantly worse. The infinite mirror reflections are creating a sort of black horizon. Try using the Denoiser which has an option to remove fireflies. Including opening(s) in the model to allow light rays to exit the scene reduces the light rays bouncing around for longer periods."

## 5. Render Crashes at 9SL from RAM Exhaustion in Complex Mirrored Space

### Symptom

Rendering the ultra-reflective restaurant scene. The render crashes at 9 SL (Sampling Level). The crash occurs as the MXI file grows larger. The computer has limited RAM. The scene has extremely complex light transport with many reflective surfaces.

### Root Cause

Complex scenes with many reflective surfaces generate large MXI files. Each additional SL increases the MXI file size as more light paths are tracked. At 9 SL, the MXI file may exceed available RAM, causing the render to crash. The infinite mirror reflections create exponentially more light paths, each consuming memory.

### Fix

1. **Reduce render resolution**:
   - Halve the resolution to reduce memory by ~4x
   - Use AI upscaling for final output

2. **Disable Multilight**:
   - Disable Multilight if not needed
   - Multilight stores per-light contributions, increasing file size
   - This significantly reduces memory usage

3. **Reduce ray bounce depth**:
   - Lower the maximum ray bounces in render settings
   - This reduces the number of tracked light paths
   - Trade-off: less accurate reflections
   - But prevents memory exhaustion

4. **Use network rendering to distribute memory**:
   - Use cooperative network rendering
   - Each node renders a portion of the image
   - The memory load is distributed across nodes
   - The Manager merges the results

5. **Increase virtual memory / page file**:
   - Increase Windows page file size
   - System > Advanced > Performance > Virtual Memory
   - Set to 2-3x physical RAM
   - This provides overflow memory (slower but prevents crashes)

6. **Render in passes**:
   - Render the scene without reflective materials first
   - Then add reflections in a separate pass
   - Composite in post-production
   - This reduces per-render memory usage

7. **Use Maxwell 5.1+ GPU engine**:
   - GPU rendering uses GPU VRAM instead of system RAM
   - May have different memory limits
   - Test if GPU rendering avoids the crash

### Community Report

> "The render crashed at 9SL. Reducing the camera resolution to lower the file size being generated so it doesn't bomb-out as your RAM gets used up. When rendering at high resolution and especially with Multilight turned on, each MXI file can grow to several gigabytes. Ensure you have enough disc space available."

## 6. Additional Maxwell Render Issues

### Manager Does Not Receive Previews or MXI Files

**Issue**: "The manager does not receive the previews or the mxi files from the nodes at the end of the render."
**Fix**: "The firewall is blocking the incoming connections on the computer running the Manager. Create a rule in the Firewall so it allows the mxnetwork application to go through."

### Do Not Run Multiple Managers

**Issue**: "Do not run several Managers on the network."
**Fix**: "If you want to check the jobs running from several computers, you can run several Monitors on the network and add jobs from each one." Only one Manager is allowed.

### Send Files Option for Cross-Platform Networks

**Issue**: "When this option is on, any textures and extra files needed for the render are sent by the Monitor to all the Nodes."
**Fix**: "In general, it is recommended to leave this option disabled, unless you are on multi platform networks mixing OSX and Windows." Use shared network folders for textures.

### Denoiser Process Locks in nogui Mode

**Issue**: "Denoiser process could lock Maxwell Render in '-nogui' mode when the images are in TIF format."
**Fix**: Use PNG or EXR format instead of TIF for nogui mode. Update to Maxwell 5.1.1 where this was fixed.

### Firefly Cleanup Not Working on GPU

**Issue**: "Firefly cleanup was not working correctly on GPU."
**Fix**: Update to Maxwell 5.1.1 where GPU firefly cleanup was fixed. Use CPU engine as workaround for firefly-heavy scenes.

## Best Practices

1. **Create firewall rules for ports 45454-45474** — most common network rendering fix
2. **Sync Maxwell versions on all nodes** — prevents MXI merging failures
3. **Exclude Maxwell folders from antivirus** — prevents node communication freezes
4. **Set all computers to Never sleep** — prevents nodes going offline during rendering
5. **Use UNC paths for output** — ensures all nodes can write to the output location
6. **Use gigabit wired network** — Wi-Fi is unreliable for network rendering
7. **Enable Denoiser with firefly removal for reflective scenes** — Maxwell 5.1+ feature
8. **Add openings in ultra-reflective scenes** — lets light rays escape, reduces noise
9. **Reduce resolution for complex scenes** — prevents RAM exhaustion crashes
10. **Disable Multilight for memory-critical renders** — MXI files grow to several GB with Multilight
