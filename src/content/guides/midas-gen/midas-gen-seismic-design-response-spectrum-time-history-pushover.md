---
title: "MIDAS Gen Seismic Design: Response Spectrum, Time History, and Pushover Analysis"
excerpt: "A guide to seismic analysis in MIDAS Gen covering equivalent lateral force, response spectrum analysis per ASCE 7 and IS 1893, nonlinear time history, pushover analysis, and performance-based design per ASCE 41."
category: "workflow"
softwareSlug: "midas-gen"
keyword: "midas gen seismic design"
slug: "midas-gen-seismic-design-response-spectrum-time-history-pushover"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Gen Seismic Design: Response Spectrum, Time History, and Pushover Analysis

Seismic design in MIDAS Gen covers the full spectrum — from simple equivalent lateral force to nonlinear time history and pushover. We've used all of these methods on different projects, and the nice thing about MIDAS Gen is that you can start with a simple response spectrum analysis and escalate to nonlinear methods without rebuilding the model. Let us walk you through each method.

## Equivalent Lateral Force (ELF)

### Automatic Generation

1. Load > Seismic Load > Static
2. Select code: ASCE 7-22, IS 1893:2016, Eurocode 8, or NBCC
3. Set parameters per ASCE 7:
   - **SDS**: 0.6g (short-period)
   - **SD1**: 0.3g (1-second)
   - **TL**: 8 seconds (long-period transition)
   - **Site class**: D
   - **R**: 5 (special steel frame), 8 (special concrete wall)
   - **we**: 1.0 (standard), 1.25 (essential), 1.5 (hazardous)
   - **Seismic weight**: Dead + 0.25 × Live
4. MIDAS Gen calculates:
   - **Seismic mass per story**: From defined weight
   - **Fundamental period (T)**: From modal analysis or empirical
   - **Base shear**: V = Cs × W = (SDS / (R/we)) × W
   - **Vertical distribution**: Fx = V × wx × hx^k / Σ(wi × hi^k)
   - **Accidental eccentricity**: 5% of building dimension

### IS 1893 Parameters

For Indian projects:
1. Select code: IS 1893:2016
2. Set:
   - **Zone**: V (PGA = 0.36g)
   - **Soil type**: Medium (Type II)
   - **R**: 5 (SMRF)
   - **we**: 1.0
   - **Damping**: 5%
3. MIDAS Gen calculates:
   - **Sa/g**: From response spectrum per IS 1893
   - **Ah**: Z/2 × we/R × Sa/g
   - **Base shear**: V = Ah × W

## Modal Analysis

### Setup

1. Analysis > Analysis Control > Eigenvalue
2. Set:
   - **Number of modes**: 15-30
   - **Analysis method**: Lanczos (fast) or Subspace
3. Run analysis
4. Check results:
   - **Natural periods**: T1, T2, T3...
   - **Mode shapes**: Displacement pattern per mode
   - **Mass participation**: Per mode and cumulative

### Mass Participation Verification

| Mode | Period (s) | UX (%) | UY (%) | Cum. UX (%) | Cum. UY (%) |
|------|-----------|--------|--------|------------|------------|
| 1 | 1.234 | 0.1 | 72.5 | 0.1 | 72.5 |
| 2 | 1.087 | 68.3 | 0.2 | 68.4 | 72.7 |
| 3 | 0.892 | 5.1 | 8.7 | 73.5 | 81.4 |
| 4 | 0.456 | 12.4 | 0.5 | 85.9 | 81.9 |
| 5 | 0.321 | 8.2 | 15.3 | 94.1 | 97.2 |

**Requirement**: Cumulative ≥ 90% in each direction. If not met, increase modes.

## Response Spectrum Analysis

### Defining Spectrum

1. Load > Response Spectrum Functions
2. Add function:
   - **ASCE 7-22**: Built-in
   - **IS 1893**: Built-in
   - **Eurocode 8**: Built-in
   - **User-defined**: Custom from text file
3. Set parameters (ASCE 7):
   - **SDS**: 0.6g
   - **SD1**: 0.3g
   - **Damping**: 5%

### Creating Response Spectrum Load Case

1. Load > Response Spectrum Load Cases
2. Set:
   - **Direction**: X or Y
   - **Scale factor**: 9.81 (convert g to m/s²)
   - **Modal combination**: CQC (recommended) or SRSS
   - **Damping**: 5%
3. Create cases: RS-X and RS-Y

### Directional Combination

1. Load > Load Combinations
2. Create per ASCE 7:
   - **Combo 1**: 1.2D + 1.0RS-X + 0.3RS-Y + 0.5L
   - **Combo 2**: 1.2D + 0.3RS-X + 1.0RS-Y + 0.5L
   - **Combo 3**: 0.9D + 1.0RS-X + 0.3RS-Y
   - **Combo 4**: 0.9D + 0.3RS-X + 1.0RS-Y

### Base Shear Scaling

1. Results > Base Shear
2. Compare:
   - **V_static**: From ELF method
   - **V_dynamic**: From response spectrum (CQC combination)
3. If V_dynamic < 0.85 × V_static:
   - Scale factor = 0.85 × V_static / V_dynamic
   - Apply to response spectrum load case
   - Re-run

## Time History Analysis

### Defining Ground Motion

