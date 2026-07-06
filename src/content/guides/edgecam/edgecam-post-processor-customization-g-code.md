---
title: "EdgeCAM Post Processor Customization: Modifying G-Code Output for Custom Machines"
excerpt: "How to customize EdgeCAM post processors for non-standard CNC machines — covering Code Generator templates, M-code mapping, tool change formatting, and common Fanuc and Haas modifications."
category: "deployment"
softwareSlug: "edgecam"
keyword: "edgecam post processor customization g-code"
slug: "edgecam-post-processor-customization-g-code"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.stillam.com/how-to-install-a-post/"
  - "https://jeffcnc.weebly.com/edgecam-info1.html"
---

# EdgeCAM Post Processor Customization: Modifying G-Code Output for Custom Machines

EdgeCAM uses Code Generator (CG) files as post processors. The stock CG files cover common machines, but most shops need at least minor customization. I've modified EdgeCAM post processors for Fanuc, Haas, Siemens, and Heidenhain controllers. Here's the process.

## Understanding EdgeCAM Post Architecture

EdgeCAM's post processor system has two components:

1. **Code Generator (.cgp/.cgd)**: The main post processor file that defines G-code output format
2. **Machine Setup**: Defines machine kinematics, axis limits, and tool change parameters

The CG file is a template-based system. It contains sections for each part of the G-code program (header, tool change, linear move, circular move, footer), and EdgeCAM fills in the values from the toolpath data.

## Locating Post Processor Files

1. Go to **Settings** → **Paths** → **Code Generators**.
2. The default path is: `C:\ProgramData\Vero\EdgeCAM\Posts\`
3. Files are organized by controller type:
   - `\Fanuc\` — Fanuc posts
   - `\Haas\` — Haas posts
   - `\Siemens\` — Siemens posts
   - `\Heidenhain\` — Heidenhain posts

## Common Customizations

### 1. Program Header

The program header is the first block of G-code output. Edit the `@start` section in the CG file:

**Fanuc default:**
```
%
O0001 (PART_NAME)
G21 G17 G40 G49 G80 G90
G54
```

**Custom modification** (add safety lines):
```
%
O0001 (PART_NAME)
G21 G17 G40 G49 G80 G90 G94 G50
G54
G43 H0 (Cancel tool length comp)
```

### 2. Tool Change Format

Edit the `@tool_change` section:

**Standard Fanuc:**
```
T1 M06
```

**With tool pre-load (Fanuc ATC with double arm):**
```
T2 (Pre-load next tool)
T1 M06 (Change to tool 1)
```

**Haas with tool life management:**
```
T1 M06
(# TOOL 1 - 10MM END MILL)
(WEAR: 15%)
```

### 3. Spindle Speed and Feed Output

Edit the `@spindle` and `@feed` sections:

**Standard:**
```
S3000 M03
F800
```

**With CSS (Constant Surface Speed) for turning:**
```
G96 S200 M03
G50 S3000 (Max RPM limit)
```

**With feed per revolution:**
```
G95 F0.1 (0.1mm/rev)
```

### 4. Coolant M-Codes

Edit the `@coolant` section:

| Function | Standard | Through-spindle | Air blast |
|----------|----------|-----------------|-----------|
| Mist on | M07 | M07 | M07 |
| Flood on | M08 | M08 | M51 |
| TSC on | — | M88 | — |
| Coolant off | M09 | M09 | M09 |

### 5. Work Offset Output

Edit the `@work_offset` section:

**Standard (G54-G59):**
```
G54
```

**With work offset values output (Fanuc G54 with coordinates):**
```
G54 X0 Y0 Z0
```

**Heidenhain:**
```
CALL CYCLE DEF 7.0 DATUM SHIFT
```

## Editing CG Files

EdgeCAM post processors can be edited in two ways:

### Option 1: EdgeCAM Post Processor Editor

1. Go to **Tools** → **Code Generator Editor**.
2. Open the CG file.
3. The editor shows sections with syntax highlighting.
4. Edit the relevant section.
5. Save and close.

### Option 2: Text Editor

1. Close EdgeCAM.
2. Open the .cgp file in a text editor (Notepad++, VS Code).
3. Find the section to modify (search for `@start`, `@tool_change`, etc.).
4. Edit the G-code template lines.
5. Save the file.
6. Restart EdgeCAM.

## Testing Modified Post Processors

**Never run a modified post directly on a machine without testing.**

1. Generate a simple test program (one tool, one operation).
2. Post the G-code with the modified post processor.
3. Open the G-code in a viewer (CIMCO Edit, NCViewer).
4. Verify:
   - Program starts and ends with correct format
   - Tool changes are formatted correctly
   - Spindle speed and feed values are reasonable
   - Work offset is output
   - Coolant codes are correct
5. Run through the machine's simulation mode (if available).
6. Dry run on the machine (no material, single block mode, rapid override at 25%).

## Common Post Processor Issues

### Issue: "Tool Change Failed" on Machine

**Cause**: The tool change format doesn't match the machine's ATC sequence.

**Fix**: Check the machine manual for the exact tool change sequence. Some machines require `T# M06`, others require `M06 T#`, and some need a tool pre-load (`T#` on a separate line before `M06`).

### Issue: Wrong Coordinates After Work Offset

**Cause**: The post outputs G54 but the machine is set up on G55.

**Fix**: Either change the post to output G55, or change the work offset in EdgeCAM's CAM-Part settings to G55.

### Issue: Spindle Doesn't Start

**Cause**: The M03 (spindle on clockwise) code is missing or in the wrong position.

**Fix**: Ensure the `@spindle` section includes `M03` (or `M04` for counterclockwise). The spindle command should come after the tool change and before the first cutting move.

### Issue: Machine Overtravels on Rapid Move

**Cause**: The clearance plane is too low — the tool rapids at a Z height that's within the machine's travel but hits a fixture.

**Fix**: Increase the clearance plane in EdgeCAM's operation settings. The post processor outputs the clearance plane as a G00 Z move — if the Z value is too low, the tool hits the fixture.

## Best Practices

1. **Always backup the original post** before modifying. Keep originals in an `_originals` subfolder.
2. **Document changes**: Add comments in the CG file noting what was changed and why.
3. **Version control**: Name modified posts with version numbers: `Fanuc_0i-MB_v2.cgp`.
4. **Test with every EdgeCAM update**: EdgeCAM updates can change post processor behavior — re-test all modified posts after an update.
5. **Share with your team**: Store modified posts on a network share so all programmers use the same version.
