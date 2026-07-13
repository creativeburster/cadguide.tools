---
title: "Plasticity CAD Essentials: NURBS, Subdivision, and Theory Builder Workflow"
excerpt: "Learn Plasticity's hybrid CAD workflow: use NURBS for precision, subdivision surfaces for organic shapes, and the Theory Builder for parametric design history, with practical modeling techniques."
category: "deployment"
softwareSlug: "plasticity"
keyword: "plasticity CAD NURBS subdivision theory builder workflow"
slug: "plasticity-cad-essentials-nurbs-subdivision-theory-builder"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://doc.plasticity.xyz/common/subdivide"
  - "https://www.reddit.com/r/Plasticity3D/comments/1rowzx2/plasticity_guide/"
---

# Plasticity CAD Essentials: NURBS, Subdivision, and Theory Builder Workflow

Plasticity is a next-generation 3D CAD tool that combines NURBS precision with subdivision surface modeling and a unique parametric history system called the Theory Builder. It's designed for product designers, concept modelers, and anyone who needs both precision and organic shape creation in one tool.

## Plasticity's Hybrid Approach

Plasticity combines three modeling paradigms:

1. **NURBS modeling** — precise curves and surfaces for mechanical parts
2. **Subdivision (SubD) modeling** — smooth organic shapes from control cages
3. **Theory Builder** — parametric history that lets you go back and modify any step

This hybrid approach means you can model a precision mechanical housing with NURBS, then add an organic ergonomic grip with SubD — all in the same tool with the same model.

## Interface Overview

### Main Areas

- **3D Viewport** — the main modeling area
- **Radial Menu** — press and hold the right mouse button for context-sensitive tools
- **Command Palette** — press Tab to search and execute any command
- **Scene Outliner** — lists all objects in the scene
- **Properties Panel** — shows properties of the selected object
- **Theory Builder Panel** — shows the modeling history (parametric timeline)

### Navigation

- **Orbit** — middle mouse button drag
- **Pan** — middle mouse button + Shift
- **Zoom** — scroll wheel
- **Frame selection** — press F
- **Frame all** — press A

## NURBS Modeling in Plasticity

### Drawing Curves

1. Use the **Curve tools** to draw 2D profiles:
   - **Line** — straight segments
   - **Arc** — curved segments
   - **Spline** — smooth control point curves
   - **Rectangle, Circle, Polygon** — parametric shapes
2. Curves can be drawn in any plane using construction planes
3. Use **snaps** — endpoint, midpoint, center, intersection, on-curve

### Surface and Solid Operations

From curves, create 3D geometry:

- **Extrude** — pull a curve into 3D
- **Revolve** — rotate a profile around an axis
- **Sweep** — sweep a profile along a path
- **Loft** — create a surface through multiple profiles

### Boolean Operations

Combine solids:
- **Union** — merge two solids
- **Subtract** — cut one solid from another
- **Intersect** — keep only the overlapping volume

### Fillets and Chamfers

- **Fillet** — round edges with a specified radius
- **Chamfer** — create angled edges
- **G2 Fillet** — smoother curvature-continuous fillet

## Subdivision Modeling

SubD modeling creates smooth organic shapes from a simple control cage.

### Creating a SubD Object

1. Start with a primitive (box, cylinder, sphere)
2. Or convert a NURBS solid to SubD
3. The object displays as a control cage with vertices, edges, and faces

### Editing the Control Cage

1. **Select vertices, edges, or faces** — double-click to enter edit mode
2. **Move** — drag to reposition
3. **Scale** — resize selected elements
4. **Rotate** — rotate selected elements
5. **Extrude** — pull faces outward to add geometry
6. **Subdivide** — add more control points for finer detail

### Subdivide Tool

The Subdivide tool increases the control cage density:

1. Select a SubD object
2. Use **Subdivide** from the radial menu or command palette
3. Each subdivision level doubles the resolution
4. The surface becomes smoother with more control points

### SubD Modeling Tips

