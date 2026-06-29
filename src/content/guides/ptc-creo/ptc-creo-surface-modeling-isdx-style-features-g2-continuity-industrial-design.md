---
title: "PTC Creo Surface Modeling: ISDX, Style Features, and G2 Continuity for Industrial Design"
excerpt: "Creo's surface modeling tools including ISDX Style features create Class-A surfaces with G2 continuity for industrial design. I cover the Style environment, curve creation, surface modeling, continuity analysis, and the workflow for aesthetic surface design."
category: "workflow"
softwareSlug: "ptc-creo"
keyword: "PTC Creo surface modeling ISDX Style features G2 continuity industrial design Class-A surfaces curve creation"
slug: "ptc-creo-surface-modeling-isdx-style-features-g2-continuity-industrial-design"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-29"
sources:
  - "https://www.ptc.com/en/products/creo/parametric"
  - "https://support.ptc.com/help/creo/creo_pma/r10.0/usascii/index.html"
  - "https://www.ptc.com/en/products/creo/isdx"
---

# PTC Creo Surface Modeling: ISDX, Style Features, and G2 Continuity for Industrial Design

I've used Creo's ISDX (Interactive Surface Design Extension) for consumer product design where surface quality and aesthetics are critical. ISDX is Creo's freeform surface modeling tool — it allows creation of Class-A surfaces with G2 (curvature) continuity that are difficult or impossible with standard parametric features. Understanding ISDX is essential for industrial designers working in Creo.

## ISDX Overview

ISDX (also called Style) is Creo's freeform surface modeling environment:
- **Curves**: Create and edit freeform curves (B-splines)
- **Surfaces**: Create surfaces from curves (boundary, sweep, loft)
- **Continuity**: Control G0, G1, G2, and G3 continuity between surfaces
- **Real-time editing**: Drag curve points and see surface updates instantly
- **Integration**: ISDX features are stored in the model tree like any other feature

## Entering the Style Environment

1. Click **Style** (Model tab → Surfaces group)
2. The Style environment opens with:
   - **Style ribbon**: Curve, surface, and analysis tools
   - **Four-view display**: Top, front, right, and iso views (optional)
   - **Model tree**: Shows Style features
3. All work in Style is saved as a single Style feature in the model tree

## Curve Creation

### Curve Types

**Free Curve**:
1. Click **Curve**
2. Click points in space to define the curve
3. The curve is a 3D B-spline through the points
4. Use the four-view display to position points in 3D

**Curve on Surface (COS)**:
1. Click **Curve** → select **Curve on Surface**
2. Select a surface
3. Click points on the surface to define the curve
4. The curve is constrained to the surface

**Drop Curve**:
1. Click **Curve** → select **Drop Curve**
2. Select a curve to project
3. Select a target surface
4. Select a direction (normal to surface or along a direction)
5. The curve is projected onto the surface

**Curve from Edge**:
1. Click **Curve** → select **Curve from Edge**
2. Select model edges or existing curves
3. The selected edges become Style curves that can be edited

### Curve Point Types

Each point on a Style curve has a type:
- **Free**: The point is in 3D space, freely movable
- **Fixed**: The point is on a surface or plane, constrained to that surface
- **Soft Point**: The point is linked to another curve or edge — it can slide along it
- **Internal**: A point inside the curve that controls the shape

### Editing Curves

1. Click **Curve Edit**
2. Select a curve
3. Edit options:
   - **Drag points**: Move points to reshape the curve
   - **Tangent vectors**: Adjust the tangent direction at endpoints
   - **Add points**: Right-click on the curve → Add Point
   - **Delete points**: Right-click on a point → Delete
4. Tangent constraints at endpoints:
   - **Natural**: Default tangent direction
   - **Free**: User-defined direction
   - **Horizontal/Vertical**: Constrained to horizontal or vertical
   - **Normal**: Perpendicular to a plane
   - **Aligned**: Parallel to another curve's tangent
   - **Symmetric**: Symmetric about a plane
   - **Tangent (G1)**: Tangent to another curve
   - **Curvature (G2)**: Curvature-continuous to another curve
   - **Surface Tangent**: Tangent to a surface
   - **Surface Curvature**: Curvature-continuous to a surface

### Continuity Levels

- **G0 (Position)**: Curves meet at the same point — visible kink
- **G1 (Tangent)**: Curves are tangent at the meeting point — smooth but curvature may jump
- **G2 (Curvature)**: Curvature is continuous — smooth transition, no visible seam
- **G3 (Acceleration)**: Rate of curvature change is continuous — ultra-smooth, used in automotive

## Surface Creation

### Boundary Surface

1. Click **Surface**
2. Select curves for the boundary:
   - **Primary curves**: Two or four boundary curves
   - **Internal curves**: Optional curves to control the surface shape
   - **Cross curves**: Optional perpendicular curves
