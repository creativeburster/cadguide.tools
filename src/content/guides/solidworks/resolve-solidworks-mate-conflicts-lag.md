---
title: "Resolving Mate Conflicts and Rebuild Lag in SolidWorks Assemblies"
excerpt: "Systematic approach to diagnosing and fixing conflicting mates, over-defined constraints, and rebuild performance issues caused by circular mate dependencies."
category: "troubleshooting"
softwareSlug: "solidworks"
keyword: "solidworks mate conflict"
slug: "resolve-solidworks-mate-conflicts-lag"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-25"
sources:
  - "https://help.solidworks.com/2019/english/SolidWorks/sldworks/t_techniques_fixing_mate_problems.htm"
  - "https://help.solidworks.com/2024/English/SolidWorks/sldworks/c_mate_error_examples.htm"
---

# Resolving Mate Conflicts and Rebuild Lag in SolidWorks Assemblies

Mate conflicts in SolidWorks are the kind of problem that sneaks up on you. Everything is working fine, then you add one more mate and suddenly the assembly won't rebuild, components are jumping to random positions, and the feature tree is lit up with red and yellow warnings. We've spent way too much of our career untangling mate conflicts — both our own and other people's. Here's the systematic approach we use to diagnose and fix them without making things worse.

## Understanding Mate Status Indicators

SolidWorks uses color-coded icons to indicate mate health:

- **Green**: The mate is satisfied and the component is fully constrained.
- **Yellow**: The mate is satisfied but over-defined — the component has more constraints than degrees of freedom. The assembly still rebuilds, but the redundancy may cause future conflicts.
- **Red**: The mate is unsatisfied — the constraint cannot be met with the current geometry. The assembly fails to rebuild correctly.

## Step 1: Run Mate Diagnostics

SolidWorks provides a built-in diagnostic tool for identifying mate problems:

1. Go to Tools > Evaluate > Mate Diagnostics.
2. The Mate Diagnostics panel opens, displaying:
   - **Conflicting mates**: Pairs of mates that contradict each other
   - **Redundant mates**: Mates that over-constrain a component without adding new information
   - **Unsatisfied mates**: Mates that cannot be solved with the current geometry

3. Click each entry to highlight the affected mates and components in the graphics area.

## Step 2: Identify the Conflict Source

When the Mate Diagnostics tool identifies a conflict, it lists the mates involved but does not always explain why they conflict. You need to analyze the degrees of freedom manually.

### Degrees of Freedom Analysis

Each component in an assembly has 6 degrees of freedom: 3 translational (X, Y, Z) and 3 rotational (Rx, Ry, Rz). Each mate consumes specific degrees of freedom:

| Mate Type | DOF Consumed |
|---|---|
| Coincident (face-face) | 1 translation + 2 rotation |
| Concentric (cylindrical) | 2 translation + 2 rotation |
| Distance | 1 translation |
| Angle | 1 rotation |
| Width | 2 translation + 2 rotation |
| Symmetric | 1 translation + 1 rotation |
| Lock | All 6 |

A component is fully constrained when all 6 degrees of freedom are consumed. Adding more mates beyond this point creates over-definition.

### Example Conflict

A bolt inserted into a hole with a Concentric mate (consumes 4 DOF) and a Coincident mate between the bolt head and the plate surface (consumes 3 DOF) is already fully constrained with 1 DOF to spare (rotation around the bolt axis). Adding a third mate — such as an Angle mate to fix the bolt's rotation — would consume the remaining DOF, which is fine. But adding a second Coincident mate between the bolt head and a different surface would conflict with the first Coincident mate, because the two surfaces are not coplanar.

## Step 3: Fix Over-Defined Mates

### Suppress Redundant Mates

The safest approach is to suppress mates that are identified as redundant:

1. Right-click the over-defined mate in the feature tree.
2. Select "Suppress."
3. Rebuild the assembly (`Ctrl + B`).
4. Check if the conflict is resolved.

If suppressing one mate resolves the conflict, that mate was redundant. You can delete it permanently or keep it suppressed as a reference.

### Use the MateXpert

For complex conflicts involving multiple mates, use the MateXpert:

1. Click the red mate error icon in the feature tree.
2. Select "MateXpert" from the popup menu.
3. The MateXpert dialog displays:
   - The conflicting mate pairs
   - Which mate should be suppressed or modified
   - A suggested resolution

