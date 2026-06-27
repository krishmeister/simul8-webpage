// ============================================================================
// Simul8 — "See it in action" demo scenarios
// ----------------------------------------------------------------------------
// Four pre-written, illustrative walkthroughs. Each one scripts how a real
// operator question flows through the architecture — input -> orchestrator ->
// engines -> fusion -> output — and what each stage produces.
//
// IMPORTANT: these are ILLUSTRATIVE. The numbers model what the FINISHED
// product would return, and they obey Simul8's own discipline: never a bare
// number — always a range, a confidence, and a maturity label. The journey
// shows which engines agreed and which diverged, because that honesty IS the
// product.
//
// All company and operator names are fictional.
// ============================================================================

export type StageId =
  | "input"            // pulling the relevant slice of input data
  | "accumulate"       // Accumulated User Input Data
  | "subtaskA"         // intent parsing (LLM)
  | "subtaskB"         // method selection (calibration-routed)
  | "engines"          // the engine ensemble fires
  | "fusion"           // multi-method fusion + calibration
  | "output";          // the four-layer output

export interface FlowStage {
  stage: StageId;
  // The node ids in the diagram this stage should highlight while it's active.
  highlightNodeIds: string[];
  // Short caption shown during the animation for this stage.
  caption: string;
  // The longer "what happened here" text the user reads when they click this stage.
  detail: string;
}

export interface EngineContribution {
  engine: string;          // engine name
  fired: boolean;          // did Sub-task B fire it for this question?
  weight?: number;         // 0-100, only if fired
  verdict?: string;        // what this engine concluded
  agreement?: "agrees" | "diverges" | "neutral";
}

export interface OutputLayer {
  // Layer 1 — Outcome
  outcome: {
    headline: string;      // e.g. "+18% units, most likely"
    range: string;         // credible range
    confidence: string;    // e.g. "71% — moderate"
    maturity: string;      // e.g. "Developing"
    plain: string;         // one-line plain reading
  };
  // Layer 2 — Journey (the reasoning)
  journey: {
    engines: EngineContribution[];
    causalChain: string[]; // the A-to-Z chain, e.g. ["price -15%","demand +X","..."]
    narrative: string;     // why the answer is what it is, incl. the disagreement
    evidence: string[];    // evidence tags that drove confidence
  };
  // Layer 3 — Interrogate & Adjust
  interrogate: {
    prompt: string;        // an example "what if" the user could ask
    adjustedResult: string;// what changes if they adjust the lever
    note: string;          // the cheap-vs-expensive recompute note
  };
  // Layer 4 — Share
  share: {
    summary: string;       // the one-paragraph export summary
    formats: string[];     // ["PDF report","Slide deck","Image"]
  };
}

export interface Scenario {
  id: string;
  company: string;
  operator: string;        // the person asking
  persona: string;         // one-line who they are
  category: string;        // for the tag/icon
  question: string;        // the actual question they ask
  whyTheseEngines: string; // one-line on the routing logic
  flow: FlowStage[];
  output: OutputLayer;
}

// ----------------------------------------------------------------------------
// Shared flow skeleton. The captions/details differ per scenario, but the
// stage order and the nodes each stage lights up are the same architecture.
// (Node ids below are placeholders — Claude Code should map them to the real
//  ids in src/data/diagram.ts. Names are given so the mapping is unambiguous.)
// ----------------------------------------------------------------------------

const NODE = {
  external: "external-data",
  category: "category-data",
  product: "product-data",
  linking: "data-linking",
  accumulate: "accumulated-input",
  subtaskA: "subtask-a",
  askUser: "ask-user",
  subtaskB: "subtask-b",
  engineGroup: "engine-group",
  timeseries: "engine-timeseries",
  bayesian: "engine-bayesian",
  causal: "engine-causal",
  abm: "engine-abm",
  systemdynamics: "engine-systemdynamics",
  supervised: "engine-supervised",
  fusion: "fusion",
  output: "output",
  log: "vault-log",
  calibration: "vault-calibration",
} as const;

