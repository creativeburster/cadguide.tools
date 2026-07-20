---
title: "EdgeCAM 3D Machining: Z-Level Roughing and Constant Cusp Finishing Setup"
excerpt: "How to configure EdgeCAM's 3D machining strategies for mold and die work — covering Z-level roughing parameters, constant cusp finishing settings, and rest machining for multi-stage workflows."
category: "manufacturing"
softwareSlug: "edgecam"
keyword: "edgecam 3d machining z-level roughing constant cusp"
slug: "edgecam-3d-machining-z-level-roughing-constant-cusp"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.stillam.com/wp-content/uploads/pdfs/edgecam_milling_more.pdf"
  - "https://hexagon.com/products/edgecam-intelligent-manufacturing"
---

# EdgeCAM 3D Machining: Z-Level Roughing and Constant Cusp Finishing Setup

Mold and die work requires 3D machining strategies that balance material removal rate with surface finish quality. I program mold cavities in EdgeCAM regularly, and the Z-level roughing + constant cusp finishing combination is my go-to workflow. Here's the complete setup.

## Step 1: Prepare the Model and Stock

1. Import the solid model (STEP or Parasolid) into EdgeCAM.
2. Define the stock model:
   - **Box stock**: Enter dimensions (X, Y, Z) and origin
   - **Cast stock**: Import an STL of the casting
3. Define the part model (the finished cavity/core geometry).
4. Set the work origin at the part's lower-left corner, top surface.

## Step 2: Z-Level Roughing

Z-level roughing removes material in horizontal slices at decreasing Z heights. It's the most efficient roughing strategy for 3D cavities.

### Create the Operation

1. Go to **Machining** → **3D Roughing** → **Z-Level**.
2. Select the machining boundary (a closed curve defining the area to machine).
3. Select the stock model and part model.

### Key Parameters

**Z Stepdown (slice height):**
- **Roughing**: 1-3mm for steel, 2-5mm for aluminum
- Smaller stepdown = smoother roughing but longer cycle time
- Use larger stepdown for bulk removal, smaller for semi-finishing

**Stepover (XY distance between passes):**
- **50-70% of tool diameter** for roughing (efficient material removal)
- **20-40% of tool diameter** for semi-finishing (leaves less stock for finishing)

**Tool selection:**
- **Roughing**: 10-20mm diameter end mill or bull nose (corner radius 0.8-2mm)
- **Semi-finishing**: 6-12mm diameter bull nose or ball nose

**Stock allowance:**
- **After roughing**: 0.5-1.0mm on all surfaces (leaves material for semi-finishing)
- **After semi-finishing**: 0.1-0.3mm (leaves minimal material for finishing)

**Cutting direction:**
- **Climb milling**: Preferred (better surface finish, lower cutting forces)
- **Conventional milling**: For hard materials or light machines

### Advanced Settings

**Pre-drill entry points**: For deep cavities, the tool can't plunge into solid material efficiently. Enable pre-drill entry:
1. EdgeCAM identifies safe entry points (areas where the tool can plunge without hitting part walls).
2. The tool plunges at these points, then machines the Z-level slice.
3. This eliminates slow ramp entries and reduces cycle time by 20-30%.

**Optimized Z-levels**: EdgeCAM analyzes the part geometry and adjusts the Z stepdown to match surface features:
- At flat areas: larger stepdown (faster)
- At curved areas: smaller stepdown (smoother)
- This adaptive stepdown saves 15-25% cycle time compared to fixed stepdown.

## Step 3: Rest Machining (Semi-Finishing)

After roughing, there's rest material in corners and valleys where the roughing tool couldn't reach. Rest machining cleans this up.

1. Go to **Machining** → **3D Roughing** → **Rest Material**.
2. Select the previous roughing operation as the reference.
3. EdgeCAM calculates the remaining stock from the roughing toolpath.
4. Set parameters:
   - **Reference tool diameter**: The roughing tool diameter (e.g., 16mm)
   - **Current tool diameter**: Smaller tool for rest machining (e.g., 6mm)
   - **Stepover**: 30-50% of current tool diameter
   - **Z stepdown**: 0.5-1.0mm (finer than roughing)

