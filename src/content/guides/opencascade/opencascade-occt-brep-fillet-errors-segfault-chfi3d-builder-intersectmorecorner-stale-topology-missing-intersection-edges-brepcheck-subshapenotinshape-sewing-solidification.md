---
title: "OpenCASCADE OCCT BREP and Fillet Errors: Segfault in ChFi3d Builder IntersectMoreCorner from Stale Topology After Boolean Operations Requiring BRepBuilderAPI Copy, Missing Intersection Edges in Face-Model BREP Intersection from Adjacent Sliced Faces Requiring Geometry Validation, BRepCheck SubshapeNotInShape from Incomplete Shell Sewing Before Solidification Requiring Sewing Order Fix, Inconsistent Generated Modified IsDeleted Across BRepBuilderAPI Classes Requiring Per-Class Workarounds, and Implicit Topology Natural Bounds Creating Special Cases Requiring Explicit Boundary Population"
excerpt: "OpenCASCADE fails for 5 distinct reasons: segfault in ChFi3d Builder IntersectMoreCorner from stale topology after boolean operations requiring BRepBuilderAPI_Copy, missing intersection edges in face-model BREP intersection from adjacent sliced faces requiring geometry validation, BRepCheck SubshapeNotInShape from incomplete shell sewing before solidification requiring sewing order fix, inconsistent Generated Modified IsDeleted across BRepBuilderAPI classes requiring per-class workarounds, and implicit topology natural bounds creating special cases requiring explicit boundary population. We cover each with fixes from OpenCASCADE GitHub Issues."
category: "brep-and-fillet-errors"
softwareSlug: "opencascade"
keyword: "OpenCASCADE OCCT segfault ChFi3d Builder IntersectMoreCorner stale topology boolean operations BRepBuilderAPI_Copy missing intersection edges face-model BREP intersection adjacent sliced faces geometry validation BRepCheck SubshapeNotInShape incomplete shell sewing solidification sewing order fix inconsistent Generated Modified IsDeleted BRepBuilderAPI classes per-class workarounds implicit topology natural bounds explicit boundary population"
slug: "opencascade-occt-brep-fillet-errors-segfault-chfi3d-builder-intersectmorecorner-stale-topology-missing-intersection-edges-brepcheck-subshapenotinshape-sewing-solidification"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
  - "https://github.com/Open-Cascade-SAS/OCCT/issues/1163"
  - "https://github.com/Open-Cascade-SAS/OCCT/issues/1039"
  - "https://github.com/Open-Cascade-SAS/OCCT/discussions/1052"
---

# OpenCASCADE OCCT BREP and Fillet Errors: Segfault in ChFi3d Builder IntersectMoreCorner from Stale Topology After Boolean Operations Requiring BRepBuilderAPI_Copy, Missing Intersection Edges in Face-Model BREP Intersection from Adjacent Sliced Faces Requiring Geometry Validation, BRepCheck SubshapeNotInShape from Incomplete Shell Sewing Before Solidification Requiring Sewing Order Fix, Inconsistent Generated Modified IsDeleted Across BRepBuilderAPI Classes Requiring Per-Class Workarounds, and Implicit Topology Natural Bounds Creating Special Cases Requiring Explicit Boundary Population

OpenCASCADE's fillet operations, BREP intersection, shape validation, history tracking, and topology representation produce errors from stale TShape pointers, missing edges, incomplete sewing, inconsistent APIs, and implicit topology. This guide covers the 5 most common OpenCASCADE problems with diagnostic steps and community-verified fixes from OpenCASCADE GitHub Issues.

## 1. Segfault in ChFi3d_Builder::IntersectMoreCorner from Stale Topology After Boolean Operations

### Symptom

BRepFilletAPI_MakeChamfer or BRepFilletAPI_MakeFillet crashes with a segmentation fault in ChFi3d_Builder::IntersectMoreCorner. The crash occurs when chamfering or filleting shapes that have been through prior boolean or chamfer/fillet operations. The segfault happens at line 4353 or line 4772 in ChFi3d_Builder_C1.cxx.

### Root Cause

