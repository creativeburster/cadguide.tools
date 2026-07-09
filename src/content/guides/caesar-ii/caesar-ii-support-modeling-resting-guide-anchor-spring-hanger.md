---
title: "CAESAR II Support Modeling: Resting, Guide, Anchor, and Spring Hanger Selection"
excerpt: "How to model pipe supports in CAESAR II — covering resting supports with friction, guides, line stops, rigid anchors, variable and constant spring hanger selection, support stiffness input, and troubleshooting support overload."
category: "workflow"
softwareSlug: "caesar-ii"
keyword: "caesar ii support modeling resting guide anchor spring hanger selection"
slug: "caesar-ii-support-modeling-resting-guide-anchor-spring-hanger"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://aliresources.hexagon.com/engineering-analysis/decoding-pipe-stress-analysis-a-deep-dive-into-training-dynamics-and-efficient-project-estimations"
  - "https://aliresources.hexagon.com/brochures/the-worlds-most-respected-tool-for-pipe-stress-analysis"
---

# CAESAR II Support Modeling: Resting, Guide, Anchor, and Spring Hanger Selection

Supports are the most important elements in a pipe stress model. Get the supports wrong and your entire analysis is wrong — even if the pipe geometry and load cases are perfect. I've seen engineers model every support as a rigid anchor and wonder why their expansion stress fails. Support modeling requires understanding how each support type constrains the pipe. Here's my guide.

## Support Types in CAESAR II

### 1. Resting Support (Y-Rest)
- **Allows**: X movement, Z movement, upward movement
- **Prevents**: Downward movement (Y-)
- **Friction**: Applied in X and Z directions
- **Use for**: Pipe racks, floor supports, structural steel supports
- **Symbol**: ▲ (triangle)

### 2. Guide
- **Allows**: Axial movement (along the pipe), upward movement
- **Prevents**: Lateral movement (X and/or Z)
- **Friction**: Applied in the axial direction
- **Use for**: Controlling thermal expansion direction
- **Symbol**: ◇ (diamond)

### 3. Line Stop
- **Allows**: Lateral movement, upward movement
- **Prevents**: Axial movement (along the pipe)
- **Use for**: Directing thermal expansion to a specific location
- **Symbol**: ⊥ (T-shape)

### 4. Anchor
- **Allows**: Nothing — fully rigid
- **Prevents**: All movement (X, Y, Z, Rx, Ry, Rz)
- **Use for**: Equipment connections, battery limits, major boundaries
- **Symbol**: ▣ (square)

### 5. Spring Hanger (Variable)
- **Allows**: Vertical movement with variable resistance
- **Prevents**: No rigid restraint — supports weight with spring force
- **Use for**: Hot lines that move up when heated
- **Symbol**: ○ (circle with spring)

### 6. Constant Spring Hanger
- **Allows**: Vertical movement with constant support force
- **Prevents**: No rigid restraint — constant force regardless of movement
- **Use for**: Large thermal movements where variable springs are impractical
- **Symbol**: ○ (circle with constant symbol)

## Step 1: Model Resting Supports

Resting supports are the most common support type:

1. In Piping Input, go to the support node.
2. Enter the support restraint:
   - **Y direction**: Displacement = 0 (prevents downward movement)
   - **X direction**: Friction coefficient (e.g., 0.3)
   - **Z direction**: Friction coefficient (e.g., 0.3)
3. The support allows the pipe to slide horizontally with friction resistance.

### Friction Coefficient Values

| Surface Pair | Friction Coefficient |
|---|---|
| Steel on steel | 0.3 |
| Steel on concrete | 0.4 |
| Teflon on steel | 0.1 |
| Teflon on Teflon | 0.08 |
| Roller support | 0.0 |

### Friction Considerations

