---
title: "CYPECAD Seismic Design Compliance: EHE-08 Annex 10 Transverse Reinforcement Errors, NCSE-02 Ductility Criteria, Modal Analysis DOF Limits, Torsional Mode Mass Participation, and Dual System 25% Code Requirement"
excerpt: "CYPECAD seismic design produces 5 recurring compliance problems: transverse reinforcement fails EHE-08 Annex 10 spacing limits, ductility criteria must be set to 'none' for low ductility (counterintuitive), modal analysis limited by independent DOF count (3 per floor), torsional modes show zero mass participation in X/Y but significant rotational inertia, and dual system 25% seismic force requirement lacks program support. We cover each with fixes from CYPE forums and official issue lists."
category: "seismic-design-compliance"
softwareSlug: "cypecad"
keyword: "CYPECAD seismic design EHE-08 Annex 10 NCSE-02 ductility modal analysis torsional mode dual system 25% Eurocode"
slug: "cypecad-seismic-design-compliance-ehe08-annex10-ductility-modal-dual-system"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.soloarquitectura.com/foros/threads/armadura-transversal-no-cumple-criterios-de-diseno-por-sismo.95839/"
  - "https://info.cype.com/en/subject/cypecad-list-of-issues-in-the-cypecad-final-design-report/"
  - "https://www.soloarquitectura.com/foros/threads/analisis-modal-espectral.127672/"
---

# CYPECAD Seismic Design Compliance: EHE-08 Annex 10 Transverse Reinforcement Errors, NCSE-02 Ductility Criteria, Modal Analysis DOF Limits, Torsional Mode Mass Participation, and Dual System 25% Code Requirement

CYPECAD's seismic design module produces compliance errors that confuse practitioners: transverse reinforcement fails EHE-08 Annex 10, ductility criteria settings are counterintuitive, modal analysis is limited by independent DOF count, torsional modes show zero mass participation, and the dual system 25% force requirement has no program support. This guide covers each compliance issue with fixes from Spanish engineering forums and CYPE's official issue list.

## 1. Transverse Reinforcement Fails EHE-08 Annex 10 and NCSE-02

### Error Message

```
Dimensionamiento de la armadura transversal:
No se encuentra ninguna disposición de la armadura longitudinal en la tabla de armado
que cumpla las condiciones de separación máxima entre barras exigidas por la norma
```

```
No cumple criterios de diseño por sismo (EHE 08 anejo 10) y (NCSE 02 art. 4.5)
```

### Root Cause

EHE-08 Annex 10 and NCSE-02 Article 4.5 impose maximum spacing requirements between longitudinal bars for seismic design. When the beam's longitudinal reinforcement layout doesn't fit any standard arrangement in CYPECAD's reinforcement tables, the transverse reinforcement design fails.

### CYPE Support's Recommendation

1. **Deactivate EHE-08 Annex 10** in General Data settings and re-analyze
2. **Set ductility reinforcement criteria to "none"** (criterio de armado por ductilidad = ninguno)

### Why "None" Is Correct for Low Ductility

This is counterintuitive — if the code requires low ductility, why set the criteria to "none"?

**Explanation**: Per the standard, ductility reinforcement criteria only apply to **high or very high ductility**. For low ductility, the correct setting is "none" because the additional confinement and spacing requirements don't apply.

### Fix

1. **Deactivate EHE-08 Annex 10** in General Data if the project doesn't require it
2. **Set ductility criteria to "none"** for low ductility structures
3. **Verify with the code** — check NCSE-02 to confirm that low ductility doesn't require Annex 10 provisions
4. **If the error persists after deactivating Annex 10**: The NCSE-02 requirements are still active — check Article 4.5 spacing requirements manually
5. **Resize the beam** — a larger cross-section may accommodate the required bar spacing

## 2. Modal Analysis: DOF Limit and Mode Count Errors

### Error Message

```
El número de modos a analizar no puede superar el número de grados de libertad
independientes a efectos de desplazamiento horizontal
(3 por cada planta si toda ella está conectada o por cada trozo independiente).
```

