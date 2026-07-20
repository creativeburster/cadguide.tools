---
title: "Onshape Mate Connector Errors: Failed Mates, Over-Constrained Assemblies, and Fix Strategies"
excerpt: "Onshape mates fail with 'over-constrained' or 'inconsistent' errors, leaving components in wrong positions. We cover the mate diagnostics tool, the isolation method, and the fastener mate workflow that prevents constraint conflicts."
category: "troubleshooting"
softwareSlug: "onshape"
keyword: "Onshape mate connector errors failed over-constrained assembly"
slug: "onshape-mate-connector-errors-over-constrained-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-24"
sources:
  - "https://forum.onshape.com/discussion/26524/slow-performance-in-assemblies-with-a-lot-of-parts"
  - "https://forum.onshape.com/discussion/11902/slow-movement-drag-on-large-assemblies"
  - "https://forum.onshape.com/discussion/258/large-assembly-performance"
---

# Onshape Mate Connector Errors: Failed Mates, Over-Constrained Assemblies, and Fix Strategies

Onshape's mate system is one of its most powerful features — it allows you to position components relative to each other using constraints like coincident, slider, cylindrical, and planar. But when mates fail, they can be frustrating to debug. The most common errors are "over-constrained" (too many constraints on one component) and "inconsistent" (conflicting constraints). When a mate fails, the component jumps to an unexpected position, and the error can cascade through dependent mates.

## Understanding Onshape Mate Types

### Degrees of Freedom

Every component in 3D space has 6 degrees of freedom (DOF): 3 translational (X, Y, Z) and 3 rotational (RX, RY, RZ). Mates constrain DOFs:

- **Fastened**: 0 DOF remaining (fully constrained)
- **Revolute**: 1 DOF (rotation around one axis)
- **Slider**: 1 DOF (translation along one axis)
- **Cylindrical**: 2 DOF (rotation + translation along one axis)
- **Planar**: 3 DOF (translation in a plane + rotation perpendicular to plane)
- **Ball**: 3 DOF (rotation in all directions)
- **Parallel**: 4 DOF (translation in a plane + rotation around one axis)

### Over-Constrained vs. Inconsistent

- **Over-constrained**: The component has more constraints than DOFs. Some constraints are redundant but not conflicting. Onshape can sometimes solve this by ignoring redundant constraints.
- **Inconsistent**: The constraints conflict geometrically. For example, one mate says the component is 10mm from a surface, and another says it's 20mm. Onshape cannot satisfy both constraints simultaneously.

## Fix 1: Use Mate Diagnostics

Onshape has a built-in mate diagnostics tool:

1. In the assembly, click the **Mates** folder in the feature list
2. Look for mates with red error icons
3. Click the **Diagnostics** button (if available)
4. Onshape shows:
   - Which mates are failing
   - Which components are affected
   - The specific DOF conflict
5. Use this information to identify which mate to modify or delete

## Fix 2: Isolate the Failing Mate

1. **Suppress all mates**: Right-click the Mates folder → **Suppress all**
2. All components are now unconstrained
3. **Unsuppress mates one at a time**, starting from the base component
4. After each unsuppression, check if the assembly is still valid
5. When a mate causes an error, that's the problematic one
6. Edit the mate to resolve the conflict

### Why This Works

By starting from a clean state and adding mates one at a time, you can identify exactly which mate introduces the conflict. This is much faster than trying to debug a complex assembly with 50+ mates where the error could be in any of them.

## Fix 3: Use the Minimum Constraint Principle

The most common cause of over-constrained errors is using too many mates. A common mistake is using a **Fastened** mate when a **Revolute** or **Slider** would be more appropriate.

### Constraint Strategy

1. **Base component**: No mates needed — it's the fixed reference
2. **First component**: Use the minimum mate type that defines its position
   - If it needs to rotate: use **Revolute**
   - If it needs to slide: use **Slider**
   - If it's fixed: use **Fastened**
3. **Subsequent components**: Add one mate at a time, checking after each
4. **Avoid stacking mates**: Don't use two mates to position one component when one mate type would suffice

### Example: Positioning a Hinge

**Wrong approach** (over-constrained):
- Mate 1: Planar mate between hinge plate and frame face
- Mate 2: Coincident mate between hinge holes
- Mate 3: Angle mate to control rotation
- Result: 3 mates, likely over-constrained

