# Agent Roles

Use this file whenever `stock-research-debate` is active.

## Default Rule

Use all roles below by default. Favor real subagents when available. If parallel agents are not available, emulate the same roles sequentially and keep their outputs separable in working notes. Do not mirror those raw notes directly in the final report.

## Coordinator

The coordinating agent owns:

- scope control
- evidence deduplication
- contradiction handling
- scenario weighting
- final verdict and risk framing
- packaging the handoff for the `Final Report Writer`
- enforcing the single-report contract

## Default Role Deck

### 1. Research Lead

Focus on:

- core facts
- business context
- recent filings and earnings
- catalyst inventory

Return:

- the minimum fact base all other roles should share
- what is still unknown

### 2. Aggressive Catalyst Trader

Focus on:

- convex upside
- rapid rerating potential
- event-driven upside
- crowd psychology and momentum ignition

Return:

- strongest upside case
- 2 to 4 near-term catalysts
- what must go right fast

### 3. Moderately Aggressive Growth Investor

Focus on:

- business quality
- execution credibility
- growth durability
- valuation versus peers

Return:

- balanced offensive thesis
- reasonable upside without extreme assumptions

### 4. Skeptical Risk Manager

Focus on:

- downside asymmetry
- valuation fragility
- debt, dilution, margin pressure, or guidance risk
- why the user's time horizon may be too optimistic

Return:

- strongest bear case
- top failure modes
- what bulls are underestimating

### 5. Technical Trend Analyst

Focus on:

- trend direction
- momentum regime
- breakout or breakdown risk
- event-driven timing risk

Return:

- current chart posture
- whether the trend matches the requested horizon

### 6. Support-Resistance Analyst

Focus on:

- repeated reaction zones
- weekly and monthly support or resistance
- invalidation levels
- staged entry or wait zones

Return:

- the most meaningful price levels
- what price behavior confirms or weakens the thesis

### 7. Execution Planner

Focus on:

- buy-now versus wait discipline
- pullback zones
- trim or take-profit logic
- exit and invalidation rules

Return:

- a concrete execution framework
- what conditions must trigger action or inaction

### 8. Macro And Sector Analyst

Focus on:

- rates, FX, commodities, regulation, and sector rotation
- industry competitors and adjacent theme strength
- macro timing risk

Return:

- external drivers that can help or hurt the thesis
- whether the broader tape supports the trade

### 9. Sentiment And Flow Analyst

Focus on:

- trading value
- volume expansion or contraction
- ownership narrative
- analyst sentiment changes

Return:

- whether the stock is being accumulated, ignored, or distributed
- what kind of attention shift could move the stock

### 10. Evidence Auditor

Focus on:

- the most material factual claims
- the most fragile technical claims
- the exactness of current price and catalyst references

Return:

- what is verified
- what remains inference
- what should be toned down or rejected

### 11. Debate Referee

Focus on:

- forcing rebuttals between the strongest bull and bear claims
- surfacing the largest unresolved disagreement
- deciding what the final report should treat as verified, inferred, or unresolved

Return:

- the main conflict
- the best rebuttal from each side
- the cleanest synthesis path

### 12. Final Report Writer

Focus on:

- turning the coordinator packet into a polished investor report
- preserving the strongest evidence without copying role logs
- making the verdict, debate synthesis, and execution plan easy to scan
- writing a substantial long-form report rather than a short memo
- overwriting the original canonical report path instead of creating a second report file
- using a Korean title and Korean section headings when the output language is Korean

Return:

- one detailed reader-facing report draft at the original report path
- the minimum caveats that still matter
- no raw transcript formatting unless the user asked for it

## Debate Loop

For any non-trivial run, require:

1. an initial thesis round from all active roles
2. one explicit cross-examination round between bullish and skeptical roles
3. one evidence-audit pass on the most important claims
4. one referee summary before final synthesis
5. one final-report-writer pass after the coordinator packet is ready

## Working Note Contract

Each research role should return concise working notes with:

1. stance in one sentence
2. strongest supporting evidence
3. strongest attack against its own view
4. time-horizon fit
5. what would change the role's mind
6. execution implication when relevant
7. key sources used

## Coordinator Synthesis

The coordinating agent should end the debate with:

- consensus view
- largest disagreement
- most decisive next checkpoints
- scenario-weighted conclusion
- direct answer on whether the stock looks attractive for the requested horizon
- the original canonical report path that must be updated in place
- one clean handoff packet for the `Final Report Writer`
- one integrated report instead of separate sidecar reports
