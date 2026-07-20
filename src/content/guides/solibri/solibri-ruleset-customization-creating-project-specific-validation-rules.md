---
title: "Solibri Ruleset Customization: Creating Project-Specific BIM Validation Rules"
excerpt: "How to create custom Solibri rulesets for project-specific BIM requirements — covering rule templates, filter parameters, tolerance settings, component classification, and deploying rulesets across project teams."
category: "workflow"
softwareSlug: "solibri"
keyword: "solibri ruleset customization creating project specific validation rules"
slug: "solibri-ruleset-customization-creating-project-specific-validation-rules"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-07-08"
sources:
  - "https://help.solibri.com/hc/en-us/articles/1500004511561-Part-1-Creating-a-Ruleset-with-Rules"
  - "https://help.solibri.com/hc/en-us/articles/23765423193111-245-Clash-Detection-Matrix"
---

# Solibri Ruleset Customization: Creating Project-Specific BIM Validation Rules

Default Solibri rulesets catch common issues, but every project has unique requirements. I've built custom rulesets for hospitals (door clearance checks), data centers (cable routing clearance), and residential projects (minimum room sizes). Custom rulesets are what separate basic clash detection from real BIM quality management. Here's how to build them.

## Understanding Rule Structure in Solibri

Every Solibri rule has three components:

1. **Rule Template** — the base logic (General Intersection, Clearance Check, Property Check, etc.)
2. **Filter Parameters** — which components the rule applies to (by discipline, IFC class, property)
3. **Tolerance/Threshold** — the acceptable value (clash tolerance, minimum clearance, required property value)

Understanding how these three interact is the key to creating effective custom rules.

## Step 1: Open the Ruleset Manager

1. Go to **File** → **Ruleset Manager**.
2. The Ruleset Manager has three main areas:
   - **Ruleset Folders** (left) — organized library of all rulesets
   - **Libraries** (center) — available rule templates
   - **Workspace** (right) — rulesets currently loaded in Solibri

3. To create a new ruleset:
   - Right-click **Rulesets Open in Solibri** → **New Ruleset**
   - Give it a descriptive name (e.g., "Hospital Coordination Checks v2")

## Step 2: Choose the Right Rule Template

Solibri provides these primary rule templates:

### Geometry-Based Rules

- **General Intersection Rule** — detects geometric intersections between two component groups
- **Clash Detection Matrix** — matrix-based clash detection between multiple discipline pairs
- **Clearance Rule** — checks minimum distance between components
- **Space Containment Rule** — verifies which components are inside which spaces
- **Building Footprint Rule** — checks model fits within building footprint

### Data-Based Rules

- **Property Check Rule** — verifies specific properties exist and meet requirements
- **Classification Check Rule** — verifies components are correctly classified
- **Model Structure Rule** — checks model hierarchy and organization
- **Missing Component Rule** — verifies required elements are present

### Composite Rules

- **Predefined Rule Set** — combines multiple rules into a single check
- **Parametric Rule** — rules with configurable parameters

## Step 3: Configure Filter Parameters

Filters determine which components the rule checks. This is where most customization happens.

### Filter by Discipline

Set Component 1 and Component 2 filters by discipline:

1. Click the filter cell next to Component 1.
2. Select **Discipline** → choose from the list (Architecture, Structural, MEP, etc.).
3. Repeat for Component 2.

Example: For an MEP vs Structural clash rule:
- Component 1: Discipline = MEP
- Component 2: Discipline = Structural

### Filter by IFC Class

Filter by specific IFC entity types:

1. Click the filter cell.
2. Select **IFC Entity** → choose from the list.
3. Common IFC classes:
   - `IfcWall` — walls
   - `IfcBeam` — beams
   - `IfcColumn` — columns
   - `IfcDuctSegment` — duct segments
   - `IfcPipeSegment` — pipe segments
   - `IfcSlab` — slabs/floors

### Filter by Property

Filter by specific property values:

1. Click the filter cell.
2. Select **Property** → choose the property (e.g., `Pset_WallCommon.IsExternal`).
3. Set the value condition (equals, contains, greater than, etc.).

Example: Only check external walls for clearance:
- Component 1: IFC Class = IfcWall, Property `IsExternal` = TRUE
- Component 2: IFC Class = IfcDuctSegment

### Combining Filters

Filters can be combined with AND/OR logic:
- **AND** — all conditions must be true (component must meet all criteria)
- **OR** — any condition can be true (component meets any of the criteria)
- **NOT** — exclude components that match

Use multiple rows in the filter to create complex conditions. Each row is AND-combined by default; use the OR option within a row for alternatives.

## Step 4: Set Tolerances and Thresholds

