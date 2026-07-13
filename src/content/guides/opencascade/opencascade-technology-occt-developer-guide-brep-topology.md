---
title: "OpenCASCADE Technology (OCCT) Developer Guide: BRep Data Model and Topology"
excerpt: "Learn OpenCASCADE Technology's C++ architecture: understand the BRep data model, TopoDS topology classes, gp geometry primitives, and build shapes from points to edges to wires to faces to solids."
category: "deployment"
softwareSlug: "opencascade"
keyword: "opencascade technology OCCT BRep topology TopoDS C++ developer"
slug: "opencascade-technology-occt-developer-guide-brep-topology"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-13"
sources:
  - "https://dev.opencascade.org/doc/overview/html/occt__tutorial.html"
  - "https://dev.opencascade.org/doc/occt-7.9.0/overview/html/samples__novice_guide.html"
---

# OpenCASCADE Technology (OCCT) Developer Guide: BRep Data Model and Topology

OpenCASCADE Technology (OCCT) is an open-source C++ framework for 3D CAD/CAM/CAE development. Unlike end-user CAD software, OCCT provides building blocks — classes, methods, and algorithms — that developers use to create custom CAD applications. Understanding its architecture is essential for anyone building 3D modeling software on top of OCCT.

## What OCCT Is

OCCT is:
- **A C++ library** — not a standalone application
- **Object-oriented** — classes organized in packages
- **Open-source** — LGPL license, free for commercial use
- **Cross-platform** — Windows, Linux, macOS
- **Comprehensive** — geometry, topology, boolean operations, filleting, visualization, data exchange

OCCT is used by FreeCAD, SALOME, and many commercial CAD applications as their core modeling engine.

## Architecture Overview

OCCT is organized into modules, each containing packages of related classes:

### Core Modules

1. **Foundation Classes** — basic data types, math, collections
2. **Modeling Data** — geometric and topological data structures
3. **Modeling Algorithms** — operations on shapes (boolean, fillet, offset)
4. **Data Exchange** — STEP, IGES, STL import/export
5. **Visualization** — 3D rendering and display
6. **Application Framework** — document management and persistence

### Key Packages

| Package | Purpose |
|---|---|
| `gp` | Geometric primitives (points, vectors, axes, planes) |
| `Geom` | 3D geometric objects (curves, surfaces) |
| `Geom2d` | 2D geometric objects |
| `TopoDS` | Topological data structures (shapes) |
| `BRepBuilderAPI` | Build topological shapes from geometry |
| `BRepPrimAPI` | Create primitive solids (box, cylinder, sphere) |
| `BRepAlgoAPI` | Boolean operations (fuse, cut, common) |
| `BRepFilletAPI` | Fillet and chamfer operations |
| `BRepOffsetAPI` | Offset and thickening operations |
| `STEPControl` | STEP file import/export |

## The BRep Data Model

OCCT uses the Boundary Representation (BRep) data model. In BRep, a solid is defined by its boundary — the faces, edges, and vertices that enclose it.

### Topological Hierarchy

```
Solid (TopoDS_Solid)
  └── Shell (TopoDS_Shell) — collection of faces
       └── Face (TopoDS_Face) — a surface
            └── Wire (TopoDS_Wire) — loop of edges
                 └── Edge (TopoDS_Edge) — a curve segment
                      └── Vertex (TopoDS_Vertex) — a point
```

Each topological entity has:
- **Geometry** — the underlying geometric shape (surface, curve, point)
- **Topology** — the relationships between entities
- **Orientation** — forward or reversed
- **Location** — transformation relative to the reference

### TopoDS_Shape

All topological entities inherit from `TopoDS_Shape`:
- `TopoDS_Vertex` — a point in 3D space
- `TopoDS_Edge` — a curve segment bounded by vertices
- `TopoDS_Wire` — a sequence of connected edges
- `TopoDS_Face` — a surface bounded by wires
- `TopoDS_Shell` — a collection of connected faces
- `TopoDS_Solid` — a volume bounded by shells
- `TopoDS_CompSolid` — a collection of solids
- `TopoDS_Compound` — a collection of any shapes

