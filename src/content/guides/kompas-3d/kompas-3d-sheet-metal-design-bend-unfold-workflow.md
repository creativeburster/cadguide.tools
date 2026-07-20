---
title: "KOMPAS-3D Sheet Metal Design: Bend, Unfold, and Flat Pattern Workflow"
excerpt: "Guide to designing sheet metal parts in KOMPAS-3D — covering sheet body settings, bend creation, flat pattern generation, and drawing views — based on ASCON's official online academy course."
category: "workflow"
softwareSlug: "kompas-3d"
keyword: "kompas-3d sheet metal design bend unfold flat pattern"
slug: "kompas-3d-sheet-metal-design-bend-unfold-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://ascon.net/online-academy/05-sheet-metal-box/"
  - "https://help.ascon.ru/KOMPAS/24/en-US/idd_sheetmetal.html"
  - "https://www.linkedin.com/pulse/complete-guide-designing-sheet-metal-parts-%D0%BF%D0%B0%D0%B2%D0%B5%D0%BB-%D1%81%D0%B0%D0%BC%D1%83%D1%82%D0%B0-lmtxf"
---

# KOMPAS-3D Sheet Metal Design: Bend, Unfold, and Flat Pattern Workflow

KOMPAS-3D provides dedicated sheet metal design tools that handle bending, unfolding, and flat pattern generation. This guide documents the workflow based on ASCON's official online academy course "Sheet Metal Box" and the KOMPAS-3D help documentation.

## Sheet Metal Design Approaches in KOMPAS-3D

KOMPAS-3D offers two approaches to sheet metal design:

1. **Sheet Body (Оболочка)**: Start with a flat sheet and add bends — the traditional sheet metal workflow
2. **Convert solid to sheet**: Convert an existing solid part to a sheet metal part

The Sheet Body approach is recommended for new sheet metal designs.

## Step 1: Configure Sheet Metal Settings

Before creating any sheet metal geometry, configure the defaults:

1. Go to **Settings → Parameters** → **Current document → Sheet solid properties**
2. Configure:

### Thickness
- Set the default sheet thickness (e.g., 1.5 mm, 2 mm)
- This becomes the default for all new bends

### Bend Radius
- Set the default inner bend radius
- Recommended: R = S (radius equals sheet thickness) to avoid deformation
- The folds corresponding to contour corners in the sketch are drawn along the inner radius regardless of the selected construction method

### Bend Angle
- Select angle interpretation method
- Default is typically 90° for standard bends

### Bend Allowance / Sweep Length
Choose the method for calculating bend sweep length:
- **Coefficient (K-factor)**: Uses the neutral layer position coefficient (typically 0.25–0.5)
  - K-factor determines where the neutral axis lies within the material thickness
  - The outer side of the bend expands, the inner side compresses
  - K remains constant for a given material and thickness
- **Bend size**: Specify the sweep length explicitly
- **Reducing the bend**: Determine sweep by crease reduction value
- **Bend table**: Use a pre-defined bend table file for specific material/tool combinations

### Bend Release (Relief)
- Select the form of bend release (relief cut at bend corners)
- Options include rectangular, oblique, and custom shapes

### Important Note
All numeric fields (thickness, bend radius, etc.) correspond to sheet body variables. If a variable changes, the field updates automatically. Settings apply to new bends only — existing bends keep their original parameters.

## Step 2: Create the Base Sheet

1. Create a new part document
2. On the **Sheet Body Elements** panel, select **Sheet Body** (Оболочка)
3. Draw the base contour sketch:
   - The outline of the flat sheet before bending
   - Include all features that will be present in the flat pattern
4. Set the sheet thickness
5. The base sheet is created

## Step 3: Create Bends

1. On the **Sheet Body Elements** panel, select **Bend** (Сгиб)
2. Select the edge of the base sheet where the bend will be created
3. Specify:
   - **Bend angle**: Typically 90°, but can be any angle
   - **Bend radius**: Uses default from settings, or override
   - **Bend direction**: Up or down
4. The bend is created with the specified parameters

### Creating Multiple Bends
From the ASCON academy course:
1. Create the first bend
2. Create additional bends on adjacent edges
3. For corner bends (45° cuts): create bends with corner cuts to avoid interference
4. Adjust the shape of lateral sides as needed

