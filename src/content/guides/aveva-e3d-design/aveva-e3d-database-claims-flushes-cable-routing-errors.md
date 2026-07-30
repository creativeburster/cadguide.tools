---
title: "AVEVA E3D Design Database Concurrency: Claims, Flushes, Extract Hierarchy, and Cable Routing Error Codes"
excerpt: "AVEVA E3D's multi-user database uses a claim/flush/extract hierarchy that can stall when name clashes or deleted elements block flushes. We cover the 12 most common claim/flush failure reasons, cable routing error codes 125-26 through 125-36, and model limitations for large DGN imports."
category: "data-management"
softwareSlug: "aveva-e3d-design"
keyword: "AVEVA E3D database claim flush extract failure cable routing error 125 name clash stall"
slug: "aveva-e3d-database-claims-flushes-cable-routing-errors"
author: "CADGuide Tools Editorial Team"
readTime: "11 min"
date: "2025-07-30"
sources:
  - "https://docs.aveva.com/bundle/e3d-design/page/874670.html"
  - "https://docs.aveva.com/bundle/e3d-design/page/1048072.html"
  - "https://docs.aveva.com/bundle/e3d-design-ue/page/938046.html"
---

# AVEVA E3D Design Database Concurrency: Claims, Flushes, Extract Hierarchy, and Cable Routing Error Codes

AVEVA E3D Design uses a hierarchical database with claim/flush/extract mechanisms for multi-user concurrency. When these mechanisms fail, work stalls until the issue is resolved. This guide covers the 12 most common claim/flush failure reasons, cable routing layout errors, and model size limitations that cause performance degradation.

## The Claim/Flush/Extract System

### How It Works

- **Extract**: A user creates a child extract from the parent database, bringing a subset of elements into their working session
- **Claim**: Before modifying an element, the user must claim it from the owning extract
- **Flush**: After modifications are complete, the user flushes changes back to the parent database
- **Savework**: Saves modifications to the current extract before flushing

### The Stall Problem

If a flush fails (e.g., due to a name clash), **all subsequent flushes will stall** with the message "Previous flush failed" until the failed flush has been reset. This is the single most common cause of work stoppage in AVEVA E3D.

Claims are treated as **failing unless all elements have been claimed**. If 10 claims succeed and 1 fails, the entire Claim command is treated as failed. The Extract Control form in DESIGN, DRAFT, and other modules contains more detailed reporting.

## 12 Common Claim/Flush Failure Reasons

### 1. Expunged Daemon

**Message**: "Unable to savework. Perhaps you have been Expunged" / "Daemon has been expunged. Modifications to database (other than updates) will fail."

**Cause**: The user's database daemon has been expunged by an administrator or system process. No modifications can be made until the daemon is restored.

### 2. Flush Overtaken Another Flush

**Message**: "Flush may have overtaken another flush. Previous flush could not be found."

**Cause**: Two flushes were processed out of order. The system cannot match the current flush against its predecessor.

### 3. Previous Flush Failed

**Message**: "Previous flush failed. Subsequent flushes will fail until failed flush has been reset."

**Cause**: A name clash or other error blocked an earlier flush. All subsequent flushes are blocked.

**Fix**: Reset the failed flush before attempting new flushes.

### 4. Element Already Claimed

**Message**: "Unable to claim because element is already claimed from Extract."

**Cause**: Another extract or user has the element claimed. This is a **valid failure** — the system is correctly preventing concurrent modification.

**Fix**: Wait for the other user to release the claim, or contact them to coordinate.

### 5. Element Modified in Later Session

**Message**: "Unable to claim from parent extract because element is modified in a later session."

**Cause**: The element has been modified in a session that is more recent than the current extract's view of the parent.

**Fix**: Run **EXTRACT REFRESH** to bring the child extract's view of the parent up to date.

### 6. All Claims Failed in Owning Extract

**Message**: "Nothing to claim locally — all claims failed in owning extract."

**Cause**: The owning extract itself could not claim the elements from its parent, so the child extract cannot claim them either.

### 7. Cannot Claim Without Parent Extract Claim

**Message**: "Cannot claim to child extract, because failed to claim anything from its parent. You cannot claim without doing an extract claim from the parent extract."

**Cause**: The claim hierarchy requires claiming from the parent first. Bypassing the parent is not allowed.

### 8. Element Deleted in Later Session

**Message**: "Unable to claim from parent extract as element has been deleted in a later session."

**Cause**: The element no longer exists in the parent — it was deleted in a more recent session that the child extract hasn't seen.

