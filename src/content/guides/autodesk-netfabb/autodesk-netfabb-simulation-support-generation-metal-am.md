---
title: "Autodesk Netfabb Simulation and Support Generation for Metal Additive Manufacturing"
excerpt: "Metal AM requires simulation to predict thermal distortion and support structures to anchor parts to the build plate. We cover Netfabb's thermal simulation workflow, support generation for SLM/DMLS, build preparation for metal AM, and distortion compensation strategies."
category: "workflow"
softwareSlug: "autodesk-netfabb"
keyword: "Autodesk Netfabb simulation support generation metal additive manufacturing SLM DMLS distortion"
slug: "autodesk-netfabb-simulation-support-generation-metal-am"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://www.autodesk.com/products/netfabb/overview"
  - "https://www.tpm.com/blog/autodesk-netfabb-the-complete-solution-for-3d-printing-preparation/"
  - "https://www.autodesk.com/products/netfabb/overview"
---

# Autodesk Netfabb Simulation and Support Generation for Metal Additive Manufacturing

We've prepared metal AM parts using Netfabb's simulation and support generation tools for SLM and DMLS printers. Metal additive manufacturing is far less forgiving than polymer 3D printing — thermal gradients cause distortion, unsupported overhangs lead to build failures, and residual stress can crack parts during or after printing. Netfabb's simulation and support tools (available in Premium and Ultimate) are designed to address these challenges.

## Why Metal AM Needs Simulation

During metal AM (SLM, DMLS, EBM), each layer of metal powder is melted by a laser or electron beam. The rapid heating and cooling creates:

- **Thermal gradients**: Temperature differences between the melt pool and surrounding material
- **Residual stress**: Internal stresses that build up layer by layer
- **Distortion**: The part warps and curls as stresses accumulate
- **Build failure**: Severe distortion can cause the recoater blade to crash into the part

Simulation predicts these effects before printing, allowing you to:

- Compensate for distortion by pre-distorting the CAD model
- Identify areas that need additional supports
- Optimize part orientation for minimal thermal stress
- Reduce the number of failed builds

## Netfabb Thermal Simulation Workflow

### Step 1: Import and Repair

1. Import the STL or 3MF file
2. Run mesh repair to ensure the model is watertight
3. Verify the mesh has no errors

### Step 2: Orient the Part

1. Orient the part for metal AM:
   - Minimize overhangs >45° (metal AM needs supports for steeper overhangs than polymer)
   - Large flat surfaces should be tilted to reduce thermal stress
   - Critical surfaces should face up or sideways
2. Use automatic orientation or manual rotation

### Step 3: Generate Supports

1. Go to **Supports** → **Generate Supports**
2. Configure support parameters:
   - **Support Type**: Block, tree, contour, or point supports
   - **Support Angle**: Threshold for support generation (typically 45° for metal AM)
   - **Support Thickness**: Usually 0.5-1mm for metal supports
   - **Contact Area**: Points of contact between support and part
3. Netfabb generates supports automatically
4. Manually add or remove supports as needed
5. Supports serve two purposes in metal AM:
   - **Anchoring**: Hold the part to the build plate against thermal forces
   - **Heat conduction**: Draw heat away from the part to reduce thermal gradients

### Step 4: Configure Simulation

1. Go to **Simulation** → **New Simulation**
2. Set process parameters:
   - **Material**: Select from Netfabb's material library (Ti6Al4V, Inconel 718, AlSi10Mg, etc.)
   - **Layer Thickness**: Must match the actual print layer height
   - **Laser Power**: Match the printer's process parameters
   - **Scan Speed**: Match the printer's process parameters
   - **Scan Strategy**: Stripe, chessboard, or contour
3. Set boundary conditions:
   - **Build plate temperature**: Typically 100-200°C for metal AM
   - **Base plate constraint**: How the part is anchored

### Step 5: Run Simulation

1. Click **Run Simulation**
2. Netfabb performs a thermo-mechanical simulation
3. The simulation calculates:
   - Temperature distribution at each layer
   - Residual stress accumulation
   - Final distortion shape
4. Simulation time ranges from minutes (simple parts) to hours (complex parts)

### Step 6: Analyze Results

1. View the **distortion map**: Shows where and how much the part will deform
2. View the **stress map**: Shows areas of high residual stress
3. Identify problem areas:
   - Red zones indicate excessive distortion (>0.5mm typically)
   - High-stress areas may need additional supports
   - Corners and thin walls are typical problem zones

### Step 7: Distortion Compensation

If the simulation shows unacceptable distortion:

1. Use **Compensate Distortion** to pre-distort the CAD model
2. Netfabb applies the inverse of the predicted distortion
3. When printed, the part distorts back toward the intended shape
4. Re-run simulation to verify the compensated part meets tolerances
5. Iterate if needed — sometimes 2-3 compensation cycles are required

## Support Types for Metal AM

### Block Supports

- Grid-like structures under overhangs
- Good for flat horizontal surfaces
- Easy to remove with hand tools
- Provide good heat conduction

### Tree Supports

- Branching structures that grow from the build plate
- Good for complex geometries with isolated overhangs
- Less material than block supports
- Harder to remove, may leave marks on the part

### Contour Supports

- Follow the outline of the part
- Good for thin walls and curved surfaces
- Provide uniform support along edges
- Often combined with block supports

### Point Supports

- Minimal contact points
- Used for small isolated features
- Easy to remove
- Limited heat conduction

## Support Optimization

### Minimizing Support Volume

Supports in metal AM are expensive — they use costly metal powder and require machining to remove. To minimize supports:

1. **Optimize orientation**: Rotate the part to reduce overhangs
2. **Use self-supporting angles**: Metal AM can typically print up to 45° without supports
3. **Design for AM**: Modify the CAD model to eliminate overhangs
4. **Use thermal supports**: Small supports that only conduct heat, not structural support
5. **Segment the part**: Split into pieces that print without supports, then assemble

### Support Removal

- **Block supports**: Remove with band saw or hand tools
- **Tree supports**: Cut at the base with pliers
- **Contour supports**: File or machine off
- **Point supports**: Break off by hand
- All support contact points need machining or polishing for surface finish

## Common Metal AM Issues

### Part Detaches from Build Plate

- Add more anchor supports at the base
- Increase support contact area
- Ensure build plate is properly preheated
- Check for warping in the first layers

### Distortion Exceeds Tolerance

- Run simulation and apply distortion compensation
- Add supports in high-distortion areas
- Change orientation to reduce thermal gradients
- Reduce layer thickness for more uniform heating

### Surface Finish Poor on Downward Faces

- This is expected in metal AM — downward faces are always rougher
- Add machining allowance (1-2mm) on surfaces that need smooth finish
- Orient critical surfaces upward or sideways
- Use contour supports for better surface quality on supported faces

### Build Failure (Recoater Crash)

- The part warped upward and hit the recoater blade
- Add more supports in the warping area
- Reduce thermal gradients (lower laser power, slower scan speed)
- Use simulation to predict and prevent warping
- Consider segmenting the part

## Summary

Metal AM requires simulation and support generation to produce successful builds. Netfabb's simulation workflow (Premium/Ultimate) predicts thermal distortion and residual stress before printing. Generate supports first, then run simulation, analyze the distortion map, and apply distortion compensation if needed. Metal AM supports serve dual purposes — structural anchoring and heat conduction. Minimize support volume through orientation optimization and design-for-AM principles. The most common issues — part detachment, distortion, and recoater crashes — are preventable with proper simulation and support placement. Always iterate: simulate, compensate, re-simulate until the predicted distortion is within tolerance.
