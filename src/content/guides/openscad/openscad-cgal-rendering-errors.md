---
title: "OpenSCAD CGAL Rendering Errors"
excerpt: "OpenSCAD CGAL Rendering Errors: symptoms, root causes, and step-by-step fixes, verified against GitHub issues and OpenSCAD mailing list."
category: "troubleshooting"
softwareSlug: "openscad"
keyword: "OpenSCAD CGAL Nef_polyhedron3 assertion violation non-manifold STL vertex winding order coincident faces cache interference F5 F6 Manifold engine"
slug: "openscad-cgal-rendering-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://github.com/openscad/openscad/issues/4313"
  - "https://github.com/openscad/openscad/issues/3703"
  - "https://3dprinting.stackexchange.com/questions/15769/openscad-render-f6-fails-with-error-cgal-error-in-cgal-nef-polyhedron3"
---

# OpenSCAD CGAL Rendering Errors: Nef_polyhedron3 Assertion Violation from Non-Manifold STL Import, Vertex Winding Order Causing Component Disappearance, Coincident Faces in Boolean Operations, Cache Interference Between F5 Preview and F6 Render, and Manifold Engine as CGAL Replacement

OpenSCAD's CGAL rendering engine (F6) is notoriously strict about geometry validity. Models that preview correctly (F5) fail on render with cryptic assertion violations. Non-manifold STL imports, vertex winding order errors, coincident faces, and cache interference are the most common causes. This guide covers the 5 most common CGAL rendering failures with diagnostic steps and community-verified fixes from GitHub issues and the OpenSCAD mailing list.

## 1. CGAL Nef_polyhedron3 Assertion Violation from Non-Manifold STL

### Error Message

```
ERROR: CGAL error in CGAL_Nef_polyhedron3(): CGAL ERROR: assertion violation!
Expr: e->incident_sface() != SFace_const_handle()
File: .../CGAL/Nef_S2/SM_const_decorator.h
Line: 329
```

### Symptom

A model previews correctly in F5 but fails to render in F6. One or more imported STL components disappear from the rendered output. The error appears in the console.

### Root Cause

The imported STL file is non-manifold — it contains self-intersections, degenerate faces, or holes. CGAL only accepts perfect 2-manifold geometry. The assertion violation occurs when CGAL's internal logic encounters topology it cannot process.

### Diagnosis

1. **Check the STL in a mesh analyzer**:
   - Use MeshLab: Filters > Cleaning and Repairing
   - Look for: self-intersecting faces, degenerate triangles, non-manifold edges/vertices
   - Netfabb can also detect these issues

2. **Isolate the failing component**:
   - Comment out parts of the SCAD file
   - Render each component individually
   - The component that disappears is the problematic one

3. **Check STL source**:
   - STLs exported from OpenSCAD itself can be non-manifold
   - STLs from 3D scans or sculpting tools frequently have issues
   - Even "fixed" STLs from free repair services may not fix all self-intersections

### Fix

1. **Fix the STL in Netfabb** (full version, not just the free service):
   - Open the STL in Netfabb
   - Use Repair > Automatic Repair
   - Explicitly remove degenerate triangles
   - Export the fixed STL

2. **Use MeshLab for repair**:
   - Filters > Cleaning and Repairing > Remove Duplicate Faces
   - Filters > Cleaning and Repairing > Remove Non-Manifold Edges
   - Filters > Cleaning and Repairing > Remove Degenerate Faces
   - Filters > Cleaning and Repairing > Remove T-Vertices by Edge-Flip (may need multiple runs)

3. **MakePrintable online service** — users report success with MakePrintable for fixing self-intersecting faces

4. **Avoid importing problematic STLs** — if possible, generate geometry natively in OpenSCAD instead of importing external STLs

5. **Use Manifold engine** (see Section 5) — Manifold is more tolerant of imperfect geometry

### Key Insight

> "CGAL only (99.99%) does CGAL error in CGAL_Nef_polyhedron3() when there is a problem with the STL. The assertion is specific tests on the internal logic of geometry."

Free STL fixers often don't fix self-intersections. The full version of Netfabb or MeshLab with manual repair is usually required.

## 2. Vertex Winding Order Causing Component Disappearance

### Error Message

```
ERROR: CGAL error in CGAL_Nef_polyhedron3(): CGAL ERROR: assertion violation!
```

### Symptom

A custom polyhedron (not an imported STL) previews correctly but one component disappears on render. Isolating the disappearing component renders it correctly alone, but combining it with other geometry fails.

### Root Cause

The vertex winding order for one or more faces is inconsistent with the others. If most faces use right-hand-rule (counter-clockwise when viewed from outside) but one face uses left-hand-rule (clockwise), CGAL cannot process the resulting non-manifold geometry.

### Diagnosis

1. **No visible sign in preview** — F5 preview shows the model correctly regardless of winding order
2. **Isolate the failing component** — render each part separately to identify which one causes the error
3. **Check vertex order** — for custom polyhedron() calls, verify all face vertex lists follow the same winding convention

### Fix

1. **Reorder vertices** — ensure all faces use the same winding order (right-hand-rule is standard):
   - For each face, list vertices counter-clockwise when viewed from outside the solid
   - One wrong face can cause the entire render to fail

2. **Use polyhedron() with verified faces** — after reordering, test each face's normal direction

3. **Check for degenerate points** — two nearly identical points in a polygon list can also cause issues, though fixing this alone may not solve the winding order problem

### Community Report

> "I rederived the face lists, and found that for one face the vertices were listed in the opposite order from the others. Rather than using right-hand-rule, I had used left-hand-rule. Reordering the vertices for the one face fixed the problem. There was no way to see the problem from the preview."