**Fix**: Run EXTRACT REFRESH. The deleted element will no longer appear in the extract.

### 9. Element Modified, Must Savework First

**Message**: "Element has been modified, so cannot be released. Savework must be done first."

**Cause**: Attempting to release an element that has unsaved modifications.

**Fix**: Run savework before attempting to release or abandon the element.

### 10. Name Clash

**Message**: "Name clash on [name]. Please rename."

**Cause**: An element with the same name already exists in the target database. This is the most common cause of flush failures.

**Fix**: Rename the element in the extract, then re-attempt the flush.

### 11. Cannot Flush Without Owner or Members

**Messages**: "Cannot flush/abandon as old and new owners must both be in the list, or neither in the list" / "Cannot flush/abandon without its owner" / "Cannot flush/abandon without its members."

**Cause**: The element has been moved or its member list has changed. Both the element and its owner (or members) must be flushed together.

**Fix**: Select the element along with its owner and members, then flush them as a group.

### 12. Element Claimed Out

**Message**: "Cannot abandon/release. Element is claimed out by a user (maybe yourself) or to an extract."

**Cause**: The element is still claimed — possibly by the same user doing the abandon/release.

**Fix**: Release the claim first, then abandon.

## Cable Routing Layout Error Codes

AVEVA E3D's cable routing module generates structured error codes when layout fails. Each error code identifies a specific routing constraint violation.

| Error Code | Error Name | Meaning |
|------------|-----------|---------|
| 125, 26 | No Space | Insufficient space in the routing volume (cableway branch) to lay the cable |
| 125, 27 | Invalid Radius | Cable bend radius would be less than minimum bend radius |
| 125, 28 | Invalid Element | Element is not a routing object (e.g., trying to lay cable on Equipment) |
| 125, 29 | Maxlay Reached | Exceeded maximum layers (3) on the branch — cables stacked beyond limit |
| 125, 30 | Can Not Be Touching | Two cables that are prohibited from touching would touch |
| 125, 31 | Can Not Stack Bigger Cable | Larger cable placed on top of smaller cable — not allowed |
| 125, 32 | Layer Not Aligned | Stack cable centers are not aligned correctly |
| 125, 33 | Not Tried | Layout process could not begin |
| 125, 34 | First Layer Not At Bottom | First cable layer is not at the bottom of the routing volume |
| 125, 36 | Segment Not Found | Branch does not have a matching ICLASS segment for the cable |

### Common Cable Routing Fixes

- **No Space (125, 26)**: Increase cableway width, reduce cable count, or reroute via alternate branches
- **Invalid Radius (125, 27)**: Increase the bend radius of the cableway or use a cable with smaller minimum bend radius
- **Maxlay Reached (125, 29)**: Increase the maximum layer count for the branch or use a wider cableway
- **Segment Not Found (125, 36)**: Add the correct ICLASS segment to the branch or change the cable's ICLASS

## Model Limitations and Performance

### DGN Import Limitations

- **Attribute data** from `.drv` files is **not transferred** to the Design database
- DGN data cannot be thoroughly clash-checked within itself unless a separate Equipment (EQUI), Volume (VOLM), or Structure (STRU) is created for each primitive
- Large DGN imports generate enormous data volumes for both E3D Design and Review

### Primitive Count Limits

- **Hard limit**: 4096 primitives per significant element (Equipment, Volume, Structure, Polyhedron)
- **Practical limit**: Performance severely degrades with more than **500 primitives** per element
- **Fix**: Use the **GROUPP** command to limit the number of primitives grouped under a single element

### Macro Performance

When running large design macros:
- Read large macros in **dev tty mode**
- Run **TRACE OFF** command before executing the design macro
- This prevents trace output from overwhelming the system during large batch operations

## Detected Geometry Errors

The E3D Design model checker identifies structural errors:

| Error | Auto-Fix |
|-------|----------|
| PNODE elements unconnected to wall/column/beam | Delete via **Tidy** |
| CMPF/CMFI elements without specification references | Delete via **Tidy** |
| SBFR/CWALL/CFLOOR/CSCREED elements without components | Delete via **Tidy** |
| FLOOR/SCREED with incorrect LEVEL attribute | Fix via **Modify** (values 1-20) |
| Elements owned by FRMW that should be under CWALL/CFLOOR/CSCREED/SBFR | Reassign via **Modify** |
| SBFI/FIXING with both catalogue reference and TMPL element | Unset specification reference via **Modify** |
| SBFI/FIXING with RULE property evaluating to false | Navigate to each sub-component to discover why |
