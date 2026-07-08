---
title: "ACC Model Coordination: Clash Detection Setup and BCF Issue Workflow"
excerpt: "How to configure Autodesk Construction Cloud Model Coordination for automated clash detection — covering model federation, clash test setup, issue creation, BCF export, and tracking resolution status across disciplines."
category: "workflow"
softwareSlug: "autodesk-construction-cloud"
keyword: "autodesk construction cloud model coordination clash detection bcf"
slug: "autodesk-construction-cloud-model-coordination-clash-detection-bcf"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/bim-360-support-forum/bim360-best-practice-setups/td-p/10806318"
  - "https://forums.autodesk.com/t5/bim-360-support-forum/central-model-cloud-workflow/td-p/9105361"
---

# ACC Model Coordination: Clash Detection Setup and BCF Issue Workflow

Model Coordination in ACC is where BIM coordination actually happens. I've run weekly coordination meetings using ACC for years, and the difference between a well-configured Model Coordination setup and a bad one is night and day. A good setup catches clashes early, tracks them to resolution, and keeps everyone accountable. A bad setup creates noise — thousands of false positives that nobody acts on.

## Understanding ACC Model Coordination

Model Coordination is ACC's module for:
- **Federating models** — combining discipline models into a single coordinated view
- **Clash detection** — automated and manual clash testing between models
- **Issue management** — creating, assigning, and tracking issues (BCF format)
- **Model comparison** — comparing model versions to track changes

It replaces Navisworks for cloud-based coordination, though many teams still use Navisworks alongside ACC.

## Step 1: Federate Models

Before running clash detection, you need to federate (combine) the discipline models.

1. Go to **Model Coordination** module in ACC.
2. Click **Add Models** → select models from the ACC Docs folder.
3. Models must be in NWD, NWC, IFC, or RVT format.
4. Arrange models in the **Model Tree**:
   - Group by discipline (Architecture, Structural, MEP)
   - Set model visibility and overrides
5. Save the federation as a **Model Set** for reuse.

### Model Federation Best Practices

- **Use published models** — not working copies. Published models are the latest approved version.
- **Set model origins** — all models must share the same coordinate system. Revit models published from ACC automatically share coordinates.
- **Name models clearly** — include discipline and version (e.g., `Architecture_v03.nwd`)
- **Limit federation size** — if the federation is too large, split by building area or level

## Step 2: Configure Clash Tests

Clash tests are the rules that determine what clashes to detect.

1. In Model Coordination, go to **Clash Detection** → **New Clash Test**.
2. Configure:
   - **Test Name**: e.g., `Structural vs MEP`
   - **Model A**: Select one discipline's model (e.g., Structural)
   - **Model B**: Select another discipline's model (e.g., MEP)
   - **Tolerance**: Set clash tolerance (typically 5mm for hard clashes)
   - **Ignore Type**: Choose what to ignore (e.g., spaces, openings)

### Essential Clash Tests

Set up these standard clash tests for every project:

1. **Structural vs MEP** — the most critical test. Ducts and pipes through beams.
2. **Architecture vs Structural** — walls, doors, and openings vs structural elements.
3. **MEP vs MEP** — mechanical vs electrical vs plumbing interferences.
4. **Architecture vs MEP** — ceiling clearances, wall penetrations.
5. **Site vs Underground** —site elements vs underground utilities.

### Advanced Clash Test Settings