// ============================================================================
// SCENARIO 1 — Gen-Z oversized T-shirts
// ============================================================================

const scenario1: Scenario = {
  id: "tees",
  company: "Loudmouth Co.",
  operator: "Riya Sehgal, founder",
  persona: "D2C streetwear brand — oversized tees for Gen-Z, sold on Shopify",
  category: "Apparel",
  question:
    "If I cut the price of my oversized tees by 15%, how many units can I expect to sell this Diwali season?",
  whyTheseEngines:
    "A festive demand-plus-price-cut question — Time-Series for the Diwali baseline, Causal for the price-cut effect, Bayesian to calibrate, ABM for the Gen-Z social cascade.",
  flow: [
    {
      stage: "input",
      highlightNodeIds: [NODE.external, NODE.category, NODE.product, NODE.linking],
      caption: "Pulling the relevant data…",
      detail:
        "The system pulls only the slice this question needs. External: the Diwali festive calendar and apparel seasonality. Category: validated price-elasticity priors for Gen-Z streetwear, plus cohort data from comparable Indian apparel operators. Product: Loudmouth's own Shopify history — past prices, conversion, and what happened in last year's festive window. Data Linking fuses the three into one query-time picture.",
    },
    {
      stage: "accumulate",
      highlightNodeIds: [NODE.accumulate],
      caption: "Assembling the question + context…",
      detail:
        "Loudmouth's relevant data is merged with Riya's intent: she wants a *unit-sales forecast* for a *15% price cut* over the *Diwali window*. That's the structured starting point.",
    },
    {
      stage: "subtaskA",
      highlightNodeIds: [NODE.subtaskA],
      caption: "Understanding the question (LLM)…",
      detail:
        "Sub-task A parses the request into a structured problem: question-type = demand forecast under intervention; decision variable = price (−15%); horizon = Diwali season (~3 weeks); product = oversized tees. The input is complete enough to route — no need to ask Riya for more.",
    },
    {
      stage: "subtaskB",
      highlightNodeIds: [NODE.subtaskB],
      caption: "Choosing the right methods…",
      detail:
        "Sub-task B reads the calibration log: for festive apparel price-cut questions, Causal and Time-Series have the strongest track record, with Bayesian for the confidence band and ABM for the Gen-Z word-of-mouth effect. It fires those four and sets their initial weights.",
    },
    {
      stage: "engines",
      highlightNodeIds: [
        NODE.engineGroup,
        NODE.timeseries,
        NODE.bayesian,
        NODE.causal,
        NODE.abm,
      ],
      caption: "The engines run…",
      detail:
        "Time-Series projects the Diwali baseline (what units would sell at current price). Causal models the price-cut effect through the elasticity chain. Bayesian wraps it in a calibrated uncertainty band. ABM simulates the social cascade — Gen-Z buyers reacting to each other and to a discount during a high-attention window. Each produces its own answer.",
    },
    {
      stage: "fusion",
      highlightNodeIds: [NODE.fusion],
      caption: "Combining into one honest answer…",
      detail:
        "Fusion weights the four by track record and checks agreement. Time-Series, Causal, and Bayesian converge tightly on a solid lift. ABM is more bullish — it sees a stronger cascade — so it pulls the upper end of the range higher and widens the band. The disagreement is surfaced, not hidden, which is why confidence sits at moderate rather than high.",
    },
    {
      stage: "output",
      highlightNodeIds: [NODE.output],
      caption: "The answer, with its reasoning…",
      detail:
        "The result is delivered as a scenario space, not a bare number — the outcome, the full reasoning journey, an interactive panel to test other price points, and an export. Click through the four output tabs to see each.",
    },
  ],
  output: {
    outcome: {
      headline: "≈ 4,200 units, most likely",
      range: "credible range 3,300 – 5,400 units",
      confidence: "69% — moderate",
      maturity: "Developing",
      plain:
        "A 15% cut likely moves about 4,200 oversized tees this Diwali — up roughly 34% on a no-cut festive baseline — but it could land anywhere from a solid to a very strong season.",
    },
    journey: {
      engines: [
        { engine: "Time-Series Forecasting", fired: true, weight: 28, verdict: "Festive baseline ~3,150 units at current price", agreement: "agrees" },
        { engine: "Causal Modeling", fired: true, weight: 34, verdict: "−15% price → +33% units via elasticity ≈ −1.4 for this segment", agreement: "agrees" },
        { engine: "Bayesian Prediction", fired: true, weight: 22, verdict: "Calibrated point ~4,150 units, band reflects festive volatility", agreement: "agrees" },
        { engine: "Agent-Based Simulation", fired: true, weight: 16, verdict: "Gen-Z discount cascade pushes upside to ~5,400", agreement: "diverges" },
        { engine: "System Dynamics", fired: false },
        { engine: "Supervised ML", fired: false },
      ],
      causalChain: [
        "price −15%",
        "demand elasticity ≈ −1.4",
        "base units +33%",
        "Diwali attention multiplier",
        "Gen-Z social cascade (ABM upside)",
        "≈ 4,200 units, range 3,300–5,400",
      ],
      narrative:
        "Three engines agree on a strong but bounded lift; the agent-based sim is the optimist, betting a discount during peak festive attention triggers extra word-of-mouth among Gen-Z buyers. Because the engines disagree on the ceiling, confidence is moderate and the upper range is wide — the honest read is 'a good season is likely, a great one is possible.'",
      evidence: [
        "Validated elasticity: streetwear ≈ −1.4",
        "Loudmouth's last festive window",
        "Cohort: Indian Gen-Z apparel discounts",
        "Diwali calendar + attention data",
      ],
    },
    interrogate: {
      prompt: "What if I only cut prices 10% instead of 15%?",
      adjustedResult:
        "At −10%, the most-likely figure drops to ≈ 3,650 units (range 3,000–4,500) and confidence ticks up to 73% — a smaller, safer lift, with the ABM upside cooling because a shallower discount sparks less cascade.",
      note:
        "Moving the price slider re-runs instantly off the calibrated model. Asking a genuinely new 'what if' (e.g. a bundle launch) triggers a full engine re-run — an explicit action, to keep compute honest.",
    },
    share: {
      summary:
        "Loudmouth Co. — Diwali pricing scenario: a 15% cut on oversized tees is forecast to sell ≈ 4,200 units (range 3,300–5,400), ~34% above a no-cut festive baseline, at 69% confidence (Developing maturity). Driver: strong price elasticity plus a possible Gen-Z discount cascade; the upside is wide because the agent-based simulation is more bullish than the statistical engines.",
      formats: ["PDF report", "Slide deck", "Image"],
    },
  },
};

