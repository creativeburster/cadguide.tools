---
title: "STAAD.Pro Editor Commands: Text-Based Modeling, Automation, and Batch Processing"
excerpt: "A guide to STAAD.Pro's command editor for text-based structural modeling covering syntax for joints, members, loads, analysis commands, design parameters, and automation with batch files for repeated analysis workflows."
category: "workflow"
softwareSlug: "staad-pro"
keyword: "staad pro editor commands"
slug: "staad-pro-editor-commands-text-modeling-automation-batch-processing"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://docs.bentley.com/LiveContent/web/STAAD.Pro%20Help-v28/en/GUID-COMMAND-LANGUAGE.html"
  - "https://www.bentley.com/software/staad/"
---

# STAAD.Pro Editor Commands: Text-Based Modeling, Automation, and Batch Processing

While STAAD.Pro has a graphical user interface, its command editor provides direct access to the STAAD analysis engine through a text-based command language. Many experienced engineers prefer the editor for speed, reproducibility, and automation. This guide covers the command syntax for modeling, loading, analysis, and design.

## Accessing the Editor

1. Open STAAD.Pro
2. Mode > Editor (or press Ctrl+E)
3. The editor shows the command file (.std file content)
4. Commands are case-insensitive
5. Each command starts on a new line
6. Comments start with `*` (asterisk)

## Basic File Structure

```
STAAD SPACE
* Project: Office Building
* Units: METRIC
UNIT METER KN
JOINT COORDINATES
...
MEMBER INCIDENCES
...
MEMBER PROPERTY
...
SUPPORT
...
LOAD 1
...
LOAD COMB 101
...
PERFORM ANALYSIS
FINISH
```

## Joint Coordinates

### Syntax

```
JOINT COORDINATES
1 0 0 0
2 5 0 0
3 10 0 0
4 0 0 5
5 5 0 5
```

Or using ranges:
```
JOINT COORDINATES
1 0 0 0 ; 12 0 0 11 REPEAT 12 5 0 0
```

This creates 12 joints at 5m spacing in X direction.

### Y and Z Coordinates

```
JOINT COORDINATES
1 0 0 0      * Base, column 1
2 0 3.5 0    * Level 1, column 1
3 0 7.0 0    * Level 2, column 1
4 5 0 0      * Base, column 2
5 5 3.5 0    * Level 1, column 2
6 5 7.0 0    * Level 2, column 2
```

## Member Incidences

### Syntax

```
MEMBER INCIDENCES
1 1 2    * Member 1: Node 1 to Node 2
2 2 3    * Member 2: Node 2 to Node 3
3 4 5    * Member 3: Node 4 to Node 5
4 5 6    * Member 4: Node 5 to Node 6
5 1 4    * Member 5: Node 1 to Node 4 (beam at base)
6 2 5    * Member 6: Node 2 to Node 5 (beam at Level 1)
7 3 6    * Member 7: Node 3 to Node 6 (beam at Level 2)
```

### Using INC (Increment)

```
MEMBER INCIDENCES
1 1 2 ; 10 1 4 INC 1 3
```

This creates members 1-10 connecting nodes in a pattern.

## Member Properties

### Steel Sections

```
MEMBER PROPERTY
1 TO 4 PRIS YD 0.3 ZD 0.3        * Concrete columns 300x300
5 TO 7 PRIS YD 0.3 ZD 0.6        * Concrete beams 300x600
```

Or from section database:
```
MEMBER PROPERTY
1 TO 4 ST W12X50                  * W-shape from AISC database
5 TO 7 ST W16X26
```

### Concrete Sections

```
MEMBER PROPERTY
1 TO 4 PRIS YD 0.4 ZD 0.4        * 400x400 columns
5 TO 7 PRIS YD 0.3 ZD 0.6        * 300x600 beams
```

## Material Properties

