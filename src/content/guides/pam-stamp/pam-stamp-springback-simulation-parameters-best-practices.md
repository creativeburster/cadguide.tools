---
title: "PAM-STAMP Springback Simulation: Mesh Size, Integration Points, Damping Value, and Material Model Selection for High-Strength Steel"
excerpt: "Springback prediction accuracy in PAM-STAMP depends on four sensitive parameters: nodal damping value, integration point count, blank mesh size, and material hardening model. We cover recommended values from NUMISHEET benchmarks and the Yoshida-Uemori kinematic hardening model for 980MPa HSS."
category: "best-practices"
softwareSlug: "pam-stamp"
keyword: "PAM-STAMP springback simulation mesh size integration points damping Yoshida-Uemori high strength steel"
slug: "pam-stamp-springback-simulation-parameters-best-practices"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.sciencedirect.com/science/article/abs/pii/S0924013604003577"
  - "https://technicalgamer.org/how-to-save-time-and-monitor-simulation-in-pamstamp/"
  - "https://d31iavc9x2wkmf.cloudfront.net/software/pamstamp-features/springback-khm/"
---

# PAM-STAMP Springback Simulation: Mesh Size, Integration Points, Damping Value, and Material Model Selection for High-Strength Steel

Springback prediction is one of the most difficult aspects of sheet metal forming simulation. The residual stresses locked into the sheet during stamping drive elastic recovery when the tool is removed — and small errors in stress prediction during forming propagate into large springback errors. PAM-STAMP's explicit springback solver is sensitive to four parameters that research from NUMISHEET benchmarks has quantified.

## Why Springback Prediction Is Hard

Two solver approaches exist for springback:

- **Implicit solution**: Applies reverse nodal force with equivalent iteration. For complex parts, local loading during overall unloading creates material non-linearity, and large springback displacements create geometric non-linearity. Both cause convergence problems. When the forming stress field is inaccurate, convergence becomes worse.
- **Explicit solution**: Damps the stress field dynamically. No convergence problem, but requires more CPU time and a reasonable nodal damping value that cannot be known beforehand.

PAM-STAMP uses the explicit approach for springback, making parameter selection critical.

## Parameter 1: Nodal Damping Value

The damping value controls how quickly the explicit springback simulation settles to equilibrium.

- **Too large**: Simulation settles too quickly, may not reach true equilibrium — inaccurate springback
- **Too small**: Simulation takes excessive CPU time, may not complete within practical timeframes
- **Recommended**: A **pre-simulation** is usually needed to obtain a suitable damping value. Run a short test, observe the kinetic energy decay, and adjust.

There is no universal value — it depends on the material, part geometry, and stress state. The pre-simulation approach is the only reliable method.

## Parameter 2: Integration Points

Through-thickness integration points determine how accurately the stress distribution across the sheet thickness is captured.

| Integration Points | Effect |
|--------------------|--------|
| Too few | Poor stress distribution representation → inaccurate springback |
| Too many | Excessive computation time, potential numerical noise |
| **7 (recommended)** | Best balance of accuracy and efficiency for explicit springback |

Research on the NUMISHEET'93 U-bending benchmark found that **seven integration points** is the optimal value for the explicit solution in springback simulation. Both too many and too few points degrade accuracy.

## Parameter 3: Blank Mesh Size

Mesh size is the most sensitive parameter in springback simulation.

### General Rules

- **Mesh size ≈ 2× the sliding fillet radius** — a starting point for tool mesh
- **Final element size < radius of sliding fillet** — ensures the contact behavior is captured
- **For springback specifically**: Element size should be **< 25% of (fillet radius + half of blank thickness)**

### Mesh Strategy in PAM-STAMP

For springback calculation, the recommended mesh settings are:

| Parameter | Springback Strategy | Compensation Strategy |
|-----------|--------------------|-----------------------|
| Max angle between adjacent elements | 7.5° | 7.5° |
| Max element size on blank | 10 mm | 10 mm |
| Max element size on tools | 30 mm (rough) | 10 mm (fine) |

### Adaptive Refinement

Use **Automatic Refinement: Sliding Radius = 4** (or the smallest radius on the stamping) for adaptive meshing. The condition is that the deformed element size must be less than 25% of the total drawing radius plus half the sheet thickness.

