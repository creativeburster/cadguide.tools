---
title: "LS-DYNA Instability and Hourglass Errors"
excerpt: "LS-DYNA Instability and Hourglass Errors: symptoms, root causes, and step-by-step fixes, verified against LSTC support and ANSYS documentation."
category: "troubleshooting"
softwareSlug: "ls-dyna"
keyword: "LS-DYNA NaN velocities negative volume brick element contact penetration hourglass energy under-integrated mass scaling implicit non-convergence rigid body modes energy balance"
slug: "ls-dyna-instability-and-hourglass-errors"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://ftp.lstc.com/anonymous/outgoing/support/FAQ/instability.tips"
  - "https://www.dynasupport.com/faq/general/have-you-any-tips-on-how-to-to-combat-instability"
  - "https://ftp.lstc.com/anonymous/outgoing/support/FAQ/hourglass_condensed"
---

# LS-DYNA Instability and Hourglass Errors: NaN Velocities and Negative Volume from Contact Penetration, Hourglass Energy Exceeding 10% from Under-Integrated Elements, Mass Scaling Causing Excessive Added Mass, Implicit Non-Convergence from Loose Parts and Rigid Body Modes, and Energy Balance Not Close to 1.0

LS-DYNA explicit and implicit simulations fail from numerical instabilities, hourglass modes, mass scaling, and convergence issues. This guide covers the 5 most common LS-DYNA problems with diagnostic steps and community-verified fixes from LSTC support documentation and ANSYS help.

## 1. NaN Velocities and Negative Volume from Contact Penetration

### Error Messages

- "out-of-range velocities" (NaN — Not a Number)

### Symptom

The simulation terminates with NaN velocities. Brick elements develop negative volume. The d3hsp file shows out-of-range forces at specific nodes. The model was running fine until contact between two parts initiated.

### Root Cause

Contact penetration develops during the simulation — one part penetrates another without proper contact force response. This leads to element distortion, negative volumes in solid elements, and eventually NaN values in the velocity/force arrays.

### Diagnosis

1. **Write plot states frequently** — see the evolution of the instability:
   - Reduce the time between d3plot dumps
   - Plot velocity vectors in LS-PrePost (Vector > Velocity)
   - Identify which part or contact is responsible

2. **Check energy jumps** — steep jumps in matsum or sleout isolate the problematic part/contact

3. **Set ISNAN=1** in `*CONTROL_SOLUTION`:
   - Identifies node IDs where out-of-range forces first appear
   - Pinpoints the origin of the instability

4. **Run double precision** — compare single vs double precision results:
   - If results differ significantly, precision is affecting the solution
   - Use the same version of LS-DYNA for both runs

### Fix

1. **Switch to AUTOMATIC contacts with SOFT=1**:
   ```
   *CONTACT_AUTOMATIC_SURFACE_TO_SURFACE
   ... SOFT=1 ...
   ```
   - SOFT=1 is preferred over SOFT=0, especially for dissimilar materials
   - Use SOFT=2 for contact surfaces with sharp corners

2. **Adjust bucket sort interval**:
   - Set number of cycles between bucket sorts to zero (use default)
   - If relative velocity between parts is exceptionally high, reduce bucket sort interval to 5, 2, or 1

3. **Account for shell thickness in mesh**:
   - Ensure the mesh takes into account shell thickness
   - For very thin shells (< 1 mm), scale up or set contact thickness to a reasonable value

4. **Avoid redundant contact definitions**:
   - Don't treat contact between the same two parts with more than one contact definition
   - Redundant contacts cause inconsistent forces

5. **Remove all `*DAMPING_GLOBAL` commands**:
   - Or confirm a reasonable damping coefficient is used
   - Excessive damping can cause instabilities

6. **Reduce time step scale factor (TSSFAC)**:
   - Try reducing TSSFAC (even if mass-scaling is invoked with DT2MS)
   - Sweet spot is generally between 0.5 and 0.9
   - Don't reduce below 0.1 — counterproductive, especially with SOFT=1 or 2

7. **Delete problematic elements**:
   - Use `*MAT_ADD_EROSION` for element failure criteria
   - Use ERODE in `*CONTROL_TIMESTEP` with DTMIN to delete elements based on time step reduction
   - Use PSFAIL in `*CONTROL_SOLID` for solid element failure

8. **Debug by process of elimination**:
   - Simplify the model until stability is achieved
   - Replace complex material models with simpler ones
   - Eliminate loads and contacts one by one to identify the trigger

### Community Report

