---
title: "Allplan IFC Export Wrong Level Mapping via bimplus, Slab Conversion Loses Associated References in 2025, IFC 2x3 Dedicated Exporter Bugs, IFC Import Ignored Elements from Defective Data, and Multiple Building Instance Error: 2025-0-3 Hotfix, Data Healer, and Standard IFC Export"
excerpt: "Allplan fails for 5 distinct reasons: IFC export via bimplus produces wrong level mapping requiring direct Allplan export, slab conversion to 2025 loses associated references requiring 2025-0-3 hotfix or 2025-0-4 data healer, IFC 2x3 dedicated exporter has known bugs requiring standard IFC export, IFC import ignores elements from defective data requiring data validation, and IFC 2x3 export with multiple building instances causes import errors in TGA software requiring single building export. We cover each with fixes from Allplan forums."
category: "ifc-export-and-conversion-errors"
softwareSlug: "allplan"
keyword: "Allplan IFC export wrong level mapping bimplus slab conversion 2025 loses references IFC 2x3 dedicated exporter bugs import ignored elements defective data multiple building instance TGA software 2025-0-3 hotfix data healer standard IFC export"
slug: "allplan-ifc-export-wrong-level-bimplus-slab-conversion-2025-loses-references-ifc-2x3-dedicated-exporter-bugs-import-ignored-elements-defective-data-multiple-building-instance-tga"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://campus.allplan.com/forum/topics/topic/topics/bimplus-user-forum/exporting-allplan-models-in-ifc-format-does-not-work.html"
  - "https://connect.allplan.com/forum/topics/topic/topics/notifications/problem-with-slabs-conversion-to-allplan-2025.html"
  - "https://campus.allplan.com/at/forum/themen/topic/topics/cad-allgemein-1/ifc-2x3-export-fehlermeldung-bei-viega-tga-software.html"
---

# Allplan IFC Export Wrong Level Mapping via bimplus, Slab Conversion Loses Associated References in 2025, IFC 2x3 Dedicated Exporter Bugs, IFC Import Ignored Elements from Defective Data, and Multiple Building Instance Error: 2025-0-3 Hotfix, Data Healer, and Standard IFC Export

Allplan's IFC export, version conversion, and import produce errors from bimplus level mapping, slab reference loss, dedicated exporter bugs, defective IFC data, and multiple building instances. This guide covers the 5 most common Allplan problems with diagnostic steps and community-verified fixes from Allplan forums.

## 1. IFC Export Wrong Level Mapping via bimplus

### Symptom

When exporting an Allplan project to IFC and re-importing it into Allplan, the levels correspond correctly. But when the IFC is generated via bimplus and then imported into Allplan, the level system is completely wrong. The floor structure is correct, but drawing files are not on their corresponding floors. Windows are not created during import. The issue occurs even with new IFC-compliant projects.

### Root Cause

"The example above is a project whose structure is not IFC compliant. I have tried a new one from scratch, conforming to IFC." The bimplus export pipeline processes the Allplan level structure differently than the direct Allplan IFC export. The bimplus pipeline may not correctly map Allplan's drawing file structure to IFC building storeys. "C1 Import report. In addition to the mapping problem, see that the windows have not been created. C2 Level structure: the floor structure is correct, but the drawing files are not on their corresponding floor. The level system is completely wrong."

### Fix

1. **Use direct Allplan IFC export instead of bimplus**:
   - "IFC export and direct re-import into Allplan: levels correspond correctly"
   - Use Allplan's built-in IFC export
   - Instead of the bimplus pipeline
   - The direct export preserves level mapping correctly

2. **Verify project structure is IFC compliant**:
   - "The example above is a project whose structure is not IFC compliant"
   - "I have tried a new one from scratch, conforming to IFC"
   - Ensure the Allplan project follows IFC structure rules
   - With proper building storey assignments

3. **Check drawing file to storey assignments**:
   - Verify each drawing file is assigned to the correct storey
   - In Allplan's project structure
   - Ensure no drawing files are unassigned
   - Or assigned to the wrong storey

