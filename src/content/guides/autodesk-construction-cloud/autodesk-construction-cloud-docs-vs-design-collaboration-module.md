---
title: "ACC Docs vs Design Collaboration: Choosing the Right Module for Your BIM Workflow"
excerpt: "Comparison of ACC Docs and Design Collaboration modules — when to use each, how they interact, and common mistakes teams make when using the wrong module for Revit model sharing and document control."
category: "comparison"
softwareSlug: "autodesk-construction-cloud"
keyword: "autodesk construction cloud docs vs design collaboration module"
slug: "autodesk-construction-cloud-docs-vs-design-collaboration-module"
author: "CADGuide Technical Editorial"
readTime: "10 min read"
date: "2026-07-08"
sources:
  - "https://forums.autodesk.com/t5/bim-360-support-forum/bim360-best-practice-setups/td-p/10806318"
  - "https://forums.autodesk.com/t5/bim-360-support-forum/construction-cloud/td-p/11881543"
---

# ACC Docs vs Design Collaboration: Choosing the Right Module for Your BIM Workflow

I've seen teams use ACC Docs when they should have used Design Collaboration, and vice versa. The result is always the same — broken workflows, outdated models, and frustrated teams. The modules look similar on the surface, but they serve fundamentally different purposes. Here's how to choose the right one.

## What Each Module Does

**ACC Docs**: Document management and version control. Think of it as a cloud-based file server with versioning, permissions, and markup capabilities. It handles any file type — Revit, CAD, PDF, Word, Excel.

**ACC Design Collaboration**: Revit-specific model sharing between disciplines. It automates the publish-consume workflow so teams always have the latest models from other disciplines. It includes model comparison, change visualization, and shared views.

## When to Use ACC Docs

Use Docs for:

- **Non-Revit files** — CAD drawings, PDFs, specifications, contracts
- **Reference documents** — codes, standards, vendor datasheets
- **Revit models that don't need cross-discipline sharing** — e.g., a single-discipline team working on one model
- **Shop drawings and submittals** — construction documents that need review and approval workflows
- **As-built documentation** — final record drawings

### Docs Key Features

- **Version control** — every upload creates a new version; previous versions are retained
- **Markup and review** — add comments, redlines, and approval stamps to PDFs and drawings
- **Folder permissions** — granular access control per folder
- **Custom document properties** — metadata like document number, discipline, status
- **Approval workflows** — route documents for review and sign-off

### Docs Limitations

- No automated model sharing between disciplines
- No model comparison or change visualization
- No federated model view
- Revit models in Docs are just files — no special Revit integration beyond Desktop Connector access

## When to Use Design Collaboration

Use Design Collaboration for:

- **Multi-discipline Revit projects** — Architecture, Structural, and MEP teams sharing models
- **Automated model publishing** — when you want models to auto-publish on sync
- **Cross-team model consumption** — when teams need to link other disciplines' models
- **Model change tracking** — visualizing what changed between model versions
- **Coordination meetings** — reviewing federated models with the team

### Design Collaboration Key Features

- **Workspaces** — each discipline has its own workspace for publishing and consuming models
- **Automated publishing** — Revit models auto-publish to the shared folder on sync
- **Model comparison** — visual diff between model versions (added, removed, modified elements)
- **Shared views** — create saved viewpoints for coordination meetings
- **Consumption tracking** — see which teams have consumed your latest model

### Design Collaboration Limitations

- Only works with Revit models — no CAD, PDF, or other file types
- Requires Revit 2019 or later with cloud worksharing enabled
- No document approval workflows
- No markup or redline capabilities for non-model files

## How They Work Together

In a typical BIM project, you use both modules:

1. **Docs** stores all project documents — contracts, specifications, CAD drawings, reference files
2. **Design Collaboration** handles Revit model sharing between disciplines
3. **Model Coordination** (separate module) uses models from Design Collaboration for clash detection

### The Workflow

1. The Architecture team works in their Revit model (cloud worksharing enabled).
2. They sync changes to the ACC central model.
3. They publish their model to the Architecture workspace in Design Collaboration.
4. The Structural team consumes the Architecture model in their workspace.
5. The Structural team links the Architecture model in Revit for reference.
6. All models are available in Model Coordination for clash detection.
7. All non-model documents are stored in Docs with proper version control.

## Common Mistakes

### Mistake #1: Using Docs for Revit Model Sharing

A team stores their Revit model in a Docs folder and asks other teams to download it manually and link it in Revit. This works, but:

- No automatic updates — other teams don't know when a new version is available
- No model comparison — can't see what changed between versions
- Manual download required — each team downloads the entire model every time
- No consumption tracking — the publishing team doesn't know who's using their model

**Fix**: Move Revit models to Design Collaboration workspaces.

### Mistake #2: Using Design Collaboration for Non-Revit Files

A team tries to store PDF drawings in Design Collaboration. Design Collaboration only supports Revit models.

**Fix**: Use Docs for all non-Revit files.

### Mistake #3: Not Publishing Models

The team syncs their Revit model but never publishes it. Other teams in Design Collaboration see the old published version, not the synced version. This causes confusion — "I synced, why don't they see my changes?"

**Fix**: Train the team on the difference between sync (team-internal) and publish (cross-team sharing). Set a weekly publish schedule.

### Mistake #4: Giving Contractors Design Collaboration Access

Contractors don't need Design Collaboration — they need to view models, not edit them. Giving them Design Collaboration access can lead to accidental model modifications.

**Fix**: Give contractors Viewer access in Docs (for drawings) and access to Model Coordination (for clash review). Don't give them Design Collaboration access unless they're actively modeling.

## Pricing Considerations

- **Docs** is included in most ACC subscriptions
- **Design Collaboration** requires an additional license (Design Collaboration add-on or AEC Collection)
- **Model Coordination** also requires an additional license

If budget is tight, you can use Docs only and manage model sharing manually. But for any multi-discipline project, Design Collaboration pays for itself in time saved within the first month.

## My Recommendation

For any project with more than one discipline working in Revit:

1. **Start with Docs** for document management
2. **Add Design Collaboration** for Revit model sharing
3. **Add Model Coordination** for clash detection

For single-discipline projects or projects where Revit isn't used:

1. **Docs only** is sufficient

Don't try to force one module to do the other's job. Use each for its intended purpose and your BIM workflow will run smoothly.
