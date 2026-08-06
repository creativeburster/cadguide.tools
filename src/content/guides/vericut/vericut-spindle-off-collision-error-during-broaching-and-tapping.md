---
title: "VERICUT Spindle Off Collision Error During Broaching and Tapping"
excerpt: "VERICUT Spindle Off Collision Error During Broaching and Tapping: symptoms, root causes, and step-by-step fixes, verified against CGTech VERICUT Users' Forum."
category: "troubleshooting"
softwareSlug: "vericut"
keyword: "VERICUT spindle off collision error broaching tapping M29 CTL file cutter compensation not activated Process Cutter Comp Full Radius false collision detection corrupted fixture model C-axis turning tool spindle off check ActiveSpindleOnOffOverride macro broaching cycle not cutting stock DXF sweep insert profile"
slug: "vericut-spindle-off-collision-error-during-broaching-and-tapping"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-08-03"
sources:
  - "https://forum.cgtech.com/viewtopic.php?id=2185"
  - "https://forum.cgtech.com/viewtopic.php?id=498"
  - "https://forum.cgtech.com/viewtopic.php?id=2080"
---

# VERICUT Spindle Off Collision Error During Broaching and Tapping, Cutter Compensation Not Activated, False Collision Detection from Corrupted Fixture Model, C-Axis Turning Tool Spindle Off Check Override, and Broaching Cycle Not Cutting Stock: CTL File Configuration, Process Cutter Comp Setting, Model Replacement, and Macro Override

VERICUT's spindle detection, cutter compensation, collision detection, C-axis configuration, and broaching cycle produce errors from unrecognized M-codes, disabled compensation settings, corrupted model triangles, spindle check overrides, and insert geometry issues. This guide covers the 5 most common VERICUT problems with diagnostic steps and community-verified fixes from CGTech VERICUT Users' Forum.

## 1. Spindle Off Collision Error During Broaching and Tapping from M29 Not Recognized

### Symptom

During simulation of a tapping cycle, VERICUT reports "Collision between cutter of the tool and cut stock with spindle off at record." The error occurs at the G84 tapping cycle. The spindle appears to be off in VERICUT even though the G-code includes M29 S582 (rigid tapping mode). The tool doesn't cut the stock — it just turns red for a collision.

### Root Cause

"Vericut thinks the spindle is off when tapping, so I'm looking for info on how to fix my .ctl file that will state that the spindle is on." The CTL (Control) file defines how VERICUT interprets G-code. If M29 is not configured as spindle motion in the Word/Address settings, VERICUT treats the spindle as off during the tapping cycle. "M29 is used for both right and left hand threads." In the user's CTL file, M29 was set to `IgnoreMacro`, which means VERICUT ignores it completely and doesn't activate the spindle. "Do I need to add both SpindleMotionCW and SpindleMotionCCW?" — for G84 (right-hand) and G74 (left-hand) tapping cycles, M29 needs to be recognized as spindle motion.

### Fix

1. **Configure M29 as SpindleMotionCW in Word/Address**:
   - Open Configuration > Word/Address
   - Find M29 in the M-word list
   - Change from `IgnoreMacro` to `SpindleMotionCW`
   - This tells VERICUT that M29 activates the spindle

2. **Add SpindleMotionCCW for left-hand tapping**:
   - For G74 (left-hand tapping), M29 also needs SpindleMotionCCW
   - Add both SpindleMotionCW and SpindleMotionCCW to M29
   - Or use separate M-codes for CW and CCW

3. **Check the G84 and G74 cycle definitions**:
   - Verify the tapping cycle is correctly defined
   - In the Cycles section of the CTL file
   - Ensure G84 and G74 are mapped to CyclesTap

4. **Verify the return to initial plane (G99)**:
   - Check that G99 is correctly defined
   - For the return to initial plane
   - An incorrect G99 definition can cause collision errors

5. **Check if the model is STL**:
   - STL models can have precision issues with holes
   - Try using a different model format (STEP, IGES)
   - Or increase the STL precision

6. **Test with M3 S0 as workaround**:
   - Adding M3 S0 (spindle on at 0 RPM) before the tapping cycle
   - Tricks VERICUT into thinking the spindle is on
   - This is a workaround, not a proper fix

7. **Contact CGTech tech support**:
   - If configuring M29 doesn't resolve the issue
   - Contact CGTech support
   - Provide the CTL file and G-code

### Community Report

> "I am getting an error 'Collision between cutter of the tool and cut stock with spindle off at record.' M[#923] (M29) is showing M29 IgnoreMacro. M29 is used for both right and left hand threads. Do I need to add both SpindleMotionCW and SpindleMotionCCW? Vericut thinks the spindle is off when tapping, so I'm looking for info on how to fix my .ctl file."

