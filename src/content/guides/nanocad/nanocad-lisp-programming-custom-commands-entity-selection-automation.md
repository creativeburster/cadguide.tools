---
title: "nanoCAD LISP Programming: Custom Commands, Entity Selection, and Drawing Automation"
excerpt: "A developer guide to writing LISP automation routines in nanoCAD Plus, covering command definition, entity selection with ssget, drawing database manipulation, and practical batch processing examples."
category: "workflow"
softwareSlug: "nanocad"
keyword: "nanocad lisp programming"
slug: "nanocad-lisp-programming-custom-commands-entity-selection-automation"
author: "CADGuide Tools Editorial Team"
readTime: "13 min read"
date: "2026-06-30"
sources:
  - "https://nanocad.com/products/nanocad/plus/"
  - "https://nanocad.com/learning/online-help/nanocad-platform/work-with-lisp-applications/"

---

# nanoCAD LISP Programming: Custom Commands, Entity Selection, and Drawing Automation

nanoCAD Plus includes a LISP engine that is compatible with AutoCAD's AutoLISP. This makes it possible to automate repetitive drafting tasks, enforce CAD standards, and process multiple drawings in batch — all without purchasing AutoCAD. This guide covers practical LISP development in nanoCAD from basic command definition to advanced batch processing.

## LISP Development Environment

nanoCAD Plus includes a built-in LISP IDE accessible via `LISPIDE` command. The IDE provides:

- Code editor with syntax highlighting
- Console for immediate expression evaluation
- File management for `.lsp` files
- Basic debugging with breakpoints

### Auto-Loading LISP Files

To load LISP routines automatically when nanoCAD starts:

1. Place `.lsp` files in a folder added to the Support File Search Path (`SRCHPATH`)
2. Create a `icad.lsp` file (nanoCAD's equivalent of AutoCAD's `acaddoc.lsp`) in the support path:

```lisp
;; icad.lsp - Auto-loaded routines
(load "layer-tools.lsp")
(load "batch-purge.lsp")
(load "title-block-update.lsp")
(princ "\nCustom routines loaded.")
(princ)
```

Alternatively, use `APPLOAD` and check "Load on Startup" for individual files.

## Defining Custom Commands

Use `defun` with the `c:` prefix to create command-line commands:

```lisp
;; Command to count entities by type on the current layer
(defun c:CountByType ( / ss counts enttype i)
  (setq ss (ssget "X" (list (cons 8 (getvar "CLAYER")))))
  (if ss
    (progn
      (setq counts nil)
      (setq i 0)
      (while (< i (sslength ss))
        (setq enttype (cdr (assoc 0 (entget (ssname ss i)))))
        (setq counts (add-count enttype counts))
        (setq i (1+ i))
      )
      (print-counts counts)
    )
    (princ "\nNo entities on current layer.")
  )
  (princ)
)

(defun add-count (type counts)
  (if (assoc type counts)
    (subst (cons type (1+ (cdr (assoc type counts))) )
           (assoc type counts)
           counts)
    (append counts (list (cons type 1)))
  )
)

(defun print-counts (counts)
  (princ "\n--- Entity Count on Current Layer ---")
  (foreach item counts
    (princ (strcat "\n" (car item) ": " (itoa (cdr item))))
  )
)
```

## Entity Selection with ssget

`ssget` is the primary function for selecting entities programmatically.

### Selection Methods

```lisp
;; Select all entities in the drawing
(ssget "X")

;; Select all entities on a specific layer
(ssget "X" '((8 . "A-WALL-EXT")))

;; Select all text entities
(ssget "X" '((0 . "TEXT")))

;; Select all circles with radius > 50
(ssget "X" '((0 . "CIRCLE")))
;; Then filter by radius in code

;; Select all entities on layers starting with "A-"
(ssget "X" '((8 . "A-*")))

;; Select all dimensions
(ssget "X" '((0 . "DIMENSION")))

;; Select all block references of a specific block name
(ssget "X" '((0 . "INSERT") (2 . "TITLE_BLOCK")))

;; Select by color
(ssget "X" '((62 . 1)))  ;; All red entities

;; Select in paper space only
(ssget "X" '((67 . 1)))

;; Select in model space only
(ssget "X" '((67 . 0)))
```

