---
title: "ANSYS Modal and Harmonic Analysis: Natural Frequencies, Vibration, and Resonance"
excerpt: "A guide to modal and harmonic analysis in ANSYS Workbench covering natural frequency extraction, mode shape evaluation, harmonic response to rotating machinery, resonance avoidance, and PSD random vibration analysis."
category: "workflow"
softwareSlug: "ansys-workbench"
keyword: "ansys modal harmonic analysis vibration"
slug: "ansys-modal-harmonic-analysis-natural-frequencies-vibration-resonance"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.ansys.com/products/structures"
  - "https://ansyshelp.ansys.com/"
---

# ANSYS Modal and Harmonic Analysis: Natural Frequencies, Vibration, and Resonance

Modal analysis determines natural frequencies and mode shapes — the fundamental vibration characteristics of any structure. Harmonic analysis predicts response to sinusoidal excitation. Together, they are essential for rotating equipment, bridges, buildings, and any structure subject to dynamic loads.

## Modal Analysis

### Setup

1. Drag "Modal" to Project Schematic
2. Import geometry and assign materials
3. Define boundary conditions (supports only — no loads in modal)
4. Set number of modes: 6-20 (typical)

### Pre-Stressed Modal

1. Link Static Structural solution to Modal setup
2. Modal analysis includes pre-stress effects:
   - **Tension stiffening**: Increases natural frequency (e.g., guitar string)
   - **Compression softening**: Decreases natural frequency (e.g., column)
   - **Spin softening**: For rotating structures (e.g., turbine blade)

### Solver Options

1. Analysis Settings:
   - **Solver type**: 
     - **Block Lanczos**: Default, fast for most problems
     - **PCG Lanczos**: For large models with many modes
     - **Unsymmetric**: For non-symmetric matrices (fluid-structure)
     - **Damped**: For damped modal analysis
   - **Max modes to find**: 6-20
   - **Frequency range**: 0-10000 Hz (limit search range)

### Running Modal Analysis

1. Solve
2. Results:
   - **Frequencies**: Listed in Hz (cycles per second)
   - **Mode shapes**: Deformation pattern for each mode
   - **Participation factors**: How much each mode contributes in each direction
   - **Effective mass**: Mass participating in each mode

### Interpreting Results

#### Frequency Table

| Mode | Frequency (Hz) | Direction | Description |
|------|---------------|-----------|-------------|
| 1 | 12.5 | Y (vertical) | First bending |
| 2 | 31.2 | X (lateral) | First lateral |
| 3 | 45.8 | Z (torsional) | First torsion |
| 4 | 78.3 | Y (vertical) | Second bending |
| 5 | 95.1 | X (lateral) | Second lateral |
| 6 | 112.4 | Y+Z (coupled) | Bending-torsion |

#### Mode Shape Evaluation

1. Insert > Total Deformation (for each mode)
2. View mode shape:
   - **Bending mode**: Deflection in one direction
   - **Torsional mode**: Twisting about an axis
   - **Axial mode**: Extension/compression
   - **Coupled mode**: Combination of above
3. Identify critical modes:
   - Modes in the direction of expected excitation
   - Modes with high effective mass

#### Effective Mass Check

1. Check effective mass per mode:
   - Sum of effective mass should be ≥ 90% of total mass
   - If not: extract more modes
2. High effective mass = important mode for dynamic response

### Mass Participation

| Mode | Frequency (Hz) | Eff. Mass X (kg) | Eff. Mass Y (kg) | Eff. Mass Z (kg) |
|------|---------------|-----------------|-----------------|-----------------|
| 1 | 12.5 | 0.1 | 4500 | 0.2 |
| 2 | 31.2 | 4200 | 0.5 | 0.1 |
| 3 | 45.8 | 0.2 | 0.3 | 3800 |
| Total | - | 4203 | 4503 | 3803 |

Total mass = 5000 kg. Y-direction participation = 90% (good). Extract more modes if < 90%.

## Harmonic Analysis

### Setup

1. Drag "Harmonic Response" to Project Schematic
2. Link Modal solution to Harmonic setup (for mode-superposition method)
3. Or use "Full" method (direct solution, slower but more accurate)

### Analysis Settings

1. Set:
   - **Frequency range**: 0-200 Hz (must cover modes of interest)
   - **Number of intervals**: 100-500 (resolution of frequency sweep)
   - **Method**: 
     - **Mode Superposition**: Fast, uses modal results
     - **Full**: Direct harmonic solution, includes all modes
   - **Constant or proportional damping**: 
     - **Constant damping ratio**: 2-5% (typical for steel)
     - **Proportional damping (Rayleigh)**: α and β coefficients

### Damping

1. **Modal damping ratio (ζ)**:
   - Steel structures: 0.5-2%
   - Concrete structures: 2-5%
   - Bolted joints: 3-7%
   - Welded joints: 1-3%
   - Composite structures: 2-5%

2. **Rayleigh damping**:
   - C = α × M + β × K
   - α: Mass-proportional (low frequency damping)
   - β: Stiffness-proportional (high frequency damping)
   - Calculate from two frequencies and damping ratios:
     - α = 2 × ζ × ω1 × ω2 / (ω1 + ω2)
     - β = 2 × ζ / (ω1 + ω2)

### Harmonic Load

1. Insert > Force (or Displacement, Pressure)
2. Set:
   - **Magnitude**: Amplitude (e.g., 1000 N)
   - **Phase angle**: 0° (in-phase) or specified
   - **Frequency**: Swept across specified range

### Rotating Machinery Excitation

