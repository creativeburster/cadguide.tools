---
title: "Shapr3D to Fusion 360 Export: Preserving Design Intent and Feature History"
excerpt: "How to export Shapr3D models to Fusion 360 for CAM and simulation — covering STEP export settings, feature recognition in Fusion, and maintaining editable geometry across platforms."
category: "migration"
softwareSlug: "shapr3d"
keyword: "shapr3d export fusion 360 step cam"
slug: "shapr3d-export-fusion-360-step-cam"
author: "CADGuide Tools Editorial Team"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.shapr3d.com/supported-file-formats"
  - "https://help.autodesk.com/fusion-360/import-export"
---

# Shapr3D to Fusion 360 Export: Preserving Design Intent and Feature History

Shapr3D is my go-to for concept design on iPad. But for CAM toolpath generation and simulation, I switch to Fusion 360 on desktop. The handoff between the two is straightforward — but there are settings that make the difference between a clean import and a mess of uneditable surfaces.

## Why Move from Shapr3D to Fusion 360?

Shapr3D excels at:
- Fast concept modeling on iPad
- Intuitive Pencil-based sketching
- Direct modeling (push/pull faces)

Fusion 360 adds:
- Integrated CAM (2.5-axis, 3-axis, 5-axis milling)
- FEA simulation (static stress, thermal, modal)
- Parametric feature tree for design changes
- Technical drawings with GD&T
- Version management and team collaboration

The typical workflow: design the part in Shapr3D → export to Fusion 360 → generate CAM toolpaths → send G-code to CNC machine.

## Export from Shapr3D

### STEP Export (Recommended)

1. In Shapr3D, open the part to export.
2. Tap **Export** → **STEP**.
3. Set **Protocol**: **AP242** (best compatibility with Fusion 360).
4. Set **Units**: Millimeters (match your Fusion 360 document units).
5. Tap **Export** → save to Files or cloud storage.

### X_T (Parasolid) Export

Shapr3D also exports Parasolid format:
1. Tap **Export** → **X_T**.
2. Fusion 360 imports Parasolid natively (both use the Parasolid kernel).
3. Parasolid preserves exact surface definitions — no tessellation or approximation.

**Recommendation**: Use STEP AP242 for general exchange. Use Parasolid (.x_t) when you need maximum geometry fidelity (complex surfaces, tight tolerances).

### What Exports and What Doesn't

| Element | Exports to STEP | Exports to Parasolid |
|---------|----------------|---------------------|
| Solid bodies | Yes | Yes |
| Surface bodies | Yes | Yes |
| Sketches | No | No |
| Dimensions | No | No |
| Materials/appearance | No | No |
| Assembly structure | Yes (AP242) | Yes |
| Custom properties | No | No |

Shapr3D's design history (feature tree) does not export. The imported model in Fusion 360 is a "dumb solid" — geometry without parametric history.

## Import into Fusion 360

1. In Fusion 360, **File** → **Open**.
2. Select the STEP or X_T file.
3. Fusion imports it as a **Base Feature** (solid body, no parametric history).
4. The body appears in the browser under **Bodies**.

## Rebuilding Design Intent in Fusion 360

Since the imported model has no feature tree, you need to decide whether to rebuild it:

### Option A: Keep as Dumb Solid (Fast)

If you only need CAM toolpaths and won't modify the design:
1. Use the imported solid directly in the CAM workspace.
2. Select faces for toolpath operations (facing, 2D pocket, 3D contour).
3. No need to rebuild the feature tree.

### Option B: Rebuild Parametrically (Thorough)

If you'll modify the design in Fusion:
1. Right-click the Base Feature → **Edit Feature**.
2. Enable **Capture Design History** (if not already enabled).
3. Use Fusion's **Find Features** tool: **Insert** → **Find Features**.
4. Fusion scans the solid and identifies holes, fillets, chamfers, and pockets.
5. Recognized features become editable parametric features.
6. For unrecognized geometry, use **Remove** (delete faces) and **Edit Face** to modify directly.

Feature recognition is about 70% accurate. Simple machined parts (brackets, plates) recognize well. Complex organic shapes don't.

### Option C: Hybrid (Pragmatic)

1. Keep the imported solid as a base.
2. Add new features parametrically on top (new holes, pockets, fillets).
3. Use **Combine** (cut) to subtract new features from the imported body.
4. This preserves the original geometry while adding editable features.

This is the fastest approach — you get parametric control over new features without rebuilding the entire model.

## CAM Workflow After Import

1. Switch to the **Manufacture** workspace in Fusion 360.
2. **Setup** → select the imported solid → define stock size and orientation.
3. Add operations:
   - **Facing** — Top surface flattening
   - **2D Pocket** — Interior cavities
   - **2D Contour** — Outside profile
   - **3D Pocket** — Curved surfaces
   - **Drill** — Holes
4. Select toolpaths → **Simulate** to verify.
5. **Post Process** → select your machine's postprocessor → generate G-code.

The imported STEP geometry works identently to native Fusion geometry for CAM operations. Face selection, edge detection, and toolpath calculation are all fully functional.

## Common Import Issues

**"Imported body has errors"**: The STEP file has surface gaps. In Fusion: right-click the body → **Repair Body** → Fusion attempts to heal gaps automatically. If that fails, use **Surface** → **Patch** to fill gaps manually.

**Units mismatch**: Shapr3D exported in mm but Fusion expects inches (or vice versa). In Fusion: **Document Settings** → change units. The geometry scales automatically.

**Assembly imports as single body**: Shapr3D exported the assembly without structure. In Shapr3D, ensure each part is a separate body before export. In Fusion, use **Modify** → **Separate Body** to split them.

## Best Practice: Export Early and Often

Don't wait until the design is "final" to export to Fusion. Export at key milestones:
1. After basic form is established → import to Fusion → check manufacturability
2. After detail features are added → import to Fusion → generate rough CAM toolpaths
3. Final design → import to Fusion → generate final CAM and drawings

This catches manufacturability issues early — before you've invested hours in details that can't be machined.