4. **Use IFC4 instead of IFC2x3**:
   - Try exporting as IFC4 instead of IFC2x3
   - IFC4 has better support for spatial hierarchy
   - And may preserve level mapping better
   - Through the bimplus pipeline

5. **Export from the correct Allplan version**:
   - Ensure you're using the latest Allplan version
   - Older versions may have bimplus export bugs
   - That have been fixed in newer versions
   - Check for updates

6. **Contact Allplan support**:
   - "To find out, what causes the Issues in your case we need the original IFC Data"
   - "Is it possible that you send reduced Data to our support?"
   - If the issue persists, contact Allplan support
   - Provide the IFC file and Allplan project

7. **Manually fix levels after import**:
   - If the IFC is already exported with wrong levels
   - Manually reassign drawing files to the correct floors
   - After importing into Allplan
   - This is a workaround, not a proper fix

### Community Report

> "Exporting allplan models in IFC format does not work. The generated models have wrong levels. IFC export and direct re-import into Allplan: levels correspond correctly. But importing the IFC generated via bimplus: level system is completely wrong. The floor structure is correct, but the drawing files are not on their corresponding floor. In addition to the mapping problem, the windows have not been created."

## 2. Slab Conversion Loses Associated References in Allplan 2025

### Symptom

When upgrading a project from a previous Allplan version to Allplan 2025, slabs maintain their height and geometry but lose their associated references. Changes to these references cannot be applied. The slab appears correct visually but its parametric associations (to walls, columns, or other slabs) are broken. The issue affects all slabs in the converted project.

### Root Cause

"A significant problem arises when upgrading a slabs from the previous version to Allplan 2025. The slab maintains its height and geometry, but loses its associated references. Furthermore, changes to these references cannot be applied." The Allplan 2025 conversion process doesn't properly migrate the slab's associated reference data. The slab's hyper slab object loses its attribute associations during the version upgrade. The conversion code doesn't handle all reference types, resulting in broken parametric links.

### Fix

1. **Wait for 2025-0-3 or use it for new conversions**:
   - "2025-0-3 version would already contain fixed conversion"
   - "If you save your drawing files with slabs to the 2024.zip package"
   - "And reimport it back, replacing the same drawing files, slabs would be fixed"
   - Release date: January 22, 2025

2. **Wait for 2025-0-4 for automatic fix of already-converted slabs**:
   - "A special hotfix 2025-0-4 version will be created sooner than usual"
   - "This version will allow already upgraded slabs to be modified automatically"
   - "Additionally, we will add a fix to the data healer function"
   - "Which will enable the slabs to recover the lost associated references"

3. **Correct it manually (Option 1)**:
   - "To rectify such a faulty slab, you need to add at least one new attribute"
   - "To the hyper slab object"
   - "After this step, the slab will function correctly"
   - "However, the original association is still lost and must be recreated"

4. **Don't convert until 2025-0-3 is available**:
   - If you haven't converted yet
   - Wait until 2025-0-3 is released
   - "The projects converted by 2025-0-3 and further would not be affected by this issue"
   - This is the safest approach

5. **Backup before conversion**:
   - Before converting to 2025
   - Create a backup of the 2024 project
   - If the conversion fails or loses references
   - You can restore from backup and wait for the fix

6. **Use the data healer**:
   - After 2025-0-4 is released
   - Run the data healer on converted projects
   - "We will add a fix to the data healer function"
   - "Which will enable the slabs to recover the lost associated references"

7. **Recreate lost associations manually**:
   - If you need to work before the fix is available
   - Recreate the slab associations manually
   - Delete the converted slab and recreate it
   - With the correct references

### Community Report

> "A significant problem arises when upgrading a slabs from the previous version to Allplan 2025. The slab maintains its height and geometry, but loses its associated references. Furthermore, changes to these references cannot be applied. Option 1: Correct it manually — add at least one new attribute to the hyper slab object. Option 2: Wait for 2025-0-3 (release 22.1.2025). Option 3: Wait for 2025-0-4 — a special hotfix that will allow already upgraded slabs to be modified automatically."

## 3. IFC 2x3 Dedicated Exporter Bugs

### Symptom

