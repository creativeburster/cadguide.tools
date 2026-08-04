---
title: "pCon.planner Performance and Display Errors"
excerpt: "pCon.planner Performance and Display Errors: symptoms, root causes, and step-by-step fixes, verified against EasternGraphics Support and pCon Solutions FAQ."
category: "performance"
softwareSlug: "pconplanner"
keyword: "pCon.planner application error crash outdated GPU drivers RAM overload driver update memory management drawing parts disappear zooming UCS distance Place UCS as WCS Origin slow performance constant loading 3D Warehouse overload purge new file copy dedicated GPU not used laptops battery mode switching Windows graphics settings second monitor crash graphics card memory shortage single monitor operation"
slug: "pcon-planner-performance-and-display-errors"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
---

# pCon.planner Performance and Display Errors: Application Error Crash from Outdated GPU Drivers and RAM Overload Requiring Driver Update and Memory Management, Drawing Parts Disappear While Zooming from UCS Distance Requiring Place UCS as WCS Origin, Slow Performance and Constant Loading from 3D Warehouse Overload Requiring Purge and New File Copy, Dedicated GPU Not Used on Laptops from Battery Mode Switching Requiring Windows Graphics Settings, and Second Monitor Crash from Graphics Card Memory Shortage Requiring Single Monitor Operation

pCon.planner's GPU drivers, UCS positioning, 3D Warehouse loading, laptop GPU switching, and multi-monitor support produce errors from driver incompatibility, coordinate distance, element overload, battery mode switching, and graphics memory shortage. This guide covers the 5 most common pCon.planner problems with diagnostic steps and community-verified fixes from EasternGraphics Support and pCon Solutions FAQ.

## 1. Application Error Crash from Outdated GPU Drivers and RAM Overload

### Symptom

pCon.planner shows an "Application error" message and crashes. The crash occurs during normal operation — editing, rendering, or navigating. The error message doesn't provide specific details about the cause. The crash may be intermittent or consistent depending on the project size.

### Root Cause

"This error message is often caused by the following: The system does not meet the system requirements. RAM load is too large. Nvidia graphic driver (external graphics card) is not up to date. Intel graphics driver is not up to date." The application error is a generic crash that can be caused by multiple system issues. The most common causes are: (1) insufficient system resources — pCon.planner requires significant RAM and GPU power, (2) outdated GPU drivers — the rendering engine depends on current driver APIs, (3) RAM overload — too many programs competing for memory, (4) Intel integrated graphics drivers outdated — even with a dedicated GPU, Intel drivers can conflict.

### Fix

1. **Update NVIDIA graphics driver**:
   - Download the latest driver from NVIDIA's website
   - Perform a clean install (not express)
   - Use drivers not older than 1 year

2. **Update Intel graphics driver**:
   - Download the latest Intel graphics driver
   - Even with a dedicated GPU, Intel drivers can conflict
   - Update both drivers

3. **Close programs while working**:
   - Close browser tabs, other CAD software, unnecessary applications
   - Free up RAM for pCon.planner
   - Monitor RAM usage in Task Manager

4. **Check system requirements**:
   - Verify your system meets minimum requirements
   - Check RAM, GPU, CPU specifications
   - Upgrade hardware if below minimum

5. **Check graphics info in pCon.planner**:
   - Verify the correct GPU is listed
   - Check driver version
   - Ensure pCon.planner is using the dedicated GPU

6. **Use software rendering mode**:
   - If hardware rendering crashes
   - Enable Software Rendering in Program Settings
   - This uses CPU instead of GPU
   - Slower but more stable on problematic systems

7. **Update pCon.planner**:
   - Check for updates
   - Install the latest version

### Community Report

> "pCon.planner Application error. This error message is often caused by the following: The system does not meet the system requirements. RAM load is too large — close programs while working in pCon.planner. Nvidia graphic driver is not up to date. Intel graphics driver is not up to date. Before reporting a problem, make sure you are working in the most recent version. Many problems have already been solved by working in the most recent version."

## 2. Drawing Parts Disappear While Zooming from UCS Distance

### Symptom

While zooming in on the drawing, parts of the drawing disappear. The disappearing happens while rotating or zooming. Some objects are visible, others are not. The issue is intermittent — parts may reappear and disappear as the view changes.

### Root Cause

"The reason that parts of the drawing disappear while rotating, is probably because the drawing is too far from the UCS (the cross in the drawing). It is possible that the UCS has been moved." The User Coordinate System (UCS) defines the origin point for the view. When geometry is very far from the UCS, the camera's near and far clipping planes can't encompass all geometry. Objects far from the UCS fall outside the clipping range and disappear. This is a camera/depth buffer issue — the depth buffer has limited precision, and geometry far from the origin exceeds the precision range.

### Fix

1. **Place UCS as WCS origin**:
   - This resets the UCS to the world coordinate system origin
   - The geometry should be centered around the origin
   - This fixes the depth buffer issue

2. **Move drawing to UCS**:
   - Select all geometry
   - Move it to the origin (0, 0, 0)

