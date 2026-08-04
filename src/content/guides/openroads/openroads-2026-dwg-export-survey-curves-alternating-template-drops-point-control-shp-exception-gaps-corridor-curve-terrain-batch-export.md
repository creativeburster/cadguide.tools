---
title: "OpenRoads Designer 2026 DWG Export Survey Curves Incorrect as B-Spline vs Line String, Alternating Template Drops Cause Point Control to Stop Working, Export to SHP Exception from Gaps Within Templates, Corridor Feature Not Following Horizontal Curve, and Terrain Batch Process Export Not Exporting Terrains Correctly: Survey Curve Fix, Template Drop Reorder, Gap Repair, Curve Following, and Terrain Export Update"
excerpt: "OpenRoads Designer fails for 5 distinct reasons: DWG export survey curves incorrect as B-Spline vs Line String requiring export format check, alternating template drops cause point control to stop working requiring drop reorder, export to SHP exception from gaps within templates requiring gap repair, corridor feature not following horizontal curve requiring curve following update, and terrain batch process export not exporting correctly requiring export update. We cover each with fixes from Bentley 2026 release notes."
category: "troubleshooting"
softwareSlug: "openroads-designer"
keyword: "OpenRoads Designer 2026 DWG export survey curves B-Spline Line String alternating template drops point control stop working export SHP exception gaps templates corridor feature horizontal curve terrain batch process export"
slug: "openroads-2026-dwg-export-survey-curves-alternating-template-drops-point-control-shp-exception-gaps-corridor-curve-terrain-batch-export"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://docs.bentley.com/LiveContent/web/OpenRoads%20Designer-v2026.0.0/Help/en/topics/723708/defects_fixed_in_2026_update_release.html"
  - "https://bentleysystems.service-now.com/community?id=kb_article&sysparm_article=KB0018203"
  - "https://docs.bentley.com/LiveContent/web/OpenRoads%20Designer-v2026.0.0/Help/en/topics/1296840/GUID-A04BDB28-A093-490B-8131-E1C89EDA3EF2.html"
---

# OpenRoads Designer 2026 DWG Export Survey Curves Incorrect as B-Spline vs Line String, Alternating Template Drops Cause Point Control to Stop Working, Export to SHP Exception from Gaps Within Templates, Corridor Feature Not Following Horizontal Curve, and Terrain Batch Process Export Not Exporting Terrains Correctly: Survey Curve Fix, Template Drop Reorder, Gap Repair, Curve Following, and Terrain Export Update

OpenRoads Designer produces errors from DWG export, template drops, SHP export, corridor curves, and terrain export. This guide covers the 5 most common OpenRoads problems with diagnostic steps and community-verified fixes from Bentley 2026 release notes.

## 1. DWG Export Survey Curves Incorrect as B-Spline vs Line String

### Symptom

When exporting to DWG, some survey curves are not exported correctly. Some curves are exported as B-Spline curves, while others are exported as Line Strings. The inconsistency in curve type export causes issues when the DWG file is used in other CAD systems. The issue occurs specifically with survey curves during DWG export.

### Root Cause

"Export to DWG: Some Survey curves are not exported correctly to DWG, some are exported as B-Spline but some others as Line Strings." The DWG export algorithm for survey curves has a bug where it inconsistently determines the curve type. Some survey curves are converted to B-Spline curves while others are converted to Line Strings, depending on the curve's geometry. This inconsistency was fixed in OpenRoads Designer 2026.

### Fix

1. **Update to OpenRoads Designer 2026**:
   - "Some Survey curves are not exported correctly to DWG"
   - "Some are exported as B-Spline but some others as Line Strings"
   - Fixed in 2026 release
   - Update to the latest version

2. **Verify curve types after export**:
   - After DWG export
   - Verify all survey curves
   - Are exported with
   - The correct curve type

3. **Use Civil File Manager for alignment**:
   - "Civil File Manager has replaced Version Checker"
   - Use Civil File Manager
   - To align DGN files
   - Before export

4. **Check survey curve geometry**:
   - Check the geometry
   - Of survey curves
   - For any issues
   - That may affect export

5. **Use Align All for branding**:
   - "To brand the DGN select Action > Align All"
   - Use Align All
   - To ensure proper
   - DGN branding before export

6. **Export to alternative format**:
   - If DWG export has persistent issues
   - Try exporting to
   - An alternative format
   - Like LandXML

7. **Report persistent export issues**:
   - If the issue persists after updating
   - Report to Bentley support
   - With the DGN file
   - And export settings

### Community Report

> "Export to DWG: Some Survey curves are not exported correctly to DWG, some are exported as B-Spline but some others as Line Strings. Fixed in OpenRoads Designer 2026 release."

## 2. Alternating Template Drops Cause Point Control to Stop Working

### Symptom

