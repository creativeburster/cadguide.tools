---
title: "FeatureCAM Hole Machining: Drilling, Tapping, Boring, and Thread Milling Setup"
excerpt: "Configure FeatureCAM hole features for drilling, tapping, boring, reaming, and thread milling operations with automatic tool selection, cycle parameters, and hole group optimization."
category: "workflow"
softwareSlug: "featurecam"
keyword: "featurecam hole machining drilling tapping boring thread milling"
slug: "featurecam-hole-machining-drilling-tapping-boring-thread-milling"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-13"
sources:
  - "https://help.autodesk.com/cloudhelp/2018/CHS/FCAM/files/GUID-C2FF3B8A-5B9B-4DBC-BED0-B37C26B0C318.htm"
  - "https://www.autodesk.com/learn/ondemand/module/featurecam-getting-started-standard-milling"
---

# FeatureCAM Hole Machining: Drilling, Tapping, Boring, and Thread Milling Setup

Hole machining is one of FeatureCAM's strongest areas. The automatic feature recognition identifies holes from solid models and assigns the appropriate drilling, tapping, or boring operations. But getting the details right — cycle types, peck depths, and thread specifications — makes the difference between a clean hole and a scrapped part.

## Hole Feature Recognition

When AFR runs on a solid model, it identifies holes based on cylindrical faces:

1. **Through holes** — detected when the cylinder passes through the entire part
2. **Blind holes** — detected when the cylinder has a bottom face
3. **Tapped holes** — detected when thread specifications are present in the CAD model
4. **Counterbored holes** — detected as compound features (large diameter + small diameter)
5. **Countersunk holes** — detected as compound features (chamfer + small diameter)

Each hole is assigned a diameter, depth, and type automatically.

## Drilling Operations

### Standard Drilling

For a simple through hole:

1. FeatureCAM selects a drill from the tool library that matches the hole diameter
2. The drilling cycle is set to **G81** (standard drill)
3. Parameters:
   - **Feed rate** — based on tool diameter and material (typically 0.001-0.005 inch/rev)
   - **Spindle speed** — based on tool material and hole diameter
   - **Retract height** — above the part surface for chip clearance
   - **Depth** — through the bottom of the hole

### Peck Drilling

For deep holes (depth > 3× diameter), peck drilling is required:

1. Set the cycle to **G83** (peck drill)
2. Parameters:
   - **Peck depth** — 1-2× tool diameter per peck
   - **Retract amount** — 0.5-1mm above the last peck bottom (Q value)
   - **Dwell** — 0.1-0.5 seconds at the bottom of each peck for chip breaking

### Deep Hole Drilling

For very deep holes (depth > 5× diameter):

1. Use **G83** with small peck depths (0.5-1× diameter)
2. Enable **dwell** at each peck bottom
3. Use **coolant through tool** if available
4. Consider **gun drilling** for holes deeper than 10× diameter

## Tapping Operations

### Rigid Tapping

For tapped holes, FeatureCAM uses rigid tapping (G84):

1. Select a tap that matches the thread specification
2. Parameters:
   - **Spindle speed** — typically 200-1000 RPM (slower than drilling)
   - **Feed rate** — automatically calculated as pitch × RPM
   - **Thread depth** — the depth to thread to
   - **Dwell** — 0.5 seconds at the bottom before reversal

### Thread Milling

For large threads or non-standard sizes, thread milling is preferred:

1. Select a thread mill from the tool library
2. Parameters:
   - **Thread pitch** — matches the thread specification
   - **Number of passes** — typically 2-4 for clean threads
   - **Climb or conventional** — climb milling produces better surface finish
   - **Helical interpolation** — the tool spirals down to create the thread

Thread milling is advantageous because:
- One tool can cut multiple thread sizes
- Less risk of broken taps (no risk of tap snapping in the hole)
- Better thread quality in hard materials
- Can thread mill holes too large for standard taps

## Boring and Reaming

### Boring

For high-precision holes:

1. Select a boring bar from the tool library
2. Set the cycle to **G85** (boring) or **G89** (boring with dwell)
3. Parameters:
   - **Feed rate** — slow and consistent (0.002-0.005 inch/rev)
   - **Spindle speed** — moderate (500-2000 RPM depending on diameter)
   - **Dwell** — 0.5-1 second at the bottom for G89

### Reaming

For finishing pre-drilled holes to tight tolerance:

1. Select a reamer matching the final hole diameter
2. Set the cycle to **G85** (reaming)
3. Parameters:
   - **Feed rate** — faster than boring (0.005-0.010 inch/rev)
   - **Spindle speed** — slower than drilling (typically 60-70% of drilling speed)
   - **Stock allowance** — 0.1-0.3mm on diameter for the reamer to remove

## Hole Group Optimization

When a part has many holes, FeatureCAM optimizes the machining order:

1. **Group holes by diameter** — all same-size holes are machined with one tool
2. **Minimize tool changes** — each tool machines all its holes before the next tool change
3. **Optimize hole-to-hole movement** — the tool visits holes in the shortest path
4. **Sort by Z height** — holes at the same Z level are grouped together

You can override the automatic ordering by:
- Dragging operations in the feature tree
- Setting a specific hole order
- Grouping holes manually

## Compound Holes

For counterbored or countersunk holes, FeatureCAM creates a compound feature:

1. The large diameter is machined first (counterbore or countersink)
2. The small diameter is drilled second
3. If threaded, the tap operation follows

The operations are automatically ordered: spot drill → drill → counterbore → tap.

## Common Issues

### Wrong Tap Size

FeatureCAM selects the tap based on the CAD model's thread specification. If the CAD model doesn't have thread data, FeatureCAM may select a drill instead of a tap.

**Fix:** Manually add a tap operation to the hole feature, or add thread data to the CAD model.

### Peck Depth Too Large

If chips pack in the hole and break the drill, the peck depth is too large.

**Fix:** Reduce the peck depth to 1× tool diameter or less. Enable coolant through spindle if available.

### Poor Thread Quality

Threads are rough or torn.

**Fix:**
- Use a spiral flute tap for blind holes
- Use a forming tap instead of a cutting tap for softer materials
- Reduce the spindle speed
- Use thread milling instead of tapping for better quality

### Hole Position Drift

Holes are not in the correct position.

**Fix:** Check the coordinate system origin. If the origin is in the wrong location, all hole positions will be offset.

## Best Practices

- **Spot drill first** — a spot drill creates a dimple that guides the drill, preventing wander
- **Use the right cycle** — G81 for shallow, G83 for deep, G73 for high-efficiency pecking
- **Group holes by tool** — minimize tool changes by machining all same-size holes together
- **Check thread depth** — ensure the tap reaches the required depth without bottoming out
- **Use rigid tapping** — it's more reliable than tension/compression tapping
- **Simulate before posting** — verify all hole operations in 3D simulation
