import type { DiagramNode, DiagramArrow } from '../types';

// ---------------------------------------------------------------------------
// THE DIAGRAM, AS DATA.
// Everything you see is generated from `nodes` + `arrows` below.
// Coordinates live on a fixed logical canvas (CANVAS.w x CANVAS.h); the
// pan/zoom wrapper scales this whole plane. Top-to-bottom = the flow order.
//
//   - subtitle        = the short summary (panel lead / on-node caption)
//   - fullDescription = the complete explanation, shown in the detail panel
// ---------------------------------------------------------------------------

export const CANVAS = { w: 2300, h: 1880 };

export const nodes: DiagramNode[] = [
  // ── Title ────────────────────────────────────────────────────────────────
  {
    id: 'simul8',
    variant: 'title',
    position: { x: 1000, y: 40 },
    size: { w: 300, h: 74 },
    title: 'Simul8',
    subtitle: 'calibrated decision-intelligence',
    fullDescription:
      'Simul8 is a calibrated decision-intelligence platform. It ingests geography-scoped data, routes a request through an evidence-governed ensemble of prediction and simulation engines, fuses their answers into one honest outcome, and then grades itself against reality — so every prediction makes the next one more trustworthy. It can be pointed at many industries; today it is calibrated against the D2C wedge.',
  },

  // ── Industries row ─────────────────────────────────────────────────────────
  {
    id: 'ind-fmcg',
    variant: 'industry',
    position: { x: 620, y: 128 },
    size: { w: 180, h: 64 },
    title: 'FMCG',
    fullDescription: 'Fast-moving consumer goods — one of the verticals Simul8 can be pointed at.',
  },
  {
    id: 'ind-ecom',
    variant: 'industry',
    position: { x: 840, y: 128 },
    size: { w: 180, h: 64 },
    title: 'E-Commerce',
    fullDescription: 'E-commerce — a candidate vertical for the platform.',
  },
  {
    id: 'ind-d2c',
    variant: 'industry',
    position: { x: 1060, y: 128 },
    size: { w: 180, h: 64 },
    title: 'D2C',
    active: true,
    subtitle: 'active wedge',
    fullDescription:
      'Direct-to-consumer is the active wedge: the narrow, specific market Simul8 is being built and calibrated against first. The entire input layer below is scoped to D2C in India, which is why the geography filter reads “India · D2C”. Winning a narrow wedge before broadening is deliberate — calibration only compounds where the data is dense.',
  },
  {
    id: 'ind-politics',
    variant: 'industry',
    position: { x: 1280, y: 128 },
    size: { w: 180, h: 64 },
    title: 'Politics',
    fullDescription: 'Politics — a candidate vertical for the platform.',
  },
  {
    id: 'ind-auto',
    variant: 'industry',
    position: { x: 1500, y: 128 },
    size: { w: 180, h: 64 },
    title: 'Automotive',
    fullDescription: 'Automotive — a candidate vertical for the platform.',
  },

  // ── Geography (bridge: the active wedge is geography-scoped) ────────────────
  {
    id: 'geography',
    variant: 'bar',
    position: { x: 1005, y: 214 },
    size: { w: 290, h: 54 },
    color: 'slate',
    title: 'Geography',
    subtitle: 'India · D2C',
    fullDescription:
      'Geography is the bridge between the chosen industry wedge and the data architecture. Everything downstream is geography-scoped: the active deployment is India · D2C. The data, the priors and the calibration are all locality-specific — a model of Indian D2C is not a model of Australian D2C — so scoping by geography is what keeps the context graphs accurate and the calibration meaningful.',
  },

  // ── Input Data section (frame + geography header) ──────────────────────────
  {
    id: 'input-frame',
    variant: 'frame',
    position: { x: 80, y: 280 },
    size: { w: 2140, h: 470 },
    color: 'neutral',
    title: '',
    interactive: false,
    z: 2,
  },
  {
    id: 'input-geo',
    variant: 'bar',
    position: { x: 100, y: 296 },
    size: { w: 2100, h: 46 },
    color: 'slate',
    title: 'INPUT DATA',
    subtitle: 'geography-scoped (India · D2C)',
    fullDescription:
      'The input layer is always geography-scoped. Here it is bound to India · D2C, so every source, prior and feed below is filtered to that context before anything else happens. Geography scoping is what lets external backdrop, category priors and product specifics be compared on the same footing — they are all describing the same place and market.',
  },

  // External Data (blue) ------------------------------------------------------
  {
    id: 'panel-external',
    variant: 'panel',
    position: { x: 110, y: 372 },
    size: { w: 470, h: 56 },
    color: 'blue',
    title: 'External Data',
    subtitle: 'the world as backdrop',
    fullDescription:
      'Authoritative, economy-wide context that sets the backdrop a forecast sits inside. External data answers “what is the world doing?” independent of any single operator — the macro stage on which a specific prediction plays out.',
  },
  {
    id: 'src-ext-1',
    variant: 'source',
    position: { x: 120, y: 446 },
    size: { w: 450, h: 58 },
    color: 'blue',
    title: 'Public authoritative',
    ai: true,
    subtitle: 'Census, RBI/ABS, calendars, weather',
    fullDescription:
      'Government and statutory sources — census demographics, central-bank / ABS economic releases, official calendars (festivals, holidays) and weather. The most trustworthy, least biased layer of the backdrop.',
  },
  {
    id: 'src-ext-2',
    variant: 'source',
    position: { x: 120, y: 512 },
    size: { w: 450, h: 58 },
    color: 'blue',
    title: 'Economic activity',
    subtitle: 'challan, per-capita, cohort form',
    fullDescription:
      'Real economic-activity signals: challan / GST traces, per-capita income and spending measures, and how cohorts form and spend. A higher-frequency read on demand than official statistics alone.',
  },
  {
    id: 'src-ext-3',
    variant: 'source',
    position: { x: 120, y: 578 },
    size: { w: 450, h: 58 },
    color: 'blue',
    title: 'Prediction markets',
    subtitle: 'Polymarket, Kalshi — input signal',
    fullDescription:
      'Prices from prediction markets such as Polymarket and Kalshi, used as an input signal — a crowd-sourced probability the engines can weigh — never as the final answer.',
  },
  {
    id: 'src-ext-4',
    variant: 'source',
    position: { x: 120, y: 644 },
    size: { w: 450, h: 58 },
    color: 'blue',
    title: 'Licensed feeds',
    subtitle: 'Bloomberg, Tracxn — under license',
    fullDescription:
      'Commercial data brought in under license — e.g. Bloomberg market data and Tracxn private-company intelligence — to fill gaps the public and activity layers leave open.',
  },

  // Category Data (green) -----------------------------------------------------
  {
    id: 'panel-category',
    variant: 'panel',
    position: { x: 650, y: 372 },
    size: { w: 470, h: 56 },
    color: 'green',
    title: 'Category Data',
    subtitle: 'priors for this market',
    fullDescription:
      'What is known about the category itself — the priors a new operator inherits on day zero, before they have generated any data of their own. Category data is how Simul8 says something useful from the very first session.',
  },
  {
    id: 'src-cat-1',
    variant: 'source',
    position: { x: 660, y: 446 },
    size: { w: 450, h: 58 },
    color: 'green',
    title: 'Expert panel',
    ai: true,
    subtitle: 'day-zero priors',
    fullDescription:
      'A curated expert panel supplies day-zero priors — informed starting estimates for a category — so the system is useful immediately and is not cold-starting from nothing.',
  },
  {
    id: 'src-cat-2',
    variant: 'source',
    position: { x: 660, y: 512 },
    size: { w: 450, h: 58 },
    color: 'green',
    title: 'Helium-ish tool',
    subtitle: 'anonymized cohort data, compounding',
    fullDescription:
      'An anonymized cohort-data tool (think a Helium-10-style instrument for this category). Its value compounds: every operator who contributes sharpens the priors for everyone, which is a structural data moat.',
  },
  {
    id: 'src-cat-3',
    variant: 'source',
    position: { x: 660, y: 578 },
    size: { w: 450, h: 58 },
    color: 'green',
    title: 'Validated research',
    ai: true,
    subtitle: 'academic · industry · meta-analysis',
    fullDescription:
      'Peer-reviewed academic work, industry studies and meta-analyses, vetted for the category — the slow-moving but high-confidence evidence base behind the priors.',
  },
  {
    id: 'src-cat-4',
    variant: 'source',
    position: { x: 660, y: 644 },
    size: { w: 450, h: 58 },
    color: 'green',
    title: 'Competitive structure',
    ai: true,
    subtitle: 'cohort + panel + ad library',
    fullDescription:
      'A model of the competitive landscape assembled from cohort data, the expert panel and ad-library signals — who the players are, how they behave, and where an operator actually sits.',
  },

  // Product Data (amber) ------------------------------------------------------
  {
    id: 'panel-product',
    variant: 'panel',
    position: { x: 1190, y: 372 },
    size: { w: 470, h: 56 },
    color: 'amber',
    title: 'Product Data',
    subtitle: "the operator's own reality",
    fullDescription:
      "The operator's first-party data — their actual commerce, marketing, operations and strategic context. This is what makes a prediction about *this* business rather than the category average.",
  },
  {
    id: 'src-prod-1',
    variant: 'source',
    position: { x: 1200, y: 446 },
    size: { w: 450, h: 58 },
    color: 'amber',
    title: 'Commerce & transactions',
    subtitle: 'Shopify, WooCommerce, Razorpay',
    fullDescription:
      'Live transaction data pulled from commerce and payment platforms — Shopify, WooCommerce, Razorpay — the ground truth of what is actually selling.',
  },
  {
    id: 'src-prod-2',
    variant: 'source',
    position: { x: 1200, y: 512 },
    size: { w: 450, h: 58 },
    color: 'amber',
    title: 'Marketing & acquisition',
    subtitle: 'Meta, Google Ads — ROAS, CAC',
    fullDescription:
      'Acquisition data from the ad platforms — spend, ROAS and CAC from Meta and Google Ads — so the model understands the cost and efficiency of growth, not just its volume.',
  },
  {
    id: 'src-prod-3',
    variant: 'source',
    position: { x: 1200, y: 578 },
    size: { w: 450, h: 58 },
    color: 'amber',
    title: 'Operations & supply',
    subtitle: 'inventory, lead times, ERP',
    fullDescription:
      'Supply-side reality: inventory positions, supplier lead times and ERP data — the constraints that decide whether a demand forecast can actually be fulfilled.',
  },
  {
    id: 'src-prod-4',
    variant: 'source',
    position: { x: 1200, y: 644 },
    size: { w: 450, h: 58 },
    color: 'amber',
    title: 'AI interview',
    ai: true,
    subtitle: 'cost, margin, strategic context',
    fullDescription:
      'A structured AI interview captures what a database cannot: cost structure, true margins, and the strategic context and intent behind the numbers — the qualitative layer that reframes the quantitative one.',
  },

  // Data Linking (purple) -----------------------------------------------------
  {
    id: 'panel-linking',
    variant: 'panel',
    position: { x: 1730, y: 372 },
    size: { w: 470, h: 56 },
    color: 'purple',
    title: 'Data Linking',
    subtitle: 'one query-time picture',
    fullDescription:
      'The join layer. Data Linking fuses the three sources — External backdrop + Category priors + Product specifics — into one coherent, query-time picture, so the engines reason over a single unified state rather than three disconnected datasets.',
  },
  {
    id: 'src-link-1',
    variant: 'source',
    position: { x: 1740, y: 446 },
    size: { w: 450, h: 58 },
    color: 'purple',
    title: 'Fuses the three sources',
    subtitle: 'External + Category + Product → one picture',
    fullDescription:
      'Combines the External backdrop, Category priors and Product specifics into a single query-time picture — the substrate every engine reads from.',
  },
  {
    id: 'src-link-2',
    variant: 'source',
    position: { x: 1740, y: 512 },
    size: { w: 450, h: 58 },
    color: 'purple',
    title: 'Pre-built recipe',
    subtitle: 'structure maintained ahead of time',
    fullDescription:
      'The linking structure is maintained ahead of time as a reusable recipe — the relationships between sources are engineered in advance, not improvised on every query, which keeps results fast and consistent.',
  },
  {
    id: 'src-link-3',
    variant: 'source',
    position: { x: 1740, y: 578 },
    size: { w: 450, h: 58 },
    color: 'purple',
    title: 'Applied live',
    subtitle: "operator's fresh data fused on demand",
    fullDescription:
      "At query time the pre-built recipe is applied to the operator's freshest data and fused on demand — so the unified picture is always current, not a stale snapshot.",
  },

  // ── Accumulated User Input ─────────────────────────────────────────────────
  {
    id: 'accumulated',
    variant: 'bar',
    position: { x: 80, y: 800 },
    size: { w: 2140, h: 66 },
    color: 'green',
    title: 'Accumulated User Input Data',
    ai: true,
    subtitle: "the relevant slice of input data + the user's intent",
    fullDescription:
      "What actually enters the orchestrator is not the whole input layer but the relevant slice of it, joined with the user's intent — the specific outcome they are trying to reach. Data plus intent is the unit the rest of the system reasons about.",
  },

  // ── Orchestrator (frame + sub-boxes) ───────────────────────────────────────
  {
    id: 'orch-frame',
    variant: 'frame',
    position: { x: 80, y: 880 },
    size: { w: 770, h: 430 },
    color: 'amber',
    title: 'ORCHESTRATOR',
    interactive: false,
    z: 2,
  },
  {
    id: 'subtask-a',
    variant: 'subbox',
    position: { x: 110, y: 940 },
    size: { w: 350, h: 120 },
    color: 'amber',
    title: 'Sub-task A — Intent',
    ai: true,
    subtitle: 'parses the raw request into a structured problem',
    fullDescription:
      'Sub-task A parses the raw natural-language request into a structured problem definition: the type of question, the target variable, the constraints and the time horizon. This is the one place a free LLM is trusted to interpret intent — everything downstream is evidence-governed rather than judgment-governed.',
  },
  {
    id: 'ask-user',
    variant: 'subbox',
    position: { x: 488, y: 952 },
    size: { w: 330, h: 94 },
    color: 'amber',
    title: 'Ask the User',
    subtitle: 'fill missing fields',
    fullDescription:
      'If Sub-task A finds the request under-specified, the orchestrator asks the user to fill the missing fields and then loops back — re-entering the accumulated input rather than guessing. Asking is cheaper, and far more honest, than silently assuming.',
  },
  {
    id: 'subtask-b',
    variant: 'subbox',
    position: { x: 110, y: 1092 },
    size: { w: 350, h: 120 },
    color: 'amber',
    title: 'Sub-task B — Method Selection',
    subtitle: 'calibration-driven routing',
    fullDescription:
      'Sub-task B decides which engines fire, and at what weight, for this particular problem. The routing is evidence-governed: it is driven by the calibration track record of each method on similar questions, not by free LLM judgment. Calibration tells B which methods have earned trust here.',
  },
  {
    id: 'listening',
    variant: 'overlay',
    position: { x: 100, y: 1230 },
    size: { w: 730, h: 70 },
    color: 'slate',
    z: 3,
    title: 'Listening / Capture Layer',
    subtitle: 'observes everything in the orchestrator · never steers',
    fullDescription:
      'The listening layer is not a step in the flow — it is a passive layer running alongside the whole orchestrator. It quietly logs every interaction into a privacy-governed corpus used to train the SLM. It is strictly observational: it captures what happens everywhere above it but never influences the prediction. Observe, never steer.',
  },
  {
    id: 'corpus',
    variant: 'subbox',
    position: { x: 110, y: 1338 },
    size: { w: 340, h: 64 },
    color: 'amber',
    title: 'SLM Corpus',
    subtitle: 'privacy-governed · trains the SLM',
    fullDescription:
      'The privacy-governed corpus assembled by the listening layer — the training substrate for the small language model (SLM) that gradually specializes Simul8 to its domain.',
  },

  // ── Prediction & Simulation Engine (header + cards) ────────────────────────
  {
    id: 'engine-header',
    variant: 'bar',
    position: { x: 880, y: 896 },
    size: { w: 770, h: 46 },
    color: 'pink',
    title: 'Prediction & Simulation Engine',
    subtitle: 'which engines fire is calibration-routed',
    fullDescription:
      'An ensemble of six complementary engines. No single method is trusted for everything; instead Sub-task B dispatches each request to whichever engines the calibration record says to trust for this kind of question, at weights it has earned. Diversity of method is what makes the fused answer robust.',
  },
  {
    id: 'eng-timeseries',
    variant: 'engine',
    position: { x: 880, y: 962 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'Time-Series Forecasting',
    subtitle: 'baseline trajectory',
    tag: 'TSFM',
    fullDescription:
      'Establishes the baseline trajectory — where things are heading if nothing changes — using time-series foundation models (TSFM). The reference path the other engines reason against.',
  },
  {
    id: 'eng-bayesian',
    variant: 'engine',
    position: { x: 1285, y: 962 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'Bayesian Prediction',
    subtitle: 'calibrated core — a distribution, not a number',
    badge: '+ Monte Carlo',
    fullDescription:
      'The calibrated core of the system. It produces a full probability distribution rather than a single point estimate, so uncertainty is a first-class output. Runs over a Monte Carlo substrate to propagate that uncertainty through the calculation.',
  },
  {
    id: 'eng-causal',
    variant: 'engine',
    position: { x: 880, y: 1100 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'Causal Modeling',
    subtitle: 'intervention engine — “if I change X…”',
    badge: '+ Monte Carlo',
    fullDescription:
      'The intervention engine. It answers “if I change X, what happens downstream?” — reasoning about cause and effect rather than mere correlation, which is what makes it useful for decisions instead of just descriptions. Runs over a Monte Carlo substrate.',
  },
  {
    id: 'eng-abm',
    variant: 'engine',
    position: { x: 1285, y: 1100 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'Agent-Based Simulation',
    subtitle: 'population-grounded emergence',
    badge: '+ Monte Carlo',
    fullDescription:
      'Simulates population-grounded emergent behaviour — many interacting agents whose aggregate produces system-level outcomes. Crucially this is grounded in real population dynamics, not LLM role-play personas. Runs over a Monte Carlo substrate.',
  },
  {
    id: 'eng-sysdyn',
    variant: 'engine',
    position: { x: 880, y: 1238 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'System Dynamics',
    subtitle: 'stocks / flows / feedback over time',
    badge: '+ Monte Carlo',
    fullDescription:
      'Models the system as stocks, flows and feedback loops evolving over time — capturing accumulation and delay effects that point forecasts miss. Runs over a Monte Carlo substrate.',
  },
  {
    id: 'eng-supervised',
    variant: 'engine',
    position: { x: 1285, y: 1238 },
    size: { w: 365, h: 118 },
    color: 'pink',
    title: 'Supervised ML',
    subtitle: 'scores entities by traits — churn, LTV',
    tag: 'XGBoost',
    fullDescription:
      'Scores individual entities by their traits — for example churn risk or lifetime value — using gradient-boosted trees (XGBoost). The workhorse for per-entity classification and ranking inside the ensemble.',
  },

  // ── The Vault (frame + cards) ──────────────────────────────────────────────
  {
    id: 'vault-frame',
    variant: 'frame',
    position: { x: 1690, y: 912 },
    size: { w: 530, h: 470 },
    color: 'purple',
    title: 'THE VAULT',
    interactive: false,
    z: 2,
  },
  {
    id: 'vault-log',
    variant: 'vault',
    position: { x: 1715, y: 972 },
    size: { w: 480, h: 165 },
    color: 'purple',
    title: 'The Log',
    tag: 'Moat I',
    subtitle: 'tamper-evident, append-only',
    fullDescription:
      'A tamper-evident, append-only record of every prediction, the confidence stated at the time, and the real-world outcome once it resolves. It is cryptographically anchored so the track record cannot be quietly rewritten. This honest history is Moat I — the thing competitors cannot fake.',
  },
  {
    id: 'vault-calibration',
    variant: 'vault',
    position: { x: 1715, y: 1162 },
    size: { w: 480, h: 190 },
    color: 'purple',
    title: 'Calibration',
    tag: 'pure math · no LLM',
    subtitle: 'grades accuracy & honesty, updates weights',
    fullDescription:
      'A programmed statistical engine — pure math, no LLM. It reads the Log, compares predicted vs actual, and grades two things: accuracy (was the prediction right?) and honesty (was the stated confidence earned, or over-claimed?). It then updates the trust weights that Sub-task B uses to route and that Fusion uses to weight. This is the mechanism that turns history into a learning loop.',
  },

  // ── Multi-Method Fusion + Calibration ──────────────────────────────────────
  {
    id: 'fusion',
    variant: 'bar',
    position: { x: 80, y: 1440 },
    size: { w: 2140, h: 130 },
    color: 'blue',
    title: 'Multi-Method Fusion + Calibration',
    subtitle: "the chairperson — distils the engines into one honest outcome",
    items: [
      '1 · Weight by proven trust — calibration track record, not equal averaging',
      '2 · Agreement sets confidence — convergence tightens, divergence widens & is surfaced',
      '3 · Decomposed output — most-likely X, range Y–Z, confidence, maturity label, evidence',
    ],
    fullDescription:
      "Fusion is the chairperson. It combines the engines' answers into one honest outcome and predicts nothing of its own — it distils. (1) It weights each engine by proven trust from the calibration record, not by equal averaging. (2) Agreement sets confidence: where engines converge the band tightens; where they diverge it widens, and the disagreement is surfaced rather than hidden. (3) The output is decomposed into the most-likely value, a range, a confidence, a maturity label and the supporting evidence.",
  },

  // ── Output ─────────────────────────────────────────────────────────────────
  {
    id: 'output',
    variant: 'bar',
    position: { x: 80, y: 1640 },
    size: { w: 2140, h: 190 },
    color: 'yellow',
    title: 'Output',
    numbered: true,
    items: [
      'The Outcome — answer + uncertainty band + confidence + maturity label · table stakes',
      'The Journey — full reasoning as an explorable canvas · the moat, made visible',
      'Interrogate & Adjust — chat + sliders, re-run the engines · a thinking tool',
      'Share It — export PDF / slides / image · the finishing layer',
    ],
    fullDescription:
      'The output has four layers. 1 — The Outcome: the answer with its uncertainty band, confidence and maturity label; necessary, but table stakes. 2 — The Journey: the full reasoning rendered as an explorable canvas — the moat made visible, because anyone can show a number but few can show their work honestly. 3 — Interrogate & Adjust: chat and sliders that re-run the engines, turning a static report into a thinking tool. 4 — Share It: export to PDF, slides or image — the finishing layer that gets the answer in front of others.',
  },
];

export const arrows: DiagramArrow[] = [
  // Simul8 -> industries (clean orthogonal bus: down to y130, across, drop into each chip)
  { id: 'a-s8-fmcg', from: 'simul8', to: 'ind-fmcg', type: 'flow', fromSide: 'bottom', toSide: 'top', via: [{ x: 1150, y: 120 }, { x: 710, y: 120 }] },
  { id: 'a-s8-ecom', from: 'simul8', to: 'ind-ecom', type: 'flow', fromSide: 'bottom', toSide: 'top', via: [{ x: 1150, y: 120 }, { x: 930, y: 120 }] },
  { id: 'a-s8-d2c', from: 'simul8', to: 'ind-d2c', type: 'flow', fromSide: 'bottom', toSide: 'top', via: [{ x: 1150, y: 120 }] },
  { id: 'a-s8-pol', from: 'simul8', to: 'ind-politics', type: 'flow', fromSide: 'bottom', toSide: 'top', via: [{ x: 1150, y: 120 }, { x: 1370, y: 120 }] },
  { id: 'a-s8-auto', from: 'simul8', to: 'ind-auto', type: 'flow', fromSide: 'bottom', toSide: 'top', via: [{ x: 1150, y: 120 }, { x: 1590, y: 120 }] },

  // active wedge -> Geography -> input layer
  { id: 'a-d2c-geo', from: 'ind-d2c', to: 'geography', type: 'flow', fromSide: 'bottom', toSide: 'top', label: 'active wedge' },
  { id: 'a-geo-input', from: 'geography', to: 'input-geo', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.5, label: 'geography-scoped' },

  // geography -> the four input components
  { id: 'a-geo-ext', from: 'input-geo', to: 'panel-external', type: 'flow', fromOffset: 0.12, toSide: 'top' },
  { id: 'a-geo-cat', from: 'input-geo', to: 'panel-category', type: 'flow', fromOffset: 0.38, toSide: 'top' },
  { id: 'a-geo-prod', from: 'input-geo', to: 'panel-product', type: 'flow', fromOffset: 0.62, toSide: 'top' },
  { id: 'a-geo-link', from: 'input-geo', to: 'panel-linking', type: 'flow', fromOffset: 0.88, toSide: 'top' },

  // each input component -> its sources
  { id: 'a-ext-1', from: 'panel-external', to: 'src-ext-1', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-ext-2', from: 'panel-external', to: 'src-ext-2', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-ext-3', from: 'panel-external', to: 'src-ext-3', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-ext-4', from: 'panel-external', to: 'src-ext-4', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-cat-1', from: 'panel-category', to: 'src-cat-1', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-cat-2', from: 'panel-category', to: 'src-cat-2', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-cat-3', from: 'panel-category', to: 'src-cat-3', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-cat-4', from: 'panel-category', to: 'src-cat-4', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-prod-1', from: 'panel-product', to: 'src-prod-1', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-prod-2', from: 'panel-product', to: 'src-prod-2', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-prod-3', from: 'panel-product', to: 'src-prod-3', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-prod-4', from: 'panel-product', to: 'src-prod-4', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-link-1', from: 'panel-linking', to: 'src-link-1', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-link-2', from: 'panel-linking', to: 'src-link-2', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },
  { id: 'a-link-3', from: 'panel-linking', to: 'src-link-3', type: 'flow', fromSide: 'bottom', toSide: 'left', curve: 0.8 },

  // input data -> accumulated input
  { id: 'a-input-accum', from: 'input-frame', to: 'accumulated', type: 'flow', fromSide: 'bottom', toSide: 'top' },

  // accumulated -> orchestrator
  { id: 'a-accum-a', from: 'accumulated', to: 'subtask-a', type: 'flow', fromOffset: 0.1, toSide: 'top' },

  // sub-task A loop
  { id: 'a-a-ask', from: 'subtask-a', to: 'ask-user', type: 'flow', fromSide: 'right', toSide: 'left', label: 'if not enough' },
  { id: 'a-ask-accum', from: 'ask-user', to: 'accumulated', type: 'flow', fromSide: 'top', toSide: 'bottom', toOffset: 0.17, curve: 1.15, label: 'loop back' },

  // sub-task A -> sub-task B
  { id: 'a-a-b', from: 'subtask-a', to: 'subtask-b', type: 'flow', fromSide: 'bottom', toSide: 'top', label: 'if enough' },

  // sub-task B -> engine block (dispatch)
  { id: 'a-b-engines', from: 'subtask-b', to: 'engine-header', type: 'flow', fromSide: 'right', toSide: 'left', label: 'dispatch' },

  // each engine -> fusion
  { id: 'a-eng-ts', from: 'eng-timeseries', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.42 },
  { id: 'a-eng-bayes', from: 'eng-bayesian', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.6 },
  { id: 'a-eng-causal', from: 'eng-causal', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.46 },
  { id: 'a-eng-abm', from: 'eng-abm', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.64 },
  { id: 'a-eng-sd', from: 'eng-sysdyn', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.5 },
  { id: 'a-eng-sup', from: 'eng-supervised', to: 'fusion', type: 'flow', fromSide: 'bottom', toSide: 'top', toOffset: 0.68 },

  // fusion -> output
  { id: 'a-fusion-out', from: 'fusion', to: 'output', type: 'flow', fromSide: 'bottom', toSide: 'top', fromOffset: 0.5 },

  // listening layer -> its corpus
  { id: 'a-listen-corpus', from: 'listening', to: 'corpus', type: 'flow', fromSide: 'bottom', fromOffset: 0.2, toSide: 'top', toOffset: 0.5 },

  // ── Calibration loop (the hero) — routed around the engine block ────────────
  // Calibration -> Sub-task B : up the right channel, across the top, down the left gutter.
  {
    id: 'c-cal-b',
    from: 'vault-calibration',
    to: 'subtask-b',
    type: 'calibration',
    fromSide: 'left',
    toSide: 'left',
    label: 'tells B which methods to trust',
    via: [
      { x: 1670, y: 1257 },
      { x: 1670, y: 874 },
      { x: 48, y: 874 },
      { x: 48, y: 1152 },
    ],
  },
  // Calibration -> Fusion : short hop straight down.
  {
    id: 'c-cal-fusion',
    from: 'vault-calibration',
    to: 'fusion',
    type: 'calibration',
    fromSide: 'bottom',
    toSide: 'top',
    toOffset: 0.84,
    label: 'tells Fusion how to weight',
  },
  // Sub-task B -> The Log : down the left channel, along the bottom band, up the inner right gutter.
  {
    id: 'c-b-log',
    from: 'subtask-b',
    to: 'vault-log',
    type: 'calibration',
    fromSide: 'right',
    toSide: 'right',
    toOffset: 0.85,
    label: 'writes routing decision',
    via: [
      { x: 866, y: 1152 },
      { x: 866, y: 1405 },
      { x: 2235, y: 1405 },
      { x: 2235, y: 1110 },
    ],
  },
  // Fusion -> The Log : up the middle right gutter.
  {
    id: 'c-fusion-log',
    from: 'fusion',
    to: 'vault-log',
    type: 'calibration',
    fromSide: 'top',
    toSide: 'right',
    fromOffset: 0.92,
    toOffset: 0.62,
    label: 'writes weighting decision',
    via: [
      { x: 2260, y: 1432 },
      { x: 2260, y: 1074 },
    ],
  },
  // Output -> The Log : up the outer right gutter (closes the loop).
  {
    id: 'c-out-log',
    from: 'output',
    to: 'vault-log',
    type: 'calibration',
    fromSide: 'top',
    toSide: 'right',
    fromOffset: 0.97,
    toOffset: 0.35,
    label: 'writes resolved prediction — closes the loop',
    via: [
      { x: 2285, y: 1632 },
      { x: 2285, y: 1030 },
    ],
  },
];

export const nodeById = new Map(nodes.map((n) => [n.id, n] as const));
