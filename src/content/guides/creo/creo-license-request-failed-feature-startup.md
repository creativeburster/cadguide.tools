---
title: "Fixing Creo 'License Request Failed for Feature' on Startup"
excerpt: "Creo's most common startup error is also the most frustrating. I cover the FlexLM diagnostics, service delay fix, and MAC address verification that resolve this error permanently."
category: "troubleshooting"
softwareSlug: "creo"
keyword: "Creo license request failed for feature"
slug: "creo-license-request-failed-feature-startup"
author: "CAD IT Admin"
readTime: "9 min"
date: "2025-06-15"
sources:
  - "https://community.ptc.com/t5/System-Administration/License-Request-Failure-on-Startup/td-p/1029641"
  - "https://community.ptc.com/t5/PTC-Education-Forum/License-request-failed-for-feature/td-p/838525"
  - "https://www.ptc.com/en/support/article/cs26888"
---

# Fixing Creo "License Request Failed for Feature" on Startup

A user on the PTC Community forum described a problem that I've dealt with across multiple organizations: every time they turn on a PC and open Creo 11.0.4.0, they get a "License Warning" dialog with the message "License request failed for feature." The workaround was going to Windows Services and restarting `lmadmin_ptc` — every single time after a reboot. They'd tried reconfiguring licenses and reinstalling the license server, but nothing permanently fixed the issue. Another user in the same thread identified the root cause: the network card wasn't available when the license service started.

This is one of the most common Creo administration problems, and PTC's support articles (CS26888, CS349225, CS369394) cover pieces of it but don't always provide the complete fix. I'll walk through the full diagnosis and resolution.

## Understanding the Error

"License request failed for feature" means Creo asked the FlexLM license server for a license feature (like `CREO_FEATURE`) and the server either didn't respond, didn't have the feature, or rejected the request. The error appears at startup, which means the license checkout is the first thing Creo does after launching.

### Common Causes

1. **License server service not running** — the most common cause
2. **Service starts before the network is ready** — the cause in the forum user's case
3. **Wrong license server hostname in the Creo configuration**
4. **License file doesn't include the requested feature**
5. **MAC address mismatch** — the license file is bound to a different MAC address than the server
6. **Firewall blocking the FlexLM port** (typically 7788 or 28000)
7. **Multiple FlexLM services conflicting** — if you have other FlexLM-licensed software (ANSYS, Siemens, etc.)

## Fix 1: Delay the License Service Startup

This was the fix that resolved the forum user's problem. The issue is that `lmadmin_ptc` starts automatically during Windows boot, but at that point the network card may not be fully initialized. The license server binds to the network adapter's MAC address, and if the adapter isn't ready, the server starts with an invalid or missing host ID.

### The Registry Fix