### Bend Settings to Explore
- **Corner cuts**: Automatically cut corners where two bends meet
- **Bend release**: Relief cuts at bend start/end to prevent tearing
- **Reverse direction**: Change bend direction after creation

## Step 4: Add Cuts and Holes

1. Use standard KOMPAS-3D modeling tools to add features:
   - **Hole**: Add holes on bent flanges
   - **Cutout**: Create rectangular or circular cutouts
   - **Chamfer**: Add chamfers to edges
2. These features are automatically accounted for in the flat pattern

### Sheet Metal Design Guidelines

From the LinkedIn sheet metal design guide:

| Parameter | Guideline |
|---|---|
| Minimum hole diameter | D = S (sheet thickness) |
| Minimum wall between holes | S (sheet thickness) |
| Minimum internal cut radius | 1/10 × S |
| Internal bend radius | R ≥ S (avoid deformation) |
| External bend radius | R + S (maintain constant thickness) |
| Minimum bend height | H ≥ 2S + R (twice thickness plus radius) |

## Step 5: Unfold / Create Flat Pattern

1. On the **Sheet Body Elements** panel, select **Unfold** (Развернуть) or **Flat Pattern**
2. KOMPAS-3D calculates the flat pattern:
   - All bends are unfolded
   - Bend allowance is calculated using the configured method (K-factor, bend table, etc.)
   - The flat pattern shows the sheet as it would be cut before bending
3. The flat pattern can be displayed alongside the 3D model

### Flat Pattern Features
- Holes and cutouts appear in their unfolded positions
- Bend lines are marked on the flat pattern
- Dimensions can be added to the flat pattern for manufacturing

## Step 6: Create the Drawing

From the ASCON academy course:

1. Create a new drawing document
2. **Insert → Standard Views from Model**
3. Select the sheet metal part
4. Choose views:
   - **Isometric view**: Shows the bent part
   - **Flat pattern view**: Shows the unfolded sheet
5. Add dimensions:
   - Overall dimensions on the flat pattern
   - Bend angles and bend radii
   - Hole positions and sizes
6. Add a BOM if needed

### Drawing Requirements for Sheet Metal
Per the LinkedIn guide: "Detailed sheet metal construction drawings have very specific requirements, usually 2 types of drawing. One drawing should be created for the part when it is still flat, and another drawing is needed for the product after all the sheet metal has been designed and bent properly."

## Importing Sheet Metal from Other CAD Systems

KOMPAS-3D can import sheet metal parts from other CAD systems:

1. Import the STEP/SolidWorks/NX file
2. KOMPAS-3D detects sheet metal features if the import preserves bend information
3. If bends are not recognized:
   - Use the **Convert to Sheet Body** command
   - KOMPAS-3D attempts to identify bends and convert them to editable sheet metal features
4. After conversion, the part can be unfolded and modified

## Common Issues

### Issue: Bend Cannot Be Created
- The selected edge may not be on a sheet body — ensure the base is created as a Sheet Body, not a regular solid
- The bend angle may be too extreme for the material thickness
- Adjacent geometry may interfere with the bend

### Issue: Flat Pattern Shows Errors
- Bend allowance calculation may be incorrect — check K-factor or bend table settings
- Self-intersections in the flat pattern indicate overlapping bends
- Holes that fall on bend lines may distort during unfolding

### Issue: Imported Sheet Metal Cannot Be Unfolded
- The import may have lost bend information
- Use Convert to Sheet Body to re-establish sheet metal features
- If conversion fails, the part may need to be remodeled in KOMPAS-3D

## Best Practices

1. **Set sheet metal defaults first**: Configure thickness, radius, K-factor before creating geometry
2. **Use K-factor for standard materials**: K = 0.33 for most steel, K = 0.5 for soft materials
3. **Use bend tables for production accuracy**: Match the bend table to your actual press brake tooling
4. **Design for manufacturability**: Follow the minimum dimension guidelines (hole size, bend height, etc.)
5. **Create both drawings**: Flat pattern for laser cutting, bent view for assembly reference
6. **Test unfold early**: Unfold the part after creating the first few bends to verify the flat pattern is correct
7. **Save sheet metal templates**: Create template files with pre-configured sheet metal settings for common materials
