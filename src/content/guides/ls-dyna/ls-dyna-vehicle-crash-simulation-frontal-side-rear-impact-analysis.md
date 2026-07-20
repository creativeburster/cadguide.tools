---
title: "LS-DYNA Vehicle Crash Simulation: Frontal, Side, and Rear Impact Analysis"
excerpt: "A guide to vehicle crash simulation in LS-DYNA covering full vehicle model setup, barrier definition, dummy and restraint modeling, acceleration pulse evaluation, intrusion measurement, and regulatory compliance checking per FMVSS and EuroNCAP."
category: "workflow"
softwareSlug: "ls-dyna"
keyword: "ls-dyna vehicle crash simulation"
slug: "ls-dyna-vehicle-crash-simulation-frontal-side-rear-impact-analysis"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://lsdyna.ansys.com/manuals/"
  - "https://www.nhtsa.gov/crash-simulation-vehicle-safety"
---

# LS-DYNA Vehicle Crash Simulation: Frontal, Side, and Rear Impact Analysis

I've been involved in vehicle crash simulation for years, and LS-DYNA is the tool everyone in automotive uses — there's really no debate about that. What I want to share here isn't just the setup steps, but the things that actually make your crash results match physical tests. Because honestly, getting a crash simulation to correlate with a sled test is one of the hardest things I've done in my career.

## Full Vehicle Model

### Model Components

1. **Body in white (BIW)**: Spot-welded sheet metal panels
   - Elements: S4R (Belytschko-Tsay shells)
   - Thickness: 0.7-2.5mm
   - Material: *MAT_PIECEWISE_LINEAR_PLASTICITY (MAT_024)
2. **Closures**: Doors, hood, trunk lid
   - Shell elements with hinges
3. **Frame rails**: Front and rear longitudinal rails
   - Thicker shells (1.8-3.0mm) for energy absorption
4. **Suspension**: Springs, dampers, control arms
   - Beam and shell elements
   - Spring elements (*ELEMENT_DISCRETE)
5. **Powertrain**: Engine, transmission (rigid or deformable)
   - Rigid: *MAT_RIGID (fast, for non-crushing components)
   - Deformable: For engine block intrusion analysis
6. **Wheels and tires**: Rigid or deformable
7. **Seats**: Frame + foam + trim
8. **Interior**: Dashboard, door panels, headliner

### Spot Welds

1. *CONSTRAINED_SPOTWELD:
   - Connects two shell panels at a point
   - Parameters:
     - **SN**: Spot weld ID
     - **N1, N2**: Nodes on each panel
     - **SN**: Strength (force-based failure)
2. Or use beam elements:
   - *ELEMENT_BEAM between welded nodes
   - *MAT_SPOTWELD (MAT_100) with failure criterion
3. Spot weld failure:
   - Force-based: F > Ffail → weld breaks
   - Typical: 3000-8000N (steel sheet spot weld)
4. Check: Spot weld failures in post-processing (critical for structural integrity)

### Adhesive Joints

1. *MAT_COHESIVE_MIXED_MODE (MAT_138):
   - For adhesive bonds (hem flanges, structural adhesive)
   - Traction-separation law
   - Mixed-mode failure (Mode I + Mode II)
2. Parameters:
   - **Normal strength**: tN (MPa)
   - **Shear strength**: tS (MPa)
   - **Fracture energy**: GIC, GIIC (mJ/mm²)

## Barrier Models

### Rigid Wall

1. *RIGIDWALL_PLANAR:
   - Define wall plane (point + normal)
   - Infinite rigid wall
2. Parameters:
   - **NS**: Normal direction (e.g., (0,1,0) for wall in XZ plane)
   - **X0, Y0, Z0**: Point on wall
3. Use for: FMVSS 208 frontal barrier (rigid wall)

### Deformable Barrier

1. *MAT_RIGID for barrier frame
2. *MAT_PIECEWISE_LINEAR_PLASTICITY for barrier face (honeycomb)
3. FMVSS 214 side impact barrier (MDB):
   - Moving deformable barrier
   - Mass: 1367 kg
   - Velocity: 50 km/h
   - Honeycomb face with defined stiffness

