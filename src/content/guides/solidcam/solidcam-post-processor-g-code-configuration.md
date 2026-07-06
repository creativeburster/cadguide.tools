---
title: "SolidCAM Post Processor Configuration: Customizing G-Code Output for Your Machine"
excerpt: "How to configure and customize SolidCAM post processors — covering common G-code modifications, machine-specific M-code mapping, and debugging post processor output errors."
category: "deployment"
softwareSlug: "solidcam"
keyword: "solidcam post processor g-code configuration"
slug: "solidcam-post-processor-g-code-configuration"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://solidcam.help/2021/milling/iMachining_CAM_Settings.htm"
  - "https://solidcam.com/imachining/imachining-technology-wizard/"
---

# SolidCAM Post Processor Configuration: Customizing G-Code Output for Your Machine

The post processor is the bridge between SolidCAM's toolpath data and your CNC machine's G-code dialect. Get it wrong and the machine either refuses to run, crashes, or produces incorrect parts. I've customized post processors for 15+ different machines. Here's what you need to know.

## What Is a Post Processor?

SolidCAM generates toolpath data in a generic internal format. The post processor translates this into the specific G-code dialect your machine understands. Every CNC controller (Fanuc, Siemens, Haas, Mazak, Heidenhain) has a slightly different dialect.

SolidCAM ships with 200+ standard post processors. If your machine is a standard configuration, the stock post may work. If not, you need to customize.

## Selecting the Right Stock Post

1. In SolidCAM, go to **CAM-Part** → **Settings** → **Post Processor**.
2. Browse the list by controller type:
   - **Fanuc**: Fanuc 0i, 18i, 30i, 31i
   - **Siemens**: Sinumerik 840D, 828D
   - **Haas**: Haas Mill, Haas Lathe
   - **Heidenhain**: TNC 320, TNC 640
   - **Mazak**: Mazatrol Matrix, SmoothX
3. Select the closest match to your machine.
4. Generate a test program and verify on the machine (dry run with no material).

## Common Customizations

### 1. Program Start/End Format

Most machines expect specific header and footer lines. Edit the post processor's start/end blocks:

**Fanuc typical start:**
```
%
O0001 (PART NAME)
G21 G17 G40 G49 G80 G90
G54
```

**Haas typical start:**
```
%
O00001 (PART NAME)
G17 G20 G40 G49 G80
G54
```

In the post processor file (.GPP or .PP), find the `start_of_program` block and modify the G-code lines.

### 2. Tool Change Format

Different machines handle tool changes differently:

**Fanuc**:
```
T1 M06
```

**Heidenhain**:
```
TOOL CALL 1
```

**Haas**:
```
T1
M06
```

Find the `tool_change` block in the post processor and adjust the format.

### 3. Spindle Speed and Feed Format

Most machines use `S####` for spindle speed and `F####` for feed rate. But the units differ:

- **Fanuc**: Feed in mm/min (G21) or inch/min (G20)
- **Heidenhain**: Feed in mm/min with `F` prefix
- **Some Siemens**: Feed in mm/revolution with `F` and G95

If your machine expects feed per revolution but the post outputs feed per minute, add a G95 code and convert the feed value.

### 4. Coolant M-Codes

| Machine | Mist | Flood | Off |
|---------|------|-------|-----|
| Fanuc | M07 | M08 | M09 |
| Haas | M07 | M08 | M09 |
| Heidenhain | M07 | M08 | M09 |
| Mazak | M07 | M08 | M09 |

Most machines use the same M-codes for coolant, but some European machines use M10/M11 for through-spindle coolant. Check your machine manual.

### 5. iMachining Output

iMachining generates high-frequency direction changes. Some older controllers can't process the G-code fast enough:

- **Fanuc 0i**: Block processing speed may be too slow. Add `G05.1 Q1` (AI contour control) to enable high-speed processing.
- **Haas**: Enable "High Speed Machining" mode in machine settings.
- **Heidenhain**: Use `CYCLE DEF 208` for high-speed contouring.

If your machine struggles with iMachining (jerky motion, following error alarms), add the appropriate high-speed mode code in the post processor's `start_of_operation` block.

## Editing Post Processor Files

SolidCAM post processors come in two formats:

### GPP Format (Older)

GPP files use a proprietary scripting language. Key blocks:

```
@start_of_program
  ; Called at the beginning of the G-code program
  ; Add your header lines here

@tool_change
  ; Called when a tool change occurs
  ; Format the T and M06 codes here

@end_of_program
  ; Called at the end of the program
  ; Add your footer lines here
```

### PP Format (Newer, IPP)

PP files use a C-like syntax:

```
: // Start of program
  "%\n"
  "O" program_number " (" part_name ")\n"
  "G21 G17 G40 G49 G80 G90\n"

: // Tool change
  "T" tool_number " M06\n"
```

## Debugging Post Processor Issues

### Problem: Machine Alarms on First Line

**Cause**: The program start format doesn't match the machine's expected format.

**Fix**: Check the machine manual for the required first line. Some machines require `%` as the very first character. Others require a specific program number format (O0001 vs O00001).

### Problem: Tool Doesn't Go to Correct Position

**Cause**: Work offset (G54-G59) is missing or incorrect.

**Fix**: Add the work offset code in the `start_of_program` block:
```
G54 ; or G55, G56, G57, G58, G59
```

### Problem: Feed Rate Is Wrong

**Cause**: Post outputs feed in mm/min but machine expects inch/min (or vice versa).

**Fix**: Check the post processor's unit setting. In SolidCAM: **CAM-Part** → **Settings** → **Units**. Ensure it matches the machine's configuration.

### Problem: iMachining Paths Are Jerky

**Cause**: The controller can't process G-code blocks fast enough.

**Fix**: 
1. Enable high-speed processing mode (G05.1 Q1 for Fanuc, look-ahead for Haas).
2. If the controller still can't keep up, increase the iMachining tolerance in SolidCAM (larger tolerance = fewer G-code blocks).
3. As a last resort, reduce the iMachining feed rate by 20-30%.

## Testing a Modified Post Processor

1. Make a copy of the original post processor before editing.
2. Generate a simple test program (one tool, one operation).
3. Run the G-code through a simulator (NCViewer, CIMCO Edit, or the machine's own simulator).
4. Verify:
   - Program starts and ends correctly
   - Tool changes work
   - Coordinates are in the right range
   - Feed and speed values are reasonable
5. Dry run on the machine (no material, single block mode).
6. If everything looks correct, run with material.

**Never** run an untested post processor modification directly on a part. Always dry run first.
