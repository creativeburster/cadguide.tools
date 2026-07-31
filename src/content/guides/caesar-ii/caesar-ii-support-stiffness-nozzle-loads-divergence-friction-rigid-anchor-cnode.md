---
title: "CAESAR II Support Stiffness and Nozzle Loads: Divergence from Support Gaps and Friction on Ineffective Restraints, Nozzle Load Exceeding Allowable by 3x from Support Stiffness, Rigid Anchor Overestimating Pump Nozzle Moments, Cnode Restraint Forces Showing Zero, and Vessel Nozzle Stiffness Source Verification"
excerpt: "CAESAR II pipe stress analysis fails for 5 distinct reasons: divergence from friction on supports that are ineffective during operation (uplift), nozzle loads exceeding allowable by 3x when support stiffness is added, rigid anchoring at pump nozzles overestimates moments, Cnode restraint summary shows zero forces when node numbering is incorrect, and vessel nozzle stiffness values lack documented source. We cover each with fixes from Eng-Tips piping stress discussions."
category: "support-stiffness-and-nozzle-loads"
softwareSlug: "caesar-ii"
keyword: "CAESAR II divergence support gap friction ineffective restraint nozzle load allowable support stiffness rigid anchor pump Cnode zero force vessel nozzle stiffness source"
slug: "caesar-ii-support-stiffness-nozzle-loads-divergence-friction-rigid-anchor-cnode"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.eng-tips.com/threads/what-are-the-most-common-reasons-that-caesar-ii-diverges.386445/"
  - "https://www.eng-tips.com/threads/pipe-support-stiffness.491756/"
  - "https://www.eng-tips.com/threads/caesar-ii-2011-pump-nozzle-loads-amp-moments.314180/"
---

# CAESAR II Support Stiffness and Nozzle Loads: Divergence from Support Gaps and Friction on Ineffective Restraints, Nozzle Load Exceeding Allowable by 3x from Support Stiffness, Rigid Anchor Overestimating Pump Nozzle Moments, Cnode Restraint Forces Showing Zero, and Vessel Nozzle Stiffness Source Verification

CAESAR II is the industry standard for pipe stress analysis, but modeling errors in support stiffness, nozzle flexibility, and restraint configuration produce divergent results, excessive nozzle loads, and incorrect force reports. This guide covers the 5 most common support and nozzle modeling problems with diagnostic steps and community-verified fixes from Eng-Tips piping stress discussions.

## 1. Divergence: Friction on Ineffective Supports

### Symptom

CAESAR II diverges during nonlinear analysis. The model includes FRP pipes with supports configured with gaps: +Y with Gap=0, -Y with Gap=6.0mm, X or Z with Gap=6.0mm. Seismic load cases are applied.

### Root Cause

The most common cause of divergence is **support gaps that are too large to be effective**. When a support is ineffective during the operating case (uplift occurs), the pipe either:
- Doesn't touch the support at all, or
- Doesn't expand enough to engage friction

If friction is assigned to an ineffective support, the nonlinear solver tries to compute friction forces on a support that isn't in contact, causing convergence failure.

### Fix

1. **Remove friction coefficient from ineffective supports**:
   - If a support has uplift during operation, remove the friction coefficient
   - Friction only works when the pipe is in contact with the support
   - An ineffective support with friction causes divergence

2. **Reduce gap sizes** — if gaps are too large, the support never engages:
   - Check if the pipe actually contacts the support under operating conditions
   - Reduce gap to a realistic value that ensures contact during thermal expansion

3. **Check support effectiveness**:
   - Run the operating case and check if each support is in contact
   - For supports with uplift, either remove them or remove friction

4. **Model seismic cases carefully** — seismic loads can cause pipe movement that disengages supports with large gaps

## 2. Nozzle Loads Exceeding Allowable by 3x from Support Stiffness

### Symptom

A client requires adding support stiffness factor (K) and checking equipment nozzle allowables. After adding stiffness values from the structural team, nozzle loads exceed the allowable by **3 times**. No scope for rerouting the pipe due to space constraints.

### Questions

1. Should stiffness be given in both vertical and horizontal axes of rest supports and guides/line stops?
2. Should stiffness be given for equipment supports?
3. Should stiffness be considered for all supports or just those near the equipment nozzle?

### Fix

1. **Apply stiffness in both axes**:
   - Vertical axis (Y): for rest supports
   - Horizontal axis (X/Z): for guides and line stops
   - Both directions affect nozzle loads

2. **Apply stiffness for equipment supports** — equipment support flexibility affects nozzle loads

3. **Apply stiffness to supports near the nozzle first**:
   - Supports closest to the nozzle have the greatest effect on nozzle loads
   - Start with the 3-5 supports nearest the equipment
   - Add stiffness for more distant supports if needed

4. **Verify stiffness values with structural team** — ensure the values are correct and in proper units

5. **Consider alternative solutions** if nozzle loads still exceed allowables:
   - Add spring hangers to reduce loads
   - Modify support types (rigid → spring, guide → stop)
   - Adjust pipe routing slightly if any flexibility exists
   - Use expansion loops or flexible hose sections

## 3. Rigid Anchor Overestimating Pump Nozzle Moments

### Symptom

