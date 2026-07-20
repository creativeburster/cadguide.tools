---
title: "MIDAS Gen Construction Stage Analysis: Creep, Shrinkage, and Sequential Loading"
excerpt: "A guide to construction stage analysis in MIDAS Gen covering sequential construction modeling, time-dependent material properties (creep and shrinkage), age-adjusted effective modulus, and long-term deflection calculation for high-rise buildings."
category: "workflow"
softwareSlug: "midas-gen"
keyword: "midas gen construction stage analysis"
slug: "midas-gen-construction-stage-analysis-creep-shrinkage-sequential-loading"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Gen Construction Stage Analysis: Creep, Shrinkage, and Sequential Loading

Construction stage analysis is one of those things that seems unnecessary until you do it once and realize how much you've been missing. I started using it on a 40-story residential tower where the columns were shortening more than expected, and the floor slabs were developing unexpected deflections. MIDAS Gen's construction stage analysis showed me exactly what was happening with creep and shrinkage over time. Let me walk you through the setup.

## Why Construction Stage Analysis Matters

### The Problem with Single-Step Analysis

Standard structural analysis applies all loads at once to the complete structure. In reality:
1. The building is constructed floor by floor
2. Each floor's self-weight is applied when that floor is built
3. Lower floors are already loaded and deformed before upper floors are added
4. Concrete creeps and shrinks over time, causing additional deformation
5. Forces redistribute as the structure ages

### Effects Ignored by Single-Step Analysis

- **Differential shortening**: Columns and walls shorten at different rates
- **Creep deformation**: Continued deformation under sustained load
- **Shrinkage deformation**: Volume reduction from moisture loss
- **Force redistribution**: Stiffer elements attract more load over time
- **Construction tolerance**: Floors may not be level due to sequential casting

## Setting Up Construction Stages

### Defining Construction Stages

1. Load > Construction Stage > Define Stage
2. Create stages corresponding to the construction schedule:

| Stage | Duration (days) | Activity |
|-------|----------------|----------|
| 1 | 7 | Cast basement columns and slabs |
| 2 | 7 | Cast ground floor |
| 3 | 7 | Cast Level 1 |
| 4 | 7 | Cast Level 2 |
| 5 | 7 | Cast Level 3 |
| ... | ... | ... |
| 20 | 7 | Cast Roof |
| 21 | 365 | Service (long-term) |

3. For each stage, specify:
   - **Activated elements**: New elements added in this stage
   - **Deactivated elements**: Temporary supports removed
   - **Applied loads**: Loads added in this stage
   - **Concrete age**: Age of concrete at activation (typically 1-3 days)

### Element Activation

1. For each stage, select elements to activate:
   - **New columns**: Activate at stage start
   - **New beams**: Activate at stage start
   - **New slabs**: Activate at stage start
2. Set activation properties:
   - **Initial age**: 1 day (fresh concrete)
   - **Support condition**: Fixed to the structure below
3. MIDAS Gen adds the element to the active structure with its self-weight

### Load Activation

1. For each stage, specify loads to apply:
   - **Self-weight**: Automatic for activated elements
   - **Construction load**: e.g., 1 kN/m² for formwork and construction
   - **Permanent load**: e.g., 5 kN/m² for finishes (applied after construction)
   - **Live load**: Applied at service stage
2. Loads accumulate across stages

### Support Deactivation

1. For temporary supports (formwork, shoring):
   - Activate at the construction stage
   - Deactivate at a specified stage (when permanent structure is in place)
2. MIDAS Gen removes the support and redistributes forces

## Time-Dependent Material Properties

### Creep Model

1. Model > Property > Time-Dependent Material (Creep)
2. Select creep model:
   - **ACI 209R**: American Concrete Institute
   - **CEB-FIP Model Code**: European
   - **JSCE**: Japanese
   - **User-defined**: Custom creep coefficients
3. Set parameters (ACI 209R):
   - **Ultimate creep coefficient (Cu)**: 2.35 (typical)
   - **Loading age (ta)**: 7 days (typical for construction)
   - **Humidity**: 70% (typical indoor)
   - **Concrete strength at loading**: f'c(ta)
4. MIDAS Gen calculates creep coefficient at any time:
   - φ(t, ta) = Cu × (t^0.6 / (10 + t^0.6)) × (1.25 × ta^(-0.118))

### Shrinkage Model

1. Model > Property > Time-Dependent Material (Shrinkage)
2. Select shrinkage model:
   - **ACI 209R**: American
   - **CEB-FIP**: European
   - **JSCE**: Japanese
3. Set parameters (ACI 209R):
   - **Ultimate shrinkage strain (εsh,u)**: 780 × 10⁻⁶ (typical)
   - **Humidity**: 70%
   - **Initial drying age**: 7 days
4. MIDAS Gen calculates shrinkage strain at any time:
   - εsh(t) = εsh,u × (t / (35 + t)) × (1 - 0.06 × h) × ...

### Age-Adjusted Effective Modulus

