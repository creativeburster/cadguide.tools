---
title: "MSC Adams HHT Solver Hmin Error from Contact-Heavy Models, Acceleration Computation Failed to Converge from Self-Written Contact Subroutines, GSTIFF Corrector Failures at Small Step Sizes from Ill-Conditioned Jacobian, Discontinuities from MIN MAX IF Functions Causing Corrector Failures, and Native Solids Contact Instability from Faceting Tolerance Gaps: ADAPTIVITY Parameter, Model Debug, SI2 Formulation, Discontinuity Removal, and Faceting Adjustment"
excerpt: "MSC Adams fails for 5 distinct reasons: HHT solver Hmin error from contact-heavy models requiring ADAPTIVITY parameter, acceleration computation failed to converge from self-written contact subroutines requiring model debug, GSTIFF corrector failures at small step sizes from ill-conditioned Jacobian requiring SI2 formulation, discontinuities from MIN MAX IF functions causing corrector failures requiring discontinuity removal, and native solids contact instability from faceting tolerance gaps requiring faceting adjustment. We cover each with fixes from Adams community and solver guide."
category: "troubleshooting"
softwareSlug: "msc-adams"
keyword: "MSC Adams HHT solver Hmin error contact-heavy models acceleration computation failed converge self-written contact subroutines GSTIFF corrector failures small step size ill-conditioned Jacobian discontinuities MIN MAX IF functions native solids contact instability faceting tolerance"
slug: "msc-adams-hht-hmin-contact-acceleration-converge-subroutines-gstiff-corrector-small-step-discontinuity-native-solids-faceting"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://help-be.hexagonmi.com/bundle/Adams_2021.0.2_Adams_Solver_User_Guide/raw/resource/enus/Adams_2021.0.2_Adams_Solver_User_Guide.pdf"
  - "https://nexus.hexagon.com/community/public/adams/f/adams-community-forum/145769/hht-solver-hmin-error"
  - "https://nexus.hexagon.com/community/public/adams/f/adams-community-forum/145186/simulation-error-urgent-help-is-needed"
---

# MSC Adams HHT Solver Hmin Error from Contact-Heavy Models, Acceleration Computation Failed to Converge from Self-Written Contact Subroutines, GSTIFF Corrector Failures at Small Step Sizes from Ill-Conditioned Jacobian, Discontinuities from MIN MAX IF Functions Causing Corrector Failures, and Native Solids Contact Instability from Faceting Tolerance Gaps: ADAPTIVITY Parameter, Model Debug, SI2 Formulation, Discontinuity Removal, and Faceting Adjustment

MSC Adams produces errors from HHT solver failures, acceleration convergence, corrector failures, discontinuities, and contact instability. This guide covers the 5 most common Adams problems with diagnostic steps and community-verified fixes from Adams community and solver guide.

## 1. HHT Solver Hmin Error from Contact-Heavy Models

### Symptom

When running the HHT solver for an Adams/View model, the simulation errors because the minimum step size (Hmin) is reached. The step size is reasonable (around 1E-5 / 1E-6) but then hits the minimum. Reducing Hmin doesn't solve the issue as the solver reaches the new Hmin value and errors. The model is contact-heavy. The issue doesn't occur with GSTIFF.

### Root Cause

"Setting the parameter ADAPTIVITY=1e-9 (a parameter under the INTEGRATOR statement) typically prevents this from happening without any ill effects. Adaptivity defaults to 100*HMIN but as HMIN is so small for HHT, it barely helps without explicitly setting it to something meaningful (like typical_timestep/1000)." The HHT solver has a very small default Hmin, which makes the default adaptivity (100*HMIN) too small to be effective. Without explicit adaptivity, the solver can't adapt the step size when contact events cause stiffness changes, leading to the Hmin error.

### Fix

1. **Set ADAPTIVITY parameter**:
   - "Setting the parameter ADAPTIVITY=1e-9"
   - "Typically prevents this from happening"
   - "Without any ill effects"
   - Set ADAPTIVITY under INTEGRATOR

2. **Set ADAPTIVITY to typical_timestep/1000**:
   - "Adaptivity defaults to 100*HMIN"
   - "But as HMIN is so small for HHT"
   - "It barely helps without explicitly setting it"
   - "To something meaningful (like typical_timestep/1000)"
   - Set to meaningful value

3. **Use GSTIFF as alternative**:
   - "I've never encountered this with GSTIFF"
   - Use GSTIFF integrator
   - As alternative to HHT

