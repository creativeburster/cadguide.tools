---
title: "Autodesk Dynamo Revit 2025 Migration and Crash Errors: Old Graphs Return Null Without Error Messages from IronPython2 to CPython3 Migration Requiring Script Update, Running Script Crashes Revit 2025 from Incompatible Package Versions Requiring Package Update or Removal, Revit 2025 Dynamo and Unifi Content Catalog Conflict Requiring Unifi 3.10.0.5 Update or Content Catalog Migration, Multi-Version Revit Environments Require Separate Graph Versions per Revit Release, and Troubleshooting Harder in New Dynamo Version from Null Returns Without Warnings Requiring Node-by-Node Freeze Debugging"
excerpt: "Autodesk Dynamo fails for 5 distinct reasons: old graphs return null without error messages from IronPython2 to CPython3 migration requiring script update, running script crashes Revit 2025 from incompatible package versions requiring package update or removal, Revit 2025 Dynamo and Unifi Content Catalog conflict requiring Unifi 3.10.0.5 update or Content Catalog migration, multi-version Revit environments require separate graph versions per Revit release, and troubleshooting harder in new Dynamo version from null returns without warnings requiring node-by-node freeze debugging. We cover each with fixes from Dynamo Forum and GitHub."
category: "migration-and-crash-errors"
softwareSlug: "autodesk-dynamo"
keyword: "Autodesk Dynamo Revit 2025 old graphs return null IronPython2 CPython3 migration script update running script crashes Revit 2025 incompatible package versions Unifi Content Catalog conflict 3.10.0.5 multi-version Revit separate graph versions troubleshooting harder null returns without warnings node-by-node freeze debugging"
slug: "autodesk-dynamo-revit-2025-migration-crash-errors-old-graphs-null-ironpython2-cpython3-script-crash-revit-2025-incompatible-packages-unifi-content-catalog-conflict-multi-version"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-31"
sources:
  - "https://forum.dynamobim.com/t/troubleshooting-graph-revit-2025/113137"
  - "https://github.com/DynamoDS/Dynamo/issues/15090"
  - "https://forum.dynamobim.com/t/revit-2025-and-old-dynamo-routines/106066"
---

# Autodesk Dynamo Revit 2025 Migration and Crash Errors: Old Graphs Return Null Without Error Messages from IronPython2 to CPython3 Migration Requiring Script Update, Running Script Crashes Revit 2025 from Incompatible Package Versions Requiring Package Update or Removal, Revit 2025 Dynamo and Unifi Content Catalog Conflict Requiring Unifi 3.10.0.5 Update or Content Catalog Migration, Multi-Version Revit Environments Require Separate Graph Versions per Revit Release, and Troubleshooting Harder in New Dynamo Version from Null Returns Without Warnings Requiring Node-by-Node Freeze Debugging

Autodesk Dynamo's Python migration, package compatibility, add-in conflicts, multi-version environments, and debugging difficulties produce errors from IronPython2 to CPython3 transitions, package version mismatches, and null returns without warnings. This guide covers the 5 most common Dynamo problems with diagnostic steps and community-verified fixes from Dynamo Forum and GitHub.

## 1. Old Graphs Return Null Without Error Messages from IronPython2 to CPython3 Migration

### Symptom

Updating a Dynamo graph made in Revit 2023 for Revit 2025. Nothing errors out — all nodes just return Null. Have to freeze node for node to inch through the entire graph to find which node isn't working. The start node returns null, but when freezing the following node, it returns output just fine.

### Root Cause

Dynamo in Revit 2025 uses CPython3 instead of IronPython2. Old graphs with Python scripts written for IronPython2 don't work in CPython3. The Python engine change causes scripts to fail silently — returning null instead of throwing errors. Custom nodes using CLR/Python calls may break the CLR referencing in Dynamo, causing cascading null returns.

### Fix

1. **Update IronPython2 scripts to CPython3**:
   - "Best practice here is to update your IronPython2 scripts for CPython3"
   - "Most will update without issue"
   - Change Python script engine from IronPython2 to CPython3
   - Update syntax differences (e.g., `print` statements, string formatting)

