---
title: "LUSAS 23.0 Nonlinear Concrete fib Model Code 2010 Creep Shrinkage Fails to Converge, Structure with No Stress Fails to Converge Solver, Coupled Analysis Checkerboard Thermal Stress in Quadratic Elements, Fully Coupled Analysis Error in Data Transfer File, and Nonlinear Convergence from Load Increment Too Large and Stiff Element Round-Off: Iteration Increase, Stress-Free Model Check, Element Type Change, Cache Deletion, and Incrementation Adjustment"
excerpt: "LUSAS fails for 5 distinct reasons: Nonlinear concrete fib Model Code 2010 creep and shrinkage fails to converge requiring solver update, structure with no stress fails to converge requiring model review, coupled analysis checkerboard thermal stress in quadratic elements requiring element type change, fully coupled analysis error in Data Transfer File requiring cache deletion, and nonlinear convergence from load increment too large and stiff element round-off requiring incrementation adjustment. We cover each with fixes from LUSAS release notes and convergence checklist."
category: "solver-and-convergence-errors"
softwareSlug: "lusas"
keyword: "LUSAS 23.0 nonlinear concrete fib Model Code 2010 creep shrinkage fails converge structure no stress solver coupled analysis checkerboard thermal stress quadratic elements Data Transfer File cache load increment stiff element round-off"
slug: "lusas-23-0-nonlinear-concrete-fib-model-code-creep-shrinkage-converge-structure-no-stress-coupled-checkerboard-thermal-stress-quadratic-data-transfer-file-cache-load-increment-stiff-element"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.lusas.com/releases/v23.0/23.0-2/LUSAS%2023.0%20Error%20Fix%20and%20Modification%20Release%20Note.pdf"
  - "https://www.lusas.com/user_area/instruct/convergence_checklist.html"
  - "https://www.lusas.com/user_area/warning/failed_to_converge.html"
---

# LUSAS 23.0 Nonlinear Concrete fib Model Code 2010 Creep Shrinkage Fails to Converge, Structure with No Stress Fails to Converge Solver, Coupled Analysis Checkerboard Thermal Stress in Quadratic Elements, Fully Coupled Analysis Error in Data Transfer File, and Nonlinear Convergence from Load Increment Too Large and Stiff Element Round-Off: Iteration Increase, Stress-Free Model Check, Element Type Change, Cache Deletion, and Incrementation Adjustment

LUSAS produces errors from concrete model convergence, stress-free structures, thermal stress checkerboard, data transfer failures, and nonlinear incrementation. This guide covers the 5 most common LUSAS problems with diagnostic steps and community-verified fixes from LUSAS release notes and convergence checklist.

## 1. Nonlinear Concrete fib Model Code 2010 Creep Shrinkage Fails to Converge

### Symptom

When using the nonlinear concrete material model (109) with the 'fib Model Code 2010' creep and shrinkage model, the solver fails to converge. The analysis stops with a convergence failure message. The issue occurs specifically with the fib Model Code 2010 creep and shrinkage options, not with other concrete material models.

### Root Cause

"Nonlinear concrete (109) with 'fib Model Code 2010' creep and shrinkage fails to converge Solver." The fib Model Code 2010 creep and shrinkage model has a convergence issue in LUSAS 23.0. The creep and shrinkage calculations introduce additional nonlinearities that the solver's default iteration settings can't handle. The issue was fixed in LUSAS 23.0-2 (Kit Version 23.0-2c4).

### Fix

1. **Update to LUSAS 23.0-2 or later**:
   - "Nonlinear concrete (109) with 'fib Model Code 2010'"
   - "Creep and shrinkage fails to converge Solver"
   - Fixed in 23.0-2c4
   - Update to the latest kit

2. **Increase analysis iterations**:
   - "Increase the number of iterations permitted per increment"
   - "To 20-25 (Load case properties > Nonlinear > Set"
   - "> Solution strategy > 'Max number of iterations')"
   - Increase max iterations

3. **Use automatic nonlinear incrementation**:
   - "Change to automatic nonlinear incrementation"
   - "And increase the load more gradually"
   - Switch to automatic incrementation
   - For more gradual loading

4. **Reduce load increment**:
   - "If automatic incrementation is already being utilised"
   - "Reduce the load increment still further"
   - Reduce the starting load factor
   - In Load case properties > Nonlinear

5. **Check material properties**:
   - Verify all concrete material properties
   - Are correctly defined
   - For the fib Model Code 2010
   - Creep and shrinkage model