> "Examples of messages that indicate an instability has occurred: 'out-of-range velocities' (aka NaNs), 'negative volume in brick element', 'termination due to mass increase'. It helps tremendously if you can identify the source of the instability."

## 2. Hourglass Energy Exceeding 10% from Under-Integrated Elements

### Symptom

Hourglass (HG) energy exceeds 10% of peak internal energy. The model shows nonphysical zero-energy deformation modes — elements "wiggle" without producing stress. The simulation runs but results are nonphysical.

### Root Cause

Under-integrated (single integration point) solid, shell, and thick shell elements develop hourglass modes — nonphysical, zero-energy modes of deformation that produce zero strain and no stress. The default hourglass control (type 1, viscous) is generally not the most effective.

### Diagnosis

1. **Enable hourglass energy reporting**:
   - Set HGEN=2 in `*CONTROL_ENERGY`
   - Use `*DATABASE_GLSTAT` for system HG energy
   - Use `*DATABASE_MATSUM` for per-part HG energy
   - Rule of thumb: HG energy should be < 10% of peak internal energy

2. **Visualize hourglass energy density**:
   - For shells: set SHGE=2 in `*DATABASE_EXTENT_BINARY`, then in LS-PrePost: Fcomp > Misc > hourglass energy
   - For solids: see HYDRO=4 in `*DATABASE_EXTENT_BINARY`

3. **Check deformed shapes** — look for classic hourglass patterns in elements

### Fix

1. **Use stiffness-based hourglass control (type 4)** for structural parts:
   ```
   *CONTROL_HOURGLASS
   ... IHQ=4 QM=0.03 ...
   ```
   - IHQ=4 with coefficient 0.03 for metal and plastic parts
   - More effective than viscous control (type 1) for structural applications

2. **Use shell formulation 16 with hourglass type 8**:
   - Replace under-integrated shell formulations with ELFORM=16
   - ELFORM=16 has built-in hourglass control
   - Set BWC=1 and PROJ=1 for B-T shells with primarily elastic response

3. **Use viscosity-based control for foams, rubbers, and fluids**:
   - IHQ=2 or 3 for foams and rubbers
   - Type 1 with coefficient 1E-3 for fluids
   - Stiffness-based control (type 4,5) causes overly stiff response in soft materials

4. **Use viscosity-based control for high-velocity impacts**:
   - Types 1,2,3 recommended even for solid/structural parts at high velocity
   - High explosives → high speed → viscous-based control

5. **Define part-specific hourglass cards**:
   - Use `*HOURGLASS` with HGID referenced in `*PART`
   - Override global hourglass definitions where appropriate
   - Be careful when importing validated barrier/head models

6. **Refine the mesh** — finer mesh reduces hourglassing:
   - Use at least two solid elements through the thickness of any solid part
   - Avoid type 2 solids (fully integrated) — expensive and unstable in large deformation

7. **Switch to fully-integrated or selectively-reduced (S/R) formulations**:
   - Eliminates hourglass concerns entirely
   - ELFORM -1 and -2 for solids (selectively reduced)
   - Downside: more expensive, type 2 solids prone to shear-locking and negative volumes

8. **Use pressure loading instead of nodal loading**:
   - Pressure loading is less likely to excite hourglassing modes
   - Loading individual nodes is more likely to trigger hourglassing

### Community Report

> "Hourglass modes are nonphysical, zero-energy modes of deformation that produce zero strain and no stress. They occur only in under-integrated (single integration point) solid, shell, and thick shell elements."

> "Stiffness-based HG control (types 4,5) is generally more effective than viscous HG control for structural parts. I like to reduce the HG coefficient to 0.03 to 0.05 to minimize nonphysical stiffening."

> "Hourglass energy < 10% of peak internal energy as a rule-of-thumb."

## 3. Mass Scaling Causing Excessive Added Mass

### Symptom

The simulation runs but mass scaling adds more than 1% of the physical mass. Results may be inaccurate due to inertia effects from the added mass. The GLSTAT file shows significant added mass.

### Root Cause

Mass scaling (DT2MS in `*CONTROL_TIMESTEP`) adds mass to small elements to increase the time step and reduce computation time. If DT2MS is too aggressive, the added mass becomes a significant fraction of the physical mass, affecting the dynamic response.

### Diagnosis

1. **Check added mass in GLSTAT**:
   - System added mass should be < 1% of physical mass
   - If > 1%, reduce mass scaling

2. **Check per-part added mass in MATSUM**:
   - Identify which parts have the most added mass
   - These parts have the smallest elements driving the time step

3. **Compare with and without mass scaling**:
   - Run a short simulation without mass scaling
   - Compare results to the mass-scaled run
   - If results differ significantly, mass scaling is affecting the solution