1. For unbalanced rotor:
   - Force = m × e × ω²
   - m: Unbalanced mass (kg)
   - e: Eccentricity (m)
   - ω: Rotational speed (rad/s) = 2π × RPM / 60
2. Example:
   - m = 0.1 kg, e = 0.01m, RPM = 3000
   - F = 0.1 × 0.01 × (2π × 3000/60)² = 987 N
3. Apply as rotating force:
   - FX = F × cos(ωt)
   - FY = F × sin(ωt)

### Results

#### Frequency Response Plot

1. Insert > Frequency Response
2. Select a vertex or face
3. Set:
   - **Variable**: Displacement, velocity, or stress
   - **Direction**: X, Y, or Z
4. View:
   - **Amplitude vs. frequency**: Peak at resonance
   - **Phase vs. frequency**: Phase shift at resonance

#### Resonance Identification

1. Peaks in frequency response = resonance
2. Compare peak frequencies to modal frequencies:
   - Should match (within damping bandwidth)
   - If not: check damping and excitation direction

#### Stress at Resonance

1. Insert > Equivalent Stress
2. Set frequency to resonant frequency
3. View stress distribution at resonance
4. Check:
   - **Fatigue**: Alternating stress at resonance (may cause failure)
   - **Yield**: Peak stress at resonance (may cause permanent deformation)

## Random Vibration (PSD) Analysis

### Setup

1. Drag "Random Vibration (PSD)" to Project Schematic
2. Link Modal solution to PSD setup
3. Requires modal analysis with sufficient modes

### PSD Input

1. Insert > PSD Base Excitation
2. Set:
   - **PSD type**: Acceleration, velocity, or displacement
   - **Direction**: X, Y, or Z
   - **PSD table**: Frequency vs. PSD value (g²/Hz)

#### Typical PSD Spectra

**Transportation (ASTM D4169)**:
| Frequency (Hz) | PSD (g²/Hz) |
|----------------|-------------|
| 1 | 0.0001 |
| 10 | 0.01 |
| 40 | 0.01 |
| 100 | 0.001 |
| 200 | 0.001 |

**Earthquake (El Centro)**:
| Frequency (Hz) | PSD (g²/Hz) |
|----------------|-------------|
| 0.5 | 0.005 |
| 2 | 0.05 |
| 5 | 0.02 |
| 10 | 0.005 |
| 25 | 0.001 |

### Results

1. **1σ (1 standard deviation)**: 68.3% probability
2. **3σ**: 99.7% probability
3. Insert > Directional Deformation (1σ)
4. Insert > Equivalent Stress (1σ)
5. For design:
   - Use 3σ values for conservative design
   - σ3σ = 3 × σ1σ

## Resonance Avoidance

### Frequency Separation

1. Identify excitation frequencies:
   - **Rotating equipment**: f = RPM / 60
   - **Blade passing**: f = RPM × Nblades / 60
   - **AC frequency**: 50 or 60 Hz
   - **Wind vortex shedding**: f = St × V / D
2. Compare to natural frequencies:
   - **Safe separation**: fnat / fexc > 1.5 or fnat / fexc < 0.67
   - If within ±20%: resonance risk

### Design Modifications

If natural frequency is too close to excitation:
1. **Increase stiffness**: Add material, increase section, add bracing
   - fnat ∝ √(k/m) — increasing k raises fnat
2. **Reduce mass**: Remove material (if strength permits)
   - fnat ∝ √(k/m) — decreasing m raises fnat
3. **Add damping**: Dampers, viscoelastic materials, friction joints
   - Reduces resonance amplitude
4. **Change excitation**: Change RPM, add variable frequency drive
5. **Detune**: Modify geometry to shift natural frequency away from excitation

## Verification Checklist

- [ ] Boundary conditions match actual support conditions
- [ ] Mass is correctly distributed (density and geometry)
- [ ] Number of modes captures 90%+ effective mass
- [ ] Frequency range covers expected excitation frequencies
- [ ] Damping values are realistic for the structure type
- [ ] Harmonic load magnitude and direction are correct
- [ ] No resonance within ±20% of excitation frequency
- [ ] Stress at resonance is below fatigue limit
- [ ] PSD spectrum matches expected environment
- [ ] 3σ stress is below yield for random vibration

## Common Vibration Issues

### Missing Modes

**Symptom**: Effective mass < 90% of total mass.
**Fix**: Extract more modes. Check for rigid body modes (should be ~0 Hz if free-free).

### Resonance at Operating Speed

**Symptom**: Natural frequency matches excitation frequency.
**Fix**: Increase stiffness (raise fnat) or reduce mass (raise fnat) or add damping (reduce amplitude) or change operating speed.

### Excessive Vibration Amplitude

**Symptom**: Displacement at resonance exceeds allowable.
**Fix**: Add damping (most effective at resonance). Increase stiffness (shifts resonance and reduces amplitude). Reduce excitation force.

### PSD Stress Exceeds Yield

**Symptom**: 3σ stress > yield strength.
**Fix**: Increase stiffness or strength. Add damping. Redesign to reduce stress concentration at high-stress modes.

## Conclusion

ANSYS modal and harmonic analysis provides comprehensive vibration analysis: modal analysis for natural frequencies and mode shapes, harmonic response for sinusoidal excitation, and PSD analysis for random vibration. The key to vibration analysis is extracting enough modes (90%+ effective mass), applying realistic damping, and ensuring no natural frequency is within ±20% of any excitation frequency. For rotating equipment, the harmonic analysis directly predicts the response to unbalance forces, while PSD analysis handles random environments like transportation and earthquakes. By following this workflow, engineers can identify and avoid resonance, predict vibration amplitudes, and design structures that perform reliably under dynamic loads.
