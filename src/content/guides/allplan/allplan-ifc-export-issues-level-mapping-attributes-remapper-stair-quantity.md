---
title: "Allplan IFC Export Issues: Wrong Level Mapping, Missing Geometric Attributes, Attribute Remapper Move-Not-Copy Bug, Stair Quantity Gaps, and Column Profile Definition Omission"
excerpt: "Allplan's IFC export has 5 documented problems: levels map incorrectly when re-imported, geometric attributes (w/H/L) not exported unless Quantities Option is enabled, Attribute Remapper moves values instead of copying them, stairs export without quantity Psets and incorrect unit conversions, and rectangular columns miss IfcRectangleProfileDef. We cover each with fixes from Allplan forums."
category: "ifc-export-issues"
softwareSlug: "allplan"
keyword: "Allplan IFC export wrong levels missing attributes remapper stair quantity column profile definition"
slug: "allplan-ifc-export-issues-level-mapping-attributes-remapper-stair-quantity"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://campus.allplan.com/forum/topics/topic/topics/bimplus-user-forum/exporting-allplan-models-in-ifc-format-does-not-work.html"
  - "https://campus.allplan.com/forum/topics/topic/topics/cad-engineering/allplan-attributes-not-exported-to-ifc.html"
  - "https://connect.allplan.com/forum/topics/topic/topics/cad-allgemein-1/stairs-ifc-export-no-quantities-export-and-issues-in-units-conversion.html"
---

# Allplan IFC Export Issues: Wrong Level Mapping, Missing Geometric Attributes, Attribute Remapper Move-Not-Copy Bug, Stair Quantity Gaps, and Column Profile Definition Omission

Allplan's IFC export is essential for BIM collaboration, but users report consistent data loss and mapping errors when exchanging models with other BIM software. Levels map incorrectly, geometric attributes disappear, the Attribute Remapper moves values instead of copying them, stairs lose quantity data, and column profile definitions are omitted. This guide covers each IFC export problem with diagnostic steps and community-verified fixes.

## 1. Wrong Level Mapping on IFC Re-import

### Symptom

When exporting an Allplan project to IFC and re-importing it into Allplan:
- The original Allplan project has correct level system (Attachment A1)
- IFC export and direct re-import into Allplan: levels correspond correctly (Attachment A2)
- But importing the IFC generated via bimplus: **level system is completely wrong** (Attachment A3)
- Floor structure is correct, but drawing files are not on their corresponding floors

### Root Cause

The bimplus export path handles level mapping differently than the direct Allplan IFC export. When the project structure is not IFC-compliant, the bimplus path creates incorrect level associations.

### Fix

1. **Use direct Allplan IFC export** instead of bimplus export when possible
2. **Ensure project structure is IFC-compliant** from the start:
   - Each floor must have proper elevation assignments
   - Drawing files must be associated with the correct floor
   - Building structure must follow IFC hierarchy: Site → Building → Storey → Elements
3. **Create new projects from scratch** conforming to IFC — retrofitting non-compliant projects produces mapping errors
4. **Verify with FZKViewer** before sharing — check that levels and element assignments are correct

### Additional Issue: Windows Not Created

On re-import, windows may not be created even when they exist in the original model. The import report shows mapping problems alongside missing windows.

## 2. Geometric Attributes Not Exported

### Symptom

After exporting an Allplan model to IFC, geometric attributes (width, height, length) are not included. For example, a column with w/H/L dimensions has none of these values in the IFC file.

Additionally, reinforcement bar engineering attributes are all zero in the IFC export, even though the bars clearly exist in the model with proper dimensions.

### Root Cause

Allplan does not automatically export geometric attributes unless the **Quantities Option** is explicitly enabled in IFC export settings.

### Fix

1. **Enable Quantities Option during export**:
   - Go to IFC Options → **Advanced Settings** tab
   - Check **Quantities Option**
   - This exports geometric attributes (w/H/L) automatically

2. **For reinforcement bar attributes**:
   - Allplan does not automatically retrieve engineering attributes from bars in the model
   - You must **manually enter attributes for each bar** in Allplan
   - This is time-consuming but currently the only way to get bar attributes into IFC
   - There is no automatic pickup of bar data from the model

### Impact on BIM Workflow

Without geometric attributes, downstream applications cannot perform:
- Quantity takeoff
- Cost estimation
- Clash detection with dimension-based rules
- Automated scheduling

## 3. Attribute Remapper: Move Instead of Copy Bug

### Symptom

When using the IFC Export Tool's Attribute/Parameter Remapper to remap an attribute:
- The value appears at the target parameter in the exported IFC
- But the **source parameter is erased** from the IFC

### Root Cause

