---
title: "LTspice Buck Converter Convergence and Transient Simulation Errors"
excerpt: "LTspice Buck Converter Convergence and Transient Simulation Errors: symptoms, root causes, and step-by-step fixes, verified against LTspice Groups."
category: "troubleshooting"
softwareSlug: "ltspice"
keyword: "LTspice buck converter convergence time-step too small SiC MOSFET 2.5GHz gate oscillation gate resistance model replacement IR2104 synchronous buck stuck 0% NMOS switching edge Alternate solver Bordodynov library .op operating point feedback loop open-loop nodeset LTspice 24.0.12 convergence bug B-source PFC beta update transient infinitely uic averaged model start small"
slug: "ltspice-buck-converter-convergence-and-transient-simulation-errors"
author: "CADGuide Tools Editorial Team"
readTime: "14 min"
date: "2025-07-31"
sources:
  - "https://groups.io/g/LTspice/topic/unable_to_converge_a_simple/106784532"
  - "https://electronics.stackexchange.com/questions/736052/ltspice-ir2104-synchrobuck-simulation-problem"
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/f/q-a/589415/simulation-failure-with-ltspice-24-0-12"
---

# LTspice Buck Converter Convergence and Transient Simulation Errors: Manufacturer SiC MOSFET Model Time-Step Too Small from 2.5GHz Gate Oscillation Requiring Gate Resistance Increase or Model Replacement, IR2104 Synchronous Buck Simulation Stuck at 0% from NMOS Switching Edge Convergence Failure Requiring Alternate Solver or Bordodynov Library, .op Operating Point Fails from Feedback Loop Instability Requiring Open-Loop Test and Nodeset Directives, LTspice 24.0.12 Convergence Bug at 80us from B-Source PFC Circuit Requiring Beta Update, and Transient Simulation Runs Infinitely from uic Option and Averaged Model Complexity Requiring Start Small Approach

LTspice's buck converter simulations, manufacturer MOSFET models, operating point calculations, and version updates produce errors from model stiffness, convergence failures, and software bugs. This guide covers the 5 most common LTspice problems with diagnostic steps and community-verified fixes from LTspice Groups.io and Stack Exchange.

## 1. Manufacturer SiC MOSFET Model Time-Step Too Small from 2.5GHz Gate Oscillation

### Error Message

"Time-step too small"

### Symptom

Simulating a simple buck converter using a GENESIC SiC MOSFET model. The simulation cannot converge. Most of the time the error is "time-step too small." Increasing gate resistance helps slightly but the simulation still gets stuck after 4-5 switching cycles. Default solver settings are used.

### Root Cause

The GENESIC SiC MOSFET SPICE model has a fundamental flaw causing 2.5 GHz oscillation at the gate nodes (gt and gb). This ultra-high-frequency oscillation forces LTspice to use extremely small time steps, eventually hitting the minimum time-step limit. The model is "really bad" according to community experts. The oscillation is internal to the model's subcircuit, not caused by the external circuit design.

### Fix

1. **Increase gate drive resistance**:
   - "Try changing the value of the two gate drive resistors. I used 4.7 ohm and it ran fine"
   - Increase gate resistance from default (e.g., 1-2 ohm) to 4.7 ohm or higher
   - This dampens the gate oscillation
   - "It improved a bit with the increased gate resistance but stuck again after 4-5 switching cycles"

2. **Replace with Wolfspeed SiC MOSFET model**:
   - "The spice model from GENESIC is really bad. If you look at the gt and gb nodes, they have a 2.5 GHz oscillation"
   - "I replaced the MOSFET parts with C3M0016120D devices from Wolfspeed"
   - "The simulation is completely stable in 2 ms and delivers very close to 200 VDC"
   - Use Wolfspeed C3M series SiC MOSFET models instead

