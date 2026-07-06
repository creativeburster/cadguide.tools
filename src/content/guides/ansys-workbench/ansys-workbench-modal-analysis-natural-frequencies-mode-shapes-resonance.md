---
title: "ANSYS Workbench Modal Analysis: Natural Frequencies, Mode Shapes, and Resonance Avoidance"
excerpt: "ANSYS Workbench's modal analysis calculates natural frequencies and mode shapes to identify resonance risks. I cover modal analysis setup, pre-stressed modal, mode interpretation, resonance avoidance strategies, and harmonic response for vibration design."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ANSYS Workbench modal analysis natural frequencies mode shapes resonance avoidance harmonic response vibration"
slug: "ansys-workbench-modal-analysis-natural-frequencies-mode-shapes-resonance"
author: "CAD IT Admin"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://ansyshelp.ansys.com/account/secured?returnurl=/Views/Secured/corp/v242/en/wb_wb/wb_wb.html"

---

# ANSYS Workbench Modal Analysis: Natural Frequencies, Mode Shapes, and Resonance Avoidance

I've run modal analyses on everything from rotating machinery to building structures to consumer electronics. Modal analysis is the foundation of vibration design — it tells you the natural frequencies at which a structure wants to vibrate and the mode shapes that show how it deforms at each frequency. Understanding modal results is essential for avoiding resonance, which is the leading cause of vibration-induced failures.

## What Is Modal Analysis?

Modal analysis calculates:
- **Natural frequencies**: The frequencies at which a structure vibrates freely (Hz)
- **Mode shapes**: The deformation pattern at each natural frequency
- **Effective mass**: How much mass participates in each mode
- **Participation factors**: How much each mode responds to excitation in each direction

### Why Modal Analysis Matters

Every structure has natural frequencies. If an external force (motor rotation, road vibration, wind, acoustic pressure) matches a natural frequency, **resonance** occurs — the vibration amplitude increases dramatically, potentially causing:
- Excessive noise
- Fatigue failure
- Functional failure (sensors malfunction, electronics fail)
- Catastrophic structural failure

## Setting Up a Modal Analysis

### Creating a Modal System

1. In Workbench, drag **Modal** from the Toolbox to the Project Schematic
2. Or: Right-click on an existing Static Structural → **Transfer Data to New** → **Modal** (for pre-stressed modal)
3. The Modal system appears with cells:
   - **Engineering Data**: Materials (same as static)
   - **Geometry**: CAD model (shared from static if linked)
   - **Model**: Mesh and setup
   - **Solution**: Results

### Material Properties

Modal analysis requires:
- **Young's modulus (E)**: Stiffness
- **Density (ρ)**: Mass
- **Poisson's ratio (ν)**: Lateral contraction

These are the same properties used in static analysis. If materials are already defined in Engineering Data, they carry over.

### Mesh Setup

1. Double-click the **Model** cell
2. Generate the mesh (same process as static structural)
3. Modal analysis mesh considerations:
   - **Mode shape accuracy**: The mesh must be fine enough to capture the mode shape
   - **Higher modes**: Higher frequency modes have more complex shapes — need finer mesh
   - **Lower modes**: Lower frequency modes are simpler — coarser mesh is acceptable
   - **Rule of thumb**: At least 4-6 elements per half-wave of the highest mode of interest

### Boundary Conditions

Modal analysis boundary conditions are different from static:
- **Free-free**: No constraints — the structure floats in space
  - First 6 modes are rigid body modes (0 Hz or near-zero)
  - Used for: Components in isolation, transportation analysis
- **Constrained**: Apply constraints as in static analysis
  - Fixed supports, displacements, cylindrical supports
  - Used for: Installed components, structures with known supports
- **Pre-stressed**: Apply loads from a static analysis first, then run modal
  - The stiffness changes due to the pre-load (stress stiffening)
  - Used for: Rotating machinery (centrifugal stiffening), tensioned cables, pressure vessels

### Analysis Settings

1. Click **Analysis Settings** in the tree
2. Set:
   - **Max modes to find**: Default 6, increase to 10-20 for detailed analysis
   - **Limit search**: Range of frequencies to search (e.g., 0-2000 Hz)
   - **Cluster**: For closely spaced modes
3. For pre-stressed modal:
   - **Pre-stress**: Static Structural analysis (linked)
   - The static loads are applied first, then the modal is calculated on the pre-stressed state

## Solving and Results

### Running the Analysis

1. Right-click **Solution** → **Solve**
2. Modal analysis is typically fast (eigenvalue problem)
3. Results show:
   - **Tabular data**: List of natural frequencies (Hz) for each mode
   - **Mode shapes**: Deformation pattern for each mode

### Interpreting Natural Frequencies

The results table shows:
- **Mode number**: 1, 2, 3, ...
- **Frequency (Hz)**: Natural frequency for each mode
- For free-free analysis:
  - Modes 1-6: Rigid body modes (near 0 Hz) — translation and rotation
  - Mode 7+: Flexible modes — actual vibration modes
- For constrained analysis:
  - Mode 1: First flexible mode (fundamental frequency)
  - Mode 2+: Higher modes

### Mode Shapes

1. Click a mode in the results table
2. The mode shape appears in the graphics window
3. The deformation is scaled for visibility (actual amplitude is arbitrary in modal)
4. Interpret the mode shape:
   - **Bending mode**: The structure bends in a particular direction
   - **Torsional mode**: The structure twists about an axis
   - **Axial mode**: The structure stretches and compresses along an axis
   - **Local mode**: A local feature vibrates (e.g., a panel or bracket)
5. Animate the mode shape:
   - Right-click the mode → **Animate**
   - The animation shows the oscillation pattern

### Effective Mass

