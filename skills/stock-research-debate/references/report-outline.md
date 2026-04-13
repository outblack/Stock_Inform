# Report Outline

Use this file before writing the final markdown report.

## Create The File Early

Generate a default path and report skeleton with:

```bash
python3 /Users/jhkim/.codex/skills/stock-research-debate/scripts/create_report_stub.py \
  --ticker NVDA \
  --company "NVIDIA" \
  --horizon "3 months" \
  --risk-profile aggressive \
  --language ko
```

If the user does not specify an output path, accept the default path printed by the script.

## Frontmatter

Keep the frontmatter short and factual:

```yaml
---
title: "엔비디아 투자 토론 보고서"
ticker: "NVDA"
company: "NVIDIA"
horizon: "3 months"
risk_profile: "aggressive"
analysis_timestamp: "2026-04-12T14:30:00+09:00"
language: "ko"
---
```

When the report language is Korean, the title should be written in natural Korean rather than left in English.

## Required Sections

Use this order unless the user requests a different format:

1. `Executive Verdict`
2. `Request Snapshot`
3. `Today Reference Frame`
4. `Market Snapshot`
5. `Company Context`
6. `Catalyst Map Within The Target Window`
7. `The Bull Case`
8. `The Bear Case`
9. `Debate Synthesis And Evidence Check`
10. `Technical And Execution Playbook`
11. `Scenario Table`
12. `Decision For The Requested Horizon`
13. `Key Risks And Invalidation Triggers`
14. `Source Log`

## Single-Report Contract

- one invocation should produce one final report
- technical analysis and execution planning belong inside the same final report
- do not create a separate technical sidecar report unless the user explicitly asks
- do not dump raw role-by-role notes into the main report body
- update the original stub file in place instead of creating a second markdown report
- if any extra markdown draft was created accidentally, delete it before finishing

## Execution Playbook Requirements

The report should include, when the evidence allows:

- exact current price snapshot date and time
- trend and momentum posture
- support, resistance, breakout, and invalidation levels
- clear `buy now`, `buy on pullback`, `wait`, `trim`, `sell`, or `avoid` guidance with conditions

## Style Rules

- default to detailed prose, not a shallow memo
- for any non-trivial run, default to a substantial long-form report rather than a short memo; usually this should be much longer than a one-page summary
- use exact dates
- cite material facts
- separate evidence from opinion
- make caveats explicit
- keep the final conclusion decisive even when the evidence is mixed
- use report-style headings, not agent-role headings
- summarize the debate in synthesis form instead of transcript form
- put any raw debate appendix behind an explicit user request
- when the report language is Korean, translate the title and section headings into natural Korean