3. **Check UCS position**:
   - Look for the UCS cross in the drawing
   - If it's far from the geometry, that's the problem
   - The UCS may have been moved accidentally
   - Reset it to the WCS origin

4. **Use Zoom Extents**:
   - After resetting the UCS
   - Use Zoom Extents to frame all geometry
   - This ensures the camera encompasses all objects
   - Check if parts still disappear

5. **Verify geometry coordinates**:
   - Check if geometry has very large coordinates
   - Imported files may have offset coordinates
   - Move geometry to origin after import
   - Use the Move tool to center the drawing

6. **Avoid moving UCS accidentally**:
   - Be careful when using UCS tools
   - Don't move the UCS unless needed
   - If moved, always reset to WCS origin
   - Before zooming or rotating

### Community Report

> "Parts of the drawing disappear. While zooming in on your drawing, parts of the drawing disappear. The reason that parts of the drawing disappear while rotating, is probably because the drawing is too far from the UCS (the cross in the drawing). It is possible that the UCS has been moved. Right-click in the white area and click on Place UCS as WCS origin. Now select the drawing and move it to the UCS."

## 3. Slow Performance and Constant Loading from 3D Warehouse Overload

### Symptom

pCon.planner runs slow and is often loading. The application becomes unresponsive while navigating. Performance degrades as more elements are added from the 3D Warehouse. The drawing file size grows significantly. Simple operations take long to complete.

### Root Cause

"By placing many elements from the 3D Warehouse in the drawing, pCon.planner runs slower." 3D Warehouse elements are high-quality 3D models with detailed geometry and textures. Each element adds significant geometry data to the drawing. With many elements, the rendering engine must process all geometry for every frame. The file size grows, loading and saving take longer, and navigation becomes sluggish.

### Fix

1. **Clean up the drawing**:
   - Use File > Purge to remove unused elements
   - This removes deleted objects that are still in the file
   - Reduces file size and improves performance

2. **Copy/paste to a new file**:
   - Create a new empty file
   - Copy all elements from the old file
   - Paste into the new file
   - This removes accumulated file bloat

3. **Reduce 3D Warehouse elements**:
   - Don't place too many high-detail elements
   - Use simpler representations where possible
   - Remove unnecessary 3D Warehouse objects
   - Replace with simpler 2D representations

4. **Adjust Level of Detail**:
   - Lower the Level of Detail value
   - This improves performance at the cost of visual quality

5. **Disable synchronization options**:
   - Disabling these improves performance

6. **Reduce screen area**:
   - Don't maximize the pCon.planner window
   - Use a smaller window size

7. **Use single viewport**:
   - Multiple viewports require rendering each viewport separately
   - Use a single viewport for better performance
   - Switch to multiple viewports only when needed

8. **Update graphics drivers**:
   - Updated drivers improve rendering performance
   - Check for driver updates regularly
   - Install the latest version

### Community Report

> "pCon.planner runs slow and is often loading. By placing many elements from the 3D Warehouse in the drawing, pCon.planner runs slower. Clean up the drawing: File/Purge. Copy/paste to place the drawing in a new file. The Level of Detail option influences the display of solids — a high value improves objects but may have a negative effect on performance. Reducing the size of the screen area will mean the graphics are computed faster."

## 4. Dedicated GPU Not Used on Laptops from Battery Mode Switching

### Symptom

On laptops with both integrated and dedicated graphics, pCon.planner uses the integrated GPU instead of the dedicated GPU. Performance is poor despite having a capable dedicated GPU. The wrong GPU is shown in Help > About. The issue occurs especially on battery power.

### Root Cause

"Please note: If your notebook is not connected to an external power source, this can prevent pCon.planner from using the 3D graphics card. In battery mode, there is often an automatic switch from the power-intensive 3D graphics processor to the onboard card." Laptops with hybrid graphics switch to the integrated GPU on battery power to save energy. The operating system's power management automatically switches GPUs. pCon.planner doesn't override this — it uses whatever GPU the OS assigns. On battery, the dedicated GPU is disabled by the OS power policy.

### Fix

1. **Configure Windows Graphics settings**.

2. **Connect to external power**:
   - Connect the laptop to power
   - The OS should switch to the dedicated GPU
   - Verify in Help > About

3. **Configure NVIDIA Control Panel**:
   - Open NVIDIA Control Panel
   - Manage 3D Settings > Program Settings
   - Add planner.exe
   - Set preferred graphics processor to NVIDIA

4. **Connect monitor to external GPU**:
   - On desktops, connect the monitor to the dedicated GPU
   - Not the motherboard port

5. **Verify in Help > About**:
   - Check which GPU pCon.planner is using
   - If it shows Intel, the configuration is wrong
   - Reconfigure and restart pCon.planner

6. **Check power plan settings**:
   - Windows Control Panel > Power Options
   - Select High Performance plan
   - Don't use Power Saver plan
   - This prevents GPU switching

7. **Use software rendering as fallback**:
   - If the dedicated GPU can't be configured
   - Enable Software Rendering in Program Settings
   - This uses CPU for rendering — slower but functional

### Community Report

