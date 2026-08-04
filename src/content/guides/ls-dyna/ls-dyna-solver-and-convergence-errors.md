---
title: "LS-DYNA Solver and Convergence Errors"
excerpt: "LS-DYNA Solver and Convergence Errors: symptoms, root causes, and step-by-step fixes, verified against LS-DYNA Answers and Google Groups."
category: "troubleshooting"
softwareSlug: "ls-dyna"
keyword: "LS-DYNA constraint contact crash double-sided constraint penalty contact nonlinear solver failed find equilibrium implicit explicit alternative out of range residual instability timestep reduction ISNAN diagnosis negative eigenvalues MF2 initialization error material model solver change convergence problems penetrations contact model checking IGNORE parameter"
slug: "ls-dyna-solver-and-convergence-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://lsdyna.ansys.com/when-the-constraint-contact-is-used-the-calculation-crashes-during-the-forming-analysis-what-needs-to-be-done-to-prevent-this/"
  - "https://lsdyna.ansys.com/convergence/"
  - "https://groups.google.com/g/ls-dyna2/c/zHJ5X9jWo5o"
---

# LS-DYNA Solver and Convergence Errors: Constraint Contact Crash from Double-Sided Constraint Requiring Penalty Contact on One Side, Nonlinear Solver Failed to Find Equilibrium from Implicit Analysis Requiring Explicit Alternative, Out of Range Residual from Instability Requiring Timestep Reduction and ISNAN Diagnosis, Negative Eigenvalues MF2 Initialization Error from Material Model Requiring Solver or Material Change, and Convergence Problems from Penetrations and Contact Requiring Model Checking and IGNORE Parameter

LS-DYNA's constraint contact, implicit solver, residual handling, eigenvalue computation, and contact penetration produce errors from double-sided constraints, implicit convergence, instabilities, material model issues, and contact setup. This guide covers the 5 most common LS-DYNA problems with diagnostic steps and community-verified fixes from LS-DYNA Answers and Google Groups.

## 1. Constraint Contact Crash from Double-Sided Constraint

### Symptom

Using constraint contact in a forming analysis. The calculation crashes during the forming analysis. The mesh becomes distorted. The crash occurs specifically when constraint contact is used on both sides of the blank sheet.

### Root Cause

"There is a limitation in the constraint method. It is not permitted to have constrained contact on both sides of the blank sheet for the same element at the same time. In this case, the mesh will be distorted." The constraint contact method constrains nodes to satisfy contact conditions. When both sides of a blank sheet use constraint contact for the same element simultaneously, the constraints conflict, causing mesh distortion and calculation crash.

### Fix

1. **Use penalty contact on one side**:
   - "It is suggested that, at least for one side of the blank, the commonly used penalty contact is used"
   - Keep constraint contact on one side (e.g., the punch side)
   - Use penalty contact on the other side (e.g., the die side)
   - This avoids the double-sided constraint conflict

2. **Use penalty contact on both sides**:
   - If constraint contact is not specifically required
   - Use penalty contact on both sides
   - Penalty contact is more stable for forming simulations
   - It allows some penetration but doesn't crash

3. **Check contact type compatibility**:
   - Verify the contact types used on each side
   - Ensure they are compatible
   - Use *CONTACT_FORMING_ONE_WAY_SURFACE_TO_SURFACE for forming
   - Or *CONTACT_AUTOMATIC_ONE_WAY_SURFACE_TO_SURFACE

4. **Verify mesh quality**:
   - Check element quality before running
   - Ensure no initially penetrating contacts
   - Use Model Checking in LS-PrePost
   - Fix mesh distortions before analysis

### Community Report

> "When the constraint contact is used, the calculation crashes during the forming analysis. There is a limitation in the constraint method. It is not permitted to have constrained contact on both sides of the blank sheet for the same element at the same time. In this case, the mesh will be distorted. It is suggested that, at least for one side of the blank, the commonly used penalty contact is used."

## 2. Nonlinear Solver Failed to Find Equilibrium from Implicit Analysis

### Symptom

Running an implicit analysis with CNRBs at both ends of a box. Applied rotation around the y-axis via *BOUNDARY_PRESCRIBED_MOTION_NODE. Error: "Nonlinear solver failed to find equilibrium." The help manual mentions prescribed motion can only be done by implicit analysis, but the calculation fails.

### Root Cause

"Convergence problems in (static) non-linear implicit finite element analyses can arise in any FE-solver." The implicit solver tries to find static equilibrium at each time step. With prescribed rotation on CNRB nodes, the solver may struggle to converge due to: large rotations causing geometric nonlinearity, contact changes during rotation, or the CNRB constraint creating a singular stiffness matrix. The prescribed motion on nodes creates reaction forces that the solver can't balance.

