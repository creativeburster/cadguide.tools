---
title: "KOMPAS-3D STEP Import/Export: Format Settings and Object Translation"
excerpt: "Guide to KOMPAS-3D's STEP file import and export — covering AP203/AP214/AP242 support, object type translation rules, and configuration settings — based on official ASCON documentation."
category: "workflow"
softwareSlug: "kompas-3d"
keyword: "kompas-3d step import export format settings configuration"
slug: "kompas-3d-step-import-export-format-settings"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://help.ascon.ru/KOMPAS/23/en-US/990_glava123_obmen_informaciej_.html"
  - "https://help.ascon.ru/KOMPAS/24/en-US/2218_245_1_1_osobennosti_importa.html"
  - "https://help.ascon.ru/KOMPAS/23/en-US/dlg_step_import_settings.html"
---

# KOMPAS-3D STEP Import/Export: Format Settings and Object Translation

KOMPAS-3D supports STEP file exchange (AP203, AP214, AP242) for interoperability with other CAD systems. Understanding how KOMPAS-3D translates objects during import and export is critical for maintaining data integrity across systems. This guide documents the process based on official ASCON help documentation.

## Supported STEP Formats

| Format | Import | Export |
|---|---|---|
| STEP AP203 | Yes | Yes |
| STEP AP214 | Yes | Yes |
| STEP AP242 | Yes | Yes |

Additional formats supported for import: SolidWorks, UGS/NX (native formats, always available), and other proprietary formats (requires Advanced Reading Tools component).

## STEP Import

### Importing with Parameters

1. **File → Open** → select STEP file
2. Use **Open with Parameters** from the Open button dropdown
3. The STEP Import Settings dialog appears

### Import Configuration Options

#### Configuration Files
- Load a saved configuration (.sikf file) to apply preset import parameters
- Save current settings as a configuration for reuse
- Configurations apply to all STEP variants (AP203/AP214/AP242)

#### Object Type Import
Control which object types are imported:
- **Solids**: Imported as "operations without history"
- **Surfaces**: Imported as "imported surfaces"
- **Curves**: Segments, arcs, broken lines, splines retain type; other curves become "curves without history"
- **Points**: Transferred with object type saved
- **Dimensions**: Become "dimensions without history" or "imported designations"
- **Detailing elements**: Imported from AP214/AP242 (sizes, designations, labels, tables)
- **Technical specifications**: Text objects imported from AP214/AP242

#### CMP Parameters
- Enable/disable import of density and mass parameters

### What Happens to Objects on Import

According to the KOMPAS-3D help documentation:

| Object Type | Import Result |
|---|---|
| Solids | "Operations without history" — no feature tree |
| Surfaces | "Imported surfaces" |
| Segments, arcs, broken lines, splines | Type preserved |
| Other curves | "Curves without history" |
| Points | Type preserved |
| Polygonal objects | Created from mesh/point cloud data; can be converted to solids/surfaces |
| Dimensions | "Dimensions without history" or "imported designations" |
| Designations | "Imported designations" (some icons may not transfer) |

### Key Import Notes

1. **No feature history**: Imported solids have no parametric history — they're dumb solids
2. **Polygonal objects**: If the STEP file contains mesh data, KOMPAS-3D creates polygonal objects that can be converted to solids or surfaces
3. **Dimension text**: In "dimensions without history," text is editable; in "imported designations," text is part of the designation and cannot be changed
4. **Leader icons**: Arrows, obliques, datum symbols may not transfer during import

## STEP Export

### Export Process
1. Open the model in KOMPAS-3D
2. **File → Save As** → select STEP format
3. Choose AP203, AP214, or AP242
4. Configure export settings
5. Save

### What Happens to Objects on Export

| Object Type | Export Result |
|---|---|
| Solids | Type preserved (solid) |
| Surfaces | Type preserved (surface) |
| Points | Type preserved |
| Lines, arcs, broken lines, splines | Type preserved |
| Curves by law, isoparametric curves, spirals | Transformed into splines |
| Fillet curves, connections of curves | Transformed into splines |
| Equidistants | Transformed into similar base curves (line→line, arc→arc, curve→spline) |
| Dimensions | Transferred as space curves and texts |
| Detailing elements | Transferred without changes (leader icons not exported) |
| Sketches | Only axial and main lines transmitted; text, designations, construction lines not transmitted |

### Export Settings

#### Hidden Components
- **STL**: Hidden solids and components are NOT written
- **STEP, JT, C3D**: Hidden solids may or may not be written depending on settings
- **Other formats**: Hidden objects written as visible (hide attribute not transferred)

#### Excluded Components
- "Solids and components excluded from the calculation are not written to the target format" — they're treated as removed from the model

#### Assembly Components
- Components with the same source may be converted to separate instances during export if:
  - They have different colors in the assembly
  - They're modified by assembly-level operations (e.g., a hole through multiple components)

#### STL Export Specifics
- If the model contains polygonal objects (from solid/surface conversion) AND the source solids/surfaces still exist:
  - Hide the source solids/surfaces before export, OR
  - Disable transfer of solids/surfaces in export settings
  - This prevents data duplication in the STL file

## STEP Format Version Selection

### AP203
- Oldest STEP AP for configuration-controlled design
- Limited geometry support (basic B-rep)
- Use for simple parts with basic geometry

### AP214
- Most widely supported STEP AP
- Supports automotive/mechanical design data
- Good general-purpose choice for most CAD exchanges
- KOMPAS-3D exports AP214 natively

### AP242
- Latest STEP AP (merged AP203 + AP214 + new features)
- Supports advanced geometry, PMI (Product Manufacturing Information), tolerances
- Best for models with GD&T, annotations, and composite materials
- KOMPAS-3D supports AP242 import and export

**Recommendation**: Use AP242 for new projects (most comprehensive). Use AP214 for compatibility with older CAD systems. Use AP203 only when required by legacy systems.

## Importing from Other CAD Systems

KOMPAS-3D can import from proprietary formats:

### Always Available (No Additional Components)
- SolidWorks native files (.sldprt, .sldasm)
- UGS/NX native files (.prt)

### Requires Advanced Reading Tools Component
- CATIA, Inventor, Creo, and other proprietary formats
- The component is installed automatically with full installation
- For custom installation, enable the appropriate option

### C3D Format
- Native format of the C3D Modeler kernel
- Use for KOMPAS-to-KOMPAS transfer (preserves exact kernel representation)
- Also readable by other software using the C3D kernel

## Best Practices

1. **Use "Open with Parameters"**: Always configure import settings rather than using quick open
2. **Save import configurations**: Create .sikf files for common import scenarios
3. **Verify after import**: Check that solids imported as solids, not surfaces
4. **Use AP242 when possible**: Most comprehensive format, best data preservation
5. **Check excluded components**: Ensure no components are accidentally excluded from calculation before export
6. **Hide duplicates before STL export**: If both polygonal and source solid exist, hide one
7. **Test round-trip**: Export to STEP, re-import, and verify the model is still correct
8. **Use C3D format for KOMPAS-to-KOMPAS**: Avoids translation issues entirely