// ============================================================================
// SCENARIO 2 — Protein / supplements
// ============================================================================

const scenario2: Scenario = {
  id: "protein",
  company: "Macrofuel",
  operator: "Arjun Nair, co-founder",
  persona: "D2C sports-nutrition brand — whey & plant protein, subscription-heavy",
  category: "Supplements",
  question:
    "If I shift ₹3L of monthly ad spend from Meta to Google, what happens to my new-subscriber acquisition next quarter?",
  whyTheseEngines:
    "A channel-reallocation question on a subscription business — Causal for the channel-substitution effect, Time-Series for the trend, Bayesian to calibrate, Supervised ML to score subscriber quality.",
  flow: [
    {
      stage: "input",
      highlightNodeIds: [NODE.external, NODE.category, NODE.product, NODE.linking],
      caption: "Pulling the relevant data…",
      detail:
        "External: nothing seasonal needed here. Category: validated channel-substitution priors and CAC benchmarks for D2C supplements. Product: Macrofuel's Meta and Google Ads performance (ROAS, CAC by channel), plus its subscription retention curve from Razorpay. Linking fuses them.",
    },
    {
      stage: "accumulate",
      highlightNodeIds: [NODE.accumulate],
      caption: "Assembling the question + context…",
      detail:
        "Macrofuel's channel data merges with Arjun's intent: he wants the effect on *new-subscriber acquisition* of moving *₹3L from Meta to Google* over *next quarter*.",
    },
    {
      stage: "subtaskA",
      highlightNodeIds: [NODE.subtaskA],
      caption: "Understanding the question (LLM)…",
      detail:
        "Sub-task A structures it: question-type = intervention on channel mix; decision variable = ₹3L Meta→Google; metric = new subscribers; horizon = one quarter. It also flags a sub-question worth surfacing — subscriber *quality* differs by channel — and notes Macrofuel's data covers it, so no clarification needed.",
    },
    {
      stage: "subtaskB",
      highlightNodeIds: [NODE.subtaskB],
      caption: "Choosing the right methods…",
      detail:
        "Calibration log says: for channel-reallocation questions, Causal leads (substitution effects), Supervised ML adds value (scoring which channel's subscribers retain better), Time-Series and Bayesian anchor and calibrate. Those four fire.",
    },
    {
      stage: "engines",
      highlightNodeIds: [
        NODE.engineGroup,
        NODE.timeseries,
        NODE.bayesian,
        NODE.causal,
        NODE.supervised,
      ],
      caption: "The engines run…",
      detail:
        "Causal models how moving spend changes acquisition through each channel's CAC and saturation. Supervised ML scores the *quality* gap — Google-acquired subscribers historically retain longer for Macrofuel. Time-Series projects the underlying acquisition trend; Bayesian calibrates the band.",
    },
    {
      stage: "fusion",
      highlightNodeIds: [NODE.fusion],
      caption: "Combining into one honest answer…",
      detail:
        "The engines mostly agree on raw new-subscriber count, but Supervised ML adds a twist Fusion surfaces prominently: slightly *fewer* raw new subscribers, but *higher-retaining* ones. Fusion delivers both signals rather than collapsing them into one misleading number — the honest answer has two parts.",
    },
    {
      stage: "output",
      highlightNodeIds: [NODE.output],
      caption: "The answer, with its reasoning…",
      detail:
        "Delivered as a scenario space with the quality-vs-quantity nuance front and centre. Click the four output tabs to see each.",
    },
  ],
  output: {
    outcome: {
      headline: "−4% raw subscribers, +11% retained value",
      range: "raw −9% to +1%; retained-value +4% to +18%",
      confidence: "74% — moderate-high",
      maturity: "Developing",
      plain:
        "The shift likely brings slightly fewer new subscribers, but ones who stay longer — net positive on lifetime value despite the lower headline count.",
    },
    journey: {
      engines: [
        { engine: "Causal Modeling", fired: true, weight: 33, verdict: "Google CAC higher at this spend → ~4% fewer raw subs", agreement: "agrees" },
        { engine: "Supervised ML", fired: true, weight: 27, verdict: "Google subs retain ~16% longer → +11% retained value", agreement: "neutral" },
        { engine: "Time-Series Forecasting", fired: true, weight: 22, verdict: "Underlying acquisition trend flat-to-slightly-up", agreement: "agrees" },
        { engine: "Bayesian Prediction", fired: true, weight: 18, verdict: "Calibrated bands; channel data is rich so band is tighter", agreement: "agrees" },
        { engine: "Agent-Based Simulation", fired: false },
        { engine: "System Dynamics", fired: false },
      ],
      causalChain: [
        "move ₹3L Meta → Google",
        "Google CAC higher at this volume",
        "raw new subs −4%",
        "but Google cohort retains +16%",
        "net retained value +11%",
      ],
      narrative:
        "This is the case where a single number would mislead. Raw acquisition dips because Google costs more per subscriber at this spend level — but those subscribers stay longer, so lifetime value rises. Confidence is moderate-high because Macrofuel's own channel-and-retention data is rich and recent, which tightens the bands.",
      evidence: [
        "Macrofuel CAC by channel (12 mo)",
        "Retention curve by acquisition source",
        "Cohort: D2C supplement channel mix",
        "Validated channel-substitution priors",
      ],
    },
    interrogate: {
      prompt: "What if I move ₹5L instead of ₹3L?",
      adjustedResult:
        "At ₹5L, raw subscribers drop further (≈ −9%) as Google saturates faster, but retained value still rises (+9%) — the trade-off tilts more toward 'fewer, better.' Confidence narrows slightly as you push past observed spend levels.",
      note:
        "The spend slider re-runs instantly. A structurally new question — say, adding a third channel — would trigger a full engine re-run.",
    },
    share: {
      summary:
        "Macrofuel — channel reallocation scenario: moving ₹3L/month from Meta to Google is forecast to yield ≈ 4% fewer raw new subscribers but ≈ 11% higher retained value, at 74% confidence (Developing maturity). The headline count understates the move; the gain is in subscriber quality, not quantity.",
      formats: ["PDF report", "Slide deck", "Image"],
    },
  },
};

