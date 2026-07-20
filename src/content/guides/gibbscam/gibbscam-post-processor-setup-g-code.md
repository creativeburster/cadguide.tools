---
title: "GibbsCAM Post Processor Setup: Getting Clean G-Code for Your CNC Machine"
excerpt: "How to select, configure, and test GibbsCAM post processors — covering standard post selection, custom modifications, and the GibbsCAM post debugger for troubleshooting output errors."
category: "deployment"
softwareSlug: "gibbscam"
keyword: "gibbscam post processor setup g-code configuration"
slug: "gibbscam-post-processor-setup-g-code"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-06"
sources:
  - "https://www.gibbscam.com/products/"
  - "https://www.practicalmachinist.com/forum/threads/gibbscam-or-mastercam.445079/"
---

# GibbsCAM Post Processor Setup: Getting Clean G-Code for Your CNC Machine

GibbsCAM ships with 300+ post processors, but finding the right one and customizing it for your specific machine is a rite of passage. I've set up posts for Fanuc, Haas, Mazak, and Okuma machines. Here's the process that gets clean G-code on the first try.

## Step 1: Select the Right Stock Post

1. Go to **File** → **Post Process** → **Select Post**.
2. Browse by controller type:
   - **Fanuc**: `fanuc_0i`, `fanuc_18i`, `fanuc_30i`, `fanuc_31i`
   - **Haas**: `haas_mill`, `haas_lathe`, `haas_5x`
   - **Mazak**: `mazatrol_matrix`, `mazak_smoothx`
   - **Okuma**: `okuma_osp`, `okuma_osp_p300`
   - **Siemens**: `sinumerik_840d`, `sinumerik_828d`
   - **Heidenhain**: `heidenhain_tnc640`, `heidenhain_tnc320`

3. Select the closest match. If your exact model isn't listed, choose the closest controller family (e.g., Fanuc 31i for a Fanuc 32i).

4. Generate a test program and review the G-code.

## Step 2: Review the Output

Generate a simple test program (one drilling operation) and check:

```
%
O0001 (TEST PART)
G21 G17 G40 G49 G80 G90
G54
G00 X0 Y0
S3000 M03
G43 H1 Z50
G98 G81 X10 Y10 Z-15 R2 F100
G80
G00 Z50
M05
M09
G91 G28 Z0
G91 G28 X0 Y0
M30
%
```

Check these elements:
- [ ] Program starts with `%` and program number
- [ ] Safety line includes G21 (metric) or G20 (inch)
- [ ] Work offset (G54) is output
- [ ] Tool length compensation (G43 H#) is output
- [ ] Spindle starts (M03) before cutting
- [ ] Coolant code (M08) is output
- [ ] Drilling cycle (G81) format matches your machine
- [ ] Tool cancels (G80) before retract
- [ ] Program ends with M30
- [ ] Program ends with `%`

## Step 3: Common Customizations

### Program Number Format

Some machines require specific program number formats:

**Fanuc**: `O0001` (letter O, 4 digits)
**Haas**: `O00001` (letter O, 5 digits)
**Okuma**: `O0001` (letter O, 4 digits) or `(:1)` format

Edit the post processor's program header section to match.

### Tool Change Format

**Standard**: `T1 M06`
**Haas with pre-load**: `T1 M06` (Haas handles pre-load internally)
**Fanuc with double-arm ATC**: `T1` then `M06` on separate lines

### Work Offset

Most machines use G54-G59. If your machine uses different offsets:
- **Okuma**: G54 is called "G15 H1"
- **Heidenhain**: Uses `CALL CYCLE DEF 7` instead of G54

### Feed Rate Mode

- **G94**: Feed per minute (standard for milling)
- **G95**: Feed per revolution (standard for turning)
- Some machines default to G95 and need G94 explicitly for milling operations

## Step 4: Use the Post Debugger

GibbsCAM includes a post debugger for testing and troubleshooting:

1. Go to **Utilities** → **Post Debugger**.
2. Load the post processor file.
3. Load a test .tap file (GibbsCAM's intermediate toolpath format).
4. Run the debugger — it steps through the post processing line by line.
5. The debugger shows:
   - **Input**: The toolpath data from GibbsCAM
   - **Post logic**: Which post processor block is executing
   - **Output**: The generated G-code line

6. Set breakpoints at specific blocks (e.g., `tool_change`) to inspect how the output is generated.

### Common Post Issues Found with Debugger

**Missing tool length compensation**: The `tool_change` block doesn't output G43 H#. Add it to the block.

**Wrong feed rate mode**: The post outputs G95 (per rev) when the machine expects G94 (per min). Add G94 to the program header.

**Coolant not output**: The `coolant_on` block is empty or has the wrong M-code. Check the block and add the correct M-code.

## Step 5: Test on the Machine

**Never run an untested post on a real part.**

1. Post the G-code and load it into the machine.
2. Run in **single block mode** with **rapid override at 25%**.
3. Step through each line:
   - Verify tool changes work
   - Verify positions are correct (check DRO values)
   - Verify spindle starts and stops
   - Verify coolant turns on and off
4. If everything looks correct, run in **dry cycle mode** (no material, full rapid).
5. Finally, run with material at reduced feed (50% of programmed feed).

## Step 6: Save and Document

Once the post is verified:

1. Save the post processor file with a clear name: `company_fanuc_31i_v1.cgp`.
2. Document all modifications in a comment block at the top of the file:
   ```
   ; Company: [Your Company]
   ; Machine: Fanuc 31i-B, 3-axis, 12000 RPM
   ; Modifications:
   ;   - Added G05.1 Q1 for high-speed processing
   ;   - Changed tool change to T# M06 format
   ;   - Added G94 in header for feed per minute
   ; Date: 2026-07-06
   ; Author: [Your Name]
   ```
3. Store the post on a network share for team access.
4. Backup the original stock post for reference.

## Multi-Machine Posts

If you have multiple machines with different controllers:

1. Create separate post files for each machine.
2. In GibbsCAM, assign the correct post to each CAM-Part based on the target machine.
3. Use the **Machine Setup** dialog to select which post to use by default for new parts.

This prevents the common error of posting a program with the wrong machine's post and getting G-code that doesn't run.
