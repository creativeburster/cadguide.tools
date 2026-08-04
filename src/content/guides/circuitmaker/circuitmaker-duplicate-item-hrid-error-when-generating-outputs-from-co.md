---
title: "CircuitMaker Duplicate Item HRID Error When Generating Outputs from Copy-Paste"
excerpt: "CircuitMaker Duplicate Item HRID Error When Generating Outputs from Copy-Paste: symptoms, root causes, and step-by-step fixes, verified against Altium documentation and Stack Exchange."
category: "troubleshooting"
softwareSlug: "circuitmaker"
keyword: "CircuitMaker Duplicate Item HRID error generating outputs copy paste cloud sync internet connection Nexar API Octopart migration CoDesigner Fusion 360 PCB data exchange crash symbol search Select Item Revision project clone workaround manual save commit"
slug: "circuitmaker-duplicate-item-hrid-error-when-generating-outputs-from-co"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://www.altium.com/documentation/altium-circuitmaker/public-release-notes"
  - "https://electronics.stackexchange.com/questions/666301/circuitmaker-error-duplicate-item-hrid-when-trying-to-generate-outputs"
  - "https://www.altium.com/documentation/altium-circuitmaker/faqs"
---

# CircuitMaker Duplicate Item HRID Error When Generating Outputs from Copy-Paste, Cloud Sync Issues Requiring Internet Connection for Output Generation, Component Search Engine Nexar API Migration from Octopart, CoDesigner Fusion 360 Direct PCB Data Exchange, and Crash During Symbol Search in Select Item Revision Dialog: Project Clone Workaround, Manual Save and Commit, Nexar API Update, Fusion 360 Plugin, and Ctrl-Alt-Insert Crash Report

CircuitMaker produces errors from Duplicate Item HRID, cloud sync failures, API migration, CoDesigner integration, and symbol search crashes. This guide covers the 5 most common CircuitMaker problems with diagnostic steps and community-verified fixes from Altium documentation and Stack Exchange.

## 1. Duplicate Item HRID Error When Generating Outputs from Copy-Paste

### Symptom

When trying to generate Gerber and/or NC Drill files, the error "Duplicate item HRID: SRC-<ProjectName>-130" appears. The error occurs after using CTRL-C/CTRL-V to duplicate items in the design. The items were not pasted on top of each other. Checking every pad for duplicates and changing designators to unique values doesn't fix the issue. CircuitMaker 2.2.1 on Windows 10.

### Root Cause

The Duplicate Item HRID error is caused by internal HRID (Human-Readable ID) conflicts that occur when items are copy-pasted within a project. The HRID is an internal identifier that should be unique but gets duplicated during copy-paste operations. The HRID is separate from the visible designator — changing designators doesn't fix the HRID conflict. The issue is in the cloud-based project data structure, not in the visible design data.

### Fix

1. **Clone the project to a new one**:
   - "The workaround for me was to clone the project to a new one"
   - "And Generate Output from the clone"
   - "No changes were necessary on the clone; it 'just worked'"
   - Right-click the project name in the Projects sidebar
   - Click Clone

2. **Generate outputs from the clone**:
   - "The original project, however, remains 'broken'"
   - "So this is more a workaround than a solution"
   - Use the cloned project
   - For generating outputs

3. **Avoid copy-paste within the same project**:
   - The issue is caused by copy-paste
   - Creating duplicate HRIDs
   - Create new components instead of copying
   - Or clone the project before making changes

4. **Check for duplicate folder HRIDs**:
   - "Two folders cannot have the same name in the same area of the folder structure"
   - "Trying to do so will result in a Duplicate Folder HRID error"
   - Check for duplicate folder names
   - In the project structure

5. **Use unique names for pasted folders**:
   - "Paste the folder structure to another temporary area"
   - "Then rename the top level folder"
   - "Then drag and drop back to where you really want the folder to be"
   - For folder structure duplication

6. **Update to CircuitMaker 2.3.0 or later**:
   - Check if the HRID duplication issue
   - Has been fixed in newer versions
   - Update to the latest version
   - From Altium

7. **Report the issue on the CircuitMaker Forum**:
   - "The CircuitMaker Forum is the best place to report issues"
   - "Please provide as many details as possible"
   - "As well as images and any step-by-step instructions"
   - Report the HRID duplication bug

### Community Report

