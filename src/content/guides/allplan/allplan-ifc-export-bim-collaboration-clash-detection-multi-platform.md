---
title: "Allplan IFC Export and BIM Collaboration: Coordination View, Clash Detection, and Multi-Platform Workflow"
excerpt: "A guide to IFC export from Allplan for BIM collaboration, covering model view definitions, property set configuration, coordinate systems, clash detection with Solibri, and round-trip workflows with Revit and ArchiCAD."
category: "workflow"
softwareSlug: "allplan"
keyword: "allplan ifc export bim collaboration"
slug: "allplan-ifc-export-bim-collaboration-clash-detection-multi-platform"
author: "CADGuide Tools Editorial Team"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.buildingsmart.org/standards/ifs/"
  - "https://www.allplan.com/ap_en/press-reports/press-report/allplan-promotes-open-bim-workflows-for-buildings-infrastructure-and-fabrication/"

---

# Allplan IFC Export and BIM Collaboration: Coordination View, Clash Detection, and Multi-Platform Workflow

IFC export from Allplan is one of the areas where this software really stands out. I've exchanged IFC files between Allplan and Revit, ArchiCAD, and Tekla on multi-platform projects, and Allplan's IFC implementation is the most reliable I've worked with. It's BuildingSMART certified, and the mapping options give you fine control over what gets exported. Let me walk you through the configuration.

## IFC Versions and Model View Definitions

### IFC Versions

| Version | Use Case | Compatibility |
|---------|----------|---------------|
| IFC 2x3 | Standard for most projects | Revit, ArchiCAD, Tekla, Solibri, Navisworks |
| IFC 4 | Advanced features, geometry sets | Modern BIM tools (limited support in Revit) |

**Recommendation**: Use IFC 2x3 for maximum compatibility. Use IFC 4 only when all collaboration partners support it.

### Model View Definitions (MVD)

| MVD | Purpose | Use Case |
|-----|---------|----------|
| Coordination View | Clash detection, basic coordination | Most common — use for Navisworks, Solibri |
| Reference View | Visual reference in other tools | When partners need visual reference only |
| Design Transfer View | Full model transfer with properties | When partners need to edit the model |
| Structural Analysis View | Transfer to structural analysis software | For FEA integration |

## Configuring IFC Export

### Step 1: Verify Model Quality

Before exporting, verify:
- All building elements are classified (wall, slab, column, beam, door, window, roof)
- Materials are assigned to all elements
- Building stories are defined with correct elevations
- No duplicate or overlapping elements
- Coordinates match the project survey point

### Step 2: Set Up Export Filter

1. File > Export > IFC
2. Click "Filter" to select what to export:
   - **By floor**: Select specific stories
   - **By layer**: Select specific layers
   - **By element type**: Select specific element categories
   - **By building section**: Select specific building wings
3. For large projects, export by floor or building section to keep file sizes manageable

### Step 3: Configure Property Sets

1. In the IFC export dialog, click "Property Sets"
2. Select which property sets to include:

#### Standard Property Sets

- **Pset_WallCommon**: FireRating, ThermalTransmittance, IsExternal, LoadBearing, Status
- **Pset_SlabCommon**: FireRating, ThermalTransmittance, IsExternal, LoadBearing, Status
- **Pset_DoorCommon**: FireRating, SecurityRating, Glazing, IsExternal
- **Pset_WindowCommon**: FireRating, Glazing, IsExternal
- **Pset_ColumnCommon**: FireRating, LoadBearing, Status
- **Pset_BeamCommon**: FireRating, LoadBearing, Status

#### Custom Property Sets

1. Click "Add Custom Property Set"
2. Define properties relevant to your project:
   - **Pset_ProjectSpecific**: ProjectPhase, CostCode, Supplier
3. Assign the property set to relevant element types

### Step 4: Coordinate System

1. In the IFC export dialog, click "Coordinates"
2. Set:
   - **Survey point**: The real-world coordinate reference
   - **Project base point**: The origin of the Allplan model
   - **True north**: Angle from project north to true north
3. For multi-project sites, ensure all teams use the same survey point

### Step 5: Export

1. Click "Export"
2. Specify file name and location
3. Allplan generates the IFC file
4. Check the export log for warnings or errors

## IFC File Quality Checklist

- [ ] File size is reasonable (< 500MB for coordination, < 100MB for email)
- [ ] All elements have correct IFC classification
- [ ] Materials are assigned
- [ ] Property sets are populated
- [ ] Building stories are defined
- [ ] Coordinates match survey point
- [ ] No duplicate elements
- [ ] Export log shows no critical errors

