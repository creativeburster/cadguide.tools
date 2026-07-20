---
title: "SAP2000 Bridge Analysis: Moving Loads, Influence Lines, and Bridge Design per AASHTO"
excerpt: "A guide to bridge analysis in SAP2000 covering bridge modeler, lane and vehicle definitions, moving load analysis, influence surface generation, and AASHTO LRFD bridge design checks for girder and slab bridges."
category: "workflow"
softwareSlug: "sap2000"
keyword: "sap2000 bridge analysis moving loads"
slug: "sap2000-bridge-analysis-moving-loads-influence-lines-aashto"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.csiamerica.com/products/sap2000"
  - "https://wiki.csiamerica.com/pages/viewpage.action?pageId=1741982"

---

# SAP2000 Bridge Analysis: Moving Loads, Influence Lines, and AASHTO Design

I've used SAP2000 for bridge analysis on everything from simple slab bridges to cable-stayed structures. The bridge modeler is one of those features that seems complicated at first but saves you enormous time once you get comfortable with it. Let me walk you through how I set up moving loads, generate influence lines, and run AASHTO LRFD design checks.

## Bridge Modeler

### Creating a Bridge Model

1. File > New Model > Bridge Modeler
2. Set bridge parameters:
   - **Bridge type**: Girder (I-beam, box girder), slab, arch, cable-stayed
   - **Number of spans**: e.g., 3 spans
   - **Span lengths**: e.g., 30m, 40m, 30m
   - **Bridge width**: e.g., 12m (two lanes + shoulders)
   - **Number of girders**: e.g., 5 girders at 2.5m spacing
3. Set deck properties:
   - **Deck type**: Cast-in-place slab, precast deck panels, composite
   - **Deck thickness**: e.g., 225mm
   - **Wearing surface**: e.g., 75mm asphalt
4. Set girder properties:
   - **Girder type**: AASHTO I-beam (Type I-IV), steel plate girder, box girder
   - **Girder section**: Select from library or custom
5. Set supports:
   - **Abutments**: At bridge ends (expansion or fixed)
   - **Piers**: Intermediate supports (column + cap beam)
6. SAP2000 generates the complete bridge model automatically

### Bridge Object Model

SAP2000 uses a "Bridge Object" concept:
1. The bridge is defined parametrically (spans, girders, deck)
2. SAP2000 converts the bridge object into a finite element model:
   - **Deck**: Shell elements
   - **Girders**: Frame elements
   - **Diaphragms**: Frame elements between girders
   - **Bearings**: Spring elements
   - **Piers**: Frame elements
3. Changes to bridge parameters automatically update the FEM

## Lane Definition

### Creating Lanes

1. Define > Bridge Lanes
2. Add lanes:
   - **Lane 1**: Left traffic lane (centerline at X = 2.0m)
   - **Lane 2**: Right traffic lane (centerline at X = 8.0m)
   - **Lane 3**: Shoulder (centerline at X = 1.0m)
3. Set lane width: 3.6m (standard lane width per AASHTO)
4. Set lane eccentricity: Offset from bridge centerline
5. Lanes define the path that vehicles follow across the bridge

### Lane Load Application

1. Each lane is associated with the deck elements it crosses
2. Vehicle loads are applied to the deck through the lane
3. SAP2000 automatically determines which deck elements receive load
4. For multi-girder bridges, load distribution is calculated automatically

## Vehicle Definition

### AASHTO Vehicles

1. Define > Vehicles
2. Select from AASHTO standard vehicles:
   - **HL-93 Truck**: Standard AASHTO design truck (3 axles, 72 kip total)
   - **HL-93 Tandem**: Two 25-kip axles at 1.2m spacing
   - **HL-93 Lane Load**: 9.3 kN/m uniform lane load
   - **Permit Vehicle**: Overweight permit vehicles
3. Set vehicle properties:
   - **Axle loads**: Per AASHTO or custom
   - **Axle spacing**: Per AASHTO or custom
   - **Dynamic load allowance (IM)**: 33% for deck, 15% for other components

### Eurocode Vehicles

1. Define > Vehicles > Eurocode
2. Select:
   - **LM1**: TS (tandem system) + UDL (uniform distributed load)
   - **LM2**: Single axle for short spans
   - **LM3**: Special vehicles for abnormally heavy loads
3. Set:
   - **TS loads**: αQ1 × Q1k (300 kN), αQ2 × Q2k (200 kN)
   - **UDL**: αq1 × q1k (9 kN/m²), αq2 × q2k (2.5 kN/m²)

### Custom Vehicles

1. Define > Vehicles > Add Custom Vehicle
2. Define axle by axle:
   - **Axle 1**: Load = 80 kN, Spacing to next = 4.3m
   - **Axle 2**: Load = 120 kN, Spacing to next = 1.2m
   - **Axle 3**: Load = 120 kN, Spacing to next = 5.0m
   - **Axle 4**: Load = 120 kN, Spacing to next = 1.2m
   - **Axle 5**: Load = 120 kN
3. Set wheel spacing: 1.8m (standard)

## Moving Load Analysis

### Creating Moving Load Case

