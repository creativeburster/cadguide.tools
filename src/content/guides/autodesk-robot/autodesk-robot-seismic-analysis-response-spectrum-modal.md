---
title: "Autodesk Robot Seismic Analysis: Response Spectrum and Modal Analysis Setup"
excerpt: "How to perform seismic analysis in Autodesk Robot using response spectrum method — covering modal analysis, mass source definition, spectrum input, and result interpretation per ASCE 7 and Eurocode 8."
category: "standards"
softwareSlug: "autodesk-robot"
keyword: "autodesk robot seismic analysis response spectrum modal"
slug: "autodesk-robot-seismic-analysis-response-spectrum-modal"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Recommended-modal-analysis-settings-for-seismic-load-cases-in-Robot-Structural-Analysis.html"
  - "https://www.autodesk.com/products/robot-structural-analysis/overview"
---

# Autodesk Robot Seismic Analysis: Response Spectrum and Modal Analysis Setup

Seismic analysis is required for most building structures in seismic zones. Robot handles both the equivalent lateral force method and the response spectrum method. For buildings over 48m or with irregularities, response spectrum is required. Here's my complete setup process.

## Step 1: Modal Analysis Setup

### Define Mass Source

1. **Analysis** → **Modal Analysis** → **Mass Matrix**.
2. Define mass sources:
   - **Self-weight**: Robot auto-calculates from element density
   - **Dead load**: Additional permanent loads (finishes, partitions, equipment)
   - **Live load**: Typically 25-50% of live load is included in seismic mass
     - ASCE 7: 25% of storage live load, 0% of other live load
     - Eurocode 8: 30% of live load for residential, 80% for storage

3. The total seismic mass = self-weight + dead load + applicable live load.
4. This mass is distributed to the model nodes based on element connectivity.

### Define Number of Modes

1. **Analysis** → **Modal Analysis** → **Parameters**.
2. Set:
   - **Number of modes**: Start with 20-30 modes for typical buildings
   - **Method**: Subspace iteration (default, reliable)
   - **Convergence tolerance**: 1e-6 (default)

3. Run modal analysis.
4. Check the effective mass participation:
   - For each direction (X, Y, Z), the sum of effective mass should be ≥ 90% of total mass
   - If < 90%, increase the number of modes and re-run

### Review Mode Shapes

1. **Results** → **Modal Analysis Results**.
2. Review each mode:
   - **Mode 1**: Typically fundamental X-direction translation
   - **Mode 2**: Typically fundamental Y-direction translation
   - **Mode 3**: Typically torsional rotation
   - **Higher modes**: Mixed translation and torsion

3. Check natural periods:
   - **T1 (fundamental)**: Should be approximately 0.1 × number of stories (seconds) for moment frames
   - For braced frames: 0.05-0.08 × number of stories
   - If T1 is much longer, the structure may be too flexible

## Step 2: Response Spectrum Definition

### ASCE 7 Spectrum

1. **Loads** → **Response Spectrum** → **New**.
2. Select code: **ASCE 7-22**.
3. Enter parameters:
   - **Ss**: Short-period spectral acceleration (from USGS maps for site coordinates)
   - **S1**: 1-second spectral acceleration
   - **Site class**: A (hard rock) through F (soft soil)
   - **Risk category**: I-IV (affects Ie factor)
   - **Response modification factor (R)**: 
     - R=3 for OCBF (ordinary concentrically braced frame)
     - R=8 for SCBF (special concentrically braced frame)
     - R=8 for SMF (special moment frame)
     - R=3.5 for OMF (ordinary moment frame)

4. Robot calculates:
   - **SDS = (2/3) × Fa × Ss** (design spectral acceleration at short periods)
   - **SD1 = (2/3) × Fv × S1** (design spectral acceleration at 1 second)
   - **T0 = 0.2 × SD1/SDS**
   - **TS = SD1/SDS**
   - **TL = Long-period transition period**

5. The spectrum shape:
   - **T < T0**: Sa = SDS × (0.4 + 0.6 × T/T0)
   - **T0 < T < TS**: Sa = SDS
   - **TS < T < TL**: Sa = SD1/T
   - **T > TL**: Sa = SD1 × TL / T²

### Eurocode 8 Spectrum