```
CONSTANT
E CONCRETE 25000000              * E = 25 GPa for concrete
DENSITY CONCRETE 25              * Density = 25 kN/m³
POISSON CONCRETE 0.17
ALPHA CONCRETE 0.00001
E STEEL 200000000                * E = 200 GPa for steel
DENSITY STEEL 78.5
POISSON STEEL 0.3
```

Or assign per member:
```
CONSTANT
E 25000000 MEMB 1 TO 7
DENSITY 25 MEMB 1 TO 7
```

## Supports

```
SUPPORT
1 PINNED                          * Pinned support at node 1
2 FIXED                           * Fixed support at node 2
3 PINNED BUT MX MZ                * Pinned with moment release about Y
4 FIXED BUT FY                    * Fixed with Y-translation released
```

### Spring Supports

```
SUPPORT
1 2 3 4 SPRING Y 5000            * Spring support, k = 5000 kN/m in Y
```

## Loading

### Self-Weight

```
LOAD 1 DEAD LOAD
SELFWEIGHT Y -1.0
```

### Member Loads

```
LOAD 1 DEAD LOAD
SELFWEIGHT Y -1.0
MEMBER LOAD
5 TO 7 UNI GY -10                * 10 kN/m uniform load in -Y on members 5-7
```

### Nodal Loads

```
LOAD 2 LIVE LOAD
JOINT LOAD
2 5 FY -50                       * 50 kN downward at nodes 2 and 5
8 FY -100                        * 100 kN downward at node 8
```

### Wind Load

```
LOAD 3 WIND X
WIND LOAD X 1.0 TYPE 1
* Wind pressure calculated per ASCE 7
```

### Seismic Load (Equivalent Lateral Force)

```
LOAD 5 SEISMIC X
SEISMIC LOAD IS1893 2016 Z 0.36 I 1 R 5 TF 1 DM 5
* Z = zone factor, I = importance, R = response reduction
* TF = type (1 = frame), DM = damping %
```

## Load Combinations

```
LOAD COMB 101
1 1.4                             * 1.4 × Dead Load

LOAD COMB 102
1 1.2 2 1.6                       * 1.2D + 1.6L

LOAD COMB 103
1 1.2 3 1.0 2 0.5                * 1.2D + 1.0W + 0.5L

LOAD COMB 104
1 0.9 3 1.0                       * 0.9D + 1.0W
```

## Analysis Commands

### Linear Static

```
PERFORM ANALYSIS
```

### P-Delta Analysis

```
PERFORM ANALYSIS PRINT STATICS CHECK
PDELTA ANALYSIS
```

### Dynamic Analysis

```
MODAL CALCULATION REQUESTED 10
* Calculate 10 modes
PERFORM ANALYSIS
```

### Response Spectrum

```
LOAD 6 RESPONSE SPECTRUM X
SPECTRUM SRSS X 0.05 DAMP 0.05 SCALE 9.81
* SRSS combination, 5% damping, scale to m/s²

MODAL CALCULATION REQUESTED 15
PERFORM ANALYSIS
```

## Design Commands

### Steel Design (AISC)

```
CODE AISC
* Set design parameters
PARAMETER
FYLD 345 ALL
UNT 3.0 MEMB 1 TO 4              * Unbraced length top = 3.0m
UNB 3.0 MEMB 1 TO 4              * Unbraced length bottom = 3.0m
CB 1.0 ALL                        * Lateral-torsional buckling factor

CHECK CODE MEMB 1 TO 20
* Or design and optimize:
SELECT STEEL MEMB 1 TO 20
```

### Concrete Design (ACI)

```
CODE ACI
PARAMETER
FC 30000 ALL                      * f'c = 30 MPa
FYMAIN 420000 ALL                 * fy = 420 MPa
FYSEC 420000 ALL                  * fyh = 420 MPa
CLEAR 0.04 ALL                    * Clear cover = 40mm
DESIGN BEAM 5 TO 7
DESIGN COLUMN 1 TO 4
```

## Output Commands

