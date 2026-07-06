---
title: "MIDAS Civil Seismic Bridge Design: Ductility, Isolation, and AASHTO Seismic Provisions"
excerpt: "A guide to seismic bridge design in MIDAS Civil covering AASHTO seismic provisions, ductility-based design, seismic isolation with lead rubber bearings, capacity protection, and pushover analysis for bridge piers and bents."
category: "workflow"
softwareSlug: "midas-civil"
keyword: "midas civil seismic bridge design"
slug: "midas-civil-seismic-bridge-design-ductility-isolation-aashto"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://globalsupport.midasuser.com/"
  - "https://academy.midasuser.com/"
---

# MIDAS Civil Seismic Bridge Design: Ductility, Isolation, and AASHTO Seismic Provisions

Seismic bridge design is a different animal from building seismic design. Bridges have different structural systems, different failure modes, and the code provisions (AASHTO) reflect that. I've done seismic bridge design in MIDAS Civil for projects in California and Japan, and the ductility-based design and seismic isolation tools are solid. Let me walk you through the workflow.

## AASHTO Seismic Provisions Overview

### AASHTO Guide Specifications for LRFD Seismic Bridge Design (2009)

1. Based on displacement-based design (not force-based)
2. Performance objectives:
   - **Life Safety (LE)**: Bridge may need replacement but no collapse
   - **Operational (OE)**: Bridge remains functional after earthquake
3. Seismic hazard:
   - **SEE (Safety Evaluation Earthquake)**: 1000-year return period (7% in 75 years)
   - **FEE (Functional Evaluation Earthquake)**: 300-year return period
4. Seismic design categories (SDC):
   - **SDC A**: Low seismicity (PGA < 0.15g) — minimal requirements
   - **SDC B**: Moderate seismicity (0.15g ≤ PGA < 0.30g)
   - **SDC C**: High seismicity (0.30g ≤ PGA < 0.50g)
   - **SDC D**: Very high seismicity (PGA ≥ 0.50g)

### Design Approaches by SDC

| SDC | Design Method |
|-----|--------------|
| A | No seismic design required (force-proportioned) |
| B | Limited displacement-based design |
| C | Displacement-based design with ductility |
| D | Full displacement-based design with ductility and capacity protection |

## Seismic Hazard Definition

### Response Spectrum

1. Load > Response Spectrum
2. Set per AASHTO:
   - **PGA**: Peak ground acceleration (e.g., 0.4g)
   - **Ss**: Short-period spectral acceleration (0.2s)
   - **S1**: 1-second spectral acceleration (1.0s)
   - **Site class**: A (rock) to E (soft soil)
   - **Damping**: 5% (default), 3% (steel), 5% (concrete)
3. MIDAS Civil generates the design response spectrum

### Time History (Optional)

1. For SDC D or critical bridges:
   - Use site-specific ground motions
   - Select 3-7 ground motion records matching the design spectrum
   - Scale to match the target spectrum
2. Load > Time History
3. Import ground motion records
4. Run time history analysis

## Displacement-Based Design

### Fundamental Period

1. Analysis > Modal
2. Obtain fundamental period (T) in each direction
3. For multi-span bridges:
   - Longitudinal period: T_L (along bridge axis)
   - Transverse period: T_T (perpendicular to bridge axis)

### Spectral Displacement

1. From the response spectrum:
   - **Sd = Sa × T² / (4 × π²)**: Spectral displacement
   - At the fundamental period T
2. For T = 1.0s and Sa = 0.5g: Sd = 0.5 × 9.81 × 1.0² / (4 × π²) = 0.124m = 124mm

### Displacement Demand

1. Calculate displacement demand:
   - **Δd = Cd × Sd**: Where Cd is displacement amplification factor
   - For single-mode analysis: Cd = 1.0
   - For multi-mode analysis: Per AASHTO 5.2
2. Check displacement capacity:
   - **Δc ≥ Δd**: Capacity must exceed demand

## Ductility Design

### Plastic Hinge Formation

1. For SDC C and D, allow plastic hinge formation in:
   - **Column tops**: At pier-cap beam connection
   - **Column bases**: At foundation connection
2. Plastic hinges provide ductility and energy dissipation
3. Design for:
   - **Expected moment (Mpe)**: Mpe = 1.3 × Mn (nominal moment × overstrength)
   - **Plastic rotation capacity**: Per AASHTO 8.5

### Column Ductility Check

1. Define > Hinge Properties > Column
2. Set:
   - **Yield moment**: My = fy × As × (d - a/2)
   - **Plastic rotation**: θp = Lp × (φp) where Lp = plastic hinge length
   - **Plastic hinge length**: Lp = 0.08 × L + 0.022 × fy × db (per AASHTO)
3. Assign hinges at column top and base
4. Run pushover analysis:
   - Push in each direction until target displacement
   - Check plastic rotation ≤ allowable (per AASHTO 8.5)

### Transverse Reinforcement (Confinement)

1. For ductile columns (SDC C and D):
   - **Volumetric ratio**: ρs ≥ 0.12 × f'c/fyt (spiral)
   - **Spacing**: s ≤ 100mm within plastic hinge zone
   - **Length of confinement**: Lc = max(1.5 × D, 600mm, Lp)
2. Use #13 to #19 spirals or ties at 75-100mm spacing in hinge zones

## Capacity Protection

