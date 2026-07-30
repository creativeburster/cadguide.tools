---
title: "SCIA Engineer BIM Integration: Revit Analytical Model Exchange, IFC BIM Toolbox Conversion, and Model Alignment Pitfalls"
excerpt: "SCIA Engineer's Revit link and IFC import both depend on the analytical model — not the structural (volumetric) model. We cover the analytical vs structural model mismatch, 'not enough analytical curves' errors, BIM toolbox solid-to-member conversion, alignment tolerance settings, and what doesn't export."
category: "bim-integration"
softwareSlug: "scia-engineer"
keyword: "SCIA Engineer Revit IFC analytical model BIM toolbox import export alignment conversion"
slug: "scia-engineer-bim-integration-revit-ifc-analytical-model-conversion"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://help.scia.net/20.0/en/trx/importexport/revitlink3-analyticalvsstructural.htm"
  - "https://www.scia.net/en/support/faq/scia-engineer/data-exchange/ifc-scia-analytical-model-using-import-and-bim-toolbox"
  - "https://help.scia.net/20.0/en/trx/importexport/revitlink8-not_export_reasons.htm"
---

# SCIA Engineer BIM Integration: Revit Analytical Model Exchange, IFC BIM Toolbox Conversion, and Model Alignment Pitfalls

SCIA Engineer integrates with BIM workflows through two primary paths: the **Revit link** (direct plugin) and **IFC import** (openBIM). Both depend on the **analytical model** — a simplified representation where beams are lines and plates are planes without thickness. The structural (volumetric) model used for drawings is ignored during exchange, creating a critical mismatch that causes most integration failures.

## Analytical vs Structural Model: The Core Problem

### Two Models in Every Project

| Model | Purpose | Representation |
|-------|---------|---------------|
| **Analytical model** | Calculations (forces, stability) | Beams = lines; plates = planes (no thickness); properties assigned to lines/planes |
| **Structural model** | Drawings, visualization | Volumetric representation showing real dimensions |

### The Mismatch

In **Revit**, the emphasis is on the volumetric (structural) model. A good-looking structural model can contain a **very bad underlying analytical model** — beams may not connect to columns analytically even though they appear connected volumetrically.

In **SCIA Engineer**, models are based on the **analytical centre line**. When the Revit link exchanges data, only the analytical model is transferred. The structural model is neglected.

**Key implication**: The Revit modeller must understand the importance of a correctly constructed analytical model. A visually correct Revit model is insufficient — the analytical lines must be properly connected.

### Revit 2023 Analytical Model Changes

Revit 2023 significantly modified the analytical model feature:
- **Before Revit 2023**: Derived analytical model (automatically generated from structural elements)
- **Revit 2023+**: Contextual analytical model (user-controlled)

The Revit model may now contain:
- Only structural members (no analytical members)
- Only analytical members
- A mix of both

**Impact on SCIA exchange**: Only analytical elements can be exported. If "Enable analytical model" is not ticked for an element in Revit, it won't export to SCIA Engineer.

## Revit Link: Common Export Failures

### "Not Enough Analytical Curves to Create 2D Member"

This warning appears during export for a wall or plate when the geometry is invalid.

**Causes**:
- The boundary of the plate/wall is **not closed**
- Two nodes are **too close to each other** (near-coincident nodes)

**Fix**:
1. Export only a specific selection to isolate the problematic element
2. Review the geometry boundaries in Revit
3. Close any open boundaries
4. Merge or remove near-coincident nodes

### Cross-Section or Material Not Correctly Mapped

When a cross-section or material doesn't map correctly during export:
- Check the **transfer log file** for mapping errors
- Ensure the folder containing Revit families is **not read-only**
- Verify that the family types used in Revit exist in the SCIA mapping table

### Entity Ignored by Export Options

The Revit link has an option to **ignore 2D members** during export. If this is enabled, walls and plates won't transfer. Check the export options dialog.

### Object Not Supported by SCIA Engineer

Some Revit objects have no corresponding entity in SCIA Engineer:
- Check the Revit plug-in help file for supported/unsupported object types
- Unsupported objects are silently skipped — check the log for missing elements

### Level Assignment Issues

**Columns and walls**: Base Level and Top Level must be set to the nearest Revit Level. Otherwise SCIA Engineer cannot resolve element positions correctly.

**Vertical offsets**: If Top Offset or Base Offset causes the element to cross another Level, position resolution may fail.

**Floor slabs**: Must be assigned to the nearest Level, otherwise the slab position in SCIA Engineer will be incorrect.

### Slab Boundary Changes

