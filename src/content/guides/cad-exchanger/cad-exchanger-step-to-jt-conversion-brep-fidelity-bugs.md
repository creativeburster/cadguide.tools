---
title: "CAD Exchanger STEP to JT Conversion: File Format Challenges, B-Rep Fidelity, and Known Import Bugs"
excerpt: "Converting STEP to JT with CAD Exchanger involves navigating text-based STEP rounding errors, JT's Parasolid-based precise geometry, and format-specific import bugs. We cover the conversion workflow, data healing during transfer, and known issues from the CAD Exchanger changelog."
category: "workflow"
softwareSlug: "cad-exchanger"
keyword: "CAD Exchanger STEP to JT conversion B-Rep import bugs file format"
slug: "cad-exchanger-step-to-jt-conversion-brep-fidelity-bugs"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-30"
sources:
  - "https://cadexchanger.com/step-to-jt/"
  - "https://download.cadexchanger.com/CHANGES.txt"
  - "https://cadexchanger.com/blog/3d-file-import-workflow/"
---

# CAD Exchanger STEP to JT Conversion: File Format Challenges, B-Rep Fidelity, and Known Import Bugs

CAD Exchanger provides SDK, CLI, and GUI tools for converting between 3D CAD formats. The STEP to JT conversion path is one of the most requested workflows — STEP is the universal exchange format, while JT is the lightweight visualization standard used in Siemens Teamcenter and PLM ecosystems. The conversion involves two distinct phases and several known format-specific challenges.

## The Two-Phase Conversion Workflow

CAD Exchanger processes file imports in two stages:

### Phase 1: ReadFile()

- Parses the input file contents into memory
- Creates an internal file model that encapsulates format-specific data
- For STEP: reads the text-based ISO 10303 entities (AP203, AP214, AP242)
- For JT: reads binary JT format versions 8.0 through 10.9 and ISO 14306:2012

### Phase 2: Transfer()

- Converts the in-memory file model into `ModelData_Model` — the neutral CAD Exchanger data structure
- Applies format-specific converters for each data type (edges, vertices, surfaces)
- Performs **data healing** to resolve quality issues: large gaps between edge vertices, inconsistent 3D/2D curve representations, mismatched face loop orientations, missing seam edges, degenerated edges

The Transfer() phase typically takes more time than ReadFile(), as it involves geometric conversion and healing.

## STEP Format Challenges

### Text-Based Rounding Errors

STEP files are written as text, which introduces potential round-off errors in numerical values. These errors are usually negligible but can accumulate in complex assemblies, impacting model accuracy — especially where high precision is crucial.

### Large File Sizes

STEP files tend to be large due to their comprehensive nature. This affects:
- Storage and bandwidth requirements
- Processing and loading times for complex assemblies
- Memory consumption during conversion

### Line Break Handling

Older STEP files may contain line breaks within control structures that cause parsing failures. CAD Exchanger has addressed this in recent versions, but legacy files from certain CAD systems may still trigger issues.

### Missing Product Structure

Some STEP files are saved without an explicit product structure. CAD Exchanger handles this by reconstructing the structure from the available geometric data, but the resulting assembly tree may differ from the original.

## JT Format Challenges

### Parasolid Dependency

The latest JT precise geometry representation is based on **Siemens Parasolid**. A high-quality JT implementation must be able to read and write Parasolid-format B-Rep data. This creates a dependency on Parasolid licensing for full-fidelity JT support.

### Legacy Version Compatibility

JT 7.x and earlier versions were proprietary with no publicly accessible specifications. CAD Exchanger supports JT 8.0 through 10.9, but files from pre-8.0 versions may not import correctly.

### Implementation Complexity

Full JT support requires understanding of the format's intricate specifications and algorithms. This creates variability in JT support quality across different software vendors.

## Known Import Bugs and Fixes (from CAD Exchanger Changelog)

### STEP Import Fixes

| Version | Fix |
|---------|-----|
| Recent | Fixed segmentation fault when importing certain models |
| Recent | Fixed parts becoming empty on export due to incorrect offset surface conversion |
| Recent | Fixed STEP files not parsed due to line breaks in control structures |
| Recent | Implemented import of models saved without explicit product structure |
| Recent | Added support for ID_ATTRIBUTE entities (imported as properties) |
| Recent | Improved import of toroidal surfaces with negative radii |
| Recent | Fixed STEP_Writer not escaping control characters in strings, leading to missing geometry |

### JT Import Fixes

| Version | Fix |
|---------|-----|
| Recent | Fixed crash when importing certain models |
| Recent | Fixed stack overflow on import of certain models |
| Recent | Fixed edges missing after import (regression) |
| Recent | Fixed primitives (boxes, pyramids, spheres, tri-prisms) imported with zero size |
| Recent | Fixed cylinders not being imported |
| Recent | Fixed huge memory consumption when converting multibody parts with JT B-Rep data segments |
| Recent | Fixed incorrect transformations when multiple transformation matrices attached to an element |
| Recent | Fixed missing polygonal representations in certain models |
| Recent | Fixed duplicate triangle sets in poly representations |
| Recent | Fixed invalid PMI data entities being imported |

## JT Export Scope

CAD Exchanger exports JT format 9.5 and ISO 14306:2012 with support for:

- B-Rep representations
- Polygonal representations (including multiple LODs)
- Assembly structure, including external file references
- Names and user-defined properties
- Validation properties
- PMI (Product Manufacturing Information)
- Colors, materials, textures
- Layers

## Best Practices for STEP to JT Conversion

1. **Use the latest CAD Exchanger version** — the STEP converter was fully rewritten (V2 engine, on by default) with significant performance and quality improvements
2. **Check the conversion log** — STEP import generates warnings and errors that identify specific entity issues
3. **Verify B-Rep fidelity** — compare the original STEP model against the exported JT in CAD Exchanger Lab to confirm geometry preservation
4. **Use gradual import** — V2 STEP converter supports non-blocking, gradual import for better application responsiveness
5. **Handle external references** — STEP assemblies with external references can be exported in shattered or per-part modes