### Combining Filters

Use multiple DXF group codes in the filter list for AND logic:

```lisp
;; All text on the NOTES layer with yellow color
(ssget "X" '((0 . "TEXT") (8 . "NOTES") (62 . 2)))

;; All block references on the FURNITURE layer
(ssget "X" '((0 . "INSERT") (8 . "FURNITURE")))
```

## Drawing Database Manipulation

### Reading Entity Data

```lisp
;; Get the entity data list for the last entity created
(setq ent (entget (entlast)))

;; Extract specific properties
(setq enttype (cdr (assoc 0 ent)))   ;; Entity type
(setq layer (cdr (assoc 8 ent)))     ;; Layer name
(setq color (cdr (assoc 62 ent)))    ;; Color (nil = BYLAYER)
(setq startpt (cdr (assoc 10 ent)))  ;; Start point (for LINE)
(setq endpt (cdr (assoc 11 ent)))    ;; End point (for LINE)
```

### Modifying Entity Data

```lisp
;; Change the layer of a selected entity
(defun c:MoveToNotes ( / ss i ent newent)
  (setq ss (ssget))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq newent (subst (cons 8 "NOTES") (assoc 8 ent) ent))
        (entmod newent)
        (setq i (1+ i))
      )
      (princ (strcat "\nMoved " (itoa (sslength ss)) " entities to NOTES layer."))
    )
  )
  (princ)
)
```

### Creating New Entities

