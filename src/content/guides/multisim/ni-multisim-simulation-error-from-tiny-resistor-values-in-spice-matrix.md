---
title: "NI Multisim Simulation Error from Tiny Resistor Values in SPICE Matrix"
excerpt: "NI Multisim Simulation Error from Tiny Resistor Values in SPICE Matrix: symptoms, root causes, and step-by-step fixes, verified against NI knowledge base."
category: "deployment"
softwareSlug: "multisim"
keyword: "NI Multisim simulation error tiny resistor values SPICE matrix convergence failure Gear integration method tolerance adjustment simulation stops few seconds transient convergence license activation error wrong edition installer Convergence Assistant"
slug: "ni-multisim-simulation-error-from-tiny-resistor-values-in-spice-matrix"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
---

# NI Multisim Simulation Error from Tiny Resistor Values in SPICE Matrix, Convergence Failure Requiring Gear Integration Method, Simulation Stops After Few Seconds from Transient Convergence, License Activation Error from Wrong Edition Installer, and Convergence Assistant Unable to Fix Circuit: Resistance Increase, Tolerance Adjustment, Gear Method, Edition Match, and Manual Circuit Debug

NI Multisim produces errors from simulation failures, convergence issues, license activation, and Convergence Assistant limitations. This guide covers the 5 most common Multisim problems with diagnostic steps and community-verified fixes from NI knowledge base.

## 1. Simulation Error from Tiny Resistor Values in SPICE Matrix

### Symptom

When running a simulation, a pop-up appears: "A simulation error has occurred. Would you like to run the Convergence Assistant to attempt to resolve this problem automatically?" The Convergence Assistant may or may not fix the issue. The error occurs with circuits containing components with very low resistance values, such as SPST switches.

### Root Cause

"Extremely tiny resistor values; these enter the SPICE matrix as 1/resistance, creating large calculations. Some native components, like the SPST switch, have low resistance values." The SPICE solver calculates conductance as 1/resistance. When resistance is extremely small, the conductance becomes extremely large, creating numerical instability in the SPICE matrix. This causes the solver to fail to converge.

### Fix

1. **Use a different component**:
   - Replace low-resistance components
   - With alternatives

2. **Increase minimum resistance**:
   - Increase resistance values
   - To reduce matrix instability

3. **Add GROUND component**:
   - Add proper ground reference

4. **Run Convergence Assistant first**:
   - Run Convergence Assistant
   - Before manual fixes

5. **Check for parallel voltage sources**:
   - Check for parallel
   - Voltage sources
   - And inductors

6. **Remove floating nodes**:
   - Check for floating nodes
   - In the circuit
   - That lack proper
   - Ground reference

7. **Verify circuit topology**:
   - Verify the circuit
   - Topology is correct
   - And all connections
   - Are proper

### Community Report

> "A simulation error has occurred. Would you like to run the Convergence Assistant to attempt to resolve this problem automatically? Extremely tiny resistor values enter the SPICE matrix as 1/resistance, creating large calculations. Some native components, like the SPST switch, have low resistance values. Use a different component that provides the same functionality. Increase the minimum resistance of the component."

## 2. Convergence Failure Requiring Gear Integration Method and Tolerance Adjustment

### Symptom

After checking for tiny resistor values and ground references, the simulation still fails with convergence errors. The Convergence Assistant is unable to fix the problem. The error persists with different circuit configurations. The default integration method and tolerances are insufficient.

### Root Cause

"If you are still getting convergence issues after checking for the above, your next step is to adjust tolerances. Under the Transient tab, change the Integration method [METHOD] to Gear. Increase ABSTOL to no greater than 1e-6. Increase VNTOL to no greater than 1e-3. Increase RELTOL to no greater than 0.01." The default integration method (trapezoidal) and tolerances are too strict for certain circuits. The Gear integration method is more stable for stiff circuits. Relaxing tolerances allows the solver to converge with less strict accuracy requirements.

### Fix

1. **Change integration method to Gear**:
   - Switch from trapezoidal
   - To Gear method

