---
title: "MIDAS Civil Bridge Analysis: Modeling, Moving Loads, and Bridge Design per AASHTO and Eurocode"
excerpt: "A comprehensive guide to MIDAS Civil for bridge structural analysis covering bridge modeler, section and material setup, lane and vehicle definitions, moving load analysis, and design per AASHTO LRFD and Eurocode."
category: "workflow"
softwareSlug: "midas-civil"
keyword: "midas civil bridge analysis"
slug: "midas-civil-bridge-analysis-modeling-moving-loads-aashto-eurocode"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://www.midasstructure.com/en/product/overview/702"
---

# MIDAS Civil Bridge Analysis: Modeling, Moving Loads, and Bridge Design per AASHTO and Eurocode

MIDAS Civil is our go-to tool for bridge analysis. We've used it on highway bridges, railway bridges, and pedestrian structures, and the moving load analysis and code-based design features are excellent. Whether you're working with AASHTO LRFD or Eurocode, the workflow is well-structured. Let us walk you through the complete bridge analysis process.

## Bridge Modeling

### Project Setup

1. File > New Project
2. Set units: Metric (kN, m, mm) or Imperial (kip, ft, in)
3. Set design code: AASHTO LRFD, Eurocode, IS, KS, GB
4. Set bridge type: Girder, arch, cable-stayed, suspension, or custom

### Bridge Modeler (Wizard)

1. Model > Bridge Modeler > Bridge Wizard
2. Step through the wizard:
   - **Bridge type**: We-girder, box girder, PSC, steel composite
   - **Spans**: Number and lengths (e.g., 3 spans: 30m, 40m, 30m)
   - **Width**: Bridge deck width (e.g., 12m)
   - **Girders**: Number and spacing (e.g., 5 girders at 2.5m)
   - **Deck**: Thickness and material
   - **Supports**: Abutments and piers
3. MIDAS Civil generates the complete model:
   - Nodes, elements, sections, materials
   - Supports, bearings
   - Grid and geometry

### Manual Modeling

For non-standard bridges:
1. Model > Node: Create nodes at key points
2. Model > Element: Create beam, truss, or plate elements
3. Model > Section: Define cross-sections
4. Model > Material: Define materials
5. Model > Boundary: Define supports and bearings

### Section Properties

1. Model > Section
2. Add sections:
   - **Steel we-girder**: Top flange, web, bottom flange dimensions
   - **PSC Box girder**: Multi-cell box with top and bottom slabs
   - **Composite**: Steel girder + concrete deck (effective width)
   - **AASHTO we-beam**: Standard Type we-IV
   - **Predefined**: Select from international section databases
3. Calculate section properties:
   - Area (A), Moment of inertia (Iy, Iz), Torsion constant (J)
   - Section modulus (Zy, Zz), Shear area (Ay, Az)

### Materials

1. Model > Material
2. Add:
   - **Concrete C40**: f'c = 40 MPa, Ec = 32,500 MPa, density = 25 kN/m³
   - **Steel A709**: fy = 345 MPa, Es = 200,000 MPa, density = 78.5 kN/m³
   - **Prestressing Steel**: fpu = 1860 MPa, Eps = 195,000 MPa
   - **Rebar Grade 420**: fy = 420 MPa

## Supports and Bearings

### Abutments

1. Model > Boundary > Support
2. At abutment nodes:
   - **Fixed abutment**: All DOF restrained (rare)
   - **Expansion abutment**: Translation restrained, rotation free
   - **Elastomeric bearing**: Spring with specified stiffness
     - Vertical: k = 500,000 kN/m
     - Horizontal: k = 50,000 kN/m

### Piers

1. At pier nodes:
   - **Fixed pier**: All DOF restrained
   - **Expansion pier**: Translation restrained, rotation free
   - **Elastomeric bearing**: Spring support

### Bearing Modeling

1. Model > Boundary > Elastic Link
2. Create bearing link:
   - **Type**: Rigid or elastic
   - **Stiffness**: 
     - Vertical: 500,000 kN/m (stiff)
     - Horizontal: 50,000 kN/m (flexible)
     - Rotational: As specified by manufacturer

## Loading

### Dead Load

1. Load > Self-Weight: Automatic from section and material
2. Load > Beam Load: Additional dead load (wearing surface, barriers, utilities)
   - Uniform: e.g., 8 kN/m (asphalt + barriers distributed to girders)

### Live Load (Moving Load)

#### Lane Definition

1. Load > Moving Load > Lane
2. Create lanes:
   - **Lane 1**: Centerline at X = 2.0m, width = 3.6m
   - **Lane 2**: Centerline at X = 8.0m, width = 3.6m
3. Set lane type:
   - **Lane width**: 3.6m (AASHTO standard)
   - **Lane offset**: From bridge centerline
4. Lanes define the vehicle path

#### Vehicle Definition

1. Load > Moving Load > Vehicle
2. Select standard vehicles:
   - **AASHTO HL-93**: Design truck (72 kip) + design tandem (50 kip) + lane load (9.3 kN/m)
   - **AASHTO Permit**: Overweight permit vehicles
   - **Eurocode LM1**: Tandem system (TS) + uniform load (UDL)
   - **Eurocode LM2**: Single axle for short spans
   - **Custom**: User-defined axle loads and spacings

#### Moving Load Case

1. Load > Moving Load > Moving Load Case
2. Set:
   - **Lanes**: Select active lanes
   - **Vehicles**: Select vehicles to analyze
   - **Direction**: Forward and/or backward
   - **Number of positions**: How many stops along the lane
