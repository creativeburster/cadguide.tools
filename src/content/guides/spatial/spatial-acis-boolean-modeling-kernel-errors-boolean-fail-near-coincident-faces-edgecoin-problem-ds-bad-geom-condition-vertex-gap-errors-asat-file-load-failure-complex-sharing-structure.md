---
title: "Spatial ACIS Boolean and Modeling Kernel Errors: Boolean Operation Fail from Near-Coincident Faces and Sliver Edges Requiring Incremental Boolean Workflow, EDGECOIN_PROBLEM from System Inconsistency Processing Edge Coincidence Requiring Model Healing, DS_BAD_GEOM_CONDITION from Poorly Conditioned Surface or Pcurve Requiring Geometry Repair, Vertex Gap Errors from Tolerance Violations Requiring api_check_vertex_errors, and Assembly Modeling ASAT File Load Failure from Complex Sharing Structure Requiring Default Entity Manager Factory"
excerpt: "Spatial ACIS fails for 5 distinct reasons: Boolean operation fail from near-coincident faces and sliver edges requiring incremental Boolean workflow, EDGECOIN_PROBLEM from system inconsistency processing edge coincidence requiring model healing, DS_BAD_GEOM_CONDITION from poorly conditioned surface or pcurve requiring geometry repair, vertex gap errors from tolerance violations requiring api_check_vertex_errors, and assembly modeling ASAT file load failure from complex sharing structure requiring default entity manager factory. We cover each with fixes from Spatial Documentation and Blog."
category: "boolean-and-modeling-kernel-errors"
softwareSlug: "spatial"
keyword: "Spatial ACIS Boolean operation fail near-coincident faces sliver edges incremental Boolean workflow EDGECOIN_PROBLEM system inconsistency edge coincidence model healing DS_BAD_GEOM_CONDITION poorly conditioned surface pcurve geometry repair vertex gap errors tolerance violations api_check_vertex_errors assembly modeling ASAT file load failure complex sharing structure default entity manager factory"
slug: "spatial-acis-boolean-modeling-kernel-errors-boolean-fail-near-coincident-faces-edgecoin-problem-ds-bad-geom-condition-vertex-gap-errors-asat-file-load-failure-complex-sharing-structure"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://blog.spatial.com/what-to-do-when-your-3d-modeling-boolean-operations-fail"
  - "http://www.q-solid.com/ACIS_Docs_R17/online/SPAacisuserTechArticles/SPAacisuser_erroramsgs.htm"
  - "http://www.q-solid.com/ACIS_Docs_R17/online/SPAacisuserTechArticles/SPAacisuser_asmlimits.htm"
---

# Spatial ACIS Boolean and Modeling Kernel Errors: Boolean Operation Fail from Near-Coincident Faces and Sliver Edges Requiring Incremental Boolean Workflow, EDGECOIN_PROBLEM from System Inconsistency Processing Edge Coincidence Requiring Model Healing, DS_BAD_GEOM_CONDITION from Poorly Conditioned Surface or Pcurve Requiring Geometry Repair, Vertex Gap Errors from Tolerance Violations Requiring api_check_vertex_errors, and Assembly Modeling ASAT File Load Failure from Complex Sharing Structure Requiring Default Entity Manager Factory

Spatial ACIS's Boolean operations, edge coincidence processing, solver geometry conditioning, vertex tolerance checking, and assembly file loading produce errors from near-coincident geometry, system inconsistencies, poorly conditioned surfaces, tolerance violations, and complex sharing structures. This guide covers the 5 most common Spatial ACIS problems with diagnostic steps and community-verified fixes from Spatial Documentation and Blog.

## 1. Boolean Operation Fail from Near-Coincident Faces and Sliver Edges

### Symptom

Boolean operations (unite, subtract, intersect) fail on bodies with near-coincident faces, sliver faces, short edges, or huge tolerant entities. The failure occurs without a specific error message — the Boolean API simply returns an error outcome. The failure is often the result of earlier Boolean operations or small errors from translating modeling data.

### Root Cause

