---
title: "BobCAD-CAM 3-Axis Milling Workflow: Stock Setup, Toolpath Wizards, and Simulation"
excerpt: "Complete BobCAD-CAM 3-axis milling workflow: import geometry, define stock and work offset, use Toolpath Wizards for facing, profiling, pocketing, and drilling with simulation and verification."
category: "workflow"
softwareSlug: "bobcad-cam"
keyword: "bobcad-cam 3 axis milling workflow toolpath wizard simulation"
slug: "bobcad-cam-3-axis-milling-workflow-stock-setup-toolpath-wizards"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://bobcad.com/cadcam-software-machine-toolpath-wizards/"
  - "https://bobcadsupport.com/technical-support/getting-setup-with-bobcad-cam/"
---

# BobCAD-CAM 3-Axis Milling Workflow: Stock Setup, Toolpath Wizards, and Simulation

BobCAD-CAM uses a wizard-based workflow that guides you through each step of toolpath creation. The wizards make it accessible for users new to CAM while still offering enough control for production work. Here's the complete 3-axis milling workflow from start to finish.

## Step 1: Import or Create Geometry

1. **File > Open** to import a CAD file (STEP, IGES, STL, or BobCAD native)
2. Alternatively, use BobCAD's built-in CAD tools to draw the part
3. Verify the geometry orientation — the Z-axis should point up (tool direction)
4. Check units (inches or millimeters) match your machine setup

## Step 2: Stock Setup

1. Go to **CAM > Stock > Stock Definition**
2. Choose stock type:
   - **Rectangular block** — most common for milling
   - **Cylindrical** — for lathe or rotary work
   - **From geometry** — auto-sized to the part bounding box
3. Set stock dimensions:
   - Length, Width, Height
   - Add 0.125-0.25 inch (3-6mm) extra on each side for facing
4. Set the **stock origin** — typically the top-left-front corner or center
5. The stock appears as a translucent block around the part

## Step 3: Machine Setup and Work Offset

1. Go to **CAM > Machine Setup**
2. Define the **Machine** — select your machine type (3-axis mill, etc.)
3. Set the **Work Offset** — G54, G55, etc.
4. Define the **origin point** — where X0, Y0, Z0 is located on the part
5. The origin should match where you'll touch off the tool on the physical machine

## Step 4: Create Toolpaths Using Wizards

BobCAD's Toolpath Wizards walk you through each operation step by step.

### Facing Operation

1. Go to **CAM > Mill 2 Axis > Facing**
2. The wizard opens with these steps:
   - **Geometry** — select the top surface or stock boundary
   - **Tool** — select an end mill or face mill from the tool library
   - **Parameters** — set step-over (50-70% of tool diameter), depth per pass, total depth
   - **Leads/Links** — set lead in/out and retract height
   - **Speeds/Feeds** — set spindle RPM, feed rate, plunge rate
3. Click **Compute** to generate the toolpath

### Profiling Operation

1. Go to **CAM > Mill 2 Axis > Profiling**
2. Select the geometry (edge of the part or a 2D contour)
3. Choose **compensation side** — left, right, or center
4. Set the tool, parameters, and speeds/feeds
5. Configure **lead in/out** — arc or linear leads
6. Set **multi-pass** — number of depth passes and step-down amount
7. Click **Compute**

### Pocketing Operation

1. Go to **CAM > Mill 2 Axis > Pocketing**
2. Select the pocket boundary geometry
3. Choose pocket type:
   - **Standard** — removes all material inside the boundary
   - **Island** — leaves material in the center
   - **Facing** — finishes the bottom flat
4. Set the tool, parameters, and speeds/feeds
5. Configure **roughing** — step-over percentage, spiral or zigzag pattern
6. Configure **finishing** — finish pass with smaller step-over
7. Click **Compute**

### Drilling Operation

1. Go to **CAM > Drill**
2. Select hole positions (points or circle centers)
3. Choose drill cycle:
   - **Drill** — standard drilling
   - **Peck** — peck drilling for deep holes
   - **Tap** — rigid tapping
   - **Bore** — boring cycle
4. Set the tool, depth, and retract height
5. Set speeds/feeds appropriate for the drill size
6. Click **Compute**

## Step 5: Simulation and Verification

After creating all toolpaths:

1. Go to **CAM > Simulation**
2. The simulation window opens with the stock and toolpaths loaded
3. Click **Play** to watch the tool remove material
4. Check for:
   - **Collisions** — tool hitting the part or stock incorrectly
   - **Gouges** — tool cutting into the finished surface
   - **Rapid moves through material** — dangerous and should be corrected
5. Use the **Compare** feature to check the machined part against the design model
6. Any discrepancies appear in red

## Step 6: Post Processing

1. Go to **CAM > Posting > Post**
2. Select the post processor for your machine
3. Choose the operations to post (all or selected)
4. Set the output file name and location
5. Click **Post** to generate the G-code
6. Review the G-code before sending to the machine

## Common Issues

### Toolpath Doesn't Generate

- Check that geometry is selected correctly
- Verify the tool is assigned
- Ensure the compensation side is set (for profiling)
- Check that the stock is defined

### Simulation Shows Wrong Material Removal

- The stock dimensions may be incorrect
- The tool may be defined with wrong dimensions
- The work offset may be in the wrong location

### G-Code Has Wrong Tool Order

See the post processor configuration guide for fixing tool change order issues.

## Best Practices

- **Always simulate before posting** — catch errors in software, not on the machine
- **Use the Tool Library** — save tools with correct parameters for reuse
- **Set realistic speeds and feeds** — too aggressive causes tool breakage, too conservative wastes time
- **Create operations in machining order** — face first, then rough, then finish, then drill
- **Save the BobCAD file** — keep the source file for future modifications
