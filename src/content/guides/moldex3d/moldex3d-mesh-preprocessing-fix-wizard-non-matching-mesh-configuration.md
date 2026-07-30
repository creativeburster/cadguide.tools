---
title: "Moldex3D Mesh Preprocessing: Fix Wizard, Non-Matching Mesh Technology, and Contact Face Alignment for Multi-Component Molding"
excerpt: "Moldex3D simulation accuracy depends on mesh quality. We cover the Fix Wizard for automatic defect repair, non-matching mesh technology for complete mold analysis, Auto Copy/Paste for contact face alignment, and Divide Polysurfaces for MCM mesh generation — with specific tolerance settings and seeding rules."
category: "configuration"
softwareSlug: "moldex3d"
keyword: "Moldex3D mesh preprocessing Fix Wizard non-matching mesh contact face MCM solid mesh generation"
slug: "moldex3d-mesh-preprocessing-fix-wizard-non-matching-mesh-configuration"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.moldex3d.com/blog/tips-and-tricks/moldex3ds-fix-wizard-offers-automatic-fix-on-mesh-defects/"
  - "https://www.moldex3d.com/blog/tips-and-tricks/more-efficiency-to-improve-mesh-model-with-matching-faces/"
  - "https://www.moldex3d.com/blog/tips-and-tricks/efficient-moldbase-mcm-mesh-generation-with-new-divide-polysurfaces-feature/"
---

# Moldex3D Mesh Preprocessing: Fix Wizard, Non-Matching Mesh Technology, and Contact Face Alignment for Multi-Component Molding

Mesh quality is the single most important factor in Moldex3D simulation accuracy. Poor mesh causes convergence failures, inaccurate pressure/temperature predictions, and failed solid mesh generation. Moldex3D provides a layered mesh preprocessing toolkit: automatic defect repair (Fix Wizard), non-matching mesh technology for rapid mold analysis, and contact face alignment tools for multi-component molding (MCM).

## Layer 1: Fix Wizard — Automatic Mesh Defect Repair

Before generating a solid mesh, run the Fix Wizard to automatically detect and repair surface mesh defects.

### When to Run Fix Wizard

Run Fix Wizard **prior to Generate Solid Mesh** whenever mesh defects are detected in the surface mesh. The Surface Mesh Information panel shows defect counts — if any serious issues are listed, launch Fix Wizard first.

### Fix Wizard Workflow

**Step 1**: Click **Fix Wizard** in the mesh tools

**Step 2**: Select objects to fix. Sequential dialogs appear for each defect type:

| Dialog | Defect Type | Action |
|--------|------------|--------|
| 1 | Gaps and tiny elements | Set a tolerance to merge nodes, or Skip |
| 2 | Overlapping elements (marked green) | Click Execute to eliminate, or Skip if none detected |
| 3 | Closed free edge loops (missing/disconnected elements) | Click Execute to fix, or Skip if no free edges |
| 4 | Low-quality elements | Tick **Keep feature** to preserve curvatures and complex geometry during fixing |

**Step 3**: Review Surface Mesh Information — all serious issues should now be resolved. The mesh is ready for solid mesh generation.

### Keep Feature Option

When fixing low-quality elements, **Keep feature** prevents the fixing process from distorting the model's contour or shape. This is critical for models with:
- Curvatures
- Small features
- Complex geometry

Always enable Keep feature for production parts with detailed geometry.

## Layer 2: Non-Matching Mesh Technology

### The Problem It Solves

Building matching solid mesh across every mold component (part, part insert, moldbase, mold insert) requires enormous manual effort. Before non-matching mesh technology, very few successful complete mold analysis cases existed because of the mesh alignment burden.

### Evolution of Non-Matching Mesh Support

| Moldex3D Version | Non-Matching Mesh Scope |
|------------------|------------------------|
| R14.0 | Part ↔ Part insert |
| R15.0 | Part ↔ Part insert ↔ Moldbase |
| R16 | Part ↔ Part insert ↔ Moldbase ↔ Mold insert + Mold plate attributes (fixed/movable) |

### How to Use Non-Matching Mesh

1. Import the geometry model of the entire mold
2. Build detailed mesh elements for each mold component independently
3. Export the MFE file — the software automatically checks for mesh cell intersections
4. If intersection amount is too large, non-hollowed tunnels may form — these must be modified to prevent analysis problems
5. Small amounts of mesh cell intersection are acceptable with non-matching mesh technology

### Trade-Off

Non-matching mesh saves significant modeling time but may slightly reduce accuracy at contact interfaces. For production-critical analyses, use matching mesh (see Layer 3). For rapid mold analysis and design iteration, non-matching mesh is sufficient.

