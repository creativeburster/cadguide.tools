---
title: "CAESAR II Nozzle Load Analysis: Equipment Connection Evaluation and API 610/617 Compliance"
excerpt: "How to evaluate equipment nozzle loads in CAESAR II — covering API 610 pump nozzle allowables, API 617 compressor loads, WRC 107 vessel nozzle analysis, nozzle flexibility modeling, and reducing nozzle loads through pipe routing and spring supports."
category: "standards"
softwareSlug: "caesar-ii"
keyword: "caesar ii nozzle load analysis api 610 617 equipment connection compliance"
slug: "caesar-ii-nozzle-load-analysis-api-610-617-equipment-compliance"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://aliresources.hexagon.com/engineering-analysis/decoding-pipe-stress-analysis-a-deep-dive-into-training-dynamics-and-efficient-project-estimations"
  - "https://aliresources.hexagon.com/brochures/the-worlds-most-respected-tool-for-pipe-stress-analysis"
---

# CAESAR II Nozzle Load Analysis: Equipment Connection Evaluation and API 610/617 Compliance

Equipment nozzle loads are the most scrutinized output of a pipe stress analysis. Piping engineers check them. Mechanical engineers check them. Vendors check them. If your nozzle loads exceed the allowable, the equipment vendor won't approve the design, and the project stops. We've spent more time reducing nozzle loads than any other aspect of pipe stress. Here's our approach.

## Why Nozzle Loads Matter

Excessive nozzle loads cause:
- **Equipment damage**: Deformed casings, misaligned shafts, bearing failure
- **Vibration**: Rotating equipment is sensitive to nozzle loads — causes vibration and premature failure
- **Leakage**: Flanged connections leak under high bending moments
- **Voided warranty**: Vendors won't warranty equipment with exceeded nozzle loads
- **Code non-compliance**: ASME B31.3 requires nozzle loads within allowables

## Step 1: Model Equipment Nozzles

### Rigid Element Approach

1. In the piping model, add a **rigid element** from the pipe to the equipment center:
   - **From node**: Pipe connection node
   - **To node**: Equipment center node
   - **Length**: Distance from the pipe flange to the equipment centerline
   - **Weight**: Include the equipment nozzle weight
2. At the equipment center node, add an **anchor** (all degrees of freedom fixed).
3. CAESAR II calculates the forces and moments at the nozzle (pipe connection node).

### Nozzle Flexibility Approach

For more accurate analysis, model the nozzle flexibility:

1. Instead of a rigid element, enter the **nozzle stiffness**:
   - **Axial stiffness**: Force per unit axial displacement
   - **Bending stiffness**: Moment per unit rotation
   - **Shear stiffness**: Force per unit lateral displacement
2. Get stiffness values from:
   - **Equipment vendor**: Most vendors provide nozzle stiffness on request
   - **WRC 107 calculation**: For pressure vessel nozzles
   - **API standards**: For standard equipment types

### Equipment Modules in CAESAR II

CAESAR II has built-in equipment modules:

1. **Pump module**: API 610 nozzle load checking
   - Enter pump type (horizontal, vertical)
   - Enter nozzle size and rating
   - CAESAR II compares loads with API 610 allowables

2. **Compressor module**: API 617 nozzle load checking
   - Enter compressor type (centrifugal, reciprocating)
   - Enter nozzle configuration
   - CAESAR II compares loads with API 617 allowables

3. **Vessel module**: WRC 107/297 nozzle analysis
   - Enter vessel dimensions and nozzle details
   - CAESAR II calculates vessel shell stresses from nozzle loads

4. **Turbine module**: NEMA SM23 or API 611/612 nozzle load checking
   - Enter turbine type and nozzle configuration
   - CAESAR II compares loads with turbine allowables

## Step 2: Check API 610 Pump Nozzle Loads

API 610 provides allowable nozzle loads for centrifugal pumps:

### API 610 Allowable Loads

For each pump nozzle, API 610 provides:
- **Fx, Fy, Fz**: Allowable forces (N or lbf)
- **Mx, Our, Mz**: Allowable moments (N·m or ft·lbf)

The allowables depend on:
- **Nozzle size**: Larger nozzles have higher allowables
- **Pump type**: Horizontal vs vertical, overhung vs between-bearings
- **Pressure rating**: Higher rated nozzles have higher allowables

### Checking Process

1. Run the CAESAR II analysis.
2. Go to **Output** → **Nozzle Load Report**.
3. For each pump nozzle:
   - **Applied loads**: Fx, Fy, Fz, Mx, Our, Mz from the piping model
   - **Allowable loads**: From API 610 (or vendor specification)
   - **Ratio**: Applied / Allowable
4. Check each component:
   - **Each force and moment must be within the allowable**
   - **Combined load check**: API 610 also has a combined load equation
5. If any load exceeds the allowable:
   - The pump nozzle is non-compliant
   - Redesign the piping to reduce loads

### API 610 Combined Load Check

For horizontal pumps with two nozzles (suction and discharge):

```
|FxS - FxD| / (FxA_S + FxA_D) < 0.5
|FyS + FyD| / (FyA_S + FyA_D) < 0.5
|FzS - FzD| / (FzA_S + FzA_D) < 0.5
```

Where S = suction, D = discharge, A = allowable.

## Step 3: Check API 617 Compressor Nozzle Loads

API 617 provides allowable nozzle loads for centrifugal and axial compressors:

### API 617 Allowable Loads

