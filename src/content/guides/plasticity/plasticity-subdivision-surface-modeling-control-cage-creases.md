---
title: "Plasticity Subdivision Surface Modeling: Control Cages, Creases, and Organic Forms"
excerpt: "Master subdivision modeling in Plasticity: create control cages, extrude and subdivide faces, use creases for sharp edges, maintain quad topology, and convert SubD to NURBS for manufacturing."
category: "workflow"
softwareSlug: "plasticity"
keyword: "plasticity subdivision surface modeling control cage crease organic"
slug: "plasticity-subdivision-surface-modeling-control-cage-creases"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://doc.plasticity.xyz/common/subdivide"
  - "https://www.reddit.com/r/Plasticity3D/comments/1rowzx2/plasticity_guide/"
---

# Plasticity Subdivision Surface Modeling: Control Cages, Creases, and Organic Forms

Subdivision surface modeling is where Plasticity truly shines. Unlike traditional CAD where every surface must be explicitly defined, SubD modeling lets you shape organic forms by manipulating a simple control cage. The subdivision algorithm smooths the cage into a continuous surface. This is the same technology used in animation and product design for creating smooth, flowing forms.

## Understanding Subdivision Surfaces

### How SubD Works

1. You create a **control cage** — a low-polygon mesh of vertices, edges, and faces
2. The **subdivision algorithm** smooths the cage by averaging vertex positions
3. Each level of subdivision doubles the resolution and smooths the surface
4. The final surface is a smooth, continuous shape that approximates the cage

The key insight: **the control cage defines the shape, the subdivision creates the smoothness.** You never directly edit the smooth surface — you edit the cage, and the surface follows.

### SubD vs NURBS

| Aspect | SubD | NURBS |
|---|---|---|
| Control | Control cage vertices | Control points and curves |
| Smoothness | Automatic via algorithm | Defined by surface degree |
| Best for | Organic, flowing shapes | Precise, mechanical shapes |
| Topology | Quad-based mesh | Trimmed surfaces |
| Sharp edges | Crease marking | Explicit edge definition |
| Manufacturing | Convert to NURBS first | Direct export |

## Creating a SubD Object

### From a Primitive

1. Use **Create > Primitive** — box, cylinder, sphere, torus
2. The primitive appears as a SubD control cage
3. Double-click to enter edit mode
4. The cage vertices, edges, and faces are now editable

### From a NURBS Solid

1. Select a NURBS solid
2. Use **Convert to SubD** from the command palette
3. Plasticity generates a control cage that approximates the NURBS shape
4. The cage can then be modified for organic variations

### From Scratch

1. Draw curves that define the overall shape
2. Use **Network** or **Loft** to create an initial surface
3. Convert to SubD
4. Refine the control cage

## Editing the Control Cage

### Selection Modes

- **Vertex mode** — select individual vertices (1 key)
- **Edge mode** — select edges (2 key)
- **Face mode** — select faces (3 key)
- **Object mode** — select the entire object (4 key)

### Basic Operations

**Move:**
1. Select vertices, edges, or faces
2. Drag to move
3. Use axis handles for constrained movement
4. Use the radial menu for precise transforms

**Extrude:**
1. Select a face
2. Use **Extrude** from the radial menu
3. Drag to pull the face outward
4. New geometry is created connecting the original face to the extruded face
5. Extrude is the primary way to add geometry to a SubD cage

**Scale:**
1. Select elements
2. Use the scale handles
3. Scale uniformly or along specific axes

**Rotate:**
1. Select elements
2. Use the rotation gizmo
3. Rotate around the selection center or a custom pivot

### Advanced Editing

**Inset:**
1. Select a face
2. Use **Inset** from the radial menu
3. Creates a smaller face inside the selected face
4. Useful for adding detail without changing the overall shape

**Bridge:**
1. Select two border edges
2. Use **Bridge** to connect them with new faces
3. Useful for connecting separate parts of a cage

**Merge/Weld:**
1. Select overlapping vertices
2. Use **Merge** to combine them into one vertex
3. Essential for cleaning up cage topology

## Subdivision Levels

### Increasing Resolution