When exporting IFC 2x3 using the dedicated 2x3 exporter in Allplan, the resulting IFC file has issues. Other software (TGA planners, Revit, Archicad) can't read the file or report errors. Solibri shows no problems, but downstream software fails. The error messages include "more than one IFC Building Instance" or other structural errors.

### Root Cause

"Have you used the dedicated 2x3 Exporter (furchtbares Klumpat von dem sich Allplan endlich trennen sollte) or are you on IFC Data Exportieren and then selected 2x3 instead of 4 as file format?" The dedicated IFC 2x3 exporter in Allplan is a legacy exporter that has known bugs. "Der dezidierte 2x3 Export macht leider oft Probleme und ist soweit mir gesagt wurde nur noch vorhanden weil er halt mal zertifiziert wurde obwohl er gravierende bekannnte bugs hat." The dedicated exporter was certified but has significant known bugs that haven't been fixed. Allplan should have removed it but keeps it for certification purposes.

### Fix

1. **Use the standard IFC export instead of the dedicated 2x3 exporter**:
   - "Bist du auf IFC Daten Exportieren gegangen und hast dann 2x3 statt 4 als Dateiformat ausgewählt?"
   - Use "IFC Data Export" and select IFC 2x3 as the format
   - Instead of the dedicated 2x3 exporter
   - The standard export path is more reliable

2. **Export as IFC4 instead of IFC2x3**:
   - If the downstream software supports IFC4
   - Export as IFC4 instead of IFC2x3
   - IFC4 is the modern format
   - With better Allplan support

3. **Check for multiple building instances**:
   - "Manche Programme haben auch Schwierigkeiten mehr als ein Bauwerk pro IFC einzulesen"
   - Some programs have difficulty reading more than one building per IFC
   - Export only one building per IFC file
   - Select only the relevant building section

4. **Separate demolition and new construction**:
   - "Bei einem Projekt Abbruch/Neubau 2 Modelle übergeben werden sollten"
   - "Um Kollisionen zu vermeiden. Ein Abbruchmodell und ein Neubaumodell"
   - For renovation projects, export two separate IFC files
   - One for demolition, one for new construction

5. **Hide demolition planning before export**:
   - "Die ich per Darstellungsfavorit nicht sichtbar geschaltet habe"
   - Use display favorites to hide demolition planning
   - Before exporting the new construction IFC
   - This prevents confusion in downstream software

6. **Validate the IFC file in Solibri**:
   - Even if Solibri shows no problems
   - The IFC may still have issues for other software
   - Use the Solibri IFC validator
   - To check for structural issues

7. **Contact Allplan support**:
   - If the standard export also has issues
   - Contact Allplan support
   - Provide the IFC file and error messages
   - From the downstream software

### Community Report

> "Der dezidierte 2x3 Export macht leider oft Probleme und ist soweit mir gesagt wurde nur noch vorhanden weil er halt mal zertifiziert wurde obwohl er gravierende bekannnte bugs hat. Have you used the dedicated 2x3 Exporter or are you on IFC Data Exportieren and then selected 2x3 instead of 4? Some programs have difficulties reading more than one building per IFC. For renovation projects, two separate IFC models should be delivered — one demolition model and one new construction model."

## 4. IFC Import Ignored Elements from Defective Data

### Symptom

When importing an IFC model into Allplan, the import report lists elements under "Ignored elements." Some columns, beams, and other elements are not imported. The same IFC model opens without missing objects in other IFC viewers. The ignored elements are structural elements that should be imported.

### Root Cause

"Viewers are more tolerant with some kinds of defective data (e.g. not closed Surfaces or Violations of IFC Standards). In Allplan with some of those data, we cannot create anything at all." Allplan's IFC import is stricter than IFC viewers. It rejects elements with defective data, such as unclosed surfaces or IFC standard violations. IFC viewers are more tolerant and display defective geometry, but Allplan can't create valid 3D objects from defective data. The ignored elements have geometry or attribute issues that Allplan can't process.

### Fix

1. **Check the import report for ignored elements**:
   - "After import I can see import report, which includes information about all imported elements"
   - "There is category 'Ignored elements' where Allplan lists elements which weren't imported"
   - Review the list of ignored elements
   - Identify the element types and IDs

