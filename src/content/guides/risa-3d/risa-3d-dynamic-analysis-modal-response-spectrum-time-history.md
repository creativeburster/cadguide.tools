---
title: "RISA-3D Dynamic Analysis: Modal, Response Spectrum, and Time History Setup"
excerpt: "How to perform dynamic analysis in RISA-3D — covering mass source definition, modal analysis, response spectrum input, time history loading, and interpreting dynamic results for seismic design."
category: "standards"
softwareSlug: "risa-3d"
keyword: "risa-3d dynamic analysis modal response spectrum time history"
slug: "risa-3d-dynamic-analysis-modal-response-spectrum-time-history"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://help.risa.com/risahelp/risa3d/Content/DynamicAnalysis/Dynamic-Analysis.htm"
  - "https://blog.risa.com/post/how-to-run-a-basic-dynamic-eigensolution-in-risa-3d"
---

# RISA-3D Dynamic Analysis: Modal, Response Spectrum, and Time History Setup

Dynamic analysis is required for seismic design of most buildings. RISA-3D handles modal analysis, response spectrum, and time history. I've set up dynamic analysis for dozens of buildings in RISA. Here's the complete process.

## Step 1: Mass Source Definition

1. **Load** → **Mass Source**.
2. Define which loads contribute to the seismic mass:

| Load Case | Included in Mass? | Factor |
|-----------|-------------------|--------|
| Dead Load | Yes | 1.0 |
| Floor Finish | Yes | 1.0 |
| Partition Load | Yes | 1.0 (permanent) |
| Storage Live Load | Yes | 0.25 (ASCE 7) |
| Office Live Load | No | 0.0 |
| Roof Live Load | No | 0.0 |
| Snow Load | Yes (if > 30 psf) | 0.2 |

3. The total seismic mass = sum of all included loads × factors.
4. RISA converts the mass to nodal masses based on member connectivity and tributary areas.

## Step 2: Modal Analysis

1. **Solve** → **Solution Options** → **Dynamic Analysis**.
2. Set:
   - **Number of modes**: Start with 20-30 modes
   - **Frequency range**: 0-100 Hz (default)
   - **Convergence tolerance**: 1e-6

3. **Solve** → **Solve Dynamic**.
4. RISA calculates mode shapes and natural frequencies.

### Review Mode Shapes

1. **Results** → **Mode Shapes**.
2. Animate each mode:
   - **Mode 1**: Fundamental X-translation (should be the lowest frequency)
   - **Mode 2**: Fundamental Y-translation
   - **Mode 3**: Torsional rotation
   - **Higher modes**: Mixed translation and torsion

3. Check mass participation:
   - **Results** → **Mass Participation Table**.
   - Sum of effective mass in each direction should be ≥ 90%.
   - If < 90%, increase the number of modes.

4. Check natural periods:
   - T1 ≈ 0.1 × number of stories (for moment frames)
   - T1 ≈ 0.05-0.08 × number of stories (for braced frames)
   - If T1 is much longer, the structure may be too flexible — add bracing

## Step 3: Response Spectrum Analysis

### Define the Response Spectrum

1. **Load** → **Response Spectra** → **Add**.
2. Select spectrum type:
   - **ASCE 7-22**: Built-in spectrum generator
   - **Custom**: Enter spectral values at specific periods

3. For ASCE 7-22:
   - **Ss**: Short-period spectral acceleration (from USGS)
   - **S1**: 1-second spectral acceleration
   - **Site Class**: A-F
   - **Risk Category**: I-IV
   - **R**: Response modification factor

4. RISA generates the design response spectrum:
   - **SDS** = (2/3) × Fa × Ss
   - **SD1** = (2/3) × Fv × S1
   - Spectrum shape: Platform at SDS, descending at SD1/T

### Apply the Spectrum