4. Follow the suggested resolution, then click "Rebuild" to verify.

## Step 4: Fix Unsatisfied Mates

Unsatisfied mates (red) occur when the geometry referenced by the mate has changed. For example, if a Concentric mate references a cylindrical hole that was later changed to a square cutout, the mate can no longer be satisfied.

### Re-reference the Mate

1. Right-click the unsatisfied mate.
2. Select "Edit Feature."
3. In the Mate PropertyManager, the invalid reference will be highlighted in red.
4. Click the red reference to remove it.
5. Select the new correct face/edge in the graphics area.
6. Click the checkmark to apply.

### Delete and Recreate

If the mate type is no longer appropriate (e.g., the geometry changed from cylindrical to flat), delete the mate and create a new one with the correct type:

1. Right-click the mate > Delete.
2. Use the Mate tool to create a new mate with the appropriate type for the current geometry.

## Step 5: Resolve Circular Dependencies

Circular dependencies occur when Component A is mated to Component B, and Component B is mated back to Component A through a different path. The solver cannot determine which component's position is the "source of truth."

### Identify Circular Dependencies

1. Go to Tools > Evaluate > Assembly Visualization.
2. Add the "In-Context References" column.
3. Sort by this column to see which components have references to each other.

Alternatively, use the Display Dependencies tool:

1. Right-click a component > "Display External References."
2. Review the list of references. If Component A references Component B, and Component B references Component A (directly or through intermediate components), you have a circular dependency.

### Break the Cycle

To break a circular dependency:

1. Identify the "weakest" mate in the cycle — the one that is least critical to the assembly's function.
2. Replace it with a mate to a fixed component (a component anchored with a Fix mate or to the assembly origin).
3. Rebuild and verify the cycle is broken.

### Use Fixed Components

Anchor one or more key components with a Fix mate:

1. Right-click the component > "Fix."
2. The component is now locked in place and serves as a stable reference for all other mates.

This is particularly important for the base frame or main housing of an assembly. All other components should be mated relative to the fixed component, not relative to each other.

## Step 6: Optimize Mate Order for Rebuild Performance

The order in which mates appear in the feature tree affects rebuild time. SolidWorks solves mates sequentially — if a mate early in the list depends on a component whose position is determined by a mate later in the list, the solver must iterate multiple times.

### Reorder Mates

1. In the feature tree, expand the "Mates" folder.
2. Drag mates to reorder them so that:
   - Mates to the fixed component are first
   - Mates between components that depend on the fixed component are next
   - Mates between secondary components are last

3. After reordering, rebuild (`Ctrl + Q` for a forced full rebuild).

### Use Mate Folders

Group mates by sub-system:

1. Right-click the Mates folder > "Add Folder."
2. Name the folder after the sub-system (e.g., "Drive Train," "Enclosure").
3. Drag related mates into the folder.

SolidWorks solves mates within a folder as a group, which can improve solver efficiency for assemblies with distinct sub-systems.

## Step 7: Use the "Isolate" Tool for Troubleshooting

When a conflict involves many components, isolate the affected parts to simplify the view:

1. Select the components involved in the conflict.
2. Right-click > "Isolate."
3. All other components are hidden.
4. Fix the mate conflict in the isolated view.
5. Click "Exit Isolate" on the toolbar to restore the full assembly.

## Step 8: Prevent Future Conflicts

### Use a Consistent Mating Strategy

Establish a team standard for mating:
- Always mate to the fixed base component first
- Use Concentric + Coincident for cylindrical joints (shafts, pins, bearings)
- Use Width mates for symmetric components (brackets, spacers)
- Avoid Distance mates for alignment — use Coincident with reference planes instead

### Avoid Mating to Edges

Edge mates are fragile because edges are often consumed or recreated when features are modified. Mate to faces or axes instead, which are more stable across design changes.

### Use Reference Geometry

Create reference planes and axes specifically for mating purposes. These are more stable than feature-generated faces because they do not change when the feature geometry is modified.

1. Go to Insert > Reference Geometry > Plane.
2. Create a plane at the mating location.
3. Mate to this plane instead of a feature face.

If the feature geometry changes later, the reference plane remains in place and the mate continues to be satisfied.