6. **Use full Newton-Raphson**:
   - "Make sure that full Newton-Raphson iterations"
   - "Are being used rather than modified"
   - Use full Newton-Raphson
   - For better convergence

7. **Enable line search**:
   - "Make sure that the line search method"
   - "Has not been switched off"
   - Enable line search
   - In Solution strategy > Advanced

### Community Report

> "Nonlinear concrete (109) with 'fib Model Code 2010' creep and shrinkage fails to converge Solver. Fixed in LUSAS 23.0-2c4. The LUSAS output file should be investigated in the first instance. If there are pivot or diagonal decay warnings these should be dealt with."

## 2. Structure with No Stress Fails to Converge Solver

### Symptom

A structure with no applied stress or load fails to converge in the LUSAS solver. The analysis stops with a convergence failure message even though no loads are applied. The issue occurs when the model has no stress-inducing loads but the nonlinear solver is still trying to iterate.

### Root Cause

"Structure with no stress fails to converge Solver." When a structure has no applied stress, the nonlinear solver may still attempt to iterate but can't converge because there's no equilibrium to find. The residual forces are essentially zero, but the convergence criteria may not be properly satisfied due to numerical precision issues. This was fixed in LUSAS 23.0-1.

### Fix

1. **Update to LUSAS 23.0-1 or later**:
   - "Structure with no stress fails to converge Solver"
   - Fixed in 23.0-1c3
   - Update to the latest kit

2. **Check for missing loads**:
   - Verify that loads
   - Are properly applied
   - To the structure
   - If loads were intended

3. **Remove unnecessary nonlinear settings**:
   - If the analysis is truly stress-free
   - Remove nonlinear settings
   - And use a linear analysis
   - Instead

4. **Check boundary conditions**:
   - Verify that boundary conditions
   - Are properly applied
   - To prevent rigid body motion
   - Which can cause convergence issues

5. **Review the LUSAS output file**:
   - "The LUSAS output file should be investigated"
   - "In the first instance"
   - Check the output file
   - For warnings and errors

6. **Check for pivot warnings**:
   - "If there are pivot or diagonal decay warnings"
   - "These should be dealt with"
   - Address pivot warnings
   - Before further analysis

7. **Verify model integrity**:
   - Check the model for
   - Disconnected nodes or elements
   - That may cause
   - Convergence issues

### Community Report

> "Structure with no stress fails to converge Solver. Fixed in LUSAS 23.0-1c3. The LUSAS output file should be investigated in the first instance. If there are pivot or diagonal decay warnings these should be dealt with."

## 3. Coupled Analysis Checkerboard Thermal Stress in Quadratic Elements

### Symptom

When performing a coupled analysis in LUSAS, checkerboard patterns appear in the thermal stress results for quadratic elements. The thermal stress distribution shows an alternating high-low pattern (checkerboard) that doesn't represent the physical behavior. The issue occurs specifically with quadratic elements in coupled analysis.

### Root Cause

"Coupled analysis: Checkerboard thermal stress in quadratic elements Solver." The coupled analysis solver had a numerical issue with quadratic elements that produced checkerboard patterns in thermal stress results. The quadratic element formulation didn't properly handle the thermal coupling, causing numerical oscillations in the stress calculation. This was fixed in LUSAS 23.0-1.

### Fix

1. **Update to LUSAS 23.0-1 or later**:
   - "Coupled analysis: Checkerboard thermal stress"
   - "In quadratic elements Solver"
   - Fixed in 23.0-1c3
   - Update to the latest kit

2. **Use linear elements as workaround**:
   - If you can't update immediately
   - Use linear elements
   - Instead of quadratic
   - To avoid the checkerboard pattern

3. **Refine the mesh**:
   - Refine the mesh
   - In the checkerboard area
   - To reduce the element size
   - And improve stress distribution

4. **Check thermal coupling settings**:
   - Verify the thermal coupling
   - Settings are correct
   - For the coupled analysis
   - To prevent numerical issues

5. **Verify stress results**:
   - After updating
   - Re-run the coupled analysis
   - And verify the thermal stress
   - No longer shows checkerboard

6. **Use fine integration**:
   - "Invoke the fine integration rule"
   - For elements that support it
   - To improve the integration
   - And reduce numerical issues

7. **Compare linear and quadratic results**:
   - Compare results
   - Between linear and quadratic elements
   - To verify the quadratic results
   - Are correct after the fix

