---
title: "Chief Architect Pro Troubleshooting: Room Definition, Framing, and Roof Issues"
excerpt: "Fix common Chief Architect Pro problems: room selection failures, missing floor/ceiling, wall framing not generating, roof plane errors, and stair calculation issues with step-by-step solutions."
category: "troubleshooting"
softwareSlug: "chief-architect-pro"
keyword: "chief architect pro troubleshooting room framing roof issues"
slug: "chief-architect-pro-troubleshooting-room-framing-roof-issues"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.chiefarchitect.com/support/article/KB-00335/troubleshooting-wall-framing-issues.html"
  - "https://www.chiefarchitect.com/support/article/KB-02970/troubleshooting-room-selection-issues.html"
---

# Chief Architect Pro Troubleshooting: Room Definition, Framing, and Roof Issues

Chief Architect Pro is powerful, but its automated features — room definition, framing, and roof generation — depend on a correctly structured model. When something goes wrong, the root cause is usually in the walls, room definitions, or default settings. I'll cover the most common issues and their fixes.

## Room Selection Issues

### Symptom: Can't Select a Room

When you click inside a room, it doesn't highlight, and the Room Specification dialog doesn't open. Missing floor and ceiling finishes may also be visible.

### Cause 1: Gap Between Walls

A room in Chief Architect must have an unbroken perimeter. Even a tiny gap between walls prevents room definition.

**Fix:**
1. Zoom in on each wall junction around the problem room
2. Look for gaps or misaligned wall endpoints
3. Select a wall and drag its endpoint to connect with the adjacent wall
4. Watch for the connection icon — it should show a clean connection
5. If the gap is for a doorway, use the **Doorway** tool (Build > Doorway) to create a gap in a wall without breaking room definition

### Cause 2: "No Room Definition" Setting

Some walls are marked as "No Room Definition," meaning they don't contribute to room enclosure.

**Fix:**
1. Select each wall around the room
2. Open the Wall Specification dialog (click Open Object)
3. Go to the **General panel**
4. Uncheck **"No Room Definition"**
5. Repeat for all walls around the room
6. Note: Automatically generated attic walls (above full gable walls) have this checked by default

### Cause 3: Bad Wall Connections

Walls may appear connected visually but have incorrect connections, especially where three or more walls meet or at curved wall connections.

**Fix:**
1. Look for **orange warning triangles** at wall junctions — these indicate unconnected walls
2. Zoom in on the warning triangle
3. Select one of the walls
4. Use the edit handle to drag the wall back, then reconnect it to the other wall
5. Click the warning triangle to ignore it (if the connection is actually fine) or delete the wall
6. Check all wall connections around the room

### Cause 4: Locked Rooms Layer

If you can't select any rooms at all in the plan, the Rooms layer may be locked.

**Fix:**
1. Go to **Tools > Layer Settings > Display Options**
2. Scroll down to the **"Rooms"** layer
3. Click the **Lock** field to remove the padlock icon
4. Check the **Display** column to ensure the layer is visible
5. Repeat for any other layer sets where you can't select rooms

## Wall Framing Issues

### Symptom: Wall Framing Not Generating

After building framing, some or all walls don't show framing.

### Fix 1: Enable Wall Framing in Build Framing Dialog

1. Go to **Build > Framing > Build Framing**
2. Under "Automatically Rebuild Framing" or "Build Framing Once":
   - Check the **Walls** box
3. Click OK to generate framing

### Fix 2: Check Retain Wall Framing Setting

If a wall has "Retain Wall Framing" enabled, it won't rebuild even when framing is regenerated.

**Fix:**
1. Select the wall that isn't framing correctly
2. Click **Open Object** to open Wall Specification
3. Go to the **Structure panel**
4. Uncheck **"Retain Wall Framing"**
5. Click OK
6. Rebuild framing (Build > Framing > Build Framing)

### Fix 3: Verify Main Layer Configuration

The wall type's Main Layer must be set up correctly for framing to generate.

**Fix:**
1. Select the wall and open Wall Specification
2. Go to the **Wall Types panel**
3. Click **Define** to open Wall Type Definitions
4. Check:
   - The **Main Layer** (typically the framing layer) has the **Framing** box checked
   - If the framing layer is not in the Main Layers section, select it and use **Move Up/Move Down** to place it correctly
   - If multiple layers are Main Layers, at least one must have Framing checked
   - **Stud Spacing** and **Stud Width** are set correctly (e.g., 16" o.c., 1-1/2" width for 2x4)

