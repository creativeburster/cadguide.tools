---
title: "Bambu Studio AMS Multi-Color Printing: Setup, Wipe Tower Configuration, and Troubleshooting"
excerpt: "The Bambu Lab AMS enables automated multi-color printing, but successful multi-color prints require correct filament assignment, wipe tower tuning, and understanding the most common AMS failures. I cover AMS setup in Bambu Studio, purge volume optimization, and troubleshooting filament loading and color bleed issues."
category: "troubleshooting"
softwareSlug: "bambu-studio"
keyword: "Bambu Studio AMS multi-color printing setup troubleshooting"
slug: "bambu-studio-ams-multi-color-setup-troubleshooting"
author: "CAD IT Admin"
readTime: "11 min"
date: "2025-06-22"
sources:
  - "https://adpindustries.com/blog/bambu-lab-multi-color-printing-guide/"
  - "https://forum.bambulab.com/t/complete-color-mishap-in-multi-color-print-double-ams-setup/168385"
  - "https://www.envirolaser3d.com/blogs/news-and-insights/bambu-lab-ams-setup-troubleshooting-guide"
  - "https://www.reddit.com/r/BambuLab/comments/1ffyc3t/print_multicolour_without_ams_from_bambu_studio/"
---

# Bambu Studio AMS Multi-Color Printing: Setup, Wipe Tower Configuration, and Troubleshooting

I run multiple Bambu Lab printers with AMS units for production multi-color printing, and the AMS system is remarkably reliable once you understand its quirks. But getting from unboxing to consistently clean multi-color prints requires proper setup in Bambu Studio and an understanding of the failure modes that can ruin a 10-hour print at hour 3.

## AMS Setup in Bambu Studio

### Physical Setup

Before configuring Bambu Studio, ensure the AMS hardware is properly set up:
1. Connect the AMS to the printer via the AMS hub (for multi-AMS setups) or directly
2. Load filament into each slot — the AMS will automatically detect the filament type and color via the RFID tag
3. For non-Bambu filament (no RFID), manually select the filament type in Bambu Studio

### Filament Assignment in Bambu Studio

Once the AMS is connected and loaded, Bambu Studio displays the filament slots in the top panel. Each slot corresponds to a physical AMS position.

A critical tip from the community: "Re-check filament slot assignments in Bambu Studio before slicing." The slot-to-color mapping in Bambu Studio must match the physical AMS layout. If you rearrange spools in the AMS without updating Bambu Studio, you'll get the wrong colors.

### Assigning Colors to Your Model

Bambu Studio offers three ways to assign colors to a multi-color print:

1. **Paint-on tool**: Select the model, click the paint brush icon, choose a filament slot, and paint directly on the model surface. This is the most precise method for complex models.

2. **Face painting**: Click on individual faces of the model to assign them to a specific extruder/filament slot.

3. **Layer-based color changes**: Right-click the layer slider in Bambu Studio and add a color change at a specific layer height. This is the simplest method for models that change color at a specific Z height.

## Wipe Tower Configuration

The wipe tower is essential for multi-color printing with a single nozzle. It's a sacrificial structure where the printer purges the old color and primes the new one before moving to the model.

### Key Wipe Tower Settings

In Bambu Studio, find these under **Others → Wipe tower**:

- **Wipe tower minimal volume**: Default is around 15 mm³. This controls the minimum amount of filament purged during each color change. Increase for high-contrast color changes (e.g., black to white), decrease for similar colors.

- **Wipe tower extruder**: Which filament slot to use for the wipe tower structure itself. I use the same slot as the first color to avoid extra purging.

- **Wipe tower width**: Default is 60 mm. I keep this at 60 mm for stability. A narrower wipe tower is less stable and more likely to detach.

- **Wipe tower rotation angle**: Rotate the wipe tower if it interferes with the model or other objects on the build plate.

### Purge Volume Optimization

The purge volume is the amount of filament flushed during each color change. Too little causes color bleed; too much wastes filament and increases print time.

Bambu Studio automatically calculates purge volumes based on the filament types involved. However, I tune these manually:

- **Same color family** (light gray to dark gray): Reduce purge volume by 30-40%
- **High contrast** (white to black, yellow to blue): Keep default or increase by 10%
- **Transparent to opaque**: Increase purge volume by 20%
- **PLA to PETG or vice versa**: Increase significantly — different materials don't mix well

