---
title: "Abaqus Contact Convergence Severe Discontinuity Iterations, Second-Order Tetrahedral Corner Node Zero Force, Initial Overclosure Interference Fit Resolution, Penalty Method vs Hard Contact Overconstraint, and Surface Mesh Crack Node Stuck: Surface-to-Surface Formulation, Penalty Enforcement, Automatic Overclosure Adjustment, and Small-Sliding Tracking"
excerpt: "Abaqus/Standard contact simulations fail for 5 distinct reasons: severe discontinuity iterations from unresolved contact conditions requiring SDI conversion adjustment, second-order tetrahedral C3D10 corner node zero force with node-to-surface hard contact requiring surface-to-surface formulation, initial overclosure interference fit too large for single increment requiring multi-increment resolution, hard contact overconstraint from direct enforcement requiring penalty method, and surface mesh crack causing node stuck behind main surface requiring surface repair. We cover each with fixes from Abaqus documentation."
category: "contact-convergence-and-mesh-errors"
softwareSlug: "abaqus"
keyword: "Abaqus contact convergence severe discontinuity iteration SDI second-order tetrahedral C3D10 corner node zero force initial overclosure interference fit penalty method hard contact overconstraint surface mesh crack node stuck surface-to-surface formulation small-sliding tracking"
slug: "abaqus-contact-sdi-tetrahedral-corner-node-zero-force-overclosure-interference-fit-penalty-hard-contact-overconstraint-surface-mesh-crack-node-stuck-surface-to-surface-penalty-small-sliding"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://docs.software.vt.edu/abaqusv2025/English/SIMACAEITNRefMap/simaitn-c-contacttrouble.htm"
  - "https://docs.software.vt.edu/abaqusv2025/English/SIMACAEITNRefMap/simaitn-c-contactconstraints.htm"
  - "https://docs.software.vt.edu/abaqusv2025/English/SIMACAEITNRefMap/simaitn-c-contactdiagnostics.htm"
---

# Abaqus Contact Convergence Severe Discontinuity Iterations, Second-Order Tetrahedral Corner Node Zero Force, Initial Overclosure Interference Fit Resolution, Penalty Method vs Hard Contact Overconstraint, and Surface Mesh Crack Node Stuck: Surface-to-Surface Formulation, Penalty Enforcement, Automatic Overclosure Adjustment, and Small-Sliding Tracking

Abaqus/Standard's contact modeling produces convergence failures from severe discontinuity iterations, second-order element corner node issues, initial overclosures, hard contact overconstraints, and surface mesh discontinuities. This guide covers the 5 most common Abaqus contact convergence problems with diagnostic steps and community-verified fixes from Abaqus documentation.

## 1. Severe Discontinuity Iterations from Unresolved Contact Conditions

### Symptom

Abaqus/Standard contact analysis aborts with "CONVERGENCE IS JUDGED DIFFICULT" or "TOO MANY ATTEMPTS MADE FOR THIS INCREMENT." The message file shows repeated severe discontinuity iterations (SDIs) with "N closures M openings" that don't converge to zero. The analysis cuts back the time increment repeatedly until the minimum time increment is reached and the analysis aborts.

### Root Cause

"Establishing contact conditions is a common source of difficulty in an implicit static contact analysis. If an analysis terminates because it exceeds the maximum number of severe discontinuity iterations, the contact diagnostics give insight into how to resolve the problem." Abaqus/Standard alternates between equilibrium iterations and SDIs to resolve contact conditions. When SDIs persist (contact status keeps changing between open and closed), the increment can't converge. "If the changes are tending toward zero, increasing the allowed number of severe discontinuity iterations or adjusting the SDI conversion settings may allow Abaqus to resolve the contact conditions. If the changes are not tending toward zero, you will need to revise your model."

### Fix

1. **Check if SDIs are tending toward zero**:
   - Use the contact diagnostics tool in Abaqus/CAE
   - "Plot the number of contact status changes over the course of an attempt"
   - "If the changes are tending toward zero, increasing the allowed number of SDIs"
   - "Or adjusting the SDI conversion settings may allow Abaqus to resolve"
   - "If the changes are not tending toward zero, you will need to revise your model"

