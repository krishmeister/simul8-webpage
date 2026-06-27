# Simul8 — The Project Bible

### Calibrated Decision Intelligence · Full System Architecture

---

## 0. What Simul8 Is

Simul8 is a calibrated decision-intelligence platform. It helps operators make high-stakes decisions under uncertainty — and, unlike every "predict anything" tool on the market, it can prove how good its predictions actually are.

The core thesis: **we don't sell the number, we sell the record behind the number.** Foundation models are commoditizing; anyone can generate a confident-sounding answer. What no competitor can manufacture is a time-indexed, cryptographically anchored, publicly auditable track record of "we predicted X with Y confidence on date Z, and here is how it actually resolved." That record is the moat, and it compounds with time rather than with compute.

Three properties define the product:

- **Methodological pluralism.** No single prediction technique is trusted to be universally right. Seven distinct methods run, and a calibrated fusion layer combines them — weighted by what each has actually gotten right.
- **Honesty as the product surface.** Every output carries its uncertainty band, its confidence, and a maturity label. When the system isn't sure, it says so and widens the range, rather than faking precision. When it can't answer honestly at all, it refuses.
- **The calibration loop.** Every prediction is logged, every outcome is matched against it, and the gap continuously re-teaches the system which methods to trust for which questions. The system gets sharper every cycle, and it can prove it.

The one-line version: **one calibrated engine, applied wedge by wedge — data flows in, the orchestrator routes the question, seven methods predict, a calibrated fusion layer distills them into one honest answer, and every resolved outcome sharpens the system.**

---

## 1. The Wedge Strategy — Industries and Geography

### Industries

Simul8's engine is universal, but it is deployed **one industry at a time**, never all at once. The same architecture sits under every vertical; only the data layer above it changes. The named verticals are FMCG, E-Commerce, **D2C (the active wedge)**, Politics, and Automotive.

D2C is the founding wedge for one decisive reason: **it is the rare domain where the ground truth collects itself.** When a D2C operator raises a price and sells fewer units, that outcome is captured automatically through Shopify, Razorpay, Meta, and Google APIs — and it resolves in weeks, not years. That gives the calibration log the fast, clean feedback it needs to start compounding. Other verticals (politics, automotive) require primary data that doesn't pre-exist and resolves slowly; they wait for later phases, entered from a position of strength once the engine and track record are proven.

### Geography

The wedge is **geography-scoped**. The active deployment is India · D2C. Geography sits between the chosen industry and the data architecture because the data, the priors, and the calibration are all locality-specific — a model of Indian D2C apparel is not a model of Australian D2C apparel. Scoping by geography is what keeps the context graphs accurate and the calibration meaningful. Breadth is the enemy early; depth in one geography is the discipline.

---

## 2. Input Data — The Four Components

Everything the system knows flows in through four components. The first three are sources of belief; the fourth is the machinery that combines them.

### 2.1 External Data — *the world as backdrop*

Public-domain and licensed information that sets the macro and category backdrop.

- **Public authoritative data** *(uses LLM for extraction)* — Census, RBI/ABS, festival and event calendars, weather, macro indicators. Parsed from messy public sources into structured form.
- **Economic activity data** — challan data, cigarette data, per-capita data, in cohort form. A signal of business and economic activity. (Aggregate/published only — never individual-level records.)
- **Prediction-market data** — odds and crowd forecasts from Polymarket, Kalshi, and similar, used as an input signal. Strong for event-driven category dynamics, near-useless for micro-decisions.
- **Licensed premium feeds** — Bloomberg (financial/market data), Tracxn (company/funding data), obtained under license. (Licensed, never scraped — provenance must be clean because the product sells auditability.)

### 2.2 Category Data — *priors for this market*

How the category (D2C) actually behaves. The hardest component to get, because it doesn't pre-exist in any corpus and only sharpens through resolved outcomes. This is Moat III, the context graph.

