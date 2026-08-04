---
title: "SolveSpace Handle Limit and Constraint Solver Errors: Handle Isn't Unique Crash from 32-Bit Entity Handle Limit Requiring Assembly Split, Solver Fails on Angle Constraint Jumps from Numerical Convergence Failure Requiring Incremental Changes, Constraints Are Incompatible from Large Object Solver Convergence Requiring Unit Scaling, Constraining Entities from Previous Groups Fails from Group Order Dependency Requiring Sequential Constraint, and Linked Parts Import as REF from Multi-Instance Propagation Failure Requiring Single Instance Editing"
excerpt: "SolveSpace fails for 5 distinct reasons: handle isn't unique crash from 32-bit entity handle limit requiring assembly split, solver fails on angle constraint jumps from numerical convergence failure requiring incremental changes, constraints are incompatible from large object solver convergence requiring unit scaling, constraining entities from previous groups fails from group order dependency requiring sequential constraint, and linked parts import as REF from multi-instance propagation failure requiring single instance editing. We cover each with fixes from SolveSpace GitHub Issues and Forum."
category: "troubleshooting"
softwareSlug: "solvespace"
keyword: "SolveSpace handle isn't unique crash 32-bit entity handle limit assembly split solver fails angle constraint jumps numerical convergence failure incremental changes constraints incompatible large object solver convergence unit scaling constraining entities previous groups fails group order dependency sequential constraint linked parts import REF multi-instance propagation failure single instance editing"
slug: "solvespace-handle-limit-constraint-solver-errors-handle-isnt-unique-32-bit-entity-handle-limit-solver-fails-angle-constraint-jumps-constraints-incompatible-large-object-unit"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://github.com/solvespace/solvespace/issues/1569"
  - "https://github.com/solvespace/solvespace/issues/1247"
  - "https://github.com/solvespace/solvespace/issues/1466"
---

# SolveSpace Handle Limit and Constraint Solver Errors: Handle Isn't Unique Crash from 32-Bit Entity Handle Limit Requiring Assembly Split, Solver Fails on Angle Constraint Jumps from Numerical Convergence Failure Requiring Incremental Changes, Constraints Are Incompatible from Large Object Solver Convergence Requiring Unit Scaling, Constraining Entities from Previous Groups Fails from Group Order Dependency Requiring Sequential Constraint, and Linked Parts Import as REF from Multi-Instance Propagation Failure Requiring Single Instance Editing

SolveSpace's entity handle system, constraint solver, unit scaling, group constraint ordering, and linked part propagation produce errors from handle overflow, numerical convergence failures, large object scaling, group dependency, and multi-instance issues. This guide covers the 5 most common SolveSpace problems with diagnostic steps and community-verified fixes from GitHub Issues and Forum.

## 1. Handle Isn't Unique Crash from 32-Bit Entity Handle Limit

### Symptom

A moderately complex assembly file teeters on the edge of crashing. Changing the number of translated copies up by a few causes crash. Importing any new assembly causes crash. Most of the time there is no error message — only a "ding" then SolveSpace must be killed from task manager. Sometimes the error appears: "Assertion failed: FindByIdNoOops(t->h) == nullptr. Message: Handle isn't unique." The assembly has 98020 entities and 12 groups.

### Root Cause

"This is indeed a known limitation. Removing it requires a change in the file format." SolveSpace uses 32-bit entity handles. Each entity (point, line, curve, etc.) has a unique handle. When an assembly has many linked parts with translated copies, the entity count can exceed 2^32 (4,294,967,296). The handle counter overflows, and new entities get duplicate handles. The `IdList::Add` function asserts that handles are unique — when a duplicate is found, it crashes. The fix requires changing to 64-bit handles, which requires a file format change.

### Fix

1. **Split the assembly into multiple files**:
   - "Most users find ways around it by linking multiple files for their design"
   - Divide the assembly into sub-assemblies
   - Each sub-assembly in its own file
   - Link the sub-assemblies in a master assembly file

2. **Reduce translated copies**:
   - "It also crashes if I just try increasing the translate count over 15 or so"
   - Reduce the number of translated copies
   - Use fewer copies per group
   - Split across multiple groups

3. **Reduce entity count**:
   - Simplify parts to reduce entity count
   - Use simpler geometry
   - Remove unnecessary features
   - Each entity contributes to the handle count

4. **Link fewer sub-assemblies**:
   - "Nine other designs loaded as an assembly each in its own group"
   - Reduce the number of linked sub-assemblies
   - Combine some parts into single files
   - This reduces total entity count

5. **Avoid deep nesting**:
   - "Some of those assemblies are themselves assembled from other sub-assemblies"
   - Deep nesting multiplies entity count
   - Flatten the assembly hierarchy
   - Link parts directly instead of through sub-assemblies