"When a shape has been constructed through a chain of boolean and chamfer operations, internal topology maps (myVEMap, myEFMap) can contain stale references due to shared TShape pointers." The OCCT topology system uses shared TShape pointers. After boolean operations, multiple shapes may share the same TShape. When chamfering, the topology maps contain stale references to these shared TShapes. The IntersectMoreCorner method looks up edges in these maps but finds stale data. The method uses null TopoDS_Shape variables without null guards, causing the segfault.

### Fix

1. **Use BRepBuilderAPI_Copy before chamfering**:
   - "Applying BRepBuilderAPI_Copy to the shape before chamfering/filleting eliminates the crash"
   - "By creating a deep copy that breaks the stale TShape pointer sharing"
   ```cpp
   BRepBuilderAPI_Copy copier(shape);
   TopoDS_Shape cleanShape = copier.Shape();
   // Now chamfer cleanShape instead of shape
   ```
   - This is the primary workaround

2. **Check for null shapes after lookups**:
   - If modifying OCCT source
   - Add null checks before using Fv, Arcprol, Arcprolbis
   - The null check at line 4380 exists but is after the crash at line 4353
   - Move the null check before the use

3. **Avoid chained boolean + chamfer operations**:
   - Don't chain multiple boolean and chamfer operations
   - Copy the shape between operations
   - This prevents stale TShape accumulation
   - Use BRepBuilderAPI_Copy as a barrier

4. **Use ShapeFix after each operation**:
   - After each boolean or chamfer operation
   - Run ShapeFix_Shape to clean up topology
   - This may resolve stale references
   - ```cpp
   ShapeFix_Shape fix(shape);
   fix.SetPrecision(Precision::Confusion());
   fix.Perform();
   shape = fix.Shape();
   ```

5. **Report to OCCT developers**:
   - "Affected version: OCCT 7.9.3 and current master"
   - The bug is in the OCCT source code
   - Report on GitHub with the test file
   - The fix requires adding null guards in IntersectMoreCorner

6. **Use BRepFilletAPI_MakeFillet instead of ChFi3d directly**:
   - The high-level API may handle some edge cases
   - But the underlying ChFi3d bug still exists
   - BRepBuilderAPI_Copy is still needed
   - For complex chained operations

### Community Report

> "BRepFilletAPI_MakeChamfer crashes with a segmentation fault in ChFi3d_Builder::IntersectMoreCorner when applied to shapes that have been through prior boolean or chamfer/fillet operations. The crash occurs because several shape lookups in the method can fail silently, leaving TopoDS_Shape variables null, and the code proceeds to use them without null guards. Applying BRepBuilderAPI_Copy to the shape before chamfering eliminates the crash by creating a deep copy that breaks the stale TShape pointer sharing."

## 2. Missing Intersection Edges in Face-Model BREP Intersection

### Symptom

Performing BREP face-model intersection. Two adjacent sliced faces (Model_ER.brep and Model_OK.brep) are intersected with a base model (Model.brep). The intersection result of one face has missing edges while the other is normal. Both faces are adjacent and should produce consistent intersection results.

### Root Cause

The BREP intersection algorithm doesn't handle all face configurations consistently. Adjacent sliced faces may have slightly different topology or geometry that causes the intersection to fail for one but succeed for the other. The missing edges suggest the intersection algorithm skips certain edge configurations, possibly due to tolerance issues or topology differences between the adjacent faces.

### Fix

1. **Validate geometry before intersection**:
   - Check both faces for valid geometry
   - Use BRepCheck_Analyzer on each face
   - Fix any geometry issues before intersection
   - Use ShapeFix_Shape to repair

2. **Check face continuity**:
   - Verify the adjacent faces are properly connected
   - Check for gaps or overlaps at the shared boundary
   - Use BRepExtrema_DistShapeShape to check distances
   - Fix any discontinuities

3. **Use different intersection method**:
   - Try BRepAlgoAPI_Section instead of direct face-model intersection
   - Or use BRepAlgoAPI_Common
   - Different algorithms may handle the case differently