The "flushing multiplier" in Bambu Studio's filament settings lets you scale all purge volumes up or down. I set this to 0.7 for most PLA multi-color prints to reduce waste while maintaining acceptable color separation.

## Multi-Color Without AMS

You can do manual color changes on Bambu printers even without an AMS. A Reddit discussion describes the process: "Pause automatically, go to the printer's menu, unload filament as you normally would without AMS. It'll warm up and eject, then reload the new filament. Then scroll back to the print menu and resume print."

In Bambu Studio, you can add manual color changes by:
1. Right-clicking the layer slider at the desired height
2. Selecting "Add filament change"
3. The printer will pause at that layer and prompt for filament swap

This works well for simple two-color prints where the color change happens at a specific layer height.

## Common AMS Failures and Fixes

### Filament Not Loading from AMS

**Symptoms**: Printer shows "AMS filament runout" or "AMS filament not detected" despite filament being loaded.

**Causes and fixes**:
1. **PTFE tube kinked or blocked**: Inspect the PTFE tubes from the AMS to the toolhead. Replace any kinked tubes.
2. **AMS slot sensor misaligned**: The optical sensor in each AMS slot can get covered in filament dust. Clean with compressed air.
3. **Filament spool too heavy or tangled**: Ensure the spool rotates freely in the AMS. Some cardboard spools don't rotate smoothly — transfer to a plastic spool or use an AMS spool adapter.
4. **Filament tip deformed**: If the filament tip is bent or bulbous, it won't feed through the PTFE tube. Cut the tip at an angle before loading.

### Color Bleed Between Sections

**Symptoms**: The new color is contaminated with the previous color, creating a muddy transition.

**Fixes**:
1. Increase the wipe tower minimal volume
2. Increase the flushing multiplier in filament settings
3. Print similar colors adjacent to each other in the AMS to minimize high-contrast transitions
4. Use the "flush into support" option to direct some purge material into support structures instead of the wipe tower

### Wipe Tower Detaches from Build Plate

**Symptoms**: The wipe tower comes loose during printing, causing the entire multi-color print to fail.

**Fixes**:
1. Increase the wipe tower brim width
2. Ensure the build plate is clean and properly calibrated
3. Reduce the wipe tower's first layer speed
4. Use a textured PEI plate for better adhesion with PLA
5. Enable "prime tower" brim in Bambu Studio

### AMS Not Recognizing Filament

**Symptoms**: AMS shows "unknown filament" or doesn't detect the spool.

**Fixes**:
1. For Bambu filament: Ensure the RFID tag on the spool is intact and facing the AMS sensor
2. For third-party filament: Manually select the filament type in Bambu Studio before printing
3. Update AMS firmware via Bambu Studio's device panel
4. Clean the AMS RFID reader with compressed air

### Double AMS Color Mishap

A Bambu Lab forum user reported: "Complete color mishap in multi-color print (double AMS setup)" — where colors from the second AMS unit are swapped or incorrect.

**Fix**: In Bambu Studio, verify that the AMS slot numbering matches the physical AMS order. AMS 1 slots are 1-4, AMS 2 slots are 5-8. If you rearranged the AMS units physically, update the order in Bambu Studio's device settings.

## Tips for Reliable Multi-Color Printing

1. **Dry your filament** — moist filament causes stringy tips that jam in the PTFE tubes. Dry at 50°C for 4 hours before multi-color prints.
2. **Use Bambu filament when possible** — the RFID tags enable automatic filament detection and optimized purge volumes.
3. **Minimize color changes** — each color change adds 30-60 seconds and wastes 2-5 grams of filament. Design models to minimize transitions.
4. **Print the wipe tower with a brim** — always. A detached wipe tower ruins the entire print.
5. **Use the same filament type for all colors** — mixing PLA and PETG in a multi-color print causes adhesion issues between colors.
6. **Enable "flush into objects' infill"** — this directs some purge material into the infill of your model, reducing wipe tower size and filament waste.

## Summary

The Bambu Lab AMS is the most reliable consumer multi-color 3D printing system available, but success depends on proper Bambu Studio configuration. The three most important settings are filament slot assignment, wipe tower configuration, and purge volume tuning. Start with Bambu's defaults, then adjust purge volumes based on your specific color combinations. Always dry filament before multi-color prints, and never reduce the wipe tower brim — a detached wipe tower is the most common cause of total multi-color print failure.
