---
title: "Altair HyperMesh: Mesh Quality Criteria, BatchMesher Settings, and Element Optimization"
excerpt: "How to create high-quality FEA meshes in Altair HyperMesh — covering element quality criteria, BatchMesher parameter configuration, target/min/max element sizing, solid mesh optimization, and best practices for meshing complex geometry."
category: "workflow"
softwareSlug: "altair-hyperworks"
keyword: "altair hypermesh mesh quality criteria batchmesher element optimization"
slug: "altair-hypermesh-mesh-quality-criteria-batchmesher-element-optimization"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-09"
sources:
  - "https://2026.help.altair.com/2026/hwdesktop/hwx/topics/pre_processing/meshing/batchmesher_criteria_parameter_best_practices_r.htm"
  - "https://www.help.altair.com/2021/hwdesktop/hm/topics/pre_processing/meshing/solid_mesh_optimization_t.htm"
---

# Altair HyperMesh: Mesh Quality Criteria, BatchMesher Settings, and Element Optimization

Mesh quality determines FEA accuracy. A poor mesh gives wrong results — regardless of how good your solver setup is. I've spent years meshing everything from simple brackets to full vehicle bodies in HyperMesh. The difference between a good mesh and a bad mesh isn't the tool — it's knowing how to configure the quality criteria and parameters. Here's my guide.

## Why Mesh Quality Matters

Poor mesh quality causes:
- **Inaccurate results** — distorted elements don't represent stress/strain accurately
- **Convergence problems** — solver may not converge with poor elements
- **Artificial stress concentrations** — bad elements create fake hotspots
- **Non-physical results** — negative volume elements cause solver crashes
- **Wasted computation** — over-refined meshes waste CPU time without improving accuracy

## Step 1: Define Element Quality Criteria

### Quality Metrics

HyperMesh checks these element quality metrics:

1. **Aspect Ratio**: Length/width ratio — should be < 5 for most applications
2. **Warpage**: Out-of-plane distortion — should be < 5° for shells
3. **Skew**: Angular distortion — should be < 30° for quads, < 20° for tris
4. **Jacobian**: Element distortion measure — should be > 0.6 (0 to 1 scale)
5. **Min Angle**: Minimum internal angle — should be > 30° for quads, > 20° for tris
6. **Max Angle**: Maximum internal angle — should be < 150° for quads
7. **Length (Min/Max)**: Element edge length — must match target size
8. **Chordal Deviation**: Distance between element edge and geometry — should be < 0.1mm

### Setting Quality Criteria

1. Go to **Mesh** → **Check** → **Criteria**.
2. Set thresholds for each metric:
   - **Good**: Elements that pass all criteria
   - **Warn**: Elements that are marginal — review but may be acceptable
   - **Worst**: Elements that fail — must be fixed
3. The criteria file (.criteria) can be saved and reused across projects.

### Standard Criteria Sets

| Application | Aspect Ratio | Warpage | Skew | Min Jacobian |
|---|---|---|---|---|
| General structural | < 5 | < 5° | < 30° | > 0.6 |
| Crash/impact | < 3 | < 3° | < 20° | > 0.7 |
| CFD | < 5 | < 5° | < 25° | > 0.5 |
| Fatigue | < 3 | < 3° | < 20° | > 0.7 |
| Nonlinear | < 4 | < 5° | < 25° | > 0.6 |

## Step 2: Configure BatchMesher Parameters

BatchMesher automates meshing by applying criteria and parameters to geometry:

1. Go to **Mesh** → **BatchMesher**.
2. Define **Model Mesh Control**:
   - **Element Size**: Target element size (mm)
   - **Element Type**: Quad (preferred) or Tri3/Tri6
   - **Element Order**: First-order (linear) or second-order (quadratic)
   - **Feature Angle**: 30° (default) — edges sharper than this are preserved

### Critical Sizing Parameters

The three most important sizing parameters:

1. **Target Size**: The desired element size
   - Based on the smallest feature you need to capture
   - Typically 2-3x the smallest geometry feature

2. **Min Size**: Minimum element size
   - **Recommended**: 33% of Target Size
   - **Acceptable**: 40-50% of Target Size
   - **Too large**: Triggers intensive cleanup that disrupts mesh flow
   - **Too small**: Creates tiny elements that waste computation

3. **Max Size**: Maximum element size
   - **Recommended**: 175% of Target Size
   - **Too small**: Limits coarsening in low-stress regions
   - **Too large**: Creates poor transitions

### Parameter Relationships

```
Min Size = 0.33 × Target Size
Max Size = 1.75 × Target Size
```

Example for a 5mm target:
```
Min Size = 0.33 × 5 = 1.65mm
Max Size = 1.75 × 5 = 8.75mm
```

### Why These Relationships Matter

- **Min Size too large**: The mesher can't create small enough elements to fill gaps, triggering cleanup that disrupts the mesh flow
- **Max Size too small**: The mesher can't coarsen in open areas, creating unnecessarily dense meshes
- **Range too tight**: Limited ability to improve mesh quality through size variation

## Step 3: Configure Feature Suppression

Feature suppression removes non-critical geometry features before meshing:

1. **Flat feature suppression**: Set to "Low" with "Element Size" as feature character size
2. **Suppress edges by proximity**: Set to less than minimum element size
3. **Suppress beads with height <**: 20% of target element size (not larger than criteria min size)
4. **Remove edge fillet with radius <**: Between min element size and target element size

### Feature Suppression Impact