**Correct approach** (minimum constraint):
- Mate 1: Revolute mate between hinge axis and frame hole
- Result: 1 mate, hinge can rotate freely, position is fully defined

## Fix 4: Use Fastener Mates for Standard Hardware

Onshape's **Fastener mate** automatically positions standard fasteners (screws, bolts, nuts) without manual mate creation:

1. Insert a fastener from the **Content** panel (McMaster-Carr, Misumi)
2. Use **Mate → Fastener mate**
3. Select the hole edge where the fastener goes
4. Onshape automatically positions the fastener with correct alignment
5. No need for separate coincident and planar mates

### Benefits

- One mate instead of 2-3
- Automatically handles counterbore and countersink positioning
- No over-constraint risk
- Fastener can be swapped without re-creating mates

## Fix 5: Use Mate Connectors for Complex Positions

Mate connectors are reference points that you can place on any geometry. They make mates more stable and easier to debug:

1. Create a **Mate connector** on each component at the mating location
2. Name the mate connector descriptively (e.g., "Hinge_axis_left", "Shaft_center")
3. Create mates between mate connectors, not between raw geometry
4. If a mate fails, you can check the mate connector positions independently
5. Mate connectors are also reusable — the same connector can be used in multiple mates

### Creating Mate Connectors

1. In the part studio, use **Mate connector** tool
2. Select the reference geometry (edge, face, vertex)
3. Adjust the position and orientation if needed
4. Name the mate connector
5. In the assembly, mates can reference these named connectors

## Fix 6: Fix Inconsistent Mates

When a mate is inconsistent (conflicting constraints):

1. Right-click the failing mate → **Edit**
2. Check the mate type — it may be wrong (e.g., Fastened when it should be Slider)
3. Check the referenced geometry — it may have changed
4. Check the offset values — they may be incorrect
5. Try changing the mate type to one with more DOFs
6. If the mate was created when the geometry was different, the references may be stale
7. Delete and recreate the mate with current geometry

## Fix 7: Handle Cascading Mate Failures

When one mate fails, dependent mates may also fail:

1. Fix the first failing mate in the list (closest to the base)
2. After fixing, check if dependent mates automatically recover
3. If they don't, fix them one at a time, starting from the one closest to the fixed mate
4. Don't try to fix all failing mates simultaneously — fix one, check, repeat

## Fix 8: Use Subassemblies to Simplify Mates

1. Group related components into subassemblies
2. Define all internal mates within the subassembly
3. The subassembly is then positioned in the main assembly with a single mate
4. This reduces the number of mates at the top level
5. If a mate fails in a subassembly, it doesn't affect the main assembly

### Example: Gear Box Subassembly

1. Create a subassembly for the gear box
2. Inside the subassembly, mate the gears, shafts, and bearings
3. Test the subassembly independently
4. Insert the subassembly into the main assembly
5. Use one **Fastened** mate to position the subassembly
6. Any mate issues inside the gear box are isolated from the main assembly

## Fix 9: Use the Replicate Tool for Repeated Mates

1. Create a mate for one instance of a repeated component
2. Use **Assembly → Replicate mates**
3. Select the source mate and the target instances
4. Onshape automatically creates identical mates for all instances
5. This avoids manual mate creation errors

## Summary

| Fix | Type | Impact |
|-----|------|--------|
| Use mate diagnostics | Diagnostic | Identifies failing mates |
| Isolate by suppressing all | Diagnostic | Finds the exact problematic mate |
| Use minimum constraint | Preventive | Prevents over-constraint |
| Use fastener mates | Preventive | Eliminates manual fastener mates |
| Use mate connectors | Preventive | More stable references |
| Fix inconsistent mates | Recovery | Resolves conflicting constraints |
| Fix cascading failures | Recovery | One at a time, base to tip |
| Use subassemblies | Preventive | Isolates mate issues |
| Use replicate tool | Preventive | Avoids manual errors |

The most effective strategy is the minimum constraint principle: use the mate type with the most DOFs that still defines the required motion. Combined with mate connectors for stable references and subassemblies for grouping, this approach eliminates 90%+ of mate errors. When errors do occur, use the suppress-all-then-unsuppress-one-at-a-time method to quickly identify the problematic mate.