1. Select code: **Eurocode 8 (EN 1998-1)**.
2. Enter:
   - **agR**: Reference peak ground acceleration (e.g., 0.15g for low, 0.3g for moderate)
   - **Importance factor (γI)**: 1.0 (II), 1.2 (III), 1.4 (IV)
   - **Ground type**: A (rock), B (dense sand), C (stiff soil), D (soft soil), E (soft above hard)
   - **Spectrum type**: Type 1 (moderate to high seismicity) or Type 2 (low seismicity)
   - **Behavior factor (q)**: 
     - q=1.5 for low ductility (DCL)
     - q=4 for medium ductility (DCM)
     - q=6.5 for high ductility (DCH)

3. Robot calculates the Eurocode 8 design spectrum automatically.

## Step 3: Apply Response Spectrum

1. **Loads** → **Response Spectrum Analysis**.
2. Select the defined spectrum.
3. Set direction:
   - **X-direction**: Apply spectrum in X
   - **Y-direction**: Apply spectrum in Y
   - **Accidental torsion**: 5% of building dimension perpendicular to seismic direction

4. Set modal combination method:
   - **SRSS (Square Root of Sum of Squares)**: Simple, conservative
   - **CQC (Complete Quadratic Combination)**: More accurate for closely-spaced modes
   - Use CQC for buildings with torsional modes close to translational modes

5. Set directional combination:
   - **SRSS**: √(Fx² + Fy²) — for combining X and Y seismic effects
   - **100/30 rule**: 100% in one direction + 30% in perpendicular

6. Click **Calculate**.
7. Robot runs the response spectrum analysis and combines modal results.

## Step 4: Interpret Results

### Base Shear

1. **Results** → **Reactions** → **Base Shear**.
2. Compare response spectrum base shear with equivalent lateral force (ELF) base shear:
   - ASCE 7 requires: V_RS ≥ 0.85 × V_ELF (for regular structures)
   - If V_RS < 0.85 × V_ELF, scale the response spectrum results up by the ratio

3. The base shear is the total seismic force at the base of the structure.

### Story Drift

1. **Results** → **Displacements** → **Story Drift**.
2. Check drift ratios:
   - **ASCE 7 limits**:
     - Δ/a ≤ 0.020h for Risk Category I-II (2% of story height)
     - Δ/a ≤ 0.015h for Risk Category III (1.5%)
     - Δ/a ≤ 0.010h for Risk Category IV (1%)
     - Where a = deflection amplification factor (Cd)

   - **Eurocode 8 limits**:
     - dr × ν ≤ 0.005h for brittle non-structural elements
     - dr × ν ≤ 0.0075h for ductile non-structural elements
     - dr × ν ≤ 0.010h for no non-structural elements

3. If drift exceeds limits:
   - Add bracing or shear walls to increase stiffness
   - Reduce the response modification factor (more conservative design)
   - Increase member sizes

### Modal Participation

1. **Results** → **Modal Participation Factors**.
2. Verify:
   - First mode X-direction: ≥ 70% mass participation (for regular buildings)
   - First mode Y-direction: ≥ 70% mass participation
   - Torsional modes: Should not dominate (if first mode is torsional, the structure has poor torsional resistance)

### Member Forces

1. **Results** → **Bar Forces** → select seismic load case.
2. Review axial forces, shears, and moments from seismic loading.
3. These forces are used in load combinations:
   - **1.2D + 1.0E + 0.5L** (strength, ASCE 7)
   - **0.9D + 1.0E** (strength, uplift check)
   - **1.0D + 1.0E** (serviceability, drift check)

## Common Seismic Analysis Issues

**Mass participation < 90%**: Increase the number of modes. For buildings with flexible diaphragms or many stories, 50+ modes may be needed.

**Base shear from response spectrum < ELF**: Scale up the response spectrum results per ASCE 7 Section 12.9.4.1.

**Torsional irregularity**: If the maximum story drift at any corner exceeds 1.2× the average drift, the building has a torsional irregularity. Accidental torsion must be amplified by Ax (ASCE 7 Section 12.8.4.3).

**P-Delta effects**: If the stability coefficient θ > 0.1 (ASCE 7 Section 12.8.7), P-Delta effects must be included. Robot can account for P-Delta automatically — enable it in the analysis parameters.
