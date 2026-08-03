---
title: "Browzwear VStitcher Graphics and Selection Errors: Lightning Bolt or Shattered Glass Display from Incorrect Graphics Card Settings Requiring Driver Configuration, Unable to Select Internal Elements from Zoom Level Too Far Out Requiring Zoom In, VStitcher Crashing After Prolonged Use from Memory Accumulation Requiring 2024.2.3 Update, Wrong Colors on Vector Artwork Export from Print to File and Tech Pack Requiring 2024.2.3 Update, and Excessively Glossy Fabric Texture from Specular Metal Effects Requiring V-Ray Fur Material Mode Revert"
excerpt: "Browzwear VStitcher fails for 5 distinct reasons: lightning bolt or shattered glass display from incorrect graphics card settings requiring driver configuration, unable to select internal elements from zoom level too far out requiring zoom in, VStitcher crashing after prolonged use from memory accumulation requiring 2024.2.3 update, wrong colors on vector artwork export from Print to File and Tech Pack requiring 2024.2.3 update, and excessively glossy fabric texture from specular metal effects requiring V-Ray Fur Material Mode revert. We cover each with fixes from Browzwear Help Center."
category: "graphics-and-selection-errors"
softwareSlug: "browzwear"
keyword: "Browzwear VStitcher lightning bolt shattered glass display graphics card settings unable to select internal elements zoom level crashing after prolonged use 2024.2.3 update wrong colors vector artwork Print to File Tech Pack excessively glossy fabric texture specular metal effects V-Ray Fur Material Mode revert"
slug: "browzwear-vstitcher-graphics-selection-errors-lightning-bolt-shattered-glass-graphics-card-unable-select-internal-elements-zoom-crashing-prolonged-use-wrong-colors-vector-artwork"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-31"
sources:
  - "https://help.browzwear.com/en/articles/13066191-lightning-bolt-or-shattered-glass-displays"
  - "https://help.browzwear.com/en/articles/13066192-unable-to-select-internal-elements"
  - "https://help.browzwear.com/en/articles/13065179-release-notes-vstitcher-2024-2-3"
---

# Browzwear VStitcher Graphics and Selection Errors: Lightning Bolt or Shattered Glass Display from Incorrect Graphics Card Settings Requiring Driver Configuration, Unable to Select Internal Elements from Zoom Level Too Far Out Requiring Zoom In, VStitcher Crashing After Prolonged Use from Memory Accumulation Requiring 2024.2.3 Update, Wrong Colors on Vector Artwork Export from Print to File and Tech Pack Requiring 2024.2.3 Update, and Excessively Glossy Fabric Texture from Specular Metal Effects Requiring V-Ray Fur Material Mode Revert

Browzwear VStitcher's graphics rendering, element selection, memory management, color export, and material display produce errors from GPU settings, zoom thresholds, memory accumulation, and specular effects. This guide covers the 5 most common VStitcher problems with diagnostic steps and community-verified fixes from Browzwear Help Center.

## 1. Lightning Bolt or Shattered Glass Display from Incorrect Graphics Card Settings

### Symptom

A visual bug appears in VStitcher or Lotta on Windows where shooting rays projecting out of the garment appear within the 2D window. The display looks like lightning bolts or shattered glass. The software may also experience slow performance or consistent crashing.

### Root Cause

"This issue is caused by incorrect graphics card settings." The graphics card driver or settings are not configured correctly for VStitcher's rendering engine. This can be caused by outdated drivers, incorrect GPU selection (integrated vs. dedicated), or conflicting graphics control panel settings.

### Fix

1. **Check graphics card requirements**:
   - "Refer to Requirements Details" on the Browzwear Help Center
   - Verify the graphics card meets minimum requirements
   - Ensure a dedicated GPU is being used, not integrated graphics

2. **Update graphics card drivers**:
   - Download the latest drivers from NVIDIA or AMD
   - Perform a clean installation (not just update)
   - Restart the computer after installation
   - Check if the visual bug is resolved

3. **Force dedicated GPU usage**:
   - On NVIDIA: NVIDIA Control Panel > Manage 3D Settings
   - Set VStitcher to use "High-performance NVIDIA processor"
   - On AMD: AMD Radeon Settings > Graphics > VStitcher
   - Set to "High Performance" mode

4. **Check Windows graphics settings**:
   - Windows Settings > System > Display > Graphics
   - Find VStitcher in the app list
   - Set to "High performance" (dedicated GPU)
   - Restart VStitcher

5. **Disable anti-aliasing overrides**:
   - In the graphics control panel
   - Set anti-aliasing to "Application-controlled"
   - Don't force override settings
   - VStitcher manages its own rendering settings

### Community Report

