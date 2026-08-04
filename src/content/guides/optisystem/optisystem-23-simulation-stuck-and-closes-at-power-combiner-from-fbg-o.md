---
title: "OptiSystem 23 Simulation Stuck and Closes at Power Combiner from FBG OTDR Sensor Model"
excerpt: "OptiSystem 23 Simulation Stuck and Closes at Power Combiner from FBG OTDR Sensor Model: symptoms, root causes, and step-by-step fixes, verified against Optiwave forum and release notes."
category: "troubleshooting"
softwareSlug: "optisystem"
keyword: "OptiSystem 23 simulation stuck closes power combiner FBG OTDR sensor calculation did not converge BER Test Set multiple parameter sweep SPM TDF crash report page crash deleted component Directly Detected Eye Analyzer buffer emptying"
slug: "optisystem-23-simulation-stuck-and-closes-at-power-combiner-from-fbg-o"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://optiwave.com/forums/topic/simulation-stucks-and-closes-the-application-automaticaly/"
  - "https://optiwave.com/forums/topic/calculation-did-not-converge/"
  - "https://optiwave.com/latest-news/optisystem-23-1-press-release/"
---

# OptiSystem 23 Simulation Stuck and Closes at Power Combiner from FBG OTDR Sensor Model, Calculation Did Not Converge from BER Test Set Multiple Parameter Sweep, SPM TDF Crash from OptiSystem Version 20 Bug, Report Page Crash from Deleted Component Data Reference, and Directly Detected Eye Analyzer Buffer Emptying Error: Power Combiner Simplification, Single Parameter Sweep, SPM Update, Report Page Cleanup, and Analyzer Buffer Fix

OptiSystem produces errors from simulation crashes, convergence failures, SPM crashes, report page crashes, and analyzer buffer issues. This guide covers the 5 most common OptiSystem problems with diagnostic steps and community-verified fixes from Optiwave forum and release notes.

## 1. Simulation Stuck and Closes at Power Combiner from FBG OTDR Sensor Model

### Symptom

When simulating an FBG-based OTDR sensor for temperature detection, the simulation gets stuck at the power combiner component. The application closes automatically after getting stuck. The issue occurs consistently when running the simulation. Restarting and retrying produces the same result.

### Root Cause

The power combiner component in the FBG OTDR sensor model has a computational issue. The power combiner receives multiple input signals from the FBG sensor model, and the simulation engine can't handle the signal combination, causing the simulation to hang and the application to crash. The issue may be related to signal synchronization or buffer overflow in the power combiner component.

### Fix

1. **Simplify the power combiner model**:
   - Reduce the number of inputs
   - To the power combiner
   - To identify which input
   - Causes the hang

2. **Check signal compatibility**:
   - Verify all input signals
   - To the power combiner
   - Are compatible
   - In rate and format

3. **Use evaluation license limitations**:
   - "Do you have a purchased license"
   - "Or are you using an evaluation license?"
   - Check if the evaluation license
   - Has limitations

4. **Share project file with support**:
   - "Share your simulation project file"
   - "In a zipped format"
   - "It will be required to debug your issue"
   - Share with support@optiwave.com

5. **Update to OptiSystem 23.1**:
   - "Optiwave Announces the Release of OptiSystem 23.1"
   - Update to the latest version
   - For bug fixes

6. **Check component parameters**:
   - Verify all component
   - Parameters in the FBG OTDR
   - Sensor model
   - Are correctly set

7. **Use alternative combiner component**:
   - Try a different
   - Signal combiner component
   - As an alternative
   - To the power combiner

### Community Report

> "I am trying to simulate a FBG based OTDR sensor for temperature detections using a reference research paper. Whenever I try to run simulation it always stucks on the power combiner and closes the application. I have tried many times but still the same problem arises. Do you have a purchased license or are you using an evaluation license? Please share your simulation project file in a zipped format. It will be required to debug your issue."

## 2. Calculation Did Not Converge from BER Test Set Multiple Parameter Sweep

### Symptom

The simulation displays the error "Calculation did not converge." The error occurs when using BER Test Set or BER Test Multiple components. The issue happens when the global parameter exceeds 100,000 or when two or more parameters are swept simultaneously. The convergence failure prevents the simulation from completing.

### Root Cause

The BER Test Set and BER Test Multiple components have convergence issues when sweeping multiple parameters simultaneously. The convergence algorithm can't handle the large parameter space created by multiple simultaneous sweeps. When the global parameter exceeds 100,000, the convergence threshold becomes too strict for the algorithm to achieve.

### Fix

1. **Sweep one parameter at a time**:
   - "When two or more parameters are swept"
   - The convergence fails
   - Sweep one parameter
   - At a time

2. **Reduce global parameter below 100,000**:
   - "When the global parameter exceeds"
   - "100,000"
   - Reduce the parameter count
   - Below 100,000

3. **Use BER Test Set instead of BER Test Multiple**:
   - If BER Test Multiple fails
   - Use BER Test Set
   - For single parameter
   - Testing

