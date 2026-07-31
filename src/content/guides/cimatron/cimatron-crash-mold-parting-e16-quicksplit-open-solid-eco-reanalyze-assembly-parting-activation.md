---
title: "Cimatron Crash and Mold Parting: E16 Update Crash on Tool Library Import and Save, QuickSplit Open Solid Body Parting for Non-Watertight Geometry, ECO Master Part Update Re-Analysis for New Faces, Assembly Environment Direct Active Part Modification Without Regeneration, and Parting Surface Part Activation Blocking New Direction"
excerpt: "Cimatron fails for 5 distinct reasons: E16 update causes frequent crashes on tool library import and file save with doubled post processing time, QuickSplit requires understanding of open solid body topology for non-watertight parts, ECO updates require Re-Analyze Existing Direction to sort new faces into QuickSplit sets, Assembly environment modifies Active Parts directly without regeneration, and activating a Parting_ sub-assembly hides the New Direction option. We cover each with fixes from Practical Machinist and Cimatron help documentation."
category: "crash-and-mold-parting"
softwareSlug: "cimatron"
keyword: "Cimatron E16 crash tool library import save QuickSplit open solid body non-watertight ECO master part update Re-Analyze Assembly environment Active Part Parting sub-assembly New Direction"
slug: "cimatron-crash-mold-parting-e16-quicksplit-open-solid-eco-reanalyze-assembly-parting-activation"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://www.practicalmachinist.com/forum/threads/cimatron-update-causing-lots-of-crashes.410639/"
  - "https://help.cimatron.com/en/2026/quick_split.htm"
  - "https://help.cimatron.com/en/2026/Quick_Split.htm"
---

# Cimatron Crash and Mold Parting: E16 Update Crash on Tool Library Import and Save, QuickSplit Open Solid Body Parting for Non-Watertight Geometry, ECO Master Part Update Re-Analysis for New Faces, Assembly Environment Direct Active Part Modification Without Regeneration, and Parting Surface Part Activation Blocking New Direction

Cimatron E16 introduced frequent crashes while its QuickSplit mold parting tool requires specific knowledge of open solid body topology. Users report crashes during tool library import and file saving, doubled post processing times, and confusion about how QuickSplit handles non-watertight geometry and ECO updates. This guide covers the 5 most common crash and mold parting problems with diagnostic steps and verified fixes.

## 1. E16 Update: Frequent Crashes on Import and Save

### Symptom

After updating to Cimatron E16, the software crashes frequently:
- Crashes when importing tool libraries
- Crashes when saving files (locks up)
- Posting programs takes twice as long or more

### Root Cause

The E16 update introduced stability regressions affecting file I/O operations and post-processing. The tool library import and file save operations trigger the crashes.

### Fix

1. **Revert to previous version** — if E16 crashes are blocking work, go back to E15 until a hotfix is released
2. **Install the latest hotfix/service pack** — check for E16 hotfixes that address crash issues
3. **Simplify tool library imports** — import smaller batches of tools instead of large libraries at once
4. **Save frequently** — use auto-save if available to minimize data loss from crashes
5. **Contact Cimatron support** — report the crashes with crash dumps and reproduction steps
6. **Check hardware compatibility** — verify GPU and RAM meet E16 requirements
7. **Clear temporary files** — Cimatron temporary files can accumulate and cause instability

### Community Reports

> "I updated my Cimatron about a month back to the latest release of E16. So far it crashes all the time. When importing tool libraries and just saving a file it will lock up. Posting programs takes twice as long if not more."

This is not an isolated incident — multiple users report similar issues after the E16 update.

## 2. QuickSplit: Open Solid Body Parting for Non-Watertight Geometry

### Concept

QuickSplit and other parting tools can utilize solid body information from both **closed and open solids**. The part does NOT have to be a true "watertight" solid body. Even open solids contain valuable topology information that Cimatron uses:

- Adjacent surface information
- Face connectivity
- Edge relationships

### Benefits for Problematic Parts

Open solid topology enables Cimatron to provide benefits for parts that contain faults:
- Split faces into opening directions based on extrudability
- Recognize adjacent surfaces even with gaps
- Assign parting attributes based on topology

### QuickSplit Process

1. **Use Parting Attributes** to assign parting attributes to parting surfaces (faces)
   - Parting surfaces are surfaces used to separate core and cavity
   - They do not form the molded part itself

2. **Use Edit Direction** to edit a split direction
   - Split faces into opening directions
   - Faces are assigned to direction sets based on their ability to be extruded in that direction

3. **Create parting line** — after QuickSplit, a parting line can be created along the edges of a split set
   - The parting line is then used to create a parting surface

### Fix for Non-Watertight Parts

