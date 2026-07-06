---
title: "OpenSCAD Scripting Basics: Programmatic 3D Modeling with Code"
excerpt: "Introduction to OpenSCAD's code-based 3D modeling approach — covering primitive shapes, transformations, boolean operations, and the CSG syntax for creating parametric parts."
category: "workflow"
softwareSlug: "openscad"
keyword: "openscad scripting basics programmatic 3d modeling"
slug: "openscad-scripting-basics-programmatic-3d-modeling"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://openscad.org/documentation.html"
  - "https://en.wikibooks.org/wiki/OpenSCAD_User_Manual"
---

# OpenSCAD Scripting Basics: Programmatic 3D Modeling with Code

OpenSCAD isn't like other CAD tools. There's no mouse-based modeling, no sketching, no Pencil gestures. You write code — and the 3D model appears. I was skeptical until I needed to generate 50 variations of a parametric bracket. OpenSCAD did it in 20 lines of code. Here's the basics for getting started.

## What Is OpenSCAD?

OpenSCAD is a script-based 3D modeler. You write a `.scad` file containing geometric operations, and OpenSCAD renders the 3D model in real-time. It's:

- **Free and open source** — No license, no subscription, no watermarks
- **Cross-platform** — Windows, Mac, Linux
- **Code-based** — No GUI modeling tools
- **CSG (Constructive Solid Geometry)** — Models are built from primitive shapes and boolean operations
- **Parametric** — Variables and functions drive geometry

## Installing OpenSCAD

1. Download from `https://openscad.org/downloads.html`.
2. Install — no dependencies required.
3. Launch — the interface has three panels:
   - **Left**: Code editor
   - **Right**: 3D preview
   - **Bottom**: Console (error messages)

## Primitive Shapes

### Cube

```openscad
cube([10, 20, 5]);        // Box 10×20×5mm, corner at origin
cube([10, 20, 5], center=true);  // Same box, centered at origin
```

### Cylinder

```openscad
cylinder(h=10, r=5);      // Cylinder, height 10, radius 5
cylinder(h=10, r1=5, r2=2);  // Cone (r1=bottom, r2=top)
cylinder(h=10, d=10);     // Using diameter instead of radius
```

### Sphere

```openscad
sphere(r=10);             // Sphere, radius 10
sphere(d=20);             // Sphere, diameter 20
```

### Polyhedron (Custom)

```openscad
polyhedron(
  points = [[0,0,0], [10,0,0], [10,10,0], [0,10,0], [5,5,10]],
  faces = [[0,1,2,3], [0,1,4], [1,2,4], [2,3,4], [3,0,4]]
);
```

## Transformations

### Translate (Move)

```openscad
translate([5, 0, 0])
  cube([10, 10, 10]);
```

The cube is shifted 5mm in X. Transformations apply to everything inside their braces.

### Rotate

```openscad
rotate([90, 0, 0])       // Rotate 90° around X axis
  cylinder(h=20, r=5);
```

Rotation order is X, Y, Z (Euler angles).

### Scale

```openscad
scale([1, 1, 2])         // Stretch 2× in Z
  cube([10, 10, 10]);
```

### Mirror

```openscad
mirror([1, 0, 0])        // Mirror across YZ plane
  cube([10, 10, 10]);
```

### Resize

```openscad
resize([20, 20, 20])     // Force to exact dimensions
  sphere(r=10);           // Original sphere becomes 20×20×20
```

## Boolean Operations

### Union (Combine)

```openscad
union() {
  cube([20, 20, 10]);
  translate([10, 10, 0])
    cylinder(h=10, r=5);
}
```

### Difference (Subtract)

```openscad
difference() {
  cube([20, 20, 10]);           // Body
  translate([10, 10, 0])
    cylinder(h=10, r=3);        // Hole
}
```

This creates a 20×20×10 plate with a 6mm diameter hole through it.

### Intersection (Overlap Only)

```openscad
intersection() {
  cube([20, 20, 20]);
  sphere(r=15);
}
```

Only the volume where both shapes overlap is kept.

## Variables and Parameters

```openscad
// Parameters
width = 50;
depth = 30;
height = 10;
hole_diameter = 8;

// Model
difference() {
  cube([width, depth, height]);
  translate([width/2, depth/2, 0])
    cylinder(h=height, d=hole_diameter);
}
```

Change the variables at the top, and the entire model updates. This is the power of parametric modeling in OpenSCAD.

## Modules (Reusable Functions)

```openscad
module mounting_plate(w, d, h, hole_d, hole_pos) {
  difference() {
    cube([w, d, h]);
    // Four corner holes
    translate([hole_pos, hole_pos, 0])
      cylinder(h=h, d=hole_d);
    translate([w-hole_pos, hole_pos, 0])
      cylinder(h=h, d=hole_d);
    translate([hole_pos, d-hole_pos, 0])
      cylinder(h=h, d=hole_d);
    translate([w-hole_pos, d-hole_pos, 0])
      cylinder(h=h, d=hole_d);
  }
}

// Use the module
mounting_plate(80, 50, 5, 5, 8);
```

Modules are the key to building a library of reusable parametric parts.

## Loops

### For Loop (Pattern)

```openscad
for (i = [0 : 10 : 50]) {
  translate([i, 0, 0])
    cube([5, 5, 5]);
}
```

This creates 6 cubes spaced 10mm apart along the X axis.

### Generate Hole Pattern

```openscad
for (x = [10, 30, 50]) {
  for (y = [10, 30, 50]) {
    translate([x, y, 0])
      cylinder(h=10, r=2);
  }
}
```

Creates a 3×3 grid of holes.

## Exporting

1. Press **F6** to render (compile the model fully).
2. **File** → **Export** → **STL** (for 3D printing) or **AMF** or **3MF**.
3. For STEP export, OpenSCAD doesn't support it natively. Use the **Export to SVG** for 2D profiles, or convert STL to STEP using FreeCAD.

## Tips for Productive OpenSCAD Coding

1. **Press F5 frequently** — F5 previews the model without full rendering. Use it to check your code as you type.
2. **Use comments** — Document each section: `// --- Main body ---`
3. **Parameterize everything** — Put all dimensions as variables at the top of the file. This makes customization trivial.
4. **Use `echo()` for debugging** — `echo("Width:", width);` prints to the console.
5. **Use `$fn` for smoothness** — `$fn=64;` at the top of the file sets the facet count for all curves. Higher = smoother but slower.
6. **Include files** — `use <my-library.scad>;` lets you import modules from other files.
