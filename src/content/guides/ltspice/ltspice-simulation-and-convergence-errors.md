---
title: "LTspice Simulation and Convergence Errors"
excerpt: "LTspice Simulation and Convergence Errors: symptoms, root causes, and step-by-step fixes, verified against Analog Devices EngineerZone."
category: "troubleshooting"
softwareSlug: "ltspice"
keyword: "LTspice Infinite recursion syntax error v24.1 update parentheses fix time step too small convergence failure non-physical circuit parasitic addition simulation lockup AD8274 model instability discrete op-amp replacement inconsistent convergence floating nodes capacitance addition debugtran labelled net name ignored plotting component vs net name confusion"
slug: "ltspice-simulation-and-convergence-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/595594/simulation-errors-with-spice-models-after-update-to-lt-spice-v24-1-8"
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/582233/bugs-in-ltspice24"
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/596524/simulation-lockup"
---

# LTspice Simulation and Convergence Errors: Infinite Recursion and Syntax Error from v24.1 Update Requiring Parentheses Fix, Time Step Too Small Convergence Failure from Non-Physical Circuit Requiring Parasitic Addition, Simulation Lockup from AD8274 Model Instability Requiring Discrete Op-Amp Replacement, Inconsistent Convergence from Floating Nodes Requiring Capacitance Addition and Debugtran, and Labelled Net Name Ignored When Plotting from Component vs Net Name Confusion Requiring Net Label Addition

LTspice's syntax parsing, convergence handling, model compatibility, floating node resolution, and net naming produce errors from stricter syntax checking, non-physical circuits, model instability, floating nodes, and naming confusion. This guide covers the 5 most common LTspice problems with diagnostic steps and community-verified fixes from Analog Devices EngineerZone.

## 1. Infinite Recursion and Syntax Error from v24.1 Update

### Symptom

After updating from LTspice v24.0.12 to v24.1.8, SPICE models that previously worked now produce errors: "Infinite recursion is not allowed. .lib TunnelDiode.sub" and "Expected '}' here. G1 3 4 VALUE={(.0001*V(3,4)/.075))*(EXP(1-(V(3,4)/.075)))}" with "Unknown parameter" errors. Models worked up to v24.0.12 but fail on all newer versions.

### Root Cause

"LTspice versions prior to 24.1.x accepted many invalid inputs, however don't assume your netlists 'worked' simply because there was no error message. In many of those cases it would wrongfully ignore parts of the input and keep going." The v24.1 update introduced stricter syntax checking. The tunnel diode model has a syntax error: "There is one ')' too much here. You simply have to fix your syntax errors." The extra parenthesis was silently ignored in older versions but causes errors in v24.1+.

### Fix

1. **Fix syntax errors in SPICE models**:
   - Open the .sub file in a text editor
   - Find the line with the error
   - Remove the extra parenthesis: `VALUE={(.0001*V(3,4)/.075))*(EXP(...))}` → `VALUE={(.0001*V(3,4)/.075)*(EXP(...))}`
   - Save and retry

2. **Fix Infinite recursion error**:
   - The infinite recursion may be related to .lib include cycles
   - Check for circular .lib references
   - Close LTspice between simulation attempts

3. **Use older LTspice version as workaround**:
   - If fixing syntax is not feasible
   - Use v24.0.12 until models are fixed
   - But fix the syntax errors for long-term compatibility

4. **Check all .sub and .lib files for syntax**:
   - The stricter parser may find errors in multiple files
   - Check each .sub file referenced by the simulation
   - Fix all syntax errors
   - Test each model individually

5. **Accept that old results may have been wrong**:
   - Previous simulation results may have been incorrect
   - Fixing syntax may change results

### Community Report

> "After updating from v24.0.12 to v24.1.8, I noticed the current version is no longer able to simulate all my SPICE models without error messages. Infinite recursion is not allowed. Expected '}' here. There is one ')' too much — you simply have to fix your syntax errors. LTspice versions prior to 24.1.x accepted many invalid inputs and would wrongfully ignore parts of the input and keep going."

## 2. Time Step Too Small Convergence Failure from Non-Physical Circuit

### Symptom

Error: "Analysis: Time step too small; time = 0.000282627, timestep = 1.25e-19: trouble with node 'n005'." The simulation fails to converge. Adding small parasitics (10pF, 1R, 10nH) that used to fix convergence in LTspice XVII no longer works in LTspice 24.

### Root Cause

"Greater propensity to fail to simulate." The circuit contains non-physical elements — ideal voltage sources, ideal switches, or nodes without DC path to ground. LTspice 24's solver is stricter about convergence and crashes faster (max 20 iterations) versus taking longer but eventually converging. The non-physical circuit creates singular matrices that the solver can't resolve.

### Fix

