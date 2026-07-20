---
title: "Fusion 360 Files Missing After Update: Hub Migration, Single User Storage, and Cache Recovery"
excerpt: "After a Fusion 360 update or reinstall, your designs show '??' errors or disappear entirely. We cover the Hub migration fix, Single User Storage transfer, and local cache recovery that get your files back."
category: "troubleshooting"
softwareSlug: "fusion-360"
keyword: "Fusion 360 files missing after update hub migration"
slug: "fusion-360-files-missing-hub-migration-cache-recovery"
author: "CADGuide Tools Editorial Team"
readTime: "9 min"
date: "2025-06-22"
sources:
  - "https://forums.autodesk.com/t5/fusion-support-forum/all-of-my-files-are-missing/td-p/14100626"
  - "https://forums.autodesk.com/t5/fusion-support/fusion-360-stuck-offline-with-files-inaccessible/td-p/12181838"
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Lost-access-to-a-project-or-design-in-Fusion-360.html"
  - "https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Projects-Missing-from-Fusion-360.html"
---

# Fusion 360 Files Missing After Update: Hub Migration, Single User Storage, and Cache Recovery

A user on the Autodesk Community forum reported that after installing Fusion 360 on a new computer, all their files were missing. The files showed up in the "editable documents" list but gave "??" errors when trying to open them. After research, they discovered their files were stuck in "Single User Storage" and hadn't been transferred to the Fusion Hub. Another user reported that after updating to the Apple Silicon version of Fusion, the cloud stopped working with "Working Offline, Outage Detected" errors, and their files became inaccessible — stuck in the job status with blank progress bars. A third user lost access to project data files after reinstalling Fusion on a new macOS user account.

These are the three most common "missing files" scenarios in Fusion 360, and each has a different root cause and recovery path.

## Problem 1: Files Stuck in Single User Storage

Before Fusion 360 moved fully to Hub-based storage, designs were stored in "Single User Storage." When Autodesk migrated to Hub storage, some users' files weren't automatically transferred. These files appear in the "editable documents" list but show "??" errors when opened.

### Diagnosis

1. Open Fusion 360
2. Check the Data Panel — if files show "??" or fail to open, you may have Single User Storage files
3. Check the Hub selector (top-left of Data Panel) — you may have a Personal Hub that's inactive

### Fix: Contact Autodesk Content Storage Team

The forum solution was clear:

1. Send an email to `fusion.contentstorage@autodesk.com` (note: dot, not underscore)
2. Include:
   - Your Autodesk account email
   - Reference to the forum thread or a description of the issue
   - Mention that your hub is inactive or files are in Single User Storage
3. The Autodesk team will migrate your files to the new Hub
4. This typically takes 1-3 business days

The forum user confirmed: "The files have been migrated to the new hub! Thank you for your help!"

### Preventive Measure

After migration, verify all files are accessible:

1. Open each project in the Data Panel
2. Open each design to confirm it loads
3. Check the Fusion Team Hub on the web: `https://myhub.autodesk360.com`
4. Ensure all projects appear in the web hub

## Problem 2: Stuck Offline with "Outage Detected"

The user on Apple Silicon reported: "Working Offline, Outage Detected" with files stuck in the job status, showing file names but blank progress bars. Network diagnostic tests showed everything passed, but Fusion still said it was offline.

### Root Cause: Authentication Service Blocked

The Autodesk support response identified the cause: "The logs show that we are not able to connect to authenticate the account and hence it keeps throwing you in the offline mode." The specific error was "Curl error 7" — meaning a firewall or proxy was blocking outbound requests from `AdskIdentityManager.exe`.

### Fix 1: Log In Via Web First

1. Open `https://login.autodesk360.com/login` in your web browser
2. Sign in with your Autodesk account
3. Pick a design and select **Open in Desktop**
4. This may trigger Fusion to authenticate and switch to online mode

### Fix 2: Reset Fusion

1. Launch the **Fusion 360 Service Utility**
2. Click **Reset** — this clears authentication tokens and forces a fresh login
3. Restart Fusion and sign in again

### Fix 3: Check Firewall and Proxy

1. Allow `AdskIdentityManager.exe` through your firewall
2. Allow `Fusion360.exe` through your firewall
3. If using a corporate proxy, configure proxy settings in Fusion:
   - **Preferences → General → Network**
   - Enter proxy server address and port
4. Try connecting from a mobile hotspot to rule out network-specific issues

