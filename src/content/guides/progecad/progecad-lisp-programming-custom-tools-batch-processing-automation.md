---
title: "progeCAD LISP Programming: Custom Tools, Batch Processing, and Drawing Automation"
excerpt: "A developer guide to writing LISP automation routines in progeCAD, covering custom command creation, entity selection, drawing database manipulation, and batch file processing with error handling."
category: "workflow"
softwareSlug: "progecad"
keyword: "progecad lisp programming"
slug: "progecad-lisp-programming-custom-tools-batch-processing-automation"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.progesoft.com/products/progecad-professional/manual?mp=developer-reference%2Flisp%2Flisp-compatibility"
  - "https://www.cadtutor.net/forum/topic/86867-lisp-works-in-c3d-but-not-in-progecad/"
  - "https://forums.intellicadms.com/viewtopic.php?t=2774"
---

# progeCAD LISP Programming: Custom Tools, Batch Processing, and Drawing Automation

progeCAD Professional includes a LISP engine compatible with AutoCAD's AutoLISP. The official progeCAD manual documents LISP compatibility in detail, listing which functions are unique to progeCAD, which are enhanced, which are partially compatible, and which are not supported at all. The unsupported list includes arx, arxload, arxunload, autoarxload, entgetx, initdia, ssnamex, and tablet — and notably, many vlax- functions are listed as existing but undocumented.

On the CADTutor forums, a user reported that a LISP routine working perfectly in Civil 3D failed in progeCAD — a common experience for anyone migrating AutoLISP code between platforms. On the IntelliCAD forums, another user found that the AutoCAD ATTOUT command doesn't exist in progeCAD and had to build a custom attribute extraction routine from scratch. These real compatibility issues are the biggest challenge for progeCAD LISP developers. This guide covers practical LISP development from basic commands to advanced batch processing, with specific attention to the compatibility gaps documented in community discussions.

## LISP Development Setup

### Loading LISP Files

1. Type `APPLOAD` to open the application loader
2. Browse to your `.lsp` file and click "Load"
3. Check "Add to History" for frequently used routines
4. For auto-loading, add to `icad.lsp` in the support folder

### Auto-Load Configuration

```lisp
;; icad.lsp - Auto-loaded routines
(load "layer-tools.lsp")
(load "batch-purge.lsp")
(load "title-update.lsp")
(princ "\nprogeCAD custom routines loaded.")
(princ)
```

## Custom Command Definition

### Layer Isolation by Selection

```lisp
(defun c:IsoLayer ( / ss ent layname)
  (setq ent (car (entsel "\nSelect an entity to isolate its layer: ")))
  (if ent
    (progn
      (setq layname (cdr (assoc 8 (entget ent))))
      (command "_.-LAYER" "_LO" "*" "")
      (command "_.-LAYER" "_U" layname "")
      (princ (strcat "\nIsolated layer: " layname))
    )
    (princ "\nNo entity selected.")
  )
  (princ)
)
```

### Count Blocks by Name

```lisp
(defun c:CountBlocks ( / blkname ss count)
  (setq blkname (getstring "\nBlock name to count: "))
  (setq ss (ssget "X" (list (cons 0 "INSERT") (cons 2 blkname))))
  (if ss
    (princ (strcat "\n" blkname ": " (itoa (sslength ss)) " instances found."))
    (princ (strcat "\n" blkname ": 0 instances found."))
  )
  (princ)
)
```

### Batch Text Height Correction

```lisp
(defun c:FixTextHeight ( / ss i ent oldh newh ratio)
  (setq ss (ssget "X" '((0 . "TEXT"))))
  (if ss
    (progn
      (setq newh (getreal "\nCorrect text height: "))
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq oldh (cdr (assoc 40 ent)))
        (if (/= oldh 0)
          (progn
            (setq ent (subst (cons 40 newh) (assoc 40 ent) ent))
            (entmod ent)
          )
        )
        (setq i (1+ i))
      )
      (princ (strcat "\nUpdated " (itoa (sslength ss)) " text entities."))
    )
    (princ "\nNo text found.")
  )
  (princ)
)
```

## Entity Selection with ssget

### Common Selection Patterns

```lisp
;; All entities on a layer
(ssget "X" '((8 . "A-WALL")))

;; All text entities
(ssget "X" '((0 . "TEXT")))

;; All block references of a specific name
(ssget "X" '((0 . "INSERT") (2 . "TITLE_BLOCK")))

;; All dimensions
(ssget "X" '((0 . "DIMENSION")))

;; All circles
(ssget "X" '((0 . "CIRCLE")))

;; All entities with a specific color
(ssget "X" '((62 . 1)))

;; All entities on layers starting with "A-"
(ssget "X" '((8 . "A-*")))

;; All entities in paper space
(ssget "X" '((67 . 1)))
```

## Drawing Database Manipulation

### Change Entity Layer

```lisp
(defun c:MoveToLayer ( / ss targetlay i ent)
  (setq ss (ssget))
  (if ss
    (progn
      (setq targetlay (getstring "\nTarget layer name: "))
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq ent (subst (cons 8 targetlay) (assoc 8 ent) ent))
        (entmod ent)
        (setq i (1+ i))
      )
      (princ (strcat "\nMoved " (itoa (sslength ss)) " entities to " targetlay))
    )
  )
  (princ)
)
```

### Create Line Entity

```lisp
(defun draw-line (pt1 pt2 layer / entlist)
  (setq entlist
    (list
      (cons 0 "LINE")
      (cons 8 layer)
      (cons 10 pt1)
      (cons 11 pt2)
    )
  )
  (entmake entlist)
)
```

## Batch File Processing

