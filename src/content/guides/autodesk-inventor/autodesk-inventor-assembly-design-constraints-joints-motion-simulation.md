---
title: "Autodesk Inventor Assembly Design: Constraints, Joints, and Motion Simulation"
excerpt: "Inventor's assembly tools combine parts into functional mechanisms with constraints and joints. We cover assembly constraints, joint types, motion simulation, interference detection, and exploded views for documentation."
category: "workflow"
softwareSlug: "autodesk-inventor"
keyword: "Autodesk Inventor assembly design constraints joints motion simulation interference detection exploded views"
slug: "autodesk-inventor-assembly-design-constraints-joints-motion-simulation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://help.autodesk.com/view/INVNTOR/2025/ENU/"
  - "https://www.autodesk.com/products/inventor/overview"
  - "https://help.autodesk.com/cloudhelp/2024/ENU/Inventor-Help/files/GUID-2DFEAF48-DCBF-4781-9AC7-76D91DC2D896.htm"
---

# Autodesk Inventor Assembly Design: Constraints, Joints, and Motion Simulation

We've built complex assemblies in Inventor ranging from 10-part mechanisms to 1000+ part machines. Assembly design is where individual parts come together as a functional product. Inventor's constraint and joint system determines how parts relate to each other, and the motion simulation tools let you verify that the mechanism works before manufacturing.

## Assembly Overview

An Inventor assembly (.iam) file contains:
- **Components**: Parts and subassemblies placed in the assembly
- **Constraints**: Geometric relationships that position components
- **Joints**: Mechanical connections that define motion
- **Patterned components**: Repeated components (bolts, fasteners)
- **Work features**: Work planes, axes, and points for references

## Creating an Assembly

### Starting a New Assembly

1. File → New → **Assembly** (.iam)
2. The first component placed is typically the **base** or **fixed** component
3. Place components:
   - Click **Place** (P key)
   - Select a part file (.ipt)
   - Click to place it in the assembly
   - Place multiple instances as needed
4. Each placed component appears in the browser

### Grounding Components

1. The first component is automatically grounded (fixed in space)
2. To ground another component:
   - Right-click in the browser → **Grounded**
   - A grounded component cannot move
3. Typically the main frame or housing is grounded
4. Only one component should be grounded per assembly (or per subassembly)

## Assembly Constraints

### Constraint Types

**Mate (Insert)**:
- Constrains two circular edges to be concentric and coplanar
- Used for bolts in holes, shafts in bearings, pins in holes
- Aligns the axes and the planar faces

**Mate (Surface)**:
- Makes two planar faces coplanar and facing each other
- Used for parts that sit flush against each other

**Angle**:
- Defines the angle between two faces or edges
- Used for parts at specific angles to each other

**Tangent**:
- Constrains a curved surface to be tangent to a plane
- Used for rollers on flat surfaces, cams on followers

**Symmetry**:
- Makes two components symmetric about a plane
- Used for left/right parts

### Applying Constraints

1. Click **Constrain** (C key)
2. Select the constraint type (Mate, Angle, Tangent, Insert, Symmetry)
3. Select the first face/edge/point on Component 1
4. Select the corresponding face/edge/point on Component 2
5. Set the offset (distance between the faces)
6. Set the direction (Aligned or Opposed)
7. Click **Apply** to add the constraint and continue, or **OK** to finish

### Constraint Status

- **Fully constrained**: All 6 degrees of freedom are removed — the component cannot move
- **Under-constrained**: Some degrees of freedom remain — the component can slide or rotate
- **Over-constrained**: Conflicting constraints — Inventor will warn you

Check degrees of freedom:
- Click a component in the browser
- The bottom status bar shows remaining DOF
- Or use **Degrees of Freedom Analysis** tool

### Best Practice: Constraint Order

