---
title: "Cadence Allegro PCB Library Link and Padstack Errors"
excerpt: "Cadence Allegro PCB Library Link and Padstack Errors: symptoms, root causes, and step-by-step fixes, verified against Cadence Community."
category: "troubleshooting"
softwareSlug: "allegro-pcb"
keyword: "Cadence Allegro ORCAP-2434 footprint missing library path ORCAP-2435 pin count mismatch case-sensitive alphanumeric pin numbers DB Doctor 16.5 footprints 23.1 dbdoctor_ui.exe batch update SMD pad void SPMHCS-3 shape symbol cannot have void split pad shape body replacing padstacks batch DRC mandatory"
slug: "cadence-allegro-pcb-library-link-and-padstack-errors"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/allegro-x-capture-cis/65835/how-to-fix-errors-orcap-2434-and-orcap-2435-with-a-design-that-was-done-by-an-outside-contractor"
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/allegro-x-pcb-editor/62829/loading-footprints-keep-getting-db-doctor-message"
  - "https://community.cadence.com/cadence_technology_forums/pcb-design/f/allegro-x-pcb-editor/65262/smd-pad-with-opening"
---

# Cadence Allegro PCB Library Link and Padstack Errors: ORCAP-2434 Footprint Missing from Library Path Requiring Path Configuration and Footprint Reassociation, ORCAP-2435 Pin Count Mismatch from Case-Sensitive Alphanumeric Pin Numbers Requiring Casing Verification, DB Doctor Required When Loading 16.5 Footprints in 23.1 Requiring Batch dbdoctor_ui.exe Update, SMD Pad with Void Error SPMHCS-3 Shape Symbol Cannot Have Void Requiring Split Pad or Shape Body Workaround, and Replacing Padstacks Forces Batch DRC Requiring Acceptance of Mandatory DRC Check

Cadence Allegro's library links, pin matching, version migration, padstack creation, and DRC enforcement produce errors from path configuration, case sensitivity, version incompatibilities, and shape limitations. This guide covers the 5 most common Allegro problems with diagnostic steps and community-verified fixes from Cadence Community.

## 1. ORCAP-2434 Footprint Missing from Library Path

### Symptom

Opening a design created by an outside contractor. Warning: "ORCAP-2434: Footprint 'smdcap' specified for instance C* is missing. Ensure 'smdcap' is in library path." Multiple designs have this issue. The footprint exists in the library but Capture can't find it.

### Root Cause

The footprint library path in Capture.ini doesn't include the directory where the footprint is stored. The outside contractor used their own library paths which don't match the local configuration. The footprint may also be named differently or stored in a different library format. Relative vs. absolute paths in Capture.ini can cause the issue when moving between machines.

### Fix

1. **Check Capture.ini library paths**:
   - "Are you using relative paths or absolute paths in Capture.ini?"
   - Open Capture.ini in a text editor
   - Check the `LIBRARYPATH` entries
   - Add the directory containing the missing footprints

2. **Use consistent path format**:
   - Use relative paths where possible
   - Or use UNC paths for network libraries
   - Avoid drive-specific absolute paths (e.g., C:\...)
   - This prevents issues when moving between machines

3. **Verify footprint name matches**:
   - Check the footprint name in the schematic
   - Compare with the actual footprint name in the library
   - Names are case-sensitive
   - Rename if there's a mismatch

4. **Reassociate the footprint**:
   - In Capture: select the part
   - Edit > Properties > Footprint
   - Browse to the correct footprint
   - Reassociate all affected parts

5. **Check for duplicate library names**:
   - "Make sure that same named footprint is not present in the library path"
   - If two libraries have the same footprint name
   - Capture may pick the wrong one
   - Remove duplicates from the path

6. **Prevent future issues**:
   - "How did this issue even happen and how do I make sure it does not happen again?"
   - Establish a shared library location
   - Use version control for libraries
   - Document library paths for all users

### Community Report

> "ORCAP-2434: Footprint 'smdcap' specified for instance C* is missing. Ensure 'smdcap' is in library path. Are you using relative paths or absolute paths in Capture.ini? Where are the libraries present — is it present locally or on server?"

## 2. ORCAP-2435 Pin Count Mismatch from Case-Sensitive Alphanumeric Pin Numbers

### Symptom

Warning: "ORCAP-2435: Number of pins in footprint XXXXX and instance XXX does not match." The schematic symbol and footprint appear to have the same number of pins. Cross-probing works. No hidden pins are visible. But the DRC still reports a mismatch.

### Root Cause

"ORCAP-2435 warning appears in the Online DRC even when the number of pins in the schematic symbol matches with the number of pins in the footprint. This is because alphanumeric pin numbers are case sensitive. It must be ensured that the pin number's casing should be same in the schematic symbol and the footprint." For example, pin "A1" in the schematic and pin "a1" in the footprint are treated as different pins.

### Fix