"One of the primary reasons that Boolean operations fail is unclear design intent in the way the tool and blank are combined." Boolean operations are precise — they make no attempt to infer design intent. When two faces are nearly coincident, the Boolean can't determine if they're actually coincident (no intersection needed) or not (intersection must be computed). Sliver faces and short edges create geometric configurations that the intersection graph can't resolve. Huge tolerant entities have accumulated errors that exceed the Boolean's ability to reconcile. The failures are caused by: short edges and sliver faces, huge tolerant entities and collapsed features, improper intersections, near-coincident entities, near-tangent interactions, and complicated intersections.

### Fix

1. **Use the incremental Boolean workflow**:
   - "An incremental Boolean workflow is available to Spatial customers to increase the success rate"
   - When a standard Boolean fails, the incremental workflow is triggered
   - It performs localized optimization routines
   - "70% of failed Boolean operations successfully corrected by the incremental Boolean workflow"

2. **Set the near_coi_fuzz option**:
   - "This object can be used to specify a 'near coincidence fuzz' value"
   - "If this value is set and is greater than resabs, then it is used as a hint to the Boolean"
   - "Pairs of entities which are coincident to within the fuzz value may be regarded as coincident"
   - Set `near_coi_fuzz` to a value slightly larger than the coincidence gap

3. **Heal the model before Boolean**:
   - "Healing is a global operation performed on a single body"
   - Use `api_heal_body` to repair the model
   - Healing fixes sliver faces, short edges, and tolerant entities
   - Then retry the Boolean operation

4. **Simplify the model**:
   - Remove unnecessary features before Boolean
   - Eliminate sliver faces and short edges
   - Reduce tolerant entities
   - Simplify complex intersections

5. **Use non-regularized Boolean**:
   - "Nonregularized Boolean operations include interactions of model boundaries"
   - "Leave all boundary coincidences unresolved"
   - Use non-regularized mode for near-coincident faces
   - This may avoid the coincidence detection issue

6. **Check model validity first**:
   - Use `api_check_entity` with `check_ff_int` option
   - Check for improper face/face intersections
   - Check for improper shell containment
   - Fix any validity issues before Boolean

7. **Use the prepare API**:
   - "The workflow calls the prepare API to resolve recognized complexities"
   - The prepare phase makes near-coincident faces coincident
   - Then passes both bodies back to the Boolean API
   - The workflow continues until no complexity is reported

### Community Report

> "Boolean operations can fail for a variety of reasons, often the result of earlier Boolean operations. The most common reasons boil down to unclear design intent: short edges and sliver faces, huge tolerant entities and collapsed features, improper intersections, near-coincident entities, near-tangent interactions, and complicated intersections. The incremental Boolean workflow applies when an initial Boolean operation does not succeed. 70% of failed Boolean operations successfully corrected by the incremental Boolean workflow required only a single iteration of the prepare step."

## 2. EDGECOIN_PROBLEM from System Inconsistency Processing Edge Coincidence

### Symptom

During a Boolean operation, the error `EDGECOIN_PROBLEM` appears: "system inconsistency processing edge coincidence." The Boolean operation fails. The error occurs when two bodies have edges that are nearly coincident. The error may also appear as `EDGE_EDGE_COIN`: "wire edge coincidences not yet implemented."

### Root Cause

The `EDGECOIN_PROBLEM` error occurs when the Boolean operation's edge coincidence processing encounters a system inconsistency. During a Boolean, the system must determine which edges of the tool and blank are coincident. When edges are nearly but not exactly coincident, the coincidence detection algorithm may produce inconsistent results — declaring two edges coincident in one step and non-coincident in another. This inconsistency causes the Boolean to fail with `EDGECOIN_PROBLEM`.

### Fix

1. **Heal the bodies before Boolean**:
   - Use `api_heal_body` on both the tool and blank
   - Healing resolves edge coincidence issues
   - It makes near-coincident edges exactly coincident
   - Then retry the Boolean

2. **Use the near_coi_fuzz option**:
   - Set the `near_coi_fuzz` Boolean option
   - This tells ACIS that near-coincident edges are intended to be coincident
   - ACIS creates tolerant entities to enforce coincidence
   - This may resolve the edge coincidence inconsistency

3. **Check for EDGE_EDGE_COIN**:
   - "EDGE_EDGE_COIN: wire edge coincidences not yet implemented"
   - If the error is `EDGE_EDGE_COIN`, the Boolean can't handle wire edge coincidence
   - Convert wire bodies to sheet or solid bodies first
   - Then retry the Boolean

