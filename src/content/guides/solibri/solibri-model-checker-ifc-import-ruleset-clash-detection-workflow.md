---
title: "Solibri Model Checker: IFC Model Import, Ruleset Configuration, and Clash Detection Workflow"
excerpt: "How to set up Solibri Office for BIM coordination — covering IFC model import, role selection, ruleset configuration, clash detection matrix setup, and issue management with BCF export to Revit and Navisworks."
category: "workflow"
softwareSlug: "solibri"
keyword: "solibri model checker ifc import ruleset clash detection workflow"
slug: "solibri-model-checker-ifc-import-ruleset-clash-detection-workflow"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-07-08"
sources:
  - "https://help.solibri.com/hc/en-us/articles/1500004511561-Part-1-Creating-a-Ruleset-with-Rules"
  - "https://www.solibri.com/articles/bim-clash-detection-unveiled-a-step-by-step-approach"
---

# Solibri Model Checker: IFC Model Import, Ruleset Configuration, and Clash Detection Workflow

Solibri is the most powerful BIM model checker I've used. But power comes with complexity. I've seen coordinators open Solibri, click "Check Model," and get 5,000 clashes — most of which are false positives. Without proper ruleset configuration, Solibri creates noise instead of signal. Here's how to set it up for effective BIM coordination.

## Understanding Solibri's Approach

Solibri doesn't just detect geometric clashes — it runs **rules-based checks** against the model. Rules can check:

- **Clash detection** — geometric intersections between components
- **Clearance checks** — minimum distances between elements
- **Data validation** — required properties and classifications
- **Model completeness** — required elements present per discipline
- **Code compliance** — building code and accessibility checks

This is fundamentally different from Navisworks, which only does geometric clash detection. Solibri's ruleset system allows for much more sophisticated checking.

## Step 1: Import IFC Models

Solibri works with IFC files. Each discipline exports their model to IFC from Revit, Archicad, or their BIM tool.

1. Go to **File** → **Open** → select IFC files.
2. Or drag and drop IFC files into the Solibri window.
3. Solibri loads each model and displays it in the 3D view.

### IFC Import Best Practices

- **Use IFC 2x3 or IFC 4** — these are the most widely supported versions
- **Configure IFC export settings in Revit** — use the Solibri IFC export template if available
- **Set model disciplines** — when importing, Solibri asks you to confirm the discipline of each model (Architecture, Structural, MEP). This is critical for ruleset filtering.
- **Check model coordinates** — all models must share the same coordinate system. If models are offset, clashes will be wrong.

### Handling Large IFC Files

Large projects can produce IFC files of 500 MB or more. Solibri can handle large files, but import takes time.

- **Split models by building or level** — don't import a 2 GB IFC file if you can split it
- **Use IFC compression** — some BIM tools support compressed IFC (IFC.zip)
- **Close unused models** — if you're only checking Level 3, close other levels

## Step 2: Select a Role

Before running any checks, select a role. Roles preload rulesets, classifications, and information takeoff settings.

1. Go to **File** → **Roles** → select a role.
2. For BIM coordination, select **BIM Coordination**.
3. This loads:
   - Coordination rulesets (clash detection, clearance checks)
   - Classification system (IFC entity mapping)
   - Default checking rules

### Available Roles

- **BIM Coordination** — clash detection and coordination checks (most common)
- **Design Coordination** — design review and quality checks
- **Energy Analysis** — energy performance checks
- **Cost Estimation** — quantity takeoff and cost analysis
- **Accessibility** — accessibility and ADA compliance checks

## Step 3: Configure Rulesets

Rulesets are collections of rules. Solibri ships with default rulesets, but you'll need to customize them for your project.

1. Go to **File** → **Ruleset Manager**.
2. The Ruleset Manager shows:
   - **Ruleset Folders** — organized library of rulesets
   - **Libraries** — rule templates (General Intersection, Clash Detection Matrix, etc.)
   - **Workspace** — rulesets currently open in Solibri

### Creating a Custom Ruleset

1. In the Ruleset Folders view, right-click **Rulesets Open in Solibri** → **New Ruleset**.
2. Name it (e.g., "Project Coordination Checks").
3. Drag rule templates from Libraries into your ruleset.
4. Configure each rule's parameters.

### Essential Rules for BIM Coordination

1. **General Intersection Rule** — detects geometric clashes between two component groups
2. **Clash Detection Matrix** — matrix-based clash detection between discipline pairs
3. **Clearance Check** — verifies minimum clearance around elements (e.g., 100mm around ducts)
4. **Duplicate Component Check** — detects duplicate elements in the same location
5. **Missing Component Check** — verifies required elements are present per discipline

## Step 4: Configure the Clash Detection Matrix