// ============================================================================
// SCENARIO 3 — Sneakers
// ============================================================================

const scenario3: Scenario = {
  id: "sneakers",
  company: "Aksh Footwear",
  operator: "Devika Rao, head of growth",
  persona: "D2C sneaker brand — limited drops, hype-driven, Instagram-led",
  category: "Footwear",
  question:
    "If I launch my next limited sneaker drop as a bundle with socks at a 10% bundle discount, what happens to revenue and sell-through versus selling them separately?",
  whyTheseEngines:
    "A bundle-launch question with hype dynamics — ABM for the drop frenzy, Causal for the bundle effect, Time-Series for the drop baseline, Bayesian to calibrate.",
  flow: [
    {
      stage: "input",
      highlightNodeIds: [NODE.external, NODE.category, NODE.product, NODE.linking],
      caption: "Pulling the relevant data…",
      detail:
        "External: launch-timing and attention data. Category: bundle-economics and decoy-pricing research, plus cohort data on hype-drop sell-through for Indian sneaker brands. Product: Aksh's past drop performance — how fast previous drops sold out, AOV, returns. Linking fuses them.",
    },
    {
      stage: "accumulate",
      highlightNodeIds: [NODE.accumulate],
      caption: "Assembling the question + context…",
      detail:
        "Aksh's drop history merges with Devika's intent: compare *bundle at −10%* vs *separate* on two metrics — *total revenue* and *sell-through speed* — for the next limited drop.",
    },
    {
      stage: "subtaskA",
      highlightNodeIds: [NODE.subtaskA],
      caption: "Understanding the question (LLM)…",
      detail:
        "Sub-task A structures it: question-type = comparative intervention (bundle vs separate); variables = bundle discount −10%, attach socks; metrics = revenue + sell-through; context = limited/hype drop. Complete enough to route.",
    },
    {
      stage: "subtaskB",
      highlightNodeIds: [NODE.subtaskB],
      caption: "Choosing the right methods…",
      detail:
        "Calibration log: hype-drop questions lean heavily on ABM (the frenzy is a social cascade), with Causal for the bundle/AOV effect, Time-Series for the drop baseline, Bayesian to calibrate. Those four fire — ABM weighted unusually high here.",
    },
    {
      stage: "engines",
      highlightNodeIds: [
        NODE.engineGroup,
        NODE.timeseries,
        NODE.bayesian,
        NODE.causal,
        NODE.abm,
      ],
      caption: "The engines run…",
      detail:
        "ABM simulates the drop frenzy — limited stock plus hype creates a fast sell-through cascade, and it tests whether bundling changes the frenzy. Causal models the bundle's effect on AOV and total revenue. Time-Series sets the baseline drop curve; Bayesian calibrates.",
    },
    {
      stage: "fusion",
      highlightNodeIds: [NODE.fusion],
      caption: "Combining into one honest answer…",
      detail:
        "Here the engines genuinely split. Causal says the bundle lifts revenue via higher AOV. ABM warns the bundle could *slow* the pure-sneaker frenzy slightly — hype buyers want the sneaker, not socks — trading a touch of sell-through speed for AOV. Fusion surfaces this tension openly, so confidence is moderate and the answer is a real trade-off, not a clean win.",
    },
    {
      stage: "output",
      highlightNodeIds: [NODE.output],
      caption: "The answer, with its reasoning…",
      detail:
        "Delivered as a scenario space framing the revenue-vs-speed trade-off. Click the four output tabs to see each.",
    },
  ],
  output: {
    outcome: {
      headline: "+7% revenue, −1 day faster sell-through lost",
      range: "revenue +1% to +13%; sell-through 0 to −2 days slower",
      confidence: "63% — moderate",
      maturity: "Developing",
      plain:
        "Bundling likely lifts total revenue via higher order value, at the cost of a slightly slower sell-out — a revenue-for-speed trade, not a free win.",
    },
    journey: {
      engines: [
        { engine: "Agent-Based Simulation", fired: true, weight: 32, verdict: "Hype buyers want the sneaker; socks slow the frenzy slightly", agreement: "diverges" },
        { engine: "Causal Modeling", fired: true, weight: 30, verdict: "Bundle raises AOV → +7% revenue if sell-through holds", agreement: "agrees" },
        { engine: "Time-Series Forecasting", fired: true, weight: 20, verdict: "Baseline drop sells out fast regardless", agreement: "agrees" },
        { engine: "Bayesian Prediction", fired: true, weight: 18, verdict: "Wide band — few past bundle drops to learn from", agreement: "neutral" },
        { engine: "System Dynamics", fired: false },
        { engine: "Supervised ML", fired: false },
      ],
      causalChain: [
        "bundle sneaker + socks at −10%",
        "AOV up (Causal: +revenue)",
        "but hype demand is sneaker-specific (ABM: −frenzy)",
        "net +7% revenue, slightly slower sell-through",
      ],
      narrative:
        "The most honest answer here is a trade-off, and the engines disagreeing is the point. Causal sees a revenue win from higher order value; the agent-based sim cautions that hype buyers came for the sneaker and a sock bundle cools the frenzy a touch. Confidence is only moderate — and the band is wide — because Aksh has run few bundle drops, so there's limited resolved history to calibrate against.",
      evidence: [
        "Aksh past drop sell-through curves",
        "Bundle/decoy-pricing research",
        "Cohort: Indian hype-drop sneakers",
        "Limited bundle-drop history (flagged)",
      ],
    },
    interrogate: {
      prompt: "What if the bundle discount is 5% instead of 10%?",
      adjustedResult:
        "At −5%, revenue upside grows (+10%) because you give away less margin, but the frenzy-cooling effect shrinks too — the trade-off softens on both sides. Confidence stays moderate given the thin bundle history.",
      note:
        "The discount slider re-runs instantly. Testing a different bundle (e.g. sneaker + cap) is a new question and triggers a full re-run.",
    },
    share: {
      summary:
        "Aksh Footwear — bundle-drop scenario: bundling the next limited sneaker with socks at −10% is forecast to lift revenue ≈ 7% (range +1% to +13%) at the cost of slightly slower sell-through, 63% confidence (Developing maturity). It's a revenue-for-speed trade; the wide band reflects limited past bundle drops to calibrate against.",
      formats: ["PDF report", "Slide deck", "Image"],
    },
  },
};

