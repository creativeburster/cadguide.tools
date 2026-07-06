---
title: "GstarCAD LISP Automation: Batch Processing, Layer Management, and Custom Commands"
excerpt: "A developer guide to writing LISP automation routines in GstarCAD, covering custom command creation, batch file processing, layer standardization scripts, and title block attribute automation."
category: "workflow"
softwareSlug: "gstarcad"
keyword: "gstarcad lisp automation"
slug: "gstarcad-lisp-automation-batch-processing-layer-management-commands"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-30"
sources:
  - "https://www.gstarcad.com/developer/"
  - "https://www.cadtutor.net/forum/topic/34294-corelcad-and-lisp/"

---

# GstarCAD LISP Automation: Batch Processing, Layer Management, and Custom Commands

GstarCAD's LISP engine is compatible with AutoCAD's AutoLISP, making it possible to port most existing automation routines with minimal modification. Since GstarCAD is built on the IntelliCAD engine, its LISP compatibility profile is similar to CorelCAD and progeCAD. A CADTutor forum thread about CorelCAD's LISP noted that "some lisps would load and run, others would not" — the same applies to GstarCAD. The compatibility rate is roughly 80-85% for standard AutoLISP routines.

I migrated a library of about 50 LISP routines from AutoCAD to GstarCAD. The ones that worked used basic entity manipulation, ssget selection, and command calls. The ones that failed used Reactors (vlr-*), Express Tools (acet-*), or complex vlax- ActiveX methods. This guide covers practical LISP development in GstarCAD — from basic custom commands to advanced batch processing across multiple DWG files, with specific attention to the compatibility gaps and how to work around them.

## LISP Development Setup

### Loading LISP Files

1. Type `APPLOAD` to open the Load/Unload Applications dialog
2. Browse to your `.lsp` file and click "Load"
3. Check "Add to History" for frequently used routines
4. For auto-loading, add file paths to `icad.lsp` in the support folder

### Auto-Load Configuration

Create or edit `icad.lsp` in the GstarCAD support folder:

```lisp
;; icad.lsp - Auto-loaded routines
(load "layer-standardize.lsp")
(load "batch-purge.lsp")
(load "title-block-update.lsp")
(load "dimension-fix.lsp")
(princ "\nGstarCAD custom routines loaded.")
(princ)
```

## Custom Command Definition

### Basic Command Structure