1. **Load** → **Dynamic Load Cases** → **Add**.
2. Set:
   - **Load case type**: Response spectrum
   - **Spectrum**: Select the defined spectrum
   - **Direction**: X or Y
   - **Scale factor**: 1.0 (if spectrum is in g's, scale by g = 386 in/s²)
   - **Modal combination**: CQC (recommended) or SRSS
   - **Directional combination**: SRSS or 100/30

3. Create separate dynamic load cases for X and Y directions.

### Accidental Torsion

1. In the dynamic load case settings → **Accidental Eccentricity**.
2. Set eccentricity = 5% of building dimension perpendicular to the seismic direction.
3. RISA applies the eccentric moment at each floor level.

### Run Response Spectrum Analysis

1. **Solve** → **Solve Dynamic**.
2. RISA calculates:
   - Modal responses for each mode
   - Combined response using CQC or SRSS
   - Base shear for each direction

3. Check base shear:
   - **V_RS** (response spectrum base shear)
   - **V_ELF** (equivalent lateral force base shear)
   - ASCE 7 requires: V_RS ≥ 0.85 × V_ELF for regular structures
   - If V_RS < 0.85 × V_ELF, scale the spectrum by (0.85 × V_ELF / V_RS)

## Step 4: Time History Analysis

### Define the Time History Function

1. **Load** → **Time History Functions** → **Add**.
2. Select function type:
   - **Earthquake record**: Import a ground motion file (e.g., El Centro, Northridge)
   - **Harmonic**: Sinusoidal function (for machinery vibration)
   - **Custom**: Enter acceleration values at time steps

3. For earthquake records:
   - Download from PEER NGA database or USGS
   - Format: ATC-20 or CSV (time, acceleration)
   - Scale to the design earthquake (typically 2/3 × MCE)

### Define Time History Load Case

1. **Load** → **Dynamic Load Cases** → **Add**.
2. Set:
   - **Load case type**: Time history
   - **Function**: Select the time history function
   - **Direction**: X, Y, or Z
   - **Duration**: Total analysis time (e.g., 30 seconds)
   - **Time step**: 0.01-0.02 seconds (must capture highest mode frequency)
   - **Damping**: 5% of critical (typical for steel), 7% for concrete

3. **Solve** → **Solve Dynamic**.
4. RISA performs time integration (Newmark-beta method) and calculates:
   - Displacement at each node at each time step
   - Forces in each member at each time step
   - Maximum values over the entire time history

## Step 5: Interpret Dynamic Results

### Story Drift

1. **Results** → **Story Drift**.
2. Select the response spectrum load case.
3. Check drift ratios:
   - ASCE 7 limit: Δ/a ≤ 0.020h (Risk II), 0.015h (Risk III), 0.010h (Risk IV)
   - Where a = Cd (deflection amplification factor)

4. If drift exceeds limits:
   - Add bracing or shear walls
   - Increase member sizes
   - Reduce R (more conservative design)

### Base Shear Distribution

1. **Results** → **Story Forces**.
2. Review the lateral force distribution:
   - Forces should increase with height (more force at upper levels)
   - Compare with ELF distribution to verify the pattern is similar

### Member Forces

1. **Results** → **Member Forces** → select dynamic load case.
2. Note the maximum forces:
   - These are the forces to use in load combinations
   - Dynamic forces are typically combined with gravity: 1.2D + 1.0E + 0.5L

3. For time history: the results show the maximum force over the entire time record.

## Common Dynamic Analysis Issues

**Mass participation < 90%**: Increase the number of modes. For flexible structures or buildings with many stories, 50+ modes may be needed. If mass participation plateaus below 90%, check for disconnected masses or localized modes.

**First mode is torsional**: This indicates poor torsional resistance. Add bracing or shear walls on the perimeter to increase torsional stiffness. A torsional first mode is a serious design issue.

**Response spectrum base shear < ELF**: Scale up the response spectrum results per ASCE 7. This is common for stiff, low-rise buildings where the ELF method is conservative.

**Time history takes too long**: Reduce the time step or duration. A time step of 0.01s for 30 seconds = 3,000 steps. Each step requires a full matrix solve. For large models, this can take hours. Reduce to 0.02s and 20 seconds if acceptable.

**P-Delta not included in dynamic analysis**: Enable P-Delta in the solution options. P-Delta is important for tall or flexible structures — it increases drift and forces. RISA includes P-Delta by updating the stiffness matrix with the geometric stiffness from axial forces.
