---
title: "Land F/X Irrigation Design: Equipment Placement, Pipe Sizing, and Scheduling"
excerpt: "Design irrigation systems with Land F/X in AutoCAD: place heads and valves, draw pipe networks, auto-size pipes, calculate pressure and flow, and generate irrigation schedules and reports."
category: "workflow"
softwareSlug: "land-fx"
keyword: "land f/x irrigation design pipe sizing equipment schedule"
slug: "land-fx-irrigation-design-equipment-pipe-sizing-scheduling"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.landfx.com/docs/planting.html"
  - "http://landfx.com/learn"
---

# Land F/X Irrigation Design: Equipment Placement, Pipe Sizing, and Scheduling

Land F/X's irrigation tools transform AutoCAD from a drawing tool into a complete irrigation design system. You can place heads and valves, draw pipe networks, automatically size pipes based on flow calculations, and generate schedules — all while maintaining a live database of equipment and hydraulic data.

## Irrigation Project Setup

### Set Up the Irrigation Project

1. Go to **F/X Irrigation** ribbon
2. Click **Project Manager** — use the same project as your planting design
3. Verify units and plot scale are set correctly (F/X Admin > Scale)

### Configure Irrigation Preferences

1. Go to **F/X Irrigation > Preferences**
2. Set:
   - **Pipe material** — PVC, HDPE, copper (affects friction loss calculations)
   - **Pipe sizing method** — velocity limit or pressure loss limit
   - **Maximum velocity** — typically 5 ft/s (1.5 m/s)
   - **Maximum pressure loss** — typically 10% of operating pressure
   - **Service line size** — main water supply pipe size
   - **Static pressure** — available water pressure (psi or bar)

## Placing Irrigation Equipment

### Place Sprinkler Heads

1. Go to **F/X Irrigation > Place Heads**
2. Select equipment from the Land F/X irrigation library:
   - **Rotors** — large turf areas (35-50 ft radius)
   - **Sprays** — small turf and shrub areas (10-15 ft radius)
   - **Bubblers** — trees and individual plants
   - **Drip emitters** — individual plant watering
3. Set the nozzle type and radius
4. Click to place heads in the drawing
5. Land F/X displays the coverage arc for each head

### Place Valves

1. Go to **F/X Irrigation > Place Valves**
2. Select valve type:
   - **Remote control valves (RCV)** — electric solenoid valves
   - **Isolation valves** — manual shutoff valves
   - **Quick couplers** — hose connection points
3. Click to place the valve
4. Each valve becomes a "zone" that will control a group of heads

### Assign Heads to Valves

1. Go to **F/X Irrigation > Assign Heads to Valve**
2. Click the valve, then click the heads it controls
3. Land F/X groups the heads under that valve
4. The total flow for the zone is calculated automatically
5. Verify the zone flow doesn't exceed the valve capacity

## Drawing Pipes

### Draw Mainline

1. Go to **F/X Irrigation > Pipe > Mainline**
2. Draw from the water source (POC) to each valve
3. The mainline is drawn on the irrigation mainline layer
4. Mainline pipe size is typically set manually (larger than lateral pipes)

### Draw Lateral Pipes

1. Go to **F/X Irrigation > Pipe > Lateral**
2. Draw from each valve to its assigned heads
3. Land F/X tracks which heads each pipe segment serves
4. The pipe network is drawn on the irrigation lateral layer

### Pipe Routing Tips

- **Route along hardscape edges** — easier to trench
- **Avoid crossing under trees** — root damage during installation
- **Minimize crossings** — each crossing requires a deeper trench
- **Use the shortest path** — reduces pipe cost and friction loss

## Auto-Sizing Pipes

### Run the Pipe Sizing Tool

1. Go to **F/X Irrigation > Size Pipes**
2. Land F/X calculates the flow through each pipe segment based on:
   - The heads downstream of each pipe
   - The flow rate of each head (from the nozzle data)
   - The total flow for each zone