## 3. Coincident Faces in Boolean Operations

### Error Message

```
ERROR: CGAL error in CGAL_Nef_polyhedron3(): CGAL ERROR: assertion violation!
Expr: e_below != SHalfedge_handle()
```

### Symptom

A union or difference operation on two objects with coincident faces (faces that share the exact same plane) fails to render. Each object renders correctly individually.

### Root Cause

When two objects share coincident faces (e.g., a cube and an imported STL both with faces at z=0), CGAL cannot resolve the boolean operation because the coincident faces create ambiguity in the resulting topology.

### Fix

1. **Offset one object slightly** — move one object by a tiny amount (e.g., 0.001) to eliminate coincident faces:
   ```openscad
   translate([0, 0, 0.001])
   import("model.stl");
   ```

2. **Use a small gap in loops** — if generating objects in a loop, use non-integer offsets:
   ```openscad
   for (z = [0, 1.01])  // instead of [0, 1]
   ```

3. **Check for coplanar faces** — identify which faces are coincident and offset one object

4. **Use Manifold engine** (see Section 5) — Manifold handles coincident faces better than CGAL

### Community Report

> "I was able to get the STL modified by OpenSCAD to be OK according to Netfabb by moving the cubes, so that they didn't have coincident faces, but I still got the same CGAL error when it was imported again and unioned with a cube."

## 4. Cache Interference Between F5 Preview and F6 Render

### Error Message

```
ERROR: CGAL error in CGALUtils::applyUnion3DHybrid: CGAL ERROR: assertion violation!
```
or
```
ERROR: Rendering cancelled by exception Unauthorized intersections of constraints
```

### Symptom

A model previews correctly in F5 but fails on F6 render. Flushing the cache and rendering again sometimes works.

### Root Cause

The F5 preview cache can interfere with the F6 render. The cached preview geometry may contain artifacts that cause CGAL to fail during the render operation. This is a known bug in OpenSCAD.

### Fix

1. **Flush cache before rendering**:
   - Design → Flush Caches
   - Then F6 Render
   - This clears the preview cache that may be causing the interference

2. **Enable Manifold engine** (see Section 5) — Manifold doesn't have this cache interference bug

3. **Restart OpenSCAD** — if flushing cache doesn't work, restart the application to clear all caches

4. **Disable fast-csg** — if fast-csg is enabled, try disabling it:
   - Edit → Preferences → Features → uncheck fast-csg
   - Flush cache and render again

### Community Report

> "Note that you should flush the cache before trying to do F6 render, the cache from F5 preview may interfere with manifold (known bug) and cause failure."

> "The cached preview can also break CGAL, so it is always worth trying a flush between F5 and F6."

## 5. Manifold Engine as CGAL Replacement

### Background

OpenSCAD has been transitioning from CGAL to the Manifold rendering engine. Manifold is:
- **More tolerant** of imperfect geometry (non-manifold STLs, coincident faces)
- **Faster** for complex boolean operations
- **Less prone** to cache interference bugs
- **The future** of OpenSCAD rendering

### Status

- Manifold is available in recent OpenSCAD nightly builds and development snapshots
- Some CGAL-only bugs are already fixed by switching to Manifold
- The transition is ongoing — some features may not yet be fully supported in Manifold

### How to Enable Manifold

1. **Use a recent development snapshot** — download from openscad.org
2. **Enable Manifold**:
   - Edit → Preferences → Features
   - Enable Manifold (or fast-csg with Manifold backend)
3. **Flush cache** — always flush cache after switching engines
4. **Test both engines** — if Manifold works but CGAL doesn't, use Manifold

### Community Reports

> "Status as of 2024-03-24: Works with Manifold, still fails with CGAL"

> "Maybe try to enable manifold instead of fast-csg? We have some bug fixes there."

## 6. Additional OpenSCAD Issues

### STL Export from OpenSCAD Re-import Fails

**Issue**: An STL exported from OpenSCAD cannot be re-imported and rendered in OpenSCAD.
**Root Cause**: OpenSCAD's STL export can produce vertices too close together, which CGAL rejects on re-import.
**Fix**: Use Manifold engine, or fix the exported STL in Netfabb before re-importing.

### roof() Feature Rendering Failure

**Issue**: The experimental roof() feature causes rendering failures with both CGAL and the 2024 development snapshot.
**Fix**: 
- Enable Manifold engine
- Flush cache before rendering
- Consider alternative approaches to achieve the same geometry without roof()

### Large STL Import Performance

**Issue**: Importing large STL files (100MB+) causes OpenSCAD to freeze or crash.
**Fix**:
- Reduce STL file size by simplifying the mesh
- Use MeshLab to decimate the mesh before importing
- Enable fast-csg for better performance with large imports

## Best Practices

1. **Fix STLs before importing** — use Netfabb (full) or MeshLab to repair non-manifold geometry
2. **Check vertex winding order** — ensure all custom polyhedron faces use the same convention
3. **Avoid coincident faces** — offset objects by 0.001 to prevent boolean operation failures
4. **Flush cache before F6** — the F5 preview cache can interfere with render
5. **Enable Manifold engine** — more tolerant, faster, and the future of OpenSCAD rendering
6. **Isolate failing components** — comment out parts to find the one causing the error
7. **Don't trust free STL fixers alone** — they often don't fix self-intersections
8. **Use right-hand-rule for vertex order** — counter-clockwise when viewed from outside
9. **Restart OpenSCAD if cache flush doesn't work** — clears all cached state
10. **Simplify large STLs before import** — use MeshLab decimation to reduce file size
