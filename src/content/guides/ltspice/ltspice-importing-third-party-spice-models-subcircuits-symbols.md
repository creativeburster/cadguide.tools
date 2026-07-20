---
title: "LTspice Importing Third-Party SPICE Models: Subcircuits, Symbols, and .include Directives"
excerpt: "Import manufacturer SPICE models into LTspice using .include and .lib directives, create custom symbols for subcircuits, and fix pin mapping issues with step-by-step instructions."
category: "troubleshooting"
softwareSlug: "ltspice"
keyword: "ltspice import spice model subcircuit symbol include"
slug: "ltspice-importing-third-party-spice-models-subcircuits-symbols"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-13"
sources:
  - "https://ez.analog.com/design-tools-and-calculators/ltspice/a/faqs-docs/c/getting-started-with-ltspice"
  - "https://www.analog.com/ltspice"
---

# LTspice Importing Third-Party SPICE Models: Subcircuits, Symbols, and .include Directives

LTspice ships with Analog Devices' component library, but sooner or later you'll need to simulate a part from TI, Maxim, or another vendor. Importing third-party SPICE models is straightforward once you understand the three pieces: the model file, the symbol, and the directive that links them.

## Types of SPICE Models

There are two main types you'll encounter:

1. **.MODEL statements** — define intrinsic SPICE devices (diodes, BJTs, MOSFETs). These use built-in symbol types (D, NPN, PNP, NMOS, PMOS).
2. **.SUBCKT definitions** — define subcircuits with arbitrary pin counts. These need custom symbols and pin mapping.

## Importing a .MODEL Statement

For a simple diode or transistor model:

1. **Download the model file** (usually a .lib or .txt file) from the manufacturer
2. **Place the file** in your LTspice project directory or in `Documents\LTspiceXVII\lib\sub\`
3. **Add an .include directive** on your schematic:
   ```
   .include LM358.lib
   ```
   Place this as a SPICE directive (Edit > Spice Directive)
4. **Place the component** using the standard symbol (e.g., NPN for a transistor)
5. **Set the Value field** to match the model name in the .MODEL statement

## Importing a .SUBCKT Definition

Subcircuits are more complex because they need a custom symbol:

### Step 1: Get the Model File

Download the .sub or .lib file containing the .SUBCKT definition. Open it in a text editor and note:
- The subcircuit name (first word after .SUBCKT)
- The pin order (the list of nodes after the name)

For example:
```
.SUBCKT LM358 IN+ IN- VCC VEE OUT
```
Pin order: 1=IN+, 2=IN-, 3=VCC, 4=VEE, 5=OUT

### Step 2: Create or Assign a Symbol

**Option A: Use an existing symbol**

If the subcircuit has the same pin count as an existing symbol (e.g., an op-amp with 5 pins), you can use the `opamp2` symbol:

1. Place an `opamp2` symbol from the component library
2. Ctrl+right-click the symbol
3. Change the Value field to the subcircuit name (e.g., `LM358`)
4. Add `.include LM358.sub` as a SPICE directive on the schematic

The `opamp2` symbol has pins in the order: IN+, IN-, V+, V-, OUT. If the subcircuit's pin order matches, it works directly. If not, you need to fix the pin mapping.

**Option B: Create a custom symbol**

1. Open the symbol editor: File > New Symbol
2. Draw the symbol outline using the drawing tools
3. Add pins using Edit > Add Pin
4. For each pin, set the Label to match the subcircuit's pin names
5. Set the pin order to match the .SUBCKT definition
6. Save the symbol as `LM358.asy` in your project directory or in `Documents\LTspiceXVII\lib\sym\MyParts\`

### Step 3: Link the Model and Symbol

On your schematic:

1. Place the custom symbol
2. Add a SPICE directive: `.include LM358.sub`
3. The symbol's Value field should match the subcircuit name

### Step 4: Verify Pin Mapping

The most common error is mismatched pin order. If the simulation runs but gives wrong results, check:

- Open the .sub file and note the pin order in the .SUBCKT line
- Open the .asy file and check the pin order (the order in which pins were added)
- They must match exactly

To check pin order in the symbol editor: right-click each pin and note its "Pin" number. The first pin in the .SUBCKT line is pin 1, the second is pin 2, etc.

## Common Errors

### "Unknown subcircuit called as: X..."

The .include directive isn't finding the model file. Fixes:
- Check the file path in the .include directive
- Use the full path: `.include "C:\Models\LM358.sub"`
- Ensure the subcircuit name in the .SUBCKT line matches what you typed in the Value field

### Simulation Runs But Results Are Wrong

Pin mapping is incorrect. The pin order in the symbol doesn't match the .SUBCKT definition. Open both files side by side and verify each pin.

### "Syntax error in .SUBCKT line"

The model file may use PSpice syntax that LTspice doesn't support. Common incompatibilities:
- `PARAMS:` keyword — LTspice doesn't support all PSpice parameter syntax
- `.LIB` statements inside the model file — replace with `.include`
- Behavioral sources with PSpice-specific functions

### Model File Has Multiple Subcircuits

Some .lib files contain multiple .SUBCKT definitions. The .include directive makes all of them available, but you need to reference the correct one by name in the Value field.

## Best Practices

- **Keep model files in one directory** — create a `Models` folder and reference all files from there
- **Name symbols clearly** — use the manufacturer part number as the file name
- **Test imported models** — simulate a simple circuit with known expected results before using the model in a complex design
- **Document pin mapping** — add a comment in the schematic showing the pin order for reference
- **Check for updated models** — manufacturers occasionally release corrected SPICE models