The Clash Detection Matrix is Solibri's most powerful clash detection tool. Instead of defining individual clash rules, you define a matrix of which discipline pairs should be checked.

1. In the Ruleset Manager, add a **Clash Detection Matrix** rule.
2. Choose matrix creation method:
   - **Default Matrix** — automatically creates a matrix with common discipline pairs
   - **Custom Matrix** — manually define which hierarchies to check
   - **Import from Excel** — import a pre-defined matrix from Excel
3. Configure the matrix:
   - Rows and columns represent discipline/component groups
   - Each cell defines whether clashes are checked (G = general tolerance, custom = specific tolerance)
   - Empty cells = no clash check for that pair
4. Set tolerances:
   - **General tolerance** — default for all pairs (typically 5mm)
   - **Custom tolerances** — specific pairs can have different tolerances

### Matrix Configuration Tips

- **Exclude spaces and openings** — these are non-physical elements that shouldn't clash
- **Check for duplicates** — enable duplicate detection in the matrix
- **Use Excel for complex matrices** — export the default matrix, modify in Excel, re-import
- **Link to Excel** — you can link the matrix to an Excel file for easy editing

## Step 5: Run the Check

1. Go to the **Checking** layout.
2. Verify your rulesets are loaded.
3. Click **Check Model**.
4. Solibri processes all rules and displays results in the **Results** view.

### Understanding Results

Results are organized by rule. Each rule shows:
- **Issue count** — how many issues were found
- **Severity** — Critical, Major, Minor (configurable per rule)
- **Issue details** — which components are involved, their properties, and the clash geometry

### Triage Process

1. **Start with formal checks** — verify model completeness before running clash detection
2. **Review quality checks** — check each discipline's internal consistency
3. **Run coordination checks** — clash detection between disciplines
4. **Filter false positives** — mark intentional clashes as "Approved"
5. **Sort by severity** — address critical clashes first

## Step 6: Create and Manage Issues

When you find a real issue, create a Solibri issue:

1. Select the issue in the Results view.
2. Right-click → **Create Issue** (or it may be created automatically depending on rule settings).
3. Fill in:
   - **Title** — clear description of the problem
   - **Description** — detailed explanation
   - **Assigned To** — responsible person
   - **Priority** — Critical, High, Medium, Low
   - **Type** — Clash, Design Error, Missing Element, etc.
4. The issue includes a **viewpoint** — a saved camera position showing the problem.

### Issue Workflow

1. **Active** — issue is open, needs resolution
2. **Resolved** — fix has been implemented in the model
3. **Closed** — resolution verified by the coordinator
4. **Approved** — intentional clash, no action needed

## Step 7: Export BCF Issues

BCF (BIM Collaboration Format) is the standard for sharing issues between BIM tools.

1. Select the issues to export.
2. Go to **File** → **Export** → **BCF**.
3. Choose BCF 2.1 format.
4. The BCF file can be imported into:
   - Revit (via BIMcollab or native BCF support in 2024+)
   - Navisworks (native BCF support)
   - Archicad (native BCF support)
   - BIMcollab Zoom (native BCF support)

### BCF Workflow with Revit

1. Export BCF from Solibri.
2. In Revit, use BIMcollab BCF Manager or Revit's native BCF support.
3. Import the BCF file.
4. Issues appear as viewpoints in the Revit model.
5. The resolver fixes the issue in Revit.
6. Update issue status in the BCF manager.
7. Export updated BCF and re-import to Solibri, or use BIMcollab for live sync.

## Step 8: Generate Reports

Solibri can generate detailed coordination reports:

1. Go to **Report** → **New Report**.
2. Choose report type:
   - **Clash Report** — list of all clashes with details and viewpoints
   - **Issue Report** — list of all open issues with assignees and priorities
   - **Model Check Report** — summary of all rule checks and results
3. Configure report content and layout.
4. Export as PDF, HTML, or PowerPoint.

### Report Best Practices

- **Generate weekly** — distribute before the coordination meeting
- **Include viewpoints** — screenshots help team members understand issues
- **Filter by status** — only show Active issues, not Closed ones
- **Group by discipline** — make it easy for each team to find their issues
- **Track trends** — show clash count over time to demonstrate progress

## Best Practices

- **Configure IFC export settings in Revit carefully** — poor IFC exports produce poor Solibri results
- **Start with formal checks** — verify model completeness before clash detection
- **Customize rulesets per project** — don't rely solely on defaults
- **Use the Clash Detection Matrix** — it's more efficient than individual clash rules
- **Run checks weekly** — don't wait until the end of design
- **Train the team on BCF** — issues are useless if the team can't access them
- **Archive check results** — keep a record of checks for audit and dispute resolution
