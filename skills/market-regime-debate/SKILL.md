---
name: market-regime-debate
description: Research the current global market, Korean market, and macro regime with current web and finance sources, run a multi-agent debate that defaults to real subagents when available, and save a substantial long-form markdown report. Use when the user asks for world economy and Korean economy context, whether the market is risk-on or risk-off, which macro drivers matter now, or wants a deep market-regime report saved to an .md file.
---

# Market Regime Debate

Use this skill to produce a current regime report for the overall market before choosing themes or individual stocks.
The default deliverable is a genuinely detailed strategist-style document, not a short memo.

Always browse current sources. Market regime work is date-sensitive by definition.

## Inputs

Normalize these before deep research:

- analysis date, with exact date in the report
- market focus such as `global`, `Korea`, `US`, or `global plus Korea`
- desired language
- report path; default to `./reports/<YYYY-MM-DD>/...md`

## Multi-Agent Rule

Default to real subagents for this skill whenever the runtime allows it.

Use all roles from `references/agent-roles.md` unless the request is unusually narrow. Keep the `Evidence Auditor`, `Debate Referee`, and `Final Report Writer` active in every non-trivial run. If real subagents are unavailable, emulate the same roles sequentially and say so once, but still finish with a final report-writing pass.

## Workflow

1. Create the report path early with `scripts/create_market_report_stub.py`.
   - Create that path exactly once per invocation.
   - Treat it as the only canonical report file for the run.
   - Do not create a second markdown report, sidecar draft, or summary file unless the user explicitly asks for it.
2. Read `references/source-policy.md`.
3. Gather a live snapshot for the tape and macro backdrop:
   - major equity indexes and style leadership
   - rates, FX, and liquidity context
   - central-bank posture and key scheduled macro events
   - commodity or cross-asset signals when relevant
4. Run the default role deck from `references/agent-roles.md`, including one skeptical challenge, one evidence-audit pass, and one referee synthesis.
5. Reconcile disagreements into a coordinator packet that separates verified market data, interpretation, regime risks, and the actionable regime call.
6. Hand that packet to the `Final Report Writer`, which rewrites the research into a polished user-facing regime report using `references/report-outline.md`.
   - The final report should feel like a deep briefing note or strategist dossier.
   - Do not stop at a terse summary if the evidence base is rich enough to support a much fuller document.
7. Save exactly one long-form markdown report by updating the original report path in place. If any extra markdown draft was created accidentally, delete it before finishing.

## Report Contract

Unless the user asks otherwise, the report must include:

1. one-paragraph regime verdict
2. a clear statement of scope, date, and market session used as the anchor
3. a front-loaded section for the most important numbers and market reactions
4. a global macro section broken down by major regions or economies when relevant
5. a dedicated Korea section that distinguishes exports, domestic demand, inflation, labor, housing, and policy
6. a dedicated rates, FX, and liquidity section
7. a cross-asset, sector, and market-structure section
8. a skeptical section covering what could break the current call
9. a debate synthesis and evidence-check section that separates verified facts from interpretation
10. an actionable regime judgment
11. a forward watchlist of dates, indicators, and market levels
12. a source list with links

For any non-trivial run, the report should usually be long enough that each major section has real explanatory depth.
If the evidence supports it, prefer a document with multiple substantial paragraphs per major section over a compressed outline.

## Operating Rules

- default to the user's language
- cite time-sensitive claims
- include exact dates and timestamps where useful
- keep macro interpretation separate from verified data
- end with a clear statement on whether the tape currently favors offense, defense, or patience
- keep raw role outputs out of the main report unless the user explicitly asks for a transcript or appendix
- the saved report should read like a strategist note, not a workflow log
- when the report language is Korean, use a Korean report title and natural Korean section headings
- when the report language is Korean, avoid half-translated labels like `시장 스냅샷`, `글로벌 매크로 뷰`, or `한국 매크로 뷰` if a plainer Korean heading would be clearer
- prefer headings that tell the reader what the section is about in everyday Korean, such as `한눈에 보는 결론`, `지금 먼저 봐야 할 숫자`, `세계 경제 흐름`, `한국 경제 흐름`, `금리·환율과 자금 흐름`, `자산시장과 업종 흐름`
- for any non-trivial run, default to a substantial long-form report that fully synthesizes the gathered evidence instead of compressing it into a short memo
- if the user asks for a detailed report, treat that as a request for a much fuller document by default rather than a medium-length summary
