---
name: pls-line-detector
description: Screen for overlooked stocks that are deeply down from peak, ignored by the market, still have living expectation, and sit near repeated weekly or monthly support-resistance zones called PLS lines, then run an adaptive multi-agent debate with verification roles when available and save exactly one detailed markdown report that includes candidate ranking, technical analysis, support-resistance, and buy-sell scenarios. Use when the user asks for neglected rebound candidates, staged-buy ideas near major support, multi-timeframe support-resistance mapping, or a detailed PLS-line report saved to an .md file.
---

# PLS Line Detector

Use this skill to search for neglected stocks near major `PLS` support-resistance zones and turn that screen into one debate-backed execution report.

For this skill, `PLS line` means a historically important price zone where support and resistance have repeated often enough to matter on weekly or monthly charts.

Always browse current sources. The narrative expectation behind a rebound candidate is time-sensitive.

Unless the user explicitly overrides it, anchor the report to the current local-market date and use exact dates in the report.

## Inputs

Normalize these before deep research:

- market focus such as `Korea`
- candidate stock list if the user provides one; otherwise allow a broader screen
- desired language
- report path; default to `./reports/<YYYY-MM-DD>/...md`

If the user asks for PLS candidates plus entry timing, technicals, or sell planning, keep all of that inside the same report unless the user explicitly asks for follow-up standalone reports.

## Multi-Agent Rule

Default to real subagents for this skill whenever the runtime allows it.

Use the adaptive role deck from `references/agent-roles.md`. Start from the full deck, then change emphasis based on whether the user wants broad screening, a short candidate list, or a deep dive on one name, but keep the `Evidence Auditor`, `Debate Referee`, and `Final Report Writer` active in every non-trivial run.

If real subagents are unavailable, emulate the same roles sequentially and say so once. Even in fallback mode, keep the role outputs as working notes and run one final report-writing pass before saving the user-facing file.

The workflow should feel adaptive. Do not wait for the user to explicitly name the skill or spell out each role when the request clearly matches PLS screening or rebound-candidate work.

## Workflow

1. Create the report path early with `scripts/create_pls_report_stub.py`.
   - Create that path exactly once per invocation.
   - Treat it as the only canonical report file for the run.
   - Do not create a second markdown report, sidecar draft, or summary file unless the user explicitly asks for it.
2. Read `references/source-policy.md` and `references/screening-rules.md`.
3. Screen for names that roughly match the setup:
   - materially below peak, often around a 50 percent drawdown area
   - reduced volume or lower attention versus the peak phase
   - still-credible expectation or catalyst
   - repeated weekly or monthly support-resistance reactions
4. Pull current price context when available and confirm whether at least two meaningful PLS lines exist while expectation is still alive.
5. Run the adaptive role deck from `references/agent-roles.md`, including one explicit cross-examination round and one evidence-audit pass on the strongest qualifying candidates.
6. Only then outline staged-entry, wait, trim, sell, and invalidation scenarios. If the setup is weak, reject it plainly.
7. Build a coordinator packet with qualified and rejected names, the real PLS zones, the strongest qualifying case, the strongest skeptical case, and the final execution logic.
8. Hand that packet to the `Final Report Writer`, which rewrites the research into one polished user-facing report using `references/report-outline.md`.
9. Save exactly one long-form markdown report by updating the original report path in place. Do not split screen results and candidate playbooks into separate reports unless the user explicitly asks for that structure. If any extra markdown draft was created accidentally, delete it before finishing.

## Operating Rules

- default to the user's language
- reject names that lack repeatable support-resistance evidence
- reject names where the narrative is already dead unless the user asked for pure technical oversold scans
- separate screening evidence from judgment
- do not present staged-buy ideas as guaranteed outcomes
- for each qualified candidate, include current price context, technical posture, support, resistance, staged buy zones, trim targets, and invalidation conditions when the evidence supports them
- if the request is broad, adapt the role mix and candidate depth automatically instead of forcing the user to script the workflow
- keep raw role outputs out of the main report body unless the user explicitly asks for a transcript or appendix
- the saved report should read like a structured screening memo, not a debate log
- when the report language is Korean, use a Korean report title and Korean section headings
- for any non-trivial run, default to a substantial long-form report that fully synthesizes the gathered evidence instead of compressing it into a short memo
