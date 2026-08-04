---
title: "OpenSCAD STL Export and Import Errors"
excerpt: "OpenSCAD STL Export and Import Errors: symptoms, root causes, and step-by-step fixes, verified against OpenSCAD GitHub Issues."
category: "printing"
softwareSlug: "openscad"
keyword: "OpenSCAD assertion failure crash rotate_extrude degenerate triangle vertices STL export button not working macOS 15.1.1 export action refactoring nondeterministic STL export assertion Manifold backend mismatched free non-Manifold backend non-manifold STL import crash nullptr dereference corrupted binary STL export stdout triangle count write before buffer buffered output fix"
slug: "openscad-stl-export-and-import-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-08-03"
sources:
---

# OpenSCAD STL Export and Import Errors: Assertion Failure Crash After rotate_extrude from Degenerate Triangle Vertices Requiring Version Update, STL Export Button Not Working on macOS 15.1.1 from Export Action Refactoring Bug Requiring PR Fix, Nondeterministic STL Export Assertion from Manifold Backend Mismatched Free Requiring Non-Manifold Backend, Non-Manifold STL Import Crash with Manifold Backend from nullptr Dereference Requiring Fix, and Corrupted Binary STL Export to stdout from Triangle Count Write Before Buffer Requiring Buffered Output Fix

OpenSCAD's STL export, rotate_extrude geometry, macOS export UI, Manifold backend, and binary STL output produce errors from degenerate triangles, export refactoring bugs, memory issues, nullptr dereferences, and buffer ordering. This guide covers the 5 most common OpenSCAD problems with diagnostic steps and community-verified fixes from OpenSCAD GitHub Issues.

## 1. Assertion Failure Crash After rotate_extrude from Degenerate Triangle Vertices

### Symptom

OpenSCAD crashes with an assertion failure during STL export after using `rotate_extrude()`. The crash happens when pressing F6 (render) then F7 (export STL). The assertion is: `export_stl.cc:132: Assertion 'p0 != p1 && p0 != p2 && p1 != p2' failed.` The crash occurs with simple code like `rotate_extrude() square([10, 10]);`.

### Root Cause

"If we have an extremely sliver/small triangle that differs by less than the resolution of float (23 bits) but different when represented as doubles (52 bits), it will become the same when we export to STL." The `rotate_extrude` function creates geometry with very thin sliver triangles. When tessellated, some triangles have vertices that are identical at float precision but different at double precision. The STL export assertion checks for identical vertices using doubles, but the geometry has degenerate triangles where vertices are effectively the same. The assertion fires and crashes OpenSCAD.

### Fix

1. **Update OpenSCAD to latest version**:
   - The fix was merged in PR #4990
   - Update to a build after February 15, 2024
   - This is the primary fix

2. **Use 3MF export instead of STL**:
   - 3MF handles degenerate triangles differently
   - Use F7 > 3MF as workaround
   - Then convert 3MF to STL in another tool

3. **Increase $fn to reduce sliver triangles**:
   - Use higher facet count: `rotate_extrude($fn=200) square([10, 10]);`
   - More facets create wider, non-degenerate triangles
   - This may avoid the assertion
   - But doesn't fix the underlying bug

4. **Use CGAL backend instead of Manifold**:
   - The crash may be specific to the Manifold backend
   - Try: `openscad --backend CGAL -o out.stl input.scad`
   - CGAL may handle the geometry differently
   - Check if the assertion still fires

5. **Check for degenerate geometry**:
   - Before exporting, check the geometry
   - Use `echo()` to inspect vertex positions
   - If vertices are very close, adjust the geometry
   - Add small offsets to separate coincident vertices

6. **Report with minimal reproducer**:
   - `rotate_extrude() square([10, 10]);`
   - Report on GitHub with the minimal code
   - Include OpenSCAD version and OS

### Community Report

> "I'm getting an assertion failure crash: export_stl.cc:132: Assertion 'p0 != p1 && p0 != p2 && p1 != p2' failed. It seems like the geometry created by rotate_extrude is in error, and/or the tessellation mentioned in the comment has not eliminated these cases. To reproduce: rotate_extrude() square([10, 10]). Export to 3mf does not crash but reports EXPORT-ERROR: Can't add triangle to 3MF model. Try something after Feb 15 where this is fixed: PR #4990."

## 2. STL Export Button Not Working on macOS 15.1.1 from Export Action Refactoring Bug

### Symptom

Since OpenSCAD version 2024-12-01 (git 1ad142a44), the STL export button doesn't work on macOS 15.1.1 (Sequoia). Clicking the STL button in the top bar does nothing. The menu "export STL" also doesn't work. No reaction at all, whether the code was rendered before or not.

### Root Cause

The version 2024-12-01 introduced export action refactoring that broke the export buttons on macOS. The refactoring changed how export actions are connected to the UI buttons. On macOS Sequoia 15.1.1, the new action connection method doesn't work, causing the buttons to be non-functional. This is a regression from the export action refactoring.

### Fix

1. **Update to version after December 1, 2024**:
   - The fix was merged in PR #5465
   - Use a build after December 1, 2024
   - This fixes the export button regression

