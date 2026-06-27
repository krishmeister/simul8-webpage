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
// SCENARIO 1 — Loudmouth Co. (Gen-Z oversized tees)
// ----------------------------------------------------------------------------

const input_tees: InputDetail = {
  scenarioId: "tees",
  components: [
    {
      component: "External",
      summary: "Festive timing and apparel seasonality — the macro backdrop for a Diwali question.",
      subBoxes: [
        { box: "Public authoritative", relevant: true, contributed: "The Diwali festive calendar (exact dates, the run-up window) and apparel demand seasonality from macro retail indicators — establishing that this is a high-attention, high-spend window." },
        { box: "Economic activity", relevant: false, contributed: "" },
        { box: "Prediction markets", relevant: false, contributed: "" },
        { box: "Licensed feeds", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Category",
      summary: "Gen-Z streetwear price behavior — the priors for how this category responds to a discount.",
      subBoxes: [
        { box: "Expert panel", relevant: true, contributed: "Day-zero priors from D2C apparel operators on how Gen-Z streetwear responds to festive discounts — the starting elasticity range before Loudmouth's own data refines it." },
        { box: "Helium-ish tool", relevant: true, contributed: "Anonymized cohort data from comparable Indian apparel operators — how similar brands' discounts converted during past festive windows." },
        { box: "Validated research", relevant: true, contributed: "Peer-reviewed price-elasticity studies for apparel; the meta-analysis sub-source supplied a pre-weighted elasticity of ≈ −1.4 for discretionary fashion." },
        { box: "Competitive structure", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Product",
      summary: "Loudmouth's own selling history — what makes the answer specific to them.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Loudmouth's Shopify history — past oversized-tee prices, conversion rates, units sold, and crucially what happened in last year's Diwali window at the then-current price." },
        { box: "Marketing & acquisition", relevant: true, contributed: "Current traffic and conversion on the tee line, so the model knows the demand pool the discount acts on." },
        { box: "Operations & supply", relevant: false, contributed: "" },
        { box: "AI interview", relevant: true, contributed: "Riya's margin floor on the tees — confirming a 15% cut is survivable and what break-even units look like at the new price." },
      ],
    },
    {
      component: "Linking",
      summary: "Fuses the festive backdrop, the category elasticity priors, and Loudmouth's own conversion history into one query-time picture the engines can act on.",
      subBoxes: [
        { box: "Fuses the three sources", relevant: true, contributed: "Combined External seasonality + Category elasticity priors + Loudmouth's own festive history into a single coherent input for this specific question." },
        { box: "Pre-built recipe", relevant: true, contributed: "The standing structure for how apparel-pricing inputs combine — maintained ahead of time, not built per query." },
        { box: "Applied live", relevant: true, contributed: "Loudmouth's fresh numbers fused with the stored priors at query time to produce their specific forecast." },
      ],
    },
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
    update: "ABM's weight for festive Gen-Z apparel questions ticks up; the conservative engines' slightly down. The next Loudmouth-style question routes a little more toward the cascade signal. The log records all of it, tamper-evident.",
  },
  highlightNodeIds: ["output", "vault-log", "vault-calibration"],
};

// ----------------------------------------------------------------------------
// SCENARIO 2 — Macrofuel (protein / subscriptions)
// ----------------------------------------------------------------------------

const input_protein: InputDetail = {
  scenarioId: "protein",
  components: [
    {
      component: "External",
      summary: "Light touch — a channel-mix question doesn't lean on seasonal or macro data.",
      subBoxes: [
        { box: "Public authoritative", relevant: false, contributed: "" },
        { box: "Economic activity", relevant: false, contributed: "" },
        { box: "Prediction markets", relevant: false, contributed: "" },
        { box: "Licensed feeds", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Category",
      summary: "Channel-substitution priors and CAC benchmarks for D2C supplements.",
      subBoxes: [
        { box: "Expert panel", relevant: true, contributed: "Operator priors on how supplement brands' acquisition behaves when spend moves between Meta and Google." },
        { box: "Helium-ish tool", relevant: true, contributed: "Cohort data on channel mix and CAC across comparable D2C supplement brands." },
        { box: "Validated research", relevant: true, contributed: "Validated channel-substitution studies — how cross-channel reallocation typically affects acquisition cost and quality." },
        { box: "Competitive structure", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Product",
      summary: "Macrofuel's own channel performance and retention — the heart of this answer.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Subscription and order history from Razorpay, including the retention curve — how long subscribers stay, which feeds the lifetime-value side of the answer." },
        { box: "Marketing & acquisition", relevant: true, contributed: "12 months of Meta and Google Ads performance — ROAS and CAC by channel, the core inputs for a reallocation question." },
        { box: "Operations & supply", relevant: false, contributed: "" },
        { box: "AI interview", relevant: true, contributed: "Arjun's true per-subscriber economics and his goal (lifetime value, not raw acquisition count) — which reframes what 'success' means for this question." },
      ],
    },
    {
      component: "Linking",
      summary: "Fuses the category channel-substitution priors with Macrofuel's own channel-and-retention data — the combination that surfaces the quality-vs-quantity trade-off.",
      subBoxes: [
        { box: "Fuses the three sources", relevant: true, contributed: "Combined Category CAC priors + Macrofuel's channel performance + its retention-by-source curve into one picture." },
        { box: "Pre-built recipe", relevant: true, contributed: "The standing structure for channel-reallocation inputs." },
        { box: "Applied live", relevant: true, contributed: "Macrofuel's current channel numbers fused with priors at query time." },
      ],
    },
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
    {
      component: "External",
      summary: "Launch-timing and attention signals for a hype drop.",
      subBoxes: [
        { box: "Public authoritative", relevant: true, contributed: "Launch-window timing and attention/seasonality signals — when a drop lands matters for the frenzy." },
        { box: "Economic activity", relevant: false, contributed: "" },
        { box: "Prediction markets", relevant: false, contributed: "" },
        { box: "Licensed feeds", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Category",
      summary: "Bundle economics and hype-drop sell-through behavior.",
      subBoxes: [
        { box: "Expert panel", relevant: true, contributed: "Operator priors on how hype buyers respond to bundles — the qualitative read that socks may cool a sneaker-focused frenzy." },
        { box: "Helium-ish tool", relevant: true, contributed: "Cohort sell-through data for Indian hype/limited sneaker drops — how fast comparable drops cleared." },
        { box: "Validated research", relevant: true, contributed: "Bundle-economics and decoy-pricing research — how bundling shifts average order value; the academic sub-source supplied the AOV-lift mechanics." },
        { box: "Competitive structure", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Product",
      summary: "Aksh's own drop history — the sell-through curves that anchor the simulation.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Aksh's past limited-drop performance — how fast previous drops sold out, average order value, and return rates." },
        { box: "Marketing & acquisition", relevant: true, contributed: "Instagram-led demand signals — the size of the hype audience the drop will hit." },
        { box: "Operations & supply", relevant: true, contributed: "The limited stock quantity for the drop — the fixed ceiling that defines a sell-out and shapes the frenzy." },
        { box: "AI interview", relevant: true, contributed: "Devika's bundle margin and her two success metrics — total revenue AND sell-through speed — which frame the trade-off the answer must address." },
      ],
    },
    {
      component: "Linking",
      summary: "Fuses bundle-economics priors with Aksh's own drop curves and the fixed stock ceiling — the combination that exposes the revenue-vs-speed tension.",
      subBoxes: [
        { box: "Fuses the three sources", relevant: true, contributed: "Combined bundle/AOV priors + Aksh's drop history + the limited-stock constraint into one input." },
        { box: "Pre-built recipe", relevant: true, contributed: "The standing structure for launch/bundle questions." },
        { box: "Applied live", relevant: true, contributed: "Aksh's drop specifics fused with priors at query time." },
      ],
    },
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
    {
      component: "External",
      summary: "Minimal seasonal dependence — but competitive context matters, sourced via Category.",
      subBoxes: [
        { box: "Public authoritative", relevant: false, contributed: "" },
        { box: "Economic activity", relevant: false, contributed: "" },
        { box: "Prediction markets", relevant: false, contributed: "" },
        { box: "Licensed feeds", relevant: false, contributed: "" },
      ],
    },
    {
      component: "Category",
      summary: "Value-TWS elasticity AND the competitive-structure read — this question's biggest unknown is the rival.",
      subBoxes: [
        { box: "Expert panel", relevant: true, contributed: "Operator priors on how value-TWS buyers respond to a price rise and how rivals typically react to a competitor raising prices." },
        { box: "Helium-ish tool", relevant: true, contributed: "Cohort data on value-electronics price sensitivity across comparable D2C brands." },
        { box: "Validated research", relevant: true, contributed: "Price-elasticity studies for value consumer electronics — the demand-drop mechanics for a +20% move." },
        { box: "Competitive structure", relevant: true, contributed: "THE critical input here: assembled competitor pricing and promo patterns (from cohort data, the expert panel, and ad-library signals) — the read that a rival is likely to discount into Pulsebeat's price gap." },
      ],
    },
    {
      component: "Product",
      summary: "Pulsebeat's sales, AND its inventory reality — the constraint that turns into an unexpected upside.",
      subBoxes: [
        { box: "Commerce & transactions", relevant: true, contributed: "Pulsebeat's flagship earbud sales history across Amazon and its own store — the demand baseline the price rise acts on." },
        { box: "Marketing & acquisition", relevant: false, contributed: "" },
        { box: "Operations & supply", relevant: true, contributed: "Inventory levels and reorder lead times — revealing Pulsebeat was near an inventory ceiling, which is why lower unit velocity becomes a hidden benefit." },
        { box: "AI interview", relevant: true, contributed: "Kabir's true COGS and margin (so the per-unit margin gain is real, not assumed), his stock constraints, and his explicit flag that a competitor discount is likely — the human context no API exposes." },
      ],
    },
    {
      component: "Linking",
      summary: "Fuses elasticity priors, the competitor read, Pulsebeat's sales, and the inventory ceiling into one picture — the richest fusion of the four scenarios, because the question has the most moving parts.",
      subBoxes: [
        { box: "Fuses the three sources", relevant: true, contributed: "Combined Category elasticity + competitive-structure read + Pulsebeat's sales + inventory constraint into one coherent, multi-factor input." },
        { box: "Pre-built recipe", relevant: true, contributed: "The standing structure for price-change-with-constraints questions." },
        { box: "Applied live", relevant: true, contributed: "Pulsebeat's specifics fused with priors and the competitor assumption at query time." },
      ],
    },
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
