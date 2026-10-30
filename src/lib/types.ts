// Auto-extracted from data.ts by scripts/phase8_split_data.js.
// Shared types used across data modules and UI.
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type PricingType =
  | "Free"
  | "Open Source"
  | "Freemium"
  | "Subscription"
  | "Perpetual"
  | "Subscription / Perpetual";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  short_desc: string;
  description: string;
  category_id: string;
  pricing_type: PricingType;
  /**
   * INTERNAL BENCHMARK ONLY — NEVER RENDER THIS AS A PRICE.
   *
   * Vendor prices change constantly and differ by country, currency, tax and
   * reseller, so the site never publishes a figure. This number exists purely
   * as a relative magnitude anchor for machine logic: directory sorting,
   * budget filtering, "cheaper than X" comparison verdicts, SEO collection
   * thresholds and the TCO calculator.
   *
   * Any user-facing price must link to the vendor's official pricing page
   * (`pricing_url`) instead. See `price_tier` for the coarse, stable
   * low/mid/high/quote/free bucket that IS safe to display.
   */
  starting_price: number;
  /** What starting_price denotes: monthly subscription, annual subscription, or one-time buyout. */
  price_period?: "month" | "year" | "one-time";
  platforms: string[];
  industries: string[];
  core_features: string[];
  user_scales: string[];
  official_url: string;
  affiliate_url: string | null;
  pricing_url?: string;
  trial_url?: string;
  donate_url?: string;
  release_notes_url?: string;
  system_reqs_url?: string;
  price_tier?: "free" | "low" | "mid" | "high" | "quote";
  score: number;
  pros: string[];
  cons: string[];
  faqs: { q: string; a: string }[];
  tech_specs?: {
    engine: string; // Geometry Kernel (e.g. Parasolid, ACIS)
    multicore: string; // Multi-threading support level
    gpu_optimization: string; // GPU acceleration type
    standards: string[]; // Industry standards supported (e.g. IFC4, STEP)
  };
  expert_verdict?: string; // Professional expert verdict
  country?: string;
  pricing_tiers?: {
    name: string;
    price: string;
    period: string;
    features: string[];
    is_popular?: boolean;
  }[];
  detailed_features?: {
    category: string;
    items: { name: string; status: boolean }[];
  }[];
  alternatives?: string[]; // slugs of similar tools
  pricing_breakdown?: {
    tier: string;
    price: string;
    notes: string;
  }[];
  key_capabilities?: string[];
  features?: string[];

  // --- Extended product metadata (Phase 4) --------------------------------
  // All optional. Tools that have these populated render extra detail
  // sections (Compatibility, Trust & Support) and richer sidebar badges.
  // Tools without them fall back gracefully to the original layout.

  /**
   * DO NOT RE-ADD: `version` and `free_trial_days` were removed on purpose.
   * Volatile vendor-controlled facts (version numbers, prices, trial lengths,
   * regional availability) must never be hard-coded into tool data — the site
   * links to the vendor's official pricing / trial / download page instead so
   * the information never goes stale.
   */
  /** ISO yyyy-mm-dd date when this listing was last hand-verified. */
  last_updated?: string;
  /** True when the vendor has end-of-lifed / stopped selling the product. */
  discontinued?: boolean;
  /** Short human-readable note explaining the discontinuation (shown on the detail page). */
  discontinued_note?: string;
  /** True when the product is commercial but has no public list price (contact vendor for a quote). */
  quote_only?: boolean;

  /** Interface / documentation languages supported. */
  languages?: string[];

  /** File formats the tool can import. */
  file_formats_in?: string[];
  /** File formats the tool can export / save to. */
  file_formats_out?: string[];

  /** Third-party systems this tool natively integrates with. */
  integrations?: string[];

  /** Deployment topologies offered. */
  deployment_options?: (
    | "Desktop"
    | "Cloud"
    | "On-Premise"
    | "Hybrid"
    | "Mobile"
    | "Web"
  )[];

  /** License kinds offered by the vendor. */
  license_types?: (
    | "Perpetual"
    | "Subscription"
    | "Educational"
    | "Commercial"
    | "Open-Source"
    | "Free"
    | "Network"
    | "Floating"
  )[];

  /** Marketing / product screenshots (used on the detail page gallery). */
  screenshots?: { url: string; alt: string; caption?: string }[];

  /**
   * Third-party review aggregator ratings. `score` is on the source's
   * own scale (G2: 0-5, Gartner: 0-5, Capterra: 0-5). `count` is the
   * total number of customer reviews backing the score.
   */
  external_ratings?: {
    source:
      | "G2"
      | "Capterra"
      | "TrustRadius"
      | "Trustpilot"
      | "Gartner Peer Insights"
      | "Software Advice"
      | "GetApp"
      | "SourceForge";
    score: number;
    max: number;
    count: number;
    url?: string;
  }[];

  /** Support channels the vendor offers. */
  support_channels?: (
    | "Email"
    | "Phone"
    | "Chat"
    | "Community"
    | "Documentation"
    | "Training"
    | "Knowledge Base"
    | "Reseller Network"
  )[];

  /**
   * Security / compliance certifications the vendor publicly claims
   * (e.g. 'SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA', 'FedRAMP').
   */
  security_compliance?: string[];

  /** API / SDK availability for programmatic access and extensions. */
  api_sdk?: {
    has_api: boolean;
    has_sdk: boolean;
    /** Wire protocol if has_api. */
    api_type?: string;
    /** SDK language bindings if has_sdk. */
    sdk_languages?: string[];
    /** URL to public API docs. */
    docs_url?: string;
  };
}