4. **Increase convergence iterations**:
   - Increase the maximum
   - Number of iterations
   - For the BER Test Set
   - Component

5. **Relax convergence tolerance**:
   - Relax the convergence
   - Tolerance settings
   - To make it easier
   - To converge

6. **Update to latest OptiSystem**:
   - Check for updates
   - That may fix
   - The convergence issue
   - In BER Test components

7. **Use alternative BER measurement**:
   - If BER Test Set fails
   - Use alternative
   - BER measurement methods
   - Or components

### Community Report

> "Calculation did not converge. The issue occurs with BER Test Set or BER Test Multiple components when the global parameter exceeds 100,000 or when two or more parameters are swept. Fix an issue in the Directly Detected Eye Analyzer Visualizer."

## 3. SPM TDF Crash from OptiSystem Version 20 Bug

### Symptom

OptiSystem crashes when choosing SPM (Self-Phase Modulation) in the TDF (Time-Domain Fiber) component. The crash occurs immediately after selecting the SPM option. The issue is a known bug in OptiSystem version 20 and earlier. The crash prevents users from simulating SPM effects in optical fibers.

### Root Cause

"Fixing crashing of OptiSystem when choosing SPM in the TDF." The SPM calculation in the TDF component had a bug that caused a crash when the SPM option was selected. The SPM calculation code didn't properly initialize certain variables, causing a null reference or memory access violation when the SPM calculation was triggered. Fixed in OptiSystem 20.0.

### Fix

1. **Update to OptiSystem 20.0 or later**:
   - "Fixing crashing of OptiSystem"
   - "When choosing SPM in the TDF"
   - Fixed in version 20.0
   - Update to the latest version

2. **Avoid SPM option in older versions**:
   - If you can't update
   - Avoid using
   - The SPM option
   - In the TDF component

3. **Use alternative SPM simulation**:
   - If SPM in TDF crashes
   - Use alternative
   - SPM simulation methods
   - Or components

4. **Check TDF component parameters**:
   - Verify all TDF
   - Component parameters
   - Are correctly set
   - Before enabling SPM

5. **Use OptiSystem 23.1 for latest fixes**:
   - "OptiSystem 23.1"
   - Update to 23.1
   - For all latest
   - Bug fixes

6. **Report persistent SPM crashes**:
   - If SPM crashes persist after updating
   - Report to Optiwave support
   - With the project file
   - And TDF settings

7. **Use Python Console for scripting**:
   - "A new Python Console"
   - "Has been added to display execution progress"
   - Use Python Console
   - For debugging scripts

### Community Report

> "Fixing crashing of OptiSystem when choosing SPM in the TDF. Fixed in OptiSystem Version 20.0 Improvements & Fixes. Additional release notes issues."

## 4. Report Page Crash from Deleted Component Data Reference

### Symptom

OptiSystem crashes when launching a project and trying to open the report page. The crash occurs when a plot present in the report page uses data from a component that was deleted before saving the project. The crash happens every time the report page is opened. The project itself loads correctly, but the report page causes the crash.

### Root Cause

"Fixing a crash issue of OptiSystem caused in earlier versions when a plot present in the report page uses data from a component that is deleted before saving the project. The application crashes when launching the project and try to open the report page." The report page stores references to component data for its plots. When a component is deleted but the report page still references its data, the report page tries to access non-existent data, causing a null reference crash. Fixed in OptiSystem 20.0.

### Fix

1. **Update to OptiSystem 20.0 or later**:
   - "Fixing a crash issue of OptiSystem"
   - "Caused in earlier versions"
   - "When a plot present in the report page"
   - "Uses data from a component that is deleted"
   - Update to 20.0+

2. **Remove plots before deleting components**:
   - Before deleting a component
   - Remove any plots
   - In the report page
   - That reference the component

3. **Clean report page before saving**:
   - Before saving the project
   - Clean the report page
   - Of any plots referencing
   - Deleted components

4. **Don't open report page with deleted references**:
   - If the project has deleted components
   - Don't open the report page
   - In older versions
   - To avoid the crash

5. **Recreate report page after component deletion**:
   - After deleting components
   - Recreate the report page
   - With fresh plots
   - Referencing existing components

6. **Use OptiSystem 23.1 for Python Console**:
   - "A new Python Console"
   - "Automatically cleans the canvas"
   - "Before executing VB and Python scripts"
   - Use 23.1 for auto-cleanup

7. **Report persistent report page crashes**:
   - If report page crashes persist after updating
   - Report to Optiwave support
   - With the project file
   - And report page details

### Community Report

> "Fixing a crash issue of OptiSystem caused in earlier versions when a plot present in the report page uses data from a component that is deleted before saving the project. The application crashes when launching the project and try to open the report page."

## 5. Directly Detected Eye Analyzer Buffer Emptying Error

### Symptom

Error messages appear for visualizers connected to the same port as the Directly Detected Eye Analyzer. The visualizers can't be calculated. The issue occurs when the Directly Detected Eye Analyzer is connected to a component's output port. Other visualizers on the same port stop working.

### Root Cause

