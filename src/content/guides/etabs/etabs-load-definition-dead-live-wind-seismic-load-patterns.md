---
title: "ETABS Load Definition: Dead, Live, Wind, and Seismic Load Patterns"
excerpt: "ETABS load definition tools create dead, live, wind, and seismic load patterns for building analysis. I cover load pattern setup, load case combinations, wind load assignment per ASCE 7, seismic load definition with response spectrum, and load combination generation."
category: "workflow"
softwareSlug: "etabs"
keyword: "ETABS load definition dead live wind seismic load patterns combinations ASCE 7 response spectrum building analysis"
slug: "etabs-load-definition-dead-live-wind-seismic-load-patterns"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.csiamerica.com/products/etabs"
  - "https://docs.csiamerica.com/manuals/etabs/"
  - "https://www.csiamerica.com/support/learn"
---

# ETABS Load Definition: Dead, Live, Wind, and Seismic Load Patterns

I've defined loads for hundreds of building models in ETABS for structural design. Getting the load definition right is critical — loads drive the entire analysis and design process. Underestimate loads and the structure is unsafe; overestimate loads and the structure is uneconomical. ETABS provides comprehensive tools for defining dead, live, wind, and seismic loads according to major building codes.

## Load Patterns Overview

ETABS uses a two-level load definition system:
1. **Load Patterns**: Individual load types (dead, live, wind, seismic)
2. **Load Cases**: Analysis cases that apply load patterns (static, dynamic)
3. **Load Combinations**: Combinations of load cases for design (LRFD or ASD)

## Defining Load Patterns

### Dead Load

1. Go to **Define** → **Load Patterns**
2. The Load Patterns table shows existing patterns
3. Add or modify:
   - **Name**: "DEAD"
   - **Type**: Dead
   - **Self-weight multiplier**: 1.0 (auto-calculates element self-weight)
   - **Additional dead load**: Applied separately as floor or element loads
4. Additional dead loads (superimposed dead load, SID):
   - **Floor finishes**: 1.0-2.0 kN/m²
   - **Ceiling and MEP**: 0.5-1.0 kN/m²
   - **Partitions**: 1.0-2.0 kN/m² (movable partitions)
   - **Roofing**: 0.5-1.5 kN/m²
   - **Exterior walls**: Applied as line loads on perimeter beams
5. Click **OK**

### Live Load

1. In the Load Patterns table, add:
   - **Name**: "LIVE"
   - **Type**: Live
   - **Self-weight multiplier**: 0
2. Live load values (per code):
   - **Residential floors**: 2.0 kN/m² (40 psf)
   - **Office floors**: 2.5-3.0 kN/m² (50-60 psf)
   - **Corridors and lobbies**: 4.0 kN/m² (80 psf)
   - **Retail floors**: 4.0-5.0 kN/m² (80-100 psf)
   - **Roof (access)**: 2.0 kN/m² (40 psf)
   - **Roof (no access)**: 1.0 kN/m² (20 psf)
   - **Storage**: 5.0-7.5 kN/m² (100-150 psf)
3. Live load reduction:
   - ASCE 7 allows reduction based on tributary area
   - ETABS applies reduction factors automatically in design
4. Click **OK**

### Wind Load

1. In the Load Patterns table, add:
   - **Name**: "WINDX" and "WINDY"
   - **Type**: Wind
   - **Self-weight multiplier**: 0
2. Wind load definition:
   - Go to **Define** → **Load Patterns** → select WINDX
   - **Auto lateral load**: Select code (ASCE 7-22, ASCE 7-16, etc.)
   - **Exposure**: Define the building exposure (wind direction)
3. ASCE 7 wind parameters:
   - **Basic wind speed (V)**: e.g., 150 mph (Risk Category II) or per local code
   - **Wind direction**: 0°, 90°, 180°, 270°
   - **Exposure category**: B (urban), C (open), D (coastal)
   - **Building risk category**: I, II, III, IV
   - **Gust factor (G)**: 0.85 (rigid building) or calculated (flexible)
   - **Directionality factor (Kd)**: 0.85
   - **Topographic factor (Kzt)**: 1.0 (flat terrain) or calculated
4. Wind exposure:
   - **Width**: Building width perpendicular to wind direction
   - **Height range**: From base to roof
   - **Number of bays**: For distribution
5. ETABS calculates wind pressures at each story level
6. Click **OK**

### Seismic Load

1. In the Load Patterns table, add:
   - **Name**: "EQX" and "EQY"
   - **Type**: Seismic
   - **Self-weight multiplier**: 0
2. Seismic load definition:
   - Go to **Define** → **Load Patterns** → select EQX
   - **Auto lateral load**: Select code (ASCE 7-22, ASCE 7-16, IBC, etc.)
