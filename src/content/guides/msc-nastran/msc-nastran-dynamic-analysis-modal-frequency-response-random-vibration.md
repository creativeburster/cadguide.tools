---
title: "MSC Nastran Dynamic Analysis: Modal, Frequency Response, and Random Vibration"
excerpt: "Run dynamic analysis in MSC Nastran: modal analysis for natural frequencies, frequency response for harmonic excitation, random vibration for PSD input, and transient response for shock loading."
category: "workflow"
softwareSlug: "msc-nastran"
keyword: "msc nastran dynamic analysis modal frequency response random vibration"
slug: "msc-nastran-dynamic-analysis-modal-frequency-response-random-vibration"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://simulatemore.mscsoftware.com/fundamentals-of-dynamic-analysis-msc-nastran/"
  - "https://www.cadence.com/en_US/home/tools/msc-software/msc-nastran.html"
---

# MSC Nastran Dynamic Analysis: Modal, Frequency Response, and Random Vibration

MSC Nastran is the original finite element solver for structural dynamics. It's used across aerospace, automotive, and defense industries for vibration, shock, and fatigue analysis. The dynamic analysis capabilities are extensive — I'll cover the three most common types: modal, frequency response, and random vibration.

## Dynamic Analysis Types in MSC Nastran

| Analysis Type | SOL Number | Description |
|---|---|---|
| Static analysis | SOL 101 | Linear static loads |
| Modal analysis | SOL 103 | Natural frequencies and mode shapes |
| Frequency response | SOL 108 | Harmonic excitation response |
| Transient response | SOL 109 | Time-domain response |
| Modal frequency response | SOL 111 | Frequency response via modal superposition |
| Modal transient response | SOL 112 | Transient response via modal superposition |
| Random vibration | SOL 111 + RANDPSD | PSD-based random vibration |
| Buckling | SOL 105 | Linear buckling |

## Modal Analysis (SOL 103)

Modal analysis finds the natural frequencies and mode shapes of a structure. It's the foundation for all dynamic analysis.

### Setup

1. **Define material properties** — Young's modulus, density, Poisson's ratio
2. **Mesh the structure** — element type and mesh density
3. **Apply boundary conditions** — constraints representing the mounting
4. **Run SOL 103** with the requested number of modes

### Key Parameters

- **EIGRL card** — defines the eigenvalue extraction:
  - **V1, V2** — frequency range of interest (Hz)
  - **ND** — number of desired modes
  - **Method** — Lanczos (default, most robust)
- **SPC cards** — single-point constraints defining fixed DOFs

### Interpreting Results

- **Natural frequencies** — the frequencies at which the structure resonates
- **Mode shapes** — the deformation pattern at each frequency
- **Effective mass** — the fraction of total mass participating in each mode
- **Check:** the sum of effective masses should approach the total mass (typically > 90% for the first 10-20 modes)

### Common Issues

**Missing modes** — if the frequency range is too narrow, modes outside the range won't be found. Set V1=0 and V2 to a high enough frequency.

**Zero-frequency modes** — rigid body modes (6 for a free-free structure). These aren't structural modes and should be excluded from dynamic analysis.

## Frequency Response Analysis (SOL 108/111)

Frequency response predicts the structure's response to harmonic excitation at different frequencies.

### Direct vs. Modal

- **Direct (SOL 108)** — solves the full equations at each frequency step. More accurate but slower.
- **Modal (SOL 111)** — uses mode shapes from a modal analysis to approximate the response. Faster but requires enough modes.

Use modal frequency response for large models (> 100,000 DOF) and direct for small models or when high-frequency accuracy is needed.

### Setup

1. **Run modal analysis first** (for SOL 111) — extract enough modes to cover the frequency range
2. **Define excitation**:
   - **Force** — applied force at a node (FREQi card)
   - **Enforced motion** — base excitation (SPCD card)
3. **Define damping**:
   - **Modal damping** — damping ratio per mode (TABMP1 card)
   - **Structural damping** — material-level damping (MATi card)
   - Typical values: 1-5% for assembled structures, 0.5-2% for welded structures