```
En este caso, el número de grados de libertad independientes es 3
y el número de modos seleccionado es 4.
```

### Root Cause

CYPECAD limits the number of vibration modes to the number of **independent horizontal DOFs**:
- 3 DOFs per floor (2 translations + 1 rotation) if the floor is fully connected
- Fewer if supports, retaining walls, or embedded columns suppress DOFs

### What Reduces Independent DOFs

| Element | Effect on DOFs |
|---------|---------------|
| Retaining walls (muros pantalla) | Suppress horizontal DOFs in that direction |
| External supports (apoyos con carrito) | Allow perpendicular sliding but block axial |
| Embedded columns from foundation at upper floors | Suppress DOFs for those floors |
| Free-standing columns (pilares exentos) | DOFs are condensed and don't appear as independent |

### Fix

1. **Set the number of modes equal to the independent DOF count** (e.g., 3 modes for 3 DOFs)
2. **Check for suppressed DOFs** — retaining walls and supports may be limiting the count
3. **For underground structures**: If the entire structure is below grade with slabs tied to retaining walls, **there are no vibration modes to calculate** — only increased earth pressures from seismic action need to be considered
4. **For semi-buried structures** (e.g., parking on a slope): The upper exposed portion has DOFs, the buried portion doesn't

### Secondary Error: Bigpilar.c Crash

When forcing more modes than DOFs allow, CYPECAD may crash with:
```
No se cumple una comprobación de seguridad
Expresión: bp->partes_calculo == NULL
Fichero: bigpilar.c (CEGEN.DLL) Línea: 6132
```

**Fix**: Don't exceed the DOF limit. If you need more modes, remove DOF-suppressing constraints.

## 3. "No Mode Calculated in Y Direction"

### Error Message

```
No se ha calculado ningún modo en la dirección Y.
Esto puede ser debido a que no se haya seleccionado un número suficiente de modos
o a que haya vinculaciones en la estructura que impidan el desplazamiento en esa dirección.
```

### Root Cause

External constraints (apoyos con carrito / cart supports) block movement in one direction while allowing perpendicular sliding. If all Y-direction constraints are blocked, no Y-direction modes are calculated.

### Fix

1. **Remove Y-direction constraints** if seismic analysis in Y is required
2. **Indicate dynamic analysis in only one direction** if constraints can't be removed
3. **Check carrito supports** — they allow sliding perpendicular to the wall but block movement along the wall axis
4. **For retaining wall simulations**: The carrito supports are simulating wall restraint — decide whether seismic analysis in the blocked direction is actually needed

## 4. Torsional Modes and Mass Participation

### The Problem

Eurocode 8 (EN 1998-1) Article 4.3.3.3.1(3) states that modes with less than 5% mass participation can be ignored. However:

- **Torsional modes** show ~0% mass participation in X and Y directions
- But they have **significant rotational inertia mobilized** around the vertical axis
- CYPECAD doesn't quantify torsional mode importance by rotational inertia

### Why Torsional Modes Show Zero Mass Participation

For pure torsional modes:
- What moves on one side subtracts from the other
- Net mass participation in X and Y = 0
- But rotational inertia (mass × distance²) is significant
- The squared distance amplifies the torsional effect

### CYPECAD Limitation

CYPECAD's seismic dialog allows:
- Fixed number of modes
- Mass participation percentage threshold

But it **does not provide**:
- Minimum mass percentage per mode to be considered
- Rotational inertia participation quantification
- Automatic filtering of modes below 5% threshold

### Fix

1. **Don't blindly discard modes below 5%** — check if they're torsional
2. **Verify total mass participation reaches 90%** per Eurocode 8
3. **Check rotational participation** manually for torsional modes
4. **Use the new EN 1998-1 2nd generation approach**: All modes with period > TB are retained; shorter period modes are represented by a residual mode
5. **For local modes** (e.g., truss bottom chord vibrating): Check if the mode mobilizes significant mass beyond self-weight — if not, it may be safe to ignore

### Practical Example