2. **Use command-line export as workaround**:
   - If stuck on the broken version
   - Use command line: `openscad -o output.stl input.scad`
   - This bypasses the UI button issue
   - The command-line export works correctly

3. **Use older version**:
   - Use a version before 2024-12-01
   - The export buttons work in older versions
   - Download a previous build
   - Until the fix is available

4. **Use 3MF or OBJ export**:
   - If STL button doesn't work
   - Try other export formats
   - The refactoring may only affect STL
   - Check if 3MF or OBJ buttons work

5. **Check for follow-up regression**:
   - There was a follow-up regression
   - Check if the latest version has this issue
   - Report if export buttons are still broken

### Community Report

> "Since version 2024-12-01 git 1ad142a44 it is not possible to export STL-files anymore. The STL-Button in the top bar does not react, the menu export STL does not work, no reaction at all. macOS Sequoia 15.1.1, MacBook Pro 16' (2021) with Apple M1 Max, 64GB. Fixed by #5465: More export action refactoring. Referenced by issue #5524: cdc33d4f81 breaks export buttons."

## 3. Nondeterministic STL Export Assertion from Manifold Backend Mismatched Free

### Symptom

STL export fails nondeterministically with assertion failure: `export_stl.cc:172: Assertion 's0 != s1 && s0 != s2 && s1 != s2' failed.` The crash doesn't happen every time — a second invocation usually works. Using `--backend Manifold --hardwarnings`. Valgrind shows mismatched free/delete and CGAL assertion exceptions.

### Root Cause

The nondeterministic crash is caused by memory corruption in the Manifold backend. Valgrind reveals "Mismatched free() / delete / delete[]" in CGAL::Failure_exception handling. The CGAL interval rounding mode test triggers an assertion exception, which is then incorrectly freed. This corrupts memory, leading to nondeterministic behavior in the STL export. The Manifold backend interacts with CGAL in ways that expose this memory bug.

### Fix

1. **Use CGAL backend instead of Manifold**:
   - Run: `openscad --backend CGAL -o output.stl input.scad`
   - The CGAL backend doesn't trigger the memory corruption
   - This is the most reliable workaround

2. **Retry on failure**:
   - If the assertion fires, simply run again
   - The nondeterministic nature means it often works on retry
   - Use a script that retries on failure

3. **Remove --hardwarnings**:
   - Without --hardwarnings, warnings don't stop execution
   - The assertion may be downgraded to a warning
   - The export may complete despite the assertion
   - Check if the output STL is valid

4. **Update to latest OpenSCAD**:
   - The memory corruption may be fixed in newer versions
   - Check if the issue persists in the latest build
   - The valgrind findings help developers fix it
   - Report with valgrind output

5. **Use deterministic output**:
   - Add `--enable=predictible-output`
   - This may reduce nondeterministic behavior
   - Check if it helps with the assertion
   - Combine with CGAL backend

6. **Check for CGAL version compatibility**:
   - "CGAL 5.4" is shown in the dependency check
   - Try a different CGAL version
   - The interval rounding mode bug may be CGAL-specific
   - Build with a different CGAL version

### Community Report

> "Nondeterministic export_stl.cc assertion failure at line 172. Command: openscad --hardwarnings --backend Manifold --summary all -o out.stl. Assertion: s0 != s1 && s0 != s2 && s1 != s2. This does not happen all the time — a second invocation is usually sufficient. Valgrind shows Mismatched free() / delete / delete[] in CGAL::Failure_exception and CGAL::Interval_nt::Test_runtime_rounding_modes. OpenSCAD version 2024.10.17-dirty, Debian Linux Unstable."

## 4. Non-Manifold STL Import Crash with Manifold Backend from nullptr Dereference

### Symptom

Importing a non-manifold STL file (e.g., a single triangle) with `--render=force --backend=manifold` crashes OpenSCAD. The crash is a nullptr dereference in PolySetRenderer::addGeometry at line 100 of PolySetRenderer.cc. The crash occurs when the Manifold backend tries to process geometry that doesn't form a valid manifold.

### Root Cause

The Manifold backend expects valid manifold geometry. When a non-manifold STL (like a single triangle with no volume) is imported, the Manifold processing produces a null geometry result. The PolySetRenderer constructor receives this null geometry and tries to access it without a null check, causing the nullptr dereference crash. The renderer assumes the geometry is always valid after Manifold processing.

### Fix

1. **Update to version with fix**:
   - The fix adds null checks in PolySetRenderer
   - Update to a build after October 2025
   - This is the primary fix

2. **Use CGAL backend for non-manifold imports**:
   - Don't use `--backend=manifold` for non-manifold STLs
   - Use: `openscad --backend CGAL -o out.png input.scad`
   - CGAL handles non-manifold geometry more gracefully
   - It may produce warnings instead of crashing

3. **Avoid --render=force for non-manifold files**:
   - Don't use `--render=force` with non-manifold imports
   - Use regular render: `openscad -o out.png input.scad`
   - This may avoid the crash path
   - The force flag triggers the Manifold processing

4. **Repair the STL before import**:
   - Use MeshLab or Magics to repair the STL
   - Make it manifold before importing
   - Add faces to close the mesh
   - Then import the repaired STL

