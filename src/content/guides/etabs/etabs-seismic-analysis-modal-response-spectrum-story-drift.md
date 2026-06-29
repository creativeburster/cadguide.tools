---
title: "ETABS Seismic Analysis: Modal, Response Spectrum, and Story Drift Evaluation"
excerpt: "ETABS seismic analysis tools calculate building response to earthquake loads using modal analysis and response spectrum methods. I cover modal analysis setup, CQC modal combination, response spectrum application, story drift calculation, and seismic design checks per ASCE 7."
category: "workflow"
softwareSlug: "etabs"
keyword: "ETABS seismic analysis modal response spectrum story drift CQC ASCE 7 earthquake building response natural period"
slug: "etabs-seismic-analysis-modal-response-spectrum-story-drift"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.csiamerica.com/products/etabs"
  - "https://docs.csiamerica.com/manuals/etabs/"
  - "https://www.csiamerica.com/support/learn"
---

# ETABS Seismic Analysis: Modal, Response Spectrum, and Story Drift Evaluation

I've performed seismic analysis on buildings from 3-story concrete structures to 50-story steel towers in ETABS. Seismic analysis is one of the most critical aspects of building design in earthquake-prone regions. ETABS provides comprehensive tools for modal analysis, response spectrum analysis, and story drift evaluation — all essential for verifying that a building meets seismic code requirements.

## Seismic Analysis Overview

ETABS supports several seismic analysis methods:
- **Equivalent Lateral Force (ELF)**: Simplified static method per ASCE 7
- **Response Spectrum Analysis (RSA)**: Dynamic method using the design spectrum
- **Time History Analysis**: Step-by-step dynamic analysis with ground motion records
- **Pushover Analysis**: Nonlinear static analysis for performance-based design

## Modal Analysis

### Why Modal Analysis First?

Modal analysis is the foundation of all dynamic analysis:
- Calculates natural frequencies and mode shapes
- Determines the building's fundamental period
- Provides the basis for response spectrum analysis
- Identifies the mass participation in each direction

### Setting Up Modal Analysis

1. Go to **Define** → **Load Cases**
2. Find the **MODAL** case (auto-created by ETABS)
3. Set parameters:
   - **Number of modes**: 12-20 minimum (enough for 90% mass participation)
   - **Maximum frequency**: Optional (e.g., 100 Hz) to limit modes
   - **Mass source**: Verify the correct mass source is selected
4. Click **OK**

### Running Modal Analysis

1. Go to **Analyze** → **Run Analysis**
2. Select the MODAL case
3. Click **Run**
4. After analysis, check results:
   - **Table**: Display → Show Tables → Modal Results
   - **Frequencies and periods**: Each mode's frequency (Hz) and period (s)
   - **Mass participation**: X, Y, and Z participation for each mode

### Interpreting Modal Results

#### Natural Periods

- **Fundamental period (T1)**: The period of the first mode in each direction
  - Compare with the approximate period Ta = Ct × hn (ASCE 7 formula)
  - Ct: 0.016 (steel moment frame), 0.020 (RC moment frame), 0.030 (RC shear wall)
  - h: Building height in meters
  - If the ETABS period is much larger than Ta, the model may be too flexible
  - ASCE 7 limits the period used for design: T ≤ Cu × Ta

#### Mass Participation

- Check mass participation for each direction:
  - **X direction**: Sum of participation should be > 90%
  - **Y direction**: Sum of participation should be > 90%
  - **Z direction**: Usually low (vertical modes are higher frequency)
- If participation is < 90%, increase the number of modes
- The first 2-3 modes typically capture 80-90% of the mass

#### Mode Shapes

1. Display → Show Mode Shape
2. Select a mode number
3. The mode shape is displayed as a deformed shape
4. Interpret:
   - **Mode 1**: Usually first X or Y translation (fundamental mode)
   - **Mode 2**: Usually the other horizontal direction
   - **Mode 3**: Usually torsion
   - **Mode 4+**: Higher modes (less mass participation)
