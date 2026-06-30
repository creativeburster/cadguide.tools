---
title: "SimScale HVAC and Building Simulation: Airflow, Thermal Comfort, and Smoke Propagation"
excerpt: "A guide to HVAC and building simulation in SimScale covering indoor airflow analysis, thermal comfort evaluation (PMV/PPD), natural ventilation, smoke propagation for fire safety, and outdoor wind comfort for pedestrian-level wind analysis."
category: "workflow"
softwareSlug: "simscale"
keyword: "simscale hvac building simulation"
slug: "simscale-hvac-building-simulation-airflow-thermal-comfort-smoke-propagation"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.simscale.com/projects/thermal-management-and-hvac/"
  - "https://docs.simscale.com/"
---

# SimScale HVAC and Building Simulation: Airflow, Thermal Comfort, and Smoke Propagation

HVAC and building simulation is an area where I think SimScale really shines. I've used it for everything from checking whether an office space has adequate ventilation to evaluating pedestrian wind comfort around a new high-rise. The cloud aspect is a big plus here because you often need to run multiple wind directions or design variants, and doing that in parallel on the cloud saves a lot of time. Let me walk you through the main use cases.

## Indoor Airflow Analysis

### Setup

1. Import room/building CAD (with walls, floor, ceiling, furniture)
2. Create fluid domain:
   - Use interior volume of room as fluid domain
   - Extract fluid volume from solid walls
3. Mesh:
   - **Fineness**: 5-7 (moderate to fine)
   - **Refinement**: Near supply and return vents
   - **Inflation layers**: On walls (for heat transfer)
4. Physics:
   - **Analysis type**: Convective heat transfer (or CFD)
   - **Fluid**: Air (ρ = 1.225 kg/m³, μ = 1.79×10⁻⁵ Pa·s)
   - **Turbulence**: k-ε (for indoor air, with wall functions) or k-ω SST

### Boundary Conditions

1. **Supply air (inlet)**:
   - **Velocity**: 0.5-3 m/s (typical diffuser)
   - **Temperature**: 16°C (cooling) or 28°C (heating)
   - **Turbulence intensity**: 5-10%
2. **Return air (outlet)**:
   - **Pressure**: 0 Pa (gauge)
   - **Temperature**: Free (calculated)
3. **Walls**:
   - **Thermal**: Heat transfer coefficient (U-value) and external temperature
   - **No-slip**: For airflow
4. **Occupants/Equipment**:
   - **Heat source**: 100W per person, 50-500W per equipment
5. **Windows**:
   - **Solar radiation**: Heat flux on sun-facing windows (100-800 W/m²)

### Results

1. **Velocity field**: Air distribution in room
   - Check: No stagnant zones (velocity > 0.1 m/s)
   - Check: No draft (velocity < 0.25 m/s at occupant level)
2. **Temperature distribution**: At occupant height (1.1m)
   - Check: 20-26°C (comfort range)
   - Check: No stratification > 3°C floor-to-ceiling
3. **Air change rate**: ACH = Q × 3600 / Vroom
   - Typical: 4-10 ACH (office), 15-25 ACH (cleanroom)
4. **Ventilation effectiveness**: ETA = (Tsupply - Toccupant) / (Tsupply - Treturn)

## Thermal Comfort Analysis

### PMV and PPD

1. **PMV (Predicted Mean Vote)**: -3 (cold) to +3 (hot)
   - 0: Neutral (comfortable)
   - ±0.5: Comfortable
   - ±1.0: Slightly uncomfortable
   - ±2.0: Uncomfortable
2. **PPD (Predicted Percentage Dissatisfied)**: 0-100%
   - < 10%: Good comfort
   - < 20%: Acceptable
   - > 20%: Uncomfortable
3. PMV depends on:
   - **Air temperature**: Ta (°C)
   - **Mean radiant temperature**: Tr (°C)
   - **Air velocity**: Va (m/s)
   - **Relative humidity**: RH (%)
   - **Clothing insulation**: clo (1 clo = 0.155 m²·K/W)
   - **Metabolic rate**: met (1 met = 58 W/m²)

