---
title: "KOMPAS-3D Export Bug: Solid Body Becomes Surface on STEP/X_T/SAT Export"
excerpt: "A Sverdlovsk Instrument Plant engineer reported that KOMPAS-3D exported a solid mold as a surface model in STEP, X_T, and SAT formats. The root cause was in the C3D Modeler geometric kernel — here's the documented fix."
category: "troubleshooting"
softwareSlug: "kompas-3d"
keyword: "kompas-3d export solid becomes surface step x_t sat bug"
slug: "kompas-3d-export-solid-becomes-surface-bug-fix"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-12"
sources:
  - "https://c3dlabs.com/blog/customer-stories/the-fall-and-recovery-of-a-mold/"
  - "https://habr.com/en/companies/ascon/articles/437076/"
  - "https://help.ascon.ru/KOMPAS/24/en-US/2223_244_2_1_osobennosti_exporta.html"
---

# KOMPAS-3D Export Bug: Solid Body Becomes Surface on STEP/X_T/SAT Export

A lead design engineer at Sverdlovsk Instrument Plant (Aleksei Grekov, 36 years of mold design experience, 15 years with KOMPAS-3D) reported that a 3D mold model exported from KOMPAS-3D arrived as a surface model instead of a solid body in STEP, X_T, and SAT formats. The customer couldn't use the surface model for shopfloor processing and assembly.

## The Problem

**Reported by**: Aleksei Grekov, Sverdlovsk Instrument Plant

**Symptom**: After exporting a KOMPAS-3D solid model to STEP/X_T/SAT and importing it in another CAD system, the result was a surface model, not a solid body.

**Context**: The issue appeared after deploying a new version of KOMPAS-3D. The plant employees noted: "Not only did they change the interface, but they also wrecked the export function!" Previous versions of KOMPAS-3D rarely had this problem.

**Impact**: The customer needed the model for CNC machining and assembly — a surface model is unusable for these purposes. A solid model is required for toolpath generation and manufacturing.

## Root Cause Analysis

The C3D Labs development team (creators of the C3D Modeler geometric kernel used by KOMPAS-3D) diagnosed the issue:

### The Geometry Defect
The model appeared closed from the outside, and KOMPAS-3D treated it as a solid. In reality, the edges of the model were not aligned — they had split, which turned the solid into a surface model during translation.

### Cause 1: Boolean Operation with Tolerance-Level Overlap
The CAD designer had:
1. Traced a contour on a face
2. Extruded the contour
3. Unioned (Boolean add) the extrusion with the parent body

The contour slightly exceeded the size of the face — by an amount equivalent to the modeling tolerance. The Boolean operation proceeded along a branch that bypassed face creation, creating boundary edges that weren't visible in KOMPAS-3D but caused the shell to open during translation.

### Cause 2: Fillet Operation Side Effects
A second source of the bug was found in the fillet operation. Fillet operations are not strictly local — they can affect faces beyond the fillet chain edges. The fillet created boundary edges that caused the same shell-opening problem during export.

## The Fix

### Fix 1: Update KOMPAS-3D
The C3D Labs developers fixed the issue by "tuning the criteria that decided whether or not to create faces" in the C3D Modeler kernel. The fix was included in a subsequent KOMPAS-3D update. **Update to the latest version of KOMPAS-3D** to get this fix.

### Fix 2: Avoid Contours That Exceed Face Boundaries
When creating a contour on a face for extrusion + Boolean union:
1. Ensure the contour stays strictly within the face boundaries
2. If the contour must extend beyond, use a different modeling approach:
   - Create the extrusion as a separate body
   - Use a Boolean intersect instead of union
   - Or extend the target face first to accommodate the contour

### Fix 3: Check Model Before Export
Before exporting to STEP/X_T/SAT:
1. Use **Check Model** or **Check Geometry** tools in KOMPAS-3D
2. Look for open shells or boundary edges
3. If the check reveals issues, repair the geometry before exporting

### Fix 4: Use C3D Format for KOMPAS-to-KOMPAS Transfer
If transferring between KOMPAS-3D installations, use the native C3D format (*.c3d) instead of STEP. The C3D format preserves the exact kernel representation without translation.

### Fix 5: Export with Verification
According to KOMPAS-3D's official export documentation:
- "Solids and components excluded from the calculation are not written to the target format" — ensure all components are included in calculation
- "Hidden solids and components may or may not be written to STEP, JT and C3D formats depending on the settings" — check export settings for hidden components
- Verify the export by re-importing the STEP file into KOMPAS-3D and checking if it comes back as a solid

## Export Settings to Check

From the KOMPAS-3D help documentation:

### STEP Export
- **Format version**: AP214 or AP242 (AP203 is older, less capable)
- **Object types**: Ensure "Solids" is enabled in the export settings
- **Hidden components**: Configure whether hidden solids are written

### STL Export
- "Hidden solids and components are not written to STL format"
- Only visible solids are exported
- If the model contains polygonal objects from converted solids, hide the source solids to avoid duplication

### General Export Notes
- "Solids, surfaces, and points are transferred without changing the object type" — if your model is a solid in KOMPAS-3D, it should export as a solid
- If it exports as a surface, the model has a geometry defect (as described above)
- Curves by law, isoparametric curves, spirals, fillet curves are transformed into splines on export — this is expected behavior

## How to Verify a Solid Export

1. Export from KOMPAS-3D to STEP
2. Import the STEP back into KOMPAS-3D (File → Open with Parameters)
3. Check if the imported model is a solid (not a surface)
4. If it imports as a surface, the model has the boundary edge defect
5. Use the repair workflow (Fix 2 and Fix 3) to resolve the issue

## Reporting Export Bugs to ASCON/C3D Labs

If you encounter this or similar export bugs:
1. Contact ASCON support through your KOMPAS-3D support channel
2. Or contact C3D Labs directly through their website (c3dlabs.com)
3. Provide:
   - The KOMPAS-3D model file (.m3d)
   - The exported STEP/X_T/SAT file
   - Description of what the model should be (solid) vs. what it became (surface)
   - KOMPAS-3D version number

The C3D Labs blog notes that they connected "directly with a KOMPAS-3D MCAD user" to solve this issue — they are responsive to user-reported bugs.
