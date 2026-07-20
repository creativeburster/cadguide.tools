---
title: "Navisworks Clash Detection: Setup, Rules, Batch Testing, and BCF Issue Management"
excerpt: "A complete guide to clash detection in Autodesk Navisworks covering model aggregation, clash rule configuration, batch clash testing, grouping and resolving clashes, and BCF export for multi-discipline coordination."
category: "workflow"
softwareSlug: "navisworks"
keyword: "navisworks clash detection"
slug: "navisworks-clash-detection-setup-rules-batch-testing-bcf-management"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://help.autodesk.com/view/NAV/2024/ENU/"
  - "https://www.autodesk.com/products/navisworks/overview"
---

# Navisworks Clash Detection: Setup, Rules, Batch Testing, and BCF Issue Management

Navisworks is Autodesk's project review and clash detection platform. It aggregates models from multiple BIM and CAD tools (Revit, AutoCAD, ArchiCAD, Tekla, Allplan, MicroStation) into a single coordination environment. Clash detection is its most widely used feature — this guide covers the complete workflow from model aggregation to BCF issue management.

## Model Aggregation

### Appending Models

1. Home > Append > select model files
2. Supported formats:
   - **NWD**: Navisworks native (cached)
   - **NWC**: Navisworks cache (from any CAD export)
   - **RVT**: Revit (direct read)
   - **DWG**: AutoCAD
   - **IFC**: IFC 2x3 or IFC 4
   - **DGN**: MicroStation
   - **SKP**: SketchUp
   - **FBX**: Autodesk FBX
3. Append each discipline model:
   - Architectural (Revit or ArchiCAD IFC)
   - Structural (Revit or Tekla IFC)
   - MEP (Revit MEP or AutoCAD MEP)
   - Civil (Civil 3D)

### File Sender (NWC Export)

For best performance, export models to NWC format from the source application:

1. In Revit: Add-Ins > Navisworks > Export to NWC
2. In AutoCAD: Navisworks ribbon > Export to NWC
3. NWC files are compressed and load faster than native formats
4. Set up automatic NWC export on file save for regular updates

### Model Organization

1. In Navisworks, use the Selection Tree to verify model structure
2. Each appended model appears as a top-level node
3. Expand to see discipline breakdown (walls, slabs, pipes, ducts)
4. Use Selection Sets to group elements by:
   - **Discipline**: Architectural, Structural, MEP
   - **Floor**: Level 1, Level 2, etc.
   - **System**: HVAC, Plumbing, Electrical, Fire Protection

## Clash Detection Setup

### Opening Clash Detective

1. Home > Clash Detective
2. The Clash Detective panel opens

### Configuring Clash Tests

1. Click "Add Test" to create a new clash test
2. Name the test (e.g., "Structural vs MEP")
3. Set Selection A:
   - Click "Select A" > choose from Selection Sets or Selection Tree
   - Example: All Structural elements
4. Set Selection B:
   - Click "Select B" > choose from Selection Sets or Selection Tree
   - Example: All MEP elements
5. Set clash type:
   - **Hard clash**: Physical intersection (elements occupy same space)
   - **Hard (Conservative)**: Conservative intersection (includes touching faces)
   - **Clearance clash**: Elements within a specified distance
   - **Duplicate clash**: Identical elements in same location

### Clearance Distance

For clearance clashes:
1. Set clearance value (e.g., 50mm for MEP, 100mm for structural)
2. Navisworks flags any elements closer than this distance
3. Use clearance for:
   - Pipe insulation clearance
   - Duct access space
   - Structural deflection allowance
   - Code-required clearances

### Tolerance

Set the geometric tolerance:
- **0mm**: Exact intersection only
- **1-5mm**: Standard tolerance (accounts for modeling imprecision)
- **10mm+**: Loose tolerance (may produce false positives)

**Recommendation**: Use 1-5mm for most tests.

## Clash Rules

### Configuring Rules

1. In Clash Detective, click "Rules"
2. Rules filter which clashes are reported
3. Common rules:

#### Ignore Rules (Suppress False Positives)

- **Ignore items in same layer**: Don't clash elements on the same layer
- **Ignore items in same group**: Don't clash elements in the same group
- **Ignore items in same file**: Don't clash elements from the same model file
- **Ignore concrete on concrete**: Suppress clashes between structural concrete elements
- **Ignore rebar in concrete**: Suppress clashes between rebar and its host concrete

#### Composite Rules

- **Composite object detection**: Treat multi-part objects as single entity
- **Sub-entity exclusion**: Exclude specific sub-entities from clash testing

### Rule Priority

Rules are applied in order. If a clash is suppressed by any rule, it is not reported. Arrange rules from most specific to most general.