### SimScale Comfort Analysis

1. Run CFD with heat transfer (convective)
2. Post-processing:
   - **PMV contour**: Color plot in room
   - **PPD contour: Percentage dissatisfied
   - **Comfort zone**: Where PMV is within ±0.5
3. Typical values:
   - **Clothing**: 1.0 clo (winter), 0.5 clo (summer)
   - **Metabolic rate**: 1.2 met (sedentary office work)
   - **Humidity**: 50% (typical indoor)

### ASHRAE Standard 55

1. Comfort criteria per ASHRAE 55:
   - **PMV**: -0.5 to +0.5
   - **PPD**: < 10%
   - **Temperature**: 20-26°C (winter), 23-28°C (summer)
   - **Air velocity**: < 0.15 m/s (winter), < 0.2 m/s (summer)
2. SimScale evaluates these criteria from CFD results

## Natural Ventilation

### Setup

1. Building with openings (windows, doors, vents)
2. External wind:
   - **Wind speed**: 3-10 m/s (typical)
   - **Wind direction**: Prevailing wind direction
3. Buoyancy (stack effect):
   - **Temperature difference**: Internal vs. external
   - **Height difference**: Between inlet and outlet openings
4. Physics:
   - **Analysis type**: CFD (incompressible)
   - **Turbulence**: k-ω SST (for separation around building)
   - **Gravity**: Enabled (for buoyancy)

### Boundary Conditions

1. **Wind inlet**: Velocity (wind speed and direction)
2. **Wind outlet**: Pressure (0 Pa)
3. **Building walls**: No-slip
4. **Openings (windows)**:
   - Connected to external flow
   - Air flows through based on pressure difference
5. **Internal heat sources**: Occupants, equipment, solar

### Results

1. **Airflow through openings**: Volume flow rate (m³/s)
   - Check: Sufficient ventilation rate (≥ 10 L/s per person)
2. **Internal temperature**: With natural ventilation
   - Check: Within comfort range
3. **Air change rate**: ACH
   - Natural ventilation: 2-15 ACH (depending on wind and openings)
4. **Flow pattern**: Cross-ventilation or single-sided

### Design Optimization

1. **Opening size**: Larger = more airflow, but more heat loss/gain
2. **Opening location**: High and low openings for stack effect
3. **Window type**: Casement (directs flow) vs. sliding (less control)
4. **Building orientation**: Align openings with prevailing wind

## Smoke Propagation (Fire Safety)

### Setup

1. Import building CAD (rooms, corridors, stairwells)
2. Create fluid domain (internal air volume)
3. Fire source:
   - **Location**: Room of fire origin
   - **Heat release rate (HRR)**: kW (e.g., 5 MW for office fire)
   - **Soot yield**: kg soot per kg fuel
   - **CO yield**: kg CO per kg fuel
4. Physics:
   - **Analysis type**: CFD, transient, buoyant flow
   - **Turbulence**: LES (for smoke mixing) or k-ε (faster)
   - **Gravity**: Enabled (smoke rises)
   - **Species transport**: Smoke concentration

### Fire Models

1. **Design fire**:
   - **HRR curve**: t² growth (slow, medium, fast, ultra-fast)
   - Slow: α = 0.00293 kW/s²
   - Medium: α = 0.01172 kW/s²
   - Fast: α = 0.04689 kW/s²
   - Ultra-fast: α = 0.1876 kW/s²
   - Peak HRR: Per fire scenario (e.g., 5 MW office)
2. **Smoke production**:
   - Smoke = combustion products + entrained air
   - Smoke layer height: Interface between hot smoke and cool air

### Boundary Conditions

1. **Fire source**: Heat flux and species at fire location
2. **HVAC**: Supply and return (may shut down in fire mode)
3. **Exhaust**: Smoke exhaust fans (if installed)
4. **Openings**: Doors and windows (fire doors may close)
5. **Walls**: Thermal (heat transfer to walls)

### Results

1. **Smoke layer height**: Must stay > 2.0m (occupant evacuation)
   - Tenability: Visibility > 10m at 2.0m height