4. **Increase tolerance**:
   - Set a larger tolerance for the intersection operation
   - ```cpp
   BRepAlgoAPI_Section section(face, model, Standard_False);
   section.Approximation(Standard_True);
   section.ComputePCurveOn1(Standard_True);
   section.Build();
   ```
   - Larger tolerance may capture missing edges

5. **Report to OCCT developers**:
   - "State: open" — the issue is not yet resolved
   - Report on GitHub with the BREP files
   - Provide Model_ER.brep, Model_OK.brep, and Model.brep
   - The developers can analyze the missing edge case

6. **Work around with manual edge creation**:
   - After intersection, check for missing edges
   - Manually create the missing edges using BRepBuilderAPI_MakeEdge
   - Use the intersection curves to define the edges
   - Add them to the result shape

### Community Report

> "There is an issue of missing intersection edges during the BREP face-model intersection operation. Model_ER.brep and Model_OK.brep are two adjacent sliced faces. When intersecting these two faces with the base model Model.brep respectively, the intersection result of one face has missing edges while the other is normal. The intersection operation for adjacent sliced faces with the same base model should generate complete intersection edges."

## 3. BRepCheck_SubshapeNotInShape from Incomplete Shell Sewing Before Solidification

### Symptom

After deforming a shape (discretizing edges, moving points, creating BSpline curves, building new faces, sewing shell, making solid), BRepCheck returns BRepCheck_SubshapeNotInShape. The shape validation fails because a subshape (edge, vertex, wire) is not found in the parent shape.

### Root Cause

"This problem was due to a lack of sewing of the shell before the solidification." The shell was not properly sewn before creating the solid. BRepBuilderAPI_MakeSolid requires a properly sewn shell. If the shell has gaps or unsewn edges, the solidification creates an invalid solid. BRepCheck detects that subshapes from the original faces are not in the final solid because the sewing changed the topology.

### Fix

1. **Sew the shell before solidification**:
   - "This problem was due to a lack of sewing of the shell before the solidification"
   - Use BRepBuilderAPI_Sewing on the shell before BRepBuilderAPI_MakeSolid
   - ```cpp
   BRepBuilderAPI_Sewing sewing;
   sewing.Add(shell);
   sewing.Perform();
   TopoDS_Shape sewedShell = sewing.SewedShape();
   BRepBuilderAPI_MakeSolid solidMaker(TopoDS::Shell(sewedShell));
   ```
   - This ensures the shell is properly closed

2. **Use ShapeFix_Solid after solidification**:
   - After creating the solid
   - Run ShapeFix_Solid to validate and repair
   - ```cpp
   ShapeFix_Solid solidFix(solid);
   solidFix.SetPrecision(Precision::Confusion());
   solidFix.Perform();
   solid = TopoDS::Solid(solidFix.Shape());
   ```

3. **Validate faces before sewing**:
   - Use the validateFace function pattern
   - Check each face with BRepCheck_Analyzer
   - Fix invalid faces with ShapeFix_Wire
   - Then sew the validated faces

4. **Use proper sewing order**:
   - First validate all faces
   - Then create wires and faces
   - Then sew the shell
   - Then make the solid
   - Then validate with BRepCheck

5. **Check subshape mapping**:
   - After sewing, the subshape IDs may change
   - Use TopExp::MapShapes to create a map
   - Check if the original subshapes are in the new shape
   - If not, the sewing changed the topology

6. **Use BRepTools::Clean**:
   - After each operation
   - Call BRepTools::Clean(shape)
   - This removes unnecessary data
   - May prevent stale subshape references

### Community Report

> "BRepCheck on the result returns BRepCheck_SubshapeNotInShape. This problem was due to a lack of sewing of the shell before the solidification. After adding proper sewing with BRepBuilderAPI_Sewing before BRepBuilderAPI_MakeSolid, the BRepCheck passes. The validateFace function from FreeCAD TopoShapeFacePy can also help fix individual faces."

## 4. Inconsistent Generated Modified IsDeleted Across BRepBuilderAPI Classes

### Symptom

Using BRepFilletAPI_MakeFillet or BRepFilletAPI_MakeChamfer, IsDeleted() returns true for edges and vertices even if they exist unchanged in the result. Using BRepFeat_Form, Generated() silently returns empty list for faces. These inconsistencies make it difficult to write generic code that tracks shape history across different modeling operations.

