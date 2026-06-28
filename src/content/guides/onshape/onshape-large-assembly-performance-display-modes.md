---
title: "Onshape Large Assembly Performance: Lightweight Modes, Performance Meter, and Simplification"
excerpt: "Onshape assemblies lag when dragging components, orbiting, or inserting parts with hundreds of occurrences. I cover the performance meter analysis, display modes, and component simplification that keep large assemblies responsive."
category: "performance"
softwareSlug: "onshape"
keyword: "Onshape large assembly performance slow display modes"
slug: "onshape-large-assembly-performance-display-modes"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-21"
sources:
  - "https://forum.onshape.com/discussion/26524/slow-performance-in-assemblies-with-a-lot-of-parts"
  - "https://forum.onshape.com/discussion/258/large-assembly-performance"
  - "https://forum.onshape.com/discussion/11902/slow-movement-drag-on-large-assemblies"
  - "https://forum.onshape.com/discussion/20347/imported-model-complexity-versus-performance-lag"
---

# Onshape Large Assembly Performance: Lightweight Modes, Performance Meter, and Simplification

A user on the Onshape forum reported slow performance in assemblies with a lot of parts. Another user reported slow movement and dragging in large assemblies. A third user created a plant floor layout with 8 pieces of manufacturing equipment from different manufacturers and experienced significant performance lag — the imported models were too complex for the assembly context. These are the most common Onshape performance complaints, and they all share the same root cause: too much geometry being processed by Onshape's cloud rendering engine.

Unlike desktop CAD systems where performance depends on your local hardware, Onshape runs in the cloud. Your browser receives rendered images from Onshape's servers. This means performance depends on both your internet connection speed and the complexity of the geometry being rendered.

## Fix 1: Use the Performance Meter

Onshape includes a built-in performance meter that shows exactly what's causing slowdowns:

1. Click the **?** icon in the top-right corner
2. Select **Performance meter**
3. The meter shows:
   - **FPS**: Frames per second — below 15 indicates a problem
   - **Triangles**: Number of triangles being rendered — higher = slower
   - **Draw calls**: Number of draw calls to the GPU — higher = slower
4. Use the meter while performing the operation that's slow
5. Watch which metric spikes — this tells you what to optimize

### Interpreting the Metrics

- **High triangle count**: Simplify the geometry (see Fix 3)
- **High draw call count**: Reduce the number of parts or use patterns
- **Low FPS with low triangle count**: Network or browser issue (see Fix 6)

## Fix 2: Use Performance Display Modes

Onshape offers multiple display modes that affect performance:

### Switch to Performance Mode

1. Click the **Display** dropdown in the view toolbar
2. Select **Performance mode**
3. This reduces rendering quality:
   - Disables anti-aliasing
   - Reduces tessellation density
   - Simplifies shading
4. The model appears less smooth but responds faster

### Use Shaded Without Edges

1. In the Display dropdown, select **Shaded**
2. Uncheck **Show edges**
3. Edge rendering requires additional processing for each visible edge
4. Without edges, Onshape only renders shaded faces, which is faster

### Use Wireframe for Complex Assemblies

1. In the Display dropdown, select **Wireframe**
2. Only edges are rendered, no faces
3. This is the fastest display mode for very large assemblies
4. Use it for navigation and component placement
5. Switch back to Shaded for visual verification

## Fix 3: Simplify Imported Components

The user with the plant floor layout identified the root cause: "I didn't create any of the (8) models, they come from the equipment manufacturers. Naturally they are not the full detail models but they are still complex."

### Create Simplified Configurations

1. Open the imported part studio
2. Create a new configuration called "Simplified"
3. In the simplified configuration:
   - Suppress all fillets and chamfers
   - Replace complex geometry with simple boxes
   - Remove internal components
   - Remove decals and textures
4. In the assembly, use the "Simplified" configuration
5. Switch to the full configuration only for close-up views and renders

### Use the Simplify Feature

1. In the part studio, use **Feature → Simplify**
2. Select the parts to simplify
3. Choose simplification options:
   - Remove fillets and chamfers
   - Remove holes below a threshold
   - Replace with bounding box