The Attribute Remapper **moves** the value instead of **copying** it. For example, the "Codetext" attribute is used for the type and disappears when written to another parameter location.

### Expected Behavior

The remapper should:
1. Copy the value to the target parameter
2. **Also export the source parameter** and its value

This ensures:
- IFC schema quality is maintained (IFC 2x3 and IFC 4 compliance)
- Client-specific Psets can be created without disassembling the IFC schema

### Workaround

1. **Create a duplicate attribute** in Allplan before remapping
2. Map the duplicate to the target parameter
3. Keep the original attribute in its standard location
4. This preserves both source and target in the IFC export

### Future Fix

Allplan has acknowledged this is not the correct workflow. The fix would allow company-internal attributes to be created and transferred to a separate tab without removing the source.

## 4. Stairs: No Quantity Export and Unit Conversion Errors

### Issues

**Issue 1**: Allplan doesn't export any quantity Pset for stairs.

**Issue 2**: Some attributes are exported with incorrect unit conversion.

### Diagnosis

Check if the stair is exported as `IfcStair` or `IfcStairFlight`:
1. Open the IFC in FZKViewer
2. Check Element Properties → first tab
3. If not correctly typed, set the IFC type in Allplan's Attributes function

### Stair Quantity Limitations

IFC4 defines `Qto_StairFlightBaseQuantities` with only 3 values:
- Length
- GrossVolume
- NetVolume

**No quantity set exists for `IfcStair`** — only for `IfcStairFlight`.

### Calculated Values Problems

Allplan includes "Calculated Values" for stairs:
- Length in planview, width in planview, total height, surface area, volume

**Problems**:
- No "length by stairway" attribute
- X and Y dimensions are used as "length" and "width" — **wrong if the stair is rotated in planview**
- No matching IFC attributes in `Pset_StairCommon` or `Pset_StairFlightCommon`

### Fix

1. **Set IFC type explicitly**: In Allplan, add the attribute "Ifc object type" and set it to `IfcStairFlight` for stair flights
2. **Add user-defined attributes** in Allplan for missing quantities
3. **Read these as Allplan attributes** in the IFC — they won't map to standard IFC Psets but will be preserved
4. **Match Allplan attributes with IFC attributes** in the IFC Export dialogue where possible
5. **Use IFC specification reference**: https://standards.buildingsmart.org/IFC/RELEASE/IFC4_1/FINAL/HTML/schema/ifcsharedbldgelements/

## 5. Column Profile Definition Missing for Rectangular Profiles

### Symptom

Allplan 2020 does not correctly export architectural columns with rectangular profiles to IFC. The important IfcClass of Profile Definition is missing.

### What Should Be Exported

IFC files containing `IfcColumns` and `IfcBeams` should have two IfcClasses defining the profile:

1. **Profile Definition Class** (mandatory):
   - Rectangle profiles: `IFCRECTANGLEPROFILEDEF`
   - Other profiles (HEB, etc.): `IFCARBITRARYCLOSEDPROFILEDEF`

2. **Generic Class**: Saves parameters and values from Allplan, including "Profile name" in `IFCPROPERTYSINGLEVALUE`

### What Actually Happens

For columns with rectangular profiles, Allplan does not create the Profile Definition IfcClass. The profile information is lost in the IFC export.

### Impact

- Downstream applications cannot determine the column cross-section
- Structural analysis tools cannot extract profile dimensions
- Quantity takeoff cannot calculate concrete volume from profile area

### Fix

1. **Use a different profile type** (e.g., arbitrary closed profile) — Allplan exports these correctly
2. **Manually add profile attributes** in Allplan before export
3. **Post-process the IFC file** to add missing `IfcRectangleProfileDef` entries
4. **Upgrade to newer Allplan version** — check if the issue is fixed in Allplan 2024+

## Best Practices for Allplan IFC Export

1. **Enable Quantities Option** in IFC Options → Advanced Settings — without this, geometric attributes are not exported
2. **Use direct Allplan IFC export**, not bimplus export, for correct level mapping
3. **Ensure IFC-compliant project structure** from project creation — retrofitting causes mapping errors
4. **Don't rely on Attribute Remapper** to preserve source attributes — create duplicates before remapping
5. **Set IFC types explicitly** for stairs and other elements that Allplan doesn't automatically classify
6. **Add user-defined attributes** for quantities that IFC standard Psets don't cover
7. **Verify with FZKViewer** before sharing IFC files — check levels, types, and attributes
8. **Manually enter reinforcement bar attributes** — Allplan doesn't auto-retrieve them from the model
9. **Check column profile definitions** in the exported IFC — rectangular profiles may be missing
10. **Match Allplan attributes with IFC attributes** in the IFC Export dialogue for proper mapping
