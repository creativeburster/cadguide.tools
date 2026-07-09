---
title: "Cimatron NC Programming: 3-Axis Mold Machining Toolpaths and Post-Processing"
excerpt: "How to program 3-axis CNC toolpaths in Cimatron NC for mold machining — covering roughing strategies, finishing toolpaths, rest machining, 3D projection cutting, and post-processor configuration for G-code output."
category: "manufacturing"
softwareSlug: "cimatron"
keyword: "cimatron nc programming 3-axis mold machining toolpath post-processor"
slug: "cimatron-nc-programming-3-axis-mold-machining-toolpath"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://help.cimatron.com/en/2026/Tips_and_Tricks.htm"
  - "https://www.cimatron.com/en/tutorials/cimatron-mold-design"
---

# Cimatron NC Programming: 3-Axis Mold Machining Toolpaths and Post-Processing

Cimatron NC is the manufacturing module that turns mold designs into G-code. I've programmed hundreds of mold inserts — from simple 2D pockets to complex 3D surfaces. The key to efficient mold machining is choosing the right toolpath strategy for each stage: roughing, semi-finishing, finishing, and rest machining. Here's my complete 3-axis workflow.

## Understanding Cimatron NC

Cimatron NC provides:
- **2.5D machining**: Drilling, pocketing, profiling
- **3-axis machining**: Roughing, finishing, rest machining
- **5-axis machining**: Multi-axis toolpaths for complex geometry
- **Simulation**: Full machine simulation with collision detection
- **Post-processing**: G-code generation for specific CNC machines

## Step 1: Set Up the NC Project

1. Go to **NC** → **New NC**.
2. Select the part to machine (mold insert, electrode, or component).
3. Define the **stock** (raw material):
   - **Bounding box**: Automatic stock from the part dimensions
   - **Custom stock**: Define specific stock dimensions
   - **Cast stock**: For pre-cast blanks with allowance
4. Set the ** UCS** (coordinate system):
   - **Origin**: Typically the part center or a corner
   - **Z-axis**: Up (spindle direction)
   - **Match the machine setup**: Align with the machine coordinate system

### Stock Definition Tips

- **Add 2-5mm allowance** on all sides for roughing stock
- **Define stock accurately** — toolpaths are calculated relative to the stock
- **Use cast stock for molds** — mold inserts are often pre-cast to near-net shape

## Step 2: Choose Tools

1. Go to **NC** → **Tools**.
2. Define cutting tools:
   - **End mills**: For roughing and general machining
   - **Ball nose mills**: For 3D surface finishing
   - **Bull nose mills**: For roughing and semi-finishing (corner radius reduces wear)
   - **Drills**: For holes and pre-drilling
3. For each tool, specify:
   - **Diameter**: Tool diameter (mm)
   - **Corner radius**: 0 for sharp, > 0 for bull nose, = diameter/2 for ball nose
   - **Length**: Total tool length
   - **Flute length**: Cutting flute length
   - **Number of flutes**: 2, 3, or 4
   - **Holder**: Tool holder dimensions (for collision checking)

### Tool Selection for Mold Machining

| Stage | Tool Type | Typical Diameter |
|---|---|---|
| Roughing | Bull nose end mill | 10-20mm |
| Semi-finishing | Bull nose or ball nose | 6-12mm |
| Finishing | Ball nose | 3-10mm |
| Rest machining | Ball nose | 1-4mm |
| Drilling | Drill | 3-20mm |

## Step 3: Create the Roughing Toolpath

Roughing removes the bulk of the material:

1. Go to **NC** → **Procedure** → **Roughing**.
2. Select the tool (bull nose end mill, 10-20mm).
3. Define the cut area:
   - **All surfaces**: Machine the entire part
   - **Selected surfaces**: Machine specific regions
   - **By Z levels**: Machine between specified Z heights
4. Set parameters:
   - **Stepover**: 50-75% of tool diameter (for roughing)
   - **Stepdown**: 0.5-2mm per Z level (depends on material and tool size)
   - **Spindle speed**: Calculate based on tool diameter and material (see below)
   - **Feed rate**: Calculate based on chip load
   - **Clearance plane**: Safe Z height above the part
   - **Entry method**: Helical, ramp, or direct plunge
5. Generate the toolpath.

### Roughing Strategies

**Z-level roughing** (default):
- Machines layer by layer from top to bottom
- Each Z level is a 2D pocket operation
- Good for parts with varying depths
- Efficient material removal

**Volume roughing**:
- Machines the entire stock volume
- Removes material in offset passes from the outside in
- Good for parts with open sides
- Less efficient for deep pockets

### Cutting Parameters for Common Mold Materials

**P20 tool steel** (pre-hardened, 30 HRC):
- Spindle speed: 300-600 m/min surface speed
- Feed rate: 0.05-0.1 mm/tooth
- Stepdown: 0.5-1mm for 10mm tool

**H13 tool steel** (hardened, 50 HRC):
- Spindle speed: 150-300 m/min surface speed
- Feed rate: 0.03-0.08 mm/tooth
- Stepdown: 0.3-0.5mm for 10mm tool

**Aluminum** (mold prototype):
- Spindle speed: 500-1000 m/min surface speed
- Feed rate: 0.08-0.15 mm/tooth
- Stepdown: 1-3mm for 10mm tool

## Step 4: Create the Semi-FFinishing Toolpath

Semi-finishing removes the stair-step pattern left by roughing:

1. Go to **NC** → **Procedure** → **Semi-Finishing** (or use 3D Projection).
2. Select the tool (bull nose or ball nose, 6-12mm).
3. Set parameters:
   - **Stepover**: 10-20% of tool diameter (finer than roughing)
   - **Stock allowance**: 0.1-0.3mm remaining for finishing
   - **Strategy**: Z-level or projection
