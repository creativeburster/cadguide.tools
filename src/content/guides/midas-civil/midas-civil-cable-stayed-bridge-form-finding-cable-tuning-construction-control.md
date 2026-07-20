---
title: "MIDAS Civil Cable-Stayed Bridge Analysis: Form Finding, Cable Tuning, and Construction Control"
excerpt: "A guide to cable-stayed bridge analysis in MIDAS Civil covering initial form finding, cable force optimization, stay cable stress checks, construction stage sequencing, and aerodynamic stability for long-span cable bridges."
category: "workflow"
softwareSlug: "midas-civil"
keyword: "midas civil cable stayed bridge"
slug: "midas-civil-cable-stayed-bridge-form-finding-cable-tuning-construction-control"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Civil Cable-Stayed Bridge Analysis: Form Finding, Cable Tuning, and Construction Control

Cable-stayed bridges are the most complex structures I've worked on, and MIDAS Civil is the tool I trust for them. The form-finding process, cable force optimization, and construction stage control are all built into the software. I learned cable-stayed analysis on a 240m main span bridge project, and it was a steep learning curve. Let me share what I picked up.

## Cable-Stayed Bridge Modeling

### Components

A cable-stayed bridge consists of:
- **Deck**: Typically steel box girder or composite deck
- **Pylons**: A-shaped, H-shaped, or inverted Y
- **Stay cables**: Connect deck to pylon (fan or harp arrangement)
- **Piers**: Support the deck at pylons and side spans
- **Foundations**: Pile or spread foundations

### Model Creation

1. Model > Bridge Modeler > Cable-Stayed Bridge
2. Set parameters:
   - **Main span**: e.g., 300m
   - **Side spans**: e.g., 150m each
   - **Pylon height**: e.g., 100m above deck
   - **Pylon type**: A, H, or inverted Y
   - **Cable arrangement**: Fan (all cables from pylon top) or harp (parallel cables)
   - **Number of cables**: e.g., 20 per side (40 total)
3. MIDAS Civil generates:
   - Deck elements (beam or shell)
   - Pylon elements (beam)
   - Cable elements (tension-only)
   - Supports at piers and pylons

### Cable Element Properties

1. Model > Section > Cable Section
2. Define:
   - **Cable type**: Parallel wire strand (PWS) or parallel strand (PS)
   - **Diameter**: e.g., 100mm to 200mm
   - **Number of strands**: 37 to 253
   - **Material**: High-strength steel (fpu = 1770-1860 MPa)
   - **Modulus**: E = 195,000-200,000 MPa
3. Cable elements are tension-only (no compression)

## Form Finding

### What Is Form Finding

Form finding determines the initial cable forces that produce the desired deck profile under dead load. The goal is to achieve a level deck (zero deflection) under self-weight with balanced cable forces.

### Initial Cable Force Estimation

1. Calculate required cable force per stay:
   - **Tributary deck weight**: W = q × spacing (q = deck weight per meter, spacing = cable spacing)
   - **Vertical component**: Tv = W / 2 (each cable carries half the tributary load)
   - **Cable force**: T = Tv / sin(θ) (θ = cable angle from horizontal)
2. For a cable at 45°: T = W / (2 × sin(45°)) = W / 1.414
3. Enter initial cable forces in MIDAS Civil

### Optimization (Cable Tuning)

1. Analysis > Optimization > Cable Force Optimization
2. Set target:
   - **Deck displacement**: Zero (level) at all cable anchor points
   - **Bending moment**: Minimize deck moments (approach pure axial)
   - **Pylon moment**: Minimize pylon moments
3. MIDAS Civil iterates:
   - Adjust cable forces
   - Re-analyze
   - Check deck displacement and moments
   - Continue until target is met
4. Output: Optimized cable force per stay

### Balanced Cable Forces

1. After optimization, verify:
   - **Cable forces are balanced**: No single cable is significantly over/under
   - **Deck is level**: Displacement at all anchor points ≈ 0
   - **Pylon is vertical**: No significant pylon deflection
2. If forces are unbalanced:
   - Adjust target (allow some deck deflection for better force balance)
   - Re-optimize

## Cable Stress Checks

### Under Dead Load

1. Results > Cable Forces
2. Check:
   - **Cable stress**: f = T / Ap ≤ 0.45 × fpu (per AASHTO 5.9.3)
   - For fpu = 1860 MPa: allowable = 837 MPa
3. All cables should be within allowable under dead + live

### Under Live Load

1. Apply AASHTO HL-93 moving load
2. Check maximum and minimum cable forces:
   - **Maximum**: Dead + Live (maximum)
   - **Minimum**: Dead + Live (minimum) — ensure no cable goes slack
   - **Stress range**: For fatigue check
3. Allowable under dead + live: f ≤ 0.50 × fpu = 930 MPa

### Fatigue Check

1. Results > Cable Fatigue
2. Check stress range:
   - **Δf = fmax - fmin** (stress range under fatigue vehicle)
   - **Allowable**: Per AASHTO 5.5.3 (typically 70-100 MPa for stay cables)