### Pole Impact

1. *RIGIDWALL_CYLINDRICAL:
   - Rigid cylinder (diameter = 254mm for FMVSS 214 pole)
2. Parameters:
   - **Radius**: 127mm
   - **Axis direction**: Vertical (Y)
3. Use for: Side pole impact (roof crush, side intrusion)

## Crash Scenarios

### Frontal Rigid Barrier (FMVSS 208)

1. **Velocity**: 56 km/h (35 mph) or 64 km/h (40 mph, EuroNCAP)
2. **Barrier**: Rigid wall, 0° or 30° angle
3. **Impact direction**: Frontal (X-direction)
4. **Duration**: 100-150 ms
5. **Measurements**:
   - **Acceleration**: At B-pillar, seat cross-member, engine cradle
   - **Intrusion**: Firewall, toe board, steering column
   - **Dummy response**: Head, chest, pelvis acceleration
6. **Criteria**:
   - **Chest acceleration**: < 60G
   - **Chest deflection**: < 63mm
   - **Femur force**: < 10kN
   - **HIC (Head Injury Criterion)**: < 1000

### Side Impact (FMVSS 214)

1. **MDB velocity**: 50 km/h (31 mph)
2. **MDB mass**: 1367 kg
3. **Impact direction**: Lateral (Y-direction)
4. **Duration**: 80-120 ms
5. **Measurements**:
   - **Door intrusion**: At chest, abdomen, pelvis levels
   - **B-pillar intrusion**: Maximum lateral displacement
   - **Dummy response**: Thorax, abdomen, pelvis
6. **Criteria**:
   - **Thoracic TTI**: < 85G (50th percentile male)
   - **Pelvic acceleration**: < 130G
   - **Door intrusion**: < 381mm (15 inches)

### Side Pole Impact (FMVSS 214)

1. **Velocity**: 32 km/h (20 mph)
2. **Pole**: Rigid, 254mm diameter
3. **Impact angle**: 75° from vehicle centerline
4. **Measurements**:
   - **Door intrusion**: At chest level
   - **Head contact**: With pole (HIC)
5. **Criteria**:
   - **HIC**: < 1000
   - **Thorax deflection**: < 42mm

### Rear Impact (FMVSS 301)

1. **Velocity**: 80 km/h (50 mph) for rear moving barrier
2. **Barrier mass**: 1367 kg (MDB)
3. **Impact direction**: Rear (−X direction)
4. **Duration**: 100-150 ms
5. **Measurements**:
   - **Fuel system integrity**: No leakage
   - **Rear intrusion**: Seat, fuel tank area

## Dummy Models

### ATD (Anthropomorphic Test Device)

1. **Hybrid III 50th percentile male**:
   - Mass: 78.2 kg
   - Height: 175 cm
   - Use for: Frontal crash
2. **Hybrid III 5th percentile female**:
   - Mass: 49.5 kg
   - Height: 152 cm
   - Use for: Frontal crash (small occupant)
3. **SID-IIIs (Side Impact Dummy)**:
   - Use for: Side impact
4. **Q-dummies (EuroNCAP)**:
   - Q3, Q6, Q10 (child dummies)
   - Use for: Child restraint evaluation

### Dummy Positioning

1. Position dummy in seat:
   - H-point: At defined seat reference
   - Head: Upright, facing forward
   - Hands: On steering wheel (driver) or lap (passenger)
   - Feet: On floor or pedals
2. Seatbelt routing:
   - Across shoulder and lap
   - Through dummy pelvis and chest

### Dummy Injury Criteria

1. **HIC (Head Injury Criterion)**:
   - HIC = max[(1/(t2-t1)) ∫a(t)dt]².5 × (t2-t1)
   - a: Head resultant acceleration (G)
   - t2-t1: Time window (36ms for HIC_36, 15ms for HIC_15)
   - Limit: HIC < 1000
2. **Chest acceleration**: < 60G (3ms clip)
3. **Chest deflection**: < 63mm (Hybrid III)
4. **Neck injury (Nij)**:
   - Nij = Fz/Fzc + My/Myc
   - Limit: Nij < 1.0