```
PRINT ANALYSIS
PRINT MEMBER FORCES
PRINT SUPPORT REACTION
PRINT JOINT DISPLACEMENT
PRINT STEEL DESIGN RESULT
PRINT CONCRETE DESIGN RESULT
```

## Complete Example

```
STAAD SPACE
UNIT METER KN
* Simple 2-story frame
JOINT COORDINATES
1 0 0 0 ; 2 0 3.5 0 ; 3 0 7.0 0
4 5 0 0 ; 5 5 3.5 0 ; 6 5 7.0 0
MEMBER INCIDENCES
1 1 2 ; 2 2 3 ; 3 4 5 ; 4 5 6
5 1 4 ; 6 2 5 ; 7 3 6
MEMBER PROPERTY
1 TO 4 PRIS YD 0.4 ZD 0.4
5 TO 7 PRIS YD 0.3 ZD 0.6
CONSTANT
E 25000000 ALL
DENSITY 25 ALL
POISSON 0.17 ALL
SUPPORT
1 PINNED
4 PINNED
LOAD 1 DEAD LOAD
SELFWEIGHT Y -1.0
MEMBER LOAD
5 TO 7 UNI GY -10
LOAD 2 LIVE LOAD
MEMBER LOAD
5 TO 7 UNI GY -15
LOAD COMB 101
1 1.2 2 1.6
LOAD COMB 102
1 1.4
PERFORM ANALYSIS
CODE ACI
PARAMETER
FC 30000 ALL
FYMAIN 420000 ALL
CLEAR 0.04 ALL
DESIGN BEAM 5 TO 7
DESIGN COLUMN 1 TO 4
PRINT ANALYSIS
PRINT CONCRETE DESIGN RESULT
FINISH
```

## Batch Processing

### Running from Command Line

```batch
staad.exe input.std output.out
```

This runs STAAD headlessly:
- Input: `input.std` (command file)
- Output: `output.out` (results file)

### Batch Script for Multiple Models

Create a `.bat` file:
```batch
@echo off
for %%f in (*.std) do (
    echo Running %%f...
    staad.exe "%%f" "%%f.out"
)
echo All models complete.
```

### Scheduled Analysis

1. Create the batch script
2. Windows Task Scheduler > Create Task
3. Set trigger: Daily at 2:00 AM
4. Set action: Run the batch script
5. Models are analyzed overnight

## Automation with Parametric Scripts

### Generating Models with Python

```python
# Generate STAAD command file for parametric frame
import sys

num_floors = int(sys.argv[1])
floor_height = 3.5
bay_width = 5.0
num_bays = 3

with open("parametric.std", "w") as f:
    f.write("STAAD SPACE\n")
    f.write("UNIT METER KN\n")
    f.write("JOINT COORDINATES\n")
    
    node = 1
    for floor in range(num_floors + 1):
        y = floor * floor_height
        for bay in range(num_bays + 1):
            x = bay * bay_width
            f.write(f"{node} {x} {y} 0\n")
            node += 1
    
    f.write("MEMBER INCIDENCES\n")
    # ... generate member connectivity
    f.write("FINISH\n")
```

Run: `python generate.py 5 > model.std`

## Best Practices

1. **Comment liberally** — use `*` to document each section
2. **Use consistent numbering** — joints 1-N, members 1-M
3. **Group members by type** — columns, beams, braces for easy property assignment
4. **Verify geometry** — switch to graphical view to check the model
5. **Save before running** — always save the .std file before analysis
6. **Check output file** — review the .out file for warnings and errors
7. **Use batch processing** — for parametric studies and optimization loops
8. **Version control** — .std files are text and work well with Git

## Conclusion

The STAAD.Pro command editor provides a powerful text-based interface for structural modeling that is faster, more reproducible, and more automatable than the GUI. By mastering the command syntax for joints, members, properties, loads, analysis, and design, engineers can create models efficiently and automate repetitive tasks through batch processing and parametric scripts. The text-based .std files are ideal for version control, template reuse, and integration with external tools like Python for parametric design studies.
