// ============================================================================
// Simul8 — "See it in action" : EXPANDED detail
// Part A: per-component input contributions (detailed, sub-stepped)
// Part B: the calibration-loop closing stage
// All content authored to match the architecture. Illustrative numbers only.
// ============================================================================

// For each scenario, what each INPUT COMPONENT and its sub-boxes contributed.
// `relevant: false` boxes should render greyed — the system selecting what matters.

export interface SubBoxContribution {
  box: string;            // sub-box name (matches diagram node)
  relevant: boolean;      // did it contribute to THIS question?
  contributed: string;    // what it gave (empty if not relevant)
}

export interface ComponentContribution {
  component: "External" | "Category" | "Product" | "Linking";
  summary: string;        // one-line: what this component gave overall
  subBoxes: SubBoxContribution[];
}

export interface InputDetail {
  scenarioId: string;
  components: ComponentContribution[];
}

// The closing stage appended to each scenario's flow (Part B).
export interface ClosingStage {
  scenarioId: string;
  caption: string;
  detail: string;
  // resolved-outcome content shown as the loop closes
  resolved: {
    predicted: string;    // what was predicted
    actual: string;       // what actually happened (illustrative)
    gap: string;          // the calibration gap
    update: string;       // how the log re-weights as a result
  };
  highlightNodeIds: string[]; // should light the Vault: output -> log -> calibration
}

// ----------------------------------------------------------------------------
// STANDING CONTEXT — the warehouse, shared across all scenarios.
// External, Category and Linking describe what Simul8 already holds for the D2C
// wedge (India), ingested and refreshed ahead of time — BEFORE any question. So
// these are about availability, not selection: every sub-box is `relevant` here
// (nothing is greyed-by-question at the input stage, because the question isn't
// known yet). The per-question slice is shown later, at the Accumulate stage.
// Product is the one exception — it's per-operator (see each scenario below),
// because the operator provides it directly and it's legitimately known without
// the question.
// ----------------------------------------------------------------------------

const STANDING_EXTERNAL: ComponentContribution = {
  component: "External",
  summary:
    "The standing external backdrop for India — official statistics, the festival/holiday calendar, economic-activity signals, prediction markets, licensed feeds, and category-level chatter and sentiment, scored from third-party-collected signals — ingested and refreshed continuously, before any question.",
  subBoxes: [
    { box: "Public authoritative", relevant: true, contributed: "Government and statutory sources for India — census demographics, RBI releases, official festival/holiday calendars and weather — held and refreshed continuously as the authoritative backdrop any D2C forecast sits inside." },
    { box: "Economic activity", relevant: true, contributed: "Higher-frequency economic-activity signals — challan traces, per-capita income and spending, and how cohorts form and spend — kept current as a live read on demand." },
    { box: "Prediction markets", relevant: true, contributed: "Prices from prediction markets (Polymarket, Kalshi) maintained as a standing crowd-probability signal the engines can weigh when a question calls for it." },
    { box: "Licensed feeds", relevant: true, contributed: "Commercial data held under license (e.g. Bloomberg, Tracxn) — kept available to fill gaps the public and activity layers leave open." },
    { box: "Category Chatter & Trends", relevant: true, contributed: "Category-level mood and momentum — collected by third-party social-listening tools, scored by the LLM for sentiment and themes. Held standing as backdrop perception for the D2C wedge: whether the category is trending up or cooling, and what's moving in the cultural conversation." },
  ],
};

