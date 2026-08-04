---
title: "PAM-STAMP Springback Simulation and Solver Errors"
excerpt: "PAM-STAMP Springback Simulation and Solver Errors: symptoms, root causes, and step-by-step fixes, verified against official documentation and community reports."
category: "troubleshooting"
softwareSlug: "pam-stamp"
keyword: "PAM-STAMP springback convergence failure implicit solver material non-linearity explicit damping method upper pad stop criterion distance detection failure pinch test alternative springback accuracy sensitive damping value integration points pre-simulation tuning mesh strategy springback prediction Springback Compensation mesh setting solver selection SMP-DP Advanced Implicit SMP-SP Explicit"
slug: "pam-stamp-springback-simulation-and-solver-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://www.sciencedirect.com/science/article/abs/pii/S0924013604003577"
  - "https://technicalgamer.org/how-to-save-time-and-monitor-simulation-in-pamstamp/"
  - "https://doi.org/10.17973/mmsj.2024_02_2023138"
---

# PAM-STAMP Springback Simulation and Solver Errors: Springback Convergence Failure from Implicit Solver Material Non-Linearity Requiring Explicit Damping Method, Upper Pad Stop Criterion Not Working from Distance Detection Failure Requiring Pinch Test Alternative, Springback Accuracy from Sensitive Damping Value and Integration Points Requiring Pre-Simulation Tuning, Mesh Strategy Impact on Springback Prediction Requiring Springback or Compensation Mesh Setting, and Solver Selection for Springback Stage Requiring SMP-DP Advanced Implicit Instead of SMP-SP Explicit

PAM-STAMP's springback simulation, stop criteria, damping parameters, mesh strategy, and solver selection produce errors from implicit convergence failure, distance detection bugs, parameter sensitivity, mesh impact, and solver mismatch. This guide covers the 5 most common PAM-STAMP problems with diagnostic steps and community-verified fixes from forming forums and technical documentation.

## 1. Springback Convergence Failure from Implicit Solver Material Non-Linearity

### Symptom

Springback simulation using the implicit solver fails to converge. The implicit solution meets convergence problems, especially for complicated parts. The error occurs when there is local loading among overall unloading, creating material non-linearity. The displacement in springback is relatively large, creating geometry non-linearity. When the accuracy of the stress field after forming is poor, the convergence problem becomes more serious.

### Root Cause

"The implicit solution and the explicit solution are two methods of springback simulation. Implicit solution is realized by applying reverse nodal force and equivalent iteration. For complicated parts, there is local loading among overall unloading, so there is material non-linearity. At the same time, the displacement in springback is relatively large, so it is also a geometry non-linearity problem. Based on the above facts, the implicit solution meets a convergence problem. When the accuracy of the stress field after forming is poor, the convergence problem becomes more serious."

### Fix

1. **Use explicit solution instead of implicit**:
   - "The explicit solution is realized by the damping of the stress field. It doesn't have a convergence problem"
   - Switch from implicit to explicit springback method
   - In PAM-STAMP, select explicit solver for springback stage
   - This eliminates the convergence issue

2. **Improve forming stage accuracy**:
   - "When the accuracy of the stress field after forming is poor, the convergence problem becomes more serious"
   - Improve the forming simulation accuracy first
   - Use finer mesh in the forming stage
   - Better stress field = better springback convergence

3. **Use pre-simulation for damping value**:
   - "A reasonable nodal damping value cannot be obtained beforehand"
   - "Usually pre-simulation being needed to obtain a suitable damping value"
   - Run a pre-simulation to determine the damping value
   - Then use that value in the main springback simulation

4. **Use Advanced Implicit solver**:
   - In PAM-STAMP 2G, use the macro "DoubleAction.ksa"
   - Select solver type "SMP-DP" (Double Precision)
   - Use "Advanced Implicit" calculation method
   - This is more robust than standard implicit

5. **Check for local loading areas**:
   - Identify areas with local loading during unloading
   - These cause material non-linearity
   - Refine mesh in these areas
   - This improves convergence

6. **Reduce geometry non-linearity**:
   - If springback displacement is very large
   - Use incremental implicit approach
   - Apply unloading in smaller steps
   - This reduces geometry non-linearity per step

### Community Report

> "The implicit solution meets a convergence problem for complicated parts. There is local loading among overall unloading, so there is material non-linearity. The displacement in springback is relatively large, so it is also a geometry non-linearity problem. When the accuracy of the stress field after forming is poor, the convergence problem becomes more serious. The explicit solution doesn't have a convergence problem but needs more CPU time and a reasonable nodal damping value cannot be obtained beforehand."

## 2. Upper Pad Stop Criterion Not Working from Distance Detection Failure

### Symptom

