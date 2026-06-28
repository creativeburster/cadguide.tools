---
title: "NX License Borrowing Freeze: Fixing Intermittent Not Responding"
excerpt: "Borrowed an NX license to work from home and now the software freezes every 5-10 minutes? I explain why the license manager's background ping causes this and how to fix it without returning to the office."
category: "troubleshooting"
softwareSlug: "siemens-nx"
keyword: "NX license borrow freeze not responding"
slug: "siemens-nx-license-borrow-freeze-not-responding"
author: "CAD IT Admin"
readTime: "7 min"
date: "2025-06-17"
sources:
  - "https://community.sw.siemens.com/s/question/0D54O000061xUAwSAM/nx-not-responding-intermittently"
---

# NX License Borrowing Freeze: Fixing Intermittent Not Responding

A user on the Siemens community forum described a problem I've lived through personally: they borrowed an NX license from the server to work from home, and within hours, NX started freezing every 5-10 minutes for about a minute or two each time. Task Manager showed the process as "Not Responding." The same license worked perfectly when connected to the network directly. Another user in the same thread confirmed the identical behavior with a borrowed license on NX 1851.

This is a known behavior pattern with Siemens PLM License Server (SPLM) borrowing, and unfortunately, the fix is not straightforward. I'll walk through what's happening, why it happens, and the workarounds I've used in production.

## What's Actually Happening

When you borrow a license, NX checks out the license feature to your local machine for a fixed period. However, the Siemens license manager (`ugslmd`) continues to run a background process that periodically attempts to communicate with the original license server. When you're off-network, this communication times out — and during the timeout period, NX freezes.

The freeze duration corresponds to the TCP timeout interval, which is typically 30-60 seconds depending on your network configuration. If the license manager retries multiple times, you can experience freezes of 2-3 minutes.

This is not a bug in the traditional sense — it's a design limitation of the FLEXlm/SPLM borrowing mechanism. The license manager was designed to verify borrowed licenses periodically, and when it can't reach the server, the verification thread blocks the main NX thread.

## Fix 1: Set the License Server to Localhost

When you borrow a license, the `SPLM_LICENSE_SERVER` environment variable still points to the remote server (e.g., `28000@license-server01`). The license manager tries to reach this server for verification.

1. Open **System Properties → Advanced → Environment Variables**
2. Find `SPLM_LICENSE_SERVER`
3. Change it from `28000@license-server01` to `28000@localhost`
4. Restart NX

This tells the license manager to look locally for the borrowed license instead of pinging the remote server. The borrowed license data is stored locally, so the checkout will succeed without a network round-trip.

**Important:** When you return to the office and want to use the network license server again, change the variable back to the server hostname. Otherwise, NX won't see the floating licenses.

## Fix 2: Configure Firewall to Immediately Reject Connections

If Fix 1 doesn't work (some NX versions ignore the localhost setting for borrowed license verification), you can make the timeout instant instead of 30-60 seconds.

1. Open **Windows Defender Firewall → Advanced Settings**
2. Create a new **Outbound Rule**:
   - Type: Custom
   - Protocol: TCP
   - Remote port: 28000 (or your license server port)
   - Action: Block the connection
   - Profile: Apply to all profiles
3. Name it "NX License Server Block"

With this rule in place, the license manager's background ping gets an immediate connection refused (RST packet) instead of waiting for a TCP timeout. The freeze drops from 30-60 seconds to under 1 second — barely noticeable.

**Remember to disable this rule when you return to the office network.**

## Fix 3: Use a VPN with Split Tunneling

If your organization provides VPN access, connecting to the VPN allows the license manager to reach the server normally. However, full-tunnel VPNs can route all your internet traffic through the corporate network, which may be slower.

1. Connect to your corporate VPN
2. Verify you can reach the license server: `ping license-server01`
3. If the ping succeeds, NX should stop freezing
4. If your VPN uses split tunneling, ensure the license server's IP range is included in the tunnel routes

## Fix 4: Request a Node-Locked License

If you frequently work off-network, talk to your IT admin about getting a node-locked (standalone) license. Node-locked licenses are tied to a specific machine's MAC address and don't require any server communication. NX will start and run without any freezing, regardless of network status.

The downside is that node-locked licenses can't be shared — they're permanently assigned to one machine. For users who work remotely 80%+ of the time, this is usually the best solution.

## Fix 5: Adjust the License Manager Timeout

You can reduce the FLEXlm timeout interval by setting an environment variable:

1. Set `FLEXLM_TIMEOUT` to `1000000` (1 second in microseconds)
2. Restart NX

This doesn't prevent the freeze entirely, but it reduces each freeze from 30-60 seconds to about 1 second. Combined with Fix 2 (firewall block), the freezes become practically unnoticeable.

## Why Siemens Hasn't Fixed This

The forum thread on this issue dates back to NX 1851, and the behavior persists in newer versions. The reason is that the background verification is a security feature — it ensures borrowed licenses haven't been tampered with or duplicated. Removing it would create a security hole in the licensing system.

The practical solution is to make the timeout as short as possible (Fixes 1, 2, and 5) so the verification fails fast instead of hanging. In my experience, combining Fix 1 (localhost) with Fix 5 (reduced timeout) eliminates the problem for 90% of users.

## Verifying Which Fix Worked

After applying the fixes, verify that the freezing has stopped:

1. Start NX with the borrowed license
2. Work normally for 30 minutes — create a sketch, add features, save the file
3. If no freezing occurs, the fix is working
4. If freezing still occurs, check Task Manager:
   - Watch the NX process CPU usage during the freeze
   - If CPU drops to 0% during the freeze, the process is waiting for a network response (license verification)
   - If CPU stays high, the freeze is caused by something else (graphics, disk, or memory)
5. Check the FLEXlm log file for timeout messages:
   - The log is typically at `C:\Program Files\Siemens\PLMLicenseServer\ugslmd\flexlm.log`
   - Look for "TIMED OUT" or "connection refused" entries

## Returning a Borrowed License Early

If you no longer need the borrowed license, return it so others can use it:

1. Open LMTOOLS on the client machine
2. Go to the **Server Status** tab
3. Click **Perform Status Enquiry**
4. Find your borrowed license in the output
5. To return it, use the command line:
   ```
   ugslmd -return <borrow_id> -c 28000@localhost
   ```
6. The borrow ID is shown in the status enquiry output
7. After returning, change `SPLM_LICENSE_SERVER` back to the server hostname

## Summary

| Fix | Effectiveness | Difficulty |
|-----|--------------|------------|
| Set SPLM_LICENSE_SERVER to localhost | High | Easy |
| Firewall block on port 28000 | High | Easy |
| VPN connection | Complete fix | Requires VPN access |
| Node-locked license | Complete fix | Requires IT approval |
| FLEXLM_TIMEOUT reduction | Moderate | Easy |

If you're stuck working from home with a borrowed license tonight, do Fix 1 and Fix 5 right now — it takes 2 minutes and will eliminate the worst of the freezing.