const STANDING_CATEGORY: ComponentContribution = {
  component: "Category",
  summary:
    "The standing category knowledge for the D2C wedge — day-zero priors, compounding cohort data, validated research and a competitive-structure read — built up and maintained ahead of time, before any operator asks anything.",
  subBoxes: [
    { box: "Expert panel", relevant: true, contributed: "A curated expert panel's day-zero priors for D2C categories — informed starting estimates the system holds so it can say something useful from the very first question." },
    { box: "Helium-ish tool", relevant: true, contributed: "Anonymized cohort data from comparable Indian D2C operators, compounding over time — a standing instrument whose priors sharpen as more operators contribute." },
    { box: "Validated research", relevant: true, contributed: "Peer-reviewed academic work, industry studies and meta-analyses vetted for D2C categories — the slow-moving, high-confidence evidence base kept on hand." },
    { box: "Competitive structure", relevant: true, contributed: "A maintained read of the competitive landscape — assembled from cohort data, the expert panel and ad-library signals — describing who the players are and how they behave." },
  ],
};

const STANDING_LINKING: ComponentContribution = {
  component: "Linking",
  summary:
    "How the standing sources are pre-fused into one query-time picture — the join layer that combines External backdrop, Category priors and Product data, engineered ahead of time as a reusable recipe.",
  subBoxes: [
    { box: "Fuses the three sources", relevant: true, contributed: "The standing join that combines External backdrop, Category priors and Product data into one coherent picture — the substrate every engine reads from." },
    { box: "Pre-built recipe", relevant: true, contributed: "The linking structure is maintained ahead of time as a reusable recipe — relationships between sources engineered in advance, not improvised per query." },
    { box: "Applied live", relevant: true, contributed: "At query time the pre-built recipe is applied to the operator's freshest data and fused on demand — so the unified picture is always current." },
  ],
};

// ----------------------------------------------------------------------------
// SCENARIO 1 — Loudmouth Co. (Gen-Z oversized tees)
// ----------------------------------------------------------------------------

const input_tees: InputDetail = {
  scenarioId: "tees",
  components: [
    STANDING_EXTERNAL,
    STANDING_CATEGORY,
    {
      component: "Product",
      summary: "Loudmouth's own selling history — what makes the answer specific to them.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Loudmouth's Shopify history — past oversized-tee prices, conversion rates, units sold, and crucially what happened in last year's Diwali window at the then-current price." },
        { box: "Marketing & acquisition", relevant: true, contributed: "Current traffic and conversion on the tee line, so the model knows the demand pool the discount acts on." },
        { box: "Operations & supply", relevant: false, contributed: "" },
        { box: "AI interview", relevant: true, contributed: "Riya's margin floor on the tees — confirming a 15% cut is survivable and what break-even units look like at the new price." },
        { box: "Brand & Perception", relevant: true, contributed: "Loudmouth's current brand sentiment — reviews and social mentions, scored for mood. Right now it reads strongly positive (the latest drop landed well with Gen-Z), which is part of why the cascade upside is real. Enters as an input to the units forecast — never a target." },
      ],
    },
    STANDING_LINKING,
  ],
};

const closing_tees: ClosingStage = {
  scenarioId: "tees",
  caption: "The outcome resolves — and the system learns…",
  detail: "Diwali passes. Loudmouth's actual unit sales flow back automatically from Shopify — no one has to report them. The system compares what it predicted against what happened, and writes the result into the Log. The Calibration engine grades it: was the forecast accurate, and was the confidence honest? The answer re-weights every engine for the next apparel-pricing question. This is the loop that makes Simul8 compound — and the one thing a competitor can't fake.",
  resolved: {
    predicted: "≈ 4,200 units, range 3,300–5,400, 69% confidence",
    actual: "4,560 units sold over the Diwali window",
    gap: "Within the credible range, in the upper half — the ABM upside (the Gen-Z cascade) proved closer to right than the conservative engines. Confidence was honest: a 69%-confidence call landing in-range is exactly calibrated.",
    update: "ABM's weight for festive Gen-Z apparel questions ticks up; the conservative engines' slightly down. The next Loudmouth-style question routes a little more toward the cascade signal. The log records all of it, tamper-evident. The brand-sentiment signal also earned its keep — it tracked the real lift, so its outcome-validated relationship now flows into the cohort layer. The raw sentiment score never does; only what reality confirmed.",
  },
  highlightNodeIds: ["output", "vault-log", "vault-calibration"],
};

