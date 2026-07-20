---
title: "Configuring NX SPLM License Server: Port, Firewall, and Options File"
excerpt: "Setting up a Siemens PLM License Server for NX isn't just 'install and go.' I cover the firewall rules, port configuration, options file for borrowing, and the diagnostic commands I use to keep licenses flowing."
category: "deployment"
softwareSlug: "siemens-nx"
keyword: "NX SPLM license server configuration"
slug: "siemens-nx-splm-license-server-configuration"
author: "CADGuide Tools Editorial Team"
readTime: "10 min"
date: "2025-06-20"
sources:
  - "https://community.sw.siemens.com/s/question/0D54O000061xUAwSAM/nx-not-responding-intermittently"
  - "https://community.sw.siemens.com/s/question/0D54O000061xTkASAU/nx-not-run-and-no-reactions"
---

# Configuring NX SPLM License Server: Port, Firewall, and Options File

I've set up Siemens PLM License Servers in environments ranging from 5-user startups to 200-seat enterprise deployments. The installation wizard makes it look straightforward, but the real work happens after the installer finishes — firewall rules, options file configuration, borrowing setup, and client environment variables. Get any of these wrong, and you'll have users who can't start NX, can't borrow licenses, or experience intermittent freezing during work.

## Installing the License Server

### Prerequisites

1. Choose a server machine that is always on — workstations that sleep or hibernate will drop licenses for all users
2. Note the server's hostname and MAC address — you'll need these for the license file
3. Ensure the server has a static IP address (or a reserved DHCP lease)
4. Install Java Runtime Environment (JRE) 8 or later — the license server management tools require it

### Installation Steps

1. Download the SPLM License Server installer from the Siemens Software Center
2. Run the installer as Administrator
3. When prompted, specify the installation directory (default: `C:\Program Files\Siemens\PLMLicenseServer`)
4. The installer creates a Windows service called `Siemens PLM License Server` (service name: `ugslmd`)
5. Set the service to start automatically: **Services → Siemens PLM License Server → Startup Type → Automatic**

### Installing the License File

1. Obtain your license file (`ugslmd.opt` or `.lic`) from Siemens
2. Place it in `C:\Program Files\Siemens\PLMLicenseServer\ugslmd\`
3. Open LMTOOLS (installed with the license server) and verify:
   - **Config Services**: Service Name = `Siemens PLM License Server`
   - Path to lmgrd.exe: `C:\Program Files\Siemens\PLMLicenseServer\ugslmd\lmgrd.exe`
   - Path to license file: your license file path
   - Path to debug log: `C:\Program Files\Siemens\PLMLicenseServer\ugslmd\flexlm.log`
4. Click **Save Service**, then **Start Server**
5. Click **Server Status → Perform Status Enquiry** — you should see your license features listed

## Firewall Configuration

The license server communicates on TCP port 28000 by default. You need to open this port on both the server and client firewalls.

### Server-Side Firewall

1. Open **Windows Defender Firewall → Advanced Settings → Inbound Rules**
2. Create a new rule:
   - Port: TCP 28000
   - Action: Allow the connection
   - Profile: Domain, Private
   - Name: "Siemens PLM License Server"
3. Create a second rule for `lmgrd.exe` and `ugslmd.exe` (program rules, allow all connections)

### Client-Side Firewall

On each NX workstation:
1. Allow outbound TCP 28000 to the license server's IP address
2. If using Windows Defender Firewall, the default outbound policy allows all connections, so this is usually not needed

### Verifying Connectivity

From a client machine, test the connection:

```
telnet <license-server-hostname> 28000
```

If telnet connects (you'll see a blank window or a prompt), the port is open. If it times out, check the server firewall rules.

You can also use the LMTOOLS utility on the client to perform a Status Enquiry against the remote server.

## Configuring the Options File

The options file (`ugslmd.opt`) controls advanced license behaviors: borrowing, timeout, reservation, and exclusion. This is where you customize the license server to match your organization's policies.

### Enabling License Borrowing

By default, borrowing may not be enabled in your license file. Check the INCREMENT lines in your license file for the `BORROW` keyword:

```
INCREMENT nx_flex3 ugslmd 2306.0 permanent 50 BORROW=720 \
  VENDOR_STRING=... SIGN=...
```

The `BORROW=720` means licenses can be borrowed for up to 720 hours (30 days). If `BORROW` is not present, contact Siemens to have it added to your license file.

### Setting a Timeout

A timeout automatically releases licenses from inactive users. This prevents users who leave NX open overnight from holding licenses that others need.

Create or edit `ugslmd.opt` in the same directory as your license file:

```
# Release licenses after 2 hours of inactivity
TIMEOUT nx_flex3 7200
TIMEOUT nx_cam 7200
TIMEOUT nx_die 7200
```

The value is in seconds (7200 = 2 hours). Be careful not to set this too low — users who are running long simulations or CAM toolpath calculations may appear inactive to the license manager.

### Reserving Licenses for Groups

If you have departments that need guaranteed license availability:

```
# Reserve 5 NX licenses for the CAM team
RESERVE 5 nx_flex3 GROUP cam_team

