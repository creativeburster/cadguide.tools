---
title: "Repairing Imported STEP and IGES Geometry in SolidWorks: Surface Knitting and Solid Recovery"
excerpt: "Workflow for diagnosing and fixing imported STEP/IGES files with gaps, overlapping surfaces, and failed solid body conversion using SolidWorks import diagnostics and surface healing tools."
category: "troubleshooting"
softwareSlug: "solidworks"
keyword: "solidworks import step"
slug: "repair-imported-step-iges-knit-surface"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-25"
sources:
  - "https://help.solidworks.com/2026/English/SolidWorks/sldworks/c_Import_Diagnostics_Overview.htm"
  - "https://help.solidworks.com/2024/english/SolidWorks/sldworks/t_reading_step_iges_acis_sw.htm"
---

# Repairing Imported STEP and IGES Geometry in SolidWorks: Surface Knitting and Solid Body Recovery

If you work in a multi-CAD environment, you know the pain of importing STEP or IGES files that arrive as a mess of unconnected surfaces instead of a clean solid body. I've spent countless hours knitting surfaces, closing gaps, and trying to salvage imported geometry from customers and suppliers. After a while, I developed a systematic repair workflow that takes you from a broken surface import to a watertight solid body — and it works for the vast majority of cases.

## Understanding Why Imports Fail

STEP and IGES files store geometry as a collection of trimmed surfaces (B-spline, cylindrical, planar, etc.). When SolidWorks reads these surfaces, it attempts to knit them together into a solid body. The knit fails when:

- **Gaps exist between adjacent surfaces**: The edges of neighboring surfaces do not meet within the tolerance specified by the import settings.
- **Overlapping surfaces**: Two surfaces occupy the same space, creating ambiguity in the solid boundary.
- **Missing surfaces**: A face was not included in the export, leaving a hole in the body.
- **Topology mismatch**: The edge curves of adjacent surfaces do not match, even though the surfaces themselves are geometrically close.

The import tolerance (how closely edges must match to be considered coincident) is the primary factor determining whether an import succeeds or fails.

## Step 1: Configure Import Settings

Before opening the STEP/IGES file, configure the import options:

1. Go to Tools > Options > Import.
2. Select "STEP" or "IGES" from the file format list.
3. Set the following options:
   - **Import as**: "Solid body" (attempt solid first; fall back to surface if it fails)
   - **Surface tolerance**: `0.001 mm` (tight) or `0.01 mm` (loose)
   - **Import planes and axes**: Checked
   - **Merge coincident points**: Checked
   - **Automatically run Import Diagnostics**: Checked

4. Click OK.

### Tolerance Selection

- **0.001 mm**: Use for precision parts (aerospace, medical). Tighter tolerance means SolidWorks will reject edges that are more than 1 micron apart, resulting in more failed knits but higher accuracy.
- **0.01 mm**: Use for general mechanical parts. This tolerance allows edges up to 10 microns apart to be considered coincident, resulting in more successful automatic knits.
- **0.1 mm**: Use for large architectural or structural models where sub-millimeter precision is not required.

## Step 2: Run Import Diagnostics

When the import completes, Import Diagnostics runs automatically (if enabled in Step 1). If it does not run automatically:

1. Right-click the imported feature in the feature tree.
2. Select "Import Diagnostics."

The Import Diagnostics panel displays:
- **Failed faces**: Surfaces that could not be knitted
- **Gap edges**: Open edges where surfaces do not meet
- **Overlapping faces**: Surfaces that occupy the same region

### Automatic Repair

Click "Attempt to Heal All" in the Import Diagnostics panel. SolidWorks will:
1. Close gaps by extending adjacent surfaces to meet
2. Remove duplicate/overlapping faces
3. Re-knit the surfaces into a solid body

Review the results. If "Attempt to Heal All" resolves all issues and creates a solid body, the repair is complete. If issues remain, proceed to manual repair.

## Step 3: Manually Close Gaps

For gaps that automatic healing cannot resolve:

### Identify the Gaps

1. In the Import Diagnostics panel, click each "Gap" entry to highlight it in the graphics area.
2. Note the gap size displayed in the panel. Gaps larger than the import tolerance require manual intervention.

### Close Small Gaps with Surface Extension

1. Right-click the gap edge in the graphics area.
2. Select "Close Gap" from the context menu.
3. SolidWorks extends the adjacent surfaces to close the gap.

If "Close Gap" is not available (the gap is too large), use the Surface Extension tool:

1. Go to Insert > Surface > Extend.
2. Select the edge of the surface adjacent to the gap.
3. Set the extension distance to slightly more than the gap size.
4. Set the extension type to "Same Surface" (maintains curvature continuity).
5. Click OK.
6. Repeat for the other surface forming the gap.
7. Use the Knit Surface tool to join the extended surfaces.

### Close Large Gaps with Filled Surface

For gaps too large to close by extension:

1. Go to Insert > Surface > Filled Surface.
2. Select the edges surrounding the gap.
3. Set the edge condition to "Tangent" or "Curvature" for smooth continuity.
4. Click OK to create a filled surface.
5. Knit the filled surface with the surrounding surfaces.

## Step 4: Fix Overlapping Faces

Overlapping faces occur when two surfaces from the source CAD system cover the same region. SolidWorks cannot determine which surface represents the true boundary.

1. In the Import Diagnostics panel, click the "Overlapping Face" entry.
2. Both overlapping faces are highlighted in the graphics area.
3. Determine which face is correct by examining the surrounding geometry. The correct face should have edges that align with adjacent surfaces.
4. Right-click the incorrect face and select "Delete Face."
5. Re-knit the remaining surfaces.

## Step 5: Replace Missing Faces

If a face is entirely missing from the import (common with IGES files from older CAD systems):

1. Identify the hole in the surface body by rotating the model and visually locating the opening.
2. Go to Insert > Surface > Filled Surface.
3. Select the edges surrounding the hole.
4. Set the edge condition to "Tangent" for smooth continuity with adjacent surfaces.
5. Click OK.
6. Knit the new filled surface with the existing surfaces.

## Step 6: Knit Surfaces into a Solid Body

After all gaps, overlaps, and missing faces are resolved:

1. Go to Insert > Surface > Knit Surface.
2. Select all surfaces in the graphics area (or select them from the Surface Bodies folder in the feature tree).
3. Check "Try to form solid."
4. Click OK.

If the knit succeeds with "Try to form solid" enabled, the surface body is converted to a solid body. The new solid body appears in the Solid Bodies folder in the feature tree.

### Knit Failure

If the knit fails with "Try to form solid," it means the surfaces still have gaps or topology issues that prevent a watertight closure. Run Import Diagnostics again to identify remaining issues:

1. The diagnostics panel may now show new issues that were not visible before the manual repairs.
2. Fix each issue using the methods in Steps 3-5.
3. Re-attempt the knit.

## Step 7: Verify the Repaired Solid

After successfully creating a solid body:

### Check Volume

1. Go to Tools > Evaluate > Mass Properties.
2. Verify that the volume is non-zero and reasonable for the part size.
3. If the volume is zero, the body is still a surface body, not a solid.

### Check for Internal Volumes

1. Go to Tools > Evaluate > Check.
2. Check "Minimum radius of curvature" and "Import diagnostics."
3. Click OK.
4. Review the report for any remaining issues.

### Check Cross-Section

1. Go to Insert > Cut > Section View.
2. Create a section through the middle of the part.
3. Verify that the cross-section shows solid material, not hollow regions or missing faces.

## Step 8: Simplify the Repaired Model

Imported geometry often contains hundreds of small surfaces that make subsequent modeling operations slow and difficult. After repairing the import:

### Use the Delete Face Tool

Remove unnecessary faces (such as fillets that will be recreated natively):

1. Go to Insert > Face > Delete.
2. Select the face(s) to remove.
3. Check "Delete and Patch" to close the resulting gap automatically.

### Use the Combine Tool

Merge multiple solid bodies into one:

1. Go to Insert > Features > Combine.
2. Select "Add" and choose all solid bodies.
3. Click OK.

### Rebuild Key Features Natively

For critical features (mounting holes, bearing seats, sealing surfaces), delete the imported geometry and recreate the feature using native SolidWorks tools (Hole Wizard, Extrude Cut, Revolve Cut). Native features are parametric, easier to modify, and more reliable than imported geometry.

## Best Practices for Future Imports

1. **Request STEP AP242 format**: AP242 is the latest STEP application protocol and includes better topology handling than AP203 or AP214.
2. **Ask the source CAD user to export with "solid" topology**: Some CAD systems can export surfaces as a solid body or as individual surfaces. Solid body export produces cleaner imports.
3. **Avoid IGES for complex geometry**: IGES is an older format with known limitations in topology representation. Use STEP whenever possible.
4. **Document the source CAD system**: Different CAD systems produce different translation artifacts. Knowing the source system helps predict which repair tools will be needed.