When using alternating template drops in a corridor, point control stops working. The point control that was functioning correctly before the alternating drops becomes inactive. The issue occurs specifically with alternating template drops, not with regular template drops. The corridor doesn't update correctly at the affected locations.

### Root Cause

"CS0476478 | Modeling - Corridors | Alternating Template Drops cause point control to stop working." The alternating template drop logic has a bug where it doesn't properly maintain point control associations. When template drops alternate, the point control references become invalid, causing the point control to stop working. Fixed in OpenRoads Designer 2026.

### Fix

1. **Update to OpenRoads Designer 2026**:
   - "CS0476478 | Modeling - Corridors"
   - "Alternating Template Drops cause point control to stop working"
   - Fixed in 2026
   - Update to the latest version

2. **Avoid alternating template drops**:
   - If you can't update immediately
   - Avoid using
   - Alternating template drops
   - As a workaround

3. **Use uniform template drops**:
   - Use uniform template drops
   - Instead of alternating
   - To maintain
   - Point control functionality

4. **Reapply point control after alternating drops**:
   - If point control stops working
   - Reapply the point control
   - After the alternating
   - Template drops

5. **Check point control status**:
   - After creating alternating drops
   - Check point control
   - Status and verify
   - It's still active

6. **Use template drops without alternating**:
   - Use regular template drops
   - Without alternating
   - To avoid the
   - Point control issue

7. **Report persistent point control issues**:
   - If point control issues persist after updating
   - Report to Bentley support
   - With the corridor file
   - And template drop configuration

### Community Report

> "CS0476478 | Modeling - Corridors | Alternating Template Drops cause point control to stop working. Fixed in OpenRoads Designer 2026 release."

## 3. Export to SHP Exception from Gaps Within Templates

### Symptom

When using Export to SHP (Shapefile), an exception occurs. The exception happens when there are gaps within the corridor templates. The SHP export fails completely or produces incomplete output. The issue occurs specifically with templates that have gaps.

### Root Cause

"CS0336799 | Modeling - Corridors | Exception occurs when using Export to SHP and there are gaps within templates." The SHP export algorithm doesn't properly handle gaps within corridor templates. When gaps are present, the export algorithm encounters unexpected geometry and throws an exception. Fixed in OpenRoads Designer 2026.

### Fix

1. **Update to OpenRoads Designer 2026**:
   - "CS0336799 | Modeling - Corridors"
   - "Exception occurs when using Export to SHP"
   - "And there are gaps within templates"
   - Fixed in 2026

2. **Repair gaps in templates**:
   - Before exporting to SHP
   - Repair any gaps
   - Within the corridor
   - Templates

3. **Use Export to LandXML as alternative**:
   - If SHP export fails
   - Use Export to LandXML
   - As an alternative
   - Export format

4. **Check for template gaps**:
   - Before SHP export
   - Check for gaps
   - In all templates
   - In the corridor

5. **Fill gaps in templates**:
   - Fill any gaps
   - In the templates
   - Before attempting
   - SHP export

6. **Use individual template export**:
   - Export templates
   - Individually
   - To identify which template
   - Has the gap issue

7. **Report persistent SHP export issues**:
   - If SHP export issues persist after updating
   - Report to Bentley support
   - With the corridor file
   - And template gap details

### Community Report

> "CS0336799 | Modeling - Corridors | Exception occurs when using Export to SHP and there are gaps within templates. Fixed in OpenRoads Designer 2026 release."

## 4. Corridor Feature Not Following Horizontal Curve

### Symptom

The corridor feature at a horizontal curve is not following the curve. The feature appears as straight segments instead of following the curved alignment. The issue occurs at horizontal curves in the alignment. The corridor doesn't accurately represent the design at curve locations.

### Root Cause

"CS0290964 | Modeling - Corridors | The corridor feature at the horizontal curve is not following the curve." The corridor feature calculation at horizontal curves has a bug where it doesn't properly interpolate the feature along the curve. Instead of following the curve geometry, the feature is calculated using straight segments between curve points. Fixed in OpenRoads Designer 2026.

### Fix

1. **Update to OpenRoads Designer 2026**:
   - "CS0290964 | Modeling - Corridors"
   - "The corridor feature at the horizontal curve"
   - "Is not following the curve"
   - Fixed in 2026

2. **Check corridor feature at curves**:
   - After updating
   - Check corridor features
   - At horizontal curves
   - For correct following

3. **Increase curve densification**:
   - If the feature still doesn't follow
   - Increase the curve
   - Densification settings
   - For more curve points

4. **Verify alignment curve geometry**:
   - Verify the horizontal
   - Alignment curve
   - Geometry is correct
   - And complete

5. **Rebuild corridor after update**:
   - After updating
   - Rebuild the corridor
   - To recalculate
   - All features

6. **Check corridor feature definition**:
   - Verify the corridor
   - Feature definition
   - Is correctly configured
   - For curve following

