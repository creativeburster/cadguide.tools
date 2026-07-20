---
title: "Altium 365 Connection Errors: Portal365, SSL, and Firewall Troubleshooting"
excerpt: "Fix common Altium 365 connection errors including portal365.altium.com resolution failures, SSL certificate issues, proxy conflicts, and firewall blocking with step-by-step network troubleshooting."
category: "troubleshooting"
softwareSlug: "altium-365"
keyword: "altium 365 connection error portal365 troubleshooting"
slug: "altium-365-connection-errors-portal365-ssl-firewall-troubleshooting"
author: "CADGuide Tools Editorial Team"
readTime: "8 min read"
date: "2026-07-13"
sources:
  - "https://www.altium.com/documentation/knowledge-base/altium-designer/troubleshoot-error-from-portal365-altium-com"
  - "https://www.altium.com/documentation/knowledge-base/altium-365/lost-connection-to-altium-365-while-working"
---

# Altium 365 Connection Errors: Portal365, SSL, and Firewall Troubleshooting

Altium 365 relies on a constant connection to Altium's cloud infrastructure. When that connection breaks, you'll see errors that can range from annoying to workflow-stopping. I've dealt with these issues across multiple corporate environments, and the root causes are almost always network-related.

## Common Error Messages

The most frequent connection errors all point to the same underlying issue — your machine can't reach Altium's servers:

- "Error from portal365.altium.com: The server name could not be resolved"
- "Error from portal365.altium.com: The attempt to connect to the server failed"
- "Error from portal365.altium.com: A secure channel could not be established"
- "Error from portal365.altium.com: Server SSL certificate is invalid"
- "ERR_TOO_MANY_REDIRECTS" when accessing the Workspace in a browser

## Step 1: Verify Basic Connectivity

Open a web browser and navigate to `https://portal365.altium.com`. You should see a plain "OK" message. If the page doesn't load, the problem is network-level.

Click the lock icon next to the URL and confirm the certificate is issued by Amazon (Altium uses AWS infrastructure). If the certificate is from your company's proxy or firewall, that's your culprit — the proxy is intercepting and replacing the SSL certificate.

## Step 2: Check Firewall and Port Configuration

Have your IT team verify that the following URLs and ports are accessible:

- `portal365.altium.com` — HTTPS (443)
- `altium365.com` — HTTPS (443)
- `*.altium.com` — HTTPS (443)

Corporate firewalls often block outbound HTTPS traffic to unknown domains by default. The IT team needs to add these URLs to the allowlist.

## Step 3: Antivirus and Proxy Interference

Antivirus software with web filtering (Kaspersky, ESET, Bitdefender) can intercept SSL connections and replace certificates. This breaks Altium's secure channel check. Solutions:

- Add `portal365.altium.com` and `altium365.com` to the antivirus exclusion list
- Disable SSL scanning for Altium-related traffic
- If using a corporate proxy, ensure it's configured correctly in Windows Internet Options

## Step 4: Enable TLS 1.2

Altium 365 requires TLS 1.2. On older Windows systems, it may not be enabled by default:

1. Press Win+I to open Windows Settings
2. Search for "Internet Options" and launch the Internet Properties panel
3. Go to the Advanced tab
4. Scroll to the Security section
5. Confirm "Use TLS 1.2" is checked

After enabling, restart Altium Designer.

## Step 5: Registry Fix for Stubborn Proxy Issues

One customer reported resolving a persistent connection error by deleting two registry keys and restarting:

- `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\Connections\SavedLegacySettings`
- `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\Connections\DefaultConnectionSettings`

This resets Windows proxy configuration to defaults. Only do this with IT support — editing the registry can cause other issues.

## ERR_TOO_MANY_REDIRECTS

This browser-specific error occurs when accessing the Workspace web interface. The fix:

1. Try clearing browser cookies first (as the error message suggests)
2. If that doesn't work, remove the user from the Workspace and re-invite them
3. Go to the Altium 365 Workspace members page, click the user, Remove, then Invite again
4. The user signs out, reopens the browser, and signs in again
5. Alternatively, clear the server cache in Preferences > Data Management > Servers > Clear Cache

Note: removing a user from the Workspace means they lose ownership of items they previously released or commented on, though the items themselves remain.

## Offline Work During Outages

When the connection is lost mid-work, Altium 365's Git-based architecture allows continued local editing. Checked-out projects remain fully editable. When connectivity returns, local changes are committed and pushed to the Workspace automatically.

The limitation is that managed components are not accessible while offline — only components cached locally on your workstation. Use cached components cautiously to avoid discrepancies.

## When to Contact Altium Support

If you've exhausted all the steps above and the error persists:

- Test on a different PC on the same network — if it fails too, it's network-wide
- Test on a different network entirely — if it works, it's your corporate network
- Check the Altium Status History page for reported incidents
- Contact Altium support with screenshots of the error and your network configuration