2. **Increase the maximum number of SDIs**:
   - In the step definition
   - Increase `*CONTROLS` to a higher value
   - Default is typically 12
   - Try 20 or higher for complex contact

3. **Adjust SDI conversion settings**:
   - "Adjusting the SDI conversion settings"
   - Set `CONTROLS, PARAMETERS=TIME INCREMENTATION`
   - Modify the SDI conversion criteria
   - Allow more SDIs before conversion to equilibrium iterations

4. **Use small-sliding tracking approach**:
   - "It is typically easier to resolve contact conditions for contact pairs using the small-sliding tracking approach"
   - "Than for those using the finite-sliding tracking approach"
   - If applicable to your model
   - Switch from finite-sliding to small-sliding

5. **Identify problematic contact pairs**:
   - "If a particular contact pair or surface region is causing a majority of the status fluctuations"
   - "You may need to modify characteristics of the associated interaction"
   - Use the diagnostics tool to highlight problematic regions
   - Focus on the most active contact pairs

6. **Reduce initial contact changes**:
   - "It is common to have convergence difficulties in the first increment"
   - "If the contact status changes over a large portion of the contact area upon initial loading"
   - Apply loads gradually
   - Use a smaller initial time increment

7. **Use contact stabilization**:
   - Add contact stabilization damping
   - In the interaction definition
   - This helps resolve initial contact conditions
   - Without affecting the final converged solution

### Community Report

> "Establishing contact conditions is a common source of difficulty in an implicit static contact analysis. If an analysis terminates because it exceeds the maximum number of severe discontinuity iterations, the contact diagnostics give insight into how to resolve the problem. If the changes are tending toward zero, increasing the allowed number of severe discontinuity iterations or adjusting the SDI conversion settings may allow Abaqus to resolve the contact conditions."

## 2. Second-Order Tetrahedral C3D10 Corner Node Zero Force with Node-to-Surface Hard Contact

### Symptom

Contact analysis using second-order tetrahedral elements (C3D10 or C3D10HS) as the secondary surface with node-to-surface formulation and hard contact produces convergence problems and poor contact pressure predictions. The analysis may abort or produce non-physical contact pressures. The contact forces at corner nodes are zero or negative.

### Root Cause

"Second-order tetrahedral elements (C3D10 and C3D10HS) have zero contact force at their corner nodes. This combination of second-order triangular secondary facets, a node-to-surface contact formulation, and strict enforcement of 'hard' contact conditions is disallowed to avoid a high likelihood of convergence problems and poor predictions of contact pressures." A constant pressure applied to the face of a second-order element without a midface node produces forces at the corner nodes acting in the opposite sense of the pressure. "Abaqus/Standard bases important decisions for the node-to-surface contact formulation on contact forces acting on individual secondary nodes; the ambiguous nature of the nodal forces in second-order elements can cause Abaqus/Standard to make a wrong decision."

### Fix

1. **Use surface-to-surface contact formulation**:
   - "Use the surface-to-surface contact formulation (generally recommended)"
   - "Instead of the node-to-surface contact formulation"
   - This is the primary recommended fix
   - Surface-to-surface handles second-order elements correctly

2. **Use penalty constraint enforcement method**:
   - "Use the penalty constraint enforcement method (generally recommended)"
   - "Or augmented Lagrange constraint enforcement method"
   - "Instead of strict enforcement of hard contact"
   - The penalty method allows some penetration and is more robust

3. **Use modified tetrahedral elements (C3D10M)**:
   - Use C3D10M instead of C3D10
   - C3D10M has modified formulation
   - Better suited for contact analysis
   - With node-to-surface formulation

4. **Let Abaqus auto-convert elements**:
   - "Abaqus/Standard automatically converts most three-dimensional second-order elements with no midface node"
   - "(i.e., serendipity elements) that form a secondary surface into elements with a midface node"
   - "C3D20(RH) → C3D27(RH), C3D15(H) → C3D15V(H), S8R5 → S9R5, M3D8 → M3D9"
   - But C3D10 is NOT auto-converted — you must use the fixes above

5. **Use first-order elements for contact surfaces**:
   - If possible, use first-order elements (C3D8 or C3D4)
   - For the secondary surface
   - First-order elements don't have the corner node zero force issue
   - But may require finer mesh