4. Generate the toolpath.

### Semi-Finishing Strategy

- **Z-level semi-finishing**: Good for steep walls
- **Projection semi-finishing**: Good for shallow surfaces
- **Combine both**: Use Z-level for walls and projection for floors

## Step 5: Create the Finishing Toolpath

Finishing achieves the final surface quality:

1. Go to **NC** → **Procedure** → **Finishing** → **3D Projection**.
2. Select the tool (ball nose, 3-10mm).
3. Set parameters:
   - **Stepover**: 0.05-0.2mm (depends on required surface finish)
   - **Stock allowance**: 0 (machine to final dimension)
   - **Strategy**: Parallel, radial, or 3D equal scallop
4. Generate the toolpath.

### Finishing Strategies

**Parallel finishing**:
- Toolpath runs parallel lines at a specified angle
- Good for general-purpose finishing
- Fast and simple
- May leave scallops on steep walls

**3D Equal Scallop**:
- Maintains consistent scallop height across the surface
- Good for curved surfaces with varying angles
- Slower than parallel but better surface quality
- Recommended for mold finishing

**Z-level finishing**:
- Machines horizontal slices
- Good for steep walls
- Combines with projection for complete finishing

### Surface Finish Quality

The surface finish depends on:
- **Stepover**: Smaller stepover = smoother surface but longer machining time
- **Tool quality**: Sharp, balanced tools produce better finishes
- **Tool deflection**: Shorter tools deflect less, producing better finishes
- **Machining strategy**: 3D equal scallop produces the most uniform finish

**Scallop height calculation**:
```
Scallop height = (stepover)² / (8 × tool radius)
```
For a 6mm ball nose with 0.1mm stepover:
```
Scallop = (0.1)² / (8 × 3) = 0.0004mm = 0.4µm
```

## Step 6: Create Rest Machining Toolpaths

Rest machining removes material that previous tools couldn't reach:

1. Go to **NC** → **Procedure** → **Rest Machining**.
2. Select a smaller tool (ball nose, 1-4mm).
3. The system identifies areas where the previous tool left material:
   - **Corner radii**: Where the previous tool's radius was too large
   - **Narrow channels**: Where the previous tool couldn't enter
   - **Deep pockets**: Where the previous tool was too short
4. Set parameters similar to finishing but only for the remaining material.
5. Generate the toolpath.

### Rest Machining Tips

- **Use reference tool**: The system compares the current tool to the previous tool
- **Check for thin walls**: Rest machining can break small tools on thin walls
- **Reduce stepdown**: Use smaller stepdown for small tools to prevent breakage
- **Use shorter tools**: Minimize tool length to reduce deflection and breakage

## Step 7: Simulate the Toolpaths

Before post-processing, simulate all toolpaths:

1. Go to **NC** → **Simulation**.
2. Run the simulation for each procedure:
   - **Toolpath simulation**: Shows the tool moving along the path
   - **Material removal simulation**: Shows the stock being cut
   - **Collision detection**: Checks for tool-holder collisions
3. Check for:
   - **Gouging**: Tool cuts below the final surface
   - **Collisions**: Tool or holder hits the part or fixture
   - **Rapid moves through stock**: Tool moves rapidly through material (dangerous)
   - **Air cutting**: Tool cuts air (wastes time — optimize the toolpath)

### Simulation Best Practices

- **Always simulate before post-processing** — catches errors before the machine
- **Check collision with holder** — not just the tool
- **Verify material removal** — ensure the stock is fully machined
- **Check rapid moves** — ensure rapids are above the clearance plane

## Step 8: Post-Process to G-Code

1. Go to **NC** → **Post-Process**.
2. Select the post-processor for your CNC machine:
   - **Fanuc**: Most common CNC controller
   - **Siemens**: Common in European machines
   - **Heidenhain**: Common in European machines
   - **Mitsubishi**: Common in Asian machines
3. Configure post-processor options:
   - **Units**: Metric (G21) or Imperial (G20)
   - **Work offset**: G54, G55, etc.
   - **Tool length compensation**: G43
   - **Cutter compensation**: G41/G42
4. Generate the G-code.
5. Review the G-code:
   - **Check for errors**: M-codes, spindle speed, feed rate
   - **Verify tool changes**: T-codes and M06
   - **Check safe moves**: G00 moves above clearance plane

### Post-Processor Configuration

If the post-processor doesn't match your machine:
1. Edit the post-processor file (Cimatron uses .pp files).
2. Common adjustments:
   - **Spindle format**: S3000 vs S3000.0
   - **Feed rate format**: F500 vs F500.0
   - **Tool change format**: T1 M06 vs M06 T1
   - **Arc format**: I/J/K vs R
3. Test with a simple program before running complex parts.

## Best Practices

- **Start with the largest tool and work down** — rough with 20mm, finish with 6mm, rest machine with 2mm
- **Use bull nose tools for roughing** — corner radius reduces tool wear
- **Use ball nose tools for finishing** — produces smooth 3D surfaces
- **Calculate scallop height** — match stepover to the required surface finish
- **Always simulate before post-processing** — catches gouges and collisions
- **Use rest machining for corners** — removes material the larger tools couldn't reach
- **Keep tools short** — shorter tools deflect less and produce better finishes
- **Document tool lists and parameters** — the setup sheet is essential for the machine operator
- **Verify G-code on the machine** — dry run the first part before cutting material
- **Use high-speed machining settings** — for machines that support HSM, enable smooth transitions and trochoidal paths