Tolerances define what constitutes a violation.

### Clash Tolerance

For General Intersection rules:
- **Horizontal tolerance** — typically 0mm for hard clashes, 5mm for soft clashes
- **Vertical tolerance** — same as horizontal
- **Volume tolerance** — minimum intersection volume to report (filters out tiny edge contacts)

### Clearance Tolerance

For Clearance rules:
- **Minimum distance** — the required clearance (e.g., 100mm around ducts, 50mm around pipes)
- **Direction** — clearance can be checked in all directions or specific axes

### Property Thresholds

For Property Check rules:
- **Required value** — the value that must be present (e.g., fire rating must be "2HR")
- **Missing property behavior** — whether a missing property is a violation or just a warning

## Step 5: Create Project-Specific Rules

Here are examples of custom rules I've created for real projects:

### Rule: Door Clearance Check (Hospital Project)

**Purpose**: Verify that doors have minimum 1200mm clearance on both sides for stretcher access.

- **Rule Template**: Clearance Rule
- **Component 1**: IFC Class = IfcDoor
- **Component 2**: IFC Class = IfcWall (excluding the wall the door is in)
- **Tolerance**: 1200mm minimum clearance
- **Result**: Any door with less than 1200mm clearance is flagged

### Rule: Pipe Slope Check (Plumbing Project)

**Purpose**: Verify drainage pipes have minimum 1% slope.

- **Rule Template**: Property Check Rule
- **Component 1**: IFC Class = IfcPipeSegment, Property `Slope` >= 1%
- **Result**: Any pipe segment with slope less than 1% is flagged

### Rule: Fire Rating Check (Commercial Building)

**Purpose**: Verify fire-rated walls have the correct fire rating property.

- **Rule Template**: Property Check Rule
- **Component 1**: IFC Class = IfcWall, Property `IsExternal` = FALSE
- **Required Property**: `FireRating` must exist and be non-empty
- **Result**: Any interior wall without a fire rating property is flagged

### Rule: Duct Clearance Check (Data Center)

**Purpose**: Verify 300mm clearance around all ducts for maintenance access.

- **Rule Template**: Clearance Rule
- **Component 1**: IFC Class = IfcDuctSegment
- **Component 2**: All structural and architectural components
- **Tolerance**: 300mm minimum clearance
- **Result**: Any duct with less than 300mm clearance is flagged

## Step 6: Organize Rulesets

Group related rules into rulesets for organization:

1. Create ruleset folders:
   - `Formal Checks` — model completeness and structure
   - `Quality Checks` — discipline-specific internal checks
   - `Coordination Checks` — cross-discipline clash detection
   - `Code Compliance` — building code and accessibility checks
2. Drag rules into the appropriate folder.
3. Order rules by priority — formal checks first, then quality, then coordination.

## Step 7: Deploy Rulesets to Project Teams

Custom rulesets need to be shared with all Solibri users on the project.

1. Export the ruleset:
   - Right-click the ruleset → **Export**
   - Save as `.ruleset` file
2. Distribute to team members:
   - Upload to ACC Docs or project shared folder
   - Team members import via **File** → **Ruleset Manager** → **Import**
3. Version control:
   - Use naming conventions (e.g., `CoordinationChecks_v2.1.ruleset`)
   - Document changes between versions
   - Ensure all team members use the same version

### Ruleset Deployment Best Practices

- **One source of truth** — the BIM Manager maintains the master ruleset
- **Version control** — track changes and communicate updates
- **Test before deployment** — run new rulesets on a test model before deploying
- **Document each rule** — create a ruleset guide explaining what each rule checks and why
- **Review quarterly** — update rulesets as project requirements evolve

## Step 8: Iterate and Refine

Rulesets are never perfect on the first pass. After running checks:

1. **Review false positives** — rules that flag too many non-issues need tighter filters
2. **Review false negatives** — issues that should have been caught but weren't need adjusted tolerances
3. **Adjust thresholds** — if a rule produces 500 issues, the tolerance may be too strict
4. **Add exclusions** — some components should be excluded from specific checks
5. **Re-run and verify** — after changes, re-run to confirm the ruleset produces actionable results

## Best Practices

- **Start with defaults** — customize the default rulesets rather than starting from scratch
- **Test on real models** — don't build rulesets in isolation; test against actual project IFC files
- **Document the ruleset** — create a guide that explains each rule, its purpose, and expected results
- **Share with the team** — ensure all Solibri users have the same rulesets
- **Review after each coordination cycle** — refine rulesets based on what worked and what didn't
- **Use the Clash Detection Matrix for standard clash checks** — it's more efficient than individual intersection rules
