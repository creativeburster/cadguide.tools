---
title: "WorkNC Auto 5 Roughing and Finishing: Mold Machining Toolpath Strategies"
excerpt: "Program mold and die toolpaths in WorkNC: Auto 5 roughing, Z-level finishing, residual stock machining, and high-speed machining strategies for automotive and injection mold cavities."
category: "workflow"
softwareSlug: "worknc"
keyword: "worknc auto 5 roughing finishing mold machining toolpath"
slug: "worknc-auto-5-roughing-finishing-mold-machining-strategies"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://hexagon.com/products/product-groups/computer-aided-manufacturing-cad-cam-software/worknc"
  - "https://pmtechnologies.com/worknc/"
---

# WorkNC Auto 5 Roughing and Finishing: Mold Machining Toolpath Strategies

WorkNC, part of Hexagon's manufacturing portfolio, is a CAM system specifically designed for mold and die machining. Its Auto 5 technology automates 5-axis toolpath generation for complex mold surfaces, reducing programming time while maintaining surface quality. I'll walk through the key strategies for mold machining.

## WorkNC's Position in the Market

WorkNC is used primarily as a complementary CAM system alongside a primary CAD/CAM system. Many shops use SolidWorks or CATIA for design, then program toolpaths in WorkNC because of its specialized mold machining capabilities. The focus is on automation, robustness, and reliability — generating toolpaths that run reliably on the machine without manual editing.

## Auto 5 Technology

Auto 5 is WorkNC's signature feature. It automatically converts 3-axis toolpaths into 5-axis toolpaths when needed to avoid collisions or improve accessibility:

1. The programmer creates a standard 3-axis toolpath
2. Auto 5 analyzes the toolpath for areas where the tool holder or shank would collide
3. In those areas, it automatically tilts the tool to avoid the collision
4. The rest of the toolpath remains 3-axis for speed

This means you don't need to manually define 5-axis regions — WorkNC handles it automatically.

## Roughing Strategies

### Z-Level Roughing

The standard roughing strategy for mold cavities:

1. **Select the machined surface** — the cavity or core surface
2. **Define the stock** — the raw material block
3. **Set the Z-step** — depth per layer (2-5mm for roughing)
4. **Set the step-over** — 50-70% of tool diameter
5. **Choose the cut pattern** — zigzag or one-direction
6. **Set stock allowance** — 0.5-1mm for semi-finishing

WorkNC's roughing includes automatic:
- **Feed rate optimization** — reduces feed in corners and increases on straight cuts
- **Trochoidal entry** — smooth entry into material instead of plunging
- **Collision avoidance** — checks tool holder against the part

### Adaptive Roughing

For hard materials or deep cavities:

1. Enable **adaptive roughing** mode
2. Set the **maximum engagement** — percentage of tool diameter in cut
3. Set the **peel rate** — how fast the tool advances
4. WorkNC generates trochoidal paths that maintain consistent chip load

Adaptive roughing allows higher feed rates, longer tool life, and less heat generation.

## Finishing Strategies

### Z-Level Finishing

For steep walls and vertical surfaces:

1. Select the machined surface
2. Set the **Z-step** — 0.1-0.3mm for fine finishing
3. Set the **tool** — ball nose end mill
4. Choose **climb cutting** for better surface finish
5. Set **lead in/out** — arc leads for smooth transitions

### Planar Finishing

For shallow surfaces and flat areas:

1. Select the machined surface
2. Set the **angle** — direction of parallel passes
3. Set the **step-over** — 0.05-0.2mm for fine finishing
4. Use 45° angle to minimize visible scallops on both X and Y walls

### Pencil Machining

For corners and fillets where residual material remains:

1. Select the machined surface
2. WorkNC automatically detects corners where the previous tool couldn't reach
3. Set the **previous tool diameter** — WorkNC calculates remaining material
4. Use a smaller ball nose tool (typically half the previous tool's diameter)
5. The toolpath follows the corner geometry precisely

### Residual Stock Finishing

After roughing and semi-finishing, material remains in corners and narrow channels:

1. Select the machined surface
2. Define the **previous tool** — WorkNC calculates where material remains
3. Set the **new tool** — smaller diameter
4. WorkNC machines only where stock exists, avoiding air cutting

## Shop Floor Editing

WorkNC includes a Shop Floor Editor that allows machine operators to make adjustments at the machine:

1. **Re-post a job** with different parameters (feed rates, tool offsets)
2. **View toolpaths** on the shop floor computer
3. **Simulate** before running
4. **Edit operations** without going back to the programming department

This reduces the back-and-forth between programming and the shop floor, especially useful for shops with multiple machines.

## Toolpath Viewer

The Toolpath Viewer lets operators analyze and simulate CAM programs before running them:

1. Load the NC program
2. View the toolpath in 3D
3. Check for rapid moves, retractions, and potential issues
4. Verify tool changes and safe Z heights
5. Run a simulation to check material removal

This is a safety check that catches programming errors before they reach the machine.

## Common Issues

### Toolpath Doesn't Cover Entire Surface

The surface selection may be incomplete. Verify that all surfaces of the cavity or core are selected, including fillets and blends.

### Poor Surface Finish on Steep Walls

Z-level finishing may not be optimal for steep walls. Try switching to planar finishing with a 90° angle, or use a combination of Z-level and planar strategies.

### Long Calculation Times

Complex mold surfaces with fine step-overs take time to calculate. Use coarser parameters for roughing and semi-finishing, and only use fine parameters for the final finishing pass.

## Best Practices

- **Use Auto 5 for complex parts** — let WorkNC handle 5-axis automatically
- **Machine from stock model** — WorkNC's stock tracking avoids air cutting
- **Use consistent stock allowances** — 0.5mm for semi-finish, 0.1mm for finish
- **Program in order** — rough, semi-finish, finish, pencil, residual stock
- **Use the Shop Floor Editor** for quick adjustments without reprogramming
- **Always simulate** before posting — catch errors in software, not on the machine