6. **Specify penalty method for coupled-field elements**:
   - "Abaqus/Standard does not convert second-order coupled temperature-displacement"
   - "Coupled thermal-electrical-structural, and coupled pore pressure-displacement elements"
   - "Specify a penalty or augmented Lagrange constraint enforcement method"
   - "To approximate hard pressure-overclosure behavior"

### Community Report

> "Second-order tetrahedral elements (C3D10 and C3D10HS) have zero contact force at their corner nodes. This combination of second-order triangular secondary facets, a node-to-surface contact formulation, and strict enforcement of 'hard' contact conditions is disallowed. Use the surface-to-surface contact formulation (generally recommended) instead of the node-to-surface contact formulation. Use the penalty constraint enforcement method (generally recommended) or augmented Lagrange constraint enforcement method instead of strict enforcement of hard contact."

## 3. Initial Overclosure Interference Fit Too Large for Single Increment

### Symptom

Contact analysis with initial overclosure (interference fit) aborts in the first increment. The error message indicates the interference fit is too large to be resolved in a single increment. The analysis can't establish initial contact conditions. The overclosure may be intentional (press-fit assembly) or unintentional (mesh discretization error).

### Root Cause

"Abaqus/Standard optionally interprets initial overclosures as interference fits. You should use one of the methods discussed above to remove any initial overclosures that are an unintended result of mesh discretization or errors in defining contact surfaces. In some cases the interference fit may be intended but may be too large to be resolved robustly with the method that is used by default for contact pairs in Abaqus/Standard (which is to resolve overclosures in a single increment)." For general contact, "they are automatically resolved over multiple increments."

### Fix

1. **Remove unintended overclosures**:
   - "Remove any initial overclosures that are an unintended result of mesh discretization"
   - "Or errors in defining contact surfaces"
   - Use contact initialization to adjust secondary surface positions
   - Ensure all secondary nodes start in contact without penetration

2. **Use general contact for automatic multi-increment resolution**:
   - "If you choose to have initial overclosures treated as interference fits for general contact"
   - "They are automatically resolved over multiple increments"
   - Switch from contact pairs to general contact
   - For automatic interference fit resolution

3. **Modify contact model for multi-increment resolution**:
   - "In this situation you should modify the contact model"
   - "To allow resolution of overclosures over multiple increments"
   - Use `*CONTACT INTERFERENCE` with shrink fit
   - This resolves the interference gradually

4. **Use contact initialization data**:
   - "Abaqus/Standard adjust the position of the secondary surface"
   - "To ensure that all secondary nodes that should initially be in contact"
   - "Start out in contact without any penetration"
   - Use `*CONTACT INITIALIZATION DATA` with ADJUST

5. **Specify precise clearance/overclosure for small-sliding**:
   - "When an intended initial clearance or overclosure is small"
   - "Compared to typical dimensions of the bodies in contact"
   - "And a small-sliding contact pair is used"
   - "You can specify the clearance or overclosure precisely"

6. **Check for incorrect surface normals**:
   - "Specifying incorrect surface normals can cause the contact initialization algorithm"
   - "To interpret a physical gap as a penetration"
   - Verify surface normals are correct
   - Especially for shell-like surfaces

7. **Resolve overclosures in multiple increments**:
   - For contact pairs, use `*CONTACT INTERFERENCE, SHRINK FIT`
   - This tells Abaqus to resolve the interference over multiple increments
   - Instead of trying to resolve it in a single increment
   - Which is the default for contact pairs

### Community Report

> "In some cases the interference fit may be intended but may be too large to be resolved robustly with the method that is used by default for contact pairs in Abaqus/Standard (which is to resolve overclosures in a single increment). In this situation you should modify the contact model to allow resolution of overclosures over multiple increments. If you choose to have initial overclosures treated as interference fits for general contact, they are automatically resolved over multiple increments."

## 4. Hard Contact Overconstraint from Direct Enforcement Method

### Symptom

Contact analysis using hard contact with the direct enforcement method produces overconstraint errors. The analysis aborts with "OVERCONSTRAINT CHECKS" messages. 3D self-contact with node-to-surface discretization is not available with directly enforced hard contact. The solver reports too many constraints.

### Root Cause