### Fix

1. **Use *BOUNDARY_PRESCRIBED_MOTION_RIGID instead**:
   - "This can be applied to the rigid body (CNRB) directly"
   - "Works in explicit analysis"
   - Replace *BOUNDARY_PRESCRIBED_MOTION_NODE with _RIGID
   - This applies motion to the rigid body, not individual nodes

2. **Use *LOAD_BODY_GENERALIZED**:
   - "Can specify angular velocity/acceleration"
   - "Works well with explicit analysis"
   - "More stable than direct rotation prescription"
   - Apply angular velocity instead of prescribed motion

3. **Use *LOAD_NODE_POINT**:
   - "Apply moments directly to create rotation"
   - "May need to carefully control the loading rate"
   - Apply moments instead of prescribed displacement
   - This may converge better in implicit

4. **Use *DEFINE_CURVE and *LOAD_RIGID_BODY**:
   - "Define the rotation curve"
   - "Apply it to the rigid body"
   - This is an alternative to prescribed motion
   - May work better with implicit solver

5. **Switch to explicit analysis**:
   - "I want to use explicit analysis, is there another way?"
   - If implicit convergence fails consistently
   - Switch to explicit analysis
   - Use mass scaling to speed up quasi-static analysis

6. **Use *DATABASE_BNDOUT for reaction moments**:
   - "Do you have the *Database_BNDOUT?"
   - "That's the card you would need to be able to pull moment"
   - Add *DATABASE_BNDOUT to output boundary forces and moments
   - This works with both implicit and explicit

7. **Use CONSTRAINED_EXTRA_NODE instead of CNRB**:
   - "CONSTRAINED_EXTRA_NODE needs to be used instead of CNRB"
   - For extracting reaction moments
   - *BOUNDARY_PRESCRIBED_MOTION_RIGID outputs moment in binout
   - But *BOUNDARY_PRESCRIBED_MOTION_NODE does not

### Community Report

> "I set up CNRBs at both ends and applied rotation via BOUNDARY_PRESCRIBED_MOTION_NODE. Nonlinear solver failed to find equilibrium. Use BOUNDARY_PRESCRIBED_MOTION_RIGID instead — it can be applied to the rigid body directly and works in explicit analysis. Or use LOAD_BODY_GENERALIZED for angular velocity. CONSTRAINED_EXTRA_NODE needs to be used instead of CNRB for reaction moment output."

## 3. Out of Range Residual from Instability

### Symptom

Running a time history analysis using implicit FE code. After some seconds of applying ground motion, the analysis terminates with: "Stop iterations due to out of range residual." The error occurs partway through the analysis.

### Root Cause

"The 'out-of-range residual implicit ls-dyna' message may indicate an instability in LS-DYNA." The residual forces become excessively large, exceeding the solver's numerical range. This is typically caused by: element distortion, contact instability, material failure creating free nodes, or excessive mass increase from mass scaling. The ground motion loading creates dynamic effects that the implicit solver can't handle.

### Fix

1. **Use the latest version of LS-DYNA**:
   - "Use the latest version of LS-DYNA"
   - Newer versions have improved numerical stability
   - Check for updates
   - Bug fixes may address the issue

2. **Reduce the timestep scale factor**:
   - "Reduce the timestep scale factor"
   - Set DT2MS on *CONTROL_TIMESTEP to a smaller value
   - This makes the solver take smaller steps
   - More stable but slower

3. **Set ISNAN=1 in *CONTROL_SOLUTION**:
   - "Set ISNAN=1 in *CONTROL_SOLUTION to identify node IDs where out-of-range forces first appear"
   - This diagnostic flag identifies the problematic nodes
   - Check the nodes for constraint or contact issues
   - Fix the root cause at those nodes

4. **Try hourglass type 4 with coefficient 0.05**:
   - "Try hourglass type 4 with a coefficient of 0.05"
   - Set QH=4 on *HOURGLASS
   - Set QM=0.05
   - This controls hourglass energy modes

5. **Avoid type 2 solids**:
   - "Avoid type 2 solids"
   - Use ELFORM=1 (constant stress) or ELFORM=-1 for solids
   - Type 2 (full integrated) can be less stable
   - Check element formulation on *SECTION_SOLID

6. **Set bucket sort cycles to zero**:
   - "Set the number of cycles between bucket sorts to zero"
   - Set BSCT=0 on *CONTACT
   - This forces bucket sorting every cycle
   - More accurate contact detection

7. **Eliminate loads and contacts one by one**:
   - "Eliminate loads and/or contacts, one by one, to identify the trigger"
   - Remove contacts and rerun
   - Add them back one at a time
   - Identify which contact causes the instability

