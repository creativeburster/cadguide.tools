---
title: "BricsCAD LISP Automation: Custom Commands and Batch Processing Scripts"
excerpt: "A developer-focused guide to writing and deploying LISP automation routines in BricsCAD, covering command definition, entity selection methods, and batch processing across multiple DWG files."
category: "workflow"
softwareSlug: "bricscad"
keyword: "bricscad lisp automation"
slug: "bricscad-lisp-automation-custom-commands-batch-processing"
author: "CADGuide Technical Editorial"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://www.bricsys.com/bricscad/api"
  - "https://developer.bricsys.com/bricscad/help/en_US/V25/DevRef/source/BricsCADLISPFunctions.htm"

---

# BricsCAD LISP Automation: Custom Commands and Batch Processing Scripts

LISP automation in BricsCAD is one of the most powerful ways to eliminate repetitive tasks and enforce CAD standards across a team. BricsCAD's LISP engine is compatible with AutoCAD Visual LISP, which means most existing routines work with minimal modification. This guide covers practical LISP development — from defining custom commands to building batch processors that operate on hundreds of DWG files unattended.

## Setting Up the LISP Development Environment

BricsCAD includes a built-in LISP IDE called BLADE (BricsCAD LISP Advanced Development Environment). To launch it:

1. Type `BLADE` at the command line
2. The IDE opens with a code editor, console, and debugger
3. Create a new `.lsp` file or open an existing one

BLADE provides syntax highlighting, auto-completion for BricsCAD-specific functions, breakpoints, watch variables, and step-by-step execution. It is significantly more capable than the legacy Visual LISP IDE in AutoCAD.

### Auto-Loading LISP Files

To have LISP routines load automatically on startup:

1. Place `.lsp` files in a folder included in `SRCHPATH` (check with `SRCHPATH` command)
2. Add the file path to `LOADBE` (Load on Begin) or use the `STARTUP.lsp` file
3. Alternatively, use `APPLOAD` and check "Load on Startup" for each file

For enterprise deployment, create a single `startup.lsp` that loads all project routines:

```lisp
;; startup.lsp - Central loader for all custom routines
(load "layer-tools.lsp")
(load "batch-plot.lsp")
(load "title-block-update.lsp")
(princ "\nCustom routines loaded successfully.")
(princ)
```

## Defining Custom Commands

Use `defun` with the `c:` prefix to create command-line commands:

```lisp
;; Define a command to freeze all layers except the current one
(defun c:FreezeAll (/ ss i ent layname currentlay)
  (setq currentlay (getvar "CLAYER"))
  (setq ss (ssget "X" '((8 . "~*"))))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq layname (cdr (assoc 8 ent)))
        (if (/= layname currentlay)
          (command "_.-LAYER" "_F" layname "")
        )
        (setq i (1+ i))
      )
      (princ (strcat "\nFroze all layers except " currentlay))
    )
    (princ "\nNo entities found.")
  )
  (princ)
)
```

### Command Naming Conventions

- Use a consistent prefix for your firm's commands (e.g., `c:XX-FreezeAll` where `XX` is your company abbreviation)
- Keep command names under 15 characters for command-line compatibility
- Avoid names that conflict with built-in BricsCAD commands

## Entity Selection Strategies

Efficient entity selection is the foundation of performant LISP routines. BricsCAD supports all standard selection methods:

### Selection Set with Filters

```lisp
;; Select all text entities on the "NOTES" layer
(setq ss (ssget "X" '((0 . "TEXT") (8 . "NOTES"))))
```

### Selection by DXF Group Codes

Common DXF codes for filtering:

- `0` — Entity type (TEXT, LINE, CIRCLE, LWPOLYLINE, etc.)
- `8` — Layer name
- `62` — Color number
- `6` — Linetype name
- `67` — Model space (0) vs paper space (1)
- `410` — Layout name

### Wildcard Layer Selection

```lisp
;; Select all entities on layers starting with "A-"
(setq ss (ssget "X" '((8 . "A-*"))))
```

## Batch Processing Multiple DWG Files

One of the most valuable LISP patterns is batch processing — running a routine across dozens or hundreds of DWG files without manual intervention. BricsCAD supports this through the `SDI` (Single Document Interface) mode and the `_.OPEN` / `_.SAVE` / `_.CLOSE` command sequence.

### Batch File Processor Template

