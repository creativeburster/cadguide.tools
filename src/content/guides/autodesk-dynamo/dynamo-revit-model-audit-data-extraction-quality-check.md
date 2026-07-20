---
title: "Dynamo Data Extraction and Model Auditing: Checking Revit BIM Quality Automatically"
excerpt: "Use Dynamo to audit Revit models: extract element data, check parameter compliance, detect clashes, verify naming conventions, and export quality reports to Excel automatically."
category: "workflow"
softwareSlug: "autodesk-dynamo"
keyword: "dynamo revit model audit data extraction quality check"
slug: "dynamo-revit-model-audit-data-extraction-quality-check"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://dynamobim.org/"
  - "https://archilabs.ai/posts/getting-started-with-dynamo"
---

# Dynamo Data Extraction and Model Auditing: Checking Revit BIM Quality Automatically

Model auditing is one of the most valuable uses of Dynamo. Instead of manually checking hundreds of elements for compliance, you can create a Dynamo script that automatically verifies naming conventions, parameter values, element placement, and model standards. We'll show you how to build auditing scripts that save hours of manual review.

## Why Automate Model Auditing?

Manual model checking is:
- **Time-consuming** — reviewing every element takes hours
- **Error-prone** — human reviewers miss things
- **Inconsistent** — different reviewers apply standards differently
- **Non-repeatable** — must redo for every project milestone

Dynamo auditing is:
- **Fast** — checks thousands of elements in seconds
- **Consistent** — applies the same rules every time
- **Repeatable** — run the same script on every project
- **Documented** — results export to Excel for records

## Building a Model Audit Script

### Step 1: Select Elements to Audit

Start by selecting the elements you want to check:

1. **Revit > Selection > All Elements of Category** — select all elements of a specific category (Walls, Doors, Windows, etc.)
2. **Revit > Selection > All Elements at Level** — select elements on a specific level
3. **Revit > Selection > Elements in View** — select elements visible in the current view

For a comprehensive audit, select all elements of all major categories:
- Walls
- Doors
- Windows
- Floors
- Roofs
- Ceilings
- Columns
- Beams

### Step 2: Extract Parameter Values

For each element, extract the parameters you want to check:

1. **Revit > Elements > Element.GetParameterValueByName** — gets a specific parameter value
2. Connect the elements list to the element input
3. Type the parameter name (e.g., "Mark", "Type Name", "Level")

Example: Extract the Mark parameter from all walls:

```
[All Elements of Category: Walls] → [Element.GetParameterValueByName: "Mark"] → [List of Mark values]
```

### Step 3: Define Compliance Rules

Create logic to check if each element complies with your standards:

#### Rule 1: Non-Empty Mark Parameter

Check that every element has a non-empty Mark value:

1. **Core > Input > String** — create an empty string ""
2. **Core > Logic > String ==** — compare each Mark value to empty string
3. **Core > Logic > Not** — invert the result (True = has a Mark, False = empty)
4. **Core > List > List.FilterByBoolMask** — separate compliant from non-compliant elements

#### Rule 2: Mark Format Compliance

Check that Mark values follow a naming convention (e.g., "W-001", "D-001"):

1. Extract the first 2 characters of each Mark value using **String.Substring**
2. Compare against expected prefixes using **String ==**
3. Filter elements that don't match

#### Rule 3: Parameter Range Check

Check that a numeric parameter is within an acceptable range:

1. Extract the parameter value (e.g., door width)
2. **Core > Math > Greater Than** — compare against minimum
3. **Core > Math > Less Than** — compare against maximum
4. **Core > Logic > And** — combine both conditions
5. Filter non-compliant elements

### Step 4: Collect Results

Combine all audit results into a structured report:

1. **Core > List > List.Create** — combine element IDs, parameter values, and compliance status
2. **Core > List > List.Transpose** — organize data into rows (one per element)
3. **Office.Excel.WriteToFile** — export to Excel

### Step 5: Highlight Non-Compliant Elements

Instead of (or in addition to) exporting to Excel, you can highlight non-compliant elements in Revit:

1. Filter non-compliant elements
2. **Revit > Elements > Element.OverrideInView** — apply a red color override to non-compliant elements
3. Run the script before a model review to visually identify issues

## Common Audit Checks

### Door Width Accessibility Check

Verify all doors meet minimum width for accessibility:

1. Select all doors
2. Extract the Width parameter
3. Check if Width >= 800mm (or your local standard)
4. Report doors that are too narrow

### Wall Height Consistency

Check that walls on the same level have consistent heights:

1. Select all walls by level
2. Extract the Unconnected Height parameter
3. Compare against the expected height for that level
4. Report walls with incorrect heights

### Room Enclosure Check

Verify all rooms are properly enclosed:

1. Select all rooms
2. Extract the Area parameter
3. Check if Area > 0 (rooms with 0 area are not enclosed)
4. Report unenclosed rooms

### Element Naming Convention

Check that element names follow office standards:

1. Select all elements of a category
2. Extract the Mark or Type Name parameter
3. Verify against a naming pattern (regex or prefix check)
4. Report non-compliant elements

### Missing Parameters

Check that required parameters are filled:

1. Select all elements
2. Extract each required parameter
3. Check for null or empty values
4. Report elements with missing data

## Exporting Audit Results to Excel

1. **Office.Excel.FileFromFile** — specify the Excel file path
2. **Office.Excel.WriteToFile** — write data to the Excel file
3. Structure the data as a 2D list:
   - Row 1: Headers (Element ID, Category, Mark, Width, Compliant)
   - Rows 2+: One row per element
4. Use **List.AddItemToFront** to add headers

## Scheduling Regular Audits

Create a Dynamo Player script that can be run without opening Dynamo:

1. Save the audit script as a .dyn file
2. Set input parameters using the Input nodes (file paths, thresholds)
3. Use **Dynamo Player** (Revit > Manage > Dynamo Player) to run the script
4. Run the audit at each project milestone (30%, 60%, 90%, IFC)

## Common Issues

### Script Takes Too Long

Large models with thousands of elements can be slow. Optimize by:
- Auditing one category at a time
- Using List.Map for efficient processing
- Minimizing Revit API calls
- Running in Manual mode

### Parameter Not Found

Some parameters are instance parameters, others are type parameters. Use the correct node:
- **Element.GetParameterValueByName** — for instance parameters
- **Element.Type** → **Element.GetParameterValueByName** — for type parameters

### Null Values

Elements may have null parameter values if the parameter doesn't exist or is empty. Use:
- **Core > Object == null** — check for null
- **Core > List > List.Clean** — remove nulls from a list
- **Core > Logic > If** — provide default values for nulls

## Best Practices

- **Build reusable audit scripts** — create scripts that work across projects
- **Document the rules** — add notes explaining what each check verifies
- **Use standard parameter names** — ensure your office uses consistent parameter naming
- **Run audits regularly** — don't wait until the end of the project
- **Share scripts with the team** — use Dynamo Packages or shared folders
- **Export to Excel for records** — keep audit reports for each milestone
- **Use Dynamo Player** — let non-Dynamo users run audit scripts
