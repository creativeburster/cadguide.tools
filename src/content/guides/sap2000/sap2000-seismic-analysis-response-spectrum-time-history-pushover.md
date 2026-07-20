---
title: "SAP2000 Seismic Analysis: Response Spectrum, Time History, and Pushover"
excerpt: "A guide to seismic analysis methods in SAP2000 covering modal analysis, response spectrum per ASCE 7, time history for site-specific ground motions, and nonlinear pushover analysis for performance-based design."
category: "workflow"
softwareSlug: "sap2000"
keyword: "sap2000 seismic analysis"
slug: "sap2000-seismic-analysis-response-spectrum-time-history-pushover"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.csiamerica.com/products/sap2000"
  - "https://wiki.csiamerica.com/display/kb/Response-spectrum+analysis+FAQ"

---

# SAP2000 Seismic Analysis: Response Spectrum, Time History, and Pushover

Seismic analysis is something we take very seriously — We've seen what happens when it's done wrong. SAP2000 gives you three levels of seismic analysis, and we've used all of them on different projects. Response spectrum is our go-to for most buildings, time history is essential for critical structures with site-specific ground motion, and pushover is what we use for performance-based assessment. Let us walk you through each method and when to use them.

## Modal Analysis (Prerequisite)

### Mass Model

1. Define > Mass Source
2. Select load patterns contributing to seismic mass:
   - **Dead Load**: 100% (self-weight + superimposed dead)
   - **Live Load**: 25% (reduced per ASCE 12.7.2)
3. SAP2000 assembles the mass matrix from specified load patterns

### Running Modal Analysis

1. Define > Analysis Cases > Add New Case
2. Set case type: Modal
3. Set:
   - **Number of modes**: 15-30 (enough for 90% mass participation)
   - **Maximum frequency**: Optional cut-off
4. Analyze > Run Analysis
5. Results:
   - **Natural periods (T)**: For each mode
   - **Frequencies (f)**: f = 1/T
   - **Mode shapes**: Displacement pattern per mode
   - **Mass participation**: Per mode and cumulative

### Mass Participation Check

1. Display > Show Tables > Modal Information
2. Check cumulative mass participation:

| Mode | Period (s) | UX (%) | UY (%) | RX (%) | RY (%) | RZ (%) |
|------|-----------|--------|--------|--------|--------|--------|
| 1 | 1.234 | 0.1 | 72.5 | 0.0 | 0.0 | 15.2 |
| 2 | 1.087 | 68.3 | 0.2 | 0.0 | 0.0 | 5.1 |
| 3 | 0.892 | 5.1 | 8.7 | 0.0 | 0.0 | 45.3 |
| 4 | 0.456 | 12.4 | 0.5 | 0.0 | 0.0 | 3.2 |
| 5 | 0.321 | 8.2 | 15.3 | 0.0 | 0.0 | 8.7 |
| Cum. | - | 94.1 | 97.2 | 0.0 | 0.0 | 77.5 |

3. **Requirement**: Cumulative ≥ 90% in each horizontal direction (UX, UY)
4. If not met: increase number of modes

## Response Spectrum Analysis

### Defining the Response Spectrum

1. Define > Functions > Response Spectrum
2. Add new function:
   - **ASCE 7-22**: Built-in spectrum per ASCE 7
   - **IS 1893**: Indian standard spectrum
   - **EN 1998-1**: Eurocode 8 spectrum
   - **User-defined**: Custom spectrum from text file
3. Set ASCE 7 parameters:
   - **SDS**: Short-period spectral acceleration (e.g., 0.6g)
   - **SD1**: 1-second spectral acceleration (e.g., 0.3g)
   - **TL**: Long-period transition (e.g., 8 seconds)
   - **Site class**: A through F
4. SAP2000 generates the spectrum curve (Sa vs. T)

### Creating Response Spectrum Load Case