2. **Temperature**: Smoke layer temperature
   - Tenability: < 60°C at 2.0m height
3. **Visibility**: Smoke concentration → visibility
   - Tenability: > 10m
4. **CO concentration**: Toxic gas
   - Tenability: < 100 ppm
5. **Evacuation time**: Available Safe Egress Time (ASET)
   - ASET > RSET (Required Safe Egress Time)

## Outdoor Wind Comfort

### Pedestrian-Level Wind

1. Import building(s) and surrounding terrain
2. Create external flow domain:
   - **Upstream**: 5× building height
   - **Downstream**: 10-15× building height
   - **Lateral**: 5× building height
3. Mesh:
   - **Refinement**: At ground level (pedestrian height)
   - **Element size at ground**: 0.5-1.0m
4. Physics:
   - **Analysis type**: CFD (incompressible)
   - **Turbulence**: k-ω SST (for flow around buildings)
   - **Wind**: Velocity and direction

### Wind Directions

1. Run multiple simulations:
   - **8 wind directions**: N, NE, E, SE, S, SW, W, NW
2. For each direction:
   - **Wind speed**: Per local wind rose (frequency distribution)
   - **Probability**: From meteorological data

### Results

1. **Wind speed at pedestrian level** (2.0m height):
   - **Comfort**: < 5 m/s (sitting), < 10 m/s (standing)
   - **Danger**: > 15 m/s (risk of being blown over)
2. **Wind amplification**: Local / free-stream
   - Corner effects: Acceleration at building corners
   - Channeling: Acceleration between buildings
3. **Wind rose**: Combined results for all directions

### Wind Comfort Criteria

| Activity | Max Wind Speed (m/s) | Exceedance |
|----------|---------------------|------------|
| Sitting | 2.5 | < 10% of time |
| Standing | 3.5 | < 10% of time |
| Walking | 5.0 | < 10% of time |
| Dangerous | 15.0 | Never |

### Mitigation

1. **Wind screens**: At ground level (reduce local wind)
2. **Canopies**: Over entrances (reduce downdraft)
3. **Trees**: Natural windbreak (porous buffer)
4. **Building shape**: Taper, setback, chamfer (reduce ground-level wind)
5. **Colonnades**: Covered walkways (shield pedestrians)

## Cloud Computing for Building Simulation

### Simulation Scale

| Analysis | Mesh Size | Cores | Time |
|----------|-----------|-------|------|
| Room airflow | 1M | 16 | 20-40 min |
| Building CFD | 10M | 32 | 1-3 hours |
| Smoke (transient) | 5M | 32 | 4-8 hours |
| Outdoor wind | 10M | 32 | 1-3 hours |
| Wind (8 directions) | 10M × 8 | 32 | 8-24 hours |

### Advantage of Cloud

1. **Multiple directions**: Run 8 wind directions in parallel
2. **Parametric studies**: Multiple design variants simultaneously
3. **Large models**: 10M+ cells without local hardware
4. **Transient**: Long simulation times without tying up local machine

## Verification Checklist

- [ ] Fluid domain is correct (internal volume for indoor, external for outdoor)
- [ ] Mesh is refined at supply/return vents and near walls
- [ ] Boundary conditions match actual HVAC operation
- [ ] Heat sources match occupant and equipment loads
- [ ] PMV is within ±0.5 for comfort
- [ ] Air change rate meets ASHRAE 62.1 minimum
- [ ] Smoke layer height > 2.0m for tenability
- [ ] Wind speed at pedestrian level < 5 m/s (walking comfort)
- [ ] Multiple wind directions are evaluated
- [ ] Results match analytical estimates (where available)

## Wrapping Up

Building simulation is one of those areas where running multiple scenarios in parallel makes a huge difference. When I'm doing pedestrian wind comfort, I run 8 wind directions simultaneously — that would take days on a single workstation, but on SimScale it's done in a few hours. For smoke propagation, the transient nature means long run times, and not having my local machine tied up is a real benefit. The results aren't as detailed as a full FDS analysis, but for most practical HVAC and wind comfort questions, SimScale gives you what you need to make good design decisions.
