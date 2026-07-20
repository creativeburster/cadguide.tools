---
title: "MIDAS Civil Construction Stage Analysis: Sequential Casting, Creep, and Camber Control"
excerpt: "A guide to construction stage analysis in MIDAS Civil for bridges covering segmental construction, time-dependent creep and shrinkage, age-adjusted modulus, camber calculation, and force redistribution in staged bridge construction."
category: "workflow"
softwareSlug: "midas-civil"
keyword: "midas civil construction stage analysis bridge"
slug: "midas-civil-construction-stage-analysis-sequential-casting-creep-camber"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Civil Construction Stage Analysis: Sequential Casting, Creep, and Camber Control

Construction stage analysis in MIDAS Civil is essential for any segmental or cast-in-place bridge. On a precast segmental bridge, camber calculations from a single-stage analysis often don't match what's observed in the field; a proper construction stage analysis with creep and shrinkage brings the predictions in line. Let us walk you through the workflow.

## Why Construction Stage Analysis for Bridges

### Sequential Construction Methods

- **Cast-in-place segmental**: Segments cast sequentially on falsework
- **Precast segmental**: Segments erected sequentially with post-tensioning
- **Balanced cantilever**: Segments cast alternately on each side of pier
- **Incremental launching**: Bridge pushed out from one abutment
- **Span-by-span**: Temporary supports used for each span

### Effects of Sequential Construction

- **Force redistribution**: As new segments are added, forces in existing segments change
- **Creep deformation**: Sustained loads cause continued deformation over time
- **Shrinkage**: Concrete volume reduction causes shortening and cracking
- **Prestress redistribution**: Tendon forces redistribute as structure changes
- **Camber requirements**: Each segment must be cast with camber to compensate for future deformation

## Defining Construction Stages

### Stage Definition

1. Load > Construction Stage > Define Stage
2. Create stages per the construction schedule:

| Stage | Duration | Activity |
|-------|----------|----------|
| 1 | 7 days | Cast Pier 1 |
| 2 | 28 days | Cast Pier 2 |
| 3 | 7 days | Cast Segment 1L (left of Pier 1) |
| 4 | 7 days | Cast Segment 1R (right of Pier 1) |
| 5 | 1 day | Stress Tendon Group 1 |
| 6 | 7 days | Cast Segment 2L |
| 7 | 7 days | Cast Segment 2R |
| 8 | 1 day | Stress Tendon Group 2 |
| ... | ... | ... |
| N | 365 days | Service (long-term) |

### Element Activation

1. For each stage, select elements to activate:
   - **New segments**: Activate with concrete age = 1 day
   - **New tendons**: Activate with jacking stress
2. Set activation properties:
   - **Initial age**: 1 day (fresh concrete)
   - **Support condition**: Fixed to existing structure
3. MIDAS Civil adds elements to the active model

### Element Deactivation

1. For temporary supports and formwork:
   - Activate at the construction stage
   - Deactivate at a specified stage (when no longer needed)
2. MIDAS Civil removes the element and redistributes forces

### Load Activation

1. For each stage, specify loads:
   - **Self-weight**: Automatic for activated elements
   - **Construction loads**: Equipment, formwork, workers
   - **Prestress**: Tendon jacking force at stressing stage
   - **Superimposed dead**: Applied after all segments are erected
2. Loads accumulate across stages

## Time-Dependent Material Properties

### Creep Model

1. Model > Property > Time-Dependent Material (Creep)
2. Select model:
   - **CEB-FIP Model Code 1990**: Most common for bridges
   - **ACI 209R**: American standard
   - **JSCE**: Japanese standard
   - **B3**: Bazant model
3. Set parameters (CEB-FIP):
   - **Concrete strength**: fck = 40 MPa
   - **Humidity**: 70% (typical)
   - **Notional size**: h = 2Ac/u (perimeter)
   - **Cement type**: Normal, rapid, or slow
4. MIDAS Civil calculates creep coefficient:
   - φ(t, ta) at any time t for loading age ta

### Shrinkage Model

1. Model > Property > Time-Dependent Material (Shrinkage)
2. Select model (same options as creep)
3. Set parameters (CEB-FIP):
   - **Humidity**: 70%
   - **Notional size**: h = 2Ac/u
   - **Cement type**: Normal
4. MIDAS Civil calculates shrinkage strain:
   - εcs(t) at any time t

### Compressive Strength Development

1. Model > Property > Time-Dependent Material (Strength)
2. Set:
   - **fck**: 40 MPa (28-day strength)
   - **fck(t)**: Strength at age t per CEB-FIP:
     - fck(t) = fck × exp(s × (1 - √(28/t)))
     - s: Coefficient for cement type (0.25 for normal)
3. At each stage, MIDAS Civil uses the appropriate concrete strength for the element's age

## Running Construction Stage Analysis

1. Analysis > Analysis Control > Construction Stage
2. Set:
   - **Number of stages**: As defined
   - **Time steps**: Per stage duration
   - **Save results**: At each stage and at final time