3. MIDAS Civil moves the vehicle along each lane at incremental positions
4. At each position: calculates all response quantities

### Wind Load

1. Load > Wind Load
2. Set per AASHTO 3.8:
   - **Base wind speed**: 100 km/h (typical)
   - **Exposure category**: Per site conditions
   - **Drag coefficient**: Per girder type
3. Apply to exposed surfaces

### Temperature Load

1. Load > Temperature Load
2. Set:
   - **Uniform temperature**: 
     - Rise: +30°C (per AASHTO 3.12.2)
     - Fall: -20°C
   - **Temperature gradient**:
     - Top hotter than bottom (per AASHTO 3.12.3)
     - Type: Positive (top hot) or negative (bottom hot)

### Braking Force

1. Load > Braking Force
2. Per AASHTO 3.6.4:
   - **BR**: 25% of axle weights of design truck in one lane
   - **Multiple lanes**: 25% × (number of loaded lanes)
3. Apply in longitudinal direction

## Analysis

### Running Analysis

1. Analysis > Run Analysis
2. MIDAS Civil performs:
   - Static analysis for each load case
   - Moving load analysis (thousands of positions)
   - Influence line calculation
3. Check analysis log for warnings

### Influence Lines

1. Results > Moving Load > Influence Line
2. Select a response quantity:
   - **Reaction**: At any support
   - **Moment**: At any section
   - **Shear**: At any section
   - **Deflection**: At any point
3. View influence line:
   - **X-axis**: Position of unit load along the lane
   - **Y-axis**: Value of response
4. Identify critical positions for vehicle placement

### Moving Load Envelope

1. Results > Moving Load > Envelope
2. Create envelopes:
   - **Maximum**: Maximum value over all positions
   - **Minimum**: Minimum value over all positions
   - **Absolute max**: Maximum absolute value
3. Use envelopes for design:
   - Maximum positive moment
   - Maximum negative moment
   - Maximum shear
   - Maximum reaction

## AASHTO LRFD Load Combinations

### Strength we

```
1.25 × DC + 1.50 × DW + 1.75 × (LL + IM + BR + PL) + 1.00 × WA
```

### Strength II (Permit)

```
1.25 × DC + 1.50 × DW + 1.35 × (LL + IM) + 1.00 × WA
```

### Service we

```
1.00 × DC + 1.00 × DW + 1.00 × (LL + IM) + 1.00 × WA
```

### Fatigue

```
0.75 × (LL + IM)  [single HL-93 truck]
```

## Bridge Design

### Steel Girder Design

1. Design > Steel Girder Design > AASHTO LRFD
2. Set parameters:
   - **Fy**: 345 MPa (girder)
   - **Fc'**: 30 MPa (deck)
   - **Composite action**: Yes
   - **Effective flange width**: Per AASHTO 4.6.2.6
3. Design checks:
   - **Flexural strength**: Positive and negative moment capacity
   - **Shear strength**: Web shear capacity
   - **Fatigue**: Stress range under fatigue truck
   - **Serviceability**: Deflection limit (L/800)
   - **Constructability**: Check during construction stages

### PSC Girder Design

1. Design > PSC Girder Design > AASHTO LRFD
2. Set parameters:
   - **Concrete**: f'c = 40 MPa (girder), f'ci = 35 MPa (at transfer)
   - **Prestressing**: 7-wire strand, fpu = 1860 MPa
   - **Loss method**: AASHTO refined or lump sum
3. Design checks:
   - **Stresses at transfer**: Compression and tension limits
   - **Stresses at service**: Compression, tension, and crack control
   - **Flexural strength**: Nominal moment capacity
   - **Shear strength**: Concrete + transverse reinforcement
   - **Prestress loss**: Elastic shortening, creep, shrinkage, relaxation

### Deck Design

1. Design > Concrete Deck Design
2. Set:
   - **Deck thickness**: 225mm
   - **Reinforcement**: #16 @ 150mm (main), #13 @ 200mm (distribution)
3. Design checks:
   - **Flexural capacity**: Per AASHTO 5.7.3
   - **Shear capacity**: Per AASHTO 5.8.3
   - **Crack control**: Per AASHTO 5.7.3.4
   - **Empirical design**: Per AASHTO 9.7.2 (if applicable)

## Post-Processing

### Girder Forces

1. Results > Beam Forces
2. View:
   - **Moment envelope**: Maximum and minimum moment per girder
   - **Shear envelope**: Maximum and minimum shear per girder
   - **Axial force**: For arch and cable-stayed bridges
3. Export to Excel for report preparation

### Reactions

1. Results > Reactions
2. View:
   - **Dead load reactions**: For bearing and abutment design
   - **Live load reactions**: Maximum and minimum
   - **Wind reactions**: For lateral design
3. Export for foundation design

### Deflections

1. Results > Displacements
2. Check:
   - **Dead load deflection**: For camber calculation
   - **Live load deflection**: L/800 (vehicular), L/1000 (pedestrian)
   - **Long-term deflection**: Including creep and shrinkage

## Wrapping Up

MIDAS Civil is our preferred tool for bridge analysis, and the moving load workflow is a big reason why. The influence line approach is efficient, the AASHTO and Eurocode design checks are comprehensive, and the envelope generation captures the worst-case effects automatically. Our tip: always check your deflection limits against the code — We've seen engineers get so focused on strength that they forget serviceability. A bridge that's strong enough but bounces too much under traffic isn't a good bridge.
