---
title: "T-FLEX CAD Parametric Modeling: Construction Lines, Nodes, and Variable-Driven Design Workflow"
excerpt: "T-FLEX CAD uses a unique construction-line-and-node paradigm for parametric modeling that differs from constraint-based sketchers. We cover the three modeling approaches, variable editor usage, and fragment-based assembly design from official T-FLEX tutorials and documentation."
category: "workflow"
softwareSlug: "t-flex-cad"
keyword: "T-FLEX CAD parametric modeling construction lines nodes variables tutorial"
slug: "t-flex-cad-parametric-construction-lines-variables-workflow"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://www.tflex.com/tutorials/cad/tutorial_1/"
  - "https://www.tflex.com/help/eng/T-FLEX%20CAD/16/getting_started.htm"
  - "https://www.tflex.com/help/eng/T-FLEX%20CAD/16/variables.htm"
---

# T-FLEX CAD Parametric Modeling: Construction Lines, Nodes, and Variable-Driven Design Workflow

T-FLEX CAD takes a fundamentally different approach to parametric modeling than most CAD systems. Instead of drawing sketch geometry and adding constraints, T-FLEX uses **construction lines** and **nodes** as the parametric framework, with **graphic entities** drawn on top. This dual-layer system enables total parametric control through a powerful variable editor.

## The Three Modeling Approaches

T-FLEX CAD supports three ways to create a drawing, which can also be combined:

1. **Parametric drawing (traditional)**: Based on construction lines and nodes — the original T-FLEX method. Takes more time to set up but allows easy modification of any parameter.
2. **Non-parametric sketch**: Created faster, similar to drawing in other CAD systems. No parametric relationships — not recommended for designs that will need modification.
3. **Parametric sketch with constraints**: Uses automatic constraint creation and driving dimensions, similar to modern constraint-based CAD. Can be combined with construction lines for hybrid parameterization.

## Construction Lines and Nodes: The Parametric Framework

### Construction Lines

Construction lines are the core elements of a T-FLEX parametric model. They are "thin" base lines that define the parametric framework:

- Displayed as **dashed lines**
- Include: infinite straight lines, circles, ellipses, splines, offset lines, function curves, and paths
- **Do not appear on printouts** and are not exported
- Their interdependencies (established at creation) define how the drawing adjusts when parameters change

### Nodes

Nodes are points whose placement is defined by construction line intersections:

- Typically created at the intersection of two construction lines
- Directly involved in defining the parametric model — lines pass through nodes, circles are defined by nodes
- Moving a construction line moves the node, which propagates changes to all dependent entities

### Constrained Drawing Mode

The recommended technique is **constrained drawing mode**, where creating a node automatically snaps to the nearest pair of construction lines and their intersection. Avoid mixing constrained and unconstrained modes on the same drawing, as this can cause errors in parametric modifications.

### Base Lines Rule

Use no more than **two base lines** on the main (independent) view, and no more than **one base line** on views defined by projections. This ensures freedom in placing drawings on the sheet.

## Graphic Entities: The Visible Drawing

Graphic entities constitute the actual drawing that appears on printouts:

- Graphic lines, dimensions, text, hatches, GD&T symbols
- "Snapped" to construction entities — modifications in construction lines propagate to graphic entities
- This is the main technique for parametric design in T-FLEX CAD

## The Variable Editor

The variable editor is the primary tool for managing parametric relationships. Variables can control:

- Construction line parameters (radius, angle, position)
- Visibility of drawing elements
- Hatch parameters, text content
- 3D model parameters

### Creating and Using Variables

1. Open the **variable editor** (main tool for all variable manipulations)
2. Create a variable with a numeric or character constant
3. Assign the variable as a parameter to a construction line (via the **EC: Edit Construction** command or during line creation)
4. Changing the variable value automatically modifies all dependent construction entities

### External Variables

Variables can be marked as **external**, enabling parametric connections between assembly documents and fragments:

- External variables defined in a fragment can be modified from the parent assembly document
- This enables top-down design where assembly-level parameters drive component geometry

### Error Handling

When variable expressions contain syntax errors:

- A warning icon appears in the **State** column of the variable editor
- The **Value** field turns red
- A detailed error description appears in the **Message** column (enable this column if hidden)

## Fragments and Assembly Design

Fragments are T-FLEX CAD drawings used in other drawings as subassemblies:

- Any T-FLEX CAD drawing can be used as a fragment
- **Parametric fragments** can have their external variables controlled from the assembly document
- This enables creating a family of parts from a single parametric fragment by varying parameters at the assembly level

## 3D Modeling from 2D Drawings

T-FLEX CAD supports two ways to create a 3D model:

1. **Direct modeling in the 3D window**: Create solids and surfaces directly in 3D space
2. **3D model from a finished drawing**: Import a 2D drawing (e.g., `.dwg` from another system) and extrude/revolve profiles into 3D

The unified `.grb` file format means a single T-FLEX document can simultaneously contain 3D model data, sheet metal, assembly information, drawings, bill of materials, databases, macros, CAE calculations, and CNC machining data.

## Installation Prerequisites

Before installing T-FLEX CAD, you must first install **T-FLEX Prerequisites** (a separate package). Failure to do so may cause installation failure or non-functioning components. The student version uses `.grs` file extension instead of `.grb`.