8. **Reduce the loading rate**:
   - "Try reducing the loading rate"
   - Slow down the ground motion application
   - Use a longer analysis time
   - This helps the implicit solver converge

9. **Write plot states frequently**:
   - "Write plot states frequently"
   - Set DT on *DATABASE_BINARY_D3PLOT to a small value
   - This captures the state before the crash
   - Helps diagnose the issue

### Community Report

> "I am doing a time history analysis using implicit FE code. After some seconds of applying ground motion, it terminated with 'Stop iterations due to out of range residual.' Things to try: Use the latest version, reduce the timestep scale factor, set ISNAN=1 in *CONTROL_SOLUTION to identify node IDs, try hourglass type 4 with 0.05 coefficient, avoid type 2 solids, set bucket sort cycles to zero, eliminate loads and contacts one by one, reduce the loading rate."

## 4. Negative Eigenvalues MF2 Initialization Error from Material Model

### Symptom

Running quasi-static cyclic load on RC column with implicit dynamics. Error: "Warning 60124 (IMP+124) 1 negative eigenvalues detected. Error 60109 (IMP+109) terminating: MF2 Initialization error 0." Error occurs towards the end of the simulation. First two-thirds work fine with good convergence. No element erosions. Using MAT024 with stress-strain curve.

### Root Cause

"Error occurred during initialization or factorization process with MF2 direct sparse solver." The negative eigenvalue indicates that the stiffness matrix has become non-positive-definite. This can happen when: material softening creates negative tangent stiffness, the material model's stress-strain curve has incorrect conversion from etan to curve input, or the MF2 solver can't handle the matrix condition. "When I run the same model with MAT Plastic Kinematics, I managed to get a Normal Termination. However, the error occurs whenever I used MAT024 with a stress-strain curve."

### Fix

1. **Use a different solver**:
   - "You might consider using a different solver"
   - Change LSOLVR on *CONTROL_IMPLICIT_SOLVER
   - Try LSOLVR=1 (direct sparse) or LSOLVR=4 (BCS)
   - The MF2 solver may not handle the matrix condition

2. **Check MAT024 stress-strain curve conversion**:
   - "I suggest converting your *mat_003 data (eg. etan=1000) to a simple *mat_024 data"
   - "Please check for a correct conversion from etan to two point stress-strain input"
   - Verify the stress-strain curve is correctly defined
   - Check for negative slopes or discontinuities

3. **Use MAT Plastic Kinematics (MAT003)**:
   - "When I run the same model with MAT Plastic Kinematics, I managed to get a Normal Termination"
   - If MAT024 causes issues, try MAT003
   - MAT003 is simpler and more stable
   - May be sufficient for the analysis

4. **Deactivate material failure**:
   - "Material damage/failure defined by *MAT_ADD_{EROSION/DAMAGE_...} keywords can be deactivated globally by setting MAEF=1 on *CONTROL_MAT"
   - If failure criteria are active, deactivate them
   - Element erosion can cause convergence problems
   - Get a working model without failure first

5. **Check for material softening**:
   - Negative eigenvalues often come from material softening
   - Check if the stress-strain curve has softening (negative slope)
   - Remove softening or use a regularized softening model
   - This prevents negative tangent stiffness

6. **Use implicit to explicit switching**:
   - "Automatically switching from implicit to explicit analysis"
   - Use *CONTROL_IMPLICIT_AUTO to switch
   - When implicit fails, switch to explicit
   - This can handle material failure better

### Community Report

> "Running quasi-static cyclic load on RC column with implicit dynamics. Warning: 1 negative eigenvalues detected. Error: MF2 Initialization error 0. When I run the same model with MAT Plastic Kinematics, I get Normal Termination. The error occurs with MAT024 and a stress-strain curve. Consider using a different solver. Check for correct conversion from etan to stress-strain input. Deactivate material failure by setting MAEF=1 on *CONTROL_MAT."

## 5. Convergence Problems from Penetrations and Contact

### Symptom

Implicit analysis has convergence problems. The relative displacement norm is "jumping up and down" and slowly decreasing. Convergence is obtained after many iterations (68+). This behavior occurs for many implicit time steps. Normal termination is obtained but with poor convergence quality.

### Root Cause

"Convergence problems in (static) non-linear implicit finite element analyses can arise in any FE-solver. The reason is that finding static equilibrium in a non-linear FE analysis (involving contacts, material non-linearity possibly including material failure, and large deformations) is very difficult." Contact penetrations cause sudden stiffness changes that the solver struggles to resolve. Each penetration resolution creates a discontinuity in the stiffness matrix, causing the convergence norm to jump.

### Fix

