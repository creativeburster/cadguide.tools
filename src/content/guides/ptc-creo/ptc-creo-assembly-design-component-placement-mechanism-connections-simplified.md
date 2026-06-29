---
title: "PTC Creo Assembly Design: Component Placement, Mechanism Connections, and Simplified Representations"
excerpt: "Creo's assembly tools combine parts with placement constraints and mechanism connections for motion analysis. I cover component placement, constraint types, mechanism connections, simplified representations for large assemblies, and interference checking."
category: "workflow"
softwareSlug: "ptc-creo"
keyword: "PTC Creo assembly design component placement mechanism connections simplified representations interference checking"
slug: "ptc-creo-assembly-design-component-placement-mechanism-connections-simplified"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.ptc.com/en/products/creo/parametric"
  - "https://support.ptc.com/help/creo/creo_pma/r10.0/usascii/index.html"
  - "https://www.ptc.com/en/products/creo/simulation"
---

# PTC Creo Assembly Design: Component Placement, Mechanism Connections, and Simplified Representations

I've managed large Creo assemblies for aerospace and automotive projects with thousands of components. Creo's assembly tools are among the most capable in the industry — particularly its simplified representations and mechanism design capabilities. Understanding component placement, connection types, and large assembly management is essential for any engineering team using Creo for complex products.

## Assembly Overview

A Creo assembly (.asm) contains:
- **Components**: Parts and subassemblies
- **Placement constraints**: Geometric relationships positioning components
- **Mechanism connections**: Joint definitions for motion
- **Simplified representations**: Subsets of the assembly for performance
- **Assembly features**: Features created at the assembly level (holes, cuts)
- **Skeleton models**: Reference geometry for top-down design

## Creating an Assembly

### Starting a New Assembly

1. File → New → **Assembly** (.asm)
2. Use a template (e.g., inlbs_asm_design or mmns_asm_design)
3. The assembly opens with three datum planes and a coordinate system
4. The first component placed is typically the base component

### Placing Components

1. Click **Assemble** (Model tab)
2. Select a part file (.prt) or subassembly (.asm)
3. The component appears in a floating state
4. The **Component Placement** dashboard opens
5. Define placement constraints (see below)
6. Click **OK** (green checkmark) when the component is fully constrained

## Placement Constraints

### Constraint Types

**Coincident**:
- Makes two planar faces coincident (touching)
- Or makes two axes coincident (aligned)
- Most commonly used constraint

**Distance**:
- Two faces are parallel at a specified distance
- Distance of 0 = coincident

**Angle Offset**:
- Two faces at a specified angle
- Angle of 0 = parallel aligned

**Parallel**:
- Two faces are parallel (no distance specified)

**Normal**:
- Two faces are perpendicular

**Coaxial**:
- Two axes are aligned (same as coincident for axes)

**Center**:
- Two cylindrical surfaces are aligned by their axes
- Used for shafts in holes, pins in bushings

**Tangent**:
- Two surfaces are tangent
- Used for cams, rollers

**Fix**:
- Component is fully locked in its current position
- All 6 DOF removed

**Default**:
- Component is placed at the default origin alignment
- Aligns the component's coordinate system with the assembly's

### Placement Workflow

1. Select a constraint type
2. Select a reference on the component
3. Select a corresponding reference on the assembly (or another component)
4. The component moves to satisfy the constraint
5. Add more constraints until fully constrained
6. Typical constraint sets:
   - **Shaft in hole**: Coaxial (axis-to-axis) + Coincident (face-to-face) + Orientation (align a plane)
   - **Bolt on flange**: Coaxial (bolt axis to hole axis) + Coincident (bolt head to flange face)
   - **Bracket on plate**: Coincident (bottom face to plate) + Two Distance/Offset constraints for position

### Constraint Status

- **Fully constrained**: All 6 DOF removed — green checkmark enabled
- **Partially constrained**: Some DOF remain — component can move
- **Inconsistent**: Conflicting constraints — warning shown
- **Package**: Unconstrained component (placed but not constrained)

### Allow Assumptions

- When checked, Creo assumes remaining DOF based on current constraints
- A component can be "fully constrained with assumptions" without all 6 DOF explicitly removed
- Useful for quick placement but less robust than full constraint definition
- Uncheck for strict constraint definition

## Mechanism Connections

For assemblies with moving parts, use mechanism connections instead of (or in addition to) placement constraints:

### Connection Types

- **Rigid**: Locks all DOF (same as Fix)
- **Pin**: Allows rotation about one axis (1 rotational DOF)
- **Slider**: Allows translation along one axis (1 translational DOF)
- **Cylinder**: Allows rotation and translation along one axis (2 DOF)
- **Planar**: Allows translation in a plane and rotation about the perpendicular axis (3 DOF)
- **Ball**: Allows rotation in all directions about a point (3 rotational DOF)
- **Weld**: Fuses two components at a point (0 DOF)
- **Bearing**: Allows rotation about an axis and translation along the same axis (like a bearing)
- **General**: Custom DOF definition
- **6DOF**: Free movement in all directions (6 DOF)

### Creating Connections

1. Click **Assemble**
2. Select the component
3. In the placement dashboard, change from "Automatic" to a connection type (e.g., Pin)
4. Select the axis for the connection (component axis and assembly axis)
5. Select a planar reference for axial position
6. The connection is defined
7. Click **OK**

### Mechanism Design

