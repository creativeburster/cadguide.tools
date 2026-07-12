---
title: "ZW3D 2025 SP2 Crashes When Closing Multiple Views: Diagnosis and Workaround"
excerpt: "ZW3D 2025 SP2 has a confirmed crash bug when closing one of several opened part or assembly windows. A forum user reports 100% reproducibility. The workaround: downgrade to SP1 or upgrade to ZW3D 2026."
category: "troubleshooting"
softwareSlug: "zw3d"
keyword: "zw3d 2025 crash closing views sp2 fix"
slug: "zw3d-2025-sp2-crash-closing-views-workaround"
author: "CADGuide Technical Editorial"
readTime: "6 min read"
date: "2026-07-12"
sources:
  - "https://zw3dforum.com/t/zw3d-crash-when-closing-one-of-several-opened-views/1989"
  - "https://confluence.zwcad.com/pages/viewpage.action?pageId=130417657"
---

# ZW3D 2025 SP2 Crashes When Closing Multiple Views: Diagnosis and Workaround

A user on the ZW3D Forum (user phovland) reported a crash bug in ZW3D 2025 SP2 that is 100% reproducible: when several windows are open with parts or assemblies, closing one of them causes ZW3D to crash. The same crash occurs when printing a drawing. The user's sales representative attributed it to a memory error, which the user disputed.

## The Bug

**Affected version**: ZW3D 2025 SP2

**Symptoms**:
- Multiple part or assembly windows open simultaneously
- Closing one window causes ZW3D to crash to desktop
- Printing a drawing triggers the same crash
- 100% reproducible on the reporting user's notebook

**Reporting user's hardware**: Intel Core i7-8700 @ 3.20GHz, Intel 630 integrated graphics, 32 GB RAM, Windows 11 Home.

## Confirmation from Other Users

Another forum user (fudge3d) confirmed the same crash behavior, noting that it also occurs on their system despite having a Quadro dedicated graphics card and Windows 10 Pro. This rules out the hypothesis that the crash is caused by integrated graphics or Windows Home edition.

Fudge3d also reported that ZW3D 2026 is "definitely much more stable," suggesting the bug was fixed in the 2026 release.

## Workarounds

### Workaround 1: Downgrade to ZW3D 2025 SP1

The original reporting user (phovland) confirmed that uninstalling ZW3D 2025 SP2 and installing ZW3D 2025 SP1 resolved the crash. This indicates the bug was introduced in SP2.

Forum user Cowboy99 noted that this isn't an ideal solution, but it works.

**Steps**:
1. Uninstall ZW3D 2025 SP2 via Windows Settings → Apps
2. Download ZW3D 2025 SP1 from the ZWSOFT support portal
3. Install SP1
4. Verify the crash no longer occurs by opening multiple windows and closing one

### Workaround 2: Upgrade to ZW3D 2026

Based on fudge3d's confirmation that ZW3D 2026 is more stable, upgrading to the 2026 release is the recommended long-term fix. ZW3D 2026 includes stability improvements and the crash-on-close bug appears to be resolved.

### Workaround 3: Avoid the Trigger

If downgrading or upgrading isn't immediately possible:
- Work with only one window open at a time
- Save before closing any window
- Use File → Close All instead of closing individual windows (some users report this avoids the crash, though it's not confirmed)

## Gathering Crash Reports for ZWSOFT Support

If you need to report this or other crashes to ZWSOFT support, the official crash report location is documented on ZWSOFT's Confluence knowledge base:

- **Crash reports**: Navigate to the ZWSOFT folder → `ZW3D\ZW3DCrashReport\BugReport`
- **Log files**: Navigate to the ZWSOFT folder → `ZW3D\ZW3D2024\output\logs` (adjust version number as needed)

Include these files when contacting ZWSOFT support at `support@zwsoft.com` to help them diagnose the issue.

## Is This a GPU Issue?

The initial response from the ZWSOFT sales representative suggested a memory error. Another forum user (Petros) suggested upgrading to a dedicated GPU with 8 GB VRAM. However, the crash was confirmed by a user with a Quadro card, which rules out integrated graphics as the sole cause.

The crash is most likely a software bug in SP2's window management or graphics context handling, not a hardware issue. The fact that SP1 doesn't exhibit the crash confirms this.

## Related Stability Issues in ZW3D 2025

The ZW3D Forum has other reports of ZW3D 2025 stability issues, including NURBS curve corruption alerts in assemblies. If you're experiencing multiple stability problems on 2025 SP2, the downgrade to SP1 or upgrade to 2026 is the recommended path.
