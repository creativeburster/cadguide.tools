---
title: "CYPECAD Seismic Design: Eurocode 8 Analysis, Ductility, and Capacity Design"
excerpt: "A guide to seismic design in CYPECAD per Eurocode 8 covering seismic action definition, behavior factor selection, ductility class detailing (DCL/DCM/DCH), capacity design for columns and beams, and seismic joint verification."
category: "workflow"
softwareSlug: "cypecad"
keyword: "cypecad seismic design eurocode 8"
slug: "cypecad-seismic-design-eurocode-8-ductility-capacity-design"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://info.cype.com/en/software/cypecad/"
  - "https://www.youtube.com/@CYPEIngenieros"
---

# CYPECAD Seismic Design: Eurocode 8 Analysis, Ductility, and Capacity Design

Seismic design per Eurocode 8 in CYPECAD is well-implemented once you understand the workflow. I've used it on projects in southern Spain and Italy where seismic requirements are significant but not extreme. The software handles seismic action definition, ductility-based design, capacity design, and detailing requirements for concrete and steel. Let me walk you through how I set it up.

## Seismic Action Definition

### Reference Ground Acceleration

1. Loads > Seismic > General Data
2. Set per Eurocode 8:
   - **Reference PGA (agR)**: From national seismic hazard map
     - Low: 0.05g (e.g., UK, northern Germany)
     - Moderate: 0.15g (e.g., southern Spain, Italy)
     - High: 0.25g-0.36g (e.g., Greece, Turkey)
   - **Importance factor (γI)**:
     - II (ordinary): 1.0
     - III (important): 1.2
     - IV (essential): 1.4
   - **Design ground acceleration**: ag = γI × agR

### Soil Type

1. Select soil type per EN 1998-1 Table 3.1:
   - **Type A**: Rock (vs,30 > 800 m/s)
   - **Type B**: Dense soil (360 < vs,30 ≤ 800)
   - **Type C**: Stiff soil (180 < vs,30 ≤ 360)
   - **Type D**: Soft soil (vs,30 < 180)
   - **Type E**: Soft soil over rock

### Response Spectrum

1. CYPECAD generates the design response spectrum per EN 1998-1:
   - **S**: Soil factor (1.0 for A, 1.2 for B, 1.15 for C, 1.35 for D)
   - **Tb, Tc, Td**: Period limits per soil type
   - **Sd(T)**: Design spectral acceleration
2. For Type 1 (moderate-to-large earthquakes):
   - Sd(T) = ag × S × (2.5 × T/Tb) for 0 ≤ T ≤ Tb
   - Sd(T) = ag × S × 2.5 for Tb ≤ T ≤ Tc
   - Sd(T) = ag × S × 2.5 × (Tc/T) for Tc ≤ T ≤ Td
   - Sd(T) = ag × S × 2.5 × (Tc × Td/T²) for T ≥ Td

## Behavior Factor (q)

### Selecting the Behavior Factor

1. Set behavior factor per EN 1998-1 Table 5.1:

| Structural Type | DCL (q) | DCM (q) | DCH (q) |
|----------------|---------|---------|---------|
| Concrete moment frame | 1.5 | 3.9 | 5.85 |
| Concrete wall | 1.5 | 3.0 | 4.4 |
| Steel moment frame | 1.5 | 4.0 | 5.5 |
| Steel braced (concentric) | 1.5 | 4.0 | 4.0 |
| Steel braced (eccentric) | 1.5 | 4.0 | 5.0 |

2. Higher q → lower seismic forces but stricter detailing requirements
3. **Recommendation**: Use DCM (medium ductility) for most projects

## Analysis Methods

### Lateral Force Method (Simplified)

1. For regular buildings up to 10 stories:
   - **Base shear**: Fb = Sd(T1) × m × λ
   - T1: Fundamental period (empirical or from modal)
   - m: Total seismic mass
   - λ: Correction factor (0.85 for T1 < 2Tc)
2. **Vertical distribution**: Fi = Fb × zi × mi / Σ(zj × mj)
   - zi: Height from base to mass mi
3. CYPECAD applies lateral forces at each floor level

### Modal Response Spectrum Analysis

1. For irregular buildings or buildings > 10 stories:
   - **Modal analysis**: Calculate natural periods and mode shapes
   - **Response spectrum**: Apply spectrum per EN 1998-1
   - **Modal combination**: CQC or SRSS
   - **Directional combination**: 100% one direction + 30% perpendicular
2. CYPECAD performs:
   - Modal analysis (15-30 modes)
   - Response spectrum in X and Y
   - Base shear scaling (if Vmodal < Vlateral)
   - Accidental eccentricity (5% of building dimension)

## Ductility Class Detailing

### DCL (Low Ductility, q = 1.5)

1. Minimal seismic detailing
2. Design for reduced seismic forces
3. No special reinforcement requirements
4. Suitable for:
   - Low seismicity areas (ag < 0.08g)
   - Simple structures
   - Non-critical buildings

### DCM (Medium Ductility, q = 3.0-4.0)

1. Moderate seismic detailing
2. Concrete structures:
   - **Beams**: 
     - ρmin = 0.5 × fctm/fyk (bottom reinforcement)
     - ρmax = ρ' + 0.0015 × fck (at supports)
     - Compression reinforcement ≥ 50% of tension at supports
     - Stirrups: Ø8 @ 150mm in critical regions
   - **Columns**:
     - ρmin = 0.01, ρmax = 0.04
     - Confinement: stirrups at 100mm in critical regions
     - Critical region height: lc = max(1.5h, 450mm, lcr)
   - **Walls**:
     - Vertical reinforcement: ρv ≥ 0.005
     - Horizontal reinforcement: ρh ≥ 0.005
     - Boundary elements if σc > 0.4fck

