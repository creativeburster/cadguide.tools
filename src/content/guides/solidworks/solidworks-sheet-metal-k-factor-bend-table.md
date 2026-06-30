---
title: "Configuring K-Factor and Bend Tables for Accurate Sheet Metal Flat Patterns in SolidWorks"
excerpt: "Complete guide to setting up K-factor values, bend allowance tables, and gauge tables in SolidWorks to produce manufacturing-accurate flat patterns for sheet metal fabrication."
category: "manufacturing"
softwareSlug: "solidworks"
keyword: "solidworks sheet metal k factor"
slug: "solidworks-sheet-metal-k-factor-bend-table"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-25"
sources:
  - "https://help.solidworks.com/2026/English/SolidWorks/SWHelp/Article_ID/Sheet_Metal_K_Factor.htm"
  - "https://help.solidworks.com/2026/English/SolidWorks/SWHelp/Article_ID/Bend_Tables.htm"
---

# Configuring K-Factor and Bend Tables for Accurate Sheet Metal Flat Patterns in SolidWorks

I learned the hard way that getting the K-factor wrong in sheet metal design is an expensive mistake. I once sent a batch of brackets to fabrication with a default K-factor, and every single one came back too short — the bend allowance was off by just enough to make the mounting holes misalign. That's when I decided to actually understand what the K-factor does and how to configure it properly in SolidWorks. Let me share what I've learned, from the theory to the practical setup of bend tables and gauge tables.

## Understanding the K-Factor

When sheet metal is bent, the material on the inside of the bend compresses and the material on the outside stretches. Somewhere between these two surfaces is a neutral axis where the material neither compresses nor stretches. The K-factor is the ratio of the neutral axis distance from the inside surface to the material thickness:

```
K = t / T
```

Where:
- `t` = distance from inside surface to neutral axis
- `T` = total material thickness

### Typical K-Factor Values

| Material | Soft Aluminum | Hard Aluminum | Steel | Stainless Steel |
|---|---|---|---|---|
| K-factor | 0.33 | 0.38 | 0.40 | 0.44 |

The K-factor varies based on:
- **Material type**: Softer materials allow more plastic deformation, shifting the neutral axis inward (lower K-factor).
- **Material thickness**: Thicker materials shift the neutral axis outward (higher K-factor).
- **Bend radius**: Tighter bend radii shift the neutral axis inward (lower K-factor).
- **Bend method**: Air bending produces a different K-factor than bottom bending or coining.

## Step 1: Set the Default K-Factor in SolidWorks

### Global Default

1. Go to Tools > Options > Document Properties > Sheet Metal.
2. Under "Bend Allowance," select "K-Factor" as the bend allowance type.
3. Enter the K-factor value (e.g., `0.40` for mild steel).
4. Set the K-factor base to "Inside" (the default and most common convention).

### Per-Bend Override

For individual bends that require a different K-factor (e.g., a very tight radius bend in a different material):

1. Open the sheet metal part.
2. In the feature tree, right-click the specific bend feature.
3. Select "Edit Feature."
4. In the Bend Properties panel, override the K-factor value.
5. Click OK.

The per-bend K-factor overrides the document default for that specific bend only.

## Step 2: Create a Bend Table

Bend tables provide K-factor values that vary based on bend radius and material thickness, which is more accurate than using a single K-factor for all bends.

### Create a Bend Table File

1. Go to Tools > Options > Document Properties > Sheet Metal.
2. Under "Bend Allowance," select "Bend Table."
3. Click "Browse" and navigate to a location to save the table.
4. Click "New" to create a new bend table.

SolidWorks creates a sample bend table file (`.xls` or `.txt` format). Edit the table to match your fabrication shop's standards.

### Excel Bend Table Format

| Thickness (mm) | Radius 0.5 | Radius 1.0 | Radius 2.0 | Radius 3.0 | Radius 5.0 |
|---|---|---|---|---|---|
| 0.5 | 0.35 | 0.38 | 0.40 | 0.42 | 0.44 |
| 1.0 | 0.33 | 0.35 | 0.38 | 0.40 | 0.42 |
| 1.5 | 0.32 | 0.34 | 0.36 | 0.38 | 0.40 |
| 2.0 | 0.30 | 0.33 | 0.35 | 0.37 | 0.39 |
| 3.0 | 0.28 | 0.31 | 0.33 | 0.35 | 0.37 |

Each cell contains the K-factor for the corresponding thickness and radius combination. SolidWorks interpolates between entries for values not explicitly listed.

### Text Bend Table Format

For environments without Excel, use the text format:

```
; SolidWorks Bend Table
; Units: mm
;
; Thickness    Radius    K-Factor
0.5            0.5        0.35
0.5            1.0        0.38
0.5            2.0        0.40
1.0            0.5        0.33
1.0            1.0        0.35
1.0            2.0        0.38
```

Save the file with a `.btl` extension in the SolidWorks bend table directory:

```
C:\Program Files\SolidWorks Corp\SolidWorks\lang\english\sheetmetal bend tables\
```