// ----------------------------------------------------------------------------
// SCENARIO 2 — Macrofuel (protein / subscriptions)
// ----------------------------------------------------------------------------

const input_protein: InputDetail = {
  scenarioId: "protein",
  components: [
    STANDING_EXTERNAL,
    STANDING_CATEGORY,
    {
      component: "Product",
      summary: "Macrofuel's own channel performance and retention — the heart of this answer.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Subscription and order history from Razorpay, including the retention curve — how long subscribers stay, which feeds the lifetime-value side of the answer." },
        { box: "Marketing & acquisition", relevant: true, contributed: "12 months of Meta and Google Ads performance — ROAS and CAC by channel, the core inputs for a reallocation question." },
        { box: "Operations & supply", relevant: false, contributed: "" },
        { box: "AI interview", relevant: true, contributed: "Arjun's true per-subscriber economics and his goal (lifetime value, not raw acquisition count) — which reframes what 'success' means for this question." },
        { box: "Brand & Perception", relevant: true, contributed: "Macrofuel's brand sentiment — review and social mood. Relevant here mainly to retention: how subscribers feel about the brand affects whether they stay, feeding the lifetime-value side. An input, not a target." },
      ],
    },
    STANDING_LINKING,
  ],
};

const closing_protein: ClosingStage = {
  scenarioId: "protein",
  caption: "The outcome resolves — and the system learns…",
  detail: "A quarter passes. Macrofuel's actual new-subscriber count and the retention of the Google-acquired cohort flow back from Razorpay. The system checks both halves of its two-part prediction — the raw count AND the quality claim — and writes the result to the Log. Calibration grades whether the 'fewer but better' call held, and re-weights accordingly. The two-part honesty either earns trust or gets corrected — provably.",
  resolved: {
    predicted: "−4% raw subscribers, +11% retained value, 74% confidence",
    actual: "−3% raw subscribers; Google cohort retention tracking +13% on value",
    gap: "Both halves landed in range — the quality-over-quantity thesis held. Supervised ML's retention-scoring call was vindicated; the raw-count estimate was slightly conservative.",
    update: "Supervised ML's weight for channel-quality questions rises. The log now has a resolved data point that future supplement-channel questions calibrate against — the context graph gets one notch richer.",
  },
  highlightNodeIds: ["output", "vault-log", "vault-calibration"],
};

// ----------------------------------------------------------------------------
// SCENARIO 3 — Aksh Footwear (hype sneaker drop)
// ----------------------------------------------------------------------------

const input_sneakers: InputDetail = {
  scenarioId: "sneakers",
  components: [
    STANDING_EXTERNAL,
    STANDING_CATEGORY,
    {
      component: "Product",
      summary: "Aksh's own drop history — the sell-through curves that anchor the simulation.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Aksh's past limited-drop performance — how fast previous drops sold out, average order value, and return rates." },
        { box: "Marketing & acquisition", relevant: true, contributed: "Instagram-led demand signals — the size of the hype audience the drop will hit." },
        { box: "Operations & supply", relevant: true, contributed: "The limited stock quantity for the drop — the fixed ceiling that defines a sell-out and shapes the frenzy." },
        { box: "AI interview", relevant: true, contributed: "Devika's bundle margin and her two success metrics — total revenue AND sell-through speed — which frame the trade-off the answer must address." },
        { box: "Brand & Perception", relevant: true, contributed: "Aksh's brand sentiment and hype signals — for a limited drop, mood is central: how much heat surrounds the brand directly shapes the frenzy. Strongly informs the agent-based cascade. An input, never a target." },
      ],
    },
    STANDING_LINKING,
  ],
};

