---
title: "Femap Random Vibration PSD Analysis: Setup, Results Interpretation, and Fatigue Estimation"
excerpt: "Run PSD random vibration analysis in Femap with NX Nastran: define power spectral density input, modal damping, extract response PSD, calculate RMS and 3-sigma values, and estimate fatigue life."
category: "workflow"
softwareSlug: "femap"
keyword: "femap random vibration psd analysis rms fatigue"
slug: "femap-random-vibration-psd-analysis-setup-results-fatigue"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.appliedcax.com/wp-content/uploads/psd-random-vibration-tutorial-for-femap-and-nx-nastran-20230627.pdf"
  - "https://www.predictiveengineering.com/sites/default/files/psd-random-vibration-tutorial-for-femap-and-nx-nastran.pdf"
---

# Femap Random Vibration PSD Analysis: Setup, Results Interpretation, and Fatigue Estimation

Random vibration analysis is essential for products that must survive vibration environments — aerospace electronics, automotive components, and military equipment. Femap with NX Nastran provides a complete workflow for PSD-based random vibration analysis. I'll walk through the setup, results interpretation, and fatigue estimation.

## What Is Random Vibration Analysis?

Random vibration simulates the response of a structure to random excitation, characterized by a Power Spectral Density (PSD) function. Unlike harmonic analysis (single frequency), random vibration excites all frequencies simultaneously.

The PSD input defines the energy content at each frequency. Common PSD specifications include:
- **MIL-STD-810** — military environmental testing
- **GR-63-CORE** — telecommunications equipment
- **ISO 16750** — automotive environmental testing
- **RTCA DO-160** — aerospace equipment

## Analysis Workflow

Random vibration in Femap requires a multi-step process:

1. **Modal analysis** — extract natural frequencies and mode shapes
2. **Frequency response analysis** — compute the transfer function
3. **Random vibration analysis** — apply PSD input and compute response

Femap handles steps 2 and 3 together when you set up a random vibration analysis.

## Step 1: Modal Analysis

### Setup

1. **Model > Analysis > Modal (SOL 103)**
2. Set the number of modes or frequency range:
   - **Number of modes** — typically 20-50 for random vibration
   - **Frequency range** — must cover the PSD input range (typically 20-2000 Hz)
3. Run the modal analysis
4. Check results:
   - **Natural frequencies** — should be within the expected range
   - **Effective mass** — should be > 90% of total mass in each direction
   - **Mode shapes** — verify they look physically reasonable

### Why Modal First?

The random vibration analysis uses modal superposition — it combines the responses of individual modes. If not enough modes are extracted, the response will be underestimated. Check the effective mass to ensure adequate mode extraction.

## Step 2: Frequency Response Analysis

### Setup

1. **Model > Analysis > Frequency Response (SOL 111)**
2. This uses the modes from Step 1 as the basis
3. Define the excitation:
   - **Base excitation** — enforced acceleration at the constrained nodes
   - **Unit acceleration** — 1g across the frequency range
4. Define damping:
   - **Modal damping** — typically 2-5% for assembled structures
   - **Q value** — damping = 1/(2×Q), so Q=25 gives 2% damping
5. Define frequency sweep:
   - **Frequency range** — must match the PSD input range
   - **Frequency spacing** — clustered near resonances for accuracy
   - Use **logarithmic spacing** for wide frequency ranges

### Key Parameters

- **PARAM, KDAMP, 1** — use modal damping
- **PARAM, RESVEC, YES** — include residual vector correction for missing high-frequency modes
- **FREQ4 card** — clusters points around each natural frequency (typically ±0.1 of the natural frequency)

## Step 3: Random Vibration Analysis

### Define PSD Input

1. **Model > Function > PSD**
2. Enter the PSD curve as frequency vs. acceleration (g²/Hz):
   - **Frequency points** — break points of the PSD curve
   - **PSD values** — acceleration PSD at each frequency
   - **Interpolation** — logarithmic between points (standard for PSD)
3. Common PSD curves:

**MIL-STD-810 Helicopter Vibration:**

| Frequency (Hz) | PSD (g²/Hz) |
|---|---|
| 15 | 0.005 |
| 50 | 0.05 |
| 500 | 0.05 |
| 2000 | 0.005 |