1. Define > Load Cases > Add New Case
2. Set case type: Moving Load
3. Set:
   - **Lanes**: Select which lanes are active
   - **Vehicles**: Select which vehicles to analyze
   - **Direction**: Forward and/or backward
   - **Number of positions**: How many positions the vehicle stops at along the lane
4. SAP2000 moves the vehicle along each lane at incremental positions
5. At each position, calculates:
   - Reactions
   - Displacements
   - Member forces
   - Stresses

### Running Moving Load Analysis

1. Analyze > Run Analysis
2. SAP2000 performs:
   - For each lane
   - For each vehicle
   - For each direction (forward/backward)
   - For each position along the lane
   - Calculate all response quantities
3. This can be thousands of analysis cases
4. Analysis time: minutes to hours depending on complexity

### Influence Lines

1. Display > Show Influence Lines
2. Select a response quantity:
   - **Reaction**: At any support
   - **Moment**: At any section
   - **Shear**: At any section
   - **Deflection**: At any point
3. SAP2000 displays the influence line:
   - **X-axis**: Position of unit load along the lane
   - **Y-axis**: Value of the response quantity
4. Use influence lines to:
   - Identify critical vehicle positions
   - Determine maximum and minimum effects
   - Understand load distribution

### Envelope Results

1. Define > Load Combinations > Moving Load Envelope
2. Create envelopes:
   - **Maximum**: Maximum value of each response over all positions
   - **Minimum**: Minimum value of each response over all positions
3. Use envelopes for design:
   - Design for maximum positive moment
   - Design for maximum negative moment
   - Design for maximum shear
   - Design for maximum reaction

## AASHTO LRFD Load Combinations

### Strength I (Basic Vehicle + Lane)

```
Combo: Strength I
1.25 × DC + 1.50 × DW + 1.75 × (LL + IM + BR + PL)
```
Where:
- DC = Dead load (structural components)
- DW = Wearing surface and utilities
- LL = Live load (HL-93 truck or tandem)
- IM = Dynamic load allowance (33% deck, 15% other)
- BR = Braking force
- PL = Pedestrian load

### Strength II (Permit Vehicle)

```
Combo: Strength II
1.25 × DC + 1.50 × DW + 1.35 × (LL + IM) + 1.00 × WA
```

### Service I (Normal Service)

```
Combo: Service I
1.00 × DC + 1.00 × DW + 1.00 × (LL + IM)
```

### Fatigue (Single Truck)

```
Combo: Fatigue
0.75 × (LL + IM)  [single HL-93 truck]
```

## Bridge Design Checks

### Girder Design

1. Design > Steel Bridge Design (or Concrete Bridge Design)
2. Select design code: AASHTO LRFD
3. Set parameters:
   - **Fy**: Girder yield strength
   - **Fc'**: Deck concrete strength
   - **Composite action**: Yes (for steel girders with concrete deck)
4. SAP2000 checks:
   - **Flexural strength**: Moment capacity vs. demand
   - **Shear strength**: Shear capacity vs. demand
   - **Fatigue**: Stress range under fatigue load
   - **Deflection**: L/800 (vehicular), L/1000 (pedestrian)
   - **Serviceability**: Crack control (concrete), vibration

### Deck Design

1. Design > Concrete Deck Design
2. SAP2000 designs:
   - **Reinforcement**: Top and bottom mats, main and distribution bars
   - **One-way or two-way**: Based on girder spacing
   - **Overhang**: Cantilever portion design
3. Check:
   - **Flexural capacity**: Per AASHTO 5.7.3
   - **Shear capacity**: Per AASHTO 5.8.3
   - **Crack control**: Per AASHTO 5.7.3.4
   - **Minimum reinforcement**: Per AASHTO 5.7.3.3.2

### Bearing Design

1. Design > Bearing Design
2. Select bearing type:
   - **Elastomeric**: Rubber pad bearings
   - **PTFE sliding**: For expansion bearings
   - **Rocker**: For steel bridges
3. Set:
   - **Reaction**: From analysis results
   - **Movement**: Thermal expansion + shrinkage
   - **Rotation**: Girder end rotation under load
4. SAP2000 checks:
   - **Compressive stress**: Within bearing capacity
   - **Shear deformation**: Within allowable
   - **Rotation capacity**: Within bearing limit
   - **Stability**: No overturning

## Thermal Analysis

### Temperature Loads

1. Define > Load Patterns > Temperature
2. Set:
   - **Uniform temperature**: ΔT = +30°C (rise), -20°C (fall)
   - **Temperature gradient**: Top hotter than bottom (per AASHTO 3.12.3)
3. Apply to bridge elements
4. SAP2000 calculates:
   - Thermal expansion/contraction
   - Thermal stresses (if restrained)
   - Bearing movements

## Wrapping Up

The bridge modeler in SAP2000 is one of those features that takes some upfront learning but pays off enormously once you're comfortable with it. The influence line approach is elegant — it efficiently finds the worst-case vehicle positions without you having to guess. If you're doing bridge work, invest the time to learn the lane definitions and vehicle load setup. It'll save you hours on every project.