3. **Use the Alternate solver**:
   - "I get error codes (e.g., 1.#QNAN volts) unless I switch to the Alternate solver"
   - "Even with the Alternate solver, it runs very slowly"
   - Settings > SPICE > Solver: Alternate
   - Note: LTspice saves this setting unless changed back

4. **Add parasitic components**:
   - "You might experiment with the parasitics in the manner described there"
   - "To see if you can overcome the problem without masking it by degrading the simulation"
   - Add gate-source capacitance (e.g., 100pF)
   - Add gate trace inductance (e.g., 5nH)

5. **Conform to datasheet timing**:
   - "I strictly conformed to the datasheet specs for rise and fall times with deadtime margin of a few times that"
   - "It produces 175V into a 5 ohm load"
   - Set rise/fall times per datasheet
   - Add adequate deadtime (3-5x rise/fall time)

6. **Contact manufacturer for fixed model**:
   - "You need to discard these parts or have GENESIC fix the encrypted library"
   - Report the 2.5 GHz oscillation to GENESIC
   - Request a corrected SPICE model
   - Use alternative parts until fixed

### Community Report

> "I cannot make it converge. Most of the time the error is 'time-step too small.' The spice model from GENESIC is really bad. If you look at the gt and gb nodes, they have a 2.5 GHz oscillation. You need to discard these parts or have GENESIC fix the encrypted library. I replaced the MOSFET parts with C3M0016120D devices from Wolfspeed. The simulation is completely stable."

## 2. IR2104 Synchronous Buck Simulation Stuck at 0% from NMOS Switching Edge

### Error Messages

- "Direct Newton iteration failed to find .op point"
- "Gmin stepping failed"
- "Source stepping failed"
- "Pseudo Transient failed in finding the operating point"
- "Simulation tolerance relaxed to achieve convergence"

### Symptom

Simulating a synchronous buck converter with IR2104 gate driver in LTspice. HO and LO outputs work correctly without the NMOS part. When the NMOS is connected, transient analysis won't go above 0%. Simulation stops exactly at the switching instance when HO goes low and LO goes high. Log file shows "Length shorter than recommended for a level 1 MOSFET" warnings.

### Root Cause

The IR2104 SPICE model's internal MOSFETs (level 1) have channel lengths shorter than recommended. At the switching edge (HO falling, LO rising), both MOSFETs may briefly conduct simultaneously, creating a shoot-through condition. The rapid current change causes convergence failure. The level 1 MOSFET model is too simple for accurate switching simulation.

### Fix

1. **Use Bordodynov's MOSFET library**:
   - "Maybe your model for MOSFETs is not working correctly. Try Bordodynov's excellent library"
   - Download from: http://bordodynov.ltwiki.org/
   - Replace the NMOS with a model from Bordodynov's library
   - These models are better behaved for switching simulations

2. **Switch to the Alternate solver**:
   - "I get error codes unless I switch to the Alternate solver"
   - Settings > SPICE > Solver: Alternate
   - The Alternate solver handles stiff switching better
   - Trade-off: slower simulation speed

3. **Add gate resistance**:
   - Add 4.7-10 ohm gate resistors to both MOSFETs
   - This slows down the switching edges
   - Reduces the shoot-through current spike
   - Improves convergence at switching points

4. **Increase deadtime**:
   - Add deadtime between HO and LO signals
   - Use pulse sources with delayed edges
   - Ensure both MOSFETs are off during transition
   - 50-200ns deadtime typically sufficient

5. **Use .option noopiter**:
   - "Use '.option noopiter' to skip" the operating point calculation
   - Add `.option noopiter` as a SPICE directive
   - This skips the initial DC operating point
   - Useful when operating point fails but transient works

6. **Use modified trap integration**:
   - "Method = modified trap" (default)
   - Try switching to "gear" integration
   - Settings > SPICE > Integration Method: Gear
   - Gear is more stable for switching circuits

