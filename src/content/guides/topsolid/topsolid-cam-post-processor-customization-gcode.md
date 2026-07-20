---
title: "TopSolid'Cam: Post-Processor Customization and G-Code Setup"
excerpt: "Guide to TopSolid'Cam post-processor configuration — covering machine definitions, kinematics, axis limits, and G-code output customization — based on TopSolid documentation and user discussions."
category: "workflow"
softwareSlug: "topsolid"
keyword: "topsolid cam post processor customization g-code machine setup"
slug: "topsolid-cam-post-processor-customization-gcode"
author: "CADGuide Tools Editorial Team"
readTime: "7 min read"
date: "2026-07-12"
sources:
  - "https://help.topsolid.com/7.16/en/TopSolid'Cam/TopSolid/Cam/NC/Kernel/ui/postprocessors/commands/postprocessorcommand.htm"
  - "https://topsolid-post-processors-x64-mic-s-a.software.informer.com/"
  - "https://www.practicalmachinist.com/forum/threads/topsolid-cam-anyone-using-it-loving-it.426905/page-5"
---

# TopSolid'Cam: Post-Processor Customization and G-Code Setup

A post-processor translates TopSolid'Cam's internal toolpath data into machine-specific G-code. Without a correct post-processor, the generated code won't run properly on the target CNC machine. This guide covers the setup and customization process based on TopSolid documentation and user experiences.

## What a Post-Processor Does

According to the TopSolid post-processor documentation, the post-processor:
1. Translates internal toolpath coordinates to machine-specific coordinates
2. Applies machine kinematics (axis transformations for 4/5-axis machines)
3. Formats G-code per the machine controller's requirements (Fanuc, Siemens, Heidenhain, etc.)
4. Adds machine-specific cycles, tool changes, and safety codes
5. Respects axis limits and travel constraints

## Post-Processor Architecture in TopSolid

### Machine Definition
Before post-processing, the machine must be defined in TopSolid:
1. **Machine kinematics**: Define the axis configuration (3-axis, 4-axis, 5-axis, lathe, mill-turn)
2. **Axis limits**: Set travel limits for each axis (X, Y, Z, A, B, C)
3. **Tool mounting**: Define how tools are mounted (spindle, turret, gang tool)
4. **Speeds and feeds**: Set maximum spindle speed, rapid traverse rates
5. **Controller type**: Select the controller (Fanuc, Siemens 840D, Heidenhain, etc.)

### Post-Processor Configuration
According to the Software Informer description of TopSolid post-processors:
- "Provides configurable post parameters to match controller options, units, tolerances, output formatting, and code conventions"
- "Works with your TopSolid machine definitions and kinematics to respect axis limits and output code consistent with machine capabilities"

## Getting a Post-Processor for Your Machine

### Option 1: TopSolid-Provided Post-Processors
TopSolid provides post-processors developed in collaboration with machine tool manufacturers:
- Common controllers: Fanuc, Siemens, Heidenhain, Mitsubishi, Bosch
- Common machine brands: DMG Mori, Hermle, Mazak, Okuma, Doosan
- Contact your TopSolid reseller to request a post for your specific machine

### Option 2: Custom Post-Processor Development
If no standard post-processor matches your machine:
1. Your TopSolid VAR can develop a custom post-processor
2. This typically takes 1-4 weeks depending on complexity
3. Cost varies — some VARs include it with the license, others charge extra

### Option 3: User Customization
Advanced users can modify existing post-processors:
1. Access the post-processor configuration files
2. Modify G-code formatting, tool change sequences, cycles
3. Test with sample toolpaths and verify on the machine

## Post-Processor Customization Parameters

### Controller Options
- **Units**: G20 (inch) or G21 (mm)
- **Absolute/Incremental**: G90/G91 mode
- **Coordinate system**: G54-G59 work offsets
- **Feed rate mode**: G94 (per minute) or G95 (per revolution)

### Output Formatting
- **Line numbering**: On/off, starting number, increment
- **Decimal places**: Number of decimal places for coordinates
- **Trailing zeros**: Keep or remove
- **Comments**: Output as parentheses or semicolon comments
- **Block skip**: Optional block skip character (/)

