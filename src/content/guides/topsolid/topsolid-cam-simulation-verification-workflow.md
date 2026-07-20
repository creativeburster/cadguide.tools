---
title: "TopSolid'Cam: Simulation and Verification Workflow for CNC Machining"
excerpt: "Guide to TopSolid'Cam's simulation and verification tools — covering programming mode, machine simulation mode, turbo mode, and comparison with the design part — based on official TopSolid 7.15/7.16 documentation."
category: "workflow"
softwareSlug: "topsolid"
keyword: "topsolid cam simulation verification cnc machining workflow"
slug: "topsolid-cam-simulation-verification-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://help.topsolid.com/7.15/en/TopSolid'Cam/CommonDialogBox/simulationverify.htm"
  - "https://help.topsolid.com/7.15/en/TopSolid'Cam/GettingStart/Comment_demarrer_dans_TS7.htm"
  - "https://topsolid.com/en/products/topsolidcam/machining"
---

# TopSolid'Cam: Simulation and Verification Workflow for CNC Machining

TopSolid'Cam provides two simulation modes and two verification modes for validating CNC toolpaths before machining. This guide documents the complete workflow based on official TopSolid 7.15/7.16 help documentation.

## Simulation vs. Verification

TopSolid distinguishes between simulation and verification:

- **Simulation**: Step-by-step playback of the toolpath with the tool visible — for reviewing tool movements and checking for obvious issues
- **Verification**: Full material removal calculation — for checking the final machined part against the design

## Accessing Simulation/Verification

1. **Right-click on an operation** → select Simulate or Verify
2. **Right-click on the part** → select Verify All Operations
3. Use the **Verification tab** in the ribbon

## Simulation Modes

### Programming Simulation Mode
- Only the tool is represented (no machine)
- Faster calculation
- Good for quick toolpath review
- Tool display options: select which tool elements to visualize (body, holder, etc.)
- Click the black arrow icon to select tool elements

### Machine Simulation Mode
- Tool AND machine are represented
- Shows power axis rotation during simulation
- More realistic — shows the actual machine movements
- Slower calculation due to machine kinematics
- Can show/hide origins during simulation
- Shows the machine envelope and potential collisions with machine components

## Simulation Controls

### Speed and Position Sliders
1. **Operation slider**: When multiple operations are selected, move through the machining range from operation to operation
   - Beginning of machining range |——| End of machining range
2. **Toolpath slider**: Within an operation, move through the toolpath
   - Beginning of toolpath |——| End of toolpath
3. **Overall speed slider**: Adjust simulation speed
   - Minimum speed |——| Maximum speed
4. **Power axis speed slider**: Adjust simulation speed of rotary axes
5. **Rapid movement speed coefficient**: Adjust rapid traverse speed relative to the machine's defined rapid feed rate
   - Reduce speed to maximum |——| Return to machine-defined rapid feed rate

### Simulation Increment Modes
- **Time increment**: Simulation speed is proportional to the feed rate of the operation — faster feed = faster simulation
- **Length increment**: Simulation speed is constant — does not depend on the feed rate

### Display Options
- **Erase tool path display**: Erases the display of already-executed toolpath, showing only the path from the current position forward
- **Show/hide origins**: Toggle origin display during simulation
- Right-click on the simulation window to personalize: adjust font size, decimal digits, and display information

## Verification Modes

### Turbo Mode
- Directly displays the material removal result in a Z-buffer view
- Fastest verification method
- Shows the final stock after material removal
- No animation — just the result
- Good for quick stock verification

### Animation Mode
- Animates the tool removing material along the toolpaths
- Shows the material being removed step by step
- Supports milling operations with various WCSs (Work Coordinate Systems)
- More computationally intensive — takes more time
- Good for presentation and detailed review

## Verification Comparison

After the verification calculation completes:

1. **Right-click** in the verification window
2. Or use the **Verification tab**
3. Select **Comparison**
4. TopSolid compares the verification result (machined part) with the **Design part**
5. The comparison shows:
   - **Green**: Material remaining that should have been removed (overstock)
   - **Red**: Material removed that shouldn't have been (gouging/undercut)
   - **Gray/neutral**: Correctly machined surfaces

This comparison is critical for verifying that the toolpath produces the intended geometry.

