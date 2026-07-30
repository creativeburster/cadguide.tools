---
title: "STAAD.Pro Solver Diagnostics: Disjointed Structure Warnings, Tension/Compression Convergence Failures, Direct Analysis Method Errors, and SET NL Command"
excerpt: "STAAD.Pro produces 6 distinct warning and error types that halt analysis: disjointed structures from duplicate nodes, tension/compression non-convergence after 10 iterations, negative L-diagonal in Direct Analysis Method, missing Poisson's ratio defaults, rigid diaphragm constraint errors, and SET NL overflow. We cover each with diagnostic steps and fixes."
category: "analysis-diagnostics"
softwareSlug: "staad-pro"
keyword: "STAAD.Pro solver error disjointed structure tension compression convergence direct analysis method SET NL Poisson ratio warning"
slug: "staad-pro-solver-diagnostics-disjointed-structure-convergence-direct-analysis"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.scribd.com/document/105931032/STAADFAQ7"
  - "https://www.eng-tips.com/threads/solver-error-when-using-the-direct-analysis-method.260247/"
  - "https://structural656.rssing.com/chan-54762718/all_p350.html"
---

# STAAD.Pro Solver Diagnostics: Disjointed Structure Warnings, Tension/Compression Convergence Failures, Direct Analysis Method Errors, and SET NL Command

STAAD.Pro's analysis engine produces structured warning and error messages that identify specific modeling problems. However, the messages are often cryptic — "negative L-diagonal" or "zero on diagonal in Jacobi iteration" don't explain what to fix. This guide covers the 6 most common diagnostic messages with their root causes and verified fixes from the STAAD community and official FAQ.

## 1. "This Structure Is Disjointed"

### Message

```
THIS STRUCTURE IS DISJOINTED. IGNORE IF MASTER/SLAVE OR IF UNCONNECTED JOINTS.
```

### Root Cause

The model contains **multiple structures** — one portion has no way of transferring forces to another. This happens when:
- Two members visually intersect in 3D but don't share a common node
- Duplicate nodes exist at the same coordinates with different node numbers
- Members were drawn separately and never connected

### Diagnosis

1. Use **Tools → Check Duplicate → Nodes** to find duplicate nodes at the same coordinates
2. Two lines that intersect in 3D space are NOT automatically connected — the end of one member lying on the axis of another is insufficient
3. Connectivity is ensured **only when intersecting members are divided into segments that meet at a single, common node** (same node number)

### Fix

1. **Merge duplicate nodes**: Use the Check Duplicate command to identify and merge nodes at identical coordinates
2. **Divide intersecting members**: Break members at intersection points so they share a common node
3. **Check for instabilities**: Disjointed structures often produce instability warnings because portions appear supported when they aren't

## 2. Tension/Compression Did Not Converge After 10 Iterations

### Message

```
**WARNING-Tension/Compression did not converge after 10 iterations, Case= 119
```

### Root Cause

When using `MEMBER TENSION` or `MEMBER COMPRESSION` commands, STAAD iterates to find the equilibrium state where tension-only members don't take compression and vice versa. The default iteration limit is **10**. If the model oscillates between states, it fails to converge.

### Fix

**Option A — Increase iteration limit**:
Add before the load cases:
```
SET ITERLIM 11
```
This allows one extra iteration. Community-verified fix: "I added the command SET ITERLIM 11 which allowed the software to carry out one extra iteration and that resulted in all the cases being converged."

**Option B — Reorder MEMBER TENSION definition**:
Define `MEMBER TENSION` after all primary load cases (after load case 14), followed by:
```
PERFORM ANALYSIS
CHANGE
MEMBER TENSION
```

**Option C — Check results validity**:
If results seem acceptable despite the warning, it may be safe to proceed — but verify that no tension-only members are in significant compression.

## 3. Negative L-Diagonal in Direct Analysis Method

### Message

```
***ERROR - AT JOINT 11 DIRECTION = MY
PROBABLE CAUSE NEGATIVE L-DIAGONAL K-MATRIX DIAG= 6.5431013E+03
L-MATRIX DIAG= -1.9110223E+01
EQN NO 17
```

### Root Cause

The Direct Analysis Method (DAM) adjusts the **Tau_b factor** based on axial load in members, reducing stiffness. The basic solver was not equipped to handle negatives in the diagonal when Tau_b approaches zero or becomes negative.

### Fix

**Option A — Use Advanced Analysis Engine**:
The Advanced solver can handle negative diagonal values. If you have an Enterprise license, the Advanced solver may be available at no additional cost.

**Option B — Update to latest build**:
The issue was addressed by the STAAD development team. Build 20.07.07+ fixes the basic solver's inability to handle DAM negative diagonals.

**Option C — Use REPEAT LOADs**:
Run Direct Analysis on **REPEAT LOADs** that represent realistic loading conditions. Avoid running it on individual load cases that don't represent realistic conditions.

