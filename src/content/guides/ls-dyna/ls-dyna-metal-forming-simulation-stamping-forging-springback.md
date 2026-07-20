---
title: "LS-DYNA Metal Forming Simulation: Stamping, Forging, and Springback Analysis"
excerpt: "A guide to metal forming simulation in LS-DYNA covering sheet metal stamping setup, tool definition (die, punch, binder), adaptive meshing, forming limit diagrams, springback prediction with implicit solver, and process optimization."
category: "workflow"
softwareSlug: "ls-dyna"
keyword: "ls-dyna metal forming simulation"
slug: "ls-dyna-metal-forming-simulation-stamping-forging-springback"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://lsdyna.ansys.com/manuals/"
  - "https://www.dynasupport.com/tutorial/metal-forming"
---

# LS-DYNA Metal Forming Simulation: Stamping, Forging, and Springback Analysis

Metal forming simulation saved my neck on a project once — we had a bracket that kept tearing during stamping, and the die shop was getting frustrated with trial and error. I ran the simulation in LS-DYNA, found the problem was insufficient binder force in one area, and the next die tryout worked. That's when I became a believer. Let me walk you through how I set up stamping simulations and predict springback.

## Forming Process Overview

### Sheet Metal Stamping

1. **Tools**: Die (lower), Punch (upper), Binder/Blankholder (holds sheet edge)
2. **Process**:
   - Blank placed on die
   - Binder closes and applies holding force
   - Punch descends, forming sheet into die cavity
3. **Challenges**:
   - **Wrinkling**: Excess material compresses (insufficient binder force)
   - **Tearing**: Material stretches beyond forming limit (excessive binder force or deep draw)
   - **Springback**: Part elastically recovers after tool release
   - **Thinning**: Material thins at high-strain regions

## Model Setup

### Blank (Sheet Metal)

1. *PART: Blank
2. Elements: *ELEMENT_SHELL (Belytschko-Tsay, ELFORM 2)
3. Material: *MAT_PIECEWISE_LINEAR_PLASTICITY (MAT_024)
   - **RO**: Density (7.85×10⁻⁶ kg/mm³ for steel)
   - **E**: Young's modulus (210 GPa)
   - **PR**: Poisson's ratio (0.3)
   - **SIGY**: Yield stress (e.g., 180 MPa for DC04 steel)
   - **ET**: Tangent modulus (e.g., 800 MPa)
   - **LCSS**: Load curve for true stress-strain
4. Thickness: 0.8-2.5mm (typical auto body)
5. Integration points: 5 (through thickness, for accurate bending)

### Stress-Strain Curve

1. *DEFINE_CURVE:
   - True stress vs. true plastic strain
   - Example (DC04 steel):

| Plastic Strain | True Stress (MPa) |
|----------------|-------------------|
| 0.000 | 180 |
| 0.020 | 320 |
| 0.050 | 380 |
| 0.100 | 430 |
| 0.200 | 480 |
| 0.400 | 540 |
| 0.600 | 580 |

2. Must use true stress and true strain (not engineering)
3. Convert: σtrue = σeng(1+εeng), εtrue = ln(1+εeng)

### Tools (Die, Punch, Binder)

1. *PART: Die, Punch, Binder
2. Elements: *ELEMENT_SHELL (rigid)
3. Material: *MAT_RIGID (MAT_020)
   - Tools are rigid (no deformation)
   - Faster computation
4. Tool geometry:
   - **Die**: Lower tool with cavity
   - **Punch**: Upper tool that forms the sheet
   - **Binder**: Ring that holds blank edge
5. Tool mesh:
   - Fine enough to capture tool geometry
   - Coarser than blank mesh (rigid, no accuracy concern)

### Contact

1. *CONTACT_FORMING_SURFACE_TO_SURFACE:
   - **Blank to die**: Contact between sheet and die
   - **Blank to punch**: Contact between sheet and punch
   - **Blank to binder**: Contact between sheet and binder