> "What does this error mean: Duplicate item HRID: SRC-<ProjectName>-130. Presumably it means that there's a duplicate of some item. I used CTRL-C/CTRL-V to duplicate some items. I have gone through and clicked on every pad to make sure there weren't two on top of each other. The workaround for me was to clone the project to a new one, and Generate Output from the clone. No changes were necessary on the clone; it 'just worked.' The original project remains 'broken.' To Clone a project, right-click on the project name in the Projects sidebar and click Clone."

## 2. Cloud Sync Issues Requiring Internet Connection for Output Generation

### Symptom

When trying to generate outputs (Gerber, NC Drill, BOM), the release process fails with sync errors. CircuitMaker requires cloud connectivity for most operations. If the internet connection is unstable or the cloud servers are unavailable, output generation fails. The error message may indicate a sync failure or timeout.

### Root Cause

"Since CircuitMaker requires cloud connectivity, you may occasionally encounter sync errors. CircuitMaker's cloud-based architecture requires your design to be synced before generating outputs." CircuitMaker stores all projects on Altium's cloud servers. Before generating outputs, the design must be synced to the cloud. If the sync fails (due to network issues, server problems, or unsaved changes), output generation can't proceed.

### Fix

1. **Save and commit manually before generating outputs**:
   - "If the release process fails, try saving and committing your design manually"
   - "Before attempting to generate outputs again"
   - Save the design
   - And commit changes to the cloud

2. **Verify internet connection**:
   - "CircuitMaker requires an internet connection for most operations"
   - "Including generating and downloading output files"
   - Verify your internet connection
   - Is stable and fast enough

3. **Check Altium server status**:
   - If the sync fails consistently
   - Check if Altium's servers
   - Are experiencing downtime
   - Check the Altium status page

4. **Retry after sync failure**:
   - If the sync fails
   - Wait a few minutes
   - And retry the output generation
   - After ensuring the design is saved

5. **Use alternative software for offline work**:
   - "If you need offline capabilities"
   - "You may need to consider alternative PCB design software"
   - CircuitMaker can't work offline
   - Consider Altium Designer or KiCad for offline use

6. **Check firewall and proxy settings**:
   - Firewall or proxy settings
   - May block CircuitMaker's cloud sync
   - Add CircuitMaker to the firewall exclusion list
   - And configure proxy settings

7. **Download output files after generation**:
   - "Your output files are stored on Altium's servers"
   - "You need to download them to a local folder"
   - After successful generation
   - Download the output files locally

### Community Report

> "Since CircuitMaker requires cloud connectivity, you may occasionally encounter sync errors. If the release process fails, try saving and committing your design manually before attempting to generate outputs again. CircuitMaker requires an internet connection for most operations, including generating and downloading output files. The software's cloud-based architecture means your design data and outputs are stored on Altium's servers. If you need offline capabilities, you may need to consider alternative PCB design software."

## 3. Component Search Engine Nexar API Migration from Octopart

### Symptom

After updating to CircuitMaker 2.3.0, the component search engine behaves differently. Search results may differ from previous versions. Some components that were previously found may no longer appear in search results. The component search has been migrated from Octopart API to Nexar API.

### Root Cause

"Component search engine has been replaced from Octopart API to Nexar API." CircuitMaker 2.3.0 replaced the component search backend from Octopart to Nexar. Nexar is Altium's own API service that may have different component coverage, different search algorithms, and different data sources than Octopart. Components that were available through Octopart may not be available through Nexar, or may have different attributes.

### Fix

1. **Update to CircuitMaker 2.3.0 or later**:
   - "Component search engine has been replaced from Octopart API to Nexar API"
   - "Version 2.3.0, Build: 3, Date: 1 July 2024"
   - Install the latest version
   - Which uses the Nexar API

2. **Search with different terms**:
   - The Nexar API may use
   - Different search algorithms
   - Try different search terms
   - Or manufacturer part numbers

3. **Use manufacturer part numbers**:
   - If the component name search
   - Doesn't find the component
   - Try searching with the
   - Exact manufacturer part number

4. **Check Nexar component coverage**:
   - Nexar may have different
   - Component coverage than Octopart
   - Check if your component
   - Is available in the Nexar database

5. **Create custom components**:
   - If a component is not found
   - In the Nexar search
   - Create a custom component
   - Using the Component Editor

6. **Report missing components**:
   - If important components are missing
   - From the Nexar database
   - Report to Altium
   - Via the CircuitMaker Forum