4. **Use the incremental Boolean workflow**:
   - The prepare phase can resolve edge coincidence
   - It makes coincident edges exactly coincident
   - Then the Boolean can process them correctly
   - "The workflow continues until no complexity is reported"

5. **Check edge quality**:
   - Use `api_check_entity` to check edge quality
   - Look for short edges and sliver faces
   - Remove or repair problematic edges
   - Then retry the Boolean

6. **Use imprint instead of Boolean**:
   - If the Boolean fails with EDGECOIN_PROBLEM
   - Try `api_imprint_complete` instead
   - Imprint finds intersections and imprints them
   - Then manually stitch or merge

7. **Set the all_free_edges option**:
   - "If this option is on, all edges on coincident faces are processed as free edges"
   - "This causes mergeable edges to be included in the intersection graph"
   - "This option should be off for nearly all applications"
   - Use only as a last resort

### Community Report

> "EDGECOIN_PROBLEM: boolean.err system inconsistency processing edge coincidence. EDGE_EDGE_COIN: boolean.err wire edge coincidences not yet implemented. These errors occur when the Boolean operation's edge coincidence processing encounters a system inconsistency. The incremental Boolean workflow calls the prepare API to resolve recognized complexities between the tool and/or blank before passing both back to the Boolean API."

## 3. DS_BAD_GEOM_CONDITION from Poorly Conditioned Surface or Pcurve

### Symptom

The error `DS_BAD_GEOM_CONDITION` appears: "solver error: poorly conditioned surface or pcurve." The error occurs during operations that use the Deformable Surfacing (DS) component, such as deformable modeling or surface optimization. The solver can't converge because the surface or pcurve geometry is poorly conditioned.

### Root Cause

The `DS_BAD_GEOM_CONDITION` error comes from the `ds2acis.err` error file. The DS (Deformable Surfacing) solver uses numerical methods that require well-conditioned geometry. A poorly conditioned surface has parameter ranges that are very different in U and V directions, or has areas of extreme curvature. A poorly conditioned pcurve has parameter ranges that don't match the underlying surface well. The solver's Jacobian matrix becomes ill-conditioned, preventing convergence.

### Fix

1. **Reparameterize the surface**:
   - Use `api_reparameterize` to improve surface parameterization
   - Make U and V parameter ranges more uniform
   - This improves the solver's conditioning
   - Then retry the operation

2. **Simplify the surface geometry**:
   - Replace complex spline surfaces with simpler ones
   - Reduce the degree of the surface
   - Remove unnecessary control points
   - This improves conditioning

3. **Check the pcurve**:
   - Verify the pcurve parameter range matches the surface
   - Use `api_check_pcurve` to validate
   - Recreate the pcurve if necessary
   - A well-conditioned pcurve is essential

4. **Use the DS solver options**:
   - Adjust solver tolerance
   - Increase maximum iterations
   - Use a different solver method
   - Check DS documentation for options

5. **Heal the surface**:
   - Use `api_heal_body` to repair surface geometry
   - Healing fixes poorly conditioned surfaces
   - It also fixes pcurve issues
   - Then retry the DS operation

6. **Check for degenerate surfaces**:
   - Look for surfaces with zero area regions
   - Check for surfaces with degenerate edges
   - Remove or replace degenerate surfaces
   - These cause poor conditioning

7. **Use a different modeling approach**:
   - If DS continues to fail
   - Use standard ACIS modeling operations
   - Avoid deformable modeling for poorly conditioned surfaces
   - Use direct surface manipulation instead

### Community Report

> "DS_BAD_GEOM_CONDITION: ds2acis.err solver error: poorly conditioned surface or pcurve. DS_INTERNAL_ERROR: ds2acis.err. DS_UNKNOWN_ERROR: ds2acis.err DM kernel signalled an unknown error. These errors occur during operations that use the Deformable Surfacing component when the surface or pcurve geometry is poorly conditioned, preventing the solver from converging."

## 4. Vertex Gap Errors from Tolerance Violations

### Symptom

After Boolean operations or model import, vertices have gaps that exceed the model tolerance. The model may appear valid visually but has small gaps between edges and vertices. The `api_check_vertex_errors` function reports bad vertices with gap errors worse than the specified tolerance.