2. Friction:
   - **FS (static)**: 0.12 (typical for steel-steel with lubrication)
   - **FD (dynamic)**: 0.10
3. Contact formulation:
   - **Constraint method**: For forming (more accurate than penalty)
   - Or **Soft penalty**: For complex geometry

## Adaptive Meshing

### Why Adaptive Meshing?

1. During forming, blank deforms significantly
2. Initial mesh may be too coarse in high-strain regions
3. Adaptive meshing refines where needed:
   - **Split elements**: Divide one element into 4 (2D) or 8 (3D)
   - **Based on angle**: Refine when element angle exceeds threshold

### Setup

1. *CONTROL_ADAPTIVE:
   - **ADPTIME**: Time interval for adaptation (e.g., 0.001s)
   - **ADPOPT**: Adaptivity option (1 = angle-based)
   - **ADPASS**: Maximum number of adaptation passes (3-5 typical)
   - **ADPEN**: Angle threshold for refinement (7-10 degrees)
2. *PART:
   - **ADPOPT**: 1 (enable adaptivity for blank part)
3. Results:
   - Mesh refines in high-strain regions (corners, draw beads)
   - Mesh stays coarse in low-strain regions (flat areas)
   - Total element count increases (check memory)

## Forming Simulation

### Step 1: Gravity Loading

1. Apply gravity to blank (settles onto die)
2. *LOAD_BODY_Y (gravity in -Y direction)
3. Duration: 0.01s (short, just to settle)
4. Damping: *DAMPING_GLOBAL (to prevent oscillation)

### Step 2: Binder Close

1. Move binder down to close on blank
2. *BOUNDARY_PRESCRIBED_MOTION (binder, Y-direction, velocity)
3. Binder velocity: 1-5 m/s (typical)
4. Binder force: 100-500 kN (typical for auto body panels)
5. Duration: 0.05-0.1s

### Step 3: Punch Stroke

1. Move punch down to form blank
2. *BOUNDARY_PRESCRIBED_MOTION (punch, Y-direction, velocity)
3. Punch velocity: 1-10 m/s (scaled for simulation speed)
4. Stroke depth: Per part geometry (e.g., 100mm for deep draw)
5. Duration: 0.05-0.2s
6. Check:
   - **Wrinkling**: Look for out-of-plane waves
   - **Tearing**: Check for element failure (if erosion enabled)
   - **Thinning**: Check thickness reduction

### Step 4: Springback

1. Remove tools (release blank)
2. Switch to implicit solver for springback:
   - *CONTROL_IMPLICIT_GENERAL
   - **IMFLAG**: 1 (enable implicit)
   - **DT0**: Initial time step (0.01s)
   - **TTF**: Termination time (0.1s)
3. Or use dynamic relaxation:
   - *CONTROL_DYNAMIC_RELAXATION
   - Damps out vibrations to find static equilibrium
4. Springback results:
   - **Displacement**: Difference between formed shape and final shape
   - **Typical**: 1-5mm (auto body panels)
   - **Compensation**: Adjust tool geometry to compensate for springback

## Forming Limit Diagram (FLD)

### What is FLD?

1. FLD shows whether a forming process is safe or will fail
2. Plot: Major strain (ε1) vs. minor strain (ε2)
3. Regions:
   - **Safe zone**: Below FLC (Forming Limit Curve)
   - **Marginal zone**: Between FLC and 10% below
   - **Failure zone**: Above FLC (tearing expected)
   - **Wrinkle zone**: Negative major strain with positive minor strain

### FLD in LS-DYNA

1. *MAT_FORMING_LIMIT_DIAGRAM (add to material):
   - **LCID**: Load curve for FLC (forming limit curve)
2. FLC (Keeler-Brazier approximation):
   - FLC = (23.3 + 14.13 × t) × n / 0.21 (for steel)
   - t: Sheet thickness (mm)
   - n: Strain hardening exponent
3. Post-processing:
   - LS-PrePost > FLD > Plot
   - Each element plotted as point (ε1, ε2)
   - Color: Green (safe), yellow (marginal), red (failure)

