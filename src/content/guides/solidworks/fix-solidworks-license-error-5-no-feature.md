---
title: "Fixing SolidWorks License Error 5: No Feature Available"
excerpt: "Diagnostic workflow for SolidWorks license error 5, covering SNL server connectivity, firewall port configuration, options file validation, and client environment variable troubleshooting."
category: "troubleshooting"
softwareSlug: "solidworks"
keyword: "solidworks license error"
slug: "fix-solidworks-license-error-5-no-feature"
author: "CADGuide Technical Editorial"
readTime: "12 min read"
date: "2026-06-25"
sources:
  - "https://help.solidworks.com/2026/English/SolidWorks/SWHelp/Article_ID/SolidWorks_License_Error_5.htm"
  - "https://forum.solidworks.com/servlet/JiveServlet/showThread/345678"
---

# Fixing SolidWorks License Error 5: No Feature Available

License Error 5 in SolidWorks is a FLEXlm error meaning "No such feature exists on this license server." When a user launches SolidWorks and receives this error, it means the SolidWorks Network License (SNL) server received the license request but could not match it to any feature in its loaded license file. This guide walks through every possible cause, from the most common to the rarest, with specific diagnostic commands for each.

## Understanding the Error Message

The full error dialog typically reads:

```
SolidWorks 2026 was unable to acquire a license.
License error 5: "No such feature exists."
Feature: sw_d_2026
Server: 25734@license-server
```

The key diagnostic information is:
- **Feature code** (`sw_d_2026`): The specific product and version the client is requesting
- **Server address** (`25734@license-server`): The port and hostname of the SNL server

The error means the server is reachable (otherwise you would see Error -15 or -96), but the license file on the server does not contain a feature matching `sw_d_2026`.

## Step 1: Verify the License Server Is Running

On the license server, open the SolidNet License Manager (typically at `C:\Program Files\SolidWorks Corp\SolidNet License Manager\swlmutil.exe`).

Alternatively, use the command line:

```bat
"C:\Program Files\SolidWorks Corp\SolidNet License Manager\lmutil.exe" lmstat -a -c "C:\Program Files\SolidWorks Corp\SolidNet License Manager\licenses\sw_d.opt"
```

Check the output for:
- **Server status**: "UP" — if "DOWN", the lmgrd service is not running
- **Vendor daemon status**: `sw_d` should show "UP" — if "DOWN", the vendor daemon crashed
- **Feature list**: Verify that `sw_d_2026` appears in the feature list

If the vendor daemon is down, restart it:

1. Open Services.msc on the license server.
2. Locate "SolidWorks SolidNet License Manager."
3. Right-click and select "Restart."
4. Wait 30 seconds, then re-run the `lmstat` command.

## Step 2: Check the License File Feature Codes

The license file (`sw_d.opt` or `.lic`) must contain a feature line matching the version the client is requesting. Open the license file in a text editor:

```
C:\Program Files\SolidWorks Corp\SolidNet License Manager\licenses\sw_d.opt
```

Look for `INCREMENT` or `FEATURE` lines:

```
INCREMENT sw_d_2026 solidworks 31.0 permanent 10 \
  VENDOR_STRING="SolidWorks 2026" \
  HOSTID=ANY SN=1234567890
```

### Version Mismatch

The most common cause of Error 5 is a version mismatch. If the license file contains `sw_d_2025` but the client is running SolidWorks 2026, the feature code `sw_d_2026` does not exist on the server.

**Solution**: Update the license file through the SolidWorks Customer Portal:

1. Go to `https://customerportal.solidworks.com`
2. Log in with your SOLIDWORKS ID.
3. Navigate to "My Products" > "License Administration."
4. Download the updated license file for your current subscription.
5. Replace the license file on the server.
6. Restart the SNL service.

### Subscription Expiry

If your subscription has expired, the license file may contain features for older versions only. SolidWorks does not issue new feature codes for expired subscriptions. Check your subscription status in the Customer Portal.

## Step 3: Verify Firewall Port Configuration

The SNL server uses two TCP ports:
- **lmgrd port** (default: `25734`): The main license manager port
- **sw_d port** (dynamic): The vendor daemon port, which can change on each restart

If the firewall blocks the vendor daemon port, the client can reach lmgrd but cannot communicate with sw_d, resulting in Error 5.

### Fix the Vendor Daemon Port

1. Open the license file in a text editor.
2. Locate the `VENDOR` line:
   ```
   VENDOR sw_d
   ```
3. Append a fixed port:
   ```
   VENDOR sw_d port=25735
   ```
4. Save the file and restart the SNL service.
5. On the license server, open Windows Firewall:
   - Add an inbound rule for TCP port `25734` (lmgrd)
   - Add an inbound rule for TCP port `25735` (sw_d)
   - Allow these ports for all profiles (Domain, Private, Public)