// ============================================================================
// SCENARIO 4 — TWS / electronics
// ============================================================================

const scenario4: Scenario = {
  id: "tws",
  company: "Pulsebeat Audio",
  operator: "Kabir Menon, founder",
  persona: "D2C electronics brand — true-wireless earbuds, value-priced, Amazon + own store",
  category: "Electronics",
  question:
    "I'm planning to raise the price of my flagship earbuds from ₹2,499 to ₹2,999. How will that affect revenue over the next quarter, given my inventory and a competitor likely to discount?",
  whyTheseEngines:
    "A price-increase question with a competitive response and an inventory constraint — Causal for the price effect, ABM for competitor reaction, System Dynamics for the inventory/feedback dynamics, Bayesian to calibrate.",
  flow: [
    {
      stage: "input",
      highlightNodeIds: [NODE.external, NODE.category, NODE.product, NODE.linking],
      caption: "Pulling the relevant data…",
      detail:
        "External: nothing seasonal critical. Category: price-elasticity for value TWS, plus competitive-structure data on rival pricing and promo patterns (from cohort + ad-library signals). Product: Pulsebeat's sales history, current inventory and reorder lead times (from the AI interview — true cost and stock data the APIs don't expose), and Amazon + own-store performance. Linking fuses them.",
    },
    {
      stage: "accumulate",
      highlightNodeIds: [NODE.accumulate],
      caption: "Assembling the question + context…",
      detail:
        "Pulsebeat's data merges with Kabir's intent and his two constraints: he wants the *revenue effect* of *+₹500 (20%)* over *a quarter*, explicitly accounting for *inventory limits* and a *likely competitor discount*.",
    },
    {
      stage: "subtaskA",
      highlightNodeIds: [NODE.subtaskA],
      caption: "Understanding the question (LLM)…",
      detail:
        "Sub-task A structures it: question-type = price intervention with competitive + supply constraints; variable = +20% price; metric = revenue; horizon = one quarter; constraints = inventory ceiling, competitor discount likely. It confirms inventory and competitor data are present, so it routes without asking.",
    },
    {
      stage: "subtaskB",
      highlightNodeIds: [NODE.subtaskB],
      caption: "Choosing the right methods…",
      detail:
        "This is the richest routing. Calibration log fires four: Causal (the price→demand effect), ABM (how the competitor and price-sensitive buyers react), System Dynamics (inventory depleting and reorder lead-time feedback), Bayesian (calibrate). The most engines of any of the four scenarios — because the question has the most moving parts.",
    },
    {
      stage: "engines",
      highlightNodeIds: [
        NODE.engineGroup,
        NODE.bayesian,
        NODE.causal,
        NODE.abm,
        NODE.systemdynamics,
      ],
      caption: "The engines run…",
      detail:
        "Causal models the demand drop from +20% price. ABM simulates the competitor discounting into the gap and value-buyers switching. System Dynamics tracks whether inventory and reorder timing can even meet demand at the new price — and whether a stockout interacts with the competitor's move. Bayesian calibrates the whole thing.",
    },
    {
      stage: "fusion",
      highlightNodeIds: [NODE.fusion],
      caption: "Combining into one honest answer…",
      detail:
        "The engines paint a layered picture. Causal: higher price, fewer units, but higher margin per unit — modest revenue gain in isolation. ABM: the competitor discount erodes much of that gain as price-sensitive buyers switch. System Dynamics: a mild positive — lower unit velocity actually eases an inventory constraint Kabir was close to hitting. Fusion weaves these into one honest, hedged answer with a clear downside risk flagged.",
    },
    {
      stage: "output",
      highlightNodeIds: [NODE.output],
      caption: "The answer, with its reasoning…",
      detail:
        "Delivered as a scenario space with the competitor risk and inventory upside both visible. Click the four output tabs to see each.",
    },
  ],
  output: {
    outcome: {
      headline: "+3% revenue, but wide downside risk",
      range: "credible range −6% to +12%",
      confidence: "58% — guarded",
      maturity: "Developing",
      plain:
        "The price rise likely nudges revenue up slightly and eases an inventory squeeze — but if the competitor discounts aggressively, it could go negative. A defensible move with a real downside to watch.",
    },
    journey: {
      engines: [
        { engine: "Causal Modeling", fired: true, weight: 30, verdict: "+20% price → ~−18% units, +margin → modest revenue gain alone", agreement: "agrees" },
        { engine: "Agent-Based Simulation", fired: true, weight: 28, verdict: "Competitor discount pulls price-sensitive buyers away — erodes the gain", agreement: "diverges" },
        { engine: "System Dynamics", fired: true, weight: 24, verdict: "Lower velocity eases the inventory ceiling Pulsebeat was near", agreement: "agrees" },
        { engine: "Bayesian Prediction", fired: true, weight: 18, verdict: "Wide band — competitor behaviour is the big unknown", agreement: "neutral" },
        { engine: "Time-Series Forecasting", fired: false },
        { engine: "Supervised ML", fired: false },
      ],
      causalChain: [
        "price +20% (₹2,499 → ₹2,999)",
        "units −18% (Causal), margin per unit up",
        "competitor discounts → switching (ABM downside)",
        "lower velocity eases inventory ceiling (SysDyn upside)",
        "net +3% revenue, range −6% to +12%",
      ],
      narrative:
        "This is the hardest of the four, and confidence is deliberately guarded. In isolation the price rise is mildly positive and even helps an inventory constraint. The dominant risk is the competitor: the agent-based sim shows that an aggressive rival discount could pull enough value-buyers away to turn the move negative. The wide, partly-negative range is the honest signal — this is a bet on how the competitor responds, and the system says so rather than papering over it.",
      evidence: [
        "Pulsebeat sales + inventory (AI interview)",
        "Competitor pricing & promo (ad library)",
        "Value-TWS elasticity priors",
        "Reorder lead-time constraints",
      ],
    },
    interrogate: {
      prompt: "What if I raise to ₹2,799 instead of ₹2,999?",
      adjustedResult:
        "At ₹2,799 (+12%), the downside narrows considerably — fewer buyers leave even if the competitor discounts, and the range tightens to −2% to +9%. Confidence rises to 66%. A more cautious rise trades some upside for a much smaller chance of a negative quarter.",
      note:
        "The price slider re-runs instantly. Changing the competitor assumption (e.g. 'what if they don't discount?') is a new scenario and triggers a full engine re-run — and would sharply raise the upside.",
    },
    share: {
      summary:
        "Pulsebeat Audio — price-increase scenario: raising flagship earbuds from ₹2,499 to ₹2,999 is forecast to lift revenue ≈ 3% (range −6% to +12%) and ease a looming inventory constraint, at 58% confidence (Developing maturity). The move is defensible but competitor-dependent — an aggressive rival discount is the main path to a negative quarter, and a smaller rise to ₹2,799 materially de-risks it.",
      formats: ["PDF report", "Slide deck", "Image"],
    },
  },
};

// ----------------------------------------------------------------------------

export const DEMO_SCENARIOS: Scenario[] = [
  scenario1, // Loudmouth Co. — Gen-Z oversized tees
  scenario2, // Macrofuel — protein
  scenario3, // Aksh Footwear — sneakers
  scenario4, // Pulsebeat Audio — TWS
];

export const DEMO_INTRO = {
  buttonLabel: "See it in action",
  title: "Watch a real decision flow through Simul8",
  subtitle:
    "Pick a D2C operator. Watch their question travel the whole system — data in, routed, the engines firing, fused into one honest answer — and explore the four-layer output exactly as the finished product would deliver it.",
  disclaimer:
    "Illustrative walkthrough. The numbers model what the finished product would return, and they follow Simul8's discipline — never a bare number, always a range, a confidence, and a maturity label.",
};