4. **Define frequency sweep**:
   - **FREQ card** — list of frequencies
   - **FREQ1 card** — linear sweep (FSTART, FEND, NF)
   - **FREQ2/FREQ4/FREQ5** — logarithmic and clustered sweeps near resonances

### Interpreting Results

- **Amplitude vs. frequency** — peaks at resonant frequencies
- **Phase vs. frequency** — 180° phase shift at resonance
- **Peak amplitude** — determined by damping: lower damping = higher peaks
- **Check:** peaks should align with natural frequencies from modal analysis

## Random Vibration Analysis

Random vibration predicts the response to random excitation, characterized by a Power Spectral Density (PSD). It's used for aerospace, automotive, and electronic component qualification.

### Setup

1. **Run modal frequency response (SOL 111)** — this provides the transfer function
2. **Define the PSD input**:
   - **RANDPS card** — references a TABRND1 card with PSD vs. frequency data
   - Common PSD inputs: MIL-STD-810, GR-63-CORE, ISO 16750
3. **Define random analysis parameters**:
   - **RFORCE** — input DOF and PSD
   - **RANDOUT** — requested output (PSD of response, RMS values)

### PSD Input Example

A typical acceleration PSD input for transportation vibration:

| Frequency (Hz) | PSD (g²/Hz) |
|---|---|
| 1 | 0.0001 |
| 20 | 0.05 |
| 40 | 0.05 |
| 80 | 0.01 |
| 200 | 0.01 |
| 500 | 0.001 |

### Interpreting Results

- **Response PSD** — PSD of the output (displacement, stress, acceleration)
- **RMS values** — the 1σ value (68.2% probability of being below this)
- **3σ values** — 99.7% probability of being below this
- **Peak values** — for fatigue analysis, use the RMS × peak factor (typically 3-5)

### Common Applications

- **Electronic component qualification** — ensure components survive vibration testing
- **Aerospace structures** — predict response to acoustic and turbulence excitation
- **Vehicle components** — predict response to road roughness

## Transient Response (SOL 109/112)

Transient response predicts the time-domain response to arbitrary loading.

### Setup

1. **Define time-dependent load**:
   - **TLOADi card** — references a time function (TABLEDi)
   - Common loads: half-sine shock, sawtooth pulse, earthquake time history
2. **Define time step**:
   - **TSTEP card** — number of steps and time increment
   - Time step should be < 1/(20 × highest frequency of interest)
3. **Choose direct (SOL 109) or modal (SOL 112)**

### Interpreting Results

- **Displacement vs. time** — the structure's response over time
- **Peak response** — the maximum displacement/stress during the event
- **Settling time** — how long until oscillations damp out
- **Check:** compare peak response with static analysis for the same load magnitude

## Common Issues Across All Dynamic Analyses

### Insufficient Modes

If not enough modes are extracted, the modal-based analyses (SOL 111, 112) will be inaccurate. Check the effective mass — if it's less than 90% of total mass, extract more modes.

### Damping Uncertainty

Damping has a large effect on response amplitude but is difficult to predict. Use measured data when available. For preliminary analysis, typical values:
- **Welded steel** — 0.5-1% critical damping
- **Bolted/riveted structures** — 2-5%
- **Composite structures** — 1-3%
- **Concrete** — 2-5%

### Mesh Density for Dynamic Analysis

Dynamic analysis requires finer mesh than static analysis to capture mode shapes:
- **Bending modes** — at least 4-6 elements per half-wave
- **Torsional modes** — at least 6-8 elements around the circumference
- **Local modes** — may need very fine mesh in specific areas

## Best Practices

- **Run modal analysis first** — understand the structure's dynamics before other analyses
- **Check effective mass** — ensure enough modes are extracted
- **Use realistic damping** — measured data is always better than estimates
- **Cluster frequency steps near resonances** — captures peak response accurately
- **Validate with test data** — compare predicted frequencies with hammer or shaker tests
- **Use modal superposition for large models** — it's much faster than direct methods