## Running Clash Tests

### Single Test

1. Select the test in the Clash Detective
2. Click "Run Check"
3. Navisworks processes the test
4. Results appear in the Results tab

### Batch Testing

1. Click "Run All" to run all configured tests
2. Navisworks processes each test sequentially
3. Progress is shown in the status bar
4. For large projects, batch testing can take 10-60 minutes

### Scheduled Clash Detection

1. Use Navisworks Automation (batch processing):
   - Create a batch script (.bat) that opens Navisworks, appends models, runs clashes, and exports results
   - Schedule via Windows Task Scheduler (e.g., nightly at 2 AM)
   - Results are ready for the morning coordination meeting

## Reviewing Clash Results

### Results Display

1. Click on a clash result in the Results tab
2. Navisworks zooms to the clash location
3. The clashing elements are highlighted:
   - **Selection A element**: Red
   - **Selection B element**: Blue
4. Use the orbit, pan, and zoom tools to inspect the clash from all angles

### Clash Status

Each clash has a status:
- **New**: Not yet reviewed
- **Active**: Reviewed and confirmed as a real clash
- **Reviewed**: Reviewed but not yet resolved
- **Resolved**: Resolved in the source model (auto-detected on next test run)
- **Approved**: Intentional clash (accepted by the team)

### Grouping Clashes

1. Select multiple clashes in the Results tab
2. Right-click > Group
3. Group clashes by:
   - **Location**: Clashes in the same area
   - **System**: Clashes involving the same MEP system
   - **Type**: Same type of clash (e.g., duct vs beam)
4. Grouping simplifies resolution — resolve one clash, and related clashes may also be resolved

### Assigning Clashes

1. Select a clash
2. Set "Assigned To" — the person responsible for resolving
3. Add a comment describing the issue
4. Set a due date for resolution

## BCF Export and Import

### Exporting BCF

1. In Clash Detective, select clashes to export
2. Click "Export BCF"
3. BCF (BIM Collaboration Format) includes:
   - Clash location (coordinates)
   - Involved element IDs
   - Clash status and comments
   - Viewpoint (camera position and angle)
4. Save as `.bcf` or `.bcfzip`

### Importing BCF in Revit

1. In Revit: Add-Ins > BIM Track or BCF Manager
2. Import the BCF file
3. Clash markers appear in the Revit model
4. Resolve each clash by modifying the model
5. Update the BCF status to "Resolved"

### Importing BCF in ArchiCAD

1. In ArchiCAD: File > Open > BCF
2. Clash markers appear as issues in the Issue Manager
3. Resolve and update status

### BCF Round-Trip

1. Export BCF from Navisworks
2. Import in source BIM tool (Revit, ArchiCAD, Allplan)
3. Resolve clashes in the source model
4. Update BCF status to "Resolved"
5. Export updated BCF from the source tool
6. Import back into Navisworks
7. Navisworks verifies resolution against the updated model

## Clash Report Generation

### HTML Report

1. Clash Detective > Report
2. Set format: HTML
3. Configure report contents:
   - Summary statistics (total clashes, by status)
   - Clash list with images
   - Clash location coordinates
   - Assigned person and due date
4. Generate report
5. Distribute via email or project portal

### PDF Report

1. Clash Detective > Report > PDF
2. Same content as HTML but in PDF format
3. Suitable for formal coordination meeting minutes

### CSV Export

1. Clash Detective > Report > CSV
2. Export clash data for spreadsheet analysis
3. Track clash count trends over time (weekly clash burn-down chart)

## Best Practices

1. **Use NWC files** — faster loading and more reliable than native formats
2. **Create Selection Sets before testing** — saves time when configuring tests
3. **Configure rules before first test** — reduces false positives
4. **Group clashes by location** — resolve area by area, not clash by clash
5. **Use BCF for communication** — don't track clashes in email or spreadsheets
6. **Run clashes weekly** — catch issues early when they're cheap to fix
7. **Track clash trends** — show weekly clash count to demonstrate progress
8. **Assign clashes to specific people** — accountability drives resolution
9. **Use scheduled batch testing** — automate the process for consistency
10. **Archive clash results** — keep historical records for dispute resolution

## Conclusion

Navisworks clash detection is the industry standard for BIM coordination. The workflow — aggregate models, configure tests with rules, run batch testing, review and group results, export BCF for resolution, and generate reports — covers the complete coordination process. By using NWC files for performance, Selection Sets for efficiency, rules to reduce false positives, and BCF for communication with source BIM tools, you can manage clash resolution across multi-discipline teams effectively. Regular weekly clash detection, combined with trend tracking, ensures that coordination issues are identified and resolved early in the design process.