> "If your notebook is not connected to an external power source, this can prevent pCon.planner from using the 3D graphics card. In battery mode, there is often an automatic switch from the power-intensive 3D graphics processor to the onboard card. Right-click on the desktop, open Display settings, find Graphics settings, add planner.exe, select High performance. Ensure that the monitor is connected to the external graphics card. Go to Help > About and verify the name of the graphic card."

## 5. Second Monitor Crash from Graphics Card Memory Shortage

### Symptom

When using a second monitor or projector while pCon.planner is running, picture faults occur and the software may crash. The crash happens when extending the display to a second screen. The primary display may also show corruption or poor rendering quality.

### Root Cause

"One of the most frequent reasons is shortage of graphics card memory." When pCon.planner renders to two monitors simultaneously, the graphics card must allocate memory for both displays. The 3D rendering buffer doubles — one for each monitor. If the graphics card doesn't have enough VRAM for both buffers, the rendering fails, causing picture faults or a crash. This is especially common with lower-end GPUs or integrated graphics.

### Fix

1. **Use only one monitor**:
   - Disconnect the second monitor
   - Or disable it in Windows Display Settings
   - This eliminates the memory shortage

2. **Use a more powerful GPU**:
   - If multi-monitor is required
   - Use a GPU with more VRAM (4GB+)
   - This provides enough memory for dual displays
   - Check GPU VRAM in Help > Systeminfo

3. **Reduce rendering quality**:
   - Lower the rendering quality in Program Settings
   - Reduce texture quality
   - Disable shadows
   - This reduces VRAM usage per display

4. **Use lower resolution on second monitor**:
   - Set the second monitor to a lower resolution
   - This reduces the rendering buffer size
   - Less VRAM is needed for the second display
   - May prevent the crash

5. **Disable second monitor during rendering**:
   - Use the second monitor for 2D work only
   - Disable it before rendering or navigating 3D
   - Re-enable after rendering is complete
   - This prevents the crash during GPU-intensive operations

6. **Use software rendering for multi-monitor**:
   - Enable Software Rendering mode
   - This uses system RAM instead of VRAM
   - System RAM is typically more abundant
   - But rendering will be slower

7. **Close other GPU-intensive applications**:
   - Close browsers with hardware acceleration
   - Close other 3D applications
   - Free up VRAM for pCon.planner
   - This may provide enough for dual monitors

### Community Report

> "A second monitor or a projector can be used to extend the main display as a second screen. When this possibility is used while pCon.planner is running, there may be picture faults and even a crash of the software. One of the most frequent reasons is shortage of graphics card memory. In both cases (crash or poor pictures) we recommend that you operate only one monitor while running pCon.planner."

## 6. Additional pCon.planner Issues

### Large File Size Problems

**Issue**: "Complex drawings can reach an enormous file size. Saving and loading plans can be prevented if there is not enough free working memory."
**Fix**: Use File > Purge regularly. Copy/paste to new file. Reduce 3D Warehouse elements. Use simpler geometry. Increase system RAM.

### Export Compatibility Issues

**Issue**: "The amount of geometry of 3D models is much higher compared to pure 2D data. Problems sometimes occur when importing data from pCon.planner into another application."
**Fix**: Use pCon.planner's export preparation options. Reduce geometry before export. Use DWG for 2D data. Use FBX or OBJ for 3D. Check target application's import limits.

### Backup Files

**Issue**: "Backup files ensure that your plans are not lost should pCon.planner crash."
**Fix**: Keep automatic backup enabled in Program Settings. Check backup file location. Use File > Save regularly. Don't disable automatic backups.

### Software Rendering Limitations

**Issue**: "Software Rendering mode cannot guarantee the executability of pCon.planner on all systems."
**Fix**: Use software rendering only as last resort. Check system requirements. Update graphics drivers. Use a dedicated GPU for best results.

### Texture Problems After Upgrade

**Issue**: "I upgraded my Optitex version and now my 3D models have texture problems."
**Fix**: Check graphics card meets minimum requirements. Verify PDS is using the correct graphics card in Help > About. Update graphics drivers. Check texture offset in Shader dialog.

### OFB Import Export Issues

**Issue**: "Not all programs can handle such data volumes well."
**Fix**: Reduce geometry before export. Use pCon.planner's preparation options. Export in smaller batches. Check target application limits. Use DWG for smaller files.

## Best Practices

1. **Update both NVIDIA and Intel graphics drivers** — prevents application error crashes
2. **Close other programs to free RAM** — prevents memory overload crashes
3. **Keep pCon.planner updated** — many problems are fixed in newer versions
4. **Reset UCS to WCS origin if parts disappear** — fixes depth buffer clipping
5. **Move drawing to UCS origin** — prevents disappearing geometry
6. **Use File > Purge regularly** — removes unused elements and reduces file size
7. **Copy/paste to new file** — eliminates accumulated file bloat
8. **Lower Level of Detail for performance** — improves navigation speed
9. **Configure Windows Graphics settings for High Performance** — ensures dedicated GPU usage
10. **Use only one monitor** — prevents graphics memory shortage crashes
