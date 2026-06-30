---
title: "STAAD.Pro Dynamic Analysis: Seismic Response Spectrum and Time History"
excerpt: "A guide to dynamic analysis in STAAD.Pro covering natural frequency calculation, response spectrum analysis per ASCE 7, time history analysis for earthquake and wind loads, and modal combination methods (SRSS and CQC)."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro dynamic analysis seismic"
slug: "staad-pro-dynamic-analysis-seismic-response-spectrum-time-history"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro%20Help-v28/en/GUID-DYNAMIC-ANALYSIS.html"
  - "https://www.bentley.com/software/staad/"
---

# STAAD.Pro Dynamic Analysis: Seismic Response Spectrum and Time History

Dynamic analysis used to intimidate me — all those modes, frequencies, and spectrum curves seemed like black magic compared to static analysis. But after running dozens of seismic analyses in STAAD.Pro, I've come to appreciate how systematic it is. Modal analysis, response spectrum, time history — each has its place. Let me walk you through how I set them up.

## Modal Analysis

### Mass Model

Before dynamic analysis, define the mass model:

1. Loading > Mass Definition
2. Reference load cases that contribute to mass:
   - **Dead Load**: Full (100%)
   - **Live Load**: Reduced per code (typically 25% for seismic mass)
   - **Cladding weight**: If not in dead load
3. STAAD assembles the mass matrix from referenced loads
4. Mass is lumped at nodes (lumped mass model)

### Natural Frequency Calculation

1. Analysis > Analysis Type > Dynamic
2. Set:
   - **Number of modes**: 10-20 (enough to capture 90% mass participation)
   - **Cut-off frequency**: Optional (to limit high-frequency modes)
3. Run analysis
4. STAAD calculates:
   - **Natural frequencies (ω)**: In rad/sec
   - **Natural periods (T)**: T = 2π/ω, in seconds
   - **Mode shapes**: Displacement pattern for each mode

### Reviewing Modal Results

1. Post-processing > Dynamics > Mode Shapes
2. View each mode:
   - **Mode 1**: Typically fundamental (first sway in X or Y)
   - **Mode 2**: Typically second sway (perpendicular direction)
   - **Mode 3**: Typically first torsional mode
   - **Higher modes**: Higher frequency vibration patterns
3. Animate mode shapes to visualize
4. Check mass participation:

| Mode | Period (sec) | Mass X (%) | Mass Y (%) | Mass Z (%) |
|------|-------------|-----------|-----------|-----------|
| 1 | 1.234 | 0.1 | 72.5 | 0.0 |
| 2 | 1.087 | 68.3 | 0.2 | 0.0 |
| 3 | 0.892 | 5.1 | 8.7 | 0.0 |
| 4 | 0.456 | 0.0 | 0.0 | 65.2 |
| 5 | 0.321 | 12.4 | 0.5 | 0.0 |

5. **Requirement**: Cumulative mass participation ≥ 90% in each direction
6. If not met: increase number of modes and re-run

### Mass Participation Check

If mass participation is less than 90%:
1. Increase the number of modes (from 10 to 20, 30, etc.)
2. Re-run the analysis
3. Check again
4. If still low: the model may have local modes (vibration of individual members)
   - Identify local modes (low mass participation, high frequency)
   - Adjust member stiffness or mass distribution
   - Use "cut-off frequency" to exclude very high modes

## Response Spectrum Analysis

### Defining the Response Spectrum

1. Loading > Response Spectrum
2. Select spectrum type:
   - **ASCE 7-22**: US standard
   - **IS 1893**: Indian standard
   - **EN 1998-1**: Eurocode 8
   - **UBC 97**: Uniform Building Code
   - **Custom**: User-defined spectrum
3. Set parameters:

#### ASCE 7 Parameters
   - **SDS**: Short-period design spectral acceleration (e.g., 0.5g)
   - **SD1**: 1-second period design spectral acceleration (e.g., 0.2g)
   - **Site class**: A, B, C, D, E, or F
   - **Damping ratio**: 5% (default for concrete), 3% (steel), 2% (welded steel)

4. STAAD generates the response spectrum curve:
   - X-axis: Period (T) in seconds
   - Y-axis: Spectral acceleration (Sa) in g

### Creating Response Spectrum Load Case

1. Loading > Load Cases > Add > Response Spectrum
2. Set:
   - **Direction**: X, Y, or Z (horizontal ground motion direction)
   - **Scale factor**: To convert acceleration to force units
   - **Modal combination**: SRSS or CQC
3. SRSS (Square Root of Sum of Squares):
   - Simple, conservative
   - Good for well-separated modes
   - Formula: R = √(R₁² + R₂² + ... + Rₙ²)
4. CQC (Complete Quadratic Combination):
   - More accurate for closely-spaced modes
   - Accounts for modal coupling
   - Recommended for asymmetric buildings

### Running Response Spectrum Analysis

1. Analysis > Run Analysis
2. STAAD performs:
   - Modal analysis (natural frequencies and mode shapes)
   - For each mode: calculate modal response (forces, displacements)
   - Combine modal responses using SRSS or CQC
