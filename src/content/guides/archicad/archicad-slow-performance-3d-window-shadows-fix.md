---
title: "ArchiCAD Slow Performance: 3D Window Lag, Shadow Bug Fix, and Layer Combination Optimization"
excerpt: "ArchiCAD 27's 3D window lags on high-end workstations, even with small residential projects. I cover the DrawShadowsDuringNavigationOGL registry fix, layer combination cleanup, and the solid element operations audit that restore performance."
category: "performance"
softwareSlug: "archicad"
keyword: "ArchiCAD slow performance 3D window lag shadows layer combination"
slug: "archicad-slow-performance-3d-window-shadows-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-21"
sources:
  - "https://community.graphisoft.com/t5/Modeling/AC27-3d-window-performance-broken-on-Windows-developers-refusing/td-p/589414/page/2"
  - "https://community.graphisoft.com/t5/Modeling/Is-Graphisoft-actively-doing-anything-about-the-shocking/td-p/584546"
  - "https://support.graphisoft.com/hc/en-us/articles/18795669276561-Troubleshooting-speed-issues-in-Archicad"
  - "https://www.graphisoft.com/us/keep-files-running-fast-and-lean"
---

# ArchiCAD Slow Performance: 3D Window Lag, Shadow Bug Fix, and Layer Combination Optimization

Users on the Graphisoft Community forum reported that ArchiCAD 27's 3D window performance was "broken on Windows" even on high-end workstations with powerful GPUs. One user stated: "Under Windows 11, using a pretty high end Workstation with high end GPU with lots of gRAM, with even small residential scale projects, ArchiCAD 27 is still an absolute dog to use performance wise compared with earlier versions." Graphisoft's own support documentation acknowledges that "even the smallest of projects can get bogged down, decreasing the speed of everything from selecting an element to generating the 3D window."

The forum investigation identified a specific bug: the `DrawShadowsDuringNavigationOGL` setting in the Windows registry causes performance degradation even when shadows are turned off. This is a confirmed bug that Graphisoft has addressed in updates, but many users are still affected.

## Fix 1: The DrawShadowsDuringNavigationOGL Registry Fix

This is the most impactful fix for ArchiCAD 27 3D window performance on Windows:

1. Close ArchiCAD completely
2. Open **Registry Editor** (press Win+R, type `regedit`)
3. Navigate to: `HKEY_CURRENT_USER\Software\GRAPHISOFT\Archicad\Archicad 27.0.0\GSModeler\`
4. Find the key named `DrawShadowsDuringNavigationOGL`
5. Change its value from `1` to `0`
6. Restart ArchiCAD

### What This Fix Does

The `DrawShadowsDuringNavigationOGL` setting controls whether shadows are rendered during navigation (orbiting, panning, zooming). Even when shadows are disabled in the ArchiCAD UI, this registry key can still cause the graphics engine to perform shadow calculations, which significantly degrades performance.

### For Other ArchiCAD Versions

The same key may exist for other versions:
- ArchiCAD 26: `HKEY_CURRENT_USER\Software\GRAPHISOFT\Archicad\Archicad 26.0.0\GSModeler\`
- ArchiCAD 28: `HKEY_CURRENT_USER\Software\GRAPHISOFT\Archicad\Archicad 28.0.0\GSModeler\`

Check each version's registry path and set the value to `0` if the key exists.

## Fix 2: Optimize Layer Combinations

Graphisoft's performance guide notes that "ill-maintained" files with too many layer combinations slow down ArchiCAD. Each layer combination is a saved state of all layer visibility settings. With 100+ layers and 50+ layer combinations, every view switch requires ArchiCAD to recalculate visibility for every element.

### Audit Layer Combinations

1. Go to **Document → Layer Settings → Layer Combinations**
2. Review all layer combinations
3. Delete combinations that are no longer used
4. Merge similar combinations (e.g., "Floor Plan - Electrical" and "Floor Plan - Plumbing" into "Floor Plan - MEP")
5. Aim for 10-15 layer combinations maximum

### Audit Layers

1. Go to **Document → Layer Settings → Layer Management**
2. Review all layers
3. Delete unused layers (layers with no elements)
4. Merge similar layers (e.g., "Walls - Interior - Brick" and "Walls - Interior - Block" into "Walls - Interior")
5. Aim for 30-50 layers maximum for most projects

### Use Layer Combination Standards

1. Create a template file with standardized layer combinations
2. Use the same layer structure across all projects
3. This makes it easier for team members to switch between projects
4. Standardized layers also improve navigation speed

## Fix 3: Reduce Solid Element Operations (SEO)

Solid Element Operations are Boolean operations between elements (e.g., cutting a hole in a wall for a window). Each SEO must be recalculated when either element changes:

1. Go to **Design → Solid Element Operations**
2. Review all active SEOs
3. Count the total number of operations
4. If you have 100+ SEOs, performance will degrade

### Reduce SEO Count

1. Use ArchiCAD's native tools instead of SEOs where possible:
   - Use **Wall Opening** instead of SEO for openings in walls
   - Use **Morph** tool for complex cuts instead of SEO between morphs
   - Use **Beam Opening** for openings in beams
2. Delete SEOs that are no longer needed (the cut has been made permanent)
3. Group similar SEOs (e.g., all window cuts on one floor) and process them as a batch

## Fix 4: Optimize the 3D Window Settings

### Disable Shadows in 3D

1. In the 3D window, go to **View → 3D View Options**
2. Set **Shadow** to **Off**
3. If you need shadows for presentation, enable them only for final rendering
4. Combined with the registry fix above, this eliminates all shadow-related performance issues

### Use Simplified 3D View

1. Go to **View → 3D View Options**
2. Set **3D View** to **Internal Engine** (not **CineRender**)
3. The Internal Engine is much faster for working
4. Use CineRender only for final rendering

### Reduce 3D Detail Level

1. In **3D View Options**, set **Detail Level** to **Simplified**
2. Simplified mode reduces tessellation of curved surfaces
3. Set to **Full** only for final visualization

### Use 3D Cutaway

1. Go to **View → 3D Cutaway**
2. Create a cut plane to show only part of the model
3. Only the visible portion is rendered, which is much faster
4. Use cutaway for working on specific floors or sections

## Fix 5: Optimize Model Complexity

### Reduce Polygon Count

1. Use low-poly library parts for design development
2. Switch to high-poly parts only for final rendering
3. Check object polygon counts: **File → Libraries and Objects → Object Information**
4. Replace high-poly objects (over 10,000 polygons) with simpler alternatives

### Simplify Complex Morphs

1. Morph elements with many faces are very slow to render
2. Select complex morphs and use **Design → Modify Morph → Simplify**
3. Reduce the number of faces while maintaining the overall shape

### Use 2D Elements for Distant Views

1. For elements visible only in distant views (e.g., roof tiles, brick pattern):
   - Use 2D fills and lines instead of 3D geometry
   - Display 2D elements in section and elevation views
   - Use 3D geometry only for close-up views and renders

## Fix 6: File Maintenance

Graphisoft's guide emphasizes regular file maintenance:

### Compress the File

1. Go to **File → File Special → Compress**
2. This removes deleted elements and unused data
3. Compress weekly for active projects
4. Compress before and after major design changes

### Repair the File

1. Go to **File → File Special → Repair**
2. This checks for and repairs file corruption
3. Run repair if you experience unexpected crashes or display errors
4. Always back up the file before running repair

### Audit and Fix

1. Go to **File → File Special → Audit and Fix**
2. This checks element integrity and fixes errors
3. Run after importing IFC files or merging XREFs
4. Run monthly as preventive maintenance

## Fix 7: Optimize Navigator and Views

### Reduce View Count

1. Open the **Navigator**
2. Review all saved views
3. Delete views that are no longer needed
4. Each view stores camera position, layer combination, and display settings
5. 100+ views can slow down the Navigator and project loading

### Use View Sets Efficiently

1. Organize views into View Sets by discipline or drawing type
2. Don't create separate views for minor variations — use view settings instead
3. Use **Clone Views** for consistent settings across floors

## Fix 8: Hardware Optimization

### GPU

- **NVIDIA RTX 3060 or better**: Minimum for ArchiCAD 27
- **8GB VRAM**: Recommended for large projects
- Use **NVIDIA Studio Drivers** (not Game Ready)
- ArchiCAD's 3D engine is GPU-dependent, especially on Windows

### RAM

- **16GB**: Minimum for small residential projects
- **32GB**: Recommended for medium commercial projects
- **64GB**: For large institutional projects with point clouds

### CPU

- **High single-core clock speed**: ArchiCAD is largely single-threaded
- **i7/i9 at 5.0GHz**: Better than Xeon at 3.0GHz for ArchiCAD
- Multi-core helps with rendering (CineRender) but not with modeling

### Storage

- **NVMe SSD**: Essential for fast file loading and saving
- ArchiCAD files can reach 500MB+ — SSD makes a huge difference

## Fix 9: Keep ArchiCAD Updated

1. Go to **Help → Check for Updates**
2. Apply the latest update for your ArchiCAD version
3. Graphisoft regularly releases performance fixes in updates
4. Check the release notes for performance-related fixes
5. If you're on ArchiCAD 27, ensure you have the latest hotfix

## Fix 10: Graphisoft's Baseline Test

Graphisoft's support recommends this diagnostic test:

1. Open ArchiCAD
2. Go to **File → New → New**
3. Create a new file from a default template
4. Test performance in the new file
5. If the new file is fast but your project file is slow → the problem is project-specific
6. If the new file is also slow → the problem is system-wide (drivers, hardware, or installation)

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| DrawShadowsDuringNavigationOGL registry fix | Very high | Easy |
| Optimize layer combinations | High | Easy |
| Reduce Solid Element Operations | High | Medium |
| Disable shadows in 3D | High | Easy |
| Use Internal Engine (not CineRender) | High | Easy |
| Reduce polygon count | High | Medium |
| File compression and repair | Medium | Easy |
| Reduce view count | Medium | Easy |
| Hardware upgrade | High | Hard |
| Keep ArchiCAD updated | Medium | Easy |

The registry fix for `DrawShadowsDuringNavigationOGL` is the single most impactful fix for ArchiCAD 27 on Windows. Combined with disabling shadows in the 3D view and using the Internal Engine, this can transform an unusable 3D window into a responsive modeling environment. Regular file maintenance (compress, repair, audit) prevents the gradual degradation that affects long-running projects.