2. **Validate the IFC file in Solibri or other validator**:
   - Open the IFC file in Solibri
   - Run the IFC validator
   - Check for geometry and attribute issues
   - That may cause Allplan to ignore elements

3. **Fix the IFC file in the source software**:
   - If possible, fix the defective elements in the source software
   - Close open surfaces
   - Fix IFC standard violations
   - Re-export the IFC file

4. **Use IFC4 instead of IFC2x3**:
   - If the IFC file is IFC4
   - Allplan may handle it better
   - IFC4 has stricter validation rules
   - Resulting in fewer defective elements

5. **Simplify the IFC geometry**:
   - If the ignored elements have complex geometry
   - Ask the source software to simplify the geometry
   - Remove unnecessary details
   - That may cause import issues

6. **Send reduced data to Allplan support**:
   - "Is it possible that you send reduced Data to our support?"
   - "To find out, what causes the Issues in your case we need the original IFC Data"
   - If you can't fix the IFC file
   - Send it to Allplan support for analysis

7. **Import in Allplan 2024 vs 2025**:
   - "Today I tried the same IFC model in AllPlan 2024 and no error occurred"
   - "Both doors were imported correctly"
   - Try importing in a different Allplan version
   - Newer versions may have better import tolerance

### Community Report

> "I have problem with importing IFC model to my Allplan Project (IFC4 version). After import I can see import report, which includes information about all imported elements — there is category 'Ignored elements' where Allplan lists elements which weren't imported. Some columns, beams, etc. I can open my IFC model without any missing objects in other IFC Viewers. Viewers are more tolerant with some kinds of defective data. In Allplan with some of those data, we cannot create anything at all."

## 5. Multiple Building Instance Error in IFC 2x3 Export for TGA Software

### Symptom

When exporting an IFC 2x3 file from Allplan for a TGA (building services) planner, the planner's software can't read the file. The error message is "more than one IFC Building Instance." The IFC file opens correctly in Solibri and in a second CAD system. The issue only occurs in the TGA planning software.

### Root Cause

"Es handelt sich um ein Umbau Projekt, wo natürlich Abbrucharbeiten im Hintergrund liegen, die ich per Darstellungsfavorit nicht sichtbar geschaltet habe." The project is a renovation project with demolition work in the background. Although the demolition planning is hidden via display favorites, the IFC export still includes the demolition elements. This creates multiple building instances in the IFC file. "Manche Programme haben auch Schwierigkeiten mehr als ein Bauwerk pro IFC einzulesen" — some programs have difficulty reading more than one building per IFC file. The TGA software is stricter than Solibri or other CAD systems.

### Fix

1. **Export only one building section**:
   - "Ich habe auch nur einen Bautabschnitt ausgewählt"
   - "I have selected only one construction section"
   - Select only the relevant building section for export
   - Exclude other sections that create multiple building instances

2. **Separate demolition and new construction**:
   - "Bei einem Projekt Abbruch/Neubau 2 Modelle übergeben werden sollten"
   - "Ein Abbruchmodell und ein Neubaumodell"
   - Export two separate IFC files
   - One for demolition, one for new construction

3. **Use display favorites to exclude demolition**:
   - "Die ich per Darstellungsfavorit nicht sichtbar geschaltet habe"
   - Create a display favorite that hides all demolition elements
   - Use this favorite during IFC export
   - Ensure demolition elements are excluded from the export

4. **Select specific drawing files for export**:
   - Instead of exporting the entire project
   - Select only the drawing files for the new construction
   - Exclude demolition drawing files
   - This prevents multiple building instances

5. **Use the standard IFC export, not the dedicated 2x3 exporter**:
   - "Der dezidierte 2x3 Export macht leider oft Probleme"
   - The dedicated 2x3 exporter has known bugs
   - Use "IFC Data Export" with 2x3 format
   - Instead of the dedicated exporter

6. **Verify IFC structure before sending**:
   - Check the IFC file structure
   - Ensure only one IfcBuilding instance
   - Use an IFC viewer or text editor
   - To verify the structure