1. **Verify pin number casing**:
   - "Alphanumeric pin numbers are case sensitive"
   - "Pin number's casing should be same in the schematic symbol and the footprint"
   - Check each pin number in the schematic symbol
   - Compare with the footprint pin numbers
   - Match the casing exactly (e.g., "A1" not "a1")

2. **Check for duplicate footprint names**:
   - "Make sure that same named footprint is not present in the library path"
   - A different version of the footprint may be loaded
   - With different pin numbering
   - Remove duplicates from the library path

3. **Check for hidden pins**:
   - "I checked for hidden pins and there are none that show up"
   - In the symbol editor, check all pin visibility
   - Some symbols have hidden power pins
   - Make all pins visible for verification

4. **Recreate the footprint if needed**:
   - If pin numbering can't be reconciled
   - Recreate the footprint with correct pin numbers
   - Use the schematic symbol as reference
   - Save to the correct library

5. **Use the Cadence support article**:
   - "Article (20495508) Title: WARNING(ORCAP-2435): Number of pins in footprint XXXXX and instance XXX does not match"
   - Check the Cadence support portal
   - Follow the article's specific steps

### Community Report

> "ORCAP-2435 is a physical DRC and it comes when the number of pins in the schematic symbol does not match with the number of pins in the footprint. ORCAP-2435 warning appears even when the number of pins matches. This is because alphanumeric pin numbers are case sensitive. The pin number's casing should be same in the schematic symbol and the footprint."

## 3. DB Doctor Required When Loading 16.5 Footprints in 23.1

### Symptom

Loading a new netlist into Allegro 23.1. Many specified footprints or padstacks are not found. Warning: "The design was last saved using version 16.5 and must be updated using DB Doctor." Opening each footprint in 17.4, running DB Doctor, saving padstacks, then opening in 23.1 is very time consuming. Over 100 parts need this procedure.

### Root Cause

Footprints created in Allegro 16.5 use an older database format. Allegro 23.1 requires the database to be updated before it can read the footprints. The DB Doctor tool updates the database format. Doing this one-by-one for 100+ footprints is impractical. The standalone DB Doctor executable can batch-process files.

### Fix

1. **Use dbdoctor_ui.exe for batch processing**:
   - "There is a 'separate' executable GUI version of DBDoctor in the \tools\bin"
   - "This version supports wild cards. No need to load each footprint"
   - "You can get that to run on all files in a folder by specifying a wildcard"
   - Example: `C:\folder\lib\*.*`

2. **Run dbdoctor_ui.exe**:
   - Navigate to the Allegro installation bin folder
   - Run `dbdoctor_ui.exe`
   - Set input design name to `C:\your_lib_folder\*.*`
   - This updates all design files in the folder

3. **Update padstacks separately**:
   - "I have to open the footprint in 23.1, save the padstack then save the footprint"
   - After DB Doctor updates the footprints
   - Open each footprint in 23.1
   - Save the padstacks and the footprint

4. **Use the command-line DB Doctor**:
   - For automation, use the command-line version
   - `dbdoctor.exe -batch` with a script file
   - Process all files in one run
   - Faster than the GUI version

5. **Migrate libraries proactively**:
   - Before upgrading Allegro versions
   - Run DB Doctor on all library files
   - This prevents the issue when opening designs
   - Schedule library migration as part of version upgrade

### Community Report

> "Loading new netlist into 23.1. The design was last saved using version 16.5 and must be updated using DB Doctor. There is a separate executable GUI version of DBDoctor in the \tools\bin that can do batch updating of footprints. This version supports wild cards. E.g., C:\folder\lib\*.* will update all design files in the folder."

## 4. SMD Pad with Void Error SPMHCS-3 Shape Symbol Cannot Have Void

### Symptom

Creating an SMD padstack with an opening (void) in the center — for a coaxial connector where the ground pad surrounds the inner pin. Drawing the pad as a shape with a void produces: "ERROR(SPMHCS-3): Shape symbol cannot have a void in a shape." Using two pads with the same pin number produces: "WARNING(SPMHA1-301): Duplicate pin number 1. Create symbol has been aborted."

### Root Cause

Cadence Allegro doesn't allow voids in shape symbols used for padstacks. The shape symbol format doesn't support internal voids. Using duplicate pin numbers on two pads to simulate a void is also not allowed — each pin number must be unique within a footprint.

### Fix

1. **Use a shape body with single pin**:
   - "You could treat the part as a one pin part only and draw the body as a shape around the pin"
   - "In the PCB editor you would assign a net to the shape — Gnd"
   - "From the perspective of the PCB Editor there is only one pin even though the body exists too as a shape"
   - This simplifies part creation

2. **Split the ground pad into two halves**:
   - "It can probably work similarly well if the ground pad is split in two halves with a gap in between"
   - Create two separate pads with different pin numbers (e.g., 1 and 2)
   - Both connect to GND net
   - This avoids the duplicate pin number error

3. **Manually create void after importing**:
   - "One workaround is to manually create a void on the pad after importing the .dra into the board"
   - Create the padstack without the void
   - Place the footprint in the board
   - Add the void manually in the board editor