1. **Don't require watertight geometry** — QuickSplit works with open solids
2. **Check face connectivity** — ensure faces that should be adjacent are recognized as such
3. **Manually assign faces** — if automatic splitting is incorrect, manually assign faces to direction sets
4. **Use the Ignore Assigned Faces / All Faces toggle** — controls which faces are considered in the analysis

## 3. ECO Master Part Update: Re-Analyze Existing Direction

### Symptom

After an ECO (Engineering Change Order) or master part update, new faces appear in the part. These new faces are not automatically sorted into existing QuickSplit sets.

### Fix

1. **Use Edit Split Direction** to re-analyze:
   - Select the **Edit Direction** function from the Parting tree
   - In the Feature Guide on-screen menu, select **Re-Analyze Existing Direction**
   - This opens the Edit Split Direction function

2. **Re-run QuickSplit on the updated part**:
   - The re-analysis sorts new faces into existing QuickSplit sets
   - Previously assigned faces remain in their sets
   - Only new or changed faces need to be sorted

3. **Verify all faces are assigned** — after re-analysis, check that no faces are unassigned
4. **Update the parting line** — if the parting line changed due to the ECO, regenerate it from the updated split sets

## 4. Assembly Environment: Direct Active Part Modification

### Concept

QuickSplit can run in both the **Parting environment** and the **Assembly environment**. In the Assembly environment:
- Modifications are performed **directly on the Active Parts**
- Faces are moved between parts **without regeneration**
- This is faster than the Parting environment which requires regeneration

### Key Behavior

1. **In Assembly environment**:
   - QuickSplit modifies Active Parts directly
   - No regeneration needed — changes are immediate
   - Faces are moved between core, cavity, and side parts

2. **In Parting environment**:
   - QuickSplit creates split sets that need to be applied
   - Regeneration is required to update the part

### Fix

1. **Use Assembly environment for faster parting** — no regeneration overhead
2. **Activate the correct part** before running QuickSplit — faces can only be modified from Active Parts
3. **Verify the Assembly Tree** — ensure the correct parts are active
4. **Use Parting environment for initial setup** — then switch to Assembly for modifications

## 5. Parting Surface Part Activation: New Direction Hidden

### Symptom

When invoking QuickSplit within the Assembly environment, if a **parting surface part** or a **parting sub-assembly** (named "Parting_" in the Assembly Tree) is activated, the **New Direction option is not displayed**.

### Root Cause

The QuickSplit analysis will never run inside activated parts in the MoldDesign environment. When a parting surface part is active, QuickSplit cannot create new directions because it's operating within the parting surface context, not the main part context.

### Fix

1. **Activate the main part** — not the Parting_ sub-assembly:
   - In the Assembly Tree, right-click the main part → Activate
   - Ensure "Parting_" is not the active context

2. **Deactivate the parting surface part** before running QuickSplit:
   - Right-click the Parting_ sub-assembly → Deactivate
   - Then run QuickSplit — New Direction option will appear

3. **Check the Assembly Tree** — verify which part is currently active before running QuickSplit

4. **Use the Parting environment instead** — if the Assembly environment is confusing, switch to Parting environment where this issue doesn't occur

## 6. QuickSplit Options and Results

### Ignore Assigned Faces vs. All Faces

- **Ignore Assigned Faces**: Only analyzes faces that haven't been assigned to a direction set
- **All Faces**: Re-analyzes all faces, including previously assigned ones
- Use "Ignore Assigned Faces" for incremental updates
- Use "All Faces" for complete re-analysis

### Parting Attributes Auto-Assignment

The Parting Attributes function can automatically assign faces to part groups:
- Recognizes faces at the boundaries of different groups of part faces
- Attaches parting status based on boundary detection
- Faces at the shutoff between core and cavity are automatically assigned

### Motion Visualization

A feature of QuickSplit is the ability to show the divided part in motion:
- Parting faces must be assigned to the two part groups where they shutoff
- The Parting Attributes function performs this assignment automatically
- Motion visualization helps verify correct parting before manufacturing

### Publish to PDF

The split 'state' can be published to PDF for documentation and review.

## Best Practices

1. **Wait for E16 hotfixes** before upgrading if stability is critical — or revert to E15
2. **Import tool libraries in small batches** — reduces crash risk in E16
3. **Use QuickSplit with open solids** — watertight geometry is not required
4. **Re-Analyze Existing Direction after ECO** — sorts new faces into existing sets
5. **Use Assembly environment for faster parting** — no regeneration overhead
6. **Activate the main part, not Parting_** — otherwise New Direction is hidden
7. **Use Ignore Assigned Faces for incremental updates** — preserves existing assignments
8. **Use All Faces for complete re-analysis** — when major changes occur
9. **Verify with Motion Visualization** — check parting before manufacturing
10. **Publish split state to PDF** — document the parting for review
