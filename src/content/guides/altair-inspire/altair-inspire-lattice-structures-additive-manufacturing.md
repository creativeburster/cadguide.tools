---
title: "Altair Inspire Lattice Structures for Additive Manufacturing"
excerpt: "Guide to designing lattice structures in Altair Inspire for additive manufacturing — covering lattice types, field-driven design, and the Inspire Print3D workflow for metal AM."
category: "manufacturing"
softwareSlug: "altair-inspire"
keyword: "altair inspire lattice structure additive manufacturing 3d printing"
slug: "altair-inspire-lattice-structures-additive-manufacturing"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-12"
sources:
  - "https://altair.com/lattice-structures"
  - "https://altair.com/additive-manufacturing"
  - "https://www.trueinsight.io/blog/additive-manufacturing-altair"
---

# Altair Inspire Lattice Structures for Additive Manufacturing

Lattice structures are one of the key applications of additive manufacturing — they enable lightweight parts with engineered mechanical properties that are impossible to produce with traditional manufacturing. Altair Inspire provides tools for designing, optimizing, and validating lattice structures for AM.

## What Are Lattice Structures?

According to Altair's documentation, lattice structures are periodic or stochastic cellular geometries that fill a volume with a repeating pattern of struts, nodes, and faces. They provide:

- **Weight reduction**: Replacing solid material with lattice can reduce mass by 50-80% while maintaining structural integrity
- **Engineered stiffness**: Lattice density and cell type can be varied to control local stiffness
- **Energy absorption**: Specific lattice types (e.g., Kelvin cells) excel at absorbing impact energy
- **Heat transfer**: Lattice structures can serve as internal heat exchangers
- **Biocompatibility**: Trabecular lattice structures mimic bone structure for medical implants

## Lattice Types in Altair Inspire

Altair Inspire supports several lattice types through its implicit modeling capabilities:

### Strut Lattices
- **Kelvin**: Space-filling polyhedron, good for isotropic properties
- **Octet**: Face-centered cubic, high stiffness-to-weight ratio
- **Star**: Low density, good for weight reduction
- **Gyroid**: Triply periodic minimal surface, excellent for heat exchangers and fluid flow

### Surface Lattices
- **TPMS (Triply Periodic Minimal Surfaces)**: Includes Gyroid, Schwarz, Diamond — smooth, continuous surfaces with no sharp joints
- **Custom**: User-defined surface patterns

### Field-Driven Lattices
According to Altair's AM documentation, Inspire supports field-driven design where lattice parameters (strut thickness, cell size) vary based on a scalar field:

- **Thickness field**: Strut diameter varies based on stress distribution — thicker struts in high-stress areas, thinner in low-stress areas
- **Density field**: Cell size varies — smaller cells where more support is needed
- **Transition zones**: Smooth transitions between lattice and solid regions

## Design Workflow

### Step 1: Define the Part Volume
1. Import or create the part geometry in Inspire
2. Define the outer envelope (the skin of the final part)
3. Identify which regions should be solid (mounting interfaces, threads) and which can be lattice

### Step 2: Run Topology Optimization (Optional)
For optimal results, run topology optimization first to identify where material is needed:
1. Define loads, supports, and design space
2. Run topology optimization with a low mass target (e.g., 20%)
3. The result shows where solid material is required
4. Use this as a guide for where to place solid regions vs. lattice regions

### Step 3: Generate the Lattice
1. On the **Implicit ribbon**, select the lattice tool
2. Choose the lattice type (e.g., Gyroid, Kelvin, Octet)
3. Define the cell size (typically 2-10 mm for metal AM)
4. Define the strut/wall thickness (typically 0.3-1.5 mm for metal AM)
5. Select the volume to fill with lattice
6. Generate the lattice

### Step 4: Apply Field-Driven Design (Optional)
To vary lattice parameters based on structural analysis:
1. Run a structural analysis on the solid part
2. Export the stress field as a scalar field
3. Apply the field to the lattice thickness parameter
4. The lattice automatically thickens struts in high-stress areas

### Step 5: Validate with FEA
According to Altair's documentation: "Engineers can easily run FEA for complex lattice structures using embedded solvers in Altair Inspire for validation."

1. On the Structure ribbon, click **Run Analysis**
2. Select the solver (OptiStruct or built-in)
3. The solver handles the lattice geometry directly — no need to convert to solid mesh
4. Review stress and displacement results
5. Iterate on lattice parameters if needed

## Inspire Print3D for Metal AM

Altair Inspire Print3D is a specialized module for metal additive manufacturing (Powder Bed Fusion and Metal Binding Printing). According to Altair's product page, it enables teams to "cut product development and additive manufacturing costs by reducing material usage, print times and post-processing requirements."

### Print3D Workflow

Based on Altair's official Print3D tutorial:

#### Step 1: Select the Part
1. Select the PolyNURBS or lattice part in the modeling window
2. Assign a material (e.g., AlSi10Mg for aluminum AM)

#### Step 2: Orient the Part
1. Use the orientation tools to find the optimal build direction
2. Consider:
   - Minimizing support material
   - Minimizing build height (affects print time)
   - Critical surface quality (upward-facing surfaces have better finish)
   - Stress orientation (avoid placing high-stress areas perpendicular to build layers)

#### Step 3: Generate Supports
1. Use the support generation tools
2. Support types:
   - **Block supports**: Standard supports for overhangs
   - **Contour supports**: For curved surfaces
   - **Tree supports**: Minimal contact points, easier to remove

#### Step 4: Slice the Model
1. Use the slicing tool to generate layer-by-layer data
2. Set layer thickness (typically 30-60 microns for metal PBF)

#### Step 5: Run AM Simulation
1. Set process parameters
2. Enable calibrations (select the appropriate calibration for your material)
3. Click **Run** to simulate the thermal process
4. The simulation predicts:
   - Residual stresses
   - Distortion (warpage)
   - Build failures

#### Step 6: Export
1. Click the **Export** icon
2. Enable both Part and Support checkboxes
3. The part and support files are generated separately
4. Export format: STL or 3MF for direct input to the AM machine

## Design Guidelines for Lattice AM

### Cell Size
- **Too small (< 1 mm)**: Powder/uncured resin cannot be removed from cells
- **Too large (> 15 mm)**: Lattice loses its structural advantage, behaves like individual struts
- **Recommended**: 2-10 mm for metal PBF, 1-5 mm for polymer processes

### Strut Thickness
- **Too thin (< 0.2 mm)**: Struts may not form properly in metal PBF
- **Too thick (> 2 mm)**: Weight reduction benefit is lost
- **Recommended**: 0.3-1.5 mm for metal PBF

### Overhangs
- Metal PBF: Overhangs > 45° from vertical need supports
- Lattice struts are generally self-supporting up to 45° due to their thin cross-sections
- Gyroid and TPMS surfaces are self-supporting at most angles — a major advantage for AM

### Escape Holes
- For enclosed lattice cells, add escape holes for powder removal
- Minimum hole diameter: 3-5 mm for metal PBF
- Place holes on non-critical surfaces

## Use Cases

According to the TrueInsight blog on Altair's AM solutions:

- **Aerospace brackets**: Lattice-filled brackets achieve 40-60% weight reduction while meeting stiffness requirements
- **Medical implants**: Trabecular lattice structures promote bone ingrowth in orthopedic implants
- **Heat exchangers**: Gyroid lattice creates high-surface-area internal channels for efficient heat transfer
- **Energy absorption**: Lattice-filled crash structures absorb impact energy in a controlled manner
