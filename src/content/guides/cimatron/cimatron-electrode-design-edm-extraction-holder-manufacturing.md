---
title: "Cimatron Electrode Design: EDM Electrode Creation, Extraction, and Manufacturing Workflow"
excerpt: "How to design EDM electrodes in Cimatron — covering electrode extraction from mold inserts, burn area definition, holder selection, electrode simulation, and NC machining for spark erosion of deep mold features."
category: "workflow"
softwareSlug: "cimatron"
keyword: "cimatron electrode design edm extraction holder manufacturing"
slug: "cimatron-electrode-design-edm-extraction-holder-manufacturing"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-09"
sources:
  - "https://help.cimatron.com/en/2026/Tips_and_Tricks.htm"
  - "https://help.cimatron.com/en/2026/New_Direction_Solid_Based_Analysis.htm"
---

# Cimatron Electrode Design: EDM Electrode Creation, Extraction, and Manufacturing Workflow

Some mold features can't be machined with a CNC mill — deep ribs, sharp internal corners, and complex 3D pockets. These features require EDM (Electrical Discharge Machining), and EDM requires electrodes. Cimatron's Electrode Design module automates electrode extraction from the mold insert. We've designed hundreds of electrodes in Cimatron. The workflow is efficient once you understand the extraction logic. Here's our complete guide.

## Why EDM Electrodes Are Needed

CNC milling can't produce:
- **Sharp internal corners** — mill tools are round, leaving a radius
- **Deep ribs** — tool length-to-diameter ratio limits depth
- **Fine details** — small tools break or deflect
- **Hard materials** — hardened tool steel is difficult to mill

EDM uses a shaped electrode (usually copper or graphite) that's lowered into the mold insert. Spark erosion removes material in the shape of the electrode. Cimatron designs the electrode and generates the NC code to machine it.

## Step 1: Identify Features Requiring EDM

Before creating electrodes, identify which features need spark erosion:

1. Open the mold insert (core or cavity) in Cimatron.
2. Identify features that can't be milled:
   - **Sharp internal corners**: Where two surfaces meet at a sharp angle
   - **Deep ribs**: Ribs with depth-to-width ratio > 3:1
   - **Deep pockets**: Pockets deeper than the mill tool can reach
   - **Fine text or logos**: Engraved features too small for milling
   - **Complex 3D contours**: Shapes that would require 5-axis milling with very small tools
3. Group features by electrode:
   - **One electrode per feature** — simplest, most electrodes
   - **One electrode for multiple features** — if features are close together
   - **Combination electrodes** — multiple features on one electrode blank

## Step 2: Extract the Electrode

1. Go to **Electrode** → **New Electrode**.
2. Select the **burn area** — the faces on the mold insert that the electrode will shape.
3. Cimatron extracts the geometry of the selected faces.
4. The extracted geometry becomes the electrode profile.

### Burn Area Selection

1. Select all faces that define the feature:
   - **Bottom face**: The deepest surface of the feature
   - **Side walls**: The walls of the rib, pocket, or slot
   - **Top face**: The opening of the feature (if applicable)
2. The selected faces define the electrode's working surface.
3. Cimatron automatically extends the geometry upward to create the electrode body.

### Extraction Parameters

- **Orbit allowance**: The gap between the electrode and the mold wall (typically 0.05-0.15mm per side, depends on the EDM machine and material)
- **Roughing orbit**: Larger allowance for the roughing electrode (0.1-0.3mm)
- **Finishing orbit**: Smaller allowance for the finishing electrode (0.02-0.05mm)
- **Extension length**: How far the electrode extends above the burn area (must clear the mold surface)

## Step 3: Define the Electrode Holder

The electrode needs a holder (shank) for the EDM machine:

1. Go to **Electrode** → **Holder**.
2. Select a holder from the catalog:
   - **Standard holders**: Cylindrical or rectangular shanks
   - **Custom holders**: For non-standard electrode shapes
3. Configure the holder:
   - **Shank size**: Must fit the EDM machine collet (e.g., 10mm, 20mm)
   - **Shank length**: Must be long enough to reach the burn area
   - **Transition**: The connection between the holder and the electrode body
4. The holder is attached to the electrode body.

### Holder Selection Tips

- **Use standard holders when possible** — reduces manufacturing cost
- **Match the holder to the EDM machine** — check the collet size
- **Ensure the holder is long enough** — the electrode must reach the burn area without the holder hitting the mold
- **Consider the electrode weight** — large electrodes need thicker holders

## Step 4: Complete the Electrode Body

After extraction and holder attachment:

1. Review the electrode body:
   - **Working surface**: Matches the burn area (with orbit allowance)
   - **Body extension**: Connects the working surface to the holder
   - **Holder**: The standard shank for the EDM machine