1. Go to **Applications** tab → **Mechanism**
2. The mechanism environment opens
3. Define:
   - **Servo motors**: Drive a joint with a specified motion
   - **Force motors**: Apply forces to joints
   - **Springs**: Add spring forces
   - **Dampers**: Add damping
   - **Gravity**: Apply gravitational force
4. Run a **position analysis** to simulate motion
5. Play back the animation
6. Check for collisions and interferences during motion

### Mechanism Analysis Types

- **Position**: Simulate the motion over time
- **Velocity**: Analyze velocities of components
- **Acceleration**: Analyze accelerations
- **Force balance**: Calculate forces at joints
- **Static**: Find equilibrium positions

## Simplified Representations

Simplified representations (rep) are essential for large assemblies — they let you work with a subset of the assembly for better performance.

### Creating a Simplified Representation

1. Go to **View** tab → **Representations** → **Create Simplified Rep**
2. Name the representation
3. Set the default state for all components:
   - **Master**: Full geometry (default)
   - **Exclude**: Component not loaded
   - **Geometry**: Only surface geometry (no solid)
   - **Graphics**: Lightweight graphics only
   - **Symbol**: Symbolic representation
4. Override individual components:
   - Select a component and set its state
   - Example: Exclude all fasteners, use geometry rep for large housings
5. Save the representation

### Using Simplified Representations

1. Go to **View** tab → **Representations** → **Set Rep**
2. Select a representation from the list
3. The assembly updates to show only the specified components
4. Performance improves significantly for large assemblies
5. Switch back to **Master Rep** when full geometry is needed

### Envelope Parts

1. Create a simplified part that represents the external shape of a complex subassembly
2. Use the envelope part in the main assembly instead of the full subassembly
3. The envelope part is much lighter and faster to load
4. Switch to the full subassembly when detail is needed

### Performance Benefits

| Representation | Load Time | Memory | Use Case |
|---------------|-----------|--------|----------|
| Master | 100% | 100% | Full design work |
| Geometry | 50-70% | 30-50% | Visual reference |
| Graphics | 20-30% | 10-20% | Layout and clearance |
| Symbol | 5-10% | 5-10% | Overview only |
| Exclude | 0% | 0% | Not needed |

## Interference Checking

### Static Interference

1. Go to **Analysis** tab → **Interference**
2. Set the analysis type:
   - **Global Interference**: Check all components against each other
   - **Pairs**: Check two selected components
3. Click **Compute**
4. Creo reports:
   - Interfering pairs
   - Interference volume
   - Visual highlight (red) of interfering areas
5. Fix interferences by adjusting component positions or geometry

### Dynamic Interference (Mechanism)

1. In the Mechanism environment
2. Go to **Analysis** tab → **Global Interference**
3. Run the mechanism analysis
4. Creo checks for interference at each time step
5. Reports any collisions during the motion cycle

## Top-Down Design with Skeleton Models

### Creating a Skeleton Model

1. In the assembly, click **Create** (Model tab)
2. Select **Skeleton Model**
3. The skeleton model is a special part that contains only reference geometry
4. In the skeleton:
   - Create datum planes, axes, and points
   - Sketch layout curves representing component locations
   - Define key dimensions and parameters
5. The skeleton defines the assembly architecture

### Using the Skeleton for Design

1. Each component references the skeleton
2. When the skeleton changes, all components update
3. Benefits:
   - Design intent is captured in the skeleton
   - Multiple designers can work on different components simultaneously
   - Changes to the layout propagate to all components
4. This is the recommended approach for large, complex assemblies

## Assembly Features

### Creating Assembly-Level Features

1. In the assembly, click **Extrude** or **Hole**
2. The feature is created at the assembly level (not in a part)
3. Use cases:
   - **Match drilling**: Holes drilled through multiple parts after assembly
   - **Assembly cutouts**: Cutouts that span multiple parts
   - **Weld preparations**: Grooves for welding
4. Assembly features appear in the assembly model tree

## Common Issues

### Component Won't Fully Constrain

- Check that all 6 DOF are addressed
- Verify the constraint references are correct
- Look for conflicting constraints
- Try unchecking "Allow Assumptions" for strict constraint definition

### Assembly Is Very Slow

- Use simplified representations to exclude unnecessary components
- Use geometry or graphics reps for non-critical components
- Suppress cosmetic features (fillets, chamfers)
- Use envelope parts for complex subassemblies
- Consider splitting the assembly into subassemblies

### Mechanism Motion Doesn't Work

- Check that the correct connection type is defined
- Verify there are no conflicting constraints preventing motion
- Check the servo motor definition
- Run a position analysis to diagnose the issue

### Interference After Motion

- Run dynamic interference check during mechanism analysis
- Adjust component geometry or positions
- Add motion limits to joints
- Use collision detection to stop motion at contact

## Summary

Creo's assembly tools combine components with placement constraints and mechanism connections. Place components using constraint types (Coincident, Distance, Angle, Coaxial, Center) until fully constrained. For moving assemblies, use mechanism connections (Pin, Slider, Cylinder, Ball) and the Mechanism environment for motion analysis. Create simplified representations to manage large assemblies efficiently — exclude, geometry, graphics, and symbol reps reduce load time and memory. Use skeleton models for top-down design — the skeleton defines the assembly architecture, and all components reference it. Run interference checks (static and dynamic) to verify no components overlap. The most common issues — constraint failures, slow performance, and motion problems — are addressed by checking DOF, using simplified representations, and verifying connection definitions. Creo's assembly tools are particularly strong for large, complex products with thousands of components.