4. **Upgrade to Adams 2023.3**:
   - "In 2023.2 (I think) adaptivity was introduced"
   - "In the C++ solver"
   - "Upgrade to 2023.3 which is more stable"
   - And have improved solver features

5. **Check contact definition**:
   - "How do you define the contacts"
   - "Are you using parasolids, native parts"
   - Check contact definition
   - Method

6. **Use parasolids instead of native solids**:
   - "When I substitute 3 of the parasolids"
   - "With native solids the model is even more unstable"
   - Use parasolids
   - For more stable contact

7. **Adjust solver error**:
   - "The only work around I have found"
   - "Is adjusting the solver error"
   - Adjust solver error
   - As workaround

### Community Report

> "I am running the HHT solver for an ADAMS/View model. The simulation errors because the minimum step size is reached. Reducing Hmin does not solve the issue. The model is contact-heavy. Setting the parameter ADAPTIVITY=1e-9 typically prevents this from happening without any ill effects. Adaptivity defaults to 100*HMIN but as HMIN is so small for HHT, it barely helps without explicitly setting it to something meaningful like typical_timestep/1000."

## 2. Acceleration Computation Failed to Converge from Self-Written Contact Subroutines

### Symptom

The simulation fails with "ERROR: Time 0.000000E+00: Acceleration computation failed to converge after 25 iterations." The error references "Part/100 Z Force" with a large imbalance. Changing the maximum iterations gives the same error. Changing the integrator type gives the same error. The model uses self-written subroutines for contact detection.

### Root Cause

"Clearly something is wrong in your model. PART/100 is defined in the .adm file. This file should be in the working directory. The model works for some specific conditions however the error occurs for some conditions." The self-written contact subroutines have a bug that causes the acceleration computation to fail for certain conditions. The subroutine may produce invalid forces or discontinuities that prevent convergence.

### Fix

1. **Check the .adm file for PART/100**:
   - "PART/100 is defined in the .adm file"
   - "This file should be in the working directory"
   - "Otherwise create it by doing"
   - "File > Export > Adams Solver Dataset + ok"
   - Check the .adm file

2. **Debug self-written subroutines**:
   - "I use self-written subroutines"
   - "For contact detection"
   - Debug the subroutines
   - For invalid forces

3. **Check mass and inertia properties**:
   - "Check mass and inertia properties"
   - "To ensure they are valid"
   - Verify mass and inertia
   - Are correct

4. **Verify units**:
   - "Make sure the choice of units"
   - "Is appropriate for the system"
   - "Systems that have very small inertias"
   - "May benefit from small force units"
   - Check units

5. **Check motion generators**:
   - "Check that motion generators are valid"
   - "And no redundant constraints exist"
   - Verify motion generators
   - And constraints

6. **Check impact functions**:
   - "Check if impact functions"
   - "Caused a strange response"
   - "Verify properties"
   - Check impact functions

7. **Use GSTIFF SI2 formulation**:
   - "ADAMS GSTIFF integrator"
   - "With SI2 formulation"
   - Use SI2 for
   - Better accuracy

### Community Report

> "Running my ADAMS simulation, I get the following error: ERROR: Time 0.000000E+00: Acceleration computation failed to converge after 25 iterations. Equation with the largest imbalance: Part/100 Z Force. I use self-written subroutines for contact detection. The model works for some specific conditions however I get the mentioned error for some conditions. PART/100 is defined in the .adm file."

## 3. GSTIFF Corrector Failures at Small Step Sizes from Ill-Conditioned Jacobian

### Symptom

GSTIFF I3 integrator encounters corrector failures at small step sizes. The corrector failures occur when the step size is reduced during the simulation. The Jacobian matrix becomes ill-conditioned at small steps. The issue causes the simulation to fail.

### Root Cause

"You can encounter corrector failures at small step sizes. These occur because the Jacobian matrix is a function of the inverse of the step size and becomes ill-conditioned at small steps." The GSTIFF I3 formulation's Jacobian matrix includes a term that is inversely proportional to the step size. As the step size decreases, this term grows, making the Jacobian matrix ill-conditioned and causing corrector failures.

### Fix

1. **Use GSTIFF SI2 formulation**:
   - "Corrector failures that small step sizes cause"
   - "Occur less frequently than with GSTIFF I3"
   - "Singular matrices due to small step sizes"
   - "Occur less frequently"
   - Use SI2