const closing_sneakers: ClosingStage = {
  scenarioId: "sneakers",
  caption: "The outcome resolves — and the system learns…",
  detail: "The drop happens. Actual revenue and the exact sell-through time flow back from Shopify. The system compares them to the predicted trade-off and writes the result to the Log. Because Aksh had little bundle history, THIS resolved outcome is especially valuable — it's the first real calibration point for bundle drops, and it sharpens every future one. The wide band the system honestly showed now starts to narrow, earned by evidence.",
  resolved: {
    predicted: "+7% revenue, slightly slower sell-through, 63% confidence (wide band)",
    actual: "+5% revenue; sold out ≈half a day slower than a pure-sneaker drop",
    gap: "In range, toward the conservative end — the ABM caution (socks cool the frenzy) was directionally right; Causal's AOV optimism was slightly high. The honest wide band did its job: the answer didn't overpromise.",
    update: "The thin bundle-drop history gains its first resolved point; the band for the next bundle question narrows. ABM's frenzy-modeling weight for hype drops ticks up. The moat compounds precisely where data was scarcest.",
  },
  highlightNodeIds: ["output", "vault-log", "vault-calibration"],
};

// ----------------------------------------------------------------------------
// SCENARIO 4 — Pulsebeat Audio (TWS earbuds price rise)
// ----------------------------------------------------------------------------

const input_tws: InputDetail = {
  scenarioId: "tws",
  components: [
    STANDING_EXTERNAL,
    STANDING_CATEGORY,
    {
      component: "Product",
      summary: "Pulsebeat's sales, AND its inventory reality — the constraint that turns into an unexpected upside.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Pulsebeat's flagship earbud sales history across Amazon and its own store — the demand baseline the price rise acts on." },
        { box: "Marketing & acquisition", relevant: false, contributed: "" },
        { box: "Operations & supply", relevant: true, contributed: "Inventory levels and reorder lead times — revealing Pulsebeat was near an inventory ceiling, which is why lower unit velocity becomes a hidden benefit." },
        { box: "AI interview", relevant: true, contributed: "Kabir's true COGS and margin (so the per-unit margin gain is real, not assumed), his stock constraints, and his explicit flag that a competitor discount is likely — the human context no API exposes." },
        { box: "Brand & Perception", relevant: true, contributed: "Pulsebeat's brand sentiment — value-buyer mood. Relevant to how price-sensitive buyers react to a rise and a likely competitor discount: a brand they feel warmly about tolerates a price increase better. An input to the revenue forecast." },
      ],
    },
    STANDING_LINKING,
  ],
};

const closing_tws: ClosingStage = {
  scenarioId: "tws",
  caption: "The outcome resolves — and the system learns…",
  detail: "The quarter plays out — and the competitor's actual behavior is now known. Pulsebeat's real revenue flows back from its sales feeds. The system compares the guarded, wide, partly-negative prediction against what happened and writes it to the Log. This is where guarded honesty pays off: if the downside risk it flagged materialized, the system was right to be cautious; if it didn't, the log learns that. Either way, the competitor-response signal gets sharper for the next pricing question.",
  resolved: {
    predicted: "+3% revenue, range −6% to +12%, 58% confidence (guarded)",
    actual: "+1% revenue — the competitor did discount, but less aggressively than the downside case",
    gap: "In range, below the midpoint — the ABM downside warning was justified (the competitor did move), but not the worst case. The guarded confidence was correct: a low-confidence call on a competitor-dependent question is exactly how it should have been framed. The inventory-easing benefit materialized as System Dynamics predicted.",
    update: "The competitor-response model gains a real resolved data point for value-TWS pricing — the highest-value learning, because competitor behavior was the biggest unknown. ABM's weight for competitive-pricing questions firms up. Next time, the band on a similar question is a little tighter, earned.",
  },
  highlightNodeIds: ["output", "vault-log", "vault-calibration"],
};

// ----------------------------------------------------------------------------

export const DEMO_INPUT_DETAIL: InputDetail[] = [
  input_tees,
  input_protein,
  input_sneakers,
  input_tws,
];

export const DEMO_CLOSING_STAGES: ClosingStage[] = [
  closing_tees,
  closing_protein,
  closing_sneakers,
  closing_tws,
];
