---
title: "CADWorx ISOGEN Configuration: We-Configure Setup for Custom Isometric Output"
excerpt: "How to configure ISOGEN in CADWorx using we-Configure — covering style settings, symbol mapping, annotation placement, dimensioning options, BOM reports, and troubleshooting missing symbols and wrong component representations in isometrics."
category: "workflow"
softwareSlug: "cadworx"
keyword: "cadworx isogen configuration i-configure isometric output setup"
slug: "cadworx-isogen-configuration-i-configure-isometric-output-setup"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://www.ecedesign.com/2014/06/23/configuring-isogen-in-cadworx-2015/"
  - "https://docs.hexagonppm.com/r/en-US/CADWorx-Plant/24/902857"
---

# CADWorx ISOGEN Configuration: We-Configure Setup for Custom Isometric Output

ISOGEN is the engine that turns your 3D CADWorx model into fabrication-ready isometric drawings. We've configured ISOGEN for dozens of projects, and the difference between a good configuration and a bad one is the difference between isometrics that fabricators can use and isometrics that generate RFIs. Here's how to configure we-Configure for professional isometric output.

## Understanding the ISOGEN Pipeline in CADWorx

CADWorx generates isometrics through this pipeline:

1. **3D Model** — pipe routes with components
2. **PCF File** — CADWorx exports a PCF (Piping Component File) for each line
3. **we-Configure** — defines how ISOGEN processes the PCF
4. **ISOGEN** — generates the isometric drawing from the PCF
5. **Output** — DWG, PDF, or both

We-Configure is the control panel. Every aspect of the isometric appearance — symbols, annotations, dimensions, BOM, border — is configured here.

## Step 1: Open we-Configure

1. From CADWorx, go to **ISO** → **we-Configure**.
2. Or launch we-Configure from the Windows Start Menu.
3. The Home screen displays key configuration areas:
   - **Style**: Visual appearance
   - **Symbol**: Component representations
   - **Annotation**: Text labels
   - **Report**: BOM and material reports
   - **Border**: Drawing border and title block

4. If working with a CADWorx project, we-Configure loads the project's configuration automatically.

## Step 2: Configure Style Settings

The Style tab controls the overall appearance of isometric drawings.

### Drawing Format

1. Go to **Style** → **Drawing**.
2. Configure:
   - **Drawing Size**: A1, A2, A3, A4, or custom
   - **Orientation**: Portrait or Landscape
   - **Units**: Metric or Imperial
   - **Scale**: Automatic or fixed scale
3. Set **Drawing Break** behavior:
   - **Auto-break**: ISOGEN automatically splits long lines across multiple sheets
   - **Max components per sheet**: Typically 15-25
   - **Continuation label**: Format for break references (e.g., "SHT 2/4")

### Line Appearance

1. Go to **Style** → **Lines**.
2. Configure:
   - **Pipe line weight**: Typically 0.5mm
   - **Fitting line weight**: Same as pipe
   - **Annotation line weight**: Typically 0.25mm
   - **Dimension line weight**: Typically 0.25mm
   - **Hidden line representation**: Dashed or omitted

### Text Settings

1. Go to **Style** → **Text**.
2. Configure:
   - **Font**: Arial, RomanS, or project standard
   - **Text height**: 2.5mm for annotations, 3mm for titles
   - **Text alignment**: Above or below the pipe
   - **Decimal places**: For dimensions (typically 0 for mm, 2 for inches)

## Step 3: Configure Symbol Mapping

Symbols define how each component appears on the isometric.

1. Go to **Symbol** → **Component Symbols**.
2. Review the symbol for each component type:
   - **Gate valve**: Gate symbol with flanges
   - **Globe valve**: Globe symbol with flanges
   - **Check valve**: Check symbol with flow direction arrow
   - **Ball valve**: Ball symbol with handle
   - **Elbow**: 90° or 45° elbow symbol
   - **Tee**: Straight or reducing tee symbol
   - **Reducer**: Concentric or eccentric reducer symbol
3. For each symbol, configure:
   - **Symbol block**: The DWG block used for the symbol
   - **Size**: Scale relative to pipe size
   - **Orientation**: How the symbol rotates with pipe direction

### Custom Symbols

For non-standard components:

1. Create a DWG block for the custom symbol.
2. In we-Configure, go to **Symbol** → **Custom Symbols**.
3. Add the block file path.
4. Map the custom component to the new symbol.
5. Test by generating an isometric with the custom component.

### Common Symbol Issues

**Wrong symbol for component**: The component's spec code maps to the wrong ISOGEN symbol. Check the symbol mapping in we-Configure and correct the mapping.

**Symbol too large/small**: Adjust the symbol scale in we-Configure. Symbols should be proportional to the pipe size on the isometric.

**Missing symbol**: The component type doesn't have a symbol assigned. Create a custom symbol or map it to a similar existing symbol.

## Step 4: Configure Annotations

Annotations are the text labels on isometrics — component tags, coordinates, weld numbers.

### Component Annotations

1. Go to **Annotation** → **Component**.
2. For each component type, configure:
   - **Tag format**: What text appears (e.g., "GATE VALVE 4\" 150# RF")
   - **Position**: Above, below, or beside the component
   - **Leader line**: Whether a leader line connects the annotation to the component
   - **Text size**: Typically 2.5mm

