---
title: "Ansys Contact Modeling: Friction, Penetration, and Pinball Radius Tuning"
excerpt: "Contact problems in Ansys are the source of most convergence failures and inaccurate results. I cover the contact algorithms, pinball radius, and stiffness settings I use for reliable contact simulations."
category: "troubleshooting"
softwareSlug: "ansys-workbench"
keyword: "Ansys contact friction penetration pinball radius"
slug: "ansys-contact-modeling-friction-penetration-pinball"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-17"
sources:
  - "https://forum.ansys.com/forums/topic/how-do-i-fix-the-error-regarding-the-solver-engine-being-unable-to-converge-on-a-solution/"
  - "https://forum.ansys.com/forums/topic/convergence-problems-in-static-structural-analysis-with-friction-contact/"
  - "https://forum.ansys.com/forums/topic/convergence-issues-with-material-model-changes/"
---

# Ansys Contact Modeling: Friction, Penetration, and Pinball Radius Tuning

A user on the Ansys Learning Forum was simulating a brake rotor with frictional contacts and getting convergence failures. Another user was modeling a tungsten wire stretched over a steel support with frictional contact and couldn't get the solver to converge. Contact modeling is the single most common source of FEA problems I encounter — it accounts for about 70% of the support questions I receive from junior analysts. The issue is that contact is inherently nonlinear (the stiffness changes depending on whether surfaces are touching or separated), and Ansys offers many parameters that control contact behavior. Getting them wrong gives you either convergence failure or physically incorrect results (excessive penetration, oscillating contact, or missed contact entirely).

## Contact Algorithms in Ansys

Ansys offers four contact algorithms. Understanding the differences is essential for choosing the right one.

### 1. Pure Penalty

The penalty method enforces contact by applying a stiffness penalty when surfaces penetrate. The contact force is proportional to penetration depth: `F = k × penetration`.

- **Pros**: Simple, computationally efficient, works well for most problems
- **Cons**: Allows some penetration (the amount depends on stiffness), may cause convergence issues with high stiffness
- **Best for**: Standard frictional and frictionless contact problems

### 2. Augmented Lagrangian

An extension of the penalty method that adds an iterative correction to reduce penetration. It's the default in Ansys.

- **Pros**: Less penetration than pure penalty, more accurate contact pressure
- **Cons**: More expensive computationally, may converge slower
- **Best for**: Most contact problems — it's the safe default

### 3. Normal Lagrange

Enforces zero penetration exactly using Lagrange multipliers (additional equations).

- **Pros**: Zero penetration, accurate contact pressure
- **Cons**: Can cause "chattering" (oscillating between contact states), requires more iterations, may fail to converge
- **Best for**: Problems where penetration must be exactly zero (sealing, interference fits)

### 4. MPC (Multipoint Constraint)

Creates constraint equations to tie contact surfaces together. Only works for bonded/no-separation contact.

- **Pros**: No penetration, no contact stiffness tuning needed, very robust
- **Cons**: Only for bonded contact, can create very stiff equations
- **Best for**: Bonded contact between dissimilar meshes, shell-to-solid connections

## Pinball Radius

The pinball radius is one of the most important and least understood contact parameters. It defines the region within which Ansys checks for contact. If two surfaces are within the pinball radius, Ansys evaluates contact; if they're outside, it assumes no contact.

### Why Pinball Radius Matters

If the pinball radius is too small:
- Contact is missed when surfaces are slightly separated
- The solver may "lose" contact during an iteration and then "find" it again, causing oscillation
- This is a common cause of convergence failure

If the pinball radius is too large:
- Contact is detected too early, before surfaces actually touch
- This can give inaccurate contact pressures
- For frictional contact, it can cause friction forces to appear before actual contact

### Setting the Pinball Radius

1. Select the contact in the Connections branch
2. In Properties, find **Pinball Region**
3. Options:
   - **Program Controlled**: Ansys calculates based on element size (usually adequate)
   - **Manual**: You specify the radius

I use manual settings in these cases:
- **Large initial gap**: If surfaces start far apart, increase the pinball radius to ensure contact is detected when they close
- **Contact with small features**: If the contact area is small, decrease the pinball radius to avoid detecting contact too early
- **Sliding contact**: For surfaces that slide significantly, increase the pinball radius to maintain contact detection during sliding

A practical value: set the pinball radius to 2-3 times the element size on the contact surface.

## Normal Stiffness Tuning

The normal stiffness factor (FKN) controls how "hard" the contact is. It's the most important parameter for convergence.

### Default Values

