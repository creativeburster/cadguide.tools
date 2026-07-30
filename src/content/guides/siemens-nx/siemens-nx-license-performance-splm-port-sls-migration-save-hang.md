---
title: "Siemens NX License and Performance: SPLM_LICENSE_SERVER Port Mismatch, SLS Migration, Save Hang at 25%, Teamcenter Cache Wipe, and Windows 11 Group Policy"
excerpt: "Siemens NX fails to start when SPLM_LICENSE_SERVER points to wrong port (28000 vs 29000), freezes after loading screen, hangs at 25% during save due to OneDrive sync and antivirus, slows after Windows 11 upgrade from cache wipe and Group Policy changes, and requires SLS migration for NX 2312+. We cover each with diagnostic commands and fixes."
category: "license-and-performance"
softwareSlug: "siemens-nx"
keyword: "Siemens NX license error SPLM_LICENSE_SERVER port 28000 29000 SLS save hang slow Windows 11 Teamcenter cache"
slug: "siemens-nx-license-performance-splm-port-sls-migration-save-hang"
author: "CADGuide Tools Editorial Team"
readTime: "12 min"
date: "2025-07-30"
sources:
  - "https://community.sw.siemens.com/s/question/0D5Vb00000WWqL3KAL/nx-license-error-cannot-connect-to-license-server-system-the-serverimgrd-has-not-been-started-yet-or-ugslicenseserver-is-set-to-the-wrong-port-host-15"
  - "https://community.sw.siemens.com/s/question/0D5Vb000007BasKKAS/nx23126win10-pro-certified-hardware-platform-recent-onenx-became-too-slow"
  - "https://community.sw.siemens.com/s/question/0D5Vb00000wTpymKAC/slowness-in-nx-cad-in-win-11"
---

# Siemens NX License and Performance: SPLM_LICENSE_SERVER Port Mismatch, SLS Migration, Save Hang at 25%, Teamcenter Cache Wipe, and Windows 11 Group Policy

Siemens NX users encounter two recurring problem classes: license server connectivity failures that prevent startup, and performance degradation during save, file open, and close operations. These issues stem from port mismatches between old and new license servers, OneDrive sync interference, antivirus file locking, Teamcenter cache invalidation, and Windows 11 security policy changes. This guide covers each with diagnostic commands and verified fixes.

## 1. License Error [-15]: Cannot Connect to License Server

### Message

```
NX License Error: Cannot connect to license server system.
The server (lmgrd) has not been started yet, or
UGS_LICENSE_SERVER is set to the wrong port@host. [-15]
```

### Root Cause

Two possible causes:
1. The license service is not running (on the network server or local machine)
2. The environment variable points to the wrong port or host

### Port Mismatch: 28000 vs 29000

The default port changed between license server versions:
- **Old default**: 28000
- **New default (SLS)**: 29000

Many sites still use 28000, creating confusion when migrating.

### Diagnostic Command

Check license server status from the NX client:
```
cd %UGII_BASE_DIR%\UGFLELX
lmutil lmstat -a -c port@license_host
```

Example: `lmutil lmstat -a -c 27012@IP_ADDRESS`

If the server is running, you'll see:
```
License server status: 27012@IP_ADDRESS
IP_ADDRESS: license UP v11.19.5
```

### Fix

1. **Verify the environment variable**:
   - `SPLM_LICENSE_SERVER = 29000@my_server_name`
   - The first number is the port, followed by @ and the server name

2. **For NX 2312 or newer**: You must use the newer **Siemens License Server (SLS)**. The old PL server will not work.

3. **For node-locked licenses**: No need to run a license service — point directly to the license file:
   ```
   SPLM_LICENSE_SERVER = C:\full_path_to_folder\license_file.lic
   ```

4. **Check firewall**: Ensure the license port is open between client and server. For SLS, the return port is now set automatically. For the old server, you must define the return port manually (default is random, which firewalls block).

5. **Verify license file path**: If the `.lic` file doesn't exist at the specified path, the server cannot start

## 2. NX Freeze After Loading Screen

### Symptom

NX starts, shows the blue loading screen, but once the loading screen completes, NX freezes. Task Manager shows "Not Responding." No changes were made to the computer, drivers, or NX installation.

### Diagnosis

Even if NX doesn't fully load, it creates a **syslog file**:
1. Open Windows Explorer and enter `%temp%` in the location bar
2. Look for files named: `{username}{random_characters}.syslog`
3. Sort by timestamp and find the latest syslog after the crash
4. Send this file to NX support — it contains diagnostic information about what went wrong

### Common Causes

- License server connectivity issue (NX hangs waiting for license checkout)
- Corrupted user profile settings
- Graphics driver conflict
- Teamcenter connection timeout (if managed mode)

### Fix

1. **Check license connectivity first** — use the lmutil command above
2. **Delete NX user settings**: Rename or delete the NX preference folder to reset to defaults
3. **Update graphics driver** — even if "nothing changed," Windows Update may have replaced the driver
4. **Try safe mode**: Launch NX with `UGII_NO_DISPLAY=1` to test if the issue is graphics-related
5. **Check syslog** for the specific failure point

## 3. NX Became Too Slow: Save Hangs at 25%