2. **Install IronPython2 engine for backward compatibility**:
   - "If you and your company doesn't want to bother and don't mind running software which hasn't been patched since early 2020 (IronPython2)"
   - "Then you can install the right IronPython version for your Dynamo version"
   - Install DynamoIronPython2.7 package
   - Read the package details closely

3. **Test without custom nodes**:
   - "Try it without any custom nodes"
   - "I encountered a pretty nasty bug lately — the cause was some clr/python based calls that for some reason Dynamo did not like"
   - "Ended up effectively breaking clr referencing until I rebooted Dynamo"
   - Remove custom nodes and test with out-of-the-box nodes

4. **Use node-by-node freeze debugging**:
   - "I have to freeze node for node to inch through the entire graph"
   - Freeze nodes one by one from the end
   - Check if the preceding node returns data when the following is frozen
   - This identifies the failing node

5. **Update packages**:
   - "If the Python is in a package, updating to a new package without an IronPython2 dependency would be the best path forward"
   - Check package versions in Package Manager
   - Update to versions compatible with CPython3
   - Remove packages with IronPython2 dependencies

### Community Report

> "Is it just me or has troubleshooting gotten harder in the new Dynamo version? Nothing errors out, it all just returns Null, and I have to freeze node for node to inch through the entire graph. Try it without any custom nodes. I encountered a pretty nasty bug — the cause was some clr/python based calls that for some reason Dynamo did not like."

## 2. Running Script Crashes Revit 2025 from Incompatible Package Versions

### Symptom

Running a Dynamo script in Revit 2025 causes Revit to crash completely. The crash only happens in Revit 2025 — other versions work fine. External Revit add-ins were disabled and the same error appears. The script uses packages including Data-Shapes and BIMorph nodes.

### Root Cause

Some packages used in the graph are not updated for Revit 2025 (Core) and are only suitable for previous versions of Revit. When Dynamo tries to execute incompatible package nodes, it causes a crash instead of a graceful error. The crash happens because the package code makes assumptions about the Revit API that changed in 2025.

### Fix

1. **Update all packages to Revit 2025 compatible versions**:
   - "Some of the packages included in the script are not updated to Revit 2025 (Core) and are suitable for previous versions"
   - Open Package Manager in Dynamo for Revit 2025
   - Update all packages to latest versions
   - Check package documentation for Revit 2025 compatibility

2. **Remove incompatible packages**:
   - If a package doesn't have a Revit 2025 compatible version
   - Remove it from the graph
   - Replace with out-of-the-box nodes or custom Python
   - Contact the package developer for update timeline

3. **Test packages individually**:
   - "Have you tested all the packages used in this graph with Dynamo 3.0.x and Revit 2025?"
   - "On their own external to this graph"
   - Create a simple test graph for each package
   - Run in Revit 2025 to identify which package crashes

4. **Use standard Dynamo UI (not headless)**:
   - "This issue came when running through the standard Dynamo UI"
   - If using NonicaTAB or other headless runners
   - Test in standard Dynamo UI first
   - Headless execution may have different crash behavior

5. **Report the crash to Dynamo team**:
   - "I think that Dynamo shouldn't crash Revit in that scenario, it should be able to manage such exceptions"
   - Report on GitHub with the script and crash details
   - Include the Revit and Dynamo versions
   - Include the list of packages used

### Community Report

> "Running Script Crashes Revit and Dynamo. This only happens in Revit 2025. Some of the packages included in the script are not updated to Revit 2025 (Core) and are suitable for previous versions. I think that Dynamo shouldn't crash Revit in that scenario — it should be able to manage such exceptions."

## 3. Revit 2025 Dynamo and Unifi Content Catalog Conflict

### Symptom

In Revit 2025, if Unifi (now Content Catalog) is installed and you try to use Dynamo, Dynamo fails or Revit crashes. Both are Autodesk-owned products but can't run together. The user can't use two machines to work around the issue.

### Root Cause

