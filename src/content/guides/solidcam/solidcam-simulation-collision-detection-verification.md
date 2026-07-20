---
title: "SolidCAM Simulation and Verification: Preventing Collisions Before They Happen"
excerpt: "How to use SolidCAM's solid simulation and machine simulation to verify toolpaths — covering stock model updates, collision detection, holder avoidance, and remote cycle time estimation."
category: "troubleshooting"
softwareSlug: "solidcam"
keyword: "solidcam simulation collision detection verification"
slug: "solidcam-simulation-collision-detection-verification"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://solidcam.help/2023/milling/imachining_operation_overview.htm"
  - "https://solidcam.com/imachining/imachining-technology-wizard/"
---

# SolidCAM Simulation and Verification: Preventing Collisions Before They Happen

I've caught two near-miss collisions in SolidCAM simulation that would have destroyed expensive fixtures on the machine. Simulation isn't optional — it's the last line of defense before metal meets metal. Here's how to set it up properly and what to look for.

## Types of Simulation in SolidCAM

### 1. Toolpath Simulation

The basic simulation mode shows the toolpath as a 3D line. The tool follows the path, but there's no stock model and no collision detection.

**Use for**: Quick visual check that the toolpath covers the intended area and doesn't have obvious errors.

**Limitations**: No stock removal visualization, no collision detection, no holder checking.

### 2. Solid Simulation (SolidVerify)

The advanced simulation mode creates a 3D stock model and updates it as the tool removes material. This shows exactly what the part will look like after each operation.

**Use for**: Verifying stock removal, detecting gouges, checking final part geometry.

**Features**:
- Color-coded stock model (machined areas vs. remaining stock)
- Gouge detection (tool cuts below final part surface)
- Rest material detection (areas not fully machined)
- Cycle time estimation

### 3. Machine Simulation

Full machine kinematic simulation — shows the actual CNC machine (spindle, table, axes) moving through the toolpath. Detects collisions between the tool holder, spindle, fixtures, and machine components.

**Use for**: Final verification before running on the machine. Essential for 5-axis operations and tight-clearance setups.

## Setting Up Solid Simulation

### Step 1: Define the Stock Model

1. In the SolidCAM operation tree, right-click **Stock** → **Define Stock**.
2. Choose stock type:
   - **Box**: Rectangular block (enter dimensions)
   - **Cylinder**: Round stock (enter diameter and length)
   - **From SolidWorks model**: Use a SolidWorks part as the stock
   - **From STL**: Import an STL file as the stock (useful for castings or forgings)
3. Set the stock origin to match your machine setup (G54 location).

### Step 2: Define the Part Model

1. Right-click **Part** → **Define Part**.
2. Select the SolidWorks part that represents the finished geometry.
3. SolidCAM uses this to detect gouges (cutting below the part surface).

### Step 3: Define Fixtures

1. Right-click **Fixtures** → **Add Fixture**.
2. Select SolidWorks components representing vises, clamps, fixture plates.
3. These are included in collision detection during machine simulation.

### Step 4: Run Solid Simulation

1. Right-click an operation → **Simulate**.
2. The Solid Simulation panel appears.
3. Set simulation speed: Slow (for detailed checking) or Fast (for quick overview).
4. Click **Play** to start simulation.
5. The stock model updates in real-time as the tool removes material.

### What to Watch For

- **Gouges**: Red marks on the part surface indicate the tool cut below the intended finish. This is a critical error — fix the toolpath before proceeding.
- **Rest material**: Blue/green areas indicate stock that wasn't removed. Decide if this is acceptable (will be removed by a later operation) or if the toolpath needs adjustment.
- **Rapid moves through stock**: The tool should rapid above the stock surface, not through it. If you see the tool moving through solid material at rapid speed, adjust the clearance plane.
- **Toolholder contact**: In solid simulation, the toolholder is shown but collisions aren't detected. Use machine simulation for holder collision checking.

## Setting Up Machine Simulation

### Step 1: Select a Machine Model

1. Go to **CAM-Part** → **Settings** → **Machine**.
2. Select your machine from SolidCAM's machine library, or import a custom machine model.
3. Define the machine's work envelope (X, Y, Z travel limits).
4. Define the spindle nose dimensions and tool holder dimensions.

### Step 2: Define Tool Holders

1. In the tool definition dialog, add tool holder geometry:
   - **Holder type**: CAT40, BT40, HSK63A, etc.
   - **Holder dimensions**: Overall length, max diameter, taper angle.
   - **Collet/nut dimensions**: Include these in the holder model.
2. Accurate holder dimensions are critical — most collisions involve the holder, not the cutting tool.

### Step 3: Run Machine Simulation

1. Right-click the operation or the entire CAM-Part → **Machine Simulation**.
2. The 3D machine model appears with the stock, part, and fixtures in position.
3. Click **Play** to simulate.
4. SolidCAM checks for collisions between:
   - Tool and stock (expected — cutting)
   - Tool and part (gouge detection)
   - Tool holder and stock (collision!)
   - Tool holder and fixtures (collision!)
   - Spindle and fixtures (collision!)
   - Any machine component and the work envelope boundary

### Interpreting Collision Warnings

When a collision is detected:
1. Simulation stops at the collision point.
2. The colliding components are highlighted in red.
3. A message displays: "Collision between [Tool Holder] and [Fixture Clamp]".
4. Note the operation, step number, and tool position.

### Fixing Collisions

**Holder-to-stock collision**: The tool is too short, causing the holder to dip into the stock. Fix by:
- Using a longer tool (extend tool length)
- Reducing the depth of cut
- Using a different holder with a smaller nose diameter

**Holder-to-fixture collision**: The tool path brings the holder too close to a clamp. Fix by:
- Repositioning the fixture (if possible)
- Using a longer tool to reach past the fixture
- Adding a "Avoid Fixtures" check in the operation settings
- Splitting the operation: machine one side, reposition clamp, machine the other side

**Spindle-to-fixture collision**: The spindle nose hits a tall clamp or fixture. Fix by:
- Using shorter clamps
- Raising the clearance plane
- Repositioning the part in the work envelope

## Cycle Time Estimation

Solid simulation provides an accurate cycle time estimate:

1. After simulation, check the **Info** panel.
2. Cycle time is broken down by:
   - **Cutting time**: Time spent actively removing material
   - **Rapid time**: Time spent in rapid moves (G00)
   - **Tool change time**: Time for each tool change (configurable in machine settings)
3. Total cycle time = cutting + rapid + tool changes.

This estimate is typically within 5-10% of actual machine time. For more accuracy, set the rapid traverse rates and tool change times to match your machine's actual values in the machine settings.

## Best Practices

1. **Always simulate before posting G-code** — Even if the toolpath looks correct in the graphics view, solid simulation catches gouges and rest material that aren't visible otherwise.

2. **Simulate the entire CAM-Part, not individual operations** — Individual operation simulation doesn't detect collisions between operations (e.g., a clamp added for operation 5 that interferes with operation 2).

3. **Update the stock model between operations** — SolidCAM automatically updates the stock model as you simulate operations in sequence. Don't skip operations during simulation — the stock state depends on all prior operations.

4. **Use realistic tool holder dimensions** — The #1 cause of undetected collisions is incorrect holder dimensions. Measure your actual holders and collets, don't use defaults.

5. **Check the final stock model** — After all operations, compare the simulated final part to the designed part. Any discrepancies indicate missing operations or incorrect toolpaths.
