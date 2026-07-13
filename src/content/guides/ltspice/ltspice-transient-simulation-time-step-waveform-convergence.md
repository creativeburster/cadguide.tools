---
title: "LTspice Transient Simulation: Time Step, Waveform Analysis, and Convergence Fixes"
excerpt: "Configure LTspice transient simulations with proper time step settings, waveform measurement, FFT analysis, and convergence troubleshooting for switching circuits and analog designs."
category: "workflow"
softwareSlug: "ltspice"
keyword: "ltspice transient simulation time step convergence"
slug: "ltspice-transient-simulation-time-step-waveform-convergence"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/c/getting-started-with-ltspice"
  - "https://next.gr/tutorials/simulation-software-ltspice/ltspice-simulation-tutorial"
---

# LTspice Transient Simulation: Time Step, Waveform Analysis, and Convergence Fixes

Transient simulation is the core of LTspice — it's what the tool was built for. Analog Devices optimized the solver for switching regulator simulation, and once you understand the time step mechanics, you can simulate circuits that would take hours in other SPICE tools in minutes.

## Setting Up a Transient Simulation

Open the simulation command dialog with **Simulate > Edit Simulation Cmd > Transient**:

- **Stop time** — the total simulation duration. For a 100 kHz SMPS, 10 ms gives you 1000 switching cycles.
- **Time to start saving data** — skip the startup transient. For SMPS, set this to 5 ms so you only save steady-state data.
- **Maximum timestep** — controls simulation resolution. For a 100 kHz SMPS, 100 ns is reasonable.
- **Start external DC supply voltages at 0V** — ramps supplies from zero, useful for startup analysis.

The ratio of stop time to maximum timestep determines how many data points are computed. Too many points clutter the waveform and slow the simulation; too few miss important details.

## Time Step Strategy

### For Switching Circuits

Set the maximum timestep to approximately 1/100 of the switching period. For a 500 kHz SMPS (2 µs period), use 20 ns. This gives enough resolution to see switching transitions without excessive computation.

### For Analog Amplifiers

Set the timestep to 1/1000 of the signal period. For a 1 kHz audio signal, use 1 µs. Audio circuits need finer resolution because you're looking for small distortion components.

### For Startup Transients

Don't set a maximum timestep — let LTspice choose adaptively. The solver will use small steps during fast transitions and large steps during quiet periods, optimizing speed.

## Waveform Analysis

### Probing Voltages and Currents

After running the simulation, click any wire to see its voltage waveform. Click any component to see its current. Hover over a component to see instantaneous voltage, current, and power in the status bar.

### Differential Measurement

To measure the voltage difference between two nodes, click the first node, then drag to the second node. LTspice displays the differential voltage.

### Power Dissipation

To plot power dissipation in a component, Alt-click the component (not just click). LTspice plots V×I for that component. This is essential for thermal analysis of MOSFETs and diodes.

### FFT Analysis

To see the frequency content of a waveform:

1. Click the waveform pane to make it active
2. Go to View > FFT
3. Select the signal to analyze
4. Set the number of FFT points (use a power of 2)

For SMPS efficiency calculations, the FFT reveals harmonic content and EMI characteristics.

### .meas Statements

Use `.meas` directives to extract numerical values from the simulation:

```
.meas TRAN Vout_avg AVG V(out) FROM 5m TO 10m
.meas TRAN Vout_pp PP V(out) FROM 5m TO 10m
.meas TRAN freq_param PARAM (1/(time_to_first_peak))
```

These results appear in the SPICE Error Log (View > SPICE Error Log).

## Convergence Troubleshooting

### "Time step too small"

This is the most common LTspice error. The solver reduced the timestep below its minimum trying to resolve a discontinuity.

**Fixes:**

1. **Add .options cshunt=1p** — places a 1 pF capacitor from every node to ground, suppressing floating node oscillations
2. **Enable Alternate solver** — Control Panel > SPICE > Solver > Alternate. This uses a different integration method that handles stiff circuits better
3. **Add parasitic resistance to switches** — ideal voltage-controlled switches with zero resistance create discontinuities. Set RON to 1 mΩ and ROFF to 1 MΩ
4. **Soften diode models** — set Vj to 0.3 and N to 2 to round the knee
5. **Reduce reltol** — Control Panel > SPICE > reltol, change from 0.001 to 0.01

### "Singular matrix"

A node has no DC path to ground. Check for:
- Floating nodes (add 1 GΩ to ground)
- Capacitor-coupled nodes without bias resistors
- Transformer secondaries without ground reference

### Oscillator won't start

Add an initial condition:
```
.ic V(osc)=1m
```
Or use a brief pulse to kick-start the circuit.

## Best Practices

- **Use .save directives** to limit data storage — only save nodes you care about
- **Set startup data delay** to avoid saving the initial transient for steady-state analysis
- **Use .step param** to sweep component values and compare results
- **Check the SPICE Error Log** for convergence warnings even when the simulation appears to work
- **Use the Alternate solver** for circuits that repeatedly fail with the default solver
