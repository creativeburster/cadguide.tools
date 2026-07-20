---
title: "OpenCASCADE Boolean Operations and Data Exchange: STEP, IGES, and STL Workflows"
excerpt: "Use OpenCASCADE for Boolean operations (fuse, cut, common), shape healing, and data exchange via STEP, IGES, and STL, with C++ code examples for CAD file import, modification, and export."
category: "workflow"
softwareSlug: "opencascade"
keyword: "opencascade boolean operations STEP IGES STL data exchange C++"
slug: "opencascade-boolean-operations-data-exchange-step-iges-stl"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://dev.opencascade.org/doc/overview/html/occt__tutorial.html"
  - "https://dev.opencascade.org/doc/occt-6.7.0/overview/html/user_guides__modeling_algos.html"
---

# OpenCASCADE Boolean Operations and Data Exchange: STEP, IGES, and STL Workflows

Boolean operations and data exchange are two of the most common tasks in OCCT-based applications. Whether you're building a CAD importer, a geometry processor, or a custom modeling tool, you'll need to combine shapes and read/write industry-standard file formats. I'll cover both with practical C++ code examples.

## Boolean Operations

OCCT provides three Boolean operations through the `BRepAlgoAPI` package:

### 1. Fuse (Union)

Combines two shapes into one, removing the internal overlap:

```cpp
#include <BRepAlgoAPI_Fuse.hxx>

// Create two boxes
TopoDS_Shape box1 = BRepPrimAPI_MakeBox(10, 10, 10);
TopoDS_Shape box2 = BRepPrimAPI_MakeBox(gp_Pnt(5, 5, 0), 10, 10, 10);

// Fuse them
TopoDS_Shape fused = BRepAlgoAPI_Fuse(box1, box2);
```

### 2. Cut (Subtract)

Removes the second shape from the first:

```cpp
#include <BRepAlgoAPI_Cut.hxx>

// Create a base block
TopoDS_Shape block = BRepPrimAPI_MakeBox(20, 20, 10);

// Create a cylinder to subtract
TopoDS_Shape cylinder = BRepPrimAPI_MakeCylinder(
    gp_Ax2(gp_Pnt(10, 10, 0), gp_Dir(0, 0, 1)),
    3.0, 10.0
);

// Cut the cylinder from the block
TopoDS_Shape cut = BRepAlgoAPI_Cut(block, cylinder);
```

### 3. Common (Intersection)

Keeps only the overlapping volume:

```cpp
#include <BRepAlgoAPI_Common.hxx>

TopoDS_Shape shape1 = BRepPrimAPI_MakeBox(10, 10, 10);
TopoDS_Shape shape2 = BRepPrimAPI_MakeBox(gp_Pnt(5, 5, 5), 10, 10, 10);

// Keep only the intersection
TopoDS_Shape common = BRepAlgoAPI_Common(shape1, shape2);
```

### Section (Cross-Section)

Creates the intersection curve between two shapes:

```cpp
#include <BRepAlgoAPI_Section.hxx>

TopoDS_Shape shape = BRepPrimAPI_MakeBox(10, 10, 10);
gp_Pln plane(gp_Pnt(5, 5, 5), gp_Dir(0, 0, 1));

// Create the section
BRepAlgoAPI_Section section(shape, plane);
section.ComputePCurvesOn1(true);
section.Approximation(1);
section.Build();
TopoDS_Shape sectionShape = section.Shape();
```

### Boolean Operation Parameters

Modern OCCT (7.x) provides the `BRepAlgoAPI_BuilderAlgo` API with more control:

```cpp
// Set parallel execution
BRepAlgoAPI_Fuse fuse(box1, box2);
fuse.SetRunParallel(true);  // Use multi-threading
fuse.SetFuzzyValue(0.1);    // Tolerance for coincidence detection
fuse.Build();
TopoDS_Shape result = fuse.Shape();
```

### Common Boolean Issues

**Operation produces empty result:**
- Shapes don't actually intersect — verify with visualization
- One shape is not a valid solid — check with `BRepCheck_Analyzer`

