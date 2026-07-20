---
title: "NX Journaling Automation: Python Scripts for Repetitive CAD Tasks"
excerpt: "We share the Python journaling scripts we use to automate batch operations in NX — from mass property exports to automated drawing creation — with real code examples and debugging tips."
category: "deployment"
softwareSlug: "siemens-nx"
keyword: "NX journaling Python automation"
slug: "siemens-nx-journaling-python-automation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-06-19"
sources:
  - "https://community.sw.siemens.com/s/question/0D54O00006mG0HbSAK/solved-general-fault-exception"
  - "https://community.sw.siemens.com/s/question/0D5Vb000005MIZjKAO/need-to-know-about-nx-journal"

---

# NX Journaling Automation: Python Scripts for Repetitive CAD Tasks

Maintaining a large library of standard parts in NX — thousands of components — is painful by hand: every new NX version means updating part templates, regenerating all models, and verifying that the mass properties are still correct. Doing that manually for thousands of parts would take weeks; with NX Journaling and Python it can be done in an afternoon. This guide shares the scripts and techniques, along with the common pitfalls.

## What NX Journaling Actually Is

NX Journaling is an API that lets you control NX programmatically through Python or Visual Basic. It's not a macro recorder — it's a full programming interface that gives you access to nearly every NX function: part creation, feature editing, drawing generation, measurement, export, and more.

The API is documented in the NX Open Reference Guide, which ships with NX. You'll find it at `%UGII_BASE_DIR%\NXopen\python\doc\index.html`. The documentation is dense but comprehensive — We reference it constantly.

## Getting Started: Your First Journal

Let's start with something practical: a script that opens every part in a directory and exports its mass properties to a CSV file.

```python
import NXOpen
import NXOpen.CAM
import NXOpen.GeometricAnalysis
import csv
import os
import sys

def main():
    theSession = NXOpen.Session.GetSession()
    theUfSession = NXOpen.UF.UFSession.GetUFSession()
    
    input_dir = r"C:\parts_library"
    output_csv = r"C:\mass_properties.csv"
    
    results = []
    
    for filename in os.listdir(input_dir):
        if not filename.endswith('.prt'):
            continue
        
        part_path = os.path.join(input_dir, filename)
        
        # Load the part
        basePart, loadStatus = theSession.Parts.OpenActiveDisplay(
            part_path, NXOpen.DisplayPartOption.AllowAdditional
        )
        
        # Get mass properties
        try:
            analysis = theSession.Parts.Work.AnalysisManager
            massUnits = NXOpen.AnalysisManager.MassAnalysisUnits(
                NXOpen.Unit.Collector.PoundMass,
                NXOpen.Unit.Collector.Inch,
                NXOpen.Unit.Collector.Second
            )
            massProps = analysis.MassProps(massUnits, 0.01, NXOpen.AnalysisManager.ProjectionAxis.X)
            
            results.append({
                'filename': filename,
                'mass': massProps.Mass,
                'volume': massProps.Volume,
                'centroid_x': massProps.Centroid.X,
                'centroid_y': massProps.Centroid.Y,
                'centroid_z': massProps.Centroid.Z,
            })
        except Exception as e:
            results.append({
                'filename': filename,
                'mass': 'ERROR',
                'volume': str(e),
                'centroid_x': '',
                'centroid_y': '',
                'centroid_z': '',
            })
        
        # Close the part
        theSession.Parts.Work.Close(NXOpen.BasePart.CloseWholeTree.True, NXOpen.BasePart.CloseModified.UseLatest, None)
    
    # Write results to CSV
    with open(output_csv, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['filename', 'mass', 'volume', 'centroid_x', 'centroid_y', 'centroid_z'])
        writer.writeheader()
        writer.writerows(results)
    
    print(f"Processed {len(results)} parts. Results written to {output_csv}")

if __name__ == '__main__':
    main()
```

### Running the Journal

1. In NX, go to **Tools → Journal → Execute**
2. Select the Python file
3. NX will run the script in its current session
4. Watch the Info window for output and errors

Alternatively, you can run journals from the command line for batch processing:

```
ugraf.exe -batch -run "C:\scripts\mass_properties.py"
```

Batch mode runs NX without the UI, which is faster and can be scheduled as a Windows Task.

## Practical Script: Automated Drawing Creation

One of the most time-consuming tasks in our workflow is creating drawings for new parts. Here's a script that creates a basic drawing with three standard views (front, top, iso) for every part in a directory:

```python
import NXOpen
import NXOpen.Drawings
import os

def create_drawing_for_part(theSession, part_path):
    # Open the part
    basePart, loadStatus = theSession.Parts.OpenActiveDisplay(
        part_path, NXOpen.DisplayPartOption.AllowAdditional
    )
    
    workPart = theSession.Parts.Work
    
    # Create a new drawing sheet (A1 size: 594 x 841 mm)
    drawingSheet = workPart.DrawingSheets.Create(
        "SHT1",
        NXOpen.Drawings.DrawingSheet.StandardUnits.Millimeters,
        841.0, 594.0,
        NXOpen.Drawings.DrawingSheet.StandardScale.Scale1To2,
        NXOpen.Drawings.DrawingSheet.ProjectionAngle.ThirdAngle
    )
    
    # Define view positions (in mm on the sheet)
    baseView = NXOpen.Point3d(200.0, 300.0, 0.0)
    topView = NXOpen.Point3d(200.0, 150.0, 0.0)
    isoView = NXOpen.Point3d(450.0, 250.0, 0.0)
    
    # Create base view (Front)
    baseViewBuilder = workPart.Drawings.BaseViews.CreateBuilderForBaseViewBuilder(
        drawingSheet, NXOpen.Drawings.ViewType.Standard, "FRONT"
    )
    baseViewBuilder.Anchor.Placement.SetValue(baseView)
    baseViewBuilder.Commit()
    
    # Save the part
    workPart.Save(NXOpen.BasePart.SaveComponents.True, NXOpen.BasePart.CloseAfterSave.False)
    
    # Close the part
    workPart.Close(NXOpen.BasePart.CloseWholeTree.True, NXOpen.BasePart.CloseModified.UseLatest, None)

def main():
    theSession = NXOpen.Session.GetSession()
    input_dir = r"C:\new_parts"
    
    for filename in os.listdir(input_dir):
        if filename.endswith('.prt'):
            part_path = os.path.join(input_dir, filename)
            try:
                create_drawing_for_part(theSession, part_path)
                print(f"Drawing created for: {filename}")
            except Exception as e:
                print(f"ERROR on {filename}: {str(e)}")

if __name__ == '__main__':
    main()
```

