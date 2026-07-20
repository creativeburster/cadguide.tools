---
title: "Mastercam 2D Machining: Facing, Contour, Pocket, and Drilling Toolpaths"
excerpt: "Mastercam's 2D machining tools create toolpaths for facing, contouring, pocketing, and drilling operations. We cover tool selection, stock setup, facing, contour roughing and finishing, pocket milling with islands, and drilling cycles for CNC milling."
category: "workflow"
softwareSlug: "mastercam"
keyword: "Mastercam 2D machining facing contour pocket drilling toolpaths tool selection stock setup CNC milling roughing finishing"
slug: "mastercam-2d-machining-facing-contour-pocket-drilling-toolpaths"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.mastercam.com/support/product-training/courses/"
  - "https://medium.com/@adem.oezkaya/beginners-guide-to-mastercam-toolpaths-7e1df500af53"
---

# Mastercam 2D Machining: Facing, Contour, Pocket, and Drilling Toolpaths

We've programmed hundreds of CNC parts in Mastercam for job shops and production manufacturing. Mastercam is the most widely used CAM software in North America, and its 2D machining toolpaths are the foundation of CNC milling. Understanding facing, contouring, pocketing, and drilling — and how to optimize each for speed and surface finish — is the starting point for every CNC programmer.

## Mastercam Overview

Mastercam product tiers:
- **Mastercam Mill**: 2D and 3D milling
- **Mastercam Lathe**: CNC turning
- **Mastercam Mill-Turn**: Combined milling and turning
- **Mastercam Router**: CNC routing
- **Mastercam Wire**: Wire EDM
- **Mastercam Design**: CAD modeling (included with all products)

## Setting Up a Job

### Importing Geometry

1. File → Open or Import
2. Select a CAD file:
   - **Native**: SolidWorks, Inventor, Creo, NX, CATIA
   - **Neutral**: STEP, IGES, Parasolid, STL, DWG/DXF
3. The geometry appears in the graphics window
4. Verify the model orientation (Z-up is standard for milling)

### Stock Setup

1. Go to **Toolpaths** → **Stock Setup**
2. Set the stock boundary:
   - **Bounding box**: Auto-calculate from geometry
   - **Custom dimensions**: Enter X, Y, Z stock size
   - **STL model**: Use a custom stock model
3. Set the stock origin (where the stock corner is relative to the part)
4. Set the material:
   - Select from the material library (aluminum, steel, stainless, etc.)
   - The material affects feed and speed calculations
5. Click **OK**

### Machine Setup

1. Go to **Machine** tab → Select machine type:
   - **Mill**: 3-axis, 4-axis, or 5-axis
   - **Lathe**: 2-axis or multi-axis
   - **Router**: 3-axis or 5-axis
2. Select the control type:
   - **Fanuc, Haas, Siemens, Mazak, Okuma, etc.**
3. The machine definition controls:
   - **Axis configuration**: Number and type of axes
   - **Travel limits**: Maximum X, Y, Z travel
   - **Feed rates**: Maximum feed and rapid rates
   - **Tool changer**: Number of tool positions

## Tool Selection

### Creating a Tool

1. In any toolpath dialog, click **Select Tool**
2. The Tool Manager opens
3. Click **Create New Tool**
4. Select tool type:
   - **End Mill Flat**: For facing, contouring, pocketing
   - **End Mill Bull**: For pocketing with floor radius
   - **End Mill Ball**: For 3D surfacing
   - **Face Mill**: For facing large surfaces
   - **Drill**: For drilling holes
   - **Tap**: For threading holes
   - **Reamer**: For precision holes
   - **Chamfer Mill**: For chamfering and deburring
   - **Spot Drill**: For spot drilling