## 2. Cutter Compensation Not Activated in Simulation

### Symptom

When simulating a tool path with cutter compensation applied, VERICUT doesn't apply the cutter compensation. The tool continues to cut on the centerline of the tool path. This causes a collision that wouldn't actually happen on the real machine. The cutter comp G-code (G41/G42) is present in the program.

### Root Cause

"Click on the Setup in the Project Tree, then at the bottom of the Project Tree there should be two tabs. Click on the G-Code tab and where it says Process Cutter Comp change the pulldown to On - Default to Full Radius." The Process Cutter Comp setting in VERICUT controls whether cutter compensation is applied during simulation. If this setting is set to "Off," VERICUT ignores all G41/G42 codes and cuts on the centerline. This is a common issue for first-time VERICUT users who haven't configured the project settings.

### Fix

1. **Set Process Cutter Comp to On**.

2. **Choose the correct compensation mode**:
   - "On - Default to Full Radius" — uses the full tool radius for compensation
   - "On - Default to Tip" — uses the tool tip for compensation
   - Choose based on your machine's behavior
   - Most machines use Full Radius

3. **Verify G41/G42 codes are in the program**:
   - Check the G-code for G41 (left comp) and G42 (right comp)
   - Ensure the D value (tool radius offset) is correct
   - Verify G40 (cancel comp) is used after the compensated section
   - VERICUT reads these codes when Process Cutter Comp is On

4. **Check the tool definition**:
   - Ensure the tool has the correct diameter/radius defined
   - The compensation uses the tool's radius
   - If the radius is wrong, the compensated path will be wrong
   - Verify in the Tool Manager

5. **Check the control file (CTL) for G41/G42**:
   - In the CTL file, verify G41 and G42 are defined
   - They should map to CutterCompLeft and CutterCompRight
   - If they're set to IgnoreMacro, compensation won't work
   - Fix the CTL file if needed

6. **Test with a simple program**:
   - Create a simple program with G41/G42
   - Run it in VERICUT
   - Verify the compensated path is correct
   - Then test with the actual program

7. **Contact CGTech support**:
   - If Process Cutter Comp is On but compensation still doesn't work
   - Contact CGTech support
   - Provide the project file and G-code

### Community Report

> "Just started using VERICUT for the first time. When it comes to a tool that has cutter compensation applied, VERICUT doesn't seem to be applying the cutter comp in the simulation, the tool is continuing to cut on the centerline of tool. This then causes a collision that wouldn't actually happen. Click on the Setup in the Project Tree, click on the G-Code tab and where it says Process Cutter Comp change the pulldown to On - Default to Full Radius. That worked for me also!"

## 3. False Collision Detection from Corrupted Fixture Model

### Symptom

VERICUT reports a collision between the spindle and the fixture, but the tool and spindle don't actually hit the fixture. Even after disabling collision detection in Configuration > Machine Settings, the error still appears. The setup was imported from a different project file that was working correctly. Hiding the fixture allows the simulation to run fine.

### Root Cause

"It seems to be the Fixture model that is the culprit. I suspect that your fixture model has some corrupted triangles floating above the fixture and this causes some invalid collisions." The fixture model (likely an STL file) has corrupted or floating triangles that extend beyond the visible fixture geometry. VERICUT's collision detection uses the actual triangle mesh, not the visual representation. Even though the fixture looks correct visually, the corrupted triangles create invisible collision volumes that trigger false collisions. "Even I disable collision detect in the Configuration /machine setting but still showing me the Error" — the collision setting may not apply to all collision types.

### Fix

1. **Replace the fixture model with simple shapes**:
   - If the collision disappears, the model is the problem

2. **Export the fixture with a different file type**:
   - Different formats may not have the corrupted triangles
   - Try each format to see which works

3. **Try a different output precision**:
   - When exporting the fixture model from the source CAD
   - Change the precision/tolerance settings
   - Higher precision may eliminate corrupted triangles

4. **Repair the STL model**:
   - Use an STL repair tool (e.g., Netfabb, MeshMixer)
   - Open the fixture STL file
   - Run the repair function
   - Remove floating triangles and corrupted geometry
   - Re-import the repaired STL into VERICUT

5. **Re-export the fixture from the source CAD**:
   - Open the fixture model in the source CAD program
   - Check for errors in the model
   - Fix any geometry issues
   - Re-export to STL or STEP

