---
title: "EPLAN Electric P8 Connection and Wire Numbering: Auto-Generated Reports and Potential Issues"
excerpt: "Troubleshoot EPLAN Electric P8 connection numbering, wire number assignment, potential tracking, and auto-generated reports including BOM, terminal diagrams, and cable lists."
category: "troubleshooting"
softwareSlug: "eplan-electric-p8"
keyword: "eplan electric p8 connection wire numbering potential tracking reports"
slug: "eplan-electric-p8-connection-wire-numbering-potential-tracking"
author: "CADGuide Tools Editorial Team"
readTime: "10 min read"
date: "2026-07-13"
sources:
  - "https://www.eplan.com/de-en/products/eplan-electric-p8/"
  - "https://www.eplan.com.tr/fileadmin/eplan_content_international/tr/data/Student_Handbook.pdf"
---

# EPLAN Electric P8 Connection and Wire Numbering: Auto-Generated Reports and Potential Issues

One of EPLAN's most powerful features is automatic connection numbering and potential tracking. Unlike simple drawing tools where you manually label wires, EPLAN understands the electrical logic — it knows which wires are connected, what potential they carry, and can automatically generate wire numbers, terminal diagrams, and cable lists. But when this automation goes wrong, troubleshooting requires understanding how EPLAN thinks about connections.

## How EPLAN Handles Connections

### Connection vs. Wire

In EPLAN, a **wire** is a graphical line on the schematic. A **connection** is the logical electrical link between two device pins. One connection may span multiple wires across multiple pages.

When you draw a wire between two device pins, EPLAN creates a logical connection. The connection carries:
- **Source and target** — which pins are connected
- **Potential** — the electrical potential (e.g., L1, N, +24V)
- **Connection number** — auto-generated identifier
- **Cross-references** — where the connection appears on other pages

### Potential Tracking

EPLAN tracks electrical potential through the schematic:

1. A potential starts at a source (e.g., a power supply terminal)
2. The potential propagates through all connected wires
3. The potential changes at devices (e.g., a transformer changes L1 to 24V)
4. EPLAN identifies potential breaks and mismatches

### Potential Types

- **Line potential** — power circuits (L1, L2, L3, N, PE)
- **Signal potential** — control signals (24V, 0V, analog signals)
- **Undefined potential** — EPLAN can't determine the potential

## Wire Numbering

### Automatic Numbering

EPLAN auto-generates wire numbers based on the numbering format:

1. **Options > Settings > Projects > [Project] > Connections > Numbering**
2. Configure the numbering format:
   - **Counter** — sequential numbers (1, 2, 3...)
   - **Potential + counter** — L1-1, L1-2, N-1, N-2...
   - **Device tag + pin** — -K1:1, -K1:2...
   - **Custom format** — user-defined structure

### Numbering Scope

- **Project-wide** — all connections in the project
- **Page-specific** — only connections on selected pages
- **Manual** — only connections you select

### Running Numbering

1. **Project data > Connections > Numbering (offline)**
2. Select the scope (entire project or selected pages)
3. EPLAN assigns numbers to all unnumbered connections
4. Existing numbers are preserved unless "Renumber all" is selected

## Common Connection Issues

### Broken Connections

A wire appears connected visually but EPLAN doesn't recognize the connection.

**Symptoms:**
- Wire number is missing
- Cross-reference doesn't show the connection
- Terminal diagram is incomplete

**Causes and Fixes:**

1. **Wire doesn't reach the pin** — the wire endpoint is near but not on the pin. Zoom in and verify the connection point is exactly on the pin.

2. **Different wire layers** — wires on different layers don't connect. Check that both wire segments are on the same layer (typically "ELK_WIRE").

3. **T-connection not recognized** — where three wires meet, EPLAN needs a connection point. Use **Insert > Connection symbol > T-connection** at the junction.

4. **Page boundary** — a connection that crosses pages requires an interruption point. Use **Insert > Connection symbol > Interruption** and match the source and target names.

### Potential Mismatch

EPLAN reports a potential mismatch where two different potentials meet on the same wire.

**Symptoms:**
- Warning message in the message list
- Wire shows two different potential names

**Fix:** Check the potential definition at both ends. If L1 and L2 are on the same wire, there's a design error. If the potentials should be the same, update the potential definition at one end.

### Missing Cross-References

A connection appears on one page but the cross-reference to the other page is missing.

**Fix:**
1. Verify the interruption point names match exactly on both pages
2. Run **Project > Check** to update cross-references
3. Check that both pages are in the same project

### Wire Numbers Not Updating

After adding or modifying connections, wire numbers don't update.

**Fix:**
1. Run **Project data > Connections > Numbering (offline)**
2. Select "Renumber all" if existing numbers need updating
3. Check that the numbering format hasn't changed

## Auto-Generated Reports

EPLAN generates reports from the connection data:

### Parts List (BOM)

1. **Reports > Generate > Parts list**
2. EPLAN collects all articles used in the project
3. Groups by part number and sums quantities
4. Output includes: part number, description, quantity, manufacturer, price

### Terminal Diagram

1. **Reports > Generate > Terminal diagram**
2. EPLAN collects all terminal strips
3. For each strip, shows:
   - Terminal number
   - Connected wires (both sides)
   - Wire numbers
   - Potential names
   - Cross-references to schematic pages

### Cable List

1. **Reports > Generate > Cable list**
2. EPLAN collects all cables
3. Shows: cable number, source, target, cores, connections per core

### Connection List

1. **Reports > Generate > Connection list**
2. Shows all connections: source pin, target pin, wire number, potential, length

### Device List

1. **Reports > Generate > Device list**
2. Shows all devices: device tag, article, description, location

## Report Generation Issues

### Report Is Empty

- No devices have been placed in the project
- Devices don't have article data assigned
- The report filter is too restrictive

### Report Shows Wrong Quantities

- Article data is duplicated (same part assigned multiple times)
- Some devices don't have article data
- Run **Project > Check** to update the data

### Terminal Diagram Missing Terminals

- Terminals aren't placed in the schematic
- Terminals don't have the correct device tag format
- Terminal strip numbering isn't configured

## Best Practices

- **Run Project Check regularly** — updates connections and cross-references
- **Use consistent potential names** — avoid mixing "L1" and "l1"
- **Verify connections visually** — zoom in on junctions to confirm connections
- **Use T-connection symbols** — don't rely on wire overlap for junctions
- **Standardize wire numbering format** — configure in the project template
- **Generate reports early** — catch issues before the design is complete
- **Use the message list** — EPLAN reports warnings and errors that guide troubleshooting
- **Check for broken connections** after major edits — use **Project > Check** after adding pages or devices