1. **Add parasitic capacitance to floating nodes**:
   - Add 10pF capacitor from floating node to ground
   - Add 1R series resistance to ideal voltage sources
   - Add 10nH series inductance to ideal current sources

2. **Add .options directives**:
   - `.options abstol=1e-9` — relax absolute current tolerance
   - `.options reltol=0.01` — relax relative tolerance
   - `.options trtol=7` — transient tolerance
   - `.options gmin=1e-9` — add minimum conductance

3. **Use .options debugtran**:
   - Identify and fix problematic nodes

4. **Replace ideal components with realistic ones**:
   - Replace ideal voltage sources with ones including series resistance
   - Replace ideal switches with ones including on-resistance and off-capacitance
   - Add ESR to capacitors
   - Add DCR to inductors

5. **Add initial conditions**:
   - `.ic V(node)=0` — set initial voltage
   - `.ic I(inductor)=0` — set initial current
   - This helps the operating point calculation
   - Prevents singular matrix at t=0

6. **Use .nodeset**:
   - `.nodeset V(node)=value` — provide initial guess for DC operating point
   - This helps the solver find the operating point
   - Especially useful for circuits with multiple stable states

7. **Check for unconnected nodes**:
   - "WARNING: Node is floating" messages in the log
   - Add a high-value resistor (1GΩ) from floating node to ground
   - This provides a DC path without affecting circuit behavior

### Community Report

> "Error: Time step too small; time = 0.000282627, timestep = 1.25e-19: trouble with node 'n005'. With the previous version a few small circuit parasitics, 10pF here, 1R there, 10nH, would solve the maths errors. Not so with LTS64. Crashing out faster (max 20 iterations?) is a retrograde step versus taking longer but simulating. Try .options debugtran — a convergence grade is given to each component and node. Any number above 50 is usually a problem."

## 3. Simulation Lockup from AD8274 Model Instability

### Symptom

LTspice 24.1.9 locks up at a random time between 20ms and 80ms into the simulation. The "Simulation Speed" display disappears when the lockup starts. Using the built-in AD8274 differential amplifier model. The same project worked in 24.0.12 but fails in 24.1.7, 24.1.8, and 24.1.9.

### Root Cause

The AD8274 built-in model has instability issues that cause the solver to hang. The model may have internal nodes or behavioral sources that create convergence problems. The newer LTspice versions are more sensitive to these model issues. "I noticed a persistent -300uV to -500uV output offset from that AD8274 model" — the model itself may have accuracy issues.

### Fix

1. **Replace AD8274 with discrete op-amp implementation**:
   - Use ADA4511 op-amp with four resistors
   - This avoids the AD8274 model instability

2. **Try different op-amp models**:
   - Try different op-amps until one works
   - Test each model individually

3. **Check motor model separately**:
   - Test the motor model separately
   - Replace motor with resistor for testing

4. **Use .options to relax convergence**:
   - `.options noopiter` — skip direct Newton iteration
   - `.options gminsteps=0` — skip gmin stepping
   - `.options NoMarch` — disable marching
   - `.options trtol=7` — relax transient tolerance

5. **Simplify the circuit for debugging**:
   - Build the circuit block by block
   - Identify which block causes the lockup

6. **Use older LTspice version**:
   - Try different versions
   - Report the issue on EngineerZone

### Community Report

> "The same project causes 24.1.9 to lockup at some random time between 20ms to 80ms. I was using the built-in AD8274 diff amp model. I noticed a persistent -300uV to -500uV output offset. I decided to roll my own diff amp out of an op amp and four resistors — ADA4511. I put the motor back and got many defcons and a singular matrix. Replacing the AD8274 with a discrete op-amp implementation fixed the lockup."

## 4. Inconsistent Convergence from Floating Nodes

### Symptom

Two nearly identical netlists — one with a 0.1pF capacitor added, one without. The one with the capacitor converges successfully. The one without fails with "Pseudo Transient failed" and "Iteration limit reached" and "singular matrix." Adding the capacitor fixes the issue. Using .options debugtran also fixes it.

### Root Cause

"SPICE doesn't like non-physical components/nodes." The floating nodes create singular matrices that the solver can't resolve. The 0.1pF capacitor provides a tiny AC path to ground, making the matrix non-singular. "It's a pretty common solution to add a little capacitance to solve convergence problems." The .options debugtran flag changes the solver behavior slightly, which can also resolve the singularity.

### Fix

1. **Add small capacitance to floating nodes**:
   - Add 0.1pF from floating node to ground
   - This is physically reasonable (stray capacitance)

2. **Use .options debugtran**:
   - This may also fix the convergence issue

3. **Add high-value resistors to floating nodes**:
   - Add 1GΩ resistor from floating node to ground
   - This provides a DC path without affecting circuit behavior
   - Similar to adding capacitance but for DC operating point