- **Too aggressive**: Removes important features, inaccurate results
- **Too conservative**: Retains unnecessary features, poor mesh quality
- **Balanced**: Removes only non-critical features, clean mesh

## Step 4: Configure Holes and Washers

Holes are critical for bolted connections and stress analysis:

1. **Hole radius threshold for removal**: ≥ 0.708 × min element size
   - Holes smaller than this are removed (filled with mesh)
   - Holes larger than this are meshed with washers

2. **Washer configuration**:
   - **# Elements around hole**: Minimum 6 (recommended 8-12)
   - **Washer width**: 1-1.5x target element size
   - **Washer rings**: 1-2 rings around the hole

3. **Hole priority**:
   - **Normal**: Washer nodes can move to correct quality
   - **High**: Washer elements are not modified — may create failed elements

### Washer Best Practices

- **Use minimal mode for # elems and auto mode for washers** — most flexible
- **Don't use auto for washers** — can create washers with failed elements
- **Use even number of elements** — better mesh flow
- **Minimum 6 elements around hole** — fewer creates poor quality

## Step 5: Configure Flanges

Flanges are common in sheet metal and structural models:

1. **Elements across flange width**: Minimum 2 (recommended 2-4)
2. **Max flange width**: (N + 1.5) × element size, where N = number of elements
3. **Min flange width**: 2 × min element size
4. **Even number of elements** — better mesh flow

### Flange Meshing Issues

- **Too few elements across flange**: Can't capture bending stress accurately
- **Too many elements**: Wastes computation, poor mesh flow
- **Odd number of elements**: Creates a center element that doesn't align with adjacent mesh

## Step 6: Generate and Check the Mesh

1. Click **Mesh** in BatchMesher to generate the mesh.
2. After meshing, check quality:
   - Go to **Mesh** → **Check** → **Elements**
   - Review failed elements (worst quality)
   - Review warned elements (marginal quality)
3. Fix failed elements:
   - **Auto-fix**: Use the quality improvement tools
   - **Manual fix**: Remesh specific areas
   - **Solid Mesh Optimization**: For tetra/hexa meshes

## Step 7: Use Solid Mesh Optimization

For 3D solid meshes (tetra, hexa):

1. Go to **Mesh** → **Check** → **Elements** → **Solid Mesh Optimization**.
2. Select elements to optimize.
3. Configure:
   - **Boundary triangles**: 
     - **Fix All**: No boundary modification (safest)
     - **Edge Swap**: Swap edges of boundary triangles
     - **Remesh**: Boundary triangles can be remeshed (best results)
   - **Constraints**:
     - **Fixed Trias**: Don't modify tria elements
     - **Feature Line**: Preserve feature edges
     - **Anchor Nodes**: Don't move selected nodes
     - **Refinement Box**: Remesh elements inside a box
4. Set **Max Iteration**: Number of optimization steps (default 10)
5. Click **Fix** to optimize.

### Optimization Tips

- **Use "Remesh" for boundary triangles** — yields best results but takes longer
- **Check "Maintain Geometry Edges"** — nodes on geometry edges aren't modified
- **Enable "Optimize Tetras by Force"** — includes node insertion for higher quality
- **Use "Show Failed"** to see which elements still fail after optimization

## Step 8: Check Mesh-Geometry Association

After meshing, verify that the mesh is associated with the geometry:

1. Go to **Mesh** → **Check** → **Associativity**.
2. Check that:
   - **Nodes on surfaces**: Mesh nodes are associated with geometry surfaces
   - **Nodes on edges**: Mesh nodes are associated with geometry edges
   - **Nodes on points**: Mesh nodes are associated with geometry points
3. If mesh is not associated:
   - Use **Mesh** → **Associate** to re-associate
   - Or remesh the affected areas

### Why Association Matters

- **Geometry updates**: If the geometry changes, associated mesh updates automatically
- **Boundary conditions**: Loads and constraints applied to geometry transfer to the mesh
- **Mesh editing**: Associated mesh can be remeshed when geometry changes

## Step 9: Mid-Surface Extraction

For sheet metal parts, extract the mid-surface before meshing:

1. Go to **Geometry** → **Mid-Surface**.
2. Choose extraction method:
   - **Skin offset**: For constant thickness parts without ribs/T-connections — fastest and most efficient
   - **Auto**: Automatic mid-surface extraction — good for most parts
   - **Manual**: Select pairs of surfaces manually — most control
3. After extraction, mesh the mid-surface with shell elements.

### Mid-Surface Best Practices

- **Use skin offset for simple parts** — fastest and most efficient
- **Check thickness assignment** — each mid-surface section needs a thickness value
- **Verify at T-junctions** — mid-surface extraction can create gaps at intersections
- **Check for non-manifold geometry** — fix before meshing

## Best Practices

- **Set Min Size to 33% of Target** — prevents cleanup disruption
- **Set Max Size to 175% of Target** — allows coarsening in open areas
- **Use even number of elements for holes and flanges** — better mesh flow
- **Minimum 6 elements around holes** — fewer creates poor quality
- **Enable "Minimize transitions"** — improves mesh flow (disable only for rare fillet issues)
- **Use skin offset for simple mid-surface extraction** — fastest method
- **Run Solid Mesh Optimization after initial meshing** — improves tetra/hexa quality
- **Check mesh-geometry association** — ensures geometry updates propagate
- **Save criteria files** — reuse quality criteria across projects
- **Start coarse and refine** — mesh with a coarse target first, then refine critical areas
- **Document mesh parameters** — record target size, criteria, and parameters for each project