3. If stress range exceeds allowable:
   - Increase cable area (more strands)
   - Adjust cable arrangement
   - Add dampers to reduce vibration

## Construction Stage Analysis

### Construction Sequence for Cable-Stayed Bridges

1. **Foundation and piers**: Cast foundations and piers
2. **Pylon construction**: Erect pylon (steel or concrete)
3. **Deck segment at pylon**: Erect first deck segment on temporary support
4. **First pair of cables**: Install and stress cables 1L and 1R
5. **Next deck segments**: Erect segments 2L and 2R
6. **Second pair of cables**: Install and stress cables 2L and 2R
7. Continue until all segments and cables are installed
8. **Closure**: Connect side spans to piers
9. **Final cable tuning**: Adjust cable forces for final profile

### Stage Definition

1. Load > Construction Stage > Define Stage
2. Create stages per construction sequence:
   - Each segment erection: 1-3 days
   - Each cable stressing: 1 day
   - Closure: 7 days
   - Service: 365 days (long-term)
3. For each stage:
   - Activate new deck segments
   - Activate new cables with initial force
   - Apply segment self-weight
   - Update creep and shrinkage

### Cable Force Adjustment During Construction

1. At each stage, check:
   - **Deck profile**: Is the deck at the correct elevation?
   - **Cable forces**: Are cables at the design force?
2. If deck is not at correct elevation:
   - Adjust cable force (re-stress or de-stress)
   - MIDAS Civil calculates the required adjustment
3. Track cable force adjustments:
   - Record actual vs. design force at each stage
   - Adjust subsequent stages to compensate

### Construction Tolerance

1. Maximum deck elevation error: ±20mm per segment
2. Maximum cable force error: ±5% of design
3. If tolerance exceeded:
   - Adjust cable forces before proceeding
   - Recalculate subsequent camber values

## Aerodynamic Stability

### Wind Analysis

1. Load > Wind Load
2. Set:
   - **Basic wind speed**: e.g., 50 m/s (for long-span bridges)
   - **Drag coefficient**: Per deck shape (typically 0.7-1.5)
   - **Lift coefficient**: Per deck shape
   - **Moment coefficient**: Per deck shape
3. Apply to deck and pylon

### Dynamic Wind Analysis

1. Analysis > Dynamic > Wind Response
2. Set:
   - **Natural frequencies**: From modal analysis
   - **Wind spectrum**: Per code or site-specific
   - **Damping**: 0.5-1.0% (steel), 1.0-2.0% (concrete)
3. Check:
   - **Vortex shedding**: Avoid resonance with vortex shedding frequency
   - **Galloping**: Check stability criterion
   - **Flutter**: Check critical wind speed (must exceed design wind speed)

### Flutter Analysis

1. For long-span bridges (main span > 200m):
   - Perform flutter analysis
   - Calculate critical flutter speed: Vcr
   - Vcr must exceed design wind speed with safety factor
2. If Vcr < design wind speed:
   - Improve deck aerodynamics (add fairings, wind shields)
   - Increase structural damping (add dampers)
   - Increase torsional stiffness (wider deck, stiffer pylon)

## Pylon Design

### Pylon Forces

1. Results > Pylon Forces
2. View:
   - **Axial**: Vertical compression from cable forces
   - **Moment**: From unbalanced cable forces and wind
   - **Shear**: From wind and unbalanced loads
3. Check pylon capacity:
   - **Concrete pylon**: Per ACI or AASHTO
   - **Steel pylon**: Per AISC or AASHTO

### Pylon Buckling

1. For tall pylons (100m+):
   - Check global buckling: KL/r within limits
   - Check local buckling: Plate slenderness ratios
2. Use MIDAS Civil buckling analysis:
   - Analysis > Buckling
   - Calculate critical load factor
   - Factor of safety ≥ 5.0 for pylons

## Deck Design

### Deck Forces

1. Results > Deck Forces
2. View:
   - **Axial**: Compression from horizontal cable component
   - **Moment**: From dead and live loads
   - **Shear**: From dead and live loads
3. The deck acts as a beam supported by cables:
   - **Positive moment**: Between cable anchor points
   - **Negative moment**: At cable anchor points
   - **Axial compression**: From cable horizontal component (beneficial)

### Composite Deck Design

1. For steel box girder with concrete deck:
   - **Construction stage**: Steel girder alone (no deck)
   - **Composite stage**: Steel + concrete deck (after deck hardens)
2. Check:
   - **Steel stresses**: Tension and compression
   - **Concrete stresses**: Compression (from cable + deck)
   - **Shear connectors**: Transfer shear between steel and concrete

## Wrapping Up

Cable-stayed bridge analysis is one of the most challenging things I've done in structural engineering, and MIDAS Civil is the right tool for it. The form-finding process is critical — get the cable forces wrong at the start and everything downstream is a mess. Construction stage analysis is non-negotiable for these bridges. Take it step by step, validate against simple hand calculations where you can, and don't be afraid to iterate on the cable tuning until the dead load moments are where you want them.
