---
title: "IDEA StatiCa Steel Connection Design: Base Plate and Moment Connection Workflow"
excerpt: "How to design steel connections in IDEA StatiCa — covering base plate design, moment connection modeling, weld sizing, bolt layout, and code checking per AISC and Eurocode."
category: "workflow"
softwareSlug: "idea-statica"
keyword: "idea statica steel connection base plate moment"
slug: "idea-statica-steel-connection-base-plate-moment"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.ideastatica.com/support-center/base-plate-connections-aisc"
  - "https://www.ideastatica.com/blog/complete-base-plate-workflow"
---

# IDEA StatiCa Steel Connection Design: Base Plate and Moment Connection Design

IDEA StatiCa is the best steel connection design tool I've used. It uses CBFEM (Component-Based Finite Element Method) — combining component-based design with FEM analysis. I design 20+ connections per project in IDEA StatiCa. Here's the workflow for base plates and moment connections.

## What Is CBFEM?

CBFEM combines two approaches:
- **Component method**: The connection is broken into components (bolts, welds, plates, T-stubs) with known behavior
- **Finite element method**: Each component is meshed and analyzed with FEM for stress distribution

This gives accurate results without the complexity of full FEM modeling. IDEA StatiCa handles the meshing and analysis automatically — you focus on the connection geometry.

## Base Plate Design

### Step 1: Create a New Connection

1. Open IDEA StatiCa → **Connection** → **New Project**.
2. Select design code:
   - **AISC 360-22** (US)
   - **Eurocode 3 (EN 1993-1-8)** (EU)
3. Select connection type: **Column base**.

### Step 2: Define Column and Base Plate

1. **Column**:
   - Select section: W14×90 (AISC) or HEA 240 (Eurocode)
   - Material: A992 or S355
   - Orientation: Strong axis or weak axis

2. **Base plate**:
   - **Dimensions**: Width × Depth × Thickness
     - Width = column width + 100-150mm each side
     - Depth = column depth + 100-150mm each side
     - Thickness = 20-40mm (typical for moment connections)
   - **Hole pattern**: 4 anchor bolts (typical) or 6-8 for large columns
   - **Anchor bolt type**: 
     - ASTM F1554 Grade 36 (AISC) or 4.6/5.6 (Eurocode)
     - Diameter: 20-30mm typical
     - Embedment length: 12-16× bolt diameter

3. **Grout**:
   - Thickness: 25-50mm
   - Grout strength: ≥ concrete strength

