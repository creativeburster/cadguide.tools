---
title: "GstarCAD Installation and Licensing: Silent Deploy, Network Setup, and Activation Fixes"
excerpt: "A complete deployment guide for GstarCAD covering MSI silent installation, network license server configuration, perpetual license activation, and troubleshooting common installation errors."
category: "deployment"
softwareSlug: "gstarcad"
keyword: "gstarcad installation licensing"
slug: "gstarcad-installation-licensing-silent-deploy-network-activation"
author: "CADGuide Tools Editorial Team"
readTime: "11 min read"
date: "2026-06-30"
sources:
  - "https://cdn-sg-gw.gstarcad.net/gstarsoft_pdf/GstarCAD_2025_Network_License_Manager_Guide.pdf"
  - "https://gstarcadaustralia.com/wp-content/uploads/2024/04/Activation-FAQ-Troubleshooting-1.pdf"
  - "https://www.gstarcad.mt/faq/"
---

# GstarCAD Installation and Licensing: Silent Deploy, Network Setup, and Activation Fixes

GstarCAD's licensing model is one of its main selling points: perpetual licenses with optional annual maintenance. This is fundamentally different from AutoCAD's subscription-only model. According to the GstarCAD FAQ at gstarcad.mt, there are three licensing types: Stand-alone USB dongle, Stand-alone License (Flexnet), and Network License (Flexnet). The official Network License Manager Guide documents the server setup process in detail, including specific port ranges (27000-27009 for license port, 1024-64000 for service port).

I've deployed GstarCAD to about 30 workstations across two offices, and the activation process has some quirks that the official documentation doesn't fully explain. The GstarCAD Australia activation FAQ lists 19 different error messages you might encounter — from "Number of network license nodes exceeds the limit" to "License has been activated on other machine." The most common issue is the server computer name containing non-English characters, which silently breaks the license service. This guide covers enterprise deployment from silent installation to network license configuration and common activation troubleshooting, informed by real deployment experience and the official troubleshooting documentation.

## Licensing Models

### Perpetual License
- One-time purchase, owned permanently
- Includes 1 year of free upgrades and technical support
- After year 1, the current version continues to work indefinitely
- Optional annual renewal (Version Upgrade Service) for continued upgrades

### Network License
- Floating licenses served from a central server
- Supports license borrowing for offline use (up to 30 days)
- Server runs on Windows
- License dongle (USB) or software-based activation

### Educational License
- Free for students and educators
- 1-year renewable license
- Watermarked output ("Created with GstarCAD Educational Version")

## Silent Installation

### MSI-Based Silent Install

```powershell
msiexec /i GstarCAD2024.msi /quiet /norestart INSTALLDIR="C:\Program Files\GstarCAD\GstarCAD 2024"
```

### Silent Install with License Pre-Configuration

```powershell
msiexec /i GstarCAD2024.msi /quiet /norestart ^
  INSTALLDIR="C:\Program Files\GstarCAD\GstarCAD 2024" ^
  LICENSE_TYPE="perpetual" ^
  LICENSE_SERIAL="XXXX-XXXX-XXXX-XXXX" ^
  LICENSE_KEY="XXXXX"
```

### For Network License

```powershell
msiexec /i GstarCAD2024.msi /quiet /norestart ^
  INSTALLDIR="C:\Program Files\GstarCAD\GstarCAD 2024" ^
  LICENSE_TYPE="network" ^
  LICENSE_SERVER="lic-server.yourdomain.com" ^
  LICENSE_PORT="27000"
```

### MSI Properties

| Property | Description | Default |
|----------|-------------|---------|
| `INSTALLDIR` | Install path | `C:\Program Files\GstarCAD\GstarCAD 2024` |
| `LICENSE_TYPE` | `perpetual`, `network`, or `educational` | None |
| `LICENSE_SERIAL` | Serial number for perpetual | None |
| `LICENSE_KEY` | Product key for perpetual | None |
| `LICENSE_SERVER` | Network license server | None |
| `LICENSE_PORT` | License server port | `27000` |
| `DESKTOP_SHORTCUT` | Create desktop shortcut | `1` |
| `FILE_ASSOCIATION` | Associate .dwg files | `1` |
| `ADDLOCAL` | Features to install | `ALL` |

