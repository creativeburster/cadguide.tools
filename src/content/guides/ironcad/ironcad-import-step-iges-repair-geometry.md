---
title: "IronCAD Importing STEP and IGES Files: Repairing and Editing Imported Geometry"
excerpt: "How to import and repair STEP/IGES files in IronCAD — handling missing faces, surface gaps, and using direct modeling to modify imported geometry without rebuilding feature trees."
category: "troubleshooting"
softwareSlug: "ironcad"
keyword: "ironcad import step iges repair geometry"
slug: "ironcad-import-step-iges-repair-geometry"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://en.solidmakarna.se/supportblogg/olika-metoder-for-3d-modellering-i-ironcad"
  - "https://www.ironcad.com/blog/anatomy-ironcads-triball/"
---

# IronCAD Importing STEP and IGES Files: Repairing and Editing Imported Geometry

I receive STEP files from clients who use SolidWorks, Creo, and Inventor. IronCAD imports them well — better than most mid-range CAD systems — but no STEP import is perfect. Here's my workflow for getting clean, editable geometry from imported files.

## Step 1: Import the File

1. Go to **File** → **Open** or **Insert** → **Import**.
2. Select the STEP (.stp/.step) or IGES (.igs/.iges) file.
3. IronCAD opens the import dialog:
   - **Import as**: **Solid** (preferred) or **Surface** (if the file contains only surfaces)
   - **Units**: Auto-detect (usually correct) or manual override
   - **Healing**: Enable **Auto-heal** — IronCAD attempts to fix minor surface gaps during import
4. Click **OK**.

The imported geometry appears in the scene as a single part (or multiple parts for assembly STEP files).

## Step 2: Check Import Quality

After import, verify the geometry is valid:

1. Select the imported part.
2. Go to **Inspect** → **Check Geometry**.
3. IronCAD reports:
   - **Solid body count** — Should be 1 (or the expected number of parts)
   - **Open edges** — Should be 0 (open edges indicate surface gaps)
   - **Self-intersections** — Should be 0
   - **Non-manifold edges** — Should be 0

If any of these show non-zero values, the imported geometry has issues that need repair.

## Step 3: Repair Surface Gaps

If the Check Geometry report shows open edges:

1. Go to **Modify** → **Surface Healing**.
2. IronCAD displays a list of open edges with their gap sizes.
3. Set **Gap tolerance** to 0.01 mm (standard for most imports).
4. Click **Heal** — IronCAD fills gaps by extending and intersecting adjacent surfaces.
5. Re-run Check Geometry to verify the gaps are closed.

For larger gaps (>0.1 mm) that auto-heal can't fix:
1. Go to **Modify** → **Surface** → **Fill Hole**.
2. Select the open edge loop.
3. Choose fill method: **Planar** (for flat openings) or **Tangent** (for curved openings).
4. IronCAD creates a surface patch to close the gap.
5. Use **Sew** to combine the patch with the existing surfaces into a solid.

## Step 4: Remove Imported Features with Direct Modeling

Imported files come without feature trees — you can't edit the original sketch or extrude parameters. But IronCAD's direct modeling tools let you modify the geometry:

### Move a Face

1. Select the face to move.
2. Press **F10** (Triball).
3. Drag along an axis to reposition the face.
4. Type a distance for precise movement.

This is the most common edit on imported parts — moving a mounting face, adjusting a wall thickness, or repositioning a boss.

### Delete a Feature

1. Select the feature to remove (e.g., a rib, boss, or hole).
2. Press **Delete** or right-click → **Delete**.
3. IronCAD removes the feature and auto-fills the surrounding geometry.

### Resize a Hole

1. Select the hole's cylindrical face.
2. Right-click → **Edit Face** → **Offset**.
3. Enter the offset distance (positive = enlarge, negative = shrink).
4. IronCAD resizes the hole and updates surrounding faces.

## Step 5: Replace Imported Geometry with Parametric Features

For parts that will be modified frequently, replace the imported geometry with parametric features:

1. Measure key dimensions of the imported part (Inspect → Measure).
2. Create a new part with parametric features matching those dimensions.
3. Use the imported part as a reference (place it in the scene as a ghost).
4. Build the parametric part over the reference.
5. Delete the imported reference when the parametric part is complete.

This is time-consuming but gives you a fully editable part. Do this only for parts you'll modify repeatedly — for one-off modifications, direct editing is faster.

## Common Import Issues

**Imported as surfaces instead of solid**: The STEP file contains unconnected surfaces. Use **Sew** (Modify → Surface → Sew) to combine surfaces into a solid. Select all surfaces, set tolerance to 0.01 mm, and click OK.

**Missing faces after import**: Some faces were too small for the import tolerance. Increase the import tolerance: **File** → **Import** → **Options** → **Tolerance** → set to 0.001 mm (default is 0.01 mm).

**Geometry appears at wrong scale**: The STEP file's unit system doesn't match IronCAD's. Check the original CAD system's units and manually set the import scale. Common conversions:
- Inch → mm: scale 25.4
- Foot → mm: scale 304.8

**Assembly imports as single part**: The STEP file was exported as a single solid. Ask the sender to export with assembly structure (AP242 with assembly hierarchy). If that's not possible, use **Modify** → **Split Body** to separate the parts manually.

## IGES vs STEP Import

| Issue | STEP | IGES |
|-------|------|------|
| Surface gaps | Rare (better tolerance) | Common |
| Assembly structure | Preserved (AP242) | Lost |
| Color/layer info | Preserved | Often lost |
| File size | Smaller | Larger |
| Import speed | Faster | Slower |

**Recommendation**: Always request STEP files. Only accept IGES as a last resort — the repair work is significantly more.