### Fix 4: Check Wall Type Material Properties

1. In Wall Type Definitions, click on the framing layer
2. Check the **Material Properties** tab
3. Verify the **Framing** checkbox is checked
4. If not, check it and save

## Roof Issues

### Symptom: Roof Doesn't Generate

**Fix:**
1. Verify all exterior walls form a complete enclosed area
2. Check that no walls have "No Room Definition" checked
3. Ensure ceiling heights are set correctly
4. Go to **Build > Roof > Build Roof Planes**
5. Check the "Auto Rebuild Roofs" option

### Symptom: Wrong Roof Type (Hip Instead of Gable)

**Fix:**
1. Select the wall where the gable should be
2. Open Wall Specification
3. Go to the **Roof panel**
4. Check **"Full Gable Wall"**
5. Rebuild the roof

### Symptom: Roof Height Is Wrong

**Fix:**
1. Check the **ceiling height** of the room below the roof
2. Check the **wall height** in the Wall Specification
3. Verify the **roof pitch** in the Roof Defaults
4. If using manual roof planes, check the baseline height

### Symptom: Mixing Auto and Manual Roofs Causes Problems

**Fix:**
- Be consistent — either use all auto roofs or all manual roofs
- If you need manual control, turn off "Auto Rebuild Roofs" first
- Then make all manual adjustments
- Lock roof planes once finalized to prevent accidental changes

## Stair Issues

### Symptom: Stairs Don't Calculate Correctly

**Fix:**
1. **Finalize floor heights first** — don't change floor heights after placing stairs
2. **Check platform thickness** — verify the floor structure thickness in Room Defaults
3. **Use auto stairs first** — let Chief Architect calculate the initial layout
4. **Convert to manual** only if customization is needed
5. **Rebuild after structural changes** — stairs need to be rebuilt after any floor height or structure changes
6. **Don't fight the stairs** — if they're misbehaving, backtrack and verify floor heights and structure

## Default Settings Issues

### Symptom: Objects Have Wrong Properties When Drawn

**Fix:**
1. Go to **Edit > Default Settings**
2. Review and correct the defaults for the object type
3. Existing objects won't change — only new objects use the updated defaults
4. For existing objects, select them and modify individually

### Symptom: Template Plan Not Applied

**Fix:**
1. Create a template plan with all standard settings
2. Start new projects from the template (File > New Plan > select template)
3. Don't change critical defaults (wall types, floor structure) mid-project

## Common Workflow Mistakes

### 1. Not Setting Defaults Before Drawing

**Impact:** Every object drawn with wrong defaults needs to be fixed individually.

**Fix:** Always set defaults first. Create a template plan with all defaults configured.

### 2. Changing Floor Heights After Placing Elements

**Impact:** Stairs, roofs, and framing all need to be rebuilt.

**Fix:** Finalize floor heights and structure before placing stairs, roofs, or generating framing.

### 3. Mixing Automatic and Manual Tools

**Impact:** Automatic tools override manual changes, and manual changes prevent automatic updates.

**Fix:** Choose one approach per element type:
- Auto roofs OR manual roofs (not both)
- Auto framing OR manual framing
- Auto dimensions OR manual dimensions

### 4. Not Using Saved Plan Views

**Impact:** Working in the wrong view shows incorrect elements and layers.

**Fix:** Create Saved Plan Views for each plan type (Floor Plan, Electrical, Framing, etc.) and switch to the appropriate view before working.

### 5. Ignoring Warning Triangles

**Impact:** Bad wall connections cause room definition, roof, and framing errors.

**Fix:** Fix warning triangles as soon as they appear. Don't ignore them — they indicate real problems.

## Best Practices for Avoiding Issues

- **Set all defaults before drawing** — the single most important practice
- **Create and use a template plan** — standardize settings across projects
- **Draw walls approximately, then dimension precisely** — don't try to draw to exact size
- **Fix warning triangles immediately** — they indicate connection problems
- **Finalize structure before adding elements** — set floor heights before stairs and roofs
- **Be consistent with auto/manual** — don't mix automatic and manual tools for the same element
- **Use the Knowledge Base** — click "Check Knowledge Base" on error messages
- **Save revisions** — use File > Revisions to track changes and enable rollback
- **Test tools outside of live projects** — experiment in a test plan before using on client work
