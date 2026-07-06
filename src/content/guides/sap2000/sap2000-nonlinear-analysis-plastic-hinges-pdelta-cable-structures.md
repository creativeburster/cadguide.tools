---
title: "SAP2000 Nonlinear Analysis: Plastic Hinges, P-Delta, and Cable Structures"
excerpt: "A guide to nonlinear analysis in SAP2000 covering geometric nonlinearity (P-Delta), material nonlinearity (plastic hinges), cable and tension structures, and nonlinear time history analysis for performance-based design."
category: "workflow"
softwareSlug: "sap2000"
keyword: "sap2000 nonlinear analysis"
slug: "sap2000-nonlinear-analysis-plastic-hinges-pdelta-cable-structures"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.csiamerica.com/products/sap2000"

---

# SAP2000 Nonlinear Analysis: Plastic Hinges, P-Delta, and Cable Structures

I'll be honest — I avoided nonlinear analysis in SAP2000 for years because I thought it was overkill for most of my projects. Then I designed a cable-stayed pedestrian bridge and realized that linear analysis just doesn't cut it when geometry changes significantly under load. P-Delta effects, plastic hinges, cable sag — these aren't theoretical concerns, they're things that make the difference between a safe design and a wrong one. Let me walk you through how I approach all three.

## Geometric Nonlinearity (P-Delta)

### What P-Delta Does

P-Delta accounts for the secondary moments caused by vertical loads acting on a displaced structure. In tall buildings, lateral loads (wind, seismic) cause horizontal displacement, and the vertical loads (gravity) create additional moments on the displaced structure.

### P-Delta Analysis Setup

1. Define > Load Cases > Add New Case
2. Set case type: Static
3. Set analysis type: Nonlinear
4. Enable P-Delta:
   - **P-Delta**: Include geometric stiffness in the analysis
   - **Large displacement**: Include full geometric nonlinearity (for very flexible structures)
5. Set initial case:
   - **None**: Start from zero
   - **Dead Load**: Use dead load as the initial P-Delta condition

### P-Delta Load Combinations

1. Run P-Delta with the dead load case first
2. Then apply live + lateral loads on top of the dead load state
3. Create a load sequence:
   - **Stage 1**: Dead Load (with P-Delta)
   - **Stage 2**: Dead + Live (with P-Delta, starting from Stage 1)
   - **Stage 3**: Dead + Live + Wind (with P-Delta, starting from Stage 2)

### When P-Delta Is Required

- Buildings taller than 50m
- Slender columns (KL/r > 100)
- Flexible structures (drift > h/500)
- Seismic design (per ASCE 7, P-Delta must be considered)
- Cable and membrane structures (always)

### P-Delta Results

Compare linear vs. P-Delta results:
1. Run the same load case with linear analysis
2. Run with P-Delta analysis
3. Compare:
   - **Displacements**: P-Delta displacements are larger
   - **Moments**: P-Delta moments are larger (secondary moments added)
   - **Forces**: P-Delta forces may redistribute
4. If P-Delta increases results by > 10%, P-Delta is significant

## Material Nonlinearity (Plastic Hinges)

### Defining Hinge Properties

1. Define > Section Properties > Hinge Properties
2. Add new hinge:

#### Moment Hinge (M3) for Beams

1. Set hinge type: M3 (moment about strong axis)
2. Set moment-rotation curve:
   - **Yield moment (My)**: My = fy × Zx (plastic section modulus)
   - **Yield rotation (θy)**: θy = My × L / (6 × E × Ix)
   - **Plastic rotation capacity**: Per ASCE 41 Table 5-6
   - **Acceptance criteria**: IO, LS, CP rotation limits
3. Set hinge location: At both ends of the member

#### Axial-Moment Hinge (P-M3) for Columns

1. Set hinge type: P-M3 (coupled axial and moment)
2. Set interaction surface:
   - **Axial yield**: Py = fy × Ag
   - **Moment yield**: My = fy × Zx
   - **Interaction**: Per AISC or ACI interaction equation
3. The hinge accounts for axial load effect on moment capacity

#### Axial Hinge (P) for Braces

1. Set hinge type: P (axial only)
2. Set axial deformation curve:
   - **Tension yield**: Py = fy × Ag
   - **Compression buckling**: Per AISC E3
   - **Post-buckling**: Strength degradation
3. Set hinge location: At midpoint of brace

### Assigning Hinges

1. Select frame elements
2. Assign > Frame > Hinges
3. Choose hinge property
4. Set location:
   - **Relative distance**: 0 (start), 0.5 (middle), 1 (end)
   - **Both ends**: Assign at 0 and 1
5. SAP2000 inserts the hinge at the specified location

### Nonlinear Static (Pushover) Analysis

1. Define > Load Cases > Add New Case
2. Set case type: Nonlinear Static
3. Set load application:
   - **Load controlled**: Apply load in increments until target
   - **Displacement controlled**: Push to a target displacement
4. Set lateral load pattern:
   - **Modal**: Proportional to first mode shape (triangular for buildings)
   - **Uniform**: Proportional to mass (uniform acceleration)
   - **Custom**: User-defined force distribution
5. Set:
   - **Number of steps**: 20-100
   - **Target displacement**: Per ASCE 41 (e.g., 1% of building height)
   - **Convergence tolerance**: 0.001

### Running Pushover

1. Analyze > Run Analysis
2. SAP2000 performs:
   - Apply gravity loads (linear)
   - Incrementally apply lateral loads
   - At each step: check for hinge formation
   - When a hinge yields: reduce stiffness, redistribute
   - Continue until target displacement or collapse