- **Composite clash tests** — test multiple model pairs in one test
- **Rule-based exclusions** — exclude specific element categories (e.g., don't clash structural columns with architectural finishes)
- **Clearance clashes** — detect elements that are too close even if they don't physically intersect (e.g., 50mm clearance around ducts)

## Step 3: Run Clash Detection

1. Select the clash tests to run.
2. Click **Run Clash Detection**.
3. ACC processes the tests in the cloud — no local processing needed.
4. Results appear in the **Clash Results** panel.

### Understanding Clash Results

Each clash result includes:
- **Clash ID** — unique identifier
- **Element A** — the first element involved (with model, category, and ID)
- **Element B** — the second element involved
- **Location** — coordinates of the clash
- **Status** — New, Active, Resolved, Closed
- **Assigned To** — who is responsible for resolving

### Triage Process

1. **Sort by severity** — structural clashes are higher priority than cosmetic ones
2. **Filter false positives** — some clashes are intentional (e.g., pipe through floor slab)
3. **Group by location** — resolve clashes area by area, not randomly
4. **Assign to the responsible discipline** — each clash should have an owner

## Step 4: Create and Manage Issues

When you identify a clash that needs resolution, create an issue:

1. Select the clash in the Clash Results panel.
2. Click **Create Issue**.
3. Fill in the issue details:
   - **Title**: Clear description (e.g., "Duct conflicts with beam B-12 at Level 3")
   - **Type**: Clash, Design Review, RFI
   - **Assigned To**: The person responsible for resolving
   - **Priority**: High, Medium, Low
   - **Due Date**: When resolution is expected
   - **Comments**: Detailed description with screenshots
4. The issue is created in BCF (BIM Collaboration Format) and can be viewed in Revit, Navisworks, or other BCF-compatible tools.

### Issue Status Workflow

1. **New** — just created, not yet reviewed
2. **Active** — acknowledged, being worked on
3. **In Progress** — resolution is being implemented
4. **Resolved** — fix has been applied in the model
5. **Closed** — resolution verified by the coordinator

### Issue Management Tips

- **Don't create issues for false positives** — mark them as "Ignored" instead
- **Assign one person per issue** — shared responsibility means no responsibility
- **Set realistic due dates** — typically 1 week for resolution, 2 weeks for verification
- **Add screenshots** — visual context helps the resolver understand the issue
- **Use batch operations** — select multiple clashes and create issues in bulk

## Step 5: Export and Share BCF Issues

BCF (BIM Collaboration Format) is the industry standard for sharing coordination issues.

1. In Model Coordination, select the issues to export.
2. Click **Export BCF**.
3. Choose export format: BCF 2.1 (recommended) or BCF 1.0.
4. The BCF file can be imported into:
   - Revit (via BIMcollab or BCFier plugins)
   - Navisworks (native BCF support)
   - Solibri (native BCF support)
   - Archicad (native BCF support)

### BCF Workflow with Revit

1. Export BCF from ACC Model Coordination.
2. In Revit, use a BCF manager plugin (BIMcollab, BCFier, or Revit's native BCF support in 2024+).
3. Import the BCF file.
4. Each issue appears as a viewpoint in the Revit model.
5. The resolver fixes the issue in Revit.
6. Update the issue status in the BCF manager.
7. Sync the BCF file back to ACC or close the issue in ACC directly.

## Step 6: Track and Report

Weekly coordination meetings need data. ACC provides built-in reporting:

1. Go to **Model Coordination** → **Dashboard**.
2. View metrics:
   - **Total clashes by test** — trend over time
   - **Open issues by discipline** — who has the most unresolved issues
   - **Issue resolution time** — average time from creation to closure
   - **Clash density by area** — where are the most clashes concentrated

### Weekly Coordination Meeting Workflow

1. **Before the meeting**: Run clash detection on the latest published models.
2. **During the meeting**: Review new clashes, discuss open issues, assign actions.
3. **After the meeting**: Update issue statuses, export BCF for team members, publish meeting notes.

## Common Issues and Fixes

### Models Not Appearing in Model Coordination

Models must be published to ACC Docs first. If a model doesn't appear in Model Coordination:
1. Check that the model is in the ACC Docs folder (not just on someone's local drive).
2. Verify the model format is supported (NWD, NWC, IFC, RVT).
3. Ensure the user has Model Coordination access in ACC permissions.

### Clash Detection Returns Zero Results

Either the models don't overlap spatially, or the tolerance is set too low. Check:
1. Model coordinates — all models must share the same origin.
2. Tolerance setting — increase to 10mm and re-run.
3. Model content — ensure the models actually contain 3D geometry, not just 2D elements.

### Issues Not Syncing with Revit

BCF file format mismatch. Ensure you're using BCF 2.1 format. If using a plugin, ensure it supports BCF 2.1.

## Best Practices

- **Run clash detection weekly** — don't wait until the end of design
- **Publish models before running clashes** — clash detection uses published versions
- **Triage before creating issues** — filter false positives to avoid issue overload
- **Track resolution time** — identify teams that consistently lag on resolution
- **Archive resolved issues** — keep a record for post-construction disputes
- **Integrate with the BIM Execution Plan** — define clash detection frequency, tolerance, and resolution SLAs in the BEP
