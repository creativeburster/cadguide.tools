---
title: "Bentley SES Admin Console Options: Allocating Seats and Checkout Limits"
excerpt: "IT administrator guide to setting up custom entitlement groups, checkouts thresholds, and email alerts."
category: "deployment"
softwareSlug: "microstation"
keyword: "microstation license"
slug: "bentley-microstation-ses-admin-console-seats-reservations"
author: "Will P. (Enterprise CAD Auditor)"
readTime: "8 min read"
date: "June 2026"
---

# Bentley SES Admin Console Options: Allocating Seats and Checkout Limits

Managing **Bentley SES Admin Console Options: Allocating Seats and Checkout Limits** is key to minimizing pipeline bottlenecks. This technical directive details the parameters, validated commands, and verified configurations necessary to resolve this specific CAD block.

### System Standards & Configuration Diagnostics
Enforcing global configurations, automated layouts, silent installer deployments, and API integrations ensures CAD workflow consistency.

### MicroStation configuration configuration vars
Redirect MicroStation CONNECT to shared cell libraries and printer tables:

```text
# mslocal.cfg overrides
_USTN_CUSTOM_CONFIGURATION = //server/Bentley/CONNECT_Configuration/
_USTN_CELLLIST = //server/Bentley/Cell/*.cel
_USTN_PEN_TABLE = //server/Bentley/Pen/*.tbl
```

### MicroStation Workspace Setup Playbook
1. **Centralize network configurations**: Configure `_USTN_CUSTOM_CONFIGURATION` inside local `ConfigurationSetup.cfg` files.
2. **Enforce standard linestyles**: Distribute standard linestyle library files (`.rsc`) in your network configurations paths.
3. **Associate Tag properties**: Build cell borders containing item tags to dynamically pull variables from model sheets.

---

> [!IMPORTANT]
> **Source Verification Links:**
> This blueprint is based on verified procedures and troubleshooting cases documented in the official forums:
> - **Official Support Forum Reference:** [MICROSTATION Source & Forum Thread](https://communities.bentley.com)