3. Results:
   - **Capacity curve**: Base shear vs. roof displacement
   - **Hinge states**: Which hinges have yielded and to what level
   - **Performance point**: Per ASCE 41 displacement coefficient method

### Interpreting Hinge Results

1. Display > Show Hinge Results
2. View hinge state on the 3D model:
   - **A-B**: Elastic (no damage)
   - **B-C**: Yielded (minor damage)
   - **C-D**: Significant strength loss (major damage)
   - **D-E**: Residual strength (near collapse)
   - **Beyond E**: Collapsed
3. Color-coded display shows performance level:
   - **Green**: IO (Immediate Occupancy) — operational
   - **Yellow**: LS (Life Safety) — safe but damaged
   - **Red**: CP (Collapse Prevention) — near collapse

## Cable Structures

### Cable Element Setup

1. Define > Section Properties > Cable Sections
2. Set:
   - **Cable diameter**: e.g., 20mm, 30mm, 50mm
   - **Number of strands**: e.g., 7, 19, 37
   - **Material**: High-strength steel (fy = 1770 MPa typical)
   - **Modulus of elasticity**: Es = 195,000 MPa (prestressing steel)
3. Cable elements are tension-only (no compression)

### Creating Cable Elements

1. Draw > Draw Cable Element
2. Click two joints to create the cable
3. Set cable section property

### Cable Pretension

1. Select cable elements
2. Assign > Cable > Target Force
3. Set target pretension force:
   - **Initial pretension**: e.g., 500 kN
   - SAP2000 adjusts the cable length to achieve the target force
4. Or use Load Cases:
   - Create a "Pretension" load case
   - Apply temperature load to shorten the cable
   - Calculate temperature change: ΔT = F / (α × E × A)

### Cable Analysis

1. Define > Load Cases > Add New Case
2. Set case type: Nonlinear Static
3. Enable:
   - **P-Delta**: Yes (cables are geometrically nonlinear)
   - **Large displacement**: Yes (cables undergo large deflections)
4. Run analysis
5. SAP2000 iterates:
   - Initial shape (catenary or straight)
   - Apply loads
   - Calculate displaced shape
   - Update geometry
   - Re-analyze with updated geometry
   - Iterate until convergence

### Cable Structure Types

#### Cable-Stayed Bridge

1. Model the bridge deck and pylons as frame elements
2. Model cables as cable elements
3. Set pretension to achieve desired deck profile
4. Analyze under dead load, live load, wind, and thermal
5. Check:
   - **Cable tensions**: All cables in tension under all load cases
   - **Deck deflections**: Within limits
   - **Pylon moments**: Within capacity

#### Tensioned Fabric Structure

1. Model support frame (masts, edge beams)
2. Model fabric as cable net or membrane elements
3. Set pretension to achieve stable form
4. Analyze under wind and snow loads
5. Check:
   - **Cable tensions**: All cables in tension
   - **Fabric stresses**: Within material capacity
   - **Support reactions**: Within foundation capacity

## Nonlinear Time History

### When to Use Nonlinear Time History

- Structures with seismic isolation (base isolators)
- Structures with viscous dampers
- Structures with buckling-restrained braces (BRBs)
- Post-earthquake damage assessment
- Performance-based seismic design

### Setup

1. Define > Load Cases > Add New Case
2. Set case type: Time History
3. Set analysis method: Direct Integration
4. Set:
   - **Time step**: 0.005-0.02 seconds
   - **Total duration**: 10-40 seconds
   - **Damping**: Rayleigh damping (5% at two target frequencies)
5. Enable:
   - **P-Delta**: Yes
   - **Large displacement**: Yes (if applicable)
   - **Nonlinear hinges**: Yes (use hinge properties)

### Running Nonlinear Time History

1. Analyze > Run Analysis
2. SAP2000 performs direct integration:
   - At each time step: assemble tangent stiffness (including hinge states)
   - Solve for displacements
   - Update hinge states
   - Move to next time step
3. Analysis time: hours for large models

### Results

1. Display > Show Plot Functions
2. View:
   - **Displacement vs. time**: Including permanent (plastic) offset
   - **Hinge rotation vs. time**: When and how much each hinge rotates
   - **Base shear vs. time**: Total shear at base
   - **Energy dissipation**: Hysteretic energy from plastic hinges
3. Compare linear vs. nonlinear:
   - Nonlinear displacements may be larger (due to softening)
   - But nonlinear forces may be smaller (due to energy dissipation)
   - This is the basis of response modification factor (R)

## Common Nonlinear Issues

### Non-Convergence

**Cause**: Hinge softening causes numerical instability.
**Fix**: Reduce step size. Use displacement control instead of load control. Check hinge properties for errors.

### Excessive Plastic Rotation

**Cause**: Hinge exceeds capacity (beyond CP).
**Fix**: Increase member size to delay hinge formation. Add bracing to reduce demand. Redesign lateral system.

### Cable Goes Slack

**Cause**: Cable tension drops to zero under certain load combinations.
**Fix**: Increase pretension. Add counter-weight. Redesign cable layout to ensure tension under all cases.

## Wrapping Up

Nonlinear analysis isn't something you need on every project, but when you do need it, SAP2000 handles it well. My advice: start with P-Delta on all your tall building projects — it's cheap to run and gives you a quick sense of whether second-order effects matter. Plastic hinges and pushover are for performance-based seismic design, and cable structures need the large displacement solver. Run the analysis, check convergence, and always verify that the results make physical sense.