**Operation is very slow:**
- Shapes have many faces — simplify before Boolean
- Use `SetRunParallel(true)` for multi-threaded execution
- Increase `SetFuzzyValue` to merge near-coincident faces

**Result has gaps or non-manifold edges:**
- Input shapes have tolerance issues
- Use shape healing before Boolean operations
- Increase the fuzzy value

## Shape Healing

Before and after Boolean operations, shapes may need healing:

### Shape Healing Pipeline

```cpp
#include <ShapeFix_Shape.hxx>
#include <ShapeUpgrade_UnifySameDomain.hxx>

// Fix shape
ShapeFix_Shape fix(shape);
fix.Perform();
TopoDS_Shape fixedShape = fix.Shape();

// Unify same-domain faces (merge coplanar faces)
ShapeUpgrade_UnifySameDomain unify(fixedShape);
 unify.UnifyFaces();
 unify.UnifyEdges();
 unify.Build();
TopoDS_Shape unified = unify.Shape();
```

### Common Healing Operations

- **ShapeFix_Shape** — fixes common shape errors
- **ShapeUpgrade_UnifySameDomain** — merges coplanar faces and collinear edges
- **ShapeFix_Wire** — fixes wire ordering and connectivity
- **ShapeFix_Face** — fixes face orientation and wire structure
- **BRepTools_Clean** — removes triangulation data (forces re-computation)

## Data Exchange: STEP

STEP is the primary CAD interchange format. OCCT's STEP support is comprehensive.

### STEP Import

```cpp
#include <STEPControl_Reader.hxx>
#include <IFSelect_ReturnStatus.hxx>

STEPControl_Reader reader;
IFSelect_ReturnStatus status = reader.ReadFile("model.step");

if (status != IFSelect_RetDone) {
    // Error reading file
    return;
}

// Transfer all roots to OCCT shapes
reader.TransferRoots();

// Get the resulting shape
TopoDS_Shape shape = reader.OneShape();

// Or get individual shapes
Standard_Integer nb = reader.NbShapes();
for (Standard_Integer i = 1; i <= nb; i++) {
    TopoDS_Shape s = reader.Shape(i);
    // Process each shape
}
```

### STEP Export

```cpp
#include <STEPControl_Writer.hxx>
#include <STEPControl_StepModelType.hxx>

STEPControl_Writer writer;

// Transfer shape to STEP model
// STEPControl_AsIs — write as-is (most common)
// STEPControl_ManifoldSolidBrep — write as manifold solid
// STEPControl_ShellBasedSurfaceModel — write as shell-based surface
IFSelect_ReturnStatus status = writer.Transfer(shape, STEPControl_AsIs);

if (status != IFSelect_RetDone) {
    // Error transferring shape
    return;
}

// Write the STEP file
writer.Write("output.step");
```

### STEP with Assembly Structure

For assemblies with multiple parts:

```cpp
STEPControl_Writer writer;

// Transfer each part
writer.Transfer(part1, STEPControl_AsIs);
writer.Transfer(part2, STEPControl_AsIs);
writer.Transfer(part3, STEPControl_AsIs);

// Write all parts to one file
writer.Write("assembly.step");
```

## Data Exchange: IGES

IGES is an older format but still widely used.

### IGES Import

```cpp
#include <IGESControl_Reader.hxx>

IGESControl_Reader reader;
IFSelect_ReturnStatus status = reader.ReadFile("model.igs");

if (status == IFSelect_RetDone) {
    reader.TransferRoots();
    TopoDS_Shape shape = reader.OneShape();
}
```

### IGES Export

```cpp
#include <IGESControl_Writer.hxx>

IGESControl_Writer writer;
writer.AddShape(shape);
writer.Write("output.igs");
```

## Data Exchange: STL

STL is used for 3D printing and mesh-based workflows.

### STL Export

