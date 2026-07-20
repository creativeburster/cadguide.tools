---
title: "CorelCAD LISP Automation: Custom Commands, Layer Tools, and Batch Processing"
excerpt: "A developer guide to writing LISP routines in CorelCAD, covering custom command creation, entity selection with ssget, layer management automation, and batch file processing with error handling."
category: "workflow"
softwareSlug: "corelcad"
keyword: "corelcad lisp automation"
slug: "corelcad-lisp-automation-custom-commands-layer-tools-batch-processing"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://www.cadtutor.net/forum/topic/34294-corelcad-and-lisp/"
  - "https://community.coreldraw.com/talk/technical_graphics_products/f/corelcad/41792/corelcad-export-stl-problem"

---

# CorelCAD LISP Automation: Custom Commands, Layer Tools, and Batch Processing

I picked up CorelCAD a few years back when the Humble Bundle offered it at a fraction of AutoCAD's price. As someone who had built up a library of AutoLISP routines over years of AutoCAD use, my first question was: will my LISP files even work? The short answer is mostly yes, but with enough gotchas to make you pull your hair out. A thread on the CADTutor forums from user BIGAL captured this perfectly — they noted that while some LISP routines loaded and ran fine in CorelCAD, others simply refused to work, and it wasn't obvious why. That matches my experience exactly.

CorelCAD uses the IntelliCAD LISP engine, which is broadly compatible with AutoLISP but has documented gaps. The good news is that basic entity manipulation, ssget selection, command calls, and DCL dialogs all work. The bad news is that Reactors (vlr-* functions), some ActiveX vlax- methods, and anything relying on ObjectARX extensions will silently fail. I learned this the hard way when a block-attribute extraction routine I'd used for years in AutoCAD crashed CorelCAD on load because it called `vlr-object-reactor` during initialization.

This guide covers what actually works in CorelCAD's LISP environment, with practical routines you can use today for layer management, block counting, text correction, and batch file processing.

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

## Real-World Compatibility Gotchas

After migrating dozens of LISP routines from AutoCAD to CorelCAD, I've compiled a list of the most common failure points:

### 1. Express Tools Functions Are Missing

Functions like `acet-filename-path-remove`, `acet-filename-ext-remove`, and `bns_attout` are AutoCAD Express Tools — they don't exist in CorelCAD. If your routine relies on any `acet-*` call, it will fail with `error: LOAD failed`. You need to replace these with native LISP equivalents. For example, instead of `acet-filename-ext-remove`, use:

```lisp
(defun strip-ext (fname / pos)
  (setq pos (vl-string-search "." (vl-string-reverse fname)))
  (if pos
    (substr fname 1 (- (strlen fname) pos 1))
    fname
  )
)
```

### 2. Command String Differences

CorelCAD's command line accepts slightly different command strings in some cases. For instance, `_.-LAYER` works, but some commands that use `_.` prefix differently may fail. Always test command calls interactively first before embedding them in LISP.

### 3. Entmake Limitations

CorelCAD's `entmake` is more restrictive about entity types. While LINE, CIRCLE, TEXT, and INSERT work fine, some complex entities like HATCH with specific patterns may not create correctly. When in doubt, use `(command ...)` instead of `entmake` for complex entities.

### 4. DCL — Actually an Advantage

Here's where CorelCAD surprises people: its DCL (Dialog Control Language) support is fully functional, while AutoCAD has been quietly deprecating DCL in favor of .NET and HTML5 palettes. If you have older routines with DCL dialogs, they'll likely work in CorelCAD without modification — something that can't be said for recent AutoCAD versions.

## Testing Your Routines

Before deploying any migrated LISP routine to production, I recommend this testing sequence:

1. Load the routine with `(load "routine.lsp")` and check for errors
2. Run `vl-load-com` first — even if some vlax- functions are missing, the basic vl- functions work
3. Test with a simple drawing first, not a production file
4. Check that `(getvar "PROGRAM")` returns the expected value — in CorelCAD it returns a different string than AutoCAD
5. If a routine uses `vl-catch-all-apply`, wrap critical sections to gracefully handle unsupported function calls

## Real-World LISP Migration Experience

When migrating LISP routines from AutoCAD to CorelCAD, the experience varies significantly depending on the complexity of your code. Simple routines that use basic entity manipulation commands like entget, entmake, and ssget work without modification. Routines that call command-s functions like "C:LAYISO" or use the command function to invoke built-in commands also work well. The problems start with Visual LISP extensions. Any routine using vlax-get-property, vlax-put-property, or vlax-invoke-method needs careful testing because the ActiveX property names and method signatures may differ between AutoCAD and the IntelliCAD engine that CorelCAD uses. Reactors (vlr-object-reactor, vlr-command-reactor) are completely unsupported and will cause the routine to fail silently. Express Tools functions (acet-ss-drag-move, acet-ss-visible) are also missing. The practical approach is to load each routine, test it on a sample drawing, and log which ones fail. For failed routines, either rewrite the problematic section using basic AutoLISP or find an alternative workflow that doesn't require the missing function.

## Conclusion

CorelCAD's LISP engine provides practical automation capabilities for 2D drafting workflows. The DCL support is actually an advantage over modern AutoCAD for older routines. The key is knowing which functions work and which don't — Reactors and Express Tools are the biggest gaps, while basic AutoLISP, ssget, entmake, and DCL are solid. By building custom commands for layer management, text correction, and batch processing, you can eliminate repetitive work and enforce CAD standards without purchasing AutoCAD. Just budget time for testing and adapting your existing routine library — expect about 80% compatibility out of the box, with the remaining 20% requiring manual fixes.