3. Analysis > Run Analysis
4. MIDAS Civil performs:
   - For each stage:
     - Activate/deactivate elements
     - Apply stage loads (including prestress)
     - Update time-dependent properties (strength, creep, shrinkage)
     - Calculate displacements and forces
   - Continue through all stages to service life

## Camber Calculation

### What Is Camber

Camber is the upward deflection built into each segment during construction to compensate for:
- **Dead load deflection**: Self-weight causes downward deflection
- **Prestress camber**: Prestress causes upward deflection
- **Creep deflection**: Long-term creep causes additional deflection
- **Shrinkage deflection**: Shrinkage causes shortening

### Camber Output

1. Results > Construction Stage > Camber
2. MIDAS Civil calculates camber per segment:
   - **Elastic camber**: Immediate (at construction)
   - **Creep camber**: Long-term (over 10-30 years)
   - **Total camber**: Elastic + Creep + Shrinkage
3. For each segment:
   - **Camber value**: e.g., +15mm (upward) at midspan
   - **Setting elevation**: Design elevation + camber
4. Contractor casts each segment at the setting elevation

### Camber Diagram

1. Results > Construction Stage > Camber Diagram
2. View camber along the bridge:
   - **At each segment joint**: Camber value
   - **At midspan**: Maximum camber
   - **At supports**: Zero camber (fixed points)
3. Export camber table for construction

## Force Redistribution

### Prestress Force Redistribution

1. Results > Construction Stage > Prestress Force
2. View tendon force over time:
   - **At stressing**: fpj (jacking stress)
   - **After immediate losses**: fpj - ES - friction - anchorage
   - **After long-term losses**: fpe (effective prestress)
   - **Due to sequential construction**: Force redistributes as new segments are added
3. Check that all tendons maintain required effective prestress

### Moment Redistribution

1. Results > Construction Stage > Moment
2. View moments at each stage:
   - **Stage 1**: Moments due to first segment only
   - **Stage N**: Cumulative moments from all segments
   - **Service**: Final moments including all loads
3. Observe redistribution:
   - As new segments are added, existing moments change
   - Creep causes additional redistribution over time
   - Final moments may differ significantly from single-step analysis

### Shear Redistribution

1. Results > Construction Stage > Shear
2. View shear at each stage:
   - Shear forces redistribute as structure becomes continuous
   - Temporary supports carry shear until removed
   - Final shear may differ from single-step analysis

## Balanced Cantilever Construction

### Stage Sequence for Balanced Cantilever

1. **Pier construction**: Cast pier and pier table segment
2. **Segment 1L and 1R**: Cast simultaneously on both sides (balanced)
3. **Stress tendons**: Post-tension tendons for segments 1L and 1R
4. **Segment 2L and 2R**: Cast next pair
5. **Stress tendons**: Post-tension for segments 2L and 2R
6. Continue until cantilevers meet at midspan
7. **Closure pour**: Cast closure segment at midspan
8. **Continuity tendons**: Stress continuity tendons across closure
9. Remove temporary supports

### Key Checks During Cantilever Construction

1. **Stability during construction**:
   - Each cantilever must be stable against overturning
   - Check wind load during construction
   - Check unbalanced construction load
2. **Stresses at each stage**:
   - Concrete stresses within limits at every stage
   - Tendon stresses within limits
3. **Camber accuracy**:
   - Each segment cast at correct elevation
   - Closure segment fits between cantilevers
   - Maximum mismatch: ±10mm (typical)

## Long-Term Effects

### Creep-Induced Redistribution

1. Over 10-30 years, creep causes:
   - **Moment redistribution**: From negative (support) to positive (midspan)
   - **Up to 15% redistribution** possible
   - **Camber change**: Initial upward camber may reduce over time
2. Design must account for final (long-term) forces, not just construction forces

### Shrinkage Effects

1. Shrinkage causes:
   - **Shortening**: Bridge deck shortens by 10-30mm over 100m length
   - **Bearing movement**: Bearings must accommodate shrinkage
   - **Crack risk**: If restrained, shrinkage can cause cracking
2. Provide expansion joints and flexible bearings to accommodate

## Common Issues

### Excessive Camber

**Cause**: Overestimated prestress or underestimated creep.
**Fix**: Adjust prestress force, use higher creep coefficient, or add counter-weight.

### Insufficient Camber

**Cause**: Underestimated prestress or overestimated creep.
**Fix**: Increase prestress force, use lower creep coefficient, or adjust camber calculation.

### Closure Mismatch

**Cause**: Inaccurate camber calculation or construction tolerance.
**Fix**: Adjust closure segment dimensions. Use jacking force to align cantilevers before closure pour.

### Excessive Long-Term Deflection

**Cause**: High creep, high sustained load, or insufficient prestress.
**Fix**: Increase prestress, use higher strength concrete (lower creep), add reinforcement, or use thicker sections.

## Wrapping Up

If you're doing segmental bridge construction, don't skip the construction stage analysis. Camber predictions from a single-stage analysis can be off by enough that the contractor struggles to match segments; a proper staged analysis with creep and shrinkage brings the camber values in line with field behavior. The camber output is what the contractor needs most, so get it right.
