---
title: "BobCAD-CAM Post Processor Configuration: G-Code Output, Tool Change Order, and Customization"
excerpt: "Configure BobCAD-CAM post processors for correct G-code output: customize tool change order, safe Z heights, feed rates, and fix common posting errors with the .bcpst file format."
category: "troubleshooting"
softwareSlug: "bobcad-cam"
keyword: "bobcad-cam post processor configuration g-code tool change"
slug: "bobcad-cam-post-processor-configuration-gcode-tool-change-customization"
author: "CADGuide Technical Editorial"
readTime: "9 min read"
date: "2026-07-13"
sources:
  - "https://bobcadsupport.com/technical-support/getting-setup-with-bobcad-cam/"
  - "https://bobcad.com/cam-software-post-processors/"
---

# BobCAD-CAM Post Processor Configuration: G-Code Output, Tool Change Order, and Customization

The post processor is the bridge between BobCAD-CAM's internal toolpath data and the G-code your CNC machine understands. Getting it right is critical — a misconfigured post can produce G-code that crashes your machine or produces poor surface finish. I'll walk through the key configuration points and common fixes.

## What a Post Processor Does

BobCAD-CAM generates a Cutter Location (CL) file internally — this is the toolpath with all positional moves in a generic format. The post processor converts this CL file into G-code specific to your machine's controller.

The post processor is a text file with a `.bcpst` extension, located at:
```
C:\BobCAD-CAM Data\BobCAD-CAM V(Version#)\Posts\(Machine Type)\
```

Each post is tailored to a specific controller type (Fanuc, Haas, Siemens, Mach3, etc.) and can be further customized for your machine's specific configuration.

## Selecting the Right Post Processor

1. Go to **CAM > Posting > Select Post**
2. Browse to the Posts folder for your machine type
3. Select the .bcpst file that matches your controller
4. Test with a simple part before using on production jobs

BobCAD includes posts for common controllers. If your controller isn't listed, contact BobCAD support or check their online post library.

## Tool Change Order

### The Posting Order Problem

One of the most common complaints with BobCAD-CAM is that the posted G-code reorders operations by tool number instead of the order shown in the CAM tree. For example, if your CAM tree has operations using T3, T9, T10, T9, the posted output may group all T9 operations together.

**Fix:**

1. Go to **CAM > Posting > Posting Options**
2. Look for the **Sort by Tool** setting
3. Disable tool sorting — this preserves the operation order from the CAM tree
4. Re-post the job and verify the tool change order matches your intended sequence

If the setting isn't available in the UI, it may need to be changed in the post processor file itself. Look for a sorting flag in the .bcpst file and set it to false.

## Customizing the Post Processor

### Safe Z Height

The safe Z height determines where the tool retracts between operations. To change it:

1. Open the .bcpst file in a text editor (Notepad++)
2. Search for `SafeZ` or `ClearanceZ`
3. Set the value to your desired safe height (e.g., 100mm or 4 inches)
4. Save the file and re-post

### Spindle Speed and Feed Rate Format

Some controllers expect spindle speed in a specific format. Check the G-code output for:

- `S1000` — RPM format (standard)
- `S1.0` — surface speed format (some lathe controllers)

If the format is wrong, edit the post processor's spindle output section.

### Tool Change Block

The standard tool change format is:
```
T1 M06
```

Some machines require additional commands:
```
T1 M06
G43 H1
S1000 M03
```

If your machine needs G43 (tool length compensation) after each tool change, ensure the post processor includes it. Search for `ToolChange` in the .bcpst file and add the G43 line.

### Work Offset Output

If your machine uses G54-G59 work offsets, the post should output the correct G-code:

```
G54
```

If the work offset isn't being output, check the post processor's work offset section and ensure it reads the offset from the CAM setup.

## Common G-Code Issues

### Missing G43 Tool Length Compensation

The tool crashes into the workpiece because the machine doesn't account for tool length.

**Fix:** Add `G43 H[tool_number]` to the post processor's tool change section.

### Wrong Arc Format

Some controllers require I/J format for arcs, others accept R format. If your machine errors on arc moves:

**Fix:** Change the arc output format in the post processor from R to I/J or vice versa.

### Excessive Rapid Moves

The G-code has too many Z retracts between closely spaced cuts, slowing down the machine.

**Fix:** Reduce the safe Z height or enable "linking moves" in the post processor that keep the tool near the surface between cuts.

### No Coolant Commands

If the G-code doesn't include M08 (coolant on) / M09 (coolant off):

**Fix:** Add coolant commands to the post processor's operation start and end sections.

## Testing a Modified Post Processor

After any post processor change:

1. **Post a simple test part** — a rectangle profile with one tool
2. **Review the G-code manually** — check tool change, safe Z, feed rates, and arc format
3. **Run in air** — run the program with the tool above the workpiece to verify motion
4. **Test on scrap** — run on inexpensive material before production parts
5. **Keep backups** — save the original .bcpst file before making changes

## Best Practices

- **Document post changes** — add comments in the .bcpst file explaining what you changed and why
- **Use consistent naming** — name custom posts with your machine model and date
- **Test after every update** — BobCAD updates may overwrite post processor files
- **Contact support for complex changes** — BobCAD support can customize posts for unusual machine configurations
