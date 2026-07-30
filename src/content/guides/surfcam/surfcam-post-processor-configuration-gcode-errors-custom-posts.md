---
title: "Surfcam Post Processor Configuration: M-Post vs S-Post, Custom Post Creation, and G-Code Output Errors for Grbl and Mach3"
excerpt: "Surfcam's two-tier post processor architecture (M-Post and S-Post) covers 250+ machine configurations, but users of Grbl, Mach3, and LinuxCNC controllers face G-code compatibility errors. We cover post processor selection, the postform.m/surfcam.pst parity problem, and manual post editing for unsupported controllers."
category: "post-processing"
softwareSlug: "surfcam"
keyword: "Surfcam post processor M-Post S-Post G-code error Grbl Mach3 custom post configuration"
slug: "surfcam-post-processor-configuration-gcode-errors-custom-posts"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://hexagon.com/products/surfcam-post-processors"
  - "https://community.carbide3d.com/t/surfcam-post-processor-nomad/5975"
  - "https://industrialmonitordirect.com/blogs/knowledgebase/adding-custom-posts-in-surfcam-velocity-step-by-step-guide"
---

# Surfcam Post Processor Configuration: M-Post vs S-Post, Custom Post Creation, and G-Code Output Errors for Grbl and Mach3

Surfcam's post processor system determines the quality and compatibility of NC code output. With two built-in post processors (M-Post and S-Post) covering 250+ configurations, most mainstream CNC controllers are supported out of the box. However, users of hobbyist and open-source controllers like Grbl, Mach3, and LinuxCNC face persistent G-code compatibility issues that require manual post editing or custom post creation.

## M-Post vs S-Post: Which to Use

### M-Post (Standard)

- **200+ pre-built configurations** for major CNC manufacturers (Fadal, Haas, Mazak, Fanuc)
- Template-based structure that looks and reads like an NC program
- Editable in any text editor — no specialized programming knowledge needed
- Supports: EDM, Lathe, 2-axis, and 3-axis machine controls
- On-the-fly changes can be made on the shop floor without re-posting the toolpath

**Best for**: Simple 2-3 axis machines with standard controllers. When you need to make quick edits to NC code without returning to Surfcam.

### S-Post (Advanced)

- **50+ pre-built configurations**
- Option File Generator: Create custom posts via Java UI without programming
- Factory Interface Language (FIL) for external file I/O and toolpath manipulation
- Supports: 2- to 4-axis lathes (1-2 turrets), mills up to 15 axes with indexing tables, rotary/tilt heads
- Also supports: lasers, wire EDMs, punches, grinders, drills, routers
- Includes CIMpro Java interface for accessing complete NC/CNC programming system

**Best for**: Multi-axis machines, complex kinematics, and when you need to create a custom post without writing code.

### Third-Party Options

- **OmegaPost**: High-performance CNC code generator (third-party)
- **3DPost**: Advanced template language, hybrid machine support, mill-turn capabilities, full machine simulation

## The Postform/Surfcam.pst Parity Problem

Surfcam Velocity uses a two-tier architecture for post processor storage:

1. **`postform.m`**: Binary library storing compiled post definitions
2. **`surfcam.pst`**: Flat-text registry file enumerating which posts appear in the UI selector

### The Critical Issue

Both files must be updated together. Updating only one causes problems:

| Updated File | Effect |
|-------------|--------|
| `postform.m` only | Post exists in library but doesn't appear in the selector menu. Surfcam fails to bind the post even if the name is typed manually. |
| `surfcam.pst` only | Menu entry is visible, but selecting it returns "post not found" or loads an empty post stub. |

### The Post Menu Wizard

The **Post Menu Wizard** maintains both stores automatically in a single transaction. This is the supported path for adding pre-compiled posts.

**Requirements**:
- Local administrator rights (writes to Program Files locations and protected registry)
- SURFCAM must be closed during the wizard operation
- No read-only attributes on target files

### Manual Editing (When Wizard Is Unavailable)

