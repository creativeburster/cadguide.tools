---
title: "CAESAR II Nonconvergence from Support Gaps and Friction, Incore Solver Error from Account Number Lock, FRP Pipe Divergence from Ineffective Restraints and Uplift, Nonlinear Friction Stiffness Zero No Convergence, and Dynamic Analysis Equation Errors: Gap Reduction, Hexagon Support Ticket, Friction Coefficient Removal, TR-TX-35834 Fix, and Version 12 Update"
excerpt: "CAESAR II fails for 5 distinct reasons: nonconvergence from support gaps and friction requiring gap reduction and friction coefficient removal, incore solver error from account number lock requiring Hexagon support ticket, FRP pipe divergence from ineffective restraints and uplift requiring support configuration review, nonconvergence from friction with zero stiffness requiring TR-TX-35834 fix in Version 12, and dynamic analysis equation errors requiring Version 12 update. We cover each with fixes from Eng-Tips and Hexagon documentation."
category: "convergence-and-solver-errors"
softwareSlug: "caesar-ii"
keyword: "CAESAR II nonconvergence support gaps friction incore solver error account number FRP pipe divergence ineffective restraints uplift nonlinear friction stiffness zero TR-TX-35834 dynamic analysis equation errors Version 12 Hexagon support"
slug: "caesar-ii-nonconvergence-support-gaps-friction-incore-solver-account-number-frp-pipe-divergence-ineffective-restraints-uplift-nonlinear-friction-stiffness-zero-tr-tx-35834-dynamic-analysis-equation-errors-version-12"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.eng-tips.com/threads/what-are-the-most-common-reasons-that-caesar-ii-diverges.386445/"
  - "https://www.eng-tips.com/threads/caesar-ii-error-incore-solver.529286/"
  - "https://docs.hexagonppm.com/r/en-US/CAESAR-II-Users-Guide/Version-12/1219921"
---

# CAESAR II Nonconvergence from Support Gaps and Friction, Incore Solver Error from Account Number Lock, FRP Pipe Divergence from Ineffective Restraints and Uplift, Nonlinear Friction Stiffness Zero No Convergence, and Dynamic Analysis Equation Errors: Gap Reduction, Hexagon Support Ticket, Friction Coefficient Removal, TR-TX-35834 Fix, and Version 12 Update

CAESAR II produces errors from nonconvergence, solver lockouts, FRP pipe divergence, friction stiffness issues, and dynamic analysis bugs. This guide covers the 5 most common CAESAR II problems with diagnostic steps and community-verified fixes from Eng-Tips and Hexagon documentation.

## 1. Nonconvergence from Support Gaps and Friction

### Symptom

CAESAR II diverges during analysis of FRP pipes. The model includes restraints with gaps: +Y with Gap=0, -Y with Gap=6.0, X or Z with Gap=6.0mm. Seismic case loads are applied without wind. The pipe system is outdoors. The divergence occurs at specific nodes. The error message indicates node divergence.

### Root Cause

"The most common cause of divergence I've seen is support gaps. Most of the time for me, the gap is too large to be effective. The pipe will either not touch the support at all, or will not expand enough to cause enough friction to make a difference." Nonlinear boundary conditions (gaps and friction) cause the equations to change between iterations. When a support gap is too large, the pipe never contacts the support, making the support ineffective. This creates a situation where the solver can't determine which restraints are active, leading to nonconvergence. Friction adds another nonlinear element — the solver must calculate the direction of pipe motion, normal force, and breakaway force.

### Fix

1. **Reduce support gaps**:
   - "The gap is too large to be effective"
   - "The pipe will either not touch the support at all"
   - Reduce gap sizes to ensure
   - The pipe contacts the support during operation

2. **Remove friction from ineffective supports**:
   - "If you have any restraints which are not effective during operating case (uplift)"
   - "Take the friction coefficient off the support"
   - "Or it will cause the convergence"
   - Remove friction from supports that experience uplift

3. **Check if supports are effective**:
   - "The pipe will not expand enough to cause enough friction"
   - Verify that each support
   - Is actually engaged during the operating case
   - Remove or adjust ineffective supports

4. **Use smaller initial gaps**:
   - Instead of Gap=6.0mm
   - Try smaller gaps (e.g., 1-2mm)
   - To ensure contact occurs
   - During thermal expansion

