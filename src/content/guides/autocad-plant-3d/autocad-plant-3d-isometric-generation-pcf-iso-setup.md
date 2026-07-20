---
title: "AutoCAD Plant 3D Isometric Generation: Configuring PCF Output and Iso Styles"
excerpt: "How to configure Plant 3D isometric generation settings — covering PCF export, iso style customization, annotation placement, dimensioning options, and troubleshooting missing components in generated isos."
category: "workflow"
softwareSlug: "autocad-plant-3d"
keyword: "autocad plant 3d isometric generation pcf iso setup"
slug: "autocad-plant-3d-isometric-generation-pcf-iso-setup"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/plant-3d-features-issues-bugs-programming/td-p/10076331"
  - "https://forums.autodesk.com/t5/autocad-plant-3d-forum/pcf-to-pipe-not-importing-correctly-from-cadworx/td-p/6575039"
---

# AutoCAD Plant 3D Isometric Generation: Configuring PCF Output and Iso Styles

Generating isometrics is the final and most critical output from Plant 3D. We've seen shops waste weeks re-generating isos because the iso style wasn't configured correctly. A single misconfigured annotation template can make every iso in a project unusable. Here's how to set up isometric generation properly the first time.

## Understanding the Isometric Generation Pipeline

Plant 3D generates isometrics through this pipeline:

1. **Model** — 3D pipe model with components
2. **PCF file** — Plant 3D exports a PCF (Piping Component File) for each line
3. **Isogen** — The ISOGEN engine processes the PCF and generates the isometric drawing
4. **Iso drawing** — Final DWG or PDF output

The PCF is the critical intermediate file. If the PCF is wrong, the iso will be wrong.

## Step 1: Configure Iso Styles

Iso styles control the appearance and content of generated isometrics. Plant 3D ships with default styles, but most projects need customization.

1. Go to **Project Manager** → **Iso Configuration** → **Iso Styles**.
2. Right-click → **New Iso Style** or edit an existing one.
3. Configure each tab:

### General Tab

- **Style Name**: Use a descriptive name (e.g., `A3-Metric-Standard`)
- **Output Format**: DWG, PDF, or both
- **Drawing Size**: A1, A2, A3, or custom
- **Units**: Metric or Imperial

### Annotation Tab

Annotations are the text labels on isometrics — component tags, coordinates, weld numbers. This is where most customization happens.

1. **Component Annotations**: Define what text appears on each component type.
2. **Position**: Set annotation placement (above, below, left, right of component).
3. **Leader Lines**: Configure leader line style and length.
4. **Text Style**: Set font, size, and color.

Common annotation issues:
- **Overlapping text**: Adjust annotation spacing and priority
- **Missing tags**: Ensure component properties are populated in the model
- **Wrong units in annotations**: Check the Units setting in the iso style

### Dimensioning Tab

- **Dimension Type**: True dimensioning or coordinate dimensioning
- **Dimension Precision**: Set decimal places for dimensions
- **Cutback Dimensions**: Configure how pipe lengths between components are dimensioned
- **Continuation Dimensions**: How dimensions flow across drawing breaks

### Symbol Tab

- **Component Symbols**: Customize how each component type appears (valve symbol, fitting orientation)
- **Symbol Libraries**: Map spec components to iso symbols
- **Custom Symbols**: Create custom symbols for non-standard components

## Step 2: Configure PCF Export Settings

The PCF file is the bridge between the 3D model and the isometric drawing. If the PCF is incomplete or incorrect, isos will have missing or wrong components.

1. Go to **Project Setup** → **PCF Export Settings**.
2. Configure:
   - **Component Export**: Ensure all component types are included
   - **Property Export**: Select which properties to include in the PCF
   - **End Type Mapping**: Map Plant 3D end types to PCF end codes
   - **Coordinate System**: Set the coordinate system for PCF output

### Common PCF Issues

**Missing components in isos**: The component is in the model but not in the PCF. Check that the component's spec is correctly configured and the component type is included in the PCF export settings.

**Wrong component type in isos**: The PCF has the component but with the wrong type code. This usually happens when importing PCFs from CADWorx — the end codes don't match between CADWorx and Plant 3D. You need to customize the end code mapping in the spec.

**Custom parts in isos**: When components insert as custom parts (common with CADWorx PCF imports), the iso will show them as generic blocks. Fix by ensuring the spec has matching end codes for all imported components.

## Step 3: Set Up Iso Generation Batches

For large projects, generating isos one at a time is impractical. Plant 3D supports batch generation.

1. Go to **Project Manager** → **Iso Drawings**.
2. Select multiple lines for batch generation.
3. Right-click → **Generate Isometrics**.
4. Choose the iso style for the batch.

### Batch Generation Tips

- **Group by line number** — generate all isos for one line at a time
- **Limit batch size** — 20-30 isos per batch to avoid memory issues
- **Close other applications** — iso generation is CPU-intensive
- **Monitor background processes** — check Task Manager for stuck IsogenBatch processes

## Step 4: Configure Drawing Breaks and Continuations

Large pipe lines won't fit on a single iso sheet. Plant 3D automatically breaks them across multiple drawings with continuation references.

1. In the Iso Style → **Drawing Breaks** tab.
2. Configure:
   - **Break Method**: Automatic or manual break points
   - **Maximum Components per Sheet**: Typically 15-25
   - **Continuation Label Format**: How break points are labeled (e.g., `SHT 2/4`)
   - **Match Line**: How the continuation is indicated on both sheets

## Step 5: Troubleshooting Isometric Generation

### Isos Won't Generate

1. Check the PCF file was created — look in the project's `PCF` folder.
2. Open the PCF in a text editor and verify it contains component data.
3. Check the Isogen log file for errors.
4. Verify the iso style is correctly configured.

### Missing Dimensions

1. Check the Dimensioning tab in the iso style.
2. Ensure the model has correct coordinates and pipe lengths.
3. Verify the dimension precision isn't set to 0 decimal places.

### Wrong Component Symbols

1. Check the Symbol tab in the iso style.
2. Verify the symbol library mapping is correct.
3. For custom components, create custom symbols in the symbol library.

### Isos Take Too Long to Generate

1. Reduce the number of components per sheet.
2. Simplify the model — hide unnecessary structural and equipment components.
3. Generate isos in smaller batches.
4. Ensure you're working locally, not on a network drive.

## Best Practices

- **Create project-specific iso styles** — don't modify the default styles
- **Test iso styles early** — generate a sample iso before committing to production
- **Maintain a style library** — save working iso styles for reuse across projects
- **Document custom annotations** — keep a record of annotation configurations for consistency
- **Review isos with the piping team** — get feedback on annotation placement and dimensioning before finalizing