7. **Start with simplified circuit**:
   - "I simulated your circuit in LTSpice and got no errors"
   - Some users report no issues with the same circuit
   - Check for wiring errors
   - Verify MOSFET model connections

### Community Report

> "Transient analysis won't go above 0% when I connect the NMOS part. Simulation stops exactly at the switching instance of HO goes to low and LO goes to high. Direct Newton iteration failed to find .op point. Gmin stepping failed. Maybe your model for MOSFETs is not working correctly. Try Bordodynov's excellent library."

## 3. .op Operating Point Fails from Feedback Loop Instability

### Error Messages

- "Direct Newton iteration failed to find .op point"
- "Gmin stepping failed"
- "Source stepping failed"
- "Pseudo Transient failed in finding the operating point"
- "Simulation Failed: Trouble releasing nodesets"

### Symptom

Running a buck converter simulation with `.op` SPICE directive. The operating point calculation fails with convergence errors. Replacing `.op` with `.tran 0 50ms 9ms uic` makes the transient simulation work, but `.op` still fails. The circuit includes a feedback loop with an op-amp and PWM modulator.

### Root Cause

The feedback loop creates a circular dependency in the DC operating point calculation. The op-amp output depends on the input, which depends on the output voltage, which depends on the op-amp output. The Newton iteration can't resolve this circular dependency. The `.tran` with `uic` (Use Initial Conditions) bypasses the operating point calculation, which is why it works.

### Fix

1. **Use .nodeset directives**:
   - "I recommend .nodeset v(3)=15 v(5)=5 v(6)=4.144 v(8)=0.536"
   - Provide initial voltage guesses for key nodes
   - This helps the Newton iteration converge
   - Start with approximate values from the `.tran` results

2. **Test in open-loop first**:
   - "I recommend to start small, with generic/simplified subcircuits and perhaps in open-loop"
   - "You externally fix the operating point with a dc source on the D input first"
   - "Once it converges ok — check the bias points are meaningful — then add the loop around it"
   - Disconnect the feedback, fix the duty cycle with a DC source

3. **Use .option noopiter**:
   - "Use '.option noopiter' to skip" the operating point
   - Add `.option noopiter` as a SPICE directive
   - Skips Newton iteration for operating point
   - Use with `.tran` with `uic`

4. **Add clamping to the PWM modulator**:
   - "Source B1 realizes the pulse-width modulator gain and clamps the maximum output below 1V"
   - "1V is a 100% duty ratio. These limits are important during the bias point determination"
   - Clamp the modulator output to 0-1V range
   - This prevents the operating point from diverging

5. **Use simplified op-amp model**:
   - "The op-amp is my generic model and I can easily set the output levels"
   - Use a simple voltage-controlled voltage source instead of a full op-amp model
   - Set gain and output limits explicitly
   - This reduces convergence difficulty

6. **Check power supply connections**:
   - "The most obvious problem is the power to the opamp U1"
   - "You have a 12V supply with its negative terminal connected to the opamp's positive supply pin"
   - "Try connecting the supply's positive terminal to the opamp + pin and the negative terminal to ground"
   - Verify all power connections are correct

7. **Use .tran with uic instead of .op**:
   - If `.op` consistently fails
   - Use `.tran 0 50ms 0 uic` to start from initial conditions
   - Read the steady-state values from the waveform
   - Use those values as `.nodeset` for future `.op` attempts

### Community Report

> "When I run the simulation with '.op' SPICE Directive, it fails with 'Direct Newton iteration failed to find .op point. Gmin stepping failed. Source stepping failed.' I recommend to start small, with generic/simplified subcircuits and perhaps in open-loop first. Once it converges ok, then add the loop around it. Use .nodeset directives with approximate values."

## 4. LTspice 24.0.12 Convergence Bug at 80us from B-Source PFC Circuit

### Symptom