```lisp
;; Create a line entity
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

## Practical Automation Examples

### Example 1: Batch Layer Standardization

```lisp
(defun c:StandardizeLayers ( / ss i ent layname newlay)
  (setq ss (ssget "X"))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq layname (cdr (assoc 8 ent)))
        ;; Convert layer name to uppercase
        (setq newlay (strcase layname))
        (if (/= layname newlay)
          (progn
            (setq ent (subst (cons 8 newlay) (assoc 8 ent) ent))
            (entmod ent)
          )
        )
        (setq i (1+ i))
      )
      (princ "\nLayer names standardized to uppercase.")
    )
  )
  (princ)
)
```

### Example 2: Automatic Title Block Attribute Update

```lisp
(defun c:UpdateTitleBlock ( / ss ent attlist tag val)
  (setq ss (ssget "X" '((0 . "INSERT") (2 . "TITLE_BLOCK"))))
  (if ss
    (progn
      (setq ent (ssname ss 0))
      (setq attlist (entget ent))
      ;; Get the first attribute
      (setq nextent (entnext ent))
      (while nextent
        (setq attdata (entget nextent))
        (if (= (cdr (assoc 0 attdata)) "ATTRIB")
          (progn
            (setq tag (cdr (assoc 2 attdata)))
            (cond
              ((= tag "DATE")
                (setq val (menucmd "M$(edtime,$(getvar,date),YYYY-MO-DD)"))
                (entmod (subst (cons 1 val) (assoc 1 attdata) attdata))
              )
              ((= tag "SCALE")
                (setq val (getstring "\nEnter plot scale: "))
                (entmod (subst (cons 1 val) (assoc 1 attdata) attdata))
              )
            )
          )
        )
        (setq nextent (entnext nextent))
      )
      (entupd ent)
      (princ "\nTitle block updated.")
    )
    (princ "\nNo title block found.")
  )
  (princ)
)
```

### Example 3: Batch Purge Across Multiple Files

```lisp
(defun c:BatchPurge ( / dir files file)
  (setq dir (getstring "\nEnter directory path: "))
  (setq files (vl-directory-files dir "*.dwg" 1))
  (setvar "FILEDIA" 0)
  (setvar "CMDDIA" 0)
  (foreach file files
    (command "_.OPEN" (strcat dir "\\" file))
    (command "_.AUDIT" "_Y")
    (command "_.-PURGE" "_A" "*" "_N")
    (command "_.QSAVE")
    (command "_.CLOSE")
    (princ (strcat "\nPurged: " file))
  )
  (setvar "FILEDIA" 1)
  (setvar "CMDDIA" 1)
  (princ "\nBatch purge complete.")
  (princ)
)
```

## Error Handling

Always include error handling to prevent crashes and restore system state:

```lisp
(defun c:SafeRoutine ( / olderr oldcmdecho oldfiledia)
  ;; Save system state
  (setq oldcmdecho (getvar "CMDECHO"))
  (setq oldfiledia (getvar "FILEDIA"))
  (setq olderr *error*)

  ;; Custom error handler
  (defun *error* (msg)
    (princ (strcat "\nError: " msg))
    (setvar "CMDECHO" oldcmdecho)
    (setvar "FILEDIA" oldfiledia)
    (setq *error* olderr)
    (princ)
  )

  ;; Set safe environment
  (setvar "CMDECHO" 0)
  (setvar "FILEDIA" 0)

  ;; Main routine
  (command "_.ZOOM" "_E")
  (princ "\nRoutine completed successfully.")

  ;; Restore state
  (setvar "CMDECHO" oldcmdecho)
  (setvar "FILEDIA" oldfiledia)
  (setq *error* olderr)
  (princ)
)
```

## LISP Compatibility Notes

nanoCAD's LISP engine is compatible with most AutoLISP functions, but there are documented differences:

- **`vl-load-com`**: Supported in nanoCAD Plus, but some ActiveX properties may differ
- **`vlax-get-acad-object`**: Returns the nanoCAD application object, not AutoCAD
- **`vla-*` methods**: Most are supported; verify entity-specific properties
- **`grread`**: Supported but may behave differently with multi-monitor setups
- **`vl-catch-all-apply`**: Fully supported
- **Reactors (`vlr-*`)**: Not supported in nanoCAD

## Practical LISP Migration Strategy for nanoCAD

According to the nanoCAD support portal, nanoCAD supports interpreted LISP files only — compiled formats like .vlx and .fas are not supported. This means any routines distributed as compiled files need to be obtained in source code form before migration. The nanoCAD support team also notes that instead of ObjectARX, nanoCAD provides its own C++ API called NRX, which is similar in concept but not compatible at the source code level. On the nanoCAD Italia forum, a user reported a specific issue where a LISP routine that worked in AutoCAD produced incorrect results in nanoCAD — the problem was traced to a difference in how the two programs handle entity selection sets when the drawing contains proxy objects. The workaround was to filter out proxy objects before processing the selection set. This type of subtle compatibility difference is common and underscores the importance of testing each routine against representative drawings rather than assuming compatibility based on function names alone.

When migrating LISP routines from AutoCAD to nanoCAD, a phased approach minimizes disruption. Phase one: inventory all LISP routines in use and categorize them by complexity (simple, moderate, complex). Phase two: test simple routines first — these typically use basic AutoLISP functions like ssget, entget, entmake, and command calls. Expect 85-90% of simple routines to work without modification. Phase three: test moderate routines that use Visual LISP extensions (vlax- methods). Expect 60-70% to work, with the remainder needing adaptation. Phase four: test complex routines that use Reactors, Express Tools, or compiled FAS/VLX files. Expect most to fail and require significant rewriting or replacement. For routines that can't be adapted, consider using nanoCAD's NRX C++ API to build replacement tools. The NRX API provides direct access to the drawing database and can handle most automation needs that LISP can't. The total migration timeline for a library of 50-100 routines is typically two to three weeks, with the simple and moderate routines handled in the first week and the complex routines taking the remaining time.

## Conclusion

LISP programming in nanoCAD Plus provides a cost-effective automation pathway for teams that need custom commands, batch processing, and drawing standardization without the cost of AutoCAD. The LISP engine is compatible enough that most existing AutoLISP routines work with minimal modification. By following the patterns in this guide — custom commands with `defun c:`, entity selection with `ssget`, safe error handling, and batch file processing — you can build a robust automation toolkit that saves hours of manual drafting work.
