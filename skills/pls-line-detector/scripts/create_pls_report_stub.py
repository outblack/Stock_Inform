#!/usr/bin/env python3
"""Create a markdown stub for a PLS line report."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "report"


def build_default_output(focus: str, now: datetime) -> Path:
    day_dir = Path.cwd() / "reports" / now.strftime("%Y-%m-%d")
    stem = slugify(focus)
    filename = f"{now.strftime('%Y%m%d-%H%M%S')}-pls-line-{stem}.md"
    return day_dir / filename


def is_korean(language: str) -> bool:
    return language.strip().lower().startswith("ko")


def localize_focus(focus: str, language: str) -> str:
    if not is_korean(language):
        return focus
    mapping = {
        "global plus korea": "글로벌·한국",
        "global": "글로벌",
        "korea": "한국",
        "us": "미국",
    }
    return mapping.get(focus.strip().lower(), focus)


def render_report(focus: str, language: str, now: datetime) -> str:
    timestamp = now.isoformat(timespec="minutes")
    analysis_date = now.date().isoformat()
    display_focus = localize_focus(focus, language)
    if is_korean(language):
        title = f"{display_focus} PLS 라인 분석 보고서"
        return f"""---
title: "{title}"
focus: "{display_focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {display_focus} PLS 라인 분석 보고서

## 핵심 결론

[이번 후보가 유효한 PLS 셋업인지 한 문단으로 직접 답하라. 짧게 끝내지 말고 근거와 조건을 함께 설명하라.]

## 요청 개요

- 범위: `{display_focus}`
- 보고서 언어: `{language}`
- 분석 시각: `{timestamp}`
- 기준 거래일: `{analysis_date}`

## 기준 시점

[이 보고서가 어떤 시장 날짜를 기준으로 작성됐는지 정확히 설명하라.]

## 후보 스크린 요약

[후보가 왜 통과했는지, 왜 탈락했는지, 어떤 조건이 핵심이었는지 자세히 정리하라.]

## 왜 이 셋업이 성립하거나 무너지는가

[가장 강한 찬성 논리와 반대 논리를 함께 놓고 왜 지금 유효한지 또는 아직 아닌지 자세히 설명하라.]

## 통과 후보 표

| 후보 | 상태 | 성립 이유 | 현재가 스냅샷 | 행동 판단 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 기대감 및 촉매 점검

[내러티브가 아직 살아 있는지, 촉매가 실제로 남아 있는지 자세히 설명하라.]

## 소외도 및 유동성 점검

[시장이 이 종목을 실제로 외면하고 있는지, 거래량과 관심이 얼마나 식었는지 자세히 설명하라.]

## 통합 후보 실행 계획

### 후보 1

- 현재가 스냅샷:
- 왜 성립하는가:
- 주봉·월봉 기술적 위치:
- 주요 지지:
- 주요 저항:
- PLS 구간:
- 지금 매수 조건:
- 분할 진입 조건:
- 대기 조건:
- 분할 정리 또는 매도 조건:
- 무효화 조건:

### 후보 2

- 현재가 스냅샷:
- 왜 성립하는가:
- 주봉·월봉 기술적 위치:
- 주요 지지:
- 주요 저항:
- PLS 구간:
- 지금 매수 조건:
- 분할 진입 조건:
- 대기 조건:
- 분할 정리 또는 매도 조건:
- 무효화 조건:

## PLS 라인 표

| 후보 | 라인 | 구간 | 시간축 | 중요한 이유 | 행동 판단 |
| --- | --- | --- | --- | --- | --- |
|  | 상단 PLS |  |  |  |  |
|  | 하단 PLS |  |  |  |  |

## 토론 종합 및 증거 점검

[무엇이 검증된 사실인지, 무엇이 해석인지, 가장 큰 쟁점이 무엇인지 자세히 정리하라.]

## 최종 판단

[지금 유효한 셋업인지, 더 기다려야 하는지, 아니면 제외해야 하는지 분명하게 적어라.]

## 핵심 리스크 및 무효화 조건

- 
- 
- 

## 출처 로그

- 
"""

    title = f"{focus} PLS line report"
    return f"""---
title: "{title}"
focus: "{focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {focus} PLS Line Report

## Executive Verdict

[State whether the setup qualifies as a valid PLS candidate and why.]

## Request Snapshot

- Focus: `{focus}`
- Report language: `{language}`
- Analysis timestamp: `{timestamp}`
- Reference trading date: `{analysis_date}`

## Today Reference Frame

[State exactly which market date this report is anchored to and why.]

## Candidate Screen Summary

[Summarize whether the stock or candidates match the neglected-rebound screen.]

## Why The Setup Qualifies Or Fails

[Explain the strongest qualifying case, the strongest failure case, and why the setup currently passes, almost passes, or fails.]

## Qualified Candidate Table

| Candidate | Status | Why It Qualifies | Current Price Snapshot | Action Bias |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Expectation And Catalyst Check

[Explain whether the narrative is still alive.]

## Neglect And Liquidity Check

[Explain whether the market is truly ignoring the name and whether volume has cooled.]

## Integrated Candidate Playbooks

### Candidate 1

- Current price snapshot:
- Why it qualifies:
- Weekly-monthly technical posture:
- Major support:
- Major resistance:
- PLS zones:
- Buy-now condition:
- Stage-in condition:
- Wait condition:
- Trim or sell condition:
- Invalidation:

### Candidate 2

- Current price snapshot:
- Why it qualifies:
- Weekly-monthly technical posture:
- Major support:
- Major resistance:
- PLS zones:
- Buy-now condition:
- Stage-in condition:
- Wait condition:
- Trim or sell condition:
- Invalidation:

## PLS Line Table

| Candidate | Line | Zone | Timeframe | Why It Matters | Action Bias |
| --- | --- | --- | --- | --- | --- |
|  | Upper PLS |  |  |  |  |
|  | Lower PLS |  |  |  |  |

## Debate Synthesis And Evidence Check

[Summarize what was verified, what remains inference, and what the biggest unresolved disagreement is.]

## Decision

[State whether this is a valid PLS setup now, later, or not at all.]

## Key Risks And Invalidation Triggers

- 
- 
- 

## Source Log

- 
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create a PLS-line markdown stub.")
    parser.add_argument("--focus", default="Korea", help="Market or stock focus.")
    parser.add_argument("--language", default="en", help="Report language marker.")
    parser.add_argument("--output", help="Exact output file path.")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing file.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    now = datetime.now().astimezone()
    focus = args.focus.strip() or "Korea"
    output_path = (
        Path(args.output).expanduser().resolve()
        if args.output
        else build_default_output(focus, now).resolve()
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if output_path.exists() and not args.overwrite:
        print(f"Refusing to overwrite existing file without --overwrite: {output_path}", file=sys.stderr)
        return 1

    output_path.write_text(render_report(focus, args.language.strip() or "en", now), encoding="utf-8")
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
