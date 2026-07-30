---
title: "Lantek Expert Nesting Workflow: Automatic Nesting, Manual Fine-Tuning, and Machine Reassignment"
excerpt: "Lantek Expert's nesting workflow combines automatic layout generation with manual fine-tuning tools. We cover the Nesting Explorer tree, five optimization levels, part rotation configuration, the Modify Machine feature for production pivots, and nesting by attribute for organized shop floor operations."
category: "workflow"
softwareSlug: "lantek-expert"
keyword: "Lantek Expert nesting workflow automatic manual optimization machine reassignment"
slug: "lantek-expert-nesting-workflow-automatic-manual-machine-reassignment"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://www.lantek.com/us/blog/manual-nesting"
  - "https://www.lantek.com/uk/blog/how-to-use-nesting-explorer"
  - "https://www.lantek.com/us/blog/modify-machine-feature"
---

# Lantek Expert Nesting Workflow: Automatic Nesting, Manual Fine-Tuning, and Machine Reassignment

Lantek Expert provides a tiered nesting workflow: start with automatic layout generation, then manually refine where human judgment adds value. The Nesting Explorer organizes sub-jobs and nests in a tree structure, giving operators full visibility and control over the nesting process.

## The Nesting Explorer

The Nesting Explorer is the central organizing tool, typically displayed as a panel on the left side of the nesting environment. It shows all sub-jobs and their nests in a tree structure.

### Sub-Job Context Menu (right-click a sub-job)

- **New sheet**: Loads an empty sheet for manual nesting
- **Save**: Saves the sub-job
- **Delete all sheets**: Removes all nests for that sub-job — useful when automatic nesting results don't match expectations
- **Automatic nesting**: Generates all necessary sheets to nest the sub-job's parts. Pro tip: lock smaller parts first so the system nests larger ones, then unlock smaller parts to fill gaps
- **Create Sub-job**: Creates a new sub-job
- **Expand All / Collapse All**: Toggles the tree view

### Sheet Context Menu (right-click a sheet format)

- **Delete**: Removes the nesting
- **Remove All Parts**: Strips all parts from the sheet for re-nesting
- **Open all the pieces**: Opens the geometry of all parts in the nest for review and modification

## Automatic Nesting: Three Modes

### 1. Do Everything (Do All)

Automatically creates nests and machining for all sub-jobs across different machines, sheet metal specifications, formats (including available remnants), and thicknesses. When properly configured, this function leaves the job approximately **80% done**.

### 2. Make the Active Subjob

Automatically creates nests for the selected sub-job only, using all available sheets in stock until all parts are nested.

### 3. One Sheet

Nests only one sheet of the selected sub-job. To produce multiple sheets with the same nest, right-click the sheet and change the quantity.

## Five Optimization Levels

Lantek offers five calculation levels for automatic nesting:

| Level | Speed | Material Usage |
|-------|-------|----------------|
| 1 | Fastest | Lower efficiency |
| 2-3 | Medium | Balanced |
| 4 | Slower | Better efficiency |
| 5 | Slowest | Best material usage |

Level 5 takes the most time but attempts to find the optimal part placement for maximum material utilization.

## Part Rotation Configuration

Automatic part rotation can be configured to improve nesting density:

- Set the **rotation increment** (e.g., 1° vs 15°) — smaller increments produce better results but take longer
- Enable **mirroring** to fit parts into spaces that require flipped orientation
- Configure **automatic gap adjustment** to set the optimal distance between parts for efficient cutting

## Manual Nesting Tools

When automatic nesting doesn't match production needs (warped material, specific placement requirements, operator preferences), Lantek Expert provides manual tools in the **Transform** tab:

- **Rotate, slide, and position** parts individually
- **Align** parts to edges or other parts
- **Attach** parts together for combined handling
- **Separate** previously attached parts
- **Cutting Order → Manual Sequence**: Arrange cuts in the most logical and efficient order

### Practical Manual Nesting Strategy

1. Start with automatic nesting (`One Sheet` mode)
2. Review the result — identify gaps and suboptimal placements
3. Use manual tools to rotate and reposition parts into open spaces
4. Group similar parts together for easier shop floor sorting
5. Set cutting order manually to optimize machine path

## Modify Machine: Production Pivot

When a machine goes down (breakdown or maintenance), programs created for Machine X need to run on Machine Y. Lantek Expert's **Modify Machine** feature adapts existing nesting plans to a different machine without recreating programs from scratch.

This is critical for production continuity — what could take hours of manual reprogramming is reduced to a few clicks. The feature handles compatibility differences between machines automatically.

## Nesting by Attribute (V44+)

Traditional nesting optimizes for material utilization. **Nesting by attribute** optimizes for production flow instead:

- Group parts by **delivery deadline**, **follow-up process**, **container type**, **job order**, or **assembly**
- Color-code parts from different jobs on the same sheet
- Separate parts with **offset zones** or **visible lines** for easy identification
- Parts matching selected attributes are prioritized; others fill remaining space

This addresses a real shop floor problem: modern laser cutters are so fast that operators struggle to sort mixed parts. Grouping by attribute reduces sorting errors and improves downstream efficiency, even at the cost of slightly lower material utilization.

## Configuration Best Practice

The effectiveness of automatic nesting depends heavily on initial configuration:

1. **Machine definitions**: Accurate cutting area, head parameters, feed rates
2. **Material definitions**: Correct thicknesses, sheet formats, remnants inventory
3. **Stock management**: Keep remnant inventory updated so Lantek can use them in automatic nesting
4. **Saved nests**: Use **Import nested stored** to reuse previous nesting layouts for recurring jobs — this can save significant time for repeat production

## Import Saved Nests

Before creating a new nest from scratch, check for saved nests:

1. In the sub-jobs menu, click **Import nested stored**
2. If a previous nest with the same parts exists, import it
3. Choose the number of sheets to produce
4. Define whether to prioritize nesting or machining

This is the fastest path to a completed job when working with recurring part combinations.
