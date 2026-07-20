---
title: "OpenSCAD Modules and Libraries: Building Reusable Code for Complex Models"
excerpt: "How to create and organize OpenSCAD modules, use include/use directives, and leverage community libraries like BOSL2 and MCAD for advanced geometry generation."
category: "workflow"
softwareSlug: "openscad"
keyword: "openscad modules libraries include use bosl2"
slug: "openscad-modules-libraries-reusable-code"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://en.wikibooks.org/wiki/OpenSCAD_Tutorial"
  - "https://github.com/BelfrySCAD/BOSL2"
---

# OpenSCAD Modules and Libraries: Building Reusable Code for Complex Models

After writing OpenSCAD scripts for a year, our code files were getting unwieldy — 500-line scripts with duplicated logic. Then we discovered modules and libraries. Now we have a personal library of 40+ reusable modules that make new designs take minutes instead of hours. Here's how to organize your OpenSCAD code.

## Module Basics

A module is a reusable block of geometry code — like a function in programming, but it produces 3D shapes instead of return values.

### Simple Module

```openscad
module rounded_box(w, d, h, r) {
  // A box with rounded vertical corners
  hull() {
    translate([r, r, 0]) cylinder(h=h, r=r);
    translate([w-r, r, 0]) cylinder(h=h, r=r);
    translate([r, d-r, 0]) cylinder(h=h, r=r);
    translate([w-r, d-r, 0]) cylinder(h=h, r=r);
  }
}

// Use it
rounded_box(50, 30, 10, 3);
```

### Module with Children

Modules can operate on child geometry — this is OpenSCAD's version of higher-order functions:

```openscad
module cut_holes(positions, d) {
  // Subtract holes from whatever is inside this module
  difference() {
    children();  // The parent geometry
    for (pos = positions) {
      translate(pos) cylinder(h=100, d=d, center=true);
    }
  }
}

// Use it: the cube is the child, holes are cut from it
cut_holes([[10,10,0], [40,10,0], [10,20,0], [40,20,0]], 5) {
  cube([50, 30, 10]);
}
```

### Module with Default Parameters

```openscad
module mounting_plate(
  width = 50,
  depth = 30,
  thickness = 3,
  hole_d = 4,
  hole_inset = 5,
  hole_count_x = 2,
  hole_count_y = 2
) {
  difference() {
    cube([width, depth, thickness]);
    for (i = [0 : hole_count_x - 1]) {
      for (j = [0 : hole_count_y - 1]) {
        x = hole_inset + i * (width - 2*hole_inset) / max(1, hole_count_x - 1);
        y = hole_inset + j * (depth - 2*hole_inset) / max(1, hole_count_y - 1);
        translate([x, y, 0])
          cylinder(h=thickness, d=hole_d);
      }
    }
  }
}

// Use with defaults
mounting_plate();

// Override specific parameters
mounting_plate(width=100, depth=60, hole_count_x=4, hole_count_y=3);
```

## Include vs Use

OpenSCAD has two ways to import code from other files:

### `use <filename.scad>`

- Imports **modules** only (not variables)
- Modules are available by name: `my_module(params);`
- Variables from the file are NOT accessible
- Use this when you only need the geometry modules

```openscad
use <my-library.scad>

rounded_box(50, 30, 10, 3);
mounting_plate(width=100, depth=60);
```

### `include <filename.scad>`

- Imports **everything** — modules AND variables
- The file's code is executed as if pasted into your script
- Variables are accessible
- Use this when you need shared variables or configuration

```openscad
include <my-config.scad>

// my-config.scad defines: standard_wall = 2;
echo("Wall thickness:", standard_wall);
```

### Best Practice

- Use `use` for geometry libraries (you only need the shapes)
- Use `include` for configuration files (you need the variables)
- Never use `include` for libraries — it pollutes your variable namespace

## Organizing a Library

Create a folder structure for your OpenSCAD projects:

```
openscad-projects/
├── libraries/
│   ├── hardware.scad       # Screws, nuts, washers
│   ├── electronics.scad    # PCBs, connectors, displays
│   ├── structural.scad     # Brackets, plates, beams
│   ├── gears.scad          # Gear generators
│   └── utils.scad          # Helper modules (rounding, text, etc.)
├── projects/
│   ├── enclosure/
│   │   ├── enclosure.scad  # Main project file
│   │   └── lid.scad
│   └── bracket/
│       └── bracket.scad
└── config.scad             # Shared configuration
```

In your project files:
```openscad
use <../libraries/hardware.scad>
use <../libraries/structural.scad>
include <../config.scad>
```

## Community Libraries

### BOSL2 (Belfry OpenSCAD Library v2)

BOSL2 is the most comprehensive OpenSCAD library. Install it:

1. Download from `https://github.com/BelfrySCAD/BOSL2`.
2. Place the `BOSL2` folder in your OpenSCAD libraries directory:
   - **Windows**: `%USERPROFILE%\Documents\OpenSCAD\libraries\`
   - **Mac**: `~/Documents/OpenSCAD/libraries/`
   - **Linux**: `~/.local/share/OpenSCAD/libraries/`
3. In your script: `include <BOSL2/std.scad>`

BOSL2 adds:
- **Advanced transforms**: `cuboid()`, `prismoid()`, `rounded_prism()`
- **Distributors**: `xcopies()`, `ycopies()`, `grid_copies()` (cleaner than for-loops)
- **Masking**: `fillet()`, `chamfer()`, `teardrop()` (for 3D printing-friendly holes)
- **Thread generation**: `screw_thread()`, `knurled_cylinder()`
- **Text3D**: `text3d()` for embossed text on models

Example with BOSL2:
```openscad
include <BOSL2/std.scad>

// Rounded box with BOSL2
cuboid([50, 30, 10], rounding=3);

// Grid of holes
diff() {
  cuboid([80, 50, 5], rounding=2);
  grid_copies(spacing=20, n=[3, 2])
    cyl(d=5, h=10, anchor=BOTTOM);
}
```

### MCAD

MCAD is an older library with basic hardware models:
```openscad
use <MCAD/boxes.scad>
use <MCAD/nuts_and_bolts.scad>

// Rounded box
roundedBox([50, 30, 10], 3, sidesonly=true);

// M8 bolt
bolt(M8);
```

MCAD is less maintained than BOSL2 but still useful for simple hardware models.

## Tips for Reusable Modules

1. **Parameterize everything** — Every dimension should be a parameter with a sensible default.

2. **Name parameters descriptively** — `wall_thickness` not `wt`. Your future self will thank you.

3. **Add comments** — Document what each parameter does:
   ```openscad
   // r: corner radius (mm), must be <= min(w,d)/2
   module rounded_box(w, d, h, r) { ... }
   ```

4. **Test edge cases** — What happens when `r = 0`? When `r > w/2`? Add guards:
   ```openscad
   module rounded_box(w, d, h, r) {
     safe_r = min(r, min(w, d) / 2 - 0.01);
     // ... use safe_r instead of r
   }
   ```

5. **Use `children()` for flexibility** — Modules that accept children are more reusable than modules that hardcode geometry.