- **Friction is nonlinear** — CAESAR II handles this iteratively
- **Friction direction** — opposes the direction of movement
- **Friction can lock** — if the pipe doesn't move, friction acts as a restraint
- **Sensitivity analysis** — run with friction = 0 and friction = 0.3 to check the range

### Resting Support Best Practices

- **Don't model a resting support as an anchor** — this over-constrains the pipe
- **Include friction** — it affects thermal expansion and support loads
- **Check lift-off** — if the pipe lifts off the support, the support is ineffective
- **Add a gap if needed** — for supports with a gap (e.g., oversized guide holes)

## Step 2: Model Guides

Guides control lateral movement while allowing axial thermal expansion:

1. At the guide node, enter:
   - **X direction**: Displacement = 0 (prevents X movement)
   - **Z direction**: Displacement = 0 (prevents Z movement)
   - **Y direction**: Friction coefficient (if the guide also supports weight)
2. The guide allows the pipe to move axially but not laterally.

### Guide Stiffness

For flexible guides (not perfectly rigid):
1. Enter the guide stiffness instead of displacement = 0:
   - **Typical guide stiffness**: 50,000-200,000 lb/in (8760-35040 N/mm)
   - **Stiff guide**: > 500,000 lb/in
   - **Flexible guide**: < 50,000 lb/in
2. Use realistic stiffness — perfectly rigid guides may not reflect reality

### Guide Best Practices

- **Place guides near changes in direction** — prevent lateral movement at elbows
- **Don't over-guide** — too many guides restrict thermal expansion and increase stress
- **Use guides to direct expansion** — guide the pipe to expand toward an expansion loop
- **Check guide loads** — high guide loads may indicate insufficient flexibility

## Step 3: Model Anchors

Anchors are fully rigid connections:

1. At the anchor node, enter:
   - **All directions**: Displacement = 0 (X, Y, Z)
   - **All rotations**: Displacement = 0 (Rx, Ry, Rz)
2. The anchor prevents all movement and rotation.

### When to Use Anchors

- **Equipment connections**: Pumps, vessels, turbines (with nozzle flexibility)
- **Battery limits**: Where piping connects to another system
- **Major boundaries**: At building walls, floor penetrations
- **Dead ends**: At pipe ends that are capped or flanged

### Anchor vs. Equipment Nozzle

An anchor is perfectly rigid. Equipment nozzles are not — they have flexibility. To model equipment nozzles accurately:

1. **Use a rigid element** from the pipe to the equipment center
2. **Model the nozzle flexibility** using the equipment vendor's stiffness values
3. **Or use CAESAR II's equipment modules**:
   - **Pump module**: API 610 nozzle load checking
   - **Vessel module**: WRC 107 nozzle stress analysis
   - **Turbine module**: API 617 nozzle load checking

### Anchor Best Practices

- **Don't anchor unless truly rigid** — most connections have some flexibility
- **Model equipment nozzle flexibility** — rigid anchors over-predict stress
- **Check anchor loads** — high anchor loads may require redesign
- **Use anchors sparingly** — too many anchors restrict thermal expansion

## Step 4: Select Spring Hangers

Spring hangers support the pipe weight while allowing thermal movement:

### When to Use Spring Hangers

- **Hot lines**: Lines that move up when heated — a rigid support would lift off
- **Lines with large thermal movement**: Where rigid supports would create high stress
- **Near equipment**: To reduce nozzle loads by accommodating thermal growth
- **Overhead piping**: Where the pipe is suspended from above

### Variable Spring Selection

1. Go to **Tools** → **Spring Hanger Selection**.
2. Enter:
   - **Operating load**: The weight of the pipe at the support location (from the operating case)
   - **Movement**: The thermal displacement at the support location (from the operating case)
   - **Spring type**: Variable or constant
   - **Hanger type**: Hanger (top) or support (bottom)
3. CAESAR II selects the appropriate spring from the manufacturer catalog:
   - **Spring rate**: lb/in (N/mm) — the force change per unit displacement
   - **Working range**: The displacement range the spring can accommodate
   - **Hot load**: The spring force at operating temperature
   - **Cold load**: The spring force at ambient temperature