"Because of its strict interpretation of contact constraints, hard contact simulations utilizing the direct enforcement method are susceptible to overconstraint issues. As a result, directly enforced hard contact is not available for contact pairs defined using three-dimensional self-contact with node-to-surface discretization." The direct enforcement method uses Lagrange multipliers to strictly enforce zero penetration. When multiple constraints act on the same node (e.g., in self-contact or complex contact topologies), the constraints can be incompatible, creating overconstraints that the solver can't resolve.

### Fix

1. **Use the penalty method**:
   - "The penalty method approximates hard pressure-overclosure behavior"
   - "With this method the contact force is proportional to the penetration distance"
   - "So some degree of penetration will occur"
   - "Numerical softening associated with the penalty method can mitigate overconstraint issues"

2. **Use augmented Lagrange method**:
   - "The augmented Lagrange method applies only to hard pressure-overclosure relationships"
   - "Abaqus/Standard finds a converged solution with the penalty method"
   - "If a secondary node penetrates by more than a specified tolerance"
   - "The contact pressure is augmented and another series of iterations is executed"

3. **Use softened pressure-overclosure relationship**:
   - "The direct method can be used to model softened contact behavior"
   - "Regardless of the type of contact formulation"
   - "Modeling stiff interface behavior with a contact formulation"
   - "That is prone to overconstraints can be difficult"

4. **Switch to surface-to-surface discretization**:
   - For 3D self-contact
   - Use surface-to-surface instead of node-to-surface
   - Surface-to-surface is less prone to overconstraints
   - And handles self-contact better

5. **Use general contact**:
   - General contact uses the penalty method by default
   - And handles complex contact topologies better
   - Switch from contact pairs to general contact
   - For models with complex self-contact

6. **Reduce penalty stiffness**:
   - "The low initial penalty stiffness typically results in better convergence"
   - "Of the Newton iterations and better robustness"
   - "While the higher final stiffness keeps the overclosure at an acceptable level"
   - Specify a lower penalty stiffness for difficult contact

7. **Use reduced penalty stiffness in first increment**:
   - "An approach that tends to improve convergence behavior"
   - "Is to use a reduced penalty stiffness in the early iterations of the first increment"
   - "And return to the default penalty stiffness for the final iterations"
   - This helps establish initial contact conditions

### Community Report

> "Because of its strict interpretation of contact constraints, hard contact simulations utilizing the direct enforcement method are susceptible to overconstraint issues. Directly enforced hard contact is not available for contact pairs defined using three-dimensional self-contact with node-to-surface discretization. The penalty method approximates hard pressure-overclosure behavior. Numerical softening associated with the penalty method can mitigate overconstraint issues and reduce the number of iterations required."

## 5. Surface Mesh Crack Causing Node Stuck Behind Main Surface

### Symptom

Contact analysis with finite-sliding, node-to-surface or surface-to-surface contact produces convergence problems. A secondary node slides along the main surface and gets "stuck" behind the main surface through a crack in the faceted representation. The analysis may abort with excessive penetration or unexpected opening errors.

### Root Cause

"If viewed with the default plotting options in Abaqus/CAE, this surface will appear to be a valid, continuous surface; however, if this surface is used as the main surface for finite-sliding, node-to-surface contact, a secondary node sliding along the surface may fall through this crack and get 'stuck' behind the main surface. Similar problems can occur for finite-sliding, surface-to-surface contact. Typically, convergence problems will result." The main surface appears continuous in the CAE viewport but has small gaps or cracks between facets due to mesh discretization. A secondary node can slip through these cracks during sliding, getting trapped behind the surface.

### Fix

1. **Repair the main surface mesh**:
   - Check the main surface for gaps or cracks
   - Refine the mesh to close gaps
   - Ensure the surface is continuous
   - Use the mesh module to verify surface continuity

2. **Use surface-to-surface contact**:
   - "Similar problems can occur for finite-sliding, surface-to-surface contact"
   - But surface-to-surface is generally more robust
   - Than node-to-surface for faceted surfaces
   - It considers the entire facet, not just individual nodes

3. **Use small-sliding tracking**:
   - Small-sliding tracking is less sensitive
   - To surface mesh discontinuities
   - Because it computes contact based on initial geometry
   - Rather than tracking sliding along the surface

