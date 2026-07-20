---
title: "Solid Edge Large Assembly Performance: Simplify Mode, Active Only, and Configuration Management"
excerpt: "Solid Edge assemblies with 5000+ parts lag during rotation, editing, and saving. We cover the Simplify mode, Activate Only selection, and the configuration management strategy that keeps large assemblies responsive."
category: "performance"
softwareSlug: "solid-edge"
keyword: "Solid Edge large assembly performance simplify mode activate"
slug: "solid-edge-large-assembly-performance-simplify-activate"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://www.designfusion.com/post/tips-to-improve-the-performance-of-solid-edge"
  - "https://community.sw.siemens.com/s/question/0D5Vb000007T5sBKAS/performance-issue-in-solid-edge-why-does-my-processor-only-reach-20"
  - "https://www.reddit.com/r/SolidEdge/comments/1ctai76/siemens_solid_edge_2024/"
---

# Solid Edge Large Assembly Performance: Simplify Mode, Active Only, and Configuration Management

DesignFusion, a Solid Edge training and support provider, regularly addresses performance questions. Their guidance is straightforward: "The vast majority of performance issues can be improved by doing one of the following: improve the performance of your computer, check your Solid Edge data for errors, or take the Advanced Assembly course." A user on the Siemens Community forum reported that their processor only reached 20% utilization during Solid Edge operations, indicating a bottleneck that more CPU power alone won't fix. Another user reported that Solid Edge froze when trying to open a project or file.

Solid Edge handles large assemblies better than many mid-range CAD systems, but there's still a limit. When your assembly exceeds 5000 parts, you need to use Solid Edge's built-in large assembly tools to maintain performance.

## Fix 1: Use Simplify Mode

Solid Edge's Simplify mode displays components with reduced geometry, which dramatically improves display performance:

1. In the assembly environment, go to **Tools → Simplify**
2. Select **Simplify Assembly**
3. Choose simplification options:
   - **Remove fillets and rounds**: Eliminates all rounded edges
   - **Remove holes**: Fills holes below a specified diameter
   - **Remove internal geometry**: Removes faces not visible from outside
4. Click **OK** to generate the simplified representation
5. Solid Edge stores the simplified version alongside the full model
6. Toggle between simplified and full display with **Tools → Simplify → Toggle**

### When to Use Simplify Mode

- **During assembly layout**: When positioning components and checking clearances
- **During large assembly editing**: When making changes to the assembly structure
- **During presentations**: When showing the assembly to stakeholders
- **NOT during detailed part editing**: Switch to full mode when editing individual parts

### Performance Impact

Simplify mode can reduce the triangle count by 70-90%, which directly improves:
- Orbit and zoom responsiveness
- Selection speed
- Save and open times
- Memory usage

## Fix 2: Use Activate Only

Solid Edge loads all parts in an assembly, but only "active" parts are fully loaded into memory. Inactive parts are displayed as lightweight representations:

1. In the assembly, select all parts: **Ctrl+A**
2. Right-click → **Inactivate**
3. All parts become inactive (lightweight)
4. Select only the parts you're currently working on
5. Right-click → **Activate**
6. Only the active parts are fully loaded, reducing memory usage and improving performance

### Benefits of Inactive Parts

- **Faster assembly open**: Inactive parts load as lightweight representations
- **Lower memory usage**: Only active parts consume full memory
- **Faster orbiting**: Fewer triangles to render
- **Faster saving**: Inactive parts don't need to be reprocessed

### When to Activate Parts

- When you need to edit a part's geometry
- When you need to create assembly features that reference the part
- When you need to measure precise geometry on the part
- Keep all other parts inactive

## Fix 3: Use Configurations for Display States

Configurations in Solid Edge assemblies let you save different display states:

1. Create a configuration called "Layout" with:
   - Only structural components visible
   - All other components hidden
2. Create a configuration called "Detail - Drive System" with:
   - Only drive system components visible and active
   - All other components hidden and inactive
3. Create a configuration called "Full Assembly" with:
   - All components visible (use for final review only)
4. Switch between configurations as you work on different areas

### Creating Assembly Configurations

1. Go to **Home → Configurations**
2. Click **New Configuration**
3. Name it and set the display/active state for each part
4. Repeat for each working state
5. Switch configurations from the dropdown in the ribbon

## Fix 4: Use Part Simplification

Each part in your assembly can have a simplified representation:

1. Open a part in the Part environment
2. Go to **Tools → Simplify**
3. Create a simplified version of the part:
   - Remove fillets and chamfers
   - Remove small holes
   - Replace complex geometry with simple shapes
