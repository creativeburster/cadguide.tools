---
title: "Tekla Structures Multi-User Model Slow: Saving, Locking, and Database Synchronization Fixes"
excerpt: "Tekla multi-user models slow to a crawl during saving and synchronization, with database locking conflicts causing freezes. We cover the multi-user server optimization, autosave configuration, and the xs_progress_cache setting that fixes multi-user performance."
category: "troubleshooting"
softwareSlug: "tekla-structures"
keyword: "Tekla Structures multi-user slow saving locking database synchronization"
slug: "tekla-multi-user-slow-saving-locking-synchronization-fix"
author: "CADGuide Tools Editorial Team"
readTime: "8 min"
date: "2025-06-24"
sources:
  - "https://support.tekla.com/article/tekla-structures-performance-issues"
  - "https://support.tekla.com/doc/tekla-structures/2025/sys_modeling_tips_for_large_models"
---

# Tekla Structures Multi-User Model Slow: Saving, Locking, and Database Synchronization Fixes

Trimble's performance documentation includes specific guidance for multi-user modeling: "Speeding up the multi user modeling and saving." Multi-user mode in Tekla Structures allows multiple users to work on the same model simultaneously, but it introduces database synchronization overhead that can cause significant slowdowns. Users report that saving takes minutes instead of seconds, and the model freezes periodically when another user saves.

## Understanding Multi-User Architecture

### How Multi-User Mode Works

In multi-user mode, Tekla uses a client-server architecture:

1. The **model server** (Tekla Multi-User Server) hosts the master model database
2. Each **client** (user) has a local copy of the model
3. When a user saves, their changes are sent to the server
4. The server updates the master database and notifies other users
5. Other users must synchronize to get the latest changes

The bottleneck is step 3-4: when one user saves, the server must process the changes and update the database. If the database is large or the network is slow, this can take minutes. During this time, other users may experience freezes.

### Common Multi-User Problems

- **Saving takes 2-10 minutes** instead of seconds
- **Model freezes periodically** when another user saves
- **"Database is locked" errors** when multiple users save simultaneously
- **Changes not visible** to other users until they synchronize
- **Model corruption** after simultaneous saves

## Fix 1: Optimize the Multi-User Server

### Use a Dedicated Server Machine

1. Don't run the multi-user server on a user's workstation
2. Use a dedicated server machine with:
   - Fast CPU (multi-core for handling multiple clients)
   - SSD storage (for fast database access)
   - Gigabit network connection
3. The server should be on the same LAN as all users

### Update the Multi-User Server

1. Download the latest Tekla Multi-User Server from Tekla Downloads
2. The latest version includes performance improvements and bug fixes
3. Stop the server service before updating
4. Install the new version
5. Restart the server service

### Configure Server Settings

1. On the server, open the Multi-User Server configuration
2. Set **Maximum connections** to the number of users + 2 (for overhead)
3. Set **Database cache size** to at least 512MB
4. Enable **Compression** for network transfers
5. These settings reduce save time and network overhead

## Fix 2: Configure Autosave Intervals

Trimble recommends using autosave: "Use the Autosave option in Tekla Structures to automatically back up your work at set intervals."

1. Go to **File → Settings → Options → General Settings → Autosave**
2. Set **Autosave interval** to 15-30 minutes
3. Don't set it too short (e.g., 5 minutes) — each autosave triggers a database operation
4. Set **Autosave file location** to a local drive (not network)
5. Autosave creates a backup file without locking the multi-user database

### Why Autosave Matters

- If the model freezes or crashes, autosave preserves your work
- Autosave doesn't trigger multi-user synchronization — it's a local backup
- You can recover from autosave: **File → Open → Autosave File**

## Fix 3: Save Efficiently in Multi-User Mode

### Save at Natural Break Points

1. Don't save frequently during active modeling — each save locks the database
2. Save at natural break points:
   - After completing a group of parts
   - Before switching to a different area of the model
   - Before running numbering
   - Before creating drawings
3. This reduces the number of database locks

### Close Views Before Saving