6. **Check the model in a viewer**:
   - Open the fixture model in a 3D viewer
   - Look for floating or disconnected triangles
   - These are the source of false collisions
   - Remove them before importing into VERICUT

7. **Use the fixture from the working project**:
   - If the fixture from the working project doesn't cause collisions
   - Use that fixture model instead
   - The original fixture model is corrupted

8. **Don't rely on disabling collision detection**:
   - Disabling collision detection may not work for all collision types
   - Fix the model instead of trying to disable detection
   - The model corruption is the root cause

### Community Report

> "I got the error said that Spindle collided to Fixture, actually my tool and spindle did not hit the fixture at all. Even I disable collision detect in the Configuration /machine setting but still showing me the Error. I invisible the fixture and ran fine. It seems to be the Fixture model that is the culprit. Try to replace the fixture model with blocks and cylinders. I suspect that your fixture model has some corrupted triangles floating above the fixture and this causes some invalid collisions."

## 4. C-Axis Turning Tool Spindle Off Check Override

### Symptom

When simulating a 6-axis turning process on a milling machine (turning tool in the spindle, C-axis revolves around Z), VERICUT generates a huge amount of "Collision between the cutting zone of the tool and the machined part with the spindle turned off" error messages. The spindle rotation is not switched on because it's used as the C-axis. These errors slow down the simulation incredibly.

### Root Cause

"As it is a 6-axis process, spindle rotation is not switched on, it is used as the C axis." In this configuration, the spindle serves as a C-axis rotary, not as a rotating spindle. VERICUT's default behavior checks for spindle rotation when a turning tool is cutting. Since the spindle is used as a C-axis (not rotating), VERICUT thinks the spindle is off and reports collisions for every cutting move. "Those errors slow down incredibly the simulation."

### Fix

1. **Add ActiveSpindleOnOffOverride macros to C-axis motion**.

2. **This turns the spindle on with C-axis motion but off after**:
   - The spindle is momentarily "on" during C-axis moves

3. **Keep spindle on until next tool change (alternative)**:
   - Add spindle off macros to the tool change macros

4. **Accept slower simulation as trade-off**:
   - This is a trade-off for avoiding the errors

5. **Disable tool shape update (if possible)**:
   - This macro may not exist
   - Contact CGTech support for guidance

6. **Use a different machine configuration**:
   - If the simulation is too slow with the override
   - Consider configuring the machine differently
   - As a lathe with live tooling instead of a mill with C-axis
   - This may avoid the spindle off check

7. **Contact CGTech support**:
   - If the macros don't fully resolve the issue
   - Or if simulation speed is unacceptable
   - Contact CGTech support
   - They may have a better configuration for 6-axis turning

### Community Report

> "I have created a 5-axis milling machine on VERICUT in order to simulate a 6-axis turning process. As it is a 6-axis process, spindle rotation is not switched on, it is used as the C axis. During the simulation, I get a huge amount of error messages: 'Collision between the cutting zone of the tool and the machined part with the spindle turned off.' The best way to configure this would be to turn on the spindle with a C command. Add macros: ActiveSpindleActiveToolAdd, ActiveSpindleOnOffOverride Value=1, ActiveSpindleOnOffOverride Value=0. This will avoid the error without affecting your simulation."

## 5. Broaching Cycle Not Cutting Stock from Insert Geometry

### Symptom

When simulating a broaching cycle, VERICUT reports "Collision between Cutter of the tool and Cut Stock with Spindle off." The stock doesn't show the broaching insert cutting anything. Even after adding the CGTECH_MACRO "BroachModeOnOff" "" 1 from the broaching example, the insert doesn't cut the stock. The tool is loaded but doesn't remove material.

### Root Cause

"I am kind of lost on this one." The broaching tool insert geometry may not be properly defined for material removal. VERICUT's broaching mode requires the insert to be modeled as a 3D cutting tool with proper geometry. If the insert is modeled as a simple 2D shape or has incorrect geometry, VERICUT can't simulate material removal. "Have you tried making a sweep of the insert profile and giving it about .001 thickness to see it cut." The insert needs to be a swept 3D shape with sufficient thickness for VERICUT to recognize it as a cutting tool.

### Fix

1. **Create the insert as a DXF sweep profile**:
   - Create the insert profile as a DXF file
   - Import it into the tool definition
   - Sweep it to the required thickness

2. **Give the insert sufficient thickness**:
   - The insert needs some 3D thickness
   - For VERICUT to recognize it as a cutting tool
   - Even a small thickness (.001) is sufficient

3. **Use the BroachModeOnOff macro**:
   - This enables broaching mode in VERICUT
   - But it also requires proper insert geometry

