---
title: "CAESAR II Pipe Stress Analysis: Model Building, Load Cases, and Code Compliance"
excerpt: "How to build a pipe stress analysis model in CAESAR II — covering piping input data entry, node numbering, support modeling, load case definition, code compliance checking (ASME B31.3), and interpreting stress results."
category: "workflow"
softwareSlug: "caesar-ii"
keyword: "caesar ii pipe stress analysis model building load cases code compliance"
slug: "caesar-ii-pipe-stress-analysis-model-building-load-cases-compliance"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://aliresources.hexagon.com/engineering-analysis/decoding-pipe-stress-analysis-a-deep-dive-into-training-dynamics-and-efficient-project-estimations"
  - "https://aliresources.hexagon.com/design-visualization/an-overview-of-caesar-ii-2020"
---

# CAESAR II Pipe Stress Analysis: Model Building, Load Cases, and Code Compliance

Pipe stress analysis is not optional — it's a code requirement. ASME B31.3 requires stress analysis for piping systems that exceed certain thresholds. CAESAR II is the industry standard for this analysis. We've modeled hundreds of piping systems in CAESAR II, from simple pump discharge lines to complex refinery header systems. Here's our complete workflow.

## Why Pipe Stress Analysis Matters

Pipe stress analysis ensures:
- **Code compliance**: Meets ASME B31.3, B31.1, B31.4, B31.8 requirements
- **Safe operation**: Piping doesn't fail under pressure, temperature, or external loads
- **Equipment protection**: Nozzle loads within manufacturer allowables
- **Support design**: Supports are correctly sized and located
- **Thermal expansion**: Piping accommodates thermal growth without excessive stress
- **Seismic safety**: Piping withstands earthquake loads

## Step 1: Gather Input Data

Before building the model, collect:

### Piping Data
- **Pipe sizes**: Nominal pipe size (NPS) and schedule
- **Material**: Carbon steel, stainless steel, alloy, etc.
- **Design code**: ASME B31.3 (process piping), B31.1 (power piping), B31.4 (pipeline), B31.8 (gas transmission)
- **Design pressure**: Maximum operating pressure
- **Design temperature**: Maximum and minimum operating temperatures
- **Corrosion allowance**: Typically 1.5-3mm
- **Insulation**: Type and thickness
- **Pipe roughness**: For friction calculations

### Geometry Data
- **Pipe routing**: Isometric drawings or 3D model export
- **Pipe lengths**: Between nodes
- **Directions**: Changes in direction (north, south, east, west, up, down)
- **Fittings**: Elbows, tees, reducers, flanges, valves

### Support Data
- **Support types**: Resting, guide, anchor, spring hanger
- **Support locations**: Along the pipe routing
- **Support stiffness**: For flexible supports
- **Friction coefficients**: Typically 0.3 for steel-on-steel

### Equipment Data
- **Nozzle loads**: Manufacturer allowable loads for pumps, vessels, turbines
- **Equipment connections**: Rigid or flexible
- **Equipment movements**: Thermal growth of connected equipment

### Environmental Data
- **Wind loads**: Wind speed and direction
- **Seismic loads**: Seismic coefficient or response spectrum
- **Ambient temperature**: For thermal expansion calculations

## Step 2: Build the Piping Model

1. Open CAESAR II.
2. Create a new file.
3. Go to **Piping Input**.

### Node Numbering

Use a logical node numbering scheme:
- **Start at 10 or 100**: Leave room for insertions
- **Increment by 10**: 10, 20, 30, 40... (allows inserting nodes like 15, 25)
- **Use consistent numbering**: e.g., 100 series for main pipe, 200 series for branches
- **Mark special nodes**: Anchors (A), supports (S), equipment (E)

### Entering Pipe Elements

For each pipe segment between two nodes:

1. **From Node**: Starting node number
2. **To Node**: Ending node number
3. **DX, DY, DZ**: Pipe length in each direction (inches or mm)
   - Example: A pipe going 10 feet north = DY = 120 inches (or 3048mm)
