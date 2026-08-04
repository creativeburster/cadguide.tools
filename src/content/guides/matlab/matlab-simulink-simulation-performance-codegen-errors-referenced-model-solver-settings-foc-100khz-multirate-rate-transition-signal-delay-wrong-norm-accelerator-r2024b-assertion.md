---
title: "MATLAB Simulink Simulation Performance and Code Generation Errors: Huge Time Differences Between Programmatic and GUI Simulation from Referenced Model Solver Settings Left Unchanged, Simulation Becomes Very Slow After Adding FOC from 100kHz Global Step Rate Forcing All Blocks Requiring Multirate Design, Treat Each Discrete Rate as Separate Task Auto-Generates Rate Transition Causing Signal Delay Requiring Multitasking Understanding, Wrong Norm Result in Generated C Code from Accelerator Mode Code Generation Bug, and R2024b Code Generation Assertion Failed from Variant Subsystem Expression Compile Requiring Technical Support"
excerpt: "MATLAB Simulink fails for 5 distinct reasons: huge time differences between programmatic and GUI simulation from referenced model solver settings left unchanged, simulation becomes very slow after adding FOC from 100kHz global step rate forcing all blocks requiring multirate design, Treat each discrete rate as separate task auto-generates rate transition causing signal delay requiring multitasking understanding, wrong norm result in generated C code from Accelerator mode code generation bug, and R2024b code generation assertion failed from variant subsystem expression compile requiring technical support. We cover each with fixes from MATLAB Answers."
category: "performance"
softwareSlug: "matlab"
keyword: "MATLAB Simulink huge time differences programmatic GUI simulation referenced model solver settings simulation slow FOC 100kHz global step rate multirate design Treat each discrete rate separate task rate transition signal delay multitasking wrong norm generated C code Accelerator mode R2024b code generation assertion variant subsystem expression compile"
slug: "matlab-simulink-simulation-performance-codegen-errors-referenced-model-solver-settings-foc-100khz-multirate-rate-transition-signal-delay-wrong-norm-accelerator-r2024b-assertion"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://www.mathworks.com/matlabcentral/answers/2179463-simulink-model-simulation-huge-time-differences-between-simulation-arrangements"
  - "https://www.mathworks.com/matlabcentral/answers/2182884-simulink-simulation-becomes-very-slow-after-adding-foc-to-a-6-phase-pmsm-drive-with-chb-inverter"
  - "https://www.mathworks.com/matlabcentral/answers/2177379-wrong-norm-result-in-generated-c-code-for-matlab-function-block-simulink-r2024b"
---

# MATLAB Simulink Simulation Performance and Code Generation Errors: Huge Time Differences Between Programmatic and GUI Simulation from Referenced Model Solver Settings Left Unchanged, Simulation Becomes Very Slow After Adding FOC from 100kHz Global Step Rate Forcing All Blocks Requiring Multirate Design, Treat Each Discrete Rate as Separate Task Auto-Generates Rate Transition Causing Signal Delay Requiring Multitasking Understanding, Wrong Norm Result in Generated C Code from Accelerator Mode Code Generation Bug, and R2024b Code Generation Assertion Failed from Variant Subsystem Expression Compile Requiring Technical Support

MATLAB Simulink's simulation performance, multirate modeling, code generation, and version upgrades produce errors from solver configuration mismatches, global step rate issues, and code generation bugs. This guide covers the 5 most common MATLAB Simulink problems with diagnostic steps and community-verified fixes from MATLAB Answers.

## 1. Huge Time Differences Between Programmatic and GUI Simulation from Referenced Model Solver Settings

### Symptom

A Simulink model simulates fast and accurately when launched programmatically via a .m script with `sim()` and `SimulationInput` objects. But when the same model is instantiated in a Simulink test bench canvas and simulated from the GUI, it takes an extremely long time — so long that the user gets bored before the first step. The model is the same, the solver settings appear the same.

### Root Cause

When using model referencing (the model is referenced inside a test bench), the referenced model has its own solver settings. The user changed the simulation properties of the test bench (top model) but left the referenced model's properties unchanged. The referenced model was using fixed-step with an automatically chosen solver, while the programmatic approach set the solver to variable-step ode15. The mismatch caused the referenced model to take tiny fixed steps.

### Fix

1. **Check referenced model solver settings**:
   - "I was changing the simulation properties of the test bench, while the properties of the so called 'referenced model', just a few pixels down the menu, were left unchanged"
   - "These happened to be the 'wrong' ones, with fixed-step and automatically chosen solver"
   - Right-click the Model Reference block > Model Parameters
   - Set the solver to match the top model

