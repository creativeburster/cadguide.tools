---
title: "ANSYS Discovery License Activation and Installation Troubleshooting"
excerpt: "Common ANSYS Discovery licensing and installation errors — covering license server connectivity, ANSYSLI port issues, proxy server configuration, and offline licensing — based on ANSYS Knowledge articles."
category: "deployment"
softwareSlug: "ansys-discovery"
keyword: "ansys discovery license activation installation troubleshooting"
slug: "ansys-discovery-license-activation-installation-troubleshooting"
author: "CADGuide Tools Editorial Team"
readTime: "7 min read"
date: "2026-07-12"
sources:
  - "https://innovationspace.ansys.com/knowledge/forums/topic/discovery-license-activation-troubleshooting/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/license-and-installation-troubleshooting/"
  - "https://innovationspace.ansys.com/knowledge/forums/topic/discovery-enterprise-resolving-license-manager-installation-issue/"
---

# ANSYS Discovery License Activation and Installation Troubleshooting

ANSYS Discovery licensing has several common failure points. The ANSYS Knowledge forum documents these issues and their solutions. This guide consolidates the most common problems and fixes.

## License Types

- **Named User Subscription**: License tied to a specific user and machine
- **Floating (Enterprise)**: License served from a central license manager to multiple users
- **Offline Licensing**: For machines without internet access

## Issue 1: License Server Connectivity

### Problem
Discovery cannot connect to the license server, preventing launch.

### Fix
1. **Verify network connectivity**: Open Command Prompt and ping the license server:
   ```
   ping [license-server-hostname]
   ```
2. If ping returns "0% loss," the connection is successful
3. If ping fails:
   - Check firewall settings on both client and server
   - Verify the license server hostname is correct
   - Check VPN connection if the server is on a remote network

4. **Check license server status**: On the server, open ANSYS License Manager and verify the server is running

5. **Verify port access**: The license server uses TCP port 1055 (default) and additional ports. Ensure these ports are open in the firewall on both server and client

## Issue 2: "ANSYSLI exited or could not read server port ANSYSLI_FNE_PORT"

### Problem
This error indicates the ANSYS License Intermediary (ANSYSLI) cannot communicate with the license server.

### Fix
1. Verify the `ANSYSLI_FNE_PORT` environment variable is set correctly on the client machine:
   - Right-click **This PC → Properties → Advanced System Settings → Environment Variables**
   - Check for `ANSYSLI_FNE_PORT` — should match the server port (default: 1055)
2. If the variable is missing or incorrect, add/set it and restart Discovery
3. Check that the license server is running and accessible

## Issue 3: "QA services environment variable is enabled"

### Problem
Discovery shows an error about QA services environment variable being enabled.

### Fix
1. Check environment variables for `ANSYSLI_QA_SERVER` or similar QA-related variables
2. Remove or unset these variables — they're used for ANSYS internal testing and shouldn't be set in production
3. Restart Discovery

## Issue 4: Unable to Start SpaceClaim or Discovery After Login

### Problem
After logging into the Discovery account, the software doesn't start.

### Fix
1. **Check Discovery Account login**: 
   - Go to the ANSYS Discovery Account portal
   - Verify your account is active and the license is assigned
   - Try logging out and back in

2. **Clear cached credentials**:
   - Navigate to `%APPDATA%\Ansys` and clear cached login data
   - Restart Discovery and log in again

3. **Check proxy settings**: If behind a corporate proxy:
   - Configure proxy in Discovery: **File → Discovery Options → Proxy**
   - Enter proxy server address and port
   - Include authentication credentials if required

## Issue 5: License Manager Installation Failure (Enterprise)

### Problem
The ANSYS License Manager fails to install on the server.

### Fix
1. **Run as Administrator**: Right-click the installer and select "Run as Administrator"
2. **Check prerequisites**: 
   - .NET Framework 4.7.2 or later
   - Visual C++ Redistributable
3. **Check port availability**: Port 1055 (default) must be free. Check with:
   ```
   netstat -an | findstr 1055
   ```
4. **Antivirus interference**: Temporarily disable antivirus during installation
5. **Previous installation**: Uninstall any previous ANSYS License Manager before installing a new version
6. **Check installation logs**: Located in `%TEMP%\AnsysLI_*.log`

## Issue 6: Offline Licensing

### Problem
For machines without internet access, standard online activation fails.

### Fix
1. On a machine with internet access, log into the ANSYS Licensing Portal
2. Generate an offline license file for the target machine
3. You'll need the target machine's Host ID (MAC address) and Hostname
4. Download the generated license file
5. Transfer the file to the offline machine (USB, network share)
6. On the offline machine:
   - Open ANSYS License Manager
   - Select "Install License File"
   - Browse to the transferred file
   - Restart Discovery

## Issue 7: Changing License Type (Named User to Floating or Vice Versa)

### Problem
Need to switch from Named User Subscription to Floating (Enterprise) license or vice versa.

### Fix
1. **Named User to Floating**:
   - Install ANSYS License Manager on the server
   - Configure the client to point to the server: set `ANSYSLI_FNE_PORT` to `server_hostname:1055`
   - Restart Discovery

2. **Floating to Named User**:
   - Remove the `ANSYSLI_FNE_PORT` environment variable
   - Log into Discovery Account with your Named User credentials
   - Restart Discovery

## License Activation Checklist

Before contacting ANSYS support, verify:

- [ ] License server is running (for Floating/Enterprise)
- [ ] Network connectivity to license server (ping succeeds)
- [ ] Firewall allows traffic on port 1055 (and ANSYSLI ports)
- [ ] Environment variables are correctly set
- [ ] No QA/test environment variables are set
- [ ] Discovery Account login works (for Named User)
- [ ] Proxy settings configured (if behind corporate proxy)
- [ ] License Manager installed correctly (for Enterprise)
- [ ] Antivirus not blocking ANSYS processes
- [ ] Sufficient licenses available (for Floating — all licenses may be in use)

## Contacting ANSYS Support

If all troubleshooting steps fail:
1. Post on the [ANSYS Innovation Space forum](https://innovationspace.ansys.com)
2. Include:
   - Discovery version (e.g., 2024 R2)
   - License type (Named User / Floating / Offline)
   - Complete error message
   - License Manager log files
   - Steps you've already tried
3. Or contact your ANSYS account manager or reseller directly