Similar to API 610, but with different values:
- **Typically lower than pump allowables** — compressors are more sensitive
- **Depend on nozzle size and casing configuration**
- **May include additional checks** for multi-casing compressors

### Checking Process

1. Same as API 610 — use the compressor module in CAESAR II.
2. Compare applied loads with API 617 allowables.
3. Check each force and moment component.
4. Check combined loads if required.

## Step 4: Check Vessel Nozzle Loads (WRC 107)

For pressure vessel nozzles, use WRC 107 (or WRC 537):

### WRC 107 Analysis

1. In the vessel module, enter:
   - **Vessel diameter and thickness**
   - **Nozzle diameter and thickness**
   - **Nozzle location** (vessel head or shell)
   - **Design pressure and temperature**
2. CAESAR II calculates:
   - **Membrane stress** in the vessel shell from nozzle loads
   - **Bending stress** in the vessel shell from nozzle loads
   - **Total stress** = membrane + bending
3. Compare with ASME Section VIII allowables:
   - **Membrane stress** ≤ 1.5 × S (design stress)
   - **Membrane + bending** ≤ 1.5 × S
   - **Total stress** ≤ 3 × S (for discontinuity)

### When WRC 107 Is Required

- **Vessel vendors** often require WRC 107 analysis for large nozzles
- **ASME Section VIII** requires nozzle analysis for certain configurations
- **Client specifications** may require WRC 107 for all vessel nozzles

## Step 5: Reduce Nozzle Loads

When nozzle loads exceed allowables, reduce them:

### Method 1: Add Flexibility Near the Nozzle

1. **Add an expansion loop** near the equipment — absorbs thermal expansion before it reaches the nozzle
2. **Change pipe routing** — add bends instead of straight runs to the nozzle
3. **Use a lighter pipe schedule** — reduces weight (but check pressure rating)

### Method 2: Use Spring Supports

1. **Add a spring hanger near the nozzle** — supports the pipe weight, reducing the vertical load on the nozzle
2. **Spring selection**:
   - **Operating load**: Pipe weight at the spring location
   - **Movement**: Thermal displacement at the spring location
3. The spring reduces the sustained load (weight) on the nozzle
4. The spring allows thermal movement, reducing expansion loads

### Method 3: Move Supports

1. **Move supports closer to the nozzle** — reduces the pipe span and the bending moment on the nozzle
2. **Add a support directly at the nozzle** — if space allows, a support right at the equipment reduces loads dramatically
3. **Adjust support types** — replace a resting support with a guide to control lateral loads

### Method 4: Reduce Friction

1. **Use Teflon slide plates** — reduces friction from 0.3 to 0.1
2. **Lower friction** means less axial force transferred to the nozzle
3. **Use rollers** — for large pipes, roller supports eliminate friction

### Method 5: Cold Spring

1. **Apply cold spring near the nozzle** — pre-stresses the pipe in the cold state
2. **Reduces hot loads** on the nozzle
3. **ASME B31.3**: Cold spring is not credited for stress range, but it does reduce operating loads
4. **Use cautiously** — difficult to execute correctly in the field

### Method 6: Change Pipe Routing

1. **Route the pipe to approach the nozzle from a flexible direction** — perpendicular to the nozzle axis provides more flexibility than axial
2. **Add a Z-bend or L-bend** before the nozzle — absorbs expansion
3. **Avoid straight runs to the nozzle** — straight pipes transfer all expansion to the equipment

## Step 6: Document Nozzle Loads

Create a nozzle load summary for each equipment connection:

1. **Equipment name and tag**: e.g., "P-101A, Centrifugal Pump"
2. **Nozzle**: e.g., "Suction, 8-inch 150#"
3. **Load case**: Operating (W+P+T)
4. **Applied loads**:
   - Fx, Fy, Fz (forces)
   - Mx, Our, Mz (moments)
5. **Allowable loads** (from API 610, vendor, or WRC 107):
   - Fx_A, Fy_A, Fz_A
   - Mx_A, My_A, Mz_A
6. **Ratios**: Applied / Allowable for each component
7. **Status**: Pass or Fail

### Nozzle Load Report Format

Create a table for each equipment connection:

| Load | Applied | Allowable | Ratio | Status |
|---|---|---|---|---|
| Fx (N) | 1,250 | 3,000 | 42% | Pass |
| Fy (N) | 2,100 | 2,500 | 84% | Pass |
| Fz (N) | 850 | 2,000 | 43% | Pass |
| Mx (N·m) | 450 | 1,000 | 45% | Pass |
| Our (N·m) | 1,800 | 2,000 | 90% | Warning |
| Mz (N·m) | 320 | 800 | 40% | Pass |

## Best Practices

- **Model nozzle flexibility** — rigid anchors over-predict nozzle loads
- **Use vendor-provided allowables** — API standards are minimums; vendors may have stricter limits
- **Check all load cases** — operating, hydrotest, wind, seismic
- **Check combined loads** — API 610 and 617 have combined load equations
- **Add spring supports near equipment** — reduces sustained loads on nozzles
- **Add flexibility near nozzles** — reduces expansion loads
- **Document all nozzle loads** — the nozzle load report is a key project deliverable
- **Coordinate with equipment vendors** — get allowable loads and stiffness values early
- **Review with mechanical engineers** — nozzle loads affect equipment performance
- **Don't accept marginal loads** — if the ratio is > 90%, redesign to create margin