7. **Report persistent curve issues**:
   - If curve following issues persist after updating
   - Report to Bentley support
   - With the corridor and alignment
   - File details

### Community Report

> "CS0290964 | Modeling - Corridors | The corridor feature at the horizontal curve is not following the curve. Fixed in OpenRoads Designer 2026 release."

## 5. Terrain Batch Process Export Not Exporting Terrains Correctly

### Symptom

When using Terrain Batch Process Export, terrains are not exported correctly. The exported terrain data is incomplete or incorrect. The issue affects batch processing of multiple terrains. Individual terrain exports may work correctly, but batch processing produces incorrect results.

### Root Cause

"CS0344822 | Terrain | Terrain Batch Process Export does not export Terrains correctly." The Terrain Batch Process Export algorithm has a bug where it doesn't properly handle multiple terrains in batch mode. The batch processing logic doesn't correctly iterate through all terrains, resulting in incomplete or incorrect exports. Fixed in OpenRoads Designer 2026.

### Fix

1. **Update to OpenRoads Designer 2026**:
   - "CS0344822 | Terrain"
   - "Terrain Batch Process Export"
   - "Does not export Terrains correctly"
   - Fixed in 2026

2. **Export terrains individually**:
   - If batch export fails
   - Export terrains
   - Individually
   - As a workaround

3. **Verify exported terrain data**:
   - After batch export
   - Verify the exported
   - Terrain data
   - For completeness

4. **Check terrain model integrity**:
   - Before batch export
   - Check terrain models
   - For integrity
   - And completeness

5. **Use LandXML export as alternative**:
   - If terrain export has issues
   - Use LandXML export
   - As an alternative
   - Format

6. **Check batch process settings**:
   - Verify the batch
   - Process settings
   - Are correctly
   - Configured

7. **Report persistent export issues**:
   - If terrain export issues persist after updating
   - Report to Bentley support
   - With the terrain models
   - And batch settings

### Community Report

> "CS0344822 | Terrain | Terrain Batch Process Export does not export Terrains correctly. Fixed in OpenRoads Designer 2026 release."

## 6. Additional OpenRoads Issues

### Crash When Opening DGN File

**Issue**: "OpenRoads Designer is crashing when opening a DGN."
**Fix**: Move DGN to C:\Temp\, try a different DGN, check reference files, clean uninstall/reinstall, update Connection Client, update video driver, check for Civil 3D object enabler conflicts, ensure 32GB RAM.

### Incompatible Civil Data Error

**Issue**: "Incompatible Civil Data. The Data in this file belongs to [OpenRail Designer Update 8]."
**Fix**: Use Civil File Manager to perform Product Alignment. Select Action > Align All to rebrand DGN files. Use Upgrade All to upgrade from previous version.

### Import Cant via ALG Impact

**Issue**: "Import Cant via ALG will impact previous imported Cant objects."
**Fix**: Be aware that importing Cant via ALG affects existing Cant objects. Import Cant carefully, checking for impacts on existing data.

### ALG Import Breaks Cant Alignment

**Issue**: "Importing an alignment from ALG breaks the cant alignment."
**Fix**: Verify cant alignment after ALG import. Re-import cant data if broken. Check alignment and cant dependencies.

### Corridor Not Displaying Contours

**Issue**: "CS0074820 | Terrain | Corridor won't display contours correctly."
**Fix**: Update to OpenRoads Designer 2026. Check corridor terrain model. Verify contour display settings.

### Horizontal Alignment Check Integrity Report

**Issue**: "0563587 | Reports | Horizontal Alignment Check Integrity report shows both horizontal and vertical alignments."
**Fix**: Be aware that the report shows both alignments. Use the report to check both horizontal and vertical alignment integrity.

### Civil File Manager Upgrade

**Issue**: "Civil File Manager has replaced Version Checker."
**Fix**: Use Civil File Manager for file management. Located at C:\Program Files\Bentley\OpenX Designer 2026.00\OpenRoadsDesigner\CivilFileManager.exe. Use Align All, Upgrade All, or Downgrade Civil Model.

## Best Practices

1. **Update to OpenRoads Designer 2026** — fixes survey curve export, template drops, SHP export, curve following, and terrain export
2. **Use Civil File Manager for DGN file management** — replaces Version Checker
3. **Repair template gaps before SHP export** — prevents export exceptions
4. **Avoid alternating template drops if point control fails** — use uniform drops as workaround
5. **Export terrains individually if batch export fails** — workaround for batch export bug
6. **Move DGN to C:\Temp\ for crash troubleshooting** — isolates reference file issues
7. **Check for Civil 3D object enabler conflicts** — rename Autodesk enabler folders to test
8. **Use delivered workspace for crash troubleshooting** — isolates custom workspace issues
9. **Ensure 32GB RAM for large corridors** — 16GB minimum, 32GB recommended
10. **Update video drivers for crash issues** — graphics driver updates can resolve crashes