1. **Set NLPRINT=3 on *CONTROL_IMPLICIT_SOLUTION**:
   - "It is recommended to set NLPRINT=3 on *CONTROL_IMPLICIT_SOLUTION"
   - "In order to obtain detailed information on the progress of the convergence"
   - Check d3hsp and mes* files
   - Monitor displacement norm, energy norm, and force residual

2. **Use Model Checking in LS-PrePost**:
   - "Use the built-in tools of your preprocessor"
   - "In LS-PrePost, from the main menu bar select Application"
   - "Go to Model Checking and then General Checking"
   - Check for penetrations before submitting

3. **Set IGNORE=-2 for single-surface contact**:
   - "If much bigger penetrations than expected are reported"
   - "One possible remedy could be to set IGNORE=-2"
   - "In case the contact is of single-surface type"
   - This ignores initial penetrations

4. **Set PENMAX for tetrahedral elements**:
   - "If tetrahedral elements are involved"
   - "Try specifying a reasonably small contact search depth"
   - "By the PENMAX variable on Optional Card B"
   - This limits the contact search distance

5. **Check initial penetration report**:
   - "It is good practice to check this initial report"
   - "To confirm that penetrations reported are in line with expectations"
   - Compare with preprocessor checks
   - Fix unexpected penetrations

6. **Adjust convergence tolerances**:
   - "DCTOL is the displacement relative convergence tolerance"
   - "ECTOL is the energy relative convergence tolerance"
   - "RCTOL is the residual force relative tolerance"
   - "Convergence is detected if all criteria are met"
   - Adjust tolerances on *CONTROL_IMPLICIT_SOLUTION

7. **Use line search**:
   - "The Line search information" in d3hsp
   - Line search helps with convergence
   - Set LSMTH on *CONTROL_IMPLICIT_SOLUTION
   - This helps the solver find the equilibrium path

8. **Deactivate failure criteria initially**:
   - "It may be wise to first obtain a working model without failure"
   - "And once this is established try if also material failure is feasible"
   - "Element erosion can lead to severe convergence problems"
   - Add failure after the model works

### Community Report

> "Convergence problems in non-linear implicit FE analyses can arise in any FE-solver. Set NLPRINT=3 on *CONTROL_IMPLICIT_SOLUTION for detailed convergence information. Use Model Checking in LS-PrePost. If much bigger penetrations than expected are reported, set IGNORE=-2 for single-surface contact. If tetrahedral elements are involved, specify a small contact search depth by PENMAX on Optional Card B. It may be wise to first obtain a working model without failure."

## 6. Additional LS-DYNA Issues

### Absolute Convergence Criteria

**Issue**: Convergence detected based on absolute criteria when residuals are small.
**Fix**: "Convergence may be detected based on an absolute criteria (a function of the model size and the tolerance ABSTOL). This helps in situations where residuals are small, for example if the model is just undergoing prescribed translation without any opposing forces."

### Arc-Length Method

**Issue**: Need to handle snap-through or snap-back behavior.
**Fix**: Use arc-length method on *CONTROL_IMPLICIT_SOLUTION. Set ARCCTL, ARCDIR, ARCLEN, ARCMTH parameters. This helps with unstable equilibrium paths.

### Auto Time Step Control

**Issue**: Fixed time step too large or too small.
**Fix**: Use *CONTROL_IMPLICIT_AUTO with IAUTO=1. Set ITEOPT (optimal iterations), ITEWIN (iteration window), DTMIN, DTMAX. The solver adjusts time step automatically.

### Dynamic Effects in Implicit

**Issue**: Need to include dynamic effects in implicit analysis.
**Fix**: Use *CONTROL_IMPLICIT_DYNAMICS with IMASS=1. Set GAMMA=0.60, BETA=0.38 (Newmark-beta). Define TDYBIR and TDYDTH for dynamic birth and death times.

## Best Practices

1. **Don't use constraint contact on both sides of a blank** — use penalty on at least one side
2. **Use BOUNDARY_PRESCRIBED_MOTION_RIGID for rotation on rigid bodies** — works in explicit
3. **Set ISNAN=1 to identify problematic nodes** — diagnoses out-of-range residual
4. **Check MAT024 stress-strain curve conversion from etan** — prevents negative eigenvalues
5. **Try different solvers if MF2 fails** — LSOLVR=1 or LSOLVR=4
6. **Deactivate material failure for initial model** — MAEF=1 on *CONTROL_MAT
7. **Set NLPRINT=3 for convergence diagnostics** — detailed progress in d3hsp
8. **Use Model Checking in LS-PrePost before submitting** — catch penetrations early
9. **Set IGNORE=-2 for unexpected initial penetrations** — single-surface contact
10. **Use auto time step control for implicit** — *CONTROL_IMPLICIT_AUTO with IAUTO=1