- **Start with low resolution** — use a simple cage to define the overall form
- **Add detail gradually** — subdivide only where needed
- **Use creases** — mark edges as sharp to create creases in the smooth surface
- **Think in quads** — SubD works best with quadrilateral faces
- **Mirror symmetry** — model one half and mirror for symmetric objects

### Converting Between NURBS and SubD

- **NURBS to SubD** — convert a NURBS solid to a SubD control cage
- **SubD to NURBS** — convert a SubD surface back to NURBS for precision operations
- This bidirectional conversion is one of Plasticity's key strengths

## Theory Builder

The Theory Builder is Plasticity's parametric history system. It records every operation and lets you modify any step in the history.

### How It Works

1. Every operation (extrude, fillet, boolean, etc.) is recorded as a **node** in the Theory Builder
2. The nodes form a **dependency graph** — each node depends on its inputs
3. When you modify an earlier node, all dependent nodes update automatically
4. You can go back to any step, change a parameter, and see the result propagate

### Using the Theory Builder

1. Open the **Theory Builder panel**
2. The timeline shows all operations in order
3. Click any node to see its parameters
4. Modify a parameter — the model updates in real-time
5. You can also:
   - **Rearrange nodes** — change the order of operations
   - **Delete nodes** — remove an operation from the history
   - **Insert nodes** — add a new operation between existing ones
   - **Branch** — create alternative versions from any point in the history

### Theory Builder vs Traditional History

Traditional CAD history (like Fusion 360 or SolidWorks) is linear — operations execute in order, and modifying an early operation can break later ones.

Plasticity's Theory Builder is more flexible:
- **Non-linear** — you can modify any node without breaking the chain
- **Visual** — the dependency graph shows how operations relate
- **Branchable** — create alternative designs from any point
- **Forgiving** — failed operations don't break the entire history

## Practical Workflow Example: Product Housing

### Step 1: Draw the Profile

1. Draw a 2D profile of the housing outline
2. Use the Spline tool for curved sections
3. Use Line tools for straight sections
4. Close the curve to form a closed profile

### Step 2: Extrude to Solid

1. Select the profile curve
2. Extrude to the required depth
3. The Theory Builder records this as an Extrude node

### Step 3: Add Features with Booleans

1. Draw curves for cutouts (ports, buttons, display)
2. Extrude the cutout curves as solids
3. Use Boolean Subtract to cut the cutouts from the housing
4. Each Boolean is recorded in the Theory Builder

### Step 4: Apply Fillets

1. Select edges to fillet
2. Apply fillets to round sharp edges
3. Use different radii for different edges

### Step 5: Add Organic Grip with SubD

1. Create a SubD primitive (box) on the grip area
2. Shape the control cage to form an ergonomic grip
3. Subdivide for smoother surface
4. Convert back to NURBS if needed

### Step 6: Modify Earlier Steps

1. Open the Theory Builder
2. Go back to the original profile curve
3. Modify the curve shape
4. All subsequent operations (extrude, boolean, fillet) update automatically
5. The SubD grip may need manual adjustment if the housing changed significantly

## Common Issues

### SubD Surface Not Smooth

- Increase the subdivision level
- Check for non-quad faces (triangles or n-gons can cause artifacts)
- Use creases to control where the surface is sharp

### Theory Builder Not Updating

- A later operation may have broken the dependency chain
- Check for error indicators on nodes
- Try rearranging the node order

### Boolean Fails

- Ensure both objects are solids
- Check for coplanar faces
- Try offsetting one object slightly

## Best Practices

- **Use NURBS for precision** — mechanical features, dimensions, tolerances
- **Use SubD for organic shapes** — ergonomic surfaces, sculptural forms
- **Name operations in the Theory Builder** — makes navigation easier
- **Save frequently** — Plasticity is in active development; save often
- **Use the Radial Menu** — speeds up workflow significantly
- **Learn keyboard shortcuts** — Plasticity is designed for fast interaction
- **Start simple, add detail** — don't over-complicate the initial model
- **Use the community resources** — Reddit, YouTube, and the documentation are growing