### Root Cause

"BRepFilletAPI_MakeFillet and BRepFilletAPI_MakeChamfer: IsDeleted() only works reliably for faces, not for edges or vertices. Since myMap only contains faces, calling IsDeleted() on an edge or vertex will always return true (deleted), even if the shape exists unchanged in the result." The IsDeleted() implementation only checks the face map. For BRepFeat_Form, Generated() explicitly excludes faces with `S.ShapeType() != TopAbs_FACE`. These are API design inconsistencies — different classes implement the same interface differently.

### Fix

1. **Check Generated and Modified before IsDeleted**:
   - For BRepFilletAPI_MakeFillet/MakeChamfer
   - Don't rely on IsDeleted() for edges and vertices
   - Use this pattern:
   ```cpp
   bool isDeleted = fillet.IsDeleted(shape);
   if (isDeleted && (shape.ShapeType() != TopAbs_FACE)) {
     isDeleted = fillet.Generated(shape).IsEmpty() && fillet.Modified(shape).IsEmpty();
   }
   ```

2. **Use BRepOffset_MakeOffset as reference**:
   - "Reference implementation: BRepOffset_MakeOffset handles this correctly"
   - BRepOffset_MakeOffset maps all shapes, not just faces
   - Copy the pattern from BRepOffset_MakeOffset::IsDeleted
   - This maps all shapes and checks properly

3. **Track shapes manually**:
   - Don't rely on the API's history tracking
   - Before the operation, map all shapes with TopExp::MapShapes
   - After the operation, map the result shapes
   - Compare the maps to determine what changed

4. **Check shape type before calling Generated**:
   - For BRepFeat_Form
   - Don't call Generated() on faces
   - It will return empty due to the explicit exclusion
   - Use Modified() instead for faces