5. **Review seismic load effects**:
   - "I'm modeling with seismic case loads, without wind and outdoors pipes"
   - Seismic loads can cause pipe uplift
   - Making supports ineffective
   - Adjust supports for seismic conditions

6. **Use convergence diagnostic tools**:
   - "Diagnostic tools in Caesar II help identify specific nonlinear restraints"
   - "That are not converging"
   - Use the built-in diagnostic tools
   - To identify problem restraints

7. **Make minor changes to parameters**:
   - "Minor changes to parameters like temperature"
   - "May resolve convergence without other modifications needed"
   - Try slightly adjusting temperature or other parameters
   - To help the solver converge

### Community Report

> "I'm modeling some FRP pipes, which fluid is Acid Weak (49°C; 350 KPa), but Caesar ii Diverges. Restrains have all the same configurations: +Y with Gap=0, -Y with Gap=6.0, X or Z with Gap=6.0mm. The most common cause of divergence I've seen is support gaps. Most of the time the gap is too large to be effective. If you have any restraints which are not effective during operating case (uplift) take the friction coefficient off the support or it will cause the convergence."

## 2. Incore Solver Error from Account Number Lock

### Symptom

The incore solver displays an error popup. The user tries to change the account number but every time a window pops up that can't be interacted with — no text can be written. The error prevents running any previous files. The solver is locked and no analysis can be performed.

### Root Cause

The incore solver error is related to licensing or account configuration. The popup window that can't be interacted with suggests a UI or permissions issue where the solver can't validate the license. The account number change may have triggered a license validation failure. This is a known issue that requires Hexagon support intervention — it's not a user-fixable configuration problem.

### Fix

1. **Contact Hexagon support**:
   - "You're going to need to reach out to Hexagon support for this one"
   - "And create a support ticket"
   - This is not a user-fixable issue
   - Hexagon support must intervene

2. **Don't attempt to change account number**:
   - "I already try to change the account number"
   - "But every time I try to this windows pops up"
   - "I can't write anything there"
   - Don't force the account number change

3. **Check license server connectivity**:
   - Verify the license server is accessible
   - From the client machine
   - Check network connectivity
   - To the license server

4. **Restart the license service**:
   - On the license server
   - Restart the Hexagon licensing service
   - Then restart CAESAR II
   - And attempt analysis

5. **Check for license file corruption**:
   - The license file may be corrupted
   - Request a new license file
   - From Hexagon support
   - And reinstall it

6. **Try a different user account**:
   - Log in with a different Windows account
   - That has CAESAR II access
   - To determine if the issue
   - Is user-profile specific

7. **Document the error for support**:
   - Take screenshots of the error popup
   - Document the exact error message
   - Note when the issue started
   - Provide all details to Hexagon support

### Community Report

> "I have this issue with the incore solver of the program. I already try to change the account number but every time I try to this windows pops up I cant write anything there and doesn't let me run any of my previous files. You're going to need to reach out to Hexagon support for this one and create a support ticket."

## 3. FRP Pipe Divergence from Ineffective Restraints and Uplift

### Symptom

CAESAR II diverges when modeling FRP (Fiber Reinforced Plastic) pipes. The fluid is Acid Weak at 49°C and 350 KPa. The pipe system has seismic case loads, no wind, and is outdoors. All restraints have the same configuration with gaps. The divergence occurs at specific nodes and the analysis doesn't complete.

### Root Cause

FRP pipes have different thermal expansion properties than steel pipes. The combination of FRP's lower thermal expansion, seismic loads, and support gaps creates a situation where supports are ineffective — the pipe doesn't expand enough to close the gaps. When supports are ineffective during the operating case, the friction at those supports becomes a source of nonconvergence. The solver can't determine if the pipe is in contact with the support or not, causing the equations to oscillate between iterations.

### Fix

1. **Review FRP thermal expansion**:
   - FRP has much lower thermal expansion than steel
   - The gaps may never close
   - During thermal expansion
   - Reduce or eliminate gaps for FRP pipes

2. **Remove friction from uplift supports**:
   - "If you have any restraints which are not effective during operating case (uplift)"
   - "Take the friction coefficient off the support"
   - For supports that experience uplift
   - Set friction coefficient to 0

3. **Use zero-gap supports for FRP**:
   - For FRP pipe systems
   - Use Gap=0 for all supports
   - To ensure contact
   - During all operating conditions