### Fix

1. **Reduce DT2MS** — use a smaller mass scaling target:
   - Start with a small value and increase gradually
   - Monitor added mass percentage in GLSTAT
   - Stop increasing when added mass approaches 1%

2. **Refine mesh selectively** — avoid very small elements:
   - Identify the smallest elements driving the time step
   - Remesh those areas with larger elements
   - This reduces the need for mass scaling

3. **Use selective mass scaling** — only scale specific parts:
   - Apply mass scaling only to non-critical parts
   - Don't scale parts where accurate dynamic response is needed

4. **Use stiffness-based mass scaling** (if available):
   - Some LS-DYNA versions offer alternative mass scaling methods
   - These may add less mass for the same time step increase

5. **Reduce TSSFAC instead of adding mass**:
   - Reducing TSSFAC to 0.6 or 0.7 can stabilize without mass scaling
   - But this increases computation time

6. **Check for sliver elements**:
   - Very thin or poorly shaped elements drive down the time step
   - Clean up the mesh to remove slivers
   - Use element quality checking tools in LS-PrePost

### Community Report

> "System added mass should be < 1% of physical mass (check GLSTAT)."

> "Try reducing the explicit time step scale factor TSSFAC (even if mass-scaling is invoked with DT2MS in *CONTROL_TIMESTEP). Reducing TSSFAC too aggressively, say to 0.1 or less, can be counterproductive."

## 4. Implicit Non-Convergence from Loose Parts and Rigid Body Modes

### Symptom

Implicit analysis fails to converge. The d3hsp file shows negative eigenvalue warnings. Parts of the model spin or drift unexpectedly. The model has unconnected sub-assemblies.

### Root Cause

Unconnected sub-assemblies or "loose parts" cause rigid body modes in implicit statics. Without proper constraints, these parts can move freely, preventing the solver from finding an equilibrium solution.

### Diagnosis

1. **Check for negative eigenvalue warnings** in d3hsp:
   - These indicate rigid body modes
   - Identify which DOFs are unconstrained

2. **Check model connectivity**:
   - Look for unconnected sub-assemblies
   - Verify all parts are properly connected through constraints, contacts, or tied contacts

3. **Check tied contacts**:
   - Ensure tracked nodes are properly tied
   - Too many ties cause rigid behavior, too few lead to loose connections
   - Use tracked node sets for better control than tracked part sets

4. **Check for initial penetrations**:
   - Use IGNORE=2 for Mortar contacts to handle initial penetrations
   - A penetration-free initial configuration is always preferred

### Fix

1. **Activate implicit dynamics** for intentional rigid body modes:
   ```
   *CONTROL_IMPLICIT_DYNAMICS
   ... IMASS=1 ...
   ```
   - Activates inertia during the initial phase until contacts are established
   - Solves convergence problems due to intentional rigid body modes

2. **Apply inertia relief boundary conditions**:
   ```
   *CONTROL_IMPLICIT_INERTIA_RELIEF
   ```
   - For models with intentional rigid body modes
   - Alternative to implicit dynamics

3. **Apply appropriate boundary conditions** for unintentional rigid body modes:
   - If the model has forgotten boundary conditions, simply apply them
   - Check that all parts are properly constrained

4. **Fix tied contacts**:
   - Use IPBACK > 0 on Optional Card E of `*CONTACT_TIED_` definitions
   - Creates penalty-based tied contact for nodes subjected to other constraints
   - Nodes with `*CONSTRAINED_NODAL_RIGID_BODY` or `*BOUNDARY_SPC` cannot be tied directly

5. **Check material models**:
   - Verify material input for parts that go unstable
   - Look for typos, bad units, or incorrect parameters
   - Test questionable material models with a small model first

6. **Switch to Full Newton solution**:
   - If convergence is slow, try Full Newton instead of modified Newton
   - More expensive per iteration but may converge in fewer iterations

7. **Activate non-symmetrical equation solver**:
   - For problems with non-symmetric stiffness matrices
   - Contact friction and certain material models create non-symmetry

8. **Convert to explicit analysis** — if implicit won't converge:
   - Some problems are inherently better suited to explicit
   - Dynamic problems with complex contact are often easier in explicit

### Community Report

> "Unconnected sub-assemblies or 'loose parts' cause rigid body modes in implicit statics, potentially causing convergence problems. One indication of this problem is negative eigenvalue warnings in the d3hsp file."

> "Set IMASS=1 on *CONTROL_IMPLICIT_DYNAMICS to activate implicit dynamics, at least during the initial phase, until contacts are fully established."

