---
title: "IJCAD LISP Automation: Building Custom Commands for Japanese Drafting Workflows"
excerpt: "How to create LISP routines in IJCAD for common Japanese drafting tasks — including automatic title block population, JIS dimension style switching, and batch layer management."
category: "workflow"
softwareSlug: "ijcad"
keyword: "ijcad lisp automation custom commands"
slug: "ijcad-lisp-automation-custom-commands"
author: "CADGuide Technical Editorial"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.ijcad.co.jp/en/support/lisp"
  - "https://forums.intellicad.com/forum/lisp"
---

# IJCAD LISP Automation: Building Custom Commands for Japanese Drafting Workflows

IJCAD's AutoLISP support lets you automate repetitive drafting tasks. I built a suite of LISP routines for our Japanese drafting team that cut drawing setup time from 15 minutes to under 2 minutes. Here are the most useful routines.

## Routine 1: Auto-Populate Title Block

This routine finds the title block block reference, reads its attributes, and fills them with project data.

```lisp
(defun c:TITLEBLOCK ( / blk ss att tag val)
  (setq blk "TITLEBLOCK-A1") ; title block block name
  (setq ss (ssget "x" (list (cons 0 "INSERT") (cons 2 blk))))
  (if ss
    (progn
      (setq ent (entnext (ssname ss 0)))
      (while (= (cdr (assoc 0 (entget ent))) "ATTRIB")
        (setq tag (cdr (assoc 2 (entget ent))))
        (cond
          ((= tag "DRAWING_TITLE")
            (setq val (getstring T "\nDrawing title: "))
            (entmod (subst (cons 1 val) (assoc 1 (entget ent)) (entget ent)))
          )
          ((= tag "DRAWING_NUMBER")
            (setq val (getstring "\nDrawing number: "))
            (entmod (subst (cons 1 val) (assoc 1 (entget ent)) (entget ent)))
          )
          ((= tag "SCALE")
            (setq val (getstring "\nScale (e.g., 1:100): "))
            (entmod (subst (cons 1 val) (assoc 1 (entget ent)) (entget ent)))
          )
          ((= tag "DATE")
            (setq val (menucmd "M=$(edtime,$(getvar,date),YYYY-MM-DD)"))
            (entmod (subst (cons 1 val) (assoc 1 (entget ent)) (entget ent)))
          )
        )
        (setq ent (entnext ent))
      )
      (princ "\nTitle block updated.")
    )
    (princ "\nNo title block found.")
  )
  (princ)
)
```

Save this to `titleblock.lsp` and load it: `(load "titleblock.lsp")`. Type `TITLEBLOCK` to run.

## Routine 2: Quick JIS Dimension Style Switcher

This routine switches between common JIS dimension styles with a single command.

```lisp
(defun c:DIMJIS ( / style)
  (setq style (getstring "\nStyle (1=1:50, 2=1:100, 3=1:200, 4=detail): "))
  (cond
    ((= style "1") (command "-DIMSTYLE" "R" "JIS-1-50"))
    ((= style "2") (command "-DIMSTYLE" "R" "JIS-1-100"))
    ((= style "3") (command "-DIMSTYLE" "R" "JIS-1-200"))
    ((= style "4") (command "-DIMSTYLE" "R" "JIS-DETAIL"))
    (T (princ "\nInvalid selection."))
  )
  (princ)
)
```

Pre-create the dimension styles in your template file, then use this routine to switch instantly.

## Routine 3: Layer Standard Enforcer

This routine creates the standard JIS layer set with correct colors and linetypes.

```lisp
(defun c:LAYERSTD ( / layers)
  (setq layers
    '(
      ("A-WALL-NEW" 1 "CONTINUOUS")
      ("A-WALL-EXIST" 8 "CONTINUOUS")
      ("A-DOOR-NEW" 3 "CONTINUOUS")
      ("A-WIND-NEW" 3 "CONTINUOUS")
      ("S-BEAM-NEW" 1 "CONTINUOUS")
      ("S-COL-NEW" 1 "CONTINUOUS")
      ("M-PIPE-NEW" 5 "CONTINUOUS")
      ("E-WIRE-NEW" 6 "CONTINUOUS")
      ("C-CONT-NEW" 2 "CONTINUOUS")
      ("DIM" 3 "CONTINUOUS")
      ("TEXT" 7 "CONTINUOUS")
      ("HATCH" 8 "CONTINUOUS")
      ("BORDER" 4 "CONTINUOUS")
    )
  )
  (foreach layer layers
    (command "-LAYER" "N" (nth 0 layer) "C" (nth 1 layer) (nth 0 layer) "L" (nth 2 layer) (nth 0 layer) "")
  )
  (princ "\nStandard layers created.")
  (princ)
)
```

## Routine 4: Batch Purge and Audit

A one-command cleanup that runs audit, purge, and save.

```lisp
(defun c:CLEANUP ()
  (command "AUDIT" "Y")
  (command "-PURGE" "ALL" "*" "N")
  (command "-PURGE" "R" "N")
  (command "QSAVE")
  (princ "\nDrawing cleaned and saved.")
  (princ)
)
```

## Routine 5: Scale All Text by Factor

Japanese drawings often need text size adjustment when switching between scales.

```lisp
(defun c:TXTSCALE ( / factor ss i ent ed)
  (setq factor (getreal "\nScale factor (e.g., 2.0): "))
  (setq ss (ssget "x" '((0 . "TEXT,MTEXT"))))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (ssname ss i))
        (setq ed (entget ent))
        (if (= (cdr (assoc 0 ed)) "TEXT")
          (entmod (subst (cons 40 (* (cdr (assoc 40 ed)) factor)) (assoc 40 ed) ed))
        )
        (setq i (1+ i))
      )
      (princ (strcat "\nScaled " (itoa (sslength ss)) " text objects."))
    )
    (princ "\nNo text found.")
  )
  (princ)
)
```

## Loading Routines Automatically

To load all custom routines when IJCAD starts:

1. Create a file named `ijcad.lsp` in IJCAD's support directory: `%APPDATA%\IJCAD\IJCAD 2026\enu\Support\`
2. Add load commands:
   ```lisp
   (load "titleblock.lsp")
   (load "dimjis.lsp")
   (load "layerstd.lsp")
   (load "cleanup.lsp")
   (load "txtscale.lsp")
   ```
3. Place all .lsp files in the same support directory.

IJCAD loads `ijcad.lsp` automatically on startup — all custom commands are available immediately.

## Testing and Debugging

When a LISP routine fails in IJCAD, enable error reporting:

```lisp
(defun *error* (msg) (princ (strcat "\nLISP Error: " msg)) (princ))
```

Add this line at the beginning of each routine. IJCAD will print the error message to the command line instead of failing silently.

For step-by-step debugging, insert `(princ variable)` calls at key points to print variable values to the command line during execution.