2. Check for issues:
   - **Thin sections**: Electrode body too thin — may break during EDM
   - **Interference**: Electrode body hits other mold features during burn
   - **Undercuts**: Electrode can't be machined (needs to be millable)

### Fixing Electrode Body Issues

**Thin sections**: If the electrode body is too thin:
1. Increase the body width beyond the burn area
2. Add a transition from the wider body to the working surface
3. Use a stronger electrode material (copper-tungsten for fine features)

**Interference**: If the electrode hits other features:
1. Check the burn area selection — ensure only the target feature is selected
2. Adjust the electrode body shape to avoid interference
3. Use a longer electrode to reach past interfering features

**Undercuts on the electrode**: If the electrode itself has undercuts (can't be milled):
1. Redesign the electrode to eliminate undercuts
2. Split into multiple electrodes
3. Use a different manufacturing method (wire EDM for the electrode)

## Step 5: Simulate the EDM Burn

Before manufacturing the electrode, simulate the burn:

1. Go to **Electrode** → **Simulation**.
2. Cimatron simulates the electrode entering the mold insert.
3. Check:
   - **Complete coverage**: The electrode burns the entire target feature
   - **No interference**: The electrode doesn't hit other features
   - **Correct depth**: The electrode reaches the required depth
   - **Orbit path**: The orbit motion covers all surfaces

### Simulation Checks

- **Visual check**: The burn area matches the target feature
- **Collision check**: The electrode body doesn't collide with the mold
- **Depth check**: The electrode reaches the bottom of the feature
- **Orbit check**: The orbit motion creates the correct surface finish

## Step 6: Generate Electrode NC Code

The electrode itself needs to be machined (usually from copper or graphite):

1. Go to **NC** → **New NC** for the electrode.
2. Select the electrode as the part.
3. Create toolpaths:
   - **Roughing**: Remove bulk material from the electrode blank
   - **Finishing**: Machine the working surface to the correct dimensions
   - **Contouring**: Machine the electrode body and transition
4. Post-process the toolpaths for the CNC machine.

### Electrode Material Considerations

**Copper electrodes**:
- Better surface finish on the mold
- Slower EDM burn rate
- More difficult to machine (gummy material)
- Good for fine details and sharp corners

**Graphite electrodes**:
- Faster EDM burn rate
- Good for large features
- Easy to machine
- Produces dust (requires dust collection)
- More prone to chipping on fine details

**Copper-tungsten electrodes**:
- Best for fine details and sharp corners
- High wear resistance
- Expensive
- Difficult to machine

## Step 7: Create the EDM Setup Sheet

1. Go to **Electrode** → **Setup Sheet**.
2. The setup sheet includes:
   - **Electrode number**: Unique identifier
   - **Burn location**: X, Y, Z coordinates on the mold
   - **Orbit parameters**: Orbit type, allowance, and pattern
   - **Electrode material**: Copper, graphite, or copper-tungsten
   - **Holder type**: Standard or custom
   - **Burn depth**: Z-axis depth for the burn
   - **Spark settings**: Roughing and finishing parameters
3. Export the setup sheet as PDF for the EDM operator.

## Step 8: Roughing and Finishing Electrodes

For high-precision features, use two electrodes:

### Roughing Electrode
- **Larger orbit allowance**: 0.1-0.3mm per side
- **Faster burn rate**: Higher spark energy
- **Leaves material**: 0.02-0.05mm remaining for finishing
- **Purpose**: Remove bulk material quickly

### Finishing Electrode
- **Smaller orbit allowance**: 0.02-0.05mm per side
- **Slower burn rate**: Lower spark energy
- **Final surface**: Achieves the required dimensions and surface finish
- **Purpose**: Achieve final dimensions and surface quality

### When to Use Two Electrodes

- **Tight tolerances**: ±0.02mm or better
- **Fine surface finish**: Ra < 0.8µm
- **Deep features**: Depth > 10mm (roughing reduces wear on the finishing electrode)
- **Production molds**: High-volume molds where electrode wear is significant

## Best Practices

- **Identify all EDM features before starting** — plan the electrode set before creating individual electrodes
- **Group nearby features on one electrode** — reduces the number of setups
- **Use standard holders** — reduces cost and setup time
- **Simulate every electrode** — catches interference before manufacturing
- **Use roughing and finishing electrodes for precision** — improves surface finish and dimensional accuracy
- **Choose the right electrode material** — copper for fine details, graphite for large features
- **Document burn locations** — the setup sheet is essential for the EDM operator
- **Check electrode machinability** — the electrode must be millable (no undercuts)
- **Export electrodes as STEP** — for manufacturing on any CNC machine
- **Keep electrodes organized** — number them consistently with the setup sheet
