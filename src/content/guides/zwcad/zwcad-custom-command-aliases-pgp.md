---
title: "ZWCAD Custom Command Aliases and PGP File Configuration"
excerpt: "How to customize keyboard shortcuts in ZWCAD using the PGP file — including migration from AutoCAD alias files, conflict resolution, and best practices for team deployment."
category: "workflow"
softwareSlug: "zwcad"
keyword: "zwcad custom command aliases pgp"
slug: "zwcad-custom-command-aliases-pgp"
author: "CADGuide Technical Editorial"
readTime: "8 min read"
date: "2026-07-06"
sources:
  - "https://confluence.zwcad.com/pages/viewpage.action?pageId=110932231"
  - "https://www.zwsoft.com/support/zwcad-base-faq/569"
---

# ZWCAD Custom Command Aliases and PGP File Configuration

Every firm has its own set of command shortcuts. When we moved to ZWCAD, the first thing our drafters asked was "where do I put my aliases?" The good news: ZWCAD uses the same PGP file format as AutoCAD. The bad news: the file location and reload mechanism are different.

## Locating the PGP File

In ZWCAD, the PGP file is named `zwcad.pgp` (not `acad.pgp`). To find its location:

1. Type `(findfile "zwcad.pgp")` at the command line.
2. ZWCAD returns the full path, typically:
   - `%APPDATA%\ZWSOFT\ZWCAD\2026\enu\Support\zwcad.pgp`

You can also access it through the menu: **Tools** → **Customize** → **Edit Program Parameters (acad.pgp)**. Despite the menu label referencing acad.pgp, it opens zwcad.pgp.

## Migrating AutoCAD Aliases

If you have an existing `acad.pgp` file from AutoCAD:

1. Open both `acad.pgp` and `zwcad.pgp` in a text editor.
2. Copy your custom alias lines from acad.pgp (they use the same format: `ALIAS, *COMMAND`).
3. Paste them into zwcad.pgp, replacing or appending to the defaults.
4. Save the file.

The format is identical:

```
L,   *LINE
C,   *CIRCLE
CO,  *COPY
```

ZWCAD also supports the semicolon comment syntax, so you can organize your aliases with section headers:

```
; --- My Custom Aliases ---
FF,  *LAYFRZ
TT,  *LAYTHW
QQ,  *QSAVE
```

## Reloading Aliases Without Restarting

In AutoCAD, you type `REINIT` to reload the PGP file. In ZWCAD, the command is different:

Type `RE-INIT` (with a hyphen) and select **PGP File** from the dialog. Alternatively, the command-line version:

```
RE-INIT
1
```

The `1` selects the PGP option. If `RE-INIT` doesn't work in your version, you can also use the LISP expression:

```lisp
(command "_.reinit" "1")
```

## Resolving Alias Conflicts

ZWCAD's default PGP file has some different aliases than AutoCAD. Common conflicts:

| Alias | AutoCAD Command | ZWCAD Default |
|-------|----------------|---------------|
| `C` | CIRCLE | COPY (in some profiles) |
| `T` | TEXT | MTEXT |
| `A` | ARC | ARRAY |
| `DT` | TEXT | DTEXT |

If your team relies on AutoCAD's alias conventions, search and replace these in `zwcad.pgp` to match. I recommend keeping a master PGP file in a shared network location and deploying it to all workstations.

## Deploying PGP Changes Across a Team

For office-wide deployment:

1. Create a master `zwcad.pgp` file on a network share (e.g., `\\server\cad-standards\zwcad.pgp`).
2. On each workstation, add the network path to ZWCAD's support file search path:
   - Type `OPTIONS` → **Files** tab → **Support File Search Path**.
   - Click **Add** and enter the network folder path.
   - Move it to the top of the list so the network PGP takes precedence.
3. Delete or rename the local `zwcad.pgp` to avoid confusion.

This way, when you update the master PGP file, all users pick up the changes after a `RE-INIT` — no need to touch each machine.

## Creating Aliases for LISP Routines

You can also use the PGP file to create shortcuts for LISP commands. If you have a LISP routine that defines a function called `c:MYLAYER`:

```
ML, *MYLAYER
```

Now typing `ML` runs your custom LISP layer manager. This works identically to AutoCAD — the PGP file simply maps the alias to the command name, and ZWCAD resolves it at runtime.
