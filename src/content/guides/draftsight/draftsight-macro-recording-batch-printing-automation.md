---
title: "DraftSight Macro Recording and Batch Printing: Automating Repetitive Tasks"
excerpt: "A workflow guide for automating repetitive tasks in DraftSight using macro scripts, batch printing configurations, and command script files (.scr) for multi-sheet output."
category: "workflow"
softwareSlug: "draftsight"
keyword: "draftsight batch printing automation"
slug: "draftsight-macro-recording-batch-printing-automation"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://help.3ds.com/draftsight/user-guide"
  - "https://www.3ds.com/products-services/draftsight/resources/"
---

# DraftSight Macro Recording and Batch Printing: Automating Repetitive Tasks

Repetitive tasks consume hours of productive time in any CAD environment. DraftSight provides several automation pathways — from simple script files to LISP routines to batch printing configurations. This guide covers the most practical automation methods that require minimal programming knowledge but deliver immediate time savings.

## Script Files (.scr) for Command Automation

Script files are the simplest form of automation in DraftSight. A script file is a text file containing command-line inputs, one per line, executed sequentially. No programming logic is required.

### Creating a Script File

Create a plain text file with `.scr` extension. Each line represents one command input or prompt response:

```
;; cleanup.scr - Drawing cleanup script
_.AUDIT
Y
_.-PURGE
_A
*
_N
_.-PURGE
_ST
*
_N
_.-PURGE
_LA
*
_N
_.ZOOM
_E
_.QSAVE
```

### Running a Script File

1. Type `SCRIPT` at the command line
2. Select the `.scr` file
3. DraftSight executes each line sequentially

### Script File Rules

- Each line is one input (command name, option, coordinate, or Enter)
- Blank lines represent pressing Enter
- Lines starting with `;;` are comments (ignored during execution)
- Use `_.` prefix for commands to ensure English language execution regardless of locale
- Coordinates use the current drawing units
- Spaces within a line are interpreted as Enter presses in some contexts

### Practical Script Examples

#### Batch Layer Setup Script

```
;; layers-setup.scr - Create standard architectural layers
_.-LAYER
N A-WALL-EXT,A-WALL-INT,A-DOOR,A-WIND,A-FLOR
C 1 A-WALL-EXT
C 4 A-WALL-INT
C 3 A-DOOR,A-WIND
C 8 A-FLOR
N A-ANNO-DIMS,A-ANNO-NOTE,A-ANNO-TTLB
C 7 A-ANNO-DIMS
C 2 A-ANNO-NOTE
C 7 A-ANNO-TTLB

```

#### Title Block Attribute Update Script

```
;; title-update.scr - Update title block attributes
_.-ATTEDIT
N
A-ANNO-TTLB
TITLE
*
Project North Wing Renovation
Y
DWG-NO
*
A-201
Y
DATE
*
2026-06-30
Y
SCALE
*
1:50

```

## Batch Printing Configuration

DraftSight's batch printing tool lets you plot multiple drawings or layouts in a single operation.

### Using the PUBLISH Command

1. Type `PUBLISH` to open the Publish dialog
2. Click "Add Sheet" to add drawings:
   - Select DWG files from disk
   - Or select layouts from the current drawing
3. For each sheet, configure:
   - **Page setup**: Select a pre-defined page setup or create one inline
   - **Printer/Plotter**: Choose the output device
   - **Paper size**: Match the title block size
   - **Plot scale**: 1:1 for layouts with pre-scaled viewports
   - **Plot area**: Layout (for paper space) or Extents (for model space)
4. Set print order using the up/down arrows
5. Click "Publish" to start batch printing

### Saving Publish Sets

Save the sheet list as a `.dsd` (Sheet Set Description) file for reuse:

1. In the Publish dialog, click "Save Sheet List"
2. Name the file (e.g., `Project-North-Wing-Plot-Set.dsd`)
3. Next time, click "Load Sheet List" to reload the same configuration

### Batch Print to PDF

For digital distribution, set the printer to a PDF driver:

1. In the Publish dialog, set "Publish To" to "PDF"
2. Set output folder
3. Choose single-sheet or multi-sheet PDF
4. Click "Publish" — DraftSight generates PDF(s) for all sheets

## Command Script for Batch File Processing

To run a script across multiple DWG files, use a wrapper script that opens, processes, and saves each file:

### Method 1: Using BatchRun Script

Create a master script that DraftSight processes:

```
;; batch-cleanup.scr - Process multiple files
_.OPEN
C:\Drawings\A-101.dwg
_.AUDIT
Y
_.-PURGE
_A
*
_N
_.QSAVE
_.CLOSE
_.OPEN
C:\Drawings\A-102.dwg
_.AUDIT
Y
_.-PURGE
_A
*
_N
_.QSAVE
_.CLOSE
_.OPEN
C:\Drawings\A-103.dwg
_.AUDIT
Y
_.-PURGE
_A
*
_N
_.QSAVE
_.CLOSE
```

Run with `SCRIPT` command and select the master script file.

### Method 2: Using LISP for Dynamic File Lists

For more flexibility, use a LISP routine that reads files from a directory:

```lisp
(defun c:BatchClean ( / dir files file)
  (setq dir (getstring "\nDirectory path: "))
  (setq files (vl-directory-files dir "*.dwg" 1))
  (foreach file files
    (command "_.OPEN" (strcat dir "\\" file))
    (command "_.AUDIT" "_Y")
    (command "_.-PURGE" "_A" "*" "_N")
    (command "_.QSAVE")
    (command "_.CLOSE")
    (princ (strcat "\nProcessed: " file))
  )
  (princ "\nBatch processing complete.")
  (princ)
)
```

## Automating Dimension Style Application

For drawings that come from external sources with incorrect dimension styles:

```lisp
(defun c:FixDims ( / ss i ent)
  (setq ss (ssget "X" '((0 . "DIMENSION"))))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq ent (subst (cons 3 "ARCH-25") (assoc 3 ent) ent))
        (entmod ent)
        (setq i (1+ i))
      )
      (command "_.DIMREGEN")
      (princ (strcat "\nUpdated " (itoa (sslength ss)) " dimensions."))
    )
    (princ "\nNo dimensions found.")
  )
  (princ)
)
```

## Scheduled Batch Printing

For overnight or off-peak batch printing:

1. Create a `.bat` file that launches DraftSight with a script:

```batch
@echo off
"C:\Program Files\Dassault Systemes\DraftSight\bin\DraftSight.exe" /b "C:\Scripts\overnight-plot.scr"
```

2. Use Windows Task Scheduler to run the `.bat` file at the desired time
3. Ensure the script includes all necessary print commands and file paths

## Best Practices for Automation Scripts

1. **Always test on copies** — never run batch scripts on production files without testing
2. **Include error handling** — add `_.AUDIT Y` at the start of each file processing loop
3. **Log results** — use `(princ)` statements to output progress to the command line; redirect output to a log file with `> log.txt` in the batch wrapper
4. **Set FILEDIA to 0** — prevents file dialog boxes from interrupting script execution
5. **Set CMDDIA to 0** — prevents command dialog boxes from interrupting
6. **Use absolute paths** — scripts may not respect the current working directory
7. **Include QSAVE before CLOSE** — ensures changes are saved before the file closes

## Batch Print Configuration Best Practices

Based on community discussions and real usage, here are the best practices for DraftSight batch printing. First, always create and save a print configuration for each common output format — one for PDF, one for physical printers, and one for DWF if needed. This ensures consistent output settings across batch print jobs. Second, use the .bpl batch print list file to save your print job configuration — this allows you to reprint the same set of drawings with one click. Third, when publishing multi-sheet PDFs, select "PDF" as the printer name directly in the Print dialog — not "Microsoft Print to PDF" or "Adobe PDF," which may gray out the multi-sheet option. This specific issue was reported on the DraftSight user community and the solution was to scroll down the printer list to find the native "PDF" option. Fourth, for large batch jobs, use the Pause button periodically to check output quality on the first few sheets before continuing. Fifth, always specify an output folder path before starting the batch — if the path is not set, DraftSight may prompt for each file, defeating the purpose of batch processing.

## Conclusion

DraftSight's automation capabilities — script files, batch printing, and LISP routines — provide practical time savings for any team doing repetitive CAD work. Script files require no programming and can handle cleanup, layer setup, and attribute updates. The PUBLISH command handles multi-sheet printing with reusable configurations. For more advanced automation, LISP routines provide file looping and conditional logic. By combining these tools, you can eliminate hours of manual work from your weekly CAD workflow.
