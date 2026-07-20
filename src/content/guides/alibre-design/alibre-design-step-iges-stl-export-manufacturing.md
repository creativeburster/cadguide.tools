---
title: "Alibre Design File Export: STEP, IGES, and STL Best Practices for Manufacturing"
excerpt: "How to export clean manufacturing-ready files from Alibre Design — covering STEP vs IGES selection, STL resolution settings, and common export errors that cause CAM and 3D printing failures."
category: "manufacturing"
softwareSlug: "alibre-design"
keyword: "alibre design step iges stl export manufacturing"
slug: "alibre-design-step-iges-stl-export-manufacturing"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.alibre.com/3d-cad-file-formats/"
  - "https://cadinterop.com/en/formats/cad-systems/alibre.html"
---

# Alibre Design File Export: STEP, IGES, and STL Best Practices for Manufacturing

We've sent hundreds of parts from Alibre Design to CNC machine shops and 3D printing services. The CAD model might be perfect, but if the export settings are wrong, the manufacturer gets garbage. Here's the export workflow we use to avoid rejections.

## STEP Export for CNC Machining

STEP (ISO 10303) is the industry-standard exchange format for CNC machining. Machine shops import STEP files into their CAM software (Mastercam, Fusion 360, ESPRIT) to generate toolpaths.

### STEP Configuration in Alibre

1. Go to **File** → **Export** → **STEP**.
2. Set **Protocol**: Choose **AP242** (latest standard, supports PMI and tolerances) or **AP203** (older but universally compatible).
3. Set **Structure**: Choose **Single file** for individual parts, **Assembly structure** for assemblies.
4. Set **Geometry**: **B-Rep solids** (not tessellated). B-Rep preserves exact cylindrical and spherical surfaces — essential for CNC turning and boring.

### AP242 vs AP203

| | AP203 | AP242 |
|--|-------|-------|
| Geometry | Solids, surfaces | Solids, surfaces |
| Tolerances (PMI) | No | Yes |
| Assembly structure | Limited | Full |
| CAM compatibility | Universal | Most modern CAM |
| File size | Smaller | Slightly larger |

**Recommendation**: Use AP242 for shops with modern CAM (2020 or later). Use AP203 for older CAM systems or if the shop doesn't specify.

### Common STEP Export Issues

**Missing faces**: If your part has surface features (knit surfaces, imported geometry), some faces may not export. Fix by converting surfaces to solids before export: use the **Thicken** or **Sew** command to create a solid body.

**Assembly hierarchy lost**: If the machine shop sees a single solid instead of individual parts, you exported as "single file" instead of "assembly structure." Re-export with assembly structure enabled.

## IGES Export (Legacy Compatibility)

IGES is older than STEP but some legacy CAM systems and wire EDM machines still require it.

1. Go to **File** → **Export** → **IGES**.
2. Set **Surface type**: **NURBS** (not polygonal). NURBS preserves exact surface definitions.
3. Set **Entity type**: **186 (Manifold Solid)** for solid parts, **144 (Trimmed Surface)** for sheet metal.
4. Set **Units**: Match your part units (mm or inch).

**When to use IGES over STEP**: Only when the receiving system explicitly requires it. STEP is superior in every other case — better geometry fidelity, smaller file size, and modern standards support.

## STL Export for 3D Printing

STL is a tessellated mesh format — it approximates curved surfaces with triangles. The resolution of this approximation determines print quality.

### STL Configuration

1. Go to **File** → **Export** → **STL**.
2. Set **Units**: Millimeters (most 3D printers use mm).
3. Set **Binary format**: Yes (smaller file than ASCII).
4. Set **Deviation tolerance**: This controls how closely the mesh follows the actual surface.

| Deviation | Triangle Count | File Size | Use Case |
|-----------|---------------|-----------|----------|
| 0.01 mm | Very high | Large | Dental, jewelry, precision |
| 0.05 mm | High | Medium | Functional parts, prototypes |
| 0.1 mm | Medium | Small | Visual prototypes, fit checks |
| 0.5 mm | Low | Very small | Quick scale models |

**Recommendation**: Use 0.05 mm for most 3D printing. Use 0.01 mm only for small, high-detail parts (jewelry, dental). Higher resolution doesn't help if your printer's layer height is 0.2 mm.

### Common STL Issues

**Non-manifold edges**: The STL has edges shared by more than two triangles. This causes slicing software (Cura, PrusaSlicer) to fail. Fix by running the STL through a mesh repair tool (Meshmixer, Netfabb) before printing.

**Inverted normals**: Some triangles face inward instead of outward. The slicer may interpret the part as inside-out. Fix in Alibre by checking **Unify normals** in the STL export dialog.

**Hollow parts not watertight**: If your part has internal cavities, ensure all surfaces are closed. Export as a solid (not surface) to guarantee watertight geometry.

## DXF Export for Laser Cutting and Waterjet

For 2D cutting operations:

1. Create a drawing of the flat pattern (for sheet metal) or the profile sketch.
2. Go to **File** → **Export** → **DXF**.
3. Set **Version**: R12 or R2000 (most cutting machines accept these).
4. Set **Units**: Match the cutting machine's expected units.
5. Ensure all geometry is on a single layer at color 7 (white/black) — some cutting machines map color to cut/etch settings.

## Pre-Export Checklist

Before sending any file to manufacturing:

- [ ] Run **Check** command on the part — verify it's a valid solid (not surfaces)
- [ ] Run **Update All** — ensure all features are regenerated
- [ ] Remove unnecessary features (cosmetic fillets, text) that the manufacturer doesn't need
- [ ] Verify units match the manufacturer's expectation (mm vs inch)
- [ ] Export to STEP (AP242) for CNC, STL (0.05mm) for 3D printing, DXF for cutting
- [ ] Open the exported file in a viewer (eDrawings, FreeCAD) to verify geometry is intact
