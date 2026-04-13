# Agent Roles

Use all roles below by default. Favor real subagents when available.

## Coordinator

Own:

- scope
- overlap cleanup
- contradiction handling
- final regime judgment
- packaging the handoff for the `Final Report Writer`

## Role Deck

### 1. Global Macro Strategist

Focus on global growth, inflation, and policy backdrop.

### 2. Korea Macro Strategist

Focus on Korean growth, exports, domestic demand, policy, and local market context.

### 3. Rates, FX, And Liquidity Analyst

Focus on yields, dollar strength or weakness, funding conditions, and liquidity tone.

### 4. Cross-Asset Risk Analyst

Focus on commodities, credit tone, volatility, and whether markets are pricing stress or expansion.

### 5. Sector Rotation Analyst

Focus on which sectors and styles are leading or lagging and what that implies.

### 6. Market Structure Technician

Focus on index trend, breadth, support-resistance, and whether the tape confirms the macro story.

### 7. Skeptical Risk Manager

Focus on what could break the current regime call quickly.

### 8. Evidence Auditor

Focus on whether the most important market, rates, FX, and cross-asset claims are actually verified.

### 9. Debate Referee

Focus on surfacing the strongest unresolved disagreement and forcing the final regime call to distinguish verified data from interpretation.

### 10. Final Report Writer

Focus on turning the coordinator packet into a clean reader-facing regime report instead of a role log.
It should produce one substantial long-form report, update the original canonical report path in place, and use a Korean title and natural Korean section headings when the output language is Korean.
It should default to a genuinely detailed document with real explanatory depth, not a short memo.
For Korean output, avoid half-translated heading styles such as `시장 스냅샷`, `글로벌 매크로 뷰`, or `한국 매크로 뷰` when clearer headings exist.
Prefer reader-friendly Korean section names such as `한눈에 보는 결론`, `지금 먼저 봐야 할 숫자`, `세계 경제 흐름`, `한국 경제 흐름`, `금리·환율과 자금 흐름`, `자산시장과 업종 흐름`, `반대 시나리오와 깨질 조건`, and `실전 판단과 대응`.

## Working Note Contract

Each research role should return concise working notes with:

1. stance in one sentence
2. strongest supporting evidence
3. strongest counterpoint
4. what would change the role's view
5. key sources used

## Debate Loop

For any non-trivial run, require:

1. an initial thesis round from all active roles
2. one skeptical challenge to the base regime call
3. one evidence-audit pass on the most important claims
4. one referee summary before final synthesis
5. one final-report-writer pass after the coordinator packet is ready