1. **Ground the base component**
2. **Mate the primary mating faces** (the main contact surface)
3. **Add alignment constraints** (align holes, edges, or axes)
4. **Add any angular or offset constraints**
5. **Check DOF** — the component should be fully constrained (unless it's meant to move)

## Joints

Joints are a newer, more intuitive way to define mechanical connections. They combine multiple constraints into a single definition.

### Joint Types

- **Rigid**: Locks all 6 DOF — components are fixed together
- **Rotational**: Allows rotation about one axis (like a hinge)
- **Slider**: Allows translation along one axis (like a drawer slide)
- **Cylindrical**: Allows rotation and translation along one axis (like a piston)
- **Planar**: Allows translation in a plane and rotation about the perpendicular axis
- **Ball**: Allows rotation in all directions about a point (like a ball joint)
- **Weld**: Fuses two components together at a point

### Creating Joints

1. Click **Joint** (J key)
2. Select the joint type
3. Select the first component's geometry (face, edge, or point)
4. Select the second component's geometry
5. The joint is previewed
6. Adjust the joint axis or origin if needed
7. Click **OK**

### Joint vs Constraint

- **Constraints**: Define geometric relationships (face-to-face, axis-to-axis)
- **Joints**: Define mechanical motion (rotational, slider, ball)
- Joints are more intuitive for mechanical design
- Constraints are more flexible for general positioning
- You can use both in the same assembly

## Motion Simulation

### Basic Motion (Drive Constraint)

1. Right-click a constraint that allows motion (e.g., an angle constraint)
2. Click **Drive Constraint**
3. Set the start and end values
4. Set the number of steps
5. Click **Play** to animate the motion
6. The component moves according to the constraint

### Joint Motion

1. Right-click a joint (e.g., Rotational)
2. Click **Drive Joints**
3. Set the motion range
4. Play the animation
5. The mechanism moves according to the joint definition

### Contact Detection

1. Go to **Inspect** tab → **Contact**
2. Enable contact detection
3. Select the components that should detect contact
4. During motion simulation, Inventor stops components when they touch
5. This verifies that parts don't interfere during motion

### Dynamic Simulation

For more advanced motion analysis:
1. Go to **Environment** tab → **Dynamic Simulation**
2. Define joints with friction, damping, and stiffness
3. Apply forces, torques, and gravity
4. Run the simulation
5. Analyze:
   - **Positions**: Track the trajectory of any point
   - **Velocities**: Speed of components over time
   - **Accelerations**: Acceleration of components
   - **Forces**: Joint forces and reaction forces
6. Export results to a graph or spreadsheet

## Interference Detection

### Running Interference Analysis

1. Go to **Inspect** tab → **Interference Analysis**
2. Select the components to check:
   - **Two sets**: Check Set 1 against Set 2
   - **All components**: Check everything against everything
3. Click **OK**
4. Inventor reports:
   - **Interfering pairs**: Which components interfere
   - **Interference volume**: The volume of the interference
   - **Visual highlight**: Interference is shown in red
5. Fix interferences by adjusting component positions or geometry

### Best Practice for Interference Checks

- Run interference analysis after major assembly changes
- Check subassemblies before combining into the main assembly
- Use contact detection during motion to catch dynamic interferences
- Document and track interferences for resolution

## Exploded Views

### Creating an Exploded View

1. Go to **Presentation** environment (or use the Exploded View tool)
2. Select components to move
3. Drag them along a direction (face normal, edge, or axis)
4. Set the distance for each component
5. Build the explosion step by step
6. Adjust positions for clarity

### Trail Lines

1. In the Presentation environment, enable **Trail Lines**
2. Trail lines show the path from the assembled position to the exploded position
3. These help viewers understand how components fit together
4. Style options:
   - **Solid line**: Clear path
   - **Dashed line**: Less prominent

### Publishing Exploded Views

1. From the Presentation file, publish to:
   - **Drawing**: Create an isometric view of the exploded assembly
   - **Image**: Export as a raster image
   - **Animation**: Create a video of the assembly/disassembly sequence
2. Add balloons and a parts list to the drawing

## Assembly Patterns

### Component Pattern

1. Click **Pattern Component**
2. Select the component(s) to pattern
3. Choose pattern type:
   - **Rectangular**: Rows and columns
   - **Circular**: Around an axis
   - **Associative**: Follow an existing feature pattern
4. Set count and spacing
5. Click **OK**

### Associative Patterns

- If a part has a hole pattern, the associative pattern places fasteners in every hole
- When the hole pattern changes, the component pattern updates automatically
- This is the best way to place bolts in patterned holes

## Assembly Best Practices

### Structure

1. **Subassemblies**: Group related parts into subassemblies
   - A gearbox is a subassembly within the machine assembly
   - Subassemblies can be reused across projects
2. **Logical naming**: Name components descriptively (e.g., "Drive Shaft", "Bearing Housing")
3. **Folder organization**: Use browser folders to group components by function

### Performance

1. **Suppress unused components**: For large assemblies, suppress components not needed for the current task
2. **Use simplified representations**: Replace complex parts with simplified versions for large assemblies
3. **Enable LOD (Level of Detail)**: Create LOD representations with suppressed components
4. **Shrinkwrap subassemblies**: Convert subassemblies to single parts for performance

## Common Issues

### Components Won't Constrain

- Check that the selected geometry is correct (face vs edge vs point)
- Verify the constraint type matches the geometry
- Look for conflicting constraints that prevent the new one
- Try a different constraint type

### Assembly Is Sluggish

- Suppress unnecessary components
- Use LOD representations
- Simplify complex parts
- Check for circular references in constraints
- Enable "Deferred Update" while making multiple changes

### Motion Doesn't Work as Expected

- Check that the correct joint or constraint is driving the motion
- Verify there are no conflicting constraints preventing motion
- Use contact detection to check for physical interference
- Check the joint axis or direction

### Interference After Motion

- Run interference analysis at multiple positions during the motion
- Use contact detection to stop motion at the point of contact
- Adjust component geometry or positions to eliminate the interference

## Summary

Inventor's assembly tools combine parts into functional mechanisms. Place components, ground the base, and apply constraints (Mate, Angle, Tangent, Insert) or joints (Rotational, Slider, Cylindrical, Ball) to position and connect components. Check degrees of freedom to verify constraint status. Use Drive Constraint or Drive Joints to simulate motion and verify the mechanism works. Run interference analysis to detect overlapping components. Create exploded views in the Presentation environment with trail lines for documentation. Use component patterns (especially associative patterns) to place fasteners in patterned holes. Structure assemblies with subassemblies and LOD representations for performance. The most common issues — constraint failures, sluggish performance, and motion problems — are addressed by checking geometry selection, suppressing components, and verifying joint definitions.