**Option D — Force Tau_b = 1**:
Instruct the program to not compute Tau_b (leave it at 1). Note: one user reported this didn't fix the issue, suggesting the bug is deeper than Tau_b calculation.

## 4. Missing Poisson's Ratio Warning

### Message

```
**WARNING** THE POISSON'S RATIO HAS NOT BEEN SPECIFIED FOR ONE OR MORE MEMBERS/ELEMENTS/SOLIDS.
THE DEFAULT VALUE HAS BEEN SET FOR THE SAME.
```

### Root Cause

Poisson's ratio is a fundamental material property used to calculate G (Modulus of Rigidity):

**E = 2G(1 + Poisson)**

Without an explicitly specified Poisson's ratio, STAAD uses a default value, which may not match the actual material behavior.

### Fix

Explicitly specify Poisson's ratio in the material definition:
```
DEFINE MATERIAL
ISOTROPIC STEEL
E 2.05e8
POISSON 0.3
DENSITY 7.85e-5
```

## 5. "Zero on Diagonal in Jacobi Iteration" with Compression-Only Springs

### Message

```
Error - zero on diagonal in jacobi iteration
Warning - instability at joint in Fy direction
```

### Root Cause

When all supports in a direction are compression-only (or tension-only), the structure becomes **unstable on every iteration** where the support is not engaged. This is a fundamental limitation — the structure must have at least one support in each global direction that is NOT tension/compression-only.

### Scenario

A foundation modeled with solid elements and compression-only soil springs in the Fy direction. The foundation weight should keep it stable, but during iteration the solver encounters a state where no spring is engaged, creating a zero on the diagonal.

### Fix

1. **Assign some nodes as fixed supports** (not compression-only) in each global direction
2. STAAD help states: "You may need to include some support in each global direction that is not tension (or compression) only to be stable on every iteration"
3. Select nodes at the center of the foundation (where uplift is impossible) as fixed supports
4. Keep perimeter nodes as compression-only for realistic soil behavior

## 6. SET NL Command and Rigid Diaphragm Constraint Errors

### "Invalid Rigid Diaphragm Constraints Found"

### Message

```
Invalid Rigid Diaphragm Constraints Found for 1096.
Constrain Equations Ignored for the Diaphragm.
```

### Root Cause

Rigid diaphragm constraints require all constrained nodes to be at the same Z-elevation. If nodes at different elevations are assigned to the same diaphragm, the constraint equations become invalid.

### Fix

1. Check that all nodes in a rigid diaphragm are at the same level
2. Create separate diaphragms for each floor level
3. Verify no load areas are accidentally creating nodes at different elevations

### SET NL Command

When converting LOAD COMB to REPEAT LOAD, the total number of load cases may exceed STAAD's default limit.

**Fix**: Add `SET NL n` before the analysis command, where n = total number of load cases (including REPEAT LOADs converted from LOAD COMB).

Example: 100 load cases → `SET NL 100`

### Key Rule

When all load combinations are converted to REPEAT LOAD type, `PERFORM ANALYSIS` and `CHANGE` commands are **not required** for all REPEAT LOAD cases — only for the primary load cases that were originally analyzed with CHANGE.

## 7. Turkish Seismic Load Definition Bug

### Issue

The Turkish Seismic Load definition UI loses CT values and bumps PX/PZ parameters. The user input is not retained when saving through the GUI.

### Fix

1. **Edit the input file directly** (STAAD Editor) to specify CT, PX, and PZ values
2. Verify in the Output Report that the specified values are actually used
3. Update to version 20.07.11.82+ where the issue is fixed
4. Report the UI bug to Bentley — the GUI doesn't save the values, but the input file does

## 8. CIS/2 Export to SP3D: Members Not Identified

### Issue

When exporting a STAAD model to CIS/2 format and importing into SP3D, members are not identified.

### Fix

1. **Create physical members** before exporting: Select the entire model → **Auto Form Member**
2. Generate the CIS/2 file from within STAAD.Pro after creating physical members
3. SP3D needs physical members (not analytical members) for proper identification
4. A mapping file may be required — check SP3D documentation for STAAD CIS/2 import requirements

## Diagnostic Workflow Summary

1. **Read the output file completely** — STAAD messages are sequential and each builds context
2. **Check for duplicate nodes first** — the most common cause of disjointed structure warnings
3. **Verify material properties** — missing Poisson's ratio is a frequent silent problem
4. **For DAM errors**: Use Advanced solver or update to latest build
5. **For tension/compression convergence**: Add SET ITERLIM with one more than the default 10
6. **For compression-only spring instability**: Add at least one fixed support per direction
7. **For diaphragm errors**: Verify all nodes are at the same elevation
8. **For CIS/2 export**: Create physical members with Auto Form Member before exporting