4. **Check the spindle configuration for broaching**:
   - Broaching typically doesn't use spindle rotation
   - Ensure the spindle is configured correctly for broaching
   - The spindle may need to be off for broaching

5. **Use M3 S0 or M13 S0 for spindle control**:
   - Adding M3 S0 (spindle on at 0 RPM)
   - May help VERICUT recognize the tool as cutting
   - Even with the spindle not rotating

6. **Check the tool type in Tool Manager**:
   - Verify the tool is defined as the correct type
   - For broaching, it may need to be a custom tool type
   - Check the cutting zone definition
   - Ensure the cutting zone matches the insert geometry

7. **Reference the broaching example file**:
   - VERICUT includes a broaching example
   - Study the example's tool definition and CTL configuration
   - Model your tool after the example

8. **Contact CGTech support**:
   - If the broaching cycle still doesn't cut
   - After trying the DXF sweep approach
   - Contact CGTech support
   - Provide the tool definition and G-code

### Community Report

> "I'm trying to simulate a broaching cycle and I keep getting this error: 'Collision between Cutter of the tool and Cut Stock with Spindle off.' It doesn't actually show the stock cutting just turns it red for a collision. I looked at the example broaching file provided and add the CGTECH_MACRO 'BroachModeOnOff' '' 1 from the broaching example which doesn't give me the error but also doesn't show the insert cutting anything. Have you tried making a sweep of the insert profile and giving it about .001 thickness to see it cut. So I drew the insert as a dxf file and made the insert that way, was able to sweep it to my thickness I needed and it works."

## 6. Additional VERICUT Issues

### STL Model Precision Issues

**Issue**: "I have issues with holes & .stl files."
**Fix**: Use STEP or IGES instead of STL for models with holes. Or increase STL precision when exporting. Repair STL files with Netfabb or MeshMixer.

### Project File Import from Different Project

**Issue**: "This set up I imported from difference Project file that was a good file."
**Fix**: When importing from another project, verify all models are correctly referenced. Check for path issues. Re-import models if collisions appear that shouldn't.

### Machine Configuration for Multi-Axis Turning

**Issue**: Configuring a milling machine for 6-axis turning simulation.
**Fix**: Define a third rotary axis (C around Z). Use ActiveSpindleOnOffOverride macros. Accept slower simulation speed. Or configure as a lathe with live tooling.

### Tool Change Spindle Off

**Issue**: "Since you always have the spindle off during a tool change (I hope)."
**Fix**: Ensure spindle off is part of the tool change macro. Add spindle off macros to tool change. If spindle is already off, it won't affect anything. This is required for the C-axis override workaround.

### Disabling Collision Detection

**Issue**: "Even I disable collision detect in the Configuration /machine setting but still showing me the Error."
**Fix**: Disabling collision detection may not work for all collision types. Fix the root cause (corrupted model, wrong configuration) instead. Don't rely on disabling detection.

### G99 Return to Initial Plane

**Issue**: "Is your return to initial plane correct in your .ctl file? (G99)"
**Fix**: Verify G99 is correctly defined in the CTL file. An incorrect G99 definition can cause collision errors. Check the retract plane calculation.

### Okuma Multus Configuration

**Issue**: "Also this is an Okuma Multus."
**Fix**: Okuma Multus is a multi-tasking machine. Ensure the CTL file is configured for the Okuma control. Check with CGTech for Okuma-specific CTL files. Verify multi-axis configuration.

### Drill Simulation on Lathe

**Issue**: "I've done this with drills in a lathe."
**Fix**: "Make a sweep of the insert profile and give it about .001 thickness to see it cut." Same approach as broaching. Create the tool as a swept 3D profile. Ensure proper cutting zone definition.

## Best Practices

1. **Configure M29 as SpindleMotionCW in CTL file** — fixes tapping spindle off errors
2. **Set Process Cutter Comp to On - Default to Full Radius** — enables cutter compensation
3. **Replace corrupted fixture models with simple shapes** — eliminates false collisions
4. **Export models as STEP or IGES instead of STL** — avoids triangle corruption
5. **Use ActiveSpindleOnOffOverride macros for C-axis turning** — avoids spindle off errors
6. **Create broaching inserts as DXF sweep profiles** — enables material removal
7. **Give inserts sufficient 3D thickness (.001+)** — VERICUT needs 3D geometry for cutting
8. **Study the VERICUT example files** — model your tools after examples
9. **Don't rely on disabling collision detection** — fix the root cause instead
10. **Contact CGTech tech support for complex configurations** — they have machine-specific CTL files