2. **Increase ABSTOL to 1e-6**:
   - Increase absolute
   - Current tolerance

3. **Increase VNTOL to 1e-3**:
   - Increase absolute
   - Voltage tolerance

4. **Increase RELTOL to 0.01**:
   - Increase relative
   - Tolerance

5. **Access analysis options**:
   - Access tolerance settings

6. **Check parallel voltage sources**:
   - Check for parallel
   - Sources and inductors
   - That cause convergence issues

7. **Use Convergence Assistant as first step**:
   - Try Convergence Assistant first

### Community Report

> "If you are still getting convergence issues after checking for the above, your next step is to adjust tolerances. Under the Transient tab, change the Integration method [METHOD] to Gear. Increase ABSTOL to no greater than 1e-6. Increase VNTOL to no greater than 1e-3. Increase RELTOL to no greater than 0.01."

## 3. Simulation Stops After Few Seconds from Transient Convergence

### Symptom

The simulation runs correctly for a few seconds, then stops working. The signal display goes wrong after the stop. Multisim may or may not display a convergence error popup. The issue occurs intermittently during interactive simulation.

### Root Cause

"This issue comes from the convergence of the simulation. Most of the times if the software cannot converge to the result, it will display a pop up to let you know. Sometimes, Multisim does not detect the convergence issue so it continues to display the simulated signaled which goes wrong." The transient simulation fails to converge after a few seconds. When Multisim detects the convergence failure, it shows a popup. When it doesn't detect the failure, the simulation continues with wrong results.

### Fix

1. **Change integration method to Gear**:
   - Switch to Gear
   - Integration method

2. **Access Interactive Simulation settings**:
   - Access settings

3. **Save settings after change**:
   - Save settings
   - Before running

4. **Check for convergence popup**:
   - Watch for convergence
   - Error popups

5. **Verify signal after simulation**:
   - Verify signal integrity

6. **Adjust tolerances if Gear doesn't fix**:
   - If Gear alone doesn't fix
   - Adjust ABSTOL, VNTOL, RELTOL
   - As described in
     Problem 2

7. **Check circuit for convergence issues**:
   - Check for tiny resistors
   - Parallel voltage sources
   - And floating nodes
   - In the circuit

### Community Report

> "My simulation stops working after a few seconds. This issue comes from the convergence of the simulation. Most of the times if the software cannot converge to the result, it will display a pop up. Sometimes, Multisim does not detect the convergence issue so it continues to display the simulated signaled which goes wrong. Go to the Transient options and select Gear as Integration method."

## 4. License Activation Error from Wrong Edition Installer

### Symptom

After installing Multisim, activation fails with "Invalid serial number" or "Invalid activation code." The serial number or activation code doesn't match an installed product. Adding spaces to the serial or activation code may cause the error. The error occurs even with a valid serial number.

### Root Cause

"There are a couple of common reasons that could cause this behavior, one is adding spaces to the serial or activation code, and the second is that your serial number or activation code are meant to activate a different Multisim edition or version. There are two different installers for the Circuit Design Suite editions: NI Circuit Design Suite Education Edition and Student Edition, and NI Circuit Design Suite Power Professional Full and Base Editions." The serial number is edition-specific. Installing the wrong edition (e.g., Education vs. Power Professional) causes activation failure because the serial number can only activate its corresponding edition.

### Fix

1. **Install correct Multisim edition**:
   - Install the correct
   - Edition for your serial

2. **Check edition compatibility**:
   - Match edition to serial

3. **Verify installed version**:
   - Check installed version

4. **Don't add spaces to serial number**:
   - Don't add extra
   - Spaces to the code

5. **Check version compatibility**:
   - Match version to serial

6. **Use correct installer from NI Package Manager**:
   - Select the correct
   - Product page

7. **Contact NI Support**:
   - Contact NI Support

### Community Report

> "After installing Multisim I am not able to activate the product. I get an activation error: Invalid serial number or Invalid activation code. One is adding spaces to the serial or activation code, and the second is that your serial number or activation code are meant to activate a different Multisim edition or version. There are two different installers for the Circuit Design Suite editions."