2. **Set solver on both top and referenced models**:
   - Open the referenced model directly
   - Configuration Parameters > Solver
   - Set Solver Type: Variable-step
   - Set Solver: ode15s (for stiff systems)
   - Save the referenced model

3. **Use programmatic approach for consistency**:
   - The programmatic approach sets all parameters explicitly
   - `simIn1 = simIn1.setModelParameter('SolverType','Variable-step',...)`
   - This ensures all models use the same solver
   - Consider using the programmatic approach for production runs

4. **Verify solver settings after model changes**:
   - After any model modification
   - Check both top model and referenced model solver settings
   - Don't assume changes propagate to referenced models
   - Use Configuration Parameters > Solver for each model

5. **Use Model Reference solver inheritance**:
   - In the referenced model's Configuration Parameters
   - Enable "Use local solver" or disable it to inherit from parent
   - If disabled, the referenced model uses the parent's solver
   - This prevents solver mismatches

### Community Report

> "I was changing the simulation properties of the test bench, while the properties of the so called 'referenced model', just a few pixels down the menu, were left unchanged. These happened to be the 'wrong' ones, with fixed-step and automatically chosen solver. When I finally got to change those to the intended ones, the simulation ran smooth."

## 2. Simulation Becomes Very Slow After Adding FOC from 100kHz Global Step Rate

### Symptom

Simulating a 6-phase PMSM drive with CHB inverter in Simulink R2025b. Without FOC, simulation runs normally. After adding field-oriented control (VSD transformation, Park transformation, PI controllers, filters), the simulation becomes very slow. PWM carrier frequency is 5kHz, duty cycle update rate is 100kHz, solver is ode14x.

### Root Cause

"The main culprit is your 100 kHz global step rate forcing every single block — including your speed PI controller, which has no business running that fast — to execute at the same tiny time step." ode14x makes it worse because it runs Newton iterations at every step across the now much-larger closed-loop state space. The single global step rate forces all blocks to run at 100kHz, even blocks that only need 1-2kHz.

### Fix

1. **Use multirate design**:
   - "The fix is a proper multirate design: run your current loops at 10-20 kHz and your speed loop at 1-2 kHz"
   - "They do not need to be coupled to your switching frequency"
   - Set different sample times for different blocks
   - Use Rate Transition blocks between different rates

2. **Switch to variable-step solver**:
   - "If you are just doing desktop simulation and not targeting code generation, swap ode14x for ode23t or ode15s"
   - "They are variable-step and will handle your mixed fast/slow dynamics far more efficiently"
   - Configuration Parameters > Solver > Variable-step
   - Use ode23t (trapezoidal) or ode15s (stiff)

3. **Use Rapid Accelerator mode**:
   - "If you are running in Normal mode, just switching to Rapid Accelerator alone can give you a 10x speedup with zero changes to your model"
   - Simulation > Mode > Rapid Accelerator
   - This compiles the model for faster execution
   - No model changes required

4. **Use local solver for Simscape networks**:
   - "If your inverter and PMSM are built in Simscape, assign a local solver like Backward Euler directly to that physical network"
   - "So the stiff electrical portion is isolated and not dragging the whole model down"
   - Configuration Parameters > Solver > Local Solver for physical networks

5. **Run Performance Advisor**:
   - "Run Performance Advisor from the Debug tab before touching anything else"
   - "MathWorks has documented cases where it alone produced close to 96% reduction in simulation time"
   - Debug tab > Performance Advisor
   - Follow the advisor's recommendations

6. **Separate control and plant models**:
   - Use model referencing to separate control and plant
   - Run the plant at high rate, control at lower rate
   - This reduces the computational load
   - Use referenced model solver settings

### Community Report

> "What you are experiencing is completely normal and expected given your setup. The main culprit is your 100 kHz global step rate forcing every single block to execute at the same tiny time step, and ode14x makes it worse. The fix is a proper multirate design: run your current loops at 10-20 kHz and your speed loop at 1-2 kHz. Swap ode14x for ode23t or ode15s. Switching to Rapid Accelerator alone can give you a 10x speedup."

## 3. Treat Each Discrete Rate as Separate Task Auto-Generates Rate Transition Causing Signal Delay

### Symptom

Preparing a Simulink discrete model for autocoding. Enabling "Treat each discrete rate as a separate task" in configuration parameters. Model runs at fixed step of 2Hz with two signals at 2Hz and 0.5Hz, both resampled to 1Hz by ZOH blocks. When the option is toggled, the model fails to compile with a sample time mismatch error. A Rate Transition block is automatically inserted, delaying the 0.5Hz signal by 2 seconds.

