---
title: "Midas Gen Structural Analysis Errors: Displacement Abnormal from Insufficient Boundary Conditions and Beam End Releases Requiring Constraint Correction, Non-Linear Time History Zero Section Properties from Dummy Wireframe Members Requiring Deletion or Property Assignment, Error 2103 Convergence Failure from Non-Linearity Requiring Initial Stiffness Scheme or Strength Increase, Multi-Linear Elastic Link Crash from Zero Stiffness Requiring Non-Zero but Negligible Value, and DOF Singular from Pin-Pin Connected Elements Requiring Single Element End Release"
excerpt: "Midas Gen fails for 5 distinct reasons: Displacement abnormal from insufficient boundary conditions and beam end releases requiring constraint correction, non-linear time history zero section properties from dummy wireframe members requiring deletion or property assignment, Error 2103 convergence failure from non-linearity requiring initial stiffness scheme or strength increase, multi-linear elastic link crash from zero stiffness requiring non-zero but negligible value, and DOF singular from pin-pin connected elements requiring single element end release. We cover each with fixes from MIDAS Customer Online Support."
category: "troubleshooting"
softwareSlug: "midas-gen"
keyword: "Midas Gen Displacement abnormal insufficient boundary conditions beam end releases constraint correction non-linear time history zero section properties dummy wireframe members deletion property assignment Error 2103 convergence failure non-linearity initial stiffness scheme strength increase multi-linear elastic link crash zero stiffness non-zero negligible DOF singular pin-pin connected elements single element end release"
slug: "midas-gen-structural-analysis-errors-displacement-abnormal-boundary-conditions-beam-end-releases-nonlinear-time-history-zero-section-wireframe-error-2103-convergence-initial"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-08-03"
sources:
  - "https://support.midasuser.com/hc/en-us/articles/49481841031449--GEN-FAQ-What-Does-the-Warning-DISPLACEMENT-AT-NODE-NO-IS-ABNORMAL-Mean"
  - "https://gtc.midasuser.com/helpdesk/KB/View/19403071-convergence"
  - "https://gtc.midasuser.com/helpdesk/KB/View/23324665-how-to-resolve-the-crashing-error-caused-by-multilinear-elastic-link-"
---

# Midas Gen Structural Analysis Errors: Displacement Abnormal from Insufficient Boundary Conditions and Beam End Releases Requiring Constraint Correction, Non-Linear Time History Zero Section Properties from Dummy Wireframe Members Requiring Deletion or Property Assignment, Error 2103 Convergence Failure from Non-Linearity Requiring Initial Stiffness Scheme or Strength Increase, Multi-Linear Elastic Link Crash from Zero Stiffness Requiring Non-Zero but Negligible Value, and DOF Singular from Pin-Pin Connected Elements Requiring Single Element End Release

Midas Gen's boundary conditions, section properties, convergence handling, link elements, and end releases produce errors from insufficient constraints, zero properties, non-linearity, zero stiffness, and over-released connections. This guide covers the 5 most common Midas Gen problems with diagnostic steps and community-verified fixes from MIDAS Customer Online Support.

## 1. Displacement Abnormal from Insufficient Boundary Conditions and Beam End Releases

### Symptom

Warning message: "DISPLACEMENT RY AT NODE NO. 358 IS ABNORMAL" or "DISPLACEMENT DZ AT NODE NO. 643 IS ABNORMAL." Multiple nodes show abnormal displacement warnings. The analysis may complete but with unrealistic displacement values. The warning indicates a singular error or instability at the specified node.

### Root Cause

"This warning typically indicates a singular error or instability at the specified node. It occurs when a node has insufficient constraints, allowing unrestricted or infinite displacement in one or more degrees of freedom (DOF)." Primary causes: (1) Missing or inadequate supports result in rigid body movement. (2) "Applying releases to all members connected at a node may leave it completely free" — excessive beam end releases remove all constraint at a node.

### Fix

1. **Review and correct boundary conditions**:
   - "Ensure sufficient constraints exist for all DOFs where necessary"
   - "Confirm that the overall model has adequate support to avoid rigid body motion"
   - Check all support definitions
   - Verify the model is properly constrained in all 6 DOFs