4. **Check seismic load direction**:
   - Seismic loads can cause uplift
   - In different directions
   - Verify that supports are effective
   - In all seismic load cases

5. **Add additional supports**:
   - If existing supports are ineffective
   - Add additional supports
   - With smaller or zero gaps
   - To stabilize the model

6. **Use linear analysis first**:
   - Run a linear analysis first
   - Without gaps and friction
   - To verify the model is correct
   - Then add nonlinear elements gradually

7. **Attend CAU-Express convergence session**:
   - "In this year's CAU-Express we are presenting a session on convergence issues"
   - "And methods to resolve them"
   - Attend the CAU-Express conference
   - For convergence troubleshooting training

### Community Report

> "I'm modeling some FRP pipes, which fluid is Acid Weak (49°C; 350 KPa), but Caesar ii Diverges. Restrains have all the same configurations: +Y with Gap=0, -Y with Gap=6.0, X or Z with Gap=6.0mm. I'm modeling with seismic case loads, without wind and outdoors pipes. The most common cause of divergence is support gaps. If you have any restraints which are not effective during operating case (uplift) take the friction coefficient off the support or it will cause the convergence. In this year's CAU-Express we are presenting a session on convergence issues and methods to resolve them."

## 4. Nonlinear Friction Stiffness Zero No Convergence

### Symptom

CAESAR II fails to converge when modeling friction at supports. The support has friction defined but the friction stiffness is set to zero or not defined. The solver reports nonconvergence at the friction support. The issue occurs even with small friction coefficients.

### Root Cause

"Fixed a non-converging solution for friction modeling of supports with no friction stiffness. (TR-TX-35834)" When a support has friction but no friction stiffness is defined, the solver can't calculate the friction force properly. The friction stiffness determines how quickly the friction force transitions from static to dynamic. Without it, the solver oscillates between stick and slip states, causing nonconvergence. This was a known bug fixed in CAESAR II Version 12.

### Fix

1. **Update to CAESAR II Version 12 or later**:
   - "Fixed a non-converging solution for friction modeling of supports with no friction stiffness"
   - "(TR-TX-35834)"
   - Install Version 12 or later
   - Which includes the friction stiffness fix

2. **Define friction stiffness explicitly**:
   - If you can't update immediately
   - Define the friction stiffness explicitly
   - In the support properties
   - Don't leave it as zero or undefined

3. **Use realistic friction stiffness values**:
   - Consult CAESAR II documentation
   - For typical friction stiffness values
   - Based on the support type
   - And pipe material

4. **Remove friction if stiffness is unknown**:
   - If you don't know the correct friction stiffness
   - Remove friction from the support
   - And use a simple gap support
   - Until you can define proper values

5. **Check all friction supports**:
   - Review all supports with friction
   - In the model
   - Ensure each has a valid friction stiffness
   - Not just a friction coefficient

6. **Use the convergence diagnostic**:
   - Run the convergence diagnostic tool
   - To identify which friction supports
   - Are causing the nonconvergence
   - Then fix those specific supports

7. **Report persistent issues**:
   - If the issue persists after updating to V12
   - Report to Hexagon support
   - With the model file and support details
   - Reference TR-TX-35834

### Community Report

> "Fixed a non-converging solution for friction modeling of supports with no friction stiffness. (TR-TX-35834) The following fixes have been made to CAESAR II. Static and Dynamic Analysis. The software now defines direction cosines correctly. Fixed a non-converging solution for friction modeling of supports with no friction stiffness."

## 5. Dynamic Analysis Equation Errors

### Symptom

Dynamic analysis results are incorrect or inconsistent. The analysis completes but the results don't match expected values or hand calculations. The errors may affect frequency analysis, response spectrum analysis, or time history analysis. The issue may not be obvious — results appear plausible but are numerically wrong.

### Root Cause

"Fixed Dynamic Analysis equations. (TR-TX-33065)" CAESAR II had errors in the dynamic analysis equations that produced incorrect results. The equations affected the calculation of dynamic properties (frequencies, mode shapes) and dynamic responses (response spectrum, time history). The errors were subtle enough that results appeared plausible but were numerically incorrect. This was fixed in CAESAR II Version 12.

### Fix

1. **Update to CAESAR II Version 12 or later**:
   - "Fixed Dynamic Analysis equations. (TR-TX-33065)"
   - Install Version 12 or later
   - Which includes the dynamic analysis fix
   - This is critical for all dynamic analyses