## Layer 3: Auto Copy/Paste — Contact Face Mesh Alignment

For analyses requiring full physical continuity at contact surfaces (e.g., part ↔ part insert), use the Auto Copy/Paste function to create matching mesh on contact faces.

### Workflow

1. **Seeding**: Click **Seeding** and specify global and local mesh size
   - For local seeding: select the boundary of the contact surface (yellow edges) and apply **Uniform seeding** to ensure consistent seeding between part and part insert
   - This step reduces post-processing effort after Auto Copy/Paste

2. **Generate surface mesh**: Click **Generate** → select **Surface Mesh**
   - After generation, many non-matching surface meshes will appear on the contact surface between the two objects

3. **Auto Copy/Paste**: In **Fix Mesh**, click **Auto Copy/Paste**
   - Select **Part** as the reference object
   - Select **Part Insert** as the target object
   - The contact surface mesh from the part is copied to the insert, creating matching nodes

4. **Verification**: Matching surface meshes appear in **blue**, non-matching in **red**
   - If **Solid – Allow non-matching faces** is unchecked in **Preferences → Mesh**, the red highlights are visible
   - Target: zero non-matching faces on the contact surface

5. **Post-fix**: After Auto Copy/Paste, the boundary of fixed mesh may cause minor errors:
   - **Free edges**: Launch **Merge Nodes** → select all surface meshes → uncheck "Only merge nodes on free edges" → click OK
   - **Inner shells**: Click inner shells in the defect list → press **Delete**
   - **Remaining free edges**: Repair via **Stitch** tool

### Result

After Auto Copy/Paste, mesh nodes on the contact surface are fully connected between part and part insert. This ensures continuous analysis results across material boundaries — critical for thermal and structural simulations.

## Layer 4: Divide Polysurfaces — MCM Mesh Generation (Moldex3D 2026)

Multi-Component Molding (MCM) simulations are particularly challenging because contact faces between different materials (e.g., double-shot molding, metal inserts) require precise mesh alignment.

### The New Divide Polysurfaces Feature

Moldex3D 2026 introduces **Divide Polysurfaces** to automate contact face handling:

1. In the Mesh Tab, set the **Divide Tolerance**
2. The function **automatically determines** which polysurface geometries are in contact within the user-input tolerance
3. It conducts dividing across all contact surfaces in one operation — no need to repeatedly execute for different target geometries
4. A **progress bar** shows current progress, with a **Cancel button** to suspend execution

### MCM Mesh Generation Workflow

1. Confirm mesh type as **Solid** in the Mesh Tab
2. Perform **seeding** with these rules:
   - Seeding density shouldn't vary too much between components
   - **Do NOT check** "Turn on curvature-based refinement"
   - If mesh count is high, **do NOT check** "Automatically check mesh defect" — this prevents automated updates to the defect tree during mesh fixing
3. MCM models require **matching mesh** — enter the BLM Wizard and pin it at the first step to generate the surface mesh
4. **Decide matching sequence**: Match internal inserts first, proceed from inside out
5. Warnings show areas and edges with non-matching mesh — use the **Contact Face Edit Tool** to fine-tune
6. **Recheck surface mesh defects** — success is confirmed when the Non-matching Faces error count is zero

### Benefits Over Manual Approach

- Divide contact faces more efficiently across multiple geometries simultaneously
- Clearer progress bar keeps users informed
- Cancel button allows suspending and resuming
- No need to repeatedly execute Divide Face/Polysurface for different target geometries

## Mesh Density and Simulation Accuracy

Research on injection molding CAE simulation has shown that mesh geometry and density significantly impact both accuracy and computation time:

### Key Findings

- **2D mesh with lower density**: Faster and more precise for pressure simulation inside the mold
- **3D mesh with lower density**: Faster and more precise for temperature simulation
- **3D mesh with higher density**: Better for parts with thickness variation or mass accumulation (chunky regions)
- **Very high node count**: Can cause result fluctuation due to truncation and rounding during calculation
- **Very low density**: Inadequate geometry representation leads to result deviation
- **2D midplane mesh**: Precision increases without large element count increase — efficient for simple geometries

### Practical Recommendation

Start with Moldex3D's default mesh parameters, then refine locally at critical areas (gates, thin walls, sharp transitions). Use the Fix Wizard after each refinement pass to maintain mesh quality. For final validation runs, use the finest mesh that converges within your computational time budget.

### Convergence Failure with Fine Mesh

In rare cases, extremely fine mesh (e.g., 2D midplane with 1mm maximum segment length) may **not converge** — truncation can lead to an infinite calculation loop. If this occurs, coarsen the mesh slightly and re-run.
