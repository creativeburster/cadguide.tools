---
title: "SolveSpace Naked Edges, Solver Failures, and OpenGL Black Screen: Known Issues and Workarounds"
excerpt: "SolveSpace users encounter naked edges in Boolean extrusions, unsolvable constraint errors, and black viewports on AMD Adrenalin drivers. We document the known bugs, their root causes, and community-verified workarounds — including chord tolerance tuning and the force-NURBS-to-triangle-mesh flag."
category: "troubleshooting"
softwareSlug: "solvespace"
keyword: "SolveSpace naked edges solver failure OpenGL black screen AMD fix"
slug: "solvespace-naked-edges-solver-failure-opengl-fix"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-30"
sources:
  - "https://solvespace.readthedocs.io/en/latest/issues.html"
  - "https://github.com/solvespace/solvespace/issues/1278"
  - "https://ltnr.ca/Lib/solvespaceTips.html"
---

# SolveSpace Naked Edges, Solver Failures, and OpenGL Black Screen: Known Issues and Workarounds

SolveSpace is a lightweight parametric 2D/3D CAD tool with a constraint solver and NURBS Boolean engine. Its small footprint comes with documented limitations: mesh Boolean operations produce non-manifold edges, the solver fails on redundant constraints, and AMD Adrenalin 22.7.1+ drivers cause a black viewport due to OpenGL 3 MSAA incompatibility. This guide covers each known issue with verified workarounds.

## Issue 1: Naked Edges in Boolean Extrusions

**Symptom**: After performing a difference-extrude (e.g., cutting a hole through a plate), `Analyze → Show Naked Edges` reveals edges that should be sealed. The mesh is no longer 2-manifold (watertight), which causes problems for 3D printing and CAM.

**Root Cause**: When curves in an extrusion are tangent to a face or edge, the NURBS Boolean engine fails to generate a clean topological seam. This is a known solver issue documented in the SolveSpace official docs and confirmed in forum discussions.

**Workarounds** (in order of preference):

1. **Reduce the extruded curve slightly**: If a circle is exactly 5mm wide and the frame is exactly 5mm wide, reduce the circle to 4.99mm. The naked edges disappear because the tangency is broken.
2. **Enable "Force NURBS surfaces to triangle mesh"**: In the extrude group's Property Browser, check this option. It bypasses the NURBS Boolean and uses the mesh Boolean instead — lower quality but avoids the seam failure.
3. **Redesign with fewer Boolean operations**: Instead of extruding a plate and then cutting a hole, draw a single sketch with both the outline and the hole, then extrude once. Use `Sketch → Split Curves at Intersection` to create the composite profile.

## Issue 2: Solver Fails with "Unsolvable Constraint"

**Symptom**: Adding a constraint produces a red error message and the sketch becomes unsolvable.

**Common Causes and Fixes**:

- **Selected a coincident constraint instead of a point**: Purple squares are constraints; green squares are points. Click carefully.
- **Selected a normal instead of a line**: Blue arrows are normals (surface directions), not lines. Hover to see the highlight difference.
- **Wrong group selected**: Constraints apply to the currently active group. Verify the correct group is selected in the Property Browser.
- **Redundant constraints**: Hover over the list of offending constraints in the error message to see which ones conflict. Remove the redundant one.
- **Constraining in the wrong axis**: Ensure you're only constraining in the X/Y direction of the active workplane. Use `Sketch → In Workplane` to switch.
- **Solver chirality flip**: If the solver messes up the handedness of geometry after a large parameter change, quickly drag the bad point to "whip" it back into the correct orientation.

## Issue 3: Performance Lag with Complex Sketches

**Symptom**: The UI becomes sluggish when editing sketches with many intersecting curves or large assemblies.

**Root Cause**: SolveSpace renders the solid model (triangles) on every parameter change. More triangles = more render time. The lag propagates through assemblies.

**Fix**: Increase the **chord tolerance** in the Property Browser (`Configuration → Chord Tolerance`):

- Default: ~0.1%
- For lag: try 0.1% first, then 0.5%
- Keep export tolerance lower than the display tolerance if possible
- Difference-extrudes with intersecting curves are especially expensive — avoid starting a cut from the middle of a face

## Issue 4: Black or Empty Viewport (AMD Adrenalin 22.7.1+)

**Symptom**: SolveSpace v3 launches but shows a black window. The UI elements (menus, property browser) are visible, but the 3D viewport is empty.

**Root Cause**: AMD Adrenalin driver version 22.7.1 and later have an OpenGL 3 MSAA (multisampling) bug that affects SolveSpace and Blender. The driver's MSAA override interferes with SolveSpace's OpenGL 3 renderer (`rendergl3.cpp`).

**Fixes**:

1. **AMD driver settings**: Open AMD Adrenalin → **Settings → Graphics → Anti-Alias (MSAA)** → set to **Use application settings** or **Enhance application settings**. This fixes the issue for some users on the latest drivers.
2. **Downgrade AMD driver**: Roll back to Adrenalin **22.5.1** or **22.6.1**, which do not have the MSAA bug.
3. **Use the OpenGL 1 build**: An unofficial SolveSpace build compiled for OpenGL 1 (not OpenGL 3) is available at `https://github.com/ruevs/solvespace/releases/tag/WindowsXPPost3.0_2`. This bypasses the affected renderer entirely.
4. **Use the web version**: `https://verylowfreq.github.io/experimental-solvespace-on-browser/` runs the same OpenGL 3 renderer through the browser's WebGL layer, which may work even when the desktop version does not.

## Issue 5: Application Won't Start (0xc000007b)

**Symptom**: On launch, Windows shows "The application was unable to start correctly (0xc000007b)."

**Root Cause**: This error is related to OpenGL version incompatibility or missing Visual C++ runtime. Reported on Windows 10 with Intel 630 integrated graphics.

**Fixes**:

1. Install **VC redist 2015** from Microsoft
2. Try the OpenGL 1 build linked above
3. Update Intel graphics drivers to the latest version
4. If using integrated graphics, verify OpenGL 3.0+ support with **OpenGL Extension Viewer**

## Known Limitations (Not Bugs)

Per the official documentation and community tips, SolveSpace has intentional design constraints:

- **No standard parts library**: No included fasteners or hardware catalog
- **No manual scaling**: All scaling must be done via constraints, not a transform tool
- **No in-place assembly editing**: Assembly parts are read-only unless opened as separate files
- **No 3D bevels or offsets**: These must be done at the 2D sketch level
- **No extrude along complex paths**: Only line or arc paths are supported
- **No 3D mesh import**: Can import `.dwg` and `.dxf` but not STL or OBJ
- **Deleting entities cascades**: Deleting an entity that a workplane depends on will also delete that workplane/group. Always check the warning popup — ensure "groups deleted = 0"