```lisp
;; batch-process.lsp - Process multiple DWG files
(defun c:BatchProcess ( / filelist filepath dwgpath filename fulldoc)
  ;; Get list of DWG files from a directory
  (setq dwgpath (getstring "\nEnter folder path: "))
  (setq filelist (vl-directory-files dwgpath "*.dwg" 1))
  
  ;; Save current drawing state
  (setq fulldoc (vla-get-ActiveDocument (vlax-get-acad-object)))
  
  ;; Process each file
  (foreach filename filelist
    (setq filepath (strcat dwgpath "\\" filename))
    (princ (strcat "\nProcessing: " filename))
    
    ;; Open the file
    (command "_.OPEN" filepath)
    
    ;; --- Insert your processing code here ---
    ;; Example: Purge all unused layers
    (command "_.-PURGE" "_LA" "*" "_N")
    (command "_.-PURGE" "_ST" "*" "_N")
    (command "_.AUDIT" "_Y")
    ;; --- End processing code ---
    
    ;; Save and close
    (command "_.QSAVE")
    (command "_.CLOSE")
  )
  (princ "\nBatch processing complete.")
  (princ)
)
```

### Running Batch Processing Safely

Before running batch operations:

1. **Back up all files** — batch routines modify files in place
2. **Test on a sample folder** — copy 3-5 files to a test directory and verify results
3. **Set `SDI` to 0** — BricsCAD must be in multi-document mode for batch open/close to work correctly
4. **Disable dialog boxes** — set `FILEDIA` to 0 and `CMDDIA` to 0 so file dialogs do not interrupt the batch
5. **Log results** — add `(princ)` statements that write to a log file for post-run verification

## Error Handling in LISP Routines

Robust error handling prevents a single failure from crashing the entire routine. Use `*error*` function override:

```lisp
(defun c:SafeRoutine ( / olderr oldcmdecho)
  ;; Save system state
  (setq oldcmdecho (getvar "CMDECHO"))
  (setq olderr *error*)
  
  ;; Define custom error handler
  (defun *error* (msg)
    (princ (strcat "\nError: " msg))
    (setvar "CMDECHO" oldcmdecho)
    (setq *error* olderr)
    (princ)
  )
  
  ;; Set safe environment
  (setvar "CMDECHO" 0)
  
  ;; Main routine code here
  (command "_.ZOOM" "_E")
  
  ;; Restore state
  (setvar "CMDECHO" oldcmdecho)
  (setq *error* olderr)
  (princ)
)
```

## Working with External Data

### Reading CSV Files for Attribute Updates

```lisp
;; Read a CSV file and update title block attributes
(defun c:UpdateTitleBlock ( / csvfile line data)
  (setq csvfile (open (getfiled "Select CSV file" "" "csv" 8) "r"))
  (if csvfile
    (progn
      (while (setq line (read-line csvfile))
        (setq data (parse-csv line))
        ;; data is a list: (dwgname title project date)
        (update-attributes (nth 0 data) (nth 1 data) (nth 2 data) (nth 3 data))
      )
      (close csvfile)
      (princ "\nTitle blocks updated.")
    )
    (princ "\nNo file selected.")
  )
  (princ)
)
```

## Deployment Across a Team

To deploy LISP routines to multiple users:

1. **Create a network share** (e.g., `\\server\cad-tools\lisp\`)
2. **Add the share to `SRCHPATH`** on each workstation via a profile (.arg) file
3. **Create a master `startup.lsp`** on the network share that loads all routines
4. **Use `PROFILE` import** to distribute the profile with correct support paths
5. **Version control** the LISP files using Git or SVN for change tracking

## BRX API for Advanced Development

When LISP isn't sufficient for your automation needs in BricsCAD, the BRX (BricsCAD Runtime eXtension) API provides a C++ development path similar to AutoCAD's ObjectARX. BRX gives you direct access to the drawing database, graphics system, and command registration framework. You can create custom commands that appear in the command line, build dialog boxes using BRX UI tools, and implement real-time entity manipulation that responds to user interaction. The BRX SDK is available from Bricsys and includes documentation, sample projects, and header files. Development is done in Visual Studio on Windows or GCC on Linux. The key advantage of BRX over LISP is performance — BRX programs run as compiled native code, making them orders of magnitude faster than interpreted LISP for computationally intensive tasks. BRX also provides access to features that LISP can't reach: custom entity types, direct graphics pipeline manipulation, and integration with external databases. For teams migrating from AutoCAD, BRX code is similar to ObjectARX code and can often be ported with moderate effort, making BricsCAD the strongest AutoCAD alternative for teams with existing C++ development investments.

## Conclusion

LISP automation in BricsCAD is a practical, high-ROI investment for any team doing repetitive CAD work. The combination of BLADE for development, `defun c:` for custom commands, and batch processing loops for multi-file operations covers the majority of automation needs. By following the error handling patterns and deployment strategies in this guide, you can build a robust LISP toolkit that saves hours of manual work across your organization.