5. **Femur force**: < 10kN

## Restraint Systems

### Seatbelt

1. *MAT_SEATBELT (MAT_195):
   - 1D elements (seatbelt webbing)
   - Properties:
     - **Stiffness**: Force per unit strain
     - **Pretensioner**: Initial tension force
     - **Load limiter**: Force at which belt yields
2. Routing:
   - Anchor point (floor)
   - D-ring (B-pillar)
   - Shoulder and lap segments
   - Buckle

### Airbag

1. *AIRBAG_PARTICLE:
   - Particle method for gas dynamics
   - Inflator: Mass flow rate and temperature vs. time
2. *AIRBAG_SIMPLE_PRESSURE:
   - Simplified pressure-volume model
   - Faster but less accurate
3. Parameters:
   - **Inflator curve**: Mass flow (kg/s) vs. time
   - **Gas**: Molecular weight, specific heat ratio
   - **Vent holes**: Outflow area
4. Airbag deployment:
   - Crash sensor triggers at t = 10-20ms
   - Inflator fires: t = 15-25ms
   - Bag fully inflated: t = 30-40ms
   - Occupant contact: t = 40-60ms

## Post-Processing

### Acceleration Pulse

1. **B-pillar acceleration**: Primary crash severity metric
   - Plot: Acceleration (G) vs. time (ms)
   - Shape: Should show controlled deceleration
   - Peak: Typically 30-50G (frontal), 40-80G (side)
2. **Filter**: SAE J211 CFC 60 (filter for structural acceleration)

### Intrusion

1. **Firewall intrusion**: Distance firewall moves rearward
   - Measure: Initial to final position at toe board
   - Limit: < 125mm (frontal, at toe board)
2. **Steering column intrusion**: Rearward displacement
   - Limit: < 125mm
3. **Door intrusion**: Inward displacement (side impact)
   - Measure: At chest, abdomen, pelvis levels

### Energy Absorption

1. **By component**: Energy absorbed by each part
   - *DATABASE_MATSUM: Per-part energy
   - Identify: Which components absorb most energy
   - Optimize: Increase energy absorption in crush zones
2. **Total energy**: Initial KE = IE + CE + HG + EW
   - Initial KE = 0.5 × m × v²
   - Example: 1500 kg at 56 km/h (15.56 m/s)
   - KE = 0.5 × 1500 × 15.56² = 181,500 J = 181.5 kJ

### Velocity Profile

1. **Vehicle velocity**: vs. time
   - Starts at impact velocity (e.g., 56 km/h)
   - Decelerates to 0 (or rebounds)
   - Duration: 80-120ms (frontal)
2. **Delta-V**: Change in velocity
   - For rigid barrier: ΔV = Vinitial (full stop)
   - For deformable barrier: ΔV < Vinitial (rebound)

## Verification Checklist

- [ ] Vehicle mass matches test (±2%)
- [ ] Center of gravity matches test
- [ ] Spot welds are correctly placed and fail at correct force
- [ ] Material stress-strain curves include strain rate effects
- [ ] Barrier mass and velocity match regulation
- [ ] Dummy is positioned correctly (H-point, head angle)
- [ ] Seatbelt is routed and pretensioned correctly
- [ ] Airbag deployment timing is correct
- [ ] Acceleration pulse shape matches test (if available)
- [ ] Intrusion values match test (if available)
- [ ] Energy balance is satisfied (KE = IE + CE + HG)
- [ ] Hourglass energy < 5% of internal energy

## Wrapping Up

If you're getting into crash simulation, my biggest advice is to correlate with physical test data early and often. I've seen beautiful-looking simulations that were completely wrong because the spot weld failure force was off or the material strain rate parameters weren't calibrated. Get the vehicle mass right (within 2%), make sure your material cards include strain rate effects, and check your acceleration pulse against a physical test before you trust any injury numbers. Once your baseline correlates, you can confidently evaluate design changes — and that's where crash simulation saves months of development time.
