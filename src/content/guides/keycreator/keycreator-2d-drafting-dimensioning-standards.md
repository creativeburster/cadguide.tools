---
title: "KeyCreator 2D Drafting: Dimensioning Standards and Drawing Automation"
excerpt: "How to configure KeyCreator's 2D drafting module for ANSI and ISO dimensioning standards — covering dimension style setup, title block automation, and batch drawing generation."
category: "standards"
softwareSlug: "keycreator"
keyword: "keycreator 2d drafting dimensioning standards drawing"
slug: "keycreator-2d-drafting-dimensioning-standards"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://keytodata.com/en/keycreator/"
  - "https://help.kubotekkosmos.com/KeyCreator/2026SP0/a10328"
---

# KeyCreator 2D Drafting: Dimensioning Standards and Drawing Automation

KeyCreator started as CADKEY — a 2D drafting tool. Its 2D module is mature and capable. I produce all our manufacturing drawings in KeyCreator, and after setting up the standards correctly, drawing creation is fast and consistent. Here's the configuration.

## Step 1: Set the Drafting Standard

1. Go to **Detail** → **Settings** → **Dimension Standard**.
2. Select:
   - **ANSI Y14.5** — US standard (inch or mm)
   - **ISO 8015** — International standard (mm)
   - **JIS B 0001** — Japanese standard
3. This sets the default arrow style, text placement, and tolerance display format for all new dimensions.

## Step 2: Create Dimension Styles

Create named dimension styles for different drawing types:

### Style: "Manufacturing"

1. **Detail** → **Settings** → **Dimension Styles** → **New**.
2. Name: "Manufacturing".
3. **Lines and Arrows**:
   - Arrow type: **Filled triangle**
   - Arrow size: 3.0 mm
   - Extension line offset: 1.0 mm
   - Extension beyond dim line: 2.5 mm
4. **Text**:
   - Font: Arial, height 3.5 mm
   - Text position: **Above dimension line**
   - Text alignment: **Aligned with dimension line**
   - Text gap: 1.0 mm
5. **Tolerances**:
   - Display: **Limits** (upper and lower values shown)
   - Precision: 0.01 mm
6. **Primary units**:
   - Unit format: Decimal
   - Precision: 0.01 mm
   - Decimal separator: Period (.)

### Style: "Assembly"

1. Create another style named "Assembly".
2. Same as Manufacturing but:
   - Tolerances: **None** (assembly drawings don't show tolerances)
   - Text height: 5.0 mm (larger for readability)
   - Arrow size: 4.0 mm

### Style: "Inspection"

1. Create "Inspection" style.
2. Same as Manufacturing but:
   - Tolerances: **Symmetric** (±0.05 mm default)
   - Add inspection frame around critical dimensions (rectangular frame around the dimension text)

## Step 3: Configure Title Block

1. Create the title block geometry in model space or a separate template file.
2. Add **Attribute Fields**:
   - Drawing title
   - Drawing number
   - Scale
   - Date
   - Drawn by
   - Checked by
   - Material
   - Finish
   - Project number
3. Save as a template: **File** → **Save As Template** → store in KeyCreator's template directory.

To use the template:
1. **File** → **New from Template**.
2. Select the template.
3. Fill in attribute fields via a dialog.
4. The title block populates automatically.

## Step 4: Generate Views from 3D

If you have a 3D model in KeyCreator:

1. Go to **Detail** → **Create Views**.
2. Select the 3D part.
3. Choose view types:
   - **Standard**: Front, Top, Right, Isometric
   - **Section**: Define a cutting plane and direction
   - **Detail**: Select an area for magnified view
   - **Auxiliary**: Project from a non-standard angle
4. KeyCreator generates 2D views from the 3D model.
5. Views are linked to the 3D model — if the model changes, update views with **Detail** → **Update Views**.

## Step 5: Automate Dimension Placement

KeyCreator can auto-dimension certain features:

1. **Detail** → **Auto Dimension**.
2. Select the geometry to dimension.
3. KeyCreator places dimensions for:
   - Linear distances (horizontal, vertical, aligned)
   - Circle diameters
   - Arc radii
   - Angles
4. Review and adjust — auto-dimensioning is about 80% correct. You'll need to reposition some dimensions and add missing ones.

For holes:
1. **Detail** → **Hole Callout**.
2. Select a hole.
3. KeyCreator generates a callout with diameter, depth, and tolerance — formatted to the selected standard.

## Step 6: Batch Drawing Generation

For multi-part projects:

1. Create a drawing template with the title block and border.
2. Go to **Detail** → **Batch Drawing**.
3. Select multiple parts from the file list.
4. For each part, specify:
   - View layout (single view, 3-view, or isometric only)
   - Dimension style
   - Scale (auto or manual)
5. Click **Generate** — KeyCreator creates a separate drawing file for each part.

This saves hours on projects with 20+ parts. Each drawing is consistent in format and dimensioning style.

## Step 7: Export Drawings

KeyCreator exports to:
- **DXF/DWG** — For AutoCAD users and CNC machines
- **PDF** — For client review and archiving
- **STEP AP242 with PMI** — For model-based definition (MBD)

For PDF export:
1. **File** → **Export** → **PDF**.
2. Set **Resolution**: 300 DPI for print, 150 DPI for web.
3. Enable **Vector output** — preserves line sharpness at any zoom.
4. Set **Layer mapping**: Map KeyCreator layers to PDF layers for interactive viewing.

## Common Dimensioning Issues

**Dimensions show wrong precision**: Check the dimension style's primary units precision setting. If it shows 10.0 instead of 10.00, the precision is set to 0.1 instead of 0.01.

**Hole callout shows wrong format**: The dimension standard (ANSI vs ISO) controls hole callout format. ANSI uses "4x Ø10 THRU" while ISO uses "4x Ø10 through". Verify the correct standard is selected.

**Title block attributes don't update**: After editing the 3D model, run **Detail** → **Update Views** and then **Detail** → **Update Title Block**. The title block doesn't auto-update from model changes.
