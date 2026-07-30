---
title: "VISI Analysis Workflow: Draft Checking, Split Line Generation, and Geometry Healing for Mold Design"
excerpt: "VISI Analysis provides mold designers with tools to validate imported geometry before committing to mold design. We cover the five-stage workflow — Diagnose, Cleanse, Split, Revise, Flow — including draft heatmaps, silhouette imprinting, sliver face removal, and mold opening simulation."
category: "workflow"
softwareSlug: "visi"
keyword: "VISI Analysis draft check split line parting surface geometry healing mold design"
slug: "visi-analysis-draft-checking-split-line-geometry-healing-mold"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.veroprojectgroup.com/en/visi-analysis/"
  - "https://pmtechnologies.com/visi/analysis/"
  - "https://www.corengg.com/eliminate-mold-design-issues-with-visi-software/"
---

# VISI Analysis Workflow: Draft Checking, Split Line Generation, and Geometry Healing for Mold Design

When building molds from imported CAD data, geometry quality determines whether the project stays on schedule or cascades into rework. VISI Analysis is the preprocessing module that identifies and resolves model issues before mold design begins. It follows a five-stage workflow: **Diagnose → Cleanse → Split → Revise → Flow**.

## Stage 1: Diagnose — Identifying Problems Early

### Draft Angle Visualization

Select the mold direction and VISI renders the model using **color-coded draft zones**. Problem areas — insufficient draft, negative draft, or critical radii — are immediately visible without running a separate analysis.

- User-defined color zones for different draft angle ranges
- Instant heatmap rendering across the entire model
- Undercut detection with automated motion proposals

### Curvature and Radii Analysis

- Minimum and maximum radii displayed through the same graphical interface as draft checking
- Critical for identifying sharp internal corners that will cause stress concentration in the mold

### Thickness Analysis

- Visualize wall thickness across the entire model
- Maps to gating positions and rib design criteria
- Informs cooling channel layout decisions

### Dynamic Face Analysis

- **Hover over any model surface** to instantly pull up face data: draft conditions, trimming loops, fillet radii
- No need to run a separate analysis — the data appears on hover
- **Seed face propagation**: Select one or more starting faces and automatically propagate selection across connected surfaces based on a user-defined angle threshold — ideal for isolating water jackets or separating A and B surface groups

## Stage 2: Cleanse — Fixing Imported Geometry

Imported CAD data frequently contains topology errors that will cause downstream failures in mold design and CAM.

### Automatic Removal of Defects

- **Duplicate surfaces**: Detected and removed automatically
- **Sliver faces**: Tiny, narrow faces that serve no design purpose — flagged and extractable to a separate layer
- **Out-of-tolerance edges**: Normalized to ensure reliability without impacting approved design intent

### Topology Repair

- Automatic healing and sewing tools restore solid topology
- Edge/tolerance cleanup ensures valid geometry for downstream operations
- Quality reports can be generated for **internal and supplier audits** — useful for tracking data quality across the supply chain

### Key Principle

Topology is preserved — the cleansing process does not alter the approved design intent. It only fixes errors that would cause downstream failures.

## Stage 3: Split — Core/Cavity Separation

### Split Line Calculation

VISI offers **three split line routines** to find the optimal parting line:

1. **Imprint Shadow**: Produces silhouette edges on the body calculated from a selected direction (X, Y, Z, or by element). The silhouette corresponds to the outer visible boundary of the body from the defined viewpoint. This is the most powerful method — if the solid has no undercuts, the resultant silhouette curve is the ideal split line.

2. **Search Silhouette**: Refines results from Imprint Shadow. Analyzes all edges of the solid and keeps only those that belong to the silhouette curve, deleting redundant edges. Use this after Imprint Shadow to clean up unnecessary edges.

3. **Manual split line**: Full manual override for complex parts where automatic methods don't produce the desired result.

### Parting Surface Generation

- **Dynamic parting face generation** from the split line
- Externally created surfaces can be imported and combined with VISI-generated surfaces (extruded, offset, ruled, patch)
- **Split plane manager** handles complex parting conditions
- Guided parting surface creation even for complex shapes

### Mold Opening Simulation

- **Animated mold opening sequence** — visualize the full opening motion
- Undercuts animated along their movement axes
- Clash detection during opening — identifies interferences before they reach the production floor
- Exportable as **XML** for documentation and client review

### Managing Split Line Edges

The split line tree manages all edges. After Imprint Shadow generates edges:

1. Press **ESC** to activate the split line tree
2. Review closed and open edge sets — selecting each highlights the corresponding edge on screen
3. Right-click unwanted sets → **Unmark Set** to remove them
4. Refine with **Search Silhouette** to eliminate redundant edges

## Stage 4: Revise — Model Comparison

When a customer sends an updated model version mid-project, VISI Analysis compares the new version against the working model:

- **Load two versions** (solid or surface) and instantly identify changes
- **Color overlays and transparency controls** highlight deviations visually
- **Slider-based comparison** for interactive review
- **Auto-extract changed regions** with smart merge — apply only the changes to your working data
- Full traceability of versions, dates, and dimensional impact
- **Risk area alerts** before detailing or drafting begins
- Fast alignment across engineering, suppliers, and production teams

## Stage 5: Flow — Mold-Ready Preparation

The final stage prepares the validated model for the next phase:

- **Automated mold-ready preparation** — geometry is cleaned, validated, and structured for mold design
- **Broad CAD format compatibility** for smooth data exchange with upstream and downstream tools
- Validated data reduces downstream errors and setup time
- Real-time insights support faster decisions on cost, lead time, and priorities

## Common Mold Design Problems Solved by VISI

### Warpage and Shrinkage

VISI's mold flow analysis tools predict how plastic will fill the mold cavity, identifying potential air traps, short shots, or weld lines before manufacturing. Cooling channel simulation helps optimize heat distribution to prevent uneven cooling.

### Poor Cooling Channel Design

VISI simulates heat flow and suggests ideal channel placement. Conformal cooling channels can be designed directly in the model with automatic channel alignment, collision checks, and hydraulic component libraries.

### Inaccurate Core and Cavity Design

VISI automates core and cavity generation from part geometry. Draft analysis ensures proper release angles. Undercut detection with motion proposals identifies side-action requirements before machining.

### Inefficient CAD-to-CAM Workflow

VISI provides an integrated environment where mold design and CAM programming share the same data model. No manual data transfer between CAD and CAM — eliminating translation errors and reducing lead time.

## Smooth Edge Checking

After draft analysis identifies a problem face, use **Analysis → Smooth Edge** to check the tangency of connecting edges:

1. Open the **Check Edges Smoothness** panel
2. Use the **Select** icon to start edge selection
3. Select edges around the problem face
4. VISI reports whether edges are smooth (tangent) or not
5. Non-smooth edges indicate where the surface connection needs rebuilding

This is particularly useful when isocline rendering reveals a non-flowing surface — the smooth edge check pinpoints exactly where the tangency breaks.
