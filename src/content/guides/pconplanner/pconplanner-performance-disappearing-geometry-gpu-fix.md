---
title: "pCon.planner Performance Issues: Slow Loading, Disappearing Geometry, and Graphics Card Configuration"
excerpt: "pCon.planner users report slow performance, parts disappearing during zoom, and crashes when connecting a second monitor. We cover the official fixes from EasternGraphics support: dedicated GPU enforcement, UCS realignment, purge operations, and software rendering fallback."
category: "troubleshooting"
softwareSlug: "pconplanner"
keyword: "pCon.planner slow performance disappearing geometry graphics card fix"
slug: "pconplanner-performance-disappearing-geometry-gpu-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-07-30"
sources:
  - "https://support.easterngraphics.nl/en-gb/article/43-frequently-asked-questions-about-pcon-planner"
  - "http://help.pcon-planner.com/en/help/technical_tips.htm"
  - "https://en.blog.pcon-solutions.com/2024/06/19/maximizing-performance-in-pcon-planner-how-to-use-the-dedicated-graphics-card/"
---

# pCon.planner Performance Issues: Slow Loading, Disappearing Geometry, and Graphics Card Configuration

pCon.planner is a 3D interior design tool that relies heavily on GPU rendering. Three issues dominate support tickets: sluggish performance on laptops, geometry disappearing during zoom/rotate, and crashes when connecting a second monitor. All trace back to graphics hardware configuration.

## Issue 1: pCon.planner Runs Slow and Loads Constantly

**Root Cause**: On laptops, Windows often defaults to the integrated Intel/AMD onboard GPU instead of the dedicated 3D graphics card, especially in battery mode. pCon.planner then runs on an underpowered renderer.

**Fix — Force Dedicated GPU on Windows 10/11**:

1. Right-click on the desktop → **Display settings**
2. Scroll to **Graphics settings** at the bottom
3. Click **Browse** and navigate to the pCon.planner installation path (typically `C:\Program Files\pCon.planner\`)
4. Select `planner.exe` to add it to the list
5. Click on the added entry → **Options** → select **High performance** → **Save**

**Additional performance tips from official docs**:

- **Keep the laptop plugged in**: Battery mode triggers automatic switch from the 3D GPU to the onboard card
- **Update graphics drivers**: Newer drivers improve communication between GPU and pCon.planner. Check via **Help → Systeminfo → Rendering → Hardware**
- **Purge the drawing**: Run **File → Purge** to remove unused elements that bloat file size
- **Copy/paste to a new file**: If a specific file is slow, copy all elements and paste into a fresh file — this clears accumulated internal data
- **Reduce 3D Warehouse elements**: Placing many elements from the 3D Warehouse increases load. Limit their use in large scenes
- **Avoid running pCon.planner twice**: Multiple instances share the same hardware resources, reducing performance for both
- **Close other 3D applications**: Running AutoCAD or other 3D software simultaneously competes for the same GPU resources

## Issue 2: Parts of the Drawing Disappear While Zooming or Rotating

**Symptom**: While zooming in or rotating the view, parts of the drawing vanish from the viewport.

**Root Cause**: The drawing is positioned too far from the UCS (User Coordinate System — the cross icon in the drawing area). The UCS may have been moved during editing, and the geometry is now outside the comfortable rendering range.

**Fix**:

1. Right-click in the white drawing area
2. Click **Place UCS as WCS origin** — this resets the UCS to the world origin
3. Select all geometry and **Move** it to the UCS origin
4. If the UCS was already in the correct position, select the drawing and move it to the UCS instead

This realignment brings the geometry back into the viewport's optimal rendering range.

## Issue 3: Crashes or Visual Glitches with a Second Monitor

**Symptom**: Connecting a second monitor or projector while pCon.planner is running causes picture faults or a complete crash.

**Root Cause**: Graphics card memory shortage. Driving two displays simultaneously exceeds the available VRAM, especially on mid-range GPUs.

**Fix**:

- **Disconnect the second monitor** while running pCon.planner, or
- **Connect the second monitor before launching pCon.planner** so the GPU allocates memory for both displays at startup
- On laptops with hybrid graphics, ensure the external monitor is connected to the dedicated GPU port (if available), not the onboard HDMI

## Issue 4: Admin User Notification During Updates

**Symptom**: When updating pCon.planner or OFML data, Windows prompts for an admin username and password.

**Root Cause**: The current user account lacks administrator privileges. OFML data updates and pCon.planner installations require admin rights to modify system files.

**Fix**: Contact your IT department or a colleague with admin credentials to perform the update. For enterprise deployments, the DataClient can be pre-configured by an admin to auto-update without per-user prompts.

## Issue 5: Integrated Graphics Only — Software Rendering Fallback

If no dedicated 3D graphics card is available, pCon.planner offers a **Software Rendering mode** that uses the CPU instead of the GPU:

1. Go to pCon.planner settings → **Rendering** → select **Software Rendering**
2. Switch to **Shaded mode** (fastest render mode on older hardware)
3. Reduce viewport to a single window (avoid subdivided viewports)
4. Reduce the on-screen area used by the application window

**Note**: Software Rendering cannot guarantee smooth operation on all systems. Performance depends on CPU capability and design complexity. For production work with large interior scenes, a dedicated GPU is strongly recommended.

## OFML Data Issues

If manufacturer library objects display incorrectly or fail to load:

1. Open **pCon.update DataClient**
2. Check for available updates to the manufacturer's OFML data
3. Install the update and restart pCon.planner
4. Many display issues with manufacturer-specific objects are resolved by updating to the latest OFML data package