### Symptoms

On a certified hardware platform with NX 2312.6, Win10 Pro:
1. Initializing NX (local install, not managed mode) — slow
2. Opening relatively small files (50 MB) — slow
3. **Saving files: stops at 25%** then waits several seconds to finish
4. Closing files — slow
5. Closing NX — slow

### Root Causes

| Cause | Impact | Check |
|-------|--------|-------|
| Antivirus scanning | Scans every file write | Disable AV temporarily |
| OneDrive sync | Syncs files during save | Check if save folder is under OneDrive |
| Network drive mapping | Saves across network | Check if saving to mapped drive |
| User Exits (custom routines) | Run during save/open | Check SYSLOG for custom routines |
| License server latency | License check on each operation | Check network to license server |
| Tri-redundant license | Longer checkout time | Check if using 1 server or 3 |

### Diagnostic: Check SYSLOG

The SYSLOG records everything NX does during operations:
1. Find SYSLOG in `%temp%` folder
2. Look for entries during the "slow" operations
3. Identify custom routines, license checks, or network calls causing delays

### Fix

1. **Add antivirus exclusions** for:
   - NX installation directory
   - User data directories
   - Temp folder (`%temp%`)
   - Teamcenter cache directories

2. **Move save location out of OneDrive** — OneDrive syncs on every write, causing save delays
3. **Save locally, not to network drives** — network latency compounds with file size
4. **Remove unnecessary User Exits** — custom routines run at every save/open/close
5. **Check license server latency** — high-latency license servers cause delays on every operation
6. **Use a single license server** if tri-redundant setup is causing delays (tri-redundant checks all 3 servers)

## 4. Windows 11 Upgrade Performance Degradation

### Symptom

After upgrading from Windows 10 to Windows 11, NX CAD (NX 2306) becomes noticeably slow during regular operations. When integrated with Teamcenter, frequent lags occur.

### Root Cause

Windows 11 is **stricter on security settings** out of the box compared to Windows 10. Key changes:
- **Group Policy** settings need adjustment for NX
- **Security settings** may block or slow NX file operations
- **Local caches wiped during OS upgrade** — Teamcenter cache needs repopulation
- Network security changes may affect license and Teamcenter connectivity

### Fix

1. **Work with IT team** to adjust Group Policy and security settings for NX:
   - Add NX folders to security exclusions
   - Adjust Windows Defender settings
   - Review network security policies

2. **Repopulate Teamcenter cache**:
   - Local caches were likely wiped during OS upgrade
   - IT can bulk-populate caches, or caches rebuild over time as users access data
   - First few sessions will be slower as cache rebuilds

3. **Check volume servers and network components** — OS upgrade may have reset network configurations

4. **Verify license server compatibility** — license and Teamcenter servers on Windows Server 2016/2019 should be compatible, but verify no OS updates changed firewall rules

5. **Check virus checker exclusions** — Win11 Defender may be scanning NX work folders that Win10 didn't

## 5. NX Freeze When Opening or Creating Files (Student Version)

### Symptom

NX student version installs successfully with no errors. NX opens normally, but attempting to load an existing file or start a new project causes the system to freeze — the notebook stops responding.

### Context

An earlier installation of NX on the same device worked without issues.

### Fix

1. **Check syslog** in `%temp%` for the failure point
2. **Delete previous NX configuration** — the earlier installation may have left configuration files that conflict with the new install
3. **Run as Administrator** — student version may need elevated permissions
4. **Check graphics compatibility** — Windows 11 may have updated drivers that are incompatible with the student version
5. **Clean uninstall and reinstall** — remove all NX folders, registry entries, and temp files before reinstalling

## 6. SLS Migration for NX 2312+

### Requirement

Starting with NX 2312, the old PL License Server is no longer supported. You must migrate to **Siemens License Server (SLS)**.

### Migration Steps

1. **Install SLS** on the license server machine
2. **Update SPLM_LICENSE_SERVER** on all clients to point to the new server with port 29000
3. **Transfer license files** from old server to SLS
4. **Test connectivity** with `lmutil lmstat` command
5. **Configure return port** — SLS sets this automatically, unlike the old server

### Common Migration Issues

- **Port mismatch**: Old clients use 28000, SLS uses 29000 — update all clients
- **Firewall rules**: New port 29000 must be opened
- **Service name change**: The Windows service name changes from PL to SLS
- **License file format**: SLS may require updated license file format

## Best Practices

1. **Use SLS for NX 2312+** — the old PL server will not work
2. **Add antivirus exclusions** for all NX and Teamcenter directories
3. **Save to local disk, not OneDrive or network drives**
4. **Check SYSLOG** when diagnosing performance issues — it shows exactly what NX is doing
5. **Work with IT on Windows 11 Group Policy** — Win11 is stricter than Win10
6. **Repopulate Teamcenter cache** after OS upgrades
7. **Use lmutil lmstat** to verify license server connectivity before contacting support
8. **Keep license server on low-latency network** — high latency slows every NX operation
9. **Clean uninstall before reinstalling** — leftover configuration files cause conflicts
10. **Check for User Exits** — custom routines can slow save/open/close operations significantly