A PFC-boost-flyback converter circuit simulates without problems in LTspice XVII (17.0.37.0). After updating to LTspice 24.0.12, the simulation has a convergence problem at 80us. The mains current I(V1) grows to kA and MA. Forcing convergence with `abstol=1E-9` produces results incompatible with XVII. The circuit contains only B-sources, ideal diodes, and switches.

### Root Cause

This is a confirmed bug in LTspice 24.0.12. "It's a very subtle bug in LTspice. Will be fixed in the next update of 24.1 beta." The bug affects B-source circuits with specific configurations. The new solver in LTspice 24 handles B-source evaluation differently, causing convergence failure at specific time points. The bug was not present in LTspice XVII.

### Fix

1. **Update to LTspice 24.1 beta or later**:
   - "It's a very subtle bug in LTspice. Will be fixed in the next update of 24.1 beta"
   - Check for beta updates on the Analog Devices website
   - Download and install the latest beta
   - The fix is specifically in the 24.1 beta channel

2. **Use LTspice XVII as workaround**:
   - "With the LTspice XVII (17.0.37.0) release the circuit could be simulated without any problems"
   - Keep LTspice XVII installed alongside LTspice 24
   - Use XVII for circuits that fail in 24
   - Both versions can coexist

3. **Don't use abstol workaround**:
   - "I can force convergence by setting abstol to 1E-9, but the results aren't compatible with the LTspice XVII results"
   - Changing abstol masks the bug but produces wrong results
   - Don't relax tolerances to force convergence
   - This gives false confidence in incorrect results

4. **Check for defcon messages in XVII**:
   - "It's not actually true that your schematics run 'without any problems' in XVII"
   - "There are a couple of defcons in the log file"
   - Check the XVII log file for defcon (definite convergence) messages
   - These indicate near-convergence failures even in XVII

5. **Simplify B-source expressions**:
   - Break complex B-source expressions into multiple simpler sources
   - Use intermediate nodes for multi-step calculations
   - This may avoid the specific code path that triggers the bug
   - Test each B-source independently

6. **Report new convergence bugs**:
   - "Thanks a lot for taking the time to report this. Your's is a great test case"
   - Report convergence bugs on EngineerZone
   - Provide the netlist (as PDF if .asc not accepted)
   - Include both XVII and 24 results for comparison

### Community Report

> "With the new release the simulation has a convergence problem at 80us, which can be traced to the mains current growing to kA and MA. I can force convergence by setting abstol to 1E-9, but the results aren't compatible with XVII. It's a very subtle bug in LTspice. Will be fixed in the next update of 24.1 beta."

## 5. Transient Simulation Runs Infinitely from uic Option and Averaged Model Complexity

### Symptom

Running a buck converter simulation with `.tran 0 50ms 9ms uic` directive. The simulation runs infinitely and must be halted. Replacing with `.op` directive causes convergence failure. The circuit uses an averaged PWM model with op-amp feedback.

### Root Cause

The `uic` (Use Initial Conditions) option skips the operating point calculation and starts from zero initial conditions. For circuits with feedback loops, the initial transient (from zero to steady-state) can be very long. The simulation may appear to run infinitely because it's slowly converging to steady-state. The averaged model's feedback loop creates oscillatory transient behavior that takes many cycles to settle.

### Fix

1. **Start with open-loop simulation**:
   - "I recommend to start small, with generic/simplified subcircuits and perhaps in open-loop"
   - "You externally fix the operating point with a dc source on the D input first"
   - Disconnect the feedback loop
   - Fix the duty cycle with a DC source on the modulator input

2. **Add .nodeset for faster convergence**:
   - "There are no .nodeset directives and the circuit converges ok"
   - But for slow-converging circuits, add nodeset:
   - `.nodeset v(out)=5 v(comp)=2.5`
   - This provides initial guesses, reducing transient settling time

3. **Use shorter simulation time**:
   - Instead of `.tran 0 50ms 9ms uic`
   - Try `.tran 0 5ms 0 uic` first
   - Check if the circuit is converging
   - Gradually increase simulation time