5. Check for:
   - **Torsional modes**: If torsion is the first or second mode, the building has a torsional irregularity
   - **Coupled modes**: If translation and torsion are coupled, the building has an irregularity

## Response Spectrum Analysis

### Setting Up Response Spectrum

1. Define a response spectrum function (see Load Definition guide)
2. Go to **Define** → **Load Cases**
3. Click **Add New Load Case**
4. Set:
   - **Name**: "RSX" (response spectrum X)
   - **Type**: Response Spectrum
   - **Direction**: X
   - **Function**: Select the response spectrum function
   - **Scale factor**: 
     - If spectrum is in g: Scale = g (9.81 m/s² or 386 in/s²)
     - If spectrum is in m/s²: Scale = 1.0
   - **Modal combination**: CQC (recommended) or SRSS
   - **Directional combination**: 
     - SRSS: √(Rx² + Ry²) — for combining X and Y
     - 100/30/30: 100% in one direction + 30% in perpendicular
5. Damping:
   - **5%**: Typical for concrete buildings
   - **3%**: Typical for steel buildings
   - **2%**: For lightly damped structures
6. Click **OK**
7. Repeat for Y direction ("RSY")

### Running Response Spectrum Analysis

1. Go to **Analyze** → **Run Analysis**
2. Select MODAL, RSX, and RSY
3. Click **Run**
4. ETABS runs modal analysis first, then applies the response spectrum

### Scaling Response Spectrum Results

The response spectrum base shear must be scaled to match the ELF base shear per ASCE 7:

1. Calculate the ELF base shear (Velf):
   - V = Cs × W
   - Cs = SDS / (R / Ie)
   - W = Seismic weight of the building
2. Calculate the RSA base shear (Vrs):
   - Display → Show Tables → Base Reactions → RSX
   - Read the total base shear in the X direction
3. Scale factor = Velf / Vrs
4. If Vrs < Velf × 0.85 (ASCE 7-16) or Vrs < Velf (ASCE 7-22):
   - Scale up the response spectrum by the scale factor
   - Update the scale factor in the load case
5. Re-run the analysis with the updated scale factor

### Interpreting Response Spectrum Results

#### Story Forces

1. Display → Show Tables → Story Forces
2. Select the response spectrum load case
3. Check:
   - **Story shear**: Force at each story level
   - **Story moment**: Overturning moment at each story
   - **Story drift**: Lateral displacement between stories

#### Displacement

1. Display → Show Deformed Shape
2. Select the response spectrum load case
3. The deformed shape shows the building's response to the spectrum
4. Check:
   - **Maximum displacement**: At the roof
   - **Displacement profile**: Should be smooth (no kinks)
   - **Torsional displacement**: Check for asymmetric displacement

## Story Drift Evaluation

### Calculating Story Drift

1. Display → Show Tables → Story Drifts
2. Select the load case (RSX, RSY, or wind)
3. The table shows:
   - **Story**: Story name
   - **Displacement**: Lateral displacement at each story
   - **Drift**: Difference in displacement between adjacent stories
   - **Drift ratio**: Drift / story height
4. ASCE 7 drift limits:
   - **Risk Category I/II**: Δ ≤ 0.020 × story height (1/50)
   - **Risk Category III**: Δ ≤ 0.015 × story height (1/67)
   - **Risk Category IV**: Δ ≤ 0.010 × story height (1/100)
5. The drift must be multiplied by the deflection amplification factor Cd:
   - **Δ × Cd**: Design story drift
   - Compare Δ × Cd to the code limits

### Drift Check Example

For a 4-story office building (Risk Category II):
- Story height: 3.5m
- ASCE 7 limit: 0.020 × 3500mm = 70mm
- Cd = 5.5 (special RC moment frame)
- ETABS drift (from RSA): 8mm at Story 3
- Design drift: 8mm × 5.5 = 44mm
- **44mm < 70mm → OK**

### Torsional Irregularity Check

1. Check the displacement at each edge of the building:
   - **Maximum displacement**: At one edge
   - **Average displacement**: At the center