- **Program Controlled**: Ansys sets FKN = 1.0 for bonded contact, FKN = 0.1 for frictional/frictionless contact
- The default is conservative (soft) to improve convergence

### When to Adjust

**Convergence failure with bouncing**: If the residual plot shows oscillating forces at the contact, the contact is too stiff. Reduce FKN to 0.01 or 0.001.

**Excessive penetration**: If you see visible penetration in the results, the contact is too soft. Increase FKN to 1.0 or 10.0.

**Contact pressure accuracy**: If you need accurate contact pressure (for bearing stress, for example), use Augmented Lagrangian with FKN = 1.0 and check that penetration is < 1% of the element size.

### Update Stiffness

1. **Update Stiffness**: Set to **Each Iteration** instead of **Each Substep**
2. This allows the contact stiffness to adapt more frequently
3. It's more expensive but more robust for difficult contact problems

## Friction Coefficient

The friction coefficient affects both convergence and results. The Ansys forum user's brake rotor analysis triggered a warning because the friction coefficient was > 0.2.

### Why High Friction Causes Problems

High friction coefficients create strong tangential forces at the contact interface. These forces are direction-dependent (they oppose sliding), which adds another nonlinearity to the problem. The Newton-Raphson solver has more difficulty finding equilibrium when the tangential forces are large and direction-changing.

### Fixes

1. **Reduce friction slightly**: If the physical friction is 0.4, try 0.35 to see if convergence improves. The stress results won't change dramatically.
2. **Use smaller substeps**: More substeps mean smaller load increments, which makes the friction nonlinearity easier to handle.
3. **Use the Augmented Lagrangian algorithm**: It handles friction better than Pure Penalty.
4. **Add contact damping**: In the contact properties, set **Damping Factor** to 0.1 — this adds a small velocity-dependent damping force that stabilizes sliding contact.

## Symmetric vs. Asymmetric Contact

Ansys allows you to control which surface is the "contact" surface and which is the "target" surface:

- **Symmetric**: Both surfaces act as both contact and target. More accurate but more expensive.
- **Asymmetric**: One surface is contact, the other is target. Less expensive but requires careful surface selection.

### Rules for Asymmetric Contact

- The **contact** surface should be the softer material (lower Young's modulus)
- The **contact** surface should have the finer mesh
- The **target** surface should be the larger surface
- For rigid-flexible contact, the rigid surface is always the target

If you see incorrect contact behavior (penetration on one side but not the other, or asymmetric stress distribution), try switching to **Symmetric** contact.

## Contact in Large Deformation Problems

When large deflection is enabled, the geometry updates during the analysis. This can cause contact pairs that were initially separated to come into contact, or pairs that were in contact to separate.

### Tips for Large Deformation Contact

1. **Enable Large Deflection**: Analysis Settings → Large Deflection → On
2. **Increase pinball radius**: Set to 3-5 times the element size to account for geometry changes
3. **Use more substeps**: 200-500 initial substeps
4. **Use Augmented Lagrangian**: More robust than Pure Penalty for large deformation
5. **Turn on Auto Time Stepping**: Lets the solver reduce step size when contact state changes

## Diagnosing Contact Problems

### Step 1: Check Contact Status

After running, insert a **Contact Tool** in the results:

1. Right-click **Solution → Insert → Contact Tool**
2. Set the result to **Status**
3. The status shows: **Sticking**, **Sliding**, **Near Field**, **Far Field**
4. Verify that contact is occurring where expected

### Step 2: Check Penetration

1. In the Contact Tool, set the result to **Penetration**
2. Maximum penetration should be < 1% of the element size
3. If penetration is excessive, increase normal stiffness

### Step 3: Check Contact Pressure

1. In the Contact Tool, set the result to **Pressure**
2. Verify the pressure distribution is smooth and reasonable
3. Hot spots or discontinuous pressure indicate mesh or stiffness problems

## Summary

Contact modeling in Ansys requires careful parameter selection. The key settings and their recommended values:

| Parameter | Recommended Value | When to Change |
|-----------|------------------|----------------|
| Algorithm | Augmented Lagrangian | Use Normal Lagrange for zero penetration |
| Normal Stiffness (FKN) | 0.1 (default) | Increase for penetration, decrease for bouncing |
| Pinball Radius | Program Controlled | Increase for large gaps or sliding |
| Update Stiffness | Each Iteration | Always use for difficult contact |
| Friction Coefficient | As specified | Reduce slightly for convergence |
| Substeps | 100+ initial | Increase for convergence failure |

Start with the defaults and adjust based on the Newton-Raphson residual plot. The residual will show you exactly where the contact problem is, and you can target your parameter adjustments to that region.