### Fix 4: Add to Offline Cache Workaround

1. In the Data Panel, right-click a design → **Add to Offline Cache**
2. Switch Fusion to **Offline Mode**
3. Make a small change and save
4. Switch back to **Online Mode**
5. The change should upload to the cloud, and the design should become accessible

This workaround forces Fusion to create a local copy and then sync it back, which can jumpstart the cloud connection.

## Problem 3: Files Missing After Reinstall

The user who created a new macOS account and reinstalled Fusion reported that project files appeared in the project list but gave "unexpected problems downloading the file" errors when opened. The web version worked fine, and another computer could access the files.

### Root Cause: Corrupted Local Cache

When Fusion is reinstalled or a new user account is created, the local cache is empty. If the cache initialization fails or partial data is left from a previous installation, Fusion can't download designs from the cloud.

### Fix 1: Clear the Local Cache

1. Close Fusion 360
2. Navigate to the cache directory:
   - Windows: `C:\Users\<username>\AppData\Local\Autodesk\webdeploy\Production\`
   - Mac: `~/Library/Application Support/Autodesk/Autodesk Fusion 360/`
3. Find the alphanumeric directories (there may be multiple if different accounts have been used)
4. Move all contents to a backup folder
5. Restart Fusion — it will create a fresh cache and download designs from the cloud

### Fix 2: Check for Multiple Accounts

The Autodesk support article notes: "Every Fusion 360 account is associated with a unique alphanumeric named directory." If multiple alphanumeric folders exist, multiple email addresses have been used on that computer.

1. Check the directories in the cache folder
2. Each alphanumeric folder corresponds to a different Autodesk account
3. Sign out of Fusion and sign in with the email address associated with the missing files
4. To determine which email is associated with which folder:
   - Sign in with each email you've used
   - Check which alphanumeric folder gets updated (modification time changes)

### Fix 3: Check the Archived Tab

1. Open the Fusion Team Hub on the web: `https://myhub.autodesk360.com`
2. Sign in with your Fusion account
3. Click the **Profile icon** in the top-right corner
4. Select the correct hub with the admin role
5. Navigate to the **ARCHIVED** tab
6. If missing projects are there, hover over them and click **Restore**

### Fix 4: Check Trash in the Hub

1. In the Fusion Team Hub on the web
2. Navigate to the **Trash** folder
3. Look for accidentally deleted files
4. Select files and click **Restore**

### Fix 5: Recovery Files

Fusion 360 automatically creates recovery files:

1. Check the recovery directory:
   - Windows: `C:\Users\<username>\AppData\Local\Autodesk\webdeploy\Production\<version>\Recovery\`
   - Mac: `~/Library/Application Support/Autodesk/Autodesk Fusion 360/Recovery/`
2. Look for `.f3d` files with recent timestamps
3. Import these files into Fusion via **File → Open**

## Problem 4: Files Missing on a New Computer

When you install Fusion on a new computer, your designs should appear in the Data Panel after signing in. If they don't:

### Fix 1: Check Hub Selection

1. In the Data Panel, click the **Hub selector** (top-left)
2. Switch between available hubs (Personal, Team, etc.)
3. Your files may be in a different hub than the one currently selected

### Fix 2: Check Email Address

1. Verify you're signed in with the same email used on the old computer
2. If your email address was changed in your Autodesk Account, your files may be under the old email
3. Sign out and sign in with the old email address

### Fix 3: Wait for Sync

1. After signing in on a new computer, Fusion needs to sync the Data Panel
2. This can take 5-15 minutes depending on the number of projects
3. Click the **refresh button** at the top of the Data Panel to force a sync

## Summary

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| Files show "??" errors | Single User Storage not migrated | Email fusion.contentstorage@autodesk.com |
| Stuck offline, "Outage Detected" | Authentication blocked by firewall | Log in via web, reset Fusion, check firewall |
| Files missing after reinstall | Corrupted local cache | Clear cache, check for multiple accounts |
| Files missing on new computer | Wrong hub or email | Check hub selector, verify email, wait for sync |
| Accidentally deleted files | User deletion | Check Trash and Archived tabs in web hub |

The most important lesson: Fusion 360 stores your files in the cloud, but the local cache can cause access problems. If files are missing, always check the web hub first (`https://myhub.autodesk360.com`) — if files are visible there, the issue is local (cache, authentication, or network). If files are missing from the web hub too, contact Autodesk support immediately.