### Root Cause

During Boolean operations, model import, or translation, vertices may end up with gaps larger than `SPAresabs` (the ACIS resolution tolerance). This happens when: (1) the Boolean operation creates new vertices at intersection points that don't exactly match existing vertices, (2) imported models have different tolerance standards, (3) tolerant entities accumulate errors through multiple operations. The gaps are small but exceed the model's precision requirement.

### Fix

1. **Use api_check_vertex_errors**:
   - "Checks the VERTEX in the given ENTITY_LIST for gaps worse than the specified tolerance"
   - "Any such vertices are added to the bad_vertices list"
   - "If new_vertices is given, such vertices are converted into tolerant vertices"
   - This function identifies and fixes bad vertices

2. **Convert bad vertices to tolerant vertices**:
   - "api_check_vertex_errors normally converts 'bad' vertices into tolerant ones"
   - Pass the `new_vertices` parameter
   - Bad vertices are converted to tolerant vertices
   - Tolerant vertices can accommodate larger gaps

3. **Use the fail-safe behavior**:
   - "This API has a fail-safe behavior — it attempts to do as much as possible and not fail"
   - "On an event of a recoverable error this API will raise a sys_warning"
   - "And proceed further"
   - The fail-safe mode fixes as many vertices as possible

4. **Set stop_immediately to FALSE**:
   - "If stop_immediately is TRUE, processing stops after the first bad vertex"
   - Set to FALSE to process all vertices
   - This finds all bad vertices in one pass
   - More efficient for large models

5. **Use careful mode for strict checking**:
   - "The fail-safe behavior can be switched OFF by pushing a value of TRUE onto the option 'careful'"
   - "When fail-safe is off, this API will fail and roll back on the first error"
   - Use careful mode when you need strict validation
   - Use fail-safe mode for repair

6. **Heal the model**:
   - Use `api_heal_body` to fix vertex gaps
   - Healing adjusts vertices to close gaps
   - It also fixes edge and face issues
   - Then verify with `api_check_vertex_errors`

7. **Check the outcome**:
   - "If outcome::encountered_errors() returns FALSE, the API has fully succeeded"
   - "If outcome::encountered_errors() returns TRUE, and outcome::ok() returns TRUE, the API proceeded further successfully"
   - "If outcome::ok() returns FALSE, the API has failed and rolled back"
   - Always check the outcome to verify the fix

### Community Report

> "api_check_vertex_errors checks the vertices in the given list for gaps worse than the specified tolerance. Any such vertices are added to the bad_vertices list. If new_vertices is given, such vertices are converted into tolerant vertices. This API has a fail-safe behavior — it attempts to do as much as possible and not fail, even in cases when it encounters errors during the operation. On an event of a recoverable error, this API will undo the current atomic operation that failed and proceed further."

## 5. Assembly Modeling ASAT File Load Failure from Complex Sharing Structure

### Symptom

ASAT files saved with history, containing a more complicated sharing structure between models (e.g., two models per history stream), cannot be loaded using an entity manager factory that creates ACIS PART objects (e.g., `acis_pm_entity_mgr_factory` or `acis_scm_entity_mgr_factory`). The load fails with an error about the sharing structure.

### Root Cause

"ASAT files which have been saved with history with a more complicated sharing structure between the models in the file cannot be loaded using an entity manager factory which creates ACIS PART objects." The ACIS PART entity manager has a limitation when loading ASAT files with complex model sharing structures. When two models share a single history stream, the PART entity manager can't represent this sharing relationship. The PART model assumes each model has its own independent history stream, which conflicts with the shared history structure in the file.

### Fix

1. **Use default_entity_mgr_factory**:
   - "They can be loaded into memory using a default_entity_mgr_factory"
   - Use the default entity manager instead of PART-based managers
   - This loads the file without the PART limitation
   - The sharing structure is preserved

2. **Deep-copy into new PART objects**:
   - "The contents of the offending models can be deep-copied into new PART objects"
   - Load with `default_entity_mgr_factory`
   - Then deep-copy each model into a new PART
   - This creates independent PART objects

3. **Save without complex sharing**:
   - When saving ASAT files
   - Avoid creating complex sharing structures
   - Save each model with its own history stream
   - Don't share history streams between models

