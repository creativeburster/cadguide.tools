---
title: "RADAN Sheet Metal CAM: Floating Scrap Detection, Unfold Errors, and Tooling Hint Workflow"
excerpt: "RADAN users face three recurring production issues: floating scrap hazards on punching machines, overlapping unfold errors in 3D models, and time-consuming tooling error diagnosis. We cover each with fixes from Hexagon's release history and workflow improvements through RADAN 2025.1."
category: "workflow"
softwareSlug: "radan"
keyword: "RADAN floating scrap unfold error tooling hints sheet metal CAM fix"
slug: "radan-floating-scrap-unfold-errors-tooling-hints-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-07-30"
sources:
  - "https://hexagon.com/products/product-groups/computer-aided-manufacturing-cad-cam-software/radan/release-history"
  - "https://sncsolutions.com.au/whats-new-in-radan-2023-2/"
  - "https://www.ctemag.com/products/2017-release-radan-software-sheet-metal"
---

# RADAN Sheet Metal CAM: Floating Scrap Detection, Unfold Errors, and Tooling Hint Workflow

RADAN (by Hexagon, formerly Vero Software) is a CAD/CAM system dedicated to sheet metal fabrication — laser cutting, punching, and profiling. Three production issues dominate user workflows: floating scrap hazards, unfold failures in 3D models, and tooling error diagnosis. Each has been progressively addressed across RADAN releases from 2017 through 2025.1.

## Issue 1: Floating Scrap on Punching Machines

**The Problem**: During punching operations, pieces of scrap metal can fly off the machine, slide under the sheet, or damage tools. This is a safety hazard and a production risk.

**RADAN's Solution (introduced 2017, refined through 2025.1)**:

RADAN 2017 introduced **Floating Scrap Detection** — a check that analyzes individual hits in the job and identifies whether any floating scrap appears at any point during the punching sequence.

### How to Use Floating Scrap Detection

1. In **Order mode**, run the check from the **Order** menu
2. The software analyzes all hits in the job
3. Lines in the order text that produce floating scrap are highlighted
4. Selecting a highlighted line shows details about the first piece of floating scrap
5. Graphically, floating scrap is marked with **small red crosses**
6. Zoom in to see **red boxes** around the problem areas

### Automation (RADAN 2024.1+)

Floating scrap detection can now be included in **automation options** and made **mandatory** before creating NC programs. This prevents operators from skipping the check.

### Fiber Laser Considerations

Fiber laser machines use very high gas pressures that can cause scrap to come loose. When using **common cutting**, it's difficult to automatically tag potentially hazardous pieces of scrap. RADAN 2024.1 introduced improved tagging for common cut groups, including:
- Midline tags on the periphery of common cut groups
- Corner tags on non-common-cut slots
- Manual tag placement on common cuts themselves

## Issue 2: Overlapping Unfold Errors

**The Problem**: When a 3D sheet metal model is unfolded, faces sometimes clash on top of each other — the unfold fails or produces unusable flat patterns.

**RADAN's Solution (introduced 2020, refined through 2023.2)**:

### Overlapping Unfold Feedback

RADAN now notifies users when an unfold produces overlapping faces and shows the issue **graphically**. Instead of a silent failure or cryptic error, the user sees exactly which faces are clashing.

### Batch Unfold with Error Reporting

A button in the 3D toolbar unfolds **all parts** in the current assembly and its sub-assemblies using default settings:
- Parts that fail to unfold trigger a **warning** — allowing investigation
- Parts not required for nesting can be excluded before unfolding
- This automates what was previously a manual, part-by-part process

### Structure Tree Improvements (2023.2+)

The features and workspaces created during unfolding previously caused confusion in the Structure Tree. RADAN 2023.3 improved handling:
- Folded and unfolded states are managed separately in the tree
- Features irrelevant to the current state (folded vs. unfolded) are hidden
- This reduces visual clutter when toggling between states

### Sheet Metal Part Not Created — Troubleshooting

If RADAN fails to create a sheet metal part entirely:

1. **Check part properties**: Ensure stretch calculation data and material are defined
2. **Run an ACIS geometry check**: Invalid geometry causes bending failures
3. **Verify sheet thickness**: If the extrusion direction differs from the sheet thickness direction, do not use extrusion length as sheet thickness when prompted
4. **Reset part type**: Change the part type from sheet metal to regular part, then back — this forces RADAN to re-prompt for sheet thickness parameters

## Issue 3: Tooling Error Diagnosis

**The Problem**: With complex programs, checking for tooling errors is time-consuming. Finding the specific location of a failed corner fillet or un-tooled feature requires manual searching.

**RADAN's Solution (2025.1)**:

### Tooling Hints with Zoom-to-Error

In RADAN 2025.1, tooling errors are now interactive:
- Click any item in the tooling error list
- RADAN **instantly zooms** to show the exact location of the problem
- This eliminates manual searching through the model

### Configurable Error Handling (2023.2+)

Not all tooling errors require stopping automation. RADAN 2023.2 introduced configurable handling:

- **Failed corner fillets**: Can be set to warn but continue (often not a cause to stop)
- **Short un-tooled features**: Can be permitted or flagged depending on shop requirements
- Configuration is in the **Machine Configuration Editor → Workflow Status page**

### Automatic Tooling Improvements

- RADAN 2017: Machine tools pre-configured with all available cutting tools for new customers
- RADAN 2024.1: Automatic tooling can add tags for common cutting scenarios
- Punch presses: Foil-cutting function extended to scrap cuts for laser cutting with protective foil

## Issue 4: Hazardous Holes in Tube Cutting

**The Problem**: When cutting holes in tubes, pieces of metal (slugs) can be left in a dangerous position — they don't fall out cleanly and can damage the machine or cause safety issues.

**RADAN's Solution (2021 release)**:

Extra cuts can now be carried out that **divide slugs into smaller chunks** which fall out more readily. This eliminates the hazardous hole condition without requiring manual intervention.

## Design Validation in DESIGNER

RADAN DESIGNER includes automated checks for sheet metal manufacturability:

- **Flange warnings**: Automatically warns users about flanges that are too short for manufacturing
- **Error highlighting**: Parts with errors can be singled out for inspection
- **Bend adjustment**: Uses Radbend technology database to adjust bend information in 3D parts (requires Radbend installation)

## Best Practices for Error-Free NC Programs

1. **Run floating scrap detection** before generating NC code (make it mandatory in automation options)
2. **Use batch unfold** to identify unfold failures early in the workflow
3. **Configure tooling error handling** in Machine Configuration Editor to match shop floor tolerance
4. **Check part properties** before unfolding: material, stretch data, correct sheet thickness
5. **Use the new Tooling Hints** (2025.1) to click-to-zoom on errors instead of manual searching
6. **Validate geometry** with ACIS checks before attempting sheet metal conversion