6. **Wait for 64-bit handle fix**:
   - "In my head I've had an idea/plan how to do it for a while"
   - The developers plan to make handles 64-bit
   - This requires a file format change
   - No timeline available

7. **Use a different CAD tool for complex assemblies**:
   - If the handle limit is a persistent problem
   - Consider FreeCAD or OpenSCAD for complex assemblies
   - SolveSpace is designed for simpler models
   - The handle limit is a fundamental architectural constraint

### Community Report

> "I have a moderately complex file of assemblies that teeters precariously on the edge of crashing. Change the number of translated copies up by a few? Crash. Import ANY new assembly? Crash. Most of the time there is NO error message — only a 'ding.' But sometimes: Assertion failed: FindByIdNoOops(t->h) == nullptr. Message: Handle isn't unique. 96 params, 98020 entities, 12 groups. This is indeed a known limitation. Removing it requires a change in the file format."

## 2. Solver Fails on Angle Constraint Jumps from Numerical Convergence Failure

### Symptom

Opening a test file and modifying an angle constraint. Changing from 60° to 30° causes "unsolvable constraints" error. But changing from 60° to 40° works fine. Changing from 59.1° to 28° fails, but 59.0° to 28° works. The solver can handle small jumps but not large ones. The failure is intermittent and depends on the specific angle values.

### Root Cause

"That's really annoying. It can handle a jump from 60 to 40, but not 60 to 30." SolveSpace's constraint solver uses numerical methods (Newton-Raphson or similar) to find solutions. The solver starts from the current geometry state and iterates toward the solution. When the angle change is too large, the solver's initial guess is too far from the solution. The solver converges to a local minimum or diverges, reporting "unsolvable constraints." Small changes allow the solver to converge because the starting point is close to the solution.

### Fix

1. **Make incremental changes**:
   - Instead of jumping from 60° to 30°
   - Change in steps: 60° → 50° → 40° → 30°
   - Each step is small enough for the solver to converge
   - This is the most reliable workaround

2. **Undo and retry with smaller steps**:
   - If the solver fails
   - Undo the change
   - Make a smaller change first
   - Then continue toward the target

3. **Drag geometry close to target first**:
   - Before applying the constraint change
   - Drag the geometry close to the target position
   - This gives the solver a better starting point
   - Then apply the exact constraint

4. **Use intermediate constraints**:
   - Add a temporary constraint at an intermediate angle
   - Let the solver converge
   - Then change to the final angle
   - Remove the temporary constraint

5. **Check for conflicting constraints**:
   - The solver may fail if there are conflicting constraints
   - Remove unnecessary constraints
   - Ensure the system is not over-constrained
   - Check DOF (degrees of freedom)

6. **Report simple test cases**:
   - "Thank you for such a simple test case"
   - Simple test cases help developers fix the solver
   - Report on GitHub with minimal reproduction
   - Include the .slvs file

7. **Wait for solver improvements**:
   - The solver is being improved
   - "Solver: clean up and optimise SolveBySubstitution() and WriteJacobian()"
   - Future versions may handle larger jumps
   - Update to the latest version

### Community Report

> "Open test.slvs, then modify the angle constraint to 60°. Change again the angle to 30°. It can handle a jump from 60 to 40, but not 60 to 30. Nice test case! Changing the angle from 60 to anything between 27-32 causes the solve to fail. 59.1 -> 28 fails as well, 59.0 -> 28.0 does not. Interesting."

## 3. Constraints Are Incompatible from Large Object Solver Convergence

### Symptom

When constraining an assembly, the error "the following constraints are incompatible - same-orientation, pt-on-line" appears. The error occurs when constraining a box on a floor. Constraining one end of the box works fine, but constraining the other end produces the error. The error may be related to "constrain symmetric" in the part. The issue was not present in SolveSpace 3.0 but appears in 3.1.

### Root Cause

"It boils down to the solver having convergence problems with large objects. If you decrease the size of box.slvs to 127x40 and the size of floor.slvs to 152 it works fine." The solver uses numerical methods that are sensitive to the scale of the geometry. When objects are large (e.g., 1000mm), the solver's numerical precision is insufficient. The Jacobian matrix has large values that cause the solver to diverge. The Eigen library used in SolveSpace 3.1 may have made this worse. The issue is scale-dependent — smaller objects converge fine.

### Fix

1. **Use smaller units (mm or 0.1-inch)**:
   - "A simple work around is to use mm or .1-inch where inches are meant"
   - If using inches, switch to mm
   - Or scale the geometry down
   - This improves solver convergence

