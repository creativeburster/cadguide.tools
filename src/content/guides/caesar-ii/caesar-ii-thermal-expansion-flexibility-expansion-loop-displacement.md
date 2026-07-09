---
title: "CAESAR II Thermal Expansion Analysis: Flexibility, Expansion Loops, and Displacement Stress"
excerpt: "How to analyze thermal expansion in piping systems using CAESAR II — covering displacement stress range calculation, expansion loop design, cold spring, expansion joints, and troubleshooting expansion stress failures per ASME B31.3."
category: "workflow"
softwareSlug: "caesar-ii"
keyword: "caesar ii thermal expansion analysis flexibility expansion loop displacement stress"
slug: "caesar-ii-thermal-expansion-flexibility-expansion-loop-displacement"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://aliresources.hexagon.com/engineering-analysis/decoding-pipe-stress-analysis-a-deep-dive-into-training-dynamics-and-efficient-project-estimations"
  - "https://aliresources.hexagon.com/design-visualization/an-overview-of-caesar-ii-2020"
---

# CAESAR II Thermal Expansion Analysis: Flexibility, Expansion Loops, and Displacement Stress

Thermal expansion is where most piping systems fail stress analysis. A 100-meter pipe at 300°C expands 338mm. If that expansion is restrained, the resulting stress can exceed the code allowable by 200% or more. I've fixed countless expansion stress failures — the solutions are always about adding flexibility. Here's my guide to thermal expansion analysis in CAESAR II.

## Understanding Thermal Expansion

### How Pipes Expand

When a pipe is heated, it expands:
- **Carbon steel**: 0.012mm/m/°C (6.5in/100ft/100°F)
- **Stainless steel**: 0.017mm/m/°C (9.3in/100ft/100°F)
- **Copper**: 0.017mm/m/°C

For a 50m carbon steel pipe at 200°C:
```
Expansion = 0.012 × 50 × 200 = 120mm
```

### Displacement Stress Range

ASME B31.3 uses the displacement stress range (SE) to evaluate thermal expansion:

```
SE = √(Sb² + 4 × St²)
```

Where:
- **Sb**: Bending stress from thermal expansion
- **St**: Torsional stress from thermal expansion

### Allowable Expansion Stress

```
SA = f × (1.25 × Sc + 0.25 × Sh)
```

Where:
- **Sc**: Cold allowable stress (at ambient temperature)
- **Sh**: Hot allowable stress (at design temperature)
- **f**: Stress range reduction factor (for cyclic loading, typically 1.0 for < 7000 cycles)

The code requires: **SE ≤ SA**

## Step 1: Define Temperature Load Cases

1. In the Load Case Editor, define:
   - **T1**: Ambient temperature (typically 20°C / 70°F)
   - **T2**: Operating temperature (e.g., 200°C / 400°F)
2. Create the expansion load case:
   - **Name**: "EXP-T1-T2"
   - **Type**: Expansion (EXP)
   - **Load**: T2 - T1 (thermal expansion from ambient to operating)
3. The expansion case calculates the displacement stress range between ambient and operating conditions.

### Multiple Operating Temperatures

If the piping has multiple operating temperatures:
1. **T2**: Maximum operating temperature
2. **T3**: Minimum operating temperature (may be below ambient for cryogenic service)
3. Create expansion cases for each temperature pair:
   - "EXP-T1-T2": Ambient to hot
   - "EXP-T1-T3": Ambient to cold
   - "EXP-T2-T3": Hot to cold (if cycling between these)

## Step 2: Run the Analysis and Check Expansion Stress

1. Run the static analysis.
2. Go to **Output** → **Code Stress Report**.
3. Find the expansion case (EXP):
   - **SE**: Calculated expansion stress
   - **SA**: Allowable expansion stress
   - **Ratio**: SE/SA as a percentage
4. Check each node:
   - **< 100%**: Code compliant
   - **> 100%**: Code violation — needs redesign
   - **> 90%**: Warning — close to the limit

### Where Expansion Stress Is Highest

Expansion stress is typically highest at:
- **Elbows**: Bending stress from thermal expansion is concentrated at direction changes
- **Anchors**: The pipe pushes against anchors when expanding
- **Tee connections**: Branch pipes expand differently from the main
- **Reducer connections**: Size changes create stress concentrations
- **Near equipment**: Nozzle connections act as partial anchors

## Step 3: Identify the Cause of Expansion Stress Failure

When SE > SA, identify the cause:

### Cause 1: Straight Pipe Too Long

A long straight pipe between anchors has no way to absorb thermal expansion. The expansion creates massive axial stress at the anchors.

**Symptoms**: High stress at both anchor points. Low stress in the middle.

**Fix**: Add an expansion loop or change the routing to include bends.

### Cause 2: Too Many Anchors

Multiple anchors along a pipe prevent thermal expansion. Each anchor restrains the pipe, creating high stress between anchors.

**Symptoms**: High stress at each anchor. Stress increases with the number of anchors.

**Fix**: Remove unnecessary anchors, replace with guides or resting supports.

### Cause 3: Insufficient Flexibility

The pipe routing is too stiff — not enough bends to absorb expansion.

**Symptoms**: High stress at elbows and anchors. The pipe is mostly straight with few direction changes.

**Fix**: Add expansion loops, change routing, or use expansion joints.

### Cause 4: Branch Connection Restraint

A branch pipe connected to a main pipe is restrained by the main pipe's movement. The branch can't expand freely.

**Symptoms**: High stress at the tee connection. The branch pipe has high stress near the tee.

**Fix**: Add flexibility to the branch (loop, flexible routing, spring support).

## Step 4: Design Expansion Loops

Expansion loops are U-shaped detours in the pipe routing that absorb thermal expansion:

### Loop Sizing

The required loop size depends on:
- **Pipe diameter**: Larger pipes need larger loops
- **Expansion amount**: More expansion requires larger loops
- **Pipe material**: Higher expansion coefficient requires larger loops
- **Temperature difference**: Larger ΔT requires larger loops

### Loop Design Process

1. Calculate the thermal expansion:
   ```
   ΔL = α × L × ΔT
   ```
   Where α is the thermal expansion coefficient, L is the pipe length, and ΔT is the temperature change.

2. Estimate the required loop height:
   ```
   h = √(3 × E × I × ΔL / (2 × SA × L))
   ```
   Where E is the elastic modulus, I is the moment of inertia, and SA is the allowable stress.

3. Add the loop to the CAESAR II model:
   - Insert nodes for the loop
   - Route the pipe up, across, and back down (U-shape)
   - Add supports at the loop (guide at the top)

4. Re-run the analysis and check the expansion stress.

### Loop Types

**U-Bend (most common)**:
- Pipe goes up, across, and back down
- Simple to fabricate and support
- Absorbs axial expansion

**Z-Bend**:
- Pipe changes direction twice in a Z pattern
- More compact than a U-bend
- Absorbs expansion in two directions

**L-Bend**:
- Pipe changes direction 90°
- Absorbs expansion by lateral movement
- Less effective than U-bend for large expansion

### Loop Best Practices

- **Place loops at mid-span** — distributes stress evenly
- **Add guides near the loop** — controls lateral movement
- **Size the loop conservatively** — better to have a slightly larger loop than to fail
- **Consider fabrication cost** — larger loops use more pipe and require more supports
- **Check loop displacement** — ensure the loop doesn't hit nearby structures

## Step 5: Use Cold Spring (Cold Pull)

Cold spring is the practice of cutting the pipe shorter than the installed length and pulling it into position during construction. This pre-stresses the pipe in the cold state, reducing the hot stress.

### How Cold Spring Works

- **Cold state**: Pipe is under tension (pulled to fit)
- **Hot state**: Tension is relieved, then compression develops
- **Net effect**: Reduces the maximum stress range

### Applying Cold Spring in CAESAR II

1. In the Piping Input, at the cut point:
   - Enter the **cold spring gap** (e.g., 50mm)
   - Specify the direction of the gap
2. CAESAR II adjusts the expansion calculation:
   - **Cold stress**: Increased (pre-stress)
   - **Hot stress**: Decreased
   - **Stress range**: Reduced by the cold spring factor

### Cold Spring Limitations

- **ASME B31.3**: Cold spring is not credited for stress range reduction (only for support load reduction)
- **ASME B31.1**: Cold spring is credited up to 2/3 of the expansion
- **Practical**: Cold spring is difficult to execute correctly in the field
- **Recommendation**: Don't rely on cold spring for code compliance — use flexibility instead

## Step 6: Use Expansion Joints

When expansion loops are impractical (space constraints, large pipe sizes), expansion joints absorb thermal expansion:

### Types of Expansion Joints

1. **Bellows expansion joint**: Metal bellows that compress/extend
   - Absorbs axial expansion
   - Limited lateral and angular movement
   - Requires guides and anchors

2. **Slip expansion joint**: One pipe slides inside another
   - Absorbs large axial expansion
   - Requires packing/g seals
   - Limited cycles

3. **Flexible hose**: Braided metal hose
   - Absorbs small movements
   - Good for vibration isolation
   - Limited expansion capacity

### Modeling Expansion Joints in CAESAR II

1. At the expansion joint location:
   - **Axial stiffness**: Enter the bellows axial stiffness (from manufacturer)
   - **Lateral stiffness**: Enter the bellows lateral stiffness
   - **Angular stiffness**: Enter the bellows angular stiffness
2. Add **tie rods** if applicable:
   - Tie rods prevent over-extension of the bellows
   - Model as rigid elements with a gap
3. Add **guides** near the expansion joint:
   - Two guides on each side of the joint
   - Guides ensure the pipe moves axially only

### Expansion Joint Best Practices

- **Follow manufacturer recommendations** — each joint has specific installation requirements
- **Add guides** — expansion joints require guides to prevent lateral movement
- **Check pressure thrust** — bellows joints create pressure thrust that the anchors must resist
- **Don't use expansion joints for seismic restraint** — they're not designed for dynamic loads
- **Consider fatigue life** — bellows have a finite cycle life

## Step 7: Verify the Solution

After adding flexibility (loops, joints, or cold spring):

1. Re-run the analysis.
2. Check the expansion stress:
   - **SE ≤ SA**: Code compliant
   - **All nodes < 100%**: No failures
3. Check support displacements:
   - **Support movement**: Ensure supports can accommodate the displacement
   - **Guide movement**: Ensure guides aren't overloaded
4. Check nozzle loads:
   - **Equipment nozzles**: Ensure thermal expansion doesn't overload nozzles
5. Check interference:
   - **Pipe movement**: Ensure the pipe doesn't hit nearby structures during expansion

## Best Practices

- **Calculate thermal expansion before modeling** — know how much the pipe will grow
- **Add flexibility early in the design** — don't wait for stress failure to add loops
- **Use expansion loops over expansion joints** — loops are more reliable and require less maintenance
- **Place loops at mid-span** — distributes stress evenly
- **Don't over-anchor** — too many anchors restrict thermal expansion
- **Check stress at elbows and anchors** — these are the high-stress locations
- **Run sensitivity analysis** — vary temperature and friction to check robustness
- **Document the expansion strategy** — record loop locations, joint types, and cold spring
- **Coordinate with piping design** — expansion loops need space in the pipe rack
- **Review with the stress engineer** — expansion design is a collaborative effort