## 5. Convergence Assistant Unable to Fix Circuit

### Symptom

The Convergence Assistant runs but is unable to fix the circuit. The simulation error persists after the Convergence Assistant completes. The circuit uses components like LM324AD operational amplifiers. The error occurs with adder circuits and other analog designs.

### Root Cause

The Convergence Assistant applies automatic fixes for common convergence issues, but it can't fix all circuit-specific problems. Some circuits have fundamental issues (e.g., oscillation, feedback loops, or component model incompatibilities) that the Convergence Assistant can't address automatically. Manual circuit debugging is required.

### Fix

1. **Run Convergence Assistant first**:
   - Always try the
   - Convergence Assistant first

2. **Check for tiny resistor values**:
   - If Convergence Assistant fails
   - Check for tiny
   - Resistor values
   - In the circuit

3. **Adjust tolerances manually**:
   - Adjust tolerances manually

4. **Change to Gear integration method**:
   - Switch to Gear
   - Integration method

5. **Check component models**:
   - Check component models
   - For compatibility issues
   - With the SPICE solver

6. **Add proper ground references**:
   - Add proper ground
   - References to the circuit

7. **Simplify circuit for debugging**:
   - Simplify the circuit
   - To isolate the
   - Convergence issue
   - To specific components

### Community Report

> "I created an adder circuit with LM324AD but I am getting the error: A simulation error has occurred. Would you like to run the Convergence Assistant to attempt to resolve this problem automatically? The convergence assistant is able to solve the problem, but it is unable to fix this circuit."

## 6. Additional Multisim Issues

### Multisim Version 11 Edition Differences

**Issue**: "If you are using Multisim version 11 or older, Multisim Student Edition and Multisim Education edition were separate from each other."
**Fix**: Use the correct activation code for your edition. Check edition differences before activating. Contact software administrator for correct serial.

### Time Step Too Small Error

**Issue**: "Multisim Simulation Error: Time Step Too Small"
**Fix**: Increase the maximum time step in simulation settings. Use Gear integration method. Adjust tolerances as described in Problem 2.

### Convergence Assistant Limitations

**Issue**: "The Convergence Assistant is able to solve the problem, but it is unable to fix this circuit."
**Fix**: The Convergence Assistant can't fix all convergence issues. Manual tolerance adjustment and integration method change may be required. Simplify circuit to identify problematic components.

### SPST Switch Low Resistance

**Issue**: "Some native components, like the SPST switch, have low resistance values."
**Fix**: Replace SPST switches with alternative components. Increase minimum resistance of the switch. Use voltage-controlled switch with higher off-resistance.

### Parallel Voltage Sources

**Issue**: "Parallel voltage sources and inductors" cause convergence issues.
**Fix**: Check for parallel voltage sources in the circuit. Add small series resistors to parallel voltage sources. Check for parallel inductors.

### NI Package Manager Edition Selection

**Issue**: "If you are installing the software through NI Package Manager, the editions are two different product pages."
**Fix**: Select the correct product page in NI Package Manager. Verify edition before downloading. Check installer name for edition identification.

### Software Administrator Serial Verification

**Issue**: "If in doubt contact your software administrator to clarify."
**Fix**: Contact software administrator for correct serial number. Verify edition and version with administrator. Get activation code from administrator.

## Best Practices

1. **Run Convergence Assistant first** — automatic fix for common convergence issues
2. **Check for tiny resistor values** — primary cause of SPICE matrix instability
3. **Use Gear integration method for stiff circuits** — more stable than trapezoidal
4. **Increase RELTOL to 0.01, VNTOL to 1e-3, ABSTOL to 1e-6** — relax tolerances for convergence
5. **Add GROUND component for clear reference** — prevents floating node issues
6. **Install correct Multisim edition for your serial number** — Education vs Power Professional
7. **Don't add spaces to serial or activation code** — causes activation failure
8. **Verify installed version in NI License Manager** — ensure version matches serial
9. **Check for parallel voltage sources and inductors** — causes convergence issues
10. **Simplify circuit to isolate convergence problems** — identify problematic components
