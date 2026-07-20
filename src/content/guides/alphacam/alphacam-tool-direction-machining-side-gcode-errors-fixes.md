---
title: "AlphaCAM Tool Direction and Machining Side: Common G-Code Errors and Fixes"
excerpt: "Fix AlphaCAM tool direction errors, wrong machining side selection, G-code rapid move collisions, and post processor safe Z height configuration for CNC routing."
category: "troubleshooting"
softwareSlug: "alphacam"
keyword: "alphacam tool direction error g-code collision fix"
slug: "alphacam-tool-direction-machining-side-gcode-errors-fixes"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-13"
sources:
  - "https://cadcamlessons.com/tool-directions-alphacam-tutorial-lesson-10/"
  - "https://cadcamlessons.com/alphacam-basics-rough-finish/"
---

# AlphaCAM Tool Direction and Machining Side: Common G-Code Errors and Fixes

The most common errors in AlphaCAM come down to two things: wrong tool direction and unsafe G-code. We've seen beginners ruin expensive material because the tool was cutting on the wrong side of the line, and we've seen near-misses from rapid moves to Z0. Here's how to diagnose and fix both.

## Tool Direction Basics

Every geometry in AlphaCAM has a direction arrow. This arrow determines:

- **Direction** — CW (clockwise) or CCW (counter-clockwise)
- **Side** — which side of the geometry the tool offset goes

For closed geometries:
- **CW + Outside** — tool offsets to the outside of the contour (standard for outer profiles)
- **CCW + Inside** — tool offsets to the inside of the contour (standard for holes and pockets)
- **CW + Inside** — tool offsets inside, but climb cutting (may cause tear-out in wood)
- **CCW + Outside** — tool offsets outside, but climb cutting

For open geometries (lines, arcs):
- **Left** — tool offsets to the left of the direction arrow
- **Right** — tool offsets to the right of the direction arrow
- **Center** — tool follows the geometry with no offset (undercuts the workpiece)

## Diagnosing Wrong Tool Direction

### Symptom: Tool Cuts on Wrong Side

The toolpath appears on the wrong side of the geometry. For example, an outside profile toolpath appears inside the contour.

**Fix:** Open Tool Directions (Machine tab), select the geometry, and change the Side setting. The arrow updates immediately.

### Symptom: Hole Is Oversized or Undersized

The finished hole is the wrong size by approximately the tool diameter.

**Fix:** The tool direction is set to Outside instead of Inside. Change to Inside for hole machining. The toolpath should be inside the circle, offset by the tool radius.

### Symptom: Part Is Wrong Size

The finished part is larger or smaller than expected by the tool diameter.

**Fix:** For outside profiling, use CW + Outside. If the part is too large, the direction is probably set to Inside. If it's too small, there may be a compensation issue.

## G-Code Rapid Move Errors

### The Z0 Rapid Move Problem

One of the most dangerous G-code errors is a rapid move (G0) to Z0 — the cutting surface level. This means the tool travels at rapid speed across the workpiece surface, which can:

- Break the tool
- Damage the workpiece
- In extreme cases, cause the spindle to crash

**Diagnosis:** Open the generated G-code and look for lines like:
```
N70 G0 Z0
```
This is a rapid move to Z0. It should be a feed move (G1) or the Z value should be the safe retract height.

**Fix:** The post processor's safe Z setting is incorrect. Edit the post processor file (.arp) and set the safe Z height to a value above the workpiece (e.g., 25mm). The safe Z is typically defined in the post processor's initial setup section.

### Missing Tool Length Compensation

If the G-code doesn't include G43 (tool length compensation), the machine won't account for tool length differences.

**Diagnosis:** Look for `G43 Hxx` after each tool change. If it's missing, the post processor needs to be updated.

**Fix:** Edit the post processor to include G43 H[tool number] after each tool change block.

### Wrong Spindle Speed

If the spindle speed in the G-code doesn't match what you set in the operation:

**Diagnosis:** Check the S-value in the G-code. `S999` means 999 RPM, which may be too slow for the tool and material.

**Fix:** Verify the spindle speed setting in the operation's Feed Rates tab. If the post processor is overriding it, check the post's spindle speed calculation.

## Post Processor Configuration

### Finding the Post Processor File

Post processors are located at `C:\Alphacam\LICOMDAT\RPost.Alp\` for router posts (.arp extension) and `RPost.Alp\` for milling posts (.amp extension).

### Common Post Processor Settings to Check

1. **Safe Z height** — the height the tool retracts to between operations. Should be above the workpiece + clamping.
2. **Spindle start/stop** — M03 (start) and M05 (stop) commands
3. **Tool change format** — Txx M06 for most controllers
4. **Feed rate units** — G94 (mm/min or inch/min) vs G95 (mm/rev)
5. **Coolant commands** — M07/M08 (on) and M09 (off)

### Editing Post Processors

Post processors are text files that can be edited in Notepad. However, the syntax is specific to AlphaCAM's post processor language. Always make a backup before editing, and test with a simple part first.

## Best Practices for Error Prevention

- **Always show direction arrows** (Ctrl+G) before creating operations
- **Verify the toolpath visually** — it should be offset from geometry by the tool radius
- **Review the G-code** before sending to the machine — check for G0 moves to Z0
- **Test new post processors** on scrap material first
- **Keep post processor backups** — if a post works, save a copy before editing
- **Use simulation** — AlphaCAM's built-in simulation shows the tool moving along the toolpath, catching direction errors visually