### Weld Annotations

1. Go to **Annotation** → **Welds**.
2. Configure:
   - **Weld numbering**: Sequential or by line number
   - **Weld symbol**: Circle, square, or custom
   - **Weld label format**: "W1", "W2", etc.
   - **Position**: Along the pipe near the weld

### Dimension Annotations

1. Go to **Annotation** → **Dimensions**.
2. Configure:
   - **Dimension type**: True dimensioning or coordinate dimensioning
   - **Precision**: Decimal places (0 for mm, 2 for inches)
   - **Cutback dimensions**: Show pipe lengths between components
   - **Continuation dimensions**: How dimensions flow across drawing breaks
   - **Dimension position**: Above or below the pipe

## Step 5: Configure BOM and Reports

The BOM (Bill of Materials) is critical for fabrication.

1. Go to **Report** → **BOM**.
2. Configure:
   - **BOM format**: Table layout (item number, description, quantity)
   - **BOM position**: Top-right of the drawing (standard) or custom
   - **Component description**: Format for each component type
   - **Sort order**: By item number, component type, or line number
3. Configure additional reports:
   - **Material summary**: Total quantities by component type
   - **Cut list**: Pipe cut lengths for fabrication
   - **Weld list**: All welds with locations and types

### BOM Description Format

The description format determines what text appears in the BOM:

- **Pipe**: "PIPE 4\" SCH40 SMLS PE" (size, schedule, type, end)
- **Elbow**: "ELBOW 4\" 90° LR BW ASME B16.9" (size, angle, type, end, standard)
- **Valve**: "GATE VALVE 4\" 150# RF API 600" (type, size, class, facing, standard)

Configure the description format in we-Configure to match your fabrication shop's requirements.

## Step 6: Configure Drawing Border

1. Go to **Border** → **Title Block**.
2. Select the border template:
   - Use CADWorx default borders
   - Or create a custom border DWG with your company's title block
3. Configure title block fields:
   - **Project name**: From project settings
   - **Line number**: From the pipe line tag
   - **Drawing number**: Auto-generated or manual
   - **Date**: Current date
   - **Drawn by**: User name
   - **Scale**: From style settings
4. Configure revision block:
   - **Revision number**: Auto-incremented
   - **Revision description**: Manual entry
   - **Revision date**: Current date

## Step 7: Generate and Test Isometrics

After configuration:

1. Open a CADWorx model with pipe routes.
2. Go to **ISO** → **Generate Isometric**.
3. Select the line to generate.
4. Choose the we-Configure style.
5. Click **Generate**.
6. Review the output:
   - Are symbols correct?
   - Are annotations readable and properly placed?
   - Are dimensions accurate?
   - Is the BOM complete?
   - Is the border and title block correct?

### Iterative Configuration

ISOGEN configuration is iterative. After generating test isometrics:

1. **Review with the fabrication team** — ask if the isometrics are usable
2. **Note issues** — wrong symbols, missing annotations, BOM errors
3. **Adjust we-Configure settings** — fix the identified issues
4. **Re-generate** — verify the fixes
5. **Repeat** — until the fabrication team approves the output

## Step 8: Configure Batch Isometric Generation

For large projects, generate isometrics in batches:

1. Go to **ISO** → **Batch Generation**.
2. Select multiple lines.
3. Choose the we-Configure style.
4. Click **Generate All**.
5. ISOGEN processes each line and creates individual isometric drawings.

### Batch Generation Tips

- **Group by line number** — generate all isos for one line at a time
- **Limit batch size** — 20-30 isos per batch to avoid memory issues
- **Close other applications** — ISOGEN is CPU-intensive
- **Check output directory** — ensure enough disk space for all drawings
- **Review a sample** — check 2-3 isometrics from each batch before proceeding

## Common ISOGEN Issues and Fixes

### Isometric Won't Generate

1. Check the PCF file was created — look in the project's PCF folder.
2. Open the PCF in a text editor — verify it contains component data.
3. Check the ISOGEN log file for errors.
4. Verify we-Configure is pointing to the correct style and symbol libraries.

### Missing Components in Isometric

The component is in the model but not in the isometric. Causes:

1. **Component not in spec** — the component was inserted as a custom part. Add it to the spec.
2. **PCF export error** — the component wasn't included in the PCF. Check PCF export settings.
3. **Symbol not mapped** — the component type doesn't have a symbol in we-Configure. Map a symbol.

### Annotations Overlapping

1. Adjust annotation spacing in we-Configure.
2. Change annotation position (above/below) for specific component types.
3. Reduce the amount of annotation text.
4. Increase the drawing scale to provide more space.

### BOM Shows Wrong Quantities

1. Check the model for duplicate components.
2. Verify the BOM aggregation settings in we-Configure (group by type or by size).
3. Check for components with wrong spec codes.

## Best Practices

- **Create project-specific we-Configure styles** — don't modify the default styles
- **Test with the fabrication team** — they're the end users of the isometrics
- **Document the configuration** — keep a record of all we-Configure settings
- **Use consistent styles across projects** — saves setup time and improves consistency
- **Generate isometrics early and often** — don't wait until the model is complete
- **Archive we-Configure files with the project** — preserve the configuration for future reference
- **Train the team on we-Configure** — don't rely on one person for ISOGEN configuration