5. Set tool parameters:
   - **Diameter**: Tool diameter (e.g., 0.5")
   - **Flute length**: Cutting flute length
   - **Overall length**: Total tool length
   - **Number of flutes**: 2, 3, 4, or more
   - **Corner radius**: For bull nose tools
   - **Point angle**: For drills (118° or 135°)
6. Set holder parameters:
   - **Holder type**: CAT40, BT40, HSK63A, etc.
   - **Holder dimensions**: Collet, shrink fit, or end mill holder
7. Set cutting parameters:
   - **Feed rate**: Inches per minute (IPM) or mm/min
   - **Spindle speed**: RPM
   - **Plunge rate**: Feed rate for plunging
   - **Retract rate**: Feed rate for retracting

### Tool Library

1. Build a tool library with commonly used tools
2. Save tools to the library for reuse
3. Organize by:
   - **Diameter**: 1/8", 1/4", 3/8", 1/2", 3/4", 1"
   - **Type**: Flat end mill, ball mill, drill, tap
   - **Material**: Carbide, HSS, coated
4. The library speeds up toolpath creation

## Facing Toolpath

### Creating a Facing Operation

1. Go to **Toolpaths** → **2D** → **Face**
2. Select the tool (face mill or large end mill)
3. Select the facing boundary:
   - **Chain**: Select the outer boundary of the stock
   - **Window**: Select all geometry within a window
4. Set facing parameters:
   - **Stock to leave**: 0 (facing removes all stock)
   - **Stepover**: 75-80% of tool diameter (for face mill)
   - **Roughing passes**: Multiple depth cuts if stock is thick
   - **Depth per pass**: e.g., 0.050" per pass
   - **Finish pass**: Optional light pass for surface finish
5. Set lead in/out:
   - **Lead in**: Arc or linear entry to the cut
   - **Lead out**: Arc or linear exit from the cut
6. Click **OK** to generate the toolpath

### Facing Best Practices

- Use the largest face mill that fits the stock
- Stepover of 75-80% maximizes material removal while maintaining finish
- Climb milling (default) produces better surface finish
- For hard materials, reduce stepover to 50-60%
- Add a finish pass at full depth with reduced feed for better finish

## Contour Toolpath

### Creating a Contour Operation

1. Go to **Toolpaths** → **2D** → **Contour**
2. Select the tool (end mill)
3. Chain select the contour (the edge to machine)
4. Set contour parameters:
   - **Depth**: Z depth of the cut
   - **Stock to leave**: 0 for finishing, 0.010" for roughing
   - **Roughing passes**: Number of depth cuts
   - **Depth per pass**: e.g., 0.100" for roughing
   - **Finish passes**: Number of finish passes at final depth
   - **Finish stepover**: e.g., 0.005" for finishing
5. Set compensation:
   - **Computer**: Toolpath is offset in software (no G41/G42)
   - **Control**: Toolpath is on the centerline, G41/G42 in the code
   - **Wear**: Combination of computer and control
6. Set lead in/out:
   - **Entry**: Arc, linear, or perpendicular entry
   - **Exit**: Arc, linear, or perpendicular exit
   - **Overlap**: Overlap the entry and exit points
7. Click **OK**

### Contour Roughing vs Finishing

**Roughing**:
- Larger tool (1/2" or 3/4")
- Larger depth per pass (0.100" - 0.250")
- Higher feed rate (50-100 IPM in aluminum)
- Stock to leave: 0.010" - 0.020"
- Climb milling

**Finishing**:
- Smaller tool (1/4" or 3/8")
- Single pass at final depth
- Lower feed rate (10-30 IPM for good finish)
- Stock to leave: 0
- Climb milling
- Spring pass (no material removal) for better finish

## Pocket Toolpath

### Creating a Pocket Operation

1. Go to **Toolpaths** → **2D** → **Pocket**
2. Select the tool (end mill)
3. Chain select the pocket boundary
4. If the pocket has islands:
   - Select the outer boundary first
   - Select the island boundaries (areas to avoid)
5. Set pocket parameters:
   - **Depth**: Z depth of the pocket
   - **Stock to leave**: 0 for finishing, 0.010" for roughing
   - **Roughing passes**: Depth cuts
   - **Depth per pass**: e.g., 0.100" for roughing
6. Set pocket machining type:
   - **Standard**: Zig-zag or spiral pocketing
   - **Facing**: Single-direction pocketing
   - **Island facing**: Pocket with island tops at different depths
7. Set roughing parameters:
   - **Stepover**: 50-75% of tool diameter
   - **Roughing angle**: Direction of zig-zag cuts
   - **Spiral inside-out or outside-in**: Pocketing direction
   - **Minimize tool burial**: Reduce engagement in corners
8. Set finish parameters:
   - **Finish passes**: 1-2 passes around the perimeter
   - **Finish stepover**: 0.005" - 0.010"
   - **Finish contour**: Machine the island perimeters
9. Click **OK**

### Pocket Best Practices

- Use adaptive pocketing (peel milling) for deep pockets to reduce heat
- For hard materials, reduce stepover to 30-50%
- Machine islands at the same depth as the pocket floor
- Use a smaller tool for finishing tight corners
- Add a finish pass around the perimeter for better wall finish
- For very deep pockets, use multiple roughing tools (rough with large, finish with small)

## Drilling Toolpath

### Creating a Drilling Operation

1. Go to **Toolpaths** → **2D** → **Drill**
2. Select the tool (drill, spot drill, tap, reamer)
3. Select the hole positions:
   - **Point**: Select individual hole centers
   - **Window**: Select all holes within a window
   - **Arc**: Select arc centers as hole positions
4. Set drilling parameters:
   - **Cycle type**:
     - **Drill**: Simple drilling (G81)
     - **Peck drill**: Peck drilling (G83) — for deep holes
     - **Chip break**: Chip breaking (G73) — for stringy materials
     - **Tap**: Rigid tapping (G84)
     - **Bore**: Boring (G85, G86, G89)
     - **Ream**: Reaming (G85)
   - **Depth**: Hole depth (tip or full diameter)
   - **Clearance plane**: Z height for retract between holes
   - **Retract height**: Z height for peck retract
   - **Feed rate**: Plunge rate
   - **Dwell**: Dwell at bottom (for chip breaking)
5. For peck drilling:
   - **Peck depth**: Depth per peck (e.g., 0.250")
   - **Retract amount**: How far to retract between pecks
6. Set tip compensation:
   - **Tip length**: Account for the drill tip angle
   - **Through tip**: Extend through the bottom of the hole
   - **Breakthrough**: Extra depth for full diameter breakthrough
7. Click **OK**

### Drilling Best Practices

- **Spot drill first**: Use a spot drill (90° or 120°) to create a starting dimple
- **Peck for deep holes**: Holes deeper than 3× diameter should be peck drilled
- **Use coolant through spindle (CTS)**: For deep holes in hard materials
- **Chamfer after drilling**: Use a chamfer mill to deburr hole edges
- **Tap with rigid tapping**: Ensure the machine supports rigid tapping (G84)
- **Ream for precision**: Drill 0.015" undersized, then ream to final size

## Toolpath Verification

### Backplot

1. After generating a toolpath, click **Backplot**
2. The toolpath is simulated on screen:
   - **Tool motion**: Shows the tool moving along the path
   - **Color coding**: Rapid (blue), feed (yellow), plunge (red)
   - **Step controls**: Play, pause, step forward, step backward
3. Check for:
   - **Gouges**: Tool cutting into the part where it shouldn't
   - **Rapid moves into part**: Rapid movements that collide with stock
   - **Missing areas**: Areas that aren't machined

### Verify (Solid Simulation)

1. Click **Verify** (Stock simulation)
2. The stock is rendered and the toolpath removes material:
   - **Realistic rendering**: Shows the machined part
   - **Compare to CAD**: Highlights differences between stock and model
   - **Collision detection**: Alerts if the tool or holder collides
3. Check:
   - **Final part matches CAD**: No leftover stock, no gouges
   - **Tool holder clearance**: Holder doesn't hit the part or clamps
   - **Rapid moves are safe**: No rapid moves through material

## Post-Processing

### Generating G-Code

1. After verifying all toolpaths:
2. Go to **Toolpaths** → **Post Selected Operations**
3. Select the post-processor:
   - **Machine-specific**: Fanuc, Haas, Siemens, Mazak, etc.
   - The post-processor converts Mastercam toolpaths to machine-specific G-code
4. Set output options:
   - **NC file name**: Name the output file
   - **NC extension**: .nc, .tap, .cnc, .gcode
   - **Output to**: File, DNC, or both
5. Click **OK**
6. The G-code is generated

### G-Code Review

1. Open the NC file in a text editor or NC viewer
2. Check:
   - **Program header**: Tool changes, spindle start, coolant
   - **Toolpath coordinates**: Match expected positions
   - **Feed rates**: Correct for each operation
   - **Rapid moves**: Safe Z heights
   - **Program end**: M30 or M2
3. Verify the first tool change and tool length compensation (G43 H__)

## Common Issues

### Toolpath Gouges the Part

- Check the chain direction (clockwise vs counterclockwise)
- Verify the compensation direction (left vs right)
- Check the stock to leave value
- Use backplot to identify where the gouge occurs

### Surface Finish Is Poor

- Reduce the feed rate for finishing passes
- Increase the spindle speed (higher RPM = better finish)
- Reduce the stepover for finishing
- Use a sharper tool or newer insert
- Add a spring pass (no material removal)
- Check for tool deflection (use a shorter or larger diameter tool)

### Tool Breaks

- Reduce the depth per cut
- Reduce the feed rate
- Use a larger diameter tool
- Check for chip clogging (use coolant or air blast)
- Use peck drilling for deep holes
- Verify the tool is appropriate for the material

### Cycle Time Is Too Long

- Use a larger tool for roughing
- Increase the stepover (up to 75% of tool diameter)
- Increase the depth per cut (if tool and material allow)
- Use high-efficiency machining (adaptive toolpaths)
- Reduce the number of finish passes
- Optimize the toolpath linking (minimize rapid moves)

## Summary

Mastercam's 2D machining provides facing, contouring, pocketing, and drilling toolpaths for CNC milling. Set up stock dimensions and material, select the machine and control type, and create tools with correct parameters (diameter, flutes, feed, speed). Use facing for surface preparation, contour for edges and profiles, pocket for internal cavities with islands, and drilling for holes with appropriate cycle types (drill, peck, tap, ream). Always rough with a larger tool and finish with a smaller tool. Verify toolpaths with backplot and solid simulation before post-processing. Generate G-code with the correct post-processor for your machine. The most common issues — gouges, poor finish, tool breakage, and long cycle times — are addressed by checking chain direction, reducing feed rate, reducing depth per cut, and optimizing toolpath parameters. Mastercam's 2D toolpaths are the foundation of CNC programming for job shops and production manufacturing.