Only use manual editing when:
- Legacy Velocity3 installs prior to wizard release
- OEM-restricted deployments where wizard has been stripped
- Rebuilding `postform.m` from a peer-machine export

**Steps**:
1. **Backup `postform.m`** — a corrupt file forces a full Surfcam reinstall
2. Edit `postform.m` to add the post definition
3. Separately register the post in `surfcam.pst`
4. Ensure `surfcam.pst` is NOT read-only — read-only attributes silently drop manual edits on next launch

### Verification After Adding a Post

1. **Menu visibility**: Confirm the post appears in the selector
2. **Post-bind check**: Select the post and open configuration dialog — should load without "postform not found" or "invalid post record" errors
3. **Dry-run NC output**: Run a facing pass, contour pass, and drill cycle — verify header and tool change blocks match the target controller
4. **Registry persistence**: Close and relaunch Surfcam — confirm the post still appears. If it disappears, `surfcam.pst` was not committed (likely read-only attribute)

## G-Code Errors with Grbl Controllers

Users attempting to output Surfcam toolpaths to Grbl-based CNC machines encounter a cascade of G-code compatibility errors.

### Error Sequence

| Error | Cause | Fix |
|-------|-------|-----|
| `grbl error 26` (Syntax Error) | Program number line (e.g., `O0001`) not recognized | Remove the program number line |
| `Unsupported G Code` | Multiple modal G-codes in one block (e.g., `G00 G17 G70 G40 G80 G90 M05`) | Remove unsupported codes: G70 (imperial), G40, G80 |
| `Multiple Motion Modes` | Duplicate G00 in same line (e.g., `G00 G90 G00 X0.3509 Y-0.6102 S9000 M03`) | Remove duplicate G00 |
| `bad arc format, No I/J` | Arc move missing J component (e.g., `G03 X0.2936 Y-0.5977 Z-0.0017 I-0.0125`) | Add missing J value or convert to R-format arcs |

### Root Cause

Surfcam's standard post processors output G-code for industrial controllers (Fanuc, Haas, Mazak) that accept modal groups and multi-code blocks. Grbl has a much stricter G-code interpreter that requires:
- One motion mode per block
- No unsupported codes (G70, G80, etc.)
- Complete arc parameters (both I and J)
- No program number lines

### Solution Path

1. **Check for Mach3 post**: Mach3 posts are closer to Grbl compatibility — start from a Mach3 post if available
2. **Edit M-Post template**: M-Post allows editing header/footer G-code in a text editor. Remove unsupported codes from the template
3. **Manual post creation**: Surfcam support has stated they must create the post if it affects tool motion — contact them for custom Grbl posts
4. **Post-process editing**: Use a text editor or script to clean up the NC file after posting (remove unsupported codes, fix arc formats)

## File Not Found Error During Posting

### Symptom

When posting a toolpath, Surfcam displays: "File not found c:\surfcam\dsn\[project].ncd\[project]aaa.ppg"

### Cause

The path to the post processor file is misdirected, or the NCD folder has been deleted or moved using Windows Explorer (instead of Surfcam's project management).

### Fix

1. Check that the NCD folder exists in the expected location
2. If files were moved via Windows Explorer, start a new setup section and reprogram the part from scratch
3. Alternatively, perform a **repair install** from the Surfcam disc to restore directory structure and file paths
4. Check that the correct post processor is selected for the target machine

## Best Practices

1. **Use the Post Menu Wizard** — never manually edit `postform.m` unless absolutely necessary
2. **Always backup `postform.m`** before any manual edit
3. **Check `surfcam.pst` for read-only attributes** before manual editing
4. **For Grbl/Mach3/LinuxCNC**: Start from the closest compatible post and edit in a text editor
5. **Test with dry runs**: Post a simple facing + contour + drill cycle before running production parts
6. **Keep software updated**: Surfcam dealers can be difficult to work with — maintain your license and support contract
7. **Verify NC output against known-good files** from the same controller before running on the machine