- **Expert panel** *(uses LLM to structure transcripts)* — the day-zero seed. A curated panel of D2C operators and specialists supplies the initial category priors before any operator data exists. Their estimates are elicited as ranges (low/expected/high), and their *disagreement* becomes the uncertainty band. Over time, the experts are themselves scored against resolved outcomes and reweighted by accuracy.
- **The Helium-ish tool** — a free Shopify tool that gives operators genuine standalone value, and in return yields anonymized, user-end cohort data. Pooled across many operators, this becomes the compounding category-knowledge layer feeding research and calibration. Distribution and data acquisition in one.
- **Validated research** *(uses LLM for extraction)* — peer-reviewed studies on D2C pricing elasticities, channel-substitution, and return-rate behavior, filtered through a Research Validation Pipeline on four criteria (reproducibility, consistency, context fit, effect-size magnitude). The citable, empirical complement to expert gut. Sub-sources: academic databases (Google Scholar, SSRN, NBER, arXiv), industry research (McKinsey/BCG/Bain, Shopify/Meta/Stripe benchmarks, Redseer/Bain-Flipkart/Avendus), and meta-analyses (the highest-value target — pre-weighted effect sizes across many studies).
- **Competitive / market-structure data** *(uses LLM for extraction)* — who the players are, pricing bands, promo patterns, concentration. Assembled from the system's own cohort data, the expert panel, and ad-library data. Mostly a convergence of sources already held.

### 2.3 Product Data — *the operator's own reality*

The brand's own data, enabling predictions specific to them. Split into automatic feeds and declared inputs.

- **Commerce & transaction data** *(feeds, no LLM)* — storefront, catalog, orders, conversion, returns, payments. Tools: Shopify, WooCommerce, custom storefronts; Razorpay, Cashfree, PayU, Stripe.
- **Marketing & acquisition data** *(feeds, no LLM)* — ad spend, ROAS, CAC, creative performance, channel mix. Tools: Meta Ads, Google AdWords, and other ad/analytics platforms.
- **Operations & supply data** *(part feed, part interview)* — inventory levels, fulfillment, supplier lead times, reorder capacity, offline/wholesale channels. Digital inventory state comes via ERP/inventory tools (SAP, Shopify Inventory); supply constraints and offline reality come via the AI interview where no system holds them.
- **AI interview — cost, margin & strategic context** *(uses LLM for conversation)* — captures what no API exposes: COGS, true margins, pricing floors, plus the decision itself, goals, risk tolerance, and brand constraints. Also validates the feed data — sanity-checking declared floors and reorder limits against what the systems report. Two conversations live here: a durable onboarding conversation (cost structure, constraints, goals) and a per-decision conversation (the specific question). The interview elicits and clarifies; it never *infers* missing data.

### 2.4 Data Linking — *one query-time picture*

Not a source — the machinery that fuses the three sources into one coherent prediction.

- **Fuses the three sources** — External backdrop + Category priors + Product specifics combined into one coherent picture. The Bayesian integration layer.
- **Pre-built recipe** — the *structure* of how the data types combine is defined and maintained ahead of time (re-validated against held-out outcomes, not curve-fit to recent data).
- **Applied live** — the operator's fresh data is fused with the stored priors *at query time* to produce their specific answer. A pre-built recipe applied to fresh ingredients on demand.

A note on how the data is sourced overall: it is a **continuously-maintained warehouse, not a live scavenger hunt.** External and Category data sit stored, filtered by category, refreshed on cadences matched to how fast each changes, each stamped with a freshness indicator. Product data is the freshest shelf, synced near-live. When a question arrives, the system pulls the relevant items, applies the linking recipe, and produces the answer — refusing or widening uncertainty if it would otherwise predict against stale data.

---

## 3. Accumulated User Input Data

The merge point. It holds the **relevant slice** of the four-component input data *plus* the user's intent (what outcome they want). Not all the data — the filtered slice the specific question needs. It accumulates from two sources: automatic feeds pour in structured data, and the orchestrator's gap-filling loop tops it up with conversationally-elicited data. This is the running, growing state that feeds the orchestrator.

---

## 4. The Orchestrator

The orchestrator decides *what to run*. It has two sub-tasks and one passive layer.

### Sub-task A — Intent *(AI · LLM)*

Parses the user's raw request into a structured problem statement: question-type, decision variable, constraints, horizon. If the input is under-specified, it does **not** guess — it routes back to the user.

### The Ask-the-User loop

