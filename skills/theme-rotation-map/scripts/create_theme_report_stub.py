#!/usr/bin/env python3
"""Create a markdown stub for a daily theme rotation report."""

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
    filename = f"{now.strftime('%Y%m%d-%H%M%S')}-theme-rotation-{stem}.md"
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
        title = f"{display_focus} 테마 순환도 보고서"
        return f"""---
title: "{title}"
focus: "{display_focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {display_focus} 테마 순환도 보고서

## 핵심 결론

[오늘 가장 강한 테마와 왜 그렇게 판단했는지를 한 문단으로 직접 요약하라. 짧게 끝내지 말고 시장 맥락과 실행 함의까지 포함하라.]

## 요청 개요

- 범위: `{display_focus}`
- 보고서 언어: `{language}`
- 분석 시각: `{timestamp}`
- 기준 거래일: `{analysis_date}`

## 기준 시점

[이 보고서가 어떤 시장 날짜를 기준으로 작성됐는지 정확히 설명하라.]

## 시장 온도

[당일 또는 기준일의 시장 흐름이 왜 특정 테마를 키우거나 죽였는지 자세히 설명하라.]

## 테마 순위표

| 순위 | 테마 | 연속성 | 기대감 | 신선함 | 핵심 촉매 | 진짜 대장주 | 행동 판단 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |

## 상위 테마가 이 자리에 온 이유

[상위 테마들이 왜 높은 점수를 받았는지 근거와 함께 자세히 설명하라.]

## 상위 테마 심층 분석

### 테마 1

[근거, 촉매, 지속성, 리스크를 자세히 정리하라.]

### 테마 2

[근거, 촉매, 지속성, 리스크를 자세히 정리하라.]

### 테마 3

[근거, 촉매, 지속성, 리스크를 자세히 정리하라.]

## 통합 대장주 실행 계획

### 대장주 1

- 소속 테마:
- 현재가 스냅샷:
- 왜 이 종목이 진짜 대장주인가:
- 기술적 위치:
- 지지:
- 저항:
- 지금 매수 조건:
- 눌림 매수 조건:
- 분할 정리 또는 매도 조건:
- 무효화 조건:

### 대장주 2

- 소속 테마:
- 현재가 스냅샷:
- 왜 이 종목이 진짜 대장주인가:
- 기술적 위치:
- 지지:
- 저항:
- 지금 매수 조건:
- 눌림 매수 조건:
- 분할 정리 또는 매도 조건:
- 무효화 조건:

## 순환 및 릴레이 시나리오

[돈이 테마 내 또는 테마 간에 어떻게 이동할 수 있는지 자세히 설명하라.]

## 과열·쇠퇴·제외 테마

[왜 특정 테마는 과열됐고, 왜 어떤 테마는 떨어져 나갔는지 자세히 설명하라.]

## 토론 종합 및 증거 점검

[무엇이 검증된 사실인지, 무엇이 해석인지, 가장 큰 쟁점이 무엇인지 자세히 정리하라.]

## 행동 매트릭스

| 테마 | 대장주 | 판단 | 진입 아이디어 | 정리 아이디어 | 이유 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 핵심 리스크 및 무효화 조건

- 
- 
- 

## 출처 로그

- 
"""

    title = f"{focus} theme rotation map"
    return f"""---
title: "{title}"
focus: "{focus}"
analysis_timestamp: "{timestamp}"
language: "{language}"
---

# {focus} Theme Rotation Map

## Executive Verdict

[State which themes are strongest today and why.]

## Request Snapshot

- Focus: `{focus}`
- Report language: `{language}`
- Analysis timestamp: `{timestamp}`
- Reference trading date: `{analysis_date}`

## Today Reference Frame

[State exactly which market date this report is anchored to and why.]

## Market Pulse

[Summarize the current tape and why themes are or are not expanding.]

## Theme Ranking Table

| Rank | Theme | Continuity | Expectation | Freshness | Key Catalyst | True Leader | Action Bias |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |

## Why The Top Themes Rank Here

[Explain why the top-ranked themes earned their position and what evidence mattered most.]

## Top Theme Deep Dives

### Theme 1

[Explain the evidence, catalyst, continuity, and risk.]

### Theme 2

[Explain the evidence, catalyst, continuity, and risk.]

### Theme 3

[Explain the evidence, catalyst, continuity, and risk.]

## Integrated Leader Stock Playbook

### Leader 1

- Theme:
- Current price snapshot:
- Why this is the true leader:
- Technical posture:
- Support:
- Resistance:
- Buy-now condition:
- Buy-on-pullback condition:
- Trim or sell condition:
- Invalidation:

### Leader 2

- Theme:
- Current price snapshot:
- Why this is the true leader:
- Technical posture:
- Support:
- Resistance:
- Buy-now condition:
- Buy-on-pullback condition:
- Trim or sell condition:
- Invalidation:

## Rotation And Relay Scenarios

[Explain how capital could rotate within or across themes.]

## Crowded, Fading, And Rejected Themes

[Explain which themes look tired, crowded, or dangerous to chase.]

## Debate Synthesis And Evidence Check

[Summarize the strongest bullish claim, the strongest skeptical challenge, what was verified, and what remains unresolved.]

## Action Matrix

| Theme | Leader | Bias | Entry Idea | Exit Or Trim Idea | Why |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Key Risks And Invalidation Triggers

- 
- 
- 

## Source Log

- 
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create a theme rotation markdown stub.")
    parser.add_argument("--focus", default="Korea", help="Theme-market focus.")
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