## 5. Energy Balance Not Close to 1.0

### Symptom

The energy ratio in GLSTAT is not close to 1.0. The total energy doesn't balance — internal energy + kinetic energy + hourglass energy + contact energy + work done ≠ total energy. This indicates energy is being created or destroyed nonphysically.

### Root Cause

Energy imbalance can come from: excessive hourglass energy, damping removing energy, contact energy issues, mass scaling adding energy, or element erosion removing energy.

### Diagnosis

1. **Enable energy computation**:
   ```
   *CONTROL_ENERGY
   ... HGEN=2 RWEN=2 SLLEN=2 STSEN=2 ...
   ```
   - Turn on all energy calculations
   - Check GLSTAT for the full energy balance

2. **Check individual energy components**:
   - Hourglass energy: should be < 10% of peak internal energy
   - Contact energy (no friction): should be relatively small
   - Contact energy (with friction): should be positive, not necessarily small
   - Added mass energy: check if mass scaling is adding energy

3. **Check for element erosion**:
   - Deleted elements remove internal energy from the system
   - This can cause the energy ratio to deviate from 1.0
   - Account for eroded energy in the balance

### Fix

1. **Reduce hourglass energy** — see Section 2:
   - Use stiffness-based HG control (type 4, coefficient 0.03)
   - Or switch to fully-integrated formulations

2. **Remove or reduce damping**:
   - Remove all `*DAMPING_GLOBAL` commands
   - Or confirm reasonable damping coefficients
   - Try `*DAMPING_PART_STIFFNESS` with COEF=0.1 or 0.05 for shell elements

3. **Fix contact energy issues**:
   - Use AUTOMATIC contacts to prevent penetration
   - Avoid redundant contact definitions
   - Check for initial penetrations — use IGNORE=1 for small initial penetrations

4. **Reduce mass scaling** — see Section 3:
   - Added mass changes the kinetic energy
   - Keep added mass < 1% of physical mass

5. **Account for eroded elements**:
   - If using element erosion, the eroded energy is removed from the system
   - This is expected behavior, not an error
   - Check the eroded energy in GLSTAT

6. **Check material model energy**:
   - Some material models can create or destroy energy
   - Test with a simpler material model to isolate the issue
   - Verify material parameters are correct

7. **Animate results to check for nonphysical behavior**:
   - Look for parts noticeably penetrating other parts
   - Check for elements flying off uncontrollably
   - Verify deformation patterns are physically reasonable

### Community Report

> "Energy ratio should remain close to 1.0. Hourglass energy < 10% of peak internal energy. If no contact friction, contact energy in GLSTAT should be relatively small. If contact friction is nonzero, contact energy should be positive and not necessarily small. System added mass should be < 1% of physical mass."

## 6. Additional LS-DYNA Issues

### Rigid Body Constraints

**Issue**: Constraints on nodes of rigid bodies cause conflicts.
**Fix**: Don't impose constraints on nodes of rigid bodies. Impose constraints on card 2 of `*MAT_RIGID` instead. Use reasonable elastic constants for `*MAT_RIGID` (e.g., steel) — affects contact stiffness unless SOFT=2.

### Bulk Viscosity for Bird Strike

**Issue**: Bird strike simulations have stability issues.
**Fix**: Increase bulk viscosity coefficients by a factor of 10 for bird material. Use type 1 hourglass control with coefficient 1E-3 for fluids.

### Time Step for Aerospace Impact

**Issue**: Aerospace impact simulations need smaller time steps.
**Fix**: Reduce time step scale factor to 0.6 or 0.7. Look at viscous-based hourglass control as first alternative.

### STL File Cannot Be Loaded (Optitex context)

**Issue**: STL files cannot be loaded in some applications.
**Fix**: Use FBX or other supported formats instead.

## Best Practices

1. **Use AUTOMATIC contacts with SOFT=1** — preferred over SOFT=0 for dissimilar materials
2. **Keep hourglass energy < 10% of internal energy** — use type 4 stiffness control with coefficient 0.03
3. **Keep added mass < 1% of physical mass** — monitor in GLSTAT
4. **Keep energy ratio close to 1.0** — check all energy components
5. **Use double precision to diagnose precision issues** — compare single vs double
6. **Set ISNAN=1 to identify instability origin** — pinpoints node IDs with NaN forces
7. **Debug by simplification** — replace complex materials, eliminate contacts one by one
8. **Use implicit dynamics (IMASS=1) for rigid body modes** — until contacts are established
9. **Avoid redundant contact definitions** — one contact per pair of parts
10. **Write plot states frequently** — to see the evolution of instabilities