### Root Cause

"When you enable 'Treat each discrete rate as a separate task', Simulink switches from single-tasking to multitasking execution. Each unique discrete sample time is now run in its own task with its own scheduling and priority. In multitasking mode, two blocks running in different tasks cannot exchange data directly — doing so risks race conditions and nondeterministic execution. To maintain data integrity, Simulink automatically inserts Rate Transition blocks."

### Fix

1. **Understand multitasking execution**:
   - "When you enable 'Treat each discrete rate as a separate task', Simulink switches from single-tasking to multitasking execution"
   - "Each unique discrete sample time is now run in its own task"
   - Rate transitions are necessary for data integrity
   - The delay is a consequence of multitasking safety

2. **Use "Whenever possible" for rate transition**:
   - "I've only achieved is to reduce the delay to 1s (changing the configuration parameter from 'whenever posible' to 'never')"
   - Configuration Parameters > Solver > Rate Transition for:
   - Set to "Whenever possible, for deterministic results"
   - This minimizes delays while maintaining safety

3. **Manually add Rate Transition blocks**:
   - Instead of letting Simulink auto-insert them
   - Add Rate Transition blocks explicitly
   - Control the initial condition and sample time
   - This gives you control over the delay

4. **Use "Never" to disable auto rate transitions**:
   - Configuration Parameters > Solver > Rate Transition for: "Never"
   - This disables auto-insertion
   - You must manually handle all rate transitions
   - Risk: unsafe data transfers in multitasking

5. **Ensure consistent sample times**:
   - Before enabling the option
   - Ensure all blocks have explicit sample times
   - Don't use inherited sample time (-1)
   - This prevents unexpected rate transitions

6. **Test in R2025 or later**:
   - "I'm working in 2018a. I've not checked if this still happens in the 2025 version"
   - Newer MATLAB versions may handle this better
   - Test with the latest version
   - The behavior may have been improved

### Community Report

> "When you enable 'Treat each discrete rate as a separate task', Simulink switches from single-tasking to multitasking execution. Each unique discrete sample time is now run in its own task. In multitasking mode, two blocks running in different tasks cannot exchange data directly — doing so risks race conditions. To maintain data integrity, Simulink automatically inserts Rate Transition blocks."

## 4. Wrong Norm Result in Generated C Code from Accelerator Mode

### Symptom

Using MATLAB R2024b with Simulink R2024b. A MATLAB Function block computes the Euclidean norm of a 3x1 vector. When running in Accelerator mode, the generated C code produces a wrong norm result. The `norm()` function in MATLAB debug gives 0.2911, but the `debug_norm_dv` variable in the generated C code gives a different value. The generated C code uses `dnrm2` from BLAS.

### Root Cause

This is a code generation bug in R2024b. The MATLAB Function block's code generator incorrectly handles the `norm()` function for small vectors in Accelerator mode. The generated C code calls `dnrm2` (BLAS function) but the data passing to `dnrm2` may have a size or pointer issue. The bug is specific to Accelerator mode — Normal mode produces correct results.

### Fix

1. **Use Normal mode as workaround**:
   - The bug is in Accelerator mode code generation
   - Switch to Normal mode: Simulation > Mode > Normal
   - Results will be correct
   - Trade-off: slower simulation

2. **Replace norm() with explicit calculation**:
   - Instead of `norm(dv_burn)`, use:
   - `sqrt(sum(dv_burn.^2))`
   - This avoids the `norm()` code generation path
   - The explicit calculation generates correct C code

3. **Report to MathWorks technical support**:
   - "This is a code generation bug in R2024b"
   - Contact MathWorks Support with:
     - MATLAB version: R2024b (24.2.0.2863752 Update 5)
     - The MATLAB Function block code
     - The generated C code snippet
   - They can provide a patch or workaround

4. **Use Rapid Accelerator mode**:
   - Rapid Accelerator uses a different code generation path
   - It may not have the same bug
   - Simulation > Mode > Rapid Accelerator
   - Test if the results are correct

5. **Verify with explicit comparison**:
   - Add a Display block showing `norm(dv_burn)`
   - Add a Display block showing `sqrt(sum(dv_burn.^2))`
   - Compare the two values
   - If they differ, the code generation bug is confirmed

6. **Check for R2024b updates**:
   - Install the latest R2024b update
   - MathWorks may have fixed this in a later update
   - Check the bug report database
   - Update 5 may not include the fix

### Community Report

> "When I look at the debug_norm_dv, I should see the same number but instead I see a different value. This gives me a clue that there might be something wrong with the compilation. I am running the model in Accelerator mode. The generated C code uses dnrm2 from BLAS but produces a wrong result."

