Title: Building a Niche SaaS Directory With Next.js and Zero Infrastructure

Subtitle: 170+ CAD tools, 480+ free calculators, 1,000+ static pages — no servers, no database, no monthly hosting bill. Here's the architecture and the trade-offs nobody mentions.

The standard advice for building a software directory is: pick a CMS, provision a database, deploy a backend. For CADGuide.tools — a comparison platform for CAD, BIM, and CAE software — we did the opposite, and it runs 1,000+ pages from a CDN for exactly $0 a month in hosting.

This is the architecture, why we chose it, and the trade-offs you accept.

## The stack

- **Next.js** with full static export — every URL becomes an HTML file at build time
- **Cloudflare Pages** free tier for hosting
- **Tool data as typed TypeScript modules** — 170+ CAD tool profiles compiled into the build
- **No runtime database, no server-side code** — the only "dynamic" thing is a tiny redirect bridge for outbound affiliate links

## What the numbers look like

- 1,045 static pages: 170+ tool profiles, 480+ client-side engineering utilities, 80 head-to-head comparison pages
- Build time: a couple of minutes for the whole site
- Hosting cost: $0. Domain: ~$10/year
- Content updates: edit a data file, rebuild, push — Cloudflare deploys automatically, and an IndexNow ping tells Bing and Yandex what changed

## Why static won for a directory

Directories are read-mostly by nature. Visitors compare tools, run calculators, read guides. Almost nobody needs to write data during their visit. If your write path is "the site owner edits a file and rebuilds," a runtime database buys you nothing but cost and attack surface.

The architecture also forces a useful discipline: every claim on a page traces back to a typed data structure that went through code review. When someone asks "where does this pricing number come from?", the answer is a git blame, not a CMS audit.

## The parts people don't mention

**Static isn't one decision, it's a hundred.** Search is the first one to bite. There's no server to query, so we pre-build a JSON search index and load it client-side. For a few hundred records, a 100 KB index with fuzzy matching beats the latency of any hosted search API — and costs nothing.

**Affiliate links need a server-shaped exception.** We route outbound partner links through a single redirect function so they can be audited and swapped without rebuilding. That one function is the entire "backend."

**Formulas belong in the browser.** The 480+ calculators (K-factor bend allowance, beam deflection, bearing life, a DWG version checker that reads 6 bytes of a file locally) all run client-side. Nothing uploads, which matters for engineers handling confidential drawings, and it means traffic spikes are the CDN's problem, not ours.

**Rebuilds are your deploy pipeline and your CMS.** This is the real trade-off: content changes require a rebuild. If your team needs to publish twenty times a day from a WYSIWYG editor, static will hurt. We publish a few times a week, so a two-minute build is a feature — it makes content changes reviewable and reversible.

## What we'd do again, and what we wouldn't

We'd choose static export, typed data files, and edge hosting again without hesitation. The total bill — a domain and nothing else — changes how many experiments you can afford to run.

The one thing we underestimated: how much of "directory quality" is data hygiene, not infrastructure. Version numbers drift, pricing changes, features get renamed. The stack makes publishing cheap; keeping 170+ tool records truthful is the actual ongoing work. Budget for that, wherever you host.

If you want to see the result: [CADGuide.tools](https://cadguide.tools) — compare CAD tools side by side or try the free client-side engineering toolbox. Every page loads from the edge, and none of them touched a server.