2. **Adjust beam end releases**:
   - "Avoid applying releases to all connected members at the same node"
   - "Preferably, apply releases to only one element per node connection"
   - If multiple elements meet at a node, release only one
   - Keep at least one element rigid at each node

3. **Use point spring supports**:
   - "Apply point springs with very low stiffness to stabilize unconstrained nodes"
   - "After analysis, verify that these springs show near-zero reactions"
   - Add springs with stiffness like 0.001 kN/mm
   - This provides numerical stability without affecting results

4. **Check reaction forces**:
   - "Artificial spring supports should exhibit negligible reaction forces"
   - If springs show significant reactions, the constraint is not artificial
   - Increase the model's actual constraints
   - Remove or reduce the artificial springs

5. **Review displacement patterns**:
   - "Displacement contours should be reasonable and continuous"
   - If displacement is extremely large at one node, it's likely unconstrained
   - Check the displacement contour plot
   - Identify and fix the unconstrained area

6. **Progressive model validation**:
   - "Start with a fully restrained model and progressively release DOFs"
   - Begin with all nodes fixed
   - Release DOFs one at a time
   - Identify which release causes the instability

### Community Report

> "DISPLACEMENT RY AT NODE NO. 358 IS ABNORMAL. This warning typically indicates a singular error or instability at the specified node. It occurs when a node has insufficient constraints, allowing unrestricted or infinite displacement. Primary causes: insufficient boundary conditions, excessive beam end releases. Solution: review and correct boundary conditions, adjust beam end releases, use point spring supports with very low stiffness."

## 2. Non-Linear Time History Zero Section Properties from Dummy Wireframe Members

### Symptom

Running a non-linear time history analysis with direct integration method. Error: "WARNING: For the non-linear time history analysis with the direct integration method, Area, Ixx, Iyy and Izz of the beam section property must have non-zero values so that corresponding flexibility matrices do not become singular. ERRORS ENCOUNTERED. MIDAS JOB TERMINATED."

### Root Cause

"The reason for this error are the dummy members which have section property 'Wireframe.' This section has so small dimensions that the section properties are extremely small and due to normal computational rounding is considered as zeros. This is not acceptable for the analysis." The Wireframe section is designed for display purposes only — it has near-zero section properties. In non-linear time history analysis, the solver needs non-zero section properties to build the flexibility matrix. Zero properties create a singular matrix.

### Fix

1. **Delete wireframe members**:
   - "If you delete the wireframe members you should be able to run the analysis"
   - Remove all dummy/wireframe members from the model
   - These are not needed for analysis
   - Only for display or reference

2. **Assign real section properties**:
   - If the members are needed for the model
   - Assign real section properties instead of Wireframe
   - Use the smallest available standard section
   - Or create a custom section with small but non-zero properties

3. **Use zero-weight sections**:
   - If the members should not contribute to the model
   - Assign a real section but set the material density to zero
   - This gives non-zero stiffness but zero mass
   - The flexibility matrix is non-singular

4. **Check for 2D model issues**:
   - "This type of the problem may happen in the nonlinear time history analysis of the 2D-model with zero section properties related to the out-of-plane deformation"
   - In 2D models, out-of-plane properties may be zero
   - Assign non-zero out-of-plane properties
   - Or use 3D analysis instead

5. **Verify all section properties**:
   - Before running non-linear analysis
   - Check all sections for non-zero properties
   - Use Model > Check > Section Properties
   - Fix any zero or near-zero properties

6. **Use mode superposition instead**:
   - If direct integration fails due to zero properties
   - Try mode superposition method
   - This may be more tolerant of small properties
   - But verify results are accurate

### Community Report

> "WARNING: For the non-linear time history analysis with the direct integration method, Area, Ixx, Iyy and Izz of the beam section property must have non-zero values. ERRORS ENCOUNTERED. MIDAS JOB TERMINATED. The reason is the dummy members which have section property 'Wireframe.' This section has so small dimensions that the section properties are extremely small and considered as zeros. If you delete the wireframe members you should be able to run the analysis."

## 3. Error 2103 Convergence Failure from Non-Linearity

### Symptom

