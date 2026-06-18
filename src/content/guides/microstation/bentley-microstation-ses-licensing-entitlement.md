---
title: "Bentley SES Entitlement Licensing Setup: Configuring Client Workstations"
excerpt: "IT setup guide to Bentley SES (Subscription Entitlement Service), managing logins, and checkout times."
category: "procurement"
softwareSlug: "microstation"
keyword: "microstation license"
slug: "bentley-microstation-ses-licensing-entitlement"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# Bentley SES Entitlement Licensing Setup: Configuring Client Workstations

Managing **Bentley SES Entitlement Licensing Setup: Configuring Client Workstations** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Licensing Diagnostics
Enterprise floating allocations depend on the active license daemon. Connection handshakes fail due to dynamic IP drifts, mismatched port mappings, or GPO blockages on local CAD clients.

### Bentley SES Proxy Whitelist Rules
Bentley SES uses HTTPS to validate connection slots. Ensure company proxies pass these endpoints:

```text
https://ims.bentley.com
https://buddi.bentley.com
https://ssologin.bentley.com
```

### Bentley SES Deployment Playbook
1. **Setup Connection Client**: Install the latest Bentley Connection Client silently across workstations.
2. **Assign User Entitlements**: Use Bentley Admin Portal to allocate OpenRoads and MicroStation seats to AD groups.
3. **Checkout Licenses**: For offline workstations, check out node keys using Bentley Licensing Tool before offline travel.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [MICROSTATION Source & Forum Thread](https://communities.bentley.com)