1. Define > Load Cases > Add New Case
2. Set:
   - **Case type**: Response Spectrum
   - **Initial case**: Modal (uses modal results)
   - **Damping**: 5% (concrete), 3% (steel), 2% (welded steel)
3. Set direction:
   - **U1 (X)**: Acceleration in X direction
   - **U2 (Y)**: Acceleration in Y direction
   - **Scale factor**: Convert g to actual acceleration (e.g., 9.81 m/s²)
4. Set modal combination:
   - **CQC** (Complete Quadratic Combination): Recommended (accounts for closely-spaced modes)
   - **SRSS** (Square Root of Sum of Squares): Simple, conservative
5. Set directional combination:
   - **SRSS**: √(Rx² + Ry²) for combined X+Y
   - **Absolute**: |Rx| + |Ry| (conservative)
   - **Percentage**: 100% one direction + 30% perpendicular

### Running Response Spectrum

1. Analyze > Run Analysis
2. SAP2000 performs:
   - Modal analysis (if not already done)
   - For each mode: calculate spectral acceleration from spectrum
   - Calculate modal forces: F = m × Sa × mode shape
   - Combine modal forces using CQC or SRSS
3. Results are absolute (positive) — no sign information

### Directional Combinations

Per ASCE 7, combine orthogonal directions:
1. Create two response spectrum cases: RS-X and RS-Y
2. Create load combinations:
   - **Combo 1**: 1.2D + 1.0RS-X + 0.3RS-Y + 0.5L
   - **Combo 2**: 1.2D + 0.3RS-X + 1.0RS-Y + 0.5L
   - **Combo 3**: 0.9D + 1.0RS-X + 0.3RS-Y
   - **Combo 4**: 0.9D + 0.3RS-X + 1.0RS-Y
3. These combinations capture the worst-case directional scenario

### Base Shear Scaling

Per ASCE 12.9, compare dynamic base shear to static:

1. Calculate static base shear: V_static = Cs × W
2. Calculate dynamic base shear: V_dynamic = √(Vx² + Vy²) or from CQC
3. If V_dynamic < 0.85 × V_static:
   - Scale factor = 0.85 × V_static / V_dynamic
   - Apply scale factor to response spectrum case
   - Re-run analysis
4. If V_dynamic ≥ 0.85 × V_static: acceptable as-is

## Time History Analysis

### When to Use Time History

- Near-fault sites (within 10km of active fault)
- Structures with seismic isolation or dampers
- Irregular structures where response spectrum is inadequate
- Equipment vibration analysis
- Blast loading

### Defining Time History Function

1. Define > Functions > Time History
2. Add new function:
   - **From file**: Import ground motion record (AT2, CSV, TXT)
   - **Built-in**: El Centro, Northridge, Loma Prieta, Kobe
   - **User-defined**: Enter acceleration values manually
3. Format: Time (sec), Acceleration (g) — one pair per line
4. Set:
   - **Number of points**: Typically 1000-5000
   - **Time step**: 0.005-0.02 seconds
   - **Duration**: 10-60 seconds

### Creating Time History Load Case

1. Define > Load Cases > Add New Case
2. Set:
   - **Case type**: Time History
   - **Initial case**: Modal or None (direct integration)
3. Set analysis method:
   - **Modal**: Uses modal superposition (faster, good for linear)
   - **Direct Integration**: Newmark-β or Hilber-Hughes-Taylor (slower, for nonlinear)
4. Set:
   - **Time step**: 0.005-0.02 seconds (match ground motion)
   - **Number of steps**: Match ground motion duration
   - **Damping**: 5% (concrete), 3% (steel)
5. Add load application:
   - **Acceleration**: U1 (X), U2 (Y), or U3 (vertical)
   - **Function**: Select the time history function
   - **Scale factor**: Convert g to m/s² (multiply by 9.81)

### Running Time History