### Community Report

> "Coupled analysis: Checkerboard thermal stress in quadratic elements Solver. Fixed in LUSAS 23.0-1c3. Elements that have poor aspect ratios (greater than 1:10) can produce significant difficulties in the nonlinear solution process."

## 4. Fully Coupled Analysis Error in Data Transfer File

### Symptom

When attempting to solve a fully coupled analysis in the LUSAS Modeller, an error message "Error in the Data Transfer File" appears. The analysis can't be started or completed. The issue occurs in the Modeller, not the Solver. Existing caches may also be incorrectly deleted after using the 'Now' option for Cache Results.

### Root Cause

"Unable to solve a fully coupled analysis in modeller. 'Error in the Data Transfer File' is seen Modeller. Existing caches are deleted after using 'Now' option for Cache Results Modeller." The Modeller had a bug in the data transfer file handling for fully coupled analyses. The data transfer between the thermal and structural solvers was corrupted, causing the error. The cache management for the 'Now' option also had a bug that incorrectly deleted existing caches.

### Fix

1. **Update to LUSAS 23.0-2 or later**:
   - "Unable to solve a fully coupled analysis in modeller"
   - "'Error in the Data Transfer File' is seen"
   - Fixed in 23.0-2c4
   - Update to the latest kit

2. **Check cache settings**:
   - "Existing caches are deleted"
   - "After using 'Now' option for Cache Results"
   - Avoid using the 'Now' option
   - If you need to preserve caches

3. **Use sequential coupling as workaround**:
   - If you can't update immediately
   - Use sequential coupling
   - Instead of fully coupled
   - To avoid the data transfer error

4. **Verify data transfer file**:
   - Check the data transfer file
   - For corruption
   - And regenerate if needed
   - Before re-running

5. **Clear all caches before analysis**:
   - Clear all existing caches
   - Before starting the coupled analysis
   - To prevent conflicts
   - With old cache data

6. **Check Modeller version**:
   - Verify the Modeller version
   - Is 23.0.1636.56115 or later
   - For the fix
   - To be applied

7. **Report persistent data transfer errors**:
   - If the error persists after updating
   - Report to LUSAS support
   - With the model file
   - And data transfer file

### Community Report

> "Unable to solve a fully coupled analysis in modeller. 'Error in the Data Transfer File' is seen Modeller. Existing caches are deleted after using 'Now' option for Cache Results Modeller. Fixed in LUSAS 23.0-2c4 (Modeller 23.0.1636.56115)."

## 5. Nonlinear Convergence from Load Increment Too Large and Stiff Element Round-Off

### Symptom

A nonlinear analysis in LUSAS fails to converge. The warning message "***WARNING*** CURRENT INCREMENT HAS FAILED TO CONVERGE (NONLCT PROCESSOR)" appears in the output file. The analysis may automatically reduce the step size and retry. The convergence failure occurs repeatedly, preventing the analysis from completing.

### Root Cause

"The load increment specified may be too large. If manual nonlinear incrementation has been selected, change to automatic nonlinear incrementation and increase the load more gradually. Relatively stiff elements can produce numerical round-off problems as well as propagate the effects of nonlinearity throughout a mesh in an uncontrolled manner." The most common causes of nonlinear convergence failure in LUSAS are: (1) load increments that are too large, causing the Newton-Raphson iterations to diverge; (2) stiff elements (like rigid links) that produce numerical round-off and propagate nonlinearity; and (3) poor element aspect ratios.

### Fix

1. **Use automatic nonlinear incrementation**:
   - "Change to automatic nonlinear incrementation"
   - "And increase the load more gradually"
   - Switch from manual to automatic
   - For more gradual loading

2. **Reduce load increment**:
   - "If automatic incrementation is already being utilised"
   - "Reduce the load increment still further"
   - Reduce the Starting load factor
   - In Load case properties > Nonlinear > Set > Incrementation

3. **Increase iterations per increment**:
   - "Increase the number of iterations permitted per increment"
   - "To 20-25"
   - In Load case properties > Nonlinear > Set
   - "> Solution strategy > Max number of iterations

4. **Use full Newton-Raphson**:
   - "Make sure that full Newton-Raphson iterations"
   - "Are being used rather than modified"
   - "(modified NR is the only option in MODELLER)"
   - Use full Newton-Raphson