### FLD Evaluation

1. **Safe (green)**: All elements below FLC → part can be formed
2. **Marginal (yellow)**: Some elements near FLC → risk of tearing
3. **Failure (red)**: Elements above FLC → part will tear → redesign needed
4. Fix for failure:
   - **Increase binder force**: Reduces material flow (less thinning)
   - **Decrease binder force**: Allows more material flow (less stretching)
   - **Add draw bead**: Controls material flow locally
   - **Modify tool geometry**: Increase radii, reduce depth
   - **Change material**: Higher formability grade

## Thinning Analysis

1. Check thickness after forming:
   - LS-PrePost > Fcomp > Thickness
   - Color contour of thickness distribution
2. Thinning limits:
   - **Safe**: Thinning < 20% (e.g., 1.0mm → 0.8mm)
   - **Marginal**: 20-25% thinning
   - **Failure**: > 25% thinning (risk of splitting)
3. High-thinning regions:
   - Corners and radii (stretch bending)
   - Deep draw areas (punch nose)
   - Wall corners (side wall curl)

## Springback Compensation

### Springback Prediction

1. After forming and tool release:
   - Part elastically recovers (springback)
   - Typical: 1-5mm for auto body panels
   - More for high-strength steel (HSS) and advanced HSS
2. Measure springback:
   - Compare formed shape to final shape
   - Plot: Displacement vector from formed to final
   - Check: At critical dimensions (trim, mating surfaces)

### Compensation Method

1. **Iterative compensation**:
   - Step 1: Simulate forming → get springback
   - Step 2: Modify tool geometry (add springback in opposite direction)
   - Step 3: Re-simulate → check if springback is reduced
   - Step 4: Iterate until part is within tolerance
2. **LS-DYNA tool**: *CONTROL_SPRINGBACK_COMPENSATION
   - Automatically adjusts tool geometry
   - Iterative process (3-5 iterations typical)

## Process Parameters

### Binder Force

1. **Too low**: Wrinkling (material flows freely)
2. **Too high**: Tearing (material can't flow, stretches)
3. **Optimal**: Just enough to prevent wrinkling without tearing
4. Typical: 100-500 kN for auto body panels
5. Optimization: Run multiple simulations with different binder forces

### Friction

1. **Lubricated**: μ = 0.10-0.15 (with drawing oil)
2. **Dry**: μ = 0.20-0.30 (no lubrication)
3. Higher friction → more stretching → more thinning
4. Lower friction → more sliding → more material flow
5. *CONTACT: FS (static friction), FD (dynamic friction)

### Punch Speed

1. **Physical speed**: 0.1-0.5 m/s (actual press speed)
2. **Simulation speed**: 1-10 m/s (scaled for efficiency)
3. Check: Kinetic energy < 5% of internal energy (quasi-static)
4. If KE is significant: Reduce punch speed or add mass scaling

## Verification Checklist

- [ ] Material stress-strain curve uses true stress and true strain
- [ ] Sheet thickness and integration points are correct (5 recommended)
- [ ] Tools are rigid with correct geometry
- [ ] Contact includes all tool-blank interfaces
- [ ] Friction coefficients match lubrication condition
- [ ] Adaptive meshing is enabled (for blank)
- [ ] Gravity loading is applied before forming
- [ ] Binder force is appropriate (no wrinkling or tearing)
- [ ] FLD shows all elements in safe or marginal zone
- [ ] Thinning is within 20% limit
- [ ] Springback is predicted and compensated
- [ ] Energy balance: KE < 5% of IE (quasi-static)

## Wrapping Up

The two things I always check after a forming simulation: the FLD (forming limit diagram) and the thinning distribution. If any elements are in the red zone on the FLD, the part will tear — you need to adjust binder force, add draw beads, or change the material grade. For springback, I always run the implicit solver after the explicit forming step — it's much more stable than dynamic relaxation. And if you're working with high-strength steel, expect more springback than you think. I've seen parts spring back 5mm more than predicted because the material model didn't capture the Bauschinger effect properly.