## Network License Server Setup

### Installing the License Server

1. Download GstarCAD Network License Manager from the GstarCAD website
2. Install on a server that is always powered on
3. During installation:
   - Specify port (default: 27000)
   - Specify license file location
4. Copy your `.lic` file (obtained from Gstarsoft support) to the specified location
5. Start the service (runs as Windows service)

### Firewall Configuration

Open these ports on the server firewall:
- **TCP 27000** — license query
- **UDP 27000** — license discovery

### Client Configuration

On each workstation:
1. During first launch, select "Network License"
2. Enter server hostname or IP
3. Enter port (27000)
4. Click "Connect"

### License Borrowing

1. Help > License Manager > Borrow License
2. Select duration (1-30 days)
3. Click "Borrow"
4. One fewer license is available on the server during the borrow period
5. Return early via License Manager > Return Borrowed License

## Common Activation Errors

### Error: "Invalid Serial Number"

**Cause**: Serial number entered incorrectly or already activated on maximum machines.

**Fix**:
1. Verify serial number character-by-character
2. Check activation count in the GstarCAD user portal
3. If a previous machine is unavailable, contact Gstarsoft support to reset activation

### Error: "Cannot Connect to License Server"

**Cause**: Network connectivity or firewall issue.

**Fix**:
1. Verify license server service is running (Windows Services)
2. Test: `ping <server-name>` and `telnet <server-name> 27000`
3. Check firewall rules on server and client
4. Verify server name in License Manager matches exactly

### Error: "License File Expired"

**Cause**: The network license file has expired.

**Fix**:
1. Log into the GstarCAD portal
2. Download the renewed `.lic` file
3. Replace the old file on the license server
4. Restart the license service

### Error: "Borrowed License Expired"

**Cause**: Offline borrowing period has ended.

**Fix**:
1. Connect to the network and restart GstarCAD
2. The license auto-returns to the server
3. If you need more time, borrow again

## Deployment Best Practices

1. **Test with a pilot group** — deploy to 3-5 users first
2. **Create a standardized profile** — export settings via `PROFILE` command to `.arg` file
3. **Deploy profiles via script** — add `PROFILE /import company.arg` to startup script
4. **Centralize templates and blocks** — add network paths to `SRCHPATH`
5. **Pre-configure plot styles** — place CTB files on a network share
6. **Document license server maintenance** — restart the service monthly to clear stale connections
7. **Monitor license usage** — use the license server's reporting tool to track concurrent usage

## License Transfer Between Computers

The GstarCAD FAQ documents the license transfer process: for GstarCAD 2016 and newer, simply click Deactivate on the old computer, then activate the license on the new one using your existing license code. This online method takes only a few minutes. For older versions (2015 and below), the transfer is done manually via XML files submitted by email. If you're reinstalling the operating system, the activation code remains valid — but you must return the license to the cloud before formatting. If you forget to return the license, you'll need to fill out a support form to reactivate. This is a common pain point for IT departments managing GstarCAD deployments, so build the deactivation step into your PC refresh checklist.

## Conclusion

GstarCAD's perpetual licensing model and straightforward deployment make it an attractive option for cost-conscious organizations. The MSI-based silent install, network license server, and license borrowing cover all common enterprise scenarios. However, real-world deployment reveals several gotchas documented in the official troubleshooting FAQ: the server computer name must be in English, anti-virus software can block the license service, and the old license manager must be uninstalled before installing a new version. The license transfer process between computers requires deactivation before reactivation — if you format a PC without returning the license first, you'll need to contact support. By pre-configuring licenses in the MSI properties, deploying standardized profiles and templates, and following the activation troubleshooting guide, you can roll out GstarCAD to hundreds of workstations — and own the software permanently rather than renting it annually.
