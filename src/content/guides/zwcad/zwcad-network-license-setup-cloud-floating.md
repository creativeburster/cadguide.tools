---
title: "ZWCAD Network License Setup with ZWCAD Cloud Floating"
excerpt: "Step-by-step guide to configuring ZWCAD network floating licenses using the ZWCAD Cloud License Manager — covering server installation, client configuration, and troubleshooting borrow and return issues."
category: "deployment"
softwareSlug: "zwcad"
keyword: "zwcad network license floating setup"
slug: "zwcad-network-license-setup-cloud-floating"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-07-06"
sources:
  - "https://www.zwsoft.com/support/zwcad-instruction-installation/deploy-zwcad-network-license"
  - "https://confluence.zwcad.com/pages/viewpage.action?pageId=284951443"
---

# ZWCAD Network License Setup with ZWCAD Cloud Floating

I deployed ZWCAD network licenses across a 40-seat office last year. The cloud-based floating license system is simpler than Autodesk's FlexLM, but it has quirks that will trip you up if you don't plan ahead. Here's the complete setup guide based on what I learned.

## How ZWCAD Network Licensing Works

Unlike AutoCAD's FlexLM (which requires a dedicated license server daemon), ZWCAD uses a cloud-based license pool managed through the ZWCAD Cloud License Manager. Licenses are assigned to a ZWSOFT organization account and checked out per-session by client machines.

Key differences from FlexLM:

- **No server daemon to install** — license management is cloud-based via the ZWSOFT portal
- **No MAC-locked license files** — licenses float to any machine that can authenticate
- **Borrow support** — you can check out a license for offline use (up to 30 days)
- **Usage reporting** — available through the ZWSOFT admin portal

## Step 1: Activate Your Network License Pool

Log in to the ZWSOFT Account Center at `https://account.zwsoft.com`. Navigate to **License Management** and locate your network license serial number.

1. Click **Activate Network License**.
2. Enter the serial number and product key from your purchase confirmation.
3. Set the maximum concurrent users (this is fixed by your purchase quantity — you cannot exceed it).
4. Assign license administrators who can view usage reports and force-release stuck licenses.

The license pool is now active and ready for client connections.

## Step 2: Configure Client Machines

On each workstation that will use ZWCAD as a network client:

1. Install ZWCAD (same installer as standalone — the licensing mode is selected post-installation).
2. Launch ZWCAD. When the license dialog appears, select **Network License**.
3. Sign in with a user account that belongs to your ZWSOFT organization.
4. ZWCAD will verify the account against the license pool and check out a seat.

If the user is not part of the organization in the ZWSOFT portal, they will get an "No available license" error. Make sure all users are invited to the organization before they try to activate.

## Step 3: Configure License Borrowing for Offline Use

For users who travel or work from sites without internet:

1. In ZWCAD, go to **Help** → **License Manager**.
2. Click **Borrow License**.
3. Select the borrow duration (1–30 days).
4. Click **Confirm**.

The license is now checked out exclusively to this machine. Other users cannot use this seat until it is returned or the borrow period expires.

To return a borrowed license early:
1. Open **License Manager**.
2. Click **Return License**.
3. The seat is immediately available in the pool.

**Important**: If a borrowed license expires while the machine is offline, the user will be unable to save or plot until they reconnect and the license is automatically returned. Warn your field users about this.

## Step 4: Monitor License Usage

In the ZWSOFT Account Center, navigate to **License Management** → **Usage Report**. You can see:

- Currently active sessions (user name, machine name, start time)
- Borrowed licenses (user, expiry date)
- Historical usage data (exportable as CSV)

If a user's machine crashes without releasing the license, the seat remains checked out for 2 hours before automatically returning to the pool. You can manually release it from the admin portal by clicking **Force Release** next to the stuck session.

## Troubleshooting Common Issues

**"No available license" despite having free seats**: Check if there are stale sessions in the admin portal. Force-release any sessions from machines that are no longer running ZWCAD.

**Borrowed license won't return**: This usually means the machine's system clock was changed. Ensure the clock is set to automatic NTP sync. If the clock was rolled back, the license server rejects the return request as a tamper protection measure. Contact ZWSOFT support to manually release the borrow.

**Client can't connect to license pool**: Verify the workstation can reach `https://license.zwsoft.com` over HTTPS (port 443). Corporate firewalls that whitelist by domain need `*.zwsoft.com` added to the allowlist.
