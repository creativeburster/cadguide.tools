---
title: "DWG TrueView DWG Compare: Detecting Changes Between Drawing Revisions"
excerpt: "How to use DWG TrueView's DWG Compare feature to visually identify differences between two DWG files — covering comparison settings, color coding, and reporting changes for drawing revision control."
category: "workflow"
softwareSlug: "dwg-trueview"
keyword: "dwg trueview dwg compare drawing revision changes"
slug: "dwg-trueview-dwg-compare-drawing-revision-changes"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-06"
sources:
  - "https://www.autodesk.com/products/dwg-trueview/overview"
  - "https://cad-kenkyujo.com/en/2dcad/autocad/trueview/"
---

# DWG TrueView DWG Compare: Detecting Changes Between Drawing Revisions

Drawing revisions happen constantly in construction and engineering projects. Comparing two DWG files manually is tedious and error-prone — you might miss a moved wall or a changed dimension. DWG TrueView's DWG Compare tool automates this. I use it on every revision I receive. Here's how.

## When to Use DWG Compare

- **Drawing revision review**: Client sends Revision 3 — what changed from Revision 2?
- **Contractor submittal check**: Did the contractor modify the design drawings?
- **Quality control**: Compare the issued drawing with the as-built drawing
- **Version tracking**: Identify what changed between two project milestones
- **Audit trail**: Document changes for project records

## Using DWG Compare

### Step 1: Open DWG Compare

1. In DWG TrueView: **File** → **DWG Compare**.
2. The DWG Compare dialog appears.
3. Select two DWG files:
   - **Drawing 1** (older revision): Click **Browse** → select the original DWG
   - **Drawing 2** (newer revision): Click **Browse** → select the revised DWG

4. Set comparison settings:
   - **Compare in current drawing**: Opens the comparison in the current window
   - **Compare in new drawing**: Creates a new comparison drawing

### Step 2: Configure Comparison

1. Click **Settings** to configure how differences are detected:

**Comparison mode:**
- **All objects**: Compare all drawing objects (lines, arcs, text, blocks, dimensions)
- **Selected layers only**: Compare only specific layers (e.g., compare only the "Walls" layer)
- **Selected objects only**: Compare only specific object types

**Tolerance:**
- **0.001mm**: Exact comparison (any difference is flagged)
- **0.1mm**: Practical comparison (ignors sub-millimeter differences from rounding)
- **1.0mm**: Loose comparison (ignors small shifts — useful for drawings from different sources)

**Color coding:**
- **Green**: Objects that exist only in Drawing 2 (added)
- **Red**: Objects that exist only in Drawing 1 (deleted)
- **White/gray**: Objects that exist in both (unchanged)
- **Yellow**: Objects that are modified (moved, scaled, or changed properties)

### Step 3: Run the Comparison

1. Click **Compare**.
2. DWG TrueView processes both drawings:
   - Analyzes all objects in each drawing
   - Matches objects by type, position, and properties
   - Identifies additions, deletions, and modifications

3. The comparison result displays in the drawing area:
   - **Green objects**: Added in the revision
   - **Red objects**: Removed in the revision
   - **Yellow objects**: Modified in the revision
   - **White/gray objects**: Unchanged

### Step 4: Review the Differences

1. **Zoom to differences**: 
   - The comparison panel lists all detected changes
   - Click a change in the list → TrueView zooms to that location
   - This lets you review each change systematically

2. **Filter by change type**:
   - Show only additions (green)
   - Show only deletions (red)
   - Show only modifications (yellow)
   - Show all changes

3. **Layer filter**:
   - Show changes on specific layers only
   - Useful for focusing on structural changes vs. annotation changes

4. **Change summary**:
   - Total additions: X objects
   - Total deletions: Y objects
   - Total modifications: Z objects
   - This gives a quick overview of the scope of changes

### Step 5: Export the Comparison

1. **Plot the comparison**: **Output** → **Plot** → plot the comparison drawing with the color-coded changes.
2. **Export to PDF**: Use DWG to PDF printer → creates a PDF showing all changes in color.
3. **Save the comparison drawing**: **File** → **Save As** → saves the comparison as a new DWG with the color coding.

4. Share the comparison drawing/PDF with the project team for review.

## Common Comparison Scenarios

### Architectural Plan Revision

Client sends Revision 2 of a floor plan. Compare with Revision 1:

1. **Green (added)**: New partition walls, additional doors, new furniture
2. **Red (deleted)**: Removed walls, deleted dimensions
3. **Yellow (modified)**: Moved walls, resized rooms, changed door swing directions

Review each change and verify it matches the client's revision notes.

### Structural Drawing Revision

Engineer issues a revised structural drawing. Compare with the previous issue:

1. **Green**: New beams, additional reinforcement, new detail callouts
2. **Red**: Deleted beams, removed notes
3. **Yellow**: Changed beam sizes (e.g., W18×35 → W18×40), moved columns

Verify all structural changes are reflected in the updated calculations.

### As-Built vs. Design

Compare the as-built drawing (from field measurement) with the original design:

1. **Green**: Elements built but not in the design (field additions)
2. **Red**: Elements in the design but not built (omissions)
3. **Yellow**: Elements built in different positions (construction tolerances or errors)

This comparison identifies discrepancies that may need design revisions or change orders.

## Tips for Effective Comparison

1. **Use the same coordinate system**: Both drawings must use the same coordinate system and origin. If they don't, objects won't match even if they're identical. Check that both drawings have the same insertion point (0,0,0).

2. **Set appropriate tolerance**: If drawings are from different sources (e.g., architect and engineer), use a 1mm tolerance to avoid flagging minor coordinate differences. If comparing two versions from the same author, use 0.001mm for exact comparison.

3. **Compare layer by layer**: For complex drawings, compare one layer at a time. This isolates changes and makes review more manageable.

4. **Save comparison results**: Save the comparison drawing for project records. It documents what changed and when — useful for dispute resolution.

5. **Check for moved objects**: A moved wall shows as red (deleted from old position) and green (added at new position). If you see a red/green pair, check if it's a move rather than a delete + add.

## Limitations of DWG Compare

- **No text content comparison**: DWG Compare detects that a text object changed position but doesn't compare the text content. If the text string changed (e.g., "Room 101" → "Room 102"), it shows as a modification but doesn't highlight the text difference.

- **Block definition changes**: If a block's definition changes (e.g., a window block is redefined), DWG Compare may show all instances as modified, even if the block's position didn't change.

- **Xref changes**: DWG Compare compares the host drawing only. If an Xref changed, you need to compare the Xref files separately.

- **No semantic comparison**: DWG Compare is a geometric comparison. It doesn't understand that a wall moved 100mm is a design change while a dimension text moved 100mm is just a reannotation. All changes are flagged equally.