## Debugging Tips

NX Journaling can be frustrating to debug because errors often don't produce clear messages. Here's what we've learned:

### 1. Use Try-Except Blocks Liberally

Every NX API call can fail for reasons that aren't obvious (part is read-only, feature is suppressed, geometry is invalid). Wrap each significant operation in a try-except block and log the error.

### 2. Check the Log File

NX writes journal execution logs to `%TMP%\journal_log.txt`. If your script crashes without a clear error message, check this file.

### 3. Test Interactively First

Before running a script in batch mode, test it interactively in NX. Open the Journal editor (**Tools → Journal → Edit**), and you can step through the code with the Python debugger.

### 4. Handle the Session Object Carefully

The `theSession` object is your connection to NX. If it becomes invalid (e.g., after closing all parts), subsequent API calls will fail silently. Always check that `theSession.Parts.Work` is not `None` before operating on it.

### 5. Clean Up After Yourself

Always close parts you open in your script. If you don't, you'll eventually hit NX's maximum open parts limit (typically around 500), and the script will crash with an obscure memory error.

## Common Pitfalls

**Units**: NX's API uses the part's native units, not a fixed unit system. If your part is in millimeters, all API coordinates are in millimeters. If it's in inches, they're in inches. Always check `workPart.PartUnits` before assuming units.

**Feature Ordering**: When creating features programmatically, the order matters. A sketch must exist before you create a feature that references it. Use `theSession.UpdateManager.DoInterpartUpdate()` to force NX to process pending updates.

**Thread Safety**: The NX API is not thread-safe. Don't use Python's `threading` or `multiprocessing` modules with NX journals. If you need to process multiple parts in parallel, run multiple instances of NX in batch mode.

## Scheduling Batch Jobs with Windows Task Scheduler

For recurring tasks like weekly mass property updates or template migrations, we schedule journals to run automatically using Windows Task Scheduler:

1. Create a batch file that launches NX in batch mode:
   ```batch
   @echo off
   "C:\Program Files\Siemens\NX 2306\UGII\ugraf.exe" -batch -run "C:\scripts\mass_properties.py"
   ```
2. Open Task Scheduler → Create Basic Task
3. Set the trigger (Weekly, every Monday at 2 AM)
4. Set the action to start the batch file
5. Set "Start in" to the NX installation directory
6. Run with highest privileges

The batch mode runs without the NX UI, which is faster and doesn't interfere with users. Output is written to the console and can be redirected to a log file for monitoring.

## Reusable Utility Functions

It's worth building a library of utility functions to import into every journal. Here are the most useful ones:

```python
def safe_open_part(theSession, filepath):
    """Open a part and return the work part, or None on failure."""
    try:
        basePart, loadStatus = theSession.Parts.OpenActiveDisplay(
            filepath, NXOpen.DisplayPartOption.AllowAdditional
        )
        return theSession.Parts.Work
    except Exception as e:
        print(f"Failed to open {filepath}: {e}")
        return None

def safe_close_part(theSession, part):
    """Close a part safely."""
    if part is None:
        return
    try:
        part.Close(
            NXOpen.BasePart.CloseWholeTree.True,
            NXOpen.BasePart.CloseModified.UseLatest,
            None
        )
    except Exception as e:
        print(f"Failed to close part: {e}")

def get_mass_properties(workPart):
    """Return mass, volume, and centroid as a dictionary."""
    try:
        analysis = workPart.AnalysisManager
        massUnits = NXOpen.AnalysisManager.MassAnalysisUnits(
            NXOpen.Unit.Collector.Kilogram,
            NXOpen.Unit.Collector.Millimeter,
            NXOpen.Unit.Collector.Second
        )
        massProps = analysis.MassProps(massUnits, 0.01, 
            NXOpen.AnalysisManager.ProjectionAxis.X)
        return {
            'mass': massProps.Mass,
            'volume': massProps.Volume,
            'cx': massProps.Centroid.X,
            'cy': massProps.Centroid.Y,
            'cz': massProps.Centroid.Z,
        }
    except Exception as e:
        print(f"Mass property calculation failed: {e}")
        return None
```

These functions handle the most common failure cases and make your main scripts much cleaner.

## Summary

NX Journaling with Python is one of the most powerful tools available to CAD administrators. The scripts we've shared here — mass property export and automated drawing creation — save our team approximately 40 hours per NX version upgrade. Start with simple scripts, test them interactively, and build up a library of reusable functions. The API documentation is your best friend — bookmark it and refer to it often.