4. The simplified version is stored as a separate part
5. Use the simplified part in the assembly

### Replace with Primitive Shapes

1. For each imported component, create a simple box or cylinder that matches its envelope
2. Use **Mate connectors** to position the primitive in the same location as the original
3. Hide the original component and show only the primitive
4. Use the primitive for layout and clearance checking
5. Show the original only for final visualization

## Fix 4: Use Lightweight Instances

Onshape supports lightweight instances that load less geometry per occurrence:

1. In the assembly, right-click a subassembly
2. Select **Instance properties**
3. Check **Lightweight**
4. The subassembly loads with simplified geometry
5. Full geometry loads only when you expand or edit the subassembly
6. Use lightweight mode for all subassemblies you're not currently editing

## Fix 5: Use Patterns Instead of Individual Instances

1. Instead of inserting 100 individual instances of a component, use **Assembly → Pattern**
2. Create a rectangular or circular pattern
3. All instances in a pattern share one geometry definition
4. Onshape renders patterns more efficiently than individual instances
5. This reduces both triangle count and draw call count

## Fix 6: Optimize Browser and Network

Since Onshape runs in the browser, browser performance affects CAD performance:

### Browser Selection

1. **Chrome** or **Edge** (Chromium-based) provide the best Onshape performance
2. **Firefox** works but may be slower for large assemblies
3. **Safari** has known WebGL performance issues with Onshape
4. Use a Chromium-based browser for best results

### Browser Settings

1. Enable **Hardware acceleration**:
   - Chrome: **Settings → System → Use hardware acceleration when available**
   - Edge: **Settings → System → Use hardware acceleration when available**
2. Close other browser tabs — each tab consumes memory and GPU resources
3. Disable browser extensions that may interfere with WebGL

### Network Requirements

1. **Minimum**: 10 Mbps download, 5 Mbps upload
2. **Recommended**: 50+ Mbps download, 10+ Mbps upload
3. **Latency**: Below 100ms to Onshape servers
4. Test your connection: **? → Diagnostics**
5. If using a VPN, try disconnecting — VPNs add latency
6. If on Wi-Fi, try a wired connection for more stable performance

## Fix 7: Manage Assembly Structure

### Limit Top-Level Instance Count

1. Keep the top-level assembly to fewer than 500 instances
2. Use subassemblies to group related components
3. Each subassembly is loaded as a unit, reducing the number of instances at the top level
4. This improves both loading time and display performance

### Use Subassemblies for Modular Design

1. Break large assemblies into functional subassemblies:
   - Frame subassembly
   - Drive system subassembly
   - Control panel subassembly
   - Enclosure subassembly
2. Each subassembly can be opened and edited independently
3. Only load the subassembly you're working on

### Suppress Mates

1. Mates are recalculated on every assembly change
2. Right-click mates you don't currently need → **Suppress**
3. Suppressed mates are not solved, reducing calculation time
4. Unsuppress them when you need to define the full assembly

## Fix 8: Use Onshape's Large Assembly Best Practices

Onshape recommends these practices for assemblies with 1000+ instances:

1. **Use configurations instead of multiple parts**: Create a single part with configurations for different sizes
2. **Use variables for dimensions**: Change dimensions via variables instead of editing features
3. **Use derived parts**: Create parts in one part studio and derive them into others
4. **Limit in-context editing**: In-context references create dependencies that slow down updates
5. **Use assembly features sparingly**: Assembly features (cuts, holes) are recalculated on every change

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Use performance meter | Diagnostic | Easy |
| Switch to Performance mode | High | Easy |
| Simplify imported components | Very high | Medium |
| Use lightweight instances | High | Easy |
| Use patterns instead of copies | High | Easy |
| Optimize browser and network | Medium | Easy |
| Limit top-level instance count | High | Medium |
| Suppress unused mates | Medium | Easy |

Start with the performance meter to identify the bottleneck. If triangle count is high, simplify imported components — this is the most impactful fix for assemblies with manufacturer-provided models. Switch to Performance mode for immediate relief while working. Use lightweight instances for subassemblies you're not editing. These three fixes together can transform an unusable assembly into a responsive one.