## Complete Workflow: From Design to Verified Toolpath

### Step 1: Create a CAM Document
1. Launch TopSolid 7
2. Create a new milling document:
   - Click the **Milling** icon from the Home Page, OR
   - Use **New Document** icon in the Menu Bar, OR
   - Right-click on the design part → select **Milling...** (combines steps 1 and 2)

### Step 2: Insert the Part
1. Drag and drop the design part from the project window into the CAM document
2. The **Creating the Part to Mill** window opens
3. Create a stock (raw material block)
4. Note: "In TopSolid7, it is not necessary to define a machine to insert a part" — the machine can be called when needed

### Step 3: Define the Machine (Optional at This Stage)
1. If needed, call a machine definition
2. The machine defines:
   - Axis limits (travel)
   - Angular limits for rotary axes
   - Tool mounting configuration
   - Cutting speed and feed rate capabilities
3. The part can be inserted directly into the machine table

### Step 4: Create Milling Operations
Two methods:

**Subject-Verb** (select entities first, then the operation):
1. Select one or more faces using the mouse
2. Select a milling function to apply

**Verb-Subject** (select operation first, then entities):
1. Select a milling function
2. Indicate which entities to machine

### Step 5: Configure Operation Settings
1. If required information is missing, TopSolid indicates this with an asterisk (*) and grays out the OK button
2. Configure settings via:
   - Icon bar
   - Label fields in the graphic area
3. Key settings:
   - Tool selection
   - Cutting parameters (speed, feed, depth of cut)
   - Stepover/stepdown
   - Lead-in/lead-out
   - WCS assignment

### Step 6: Validate and Auto-Simulate
1. When the milling is validated, a simulation is **automatically launched**
2. Material removal is shown (depending on the option selected in Operations Manager)
3. Use "+" and "-" keys to increase/decrease simulation speed
4. Review the toolpath for obvious issues

### Step 7: Full Verification
1. Right-click on the operation or part → **Verify**
2. Choose Turbo Mode (fast) or Animation Mode (detailed)
3. Wait for the verification calculation to complete
4. Right-click → **Comparison** to check against the design part
5. Review for gouging (red) or leftover material (green)

### Step 8: View ISO Code
1. Use the **ISO window** to view the generated G-code
2. If ISO code doesn't display, refer to Window Management in the help documentation
3. The ISO code can be reviewed before post-processing

### Step 9: Post-Process
1. Generate the final G-code for the specific machine
2. The post-processor translates TopSolid's internal toolpath to machine-specific G-code
3. Verify the post-processed code on the machine or in a separate simulator

## TopSolid'Cam Machining Capabilities

According to TopSolid's product page:

### 2D/2.5D Machining
- Facing, pocketing, contouring
- Slotting and grooving
- Broaching
- Automatic corner breaking
- BoostMilling: dynamic machining strategy
- Automatic analysis: finds all machinable shapes based on machine limitations

### 3D Milling
- Roughing, re-roughing, finishing, superfinishing
- Radius reworking
- Undercut stock management
- 20+ dedicated machining operations
- Hidden-time calculation and multithreading optimization
- Barrel and high-feed milling cutter management
- Tool life management

### 4/5-Axis Milling
- Multi-blade machining
- Simple and efficient programming
- Topological recognition
- Complete roughing and finishing operations

### Turning
- BoostTurning
- PrimeTurning
- Multi-spindle and multi-turret machine management
- Interpolation turning
- Eccentric turning
- Y-axis turning

### MillTurn and SwissTurn
- Optimized machining routines
- Multi-channel machine management

## Common Issues

### Issue: Simulation Shows Collision
- Check tool length and holder dimensions
- Verify the machine definition matches the actual machine
- Check that the WCS is correctly positioned
- Use machine simulation mode (not just programming mode) to detect machine collisions

### Issue: Verification Shows Gouging (Red Areas)
- Check the tool diameter — may be too large for the feature
- Reduce stepover
- Check that the toolpath stays within the intended area
- Review lead-in/lead-out movements

### Issue: Verification Shows Leftover Material (Green Areas)
- Add a finishing pass
- Reduce stepover or stepdown
- Check that all features are covered by operations
- Use a smaller tool for tight corners
