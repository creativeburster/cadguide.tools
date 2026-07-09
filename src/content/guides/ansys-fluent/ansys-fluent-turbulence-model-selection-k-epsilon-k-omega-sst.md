---
title: "ANSYS Fluent Turbulence Model Selection: k-epsilon, k-omega SST, Spalart-Allmaras, and Transition Models"
excerpt: "How to choose the right turbulence model in ANSYS Fluent — covering k-epsilon vs k-omega SST vs Spalart-Allmaras vs Transition SST, y+ requirements, near-wall mesh guidelines, and matching model selection to flow physics."
category: "workflow"
softwareSlug: "ansys-fluent"
keyword: "ansys fluent turbulence model selection k-epsilon k-omega sst spalart-allmaras"
slug: "ansys-fluent-turbulence-model-selection-k-epsilon-k-omega-sst"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/what-are-the-suggested-steps-if-i-am-having-convergence-issues-for-conjugate-heat-transfer-problems/"
  - "https://innovationspace.ansys.com/forums/topic/problem-with-convergence-in-ansys-fluent/"
---

# ANSYS Fluent Turbulence Model Selection: k-epsilon, k-omega SST, Spalart-Allmaras, and Transition Models

Choosing the wrong turbulence model gives you wrong results — even if the mesh is perfect and the solver converges. I've seen engineers use k-epsilon for everything because it's the default, then wonder why their simulation doesn't match wind tunnel data. The turbulence model must match the flow physics. Here's my selection guide.

## Why Turbulence Model Selection Matters

Turbulence models approximate the effect of turbulent fluctuations on the mean flow. No single model works for all flows. The choice affects:

- **Accuracy**: Separation prediction, heat transfer, pressure loss
- **Convergence**: Some models are more stable than others
- **Mesh requirements**: y+ and near-wall mesh differ by model
- **Computational cost**: More complex models take longer

## Turbulence Models in Fluent

### RANS Models (Reynolds-Averaged Navier-Stokes)

These are the workhorse models for engineering applications:

1. **Spalart-Allmaras (SA)**: One-equation model
2. **k-epsilon (Standard, Realizable, RNG)**: Two-equation model
3. **k-omega (Standard, SST)**: Two-equation model
4. **Transition SST**: Four-equation model (includes transition)
5. **Reynolds Stress Model (RSM)**: Seven-equation model

### Scale-Resolved Models

For flows where RANS is insufficient:

1. **LES (Large Eddy Simulation)**: Resolves large eddies, models small ones
2. **DES (Detached Eddy Simulation)**: Hybrid RANS-LES
3. **SBES (Stress-Blended EDS)**: Advanced hybrid

## Step 1: Identify Flow Physics

Before selecting a model, characterize the flow:

### Internal vs External
- **Internal**: Pipes, ducts, heat exchangers, combustors
- **External**: Aerodynamics, building wind loads, vehicle drag

### Attached vs Separated
- **Attached**: Flow follows the surface — simpler models work
- **Separated**: Flow detaches from the surface — needs advanced models

### Steady vs Unsteady
- **Steady**: Time-averaged behavior is sufficient
- **Unsteady**: Vortex shedding, transient phenomena need time-resolved simulation

### Reynolds Number
- **Low Re** (< 10,000): Laminar or transitional — may need transition model
- **Moderate Re** (10,000 - 1,000,000): Fully turbulent — standard RANS models
- **High Re** (> 1,000,000): Fully turbulent — standard RANS or scale-resolved

### Special Physics
- **Swirl**: Rotating flows need RSM or RNG k-epsilon
- **Buoyancy**: Natural convection needs k-omega or RNG k-epsilon
- **Compressibility**: High-speed compressible flows need Realizable k-epsilon or SA
- **Transition**: Laminar-to-turbulent transition needs Transition SST

## Step 2: Spalart-Allmaras (SA)

**One-equation model** — solves a single transport equation for modified turbulent viscosity.

### Best For
- External aerodynamics (airfoils, wings, fuselages)
- Aerospace applications
- High-Reynolds-number attached flows
- Quick estimates and initial runs

### y+ Requirements
- **Wall functions**: y+ = 30-300
- **Low-Re integration**: y+ < 1

### Pros
- Fast convergence (one equation)
- Robust and stable
- Good for external aerodynamics
- Low memory usage

### Cons
- Less accurate for complex internal flows
- No length scale information (one equation)
- Poor for strong swirl or rotation
- Not calibrated for transitional flows

### When to Use SA
- External aerodynamics with attached flow
- Initial solution before switching to a more complex model
- Quick parametric studies
- Limited computational resources

## Step 3: k-epsilon Models

**Two-equation model** — solves transport equations for turbulent kinetic energy (k) and dissipation rate (epsilon).

### Variants

#### Standard k-epsilon
- Original model, widely used
- Good for basic internal flows
- Poor for separation and strong pressure gradients

#### Realizable k-epsilon
- Modified to satisfy mathematical constraints on Reynolds stresses
- Better for separation, jets, and mixing
- Improved boundary layer prediction
- **Recommended over Standard for most cases**

#### RNG k-epsilon
- Modified with renormalization group theory
- Better for swirling flows
- Improved accuracy for low-Reynolds-number regions
- Includes differential viscosity model

### Best For
- Internal flows (pipes, ducts, heat exchangers)
- Moderate complexity with attached flow
- Industrial applications with wall functions
- Quick turnaround times