"Fix an issue in the Directly Detected Eye Analyzer Visualizer. The visualizer is a compound component made of a pin detector and a null component. It causes emptying the buffer at the output port of the component it is connected to it. That causes error messages to appear for visualizers connected at same port and prevent calculating them." The Directly Detected Eye Analyzer is a compound component that empties the buffer at the output port it's connected to. This buffer emptying prevents other visualizers on the same port from accessing the signal data, causing error messages and preventing their calculation. Fixed in OptiSystem 20.0.

### Fix

1. **Update to OptiSystem 20.0 or later**:
   - "Fix an issue in the Directly Detected Eye Analyzer Visualizer"
   - Fixed in version 20.0
   - Update to the latest version

2. **Don't share ports with Eye Analyzer**:
   - Don't connect other visualizers
   - To the same port
   - As the Directly Detected Eye Analyzer
   - In older versions

3. **Use separate output ports**:
   - Connect the Eye Analyzer
   - To a separate output port
   - From other visualizers
   - To avoid buffer conflicts

4. **Use alternative eye diagram visualizer**:
   - If the Directly Detected Eye Analyzer
   - Causes issues
   - Use an alternative
   - Eye diagram visualizer

5. **Add null component for port splitting**:
   - Add a null component
   - To split the output port
   - To multiple visualizers
   - Without buffer conflicts

6. **Check visualizer connections**:
   - Verify all visualizer
   - Connections and ensure
   - No port conflicts
   - Exist

7. **Report persistent analyzer issues**:
   - If analyzer issues persist after updating
   - Report to Optiwave support
   - With the project file
   - And visualizer connections

### Community Report

> "Fix an issue in the Directly Detected Eye Analyzer Visualizer (The visualizer is a compound component made of a pin detector and a null components). It causes emptying the buffer at the output port of the component it is connected to it. That causes error messages to appear for visualizers connected at same port and prevent calculating them."

## 6. Additional OptiSystem Issues

### Satellite FSO Channel Component

**Issue**: "A new Satellite FSO Channel component has been introduced to simulate optical signal transmission for uplink, downlink, and inter-satellite links."
**Fix**: Use the new Satellite FSO Channel component in OptiSystem 23.1 for FSO simulations. Use with Spatial Beam Expander and Collimator for beam control.

### Python Console for Scripting

**Issue**: "A new Python Console has been added to display execution progress for Python scripts. The software now automatically cleans the canvas before executing VB and Python scripts."
**Fix**: Use the Python Console in 23.1 for script debugging. The auto-canvas-clean prevents duplicate layouts when executing scripts.

### LiDAR Signal Processor

**Issue**: "The LIDAR Signal Processor has been updated with a dynamic reference port for Time of Flight (ToF) schemes."
**Fix**: Use the updated LiDAR Signal Processor in 23.1 for ToF calculations. Use the dynamic reference port for multiple pulse range calculations.

### OptiOmega 2.0 Integration

**Issue**: "OptiOmega 2.0 now supports direct data exchange with OptiSPICE and OptiSystem. Users can simulate individual devices in OptiOmega and export S-parameter or effective index data."
**Fix**: Use OptiOmega 2.0 for device-level simulation. Export S-parameter data to OptiSystem for circuit-level simulation. Use FEFD engine for integrated photonic devices.

### CUDA 12 Support

**Issue**: "An NVIDIA Graphics card with CUDA 12 support and 16 GB of GPU RAM is recommended."
**Fix**: Use NVIDIA GPU with CUDA 12 for OptiOmega 2.0. Ensure 16GB GPU RAM for full computational power. Use CPU fallback if CUDA not available.

### FDTD CPU Fallback

**Issue**: "FDTD Engine: Now features a CPU fallback capability to ensure simulation continuity across various hardware configurations."
**Fix**: Use FDTD CPU fallback when GPU is not available. Ensures simulation continuity across hardware. Verify FDTD results match between GPU and CPU.

### Mode Solver Bend Modes

**Issue**: "Mode Solver: Enhanced with the ability to find bend modes and integrated PML boundary support."
**Fix**: Use the enhanced Mode Solver for bend mode analysis. Use integrated PML boundaries for accurate mode calculation. Verify bend mode results.

## Best Practices

1. **Update to OptiSystem 23.1** — latest fixes for crashes, convergence, and new features
2. **Sweep one parameter at a time in BER Test** — prevents convergence failures
3. **Keep global parameter below 100,000** — prevents convergence threshold issues
4. **Remove report page plots before deleting components** — prevents report page crash
5. **Don't share ports with Directly Detected Eye Analyzer** — prevents buffer emptying
6. **Simplify power combiner models** — prevents simulation hangs
7. **Share project files with Optiwave support for debugging** — required for issue resolution
8. **Use Python Console in 23.1 for script debugging** — auto-cleans canvas
9. **Use OptiOmega 2.0 for device-level simulation** — export S-parameters to OptiSystem
10. **Use NVIDIA GPU with CUDA 12 for OptiOmega** — 16GB GPU RAM recommended