3. Land F/X sizes each pipe segment based on:
   - **Velocity limit** — keeps water velocity below the maximum (e.g., 5 ft/s)
   - **Friction loss** — keeps pressure loss within acceptable limits
   - **Pipe material** — different materials have different friction characteristics

### Review the Sizing Results

After sizing, Land F/X displays:
- **Pipe sizes** — each pipe segment is labeled with its size
- **Flow rates** — GPM or L/s for each segment
- **Velocity** — ft/s or m/s for each segment
- **Pressure loss** — psi or bar for each segment

Check for:
- **High velocity** — above the maximum, needs larger pipe
- **Excessive pressure loss** — above the limit, needs larger pipe
- **Undersized zones** — total zone flow exceeds valve capacity

### Manual Pipe Sizing

If you need to override the auto-sizing:

1. Click a pipe segment
2. Right-click > **Edit Pipe Size**
3. Select the desired pipe size
4. Land F/X recalculates the hydraulic data

## Calculating Pressure and Flow

### Zone Pressure Requirements

For each zone, Land F/X calculates:

1. **Head operating pressure** — the pressure each head needs (from nozzle data)
2. **Lateral pipe friction loss** — pressure lost in the lateral pipes
3. **Valve pressure loss** — pressure lost through the valve
4. **Total zone pressure** — head pressure + lateral loss + valve loss

### System Pressure Requirements

1. Go to **F/X Irrigation > Pressure Requirements**
2. Land F/X reports:
   - **Worst-case zone** — the zone requiring the most pressure
   - **Mainline friction loss** — pressure lost in the mainline
   - **Total system pressure** — static pressure needed at the POC
3. Compare against available pressure
4. If required pressure > available pressure, you need to:
   - Reduce zone sizes (fewer heads per zone)
   - Increase pipe sizes
   - Use a booster pump

## Generating Irrigation Schedules

### Equipment Schedule

1. Go to **F/X Irrigation > Schedule**
2. Select **Equipment Schedule**
3. The schedule includes:
   - **Equipment type** — rotor, spray, valve, etc.
   - **Manufacturer and model** — from the Land F/X library
   - **Nozzle/size** — nozzle type or pipe size
   - **Quantity** — auto-calculated
   - **Flow** — GPM or L/s per unit
   - **Pressure** — operating pressure

### Pipe Schedule

1. Go to **F/X Irrigation > Schedule > Pipe Schedule**
2. The schedule includes:
   - **Pipe size** — diameter
   - **Pipe material** — PVC, HDPE, etc.
   - **Length** — total length of each size (auto-calculated)
   - **Quantity** — number of fittings

### Valve/Zone Schedule

1. Go to **F/X Irrigation > Schedule > Valve Schedule**
2. The schedule includes:
   - **Valve number** — zone identifier
   - **Valve model** — manufacturer and model
   - **Heads per zone** — number of heads
   - **Zone flow** — total GPM or L/s
   - **Zone pressure** — required pressure

## Common Issues

### Pipe Sizing Produces Very Large Pipes

- The zone has too many heads — split into smaller zones
- The velocity limit is too low — increase to 5-7 ft/s
- The pipe material is wrong — check preferences

### Pressure Requirements Exceed Available Pressure

- Reduce the number of heads per zone
- Increase pipe sizes
- Use a booster pump
- Use pressure-compensating heads

### Heads Not Assigned to a Valve

- Use **Assign Heads to Valve** to group heads
- Unassigned heads won't be included in calculations or schedules

## Best Practices

- **Set up preferences before placing equipment** — pipe material, velocity limits, pressure
- **Place heads before pipes** — the pipe network follows the head layout
- **Assign heads to valves before sizing** — sizing requires zone information
- **Size pipes after all heads and pipes are placed** — sizing is based on the complete network
- **Check pressure requirements** — verify the system can operate with available pressure
- **Use the Land F/X Trainer** — type LANDFX in the command line for interactive training
- **Review the schedule before issuing** — verify quantities and equipment match the design