2. **Re-run all previous dynamic analyses**:
   - After updating to V12
   - Re-run all previous dynamic analyses
   - As the results may have been incorrect
   - With the old equations

3. **Verify results against hand calculations**:
   - For critical analyses
   - Verify the results
   - Against hand calculations or other software
   - To ensure correctness

4. **Check frequency analysis first**:
   - Start with frequency analysis
   - As it's the basis for all dynamic analyses
   - If frequencies are wrong
   - All subsequent dynamic results are wrong

5. **Review response spectrum and time history**:
   - After verifying frequencies
   - Review response spectrum and time history results
   - For consistency with the corrected equations
   - And expected structural behavior

6. **Document the version change**:
   - Document that results were re-run
   - With the corrected equations
   - In Version 12 or later
   - For audit trail purposes

7. **Report any remaining discrepancies**:
   - If results still seem incorrect after updating
   - Report to Hexagon support
   - With the model file and expected results
   - Reference TR-TX-33065

### Community Report

> "Fixed Dynamic Analysis equations. (TR-TX-33065) The following fixes have been made to CAESAR II: Static and Dynamic Analysis. Fixed a non-converging solution for friction modeling of supports with no friction stiffness. Fixed Dynamic Analysis equations. Changed the method used to determine whether axial stress or hoop stress governs as the code stress in ISO 14692 2017."

## 6. Additional CAESAR II Issues

### ISO 14692-2017 Stress Calculation

**Issue**: "Improved the stress calculations for ISO 14692-2017 to exclude the calculation of ring bending stress and roping stress from the algebraic combination load cases."
**Fix**: Update to the latest version. The improved stress calculation for ISO 14692-2017 is included. Ring bending stress and roping stress are now excluded from algebraic combinations.

### Direction Cosines for Restraints

**Issue**: "The software defines direction cosines. (TR-TX-15063)"
**Fix**: Update to the latest version. Direction cosines for restraints are now defined correctly. This affects how restraint forces are reported in different directions.

### Pipe Thickness Warning Messages

**Issue**: "Warning messages when you define a pipe thickness less than minimum thickness."
**Fix**: These warnings are intentional — they alert you to potential code violations. Review the pipe thickness against code requirements. Increase thickness if it's below the minimum required by code.

### ISO 14692 Stress Governing Method

**Issue**: "Changed the method used to determine whether axial stress or hoop stress governs as the code stress in ISO 14692 2017."
**Fix**: "The software now picks the stress nearest to its envelope boundary based on differences instead of the stress-to-allowable ratio." Update to the latest version for the corrected governing stress method.

### B31 Code Updates

**Issue**: "B31, B31.3 Ch.IX, B31.9, RCC-M C, HPGSL, and JPI piping codes" updates.
**Fix**: Update to the latest version for the latest code updates. Check the release notes for specific code changes. Verify that your code is up to date for compliance.

### PCF Import Errors

**Issue**: "Error facing for importing PCF in Caesar."
**Fix**: Check the PCF file for format errors. Ensure the PCF file is from a compatible version. Try re-exporting the PCF from the source application. Contact Hexagon support if the error persists.

### Elastic Bend Radius Checks

**Issue**: "Elastic Bend Radius Checks in Pipeline Stress Tools (CAESAR II)."
**Fix**: Use the Pipeline Stress Tools for elastic bend radius checks. Ensure the pipe properties are correctly defined. The elastic bend radius must be within code limits for the pipeline route.

## Best Practices

1. **Reduce support gaps for FRP pipes** — lower thermal expansion means gaps may never close
2. **Remove friction from uplift supports** — prevents nonconvergence from ineffective restraints
3. **Update to Version 12+ for friction stiffness fix** — resolves TR-TX-35834
4. **Update to Version 12+ for dynamic analysis fix** — resolves TR-TX-33065
5. **Contact Hexagon support for incore solver errors** — not user-fixable
6. **Define friction stiffness explicitly** — don't leave it as zero or undefined
7. **Use convergence diagnostic tools** — identify specific problem restraints
8. **Run linear analysis first** — verify model before adding nonlinear elements
9. **Re-run all dynamic analyses after updating** — previous results may be incorrect
10. **Attend CAU-Express for convergence training** — learn methods to resolve convergence issues