A truss under seismic loading perpendicular to its span:
- Mode 1: 0.51% mass participation — local truss chord displacement
- The chord generates moments that cause beam failure
- Question: Is bracing needed if there's no significant mass at that location?

**Answer**: If the mode doesn't mobilize significant mass (only self-weight), the seismic forces are small. However, local resonance effects should be checked separately.

## 5. Dual System: 25% Seismic Force Requirement

### Code Requirement

In dual systems (walls + frames), the frame (pórtico) must resist **at least 25% of the seismic force**. This ensures the frame acts as a backup if walls plasticize.

### The Problem

CYPECAD doesn't support:
- Creating separate load combinations with amplified seismic forces (e.g., 3.125× E)
- Applying different seismic forces to primary columns vs. walls
- Segregating combinations for specific element groups

### Workaround Approaches

**Approach 1 — Two models (inverted conditions)**:
1. **Model A**: Release wall horizontal constraints (simple supports, only vertical reaction) → walls take 0% seismic → design columns for 100% seismic
2. **Model B**: Reduce wall stiffness to near-zero → columns take more seismic → design walls for full seismic
3. This is the "two-model technique" used with other programs similar to CYPE 3D

**Approach 2 — Amplification factor**:
1. After first analysis, check if primary columns resist ≥8% of seismic action
2. To reach 25%, apply amplification factor: 25/8 = 3.125
3. Design columns and connected beams with: DL + CM + CV + 3.125×E
4. **Limitation**: CYPECAD can't create segregated combinations for specific elements only

**Approach 3 — Modify wall inertia factor**:
1. Reduce wall elastic modulus to decrease stiffness
2. Forces more seismic load into the frame
3. **Risk**: May affect other analysis results and produce unrealistic wall designs

### Engineering Judgment

The dual system requirement is debated among practitioners:
- Walls and frames act simultaneously — walls won't tell columns "you take 25%"
- Each element resists force proportional to its stiffness
- The 25% is a code safety factor, not a physical behavior
- Some reviewers are "more rigid than the walls themselves" in enforcing it

### Fix

1. **Use the two-model approach** — most reliable for satisfying reviewers
2. **Document the methodology** — explain the dual system compliance strategy
3. **Design walls for 100% seismic** in one model
4. **Design frames for 25% seismic** in the other model
5. **Combine results** for final design

## 6. CYPECAD Final Design Report: Common Issues

### From Official CYPE Issue List

CYPE maintains a list of messages that appear in the Final Design Report:

**Beam errors**:
- Stress greater than allowable stress
- Excessive shear
- No valid section found satisfying all checks
- Section/level changes at beam connections — check reinforcement at change points

**Seismic load errors (Mexico)**:
- Eccentricity of center of mass vs. center of stiffness exceeds limit per floor

**Post-tensioned slabs**:
- Considered as rigid diaphragms — axial force effects in SLS/ULS not taken into account
- Must manually check prestressing losses, concrete stresses, cracking limit states
- Design and reinforcement of anchorage zones must be provided separately

**Fire resistance**:
- Not checked for: shear walls, concrete block walls, masonry walls, sloped beams, diagonal bracing, composite beams, joist slabs, composite slabs
- Must be verified manually for these element types

**Steel beam errors**:
- Section axis cannot be obtained
- Element outside allowed area — delete and re-enter

## Best Practices

1. **Set ductility criteria to "none" for low ductility** — the counterintuitive correct setting
2. **Don't exceed the DOF limit for modes** — CYPECAD will crash with bigpilar.c error
3. **Check for DOF-suppressing constraints** when modes can't be calculated in a direction
4. **Don't ignore torsional modes** based on mass participation alone — check rotational inertia
5. **Verify 90% total mass participation** per Eurocode 8
6. **Use two-model approach for dual systems** — most reliable for code compliance
7. **Document seismic methodology** for reviewer approval
8. **Manually check fire resistance** for element types CYPECAD doesn't cover
9. **Manually verify post-tensioned slab design** — program doesn't account for axial force effects
10. **Contact CYPE support** for persistent errors — they provide project-specific guidance
