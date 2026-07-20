---
title: "Altair Inspire Motion Analysis: Mechanism Simulation Setup Guide"
excerpt: "Step-by-step guide to setting up motion analysis in Altair Inspire — grounding parts, creating joints, adding motors and springs, and plotting results — based on Altair's official motion tutorials."
category: "workflow"
softwareSlug: "altair-inspire"
keyword: "altair inspire motion analysis mechanism simulation setup"
slug: "altair-inspire-motion-analysis-mechanism-simulation"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://2025.help.altair.com/2025/inspire/en_us/topics/inspire/tutorials/tut_GS_motion_overview_c.htm"
  - "https://help.altair.com/inspire/en_us/topics/inspire/tutorials/tut_GS_motion_analyst_overview_c.htm"
  - "https://help.altair.com/inspire/en_us/topics/inspire/tutorials/tut_joints_motors_plotting_c.htm"
---

# Altair Inspire Motion Analysis: Mechanism Simulation Setup Guide

Altair Inspire includes a motion analysis module powered by Altair MotionSolve that enables multi-body dynamics simulation. This guide documents the setup workflow based on Altair's official "Getting Started with Motion" and "Getting Started with Motion Analyst" tutorials.

## Motion vs. Motion Analyst Profiles

Inspire offers two motion profiles:

- **Motion (Beginner)**: Basic multi-body dynamics — joints, motors, springs, gravity, contact
- **Motion Analyst (Advanced)**: Everything in Motion plus flexible bodies, redundant constraint resolution, and stress analysis during motion

Switch profiles via the dropdown under **Profile** in the ribbon.

## Step 1: Open the CAD Model

1. **File → Open** and select the assembly model
2. Press **F2** to open the Model Browser
3. Verify display units: **File → Preferences** → check units are correct (MKS or IPS)
4. For Motion Analyst: **File → Preferences → Inspire Motion → Run Options** → set solver units to match

## Step 2: Ground a Part

Grounding fixes a part so it doesn't move during the simulation (e.g., the frame or base).

1. Select the **Ground** tool from the Connections category
2. Click the part to ground (e.g., the mounting base)
3. The grounded part displays a ground symbol

## Step 3: Create a Rigid Group

A rigid group connects parts that move together as a single rigid body.

1. Select the **Rigid Group** tool from the Connections category
2. Select the parts to include in the rigid group
3. Parts in a rigid group share the same motion — they don't move relative to each other

## Step 4: Connect Parts with Joints

Joints define how parts can move relative to each other.

1. Select the **Joints** tool
2. Click the two parts to connect
3. Inspire automatically detects the appropriate joint type based on the geometry
4. Common joint types:
   - **Revolute (Pin)**: Rotational movement only (e.g., hinge)
   - **Translational (Slider)**: Linear movement only (e.g., piston)
   - **Cylindrical**: Both rotation and translation along an axis
   - **Spherical (Ball)**: Rotation in all directions
   - **Fixed**: No movement (rigid connection)

5. To modify a joint's state: select the joint and change its properties in the microdialog

## Step 5: Inspect Gravity Direction

1. Select the **Gravity** tool
2. By default, gravitational acceleration is **9.80665 m/s²** in the **-z direction**
3. Verify the direction makes sense for your mechanism
4. Adjust if needed

## Step 6: Run a Quick Motion Analysis (Before Adding Motors)

1. Click the **Quick Run** button on the Analyze Motion tool
2. This runs the analysis with only gravity and joints — no motors yet
3. Observe the behavior: grounded parts stay fixed, other parts move under gravity
4. This validates that joints and grounding are set up correctly before adding driving forces

## Step 7: Add a Motor

1. Select the **Motors** tool
2. Select the joint to drive (e.g., the revolute joint on a crank)
3. In the microdialog:
   - **Speed**: 60 rpm (default)
   - **Type**: Speed (constant velocity) or Angle (position control)
4. Click **Accept** to create the motor

### Motor Types
- **Speed motor**: Maintains a constant rotational speed (e.g., 60 rpm)
- **Angle motor**: Controls the angular position (e.g., rotate 5 degrees)
- **Motion motor** (Motion Analyst): Define motion on a joint with velocity, position, or acceleration profiles

### Modifying Motors via Table
1. Right-click on a motor → **Edit**
2. The Motors Table shows all motors in the model
3. Modify speed, type, or lock/unlock individual motors
4. Locking an angle motor fixes the position at its current angle

## Step 8: Add a Spring-Damper Force

1. Select the **Coil Spring** tool
2. Click the two connection points on different parts
3. In the microdialog:
   - **K (stiffness)**: 2500 N/m (example from tutorial)
   - **C (damping)**: 1 N·s/m
   - **Force and Length**: Leave as defaults (auto-calculated)

## Step 9: Configure Run Settings

1. Hover over the **Analyze Motion** tool, then click the **Run Settings** icon
2. Key settings:
   - **Duration**: 2 seconds (or appropriate for your mechanism)
   - **Output Rate**: 100 (number of output frames)
   - **Gravity**: Verify "Yes" is selected
3. Click **Apply**

## Step 10: Run the Motion Analysis

1. Click the **Quick Run** button on the Analyze Motion tool
2. The mechanism animates in the modeling window
3. If a **Redundant Constraint** message appears, click **Continue** (common in over-constrained mechanisms)

## Step 11: Review Results

### Basic Results (Motion Profile)
1. Click the **Motion Results** tool
2. Select components to view plots:
   - **Coil Spring**: Shows spring force over time
   - **Motor**: Shows motor output (torque, speed) over time
   - **Joint/Pin**: Shows forces at the joint
3. Right-click on a plot to change what's displayed (e.g., Speed: Desired vs. Actual)

### Flexible Body Stress (Motion Analyst Profile)
1. Select the **Review Flexible Body Results** tool
2. The Analysis Explorer displays stress results
3. Drag the animation slider to see stress change during mechanism movement
4. This shows where and when peak stresses occur during the motion cycle

## Step 12: Creating Flexible Bodies (Motion Analyst)

Flexible bodies replace rigid bodies to enable stress analysis during motion and resolve redundant constraints:

1. Select a part to make flexible (e.g., one link in a four-bar mechanism)
2. The part is converted from rigid to flexible
3. Re-run the motion analysis
4. The flexible body deforms under load, and stress results are available

According to Altair's tutorial: "One preferred way to remove redundant constraints from the model is to use flexible bodies in place of rigid bodies. In a four bar example, we only need to replace one of the links to break the redundancies in the system."

## Common Issues

### Redundant Constraint Warning
This means the mechanism is over-constrained — too many joints restrict the same degree of freedom. Fixes:
1. Click **Continue** to let the solver resolve it automatically
2. Replace one rigid link with a flexible body (Motion Analyst)
3. Remove unnecessary joints
4. Change a rigid joint to a compliant one

### Motor Can't Maintain Speed
If the motor's actual speed doesn't match the desired speed:
1. The motor may be fighting against too much resistance
2. Increase the motor's maximum torque
3. Reduce the load or speed requirement
4. Check for jammed joints or incorrect grounding

### Mechanism Doesn't Move
1. Check that parts aren't accidentally grounded
2. Verify joints allow the intended movement direction
3. Ensure the motor is active (not locked)
4. Check gravity direction is correct