1. Analyze > Run Analysis
2. SAP2000 performs:
   - At each time step: calculate displacements, velocities, accelerations
   - At each time step: calculate member forces
   - Store results at every time step (or at specified intervals)
3. Analysis time: minutes to hours depending on model size and time steps

### Reviewing Time History Results

1. Display > Show Plot Functions
2. Select joints and components:
   - **Displacement vs. time**: For any joint
   - **Velocity vs. time**: For any joint
   - **Acceleration vs. time**: For any joint
   - **Force vs. time**: For any frame element
3. Identify peak values:
   - **Maximum displacement**: Over entire time history
   - **Maximum force**: Over entire time history
   - **Time of peak**: When maximum occurs
4. Export time history data to CSV for further analysis

### Maximum and Minimum Envelope

1. Create a "Modal History" load combination
2. SAP2000 creates envelopes:
   - **Max**: Maximum value at each location over all time steps
   - **Min**: Minimum value at each location over all time steps
   - **Abs Max**: Maximum absolute value
3. Use envelopes for design:
   - Design for the maximum force at each location
   - Envelopes capture the worst case over the entire earthquake

## Pushover Analysis

### What Pushover Does

Pushover analysis applies a gradually increasing lateral load to the structure until it collapses. It evaluates the structure's performance under seismic loading beyond the elastic range.

### Defining Hinge Properties

1. Define > Section Properties > Hinge Properties
2. Create hinges for:
   - **Beams**: Moment hinges (M3) at ends
   - **Columns**: Axial-moment hinges (P-M3) at ends
   - **Braces**: Axial hinge (P) at midpoint
3. Set hinge moment-rotation curve:
   - **Yield point**: Our = fy × Z (plastic section modulus)
   - **Ultimate**: Rotation capacity per ASCE 41
   - **Acceptance criteria**: IO (Immediate Occupancy), LS (Life Safety), CP (Collapse Prevention)

### Creating Pushover Load Case

1. Define > Load Cases > Add New Case
2. Set:
   - **Case type**: Nonlinear Static
   - **Load application**: Gravity (dead + live) first, then lateral push
3. Set lateral load pattern:
   - **Uniform**: Force proportional to mass (uniform acceleration)
   - **Modal**: Force proportional to first mode shape (triangular for buildings)
   - **Custom**: User-defined force distribution
4. Set:
   - **Load control**: Push to a target displacement
   - **Displacement control**: Push to a target displacement at a control joint
   - **Target displacement**: Per ASCE 41 equation

### Running Pushover

1. Analyze > Run Analysis
2. SAP2000 performs:
   - Apply gravity loads (linear)
   - Incrementally apply lateral loads
   - At each step: check for hinge formation
   - When a hinge forms: redistribute forces
   - Continue until target displacement or collapse
3. Results:
   - **Capacity curve**: Base shear vs. roof displacement (pushover curve)
   - **Hinge formation sequence**: Which hinges form and in what order
   - **Performance point**: Where demand meets capacity (per ASCE 41)

### Interpreting Pushover Results

1. Display > Show Hinge Results
2. View:
   - **Hinge state**: A-B (elastic), B-C (yielded), C-D (strength loss), D-E (collapsed)
   - **Acceptance level**: IO, LS, or CP for each hinge
3. Check performance objective:
   - **IO**: Structure is operational after earthquake
   - **LS**: Structure is safe but may need major repairs
   - **CP**: Structure is near collapse — life safety only
4. If performance is not met:
   - Increase member sizes (delay hinge formation)
   - Add bracing or walls (reduce demand)
   - Add seismic isolation or dampers

## Wrapping Up

For most of our projects, response spectrum analysis is all we need. It's fast, code-accepted, and gives you the forces and drifts you need for design. Time history is for those special cases where the site-specific ground motion tells you something the code spectrum doesn't. Pushover is for when you need to demonstrate performance beyond elastic limits. Our recommendation: master response spectrum first, then add time history and pushover to your toolkit as project demands require them.