# Define the group
GROUP cam_team user1 user2 user3 user4 user5
```

### Excluding Users

```
# Exclude a specific user
EXCLUDE nx_flex3 user_who_left_company
```

After editing the options file, restart the license server service or use LMTOOLS to reread the file: **Reread License File** button in the Server Status tab.

## Client Configuration

On each NX workstation, set the `SPLM_LICENSE_SERVER` environment variable:

1. **System Properties → Advanced → Environment Variables**
2. Under System Variables, create:
   - Name: `SPLM_LICENSE_SERVER`
   - Value: `28000@license-server-hostname`
3. If you have multiple license servers (e.g., for different NX versions):
   - Value: `28000@server1;28000@server2`
4. Restart NX for the change to take effect

### Common Client Issues

**"License request failed for feature"**: The client can't reach the server. Check:
- The `SPLM_LICENSE_SERVER` variable is spelled correctly
- The hostname resolves (try `ping license-server-hostname`)
- Port 28000 is reachable (try `telnet license-server-hostname 28000`)
- The license server service is running (check on the server)

**"Invalid host"**: The license file's SERVER line specifies a different hostname or MAC address than the actual server. This can happen if the server's network adapter was replaced or if the server was migrated to new hardware. Contact Siemens to rehost the license.

## Diagnostic Commands

I use these commands regularly to troubleshoot license issues:

```bash
# Check if the license server is running
ugslmd -diag

# List all currently checked-out licenses
lmutil lmstat -a -c 28000@license-server-hostname

# List available features
lmutil lmstat -f -c 28000@license-server-hostname

# Check a specific user's license usage
lmutil lmstat -u username -c 28000@license-server-hostname
```

## Monitoring License Usage

I run a monthly license usage audit to ensure we have enough licenses and that users aren't hoarding them. Here's my process:

### Generating a Usage Report

1. On the license server, run:
   ```
   lmutil lmstat -a -c 28000@localhost > license_report.txt
   ```
2. The report shows:
   - Each checked-out license feature
   - The user who checked it out
   - The machine name
   - The checkout time
   - The number of licenses in use vs. total
3. Parse the report to find:
   - Users with licenses checked out for more than 24 hours (possible hoarding)
   - Features that are consistently at 90%+ utilization (need more licenses)
   - Features that are never used (consider reducing license count)

### Setting Up Email Alerts

I use a simple Python script to check license availability and send an email alert when licenses are running low:

```python
import subprocess
import smtplib

result = subprocess.run(
    ['lmutil', 'lmstat', '-a', '-c', '28000@localhost'],
    capture_output=True, text=True
)

# Parse the output for available licenses
# If available < 5, send alert
if available_licenses < 5:
    msg = f"Warning: Only {available_licenses} NX licenses available"
    # Send email via SMTP
    server = smtplib.SMTP('mail.company.com', 25)
    server.sendmail('license-alert@company.com', 
                    'cad-admin@company.com', msg)
    server.quit()
```

Schedule this script with Windows Task Scheduler to run every hour during business hours.

## Common Configuration Mistakes

### 1. Using IP Address Instead of Hostname
Some administrators use `SPLM_LICENSE_SERVER=28000@192.168.1.100` instead of `28000@license-server`. If the server's IP address changes (DHCP renewal, server migration), all clients stop working. Always use the hostname — DNS is more stable than IP addresses.

### 2. Not Opening the VENDOR Port
The FlexLM system uses two ports: the main port (28000) and the vendor daemon port (which is random by default). If you only open port 28000 on the firewall, the vendor daemon port is blocked and license checkouts fail intermittently. Fix this by setting a static vendor port in the license file:
```
VENDOR ugslmd PORT=27800
```
Then open both ports 28000 and 27800 on the firewall.

### 3. Multiple License Files Conflicting
If you have license files from different Siemens products (NX, Teamcenter, Tecnomatix) on the same server, they may conflict. Combine all license files into a single file, or use the `LM_LICENSE_FILE` environment variable to point to multiple files separated by semicolons.

## Summary

A properly configured SPLM License Server should be invisible to users — NX starts, licenses check out, and nobody thinks about it. The key configuration points are: open port 28000 on the server firewall, set the `SPLM_LICENSE_SERVER` environment variable on all clients, enable borrowing in the options file if users work remotely, and set a reasonable timeout to reclaim idle licenses. Run the diagnostic commands regularly to catch issues before they become user complaints.
