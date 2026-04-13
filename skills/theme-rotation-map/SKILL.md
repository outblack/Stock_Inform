---
name: theme-rotation-map
description: Research today's market themes with current web and market sources, score each theme for continuity, expectation, and freshness, identify leader stocks that truly qualify, fold theme ranking plus per-leader technical trade plans into one integrated markdown report, run an adaptive multi-agent debate with verification roles when available, and save exactly one final report. Use when the user asks which themes are hottest today, wants a ranked theme map, wants leader stocks for each theme, wants buy-sell scenarios for those leaders, wants relay or rotation scenarios, or wants a daily theme report saved to an .md file.
---

# Theme Rotation Map

Use this skill to rank the day's themes and turn noisy headlines into one debate-backed theme map with executable leader-stock playbooks.

Always browse current sources. Theme heat is highly time-sensitive.

Unless the user explicitly overrides it, treat `today` as the current local-market date and use exact calendar dates in the report.

## Inputs

Normalize these before deep research:

- market focus such as `Korea`, `US`, or `Korea small caps`
- analysis date, defaulting to `today`, with exact date in the report
- desired language
- report path; default to `./reports/<YYYY-MM-DD>/...md`

If the user asks for themes plus leader stocks, technicals, support-resistance, or buy-sell timing, keep everything inside this one report unless the user explicitly asks for separate follow-up reports.

## Multi-Agent Rule

Default to real subagents for this skill whenever the runtime allows it.

Use the adaptive role deck from `references/theme-agent-roles.md`. Start from the full deck, then add or de-emphasize roles to match the user's request, but keep the `Evidence Auditor`, `Debate Referee`, and `Final Report Writer` active in every non-trivial run.

If real subagents are unavailable, emulate the same roles sequentially and say so once. Even in fallback mode, keep the role outputs as working notes and run one final report-writing pass before saving the user-facing file.

The workflow should feel adaptive. Do not wait for the user to explicitly name the skill or enumerate every sub-step when the request clearly matches theme-rotation work.

## Workflow

1. Create the report path early with `scripts/create_theme_report_stub.py`.
   - Create that path exactly once per invocation.
   - Treat it as the only canonical report file for the run.
   - Do not create a second markdown report, sidecar draft, or summary file unless the user explicitly asks for it.
2. Read `references/source-policy.md` and `references/scoring-framework.md`.
3. Build a candidate theme list from current news flow, price action, trading value, and obvious market narratives.
4. Score each theme for continuity, expectation, and freshness using `references/scoring-framework.md`.
5. For the top themes, identify the true leader, near-leader, and weak followers. Pull current price context and chart posture for each true leader when the data is available.
6. Run the adaptive role deck from `references/theme-agent-roles.md`, including one explicit cross-examination round where bullish and skeptical roles challenge each other and the `Evidence Auditor` checks the most important claims.
7. Reconcile disagreements, reject weak themes plainly, and decide whether each leader is `buy now`, `buy on pullback`, `wait`, `trim into strength`, or `avoid`.
8. Build a coordinator packet with ranked themes, winning and losing arguments, verified catalyst claims, leader-stock execution plans, and the biggest unresolved disagreement.
9. Hand that packet to the `Final Report Writer`, which rewrites the research into one polished user-facing report using `references/report-outline.md`.
10. Save exactly one long-form markdown report by updating the original report path in place. Do not split the final answer into a separate theme report plus separate leader-stock reports unless the user explicitly asks for that structure. If any extra markdown draft was created accidentally, delete it before finishing.

## Leader Stock Rule

For each hot theme, identify a leader or primary leader set.

Prefer stocks that:

- react first and strongest to the theme
- approach daily upper-limit behavior or show equivalent explosive tape
- record at least KRW 100 billion in trading value during the rising window when Korean small-cap themes are involved

If the turnover rule cannot be confirmed exactly, note the limitation and explain the proxy used.

For each selected leader, include:

- current price snapshot and timestamp when available
- why it qualifies as the leader instead of a noisy follower
- technical posture across the most relevant timeframes
- support, resistance, breakout, and invalidation levels
- concrete buy, wait, trim, and exit scenarios with conditions

## Operating Rules

- default to the user's language
- cite time-sensitive claims
- separate verified tape behavior from narrative interpretation
- keep rankings evidence-based, not vibe-based
- include a direct statement about which themes are strong, crowded, fading, or still early
- keep leader-stock execution guidance inside the same final report
- if the request is broad, adapt the role mix and report depth automatically instead of asking the user to script the workflow for you
- keep raw role outputs out of the main report body unless the user explicitly asks for a transcript or appendix
- the saved report should read like a market note, not a debate log
- when the report language is Korean, use a Korean report title and Korean section headings
- for any non-trivial run, default to a substantial long-form report that fully synthesizes the gathered evidence instead of compressing it into a short memo