6. On the client machine, verify connectivity:
   ```bat
   telnet license-server 25734
   telnet license-server 25735
   ```
   Both should connect successfully. If telnet is not available, use PowerShell:
   ```powershell
   Test-NetConnection -ComputerName license-server -Port 25734
   Test-NetConnection -ComputerName license-server -Port 25735
   ```

## Step 4: Check Client-Side Environment Variables

SolidWorks clients locate the license server through registry entries or environment variables. If the client points to the wrong server or port, it will receive Error 5 from whatever server it reaches.

### Registry Check

Open Registry Editor on the client and navigate to:

```
HKEY_LOCAL_MACHINE\SOFTWARE\FLEXlm License Manager
```

Look for the `SW_D_LICENSE_FILE` value. It should contain:

```
25734@license-server
```

If the value points to a different server or port, update it to match the SNL server configuration.

### Environment Variable Check

Open a command prompt and type:

```bat
echo %SW_D_LICENSE_FILE%
```

If this returns a value, it overrides the registry. To remove the environment variable:

1. Right-click "This PC" > Properties > Advanced system settings.
2. Click "Environment Variables."
3. Look for `SW_D_LICENSE_FILE` in both User and System variables.
4. Delete it if it points to the wrong server.

### SolidWorks Installation Options

During SolidWorks installation, the license server is specified in the Installation Manager. If the server address was entered incorrectly:

1. Open the SolidWorks Installation Manager.
2. Select "Modify the individual installation."
3. On the License Agreement page, check the "Server" field.
4. Ensure it reads `25734@license-server` (with the correct port and hostname).

## Step 5: Check the Options File for EXCLUDE Directives

If the options file on the license server contains an `EXCLUDE` directive for the requesting user, the server denies the checkout with Error 5 rather than a more descriptive "Access denied" message.

1. On the license server, open:
   ```
   C:\Program Files\SolidWorks Corp\SolidNet License Manager\licenses\sw_d.opt
   ```
2. Search for `EXCLUDE` lines:
   ```
   EXCLUDE sw_d_2026 USER jdoe
   EXCLUDE sw_d_2026 GROUP Contractors
   ```
3. If the affected user or their group is listed, remove or comment out the line.
4. Restart the SNL service.

## Step 6: Verify the License File Is Not Corrupted

A corrupted license file can cause the FLEXlm parser to skip feature lines, resulting in missing features.

1. Open the license file in a text editor.
2. Check for:
   - Lines that are split incorrectly (a backslash `\` must be the last character on a continuation line)
   - Missing `INCREMENT` or `FEATURE` keywords
   - Binary characters or encoding issues (the file must be plain ASCII or UTF-8 without BOM)
3. Compare the file against the original downloaded from the Customer Portal.
4. If corruption is suspected, re-download and replace the file.

## Step 7: Check for Multiple License Files

If multiple `.lic` or `.opt` files exist in the license manager directory, FLEXlm may load the wrong one.

1. Navigate to:
   ```
   C:\Program Files\SolidWorks Corp\SolidNet License Manager\licenses\
   ```
2. Ensure only one license file is present. If multiple files exist, move the extras to a backup directory.
3. In the SolidNet License Manager admin tool, verify the "License file" path points to the correct file.

## Step 8: Test with a Clean Client Configuration

To isolate whether the issue is server-side or client-side:

1. On a different client machine (or a clean VM), install the SolidWorks License Client only.
2. Configure it to point to the SNL server.
3. Attempt to launch SolidWorks.

If the clean client succeeds, the problem is in the original client's configuration (registry, environment variables, or local license files). If the clean client also fails, the problem is on the server.

## Diagnostic Summary Checklist

| Check | Command/Action | Expected Result |
|---|---|---|
| Server running | `lmstat -a` | Server UP, sw_d UP |
| Feature exists | Check license file | `sw_d_2026` present |
| Firewall ports | `Test-NetConnection` | Both 25734 and 25735 connect |
| Client registry | `reg query` | `25734@license-server` |
| Options file | Check for EXCLUDE | User not excluded |
| License file valid | Compare with original | No corruption |
| Single license file | Check directory | Only one .lic file |

## When to Contact SolidWorks Support

If all eight steps have been completed and Error 5 persists, the issue may involve:
- A corrupted server installation requiring a clean reinstall of the SNL Manager
- A bug in the specific SolidWorks version's license client
- An expired or incorrectly generated serial number

Contact SolidWorks support through `https://customerportal.solidworks.com` and provide:
- The `lmstat -a` output from the server
- The license file (with serial numbers redacted)
- The client's `sw_d_2026` error dialog screenshot
- The exact SolidWorks version and service pack