4. **Pipe size**: NPS (e.g., 6", 8", 12")
5. **Schedule**: Schedule 40, 80, XS, XXS, or custom
6. **Material**: From the material library (e.g., A106 Gr.B, A312 TP316)
7. **Design temperature**: Maximum operating temperature
8. **Design pressure**: Maximum operating pressure
9. **Corrosion allowance**: Typically 0.0625" (1.5mm)
10. **Insulation**: Type and thickness (if applicable)

### Fittings

At direction changes and connections:
- **Elbow**: Select elbow type (90° LR, 90° SR, 45° LR) — CAESAR II automatically adds the elbow
- **Tee**: At branch connections — select tee type (straight, reducing)
- **Reducer**: At size changes — enter the new pipe size
- **Flange**: Add flanges at equipment connections and valve locations
- **Valve**: Add valves with weight and rigidity

### Rigid Elements

For components that aren't pipe:
- **Equipment nozzles**: Rigid elements from the pipe to the equipment center
- **Valves**: Rigid elements with the valve weight
- **Flanges**: Rigid elements with the flange weight
- **Support structures**: Rigid elements representing steel or concrete

## Step 3: Add Supports

Supports constrain pipe movement:

### Support Types in CAESAR II

1. **Resting support (Y-rest)**: Prevents downward movement — allows upward movement
   - Use for pipe racks and floor supports
   - Friction is applied in the X and Z directions

2. **Guide**: Prevents lateral movement — allows axial movement
   - Use to control thermal expansion direction
   - Typically X or Z direction only

3. **Anchor**: Prevents all movement — fully rigid
   - Use at equipment connections and major boundaries
   - All six degrees of freedom are restrained

4. **Line stop**: Prevents axial movement — allows lateral and vertical
   - Use to control thermal expansion at specific points

5. **Spring hanger**: Variable support that accommodates thermal movement
   - Use for hot lines that move up when heated
   - Select spring type: variable spring, constant spring

### Entering Supports

1. At the support node, enter the support type:
   - **Rest**: Displacement = 0 in the -Y direction
   - **Guide**: Displacement = 0 in X and/or Z direction
   - **Anchor**: Displacement = 0 in all directions
2. For friction:
   - **Friction coefficient**: 0.3 (steel on steel), 0.1 (Teflon)
   - Applied to resting and guide supports
3. For spring hangers:
   - Use the **Spring Hanger Selection** module
   - Enter the operating load and movement
   - CAESAR II selects the appropriate spring

## Step 4: Define Load Cases

Load cases define the loading conditions to analyze:

### Standard Load Cases

1. **Operating Case (W+P+T)**:
   - Weight (W) + Pressure (P) + Temperature (T)
   - The primary operating condition
   - Used for sustained stress and displacement stress

2. **Sustained Case (W+P)**:
   - Weight (W) + Pressure (P) only
   - Used for sustained stress (hoop stress + longitudinal stress)

3. **Expansion Case (T1-T2)**:
   - Thermal expansion from ambient to operating temperature
   - Used for displacement stress range

4. **Hydrotest Case (W+H)**:
   - Weight (W) + Hydrotest pressure (H)
   - Used for checking supports during hydrotest

5. **Wind Case (W+P+T+Win)**:
   - Operating + Wind load
   - Used for occasional stress

6. **Seismic Case (W+P+T+Seis)**:
   - Operating + Seismic load
   - Used for occasional stress

### Creating Load Cases

1. Go to **Load Case Editor**.
2. Create each load case:
   - **Name**: e.g., "OPE-W+P+T", "SUS-W+P", "EXP-T1-T2"
   - **Type**: Operating (OPE), Sustained (SUS), Expansion (EXP), Occasional (OCC)
   - **Load combinations**: Add the appropriate loads (W, P, T, Win, Seis)
3. Set the **code** for each load case:
   - **ASME B31.3**: For process piping
   - **ASME B31.1**: For power piping
4. Define the number of load cases needed — typically 5-10 for a standard analysis

## Step 5: Run the Analysis

1. Go to **Analysis** → **Static Analysis**.
2. Select the load cases to run.
3. Click **Run**.
4. CAESAR II solves the pipe stress equations for each load case.
5. Review the output:
   - **Stress report**: Code stress ratios for each load case
   - **Support report**: Support loads and displacements
   - **Displacement report**: Node displacements
   - **Code compliance**: Pass/fail for each code requirement

## Step 6: Interpret Stress Results

### Stress Types

1. **Sustained Stress (SH)**:
   - Caused by weight and pressure
   - Code limit: SH ≤ S_h (hot allowable stress)
   - If exceeded: Add supports or reduce span

2. **Expansion Stress (SE)**:
   - Caused by thermal expansion
   - Code limit: SE ≤ SA (allowable expansion stress range)
   - SA = f × (1.25 × Sc + 0.25 × Sh)
   - If exceeded: Add flexibility (loops, expansion joints) or change routing

3. **Occasional Stress (SO)**:
   - Caused by wind or seismic loads
   - Code limit: SO ≤ 1.33 × Sh
   - If exceeded: Add supports or strengthen the system

4. **Hoop Stress**:
   - Caused by internal pressure
   - Code limit: SHoop ≤ S_h × E × W (with joint efficiency and reduction factors)
   - If exceeded: Increase pipe schedule or reduce pressure

### Stress Ratio

CAESAR II reports stress as a percentage of the allowable:
- **< 100%**: Code compliant — pass
- **> 100%**: Code violation — fail
- **> 90%**: Warning — close to the limit, consider redesign

### Common Stress Failures

**Sustained stress > 100%**:
- **Cause**: Pipe span too long, insufficient supports
- **Fix**: Add supports, reduce span, or increase pipe size

**Expansion stress > 100%**:
- **Cause**: Insufficient flexibility, too many anchors
- **Fix**: Add expansion loop, change routing, use expansion joint

**Occasional stress > 100%**:
- **Cause**: Wind or seismic loads too high
- **Fix**: Add guides or anchors to resist lateral loads

**Nozzle loads exceeded**:
- **Cause**: Pipe transfers too much load to equipment
- **Fix**: Add flexibility near the nozzle, use spring hangers

## Step 7: Check Nozzle Loads

Equipment nozzle loads must be within manufacturer allowables:

1. Go to **Output** → **Nozzle Load Report**.
2. For each equipment connection:
   - **Force (Fx, Fy, Fz)**: Piping forces on the nozzle
   - **Moment (Mx, Our, Mz)**: Piping moments on the nozzle
3. Compare with manufacturer allowables:
   - **API 610**: For pump nozzles
   - **API 617**: For compressor nozzles
   - **HEI**: For heat exchanger nozzles
   - **Vendor specification**: For custom equipment
4. If loads exceed allowables:
   - Add flexibility (expansion loop, spring hanger)
   - Move supports closer to the nozzle
   - Change pipe routing to reduce thermal expansion loads

## Step 8: Optimize the Design

If any stress or load exceeds the allowable:

### Add Flexibility
- **Expansion loop**: Add a U-bend or loop to absorb thermal expansion
- **Expansion joint**: Use a bellows expansion joint (where code permits)
- **Change routing**: Add bends instead of straight runs

### Adjust Supports
- **Add supports**: Reduce span to lower sustained stress
- **Move supports**: Optimize support locations
- **Use spring hangers**: Accommodate thermal movement while supporting weight
- **Add guides**: Control thermal expansion direction

### Change Pipe Specifications
- **Increase schedule**: Thicker pipe reduces stress
- **Change material**: Higher allowable stress material
- **Increase diameter**: Larger pipe has lower stress (but higher cost)

## Best Practices

- **Use logical node numbering** — 10, 20, 30... with gaps for insertions
- **Model all fittings** — elbows, tees, reducers affect flexibility
- **Include corrosion allowance** — reduces wall thickness available for stress
- **Define all load cases** — operating, sustained, expansion, hydrotest, wind, seismic
- **Check stress ratios** — anything > 90% warrants review
- **Verify nozzle loads** — equipment manufacturers have specific allowables
- **Document assumptions** — friction coefficients, support stiffness, boundary conditions
- **Review with the piping engineer** — stress analysis is a collaborative effort
- **Run sensitivity analysis** — vary friction coefficient and support stiffness to check robustness
- **Keep the model organized** — use comments and node labels for clarity