7. **Use the Umbaukategorie attribute**:
   - "Sämtliche Abbruchkomponenten sollten in der Regel ganz einfach über das Attribut Umbaukategorie bzw. Pset_Status gegliedert werden können"
   - Use the renovation category attribute
   - To classify demolition vs new construction
   - Export only elements with the correct status

### Community Report

> "Für einen TGA Planer habe ich eine IFC Datei in Version 2x3 exportiert. Der Planungspartner kann diese Datei nicht einlesen mit Fehlermeldung: mehr als eine IFC Building Instanz. Es handelt sich um ein Umbau Projekt, wo Abbrucharbeiten im Hintergrund liegen. Manche Programme haben Schwierigkeiten mehr als ein Bauwerk pro IFC einzulesen. Bei einem Projekt Abbruch/Neubau sollten 2 Modelle übergeben werden — ein Abbruchmodell und ein Neubaumodell."

## 6. Additional Allplan Issues

### IFC Import Problem in Allplan 2022

**Issue**: "Ich habe ein IFC-Strukturmodell im 2X3-Standardformat in Allplan 2022 importiert. Es gibt immer zwei Türen, die nicht importiert werden können."
**Fix**: "Heute habe ich jedoch versucht, dasselbe IFC-Modell in AllPlan 2024 zu importieren, und es trat kein Fehler auf. Beide Türen wurden korrekt importiert." Update to Allplan 2024 or later. The IFC import has been improved in newer versions.

### IFC4 Import Issues in Allplan 2019

**Issue**: "I have problem with importing IFC model to my Allplan Project (IFC4 version). Some columns, beams are ignored."
**Fix**: Update to a newer Allplan version. Allplan 2019 has limited IFC4 support. Allplan 2024+ has better IFC4 import capabilities.

### TGA Program IFC Import Quality

**Issue**: "Die TGA-Programme zwar für sich gesehen sehr gut mit IFC-Exporten umgehen können, dass beim Import von IFC-Architekturdaten es aber sehr wohl noch riesige Qualitätsunterschiede gibt."
**Fix**: TGA programs handle IFC exports well but have varying quality for IFC architecture imports. Check with the TGA planner about their software's IFC import capabilities. Simplify the IFC export for TGA software.

### Revit IFC Import Issues from Allplan

**Issue**: "Das Einlesen der Datei in Revit ergab verschiedene Meldungen: Raumbegrenzungslinien in der Wand, 2 Räume innerhalb einer Begrenzung."
**Fix**: These are expected warnings when importing Allplan IFC into Revit. The room boundary lines and multiple rooms within one boundary are correct Allplan modeling. Verify the warnings are not actual errors.

### Allplan Drawing File Structure vs IFC

**Issue**: "Die getrennten Teilbilder kommen beim Exportieren also wieder in einen Sack. Kompatibilitätsproblem durch Mehr-Dateien-System (Allplan) zu Ein-Datei-System (Revit-Archicad)?"
**Fix**: Allplan's multi-file system (Teilbilder) is merged into a single IFC file during export. This is expected behavior. Use building storey assignments to maintain spatial hierarchy in the IFC file.

### Allplan Visibility Filter for Demolition

**Issue**: "In Allplan lässt es sich toll schalten, in einer IFC nicht, es sei denn man hat einen Sichtbarkeitsfilter für Abbruch und Neubau."
**Fix**: Use the renovation status filter (Umbaukategorie/Pset_Status) in the IFC export. This allows downstream software to filter demolition vs new construction. Export separate IFC files for each status.

## Best Practices

1. **Use direct Allplan IFC export, not bimplus** — preserves level mapping correctly
2. **Wait for 2025-0-3 before converting slab projects** — fixes slab reference loss
3. **Use standard IFC export, not dedicated 2x3 exporter** — dedicated exporter has known bugs
4. **Export as IFC4 when possible** — better Allplan support and stricter validation
5. **Export one building per IFC file** — prevents multiple building instance errors
6. **Separate demolition and new construction IFC files** — for renovation projects
7. **Validate IFC files in Solibri before sharing** — catch structural issues early
8. **Check import report for ignored elements** — identify defective data
9. **Fix defective IFC data in the source software** — close surfaces, fix standard violations
10. **Use renovation category attributes** — classify demolition vs new construction for filtering