4. Review the selection:
   - **Variability**: (Hot load - Cold load) / Hot load — should be < 25% for variable springs
   - **Load capacity**: The spring must support the pipe weight
   - **Movement range**: The spring must accommodate the thermal movement

### Constant Spring Selection

For large thermal movements (> 50mm) where variable springs have too much variability:

1. Select **Constant Spring** in the spring hanger module.
2. Enter the operating load and movement.
3. CAESAR II selects a constant spring that provides constant support force regardless of movement.
4. Constant springs are more expensive but necessary for large movements.

### Spring Hanger Best Practices

- **Select springs after the initial analysis** — run the model with rigid supports first, then replace with springs
- **Check variability** — variable springs should have < 25% variability
- **Verify hot and cold loads** — ensure the spring supports the pipe in both conditions
- **Check spring travel** — the spring must accommodate the full thermal movement
- **Consider maintenance** — springs need periodic inspection and adjustment
- **Don't use springs for seismic restraint** — springs don't resist dynamic loads

## Step 5: Check Support Loads

After running the analysis:

1. Go to **Output** → **Support Report**.
2. For each support, check:
   - **Operating load**: Weight + thermal + pressure
   - **Sustained load**: Weight + pressure
   - **Hydrotest load**: Weight + hydrotest pressure (may be higher than operating)
   - **Upward load**: Is the support holding down the pipe? (indicates lift-off risk)
3. Compare support loads with structural capacity:
   - **Steel support capacity**: Check with structural engineer
   - **Concrete support capacity**: Check with structural engineer
   - **Spring capacity**: Check against spring catalog

### Common Support Load Problems

**Support overload**: The support load exceeds the structural capacity.
- **Fix**: Add more supports, increase structural capacity, or reduce pipe span

**Lift-off**: The pipe lifts off the support in the operating case.
- **Fix**: Use a spring hanger, add weight, or reposition the support

**High friction load**: Friction creates high axial loads.
- **Fix**: Use Teflon slide plates (friction = 0.1), or reduce the number of supports

**Guide overload**: The guide lateral load is too high.
- **Fix**: Add more guides, change pipe routing, or add flexibility

## Step 6: Model Support Stiffness

For realistic support modeling, enter actual stiffness instead of perfectly rigid:

1. **Resting support stiffness**: 
   - Steel support: 100,000-1,000,000 lb/in
   - Concrete support: 500,000-5,000,000 lb/in
2. **Guide stiffness**:
   - Standard guide: 50,000-200,000 lb/in
   - Stiff guide: > 500,000 lb/in
3. **Anchor stiffness**:
   - Equipment nozzle: Use vendor values
   - Structural anchor: 1,000,000+ lb/in

### Why Stiffness Matters

Perfectly rigid supports (displacement = 0) are unrealistic. Real supports have flexibility. Using realistic stiffness:
- **Reduces over-prediction of stress** — rigid supports over-predict stress at the support
- **Improves accuracy** — flexible supports distribute loads more realistically
- **Affects frequency analysis** — support stiffness affects natural frequencies

## Best Practices

- **Model supports accurately** — don't use rigid anchors for flexible connections
- **Include friction on resting supports** — friction affects thermal expansion
- **Select springs after initial analysis** — replace rigid supports with springs based on results
- **Check support loads in all load cases** — hydrotest may govern the support design
- **Use realistic stiffness** — perfectly rigid supports are unrealistic
- **Check for lift-off** — supports that lift off are ineffective
- **Coordinate with structural engineering** — support loads must be within structural capacity
- **Document support types and locations** — the support plan is a project deliverable
- **Run sensitivity analysis** — vary friction and stiffness to check robustness
- **Review with the piping engineer** — support selection is a collaborative decision