2. Torsional irregularity exists if:
   - **Max / Avg > 1.2**: Torsional irregularity (Type 1)
   - **Max / Avg > 1.4**: Extreme torsional irregularity (Type 1a)
3. If torsional irregularity exists:
   - Amplify the accidental torsion by Ax = (δmax / δavg)²
   - Increase the design forces
   - Consider repositioning walls or adjusting stiffness

## P-Delta Analysis

### Setting Up P-Delta

1. Go to **Analyze** → **Set Analysis Options**
2. Set **P-Delta**:
   - **P-Delta with Large Delta**: Nonlinear geometric (most accurate)
   - **P-Delta with Small Delta**: Linearized (faster, less accurate)
3. P-Delta load case:
   - **Load combination**: Typically 1.0 × DEAD + 0.5 × LIVE
   - This represents the gravity load that causes second-order effects
4. Run the analysis with P-Delta enabled
5. P-Delta effects increase drift and forces in slender buildings

### When P-Delta Matters

- **Slender buildings**: Height/width > 3
- **Flexible structures**: Long periods
- **Heavy gravity loads**: High axial forces in columns
- **Seismic design**: ASCE 7 requires P-Delta for stability coefficient check
- **Stability coefficient (θ)**: θ = P × Δ / (V × hs × Cd)
  - If θ > 0.25: Structure is unstable — redesign
  - If θ > 0.10: P-Delta effects must be included
  - If θ < 0.10: P-Delta effects are negligible

## Seismic Design Checks

### Base Shear Distribution

1. Check the story shear distribution:
   - ELF: Fx = Cvx × V (triangular distribution)
   - RSA: From modal combination
2. Compare ELF and RSA base shears
3. If RSA < 0.85 × ELF (ASCE 7-16), scale up RSA

### Overturning Moment

1. Check the overturning moment at the base
2. Compare with the resisting moment (dead load × building width/2)
3. Safety factor = Resisting / Overturning > 1.5 (typical)

### Diaphragm Forces

1. Check diaphragm forces at each floor
2. Fpx = Fnx × (Wpx / Wx) — ASCE 7 diaphragm force
3. Verify the diaphragm can transfer the force to the vertical elements

## Common Issues

### Mass Participation Is Low

- Increase the number of modes (12 → 20 → 30)
- Check the mass source (ensure dead load is included)
- Verify that all elements have mass (check material density)
- Look for disconnected elements (they add mass but don't participate)

### Period Is Much Different from Approximate

- If ETABS period > Cu × Ta: The model may be too flexible
  - Check section properties (too small?)
  - Check boundary conditions (supports fixed?)
  - Check stiffness modifiers (too low?)
- If ETABS period < Ta: The model may be too stiff
  - Check for rigid diaphragm constraints
  - Verify section sizes (too large?)

### Drift Exceeds Code Limits

- Increase member sizes (beams, columns, walls)
- Add shear walls or braced frames
- Reduce the building height (if possible)
- Change the structural system (higher R value)
- Check P-Delta effects (may be amplifying drift)

### Torsional Irregularity

- Reposition shear walls or braced frames for better symmetry
- Increase the stiffness of one side to balance torsion
- Add accidental torsion (5% eccentricity per ASCE 7)
- Consider a torsionally stiff structural system

## Summary

ETABS seismic analysis evaluates building response to earthquake loads. Run modal analysis first to determine natural periods and mass participation (target > 90% in each direction). Set up response spectrum analysis with the design spectrum, CQC modal combination, and appropriate damping (5% concrete, 3% steel). Scale the RSA base shear to match the ELF base shear per ASCE 7. Calculate story drift and multiply by Cd for the design drift — compare to ASCE 7 limits (0.020h for Risk Category II). Check for torsional irregularity (max/avg displacement > 1.2). Enable P-Delta analysis for slender buildings and check the stability coefficient. The most common issues — low mass participation, period mismatch, excessive drift, and torsional irregularity — are addressed by increasing modes, checking section properties and stiffness, increasing member sizes, and repositioning lateral force-resisting elements. Seismic analysis in ETABS ensures the building meets code requirements and performs safely under earthquake loading.