4. **Concrete**:
   - Pedestal dimensions: Base plate + 100-200mm each side
   - Concrete strength: 25-35 MPa (f'c = 4000-5000 psi)

### Step 3: Apply Loads

1. Import loads from structural analysis (Robot, ETABS, SAP2000):
   - **Axial force (N)**: Compression or tension
   - **Shear force (V)**: In both directions
   - **Moment (M)**: About both axes

2. Or enter loads manually:
   - **N = -500 kN** (compression)
   - **Vx = 100 kN**
   - **Vy = 50 kN**
   - **My = 200 kN·m** (major axis moment)

3. Define load combinations:
   - IDEA StatiCa auto-generates combinations from the imported load cases
   - Or define manually: 1.2D + 1.0E + 0.5L

### Step 4: Analysis and Code Check

1. Click **Calculate**.
2. IDEA StatiCa performs CBFEM analysis:
   - Meshes all components (base plate, anchors, concrete)
   - Applies the loads
   - Calculates stresses and strains
   - Checks each component against the design code

3. Results display as a **traffic light** system:
   - **Green**: Component passes (utilization < 90%)
   - **Yellow**: Component is near capacity (utilization 90-100%)
   - **Red**: Component fails (utilization > 100%)

4. Check each component:

| Component | What's Checked |
|-----------|---------------|
| Base plate | Bending yield, bearing on concrete |
| Anchor bolts (tension) | Tensile strength, pullout, breakout |
| Anchor bolts (shear) | Shear strength, concrete edge failure |
| Concrete | Bearing capacity, splitting |
| Weld (column to base plate) | Weld shear, weld tension |
| Grout | Compressive strength |

### Step 5: Optimize

If any component fails (red):

**Base plate too thin**: Increase thickness. For a W14×90 column with 200 kN·m moment, a 30mm plate is typically adequate. If utilization > 100%, try 35mm or 40mm.

**Anchor bolts fail in tension**: 
- Increase bolt diameter (from 24mm to 30mm)
- Increase embedment length
- Add more bolts (from 4 to 6 or 8)
- Use higher grade bolts (F1554 Grade 55 instead of Grade 36)

**Concrete bearing failure**:
- Increase pedestal size
- Increase concrete strength
- Add reinforcement (rebar cage in pedestal)

**Weld failure**: Increase weld size. For column-to-base-plate weld, use full-penetration weld for moment connections. Fillet welds are acceptable for axial-only connections.

## Moment Connection (Beam-to-Column)

### Step 1: Create Connection

1. **Connection** → **New** → **Beam to column**.
2. Select connection type:
   - **End plate**: Bolted end plate connection (most common for moment connections)
   - **Flange plate**: Bolted flange plate connection
   - **Welded**: Directly welded beam to column

### Step 2: Define Geometry

1. **Column**: W14×90, A992
2. **Beam**: W18×35, A992
3. **End plate**:
   - **Dimensions**: Width = beam flange width + 50mm; Depth = beam depth + 100-150mm
   - **Thickness**: 15-25mm (calculate based on bolt force and plate bending)
4. **Bolts**:
   - **Type**: A325 or A490 (AISC) / 8.8 or 10.9 (Eurocode)
   - **Diameter**: 20-24mm typical
   - **Layout**: 4 bolts (2 rows of 2) for moderate moment; 6-8 bolts for high moment
   - **Spacing**: 3× bolt diameter minimum, 70-100mm typical

### Step 3: Apply Loads

1. Import from structural model:
   - **Moment**: 150 kN·m
   - **Shear**: 80 kN
   - **Axial**: 20 kN (if applicable)

### Step 4: Calculate and Check

1. Click **Calculate**.
2. Check components:

| Component | What's Checked |
|-----------|---------------|
| End plate | Bending yield (T-stub model) |
| Bolts (tension) | Tensile strength |
| Bolts (shear) | Shear strength, bearing on plate |
| Column flange | Bending yield (T-stub model) |
| Column web | Transverse compression, panel zone shear |
| Weld (beam to end plate) | Weld shear, weld tension |
| Beam web | Shear yield, block shear |

3. Common failures:

**End plate too thin**: The plate bends under bolt tension force. Increase plate thickness. For a 150 kN·m moment with M24 bolts, a 20mm plate is typically adequate.

**Column flange too thin**: The column flange bends outward under bolt tension. Solutions:
- Increase column size (heavier section with thicker flange)
- Add backing plates (stiffener plates on the column flange)
- Use a thicker end plate (distributes force over larger area)

**Panel zone shear**: The column web yields under the beam moment. Solutions:
- Add web doubler plates (welded to column web)
- Increase column size
- Add transverse stiffeners

### Step 5: Stiffeners

Add stiffeners as needed:

1. **Transverse stiffeners**: Plates welded to the column web at the beam flange level. Prevent column web yielding and flange bending.
2. **Web doubler**: Plate welded to the column web to increase panel zone shear capacity.
3. **Backing plate**: Plate on the outside of the column flange to increase T-stub capacity.

IDEA StatiCa automatically evaluates whether stiffeners are needed based on the code check results. Add them and re-calculate.

## Reporting

1. Click **Report**.
2. IDEA StatiCa generates a professional report including:
   - Connection geometry with dimensions
   - Applied loads and combinations
   - Code check results for each component
   - Stress and deformation diagrams
   - Bolt and weld specifications
3. Export as PDF for submission to the reviewing engineer.

## Integration with Structural Models

IDEA StatiCa integrates with:
- **Autodesk Robot**: Export connection forces directly
- **ETABS**: Export connection forces via spreadsheet
- **SAP2000**: Export connection forces via spreadsheet
- **Revit**: Import connection geometry for detailing

This integration eliminates manual load entry — the forces from the structural model flow directly into the connection design.
