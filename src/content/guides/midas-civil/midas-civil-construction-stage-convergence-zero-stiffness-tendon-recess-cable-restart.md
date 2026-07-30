---
title: "midas Civil Construction Stage Analysis: Load Case vs Load Combination Convergence, Zero-Stiffness Concrete Activation, Tendon Anchorage Recess Direction, Cable Nonlinearity, and Restart Function Limitations"
excerpt: "midas Civil construction stage analysis fails for 6 distinct reasons: destabilizing loads in Load Combinations instead of Load Cases, zero-stiffness concrete activated at age zero, tendon anchorage recess assigned to wrong end, cable elements transforming to equivalent trusses for linear analysis, and Restart function producing inconsistent results after mid-stage changes. We cover each with fixes from midas knowledge base and user reports."
category: "construction-stage-analysis"
softwareSlug: "midas-civil"
keyword: "midas Civil construction stage analysis convergence load case combination zero stiffness concrete tendon anchorage recess cable restart"
slug: "midas-civil-construction-stage-convergence-zero-stiffness-tendon-recess-cable-restart"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://resource.midasuser.com/en/blog/bridge/bridge-insight/common-errors-in-bridge-modeling"
  - "https://support.midasuser.com/hc/en-us/articles/18108572338969-Construction-Stage-Analysis-Control"
  - "https://gtc.midasuser.com/helpdesk/KB/View/16080185-unsure-girder-member-forces-and-strange-girder-deformation"
---

# midas Civil Construction Stage Analysis: Load Case vs Load Combination Convergence, Zero-Stiffness Concrete Activation, Tendon Anchorage Recess Direction, Cable Nonlinearity, and Restart Function Limitations

midas Civil's construction stage analysis is essential for bridge engineering — it tracks time-dependent material properties, creep, shrinkage, and sequential structural changes. However, convergence failures and incorrect results stem from 6 specific modeling errors that practitioners repeatedly encounter. This guide covers each with diagnostic approaches and fixes from the midas Civil knowledge base and user reports.

## 1. Lack of Convergence: Load Combinations Instead of Load Cases

### Symptom

Nonlinear analysis fails to converge when using compression-only springs, tension-only elements, or other nonlinear capabilities. The program reports "certain load cases have not converged."

### Root Cause

midas Civil solves equilibrium equations for **Load Cases**, not Load Combinations. When stabilizing and destabilizing loads are in separate Load Cases combined into a Load Combination, the solver processes them independently:

- Stabilizing load (e.g., dead weight) in Load Case 1
- Destabilizing load (e.g., wind uplift) in Load Case 2
- Load Combination = LC1 + LC2

The solver tries to find equilibrium for LC2 alone — without the stabilizing effect of LC1. This fails because the destabilizing load alone causes instability.

### Fix

1. **Input Load Combinations as Load Cases** — combine stabilizing and destabilizing loads into a single Load Case
2. The equilibrium can then be achieved because both effects are considered simultaneously
3. **If equilibrium still cannot be achieved**: The real structure likely has stability issues — the destabilizing effects cannot be counteracted by the stabilizing loads

### Key Principle

> "The engineer should remember that programs usually don't solve the equilibrium equations for Load Combinations but for Load Cases. Thus, the equilibrium can be achieved only if stabilizing and destabilizing loads are being simultaneously considered in each Load Case."

## 2. Lack of Convergence: Released Degrees of Freedom

### Symptom

Analysis doesn't converge when using elements with released DOFs — either explicit (beam end releases) or implicit (truss elements instead of beams).

### Root Cause

Too many DOFs have been released, making the model unstable. The structure or individual elements can move freely in some direction.

### Fix

1. **Trace load paths** — ensure every load has a continuous path to the supports
2. **Check each finite element** — verify it's stable on its own and as part of the overall model
3. **Don't over-release** — only release DOFs that are genuinely free in the physical structure
4. **Use truss elements carefully** — they have no bending stiffness; ensure they're braced against lateral movement
5. **Check for mechanisms** — a structure with too many releases can form a kinematic mechanism

## 3. Zero-Stiffness Concrete: Activation at Age Zero

### Symptom

Construction stage analysis fails with convergence problems. Deformations are unrealistic or the analysis aborts.

### Root Cause

When using time-dependent material properties (variable modulus of elasticity), elements activated with **concrete age = 0** have zero stiffness:

- E(t) = 0 at t = 0
- The element contributes no stiffness to the model
- The analysis cannot converge because the structure is unstable

### Diagnosis

1. **Observe deformations in each construction stage** — look for excessive or unrealistic deflections
2. **Try activating/deactivating variable properties** — if the problem disappears, it's a zero-stiffness issue
3. **Check initial member ages** — the age when formwork is removed and the member carries load

### Fix

1. **Set concrete age > 0 at activation** — the element being activated must have a modulus of elasticity greater than zero
2. **Define initial member ages correctly**:
   - Initial age = Stage duration - time for formwork and rebar placement
   - This represents the concrete maturity when it first carries load
3. **For FCM (Free Cantilever Method)**:
   - Different segments have different ages at key segment erection
   - Two cantilevers constructed at different times have different creep, shrinkage, and tendon losses
   - These differences must be reflected in construction stage definitions

### Time Step Sizing

When time-dependent materials are used, ensure adequate time step sizes. midas Civil has internal rules for considering smaller time steps automatically, but verify that critical early-age changes (rapid strength gain) are captured.