The Unifi add-in (acquired by Autodesk in 2023) is not compatible with Revit 2025's Dynamo. The add-in interferes with Dynamo's API hooks, causing crashes. The old Unifi plugin needs to be updated to version 3.10.0.5 for Revit 2025 compatibility. Alternatively, users should migrate to the Content Catalog add-in (Autodesk's cloud-based replacement).

### Fix

1. **Update Unifi add-in to 3.10.0.5**:
   - "There's an update to the Unifi add-in 3.10.0.5 that in theory fixes it"
   - Download the update from the Unifi/Autodesk portal
   - Install the updated add-in
   - Restart Revit and test Dynamo

2. **Migrate to Content Catalog add-in**:
   - "If you wish to use the Autodesk solution you need to use the Content Catalog app and not the old UNIFI plugin"
   - Log in to your Autodesk account
   - Under Revit Extensions, download Content_Catalog_Revit_Addin
   - Uninstall the old Unifi plugin first

3. **Uninstall Unifi as workaround**:
   - "If revit or dynamo is crashing that would be on UNIFI and sadly you might need to uninstall it"
   - Uninstall the Unifi add-in
   - Use Dynamo without Unifi
   - Reinstall when a compatible version is available

4. **Wait for Revit 2026 support**:
   - "We were told Unifi (Now Content Catalog) will be supported thru Revit 2026"
   - If the update doesn't fix the issue
   - Wait for Revit 2026 which should have full Content Catalog support
   - Use Revit 2024 in the meantime

5. **Use separate machines**:
   - "I can't use 2 machines (which would partly solve the issue)"
   - If possible, use one machine with Unifi (no Dynamo)
   - And another with Dynamo (no Unifi)
   - This is not ideal but allows using both tools

### Community Report

> "In Revit 2025 if you have Unifi Installed and try use Dynamo, Dynamo Fails and or Revit crashes. There's an update to the Unifi add-in 3.10.0.5 that in theory fixes it. If you wish to use the Autodesk solution you need to use the Content Catalog app and not the old UNIFI plugin."

## 4. Multi-Version Revit Environments Require Separate Graph Versions per Revit Release

### Symptom

Need to maintain Dynamo scripts that work across Revit 2022, 2023, 2024, and 2025. Scripts that work in 2025 have issues in 2022. Installing IronPython for 2025 impacts 2022. Different Dynamo versions have different package versions. Clients run different Revit versions.

### Root Cause

"You can't load the same Python engine into old and new builds. You need to setup different Dynamo graphs for each Revit version." Each Revit version has a different Dynamo build with different package compatibility. IronPython2 and CPython3 engines conflict. Package versions differ between Dynamo versions. A graph written for one version may not work in another.

### Fix

1. **Create separate graph versions per Revit version**:
   - "Version your .dyns just like you do your .rfa, .rft, .rte and .rvt files"
   - Create a naming convention: `script_2022.dyn`, `script_2023.dyn`, etc.
   - Maintain separate versions for each Revit release
   - Don't try to make one graph work everywhere

2. **Configure packages for each environment**:
   - "Configure your standard packages in 2022"
   - "Get the list of packages installed in 2022, and find and install the versions for Revit 2023, 2024, and 2025"
   - Each Revit version has its own Dynamo package environment
   - Don't share package folders between versions

3. **Use the migration workflow**:
   - "Write a graph for 2022 and confirm it runs perfectly. Save it and close"
   - "Do a save as and open up the 2022 graph in your 2023 environment"
   - "Take note of any packages noted as 'not being the same version'"
   - "Update the graph as needed for 2023 so it runs perfectly again"
   - Repeat for 2024 and 2025

4. **Don't uninstall IronPython2**:
   - "Don't uninstall it"
   - "Your Python engines are part of your Dynamo environment"
   - "Each environment (way to launch Dynamo) has its own set of packages"
   - IronPython2 for 2022, CPython3 for 2025

5. **Use the 'Install Specified Version' feature**:
   - When opening a graph with different package versions
   - Dynamo shows a warning about version mismatch
   - Use "Install Specified Version" to install the correct package version
   - This ensures the graph runs as intended

### Community Report

> "I have to cater for clients who run different Revit versions, ranging from 2022 to 2025. You can't load the same Python engine into old and new builds. You need to setup different Dynamo graphs for each Revit version, and 'use the installed version' once you configure it. Version your .dyns just like you do your .rfa, .rft, .rte and .rvt files."

## 5. Troubleshooting Harder in New Dynamo Version from Null Returns Without Warnings

### Symptom

In the new Dynamo version (Revit 2025), troubleshooting graphs has become harder. Nodes return Null without any error messages or warnings. The user has to freeze nodes one by one to find the failing node. In older versions, nodes would show warning messages indicating the problem.

### Root Cause

The new Dynamo version (3.0.x) has different error handling behavior. Some nodes that previously threw warnings now silently return null. This is particularly common with nodes that interact with the Revit API — if the API call fails, the node returns null instead of a warning. CLR/Python issues can also cause silent failures that propagate null through the graph.

### Fix

1. **Use node-by-node freeze debugging**:
   - "I have to freeze node for node to inch through the entire graph to find out what node isn't working correctly"
   - Start from the end of the graph
   - Freeze the last node
   - Check if the preceding node returns data
   - Work backwards until you find the failing node

2. **Check for null inputs**:
   - "My guess is that either you are feeding nulls in or asking for a higher index than your list(s) have available"
   - "Both would trigger an error"
   - "Passing on nulls will generally just make more downstream errors also"
   - Use a Watch node to inspect data at each stage

3. **Follow warnings upstream**:
   - "Warnings will be consistently passed down the full length of the stream"
   - "If Element.GetLocation fails, the Point.Z will also fail"
   - Start from the first warning in the graph
   - Fix it before looking at downstream issues

4. **Check for nodes returning null by design**:
   - "Since Element.Host doesn't show a warning but the code block does, I'm guessing that Element.Host is returning 'null' but without throwing a warning as that's by design"
   - Some nodes return null without warnings
   - This is expected behavior, not a bug
   - Handle nulls explicitly with conditional logic

5. **Use Watch and Watch 3D nodes**:
   - Add Watch nodes after each critical node
   - Inspect the data at each step
   - Use Watch 3D for geometric data
   - This visual approach helps identify where data breaks

6. **Reboot Dynamo if CLR breaks**:
   - "Ended up effectively breaking clr referencing until I rebooted Dynamo"
   - If CLR/Python calls break, reboot Dynamo
   - Close and reopen Dynamo from Revit
   - This may restore CLR functionality

### Community Report

> "Is it just me or has troubleshooting gotten harder in the new Dynamo version? Nothing errors out, it all just returns Null, and I have to freeze node for node to inch through the entire graph. The start returns null, but when I freeze the following node, it returns the output just fine."

## 6. Additional Dynamo Issues

### Dynamo Not Working Properly in Revit 2025

**Issue**: "Dynamo not working properly in Revit 2025."
**Fix**: Update all packages. Check for IronPython2 dependencies. Test without custom nodes. Reinstall Dynamo from the Revit Add-ins manager.

### Element.Host Returns Null Without Warning

**Issue**: Element.Host node returns null without a warning, causing downstream failures.
**Fix**: "I'm guessing that Element.Host is returning 'null' but without throwing a warning as that's by design. This leads me to think that the initial Element being provided to both groups isn't valid, so start there." Check the input element validity.

### Package Version Mismatch Warnings

**Issue**: Dynamo shows warnings about different package versions when opening graphs.
**Fix**: "The Dynamo graph has a section that knows what version of each package was used. The warning is telling you 'this might not work for you so test carefully.'" Use "Install Specified Version" to match the original environment.

### Graph Works in 2025 but Fails in 2022

**Issue**: A working script for 2025 has issues with 2022.
**Fix**: "You can't load the same Python engine into old and new builds." Create a separate graph version for 2022. Install the correct package versions for 2022's Dynamo environment.

## Best Practices

1. **Update IronPython2 scripts to CPython3 for Revit 2025** — most will update without issue
2. **Install IronPython2 package for backward compatibility if needed** — read package details closely
3. **Test all packages individually in Revit 2025** — identify which package causes crashes
4. **Update Unifi to 3.10.0.5 or migrate to Content Catalog** — resolves Dynamo conflict
5. **Create separate graph versions per Revit version** — don't try to make one graph work everywhere
6. **Configure packages separately for each Revit environment** — don't share package folders
7. **Use the save-as migration workflow between versions** — update and test at each step
8. **Use node-by-node freeze debugging for null returns** — work backwards from the end
9. **Add Watch nodes at critical points** — inspect data at each stage
10. **Reboot Dynamo if CLR/Python calls break** — restores CLR referencing