```cpp
#include <StlAPI_Writer.hxx>

// Triangulate the shape first
BRepMesh_IncrementalMesh mesher(shape, 0.1);  // Deflection = 0.1mm
mesher.Perform();

// Write STL
StlAPI_Writer writer;
writer.SetASCIIMode(false);  // Binary STL (smaller file)
writer.Write(shape, "output.stl");
```

### STL Import

```cpp
#include <StlAPI_Reader.hxx>

StlAPI_Reader reader;
TopoDS_Shape shape;
reader.Read(shape, "input.stl");
```

Note: STL import produces a mesh, not a NURBS solid. To convert mesh to NURBS, you need additional tools (not built into core OCCT).

## Complete Workflow: Import, Modify, Export

```cpp
#include <STEPControl_Reader.hxx>
#include <STEPControl_Writer.hxx>
#include <BRepAlgoAPI_Cut.hxx>
#include <BRepPrimAPI_MakeCylinder.hxx>
#include <BRepFilletAPI_MakeFillet.hxx>
#include <TopExp_Explorer.hxx>
#include <TopoDS.hxx>

int main() {
    // 1. Import STEP file
    STEPControl_Reader reader;
    reader.ReadFile("input.step");
    reader.TransferRoots();
    TopoDS_Shape importedShape = reader.OneShape();

    // 2. Create a cylinder to subtract (e.g., a hole)
    gp_Ax2 cylAxis(gp_Pnt(10, 10, 0), gp_Dir(0, 0, 1));
    TopoDS_Shape cylinder = BRepPrimAPI_MakeCylinder(cylAxis, 2.0, 20.0);

    // 3. Boolean cut
    TopoDS_Shape cutShape = BRepAlgoAPI_Cut(importedShape, cylinder);

    // 4. Fillet all edges
    BRepFilletAPI_MakeFillet fillet(cutShape);
    TopExp_Explorer exp(cutShape, TopAbs_EDGE);
    while (exp.More()) {
        fillet.Add(0.5, TopoDS::Edge(exp.Current()));
        exp.Next();
    }
    fillet.Build();
    TopoDS_Shape filletedShape = fillet.Shape();

    // 5. Export as STEP
    STEPControl_Writer writer;
    writer.Transfer(filletedShape, STEPControl_AsIs);
    writer.Write("output.step");

    // 6. Export as STL
    BRepMesh_IncrementalMesh mesher(filletedShape, 0.1);
    StlAPI_Writer stlWriter;
    stlWriter.SetASCIIMode(false);
    stlWriter.Write(filletedShape, "output.stl");

    return 0;
}
```

## Common Data Exchange Issues

### STEP Import Fails

- File is corrupted — verify with another CAD tool
- File uses unsupported STEP AP (Application Protocol) — OCCT supports AP203, AP214, AP242
- File is very large — increase memory limits

### STEP Export Missing Geometry

- Shape is not a valid solid — check with `BRepCheck_Analyzer`
- Shape has open wires or faces — use shape healing before export
- Shape is a compound of disconnected parts — export each part separately

### STL Export Has Poor Quality

- Deflection parameter is too large — reduce the value in `BRepMesh_IncrementalMesh`
- Shape has very curved surfaces — use smaller deflection for smoother mesh

### IGES Import Produces Wrong Geometry

- IGES is an older format with known limitations
- Some IGES entities may not map perfectly to OCCT
- Use STEP instead of IGES when possible

## Best Practices

- **Use STEP over IGES** — STEP is more reliable and modern
- **Validate shapes after import** — use `BRepCheck_Analyzer`
- **Heal shapes before Boolean operations** — prevents errors
- **Use parallel Boolean operations** — `SetRunParallel(true)` for performance
- **Set appropriate fuzzy value** — helps with near-coincident faces
- **Triangulate before STL export** — `BRepMesh_IncrementalMesh` with appropriate deflection
- **Use binary STL for large files** — smaller than ASCII STL
- **Clean triangulation after modifications** — `BRepTools_Clean(shape)` forces re-meshing
- **Handle errors gracefully** — check return status of all operations
- **Use the OCCT documentation** — the User Guides cover data exchange in detail