### Capacity Protected Members

Members that should NOT yield (must remain elastic):
- **Superstructure**: Deck and girders
- **Foundation**: Piles, footings
- **Cap beams**: Pier cap beams
- **Bent connections**: Connections between columns and cap beams

### Overstrength Design

1. Design capacity-protected members for overstrength forces:
   - **Mpo = 1.3 × Mn**: Overstrength moment
   - **Vpo = 2 × Mpo / L**: Overstrength shear
2. Apply overstrength to:
   - Foundation: Design for Mpo and Vpo from columns
   - Cap beam: Design for Mpo from columns
   - Superstructure: Design for Mpo from columns
3. This ensures that plastic hinges form in columns (designed for ductility), not in foundations or superstructure (designed to remain elastic)

## Seismic Isolation

### Lead Rubber Bearings (LRB)

1. Model > Boundary > Isolator
2. Define LRB properties:
   - **Effective stiffness**: Keff = G × A / tr (G = rubber shear modulus, A = bonded area, tr = total rubber thickness)
   - **Yield force**: Qy = lead core area × lead shear strength
   - **Post-yield stiffness**: K2 = G × A / tr (same as rubber alone)
   - **Damping**: 15-25% (from lead core hysteresis)
3. Place isolators at pier tops and abutments

### Isolation Effect

1. Isolators lengthen the fundamental period:
   - **Fixed support**: T = 0.5s (typical)
   - **Isolated**: T = 2.0-3.0s
2. Longer period → lower spectral acceleration → lower seismic force
3. Trade-off: Larger displacement (but isolators accommodate this)

### Isolated Bridge Analysis

1. Analysis > Nonlinear > Time History
2. Use nonlinear isolator properties:
   - **Bilinear model**: K1 (initial), Qy (yield), K2 (post-yield)
3. Apply ground motion
4. Results:
   - **Isolator displacement**: Maximum displacement at each isolator
   - **Isolator force**: Maximum force transmitted
   - **Deck acceleration**: Reduced compared to fixed support
   - **Column forces**: Significantly reduced

### Isolator Displacement Check

1. Check maximum isolator displacement:
   - **Δmax ≤ Δallowable**: Per manufacturer specifications
   - Typical allowable: 200-500mm
2. If displacement exceeds allowable:
   - Increase rubber thickness
   - Add dampers (viscous or friction)
   - Use different isolator type

## Pushover Analysis for Bridges

### Longitudinal Pushover

1. Load > Pushover > Longitudinal
2. Apply incremental longitudinal displacement at deck level
3. Track:
   - **Column hinge formation**: At column bases
   - **Abutment contribution**: Soil passive resistance behind abutment
   - **Isolator behavior**: If isolated
4. Capacity curve: Base shear vs. deck displacement

### Transverse Pushover

1. Load > Pushover > Transverse
2. Apply incremental transverse displacement
3. Track:
   - **Column hinge formation**: At column tops and bases
   - **Cap beam behavior**: Check if cap beam remains elastic
   - **Soil-structure interaction**: Behind abutments
4. Capacity curve: Base shear vs. deck displacement

### Performance Point

1. Per AASHTO displacement coefficient method:
   - Calculate target displacement: Δt
   - Find performance point on capacity curve at Δt
   - Check plastic rotation at performance point
2. Acceptance criteria:
   - **Minimum**: Plastic rotation ≤ CP (Collapse Prevention)
   - **Life Safety**: Plastic rotation ≤ LS
   - **Operational**: Plastic rotation ≤ IO (if OE required)

## Soil-Structure Interaction

### Abutment Backfill

1. Model > Boundary > Abutment Spring
2. Set:
   - **Passive stiffness**: kp = soil passive resistance per unit displacement
   - **Maximum passive force**: Fp = soil passive pressure × wall area
3. Abutment backfill contributes significantly to seismic resistance in longitudinal direction

### Foundation Flexibility

1. Model > Boundary > Foundation Spring
2. Set:
   - **Vertical stiffness**: kz (per pile or spread footing)
   - **Horizontal stiffness**: kx, ky
   - **Rotational stiffness**: krx, kry, krz
3. Foundation flexibility increases period and displacement demand

## Common Seismic Bridge Issues

### Excessive Displacement Demand

**Cause**: Flexible columns, soft soil, or long fundamental period.
**Fix**: Increase column stiffness (larger columns), add seismic isolation, or add abutment engagement.

### Column Shear Failure

**Cause**: Insufficient transverse reinforcement.
**Fix**: Add confinement reinforcement in plastic hinge zones. Ensure shear capacity exceeds overstrength shear.

### Foundation Yielding

**Cause**: Foundation not designed for overstrength forces.
**Fix**: Increase foundation capacity. Design for Mpo and Vpo from columns.

### Unseating at Expansion Joints

**Cause**: Excessive relative displacement between deck segments.
**Fix**: Add restrainer cables, increase seat width, or use continuous deck.

## Wrapping Up

Seismic bridge design is fundamentally different from building seismic design — it's displacement-based, not force-based. The most important thing I've learned: make sure your plastic hinges form in the columns, not the foundations or superstructure. That's the whole point of capacity design. And don't forget to check unseating at expansion joints — that's a common failure mode in earthquakes, and it's easy to overlook. MIDAS Civil handles all of this well, but you need to understand the philosophy behind the code provisions.