Error 2103 during analysis. The analysis doesn't converge in a specific phase. The software only shows the previous finished phase's results — no partial results from the failed phase. No additional information about the cause is provided.

### Root Cause

Error 2103 is a convergence failure in non-linear analysis. The solver can't find equilibrium within the allowed iterations. This is typically caused by: (1) material non-linearity that's too severe, (2) insufficient strength in soil materials, (3) lack of structural reinforcement, or (4) mesh quality issues. "It is hard to solve with changing the convergence method" if the non-linearity is too strong.

### Fix

1. **Use initial stiffness scheme**:
   - "I'm recommending you to carry out the analysis with initial stiffness scheme"
   - "You can use this method when the non-linearity is so weak with your material properties"
   - Change the convergence method to initial stiffness
   - This may help with weak non-linearity

2. **Increase soil material strength**:
   - "Please increase the strength of soil material"
   - If the soil is too weak, the analysis can't converge
   - Increase cohesion, friction angle, or stiffness
   - This provides more resistance for convergence

3. **Install more structural reinforcement**:
   - "Or install more structural reinforcement"
   - Add more supports, anchors, or structural elements
   - This provides additional stiffness
   - Helps the solver find equilibrium

4. **View partial results from failed phase**:
   - "You can see separated steps from result work-tree"
   - In the results work-tree
   - Expand the failed phase
   - View results from individual steps before failure

5. **Check mesh quality**:
   - "Maybe it is a problem in the mesh, soil, construction etc."
   - Review mesh quality
   - Check for distorted elements
   - Refine mesh in critical areas

6. **Reduce load increments**:
   - Use smaller load steps
   - This gives the solver smaller increments to converge
   - Increase the number of load steps
   - May help with convergence

7. **Adjust convergence tolerances**:
   - Loosen convergence tolerances
   - Increase maximum iterations
   - This gives the solver more opportunity to converge
   - But may reduce accuracy

### Community Report

> "How can I pass through error 2103? I only see the information error 2103, nothing else. How can I see the partial results from the phase that didn't converge? Recommendation: carry out the analysis with initial stiffness scheme. If you can't pass with this method, it is hard to solve. Please increase the strength of soil material or install more structural reinforcement."

## 4. Multi-Linear Elastic Link Crash from Zero Stiffness

### Symptom

Analysis crashes when using multi-linear elastic links. The analysis is not running. The crash occurs because the multi-linear springs have zero stiffness value. The analysis is not able to converge with zero stiffness.

### Root Cause

"The analysis was not running when the multi-linear springs have zero stiffness value due to which the analysis is not able to converge." Multi-linear elastic links define stiffness as a function of displacement. If the stiffness at any displacement point is exactly zero, the solver encounters a singular matrix at that point. The solver can't proceed and crashes.

### Fix

1. **Use non-zero but negligible stiffness**:
   - "Kindly update the multi-linear property such that the stiffness value is negligible but not zero"
   - Instead of zero stiffness, use a very small value
   - For example: 0.0001 kN/m instead of 0 kN/m
   - This prevents the singular matrix

2. **Check all stiffness values in the multi-linear curve**:
   - Review the multi-linear link properties
   - Check every point in the stiffness-displacement curve
   - Ensure no point has exactly zero stiffness
   - Replace all zeros with negligible values

3. **Use linear elastic links instead**:
   - If the multi-linear behavior is not critical
   - Use a linear elastic link with constant stiffness
   - This avoids the zero stiffness issue
   - Simplify the model

4. **Verify link orientation**:
   - Check that the link is properly oriented
   - Incorrect orientation can cause unexpected zero stiffness
   - Verify the local axes of the link
   - Ensure stiffness is defined in the correct direction

5. **Test with simplified model**:
   - Create a simple test model with the multi-linear link
   - Verify the link works in isolation
   - Then add it to the full model
   - This isolates the issue

### Community Report

> "How to resolve the crashing error caused by multilinear elastic link? The analysis was not running when the multi-linear springs have zero stiffness value due to which the analysis is not able to converge. Kindly update the multi-linear property such that the stiffness value is negligible but not zero."

## 5. DOF Singular from Pin-Pin Connected Elements

### Symptom