> "A visual bug may appear for V-Stitcher or Lotta users on Windows where shooting rays projecting out of the garment appear within the 2D window. The software may also experience slow performance or may be crashing consistently. This issue is caused by incorrect graphics card settings. To resolve the issue, refer to Requirements Details."

## 2. Unable to Select Internal Elements from Zoom Level Too Far Out

### Symptom

In the 2D window, internal elements (internal lines, points, notches) cannot be selected. Clicking on them does nothing. The elements are visible but not selectable. This happens intermittently.

### Root Cause

"If you zoom out past a certain point, the application automatically disables selection of internal items to prevent incorrect selection." VStitcher has a zoom threshold beyond which internal element selection is disabled. This is a design feature to prevent accidentally selecting the wrong element when the view is too zoomed out to distinguish between elements.

### Fix

1. **Zoom in to re-enable selection**:
   - "If you are unable to select internal elements in the 2D window, zoom in"
   - Use the mouse wheel or zoom tool
   - Zoom in until the elements are clearly distinguishable
   - Selection will be re-enabled automatically

2. **Use the zoom-to-fit shortcut**:
   - Double-click the selected pattern with the zoom tool
   - This zooms to the pattern's extent
   - Internal elements become selectable

3. **Check if elements are on the correct layer**:
   - Verify the internal elements are on a visible layer
   - Check layer visibility settings
   - Unlock the layer if locked

4. **Use the pattern list for selection**:
   - If zoom doesn't help
   - Use the Pattern List panel
   - Navigate to the specific pattern and element
   - Select from the tree view

### Community Report

> "If you zoom out past a certain point, the application automatically disables selection of internal items to prevent incorrect selection. If you are unable to select internal elements in the 2D window, zoom in."

## 3. VStitcher Crashing After Prolonged Use from Memory Accumulation

### Symptom

VStitcher crashes after being used for an extended period. The crash may happen after several hours of work. No specific action triggers the crash — it seems random. Memory usage increases over time.

### Root Cause

A memory accumulation bug in VStitcher causes the application to crash after prolonged use. The software doesn't properly release memory during extended sessions. This was a known issue fixed in VStitcher 2024.2.3.

### Fix

1. **Update to VStitcher 2024.2.3**:
   - "Fixed an issue that caused crashing after prolonged use of VStitcher"
   - Download VStitcher 2024.2.3 from the Browzwear portal
   - Install the update
   - The memory accumulation bug is fixed

2. **Save frequently**:
   - While working, save every 15-30 minutes
   - Use Ctrl+S or File > Save
   - This prevents data loss if a crash occurs
   - Enable auto-save if available

3. **Restart VStitcher periodically**:
   - If unable to update immediately
   - Restart VStitcher every 2-3 hours
   - This clears accumulated memory
   - Prevents the crash from occurring

4. **Monitor memory usage**:
   - Open Task Manager
   - Watch VStitcher's memory usage
   - If it exceeds 4-6 GB, restart the application
   - This is a temporary workaround

5. **Close unnecessary garments**:
   - Close garments not being actively worked on
   - Each open garment consumes memory
   - Reducing open garments reduces memory pressure
   - Reopen when needed

### Community Report

> "Fixed an issue that caused crashing after prolonged use of VStitcher." — VStitcher 2024.2.3 Release Notes. The release includes this fix along with fixes for 2D/3D window docking, image resolution in turntable rendering, and wrong colors in vector artwork export.

## 4. Wrong Colors on Vector Artwork Export from Print to File and Tech Pack

### Symptom

When exporting vector artworks using Print to File and Tech Pack, the colors in the exported file are wrong. Colors may be shifted, inverted, or completely different from what's displayed in VStitcher.

### Root Cause

A color management bug in the Print to File and Tech Pack export functions causes incorrect color rendering. The color space conversion during export is incorrect. This was a known issue fixed in VStitcher 2024.2.3.

### Fix

1. **Update to VStitcher 2024.2.3**:
   - "Fixed an issue that resulted in the wrong colors displaying when exporting vector artworks using Print to File and Tech Pack"
   - Download and install VStitcher 2024.2.3
   - The color export bug is fixed

2. **Verify color profile settings**:
   - Check the color profile in VStitcher settings
   - Ensure sRGB is selected for screen-based output
   - Use CMYK profile for print output
   - Match the profile to the intended output

3. **Use alternative export methods**:
   - If unable to update immediately
   - Take screenshots of the artworks
   - Or use the Render function instead of Print to File
   - This preserves colors correctly

4. **Check artwork color definitions**:
   - Verify the artwork colors in the Artwork Library
   - Ensure colors are defined in the correct color space
   - Re-apply colors if they appear shifted
   - Test with a simple artwork first