Trimble recommends: "Close all views when saving large models."

1. Before saving, close all views: **View → Close All Views**
2. Open views consume memory and must be processed during save
3. Saving with no open views is significantly faster
4. Reopen views after saving

### Save in Batches

1. If you've made many changes, save in batches:
   - Save changes to one area of the model
   - Wait for the save to complete
   - Make changes to the next area
   - Save again
2. This prevents one massive save operation that locks the database for a long time

## Fix 4: Synchronize Efficiently

### Manual Synchronization

1. Instead of automatic synchronization, use manual sync
2. Go to **File → Synchronize**
3. Choose what to synchronize:
   - **Changes from others**: Get other users' changes
   - **Our changes to server**: Send your changes to the server
4. Synchronize at natural break points, not during active modeling

### Synchronize Before Numbering

1. Always synchronize before running numbering
2. This ensures you're numbering against the latest model state
3. It prevents numbering conflicts when multiple users are numbering simultaneously

## Fix 5: Use the XS_PROGRESS_CACHE Setting

1. Go to **File → Settings → Advanced Options**
2. Search for `XS_PROGRESS_CACHE`
3. Set to `TRUE`
4. This caches progress data locally, reducing database queries
5. Restart Tekla Structures

### Impact

- Reduces the number of database queries during modeling
- Speeds up selection and modification operations
- Especially helpful for models with many users (5+)

## Fix 6: Reduce Model Size for Multi-User

### Split the Model

1. If the model is too large for multi-user, split it by area:
   - Area A model (user 1)
   - Area B model (user 2)
   - Area C model (user 3)
2. Use reference models to coordinate between areas
3. Each model is smaller and faster to save

### Use Phases

1. Assign parts to phases
2. Each user works on a different phase
3. Users can filter their views to show only their phase
4. This reduces the number of parts each user processes during save

## Fix 7: Fix Database Locking Issues

### "Database is Locked" Error

1. This occurs when multiple users try to save simultaneously
2. Wait for the other user's save to complete, then try again
3. If the error persists:
   - Close all views
   - Wait 30 seconds
   - Try saving again
4. If the lock doesn't release:
   - On the server, check the Multi-User Server admin tool
   - Look for locked database entries
   - Release the lock manually
   - Have the affected user restart Tekla

### Prevent Locking

1. Stagger save times among users
2. Communicate with team members before saving large changes
3. Use a simple signaling system (e.g., chat message) before saving

## Fix 8: Network Optimization

### Check Network Speed

1. Run a network speed test between clients and server
2. **Minimum**: 100 Mbps for 2-3 users
3. **Recommended**: 1 Gbps for 5+ users
4. Use wired connections — Wi-Fi adds latency and packet loss

### Reduce Network Latency

1. Ensure the server is on the same LAN (not across a WAN or VPN)
2. If users are in different locations, use Citrix or Remote Desktop instead of multi-user mode
3. VPN connections add latency that makes multi-user mode unusable

## Fix 9: Regular Database Repair

1. When all users have saved and synchronized, have one user repair the database
2. All other users must close Tekla during repair
3. Go to **File → Tools → Repair Model Database**
4. This optimizes the multi-user database for faster operations
5. Run weekly for active multi-user projects

## Summary

| Fix | Impact | Difficulty |
|-----|--------|------------|
| Use dedicated server | Very high | Medium |
| Update multi-user server | High | Easy |
| Configure autosave | Medium | Easy |
| Close views before saving | High | Easy |
| Save at break points | High | Easy |
| Manual synchronization | High | Easy |
| Enable XS_PROGRESS_CACHE | Medium | Easy |
| Split model by area | High | Medium |
| Fix database locking | High | Medium |
| Network optimization | High | Medium |
| Regular database repair | High | Easy |

The most impactful fix is using a dedicated server machine with SSD storage and a gigabit network connection. Combined with closing views before saving and staggering save times among users, this can reduce save time from minutes to seconds. For very large projects with 5+ users, splitting the model by area and using reference models for coordination is the most effective long-term strategy.