Warning: "DOF MAY BE SINGULAR" and "DISPLACEMENT DZ AT NODE NO. 643 IS ABNORMAL" and "DISPLACEMENT RX AT NODE NO. 643 IS ABNORMAL." Multiple consecutive nodes show abnormal displacement in DZ and RX. The model has beam and column connections where both horizontal and vertical elements are pin-pin connected.

### Root Cause

"A singular error is when a node is completely free in 1 or more DOF and is allowed to undergo rigid body movement. In your model file, both the horizontal or vertical elements are pin-pin connected, so the nodes at the connecting of beam and column are free." When both the beam and column at a connection have end releases (pin-pin), the node has no rotational constraint. It's free to rotate infinitely, causing the singular DOF.

### Fix

1. **Apply end release to only one element**:
   - "Change those condition to apply beam end release on the only one of the horizontal or vertical elements"
   - At each beam-column connection
   - Release either the beam OR the column, not both
   - This leaves one element rigid at the node

2. **Use rigid links instead of end releases**:
   - Instead of pin-pin connections
   - Use rigid links to connect beam and column
   - The rigid link provides rotational constraint
   - While allowing the desired structural behavior

3. **Add rotational spring**:
   - At the pin-pin connection
   - Add a rotational spring with small stiffness
   - This provides numerical stability
   - Without significantly affecting the structural behavior

4. **Check all connections**:
   - Review all beam-column connections in the model
   - Identify all pin-pin connections
   - Fix each one by releasing only one element
   - Verify no node has all elements released

5. **Use master-slave constraints**:
   - Instead of end releases
   - Use master-slave node constraints
   - Define one node as master
   - Slave nodes follow the master's DOFs

6. **Verify with reaction check**:
   - After fixing the singular DOFs
   - Run the analysis
   - Check that reactions are reasonable
   - Verify no more abnormal displacement warnings

### Community Report

> "DOF MAY BE SINGULAR. DISPLACEMENT DZ AT NODE NO. 643 IS ABNORMAL. DISPLACEMENT RX AT NODE NO. 643 IS ABNORMAL. A singular error is when a node is completely free in 1 or more DOF. In your model, both the horizontal or vertical elements are pin-pin connected, so the nodes at the connecting of beam and column are free. Change those condition to apply beam end release on only one of the horizontal or vertical elements."

## 6. Additional Midas Gen Issues

### Element Property Validation

**Issue**: "Ensure elements have valid material properties and cross-sections."
**Fix**: Use Model > Check > Data Check. Verify all elements have assigned materials and sections. Fix any missing assignments. Check for zero or negative values.

### Load Path Verification

**Issue**: "Confirm that all applied loads have a clear transfer path to the supports."
**Fix**: Trace each load to its support. Check for floating loads. Ensure all load-bearing elements connect to supports. Use Model > Check > Load Path.

### Model Validation from Fully Restrained

**Issue**: Need to identify instability sources.
**Fix**: "Start with a fully restrained model and progressively release DOFs to detect instability sources." Fix all nodes. Release one DOF at a time. Run analysis after each release. Identify which release causes instability.

### 2D Model Out-of-Plane Issues

**Issue**: "2D-model with zero section properties related to the out-of-plane deformation."
**Fix**: Assign non-zero out-of-plane properties (Izz, Iyy). Or switch to 3D analysis. Use symmetric section properties. Verify all 6 DOF properties are non-zero.

## Best Practices

1. **Ensure sufficient boundary conditions for all DOFs** — prevents abnormal displacement
2. **Apply end releases to only one element per node** — prevents singular DOF
3. **Delete or assign real properties to wireframe members** — prevents zero section error
4. **Use non-zero but negligible stiffness for multi-linear links** — prevents crash from zero stiffness
5. **Try initial stiffness scheme for convergence issues** — helps with weak non-linearity
6. **Increase material strength or reinforcement for Error 2103** — provides resistance for convergence
7. **Add point springs with low stiffness for unconstrained nodes** — stabilizes without affecting results
8. **Start with fully restrained model and release progressively** — identifies instability sources
9. **Verify all section properties are non-zero before non-linear analysis** — prevents singular matrix
10. **Check reaction forces after analysis** — artificial springs should show negligible reactions