3. ASCE 7 seismic parameters:
   - **SDS**: Short-period design spectral acceleration (e.g., 0.4g)
   - **SD1**: 1-second design spectral acceleration (e.g., 0.2g)
   - **Site class**: A, B, C, D, E, F
   - **Risk category**: I, II, III, IV
   - **Importance factor (Ie)**: 1.0 (II), 1.25 (III), 1.5 (IV)
   - **Response modification factor (R)**:
     - Special RC moment frame: 8
     - Intermediate RC moment frame: 5
     - Ordinary RC moment frame: 3
     - RC shear wall: 5 (special), 4 (intermediate)
     - Steel BRBF: 8
     - Steel EBF: 7
   - **System overstrength factor (Ω0)**: 2.5-3.0
   - **Deflection amplification factor (Cd)**: 4-6.5
4. ETABS calculates seismic base shear and distributes it by story height
5. Click **OK**

## Response Spectrum Analysis

### Defining a Response Spectrum

1. Go to **Define** → **Functions** → **Response Spectrum Functions**
2. Click **Add New Function**
3. Select a code-based spectrum:
   - **ASCE 7-22**: Auto-generated from SDS, SD1, TL
   - **IBC**: Auto-generated from Ss, S1, site class
   - **Eurocode 8**: Auto-generated from ag, type, soil
   - **Custom**: User-defined spectrum points
4. For ASCE 7-22:
   - **SDS**: e.g., 0.4
   - **SD1**: e.g., 0.2
   - **T0**: 0.08s (SDS/SD1 × 0.2)
   - **TS**: 0.5s (SDS/SD1)
   - **TL**: Long-period transition (e.g., 8s)
5. The spectrum is plotted and tabulated
6. Click **OK**

### Creating a Response Spectrum Load Case

1. Go to **Define** → **Load Cases**
2. Click **Add New Load Case**
3. Set:
   - **Name**: "RESPONSE_SPECTRUM_X"
   - **Type**: Response Spectrum
   - **Direction**: X (or Y)
   - **Function**: Select the response spectrum function
   - **Scale factor**: 1.0 (or 9.81 to convert g to m/s²)
   - **Modal combination**: CQC (Complete Quadratic Combination) or SRSS
   - **Directional combination**: SRSS or 100/30/30
   - **Damping**: 0.05 (5% typical for concrete)
4. Click **OK**
5. Repeat for Y direction

## Load Combinations

### Creating Load Combinations

1. Go to **Define** → **Load Combinations**
2. Click **Add New Combo**
3. Set:
   - **Name**: e.g., "LC1" or "STRENGTH1"
   - **Type**: Strength (LRFD) or Service (ASD)
4. Add load cases with factors:
   - **Load case**: Select from the list
   - **Factor**: Load factor (e.g., 1.2 for dead, 1.6 for live)
5. Click **Add**
6. Repeat for each load case in the combination

### ASCE 7-22 / LRFD Combinations

Standard strength combinations:
```
LC1: 1.4 × DEAD
LC2: 1.2 × DEAD + 1.6 × LIVE + 0.5 × LIVE_ROOF
LC3: 1.2 × DEAD + 1.0 × WINDX + 1.0 × LIVE + 0.5 × LIVE_ROOF
LC4: 1.2 × DEAD - 1.0 × WINDX + 1.0 × LIVE + 0.5 × LIVE_ROOF
LC5: 1.2 × DEAD + 1.0 × WINDY + 1.0 × LIVE + 0.5 × LIVE_ROOF
LC6: 1.2 × DEAD - 1.0 × WINDY + 1.0 × LIVE + 0.5 × LIVE_ROOF
LC7: 1.2 × DEAD + 1.0 × EQX + 1.0 × LIVE + 0.2 × SNOW
LC8: 1.2 × DEAD - 1.0 × EQX + 1.0 × LIVE + 0.2 × SNOW
LC9: 1.2 × DEAD + 1.0 × EQY + 1.0 × LIVE + 0.2 × SNOW
LC10: 1.2 × DEAD - 1.0 × EQY + 1.0 × LIVE + 0.2 × SNOW
LC11: 0.9 × DEAD + 1.0 × WINDX
LC12: 0.9 × DEAD - 1.0 × WINDX
LC13: 0.9 × DEAD + 1.0 × EQX
LC14: 0.9 × DEAD - 1.0 × EQX
```

### ASD Combinations