5. EdgeCAM generates toolpaths only in areas where the previous tool couldn't reach — no wasted air cutting.

## Step 4: Constant Cusp Finishing

Constant cusp finishing produces a uniform surface finish by maintaining a consistent scallop height across all surfaces.

### Create the Operation

1. Go to **Machining** → **3D Finishing** → **Constant Cusp**.
2. Select the part surfaces to finish.
3. Select the machining boundary.

### Key Parameters

**Scallop height (cusp):**
- **0.005mm**: Mirror finish (very long cycle time, for precision molds)
- **0.01mm**: High-quality mold finish (typical for injection mold cavities)
- **0.02mm**: Good finish (for forging dies, structural parts)
- **0.05mm**: Draft finish (for prototyping or non-critical surfaces)

**Tool selection:**
- **Ball nose**: 3-10mm diameter (most common for finishing)
- **Bull nose**: 6-12mm with 0.5-1mm corner radius (for semi-finishing or flat areas)

**Stepover calculation:**
EdgeCAM automatically calculates the stepover based on the scallop height and tool radius. For a 6mm ball nose with 0.01mm scallop:
- On flat surfaces: stepover = 0.55mm
- On 45° surfaces: stepover = 0.39mm
- On vertical walls: stepover = 0.55mm (same as flat)

This adaptive stepover is the advantage of constant cusp over fixed stepover — it maintains uniform finish on all surface angles.

**Cutting direction:**
- **One-way**: Tool lifts and repositions after each pass (better finish, longer cycle time)
- **Zig-zag**: Tool cuts in both directions (faster, slight quality difference at turnarounds)
- **Spiral**: Continuous spiral path (best for circular features)

## Step 5: Pencil Tracing (Corner Finishing)

After constant cusp finishing, sharp internal corners may have remaining material. Pencil tracing cleans these:

1. Go to **Machining** → **3D Finishing** → **Pencil Tracing**.
2. EdgeCAM automatically detects internal corners and fillet intersections.
3. Set parameters:
   - **Tool**: Smaller ball nose than the finishing tool (e.g., 2mm if finishing used 6mm)
   - **Multiple passes**: 2-3 passes stepping out from the corner
   - **Spindle speed**: Higher than finishing (smaller tool needs higher RPM)

## Step 6: Simulation and Verification

1. Run solid simulation on all operations in sequence.
2. Check:
   - **Roughing**: Stock is reduced to within 0.5mm of the part surface
   - **Rest machining**: Corners and valleys are cleaned up
   - **Finishing**: Part surface is fully covered (no rest material)
   - **Pencil tracing**: Internal corners are clean
3. Compare the simulated final part to the designed part — any gaps indicate missing operations.

## Cycle Time Estimation

For a typical mold cavity (100×80×30mm, P20 steel):

| Operation | Tool | Cycle Time |
|-----------|------|-----------|
| Z-level roughing (3mm stepdown) | 16mm end mill | 18 min |
| Rest machining (1mm stepdown) | 6mm ball nose | 12 min |
| Constant cusp finishing (0.01mm) | 6mm ball nose | 35 min |
| Pencil tracing | 2mm ball nose | 8 min |
| **Total** | | **73 min** |

## Common Issues

**Poor surface finish on steep walls**: Constant cusp may leave visible lines on near-vertical surfaces. Add a separate **Z-level finishing** operation for walls steeper than 70°.

**Tool deflection on deep cavities**: Long tools deflect under cutting forces, causing surface finish issues. Use the shortest tool possible for each depth. For cavities deeper than 30mm, use a tapered tool (larger shank, small ball tip) for rigidity.

**Rest machining misses areas**: The reference operation (roughing) must be simulated before rest machining can calculate remaining stock. If you modify the roughing operation, re-simulate it before updating rest machining.