If the number of nodes in a slab boundary is modified in SCIA Engineer, **the change cannot be imported back to Revit**. This is an application limitation.

**Best practice**: Use the **Opening option** in Revit rather than modifying slab boundaries. Create analytical openings along with analytical panels in Revit.

### Shaft Openings

Revit shaft openings (passing through entire building height or selected levels) are transferred to SCIA Engineer as **individual openings per level** — there is no shaft opening type in SCIA Engineer.

### Eccentricities and Offsets

Member offsets and eccentricities transfer from SCIA to Revit **only if supported** by the particular Revit element type. Where unsupported:
- A warning is issued in the transfer log
- Eccentricities must be applied **manually in Revit** after import

## IFC Import: BIM Toolbox Workflow

### Step 1: Import IFC File

SCIA Engineer is certified for **IFC 2x3 import and export**. When importing:

1. Open the IFC file in a viewer first (Solibri Anywhere, BIMvision) to review content
2. Select levels and object types to import
3. Use "Adjust 3D levels automatically" to map IFC levels to SCIA drawing-model pairs
4. Choose model type:
   - **Facet Model**: Lighter, ignores true curves (suitable for pipes)
   - **Solid Model**: Heavier, shows true curves of objects

5. After import, all objects are IFC objects — **part conversion is needed**

### Step 2: Convert General Solids to Native Members

Imported IFC elements are **general solids**, not native SCIA Engineer members. Use the BIM toolbox:

**General solid to 1D** (beams/columns):
- Automatically recognizes basic cross-section shapes
- Detects member orientation (vertical columns, horizontal/inclined beams)
- Handles curved beams, arbitrary beams, and members with haunches
- Can process solid by solid or multiple solids at once

**General solid to 2D** (walls/plates):
- Automatically creates mid-planes of 2D members
- Vertical elements recognized as walls
- "Detect circular slabs" option for curved walls
- Can process individually or in batch

**Part of a general solid to 1D**:
- For complex shapes (e.g., column with corbels)
- Each sub-part converts to a beam or surface individually

### Step 3: Align the Analytical Model

After conversion, member axes and mid-planes are **not connected** — the outer surfaces are aligned in the architectural model but the mid-planes are not.

**Alignment options**:
- By storeys
- By Local Coordinate System (LCS) planes
- By member type (beams to columns, columns to plates, etc.)
- Live preview available before execution

**Critical tolerance settings**:

| Parameter | Recommendation |
|-----------|---------------|
| Max. node to master plane distance | Start **smaller** rather than larger (e.g., 0.1m) |
| Max. total displacement of node | Start smaller to ensure members align to expected planes |

**Why start small**: A larger tolerance (e.g., 0.15m vs 0.1m) may cause nodes to align to the wrong plane, connecting members incorrectly.

### Step 4: Check and Connect

After alignment:
1. **Check structure data** for duplicate nodes (alignment moves nodes but doesn't merge them)
2. **Connect members/nodes** using the connect command
3. Alternatively, connect beams to plates as **ribs** or via **rigid arms**

### SCIA Autoconverter

The BIM toolbox workflow can be performed more efficiently using the **SCIA Autoconverter**, which automates the conversion and alignment process.

## What Doesn't Export from SCIA to Revit

| Element Type | Export Status |
|-------------|---------------|
| Analytical members (1D) | ✅ Exported based on analytical centre line |
| Analytical panels (2D) | ✅ Exported |
| Member offsets/eccentricities | ⚠️ Only if supported by Revit element type |
| Slab boundary changes (node count modified) | ❌ Cannot import back to Revit |
| Members deleted in SCIA | ✅ Also deleted in Revit upon import (v44+) |
| Openings in plates/walls | ✅ Perfectly supported (v44+) |

## Best Practices for Revit-to-SCIA Workflow

1. **Test with a small model first** — before attempting a major project, create a test model incorporating your typical structural features
2. **Verify analytical model in Revit** — ensure members are connected analytically, not just visually
3. **Use custom Revit families carefully** — test RFA file export to verify cross-section type and eccentricities transfer correctly
4. **Save the Revit model before exporting** — the export requires a saved file
5. **Set correct Level assignments** — columns, walls, and slabs must reference the nearest Revit Level
6. **Use Opening option** instead of modifying slab boundaries
7. **Check the transfer log** after every export/import for warnings and errors
8. **Map cross-sections and materials** before first exchange — verify in the link options
9. **Ensure family folders are not read-only** — the link needs write access
10. **For IFC workflow**: Use BIM toolbox conversion → alignment with small tolerances → check for duplicate nodes → connect members