When modeling pump nozzles as rigid anchors (100% fixed), the calculated nozzle loads/moments are very high — usually over allowables. This is a common problem for piping stress engineers.

### Root Cause

A pump nozzle is not 100% rigid. Anchoring the line at the pump suction/discharge nozzle with a rigid anchor assumes infinite stiffness, which produces unrealistically high moments. The actual nozzle has flexibility that reduces the transferred moments.

### Fix

1. **Use nozzle stiffness parameters** instead of rigid anchors:
   - Enter rotational spring constants for the nozzle
   - This allows some rotation, reducing calculated moments
   - **Trade-off**: Permitting rotation may exceed casing distortion and misalignment limits

2. **Model the pump volute** as a short length of pipe:
   - Create a short pipe segment representing the pump volute
   - Orient nozzles to match pump geometry
   - Use rigid elements to connect to the actual fixation point
   - This provides a more realistic stiffness representation

3. **Derive stiffness from API-610 allowables**:
   - Use maximum casing distortion values from API-610
   - Correlate with API maximum allowable loads
   - Derive an equivalent spring rate

4. **Conservative approach**: Assume nozzles are anchors and lay out piping to pass:
   - This is the safest approach
   - If the analysis passes with rigid anchors, the actual nozzle loads will be lower
   - Many companies require this approach for critical equipment

5. **Check for typical stiffness coefficient tables** — some vendors provide typical stiffness values for standard pump sizes

## 4. Cnode Restraint Forces Showing Zero

### Symptom

Modeling a heat exchanger with rigid elements from an anchor at the vessel fixed support. Piping proceeds from rigid elements. An anchor (ANC) is defined at node 60 with cnode 601. The restraint summary shows zero forces at node 60 in X, Y, Z — but displacements are non-zero.

### Root Cause

The cnode was not properly disconnected from the original node. The next node after the rigid element was still connected to node 60 instead of being defined as a separate cnode (601).

### Fix

1. **Verify cnode numbering**:
   - The cnode must be a different number from the physical node
   - If node 60 has cnode 601, ensure the next piping node starts from 601, not 60
   - The piping element after the rigid element must connect to 601, not 60

2. **Check element connectivity**:
   - Rigid elements: nodes 10-60 with ANC at node 10
   - Piping: starts from node 60 but with cnode 601
   - The next piping element must be connected to 601, not 60

3. **Verify in the restraint summary** — after fixing the numbering:
   - Forces should appear at node 60 (or 601) in X, Y, Z
   - Displacements were already working correctly

## 5. Vessel Nozzle Stiffness: Source Verification

### Symptom

A CAESAR II stress file has stiffness values written at the intersection between nozzle and vessel. No "nozzle flex" checkbox is marked. The source of these stiffness values is unknown.

### Root Cause

Someone performed a nozzle stiffness evaluation outside of CAESAR II (e.g., using Nozzle Pro, WRC 107, or FE software) and manually input the stiffness values. CAESAR II does not generate these values automatically without the nozzle flex option.

### Fix

1. **Check the title page/notes** — the responsible engineer should have documented the source:
   - Tool used (Nozzle Pro, WRC 107, WRC 297, FE analysis)
   - Input parameters (vessel dimensions, material, temperature)
   - Calculation date and engineer name

2. **If no notes exist, ask the original engineer**:
   - The responsible checking engineer should direct what tools are being used
   - Stiffness values without documented source should not be accepted

3. **Verify stiffness values independently**:
   - Use Nozzle Pro or equivalent software to recalculate
   - Compare with the values in the model
   - If significantly different, update the model

4. **Document the source** in the model notes for future reference

## 6. Support Modeling Best Practices

### Gap and Friction

1. **Use realistic gap sizes** — gaps that are too large make supports ineffective
2. **Remove friction from supports with uplift** — friction on non-contacting supports causes divergence
3. **Check support effectiveness** in the operating case before adding friction

### Stiffness

1. **Apply stiffness in both axes** for rest supports and guides
2. **Start with supports near the nozzle** — they have the greatest effect
3. **Verify stiffness values with structural team** — ensure correct values and units

### Equipment Modeling

1. **Don't use rigid anchors for pump nozzles** — overestimates moments
2. **Model the equipment volute** for more realistic stiffness
3. **Use API-610 allowables** to derive stiffness when vendor data is unavailable
4. **Conservative approach**: rigid anchor + piping layout that passes

### Cnode Usage

1. **Use different cnode numbers** from physical nodes
2. **Verify element connectivity** after defining cnodes
3. **Check restraint summary** for non-zero forces

## Best Practices

1. **Remove friction from ineffective supports** — the most common cause of divergence
2. **Apply support stiffness in both vertical and horizontal axes** — not just one
3. **Don't rigidly anchor pump nozzles** — use stiffness parameters or model the volute
4. **Verify cnode numbering** — forces show zero when cnode is still connected to original node
5. **Document nozzle stiffness sources** — require title page notes with tool and parameters
6. **Use realistic gap sizes** — too large = ineffective support = divergence
7. **Check support effectiveness in operating case** before finalizing model
8. **Start stiffness from supports near the nozzle** — greatest impact on nozzle loads
9. **Use conservative rigid anchor approach** for critical equipment — lay out piping to pass
10. **Verify stiffness values independently** if source is undocumented