4. **Check for floating node warnings**:
   - "WARNING: Node is floating" messages in the log
   - Identify all floating nodes
   - Add DC paths to all of them
   - This prevents singular matrix errors

5. **Check MOSFET length warnings**:
   - These warnings indicate potential model issues
   - Increase MOSFET channel length
   - Or use a higher level MOSFET model

6. **Fix singular matrix at specific nodes**:
   - Identify the specific nodes causing the singularity
   - Add DC paths or capacitance to those nodes
   - Test after each fix

### Community Report

> "Base_71.cir fails with singular matrix and Pseudo Transient issues, while variant_71.cir succeeds with a minor 0.1pF capacitor addition. It's a pretty common solution to add a little capacitance to solve convergence problems. SPICE doesn't like non-physical components/nodes. Try .options debugtran — a convergence grade is given to each component and node. Any number above 50 is usually a problem. After adding debugtran, the simulation of base_71.cir was successful."

## 5. Labelled Net Name Ignored When Plotting from Component vs Net Name Confusion

### Symptom

A net is labelled "Vref" but when plotted, the trace is labelled V(n005) instead of V(Vref). Behavioral sources referencing V(Vref) fail with "Unknown circuit node: 'vref' requested in behavioral source." The net name appears to be ignored.

### Root Cause

"The 'Vref' in your schematic is the name of the voltage source component, simply dragged to look like a net name." The user confused a component name (voltage source named Vref) with a net name. In LTspice, net names are red, component names are white. You cannot reference V([component name]) — you must reference V([net name]). The voltage source component is named Vref but the net it connects to is named n005.

### Fix

1. **Add a net name to the node**:
   - Use the net label tool (F4) to add a net name

2. **Distinguish net names from component names**:
   - Check the color of the label
   - Red = net name (can be referenced as V(netname))
   - White = component name (cannot be referenced as V(componentname))

3. **Reference the correct net in behavioral sources**:
   - In behavioral sources, use V(netname) not V(componentname)
   - Add a net name first, then reference it

4. **Rename the component to avoid confusion**:
   - If the voltage source is named Vref, rename it to V1 or Vref_src
   - Then add a net name Vref to the node
   - This eliminates the confusion
   - V(Vref) will now reference the net, not the component

5. **Check the netlist for correct naming**:
   - View the SPICE netlist (View > SPICE Netlist)
   - Verify net names in the netlist
   - Ensure the net name appears as a node label
   - Fix any naming conflicts

### Community Report

> "I label a net Vref, but when I plot it the trace is labelled V(n005). Failing to find circuit nodes used in arbitrary behavioural sources: 'Unknown circuit node: vref requested in behavioral source.' The 'Vref' in your schematic is the name of the voltage source component, simply dragged to look like a net name. You cannot reference V([component name]) — you must reference V([net name]). Simply adding a net name to the node solves this problem. Net names are red, component names are white."

## 6. Additional LTspice Issues

### PFC Boost Flyback Convergence Bug

**Issue**: "LTspice 24.0.12 simulates my PFC-boost-flyback converter, but 24.1.5 fails in transient analysis."
**Fix**: "It's a very subtle bug in LTspice. Will be fixed in the next update of 24.1 beta." Use 24.0.12 as workaround. Or use XVII until the fix is released.

### Def Con Messages in Log

**Issue**: "There are a couple of defcons in the log file" even when simulations seem to work.
**Fix**: Check the log file for "Def Con" messages. These indicate convergence difficulties. Address them by adding parasitics or relaxing tolerances. Don't ignore them even if results seem reasonable.

### Source Stepping for Operating Point

**Issue**: Operating point calculation fails.
**Fix**: Use .options srcstepmethod=0 for source stepping. Check if source stepping succeeds. If not, add .nodeset values. Or use .options noopiter to skip direct Newton iteration.

### Simulation Tolerance Relaxed Warning

**Issue**: "Warning: Simulation tolerance relaxed to achieve convergence."
**Fix**: This indicates the solver had to relax tolerances to converge. Results may be less accurate. Add parasitics or fix circuit topology. Check if results are still acceptable.

## Best Practices

1. **Fix syntax errors when updating to LTspice v24.1+** — stricter parser catches old errors
2. **Add small parasitics (10pF, 1R, 10nH) to non-physical circuits** — prevents convergence failure
3. **Use .options debugtran to identify problematic nodes** — convergence grade per node
4. **Add 0.1pF or 1GΩ to floating nodes** — prevents singular matrix
5. **Replace unstable IC models with discrete implementations** — AD8274 example
6. **Distinguish net names (red) from component names (white)** — prevents reference errors
7. **Check log file for Def Con messages** — don't ignore convergence warnings
8. **Build complex circuits block by block for debugging** — isolate the problem
9. **Use .options directives to relax convergence** — abstol, reltol, trtol, gmin
10. **Keep older LTspice versions installed** — workaround for version-specific bugs
