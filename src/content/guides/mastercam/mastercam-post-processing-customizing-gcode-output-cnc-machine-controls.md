---
title: "Mastercam Post Processing: Customizing G-Code Output for CNC Machine Controls"
excerpt: "Mastercam's post processor converts toolpaths to machine-specific G-code. I cover post selection, common post modifications, customizing tool change sequences, coolant and spindle commands, and troubleshooting G-code output issues."
category: "workflow"
softwareSlug: "mastercam"
keyword: "Mastercam post processing G-code output CNC machine controls post processor customizing tool change coolant spindle commands troubleshooting"
slug: "mastercam-post-processing-customizing-gcode-output-cnc-machine-controls"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-29"
sources:
  - "https://www.mastercam.com/support/"
  - "https://www.mastercam.com/resources/"
---

# Mastercam Post Processing: Customizing G-Code Output for CNC Machine Controls

I've customized Mastercam post processors for dozens of CNC machines — from basic Haas mills to complex 5-axis Mazak Integrex mill-turn centers. The post processor is the critical link between Mastercam's internal toolpath data and the machine's specific G-code format. A correctly configured post ensures the machine runs the program without manual editing.

## What Is a Post Processor?

A post processor (post) is a script that converts Mastercam's neutral toolpath data (NCI file) into machine-specific G-code (NC file). Every CNC machine has a slightly different G-code format, and the post processor handles this translation.

### Post Processor Types

- **MP post**: Mastercam's traditional post format (uses .PST and .MCAM-PST files)
- **NPost post**: Newer .NET-based post format
- Both use a scripting language to define the output format

## Selecting a Post Processor

### Choosing the Right Post

1. Go to **Machine** tab → **Machine Definition**
2. The post processor is linked to the machine definition
3. Common post processors included with Mastercam:
   - **Fanuc**: Fanuc 0M, 6M, 10M, 15M, 16M, 18M, 21M, 30i, 31i
   - **Haas**: Haas Mill, Haas Lathe, Haas Integrex
   - **Siemens**: Sinumerik 840D, 828D
   - **Mazak**: Mazatrol Matrix, Smooth
   - **Okuma**: OSP-P200, OSP-P300
   - **Mitsubishi**: Meldas M70, M80
   - **Heidenhain**: TNC 320, TNC 530, TNC 640
4. If your machine isn't listed:
   - Check with your reseller for a custom post
   - Modify the closest standard post (see below)
   - Commission a custom post from a post developer

### Post Configuration

1. Go to **Settings** → **Machine Definition Manager**
2. Select the machine and post
3. Configure post variables:
   - **Output file extension**: .nc, .tap, .cnc, .gcode, .mpf
   - **Sequence numbers**: On/off, starting number, increment
   - **Units**: G20 (inch) or G21 (metric)
   - **Absolute/Incremental**: G90 (absolute) or G91 (incremental)
   - **Feed rate mode**: G94 (per minute) or G95 (per revolution)
   - **Spindle speed mode**: G97 (RPM) or G96 (constant surface speed)

## Common Post Modifications

### Tool Change Sequence

The default tool change in many posts is:
```
T1 M6
```

Some machines require:
```
T1
M6
```

Or for machines with pre-selection:
```
T1 M01 (Tool change to tool 1)
M6
```

To modify the tool change sequence:
1. Open the post processor file in a text editor
2. Find the tool change section (search for "tool_change" or "M6")
3. Modify the output format:
   ```
   # Tool change output
   ptoolchg$
     t$, " M6", e$
   ```
4. Save the post file
5. Re-post the toolpath to verify

### Spindle Start

Default spindle start:
```
S3000 M3
```

Some machines require spindle speed before direction:
```
M3 S3000
```

Or with coolant:
```
S3000 M3 M8
```

To modify:
1. Find the spindle start section (search for "spindle" or "M3")
2. Modify the output order
3. Add coolant if required
4. Save and test

### Coolant Commands

Standard coolant commands:
- **M7**: Mist coolant on
- **M8**: Flood coolant on
- **M9**: Coolant off

Some machines use:
- **M50**: Through-spindle coolant on
- **M51**: Through-spindle coolant off
- **M52**: Air blast on
- **M53**: Air blast off

To add through-spindle coolant:
1. Find the coolant section
2. Add the custom M-code
3. Link it to a tool parameter (e.g., coolant = "CTS")
4. Save and test

### Work Offset

Standard work offsets:
- **G54**: Work offset 1
- **G55**: Work offset 2
- **G56**: Work offset 3
- **G57**: Work offset 4

Some machines use E values:
```
E1 (instead of G54)
```

To modify:
1. Find the work offset section (search for "G54" or "work_offset")
2. Change the output format
3. Save and test

### Tool Length Compensation

Standard tool length compensation:
```
G43 H1 (tool length comp, tool 1)
```

Some machines use:
```
G43 H01 (with leading zero)
```

Or:
```
T1 D1 (tool and diameter offset)
```

To modify:
1. Find the tool length section (search for "G43" or "tool_length")
2. Change the format (add leading zeros, change H to D, etc.)
3. Save and test

### Feed Rate Format

Standard feed rate:
```
F50.0 (50 IPM)
```

Some machines require:
```
F50 (no decimal)
```

Or in metric:
```
F1200. (1200 mm/min)
```

To modify:
1. Find the feed rate section (search for "feed" or "F")
2. Change the decimal format
3. Save and test

### Rapid Move Format