4. **Remove uic and use .op first**:
   - Try `.tran 0 50ms 9ms` (without uic)
   - This calculates the operating point first
   - If `.op` fails, use nodeset directives
   - The simulation starts from steady-state

5. **Simplify the averaged model**:
   - "Replace the simplified models with more comprehensive ones if need be"
   - Start with the simplest possible averaged model
   - Use an ideal voltage-controlled voltage source for the PWM
   - Add complexity gradually

6. **Clamp the modulator output**:
   - "Clamps the maximum output below 1V (1V is a 100% duty ratio)"
   - "These limits are important during the bias point determination"
   - Add clamping to the B-source PWM modulator
   - This prevents the duty cycle from exceeding 100%

7. **Use .ic instead of uic**:
   - `.ic v(out)=5 v(ind)=2.5`
   - Sets initial conditions for specific nodes
   - More controlled than uic (which zeros everything)
   - Helps the simulation start closer to steady-state

8. **Check for unintended feedback paths**:
   - Verify the feedback loop polarity
   - Check for unintended AC coupling
   - Ensure the compensation network is stable
   - An unstable compensation network causes endless oscillation

### Community Report

> "When I replace the '.op' with '.tran 0 50ms 9ms uic' Directive, the simulation runs infinitely, and I'm forced to halt it. I recommend to start small, with generic/simplified subcircuits and perhaps in open-loop first. Once it converges ok — check the bias points are meaningful — then add the loop around it. When it works, replace the simplified models with more comprehensive ones."

## 6. Additional LTspice Issues

### Gate Drive Resistor Tuning

**Issue**: Buck converter with SiC MOSFET doesn't converge even after replacing the model.
**Fix**: "I managed to get it working by observing that the Bode peak was at 3.9kHz and guessed that they use a multiple of that which falls in the datasheet bandwidth of 20k to 50k, so I used 39k. Then I strictly conformed to the datasheet specs for rise and fall times with deadtime margin."

### Input Voltage at T=0 Causes Problems

**Issue**: "Having input voltage present at T=0 seems to often cause problems."
**Fix**: "Best to have the input source step up after T=0 for some reason." Use a pulse source with delayed rise for the input voltage. This avoids the instantaneous application of full voltage.

### Current Source Load Issues

**Issue**: Current source as load causes convergence problems.
**Fix**: "When using a current source as a load, it helps to tick the 'load' box so that it can only absorb power and not provide it." This prevents the current source from acting as a power source during transient.

### Memory Requirements for Long Simulations

**Issue**: "10 million time points have to be stored, this requires 10 GB of memory."
**Fix**: Reduce simulation time or use `.save` directives to limit saved data. Uncheck "Save all currents" in transient setup. Use `.options plotwinsize=0` to disable compression.

### Reset to Default Settings

**Issue**: LTspice settings have been changed and simulations don't work.
**Fix**: "You can click the 'Reset to Default Settings' button on the Settings/Control Panel page." This resets all SPICE settings to defaults. You do not need to re-install LTspice.

## Best Practices

1. **Replace bad manufacturer MOSFET models with Wolfspeed** — GENESIC models have 2.5GHz oscillation
2. **Increase gate resistance to 4.7 ohm or higher** — dampens gate oscillation
3. **Use Bordodynov's MOSFET library** — better behaved for switching simulations
4. **Switch to Alternate solver for stiff circuits** — more stable but slower
5. **Test in open-loop before closing feedback** — isolates convergence issues
6. **Use .nodeset directives for operating point** — provides initial guesses
7. **Clamp PWM modulator output to 0-1V** — prevents operating point divergence
8. **Update to LTspice 24.1 beta for B-source bug fix** — 24.0.12 has convergence bug
9. **Keep LTspice XVII as fallback** — some circuits work in XVII but not 24
10. **Start with simplified models and add complexity gradually** — "start small" approach