2. **Scale down the geometry**:
   - "If you decrease the size of box.slvs to 127x40 and the size of floor.slvs to 152 it works fine"
   - Scale the parts to smaller dimensions
   - Solve the constraints
   - Then scale back up if needed

3. **Use SolveSpace 3.0**:
   - "Tom said it worked for him using 3.0"
   - The Eigen library change in 3.1 may have worsened the issue
   - Try SolveSpace 3.0
   - It may handle large objects better

4. **Constrain in steps**:
   - Don't apply all constraints at once
   - Apply same-orientation first
   - Then apply pt-on-line
   - This may help the solver converge

5. **Avoid "constrain symmetric"**:
   - "I think the error has something to do with the constrain symmetric in box.slvs"
   - Remove symmetric constraints
   - Use other constraint types
   - This may resolve the incompatibility

6. **Check for duplicate constraints**:
   - Ensure you're not constraining the same entity twice
   - Remove redundant constraints
   - Check the constraint list
   - Simplify the constraint system

7. **Drag to approximate position first**:
   - Before constraining
   - Drag the parts close to their target positions
   - This gives the solver a better starting point
   - Then apply constraints

### Community Report

> "The error message: 'the following constraints are incompatible - same-orientation, pt-on-line.' It boils down to the solver having convergence problems with large objects. If you decrease the size to 127x40 and 152 it works fine. There was a discussion on this topic recently. The difference between 3.0 and master is that the solver uses Eigen for numerical solutions. A simple work around is to use mm or .1-inch where inches are meant."

## 4. Constraining Entities from Previous Groups Fails from Group Order Dependency

### Symptom

Creating a block (extruded rectangle) and saving. Creating a new assembly file and importing the block. Constraining the orientation on Z axes works. Undoing the constraint. Importing the same block a second time. Trying to add the same orientation constraint that worked before on the first block — fails with "unsolvable." But the same constraint on the newly imported second block works.

### Root Cause

"Constraints apply between the current active group and itself or previous groups. If you linked the parts in the order they need to be assembled, just select the groups and set the constraints." The constraint solver in SolveSpace works hierarchically — constraints in a group can only reference entities from the same group or previous groups. When you import a block (creating a new group), then try to constrain it relative to a previously imported block, the constraint must be in the correct group. If you try to constrain in the wrong group, the solver can't find the entity references and reports "unsolvable."

### Fix

1. **Constrain each part as you bring it in**:
   - "When building up an assembly you need to constrain each part as you bring it into the assembly"
   - Import the first part, constrain it
   - Import the second part, constrain it relative to the first
   - Don't import all parts then try to constrain

2. **Create constraints in the correct group**:
   - "Maybe you're creating the constraints in the wrong group?"
   - "It has to be in the group for the part you're constraining"
   - Select the correct group before adding constraints
   - The constraint must be in the part's group

3. **Drag parts to approximate position first**:
   - "Did you try dragging each part to about the right orientation"
   - "Then constraining two normals with same-orientation"
   - "Then constraining the points coincident"
   - "That always works for me"

4. **Use same-orientation before point-on-point**:
   - First constrain same-orientation on two normals
   - Then constrain point-on-point (coincident)
   - This order is more reliable
   - The solver can converge step by step

5. **Don't constrain within the same part**:
   - "Are you sure the two points/normals you're constraining aren't actually both on the same part?"
   - Check that you're selecting entities from different parts
   - Not two entities on the same part
   - Or on the original references

6. **Link parts in assembly order**:
   - "If you linked the parts in the order they need to be assembled"
   - Import parts in the order they'll be constrained
   - This ensures previous groups are available
   - For each new constraint

7. **Use the correct constraint type**:
   - For orientation: same-orientation on normals
   - For position: point-on-point (coincident)
   - For alignment: pt-on-line
   - Use the simplest constraint that works

### Community Report

> "Create a block, save file. Create a new assembly, import the block, constrain orientation on Z axes — works. Undo. Import the same block a second time. Try to add the same constrain that worked before on the first block — unsolvable. But on the newly imported block — works. Maybe you're creating the constraints in the wrong group? It has to be in the group for the part you're constraining. When building up an assembly, constrain each part as you bring it in."

## 5. Linked Parts Import as REF from Multi-Instance Propagation Failure

### Symptom

Creating 10 objects separately in SolveSpace. Making a 3D model from the components using the link feature. All objects import as #REF. Setting adjustable lengths and using length ratios, midpoints, angles, and constraints — leaving degrees of freedom so parts can be adjustable relative to a master part. But the parts import as #REF, breaking the parametric design. Changes to the master part don't propagate to linked parts.

### Root Cause