Standard rapid:
```
G0 X1.5 Y2.0 Z0.5
```

Some machines require:
```
G00 X1.5 Y2.0 Z0.5 (two-digit G-code)
```

Or with separate lines:
```
G00
X1.5 Y2.0 Z0.5
```

## Customizing the Program Header

### Default Header

Most posts output a header like:
```
O0001 (PROGRAM NAME)
(DATE - DD-MMM-YYYY)
(TOOL - 1/2 ENDMILL)
N1 G20 G90
N2 G0 G17 G40 G49 G80
N3 G54
```

### Custom Header

To add custom information:
1. Find the program start section (search for "start_of_program" or "prog_start")
2. Add custom output:
   ```
   # Custom header
   pprog_start$
     "%", e$
     "O", prog_no$, " (", prog_name$, ")", e$
     "(MATERIAL - ", matl_name$, ")", e$
     "(PROGRAMMER - ", programmer$, ")", e$
     "(DATE - ", date$, ")", e$
     "(MACHINE - ", machine_name$, ")", e$
     e$
   ```
3. This outputs:
   ```
   %
   O0001 (BRACKET_001)
   (MATERIAL - ALUMINUM 6061)
   (PROGRAMMER - J. SMITH)
   (DATE - 29-JUN-2025)
   (MACHINE - HAAS VF-2)
   ```

## Customizing the Program Footer

### Default Footer

Most posts output:
```
M5 M9 (spindle stop, coolant off)
G91 G28 Z0 (return Z to home)
G91 G28 X0 Y0 (return X Y to home)
G90
M30 (program end)
%
```

### Custom Footer

To modify the safe return and end:
1. Find the program end section (search for "end_of_program" or "prog_end")
2. Modify the output:
   ```
   # Custom footer
   pprog_end$
     "M5 M9", e$        # Stop spindle and coolant
     "G91 G28 Z0", e$   # Return Z to home
     "G91 G28 X0 Y0", e$ # Return X Y to home
     "G90 G54 G80", e$  # Reset modal codes
     "M30", e$          # Program end
     "%", e$            # End of file
   ```

## Post Variables

### Common Post Variables

- **prog_no$**: Program number
- **prog_name$**: Program name
- **tool_no$**: Current tool number
- **tool_dia$**: Current tool diameter
- **feed$**: Current feed rate
- **speed$**: Current spindle speed
- **coolnt$**: Current coolant mode
- **x$, y$, z$**: Current coordinates
- **matl_name$**: Material name
- **date$**: Current date
- **machine_name$**: Machine name

### Using Variables in the Post

Variables can be used in any output line:
```
"(TOOL ", tool_no$, " - ", tool_dia$, " DIA)", e$
```
This outputs:
```
(TOOL 1 - 0.5 DIA)
```

## Testing the Post

### Post Verification

1. After modifying the post, re-post a test toolpath
2. Open the NC file in a text editor
3. Verify:
   - **Program header**: Correct format and information
   - **Tool change**: Correct sequence
   - **Spindle start**: Correct format
   - **Coolant**: Correct M-codes
   - **Feed rates**: Correct format
   - **Coordinates**: Correct values and format
   - **Program end**: Correct sequence
4. Run the program on the machine in **dry run** mode first
5. Verify all moves are correct before cutting material

### Common Post Issues

**G-code doesn't run on the machine**:
- Check the file format (some machines need specific extensions)
- Verify the program number format (O0001 vs 0001)
- Check for unsupported G-codes or M-codes
- Verify the units (G20/G21)

**Tool change doesn't work**:
- Check the tool change sequence
- Verify the tool number format
- Some machines require the tool to be pre-staged

**Feed rates are wrong**:
- Check the feed rate format (decimal vs no decimal)
- Verify G94 (per minute) vs G95 (per revolution)
- Check the units (inch vs metric)

**Rapid moves are wrong**:
- Verify G0 format
- Check if the machine requires G00 (two-digit)
- Verify the coordinate format

## Best Practices

### Post Management

1. **Never modify the original post file** — always make a copy
2. Name the copy with the machine name (e.g., "Haas_VF2_2025.pst")
3. Document all changes in the post file (use comments)
4. Keep a backup of the working post
5. Version control: Update the post when the machine control is updated

### Testing

1. Always test post changes with a simple toolpath first
2. Run in dry run (no material) on the machine
3. Verify all tool changes, rapid moves, and feed rates
4. Test with multiple tools (verify tool length compensation)
5. Test with different operations (drilling, contouring, pocketing)

### Documentation

1. Keep a log of post modifications:
   - What was changed
   - Why it was changed
   - When it was changed
   - Who made the change
2. Document any machine-specific requirements:
   - Custom M-codes
   - Required G-codes
   - Format requirements

## Summary

Mastercam's post processor converts toolpath data to machine-specific G-code. Select the correct post for your machine control (Fanuc, Haas, Siemens, Mazak, etc.) and configure post variables (file extension, sequence numbers, units, feed mode). Common modifications include tool change sequence, spindle start format, coolant M-codes, work offset format, tool length compensation, and feed rate format. Customize the program header with material, programmer, date, and machine information. Always test post modifications with a simple toolpath in dry run mode before cutting material. Never modify the original post file — make a copy, document changes, and maintain version control. The most common troubleshooting issues — programs that don't run, tool change failures, and wrong feed rates — are addressed by checking the file format, tool change sequence, and feed rate format. A correctly configured post processor eliminates manual G-code editing and ensures consistent, reliable machine operation.