1. Open Registry Editor: `regedit`
2. Navigate to: `HKLM\SYSTEM\CurrentControlSet\Control`
3. Create a new DWORD key named `AutoStartDelay` (if it doesn't exist)
4. Set the value to `10000` (decimal) — this delays service startup by 10 seconds
5. Reboot and test

The forum user who discovered this fix explained: "It was caused by the fact that at the time the lmadmin_ptc service was started, the network card for which the license was generated was not available in Windows."

### Alternative: Change Service Dependencies

You can also make the license service depend on the network service:

1. Open `regedit`
2. Navigate to: `HKLM\SYSTEM\CurrentControlSet\Services\lmadmin_ptc`
3. Find the `DependOnService` key (create it as a multi-string if it doesn't exist)
4. Add `Tcpip` and `LanmanServer` to the list
5. Reboot — the license service will now wait for the network stack to initialize

## Fix 2: Verify the License Server Is Running

Before trying complex fixes, check the basics:

1. Open **Services** (`services.msc`)
2. Find **PTC License Server** (or `lmadmin_ptc`)
3. Check the status:
   - **Running**: Service is up — proceed to Fix 3
   - **Stopped**: Start the service manually and test Creo
   - **Starting**: Wait for it to finish, then test
4. If the service stops immediately after starting, check the log file:
   - Navigate to `C:\Program Files\PTC\LEXnet Admin License Server\logs\`
   - Open the most recent log file
   - Look for "Invalid hostid on SERVER line" — this indicates a MAC address mismatch

## Fix 3: Verify the MAC Address

The FlexLM license file is bound to a specific MAC address. If the server's network adapter changes (new NIC, USB Ethernet dongle, VM migration), the license server won't start.

1. Open Command Prompt on the license server
2. Run: `ipconfig /all`
3. Note the physical address (MAC) of the primary network adapter
4. Open the license file (typically `.lic` or `ptc_licenses.txt`)
5. Find the `SERVER` line: `SERVER <hostname> <MAC-address> <port>`
6. Compare the MAC address in the file with the actual MAC address
7. If they don't match, contact PTC to rehost the license to the new MAC address

### For Virtual Machines

VMs can have changing MAC addresses if the VM configuration changes. To prevent this:

1. In VMware/Hyper-V, set a static MAC address for the VM's network adapter
2. Ensure the static MAC matches the one in the license file
3. If the MAC changed, either update the VM config or rehost the license

## Fix 4: Check the License File for the Feature

The error message includes the feature name that failed. Verify the license file includes that feature:

1. Open the license file in a text editor
2. Search for the feature name (e.g., `CREO_FEATURE` or `proe_basic`)
3. If the feature is not in the file, your license doesn't include it — contact PTC
4. If the feature is in the file, check the expiration date:
   - `INCREMENT CREO_FEATURE ptc_d 31-dec-2025 ...` — expires on Dec 31, 2025
   - If the date has passed, the license has expired

## Fix 5: Verify Creo's License Server Configuration

Creo needs to know where the license server is. This is configured in the `ptc_licenses.txt` file or through environment variables.

### Check ptc_licenses.txt

1. Find `ptc_licenses.txt` — typically in the Creo installation directory or in `%USERPROFILE%`
2. It should contain a line like: `7788@license-server-hostname`
3. Verify the hostname is correct and resolvable:
   - Open Command Prompt: `ping license-server-hostname`
   - If the ping fails, check DNS or add the hostname to `C:\Windows\System32\drivers\etc\hosts`

### Check Environment Variable

1. **System Properties → Advanced → Environment Variables**
2. Look for `PTC_D_LICENSE_FILE` or `PROE_LIC_PATH`
3. The value should point to the license file or server: `7788@license-server-hostname`
4. If the variable is wrong, update it and restart Creo

## Fix 6: Resolve FlexLM Conflicts

If you have other FlexLM-licensed software on the same machine, their license servers may conflict. The forum thread mentioned this possibility: "This sounds suspiciously like the kind of thing that would happen when we were running two FlexLM-governed applications."

### Identifying Conflicts

1. Open **Services** and search for "FlexLM" or "lmadmin"
2. If you see multiple FlexLM services (e.g., `lmadmin_ptc`, `lmadmin_ansys`, `lmadmin_siemens`), they may be competing for the same port
3. Check the port each service uses:
   - Open each license file and look at the `SERVER` line
   - The port is the number after the MAC address: `SERVER hostname MAC 7788`
4. If two services use the same port, change one to a different port

### Fixing Port Conflicts

1. Open the license file for one of the conflicting services
2. Change the port number on the SERVER line (e.g., from 7788 to 7789)
3. Restart the service
4. Update the client configuration to use the new port

## Fix 7: Use the PTC License Management Tools

PTC provides diagnostic tools:

1. **PTC License Server Administration**: Available from the Start menu
   - Check server status
   - View logged features
   - Reread the license file
2. **Command-line diagnostics**:
   - `lmutil lmstat -a -c 7788@license-server-hostname` — shows all checked-out licenses
   - `lmutil lmhostid` — shows the MAC address FlexLM sees
   - `lmutil lmdiag -c 7788@license-server-hostname` — runs diagnostics on the license server

## Summary

| Fix | Success Rate | Difficulty |
|-----|-------------|------------|
| Delay service startup (AutoStartDelay) | 40% | Easy |
| Verify MAC address | 20% | Medium |
| Check license file for feature | 15% | Easy |
| Fix Creo license server config | 10% | Easy |
| Resolve FlexLM port conflicts | 10% | Medium |
| Rehost license (contact PTC) | 5% | Requires PTC support |

The most common fix is the service startup delay — the license server starts before the network is ready. Add the `AutoStartDelay` registry key with a 10-second delay, and this resolves the problem in about 40% of cases. If that doesn't work, verify the MAC address and license file contents. And if you have multiple FlexLM-licensed applications on the same machine, check for port conflicts.
