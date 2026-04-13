---
name: stock-research-debate
description: Research a public stock with current web sources, live price checks, technical analysis, support-resistance analysis, scenario analysis, buy-sell execution planning, and an adaptive multi-agent investment debate with verification roles when available, then save exactly one detailed markdown report. Use when the user asks whether a ticker or company looks attractive over a specific holding period, wants aggressive and moderate bullish views challenged by skeptical and technical views, wants target-return plausibility checked, wants concrete buy-wait-sell scenarios, or wants a long-form equity report saved to an .md file.
---

# Stock Research Debate

Use this skill to turn a stock idea into a current, source-backed, debate-driven markdown report.

Always browse current sources. Prices, news, guidance, technical posture, leadership changes, and catalysts are time-sensitive.

Unless the user explicitly overrides it, anchor the report to the current local-market date and use exact dates in the report.

## Inputs

Normalize these before deep research:

- ticker and exchange
- company name
- holding period, with exact target dates when useful
- risk posture such as `aggressive`, `moderately aggressive`, or `balanced`
- desired return if the user gives one
- desired output language
- report path; default to `./reports/<YYYY-MM-DD>/...md`

If some inputs are missing, make reasonable assumptions and state them near the top of the report.

If the user asks for current price, chart, support-resistance, entry timing, take-profit, or exit logic, keep all of that inside the same final report unless the user explicitly asks for a separate follow-up report.

## Multi-Agent Rule

Default to real subagents for this skill whenever the runtime allows it.

Use the adaptive role deck from `references/agent-roles.md`. Start from the full deck, then change emphasis based on the stock, time horizon, and user intent, but keep the `Evidence Auditor`, `Debate Referee`, and `Final Report Writer` active in every non-trivial run.

If real subagents are unavailable or disallowed, emulate the same roles sequentially in one thread and say once that the debate was simulated instead of parallelized. Even in that fallback, keep the role outputs as working notes and run one final report-writing pass before saving the user-facing file.

The workflow should feel adaptive. Do not wait for the user to explicitly name the skill or enumerate the role deck when the request clearly matches current stock research.

## Workflow

1. Create the report path early with `scripts/create_report_stub.py`, then keep filling the file as evidence stabilizes.
   - Create that path exactly once per invocation.
   - Treat it as the only canonical report file for the run.
   - Do not create a second markdown report, sidecar draft, or summary file unless the user explicitly asks for it.
2. Pull a live price snapshot with the finance tool when available. Record exact retrieval date, time, timezone, currency, and source.
3. Read `references/source-policy.md` and gather a minimum reliable evidence set:
   - investor-relations pages, earnings releases, and shareholder materials
   - SEC filings or local exchange filings when they matter to the thesis
   - recent reputable news on catalysts, guidance, regulation, competition, and sentiment
   - current price, valuation, market-cap, and peer context from reliable market-data sources
4. Map the technical posture, support-resistance zones, and candidate execution paths using the most relevant timeframes for the requested horizon.
5. Run the adaptive role deck from `references/agent-roles.md`, including one explicit cross-examination round and one evidence-audit pass on the most important factual and technical claims. Force each role to answer the same question: `Is this stock attractive for the requested horizon and why?`
6. Reconcile disagreements explicitly. Separate verified facts, derived judgments, and scenario-level speculation.
7. Build a coordinator synthesis packet that contains:
   - verified facts with citations
   - the strongest bull case
   - the strongest bear case
   - the biggest unresolved disagreement
   - the execution playbook and invalidation logic
8. Hand that packet to the `Final Report Writer`, which rewrites the research into one polished user-facing report using `references/report-outline.md`.
9. Save exactly one long-form markdown report by updating the original report path in place. Do not split the final result into a debate report plus a separate technical report unless the user explicitly asks for that structure. If any extra markdown draft was created accidentally, delete it before finishing.

## Source Rules

Read `references/source-policy.md` before answering when the task depends on current pricing, recent news, earnings, guidance, sector moves, technicals, or target-return plausibility.

Minimum rules:

- use current sources and cite them inline
- distinguish verified facts from inference
- include exact dates instead of relative phrases alone
- do not imply certainty or guaranteed returns
- if a technical metric cannot be verified, say so and avoid fake precision

## Report Contract

Read `references/report-outline.md` before writing the final file.

Unless the user asks otherwise, the report must include:

1. one-paragraph verdict
2. current market snapshot
3. company and catalyst summary
4. the strongest bull case and strongest bear case
5. debate synthesis, evidence audit, and biggest disagreement
6. technical and execution playbook with current price, support, resistance, buy, wait, trim, sell, and invalidation logic
7. scenario table for the requested horizon
8. judgment on target-return plausibility when relevant
9. final conclusion with invalidation conditions
10. source list with links

## Operating Rules

- default to the user's language for prose
- cite every material claim that depends on current information
- keep bullish and bearish sections equally concrete
- explicitly mention missing evidence and unresolved questions
- weight technicals and near-term catalysts more heavily for short horizons
- weight balance sheet, execution, valuation, and industry structure more heavily for longer horizons
- treat explicit skill invocation as a strong signal that the user wants the debate structure, even when the final answer must note any runtime fallback
- include a concrete buy-now, buy-on-pullback, wait, trim, exit, or avoid framework when the evidence supports it
- keep raw role outputs out of the main report body unless the user explicitly asks for a transcript or appendix
- the saved report should read like a polished analyst note, not an operations log
- when the report language is Korean, use a Korean report title and Korean section headings
- for any non-trivial run, default to a substantial long-form report that fully synthesizes the gathered evidence instead of compressing it into a short memo
