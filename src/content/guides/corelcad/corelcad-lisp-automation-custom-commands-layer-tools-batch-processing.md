---
title: "CorelCAD LISP Automation: Custom Commands, Layer Tools, and Batch Processing"
excerpt: "A developer guide to writing LISP routines in CorelCAD, covering custom command creation, entity selection with ssget, layer management automation, and batch file processing with error handling."
category: "workflow"
softwareSlug: "corelcad"
keyword: "corelcad lisp automation"
slug: "corelcad-lisp-automation-custom-commands-layer-tools-batch-processing"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.coreldraw.com/en/pages/corelcad/help/lisp/"
  - "https://www.coreldraw.com/en/pages/corelcad/"
---

# CorelCAD LISP Automation: Custom Commands, Layer Tools, and Batch Processing

CorelCAD includes a LISP engine compatible with AutoLISP, enabling custom command creation and drawing automation. This guide covers practical LISP development from basic commands to batch processing.

## Loading LISP Files

1. Type `APPLOAD` > browse to `.lsp` file > Load
2. For auto-loading, add to `icad.lsp` in the support folder:

```lisp
;; icad.lsp
(load "layer-tools.lsp")
(load "batch-purge.lsp")
(princ "\nCorelCAD routines loaded.")
(princ)
```

## Custom Commands

### Layer Isolation

```lisp
(defun c:IsoLayer ( / ent layname)
  (setq ent (car (entsel "\nSelect entity to isolate its layer: ")))
  (if ent
    (progn
      (setq layname (cdr (assoc 8 (entget ent))))
      (command "_.-LAYER" "_LO" "*" "")
      (command "_.-LAYER" "_U" layname "")
      (princ (strcat "\nIsolated: " layname))
    )
    (princ "\nNothing selected.")
  )
  (princ)
)
```

### Count Blocks

```lisp
(defun c:CountBlocks ( / blkname ss)
  (setq blkname (getstring "\nBlock name: "))
  (setq ss (ssget "X" (list (cons 0 "INSERT") (cons 2 blkname))))
  (if ss
    (princ (strcat "\n" blkname ": " (itoa (sslength ss)) " found."))
    (princ (strcat "\n" blkname ": 0 found."))
  )
  (princ)
)
```

### Fix Text Height

```lisp
(defun c:FixTextHeight ( / ss newh i ent)
  (setq ss (ssget "X" '((0 . "TEXT"))))
  (if ss
    (progn
      (setq newh (getreal "\nCorrect text height: "))
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq ent (subst (cons 40 newh) (assoc 40 ent) ent))
        (entmod ent)
        (setq i (1+ i))
      )
      (princ (strcat "\nFixed " (itoa (sslength ss)) " text entities."))
    )
    (princ "\nNo text found.")
  )
  (princ)
)
```

## Entity Selection Patterns

```lisp
;; All entities on a layer
(ssget "X" '((8 . "A-WALL")))

;; All text
(ssget "X" '((0 . "TEXT")))

;; All block references
(ssget "X" '((0 . "INSERT") (2 . "TITLE_BLOCK")))

;; All dimensions
(ssget "X" '((0 . "DIMENSION")))

;; All entities on layers starting with "A-"
(ssget "X" '((8 . "A-*")))
```

## Batch Processing

```lisp
(defun c:BatchPurge ( / dir files file count)
  (setq dir (getstring "\nDirectory: "))
  (setq files (vl-directory-files dir "*.dwg" 1))
  (setq count 0)
  (setvar "FILEDIA" 0)
  (setvar "CMDECHO" 0)
  (foreach file files
    (command "_.OPEN" (strcat dir "\\" file))
    (command "_.AUDIT" "_Y")
    (command "_.-PURGE" "_A" "*" "_N")
    (command "_.QSAVE")
    (command "_.CLOSE")
    (setq count (1+ count))
  )
  (setvar "FILEDIA" 1)
  (setvar "CMDECHO" 1)
  (princ (strcat "\nProcessed " (itoa count) " files."))
  (princ)
)
```

## Error Handling

```lisp
(defun c:SafeRoutine ( / olderr oldcmdecho)
  (setq oldcmdecho (getvar "CMDECHO"))
  (setq olderr *error*)
  (defun *error* (msg)
    (princ (strcat "\nError: " msg))
    (setvar "CMDECHO" oldcmdecho)
    (setq *error* olderr)
    (princ)
  )
  (setvar "CMDECHO" 0)
  ;; Main operation
  (command "_.ZOOM" "_E")
  (setvar "CMDECHO" oldcmdecho)
  (setq *error* olderr)
  (princ)
)
```

## DCL Support

CorelCAD supports DCL dialogs (deprecated in AutoCAD):

```lisp
(defun c:MyDialog ( / dcl_id result)
  (setq dcl_id (load_dialog "mydialog.dcl"))
  (if (new_dialog "mydialog" dcl_id)
    (progn
      (action_tile "accept" "(done_dialog 1)")
      (action_tile "cancel" "(done_dialog 0)")
      (setq result (start_dialog))
    )
  )
  (unload_dialog dcl_id)
  (princ)
)
```

## LISP Compatibility

- `vl-load-com`: partially supported
- `vla-*`: most methods supported
- `vl-catch-all-apply`: fully supported
- Reactors (`vlr-*`): not supported
- DCL: fully supported
- `vl-directory-files`: fully supported

## Conclusion

CorelCAD's LISP engine provides practical automation capabilities for 2D drafting workflows. The DCL support is an advantage over AutoCAD for older routines. By building custom commands for layer management, text correction, and batch processing, you can eliminate repetitive work and enforce CAD standards without purchasing AutoCAD.
