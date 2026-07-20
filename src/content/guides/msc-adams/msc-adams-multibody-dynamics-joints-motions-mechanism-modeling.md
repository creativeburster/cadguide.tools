---
title: "MSC Adams Multibody Dynamics: Building Mechanism Models with Joints and Motions"
excerpt: "Build multibody dynamics models in MSC Adams: create parts, define joints and constraints, apply motions and forces, run simulations, and analyze mechanism kinematics and dynamics."
category: "workflow"
softwareSlug: "msc-adams"
keyword: "msc adams multibody dynamics joints motion mechanism simulation"
slug: "msc-adams-multibody-dynamics-joints-motions-mechanism-modeling"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://simulatemore.mscsoftware.com/fundamentals-of-dynamic-analysis-msc-nastran/"
  - "https://www.mscsoftware.com/page/adams-tutorial-kit-mechanical-engineering-courses"
---

# MSC Adams Multibody Dynamics: Building Mechanism Models with Joints and Motions

MSC Adams is the industry-standard multibody dynamics simulation software. It lets you build virtual prototypes of mechanical systems — from four-bar linkages to full vehicle suspensions — and simulate their motion before building physical prototypes. I'll walk through the complete process of building and simulating a mechanism model.

## Adams Modeling Workflow

The standard workflow in Adams follows these steps:

1. **Create or import parts** — build geometry in Adams or import from CAD
2. **Define mass properties** — density, mass, center of mass, inertia
3. **Add constraints** — joints, couplers, contacts
4. **Apply motions** — driven joints or point motions
5. **Apply forces** — springs, dampers, applied forces, friction
6. **Set up measures** — what to measure during simulation
7. **Run the simulation** — dynamic, kinematic, or static
8. **Post-process results** — plots, animations, data export

## Creating Parts

### Building Geometry in Adams

Adams provides primitive geometry tools for creating parts:

1. **Rigid bodies** — parts with mass and inertia that don't deform
2. **Construction points** — reference points for positioning
3. **Geometry types**:
   - **Boxes** — rectangular blocks
   - **Cylinders** — solid or hollow
   - **Spheres** — solid balls
   - **Extrusions** — 2D profiles extruded along an axis
   - **Imported geometry** — STEP, IGES, or Parasolid files

### Importing CAD Geometry

For complex parts, import from CAD:

1. **File > Import** — select STEP, IGES, or Parasolid format
2. Adams converts the geometry to rigid bodies
3. Mass properties are calculated automatically from the geometry and material density
4. Verify the mass and inertia values — incorrect values lead to wrong dynamics

### Mass Properties

Each rigid body needs:
- **Mass** — in kg (SI) or slug (English)
- **Center of mass** — location relative to the part's reference frame
- **Inertia tensor** — Ixx, Iyy, Izz, Ixy, Ixz, Iyz

If you build geometry in Adams, these are calculated automatically. If you import from CAD, verify they match the CAD model's properties.

## Defining Constraints

Constraints define how parts connect and move relative to each other:

### Joints

The most common constraint types:

| Joint Type | DOF Removed | Description |
|---|---|---|
| Revolute | 5 | Rotation about one axis |
| Translational | 5 | Translation along one axis |
| Cylindrical | 4 | Rotation + translation along one axis |
| Spherical | 3 | Rotation about all three axes |
| Fixed | 6 | No relative motion |
| Universal | 4 | Rotation about two perpendicular axes |

To create a joint:
1. Select the joint type from the constraint palette
2. Select the two parts to connect
3. Define the joint location and axis direction
4. The joint appears as an icon between the parts

### Joint Initial Conditions

For joints with rotational freedom, you can set initial conditions:
- **Initial rotation angle** — starting position
- **Initial angular velocity** — starting speed

These are important for mechanisms that start in a non-equilibrium position.

### Couplers

Couplers define relationships between joint motions:
- **Gear coupler** — ratio between two revolute joints
- **Rack and pinion** — ratio between revolute and translational joints
- **Coupler** — general ratio between any two or three joints

## Applying Motions