### DCH (High Ductility, q = 4.4-5.85)

1. Strict seismic detailing
2. Concrete structures:
   - **Beams**:
     - ρmin = max(0.5 × fctm/fyk, 0.0015)
     - ρmax = ρ' + 0.0015 × fck
     - Compression reinforcement ≥ 50% of tension at supports
     - Stirrups: closed links at 100mm max in critical regions
     - Critical region: lc = 1.5h
   - **Columns**:
     - ρmin = 0.01, ρmax = 0.04
     - Confinement: closed stirrups at 100mm max
     - Cross-ties in both directions
     - Critical region: lc = max(1.5h, 600mm, lcr)
   - **Walls**:
     - Boundary elements mandatory if σc > 0.35fck
     - Confinement in boundary elements: volumetric ratio per EN 1998-1

## Capacity Design

### Strong Column / Weak Beam

1. Per EN 1998-1 4.4.3.3:
   - At beam-column joints:
   - ΣMRc ≥ 1.3 × ΣMRb
   - MRc: Column moment capacity
   - MRb: Beam moment capacity
2. This ensures beams yield before columns (more ductile behavior)
3. CYPECAD checks this at each joint

### Column Overstrength

1. Design columns for overstrength:
   - NEd: From capacity design (not from analysis)
   - MEd: 1.3 × beam moment capacity
2. This prevents column failure before beam yielding

### Shear Overstrength

1. Design beams for shear based on overstrength:
   - VEd = V0 + 1.3 × (MRd,left + MRd,right) / l
   - V0: Shear from gravity loads
   - MRd: Beam moment capacity at each end
   - l: Beam clear span
2. This prevents shear failure before flexural yielding

## Seismic Joints

### Joint Width Calculation

1. Per EN 1998-1 4.4.2.7:
   - **Joint width**: d ≥ max(50mm, δ × H)
   - δ: Drift ratio (typically 0.005 for DCM, 0.0075 for DCH)
   - H: Height of adjacent building or wing
2. Example:
   - H = 20m, DCM: d ≥ max(50, 0.005 × 20000) = 100mm

### Joint Verification

1. CYPECAD checks:
   - **Minimum joint width**: Per formula above
   - **Collision risk**: Adjacent buildings don't pound under seismic displacement
2. If joint is insufficient:
   - Increase joint width
   - Reduce building height
   - Use seismic isolation

## Story Drift Check

### Drift Limitation

1. Per EN 1998-1 4.4.3.2:
   - **Drift ratio**: dr/h ≤ 0.005 (DCL, DCM with brittle partitions)
   - **Drift ratio**: dr/h ≤ 0.0075 (DCH with flexible partitions)
   - dr: Design story drift = q × de (de: elastic drift)
   - h: Story height
2. CYPECAD checks drift per story:
   - If drift exceeds limit: increase stiffness (larger sections, more walls)

## Foundation Design for Seismic

### Foundation Capacity

1. Per EN 1998-1 5.5:
   - Foundation designed for overstrength forces from superstructure
   - Foundation must not yield before superstructure
2. Design foundation for:
   - **Column overstrength**: 1.3 × column moment capacity
   - **Beam overstrength**: 1.3 × beam moment capacity
3. This ensures foundation remains elastic during earthquake

### Soil Bearing Capacity

1. Per EN 1998-1 5.6:
   - **Static bearing capacity**: qa (from geotechnical report)
   - **Seismic bearing capacity**: qa,seismic = 1.25 × qa (increase for seismic)
   - Check: pmax ≤ qa,seismic
2. If bearing capacity exceeded:
   - Increase footing size
   - Use piles
   - Improve soil

## Output and Reports

### Seismic Report

1. Results > Seismic Report
2. CYPECAD generates:
   - **Seismic input**: agR, soil type, q, importance
   - **Response spectrum**: Plot of Sd(T)
   - **Base shear**: Per direction
   - **Story shear**: Per story
   - **Story drift**: Per story with limit check
   - **Mass participation**: Per mode
   - **Capacity design checks**: Strong column/weak beam verification
   - **Joint width**: Calculated and verified

## Common Seismic Issues

### Excessive Drift

**Cause**: Structure too flexible for seismic forces.
**Fix**: Add shear walls, increase column sizes, use bracing (steel), or reduce q (more conservative).

### Column Fails Capacity Design

**Cause**: Column weaker than 1.3 × beam capacity.
**Fix**: Increase column section, add reinforcement, or reduce beam capacity (smaller beam).

### Insufficient Confinement

**Cause**: Stirrup spacing too large in critical regions.
**Fix**: Reduce stirrup spacing to 100mm in critical regions, add cross-ties, use closed stirrups.

### Boundary Elements Required

**Cause**: Wall compressive stress exceeds 0.35-0.4 × fck.
**Fix**: Add boundary elements with confined reinforcement, increase wall length, or increase wall thickness.

## Wrapping Up

CYPECAD's Eurocode 8 implementation is solid once you understand the ductility class system. My advice: don't default to the highest ductility class (DCH) just to be safe — it actually requires more stringent detailing and can be harder to achieve. Pick the ductility class that matches your building's seismic hazard and structural system. And always verify capacity design — strong column/weak beam is fundamental to earthquake-resistant design.