5. **Check STL validity before import**:
   - Use a mesh validation tool
   - Check for non-manifold edges, holes, or single triangles
   - Repair before importing to OpenSCAD
   - Non-manifold geometry is unsupported

6. **Use import with explicit checks**:
   - After import, check the geometry
   - Use `echo()` to verify the imported geometry
   - If geometry is null or invalid, skip processing
   - Add conditional logic in the SCAD file

### Community Report

> "Importing a non-manifold STL with --render=force --backend=manifold crashes. import('single-triangle.stl'); → openscad input.scad -o out.png --backend=manifold --render=force → Crash due to nullptr dereference in PolySetRenderer::addGeometry at PolySetRenderer.cc:100. Fixed by #5825."

## 5. Corrupted Binary STL Export to stdout from Triangle Count Write Before Buffer

### Symptom

When exporting binary STL to stdout (using `-o -` or pipe), the output file is corrupted. The triangle count in the binary STL header is wrong or zero. The STL file can't be read by slicers or mesh viewers. The corruption only happens with binary STL output to stdout, not to a file.

### Root Cause

The binary STL export writes the header and triangle count placeholder before writing the triangles. When writing to stdout, seeking back to position 80 to update the triangle count doesn't work — stdout is not seekable. The triangle count remains as zeros, corrupting the binary STL. The fix uses a memory buffer: write all triangles to a buffer first, then update the triangle count in the buffer, then flush the buffer to stdout.

### Fix

1. **Update to version with buffered output fix**:
   - Commit c190dac fixes this by using std::ostringstream buffer
   - Update to a build after December 4, 2024
   - This is the primary fix

2. **Export to file instead of stdout**:
   - If stuck on an older version
   - Export to a file: `openscad -o output.stl input.scad`
   - Then copy or move the file
   - Don't use stdout for binary STL

3. **Use ASCII STL for stdout**:
   - ASCII STL doesn't have the seek problem
   - Use: `openscad --export-format asciistl -o - input.scad`
   - ASCII STL is larger but works with stdout
   - Convert to binary later if needed

4. **Use the new export format flag**:
   - The fix also adds `--export-format binstl` and `--export-format asciistl`
   - Use explicit format specification
   - This ensures the correct export path
   - Combined with the buffer fix

5. **Verify STL after export**:
   - After exporting, verify the STL
   - Use a mesh validator or slicer
   - Check the triangle count in the header
   - If it's zero, the export was corrupted

6. **Check for triangle count overflow**:
   - Binary STL has a 32-bit triangle count limit
   - If the model has more than 4 billion triangles
   - The STL is invalid regardless of the buffer fix

### Community Report

> "Resolved Issues With Corrupted STL Files When Exporting to stdout (#5470). The fix uses std::ostringstream buffer to write triangles first, then updates the triangle count at position 80 in the buffer, then flushes to output. This fixes the corruption when exporting binary STL to stdout where seeking is not possible. Commit c190dac, December 4, 2024. Also adds --export-format binstl and asciistl options."

## 6. Additional OpenSCAD Issues

### Cache-Related Crashes

**Issue**: "I have seen some crashes on 2024.02.04 win when rendering or saving but couldn't reproduce."
**Fix**: Update to latest version. Clear OpenSCAD cache. Use `--enable=predictible-output`. Report with crash dump.

### Submodule Build Issues

**Issue**: "Git submodule hell" when building from source.
**Fix**: Use `git submodule update --init --recursive`. Use AppImage on Linux. Use official builds instead of building from source.

### Experimental Features Crash

**Issue**: Crashes when building with EXPERIMENTAL=1.
**Fix**: Build without EXPERIMENTAL flag. Or use official builds. Report experimental feature crashes separately.

### Float vs Double Precision

**Issue**: "Extremely sliver/small triangle that differs by less than the resolution of float (23 bits) but different when represented as doubles (52 bits)."
**Fix**: Use higher $fn to avoid sliver triangles. Update to latest version. Use 3MF export. Adjust geometry to avoid degenerate triangles.

### CGAL Interval Rounding

**Issue**: CGAL::Interval_nt::Test_runtime_rounding_modes assertion failure.
**Fix**: Use CGAL backend without Manifold. Update CGAL version. Disable interval arithmetic. Report with valgrind output.

## Best Practices

1. **Update to latest OpenSCAD build** — many export bugs are fixed in recent commits
2. **Use CGAL backend for problematic geometry** — more stable than Manifold for edge cases
3. **Use 3MF export as fallback for STL** — handles degenerate triangles differently
4. **Use command-line export if UI buttons are broken** — `openscad -o output.stl input.scad`
5. **Export to file, not stdout, for binary STL** — avoids seek corruption on older versions
6. **Use --export-format flag for explicit format** — ensures correct export path
7. **Repair non-manifold STLs before importing** — prevents nullptr crash in Manifold backend
8. **Avoid --render=force with non-manifold imports** — triggers the crash path
9. **Use higher $fn to avoid sliver triangles** — prevents degenerate vertex assertions
10. **Retry on nondeterministic crashes** — second invocation often works
