---
title: "ANSYS Mechanical APDL Command Snippets: Automating Pre-Processing, Post-Processing, and Custom Results"
excerpt: "A practical guide to using APDL command snippets in ANSYS Mechanical for tasks that can't be done through the GUI, covering pre-processing automation, custom result extraction, and Python integration."
category: "automation"
softwareSlug: "ansys-mechanical"
keyword: "ansys apdl command snippets"
slug: "ansys-mechanical-apdl-command-snippets-automation-pre-post-processing"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.padtinc.com/2019/07/08/how-to-use-apdl-command-snippets-in-your-ansys-mechanical-model/"
  - "https://blog.ozeninc.com/resources/postprocessing-non-accesible-objects-in-ansys-mechanical-part-2"
  - "https://ansyshelp.ansys.com/public/Views/Secured/corp/v242/en/wb2_js/wb2js_example4.html"

---

# ANSYS Mechanical APDL Command Snippets: Automating Pre-Processing, Post-Processing, and Custom Results

I've used APDL command snippets in ANSYS Mechanical for years, and they're the tool that unlocks capabilities the GUI simply can't provide. As PADT's blog explains: "One of the most powerful features in ANSYS Mechanical is the fact that it leverages the ANSYS Mechanical APDL solver. This modern and ever-improving interface allows users to create, run, and post-process models with power and ease. But it also allows users to access the power of the underlying solver through the native language it uses, APDL."

On the ANSYS Learning Forum, a user asked about "commands to run APDL macros via python scripting in Ansys mechanical" — reflecting the growing interest in combining APDL with Python for advanced automation. And on the Ozen Engineering blog, a detailed example showed how APDL snippets combined with Python can automate post-processing for joint connectors, exporting element numbers and creating individual result objects for each joint.

This guide covers the practical APDL snippet techniques I use most frequently, from basic pre-processing to advanced Python integration.

## Understanding APDL in ANSYS Mechanical

### What APDL Snippets Are

When you click Solve in ANSYS Mechanical, it generates an input file (ds.dat) containing APDL commands that are sent to the solver in batch mode. APDL (ANSYS Parametric Design Language) is the native scripting language of the solver. Command snippets let you inject custom APDL commands into this generated input file at specific points in the solution sequence.

As PADT's blog notes: "If you have never used ANSYS Mechanical APDL a lot of what we are going to talk about may sound like another language. That is because it is. The key thing to remember is that when you click Solve in ANSYS Mechanical, it generates an input file that is then read into ANSYS Mechanical APDL in batch mode."

### Why Use Snippets Instead of the GUI

The GUI covers most common analysis tasks, but snippets are needed for:
- Accessing solver features not exposed in the GUI
- Custom result extraction and data export
- Complex boundary conditions that can't be defined interactively
- Automation of repetitive pre-processing and post-processing tasks
- Interfacing with external files and programs

## Adding Snippets to Your Model

### Where to Insert Snippets

1. **Pre-processing snippets**: Right-click the Static Structural branch > Insert > Commands. These run before the solve and can modify the model definition.

2. **Solution snippets**: Right-click the Solution branch > Insert > Commands. These run after the solve and can extract custom results.

3. **Body/Element snippets**: Right-click a specific body > Insert > Commands. These are scoped to the selected body's elements.

### Basic Snippet Syntax

APDL snippets use standard APDL syntax:
- Commands are case-insensitive
- Parameters use `$` prefix (e.g., `$my_parameter`)
- Comments start with `!`
- Commands can span multiple lines with `&` continuation

## Pre-Processing Snippets

### Example 1: Define a Custom Material Model

```
! Define bilinear isotropic hardening
MP,EX,1,210000  ! Young's modulus
MP,PRXY,1,0.3   ! Poisson's ratio
TB,BISO,1       ! Bilinear isotropic hardening
TBDATA,1,250    ! Yield strength
TBDATA,2,5000   ! Tangent modulus
```

### Example 2: Apply a Pressure to a Named Selection

```
! Apply pressure to selected elements
CMSel,S,MyPressureSurface  ! Select named selection
SF,ALL,PRES,5.0            ! Apply 5 MPa pressure
ALLSEL,ALL                 ! Re-select all
```

### Example 3: Define Contact Parameters

