---
title: "ESPRIT CAM SolidMill: 3-Axis Roughing, Finishing, and Residual Stock Strategies"
excerpt: "Program 3-axis CNC milling in ESPRIT SolidMill: roughing cycles, Z-level finishing, planar finishing, residual stock machining, and adaptive high-efficiency toolpaths for mold and die."
category: "workflow"
softwareSlug: "esprit"
keyword: "esprit solidmill 3 axis roughing finishing residual stock"
slug: "esprit-cam-solidmill-3-axis-roughing-finishing-residual-stock"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://pmtechnologies.com/esprit-cam/"
  - "https://www.mechrise.com/esprit"
---

# ESPRIT CAM SolidMill: 3-Axis Roughing, Finishing, and Residual Stock Strategies

SolidMill is ESPRIT's 3-axis machining module, used for everything from simple prismatic parts to complex mold cavities. The key to efficient 3-axis programming is choosing the right strategy for each stage: roughing, semi-finishing, finishing, and residual stock removal.

## Roughing Strategies

### Z-Level Roughing

Z-level (or Z-constant) roughing removes material in horizontal layers at decreasing Z heights. It's the most common roughing strategy for mold cavities and 3D parts.

**Setup:**
1. Select the **machining surface** — the part surface to rough
2. Define the **stock** — the raw material boundary
3. Set the **Z-step** — depth per layer (typically 1-5mm depending on tool size)
4. Set the **step-over** — distance between cuts (50-70% of tool diameter)
5. Choose the **cut pattern** — zigzag or one-direction
6. Set **stock allowance** — leave 0.5-1mm for semi-finishing

### Adaptive Roughing (Trochoidal)

Adaptive roughing uses trochoidal tool paths that maintain consistent tool engagement. This allows higher feed rates and longer tool life.

**Setup:**
1. Select the same parameters as Z-level roughing
2. Enable **adaptive/trochoidal** mode
3. Set the **maximum engagement angle** — typically 30-90° of the tool diameter
4. Set the **peel rate** — how fast the tool advances into the material

Adaptive roughing is particularly effective for hard materials and deep pockets where conventional roughing would cause tool deflection or breakage.

### Plunge Roughing

Plunge roughing removes material by drilling a series of overlapping holes. It's effective for deep cavities where side cutting would cause tool deflection.

**Setup:**
1. Select the machining surface
2. Set the **step-over** — typically 50-70% of tool diameter
3. Set the **plunge depth** per Z-level
4. Use a tool with a bottom cutting edge (end mill or drill-mill)

## Finishing Strategies

### Z-Level Finishing

Z-level finishing machines horizontal slices at each Z height, following the part contour. Best for steep walls and vertical surfaces.

**Setup:**
1. Select the **machining surface**
2. Set the **Z-step** — typically 0.1-0.3mm for fine finishing
3. Set the **tool** — ball nose or bull nose end mill
4. Choose **climb or conventional** cutting direction
5. Set **lead in/out** — arc leads for smooth entry/exit

### Planar Finishing

Planar finishing machines the part in parallel passes at a fixed Z height, stepping over in the X or Y direction. Best for shallow surfaces and flat areas.

**Setup:**
1. Select the machining surface
2. Set the **angle** — direction of the parallel passes (0°, 45°, 90°, etc.)
3. Set the **step-over** — 0.05-0.2mm for fine finishing
4. Set the **Z height** — single level or multiple levels

### Projected Finishing

Projected finishing projects a 2D pattern onto the 3D surface. Useful for complex surfaces where Z-level or planar strategies don't provide uniform cusp height.

**Setup:**
1. Select the machining surface
2. Choose the **projection pattern** — parallel, radial, spiral
3. Set the **step-over** based on the projected pattern
4. Define the **boundary** — limit the machining area

## Residual Stock Machining

After roughing and semi-finishing, material remains in corners, fillets, and narrow channels. Residual stock machining removes this remaining material with smaller tools.

**Setup:**
1. Select the **machining surface**
2. Define the **previous tool diameter** — ESPRIT calculates where material remains based on the previous tool's path
3. Set the **new tool** — typically half the diameter of the previous tool
4. Set the **step-over** — smaller than the previous tool's step-over
5. Choose the **strategy** — Z-level or planar

ESPRIT tracks the remaining material from previous operations and only machines where stock exists, saving significant machining time.

## Combining Strategies

A typical 3-axis mold cavity machining sequence:

1. **Z-level roughing** with 12mm end mill, 3mm Z-step, 1mm stock allowance
2. **Z-level semi-finishing** with 8mm ball nose, 0.5mm Z-step, 0.2mm stock allowance
3. **Planar finishing** with 6mm ball nose, 0.1mm step-over, 45° angle
4. **Residual stock** with 3mm ball nose in corners and fillets
5. **Pencil machining** with 2mm ball nose for deep corners

Each operation uses the stock model from the previous operation, so ESPRIT knows exactly where material remains.

## Common Issues

### Toolpath Skips Areas

The stock model may not be accurate. Verify that the stock definition matches the actual material and that previous operations are included in the stock calculation.

### Poor Surface Finish

- Step-over too large — reduce to 0.05-0.1mm for fine finishing
- Tool deflection — use shorter tool or reduce depth of cut
- Wrong tool type — use ball nose for 3D surfaces, not flat end mill

### Long Calculation Times

Complex surfaces with fine step-overs can take significant time to calculate. Use a coarser step-over for roughing and semi-finishing, and only use fine step-over for the final finishing pass.

## Best Practices

- **Machine from stock model** — ESPRIT's stock tracking saves time by not air-cutting
- **Use appropriate tools** — rough with large tools, finish with smaller tools
- **Angle the finishing passes** at 45° to reduce visible scallops on both X and Y walls
- **Leave consistent stock allowance** — 0.5mm for semi-finish, 0.1mm for finish
- **Use climb cutting** for better surface finish and tool life