1. Select a SubD object
2. Use **Subdivide** from the command palette or radial menu
3. Each level doubles the resolution:
   - Level 0: original cage
   - Level 1: 4× the faces
   - Level 2: 16× the faces
   - Level 3: 64× the faces
4. The surface becomes progressively smoother

### When to Subdivide

- **Don't subdivide too early** — work with the lowest resolution cage that defines the form
- **Subdivide when you need local detail** — add resolution only where needed
- **Avoid over-subdivision** — high-resolution cages are harder to edit and slower to process

### Partial Subdivision

Plasticity supports partial subdivision:
1. Select specific faces
2. Subdivide only those faces
3. This adds detail where needed without increasing the entire cage resolution

## Creases

Creases are the key to creating sharp edges in SubD surfaces.

### Applying Creases

1. Select an edge (or multiple edges)
2. Use **Crease** from the radial menu
3. The edge becomes sharp in the subdivided surface
4. Crease weight can be adjusted (0 = smooth, 1 = fully sharp)

### When to Use Creases

- **Panel lines** — create sharp transitions between panels
- **Hard edges** — define edges that should remain crisp
- **Feature lines** — create character lines on product surfaces
- **Boundary edges** — define the boundary between smooth and sharp areas

### Removing Creases

1. Select a creased edge
2. Use **Uncrease** from the radial menu
3. The edge returns to smooth

## Maintaining Quad Topology

SubD surfaces work best with **quadrilateral faces** (four-sided polygons).

### Why Quads Matter

- **Even subdivision** — quads subdivide cleanly into smaller quads
- **Smooth surfaces** — quads produce smoother subdivision results
- **Predictable behavior** — quad cages are easier to predict and control
- **Edge loops** — quads allow continuous edge loops for better control

### Avoiding Non-Quads

- **Triangles** — can cause pinching in the smooth surface
- **N-gons** (5+ sided faces) — can cause unpredictable subdivision
- **Poles** — vertices where more than 4 edges meet; use sparingly

### Fixing Topology

1. Use **Merge** to combine vertices and eliminate triangles
2. Use **Bridge** to connect edges and create quads
3. Use **Cut** to add edges and split n-gons into quads
4. Use **Dissolve** to remove unnecessary edges

## Converting SubD to NURBS

For manufacturing, SubD surfaces often need to be converted to NURBS:

1. Select the SubD object
2. Use **Convert to NURBS** from the command palette
3. Plasticity generates NURBS surfaces that approximate the SubD shape
4. The NURBS solid can then be:
   - Exported as STEP or IGES for CAM
   - Combined with other NURBS solids via Boolean operations
   - Measured and dimensioned precisely

### Conversion Quality

- The NURBS conversion approximates the SubD surface
- Higher SubD levels produce more accurate NURBS surfaces
- The NURBS surface may have more patches than the SubD cage
- Check the converted surface for continuity and accuracy

## Common SubD Issues

### Pinching at Poles

A vertex where many edges meet creates a pinch point in the smooth surface.

**Fix:** Reduce the number of edges meeting at a vertex, or move the pole to a less visible area.

### Lumpy Surface

The smooth surface has unwanted bumps or irregularities.

**Fix:**
- Check for non-quad faces
- Ensure vertices are evenly spaced
- Reduce the control cage complexity
- Use the smooth brush (if available) to even out vertices

### Crease Not Sharp Enough

The creased edge still appears rounded after subdivision.

**Fix:** Increase the crease weight, or subdivide the cage to increase resolution around the crease.

### Surface Not Closing Properly

The SubD surface has a hole or gap.

**Fix:** Check for missing faces in the control cage. The cage must be a closed mesh for a closed surface.

## Best Practices

- **Start with a simple cage** — define the overall form before adding detail
- **Work with quads** — maintain quad topology for clean subdivision
- **Use creases for sharp edges** — don't try to model sharp edges with vertex placement alone
- **Subdivide only when needed** — don't over-subdivide early in the process
- **Mirror for symmetry** — model one half and mirror for symmetric objects
- **Check the smooth surface frequently** — toggle between cage and smooth view
- **Convert to NURBS for manufacturing** — SubD surfaces are for design, NURBS for production
- **Save versions** — save before major cage modifications in case you need to revert
- **Learn from polygon modeling** — SubD techniques from Blender/Maya transfer to Plasticity