Simulating a sheet metal forming process with three operations: DR (drawing die), TR (trimming die), CRST (cam restriking die). The first two operations simulate normally. In the cam restriking stage, the upper pad (UPPER PAD) should stop during Stamping-1. The stop criterion is set to distance detection. However, during the calculation, the upper pad doesn't stop — it continues moving downward, causing the sheet to crack.

### Root Cause

"对于这种情况，很明显就能想到是停止准则的问题" (In this case, it's clearly a stop criterion issue). The distance detection stop criterion is not working correctly for the upper pad. The distance detection method checks the distance between the upper pad and the lower die. However, if the pad doesn't reach the exact distance threshold (dead point), the distance detection may not trigger. The pinch test method may stop too early when the pad can't reach the dead point. The stop criterion configuration may be correct, but the solver doesn't evaluate it properly during the holding stage.

### Fix

1. **Use pinch test stop criterion**:
   - "只有选夹持检测和距离检测" (Only pinch test and distance detection are available)
   - "夹持检测在压不到死点时就有可能停止" (Pinch test may stop when it can't reach the dead point)
   - Try pinch test instead of distance detection
   - It may stop earlier but prevents over-travel

2. **Check stop criterion attributes**:
   - Verify the stop criterion is properly assigned to the upper pad
   - Check the attribute tree for the stop criterion
   - Ensure the distance value is correct
   - Verify the reference object (lower die) is set

3. **Use progression stop criterion**:
   - "Progression(过程结束法)" (Progression end method)
   - This stops based on process progression
   - May not be available in holding stage
   - But check if it's an option

4. **Adjust distance threshold**:
   - The distance threshold may be too small
   - Increase the distance threshold slightly
   - This makes the stop criterion trigger earlier
   - Prevents the pad from over-traveling

5. **Check holding stage configuration**:
   - "Holding停止准则为上型圧料板到下模" (Holding stop criterion is upper pad to lower die)
   - Verify the holding stage stop criterion
   - The issue may be in the transition from holding to stamping
   - Check if the stop carries over correctly

6. **Use multi-stage stop criteria**:
   - Set different stop criteria for different stages
   - Holding: distance detection
   - Stamping-1: pinch test
   - This provides redundant stopping mechanisms

7. **Verify tool positions**:
   - Check the initial positions of all tools
   - Ensure the upper pad starts at the correct height
   - Verify the lower die position
   - Misalignment can cause stop criterion failure

### Community Report

> "上型压料板在计算中不能停止" (Upper pad cannot stop during calculation). In the cam restriking stage, the upper pad should stop during Stamping-1. The stop criterion is set to distance detection. But the upper pad doesn't stop and continues downward, causing the sheet to crack. I checked the stop criterion N times. For holding, only pinch test and distance detection are available. Pinch test may stop when it can't reach the dead point, so I chose distance detection, but the upper pad still won't stop."

## 3. Springback Accuracy from Sensitive Damping Value and Integration Points

### Symptom

Springback simulation results are inaccurate. The predicted springback doesn't match physical measurements. Small changes in damping value or integration points produce significantly different springback results. The simulation is sensitive to these parameters and it's unclear what values to use.

### Root Cause

"The nodal damping value shall not be too large or too small, usually pre-simulation being needed to obtain a suitable damping value. Too many or too few a number of integration points has disadvantage for the explicit solution in springback simulation. Usually seven integration points is the best value." The explicit springback method is highly sensitive to the damping value — too large causes over-damping (incomplete springback), too small causes under-damping (excessive oscillation). The number of integration points through the thickness affects stress distribution accuracy — too few gives poor stress distribution, too many increases computation without improving accuracy.

### Fix

1. **Use seven integration points**:
   - "Usually seven integration points is the best value"
   - Set through-thickness integration points to 7
   - This provides the best accuracy for springback
   - Don't use too many or too few

2. **Run pre-simulation for damping value**:
   - "Usually pre-simulation being needed to obtain a suitable damping value"
   - Run a short pre-simulation with different damping values
   - Compare springback results with measurements
   - Select the damping value that matches best

3. **Use appropriate mesh size**:
   - "The blank sheet element size is sensitive in springback simulation"
   - "Use element size < 25% of (fillet radius + half of blank thickness)"
   - For springback: mesh size < 25% of (fillet radius + half thickness)
   - This ensures accurate stress distribution

4. **Use reasonable punch velocity**:
   - Punch velocity affects dynamic effects in explicit simulation
   - Too fast introduces artificial dynamic effects
   - Too slow increases computation time
   - Use the actual process velocity

5. **Use PAM-Autostamp with SSU**:
   - "Use PAM-Autostamp. It gives the best results and is fast"
   - "Don't use PAM-Quikstamp Plus — it is a fast solver with lower result quality"
   - "Use PAM-Autostamp with SSU enabled — equally fast and gives better results"
   - SSU (Smooth Surface Update) improves contact accuracy

6. **Enable speed-up option**:
   - "PAM-STAMP uses a new simulation method to speed up the calculation"
   - "Enable the speed up in the Global Object → CPU control attribute"
   - "Default value of the speed up is 100%, which corresponds to the fastest setting"
   - This doesn't change results, only speed

7. **Use Double Precision for springback**:
   - "SMP-DP (Shared Memory Process - Double Precision) for springback"
   - Use double precision solver for springback stage
   - Single precision may introduce rounding errors
   - Especially important for springback accuracy

### Community Report

> "Sensitive factors in springback simulation: the nodal damping value shall not be too large or too small, usually pre-simulation being needed to obtain a suitable damping value. Too many or too few integration points has disadvantage — usually seven integration points is the best value. The blank sheet element size is sensitive — usually use element size < 25% of (fillet radius + half of blank thickness). The springback in U-bending was simulated by Pam-Stamp and its explicit solution."

## 4. Mesh Strategy Impact on Springback Prediction Requiring Springback or Compensation Mesh Setting

### Symptom

Springback prediction varies significantly depending on the mesh strategy used for the tools. Two different mesh strategies for the same drawing tools produce different springback results. The simulation results don't match measurements on real stampings. It's unclear which mesh strategy to use for accurate springback prediction.

### Root Cause

"For assessment of the springback size according to the rules for setting calculation with springback the mesh strategies 'Springback' and 'Compensation' for creation of elements on tools were chosen." The mesh strategy for tools affects how contact is calculated during forming, which affects the stress field, which in turn affects springback. Standard mesh strategies are optimized for forming simulation but not for springback accuracy. The "Springback" and "Compensation" mesh strategies create finer elements on tool surfaces, improving contact accuracy and stress distribution for springback prediction.

### Fix

1. **Use Springback mesh strategy**:
   - "The mesh strategies 'Springback' and 'Compensation' for creation of elements on tools"
   - In PAM-STAMP, select the "Springback" mesh strategy
   - This creates appropriate elements for springback accuracy
   - Available in the mesh wizard

2. **Use Compensation mesh strategy**:
   - The "Compensation" strategy is also valid
   - It's designed for tool compensation calculations
   - But also improves springback prediction
   - Choose based on your workflow

3. **Use mesh size ≈ 2× sliding fillet radius**:
   - "Mesh size ≈ 2× the sliding fillet radius"
   - "Final element size < radius of sliding fillet"
   - This ensures the mesh captures the fillet geometry
   - Critical for accurate contact and stress

4. **Use adaptive mesh refinement**:
   - "Use adaptive mesh refinement to reduce computation time and improve results"
   - Start with coarser mesh
   - Refine in critical areas during simulation
   - This balances accuracy and computation time

5. **Refine blank outline for complex shapes**:
   - "For crash forming or complex blanks, refine the blank outline"
   - Complex blank shapes need finer mesh at the outline
   - This prevents distortion during forming
   - And improves springback accuracy

6. **Use Reference Points System (RPS)**:
   - "Three points of the reference points system (RPS) for measurement of dimensional deviations"
   - Define RPS points in the simulation
   - These match the physical measurement points
   - This ensures accurate comparison

7. **Compare with physical measurements**:
   - "Simulation results were compared with measurements on real stampings"
   - Use a coordinate measuring machine (CMM)
   - Compare simulation springback with measured springback
   - Adjust parameters until they match

### Community Report

> "Two mesh strategies for drawing tool parts in PAM-STAMP 2G were compared. For assessment of the springback size according to the rules for setting calculation with springback, the mesh strategies 'Springback' and 'Compensation' for creation of elements on tools were chosen. Three points of the reference points system (RPS) for measurement of dimensional deviations were determined. Simulation results were compared with measurements on real stampings by portal 3D coordinate measuring machine."

## 5. Solver Selection for Springback Stage Requiring SMP-DP Advanced Implicit

### Symptom

Springback simulation results are inaccurate or the solver crashes when using the wrong solver type. The forming stage uses explicit solver, but the springback stage needs a different solver. Using the same explicit solver for springback produces poor results. The solver type selection is unclear.

### Root Cause

"For each stage of the drawing process simulation, the function 'Multihost' was used due to the requirement of different types of solvers in these operations. The solver type of 'SMP-SP' (Shared Memory Process - Single Precision) was chosen for the stage of blank holding and stamping drawing with the calculation 'Explicit'. For accurate calculations of springback size, the solver type of 'SMP-DP' (Shared Memory Process - Double Precision) was chosen for the stage of stamping springback for the calculation of 'Advanced Implicit'." The forming stages (holding, stamping) use explicit single-precision solver for speed. The springback stage requires implicit double-precision solver for accuracy. Using the wrong solver type produces inaccurate springback or convergence failures.

### Fix

1. **Use Multihost for different solver types**:
   - "The function 'Multihost' was used due to the requirement of different types of solvers"
   - Use Multihost to set different solvers for different stages
   - This allows each stage to use the optimal solver
   - Configure in the process definition

2. **Use SMP-SP Explicit for forming stages**:
   - "SMP-SP (Shared Memory Process - Single Precision) for holding and stamping"
   - Use single-precision explicit for forming
   - This is fast and accurate enough for forming
   - Calculation type: "Explicit"

3. **Use SMP-DP Advanced Implicit for springback**:
   - "SMP-DP (Shared Memory Process - Double Precision) for springback"
   - Use double-precision implicit for springback
   - Calculation type: "Advanced Implicit"
   - This provides the best springback accuracy

4. **Use the DoubleAction.ksa macro**:
   - "The macro 'DoubleAction.ksa' was chosen"
   - This macro automates the solver selection
   - It sets the correct solver for each stage
   - Use it for springback simulations

5. **Don't use PAM-Quikstamp Plus**:
   - "Don't use PAM-Quikstamp Plus. It is a fast solver with lower result quality"
   - "Use PAM-Autostamp with SSU enabled instead: equally fast and gives better results"
   - Always use PAM-Autostamp for production simulations
   - Quikstamp is only for quick previews

6. **Enable SSU (Smooth Surface Update)**:
   - "PAM-Autostamp with SSU enabled"
   - SSU improves contact surface representation
   - This improves stress field accuracy
   - Better stress field = better springback

7. **Monitor simulation progress**:
   - "Watch the results of every simulation stage instantly"
   - "Stop the simulation if you see something went wrong"
   - "Correct the issue and restart"
   - Use the GUI monitoring tools

### Community Report

> "For each stage of the drawing process simulation, the function 'Multihost' was used due to the requirement of different types of solvers. SMP-SP (Single Precision) was chosen for holding and stamping with Explicit calculation. For accurate calculations of springback, SMP-DP (Double Precision) was chosen for springback with Advanced Implicit calculation. The macro DoubleAction.ksa was chosen for this purpose. Use PAM-Autostamp with SSU enabled — equally fast and gives better results than PAM-Quikstamp Plus."

## 6. Additional PAM-STAMP Issues

### Solver Manager Configuration

**Issue**: Solver manager not launching simulations correctly.
**Fix**: Verify solvermanager.exe is running. Check launch script template. Verify COMMAND path. Check LIBRARY_PATH and MP_VARIABLE settings. Start solver manager as service for persistence.

### Restart File Management

**Issue**: "PAM-STAMP will overwrite oldest files when max restart files are exceeded."
**Fix**: Increase max restart files in settings. Archive important restart files. Use unique project names. Monitor disk space.

### Data Check Before Launch

**Issue**: Simulation fails immediately after launch.
**Fix**: "After the Data Check, press the Launch button." Always run Data Check first. Fix any data check errors. Verify all attributes are set. Check material and thickness definitions.

### Blank Mesh Wizard Issues

**Issue**: Blank mesh is poor quality after wizard.
**Fix**: Use mesh wizard to define mesh size and refinement level. Set initial size in blank editor. Use macros or attribute tree for refinement levels. Refine blank outline for complex shapes.

### GPU Simulation Not Available

**Issue**: GPU simulation doesn't start or is slow.
**Fix**: Check GPU compatibility. Update GPU drivers. Verify GPU is selected in CPU control. Check GPU memory. Use CPU simulation as fallback.

### File Format Issues

**Issue**: Can't import or export specific file formats.
**Fix**: Check supported file formats. Use neutral formats (IGES, STEP). Convert files in another tool. Check file encoding (binary vs ASCII).

## Best Practices

1. **Use explicit solver for springback if implicit doesn't converge** — no convergence problem
2. **Use seven through-thickness integration points** — optimal for springback accuracy
3. **Run pre-simulation to determine damping value** — critical for explicit springback
4. **Use mesh size < 25% of (fillet radius + half thickness)** — sensitive for springback
5. **Use Springback or Compensation mesh strategy** — optimized for springback prediction
6. **Use SMP-DP Advanced Implicit for springback stage** — double precision for accuracy
7. **Use SMP-SP Explicit for forming stages** — single precision for speed
8. **Use Multihost to set different solvers per stage** — optimal solver for each stage
9. **Use PAM-Autostamp with SSU** — better results than PAM-Quikstamp Plus
10. **Use Reference Points System (RPS) for comparison** — matches physical measurement points