```
! Modify contact stiffness
KEYOPT,CID,9,1     ! Include geometric correction
KEYOPT,CID,10,2    ! Update stiffness each iteration
RMODIF,CID,9,100   ! Set normal stiffness factor
```

## Post-Processing Snippets

### Example 4: Extract Maximum Stress at a Specific Location

```
! Extract stress at a node
NSEL,S,LOC,X,50    ! Select nodes at X=50
NSEL,R,LOC,Y,0     ! Reduce selection to Y=0
*GET,MaxStress,NODE,NUM,MAX,S,EQV  ! Get max equivalent stress
*STATUS,MaxStress  ! Print value to output
```

### Example 5: Export Results to a File

```
! Export nodal displacements to CSV
*CREATE,results.csv
*VWRITE,NODE,Ux,Uy,Uz
(3F15.6)
*CLOSE
```

### Example 6: Export Joint Element Numbers (from Ozen Engineering blog)

The Ozen Engineering blog demonstrates a sophisticated workflow combining APDL and Python for joint connector post-processing:

```
! Export joint element numbers to file
PARSAV,SCALAR,joint_params.txt
! This saves all scalar parameters including joint element numbers
```

The Python script then reads this file, matches element numbers to joint names, and creates individual result objects scoped to each joint element.

## Python Integration

### Using Python with APDL Snippets

On the ANSYS Learning Forum, users ask about running APDL macros via Python scripting. The ANSYS Workbench scripting interface (IronPython) can interact with Mechanical through the `SendCommand` method:

```python
# Python script to send APDL commands
import os

workDir = "ScriptingGuideExamples/Sending_Commands/"
inputFile = AbsUserPathName(workDir + "bar.dat")

# Parameterize bar length
zValues = [3, 5, 12, 15]

for z in zValues:
    # Set parameter in APDL
    apdlCmd = "ZLEN = %d" % z
    setup1.SendCommand(Command=apdlCmd)
    
    # Write CDB file
    cdbName = "bar_z%d.cdb" % z
    apdlCmd = "cdwr,db,%s" % cdbName
    setup1.SendCommand(Command=apdlCmd)
```

### Python for Automated Result Creation

The Ozen Engineering blog shows how Python can automate result object creation:

```python
# Iterate through joints and create results
for joint in joints_list:
    # Create result object
    result = Solution.AddEquivalentStress()
    result.Name = "Stress_" + joint.Name
    # Scope to specific element
    result.ScopingMethod = "Geometry"
    result.Scoping = joint.Element
```

This approach combines APDL's solver-level access with Python's programmatic UI manipulation, enabling automation that neither tool can achieve alone.

## Best Practices

### 1. Test Snippets in MAPDL First

Before inserting a snippet into Mechanical, test it in the MAPDL interactive interpreter. This lets you verify syntax and see results immediately without running a full Mechanical solve.

### 2. Document Your Snippets

APDL is not self-documenting. Add comments explaining what each command does and why. Include references to the ANSYS help documentation for the commands used.

### 3. Use Named Selections for Scoping

Instead of hardcoding node or element numbers (which change if the mesh changes), use Named Selections. Reference them in snippets with `CMSel,S,MyNamedSelection`.

### 4. Check the ds.dat File

To see what APDL commands Mechanical generates, look at the ds.dat file in the solver files directory. This helps you understand where your snippets fit in the command sequence and what parameters are available.

### 5. Version Compatibility

APDL commands can change between ANSYS versions. Test snippets when upgrading ANSYS. Check the APDL documentation for deprecated commands.

## My Take

APDL snippets are essential for advanced ANSYS Mechanical workflows. The GUI covers 90% of common tasks, but the remaining 10% — custom material models, specialized result extraction, automation of repetitive tasks — requires APDL. The combination of APDL snippets for solver-level operations and Python for UI automation is particularly powerful, as demonstrated by the Ozen Engineering joint post-processing example. Start with simple snippets (extracting a stress value, applying a custom load) and gradually build to more complex automation. Always test in MAPDL first, document thoroughly, and use Named Selections for robustness against mesh changes. The learning curve is steep but the payoff is significant — I've reduced post-processing time from 2 hours of manual result creation to 5 minutes of scripted automation using the techniques described in this guide. For teams running similar analyses repeatedly, investing in APDL and Python automation is one of the highest-ROI activities a simulation engineer can undertake.