When Sub-task A finds the input insufficient, it sends a bounded request — "fill in the missing fields" — and the answer flows back into Accumulated User Input Data, which re-enters Sub-task A. One or two targeted clarifications, then it proceeds. This loop is what keeps a vague question from producing a confident-but-wrong routing. The loop is a feature, not a fallback.

### Sub-task B — Method Selection & Weighting *(calibration-driven, no free LLM judgment)*

Takes the structured statement, selects which of the engines to fire, and sets their initial weights — based on the calibration log's track record for this question-type and domain. This is **evidence-governed routing**, not an LLM making a free judgment call. An LLM may help classify the question; it never decides the method weights.

### The Listening / Capture Layer *(passive — an overlay across the whole orchestrator)*

Runs alongside the entire orchestration, observing. It logs every interaction — raw input, structured statement, method selection, weights, and later the resolved outcome — into the privacy-governed corpus that will eventually train the SLM (a smaller, specialized model that understands D2C decision language and the system's calibration patterns). It is built from day one because training data can only be *accumulated*, never back-filled. Critically: it **observes, never steers** the live routing, and it inherits the same data-rights regime as everything else (raw interactions stay tenant-private; only de-identified patterns join the shared corpus). It feeds the SLM Corpus.

---

## 5. The Prediction & Simulation Engine

Seven methods. The orchestrator fires the relevant subset for each question — usually several, rarely all. **None of these engines use an LLM for their inference.** The "intelligence" people associate with AI lives at the edges (extraction, intent, narration); the computational middle is LLM-free, which is exactly what makes it auditable.

### 5.1 Time-Series Forecasting — *the baseline*
Projects where a metric goes if nothing changes — the trajectory every intervention is measured against. Best for demand, trend, "what will next quarter look like."
**Tools:** Time-Series Foundation Models — TimesFM (Google), Chronos (Amazon), Moirai (Salesforce), Lag-Llama. Self-hosted open-weight models, not an external API.

### 5.2 Bayesian Prediction — *the calibrated core*
The probabilistic spine. Combines priors (research, experts, category) with the brand's own data to produce a *distribution* with an honest uncertainty band — not a single number. Updates as new evidence arrives. Where confidence decomposition lives. Uses Monte Carlo intrinsically.
**Tools:** Stan, PyMC, NumPyro.

### 5.3 Causal Modeling — *the intervention engine*
The engine that makes Simul8 more than a forecaster. Models cause-and-effect, so you can pull a lever ("raise price 15%") and trace the downstream effect through its mechanism. Answers "what if I *do* X." Two modes: causal discovery (learn the structure) and intervention (compute the effect). Uses Monte Carlo to propagate uncertainty.
**Tools:** DoWhy, EconML, CausalML, NOTEARS, LiNGAM.

### 5.4 Agent-Based Simulation — *the emergence engine*
Population-grounded market simulation — many agents whose behaviors are drawn from real statistical distributions (not LLM-generated personas), interacting to produce emergent dynamics: cascades, competitive responses, word-of-mouth. The swarm approach done right. Inherently stochastic (Monte Carlo by nature).
**Tools:** Mesa (agent logic is proprietary; the framework is open-source).

### 5.5 System Dynamics — *the feedback-loop engine*
Models stocks, flows, and feedback over time — inventory building and depleting, customer base growing and churning, market saturation. For long-horizon questions where today's state feeds tomorrow's, with delays causing overshoot and oscillation. Uses Monte Carlo when parameters are uncertain.
**Tools:** PySD, BPTK-Py.

### 5.6 Supervised ML — *the pattern-scoring engine*
Learns from the operator's own past labelled data to score new cases. Answers *who/which*, not *why* or *what-if* — churn, lifetime value, conversion likelihood, lead scoring. Trained ahead of time in batch on the operator's history (or, for new operators, on the cohort fingerprint), then scores live.
**Tools:** gradient-boosted trees — XGBoost, LightGBM. Self-hosted, no LLM.

### 5.7 Monte Carlo — *the uncertainty substrate*
Not a peer engine but a technique woven through the others: run a scenario thousands of times with varied inputs to map the full range of outcomes and their probabilities. Intrinsic to Bayesian and Agent-Based; on-demand for Causal and System Dynamics; rarely needed by Time-Series or Supervised ML (they produce their own probabilities). Drawn as a substrate the engines call, not a step in the pipeline.

---

## 6. Multi-Method Fusion + Calibration — *the layer that compounds*

The chairperson of the engines. Each engine answers independently; this layer combines their separate answers into **one honest outcome**. It predicts nothing itself — it distills. **No LLM here; this is pure math.**

Three moves:

1. **Weight by proven trust.** Each engine is weighted by its calibration track record *for this question-type* — not equal averaging. "Causal has earned 50% of the say on apparel pricing, ABM 20%."
2. **Agreement sets confidence.** When the engines converge, the answer is tight and confident. When they diverge, the uncertainty widens and the disagreement is *surfaced, never hidden*. Divergence makes the system more humble, not falsely precise — this is what separates Simul8 from confident hallucination.
3. **Decomposed output.** Never a bare number — "most-likely X, credible range Y–Z, at this confidence, with this maturity label, and here's which evidence drove it."

The "+ Calibration" is what makes the weighting *earned*: the log grades every engine against resolved outcomes, and those updated weights feed back into the next prediction. The distillation gets sharper every cycle.

*(The hardest unsolved problem lives here too: fusing mathematically different outputs — a Time-Series curve vs. an Agent-Based spread — is genuinely hard. The discipline that keeps it honest is move 2 — degrade to wider uncertainty rather than fabricate false coherence.)*

---

## 7. The Output

The output is not a bare answer — it evolves from a *report* into an *explorable reasoning canvas*. Four layers, built in value-order:

### Layer 1 — The Outcome *(table stakes)*
The answer, never bare — result + uncertainty band + confidence + maturity label, readable at a glance. The honesty travels *with* the number, so even the quick read can't mistake it for certainty.

### Layer 2 — The Journey *(the moat, made visible)*
The full A-to-Z reasoning shown as a navigable node-graph — the causal chain, which engines contributed and where they agreed or diverged, the evidence and data feeding each. The user pans, clicks any node to go deeper, and traces the logic to its roots. This is the answer to "why should I trust this?" — opt-in depth, headline first. The single most differentiating surface in the product.

### Layer 3 — Interrogate & Adjust *(a thinking tool)*
Chat + sliders to ask new "what-ifs" and re-run the engines. Structured controls for known values, a chat box for novel questions. Both re-run the engines and re-draw the relevant part of the journey; the LLM routes and narrates but never invents the answer. Cheap tweaks feel instant; full re-runs are an explicit action, to protect compute cost. (Every re-run is also a logged scenario feeding the calibration corpus — the surface that delights the user also feeds the moat.)

### Layer 4 — Share It *(the finishing layer)*
Export the outcome and reasoning as PDF, slides, or image to justify the decision to a co-founder, board, or team. Genuine workflow value, least differentiating, easiest to build. The bow on the package, not the package.

**Output narration uses an LLM — for rendering only.** It turns the computed result into readable language; it never produces or alters the answer, and any follow-up "what-if" routes back through the engines rather than being answered from the LLM's head.

---

## 8. The Vault — The Calibration Loop

The Vault is the calibration store, sitting beside the live pipeline. It is read by the orchestrator *and* the fusion layer, and written to by the output — the connective tissue that makes the system learn.

### The Log
A tamper-evident, append-only database — the system's diary. Writes a row every time a prediction is made (the prediction, its confidence, which methods fired, their weights, the resolution date) and again when the outcome resolves (the actual result and the gap vs. prediction). Cryptographically anchored (Merkle-tree) so any prediction can be independently verified by an outside party. Pure engineering: no LLM, no judgment, just structured, timestamped, auditable storage. **This is Moat I — the one thing a competitor cannot retroactively manufacture.**

### Calibration
A statistical algorithm — programmed once, runs automatically as outcomes resolve. It compares predicted vs. actual across many past predictions and asks two things: were we *accurate*, and were we *honestly confident* (do our "70% confident" calls actually come true ~70% of the time?). From the gap, it updates the weights — how much each engine, source, and prior is trusted going forward. Established techniques (reliability diagrams, Brier scores, isotonic regression / Platt scaling). Runs as a scheduled batch job, not in real time. **No LLM, no manual scoring** — the only human touch is capturing the outcome for Tier B operators with no feed to read it from. The intelligence here is statistics, not AI — which is exactly why it's transparent and auditable.

### The five loop arrows (the heart of the system)

1. **Calibration → Sub-task B** — tells the orchestrator which methods to trust, before the engines run.
2. **Calibration → Fusion** — tells the fusion layer how to weight the engine outputs.
3. **Sub-task B → The Log** — writes its routing decision.
4. **Fusion → The Log** — writes its weighting decision.
5. **Output → The Log / Calibration** — writes the resolved prediction, closing the loop.

Outcome capture is automatic for Tier A operators (read from Shopify/Razorpay feeds) and a structured ask for Tier B operators (no feed to read from). Once the outcome is in the log, the gap computation and weight update are pure math. Then Sub-task B and Fusion read the improved log on the next prediction. That closed loop, running continuously, *is* the moat compounding.

---

## 9. Where the LLM Is — and Isn't

The single most important architectural boundary. The LLM lives **only at the edges**:

| Stage | LLM? | Role |
|---|---|---|
| Input extraction (public data, research, competitive, expert panel, AI interview) | **Yes** | Extraction & structuring — parsing messy sources into structured form |
| Orchestrator — Sub-task A | **Yes** | Intent parsing — turning the raw request into a structured problem |
| Orchestrator — Sub-task B | **No** | Calibration-driven routing; LLM may classify but never sets weights |
| The seven engines (inference) | **No** | Pure statistics, simulation, and ML — never LLM |
| Multi-Method Fusion | **No** | Pure math — weighting, agreement-check, combination |
| Calibration | **No** | Pure math — grading and weight updates |
| Output | **Yes** | Narration only — renders computed results into language; never infers |

The hollow, LLM-free middle — where the actual predicting and grading happen — is the architecture. It is what lets Simul8 tell a regulator or a CFO: "the answer was computed by auditable statistics, not generated by a language model." The Agent-Based engine is the one to guard hardest — its agents must be drawn from statistical distributions, never from LLM-generated personas, or the system becomes the very confident-hallucination tool it is built to beat.

---

## 10. The Moats

Five moats, in order of defensibility:

1. **The Calibration Log (Moat I).** A time-indexed, cryptographically anchored, publicly auditable record of predictions and outcomes. Cannot be bought, hired, or trained — it only comes into existence by running the platform over time. The primary moat; everything else compounds because this exists.
2. **The Research Validation Pipeline (Moat II).** The curated, weighted research corpus and the discipline of its four-criterion filter. Institutional IP, not model IP.
3. **The Context Graphs (Moat III).** Locality-specific structured category knowledge, built from authoritative data and corrected by resolved outcomes. Takes years of on-the-ground effort; cannot be bought past.
4. **Workflow Lock-in (Moat IV).** Versioned scenarios, decision histories, team annotations — depth that lives in the operator's own accumulated work.
5. **Scenario Memory (Moat V).** Cross-scenario precedent retrieval against the system's own history.

Explicitly **not** moats: the language model (commoditizes every six months), the prediction techniques (academic), the UI (gets copied), the cloud, and the founding team's pedigree. Naming what isn't a moat is how the company stays honest about where compounding actually happens.

### Why this is LLM-evolution-proof
Capability gains in frontier LLMs flow into the system as *better input quality* and exit as *sharper calibration curves*. A better model does not retroactively create a calibration log, does not gather consented operator data, and does not buy years of curation taste. Simul8 is the downstream beneficiary of LLM progress, not its competitor. The calibration log is also model-agnostic — swap in a better engine and the curves get sharper; the company is never stranded by model progress.

---

## 11. The Through-Line

Because prediction is niche-by-niche and needs *wired-up* data, Simul8 builds four data components (External, Category, Product, Linking), feeds them through an orchestrator that routes each question, fires a subset of seven calibrated engines, distills their answers in a fusion layer weighted by proven trust, and grades every outcome in a tamper-evident log that re-teaches the whole system. The same engine sits under every industry; reach is the sum of conquered niches, not a global launch. And the one thing that makes it all defensible — the calibration log — is the one thing that can only be earned by running, never bought.

**Build the log. Keep it honest. Outlast the doubt.**

---

*This document is the canonical reference for the Simul8 architecture. It is data-driven: every box, source, engine, and arrow in the interactive diagram maps to a section here.*
