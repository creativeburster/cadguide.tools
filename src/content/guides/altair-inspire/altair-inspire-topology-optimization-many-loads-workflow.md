---
title: "Altair Inspire: Topology Optimization with Many Loads (70+ Force Case)"
excerpt: "An Altair Community user needs to run topology optimization on a component with 70 applied forces. Here are strategies for managing complex multi-load-case optimization in Inspire."
category: "workflow"
softwareSlug: "altair-inspire"
keyword: "altair inspire topology optimization many forces load cases"
slug: "altair-inspire-topology-optimization-many-loads-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "7 min read"
date: "2026-07-12"
sources:
  - "https://community.altair.com/discussion/60616/problem-with-topology-optimization"
  - "https://help.altair.com/inspire/en_us/topics/inspire/structure/optimization_topology.htm"
---

# Altair Inspire: Topology Optimization with Many Loads (70+ Force Case)

An Altair Community user (discussion #60616) reported a problem with Altair Inspire 2024: they have a component with approximately 70 applied point forces and need to run topology optimization. After trying PolyNURBS and PolyMesh, they couldn't run the simulation after optimization. They also asked whether creating the component in SolidWorks and importing it to Inspire would be simpler.

## The Challenge

Topology optimization with many individual forces creates several problems:

1. **Solver complexity**: Each force creates a separate load case entry. 70 forces can create a very large optimization problem that takes significant time and memory.
2. **Mesh quality**: Point forces create stress concentrations that require fine mesh locally. With 70 force application points, the mesh needs to be fine everywhere, increasing element count.
3. **Post-optimization simulation**: After topology optimization, the resulting shape may not have proper geometry for re-analysis. PolyNURBS fitting can fail with complex multi-load results.

## Strategy 1: Group Forces into Load Cases

Instead of 70 individual forces, group them into a smaller number of representative load cases:

1. **Identify force groupings**: Forces that act simultaneously should be in the same load case. Forces that act at different times (different operating conditions) should be in separate load cases.
2. **Create 3-5 representative load cases**: 
   - Load case 1: Maximum operating load (all forces at their maximum simultaneous values)
   - Load case 2: Worst-case directional load (forces in one direction)
   - Load case 3: Worst-case opposite directional load
   - Load case 4: Assembly/load condition
   - Load case 5: Transport/handling condition
3. **Apply resultant forces**: For groups of closely-spaced forces, replace them with a single resultant force and moment at the group's centroid

This reduces 70 forces to 5 load cases, which is much more manageable for the optimizer.

## Strategy 2: Use Pressure Instead of Point Forces

If the 70 forces represent a distributed load (e.g., bolt preload pattern, bearing pressure):

1. Replace the 70 point forces with a single **pressure** load on the face where they're applied
2. The pressure should be equivalent to the total force divided by the area
3. This eliminates 70 individual force definitions and creates a smoother load distribution
4. The optimizer handles pressure loads more efficiently than many point forces

## Strategy 3: Import from SolidWorks

The user asked whether creating the component in SolidWorks and importing to Inspire would be simpler. This is a valid approach:

1. **Design the component in SolidWorks** with all mounting holes, interfaces, and features
2. **Export as STEP** from SolidWorks
3. **Import the STEP file** into Inspire (File → Open)
4. **Define design and non-design spaces** in Inspire
5. **Apply loads and supports** in Inspire
6. **Run topology optimization**

Advantages of this approach:
- SolidWorks is better for complex geometry creation
- Inspire is better for optimization
- The STEP import preserves geometry accurately
- You can use SolidWorks configurations for different design variants

## Strategy 4: Simplify Before Optimization

Before running topology optimization:

1. **Remove cosmetic features**: Logos, text, small fillets that don't affect structural behavior
2. **Simplify the non-design space**: Only mark critical interfaces (mounting holes, bearing surfaces) as non-design space
3. **Coarse mesh for optimization**: Use a larger element size for the optimization run (e.g., 5mm instead of 2mm). You can refine the mesh later for validation analysis.
4. **Reduce mass target**: If maximizing stiffness with a mass target, use a higher mass fraction (e.g., 30% instead of 15%) for the initial run. This produces a more conservative shape that's easier to fit with PolyNURBS.

## Post-Optimization: PolyNURBS Fitting

The user reported they couldn't run simulation after optimization with PolyNURBS. This is a known workflow challenge:

### Correct Workflow
1. Run topology optimization
2. In the Shape Explorer, click **Smooth Results** to smooth the optimization result
3. Click **Fit PolyNURBS** to fit geometry to the smoothed result
4. Adjust fit parameters:
   - **Number of PolyNURBS Faces**: Start with 1200-2500 (fewer = smoother but less detail)
   - **Curvature**: 40-50% (higher captures more features but may create irregular geometry)
   - **Shrinkwrap Size**: Use default, adjust if fit doesn't capture the shape
5. Check **Intersect** to ensure the PolyNURBS stays within the original design space
6. Exit the PolyNURBS tool to generate the geometry
7. **Run a new analysis** on the PolyNURBS geometry (not the optimization result) to validate

### If PolyNURBS Fit Fails
- Increase smoothing iterations (80+)
- Reduce the number of PolyNURBS faces
- Reduce curvature percentage
- Try the PolyMesh Shrinkwrap tool first, then fit PolyNURBS to the shrinkwrapped mesh

## Inspire's Topology Optimization Parameters

According to Altair's documentation:

- **Maximize stiffness**: The resulting shape resists deflection but may be heavier. Uses mass targets.
- **Minimize mass**: The resulting shape is light but may deflect more.
- **Mass targets**: When maximizing stiffness, specify the percentage of designable material to retain (e.g., 30% means the optimized shape uses 30% of the design space volume).
- **Multiple load cases**: The optimizer considers all load cases simultaneously, finding the shape that performs best across all conditions.

For 70 forces grouped into 5 load cases, the optimizer will find a shape that maximizes stiffness across all 5 conditions while staying within the mass target.