4. **Use the manufacturer's footprint**:
   - "The manufacturer does offer footprints for it but you have to contact them"
   - Contact the connector manufacturer
   - Request the Allegro footprint
   - This may have the correct padstack definition

5. **Check board material requirements**:
   - "It would be good to ask the MFR if there is a particular board material that is needed to meet spec"
   - "Depending on the intended frequency a standard FR4 board may not work very well above 1GHz"
   - High-frequency connectors may need specific PCB materials
   - Verify material compatibility before finalizing the footprint

### Community Report

> "I need to create an SMD padstack that has an opening. When I draw this pad as a shape and try to save it, I get ERROR(SPMHCS-3): Shape symbol cannot have a void in a shape. Using two pads with the same pin number gives WARNING(SPMHA1-301): Duplicate pin number 1. You could treat the part as a one pin part only and draw the body as a shape around the pin."

## 5. Replacing Padstacks Forces Batch DRC Requiring Acceptance

### Symptom

Need to replace many padstacks in a design. Each time a padstack is replaced, Allegro forces a Batch DRC check. With many padstacks to replace, this is very time consuming. The user wants to omit the DRC check during padstack replacement.

### Root Cause

"It is a must to run DRC check for any physical changes and changing Via is one example. Batch DRC will not occur for all Padstack-type changes. The Batch DRC will be used on any change classified as a physical change. This is required because this is a forced change and can potentially cause a serious DRC condition at some locations."

### Fix

1. **Accept the mandatory DRC**:
   - "It cannot be turned off"
   - "This is required because this is a forced change and can potentially cause a serious DRC condition"
   - The DRC ensures the padstack change doesn't create violations
   - Accept the DRC after each replacement

2. **Replace all padstacks at once**:
   - Use Tools > Padstack > Replace
   - Select multiple padstacks to replace
   - The DRC runs once for the batch
   - More efficient than one-by-one

3. **Use the Batch DRC results**:
   - After the DRC, review the results
   - Fix any DRC violations immediately
   - Don't accumulate DRC errors
   - This prevents issues later in the design

4. **Plan padstack changes early**:
   - Replace padstacks early in the design process
   - Before routing is complete
   - This minimizes the impact of DRC findings
   - Changes after routing are more disruptive

5. **Use a script for bulk padstack replacement**:
   - Write a SKILL script to automate padstack replacement
   - The script can replace all padstacks in one operation
   - The DRC runs once at the end
   - Much faster than manual replacement

### Community Report

> "A DRC check is required during the replacing padstack command as default. I have many padstacks to be replaced and each time I do it, I do not want the DRC check. It is must to run DRC check for any physical changes. This is required because this is a forced change and can potentially cause a serious DRC condition. It cannot be turned off."

## 6. Additional Allegro Issues

### Unused Pads Interfere with Traces After Ground Flood

**Issue**: "Unused pads are suppressed during the design, but then when the gnd is poured suddenly there are a lot of pads that didn't used to be on that layer that now interfere with traces."
**Fix**: "Set properties on the pin or via so no thermal will connect to the dynamic ground. RMB click on the object and choose Edit Property, use Dyn_Thermal_Con_Type and assign a value of None on the layer." Check Hole to Spacing settings in Constraint Manager.

### SPMHNI-194 Symbol Not Found

**Issue**: "WARNING(SPMHNI-194): Symbol 'SMD_SOD123_ANODE_PIN1' used by RefDes D30 not found."
**Fix**: The symbol is not in the library path. Add the correct library path or recreate the symbol. Run DB Doctor on the symbol file if it's from an older version.

### Footprint Loading Fails After Version Upgrade

**Issue**: Footprints saved in older Allegro versions fail to load in newer versions.
**Fix**: Use dbdoctor_ui.exe with wildcard to batch-update all footprint files. Save padstacks and footprints in the new version after DB Doctor update.

### Library Path Configuration for Teams

**Issue**: Multiple users have different library paths, causing missing footprint errors.
**Fix**: Use a shared network library location. Configure Capture.ini with UNC paths. Use version control for library files. Document the standard library path configuration.

## Best Practices

1. **Use relative or UNC paths in Capture.ini** — prevents path issues between machines
2. **Match pin number casing exactly between symbol and footprint** — prevents ORCAP-2435
3. **Check for duplicate footprint names in library path** — prevents wrong version loading
4. **Use dbdoctor_ui.exe with wildcards for batch version migration** — saves hours of manual work
5. **Run DB Doctor on all library files before version upgrade** — prevents loading failures
6. **Use shape body with single pin for coaxial connectors** — avoids void and duplicate pin errors
7. **Split ground pads into two halves with gap** — alternative to void in padstack
8. **Accept mandatory DRC when replacing padstacks** — it cannot be disabled
9. **Replace all padstacks at once using Tools > Padstack > Replace** — single DRC run
10. **Set Dyn_Thermal_Con_Type to None for unused pads in ground flood** — prevents interference