### Tolerance Settings
- **Chordal tolerance**: Maximum deviation from the ideal curve
- **Angular tolerance**: Maximum angular change per block
- **Maximum line length**: Split long moves into shorter blocks

### Code Conventions
- **Tool change format**: M6, T1 M6, or T1 (varies by controller)
- **Spindle start**: M3/M4 with S value
- **Coolant**: M7/M8/M9
- **Canned cycles**: G81, G83, G84, etc. (or expanded form)
- **Subroutines**: M98/M99 or inline

## ISO Block Generation

TopSolid's post-processor generates ISO blocks (G-code blocks) based on:
1. The toolpath data from the CAM operation
2. The machine kinematics (axis transformations)
3. The post-processor configuration (formatting, conventions)

The ISO Block Generation dialog allows:
- Viewing the generated G-code before output
- Modifying block parameters
- Testing different post-processor settings

## Machine Kinematics for Multi-Axis

### 4-Axis Machines
- Define the rotary axis (A, B, or C)
- Set the rotary axis position (on the table or on the spindle)
- Define the rotation direction and zero position
- Set the rotary axis feed rate

### 5-Axis Machines
- Define both rotary axes
- Set the axis configuration (table-table, head-head, head-table)
- Define the pivot point and tool length compensation
- Configure RTCP (Rotation Tool Center Point) or TCP settings
- Set tilt and rotation limits

### Mill-Turn Machines
- Define main spindle and sub-spindle
- Set turret configuration (VDI, BMT, etc.)
- Define live tooling capabilities
- Configure Y-axis travel
- Set synchronization channels for multi-channel machines

## Common Post-Processor Issues

### Issue: G-Code Doesn't Run on the Machine
1. Check the controller type matches the post-processor
2. Verify the coordinate system (G54 vs. G28)
3. Check tool change format matches the machine's expected format
4. Verify units (mm vs. inch)
5. Check for unsupported G-codes or M-codes

### Issue: 5-Axis Movements Are Wrong
1. Verify the machine kinematics configuration matches the actual machine
2. Check the pivot point distance
3. Verify RTCP/TCP settings
4. Check axis limit settings — the post may be outputting moves beyond the machine's range
5. Ensure the rotary axis direction matches the machine

### Issue: Post Edits Take Too Long
A Practical Machinist user noted: "Post edits can take some time, but they have always been able to get my post to do what is needed for zero extra cost."

This is a common experience — post-processor customization through the VAR can take weeks. To minimize delays:
1. Provide detailed machine specifications upfront
2. Send sample programs that work on your machine
3. Specify exactly what needs to change
4. Test the modified post thoroughly before approving

### Issue: Rapid Movements Cause Collisions
1. Check the safe Z height setting in the post-processor
2. Verify the retract plane is above the highest clamp/fixture
3. Ensure the post outputs G0 (rapid) only in safe areas
4. Check that the machine definition includes the work envelope

## Testing a New Post-Processor

1. **Generate a simple toolpath**: Create a basic facing or contouring operation
2. **Post-process**: Generate G-code with the new post-processor
3. **Review the G-code**: Check format, tool changes, coordinates
4. **Run in machine simulation**: Use TopSolid's machine simulation mode to verify
5. **Dry run on the machine**: Run the program with the spindle off and no material
6. **Test cut**: Run a simple cut on scrap material
7. **Verify dimensions**: Measure the test part to confirm accuracy
8. **Iterate**: If issues are found, request post-processor modifications

## Best Practices

1. **Document your machine specs**: Keep a detailed spec sheet for each machine — controller, axis travel, options
2. **Keep sample programs**: Maintain working G-code samples for each machine as reference
3. **Test before production**: Always test a new or modified post-processor on simple parts first
4. **Maintain post versions**: Keep backup copies of working post-processors before modifying
5. **Communicate clearly with your VAR**: When requesting post edits, be specific about what needs to change
6. **Verify after TopSolid updates**: Post-processors may need updates when TopSolid is upgraded
7. **Standardize where possible**: If you have multiple machines with the same controller, use the same post-processor base