### Community Report

> "Fixed an issue that resulted in the wrong colors displaying when exporting vector artworks using Print to File and Tech Pack." — VStitcher 2024.2.3 Release Notes.

## 5. Excessively Glossy Fabric Texture from Specular Metal Effects

### Symptom

Fabric texture appears excessively glossy in VStitcher renders. The specular/metal effects make fabrics look unrealistic — too shiny, almost metallic. This affects both interactive preview and V-Ray renders.

### Root Cause

"An issue with specular/metal effects that resulted in fabric texture appearing excessively glossy." The material model's specular component is too strong. This was a known issue fixed in VStitcher 2024.1.3. Additionally, V-Ray Fur materials may appear too bright after the update, requiring a legacy mode revert.

### Fix

1. **Update to VStitcher 2024.1.3 or later**:
   - "Fixed an issue with specular/metal effects that resulted in fabric texture appearing excessively glossy"
   - Download and install VStitcher 2024.1.3
   - The specular calculation is corrected

2. **Revert V-Ray Fur to legacy material mode**:
   - "Added an option to revert to V-Ray Fur legacy Material Mode to get the expected fur brightness on V-Ray renders"
   - Find the VStitcher.ini file:
     - Help > Open Log Folder from the main toolbar
     - Navigate two levels up to the Browzwear folder
     - Open the VStitcher folder
   - Edit VStitcher.ini
   - Set V-Ray Fur Material Mode to legacy
   - Close VStitcher and reopen

3. **Adjust material specular values**:
   - In the Material Editor
   - Reduce the Specular intensity
   - Reduce the Metalness value
   - Test with a render preview

4. **Check material blending modes**:
   - "Fixed material blending to maintain the expected brightness of blended fabrics, artworks and seams"
   - "In both Overlay and Multiply material blending modes"
   - Update to 2024.1.3 for the blending fix
   - Or use Normal blending mode as workaround

5. **Use physically-based material settings**:
   - For fabric materials, use PBR settings
   - Set roughness to 0.7-0.9 for most fabrics
   - Set specular to low values (0.1-0.3)
   - Avoid metalness for non-metallic fabrics

### Community Report

> "Fixed an issue with specular/metal effects that resulted in fabric texture appearing excessively glossy. Added an option to revert to V-Ray Fur legacy Material Mode to get the expected fur brightness on V-Ray renders. Follow the steps: find VStitcher.ini via Help > Open Log Folder, navigate two levels up, open VStitcher folder, edit the file." — VStitcher 2024.1.3 Release Notes.

## 6. Additional VStitcher Issues

### 2D and 3D Windows Docked in Wrong Position

**Issue**: "Fixed an issue where the 2D and 3D windows were docked in the wrong position." — VStitcher 2024.2.3.
**Fix**: Update to 2024.2.3. If unable to update, manually re-dock windows by dragging them to the correct position.

### Image Resolution in Custom Turntable Rendering

**Issue**: "Fixed an issue with image resolution and zoom-in capabilities when rendering a custom turntable." — VStitcher 2024.2.3.
**Fix**: Update to 2024.2.3. For earlier versions, use standard turntable rendering instead of custom.

### File Version Compatibility

**Issue**: "Earlier VStitcher and Lotta versions do not support version 2024.2.3 files."
**Fix**: Files saved in newer versions can't be opened in older versions. Keep both versions installed if collaborating with users on older versions. VStitcher 2024.2.3 supports files from 2024.1, 2023.3, and 2023.2.

### VS-CLI Error Debugging

**Issue**: VS-CLI exits with non-zero exit code but no clear error message.
**Fix**: "Reproduce the failing operation in Python Playground and call BwApi.GetLastError(). Look up the error code in the Zendesk reference. Adjust API usage, parameters, or operation order."

## Best Practices

1. **Configure dedicated GPU for VStitcher** — prevents lightning bolt/shattered glass display
2. **Keep graphics drivers updated** — clean install recommended
3. **Zoom in to select internal elements** — selection is disabled when zoomed too far out
4. **Update to VStitcher 2024.2.3** — fixes prolonged use crash, color export, window docking
5. **Save frequently during long sessions** — prevents data loss from memory accumulation crashes
6. **Restart VStitcher every 2-3 hours if on older version** — clears memory accumulation
7. **Update to 2024.1.3 for specular/glossy fabric fix** — corrects material rendering
8. **Revert V-Ray Fur to legacy mode if fur appears too bright** — edit VStitcher.ini
9. **Check file version compatibility before sharing** — newer files can't open in older versions
10. **Use BwApi.GetLastError() for VS-CLI debugging** — check error codes in Zendesk reference