5. **Report to OCCT developers**:
   - "These inconsistencies make it difficult to write generic code"
   - The issue is open on GitHub (#1036)
   - The suggested fix is to update IsDeleted() to check Generated and Modified
   - And to remove the face exclusion in BRepFeat_Form::Generated

6. **Use a wrapper class**:
   - Create a wrapper that handles the inconsistencies
   - Check the class type and apply the correct logic
   - This centralizes the workaround
   - Makes the rest of the code clean

### Community Report

> "Several classes inheriting from BRepBuilderAPI_MakeShape have inconsistent or broken implementations of Generated(), Modified(), and IsDeleted() methods. BRepFilletAPI_MakeFillet: IsDeleted() only works for faces, not edges or vertices. BRepFeat_Form: Generated() explicitly excludes faces. These inconsistencies make it difficult to write generic code that tracks shape modifications. Reference implementation: BRepOffset_MakeOffset handles this correctly by mapping all shapes."

## 5. Implicit Topology Natural Bounds Creating Special Cases

### Symptom

When working with TopoDS shapes, algorithms encounter special cases where a face uses natural domain (no explicit boundary topology) instead of wires and edges. This creates problems in traversal, validation, selection, topological naming, and reconstruction. Algorithms must always check if a face has explicit topology or uses natural bounds.

### Root Cause

"In TopoDS, a face can use the natural domain of its surface instead of explicit boundary topology. This creates two processing modes: a face can have wires, edges, and vertices, or it can have no explicit lower topology and the boundary must be inferred from the surface." The TopoDS system allows faces to be defined without explicit boundary edges. This is a legacy design choice that creates special cases throughout the OCCT codebase. Algorithms that expect explicit topology fail when they encounter natural-bound faces.

### Fix

1. **Check for natural bounds before processing**:
   - Before traversing a face's topology
   - Check if the face has wires
   - ```cpp
   TopExp_Explorer exp(face, TopAbs_WIRE);
   if (!exp.More()) {
     // Face uses natural bounds — handle specially
   }
   ```
   - Handle natural-bound faces as a special case

2. **Convert natural bounds to explicit topology**:
   - Use BRepTools::OuterWire to get the boundary
   - Or use ShapeFix_Shape to add explicit topology
   - This normalizes the face to have explicit boundary
   - Then process normally

3. **Use BRepGraph for explicit topology**:
   - "BRepGraph uses a stricter rule: a bounded geometric face should provide explicit topology below it"
   - "The boundary is represented as face -> wire -> coedge -> edge -> vertex"
   - "If a source TopoDS face uses natural bounds, population should normalize it"
   - BRepGraph (OCCT 8.0+) handles this automatically

4. **Handle both modes in algorithms**:
   - When writing algorithms that process faces
   - Always check for both modes
   - If no wires, infer boundary from the surface
   - Don't assume all faces have explicit topology

5. **Use ShapeUpgrade for conversion**:
   - ShapeUpgrade_ConvertSurfaceToBezier or similar
   - Can convert natural-bound faces to explicit topology
   - This is a preprocessing step
   - After conversion, process normally

6. **Report topology issues**:
   - If an algorithm fails on natural-bound faces
   - Report to OCCT developers
   - The BRepGraph initiative in OCCT 8.0+ addresses this
   - But TopoDS compatibility must be maintained

### Community Report

> "In TopoDS, a face can use the natural domain of its surface instead of explicit boundary topology. This creates two processing modes: a face can have wires, edges, and vertices, or it can have no explicit lower topology and the boundary must be inferred from the surface. This looks like a small flag, but it creates many special cases. Algorithms must always remember that a face can be a normal bounded topology object or a surface-only object with implied boundaries. BRepGraph (OCCT 8.0+) uses a stricter rule: a bounded geometric face should provide explicit topology below it."

## 6. Additional OpenCASCADE Issues

### Transformation Applied Twice

**Issue**: "Transformation is applied twice, not applied at all, applied in the wrong frame, or compared through a location chain that is geometrically equal but structurally different."
**Fix**: Use BRepBuilderAPI_Copy to create a clean shape. Check transformation with BRepAdaptor_Surface. Use Location() to verify the actual transformation. BRepGraph (8.0+) moves placement into explicit references.

### P-Curve Invalidation

**Issue**: "A curve-on-surface may be connected to a surface pointer. If the face later changes its surface handle, the old p-curve can become stale."
**Fix**: Use ShapeFix_Wire to fix p-curves. Rebuild p-curves after surface changes. Use BRepGraph (8.0+) which makes p-curve invalidation more controlled.

### Orientation Special Cases

**Issue**: "TopoDS can have orientation values beyond FORWARD and REVERSED."
**Fix**: Use only FORWARD and REVERSED in custom code. Check orientation with TopAbs::OrientationToString. Use BRepAdaptor_Curve for orientation-safe access. BRepGraph keeps only forward and reversed in core topology.

### Stale Metadata After Editing

**Issue**: "Some metadata becomes stale after editing or import."
**Fix**: Use ShapeFix_Shape after editing. Clear caches with BRepTools::Clean. Use BRepGraph (8.0+) for explicit metadata management. Don't rely on cached data after operations.

### Topological Naming Problems

**Issue**: "A selector cannot reliably bind to an edge that does not exist. A naming system cannot name a boundary that is only implied by a surface domain."
**Fix**: Convert natural-bound faces to explicit topology. Use TNaming_Explorer for naming. Use BRepGraph (8.0+) for explicit topology references. Don't name implicit boundaries.

## Best Practices

1. **Use BRepBuilderAPI_Copy before chamfering/filleting after boolean operations** — breaks stale TShape sharing
2. **Add null checks after shape lookups** — prevents segfaults in ChFi3d
3. **Sew shells before solidification** — prevents BRepCheck_SubshapeNotInShape
4. **Use ShapeFix_Shape after complex operations** — cleans up topology
5. **Don't rely on IsDeleted() for edges/vertices in BRepFilletAPI** — check Generated and Modified instead
6. **Don't call Generated() on faces in BRepFeat_Form** — use Modified() instead
7. **Check for natural bounds before processing faces** — handle both modes
8. **Convert natural-bound faces to explicit topology** — normalizes for processing
9. **Track shapes manually for reliable history** — don't rely on inconsistent API
10. **Use BRepGraph (OCCT 8.0+) for explicit topology** — eliminates implicit topology special cases