```lisp
(defun c:BatchProcess ( / dir files file count)
  (setq dir (getstring "\nDirectory path: "))
  (setq files (vl-directory-files dir "*.dwg" 1))
  (setq count 0)
  
  (setvar "FILEDIA" 0)
  (setvar "CMDDIA" 0)
  (setvar "CMDECHO" 0)
  
  (foreach file files
    (princ (strcat "\nProcessing: " file))
    (command "_.OPEN" (strcat dir "\\" file))
    (command "_.AUDIT" "_Y")
    (command "_.-PURGE" "_A" "*" "_N")
    (command "_.-PURGE" "_A" "*" "_N")
    (command "_.QSAVE")
    (command "_.CLOSE")
    (setq count (1+ count))
  )
  
  (setvar "FILEDIA" 1)
  (setvar "CMDDIA" 1)
  (setvar "CMDECHO" 1)
  
  (princ (strcat "\nProcessed " (itoa count) " files."))
  (princ)
)
```

## Error Handling

```lisp
(defun c:SafeRoutine ( / olderr oldcmdecho oldfiledia)
  (setq oldcmdecho (getvar "CMDECHO"))
  (setq oldfiledia (getvar "FILEDIA"))
  (setq olderr *error*)
  
  (defun *error* (msg)
    (princ (strcat "\nError: " msg))
    (setvar "CMDECHO" oldcmdecho)
    (setvar "FILEDIA" oldfiledia)
    (setq *error* olderr)
    (princ)
  )
  
  (setvar "CMDECHO" 0)
  (setvar "FILEDIA" 0)
  
  ;; Main operation
  (command "_.ZOOM" "_E")
  (princ "\nRoutine completed.")
  
  (setvar "CMDECHO" oldcmdecho)
  (setvar "FILEDIA" oldfiledia)
  (setq *error* olderr)
  (princ)
)
```

## DCL Dialog Support

progeCAD supports DCL (Dialog Control Language) for creating custom dialog boxes — a feature AutoCAD has deprecated:

```lisp
;; Simple DCL dialog example
(defun c:MyDialog ( / dcl_id result)
  (setq dcl_id (load_dialog "mydialog.dcl"))
  (if (new_dialog "mydialog" dcl_id)
    (progn
      (action_tile "accept" "(done_dialog 1)")
      (action_tile "cancel" "(done_dialog 0)")
      (setq result (start_dialog))
      (if (= result 1)
        (princ "\nUser clicked OK.")
        (princ "\nUser clicked Cancel.")
      )
    )
    (princ "\nCannot load dialog.")
  )
  (unload_dialog dcl_id)
  (princ)
)
```

Corresponding `mydialog.dcl`:

```
mydialog : dialog {
  label = "Custom Tool";
  : text { label = "Select an option:"; }
  : button {
    key = "accept";
    label = "OK";
    is_default = true;
  }
  : button {
    key = "cancel";
    label = "Cancel";
    is_cancel = true;
  }
}
```

## LISP Compatibility Notes

- **`vl-load-com`**: Supported, some ActiveX properties may differ
- **`vla-*` methods**: Most supported; test entity-specific properties
- **`vl-catch-all-apply`**: Fully supported
- **`grread`/`grdraw`**: Supported
- **Reactors (`vlr-*`)**: Not supported
- **DCL**: Fully supported (advantage over AutoCAD)
- **`vl-directory-files`**: Fully supported

## Building a LISP Testing Framework for progeCAD

On the CADTutor forums, a user reported that a LISP routine working perfectly in Civil 3D failed in progeCAD with an "unknown function" error. The specific function was acet-ss-drag-move from Express Tools — a common failure point since Express Tools are not included with IntelliCAD-based CAD programs. The user's solution was to rewrite the drag-move functionality using basic AutoLISP functions: grdraw for visual feedback, grread for user input, and entmod for entity modification. This workaround took about 40 lines of code to replace a single Express Tools function call, but it ran identically in both AutoCAD and progeCAD. This experience highlights a key strategy for LISP migration: identify Express Tools dependencies early and build replacement functions using basic AutoLISP. Another common issue reported on the IntelliCAD forums involves the ATTOUT command — progeCAD doesn't have this command, so users needing attribute export must build a custom routine using entget to read attribute values and write them to a CSV file.

When migrating LISP routines to progeCAD, a systematic testing approach saves time and prevents production issues. Start by creating a test drawing that contains representative entities: lines, circles, arcs, polylines, blocks with attributes, MTEXT, dimensions, and hatches. For each LISP routine, document the expected behavior, run it against the test drawing, and record the result. Categorize results as: works perfectly, works with minor issues, fails with error message, or fails silently. For routines that fail, use the progeCAD LISP console to identify the specific function call that caused the failure. The official progeCAD manual lists which LISP functions are not supported — check the unsupported list first to quickly identify routines that will definitely fail. For routines using unsupported functions, evaluate whether the functionality can be achieved through alternative means: basic AutoLISP instead of Visual LISP, command calls instead of ActiveX methods, or DCL dialogs instead of Reactor-based automation. Document all adaptations so future maintenance is easier. This testing framework typically takes one to two weeks for a library of 50-100 routines.

## Conclusion

progeCAD's LISP engine provides a robust automation platform compatible with most AutoLISP routines, but the compatibility is not complete. As documented in the official manual and confirmed by community discussions on CADTutor and IntelliCAD forums, the main gaps are: Express Tools functions (acet-*), ObjectARX (arx-*), some ActiveX methods (vlax-*), and commands like ATTOUT/ATTIN that exist in AutoCAD but not in IntelliCAD-based tools. The DCL support is a unique advantage over modern AutoCAD, allowing older dialog-based routines to work without modification. By building a library of custom commands for layer management, text correction, block counting, and batch processing, you can eliminate repetitive work and enforce CAD standards — just budget time for testing and adapting your existing routine library to progeCAD's LISP environment.