4. **Refine the main surface mesh**:
   - Finer mesh = smaller gaps between facets
   - Reduces the chance of nodes falling through
   - Especially in high-curvature regions
   - Where gaps are most likely

5. **Smooth the main surface**:
   - Use surface smoothing
   - In the contact pair definition
   - This creates a smoother representation
   - Reducing the chance of cracks

6. **Check surface normals**:
   - Ensure all surface normals point consistently
   - Inconsistent normals can create apparent cracks
   - Use the normals display in Abaqus/CAE
   - To verify and fix normal directions

7. **Use general contact**:
   - General contact is more tolerant
   - Of surface mesh imperfections
   - Than contact pairs
   - Consider switching for complex geometries

### Community Report

> "If viewed with the default plotting options in Abaqus/CAE, this surface will appear to be a valid, continuous surface; however, if this surface is used as the main surface for finite-sliding, node-to-surface contact, a secondary node sliding along the surface may fall through this crack and get 'stuck' behind the main surface. Similar problems can occur for finite-sliding, surface-to-surface contact. Typically, convergence problems will result."

## 6. Additional Abaqus Contact Issues

### Nonmatched Surface Meshes with Second-Order Heat Transfer Elements

**Issue**: "Inaccurate local results may occur if second-order heat transfer elements are used to model a thermal interface and the meshes do not match."
**Fix**: "Use first-order elements or use a more refined mesh." The worst results occur when the midside node of one surface is closest to the corner node of the other.

### Contact Diagnostics Tool

**Issue**: Need to track contact status changes during analysis.
**Fix**: "The diagnostics tool in Abaqus/CAE provides a good overview of how contact conditions evolve throughout a simulation. It reports contact change calculations in every iteration. The data file offers a more detailed summary of the overall contact conditions."

### Augmented Lagrange Penetration Tolerance

**Issue**: How to control penetration in augmented Lagrange method.
**Fix**: "In the Penetration tolerance field, select Absolute and enter a value, or select Relative and enter the ratio of the allowable penetration to the characteristic contact surface face dimension. The default value is 0.001."

### Linear Perturbation Penalty Stiffness

**Issue**: Penalty stiffness in linear perturbation procedures.
**Fix**: "For linear perturbation procedures the default penalty stiffness is constant and equal to 100 times the representative underlying element stiffness, independent of the penalty stiffness used in the base state."

### Substructure Surface Element Zero Stiffness

**Issue**: "If surface elements have been used to define a contact surface on the exterior of a substructure, Abaqus/Standard interprets the underlying element stiffness to be zero."
**Fix**: This can lead to difficulty in determining the default penalty stiffness. Specify penalty stiffness manually for substructure contact surfaces.

### Tied Contact Pair Second-Order Elements

**Issue**: "Abaqus/Standard does not convert second-order serendipity elements if the secondary surface is used in a tied contact pair."
**Fix**: Use first-order elements for tied contact pairs. Or use the penalty method instead of hard contact for tied pairs with second-order elements.

### Contact Force Error Reporting

**Issue**: Need to check contact force errors.
**Fix**: "For the default contact convergence criteria, the diagnostics tool shows the maximum penetration error and the maximum estimated contact force error; these determine whether the contact conditions have converged."

### Overclosure Outside Contacting Regions

**Issue**: "You may notice overclosures during unconverged iterations for nodes or constraint points that are located outside of the regions that are contacting in a converged state."
**Fix**: These are typically not problematic. They occur during the iterative process and resolve as the solution converges. Focus on overclosures in the actual contact regions.

## Best Practices

1. **Use surface-to-surface formulation** — handles second-order elements correctly
2. **Use penalty method for difficult contact** — mitigates overconstraint issues
3. **Check SDI trends with diagnostics** — if tending to zero, increase SDI limit
4. **Use small-sliding tracking when applicable** — easier to converge than finite-sliding
5. **Remove unintended initial overclosures** — use contact initialization ADJUST
6. **Use general contact for interference fits** — auto-resolves over multiple increments
7. **Use C3D10M instead of C3D10 for contact** — modified formulation for contact
8. **Refine main surface mesh to close cracks** — prevents node stuck behind surface
9. **Use contact stabilization for initial convergence** — damping helps establish contact
10. **Check surface normals for shell-like surfaces** — incorrect normals cause false overclosures
