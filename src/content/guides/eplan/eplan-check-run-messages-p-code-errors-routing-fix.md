---
title: "EPLAN Check Run Messages: Decoding P-Code Errors, Symbol Library Mismatches, and Routing Failures"
excerpt: "EPLAN's check run generates structured message codes (P007xxx, P022xxx, P026xxx) that identify device function mismatches, missing symbol variants, and routing failures. We explain how to read the Message Management dialog, filter by severity, and resolve the most common check run errors."
category: "troubleshooting"
softwareSlug: "eplan"
keyword: "EPLAN check run messages error P-code routing failure symbol library fix"
slug: "eplan-check-run-messages-p-code-errors-routing-fix"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-07-30"
sources:
  - "https://eplan.help/en-us/Infoportal/Content/Plattform/2.9/Content/htm/errorhelp_k_start.htm"
  - "https://www.eplan.help/en-US/Infoportal/Content/Plattform/2025/Content/htm/msgmanagementgui_d_meldungsverwaltung.htm"
  - "https://www.eplan.help/en-US/Infoportal/Content/Plattform/2026/Content/htm/messages_p_026114.htm"
---

# EPLAN Check Run Messages: Decoding P-Code Errors, Symbol Library Mismatches, and Routing Failures

EPLAN's check run system scans a project for electrical design inconsistencies and outputs structured messages with numeric codes (e.g., `P007001`, `P022003`, `P026114`). Each code maps to a specific error class — device function mismatches, symbol library gaps, duplicate page numbers, or routing failures. The Message Management dialog (`Utilities > System messages`) is the central hub for reviewing and resolving these.

## Understanding Message Severity

EPLAN classifies system messages into four severity tiers:

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **Note** | Function completed; informational only | None — program continues normally |
| **Warning** | Function completed but may cause downstream issues | Investigate when convenient |
| **Error** | Function cannot execute; other program features remain available | Exit and restart EPLAN |
| **Fatal error** | Program is in undefined state | Exit and restart immediately |

## Reading the Message Management Dialog

After a check run, open **Message Management** (`Page navigator > popup menu > Messages`). Key columns:

- **Message number**: The P-code identifier (e.g., `P007001`)
- **DT**: The device tag of the faulty component; for connections, source and target DTs appear in parentheses
- **Message text**: Human-readable description of the error
- **Generated through**: Whether the message came from an **offline check** (manual run) or **online check** (real-time during editing)
- **Completed**: Checkbox to mark an error as corrected; filter on this to track remaining issues

Press **F1** on any selected message row to open the EPLAN help system with a detailed description and correction suggestion for that specific message code.

## Common Check Run Errors and Fixes

### P007001: Device Uses More Functions Than the Associated Part

The device in the schematic has more connection points or functions than its assigned part data. This typically happens when a part was swapped or the part data was not updated after schematic modifications.

**Fix**: Open the part in the **Parts Management** dialog and verify the function template matches the device's actual connection points. Either update the part's function count or assign a different part that matches.

### P022001: Symbol Library Not Found at Position

A symbol referenced in the project is missing from the configured symbol library path. This occurs after library migration or when a project is moved between workstations with different library configurations.

**Fix**: Go to **File > Settings > Projects > "Project name" > Management > Symbol libraries** and verify the correct `.ell` library file is referenced. If the library was moved, update the path or restore the library to its original location.

### P022003: Duplicate Page Number

Two or more pages share the same page identifier. This causes ambiguity in cross-references and navigation.

**Fix**: In the **Page Navigator**, sort by page name to locate duplicates. Rename one of the pages to a unique identifier. Use the **Filter** function to isolate all pages with the same name for quick comparison.

### P022019: Component or Symbol Has No Valid Function Definition

A placed symbol lacks a function definition (e.g., "PLC connection point", "Relay coil"). Without a function definition, EPLAN cannot perform connection logic or wire numbering.

**Fix**: Double-click the symbol → **Symbol / Function** tab → assign the correct function definition from the dropdown. If the symbol was imported from an old EPLAN 5 or EPLAN 21 project, it may carry a legacy function that needs manual remapping.

### P026114: Routing Failed

A connection cannot be routed in the 3D layout space. The placeholder in the message text specifies the sub-cause:

| Placeholder Text | Root Cause | Fix |
|------------------|------------|-----|
| No entry point found | The routing path network has no entry point near the connection point | Add a routing path entry point in the layout space |
| Cable connections not defined uniquely | The cable's connection points are ambiguous | Open the cable navigator, verify all connection definitions |
| The connection is protected | Protected connections cannot be auto-routed | Right-click the connection in the schematic → **Properties** → **Connection definition point** tab → uncheck **Protected routing** |
| No part number defined | The component lacks part data for generating a fitting | Assign a part number in the device properties |
| Fitting cannot be generated | The routing geometry cannot place a fitting at the junction | Check pipe/tube diameters match at the junction point |

## Exporting Messages for Analysis

For large projects with hundreds of check run messages, export the message database to CSV:

1. Open **Message Management** dialog
2. Click **File → Open** (export button)
3. Save as `.csv` file
4. Open in Excel for filtering, sorting, and team distribution

The export preserves all columns including message number, DT, message text, and completion status.

## Best Practice: Incremental Check Runs

After making corrections, run a **targeted check** on only the corrected messages:

1. In Message Management, check the **Completed** checkbox for each fixed item
2. Run the next check run with the **Only check corrected messages** option enabled
3. This confirms your fixes are valid without re-scanning the entire project

Set a message limit in **File > Settings > Projects > "Project name" > Management > Message management > Max. number of check run messages** to prevent performance degradation on very large projects (default: unlimited; recommended: 5,000).
