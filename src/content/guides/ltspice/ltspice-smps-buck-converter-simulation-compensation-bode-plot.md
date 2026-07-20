---
title: "LTspice SMPS Buck Converter Simulation: Compensation Loop, Bode Plot, and Load Transient"
excerpt: "Simulate buck converter SMPS in LTspice with transient analysis, AC loop gain measurement using .meas statements, Bode plot extraction, and load transient response optimization."
category: "workflow"
softwareSlug: "ltspice"
keyword: "ltspice smps buck converter simulation bode plot compensation"
slug: "ltspice-smps-buck-converter-simulation-compensation-bode-plot"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/c/getting-started-with-ltspice"
  - "https://www.analog.com/ltspice"
---

# LTspice SMPS Buck Converter Simulation: Compensation Loop, Bode Plot, and Load Transient

LTspice was originally built for switching regulator simulation, and it remains the best free tool for this purpose. Analog Devices optimized the solver for the fast transitions and long simulation times that SMPS designs require. Here's how to set up a complete buck converter simulation including loop compensation analysis.

## Building the Buck Converter Schematic

Start with the basic topology:

1. **Input voltage source** — use a DC source (V1) at your input voltage (e.g., 12V)
2. **Switching MOSFET** — use a voltage-controlled switch (SW) or a N-channel MOSFET model
3. **Diode** — use a Schottky diode model for synchronous buck, or a second MOSFET
4. **Inductor** — typically 1-10 µH for a 500 kHz buck
5. **Output capacitor** — 22-100 µF with ESR
6. **Load resistor** — representing the output current

For the PWM controller, use a pulse voltage source driving the switch:
- Von = 5V, Voff = 0V
- Period = 2 µs (500 kHz)
- Ton = duty cycle × period
- Tdelay = 0, Trise = 10ns, Tfall = 10ns

## Running the Transient Simulation

Set up the transient analysis:

- **Stop time**: 10 ms (5000 switching cycles)
- **Start saving data**: 5 ms (skip startup transient)
- **Maximum timestep**: 20 ns (1/100 of switching period)

Run the simulation and probe the output voltage. You should see the steady-state ripple. Use `.meas` to extract the average output voltage:

```
.meas TRAN Vout_avg AVG V(out) FROM 5m TO 10m
.meas TRAN Vout_pp PP V(out) FROM 5m TO 10m
```

## AC Loop Gain Measurement (Bode Plot)

To measure the loop gain and phase margin, you need to inject a small AC signal into the feedback path. The standard method:

1. **Break the feedback loop** at the error amplifier output
2. **Insert an AC source** (2V amplitude) in series with the feedback
3. **Run an AC analysis** (.ac dec 100 1k 1Meg)
4. **Measure loop gain** as V(out)/V(inj) at the injection point

Alternatively, use the Middlebrook method:

1. Place a small AC source (1 mV) in series with the feedback resistor
2. Run transient simulation with this perturbation
3. Use `.meas` to compute gain and phase at specific frequencies
4. Step the frequency with `.step param freq` and collect results

For a properly compensated buck converter, you should see:
- **Crossover frequency**: 1/10 to 1/5 of switching frequency
- **Phase margin**: > 45 degrees
- **Gain margin**: > 10 dB

## Load Transient Response

To simulate load transient behavior:

1. Replace the fixed load resistor with a current source
2. Use a PULSE source to step the load current:
   ```
   Iload 0 1 PULSE(1A 3A 6m 1u 1u 2m 10m)
   ```
   This steps from 1A to 3A at t=6ms, holds for 2ms, then returns to 1A
3. Run the transient simulation and observe the output voltage deviation

A well-compensated converter should settle within 200-500 µs with minimal overshoot/undershoot.

## Compensation Network Design

For a voltage-mode buck converter, use a Type III compensation network:

1. **Place the compensation around the error amplifier**
2. **Set the zero frequencies** at the LC double pole (f_LC = 1/(2π√(LC)))
3. **Set the pole frequencies** at the ESR zero (f_ESR = 1/(2π×ESR×Cout)) and at half the switching frequency
4. **Set the mid-band gain** to achieve the desired crossover frequency

Simulate the loop gain with different compensation values using `.step param`:

```
.step param Ccomp list 100p 220p 470p 1n
```

This runs the simulation four times, once for each capacitor value, letting you compare results.

## Efficiency Measurement

To calculate efficiency:

```
.meas TRAN Pin AVG V(in)*I(V1) FROM 5m TO 10m
.meas TRAN Pout AVG V(out)*I(Iload) FROM 5m TO 10m
.meas TRAN Eff PARAM (Pout/Pin*100)
```

The results appear in the SPICE Error Log. This is invaluable for optimizing component selection — you can compare different MOSFET models, inductor values, and switching frequencies.

## Common Pitfalls

### Simulation Takes Too Long

If a 10 ms simulation takes hours:
- Increase the maximum timestep
- Use `.save` to limit which nodes are stored
- Skip startup data with "Start saving data" delay
- Simplify the MOSFET model — use an ideal switch for initial testing

### Output Voltage Is Wrong

Check the duty cycle calculation: Vout = Vin × D for an ideal buck. If the simulation shows a different voltage, the controller or feedback network may be incorrect.

### Loop Gain Measurement Shows No Phase Margin

The injection point may be wrong. The AC source must be in the feedback path where the impedance looking backward is high and forward is low. Try different injection points.