4. Save the part
5. In the assembly, Solid Edge can display the simplified version
6. The full version is used for drawings and manufacturing

### Batch Part Simplification

1. Use **Solid Edge API** to simplify multiple parts:
   ```vb
   Dim asm As SolidEdgeAssembly.AssemblyDocument
   Dim occ As SolidEdgeAssembly.Occurrence
   For Each occ In asm.Occurrences
       occ.PartDocument.Simplify
   Next
   ```
2. This applies simplification to all parts in the assembly
3. Run this as a batch process during off-hours

## Fix 5: Manage Assembly Structure

### Use Subassemblies

1. Break large assemblies into functional subassemblies:
   - Frame subassembly
   - Drive system subassembly
   - Control system subassembly
   - Enclosure subassembly
2. Each subassembly can be opened and edited independently
3. In the main assembly, subassemblies can be inactivated as a unit
4. This reduces the number of active parts at the top level

### Use Part Copies Instead of Patterns

1. For repeated components (bolts, brackets), use **Assembly Patterns**
2. Patterns share one part definition across all instances
3. This is more memory-efficient than inserting individual parts
4. Use **Assembly → Pattern → Rectangular** or **Circular**

## Fix 6: Optimize Display Settings

### Disable Unnecessary Display Features

1. Go to **Solid Edge Options → View**
2. Disable:
   - **Show profiles** (edge profiles add rendering overhead)
   - **Show shadows** (shadows are GPU-intensive)
   - **Show reflections** (reflections are very GPU-intensive)
   - **Anti-aliasing** (set to Off or 2x, not 8x)
3. Set **Display quality** to **Performance** (not **Quality**)
4. Set **Frame rate** to **Fixed** at 30 FPS (not Variable)

### Use Performance Mode

1. Go to **Tools → Environment → Performance**
2. Solid Edge automatically adjusts display settings for large assemblies
3. This is equivalent to manually disabling all the features above
4. Use Performance mode for working, switch to Quality mode for screenshots

## Fix 7: Check Data for Errors

DesignFusion's guidance includes checking data for errors. Corrupted or invalid geometry can cause performance problems:

1. Go to **Tools → Check → Check Assembly**
2. Solid Edge checks for:
   - Missing or broken part links
   - Invalid geometry
   - Interference issues
   - Mate conflicts
3. Fix any errors found
4. Run **Check Part** on individual parts to verify geometry integrity

## Fix 8: Hardware Optimization

### CPU

The user who reported 20% CPU utilization was experiencing a single-core bottleneck. Solid Edge's modeling operations are largely single-threaded:

- Prioritize **single-core clock speed** over core count
- An i7 at 5.0GHz outperforms a Xeon at 3.0GHz for Solid Edge
- 20% CPU utilization on a 5-core processor means 1 core is maxed out (100/5 = 20%)

### RAM

- **16GB**: Minimum for assemblies up to 1000 parts
- **32GB**: Recommended for assemblies up to 5000 parts
- **64GB**: For assemblies with 10,000+ parts

### GPU

- **4GB VRAM**: Minimum for moderate assemblies
- **8GB VRAM**: Recommended for large assemblies with textures
- Use **NVIDIA Studio Drivers** (not Game Ready)
- Solid Edge is certified with NVIDIA Quadro/RTX A-series cards

### Storage

- **NVMe SSD**: Significantly faster assembly open/save
- Ensure at least 50GB free space for Solid Edge temp files
- Don't store Solid Edge files on network drives for active work — copy locally

## Fix 9: Use Solid Edge's Built-in Large Assembly Mode

Solid Edge automatically switches to Large Assembly mode when the part count exceeds a threshold:

1. Go to **Solid Edge Options → Assembly**
2. Check **Enable Large Assembly mode**
3. Set the **Part count threshold** (default is 500)
4. When the assembly exceeds this threshold, Solid Edge automatically:
   - Switches to Performance display mode
   - Inactivates all parts
   - Disables shadows and reflections
5. You can override individual settings as needed

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Use Simplify mode | Very high | Easy |
| Use Activate Only | Very high | Easy |
| Use display configurations | High | Medium |
| Simplify individual parts | High | Medium |
| Use subassemblies | High | Medium |
| Optimize display settings | Medium | Easy |
| Check data for errors | Medium | Easy |
| Enable Large Assembly mode | High | Easy |

The most effective combination is: enable Large Assembly mode, inactivate all parts, then activate only the parts you're currently editing. Use Simplify mode for display during navigation and layout work. This combination can make a 10,000-part assembly as responsive as a 500-part assembly.