"When you link a part, that part is treated as completely static in the assembly other than its location and orientation. The remaining degrees of freedom in the original file can not be changed within the assembly." Linked parts in SolveSpace are treated as static geometry. The degrees of freedom (adjustable parameters) from the original file are not exposed in the assembly. The #REF error occurs when the linked part's references can't be resolved — this happens when the part file is not found, or when running two instances of SolveSpace and editing a part in one doesn't reflect in the other.

### Fix

1. **Edit parts in the same SolveSpace instance**:
   - "If we open both parts in different instances of solvespace and try to make changes in cube.slvs, even after regenerate all, it does not reflect changes in newFile.slvs"
   - "It runs fine if both files are open in a single instance turn by turn"
   - Open both files in the same SolveSpace instance
   - Switch between them with tabs

2. **Save and reopen to propagate changes**:
   - "If you change a dimension in a linked object, you have to re-open and save the object that imports it to propagate the changes"
   - Edit the part file
   - Save it
   - Reopen the assembly file
   - Changes should propagate

3. **Use a skeleton sketch**:
   - "You could make a construction drawing as a skeleton for sizing parts in other drawings"
   - Create a master sketch with key dimensions
   - Link this sketch in each part file
   - Changes to the skeleton propagate to all parts

4. **Don't expect parametric propagation**:
   - "The remaining degrees of freedom in the original file can not be changed within the assembly"
   - SolveSpace doesn't support parametric assembly
   - Linked parts are static
   - Only location and orientation can be constrained

5. **Extrude within the assembly**:
   - "For extrusions like 80/20 you can link a 2D sketch and then extrude within the assembly sketch"
   - "This can be done multiple times using the same sketch but have each extrusion a different length"
   - Link the 2D profile
   - Extrude in the assembly with different lengths

6. **Use the scale/resize option**:
   - "There is an option in the text window to scale/resize the linked part"
   - This is the only parametric control in the assembly
   - Scale the linked part
   - But this scales all dimensions uniformly

7. **Zip all files when sharing**:
   - "When uploading a multi-file project, you need to zip up all relevant files"
   - The assembly file references part files
   - Share all files together
   - Otherwise links break as #REF

### Community Report

> "When I create 10 objects separately and try to make a 3D model from the components with the link feature, all the objects import as #REF. I set adjustable lengths and used length ratios, mid points, angles and constraints. The parts all import as #REF which breaks this. When you link a part, that part is treated as completely static in the assembly other than its location and orientation. If we open both parts in different instances of solvespace, changes do not reflect. It runs fine if both files are open in a single instance."

## 6. Additional SolveSpace Issues

### Difference Extrude Thin Lid

**Issue**: "When I try to cut a hole by difference extruding, there's sometimes a thin lid no matter which way I move the extrude."
**Fix**: Check extrude direction. Use "both directions" option. Adjust the extrude distance. This is a known display issue.

### NURBS Limitations

**Issue**: "SolveSpace's inability to handle NURBS for more than 5 minutes."
**Fix**: Use simpler geometry. Avoid complex NURBS surfaces. Use triangular meshes instead. Consider other CAD tools for NURBS.

### Import/Export Format Limitations

**Issue**: "The import/export features are very outdated. Very old formats of DXF and no support of SolidWorks or AutoCAD formats that are newer."
**Fix**: Use STEP for 3D import/export. Use DXF for 2D. Convert files in another tool. Check for format updates in new versions.

### No Image Import

**Issue**: "It would be nice to be able to import an image onto a plane for tracing parts from an image."
**Fix**: Use a different tool for image tracing. Import the traced geometry as DXF. Use Inkscape for image-to-DXF conversion. This is a feature request.

### Solver Fails on Simple Cases

**Issue**: "SolveSpace fails to solve solvable constraints on simple test cases."
**Fix**: Make incremental changes. Drag geometry close to target. Check for over-constraint. Report on GitHub with test case.

### Forum Assembly Constraint Help

**Issue**: "I get 'SOLVE FAILED unsolvable constraints' when constraining point on point."
**Fix**: Drag parts to approximate position first. Use same-orientation before point-on-point. Check group order. Constrain one part at a time.

## Best Practices

1. **Split complex assemblies into multiple files** — avoids 32-bit handle limit crash
2. **Make incremental angle changes** — prevents solver convergence failure
3. **Use mm instead of inches for large objects** — improves solver convergence
4. **Constrain each part as you import it** — prevents group order dependency issues
5. **Use same-orientation before point-on-point** — more reliable constraint order
6. **Drag parts to approximate position before constraining** — gives solver better starting point
7. **Edit linked parts in the same SolveSpace instance** — ensures changes propagate
8. **Save and reopen assembly after editing parts** — propagates linked part changes
9. **Use a skeleton sketch for parametric design** — workaround for static linked parts
10. **Zip all files when sharing assemblies** — prevents #REF broken links