```
LC1: 1.0 × DEAD
LC2: 1.0 × DEAD + 1.0 × LIVE
LC3: 1.0 × DEAD + 1.0 × LIVE + 0.6 × WINDX
LC4: 1.0 × DEAD + 1.0 × LIVE - 0.6 × WINDX
LC5: 0.6 × DEAD + 0.6 × WINDX
LC6: 0.6 × DEAD - 0.6 × WINDX
LC7: 1.0 × DEAD + 1.0 × LIVE + 0.7 × EQX
LC8: 1.0 × DEAD + 1.0 × LIVE - 0.7 × EQX
```

### Auto Load Combinations

1. Go to **Define** → **Load Combinations**
2. Click **Auto Load Combinations**
3. Select the design code (e.g., ASCE 7-22, ACI 318, AISC 360)
4. ETABS generates all required combinations automatically
5. Select which combinations to include:
   - **Strength combinations**: For member design
   - **Service combinations**: For deflection and drift checks
6. Click **OK**
7. Review the generated combinations for correctness

## Assigning Loads

### Floor Loads

1. Select floor (slab) elements
2. **Assign** → **Surface Loads** → **Uniform Load**
3. Set:
   - **Load pattern**: DEAD or LIVE
   - **Magnitude**: e.g., 2.0 kN/m² for live load
   - **Direction**: Gravity (Z direction, negative)
4. Click **OK**
5. The load is applied to the selected floor area

### Line Loads (Beam Loads)

1. Select beam elements
2. **Assign** → **Frame Loads** → **Distributed**
3. Set:
   - **Load pattern**: DEAD
   - **Magnitude**: e.g., 5.0 kN/m (wall load above the beam)
   - **Direction**: Gravity
4. Click **OK**

### Point Loads

1. Select a joint (node)
2. **Assign** → **Joint Loads** → **Forces**
3. Set:
   - **Load pattern**: DEAD or LIVE
   - **Force**: Fx, Fy, Fz (e.g., equipment weight)
   - **Moment**: Mx, My, Mz
4. Click **OK**

### Wall Loads on Beams

1. Calculate the wall weight:
   - Wall height × wall thickness × unit weight = load per meter
   - e.g., 3m × 0.2m × 24 kN/m³ = 14.4 kN/m
2. Select the beam below the wall
3. Assign as a distributed line load

## Mass Source Definition

### For Dynamic Analysis

1. Go to **Define** → **Mass Source**
2. Set the mass source:
   - **From self-weight and additional mass**: Auto from element weight
   - **From loads**: Use specified load patterns
3. Typical mass source:
   - **1.0 × DEAD**: Full dead load
   - **1.0 × LIVE** (or 0.25 × LIVE per code): Reduced live load for seismic mass
4. ASCE 7 requires:
   - 25% of live load for storage areas
   - 0% of live load for non-storage (or per code)
5. Click **OK**
6. The mass is used for modal analysis and seismic base shear calculation

## Common Issues

### Wind Loads Are Zero

- Check that wind exposure is defined (width, height range)
- Verify the wind speed and exposure category
- Check that the wind load pattern is set to "Auto lateral load"
- Verify the building dimensions in the wind load definition

### Seismic Base Shear Is Wrong

- Verify SDS and SD1 values from the site-specific seismic hazard
- Check the response modification factor (R)
- Verify the mass source (should include dead load + applicable live load)
- Check the structural system type
- Compare the base shear with a hand calculation

### Load Combinations Are Missing

- Use auto load combinations to generate all required combinations
- Check that all load patterns are defined before generating combinations
- Verify the design code selection
- Manually add any special combinations (e.g., notional loads)

### Floor Loads Don't Apply Correctly

- Check that slab elements are selected before assigning
- Verify the load direction (gravity = negative Z)
- Check the load magnitude units (kN/m² vs psf)
- Verify the load pattern is correct (DEAD vs LIVE)

## Summary

ETABS load definition creates the loading for structural analysis. Define load patterns: DEAD (with self-weight multiplier 1.0), LIVE (per code values), WIND (per ASCE 7 with wind speed, exposure, and building dimensions), and SEISMIC (per ASCE 7 with SDS, SD1, R, and system type). Create a response spectrum function for dynamic analysis and assign it to response spectrum load cases. Generate load combinations automatically using the auto load combination feature with the appropriate design code (ASCE 7-22, ACI 318, AISC 360). Assign floor loads (uniform on slabs), line loads (distributed on beams for walls), and point loads (at joints for equipment). Define the mass source for dynamic analysis (1.0 × DEAD + 0.25 × LIVE for storage). The most common issues — zero wind loads, wrong base shear, missing combinations, and incorrect floor loads — are addressed by checking wind exposure, verifying seismic parameters, using auto combinations, and confirming load direction and units. Correct load definition is the foundation of accurate structural analysis and safe building design.