3. Results are absolute values (no sign) — all responses are positive

### Directional Combination

For seismic in both X and Y directions:
1. Create two response spectrum load cases: RS-X and RS-Y
2. Combine per ASCE 7:
   - **100% in one direction + 30% in perpendicular**: 
     - Combo 1: 1.0 × RS-X + 0.3 × RS-Y
     - Combo 2: 0.3 × RS-X + 1.0 × RS-Y
3. Create load combinations:
   - **Combo 1**: 1.2D + 1.0E_X + 0.3E_Y + 0.5L
   - **Combo 2**: 1.2D + 0.3E_X + 1.0E_Y + 0.5L
   - **Combo 3**: 0.9D + 1.0E_X + 0.3E_Y
   - **Combo 4**: 0.9D + 0.3E_X + 1.0E_Y

## Time History Analysis

### When to Use Time History

- Near-fault sites (within 10km of active fault)
- Irregular structures where response spectrum is inadequate
- Base-isolated structures
- Structures with seismic dampers
- Blast loading
- Equipment vibration

### Defining Time History

1. Loading > Time History
2. Set:
   - **Time step**: 0.005 to 0.02 seconds (small enough to capture highest mode)
   - **Total duration**: 10-40 seconds (enough to capture full earthquake)
   - **Damping**: 5% (concrete), 3% (steel), 2% (welded steel)
3. Input ground motion:
   - **Built-in records**: El Centro, Northridge, Loma Prieta, Kobe
   - **User-defined**: Import acceleration time history from text file
   - **Format**: Time (sec), Acceleration (g) — one pair per line

### Creating Time History Load Case

1. Loading > Load Cases > Add > Time History
2. Set:
   - **Ground motion direction**: X, Y, or Z
   - **Acceleration record**: Select from defined time histories
3. STAAD applies the ground motion to all support nodes simultaneously

### Running Time History Analysis

1. Analysis > Run Analysis
2. STAAD performs:
   - Modal analysis
   - Direct integration or modal superposition
   - At each time step: calculate displacements, velocities, accelerations
   - At each time step: calculate member forces
3. Analysis duration: minutes to hours depending on model size and time steps

### Reviewing Time History Results

1. Post-processing > Time History
2. View results at any time step:
   - **Displacement**: Nodal displacement at time t
   - **Forces**: Member forces at time t
   - **Acceleration**: Absolute acceleration at time t
3. View time history graphs:
   - **Displacement vs. time**: For any node
   - **Force vs. time**: For any member
   - **Base shear vs. time**: Total shear at base
4. Identify peak values:
   - **Maximum displacement**: Peak over entire time history
   - **Maximum force**: Peak over entire time history
   - **Time of peak**: When the maximum occurs

## Wind Dynamic Analysis

### Gust Factor Analysis

For flexible structures (height > 100m or frequency < 1 Hz):

1. Loading > Wind Load > Dynamic
2. Set:
   - **Basic wind speed**: e.g., 45 m/s
   - **Exposure category**: B, C, or D
   - **Building height**: For wind profile
   - **Natural frequency**: From modal analysis
   - **Damping ratio**: 1-2% (steel), 2-5% (concrete)
3. STAAD calculates:
   - **Gust effect factor (Gf)**: Per ASCE 7 Chapter 26
   - **Along-wind response**: Mean + fluctuating
   - **Across-wind response**: If applicable
4. Apply gust factor to wind loads

## Base Shear Comparison

### Response Spectrum vs. Equivalent Lateral Force

Per ASCE 7, compare dynamic base shear to static base shear:

1. Calculate static base shear (ELF method): V = Cs × W
2. Calculate dynamic base shear (RSA): V_dyn = sum of base shears from all modes
3. If V_dyn < 0.85 × V_static:
   - Scale dynamic results by factor: 0.85 × V_static / V_dyn
   - Re-run with scaled spectrum
4. If V_dyn ≥ 0.85 × V_static:
   - Dynamic results are acceptable as-is

## Common Dynamic Analysis Issues

### Low Mass Participation

**Cause**: Not enough modes calculated or local modes dominating.
**Fix**: Increase number of modes. Identify and suppress local modes by adjusting member stiffness.

### Closely-Spaced Modes

**Cause**: Symmetric or near-symmetric structures have modes with similar frequencies.
**Fix**: Use CQC instead of SRSS for modal combination. CQC accounts for modal coupling.

### Excessive Drift

**Cause**: Structure too flexible for seismic loads.
**Fix**: Increase stiffness (larger sections, more bracing, thicker walls). Consider seismic isolation or dampers.

### Torsional Irregularity

**Cause**: Asymmetric mass or stiffness distribution.
**Fix**: Redistribute mass or stiffness. Add torsional bracing. Use accidental eccentricity (±5% of building dimension).

## Wrapping Up

Dynamic analysis in STAAD used to scare me, but it's really just a systematic process. Run the modal analysis, check mass participation (90%+ or you need more modes), set up the response spectrum, scale to static base shear, and check drift. The CQC modal combination is the right choice for most buildings — SRSS can underestimate response when modes are closely spaced. Take it step by step and it's not so bad.
