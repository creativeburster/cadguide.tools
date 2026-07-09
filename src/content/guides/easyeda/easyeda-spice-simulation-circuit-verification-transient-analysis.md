---
title: "EasyEDA SPICE Simulation: Circuit Verification Before PCB Layout"
excerpt: "How to use EasyEDA's built-in SPICE simulation to verify circuits before PCB layout — covering component selection with SPICE models, DC/AC/transient analysis, waveform interpretation, and common simulation pitfalls."
category: "workflow"
softwareSlug: "easyeda"
keyword: "easyeda spice simulation circuit verification transient analysis waveform"
slug: "easyeda-spice-simulation-circuit-verification-transient-analysis"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-09"
sources:
  - "https://docs.easyeda.com/en/PCB/Gerber-Generate/index.html"
  - "https://prodocs.easyeda.com/en/faq/pcb/"
---

# EasyEDA SPICE Simulation: Circuit Verification Before PCB Layout

SPICE simulation in EasyEDA is one of its underrated features. Most users go straight from schematic to PCB without simulating. I've caught design errors in simulation that would have cost me a board spin — oscillating op-amps, wrong RC time constants, insufficient margin on voltage dividers. EasyEDA's built-in SPICE lets you verify before you manufacture. Here's how to use it.

## What EasyEDA SPICE Can Do

EasyEDA includes a cloud-based SPICE engine (based on ngspice) that supports:

- **DC Operating Point**: Steady-state voltages and currents
- **DC Sweep**: Vary a DC source and observe the response
- **AC Analysis**: Frequency response (Bode plot)
- **Transient Analysis**: Time-domain response
- **Fourier Analysis**: Harmonic content of signals

## Step 1: Use Components with SPICE Models

Not all EasyEDA components have SPICE models. To simulate:

1. In the component library, look for the **SPICE** icon or badge.
2. Components with SPICE models include:
   - **Basic components**: Resistors, capacitors, inductors, diodes
   - **Transistors**: BJT (NPN/PNP), MOSFETs
   - **Op-amps**: Common models (LM358, LM324, TL082, OP07)
   - **Voltage/Current sources**: DC, AC, pulse, sine, exponential
   - **Switches**: Voltage-controlled, current-controlled
3. If a component doesn't have a SPICE model:
   - Find an equivalent with a SPICE model
   - Or create a custom SPICE model (advanced)

### Checking for SPICE Models

1. Place a component on the schematic.
2. Double-click it to open the properties panel.
3. Look for **SPICE Model** in the properties.
4. If present, the component can be simulated.
5. If absent, the component will be ignored in simulation.

## Step 2: Add Simulation Sources

Every simulation needs at least one source:

### DC Source
1. Search for "Voltage Source" in the library.
2. Place it on the schematic.
3. Double-click to set the voltage value (e.g., 5V, 12V).

### AC Source (for AC Analysis)
1. Place a voltage source.
2. Set the **AC Amplitude** and **AC Phase** in the properties.
3. Used for frequency response analysis.

### Pulse Source (for Transient Analysis)
1. Place a voltage source.
2. Set pulse parameters:
   - **Initial value**: 0V
   - **Pulsed value**: 5V
   - **Delay time**: 0s
   - **Rise time**: 1µs
   - **Fall time**: 1µs
   - **Pulse width**: 10µs
   - **Period**: 20µs

### Sine Source (for Transient Analysis)
1. Place a voltage source.
2. Set sine parameters:
   - **DC offset**: 0V
   - **Amplitude**: 1V
   - **Frequency**: 1kHz
   - **Delay time**: 0s
   - **Damping factor**: 0

## Step 3: Add Probe Points

To observe simulation results:

1. Click **Simulation** → **Probe**.
2. Click on a net or component pin to add a probe.
3. Probes can measure:
   - **Voltage**: At any node (relative to ground)
   - **Current**: Through any component
   - **Power**: Dissipated by any component
4. Add probes at critical points:
   - **Output nodes**: Where you want to see the result
   - **Input nodes**: To verify the input signal
   - **Intermediate nodes**: To debug internal behavior

## Step 4: Run DC Operating Point Analysis

DC analysis calculates the steady-state voltages and currents:

1. Click **Simulation** → **DC OP**.
2. The simulation runs and displays:
   - Voltage at each probed node
   - Current through each probed component
3. Verify:
   - **Bias voltages**: Are transistor bases/emitters/collectors at expected levels?
   - **Op-amp outputs**: Are they in the linear range (not saturated)?
   - **Currents**: Are currents within component ratings?

### DC OP Use Cases

- **Voltage divider verification**: Check that the output voltage is correct
- **Transistor biasing**: Verify quiescent operating point
- **Op-amp biasing**: Check that the output is in the linear range
- **Power consumption**: Calculate total power draw

## Step 5: Run Transient Analysis

Transient analysis shows the time-domain response:

1. Click **Simulation** → **Transient**.
2. Set parameters:
   - **Start time**: 0s
   - **Stop time**: Depends on the signal frequency (e.g., 10ms for 1kHz)
   - **Step time**: 1/1000 of the stop time (e.g., 10µs for 10ms stop)
3. Click **Run**.
4. The waveform viewer displays:
   - X-axis: Time
   - Y-axis: Voltage or current
   - Multiple traces overlaid

### Interpreting Transient Results

- **Oscillation**: If the output oscillates when it shouldn't, check for:
  - Missing decoupling capacitors
  - Unstable feedback network
  - Wrong op-amp compensation

- **Ringing**: If the step response has excessive ringing:
  - Add a snubber circuit
  - Adjust the feedback compensation
  - Check for parasitic inductance/capacitance

- **Clipping**: If the output clips:
  - Check the supply voltage is sufficient
  - Verify the input signal amplitude
  - Check op-amp slew rate

- **Time constant**: For RC/RL circuits, verify the time constant matches calculations:
  - τ = RC for RC circuits
  - τ = L/R for RL circuits

## Step 6: Run AC Analysis (Frequency Response)

AC analysis shows the frequency response:

1. Click **Simulation** → **AC**.
2. Set parameters:
   - **Start frequency**: e.g., 1Hz
   - **Stop frequency**: e.g., 1MHz
   - **Points per decade**: 10-100
3. Click **Run**.
4. The Bode plot displays:
   - **Magnitude**: Gain in dB vs frequency
   - **Phase**: Phase shift in degrees vs frequency

### Interpreting AC Results

- **Cutoff frequency**: Where the gain drops by 3dB
- **Bandwidth**: Range between the lower and upper cutoff frequencies
- **Gain margin**: How much gain can be added before oscillation (should be > 6dB)
- **Phase margin**: How much phase shift can be added before oscillation (should be > 45°)
- **Resonance**: Peak in the magnitude plot indicating a resonant frequency

### AC Analysis Use Cases

- **Filter design**: Verify cutoff frequency and roll-off
- **Amplifier stability**: Check gain and phase margins
- **Frequency response**: Characterize the circuit's behavior across frequencies
- **Oscillator verification**: Confirm the oscillation condition is met

## Step 7: Debug Common Simulation Problems

### "Simulation Failed — No Convergence"

1. **Check for floating nodes** — every node needs a DC path to ground
2. **Add a large resistor (1GΩ) to ground** on floating nodes
3. **Check for voltage source loops** — two voltage sources in parallel without resistance
4. **Reduce the simulation step time** — smaller steps improve convergence
5. **Check initial conditions** — set IC values for capacitors if needed

### "No SPICE Model Found"

1. The component doesn't have a SPICE model attached.
2. Find an equivalent component with a SPICE model.
3. Or manually attach a SPICE model:
   - Download a .sub or .lib file
   - In the component properties, paste the SPICE model text
   - Map the model pins to the component pins

### "Results Don't Match Expected Behavior"

1. **Check component values** — verify resistor/capacitor values are correct
2. **Check source parameters** — verify voltage, frequency, amplitude
3. **Check op-amp model** — is the correct op-amp model selected?
4. **Check wiring** — is the schematic wired correctly?
5. **Check ground** — is there a proper ground reference?

### "Simulation Is Too Slow"

1. **Increase the step time** — fewer simulation points
2. **Reduce the stop time** — simulate a shorter period
3. **Simplify the circuit** — remove non-essential components
4. **Use DC OP first** — verify biasing before transient

## Step 8: From Simulation to PCB

After successful simulation:

1. **Verify all component values** — simulation values must match PCB values
2. **Check component availability** — ensure simulated components are available for assembly
3. **Add decoupling capacitors** — if not in the simulation, add them before PCB layout
4. **Consider parasitics** — PCB traces add resistance, inductance, and capacitance not in the simulation
5. **Proceed to PCB layout** — convert the verified schematic to PCB

### Simulation vs Reality

SPICE simulation is an approximation. Real circuits have:
- **Component tolerances**: ±5% resistors, ±20% capacitors
- **Temperature effects**: Component values change with temperature
- **Parasitic elements**: Trace inductance, pad capacitance
- **Non-ideal sources**: Real voltage sources have output impedance

Use simulation to verify the design concept, but always prototype and test on real hardware.

## Best Practices

- **Simulate before PCB layout** — catches errors before manufacturing
- **Use components with SPICE models** — check before placing
- **Start with DC OP** — verify biasing before transient or AC
- **Add probes at critical nodes** — output, feedback, intermediate stages
- **Verify time constants** — compare simulation with hand calculations
- **Check op-amp stability** — use AC analysis for gain and phase margins
- **Don't trust simulation blindly** — prototype and measure real behavior
- **Document simulation results** — save screenshots and parameters for reference
- **Simulate edge cases** — min/max supply voltage, temperature extremes, load variations