1. Load > Time History Functions
2. Add function:
   - **From file**: Import .txt or .csv (time, acceleration)
   - **Built-in**: El Centro, Northridge, Loma Prieta, Kobe
   - **User-defined**: Manual entry
3. Set:
   - **Time step**: 0.005-0.02 seconds
   - **Duration**: 10-40 seconds
   - **Units**: g or m/s²

### Creating Time History Load Case

1. Load > Time History Load Cases
2. Set:
   - **Analysis method**: Modal (linear) or Direct Integration (nonlinear)
   - **Time step**: Match ground motion
   - **Number of steps**: Match ground motion
   - **Damping**: Rayleigh (5% at two frequencies)
3. Add ground motion:
   - **Direction**: X, Y, or Z
   - **Function**: Select time history function
   - **Scale factor**: Convert to m/s² if needed

### Running Time History

1. Analysis > Run Analysis
2. MIDAS Gen performs:
   - Modal analysis (for modal method)
   - At each time step: calculate response
   - Store results at each step
3. Results:
   - **Displacement vs. time**: For any node
   - **Force vs. time**: For any member
   - **Base shear vs. time**: Total shear at base
   - **Maximum envelope**: Peak values over all time steps

### Reviewing Results

1. Results > Time History > Graph
2. Select node and component:
   - **Displacement**: X, Y, Z
   - **Velocity**: X, Y, Z
   - **Acceleration**: X, Y, Z
3. View time history graph
4. Export data to CSV

## Pushover Analysis

### Defining Hinges

1. Model > Hinge Properties
2. Create hinges:

#### Concrete Beam Hinge (Moment)
- **Type**: M3 (strong axis moment)
- **Yield moment**: Our = fy × As × (d - a/2)
- **Plastic rotation**: Per ASCE 41 Table 10-7
- **Acceptance criteria**: IO = 0.005 rad, LS = 0.02 rad, CP = 0.025 rad

#### Concrete Column Hinge (P-M)
- **Type**: P-M3 (coupled axial-moment)
- **Interaction surface**: Per ACI 318
- **Plastic rotation**: Per ASCE 41 Table 10-8
- **Acceptance criteria**: IO, LS, CP per table

#### Steel Beam Hinge (Moment)
- **Type**: M3
- **Yield moment**: Our = fy × Zx
- **Plastic rotation**: Per ASCE 41 Table 5-6
- **Acceptance criteria**: IO = 0.0098 rad, LS = 0.035 rad, CP = 0.05 rad

### Assigning Hinges

1. Select elements
2. Model > Assign Hinges
3. Set location: Start (0) and End (1) for beams and columns
4. Set hinge property

### Pushover Load Case

1. Load > Pushover Load Case
2. Set:
   - **Gravity case**: Dead + Live (applied first)
   - **Lateral load pattern**: 
     - **Modal**: Proportional to first mode (triangular)
     - **Uniform**: Proportional to mass (constant acceleration)
   - **Control method**: Displacement control
   - **Target displacement**: Per ASCE 41 equation
   - **Number of steps**: 20-50

### Running Pushover

1. Analysis > Run Analysis
2. MIDAS Gen performs:
   - Apply gravity loads (linear)
   - Incrementally apply lateral loads
   - Track hinge formation and rotation
   - Continue until target displacement or collapse
3. Results:
   - **Capacity curve**: Base shear vs. roof displacement
   - **Hinge states**: A-B (elastic) to D-E (collapsed)
   - **Performance point**: Per ASCE 41 displacement coefficient method

### Performance Evaluation

1. Results > Pushover > Hinge State
2. View hinge performance:
   - **IO (Immediate Occupancy)**: Green — operational after earthquake
   - **LS (Life Safety)**: Yellow — safe but damaged
   - **CP (Collapse Prevention)**: Red — near collapse
3. Check performance objective:
   - If all hinges ≤ IO: building is operational
   - If all hinges ≤ LS: life safety is achieved
   - If any hinge > CP: collapse risk — redesign required

## Story Drift Check

### ASCE 7 Drift Limits

1. Results > Story Drift
2. Check drift ratios:

| Structure Type | Drift Limit |
|---------------|-------------|
| Steel SMRF | h/50 |
| Concrete SMRF | h/50 |
| Steel SCBF | h/50 |
| Steel EBF | h/50 |
| Ordinary | h/100 |

3. If drift exceeds limit:
   - Increase lateral stiffness
   - Add shear walls or bracing
   - Increase member sizes

## P-Delta Effect

### P-Delta Check

1. Analysis > Analysis Control > P-Delta
2. Run with and without P-Delta
3. Compare:
   - **Drift**: P-Delta drift should be < 1.2 × no-P-Delta drift
   - If > 1.2: P-Delta is significant — structure may be unstable
   - **θ coefficient**: Per ASCE 7, θ = P × Δ / (V × hs)
   - If θ > 0.1: P-Delta must be included in analysis
   - If θ > θmax: Structure is unstable — redesign

## Wrapping Up

MIDAS Gen's seismic workflow is efficient because you can escalate from simple to complex without rebuilding the model. Start with equivalent lateral force, move to response spectrum, and only go to time history or pushover if the project demands it. The automatic load generation and story-based output make the whole process faster than doing it manually. Our rule: always check mass participation and drift before moving on to design — if those two look right, you're in good shape.