2. **Control HMAX for constant step size**:
   - "Control HMAX so that the integrator"
   - "Runs at a constant step size"
   - "And runs consistently at a high order (three or more)"
   - Set HMAX

3. **Set HINIT=HMAX**:
   - "Try setting HINIT=HMAX"
   - Set initial step size
   - Equal to maximum
   - For consistency

4. **Don't let integrator step over events**:
   - "Don't let the integrator step over important events"
   - "Short duration events like an impulse"
   - "Can be captured by setting HMAX"
   - "To value less than impulse width"
   - Set HMAX for events

5. **Use SI2 for contact and friction models**:
   - "Recommended for models where velocity"
   - "Or high frequency accuracy might be important"
   - "Common examples include models with contact or friction"
   - Use SI2 for contact

6. **Accept 25-100% slower for SI2**:
   - "Is typically 25% to 100% slower"
   - "Than regular GSTIFF"
   - "When run with the same error"
   - Accept slower speed

7. **Ensure smooth velocity inputs**:
   - "Requires that all velocity inputs be differentiable"
   - "Non-smooth motions cause failures"
   - "In the SI2 formulation"
   - Ensure smooth inputs

### Community Report

> "GSTIFF I3: You can encounter corrector failures at small step sizes. These occur because the Jacobian matrix is a function of the inverse of the step size and becomes ill-conditioned at small steps. GSTIFF SI2: Is very robust and stable at small step sizes. Corrector failures that small step sizes cause occur less frequently than with GSTIFF I3. Singular matrices due to small step sizes occur less frequently."

## 4. Discontinuities from MIN MAX IF Functions Causing Corrector Failures

### Symptom

The simulation fails with corrector failures. The model uses discontinuous functions such as MIN, MAX, DIM, MOD, or IF. The corrector failures occur at the points of discontinuity. The issue is the root cause of most simulation failures.

### Root Cause

"Discontinuities are the root cause of most simulation failures. Examples of discontinuous functions: MIN, MAX, DIM, MOD, IF. Discontinuous displacements and velocities cause corrector failures. Discontinuous accelerations cause integration failures (requires infinite force). Discontinuous forces cause corrector failures." Discontinuous functions create discontinuities in the force or acceleration, which the integrator can't handle. The corrector tries to converge at the discontinuity point but fails because the function value jumps.

### Fix

1. **Remove discontinuous functions**:
   - "Discontinuities are the root cause"
   - "Of most simulation failures"
   - Remove MIN, MAX, DIM, MOD, IF
   - From the model

2. **Use smooth approximations**:
   - Replace discontinuous functions
   - With smooth approximations
   - Such as STEP or BISTOP functions
   - For transitions

3. **Use STEP function instead of IF**:
   - Use STEP function
   - For smooth transitions
   - Instead of IF
   - For conditional logic

4. **Check for discontinuous forces**:
   - "Discontinuous forces cause corrector failures"
   - Check all force definitions
   - For discontinuities
   - And replace with smooth functions

5. **Check for discontinuous motions**:
   - "Non-smooth motions, which theoretically"
   - "Cause infinite accelerations"
   - "Cause failures in the SI2 formulation"
   - Use smooth motions

6. **Use contact with penetration**:
   - "Contacts should penetrate before statics"
   - "Models with impacts should have"
   - "Slight penetration in model position"
   - "When doing statics"
   - Allow slight penetration

7. **Perform initial static first**:
   - "Perform initial static first, when applicable"
   - "A static solution may be more difficult"
   - "Than a dynamic solution"
   - Run static first

### Community Report

> "Discontinuities are the root cause of most simulation failures. Examples of discontinuous functions: MIN, MAX, DIM, MOD, IF. Discontinuous displacements and velocities cause corrector failures. Discontinuous accelerations cause integration failures (requires infinite force). Discontinuous forces cause corrector failures. Contacts should penetrate before statics. Models with impacts should have slight penetration in model position when doing statics."

## 5. Native Solids Contact Instability from Faceting Tolerance Gaps

### Symptom

When substituting parasolids with native solids for contact definition, the model becomes more unstable. Contact forces become noisier with native solids. The contact behavior reverses and parts are jammed together. The issue is counter to expectations that native solids would be more stable.

### Root Cause