3. The surface is previewed
4. Set continuity at each boundary:
   - **Free (G0)**: No continuity constraint
   - **Tangent (G1)**: Tangent to the adjacent surface
   - **Curvature (G2)**: Curvature-continuous to the adjacent surface
   - **Normal**: Perpendicular to a plane
5. Click **OK**

### Sweep Surface

1. Click **Surface** → **Sweep**
2. Select a trajectory curve
3. Select a section curve (cross-section)
4. The surface is swept along the trajectory
5. Set continuity at boundaries
6. Click **OK**

### Loft Surface

1. Click **Surface** → **Loft**
2. Select two or more section curves in order
3. The surface transitions between the sections
4. Set continuity at the first and last section
5. Click **OK**

## Surface Analysis

### Zebra Stripes

1. Click **Analysis** tab → **Zebra Stripes**
2. Zebra stripes are projected onto the surface
3. Check continuity:
   - **G0**: Stripes have sharp offsets at the seam
   - **G1**: Stripes are continuous but have sharp direction changes
   - **G2**: Stripes are smooth with no visible seam
   - **G3**: Stripes are perfectly smooth

### Curvature Analysis

1. Click **Analysis** tab → **Curvature**
2. Curvature combs are displayed on the surface
3. Check:
   - **Smooth curvature distribution**: No sudden jumps
   - **Direction consistency**: Combs point in consistent directions
   - **Continuity at seams**: Combs match at surface boundaries

### Reflection Analysis

1. Click **Analysis** tab → **Reflection**
2. A simulated environment is reflected on the surface
3. Check for:
   - **Smooth reflections**: No distortions or wavy lines
   - **Seam visibility**: Reflections should be continuous across seams
   - **Surface quality**: Dimples, ripples, or flat spots are visible

### Draft Analysis

1. Click **Analysis** tab → **Draft**
2. Set the pull direction (mold parting direction)
3. The surface is colored by draft angle:
   - **Green**: Positive draft (can be molded)
   - **Red**: Negative draft (undercut — cannot be molded)
   - **Yellow**: Zero draft (exactly on the parting line)
4. Essential for designing molded or cast parts

## Workflow for Class-A Surface Design

### Step 1: Create the Primary Curves

1. Enter the Style environment
2. Create the main character lines of the product:
   - **Profile curves**: Side profile, front profile
   - **Feature curves**: Lines defining key features (headlight, grille, handle)
3. Use four-view display to position curves accurately in 3D
4. Set tangent and curvature continuity at curve endpoints

### Step 2: Create the Primary Surfaces

1. Use boundary surfaces to create the main surface patches
2. Use the primary curves as boundaries
3. Set G2 continuity at shared edges
4. Check with zebra stripes and curvature analysis

### Step 3: Create Secondary Surfaces

1. Add secondary surfaces (fillets, blends, transitions)
2. Use G2 continuity at all connections
3. Check surface quality with reflection analysis

### Step 4: Trim and Merge

1. Create trim curves on the surfaces
2. Trim excess surface material
3. Merge adjacent surfaces into a quilt (single surface group)
4. The merged quilt represents the final exterior shape

### Step 5: Solidify

1. Exit the Style environment
2. Select the merged quilt
3. Click **Solidify** (Model tab)
4. The quilt becomes a solid body
5. Add internal features (ribs, bosses, mounting features) with standard parametric tools

## Common Issues

### Surface Has Wrinkles or Dimples

- Check the boundary curves for unnecessary inflection points
- Simplify the curves (fewer control points = smoother surface)
- Add internal curves to control the surface shape
- Use curvature analysis to identify problem areas

### G2 Continuity Fails at a Boundary

- Check that the adjacent surface has enough control points
- Verify the boundary curves have G2 continuity
- Try adjusting the tangent magnitude at the boundary
- Use a different surface creation method (loft instead of boundary)

### Surface Won't Solidify

- Check that the quilt is closed (no gaps or open edges)
- Verify all surfaces are merged into a single quilt
- Check for self-intersections in the surface
- Use the **Quilt Check** tool to diagnose problems

### Draft Analysis Shows Undercuts

- Adjust the surface to add draft in the pull direction
- Use the draft analysis tool iteratively during surface design
- Consider splitting the part differently (change the parting line)
- Add a draft feature after solidifying

## Summary

Creo's ISDX Style environment creates Class-A surfaces with G2 continuity for industrial design. Create freeform curves in 3D using the four-view display, with tangent and curvature constraints at endpoints. Create boundary, sweep, and loft surfaces from the curves, setting G0, G1, or G2 continuity at each boundary. Analyze surface quality with zebra stripes, curvature combs, reflection analysis, and draft analysis. The Class-A workflow is: create primary curves → create primary surfaces with G2 continuity → create secondary surfaces → trim and merge into a quilt → solidify into a solid body. The most common issues — wrinkles, continuity failures, solidify errors, and undercuts — are addressed by simplifying curves, adjusting tangent magnitudes, checking quilt closure, and using draft analysis iteratively. ISDX is essential for consumer product design where surface quality and aesthetics are critical.