If the blank elongates significantly during sliding, start with a finer mesh to maintain accuracy throughout deformation.

## Parameter 4: Material Model Selection

### Isotropic vs. Kinematic Hardening

Conventional isotropic hardening models **cannot accurately predict springback** because they don't capture the Bauschinger effect — the asymmetric stress response during load reversal that occurs when sheet metal is bent and then unbent.

### Yoshida-Uemori (Y-U) Kinematic Hardening Model

The Y-U model is the best kinematic hardening model for sheet metal forming because:

1. **Only 7 parameters** of cyclic plasticity, each with a physical definition — no artificial mathematical parameters
2. **Young's modulus depends on plastic strain** — describes stress-strain response after stress reversal more accurately
3. **Validated on production parts**: TOA Industries achieved dramatically improved springback prediction on a B-Pillar Inner panel with 980MPa High Strength Steel using the Y-U model, reducing physical tryout iterations

### Parameter Identification with MatPara

Material parameters for the Y-U model can be identified using **MatPara** (developed by Prof. Yoshida, distributed by ESI Group):

- **Best case**: Cyclic tension-compression test + tensile test until rupture → full Y-U parameter set
- **Fallback**: Tensile test only → MatPara's material database and optimization technology can estimate Y-U parameters even with limited test data

### Yield Function Selection

For aluminum alloys (e.g., AA6451-T4), research combining PAM-STAMP 2G with six yield functions found:

- **Barlat89 + Voce hardening**: Most accurate for springback prediction
- **Barlat2000 + Voce hardening**: Also highly accurate
- **Hill48 isotropic**: Less accurate for springback
- The kinematic hardening phenomena (Young's modulus change, transient behavior, work-hardening stagnation, permanent softening) were **not observed** in the aluminum alloy studied — suggesting isotropic hardening may be sufficient for some aluminum grades

## Simulation Setup Workflow

### Tool Preparation

1. **Import CAD tools** (punch, usually with runoffs) in `.igs` format
2. **Check topology**: Good geometry has no red lines except on outer boundaries. Cracks → bad meshing → failed simulation
3. **Set stitching tolerance**: Use the same tolerance value for all tools
4. **Mesh the tools**: Automatic mesh ≠ good mesh. Clean geometry first, then mesh
5. **Fillet sharp edges**: If CAD has sharp fillet/punch radii, add fillets in PAM-STAMP to improve contact accuracy
6. **Define symmetry planes**: Before offsetting tools, define in Tool Editor → OP Parameters tab
7. **Create offset tools**: Offset the base tool to create punch, die, and blankholder

### Solver Selection

- ✅ **Use PAM-Autostamp with SSU enabled**: Best results, fast performance
- ❌ **Don't use PAM-Quikstamp Plus**: Fast but lower result quality

### Process Definition

1. Define the process (stamping stages: Holding → Stamping → Springback)
2. Add all participating objects: tools, drawbeads, blank
3. Create and mesh drawbeads
4. Set clearance between punch and die (typically 10% of sheet thickness)
5. Run **Data Check** before starting simulation
6. Start simulation

### Contact Gap

Set the **Contact gap** to approximately 10% of sheet-metal thickness. For a 0.65mm sheet, this means 0.065mm contact gap. The blankholder should have vertical walls with sufficient height (10mm is typically adequate).

## Post-Processing Springback Results

After springback simulation:

1. Compare the formed shape against the design intent
2. Measure springback at critical sections (usually 3 or more sections for complex parts)
3. If springback exceeds tolerance, use the **Compensation** mesh strategy to generate die compensation geometry
4. Re-run the simulation with compensated die to verify the correction
5. Iterate until the part meets dimensional requirements

## Key Takeaways

| Parameter | Recommended Value | Impact if Wrong |
|-----------|------------------|-----------------|
| Damping value | Pre-sim to determine | Too large → inaccurate; too small → slow |
| Integration points | 7 | Too many/few → inaccurate stress field |
| Blank mesh size | < 25% of (fillet R + half thickness) | Too coarse → poor contact, wrong stress |
| Material model | Y-U for HSS, Barlat+Voce for aluminum | Isotropic → misses Bauschinger effect |
| Solver | PAM-Autostamp + SSU | Quikstamp → lower accuracy |
| Tool mesh angle | 7.5° max between elements | Too large → poor contact representation |
