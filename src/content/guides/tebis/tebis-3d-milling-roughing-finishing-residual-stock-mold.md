---
title: "Tebis 3D Milling: Roughing, Finishing, and Residual Stock Strategies for Mold Manufacturing"
excerpt: "Program 3D mold machining in Tebis: roughing in planes, equidistant finishing, residual stock machining with material tracking, and automated rib and slot machining for injection molds."
category: "workflow"
softwareSlug: "tebis"
keyword: "tebis 3d milling roughing finishing residual stock mold"
slug: "tebis-3d-milling-roughing-finishing-residual-stock-mold"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://www.tebis.com/en/software/cam-software/3d-milling"
  - "https://www.tebis.com/en/sectors/mold-manufacturing"
---

# Tebis 3D Milling: Roughing, Finishing, and Residual Stock Strategies for Mold Manufacturing

Tebis is a premium CAM system widely used in automotive mold manufacturing and die making. Its 3D milling strategies are designed for high surface quality and dimensional accuracy on free-form surfaces. The key differentiator is that Tebis calculates toolpaths directly on CAD surfaces — no faceted substitute models — which produces smoother NC paths.

## Tebis's Approach to 3D Milling

Tebis 3D milling creates 3-axis and 3+2-axis NC programs for roughing, finishing, and residual stock machining. The system emphasizes collision safety during calculation — the tool automatically avoids collisions or reduces at-risk areas.

In combination with Tebis template technology and process libraries, 3D milling can be highly automated for repeat production.

## Roughing Strategies

### Roughing in Planes

The standard roughing strategy removes material in horizontal layers:

1. **Select the part surfaces** — the cavity or core geometry
2. **Define the blank** — the raw material stock
3. **Set the Z-step** — depth per layer (2-5mm for roughing)
4. **Set the step-over** — 50-70% of tool diameter
5. **Enable tool protection** — Tebis automatically reduces feed in critical areas

Tebis's roughing includes full-cut handling:
- **Trochoidal machining** — in full-cut areas, the path becomes trochoidal to protect the tool
- **Full-cut avoidance** — the path layout is adapted to avoid full-width cuts entirely
- **Automatic path smoothing** — all paths are smoothed for optimized feed rates

### Automatic Roughing of Planar Surfaces

Tebis automatically detects planar areas within selected part surfaces. This is useful because planar areas are typically machined after hardening with a smaller stock allowance than non-planar areas, using special tools like large insert mills.

The system separates planar and non-planar areas automatically — no manual subdivision needed.

## Finishing Strategies

### Equidistant 3D Finishing

Tebis's equidistant finishing produces uniform stepover on the surface:

1. **Select the part surfaces**
2. **Choose the stepover strategy** — equidistant (constant cusp height) or constant stepover
3. **Set the stepover value** — 0.05-0.2mm for fine finishing
4. **Set the tool** — ball nose or circle-segment cutter
5. **Enable HSC point distribution** — optimizes NC point placement for smooth machine motion

The equidistant strategy ensures uniform surface roughness across both flat and steep areas. The part is automatically divided into slope areas that can be machined with different strategies and tools.

### Direct Surface Milling

Unlike many CAM systems that convert surfaces to triangulated meshes before calculating toolpaths, Tebis mills directly on the CAD surfaces. This means:

- No faceting artifacts in the toolpath
- More accurate toolpaths, especially on curved surfaces
- Better surface finish without polishing
- NC point distribution can be influenced to match the machine control

### Height-Sorted Fillet Machining

Fillet radii between surfaces are machined in height-sorted order:

1. Tebis automatically identifies fillet surfaces
2. The toolpath is sorted by height to minimize Z-axis reversals
3. The tool machines the fillet in a continuous spiral motion
4. This produces a smoother finish and faster machining time

## Residual Stock Machining

After roughing and semi-finishing, material remains in corners, fillets, and narrow channels. Tebis's residual stock machining is path and height-optimized:

1. **Define the previous tool** — Tebis calculates where material remains
2. **Select the new tool** — smaller diameter or different geometry
3. **Choose the strategy** — Z-level, planar, or pencil
4. **Enable material tracking** — the blank is updated after each operation using the actual cutter geometry

The blank update is always performed using the actual cutter geometry, not an approximation. This means Tebis knows exactly where material remains and only machines those areas.

### Specialized Residual Stock Strategies

- **Fillet machining** — for corner radii where the previous tool couldn't reach
- **Cavity machining** — for deep pockets and narrow channels
- **Rib machining** — for narrow rib structures in injection molds

## Automated Rib and Slot Machining

Tebis can automatically machine ribs and slots — geometries with steep flank surfaces, straight bottom surfaces, and entrance/exit radii:

1. Tebis detects rib and slot geometries automatically
2. The toolpath uses uniform step and 3-axis Z-constant machining
3. No retract movements between passes — the tool stays in the cut
4. No extra design effort needed — the wizard handles everything

This is particularly valuable for injection molds with cooling channels and ejector pin slots.

## 3+2 Axis Machining

For parts that can't be fully machined in 3-axis, Tebis supports 3+2 positioning:

1. The part is machined from different tilt directions
2. Each direction uses standard 3-axis strategies
3. Tebis automatically determines the optimal tilt angles
4. The blank is updated and passed between orientations

This significantly reduces the need for manual repositioning and extends the capability of 3+2 axis machines.

## Template Technology

Tebis templates encapsulate complete machining sequences:

1. **Create a template** from an existing machining job
2. The template includes tools, parameters, and operation sequence
3. **Apply the template** to a new part — Tebis adapts it to the new geometry
4. Template technology combined with process libraries enables highly automated NC programming

For shops producing similar molds repeatedly, templates can reduce programming time from hours to minutes.

## Common Issues

### Toolpath Doesn't Cover All Surfaces

Ensure all surfaces are selected, including fillets, blends, and reference surfaces. Tebis's surface selection is precise — missing surfaces result in unmachined areas.

### Poor Surface Finish

- Check the stepover value — too large causes visible scallops
- Verify the tool condition — worn tools produce poor finish
- Enable HSC point distribution for smoother NC paths
- Use circle-segment cutters for better surface quality on free-form surfaces

### Long Calculation Times

Complex mold surfaces with many fillets and blends take time. Use coarser parameters for roughing and semi-finishing. Only use fine parameters for the final finishing pass.

## Best Practices

- **Use templates** for similar parts to automate programming
- **Mill directly on surfaces** — don't convert to meshes
- **Track material accurately** — the blank update uses actual cutter geometry
- **Machine planar areas separately** — they may need different stock allowances
- **Use circle-segment cutters** for efficient prefinishing of free-form surfaces
- **Sort fillet machining by height** for smoother motion
- **Always simulate** — Tebis's digital twin catches collisions before the machine
