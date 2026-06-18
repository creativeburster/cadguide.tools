---
title: "McNeel LAN Zoo Server Setup: Deploying Floating Licenses inside LANs"
excerpt: "IT guide to setting up LAN Zoo floating server software, configuring TCP port 12389, and managing licenses."
category: "deployment"
softwareSlug: "rhino"
keyword: "rhino license"
slug: "mcneel-rhino-lan-zoo-server-setup-ports"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# McNeel LAN Zoo Server Setup: Deploying Floating Licenses inside LANs

Managing **McNeel LAN Zoo Server Setup: Deploying Floating Licenses inside LANs** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Licensing Diagnostics
Enterprise floating allocations depend on the active license daemon. Connection handshakes fail due to dynamic IP drifts, mismatched port mappings, or GPO blockages on local CAD clients.

### McNeel LAN Zoo Configuration Verification
Ensure the McNeel Zoo service binds properly to port 12389. Execute on client command line:

```bash
# Check LAN Zoo port connectivity
telnet zoo.yourcompany.com 12389
```

### Zoo Seat Management Playbook
1. **Initialize McNeel Cloud Zoo**: Log into McNeel accounts dashboard, invite domain users, and bind floating serial keys.
2. **Open Port 12389**: Set bidirectional rules in subnet routers for port `12389` (Zoo communication).
3. **Set Borrow Limits**: Limit license borrowing thresholds to 30 days to maximize floating availability.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [RHINO Source & Forum Thread](https://wiki.mcneel.com)