**Typical Automotive Random Vibration:**

| Frequency (Hz) | PSD (g²/Hz) |
|---|---|
| 10 | 0.01 |
| 100 | 0.1 |
| 300 | 0.1 |
| 1000 | 0.01 |

### Define Random Analysis

1. **Model > Analysis > Random Response**
2. Select the frequency response analysis from Step 2
3. Assign the PSD function to the input DOF
4. Define output requests:
   - **PSD of response** — at specific nodes
   - **RMS values** — at all nodes
   - **Number of zero crossings** — for fatigue estimation
5. Run the analysis

## Interpreting Results

### RMS Displacement and Stress

The RMS (Root Mean Square) value represents the 1-sigma response:
- **68.2%** of the time, the response is below the RMS value
- **95.4%** of the time, below 2×RMS
- **99.7%** of the time, below 3×RMS

For design purposes, use **3-sigma** values:
- **3σ stress** = 3 × RMS stress
- Compare against yield strength with appropriate safety factor
- Typical criterion: 3σ stress < yield strength / 1.5

### Response PSD

The response PSD shows the frequency content of the output:
- **Peaks** at natural frequencies — the structure amplifies input at resonance
- **Peak amplitude** — determined by damping (lower damping = higher peaks)
- **Area under the PSD curve** — equals the RMS² (variance)

### RMS Acceleration

The RMS acceleration at specific locations:
- **At the mounting points** — should match the input RMS
- **At the center of mass** — amplified by the structure's dynamics
- **At sensitive components** — compare against component specifications

## Fatigue Estimation from Random Vibration

### Steinberg's Method

Steinberg's method estimates fatigue life from random vibration results:

1. **Calculate 3σ stress** at critical locations
2. **Assume Gaussian distribution** — the stress follows a normal distribution
3. **Count stress cycles** using the number of zero crossings:
   - N0 = number of positive zero crossings per second (from Femap output)
   - Total cycles = N0 × duration (seconds)
4. **Apply Miner's rule** with the 1σ, 2σ, and 3σ stress levels:
   - 68.2% of cycles at 1σ stress
   - 27.2% of cycles at 2σ stress
   - 4.3% of cycles at 3σ stress
5. **Calculate fatigue damage**:
   - D = n1/N1 + n2/N2 + n3/N3
   - Where ni = cycles at each level, Ni = fatigue life at each stress level (from S-N curve)
6. **Life** = 1/D (in seconds)

### Simplified Approach

For a quick assessment:
- If 3σ stress < fatigue limit → infinite life
- If 3σ stress > fatigue limit → calculate life using Steinberg's method
- If 3σ stress > yield strength → likely failure, redesign needed

## Common Issues

### Insufficient Modes

If the effective mass is low (< 80%), the response is underestimated.

**Fix:** Extract more modes, or enable residual vectors (PARAM, RESVEC, YES) to account for missing high-frequency modes.

### Damping Too Low

If response peaks are extremely high, damping may be too low.

**Fix:** Use realistic damping values. For assembled structures with bolted joints, 3-5% is typical. For welded structures, 1-2%.

### PSD Input Applied to Wrong DOF

The PSD must be applied to the same DOF as the base excitation. If the PSD is for vertical vibration but the excitation is in the horizontal direction, results will be wrong.

**Fix:** Verify that the PSD function is assigned to the correct DOF in the random analysis setup.

### Frequency Range Mismatch

The frequency response analysis range must cover the PSD input range. If the PSD extends to 2000 Hz but the frequency response only goes to 1000 Hz, the high-frequency content is lost.

**Fix:** Ensure the frequency response range matches or exceeds the PSD range.

## Best Practices

- **Extract enough modes** — check effective mass > 90%
- **Use realistic damping** — measured data is always better than estimates
- **Cluster frequency points near resonances** — captures peak response accurately
- **Check 3σ stress against yield** — primary design criterion
- **Use Steinberg's method for fatigue** — simple but effective for preliminary design
- **Validate with test data** — compare predicted and measured response when possible
- **Enable residual vectors** — improves accuracy without extracting more modes