## Clash Detection with Solibri

### Importing IFC into Solibri

1. Open Solibri Model Checker
2. File > Open > select the Allplan IFC file
3. Import other discipline models (Revit structural, MEP IFC files)
4. All models align based on coordinate system

### Running Clash Detection

1. In Solibri, Classification > Clashes
2. Set clash rules:
   - **Hard clash**: Elements physically intersect (e.g., pipe through wall)
   - **Clearance clash**: Elements within a minimum distance (e.g., 50mm clearance)
   - **Duplicate clash**: Identical elements in the same location
3. Select categories to check (e.g., structural vs. MEP)
4. Click "Check"
5. Solibri generates a clash report with:
   - Clash location (coordinates)
   - Involved elements (with IDs)
   - Clash severity (critical, major, minor)
6. Export the clash report as PDF or BCF (BIM Collaboration Format)

### BCF Workflow

BCF (BIM Collaboration Format) is the standard for communicating clash resolution between BIM tools:

1. In Solibri, export clash results as BCF file
2. In Allplan: File > Import > BCF
3. Allplan shows clash locations as markers in the model
4. Resolve each clash by modifying the relevant elements
5. Export updated IFC
6. Re-run clash detection in Solibri to verify resolution

## Round-Trip with Revit

### Allplan to Revit

1. Export IFC 2x3 from Allplan (Coordination View)
2. In Revit: Insert > Link IFC > select the IFC file
3. Revit displays the Allplan model with element classifications
4. Use Revit's Coordination Model features for reference

### Revit to Allplan

1. Export IFC 2x3 from Revit (File > Export > IFC)
2. In Allplan: File > Import > IFC
3. Allplan imports the Revit model with element classifications
4. Elements can be referenced for coordination or modified if needed

### Known Round-Trip Issues

- **Geometry simplification**: Some complex geometry may be simplified during IFC transfer
- **Property loss**: Custom properties not in standard Psets may not transfer
- **Material appearance**: Visual materials do not transfer (only material names)
- **Parametric behavior**: Elements lose parametric relationships — they become static solids
- **Family information**: Revit family names and type names are preserved in IFC but not as native Revit families

## Round-Trip with ArchiCAD

### Allplan to ArchiCAD

1. Export IFC 2x3 from Allplan
2. In ArchiCAD: File > Open > select the IFC file
3. ArchiCAD imports with full element classification
4. Elements appear as ArchiCAD elements with IFC properties

### ArchiCAD to Allplan

1. Export IFC 2x3 from ArchiCAD (File > Save As > IFC)
2. In Allplan: File > Import > IFC
3. Allplan imports with element classifications preserved

Allplan-ArchiCAD IFC round-trip is generally smoother than Allplan-Revit because both use IFC as a primary exchange format rather than a secondary export.

## IFC Model Checking

Before issuing an IFC file for coordination, run model checking:

1. Use Solibri Model Checker or online IFC validator (buildingSMART IFC Validator)
2. Check for:
   - **Invalid element classifications**: Elements with wrong IFC types
   - **Missing required properties**: Pset properties not populated
   - **Geometry errors**: Non-manifold solids, zero-area faces
   - **Coordinate misalignment**: Model not at correct survey coordinates
3. Fix issues in Allplan and re-export

## Best Practices for IFC Collaboration

1. **Agree on IFC version and MVD before export** — all teams should use the same settings
2. **Use consistent element classification** — walls as IfcWall, not IfcBuildingElementProxy
3. **Populate standard property sets** — fire rating, load-bearing, external/internal
4. **Set coordinates correctly** — use the agreed survey point
5. **Export by discipline** — architectural, structural, MEP as separate IFC files
6. **Use BCF for issue tracking** — don't communicate clashes via email
7. **Version control IFC files** — name files with date and revision (e.g., `Architectural_R03_20260630.ifc`)
8. **Run model checking before issue** — catch errors before they reach the coordination team

## Wrapping Up

Allplan's IFC export is one of the best in the business, and I've relied on it for multi-platform coordination on several projects. The key to success is standardization — agree on IFC version, MVD, property sets, and coordinates with your collaborators before the first export. I've seen coordination projects descend into chaos because one team exported IFC 4 when everyone else was using IFC 2x3. Get the basics right upfront and the rest follows naturally.