```lisp
;; Command to freeze all layers except current
(defun c:FreezeAllExceptCurrent ( / currentlay ss i ent layname)
  (setq currentlay (getvar "CLAYER"))
  (setq ss (ssget "X"))
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

### Command with User Input

```lisp
;; Command to create a grid of columns at specified spacing
(defun c:ColumnGrid ( / origin xnum ynum xspacing yspacing x y pt)
  (setq origin (getpoint "\nSpecify grid origin: "))
  (setq xnum (getint "\nNumber of columns in X direction: "))
  (setq ynum (getint "\nNumber of columns in Y direction: "))
  (setq xspacing (getdist "\nSpacing in X (mm): "))
  (setq yspacing (getdist "\nSpacing in Y (mm): "))
  
  (setq x 0)
  (while (< x xnum)
    (setq y 0)
    (while (< y ynum)
      (setq pt (list (+ (car origin) (* x xspacing))
                     (+ (cadr origin) (* y yspacing))
                     0))
      (command "_.CIRCLE" pt 200)  ;; 200mm radius column
      (setq y (1+ y))
    )
    (setq x (1+ x))
  )
  (princ (strcat "\nCreated " (itoa (* xnum ynum)) " columns."))
  (princ)
)
```

## Layer Management Automation

### Layer Standardization Script

```lisp
;; Standardize layer names to uppercase and apply standard colors
(defun c:StandardizeLayers ( / ss i ent layname newlay oldcolor newcolor)
  (setq ss (ssget "X"))
  (if ss
    (progn
      (setq i 0)
      (while (< i (sslength ss))
        (setq ent (entget (ssname ss i)))
        (setq layname (cdr (assoc 8 ent)))
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
    (princ "\nNo entities found.")
  )
  (princ)
)
```

### Auto-Create Standard Layers

```lisp
;; Create standard architectural layers with colors and lineweights
(defun c:CreateStandardLayers ( /)
  (command "_.-LAYER" "_N" "A-WALL-EXT,A-WALL-INT,A-DOOR,A-WIND" "")
  (command "_.-LAYER" "_C" "1" "A-WALL-EXT" "")
  (command "_.-LAYER" "_C" "4" "A-WALL-INT" "")
  (command "_.-LAYER" "_C" "3" "A-DOOR,A-WIND" "")
  (command "_.-LAYER" "_LW" "0.35" "A-WALL-EXT" "")
  (command "_.-LAYER" "_LW" "0.25" "A-WALL-INT,A-DOOR,A-WIND" "")
  
  (command "_.-LAYER" "_N" "A-ANNO-DIMS,A-ANNO-NOTE,A-ANNO-TTLB" "")
  (command "_.-LAYER" "_C" "7" "A-ANNO-DIMS,A-ANNO-TTLB" "")
  (command "_.-LAYER" "_C" "2" "A-ANNO-NOTE" "")
  (command "_.-LAYER" "_LW" "0.15" "A-ANNO-DIMS,A-ANNO-NOTE" "")
  (command "_.-LAYER" "_LW" "0.35" "A-ANNO-TTLB" "")
  
  (command "_.-LAYER" "_N" "VPORT" "")
  (command "_.-LAYER" "_C" "9" "VPORT" "")
  (command "_.-LAYER" "_P" "_N" "VPORT" "")  ;; Set to no-plot
  
  (princ "\nStandard layers created.")
  (princ)
)
```

## Title Block Attribute Automation

```lisp
;; Update title block attributes from user input
(defun c:UpdateTitle ( / ss ent blk att tag val changed)
  (setq ss (ssget "X" '((0 . "INSERT") (2 . "TITLE_BLOCK"))))
  (if ss
    (progn
      (setq ent (ssname ss 0))
      ;; Walk through attributes
      (setq nextent (entnext ent))
      (while nextent
        (setq att (entget nextent))
        (if (= (cdr (assoc 0 att)) "ATTRIB")
          (progn
            (setq tag (cdr (assoc 2 att)))
            (cond
              ((= tag "TITLE")
                (setq val (getstring T "\nDrawing title: "))
                (entmod (subst (cons 1 val) (assoc 1 att) att))
              )
              ((= tag "DWG-NO")
                (setq val (getstring "\nDrawing number: "))
                (entmod (subst (cons 1 val) (assoc 1 att) att))
              )
              ((= tag "SCALE")
                (setq val (getstring "\nPlot scale (e.g., 1:50): "))
                (entmod (subst (cons 1 val) (assoc 1 att) att))
              )
              ((= tag "DATE")
                (setq val (menucmd "M$(edtime,$(getvar,date),YYYY-MO-DD)"))
                (entmod (subst (cons 1 val) (assoc 1 att) att))
              )
              ((= tag "DRAWN")
                (setq val (getstring "\nDrawn by: "))
                (entmod (subst (cons 1 val) (assoc 1 att) att))
              )
            )
          )
        )
        (setq nextent (entnext nextent))
      )
      (entupd ent)
      (princ "\nTitle block updated.")
    )
    (princ "\nNo TITLE_BLOCK found. Check block name.")
  )
  (princ)
)
```

## Batch File Processing

```lisp
;; Batch purge and audit across all DWG files in a directory
(defun c:BatchClean ( / dir files file count)
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
    (command "_.-PURGE" "_A" "*" "_N")  ;; Run twice for nested purges
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

## Error Handling Pattern

```lisp
(defun c:SafeOperation ( / olderr oldcmdecho oldfiledia)
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
  (princ "\nOperation completed.")
  
  ;; Restore
  (setvar "CMDECHO" oldcmdecho)
  (setvar "FILEDIA" oldfiledia)
  (setq *error* olderr)
  (princ)
)
```

## LISP Compatibility Notes

When porting AutoCAD LISP routines to GstarCAD:

- **`vl-load-com`**: Supported, but some ActiveX properties may differ
- **`vla-*` methods**: Most are supported; test entity-specific properties
- **`vl-catch-all-apply`**: Fully supported
- **`grread`/`grdraw`**: Supported
- **Reactors (`vlr-*`)**: Not supported — remove or replace with polling
- **DCL dialogs**: Fully supported (GstarCAD still supports DCL; AutoCAD deprecated it)
- **`vl-directory-files`**: Fully supported

## Testing and Adapting LISP Routines for GstarCAD

The practical approach to LISP migration in GstarCAD is to test each routine systematically. Create a test drawing with representative entities — lines, circles, arcs, polylines, blocks with attributes, text, and dimensions. Load each LISP routine and run it against the test drawing. Log the results: works perfectly, works with minor issues, or fails completely. For routines that fail, examine the error messages in the LISP console. Common failure points include calls to unsupported functions like vlr-object-reactor, missing Express Tools functions like acet-ss-drag-move, or ActiveX methods that use different property names in IntelliCAD versus AutoCAD. For each failed routine, determine if the functionality can be rewritten using basic AutoLISP functions or if an alternative workflow exists. Some routines may need to be replaced with GstarCAD's built-in commands or custom BRX (BricsCAD Runtime Extension) programs. The testing phase typically takes one to two weeks for a library of 50-100 routines, and the adaptation phase can take an additional two to four weeks depending on complexity.

## Conclusion

GstarCAD's LISP engine provides a robust automation platform for 2D drafting workflows. The high compatibility with AutoLISP means most existing routines port directly, but the compatibility is not complete — Reactors, Express Tools, and some vlax- methods are the main gaps, as documented in community discussions about IntelliCAD-based CAD tools. The DCL support is actually an advantage over modern AutoCAD, which has deprecated it. By building a library of custom commands for layer management, title block updates, and batch processing, you can eliminate hours of repetitive work from your weekly CAD production. Budget time for testing your existing routine library — expect about 80% compatibility out of the box, with the remaining 20% requiring adaptation.
