---
title: "NI Multisim SPICE Simulation: DC, AC, Transient Analysis Setup and Common Errors"
excerpt: "Set up and run DC operating point, AC sweep, and transient simulations in NI Multisim with proper SPICE model configuration, measurement probes, and convergence troubleshooting."
category: "workflow"
softwareSlug: "multisim"
keyword: "multisim spice simulation dc ac transient analysis"
slug: "multisim-spice-simulation-dc-ac-transient-analysis-setup"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.ni.com/en/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim/spice-simulation-fundamentals/spice-simulation-overview.html"
  - "https://www.ni.com/en/shop/electronic-test-instrumentation/application-software-for-electronic-test-and-instrumentation-category/what-is-multisim/spice-simulation-fundamentals.html"
---

# NI Multisim SPICE Simulation: DC, AC, Transient Analysis Setup and Common Errors

Multisim translates your schematic into a SPICE netlist automatically, but understanding what happens behind the scenes helps you diagnose simulation failures. We've taught Multisim to hundreds of students and engineers, and the same issues come up every time.

## DC Operating Point Analysis

DC analysis calculates the steady-state voltages and currents in your circuit with capacitors open and inductors shorted. It's the first simulation you should run on any new design.

### Setup

1. Go to **Simulate > Analyses and Simulation > DC Operating Point**
2. Select the output variables you want to measure (node voltages, branch currents)
3. Click **Run**

### Common Errors

**"Singular matrix" or "Node X is floating"** — this means a node has no DC path to ground. SPICE requires every node to have a finite resistance to ground. Fix by:
- Adding a ground symbol to the floating node
- Adding a high-value resistor (1 GΩ) from the floating node to ground
- Checking that voltage sources aren't creating isolated loops

**"Iteration limit reached"** — the Newton-Raphson solver couldn't converge. This is common with nonlinear elements like diodes and transistors. Fix by:
- Adding `.NODESET` directives to give the solver initial voltage guesses
- Using the GMIN stepping option in simulation parameters
- Checking for unrealistic component values

## AC Sweep Analysis

AC analysis linearizes the circuit around the DC operating point and calculates the frequency response. It's used for filter design, amplifier gain, and phase margin analysis.

### Setup

1. Go to **Simulate > Analyses and Simulation > AC Sweep**
2. Set the frequency range (FSTART to FSTOP)
3. Choose sweep type: Linear, Decade, or Octave
4. Set the number of points per decade
5. Add an AC magnitude to your input source (typically 1V)

### Common Errors

**Flat response when you expect a filter shape** — the AC source doesn't have an AC magnitude set. Double-click the source and set the AC Analysis Magnitude to 1V.

**Wrong DC operating point affecting AC results** — AC analysis depends on the DC bias. If the DC operating point is wrong (e.g., a transistor is in cutoff instead of active), the AC results will be meaningless. Always check DC results first.

## Transient Analysis

Transient analysis computes voltages and currents over time, showing the actual waveforms. It's the most computationally intensive analysis.

### Setup

1. Go to **Simulate > Analyses and Simulation > Transient**
2. Set **Start time** (usually 0) and **Stop time** (enough to see steady state)
3. Set **Maximum time step** — too large misses detail, too small slows simulation
4. For oscillators, enable **Use initial conditions** to start from a perturbed state

### Common Errors

**"Time step too small"** — the solver reduced the time step below its minimum limit. Causes include:
- Ideal switches with zero resistance creating discontinuities
- Fast transitions on digital inputs (use rise/fall time instead of instant)
- Stiff circuits with widely separated time constants

Fix by:
- Setting a minimum time step in the analysis parameters
- Adding parasitic resistance to ideal switches
- Using the Gear integration method instead of trapezoidal

**Oscillator won't start** — oscillators need an initial perturbation to begin. Add an initial condition (IC) on a capacitor or use a pulse source to kick-start the circuit.

## SPICE Model Issues

### Third-Party Models

When importing SPICE models from manufacturers:

1. Check the model syntax — Multisim uses XSPICE, which supports most PSpice syntax
2. Place the model file in the Multisim user database
3. Link the model to a symbol with the correct pin order
4. Verify pin order matches between the symbol and the .SUBCKT definition

### Model Parameter Units

SPICE model parameters have specific units that aren't always obvious. For example:
- `IS` (saturation current) is in amps
- `BF` (forward beta) is dimensionless
- `CJC` (zero-bias collector capacitance) is in farads

Check the SPICE reference for your component type to ensure parameters are correct.

## Best Practices

- **Always run DC first** — if DC doesn't converge, AC and transient won't either
- **Label nodes** — makes error messages and measurements much easier to interpret
- **Use measurement probes** for quick voltage/current readings without setting up full analyses
- **Start simple** — test subcircuits individually before simulating the full design
- **Check the netlist** — View > Show SPICE Netlist to see what Multisim actually generates