4. **Use distributed history mode**:
   - "This assumes that the application is working in distributed history mode"
   - Distributed history mode handles sharing better
   - Configure your application for distributed history
   - Then load the ASAT file

5. **Check for PHL V5 entities**:
   - "Customers should not attempt to save PHLV5_EDGE and PHLV5_SEGMENT to SAT or ASAT files"
   - Ensure PHL V5 entities are not in the file
   - These should not be persisted
   - Remove them before saving

6. **Avoid HA_bridge transparency issues**:
   - "The code implementing transparency in the HA_bridge incorrectly interprets the numerical value"
   - "t = 0 is interpreted as opaque and t = .99 is interpreted as almost transparent"
   - This is reversed from documentation
   - Be aware of this when using HA_bridge

7. **Use asm_restore_file carefully**:
   - "asm_restore_file::needs_restore_vf() is ignored by assembly modeling code"
   - "Customers should not override this virtual method"
   - Don't rely on this method for restore behavior
   - Use standard restore mechanisms

### Community Report

> "ASAT files which have been saved with history with a more complicated sharing structure between the models in the file (for example, two models per history stream) cannot be loaded using an entity manager factory which creates ACIS PART objects. When such files are encountered, they can be loaded into memory using a default_entity_mgr_factory and then the contents of the offending models can be deep-copied into new PART objects. This assumes that the application is working in distributed history mode."

## 6. Additional ACIS Issues

### BL_ASSERTION_VIOLATED Blending Error

**Issue**: "BL_ASSERTION_VIOLATED: blending.err blending assertion violated."
**Fix**: Check blend parameters. Verify edge geometry supports blend. Simplify blend radius. Use api_blend_edges with different options.

### BL_ATTRIB_BAD_PROC Blending Error

**Issue**: "BL_ATTRIB_BAD_PROC: blending.err illegal procedure attempted for blend attribute."
**Fix**: Check blend attribute procedures. Remove invalid blend attributes. Recreate blend. Use standard blend API.

### DS_INTERNAL_ERROR

**Issue**: "DS_INTERNAL_ERROR: ds2acis.err."
**Fix**: Check DS solver configuration. Verify surface geometry. Update ACIS version. Contact Spatial support.

### DS_UNKNOWN_ERROR

**Issue**: "DS_UNKNOWN_ERROR: ds2acis.err DM kernel signalled an unknown error."
**Fix**: Check DM kernel initialization. Verify input geometry. Update ACIS. Contact Spatial support with repro case.

### HA_bridge Roll Callback Issue

**Issue**: "The callbacks which re-render assembly models upon roll are incorrectly implemented in the HA_bridge."
**Fix**: "Customers must explicitly perform a (render:rebuild) after rolling a history stream." Manually rebuild rendering after roll.

### asmi_raytest_ents Multiple Models

**Issue**: "asmi_raytest_ents accepts an asm_model_list as input but only makes sense with a single model."
**Fix**: "Only call this routine with a single asm_model in the input model list." Don't pass multiple models. This signature may be deprecated.

### asmi_component_has_hiding_modifications

**Issue**: "asmi_component_has_hiding_modifications is unable to detect any such modifications."
**Fix**: "This is planned to be corrected in a future Service Pack." Don't rely on this function. Use alternative detection methods. Check for updates.

## Best Practices

1. **Use the incremental Boolean workflow** — 70% of failed Booleans are corrected automatically
2. **Set near_coi_fuzz for near-coincident geometry** — tells ACIS to treat near-coincident as coincident
3. **Heal models before Boolean operations** — fixes sliver faces, short edges, and tolerant entities
4. **Use api_check_vertex_errors to find and fix vertex gaps** — converts bad vertices to tolerant ones
5. **Reparameterize poorly conditioned surfaces** — improves DS solver convergence
6. **Use default_entity_mgr_factory for complex ASAT files** — then deep-copy into PART objects
7. **Don't save PHL V5 entities to ASAT files** — they should not be persisted
8. **Use fail-safe mode for batch vertex checking** — fixes as many vertices as possible
9. **Check model validity with check_ff_int before Boolean** — finds improper face/face intersections
10. **Avoid complex sharing structures in ASAT files** — use independent history streams per model