5. **Enable line search**:
   - "Make sure that the line search method"
   - "Has not been switched off"
   - "Load case properties > Nonlinear > Set"
   - "> Solution strategy > Advanced > Max number of line searches"
   - Set max line searches to 5

6. **Reduce stiff element stiffness**:
   - "Relatively stiff elements can produce numerical round-off problems"
   - "Reducing the stiffness by one or two orders of magnitude"
   - "Can have significant effects on the convergence rate"
   - Reduce rigid link stiffness

7. **Check element aspect ratios**:
   - "Elements that have poor aspect ratios (greater than 1:10)"
   - "Can produce significant difficulties"
   - "In the nonlinear solution process"
   - Improve element aspect ratios

8. **Use fine integration**:
   - "Element mechanisms may have been excited"
   - "By the loading patterns"
   - "That may be eliminated by invoking the fine integration rule"
   - Enable fine integration

9. **Check convergence criteria**:
   - "Have the nonlinear convergence criteria been slackened?"
   - "The default setting for the displacement and residual norms"
   - "Should be used in general"
   - Use default convergence criteria

10. **Review residual norm behavior**:
    - "For increments that do not converge"
    - "The manner in which rdnrm behaves"
    - "Can provide valuable indicators"
    - Review the residual norm in the log file

### Community Report

> "The load increment specified may be too large. If manual nonlinear incrementation has been selected, change to automatic nonlinear incrementation and increase the load more gradually. Relatively stiff elements can produce numerical round-off problems as well as propagate the effects of nonlinearity throughout a mesh in an uncontrolled manner. Reducing the stiffness by one or two orders of magnitude can have significant effects on the convergence rate. Make sure that full Newton-Raphson iterations are being used rather than modified. Make sure that the line search method has not been switched off."

## 6. Additional LUSAS Issues

### Beam/Shell Slice Resultant Force Error

**Issue**: "Beam/shell slice resultants differ by 14.1% when a slice is taken at 45 degree angle to a strut longitudinal axis."
**Fix**: Fixed in 23.0-2c4. Use slices at 90 degrees to the axis for expected force. Be aware of the 14.1% difference at 45-degree slices.

### Cannot Use Copied Arbitrary Sections

**Issue**: "Cannot use copied arbitrary sections when creating a multiple varying section."
**Fix**: Fixed in 23.0-1c3. Don't copy arbitrary sections for multiple varying sections. Create new sections instead.

### Tendon Properties Dialog Slow

**Issue**: "Modeller takes longer than usual to apply changes made in the Tendon Properties dialog."
**Fix**: Fixed in 23.0-1c3. Update to the latest version. If slow, simplify tendon properties before applying.

### Two-Phase Reaction Vflo Issues

**Issue**: "Two-phase results: Issues with Reaction 'Vflo'."
**Fix**: Fixed in 23.0-2c4. Verify reaction results after updating. Compare with previous results if available.

### Hygro-Thermal Quadratic Elements

**Issue**: "Hygro-thermal quadratic elements should be available."
**Fix**: Fixed in 23.0-1c3. Hygro-thermal quadratic elements are now available. Use them for hygro-thermal analysis.

### Cable Tuning Analysis Load Doubling

**Issue**: "Radiation surface + deactivation/activation — gives wrong results when copying geometry with cable tuning analysis doubles the cable load."
**Fix**: Fixed in 23.0-2c4. Verify cable loads after copying geometry. Check for doubled loads before analysis.

### IFC Import with Cable Loadcases

**Issue**: "Importing IFC with cable — cable loadcases."
**Fix**: Fixed in 23.0-1c3. Verify cable loadcases after IFC import. Check for missing or incorrect loadcases.

## Best Practices

1. **Update to LUSAS 23.0-2** — fixes concrete fib Model Code, data transfer file, and cable tuning issues
2. **Use automatic nonlinear incrementation** — more gradual loading improves convergence
3. **Increase max iterations to 20-25** — allows more Newton-Raphson iterations per increment
4. **Use full Newton-Raphson, not modified** — better convergence for nonlinear problems
5. **Enable line search with 5 max searches** — helps with convergence difficulties
6. **Reduce stiff element stiffness by 1-2 orders** — prevents numerical round-off
7. **Check element aspect ratios (keep < 1:10)** — poor ratios cause convergence issues
8. **Use default convergence criteria** — slackened criteria can cause later problems
9. **Review the LUSAS output file for warnings** — pivot and diagonal decay warnings
10. **Use fine integration for element mechanisms** — eliminates excited mechanisms