MIDAS Gen uses the age-adjusted effective modulus method:
- **Eeff(t, ta)** = E(ta) / (1 + φ(t, ta) × χ)
  - E(ta): Modulus at loading age
  - φ(t, ta): Creep coefficient
  - χ: Aging coefficient (typically 0.7-0.8)
- This accounts for both creep and the aging of concrete

## Running Construction Stage Analysis

1. Analysis > Analysis Control > Construction Stage
2. Set:
   - **Number of stages**: As defined
   - **Time steps**: Per stage duration
   - **Save results**: At each stage and at final time
3. Analysis > Run Analysis
4. MIDAS Gen performs:
   - For each stage:
     - Activate new elements with time-dependent properties
     - Apply stage loads
     - Calculate displacements and forces
     - Update creep and shrinkage strains
   - Continue to next stage
   - After construction: continue to service life (long-term)

## Post-Construction Long-Term Analysis

### Service Stage

1. After the last construction stage, add a service stage:
   - **Duration**: 10,000 days (≈ 27 years) or 365 days × N
   - **Loads**: Add permanent live load
2. MIDAS Gen continues the analysis:
   - Creep continues under sustained loads
   - Shrinkage continues
   - Additional displacements accumulate
   - Forces redistribute

### Long-Term Displacement

1. Results > Construction Stage > Displacement
2. View displacement at each stage and at final time:
   - **Elastic displacement**: Immediate (at construction)
   - **Creep displacement**: Additional over time
   - **Shrinkage displacement**: Additional over time
   - **Total**: Elastic + Creep + Shrinkage
3. Compare:
   - **Short-term** (end of construction): Mostly elastic
   - **Long-term** (10 years): Elastic + 50-70% creep + 70-80% shrinkage
   - **Ultimate** (30+ years): Elastic + 100% creep + 100% shrinkage

## Column Shortening Analysis

### Differential Shortening

1. Results > Construction Stage > Column Shortening
2. View axial displacement of each column over time:
   - **Column A**: Shortens 15mm at construction, 25mm at 10 years
   - **Column B**: Shortens 18mm at construction, 30mm at 10 years
   - **Column C**: Shortens 12mm at construction, 20mm at 10 years
3. Differential shortening:
   - Between A and B: 5mm at 10 years
   - Between B and C: 10mm at 10 years
4. If differential > 10mm: floor slab may crack or become uneven

### Compensation

1. Calculate required compensation per floor:
   - **Compensation** = predicted shortening at each floor level
   - Cast columns slightly taller to compensate for future shortening
2. MIDAS Gen outputs the compensation value per column per floor
3. Contractor adjusts formwork height accordingly

## Force Redistribution

### Axial Force Redistribution

1. Results > Construction Stage > Axial Force
2. View axial force in columns and walls over time:
   - **Initial**: Based on tributary area
   - **Long-term**: Stiffer elements (walls) attract more load
   - **Redistribution**: 10-20% shift from columns to walls possible
3. Check if any element exceeds capacity due to redistribution

### Moment Redistribution

1. Results > Construction Stage > Moment
2. View beam moments over time:
   - **Initial**: Based on elastic analysis
   - **Long-term**: Creep causes moment redistribution
   - **Reduction in negative moment**: 10-15% possible
   - **Increase in positive moment**: Corresponding increase

## Practical Applications

### High-Rise Building

For a 40-story building:
1. Define 40+ construction stages (one per floor)
2. Set 7-day cycle per floor
3. Include 365-day service stage
4. Results:
   - **Total shortening at roof**: 30-50mm (elastic + creep + shrinkage)
   - **Differential between core and perimeter**: 10-20mm
   - **Compensation**: Cast perimeter columns 5-10mm taller per floor

### Long-Span Bridge

For a segmental bridge:
1. Define stages for each segment cast
2. Set 3-7 day cycle per segment
3. Include 10-year service stage
4. Results:
   - **Camber**: Required upward camber to compensate for long-term deflection
   - **Creep deflection**: 50-100% of elastic deflection over 10 years

## Common Issues

### Excessive Long-Term Deflection

**Cause**: High creep coefficient, high sustained load, or thin slabs.
**Fix**: Increase slab thickness, use lower creep concrete (lower w/c ratio), add compression reinforcement, or use prestressing.

### Excessive Differential Shortening

**Cause**: Different column sizes, different reinforcement ratios, or different loading.
**Fix**: Equalize column sizes, adjust reinforcement, or use compensation (cast taller).

### Non-Convergence

**Cause**: Time step too large or creep model unstable.
**Fix**: Reduce time step. Use a different creep model. Check material parameters.

## Wrapping Up

Construction stage analysis isn't necessary for every building, but for tall buildings it's essential. The column shortening output alone is worth the effort — I've seen projects where differential shortening between perimeter columns and core walls caused floor slabs to crack because nobody ran a construction stage analysis. If you're working on anything over 20 stories, do yourself a favor and run it. The creep and shrinkage predictions will tell you exactly how much to compensate in the construction drawings.
