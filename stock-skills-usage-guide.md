# Stock Skills Usage Guide

이 문서는 현재 만든 주식 리서치 스킬들을 어떻게 호출하면 좋은지 정리한 가이드입니다.

## 만든 스킬 목록

### 1. `stock-research-debate`

개별 종목을 길고 자세한 보고서로 분석합니다.

주요 목적:

- 특정 종목이 원하는 기간 안에 매력적인지 판단
- 공격적, 중간 공격적, 회의적, 기술적, 지지와 저항, 수급 관점을 분리해서 토론
- 검증 서브 에이전트와 반박 라운드를 붙여서 주장 강도 점검
- 현재 가격, 기술적 분석, 지지와 저항, 진입/대기/분할매수/청산 시나리오까지 한 보고서에 포함
- 한 번 실행하면 최종 Markdown 보고서 1개만 저장

예시 프롬프트:

```text
Use $stock-research-debate to analyze TSLA for a 3-month horizon.
Use real subagents for every role you can, add a verification round, and include current price plus buy-wait-sell scenarios.
Save exactly one final markdown report.
```

### 2. `market-regime-debate`

전반적인 세계 경제, 한국 경제, 금리, 환율, 시장 리스크 온오프를 정리합니다.

주요 목적:

- 오늘 시장이 공격적으로 볼 장인지 방어적으로 볼 장인지 판단
- 글로벌 매크로와 한국 매크로를 같이 정리
- 이후 테마/종목 분석 전에 배경판 만들기

예시 프롬프트:

```text
Use $market-regime-debate to analyze the current global and Korean market regime.
Use subagents by default.
Save a long markdown report in Korean.
```

### 3. `theme-rotation-map`

매일 테마를 정리하고 순위를 매기며, 대장주와 돌려차기 시나리오를 만듭니다.

주요 목적:

- 테마별 연속성, 기대감, 신선함 평가
- 오늘 날짜 기준 최고 테마 순위화
- 대장주와 후발주, 순환 시나리오 정리
- 각 인기 테마의 진짜 대장주를 선별하고 현재가, 기술적 분석, 지지/저항, 매수/대기/매도 시나리오까지 한 보고서에 통합
- 검증 서브 에이전트와 토론 라운드를 붙여서 객관적 인사이트 도출
- 한 번 실행하면 최종 Markdown 보고서 1개만 저장

예시 프롬프트:

```text
Use $theme-rotation-map to rank today's hottest Korea market themes.
Score each theme for continuity, expectation, and freshness.
Identify the true leader stocks, include their technical buy-sell scenarios, run a verification debate, and save exactly one markdown report.
```

### 4. `pls-line-detector`

플스선 기반으로 소외주, 눌림목, 분할매수 구간을 찾습니다.

주요 목적:

- 최고점 대비 크게 눌린 종목 탐색
- 거래량이 줄고 소외됐지만 기대감이 살아있는 종목 찾기
- 주봉, 월봉 기준 핵심 지지와 저항 구간 찾기
- 플스선 2개 이상과 분할매수 시나리오 정리
- 현재 가격, 기술적 분석, 지지/저항, 진입/대기/매도 플랜을 후보별로 한 보고서에 통합
- 검증 서브 에이전트와 반박 라운드를 붙여서 약한 후보는 걸러냄
- 한 번 실행하면 최종 Markdown 보고서 1개만 저장

예시 프롬프트:

```text
Use $pls-line-detector to find Korea stocks near major PLS support zones.
Look for neglected names with living expectation.
Map at least two PLS lines when the setup is valid, include technical execution scenarios, and save exactly one markdown report.
```

## 현재 기본 동작 원칙

- 각 스킬은 사용자가 따로 세부 워크플로를 명시하지 않아도, 요청에 맞게 서브 에이전트 구성과 작업 순서를 유동적으로 조절하도록 설계했습니다.
- 각 스킬은 한 번 실행하면 최종 보고서 1개만 만드는 것을 기본 계약으로 둡니다.
- 테마 스킬은 테마 순위와 대장주 실행 플랜을 같은 보고서에 넣습니다.
- PLS 스킬은 후보 스크리닝과 후보별 실행 플랜을 같은 보고서에 넣습니다.
- 개별주 스킬은 투자 토론과 기술적 실행 플랜을 같은 보고서에 넣습니다.

## 꼭 스킬명을 직접 말하지 않아도 되는 요청 예시

```text
오늘 한국 증시에서 제일 강한 테마들 정리하고, 각 테마 대장주 현재가와 기술적 분석, 어디서 사고 어디서 팔지까지 한 보고서로 만들어줘.
```

```text
요즘 소외됐지만 기대감이 아직 살아 있는 한국 종목들 중 플스선 근처 후보를 찾아서, 진입/대기/청산 시나리오까지 한 리포트로 정리해줘.
```

```text
AMD 지금 3개월 관점에서 괜찮은지 토론형으로 분석하고, 현재 가격 기준 지지/저항과 매수/매도 시나리오까지 한 보고서로 정리해줘.
```

## 가장 추천하는 호출 방식

실제 병렬 서브 에이전트를 최대한 강하게 유도하려면 프롬프트에 아래 문장을 같이 넣는 것이 가장 좋습니다.

```text
Use real subagents for every role you can, add a verification round, and only fall back to sequential role simulation if subagents are unavailable.
```

한국어로는 아래처럼 써도 됩니다.

```text
가능한 모든 역할에 실제 서브 에이전트를 사용하고, 검증 라운드도 붙여주고, 불가능할 때만 순차 시뮬레이션으로 대체해줘.
```

## 추천 조합

### 장 시작 전 흐름 확인

1. `market-regime-debate`
2. `theme-rotation-map`

### 특정 종목을 깊게 보기

1. `market-regime-debate`
2. `stock-research-debate`

### 눌림목/소외주 탐색

1. `market-regime-debate`
2. `pls-line-detector`

## 저장 위치

기본적으로 각 스킬은 `./reports/<날짜>/...md` 형태 경로를 먼저 만들고, 그 파일을 채우도록 설계했습니다.

원하면 프롬프트에서 직접 저장 경로를 지정해도 됩니다.

## 로컬 스킬 사본

이 저장소에는 위 스킬들의 사본이 `./skills/` 아래에도 들어 있습니다.

- `./skills/market-regime-debate`
- `./skills/stock-research-debate`
- `./skills/theme-rotation-map`
- `./skills/pls-line-detector`

즉 Codex 기본 스킬 저장소에 있는 원본과 별개로, 현재 프로젝트 안에서도 같은 스킬 문서를 함께 확인할 수 있습니다.