## 4. Tendon Anchorage Recess on Wrong End

### Symptom

Girder axial forces don't match expected values after prestressing. Tendon losses seem incorrect (e.g., only 1.34% loss when expected loss is much higher).

### Root Cause

The **anchorage recess** (anchorage set-up loss) is assigned to the wrong end of the tendon. In cantilever construction, tendons are jacked from one end, but the recess must be at the **jacking end**, not the dead end.

### Real Example

A user assigned 12mm anchorage recess to the **beginning** of cantilever tendons, while the jacking force was applied at the **end**. This resulted in:
- Incorrect axial forces (15,620 kN vs expected 15,832 kN)
- Only 1.34% apparent loss instead of the correct amount
- Strange girder deformations

### Fix

1. **Assign anchorage recess to the jacking end** — the end where the prestressing force is applied
2. **Verify jacking direction** for each tendon
3. **For symmetric 3-span bridges**: Mirror tendon arrangements — but verify recess is on the correct end for each set

### midas Civil Tendon Property Limitation

The current tendon system requires two sets of property values for jacking forces and anchorage recess (start and end), even though in practice:
- Jacking forces are typically equal at both ends for symmetrical tendons
- Anchorage recess should be equal at both ends
- This forces users to enter redundant data for mirror-arrangement tendons

### Recommendation

> "One tendon should have uniform section area and be jacked at one or two ends with equal jacking forces. The anchorage recess at both ends should be equal. The current system requiring different values is unnecessary."

## 5. Cable Element Nonlinearity and Equivalent Truss Transformation

### Symptom

The message "Cable element is automatically transformed to equivalent truss element for linear analysis" appears.

### Root Cause

Cable elements are inherently nonlinear — they only carry tension and their stiffness depends on the current force state. For **linear analysis**, midas Civil transforms cables to equivalent truss elements:
- Truss elements carry both tension and compression
- Stiffness is based on initial properties, not current force
- This is an approximation valid only for small deformations

### When This Matters

- **Linear static analysis**: Cable → equivalent truss (acceptable for preliminary design)
- **Nonlinear analysis**: Cable behavior is correctly modeled (tension-only, geometric nonlinearity)
- **Construction stage analysis**: Cable behavior is critical — use nonlinear analysis

### Fix

1. **Use nonlinear analysis** for cable-stayed bridges and suspension bridges
2. **Select accumulative model** for geometrically nonlinear construction stage analysis:
   - Allows time-dependent effects
   - Supports cable pretension types
   - Calculates tangent displacements including Lack of Fit Force
3. **For independent model analysis**: Geometric nonlinearity and time-dependent effects cannot be simultaneously considered
4. **Enable "Initial Tangent Displacement for Erected Structures"** — required for geometric nonlinear analysis based on Real Displacement

## 6. Restart Function: Inconsistent Results After Changes

### Symptom

Using the Restart function to resume analysis from a specific construction stage produces results that don't match a full analysis.

### Root Cause

The Restart function uses results from the previously performed analysis. When changes are made that affect stages after the Restart point, the results are inconsistent because:
- The Restart doesn't recalculate stages before the restart point
- Changes to earlier stages are not reflected
- The accumulated state may not match the modified model

### Fix

1. **Perform analysis from start to end** rather than using Restart — this ensures consistency
2. **Only use Restart for quick checks** — never for final design results
3. **If changes are made to any stage**: Run the full analysis from the beginning
4. **Restart consistency depends on input data** — any change to input invalidates Restart results

## 7. Support Activation Order in Construction Stages

### Symptom

Unexpected forces or deformations when supports (links, springs) are activated during construction.

### Root Cause

If structural elements are activated before their supports, the elements exist without support for one stage, creating temporary instability.

### Fix

1. **Activate supports before the elements connected to them** — supports must exist when elements are activated
2. **If elements are activated before supports**: Activate supports in the same stage or earlier
3. **For temporary supports**: Deactivate them in the correct stage (after the permanent support system is in place)

## 8. Finding Young's Modulus at Each Construction Stage

### How to Check

Use **Result Tables → Construction Stage → Element Properties at Each Stage** menu.

This shows the calculated Young's modulus for each element at each construction stage, based on:
- Concrete age at that stage
- Time-dependent material model (e.g., CEB-FIP, ACI, Canadian code)
- Initial member age

### Why This Matters

- Verifying that concrete has sufficient strength before loading
- Checking that creep and shrinkage calculations use correct E values
- Debugging convergence issues related to zero or low stiffness

## Best Practices

1. **Input Load Combinations as Load Cases** for nonlinear analysis — don't rely on Load Combinations
2. **Set concrete age > 0 at activation** — zero age means zero stiffness and convergence failure
3. **Assign anchorage recess to the jacking end** — not the dead end
4. **Use nonlinear analysis for cables** — linear analysis transforms cables to trusses
5. **Run full analysis instead of Restart** — Restart produces inconsistent results after changes
6. **Activate supports before elements** — prevents temporary instability
7. **Check Element Properties at Each Stage** — verify Young's modulus is reasonable
8. **Use accumulative model for nonlinear construction stages** — supports time-dependent effects and cable nonlinearity
9. **Enable Initial Tangent Displacement** — required for geometric nonlinear analysis
10. **Define adequate time steps** for time-dependent materials — especially during early-age rapid strength gain