7. **Use Octopart website as fallback**:
   - If the Nexar search doesn't find a component
   - Search on the Octopart website
   - To find the manufacturer part number
   - Then search in CircuitMaker with that number

### Community Report

> "Component search engine has been replaced from Octopart API to Nexar API. Version 2.3.0, Build: 3, Date: 1 July 2024. The following sections list the release notes for publicly released versions of CircuitMaker (2.1 onwards)."

## 4. CoDesigner Fusion 360 Direct PCB Data Exchange

### Symptom

After CircuitMaker 2.3.0, CoDesigner support for Autodesk Fusion 360 has been added. Users want to exchange PCB data between CircuitMaker and Fusion 360 but don't know how to set it up. The CoDesigner panel is not visible or doesn't connect to Fusion 360.

### Root Cause

"Altium CoDesigner added to CircuitMaker, supporting direct PCB data exchange between CircuitMaker and Autodesk Fusion 360. In CircuitMaker, CoDesigner is access via the Fusion 360 CoDesigner panel (View ribbon). In Autodesk Fusion 360, install the AltiumAutodeskFusion<2.8.0.6 or higher> plugin." CoDesigner requires both CircuitMaker 2.3.0+ and the Altium Autodesk Fusion plugin to be installed in Fusion 360. Without the plugin on the Fusion 360 side, the data exchange can't occur.

### Fix

1. **Update CircuitMaker to 2.3.0 or later**:
   - "Altium CoDesigner added to CircuitMaker"
   - "Supporting direct PCB data exchange"
   - "Between CircuitMaker and Autodesk Fusion 360"
   - Install CircuitMaker 2.3.0+

2. **Install the Altium Autodesk Fusion plugin**:
   - "In Autodesk Fusion 360, install the AltiumAutodeskFusion<2.8.0.6 or higher> plugin"
   - "Which can be downloaded from the Altium website"
   - Download the plugin from Altium
   - And install it in Fusion 360

3. **Access CoDesigner via View ribbon**:
   - "In CircuitMaker, CoDesigner is access via the Fusion 360 CoDesigner panel"
   - "(View ribbon)"
   - Go to the View ribbon tab
   - And open the Fusion 360 CoDesigner panel

4. **Configure the connection**:
   - In the CoDesigner panel
   - Configure the connection
   - Between CircuitMaker and Fusion 360
   - Follow the setup wizard

5. **Verify data exchange**:
   - After setup
   - Test the data exchange
   - By sending a simple PCB design
   - From CircuitMaker to Fusion 360

6. **Check plugin version compatibility**:
   - Ensure the plugin version
   - Is 2.8.0.6 or higher
   - Older versions may not
   - Work with CircuitMaker 2.3.0

7. **Consult Altium documentation**:
   - For detailed setup instructions
   - Consult the Altium CoDesigner documentation
   - For CircuitMaker and Fusion 360
   - Integration guide

### Community Report

> "Altium CoDesigner added to CircuitMaker, supporting direct PCB data exchange between CircuitMaker and Autodesk Fusion 360. In CircuitMaker, CoDesigner is access via the Fusion 360 CoDesigner panel (View ribbon). In Autodesk Fusion 360, install the AltiumAutodeskFusion<2.8.0.6 or higher> plugin, which can be downloaded from the Altium website."

## 5. Crash During Symbol Search in Select Item Revision Dialog

### Symptom

CircuitMaker crashes when searching for a symbol in the Select Item Revision dialog. The crash occurs during the search operation, not when selecting a component. The crash has been reported and fixed in CircuitMaker 2.3.0. Users on older versions may still experience this crash.

### Root Cause

"Crash occurred during searching for a symbol in the Select Item Revision dialog." The crash is caused by a bug in the symbol search routine within the Select Item Revision dialog. The search routine may encounter a null reference or memory access violation when processing certain search queries. This was fixed in CircuitMaker 2.3.0.

### Fix

1. **Update to CircuitMaker 2.3.0 or later**:
   - "Crash occurred during searching for a symbol in the Select Item Revision dialog"
   - This crash was fixed in version 2.3.0
   - Update to the latest version
   - To resolve the crash

2. **Use Ctrl+Alt+Insert for frozen crashes**:
   - "If there is a crash that does not raise an exception dialog"
   - "And the software hangs in an apparent frozen state"
   - "Use the Ctrl+Alt+Insert keyboard shortcut to force a crash report"
   - "This dialog may pop up behind the CircuitMaker application window"