### y+ Requirements
- **Wall functions**: y+ = 30-300 (standard approach)
- **Low-Re**: y+ < 1 (with enhanced wall treatment)

### Pros
- Good convergence and stability
- Well-established and validated
- Moderate computational cost
- Good for internal flows

### Cons
- Poor for separated flows (even Realizable)
- Poor for strong pressure gradients
- Not suitable for transition prediction
- Wall functions introduce inaccuracy near walls

### When to Use k-epsilon
- Internal flows with attached boundary layers
- Heat exchanger simulations
- Industrial flows where quick results matter
- When y+ = 30-300 is acceptable (wall functions)

## Step 4: k-omega Models

**Two-equation model** — solves transport equations for turbulent kinetic energy (k) and specific dissipation rate (omega).

### Variants

#### Standard k-omega
- Better near-wall behavior than k-epsilon
- Good for low-Reynolds-number flows
- Sensitive to freestream omega values

#### k-omega SST (Shear Stress Transport)
- Blends k-omega (near wall) and k-epsilon (freestream)
- **Best general-purpose RANS model**
- Good for separation prediction
- Good for heat transfer predictions
- **Most recommended turbulence model in Fluent**

### Best For
- External aerodynamics with separation
- Heat transfer simulations
- Flows with adverse pressure gradients
- Compressible flows
- General-purpose CFD

### y+ Requirements
- **Low-Re integration**: y+ < 1 (preferred for SST)
- **Wall functions**: y+ = 30-300 (acceptable but less accurate)

### Pros
- Best separation prediction among RANS models
- Good near-wall treatment without wall functions
- Robust for adverse pressure gradients
- Well-validated for aerodynamics
- Good heat transfer prediction

### Cons
- Slower convergence than k-epsilon
- Sensitive to inlet omega values
- Requires y+ < 1 for best accuracy (fine near-wall mesh)
- More computational cost than k-epsilon

### When to Use k-omega SST
- External aerodynamics with separation
- Heat transfer with near-wall gradients
- Any flow where separation is expected
- When y+ < 1 is achievable
- **Default choice for most CFD applications**

## Step 5: Transition SST

**Four-equation model** — includes transition modeling on top of k-omega SST.

### Best For
- Laminar-to-turbulent transition prediction
- Low-Reynolds-number airfoils
 Turbomachinery with transition
- Natural transition and bypass transition

### y+ Requirements
- **y+ < 1** (mandatory — no wall functions)

### Pros
- Predicts transition location
- Good for low-Re aerodynamics
- Includes both natural and bypass transition

### Cons
- Very sensitive to mesh quality
- Slow convergence
- Requires very fine near-wall mesh (y+ < 1)
- Sensitive to freestream turbulence intensity
- High computational cost

### When to Use Transition SST
- Transition location matters for the design
- Low-Reynolds-number airfoils (UAV, wind turbine)
- Turbomachinery blade boundary layers
- When laminar flow regions are significant

### Workflow for Transition SST

1. Start with k-omega SST to establish the flow field (500-1000 iterations)
2. Switch to Transition SST
3. Continue until convergence
4. This two-step approach improves stability

## Step 6: Reynolds Stress Model (RSM)

**Seven-equation model** — solves transport equations for each Reynolds stress component.

### Best For
- Strong swirl (cyclones, combustors)
- Rotating flows
- Flows with significant anisotropy
- Complex secondary flows

### y+ Requirements
- **y+ < 1** (low-Re) or **y+ = 30-300** (wall functions)

### Pros
- Most accurate RANS model for anisotropic flows
- Good for swirl and rotation
- Captures secondary flows

### Cons
- Slow convergence
- High computational cost (7 equations)
- Sensitive to initial conditions
- Can be unstable for complex cases

### When to Use RSM
- Strong swirling flows where k-epsilon and k-omega fail
- Cyclone separators
- Combustor simulations
- When anisotropy is physically important

## Quick Selection Guide

| Flow Type | Recommended Model | y+ Target |
|---|---|---|
| External aerodynamics (attached) | Spalart-Allmaras | 30-300 |
| External aerodynamics (separated) | k-omega SST | < 1 |
| Internal flows (pipes, ducts) | Realizable k-epsilon | 30-300 |
| Heat transfer | k-omega SST | < 1 |
| Swirling flows | RNG k-epsilon or RSM | 30-300 |
| Transition prediction | Transition SST | < 1 |
| Quick estimate | Spalart-Allmaras | 30-300 |
| General-purpose | k-omega SST | < 1 |
| High-speed compressible | Realizable k-epsilon or SA | 30-300 |
| Natural convection | RNG k-epsilon or k-omega | < 1 |

## Best Practices

- **Start simple and increase complexity** — SA → k-epsilon → k-omega SST → Transition SST
- **Match y+ to the model** — wall functions for y+ > 30, low-Re integration for y+ < 1
- **Use k-omega SST as the default** — best general-purpose RANS model
- **Verify y+ after the initial run** — check actual y+ values and adjust mesh if needed
- **Use Transition SST only when transition matters** — don't use it for fully turbulent flows
- **Consider computational cost** — SA (fast) → k-epsilon (moderate) → SST (moderate) → Transition (slow) → RSM (slow)
- **Validate against experimental data** — turbulence models are approximations; verify results
- **Document model selection rationale** — record why a specific model was chosen for each project
