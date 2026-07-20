---
title: "Chief Architect Pro Home Design: Floor Plan, Walls, Roofs, and Construction Documents"
excerpt: "Design a complete home in Chief Architect Pro: set up defaults, draw exterior and interior walls, create floors and roofs, add doors and windows, and generate construction documents."
category: "workflow"
softwareSlug: "chief-architect-pro"
keyword: "chief architect pro home design floor plan walls roof"
slug: "chief-architect-pro-home-design-floor-plan-walls-roofs"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-13"
sources:
  - "https://cloud.chiefarchitect.com/1/pdf/documentation/chief-architect-current-tutorial-guide.pdf"
  - "https://www.chiefarchitect.com/support/"
---

# Chief Architect Pro Home Design: Floor Plan, Walls, Roofs, and Construction Documents

Chief Architect Pro is a residential design software that combines 2D drafting, 3D modeling, and construction document generation in one package. It's widely used by custom home designers, remodelers, and builders. The workflow is designed to be intuitive — you draw walls, and the software automatically generates floors, roofs, and framing. We'll walk through the complete home design process.

## Setting Up Defaults

Chief Architect's default settings determine the initial attributes of every object you draw. Setting defaults before you start saves time and reduces errors.

### Critical Defaults to Set

1. Go to **Edit > Default Settings**
2. Configure these defaults:

   **Walls:**
   - **Exterior Wall** — set wall type (e.g., 2x6 framing with siding), height (97-1/8" standard)
   - **Interior Wall** — set wall type (e.g., 2x4 framing with drywall), height

   **Floor Structure:**
   - **Floor 1** — set floor structure (e.g., 2x10 joists, 16" o.c.)
   - **Floor 2** — set floor structure for upper floors

   **Ceiling Structure:**
   - **Ceiling height** — typically 8' or 9'
   - **Ceiling structure** — drywall on joists or trusses

   **Roof:**
   - **Pitch** — e.g., 8:12
   - **Overhang** — e.g., 12" horizontal
   - **Roof material** — asphalt shingles, metal, tile

   **Dimensions:**
   - **Dimension format** — fractional inches (Imperial) or mm (Metric)
   - **Dimension style** — exterior, interior, or auto

### Productivity Tips

- **Set defaults before drawing** — saves time and reduces errors
- **Draw walls to approximate length** — then position precisely with dimensions
- **Use Grid Snaps** for exterior walls — ensures clean, orthogonal walls
- **Save frequently** — implement a revision strategy for file backups

## Drawing Exterior Walls

### Starting a New Plan

1. **File > New Plan**
2. Select a template (Residential Template is recommended)
3. The template includes:
   - Default dimension settings
   - Auto-generated roof planes
   - Crosshairs enabled

### Drawing the Perimeter

1. Go to **Build > Wall > Straight Exterior Wall**
2. Click to start the first wall
3. Drag and click to set approximate length
4. Continue around the perimeter
5. Close the wall loop by clicking on the starting point

### Positioning Walls with Dimensions

After drawing the perimeter walls:

1. Select a wall by clicking on it
2. Use the temporary dimensions that appear to set the exact length
3. Click the dimension text and type the exact value
4. Press Enter to confirm
5. Repeat for each wall

### Creating Saved Plan Views

1. Go to **View > Saved Plan Views > New**
2. Create views for different purposes:
   - **Floor Plan** — standard 2D view
   - **Framing Plan** — shows framing layout
   - **Electrical Plan** — shows electrical layout
   - **Reflected Ceiling Plan** — shows ceiling features

## Creating Rooms and Interior Walls

### Room Definition

In Chief Architect, a room is created when walls completely enclose an area. The room automatically generates:
- **Floor platform** — based on room defaults
- **Ceiling platform** — based on room defaults
- **Moldings and trim** — base, casing, crown

### Drawing Interior Walls

1. Go to **Build > Wall > Straight Interior Wall**
2. Draw interior walls to create rooms
3. Ensure all walls connect properly — watch for warning triangles at wall ends
4. Fix any wall connection issues by dragging wall endpoints to connect

### Room Specification

1. Double-click inside a room to open the Room Specification dialog
2. Set:
   - **Room Type** — Bedroom, Bathroom, Kitchen, etc.
   - **Floor and ceiling heights** — can differ from defaults
   - **Moldings** — base, casing, crown profiles
   - **Materials** — floor, wall, ceiling finishes

### Common Room Issues

**Room not selectable** — check for:
- Gaps between walls (even tiny gaps prevent room definition)
- Walls marked as "No Room Definition" (check the General panel of Wall Specification)
- Bad wall connections (look for warning triangles)
- Locked "Rooms" layer (check Layer Settings)

## Adding Doors and Windows

### Placing Doors

1. Go to **Build > Door**
2. Click on a wall to place a door
3. The door automatically cuts the wall opening
4. In the Door Specification dialog:
   - **Door style** — panel, French, sliding, etc.
   - **Width and height** — e.g., 3'0" × 6'8"
   - **Swing direction** — hinge side and swing direction
   - **Threshold** — for exterior doors

### Placing Windows

1. Go to **Build > Window**
2. Click on a wall to place a window
3. In the Window Specification dialog:
   - **Window style** — casement, double-hung, picture, etc.
   - **Width and height** — e.g., 3'0" × 4'0"
   - **Sill height** — typically 36" for standard windows
   - **Glass** — single, double, or triple pane

## Creating Additional Floors

### Adding a Second Floor

1. Go to **Build > Floor > Build New Floor**
2. Choose:
   - **Derive from 1st floor** — creates walls matching the first floor perimeter
   - **Empty floor** — creates a blank floor
3. Set the floor height relative to Floor 1
4. Draw interior walls for the second floor

### Floor and Ceiling Heights

1. Open the Room Specification for any room
2. Adjust the **Floor Height** and **Ceiling Height**
3. Changes propagate to connected elements (stairs, roof)

## Roof Generation

### Automatic Roofs

Chief Architect generates roofs automatically based on wall settings:

1. Go to **Build > Roof > Build Roof Planes**
2. The roof is generated based on:
   - **Wall height** — determines roof start height
   - **Wall type** — "Full Gable Wall" creates gable ends, "Hip Wall" creates hips
   - **Default pitch** — from roof defaults
   - **Overhang** — from roof defaults

### Setting Wall Roof Directives

1. Select a wall and open Wall Specification
2. On the **Roof panel**:
   - **Full Gable Wall** — creates a triangular gable end
   - **High Shed/Gable Wall** — creates a shed roof
   - **Knee Wall** — creates a partial-height wall for half-story
   - **Roof Base Line** — defines where the roof starts

### Manual Roof Adjustments

1. Go to **Build > Roof > Roof Plane**
2. Draw a roof plane manually
3. Adjust the pitch, height, and overhang
4. Use the **Join Roof Planes** tool to connect roof planes

### Common Roof Issues

- **Roof doesn't generate** — check that walls form a complete enclosed area
- **Wrong roof type** — check wall roof directives (Full Gable vs. Hip)
- **Roof height wrong** — check ceiling heights and wall heights
- **Mixing auto and manual roofs** — be consistent; don't mix auto and manual roof planes

## Creating 3D Views

1. Go to **3D > Create Camera View > Full Camera**
2. Click and drag in the direction you want to view
3. The 3D view shows the model with materials, lighting, and shadows
4. Use the camera tools to navigate:
   - **Orbit** — rotate around the model
   - **Pan** — move side to side
   - **Zoom** — move closer or farther

## Generating Construction Documents

### Layout Files

1. Go to **File > New Layout**
2. Set the sheet size (e.g., 24" × 36", Arch D)
3. Send views from the plan to the layout:
   - **File > Send to Layout** — sends the current view
4. Arrange views on the layout sheet
5. Add a title block, notes, and dimensions

### Creating Layout Templates

1. Set up a layout with:
   - Title block
   - Sheet border
   - Default text styles
   - Layer sets for different plan types
2. Save as a layout template (.layout file)
3. Use for all future projects

### Common Construction Documents

- **Site Plan** — property boundaries, setbacks, north arrow
- **Floor Plans** — one per floor level
- **Roof Plan** — roof layout from above
- **Electrical Plan** — lighting, switches, outlets
- **Framing Plan** — wall, floor, and roof framing
- **Elevations** — four exterior elevations
- **Sections** — building cross-sections
- **Details** — construction details

## Common Issues

### Wall Framing Not Generating

Check:
- **Build Framing dialog** — ensure "Walls" is checked under "Automatically Rebuild Framing"
- **Retain Wall Framing** — if enabled, prevents rebuilding (uncheck in Wall Specification > Structure)
- **Main Layer** — the wall's main layer must have "Framing" checked in the Material Properties
- **Stud spacing and width** — verify these are set correctly in the wall type definition

### Stairs Not Working

- **Finalize floor heights first** — don't change floor heights after placing stairs
- **Check platform thickness** — verify floor structure thickness
- **Use auto stairs first** — then convert to manual if needed
- **Rebuild after structural changes** — stairs need to be rebuilt after floor height changes

## Best Practices

- **Set defaults before drawing** — the most important productivity tip
- **Use Saved Plan Views** — organize different plan types
- **Draw approximate, then dimension precisely** — don't try to draw to exact size initially
- **Fix warning triangles immediately** — they indicate wall connection problems
- **Use auto roofs first** — then switch to manual for complex roofs
- **Create layout templates** — standardize your construction documents
- **Save file revisions** — use the revision tool to track changes
- **Use the Knowledge Base** — error messages include a "Check Knowledge Base" button
