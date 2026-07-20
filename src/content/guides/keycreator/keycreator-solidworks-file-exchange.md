---
title: "KeyCreator to SolidWorks File Exchange: Best Practices for Roundtrip Workflow"
excerpt: "How to exchange files between KeyCreator and SolidWorks without losing geometry — covering STEP vs Parasolid, assembly structure preservation, and handling surface gaps."
category: "migration"
softwareSlug: "keycreator"
keyword: "keycreator solidworks file exchange step parasolid"
slug: "keycreator-solidworks-file-exchange"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.kubotekkosmos.com/direct-cad/meet-keycreator"
  - "https://www.solidsmack.com/resources/direct-edit-solidworks-model-keycreator-3d-direct-modeling/"
---

# KeyCreator to SolidWorks File Exchange: Best Practices for Roundtrip Workflow

I work in a mixed CAD environment — KeyCreator for direct modeling modifications and SolidWorks for parametric design. Moving files between them is a daily reality. Here's the workflow that preserves geometry fidelity.

## Format Selection: STEP vs Parasolid vs IGES

| Format | KeyCreator | SolidWorks | Best For |
|--------|-----------|------------|----------|
| STEP AP242 | Read/Write | Read/Write | Universal exchange, PMI |
| STEP AP203 | Read/Write | Read/Write | Legacy CAM systems |
| Parasolid (.x_t) | Read/Write | Read/Write | Best geometry fidelity |
| IGES | Read/Write | Read/Write | Legacy only, avoid |
| ACIS (.sat) | Read/Write | Read/Write | Rare, not recommended |

**Recommendation**: Use **Parasolid** when possible — both KeyCreator and SolidWorks use the Parasolid geometry kernel, so Parasolid exchange preserves exact surface definitions with zero translation loss. Use **STEP AP242** when sending to non-Parasolid systems.

## KeyCreator → SolidWorks

### Export from KeyCreator

1. Open the part in KeyCreator.
2. **File** → **Export** → **Parasolid** (or STEP).
3. Set **Version**: Parasolid v15 or later (compatible with SolidWorks 2018+).
4. For assemblies: enable **Export assembly structure** — each part exports as a separate body with assembly hierarchy.
5. Click **OK**.

### Import into SolidWorks

1. In SolidWorks, **File** → **Open**.
2. Change file type to **Parasolid (*.x_t)** or **STEP**.
3. Select the exported file.
4. SolidWorks imports it as an imported solid (no feature tree).
5. To create a feature tree: **Insert** → **FeatureWorks** → **Recognize Features**.
6. FeatureWorks attempts to reverse-engineer the feature tree from the solid geometry.

FeatureWorks recognition is about 70% accurate for typical machined parts. Complex surfaces and direct modeling edits won't be recognized — they remain as imported geometry.

## SolidWorks → KeyCreator

### Export from SolidWorks

1. Open the part in SolidWorks.
2. **File** → **Save As** → **Parasolid** (or STEP AP242).
3. For assemblies: save the assembly file (not individual parts) to preserve hierarchy.
4. Click **Save**.

### Import into KeyCreator

1. In KeyCreator, **File** → **Open** (or **Insert** → **Import**).
2. Select the Parasolid or STEP file.
3. KeyCreator imports it as a solid body — fully editable with direct modeling tools.
4. Assembly structure is preserved — each part appears as a separate body.

## Handling Surface Gaps

Sometimes STEP files develop surface gaps during exchange (Parasolid rarely does). If KeyCreator reports open edges after import:

1. **Inspect** → **Check Geometry** → identify open edges.
2. **Edit** → **Surface Healing** → set tolerance to 0.01mm → **Heal**.
3. For stubborn gaps: **Edit** → **Surface** → **Fill Hole** → select the open edge loop.
4. **Edit** → **Sew** → combine all surfaces into a solid.

## Preserving Assembly Structure

When exchanging assemblies:

1. Export as a single file (not individual part files) — this preserves the assembly hierarchy.
2. In STEP AP242, the assembly structure is stored as a hierarchy of product definitions.
3. In Parasolid, the assembly structure is stored as a partition tree.
4. Both KeyCreator and SolidWorks read these structures correctly.

If the assembly structure is lost after import:
- The export was done as individual parts rather than as an assembly.
- Re-export the assembly file (not the individual parts).

## Preserving Colors and Layers

STEP AP242 preserves color and layer information. Parasolid preserves color but not layers. IGES preserves neither reliably.

To ensure colors transfer:
1. Assign colors in KeyCreator before export.
2. Export as STEP AP242.
3. Import into SolidWorks — colors appear on the imported bodies.
4. In SolidWorks, colors on imported bodies are at the body level (not feature level). To change them, right-click the body → **Appearance**.

## Common Issues

**SolidWorks says "import failed"**: The Parasolid version is too new. Export from KeyCreator using an older Parasolid version (v15 or v14). SolidWorks 2018+ supports Parasolid v15.

**KeyCreator imports as surfaces instead of solid**: The STEP file contains unconnected surfaces. Use **Sew** to combine them into a solid. This happens when the originating CAD system had surface models instead of solids.

**Dimensions don't match after roundtrip**: Unit mismatch. Check the export units in KeyCreator (mm vs inch) and the import units in SolidWorks. Both should use the same unit system.

**Assembly parts overlap after import**: Mating constraints don't transfer in STEP/Parasolid — only the geometry positions. If the assembly was saved with all parts in correct position, the import preserves those positions. If parts were in an "exploded" or "unsolved" state, they import in those positions.