## Geometry Primitives (gp Package)

The `gp` package provides basic geometric objects:

### Points and Vectors

```cpp
gp_Pnt p1(0, 0, 0);      // 3D point
gp_Pnt p2(1, 0, 0);
gp_Vec v(p1, p2);        // Vector from p1 to p2
gp_Dir d(1, 0, 0);       // Unit direction
```

### Axes and Coordinate Systems

```cpp
gp_Ax1 axis(gp_Pnt(0,0,0), gp_Dir(0,0,1));  // Axis (point + direction)
gp_Ax2 cs(gp_Pnt(0,0,0), gp_Dir(0,0,1));    // Coordinate system
gp_Pln plane(gp_Pnt(0,0,0), gp_Dir(0,0,1)); // Plane
```

### Transformations

```cpp
gp_Trsf trsf;
trsf.SetTranslation(gp_Vec(10, 0, 0));  // Translate by (10,0,0)
trsf.SetRotation(axis, M_PI/4);         // Rotate 45 degrees around axis
trsf.SetScale(gp_Pnt(0,0,0), 2.0);      // Scale by 2x from origin
```

## Building Shapes: From Points to Solids

### Step 1: Create Points

```cpp
gp_Pnt p1(0, 0, 0);
gp_Pnt p2(1, 0, 0);
gp_Pnt p3(1, 1, 0);
gp_Pnt p4(0, 1, 0);
```

### Step 2: Create Edges

```cpp
TopoDS_Edge edge1 = BRepBuilderAPI_MakeEdge(p1, p2);
TopoDS_Edge edge2 = BRepBuilderAPI_MakeEdge(p2, p3);
TopoDS_Edge edge3 = BRepBuilderAPI_MakeEdge(p3, p4);
TopoDS_Edge edge4 = BRepBuilderAPI_MakeEdge(p4, p1);
```

### Step 3: Create a Wire

```cpp
TopoDS_Wire wire = BRepBuilderAPI_MakeWire(edge1, edge2, edge3, edge4);
```

### Step 4: Create a Face

```cpp
TopoDS_Face face = BRepBuilderAPI_MakeFace(wire);
```

### Step 5: Create a Solid (Extrude)

```cpp
gp_Vec direction(0, 0, 1);
TopoDS_Solid solid = BRepPrimAPI_MakePrism(face, direction);
```

### Complete Example: Creating a Box

```cpp
#include <gp_Pnt.hxx>
#include <TopoDS_Edge.hxx>
#include <TopoDS_Wire.hxx>
#include <TopoDS_Face.hxx>
#include <BRepBuilderAPI_MakeEdge.hxx>
#include <BRepBuilderAPI_MakeWire.hxx>
#include <BRepBuilderAPI_MakeFace.hxx>
#include <BRepPrimAPI_MakePrism.hxx>
#include <STEPControl_Writer.hxx>

int main() {
    // Define points for the base square
    gp_Pnt p1(0, 0, 0);
    gp_Pnt p2(1, 0, 0);
    gp_Pnt p3(1, 1, 0);
    gp_Pnt p4(0, 1, 0);

    // Create edges
    TopoDS_Edge e1 = BRepBuilderAPI_MakeEdge(p1, p2);
    TopoDS_Edge e2 = BRepBuilderAPI_MakeEdge(p2, p3);
    TopoDS_Edge e3 = BRepBuilderAPI_MakeEdge(p3, p4);
    TopoDS_Edge e4 = BRepBuilderAPI_MakeEdge(p4, p1);

    // Create wire
    TopoDS_Wire wire = BRepBuilderAPI_MakeWire(e1, e2, e3, e4);

    // Create face
    TopoDS_Face face = BRepBuilderAPI_MakeFace(wire);

    // Extrude to create solid
    gp_Vec dir(0, 0, 1);
    TopoDS_Shape prism = BRepPrimAPI_MakePrism(face, dir);

    // Export as STEP
    STEPControl_Writer writer;
    writer.Transfer(prism, STEPControl_AsIs);
    writer.Write("box.step");

    return 0;
}
```