Motions drive the mechanism:

### Joint Motion

Apply motion to a joint to drive it:

1. Select **Rotational Joint Motion** or **Translational Joint Motion**
2. Select the joint to drive
3. Define the motion function:
   - **Constant** — fixed speed (e.g., 30 rad/s)
   - **Function expression** — time-based function (e.g., `STEP(time, 0, 0, 1, 30)`)
   - **Spline** — data points interpolated by AKISPL function

### Point Motion

Drive a point on a part along a defined trajectory:
1. Select **General Point Motion**
2. Select the part and reference frame
3. Define X, Y, Z motion components

### Motion Functions

Adams supports several built-in functions:

- **STEP(time, x0, h0, x1, h1)** — smooth step from h0 to h1 between x0 and x1
- **SIN(time)** — sinusoidal motion
- **IF(condition, expr1, expr2, expr3)** — conditional expression
- **AKISPL(time, 0, spline_name)** — Akima spline interpolation

## Applying Forces

### Spring-Dampers

1. Select **Spring-Damper** from the force palette
2. Select two points on different parts
3. Set:
   - **Stiffness (K)** — spring rate in N/m
   - **Preload** — initial force
   - **Damping (C)** — damping coefficient in N·s/m

### Applied Forces

1. Select **Force** (single-component) or **Force Vector** (three-component)
2. Select the part to apply the force to
3. Define the force magnitude and direction
4. Force can be constant or function-based

### Contact Forces

Adams can automatically compute contact between geometry:

1. Select **Contact** from the force palette
2. Select the two geometric entities (curves, spheres, or solids)
3. Set contact parameters:
   - **Stiffness** — contact stiffness
   - **Force exponent** — nonlinearity of contact
   - **Damping** — energy dissipation during contact
   - **Penetration depth** — maximum penetration before damping applies

## Running the Simulation

1. Go to **Simulation > Run**
2. Set:
   - **End time** — total simulation duration
   **Number of steps** — output resolution (more steps = smoother animation)
3. Click **Run**
4. The simulation solves the equations of motion and stores results

### Simulation Types

- **Dynamic** — full dynamics including inertia, forces, and constraints
- **Kinematic** — motion only, no forces (for pure mechanism analysis)
- **Static** — equilibrium analysis (find the rest position)
- **Linear** — linearize around an operating point for vibration analysis

## Post-Processing Results

### Animation

After simulation, play the animation to visualize the mechanism motion:
- **Play, pause, step** controls
- **Speed control** — slow motion for detailed analysis
- **Trace** — show the path of a point during motion

### Plots

Create plots of measured quantities:
- **Displacement** — position vs. time
- **Velocity** — speed vs. time
- **Acceleration** — acceleration vs. time
- **Force** — joint reaction forces vs. time
- **Torque** — joint torques vs. time

Use the Plot Builder to create custom plots with multiple traces.

## Common Issues

### Mechanism Doesn't Move

- Check that a motion is applied to a driven joint
- Verify the joint isn't over-constrained (too many constraints remove all DOF)
- Check for conflicting initial conditions

### Simulation Fails to Converge

- Reduce the simulation time step
- Check for singular configurations (e.g., a slider-crank at dead center)
- Add small damping to remove numerical oscillations
- Verify mass properties are reasonable (not zero or extremely large)

### Results Don't Match Hand Calculations

- Verify mass properties, joint locations, and force directions
- Check units (SI vs. English)
- Ensure the simulation ran long enough to reach steady state
- Compare with a simplified version of the model first

## Best Practices

- **Start simple** — build a basic version of the mechanism and verify it works before adding complexity
- **Check degrees of freedom** — use the DOF checker to verify the mechanism has the expected mobility
- **Use meaningful names** — name parts, joints, and motions clearly for debugging
- **Add measures early** — set up measurements before running the simulation
- **Validate with hand calculations** — for simple mechanisms, verify key results match analytical solutions
- **Use the tutorial examples** — Adams includes many tutorial examples (four-bar linkage, crank-slider, suspension) that teach fundamental concepts