1. In the results, check **Effective Mass** for each mode
2. The effective mass tells you how much mass participates in each mode
3. Rules:
   - **High effective mass (> 10% of total)**: The mode is significant — important to avoid excitation
   - **Low effective mass (< 1% of total)**: The mode is local — less critical
4. For a well-constrained model, the sum of effective masses in each direction should approach the total mass
5. If effective mass is low for all modes, increase the number of modes

### Participation Factors

1. Check **Participation Factors** for each mode
2. The participation factor shows how much the mode responds to excitation in each direction (X, Y, Z, RX, RY, RZ)
3. High participation factor in a direction means the mode is excited by forces in that direction
4. Use participation factors to identify which modes are most relevant to your loading direction

## Resonance Avoidance

### Identify Excitation Frequencies

List all excitation sources and their frequencies:
- **Motor rotation**: RPM / 60 = Hz (e.g., 3600 RPM = 60 Hz)
- **Gear meshing**: RPM × number of teeth / 60
- **Bearing frequencies**: Depends on bearing geometry (BPFI, BPFO, BSF, FTF)
- **Road/wind excitation**: Typically 1-50 Hz for vehicles
- **Acoustic excitation**: Speaker frequencies, engine noise
- **Rotating imbalance**: 1× RPM frequency

### Compare to Natural Frequencies

1. List all natural frequencies from the modal analysis
2. List all excitation frequencies
3. Check for overlap:
   - **Safe**: Excitation frequency is > 20% away from any natural frequency
   - **Marginal**: Excitation frequency is within 10-20% of a natural frequency
   - **Danger**: Excitation frequency matches a natural frequency (resonance)

### Resonance Avoidance Strategies

If an excitation frequency is near a natural frequency:

1. **Stiffen the structure**: Increase stiffness to raise the natural frequency
   - Add ribs or stiffeners
   - Increase wall thickness
   - Add support brackets
   - Use a stiffer material

2. **Add mass**: Increase mass to lower the natural frequency
   - Add mass at specific locations
   - Use a heavier material
   - Add damping mass

3. **Change the excitation frequency**: Modify the source
   - Change motor RPM
   - Change gear ratio
   - Use a different bearing
   - Add a vibration isolator

4. **Add damping**: Reduce the amplitude at resonance
   - Add damping material (constrained layer damping)
   - Use rubber isolators
   - Add viscous dampers
   - Damping doesn't change the frequency but reduces the peak amplitude

5. **Redesign**: Change the structure to move the natural frequency
   - Change the geometry
   - Move supports
   - Change the mass distribution

## Harmonic Response Analysis

For analyzing the response to a known harmonic excitation:

1. In Workbench, drag **Harmonic Response** from the Toolbox
2. Link it to the Modal analysis (Transfer Data from Modal)
3. The harmonic response uses modal results to calculate the response
4. Set up:
   - **Excitation frequency range**: e.g., 0-2000 Hz
   - **Number of solution points**: e.g., 200
   - **Damping ratio**: e.g., 0.01 (1% modal damping)
5. Apply harmonic loads:
   - **Force**: Magnitude and direction (applied sinusoidally)
   - **Base excitation**: Ground motion (acceleration, velocity, displacement)
6. Solve
7. Results:
   - **Frequency response plot**: Amplitude vs. frequency
   - **Phase response**: Phase angle vs. frequency
   - **Peak amplitude**: Maximum response at resonance
   - **Peak frequency**: Frequency at which the peak occurs

### Interpreting Harmonic Response

- **Peaks in the response**: Occur near natural frequencies (resonance)
- **Peak amplitude**: Depends on damping — more damping = lower peak
- **Off-resonance**: Amplitude is much lower — the structure is stiff enough to resist
- **Bandwidth**: Width of the peak — wider = more damping
- Use the frequency response to verify that the operating frequency is away from peaks

## Common Issues

### First Mode Is Near Zero (Constrained Analysis)

- Check that constraints are properly applied
- Verify there are no unconstrained parts
- Look for parts that are only constrained by contact (may separate)
- Ensure the constraint prevents all rigid body motion

### Mode Shapes Are Unclear

- Increase the number of modes
- Check the mesh refinement — coarse mesh may not capture complex mode shapes
- Animate the mode to see the motion pattern
- Look at the effective mass — low effective mass modes may be local vibrations

### Natural Frequencies Are Wrong

- Verify material properties (E, density, ν)
- Check constraint setup — different constraints give different frequencies
- Verify the geometry matches the real structure (simplifications can change frequencies)
- Check units consistency

### Harmonic Response Shows No Peaks

- Check that the excitation frequency range covers the natural frequencies
- Verify the damping ratio is not too high
- Ensure the load is applied in a direction that excites the mode (check participation factors)
- Check that the modal analysis found enough modes

## Summary

ANSYS Workbench's modal analysis calculates natural frequencies and mode shapes to identify resonance risks. Set up the modal system with correct materials (E, density, ν) and mesh (fine enough to capture mode shapes). Choose boundary conditions: free-free for isolated components, constrained for installed components, or pre-stressed for loaded structures. Find 6-20 modes and check the frequency table. Interpret mode shapes (bending, torsional, axial, local) and check effective mass to identify significant modes. Compare natural frequencies to excitation frequencies (motor RPM, gear mesh, road vibration) — a 20% margin is safe. Avoid resonance by stiffening (raise frequency), adding mass (lower frequency), changing the excitation, adding damping, or redesigning. Run harmonic response analysis to calculate the amplitude vs. frequency curve and verify peak amplitudes are acceptable. The most common issues — zero-frequency modes, unclear shapes, and wrong frequencies — are addressed by checking constraints, refining the mesh, and verifying material properties.