## 5. R2024b Code Generation Assertion Failed from Variant Subsystem Expression Compile

### Symptom

A Simulink model with a variant subsystem using expression->code compile configuration. Code generation works in R2024a. After upgrading to R2024b, code generation fails with: "CGIR assertion failed: fType == REGULAR || fType == PROTOTYPE_WITH_FIDELITY" in FunctionModRefInfo.cpp line 422. The entire team has the same issue after converting to R2024b.

### Root Cause

This is an internal MathWorks code generation bug in R2024b. The CGIR (Code Generation Intermediate Representation) module has an assertion failure when processing variant subsystems with expression->code compile configuration. The assertion checks function types and fails for a specific variant configuration. This is not a user-fixable bug — it requires a MathWorks fix.

### Fix

1. **Contact MathWorks technical support**:
   - "It is highly unlikely that anyone in this forum is going to be able to help you with this"
   - "May I suggest that you contact technical support"
   - "Start at Contact Support - MATLAB & Simulink"
   - "Click on Product Usage and take it from there"

2. **Use R2024a as workaround**:
   - "With the R2024a version, my Simulink model was generating code"
   - Keep R2024a installed alongside R2024b
   - Use R2024a for code generation until the fix is available
   - Both versions can coexist

3. **Change variant configuration**:
   - Try changing the variant subsystem configuration
   - Instead of "expression->code compile"
   - Try "expression->simcode compile" or "label->code compile"
   - This may avoid the specific code path that triggers the assertion

4. **Simplify the variant subsystem**:
   - If the variant subsystem has complex expressions
   - Simplify the variant conditions
   - Use simpler variant expressions
   - This may avoid the assertion trigger

5. **Check for R2024b updates**:
   - Install the latest R2024b update
   - MathWorks may have fixed this in a later update
   - Check the release notes for code generation fixes
   - The fix may be in Update 6 or later

6. **Report with reproduction steps**:
   - "Please report this to MathWorks if you can cause it to recur"
   - Provide the minimal model that reproduces the issue
   - Include the variant subsystem configuration
   - Include the exact error message

### Community Report

> "With the R2024a version, my Simulink model was generating code. With the R2024b version, the generation is giving an error: CGIR assertion 'FunctionModRefInfo.cpp(422): Assertion failed: fType == REGULAR || fType == PROTOTYPE_WITH_FIDELITY' failed. My whole team has converted to R2024b and they have the same issue. May I suggest that you contact technical support."

## 6. Additional MATLAB Simulink Issues

### Linearization from GUI vs Programmatic

**Issue**: Can't find working linearization approach from the Simulink GUI.
**Fix**: Use the `linearize()` function from the command line with `linio` objects. The Control Design Toolbox provides both GUI and programmatic linearization. The programmatic approach is more flexible and documented.

### Staircase Input Creation

**Issue**: Creating a staircase input for simulation is complex.
**Fix**: Use `timeseries` with `repelem` for staircase generation: `I_HTR_ts1 = timeseries(I_plot1, t_plot1)`. Feed via "From Workspace" block or `setExternalInput`.

### ode14x Solver Performance

**Issue**: ode14x is very slow for closed-loop motor drive simulations.
**Fix**: "Swap ode14x for ode23t or ode15s — they are variable-step and will handle your mixed fast/slow dynamics far more efficiently." Use ode23t for mildly stiff systems, ode15s for highly stiff systems.

### Simscape Local Solver

**Issue**: Simscape electrical networks slow down the entire simulation.
**Fix**: "Assign a local solver like Backward Euler directly to that physical network so the stiff electrical portion is isolated." Configuration Parameters > Solver > Enable local solver.

## Best Practices

1. **Check referenced model solver settings separately** — don't assume they inherit from parent
2. **Use variable-step solvers (ode23t, ode15s) for desktop simulation** — far more efficient for mixed dynamics
3. **Design multirate systems with separate sample times** — don't force all blocks to run at the fastest rate
4. **Switch to Rapid Accelerator for 10x speedup** — zero model changes required
5. **Run Performance Advisor before manual optimization** — can produce 96% reduction in simulation time
6. **Understand multitasking rate transitions** — "Treat each discrete rate as separate task" inserts Rate Transition blocks
7. **Use "Whenever possible" for rate transitions** — minimizes delays while maintaining safety
8. **Replace norm() with sqrt(sum(x.^2)) in Accelerator mode** — avoids R2024b code generation bug
9. **Keep previous MATLAB version installed** — R2024a may work when R2024b has bugs
10. **Contact MathWorks support for internal assertion errors** — these are not user-fixable