"Native solids getting out of hand may be due to the faceting_tolerance that you are using (possibly default?). If one surface is very complex there may be gaps in the faceting (even if it is considered a solid). In my case this made the contact to reverse and the parts were jammed together, very weird I know." Native solids use faceted geometry for contact calculation. If the faceting tolerance is too coarse, gaps appear in the faceted representation of complex surfaces. These gaps cause the contact detection to fail, resulting in reversed contact forces and parts jamming together.

### Fix

1. **Adjust faceting_tolerance**:
   - "Native solids getting out of hand"
   - "May be due to the faceting_tolerance"
   - "That you are using (possibly default?)"
   - Adjust faceting tolerance

2. **Use parasolids instead of native solids**:
   - "When I substitute 3 of the parasolids"
   - "With native solids the model is even more unstable"
   - Use parasolids
   - For more stable contact

3. **Check for gaps in faceting**:
   - "If one surface is very complex"
   - "There may be gaps in the faceting"
   - "Even if it is considered a solid"
   - Check for faceting gaps

4. **Use finer faceting for complex surfaces**:
   - For complex surfaces
   - Use finer faceting
   - To avoid gaps
   - In the contact geometry

5. **Verify contact direction**:
   - "This made the contact to reverse"
   - "And the parts were jammed together"
   - Verify contact direction
   - Is correct

6. **Use Impact-based contact**:
   - Use Impact-based
   - 3D flex-rigid and flex-flex contact
   - With all friction models
   - For better stability

7. **Use flex body contact softening**:
   - "A new softening factor for contact stiffness"
   - "And damping helps compensate for artificial stiffening"
   - "When flexible-body contact is distributed across many nodes"
   - Use softening factor

### Community Report

> "When I substitute 3 of the parasolids with native solids (washer and two bushings) the model is even more unstable and the contact forces are noisier (counter to what I was expecting according to MSC contact presentations). Native solids getting out of hand may be due to the faceting_tolerance that you are using. If one surface is very complex there may be gaps in the faceting. In my case this made the contact to reverse and the parts were jammed together."

## 6. Additional Adams Issues

### Solver Settings Tuner

**Issue**: "The Solver Settings Tuner automatically generates a solver settings workspace that enables users to compare, evaluate, and update solver parameters."
**Fix**: Use Solver Settings Tuner in Adams 2026.1 for optimal solver parameters. Compare tuning results in Excel for analysis.

### Flex Body Contact Softening

**Issue**: "A new softening factor for contact stiffness and damping helps compensate for artificial stiffening when flexible-body contact is distributed across many nodes."
**Fix**: Use flex body contact softening in Adams 2026.1. Supports Impact-based 3D flex-rigid and flex-flex contact with all friction models.

### Contact Penetration Before Statics

**Issue**: "Contacts should penetrate before statics. All tires should penetrate the road."
**Fix**: Ensure slight penetration in model position before static analysis. For tire models, ensure all tires penetrate the road.

### Initial Static Analysis

**Issue**: "Perform initial static first, when applicable. Note that a static solution may be more difficult to find than a dynamic solution."
**Fix**: Run static analysis first. If static fails, increase error tolerance or skip static and go directly to dynamic.

### Static Iterations Check

**Issue**: "15-20 static iterations is suspect."
**Fix**: Check static iteration count. If 15-20 iterations, investigate model for issues. Verify constraints and forces.

### Spikes in Results Output

**Issue**: "Spikes in results output may come from changes in step size."
**Fix**: Reduce HMAX to limit step size changes. Try setting HINIT=HMAX. Run with SI2 instead of I3.

### Redundant Constraints

**Issue**: "Check that motion generators are valid and no redundant constraints exist."
**Fix**: Check for redundant constraints in the model. Remove or modify redundant constraints. Verify motion generators.

## Best Practices

1. **Set ADAPTIVITY=1e-9 for HHT solver with contact** — prevents Hmin error
2. **Use GSTIFF SI2 for contact and friction models** — more robust at small step sizes
3. **Control HMAX for constant step size** — prevents corrector failures from step changes
4. **Remove discontinuous functions (MIN, MAX, IF)** — root cause of most simulation failures
5. **Use STEP function instead of IF for smooth transitions** — prevents discontinuities
6. **Use parasolids instead of native solids for contact** — more stable contact behavior
7. **Adjust faceting_tolerance for native solids** — prevents gaps in complex surfaces
8. **Ensure slight contact penetration before statics** — prevents static convergence issues
9. **Export .adm file to debug PART errors** — File > Export > Adams Solver Dataset
10. **Use Solver Settings Tuner in Adams 2026.1** — optimize solver parameters