3. **Send crash reports**:
   - "CircuitMaker provides you with the ability to send a crash report"
   - "Through to the Altium Developers"
   - "In the error/exception dialog, click the Send Report button"
   - "And add a description of what you were doing at the time"

4. **Avoid the Select Item Revision dialog**:
   - If the crash persists on older versions
   - Avoid using the Select Item Revision dialog
   - Use alternative methods
   - To find and select components

5. **Search with simpler terms**:
   - If the crash occurs with specific search terms
   - Try simpler or shorter search terms
   - That may not trigger
   - The null reference bug

6. **Report on the CircuitMaker Forum**:
   - "The CircuitMaker Forum is the best place to report issues"
   - "Please provide as many details as possible"
   - "As well as images and any step-by-step instructions to recreate the issue"
   - Report the crash with details

7. **Check for dialog behind the application**:
   - "This dialog may pop up behind the CircuitMaker application window"
   - If CircuitMaker appears frozen
   - Check behind the application window
   - For the crash report dialog

### Community Report

> "Crash occurred during searching for a symbol in the Select Item Revision dialog. CircuitMaker provides you with the ability to send a crash report through to the Altium Developers, should you encounter an error in the software. In the error/exception dialog that appears, simply click the Send Report button and add a description of what you were doing at the time. If there is a crash that does not raise an exception dialog, use the Ctrl+Alt+Insert keyboard shortcut to force a crash report."

## 6. Additional CircuitMaker Issues

### Outputs Could Not Be Generated Due to Error

**Issue**: "Outputs could not be generated due to an error."
**Fix**: Update to CircuitMaker 2.3.0 or later. Save and commit the design before generating outputs. Check for Duplicate Item HRID errors. Clone the project if the original is broken.

### Pad Holes Not Rendered Correctly in PCB Footprint Library Editor

**Issue**: "Pad holes were not rendered correctly in the PCB Footprint Library editor."
**Fix**: Update to CircuitMaker 2.3.0 or later. This was fixed in version 2.3.0. If the issue persists, report on the CircuitMaker Forum with details.

### Shortcuts Not Working in Schematic and Symbol Library Editor

**Issue**: "Some shortcuts were not working correctly in the schematic editor and the Symbol Library editor."
**Fix**: Update to CircuitMaker 2.3.0 or later. This was fixed in version 2.3.0. Check keyboard shortcut settings in Preferences.

### Part Rotation and Visibility Reset on Update

**Issue**: "Part rotation and visibility of its parameters were reset upon updating parts to their latest revisions."
**Fix**: Update to CircuitMaker 2.3.0 or later. This was fixed in version 2.3.0. Before updating parts, note their rotation and visibility settings. Reapply settings after update if needed.

### View Configuration Button Missing in Footprint Editor

**Issue**: "The View Configuration button was missing from the View ribbon tab of the editor when defining a footprint for a custom component."
**Fix**: Update to CircuitMaker 2.3.0 or later. This was fixed in version 2.3.0. Use alternative view settings if the button is still missing.

### Design Rule Check (DRC)

**Issue**: How to verify the PCB design before generating outputs.
**Fix**: "Go to Tools > Design Rule Check and start the DRC process. CircuitMaker will analyze the board against the rules you set earlier and generate a report. If the report lists any violations, review them carefully and fix them before moving on."

### Engineering Change Order (ECO)

**Issue**: How to synchronize schematic and PCB layout.
**Fix**: "Go to the top menu and select Design > Update PCB. This will open the Engineering Change Order window. Click Validate Changes to check the update. If everything looks correct, click Execute Changes to apply the update."

## Best Practices

1. **Clone projects before making changes** — avoids Duplicate Item HRID errors
2. **Save and commit before generating outputs** — prevents cloud sync failures
3. **Update to CircuitMaker 2.3.0+** — fixes crashes and adds Nexar API
4. **Install Altium Fusion plugin for CoDesigner** — enables PCB data exchange
5. **Use Ctrl+Alt+Insert for frozen crashes** — forces a crash report
6. **Always run DRC before generating outputs** — catches design errors
7. **Use manufacturer part numbers for component search** — Nexar API may need exact numbers
8. **Maintain stable internet connection** — CircuitMaker requires cloud connectivity
9. **Send crash reports with descriptions** — helps Altium reproduce and fix issues
10. **Report issues on the CircuitMaker Forum** — best place for community support