## Primitive Solids (BRepPrimAPI)

OCCT provides direct creation of primitive solids:

```cpp
// Box
TopoDS_Solid box = BRepPrimAPI_MakeBox(10, 20, 30);

// Cylinder
TopoDS_Solid cylinder = BRepPrimAPI_MakeCylinder(5.0, 20.0);

// Sphere
TopoDS_Solid sphere = BRepPrimAPI_MakeSphere(10.0);

// Cone
TopoDS_Solid cone = BRepPrimAPI_MakeCone(10.0, 5.0, 20.0);

// Torus
TopoDS_Solid torus = BRepPrimAPI_MakeTorus(10.0, 2.0);
```

## Boolean Operations (BRepAlgoAPI)

```cpp
// Fuse (Union)
TopoDS_Shape fused = BRepAlgoAPI_Fuse(shape1, shape2);

// Cut (Subtract)
TopoDS_Shape cut = BRepAlgoAPI_Cut(shape1, shape2);

// Common (Intersect)
TopoDS_Shape common = BRepAlgoAPI_Common(shape1, shape2);
```

## Fillets (BRepFilletAPI)

```cpp
// Fillet edges
BRepFilletAPI_MakeFillet fillet(shape);
// Add edges to fillet
TopExp_Explorer explorer(shape, TopAbs_EDGE);
while (explorer.More()) {
    fillet.Add(2.0, TopoDS::Edge(explorer.Current()));
    explorer.Next();
}
TopoDS_Shape filleted = fillet.Shape();
```

## Data Exchange

### STEP Export

```cpp
STEPControl_Writer writer;
writer.Transfer(shape, STEPControl_AsIs);
writer.Write("model.step");
```

### STEP Import

```cpp
STEPControl_Reader reader;
reader.ReadFile("model.step");
reader.TransferRoots();
TopoDS_Shape shape = reader.OneShape();
```

### STL Export

```cpp
StlAPI_Writer writer;
writer.Write(shape, "model.stl");
```

## Handle System

OCCT uses a smart pointer system called `opencascade::handle` (or `Handle_`):

```cpp
// Modern syntax (OCCT 7.x)
opencascade::handle<Geom_Plane> plane = new Geom_Plane(gp_Pnt(0,0,0), gp_Dir(0,0,1));

// Legacy syntax
Handle(Geom_Plane) plane = new Geom_Plane(gp_Pnt(0,0,0), gp_Dir(0,0,1));
```

Handles manage reference counting automatically — no manual memory management needed.

## Common Issues

### Linker Errors

OCCT is split into many toolkits (libraries). Ensure you link all required toolkits:

```cmake
target_link_libraries(myapp
    TKernel TKMath TKG2d TKG3d TKGeomBase TKGeomAlgo
    TKBRep TKTopAlgo TKPrim TKBO TKShHealing TKFillet
    TKBool TKOffset TKSTEPBase TKXSBase TKSTEPAttr TKSTEP
)
```

### Shape Not Valid

After operations, check shape validity:
```cpp
BRepCheck_Analyzer checker(shape);
if (!checker.IsValid()) {
    // Shape has errors
}
```

### Null Shape After Boolean

Boolean operations can fail if shapes don't intersect properly. Check:
- Shapes are valid solids
- Shapes actually overlap
- No coplanar faces at the intersection

## Best Practices

- **Start with the Bottle Tutorial** — the official OCCT tutorial walks through creating a bottle step by step
- **Use the Overview sample** — `samples/qt/OCCTOverview` demonstrates all major features
- **Read the documentation** — the Overview and Reference manuals are comprehensive
- **Use handles properly** — let the smart pointer system manage memory
- **Check shape validity** — after operations, verify the result is valid
- **Use the forum** — the OCCT forum is active and helpful
- **Link all required toolkits** — missing toolkits cause linker errors
- **Understand BRep** — the boundary representation model is the foundation of everything
- **Use BRepBuilderAPI for construction** — don't try to build topology manually
- **Use BRepAlgoAPI for operations** — don't implement your own boolean operations