### Apply the Bend Table

1. Go to Tools > Options > Document Properties > Sheet Metal.
2. Under "Bend Allowance," select "Bend Table."
3. Browse to and select the bend table file.
4. Click OK.

All new bends in the current document will use the K-factor from the table based on their thickness and radius.

## Step 3: Create a Gauge Table

Gauge tables define the available material thicknesses and their associated properties. When a gauge table is active, SolidWorks restricts thickness selections to the gauges listed in the table, preventing users from entering non-standard thicknesses.

### Create a Gauge Table

1. Go to Tools > Options > Document Properties > Sheet Metal.
2. Under "Gauge Table," click "Browse."
3. Click "New" and save the file.

### Excel Gauge Table Format

| Gauge | Thickness (mm) | Material | K-Factor | Bend Radius |
|---|---|---|---|---|
| 20 | 0.9 | Steel | 0.38 | 0.9 |
| 18 | 1.2 | Steel | 0.38 | 1.2 |
| 16 | 1.6 | Steel | 0.40 | 1.6 |
| 14 | 2.0 | Steel | 0.40 | 2.0 |
| 12 | 2.6 | Steel | 0.42 | 2.6 |
| 10 | 3.4 | Steel | 0.42 | 3.4 |

Create separate gauge tables for different materials (Steel, Aluminum, Stainless Steel) since gauge numbers correspond to different thicknesses for each material.

### Apply the Gauge Table

1. In the sheet metal part, go to the Sheet Metal feature in the feature tree.
2. Edit the feature.
3. In the Sheet Metal PropertyManager, check "Use gauge table."
4. Select the appropriate gauge table from the dropdown.
5. The thickness field now shows a dropdown of available gauges instead of a free-text input.

## Step 4: Verify Flat Pattern Accuracy

After configuring K-factor and bend tables, verify the flat pattern against a known-good sample:

### Create a Test Part

1. Create a simple L-bracket with known dimensions:
   - Leg 1: 50 mm
   - Leg 2: 50 mm
   - Thickness: 1.5 mm (16 gauge steel)
   - Bend radius: 1.5 mm
   - Bend angle: 90 degrees

2. Flatten the part (right-click the flat pattern in the feature tree > "Flatten").

3. Measure the total flat length:
   ```
   Tools > Evaluate > Measure
   ```
   Select both ends of the flattened part.

### Expected Flat Length Calculation

```
Flat Length = Leg1 + Leg2 + Bend Allowance

Bend Allowance = (π/180) × Angle × (R + K × T)
Bend Allowance = (π/180) × 90 × (1.5 + 0.40 × 1.5)
Bend Allowance = (π/180) × 90 × 2.1
Bend Allowance = 3.30 mm

Flat Length = 50 + 50 + 3.30 = 103.30 mm
```

If the measured flat length matches the calculated value (within 0.1 mm), the K-factor configuration is correct. If not, adjust the K-factor and re-measure.

### Physical Verification

Cut a sample part from the actual material and measure it after bending. Compare the physical dimensions to the SolidWorks model. If the physical part is longer than expected, decrease the K-factor. If shorter, increase the K-factor.

## Step 5: Configure Bend Deduction (Alternative to K-Factor)

Some fabrication shops prefer to work with bend deduction rather than K-factor. Bend deduction is the amount subtracted from the total flat length to account for the material consumed by the bend.

### Switch to Bend Deduction

1. Go to Tools > Options > Document Properties > Sheet Metal.
2. Under "Bend Allowance," select "Bend Deduction."
3. Enter the bend deduction value (in mm or inches).

### Bend Deduction Table

Create a bend deduction table with the same format as the K-factor bend table, but with bend deduction values instead:

| Thickness (mm) | Radius 1.0 | Radius 2.0 | Radius 3.0 |
|---|---|---|---|
| 1.0 | 1.65 | 2.20 | 2.75 |
| 1.5 | 2.10 | 2.80 | 3.50 |
| 2.0 | 2.60 | 3.40 | 4.20 |

The relationship between K-factor and bend deduction is:

```
BD = 2 × (R + T) × tan(A/2) - BA
```

Where `BA` is the bend allowance calculated from the K-factor. If your shop provides bend deduction values, use them directly — do not convert to K-factor, as the conversion introduces rounding errors.

## Step 6: Export Flat Patterns for Manufacturing

### DXF Export

1. Right-click the flat pattern in the feature tree.
2. Select "Export to DXF/DWG."
3. In the export dialog:
   - Set format to "DXF"
   - Set version to "R2010" or later
   - Check "Export bend lines" to include bend centerlines
   - Check "Export sketch entities" to include any sketches on the flat pattern

4. Click OK and save the file.

### Common DXF Export Issues

- **Missing bend lines**: Ensure bend lines are set to "Show" in the flat pattern view.
- **Incorrect units**: Verify the DXF export units match the manufacturing equipment's expected units (mm or inches).
- **Splines instead of arcs**: Some laser cutters do not support splines. In the export options, set "Spline to arc" conversion with a tolerance of `0.01 mm`.
